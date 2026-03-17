package tech.yasasbanuka.backend.controller;

import io.livekit.server.*;
import livekit.LivekitAgentDispatch;
import livekit.LivekitRoom;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("api/v1/livekit")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class LiveKitController {
    @Value("${livekit.api-key}")
    private String apiKey;
    @Value("${livekit.api-secret}")
    private String apiSecret;
    @Value("${livekit.url}")
    private String livekitUrl;

    @GetMapping("/token")
    public Map<String, String> getToken(
            @RequestParam String roomName,
            @RequestParam String participantName) {

        AccessToken accessToken = new AccessToken(apiKey, apiSecret);
        accessToken.setName(participantName);
        accessToken.setIdentity(participantName);
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
                                        .setMetadata("{}")
                                        .build()
                        )
                        .build()
        );
        return Map.of("token", accessToken.toJwt(), "url", livekitUrl);
    }
}
