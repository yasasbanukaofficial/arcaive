package tech.yasasbanuka.backend.dto.member;

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
public class MemberResponseDTO {
    private UUID memberId;
    private String memberFullName;
    private String memberUsername;
    private String memberEmail;
    private boolean hasPassword;
    private MfaUpdateRequestDTO mfa;
    private List<LinkedAccountDTO> linkedAccounts;
    private String memberTier;
    private String subscriptionId;
    private String jobRole;
    private String experience;
    private String country;
}
