package tech.yasasbanuka.backend.dto.subscription;

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
public class SubscriptionResponseDTO {
    private UUID id;
    private UUID memberId;
    private Tier tier;
    private SubscriptionStatus status;
    private BillingCycle billingCycle;
    private BigDecimal priceAmount;
    private String currency;
    private Instant startedAt;
    private Instant currentPeriodStart;
    private Instant currentPeriodEnd;
    private Instant cancelledAt;
    private String paymentProvider;
    private String externalSubscriptionId;
    private Instant createdAt;
    private Instant updatedAt;
}
