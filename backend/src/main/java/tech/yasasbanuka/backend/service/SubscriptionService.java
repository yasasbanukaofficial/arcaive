package tech.yasasbanuka.backend.service;

import tech.yasasbanuka.backend.dto.SubscriptionDTO;

import java.util.List;
import java.util.UUID;

public interface SubscriptionService {
    SubscriptionDTO createSubscription(SubscriptionDTO subscriptionDTO);
    SubscriptionDTO updateSubscription(SubscriptionDTO subscriptionDTO);
    void deleteSubscription(UUID subscriptionId);
    SubscriptionDTO getSubscription(UUID subscriptionId);
    List<SubscriptionDTO> getAllSubscriptions();
}
