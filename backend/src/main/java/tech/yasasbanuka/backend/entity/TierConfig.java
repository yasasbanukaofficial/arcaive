package tech.yasasbanuka.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;
import tech.yasasbanuka.backend.entity.constants.Tier;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Getter @Setter @Builder
@Entity
public class TierConfig {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(unique = true)
    private Tier tier;

    private Integer cvAnalysisLimit;
    private Integer jobSearchLimit;
    private Integer jobResultsPerSearch;
    private Integer interviewLimit;
    private Integer autoApplyLimit;
    private Integer cvVersionsLimit;

    private BigDecimal priceMonthly;

    private Boolean isActive;

    @UpdateTimestamp
    private Instant updatedAt;
}
