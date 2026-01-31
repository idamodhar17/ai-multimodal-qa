from pypdf import PdfReader
from app.utils.logger import logger

def extract_text_from_pdf(file_path: str) -> str:
    logger.info(f"Extracting text from PDF {file_path}")

    reader = PdfReader(file_path)
    text = []

    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text.append(page_text)

    final_text = "\n".join(text)

    logger.info(
        f"PDF text extraction completed, length={len(final_text)}"
    )

    return final_text
