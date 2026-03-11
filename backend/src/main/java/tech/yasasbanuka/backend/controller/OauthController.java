package tech.yasasbanuka.backend.controller;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import tech.yasasbanuka.backend.dto.member.LinkedAccountDTO;
import tech.yasasbanuka.backend.dto.member.MemberInternalDTO;
import tech.yasasbanuka.backend.entity.Subscription;
import tech.yasasbanuka.backend.repo.MemberRepo;
import tech.yasasbanuka.backend.service.MemberService;
import tech.yasasbanuka.backend.service.mapper.MemberMapper;
import tech.yasasbanuka.backend.util.JwtUtil;

import java.io.IOException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Component
@RequiredArgsConstructor
public class OauthController implements AuthenticationSuccessHandler {
    private final MemberService memberService;
    private final JwtUtil jwtUtil;
    private final MemberMapper memberMapper;
    private final MemberRepo memberRepo;
    private final OAuth2AuthorizedClientService authorizedClientService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) Objects.requireNonNull(authentication.getPrincipal(), "OAuth2Principal is null");
        String provider = "unknown";
        String oAuthAccessToken = "";

        if (authentication instanceof OAuth2AuthenticationToken token) {
            provider = token.getAuthorizedClientRegistrationId();
            OAuth2AuthorizedClient authorizedClient = authorizedClientService.loadAuthorizedClient(
                    token.getAuthorizedClientRegistrationId(),
                    authentication.getName()
            );
            oAuthAccessToken = authorizedClient.getAccessToken().getTokenValue();
        }

        String fullName = oAuth2User.getAttribute("name");
        String email = oAuth2User.getAttribute("email");
        if (email == null) email = fetchPrimaryEmailFromGithub(oAuthAccessToken);

        String username = switch (provider) {
            case "github" -> (String) oAuth2User.getAttribute("login");
            case "google" -> email != null ? email.split("@")[0] : (String) oAuth2User.getAttribute("email");
            default -> (String) oAuth2User.getAttribute("sub");
        };

        String socialUrl = switch (provider) {
            case "github" -> (String) oAuth2User.getAttribute("html_url");
            case "google" -> "https://profiles.google.com/" + oAuth2User.getAttribute("sub");
            default -> "";
        };

        MemberInternalDTO existingMember = memberService.getMemberInternalByEmail(email);
        if (existingMember != null) {
            List<LinkedAccountDTO> existingAccounts = existingMember.getLinkedAccounts();
            if (existingAccounts != null) {
                String finalProvider = provider;
                boolean alreadyLinked = existingAccounts.stream()
                        .anyMatch(acc -> finalProvider.equals(acc.getProvider()));
                if (!alreadyLinked) {
                    existingAccounts.add(LinkedAccountDTO.builder()
                            .provider(provider)
                            .label(provider.equals("github") ? "Github" : "Google")
                            .connected(true)
                            .email(email)
                            .url(socialUrl)
                            .build()
                    );
                    existingMember.setLinkedAccounts(existingAccounts);
                    memberService.updateMember(existingMember);
                }
            }
        } else {
            existingMember = MemberInternalDTO.builder()
                    .memberUsername(username)
                    .memberFullName(fullName)
                    .memberEmail(email)
                    .linkedAccounts(List.of(LinkedAccountDTO.builder()
                            .provider(provider)
                            .label(provider.equals("github") ? "Github" : "Google")
                            .connected(true)
                            .email(email)
                            .url(socialUrl)
                            .build()
                    ))
                    .build();
            memberService.createMemberInternal(existingMember);

            Instant endsAt = Instant.now().plus(30, ChronoUnit.DAYS);
            Instant renewsAt = endsAt.plus(1, ChronoUnit.DAYS);
            memberRepo.findByEmail(email).ifPresent(member -> {
                Subscription freeSub = Subscription.builder()
                        .providerId("explorer")
                        .status("active")
                        .variantId("Explorer")
                        .endsAt(endsAt)
                        .renewsAt(renewsAt)
                        .build();
                member.setSubscription(freeSub);
                freeSub.setMember(member);
                memberRepo.save(member);
            });
        }

        String memberUsername = existingMember.getMemberUsername() != null
                ? existingMember.getMemberUsername()
                : username;
        String token = jwtUtil.generateToken(memberUsername);
        ResponseCookie cookie = ResponseCookie.from("access_token", token)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(86400)
                .sameSite("Lax")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        response.sendRedirect("http://localhost:3000/overview");
    }

    private String fetchPrimaryEmailFromGithub(String oAuthAccessToken) {
        String apiUrl = "https://api.github.com";
        RestClient restClient = RestClient.builder().baseUrl(apiUrl).build();
        List<Map<String, Object>> emails = restClient.get()
                .uri("/user/emails")
                .header("Authorization", "Bearer " + oAuthAccessToken)
                .retrieve()
                .body(new ParameterizedTypeReference<>() {
                });

        if (emails == null) return null;
        return emails.stream()
                .filter(e -> Boolean.TRUE.equals(e.get("primary")))
                .map(e -> (String) e.get("email"))
                .findFirst()
                .orElse(null);
    }
}
