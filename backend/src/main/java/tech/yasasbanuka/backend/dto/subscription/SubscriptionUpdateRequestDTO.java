package tech.yasasbanuka.backend.dto.subscription;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
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
public class SubscriptionUpdateRequestDTO {
    @Nullable
    @Size(max = 100, message = "Provider ID cannot exceed 100 characters")
    private String providerId;

    @Nullable
    @Pattern(regexp = "^(active|on_trial|cancelled|past_due|unpaid|expired)$",
            message = "Invalid subscription status")
    private String subscriptionStatus;

    @Nullable
    @Size(max = 100, message = "Variant ID cannot exceed 100 characters")
    private String variantId;

    @Nullable
    private Instant renewsAt;

    @Nullable
    private Instant endsAt;

    @Nullable
    private UUID memberId;

    @Nullable
    private String stripeCustomerId;
}
