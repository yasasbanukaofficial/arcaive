package tech.yasasbanuka.backend.config;

import dev.langchain4j.model.openai.OpenAiChatModel;
import lombok.RequiredArgsConstructor;
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
                .map(user -> new User(
                        user.getUsername(),
                        user.getHashedPassword(),
                        List.of(new SimpleGrantedAuthority("ROLE_" + user.getTier().name()))
                )).orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public static OpenAiChatModel openAiChatModel() {
        return OpenAiChatModel.builder()
                .modelName("arcee-ai/trinity-large-preview:free")
                .apiKey("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")
                .baseUrl("https://openrouter.ai/api/v1")
                .build();
    }
}
