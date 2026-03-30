package tech.yasasbanuka.backend.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
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
@Slf4j
public class LiveKitController {
    private final LiveKitService liveKitService;

    @GetMapping("/token")
    public ResponseEntity<APIResponse<Map<String, String>>> getToken(Authentication authentication) throws JsonProcessingException {
        log.info("Received request for LiveKit token for user: {}", authentication.getName());
        Map<String, String> token = liveKitService.getToken(authentication.getName());
        return new ResponseEntity<>(new APIResponse<>(true, HttpStatus.OK.value(), "Successfully fetched the token details.", token), HttpStatus.OK);
    }
    @PostMapping("/token")
    public ResponseEntity<APIResponse<Map<String, String>>> getTokenWithJobDetails(Authentication authentication, @RequestBody() JobRequestDTO jobDetails) throws JsonProcessingException {
        log.info("Received request for LiveKit token for user with job details: {}", authentication.getName());
        log.info("Received job details: {}", jobDetails);
        Map<String, String> token = liveKitService.getToken(authentication.getName(), jobDetails);
        return new ResponseEntity<>(
                new APIResponse<>(true, HttpStatus.OK.value(), "Successfully fetched the token details.", token),
                HttpStatus.OK
        );
    }
}
