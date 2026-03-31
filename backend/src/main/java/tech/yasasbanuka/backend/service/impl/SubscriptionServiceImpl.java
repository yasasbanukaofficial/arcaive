package tech.yasasbanuka.backend.service.impl;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.SubscriptionCancelParams;
import com.stripe.param.checkout.SessionCreateParams;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;
import tech.yasasbanuka.backend.dto.member.MemberResponseDTO;
import tech.yasasbanuka.backend.dto.subscription.SubscriptionCreateRequestDTO;
import tech.yasasbanuka.backend.dto.subscription.SubscriptionResponseDTO;
import tech.yasasbanuka.backend.dto.subscription.SubscriptionUpdateRequestDTO;
import tech.yasasbanuka.backend.entity.Member;
import tech.yasasbanuka.backend.entity.Subscription;
import tech.yasasbanuka.backend.entity.constants.SubscriptionStatus;
import tech.yasasbanuka.backend.entity.constants.Tier;
import tech.yasasbanuka.backend.exception.ResourceNotFoundException;
import tech.yasasbanuka.backend.repo.MemberRepo;
import tech.yasasbanuka.backend.repo.SubscriptionRepo;
import tech.yasasbanuka.backend.service.MemberService;
import tech.yasasbanuka.backend.service.QuotaService;
import tech.yasasbanuka.backend.service.SubscriptionService;
import tech.yasasbanuka.backend.service.mapper.SubscriptionMapper;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RequiredArgsConstructor
@Transactional
@Service
@Slf4j
public class SubscriptionServiceImpl implements SubscriptionService {
    @Value("${stripe.secret-key}")
    private String stripeSecretKey;

    @Value("${stripe.strategist-price-id}")
    private String strategistPriceId;

    @Value("${stripe.architect-price-id}")
    private String architectPriceId;

    @Value("${app.base.url}")
    private String baseUrl;
    private final MemberRepo memberRepo;
    private final SubscriptionRepo subscriptionRepo;
    private final SubscriptionMapper subscriptionMapper;
    private final QuotaService quotaService;

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
        log.info("Subscription created successfully with ID: {} for member: {}", response.getId(), dto.getMemberId());
        return response;
    }

    @Override
    public Map<String, String> createCheckout(Tier tier, String memberUsername) {
        Stripe.apiKey = stripeSecretKey;
        String priceId = switch (tier) {
            case STRATEGIST -> strategistPriceId;
            case ARCHITECT  -> architectPriceId;
            default -> throw new IllegalArgumentException("Invalid Tier: " + tier);
        };
        Member member = memberRepo.findByUsername(memberUsername).orElseThrow(() -> new ResourceNotFoundException("Member not found: " + memberUsername));
        try {
            SessionCreateParams params = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.SUBSCRIPTION)
                    .setSuccessUrl(baseUrl + "/subscription/success")
                    .setCancelUrl(baseUrl + "/subscription/cancel")
                    .setCustomerEmail(member.getEmail())
                    .addLineItem(
                            SessionCreateParams.LineItem.builder()
                                    .setQuantity(1L)
                                    .setPrice(priceId)
                                    .build()
                    )
                    .setSubscriptionData(
                            SessionCreateParams.SubscriptionData.builder()
                                    .putMetadata("username", memberUsername)
                                    .putMetadata("tier", tier.name())
                                    .build()
                    )
                    .putMetadata("username", memberUsername)
                    .putMetadata("tier", tier.name())
                    .build();

            Session session = Session.create(params);
            return Map.of("url", session.getUrl());
        } catch (StripeException e) {
            throw new RuntimeException("Stripe checkout failed: " + e.getMessage());
        }
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

    @Override
    public void cancelSubscription(String username) {
        log.info("Reducing tier for the user: {}", username);
        Member member = memberRepo.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("Member not found with username: " + username));
        Subscription sub = member.getSubscription();
        String externalSubId = sub.getExternalSubscriptionId();

        try {
            Stripe.apiKey = stripeSecretKey;
            log.debug("External Subscription ID: {}", externalSubId);
            com.stripe.model.Subscription resource = com.stripe.model.Subscription.retrieve(externalSubId);
            SubscriptionCancelParams params = SubscriptionCancelParams.builder().build();
            com.stripe.model.Subscription subscription = resource.cancel(params);
            cancel(member);
            log.info("Subscription cancelled: {}", subscription.toString());
        } catch (StripeException se) {
            log.error("Error cancelling Stripe subscription {} for user {}: {}", externalSubId, username, se.getMessage(), se);
            throw new RuntimeException("Failed to cancel subscription with Stripe: " + se.getMessage(), se);
        }
    }

    @Override
    public void activate(Member member, Tier tier, String externalSubId) {
        Subscription sub = member.getSubscription();
        Instant now = Instant.now();
        if (sub == null) {
            sub = new Subscription();
            sub.setMember(member);
            member.setSubscription(sub);
        }

        sub.setTier(tier);
        sub.setStatus(SubscriptionStatus.ACTIVE);
        sub.setExternalSubscriptionId(externalSubId);
        sub.setCreatedAt(now);
        sub.setCurrentPeriodStart(now);
        sub.setCurrentPeriodEnd(now.plus(30, ChronoUnit.DAYS));
        sub.setPriceAmount(tier.getPriceInCents());
        sub.setPaymentProvider("stripe");

        memberRepo.save(member);
    }

    @Override
    public void cancel(Member member) {
        Subscription sub = member.getSubscription();
        if (sub == null) {
            sub = new Subscription();
            sub.setMember(member);
            member.setSubscription(sub);
        }

        sub.setCancelledAt(Instant.now());
        sub.setStatus(SubscriptionStatus.CANCELLED);
        sub.setPaymentProvider("None");
        sub.setExternalSubscriptionId(null);
        sub.setPriceAmount(BigDecimal.ZERO);
        sub.setTier(Tier.EXPLORER);
        memberRepo.save(member);
    }
}