package tech.yasasbanuka.backend.dto.member;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.Email;
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
public class MemberUpdateRequestDTO {
    @Size(max = 100)
    @Nullable
    private String memberFullName;

    @Nullable
    private String memberUsername;

    @Email(message = "Please provide a valid email address (ex:-john@xyz.com)")
    @Nullable
    private String memberEmail;

    @Nullable
    private String jobRole;
    @Nullable
    private String experience;
    @Nullable
    private String country;

    @Nullable
    private String summary;
    @Nullable
    private List<ExperienceDTO> experiences;
    @Nullable
    private List<EducationDTO> educations;
    @Nullable
    private List<ProjectDTO> projects;
    @Nullable
    private List<SkillCategoryDTO> skills;
    @Nullable
    private List<String> certifications;
    @Nullable
    private List<String> languages;
}
