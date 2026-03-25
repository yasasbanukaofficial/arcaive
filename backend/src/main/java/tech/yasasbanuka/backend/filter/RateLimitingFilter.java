package tech.yasasbanuka.backend.filter;

import io.github.bucket4j.Bucket;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import tech.yasasbanuka.backend.config.RateLimitConfig;

import java.io.IOException;

@Component
@Slf4j
@RequiredArgsConstructor
public class RateLimitingFilter extends OncePerRequestFilter {
    private final Bucket bucket;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String requestUri = request.getRequestURI();
        String method = request.getMethod();
        String remoteAddr = request.getRemoteAddr();

        log.debug("Rate limit check for {} {} from {}", method, requestUri, remoteAddr);

        if (bucket.tryConsume(1)) {
            log.debug("Request allowed: {} {} from {}", method, requestUri, remoteAddr);
            filterChain.doFilter(request, response);
        } else {
            log.warn("Rate limit exceeded for {} {} from {} - returning 429", method, requestUri, remoteAddr);
            response.setStatus(429);
        }
    }
}