package tech.yasasbanuka.backend.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;
import tech.yasasbanuka.backend.dto.member.LinkedAccountDTO;
import tech.yasasbanuka.backend.dto.member.MemberInternalDTO;
import tech.yasasbanuka.backend.entity.Member;
import tech.yasasbanuka.backend.entity.embeddable.LinkedAccount;
import tech.yasasbanuka.backend.repo.MemberRepo;
import tech.yasasbanuka.backend.service.MemberService;
import tech.yasasbanuka.backend.service.OAuthService;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class OAuthServiceImpl implements OAuthService {

    private final MemberService memberService;
    private final MemberRepo memberRepo;

    @Override
    @Transactional
    public String processOAuthLogin(String provider, String email, String fullName,
                                    String username, String socialUrl, String oauthId) {
        log.info("Processing OAuth login for provider: {}, email: {}", provider, email);

        return memberRepo.findByEmailWithLock(email).map(member -> {
            log.info("Existing member found for email: {}. Checking linked accounts.", email);
            List<LinkedAccount> existingAccounts = member.getLinkedAccounts();
            if (existingAccounts == null) {
                existingAccounts = new ArrayList<>();
            }
            
            boolean alreadyLinked = existingAccounts.stream()
                    .anyMatch(acc -> provider.equals(acc.getProvider()));
            
            if (!alreadyLinked) {
                log.info("Linking new provider {} to existing member {}", provider, email);
                existingAccounts.add(LinkedAccount.builder()
                        .provider(provider)
                        .label(provider.equals("github") ? "Github" : "Google")
                        .connected(true)
                        .email(email)
                        .url(socialUrl)
                        .build()
                );
                member.setLinkedAccounts(existingAccounts);
                memberRepo.save(member);
            } else {
                log.debug("Provider {} already linked for member {}", provider, email);
            }
            return member.getUsername();
        }).orElseGet(() -> {
            log.info("No existing member found for email: {}. Creating new member via OAuth.", email);
            MemberInternalDTO newMember = MemberInternalDTO.builder()
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
            return memberService.createMemberInternal(newMember).getMemberUsername();
        });
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
