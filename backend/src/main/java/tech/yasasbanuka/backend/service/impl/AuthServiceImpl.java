package tech.yasasbanuka.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import tech.yasasbanuka.backend.dto.AuthDTO;
import tech.yasasbanuka.backend.dto.AuthResponseDTO;
import tech.yasasbanuka.backend.entity.Member;
import tech.yasasbanuka.backend.exception.AlreadyExistsException;
import tech.yasasbanuka.backend.exception.EmailNotFoundException;
import tech.yasasbanuka.backend.repo.MemberRepo;
import tech.yasasbanuka.backend.util.JwtUtil;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl {
    private final MemberRepo memberRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponseDTO authenticate(AuthDTO authDTO) {
        Member member = memberRepo.findByEmail(authDTO.getEmail())
                .orElseThrow(() -> new EmailNotFoundException("User not found with email: " + authDTO.getEmail()));
        if (!passwordEncoder.matches(authDTO.getPassword(), member.getHashedPassword())){
            throw new BadCredentialsException("This email doesn't exist: " + authDTO.getEmail());
        }
        String token = jwtUtil.generateToken(authDTO.getEmail());
        return new AuthResponseDTO(token);
    }
    
    public String register(Member member) {
        if(memberRepo.existsByEmail(member.getEmail())) {
            throw new AlreadyExistsException("This email already exists, try login!");
        }
        Member newUser = Member.builder()
                .fullName(member.getFullName())
                .username(member.getUsername())
                .email(member.getEmail())
                .hashedPassword(passwordEncoder.encode(member.getHashedPassword()))
                .links(member.getLinks())
                .tier(member.getTier())
                .role(member.getRole())
                .mfa(member.getMfa())
                .linkedAccounts(member.getLinkedAccounts())
                .subscription(member.getSubscription())
                .build();
        memberRepo.save(newUser);
        return "User registered successfully!";
    }
}
