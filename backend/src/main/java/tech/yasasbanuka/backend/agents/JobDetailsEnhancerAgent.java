package tech.yasasbanuka.backend.agents;

import dev.langchain4j.agentic.Agent;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.V;
import tech.yasasbanuka.backend.dto.job.EnhancedJobDetailsDTO;
import tech.yasasbanuka.backend.dto.job.JobRequestDTO;

public interface JobDetailsEnhancerAgent {

    @SystemMessage("""
            You are JobProfiler, a data processor for an AI interview system.
            You receive raw job posting details in any format, order, or structure.
            Your job is to read all the data, figure out what each piece of information means, and return a clean compressed JSON summary.
            The data may be unstructured, mixed, inconsistently labelled, or contain irrelevant fields. Use context to identify what matters.
            Return only a raw JSON object as a string. No explanation, no preamble, no markdown, no code blocks, no extra text.
            """)
    @UserMessage("""
            Below is raw job posting data in any format. Read everything carefully.
            Identify the job title, company, whether it is remote, location, required skills and tech stack, what the role actually does, salary, and benefits.
            Ignore anything that is not relevant to conducting an interview for this role.

            RAW JOB DETAILS:
            {{jobDetails}}

            Return only this JSON as a plain string with no extra text, no markdown, no code block:
            {
              "title": "job title",
              "company": "company name",
              "website": "company website url or null",
              "remote": true or false,
              "location": "city and country only, or null",
              "level": "junior | mid | senior",
              "stack": ["3 to 5 key technologies or tools, single words or short phrases only"],
              "keySkills": ["3 to 5 must-have skills, single words or short phrases only"],
              "focus": "one sentence under 15 words describing what this role actually does day to day",
              "salary": "formatted as a short range with period such as 60k-80k per year, or null",
              "benefits": ["3 most relevant benefits only, or null"]
            }

            Rules:
            - title: exact job title as stated, keep it short.
            - company: company or employer name only.
            - remote: true if fully remote, false if on-site or hybrid. If unclear, use false.
            - level: must be exactly one of: junior, mid, senior. Infer from the description, required years, or seniority indicators. If unclear, use mid.
            - stack: technologies, frameworks, languages, tools. Single words or short phrases only, no sentences.
            - keySkills: the most critical skills an interviewer should probe. Single words or short phrases only.
            - focus: what does someone in this role actually do day to day. One sentence, under 15 words.
            - salary: combine min, max, and period into one short readable string. If missing, use null.
            - benefits: pick only the 3 most relevant and useful benefits. If none, use null.
            - If a field truly has no data to infer from, use null.
            - Return only the JSON string. Nothing else at all.
            """)
    @Agent(
            name = "job prompt enhancer",
            description = "Enhances users details fetched from the database."
    )
    EnhancedJobDetailsDTO enhance(@V("jobDetails") String jobDetails);
}