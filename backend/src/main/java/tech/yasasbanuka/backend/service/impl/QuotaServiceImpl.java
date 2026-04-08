package tech.yasasbanuka.backend.service.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import tech.yasasbanuka.backend.entity.Member;
import tech.yasasbanuka.backend.entity.Subscription;
import tech.yasasbanuka.backend.entity.UsageQuota;
import tech.yasasbanuka.backend.entity.constants.QuotaType;
import tech.yasasbanuka.backend.entity.constants.Tier;
import tech.yasasbanuka.backend.entity.constants.TierLimits;
import tech.yasasbanuka.backend.exception.QuotaExceededException;
import tech.yasasbanuka.backend.repo.MemberRepo;
import tech.yasasbanuka.backend.repo.UsageQuotaRepo;
import tech.yasasbanuka.backend.service.QuotaService;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class QuotaServiceImpl implements QuotaService {
    private final UsageQuotaRepo usageQuotaRepo;
    private final MemberRepo memberRepo;

    @Override
    public void checkAndConsume(UUID memberId, QuotaType type) {
        Member member = memberRepo.getMemberById(memberId);
        UsageQuota quota = member.getUsageQuota();

        if (type.isExceeded(quota)) {
            throw new QuotaExceededException(
                    "You've reached your monthly limit for " + type.name().replace("_", " ").toLowerCase() + ". Upgrade to continue."
            );
        }

        type.increment(quota);
        usageQuotaRepo.save(quota);
    }

    @Override
    public void resetQuota(Member member) {
        UsageQuota quota = member.getUsageQuota();
        Tier tier = member.getSubscription().getTier();
        log.info("Tier Details: {}", tier.name());
        System.out.println(tier);

        quota.setCvAnalysisUsed(0);
        quota.setJobSearchUsed(0);
        quota.setInterviewUsed(0);
        quota.setAutoApplyUsed(0);
        quota.setCvCreationsLimit(0);

        TierLimits.of(tier).applyTo(quota);

        Instant newStart = quota.getPeriodEnd();
        quota.setPeriodStart(newStart);
        quota.setPeriodEnd(newStart.plus(30, ChronoUnit.DAYS));

        usageQuotaRepo.save(quota);
    }

    @Override
    public void downgradeToExplorer(Member member) {
        UsageQuota quota = member.getUsageQuota();
        TierLimits.of(Tier.EXPLORER).applyTo(quota);
        usageQuotaRepo.save(quota);
    }

    @Override
    public void downgradeTier(Tier downgradeTier, Member member) {
        UsageQuota quota = member.getUsageQuota();
        TierLimits.of(downgradeTier).applyTo(quota);
        usageQuotaRepo.save(quota);
    }
}