package tech.yasasbanuka.backend.agents;

import dev.langchain4j.agentic.Agent;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.V;

public interface JobSummarizerAgent {

    @SystemMessage("""
            You are an ultra-efficient job summarizer. Your goal is to provide the absolute minimum context needed for a CV tailoring agent.

            OUTPUT FORMAT (PLAIN TEXT ONLY):
            1. One sentence summarizing the job role and company.
            2. A concise list of 5-8 must-have technical/soft requirements (shortened to keywords or short phrases).

            Do not use markdown, JSON, or conversational filler. Be extremely brief.
            """)
    @UserMessage("""
            Summarize this job posting efficiently for resume tailoring:
            
            <job_title>
            {{jobTitle}}
            </job_title>
            
            <job_description>
            {{jobDescription}}
            </job_description>
            """)
    @Agent(
            name = "job_summarizer_agent",
            description = "Summarizes job descriptions into concise, ATS-focused key points for rapid CV tailoring"
    )
    String summarizeJob(
            @V("jobTitle") String jobTitle,
            @V("jobDescription") String jobDescription
    );
}
