package tech.yasasbanuka.backend.controller;

import com.stripe.Stripe;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.Invoice;
import com.stripe.model.Subscription;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.yasasbanuka.backend.entity.Member;
import tech.yasasbanuka.backend.entity.constants.Tier;
import tech.yasasbanuka.backend.repo.MemberRepo;
import tech.yasasbanuka.backend.service.QuotaService;
import tech.yasasbanuka.backend.service.SubscriptionService;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/webhooks")
public class StripeWebhookController {
    @Value("${stripe.webhook.secret}")
    private String stripeWebhookSecret;

    @Value("${stripe.api.key}")
    private String stripeAPIKey;

    private final MemberRepo memberRepo;
    private final SubscriptionService subscriptionService;
    private final QuotaService quotaService;

    @PostMapping("/stripe")
    public ResponseEntity<Void> handleWebhook (
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader
    ) {
        Stripe.apiKey = stripeAPIKey;
        Event event;
        try {
            event = Webhook.constructEvent(payload, sigHeader, stripeWebhookSecret);
        } catch (SignatureVerificationException e) {
            return ResponseEntity.badRequest().build();
        }

        switch (event.getType()) {
            case "invoice.paid" -> {
                Invoice invoice = (Invoice) event.getDataObjectDeserializer()
                        .getObject().orElse(null);

                if (invoice == null || invoice.getCustomerEmail() == null) {
                    log.warn("invoice.paid received with no customer email — skipping");
                    break;
                }

                memberRepo.findByEmail(invoice.getCustomerEmail())
                        .ifPresent(quotaService::resetQuota);
            }
            case "checkout.session.completed" -> {
                Session session = (Session) event.getDataObjectDeserializer()
                        .getObject().orElse(null);

                if (session == null) {
                    log.warn("checkout.session.completed received with no session — skipping");
                    break;
                }

                String username = session.getMetadata().get("username");
                String tierName = session.getMetadata().get("tier");
                String subscriptionId = session.getSubscription();

                if (username == null || tierName == null) {
                    log.warn("Missing metadata in checkout session — skipping");
                    break;
                }

                memberRepo.findByUsername(username).ifPresent(member -> {
                    subscriptionService.activate(member, Tier.valueOf(tierName), subscriptionId);
                    quotaService.resetQuota(member);
                });
            }
            case "customer.subscription.deleted" -> {
                Subscription subscription = (Subscription) event.getDataObjectDeserializer()
                        .getObject().orElseThrow();
                Member member = memberRepo.findByExternalSubscriptionId(subscription.getId()).orElseThrow();
                subscriptionService.cancel(member);
                quotaService.downgradeToExplorer(member);
            }
        }
        return ResponseEntity.ok().build();
    }
}
