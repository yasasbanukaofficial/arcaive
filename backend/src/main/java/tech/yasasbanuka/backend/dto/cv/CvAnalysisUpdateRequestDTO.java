package tech.yasasbanuka.backend.dto.cv;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import tech.yasasbanuka.backend.entity.constants.AlignmentStatus;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CvAnalysisUpdateRequestDTO {
    private UUID id;
    private String targetJobTitle;
    private Double overallMatchScore;
    private AlignmentStatus seniorityFit;
    private SkillGapDTO skillGap;
    private List<String> redFlags;
    private List<String> interviewProbes;
    private String semanticVerdict;
}
