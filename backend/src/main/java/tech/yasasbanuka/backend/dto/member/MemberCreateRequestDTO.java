package tech.yasasbanuka.backend.dto.member;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
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
public class MemberCreateRequestDTO {
    @NotBlank(message = "Full name is required")
    @Size(max = 100)
    private String memberFullName;

    @Email(message = "Please provide a valid email address (ex:-john@xyz.com)")
    @NotBlank(message = "Email is required")
    private String memberEmail;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;

    private String jobRole;
    private String experience;
    private String country;
    private String location;
    @Size(max = 50)
    private String phone;

    private String summary;
    private List<ExperienceDTO> experiences;
    private List<EducationDTO> educations;
    private List<ProjectDTO> projects;
    private List<SkillCategoryDTO> skills;
    private List<String> certifications;
    private List<String> languages;
}
