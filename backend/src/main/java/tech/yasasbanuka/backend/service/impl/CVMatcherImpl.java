package tech.yasasbanuka.backend.service.impl;

import dev.langchain4j.agentic.AgenticServices;
import dev.langchain4j.model.openai.OpenAiChatModel;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import tech.yasasbanuka.backend.agents.CVMatcherAgent;
import tech.yasasbanuka.backend.agents.CVOptimizationAgent;
import tech.yasasbanuka.backend.dto.cv.CvAnalysisResponseDTO;
import tech.yasasbanuka.backend.dto.member.MemberResponseDTO;
import tech.yasasbanuka.backend.dto.profile.ProfileResponseDTO;
import tech.yasasbanuka.backend.entity.Member;
import tech.yasasbanuka.backend.entity.constants.QuotaType;
import tech.yasasbanuka.backend.service.CVMatcherService;
import tech.yasasbanuka.backend.service.MemberService;
import tech.yasasbanuka.backend.service.QuotaService;
import tech.yasasbanuka.backend.util.PDFTextExtract;

@RequiredArgsConstructor
@Transactional
@Service
@Slf4j
public class CVMatcherImpl implements CVMatcherService {
    private final PDFTextExtract pdfTextExtract;
    private final OpenAiChatModel lowTempOpenAiChatModel;
    private final QuotaService quotaService;
    private final MemberService memberService;
    private final OpenAiChatModel openAiChatModel;

    @Override
    public CvAnalysisResponseDTO analyze(String username, MultipartFile file, String jobDescription) {
        log.info("Extracting atomic skills from CV file: {}", file.getOriginalFilename());

        MemberResponseDTO member = memberService.getMemberByUsername(username);
        log.info("Checking if member's quota is eligible or not: {}", member.getMemberFullName());
        quotaService.checkAndConsume(member.getMemberId(), QuotaType.CV_ANALYSIS);

        String extractedText = pdfTextExtract.extract(file);
        CVMatcherAgent matcherAgent = AgenticServices
                .agentBuilder(CVMatcherAgent.class)
                .chatModel(lowTempOpenAiChatModel)
                .build();
        return matcherAgent.analysis(extractedText, jobDescription);
    }

    @Override
    public ProfileResponseDTO optimizeCV(String username, String userInput) {
        log.info("Starting CV optimization process for username: {}", username);

        MemberResponseDTO member = memberService.getMemberByUsername(username);
        log.info("Retrieved member profile for optimization: {}", member.getMemberFullName());

        log.info("Checking if member's quota is eligible for CV optimization: {}", member.getMemberId());
        quotaService.checkAndConsume(member.getMemberId(), QuotaType.CV_CREATION);

        log.info("Building CV optimization agent for member: {}", member.getMemberId());
        CVOptimizationAgent cvOptimizationAgent = AgenticServices
                .agentBuilder(CVOptimizationAgent.class)
                .chatModel(openAiChatModel)
                .build();

        log.info("Executing CV optimization with AI for member: {} with user input length: {}", member.getMemberId(), userInput.length());
        log.info("Successfully completed CV optimization for member: {}", member.getMemberId());
        log.debug("Returning optimized profile result for member: {}", member.getMemberId());
        return cvOptimizationAgent.optimize(userInput, member);

    }
}
