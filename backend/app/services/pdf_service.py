from pypdf import PdfReader
from pdf2image import convert_from_path
import pytesseract

from fastapi import HTTPException
from app.utils.logger import logger


def extract_text_from_pdf(file_path: str) -> str:
    logger.info(f"Extracting text from PDF {file_path}")

    # Native PDF extraction
    reader = PdfReader(file_path)
    text_parts = []

    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text_parts.append(page_text)

    extracted_text = "\n".join(text_parts).strip()

    if extracted_text:
        logger.info(
            f"PDF text extraction completed (native), length={len(extracted_text)}"
        )
        return extracted_text

    # OCR fallback
    logger.warning(
        f"No native text found in PDF {file_path}, falling back to OCR"
    )

    ocr_text_parts = []

    try:
        images = convert_from_path(file_path)

        for image in images:
            page_text = pytesseract.image_to_string(image)
            if page_text.strip():
                ocr_text_parts.append(page_text)

    except Exception as e:
        logger.error(f"OCR failed for PDF {file_path}: {str(e)}")

    final_text = "\n".join(ocr_text_parts).strip()
    
    # Clean Fall
    if final_text:
        logger.info(
            f"PDF OCR extraction completed, length={len(final_text)}"
        )
        return final_text

    logger.error(
        f"PDF contains no readable content: {file_path}"
    )

    raise HTTPException(
        status_code=422,
        detail="This PDF contains no readable content",
    )
