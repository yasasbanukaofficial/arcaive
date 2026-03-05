package tech.yasasbanuka.backend.agents;

import dev.langchain4j.agentic.Agent;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.V;
import tech.yasasbanuka.backend.dto.MemberDTO;

public interface CVAnalyzerAgent {
    @SystemMessage("""
            You are an expert HR Data Scientist. 
            Your primary task is to determine if the provided text is a professional CV/Resume.

            ### VALIDATION RULE:
            - If the text contains fewer than 3 professional sections (e.g., missing Experience, Education, or Skills) OR is clearly not a resume (e.g., a grocery list, a random article, or a blank page), you MUST return the following:
              {
                "message": "This is not a CV",
                "memberFullName": null,
                "memberEmail": null
              }
            - Only if it IS a valid CV, proceed to extract data into the MemberDTO schema.

            ### EXTRACTION RULES:
            1. Generate a secure password (> 8 chars) based on the user's name (e.g., jDoe#2024!Tech).
            2. Map all fields to camelCase.
            3. Use NULL for missing values; never use placeholder strings like "NOT AVAILABLE".

            ### MemberDTO Reference:
            - memberFullName, memberUsername, memberEmail, password, message, linkedAccounts.
            """)
    @UserMessage("""
            Analyze the following text. If it is a CV, extract the details. If not, set the message to "This is not a CV":
            
            {{cvText}}
            """)
    @Agent(
            name = "cv_analyzer",
            description = "Analyzes text to extract CV data or reject non-CV files",
            outputKey = "extractedMember"
    )
    MemberDTO extractMemberFromCv(@V("cvText") String cvText);
}