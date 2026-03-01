package tech.yasasbanuka.backend.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tech.yasasbanuka.backend.entity.Member;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface MemberRepo extends JpaRepository<Member, UUID> {
    boolean existsByEmail(String email);
    Optional<Member> findByUsername(String username);
    Optional<Member> findByEmail(String email);
}
