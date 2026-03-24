package tech.yasasbanuka.backend.dto.cv;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SkillGapDTO {
    private List<String> matchedSkills;
    private List<String> missingEssentials;
    private List<String> bonusSkills;
    private Double technicalAlignmentScore;
}
