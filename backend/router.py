def route(query):

    q=query.lower()

    if "open" in q:

        return "automation"

    elif "image" in q or "camera" in q or "vision" in q:

        return "vision"

    elif "code" in q or "program" in q or "develop" in q:

        return "coding"

    elif "remember" in q or "memory" in q or "recall" in q:

        return "memory"

    return "chat"
