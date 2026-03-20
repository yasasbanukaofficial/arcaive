import logging, os, json, asyncio
from dotenv import load_dotenv
from livekit import rtc, api
from livekit.agents import (
    Agent,
    AgentSession,
    JobContext,
    JobProcess,
    WorkerOptions,
    cli,
    room_io,
)
from livekit.plugins import openai, deepgram, noise_cancellation, silero
from livekit.plugins.turn_detector.multilingual import MultilingualModel

logger = logging.getLogger("arcaive-interview-agent")
load_dotenv(".env")


class DefaultAgent(Agent):
    def __init__(self, candidate_details, job_details) -> None:
        self.candidate_name = candidate_details.get("name", "there") if isinstance(candidate_details, dict) else "there"
        self.job_title = job_details.get("title", "this position") if isinstance(job_details, dict) else (candidate_details.get("job role", "this position") if isinstance(candidate_details, dict) else "this position")
        experience = candidate_details.get("experience", "unknown") if isinstance(candidate_details, dict) else "unknown"

        is_junior = any(word in experience.lower() for word in ["fresh", "junior", "graduate", "entry", "0", "1 year", "less"])

        experience_guidance = """
            EXPERIENCE LEVEL: Junior / Fresh Graduate
            - Ask simple, foundational questions.
            - Focus on concepts, basic problem solving, and enthusiasm.
            - Do not ask deeply technical or architectural questions.
            - Be encouraging and supportive in tone.
        """ if is_junior else """
            EXPERIENCE LEVEL: Mid / Senior
            - Ask deeper technical or scenario-based questions.
            - Expect detailed, structured answers.
            - You may challenge their reasoning if needed.
            - Evaluate based on real-world practicality, not just theory.
        """

        super().__init__(
            instructions=f"""
                You are Alex, a senior interviewer who works at the company described in the job details below.
                You know this company well — its culture, the team, the role, and what they look for in candidates.
                You are conducting a 2-minute mock interview.

                CANDIDATE DETAILS:
                {candidate_details or "Not provided"}

                JOB DETAILS:
                {job_details or "Not provided"}

                {experience_guidance}

                UNDERSTAND THE CANDIDATE:
                - Read their experience level carefully before asking anything.
                - Tailor every question to their background and the job role.
                - Think about real-world scenarios someone in this role would actually face.

                UNDERSTAND THE COMPANY:
                - You work at this company. Speak as if you are part of the team.
                - Reference the role or company naturally where relevant.
                - Keep it professional but human.

                INTERVIEW FLOW:
                1. Listen to the candidate's introduction.
                2. Ask your FIRST question relevant to the job and their experience level.
                3. Listen carefully to their answer.
                4. Give a brief one sentence reaction or acknowledgement to their answer.
                5. Ask a SECOND question that builds on or is different from the first. Still relevant to the role.
                6. Listen to their answer.
                7. Give ONE sentence of final honest feedback on their overall performance.
                8. End with exactly: "Thank you. That concludes your mock interview."

                YOUR RULES:
                - You are the INTERVIEWER. The candidate is being interviewed, not you.
                - Ask a maximum of TWO questions total across the 2 minutes.
                - After each answer, react briefly then move forward.
                - Never ask more than two questions.
                - Never explain your reasoning out loud.
                - Keep every response under two sentences.
                - Never say things like "Waiting for candidate response" or describe what you are doing.
                - Judge the candidate based on their experience level, not a universal standard.
            """
        )

    async def on_enter(self):
        await self.session.say(
            f"Hello {self.candidate_name}, welcome to your mock interview for the {self.job_title} position. "
            f"A countdown has already started and will be displayed at the top. Let's begin. Tell me a little about yourself.",
            allow_interruptions=False,
        )


def prewarm(proc: JobProcess):
    proc.userdata["vad"] = silero.VAD.load()


async def entrypoint(ctx: JobContext):
    logger.info(f"Job received for room: {ctx.room.name}")

    await ctx.connect()
    await ctx.wait_for_participant()

    metadata = ctx.job.metadata
    job_details = None
    candidate_details = None

    if metadata:
        try:
            data = json.loads(metadata)
            candidate_details = data.get("candidate details")
            job_details = data.get("job details")
            logger.info(f"Received Candidate Data: {candidate_details}")
            logger.info(f"Received Job Data: {job_details}")
        except json.JSONDecodeError:
            logger.warning("Failed to parse metadata")

    session = AgentSession(
        vad=ctx.proc.userdata["vad"],
        stt=deepgram.STT(
            model="nova-2",
            language="en",
            api_key=os.environ["DEEPGRAM_API_KEY"],
        ),
        llm=openai.LLM(
            model="llama3.1:8b",
            api_key="ollama",
            base_url=os.environ["OLLAMA_BASE_URL"],
        ),
        tts=openai.TTS(
            base_url=os.environ["EDGE_TTS_URL"],
            model="tts-1",
            voice="onyx",
            api_key=os.environ["EDGE_TTS_API_KEY"],
        ),
        turn_detection=MultilingualModel(),
        preemptive_generation=True,
    )

    await session.start(
        agent=DefaultAgent(candidate_details, job_details),
        room=ctx.room,
        room_options=room_io.RoomOptions(
            audio_input=room_io.AudioInputOptions(
                noise_cancellation=lambda params: (
                    noise_cancellation.BVCTelephony()
                    if params.participant.kind == rtc.ParticipantKind.PARTICIPANT_KIND_SIP
                    else noise_cancellation.BVC()
                ),
            ),
        ),
    )

    await asyncio.sleep(120)
    logger.info("Interview time limit reached, closing room")
    await ctx.api.room.delete_room(api.DeleteRoomRequest(room=ctx.room.name))


if __name__ == "__main__":
    cli.run_app(
        WorkerOptions(
            entrypoint_fnc=entrypoint,
            prewarm_fnc=prewarm,
            agent_name="arcaive-interview-agent",
        )
    )