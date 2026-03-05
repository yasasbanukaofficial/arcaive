package tech.yasasbanuka.backend.dto;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AtomicAchievementDTO {
    private String competencyTerm;
    private String competencyDescription;
}