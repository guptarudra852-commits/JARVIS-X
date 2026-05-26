class Skill:
    def run(self, task, context=None):
        pass

class EmailSkill(Skill):
    def run(self, task, context=None):
        print(f"[Email Skill] Parsing messaging layout instructions: '{task}'")
        plan = [
            "open_composition_channel",
            "write_recipient_headers",
            "prepare_draft_content",
            "await_human_approval_level_3"
        ]
        
        execution_log = []
        for step in plan:
            print(f"[Email Skill - Substep] Communication agent step: {step}")
            execution_log.append(f"{step}: draft_safeguard_staged")
            
        return {
            "skill": "email",
            "parsed_instruction": task,
            "steps_enacted": plan,
            "permission_required": "Level_3_User_Confirm",
            "status": "staged_draft_ok"
        }
