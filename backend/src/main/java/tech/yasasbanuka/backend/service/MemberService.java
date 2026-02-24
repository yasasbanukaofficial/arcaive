package tech.yasasbanuka.backend.service;

import tech.yasasbanuka.backend.dto.MemberDTO;

import java.util.List;
import java.util.UUID;

public interface MemberService {
    MemberDTO createMember(MemberDTO member);
    MemberDTO updateMember(MemberDTO member);
    void deleteMember(UUID memberId);
    MemberDTO getMember(UUID memberId);
    List<MemberDTO> getAllMembers();
}
