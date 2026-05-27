export interface ActionMemoryRow {
  id: string;
  task: string;
  steps: string[];
  success: boolean;
  timestamp: string;
}

export class WorkflowMemory {
  private actions: ActionMemoryRow[] = [
    {
      id: "mem-act-1",
      task: "Open Chrome, search AI news, summarize results",
      steps: ["Launch browser context", "Navigate to google.com", "Simulate typing 'AI News'", "Read search result summaries", "Generate semantic response text"],
      success: true,
      timestamp: "10:11:00"
    },
    {
      id: "mem-act-2",
      task: "Create a presentation outline",
      steps: ["Query memory archives for presentation topics", "Format custom slides outlines in outline.txt", "Verify file state output and serialize"],
      success: true,
      timestamp: "10:04:12"
    }
  ];

  getActions(): ActionMemoryRow[] {
    return this.actions;
  }

  recordAction(task: string, steps: string[], success: boolean): ActionMemoryRow {
    const newAction: ActionMemoryRow = {
      id: `mem-act-${Date.now()}`,
      task,
      steps,
      success,
      timestamp: new Date().toTimeString().split(" ")[0]
    };
    this.actions.unshift(newAction);
    return newAction;
  }
}
