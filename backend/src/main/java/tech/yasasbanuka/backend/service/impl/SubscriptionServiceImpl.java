package tech.yasasbanuka.backend.service.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
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
public class SubscriptionServiceImpl implements SubscriptionService {
    private final MemberRepo memberRepo;
    private final SubscriptionRepo subscriptionRepo;
    private final SubscriptionMapper subscriptionMapper;

    @Override
    public SubscriptionResponseDTO createSubscription(SubscriptionCreateRequestDTO dto) {
        Member existingMember = memberRepo.findById(dto.getMemberId())
                .orElseThrow(() -> new ResourceNotFoundException("Member not found. Please ensure the account exists before creating a subscription."));
        Subscription entity = subscriptionMapper.createRequestToEntity(dto);
        existingMember.setSubscription(entity);
        entity.setMember(existingMember);
        return subscriptionMapper.toResponseDTO(subscriptionRepo.save(entity));
    }

    @Override
    public SubscriptionResponseDTO updateSubscription(UUID subscriptionId, SubscriptionUpdateRequestDTO dto) {
        Subscription existingSubscription = subscriptionRepo.findById(subscriptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found. It may have been cancelled or removed."));
        if (dto.getMemberId() != null) {
            Member existingMember = memberRepo.findById(dto.getMemberId())
                    .orElseThrow(() -> new ResourceNotFoundException("Member not found. Please ensure the account exists."));
            existingMember.setSubscription(existingSubscription);
            existingSubscription.setMember(existingMember);
            memberRepo.save(existingMember);
        }
        subscriptionMapper.updateRequestToEntity(dto, existingSubscription);
        return subscriptionMapper.toResponseDTO(subscriptionRepo.save(existingSubscription));
    }

    @Override
    public void deleteSubscription(UUID subscriptionId) {
        subscriptionRepo.findById(subscriptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found. It may have already been cancelled."));
        subscriptionRepo.deleteById(subscriptionId);
    }

    @Override
    public SubscriptionResponseDTO getSubscription(UUID subscriptionId) {
        return subscriptionMapper.toResponseDTO(subscriptionRepo.findById(subscriptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found. Please check the ID and try again.")));
    }

    @Override
    public List<SubscriptionResponseDTO> getAllSubscriptions() {
        return subscriptionRepo.findAll().stream().map(subscriptionMapper::toResponseDTO).toList();
    }
}