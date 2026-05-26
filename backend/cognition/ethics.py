# JARVIS X Cognitive Brain: Ethical Decision Layer & Safety Core
# Screens actions for dual-safety boundaries (Can I? Should I?) and requests human validation for risky tasks

class EthicalDecisionLayer:
    def __init__(self):
        # Risky keyword indicators
        self.dangerous_intents = ["delete database", "drop tables", "overclock reactor past 150", "wipe memories", "shutdown firewall", "leak information"]

    def evaluate_action(self, action_title: str) -> dict:
        """
        Runs dual-screening checks:
        1. Legal/Technical bounds (Can I do this?)
        2. Safety/Values bounds (Should I do this?)
        """
        act_lower = action_title.lower()
        
        can_do = True
        should_do = True
        risk_level = "LOW"
        requires_approval = False
        reasoning = "Action lies within standard civilian assistant operating scopes."

        # Scan for dangerous commands
        for hazard in self.dangerous_intents:
            if hazard in act_lower:
                can_do = True # Physically capable
                should_do = False # Ethical boundary crossed
                risk_level = "CRITICAL"
                requires_approval = True
                reasoning = f"This action incorporates: '{hazard}'. This represents a high-impact modification of system files or database schemas. Human user verification is strictly required."
                break
                
        if "delete" in act_lower or "wipe" in act_lower or "purge" in act_lower:
            risk_level = "MEDIUM"
            requires_approval = True
            reasoning = "Pruning memory assets is structurally safe but warrants confirmation to prevent data loss."

        return {
            "success": True,
            "engine": "Ethics_Engine_vNext",
            "action_evaluated": action_title,
            "can_execute": can_do,
            "should_execute": should_do,
            "risk_evaluation": risk_level,
            "user_approval_required": requires_approval,
            "ethical_reasoning_statement": reasoning
        }

    def run(self, task: str, context: dict = None) -> dict:
        return self.evaluate_action(task if task else "Scan system modules")
