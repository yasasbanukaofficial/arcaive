package tech.yasasbanuka.backend.dto.member;

import jakarta.annotation.Nullable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
}
