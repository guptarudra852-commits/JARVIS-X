import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Send,
  Mic,
  Paperclip,
  RotateCcw,
  Sparkles,
  User,
  Cpu,
  FileText,
  Copy,
  Check,
  Loader2,
  Activity,
  Zap,
  Clock,
  Code2,
  Grid3X3,
  Server,
  Database,
  Monitor,
  Search,
} from "lucide-react";
import { ChatMessage } from "../../types";

interface AssistantProps {
  onLogMessage: (level: "INFO" | "WARN" | "CORE" | "ERROR", text: string) => void;
  onNavigate?: (page: string) => void;
}

/* ─────────────────────────────────────────
   SUB-COMPONENT: Neural Orb (left panel)
───────────────────────────────────────── */
function NeuralOrb() {
  return (
    <div className="relative w-full h-40 flex items-center justify-center overflow-hidden select-none">
      {/* Ambient glow */}
      <div className="absolute w-32 h-32 rounded-full bg-cyan-500/8 blur-2xl animate-pulse pointer-events-none" />

      {/* Orbital ring system */}
      <div className="relative w-28 h-28 flex items-center justify-center">
        {/* Ring 1 – slow clockwise */}
        <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-[spin_22s_linear_infinite]" />
        {/* Ring 2 – dashed fast counter */}
        <div className="absolute inset-2 rounded-full border border-dashed border-blue-400/25 animate-[spin_9s_linear_infinite_reverse]" />
        {/* Ring 3 – medium */}
        <div className="absolute inset-5 rounded-full border border-cyan-400/10 animate-[spin_16s_linear_infinite]" />

        {/* SVG node connections */}
        <svg
          className="absolute inset-0 w-full h-full opacity-40"
          viewBox="0 0 112 112"
          fill="none"
        >
          <line x1="56" y1="2"  x2="56" y2="48"  stroke="#06b6d4" strokeWidth="0.6" strokeDasharray="3 3" />
          <line x1="2"  y1="90" x2="44" y2="64"  stroke="#3b82f6" strokeWidth="0.6" strokeDasharray="3 3" />
          <line x1="110" y1="56" x2="64" y2="56" stroke="#06b6d4" strokeWidth="0.6" strokeDasharray="3 3" />
          <line x1="90" y1="10" x2="64" y2="44"  stroke="#8b5cf6" strokeWidth="0.6" strokeDasharray="3 3" />
          <circle cx="56"  cy="2"   r="2.5" fill="#06b6d4" />
          <circle cx="2"   cy="90"  r="2"   fill="#3b82f6" />
          <circle cx="110" cy="56"  r="2"   fill="#06b6d4" />
          <circle cx="90"  cy="10"  r="2"   fill="#8b5cf6" />
        </svg>

        {/* Center sphere */}
        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-600/35 via-blue-700/25 to-cyan-400/35 border border-cyan-500/40 shadow-[0_0_18px_rgba(6,182,212,0.35)] flex items-center justify-center relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
          <Cpu size={16} className="text-cyan-400 animate-pulse relative z-10" />
        </div>

        {/* Floating node dots */}
        <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.9)] animate-pulse" />
        <div className="absolute bottom-2 left-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_6px_rgba(59,130,246,0.9)] animate-ping" />
        <div className="absolute top-1/2 right-0.5 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-pulse" />
        <div className="absolute bottom-4 right-3 w-1 h-1 rounded-full bg-emerald-400 animate-ping" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   SUB-COMPONENT: Holographic X Orb (right)
