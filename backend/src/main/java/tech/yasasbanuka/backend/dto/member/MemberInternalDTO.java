package tech.yasasbanuka.backend.dto.member;

import jakarta.annotation.Nullable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import tech.yasasbanuka.backend.dto.profile.EducationDTO;
import tech.yasasbanuka.backend.dto.profile.ExperienceDTO;
import tech.yasasbanuka.backend.dto.profile.ProjectDTO;
import tech.yasasbanuka.backend.dto.profile.SkillCategoryDTO;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MemberInternalDTO {
    @Nullable
    private UUID memberId;
    private String memberFullName;
    private String memberUsername;
    private String memberEmail;
    @Nullable
    private String password;
    @Nullable
    private MfaUpdateRequestDTO mfa;
    @Nullable
    private List<LinkedAccountDTO> linkedAccounts;
    @Nullable
    private String subscriptionId;
    @Nullable
    private String jobRole;
    @Nullable
    private String experience;
    @Nullable
    private String country;
    @Nullable
    private String location;
    @Nullable
    private String phone;
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
    private boolean onboardingCompleted;
}
