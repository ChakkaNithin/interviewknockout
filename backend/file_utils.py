import io
import logging
from fastapi import UploadFile, HTTPException

logger = logging.getLogger(__name__)


async def extract_text_from_upload(file: UploadFile) -> str:
    content = await file.read()
    return extract_text_from_bytes(content, file.filename or "")


def extract_text_from_bytes(content: bytes, filename: str) -> str:
    name = filename.lower()
    if name.endswith(".pdf"):
        return _extract_pdf(content)
    if name.endswith(".docx") or name.endswith(".doc"):
        return _extract_docx(content)
    if name.endswith(".txt"):
        return content.decode("utf-8", errors="ignore")
    raise HTTPException(status_code=400, detail="Unsupported file type. Use .pdf, .docx or .txt")


def _extract_pdf(content: bytes) -> str:
    try:
        from pypdf import PdfReader
        reader = PdfReader(io.BytesIO(content))
        text_parts = []
        for page in reader.pages:
            try:
                text_parts.append(page.extract_text() or "")
            except Exception:
                continue
        return "\n".join(text_parts).strip()
    except Exception as e:
        logger.exception("PDF extraction failed")
        raise HTTPException(status_code=400, detail="Failed to read PDF")


def _extract_docx(content: bytes) -> str:
    try:
        from docx import Document
        doc = Document(io.BytesIO(content))
        parts = [p.text for p in doc.paragraphs if p.text]
        for table in doc.tables:
            for row in table.rows:
                for cell in row.cells:
                    if cell.text:
                        parts.append(cell.text)
        return "\n".join(parts).strip()
    except Exception as e:
        logger.exception("DOCX extraction failed")
        raise HTTPException(status_code=400, detail=f"Failed to read DOCX: {e}")
