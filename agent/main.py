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
from livekit.plugins import openai, deepgram, cartesia, google, noise_cancellation, silero
from livekit.plugins.turn_detector.multilingual import MultilingualModel

logger = logging.getLogger("arcaive-interview-agent")
load_dotenv(".env")


class DefaultAgent(Agent):
    def __init__(self, candidate_details, job_details) -> None:
        super().__init__(
            instructions=f"""
                You are a professional mock interview agent who has experience in any job field who is conducting a strict 1-minute interview.

                ROLE:
                You are interviewing a candidate: (Candidates Details) {candidate_details or None}
                You are interviewing for a job position and here are it's details in a JSON Format: {job_details or None}

                STRICT RULES:
                - The entire interview MUST be completed within 1 minute.
                - Ask only ONE question total.
                - MOSTLY LISTEN. Your job is to observe and assess, not to talk.
                - After the candidate answers, give a single short sentence of feedback and end.
                - You are allowed to ask real work scenario questions and when thinking about the candidates answer you should align it with a real scenario and verify (No need to inform the candidate about it)
                - Do not go off-topic or ask follow-up questions.

                VOICE RULES:
                - Plain text only. No markdown, bullet points, or emojis.
                - Keep every response to one or two sentences MAXIMUM.
                - Short, professional, and direct. Never over-explain.
                - Spell out numbers.

                FLOW:
                1. Greet briefly and state the role. (1-2 sentences)
                2. Ask one targeted question relevant to the job. Then STOP TALKING AND LISTEN.
                3. After the candidate finishes, give one sentence of feedback.
                4. Close with: "Thank you for your time. That concludes your mock interview."

                REMEMBER: You are an assessor. The candidate should be doing 80 percent of the talking. You do 20 percent.
                """
        )

    async def on_enter(self):
        await self.session.generate_reply(
            instructions="Begin the mock interview. Greet the candidate briefly, state the rol they are interviewing for, then ask your one interview question.",
            allow_interruptions=True,
        )


def prewarm(proc: JobProcess):
    proc.userdata["vad"] = silero.VAD.load()


async def entrypoint(ctx: JobContext):
    logger.info(f"Job received for room: {ctx.room.name}")

    await ctx.connect()
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
            logger.warning("Failed to parse room metadata")

    session = AgentSession(
        vad=ctx.proc.userdata["vad"],
        stt=deepgram.STT(
            model="nova-2",
            language="en",
            api_key=os.environ["DEEPGRAM_API_KEY"],
        ),
        llm=openai.LLM(
            model="llama3.2",
            api_key="ollama",
            base_url=os.environ["OLLAMA_BASE_URL"],
        ),
        tts=cartesia.TTS(
            voice="a167e0f3-df7e-4d52-a9c3-f949145efdab",
            api_key=os.environ["CARTESIA_API_KEY"],
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