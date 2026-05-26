import pyautogui

def open_start():

    pyautogui.press(
        "win"
    )

def type_text(text):

    pyautogui.write(
        text
    )

def desktop_agent_run():
    print("[Desktop Agent] Firing desktop action pipeline.")
    try:
        open_start()
        return "Desktop execution succeeded."
    except Exception as e:
         print(f"[Desktop Agent Error] {e}")
         return f"Desktop action halted: {e}"
