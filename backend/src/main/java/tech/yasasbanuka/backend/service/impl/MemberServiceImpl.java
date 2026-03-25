package tech.yasasbanuka.backend.service.impl;

import dev.langchain4j.agentic.AgenticServices;
import dev.langchain4j.model.openai.OpenAiChatModel;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import tech.yasasbanuka.backend.agents.CareerIntelligenceAgent;
import tech.yasasbanuka.backend.agents.CVAnalyzerAgent;
import tech.yasasbanuka.backend.dto.job.JobDetailsDTO;
import tech.yasasbanuka.backend.dto.member.*;
import tech.yasasbanuka.backend.dto.skill.AtomicSkillResponseDTO;
import tech.yasasbanuka.backend.entity.embeddable.LinkedAccount;
import tech.yasasbanuka.backend.entity.Member;
import tech.yasasbanuka.backend.exception.AlreadyExistsException;
import tech.yasasbanuka.backend.exception.ResourceNotFoundException;
import tech.yasasbanuka.backend.repo.MemberRepo;
import tech.yasasbanuka.backend.service.MemberService;
import tech.yasasbanuka.backend.service.SubscriptionService;
import tech.yasasbanuka.backend.service.mapper.MemberMapper;
import tech.yasasbanuka.backend.util.PDFTextExtract;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@Transactional
@Service
@Slf4j
public class MemberServiceImpl implements MemberService {
    private final MemberRepo memberRepo;
    private final SubscriptionService subscriptionService;
    private final MemberMapper memberMapper;
    private final PasswordEncoder passwordEncoder;
    private final PDFTextExtract pdfTextExtract;
    private final OpenAiChatModel openAiChatModel;

    @Override
    public MemberResponseDTO createMember(MemberCreateRequestDTO dto) {
        log.info("Creating new member with email: {}", dto.getMemberEmail());
        if (memberRepo.existsByEmail(dto.getMemberEmail())) {
            log.warn("Member creation failed: Email {} already exists", dto.getMemberEmail());
            throw new AlreadyExistsException("An account with this email already exists.");
        }
        Member entity = memberMapper.createRequestToEntity(dto);
        entity.setHashedPassword(passwordEncoder.encode(dto.getPassword()));
        MemberResponseDTO response = memberMapper.toResponseDTO(memberRepo.save(entity));
        log.info("Member created successfully with ID: {}", response.getMemberId());
        return response;
    }

