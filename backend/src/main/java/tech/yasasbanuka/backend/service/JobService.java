package tech.yasasbanuka.backend.service;

import tech.yasasbanuka.backend.dto.job.JobResponseDTO;

import java.util.List;
import java.util.UUID;

public interface JobService {
    List<JobResponseDTO> searchJobs(String username, String location);
}
