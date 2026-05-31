import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Cpu,
  Terminal,
  Volume2,
  VolumeX,
  Menu,
  X,
  Compass,
  Zap,
  Clock,
  CircleUser,
  Activity,
  Shield,
  MessageSquare,
  Sparkles,
  Database,
  Link2,
  Radio,
  BarChart,
  DollarSign,
  FileText,
  Bookmark,
  Fingerprint,
  Mail,
  Sliders,
  Award,
  Sun,
  Moon,
  Search,
  Bell,
  Settings as SettingsIcon,
  ChevronLeft,
  ChevronRight,
  Sparkle,
  User,
  HelpCircle,
  Command,
  Eye,
  Info,
  Plus,
  Trash2,
  Mic,
  Loader2,
  Check,
  Brain,
  KeyRound,
  ShieldAlert,
  LogOut
} from "lucide-react";

import { PageId, NavigationItem, SystemLog } from "./types";
import { getWorkspaceMessages, saveWorkspaceMessages, clearWorkspaceMessages } from "./lib/indexedDb";
import { safeLocalStorage } from "./utils/safeLocalStorage";

// Import Modular Futuristic Page Views
import HolographicHUD from "./components/HolographicHUD";
import Home from "./components/pages/Home";
import About from "./components/pages/About";
import Features from "./components/pages/Features";
import Dashboard from "./components/pages/Dashboard";
import Assistant from "./components/pages/Assistant";
import JarvisSearch from "./components/pages/JarvisSearch";
import Memory from "./components/pages/Memory";
import Automation from "./components/pages/Automation";
import Integrations from "./components/pages/Integrations";
import Voice from "./components/pages/Voice";
import Analytics from "./components/pages/Analytics";
import Pricing from "./components/pages/Pricing";
import Documentation from "./components/pages/Documentation";
import Blog from "./components/pages/Blog";
import LoginSignup from "./components/pages/LoginSignup";
import Contact from "./components/pages/Contact";
import Settings from "./components/pages/Settings";
import Cognition from "./components/pages/Cognition";
import ComputerControl from "./components/pages/ComputerControl";

export interface ReferenceModel {
  id: string;
  name: string;
  description: string;
  provider: "openai" | "xai" | "anthropic" | "deepseek" | "google" | "qwen" | "meta" | "kimi";
}

export const REFERENCE_MODELS: ReferenceModel[] = [
  { id: "openai-gpt-5-5", name: "OpenAI GPT-5.5", description: "OpenAI's smartest", provider: "openai" },
  { id: "openai-gpt-5-4", name: "OpenAI GPT-5.4", description: "Flagship model", provider: "openai" },
  { id: "openai-gpt-5-3", name: "OpenAI GPT-5.3", description: "Instant replies", provider: "openai" },
  { id: "openai-gpt-5-1", name: "OpenAI GPT-5.1", description: "Advanced reasoning", provider: "openai" },
  { id: "openai-gpt-5", name: "OpenAI GPT-5", description: "Intelligent chat model", provider: "openai" },
  { id: "openai-gpt-4o", name: "OpenAI GPT-4o", description: "Reliable, strong reasoning", provider: "openai" },
  { id: "openai-gpt-4o-mini", name: "OpenAI GPT-4o Mini", description: "Fast and responsive", provider: "openai" },
  { id: "grok-4", name: "Grok 4", description: "Quick, sharp, and helpful", provider: "xai" },
  { id: "claude-sonnet-4-6", name: "Claude Sonnet 4.6", description: "Claude flagship for coding", provider: "anthropic" },
  { id: "claude-opus-4-7", name: "Claude Opus 4.7", description: "Claude's new flagship", provider: "anthropic" },
  { id: "claude-opus-4-6", name: "Claude Opus 4.6", description: "Faster, sharper Opus", provider: "anthropic" },
  { id: "claude-opus-4-5", name: "Claude Opus 4.5", description: "Strong, balanced Opus", provider: "anthropic" },
  { id: "claude-opus-4-1", name: "Claude Opus 4.1", description: "Thoughtful, careful answers", provider: "anthropic" },
  { id: "deepseek-v4-pro", name: "DeepSeek V4 Pro", description: "Strong, deep thinker", provider: "deepseek" },
  { id: "deepseek-v4-flash", name: "DeepSeek V4 Flash", description: "Quick everyday work", provider: "deepseek" },
  { id: "deepseek-standard", name: "DeepSeek", description: "Explains its steps clearly", provider: "deepseek" },
  { id: "qwen-3-max", name: "Qwen 3 Max", description: "Handles long, detailed work", provider: "qwen" },
  { id: "llama-3-3", name: "Llama 3.3", description: "Versatile for everyday tasks", provider: "meta" },
  { id: "kimi-k2", name: "DeepInfra Kimi K2", description: "High stability, fast logic", provider: "kimi" }
];

export const getCleanModelButtonLabel = (id: string): string => {
  if (id === "claude-sonnet-4-6") return "Sonnet 4.6 Adaptive";
  const m = REFERENCE_MODELS.find(item => item.id === id);
  return m ? m.name.replace("OpenAI ", "").replace("Claude ", "") : "Model";
};

export const getProviderBigIcon = (provider: string) => {
  switch (provider) {
    case "openai":
      return (
        <svg className="w-4 h-4 text-zinc-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M12 4.5a3 3 0 0 1 3 3v4.5H9V7.5a3 3 0 0 1 3-3ZM19.5 12a3 3 0 0 1-3 3H12V9h4.5a3 3 0 0 1 3 3ZM12 19.5a3 3 0 0 1-3-3v-4.5h6v4.5a3 3 0 0 1-3 3ZM4.5 12a3 3 0 0 1 3-3H12v6H7.5a3 3 0 0 1-3-3Z" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case "anthropic":
      return (
        <svg className="w-3.5 h-3.5 text-[#C16D50]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a1 1 0 0 1 1 1v4.5a1 1 0 0 1-2 0V3a1 1 0 0 1 1-1Zm0 14.5a1 1 0 0 1 1 1V21a1 1 0 0 1-2 0v-3.5a1 1 0 0 1 1-1ZM21 12a1 1 0 0 1-1 1h-4.5a1 1 0 0 1 0-2H20a1 1 0 0 1 1 1ZM7.5 12a1 1 0 0 1-1 1H3a1 1 0 0 1 0-2h3.5a1 1 0 0 1 1 1ZM18.36 5.64a1 1 0 0 1 0 1.41l-3.18 3.18a1 1 0 0 1-1.41-1.41l3.18-3.18a1 1 0 0 1 1.41 0ZM8.83 15.17a1 1 0 0 1 0 1.41l-3.18 3.18a1 1 0 0 1-1.41-1.41l3.18-3.18a1 1 0 0 1 1.41 0ZM18.36 18.36a1 1 0 0 1-1.41 0l-3.18-3.18a1 1 0 0 1 1.41-1.41l3.18 3.18a1 1 0 0 1 0 1.41ZM8.83 8.83a1 1 0 0 1-1.41 0L4.24 5.64a1 1 0 0 1 1.41-1.41l3.18 3.18a1 1 0 0 1 0 1.41Z" />
        </svg>
      );
    case "xai":
      return (
        <svg className="w-3.5 h-3.5 text-zinc-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="12" cy="12" r="8" />
          <line x1="8.5" y1="15.5" x2="15.5" y2="8.5" strokeLinecap="round" />
        </svg>
      );
    case "deepseek":
      return (
        <svg className="w-3.5 h-3.5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7.5c2 0 3.5 1.5 3.5 3.5s-1.5 3.5-3.5 3.5-3.5-1.5-3.5-3.5 1.5-3.5 3.5-3.5Z" fill="currentColor" className="opacity-15" />
          <path d="M12 9v6M9 12h6" strokeLinecap="round" />
        </svg>
      );
    case "google":
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="8" fill="url(#neural-grad-dropdown-big)" className="opacity-15" />
          <path d="M12 5.5c2 0 4 2.5 4 6.5S14 18.5 12 18.5s-4-2.5-4-6.5S10 5.5 12 5.5Z" stroke="url(#neural-grad-dropdown-big)" strokeWidth="1.8" />
          <defs>
            <linearGradient id="neural-grad-dropdown-big" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#eab308" />
            </linearGradient>
          </defs>
        </svg>
      );
    case "qwen":
      return (
        <svg className="w-3.5 h-3.5 text-zinc-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        </svg>
      );
    case "meta":
      return (
        <svg className="w-3.5 h-3.5 text-zinc-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 8c-1.5 0-3 .85-4 2.5C11 8.85 9.5 8 8 8c-3 0-5 2-5 4s2 4 5 4c1.5 0 3-.85 4-2.5 1 1.65 2.5 2.5 4 2.5 3 0 5-2 5-4s-2-4-5-4Z" strokeLinecap="round" />
        </svg>
      );
    case "kimi":
    default:
      return (
        <svg className="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 4v16M6 12l8-8M8 12l8 8" strokeLinecap="round" />
        </svg>
      );
  }
};

import { auth, db, onAuthStateChanged, isBypassActive } from "./lib/firebase";
import { doc, onSnapshot, setDoc, serverTimestamp } from "firebase/firestore";
import Admin from "./components/pages/Admin";

// World-Class OS Multi-Theme Definition Matrix
export const THEMES: Record<string, {
  id: string;
  name: string;
  primary: string;
  primaryHover: string;
  bgMuted: string;
  bgSemi: string;
  borderSemi: string;
  borderMuted: string;
  borderActive: string;
  accentBg: string;
  accentText: string;
  glow: string;
  pulse: string;
  gradient: string;
  gradientText: string;
  bgClass: string;
  glowColor: string;
  hex: string;
}> = {
  "cyber-blue": {
    id: "cyber-blue",
    name: "CYBER BLUE",
    primary: "text-cyan-400",
    primaryHover: "hover:text-cyan-300",
    bgMuted: "bg-cyan-950/20",
    bgSemi: "bg-cyan-950/10",
    borderSemi: "border-cyan-500/10",
    borderMuted: "border-cyan-500/15",
    borderActive: "border-cyan-400/40",
    accentBg: "bg-cyan-500",
    accentText: "text-black",
    glow: "shadow-[0_0_15px_rgba(6,182,212,0.3)]",
    pulse: "bg-cyan-400",
    gradient: "from-cyan-500 via-cyan-400 to-fuchsia-500",
    gradientText: "from-white via-cyan-100 to-cyan-400",
    bgClass: "bg-[#020617] bg-[radial-gradient(circle_at_60%_40%,rgba(6,182,212,0.06),transparent_60%)]",
    glowColor: "rgba(6,182,212,0.8)",
    hex: "#06b6d4"
  },
  "neon-purple": {
    id: "neon-purple",
    name: "NEON PURPLE",
    primary: "text-fuchsia-400",
    primaryHover: "hover:text-fuchsia-300",
    bgMuted: "bg-fuchsia-950/20",
    bgSemi: "bg-fuchsia-950/10",
    borderSemi: "border-fuchsia-500/10",
    borderMuted: "border-fuchsia-500/15",
    borderActive: "border-fuchsia-400/40",
    accentBg: "bg-fuchsia-500",
    accentText: "text-white",
    glow: "shadow-[0_0_15px_rgba(217,70,239,0.3)]",
    pulse: "bg-fuchsia-400",
    gradient: "from-fuchsia-500 via-purple-400 to-pink-500",
    gradientText: "from-white via-fuchsia-100 to-fuchsia-400",
    bgClass: "bg-[#090514] bg-[radial-gradient(circle_at_60%_40%,rgba(217,70,239,0.06),transparent_60%)]",
    glowColor: "rgba(217,70,239,0.8)",
    hex: "#d946ef"
  },
  "red-tactical": {
    id: "red-tactical",
    name: "RED TACTICAL",
    primary: "text-red-500",
    primaryHover: "hover:text-red-400",
    bgMuted: "bg-red-950/20",
    bgSemi: "bg-red-950/10",
    borderSemi: "border-red-500/10",
    borderMuted: "border-red-500/15",
    borderActive: "border-red-400/40",
    accentBg: "bg-red-600",
    accentText: "text-white",
    glow: "shadow-[0_0_15px_rgba(239,68,68,0.3)]",
    pulse: "bg-red-500",
    gradient: "from-red-600 via-rose-500 to-red-500",
    gradientText: "from-white via-red-100 to-rose-400",
    bgClass: "bg-[#0c0202] bg-[radial-gradient(circle_at_60%_40%,rgba(239,68,68,0.07),transparent_60%)]",
    glowColor: "rgba(239,68,68,0.8)",
    hex: "#ef4444"
  },
  "matrix-green": {
    id: "matrix-green",
    name: "MATRIX GREEN",
    primary: "text-emerald-400",
    primaryHover: "hover:text-emerald-350",
    bgMuted: "bg-emerald-950/20",
    bgSemi: "bg-emerald-950/10",
    borderSemi: "border-emerald-500/10",
    borderMuted: "border-emerald-500/15",
    borderActive: "border-emerald-400/40",
    accentBg: "bg-emerald-500",
    accentText: "text-black",
    glow: "shadow-[0_0_15px_rgba(16,185,129,0.3)]",
    pulse: "bg-emerald-400",
    gradient: "from-emerald-500 via-green-400 to-teal-500",
    gradientText: "from-white via-emerald-100 to-green-400",
    bgClass: "bg-[#010803] bg-[radial-gradient(circle_at_60%_40%,rgba(16,185,129,0.06),transparent_60%)]",
    glowColor: "rgba(16,185,129,0.8)",
    hex: "#10b981"
  },
  "white-holo": {
    id: "white-holo",
    name: "WHITE HOLO",
    primary: "text-slate-200",
    primaryHover: "hover:text-white",
    bgMuted: "bg-slate-800/30",
    bgSemi: "bg-slate-800/15",
    borderSemi: "border-slate-500/12",
    borderMuted: "border-slate-500/18",
    borderActive: "border-slate-400/50",
    accentBg: "bg-slate-100",
    accentText: "text-black",
    glow: "shadow-[0_0_15px_rgba(241,245,249,0.3)]",
    pulse: "bg-white",
    gradient: "from-slate-200 via-zinc-400 to-slate-100",
    gradientText: "from-white via-slate-100 to-slate-300",
    bgClass: "bg-[#0f172a] bg-[radial-gradient(circle_at_60%_40%,rgba(241,245,249,0.05),transparent_60%)]",
    glowColor: "rgba(241,245,249,0.8)",
    hex: "#f1f5f9"
  }
};

