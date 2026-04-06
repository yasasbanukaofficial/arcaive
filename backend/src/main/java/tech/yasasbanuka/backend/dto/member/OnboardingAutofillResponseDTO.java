package tech.yasasbanuka.backend.dto.member;

import com.fasterxml.jackson.annotation.JsonUnwrapped;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OnboardingAutofillResponseDTO {
    @JsonUnwrapped
    private MemberProfileDTO profile;
}
