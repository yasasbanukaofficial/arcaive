package tech.yasasbanuka.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import tech.yasasbanuka.backend.dto.job.JobResponseDTO;
import tech.yasasbanuka.backend.service.JobService;
import tech.yasasbanuka.backend.util.APIResponse;

import java.util.List;

@RestController
@RequestMapping("api/v1/jobs")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class JobController {
    private final JobService jobService;

    @GetMapping("/search")
    public ResponseEntity<APIResponse<List<JobResponseDTO>>> searchJobs(
            Authentication authentication,
            @RequestParam(required = false) String location) {
        return new ResponseEntity<>(
                new APIResponse<>(true, HttpStatus.OK.value(), "Jobs fetched successfully",
                        jobService.searchJobs(authentication.getName(), location)),
                HttpStatus.OK);
    }

    @GetMapping("/custom-search")
    public ResponseEntity<APIResponse<List<JobResponseDTO>>> customSearchJobs(
            @RequestParam(required = true) String searchQuery,
            @RequestParam(required = false) String location) {
        return new ResponseEntity<>(
                new APIResponse<>(true, HttpStatus.OK.value(), "Jobs fetched successfully",
                        jobService.searchJobs(searchQuery, location)),
                HttpStatus.OK);
    }
}