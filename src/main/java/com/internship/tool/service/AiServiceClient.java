package com.internship.tool.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

/**
 * REST client for the external Python AI micro-service.
 *
 * <p>Calls {@code POST http://localhost:5000/describe} with a JSON body
 * containing the security record name and description. If the AI service
 * is unavailable or returns an error, a safe fallback string is returned
 * so that the rest of the application is not impacted.</p>
 */
@Service
@Slf4j
public class AiServiceClient {

    private final RestTemplate restTemplate;

    @Value("${ai.service.url:http://localhost:5000/describe}")
    private String aiServiceUrl;

    public AiServiceClient() {
        this.restTemplate = new RestTemplate();
    }

    /**
     * Ask the AI service to generate a human-readable description for a
     * security finding.
     *
     * @param name        name of the security record
     * @param description raw description text
     * @return AI-generated description, or a fallback message on failure
     */
    public String describe(String name, String description) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Build request payload
            Map<String, String> payload = Map.of(
                    "name", name != null ? name : "",
                    "description", description != null ? description : ""
            );

            HttpEntity<Map<String, String>> request = new HttpEntity<>(payload, headers);

            log.info("Calling AI service at {} for record: {}", aiServiceUrl, name);

            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    aiServiceUrl, HttpMethod.POST, request,
                    new org.springframework.core.ParameterizedTypeReference<Map<String, Object>>() {});

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Object result = response.getBody().get("result");
                return result != null ? result.toString() : buildFallback(name);
            }

        } catch (ResourceAccessException ex) {
            // AI service is down — degrade gracefully
            log.warn("AI service unreachable at {}: {}", aiServiceUrl, ex.getMessage());
        } catch (Exception ex) {
            log.error("Unexpected error calling AI service: {}", ex.getMessage());
        }

        // Fallback response — application continues working without AI
        return buildFallback(name);
    }

    private String buildFallback(String name) {
        return String.format(
                "AI service unavailable. Security record '%s' requires manual review.", name);
    }
}
