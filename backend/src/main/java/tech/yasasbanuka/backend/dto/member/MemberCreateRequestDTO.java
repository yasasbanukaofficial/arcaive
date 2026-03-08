package tech.yasasbanuka.backend.dto.member;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
}
