package tech.yasasbanuka.backend.service;

import io.github.bucket4j.Bucket;

public interface RateLimitService {
    Bucket resolveBucket(String key);
    boolean tryConsume(String key);
    boolean tryConsume(String key, long tokens);
}
