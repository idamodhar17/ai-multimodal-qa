import os
from openai import OpenAI
from dotenv import load_dotenv
from pathlib import Path

from app.utils.logger import logger

env_path = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(dotenv_path=env_path)

client = OpenAI()

def transcribe_audio_video(file_path: str):
    logger.info(f"Starting transcription for file {file_path}")

    if not os.path.exists(file_path):
        logger.error(f"File not found for transcription: {file_path}")
        raise FileNotFoundError("File not found for transcription")

    with open(file_path, "rb") as audio_file:
        transcript = client.audio.transcriptions.create(
            file=audio_file,
            model="whisper-1",
            response_format="verbose_json",
        )

    logger.info(
        f"Transcription completed, segments={len(transcript.segments)}"
    )

    return transcript.segments
