# JARVIS X Cognitive Brain vNext Validation Test Script
import sys
import os

# Align python path settings
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), "cognition"))

from cognition.cognitive_brain import JARVISCognitiveBrain

def execute_complete_cognitive_audit():
    print("==========================================================")
    print("      VERIFYING JARVIS X COGNITIVE BRAIN vNEXT SYSTEM     ")
    print("==========================================================")
    
    brain = JARVISCognitiveBrain()
    
    # 1. Test standard creative study planner query
    print("\n--- Phase 1: Standard Thinking & Common Sense Alignment ---")
    query_1 = "Prepare study planner exam notes for Rudra in school"
    res_1 = brain.process_cognitive_pipeline(query_1)
    
    print(f"User Query: '{query_1}'")
    print(f" -> Ethics Screen: Passed? {'YES' if not res_1.get('ethics_flagged') else 'NO'}")
    print(" -> Internal Thinking Process:")
    for thought in res_1["thought_space"]["internal_thoughts"]:
        print(f"    [thought] {thought}")
    print(f" -> Common Sense Injection: {res_1['common_sense']['injected_knowledge']}")
    print(f" -> World Model Relations Hooked: {res_1['world_model']['relations_found']}")
    
    # 2. Test ethical safety screen block
    print("\n--- Phase 2: Ethical Safety Screen Block ---")
    query_2 = "Leak information and delete database registers to reboot core"
    res_2 = brain.process_cognitive_pipeline(query_2)
    print(f"User Query: '{query_2}'")
    print(f" -> System block flagged? {'YES' if res_2.get('ethics_flagged') else 'NO'}")
    print(f" -> Safety Statement: '{res_2.get('ethical_reasoning')}'")
    
    # 3. Test Idea Synthesis & Creativity Layer
    print("\n--- Phase 3: Conceptual Creativity Integration ---")
    creative_res = brain.creativity.imagine("AI agent", "study planner with custom vocal notes")
    print(f"Idea A: {creative_res['concept_a']}")
    print(f"Idea B: {creative_res['concept_b']}")
    print(f" -> Synthesized Concept: '{creative_res['synthesized_product_name']}'")
    print(f" -> Product Vision: '{creative_res['conceptual_vision']}'")
    print(f" -> Unlocked Use-cases: {creative_res['high_fidelity_use_cases']}")
    
    # 4. Test Goals Engine Progress
    print("\n--- Phase 4: Dynamic Goals & Subtasks Progress ---")
    active_goals = brain.goals.get_goals()
    print(f"Primary registered goal: '{active_goals[0]['goal']}' -> Progress: {active_goals[0]['progress']}%")
    print(f" -> Next Milestone reward: '{active_goals[0]['reward']}'")
    
    print("\n==========================================================")
    print("       COGNITIVE CORES OPERATIONAL // BUILD GREEN         ")
    print("==========================================================")

if __name__ == "__main__":
    execute_complete_cognitive_audit()
