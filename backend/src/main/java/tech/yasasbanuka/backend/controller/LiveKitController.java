package tech.yasasbanuka.backend.controller;

import io.livekit.server.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import tech.yasasbanuka.backend.service.LiveKitService;
import tech.yasasbanuka.backend.util.APIResponse;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/livekit")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class LiveKitController {
    private final LiveKitService liveKitService;

    @GetMapping("/token")
    public ResponseEntity<Map<String, String>> getToken(Authentication authentication) {
        Map<String, String> token = liveKitService.getToken(authentication.getName());
        return new ResponseEntity<>(token, HttpStatus.OK);
    }
}
