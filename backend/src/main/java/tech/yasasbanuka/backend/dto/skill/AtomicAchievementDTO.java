package tech.yasasbanuka.backend.dto.skill;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AtomicAchievementDTO {
    private String qualificationTerm;
    private String qualificationDescription;
}
