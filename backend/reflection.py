def reflect(memories):

    lessons = []

    for m in memories:

        lessons.append(
            f"Lesson learned: {m.content if hasattr(m, 'content') else str(m)}"
        )

    return lessons
