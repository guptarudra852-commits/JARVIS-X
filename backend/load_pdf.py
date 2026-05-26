import os
from knowledge_loader import (
read_pdf,
chunk_text
)

from vector_store import (
save_chunks
)

if not os.path.exists("notes.pdf"):
    print("notes.pdf not found. Please place a 'notes.pdf' file in the root/app directory.")
else:
    text=read_pdf(
        "notes.pdf"
    )

    chunks=chunk_text(text)

    save_chunks(chunks)

    print(
        "Knowledge loaded"
    )
