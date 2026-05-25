from datetime import datetime

def should_delete(memory):

    if not memory.last_accessed:
        return False

    age=(
        datetime.now()
        -memory.last_accessed
    ).days

    if age>60:

        return True

    return False

def prune_stale_memories(db, user):
    from models.memory import Memory
    memories = db.query(Memory).filter(Memory.user_id == user).all()
    deleted_count = 0
    for m in memories:
        if should_delete(m):
            db.delete(m)
            deleted_count += 1
    if deleted_count > 0:
        db.commit()
    return f"Pruned {deleted_count} stale memory blocks."
