package tech.yasasbanuka.backend.entity;

import jakarta.persistence.Embeddable;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter @Setter @Builder
@Embeddable
public class LinkedAccount {
    private String provider;
    private String label;
    private boolean connected;
    private String email;
}
