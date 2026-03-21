import logging, os, json, asyncio
from dotenv import load_dotenv
from livekit import rtc, api
from livekit.agents import (
    AgentSession,
    JobContext,
    JobProcess,
    WorkerOptions,
    cli,
    room_io,
)
from livekit.plugins import openai, deepgram, noise_cancellation, silero
from livekit.plugins.turn_detector.multilingual import MultilingualModel
from agent import InterviewAgent

logger = logging.getLogger("arcaive-interview-agent")
load_dotenv(".env")


def prewarm(proc: JobProcess):
    proc.userdata["vad"] = silero.VAD.load()


async def entrypoint(ctx: JobContext):
    logger.info(f"Job received for room: {ctx.room.name}")
    await ctx.connect()
    await ctx.wait_for_participant()

    metadata = ctx.job.metadata
    job_details = None
    candidate_details = None
    duration = 120

    if metadata:
        try:
            data = json.loads(metadata)
            candidate_details = data.get("candidate details")
            job_details = data.get("job details")
            duration = int(data.get("duration", 120))
            logger.info(f"Received candidate data: {candidate_details}")
            logger.info(f"Received job data: {job_details}")
            logger.info(f"Received time duration: {duration}")
        except (json.JSONDecodeError, ValueError):
            logger.warning("Failed to parse metadata, using defaults")

    agent = InterviewAgent(candidate_details, job_details, duration=duration)

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
            voice="ash",
            api_key=os.environ["EDGE_TTS_API_KEY"],
        ),
        turn_detection=MultilingualModel(),
        preemptive_generation=True,
    )

    await session.start(
        agent=agent,
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

    await asyncio.sleep(duration)
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