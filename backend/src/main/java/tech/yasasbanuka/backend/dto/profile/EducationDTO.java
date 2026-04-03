package tech.yasasbanuka.backend.dto.profile;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EducationDTO {
    @Size(max = 200)
    private String school;

    @Size(max = 100)
    private String degree;

    @Size(max = 100)
    private String field;

    @Size(max = 20)
    private String startYear;

    @Size(max = 20)
    private String endYear;

    @Size(max = 20)
    private String grade;
}
