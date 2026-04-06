package tech.yasasbanuka.backend.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import tech.yasasbanuka.backend.util.APIResponse;
import tech.yasasbanuka.backend.util.JwtUtil;

import java.io.IOException;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthFilter extends OncePerRequestFilter {
    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;
    private final ObjectMapper objectMapper;

    private static final String LOGIN_REDIRECT_PATH = "/login";

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String jwtToken = null;
        final String username;

        if(request.getCookies() != null) {
            for(Cookie cookie : request.getCookies()) {
                if("access_token".equals(cookie.getName())) {
                    jwtToken = cookie.getValue();
                    break;
                }
            }
        }

        if(jwtToken != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            log.debug("Found JWT token in cookie, attempting validation...");
            try {
                username = jwtUtil.extractMembername(jwtToken);
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                if(jwtUtil.validateToken(jwtToken)) {
                    log.debug("JWT validation successful for user: {}", username);
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            username, null, userDetails.getAuthorities()
                    );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                } else {
                    log.warn("JWT validation failed for user: {}", username);
                }
            } catch (UsernameNotFoundException e) {
                log.error("Authentication failed: {}", e.getMessage());
                SecurityContextHolder.clearContext();
                expireAccessTokenCookie(response);
                response.setStatus(HttpStatus.UNAUTHORIZED.value());
                response.setHeader("X-Redirect-To", LOGIN_REDIRECT_PATH);
                response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                response.setCharacterEncoding("UTF-8");
                objectMapper.writeValue(response.getWriter(), new APIResponse<>(
                        false,
                        HttpStatus.UNAUTHORIZED.value(),
                        "Session is no longer valid. Redirect to login.",
                        Map.of("redirectTo", LOGIN_REDIRECT_PATH, "reason", "user_not_found")
                ));
                return;
            } catch (Exception e) {
                log.error("Authentication failed: {}", e.getMessage());
            }
        }
        filterChain.doFilter(request, response);
    }

    private void expireAccessTokenCookie(HttpServletResponse response) {
        Cookie expiredCookie = new Cookie("access_token", "");
        expiredCookie.setHttpOnly(true);
        expiredCookie.setSecure(true);
        expiredCookie.setPath("/");
        expiredCookie.setMaxAge(0);
        response.addCookie(expiredCookie);
    }
}
