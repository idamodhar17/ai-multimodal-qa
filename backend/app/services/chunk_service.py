from sqlalchemy.orm import Session
from app.db.models.chunk import Chunk
from app.utils.logger import logger

def save_segments_as_chunks(
    db: Session,
    file_id,
    segments: list,
):
    logger.info(
        f"Saving {len(segments)} audio/video segments for file {file_id}"
    )

    chunks = []

    for seg in segments:
        chunk = Chunk(
            file_id=file_id,
            text=seg.text,
            start_time=seg.start,
            end_time=seg.end,
        )
        chunks.append(chunk)

    db.add_all(chunks)
    db.commit()

    logger.info(
        f"Audio/video chunks saved successfully for file {file_id}"
    )

def save_text_chunks(
    db: Session,
    file_id,
    text_chunks: list[str],
):
    logger.info(
        f"Saving {len(text_chunks)} text chunks for file {file_id}"
    )

    chunks = []

    for text in text_chunks:
        chunk = Chunk(
            file_id=file_id,
            text=text,
            start_time=None,
            end_time=None,
        )
        chunks.append(chunk)

    db.add_all(chunks)
    db.commit()

    logger.info(
        f"Text chunks saved successfully for file {file_id}"
    )
