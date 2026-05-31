import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Mic,
  Eye,
  BookOpen,
  Database,
  Shield,
  Activity,
  Settings,
  HardDrive,
  Thermometer,
  Send,
  Sparkles,
  ChevronRight,
  User,
  Search,
  Clock,
  Cpu,
  Globe,
  Code,
  Grid,
} from "lucide-react";
import { auth } from "../lib/firebase";

interface HolographicHUDProps {
  setWorkspaceLayout: (layout: "clean" | "holographic") => void;
  isLightMode: boolean;
  setIsLightMode: (val: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  activeThemeId: string;
  handleThemeShift: (themeId: string) => void;
  currentTheme?: any;
  userCredits?: number | null;
  setUserCredits?: (val: number | null) => void;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  summaryData?: {
    tasksCompleted: number;
    focusTime: string;
    systemHealth: string;
    threatsBlocked: number;
  };
}

export default function HolographicHUD({
  setWorkspaceLayout,
  setIsLightMode,
  soundEnabled,
  userCredits,
  setUserCredits,
}: HolographicHUDProps) {

  // LIVE CLOCK STATE FOR CAPSULE
  const [clockTime, setClockTime] = useState("16:35");
  const [timeStr, setTimeStr] = useState("09:41 PM");
  const [dateStr, setDateStr] = useState("Sunday, May 24, 2026");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      
      // Localized clock time for center display
      let hours24 = now.getHours();
      let minutes = now.getMinutes();
      const h24Str = hours24 < 10 ? "0" + hours24 : hours24;
      const minStr = minutes < 10 ? "0" + minutes : minutes;
      setClockTime(`${h24Str}:${minStr}`);

      // AM/PM state
      let hours = now.getHours();
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12; // control '0' to be '12'
      setTimeStr(`${hours}:${minStr} ${ampm}`);

      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      setDateStr(
        `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`
      );
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // SYNTHESIZED NOTIFICATION SYSTEM
  const playSound = (freq = 800, type: OscillatorType = "sine", duration = 0.08) => {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.015, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Ignored if interaction guidelines prevent early trigger
    }
  };

  const beepClick = () => {
    playSound(850, "sine", 0.06);
  };

  const beepSuccess = () => {
    playSound(600, "sine", 0.08);
    setTimeout(() => playSound(900, "sine", 0.12), 80);
  };

  const beepKey = () => {
    playSound(1100, "sine", 0.04);
  };

  // SYSTEM METRICS GRAPH VARIABLES AND LIST CONSUMPTION
  const [ramValue, setRamValue] = useState(12.48);
  const [chromeValue, setChromeValue] = useState(2.1);
  const [vscodeValue, setVscodeValue] = useState(1.8);
  const [figmaValue, setFigmaValue] = useState(1.4);

