package tech.yasasbanuka.backend.service;

import org.springframework.web.multipart.MultipartFile;
import tech.yasasbanuka.backend.dto.cv.CvAnalysisResponseDTO;

public interface CVMatcherService {
    CvAnalysisResponseDTO analyze(String username, MultipartFile file, String jobDescription);
}
