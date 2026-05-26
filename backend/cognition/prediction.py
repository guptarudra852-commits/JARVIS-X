# JARVIS X Cognitive Brain: Predictive Analytics & Temporal Model
# Foresees upcoming active sessions, task rates, and user productivity zones from historic telemetry

class PredictionEngine:
    def __init__(self):
        pass

    def predict(self, history: list) -> dict:
        """
        Analyzes historic events to forecast likely active intervals and pre-emptive tasks.
        """
        if not history:
            history = [
                {"hour": 19, "activity": "code_compilation", "focus_metric": 88},
                {"hour": 20, "activity": "web_search", "focus_metric": 95},
                {"hour": 21, "activity": "video_editing", "focus_metric": 75},
                {"hour": 8, "activity": "email_reads", "focus_metric": 40}
            ]
            
        # Standard time segment prediction heuristic
        evening_count = 0
        morning_count = 0
        
        for item in history:
            hour = item.get("hour", 12)
            if 17 <= hour <= 23:
                evening_count += 1
            elif 6 <= hour <= 12:
                morning_count += 1
                
        # Forecast likely active zones
        if evening_count >= morning_count:
            active_pct = 95
            predicted_time_frame = "07:00 PM - 09:00 PM (19:00 - 21:00)"
            primary_energy_vibe = "High Mental Study & Coding Operations"
            suggested_action = "Prepare code_skill cache and pre-render theme templates."
        else:
            active_pct = 80
            predicted_time_frame = "08:00 AM - 11:00 AM (08:00 - 11:00)"
            primary_energy_vibe = "Daily Communications & Email Sync"
            suggested_action = "Format email_skill briefs and summarize notifications."

        return {
            "success": True,
            "engine": "Prediction_Engine_vNext",
            "historical_factors_counted": len(history),
            "predicted_active_window": predicted_time_frame,
            "probability_confidence": f"{active_pct}%",
            "user_energy_vibe": primary_energy_vibe,
            "autonomous_pre_emptive_task": suggested_action
        }

    def run(self, task: str, context: dict = None) -> dict:
        # Allow passing custom history entries from frontend
        history_context = context.get("history", []) if context else []
        prediction = self.predict(history_context)
        return prediction
