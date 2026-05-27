export interface SkillGenome {
  id: string;
  task: string;
  workflow: string[];
  confidence: number; // 0.0 to 1.0 (confidence rating)
  successRate: number; // percentage
  attempts: number;
  averageSpeedSec: number;
  status: "mutating" | "stable" | "evolved";
}

export class SkillEngine {
  private skills: SkillGenome[] = [];

  constructor() {
    this.bootstrapDefaultSkills();
  }

  private bootstrapDefaultSkills() {
    this.skills = [
      {
        id: "sk-canva",
        task: "Compile presentation layout & render slides templates",
        workflow: ["Analyze topic", "Collect layout dimensions", "Inject title typography", "Format text grids", "Export static PDF"],
        confidence: 0.72,
        successRate: 85,
        attempts: 1,
        averageSpeedSec: 14.5,
        status: "stable"
      },
      {
        id: "sk-scrape",
        task: "Scrape and synthesize academic research pages",
        workflow: ["Launch headless browser", "Navigate search indices", "Filter irrelevant PDF links", "Parse HTML text content", "Synthesize findings"],
        confidence: 0.88,
        successRate: 92,
        attempts: 4,
        averageSpeedSec: 8.2,
        status: "stable"
      },
      {
        id: "sk-quarantine",
        task: "Verify safe sandboxing quarantine logic",
        workflow: ["Pre-scan parameters risks", "Review against 4 security laws", "Verify biometric handshake", "Dispatch execution thread"],
        confidence: 0.95,
        successRate: 98,
        attempts: 9,
        averageSpeedSec: 2.1,
        status: "stable"
      }
    ];
  }

  getSkills(): SkillGenome[] {
    return this.skills;
  }

  // Evolve a skill using genomic mutation of workflow steps!
  evolveSkill(id: string): SkillGenome | null {
    const skIdx = this.skills.findIndex(s => s.id === id);
    if (skIdx === -1) return null;

    const skill = this.skills[skIdx];
    
    // Simulate genomic mutation of the workflow steps!
    // E.g., we insert an optimization step or swap steps to speed it up!
    let updatedWorkflow = [...skill.workflow];
    if (skill.workflow.length > 0) {
      if (!updatedWorkflow.includes("Optimizely caching filters")) {
        // Mutate by inserting an intelligent preprocessing optimizer step
        updatedWorkflow.splice(1, 0, "Apply pre-cached semantic filters");
      }
    }

    const nextSuccessRate = Math.min(99, skill.successRate + Math.floor(Math.random() * 5) + 1);
    const nextConfidence = Math.min(0.99, Number((skill.confidence + 0.04).toFixed(2)));
    const nextSpeed = Math.max(1.0, Number((skill.averageSpeedSec * 0.85).toFixed(1))); // 15% execution speedup due to evolution!

    const evolved: SkillGenome = {
      ...skill,
      workflow: updatedWorkflow,
      confidence: nextConfidence,
      successRate: nextSuccessRate,
      attempts: skill.attempts + 1,
      averageSpeedSec: nextSpeed,
      status: "evolved"
    };

    this.skills[skIdx] = evolved;
    return evolved;
  }

  // Register attempt results to mutate properties organically
  recordAttempt(id: string, success: boolean): SkillGenome | null {
    const skIdx = this.skills.findIndex(s => s.id === id);
    if (skIdx === -1) return null;

    const skill = this.skills[skIdx];
    const nextAttempts = skill.attempts + 1;
    
    // Formula for organic success rate update over attempts
    const factor = success ? 1 : 0;
    const nextSuccessRate = Math.round((skill.successRate * skill.attempts + (factor * 100)) / nextAttempts);
    
    // Speed becomes progressively more optimized as steps stabilize
    const nextSpeed = success 
      ? Math.max(1.0, Number((skill.averageSpeedSec * 0.95).toFixed(1))) 
      : skill.averageSpeedSec;

    const updated: SkillGenome = {
      ...skill,
      attempts: nextAttempts,
      successRate: Math.min(100, nextSuccessRate),
      averageSpeedSec: nextSpeed,
      confidence: success ? Math.min(0.99, skill.confidence + 0.02) : Math.max(0.1, skill.confidence - 0.05),
      status: "stable"
    };

    this.skills[skIdx] = updated;
    return updated;
  }
}

const skillEngine = new SkillEngine();
export default skillEngine;
