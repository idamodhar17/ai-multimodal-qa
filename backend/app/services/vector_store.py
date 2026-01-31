import faiss
import numpy as np
from app.utils.logger import logger

class VectorStore:
    def __init__(self, dim: int):
        logger.info(f"Initializing FAISS index with dim={dim}")
        self.index = faiss.IndexFlatL2(dim)
        self.chunk_ids = []

    def add(self, embeddings, ids):
        logger.info(f"Adding {len(ids)} vectors to FAISS index")

        self.index.add(np.array(embeddings).astype("float32"))
        self.chunk_ids.extend(ids)

        logger.info("Vectors added to FAISS index")

    def search(self, query_embedding, k=5):
        logger.info(f"Searching FAISS index with top_k={k}")

        distances, indices = self.index.search(
            np.array([query_embedding]).astype("float32"), k
        )

        result_ids = [
            self.chunk_ids[i] for i in indices[0] if i != -1
        ]

        logger.info(f"FAISS search returned {len(result_ids)} results")

        return result_ids
