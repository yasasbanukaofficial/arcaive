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
    private String title;
    private String company;
    private String location;
    private String startDate;
    private String endDate;
    private boolean isCurrentRole;
    @Column(length = 1000)
    private String description;
}
