package tech.yasasbanuka.backend.service;

import org.springframework.stereotype.Service;
import tech.yasasbanuka.backend.dto.job.JobRequestDTO;

import java.util.Map;

public interface LiveKitService {
    Map<String, String> getToken(String username);
    Map<String, String> getToken(String username, JobRequestDTO jobDetails);
}
