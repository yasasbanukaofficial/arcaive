import logging
import os
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

logger = logging.getLogger("agent-Avery-2197")
load_dotenv(".env")


class DefaultAgent(Agent):
    def __init__(self) -> None:
        super().__init__(
            instructions="""You are a friendly, reliable voice assistant that answers questions, explains topics, and completes tasks with available tools.
                            You are interacting with the user via voice:
                            - Respond in plain text only. No markdown, lists, code, or emojis.
                            - Keep replies brief: one to three sentences.
                            - Spell out numbers and email addresses.
                            - Avoid acronyms with unclear pronunciation.""",
        )

    async def on_enter(self):
        await self.session.generate_reply(
            instructions="Greet the user warmly and offer your assistance.",
            allow_interruptions=True,
        )


def prewarm(proc: JobProcess):
    proc.userdata["vad"] = silero.VAD.load()


async def entrypoint(ctx: JobContext):
    logger.info(f"Job received for room: {ctx.room.name}")

    await ctx.connect()

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
            base_url="http://localhost:11434/v1",
        ),
        tts=cartesia.TTS(
            voice="a167e0f3-df7e-4d52-a9c3-f949145efdab",
            api_key=os.environ["CARTESIA_API_KEY"],
        ),
        turn_detection=MultilingualModel(),
        preemptive_generation=True,
    )

    await session.start(
        agent=DefaultAgent(),
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
            agent_name="Avery-2197",
        )
    )