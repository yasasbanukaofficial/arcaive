package tech.yasasbanuka.backend.service.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tech.yasasbanuka.backend.dto.MemberDTO;
import tech.yasasbanuka.backend.entity.Member;
import tech.yasasbanuka.backend.repo.MemberRepo;
import tech.yasasbanuka.backend.service.MemberService;
import tech.yasasbanuka.backend.service.mapper.MemberMapper;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class MemberServiceImpl implements MemberService {
    private final MemberRepo memberRepo;
    private final MemberMapper memberMapper;

    @Override
    public MemberDTO createMember(MemberDTO memberDTO) {
        if(memberRepo.existsByEmail(memberDTO.getMemberEmail())) {
            throw new RuntimeException("Email already exists");
        }
        Member memberEntity = memberMapper.toEntity(memberDTO);
        return memberMapper.toDTO(memberRepo.save(memberEntity));
    }

    @Override
    public MemberDTO updateMember(MemberDTO memberDTO) {
        Member existingMember = memberRepo.findById(memberDTO.getMemberId()).orElseThrow(() -> new RuntimeException("Member not found"));
        memberMapper.updateMember(memberDTO, existingMember);
        return memberMapper.toDTO(memberRepo.save(existingMember));
    }

    @Override
    public void deleteMember(UUID memberId) {
        Member existingMember = memberRepo.findById(memberId).orElseThrow(() -> new RuntimeException("Member not found"));
        memberRepo.deleteById(memberId);
    }

    @Override
    public MemberDTO getMember(UUID memberId) {
        return memberMapper.toDTO(memberRepo.findById(memberId).orElseThrow(() -> new RuntimeException("Member not found")));
    }

    @Override
    public List<MemberDTO> getAllMembers() {
        return memberRepo.findAll().stream().map(memberMapper::toDTO).toList();
    }
}
