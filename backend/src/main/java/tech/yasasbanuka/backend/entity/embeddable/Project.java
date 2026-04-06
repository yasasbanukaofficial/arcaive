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
public class Project {
    private String name;
    @Column(length = 1000)
    private String description;

    @Column(columnDefinition = "TEXT")
    private String bullets;

    private String year;
}
