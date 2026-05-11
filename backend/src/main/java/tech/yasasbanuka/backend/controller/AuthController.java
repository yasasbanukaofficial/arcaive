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
import tech.yasasbanuka.backend.dto.auth.AuthResponseDTO;
import tech.yasasbanuka.backend.dto.auth.VerificationRequestDTO;
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
        return ResponseEntity.status(HttpStatus.OK)
                .body(new APIResponse<>(true, 200, "Verification code sent to your email.", null));
    }

    @PostMapping("verify")
    public ResponseEntity<APIResponse<String>> verifyUser(@RequestBody @Valid VerificationRequestDTO dto) {
        log.info("Received verification request for email: {}", dto.getEmail());
        authService.verifyEmail(dto.getEmail(), dto.getCode());
        return ResponseEntity.ok(new APIResponse<>(true, 200, "Account verified successfully. Please sign in.", null));
    }

    @PostMapping("resend-code")
    public ResponseEntity<APIResponse<String>> resendCode(@RequestParam String email) {
        log.info("Received resend request for email: {}", email);
        authService.resendVerificationCode(email);
        return ResponseEntity.ok(new APIResponse<>(true, 200, "Verification code resent successfully.", null));
    }

    @PostMapping("login")
    public ResponseEntity<APIResponse<AuthResponseDTO>> loginUser(@RequestBody @Valid AuthRequestDTO dto, HttpServletResponse response) {
        log.info("Received login request for email: {}", dto.getEmail());
        AuthResponseDTO authResponse = authService.authenticate(dto);
        
        setTokenCookies(response, authResponse);
        
        return ResponseEntity.ok(new APIResponse<>(true, 200, "Signed in successfully.", authResponse));
    }

    @PostMapping("refresh")
    public ResponseEntity<APIResponse<AuthResponseDTO>> refreshToken(@CookieValue(name = "refresh_token") String token, HttpServletResponse response) {
        log.info("Received session refresh request");
        AuthResponseDTO authResponse = authService.refresh(token);
        
        setTokenCookies(response, authResponse);
        
        return ResponseEntity.ok(new APIResponse<>(true, 200, "Session refreshed successfully.", authResponse));
    }

    private void setTokenCookies(HttpServletResponse response, AuthResponseDTO authResponse) {
        ResponseCookie accessCookie = ResponseCookie.from("access_token", authResponse.getAccessToken())
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(3600)
                .sameSite("Strict")
                .build();
                
        ResponseCookie refreshCookie = ResponseCookie.from("refresh_token", authResponse.getRefreshToken())
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(604800)
                .sameSite("Strict")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());
    }

    @PostMapping("logout")
    public ResponseEntity<APIResponse<Void>> logoutUser(
            @CookieValue(name = "refresh_token", required = false) String refreshToken,
            HttpServletResponse response) {
        log.info("Received logout request");
        if (refreshToken != null) {
            authService.logout(refreshToken);
        }
        
        ResponseCookie clearAccess = ResponseCookie.from("access_token", "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .sameSite("Strict")
                .build();
        ResponseCookie clearRefresh = ResponseCookie.from("refresh_token", "")
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
        response.addHeader(HttpHeaders.SET_COOKIE, clearRefresh.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, clearSession.toString());
        
        return ResponseEntity.ok(new APIResponse<>(true, 200, "Signed out successfully.", null));
    }
}
