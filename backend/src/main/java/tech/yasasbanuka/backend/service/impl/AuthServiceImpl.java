package tech.yasasbanuka.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import tech.yasasbanuka.backend.dto.AuthDTO;
import tech.yasasbanuka.backend.dto.AuthResponseDTO;
import tech.yasasbanuka.backend.dto.MemberDTO;
import tech.yasasbanuka.backend.entity.Member;
import tech.yasasbanuka.backend.entity.MemberTier;
import tech.yasasbanuka.backend.entity.Mfa;
import tech.yasasbanuka.backend.exception.AlreadyExistsException;
import tech.yasasbanuka.backend.exception.EmailNotFoundException;
import tech.yasasbanuka.backend.repo.MemberRepo;
import tech.yasasbanuka.backend.service.mapper.MemberMapper;
import tech.yasasbanuka.backend.util.JwtUtil;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl {
    private final MemberRepo memberRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final MemberMapper memberMapper;

    public AuthResponseDTO authenticate(AuthDTO authDTO) {
        Member member = memberRepo.findByEmail(authDTO.getEmail())
                .orElseThrow(() -> new EmailNotFoundException("User not found with email: " + authDTO.getEmail()));
        if (!passwordEncoder.matches(authDTO.getPassword(), member.getHashedPassword())) {
            throw new BadCredentialsException("This email doesn't exist: " + authDTO.getEmail());
        }
        String token = jwtUtil.generateToken(authDTO.getEmail());
        return new AuthResponseDTO(token);
    }

    public void register(MemberDTO memberDTO) {
        if (memberRepo.existsByEmail(memberDTO.getMemberEmail())) {
            throw new AlreadyExistsException("This email already exists, try login!");
        }
        Member newUser = memberMapper.toEntity(memberDTO);
        newUser.setHashedPassword(passwordEncoder.encode(memberDTO.getPassword()));
        memberRepo.save(newUser);
    }
}