package tech.yasasbanuka.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
            @RequestParam(defaultValue = "software engineer") String query,
            @RequestParam(required = false) String location) {
        return new ResponseEntity<>(
                new APIResponse<>(true, HttpStatus.OK.value(), "Jobs fetched successfully",
                        jobService.searchJobs(query, location)),
                HttpStatus.OK);
    }
}