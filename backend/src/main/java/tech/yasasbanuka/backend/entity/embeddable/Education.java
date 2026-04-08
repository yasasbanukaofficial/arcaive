package tech.yasasbanuka.backend.entity.embeddable;

import jakarta.persistence.Embeddable;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Embeddable
public class Education {
    private String degree;
    private String institution;
    private String location;
    private String period;
}
