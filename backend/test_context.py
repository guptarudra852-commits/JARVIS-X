from chat_service import build_context

prompt = build_context(
    "Rudra",
    "What project am I working on?"
)

print(prompt)
