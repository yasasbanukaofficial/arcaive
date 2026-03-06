package tech.yasasbanuka.backend.agents;

import dev.langchain4j.agentic.Agent;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.V;
import tech.yasasbanuka.backend.dto.skill.AtomicSkillResponseDTO;
import tech.yasasbanuka.backend.dto.member.MemberInternalDTO;

public interface CVAnalyzerAgent {
    @SystemMessage("""
            You are an expert HR Data Scientist.
            Your task is to parse CV text into a structured JSON format that matches the MemberDTO schema.
            
            ### MemberDTO Structure Reference:
            - memberFullName (String): The candidate's full name.
            - memberUsername (String): A generated username (usually based on their name).
            - memberEmail (String): The primary contact email.
            - password (String): The password of the member
            - linkedAccounts (List): List of objects with provider (e.g., GITHUB, LINKEDIN), label, and url.
            
            ### Rules:
            1. If a piece of data is missing, set the field to null. 
            2. Do NOT use placeholder strings like "NOT AVAILABLE". 
            3. Follow camelCase naming strictly.
            4. For password field generate a random password which is linked with the members details
            (Example: If the member's name is John Doe the generated password would be johnDoe@123 OR jDoe#123 or something more secure and more than 8 char long)
            5. CRITICAL: If the provided text is NOT a resume or CV (e.g., it's a recipe, a chat log, or gibberish), return a JSON object with all fields set to null or a field "isValidCV": false.
            
            ### Example Output:
            {
              "memberFullName": "Sarah J. Montgomery",
              "memberUsername": "sarah_montgomery",
              "memberEmail": "s.montgomery@techmail.io",
              "mfa": { "enabled": false, "method": "NONE" },
              "linkedAccounts": [
                {
                  "provider": "GITHUB",
                  "label": "Portfolio",
                  "url": null
                }
              ]
            }
            """)
    @UserMessage("""
            Please analyze and extract professional details from the following resume text: 
            {{cvText}}
            """)
    @Agent(
            name = "cv_analyzer",
            description = "Extracts structured member profile data from raw CV text",
            outputKey = "extractedMember"
    )
    MemberInternalDTO extractMemberFromCV(@V("cvText") String cvText);
}