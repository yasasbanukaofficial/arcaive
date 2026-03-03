package tech.yasasbanuka.backend.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import tech.yasasbanuka.backend.dto.AuthDTO;
import tech.yasasbanuka.backend.dto.AuthResponseDTO;
import tech.yasasbanuka.backend.dto.MemberDTO;
import tech.yasasbanuka.backend.dto.SocialLinksDTO;
import tech.yasasbanuka.backend.service.impl.AuthServiceImpl;
import tech.yasasbanuka.backend.util.APIResponse;
import tech.yasasbanuka.backend.util.JwtUtil;

@RestController
@RequestMapping("api/v1/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AuthController {
    private final AuthServiceImpl authService;
    private final JwtUtil jwtUtil;

    @PostMapping("register")
    public ResponseEntity<APIResponse<String>> registerUser(@RequestBody @Valid MemberDTO memberDTO) {
        authService.register(memberDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new APIResponse<>(true, 201, "Account created successfully. Please sign in.", null));
    }

    @PostMapping("login")
    public ResponseEntity<APIResponse<String>> loginUser(@RequestBody @Valid AuthDTO authDTO) {
        String token = authService.authenticate(authDTO).getAccessToken();
        return ResponseEntity.ok(new APIResponse<>(true, 200, "Signed in successfully.", token));
    }

    @PutMapping("onboard")
    public ResponseEntity<APIResponse<String>> updateSocialLinks(@RequestBody @Valid SocialLinksDTO socialLinksDTO, HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        String token = authHeader.substring(7);
        authService.updateLinks(socialLinksDTO, jwtUtil.extractEmail(token));
        return ResponseEntity.ok(new APIResponse<>(true, 200, "Profile links updated successfully.", null));
    }
}