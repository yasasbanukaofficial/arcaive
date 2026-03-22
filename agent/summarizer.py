import os
import logging
from openai import AsyncOpenAI, RateLimitError

logger = logging.getLogger(__name__)

_client = None


def get_client():
    global _client
    if _client is None:
        _client = AsyncOpenAI(
            api_key=os.environ["OPENROUTER_API_KEY"],
            base_url=os.environ["OPENROUTER_BASE_URL"]
        )
    return _client


async def summarize_input(transcript: str) -> str:
    if len(transcript.split()) < 30:
        return transcript

    try:
        response = await get_client().chat.completions.create(
            model="meta-llama/llama-3.2-3b-instruct:free",
            max_tokens=80,
            messages=[
                {
                    "role": "system",
                    "content": "Extract only the key facts from this speech. Return 1-2 sentences max. No filler words, no greetings, just the substance."
                },
                {
                    "role": "user",
                    "content": transcript
                }
            ]
        )
        result = response.choices[0].message.content.strip()
        logger.info(f"Summarized: '{transcript[:50]}...' -> '{result}'")
        return result

    except RateLimitError:
        logger.warning("Summarizer rate limited, passing raw transcript")
        return transcript

    except Exception as e:
        logger.warning(f"Summarizer failed: {e}, passing raw transcript")
        return transcript