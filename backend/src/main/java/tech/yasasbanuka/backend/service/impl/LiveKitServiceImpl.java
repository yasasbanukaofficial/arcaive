package tech.yasasbanuka.backend.service.impl;

import io.livekit.server.*;
import livekit.LivekitAgentDispatch;
import livekit.LivekitRoom;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import tech.yasasbanuka.backend.dto.member.MemberResponseDTO;
import tech.yasasbanuka.backend.service.LiveKitService;
import tech.yasasbanuka.backend.service.MemberService;

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

    @Override
    public Map<String, String> getToken(String username) {
        log.info("Generating LiveKit token for user: {}", username);
        MemberResponseDTO member = memberService.getMemberByUsername(username);
        AccessToken accessToken = new AccessToken(apiKey, apiSecret);

        String roomName = "arc_" + member.getMemberId() + "_" + System.currentTimeMillis();
        log.info("Assigning user {} to LiveKit room: {}", username, roomName);
        
        accessToken.setName(member.getMemberFullName());
        accessToken.setIdentity(String.valueOf(member.getMemberId()));
        accessToken.addGrants(new RoomJoin(true), new RoomName(roomName));
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
                                        .setAgentName("Avery-2197")
                                        .setMetadata("{ \"instructions\" : \"Every time say good ahoy mate when starting\" }")
                                        .build()
                        )
                        .build()
        );
        String token = accessToken.toJwt();
        log.info("LiveKit token generated successfully for user: {}", username);
        return Map.of("token", token, "url", livekitUrl);
    }
}
