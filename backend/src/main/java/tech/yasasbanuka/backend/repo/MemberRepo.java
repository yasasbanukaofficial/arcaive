package tech.yasasbanuka.backend.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tech.yasasbanuka.backend.dto.member.MemberResponseDTO;
import tech.yasasbanuka.backend.entity.Member;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface MemberRepo extends JpaRepository<Member, UUID> {
    boolean existsByEmail(String email);
    Optional<Member> findByUsername(String username);
    Optional<Member> findByEmail(String email);
    MemberResponseDTO getMemberByUsername(String username);

    @Query("SELECT m FROM member m WHERE m.subscription.externalSubscriptionId = :externalSubId")
    Optional<Member> findByExternalSubscriptionId(@Param("externalSubId") String externalSubId);

    Member getMemberById(UUID id);
}
