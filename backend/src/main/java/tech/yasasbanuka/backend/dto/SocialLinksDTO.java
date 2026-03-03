package tech.yasasbanuka.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class SocialLinksDTO {

    @NotBlank(message = "GitHub profile URL is required")
    @Pattern(
        regexp = "^https://github\\.com/.+",
        message = "Please provide a valid GitHub profile URL (e.g. https://github.com/username)"
    )
    private String githubURL;

    @NotBlank(message = "LinkedIn profile URL is required")
    @Pattern(
        regexp = "^https://(www\\.)?linkedin\\.com/in/.+",
        message = "Please provide a valid LinkedIn profile URL (e.g. https://linkedin.com/in/username)"
    )
    private String linkedinURL;
}
