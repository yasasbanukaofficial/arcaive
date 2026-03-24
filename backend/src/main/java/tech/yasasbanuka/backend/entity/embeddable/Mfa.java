package tech.yasasbanuka.backend.entity.embeddable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter @Setter @Builder
@Embeddable
public class Mfa {
    @Column(name = "mfa_enabled")
    private boolean enabled;
    @Column(name = "mfa_method")
    private String method;
}
