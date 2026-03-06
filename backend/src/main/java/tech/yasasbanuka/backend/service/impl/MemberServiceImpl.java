package tech.yasasbanuka.backend.service.impl;

import dev.langchain4j.agentic.AgenticServices;
import dev.langchain4j.model.openai.OpenAiChatModel;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import tech.yasasbanuka.backend.agents.CareerIntelligenceAgent;
import tech.yasasbanuka.backend.agents.CVAnalyzerAgent;
import tech.yasasbanuka.backend.dto.member.*;
import tech.yasasbanuka.backend.dto.skill.AtomicSkillResponseDTO;
import tech.yasasbanuka.backend.entity.LinkedAccount;
import tech.yasasbanuka.backend.entity.Member;
import tech.yasasbanuka.backend.exception.AlreadyExistsException;
import tech.yasasbanuka.backend.exception.ResourceNotFoundException;
import tech.yasasbanuka.backend.repo.MemberRepo;
import tech.yasasbanuka.backend.service.MemberService;
import tech.yasasbanuka.backend.service.mapper.MemberMapper;
import tech.yasasbanuka.backend.util.PDFTextExtract;

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
    private final OpenAiChatModel openAiChatModel;

    @Override
    public MemberResponseDTO createMember(MemberCreateRequestDTO dto) {
        if (memberRepo.existsByEmail(dto.getMemberEmail())) {
            throw new AlreadyExistsException("An account with this email already exists.");
        }
        Member entity = memberMapper.createRequestToEntity(dto);
        entity.setHashedPassword(passwordEncoder.encode(dto.getPassword()));
        return memberMapper.toResponseDTO(memberRepo.save(entity));
    }

    @Override
    public MemberResponseDTO createMemberInternal(MemberInternalDTO dto) {
        if (memberRepo.existsByEmail(dto.getMemberEmail())) {
            throw new AlreadyExistsException("An account with this email already exists.");
        }
        Member entity = memberMapper.internalDtoToEntity(dto);
        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            entity.setHashedPassword(passwordEncoder.encode(dto.getPassword()));
        }
        return memberMapper.toResponseDTO(memberRepo.save(entity));
    }

    @Override
    public MemberResponseDTO updateMember(MemberInternalDTO dto) {
        Member existingMember = memberRepo.findById(dto.getMemberId())
                .orElseThrow(() -> new ResourceNotFoundException("Member not found. The account may have been deleted."));
        memberMapper.updateFromInternalDTO(dto, existingMember);
        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            existingMember.setHashedPassword(passwordEncoder.encode(dto.getPassword()));
        }
        return memberMapper.toResponseDTO(memberRepo.save(existingMember));
    }

    @Override
    public MemberResponseDTO updateMemberByUsername(String username, MemberUpdateRequestDTO dto) {
        Member existingMember = memberRepo.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with username: " + username));
        memberMapper.updateRequestToEntity(dto, existingMember);
        return memberMapper.toResponseDTO(memberRepo.save(existingMember));
    }

    @Override
    public void deleteMember(UUID memberId) {
        memberRepo.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found. The account may have already been deleted."));
        memberRepo.deleteById(memberId);
    }

    @Override
    public MemberResponseDTO getMember(UUID memberId) {
        return memberMapper.toResponseDTO(memberRepo.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found. Please check the ID and try again.")));
    }

    @Override
    public MemberResponseDTO getMemberByUsername(String username) {
        return memberMapper.toResponseDTO(memberRepo.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with username: " + username)));
    }

    @Override
    public MemberInternalDTO getMemberInternalByEmail(String email) {
        return memberMapper.toInternalDTO(memberRepo.findByEmail(email).orElse(null));
    }

    @Override
    public List<MemberResponseDTO> getAllMembers() {
        return memberRepo.findAll().stream().map(memberMapper::toResponseDTO).toList();
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
    public MemberResponseDTO updateMfaByUsername(String username, MfaUpdateRequestDTO mfa) {
        Member existingMember = memberRepo.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with username: " + username));
        existingMember.setMfa(memberMapper.mfaDtoToMfa(mfa));
        return memberMapper.toResponseDTO(memberRepo.save(existingMember));
    }

    @Override
    public MemberResponseDTO updateLinkedAccountsByUsername(String username, List<LinkedAccountDTO> linkedAccounts) {
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
        return memberMapper.toResponseDTO(memberRepo.save(existingMember));
    }

    @Override
    public MemberInternalDTO extractMemberDetails(MultipartFile file) {
        String extractedText = pdfTextExtract.extract(file);
        CVAnalyzerAgent cvAnalyzerAgent = AgenticServices
                .agentBuilder(CVAnalyzerAgent.class)
                .chatModel(openAiChatModel)
                .outputKey("extractedMember")
                .build();
        return cvAnalyzerAgent.extractMemberFromCV(extractedText);
    }

    @Override
    public AtomicSkillResponseDTO extractAtomicSkillsFromCV(MultipartFile file) {
        String extractedText = pdfTextExtract.extract(file);
        CareerIntelligenceAgent careerIntelligenceAgent = AgenticServices
                .agentBuilder(CareerIntelligenceAgent.class)
                .chatModel(openAiChatModel)
                .outputKey("atomicSkills")
                .build();
        return careerIntelligenceAgent.extract(extractedText);
    }
}
