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
    private String url;
    private String startDate;
    private String endDate;
    @Column(length = 1000)
    private String description;
}
