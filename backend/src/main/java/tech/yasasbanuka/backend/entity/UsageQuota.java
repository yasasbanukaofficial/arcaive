package tech.yasasbanuka.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
public class UsageQuota {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    private Instant periodStart;
    private Instant periodEnd;

    private Integer cvAnalysisUsed;
    @Builder.Default
    private Integer cvAnalysisLimit = 3;

    private Integer jobSearchUsed;
    @Builder.Default
    private Integer jobSearchLimit = 1;
    @Builder.Default
    private Integer jobResultsPerSearch = 5;

    private Integer interviewUsed;
    @Builder.Default
    private Integer interviewLimit = 1;

    private Integer autoApplyUsed;
    @Builder.Default
    private Integer autoApplyLimit = 0;

    private Integer cvVersionsStored;
    @Builder.Default
    private Integer cvVersionsLimit = 1;

    @CreationTimestamp
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;
}