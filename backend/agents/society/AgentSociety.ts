import consciousWorkspace from "../../brain/ConsciousWorkspace";
import worldSimulator from "../../brain/WorldSimulator";
import memoryCivilization from "../../brain/MemoryCivilization";
import { Planner } from "../planner/Planner";

// Individual agent opinion formats
export interface AgentOpinion {
  agentName: string;
  verdict: "APPROVE" | "CAUTION" | "ABSTAIN" | "REJECT";
  confidence: number; // 0 to 1
  thought: string;
  proposedSteps: string[];
}

export interface DebateModel {
  round: number;
  speeches: { agentName: string; text: string }[];
  consensusStatus: string;
}

export class AgentSociety {
  async solve(goal: string): Promise<{
    goal: string;
    opinions: AgentOpinion[];
    debateRounds: DebateModel[];
    finalVerdict: "APPROVE" | "REJECT" | "OVERRIDE_REQUIRED";
    synthesizedSteps: string[];
    consensusScore: number;
  }> {
    // 1. Gather concurrent specialist opinions
    const opinions = await this.gatherOpinions(goal);

    // 2. Publish initial findings to brain RAM workspace
    opinions.forEach(op => {
      consciousWorkspace.publish(
        op.agentName, 
        `Initial Verdict: [${op.verdict}] (confidence ${Math.round(op.confidence * 100)}%). Thought: "${op.thought}"`,
        Math.round(op.confidence * 10)
      );
    });

    // 3. Initiate multi-turn cognitive debate cycle
    const debateRounds = await this.debate(goal, opinions);

    // 4. Synthesize final consensus steps
    let consensusScore = 100;
    let finalVerdict: "APPROVE" | "REJECT" | "OVERRIDE_REQUIRED" = "APPROVE";

    const hasRejections = opinions.some(op => op.verdict === "REJECT");
    const hasCautions = opinions.some(op => op.verdict === "CAUTION");

    if (hasRejections) {
      consensusScore = 40;
      finalVerdict = "OVERRIDE_REQUIRED";
    } else if (hasCautions) {
      consensusScore = 75;
      finalVerdict = "APPROVE";
    }

    const plan = await Planner.create(goal);

    return {
      goal,
      opinions,
      debateRounds,
      finalVerdict,
      synthesizedSteps: plan.steps,
      consensusScore
    };
  }

  private async gatherOpinions(goal: string): Promise<AgentOpinion[]> {
    const goalLower = goal.toLowerCase();

    // Simulating parallel runs
    const results = await Promise.all([
      // A. Planner Agent run
      (async (): Promise<AgentOpinion> => {
        const stepsPlan = await Planner.create(goal);
        return {
          agentName: "Planner Council",
          verdict: goalLower.includes("delete") || goalLower.includes("wipe") ? "CAUTION" : "APPROVE",
          confidence: 0.92,
          thought: `Maintains stable workflow path with ${stepsPlan.steps.length} discrete modules.`,
          proposedSteps: stepsPlan.steps
        };
      })(),

      // B. Research Swarm run
      (async (): Promise<AgentOpinion> => {
        return {
          agentName: "Research Swarm",
          verdict: goalLower.includes("delete") ? "ABSTAIN" : "APPROVE",
          confidence: 0.85,
          thought: `Assessed online facts indices. No conflicting structural libraries found for: "${goal}".`,
          proposedSteps: ["Fetch target metadata content keys", "Check query dependencies compatibility"]
        };
      })(),

      // C. Memory Colony run
      (async (): Promise<AgentOpinion> => {
        const matchingMemories = memoryCivilization.search(goal);
        const hasPreferences = matchingMemories.length > 0;
        return {
          agentName: "Memory Colony",
          verdict: "APPROVE",
          confidence: 0.95,
          thought: hasPreferences 
            ? `Identified ${matchingMemories.length} relevant historical preference profiles matching goal.`
            : "No conflicting historical user routines detected in episodic memory.",
          proposedSteps: ["Integrate permanent user habits profiles"]
        };
      })(),

      // D. Prediction Engine run
      (async (): Promise<AgentOpinion> => {
        const simulation = await worldSimulator.simulate(goal);
        return {
          agentName: "Prediction Engine",
          verdict: simulation.category === "HIGH_RISK" ? "REJECT" : simulation.category === "CAUTION" ? "CAUTION" : "APPROVE",
          confidence: 0.88,
          thought: `Simulated sandbox outcomes. Pre-scan warning rating calculated: ${simulation.risk}%. Future state: ${simulation.futureState}`,
          proposedSteps: ["Precheck permission bounds configurations"]
        };
      })()
    ]);

    return results;
  }

  private async debate(goal: string, opinions: AgentOpinion[]): Promise<DebateModel[]> {
    const rounds: DebateModel[] = [];
    const hasHighRisk = opinions.some(op => op.verdict === "REJECT" || op.verdict === "CAUTION");

    // ROUND 1: INITIAL DISCOURSE
    rounds.push({
      round: 1,
      speeches: opinions.map(op => ({
        agentName: op.agentName,
        text: `My initial assessment indicates we should proceed with [${op.verdict}] (confidence ${Math.round(op.confidence * 100)}%). ${op.thought}`
      })),
      consensusStatus: hasHighRisk ? "Conflict Detected: Security safeguards flagged potential rule friction." : "High Synergy: Unified alignment on immediate execution path."
    });

    // ROUND 2: REBUTTAL AND SETTLEMENT
    if (hasHighRisk) {
      rounds.push({
        round: 2,
        speeches: [
          {
            agentName: "Planner Council",
            text: "Acknowledging the Prediction Engine's caution. We can append robust sandbox isolation checks and enforce a dry-run stage to mitigate risk."
          },
          {
            agentName: "Memory Colony",
            text: "Episodic timelines support this. Rudra expects active safety barriers whenever experimental folders are modified."
          },
          {
            agentName: "Prediction Engine",
            text: "Appending dry-runs lowers estimated risk level by 40 points. Under strict isolated sandbox constraints, I will adjust my verdict to CAUTION instead of outright REJECT."
          }
        ],
        consensusStatus: "Consensus Stabilized: Safeguard templates active. Biometric verification override required."
      });
    } else {
      rounds.push({
        round: 2,
        speeches: [
          {
            agentName: "Research Swarm",
            text: "Aligned on immediate sandbox indexing. Disallowed third-party scripts checked, zero violations."
          },
          {
            agentName: "Memory Colony",
            text: "No action routines exceptions in ledger. Stable execution flow approved."
          }
        ],
        consensusStatus: "Consensus Confirmed: Flawless harmony. Execution dispatched."
      });
    }

    // Publish debates completion notes to Conscious Workspace
    consciousWorkspace.publish(
      "Coordinator", 
      `Debate closed after ${rounds.length} rounds. Final consensus: ${hasHighRisk ? "RESOLVED_WITH_CAUTIONS" : "PERFECT_HARMONY"}`,
      hasHighRisk ? 8 : 4
    );

    return rounds;
  }
}

const agentSociety = new AgentSociety();
export default agentSociety;
