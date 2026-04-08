package tech.yasasbanuka.backend.entity.embeddable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Embeddable
public class Experience {
    private String role;
    private String company;
    private String location;
    private String period;

    @Column(columnDefinition = "TEXT")
    private String bullets;
}
