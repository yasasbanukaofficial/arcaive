package tech.yasasbanuka.backend.dto.usage;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import tech.yasasbanuka.backend.entity.constants.QuotaType;
import tech.yasasbanuka.backend.entity.constants.Tier;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsageEventResponseDTO {
    private UUID id;
    private UUID memberId;
    private QuotaType eventType;
    private Tier tierAtTime;
    private Map<String, Object> metadata;
    private Instant createdAt;
}
