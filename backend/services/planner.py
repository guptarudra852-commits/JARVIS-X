def create_plan(task):

    task=task.lower()

    if "send email" in task or "email" in task:

        return [
            "open_browser",
            "go_gmail",
            "compose",
            "write_message",
            "verify",
            "send"
        ]

    return ["chat"]
