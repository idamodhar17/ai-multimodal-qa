from app.db.models.chunk import Chunk
from app.services.vector_store import VectorStore
from app.services.embedding_service import embed_texts
from app.utils.logger import logger

def load_index(db, file_id):
    logger.info(f"Loading vector index for file {file_id}")

    chunks = (
        db.query(Chunk)
        .filter(Chunk.file_id == file_id)
        .all()
    )

    if not chunks:
        logger.warning(f"No chunks found for file {file_id}")
        return None

    texts = [c.text for c in chunks]
    ids = [c.id for c in chunks]

    logger.info(f"Embedding {len(texts)} chunks")

    embeddings = embed_texts(texts)

    vector_store = VectorStore(dim=len(embeddings[0]))
    vector_store.add(embeddings, ids)

    logger.info(f"Vector index created for file {file_id}")

    return vector_store
