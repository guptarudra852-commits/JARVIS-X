class DeviceGuard:
    def __init__(self):
        # Register standard/approved trusted devices
        self.known_devices = [
            {
                "os": "windows",
                "browser": "chrome",
                "timezone": "india",
                "device_id": "hw-rudra-main-x1"
            },
            {
                "os": "mac",
                "browser": "safari",
                "timezone": "india",
                "device_id": "hw-rudra-macbook-pro"
            }
        ]

    def verify_device(self, current_specs: dict):
        """
        Compares dynamic device profile against trusted registers to calculate risk levels.
        """
        print(f"[Device Guard] Inspecting incoming signature parameters: {current_specs}")
        
        # Default device values if missing
        dev_id = current_specs.get("device_id", "unknown-signature")
        os_platform = current_specs.get("os", "").lower()
        browser = current_specs.get("browser", "").lower()
        timezone = current_specs.get("timezone", "").lower()

        # Find matching hardware configuration
        matched_device = None
        for device in self.known_devices:
            if device["device_id"] == dev_id:
                matched_device = device
                break
                
        if not matched_device:
            # Check if values correspond to expected patterns regardless of device_id string match
            for device in self.known_devices:
                if device["os"] == os_platform and device["timezone"] == timezone:
                    print("[Device Guard] Device ID has changed/unregistered but environment signatures match known trusted setups.")
                    return {
                        "trusted": True,
                        "risk_score": 15,  # Minimal custom risk profile
                        "status": "partial_trust_registered_env"
                    }
                    
            print(f"[Device Guard Security Warning] Unidentified target signature accessing session bounds: {current_specs}")
            return {
                "trusted": False,
                "risk_score": 75,  # High risk rating
                "status": "untrusted_device_detected"
            }

        # Validate spec matching precision metrics
        mismatch_count = 0
        if matched_device["os"] != os_platform:
            mismatch_count += 1
        if matched_device["browser"] != browser:
            mismatch_count += 1
        if matched_device["timezone"] != timezone:
            mismatch_count += 1

        if mismatch_count == 0:
            print("[Device Guard] Exact hardware profile matched with 100% precision. Zero risk vector detected.")
            return {
                "trusted": True,
                "risk_score": 0,
                "status": "fully_verified_signature"
            }
        elif mismatch_count == 1:
            print(f"[Device Guard Note] Slight drift in user client signatures (mismatch: {mismatch_count}). Potential proxy or browser migration.")
            return {
                "trusted": True,
                "risk_score": 30,
                "status": "trusted_profile_drifted"
            }
        else:
            print(f"[Device Guard Danger] Elevated hardware footprint drift observed (mismatch: {mismatch_count})!")
            return {
                "trusted": False,
                "risk_score": 60,
                "status": "untrusted_compromised_parameters"
            }
