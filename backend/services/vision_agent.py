import pyautogui
import pytesseract
from PIL import Image

def capture():

    img=pyautogui.screenshot()

    img.save(
        "screen.png"
    )
    return img

def extract_text_from_screenshot():
    try:
        img = capture()
        text = pytesseract.image_to_string(img)
        return text
    except Exception as e:
        print(f"[Vision Agent Error] {e}")
        return f"Vision parsing halted: {e}"

def vision_agent_run():
    print("[Vision Agent] Capturing surface telemetry and executing OCR extraction.")
    extracted = extract_text_from_screenshot()
    return f"Vision snapshot analysis: {extracted[:100]}..."
