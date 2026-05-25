from database import SessionLocal
from memory_service import get_memory

db = SessionLocal()

memories = get_memory(
    db,
    "Rudra"
)

for memory in memories:

    print(
        memory.category,
        ":",
        memory.content
    )
