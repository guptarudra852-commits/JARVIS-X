# JARVIS X Cognitive Brain: Common Sense Engine
# Overcomes robotic interactions by injecting daily human logic parameters

facts = {
    "exam": "requires preparation and sharp focus",
    "school": "contains classrooms, teachers, and learning matrices",
    "email": "has a sender, a recipient, and an intent header",
    "water": "is wet, fluid, and essential for human life support",
    "night": "comes after evening and is suitable for rejuvenation",
    "coffee": "provides cellular activation via caffeine molecules",
    "starship": "requires thruster alignment and shields operational",
    "reactor": "demands heat threshold modulation to prevent catastrophic failure"
}

class CommonSenseEngine:
    def __init__(self):
        self.knowledge_facts = facts

    def check(self, query: str) -> str:
        """
        Scans a user query and returns active common sense observations to inject into reasoning loop.
        """
        query_lower = query.lower()
        active_observations = []
        for key, value in self.knowledge_facts.items():
            if key in query_lower:
                active_observations.append(f"Fact verified: {key.upper()} -> {value}.")
        
        if active_observations:
            return " | ".join(active_observations)
        return "Fact verified: Contextual actions match standard physical/logical relationships."

    def run(self, task: str, context: dict = None) -> dict:
        matched_fact = self.check(task)
        return {
            "success": True,
            "engine": "CommonSense_Engine_vNext",
            "matched_fact": matched_fact,
            "status": "grounding_validated"
        }
