package tech.yasasbanuka.backend.controller;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import tech.yasasbanuka.backend.dto.LinkedAccountDTO;
import tech.yasasbanuka.backend.dto.MemberDTO;
import tech.yasasbanuka.backend.entity.Member;
import tech.yasasbanuka.backend.entity.MemberTier;
import tech.yasasbanuka.backend.entity.Mfa;
import tech.yasasbanuka.backend.repo.MemberRepo;
import tech.yasasbanuka.backend.service.MemberService;

import java.io.IOException;
import java.util.List;
import java.util.Objects;

@Component
@RequiredArgsConstructor
public class OauthController implements AuthenticationSuccessHandler {
    private final MemberService memberService;
    private final tech.yasasbanuka.backend.util.JwtUtil jwtUtil;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) Objects.requireNonNull(authentication.getPrincipal(), "OAuth2Principal is null");
        System.out.println(oAuth2User);
        String provider = "unknown";
        if (authentication instanceof org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken token) {
            provider = token.getAuthorizedClientRegistrationId();
        }

        String fullName = oAuth2User.getAttribute("name");
        String email = oAuth2User.getAttribute("email");
        String username = switch (provider) {
            case "github" -> (String) oAuth2User.getAttribute("login");
            case "google" -> (String) oAuth2User.getAttribute("email");
            default -> (String) oAuth2User.getAttribute("sub");
        };

        String socialUrl = switch (provider) {
            case "github" -> (String) oAuth2User.getAttribute("html_url");
            case "google" -> "https://profiles.google.com/" + oAuth2User.getAttribute("sub");
            default -> "";
        };

        System.out.println("Provider: " + provider);
        System.out.println("Full Name: " + fullName);
        System.out.println("Email: " + email);
        System.out.println("Username: " + username);
        System.out.println("Social URL: " + socialUrl);

        MemberDTO member = MemberDTO.builder()
                .memberUsername(username)
                .memberFullName(fullName)
                .memberEmail(email)
                .linkedAccounts(List.of(LinkedAccountDTO.builder()
                        .provider(provider)
                        .label(provider.equals("github") ? "Github" : "Google")
                        .connected(true)
                        .email(null)
                        .url(socialUrl)
                        .build()
                ))
                .memberTier(String.valueOf(MemberTier.STARTER))
                .build();

        memberService.createMember(member);

        String token = jwtUtil.generateToken(member.getMemberUsername());

        response.sendRedirect("http://localhost:3000?token=" + token);
    }
}
