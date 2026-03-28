package tech.yasasbanuka.backend.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tech.yasasbanuka.backend.entity.Member;
import tech.yasasbanuka.backend.entity.UsageEvent;
import tech.yasasbanuka.backend.entity.constants.QuotaType;

import java.util.List;
import java.util.UUID;

@Repository
public interface UsageEventRepo extends JpaRepository<UsageEvent, UUID> {
    List<UsageEvent> findByMember(Member member);
    List<UsageEvent> findByMemberAndEventType(Member member, QuotaType eventType);
}
