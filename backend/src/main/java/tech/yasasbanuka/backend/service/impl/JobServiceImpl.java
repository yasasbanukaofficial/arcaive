package tech.yasasbanuka.backend.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import tech.yasasbanuka.backend.dto.job.JobResponseDTO;
import tech.yasasbanuka.backend.dto.job.SearchResponse;
import tech.yasasbanuka.backend.dto.member.MemberResponseDTO;
import tech.yasasbanuka.backend.service.JobService;
import tech.yasasbanuka.backend.service.MemberService;

import java.util.*;

@Slf4j
@RequiredArgsConstructor
@Service
public class JobServiceImpl implements JobService {
    private final MemberService memberService;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final RestClient jsearchRestClient;

    @Override
    public List<JobResponseDTO> searchJobs(String username, String location) {
        MemberResponseDTO member = memberService.getMemberByUsername(username);

        if (location == null || location.isBlank()) {
            location = member.getCountry();
        }

        String jobRole = member.getJobRole();
        if (jobRole == null || jobRole.isBlank()) {
            jobRole = "software engineer";
        }

        String query = jobRole + " jobs in " + location;
        log.info("Searching jobs with query: {}", query);

        String finalQuery = query;
        String searchResponse = jsearchRestClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/search")
                        .queryParam("query", finalQuery)
                        .queryParam("page", "1")
                        .queryParam("num_pages", "1")
                        .queryParam("date_posted", "all")
                        .build())
                .retrieve()
                .body(String.class);

        try {
            SearchResponse parsed = objectMapper.readValue(searchResponse, SearchResponse.class);
            return parsed.getData() != null ? parsed.getData() : Collections.emptyList();
        } catch (Exception e) {
            log.error("Failed to parse JSearch response: {}", e.getMessage());
            return Collections.emptyList();
        }
    }

    @Override
    public List<JobResponseDTO> customSearchJobs(String searchQuery, String location) {
        return List.of();
    }
}
