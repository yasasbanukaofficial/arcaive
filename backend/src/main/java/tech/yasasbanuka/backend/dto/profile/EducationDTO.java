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
    @Size(max = 100)
    private String degree;

    @Size(max = 200)
    private String institution;

    @Size(max = 100)
    private String location;

    @Size(max = 100)
    private String period;
}
