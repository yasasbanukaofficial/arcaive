import logging, os, json
from dotenv import load_dotenv
from livekit import rtc
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
        self.job_title = job_details.get("title", "this position") if isinstance(job_details, dict) else candidate_details.get("job role")
        super().__init__(
            instructions=f"""
                You are Alex, a professional interviewer at Arcaive conducting a 1-minute mock interview.
                Candidate: {candidate_details or "Not provided"}
                Job: {job_details or "Not provided"}
                YOUR RULES:
                - You are the INTERVIEWER. The candidate is the one being interviewed.
                - Ask exactly ONE question. Then stop talking and wait.
                - After they answer, give ONE sentence of feedback.
                - End with: "Thank you. That concludes your mock interview."
                - Never ask follow-up questions.
                - Never explain your reasoning.
                - Keep every response under two sentences.
                - Never say things like "Waiting for candidate response".
            """
        )

    async def on_enter(self):
        await self.session.say(
            f"Hello {self.candidate_name}, welcome to your mock interview for the {self.job_title} position. Let us begin. Tell me more about yourself",
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


if __name__ == "__main__":
    cli.run_app(
        WorkerOptions(
            entrypoint_fnc=entrypoint,
            prewarm_fnc=prewarm,
            agent_name="arcaive-interview-agent",
        )
    )