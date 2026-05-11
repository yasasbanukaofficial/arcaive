package tech.yasasbanuka.backend.service;

import tech.yasasbanuka.backend.dto.member.MemberCreateRequestDTO;

public interface VerificationService {
    String generateCode(String email, MemberCreateRequestDTO registrationData);
    boolean verifyCode(String email, String code);
    MemberCreateRequestDTO getRegistrationData(String email);
    void clearVerification(String email);
}
