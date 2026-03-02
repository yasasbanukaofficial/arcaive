package tech.yasasbanuka.backend.controller;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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

@RestController
@RequestMapping("api/v1/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000/")
public class AuthController {
    private final AuthServiceImpl authService;

    @PostMapping("register")
    public ResponseEntity<APIResponse<String>> registerUser(@RequestBody @Valid MemberDTO memberDTO) {
        authService.register(memberDTO);
        return ResponseEntity.ok(new APIResponse<>(true, 201, "User created successfully", null));
    }

    @PostMapping("login")
    public ResponseEntity<APIResponse<String>> loginUser(@RequestBody @Valid AuthDTO authDTO) {
        String token = authService.authenticate(authDTO).getAccessToken();
        return ResponseEntity.ok(new APIResponse<>(true, 200, "User logged in successfully", token));
    }

    @PutMapping("login")
    public ResponseEntity<APIResponse<String>> updateSocialLinks(@RequestBody @Valid SocialLinksDTO socialLinksDTO, @AuthenticationPrincipal UserDetails userDetails) {
        System.out.println(socialLinksDTO);
        authService.updateLinks(socialLinksDTO, userDetails.getUsername());
        return ResponseEntity.ok(new APIResponse<>(true, 200, "Links are updated successfully", null));
    }
}