import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import AgentNetworkVisualizer from "../AgentNetworkVisualizer";
import {
  Activity,
  Cpu,
  RefreshCw,
  Search,
  Filter,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader,
  Play,
  RotateCcw,
  Maximize2,
  ChevronDown,
  ChevronUp,
  Zap,
  Sliders,
  Database,
  Layers,
  Sparkles,
  Radio,
  Plus,
  Trash2,
  Minimize2,
  Sun,
  CloudLightning,
  Workflow,
  MousePointerClick,
  Terminal,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Lock,
  Unlock
} from "lucide-react";

interface SystemProcess {
  id: string;
  name: string;
  category: "neural" | "memory" | "telemetry" | "network";
  status: "active" | "standby" | "stalled";
  load: number;
  latency: string;
}

interface TaskPipelineItem {
  id: string;
  taskName: string;
  status: "pending" | "processing" | "completed";
  agent: string;
  progress: number;
}

export interface SecurityIncident {
  id: string;
  timestamp: string;
  type: "CRITICAL" | "WARNING" | "INFO";
  message: string;
  source: string;
}

export default function Dashboard() {
  const [cpuLoad, setCpuLoad] = useState(45);
  const [memoryLoad, setMemoryLoad] = useState(62);
  const [gpuLoad, setGpuLoad] = useState(38);
  const [coreTemp, setCoreTemp] = useState(36.5);
  const [isHyperDrive, setIsHyperDrive] = useState(false);
  const [selectedWidgetCategory, setSelectedWidgetCategory] = useState<string>("all");
  const [isCoreProcessing, setIsCoreProcessing] = useState(false);
  const [dragEnabled, setDragEnabled] = useState(true);

  // Security logs states
  const [securityIncidents, setSecurityIncidents] = useState<SecurityIncident[]>([
    { id: "sec-1", timestamp: "10:14:02", type: "CRITICAL", message: "Flagged replay hack attempt with revoked refresh token key.", source: "192.168.12.98" },
    { id: "sec-2", timestamp: "10:11:15", type: "WARNING", message: "Threshold breach: 12 rapid synapse queries from unregistered agent endpoint.", source: "10.0.4.52" },
    { id: "sec-3", timestamp: "10:08:44", type: "INFO", message: "Intrusion protection system definitions synchronized (v5.4.1).", source: "Mainframe" },
  ]);
  const [threatLevel, setThreatLevel] = useState<"STEADY" | "ELEVATED" | "CRITICAL">("ELEVATED");
  const [ipsActive, setIpsActive] = useState(true);
  const [activeBlocks, setActiveBlocks] = useState(14);

  // Processes state
  const [processes, setProcesses] = useState<SystemProcess[]>([
    { id: "p-1", name: "Synaptic Core Linkage", category: "neural", status: "active", load: 78, latency: "0.02ms" },
    { id: "p-2", name: "Core Semantic Tokenizer", category: "neural", status: "active", load: 92, latency: "0.25ms" },
    { id: "p-3", name: "Dynamic Dialogue Cache", category: "memory", status: "active", load: 43, latency: "0.01ms" },
    { id: "p-4", name: "Scraping Grounder Indexer", category: "network", status: "standby", load: 0, latency: "1.20ms" },
    { id: "p-5", name: "Continuous Speech Encoder", category: "telemetry", status: "active", load: 15, latency: "0.12ms" },
  ]);

  // Task Queue state
  const [customTaskInput, setCustomTaskInput] = useState("");
  const [tasks, setTasks] = useState<TaskPipelineItem[]>([
    { id: "t-1", taskName: "Analyze neural response vectors", status: "completed", agent: "Core Link", progress: 100 },
    { id: "t-2", taskName: "Grounding report: search news index", status: "processing", agent: "Scraper Unit", progress: 45 },
    { id: "t-3", taskName: "Synergize spatial weather metrics", status: "pending", agent: "Telemetry Hub", progress: 0 },
  ]);

  // Spatial current goals list
  const [goals, setGoals] = useState([
    { id: "g-1", text: "Maintain mainframe network load < 85%", completed: true },
    { id: "g-2", text: "Process pending user prompt queues", completed: false },
    { id: "g-3", text: "Calibrate system speech synthesizers", completed: false },
  ]);

  const [newGoalInput, setNewGoalInput] = useState("");

  // Simulated live fluctuating telemetry feed
  useEffect(() => {
    const interval = setInterval(() => {
      // Fluctuates load factors
      setCpuLoad((prev) => {
        const factor = isHyperDrive ? 88 : prev;
        const delta = Math.floor(Math.random() * 7) - 3;
        return Math.max(10, Math.min(99, factor + delta));
      });
      setMemoryLoad((prev) => {
        const factor = isHyperDrive ? 94 : prev;
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.max(10, Math.min(99, factor + delta));
      });
      setGpuLoad((prev) => {
        const factor = isHyperDrive ? 82 : prev;
        const delta = Math.floor(Math.random() * 9) - 4;
        return Math.max(10, Math.min(99, factor + delta));
      });
      setCoreTemp((prev) => {
        const base = isHyperDrive ? 55 : 36.5;
        const delta = parseFloat((Math.random() * 0.4 - 0.2).toFixed(1));
        return Math.max(30, Math.min(85, base + delta));
      });

      // Advance processing task queue randomly
      setTasks((prevTasks) =>
        prevTasks.map((t) => {
          if (t.status === "processing") {
            const nextProgress = t.progress + Math.floor(Math.random() * 20) + 10;
            if (nextProgress >= 100) {
              return { ...t, status: "completed", progress: 100 };
            }
            return { ...t, progress: nextProgress };
          }
          if (t.status === "pending" && Math.random() > 0.6) {
            // Kickstart next pending task
            return { ...t, status: "processing", progress: 10 };
          }
          return t;
        })
      );
    }, 2500);

    return () => clearInterval(interval);
  }, [isHyperDrive]);

  // Real-time security incident generator
  useEffect(() => {
    const generatorInterval = setInterval(() => {
      if (!ipsActive) return;

      const sources = ["192.168.1.104", "10.0.0.8", "45.130.22.11", "203.0.113.14", "172.16.254.1", "Web-Gateway", "BullMQ-Pool"];
      const messages = [
        { msg: "Bruteforce attempt blocked: failed SSH authentication on node delta-4.", type: "WARNING" },
        { msg: "API rate limit throttled on unregistered agent webhook request.", type: "INFO" },
        { msg: "SQL injection threat structural pattern detected in query body.", type: "CRITICAL" },
        { msg: "Credential replay reuse flagged in authorization token rotator.", type: "CRITICAL" },
        { msg: "S.H.I.E.L.D system sensor network reported out of bounds response headers.", type: "WARNING" },
        { msg: "Automated vulnerability crawler identified and blacklisted instantly.", type: "INFO" },
        { msg: "Mainframe kernel socket experienced transient connection reset.", type: "WARNING" }
      ];

      const chosen = messages[Math.floor(Math.random() * messages.length)];
      const chosenSrc = sources[Math.floor(Math.random() * sources.length)];
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];

      const newLog: SecurityIncident = {
        id: `sec-${Date.now()}`,
        timestamp: timeStr,
        type: chosen.type as any,
        message: chosen.msg,
        source: chosenSrc
      };

      setSecurityIncidents(prev => [newLog, ...prev.slice(0, 19)]);

      if (chosen.type === "CRITICAL" || chosen.type === "WARNING") {
        setActiveBlocks(prev => prev + 1);
      }

      if (chosen.type === "CRITICAL") {
        setThreatLevel("CRITICAL");
        setTimeout(() => {
          setThreatLevel(prev => prev === "CRITICAL" ? "ELEVATED" : prev);
        }, 5000);
      }
    }, 12000); // simulated event every 12 seconds

    return () => clearInterval(generatorInterval);
  }, [ipsActive]);

  const triggerManualIncident = (type: "CRITICAL" | "WARNING" | "INFO") => {
    const messages = {
      CRITICAL: "CRITICAL: Detected buffer overflow trace in central semantic vector parsing stack.",
      WARNING: "WARNING: High threshold packet latency on web server root gateway.",
      INFO: "INFO: System security database snapshot backup generated successfully."
    };
    const sources = {
      CRITICAL: "Malicious-Client [45.89.2.100]",
      WARNING: "Gateway-Router [10.0.1.1]",
      INFO: "Local-Backup-Scheduler"
    };

    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];

    const newLog: SecurityIncident = {
      id: `sec-man-${Date.now()}`,
      timestamp: timeStr,
      type: type,
      message: messages[type],
      source: sources[type]
    };

    setSecurityIncidents(prev => [newLog, ...prev]);
    
    let mappedLevel: "STEADY" | "ELEVATED" | "CRITICAL" = "STEADY";
    if (type === "CRITICAL") mappedLevel = "CRITICAL";
    else if (type === "WARNING") mappedLevel = "ELEVATED";
    
    setThreatLevel(mappedLevel);

    if (type === "CRITICAL" || type === "WARNING") {
      setActiveBlocks(prev => prev + 1);
    }

    if (type === "CRITICAL") {
      setTimeout(() => {
        setThreatLevel(prev => prev === "CRITICAL" ? "ELEVATED" : prev);
      }, 5000);
    }
  };

  // Main task process runner
  const triggerCoreTaskLoop = () => {
    setIsCoreProcessing(true);
    // Restart all tasks to process them again
    setTasks((prev) =>
      prev.map((t) => ({ ...t, status: t.id === "t-1" ? "processing" : "pending", progress: 0 }))
    );
    setTimeout(() => {
      setIsCoreProcessing(false);
    }, 4500);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTaskInput.trim()) return;
    const newTask: TaskPipelineItem = {
      id: `t-${Math.random()}`,
      taskName: customTaskInput,
      status: "pending",
      agent: "Tactical Agent",
      progress: 0,
    };
    setTasks((prev) => [...prev, newTask]);
    setCustomTaskInput("");
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalInput.trim()) return;
    setGoals((prev) => [...prev, { id: `g-${Math.random()}`, text: newGoalInput, completed: false }]);
    setNewGoalInput("");
  };

  const handleToggleGoal = (id: string) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g))
    );
  };

  const handleToggleAgent = (id: string) => {
    setProcesses((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextStatus = p.status === "active" ? "standby" : "active";
          return {
            ...p,
            status: nextStatus,
            load: nextStatus === "active" ? Math.floor(Math.random() * 30) + 20 : 0,
          };
        }
        return p;
      })
    );
  };

  // State controls for individual widget maximize popup
  const [maximizedWidget, setMaximizedWidget] = useState<string | null>(null);

  const toggleMaximize = (widgetId: string) => {
    setMaximizedWidget(maximizedWidget === widgetId ? null : widgetId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 text-white space-y-8 select-none relative">
      
      {/* 1. FUTURISTIC DASHBOARD TOP CONTROL HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <h1 className="text-2xl font-sans font-black tracking-widest text-white flex items-center gap-3">
            <Activity className="text-cyan-400 animate-pulse shrink-0" size={24} /> 
            <span>DIAGNOSTIC EXECUTIVE CONTROL</span>
          </h1>
          <p className="text-[10px] font-mono text-cyan-400/60 mt-0.5 uppercase tracking-widest">
            SYNAPTIC AI OPERATING PROCESSES AND TELEMETRY MATRIX
          </p>
        </div>

        {/* Operating status banner & Overclock trigger */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Draggable system instructions indicator */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-900/30 border border-white/10 px-3 py-1.5 rounded-lg text-[9px] font-mono text-slate-400 uppercase">
            <Sliders size={12} className="text-cyan-400" />
            <span>Interactive Drag Grid</span>
            <input 
              type="checkbox" 
              checked={dragEnabled} 
              onChange={(e) => setDragEnabled(e.target.checked)} 
              className="accent-cyan-400 ml-1.5 cursor-pointer"
              title="Toggle draggable widget features"
            />
          </div>

          <button
            onClick={() => setIsHyperDrive(!isHyperDrive)}
            className={`px-4 py-2 border font-mono text-[9px] font-black uppercase rounded-lg transition-all duration-300 flex items-center gap-2 cursor-pointer ${
              isHyperDrive
                ? "bg-red-500/20 text-red-400 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.4)] animate-pulse"
                : "bg-cyan-500/10 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/20 hover:shadow-[0_0_12px_rgba(6,182,212,0.2)]"
            }`}
          >
            <CloudLightning size={11} className={isHyperDrive ? "animate-bounce" : ""} />
            <span>{isHyperDrive ? "OVERCLOCK OVERLOADED" : "REGULATE BASEROOT"}</span>
          </button>

          <button
            onClick={() => {
              setCpuLoad(43);
              setMemoryLoad(61);
              setGpuLoad(32);
              setIsHyperDrive(false);
            }}
            className="p-2 border border-white/10 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer transition-all"
            title="Reset telemetry loops"
          >
            <RotateCcw size={12} />
          </button>
        </div>
      </div>

      {/* 2. DYNAMIC LAYOUT OF ACTIVE OPERATIONAL DIALS & GAUGES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric Card 1: CPU load */}
        <motion.div
          drag={dragEnabled}
          dragConstraints={{ left: -5, right: 5, top: -5, bottom: 5 }}
          dragElastic={0.05}
          className="p-5 border border-white/10 bg-slate-950/35 rounded-xl backdrop-blur-md relative overflow-hidden group hover:border-cyan-500/30 transition-all cursor-grab active:cursor-grabbing"
        >
          {/* Subtle graph scanline decoration */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-400/2 rounded-full blur-2xl group-hover:bg-cyan-400/5 transition-all" />
          <div className="flex justify-between items-center text-slate-500 font-mono text-[8px] tracking-wider uppercase mb-3">
            <span>[Node 01] CORE CPU LOAD</span>
            <Cpu size={12} className="text-cyan-400 animate-pulse" />
          </div>
          <div className="flex items-baseline gap-1.5 mb-1.5">
            <span className="text-3xl font-sans font-black tracking-tight text-white">{cpuLoad}</span>
            <span className="text-[10px] text-cyan-400 font-mono font-bold">% load</span>
          </div>
          {/* Filling progress line */}
          <div className="h-1.5 w-full bg-slate-800/50 border border-white/5 rounded-full overflow-hidden mb-2">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-cyan-300 transition-all duration-700"
              style={{ width: `${cpuLoad}%` }}
            />
          </div>
          <div className="flex justify-between font-mono text-[7.5px] text-slate-500">
            <span>TEMP: {coreTemp}°C</span>
            <span className={isHyperDrive ? "text-red-400" : "text-green-400"}>
              {isHyperDrive ? "OVERCLOCK ACTIVE" : "REGULATED"}
            </span>
          </div>
        </motion.div>

        {/* Metric Card 2: Neural Memory Buffer */}
        <motion.div
          drag={dragEnabled}
          dragConstraints={{ left: -5, right: 5, top: -5, bottom: 5 }}
          dragElastic={0.05}
          className="p-5 border border-white/10 bg-slate-950/35 rounded-xl backdrop-blur-md relative overflow-hidden group hover:border-fuchsia-500/30 transition-all cursor-grab active:cursor-grabbing"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-fuchsia-400/2 rounded-full blur-2xl group-hover:bg-fuchsia-400/5 transition-all" />
          <div className="flex justify-between items-center text-slate-500 font-mono text-[8px] tracking-wider uppercase mb-3">
            <span>[Node 02] SYNAPSE RAM</span>
            <Database size={12} className="text-fuchsia-400 animate-pulse" />
          </div>
          <div className="flex items-baseline gap-1.5 mb-1.5">
            <span className="text-3xl font-sans font-black tracking-tight text-white">{memoryLoad}</span>
            <span className="text-[10px] text-fuchsia-400 font-mono font-bold">% index</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800/50 border border-white/5 rounded-full overflow-hidden mb-2">
            <div 
              className="h-full bg-gradient-to-r from-fuchsia-500 to-fuchsia-300 transition-all duration-700"
              style={{ width: `${memoryLoad}%` }}
            />
          </div>
          <div className="flex justify-between font-mono text-[7.5px] text-slate-500">
            <span>INDEX_CAP: 4096 YB</span>
            <span>BUSY</span>
          </div>
        </motion.div>

        {/* Metric Card 3: GPU Accelerators load */}
        <motion.div
          drag={dragEnabled}
          dragConstraints={{ left: -5, right: 5, top: -5, bottom: 5 }}
          dragElastic={0.05}
          className="p-5 border border-white/10 bg-slate-950/35 rounded-xl backdrop-blur-md relative overflow-hidden group hover:border-emerald-500/30 transition-all cursor-grab active:cursor-grabbing"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-400/2 rounded-full blur-2xl group-hover:bg-emerald-400/5 transition-all" />
          <div className="flex justify-between items-center text-slate-500 font-mono text-[8px] tracking-wider uppercase mb-3">
            <span>[Node 03] EMBEDDING GPU</span>
            <Layers size={12} className="text-emerald-400 animate-pulse" />
          </div>
          <div className="flex items-baseline gap-1.5 mb-1.5">
            <span className="text-3xl font-sans font-black tracking-tight text-white">{gpuLoad}</span>
            <span className="text-[10px] text-emerald-400 font-mono font-bold">% load</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800/50 border border-white/5 rounded-full overflow-hidden mb-2">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-300 transition-all duration-700"
              style={{ width: `${gpuLoad}%` }}
            />
          </div>
          <div className="flex justify-between font-mono text-[7.5px] text-slate-500">
            <span>CORES: 32 ACTIVE</span>
            <span>ENGAGED</span>
          </div>
        </motion.div>

        {/* Metric Card 4: AI Response Micro-latency scale */}
        <motion.div
          drag={dragEnabled}
          dragConstraints={{ left: -5, right: 5, top: -5, bottom: 5 }}
          dragElastic={0.05}
          className="p-5 border border-white/10 bg-slate-950/35 rounded-xl backdrop-blur-md relative overflow-hidden group hover:border-amber-500/30 transition-all cursor-grab active:cursor-grabbing"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/2 rounded-full blur-2xl group-hover:bg-amber-400/5 transition-all" />
          <div className="flex justify-between items-center text-slate-500 font-mono text-[8px] tracking-wider uppercase mb-3">
            <span>[Node 04] NEURAL VECTOR SPEED</span>
            <Sparkles size={12} className="text-amber-400 animate-pulse" />
          </div>
          <div className="flex items-baseline gap-1.5 mb-1.5">
            <span className="text-3xl font-sans font-black tracking-tight text-white">
              {(0.02 + (cpuLoad / 300)).toFixed(2)}
            </span>
            <span className="text-[10px] text-amber-400 font-mono font-bold">ms lat</span>
          </div>
          {/* Micro signal graphic lines ticker representing speed oscillations */}
          <div className="flex items-center gap-1.5 h-4 mb-2">
            {Array.from({ length: 14 }).map((_, i) => {
              const h = Math.abs(Math.sin(i * 1.5)) * 100;
              return (
                <div 
                  key={i} 
                  className="w-[2.5px] bg-amber-500/40 rounded-full transition-all duration-300"
                  style={{ height: `${20 + h * 0.7}%` }}
                />
              );
            })}
          </div>
          <div className="flex justify-between font-mono text-[7.5px] text-slate-500">
            <span>SPEED ACCURACY RATIO</span>
            <span className="text-amber-400 font-black">99.98%</span>
          </div>
        </motion.div>
      </div>

      {/* MULTI-AGENT NEURAL ORCHESTRATION PIPELINE */}
      <div className="space-y-4">
        <div className="flex flex-col border-b border-white/5 pb-2">
          <h2 className="text-sm font-mono font-bold tracking-widest text-cyan-400 block uppercase">
            [SYSTEM SUB-CORES] Autonomous Multi-Agent Grid
          </h2>
          <span className="text-[9px] font-mono text-slate-500 uppercase mt-0.5">
            Realtime 24/7 background task balance & model decision logs
          </span>
        </div>
        <AgentNetworkVisualizer />
      </div>

      {/* 3. CORE ADAPTIVE WORKSPACE GRID WITH INTERACTIVE CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Card Panel A: Draggable AI Agent Commander */}
        <motion.div
          drag={dragEnabled}
          dragConstraints={{ left: -10, right: 10, top: -10, bottom: 10 }}
          dragElastic={0.02}
          className="lg:col-span-2 p-5 border border-white/10 bg-black/40 rounded-xl backdrop-blur-md relative flex flex-col justify-between"
        >
          {/* HUD Target markers */}
          <div className="absolute top-2 right-2 flex gap-1 z-10">
            <button 
              onClick={() => toggleMaximize("commander")} 
              className="p-1 hover:bg-white/5 border border-white/10 rounded cursor-pointer text-slate-400 hover:text-white"
              title="Full screen widget"
            >
              <Maximize2 size={11} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold tracking-widest text-[#22d3ee] flex items-center gap-2">
                <Workflow size={13} className="text-cyan-400 animate-spin" /> ACTIVE COGNITIVE CORES
              </span>
              <span className="text-[8px] font-mono text-slate-500 uppercase">TELEMETRY_SECURE // OK</span>
            </div>

            {/* Quick Process grid filter */}
            <div className="flex gap-2">
              {["all", "neural", "memory", "network"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedWidgetCategory(cat)}
                  className={`px-2.5 py-1 text-[8px] font-mono font-bold rounded uppercase border cursor-pointer transition-all ${
                    selectedWidgetCategory === cat
                      ? "bg-cyan-500 border-cyan-400 text-black shadow-[0_0_8px_rgba(6,182,212,0.3)]"
                      : "border-white/10 text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {cat}_THS
                </button>
              ))}
            </div>

            {/* Simulated Live status components */}
            <div className="space-y-2">
              {processes
                .filter((p) => selectedWidgetCategory === "all" || p.category === selectedWidgetCategory)
                .map((proc) => (
                  <div
                    key={proc.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-slate-900/35 border border-white/5 hover:border-white/15 rounded-lg transition-all text-xs font-mono relative group"
                  >
                    <div className="flex items-center gap-3">
                      <span 
                        className={`w-1.5 h-1.5 rounded-full ${
                          proc.status === "active" ? "bg-green-400 shadow-[0_0_6px_#4ade80]" : "bg-yellow-400"
                        }`} 
                      />
                      <div>
                        <span className="block font-semibold text-white tracking-wide">{proc.name}</span>
                        <span className="inline-block px-1.5 py-0.5 bg-white/5 text-[8px] font-normal text-slate-500 rounded mt-0.5 uppercase tracking-wider">
                          {proc.category} node
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-5 mt-2 sm:mt-0 text-[10px]">
                      <div className="text-right">
                        <span className="block text-[7px] text-zinc-500">ACCY</span>
                        <span className="block font-bold text-cyan-400">99.2%</span>
                      </div>
                      <div className="text-right">
                        <span className="block text-[7px] text-zinc-500">LOAD</span>
                        <span className="block font-bold text-slate-300">{proc.status === "active" ? proc.load : 0}%</span>
                      </div>
                      <button
                        onClick={() => handleToggleAgent(proc.id)}
                        className={`px-2.5 py-0.5 border text-[8px] rounded uppercase font-bold cursor-pointer transition-all ${
                          proc.status === "active"
                            ? "border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10"
                            : "border-green-500/30 text-green-400 hover:bg-green-500/10"
                        }`}
                      >
                        {proc.status === "active" ? "STALL" : "LAUNCH"}
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="text-[8px] font-mono text-slate-500 flex justify-between items-center mt-5 pt-3 border-t border-white/5">
            <span>JARVIS SYNAPTIC ARRAY CORE COGNIZANCE</span>
            <span className="flex items-center gap-1"><MousePointerClick size={10} /> Drag to adjust layout spacing</span>
          </div>
        </motion.div>

        {/* Card Panel B: Automated Processing Task queue loop */}
        <motion.div
          drag={dragEnabled}
          dragConstraints={{ left: -10, right: 10, top: -10, bottom: 10 }}
          dragElastic={0.02}
          className="p-5 border border-white/10 bg-black/40 rounded-xl backdrop-blur-md flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold tracking-widest text-fuchsia-400 flex items-center gap-2">
                <Sliders size={13} className="text-fuchsia-400" /> RECURSIVE TASKS STREAM
              </span>
              <button
                onClick={triggerCoreTaskLoop}
                disabled={isCoreProcessing}
                className="p-1 text-slate-500 hover:text-white border border-white/10 rounded"
                title="Restart task loop"
              >
                <RefreshCw size={10} className={isCoreProcessing ? "animate-spin text-fuchsia-400" : ""} />
              </button>
            </div>

            {/* Quick add custom task to queue */}
            <form onSubmit={handleCreateTask} className="flex gap-1.5">
              <input
                type="text"
                placeholder="Assign core queue task..."
                value={customTaskInput}
                onChange={(e) => setCustomTaskInput(e.target.value)}
                className="bg-zinc-900/40 border border-white/10 rounded-lg px-2.5 py-1 text-[10px] font-mono placeholder-zinc-600 focus:outline-none focus:border-fuchsia-500 text-slate-300 w-full select-all"
              />
              <button
                type="submit"
                className="p-1 px-2.5 bg-fuchsia-500/20 hover:bg-fuchsia-500/30 border border-fuchsia-500/30 text-fuchsia-300 rounded-lg text-xs flex items-center justify-center cursor-pointer"
              >
                <Plus size={12} />
              </button>
            </form>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3 bg-zinc-950/40 border border-white/5 rounded-lg text-[10px] font-mono space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white truncate max-w-[130px]">{task.taskName}</span>
                    <span
                      className={`text-[7px] font-bold px-1.5 py-0.5 rounded border uppercase ${
                        task.status === "completed"
                          ? "bg-green-500/10 border-green-500/25 text-green-400"
                          : task.status === "processing"
                          ? "bg-fuchsia-500/10 border-fuchsia-500/25 text-fuchsia-400 animate-pulse"
                          : "bg-stone-500/10 border-stone-500/20 text-slate-400"
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                  
                  {/* Progress filler indicator */}
                  <div className="space-y-1">
                    <div className="h-1 w-full bg-slate-800/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-fuchsia-500 to-purple-400 transition-all duration-1000"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[7px] text-slate-500">
                      <span>{task.agent}</span>
                      <span>{task.progress}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[7.5px] font-mono text-slate-500 flex justify-between items-center pt-3 border-t border-white/5">
            <span>PIPELINES RUNNING AT STANDARD ACCURACY</span>
            <button 
              onClick={() => setTasks([])}
              className="text-red-400/70 hover:text-red-400 font-bold uppercase transition-all"
            >
              Flush
            </button>
          </div>
        </motion.div>
      </div>

      {/* 4. LOWER SECONDARY SPATIAL MATRIX CONTROLS WRITING BOARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Goals / Checklist board */}
        <motion.div
          drag={dragEnabled}
          dragConstraints={{ left: -5, right: 5, top: -5, bottom: 5 }}
          dragElastic={0.02}
          className="p-5 border border-white/10 bg-black/40 rounded-xl backdrop-blur-md flex flex-col justify-between"
        >
          <div className="space-y-4">
            <span className="text-xs font-mono font-bold tracking-widest text-amber-400 flex items-center gap-2">
              <CheckCircle size={13} /> CURRENT SYS GOALS
            </span>

            <form onSubmit={handleCreateGoal} className="flex gap-1.5">
              <input
                type="text"
                placeholder="Declare operating goal node..."
                value={newGoalInput}
                onChange={(e) => setNewGoalInput(e.target.value)}
                className="bg-zinc-900/40 border border-white/10 rounded-lg px-2.5 py-1 text-[10px] font-mono placeholder-zinc-650 focus:outline-none focus:border-amber-500 text-slate-300 w-full select-all"
              />
              <button
                type="submit"
                className="p-1 px-2.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 rounded-lg text-xs"
              >
                +
              </button>
            </form>

            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-0.5">
              {goals.map((g) => (
                <div
                  key={g.id}
                  onClick={() => handleToggleGoal(g.id)}
                  className="flex items-center gap-2.5 p-2 border border-white/5 bg-slate-900/20 rounded-lg hover:bg-white/5 transition-all text-[10px] font-mono cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={g.completed}
                    onChange={() => {}} // toggled on container tap
                    className="accent-amber-400 cursor-pointer pointer-events-none"
                  />
                  <span className={`truncate text-slate-300 ${g.completed ? "line-through text-slate-600 decoration-slate-600" : ""}`}>
                    {g.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[7px] font-mono text-slate-500 mt-4">
            STALL RATE: {goals.filter((g) => !g.completed).length} GOALS REMAINING
          </div>
        </motion.div>

        {/* Environmental Spatial Indicators (Weather / Space trends) */}
        <motion.div
          drag={dragEnabled}
          dragConstraints={{ left: -5, right: 5, top: -5, bottom: 5 }}
          dragElastic={0.01}
          className="p-5 border border-white/10 bg-black/40 rounded-xl backdrop-blur-md flex flex-col justify-between"
        >
          <div className="space-y-4">
            <span className="text-xs font-mono font-bold tracking-widest text-[#a855f7] flex items-center gap-2">
              <Radio size={13} /> CONSOL INDEX TRENDS
            </span>

            <div className="space-y-3 text-[10px] font-mono">
              <div className="p-2.5 border border-white/5 bg-slate-900/30 rounded-lg space-y-1">
                <span className="block text-[7px] text-zinc-500 uppercase">Grounding search trend</span>
                <span className="block font-bold text-slate-200">"Artificial General Consciousness loops"</span>
                <div className="flex justify-between text-[7px] text-[#a855f7] uppercase font-bold mt-1">
                  <span>94.2k queries</span>
                  <span>+18%</span>
                </div>
              </div>

              <div className="p-2.5 border border-white/5 bg-slate-900/30 rounded-lg space-y-1">
                <span className="block text-[7px] text-zinc-500 uppercase">Synthesizer audio tuning</span>
                <span className="block font-bold text-slate-200">Diatonic sine-wave soundscapes</span>
                <div className="flex justify-between text-[7px] text-[#a855f7] uppercase font-bold mt-1">
                  <span>Standard 440Hz</span>
                  <span>Locked</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-[7.5px] font-mono text-slate-500">
            NETWORK GROUNDING: STABLE 100% SECURE
          </div>
        </motion.div>

        {/* Tactical Log simulator */}
        <motion.div
          drag={dragEnabled}
          dragConstraints={{ left: -5, right: 5, top: -5, bottom: 5 }}
          dragElastic={0.01}
          className="p-5 border border-white/10 bg-black/40 rounded-xl backdrop-blur-md flex flex-col justify-between"
        >
          <div className="space-y-4">
            <span className="text-xs font-mono font-bold tracking-widest text-green-400 flex items-center gap-2">
              <Terminal size={12} /> SECURE AUDIT TRAIL
            </span>

            <div className="h-36 overflow-y-auto pr-1 space-y-1.5 bg-zinc-950/50 border border-white/15 p-2.5 font-mono text-[9px] text-cyan-300/80 rounded-lg leading-relaxed select-text">
              <p className="text-slate-500">[2026-05-23 11:46] SYSTEM SHIFT SECURE</p>
              <p className="text-green-400">[LIVE] All neural connectors active.</p>
              <p className="text-cyan-300">[INFO] Core network grounding compile success.</p>
              <p className="text-cyan-300">[INFO] Synthesizer loaded at port 3000.</p>
              <p className="text-amber-400">[WARN] Synthetic oscillator threshold reached.</p>
              <p className="text-slate-300">[INFO] Draggable grid constraint secure.</p>
            </div>
          </div>

          <div className="text-[7px] font-mono text-slate-500">
            SECURE LOG INDEXER
          </div>
        </motion.div>

        {/* Security Logs Widget */}
        <motion.div
          drag={dragEnabled}
          dragConstraints={{ left: -5, right: 5, top: -5, bottom: 5 }}
          dragElastic={0.01}
          className={`p-5 border bg-black/40 rounded-xl backdrop-blur-md flex flex-col justify-between transition-all duration-500 relative overflow-hidden ${
            threatLevel === "CRITICAL" 
              ? "border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]" 
              : threatLevel === "ELEVATED"
              ? "border-amber-500/40 animate-pulse"
              : "border-white/10"
          }`}
        >
          <div className="space-y-3.5 flex-1 flex flex-col justify-between">
            {/* Header / State Row */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold tracking-widest text-red-400 flex items-center gap-2">
                <ShieldAlert size={13} className={threatLevel === "CRITICAL" ? "animate-bounce text-red-500" : ""} />
                <span>SECURITY MONITOR</span>
              </span>
              
              <div className="flex items-center gap-2">
                <span className={`inline-block w-2 h-2 rounded-full ${
                  ipsActive ? "bg-emerald-400 animate-ping" : "bg-red-400"
                }`} />
                <button
                  type="button"
                  onClick={() => setIpsActive(!ipsActive)}
                  className={`p-1 rounded cursor-pointer transition-colors border ${
                    ipsActive 
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                      : "bg-red-500/10 border-red-500/30 text-red-400"
                  }`}
                  title={ipsActive ? "Pause active IPS system scan" : "Activate threat prevention shield"}
                >
                  {ipsActive ? <Lock size={10} /> : <Unlock size={10} />}
                </button>
              </div>
            </div>

            {/* Sub telemetry header with Threat Status & Active blocks */}
            <div className="grid grid-cols-2 gap-2 bg-zinc-950/40 p-2 border border-white/5 rounded-lg text-center font-mono">
              <div className="border-r border-white/5">
                <span className="block text-[7px] text-zinc-500 uppercase">SYS RISK THREAT</span>
                <span className={`text-[9px] font-black tracking-wider uppercase ${
                  threatLevel === "CRITICAL" 
                    ? "text-red-500 animate-pulse" 
                    : threatLevel === "ELEVATED"
                    ? "text-amber-500"
                    : "text-emerald-400"
                }`}>
                  {threatLevel}
                </span>
              </div>
              <div>
                <span className="block text-[7px] text-zinc-500 uppercase">THREATS BLOCKED</span>
                <span className="text-[10px] font-bold text-slate-300">
                  {activeBlocks}
                </span>
              </div>
            </div>

            {/* Live Scrolling Logs */}
            <div className="h-28 overflow-y-auto pr-0.5 space-y-1 bg-zinc-950/70 border border-white/10 p-2 font-mono text-[8px] rounded-lg scrollbar-thin max-h-[120px] select-text">
              {securityIncidents.map((incident) => {
                let badgeColor = "bg-sky-500/10 text-sky-400 border-sky-500/20";
                if (incident.type === "CRITICAL") badgeColor = "bg-red-500/20 text-red-400 border-red-500/30 animate-pulse";
                if (incident.type === "WARNING") badgeColor = "bg-amber-500/20 text-amber-400 border-amber-500/30";

                return (
                  <motion.div
                    key={incident.id}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-1.5 border rounded flex flex-col gap-1 transition-colors ${
                      incident.type === "CRITICAL" 
                        ? "bg-red-950/20 border-red-500/30" 
                        : "bg-slate-900/30 border-white/5"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className="text-slate-500">{incident.timestamp}</span>
                        <span className={`px-1 rounded border text-[6px] font-bold ${badgeColor}`}>
                          {incident.type}
                        </span>
                      </div>
                      <span className="text-zinc-500 truncate max-w-[80px]">IP: {incident.source}</span>
                    </div>
                    <p className="text-slate-300 leading-snug break-all font-sans text-[8.5px] font-medium">
                      {incident.message}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {/* Simulated Live Action Panel */}
            <div className="space-y-1.5 pt-1 border-t border-white/5">
              <span className="text-[7.5px] font-mono text-zinc-500 block uppercase">SIMULATE EXPLOIT ATTACK VECTORS</span>
              <div className="grid grid-cols-3 gap-1">
                <button
                  type="button"
                  onClick={() => triggerManualIncident("CRITICAL")}
                  className="px-1 py-1 font-mono text-[7px] font-bold border border-red-500/30 text-red-400 hover:bg-red-500/15 rounded bg-red-500/5 transition-all text-center uppercase cursor-pointer truncate animate-none"
                  title="Simulate buffer overflow"
                >
                  BruteForce
                </button>
                <button
                  type="button"
                  onClick={() => triggerManualIncident("WARNING")}
                  className="px-1 py-1 font-mono text-[7px] font-bold border border-amber-500/30 text-amber-400 hover:bg-amber-500/15 rounded bg-amber-500/5 transition-all text-center uppercase cursor-pointer truncate animate-none"
                  title="Simulate gateway route probe"
                >
                  Probe Scan
                </button>
                <button
                  type="button"
                  onClick={() => triggerManualIncident("INFO")}
                  className="px-1 py-1 font-mono text-[7px] font-bold border border-sky-500/30 text-sky-400 hover:bg-sky-500/15 rounded bg-sky-500/5 transition-all text-center uppercase cursor-pointer truncate animate-none"
                  title="Simulate system backup scheduler"
                >
                  Backup Sync
                </button>
              </div>
            </div>
          </div>

          <div className="text-[7px] font-mono text-slate-500 mt-2 flex justify-between items-center">
            <span>ACTIVE PROTECTION V5</span>
            <button
              onClick={() => setSecurityIncidents([])}
              className="text-red-400 hover:text-red-300 font-bold uppercase transition-all text-[6.5px]"
            >
              Clear Feed
            </button>
          </div>
        </motion.div>

      </div>

      {/* 5. INDIVIDUAL MAXIMIZED OVERLAYS FOR THE COMMMAND CONSOLE */}
      <AnimatePresence>
        {maximizedWidget === "commander" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="max-w-3xl w-full border border-white/15 bg-slate-900 rounded-2xl p-6 relative max-h-[85vh] overflow-y-auto flex flex-col justify-between"
            >
              <button 
                onClick={() => setMaximizedWidget(null)}
                className="absolute top-4 right-4 p-1.5 hover:bg-white/5 border border-white/10 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <Minimize2 size={14} />
              </button>

              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <Cpu className="text-cyan-400 animate-spin" size={20} />
                  <h3 className="text-lg font-sans font-black tracking-widest text-white uppercase">COGNITIVE SYSTEM PROCESS THREADS INDEX</h3>
                </div>
                <p className="text-xs font-mono text-slate-400">
                  Full inspection matrix showing active vector load, latency indicators and accuracy bounds. Launch or stall separate subprocess nodes below.
                </p>

                <div className="space-y-2.5">
                  {processes.map(proc => (
                    <div key={proc.id} className="p-4 bg-black/40 border border-white/10 rounded-xl flex items-center justify-between font-mono text-xs">
                      <div className="flex items-center gap-3">
                        <span className={`w-2 h-2 rounded-full ${proc.status === 'active' ? 'bg-green-400' : 'bg-yellow-400'}`} />
                        <div>
                          <span className="block font-bold text-white uppercase">{proc.name}</span>
                          <span className="text-[9px] text-zinc-500 lowercase">{proc.category} active neural node</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <span className="block text-[8px] text-zinc-500">ACCURACY</span>
                          <span className="text-cyan-400 font-bold">99.2%</span>
                        </div>
                        <button
                          onClick={() => handleToggleAgent(proc.id)}
                          className={`px-3 py-1 border text-[9px] rounded uppercase font-bold cursor-pointer ${
                            proc.status === 'active' ? "border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10" : "border-green-500/30 text-green-400 hover:bg-green-500/10"
                          }`}
                        >
                          {proc.status === 'active' ? 'Stall Node' : 'Launch Node'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-white/5 text-[9px] font-mono text-slate-500 flex justify-between">
                <span>INDEX LOAD: FAST RESPONSIVENESS SECURE</span>
                <span>ESC TO CLOSE</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
