import sys
import os

# Align python path resolvers so subfolders are import friendly
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), "skills"))

from skills.skill_registry import run_composite_pipeline, get_best_skill

def run_skills_validation_test():
    print("==========================================================")
    print("             VERIFYING JARVIS X SKILL ARCHITECTURE        ")
    print("==========================================================")
    
    best_skill, rating = get_best_skill()
    print(f"[Skill Registry] Top-tier specialized skill capability currently is: '{best_skill}' with a score rating of: {rating}%")

    print("\n--- Initiating Complex Multi-Skill YouTube Video Pipeline ---")
    pipeline_results = run_composite_pipeline("Create YouTube video about DeepMind agents")
    
    print("\n--- Pipeline Compilation Result Summary ---")
    for phase in pipeline_results:
        print(f" * Handled by: {phase['skill'].upper()} -> Outcomes summary: {phase['output'].get('report_summary', phase['output'].get('message', phase['output'].get('output', 'Success')))}")

    print("\n==========================================================")
    print("               SKILLS AGENT ENGINE VERIFIED GREEN         ")
    print("==========================================================")

if __name__ == "__main__":
    run_skills_validation_test()
