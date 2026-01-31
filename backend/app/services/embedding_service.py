from openai import OpenAI
from app.utils.logger import logger

client = OpenAI()

def embed_texts(texts: list[str]) -> list[list[float]]:
    logger.info(
        f"Generating embeddings for {len(texts)} texts"
    )

    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=texts,
    )

    logger.info("Embeddings generated successfully")

    return [item.embedding for item in response.data]
