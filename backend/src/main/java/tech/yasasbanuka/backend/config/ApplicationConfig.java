package tech.yasasbanuka.backend.config;

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
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
