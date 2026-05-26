def save_episode(
    db,
    user,
    event,
    summary
):

    episode = {
        "user_id": user,
        "event": event,
        "summary": summary
    }

    return episode
