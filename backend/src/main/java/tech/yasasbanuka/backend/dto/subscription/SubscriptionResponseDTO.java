package tech.yasasbanuka.backend.dto.subscription;

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
public class SubscriptionResponseDTO {
    private UUID subscriptionId;
    private String providerId;
    private String subscriptionStatus;
    private String variantId;
    private Instant renewsAt;
    private Instant endsAt;
    private UUID memberId;
}
