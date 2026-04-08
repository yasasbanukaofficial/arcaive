package tech.yasasbanuka.backend.config;

import dev.langchain4j.model.openai.OpenAiChatModel;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.client.RestTemplate;
import tech.yasasbanuka.backend.repo.MemberRepo;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class ApplicationConfig {
    private final MemberRepo memberRepo;

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> {
            log.debug("Loading user by username: {}", username);
            return memberRepo.findByUsername(username)
                    .map(member -> {
                        String tier = (member.getSubscription() != null && member.getSubscription().getTier() != null)
                                ? member.getSubscription().getTier().name()
                                : "EXPLORER";
                        log.debug("User {} found with tier: {}", username, tier);
                        return new User(
                                member.getUsername(),
                                member.getHashedPassword(),
                                List.of(new SimpleGrantedAuthority("ROLE_" + tier))
                        );
                    }).orElseThrow(() -> {
                        log.warn("User not found with username: {}", username);
                        return new UsernameNotFoundException("Member not found with username: " + username);
                    });
        };
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public ObjectMapper objectMapper() {return new ObjectMapper();}

    @Bean
    @Qualifier("aiObjectMapper")
    public ObjectMapper aiObjectMapper(ObjectMapper objectMapper) {
        return objectMapper.copy()
                .setSerializationInclusion(com.fasterxml.jackson.annotation.JsonInclude.Include.NON_EMPTY);
    }
}
