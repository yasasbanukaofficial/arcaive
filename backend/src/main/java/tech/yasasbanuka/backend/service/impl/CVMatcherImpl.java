package tech.yasasbanuka.backend.service.impl;

import dev.langchain4j.agentic.AgenticServices;
import dev.langchain4j.model.openai.OpenAiChatModel;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import tech.yasasbanuka.backend.agents.CVMatcherAgent;
import tech.yasasbanuka.backend.dto.cv.CvAnalysisResponseDTO;
import tech.yasasbanuka.backend.dto.member.MemberResponseDTO;
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
}
