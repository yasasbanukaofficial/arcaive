package tech.yasasbanuka.backend.service;

import org.springframework.web.multipart.MultipartFile;
import retrofit2.http.Multipart;
import tech.yasasbanuka.backend.dto.cv.CvAnalysisResponseDTO;

public interface CVAnalysisService {
    CvAnalysisResponseDTO analyze(MultipartFile file, String jobDescription);
}
