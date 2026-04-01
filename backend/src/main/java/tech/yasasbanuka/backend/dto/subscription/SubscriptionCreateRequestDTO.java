package tech.yasasbanuka.backend.dto.subscription;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import tech.yasasbanuka.backend.entity.constants.BillingCycle;
import tech.yasasbanuka.backend.entity.constants.SubscriptionStatus;
import tech.yasasbanuka.backend.entity.constants.Tier;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionCreateRequestDTO {
    @NotNull(message = "Member ID is required")
    private UUID memberId;

    @NotNull(message = "Tier is required")
    private Tier tier;

    @NotNull(message = "Status is required")
    private SubscriptionStatus status;

    @NotNull(message = "Billing cycle is required")
    private BillingCycle billingCycle;

    private BigDecimal priceAmount;
    private String currency;

    @NotNull(message = "Start date is required")
    private Instant startedAt;

    private Instant currentPeriodStart;
    private Instant currentPeriodEnd;
    private String paymentProvider;
    private String externalSubscriptionId;
    private String stripeCustomerId;
}
