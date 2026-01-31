from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from openai import OpenAI
from pydantic import BaseModel
from uuid import UUID

from app.deps import get_db
from app.routers.auth import get_current_user
from app.db.models.chunk import Chunk
from app.services.embedding_service import embed_texts
from app.services.rag_loader import load_index
from app.utils.logger import logger

router = APIRouter(prefix="/chat", tags=["Chat"])
client = OpenAI()


class ChatRequest(BaseModel):
    question: str
    file_id: UUID


@router.post("/")
def chat(
    payload: ChatRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    logger.info(
        f"Chat query received from user {current_user.id} for file {payload.file_id}"
    )

    vector_store = load_index(db, payload.file_id)

    if vector_store is None:
        raise HTTPException(
            status_code=400,
            detail="File is still being processed. Please try again in a moment.",
        )

    query_embedding = embed_texts([payload.question])[0]

    chunk_ids = vector_store.search(query_embedding, k=5)

    logger.info(f"Vector search returned {len(chunk_ids)} chunks")

    chunks = (
        db.query(Chunk)
        .filter(
            Chunk.id.in_(chunk_ids),
            Chunk.file_id == payload.file_id,
        )
        .all()
    )

    if not chunks:
        raise HTTPException(
            status_code=404,
            detail="No relevant content found for this file",
        )

    context = "\n".join(c.text for c in chunks)

    prompt = f"""
                Use the context below to answer the question.

                Context:
                {context}

                Question:
                {payload.question}
                """

    logger.info("Sending prompt to OpenAI")

    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
    )

    logger.info("OpenAI response received")

    return {
        "answer": completion.choices[0].message.content,
        "sources": [
            {
                "start": c.start_time,
                "end": c.end_time,
            }
            for c in chunks
            if c.start_time is not None
        ],
    }
