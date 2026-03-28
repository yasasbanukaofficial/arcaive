package tech.yasasbanuka.backend.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import tech.yasasbanuka.backend.dto.auth.AuthRequestDTO;
import tech.yasasbanuka.backend.dto.auth.AuthResponseDTO;
import tech.yasasbanuka.backend.dto.member.MemberCreateRequestDTO;
import tech.yasasbanuka.backend.entity.Member;
import tech.yasasbanuka.backend.entity.Subscription;
import tech.yasasbanuka.backend.entity.UsageQuota;
import tech.yasasbanuka.backend.entity.constants.SubscriptionStatus;
import tech.yasasbanuka.backend.entity.constants.Tier;
import tech.yasasbanuka.backend.exception.AlreadyExistsException;
import tech.yasasbanuka.backend.exception.EmailNotFoundException;
import tech.yasasbanuka.backend.repo.MemberRepo;
import tech.yasasbanuka.backend.service.AuthService;
import tech.yasasbanuka.backend.service.mapper.MemberMapper;
import tech.yasasbanuka.backend.util.JwtUtil;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {
    private final MemberRepo memberRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final MemberMapper memberMapper;

    @Override
    public AuthResponseDTO authenticate(AuthRequestDTO dto) {
        log.info("Attempting to authenticate user with email: {}", dto.getEmail());
        Member member = memberRepo.findByEmail(dto.getEmail())
                .orElseThrow(() -> {
                    log.warn("Authentication failed: No account found for email {}", dto.getEmail());
                    return new EmailNotFoundException("No account found with this email address.");
                });
        if (!passwordEncoder.matches(dto.getPassword(), member.getHashedPassword())) {
            log.warn("Authentication failed: Incorrect password for email {}", dto.getEmail());
            throw new BadCredentialsException("Incorrect password.");
        }
        String token = jwtUtil.generateToken(member.getUsername());
        log.info("User {} authenticated successfully", member.getUsername());
        return new AuthResponseDTO(token);
    }

    @Override
    public void register(MemberCreateRequestDTO dto) {
        log.info("Registering new user with email: {}", dto.getMemberEmail());
        if (memberRepo.existsByEmail(dto.getMemberEmail())) {
            log.warn("Registration failed: Email {} already exists", dto.getMemberEmail());
            throw new AlreadyExistsException("An account with this email already exists. Please sign in instead.");
        }

        Member newUser = memberMapper.createRequestToEntity(dto);
        newUser.setHashedPassword(passwordEncoder.encode(dto.getPassword()));

        String username = dto.getMemberEmail().split("@")[0];
        newUser.setUsername(username);

        Instant now = Instant.now();
        Instant periodEnd = now.plus(30, ChronoUnit.DAYS);

        Subscription freeSub = Subscription.builder()
                .member(newUser)
                .startedAt(now)
                .currentPeriodStart(now)
                .currentPeriodEnd(periodEnd)
                .cancelledAt(null)
                .paymentProvider("explorer")
                .externalSubscriptionId(null)
                .build();

        UsageQuota usageQuota = UsageQuota.builder()
                .member(newUser)
                .periodStart(now)
                .periodEnd(periodEnd)
                .cvAnalysisUsed(0)
                .jobSearchUsed(0)
                .interviewUsed(0)
                .build();
        
        newUser.setSubscription(freeSub);
        newUser.setUsageQuota(usageQuota);

        memberRepo.save(newUser);

        log.info("User {} registered successfully with username: {}", dto.getMemberEmail(), username);
    }
}
