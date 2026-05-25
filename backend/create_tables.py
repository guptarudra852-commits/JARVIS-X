from database import engine
from models.memory import Memory
from database import Base

Base.metadata.create_all(bind=engine)

print("Memory table created")
