package tech.yasasbanuka.backend.dto.profile;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectDTO {
    @Size(max = 200)
    private String name;

    @Size(max = 1000)
    private String description;

    private List<String> bullets;

    @Size(max = 20)
    private String year;
}
