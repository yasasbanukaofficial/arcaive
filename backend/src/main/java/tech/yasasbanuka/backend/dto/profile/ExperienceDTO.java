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
public class ExperienceDTO {
    @Size(max = 100)
    private String role;

    @Size(max = 200)
    private String company;

    @Size(max = 200)
    private String location;

    @Size(max = 100)
    private String period;

    private List<String> bullets;
}
