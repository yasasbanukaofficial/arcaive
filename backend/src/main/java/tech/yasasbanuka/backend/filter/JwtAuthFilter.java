package tech.yasasbanuka.backend.filter;

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
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import tech.yasasbanuka.backend.util.JwtUtil;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthFilter extends OncePerRequestFilter {
    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

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
            } catch (Exception e) {
                log.error("Authentication failed: {}", e.getMessage());
            }
        }
        filterChain.doFilter(request, response);
    }
}
