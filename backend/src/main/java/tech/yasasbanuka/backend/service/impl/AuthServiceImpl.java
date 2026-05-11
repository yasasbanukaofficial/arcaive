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
import tech.yasasbanuka.backend.service.EmailService;
import tech.yasasbanuka.backend.service.VerificationService;
import tech.yasasbanuka.backend.service.mapper.MemberMapper;
import tech.yasasbanuka.backend.repo.RefreshTokenRepository;
import tech.yasasbanuka.backend.entity.RefreshToken;
import tech.yasasbanuka.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class AuthServiceImpl implements AuthService {
    private final MemberRepo memberRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final MemberMapper memberMapper;
    private final EmailService emailService;
    private final VerificationService verificationService;
    private final RefreshTokenRepository refreshTokenRepository;

    @Value("${jwt.refresh.expiration:${jwt.expiration}}")
    private long refreshExpiration;

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
        
        String accessToken = jwtUtil.generateToken(member.getUsername());
        String refreshToken = createRefreshToken(member);
        
        log.info("User {} authenticated successfully", member.getUsername());
        return new AuthResponseDTO(accessToken, refreshToken);
    }

    @Override
    public AuthResponseDTO refresh(String token) {
        log.info("Attempting to refresh session with token");
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new BadCredentialsException("Invalid refresh token."));

        if (refreshToken.isRevoked()) {
            log.warn("Token reuse detected for user: {}", refreshToken.getMember().getUsername());
            refreshTokenRepository.deleteByMember(refreshToken.getMember());
            throw new BadCredentialsException("Refresh token has been revoked.");
        }

        if (refreshToken.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(refreshToken);
            throw new BadCredentialsException("Refresh token has expired.");
        }

        Member member = refreshToken.getMember();
        String accessToken = jwtUtil.generateToken(member.getUsername());
        
        // Rotate token
        refreshTokenRepository.delete(refreshToken);
        String newRefreshToken = createRefreshToken(member);

        log.info("Session refreshed successfully for user: {}", member.getUsername());
        return new AuthResponseDTO(accessToken, newRefreshToken);
    }

    @Override
    public void logout(String token) {
        log.info("Invalidating refresh token on logout");
        refreshTokenRepository.findByToken(token).ifPresent(t -> {
            t.setRevoked(true);
            refreshTokenRepository.save(t);
        });
    }

    private String createRefreshToken(Member member) {
        RefreshToken refreshToken = refreshTokenRepository.findByMember(member)
                .orElseGet(() -> RefreshToken.builder().member(member).build());
        
        String token = java.util.UUID.randomUUID().toString();
        refreshToken.setToken(token);
        refreshToken.setExpiryDate(Instant.now().plusMillis(refreshExpiration));
        refreshToken.setRevoked(false);
        
        refreshTokenRepository.save(refreshToken);
        return token;
    }

    @Override
    public void register(MemberCreateRequestDTO dto) {
        log.info("Initiating registration for email: {}", dto.getMemberEmail());
        if (memberRepo.existsByEmail(dto.getMemberEmail())) {
            log.warn("Registration failed: Email {} already exists", dto.getMemberEmail());
            throw new AlreadyExistsException("An account with this email already exists. Please sign in instead.");
        }

        String code = verificationService.generateCode(dto.getMemberEmail(), dto);
        emailService.sendVerificationCode(dto.getMemberEmail(), code);
        log.info("Verification code generated and sent to {}", dto.getMemberEmail());
    }

    @Override
    public void verifyEmail(String email, String code) {
        log.info("Verifying email: {} with code: {}", email, code);
        if (!verificationService.verifyCode(email, code)) {
            log.warn("Verification failed for email: {}", email);
            throw new RuntimeException("Invalid or expired verification code.");
        }

        MemberCreateRequestDTO dto = verificationService.getRegistrationData(email);
        if (dto == null) {
            log.warn("No registration data found for email: {}", email);
            throw new RuntimeException("Registration data not found or expired.");
        }

        saveUser(dto);
        verificationService.clearVerification(email);
        log.info("Email {} verified and user saved successfully", email);
    }

    @Override
    public void resendVerificationCode(String email) {
        log.info("Resending verification code to email: {}", email);
        MemberCreateRequestDTO dto = verificationService.getRegistrationData(email);
        if (dto == null) {
            log.warn("Resend failed: No registration data found for email: {}", email);
            throw new RuntimeException("Registration data not found or expired. Please register again.");
        }

        String code = verificationService.generateCode(email, dto);
        emailService.sendVerificationCode(email, code);
        log.info("Verification code re-generated and sent to {}", email);
    }

    private void saveUser(MemberCreateRequestDTO dto) {
        log.info("Saving new user with email: {}", dto.getMemberEmail());

        Member newUser = memberMapper.createRequestToEntity(dto);
        newUser.setHashedPassword(passwordEncoder.encode(dto.getPassword()));

        String username = dto.getMemberEmail().split("@")[0];
        newUser.setUsername(username);

        Instant now = Instant.now();
        Instant periodEnd = now.plus(30, ChronoUnit.DAYS);

        Subscription freeSub = Subscription.builder()
                .member(newUser)
                .tier(Tier.EXPLORER)
                .status(SubscriptionStatus.ACTIVE)
                .startedAt(now)
                .currentPeriodStart(now)
                .currentPeriodEnd(periodEnd)
                .paymentProvider("explorer")
                .build();

        UsageQuota usageQuota = UsageQuota.builder()
                .member(newUser)
                .periodStart(now)
                .periodEnd(periodEnd)
                .cvAnalysisUsed(0)
                .jobSearchUsed(0)
                .interviewUsed(0)
                .autoApplyUsed(0)
                .cvCreationsStored(0)
                .build();

        newUser.setSubscription(freeSub);
        newUser.setUsageQuota(usageQuota);

        memberRepo.save(newUser);
        log.info("User {} saved successfully with username: {}", dto.getMemberEmail(), username);
    }
}
