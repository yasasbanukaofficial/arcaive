package tech.yasasbanuka.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.*;
import lombok.*;
import tech.yasasbanuka.backend.entity.LinkedAccount;

import java.util.List;
import java.util.UUID;

@AllArgsConstructor @NoArgsConstructor
@Data
@Builder
public class MemberDTO {
    @Nullable
    private UUID memberId;

    @NotBlank(message = "Full name is required")
    @Size(max = 100)
    private String memberFullName;

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 20)
    private String memberUsername;

    @Email(message = "Please provide a valid email address (ex:-john@xyz.com)")
    @NotBlank(message = "Email is required")
    private String memberEmail;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    @Nullable
    private MfaDTO mfa;

    @Nullable
    private List<LinkedAccountDTO> linkedAccounts;

    @Nullable
    private String memberTier;
    @Nullable
    private String subscriptionId;
}