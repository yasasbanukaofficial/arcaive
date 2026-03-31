package tech.yasasbanuka.backend.controller;

import com.stripe.Stripe;
import com.stripe.exception.EventDataObjectDeserializationException;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.Invoice;
import com.stripe.model.StripeObject;
import com.stripe.model.Subscription;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.yasasbanuka.backend.entity.constants.Tier;
import tech.yasasbanuka.backend.repo.MemberRepo;
import tech.yasasbanuka.backend.service.QuotaService;
import tech.yasasbanuka.backend.service.SubscriptionService;

import jakarta.annotation.PostConstruct;

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

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeAPIKey;
    }

    @PostMapping("/stripe")
    public ResponseEntity<Void> handleWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader
    ) throws EventDataObjectDeserializationException {
        Event event;
        try {
            event = Webhook.constructEvent(payload, sigHeader, stripeWebhookSecret);
        } catch (SignatureVerificationException e) {
            log.error("Webhook signature verification failed: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }

        EventDataObjectDeserializer dataObjectDeserializer = event.getDataObjectDeserializer();
        StripeObject stripeObject;

        if (dataObjectDeserializer.getObject().isPresent()) {
            stripeObject = dataObjectDeserializer.getObject().get();
        } else {
            log.warn("API Version mismatch detected for event {}. Forcing deserialization.", event.getId());
            stripeObject = dataObjectDeserializer.deserializeUnsafe();
        }

        if (stripeObject == null) {
            log.error("Failed to deserialize Stripe object for event type: {}", event.getType());
            return ResponseEntity.ok().build();
        }

        switch (event.getType()) {
            case "checkout.session.completed" -> {
                if (stripeObject instanceof Session session) {
                    handleCheckoutSession(session);
                }
            }
            case "customer.subscription.deleted" -> {
                if (stripeObject instanceof Subscription subscription) {
                    handleSubscriptionDeleted(subscription);
                }
            }
            default -> log.debug("Received unhandled event type: {}", event.getType());
        }

        return ResponseEntity.ok().build();
    }

    private void handleCheckoutSession(Session session) {
        String username = session.getMetadata().get("username");
        String tierName = session.getMetadata().get("tier");
        log.debug("Tier Name: {}", tierName);
        String subscriptionId = session.getSubscription();

        log.info("Processing checkout.session.completed for user: {} with tier: {}", username, tierName);

        if (username == null || tierName == null) {
            log.error("CRITICAL: Missing metadata in Stripe Session {}. Update not performed.", session.getId());
            return;
        }

        memberRepo.findByUsername(username).ifPresentOrElse(member -> {
            try {
                subscriptionService.activate(member, Tier.valueOf(tierName), subscriptionId);
                log.info("Successfully activated subscription for user: {}", username);
            } catch (Exception e) {
                log.error("Error activating subscription for user {}: {}", username, e.getMessage());
            }
        }, () -> log.error("User not found in database: {}", username));
    }

    private void handleSubscriptionDeleted(Subscription subscription) {
        memberRepo.findByExternalSubscriptionId(subscription.getId()).ifPresentOrElse(member -> {
                    subscriptionService.cancel(member, true);
                    quotaService.downgradeToExplorer(member);
                    log.info("Subscription cancelled via webhook for user: {}", member.getUsername());
                },
                () -> log.info("Webhook customer.subscription.deleted: no member found for sub {}, " +
                        "likely already cancelled manually.", subscription.getId())
        );
    }
}