# JARVIS X Cognitive Brain: Curiosity Engine
# Tracks and elevates technical interests, launching automated curiosity research threads

# Seed simulated/in-memory database of interests
INTEREST_STORE = {
    "AI agents": 92,
    "Backend systems": 85,
    "Quantum physics": 65,
    "Holographic UI Design": 78
}

class CuriosityEngine:
    def __init__(self):
        self.interests = INTEREST_STORE

    def get_interests(self) -> dict:
        return self.interests

    def record_interest_click(self, topic: str, increment: int = 5) -> int:
        """
        Notices a pattern and increments the curiosity score for a given topic.
        """
        if topic in self.interests:
            self.interests[topic] = min(100, self.interests[topic] + increment)
        else:
            self.interests[topic] = min(100, max(10, increment))
        return self.interests[topic]

    def trigger_autonomous_curiosity_scan(self) -> dict:
        """
        Finds the highest-rated interest topic and executes a simulated background research loop on it.
        """
        if not self.interests:
            return {"message": "No registered curiosity topics found."}
            
        hottest_topic = max(self.interests, key=self.interests.get)
        score = self.interests[hottest_topic]
        
        # Simulated research loop
        research_outcomes = [
            f"Indexed top 10 articles matching '{hottest_topic}' query.",
            f"Synthesizing key summaries into episodic memory cache.",
            f"Dispatched background summary report compile for: '{hottest_topic}'."
        ]
        
        return {
            "success": True,
            "engine": "Curiosity_Engine_vNext",
            "topic": hottest_topic,
            "score": score,
            "research_outcomes": research_outcomes,
            "status": "autonomous_grounding_completed"
        }

    def run(self, task: str, context: dict = None) -> dict:
        if task:
            new_score = self.record_interest_click(task, increment=10)
            return {
                "success": True,
                "engine": "Curiosity_Engine_vNext",
                "interest_registered": task,
                "score": new_score,
                "analytics": self.interests
            }
        else:
            return self.trigger_autonomous_curiosity_scan()
