package tech.yasasbanuka.backend.dto.profile;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import tech.yasasbanuka.backend.dto.member.LinkedAccountDTO;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileResponseDTO {
    private UUID id;
    private String fullName;
    private String email;
    private String address;
    private Integer age;
    private String phone;
    private String headline;
    private String summary;
    private String country;
    private String city;
    private String profilePictureUrl;
    private List<EducationDTO> educationHistory;
    private List<ExperienceDTO> workExperience;
    private List<ProjectDTO> projects;
    private List<String> skills;
    private List<String> certifications;
    private List<String> languages;
    private List<LinkedAccountDTO> socialLinks;
    private UUID memberId;
}
