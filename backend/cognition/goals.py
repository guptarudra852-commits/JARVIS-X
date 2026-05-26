# JARVIS X Cognitive Brain: Goal Motivation
# Manages multi-turn objectives, generating dynamic subtask paths and tracking completion reward

GOAL_STORE = [
    {
        "id": "g-01",
        "goal": "Build complete JARVIS X Cognitive Brain vNext integration",
        "progress": 70,
        "subtasks": [
            {"name": "Create cognition folder and files", "done": True},
            {"name": "Implement 10 human cognitive skill algorithms", "done": True},
            {"name": "Build full real-time React UI playground", "done": False},
            {"name": "Compile linter test pipeline and deploy", "done": False}
        ],
        "reward": "Quantum AI Developer Badge unlocked"
    },
    {
        "id": "g-02",
        "goal": "Maintain system mainframe memory load below peak constraints",
        "progress": 100,
        "subtasks": [
            {"name": "Integrative garbage sweep testing", "done": True},
            {"name": "Validate episodic memory decay timing", "done": True}
        ],
        "reward": "High efficiency throughput certification"
    }
]

class GoalMotivationEngine:
    def __init__(self):
        self.goals = GOAL_STORE

    def get_goals(self) -> list:
        return self.goals

    def create_goal(self, goal_title: str, reward: str = "Pristine alignment") -> dict:
        new_g = {
            "id": f"g-{len(self.goals) + 1:02d}",
            "goal": goal_title,
            "progress": 0,
            "subtasks": [
                {"name": "Deconstruct goal objectives", "done": True},
                {"name": "Trigger active research skill", "done": False},
                {"name": "Enact physical desktop automation checks", "done": False}
            ],
            "reward": reward
        }
        self.goals.append(new_g)
        return new_g

    def update_subtask(self, goal_id: str, subtask_name: str, done: bool) -> dict:
        for g in self.goals:
            if g["id"] == goal_id:
                for sub in g["subtasks"]:
                    if sub["name"].lower() == subtask_name.lower():
                        sub["done"] = done
                        break
                        
                # Re-calculate overall process progress
                total = len(g["subtasks"])
                completed = sum(1 for sub in g["subtasks"] if sub["done"])
                g["progress"] = int((completed / total) * 100) if total > 0 else 100
                return g
        return {}

    def run(self, task: str, context: dict = None) -> dict:
        if task:
            g = self.create_goal(task)
            return {
                "success": True,
                "engine": "GoalMotivation_Engine_vNext",
                "goal_created": g,
                "current_goals": self.goals
            }
        else:
            return {
                "success": True,
                "engine": "GoalMotivation_Engine_vNext",
                "current_goals": self.goals
            }
