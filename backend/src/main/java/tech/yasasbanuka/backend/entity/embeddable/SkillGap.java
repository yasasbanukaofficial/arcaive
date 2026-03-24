package tech.yasasbanuka.backend.entity.embeddable;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.util.List;

@Embeddable
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SkillGap {
    @ElementCollection
    private List<String> matchedSkills;

    @ElementCollection
    private List<String> missingEssentials;

    @ElementCollection
    private List<String> bonusSkills;

    private Double technicalAlignmentScore;
}
