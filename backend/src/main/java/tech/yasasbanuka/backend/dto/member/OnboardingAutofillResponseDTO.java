package tech.yasasbanuka.backend.dto.member;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import tech.yasasbanuka.backend.dto.profile.EducationDTO;
import tech.yasasbanuka.backend.dto.profile.ExperienceDTO;
import tech.yasasbanuka.backend.dto.profile.ProjectDTO;
import tech.yasasbanuka.backend.dto.profile.SkillCategoryDTO;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OnboardingAutofillResponseDTO {
    private String jobRole;
    private String experience;
    private String country;
    private String location;
    private String phone;
    private String linkedin;
    private String summary;
    private List<ExperienceDTO> experiences;
    private List<EducationDTO> educations;
    private List<ProjectDTO> projects;
    private List<SkillCategoryDTO> skills;
    private List<String> certifications;
    private List<String> languages;
}
