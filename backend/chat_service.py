from database import SessionLocal
from memory_service import get_memory

def build_context(user, user_input):

    db = SessionLocal()

    memories = get_memory(
        db,
        user
    )

    memory_text = ""

    for memory in memories:

        memory_text += f"""
        {memory.category}:
        {memory.content}
        """

    context = f"""

    User Memory:

    {memory_text}

    User Question:

    {user_input}

    """

    return context
