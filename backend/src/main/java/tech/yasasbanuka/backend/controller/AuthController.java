package tech.yasasbanuka.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.yasasbanuka.backend.dto.auth.AuthRequestDTO;
import tech.yasasbanuka.backend.dto.member.MemberCreateRequestDTO;
import tech.yasasbanuka.backend.service.impl.AuthServiceImpl;
import tech.yasasbanuka.backend.util.APIResponse;

@RestController
@RequestMapping("api/v1/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AuthController {
    private final AuthServiceImpl authService;

    @PostMapping("register")
    public ResponseEntity<APIResponse<String>> registerUser(@RequestBody @Valid MemberCreateRequestDTO dto) {
        authService.register(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new APIResponse<>(true, 201, "Account created successfully. Please sign in.", null));
    }

    @PostMapping("login")
    public ResponseEntity<APIResponse<String>> loginUser(@RequestBody @Valid AuthRequestDTO dto) {
        String token = authService.authenticate(dto).getAccessToken();
        return ResponseEntity.ok(new APIResponse<>(true, 200, "Signed in successfully.", token));
    }
}