───────────────────────────────────────── */
function HolographicXOrb() {
  return (
    <div className="flex-1 flex items-center justify-center relative overflow-hidden select-none"
      style={{
        background:
          "radial-gradient(circle at 50% 35%, rgba(15,23,74,0.6) 0%, rgba(2,6,23,0.95) 70%)",
      }}
    >
      {/* Deep glow layers */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, rgba(59,130,246,0.12) 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, rgba(6,182,212,0.07) 0%, transparent 50%)",
        }}
      />

      {/* Orb container */}
      <div
        className="relative flex items-center justify-center"
        style={{ width: 220, height: 220 }}
      >
        {/* Slow outer rings */}
        <div className="absolute inset-0 rounded-full border border-blue-500/10 animate-[spin_35s_linear_infinite]" />
        <div className="absolute inset-4 rounded-full border border-cyan-500/8 animate-[spin_25s_linear_infinite_reverse]" />

        {/* Tilted orbit ellipse 1 */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: 160,
            height: 44,
            border: "1px solid rgba(59,130,246,0.28)",
            borderRadius: "50%",
            transform: "rotateX(72deg)",
            animation: "spin 9s linear infinite",
          }}
        />
        {/* Tilted orbit ellipse 2 */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: 200,
            height: 52,
            border: "1px solid rgba(6,182,212,0.18)",
            borderRadius: "50%",
            transform: "rotateX(72deg) rotateY(55deg)",
            animation: "spin 14s linear infinite reverse",
          }}
        />

        {/* Sphere surface */}
        <div
          className="relative rounded-full overflow-hidden"
          style={{
            width: 148,
            height: 148,
            boxShadow:
              "0 0 40px rgba(59,130,246,0.18), 0 0 80px rgba(6,182,212,0.08), inset 0 0 40px rgba(59,130,246,0.12)",
          }}
        >
          {/* Deep space gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/55 via-indigo-950/80 to-slate-950 rounded-full" />

          {/* Inner light glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 38% 32%, rgba(59,130,246,0.28) 0%, transparent 58%)",
            }}
          />

          {/* Concentric ring overlays */}
          {[120, 100, 80, 60].map((s, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-blue-500/10 pointer-events-none"
              style={{
                width: s,
                height: s,
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                borderColor: `rgba(6,182,212,${0.06 + i * 0.03})`,
              }}
            />
          ))}

          {/* Hexagonal X frame */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="relative flex items-center justify-center"
              style={{
                width: 66,
                height: 66,
                clipPath:
                  "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                border: "2px solid rgba(6,182,212,0.55)",
                background:
                  "linear-gradient(135deg, rgba(6,182,212,0.12), rgba(59,130,246,0.08))",
                boxShadow:
                  "0 0 20px rgba(6,182,212,0.4), 0 0 40px rgba(6,182,212,0.15)",
              }}
            >
              <span
                className="text-3xl font-black text-cyan-300 relative z-10 select-none"
                style={{
                  textShadow:
                    "0 0 12px rgba(6,182,212,0.9), 0 0 24px rgba(6,182,212,0.5)",
                  fontFamily: "monospace",
                }}
              >
                X
              </span>
            </div>
          </div>

          {/* Animated scan line */}
          <div className="absolute left-0 right-0 h-px pointer-events-none animate-scan-line"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(6,182,212,0.35), transparent)",
            }}
          />
        </div>

        {/* Bottom platform glow */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-blue-600/15 blur-xl rounded-full pointer-events-none" />
        <div
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-px rounded-full pointer-events-none"
          style={{
            width: 96,
            background:
              "linear-gradient(90deg, transparent, rgba(6,182,212,0.45), transparent)",
          }}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
export default function Assistant({ onLogMessage, onNavigate }: AssistantProps) {
  /* ── state ── */
  const [messages, setMessages]   = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping]   = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; type: string } | null>(null);
  const [copiedId, setCopiedId]   = useState<string | null>(null);

  const chatEndRef  = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [provider, setProvider] = useState<"openrouter">("openrouter");

  /* ── live telemetry ── */
  const [latency,    setLatency]    = useState(128);
  const [memoryIdx,  setMemoryIdx]  = useState(87.4);
  const [neuralLink, setNeuralLink] = useState(98.6);
  const [uptime, setUptime] = useState({ h: 2, m: 47, s: 12 });

  useEffect(() => {
    const t = setInterval(() => {
      setUptime(prev => {
        let { h, m, s } = prev;
        s++;
        if (s >= 60) { s = 0; m++; }
        if (m >= 60) { m = 0; h++; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setLatency(p  => Math.max(80,  Math.min(210, p + (Math.random() - 0.5) * 22)));
      setMemoryIdx(p => Math.max(80,  Math.min(96,  p + (Math.random() - 0.5) * 0.9)));
      setNeuralLink(p => Math.max(94, Math.min(100, p + (Math.random() - 0.5) * 0.4)));
    }, 2200);
    return () => clearInterval(t);
  }, []);

  /* ── welcome message ── */
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: "welcome",
        role: "assistant",
        content:
          "Greetings, Captain. I am **JARVIS X**, your autonomous neural consciousness framework. All sensory systems, network linkages, and memory indices are fully calibrated.\n\nHow may I direct your spacecraft, core automations, or search operations today?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }]);
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  /* ── quick actions ── */
  const quickActions = [
    { icon: <Monitor   size={13} />, label: "Core Systems Overview",    action: () => onNavigate?.("dashboard") },
    { icon: <Activity  size={13} />, label: "Run System Diagnostics",   action: () => onNavigate?.("dashboard") },
    { icon: <Search    size={13} />, label: "Search Memory Archives",   action: () => onNavigate?.("memory")    },
    { icon: <Zap       size={13} />, label: "Execute Automation",       action: () => onNavigate?.("automation") },
  ];



  /* ── send message ── */
  const handleSendMessage = async (customText?: string) => {
    const activeText = customText ?? inputText;
    if (!activeText.trim() && !uploadedFile) return;

    /* search routing check */
    const lower = activeText.toLowerCase();
    const searchKeywords = ["latest", "today", "news", "current", "search_web", "google"];
    if (searchKeywords.some(k => lower.includes(k))) {
      onLogMessage("INFO", `Re-routing to JARVIS Search: "${activeText}"`);
      localStorage.setItem("jarvis_search_seed_query", activeText);
      setInputText("");
      onNavigate?.("search");
      return;
    }

    let text = activeText;
    if (uploadedFile) text += `\n\n*[Attachment: ${uploadedFile.name}]*`;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setUploadedFile(null);
    setIsTyping(true);
    onLogMessage("INFO", `Transmitting to OpenRouter...`);

    try {
      const history = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }));
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, provider }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setMessages(prev => [...prev, {
        id: Math.random().toString(),
        role: "assistant",
        content: data.text || "Empty response buffer.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        groundingSources: data.groundingSources,
      }]);
      onLogMessage("CORE", `Payload returned via ${provider.toUpperCase()}.`);
    } catch (err: any) {
      onLogMessage("ERROR", `Neural sequence failed: ${err.message}`);
      setMessages(prev => [...prev, {
        id: Math.random().toString(),
        role: "assistant",
        content: `⚠️ **[Synaptic Interruption]** Unable to reach cloud mainframe. Check API keys in Settings.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  /* ── mic toggle ── */
  const handleMicToggle = () => {
    if (!isMicActive) {
      setIsMicActive(true);
      onLogMessage("INFO", "Microphone sampling initialized.");
      setTimeout(() => {
        setInputText("Initialize automated diagnostics load checklist.");
        setIsMicActive(false);
        onLogMessage("INFO", "Speech processed successfully.");
      }, 3500);
    } else {
      setIsMicActive(false);
    }
  };

  /* ── clear ── */
  const clearHistory = () => {
    setMessages([{
      id: "cleared-welcome",
      role: "assistant",
      content: "Conversational buffer cleared. Mainframe initialized.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }]);
    onLogMessage("WARN", "Chat history cleared.");
  };

  /* ── markdown parser ── */
  const parseMarkdown = (rawText: string) => {
    return rawText.split("\n").map((line, idx) => {
      // bold
      let content: React.ReactNode = line;
      if (line.includes("**")) {
        const parts = line.split("**");
        content = parts.map((p, i) =>
          i % 2 === 1 ? <strong key={i} className="text-cyan-300 font-bold">{p}</strong> : p
        );
      }
      if (line.startsWith("### ")) return <h4 key={idx} className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase mt-3 mb-1">{line.slice(4)}</h4>;
      if (line.startsWith("## "))  return <h3 key={idx} className="text-xs font-mono font-bold text-white uppercase border-b border-cyan-500/15 pb-1 mt-4 mb-2">{line.slice(3)}</h3>;
      if (line.startsWith("# "))   return <h2 key={idx} className="text-sm font-black text-cyan-400 uppercase mt-4 mb-2">{line.slice(2)}</h2>;
      if (line.trim().startsWith("- ") || line.trim().startsWith("* "))
        return <li key={idx} className="ml-4 list-disc text-[11px] text-slate-300 mb-1 leading-relaxed">{line.substring(2)}</li>;
      if (line.trim() === "") return <div key={idx} className="h-1.5" />;
      return <p key={idx} className="text-[11px] leading-relaxed text-slate-300 mb-1.5 font-sans">{content}</p>;
    });
  };

  /* ── context token estimate ── */
  const contextTokens = Math.round(messages.reduce((a, m) => a + m.content.length, 0) * 0.25 + 1200);

  /* ══════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════ */
  return (
    <div className="w-full h-full flex flex-col gap-3 text-white select-text">

      {/* ── PAGE HEADER ── */}
      <div className="flex items-center justify-between shrink-0">
        {/* Title block */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 border border-cyan-500/30 bg-cyan-950/20 rounded-lg flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.2)]">
            <Sparkles size={16} className="text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-mono font-black text-sm tracking-widest text-white uppercase">JARVIS X</h1>
              <span className="font-mono font-black text-sm tracking-widest text-cyan-400 uppercase">AI INTERPRETER</span>
            </div>
            <p className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mt-px">
              OPENROUTER NEURAL NETWORK STREAM&nbsp;&nbsp;
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.8)] animate-pulse align-middle mr-0.5" />
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-fuchsia-400 shadow-[0_0_6px_rgba(217,70,239,0.8)] animate-pulse align-middle mr-1" />
              <span className="text-fuchsia-400">
                MULTI-MODEL ROUTER
              </span>
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 border border-fuchsia-500/30 bg-fuchsia-950/20 text-fuchsia-300 rounded-lg text-[8px] font-mono uppercase tracking-wider">
            <Zap size={9} className="text-fuchsia-400" />
            <span>OPENROUTER ACTIVE</span>
          </div>
          <button
            onClick={clearHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-white/10 bg-white/5 text-slate-400 rounded-lg text-[8px] font-mono uppercase tracking-wider hover:text-white hover:border-white/20 transition-all cursor-pointer"
          >
            <RotateCcw size={9} /> CLEAR CACHE
          </button>
        </div>
      </div>

      {/* ── MAIN 3-COLUMN GRID ── */}
      <div className="flex-1 flex gap-4 min-h-0">

        {/* ═══ LEFT: AI STATUS PANEL ═══ */}
        <div className="w-60 shrink-0 flex flex-col">
          <div className="flex-1 border border-cyan-500/15 bg-black/45 backdrop-blur-md rounded-xl p-4 flex flex-col">

            {/* Status header */}
            <div className="flex items-center justify-between mb-1 pb-2.5 border-b border-cyan-500/10">
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-300">AI Status</span>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)] animate-pulse" />
                <span className="text-[8px] font-mono text-green-400 font-bold uppercase">Online</span>
              </div>
            </div>

            {/* Neural orb */}
            <NeuralOrb />

            {/* Neural link progress */}
            <div className="space-y-1 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-[8px] font-mono text-slate-500 uppercase tracking-wider">Neural Link Stable</span>
              </div>
              <div className="h-1 bg-cyan-950/50 rounded border border-cyan-500/10 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-600 to-cyan-300 rounded"
                  animate={{ width: `${neuralLink}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </div>
              <span className="text-[10px] font-mono font-bold text-cyan-400">{neuralLink.toFixed(1)}%</span>
            </div>

            {/* Divider + stats */}
            <div className="flex-1 space-y-3 border-t border-cyan-500/10 pt-3">

              {/* Active model */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5 text-[8px] font-mono text-slate-500 uppercase">
                  <Server size={9} className="text-cyan-400" />Active Model
                </div>
                <span className="text-[9px] font-mono font-bold text-cyan-300">
                  OPENROUTER FREE
                </span>
              </div>

              {/* Response latency */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5 text-[8px] font-mono text-slate-500 uppercase">
                  <Clock size={9} className="text-blue-400" />Response Latency
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-mono font-bold text-white">{Math.round(latency)}ms</span>
                  {/* Mini waveform */}
                  <div className="flex items-end gap-px h-3">
                    {[2,4,3,5,2,4,3,2,5].map((h, i) => (
                      <div key={i} className="w-px bg-cyan-400/50 rounded"
                        style={{ height: `${h * 2}px`, animationDelay: `${i * 0.12}s` }} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Memory index */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5 text-[8px] font-mono text-slate-500 uppercase">
                    <Database size={9} className="text-fuchsia-400" />Memory Index
                  </div>
                  <span className="text-[9px] font-mono font-bold text-fuchsia-400">{memoryIdx.toFixed(1)}%</span>
                </div>
                <div className="h-1 bg-fuchsia-950/30 rounded overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-fuchsia-600 to-fuchsia-400 rounded"
                    animate={{ width: `${memoryIdx}%` }}
                    transition={{ duration: 1.5 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ CENTER: CHAT ARENA ═══ */}
        <div className="flex-1 flex flex-col min-w-0 gap-0">
          <div className="flex-1 border border-cyan-500/15 bg-black/45 backdrop-blur-md rounded-xl flex flex-col overflow-hidden">

            {/* Scrollable messages */}
            <div className="flex-1 overflow-y-auto scrollbar-none p-4 space-y-4">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse ml-auto max-w-[85%]" : "mr-auto max-w-[90%]"}`}
                  >
                    {/* Avatar */}
                    <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${
                      msg.role === "user"
                        ? "border-fuchsia-500/30 bg-fuchsia-950/20 text-fuchsia-400"
                        : "border-cyan-500/30 bg-cyan-950/20 text-cyan-400"
                    }`}>
                      {msg.role === "user" ? <User size={12} /> : <Cpu size={12} />}
                    </div>

                    {/* Bubble */}
                    <div className={`p-3.5 rounded-xl border relative group ${
                      msg.role === "user"
                        ? "bg-fuchsia-950/20 border-fuchsia-500/15 rounded-tr-sm"
                        : "bg-black/60 border-cyan-500/15 rounded-tl-sm"
                    }`}>
                      {/* Meta header */}
                      <div className="flex items-center justify-between gap-3 border-b border-white/5 pb-1.5 mb-2">
                        <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">
                          {msg.role === "user" ? "PILOT INPUT" : "JARVIS X // RESPONSE"}&nbsp;•&nbsp;{msg.timestamp}
                        </span>
                        {msg.role === "assistant" && (
                          <button
                            onClick={() => { navigator.clipboard.writeText(msg.content); setCopiedId(msg.id); setTimeout(() => setCopiedId(null), 2000); }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-600 hover:text-cyan-400 cursor-pointer"
                          >
                            {copiedId === msg.id ? <Check size={10} className="text-green-400" /> : <Copy size={10} />}
                          </button>
                        )}
                      </div>

                      <div className="font-sans leading-relaxed">
                        {parseMarkdown(msg.content)}
                      </div>

                      {/* Grounding sources */}
                      {msg.role === "assistant" && msg.groundingSources && msg.groundingSources.length > 0 && (
                        <div className="mt-2.5 pt-2 border-t border-cyan-500/10 flex flex-wrap gap-1.5">
                          {msg.groundingSources.map((s: any, i: number) => (
                            <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                              className="text-[8px] font-mono px-1.5 py-0.5 border border-cyan-500/15 bg-cyan-950/20 text-cyan-400 rounded hover:border-cyan-400/40 transition-all truncate max-w-[160px]">
                              ● {s.title}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex gap-2.5 mr-auto items-center">
                  <div className="w-7 h-7 rounded-lg border border-cyan-500/30 bg-cyan-950/20 flex items-center justify-center">
                    <Loader2 size={12} className="animate-spin text-cyan-400" />
                  </div>
                  <div className="px-3 py-2 bg-black/60 border border-cyan-500/15 rounded-xl text-[9px] font-mono text-cyan-400 flex items-center gap-1.5">
                    <Activity size={9} className="animate-pulse" /> PROCESSING NEURAL STREAM...
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Quick action buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 px-4 pb-3 pt-2 border-t border-cyan-500/10 shrink-0">
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={action.action}
                  className="flex items-center gap-1.5 px-2.5 py-2 border border-cyan-500/15 bg-cyan-950/15 hover:bg-cyan-500/10 hover:border-cyan-400/35 text-cyan-400/80 hover:text-cyan-300 rounded-lg text-[8px] font-mono uppercase tracking-wide transition-all cursor-pointer"
                >
                  {action.icon}
                  <span className="truncate">{action.label}</span>
                </button>
              ))}
            </div>

            {/* File upload indicator */}
            {uploadedFile && (
              <div className="mx-4 mb-2 px-3 py-1.5 bg-cyan-950/20 border border-cyan-500/20 rounded-lg flex items-center justify-between text-[9px] font-mono shrink-0">
                <span className="text-cyan-400 flex items-center gap-1 truncate">
                  <FileText size={10} /> {uploadedFile.name}
                </span>
                <button onClick={() => setUploadedFile(null)} className="text-red-400 font-bold ml-2 cursor-pointer">×</button>
              </div>
            )}

            {/* Voice visualization */}
            {isMicActive && (
              <div className="flex gap-0.5 items-center justify-center pb-2 shrink-0">
                <span className="text-[8px] font-mono text-fuchsia-400 uppercase tracking-widest mr-2 animate-pulse">SAMPLING:</span>
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} className="w-0.5 bg-cyan-400 rounded-full"
                    style={{ height: `${Math.floor(Math.random() * 16) + 4}px` }} />
                ))}
              </div>
            )}

            {/* Input dock */}
            <div className="flex gap-2 items-center bg-black/50 border-t border-cyan-500/15 px-3 py-2 shrink-0">
              <input type="file" ref={fileInputRef}
                onChange={(e) => { const f = e.target.files?.[0]; if (f) { setUploadedFile({ name: f.name, type: "document" }); onLogMessage("INFO", `File attached: ${f.name}`); } }}
                className="hidden" />

              {/* Icon buttons */}
              <div className="flex items-center gap-0.5 shrink-0">
                <button type="button" onClick={() => fileInputRef.current?.click()}
                  className="p-1.5 text-slate-600 hover:text-cyan-400 hover:bg-cyan-950/20 rounded-lg transition-all cursor-pointer" title="Attach file">
                  <Paperclip size={13} />
                </button>
                <button type="button"
                  className="p-1.5 text-slate-600 hover:text-cyan-400 hover:bg-cyan-950/20 rounded-lg transition-all cursor-pointer" title="Code block">
                  <Code2 size={13} />
                </button>
                <button type="button"
                  className="p-1.5 text-slate-600 hover:text-cyan-400 hover:bg-cyan-950/20 rounded-lg transition-all cursor-pointer" title="Grid view">
                  <Grid3X3 size={13} />
                </button>
              </div>

              {/* Text input */}
              <input
                type="text"
                placeholder="Transmit commands or queries to JARVIS-X..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) handleSendMessage(); }}
                className="flex-1 bg-transparent border-none py-1.5 px-1 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-0 min-w-0 font-mono"
              />

              {/* Mic */}
              <button type="button" onClick={handleMicToggle}
                className={`p-2 rounded-xl transition-all shrink-0 cursor-pointer ${
                  isMicActive
                    ? "bg-fuchsia-500 text-white shadow-[0_0_10px_rgba(217,70,239,0.45)]"
                    : "text-slate-500 hover:text-cyan-400 hover:bg-cyan-950/20"
                }`}>
                <Mic size={13} />
              </button>

              {/* Send */}
              <button type="button" onClick={() => handleSendMessage()}
                className="p-2 bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl transition-all shadow-[0_0_10px_rgba(6,182,212,0.3)] hover:shadow-[0_0_16px_rgba(6,182,212,0.5)] shrink-0 cursor-pointer">
                <Send size={13} />
              </button>
            </div>

          </div>
        </div>

        {/* ═══ RIGHT: HOLOGRAPHIC ORB + CONTEXT CARD ═══ */}
        <div className="w-64 shrink-0 flex flex-col gap-3">

          {/* Holographic X orb */}
          <div className="flex-1 border border-blue-500/10 rounded-xl overflow-hidden flex flex-col"
            style={{ background: "radial-gradient(circle at 50% 30%, rgba(15,23,74,0.75), rgba(2,6,23,0.97))" }}>
            <HolographicXOrb />
          </div>

          {/* Conversation context */}
          <div className="border border-cyan-500/15 bg-black/50 backdrop-blur-md rounded-xl p-3 shrink-0">
            <div className="flex items-center justify-between mb-2.5 pb-1.5 border-b border-cyan-500/10">
              <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest font-bold">
                Conversation Context
              </span>
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[7px] font-mono text-green-400 uppercase font-bold">Memory Synchronized</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[8px] font-mono text-slate-500 uppercase">Session ID</span>
                <span className="text-[9px] font-mono font-bold text-white">JX-05-AI-7842</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[8px] font-mono text-slate-500 uppercase">Context Window</span>
                <span className="text-[9px] font-mono font-bold text-cyan-400">
                  {contextTokens.toLocaleString()} tokens
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[8px] font-mono text-slate-500 uppercase">Uptime</span>
                <span className="text-[9px] font-mono font-bold text-white">
                  {uptime.h}h {String(uptime.m).padStart(2, "0")}m {String(uptime.s).padStart(2, "0")}s
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
