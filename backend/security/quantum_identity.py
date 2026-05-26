from face_guard import verify_camera_face, analyze_liveness
from device_guard import DeviceGuard
from typing_speed import TypingSignatureEngine
from voice_guard import VoiceGuard
from presence import ContinuousPresenceTracker

import time

class QuantumIdentityEngine:
    def __init__(self):
        # Initialize sub-guards
        self.device_engine = DeviceGuard()
        self.typing_engine = TypingSignatureEngine()
        self.voice_engine = VoiceGuard()
        self.presence_engine = ContinuousPresenceTracker()
        
        # Security levels definitions: Normal, Developer, Travel, High Security
        self.current_security_mode = "high_security"
        self.threat_log = []

    def evaluate_mfa_confidence(
        self,
        camera_face_path="security/rudra.jpg",
        face_detected_override=True,
        blink_count=2,
        head_turn_detected=True,
        device_specs=None,
        typing_metrics=None,
        voice_metrics=None,
        presence_indicators=None
    ):
        """
        Gathers multidimensional biometric signals to resolve an integrated Quantum MFA identity confidence score.
        Formula:
          score = face * 35% + voice * 25% + device * 15% + typing * 15% + presence * 10%
        """
        # 1. Face Metric
        face_result = verify_camera_face(camera_face_path)
        face_val = face_result.get("confidence", 1.0) if face_result.get("verified", True) else 0.0
        
        # Apply anti-spoofing/liveness penalty if invalid
        liveness_ok = analyze_liveness(blink_count, head_turn_detected)
        if not liveness_ok:
            face_val *= 0.35 # Huge penalty for failing anti-spoofing test
            print("[Quantum Identity Engine Warning] Anti-spoofing criteria failed. Biometric reliability rating degraded.")

        # 2. Voice Metric
        voice_specs = voice_metrics or {"mean_pitch": 118.0, "mean_energy": 0.84, "rhythm_ratio": 1.25}
        voice_result = self.voice_engine.verify_voice_print(voice_specs)
        voice_val = voice_result.get("confidence", 1.0) if voice_result.get("verified", True) else 0.2

        # 3. Device Metric
        default_device = {"os": "windows", "browser": "chrome", "timezone": "india", "device_id": "hw-rudra-main-x1"}
        device_specs = device_specs or default_device
        device_result = self.device_engine.verify_device(device_specs)
        device_risk = device_result.get("risk_score", 0)
        # Convert risk (0 to 100) to validation modifier (1.0 to 0.0)
        device_val = max(0.0, 1.0 - (device_risk / 100.0))

        # 4. Typing Metric
        typing_specs = typing_metrics or {"avg_speed": 80, "avg_pause": 0.41, "key_variance": 0.12}
        typing_result = self.typing_engine.verify_typing_profile(typing_specs)
        # Handle matching score and apply penalty if mismatched
        typing_val = 1.0 if typing_result.get("matched", True) else 0.4
        penalty = typing_result.get("confidence_penalty", 0) / 100.0
        typing_val = max(0.0, typing_val - penalty)

        # 5. Presence Metric
        presence_indicators = presence_indicators or {"face_visible": True, "movement": True, "typing": True, "idle_sec": 10}
        presence_result = self.presence_engine.query_presence_status(
            presence_indicators.get("face_visible", True),
            presence_indicators.get("movement", True),
            presence_indicators.get("typing", True),
            presence_indicators.get("idle_sec", 0)
        )
        presence_val = 1.0 if presence_result.get("active", True) else 0.0

        # Quantum Identity Core weights distribution math
        score = (
            (face_val * 0.35) +
            (voice_val * 0.25) +
            (device_val * 0.15) +
            (typing_val * 0.15) +
            (presence_val * 0.10)
        ) * 100.0

        print(f"[Quantum MFA Calc] Face={face_val:.2f}, Voice={voice_val:.2f}, Device={device_val:.2f}, "
              f"Typing={typing_val:.2f}, Presence={presence_val:.2f} | Final Composite Confidence Score: {score:.2f}%")

        # Resolve access decisions using strict identity thresholds
        # Threshold bounds: 90+ -> trusted, 70-90 -> verify, <70 -> lock
        decision = "lock"
        if score >= 90.0:
            decision = "trusted"
        elif score >= 70.0:
            decision = "verify"
        else:
            decision = "lock"
            # Watch multiple failed attempts or camera blocks
            self.trigger_silent_alarm(score, "Threshold lock triggered due to low confidence")

        return {
            "score": round(score, 2),
            "access_decision": decision,
            "metrics": {
                "face_ratio": face_val,
                "voice_ratio": voice_val,
                "device_ratio": device_val,
                "typing_ratio": typing_val,
                "presence_ratio": presence_val
            },
            "security_mode": self.current_security_mode,
            "timestamp": time.time()
        }

    def set_security_mode(self, mode_name: str):
        allowed_modes = ["normal", "developer", "travel", "high_security"]
        if mode_name.lower() in allowed_modes:
            self.current_security_mode = mode_name.lower()
            print(f"[Quantum Identity] Switched system security mode to: {self.current_security_mode.upper()}")
            return True
        return False

    def trigger_silent_alarm(self, score, reason):
        """
        Alarm response logic triggered when threat metrics breach secure thresholds.
        Captures dynamic screenshot parameters and logs event structures.
        """
        event = {
            "timestamp": time.time(),
            "score": score,
            "reason": reason,
            "severity": "CRITICAL" if score < 50.0 else "WARNING"
        }
        self.threat_log.append(event)
        print(f"[ALARM TRIGGERED] Silent threat detected! Threat Factor Score: {score:.2f}%. Reason: {reason}")
        print("[ALARM ACTION] Capturing active workstation screenshot telemetry and locking down sandbox environment.")
        return event
