package tech.yasasbanuka.backend.config;

import dev.langchain4j.model.openai.OpenAiChatModel;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

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
                //.temperature(temperature)
                //.timeout(Duration.ofSeconds(timeout))
                //.logRequests(true)
                //.logResponses(true)
                .maxRetries(3)
                .build();
    }
}