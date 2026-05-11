package tech.yasasbanuka.backend.service;

import tech.yasasbanuka.backend.dto.auth.AuthRequestDTO;
import tech.yasasbanuka.backend.dto.auth.AuthResponseDTO;
import tech.yasasbanuka.backend.dto.member.MemberCreateRequestDTO;

public interface AuthService {
    AuthResponseDTO authenticate(AuthRequestDTO dto);
    void register(MemberCreateRequestDTO dto);
    void verifyEmail(String email, String code);
    void resendVerificationCode(String email);
}
