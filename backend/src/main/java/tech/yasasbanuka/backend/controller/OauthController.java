package tech.yasasbanuka.backend.controller;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import tech.yasasbanuka.backend.service.OAuthService;
import tech.yasasbanuka.backend.util.JwtUtil;

import java.io.IOException;
import java.util.Objects;

@Component
@RequiredArgsConstructor
public class OauthController implements AuthenticationSuccessHandler {
    private final OAuthService oAuthService;
    private final JwtUtil jwtUtil;
    private final OAuth2AuthorizedClientService authorizedClientService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
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
        if (email == null) email = oAuthService.fetchPrimaryEmailFromGithub(oAuthAccessToken);

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

        String memberUsername = oAuthService.processOAuthLogin(provider, email, fullName, username, socialUrl);

        String jwtToken = jwtUtil.generateToken(memberUsername);
        ResponseCookie cookie = ResponseCookie.from("access_token", jwtToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(3600)
                .sameSite("Lax")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        response.sendRedirect("http://localhost:3000/overview");
    }
}
