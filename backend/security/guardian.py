SECURITY_LEVELS = {
    1: "read_only",
    2: "suggest",
    3: "approval_required",
    4: "trusted_auto"
}

def validate_action(
    user,
    action,
    level=2
):
    dangerous = [
        "delete",
        "payment",
        "password",
        "system",
        "format",
        "destroy",
        "shutdown",
        "kill"
    ]

    action_lower = action.lower()
    for d in dangerous:
        if d in action_lower:
            print(f"[Guardian Security Warning] Blocked suspicious/dangerous token: '{d}' in user action: '{action}'")
            return False

    print(f"[Guardian Security] Action Approved: User '{user}' is authorized to execute '{action}' (Security Level: {SECURITY_LEVELS.get(level, 'custom')})")
    return True
