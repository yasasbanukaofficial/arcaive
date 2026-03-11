package tech.yasasbanuka.backend.service;

import tech.yasasbanuka.backend.dto.job.JobResponseDTO;

import java.util.List;

public interface JobService {
    List<JobResponseDTO> searchJobs(String query, String location);
}
