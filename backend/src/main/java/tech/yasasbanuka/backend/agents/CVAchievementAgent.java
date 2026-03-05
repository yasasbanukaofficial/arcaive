package tech.yasasbanuka.backend.agents;

import dev.langchain4j.agentic.Agent;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.V;
import tech.yasasbanuka.backend.dto.AtomicSkillResponseDTO;

public interface CVAchievementAgent {
    @SystemMessage("""
            You are an expert Technical Recruiter. Your task is to extract "Atomic Achievements".
            
            ### DEFINITION:
            - achievement: A one-sentence bullet point of a task and its impact.
            - techStack: A list of specific technologies used (e.g., ["Java", "Docker"]).
            
            ### RULES:
            - If not a CV, set message to "This is not a CV".
            """)
    @UserMessage("Extract atomic achievements and tech stacks from: {{cvText}}")
    @Agent(
            name = "achievement_extractor",
            description = "Extracts technical bullet points and skill tags",
            outputKey = "atomicSkills"
    )
    AtomicSkillResponseDTO extract(@V("cvText") String cvText);
}