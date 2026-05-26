# World State Engine representing active runtime parameters
class WorldState:
    def __init__(self):
        self.state = {
            "open_apps": [],
            "browser_tabs": [],
            "active_task": None,
            "screen": "unknown",
            "system_health": "stable",
            "network_status": "connected"
        }

    def update_state(self, key, value):
        if key in self.state:
            self.state[key] = value
            print(f"[World State Update] Stored state state key: '{key}' to active val: {value}")
            return True
        return False

    def get_current_state(self):
        return self.state

    def reset_state(self):
        self.state = {
            "open_apps": [],
            "browser_tabs": [],
            "active_task": None,
            "screen": "unknown",
            "system_health": "stable",
            "network_status": "connected"
        }
        print("[World State Reset] Flushing current environment state values back to defaults.")
        return True
