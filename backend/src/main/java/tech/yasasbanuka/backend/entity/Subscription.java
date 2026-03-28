package tech.yasasbanuka.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import tech.yasasbanuka.backend.entity.constants.BillingCycle;
import tech.yasasbanuka.backend.entity.constants.SubscriptionStatus;
import tech.yasasbanuka.backend.entity.constants.Tier;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
public class Subscription {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Tier tier = Tier.EXPLORER;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private SubscriptionStatus status = SubscriptionStatus.ACTIVE;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private BillingCycle billingCycle = BillingCycle.MONTHLY;

    @Builder.Default
    private BigDecimal priceAmount = BigDecimal.ZERO;

    @Column(length = 3)
    @Builder.Default
    private String currency = "USD";

    private Instant startedAt;
    private Instant currentPeriodStart;
    private Instant currentPeriodEnd;
    private Instant cancelledAt;

    private String paymentProvider;
    private String externalSubscriptionId;

    @CreationTimestamp
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;
}