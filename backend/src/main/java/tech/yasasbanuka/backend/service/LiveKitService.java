package tech.yasasbanuka.backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.stereotype.Service;
import tech.yasasbanuka.backend.dto.job.JobRequestDTO;

import java.util.Map;

public interface LiveKitService {
    Map<String, String> getToken(String username) throws JsonProcessingException;
    Map<String, String> getToken(String username, JobRequestDTO jobDetails) throws JsonProcessingException;
}
