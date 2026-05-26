from pypdf import PdfReader
from docx import Document

def read_pdf(path):

    reader=PdfReader(path)

    text=""

    for page in reader.pages:

        extracted=page.extract_text()

        if extracted:

            text+=extracted

    return text


def read_docx(path):

    doc=Document(path)

    return "\n".join(
        p.text for p in doc.paragraphs
    )


def chunk_text(
    text,
    size=500
):

    chunks=[]

    for i in range(
        0,
        len(text),
        size
    ):

        chunks.append(
            text[i:i+size]
        )

    return chunks
