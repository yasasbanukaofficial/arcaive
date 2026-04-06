package tech.yasasbanuka.backend.service;

import tech.yasasbanuka.backend.dto.cv.TailoredCVRequestDTO;
import tech.yasasbanuka.backend.dto.member.MemberProfileDTO;

public interface TailoredCVService {
    MemberProfileDTO tailorCV(String username, TailoredCVRequestDTO request);
}
