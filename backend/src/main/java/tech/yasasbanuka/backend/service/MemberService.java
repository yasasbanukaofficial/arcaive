package tech.yasasbanuka.backend.service;

import tech.yasasbanuka.backend.dto.LinkedAccountDTO;
import tech.yasasbanuka.backend.dto.MemberDTO;
import tech.yasasbanuka.backend.dto.MfaDTO;

import java.util.List;
import java.util.UUID;

public interface MemberService {
    MemberDTO createMember(MemberDTO member);
    MemberDTO updateMember(MemberDTO member);
    MemberDTO updateMemberByUsername(String username, MemberDTO memberDTO);
    void deleteMember(UUID memberId);
    MemberDTO getMember(UUID memberId);
    MemberDTO getMemberByUsername(String username);
    MemberDTO getMemberByEmail(String email);
    List<MemberDTO> getAllMembers();
    void changePassword(String username, String currentPassword, String newPassword);
    MemberDTO updateMfaByUsername(String username, MfaDTO mfa);
    MemberDTO updateLinkedAccountsByUsername(String username, List<LinkedAccountDTO> linkedAccounts);
}
