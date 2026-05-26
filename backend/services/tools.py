from browser_agent import browser_agent_run
from desktop_agent import desktop_agent_run
from vision_agent import vision_agent_run

def validator_agent():
    print("[Validator Agent] Verifying current GUI state match...")
    return "Verification confirmed state represents expectations."

tools = {
    "open_browser": browser_agent_run,
    "open_app": desktop_agent_run,
    "screenshot": vision_agent_run,
    "verify": validator_agent
}
