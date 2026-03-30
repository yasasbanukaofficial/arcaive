package tech.yasasbanuka.backend.service;

import tech.yasasbanuka.backend.entity.Member;
import tech.yasasbanuka.backend.entity.UsageQuota;
import tech.yasasbanuka.backend.entity.constants.QuotaType;

import java.util.UUID;

public interface QuotaService {
    void checkAndConsume(UUID memberId, QuotaType type);
    void resetQuota(Member member);

    void downgradeToExplorer(Member member);
}
