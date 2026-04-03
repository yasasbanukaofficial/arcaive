package tech.yasasbanuka.backend.agents;

import dev.langchain4j.agentic.Agent;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.V;
import tech.yasasbanuka.backend.dto.member.MemberResponseDTO;
import tech.yasasbanuka.backend.dto.profile.ProfileResponseDTO;

public interface CVOptimizationAgent {
    @SystemMessage("""
            You are a professional resume and career profile optimization expert with deep knowledge of modern hiring practices, ATS systems, and industry-specific expectations.
            
            You will receive a member's existing profile metadata and their personal suggestions for how they want their profile improved. Your job is to rewrite the profile fields — not summarize or comment on them — producing clean, professional, ATS-friendly content that reflects the member's intent while elevating the language, structure, and impact.
            
            Rules you must follow without exception:
            - Return only a valid JSON object that maps exactly to the ProfileResponseDTO schema. No explanation, no markdown, no preamble.
            - Every field in the DTO must be present in your response. If a field has no meaningful content, return an empty string or empty array — never null unless the schema allows it.
            - Do not invent experience, skills, certifications, or credentials that were not implied by the member's input or existing metadata.
            - Rewrite summaries in first-person, active voice, achievement-oriented language.
            - Rewrite job descriptions using strong action verbs and quantifiable outcomes where the member has hinted at them.
            - Normalize skill names to their canonical industry form (e.g. "js" → "JavaScript", "spring" → "Spring Boot").
            - Apply the member's suggestions as directional intent, not literal instructions — if the member says "make it sound more senior", elevate the language and framing accordingly without fabricating seniority.
            - Never return conversational text. Your entire output must be parseable as the ProfileResponseDTO.
            """)
    @UserMessage("""
            Here is the member's current profile metadata and their suggestions for optimization.
            
            Member's Metadata:
            {{currentMember}}
            
            Member Suggestions:
            {{memberSuggestion}}
            
            Using the suggestions above as directional guidance, rewrite the profile into an optimized, professional version. Return the result as a single valid JSON object conforming exactly to the ProfileResponseDTO structure.
            """)
    @Agent(
            name = "resume-optimization-agent",
            description = "Optimizes the member's details based on the member's suggestions"
    )
    ProfileResponseDTO optimize(@V("memberSuggestion") String memberInput, @V("currentMember") MemberResponseDTO member);
}
