package tech.yasasbanuka.backend.dto.job;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobDetailsDTO {
    @NotBlank(message = "Job role is required")
    private String jobRole;

    @NotBlank(message = "Experience is required")
    private String experience;

    @NotBlank(message = "Country is required")
    private String country;
}
