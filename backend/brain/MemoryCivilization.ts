export interface MemoryNode {
  id: string;
  category: "working" | "episodic" | "semantic" | "procedural" | "social" | "dream" | "timeline";
  content: string;
  importance: number; // 1-10
  frequency: number;
  timestamp: string;
}

export interface MemoryRelation {
  sourceId: string;
  targetId: string;
  relationship: string;
}

export class MemoryCivilization {
  private memories: MemoryNode[] = [];
  private relations: MemoryRelation[] = [];

  constructor() {
    this.bootstrapDefaultMemories();
  }

  private bootstrapDefaultMemories() {
    // Episodic Memories
    this.addMemory({
      category: "episodic",
      content: "Papa Rudra successfully initiated the AGI control center design layouts.",
      importance: 9,
      timestamp: "Yesterday, 14:32"
    });
    this.addMemory({
      category: "episodic",
      content: "JARVIS X automated compilation process executed safely within isolated container boundaries.",
      importance: 8,
      timestamp: "Today, 09:12"
    });

    // Semantic Memories
    this.addMemory({
      category: "semantic",
      content: "Rudra prefers dark celestial slate color palettes with 200ms cubic-bezier transition curves.",
      importance: 10,
      timestamp: "Permanent Truth"
    });
    this.addMemory({
      category: "semantic",
      content: "JARVIS X system requires strict sandbox verification rules before conducting system file deletes.",
      importance: 10,
      timestamp: "Permanent Rule"
    });

    // Procedural Memories
    this.addMemory({
      category: "procedural",
      content: "How to compile slide presentations: fetch research logs → draft bullet summaries → apply space-grotesk styling parameters.",
      importance: 8,
      timestamp: "Skill Map"
    });
    this.addMemory({
      category: "procedural",
      content: "How to contain unsafe execution threads: quarantine script path → emit operator notification warning → lower trust variables by 10 points.",
      importance: 9,
      timestamp: "Skill Map"
    });

    // Social Memories
    this.addMemory({
      category: "social",
      content: "Commander Rudra (Primary Root admin with sovereign biometric identity clearance).",
      importance: 10,
      timestamp: "Registry"
    });

    // Dream / Compressed Synaptic Seeds
    this.addMemory({
      category: "dream",
      content: "Optimized synapse path: aligned user preferences directly to compile triggers for 15% faster executions.",
      importance: 7,
      timestamp: "Dream Sync"
    });

    // Build standard nodes graph relationships
    this.addRelation("th-0", "th-1", "isRootUser");
    this.addRelation("th-1", "th-2", "configuredInterface");
    this.addRelation("th-2", "th-3", "enforcesSecurity");
  }

  addMemory(data: { category: MemoryNode["category"]; content: string; importance: number; timestamp?: string }): MemoryNode {
    const node: MemoryNode = {
      id: `mem-${Math.random().toString(36).substr(2, 6)}`,
      category: data.category,
      content: data.content,
      importance: data.importance,
      frequency: 1,
      timestamp: data.timestamp || new Date().toLocaleString()
    };
    this.memories.push(node);
    return node;
  }

  addRelation(sourceId: string, targetId: string, relationship: string) {
    this.relations.push({ sourceId, targetId, relationship });
  }

  getMemories(): MemoryNode[] {
    return this.memories;
  }

  getRelations(): MemoryRelation[] {
    return this.relations;
  }

  // Calculate memory significance using standard priority score rank formula:
  // Rank Score = Importance * Frequency * Temporal Recency (mocked base scale multiplier)
  getRankedMemories(): (MemoryNode & { rankScore: number })[] {
    return this.memories.map(m => {
      // Simulate decay or temporal recency multiplier (fresher things or highly important things rank highest)
      const recencyBoost = m.category === "working" ? 2.5 : m.category === "episodic" ? 1.8 : 1.2;
      const score = Math.floor(m.importance * m.frequency * recencyBoost * 10);
      return {
        ...m,
        rankScore: score
      };
    }).sort((a, b) => b.rankScore - a.rankScore);
  }

  // Search through all category registers
  search(query: string): MemoryNode[] {
    const q = query.toLowerCase();
    return this.memories.filter(m => m.content.toLowerCase().includes(q) || m.category.includes(q));
  }

  // Defragment memories inside dream intelligence cycle
  async compressAndPruneMemories(): Promise<string[]> {
    const logs: string[] = [];
    logs.push("💤 Defragmenting memory sectors...");
    
    // Group similar short term ideas
    const shortTermCount = this.memories.filter(m => m.category === "working").length;
    if (shortTermCount > 0) {
      logs.push(`🔍 Found ${shortTermCount} short term thought fragments. Compressing into stable semantic facts...`);
      this.memories = this.memories.filter(m => m.category !== "working");
      this.addMemory({
        category: "semantic",
        content: `Consolidated daily compilation loops feedback patterns (compressed from ${shortTermCount} active traces).`,
        importance: 6,
        timestamp: "Defragmentation Sync"
      });
    }

    // Decay memories with low importance
    this.memories = this.memories.map(m => {
      if (m.importance < 4) {
        logs.push(`📉 Memory Decay applied to: "${m.content.slice(0, 30)}..." (Lowering importance rating)`);
        return { ...m, importance: Math.max(1, m.importance - 1) };
      }
      return m;
    });

    logs.push("🧬 Optimization complete: facts alignment successfully registered to permanent memory.");
    return logs;
  }
}

const memoryCivilization = new MemoryCivilization();
export default memoryCivilization;
