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
public class SkillCategory {
    private String category;

    @Column(columnDefinition = "TEXT")
    private String items;
}
