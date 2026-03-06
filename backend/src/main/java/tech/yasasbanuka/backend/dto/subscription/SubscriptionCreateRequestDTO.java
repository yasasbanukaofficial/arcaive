package tech.yasasbanuka.backend.dto.subscription;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class SubscriptionCreateRequestDTO {
    @NotBlank(message = "Provider ID is required for synchronization")
    @Size(max = 100, message = "Provider ID cannot exceed 100 characters")
    private String providerId;

    @NotBlank(message = "Subscription status must be defined")
    @Pattern(regexp = "^(active|on_trial|cancelled|past_due|unpaid|expired)$",
            message = "Invalid subscription status")
    private String subscriptionStatus;

    @NotBlank(message = "Variant ID is required to identify the plan")
    @Size(max = 100, message = "Variant ID cannot exceed 100 characters")
    private String variantId;

    @NotNull(message = "Renewal date must be provided")
    private Instant renewsAt;

    @NotNull(message = "Subscription end date must be provided")
    private Instant endsAt;

    @NotNull(message = "Member reference is required")
    private UUID memberId;
}
