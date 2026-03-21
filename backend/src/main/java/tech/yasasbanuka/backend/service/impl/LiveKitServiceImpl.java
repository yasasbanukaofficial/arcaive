package tech.yasasbanuka.backend.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import dev.langchain4j.agentic.AgenticServices;
import dev.langchain4j.model.openai.OpenAiChatModel;
import io.livekit.server.*;
import livekit.LivekitAgentDispatch;
import livekit.LivekitRoom;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import tech.yasasbanuka.backend.agents.JobDetailsEnhancerAgent;
import tech.yasasbanuka.backend.agents.MemberDetailsEnhancerAgent;
import tech.yasasbanuka.backend.dto.job.EnhancedJobDetailsDTO;
import tech.yasasbanuka.backend.dto.job.EnhancedMemberDetailsDTO;
import tech.yasasbanuka.backend.dto.job.JobRequestDTO;
import tech.yasasbanuka.backend.dto.member.MemberResponseDTO;
import tech.yasasbanuka.backend.dto.subscription.SubscriptionResponseDTO;
import tech.yasasbanuka.backend.entity.Subscription;
import tech.yasasbanuka.backend.service.LiveKitService;
import tech.yasasbanuka.backend.service.MemberService;
import com.fasterxml.jackson.databind.ObjectMapper;
import tech.yasasbanuka.backend.service.SubscriptionService;

import java.util.Map;
import java.util.UUID;

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
    private final SubscriptionService subscriptionService;
    private final ObjectMapper objectMapper;
    private final OpenAiChatModel openAiChatModel;

    @Override
    public Map<String, String> getToken(String username) throws JsonProcessingException {
        return generateToken(username, null);
    }

    @Override
    public Map<String, String> getToken(String username, JobRequestDTO jobDetails) throws JsonProcessingException {
        return generateToken(username, jobDetails);
    }

    private Map<String, String> generateToken(String username, JobRequestDTO jobDetails) throws JsonProcessingException {
        String jobDetailsAsJSON = null;
        if (jobDetails != null && jobDetails.getId() != null && !jobDetails.getId().isEmpty()) {
            log.info("Received Job Details: {}", jobDetails);
            try {
                jobDetailsAsJSON = objectMapper.writeValueAsString(jobDetailsEnhanced(objectMapper.writeValueAsString(jobDetails)));
                log.info("Received job details in json string format: {}", jobDetailsAsJSON);
            } catch (Exception e) {
                log.error("Error serializing job details", e);
            }
        } else {
            log.info("No job details provided, starting general interview");
        }

        log.info("Generating LiveKit token for user: {}", username);
        MemberResponseDTO member = memberService.getMemberByUsername(username);
        String memberDetailsAsJson = objectMapper.writeValueAsString(memberDetailsEnhancer(objectMapper.writeValueAsString(member)));
        log.info("Received member details in json string format: {}", memberDetailsAsJson);

        String roomName = "arc_" + member.getMemberId() + "_" + System.currentTimeMillis();
        log.info("Assigning user {} to LiveKit room: {}", username, roomName);

        SubscriptionResponseDTO subscription = subscriptionService.getSubscription(UUID.fromString(member.getSubscriptionId()));
//        Need to write the subscription time period checking part.

        String variantId = subscription.getVariantId();
        int duration = variantId.equalsIgnoreCase("strategist") ? 300 : variantId.equalsIgnoreCase("architect") ? 600 : 120;

        AccessToken accessToken = new AccessToken(apiKey, apiSecret);
        accessToken.setName(member.getMemberFullName());
        accessToken.setIdentity(String.valueOf(member.getMemberId()));
        accessToken.addGrants(
                new RoomJoin(true),
                new RoomName(roomName),
                new CanPublish(true),
                new CanSubscribe(true)
        );
        String fallbackJobDetails = String.format(
                "{\"title\": \"%s\", \"focus\": \"General interview for %s role\"}",
                member.getJobRole(),
                member.getJobRole()
        );
        String metadata = String.format(
                "{\"candidate details\": %s, \"job details\": %s, \"duration\": %s}",
                memberDetailsAsJson,
                jobDetailsAsJSON == null ? fallbackJobDetails : jobDetailsAsJSON,
                duration
        );
        log.info("Metadata being sent to agent: {}", metadata);
        accessToken.setRoomConfiguration(
                LivekitRoom.RoomConfiguration.newBuilder()
                        .addAgents(
                                LivekitAgentDispatch.RoomAgentDispatch.newBuilder()
                                        .setAgentName("arcaive-interview-agent")
                                        .setMetadata(metadata)
                                        .build()
                        )
                        .build()
        );
        String token = accessToken.toJwt();
        log.info("LiveKit token generated successfully for user: {}", username);
        return Map.of("token", token, "url", livekitUrl, "duration", String.valueOf(duration));
    }

    private EnhancedJobDetailsDTO jobDetailsEnhanced(String jobDetails) {
        JobDetailsEnhancerAgent jobDetailsEnhancerAgent = AgenticServices
                .agentBuilder(JobDetailsEnhancerAgent.class)
                .chatModel(openAiChatModel)
                .build();
        return jobDetailsEnhancerAgent.enhance(jobDetails);
    }

    private EnhancedMemberDetailsDTO memberDetailsEnhancer(String memberResponseDTO) {
        MemberDetailsEnhancerAgent memberDetailsEnhancerAgent = AgenticServices
                .agentBuilder(MemberDetailsEnhancerAgent.class)
                .chatModel(openAiChatModel)
                .build();
        return memberDetailsEnhancerAgent.enhance(memberResponseDTO);
    }
}