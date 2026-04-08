package tech.yasasbanuka.backend.dto.cv;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import tech.yasasbanuka.backend.dto.member.MemberProfileDTO;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TailoredCVRequestDTO {
    private String jobTitle;
    private String jobDescription;
    private MemberProfileDTO profile;
}
