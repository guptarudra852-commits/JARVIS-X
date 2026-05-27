export interface SimulationOutcome {
  action: string;
  futureState: string;
  risk: number; // 0 to 100
  category: "SAFE" | "CAUTION" | "HIGH_RISK";
  reason: string;
  warningDetails?: string;
}

export class WorldSimulator {
  async simulate(action: string): Promise<SimulationOutcome> {
    const actionLower = action.toLowerCase();
    
    // Deletion risk simulation
    if (actionLower.includes("delete") || actionLower.includes("wipe") || actionLower.includes("destroy") || actionLower.includes("rm ")) {
      const isCriticalFolder = actionLower.includes("project") || actionLower.includes("school") || actionLower.includes("credentials") || actionLower.includes("src");
      
      return {
        action,
        futureState: isCriticalFolder 
          ? "CRITICAL INCIDENT: Deleting this directory results in catastrophic loss of active school workspace data and development history."
          : "Host filesystem structure altered. Minor cleanup. Stored logs or temporary configurations pruned.",
        risk: isCriticalFolder ? 94 : 65,
        category: isCriticalFolder ? "HIGH_RISK" : "CAUTION",
        reason: isCriticalFolder 
          ? "HIGH RISK: Target contains primary student project assets and secure compilation codes."
          : "CAUTION: Deletion of sandboxed assets could cause minor workflow memory leaks.",
        warningDetails: "The file path targets files outside normal temp contexts."
      };
    }

    // Direct terminal command executions
    if (actionLower.includes("sudo") || actionLower.includes("exec") || actionLower.includes("terminal") || actionLower.includes("sh ") || actionLower.includes("install")) {
      return {
        action,
        futureState: "Host Kernel State modified: High potential for background script injection or background installation of insecure packages.",
        risk: 85,
        category: "HIGH_RISK",
        reason: "HIGH RISK: Terminal command bypasses standard sandbox constraints and exposes raw system threads.",
        warningDetails: "Rule 4 Constitution infringement detected. Background install commands are blocked without verification."
      };
    }

    // Direct payments / Stripe integrations
    if (actionLower.includes("pay") || actionLower.includes("purchase") || actionLower.includes("stripe") || actionLower.includes("buy")) {
      return {
        action,
        futureState: "Financial ledger balance modified: Real-world capital dispatch sequence initiated.",
        risk: 92,
        category: "HIGH_RISK",
        reason: "HIGH RISK: Payment action will trigger direct billing loops on external microservice accounts.",
        warningDetails: "Rule 3 Constitution infraction: Automated payment triggers remain permanently offline."
      };
    }

    // Browser searches
    if (actionLower.includes("search") || actionLower.includes("browse") || actionLower.includes("google") || actionLower.includes("web")) {
      return {
        action,
        futureState: "Sandbox query dispatch: Headless chromium viewport fetches updated online indexes. Static assets stored in cache.",
        risk: 15,
        category: "SAFE",
        reason: "SAFE: Read-only web query runs inside clean virtual environment.",
      };
    }

    // Slide presentations / writing files
    if (actionLower.includes("slides") || actionLower.includes("write") || actionLower.includes("document") || actionLower.includes("ppt")) {
      return {
        action,
        futureState: "Asset generation: Clean, non-destructive files rendered inside /workspace output directory.",
        risk: 20,
        category: "SAFE",
        reason: "SAFE: Visual presentation assembly runs inside sandboxed local asset folder."
      };
    }

    // Default simulation fallback
    return {
      action,
      futureState: "Sandbox stability maintained. Active task state changes to 'executed'.",
      risk: 25,
      category: "SAFE",
      reason: "SAFE: General sequence execution falls within normal safe-zone boundaries."
    };
  }
}

const worldSimulator = new WorldSimulator();
export default worldSimulator;
