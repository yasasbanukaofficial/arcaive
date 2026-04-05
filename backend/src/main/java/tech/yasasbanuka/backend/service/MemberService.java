package tech.yasasbanuka.backend.service;

import jakarta.validation.constraints.NotNull;
import org.springframework.web.multipart.MultipartFile;
import tech.yasasbanuka.backend.dto.job.JobDetailsDTO;
import tech.yasasbanuka.backend.dto.member.*;
import tech.yasasbanuka.backend.dto.skill.AtomicSkillResponseDTO;
import tech.yasasbanuka.backend.dto.usage.UsageQuotaResponseDTO;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface MemberService {
    MemberResponseDTO createMember(MemberCreateRequestDTO dto);
    MemberResponseDTO createMemberInternal(MemberInternalDTO dto);
    MemberResponseDTO updateMember(MemberInternalDTO dto);
    MemberResponseDTO updateMemberByUsername(String username, MemberUpdateRequestDTO dto);
    void deleteMember(UUID memberId);
    MemberResponseDTO getMember(UUID memberId);
    MemberResponseDTO getMemberByUsername(String username);
    UsageQuotaResponseDTO getUsageQuotaByUsername(String username);
    MemberInternalDTO getMemberInternalByEmail(String email);
    List<MemberResponseDTO> getAllMembers();
    void changePassword(String username, String currentPassword, String newPassword);
    MemberResponseDTO updateMfaByUsername(String username, MfaUpdateRequestDTO mfa);
    MemberResponseDTO updateLinkedAccountsByUsername(String username, List<LinkedAccountDTO> linkedAccounts);
    MemberResponseDTO updateJobDetailsByUsername(String username, JobDetailsDTO dto);
    MemberInternalDTO extractMemberDetails(MultipartFile file);
    OnboardingAutofillResponseDTO extractOnboardingDetails(MultipartFile file);
    AtomicSkillResponseDTO extractAtomicSkillsFromCV(MultipartFile file);
}
