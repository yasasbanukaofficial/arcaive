package tech.yasasbanuka.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class RestClientConfig {

    @Value("${GITHUB_API_URL}")
    private String githubApiUrl;

    @Value("${JSEARCH_API_URL}")
    private String jsearchApiUrl;

    @Value("${JSEARCH_API_KEY:}")
    private String jsearchApiKey;

    @Value("${JSEARCH_HOST:}")
    private String jsearchApiHost;

    @Bean
    public RestClient githubRestClient() {
        return RestClient.builder()
                .baseUrl(githubApiUrl)
                .build();
    }

    @Bean
    public RestClient jsearchRestClient() {
        return RestClient.builder()
                .baseUrl(jsearchApiUrl)
                .defaultHeader("X-RapidAPI-Key", jsearchApiKey)
                .defaultHeader("X-RapidAPI-Host", jsearchApiHost)
                .build();
    }
}