export default function App() {
  // Page routing
  const [activePage, setActivePage] = useState<PageId>("home");

  // Access control states
  const [currentUserData, setCurrentUserData] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>("guest");
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [userCredits, setUserCredits] = useState<number | null>(500);

  const fetchCreditsState = async (uid: string, email?: string, displayName?: string) => {
    try {
      const res = await fetch(`/api/credits/state?userId=${uid}&email=${encodeURIComponent(email || "")}&displayName=${encodeURIComponent(displayName || "")}`);
      if (res.ok) {
        const data = await res.json();
        setUserCredits(data.credits);
      }
    } catch (e) {
      console.warn("Credits state fetch error:", e);
    }
  };

  // Telemetry sequences
  const [booting, setBooting] = useState(true);
  const [bootProgress, setBootProgress] = useState(0);
  const [bootText, setBootText] = useState("CALIBRATING SYNAPTIC MAIN-NODES...");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentCallsign, setCurrentCallsign] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  // UI Evolution States
  const [workspaceLayout, setWorkspaceLayout] = useState<"holographic" | "clean">(() => {
    const saved = safeLocalStorage.getItem("jarvis_workspace_layout");
    return (saved as "holographic" | "clean") || "holographic"; // Holographic layout by default!
  });
  const [isLightMode, setIsLightMode] = useState<boolean>(() => {
    const saved = safeLocalStorage.getItem("jarvis_light_mode");
    return saved !== null ? JSON.parse(saved) : false; // Dark mode by default — matches reference design
  });
  const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(() => {
    const saved = safeLocalStorage.getItem("jarvis_sidebar_expanded");
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [hoverExpandOption, setHoverExpandOption] = useState<boolean>(true);
  const [isHoveringSidebar, setIsHoveringSidebar] = useState<boolean>(false);
  const [activeThemeId, setActiveThemeId] = useState<string>(() => {
    return safeLocalStorage.getItem("jarvis_active_theme") || "cyber-blue";
  });
  const [commandBarOpen, setCommandBarOpen] = useState(false);
  const [commandSearch, setCommandSearch] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  // System Logs
  const [terminalLogs, setTerminalLogs] = useState<SystemLog[]>([
    { id: "log-1", timestamp: "10:35:00", level: "INFO", message: "JARVIS X operating system version 4.2.0 boot initialized." },
    { id: "log-2", timestamp: "10:35:01", level: "INFO", message: "Retinal map grid indices secure." },
    { id: "log-3", timestamp: "10:35:03", level: "CORE", message: "Synaptic channel connected to the central space mainframe." },
  ]);

  // Sync active theme configuration 
  const currentTheme = THEMES[activeThemeId] || THEMES["cyber-blue"];

  // Keyboard shortcut bounds (Ctrl+B / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle Sidebar: Ctrl+B
      if (e.ctrlKey && e.key.toLowerCase() === "b") {
        e.preventDefault();
        setSidebarExpanded((prev) => {
          const newState = !prev;
          safeLocalStorage.setItem("jarvis_sidebar_expanded", JSON.stringify(newState));
          addTerminalLog("INFO", `Sidebar system status set: ${newState ? "EXPANDED" : "COLLAPSED"}`);
          return newState;
        });
        playSystemBeep(520, 0.1, "sine");
      }
      // Toggle Command Bar: Ctrl+K or /
      if ((e.ctrlKey && e.key.toLowerCase() === "k") || (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA")) {
        e.preventDefault();
        setCommandBarOpen((prev) => !prev);
        setCommandSearch("");
        playSystemBeep(620, 0.12, "sine");
      }
      // Escape closes models
      if (e.key === "Escape") {
        setCommandBarOpen(false);
        setNotificationsOpen(false);
        setProfileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Sync clock counter
  useEffect(() => {
    const clockTimer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toUTCString().replace("GMT", "UTC"));
    }, 1000);
    return () => clearInterval(clockTimer);
  }, []);

  // Routing security guard: redirect unauthorized or non-logged-in users directly to the login interface
  useEffect(() => {
    if (booting) return;
    const publicPages = ["home", "features", "about", "voice", "pricing", "documentation", "blog", "contact", "login", "signup"];
    const isPublic = publicPages.includes(activePage);
    if (!isPublic && !auth.currentUser) {
      addTerminalLog("WARN", `Intercepted unauthorized access to [${activePage.toUpperCase()}]. Redirecting directly to login.`);
      setActivePage("login");
    }
  }, [activePage, booting]);

  // Sync Firebase Auth & Firestore live database status
  useEffect(() => {
    let unsubscribeSnap: () => void = () => {};
    
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      // Unsubscribe any previous session snapshot listener
      unsubscribeSnap();
      
      if (user) {
        const userNick = user.displayName || user.email?.split("@")[0].toUpperCase() || "AGENT";
        setCurrentCallsign(userNick);
        addTerminalLog("CORE", `Retinal fingerprint recognized: Captain ${userNick}`);

        // Fetch credits state
        fetchCreditsState(user.uid, user.email || undefined, user.displayName || undefined);

        const isSimulated = isBypassActive();
        if (isSimulated) {
          const finalRole = user.email === "guptarudra852@gmail.com" ? "admin" : "developer";
          setCurrentUserData({
            email: user.email || "captain@aurora.io",
            displayName: user.displayName || "CAPTAIN",
            role: finalRole,
            approved: true,
            credits: 500
          });
          setUserRole(finalRole);
          setIsApproved(true);
          setUserCredits(500);
          return;
        }

        const userRef = doc(db, "users", user.uid);
        
        // Auto-promote Rudra (guptarudra852@gmail.com) to main admin role securely!
        if (user.email === "guptarudra852@gmail.com") {
          try {
            await setDoc(userRef, {
              email: "guptarudra852@gmail.com",
              displayName: "RUDRA",
              role: "admin",
              approved: true,
              credits: 500,
              lastLogin: serverTimestamp()
            }, { merge: true });
          } catch (e) {
            console.error("Autopromote admin error: ", e);
          }
        }

        // Live subscribe to active clearance state
        unsubscribeSnap = onSnapshot(userRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data();
            setCurrentUserData(data);
            setUserRole(data.role || "guest");
            setIsApproved(data.approved ?? false);
            if (typeof data.credits === "number") {
              setUserCredits(data.credits);
            }
          } else {
            // Unregistered user or just registered without doc yet
            setCurrentUserData({ role: "guest", approved: false, credits: 500 });
            setUserRole("guest");
            setIsApproved(false);
            setUserCredits(500);
          }
        }, (err) => {
          console.error("Firestore user sub error: ", err);
        });

      } else {
        setCurrentCallsign(null);
        setCurrentUserData(null);
        setUserRole("guest");
        setIsApproved(false);
        setActivePage("login");
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeSnap();
    };
  }, []);

  // Holographic Boot-up load values
  useEffect(() => {
    let progress = 0;
    const bootSteps = [
      { prg: 20, txt: "CONNECTING TO SECURE CLOUD SERVERS..." },
      { prg: 45, txt: "ENCODING RETINAL DECRYPT GRIDS..." },
      { prg: 70, txt: "INITIATING AUDIO SPEECH SAMPLERS..." },
      { prg: 90, txt: "COMPILING RECURSIVE SCHEDULING INTERFACES..." },
      { prg: 100, txt: "ALL COGNITIVE SYSTEMS COMPILING GREEN // STANDBY..." },
    ];

    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 8) + 3;
      if (progress >= 100) {
        progress = 100;
        setBootProgress(100);
        setBootText(bootSteps[bootSteps.length - 1].txt);
        clearInterval(interval);
        setTimeout(() => {
          setBooting(false);
          playSystemBeep(880, 0.45, "sine");
          addTerminalLog("CORE", "Core software launch complete. Welcome aboard.");
        }, 1200);
      } else {
        setBootProgress(progress);
        const matches = bootSteps.filter((s) => progress >= s.prg);
        if (matches.length > 0) {
          setBootText(matches[matches.length - 1].txt);
        }
      }
    }, 120);

    return () => clearInterval(interval);
  }, []);

  // Audio synths generator
  const playSystemBeep = (freq = 440, duration = 0.15, type: OscillatorType = "sine") => {
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
      console.warn("Audio synthesizer blocked by browser autoplay constraints.");
    }
  };

  const addTerminalLog = (level: "INFO" | "WARN" | "CORE" | "ERROR", text: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour12: false });
    const newLog: SystemLog = {
      id: Math.random().toString(),
      timestamp: timeStr,
      level,
      message: text,
    };
    setTerminalLogs((prev) => [newLog, ...prev.slice(0, 19)]);
  };

  const handleNavigate = (page: PageId) => {
    playSystemBeep(650, 0.12, "sine");
    const publicPages = ["home", "features", "about", "voice", "pricing", "documentation", "blog", "contact", "login", "signup"];
    const isPublic = publicPages.includes(page);
    if (!isPublic && !auth.currentUser) {
      addTerminalLog("WARN", `Uplink rejected. Authentication required for [${page.toUpperCase()}] zone. Redirecting to login.`);
      setActivePage("login");
    } else {
      setActivePage(page);
    }
    setIsMobileMenuOpen(false);
    addTerminalLog("INFO", `Navigated to systemic zone: ${page.toUpperCase()}`);
  };

  const handleThemeShift = (themeId: string) => {
    setActiveThemeId(themeId);
    safeLocalStorage.setItem("jarvis_active_theme", themeId);
    playSystemBeep(720, 0.15, "triangle");
    addTerminalLog("CORE", `Shifting operating neural colors to: ${themeId.replace("-", " ").toUpperCase()}`);
  };

  const renderProtectedPage = (component: React.ReactNode, id: PageId) => {
    // Admin is strictly restricted to userRole === "admin"
    if (id === "admin") {
      if (userRole !== "admin") {
        return (
          <div className="flex flex-col items-center justify-center text-center p-8 space-y-4 max-w-lg mx-auto py-20 font-mono">
            <div className="w-16 h-16 border border-red-500/30 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.2)]">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold tracking-wider text-red-500 uppercase">ACCESS_DENIED_CORE_BREACH</h3>
            <p className="text-xs text-zinc-400 leading-relaxed uppercase">
              THIS ZONE IS RESTRICTED FROM GENERAL BIO-NODES. ADMINISTRATIVE KEY CARD SIGNATURE VERIFICATION FAILED.
            </p>
          </div>
        );
      }
      return <Admin onLogMessage={addTerminalLog} />;
    }

    const publicPages = ["home", "features", "about", "voice", "pricing", "documentation", "blog", "contact", "login", "signup"];
    const isPublic = publicPages.includes(id);

    // If completely logged out, keep them from accessing restricted pages:
    if (!isPublic && !auth.currentUser) {
      return (
        <div className="flex flex-col items-center justify-center text-center p-8 space-y-4 max-w-md mx-auto py-20 font-mono">
          <div className="w-16 h-16 border border-cyan-500/30 bg-cyan-950/20 rounded-full flex items-center justify-center text-cyan-400">
            <Fingerprint className="w-8 h-8 animate-pulse" />
          </div>
          <h3 className="text-base font-bold tracking-wider text-white">RETI-SCAN GRIDS ENCRYPTED</h3>
          <p className="text-xs text-zinc-450 leading-relaxed uppercase">
            SIGNATURE UNVERIFIED. SECURING COGNITIVE THREADS. PLEASE AUTHENTICATE YOUR PROFILE CREDENTIALS TO LOAD THIS MAINFRAME NODE.
          </p>
          <button
            onClick={() => handleNavigate("login")}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            INITIALIZE AUTHENTICATION SECURE LINK
          </button>
        </div>
      );
    }

    // If logged in, but approved is false:
    if (!isPublic && !isApproved) {
      return (
        <div className="flex flex-col items-center justify-center text-center p-8 space-y-5 max-w-lg mx-auto py-24 font-mono bg-yellow-500/5 border border-yellow-500/10 rounded-2xl">
          <div className="w-16 h-16 border border-yellow-500/30 bg-yellow-500/10 rounded-full flex items-center justify-center text-yellow-500 animate-pulse">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold tracking-wider text-yellow-500 uppercase">AWAITING_BIOMETRIC_CLEARANCE</h3>
            <p className="text-[10px] text-zinc-400 uppercase tracking-widest mt-1">Status: Registered / Under Evaluation</p>
          </div>
          <p className="text-xs text-zinc-305 leading-relaxed uppercase max-w-sm">
            YOUR USER NODE HAS REGISTERED ON SECURE REGISTRY SNAPSHOTS, BUT REQUIRES SECURITY REVIEW BY MAINFRAME OPERATOR (RUDRA) BEFORE COGNITIVE GRID CLEARANCE IS CONFERRED.
          </p>
          <div className="w-full h-px bg-zinc-800" />
          <div className="text-[10px] text-zinc-500 uppercase">
            Captain ID signature: <span className="text-zinc-300 font-bold">{auth.currentUser?.uid}</span>
          </div>
        </div>
      );
    }

    // Guest Role restrictions on memory, agents/automation, computer gateway (vaultshield)
    if (userRole === "guest") {
      if (id === "memory") {
        return (
          <div className="flex flex-col items-center justify-center text-center p-8 space-y-4 max-w-md mx-auto py-20 font-mono">
            <div className="w-16 h-16 border border-zinc-500/30 bg-zinc-500/10 rounded-full flex items-center justify-center text-zinc-400">
              <Database className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold tracking-wider text-zinc-400 uppercase">GUEST_MEMORY_ACCESS_RESTRICTED</h3>
            <p className="text-xs text-zinc-400 leading-relaxed uppercase">
              GUEST ROLES DO NOT SUPPORT EXPANDING QUANTUM NEURAL STORAGE REPLICAS. UPGRADE YOUR EMAIL PROFILE SIGNATURE MATRIX TO PROCEED.
            </p>
          </div>
        );
      }
      if (id === "automation") {
        return (
          <div className="flex flex-col items-center justify-center text-center p-8 space-y-4 max-w-md mx-auto py-20 font-mono">
            <div className="w-16 h-16 border border-zinc-500/30 bg-zinc-500/10 rounded-full flex items-center justify-center text-zinc-400">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold tracking-wider text-zinc-400 uppercase">GUEST_AUTOMATION_RESTRICTED</h3>
            <p className="text-xs text-zinc-400 leading-relaxed uppercase">
              PIPELINES AND INTEGRATED ROUTINES EXCLUDED FOR ACTIVE UNAPPROVED GUEST SIGNATURES.
            </p>
          </div>
        );
      }
      if (id === "vaultshield") {
        return (
          <div className="flex flex-col items-center justify-center text-center p-8 space-y-4 max-w-md mx-auto py-20 font-mono">
            <div className="w-16 h-16 border border-zinc-500/30 bg-zinc-500/10 rounded-full flex items-center justify-center text-zinc-400">
              <Shield className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold tracking-wider text-zinc-400 uppercase">GUEST_OPERATING_GATEWAY_BLOCKED</h3>
            <p className="text-xs text-zinc-400 leading-relaxed uppercase">
              VAULT DEVICE OVERLORD ACCESS DENIED FOR CURRENT SESSION SIGNATURE LEVEL.
            </p>
          </div>
        );
      }
    }

    return component;
  };

  // Nav categories structure
  const navigationItems: NavigationItem[] = [
    { id: "home", label: "Core Home", iconName: "home", category: "core" },
    { id: "features", label: "Capabilities", iconName: "features", category: "core" },
    { id: "about", label: "Mainframe Manual", iconName: "about", category: "core" },
    { id: "voice", label: "Voice Interface", iconName: "voice", category: "core" },

    { id: "dashboard", label: "Diagnostic Panel", iconName: "dashboard", category: "operating" },
    { id: "cognition", label: "Cognitive Studio", iconName: "cognition", category: "operating" },
    { id: "assistant", label: "AI Chat Assistant", iconName: "assistant", category: "operating" },
    { id: "search", label: "JARVIS Search", iconName: "search", category: "operating" },
    { id: "memory", label: "Memory Storage", iconName: "memory", category: "operating" },
    { id: "automation", label: "Routine Pipelines", iconName: "automation", category: "operating" },
    { id: "analytics", label: "Performance Intel", iconName: "analytics", category: "operating" },
    { id: "integrations", label: "Platform Hooks", iconName: "integrations", category: "operating" },
    { id: "vaultshield", label: "Computer Gateway", iconName: "vaultshield", category: "operating" },

    { id: "pricing", label: "System Pricing", iconName: "pricing", category: "services" },
    { id: "documentation", label: "API Reference", iconName: "documentation", category: "services" },
    { id: "blog", label: "System Blog", iconName: "blog", category: "services" },
    { id: "contact", label: "Transmit Support", iconName: "contact", category: "services" },

    { id: "login", label: "Auth Sign In", iconName: "login", category: "auth" },
    { id: "signup", label: "Build Account", iconName: "signup", category: "auth" },
    { id: "settings", label: "Core Settings", iconName: "settings", category: "auth" },
    ...(userRole === "admin" ? [
      { id: "admin" as PageId, label: "Admin Mainframe", iconName: "admin", category: "auth" as const }
    ] : [])
  ];

  const renderIcon = (name: string, activeClass = "") => {
    const classProps = `shrink-0 transition-transform ${activeClass}`;
    switch (name) {
      case "home": return <Compass size={15} className={classProps} />;
      case "features": return <Award size={15} className={classProps} />;
      case "about": return <FileText size={15} className={classProps} />;
      case "dashboard": return <Activity size={15} className={classProps} />;
      case "cognition": return <Brain size={15} className={classProps} />;
      case "assistant": return <MessageSquare size={15} className={classProps} />;
      case "search": return <Search size={15} className={classProps} />;
      case "memory": return <Database size={15} className={classProps} />;
      case "automation": return <Zap size={15} className={classProps} />;
      case "integrations": return <Link2 size={15} className={classProps} />;
      case "voice": return <Radio size={15} className={classProps} />;
      case "analytics": return <BarChart size={15} className={classProps} />;
      case "pricing": return <DollarSign size={15} className={classProps} />;
      case "documentation": return <Terminal size={15} className={classProps} />;
      case "blog": return <FileText size={15} className={classProps} />;
      case "login": return <Fingerprint size={15} className={classProps} />;
      case "signup": return <CircleUser size={15} className={classProps} />;
      case "contact": return <Mail size={15} className={classProps} />;
      case "settings": return <Sliders size={15} className={classProps} />;
      case "vaultshield": return <Shield size={15} className={classProps} />;
      case "admin": return <KeyRound size={15} className={classProps} />;
      default: return <Compass size={15} className={classProps} />;
    }
  };

  const getLogStyle = (level: string) => {
    switch (level) {
      case "CORE": return "text-green-400 font-bold";
      case "WARN": return "text-yellow-400 font-semibold";
      case "ERROR": return "text-red-400 font-black animate-pulse";
      default: return currentTheme.primary;
    }
  };

  // Filter commands for Cmd Palette
  const allCommands = [
    { title: "Open Core Home", subtitle: "Navigate to standard welcome frame", action: () => handleNavigate("home"), tags: ["welcome", "start", "hud"] },
    { title: "Open Diagnostic Panel", subtitle: "Inspect active system threads & loads", action: () => handleNavigate("dashboard"), tags: ["cpu", "memory", "stats", "process"] },
    { title: "Open Cognitive Studio", subtitle: "Operate 10 specialized human cognitive skills", action: () => handleNavigate("cognition"), tags: ["brain", "ethics", "goals", "thoughts", "reasoning"] },
    { title: "Open AI Chat Assistant", subtitle: "Communicate directly with JARVIS neural core", action: () => handleNavigate("assistant"), tags: ["ai", "prompt", "chat", "talk"] },
    { title: "Open JARVIS Search", subtitle: "Real-time Google search grounding report compilation", action: () => handleNavigate("search"), tags: ["google", "sources", "news", "current"] },
    { title: "Open Memory Storage", subtitle: "Inspect persistent vector memories database", action: () => handleNavigate("memory"), tags: ["learning", "history", "recall"] },
    { title: "Open Voice Interface", subtitle: "Speak commands with microphone", action: () => handleNavigate("voice"), tags: ["audio", "speech", "mic"] },
    { title: "Clear Terminal Logs Cache", subtitle: "Purge the footer active telemetry array", action: () => { setTerminalLogs([]); addTerminalLog("CORE", "Main logs feed cleared successfully by agent."); }, tags: ["clean", "reset", "telemetry"] },
    { title: "Overclock Syntactic Buffer Node", subtitle: "Simulate emergency computational flow", action: () => { addTerminalLog("WARN", "[OVERCLOCK_ENGAGED] Overclocking synaptic arrays to 180% load..."); playSystemBeep(1200, 0.4, "sawtooth"); }, tags: ["performance", "speed", "test"] },
    { title: "Engage Cyber Blue Accent Theme", subtitle: "Set accent to electric cyan", action: () => handleThemeShift("cyber-blue"), tags: ["accent", "skin", "dark"] },
    { title: "Engage Neon Purple Accent Theme", subtitle: "Set accent to futuristic magenta", action: () => handleThemeShift("neon-purple"), tags: ["accent", "skin", "dark"] },
    { title: "Engage Red Tactical Accent Theme", subtitle: "Set accent to warning crimson outline", action: () => handleThemeShift("red-tactical"), tags: ["accent", "skin", "dark"] },
    { title: "Engage Matrix Green Accent Theme", subtitle: "Set accent to cyberpunk digital green", action: () => handleThemeShift("matrix-green"), tags: ["accent", "skin", "dark"] },
    { title: "Engage White Holographic Accent Theme", subtitle: "Set accent to stark clean white UI", action: () => handleThemeShift("white-holo"), tags: ["accent", "skin", "dark"] },
    { title: "Open Platforms Integrations", subtitle: "Check connected API keys & web servers", action: () => handleNavigate("integrations"), tags: ["services", "webhook", "discord"] },
    { title: "Open Computer Gateway Layer", subtitle: "Controlled sandbox and permission layer separating logical core", action: () => handleNavigate("vaultshield"), tags: ["agent", "os", "click", "permissions", "safeguard", "sandbox"] },
    { title: "Open Routine Pipelines", subtitle: "Setup trigger-and-action automated tasks", action: () => handleNavigate("automation"), tags: ["agent", "loops", "jobs"] },
    { title: "Open Performance Intel Analytics", subtitle: "Inspect historic core responsiveness speeds", action: () => handleNavigate("analytics"), tags: ["speeds", "charts", "metrics"] },
    { title: "Toggle Synthesized Audio Bleeps", subtitle: "Turn hover audio system ON/OFF", action: () => { setSoundEnabled(prev => { const n = !prev; addTerminalLog("INFO", `Holographic buzzer: ${n ? "ONLINE" : "MUTED"}`); return n; }); }, tags: ["synthesizer", "mute", "sound"] },
  ];

  const filteredCommandPalette = allCommands.filter(cmd => {
    const term = commandSearch.toLowerCase();
    return cmd.title.toLowerCase().includes(term) || cmd.subtitle.toLowerCase().includes(term) || cmd.tags.some(tg => tg.includes(term));
  });

  // Clean Workspace States
  interface CleanMsg {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: string;
  }

  const [cleanMessages, setCleanMessages] = useState<CleanMsg[]>(() => {
    const saved = safeLocalStorage.getItem("jarvis_clean_messages");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: "welcome",
        role: "assistant",
        content: "Greetings, Papa. I have initialized your minimalist workspace system. Any operations or cognitive training queries you transmit will be processed in milliseconds.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    ];
  });
  const [cleanInput, setCleanInput] = useState("");
  const [isCleanTyping, setIsCleanTyping] = useState(false);
  const [selectedCleanModel, setSelectedCleanModel] = useState<string>(() => {
    return safeLocalStorage.getItem("jarvis_clean_selected_model") || "claude-sonnet-4-6";
  });
  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false);

  // Connection & Offline Simulation Setup
  const [isOnline, setIsOnline] = useState<boolean>(() => typeof window !== "undefined" ? navigator.onLine : true);
  const [simulateOffline, setSimulateOffline] = useState<boolean>(false);

  // Monitor connectivity live status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      addTerminalLog("INFO", "NETWORK ESTABLISHED: Main cloud-link restored.");
    };
    const handleOffline = () => {
      setIsOnline(false);
      addTerminalLog("WARN", "NETWORK INTERRUPTED: Main cloud-link severed. Dynamic offline cache active.");
    };
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Sync workspace chat memory list from IndexedDB on load (Execution-First pattern)
  useEffect(() => {
    async function recoverFromIndexedDB() {
      try {
        const stored = await getWorkspaceMessages();
        if (stored && stored.length > 0) {
          setCleanMessages(stored);
          addTerminalLog("CORE", `Loaded ${stored.length} chat messages from IndexedDB Synaptic Storage.`);
        }
      } catch (err: any) {
        addTerminalLog("ERROR", `Failed to load IndexedDB synaptic structures: ${err.message}`);
      }
    }
    recoverFromIndexedDB();
  }, []);

  // Write chat updates atomically to cleanMessages state + localStorage + IndexedDB
  const syncWithIndexedDB = async (messages: CleanMsg[]) => {
    try {
      await saveWorkspaceMessages(messages);
      safeLocalStorage.setItem("jarvis_clean_messages", JSON.stringify(messages));
    } catch (err: any) {
      console.error("Failed to sync structural frames to IndexedDB:", err);
    }
  };

  const handleSendCleanMessage = async (textSeed?: string) => {
    const textToSend = textSeed || cleanInput;
    if (!textToSend.trim()) return;

    setCleanInput("");
    
    const userMsg: CleanMsg = {
      id: Math.random().toString(),
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    const updatedMessages = [...cleanMessages, userMsg];
    setCleanMessages(updatedMessages);
    await syncWithIndexedDB(updatedMessages);
    setIsCleanTyping(true);

    const isReallyOffline = !isOnline || simulateOffline;

    if (isReallyOffline) {
      addTerminalLog("WARN", "[OFFLINE_EMULATION] Commenced local auxiliary diagnostics search...");
      setTimeout(async () => {
        const lowerInput = textToSend.toLowerCase();
        let reply = "";

        // Intelligent local offline matching for JARVIS X
        if (lowerInput.includes("status") || lowerInput.includes("diagnostic") || lowerInput.includes("state") || lowerInput.includes("health")) {
          reply = `⚡ **[Decentralized Emergency Offline Core]**\n\nCaptain, our main cloud-link to the OpenRouter/Chat completions mainframe is currently disjointed. However, offline **IndexedDB Synaptic Storage** buffers remain highly active. System telemetry:\n- Storage: Safe (Nominal)\n- CPU Threads: Stable (Auxiliary)\n- Memory Retention: 100% Operational\n\nNo dynamic hazards in active navigation pipelines.`;
        } else if (lowerInput.includes("automation") || lowerInput.includes("routine") || lowerInput.includes("pipeline") || lowerInput.includes("workflow")) {
          reply = `⚡ **[Decentralized Emergency Offline Core]**\n\nProcedural automation crons and local task triggers remain registered in RAM cache. Automated scripts will proceed local execution sequentially. Once internet connectivity is restored, cloud webhook responses will sync back to central logs.`;
        } else if (lowerInput.includes("project") || lowerInput.includes("database") || lowerInput.includes("supabase")) {
          reply = `⚡ **[Decentralized Emergency Offline Core]**\n\nYour active workspace databases are safe. Chat logs are safely nested within local **IndexedDB** databases. PostgreSQL sync triggers will fire automatically the millisecond internet links stabilize.`;
        } else if (lowerInput.includes("hello") || lowerInput.includes("hi") || lowerInput.includes("greetings") || lowerInput.includes("hey")) {
          reply = `⚡ **[Decentralized Emergency Offline Core]**\n\nGreetings, Captain Papa. Standard offline handshakes complete. My secondary core is ready to cache your parameters. What operations shall we prioritize offline?`;
        } else if (lowerInput.includes("help") || lowerInput.includes("manual") || lowerInput.includes("skills")) {
          reply = `⚡ **[Decentralized Emergency Offline Core]**\n\nOffline Command Reference Map:\n- **status**: Analyze core hardware telemetry.\n- **automation**: Inquire active routines.\n- **database**: Verify dynamic database security.\n\nAll chat history is fully cached and resilient to client reloads.`;
        } else if (lowerInput.includes("clear") || lowerInput.includes("clean") || lowerInput.includes("reset")) {
          reply = `⚡ **[Decentralized Emergency Offline Core]**\n\nExecuting clear routines from offline console registers. Simply trigger "New Chat" button to wipe active states.`;
        } else {
          reply = `⚡ **[Decentralized Emergency Offline Core]**\n\nCaptain, my cloud connection is currently offline, so I am running simulated auxiliary training networks. I have safely committed your input parameters to our **IndexedDB Synaptic Cache**.\n\n*Connection Status: Unstable (Emulated).*`;
        }

        const botMsg: CleanMsg = {
          id: Math.random().toString(),
          role: "assistant",
          content: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        };
        const finalMsg = [...updatedMessages, botMsg];
        setCleanMessages(finalMsg);
        await syncWithIndexedDB(finalMsg);
        setIsCleanTyping(false);
        addTerminalLog("INFO", "Generated local assistant model emulations from structural offline caches.");
      }, 850);
      return;
    }

    try {
      const history = updatedMessages.map(m => ({ role: m.role, content: m.content }));
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history,
          provider: "openrouter",
          model: selectedCleanModel,
          userUid: auth.currentUser?.uid,
          userEmail: auth.currentUser?.email,
          userDisplayName: auth.currentUser?.displayName
        })
      });
      if (!res.ok) {
        if (res.status === 402) {
          throw new Error("Insufficient database credits. Your account daily limit has been exhausted. Balance resets automatically tomorrow, or request an override from an Administrator.");
        }
        throw new Error("Synaptic service error connection failed.");
      }
      const data = await res.json();
      if (typeof data.remainingCredits === "number") {
        setUserCredits(data.remainingCredits);
      }
      
      const botMsg: CleanMsg = {
        id: Math.random().toString(),
        role: "assistant",
        content: data.text || "Synchronized empty buffer stream.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      const finalMsg = [...updatedMessages, botMsg];
      setCleanMessages(finalMsg);
      await syncWithIndexedDB(finalMsg);
    } catch (e: any) {
      const errorMsg: CleanMsg = {
        id: Math.random().toString(),
        role: "assistant",
        content: `⚠️ **[Synaptic Disjoint Mode]** ${e.message || "I could not link into the cloud neural network. Your parameters have been safely stored locally. Verify API configuration in Settings."}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      const finalMsg = [...updatedMessages, errorMsg];
      setCleanMessages(finalMsg);
      await syncWithIndexedDB(finalMsg);
    } finally {
      setIsCleanTyping(false);
    }
  };

  const handleClearCleanCache = async () => {
    const cleared: CleanMsg[] = [
      {
        id: "cleared-welcome",
        role: "assistant",
        content: "Conversational buffers purged. Core system ready.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    ];
    setCleanMessages(cleared);
    try {
      await clearWorkspaceMessages();
      safeLocalStorage.setItem("jarvis_clean_messages", JSON.stringify(cleared));
      addTerminalLog("WARN", "Pristine workspace thread purged from IndexedDB and LocalStorage.");
    } catch (err: any) {
      addTerminalLog("ERROR", `Failed to sweep IndexedDB cache registers: ${err.message}`);
    }
  };

  const parseCleanMarkdown = (rawText: string) => {
    return rawText.split("\n").map((line, idx) => {
      let content: React.ReactNode = line;
      if (line.includes("**")) {
        const parts = line.split("**");
        content = parts.map((p, i) =>
          i % 2 === 1 ? <strong key={i} className="text-zinc-900 font-extrabold">{p}</strong> : p
        );
      }
      if (line.startsWith("### ")) return <h4 key={idx} className="text-xs font-bold text-zinc-800 tracking-wide mt-3 mb-1">{line.slice(4)}</h4>;
      if (line.startsWith("## "))  return <h3 key={idx} className="text-sm font-bold text-zinc-900 border-b border-zinc-100 pb-1 mt-4 mb-2">{line.slice(3)}</h3>;
      if (line.startsWith("# "))   return <h2 key={idx} className="text-base font-black text-zinc-950 mt-4 mb-2">{line.slice(2)}</h2>;
      if (line.trim().startsWith("- ") || line.trim().startsWith("* "))
        return <li key={idx} className="ml-4 list-disc text-zinc-700 text-xs mb-1 leading-relaxed">{line.substring(2)}</li>;
      if (line.trim() === "") return <div key={idx} className="h-2" />;
      return <p key={idx} className="text-xs leading-relaxed text-zinc-700 mb-1.5 font-sans">{content}</p>;
    });
  };

  // Sidebar expanded / collapsed calculations
  const isSidebarOpen = sidebarExpanded || (hoverExpandOption && isHoveringSidebar);

  // Compulsory login: Show login/signup interface directly at start if unauthenticated
  if (!booting && !auth.currentUser) {
    return (
      <div className={`${isLightMode ? "app-light bg-slate-50 text-slate-800" : "bg-[#020617] text-gray-100"} min-h-screen flex flex-col font-sans relative overflow-x-hidden ${currentTheme.bgClass} justify-center items-center p-6 select-none`}>
        {/* Ambient glowing background grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(6,182,212,0.05),transparent_60%)] pointer-events-none" />
        
        <div className="w-full max-w-md relative z-10 space-y-4 animate-[fadeIn_0.4s_ease-out]">
          <div className="text-center mb-2">
            <h1 className="font-sans font-black tracking-widest text-3xl uppercase text-zinc-900 dark:text-white leading-none">
              JARVIS <span className="text-[#DA7F5B]">X</span>
            </h1>
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-1.5">
              AUTONOMOUS INTELLIGENCE OPERATING PLATFORM
            </p>
          </div>
          <LoginSignup 
            onLogMessage={addTerminalLog} 
            onLoginStatusChange={(userNick) => {
              setCurrentCallsign(userNick);
              setActivePage("home");
            }} 
            mode="login" 
          />
        </div>
      </div>
    );
  }

  if (!booting && workspaceLayout === "clean") {
    return (
      <div className="min-h-screen bg-[#FDFDFD] text-zinc-800 flex flex-col font-sans relative overflow-x-hidden select-none">
        
        {/* TOP COMPACT HEADER */}
        <header className="shrink-0 border-b border-zinc-200 bg-[#FAFAF9] flex items-center justify-between px-6 py-2.5 z-40 select-none shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[9px] font-bold text-zinc-400 bg-zinc-200/50 px-2 py-0.5 rounded uppercase tracking-wider">
              JX // P-WORK
            </span>
            <button
              onClick={() => {
                setWorkspaceLayout("holographic");
                safeLocalStorage.setItem("jarvis_workspace_layout", "holographic");
                setIsLightMode(false);
                addTerminalLog("CORE", "Switching operating mode to space cybernetic grid HUD.");
              }}
              className="px-2.5 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-650 hover:text-zinc-850 border border-zinc-200 text-[10px] font-sans font-bold tracking-wide rounded-md flex items-center gap-1.5 transition-all uppercase cursor-pointer"
            >
              🚀 Holographic HUD
            </button>
          </div>

          {/* Center Upgrade Link */}
          <div className="flex items-center gap-1.5 font-sans">
            <span className="text-xs text-zinc-500 font-medium select-none">Free plan •</span>
            <button
              onClick={() => {
                addTerminalLog("INFO", "Dispatched premium checkout pipeline.");
                alert("JARVIS X Pro: Unlimited AI context, 40% faster latency, and dedicated vector memory banks.");
              }}
              className="text-xs text-[#DA7F5B] hover:text-[#c46944] font-semibold underline cursor-pointer"
            >
              Upgrade
            </button>
          </div>

          {/* Right utility buttons */}
          <div className="flex items-center gap-3">
            {/* Search command bar */}
            <button
              onClick={() => {
                setCommandBarOpen(true);
                setCommandSearch("");
              }}
              className="p-1.5 px-2.5 border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-500 hover:text-zinc-855 shadow-sm rounded-lg text-[10px] font-sans font-semibold uppercase tracking-wider transition-all flex items-center gap-1"
            >
              <Search size={11} className="text-[#DA7F5B]" /> Search
            </button>
            
            {/* Voice Command Reference Modal controller */}
            <button
              onClick={() => {
                setActivePage("voice");
                addTerminalLog("INFO", "Initialized active voice interface.");
              }}
              className="p-1.5 px-2.5 border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-500 hover:text-zinc-855 shadow-sm rounded-lg text-[10px] font-sans font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5"
            >
              <Radio size={11} className="text-[#DA7F5B] animate-pulse" /> Command manual
            </button>
          </div>
        </header>

        {/* WORKSPACE CONTENT LAYOUT */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* PRISTINE LEFT SIDE PANEL */}
          <aside className="w-64 border-r border-zinc-200 bg-[#FAFAF9] shrink-0 flex flex-col justify-between p-4 font-sans select-none z-30">
            <div className="space-y-4">
              
              {/* Header Toggle: Chat vs Code */}
              <div className="grid grid-cols-2 gap-1 bg-zinc-200/50 p-0.5 rounded-lg select-none">
                <button 
                  onClick={() => handleNavigate("home")}
                  className={`py-1.5 rounded-md text-[11px] font-bold text-center transition-all cursor-pointer ${
                    activePage === "home" || activePage === "assistant"
                      ? "bg-white text-zinc-855 shadow-sm"
                      : "text-zinc-500 hover:text-zinc-800"
                  }`}
                >
                  Chat
                </button>
                <button 
                  onClick={() => handleNavigate("documentation")}
                  className={`py-1.5 rounded-md text-[11px] font-bold text-center transition-all cursor-pointer ${
                    activePage === "documentation"
                      ? "bg-white text-zinc-855 shadow-sm"
                      : "text-zinc-500 hover:text-zinc-805"
                  }`}
                >
                  Code
                </button>
              </div>

              {/* Dynamic Clean button "New chat" with a plus */}
              <button
                onClick={() => {
                  setActivePage("home");
                  setCleanMessages([
                    {
                      id: "welcome",
                      role: "assistant",
                      content: "Greetings, Papa. I have initialized your minimalist workspace system. Any operations or cognitive training queries you transmit will be processed in milliseconds.",
                      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                    }
                  ]);
                  addTerminalLog("INFO", "Pristine workspace thread reset.");
                }}
                className="w-full py-2 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-800 hover:text-[#DA7F5B] text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-all text-center"
              >
                <Plus size={13} className="text-zinc-450" /> New chat
              </button>

              {/* Functional section list items */}
              <div className="space-y-0.5">
                {[
                  { label: "Routine Pipelines", id: "automation" },
                  { label: "Vector Memory Archives", id: "memory" },
                  { label: "Connected Platforms", id: "integrations" },
                  { label: "Operating Diagnostic", id: "dashboard" },
                  { label: "Systemic Settings", id: "settings" }
                ].map((item) => {
                  const isActive = activePage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigate(item.id as PageId)}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer text-left ${
                        isActive 
                          ? "bg-zinc-200/60 text-zinc-950 font-bold"
                          : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/35"
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronRight size={11} className={isActive ? "text-[#DA7F5B]" : "text-zinc-400"} />
                    </button>
                  );
                })}
              </div>

              {/* Recents stream from the screenshot */}
              <div className="pt-2">
                <span className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest px-3 mb-1.5">
                  Recents
                </span>

                <div className="space-y-0.5 max-h-[35vh] overflow-y-auto pr-1 scrollbar-none text-zinc-500 font-medium">
                  {[
                    "Collaborative coding session",
                    "UI redesign analysis & mockups",
                    "Futuristic 3D website project",
                    "Earning money as an AI creator",
                    "Seeking an answer",
                    "Class 11 microeconomics task",
                    "11th Analysis",
                    "Debate preparation",
                    "Building an AI agent",
                    "Untitled chat",
                    "Question answering",
                    "Brief response request",
                    "Greeting exchange"
                  ].map((recText, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setActivePage("home");
                        setCleanMessages([
                          {
                            id: Math.random().toString(),
                            role: "user",
                            content: `Recall and load contextual references for: "${recText}"`,
                            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                          },
                          {
                            id: Math.random().toString(),
                            role: "assistant",
                            content: `Understood, Captain Papa. Loaded full cognitive memory map for **${recText}**. Real-time context synchronizations compile completed. How would you like to direct training vectors?`,
                            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                          }
                        ]);
                        addTerminalLog("INFO", `Switched to workspace seed: "${recText}"`);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-zinc-600 hover:text-[#DA7F5B] hover:bg-zinc-200/30 rounded-lg transition-all truncate block cursor-pointer"
                      title={recText}
                    >
                      {recText}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Bottom user index: Call sign & dynamic roles with logout */}
            <div className="border-t border-zinc-200 pt-3 flex items-center justify-between select-none">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#DA7F5B]/10 border border-[#DA7F5B]/20 flex items-center justify-center font-black text-[#DA7F5B] text-xs">
                  {(currentCallsign || "CPT").slice(0, 2).toUpperCase()}
                </div>
                <div className="text-left font-sans leading-none">
                  <span className="block text-xs font-bold text-zinc-800 truncate max-w-[85px]" title={currentCallsign || "Captain"}>
                    {currentCallsign || "Captain"}
                  </span>
                  <span className={`text-[9px] font-bold select-none uppercase tracking-wider block mt-0.5 ${userCredits !== null && userCredits <= 100 ? "text-red-600 dark:text-red-500 animate-pulse font-extrabold" : "text-[#DA7F5B]"}`}>
                    {userRole} • {userCredits !== null ? `${userCredits} CR` : "500 CR"} {userCredits !== null && userCredits <= 100 && "⚠️ LOW"}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                {/* Reset/Download indices toggle */}
                <button
                  onClick={handleClearCleanCache}
                  className="p-1.5 hover:bg-zinc-200/50 rounded-lg text-zinc-400 hover:text-amber-600 transition-all cursor-pointer"
                  title="Flush Workspace Context Cache"
                >
                  <Trash2 size={13} />
                </button>
                
                {/* Clean layout logout tool */}
                <button
                  onClick={async () => {
                    try {
                      const { logout } = await import("./lib/firebaseAuth");
                      await logout();
                      addTerminalLog("INFO", "Disassociated neural uplink completely. Logged out.");
                    } catch (err: any) {
                      addTerminalLog("ERROR", `Logout fail logic core: ${err.message}`);
                    }
                  }}
                  className="p-1.5 hover:bg-zinc-200/50 rounded-lg text-zinc-400 hover:text-red-500 transition-all cursor-pointer"
                  title="Disassociate Neural Uplink (Log Out)"
                >
                  <LogOut size={13} />
                </button>
              </div>
            </div>
          </aside>

          {/* MAIN CHAT / CONTENT FRAME */}
          <main className="flex-1 flex flex-col bg-white overflow-y-auto relative">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activePage}
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.99 }}
                transition={{ duration: 0.15 }}
                className="flex-1 flex flex-col p-6 md:p-10"
              >
                {/* 1. CHAT CHANNELS (Home/Assistant page layout) */}
                {(activePage === "home" || activePage === "assistant") ? (
                  <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full justify-between h-full">
                    
                    {/* CONNECTION STATUS & OFFLINE EMULATOR BAR */}
                    <div className="flex items-center justify-between px-4 py-2 bg-zinc-50 border border-zinc-250 rounded-xl mb-4 select-none">
                      <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${(!isOnline || simulateOffline) ? "bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.6)]" : "bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"}`} />
                        <span className="text-[10px] font-mono tracking-widest font-bold text-zinc-500 uppercase">
                          {(!isOnline || simulateOffline) ? "SAFE MODE: DECENTRALIZED ARRAY" : "MAIN CLOUD CORE: VERIFIED"}
                        </span>
                        {(!isOnline || simulateOffline) && (
                          <span className="text-[8px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-black tracking-wider ml-1 uppercase">
                            IndexedDB Active
                          </span>
                        )}
                      </div>
                      
                      <button
                        onClick={() => {
                          setSimulateOffline(prev => {
                            const next = !prev;
                            addTerminalLog("INFO", `Holographic Network Interface switched: ${next ? "DECENTRALIZED MODE" : "CLOUD DIRECT"}`);
                            return next;
                          });
                        }}
                        className={`px-2.5 py-1 text-[9px] font-mono font-black rounded-lg border transition-all cursor-pointer ${
                          simulateOffline 
                            ? "bg-amber-500 text-white border-amber-600 shadow-sm" 
                            : "bg-white hover:bg-zinc-100 text-zinc-650 border-zinc-200"
                        }`}
                        title="Disconnect network mock link to verify local indexedDB responses"
                      >
                        {simulateOffline ? "RE-ENGAGE CLOUD" : "SIMULATE DISCONNECT"}
                      </button>
                    </div>

                    {/* SCROLL STREAM OF CONVERSATION */}
                    <div className="flex-1 overflow-y-auto space-y-5 pr-1 mb-6 scrollbar-none select-text">
                      {cleanMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex gap-3.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          {/* Avatar representation */}
                          {msg.role !== "user" && (
                            <div className="w-7 h-7 rounded-lg bg-[#DA7F5B]/10 flex items-center justify-center text-[#DA7F5B] font-bold shrink-0 mt-0.5 select-none font-sans">
                              {/* Orange flower aster */}
                              <svg className="w-5 h-5 text-[#DA7F5B]" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12,2A1.5,1.5,0,0,0,10.5,3.5V8A1.5,1.5,0,0,0,12,9.5,1.5,1.5,0,0,0,13.5,8V3.5A1.5,1.5,0,0,0,12,2Z" />
                                <path d="M12,14.5A1.5,1.5,0,0,0,10.5,16V20.5A1.5,1.5,0,0,0,12,22,1.5,1.5,0,0,0,13.5,20.5V16A1.5,1.5,0,0,0,12,14.5Z" />
                                <path d="M22,12A1.5,1.5,0,0,0,20.5,10.5H16A1.5,1.5,0,0,0,14.5,12,1.5,1.5,0,0,0,16,13.5H20.5A1.5,1.5,0,0,0,22,12Z" />
                                <path d="M9.5,12A1.5,1.5,0,0,0,8,10.5H3.5A1.5,1.5,0,0,0,2,12,1.5,1.5,0,0,0,3.5,13.5H8A1.5,1.5,0,0,0,9.5,12Z" />
                              </svg>
                            </div>
                          )}

                          <div className="flex flex-col gap-1.5 max-w-[85%]">
                            {/* Message Bubble box */}
                            <div className={`rounded-2xl p-3.5 ${
                              msg.role === "user"
                                ? "bg-zinc-100 border border-zinc-200 text-zinc-800 rounded-tr-none px-4"
                                : "text-zinc-800 font-sans"
                            }`}>
                              <div className="font-sans leading-relaxed">
                                {parseCleanMarkdown(msg.content)}
                              </div>
                            </div>
                            <span className="text-[8px] font-mono text-zinc-400 select-none uppercase tracking-widest px-1">
                              {msg.role === "user" ? "PAPA PILOT" : "JARVIS X NEURAL OUT"}&nbsp;•&nbsp;{msg.timestamp}
                            </span>
                          </div>
                        </div>
                      ))}

                      {/* Typing indicator */}
                      {isCleanTyping && (
                        <div className="flex gap-3 items-center">
                          <div className="w-7 h-7 rounded-lg bg-zinc-105 flex items-center justify-center shrink-0 animate-spin">
                            <Loader2 size={13} className="text-[#DA7F5B]" />
                          </div>
                          <span className="text-[10px] font-mono text-zinc-400 tracking-widest animate-pulse">
                            COMPILING SYNAPSE VECTORS...
                          </span>
                        </div>
                      )}
                    </div>

                    {/* DYNAMIC WELCOME HERO SCREEN (only if single message in stack) */}
                    {cleanMessages.length <= 1 && (
                      <div className="flex-1 flex flex-col justify-center items-center py-6 select-none">
                        
                        {/* Floral Core Logo */}
                        <div className="w-14 h-14 flex items-center justify-center bg-transparent rounded-full mb-4">
                          <svg className="w-11 h-11 text-[#DA7F5B]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12,2A1.5,1.5,0,0,0,10.5,3.5V8A1.5,1.5,0,0,0,12,9.5,1.5,1.5,0,0,0,13.5,8V3.5A1.5,1.5,0,0,0,12,2Z" />
                            <path d="M12,14.5A1.5,1.5,0,0,0,10.5,16V20.5A1.5,1.5,0,0,0,12,22,1.5,1.5,0,0,0,13.5,20.5V16A1.5,1.5,0,0,0,12,14.5Z" />
                            <path d="M22,12A1.5,1.5,0,0,0,20.5,10.5H16A1.5,1.5,0,0,0,14.5,12,1.5,1.5,0,0,0,16,13.5H20.5A1.5,1.5,0,0,0,22,12Z" />
                            <path d="M9.5,12A1.5,1.5,0,0,0,8,10.5H3.5A1.5,1.5,0,0,0,2,12,1.5,1.5,0,0,0,3.5,13.5H8A1.5,1.5,0,0,0,9.5,12Z" />
                            <path d="M19.07,4.93A1.5,1.5,0,0,0,16.95,4.93L13.77,8.11A1.5,1.5,0,0,0,13.77,10.23a1.5,1.5,0,0,0,2.12,0l3.18-3.18A1.5,1.5,0,0,0,19.07,4.93Z" />
                            <path d="M10.23,13.77A1.5,1.5,0,0,0,8.11,13.77L4.93,16.95c-.59.59-.59,1.54,0,2.12a1.5,1.5,0,0,0,2.12,0l3.18-3.18A1.5,1.5,0,0,0,10.23,13.77Z" />
                            <path d="M4.93,4.93c-.59.59-.59,1.54,0,2.12L8.11,10.23a1.5,1.5,0,0,0,2.12,0,1.5,1.5,0,0,0,0-2.12L7.05,4.93A1.5,1.5,0,0,0,4.93,4.93Z" />
                            <path d="M13.77,13.77a1.5,1.5,0,0,0,0,2.12l3.18,3.18c.59.59,1.54.59,2.12,0s.59-1.54,0-2.12l-3.18-3.18A1.5,1.5,0,0,0,13.77,13.77Z" />
                          </svg>
                        </div>

                        {/* Elegantly typeset serif heading */}
                        <h2 className="font-serif font-medium text-[38px] text-zinc-800 tracking-tight leading-none mb-10">
                          {currentCallsign ? `${currentCallsign} returns!` : "Papa returns!"}
                        </h2>
                      </div>
                    )}

                    {/* CHAT ENTRY ROUNDED CARD */}
                    <div className="w-full select-text pb-4">
                      
                      {/* Inputs Card block */}
                      <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-[0_4px_16px_rgba(0,0,0,0.02)] focus-within:border-[#DA7F5B]/30 focus-within:shadow-[0_4px_22px_rgba(218,127,91,0.05)] transition-all flex flex-col justify-between max-w-xl w-full mx-auto relative mb-3">
                        <textarea
                          placeholder="Type / for skills"
                          value={cleanInput}
                          onChange={(e) => setCleanInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleSendCleanMessage();
                            }
                          }}
                          className="bg-transparent border-none py-1 px-1 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-0 w-full min-h-[4rem] resize-none font-sans"
                        />

                        {/* Lower controls bar inside textbox */}
                        <div className="flex items-center justify-between pt-3 border-t border-zinc-100 select-none">
                          <div>
                            {/* Circular Plus button */}
                            <button
                              onClick={() => {
                                setCleanInput("Explain simulated orbital diagnostic loads.");
                                addTerminalLog("INFO", "Initialized synaptic context seed templates.");
                              }}
                              className="w-7 h-7 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-805 flex items-center justify-center border border-zinc-200 transition-colors cursor-pointer shadow-sm"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          {/* Right tools side */}
                          <div className="flex items-center gap-3">
                            {/* High-Fidelity Interactive Model Selector Popover */}
                            <div className="relative">
                              <button
                                onClick={() => setIsModelSelectorOpen(!isModelSelectorOpen)}
                                className="flex items-center gap-1.5 px-3 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-650 hover:text-zinc-850 border border-zinc-200 rounded-full text-[11px] font-sans font-semibold transition-all cursor-pointer shadow-sm focus:outline-none"
                              >
                                {selectedCleanModel && (
                                  <div className="shrink-0 flex items-center justify-center scale-90 -ml-0.5 opacity-90">
                                    {getProviderBigIcon(REFERENCE_MODELS.find(m => m.id === selectedCleanModel)?.provider || "anthropic")}
                                  </div>
                                )}
                                <span>{getCleanModelButtonLabel(selectedCleanModel)}</span>
                              </button>

                              {isModelSelectorOpen && (
                                <>
                                  <div
                                    className="fixed inset-0 z-40 bg-transparent cursor-default"
                                    onClick={() => setIsModelSelectorOpen(false)}
                                  />
                                  <div className="absolute bottom-full right-0 mb-2.5 z-50 w-[285px] max-h-[290px] bg-white border border-zinc-200 rounded-2xl shadow-[0_12px_44px_rgba(0,0,0,0.12)] flex flex-col overflow-hidden animate-[fadeIn_0.1s_ease-out]">
                                    <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5 scrollbar-thin select-none">
                                      {REFERENCE_MODELS.map((m) => {
                                        const isSelected = selectedCleanModel === m.id;
                                        return (
                                          <button
                                            key={m.id}
                                            onClick={() => {
                                              setSelectedCleanModel(m.id);
                                              safeLocalStorage.setItem("jarvis_clean_selected_model", m.id);
                                              setIsModelSelectorOpen(false);
                                              addTerminalLog("INFO", `Activated operational pipeline: ${m.name}`);
                                            }}
                                            className={`w-full text-left flex items-start select-none cursor-pointer gap-2.5 p-2 rounded-xl transition-all ${
                                              isSelected 
                                                ? "bg-zinc-100 text-zinc-900" 
                                                : "hover:bg-zinc-50 text-zinc-700 active:bg-zinc-105"
                                            }`}
                                          >
                                            <div className="shrink-0 mt-0.5 w-[28px] h-[28px] rounded-full border border-zinc-100 flex items-center justify-center bg-white shadow-sm">
                                              {getProviderBigIcon(m.provider)}
                                            </div>
                                            <div className="flex-1 min-w-0 pr-1 text-left leading-none">
                                              <div className="text-xs font-bold text-zinc-800 tracking-tight leading-tight block truncate">
                                                {m.name}
                                              </div>
                                              <div className="text-[10px] text-zinc-400 font-medium leading-tight mt-0.5 block truncate">
                                                {m.description}
                                              </div>
                                            </div>
                                            {isSelected && (
                                              <div className="shrink-0 self-center text-[#DA7F5B] pr-1">
                                                <Check size={13} strokeWidth={2.8} />
                                              </div>
                                            )}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                            
                            {/* Speech Ref */}
                            <button
                              onClick={() => {
                                handleNavigate("voice");
                              }}
                              className="p-1 px-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-all cursor-pointer"
                              title="Speech manual"
                            >
                              <Mic size={14} />
                            </button>

                            <div className="flex items-center h-4 gap-0.5 opacity-60">
                              {[1, 3, 2, 4, 1].map((n, i) => (
                                <div key={i} className="w-0.5 h-full bg-zinc-350 rounded" style={{ height: `${n * 25}%` }} />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Beneath Input Box details and buttons */}
                      <div className="text-center space-y-4 select-none">
                        <p className="text-[11px] text-zinc-400 font-sans">
                          You are out of free messages until 10:40 PM •{" "}
                          <button
                            onClick={() => alert("Premium access unlocks 4,000 extra tokens per second.")}
                            className="text-[#DA7F5B] font-semibold underline hover:text-[#c46944] cursor-pointer"
                          >
                            Upgrade
                          </button>
                        </p>

                        {/* Elegant Action Pills: Write, Learn, Code, From Drive, From Gmail */}
                        <div className="flex flex-wrap items-center justify-center gap-2">
                          {[
                            { label: "Write", icon: "✏️", pmt: "Write a draft about space colonization and fusion engines." },
                            { label: "Learn", icon: "🎓", pmt: "Explain quantum teleportation of particles simply." },
                            { label: "Code", icon: "💻", pmt: "Write an optimized TypeScript type definition file." },
                            { label: "From Drive", icon: "📂", pmt: "Simulate reading core flight indexes directories." },
                            { label: "From Gmail", icon: "✉️", pmt: "Sync email log references from Gmail space alert hubs." }
                          ].map((pill) => (
                            <button
                              key={pill.label}
                              onClick={() => {
                                setCleanInput(pill.pmt);
                                addTerminalLog("INFO", `Seeded template script search: "${pill.label}"`);
                              }}
                              className="px-3 py-1.5 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-650 hover:text-zinc-850 rounded-full text-xs font-sans font-medium flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
                            >
                              <span>{pill.icon}</span>
                              <span>{pill.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                    </div>

                  </div>
                ) : (
                  /* 2. SPECIFIC SUBPAGE DISPATCHER container (styled clean light) */
                  <div className="h-full relative font-sans text-zinc-800 bg-[#FCFCFB] border border-zinc-200 rounded-2xl p-6 shadow-[0_4px_16px_rgba(0,0,0,0.01)] min-h-[70vh]">
                    {activePage === "about" && renderProtectedPage(<About />, "about")}
                    {activePage === "features" && renderProtectedPage(<Features />, "features")}
                    {activePage === "dashboard" && renderProtectedPage(<Dashboard />, "dashboard")}
                    {activePage === "search" && renderProtectedPage(<JarvisSearch onLogMessage={addTerminalLog} />, "search")}
                    {activePage === "memory" && renderProtectedPage(<Memory onLogMessage={addTerminalLog} />, "memory")}
                    {activePage === "automation" && renderProtectedPage(<Automation onLogMessage={addTerminalLog} />, "automation")}
                    {activePage === "integrations" && renderProtectedPage(<Integrations onLogMessage={addTerminalLog} />, "integrations")}
                    {activePage === "voice" && renderProtectedPage(<Voice onLogMessage={addTerminalLog} />, "voice")}
                    {activePage === "analytics" && renderProtectedPage(<Analytics onLogMessage={addTerminalLog} />, "analytics")}
                    {activePage === "pricing" && renderProtectedPage(<Pricing onNavigate={handleNavigate} />, "pricing")}
                    {activePage === "documentation" && renderProtectedPage(<Documentation />, "documentation")}
                    {activePage === "blog" && renderProtectedPage(<Blog />, "blog")}
                    {activePage === "login" && renderProtectedPage(<LoginSignup onLogMessage={addTerminalLog} onLoginStatusChange={setCurrentCallsign} mode="login" />, "login")}
                    {activePage === "signup" && renderProtectedPage(<LoginSignup onLogMessage={addTerminalLog} onLoginStatusChange={setCurrentCallsign} mode="signup" />, "signup")}
                    {activePage === "contact" && renderProtectedPage(<Contact onLogMessage={addTerminalLog} />, "contact")}
                    {activePage === "settings" && renderProtectedPage(<Settings onLogMessage={addTerminalLog} />, "settings")}
                    {activePage === "vaultshield" && renderProtectedPage(<ComputerControl onLogMessage={addTerminalLog} />, "vaultshield")}
                    {activePage === "admin" && renderProtectedPage(<Admin onLogMessage={addTerminalLog} />, "admin")}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

          </main>
        </div>

        {/* DRAG-AND-DROP GLOBAL COMMAND BAR modal overlay (Ctrl+K) */}
        <AnimatePresence>
          {commandBarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4"
            >
              <div className="absolute inset-0" onClick={() => setCommandBarOpen(false)} />

              <motion.div
                initial={{ opacity: 0, scale: 0.98, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -5 }}
                transition={{ duration: 0.2 }}
                className="max-w-xl w-full border border-zinc-205 bg-white rounded-2xl p-4 shadow-xl relative z-10 flex flex-col overflow-hidden space-y-3"
              >
                <div className="flex items-center gap-3 border-b border-zinc-100 pb-3 select-text">
                  <Search size={15} className="text-[#DA7F5B]" />
                  <input
                    type="text"
                    autoFocus
                    placeholder="Search active agents or workspace commands..."
                    value={commandSearch}
                    onChange={(e) => setCommandSearch(e.target.value)}
                    className="bg-transparent text-zinc-800 placeholder-zinc-400 font-sans text-xs focus:outline-none flex-grow min-w-0"
                  />
                  <button
                    onClick={() => setCommandBarOpen(false)}
                    className="text-zinc-400 hover:text-zinc-805 font-bold text-[10px] uppercase font-mono px-1.5 py-0.5 rounded border border-zinc-200 hover:border-zinc-350 shrink-0"
                  >
                    ESC
                  </button>
                </div>

                {/* Command list mapping */}
                <div className="max-h-64 overflow-y-auto space-y-1 pr-1 font-sans text-xs">
                  {filteredCommandPalette.map((cmd, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        cmd.action();
                        setCommandBarOpen(false);
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-lg border border-transparent hover:border-zinc-200 hover:bg-zinc-50 text-left text-zinc-650 hover:text-zinc-900 transition-all cursor-pointer select-none"
                    >
                      <div>
                        <span className="block font-bold text-zinc-800 capitalize">{cmd.title}</span>
                        <span className="block text-[10px] text-zinc-400 mt-0.5">{cmd.subtitle}</span>
                      </div>
                      <span className="text-[9px] tracking-wide bg-zinc-100 px-2 py-0.5 border border-zinc-150 rounded text-zinc-500 capitalize whitespace-nowrap font-mono">
                        {cmd.tags[0]}
                      </span>
                    </button>
                  ))}

                  {filteredCommandPalette.length === 0 && (
                    <div className="text-center py-6 text-zinc-400 font-semibold uppercase">
                      No matching commands found
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    );
  }

  if (!booting && workspaceLayout === "holographic") {
    return (
      <HolographicHUD
        setWorkspaceLayout={setWorkspaceLayout}
        isLightMode={isLightMode}
        setIsLightMode={setIsLightMode}
        activeThemeId={activeThemeId}
        handleThemeShift={handleThemeShift}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        currentTheme={currentTheme}
      />
    );
  }

  return (
    <div className={`${isLightMode ? "app-light" : ""} min-h-screen text-gray-100 flex flex-col font-sans relative overflow-x-hidden ${currentTheme.bgClass} select-none`}>
      {/* 1. INITIAL SYSTEM BOOT UP */}
      <AnimatePresence>
        {booting && (
          <motion.div
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className={`fixed inset-0 ${isLightMode ? "bg-slate-50 text-slate-900" : "bg-[#020617] text-gray-100"} z-50 flex flex-col items-center justify-center p-6 space-y-6`}
          >
            <div className="relative w-48 h-48 flex items-center justify-center border border-cyan-500/10 rounded-full">
              <div className="absolute inset-0 border border-cyan-500/30 rounded-full scale-95 border-dashed animate-[spin_20s_linear_infinite]" />
              <div className="absolute inset-2 border-t-2 border-b-2 border-cyan-400 rounded-full animate-[spin_4s_linear_infinite_reverse]" />
              <div className="w-16 h-16 border border-cyan-400 bg-cyan-950/20 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                <Cpu size={32} className="text-cyan-400 animate-pulse" />
              </div>
            </div>

            <div className="text-center w-full max-w-sm font-mono space-y-3">
              <h2 className="text-xs font-black tracking-widest text-cyan-400 uppercase animate-pulse">INITIATING JARVIS-X OS MAINFRAME</h2>
              <p className="text-[9px] text-cyan-300/60 truncate uppercase">{bootText}</p>

              <div className="h-1 w-full bg-cyan-950 border border-cyan-500/20 rounded overflow-hidden relative">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 via-cyan-400 to-fuchsia-500 transition-all duration-150"
                  style={{ width: `${bootProgress}%` }}
                />
              </div>
              <span className="block text-[9px] text-cyan-400/50 uppercase">{bootProgress}% TELEMETRY CALIBRATION METRICS</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. SMART TOP NAVBAR SYSTEM */}
      <header className="shrink-0 border-b border-white/5 bg-black/40 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-3">
          {/* Sidebar Drawer Toggle (Ctrl+B) */}
          <button
            onClick={() => {
              setSidebarExpanded(!sidebarExpanded);
              safeLocalStorage.setItem("jarvis_sidebar_expanded", JSON.stringify(!sidebarExpanded));
              playSystemBeep(520, 0.08);
            }}
            className="hidden md:flex p-1.5 border border-white/10 rounded-lg text-slate-400 hover:text-white hover:border-white/20 hover:bg-white/5 cursor-pointer transition-all shrink-0"
            title="Toggle Expanded Sidebar (Ctrl + B)"
          >
            {sidebarExpanded ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          </button>

          {/* Core Mobile menu button toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 text-slate-400 hover:text-white border border-white/10 rounded hover:bg-white/5 cursor-pointer"
          >
            {isMobileMenuOpen ? <X size={15} /> : <Menu size={15} />}
          </button>


        </div>

        {/* Center item: Holographic Search Bar linking to command overlay */}
        <div
          onClick={() => {
            setCommandBarOpen(true);
            setCommandSearch("");
            playSystemBeep(650, 0.05);
          }}
          className="hidden md:flex items-center gap-2.5 px-3 py-1.5 w-80 max-w-lg border border-white/10 bg-slate-900/40 rounded-lg hover:border-white/20 select-none cursor-pointer text-left text-slate-400 text-xs font-mono select-none"
        >
          <Search size={12} className={currentTheme.primary} />
          <span className="flex-1 text-[10px] uppercase text-slate-500 tracking-wider">Search active agents or commands...</span>
          <span className="bg-white/5 border border-white/10 rounded px-1.5 py-0.5 text-[8px] tracking-widest text-slate-500 font-bold shrink-0">CTRL+K</span>
        </div>

        {/* Right Nav Options: Profile, Audio system, Voice telemetry, Theme shifts */}
        <div className="flex items-center gap-3 sm:gap-4 font-mono text-[10px] text-slate-400">
          
          {/* Switch to Pristine Workspace (Claude Layout) */}
          <button
            onClick={() => {
              setWorkspaceLayout("clean");
              safeLocalStorage.setItem("jarvis_workspace_layout", "clean");
              setIsLightMode(true);
              addTerminalLog("CORE", "Switching operating mode to pristine minimalist workspace.");
              playSystemBeep(920, 0.2, "sine");
            }}
            className="px-2.5 py-1.5 border border-[#DA7F5B]/30 hover:border-[#DA7F5B]/60 bg-[#DA7F5B]/10 hover:bg-[#DA7F5B]/20 text-[#DA7F5B] rounded-lg tracking-wider font-semibold transition-all cursor-pointer mr-2 uppercase flex items-center gap-1"
            title="Clean Layout Mode"
          >
            <span>✨</span> <span className="hidden sm:inline">Clean Workspace</span>
          </button>

          {/* Active Counters metrics */}
          <div className="hidden lg:flex items-center gap-2 border-r border-white/5 pr-4">
            <div className="flex flex-col text-right">
              <span className="text-[8px] text-slate-500 uppercase font-bold tracking-widest">Neural Cfg</span>
              <span className={`text-[10px] font-bold ${currentTheme.primary}`}>{currentTheme.name}</span>
            </div>
            <div className={`w-1.5 h-1.5 rounded-full ${currentTheme.pulse} animate-ping`} />
          </div>

          <div className="hidden lg:flex items-center gap-1 bg-white/5 border border-white/10 px-2 py-1 rounded">
            <Clock size={11} className={currentTheme.primary} />
            <span className="tracking-widest text-[9px] font-bold text-slate-300">{currentTime || "SYNCING..."}</span>
          </div>

          {/* Sound Synthesizer toggler */}
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              addTerminalLog("INFO", `Holographic bleepers set: ${!soundEnabled ? "ONLINE" : "MUTED"}`);
              playSystemBeep(700, 0.08);
            }}
            className="p-1.5 text-slate-400 hover:text-white border border-white/10 rounded-lg hover:bg-white/5 cursor-pointer"
            title={soundEnabled ? "Disable OS Sounds" : "Enable Sound Frequencies"}
          >
            {soundEnabled ? <Volume2 size={13} className={currentTheme.primary} /> : <VolumeX size={13} />}
          </button>

          {/* Core premium Light/Dark mode switcher */}
          <button
            onClick={() => {
              setIsLightMode(!isLightMode);
              safeLocalStorage.setItem("jarvis_light_mode", JSON.stringify(!isLightMode));
              addTerminalLog("INFO", `Holographic Visual Mode Shifted: ${!isLightMode ? "LIGHT GLASS MODE" : "COSMIC DARK MODE"}`);
              playSystemBeep(850, 0.08);
            }}
            className="p-1.5 text-slate-400 hover:text-white border border-white/10 rounded-lg hover:bg-white/5 cursor-pointer flex items-center justify-center"
            title={isLightMode ? "Switch to Cosmic Dark Mode" : "Switch to Light Glass Mode"}
          >
            {isLightMode ? <Moon size={13} className="text-[#7B61FF]" /> : <Sun size={13} className="text-amber-400 animate-pulse" />}
          </button>

          {/* OS Accent Switcher Popup bar */}
          <div className="relative group shrink-0">
            <button
              className="p-1.5 text-slate-400 hover:text-white border border-white/10 rounded-lg hover:bg-white/5 cursor-pointer flex items-center justify-center shrink-0"
              title="Switch Themes"
            >
              <Sparkles size={13} className={currentTheme.primary} />
            </button>
            <div className="absolute right-0 top-full mt-2 w-48 bg-black/90 border border-white/10 rounded-xl p-2 hidden group-hover:block hover:block space-y-1 shadow-2xl z-50">
              <span className="block text-[8px] font-mono tracking-widest text-zinc-500 uppercase px-2 py-1">AI OPERATING SKINS</span>
              {Object.values(THEMES).map((thm) => (
                <button
                  key={thm.id}
                  onClick={() => handleThemeShift(thm.id)}
                  className={`w-full flex items-center justify-between text-left px-2 py-1.5 rounded-md text-[9px] font-mono uppercase cursor-pointer ${
                    activeThemeId === thm.id ? "bg-white/5 text-white font-black" : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: thm.hex }} />
                    {thm.name}
                  </span>
                  {activeThemeId === thm.id && <Zap size={8} className="text-amber-400 animate-spin" />}
                </button>
              ))}
            </div>
          </div>

          {/* Notifications Panel */}
          <div className="relative shrink-0">
            <button
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setProfileMenuOpen(false);
                playSystemBeep(450, 0.05);
              }}
              className="p-1.5 text-slate-400 hover:text-white border border-white/10 rounded-lg hover:bg-white/5 cursor-pointer relative"
              title="System Notifications"
            >
              <Bell size={13} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
            </button>
            <AnimatePresence>
              {notificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute right-0 top-full mt-2 w-72 bg-black/95 border border-white/10 rounded-xl p-3 shadow-2xl z-50 space-y-2.5"
                >
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-[9px] font-mono font-bold uppercase text-slate-300 flex items-center gap-1.5">
                      <Bell size={10} className={currentTheme.primary} /> Core Warnings Network
                    </span>
                    <button
                      onClick={() => setNotificationsOpen(false)}
                      className="text-[8px] text-slate-500 hover:text-slate-300 font-bold uppercase"
                    >
                      Mute
                    </button>
                  </div>
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    <div className="p-2 border border-white/5 bg-slate-900/30 rounded text-[9px] font-mono leading-relaxed text-slate-300">
                      <div className="flex justify-between items-center text-[7px] text-zinc-500 mb-0.5 uppercase">
                        <span>CRITICAL GATEWAY</span>
                        <span>0.02ms ago</span>
                      </div>
                      Fingerprint linked successfully with high accuracy metrics.
                    </div>
                    <div className="p-2 border border-white/5 bg-slate-900/30 rounded text-[9px] font-mono leading-relaxed text-slate-300">
                      <div className="flex justify-between items-center text-[7px] text-zinc-500 mb-0.5 uppercase">
                        <span>SYNAPSE BUFFER</span>
                        <span>1 min ago</span>
                      </div>
                      Neural vector index compiled with 4,096 nodes operating.
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile User Option */}
          <div className="relative shrink-0">
            <button
              onClick={() => {
                setProfileMenuOpen(!profileMenuOpen);
                setNotificationsOpen(false);
                playSystemBeep(520, 0.08);
              }}
              className="flex items-center gap-1.5 p-1 border border-white/10 rounded-full hover:border-white/20 hover:bg-white/5 cursor-pointer shrink-0"
            >
              <div className="w-6 h-6 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center shrink-0">
                <User size={11} className="text-slate-300" />
              </div>
            </button>
            <AnimatePresence>
              {profileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute right-0 top-full mt-2 w-52 bg-black/95 border border-white/10 rounded-xl p-2.5 shadow-2xl z-50 space-y-2"
                >
                  <div className="border-b border-white/5 pb-2 text-[10px] uppercase">
                    <span className="block text-[8px] text-slate-500 font-bold tracking-widest">ACTIVE PILOT</span>
                    <span className="block font-black text-white truncate">{currentCallsign ? `CAPTAIN_${currentCallsign}` : "COGNITIVE_AGENT_01"}</span>
                  </div>
                  <div className="space-y-1">
                    <button
                      onClick={() => { setProfileMenuOpen(false); handleNavigate("settings"); }}
                      className="w-full text-left px-2 py-1 flex items-center gap-2 text-[9px] font-mono uppercase text-slate-300 hover:bg-white/5 rounded cursor-pointer"
                    >
                      <Sliders size={10} /> Shift Settings
                    </button>
                    <button
                      onClick={() => { setProfileMenuOpen(false); handleNavigate("about"); }}
                      className="w-full text-left px-2 py-1 flex items-center gap-2 text-[9px] font-mono uppercase text-slate-300 hover:bg-white/5 rounded cursor-pointer"
                    >
                      <HelpCircle size={10} /> Core Manual
                    </button>
                    <button
                      onClick={async () => {
                        setProfileMenuOpen(false);
                        try {
                          const { logout } = await import("./lib/firebaseAuth");
                          await logout();
                          addTerminalLog("INFO", "Disassociated neural uplink completely. Logged out.");
                        } catch (err: any) {
                          addTerminalLog("ERROR", `Logout failure: ${err.message}`);
                        }
                      }}
                      className="w-full text-left px-2 py-1 flex items-center gap-2 text-[9px] font-mono uppercase text-red-400 hover:text-red-300 hover:bg-white/5 rounded cursor-pointer"
                    >
                      <LogOut size={10} /> Log out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </header>

      {/* 3. CORE ADAPTIVE WORKSPACE HIERARCHY */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* SIDEBAR SYSTEM with Collapsible Springs */}
        <aside
          onMouseEnter={() => { if (hoverExpandOption) setIsHoveringSidebar(true); }}
          onMouseLeave={() => { if (hoverExpandOption) setIsHoveringSidebar(false); }}
          className={`hidden md:flex flex-col border-r border-white/5 bg-black/40 backdrop-blur-md shrink-0 transition-all duration-300 ${
            isSidebarOpen ? "w-64" : "w-[68px]"
          } select-none h-full z-30 justify-between overflow-x-hidden`}
        >
          {/* Top Logo and Page Link List */}
          <div className="flex flex-col flex-1 p-3 overflow-y-auto scrollbar-none space-y-4">
            
            {/* Expanded system brand */}
            <div className={`flex items-center gap-3 px-2 py-1 transition-all ${isSidebarOpen ? "opacity-100" : "opacity-80 justify-center"}`}>
              <div className="relative flex items-center justify-center shrink-0">
                <Cpu size={18} className={`${currentTheme.primary} animate-spin`} />
                <span className="absolute inset-0 bg-cyan-400/10 rounded-full scale-125 animate-ping pointer-events-none" />
              </div>
              
              {isSidebarOpen && (
                <div className="flex flex-col font-mono text-[10px]">
                  <span className="font-sans font-black tracking-widest text-white leading-none">JARVIS <span className={currentTheme.primary}>X</span></span>
                  <span className="text-[7px] text-slate-500 tracking-widest mt-0.5 leading-none">INTELLIGENT_OS</span>
                </div>
              )}
            </div>

            {/* Core navigation categorizations */}
            {["core", "operating", "services", "auth"].map((cat) => {
              const catItems = navigationItems.filter(item => item.category === cat);
              return (
                <div key={cat} className="space-y-1">
                  {isSidebarOpen ? (
                    <span className="block text-[7px] font-mono font-black text-slate-500 uppercase tracking-widest pl-2.5 mb-1">{cat} subsystem</span>
                  ) : (
                    <div className="h-px bg-white/5 my-2" />
                  )}

                  <div className="space-y-0.5">
                    {catItems.map((item) => {
                      const isActive = activePage === item.id;
                      return (
                        <button
                          key={item.id}
                          id={`sidebar-link-${item.id}`}
                          onClick={() => handleNavigate(item.id)}
                          className={`w-full flex items-center rounded-lg py-2 transition-all cursor-pointer relative uppercase text-xs font-mono group ${
                            isSidebarOpen ? "px-3 gap-3 justify-start" : "justify-center"
                          } ${
                            isActive
                              ? `bg-white/5 text-white font-black border border-white/10 ${currentTheme.glow}`
                              : "text-slate-400 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          {/* Animated indicator line */}
                          {isActive && (
                            <motion.div
                              layoutId="activeSelectionLine"
                              className={`absolute left-0 w-1 h-3/5 rounded ${currentTheme.pulse}`}
                              transition={{ type: "spring", stiffness: 350, damping: 30 }}
                            />
                          )}

                          {renderIcon(item.iconName, isActive ? currentTheme.primary : "")}

                          {isSidebarOpen ? (
                            <span className="truncate text-[10px] tracking-wide">{item.label}</span>
                          ) : (
                            <div className="absolute left-full ml-2 px-2.5 py-1 text-[9px] font-mono uppercase bg-black border border-white/15 rounded text-slate-200 hidden group-hover:block whitespace-nowrap shadow-xl z-50">
                              {item.label}
                            </div>
                          )}

                          {/* Quick notification alert simulation */}
                          {item.id === "assistant" && isSidebarOpen && (
                            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                          )}
                          {item.id === "dashboard" && isSidebarOpen && (
                            <span className="ml-auto text-[7px] font-bold text-green-400 bg-green-500/10 border border-green-500/20 rounded px-1">SYS</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>


        </aside>

        {/* MOBILE NAVIGATION OVERLAY DRAWER */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-64 bg-[#020617] border-r border-white/10 z-50 p-5 flex flex-col space-y-6 overflow-y-auto md:hidden"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="font-mono text-xs font-black text-white uppercase flex items-center gap-1.5">
                  <Cpu size={14} className={currentTheme.primary} /> JARVIS X NAV
                </span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-slate-400 hover:text-white font-bold p-1 cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="space-y-4">
                {["core", "operating", "services", "auth"].map((cat) => (
                  <div key={cat} className="space-y-1">
                    <span className="block text-[8px] font-mono text-zinc-500 uppercase font-black tracking-widest pl-1">{cat} node</span>
                    {navigationItems
                      .filter((item) => item.category === cat)
                      .map((item) => {
                        const isActive = activePage === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleNavigate(item.id)}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-mono transition-all text-left uppercase cursor-pointer ${
                              isActive
                                ? "bg-white/5 text-white font-bold shadow-[0_0_8px_rgba(6,182,212,0.15)] border border-white/10"
                                : "text-slate-400 hover:text-white"
                            }`}
                          >
                            {renderIcon(item.iconName, isActive ? currentTheme.primary : "")}
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MAIN HUD PAGE WORKSPACE */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <div className="flex-grow p-4 sm:p-5 lg:p-6 relative">
            
            {/* Screen transition layout */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activePage}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="h-full"
              >
                {activePage === "home" && (
                  <Home 
                    onNavigate={handleNavigate} 
                    onLogMessage={addTerminalLog} 
                    activeThemeId={activeThemeId} 
                    isLightMode={isLightMode}
                    soundEnabled={soundEnabled}
                  />
                )}
                {activePage === "about" && renderProtectedPage(<About />, "about")}
                {activePage === "features" && renderProtectedPage(<Features />, "features")}
                {activePage === "dashboard" && renderProtectedPage(<Dashboard />, "dashboard")}
                {activePage === "cognition" && renderProtectedPage(<Cognition />, "cognition")}
                {activePage === "assistant" && renderProtectedPage(<Assistant onLogMessage={addTerminalLog} onNavigate={handleNavigate} />, "assistant")}
                {activePage === "search" && renderProtectedPage(<JarvisSearch onLogMessage={addTerminalLog} />, "search")}
                {activePage === "memory" && renderProtectedPage(<Memory onLogMessage={addTerminalLog} />, "memory")}
                {activePage === "automation" && renderProtectedPage(<Automation onLogMessage={addTerminalLog} />, "automation")}
                {activePage === "integrations" && renderProtectedPage(<Integrations onLogMessage={addTerminalLog} />, "integrations")}
                {activePage === "voice" && renderProtectedPage(<Voice onLogMessage={addTerminalLog} />, "voice")}
                {activePage === "analytics" && renderProtectedPage(<Analytics onLogMessage={addTerminalLog} />, "analytics")}
                {activePage === "pricing" && renderProtectedPage(<Pricing onNavigate={handleNavigate} />, "pricing")}
                {activePage === "documentation" && renderProtectedPage(<Documentation />, "documentation")}
                {activePage === "blog" && renderProtectedPage(<Blog />, "blog")}
                {activePage === "login" && renderProtectedPage(<LoginSignup onLogMessage={addTerminalLog} onLoginStatusChange={setCurrentCallsign} mode="login" />, "login")}
                {activePage === "signup" && renderProtectedPage(<LoginSignup onLogMessage={addTerminalLog} onLoginStatusChange={setCurrentCallsign} mode="signup" />, "signup")}
                {activePage === "contact" && renderProtectedPage(<Contact onLogMessage={addTerminalLog} />, "contact")}
                {activePage === "settings" && renderProtectedPage(<Settings onLogMessage={addTerminalLog} />, "settings")}
                {activePage === "vaultshield" && renderProtectedPage(<ComputerControl onLogMessage={addTerminalLog} />, "vaultshield")}
                {activePage === "admin" && renderProtectedPage(<Admin onLogMessage={addTerminalLog} />, "admin")}
              </motion.div>
            </AnimatePresence>
          </div>


        </main>
      </div>

      {/* 4. DRAG-AND-DROP GLOBAL COMMAND BAR modal overlay (Ctrl+K) */}
      <AnimatePresence>
        {commandBarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-start justify-center pt-20 px-4"
          >
            {/* Clicking backdrop closes command bar */}
            <div className="absolute inset-0" onClick={() => setCommandBarOpen(false)} />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.25 }}
              className="max-w-xl w-full border border-white/10 bg-slate-950/95 rounded-2xl p-4 shadow-3xl relative z-10 flex flex-col overflow-hidden space-y-3"
            >
              {/* Animated HUD lines decoration on Command modal */}
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
              
              <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                <Command size={16} className={currentTheme.primary} />
                <input
                  type="text"
                  autoFocus
                  placeholder="Type an OS instruction. Try overclock, theme, diagnostic..."
                  value={commandSearch}
                  onChange={(e) => {
                    setCommandSearch(e.target.value);
                    playSystemBeep(800, 0.02);
                  }}
                  className="bg-transparent text-white placeholder-zinc-500 font-mono text-xs focus:outline-none flex-grow min-w-0"
                />
                <button
                  onClick={() => setCommandBarOpen(false)}
                  className="text-zinc-500 hover:text-white font-bold text-[10px] uppercase font-mono px-1.5 py-0.5 rounded border border-white/15 hover:border-white/35 shrink-0"
                >
                  ESC
                </button>
              </div>

              {/* Suggestions grid items */}
              <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1 font-mono text-[10px]">
                {filteredCommandPalette.map((cmd, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      cmd.action();
                      setCommandBarOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg border border-white/5 hover:border-white/15 bg-white/5 text-left text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer select-none"
                  >
                    <div>
                      <span className="block font-bold text-[11px] capitalize text-white">{cmd.title}</span>
                      <span className="block text-[8px] text-zinc-500 text-xs mt-0.5">{cmd.subtitle}</span>
                    </div>
                    <span className="text-[8px] tracking-widest bg-zinc-950 px-1.5 py-0.5 rounded border border-white/10 text-zinc-400 capitalize whitespace-nowrap">
                      {cmd.tags[0]}
                    </span>
                  </button>
                ))}

                {filteredCommandPalette.length === 0 && (
                  <div className="text-center py-6 text-zinc-500 font-bold uppercase truncate">
                    No matching holographic instructions found
                  </div>
                )}
              </div>

              {/* Bottom Command instructions helpers line */}
              <div className="text-[8px] font-mono text-zinc-500 flex justify-between uppercase pt-1 border-t border-white/5">
                <span>↑↓ to highlight</span>
                <span>Click or tap to execute node</span>
                <span>Ctrl+B sidebar</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
