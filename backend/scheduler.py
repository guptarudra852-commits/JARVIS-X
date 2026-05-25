from apscheduler.schedulers.background import BackgroundScheduler
from memory_consolidator import consolidate

scheduler=BackgroundScheduler()

scheduler.add_job(
    lambda: consolidate("Rudra"),
    "interval",
    hours=24
)

scheduler.start()
