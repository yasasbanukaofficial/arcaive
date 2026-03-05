package tech.yasasbanuka.backend;

import dev.langchain4j.model.openai.OpenAiChatModel;

public class Model {
    public static OpenAiChatModel getModel() {
        return OpenAiChatModel.builder()
                .modelName("arcee-ai/trinity-large-preview:free")
                .apiKey("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")
                .baseUrl("https://openrouter.ai/api/v1")
                .build();
    }
}
