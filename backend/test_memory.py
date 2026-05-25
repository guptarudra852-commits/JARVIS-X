from database import SessionLocal
from memory_service import save_memory

db = SessionLocal()

save_memory(
    db,
    "Rudra",
    "project",
    "Building JARVIS X"
)

print("Done")
