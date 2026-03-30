package tech.yasasbanuka.backend.dto.tier;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import tech.yasasbanuka.backend.entity.constants.Tier;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TierConfigCreateRequestDTO {
    @NotNull(message = "Tier is required")
    private Tier tier;

    @NotNull(message = "CV analysis limit is required")
    private Integer cvAnalysisLimit;

    @NotNull(message = "Job search limit is required")
    private Integer jobSearchLimit;

    @NotNull(message = "Job results per search is required")
    private Integer jobResultsPerSearch;

    @NotNull(message = "Interview limit is required")
    private Integer interviewLimit;

    @NotNull(message = "Auto apply limit is required")
    private Integer autoApplyLimit;

    @NotNull(message = "CV versions limit is required")
    private Integer cvVersionsLimit;

    @NotNull(message = "Monthly price is required")
    private BigDecimal priceMonthly;

    private Boolean isActive;
}
