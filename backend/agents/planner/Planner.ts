export interface GoalPlan {
  steps: string[];
}

export class Planner {
  static async create(goal: string): Promise<GoalPlan> {
    const goalLower = goal.toLowerCase();
    
    if (goalLower.includes("chrome") || goalLower.includes("search") || goalLower.includes("google") || goalLower.includes("browse")) {
      return {
        steps: [
          "Launch Browser Node (BrowserAgent)",
          "Initiate Deep Google Search Index (ResearchAgent)",
          "Scan search results structure (VisionAgent)",
          "Extract facts and generate concise page summary (ReflectionAgent)"
        ]
      };
    }

    if (goalLower.includes("ppt") || goalLower.includes("presentation") || goalLower.includes("slides")) {
      return {
        steps: [
          "Assemble visual templates & images list (ResearchAgent)",
          "Structure topic chapters and slides layout guidelines (Planner Agent)",
          "Render PPT outline text file to desktop Workspace (DesktopAgent)",
          "Validate formatting rules (ReflectionAgent)"
        ]
      };
    }

    if (goalLower.includes("delete") || goalLower.includes("wipe") || goalLower.includes("destroy") || goalLower.includes("rm -rf")) {
      return {
        steps: [
          "Validate folder system boundaries (DesktopAgent)",
          "Enforce Sandbox quarantine rules & trigger warning (Safety Agent/Guardian)",
          "Log incident to actions ledger (MemoryAgent)"
        ]
      };
    }

    // Default general steps
    return {
      steps: [
        "Index contextual facts from memories database (MemoryAgent)",
        "Construct solution draft outline (CodingAgent)",
        "Reflect on safety parameters (ReflectionAgent)",
        "Export output to console logs terminal (DesktopAgent)"
      ]
    };
  }
}
