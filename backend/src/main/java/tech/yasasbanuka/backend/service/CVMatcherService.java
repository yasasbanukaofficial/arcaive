package tech.yasasbanuka.backend.service;

import org.springframework.web.multipart.MultipartFile;
import tech.yasasbanuka.backend.dto.cv.CvAnalysisResponseDTO;
import tech.yasasbanuka.backend.dto.profile.ProfileResponseDTO;

public interface CVMatcherService {
    CvAnalysisResponseDTO analyze(String username, MultipartFile file, String jobDescription);
    ProfileResponseDTO optimizeCV(String username, String userInput);
}
