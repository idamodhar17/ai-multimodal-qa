from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from app.deps import get_db
from app.routers.auth import get_current_user
from app.db.models.file import File
from app.services.whisper_service import transcribe_audio_video
from app.services.chunk_service import (
    save_segments_as_chunks,
    save_text_chunks,
)
from app.services.pdf_service import extract_text_from_pdf
from app.services.chunking import chunk_text
from app.utils.logger import logger

# Router for file processing
router = APIRouter(prefix="/process", tags=["Process"])

# Process Uploaded file into chunks
@router.post("/{file_id}")
def process_file(
    file_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    logger.info(
        f"Process request received for file {file_id} by user {current_user.id}"
    )

    file_uuid = UUID(file_id)
    user_uuid = UUID(current_user.id)

    # Fetch file belonging to the user
    file = (
        db.query(File)
        .filter(File.id == file_uuid, File.user_id == user_uuid)
        .first()
    )

    if not file:
        logger.warning(
            f"File {file_id} not found for user {current_user.id}"
        )
        raise HTTPException(status_code=404, detail="File not found")

    file_path = f"storage/uploads/{file.id}.{file.file_type}"

    if file.file_type == "pdf":
        logger.info(f"Starting PDF processing for file {file.id}")

        text = extract_text_from_pdf(file_path)
        chunks = chunk_text(text)
        save_text_chunks(db, file.id, chunks)

        logger.info(
            f"PDF processing completed for file {file.id}, chunks={len(chunks)}"
        )

        return {
            "message": "PDF processed successfully",
            "chunks": len(chunks),
        }

    if file.file_type in {"mp3", "wav", "mp4"}:
        logger.info(
            f"Starting audio/video processing for file {file.id}"
        )

        segments = transcribe_audio_video(file_path)
        save_segments_as_chunks(db, file.id, segments)

        logger.info(
            f"Audio/video processing completed for file {file.id}, segments={len(segments)}"
        )

        return {
            "message": "Audio/Video processed successfully",
            "segments": len(segments),
        }

    logger.warning(
        f"Unsupported file type {file.file_type} for file {file.id}"
    )

    raise HTTPException(
        status_code=400,
        detail="Unsupported file type",
    )
