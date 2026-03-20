package tech.yasasbanuka.backend.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import tech.yasasbanuka.backend.dto.job.JobResponseDTO;
import tech.yasasbanuka.backend.dto.job.SearchResponse;
import tech.yasasbanuka.backend.dto.member.MemberResponseDTO;
import tech.yasasbanuka.backend.entity.Member;
import tech.yasasbanuka.backend.service.JobService;
import tech.yasasbanuka.backend.service.MemberService;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.*;

@Slf4j
@RequiredArgsConstructor
@Service
public class JobServiceImpl implements JobService {
    private final MemberService memberService;
    private final ObjectMapper objectMapper;

    @Value("${JSEARCH_API_KEY}")
    private String jsearchApiKey;

    @Value("${JSEARCH_HOST}")
    private String jsearchApiHost;

    @Override
    public List<JobResponseDTO> searchJobs(String username, String location) {
        MemberResponseDTO member = memberService.getMemberByUsername(username);

        if (jsearchApiKey == null || jsearchApiKey.isBlank()) {
            log.error("JSearch API key is not configured.");
            return Collections.emptyList();
        }

        if (location == null || location.isBlank()) {
            location = member.getCountry();
        }

        String jobRole = member.getJobRole();
        if (jobRole == null || jobRole.isBlank()) {
            jobRole = "software engineer";
        }

        String query = jobRole + " jobs in " + location;
        log.info("Searching jobs with query: {}", query);

        RestClient client = RestClient.builder()
                .baseUrl("https://jsearch.p.rapidapi.com")
                .defaultHeader("X-RapidAPI-Key", jsearchApiKey)
                .defaultHeader("X-RapidAPI-Host", jsearchApiHost)
                .build();

        String finalQuery = query;
        String searchResponse = client.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/search")
                        .queryParam("query", finalQuery)
                        .queryParam("page", "1")
                        .queryParam("num_pages", "1")
                        .queryParam("date_posted", "all")
                        .build())
                .retrieve()
                .body(String.class);

        log.info("JSearch raw response: {}", searchResponse);

        try {
            SearchResponse parsed = objectMapper.readValue(searchResponse, SearchResponse.class);
            return parsed.getData() != null ? parsed.getData() : Collections.emptyList();
        } catch (Exception e) {
            log.error("Failed to parse JSearch response: {}", e.getMessage());
            return Collections.emptyList();
        }
    }
}