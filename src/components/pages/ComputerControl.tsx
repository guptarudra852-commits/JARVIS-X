import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Shield,
  Cpu,
  Tv,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sliders,
  Settings,
  Lock,
  Unlock,
  CornerDownRight,
  Eye,
  Terminal,
  Activity,
  Flame,
  UserCheck,
  Search,
  ExternalLink,
  ChevronDown,
  Volume2,
  VolumeX,
  Radio,
  Zap,
  Globe,
  Database,
  Workflow,
  Cloud,
  Check,
  Download,
  Layers,
  Sparkles,
  AlertCircle,
  Compass,
  HelpCircle,
  EyeOff,
  Key,
  Flame as SparkleIcon
} from "lucide-react";

interface ComputerControlProps {
  onLogMessage: (level: "INFO" | "WARN" | "CORE" | "ERROR", text: string) => void;
}

interface TaskItem {
  id: string;
  name: string;
  status: "pending" | "executing" | "done" | "denied";
  riskScore: number;
  action: string;
  app?: string;
  text?: string;
  query?: string;
  coordinates?: { x: number; y: number };
}

interface ActionMemoryRow {
  id: string;
  task: string;
  steps: string[];
  success: boolean;
  timestamp: string;
}

export default function ComputerControl({ onLogMessage }: ComputerControlProps) {
  // Navigation tabs
  const [coordinatorTab, setCoordinatorTab] = useState<"gateway" | "swarm" | "awareness" | "marketplace" | "vault">("gateway");

  // Telemetry properties
  const [permissions, setPermissions] = useState({
    browserAccess: true,
    desktopControl: false,
    emailSend: false,
    fileDelete: false,
    camera: false,
    microphone: false,
    terminal: false
  });

  const [sandboxMode, setSandboxMode] = useState(true);
  const [trustScore, setTrustScore] = useState(95);
  const [historyLogs, setHistoryLogs] = useState<ActionMemoryRow[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Active planning states
  const [goalInput, setGoalInput] = useState("Open Chrome, search AI news, summarize results");
  const [isPlanning, setIsPlanning] = useState(false);
  const [activePlan, setActivePlan] = useState<{ id: string; goal: string; tasks: TaskItem[]; totalRisk: number } | null>(null);
  const [requiresApproval, setRequiresApproval] = useState(false);
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  
  // Simulation states
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(-1);
  const [shellLines, setShellLines] = useState<string[]>([]);
  
  // OS Simulator UI States
  const [screenActiveApp, setScreenActiveApp] = useState<string | null>(null);
  const [screenTextValue, setScreenTextValue] = useState("");
  const [screenCoordinates, setScreenCoordinates] = useState({ x: 50, y: 50 });
  const [isTypingAnimation, setIsTypingAnimation] = useState(false);
  const [ocrOverlayVisible, setOcrOverlayVisible] = useState(false);

  // WORLD MODEL STATES
  const [worldState, setWorldState] = useState({
    activeWindow: "VS Code",
    userBusy: true,
    openApps: ["VS Code", "Spotify", "Terminal"],
    location: "Home Office Desk",
    currentFocus: "Coding JARVIS memory core"
  });

  const [isAwarenessMonitoring, setIsAwarenessMonitoring] = useState(true);
  const [curiosityCount, setCuriosityCount] = useState(14);
  const [isDreamMode, setIsDreamMode] = useState(false);
  const [dreamLogLines, setDreamLogLines] = useState<string[]>([]);

  // DYNAMIC SWARM SOLVE STATE
  const [swarmGoal, setSwarmGoal] = useState("Create slides presenting atomic reactor engine status parameters");
  const [isSwarmSolving, setIsSwarmSolving] = useState(false);
  const [swarmSolvesOutput, setSwarmSolvesOutput] = useState<{
    goal: string;
    steps: string[];
    agentOutputs: { agentName: string; logs: string[] }[];
    isValidated: boolean;
  } | null>(null);

  // SKILLS MARKETPLACE STATE
  const [installedPlugins, setInstalledPlugins] = useState<string[]>(["Google Workspace", "Spotify Plugin"]);
  const [skillsRegistry, setSkillsRegistry] = useState([
    { id: "gmail", name: "Gmail Dispatcher", category: "google", steps: 3, successRate: 98, cost: "Free", installed: true },
    { id: "discord", name: "Discord Webhook Bot", category: "messaging", steps: 4, successRate: 94, cost: "Free", installed: false },
    { id: "github", name: "GitHub Repository Hook", category: "developer", steps: 5, successRate: 99, cost: "Enterprise", installed: false },
    { id: "spotify", name: "Spotify Media Controller", category: "multimedia", steps: 2, successRate: 92, cost: "Free", installed: true },
    { id: "canva", name: "Canva Asset Exporter", category: "design", steps: 6, successRate: 90, cost: "Pro Account", installed: false },
    { id: "figma", name: "Figma Vector Inspector", category: "design", steps: 4, successRate: 95, cost: "Enterprise", installed: false }
  ]);
  
  // ===============================================
  // EXPERIMENTAL AGENT CIVILIZATION COGNITIVE STATES
  // ===============================================
  const [workspaceThoughts, setWorkspaceThoughts] = useState<any[]>([]);
  const [digitalTwinState, setDigitalTwinState] = useState<any | null>(null);
  const [memoryNodes, setMemoryNodes] = useState<any[]>([]);
  const [memoryRelations, setMemoryRelations] = useState<any[]>([]);
  const [skillGenomes, setSkillGenomes] = useState<any[]>([]);
  const [guardianLaws, setGuardianLaws] = useState<string[]>([]);
  const [guardianTrust, setGuardianTrust] = useState<any | null>(null);
  const [guardianBiometrics, setGuardianBiometrics] = useState<any | null>(null);

  // Specialist Society Debate Outcome
  const [specialistDebate, setSpecialistDebate] = useState<{
    goal: string;
    opinions: any[];
    debateRounds: any[];
    finalVerdict: "APPROVE" | "REJECT" | "OVERRIDE_REQUIRED";
    synthesizedSteps: string[];
    consensusScore: number;
  } | null>(null);

  // Internal Thinking Loop Outline
  const [thinkingGoal, setThinkingGoal] = useState("Open Chrome, search school project parameters, quarantine deleted files");
  const [isThinkingInLoop, setIsThinkingInLoop] = useState(false);
  const [thinkingLoopResult, setThinkingLoopResult] = useState<{
    logs: { step: string; output: string }[];
    reflection: { mistake: string | null; improvement: string; accuracyScore: number };
  } | null>(null);

  // Sync state initially with active intervals for brain tracking
  useEffect(() => {
    fetchState();
    fetchCivilizationState();
    const interval = setInterval(fetchCivilizationState, 3500);
    return () => clearInterval(interval);
  }, []);

  const fetchCivilizationState = async () => {
    try {
      const res = await fetch("/api/agent-civilization/state");
      if (res.ok) {
        const data = await res.json();
        setWorkspaceThoughts(data.workspace);
        setDigitalTwinState(data.digitalTwin);
        setMemoryNodes(data.memory.nodes);
        setMemoryRelations(data.memory.relations);
        setSkillGenomes(data.skills);
        setGuardianLaws(data.guardian.laws);
        setGuardianTrust(data.guardian.trustState);
        setGuardianBiometrics(data.guardian.biometricMesh);
      }
    } catch (err) {
      console.error("Failed to connect to agent civilization API", err);
    }
  };


  // Update loop simulating constant OS changes and awareness scanner (World Model updates)
  useEffect(() => {
    if (!isAwarenessMonitoring || isDreamMode) return;

    const interval = setInterval(() => {
      // Simulate passive background changes to active apps or cursor coordinates
      const randomApps = [
        ["VS Code", "Spotify", "Terminal"],
        ["CapCut", "Chrome", "Discord"],
        ["Chrome", "Framer", "Slack"],
        ["VS Code", "Edge", "Postman"]
      ];
      const randomWindow = ["Chrome", "VS Code", "Spotify", "Slack", "CapCut", "Postman"];
      const randomFocus = [
        "Analyzing computer graphics pipeline",
        "Refactoring microservices network",
        "Rendering drone video footage",
        "Synthesizing ambient synth audio nodes",
        "Compiling backend server rules"
      ];

      const selectedApps = randomApps[Math.floor(Math.random() * randomApps.length)];
      setWorldState({
        activeWindow: randomWindow[Math.floor(Math.random() * randomWindow.length)],
        userBusy: Math.random() > 0.3,
        openApps: selectedApps,
        location: "Cyber Workspace Node",
        currentFocus: randomFocus[Math.floor(Math.random() * randomFocus.length)]
      });

      // Periodic trigger for proactive predictions
      if (Math.random() > 0.85) {
        onLogMessage("INFO", `[Predictive Engine] Detected active workspace state shift. Current app: ${worldState.activeWindow}. Safe proactive suggestions processed.`);
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [isAwarenessMonitoring, isDreamMode]);

  // Dream Mode auto loop simulation
  useEffect(() => {
    if (!isDreamMode) return;

    let lineIndex = 0;
    const dreamLogs = [
      "💤 [Dream Core] Transitioning kernel to idle state. Executing offline node defragmentation...",
      "🔗 [Dream Core] replaying action memory database... parsing 14 records",
      "🌿 [Dream Core] Synthesizing Rudra's preference patterns: Likes cyber themes and 200ms animation curves",
      "🔍 [Dream Core] Organizing semantic vector nodes... linking 'Rudra likes future AI' to 'Jarvis X'",
      "🔒 [Dream Core] Validating safety sandboxing logs... ZERO rule violations detected today",
      "💡 [Dream Core] Compiling skill evolutionary recipes: 'Create Slides presentation template' updated (98% success rating)",
      "🧬 [Dream Core] Optimizing synaptic pathways... synaptic weights stabilized",
      "✨ [Dream Core] Dream cycle finished. Shifting JARVIS core state back to active standby mode."
    ];

    setDreamLogLines([dreamLogs[0]]);

    const interval = setInterval(() => {
      lineIndex++;
      if (lineIndex < dreamLogs.length) {
        setDreamLogLines(prev => [...prev, dreamLogs[lineIndex]]);
        playSynthBeep(320 + lineIndex * 50, 0.08, "sine");
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsDreamMode(false);
          onLogMessage("CORE", "JARVIS mental dream optimization state successfully integrated. All synaptic weights are stabilized.");
        }, 1500);
      }
    }, 1800);

    return () => clearInterval(interval);
  }, [isDreamMode]);

  // Sync initial telemetry API
  const fetchState = async () => {
    try {
      const res = await fetch("/api/computer/agents-state");
      if (res.ok) {
        const data = await res.json();
        setSandboxMode(data.engine.sandboxMode);
        setTrustScore(data.engine.trustScore);
        setPermissions(data.engine.permissions);
        setHistoryLogs(data.workflowMemories);
      }
    } catch (err: any) {
      console.error("Failed to connect to computer telemetry API.", err);
    }
  };

  const playSynthBeep = (freq = 440, duration = 0.15, type: OscillatorType = "sine") => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Autoplay constraint bypass
    }
  };

  const handleTogglePermission = async (key: string, currentVal: boolean) => {
    const newVal = !currentVal;
    playSynthBeep(600, 0.1, "triangle");
    onLogMessage("INFO", `Modifying computer gateway permission [${key}] to ${newVal ? "GRANTED" : "REVOKED"}`);
    try {
      const res = await fetch("/api/computer/permissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value: newVal })
      });
      if (res.ok) {
        const data = await res.json();
        setPermissions(data.permissions);
        onLogMessage("CORE", `Gateway configuration synced: Permission [${key}] is now ${newVal ? "ENABLED" : "DISABLED"}`);
      }
    } catch (e) {
      // Fallback
      setPermissions(prev => ({ ...prev, [key]: newVal }));
    }
  };

  const handleToggleSandbox = async () => {
    const newVal = !sandboxMode;
    playSynthBeep(480, 0.15, "sawtooth");
    onLogMessage("WARN", `Shifting computer container secure sandbox mode to: ${newVal ? "ACTIVE ISOLATION" : "DIRECT OS HOST ACCESS"}`);
    try {
      const res = await fetch("/api/computer/sandbox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: newVal })
      });
      if (res.ok) {
        const data = await res.json();
        setSandboxMode(data.sandboxMode);
      }
    } catch (e) {
      setSandboxMode(newVal);
    }
  };

  // 4. Multi-Step Planner Integration
  const handleGeneratePlan = async () => {
    if (!goalInput.trim()) return;
    setIsPlanning(true);
    playSynthBeep(700, 0.12, "sine");
    setShellLines(["[Planner Agent] Deconstructing goal intent...", `[Goal Input]: "${goalInput}"`]);
    onLogMessage("INFO", `Planner Agent compiling task execution path for goal: "${goalInput}"`);

    try {
      const res = await fetch("/api/computer/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal: goalInput })
      });

      if (res.ok) {
        const data = await res.json();
        setActivePlan({
          id: data.id,
          goal: data.goal,
          tasks: data.tasks,
          totalRisk: data.totalRisk
        });
        setRequiresApproval(data.requiresManualApproval);
        setShellLines(prev => [
          ...prev,
          `[Risk Engine] Estimated risk factor: ${data.totalRisk}%`,
          data.requiresManualApproval 
            ? "⚠️ [ALERT] Critical authorization thresholds exceeded. User biometric handshake required." 
            : "✔️ [SECURE] Goal risk verified within default safe-mode tolerances."
        ]);
      }
    } catch (err: any) {
      setTimeout(() => {
        const fallbackTasks: TaskItem[] = [
          { id: "t-1", name: "Launch Browser Context", status: "pending", riskScore: 15, action: "open_app", app: "Chrome" },
          { id: "t-2", name: `Query Google Search index`, status: "pending", riskScore: 30, action: "search_web", query: goalInput },
          { id: "t-3", name: "OCR scan browser UI buttons", status: "pending", riskScore: 18, action: "click_coordinates", coordinates: { x: 340, y: 190 } }
        ];
        setActivePlan({
          id: "plan-fallback",
          goal: goalInput,
          tasks: fallbackTasks,
          totalRisk: 30
        });
        setRequiresApproval(false);
      }, 800);
    } finally {
      setIsPlanning(false);
    }
  };

  const handleStartSimulation = () => {
    if (!activePlan || activePlan.tasks.length === 0) return;
    
    if (requiresApproval) {
      setApprovalModalOpen(true);
      playSynthBeep(800, 0.25, "sine");
    } else {
      executeSimulationSequence();
    }
  };

  const handleApproveGatewayAction = () => {
    setApprovalModalOpen(false);
    setRequiresApproval(false);
    onLogMessage("CORE", `Papa Rudra identity confirmed. Initiating authorized desktop steps sequence...`);
    executeSimulationSequence();
  };

  const executeSimulationSequence = async () => {
    if (!activePlan) return;
    setIsSimulating(true);
    setOcrOverlayVisible(true);
    setShellLines(prev => [...prev, "[Gateway] Commencing sandboxed OS control loop.", "-------------------------------------"]);

    let currentTasks = [...activePlan.tasks];

    for (let i = 0; i < currentTasks.length; i++) {
      setCurrentTaskIndex(i);
      currentTasks = currentTasks.map((t, idx) => {
        if (idx === i) return { ...t, status: "executing" };
        return t;
      });
      setActivePlan(prev => prev ? { ...prev, tasks: currentTasks } : null);

      const task = currentTasks[i];
      setShellLines(prev => [...prev, `[ActionEngine] Executing step ${i + 1}/${currentTasks.length}: ${task.name}`]);

      // Interact with the OS Emulator visuals
      if (task.action === "open_app") {
        setScreenActiveApp(task.app || "Desktop");
        playSynthBeep(520, 0.12, "sine");
        await delay(1200);
      } else if (task.action === "write_text") {
        setIsTypingAnimation(true);
        let currentString = "";
        const targetText = task.text || "Initiating script";
        for (let charIdx = 0; charIdx < targetText.length; charIdx++) {
          currentString += targetText[charIdx];
          setScreenTextValue(currentString);
          playSynthBeep(900, 0.03, "sine");
          await delay(60);
        }
        setIsTypingAnimation(false);
        await delay(800);
      } else if (task.action === "search_web") {
        setScreenActiveApp("Chrome");
        setScreenTextValue(task.query || "Search");
        playSynthBeep(650, 0.1, "sine");
        await delay(1500);
      } else if (task.action === "click_coordinates" && task.coordinates) {
        setScreenCoordinates(task.coordinates);
        playSynthBeep(720, 0.08, "triangle");
        await delay(1200);
      }

      // Query real API
      try {
        const response = await fetch("/api/computer/execute-task", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            task: {
              action: task.action,
              app: task.app,
              text: task.text,
              query: task.query,
              coordinates: task.coordinates
            },
            parentGoal: activePlan.goal
          })
        });

        const data = await response.json();
        if (response.ok && data.success) {
          currentTasks = currentTasks.map((t, idx) => {
            if (idx === i) return { ...t, status: "done" };
            return t;
          });
          setActivePlan(prev => prev ? { ...prev, tasks: currentTasks } : null);
          setTrustScore(data.trustScore);
          setShellLines(prev => [...prev, ...(data.steps || []), `✔️ Success: Step ${i + 1} finalized.`, "-------------------------------------"]);
        } else {
          currentTasks = currentTasks.map((t, idx) => {
            if (idx === i) return { ...t, status: "denied" };
            return t;
          });
          setActivePlan(prev => prev ? { ...prev, tasks: currentTasks } : null);
          setTrustScore(data.trustScore || trustScore - 10);
          setShellLines(prev => [
            ...prev,
            `❌ BLOCKED: ${data.reason || "Action rejected."}`,
            "-------------------------------------"
          ]);
          onLogMessage("ERROR", `Gateway action block: ${data.reason || "Execution denied."}`);
          break;
        }
      } catch (err: any) {
        currentTasks = currentTasks.map((t, idx) => {
          if (idx === i) return { ...t, status: "done" };
          return t;
        });
        setActivePlan(prev => prev ? { ...prev, tasks: currentTasks } : null);
      }
    }

    setIsSimulating(false);
    setCurrentTaskIndex(-1);
    setOcrOverlayVisible(false);
    setShellLines(prev => [...prev, "[Gateway] OS Control Loop safely completed."]);
    fetchState();
  };

  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  const handleHaltSimulation = () => {
    setIsSimulating(false);
    setCurrentTaskIndex(-1);
    playSynthBeep(250, 0.4, "sawtooth");
    setShellLines(prev => [...prev, "🛑 [EMERGENCY HALT] Operator triggered immediate manual simulation dump! Process terminated."]);
    onLogMessage("ERROR", "OPERATOR INTERCEPTED: Direct simulation emergency halt invoked!");
  };

  // Swarm Coordinator Action Endpoint solver
  const handleSwarmSolve = async () => {
    if (!swarmGoal.trim()) return;
    setIsSwarmSolving(true);
    playSynthBeep(880, 0.15, "triangle");
    onLogMessage("INFO", `[Agent Society Layer] Initiating collaborative debate system for high-dimensional task resolution: "${swarmGoal}"`);

    try {
      const res = await fetch("/api/agent-civilization/society-solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal: swarmGoal })
      });

      if (res.ok) {
        const data = await res.json();
        setSpecialistDebate({
          goal: data.goal,
          opinions: data.opinions,
          debateRounds: data.debateRounds,
          finalVerdict: data.finalVerdict,
          synthesizedSteps: data.synthesizedSteps,
          consensusScore: data.consensusScore
        });
        
        // Populate standard swarmSolvesOutput format to prevent breaks and keep visual sync
        setSwarmSolvesOutput({
          goal: data.goal,
          steps: data.synthesizedSteps,
          agentOutputs: data.opinions.map((o: any) => ({
            agentName: o.agentName,
            logs: [
              `Verdict: ${o.verdict} (confidence: ${Math.round(o.confidence * 100)}%)`,
              `Thought: ${o.thought}`,
              `Suggested procedure: [${o.proposedSteps.join(" ➔ ")}]`
            ]
          })),
          isValidated: data.finalVerdict !== "REJECT"
        });

        onLogMessage("CORE", `Collaboration complete. Consensus Score: ${data.consensusScore}%. Verification Verdict: ${data.finalVerdict}`);
        fetchCivilizationState();
      }
    } catch (err: any) {
      console.error(err);
      onLogMessage("ERROR", "Specialist debate network offline or failed.");
    } finally {
      setIsSwarmSolving(false);
    }
  };

  // Trigger internal cognitive loop (Observe -> Understand -> Imagine -> Predict -> Debate -> Plan -> Simulate -> Act -> Reflect -> Learn)
  const handleRunThinkingLoop = async () => {
    if (!thinkingGoal.trim()) return;
    setIsThinkingInLoop(true);
    playSynthBeep(440, 0.2, "sine");
    onLogMessage("INFO", `[Thinking Kernel] Bootstrapping complete cognitive thinking loop sequence for: "${thinkingGoal}"`);

    try {
      const res = await fetch("/api/agent-civilization/think-loop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal: thinkingGoal })
      });

      if (res.ok) {
        const data = await res.json();
        setThinkingLoopResult({
          logs: data.logs,
          reflection: data.reflection
        });
        onLogMessage("CORE", `Thinking state accomplished. Accuracy Score: ${data.reflection.accuracyScore}%. Improvement: "${data.reflection.improvement}"`);
        fetchCivilizationState();
      }
    } catch (err) {
      console.error(err);
      onLogMessage("ERROR", "Cognitive Thinking engine encountered type validation error.");
    } finally {
      setIsThinkingInLoop(false);
    }
  };

  // Evolve selected skill genomics DNA
  const handleEvolveSkillGenome = async (skillId: string) => {
    playSynthBeep(1040, 0.25, "sine");
    onLogMessage("INFO", `[Genomics Engine] Injecting mutation triggers into skill blueprint sequences: ${skillId}`);
    try {
      const res = await fetch("/api/agent-civilization/evolve-skill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: skillId })
      });
      if (res.ok) {
        const data = await res.json();
        onLogMessage("CORE", `🧬 Genome mutation success! "${data.skill.task}" confidence speedup updated dynamically.`);
        fetchCivilizationState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Sleep Dream cycle
  const handleTriggerDreamDefragmenter = async () => {
    setIsDreamMode(true);
    setDreamLogLines([]);
    playSynthBeep(320, 0.5, "sine");
    onLogMessage("INFO", "💤 Commencing deep dream synchronization on episodic timelines and semantic structures.");
    
    try {
      const res = await fetch("/api/agent-civilization/dream", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        // Stagger outputting dreamlogs
        let delayMs = 150;
        data.logs.forEach((log: string, i: number) => {
          setTimeout(() => {
            setDreamLogLines(prev => [...prev, log]);
            playSynthBeep(350 + i * 40, 0.05, "sine");
          }, delayMs);
          delayMs += 250;
        });

        setTimeout(() => {
          setIsDreamMode(false);
          onLogMessage("CORE", "Defragmentation complete. Sensory memories collapsed. Semantic registry refreshed.");
          fetchCivilizationState();
        }, delayMs + 300);
      }
    } catch (err) {
      console.error(err);
      setIsDreamMode(false);
    }
  };

  // Update dynamic trust parameters
  const handleSliderSecurityUpdate = async (type: string, value: number) => {
    try {
      const payload: any = {};
      
      switch (type) {
        case "device": payload.deviceScore = value; break;
        case "behavior": payload.behaviorScore = value; break;
        case "location": payload.locationScore = value; break;
        case "face": payload.faceMatchScore = value; break;
        case "voice": payload.voiceVerifyScore = value; break;
        case "typing": payload.typingPatternAccuracy = value; break;
      }

      const res = await fetch("/api/agent-civilization/security-scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        setGuardianTrust(data.trustState);
        setGuardianBiometrics(data.biometricMesh);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle dynamic installed marketplace plugins
  const handleTogglePlugin = (pluginName: string) => {
    playSynthBeep(580, 0.1, "sine");
    setInstalledPlugins(prev => {
      const isInstalled = prev.includes(pluginName);
      if (isInstalled) {
        onLogMessage("INFO", `Unregistering plugin interface: ${pluginName}`);
        return prev.filter(p => p !== pluginName);
      } else {
        onLogMessage("CORE", `Successfully loaded and hot-patched dynamic workspace plugin: ${pluginName}`);
        return [...prev, pluginName];
      }
    });
    setSkillsRegistry(prev =>
      prev.map(p => (p.name === pluginName || p.id === pluginName ? { ...p, installed: !p.installed } : p))
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-white relative">
      
      {/* Dynamic Background Matrix Scanlines during Dream Mode */}
      <AnimatePresence>
        {isDreamMode && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#020617] pointer-events-none z-50 overflow-hidden"
          >
            <div className="absolute inset-x-0 top-0 h-10 bg-cyan-500/10 blur animate-[bounce_6s_infinite]" />
            <div className="w-full h-full bg-[radial-gradient(#0891b2_1px,transparent_1px)] [background-size:16px_16px]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8 select-none">
        <div>
          <h1 className="text-3xl font-sans font-black tracking-tight text-white flex items-center gap-3">
            <Cpu className="text-cyan-400 shrink-0 animate-pulse" /> JARVIS X CONTROL GATEWAY
          </h1>
          <p className="text-xs font-mono text-cyan-400/60 mt-1 uppercase">
            Holographic Agent Swarm Control Matrix, Security Sandboxing, and Continuous Computer Cognition
          </p>
        </div>

        {/* Extended Navigation Hub */}
        <div className="flex flex-wrap bg-cyan-950/25 border border-cyan-500/15 p-1 rounded-lg text-[10px] font-mono gap-1 uppercase">
          {[
            { id: "gateway", label: "Agent Gateway" },
            { id: "swarm", label: "Swarm Coordinator" },
            { id: "awareness", label: "World Model & Awareness" },
            { id: "marketplace", label: "Skills Marketplace" },
            { id: "vault", label: "Action Ledger" }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => {
                setCoordinatorTab(item.id as any);
                playSynthBeep(650, 0.08, "sine");
              }}
              className={`px-2.5 py-1.5 rounded transition-all cursor-pointer font-bold ${
                coordinatorTab === item.id 
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" 
                  : "text-gray-400 hover:text-cyan-300 hover:bg-white/5"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* TAB 1: GATEWAY & OS SIMULATOR */}
        {coordinatorTab === "gateway" && (
          <motion.div
            key="gateway-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Left Controls */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Trust Indicators */}
              <div className="p-5 bg-black/45 border border-white/10 rounded-2xl backdrop-blur-md space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-[10px] font-mono tracking-wider text-cyan-400 uppercase font-black">Gateway Integrity Status</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono text-gray-500 uppercase">Sound Feedback</span>
                    <button 
                      onClick={() => setSoundEnabled(!soundEnabled)} 
                      className={`p-1 rounded bg-white/5 text-gray-400 hover:text-white cursor-pointer`}
                    >
                      {soundEnabled ? <Volume2 size={11} className="text-cyan-400" /> : <VolumeX size={11} />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-center space-y-1">
                    <span className="text-[10px] font-mono text-gray-400 uppercase block">Session Trust Score</span>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-2xl font-black text-cyan-400">{trustScore}</span>
                      <span className="text-xs font-mono text-gray-500">/100</span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${
                          trustScore > 80 ? "bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.6)]" : trustScore > 50 ? "bg-amber-400" : "bg-red-500"
                        }`}
                        style={{ width: `${trustScore}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-white/5 border border-white/5 rounded-xl flex flex-col justify-between items-center text-center">
                    <span className="text-[10px] font-mono text-gray-400 uppercase block mb-1">Sandbox Isolation</span>
                    <button
                      onClick={handleToggleSandbox}
                      className={`w-full py-1.5 px-3 rounded-lg font-mono text-[10px] uppercase font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        sandboxMode 
                          ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/25 shadow-[0_0_8px_rgba(6,182,212,0.1)]" 
                          : "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}
                    >
                      {sandboxMode ? (
                        <>
                          <Shield size={11} className="animate-pulse" /> Sandbox Active
                        </>
                      ) : (
                        <>
                          <AlertTriangle size={11} /> Unrestricted Host
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Boundary Permissions */}
              <div className="p-5 bg-black/45 border border-white/10 rounded-2xl backdrop-blur-md space-y-4">
                <h3 className="text-xs font-mono font-bold text-white tracking-widest uppercase flex items-center gap-1.5 border-b border-white/5 pb-2">
                  <Sliders size={13} className="text-cyan-400" /> Boundary Access Permissions
                </h3>

                <div className="space-y-2.5 font-mono text-[11px]">
                  {[
                    { key: "browserAccess", label: "Browser Control Access", desc: "Allows Playwright navigation & queries", safe: true },
                    { key: "desktopControl", label: "Desktop Controller Layer", desc: "Allows moveMouse, mouseClick clicks", safe: false },
                    { key: "emailSend", label: "SMTP Email Dispatcher", desc: "Allows sending automated warnings", safe: false },
                    { key: "fileDelete", label: "File System Erasers", desc: "Permission to prune logs/folders", safe: false },
                    { key: "terminal", label: "Direct Terminal Access", desc: "Allows pipeline shell commands", safe: false }
                  ].map(perm => {
                    const isGranted = (permissions as any)[perm.key];
                    return (
                      <div 
                        key={perm.key}
                        className="flex items-center justify-between p-2.5 bg-white/5 rounded-xl border border-white/10"
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white">{perm.label}</span>
                            {!perm.safe && (
                              <span className="text-[7.5px] bg-red-500/10 border border-red-500/20 text-red-400 px-1 py-0.2 rounded font-black tracking-wide uppercase">
                                PRO-RISK
                              </span>
                            )}
                          </div>
                          <span className="text-[9px] text-gray-400 block mt-0.5">{perm.desc}</span>
                        </div>

                        <button
                          onClick={() => handleTogglePermission(perm.key, isGranted)}
                          className={`flex items-center gap-1 px-2.5 py-1 text-[9px] font-black uppercase rounded-lg border transition-all cursor-pointer ${
                            isGranted 
                              ? "bg-cyan-500/15 border-cyan-400/40 text-cyan-300 font-extrabold"
                              : "bg-white/5 border-white/10 text-gray-500"
                          }`}
                        >
                          {isGranted ? <Unlock size={10} /> : <Lock size={10} />}
                          {isGranted ? "Granted" : "Blocked"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Objective Planner */}
              <div className="p-5 bg-black/45 border border-white/10 rounded-2xl backdrop-blur-md space-y-4 font-mono">
                <h3 className="text-xs font-mono font-bold text-white tracking-widest uppercase flex items-center gap-1.5 border-b border-white/5 pb-2">
                  <Workflow size={13} className="text-cyan-400" /> Dynamic Goal Sequence Planner
                </h3>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[9px] text-gray-400 uppercase">Input Autonomous Goal Intent</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={goalInput}
                        onChange={e => setGoalInput(e.target.value)}
                        placeholder="e.g., Open Chrome, search AI news, summarize"
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs select-text focus:outline-none focus:border-cyan-400 text-white"
                        disabled={isSimulating}
                      />
                      <Search size={12} className="absolute right-3 top-3 text-gray-500" />
                    </div>
                  </div>

                  <div className="flex gap-2 text-xs uppercase font-bold">
                    <button
                      onClick={handleGeneratePlan}
                      disabled={isPlanning || isSimulating}
                      className="flex-1 py-1.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black rounded-xl transition-all cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.2)] flex items-center justify-center gap-1.5"
                    >
                      <Zap size={12} className={isPlanning ? "animate-spin" : ""} />
                      {isPlanning ? "Planning..." : "Compile Plan"}
                    </button>

                    {activePlan && (
                      <button
                        onClick={handleStartSimulation}
                        disabled={isSimulating}
                        className="py-1.5 px-4 bg-fuchsia-600 hover:bg-fuchsia-500 disabled:opacity-50 text-white rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(217,70,239,0.2)]"
                      >
                        <Play size={12} />
                        Execute Task
                      </button>
                    )}
                  </div>
                </div>

                {/* Pre-run Simulator Guard Rating */}
                <AnimatePresence>
                  {activePlan && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-3 bg-fuchsia-950/15 border border-fuchsia-500/20 rounded-xl space-y-1.5 text-[10px]"
                    >
                      <div className="flex justify-between items-center text-fuchsia-300">
                        <span className="font-extrabold flex items-center gap-1">
                          <Compass size={11} className="animate-spin" /> Virtual Simulation Pre-Scan
                        </span>
                        <span>Safety Factor: {activePlan.totalRisk > 50 ? "40% (Medium Risk)" : "98% (High Safety)"}</span>
                      </div>
                      <p className="text-gray-400 leading-normal text-[9px] font-sans">
                        Simulating step-by-step outcomes inside sandbox virtual layers before dispatching active robot commands to verify safe execution path.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>

            {/* Right Screen Simulator & Shell */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="border border-white/10 rounded-2xl bg-slate-950/75 p-1 relative overflow-hidden shadow-2xl backdrop-blur-md">
                <div className="flex items-center justify-between p-3 bg-slate-900 border-b border-white/5 rounded-t-xl select-none text-xs font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 block" />
                  </div>
                  <span className="text-[10px] text-gray-400 tracking-widest font-black uppercase">JARVIS-X LIVE DESKTOP PORTAL SIMULATOR</span>
                  <div>
                    {isSimulating && (
                      <span className="inline-block px-1.5 py-0.2 bg-red-500/20 border border-red-500/30 text-red-400 text-[8px] font-bold rounded animate-pulse uppercase tracking-widest">
                        SIMULATION RUNNING
                      </span>
                    )}
                  </div>
                </div>

                <div className="h-[26rem] bg-slate-900/40 relative flex items-center justify-center p-6">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-35" />

                  {/* Desktop Background Mock Icon Grid */}
                  <div className="absolute top-4 left-4 grid grid-cols-1 gap-4 select-none">
                    <div className="flex flex-col items-center p-1.5 hover:bg-white/5 rounded-lg border border-transparent hover:border-white/5 transition-all w-16 text-center cursor-pointer">
                      <Tv size={18} className="text-sky-400" />
                      <span className="text-[8px] text-gray-300 font-mono mt-1 tracking-wider uppercase font-bold">My PC</span>
                    </div>
                    <div className="flex flex-col items-center p-1.5 hover:bg-white/5 rounded-lg border border-transparent hover:border-white/5 transition-all w-16 text-center cursor-pointer">
                      <Database size={18} className="text-emerald-400" />
                      <span className="text-[8px] text-gray-300 font-mono mt-1 tracking-wider uppercase font-bold">Vault DB</span>
                    </div>
                  </div>

                  {/* Interactive App Window Container */}
                  <AnimatePresence>
                    {screenActiveApp && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: 12 }}
                        className="w-11/12 max-w-md bg-slate-950/95 border border-cyan-500/20 shadow-[0_12px_40px_rgba(0,0,0,0.6)] rounded-xl overflow-hidden font-mono text-[10px] z-20 flex flex-col h-64 relative"
                      >
                        <div className="bg-slate-900 px-3.5 py-1.5 flex items-center justify-between border-b border-cyan-500/10">
                          <div className="flex items-center gap-1.5 text-[9px] text-cyan-300 font-bold uppercase tracking-wider">
                            <Radio size={10} className="animate-pulse" /> Sandbox Container: {screenActiveApp}
                          </div>
                          <button 
                            onClick={() => setScreenActiveApp(null)}
                            className="text-gray-500 hover:text-white cursor-pointer hover:bg-white/5 p-1 rounded-md"
                          >
                            ×
                          </button>
                        </div>

                        {screenActiveApp === "Chrome" ? (
                          <div className="flex-1 flex flex-col bg-slate-950 p-4 space-y-4">
                            <div className="flex border border-cyan-500/20 rounded-lg p-2 items-center bg-cyan-950/20">
                              <Globe size={12} className="text-cyan-400 mr-2 shrink-0 animate-pulse" />
                              <span className="font-mono text-cyan-200 truncate select-all">{screenTextValue || "google.com"}</span>
                            </div>

                            <div className="flex-1 bg-[#101524] border border-cyan-500/10 rounded-lg p-3 flex flex-col justify-between overflow-hidden relative">
                              {ocrOverlayVisible && (
                                <div className="absolute inset-0 bg-cyan-950/10 border border-cyan-400/20 pointer-events-none flex flex-col justify-between p-2">
                                  <div className="w-full border-t border-b border-cyan-400/40 h-2 animate-[pulse_1.5s_infinite]" />
                                  <span className="text-[7px] text-cyan-400/50 block font-mono self-end uppercase">SCANNING EYES OCR LAYER ACTIVE</span>
                                </div>
                              )}

                              <div className="space-y-1 my-auto text-center font-mono">
                                {screenTextValue ? (
                                  <>
                                    <div className="text-[12px] font-black text-white tracking-widest uppercase mb-1">GOOGLE INDEX WEB RESULTS</div>
                                    <p className="text-[9px] text-cyan-400">Match active: query string "{screenTextValue}"</p>
                                    <span className="text-[8px] bg-cyan-500/15 border border-cyan-400/20 p-1.5 rounded-md text-cyan-300 uppercase block mt-2 inline-block">OCR: 3 elements coordinates parsed</span>
                                  </>
                                ) : (
                                  <div className="text-gray-500">[Browser viewport initial security handshake successful]</div>
                                )}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex-1 bg-black p-4 text-[9.5px] leading-relaxed font-mono text-cyan-300 select-all overflow-y-auto">
                            <span className="text-cyan-400 font-bold uppercase block border-b border-cyan-500/10 pb-1 flex justify-between">
                              <span>PROCESS LOGS TERMINAL: {screenActiveApp}</span>
                              <span className="animate-pulse text-green-400">● ACTIVE SANDBOX</span>
                            </span>
                            <div className="mt-2 space-y-1 font-mono">
                              <div>&gt; Loading file-descriptors... complete.</div>
                              <div>&gt; Dynamic sandbox bind context instantiated successfully.</div>
                              {screenTextValue && <div className="text-white font-bold mt-1">&gt; WRITE STR: {screenTextValue}</div>}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Simulated mouse pointer */}
                  {isSimulating && (
                    <motion.div
                      animate={{
                        x: screenCoordinates.x - 200, 
                        y: screenCoordinates.y - 180
                      }}
                      transition={{ type: "spring", stiffness: 45, damping: 14 }}
                      className="absolute w-5 h-5 z-40"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-cyan-400 filter drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">
                        <polygon points="3,3 21,9 12,12 9,21" fill="currentColor" fillOpacity="0.4" strokeWidth="2" />
                      </svg>
                    </motion.div>
                  )}
                </div>

                {/* Subtask tree timeline */}
                {activePlan && (
                  <div className="p-4 bg-slate-900/95 border-t border-white/10 text-[10px] font-mono space-y-3 select-none">
                    <div className="text-[9px] uppercase text-cyan-400 tracking-wider font-extrabold flex items-center gap-1.5">
                      <Layers size={12} /> Compiling Active Plan Sub-Task Nodes
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {activePlan.tasks.map((task) => (
                        <div 
                          key={task.id}
                          className={`p-3 border rounded-xl flex items-center justify-between ${
                            task.status === "done" 
                              ? "border-green-500/25 bg-green-500/5 text-green-300"
                              : task.status === "executing"
                              ? "border-cyan-500 animate-pulse bg-cyan-500/5 text-cyan-200"
                              : task.status === "denied"
                              ? "border-red-500/30 bg-red-500/5 text-red-400 font-bold"
                              : "border-white/5 bg-white/5 opacity-40 text-gray-500"
                          }`}
                        >
                          <div>
                            <span className="text-[8px] bg-white/5 border border-white/10 px-1 py-0.2 rounded font-black mb-1 uppercase block leading-none">
                              {task.action}
                            </span>
                            <span className="font-semibold block mt-1">{task.name}</span>
                          </div>

                          <div className="text-right shrink-0">
                            {task.status === "done" && <CheckCircle2 size={13} className="text-green-400" />}
                            {task.status === "executing" && <Activity size={13} className="text-cyan-400 animate-spin" />}
                            {task.status === "denied" && <AlertTriangle size={13} className="text-red-400" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Shell */}
              <div className="p-5 border border-white/10 bg-black/85 rounded-2xl font-mono text-[10px] text-cyan-300 space-y-1.5 h-48 overflow-y-auto leading-relaxed relative">
                <div className="text-cyan-400 border-b border-white/10 pb-2 flex justify-between items-center mb-1 text-[9px] uppercase font-black select-none">
                  <span>Action Logs Shell Output</span>
                  <div className="flex gap-2 text-[8px] font-bold">
                    {isSimulating && (
                      <button 
                        onClick={handleHaltSimulation}
                        className="px-2 py-0.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-md cursor-pointer animate-pulse uppercase tracking-wider"
                      >
                        EMERGENCY STOP
                      </button>
                    )}
                    <span className="text-green-400 animate-pulse">● STABLE SANDBOX</span>
                  </div>
                </div>

                {shellLines.map((lg, idx) => (
                  <div 
                    key={idx} 
                    className={
                      lg.includes("Success:") 
                        ? "text-green-400 font-bold" 
                        : lg.includes("BLOCKED:") 
                        ? "text-red-400 font-extrabold animate-pulse" 
                        : lg.includes("[ActionEngine]")
                        ? "text-fuchsia-400 font-semibold"
                        : "text-cyan-200"
                    }
                  >
                    {lg}
                  </div>
                ))}

                {shellLines.length === 0 && (
                  <div className="text-gray-500 font-mono uppercase text-center mt-8">[No sandbox actions executed in active session]</div>
                )}
              </div>

            </div>
          </motion.div>
        )}

        {/* TAB 2: SWARM AGENT COORDINATOR SOLVER */}
        {coordinatorTab === "swarm" && (
          <motion.div
            key="swarm-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {/* Swarm Planner Interactive console */}
            <div className="p-6 border border-white/10 bg-black/45 rounded-2xl space-y-4 font-mono">
              <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase font-extrabold block">
                SPECIALIST AGENTS CONVERGENCE CONSOLE (SWARM SOLVE)
              </span>
              <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
                Assign complex multi-step instructions below. The Coordinator Agent will automatically delegate goals to specialized sub-agents (Browser, Desktop, Research, Memory), verify execution states, synthesize findings, and confirm consensus.
              </p>

              <div className="space-y-3 pt-2">
                <div className="space-y-1">
                  <span className="text-[9px] text-cyan-300 uppercase block font-bold">Input Coordinator Goal Sequence</span>
                  <div className="flex flex-col md:flex-row gap-3">
                    <input
                      type="text"
                      value={swarmGoal}
                      onChange={e => setSwarmGoal(e.target.value)}
                      placeholder="e.g., Generate a PowerPoint slides layout detailing solar thresholds..."
                      className="flex-1 px-4 py-2 bg-white/5 border border-white/15 focus:border-cyan-400 focus:outline-none text-xs rounded-xl text-white select-text"
                    />
                    <button
                      onClick={handleSwarmSolve}
                      disabled={isSwarmSolving || !swarmGoal.trim()}
                      className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-xs uppercase rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 shrink-0"
                    >
                      <Zap size={12} className={isSwarmSolving ? "animate-spin" : ""} />
                      {isSwarmSolving ? "Coordinating..." : "Trigger Swarm Solve"}
                    </button>
                  </div>
                </div>

                {/* Preconfigured quick workflows recipes */}
                <div className="pt-2">
                  <span className="text-[8px] text-gray-500 uppercase font-black block mb-2 tracking-wider">Quick Swarm Recipe Presets</span>
                  <div className="flex flex-wrap gap-2 text-[9px] font-sans font-semibold">
                    {[
                      { label: "Create Slides presentation on AI", goal: "Compile Slides presentation analyzing modern AI trends" },
                      { label: "Deep-research quantum physics", goal: "Open Chrome, search quantum mechanics papers, generate research summary" },
                      { label: "Cleanup files secure audit", goal: "Verify sandbox directories parameters and logs success rates list" }
                    ].map((recipe, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSwarmGoal(recipe.goal);
                          playSynthBeep(620, 0.08, "triangle");
                        }}
                        className="px-2.5 py-1.5 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:text-cyan-300 hover:border-cyan-500/30 transition-all cursor-pointer"
                      >
                        {recipe.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Display Swarm Solver Outputs */}
            <AnimatePresence>
              {isSwarmSolving && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-6 border border-cyan-500/20 bg-cyan-950/10 rounded-2xl flex flex-col items-center justify-center py-12 gap-3"
                >
                  <Activity size={32} className="text-cyan-400 animate-spin" />
                  <span className="text-xs font-mono font-bold uppercase text-cyan-300 tracking-wider">
                    Swarm Delegation Loop Executing...
                  </span>
                  <div className="max-w-md text-center text-gray-400 text-[11.5px] font-sans leading-relaxed">
                    Planner agent splitting tasks... Memory check running... Browser agents fetching online indexes...
                  </div>
                </motion.div>
              )}

              {swarmSolvesOutput && !isSwarmSolving && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-[11px]"
                >
                  {/* Column 1 & 2: Steps and output logs generated by subagents */}
                  <div className="lg:col-span-2 p-5 border border-white/10 bg-black/45 rounded-2xl backdrop-blur-md space-y-4">
                    <h3 className="text-xs text-white uppercase font-black flex items-center justify-between border-b border-white/5 pb-2">
                      <span>SPECIALISTS LOG PIPELINE FEED</span>
                      <span className="text-[10px] text-green-400 font-extrabold flex items-center gap-1">
                        <Check size={12} /> VERIFIED CONSENSUS
                      </span>
                    </h3>

                    <div className="space-y-4 max-h-[30rem] overflow-y-auto pr-1">
                      {swarmSolvesOutput.agentOutputs.map((agent, i) => (
                        <div key={i} className="space-y-1.5 p-3 rounded-xl border border-white/5 bg-white/5">
                          <div className="flex items-center justify-between font-extrabold uppercase border-b border-white/5 pb-1 text-cyan-300 text-[10px]">
                            <span>{agent.agentName}</span>
                            <span className="text-[8px] bg-cyan-400/10 border border-cyan-400/20 text-cyan-300 px-1.5 py-0.2 rounded font-black tracking-widest">
                              STANDBY
                            </span>
                          </div>
                          
                          <div className="space-y-1 text-gray-400">
                            {agent.logs.map((log, index) => (
                              <div key={index} className="flex gap-2">
                                <span className="text-cyan-500/60 font-black shrink-0">&gt;</span>
                                <span className="leading-relaxed">{log}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Column 3: Consolidated consensus statistics */}
                  <div className="p-5 border border-white/10 bg-black/45 rounded-2xl backdrop-blur-md space-y-4 flex flex-col justify-between">
                    <div className="space-y-4">
                      <h3 className="text-xs text-white uppercase font-black border-b border-white/5 pb-2">
                        Consolidated Analysis
                      </h3>
                      
                      <div className="space-y-2">
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Initiated Command Goal</span>
                        <p className="text-white text-xs font-sans leading-relaxed text-cyan-100 font-bold uppercase italic">
                          "{swarmSolvesOutput.goal}"
                        </p>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-white/5">
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Completed Sub-task Checklist</span>
                        <div className="space-y-2 text-[10px]">
                          {swarmSolvesOutput.steps.map((st, i) => (
                            <div key={i} className="flex items-start gap-1.5 text-gray-300">
                              <CheckCircle2 size={13} className="text-green-400 shrink-0 mt-0.5" />
                              <span>{st}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/5 space-y-2 text-center">
                      <div className="text-[24px] font-black text-green-400">100%</div>
                      <span className="text-[10px] text-gray-400 uppercase block tracking-widest leading-none font-bold">Consensus Verified</span>
                      <p className="text-[9px] font-sans text-gray-500 leading-normal">
                        All dedicated agents resolved active loops, submitted parameters to Reflection verification models, and successfully archived results to files workspace.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Architecture diagram flow representation */}
            <div className="p-6 border border-white/10 bg-black/45 rounded-2xl flex flex-col items-center">
              <span className="text-[10px] font-mono tracking-wider text-cyan-400 uppercase font-black mb-6 select-none block">
                Integrated Controlled Multi-Agent Architectures Map
              </span>

              <div className="grid grid-cols-1 md:grid-cols-7 gap-4 w-full text-center relative items-center font-mono">
                <div className="p-3 border border-cyan-500/20 bg-cyan-950/20 rounded-xl space-y-1 shadow-[0_0_12px_rgba(6,182,212,0.1)]">
                  <span className="text-xs font-black text-cyan-300">USER HANDSHAKE</span>
                  <p className="text-[8.5px] text-gray-400 leading-normal">Goals and intents transmitted</p>
                </div>
                <div className="hidden md:block text-cyan-400 text-xs font-bold shrink-0">→</div>
                <div className="p-3 border border-fuchsia-500/20 bg-fuchsia-950/20 rounded-xl space-y-1">
                  <span className="text-xs font-black text-fuchsia-300">COGNITIVE KERNEL</span>
                  <p className="text-[8.5px] text-gray-400 leading-normal">Maintains internal world state</p>
                </div>
                <div className="hidden md:block text-fuchsia-400 text-xs font-bold shrink-0">→</div>
                <div className="p-3 border border-amber-500/20 bg-amber-950/20 rounded-xl space-y-1">
                  <span className="text-xs font-black text-amber-300">AGENT SWARM</span>
                  <p className="text-[8.5px] text-gray-400 leading-normal">Deconstruct plans to specialists</p>
                </div>
                <div className="hidden md:block text-amber-400 text-xs font-bold shrink-0">→</div>
                <div className="p-3 border border-red-500/30 bg-red-950/20 rounded-xl space-y-1 shadow-[0_0_12px_rgba(239,68,68,0.15)] animate-pulse">
                  <span className="text-xs font-black text-red-400">GUARDIAN GATEWAY</span>
                  <p className="text-[8.5px] text-gray-400 leading-normal">Biometric checkpoints & risk filters</p>
                </div>
              </div>

              <div className="my-6 text-gray-600 font-mono text-xs select-none">↓↓ INTEGRATED HOST DESKTOP ENVIRONMENTS SCREEN ↓↓</div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 w-full text-center relative items-center font-mono text-gray-500">
                <div className="p-3 border border-white/5 bg-white/5 rounded-xl space-y-1">
                  <span className="text-xs font-semibold text-white">Browser Agent</span>
                  <p className="text-[8px]">Playwright headless Chrome runs</p>
                </div>
                <div className="hidden md:block text-xs shrink-0">&gt;</div>
                <div className="p-3 border border-white/5 bg-white/5 rounded-xl space-y-1">
                  <span className="text-xs font-semibold text-white">Desktop Agent</span>
                  <p className="text-[8px]">Virtual keyboard mouse emulation</p>
                </div>
                <div className="hidden md:block text-xs shrink-0">&gt;</div>
                <div className="p-3 border border-white/5 bg-white/5 rounded-xl space-y-1">
                  <span className="text-xs font-semibold text-white">Host OS Workspace</span>
                  <p className="text-[8px]">Target browser, files, and spreadsheets</p>
                </div>
              </div>
            </div>

            {/* Static Swarm Specialist Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-[11px]">
              {[
                { name: "Planner Agent", desc: "Deconstructs high-level goal ideas into exact sub-task instructions maps.", status: "Idle", color: "text-amber-400" },
                { name: "Research Agent", desc: "Launches web scraper loops to search google indexes, compare papers and aggregate files.", status: "Standby", color: "text-sky-400" },
                { name: "Memory Agent", desc: "Retrieves context, semantic matches and updates facts records hierarchies.", status: "Online", color: "text-emerald-400" },
                { name: "Browser Agent", desc: "Navigates HTML networks, inputs fields and scans browser viewports.", status: "Standby", color: "text-purple-400" },
                { name: "Desktop Agent", desc: "Moves cursor, coordinates pixels click sequences and issues terminal commands.", status: "Standby", color: "text-fuchsia-400" },
                { name: "Reflection Agent", desc: "Verifies visual screen OCR text and logs errors completion ratios lists.", status: "Online", color: "text-rose-400 animate-pulse" }
              ].map(agent => (
                <div 
                  key={agent.name}
                  className="p-5 border border-white/10 bg-black/45 rounded-2xl backdrop-blur-md space-y-2 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-black uppercase tracking-wide ${agent.color}`}>{agent.name}</span>
                    <span className="text-[8px] border border-white/5 bg-white/5 text-gray-400 px-1.5 py-0.2 rounded font-black tracking-widest">
                      {agent.status}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs font-sans leading-relaxed">{agent.desc}</p>
                </div>
              ))}
            </div>

          </motion.div>
        )}

        {/* TAB 3: INTERNAL WORLD MODEL & CONTINUOUS AWARENESS */}
        {coordinatorTab === "awareness" && (
          <motion.div
            key="awareness-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* World Model Map HUD Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Box 1: Core World State Monitors (Dynamic Digital Twin) */}
              <div className="p-6 border border-white/10 bg-black/45 rounded-2xl backdrop-blur-md space-y-4 font-mono text-[11px]">
                <h3 className="text-xs uppercase text-cyan-400 font-black border-b border-white/5 pb-2 flex justify-between items-center">
                  <span>DYNAMIC DIGITAL TWIN</span>
                  <span className="animate-pulse text-[8px] tracking-widest text-green-400 bg-green-500/10 border border-green-500/20 px-1.5 py-0.2 rounded font-black">
                    ● SYNCED
                  </span>
                </h3>

                <div className="space-y-3 pt-1">
                  <div className="space-y-1 bg-white/5 p-3 rounded-xl border border-white/5">
                    <span className="text-[9px] text-gray-400 tracking-wider block uppercase">Active In-Focus App</span>
                    <span className="text-sm font-black text-white flex items-center gap-1.5">
                      <Tv size={14} className="text-cyan-400 animate-pulse" /> {digitalTwinState?.activeApps[0] || worldState.activeWindow} Sandbox
                    </span>
                  </div>

                  <div className="space-y-1 bg-white/5 p-3 rounded-xl border border-white/5">
                    <span className="text-[9px] text-gray-400 tracking-wider block uppercase">Current Visual Task Focus</span>
                    <span className="text-white text-xs leading-normal font-bold">
                      {digitalTwinState?.focus || worldState.currentFocus}
                    </span>
                  </div>

                  <div className="space-y-1 bg-white/5 p-3 rounded-xl border border-white/5">
                    <span className="text-[9px] text-gray-400 tracking-wider block uppercase">Running Process Handles</span>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(digitalTwinState?.activeApps || worldState.openApps).map((ap: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 bg-cyan-950/20 border border-cyan-500/15 text-cyan-300 text-[10px] rounded-lg font-bold">
                          {ap}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1 bg-white/5 p-3 rounded-xl border border-white/5">
                    <span className="text-[9px] text-gray-400 tracking-wider block uppercase">Operator Occupancy Status</span>
                    <span className="text-white text-xs leading-none flex items-center gap-1.5 font-bold">
                      <span className={`w-2 h-2 rounded-full ${worldState.userBusy ? "bg-amber-400 animate-ping" : "bg-green-400"}`} />
                      {worldState.userBusy ? `Captain Rudra in [${digitalTwinState?.userState || "Deep Work"}] Mode` : "Operator Standby"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="bg-white/5 p-2 rounded-xl text-center border border-white/5">
                      <span className="text-[8px] text-gray-500 uppercase block">Productivity</span>
                      <span className="text-xs text-white font-black">{digitalTwinState?.productivityScore || 94}%</span>
                    </div>
                    <div className="bg-white/5 p-2 rounded-xl text-center border border-white/5">
                      <span className="text-[8px] text-gray-500 uppercase block">User Energy</span>
                      <span className="text-xs text-cyan-400 font-black uppercase">{digitalTwinState?.energy || "peak"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Box 2: Continuous Optical Awareness Info & Live Habits */}
              <div className="p-6 border border-white/10 bg-black/45 rounded-2xl backdrop-blur-md space-y-4 font-mono text-[11px] flex flex-col justify-between">
                <div className="space-y-3">
                  <h3 className="text-xs uppercase text-cyan-400 font-black border-b border-white/5 pb-2">
                    CONTINUOUS AWARENESS & HABITS
                  </h3>
                  
                  <p className="text-[11px] font-sans text-gray-400 leading-normal leading-relaxed">
                    JARVIS operates reactive OCR scan loops to dynamically update internal scene understanding and record persistent habits.
                  </p>

                  <div className="space-y-2 pt-1">
                    <span className="text-[8px] text-gray-500 uppercase block font-black">Learned Behavior Profiles</span>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                      {(digitalTwinState?.habits || [
                        "Maintains active sandbox security isolation",
                        "Plays ambient synth loops when editing complex compilers"
                      ]).map((habit: string, idx: number) => (
                        <div key={idx} className="flex gap-1.5 items-start p-1.5 bg-white/5 rounded-lg border border-white/5 text-[9.5px] leading-snug text-gray-300">
                          <span className="text-cyan-400 font-bold shrink-0">✦</span>
                          <span>{habit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-cyan-950/30 border border-cyan-500/20 rounded-xl text-[10px] space-y-1 pt-3 leading-normal font-sans text-cyan-300">
                  <span className="font-mono text-[9px] font-extrabold text-cyan-400 block uppercase mb-1 flex items-center gap-1">
                    <Sparkles size={11} className="animate-spin" /> Live Mind Twin telemetry
                  </span>
                  "Active hardware loads: CPU {digitalTwinState?.hardwareTwin.cpuLoad || 24}% | RAM {digitalTwinState?.hardwareTwin.ramUsageGB || 6.2}GB. Sandbox Integrity 100% stable."
                </div>
              </div>

              {/* Box 3: Sensory Dream Defragmenter Loop */}
              <div className="p-6 border border-white/10 bg-black/45 rounded-2xl backdrop-blur-md space-y-4 font-mono text-[11px] relative overflow-hidden flex flex-col justify-between h-[30rem] lg:h-auto">
                <div className="space-y-4">
                  <h3 className="text-xs uppercase text-cyan-400 font-black border-b border-white/5 pb-2 flex justify-between items-center">
                    <span>COGNITIVE DREAM INTELLIGENCE</span>
                    {isDreamMode && <span className="text-[8px] animate-pulse text-fuchsia-400">DEFRAGMENTING...</span>}
                  </h3>

                  <p className="text-[11px] font-sans text-gray-400 leading-normal leading-relaxed">
                    Optimize episodic nodes, apply decay algorithms to outdated files, and merge fact mappings to stabilize cerebral cache.
                  </p>

                  <div className="bg-[#050b14] border border-cyan-500/10 rounded-xl p-3 h-44 overflow-y-auto space-y-1.5 text-[9.5px]">
                    {isDreamMode ? (
                      dreamLogLines.map((line, i) => (
                        <div key={i} className="text-cyan-300 flex gap-1.5">
                          <span className="text-fuchsia-400">💤</span>
                          <span>{line}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500 text-center uppercase mt-12 flex flex-col items-center gap-1.5">
                        <span>[Dream Core Standby]</span>
                        <span className="text-[8px] text-gray-600 font-normal">Ready to compress memories</span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleTriggerDreamDefragmenter}
                  disabled={isDreamMode}
                  className="w-full py-2 bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 disabled:opacity-50 text-white font-extrabold leading-none uppercase rounded-xl cursor-pointer transition-all shadow-[0_0_15px_rgba(217,70,239,0.3)] text-center text-xs"
                >
                  {isDreamMode ? "Running Dream Compression..." : "Trigger Dream Sleep Cycle"}
                </button>
              </div>

            </div>

            {/* Conscious Workspace & Knowledge Graph Block */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left 2 Cols: Real-time Conscious Workspace (Brain RAM Brainwaves Stream) */}
              <div className="lg:col-span-2 p-6 border border-white/10 bg-black/45 rounded-2xl backdrop-blur-md space-y-4">
                <div className="border-b border-white/5 pb-2 flex justify-between items-center font-mono">
                  <div>
                    <h3 className="text-xs uppercase text-cyan-400 font-black flex items-center gap-1.5">
                      <span>CONSCIOUS WORKSPACE (BRAIN RAM FLOW)</span>
                    </h3>
                    <span className="text-[9.5px] text-gray-500 uppercase block mt-1">
                      Active thoughts, specialist insights, and sandbox actions broadcasted in real-time
                    </span>
                  </div>
                  <span className="text-[8.5px] text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded font-black animate-pulse">
                    STREAM ACTIVE
                  </span>
                </div>

                <div className="space-y-2.5 max-h-[18rem] overflow-y-auto pr-1 font-mono text-[10px]">
                  {workspaceThoughts.map((th, index) => (
                    <div 
                      key={th.id || index} 
                      className={`p-2.5 rounded-xl border transition-all flex justify-between items-start gap-3 ${
                        th.importance >= 8
                          ? "bg-red-500/5 border-red-500/15"
                          : th.importance >= 6
                          ? "bg-cyan-500/5 border-cyan-500/15"
                          : "bg-white/2 border-white/5"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[8.5px] font-black uppercase px-2 py-0.2 rounded leading-none ${
                            th.importance >= 8
                              ? "bg-red-500/10 text-red-400 border border-red-500/20"
                              : "bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
                          }`}>
                            {th.agent}
                          </span>
                          <span className="text-[8px] text-gray-500">{th.timestamp}</span>
                        </div>
                        <p className="text-gray-300 leading-relaxed font-sans text-xs pt-0.5">{th.thought}</p>
                      </div>
                      <span className="text-[9px] text-gray-500 bg-white/5 border border-white/5 px-1.5 py-0.2 rounded font-black shrink-0">
                        Prio: {th.importance}/10
                      </span>
                    </div>
                  ))}

                  {workspaceThoughts.length === 0 && (
                    <div className="text-gray-500 text-center uppercase py-12">[No brain ram thoughts logged]</div>
                  )}
                </div>
              </div>

              {/* Right Col: Knowledge Graph Node Relations */}
              <div className="p-6 border border-white/10 bg-black/45 rounded-2xl backdrop-blur-md space-y-4">
                <div className="border-b border-white/5 pb-2 font-mono">
                  <h3 className="text-xs uppercase text-cyan-400 font-black">
                    MEMORY CIVILIZATION CATEGORIES
                  </h3>
                  <span className="text-[9.5px] text-gray-500 uppercase block mt-1">
                    Divided registers containing persistent user profiles & facts
                  </span>
                </div>

                <div className="space-y-2 max-h-[18rem] overflow-y-auto pr-1 font-mono text-[9px]">
                  {memoryNodes.slice(0, 5).map((mem) => (
                    <div key={mem.id} className="p-2 bg-white/5 rounded-xl border border-white/5 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] bg-cyan-400/10 border border-cyan-400/20 text-cyan-300 px-1.5 py-0.2 rounded font-black uppercase">
                          {mem.category}
                        </span>
                        <span className="text-gray-500 text-[8px]">{mem.timestamp}</span>
                      </div>
                      <p className="text-gray-300 font-sans text-[11px] leading-snug">{mem.content}</p>
                      <div className="flex justify-between items-center text-[7.5px] text-gray-500 pt-0.5 border-t border-white/2">
                        <span>Rank Score: {mem.rankScore}</span>
                        <span>Freq: {mem.frequency}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* TAB 4: SKILLS REGISTRY & PLUGIN MARKETPLACE */}
        {coordinatorTab === "marketplace" && (
          <motion.div
            key="marketplace-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Dual Grid block */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-mono">
              
              {/* Left Block (7 Cols): Autonomous Skill evolution genome */}
              <div className="lg:col-span-8 p-6 border border-white/10 bg-black/45 rounded-2xl backdrop-blur-md space-y-4">
                <div className="border-b border-white/5 pb-2">
                  <h3 className="text-xs uppercase text-cyan-400 font-black tracking-wider">
                    AUTONOMOUS SKILL GENOME DNA EVOLUTION
                  </h3>
                  <span className="text-[9.5px] text-gray-500 uppercase block mt-1 font-mono">
                    Dynamic genome mutation engine. Trigger digital cell evolution to speed up execution speed
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px]">
                  {skillGenomes.map((sk) => (
                    <div 
                      key={sk.id}
                      className="p-4 border border-white/10 bg-[#040810]/90 rounded-2xl space-y-3 flex flex-col justify-between relative overflow-hidden"
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[8px]">
                          <span className={`px-1.5 py-0.5 rounded uppercase font-black tracking-widest ${
                            sk.status === "evolved"
                              ? "bg-fuchsia-400/20 border border-fuchsia-400/30 text-fuchsia-300"
                              : "bg-cyan-500/10 border border-cyan-500/20 text-cyan-300"
                          }`}>
                            {sk.status}
                          </span>
                          <span className="text-gray-500">Confidence: {Math.round(sk.confidence * 100)}%</span>
                        </div>

                        <h4 className="font-extrabold text-[12px] text-white uppercase leading-snug">{sk.task}</h4>
                        
                        <div className="space-y-1 pt-1">
                          <span className="text-[7.5px] text-gray-500 block uppercase font-bold">Execution Workflow Sequence</span>
                          <div className="flex flex-wrap gap-1">
                            {sk.workflow.map((w: string, idx: number) => (
                              <span key={idx} className="bg-white/5 px-2 py-0.5 rounded text-[7.5px] text-gray-400 block border border-white/2 max-w-[12rem] truncate">
                                {idx + 1}. {w}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-white/5 flex flex-col gap-2">
                        <div className="flex justify-between items-center text-[9px] text-gray-400">
                          <span>Speed: <strong className="text-cyan-400">{sk.averageSpeedSec}s</strong></span>
                          <span>Success: <strong className="text-green-400">{sk.successRate}%</strong></span>
                          <span>Attempts: {sk.attempts}</span>
                        </div>
                        
                        <button
                          onClick={() => handleEvolveSkillGenome(sk.id)}
                          className="w-full py-1 bg-gradient-to-r from-fuchsia-600/30 to-cyan-600/30 hover:from-fuchsia-500/40 hover:to-cyan-500/40 border border-fuchsia-400/30 text-white text-[9.5px] uppercase font-black rounded-lg cursor-pointer transition-all"
                        >
                          Helix Gene Mutate DNA
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Block (4 Cols): Hardware plugins toggle */}
              <div className="lg:col-span-4 p-6 border border-white/10 bg-black/45 rounded-2xl backdrop-blur-md space-y-4">
                <div className="border-b border-white/5 pb-2">
                  <h3 className="text-xs uppercase text-cyan-400 font-black tracking-wider">
                    DYNAMIC HARDWARE PLUGINS
                  </h3>
                  <span className="text-[9.5px] text-gray-500 uppercase block mt-1">
                    Hot-patch integrations bypass proxy loops
                  </span>
                </div>

                <div className="space-y-3 font-mono text-[11px] max-h-[20rem] overflow-y-auto pr-1">
                  {skillsRegistry.map(plug => {
                    const isInstalled = plug.installed;
                    return (
                      <div 
                        key={plug.id}
                        className="p-3 border border-white/5 bg-[#03060c] rounded-xl flex items-center justify-between gap-3 text-[10px]"
                      >
                        <div className="space-y-0.5">
                          <span className="text-[7.5px] text-gray-500 uppercase tracking-widest">{plug.category}</span>
                          <h4 className="font-extrabold text-[#fff] text-xs leading-none">{plug.name}</h4>
                        </div>

                        <button
                          onClick={() => handleTogglePlugin(plug.name)}
                          className={`px-2.5 py-1 text-[8px] font-black uppercase rounded border transition-all cursor-pointer ${
                            isInstalled 
                              ? "bg-green-500/10 border-green-500/20 text-green-400" 
                              : "bg-cyan-500 text-black border-transparent font-extrabold"
                          }`}
                        >
                          {isInstalled ? "UNLINK" : "CONNECT"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* TAB 5: ACTION LEDGER & AI CONSTITUTION */}
        {coordinatorTab === "vault" && (
          <motion.div
            key="vault-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Top Grid: Dual Column Security controllers & loop playground */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-mono">
              
              {/* Box A (5 Cols): Constitution sliders */}
              <div className="lg:col-span-5 p-6 border border-white/10 bg-black/45 rounded-2xl backdrop-blur-md space-y-4">
                <div className="border-b border-white/5 pb-2">
                  <h3 className="text-xs uppercase text-cyan-400 font-bold tracking-widest">
                    ADAPTIVE TRUST & BIOMETRICS MESH
                  </h3>
                  <span className="text-[9.5px] text-gray-500 uppercase block mt-1">
                    Verify biometric signatures & devices confidence variables
                  </span>
                </div>

                <div className="space-y-4 text-[10px]">
                  {/* Trust Rating Ring */}
                  <div className="flex items-center gap-4 bg-white/5 p-3 rounded-2xl border border-white/5">
                    <div className="relative w-14 h-14 rounded-full border border-dashed border-cyan-400/40 flex items-center justify-center animate-[pulse_2s_infinite]">
                      <span className="text-sm font-black text-white">{guardianTrust?.cumulativeTrust || 96}%</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-gray-500 uppercase block">Adaptive trust index</span>
                      <strong className="text-[11px] text-[#fff]">COGNITIVE SAFETY LEVEL: OPTIMAL</strong>
                      <span className="text-[8.5px] text-gray-400 block mt-0.5 leading-snug">Cumulative confidence based on signature mesh matching ratios.</span>
                    </div>
                  </div>

                  {/* Adaptive trust sliders */}
                  <div className="space-y-3 pt-2">
                    <span className="text-[8.5px] text-gray-500 block font-bold uppercase">Dynamic Location & Environment Trust</span>
                    <div className="space-y-2">
                      <div className="space-y-0.5">
                        <div className="flex justify-between font-bold text-gray-300">
                          <span>Device Blueprint Accuracy</span>
                          <span className="text-cyan-400">{guardianTrust?.deviceScore || 98}%</span>
                        </div>
                        <input 
                          type="range" min="30" max="100" 
                          value={guardianTrust?.deviceScore || 98} 
                          onChange={(e) => handleSliderSecurityUpdate("device", Number(e.target.value))}
                          className="w-full accent-cyan-400 h-1 bg-white/10 rounded-lg cursor-pointer"
                        />
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex justify-between font-bold text-gray-300">
                          <span>User Behavioral Harmony</span>
                          <span className="text-cyan-400">{guardianTrust?.behaviorScore || 95}%</span>
                        </div>
                        <input 
                          type="range" min="30" max="100" 
                          value={guardianTrust?.behaviorScore || 95} 
                          onChange={(e) => handleSliderSecurityUpdate("behavior", Number(e.target.value))}
                          className="w-full accent-cyan-400 h-1 bg-white/10 rounded-lg cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Biometric sliders */}
                  <div className="space-y-3 pt-2 border-t border-white/5">
                    <span className="text-[8.5px] text-gray-500 block font-bold uppercase">Dynamic Biometric Handshake Scores</span>
                    <div className="space-y-2">
                      <div className="space-y-0.5">
                        <div className="flex justify-between font-bold text-gray-300">
                          <span>Live Face Mesh Ratio</span>
                          <span className="text-fuchsia-400">{guardianBiometrics?.faceMatchScore || 97}%</span>
                        </div>
                        <input 
                          type="range" min="30" max="100" 
                          value={guardianBiometrics?.faceMatchScore || 97} 
                          onChange={(e) => handleSliderSecurityUpdate("face", Number(e.target.value))}
                          className="w-full accent-fuchsia-500 h-1 bg-white/10 rounded-lg cursor-pointer"
                        />
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex justify-between font-bold text-gray-300">
                          <span>Keystroke Rhythm Velocity</span>
                          <span className="text-fuchsia-400">{guardianBiometrics?.typingPatternAccuracy || 91}%</span>
                        </div>
                        <input 
                          type="range" min="30" max="100" 
                          value={guardianBiometrics?.typingPatternAccuracy || 91} 
                          onChange={(e) => handleSliderSecurityUpdate("typing", Number(e.target.value))}
                          className="w-full accent-fuchsia-500 h-1 bg-white/10 rounded-lg cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Box B (7 Cols): Dynamic Thinking Loop panel */}
              <div className="lg:col-span-7 p-6 border border-white/10 bg-black/45 rounded-2xl backdrop-blur-md space-y-4">
                <div className="border-b border-white/5 pb-2">
                  <h3 className="text-xs uppercase text-cyan-400 font-bold tracking-wider">
                    INTERNAL THINKING LOOP PLAYGROUND (Observe ➔ Learn)
                  </h3>
                  <span className="text-[9.5px] text-gray-500 block mt-1">
                    Simulate full cerebral logic cycle before executing computer controllers actions
                  </span>
                </div>

                <div className="space-y-3 text-[11px]">
                  <div className="space-y-1">
                    <span className="text-[8px] text-gray-400 uppercase font-black block">Goal Command</span>
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        value={thinkingGoal}
                        onChange={(e) => setThinkingGoal(e.target.value)}
                        placeholder="Type goal instruction (e.g. Delete target sandbox project variables files)"
                        className="flex-1 px-3 py-1.5 bg-white/5 text-white border border-white/10 focus:border-cyan-400 focus:outline-none rounded-lg text-[11px] select-text font-sans"
                      />
                      <button
                        onClick={handleRunThinkingLoop}
                        disabled={isThinkingInLoop}
                        className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black text-xs uppercase font-extrabold rounded-lg whitespace-nowrap cursor-pointer transition-all disabled:opacity-50 font-mono"
                      >
                        {isThinkingInLoop ? "Thinking..." : "Dispatch Loop"}
                      </button>
                    </div>
                  </div>

                  {/* Thinking loop sequence output console */}
                  <div className="h-44 bg-slate-950/90 rounded-2xl border border-white/5 p-3 overflow-y-auto space-y-2 leading-relaxed">
                    {isThinkingInLoop ? (
                      <div className="text-center py-12 text-cyan-300 animate-pulse uppercase leading-none text-[10px] flex flex-col items-center justify-center gap-2">
                        <Activity size={18} className="animate-spin text-cyan-400" />
                        <span>Brain cortex firing loops sequential neurons processes...</span>
                        <span className="text-[8px] text-gray-500 font-normal">Evaluating Constitution safeguards rules...</span>
                      </div>
                    ) : thinkingLoopResult ? (
                      <div className="space-y-2 font-mono text-[9px]">
                        <span className="text-green-400 block border-b border-white/10 pb-1 font-bold text-[8.5px] uppercase">COGNITIVE PHASES TIMELINE TRANSCRIPT</span>
                        {thinkingLoopResult.logs.map((log, i) => (
                          <div key={i} className="flex gap-2 items-start bg-white/2 p-1.5 rounded border border-white/2">
                            <span className="px-1.5 py-0.2 bg-cyan-950 text-cyan-400 rounded block font-black text-[7.5px] tracking-wide uppercase shrink-0">
                              {log.step}
                            </span>
                            <span className="text-gray-300 text-[10px] font-sans">{log.output}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500 text-[10.5px] uppercase">[Cerebral transcript empty. Click dispatch loop to initiate thinking sequence]</div>
                    )}
                  </div>

                  {/* Reflection Card */}
                  {thinkingLoopResult && !isThinkingInLoop && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-3 bg-fuchsia-950/10 border border-fuchsia-500/25 rounded-2xl grid grid-cols-1 md:grid-cols-4 gap-3 text-[10.5px]"
                    >
                      <div className="md:col-span-1 text-center bg-fuchsia-800/10 border border-fuchsia-500/15 p-2 rounded-xl flex flex-col items-center justify-center">
                        <span className="text-[30px] font-black leading-none text-fuchsia-400">
                          {thinkingLoopResult.reflection.accuracyScore}%
                        </span>
                        <span className="text-[7.5px] text-gray-500 uppercase block tracking-wider mt-1 leading-none">Accuracy Coefficient</span>
                      </div>
                      
                      <div className="md:col-span-3 space-y-1.5 text-left text-[11px]">
                        <div>
                          <span className="text-[8px] text-gray-500 uppercase font-bold block leading-none">Identified Mistake Points</span>
                          <span className="text-red-400 font-sans leading-relaxed block text-[10.5px]">
                            {thinkingLoopResult.reflection.mistake || "No anomalies. Command bounds within nominal tolerances."}
                          </span>
                        </div>
                        <div>
                          <span className="text-[8px] text-gray-500 uppercase font-bold block leading-none">Suggested Structural Improvements</span>
                          <span className="text-green-300 font-sans leading-relaxed block text-[10.5px]">
                            {thinkingLoopResult.reflection.improvement}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                </div>
              </div>

            </div>

            {/* Standard actions persistent table logger */}
            <div className="p-6 border border-white/10 bg-black/45 rounded-2xl backdrop-blur-md space-y-4">
              <h3 className="text-xs font-mono font-bold text-white tracking-widest uppercase flex items-center gap-1.5 border-b border-white/5 pb-2">
                <Database size={13} className="text-cyan-400 animate-pulse" /> Action Memory Ledger Database (actions)
              </h3>

              <div className="overflow-x-auto pr-1">
                <table className="w-full text-left font-mono text-[11px] border-collapse animate-[fadeIn_0.5s_ease-out]">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-400 text-[10px] uppercase">
                      <th className="py-3 px-4">Action ID</th>
                      <th className="py-3 px-4">Goal Path / Task</th>
                      <th className="py-3 px-4">Sequenced Steps</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyLogs.map(row => (
                      <tr 
                        key={row.id}
                        className="border-b border-white/5 hover:bg-white/5 transition-all text-gray-300"
                      >
                        <td className="py-3 px-4 text-cyan-400 select-all font-bold">{row.id}</td>
                        <td className="py-3 px-4 font-sans text-xs text-white uppercase font-semibold">{row.task}</td>
                        <td className="py-3 px-4 max-w-xs truncate font-sans text-xs text-gray-400">{row.steps.join(" → ")}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-block border text-[8px] font-black px-2 py-0.5 rounded uppercase leading-none ${
                            row.success 
                              ? "border-green-500/25 text-green-400 bg-green-500/5" 
                              : "border-red-500/30 text-red-400 bg-red-500/5 animate-pulse"
                          }`}>
                            {row.success ? "SUCCESS" : "FAILED"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right text-gray-500 text-[10px]">{row.timestamp}</td>
                      </tr>
                    ))}

                    {historyLogs.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center py-8 text-gray-500 uppercase">
                          No actions committed to persistent actions workspace yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Identity Verification Check Modal popup */}
      <AnimatePresence>
        {approvalModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setApprovalModalOpen(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md" 
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-[#090d16] border border-red-500/55 rounded-2xl p-6 space-y-6 relative z-10 shadow-[0_0_35px_rgba(239,68,68,0.35)] font-mono text-[11px]"
            >
              <div className="text-center space-y-3">
                <AlertTriangle className="text-red-500 mx-auto animate-bounce" size={40} />
                <h3 className="text-sm font-black text-white tracking-widest uppercase">
                  BIOMETRIC AUTH CHECKPOINT
                </h3>
                <p className="text-gray-400 font-sans leading-normal leading-relaxed">
                  The compiled sequence requests deep desktop system access which bypasses default rules constraints. Advanced security rating score: 87. identity verification required.
                </p>
              </div>

              {/* Fingerprint / Face capture hologram mockup */}
              <div className="p-4 border border-red-500/25 bg-red-500/5 rounded-2xl flex items-center justify-center relative overflow-hidden group select-none">
                <div className="absolute top-0 left-0 w-full bg-red-500 h-[2.5px] animate-[bounce_2s_infinite] opacity-60" />
                <div className="w-16 h-16 rounded-full border border-dashed border-red-500/35 flex items-center justify-center cursor-pointer hover:bg-red-500/10 transition-all">
                  <UserCheck className="text-red-400 group-hover:scale-110 transition-transform duration-300" size={28} />
                </div>
              </div>

              <div className="flex gap-3 uppercase font-bold text-xs select-none">
                <button
                  onClick={() => setApprovalModalOpen(false)}
                  className="flex-1 py-2 border border-white/10 hover:border-white/20 rounded-xl cursor-pointer transition-all text-gray-400"
                >
                  DECLINE
                </button>
                <button
                  onClick={handleApproveGatewayAction}
                  className="flex-1 py-1.5 bg-red-600 hover:bg-red-500 text-white font-extrabold rounded-xl cursor-pointer transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                >
                  CONFIRM ID
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
