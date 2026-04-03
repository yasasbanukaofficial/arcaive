package tech.yasasbanuka.backend.dto.tier;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import tech.yasasbanuka.backend.entity.constants.Tier;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TierConfigResponseDTO {
    private UUID id;
    private Tier tier;
    private Integer cvAnalysisLimit;
    private Integer jobSearchLimit;
    private Integer jobResultsPerSearch;
    private Integer interviewLimit;
    private Integer autoApplyLimit;
    private Integer cvCreationsLimit;
    private BigDecimal priceMonthly;
    private Boolean isActive;
    private Instant updatedAt;
}
