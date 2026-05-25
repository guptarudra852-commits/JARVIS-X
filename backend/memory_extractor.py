def extract_memory(user_input):

    memory = None

    text = user_input.lower()

    if "my name is" in text:
        # Get start index to slice case-insensitively
        idx = text.find("my name is")
        name = user_input[idx + len("my name is"):].strip()
        memory = (
            "identity",
            f"Name: {name}"
        )

    elif "i am building" in text:
        idx = text.find("i am building")
        project = user_input[idx + len("i am building"):].strip()
        memory = (
            "project",
            project
        )

    elif "my favorite team is" in text:
        # Split on text index to avoid case problems
        idx = text.find("my favorite team is")
        team = user_input[idx + len("my favorite team is"):].strip()
        if team.lower().startswith("is"):
            team = team[2:].strip()
        memory = (
            "preference",
            f"Favorite Team: {team}"
        )

    return memory
