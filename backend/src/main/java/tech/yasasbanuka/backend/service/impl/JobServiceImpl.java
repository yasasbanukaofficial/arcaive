package tech.yasasbanuka.backend.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
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

import java.util.*;

@Slf4j
@RequiredArgsConstructor
@Service
public class JobServiceImpl implements JobService {
    private final MemberService memberService;
    private final ObjectMapper objectMapper = new ObjectMapper();

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

        if(location == null || location.isEmpty()) {
            location = member.getCountry();
        }

        String jobRole = member.getJobRole();

        RestClient client = RestClient.builder()
                .baseUrl("https://jsearch.p.rapidapi.com")
                .defaultHeader("x-rapidapi-key", jsearchApiKey)
                .defaultHeader("x-rapidapi-host", jsearchApiHost)
                .build();

        String finalLocation = location;
        String searchResponse = client.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/search")
                        .queryParam("query", jobRole + " jobs in " + finalLocation)
                        .queryParam("page", "1")
                        .build())
                .retrieve()
                .body(String.class);

        try {
            SearchResponse parsed = objectMapper.readValue(searchResponse, SearchResponse.class);
            return parsed.getData() != null ? parsed.getData() : Collections.emptyList();
        } catch (Exception e) {
            log.error("Failed to parse JSearch API response: {}", e.getMessage());
            return Collections.emptyList();
        }
    }
}