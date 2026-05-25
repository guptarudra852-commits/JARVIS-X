from fastapi import FastAPI
from database import SessionLocal
from models.memory import Memory

app = FastAPI(title="JARVIS X Long-Term Memory Service")

# Dependency to get db session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {
        "status": "online",
        "system": "JARVIS X Long-Term Memory Module",
        "protocol": "SQLAlchemy + FastAPI"
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy"}
