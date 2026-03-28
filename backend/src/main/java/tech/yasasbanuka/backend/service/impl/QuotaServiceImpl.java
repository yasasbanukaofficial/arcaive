package tech.yasasbanuka.backend.service.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tech.yasasbanuka.backend.entity.UsageQuota;
import tech.yasasbanuka.backend.entity.constants.QuotaType;
import tech.yasasbanuka.backend.exception.QuotaExceededException;
import tech.yasasbanuka.backend.repo.UsageQuotaRepo;
import tech.yasasbanuka.backend.service.QuotaService;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class QuotaServiceImpl implements QuotaService {
    private final UsageQuotaRepo usageQuotaRepo;

    @Override
    public void checkAndConsume(UUID memberId, QuotaType type) {
        UsageQuota quota = usageQuotaRepo.findCurrentPeriod(memberId, Instant.now())
                .orElseThrow(() -> new IllegalStateException("No active quota found for member: " + memberId));

        if (type.isExceeded(quota)) {
            throw new QuotaExceededException(
                    "You've reached your monthly limit for " + type.name().replace("_", " ").toLowerCase() + ". Upgrade to continue."
            );
        }

        type.increment(quota);
        usageQuotaRepo.save(quota);
    }


}