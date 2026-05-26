import time
import threading
from health import get_system_metrics

# Simple event registry structure
event_queue = [
    {"type": "new_email", "priority": 5, "payload": "Project proposal updates received"},
    {"type": "calendar_reminder", "priority": 8, "payload": "Upcoming review session at 2 PM"},
    {"type": "screen_change", "priority": 3, "payload": "Migrated workspace focus to editor"},
]

# Simple task execution queue
task_queue = []

def trigger_event(event_type, priority, payload=None):
    """
    Simulates event triggers coming from local sensors or WebSockets.
    """
    event = {
        "type": event_type,
        "priority": priority,
        "payload": payload,
        "timestamp": time.time()
    }
    event_queue.append(event)
    print(f"[Event Trigger] Enqueued: {event_type} (Priority: {priority})")

def check_events():
    """
    Pulls high priority events and promotes them to task queue triggers.
    """
    if not event_queue:
        return None
        
    # Sort by priority desc so highest event is handled first
    event_queue.sort(key=lambda x: x.get("priority", 0), reverse=True)
    next_event = event_queue.pop(0)
    print(f"[Event Monitor] Event Hook Triggered: '{next_event['type']}' with Priority {next_event['priority']}")
    
    # Push to task worker pipeline
    if next_event["type"] == "new_email":
        task_queue.append(f"read_email: {next_event['payload']}")
    elif next_event["type"] == "calendar_reminder":
        task_queue.append(f"alert_user: {next_event['payload']}")
    elif next_event["type"] == "screen_change":
        task_queue.append("verify_screen_alignment")
        
    return next_event

def process_queue():
    """
    Dequeues tasks and processes actions iteratively.
    """
    if not task_queue:
        return False
        
    task_action = task_queue.pop(0)
    print(f"[Worker Core] Processing asynchronous queue target: '{task_action}'")
    time.sleep(0.1) # Simulate slight mechanical/IO lag
    print(f"[Worker Core] Task successfully finalized: '{task_action}'")
    return True

def run_background_daemon():
    """
    The Alway-On Daemon loop running in separate supervisor threads.
    Checks resource states, flushes event queues, and executes queue updates.
    """
    print("[Daemon Lifecycle] JARVIS Heartbeat Engine online. Bootstrapping daemon listener routines...")
    loop_count = 0
    while loop_count < 10:  # Bound iteration limit for testing, can be set to True for actual daemon
        loop_count += 1
        print(f"\n--- [Heartbeat Pulse {loop_count}] System Audit tick started ---")
        
        # 1. Health Monitoring
        sys_health = get_system_metrics()
        print(f"[Heartbeat Monitor] Status: {sys_health['status'].upper()} | CPU Usage: {sys_health['cpu']}% | Mem: {sys_health['memory']}%")
        
        if sys_health['status'] == "critical_load":
            print("[Heartbeat Safeguard] System load too high! Suspending worker activations and waiting for cooldown.")
            time.sleep(10)
            continue
            
        # 2. Check Event Loops
        triggered = check_events()
        
        # 3. Flush Executions
        process_queue()
        
        # 4. Decay or Sleep intervals
        time.sleep(1.0) # Speed up test iterations relative to standard sleep intervals for responsive preview loading

    print("[Daemon Lifecycle] Finalizing test pulse run of Background Daemon loop.")

def start_daemon_thread():
    daemon_thread = threading.Thread(target=run_background_daemon, daemon=True)
    daemon_thread.start()
    return daemon_thread

if __name__ == "__main__":
    run_background_daemon()
