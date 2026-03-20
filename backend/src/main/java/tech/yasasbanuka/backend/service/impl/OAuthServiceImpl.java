package tech.yasasbanuka.backend.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import tech.yasasbanuka.backend.dto.member.LinkedAccountDTO;
import tech.yasasbanuka.backend.dto.member.MemberInternalDTO;
import tech.yasasbanuka.backend.entity.Subscription;
import tech.yasasbanuka.backend.repo.MemberRepo;
import tech.yasasbanuka.backend.service.MemberService;
import tech.yasasbanuka.backend.service.OAuthService;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class OAuthServiceImpl implements OAuthService {

    private final MemberService memberService;
    private final MemberRepo memberRepo;

    @Override
    public String processOAuthLogin(String provider, String email, String fullName,
                                    String username, String socialUrl) {
        log.info("Processing OAuth login for provider: {}, email: {}", provider, email);
        MemberInternalDTO existingMember = memberService.getMemberInternalByEmail(email);

        if (existingMember != null) {
            log.info("Existing member found for email: {}. Checking linked accounts.", email);
            List<LinkedAccountDTO> existingAccounts = existingMember.getLinkedAccounts();
            if (existingAccounts != null) {
                boolean alreadyLinked = existingAccounts.stream()
                        .anyMatch(acc -> provider.equals(acc.getProvider()));
                if (!alreadyLinked) {
                    log.info("Linking new provider {} to existing member {}", provider, email);
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
                } else {
                    log.debug("Provider {} already linked for member {}", provider, email);
                }
            }
        } else {
            log.info("No existing member found for email: {}. Creating new member via OAuth.", email);
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
                log.info("Assigning Explorer subscription to new OAuth member: {}", email);
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

        return existingMember.getMemberUsername() != null
                ? existingMember.getMemberUsername()
                : username;
    }

    @Override
    public String fetchPrimaryEmailFromGithub(String oAuthAccessToken) {
        log.debug("Fetching primary email from GitHub");
        String apiUrl = "https://api.github.com";
        RestClient restClient = RestClient.builder().baseUrl(apiUrl).build();
        try {
            List<Map<String, Object>> emails = restClient.get()
                    .uri("/user/emails")
                    .header("Authorization", "Bearer " + oAuthAccessToken)
                    .retrieve()
                    .body(new ParameterizedTypeReference<>() {
                    });

            if (emails == null) {
                log.warn("No emails returned from GitHub API");
                return null;
            }
            String primaryEmail = emails.stream()
                    .filter(e -> Boolean.TRUE.equals(e.get("primary")))
                    .map(e -> (String) e.get("email"))
                    .findFirst()
                    .orElse(null);
            log.debug("Fetched primary GitHub email: {}", primaryEmail);
            return primaryEmail;
        } catch (Exception e) {
            log.error("Failed to fetch emails from GitHub: {}", e.getMessage());
            return null;
        }
    }
}
