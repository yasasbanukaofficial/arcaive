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
public class ExperienceDTO {
    @Size(max = 100)
    private String title;

    @Size(max = 200)
    private String company;

    @Size(max = 200)
    private String location;

    @Size(max = 50)
    private String startDate;

    @Size(max = 50)
    private String endDate;

    private boolean isCurrentRole;

    @Size(max = 1000)
    private String description;
}
