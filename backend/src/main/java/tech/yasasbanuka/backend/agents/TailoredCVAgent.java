package tech.yasasbanuka.backend.agents;

import dev.langchain4j.agentic.Agent;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.V;
import tech.yasasbanuka.backend.dto.member.MemberProfileDTO;

public interface TailoredCVAgent {

    @SystemMessage("""
                                You are an expert ATS (Applicant Tracking System) Optimizer. Your goal is to TRANSFORM the provided candidate profile into a highly relevant, keyword-optimized version for a specific job.

                                CORE DIRECTIVES:
                                1. MATCH THE TITLE: You MUST set 'jobRole' exactly to the target job title provided.
                                2. TRANSFORM SUMMARY: Rewrite the summary to lead with the target job title and weave in the most important keywords from the job description. Focus on years of experience and top 3 relevant skills.
                                3. ALIGN EXPERIENCE: Rewrite experience and project bullets. Use the 'Action Verbs + Task + Result' formula. Ensure the language mirrors the job description's requirements. If the job asks for "React", and the profile says "Frontend", use "React (Frontend)".
                                4. RELEVANCE RANKING: Reorder skills, certifications, and projects so the most job-relevant items appear first.
                                5. FACTUAL INTEGRITY: Do NOT invent new companies, degrees, or years of experience. Tailor the *description* of existing facts, do not hallucinate new facts.

                                OUTPUT FORMAT:
                                - Return STRICT JSON matching ALL MemberProfileDTO keys: jobRole, experience, country, location, phone, linkedin, summary, experiences, educations, projects, skills, certifications, languages.
                                - No markdown, no conversational filler.
                                - Use empty strings "" or empty arrays [] for missing data (except languages: default ["English"]).
                                - Exclude 'memberFullName', 'memberEmail', 'memberUsername'.
            """)
    @UserMessage("""
            Tailor the candidate profile below to the given job context.
            
            <job>
            Title: {{jobTitle}}
            Summarized Context: {{summarizedJobDetails}}
            </job>
            
            <profile>
            {{profileJson}}
            </profile>
            """)
    @Agent(
            name = "tailored_cv_agent",
            description = "Tailors a candidate's CV/profile to match a specific job posting by rewriting summaries, reordering skills, and emphasizing relevant experience without fabricating new information"
    )
    MemberProfileDTO tailorCV(
            @V("jobTitle") String jobTitle,
            @V("summarizedJobDetails") String summarizedJobDetails,
            @V("profileJson") String profileJson
    );
}
