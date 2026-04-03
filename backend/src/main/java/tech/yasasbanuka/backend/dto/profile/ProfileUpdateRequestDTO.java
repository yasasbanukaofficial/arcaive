package tech.yasasbanuka.backend.dto.profile;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
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
public class ProfileUpdateRequestDTO {
    @Size(max = 200)
    private String fullName;

    @Email(message = "Please provide a valid email address")
    private String email;

    @Size(max = 500)
    private String address;

    @Min(value = 1, message = "Age must be at least 1")
    private Integer age;

    @Size(max = 50)
    private String phoneNumber;

    @Size(max = 200)
    private String headline;

    @Size(max = 2000)
    private String summary;

    @Size(max = 100)
    private String country;

    @Size(max = 100)
    private String city;

    @Size(max = 500)
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
