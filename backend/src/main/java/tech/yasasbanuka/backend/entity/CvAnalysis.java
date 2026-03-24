package tech.yasasbanuka.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CvAnalysis {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;

    private String targetJobTitle;
    private Double overallMatchScore; // e.g., 85.5

    @Enumerated(EnumType.STRING)
    private AlignmentStatus seniorityFit; // Enum: MATCHED, OVERQUALIFIED, UNDERQUALIFIED

    @Embedded
    private SkillGap skillGap;

    @ElementCollection
    private List<String> redFlags;

    @ElementCollection
    private List<String> interviewProbes;

    @Column(columnDefinition = "TEXT")
    private String semanticVerdict; // The "AI" generated reasoning
}