import eventBus from "../core/EventBus";

export interface Thought {
  id: string;
  agent: string;
  thought: string;
  timestamp: string;
  importance: number; // 1-10 priority scale
}

export class ConsciousWorkspace {
  private thoughts: Thought[] = [];
  private maxThoughts = 100;

  constructor() {
    // Populate some default brain RAM thoughts to show active consciousness initial state
    this.publish("system", "Initializing JARVIS X Conscious Workspace memory structures.", 5);
    this.publish("WorldSimulator", "Active sandbox security configurations scanned. Neutral stability predicted.", 8);
    this.publish("MemoryAgent", "Semantic facts indexes synced successfully with longTerm registers.", 4);
  }

  publish(agent: string, thought: string, importance: number = 5): Thought {
    const newThought: Thought = {
      id: `th-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      agent,
      thought,
      timestamp: new Date().toLocaleTimeString(),
      importance
    };

    this.thoughts.unshift(newThought);
    if (this.thoughts.length > this.maxThoughts) {
      this.thoughts.pop(); // Evict old thoughts to prevent leaks
    }

    // Publish to the event bus for reactive agents
    eventBus.publish("conscious_thought", newThought);
    eventBus.publish(`thought:${agent}`, newThought);

    return newThought;
  }

  getThoughts(): Thought[] {
    return this.thoughts;
  }

  clear() {
    this.thoughts = [];
    this.publish("system", "Conscious workspace brain RAM wiped.", 8);
  }
}

// Single persistent workspace instance
const consciousWorkspace = new ConsciousWorkspace();
export default consciousWorkspace;
