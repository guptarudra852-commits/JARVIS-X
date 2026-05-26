class TypingSignatureEngine:
    def __init__(self):
        # Establish reference biometric parameters for Rudra's typing patterns
        self.master_profile = {
            "avg_speed": 82,      # WPM (Words Per Minute)
            "avg_pause": 0.4,     # Seconds between paragraphs/long intervals
            "key_variance": 0.12  # Standard deviation in millisecond intervals
        }

    def verify_typing_profile(self, sample_stats: dict):
        """
        Processes dynamic timing arrays to see if physical keystroke dynamic
        behaviors correspond to registered Master profile.
        """
        print(f"[Typing Biometrics] Comparative analysis on keystroke patterns against Master benchmark. Sample specs: {sample_stats}")
        
        sample_speed = sample_stats.get("avg_speed", 0)
        sample_pause = sample_stats.get("avg_pause", 0.0)
        sample_variance = sample_stats.get("key_variance", 0.0)

        # Calculate deviation indices
        speed_delta = abs(self.master_profile["avg_speed"] - sample_speed)
        pause_delta = abs(self.master_profile["avg_pause"] - sample_pause)

        confidence_impact = 0

        # High variation triggers flags
        if speed_delta > 15:
            confidence_impact += 10
            print(f"[Typing Biometrics Alert] Typing velocity deviation of {speed_delta} WPM exceeds thresholds.")
            
        if pause_delta > 0.25:
            confidence_impact += 10
            print(f"[Typing Biometrics Alert] Interkey intervals or paragraph pause timing differs from benchmark.")

        matched = confidence_impact < 20
        if matched:
            print("[Typing Biometrics] Keystroke patterns match authenticated owner.")
            return {
                "matched": True,
                "confidence_penalty": confidence_impact,
                "message": "Physical interaction cadence successfully verified."
            }
        else:
            print("[Typing Biometrics Warning] Biometric profile mismatch detected! Possible keyboard hijacking or robot behavior.")
            return {
                "matched": False,
                "confidence_penalty": confidence_impact,
                "message": "Divergent typing signature style identified."
            }
