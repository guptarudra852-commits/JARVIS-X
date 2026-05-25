import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Cpu,
  Brain,
  Search,
  Wrench,
  Shuffle,
  Activity,
  Zap,
  Eye,
  Workflow,
  Sparkles,
  Database,
  Terminal,
  Play,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

export interface AgentNode {
  id: string;
  name: string;
  role: string;
  status: "idle" | "processing" | "success" | "warning";
  load: number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  model: string;
  latency: number;
  activePathways: string[];
}

export default function AgentNetworkVisualizer() {
  const [nodes, setNodes] = useState<AgentNode[]>([
    {
      id: "coordinator",
      name: "Coordinator Agent",
      role: "Task Router & Priority Queue Controller",
      status: "idle",
      load: 12,
      icon: Shuffle,
      model: "Llama 3.3 70b",
      latency: 18,
      activePathways: ["planner", "system-monitor"]
    },
    {
      id: "planner",
      name: "Planner Agent",
      role: "Goal Decomposer & Pipeline Organizer",
      status: "idle",
      load: 8,
      icon: Workflow,
      model: "Claude 3.5 Sonnet",
      latency: 24,
      activePathways: ["coordinator", "memory"]
    },
    {
      id: "memory",
      name: "Memory Agent",
      role: "Long-term Vector Index Recaller",
      status: "idle",
      load: 5,
      icon: Database,
      model: "Supabase Embed-v3",
      latency: 8,
      activePathways: ["planner", "tool"]
    },
    {
      id: "tool",
      name: "Tool Agent",
      role: "Core API & Safe Shell Sandbox Executer",
      status: "idle",
      load: 0,
      icon: Wrench,
      model: "Node.js VM Core",
      latency: 15,
      activePathways: ["memory", "research"]
    },
    {
      id: "research",
      name: "Research Agent",
      role: "Search Web Retriever & Cite Compiler",
      status: "idle",
      load: 0,
      icon: Search,
      model: "Brave Search Grounding",
      latency: 90,
      activePathways: ["tool", "vision"]
    },
    {
      id: "automation",
      name: "Automation Agent",
      role: "Scheduled Routine & Cron Trigger Guard",
      status: "idle",
      load: 15,
      icon: Zap,
      model: "Cron Runner Daemon",
      latency: 5,
      activePathways: ["coordinator", "system-monitor"]
    },
    {
      id: "vision",
      name: "Vision Agent",
      role: "Visual Tokenizer & Iris Layout Examiner",
      status: "idle",
      load: 0,
      icon: Eye,
      model: "Llama 3.2 Vision",
      latency: 110,
      activePathways: ["research", "system-monitor"]
    },
    {
      id: "system-monitor",
      name: "System Monitor Agent",
      role: "Telemetry Harvester & Performance Audit",
      status: "idle",
      load: 4,
      icon: Activity,
      model: "eBPF Collector",
      latency: 2,
      activePathways: ["coordinator", "automation", "vision"]
    }
  ]);

  const [activePlan, setActivePlan] = useState<{
    goal: string;
    step: number;
    tasks: { text: string; agent: string; status: "pending" | "running" | "done" }[];
  } | null>(null);

  const [simulatedLogs, setSimulatedLogs] = useState<string[]>([]);
  const [neuralPulse, setNeuralPulse] = useState(false);

  // Trigger continuous telemetry and agent simulation ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setNodes((prevNodes) =>
        prevNodes.map((node) => {
          // Fluctuates load factors randomly
          const loadFluc = Math.floor(Math.random() * 10) - 5;
          const nextLoad = Math.max(0, Math.min(99, node.load + loadFluc));

          // Occasionally trigger node pings
          let nextStatus: "idle" | "processing" | "success" | "warning" = node.status;
          if (Math.random() > 0.85) {
            nextStatus = "processing";
            setTimeout(() => {
              setNodes((nowNodes) =>
                nowNodes.map((n) => (n.id === node.id ? { ...n, status: "success" } : n))
              );
              setTimeout(() => {
                setNodes((nowNodes) =>
                  nowNodes.map((n) => (n.id === node.id ? { ...n, status: "idle" } : n))
                );
              }, 800);
            }, 1200);
          }

          return {
            ...node,
            load: node.status === "idle" ? nextLoad : node.load,
            status: nextStatus
          };
        })
      );
      setNeuralPulse(true);
      setTimeout(() => setNeuralPulse(false), 300);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  // Run autonomous goal pipeline execution simulator
  const runAutonomousPlan = (goalName: string) => {
    const planMap = {
      diagnose: [
        { text: "Route diagnostic signals to all 8 operational cores", agent: "coordinator", status: "pending" as const },
        { text: "Decompose telemetry metrics into historical profiles", agent: "planner", status: "pending" as const },
        { text: "Fetch past calibration vectors & safety boundaries", agent: "memory", status: "pending" as const },
        { text: "Verify local sandbox runtime filesystem integrity", agent: "tool", status: "pending" as const },
        { text: "Collect real-time CPU, Memory, and Network latency logs", agent: "system-monitor", status: "pending" as const }
      ],
      optimize: [
        { text: "Inspect server-side API responses & latency constraints", agent: "coordinator", status: "pending" as const },
        { text: "Optimize cache parameters for next-gen models", agent: "planner", status: "pending" as const },
        { text: "Recalibrate persistent context embeddings thresholds", agent: "memory", status: "pending" as const },
        { text: "Garbage collect inactive background process threads", agent: "automation", status: "pending" as const },
        { text: "Deploy active tactical hyperdrive operational mode", agent: "system-monitor", status: "pending" as const }
      ]
    }[goalName === "diagnose" ? "diagnose" : "optimize"];

    setActivePlan({
      goal: goalName === "diagnose" ? "Mainframe Diagnostic Pipeline v4.2" : "System Cache & Computational Optimization",
      step: 0,
      tasks: planMap
    });

    setSimulatedLogs([`[COORDINATOR] Initiating objective: ${goalName.toUpperCase()}`, `[PLANNER] Splitting target into ${planMap.length} specific workflows`]);

    // Sequence simulation step-by-step
    let currentStep = 0;
    const processStep = () => {
      if (currentStep >= planMap.length) {
        setTimeout(() => {
          setActivePlan(null);
          setSimulatedLogs((p) => [...p, `[COORDINATOR] ALL JOBS COMPLETED GREEN. Standby.`]);
        }, 1500);
        return;
      }

      const activeTask = planMap[currentStep];
      
      // Update task as running and elevate corresponding agent load
      setActivePlan((prev) => {
        if (!prev) return null;
        const newTasks = [...prev.tasks];
        newTasks[currentStep] = { ...newTasks[currentStep], status: "running" };
        return { ...prev, step: currentStep, tasks: newTasks };
      });

      setNodes((prevNodes) =>
        prevNodes.map((node) =>
          node.id === activeTask.agent ? { ...node, status: "processing", load: 85 } : node
        )
      );

      setSimulatedLogs((p) => [
        ...p,
        `[${activeTask.agent.toUpperCase()}] Running: "${activeTask.text}"`
      ]);

      setTimeout(() => {
        // Complete current step
        setActivePlan((prev) => {
          if (!prev) return null;
          const newTasks = [...prev.tasks];
          newTasks[currentStep] = { ...newTasks[currentStep], status: "done" };
          return { ...prev, step: currentStep + 1, tasks: newTasks };
        });

        setNodes((prevNodes) =>
          prevNodes.map((node) =>
            node.id === activeTask.agent ? { ...node, status: "success", load: 35 } : node
          )
        );

        setSimulatedLogs((p) => [
          ...p,
          `[${activeTask.agent.toUpperCase()}] ✓ Completed with stability check.`
        ]);

        currentStep++;
        setTimeout(processStep, 1000);
      }, 1400);
    };

    setTimeout(processStep, 1200);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Visual map nodes layout */}
      <div className="lg:col-span-2 border border-cyan-500/10 bg-black/45 backdrop-blur-md rounded-2xl p-6 relative overflow-hidden">
        {/* Futuristic Grid Overlays */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(6,182,212,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="absolute top-0 right-0 p-3 flex items-center gap-2">
          <span className="text-[9px] font-mono uppercase text-slate-500 tracking-widest font-black">Agent Network Link</span>
          <span className={`w-2 h-2 rounded-full ${neuralPulse ? "bg-cyan-400 scale-125 shadow-[0_0_8px_rgba(6,182,212,0.8)]" : "bg-cyan-500/30"} transition-all duration-200`} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 relative z-10 mt-4">
          {nodes.map((node) => {
            const IconComponent = node.icon;
            const isTargetNode = activePlan?.tasks[activePlan.step]?.agent === node.id;

            return (
              <motion.div
                key={node.id}
                layout
                className={`p-4 rounded-xl border transition-all duration-300 relative flex flex-col justify-between overflow-hidden shadow-lg ${
                  node.status === "processing" || isTargetNode
                    ? "border-cyan-400 bg-cyan-950/25 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                    : node.status === "success"
                    ? "border-emerald-500/30 bg-emerald-950/10"
                    : "border-cyan-500/10 bg-slate-900/15"
                }`}
              >
                {/* Glowing Aura inside active element */}
                {(node.status === "processing" || isTargetNode) && (
                  <motion.div
                    className="absolute inset-0 bg-cyan-400/5 pointer-events-none"
                    animate={{ opacity: [0.1, 0.3, 0.1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                )}

                <div className="flex items-start justify-between">
                  <div className={`p-2 rounded-lg ${
                    node.status === "processing" || isTargetNode
                      ? "bg-cyan-500 text-black shadow-[0_0_8px_rgba(6,182,212,0.6)]"
                      : "bg-cyan-950/30 text-cyan-400"
                  }`}>
                    <IconComponent size={15} />
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] font-mono text-slate-500 uppercase font-bold">LOAD</span>
                    <span className={`block text-xs font-mono font-black ${
                      node.load > 75 ? "text-fuchsia-400" : "text-cyan-300"
                    }`}>{node.load}%</span>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="text-xs font-sans font-black uppercase text-white tracking-wide truncate">{node.name}</h3>
                  <p className="text-[9px] font-mono text-slate-400 mt-1 line-clamp-2 leading-relaxed h-8">{node.role}</p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-cyan-500/10 flex items-center justify-between text-[8px] font-mono text-slate-500 max-w-full">
                  <span className="truncate">{node.model}</span>
                  <span className="text-cyan-400/80 font-bold shrink-0">{node.latency}ms</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Visual Link Pathways Diagram */}
        <div className="mt-6 flex flex-wrap gap-2 items-center bg-cyan-950/10 border border-cyan-500/10 p-4 rounded-xl text-[9px] font-mono text-cyan-400/70">
          <Cpu size={12} className="text-cyan-400 animate-spin" />
          <span className="font-extrabold uppercase shrink-0 text-cyan-300 text-[10px] tracking-wider">ACTIVE LINK MATRIX:</span>
          <span className="truncate">
            {nodes.flatMap((node) => node.activePathways.map((dest) => `${node.id.toUpperCase()} ⟷ ${dest.toUpperCase()}`)).slice(0, 6).join(" | ")}...
          </span>
        </div>
      </div>

      {/* Autonomous plan execution progress HUD */}
      <div className="flex flex-col gap-6">
        {/* Dynamic Console Controls & Automation triggers */}
        <div className="border border-cyan-500/10 bg-black/45 backdrop-blur-md rounded-2xl p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-cyan-500/10 pb-3">
              <span className="text-[10px] font-mono uppercase text-cyan-400 tracking-widest font-black flex items-center gap-1.5">
                <Workflow size={12} className="text-cyan-400" /> Goal Planner Suite
              </span>
              <span className="text-[8px] text-fuchsia-400 border border-fuchsia-500/20 px-1.5 py-0.5 rounded bg-fuchsia-950/10 uppercase tracking-widest font-mono font-bold">Autonomous</span>
            </div>

            <div className="mt-4 space-y-3">
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                Trigger multi-agent orchestration flows below. The **Coordinator Agent** will trigger to balance subroutines, schedule memory rankings, and compile reports.
              </p>

              <div className="grid grid-cols-2 gap-2 mt-4">
                <button
                  onClick={() => runAutonomousPlan("diagnose")}
                  disabled={!!activePlan}
                  className="px-3 py-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-black font-semibold rounded-lg font-mono text-[9px] uppercase tracking-wider transition-all shadow-[0_0_10px_rgba(6,182,212,0.2)] hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer flex items-center justify-center gap-1"
                >
                  <Play size={10} className="fill-black" /> System Diagnostics
                </button>
                <button
                  onClick={() => runAutonomousPlan("optimize")}
                  disabled={!!activePlan}
                  className="px-3 py-2 bg-fuchsia-500 hover:bg-fuchsia-400 disabled:opacity-40 text-white font-semibold rounded-lg font-mono text-[9px] uppercase tracking-wider transition-all shadow-[0_0_10px_rgba(217,70,239,0.2)] hover:shadow-[0_0_15px_rgba(217,70,239,0.4)] cursor-pointer flex items-center justify-center gap-1"
                >
                  <Sparkles size={10} /> Shift Optimization
                </button>
              </div>
            </div>
          </div>

          {/* Active goals list pipeline */}
          <div className="mt-6 pt-6 border-t border-cyan-500/10">
            <AnimatePresence mode="wait">
              {activePlan ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="flex justify-between items-center text-[10px] font-mono uppercase">
                    <span className="font-extrabold text-cyan-300">Active Blueprint:</span>
                    <span className="text-fuchsia-400 font-bold animate-pulse">Running</span>
                  </div>
                  <h4 className="text-xs font-sans font-black uppercase text-slate-150 tracking-wide">{activePlan.goal}</h4>

                  <div className="space-y-2 mt-3 text-[10px] font-mono">
                    {activePlan.tasks.map((task, i) => (
                      <div
                        key={i}
                        className={`flex items-start gap-2.5 p-2 rounded border transition-colors ${
                          task.status === "running"
                            ? "bg-cyan-500/10 border-cyan-400/40 text-cyan-200"
                            : task.status === "done"
                            ? "bg-emerald-500/5 border-emerald-500/15 text-emerald-400/80"
                            : "bg-slate-900/20 border-white/5 text-slate-500"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full mt-1 shrink-0 ${
                          task.status === "running"
                            ? "bg-cyan-400 animate-ping"
                            : task.status === "done"
                            ? "bg-emerald-500"
                            : "bg-slate-600"
                        }`} />
                        <div className="flex-1">
                          <p className="font-sans leading-relaxed text-xs">{task.text}</p>
                          <span className="text-[8px] tracking-wider text-slate-400 uppercase font-black">Agent: {task.agent}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-6 text-center"
                >
                  <CheckCircle size={28} className="text-cyan-500/20 mb-2 animate-pulse" />
                  <p className="text-[10px] font-mono uppercase text-slate-500 tracking-wider">Plan Queue Empty</p>
                  <p className="text-[9px] font-sans text-slate-600 mt-1">Ready to receive command pipeline injections.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Real telemetry system console logger feed */}
        <div className="border border-cyan-500/10 bg-black/45 backdrop-blur-md rounded-2xl p-6 h-56 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-cyan-500/10 pb-2">
            <span className="text-[10px] font-mono uppercase text-cyan-400 tracking-widest font-bold flex items-center gap-1.5">
              <Terminal size={12} className="text-cyan-400" /> Operational Agent Logs
            </span>
          </div>

          <div className="flex-1 mt-2 overflow-y-auto font-mono text-[9px] space-y-1.5 pr-2 scrollbar-thin text-stone-350">
            {simulatedLogs.length > 0 ? (
              simulatedLogs.map((log, index) => (
                <div key={index} className="leading-relaxed border-l-2 border-cyan-500/20 pl-1.5">
                  <span className="text-slate-500 select-none">[{new Date().toLocaleTimeString([], { hour12: false })}]</span> {log}
                </div>
              ))
            ) : (
              <div className="text-slate-600 italic py-8 text-center text-[10px]">
                No active log buffers compiled in the current session.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
