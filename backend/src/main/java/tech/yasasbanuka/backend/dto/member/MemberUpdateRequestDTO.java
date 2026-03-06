package tech.yasasbanuka.backend.dto.member;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
}
