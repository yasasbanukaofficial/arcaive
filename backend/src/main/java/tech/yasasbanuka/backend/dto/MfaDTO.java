package tech.yasasbanuka.backend.dto;

import jakarta.persistence.Embeddable;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Data @Builder
@Embeddable
public class MfaDTO {
    private boolean enabled;
    private String method;
}
