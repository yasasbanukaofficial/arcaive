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
    private String school;
    private String degree;
    private String field;
    private String startYear;
    private String endYear;
    private String grade;
}
