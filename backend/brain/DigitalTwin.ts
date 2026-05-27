export interface DigitalTwinState {
  activeApps: string[];
  focus: string;
  energy: "low" | "medium" | "high" | "peak";
  userState: "Deep Work" | "Collaborating" | "Browsing" | "Idle";
  productivityScore: number;
  habits: string[];
  lastScanTimestamp: string;
  hardwareTwin: {
    cpuLoad: number;
    ramUsageGB: number;
    sandboxIntegrity: number;
  };
}

export class DigitalTwin {
  private state: DigitalTwinState = {
    activeApps: ["VS Code", "Spotify", "Terminal"],
    focus: "Coding JARVIS X memory core",
    energy: "peak",
    userState: "Deep Work",
    productivityScore: 94,
    habits: [
      "Likes cyber-slate themes with 200ms animation curves",
      "Maintains active sandbox security isolation",
      "Plays ambient synth loops when editing complex compilers",
      "Performs proactive research searches every 5 minutes"
    ],
    lastScanTimestamp: new Date().toISOString(),
    hardwareTwin: {
      cpuLoad: 24,
      ramUsageGB: 6.2,
      sandboxIntegrity: 100
    }
  };

  getState(): DigitalTwinState {
    this.state.lastScanTimestamp = new Date().toISOString();
    return this.state;
  }

  updateTwinState(updates: Partial<DigitalTwinState>) {
    this.state = {
      ...this.state,
      ...updates,
      lastScanTimestamp: new Date().toISOString()
    };
  }

  // Auto-simulate shifts in focus based on environment
  simulateActiveShift(activeWindow: string, userBusy: boolean) {
    const apps = Array.from(new Set([...this.state.activeApps, activeWindow])).slice(-4);
    
    let focus = this.state.focus;
    let userState: "Deep Work" | "Collaborating" | "Browsing" | "Idle" = "Deep Work";
    let energy: "low" | "medium" | "high" | "peak" = "high";

    if (activeWindow === "VS Code" || activeWindow === "Terminal") {
      focus = "Analyzing compilation pipelines & refactoring agent codebases";
      userState = "Deep Work";
      energy = "peak";
    } else if (activeWindow === "Chrome") {
      focus = "Evaluating academic publications & searching recent AI trends";
      userState = "Browsing";
      energy = "medium";
    } else if (activeWindow === "Spotify") {
      focus = "Calibrating auditory neural background loops";
      userState = "Idle";
      energy = "low";
    } else {
      focus = `Observing system process handle [${activeWindow}]`;
      userState = userBusy ? "Collaborating" : "Idle";
    }

    const cpuLoad = Math.floor(Math.random() * 20) + (activeWindow === "Terminal" ? 30 : 15);
    const ramUsageGB = Number((5.8 + Math.random() * 1.5).toFixed(1));

    this.updateTwinState({
      activeApps: apps,
      focus,
      userState,
      energy,
      hardwareTwin: {
        cpuLoad,
        ramUsageGB,
        sandboxIntegrity: this.state.hardwareTwin.sandboxIntegrity
      }
    });
  }
}

const digitalTwin = new DigitalTwin();
export default digitalTwin;
