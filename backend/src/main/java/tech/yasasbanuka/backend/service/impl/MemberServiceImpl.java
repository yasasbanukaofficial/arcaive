package tech.yasasbanuka.backend.service.impl;

import dev.langchain4j.agentic.AgenticServices;
import dev.langchain4j.model.openai.OpenAiChatModel;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import tech.yasasbanuka.backend.agents.CareerIntelligenceAgent;
import tech.yasasbanuka.backend.agents.CVAnalyzerAgent;
import tech.yasasbanuka.backend.agents.OnboardingCVAutofillAgent;
import tech.yasasbanuka.backend.dto.job.JobDetailsDTO;
import tech.yasasbanuka.backend.dto.member.*;
import tech.yasasbanuka.backend.dto.skill.AtomicSkillResponseDTO;
import tech.yasasbanuka.backend.dto.usage.UsageQuotaResponseDTO;
import tech.yasasbanuka.backend.entity.Subscription;
import tech.yasasbanuka.backend.entity.UsageQuota;
import tech.yasasbanuka.backend.entity.constants.SubscriptionStatus;
import tech.yasasbanuka.backend.entity.constants.Tier;
import tech.yasasbanuka.backend.entity.embeddable.LinkedAccount;
import tech.yasasbanuka.backend.entity.Member;
import tech.yasasbanuka.backend.exception.AlreadyExistsException;
import tech.yasasbanuka.backend.exception.ResourceNotFoundException;
import tech.yasasbanuka.backend.repo.MemberRepo;
import tech.yasasbanuka.backend.service.MemberService;
import tech.yasasbanuka.backend.service.SubscriptionService;
import tech.yasasbanuka.backend.service.mapper.MemberMapper;
import tech.yasasbanuka.backend.service.mapper.UsageQuotaMapper;
import tech.yasasbanuka.backend.util.PDFTextExtract;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
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
    private final UsageQuotaMapper usageQuotaMapper;
    private final PasswordEncoder passwordEncoder;
    private final PDFTextExtract pdfTextExtract;
    private final OpenAiChatModel openAiChatModel;
    @Qualifier("lowTempOpenAiChatModel")
    private final OpenAiChatModel lowTempOpenAiChatModel;

    private static final int CV_ANALYZER_MAX_CHARS = 18_000;
    private static final int ONBOARDING_MAX_CHARS = 18_000;

    @Override
    public MemberResponseDTO createMember(MemberCreateRequestDTO dto) {
        log.info("Creating new member with email: {}", dto.getMemberEmail());
        if (memberRepo.existsByEmail(dto.getMemberEmail())) {
            log.warn("Member creation failed: Email {} already exists", dto.getMemberEmail());
            throw new AlreadyExistsException("An account with this email already exists.");
        }
        Member entity = memberMapper.createRequestToEntity(dto);
        entity.setHashedPassword(passwordEncoder.encode(dto.getPassword()));
        
        initializeNewMember(entity);
        
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

        initializeNewMember(entity);

        MemberResponseDTO response = memberMapper.toResponseDTO(memberRepo.save(entity));
        log.info("Internal member created successfully with ID: {}", response.getMemberId());
        return response;
    }

    private void initializeNewMember(Member member) {
        Instant now = Instant.now();
        Instant periodEnd = now.plus(30, ChronoUnit.DAYS);

        Subscription freeSub = Subscription.builder()
                .member(member)
                .tier(Tier.EXPLORER)
                .status(SubscriptionStatus.ACTIVE)
                .startedAt(now)
                .currentPeriodStart(now)
                .currentPeriodEnd(periodEnd)
                .paymentProvider("explorer")
                .build();

        UsageQuota usageQuota = UsageQuota.builder()
                .member(member)
                .periodStart(now)
                .periodEnd(periodEnd)
                .cvAnalysisUsed(0)
                .jobSearchUsed(0)
                .interviewUsed(0)
                .autoApplyUsed(0)
                .cvCreationsStored(0)
                .build();

        member.setSubscription(freeSub);
        member.setUsageQuota(usageQuota);
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
    @Transactional(readOnly = true)
    public MemberResponseDTO getMember(UUID memberId) {
        log.info("Fetching member with ID: {}", memberId);
        return memberMapper.toResponseDTO(memberRepo.findById(memberId)
                .orElseThrow(() -> {
                    log.error("Member fetch failed: ID {} not found", memberId);
                    return new ResourceNotFoundException("Member not found. Please check the ID and try again.");
                }));
    }

    @Override
    @Transactional(readOnly = true)
    public MemberResponseDTO getMemberByUsername(String username) {
        log.info("Fetching member with username: {}", username);
        return memberMapper.toResponseDTO(memberRepo.findByUsername(username)
                .orElseThrow(() -> {
                    log.error("Member fetch failed: Username {} not found", username);
                    return new ResourceNotFoundException("Member not found with username: " + username);
                }));
    }

    @Override
    @Transactional(readOnly = true)
    public UsageQuotaResponseDTO getUsageQuotaByUsername(String username) {
        log.info("Fetching usage quota for username: {}", username);
        Member member = memberRepo.findByUsername(username)
                .orElseThrow(() -> {
                    log.error("Usage quota fetch failed: Username {} not found", username);
                    return new ResourceNotFoundException("Member not found with username: " + username);
                });
        return usageQuotaMapper.toResponseDTO(member.getUsageQuota());
    }

    @Override
    @Transactional(readOnly = true)
    public MemberInternalDTO getMemberInternalByEmail(String email) {
        log.debug("Fetching internal member by email: {}", email);
        return memberMapper.toInternalDTO(memberRepo.findByEmail(email).orElse(null));
    }

    @Override
    @Transactional(readOnly = true)
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
        String clippedText = extractedText == null
            ? ""
            : extractedText.substring(0, Math.min(extractedText.length(), CV_ANALYZER_MAX_CHARS));

        CVAnalyzerAgent cvAnalyzerAgent = AgenticServices
                .agentBuilder(CVAnalyzerAgent.class)
                .chatModel(openAiChatModel)
                .build();
        MemberInternalDTO result = cvAnalyzerAgent.extractMemberFromCV(clippedText);
        log.info("Member details extracted successfully from CV");
        return result;
    }

    @Override
    public OnboardingAutofillResponseDTO extractOnboardingDetails(MultipartFile file) {
        log.info("Extracting onboarding details from CV file: {}", file.getOriginalFilename());
        String extractedText = pdfTextExtract.extract(file);
        String clippedText = extractedText == null
                ? ""
                : extractedText.substring(0, Math.min(extractedText.length(), ONBOARDING_MAX_CHARS));

        if (clippedText.isBlank()) {
            log.warn("Onboarding CV extraction skipped because extracted CV text is empty");
            return OnboardingAutofillResponseDTO.builder().build();
        }

        OnboardingCVAutofillAgent onboardingAgent = AgenticServices
                .agentBuilder(OnboardingCVAutofillAgent.class)
                .chatModel(lowTempOpenAiChatModel)
                .build();

        try {
            MemberProfileDTO profile = onboardingAgent.extractOnboardingDetails(clippedText);
            if (!isProfileEmpty(profile)) {
                normalizeProfile(profile);
                log.info("Onboarding details extracted successfully from CV");
                return OnboardingAutofillResponseDTO.builder().profile(profile).build();
            }

            log.warn("Primary onboarding extraction returned empty data, running fallback extractor");
            return extractOnboardingDetailsFromFallback(clippedText);
        } catch (Exception ex) {
            log.warn("Onboarding CV extraction failed, attempting fallback extractor", ex);
            return extractOnboardingDetailsFromFallback(clippedText);
        }
    }

    private OnboardingAutofillResponseDTO extractOnboardingDetailsFromFallback(String clippedText) {
        try {
            CVAnalyzerAgent fallbackAgent = AgenticServices
                    .agentBuilder(CVAnalyzerAgent.class)
                    .chatModel(lowTempOpenAiChatModel)
                    .build();
            MemberInternalDTO fallback = fallbackAgent.extractMemberFromCV(clippedText);
            if (fallback == null) {
                return OnboardingAutofillResponseDTO.builder().build();
            }

            MemberProfileDTO profile = MemberProfileDTO.builder()
                    .jobRole(fallback.getJobRole())
                    .experience(fallback.getExperience())
                    .country(fallback.getCountry())
                    .location(fallback.getLocation() != null && !fallback.getLocation().isBlank()
                            ? fallback.getLocation()
                            : fallback.getCountry())
                    .phone(fallback.getPhone())
                    .summary(fallback.getSummary())
                    .experiences(fallback.getExperiences())
                    .educations(fallback.getEducations())
                    .projects(fallback.getProjects())
                    .skills(fallback.getSkills())
                    .certifications(fallback.getCertifications())
                    .languages(fallback.getLanguages())
                    .build();

            if (isProfileEmpty(profile)) {
                return OnboardingAutofillResponseDTO.builder().build();
            }

            normalizeProfile(profile);
            return OnboardingAutofillResponseDTO.builder().profile(profile).build();
        } catch (Exception fallbackEx) {
            log.warn("Fallback onboarding extraction also failed, returning empty onboarding payload", fallbackEx);
            return OnboardingAutofillResponseDTO.builder().build();
        }
    }

    private void normalizeProfile(MemberProfileDTO profile) {
        if (profile.getLocation() == null || profile.getLocation().isBlank()) {
            profile.setLocation(profile.getCountry());
        }

        if (profile.getExperiences() == null) {
            profile.setExperiences(Collections.emptyList());
        }
        if (profile.getEducations() == null) {
            profile.setEducations(Collections.emptyList());
        }
        if (profile.getProjects() == null) {
            profile.setProjects(Collections.emptyList());
        }
        if (profile.getSkills() == null) {
            profile.setSkills(Collections.emptyList());
        }
        if (profile.getCertifications() == null) {
            profile.setCertifications(Collections.emptyList());
        }
        if (profile.getLanguages() == null) {
            profile.setLanguages(Collections.emptyList());
        }
    }

    private boolean isProfileEmpty(MemberProfileDTO profile) {
        if (profile == null) {
            return true;
        }

        boolean hasScalar = isNotBlank(profile.getJobRole())
                || isNotBlank(profile.getExperience())
                || isNotBlank(profile.getCountry())
                || isNotBlank(profile.getLocation())
                || isNotBlank(profile.getPhone())
                || isNotBlank(profile.getLinkedin())
                || isNotBlank(profile.getSummary());

        boolean hasListData = (profile.getExperiences() != null && !profile.getExperiences().isEmpty())
                || (profile.getEducations() != null && !profile.getEducations().isEmpty())
                || (profile.getProjects() != null && !profile.getProjects().isEmpty())
                || (profile.getSkills() != null && !profile.getSkills().isEmpty())
                || (profile.getCertifications() != null && !profile.getCertifications().isEmpty())
                || (profile.getLanguages() != null && !profile.getLanguages().isEmpty());

        return !(hasScalar || hasListData);
    }

    private boolean isNotBlank(String value) {
        return value != null && !value.isBlank();
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

    @Override
    public MemberResponseDTO completeOnboarding(String username) {
        log.info("Completing onboarding for user: {}", username);
        Member existingMember = memberRepo.findByUsername(username)
                .orElseThrow(() -> {
                    log.error("Onboarding completion failed: Username {} not found", username);
                    return new ResourceNotFoundException("Member not found with username: " + username);
                });
        existingMember.setOnboardingCompleted(true);
        MemberResponseDTO response = memberMapper.toResponseDTO(memberRepo.save(existingMember));
        log.info("Onboarding completed successfully for user: {}", username);
        return response;
    }
}
