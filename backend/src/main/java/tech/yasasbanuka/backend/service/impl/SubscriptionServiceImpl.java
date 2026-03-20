package tech.yasasbanuka.backend.service.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import tech.yasasbanuka.backend.dto.subscription.SubscriptionCreateRequestDTO;
import tech.yasasbanuka.backend.dto.subscription.SubscriptionResponseDTO;
import tech.yasasbanuka.backend.dto.subscription.SubscriptionUpdateRequestDTO;
import tech.yasasbanuka.backend.entity.Member;
import tech.yasasbanuka.backend.entity.Subscription;
import tech.yasasbanuka.backend.exception.ResourceNotFoundException;
import tech.yasasbanuka.backend.repo.MemberRepo;
import tech.yasasbanuka.backend.repo.SubscriptionRepo;
import tech.yasasbanuka.backend.service.SubscriptionService;
import tech.yasasbanuka.backend.service.mapper.SubscriptionMapper;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@Transactional
@Service
@Slf4j
public class SubscriptionServiceImpl implements SubscriptionService {
    private final MemberRepo memberRepo;
    private final SubscriptionRepo subscriptionRepo;
    private final SubscriptionMapper subscriptionMapper;

    @Override
    public SubscriptionResponseDTO createSubscription(SubscriptionCreateRequestDTO dto) {
        log.info("Creating subscription for member ID: {}", dto.getMemberId());
        Member existingMember = memberRepo.findById(dto.getMemberId())
                .orElseThrow(() -> {
                    log.error("Subscription creation failed: Member ID {} not found", dto.getMemberId());
                    return new ResourceNotFoundException("Member not found. Please ensure the account exists before creating a subscription.");
                });
        Subscription entity = subscriptionMapper.createRequestToEntity(dto);
        existingMember.setSubscription(entity);
        entity.setMember(existingMember);
        SubscriptionResponseDTO response = subscriptionMapper.toResponseDTO(subscriptionRepo.save(entity));
        log.info("Subscription created successfully with ID: {} for member: {}", response.getSubscriptionId(), dto.getMemberId());
        return response;
    }

    @Override
    public SubscriptionResponseDTO updateSubscription(UUID subscriptionId, SubscriptionUpdateRequestDTO dto) {
        log.info("Updating subscription with ID: {}", subscriptionId);
        Subscription existingSubscription = subscriptionRepo.findById(subscriptionId)
                .orElseThrow(() -> {
                    log.error("Subscription update failed: ID {} not found", subscriptionId);
                    return new ResourceNotFoundException("Subscription not found. It may have been cancelled or removed.");
                });
        if (dto.getMemberId() != null) {
            log.info("Moving subscription {} to new member ID: {}", subscriptionId, dto.getMemberId());
            Member existingMember = memberRepo.findById(dto.getMemberId())
                    .orElseThrow(() -> {
                        log.error("Subscription update failed: New member ID {} not found", dto.getMemberId());
                        return new ResourceNotFoundException("Member not found. Please ensure the account exists.");
                    });
            existingMember.setSubscription(existingSubscription);
            existingSubscription.setMember(existingMember);
            memberRepo.save(existingMember);
        }
        subscriptionMapper.updateRequestToEntity(dto, existingSubscription);
        SubscriptionResponseDTO response = subscriptionMapper.toResponseDTO(subscriptionRepo.save(existingSubscription));
        log.info("Subscription {} updated successfully", subscriptionId);
        return response;
    }

    @Override
    public void deleteSubscription(UUID subscriptionId) {
        log.info("Deleting subscription with ID: {}", subscriptionId);
        subscriptionRepo.findById(subscriptionId)
                .orElseThrow(() -> {
                    log.error("Subscription deletion failed: ID {} not found", subscriptionId);
                    return new ResourceNotFoundException("Subscription not found. It may have already been cancelled.");
                });
        subscriptionRepo.deleteById(subscriptionId);
        log.info("Subscription {} deleted successfully", subscriptionId);
    }

    @Override
    public SubscriptionResponseDTO getSubscription(UUID subscriptionId) {
        log.debug("Fetching subscription with ID: {}", subscriptionId);
        return subscriptionMapper.toResponseDTO(subscriptionRepo.findById(subscriptionId)
                .orElseThrow(() -> {
                    log.error("Subscription fetch failed: ID {} not found", subscriptionId);
                    return new ResourceNotFoundException("Subscription not found. Please check the ID and try again.");
                }));
    }

    @Override
    public List<SubscriptionResponseDTO> getAllSubscriptions() {
        log.debug("Fetching all subscriptions");
        return subscriptionRepo.findAll().stream().map(subscriptionMapper::toResponseDTO).toList();
    }
}