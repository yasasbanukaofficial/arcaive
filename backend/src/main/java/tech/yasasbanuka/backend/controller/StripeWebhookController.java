package tech.yasasbanuka.backend.controller;

import com.stripe.Stripe;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.Invoice;
import com.stripe.model.Subscription;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.yasasbanuka.backend.entity.Member;
import tech.yasasbanuka.backend.entity.constants.Tier;
import tech.yasasbanuka.backend.repo.MemberRepo;
import tech.yasasbanuka.backend.service.QuotaService;
import tech.yasasbanuka.backend.service.SubscriptionService;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/webhooks")
public class StripeWebhookController {
    @Value("${stripe.webhooke.secret}")
    private String stripeWebhookSecret;

    @Value("${stripe.api.key}")
    private String stripeAPIKey;

    private final MemberRepo memberRepo;
    private final SubscriptionService subscriptionService;
    private final QuotaService quotaService;

    @PostMapping("/webhook")
    public ResponseEntity<Void> handleWebhook (
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader
    ) {
        Stripe.apiKey = stripeAPIKey;
        Event event;
        try {
            event = Webhook.constructEvent(payload, sigHeader, stripeWebhookSecret);
        } catch (SignatureVerificationException e) {
            throw new RuntimeException(e);
        }

        switch (event.getType()) {
            case "checkout.session.completed" -> {
                Session session = (Session) event.getDataObjectDeserializer().getObject().orElseThrow();

                String username = session.getMetadata().get("username");
                String tierName = session.getMetadata().get("tier");
                String subscriptionId = session.getSubscription();

                Member member = memberRepo.findByUsername(username).orElseThrow();
                subscriptionService.activate(member, Tier.valueOf(tierName), subscriptionId);
                quotaService.resetQuota(member);
            }
            case "invoice.paid" -> {
                Invoice invoice = (Invoice) event.getDataObjectDeserializer()
                        .getObject().orElseThrow();
                String memberMail = invoice.getCustomerEmail();
                Member member = memberRepo.findByEmail(memberMail).orElseThrow();
                quotaService.resetQuota(member);
            }
            case "customer.subscription.deleted" -> {
                Subscription subscription = (Subscription) event.getDataObjectDeserializer()
                        .getObject().orElseThrow();
                Member member = memberRepo.findBySubscriptionId(UUID.fromString(subscription.getId()));

                subscriptionService.cancel(member);
                quotaService.downgradeToExplorer(member);
            }
        }
        return ResponseEntity.ok().build();
    }
}
