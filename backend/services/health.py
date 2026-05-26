import psutil

def get_system_metrics():
    """
    Retrieves system resource utilization.
    Returns cpu utilization percent and memory virtual memory usage percent.
    """
    try:
        cpu = psutil.cpu_percent(interval=0.1)
        memory = psutil.virtual_memory().percent
        disk = psutil.disk_usage('/').percent
        return {
            "cpu": cpu,
            "memory": memory,
            "disk": disk,
            "status": "stable" if cpu < 85 and memory < 90 else "critical_load"
        }
    except Exception as e:
        print(f"[Health Check Error] {e}")
        return {
            "cpu": 0.0,
            "memory": 0.0,
            "disk": 0.0,
            "status": "error",
            "error": str(e)
        }
