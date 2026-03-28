package tech.yasasbanuka.backend.service.scheduler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import tech.yasasbanuka.backend.entity.UsageQuota;
import tech.yasasbanuka.backend.repo.UsageQuotaRepo;
import tech.yasasbanuka.backend.service.QuotaService;

import java.time.Instant;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class QuotaRefillScheduler {
    private final UsageQuotaRepo usageQuotaRepo;
    private final QuotaService quotaService;

    @Scheduled(cron = "0 0 0 * * *")
    public void refillExpiredQuotas() {
        Instant now = Instant.now();
        List<UsageQuota> expired = usageQuotaRepo.findAllByPeriodEndBefore(now);
        
        log.info("Found {} expired quotas to refill", expired.size());
        
        expired.forEach(quota -> {
            quotaService.resetQuota(quota.getMember());
            log.info("Quota refilled for member: {}", quota.getMember().getId());
        });
    }
}
