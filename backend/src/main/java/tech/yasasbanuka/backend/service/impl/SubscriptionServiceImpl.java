package tech.yasasbanuka.backend.service.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tech.yasasbanuka.backend.dto.SubscriptionDTO;
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
    public SubscriptionDTO createSubscription(SubscriptionDTO subscriptionDTO) {
        Member existingMember = memberRepo.findById(subscriptionDTO.getMemberId()).orElseThrow(() -> new ResourceNotFoundException("Member not found"));
        Subscription subscriptionAsEntity = subscriptionMapper.toEntity(subscriptionDTO);

        existingMember.setSubscription(subscriptionAsEntity);
        subscriptionAsEntity.setMember(existingMember);

        return subscriptionMapper.toDto(subscriptionRepo.save(subscriptionAsEntity));
    }

    @Override
    public SubscriptionDTO updateSubscription(SubscriptionDTO subscriptionDTO) {
        Subscription existingSubscription = subscriptionRepo.findById(subscriptionDTO.getSubscriptionId()).orElseThrow(() -> new ResourceNotFoundException("Subscription not found"));
        Member existingMember = memberRepo.findById(subscriptionDTO.getMemberId()).orElseThrow(() -> new ResourceNotFoundException("Member not found"));

        existingMember.setSubscription(existingSubscription);
        existingSubscription.setMember(existingMember);

        subscriptionMapper.updateSubscription(subscriptionDTO, existingSubscription);
        memberRepo.save(existingMember);

        return subscriptionMapper.toDto(subscriptionRepo.save(existingSubscription));
    }

    @Override
    public void deleteSubscription(UUID subscriptionId) {
        Subscription existingSubscription = subscriptionRepo.findById(subscriptionId).orElseThrow(() -> new ResourceNotFoundException("Subscription not found"));
        if(memberRepo.existsById(existingSubscription.getMember().getId())) {
            throw new ResourceNotFoundException("Member Not found");
        }
        subscriptionRepo.deleteById(existingSubscription.getId());
    }

    @Override
    public SubscriptionDTO getSubscription(UUID subscriptionId) {
        return subscriptionMapper.toDto(subscriptionRepo.findById(subscriptionId).orElseThrow(() -> new ResourceNotFoundException("Subscription not found")));
    }

    @Override
    public List<SubscriptionDTO> getAllSubscriptions() {
        return subscriptionRepo.findAll().stream().map(subscriptionMapper::toDto).toList();
    }
}