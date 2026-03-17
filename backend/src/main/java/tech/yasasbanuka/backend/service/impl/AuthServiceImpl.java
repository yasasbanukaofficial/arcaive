package tech.yasasbanuka.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import tech.yasasbanuka.backend.dto.auth.AuthRequestDTO;
import tech.yasasbanuka.backend.dto.auth.AuthResponseDTO;
import tech.yasasbanuka.backend.dto.member.MemberCreateRequestDTO;
import tech.yasasbanuka.backend.entity.Member;
import tech.yasasbanuka.backend.entity.Subscription;
import tech.yasasbanuka.backend.exception.AlreadyExistsException;
import tech.yasasbanuka.backend.exception.EmailNotFoundException;
import tech.yasasbanuka.backend.repo.MemberRepo;
import tech.yasasbanuka.backend.service.AuthService;
import tech.yasasbanuka.backend.service.mapper.MemberMapper;
import tech.yasasbanuka.backend.util.JwtUtil;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final MemberRepo memberRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final MemberMapper memberMapper;

    @Override
    public AuthResponseDTO authenticate(AuthRequestDTO dto) {
        Member member = memberRepo.findByEmail(dto.getEmail())
                .orElseThrow(() -> new EmailNotFoundException("No account found with this email address."));
        if (!passwordEncoder.matches(dto.getPassword(), member.getHashedPassword())) {
            throw new BadCredentialsException("Incorrect password.");
        }
        String token = jwtUtil.generateToken(member.getUsername());
        return new AuthResponseDTO(token);
    }

    @Override
    public void register(MemberCreateRequestDTO dto) {
        if (memberRepo.existsByEmail(dto.getMemberEmail())) {
            throw new AlreadyExistsException("An account with this email already exists. Please sign in instead.");
        }

        Member newUser = memberMapper.createRequestToEntity(dto);
        newUser.setHashedPassword(passwordEncoder.encode(dto.getPassword()));

        String username = dto.getMemberEmail().split("@")[0];
        newUser.setUsername(username);

        Instant endsAt = Instant.now().plus(30, ChronoUnit.DAYS);
        Instant renewsAt = endsAt.plus(1, ChronoUnit.DAYS);
        Subscription freeSub = Subscription.builder()
            .providerId("explorer")
            .status("active")
            .variantId("Explorer")
            .endsAt(endsAt)
            .renewsAt(renewsAt)
            .build();
        newUser.setSubscription(freeSub);
        freeSub.setMember(newUser);

        memberRepo.save(newUser);
    }
}
