package tech.yasasbanuka.backend.controller;

import io.livekit.server.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import tech.yasasbanuka.backend.dto.job.JobRequestDTO;
import tech.yasasbanuka.backend.dto.job.JobResponseDTO;
import tech.yasasbanuka.backend.service.LiveKitService;
import tech.yasasbanuka.backend.util.APIResponse;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/livekit")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@Slf4j
public class LiveKitController {
    private final LiveKitService liveKitService;

    @GetMapping("/token")
    public ResponseEntity<Map<String, String>> getToken(Authentication authentication) {
        log.info("Received request for LiveKit token for user: {}", authentication.getName());
        Map<String, String> token = liveKitService.getToken(authentication.getName());
        return new ResponseEntity<>(token, HttpStatus.OK);
    }
    @PostMapping("/token")
    public ResponseEntity<Map<String, String>> getTokenWithJobDetails(Authentication authentication, @RequestBody() JobRequestDTO jobDetails) {
        log.info("Received request for LiveKit token for user with job details: {}", authentication.getName());
        log.info("Received job details: {}", jobDetails);
        Map<String, String> token = liveKitService.getToken(authentication.getName(), jobDetails);
        return new ResponseEntity<>(token, HttpStatus.OK);
    }
}
