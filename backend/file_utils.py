import io
import logging
from fastapi import UploadFile, HTTPException

logger = logging.getLogger(__name__)


async def extract_text_from_upload(file: UploadFile) -> str:
    """Extract text from an uploaded PDF or DOCX file."""
    content = await file.read()
    name = (file.filename or "").lower()
    if name.endswith(".pdf"):
        return _extract_pdf(content)
    if name.endswith(".docx") or name.endswith(".doc"):
        return _extract_docx(content)
    if name.endswith(".txt"):
        try:
            return content.decode("utf-8", errors="ignore")
        except Exception:
            return ""
    raise HTTPException(status_code=400, detail="Unsupported file type. Use .pdf, .docx or .txt")


def _extract_pdf(content: bytes) -> str:
    try:
        import PyPDF2
        reader = PyPDF2.PdfReader(io.BytesIO(content))
        text_parts = []
        for page in reader.pages:
            try:
                text_parts.append(page.extract_text() or "")
            except Exception:
                continue
        return "\n".join(text_parts).strip()
    except Exception as e:
        logger.exception("PDF extraction failed")
        raise HTTPException(status_code=400, detail=f"Failed to read PDF: {e}")


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
