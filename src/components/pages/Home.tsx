import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Home as HomeIcon, 
  Brain, 
  Terminal, 
  BarChart, 
  Settings as SettingsIcon, 
  Link2, 
  Cpu, 
  Layers, 
  Network, 
  ChevronRight, 
  Play, 
  Sliders, 
  Radio,
  Send,
  MessageSquare,
  Plus,
  Trash2,
  Loader2,
  Save,
  Database,
  Sparkles,
  Check
} from "lucide-react";
import { PageId } from "../../types";
import { safeLocalStorage } from "../../utils/safeLocalStorage";

interface HomeProps {
  onNavigate: (page: PageId) => void;
  onLogMessage: (level: "INFO" | "WARN" | "CORE" | "ERROR", text: string) => void;
  activeThemeId?: string;
  isLightMode?: boolean;
  soundEnabled?: boolean;
}

export default function Home({ 
  onNavigate, 
  onLogMessage, 
  activeThemeId = "cyber-blue", 
  isLightMode = false,
  soundEnabled = true
}: HomeProps) {
  // Web Audio HUD beeps synthesizer
  const playHudBeep = (freq: number = 800, type: OscillatorType = "sine", duration: number = 0.08) => {
    if (typeof window === "undefined" || !soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // AudioContext blocked
    }
  };

  // State managers
  const [cpuUsage, setCpuUsage] = useState(18);
  const [memoryUsage, setMemoryUsage] = useState(32);
  const [activeAgents, setActiveAgents] = useState({
    Echo: { active: true, load: 74, color: "bg-emerald-400", hex: "#10b981", type: "Cognitive Engine" },
    Phoenix: { active: true, load: 88, color: "bg-cyan-400", hex: "#22d3ee", type: "Data Parser" },
    Ghost: { active: false, load: 12, color: "bg-fuchsia-400", hex: "#e879f9", type: "Network Sentry" }
  });

  const [isOrbHovered, setIsOrbHovered] = useState(false);
  const [headingTag, setHeadingTag] = useState("ORBITAL_SYS_SECURE");

  // Telemetry fluctuation
  useEffect(() => {
    const timer = setInterval(() => {
      setCpuUsage((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.min(Math.max(prev + delta, 12), 32);
      });
      setMemoryUsage((prev) => {
        const delta = Math.floor(Math.random() * 3) - 1;
        return Math.min(Math.max(prev + delta, 30), 36);
      });
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const totalActiveAgentsCount = Object.values(activeAgents).filter(a => a.active).length;

  // Toggle active agents
  const toggleAgent = (name: keyof typeof activeAgents) => {
    playHudBeep(700, "triangle", 0.1);
    setActiveAgents((prev) => {
      const updated = {
        ...prev,
        [name]: {
          ...prev[name],
          active: !prev[name].active
        }
      };
      onLogMessage("INFO", `Neural agent ${name} shifted to ${updated[name].active ? "ACTIVE_STREAM" : "STANDBY"}`);
      return updated;
    });
  };

  // AI Agent States and Backups on Core Home
  const [chatMessages, setChatMessages] = useState<{ id: string; role: "user" | "assistant"; content: string; timestamp: string }[]>(() => [
    {
      id: "init",
      role: "assistant",
      content: "Greetings, Captain. This is your core console neural gateway with absolute redundant persistent backups configured. How can I assist with flight metrics, system calibrations, or target scanning?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [backupStatus, setBackupStatus] = useState<"clean" | "dirty" | "saving" | "error">("clean");

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Sync / Load chat history backup from backend and localStorage on mount
  useEffect(() => {
    const fetchChatHistoryBackup = async () => {
      onLogMessage("INFO", "Initializing synaptic chat backup links...");
      // Try local storage first
      const savedMessages = safeLocalStorage.getItem("jarvis_home_chat");
      if (savedMessages) {
        try {
          const parsed = JSON.parse(savedMessages);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setChatMessages(parsed);
          }
        } catch (e) {
          console.error("Local storage parsing failed", e);
        }
      }

      // Query server backup
      try {
        const res = await fetch("/api/chat/history?userEmail=default_user");
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.messages) && data.messages.length > 0) {
            setChatMessages(data.messages);
            safeLocalStorage.setItem("jarvis_home_chat", JSON.stringify(data.messages));
            onLogMessage("INFO", "Latest central chat archives compiled beautifully.");
          }
        }
      } catch (err: any) {
        console.warn("Server backup links offline: " + err.message);
      }
    };
    fetchChatHistoryBackup();
  }, []);

  // Update localStorage when messages change
  useEffect(() => {
    if (chatMessages.length > 1) { // ignore initial layout mount state
      safeLocalStorage.setItem("jarvis_home_chat", JSON.stringify(chatMessages));
      setBackupStatus("dirty");
    }
  }, [chatMessages]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isSending]);

  // Execute backup to dynamic data files and Firestore proxy
  const triggerChatBackup = async (messagesToBackup = chatMessages) => {
    if (messagesToBackup.length <= 1) return;
    try {
      setBackupStatus("saving");
      onLogMessage("INFO", "Synchronizing neural chat history backup with server dataset database...");
      const res = await fetch("/api/chat/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messagesToBackup,
          userEmail: "default_user"
        })
      });
      if (!res.ok) throw new Error("Server backup returned error response");
      setBackupStatus("clean");
      onLogMessage("CORE", "Synaptic conversational history backups compiled solid.");
    } catch (err: any) {
      setBackupStatus("error");
      onLogMessage("ERROR", "Chat backup transmission failed: " + err.message);
    }
  };

  const handleSendChat = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isSending) return;

    const userMessage = {
      id: `msg-${Date.now()}`,
      role: "user" as const,
      content: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    const newMessages = [...chatMessages, userMessage];
    setChatMessages(newMessages);
    setChatInput("");
    setIsSending(true);

    try {
      onLogMessage("INFO", "Routing query through automated active neural core...");
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          provider: "openrouter" 
        })
      });
      if (!res.ok) throw new Error("Chat gateway error");
      const data = await res.json();
      
      const assistantMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant" as const,
        content: data.text || "Connection stable. Aux systems standby.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      
      const updatedList = [...newMessages, assistantMessage];
      setChatMessages(updatedList);
      
      // Auto-trigger backup sync on reply
      triggerChatBackup(updatedList);
    } catch (err: any) {
      console.error(err);
      onLogMessage("ERROR", "Neural path interruption: " + err.message);
      setChatMessages(prev => [...prev, {
        id: `msg-err-${Date.now()}`,
        role: "assistant",
        content: "⚠️ **[Neural Path Disconnected]** Deep cognitive networks took longer than thirty spacecraft loops to route. Backup stored to client stack.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }]);
    } finally {
      setIsSending(false);
    }
  };

  const handleResetChatHistory = () => {
    playHudBeep(440, "sine", 0.15);
    const initial = [
      {
        id: "init",
        role: "assistant" as const,
        content: "Greetings, Captain. This is your core console neural gateway with absolute redundant persistent backups configured. How can I assist with flight metrics, system calibrations, or target scanning?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    ];
    setChatMessages(initial);
    safeLocalStorage.removeItem("jarvis_home_chat");
    setBackupStatus("clean");
    onLogMessage("WARN", "Home conversational stack cleared.");
  };

  // Color grading setup for both modes
  const colors = {
    text: isLightMode ? "text-slate-800" : "text-white",
    textMuted: isLightMode ? "text-slate-500" : "text-slate-400",
    textSub: isLightMode ? "text-slate-400" : "text-zinc-500",
    primary: isLightMode ? "text-cyan-700" : "text-cyan-400",
    border: isLightMode ? "border-cyan-600/20" : "border-cyan-500/20",
    borderActive: isLightMode ? "border-cyan-500/50" : "border-cyan-400/50",
    bgCard: isLightMode ? "bg-white/80 backdrop-blur-md shadow-md" : "bg-black/45 backdrop-blur-md",
    accentGlow: isLightMode ? "shadow-[0_0_15px_rgba(8,145,178,0.15)]" : "shadow-[0_0_15px_rgba(6,182,212,0.25)]",
    hudGlowColor: isLightMode ? "rgba(8, 145, 178, 0.4)" : "rgba(6, 182, 212, 0.7)",
  };

  return (
    <div className={`w-full min-h-screen relative flex flex-col justify-between overflow-x-hidden ${isLightMode ? "text-slate-800" : "text-white"}`}>
      
      {/* Background radial space gradients */}
      <div className={`absolute inset-0 pointer-events-none transition-all duration-700 ${
        isLightMode 
          ? "bg-[radial-gradient(circle_at_center,_rgba(8,145,178,0.06)_0%,_transparent_70%)]" 
          : "bg-[radial-gradient(circle_at_center,_rgba(6,182,212,0.08)_0%,_transparent_70%)]"
      }`} />

      {/* Main Container containing Horizontal Console Widget and Dashboard Grid */}
      <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 relative z-10 flex-1 flex flex-col gap-6">
        
        {/* ================= 1. HORIZONTAL CONSOLE WIDGET (NAV BAR) ================= */}
        <div className={`${colors.bgCard} ${colors.border} ${colors.accentGlow} border rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4`}>
          {/* Nav Title & Status */}
          <div className="flex items-center gap-3">
            <span className="font-sans text-xs font-bold text-cyan-400 capitalize">Jarvis Home Console</span>
          </div>

          {/* Navigation buttons: horizontal rounded tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { id: "home", label: "Home", icon: HomeIcon },
              { id: "assistant", label: "AI", icon: Brain },
              { id: "dashboard", label: "Terminal", icon: Terminal },
              { id: "analytics", label: "Analytics", icon: BarChart },
              { id: "settings", label: "Settings", icon: SettingsIcon },
              { id: "integrations", label: "Integrations", icon: Link2 }
            ].map((item) => {
              const isNavActive = item.id === "home";
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    playHudBeep(900, "sine", 0.05);
                    onNavigate(item.id as PageId);
                    onLogMessage("INFO", `Porting neural core context path to: ZONE_${item.id.toUpperCase()}`);
                  }}
                  className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer select-none group relative border ${
                    isNavActive 
                      ? `${colors.borderActive} bg-cyan-500/10 text-cyan-400 ${colors.accentGlow}` 
                      : `${colors.border} hover:bg-cyan-500/5 ${colors.textMuted} hover:text-cyan-400`
                  }`}
                >
                  <item.icon size={13} className="transition-transform group-hover:scale-110" />
                  <span className="block font-mono text-[8.5px] uppercase tracking-wider font-bold">
                    {item.label}
                  </span>
                  {isNavActive && (
                    <div className="absolute bottom-0 left-1/2 -translate-y-0.5 -translate-x-1/2 w-4 h-[2px] bg-cyan-400 rounded-t" />
                  )}
                </button>
              );
            })}
          </div>


        </div>

        {/* The secondary components grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* ================= 2. THE MAGNIFICENT CENTRAL HUD ORBIT PANEL ================= */}
          <div className="lg:col-span-12 flex flex-col space-y-4">
          <div className={`${colors.bgCard} ${colors.border} ${colors.accentGlow} border rounded-2xl p-6 flex flex-col justify-between items-stretch relative overflow-hidden flex-grow`}>
            
            {/* Holographic scanner laser line sweep */}
            <div className="absolute inset-x-0 h-[1px] bg-cyan-400/30 blur-[0.5px] pointer-events-none animate-scan-line" />

            {/* Header Telemetry row above orbital compass */}
            <div className="flex justify-between items-center text-[11px] font-sans text-slate-400 relative z-10 select-none pb-2 border-b border-cyan-500/5">
              <div>
                <span className={`${colors.text} font-semibold flex items-center gap-1.5`}>
                  <Cpu size={12} className={`${colors.primary}`} /> CPU Usage: {cpuUsage}%
                </span>
              </div>
              <div className="text-right">
                <span className={`${colors.text} font-semibold flex items-center justify-end gap-1.5`}>
                  Active Agents: <span className="text-[#00D4FF]">{totalActiveAgentsCount}</span>
                </span>
              </div>
            </div>

            {/* Central Giant Orbital Targeting / Star Radar HUD Component */}
            <div className="flex-1 flex justify-center items-center relative min-h-[300px] my-4 select-none">
              <OrbitalGridCanvas 
                isOrbHovered={isOrbHovered} 
                isLightMode={isLightMode} 
                glowColor={colors.hudGlowColor}
                onInteraction={(type) => {
                  playHudBeep(type === "click" ? 1100 : 950, "sine", type === "click" ? 0.15 : 0.05);
                  setHeadingTag(type === "click" ? "COGNITIVE_OVERCLOCK" : "CALIBRATING_VECTORS");
                }}
              />
              
              {/* Overlay targeting rings text data */}
              <div className="absolute flex flex-col justify-center items-center text-center pointer-events-none font-mono">
                <span className={`text-[9px] font-bold tracking-widest text-[#00D4FF] animate-pulse`}>
                  {headingTag}
                </span>
                <span className={`text-[6px] text-slate-500 tracking-[0.2em] uppercase mt-1`}>
                  ALPHA SECURED GATEWAY 0.015ms
                </span>
              </div>
            </div>            {/* Bottom bar container: dynamic real-time Audio frequency oscillograph */}
            <div className={`p-3 rounded-xl border ${colors.border} bg-cyan-950/10 flex items-center gap-4 relative overflow-hidden select-none`}>
              <div className="w-24 h-6 border-r border-cyan-500/10 pr-2">
                <VoiceWaveformCanvas isLightMode={isLightMode} />
              </div>
              <div className="flex-1 font-mono text-[10px] sm:text-xs">
                <span className="text-zinc-600 block text-[6px] uppercase tracking-wider leading-none">SYSTEM MOTTO ACCENT</span>
                <span className={`font-bold uppercase tracking-widest text-sm leading-none bg-gradient-to-r ${isLightMode ? "from-slate-700 to-cyan-800" : "from-cyan-400 to-fuchsia-400"} bg-clip-text text-transparent`}>
                  JARVIS X — Think. Adapt. Execute.
                </span>
              </div>
              <Radio size={12} className="text-fuchsia-400/80 shrink-0 animate-pulse" />
            </div>

          </div>

          {/* COMPACT AI CONSCIOUSNESS MAIN-PORT with Chat History Backup */}
          <div className={`${colors.bgCard} ${colors.border} ${colors.accentGlow} border rounded-2xl p-4 flex flex-col justify-between items-stretch relative overflow-hidden h-[340px]`}>
            
            {/* Header section with backup buttons */}
            <div className="flex justify-between items-center pb-2.5 border-b border-cyan-500/10 select-none">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] animate-pulse" />
                <span className="block font-mono text-[8.5px] tracking-widest text-[#00D4FF] uppercase font-bold">
                  AI AGENT HUB — CONSOLE CHAT
                </span>
              </div>
              
              {/* Backup / Restore Controls */}
              <div className="flex items-center gap-1.5 font-mono text-[8px]">
                {/* Backup Status Badge */}
                <span className={`px-1.5 py-0.5 rounded border ${
                  backupStatus === "clean" ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/5" :
                  backupStatus === "dirty" ? "text-amber-400 border-amber-500/20 bg-amber-500/5 animate-pulse" :
                  backupStatus === "saving" ? "text-cyan-400 border-cyan-500/20 bg-cyan-500/5" :
                  "text-red-400 border-red-500/20 bg-red-500/5"
                }`}>
                  {backupStatus === "clean" && "BACKUP: COMPILED_SECURE"}
                  {backupStatus === "dirty" && "BACKUP: CHANGES_PENDING"}
                  {backupStatus === "saving" && "BACKUP: TRANSMITTING..."}
                  {backupStatus === "error" && "BACKUP: OFFLINE_ERR"}
                </span>

                <button 
                  type="button"
                  onClick={() => triggerChatBackup()}
                  disabled={backupStatus === "clean" || backupStatus === "saving"}
                  className="p-1 border border-cyan-500/20 hover:border-cyan-455/40 rounded hover:text-cyan-400 flex items-center justify-center cursor-pointer transition-all bg-black/10 disabled:opacity-50"
                  title="Force Backup Synchronization"
                >
                  <Save size={10} className={backupStatus === "saving" ? "animate-spin" : ""} />
                </button>

                <button 
                  type="button"
                  onClick={handleResetChatHistory}
                  className="p-1 border border-red-500/20 hover:border-red-400/40 rounded hover:text-red-400 flex items-center justify-center cursor-pointer transition-all text-zinc-500 bg-black/10"
                  title="Reset Conversation Buffer"
                >
                  <Trash2 size={10} />
                </button>
              </div>
            </div>

            {/* Chat scrolling log area */}
            <div className="flex-grow overflow-y-auto py-2 space-y-2 pr-1 select-text scrollbar-thin scrollbar-thumb-cyan-500/20 text-xs">
              {chatMessages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                >
                  <div className="flex items-center gap-1 mb-0.5 font-mono text-[7px] text-zinc-500 select-none">
                    <span>{msg.role === "user" ? "CAPTAIN" : "JARVIS_X"}</span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div className={`p-2 rounded-xl border max-w-[85%] text-[10px] leading-relaxed font-sans ${
                    msg.role === "user" 
                      ? "bg-cyan-500/5 border-cyan-400/30 text-white" 
                      : "bg-black/25 border-cyan-500/10 text-cyan-100"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              
              {isSending && (
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-1.5 mb-1 font-mono text-[7px] text-zinc-500 select-none">
                    <span>JARVIS_X</span>
                    <span>•</span>
                    <span className="animate-pulse">COGNITIVE INTEGRATION...</span>
                  </div>
                  <div className="p-2 rounded-xl border max-w-[85%] text-[10px] bg-black/25 border-cyan-500/10 text-cyan-400 animate-pulse flex items-center gap-1.5 font-mono">
                    <Loader2 size={10} className="animate-spin" /> ENGAGING NEURAL SYNAPTIC OVERRIDE
                  </div>
                </div>
              )}
              
              <div ref={chatEndRef} />
            </div>

            {/* Form Input row */}
            <form onSubmit={handleSendChat} className="flex gap-2 pt-2 border-t border-cyan-500/10">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Transmit synaptic flight / calibration request..."
                className="flex-grow bg-cyan-950/15 border border-cyan-500/15 hover:border-cyan-500/30 rounded-xl px-3 py-1.5 text-[10.5px] select-text focus:outline-none focus:border-cyan-400/60 text-cyan-200 transition-all font-mono"
                disabled={isSending}
              />
              
              <button
                type="submit"
                disabled={isSending || !chatInput.trim()}
                className="px-3 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-black font-semibold rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-[0_0_10px_rgba(6,182,212,0.2)]"
              >
                <Send size={11} />
              </button>
            </form>

          </div>

        </div>



      </div>

    </div>



    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// NESTED CANVAS 1: HIGH TECH CONCENTRIC ORBITAL DISPLAY GRID
// ═══════════════════════════════════════════════════════════
function OrbitalGridCanvas({ 
  isOrbHovered, 
  isLightMode, 
  glowColor,
  onInteraction 
}: { 
  isOrbHovered: boolean; 
  isLightMode: boolean; 
  glowColor: string;
  onInteraction: (type: "hover" | "click") => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 320;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    let angle1 = 0;
    let angle2 = 0;
    let angle3 = 0;
    let crosshairProgress = 0;

    // Horizontally expanding warp particles
    const particleCount = 65;
    const particles: { x: number; y: number; speed: number; size: number; alpha: number; color: string }[] = [];
    
    // Fill particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: (Math.random() - 0.5) * size * 1.5,
        y: (Math.random() - 0.5) * 80, // horizontally localized
        speed: Math.random() * 2 + 0.5,
        size: Math.random() * 1.8 + 0.5,
        alpha: Math.random() * 0.7 + 0.3,
        color: i % 5 === 0 ? "rgba(217, 70, 239, 0.8)" : "rgba(6, 182, 212, 0.8)" // Cyan & Pink highlight
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, size, size);
      const cx = size / 2;
      const cy = size / 2;

      // Base matrix speeds adjustment
      angle1 += 0.005;
      angle2 -= 0.009;
      angle3 += 0.015;
      crosshairProgress += 0.02;

      // Draw background cyber targeting crosshairs
      ctx.strokeStyle = isLightMode ? "rgba(15, 23, 42, 0.07)" : "rgba(255, 255, 255, 0.04)";
      ctx.lineWidth = 1;

      // Horizontal line
      ctx.beginPath();
      ctx.moveTo(10, cy);
      ctx.lineTo(size - 10, cy);
      ctx.stroke();

      // Vertical line
      ctx.beginPath();
      ctx.moveTo(cx, 10);
      ctx.lineTo(cx, size - 10);
      ctx.stroke();

      // Horizontal coordinate ticks
      for (let x = 30; x < size; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, cy - 3);
        ctx.lineTo(x, cy + 3);
        ctx.stroke();
      }

      // Draw warp-speed horizontal dynamic particles
      for (let p of particles) {
        p.x += p.speed;
        // loop around if bound exceeded
        if (p.x > size / 2 + 60) {
          p.x = -size / 2 - 60;
          p.y = (Math.random() - 0.5) * 120;
          p.speed = Math.random() * 2.2 + 0.6;
        }

        const screenX = cx + p.x;
        const screenY = cy + p.y;
        
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * (1 - Math.abs(p.x) / (size / 2 + 60)); // fade at screen edges
        ctx.beginPath();
        // Give a streaked comet/motion-blur look
        ctx.rect(screenX, screenY, p.size * 3.5, p.size);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;

      // Draw Concentric Rings
      // Ring A: Dashed outer targeting Ring with calibration segments
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle1);
      ctx.strokeStyle = isLightMode ? "rgba(8, 145, 178, 0.45)" : "rgba(6, 182, 212, 0.5)";
      ctx.lineWidth = 1.2;
      ctx.setLineDash([5, 15, 30, 15]);
      ctx.beginPath();
      ctx.arc(0, 0, 110, 0, Math.PI * 2);
      ctx.stroke();

      // Outer aiming ticks
      ctx.setLineDash([]);
      for (let i = 0; i < 4; i++) {
        ctx.rotate(Math.PI / 2);
        ctx.beginPath();
        ctx.moveTo(110, 0);
        ctx.lineTo(122, 0);
        ctx.stroke();
      }
      ctx.restore();

      // Ring B: Bold circular quadrant gauges
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle2);
      ctx.strokeStyle = isLightMode ? "rgba(8, 145, 178, 0.65)" : "rgba(6, 182, 212, 0.85)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, 92, 0, Math.PI * 0.35);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, 92, Math.PI, Math.PI * 1.35);
      ctx.stroke();
      
      // Numeric ticking text coordinates inside orbiting rings
      ctx.fillStyle = isLightMode ? "rgba(15, 23, 42, 0.45)" : "rgba(255, 255, 255, 0.35)";
      ctx.font = "6px monospace";
      ctx.fillText("H-A // 92", 68, 5);
      ctx.fillText("Z-9 // V35", -95, 5);
      ctx.restore();

      // Ring C: Tilted Orbital ellipses simulating 3D planet paths
      ctx.save();
      ctx.translate(cx, cy);
      ctx.strokeStyle = "rgba(217, 70, 239, 0.35)"; // Fuchsia highlight
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.ellipse(0, 0, 80, 22, Math.PI / 4 + angle1, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = isLightMode ? "rgba(8, 145, 178, 0.25)" : "rgba(6, 182, 212, 0.25)";
      ctx.beginPath();
      ctx.ellipse(0, 0, 80, 22, -Math.PI / 4 + angle2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Ring D: Inner dial ring of high speed scale marks
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle3);
      ctx.strokeStyle = isLightMode ? "rgba(8, 145, 178, 0.2)" : "rgba(6, 182, 212, 0.3)";
      ctx.lineWidth = 4;
      ctx.setLineDash([2, 5]);
      ctx.beginPath();
      ctx.arc(0, 0, 68, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Ring E: Centered radar sweeps line tracking mouse
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle2 * 2.2);
      const sweepGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, 55);
      sweepGrad.addColorStop(0, isLightMode ? "rgba(8, 145, 178, 0.3)" : "rgba(6, 182, 212, 0.4)");
      sweepGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = sweepGrad;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, 55, -Math.PI / 6, Math.PI / 6);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Dynamic glowing core particle
      ctx.shadowBlur = 15;
      ctx.shadowColor = isLightMode ? "rgba(8, 145, 178, 0.8)" : "rgba(6, 182, 212, 0.9)";
      ctx.fillStyle = isLightMode ? "#0891b2" : "#00D4FF";
      ctx.beginPath();
      ctx.arc(cx, cy, 5.5 + Math.sin(crosshairProgress * 2) * 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0; // reset

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isOrbHovered, isLightMode]);

  return (
    <canvas 
      ref={canvasRef}
      onMouseEnter={() => onInteraction("hover")}
      onClick={() => onInteraction("click")}
      className="cursor-pointer rounded-full hover:scale-105 transition-transform duration-500 hover:shadow-cyan-500/10 active:scale-95"
    />
  );
}

// ═══════════════════════════════════════════════════════════
// NESTED CANVAS 2: DYNAMIC AUDIO WAVEFORM CONTROLLER GRAPH
// ═══════════════════════════════════════════════════════════
function VoiceWaveformCanvas({ isLightMode }: { isLightMode: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = 96;
    const height = 24;
    canvas.width = width;
    canvas.height = height;

    let offset = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      offset += 0.15;

      ctx.strokeStyle = isLightMode ? "rgba(8, 145, 178, 0.65)" : "rgba(6, 182, 212, 0.75)";
      ctx.lineWidth = 1;
      ctx.beginPath();

      for (let x = 0; x < width; x++) {
        // Compose multiple sine loops for a beautiful digital speech pattern
        const sinA = Math.sin(x * 0.12 - offset) * 5;
        const sinB = Math.sin(x * 0.23 + offset * 1.5) * 3;
        const envelope = Math.sin((x / width) * Math.PI); // shape squeeze at edges
        const y = height / 2 + (sinA + sinB) * envelope;
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isLightMode]);

  return (
    <canvas ref={canvasRef} className="w-full h-full" />
  );
}

// ═══════════════════════════════════════════════════════════
// NESTED CANVAS 3: HIGH PERFORMANCE MEMORY GALAXY STAR SYSTEM
// ═══════════════════════════════════════════════════════════
function MemoryGalaxyCanvas({ isLightMode }: { isLightMode: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 70, y: 50, touching: false });

  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = 220;
    const height = 90;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    let angle = 0;
    const nodes: { radius: number; angle: number; size: number; speed: number; color: string }[] = [];
    
    // Galactic spirals nodes
    for (let i = 0; i < 40; i++) {
      const arm = i % 2 === 0 ? 0 : Math.PI; // dual arm galaxy
      const radiusDist = (i / 40) * 80 + 10;
      nodes.push({
        radius: radiusDist,
        angle: arm + (radiusDist * 0.08),
        size: Math.random() * 1.8 + 0.6,
        speed: (Math.random() * 0.015) + (5 / radiusDist) * 0.04, // center beats faster
        color: i % 3 === 0 ? "rgba(217, 70, 239, 0.75)" : "rgba(6, 182, 212, 0.75)"
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        touching: true
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.touching = false;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;

      angle += 0.004;

      // Draw dust clouds
      const radialGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 45);
      radialGrad.addColorStop(0, isLightMode ? "rgba(8,145,178,0.12)" : "rgba(6,182,212,0.12)");
      radialGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = radialGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 45, 0, Math.PI * 2);
      ctx.fill();

      // Connect nodes close to mouse to draw constellation effect
      const currentPoints: { x: number; y: number }[] = [];

      // Render galaxy spirals
      for (let node of nodes) {
        node.angle += node.speed;
        
        let dx = Math.cos(node.angle) * node.radius;
        let dy = Math.sin(node.angle) * node.radius * 0.45; // squeeze Y for isometric tilt

        // Attract toward mouse if cursor is close
        const nodeX = cx + dx;
        const nodeY = cy + dy;

        let finalX = nodeX;
        let finalY = nodeY;

        if (mouseRef.current.touching) {
          const mouseDist = Math.hypot(nodeX - mouseRef.current.x, nodeY - mouseRef.current.y);
          if (mouseDist < 40) {
            const pull = (40 - mouseDist) * 0.15;
            finalX += ((mouseRef.current.x - nodeX) / mouseDist) * pull;
            finalY += ((mouseRef.current.y - nodeY) / mouseDist) * pull;
          }
        }

        currentPoints.push({ x: finalX, y: finalY });

        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(finalX, finalY, node.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Constellation lines linking nearby items
      ctx.lineWidth = 0.35;
      for (let i = 0; i < currentPoints.length; i++) {
        const pt1 = currentPoints[i];
        let linesCount = 0;
        for (let j = i + 1; j < currentPoints.length && linesCount < 2; j++) {
          const pt2 = currentPoints[j];
          const distance = Math.hypot(pt1.x - pt2.x, pt1.y - pt2.y);
          if (distance < 16) {
            ctx.strokeStyle = `rgba(${isLightMode ? "8,145,178" : "6,182,212"}, ${(1 - distance / 16) * 0.15})`;
            ctx.beginPath();
            ctx.moveTo(pt1.x, pt1.y);
            ctx.lineTo(pt2.x, pt2.y);
            ctx.stroke();
            linesCount++;
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isLightMode]);

  return (
    <canvas ref={canvasRef} className="w-full h-full cursor-crosshair" />
  );
}

// ═══════════════════════════════════════════════════════════
// NESTED CANVAS 4: CINEMATIC THREE-DIMENSIONAL PERSPECTIVE FLOOR
// ═══════════════════════════════════════════════════════════
function PerspectiveGridFloor({ isLightMode }: { isLightMode: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.offsetWidth;
    const height = 80;
    
    // handle Resize robustly
    const resizeHandler = () => {
      width = canvas.parentElement?.clientWidth || window.innerWidth;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    resizeHandler();
    window.addEventListener("resize", resizeHandler);

    let offsetZ = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Increment scroll depth velocity
      offsetZ += 0.45;
      if (offsetZ > 30) offsetZ = 0;

      ctx.strokeStyle = isLightMode ? "rgba(8, 145, 178, 0.1)" : "rgba(6, 182, 212, 0.12)";
      ctx.lineWidth = 1;

      const horizonY = 5; // near perspective horizon
      const vanishX = width / 2;

      // Draw perspective vanishing rays
      const cols = 28;
      for (let i = 0; i <= cols; i++) {
        // compute start positioning at the bottom edge
        const startX = (i / cols) * width;
        ctx.beginPath();
        ctx.moveTo(vanishX, horizonY);
        ctx.lineTo(startX, height);
        ctx.stroke();
      }

      // Draw horizontal crosslines (sliding closer on approach)
      for (let z = 0; z < 15; z++) {
        const rawZ = z * 22 + offsetZ;
        // exponential spread logic representing depth
        const depthY = horizonY + (height - horizonY) * Math.pow(rawZ / 330, 2);
        
        ctx.beginPath();
        ctx.moveTo(0, depthY);
        ctx.lineTo(width, depthY);
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resizeHandler);
    };
  }, [isLightMode]);

  return (
    <canvas ref={canvasRef} className="w-full h-full block" />
  );
}
