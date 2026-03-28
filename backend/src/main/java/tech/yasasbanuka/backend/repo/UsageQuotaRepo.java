package tech.yasasbanuka.backend.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tech.yasasbanuka.backend.entity.Member;
import tech.yasasbanuka.backend.entity.UsageQuota;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UsageQuotaRepo extends JpaRepository<UsageQuota, UUID> {

    @Query("SELECT q FROM UsageQuota q WHERE q.member.id = :memberId AND q.periodStart <= :now AND q.periodEnd > :now")
    Optional<UsageQuota> findCurrentPeriod(@Param("memberId") UUID memberId, @Param("now") Instant now);
}
