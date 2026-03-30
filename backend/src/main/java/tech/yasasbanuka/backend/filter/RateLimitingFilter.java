package tech.yasasbanuka.backend.filter;

import io.github.bucket4j.Bucket;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import tech.yasasbanuka.backend.config.RateLimitConfig;
import tech.yasasbanuka.backend.service.RateLimitService;

import java.io.IOException;

@Component
@Slf4j
@RequiredArgsConstructor
public class RateLimitingFilter extends OncePerRequestFilter {
    private final RateLimitService rateLimitService;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();
        return path.startsWith("/api/v1/webhooks/")
                || path.startsWith("/v3/api-docs")
                || path.startsWith("/swagger-ui");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String requestUri = request.getRequestURI();
        String method = request.getMethod();
        String remoteAddr = request.getRemoteAddr();
        String key = resolveKey(request);

        log.debug("Processing rate limit check for {} {} from {} with resolved key: {}", method, requestUri, remoteAddr, key);

        try {
            if (rateLimitService.tryConsume(key)) {
                log.debug("Rate limit check passed for key: {} - Request allowed", key);
                filterChain.doFilter(request, response);
            } else {
                log.warn("Rate limit exceeded for key: {} - Rejecting request {} {} from {}", key, method, requestUri, remoteAddr);
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.setContentType("application/json");
                response.getWriter().write("""
                        {"error": "Too Many Requests", "message": "Rate limit exceeded. Try again later."}
                        """);
                log.info("Rate limit response (429) sent to client for key: {}", key);
            }
        } catch (Exception e) {
            log.error("Error during rate limit processing for key: {} - Request: {} {} from {}", key, method, requestUri, remoteAddr, e);
            throw e;
        }
    }

    private String resolveKey(HttpServletRequest request) {
        if (request.getUserPrincipal() != null) {
            String username = request.getUserPrincipal().getName();
            log.debug("Resolved rate limit key from user principal: user:{}", username);
            return "user:" + username;
        }
        String apiKey = request.getHeader("X-API-Key");
        if (apiKey != null) {
            log.debug("Resolved rate limit key from X-API-Key header: api:***");
            return "api:" + apiKey;
        }
        String ip = request.getHeader("X-Forwarded-For");
        String resolvedIp = ip != null ? ip.split(",")[0].trim() : request.getRemoteAddr();
        log.debug("Resolved rate limit key from IP address: ip:{}", resolvedIp);
        return "ip:" + resolvedIp;
    }
}