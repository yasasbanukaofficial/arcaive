package tech.yasasbanuka.backend.config;

import io.github.bucket4j.Bucket;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

@Slf4j
@Configuration
public class RateLimitConfig {
    @Bean
    public Bucket bucket() {
        log.info("Initializing rate limiter with capacity of 10 requests and refill rate of 1 token per second");
        return Bucket.builder()
                .addLimit(limit -> limit.capacity(10).refillGreedy(1, Duration.ofSeconds(1)))
                .build();
    }
}
