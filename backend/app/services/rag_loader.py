from app.db.models.chunk import Chunk
from app.services.vector_store import VectorStore
from app.services.embedding_service import embed_texts
from app.utils.logger import logger

vector_store = None

def load_index(db):
    global vector_store

    logger.info("Loading chunks from database for vector index")

    chunks = db.query(Chunk).all()

    if not chunks:
        logger.warning("No chunks found in database")
        vector_store = VectorStore(dim=0)
        return vector_store

    texts = [c.text for c in chunks]
    ids = [c.id for c in chunks]

    logger.info(f"Generating embeddings for {len(texts)} chunks")

    embeddings = embed_texts(texts)

    vector_store = VectorStore(dim=len(embeddings[0]))
    vector_store.add(embeddings, ids)

    logger.info("Vector index created and populated")

    for c, emb in zip(chunks, embeddings):
        c.embedding = emb

    db.commit()

    logger.info("Embeddings saved to database")

    return vector_store
