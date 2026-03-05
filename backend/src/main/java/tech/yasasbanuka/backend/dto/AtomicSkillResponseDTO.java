package tech.yasasbanuka.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AtomicSkillResponseDTO {
    private String message;
    private List<AtomicAchievementDTO> achievements;
}