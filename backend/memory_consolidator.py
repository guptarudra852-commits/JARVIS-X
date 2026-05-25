from database import SessionLocal
from memory_service import get_memory

def consolidate(user):

    db=SessionLocal()

    memories=get_memory(
        db,
        user
    )

    text=""

    for m in memories:

        text+=m.content+"\n"

    summary=f"""

    User profile summary:

    {text}

    """

    return summary
