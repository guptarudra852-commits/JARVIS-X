from database import SessionLocal
from memory_service import get_memory

db = SessionLocal()

data = get_memory(
    db,
    "Rudra"
)

for m in data:
    print(
        m.category,
        m.content,
        m.frequency
    )
