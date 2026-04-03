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
public class ProjectDTO {
    @Size(max = 200)
    private String name;

    @Size(max = 500)
    private String url;

    @Size(max = 50)
    private String startDate;

    @Size(max = 50)
    private String endDate;

    @Size(max = 1000)
    private String description;
}
