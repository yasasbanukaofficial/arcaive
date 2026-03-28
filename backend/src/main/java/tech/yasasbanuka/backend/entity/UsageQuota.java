package tech.yasasbanuka.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Getter @Setter @Builder
@Entity
public class UsageQuota {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

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

    private Integer cvVersionsStored;
    private Integer cvVersionsLimit;

    @CreationTimestamp
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;
}
