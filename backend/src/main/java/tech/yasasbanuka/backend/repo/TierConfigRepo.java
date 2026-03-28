package tech.yasasbanuka.backend.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tech.yasasbanuka.backend.entity.TierConfig;
import tech.yasasbanuka.backend.entity.constants.Tier;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TierConfigRepo extends JpaRepository<TierConfig, UUID> {
    Optional<TierConfig> findByTier(Tier tier);
    Optional<TierConfig> findByTierAndIsActiveTrue(Tier tier);
}
