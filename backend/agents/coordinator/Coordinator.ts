import { Planner } from "../planner/Planner";
import { DesktopAgent } from "../desktop/DesktopAgent";
import { BrowserAgent } from "../browser/BrowserAgent";
import { MemoryAgent } from "../memory/MemoryAgent";
import { CodingAgent } from "../coding/CodingAgent";
import { ResearchAgent } from "../research/ResearchAgent";
import { ReflectionAgent } from "../reflection/ReflectionAgent";
import { VisionAgent } from "../vision/VisionAgent";
import { VoiceAgent } from "../voice/VoiceAgent";
import { WorkflowAgent } from "../workflow/WorkflowAgent";

export class Coordinator {
  private planner = new Planner();
  private desktopAgent = new DesktopAgent();
  private browserAgent = new BrowserAgent();
  private memoryAgent = new MemoryAgent();
  private codingAgent = new CodingAgent();
  private researchAgent = new ResearchAgent();
  private reflectionAgent = new ReflectionAgent();
  private visionAgent = new VisionAgent();
  private voiceAgent = new VoiceAgent();
  private workflowAgent = new WorkflowAgent();

  async solve(goal: string): Promise<{
    goal: string;
    steps: string[];
    agentOutputs: { agentName: string; logs: string[] }[];
    isValidated: boolean;
  }> {
    const plan = await Planner.create(goal);
    const agentOutputs: { agentName: string; logs: string[] }[] = [];

    // Trigger agents depending on the goal intent
    const goalLower = goal.toLowerCase();
    
    // Always call MemoryAgent and ReflectionAgent
    const memoryLogs = await this.memoryAgent.run(plan.steps);
    agentOutputs.push({ agentName: "Memory Agent", logs: memoryLogs });

    if (goalLower.includes("chrome") || goalLower.includes("search") || goalLower.includes("browse") || goalLower.includes("web")) {
      const browserLogs = await this.browserAgent.run(plan.steps);
      agentOutputs.push({ agentName: "Browser Agent", logs: browserLogs });
      
      const researchLogs = await this.researchAgent.run(plan.steps);
      agentOutputs.push({ agentName: "Research Agent", logs: researchLogs });

      const visionLogs = await this.visionAgent.run(plan.steps);
      agentOutputs.push({ agentName: "Vision Agent", logs: visionLogs });
    } else if (goalLower.includes("ppt") || goalLower.includes("presentation") || goalLower.includes("slides") || goalLower.includes("thumbnail")) {
      const desktopLogs = await this.desktopAgent.run(plan.steps);
      agentOutputs.push({ agentName: "Desktop Agent", logs: desktopLogs });

      const workflowLogs = await this.workflowAgent.run(plan.steps);
      agentOutputs.push({ agentName: "Workflow Agent", logs: workflowLogs });
    } else {
      const codingLogs = await this.codingAgent.run(plan.steps);
      agentOutputs.push({ agentName: "Coding Agent", logs: codingLogs });

      const desktopLogs = await this.desktopAgent.run(plan.steps);
      agentOutputs.push({ agentName: "Desktop Agent", logs: desktopLogs });
    }

    const reflectionLogs = await this.reflectionAgent.run(plan.steps);
    agentOutputs.push({ agentName: "Reflection Agent", logs: reflectionLogs });

    return {
      goal,
      steps: plan.steps,
      agentOutputs,
      isValidated: true
    };
  }
}
