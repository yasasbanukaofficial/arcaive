package tech.yasasbanuka.backend.service.impl;

import io.github.bucket4j.Bucket;
import io.github.bucket4j.BucketConfiguration;
import io.github.bucket4j.redis.lettuce.cas.LettuceBasedProxyManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import tech.yasasbanuka.backend.service.RateLimitService;

@Service
@RequiredArgsConstructor
@Slf4j
public class RateLimitServiceImpl implements RateLimitService {
    private final LettuceBasedProxyManager<String> proxyManager;
    private final BucketConfiguration bucketConfiguration;

    @Override
    public Bucket resolveBucket(String key) {
        log.debug("Resolving rate limit bucket for key: {}", key);
        String redisKey = "rate.limit:" + key;
        try {
            Bucket bucket = proxyManager.builder()
                    .build(redisKey, () -> bucketConfiguration);
            log.debug("Successfully resolved bucket for key: {}", key);
            return bucket;
        } catch (Exception e) {
            log.error("Failed to resolve bucket for key: {}. Error: {}", key, e.getMessage(), e);
            throw e;
        }
    }

    @Override
    public boolean tryConsume(String key) {
        log.debug("Attempting to consume 1 token for key: {}", key);
        try {
            boolean consumed = resolveBucket(key).tryConsume(1);
            if (consumed) {
                log.debug("Successfully consumed 1 token for key: {}", key);
            } else {
                log.warn("Rate limit exceeded for key: {}. Token consumption failed.", key);
            }
            return consumed;
        } catch (Exception e) {
            log.error("Error during token consumption for key: {}. Error: {}", key, e.getMessage(), e);
            throw e;
        }
    }

    @Override
    public boolean tryConsume(String key, long tokens) {
        log.debug("Attempting to consume {} token(s) for key: {}", tokens, key);
        try {
            boolean consumed = resolveBucket(key).tryConsume(tokens);
            if (consumed) {
                log.debug("Successfully consumed {} token(s) for key: {}", tokens, key);
            } else {
                log.warn("Rate limit exceeded for key: {}. Failed to consume {} token(s).", key, tokens);
            }
            return consumed;
        } catch (Exception e) {
            log.error("Error during token consumption for key: {}. Tokens: {}. Error: {}", key, tokens, e.getMessage(), e);
            throw e;
        }
    }
}