package tech.yasasbanuka.backend.dto.member;

import com.fasterxml.jackson.annotation.JsonUnwrapped;
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
    private String subscriptionId;
    @JsonUnwrapped
    private MemberProfileDTO profile;
}
