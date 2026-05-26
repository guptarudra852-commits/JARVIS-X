class ContinuousPresenceTracker:
    def __init__(self):
        # Initial presence variables
        self.face_visible = True
        self.keyboard_kb_events = True
        self.movement_detected = True
        self.idle_duration_seconds = 0

    def query_presence_status(self, face_visible: bool, movement_detected: bool, physical_typing: bool, idle_time: int):
        """
        Saves latest sensor ticks to calculate session locks.
        """
        self.face_visible = face_visible
        self.movement_detected = movement_detected
        self.keyboard_kb_events = physical_typing
        self.idle_duration_seconds = idle_time

        print(f"[Presence Monitor] Tick Status - Face in camera: {face_visible}, Hand/Body Motion: {movement_detected}, "
              f"Input devices active: {physical_typing}, Idle Counter: {idle_time}s")

        if not face_visible and not movement_detected and not physical_typing and idle_time > 180:
            print("[Presence Monitor Danger] Continuous inactivity criteria hit! Triggering safety sleep state.")
            return {
                "active": False,
                "action_required": "lock_console",
                "message": "User drifted from camera scope and devices went silent. Triggering automatic lock."
            }

        if idle_time > 300:
            print("[Presence Monitor Danger] Hard idle timer triggered. Automatic lockdown started.")
            return {
                "active": False,
                "action_required": "lock_console",
                "message": "Hard physical session timeout reached."
            }

        return {
            "active": True,
            "action_required": "keep_session_active",
            "message": "User remains actively present."
        }
