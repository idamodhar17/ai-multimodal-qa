from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from openai import OpenAI

from app.deps import get_db
from app.routers.auth import get_current_user
from app.db.models.chunk import Chunk
from app.services.embedding_service import embed_texts
from app.services.rag_loader import load_index, vector_store
from app.utils.logger import logger

router = APIRouter(prefix="/chat", tags=["Chat"])
client = OpenAI()


@router.post("/")
def chat(
    question: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    logger.info(
        f"Chat query received from user {current_user.id}"
    )

    global vector_store

    if vector_store is None:
        logger.info("Loading vector store into memory")
        vector_store = load_index(db)

    query_embedding = embed_texts([question])[0]

    chunk_ids = vector_store.search(query_embedding, k=5)

    logger.info(
        f"Vector search returned {len(chunk_ids)} chunks"
    )

    chunks = db.query(Chunk).filter(Chunk.id.in_(chunk_ids)).all()

    context = "\n".join(c.text for c in chunks)

    prompt = f"""
Use the context below to answer the question.

Context:
{context}

Question:
{question}
"""

    logger.info("Sending prompt to OpenAI")

    # Generate answer from OpenAI
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
    )

    logger.info("OpenAI response received")

    # Return answer with timestamps
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
