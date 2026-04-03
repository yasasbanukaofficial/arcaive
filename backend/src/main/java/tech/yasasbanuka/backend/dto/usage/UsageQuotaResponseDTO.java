package tech.yasasbanuka.backend.dto.usage;

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
public class UsageQuotaResponseDTO {
    private UUID id;
    private UUID memberId;
    private Instant periodStart;
    private Instant periodEnd;
    private Integer cvAnalysisUsed;
    private Integer cvAnalysisLimit;
    private Integer jobSearchUsed;
    private Integer jobSearchLimit;
    private Integer jobResultsPerSearch;
    private Integer interviewUsed;
    private Integer interviewLimit;
    private Integer autoApplyUsed;
    private Integer autoApplyLimit;
    private Integer cvCreationsStored;
    private Integer cvCreationsLimit;
    private Instant createdAt;
    private Instant updatedAt;
}
