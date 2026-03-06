package tech.yasasbanuka.backend.dto.member;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MfaUpdateRequestDTO {
    @NotNull(message = "MFA enabled status must be specified")
    private Boolean enabled;

    @Nullable
    @Size(max = 50, message = "MFA method must not exceed 50 characters")
    @Pattern(regexp = "^(email|sms|totp|authenticator)?$",
            message = "MFA method must be one of: email, sms, totp, authenticator")
    private String method;
}
