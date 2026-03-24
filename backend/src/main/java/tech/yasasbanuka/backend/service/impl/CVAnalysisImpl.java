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
import tech.yasasbanuka.backend.service.CVAnalysisService;
import tech.yasasbanuka.backend.util.PDFTextExtract;

@RequiredArgsConstructor
@Transactional
@Service
@Slf4j
public class CVAnalysisImpl implements CVAnalysisService {
    private final PDFTextExtract pdfTextExtract;
    private final OpenAiChatModel openAiChatModel;

    @Override
    public CvAnalysisResponseDTO analyze(MultipartFile file, String jobDescription) {
        log.info("Extracting atomic skills from CV file: {}", file.getOriginalFilename());
        String extractedText = pdfTextExtract.extract(file);
        CVMatcherAgent matcherAgent = AgenticServices
                .agentBuilder(CVMatcherAgent.class)
                .chatModel(openAiChatModel)
                .build();
        return matcherAgent.analysis(extractedText, jobDescription);
    }
}
