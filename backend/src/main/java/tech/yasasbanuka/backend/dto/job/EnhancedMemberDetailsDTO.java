package tech.yasasbanuka.backend.dto.job;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class EnhancedMemberDetailsDTO {
    private String name;
    private String level;
    private String role;
    private String country;
    private String background;
}
