package tech.yasasbanuka.backend.service.impl;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tech.yasasbanuka.backend.agents.JobSummarizerAgent;
import tech.yasasbanuka.backend.agents.TailoredCVAgent;
import tech.yasasbanuka.backend.dto.cv.TailoredCVRequestDTO;
import tech.yasasbanuka.backend.dto.member.MemberProfileDTO;
import tech.yasasbanuka.backend.dto.profile.EducationDTO;
import tech.yasasbanuka.backend.dto.profile.ExperienceDTO;
import tech.yasasbanuka.backend.dto.profile.ProjectDTO;
import tech.yasasbanuka.backend.dto.profile.SkillCategoryDTO;
import tech.yasasbanuka.backend.service.MemberService;
import tech.yasasbanuka.backend.service.TailoredCVService;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class TailoredCVServiceImpl implements TailoredCVService {
    private final JobSummarizerAgent jobSummarizerAgent;
    private final TailoredCVAgent tailoredCVAgent;
    private final MemberService memberService;
    @Qualifier("aiObjectMapper")
    private final ObjectMapper aiObjectMapper;

    @Override
    public MemberProfileDTO tailorCV(String username, TailoredCVRequestDTO request) {
        long startTime = System.currentTimeMillis();
        log.info("[Tailoring Start] Initiating CV tailoring for user: {}", username);

        memberService.getMemberByUsername(username);

        MemberProfileDTO originalProfile = request.getProfile() == null ? MemberProfileDTO.builder().build() : request.getProfile();
        log.info("[Step 1/4] Serializing profile (original summary length: {})", 
                originalProfile.getSummary() != null ? originalProfile.getSummary().length() : 0);
        String profileJson = serializeProfile(originalProfile);

        String jobDescription = request.getJobDescription() == null ? "" : request.getJobDescription();
        String summarizedJobDetails;
        
        if (jobDescription.isBlank() || jobDescription.length() < 800) {
            log.info("[Step 2/4] Skipping summarization (description length {} < 800). Using raw context.", jobDescription.length());
            summarizedJobDetails = jobDescription;
        } else {
            log.info("[Step 2/4] Summarizing job description (original length: {})...", jobDescription.length());
            long sumStart = System.currentTimeMillis();
            summarizedJobDetails = jobSummarizerAgent.summarizeJob(request.getJobTitle(), jobDescription);
            long sumEnd = System.currentTimeMillis();
            log.info("[Step 2/4] Summarization complete in {}ms. New length: {}", (sumEnd - sumStart), summarizedJobDetails.length());
            log.debug("Summarized details: {}", summarizedJobDetails);
        }

        log.info("[Step 3/4] Running primary tailoring pass...");
        long pass1Start = System.currentTimeMillis();
        MemberProfileDTO tailored = tailoredCVAgent.tailorCV(
                request.getJobTitle(),
                summarizedJobDetails,
                profileJson
        );
        long pass1End = System.currentTimeMillis();
        log.info("[Step 3/4] Primary tailoring pass completed in {}ms", (pass1End - pass1Start));

        if (looksUntailored(request.getJobTitle(), originalProfile, tailored)) {
            log.warn("[Step 4/4] First pass result was unsatisfactory (untailored). Attempting mandatory second pass...");
            long pass2Start = System.currentTimeMillis();
            String boostedSummary = summarizedJobDetails
                    + "\n\nMANDATORY: Rewrite summary and bullets using this job context. "
                    + "Set jobRole exactly to the target title and prioritize ATS keywords.";
            tailored = tailoredCVAgent.tailorCV(request.getJobTitle(), boostedSummary, profileJson);
            long pass2End = System.currentTimeMillis();
            log.info("[Step 4/4] Mandatory second pass completed in {}ms", (pass2End - pass2Start));
        } else {
            log.info("[Step 4/4] Tailoring result verified. Skipping second pass.");
        }

        MemberProfileDTO result = normalizeTailoredProfile(request.getJobTitle(), originalProfile, tailored);
        long totalTime = System.currentTimeMillis() - startTime;
        log.info("[Tailoring Complete] Successfully finished tailoring in {}ms for user: {}", totalTime, username);
        
        return result;
    }

    private MemberProfileDTO normalizeTailoredProfile(String jobTitle, MemberProfileDTO original, MemberProfileDTO tailored) {
        MemberProfileDTO out = tailored == null ? MemberProfileDTO.builder().build() : tailored;

        out.setJobRole(isBlank(jobTitle) ? defaultText(out.getJobRole(), original.getJobRole()) : jobTitle.trim());
        out.setExperience(defaultText(out.getExperience(), original.getExperience()));
        out.setCountry(defaultText(out.getCountry(), original.getCountry()));
        out.setLocation(defaultText(out.getLocation(), original.getLocation()));
        out.setPhone(defaultText(out.getPhone(), original.getPhone()));
        out.setLinkedin(defaultText(out.getLinkedin(), original.getLinkedin()));
        out.setSummary(defaultText(out.getSummary(), original.getSummary()));

        out.setExperiences(normalizeExperiences(out.getExperiences(), original.getExperiences()));
        out.setEducations(defaultList(out.getEducations(), original.getEducations()));
        out.setProjects(normalizeProjects(out.getProjects(), original.getProjects()));
        out.setSkills(normalizeSkills(out.getSkills(), original.getSkills()));
        out.setCertifications(defaultStringList(out.getCertifications(), original.getCertifications()));

        List<String> languages = defaultStringList(out.getLanguages(), original.getLanguages());
        if (languages.isEmpty()) {
            languages = new ArrayList<>(List.of("English"));
        }
        out.setLanguages(languages);

        return out;
    }

    private boolean looksUntailored(String jobTitle, MemberProfileDTO original, MemberProfileDTO tailored) {
        if (tailored == null) {
            return true;
        }

        boolean titleNotAligned = !isBlank(jobTitle) && !equalsIgnoreCase(trim(tailored.getJobRole()), trim(jobTitle));
        boolean summaryUnchanged = equalsIgnoreCase(trim(tailored.getSummary()), trim(original.getSummary()));

        return titleNotAligned || summaryUnchanged;
    }

    private List<ExperienceDTO> normalizeExperiences(List<ExperienceDTO> tailored, List<ExperienceDTO> original) {
        List<ExperienceDTO> selected = defaultList(tailored, original);
        for (ExperienceDTO exp : selected) {
            if (exp == null) {
                continue;
            }
            exp.setRole(emptyIfNull(exp.getRole()));
            exp.setCompany(emptyIfNull(exp.getCompany()));
            exp.setLocation(emptyIfNull(exp.getLocation()));
            exp.setPeriod(emptyIfNull(exp.getPeriod()));
            exp.setBullets(defaultStringList(exp.getBullets(), Collections.emptyList()));
        }
        return selected;
    }

    private List<ProjectDTO> normalizeProjects(List<ProjectDTO> tailored, List<ProjectDTO> original) {
        List<ProjectDTO> selected = defaultList(tailored, original);
        for (ProjectDTO project : selected) {
            if (project == null) {
                continue;
            }
            project.setName(emptyIfNull(project.getName()));
            project.setDescription(emptyIfNull(project.getDescription()));
            project.setYear(emptyIfNull(project.getYear()));
            project.setBullets(defaultStringList(project.getBullets(), Collections.emptyList()));
        }
        return selected;
    }

    private List<SkillCategoryDTO> normalizeSkills(List<SkillCategoryDTO> tailored, List<SkillCategoryDTO> original) {
        List<SkillCategoryDTO> selected = defaultList(tailored, original);
        for (SkillCategoryDTO skill : selected) {
            if (skill == null) {
                continue;
            }
            skill.setCategory(emptyIfNull(skill.getCategory()));
            skill.setItems(defaultStringList(skill.getItems(), Collections.emptyList()));
        }
        return selected;
    }

    private <T> List<T> defaultList(List<T> primary, List<T> fallback) {
        if (primary != null) {
            return new ArrayList<>(primary);
        }
        if (fallback != null) {
            return new ArrayList<>(fallback);
        }
        return new ArrayList<>();
    }

    private List<String> defaultStringList(List<String> primary, List<String> fallback) {
        List<String> base = defaultList(primary, fallback);
        return base.stream().filter(Objects::nonNull).map(String::trim).filter(s -> !s.isBlank()).toList();
    }

    private String defaultText(String primary, String fallback) {
        String value = trim(primary);
        if (!value.isBlank()) {
            return value;
        }
        return emptyIfNull(fallback);
    }

    private String emptyIfNull(String value) {
        return value == null ? "" : value.trim();
    }

    private String trim(String value) {
        return value == null ? "" : value.trim();
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private boolean equalsIgnoreCase(String a, String b) {
        return trim(a).equalsIgnoreCase(trim(b));
    }

    private String serializeProfile(MemberProfileDTO profile) {
        try {
            return aiObjectMapper.writeValueAsString(profile == null ? MemberProfileDTO.builder().build() : profile);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize profile for tailored CV request", e);
            throw new IllegalArgumentException("Invalid profile payload", e);
        }
    }
}
