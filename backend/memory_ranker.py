from datetime import datetime

def memory_score(memory):

    # Safe handle for last_accessed
    last_accessed = memory.last_accessed if memory.last_accessed else datetime.utcnow()

    age = (
        datetime.utcnow() - last_accessed
    ).days

    recency=max(
        1,
        30-age
    )

    score=(

        memory.importance*

        memory.frequency*

        memory.confidence*

        recency

    )

    return score
