package tech.yasasbanuka.backend.config;

import dev.langchain4j.model.openai.OpenAiChatModel;
import lombok.RequiredArgsConstructor;
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

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class ApplicationConfig {
    private final MemberRepo memberRepo;

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> memberRepo.findByUsername(username)
                .map(member -> {
                    String tier = (member.getSubscription() != null && member.getSubscription().getVariantId() != null)
                            ? member.getSubscription().getVariantId()
                            : "Explorer";
                    return new User(
                            member.getUsername(),
                            member.getHashedPassword(),
                            List.of(new SimpleGrantedAuthority("ROLE_" + tier))
                    );
                }).orElseThrow(() -> new UsernameNotFoundException("Member not found with username: " + username));
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
