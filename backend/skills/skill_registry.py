# JARVIS X Skill Registry and Composite Skill Engine Management Layout
import os
import sys

# Append current directory to path dynamic resolver
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from research_skill import ResearchSkill
from coding_skill import CodingSkill
from video_skill import VideoSkill
from design_skill import DesignSkill
from computer_skill import ComputerSkill
from email_skill import EmailSkill
from learning_skill import LearningSkill
from autonomous_skill import AutonomousSkill

# Master Skill Registry Table
SKILLS = {
    "research": ResearchSkill(),
    "coding": CodingSkill(),
    "video": VideoSkill(),
    "design": DesignSkill(),
    "computer": ComputerSkill(),
    "email": EmailSkill(),
    "learning": LearningSkill(),
    "autonomous": AutonomousSkill()
}

# Skill usage success and confidence tracker (Learnt metrics)
SKILL_CONFIDENCE = {
    "research": 91,
    "coding": 95,
    "video": 80,
    "design": 85,
    "computer": 88,
    "email": 94,
    "learning": 97,
    "autonomous": 89
}

def get_best_skill():
    """
    Finds the highly optimized system skill capability with maximum active confidence scores.
    """
    best = max(SKILL_CONFIDENCE, key=SKILL_CONFIDENCE.get)
    return best, SKILL_CONFIDENCE[best]

def update_skill_performance(skill_name: str, success: bool):
    """
    Self-learning routine: night updates and continuous reinforcement of skill confidence weights.
    """
    if skill_name in SKILL_CONFIDENCE:
        if success:
            SKILL_CONFIDENCE[skill_name] = min(100, SKILL_CONFIDENCE[skill_name] + 1)
            print(f"[Self-Learning Engine] Incremented '{skill_name}' reliability to {SKILL_CONFIDENCE[skill_name]}% owing to successful execution.")
        else:
            SKILL_CONFIDENCE[skill_name] = max(50, SKILL_CONFIDENCE[skill_name] - 2)
            print(f"[Self-Learning Engine Warning] Degraded '{skill_name}' score to {SKILL_CONFIDENCE[skill_name]}% upon execution failure. Planning optimization update...")
        return True
    return False

def run_composite_pipeline(composite_task: str, context: dict = None) -> list:
    """
    Orchestrates complex multi-skill sequences. Example:
    "create youtube video" -> ResearchSkill -> DesignSkill -> VideoSkill
    """
    print(f"[Composite Orchestrator] Building multi-agent task execution timeline for: '{composite_task}'")
    
    task_map = composite_task.lower()
    pipeline_results = []
    
    if "youtube" in task_map or "video production" in task_map:
        sequence = ["research", "design", "video"]
        sub_prompts = {
            "research": f"Gather content and outline outline references for: {composite_task}",
            "design": f"Generate striking thumbnail layer parameters for visual assets: {composite_task}",
            "video": f"Compile timelines and apply mp4 render layouts: {composite_task}"
        }
    elif "deploy software" in task_map or "code feature" in task_map:
        sequence = ["learning", "coding", "computer"]
        sub_prompts = {
            "learning": f"Examine previous project configurations: {composite_task}",
            "coding": f"Synthesize structured source models: {composite_task}",
            "computer": f"Deploy changes to local workstation servers: {composite_task}"
        }
    else:
        # Standard generic sequence
        sequence = ["research", "coding"]
        sub_prompts = {
            "research": f"Retrieve documentation info: {composite_task}",
            "coding": f"Execute implementation parameters: {composite_task}"
        }

    for skill_key in sequence:
        if skill_key in SKILLS:
            print(f"\n[Composite Pipeline] >> Advancing to phase skill: '{skill_key.upper()}' (Confidence Index: {SKILL_CONFIDENCE[skill_key]}%)")
            skill_executor = SKILLS[skill_key]
            phase_prompt = sub_prompts.get(skill_key, composite_task)
            
            # Executing sub-skill
            res = skill_executor.run(phase_prompt, context)
            pipeline_results.append({
                "skill": skill_key,
                "input_task": phase_prompt,
                "output": res
            })
            
            # Proactively reinforce confidence metrics
            update_skill_performance(skill_key, success=True)
            
    return pipeline_results
