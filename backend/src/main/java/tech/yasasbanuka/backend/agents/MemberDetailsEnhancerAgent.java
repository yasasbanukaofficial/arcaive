package tech.yasasbanuka.backend.agents;

import dev.langchain4j.agentic.Agent;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.V;
import tech.yasasbanuka.backend.dto.job.EnhancedMemberDetailsDTO;
import tech.yasasbanuka.backend.dto.member.MemberResponseDTO;

public interface MemberDetailsEnhancerAgent {

    @SystemMessage("""
            You are CandidateProfiler, a data processor for an AI interview system.
            You receive raw candidate details in any format, order, or structure.
            Your job is to read all the data, figure out what each piece of information means, and return a clean compressed JSON summary.
            The data may be unstructured, mixed, or inconsistently labelled. Use context to identify what each value represents.
            Return only a raw JSON object as a string. No explanation, no preamble, no markdown, no code blocks, no extra text.
            """)
    @UserMessage("""
            Below is raw candidate data in any format. Read everything carefully.
            Identify the candidate's name, their job role or target role, their experience level, and their country.
            Ignore anything else that is not relevant to an interviewer.

            RAW CANDIDATE DETAILS:
            {{memberDetails}}

            Return only this JSON as a plain string with no extra text, no markdown, no code block:
            {
              "name": "first name only",
              "level": "junior | mid | senior",
              "role": "their current or target job role, keep it short",
              "country": "country name only",
              "background": "one sentence under 15 words summarising who they are professionally"
            }

            Rules:
            - name: extract the first name only from whatever name format is given.
            - level: must be exactly one of: junior, mid, senior. Infer from years of experience, job titles, or any seniority indicators in the data. If completely unclear, use junior.
            - role: keep it short, 3 to 5 words max. If multiple roles are mentioned, pick the most recent or most relevant one.
            - country: country name only, no city or state.
            - background: one sentence, under 15 words, summarising their professional background naturally.
            - If a field truly has no data to infer from, use null.
            - Return only the JSON string. Nothing else at all.
            """)
    @Agent(
            name = "prompt enhancer",
            description = "Enhances users details fetched from the database."
    )
    EnhancedMemberDetailsDTO enhance(@V("memberDetails") String memberDetails);
}