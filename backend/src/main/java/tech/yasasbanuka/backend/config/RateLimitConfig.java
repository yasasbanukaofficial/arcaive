package tech.yasasbanuka.backend.config;

import io.github.bucket4j.BucketConfiguration;
import io.github.bucket4j.distributed.proxy.ProxyManager;
import io.github.bucket4j.redis.lettuce.cas.LettuceBasedProxyManager;
import io.lettuce.core.RedisClient;
import io.lettuce.core.api.StatefulRedisConnection;
import io.lettuce.core.codec.ByteArrayCodec;
import io.lettuce.core.codec.RedisCodec;
import io.lettuce.core.codec.StringCodec;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

@Slf4j
@Configuration
public class RateLimitConfig {
    @Value("${spring.data.redis.host}")
    private String redisHost;

    @Value("${spring.data.redis.port}")
    private int redisPort;

    @Value("${rate-limit.capacity:10}")
    private long capacity;

    @Value("${rate-limit.refill-tokens:1}")
    private long refillTokens;

    @Value("${rate-limit.refill-duration-seconds:1}")
    private long refillDurationSeconds;

    @Bean
    public RedisClient redisClient() {
        log.info("Initializing Redis client with host: {} and port: {}", redisHost, redisPort);
        try {
            RedisClient client = RedisClient.create("redis://" + redisHost + ":" + redisPort);
            log.info("Redis client initialized successfully");
            return client;
        } catch (Exception e) {
            log.error("Failed to initialize Redis client: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Bean
    public StatefulRedisConnection<String, byte[]> redisConnection(RedisClient redisClient) {
        log.info("Establishing Redis connection");
        try {
            StatefulRedisConnection<String, byte[]> connection = redisClient.connect(RedisCodec.of(StringCodec.UTF8, ByteArrayCodec.INSTANCE));
            log.info("Redis connection established successfully");
            return connection;
        } catch (Exception e) {
            log.error("Failed to establish Redis connection: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Bean
    public LettuceBasedProxyManager<String> proxyManager(StatefulRedisConnection<String, byte[]> redisConnection) {
        log.info("Initializing Lettuce-based proxy manager for rate limiting");
        try {
            LettuceBasedProxyManager<String> proxyManager = LettuceBasedProxyManager.builderFor(redisConnection).build();
            log.info("Lettuce-based proxy manager initialized successfully");
            return proxyManager;
        } catch (Exception e) {
            log.error("Failed to initialize proxy manager: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Bean
    public BucketConfiguration bucketConfiguration() {
        log.info("Configuring rate limit bucket - capacity: {}, refill tokens: {}, refill duration: {}s",
                capacity, refillTokens, refillDurationSeconds);
        try {
            BucketConfiguration config = BucketConfiguration.builder()
                    .addLimit(limit -> limit
                            .capacity(capacity)
                            .refillGreedy(refillTokens, Duration.ofSeconds(refillDurationSeconds))
                    ).build();
            log.info("Bucket configuration created successfully");
            return config;
        } catch (Exception e) {
            log.error("Failed to create bucket configuration: {}", e.getMessage(), e);
            throw e;
        }
    }
}