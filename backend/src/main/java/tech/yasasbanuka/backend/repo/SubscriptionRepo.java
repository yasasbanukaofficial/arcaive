package tech.yasasbanuka.backend.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import tech.yasasbanuka.backend.entity.Subscription;

import java.util.UUID;

public interface SubscriptionRepo extends JpaRepository<Subscription, UUID> {
}
