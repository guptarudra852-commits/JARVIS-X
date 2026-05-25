from sqlalchemy.orm import Session
from datetime import datetime
from models.memory import Memory
from memory_ranker import memory_score

def save_memory(db: Session, user, category, content):
    existing = db.query(
        Memory
    ).filter(
        Memory.user_id == user,
        Memory.category == category
    ).first()

    if existing:
        existing.content = content
        existing.frequency += 1
        existing.confidence += 1
        existing.last_accessed = datetime.now()
    else:
        memory = Memory(
            user_id=user,
            category=category,
            content=content,
            last_accessed=datetime.now()
        )
        db.add(memory)

    db.commit()
    return "saved"

def get_memory(db: Session, user):
    memories = db.query(
        Memory
    ).filter(
        Memory.user_id == user
    ).all()

    for memory in memories:
        memory.frequency += 1
        memory.last_accessed = datetime.now()

    db.commit()

    ranked = sorted(
        memories,
        key=memory_score,
        reverse=True
    )

    return ranked[:5]
