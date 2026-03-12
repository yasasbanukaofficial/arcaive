package tech.yasasbanuka.backend.service;

public interface OAuthService {
    String processOAuthLogin(String provider, String email, String fullName,
                             String username, String socialUrl);

    String fetchPrimaryEmailFromGithub(String oAuthAccessToken);
}
