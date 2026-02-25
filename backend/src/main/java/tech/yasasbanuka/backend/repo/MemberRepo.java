package tech.yasasbanuka.backend.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import tech.yasasbanuka.backend.entity.Member;

import java.util.UUID;

public interface MemberRepo extends JpaRepository<Member, UUID> {
    boolean existsByEmail(String email);
}
