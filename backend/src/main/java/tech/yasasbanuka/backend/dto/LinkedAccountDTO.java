package tech.yasasbanuka.backend.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Data @Builder
public class LinkedAccountDTO {
    private String provider;
    private String label;
    private String iconKey;
    private boolean connected;
    private String email;

}