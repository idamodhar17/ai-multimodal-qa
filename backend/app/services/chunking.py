from app.utils.logger import logger


def chunk_text(
    text: str,
    chunk_size: int = 500,
    overlap: int = 50,
):
    words = text.split()
    chunks = []

    logger.info(
        f"Chunking text with {len(words)} words"
    )

    start = 0
    while start < len(words):
        end = start + chunk_size
        chunk_words = words[start:end]
        chunks.append(" ".join(chunk_words))
        start += chunk_size - overlap

    logger.info(
        f"Generated {len(chunks)} text chunks"
    )

    return chunks
