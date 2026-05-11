package tech.yasasbanuka.backend.repo;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
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

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT m FROM member m WHERE m.email = :email")
    Optional<Member> findByEmailWithLock(@Param("email") String email);

    @Query("select m from member m left join fetch m.linkedAccounts where m.email = :email")
    Optional<Member> findByEmailWithLinkedAccounts(@Param("email") String email);

    MemberResponseDTO getMemberByUsername(String username);

    @Query("SELECT m FROM member m WHERE m.subscription.externalSubscriptionId = :externalSubId")
    Optional<Member> findByExternalSubscriptionId(@Param("externalSubId") String externalSubId);

    Member getMemberById(UUID id);
}
