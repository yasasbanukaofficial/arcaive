package tech.yasasbanuka.backend.config;

import dev.langchain4j.agentic.AgenticServices;
import dev.langchain4j.model.openai.OpenAiChatModel;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tech.yasasbanuka.backend.agents.JobSummarizerAgent;
import tech.yasasbanuka.backend.agents.OnboardingCVAutofillAgent;
import tech.yasasbanuka.backend.agents.TailoredCVAgent;

@Configuration
public class AIConfig {

    @Value("${AI_MODEL}")
    private String modelName;

    @Value("${AI_API_KEY}")
    private String apiKey;

    @Value("${AI_BASE_URL}")
    private String baseUrl;

    @Value("${AI_TEMPERATURE:0.7}")
    private Double temperature;

    @Value("${AI_TIMEOUT_SECONDS:60}")
    private Long timeout;

    @Bean
    public OpenAiChatModel openAiChatModel() {
        return OpenAiChatModel.builder()
                .apiKey(apiKey)
                .modelName(modelName)
                .baseUrl(baseUrl)
                .temperature(temperature)
                .timeout(java.time.Duration.ofSeconds(timeout))
                .maxRetries(3)
                .build();
    }

    @Bean
    public OpenAiChatModel lowTempOpenAiChatModel() {
        return OpenAiChatModel.builder()
                .apiKey(apiKey)
                .modelName(modelName)
                .temperature(0.0)
                .baseUrl(baseUrl)
                .timeout(java.time.Duration.ofSeconds(timeout))
                .maxRetries(3)
                .build();
    }

        @Bean
        public OnboardingCVAutofillAgent onboardingCVAutofillAgent(
            @Qualifier("lowTempOpenAiChatModel") OpenAiChatModel lowTempOpenAiChatModel
        ) {
        return AgenticServices
            .agentBuilder(OnboardingCVAutofillAgent.class)
            .chatModel(lowTempOpenAiChatModel)
            .build();
        }

        @Bean
        public JobSummarizerAgent jobSummarizerAgent(
            @Qualifier("lowTempOpenAiChatModel") OpenAiChatModel lowTempOpenAiChatModel
        ) {
        return AgenticServices
            .agentBuilder(JobSummarizerAgent.class)
            .chatModel(lowTempOpenAiChatModel)
            .build();
        }

        @Bean
        public TailoredCVAgent tailoredCVAgent(
            @Qualifier("openAiChatModel") OpenAiChatModel openAiChatModel
        ) {
        return AgenticServices
            .agentBuilder(TailoredCVAgent.class)
            .chatModel(openAiChatModel)
            .build();
        }
}