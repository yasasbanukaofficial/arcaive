package tech.yasasbanuka.backend.service.impl;

import dev.langchain4j.agentic.AgenticServices;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.io.RandomAccessReadBufferedFile;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import tech.yasasbanuka.backend.Model;
import tech.yasasbanuka.backend.agents.CVAchievementAgent;
import tech.yasasbanuka.backend.agents.CVAnalyzerAgent;
import tech.yasasbanuka.backend.dto.AtomicAchievementDTO;
import tech.yasasbanuka.backend.dto.AtomicSkillResponseDTO;
import tech.yasasbanuka.backend.dto.LinkedAccountDTO;
import tech.yasasbanuka.backend.dto.MemberDTO;
import tech.yasasbanuka.backend.dto.MfaDTO;
import tech.yasasbanuka.backend.entity.LinkedAccount;
import tech.yasasbanuka.backend.entity.Member;
import tech.yasasbanuka.backend.exception.AlreadyExistsException;
import tech.yasasbanuka.backend.exception.ResourceNotFoundException;
import tech.yasasbanuka.backend.repo.MemberRepo;
import tech.yasasbanuka.backend.service.MemberService;
import tech.yasasbanuka.backend.service.mapper.MemberMapper;
import tech.yasasbanuka.backend.util.PDFTextExtract;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@Transactional
@Service
public class MemberServiceImpl implements MemberService {
    private final MemberRepo memberRepo;
    private final MemberMapper memberMapper;
    private final PasswordEncoder passwordEncoder;
    private final PDFTextExtract pdfTextExtract;

    @Override
    public MemberDTO createMember(MemberDTO memberDTO) {
        if (memberRepo.existsByEmail(memberDTO.getMemberEmail())) {
            throw new AlreadyExistsException("An account with this email already exists.");
        }
        return memberMapper.toDTO(memberRepo.save(memberMapper.toEntity(memberDTO)));
    }

    @Override
    public MemberDTO updateMember(MemberDTO memberDTO) {
        Member existingMember = memberRepo.findById(memberDTO.getMemberId())
                .orElseThrow(() -> new ResourceNotFoundException("Member not found. The account may have been deleted."));
        memberMapper.updateMember(memberDTO, existingMember);
        if (memberDTO.getPassword() != null && !memberDTO.getPassword().isBlank()) {
            existingMember.setHashedPassword(passwordEncoder.encode(memberDTO.getPassword()));
        }
        return memberMapper.toDTO(memberRepo.save(existingMember));
    }

    @Override
    public MemberDTO updateMemberByUsername(String username, MemberDTO memberDTO) {
        Member existingMember = memberRepo.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with username: " + memberDTO.getMemberUsername()));
        memberMapper.updateMember(memberDTO, existingMember);
        if (memberDTO.getPassword() != null && !memberDTO.getPassword().isBlank()) {
            existingMember.setHashedPassword(passwordEncoder.encode(memberDTO.getPassword()));
        }
        return memberMapper.toDTO(memberRepo.save(existingMember));
    }

    @Override
    public void deleteMember(UUID memberId) {
        memberRepo.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found. The account may have already been deleted."));
        memberRepo.deleteById(memberId);
    }

    @Override
    public MemberDTO getMember(UUID memberId) {
        return memberMapper.toDTO(memberRepo.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found. Please check the ID and try again.")));
    }

    @Override
    public MemberDTO getMemberByUsername(String username) {
        return memberMapper.toDTO(memberRepo.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with username: " + username)));
    }

    @Override
    public MemberDTO getMemberByEmail(String email) {
        return memberMapper.toDTO(memberRepo.findByEmail(email)
                .orElse(null));
    }

    @Override
    public List<MemberDTO> getAllMembers() {
        return memberRepo.findAll().stream().map(memberMapper::toDTO).toList();
    }

    @Override
    public void changePassword(String username, String currentPassword, String newPassword) {
        Member existingMember = memberRepo.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with username: " + username));
        if (existingMember.getHashedPassword() != null) {
            if (currentPassword == null || currentPassword.isBlank()) {
                throw new BadCredentialsException("Current password is required.");
            }
            if (!passwordEncoder.matches(currentPassword, existingMember.getHashedPassword())) {
                throw new BadCredentialsException("Current password is incorrect.");
            }
            if (passwordEncoder.matches(newPassword, existingMember.getHashedPassword())) {
                throw new IllegalArgumentException("New password cannot be the same as your current password.");
            }
        }
        existingMember.setHashedPassword(passwordEncoder.encode(newPassword));
        memberRepo.save(existingMember);
    }

    @Override
    public MemberDTO updateMfaByUsername(String username, MfaDTO mfa) {
        Member existingMember = memberRepo.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with username: " + username));
        existingMember.setMfa(memberMapper.mfaDtoToMfa(mfa));
        return memberMapper.toDTO(memberRepo.save(existingMember));
    }

    @Override
    public MemberDTO updateLinkedAccountsByUsername(String username, List<LinkedAccountDTO> linkedAccounts) {
        Member existingMember = memberRepo.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with username: " + username));
        existingMember.setLinkedAccounts(
                linkedAccounts.stream().map(dto -> LinkedAccount.builder()
                        .provider(dto.getProvider())
                        .label(dto.getLabel())
                        .connected(dto.isConnected())
                        .email(dto.getEmail())
                        .url(dto.getUrl())
                        .build()
                ).toList()
        );
        return memberMapper.toDTO(memberRepo.save(existingMember));
    }

    @Override
    public MemberDTO extractMemberDetails(MultipartFile file) {
        String extractedText = pdfTextExtract.extract(file);
        CVAnalyzerAgent cvAnalyzerAgent = AgenticServices
                .agentBuilder(CVAnalyzerAgent.class)
                .chatModel(Model.getModel())
                .outputKey("extractedMember")
                .build();
        return cvAnalyzerAgent.extractMemberFromCV(extractedText);
    }

    @Override
    public AtomicSkillResponseDTO extractAtomicSkillsFromCV(MultipartFile file) {
        String extractedText = pdfTextExtract.extract(file);
        CVAchievementAgent cvAchievementAgent = AgenticServices
                .agentBuilder(CVAchievementAgent.class)
                .chatModel(Model.getModel())
                .outputKey("atomicSkills")
                .build();
        return cvAchievementAgent.extract(extractedText);
    }

}
