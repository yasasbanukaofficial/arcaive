package tech.yasasbanuka.backend.dto.usage;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import tech.yasasbanuka.backend.entity.constants.QuotaType;
import tech.yasasbanuka.backend.entity.constants.Tier;

import java.util.Map;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsageEventCreateRequestDTO {
    @NotNull(message = "Member ID is required")
    private UUID memberId;

    @NotNull(message = "Event type is required")
    private QuotaType eventType;

    @NotNull(message = "Tier at time is required")
    private Tier tierAtTime;

    private Map<String, Object> metadata;
}
