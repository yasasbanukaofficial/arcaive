package tech.yasasbanuka.backend.dto.cv;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CvAnalysisCreateRequestDTO {
    private UUID memberId;
    private String targetJobTitle;
}
