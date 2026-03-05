package tech.yasasbanuka.backend.dto;

import lombok.*;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AtomicAchievementDTO {
    private String achievement;
    private List<String> techStack;
}