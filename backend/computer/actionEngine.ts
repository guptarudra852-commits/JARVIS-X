import { DesktopAgent, DesktopTask } from "./desktopAgent";
import { PermissionEngine } from "./permissionEngine";
import { RiskEngine } from "./riskEngine";
import { ScreenAnalyzer } from "./screenAnalyzer";
import { WorkflowMemory } from "./workflowMemory";

export class ActionEngine {
  public desktopAgent = new DesktopAgent();
  public permissionEngine = new PermissionEngine();
  public riskEngine = new RiskEngine();
  public screenAnalyzer = new ScreenAnalyzer();
  public workflowMemory = new WorkflowMemory();

  private isSandboxMode: boolean = true;
  private sessionTrustScore: number = 95;

  getEngineState() {
    return {
      sandboxMode: this.isSandboxMode,
      trustScore: this.sessionTrustScore,
      permissions: this.permissionEngine.getPermissions()
    };
  }

  setSandboxMode(active: boolean) {
    this.isSandboxMode = active;
  }

  adjustTrustScore(amount: number) {
    this.sessionTrustScore = Math.max(0, Math.min(100, this.sessionTrustScore + amount));
  }

  async runGoalPlan(goal: string): Promise<{
    id: string;
    goal: string;
    tasks: { id: string; name: string; status: "pending" | "executing" | "done" | "denied"; riskScore: number; steps: string[] }[];
    totalRisk: number;
    requiresManualApproval: boolean;
  }> {
    const riskCheck = this.riskEngine.calculateRiskScore(goal);
    
    // Breaking goal into step-by-step subtasks (Planner Agent logic)
    const tasks: any[] = [];
    const goalLower = goal.toLowerCase();

    if (goalLower.includes("chrome") || goalLower.includes("search") || goalLower.includes("browse") || goalLower.includes("index")) {
      tasks.push({
        id: "task-p1",
        name: "Open Chrome Sandbox Browser",
        status: "pending",
        riskScore: 20,
        action: "open_app",
        app: "Chrome"
      });
      tasks.push({
        id: "task-p2",
        name: `Query web index for: '${goal}'`,
        status: "pending",
        riskScore: 35,
        action: "search_web",
        query: goal.replace(/open chrome/gi, "").replace(/search/gi, "").trim() || "AI News"
      });
      tasks.push({
        id: "task-p3",
        name: "Analyze webpage OCR & button positioning",
        status: "pending",
        riskScore: 15,
        action: "click_coordinates",
        coordinates: { x: 300, y: 240 }
      });
    } else if (goalLower.includes("delete") || goalLower.includes("truncate") || goalLower.includes("remove")) {
      tasks.push({
        id: "task-d1",
        name: "Scan active database or system files",
        status: "pending",
        riskScore: 40,
        action: "open_app",
        app: "FileSystem Manager"
      });
      tasks.push({
        id: "task-d2",
        name: `Wipe index nodes for request: '${goal}'`,
        status: "pending",
        riskScore: riskCheck.score,
        action: "write_text",
        text: "DELETE FROM memories WHERE id = 'target'"
      });
    } else {
      tasks.push({
        id: "task-g1",
        name: "Retrieve system context maps",
        status: "pending",
        riskScore: 10,
        action: "open_app",
        app: "Console Logger"
      });
      tasks.push({
        id: "task-g2",
        name: `Draft content output outline`,
        status: "pending",
        riskScore: 30,
        action: "write_text",
        text: `Results of: ${goal}`
      });
    }

    return {
      id: `plan-${Date.now()}`,
      goal,
      tasks: tasks.map(t => ({
        ...t,
        steps: []
      })),
      totalRisk: riskCheck.score,
      requiresManualApproval: riskCheck.requiresUserApproval
    };
  }
}
