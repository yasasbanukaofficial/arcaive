package tech.yasasbanuka.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class LinkedAccountDTO {
    @NotBlank(message = "Provider is required")
    @Size(max = 50, message = "Provider name cannot exceed 50 characters")
    private String provider;

    @NotBlank(message = "Label is required")
    @Size(max = 100, message = "Label cannot exceed 100 characters")
    private String label;

    private boolean connected;

    @Email(message = "Please provide a valid email address")
    @Size(max = 100, message = "Email cannot exceed 100 characters")
    private String email;

    private String url;
}