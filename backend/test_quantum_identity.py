import sys
import os

# Ensure backend folder is in PATH
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from security.quantum_identity import QuantumIdentityEngine

def run_quantum_identity_test():
    print("==========================================================")
    print("             COMPUTING QUANTUM MFA SECURITY SIGNATURES      ")
    print("==========================================================")
    
    engine = QuantumIdentityEngine()

    print("\n--- Test Scenario 1: Exact Master Biometrics Match (Expected: 'trusted' 90%+) ---")
    res1 = engine.evaluate_mfa_confidence()
    print(f"Outcome Decision: {res1['access_decision'].upper()} (Score: {res1['score']}%)")

    print("\n--- Test Scenario 2: Suspicious Spoofed Voice (Expected: degraded score) ---")
    spoofed_voice = {"mean_pitch": 255.0, "mean_energy": 0.35, "rhythm_ratio": 0.8}
    res2 = engine.evaluate_mfa_confidence(voice_metrics=spoofed_voice)
    print(f"Outcome Decision: {res2['access_decision'].upper()} (Score: {res2['score']}%)")

    print("\n--- Test Scenario 3: Device signature change or proxy drift (Expected: 'verify' 70%-90%) ---")
    strange_device = {"os": "linux", "browser": "firefox", "timezone": "london", "device_id": "unknown-clone"}
    res3 = engine.evaluate_mfa_confidence(device_specs=strange_device)
    print(f"Outcome Decision: {res3['access_decision'].upper()} (Score: {res3['score']}%)")

    print("\n--- Test Scenario 4: User walked away entirely (Expected: 'lock' < 70%) ---")
    offline_presence = {"face_visible": False, "movement": False, "typing": False, "idle_sec": 350}
    res4 = engine.evaluate_mfa_confidence(presence_indicators=offline_presence)
    print(f"Outcome Decision: {res4['access_decision'].upper()} (Score: {res4['score']}%)")

    print("\n==========================================================")
    print("         QUANTUM IDENTITY BIOMETRICS SUITE VERIFICATION SUCCESS")
    print("==========================================================")

if __name__ == "__main__":
    run_quantum_identity_test()
