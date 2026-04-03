package tech.yasasbanuka.backend.dto.usage;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsageQuotaCreateRequestDTO {
    @NotNull(message = "Member ID is required")
    private UUID memberId;

    @NotNull(message = "Period start is required")
    private Instant periodStart;

    @NotNull(message = "Period end is required")
    private Instant periodEnd;

    private Integer cvAnalysisLimit;
    private Integer jobSearchLimit;
    private Integer jobResultsPerSearch;
    private Integer interviewLimit;
    private Integer autoApplyLimit;
    private Integer cvCreationsLimit;
}
