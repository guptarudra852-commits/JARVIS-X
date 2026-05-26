from planner import create_plan
from tools import tools

def execute(task):
    plan = create_plan(task)
    print(f"[Executor] Calculated sub-steps to perform: {plan}")
    
    results = []
    for step in plan:
        if step in tools:
            print(f"[Executor] Running capability action: '{step}'")
            action_result = tools[step]()
            results.append(f"{step}: {action_result}")
        else:
            print(f"[Executor] Action step '{step}' not bound or handled directly, bypassing.")
            results.append(f"{step}: bypassed")
            
    return {
        "task": task,
        "steps_calculated": plan,
        "execution_log": results,
        "status": "success"
    }
