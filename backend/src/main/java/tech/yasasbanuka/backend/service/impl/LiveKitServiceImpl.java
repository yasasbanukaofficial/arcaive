package tech.yasasbanuka.backend.service.impl;

import io.livekit.server.*;
import livekit.LivekitAgentDispatch;
import livekit.LivekitRoom;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import tech.yasasbanuka.backend.dto.job.JobRequestDTO;
import tech.yasasbanuka.backend.dto.member.MemberResponseDTO;
import tech.yasasbanuka.backend.service.LiveKitService;
import tech.yasasbanuka.backend.service.MemberService;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class LiveKitServiceImpl implements LiveKitService {
    @Value("${livekit.api-key}")
    private String apiKey;
    @Value("${livekit.api-secret}")
    private String apiSecret;
    @Value("${livekit.url}")
    private String livekitUrl;

    private final MemberService memberService;
    private final ObjectMapper objectMapper;

    @Override
    public Map<String, String> getToken(String username) {
        return generateToken(username, null);
    }

    @Override
    public Map<String, String> getToken(String username, JobRequestDTO jobDetails) {
        return generateToken(username, jobDetails);
    }

    private Map<String, String> generateToken(String username, JobRequestDTO jobDetails) {
        String jobDetailsAsJSON = "";
        if (jobDetails != null && jobDetails.getId() != null && !jobDetails.getId().isEmpty()) {
            log.info("Received Job Details: {}", jobDetails);
            try {
                jobDetailsAsJSON = objectMapper.writeValueAsString(jobDetails);
            } catch (Exception e) {
                log.error("Error serializing job details", e);
            }
        } else {
            log.info("No job details provided, starting general interview");
        }

        log.info("Generating LiveKit token for user: {}", username);
        MemberResponseDTO member = memberService.getMemberByUsername(username);
        String candidateDetailsJson = String.format(
                "{\"name\": \"%s\", \"job role\": \"%s\", \"experience\": \"%s\", \"country\": \"%s\"}",
                member.getMemberFullName(),
                member.getJobRole(),
                member.getExperience(),
                member.getCountry()
        );

        AccessToken accessToken = new AccessToken(apiKey, apiSecret);

        String roomName = "arc_" + member.getMemberId() + "_" + System.currentTimeMillis();
        log.info("Assigning user {} to LiveKit room: {}", username, roomName);

        accessToken.setName(member.getMemberFullName());
        accessToken.setIdentity(String.valueOf(member.getMemberId()));
        accessToken.addGrants(
                new RoomJoin(true),
                new RoomName(roomName),
                new CanPublish(true),
                new CanSubscribe(true)
        );
        accessToken.setRoomConfiguration(
                LivekitRoom.RoomConfiguration.newBuilder()
                        .addAgents(
                                LivekitAgentDispatch.RoomAgentDispatch.newBuilder()
                                        .setAgentName("arcaive-interview-agent")
                                        .setMetadata(String.format(
                                                "{\"candidate details\": %s, \"job details\": %s}",
                                                candidateDetailsJson,
                                                jobDetailsAsJSON.isEmpty() ? "null" : jobDetailsAsJSON
                                        ))
                                        .build()
                        )
                        .build()
        );
        String token = accessToken.toJwt();
        log.info("LiveKit token generated successfully for user: {}", username);
        return Map.of("token", token, "url", livekitUrl);
    }
}