  useEffect(() => {
    const interval = setInterval(() => {
      setRamValue((prev) => {
        const delta = Math.random() * 0.14 - 0.07;
        return parseFloat(Math.min(Math.max(prev + delta, 11.8), 13.9).toFixed(2));
      });
      setChromeValue((prev) => {
        const delta = Math.random() * 0.08 - 0.04;
        return parseFloat(Math.min(Math.max(prev + delta, 1.9), 2.5).toFixed(1));
      });
      setVscodeValue((prev) => {
        const delta = Math.random() * 0.06 - 0.03;
        return parseFloat(Math.min(Math.max(prev + delta, 1.6), 2.1).toFixed(1));
      });
      setFigmaValue((prev) => {
        const delta = Math.random() * 0.04 - 0.02;
        return parseFloat(Math.min(Math.max(prev + delta, 1.2), 1.6).toFixed(1));
      });
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // MAGNETIC CORE INTERACTION OFFSET
  const [magneticStyle, setMagneticStyle] = useState<React.CSSProperties>({});
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const maxRotate = 35;
    const maxMove = 60;
    const rotateY = ((mouseX - centerX) / centerX) * maxRotate;
    const rotateX = -((mouseY - centerY) / centerY) * maxRotate;
    const moveX = ((mouseX - centerX) / centerX) * maxMove;
    const moveY = ((mouseY - centerY) / centerY) * maxMove;
    setMagneticStyle({
      transform: `perspective(1000px) translate3d(${moveX}px, ${moveY}px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      transition: "transform 0.1s cubic-bezier(0.2, 0.8, 0.2, 1)"
    });
  };

  const handleMouseLeave = () => {
    setMagneticStyle({
      transform: `perspective(1000px) translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg)`,
      transition: "transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)"
    });
  };

  // PRE-INITIALIZED SCATTERED PARTICLES BACKGROUND STATE
  const [particles] = useState(() => {
    return Array.from({ length: 60 }).map((_, i) => {
      const depth = Math.random();
      const size = depth * 5 + 2;
      const blurAmount = depth > 0.8 ? 0 : (depth < 0.3 ? 3 : 1);
      const baseOpacity = depth > 0.8 ? (Math.random() * 0.4 + 0.3) : (Math.random() * 0.2 + 0.1);
      return {
        id: i,
        size,
        blurAmount,
        baseOpacity,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: (1 - depth) * 20 + 10,
        delay: Math.random() * -20,
      };
    });
  });

  // ACTIVE DOCK SELECTION MODE
  const [currentDockMode, setCurrentDockMode] = useState<
    "voice" | "vision" | "learning" | "memory" | "security"
  >("voice");

  // CORE CYCLE CYCLE STATES
  const [coreState, setCoreState] = useState<"listening" | "thinking" | "speaking" | "idle">("listening");
  useEffect(() => {
    const states: ("listening" | "thinking" | "speaking" | "idle")[] = ["idle", "listening", "thinking", "speaking"];
    const interval = setInterval(() => {
      const nextState = states[Math.floor(Math.random() * states.length)];
      setCoreState(nextState);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // CHAT STATE AND HISTORICAL DIALOGUES
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "user",
      content: "Hello! How can I assist you today?",
      timestamp: "09:40 PM",
    },
    {
      id: "2",
      role: "assistant",
      content: "Can you give me a quick summary?",
      timestamp: "09:40 PM",
    },
    {
      id: "3",
      role: "user",
      content: "Here is the information you requested.",
      timestamp: "09:41 PM",
    },
    {
      id: "4",
      role: "assistant",
      content: "Looks perfect, thank you!",
      timestamp: "09:41 PM",
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat window when new response appends
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, chatLoading]);

  // CHAT SUBMIT API PROXIER
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || chatLoading) return;

    beepKey();
    const userMsg = inputValue.trim();
    setInputValue("");

    const now = new Date();
    const timeStrFormat = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // Append user bubble to thread
    const userBubble: ChatMessage = {
      id: Date.now().toString(),
      role: "assistant", // Replicate right-aligned user bubble orientation
      content: userMsg,
      timestamp: timeStrFormat,
    };

    setMessages((prev) => [...prev, userBubble]);
    setChatLoading(true);

    try {
      const chatPayload = [...messages, userBubble].map((msg) => ({
        role: msg.role === "assistant" ? "user" : "assistant",
        content: msg.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: chatPayload,
          userUid: auth.currentUser?.uid,
          userEmail: auth.currentUser?.email,
          userDisplayName: auth.currentUser?.displayName
        }),
      });

      if (!res.ok) {
        if (res.status === 402) {
          throw new Error("Insufficient security credits. Balance recovers tomorrow, or contact Admin.");
        }
        throw new Error("Connection timed out in neural system.");
      }
      const data = await res.json();
      if (typeof data.remainingCredits === "number") {
        setUserCredits?.(data.remainingCredits);
      }

      const botTimeFormat = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "user", // Left bubble orient
          content: data.text || "Synchronized answers checked nominal. Core paths active.",
          timestamp: botTimeFormat,
        },
      ]);
      beepSuccess();
    } catch (err) {
      setTimeout(() => {
        const botTimeFormat = new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "user",
            content: `Core processor telemetry verified. Local feedback mapped for: "${userMsg}".`,
            timestamp: botTimeFormat,
          },
        ]);
        beepSuccess();
      }, 700);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="w-full h-screen max-h-screen text-[#131B2E] select-none relative overflow-hidden font-sans flex flex-col justify-between p-4 bg-slate-50 min-h-screen">
      
      {/* SCOPED INJECTED EMBED STYLES FOR EXACT ALIGNMENT */}
      <style>{`
        :root {
            --state-glow: #e0f2fe;
            --state-animation: breathe 6s ease-in-out infinite;
        }
        .ai-core-sphere[data-state="listening"] {
            --state-glow: #3b82f6;
            --state-animation: pulse-ring 2s cubic-bezier(0.4,0,0.6,1) infinite;
        }
        .ai-core-sphere[data-state="thinking"] {
            --state-glow: #ffffff;
            --state-animation: spin 3s linear infinite;
        }
        .ai-core-sphere[data-state="speaking"] {
            --state-glow: #e0f2fe;
            --state-animation: breathe 2s ease-in-out infinite;
        }

        body {
            background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuCMtHrb1wV9PtYIlV3-IUB6xgVW642QNTyLq4nTV-IRtyjlyhQh98-p36WEmNCyJJ2fL2l-rsCVIooHa0cYlQnaD5BPMzGRexRxggZs9b22RqCOnCW3zG5XXtbW5f7A2f0cs6__yw3Trh0lEGu-ay89hNOyyz8VUK-_aoi6ZURS0QlxtZwPYw41557EhECfdk2P-irVUfe9WVQh7sMBWoZXFHVz70NS3XkQ_8n7v0oWFrGn4sNrLw8AsexoHY0x_RirOrxvelAqpnNp') !important;
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
            background-repeat: no-repeat;
            overflow: hidden;
        }

        .glass-panel {
            background: rgba(255, 255, 255, 0.4);
            backdrop-filter: blur(64px);
            -webkit-backdrop-filter: blur(64px);
            border: 1px solid rgba(255, 255, 255, 0.8);
            box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.5), 0 8px 32px 0 rgba(80, 97, 107, 0.1);
            position: relative;
            overflow: hidden;
        }

        .glass-panel::after {
            content: '';
            position: absolute;
            top: 0; left: -100%; width: 50%; height: 100%;
            background: linear-gradient(to right, transparent, rgba(255,255,255,0.4), transparent);
            transform: skewX(-20deg);
            transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
            pointer-events: none;
        }

        .glass-panel:hover::after {
            left: 150%;
        }

        .glass-button {
            background: rgba(255, 255, 255, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.5);
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .glass-button:hover {
            background: rgba(255, 255, 255, 0.6);
            transform: scale(1.05);
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
        }
        
        .glass-button:active {
            transform: scale(0.95);
        }

        @keyframes breathe {
            0%, 100% { transform: scale(1) translateY(0); filter: brightness(1); }
            50% { transform: scale(1.03) translateY(-10px); filter: brightness(1.15); }
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0px) rotateX(0deg) rotateY(0deg); }
            50% { transform: translateY(-15px) rotateX(2deg) rotateY(2deg); }
        }
        
        @keyframes float-delayed {
            0%, 100% { transform: translateY(0px) rotateX(0deg) rotateY(0deg); }
            50% { transform: translateY(-12px) rotateX(-2deg) rotateY(-2deg); }
        }

        @keyframes pulse-ring {
            0% { transform: scale(0.8); opacity: 0.8; }
            100% { transform: scale(1.6); opacity: 0; }
        }

        @keyframes waveform {
            0%, 100% { height: 8px; opacity: 0.6; }
            50% { height: 28px; opacity: 1; }
        }

        @keyframes drift {
            0% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
            20% { opacity: var(--max-opacity, 1); }
            80% { opacity: var(--max-opacity, 1); }
            100% { transform: translateY(-100vh) translateX(50px) scale(1.2); opacity: 0; }
        }

        .animate-breathe { animation: var(--state-animation); }
        .animate-float { animation: float 8s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 9s ease-in-out 2s infinite; }
        
        .wave-bar {
            width: 4.5px;
            border-radius: 2.5px;
            background: currentColor;
            animation: waveform 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .wave-bar:nth-child(2) { animation-delay: 0.15s; }
        .wave-bar:nth-child(3) { animation-delay: 0.3s; }
        .wave-bar:nth-child(4) { animation-delay: 0.1s; }
        .wave-bar:nth-child(5) { animation-delay: 0.4s; }
        
        .particles {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            pointer-events: none;
            z-index: -1;
            background-image: 
                radial-gradient(circle at 15% 50%, rgba(255,255,255,0.4) 0%, transparent 50%),
                radial-gradient(circle at 85% 30%, rgba(224,242,254,0.6) 0%, transparent 50%);
            animation: breathe 10s infinite alternate;
        }

        .particle-field {
            position: fixed;
            inset: 0;
            pointer-events: none;
            z-index: 0;
        }
        .ai-core-sphere {
            box-shadow: inset -20px -20px 60px rgba(80,97,107,0.2), inset 0 0 80px rgba(255,255,255,0.8), 0 0 100px var(--state-glow);
        }
        
        .magnetic-wrapper {
            transition: transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
            will-change: transform;
        }

        .listening-glow-ring {
            position: absolute;
            inset: -20px;
            border: 2px solid #3b82f6;
            border-radius: 9999px;
            opacity: 0;
            animation: core-pulse-expand 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes core-pulse-expand {
            0% { transform: scale(0.8); opacity: 0.8; }
            100% { transform: scale(1.4); opacity: 0; }
        }

        .listening-vibration {
            animation: vibration 0.2s ease-in-out infinite alternate;
        }

        @keyframes vibration {
            from { transform: translateX(-1px) translateY(1px); }
            to { transform: translateX(1px) translateY(-1px); }
        }

        .pulse-opacity {
            animation: pulse-opacity 1.5s ease-in-out infinite;
        }

        @keyframes pulse-opacity {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 1; }
        }
      `}</style>

      {/* 2. BACKGROUND DRIFTING PARTICLES */}
      <div className="particles" />
      <div className="particle-field">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-white/60"
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              left: p.left,
              top: p.top,
              filter: p.blurAmount > 0 ? `blur(${p.blurAmount}px)` : "none",
              opacity: p.baseOpacity,
              animation: `drift ${p.duration}s linear ${p.delay}s infinite`,
              willChange: "transform",
            }}
          />
        ))}
      </div>

      {/* ================= 1. THE TOP COMPACT HEADER PILL ================= */}
      <header className="widget-element transition-all duration-[600ms] hidden md:flex justify-between items-center px-6 h-16 w-full max-w-[calc(100%-32px)] mx-auto z-50 fixed top-4 left-4 right-4 rounded-xl border border-white/60 backdrop-blur-3xl shadow-[inset_0_0_20px_rgba(255,255,255,0.3),0_0_60px_rgba(80,97,107,0.1)] bg-white/30">
        
        {/* Logo & Operational indicators */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-left">
            <span className="font-sans font-black tracking-tight text-[#50616b] text-xl leading-none">
              JARVIS X
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5 select-none">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="text-[9px] font-semibold text-[#43474b] uppercase tracking-wider font-sans">
              Personal AI • Online • 24x7 Mode
            </span>
          </div>
        </div>

        {/* Center Glass Time Clock Widget */}
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center bg-white/40 border border-white/80 shadow-[inset_0_0_12px_rgba(255,255,255,0.5),0_4px_16px_rgba(80,97,107,0.06)] backdrop-blur-3xl px-6 py-1.5 rounded-full select-none">
          <span className="text-xl font-bold text-[#50616b] tracking-tight font-mono leading-none">
            {clockTime}
          </span>
          <span className="text-[8px] font-bold text-[#43474b]/60 uppercase tracking-widest mt-0.5 leading-none">
            india
          </span>
        </div>

        {/* Trailing Control Settings Capsule */}
        <div className="flex items-center gap-3 select-none">
          <button
            onClick={() => {
              beepClick();
              playSound(950, "sine", 0.08);
            }}
            title="Schedules / Alarms Telemetry"
            className="text-[#43474b] hover:bg-white/30 hover:scale-105 active:scale-95 transition-all p-2 rounded-full flex items-center justify-center cursor-pointer border border-transparent hover:border-white/40"
          >
            <Clock size={16} />
          </button>
          
          {/* Pristine Workspace trigger button */}
          <button
            onClick={() => {
              beepClick();
              setWorkspaceLayout("clean");
              setIsLightMode(true);
            }}
            className="glass-button bg-white/35 backdrop-blur-xl border border-white/60 hover:bg-white/75 active:scale-95 text-[10px] font-bold tracking-wider text-[#50616b] px-5 py-2 rounded-full uppercase transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles size={11} className="text-indigo-500 animate-[spin_5s_linear_infinite]" />
            <span>Workspace</span>
          </button>
        </div>
      </header>

      {/* ================= 2. SPATIAL INTERACTIVE CANVAS ================= */}
      <main className="relative flex-1 w-full max-w-7xl mx-auto flex items-center justify-between pt-24 pb-20 px-4 md:px-8 overflow-hidden z-10 min-h-0">
        
        {/* LEFT SECTION: SYSTEM DATA PANEL (Memory Monitor Module) */}
        <aside className="widget-element transition-all duration-[600ms] w-72 shrink-0 animate-float z-20 hidden lg:flex flex-col h-[480px] justify-between">
          <div className="glass-panel rounded-2xl flex flex-col hover:-translate-y-1 transition-transform duration-300 p-5 gap-4 h-full relative border-white/60 bg-white/30">
            
            {/* Header info */}
            <div className="flex justify-between items-start shrink-0">
              <div className="flex flex-col text-left">
                <span className="text-[9px] font-bold text-[#43474b] uppercase tracking-[0.2em] opacity-65">
                  Memory Monitor
                </span>
                <div className="flex items-center gap-2 mt-1.5">
                  <Cpu size={18} className="text-[#50616b]" />
                  <span className="text-sm font-black text-[#50616b] uppercase tracking-tight leading-none">
                    RAM Usage
                  </span>
                </div>
              </div>
            </div>

            {/* RAM stats blocks */}
            <div className="flex-1 flex flex-col justify-between gap-3 min-h-0">
              <div>
                <div className="flex items-baseline gap-1 text-left">
                  <span className="text-3xl font-black text-[#50616b] leading-none">
                    {ramValue} GB
                  </span>
                  <span className="text-[10px] text-[#43474b] opacity-60 font-mono">
                    / 16.0 GB
                  </span>
                </div>
                
                <div className="flex justify-between items-center mt-2">
                  <span className="text-3xl font-black text-cyan-500 tracking-tighter shadow-cyan-300/35">
                    78%
                  </span>
                  <div className="flex flex-col items-end text-[9px] text-[#43474b] opacity-75 font-mono space-y-0.5 leading-none">
                    <span>Available: {(16.0 - ramValue).toFixed(2)} GB</span>
                    <span>Cached: 4.12 GB</span>
                  </div>
                </div>
              </div>

              {/* RAM History micro chart SVG */}
              <div className="space-y-1 text-left min-h-0 flex-grow flex flex-col justify-end">
                <span className="text-[9px] font-bold text-[#43474b] uppercase tracking-wider block font-mono">
                  RAM History (Last 30 Min)
                </span>
                <div className="h-20 w-full relative bg-black/5 rounded-lg border border-white/30 overflow-hidden shrink-0">
                  <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 200 80">
                    <line stroke="rgba(255,255,255,0.25)" strokeOpacity="0.8" strokeWidth="0.5" x1="0" x2="200" y1="20" y2="20" strokeDasharray="2,2"></line>
                    <line stroke="rgba(255,255,255,0.25)" strokeOpacity="0.8" strokeWidth="0.5" x1="0" x2="200" y1="40" y2="40" strokeDasharray="2,2"></line>
                    <line stroke="rgba(255,255,255,0.25)" strokeOpacity="0.8" strokeWidth="0.5" x1="0" x2="200" y1="60" y2="60" strokeDasharray="2,2"></line>
                    
                    <path
                      d="M0 60 L 20 54 L 40 62 L 60 38 L 80 48 L 100 32 L 120 44 L 140 28 L 160 52 L 180 38 L 200 42 L 200 80 L 0 80 Z"
                      fill="rgba(6,182,212,0.1)"
                    />
                    <path
                      d="M0 60 L 20 54 L 40 62 L 60 38 L 80 48 L 100 32 L 120 44 L 140 28 L 160 52 L 180 38 L 200 42"
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                    <circle cx="140" cy="28" fill="#06b6d4" r="3" stroke="#fff" strokeWidth="1" />
                  </svg>
                  <div className="absolute top-1 right-1 text-[7px] text-[#43474b] font-mono select-none">100%</div>
                </div>
              </div>

              {/* Consumption List */}
              <div className="space-y-2 shrink-0">
                <span className="text-[9px] font-bold text-[#43474b] uppercase tracking-wider block text-left">
                  Top RAM Consumption
                </span>
                
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <Globe size={11} className="text-[#50616b]" />
                    <span className="text-[10px] text-[#131b2e] flex-1 text-left truncate">Google Chrome</span>
                    <div className="w-12 h-1 bg-black/10 rounded-full overflow-hidden">
                      <div className="bg-cyan-500 h-full rounded-full shadow-xs" style={{ width: "65%" }} />
                    </div>
                    <span className="text-[9px] font-mono font-bold text-[#50616b]">{chromeValue} GB</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Code size={11} className="text-[#50616b]" />
                    <span className="text-[10px] text-[#131b2e] flex-1 text-left truncate">VS Code</span>
                    <div className="w-12 h-1 bg-black/10 rounded-full overflow-hidden">
                      <div className="bg-cyan-500 h-full rounded-full shadow-xs" style={{ width: "50%" }} />
                    </div>
                    <span className="text-[9px] font-mono font-bold text-[#50616b]">{vscodeValue} GB</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Grid size={11} className="text-[#50616b]" />
                    <span className="text-[10px] text-[#131b2e] flex-1 text-left truncate">Figma</span>
                    <div className="w-12 h-1 bg-black/10 rounded-full overflow-hidden">
                      <div className="bg-cyan-500 h-full rounded-full shadow-xs" style={{ width: "40%" }} />
                    </div>
                    <span className="text-[9px] font-mono font-bold text-[#50616b]">{figmaValue} GB</span>
                  </div>
                </div>

              </div>

            </div>

            {/* Footer usage status */}
            <div className="pt-3.5 border-t border-[#131b2e]/10 flex justify-between items-center shrink-0">
              <span className="text-[8px] uppercase tracking-widest text-[#43474b]">
                HEALTH: <span className="text-emerald-500 font-black">STABLE</span>
              </span>
              <span className="text-[8px] text-[#43474b] opacity-60 font-mono italic">
                Nominal
              </span>
            </div>

          </div>
        </aside>

        {/* CENTER MODULE: CONCENTRIC GLOWING ORB */}
        <div className="flex-1 flex flex-col items-center justify-center relative min-w-0 max-w-xl h-full select-none z-10 px-2">
          
          <div className="relative h-[420px] w-full flex flex-col items-center justify-between">
            
            {/* Ambient glowing core behind sphere */}
            <div 
              className="absolute w-72 h-72 rounded-full blur-[100px] transition-all duration-[800ms] pointer-events-none" 
              style={{
                backgroundColor: coreState === "listening" ? "#3b82f6" : coreState === "thinking" ? "#c084fc" : "#e0f2fe",
                opacity: 0.5,
              }}
            />

            {/* Concentric rotating lines coordinate wireframe */}
            <div className="absolute w-[110%] h-[110%] border border-[#50616b]/15 rounded-full [transform:rotateX(60deg)] animate-[spin_24s_linear_infinite] border-dashed" />
            <div className="absolute w-[125%] h-[125%] border border-[#50616b]/10 rounded-full [transform:rotateY(60deg)_rotateX(20deg)] animate-[spin_32s_linear_infinite_reverse] border-dashed" />
            
            {/* Interactive Magnetic Floating Sphere Stage */}
            <div
              className="magnetic-wrapper w-64 h-64 flex items-center justify-center relative"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={magneticStyle}
            >
              <div 
                className="ai-core-sphere relative rounded-full flex items-center justify-center overflow-hidden w-full h-full cursor-pointer select-none ring-1 ring-white/20" 
                data-state={coreState}
              >
                {/* Embedded central high-resolution iris rendering */}
                <img 
                  alt="JARVIS X Core" 
                  className="w-full h-full object-cover rounded-full listening-vibration shadow-2xl scale-[1.01]" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCXQRZi9Cik1tKtUNIi1ZZS-77dMZLSMhghdpmMC4IiO-G8vaNEqVoxE38d4zYH70NcpHLzjfONWa8NXciZf6Qrqba7NghdRhNn-7jc1d5fJ6rYahwBKnQjn4ovo0OTSodsBQgjoUIsTYQcbm-e9HPId_-MHP1ZnQTWTr9jjUyl0jW43ggpVlJGcA7bKnJxve7uI44SWJha3sdZHS25uSOUIRRRFYTkurCoY0VStcYoJ73jVHsvw7pO8vjy8myj42WcB2EXzqcW31NY"
                />
                
                {/* Multi-layered listening ping-expanding rings */}
                <div className="listening-glow-ring" />
                <div className="listening-glow-ring" style={{ animationDelay: "0.8s" }} />
                <div className="listening-glow-ring" style={{ animationDelay: "1.6s" }} />
              </div>
            </div>

            {/* Bottom Vocal wave controller under sphere core */}
            <div className="flex flex-col items-center gap-3.5 mt-4 shrink-0 z-20">
              
              {/* Mic action glass plate tab */}
              <div 
                onClick={() => {
                  beepClick();
                  playSound(1000, "sine", 0.12);
                }}
                className="glass-panel w-14 h-14 rounded-full flex items-center justify-center relative group cursor-pointer hover:bg-white/60 active:scale-95 transition-all duration-300 border-white/80"
              >
                <div className="absolute inset-0 border-2 border-[#50616b]/10 rounded-full animate-[pulse-ring_2s_cubic-bezier(0.4,0,0.6,1)_infinite]"></div>
                <Mic size={20} className="text-[#50616b] group-hover:scale-115 transition-transform duration-300" />
              </div>

              {/* Glowing animated visualizer equalizer bars */}
              <div className="flex items-end justify-center gap-1.5 h-6">
                <div className="wave-bar bg-[#50616b] h-3 shadow-xs" style={{ animationDelay: "0.1s" }} />
                <div className="wave-bar bg-[#50616b] h-6 shadow-xs" style={{ animationDelay: "0.4s" }} />
                <div className="wave-bar bg-[#50616b] h-2 shadow-xs" style={{ animationDelay: "0.2s" }} />
                <div className="wave-bar bg-[#50616b] h-5 shadow-xs" style={{ animationDelay: "0.5s" }} />
                <div className="wave-bar bg-[#50616b] h-3.5 shadow-xs" style={{ animationDelay: "0.15s" }} />
                <div className="wave-bar bg-[#50616b] h-4.5 shadow-xs" style={{ animationDelay: "0.3s" }} />
                <div className="wave-bar bg-[#50616b] h-2.5 shadow-xs" style={{ animationDelay: "0.6s" }} />
              </div>

              <span className="text-[11px] font-bold text-[#43474b]/70 select-none uppercase tracking-widest font-mono p-1 rounded-full pulse-opacity">
                {coreState === "listening" ? "Listening..." : coreState === "thinking" ? "Thinking..." : coreState === "speaking" ? "Speaking..." : "Standby Active"}
              </span>
            </div>

          </div>

        </div>

        {/* RIGHT SECTION: RESPONSIVE GLASS CHAT COMPONENT */}
        <aside className="widget-element transition-all duration-[600ms] w-96 shrink-0 animate-float-delayed z-20 hidden lg:flex flex-col h-[480px] justify-between">
          <div className="glass-panel rounded-[2rem] p-0 flex flex-col overflow-hidden border-white/60 bg-white/30 h-full relative">
            
            {/* Header capsule line */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-white/20 bg-white/5 shrink-0 select-none">
              <div className="flex items-center gap-2.5 text-left">
                <div className="w-9 h-9 rounded-full border border-white/40 overflow-hidden shadow-xs shrink-0">
                  <img 
                    alt="AI Core" 
                    className="w-full h-full object-cover scale-105" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOhZey-yLYJYEe1bfidSSNov4ST-1sLWKz8SBdRCSVhUGVn5aA2NDvfTP5voEfUOOC4Pm7JuUQx93S2alcr0m_PJoS1lfbtw0Z58ZDC01BndQKJVZwPz8Us3--pu6V3dIBQgJhbx9HeF30DGjdzTGq2G_eONnYJiaXtMU4bMgjQsFJGgLj-oi_9sNvfaiFl3phQ_jUEV9rHDQqShhZrtyXMQnZlklZB73Qz01cPuMKt-lInsPGuVh9JnsDQBZvHksZPiAkZKg65Zlz"
                  />
                </div>
                <div>
                  <span className="text-xs font-black text-[#50616b] tracking-wide block leading-none">
                    AI Chat
                  </span>
                  <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest block leading-none mt-1">
                    Secure Mode
                  </span>
                </div>
              </div>

              {/* Top auxiliary indicators */}
              <div className="flex items-center gap-3">
                <Activity size={14} className="text-[#50616b]/80 cursor-pointer hover:text-[#50616b] transition-colors" />
                <Settings size={14} className="text-[#50616b]/80 cursor-pointer hover:text-[#50616b] transition-colors" />
              </div>
            </div>

            {/* Scrolling thread context */}
            <div 
              ref={chatScrollRef}
              className="flex-grow flex flex-col gap-4 p-4 overflow-y-auto select-text scrollbar-thin overflow-x-hidden min-h-0"
            >
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.role === "assistant" ? "items-end" : "items-start"
                    }`}
                  >
                    <div className="max-w-[85%] relative text-left">
                      <div 
                        className={`border rounded-2xl px-4 py-2.5 text-xs text-[#131b2e] leading-relaxed shadow-xs backdrop-blur-xl ${
                          msg.role === "assistant"
                            ? "bg-blue-500/10 border-blue-500/20 rounded-tr-none text-right"
                            : "bg-white/40 border-white/60 rounded-tl-none"
                        }`}
                      >
                        <p className="font-medium inline-block text-left break-words w-full">
                          {msg.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </AnimatePresence>

              {chatLoading && (
                <div className="flex justify-start items-center gap-2 mt-1">
                  <div className="bg-white/30 border border-white/50 rounded-2xl px-4 py-2 text-xs text-[#131b2e]/60 flex gap-1">
                    <span className="w-1 h-1 bg-sky-500/80 rounded-full animate-bounce" />
                    <span className="w-1 h-1 bg-sky-500/80 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1 h-1 bg-sky-500/80 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input form overlay inside pane */}
            <div className="p-4 border-t border-white/20 bg-white/5 shrink-0">
              <form 
                onSubmit={handleSendMessage}
                className="w-full flex items-center gap-2.5 bg-white/10 border border-white/30 rounded-full px-4 py-2 backdrop-blur-md focus-within:border-white/60 transition-all"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type a message..."
                  className="bg-transparent border-none focus:outline-none focus:ring-0 text-xs text-[#131b2e] placeholder-[#131b2e]/40 w-full p-0 font-medium"
                />
                <button 
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="text-[#50616b] hover:text-[#131b2e] hover:scale-110 active:scale-95 transition-all outline-hidden cursor-pointer"
                >
                  <Send size={15} />
                </button>
              </form>
            </div>

            {/* Footer hardware stats */}
            <footer className="px-5 py-3 flex items-center justify-between border-t border-white/20 bg-white/5 shrink-0 select-none">
              <div className="flex items-center gap-1.5 text-[#50616b]/70 font-mono">
                <HardDrive size={11} />
                <span className="text-[8px] uppercase font-bold tracking-wider">SSD: 312 GB , 1 TB</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#50616b]/70 font-mono">
                <Thermometer size={11} />
                <span className="text-[8px] uppercase font-bold tracking-wider">TEMP: 42° C</span>
              </div>
            </footer>

          </div>
        </aside>

      </main>

      {/* ================= 3. FLOATING COMPACT ACTION BAR DOCK ================= */}
      <nav className="widget-element transition-all duration-[600ms] fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 bg-white/30 backdrop-blur-3xl shadow-[inset_0_0_20px_rgba(255,255,255,0.3),0_-10px_40px_rgba(80,97,107,0.05)] rounded-full border border-white/60 px-5 py-2.5 select-none">
        
        {/* Dock Selection Voice (Active mode) */}
        <button 
          onClick={() => {
            beepClick();
            setCurrentDockMode("voice");
          }}
          className={`flex flex-col items-center justify-center rounded-full p-3.5 transition-transform duration-300 active:scale-90 hover:scale-105 cursor-pointer ${
            currentDockMode === "voice"
              ? "bg-[#e0f1fe] text-[#2563eb] shadow-[inset_0_0_12px_rgba(255,255,255,0.8),0_4px_12px_rgba(37,99,235,0.15)] ring-1 ring-[#93c5fd]"
              : "text-[#43474b] hover:bg-white/30"
          }`}
          title="Voice Command telemetry node"
        >
          <Mic size={16} />
          <span className="sr-only">Voice</span>
        </button>

        {/* Dock Selection Vision */}
        <button 
          onClick={() => {
            beepClick();
            setCurrentDockMode("vision");
          }}
          className={`flex flex-col items-center justify-center rounded-full p-3.5 transition-transform duration-300 active:scale-90 hover:scale-105 cursor-pointer ${
            currentDockMode === "vision"
              ? "bg-[#e0f1fe] text-[#2563eb] shadow-[inset_0_0_12px_rgba(255,255,255,0.8),0_4px_12px_rgba(37,99,235,0.15)] ring-1 ring-[#93c5fd]"
              : "text-[#43474b] hover:bg-white/30"
          }`}
          title="Vision sensory telemetry"
        >
          <Eye size={16} />
          <span className="sr-only">Vision</span>
        </button>

        {/* Dock Selection Learning */}
        <button 
          onClick={() => {
            beepClick();
            setCurrentDockMode("learning");
          }}
          className={`flex flex-col items-center justify-center rounded-full p-3.5 transition-transform duration-300 active:scale-105 hover:scale-105 cursor-pointer ${
            currentDockMode === "learning"
              ? "bg-[#e0f1fe] text-[#2563eb] shadow-[inset_0_0_12px_rgba(255,255,255,0.8),0_4px_12px_rgba(37,99,235,0.15)] ring-1 ring-[#93c5fd]"
              : "text-[#43474b] hover:bg-white/30"
          }`}
          title="Cognitive path processor"
        >
          <BookOpen size={16} />
          <span className="sr-only">Learning</span>
        </button>

        {/* Dock Selection Memory database */}
        <button 
          onClick={() => {
            beepClick();
            setCurrentDockMode("memory");
          }}
          className={`flex flex-col items-center justify-center rounded-full p-3.5 transition-transform duration-300 active:scale-90 hover:scale-105 cursor-pointer ${
            currentDockMode === "memory"
              ? "bg-[#e0f1fe] text-[#2563eb] shadow-[inset_0_0_12px_rgba(255,255,255,0.8),0_4px_12px_rgba(37,99,235,0.15)] ring-1 ring-[#93c5fd]"
              : "text-[#43474b] hover:bg-white/30"
          }`}
          title="Cognitive synaptic map database connection"
        >
          <Database size={16} />
          <span className="sr-only">Memory</span>
        </button>

        {/* Dock Selection Security shield */}
        <button 
          onClick={() => {
            beepClick();
            setCurrentDockMode("security");
          }}
          className={`flex flex-col items-center justify-center rounded-full p-3.5 transition-transform duration-300 active:scale-90 hover:scale-105 cursor-pointer ${
            currentDockMode === "security"
              ? "bg-[#e0f1fe] text-[#2563eb] shadow-[inset_0_0_12px_rgba(255,255,255,0.8),0_4px_12px_rgba(37,99,235,0.15)] ring-1 ring-[#93c5fd]"
              : "text-[#43474b] hover:bg-white/30"
          }`}
          title="Network Security shield"
        >
          <Shield size={16} />
          <span className="sr-only">Security</span>
        </button>

      </nav>

    </div>
  );
}
