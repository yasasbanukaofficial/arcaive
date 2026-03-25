package tech.yasasbanuka.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import tech.yasasbanuka.backend.entity.constants.AlignmentStatus;
import tech.yasasbanuka.backend.entity.embeddable.SkillGap;

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
    private Double overallMatchScore;

    @Enumerated(EnumType.STRING)
    private AlignmentStatus seniorityFit;

    @Embedded
    private SkillGap skillGap;

    @ElementCollection
    private List<String> redFlags;

    @ElementCollection
    private List<String> interviewProbes;

    @Column(columnDefinition = "TEXT")
    private String semanticVerdict;
}