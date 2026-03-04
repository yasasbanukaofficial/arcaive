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

    @Nullable
    private String memberUsername;

    @Email(message = "Please provide a valid email address (ex:-john@xyz.com)")
    @NotBlank(message = "Email is required")
    private String memberEmail;

    @Nullable
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