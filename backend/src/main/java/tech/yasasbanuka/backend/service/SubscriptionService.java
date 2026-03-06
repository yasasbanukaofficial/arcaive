package tech.yasasbanuka.backend.service;

import tech.yasasbanuka.backend.dto.subscription.SubscriptionCreateRequestDTO;
import tech.yasasbanuka.backend.dto.subscription.SubscriptionResponseDTO;
import tech.yasasbanuka.backend.dto.subscription.SubscriptionUpdateRequestDTO;

import java.util.List;
import java.util.UUID;

public interface SubscriptionService {
    SubscriptionResponseDTO createSubscription(SubscriptionCreateRequestDTO dto);
    SubscriptionResponseDTO updateSubscription(UUID subscriptionId, SubscriptionUpdateRequestDTO dto);
    void deleteSubscription(UUID subscriptionId);
    SubscriptionResponseDTO getSubscription(UUID subscriptionId);
    List<SubscriptionResponseDTO> getAllSubscriptions();
}