    @Override
    public MemberResponseDTO createMemberInternal(MemberInternalDTO dto) {
        log.info("Creating internal member with email: {}", dto.getMemberEmail());
        if (memberRepo.existsByEmail(dto.getMemberEmail())) {
            log.warn("Internal member creation failed: Email {} already exists", dto.getMemberEmail());
            throw new AlreadyExistsException("An account with this email already exists.");
        }
        Member entity = memberMapper.internalDtoToEntity(dto);
        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            entity.setHashedPassword(passwordEncoder.encode(dto.getPassword()));
        }
        MemberResponseDTO response = memberMapper.toResponseDTO(memberRepo.save(entity));
        log.info("Internal member created successfully with ID: {}", response.getMemberId());
        return response;
    }

    @Override
    public MemberResponseDTO updateMember(MemberInternalDTO dto) {
        log.info("Updating member with ID: {}", dto.getMemberId());
        Member existingMember = memberRepo.findById(dto.getMemberId())
                .orElseThrow(() -> {
                    log.error("Member update failed: ID {} not found", dto.getMemberId());
                    return new ResourceNotFoundException("Member not found. The account may have been deleted.");
                });
        memberMapper.updateFromInternalDTO(dto, existingMember);
        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            existingMember.setHashedPassword(passwordEncoder.encode(dto.getPassword()));
        }
        MemberResponseDTO response = memberMapper.toResponseDTO(memberRepo.save(existingMember));
        log.info("Member updated successfully with ID: {}", response.getMemberId());
        return response;
    }

    @Override
    public MemberResponseDTO updateMemberByUsername(String username, MemberUpdateRequestDTO dto) {
        log.info("Updating member with username: {}", username);
        Member existingMember = memberRepo.findByUsername(username)
                .orElseThrow(() -> {
                    log.error("Member update failed: Username {} not found", username);
                    return new ResourceNotFoundException("Member not found with username: " + username);
                });
        memberMapper.updateRequestToEntity(dto, existingMember);
        MemberResponseDTO response = memberMapper.toResponseDTO(memberRepo.save(existingMember));
        log.info("Member updated successfully for username: {}", username);
        return response;
    }

    @Override
    public void deleteMember(UUID memberId) {
        log.info("Deleting member with ID: {}", memberId);
        memberRepo.findById(memberId)
                .orElseThrow(() -> {
                    log.error("Member deletion failed: ID {} not found", memberId);
                    return new ResourceNotFoundException("Member not found. The account may have already been deleted.");
                });
        memberRepo.deleteById(memberId);
        log.info("Member deleted successfully with ID: {}", memberId);
    }

    @Override
    public MemberResponseDTO getMember(UUID memberId) {
        log.info("Fetching member with ID: {}", memberId);
        return memberMapper.toResponseDTO(memberRepo.findById(memberId)
                .orElseThrow(() -> {
                    log.error("Member fetch failed: ID {} not found", memberId);
                    return new ResourceNotFoundException("Member not found. Please check the ID and try again.");
                }));
    }

    @Override
    public MemberResponseDTO getMemberByUsername(String username) {
        log.info("Fetching member with username: {}", username);
        return memberMapper.toResponseDTO(memberRepo.findByUsername(username)
                .orElseThrow(() -> {
                    log.error("Member fetch failed: Username {} not found", username);
                    return new ResourceNotFoundException("Member not found with username: " + username);
                }));
    }

    @Override
    public MemberInternalDTO getMemberInternalByEmail(String email) {
        log.debug("Fetching internal member by email: {}", email);
        return memberMapper.toInternalDTO(memberRepo.findByEmail(email).orElse(null));
    }

    @Override
    public List<MemberResponseDTO> getAllMembers() {
        log.info("Fetching all members");
        return memberRepo.findAll().stream().map(memberMapper::toResponseDTO).toList();
    }

    @Override
    public void changePassword(String username, String currentPassword, String newPassword) {
        log.info("Changing password for user: {}", username);
        Member existingMember = memberRepo.findByUsername(username)
                .orElseThrow(() -> {
                    log.error("Password change failed: Username {} not found", username);
                    return new ResourceNotFoundException("Member not found with username: " + username);
                });
        if (existingMember.getHashedPassword() != null) {
            if (currentPassword == null || currentPassword.isBlank()) {
                log.warn("Password change failed: Current password is required for user {}", username);
                throw new BadCredentialsException("Current password is required.");
            }
            if (!passwordEncoder.matches(currentPassword, existingMember.getHashedPassword())) {
                log.warn("Password change failed: Incorrect current password for user {}", username);
                throw new BadCredentialsException("Current password is incorrect.");
            }
            if (passwordEncoder.matches(newPassword, existingMember.getHashedPassword())) {
                log.warn("Password change failed: New password same as current for user {}", username);
                throw new IllegalArgumentException("New password cannot be the same as your current password.");
            }
        }
        existingMember.setHashedPassword(passwordEncoder.encode(newPassword));
        memberRepo.save(existingMember);
        log.info("Password changed successfully for user: {}", username);
    }

    @Override
    public MemberResponseDTO updateMfaByUsername(String username, MfaUpdateRequestDTO mfa) {
        log.info("Updating MFA settings for user: {}", username);
        Member existingMember = memberRepo.findByUsername(username)
                .orElseThrow(() -> {
                    log.error("MFA update failed: Username {} not found", username);
                    return new ResourceNotFoundException("Member not found with username: " + username);
                });
        existingMember.setMfa(memberMapper.mfaDtoToMfa(mfa));
        MemberResponseDTO response = memberMapper.toResponseDTO(memberRepo.save(existingMember));
        log.info("MFA settings updated successfully for user: {}", username);
        return response;
    }

    @Override
    public MemberResponseDTO updateLinkedAccountsByUsername(String username, List<LinkedAccountDTO> linkedAccounts) {
        log.info("Updating linked accounts for user: {}", username);
        Member existingMember = memberRepo.findByUsername(username)
                .orElseThrow(() -> {
                    log.error("Linked accounts update failed: Username {} not found", username);
                    return new ResourceNotFoundException("Member not found with username: " + username);
                });
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
        MemberResponseDTO response = memberMapper.toResponseDTO(memberRepo.save(existingMember));
        log.info("Linked accounts updated successfully for user: {}", username);
        return response;
    }

    @Override
    public MemberResponseDTO updateJobDetailsByUsername(String username, JobDetailsDTO dto) {
        log.info("Updating job details for user: {}", username);
        Member existingMember = memberRepo.findByUsername(username)
                .orElseThrow(() -> {
                    log.error("Job details update failed: Username {} not found", username);
                    return new ResourceNotFoundException("Member not found with username: " + username);
                });
        existingMember.setJobRole(dto.getJobRole());
        existingMember.setExperience(dto.getExperience());
        existingMember.setCountry(dto.getCountry());
        MemberResponseDTO response = memberMapper.toResponseDTO(memberRepo.save(existingMember));
        log.info("Job details updated successfully for user: {}", username);
        return response;
    }

    @Override
    public MemberInternalDTO extractMemberDetails(MultipartFile file) {
        log.info("Extracting member details from CV file: {}", file.getOriginalFilename());
        String extractedText = pdfTextExtract.extract(file);
        CVAnalyzerAgent cvAnalyzerAgent = AgenticServices
                .agentBuilder(CVAnalyzerAgent.class)
                .chatModel(openAiChatModel)
                .build();
        MemberInternalDTO result = cvAnalyzerAgent.extractMemberFromCV(extractedText);
        log.info("Member details extracted successfully from CV");
        return result;
    }

    @Override
    public AtomicSkillResponseDTO extractAtomicSkillsFromCV(MultipartFile file) {
        log.info("Extracting atomic skills from CV file: {}", file.getOriginalFilename());
        String extractedText = pdfTextExtract.extract(file);
        CareerIntelligenceAgent careerIntelligenceAgent = AgenticServices
                .agentBuilder(CareerIntelligenceAgent.class)
                .chatModel(openAiChatModel)
                .build();
        AtomicSkillResponseDTO result = careerIntelligenceAgent.extract(extractedText);
        log.info("Atomic skills extracted successfully from CV");
        return result;
    }
}
