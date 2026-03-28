package tech.yasasbanuka.backend.controller;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.yasasbanuka.backend.dto.auth.AuthRequestDTO;
import tech.yasasbanuka.backend.dto.member.MemberCreateRequestDTO;
import tech.yasasbanuka.backend.service.AuthService;
import tech.yasasbanuka.backend.service.impl.AuthServiceImpl;
import tech.yasasbanuka.backend.util.APIResponse;

@RestController
@RequestMapping("api/v1/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {
    private final AuthService authService;

    @PostMapping("register")
    public ResponseEntity<APIResponse<String>> registerUser(@RequestBody @Valid MemberCreateRequestDTO dto) {
        log.info("Received registration request for email: {}", dto.getMemberEmail());
        authService.register(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new APIResponse<>(true, 201, "Account created successfully. Please sign in.", null));
    }

    @PostMapping("login")
    public ResponseEntity<APIResponse<String>> loginUser(@RequestBody @Valid AuthRequestDTO dto) {
        log.info("Received login request for email: {}", dto.getEmail());
        String token = authService.authenticate(dto).getAccessToken();
        return ResponseEntity.ok(new APIResponse<>(true, 200, "Signed in successfully.", token));
    }

    @PostMapping("logout")
    public ResponseEntity<APIResponse<Void>> logoutUser(HttpServletResponse response) {
        log.info("Received logout request");
        ResponseCookie clearAccess = ResponseCookie.from("access_token", "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .sameSite("Strict")
                .build();
        ResponseCookie clearSession = ResponseCookie.from("JSESSIONID", "")
                .httpOnly(true)
                .path("/")
                .maxAge(0)
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, clearAccess.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, clearSession.toString());
        return ResponseEntity.ok(new APIResponse<>(true, 200, "Signed out successfully.", null));
    }
}
