# State Modes dictionary defining configuration bounds
SYSTEM_MODES = {
    "study": {
        "personality": "Informative & Academic",
        "permission_level": 1,
        "tools_allowed": ["search", "memory"],
        "memory_weight": "academic_importance"
    },
    "developer": {
        "personality": "Highly Technical & Syntactic",
        "permission_level": 2,
        "tools_allowed": ["code", "terminal_agent", "debugger"],
        "memory_weight": "project_integrity"
    },
    "autonomous": {
        "personality": "Pragmatic, Direct & Self-Executing",
        "permission_level": 4,
        "tools_allowed": ["browser_agent", "camera_agent", "terminal_agent", "memory_agent"],
        "memory_weight": "frequency"
    },
    "productivity": {
        "personality": "Concise & Schedule-Optimized",
        "permission_level": 2,
        "tools_allowed": ["scheduler", "planner_agent"],
        "memory_weight": "recency"
    }
}

class ModeSelector:
    def __init__(self, initial_mode="developer"):
        self.current_mode = initial_mode if initial_mode in SYSTEM_MODES else "developer"
        print(f"[Modes Manager] Intialized JARVIS module in '{self.current_mode}' mode.")

    def change_mode(self, new_mode: str):
        if new_mode in SYSTEM_MODES:
            self.current_mode = new_mode
            print(f"[Modes Manager] Mode migrated successfully to level: '{self.current_mode}'.")
            return SYSTEM_MODES[new_mode]
        print(f"[Modes Manager Error] System has no active configuration for: '{new_mode}' style.")
        return None

    def get_current_setup(self):
        return SYSTEM_MODES[self.current_mode]
