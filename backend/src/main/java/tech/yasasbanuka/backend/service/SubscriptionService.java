package tech.yasasbanuka.backend.service;

import com.stripe.exception.StripeException;
import org.springframework.security.core.Authentication;
import tech.yasasbanuka.backend.dto.subscription.SubscriptionCreateRequestDTO;
import tech.yasasbanuka.backend.dto.subscription.SubscriptionResponseDTO;
import tech.yasasbanuka.backend.dto.subscription.SubscriptionUpdateRequestDTO;
import tech.yasasbanuka.backend.entity.Member;
import tech.yasasbanuka.backend.entity.constants.Tier;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface SubscriptionService {
    SubscriptionResponseDTO createSubscription(SubscriptionCreateRequestDTO dto);
    Map<String, String> createCheckout(Tier tier, String username);
    SubscriptionResponseDTO updateSubscription(UUID subscriptionId, SubscriptionUpdateRequestDTO dto);
    void deleteSubscription(UUID subscriptionId);
    SubscriptionResponseDTO getSubscription(UUID subscriptionId);
    List<SubscriptionResponseDTO> getAllSubscriptions();
    void cancelSubscription(String username);

    void activate(Member member, Tier tier, String externalSubId, String stripeCustomerId);
    void cancel(Member member, boolean isManual);
}
