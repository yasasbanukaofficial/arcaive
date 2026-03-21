package tech.yasasbanuka.backend.dto.job;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class EnhancedJobDetailsDTO {
    private String title;
    private String company;
    private String website;
    private Boolean remote;
    private String location;
    private String level;
    private List<String> stack;
    private List<String> keySkills;
    private String focus;
    private String salary;
    private List<String> benefits;
}