package tech.yasasbanuka.backend.entity.embeddable;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Embeddable;
import lombok.*;
import tech.yasasbanuka.backend.entity.converter.StringListConverter;

import java.util.List;

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

    @Convert(converter = StringListConverter.class)
    @Column(columnDefinition = "TEXT")
    private List<String> bullets;

    private String year;
}
