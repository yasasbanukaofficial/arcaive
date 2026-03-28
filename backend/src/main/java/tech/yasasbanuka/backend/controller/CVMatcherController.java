package tech.yasasbanuka.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tech.yasasbanuka.backend.dto.cv.CvAnalysisResponseDTO;
import tech.yasasbanuka.backend.service.CVMatcherService;
import tech.yasasbanuka.backend.util.APIResponse;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/cv")
public class CVMatcherController {
    private final CVMatcherService cvMatcherService;

    @PostMapping("/analysis/upload")
    public ResponseEntity<APIResponse<CvAnalysisResponseDTO>> analyzeCV(@RequestParam("memberCV") MultipartFile memberCV, @RequestParam("jobDescription") String jobDescription) {
        return new ResponseEntity<>(new APIResponse<>(true, HttpStatus.OK.value(), "Successfully matched CV with job description", cvMatcherService.analyze(memberCV, jobDescription)), HttpStatus.OK);
    }

}
