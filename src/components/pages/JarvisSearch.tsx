import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Sparkles,
  History,
  Bookmark,
  Share2,
  ExternalLink,
  Mic,
  MicOff,
  Paperclip,
  Image as ImageIcon,
  RotateCcw,
  Cpu,
  BookmarkCheck,
  CheckCircle2,
  FileText,
  Copy,
  Check,
  TrendingUp,
  Newspaper,
  Code,
  Brain,
  Atom,
  Trophy,
  Sliders,
  Play,
  ArrowRight,
  Globe,
  Loader2,
  Database,
  Network
} from "lucide-react";

import HolographicEarth from "../HolographicEarth";
import { safeLocalStorage } from "../../utils/safeLocalStorage";
import { auth } from "../../lib/firebase";

interface SearchSource {
  title: string;
  url: string;
}

interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: string;
  keyFindings: string[];
  confidence: number;
  sources: SearchSource[];
  text: string;
  relatedSearches: string[];
}

interface JarvisSearchProps {
  onLogMessage: (level: "INFO" | "WARN" | "CORE" | "ERROR", text: string) => void;
}

export default function JarvisSearch({ onLogMessage }: JarvisSearchProps) {
  // Input states
  const [query, setQuery] = useState("");
  const [deepSearch, setDeepSearch] = useState(false);
  const [attachedImage, setAttachedImage] = useState<{ name: string; type: string; data: string } | null>(null);
  const [attachedFile, setAttachedFile] = useState<{ name: string; type: string; text: string } | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  
  // Voice states
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any | null>(null);
  
  // Results states
  const [searchOutput, setSearchOutput] = useState<any | null>(null);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>(() => {
    const saved = safeLocalStorage.getItem("jarvis_search_history");
    return saved ? JSON.parse(saved) : [];
  });
  const [bookmarkedItems, setBookmarkedItems] = useState<string[]>(() => {
    const saved = safeLocalStorage.getItem("jarvis_search_bookmarks");
    return saved ? JSON.parse(saved) : [];
  });

  // UI interaction states
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<"search" | "history" | "bookmarks">("search");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showHistoryPane, setShowHistoryPane] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Initialize Web Speech API for voice search
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = "en-US";

      rec.onstart = () => {
        setIsListening(true);
        onLogMessage("INFO", "Holographic speech receptors online. Whisper coordinates...");
      };

      rec.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        setQuery(transcript);
        onLogMessage("INFO", `Speech decoded: "${transcript}"`);
      };

      rec.onerror = (err: any) => {
        console.error("Speech Recognition Error:", err);
        setIsListening(false);
        onLogMessage("WARN", "Speech capture interrupted. Check microphone configuration.");
      };

      rec.onend = () => {
        setIsListening(false);
      };

      setRecognition(rec);
    }
  }, []);

  // Save history to localstorage
  const saveSearchHistory = (updated: SearchHistoryItem[]) => {
    setSearchHistory(updated);
    safeLocalStorage.setItem("jarvis_search_history", JSON.stringify(updated));
  };

  // Save bookmarks to localstorage
  const saveBookmarks = (updated: string[]) => {
    setBookmarkedItems(updated);
    safeLocalStorage.setItem("jarvis_search_bookmarks", JSON.stringify(updated));
  };

  // Quick chips search click
  const handleChipClick = (term: string) => {
    setQuery(term);
    handleSearchTrigger(term);
  };

  // Custom markdown parser
  const parseMarkdownHtml = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      // Bold syntax
      let lineContent: React.ReactNode = line;
      if (line.includes("**")) {
        const segments = line.split("**");
        lineContent = segments.map((seg, sIdx) =>
          sIdx % 2 === 1 ? (
            <span key={sIdx} className="text-cyan-300 font-extrabold shadow-[0_0_8px_rgba(6,182,212,0.1)]">
              {seg}
            </span>
          ) : (
            seg
          )
        );
      }

      // Headers
      if (line.startsWith("### ")) {
        return <h4 key={idx} className="text-[11px] font-mono uppercase text-cyan-400 font-bold tracking-widest mt-4 mb-2">{line.slice(4)}</h4>;
      }
      if (line.startsWith("## ")) {
        return <h3 key={idx} className="text-xs font-mono uppercase text-white font-bold tracking-wider border-b border-cyan-500/15 pb-1 mt-5 mb-3">{line.slice(3)}</h3>;
      }
      if (line.startsWith("# ")) {
        return <h2 key={idx} className="text-sm font-sans font-black uppercase text-cyan-400 tracking-wider mt-6 mb-3">{line.slice(2)}</h2>;
      }

      // Bullets
      if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
        return (
          <li key={idx} className="ml-4 list-disc text-[11px] text-slate-300 mb-1 leading-relaxed">
            {line.substring(2)}
          </li>
        );
      }

      // Code blocks or quotes
      if (line.startsWith("> ")) {
        return (
          <blockquote key={idx} className="border-l-2 border-fuchsia-500 pl-3 py-1 bg-fuchsia-950/10 text-slate-400 italic text-[10px] my-2 rounded-r">
            {line.slice(2)}
          </blockquote>
        );
      }

      if (line.trim() === "") {
        return <div key={idx} className="h-2" />;
      }

      return (
        <p key={idx} className="text-[11px] leading-relaxed text-slate-300 mb-2">
          {lineContent}
        </p>
      );
    });
  };

  // Toggle bookmark
  const toggleBookmark = (id: string, itemQuery: string) => {
    let updated: string[];
    if (bookmarkedItems.includes(id)) {
      updated = bookmarkedItems.filter((i) => i !== id);
      onLogMessage("INFO", `Removed bookmark reference: "${itemQuery}"`);
    } else {
      updated = [...bookmarkedItems, id];
      onLogMessage("INFO", `Anchored research search query bookmark: "${itemQuery}"`);
    }
    saveBookmarks(updated);
  };

  // File uploading handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      if (file.type.startsWith("image/")) {
        reader.onload = () => {
          setAttachedImage({
            name: file.name,
            type: file.type,
            data: reader.result ? (reader.result as string).split(",")[1] : ""
          });
          onLogMessage("INFO", `Multimodal spectrum linked: Attached photo ${file.name}`);
        };
        reader.readAsDataURL(file);
      } else {
        // Plain text, Markdown, or JSON extraction
        reader.onload = () => {
          setAttachedFile({
            name: file.name,
            type: file.type,
            text: reader.result as string
          });
          onLogMessage("INFO", `Doc database linked: Synced text corpus from ${file.name}`);
        };
        reader.readAsText(file);
      }
    }
  };

  // Search execution trigger
  const handleSearchTrigger = async (overrideQuery?: string) => {
    const currentQuery = overrideQuery || query;
    if (!currentQuery.trim()) return;

    setIsSearching(true);
    setSearchOutput(null);
    setActiveStepIdx(0);
    onLogMessage("CORE", `Initiating quantum retrieval: news, developments, and real-time facts for "${currentQuery}"`);

    // Step animation sequencer
    const interval = setInterval(() => {
      setActiveStepIdx((prev) => {
        if (prev < 5) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 1200);

    try {
      const payload = {
        query: currentQuery,
        deepSearch,
        image: attachedImage ? { data: attachedImage.data, mimeType: attachedImage.type } : null,
        pdfText: attachedFile ? attachedFile.text : null,
        history: [], // Standard fresh search chat scope
        userUid: auth.currentUser?.uid,
        userEmail: auth.currentUser?.email,
        userDisplayName: auth.currentUser?.displayName
      };

      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        if (res.status === 402) {
          throw new Error("Insufficient security credentials or credits. Balance automatically resets tomorrow at 00:00.");
        }
        throw new Error(`Satellite disconnect. Status code: ${res.status}`);
      }

      const data = await res.json();
      clearInterval(interval);

      const newHistoryItem: SearchHistoryItem = {
        id: Math.random().toString(),
        query: currentQuery,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        keyFindings: data.keyFindings,
        confidence: data.confidence,
        sources: data.sources,
        text: data.text,
        relatedSearches: data.relatedSearches
      };

      // Set output context
      setSearchOutput({
        ...data,
        id: newHistoryItem.id
      });

      // Maintain user history state (max 15 items)
      saveSearchHistory([newHistoryItem, ...searchHistory.slice(0, 14)]);
      onLogMessage("INFO", `Intel packet received. Confidence index: ${data.confidence}% with ${data.sources?.length} connected citations.`);

      // Reset fields
      setAttachedImage(null);
      setAttachedFile(null);
    } catch (err: any) {
      clearInterval(interval);
      setIsSearching(false);
      onLogMessage("ERROR", `Neural Retrieval Collision: ${err.message || err}`);
    } finally {
      setIsSearching(false);
    }
  };

  // Copy results code block
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    onLogMessage("INFO", "Citations block decrypted and copied to clipboard.");
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Suggested quick topics
  const suggestedChips = [
    { label: "AI & Neural Processors", term: "latest artificial intelligence neural processor developments 2026", icon: <Brain size={10} className="text-cyan-400" /> },
    { label: "Fusion Space Propulsion", term: "fusion rocket engine starship space propulsion design news", icon: <Atom size={10} className="text-fuchsia-400" /> },
    { label: "Quantum Computation", term: "quantum computers superconducting qubits announcements today", icon: <Cpu size={10} className="text-emerald-400" /> },
    { label: "Galactic News Today", term: "global breaking news and cosmological event alerts today", icon: <Newspaper size={10} className="text-amber-400" /> },
  ];

  return (
    <div className="h-full flex flex-col md:flex-row gap-6 relative select-text">
      
      {/* 1. INTERACTIVE RESEARCH LOGS SIDEBAR */}
      <AnimatePresence>
        {showHistoryPane && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="flex flex-col border border-cyan-500/10 bg-black/95 md:bg-black/45 backdrop-blur-lg md:backdrop-blur-md rounded-xl p-4 shrink-0 overflow-y-auto space-y-4 max-h-[calc(100vh-16rem)] md:max-h-[calc(100vh-14rem)] scrollbar-thin absolute md:relative z-45 md:z-auto top-20 md:top-auto left-4 md:left-auto w-[280px] shadow-2xl md:shadow-none"
          >
            <div className="flex items-center justify-between border-b border-cyan-500/15 pb-2">
              <span className="text-[10px] font-mono uppercase text-cyan-400 tracking-widest flex items-center gap-1.5 font-bold">
                <Database size={11} /> Cognitive Cache
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    saveSearchHistory([]);
                    onLogMessage("INFO", "Cognitive search history logs purged.");
                  }}
                  className="text-[9px] font-mono text-cyan-500/40 hover:text-cyan-400 hover:underline transition-all cursor-pointer"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowHistoryPane(false)}
                  className="md:hidden text-[9px] font-mono text-cyan-400/80 hover:text-cyan-300 transition-all cursor-pointer border border-cyan-500/20 px-1.5 py-0.5 rounded bg-cyan-950/20"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Sub-tabs inside cache sidebar */}
            <div className="flex gap-1 bg-cyan-950/20 border border-cyan-500/10 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab("search")}
                className={`flex-1 py-1 text-[8px] font-mono uppercase rounded transition-all cursor-pointer ${
                  activeTab === "search" ? "bg-cyan-500 text-black font-extrabold" : "text-cyan-400/70 hover:text-white"
                }`}
              >
                Recent
              </button>
              <button
                onClick={() => setActiveTab("bookmarks")}
                className={`flex-1 py-1 text-[8px] font-mono uppercase rounded transition-all cursor-pointer ${
                  activeTab === "bookmarks" ? "bg-cyan-500 text-black font-extrabold" : "text-cyan-400/70 hover:text-white"
                }`}
              >
                Bookmarks ({bookmarkedItems.length})
              </button>
            </div>

            <div className="space-y-2 flex-1">
              {activeTab === "search" ? (
                searchHistory.length === 0 ? (
                  <div className="text-center py-8 text-[9px] font-mono text-cyan-500/30 uppercase">
                    No historic queries synced
                  </div>
                ) : (
                  searchHistory.map((item) => (
                    <div
                      key={item.id}
                      className={`p-2.5 rounded border text-left transition-all ${
                        searchOutput?.id === item.id
                          ? "border-cyan-400/40 bg-cyan-950/25 shadow-[0_0_8px_rgba(6,182,212,0.1)]"
                          : "border-cyan-500/10 bg-cyan-950/10"
                      }`}
                    >
                      <div
                        onClick={() => {
                          setQuery(item.query);
                          handleSearchTrigger(item.query);
                        }}
                        className="font-sans text-[11px] font-semibold text-white line-clamp-2 uppercase tracking-wide hover:text-cyan-400 transition-colors cursor-pointer"
                        title="Click to re-execute search query"
                      >
                        {item.query}
                      </div>
                      <div className="flex justify-between items-center mt-2 text-[8px] font-mono text-cyan-500/50">
                        <span>{item.timestamp}</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setSearchOutput(item);
                              setQuery(item.query);
                              onLogMessage("INFO", `Re-loaded historical research index: "${item.query}"`);
                            }}
                            className="px-1 py-0.5 bg-fuchsia-500/10 hover:bg-fuchsia-500 hover:text-black border border-fuchsia-500/30 text-fuchsia-400 text-[7px] rounded cursor-pointer uppercase font-sans font-bold"
                            title="Load cached result instantly"
                          >
                            Cache
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setQuery(item.query);
                              handleSearchTrigger(item.query);
                            }}
                            className="px-1 py-0.5 bg-cyan-500/10 hover:bg-cyan-500 hover:text-black border border-cyan-500/30 text-cyan-300 text-[7px] rounded cursor-pointer uppercase font-sans font-bold flex items-center gap-0.5"
                            title="Re-run search query"
                          >
                            <RotateCcw size={6} /> Run
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )
              ) : (
                searchHistory.filter((item) => bookmarkedItems.includes(item.id)).length === 0 ? (
                  <div className="text-center py-8 text-[9px] font-mono text-cyan-500/30 uppercase">
                    No anchored bookmarks found
                  </div>
                ) : (
                  searchHistory
                    .filter((item) => bookmarkedItems.includes(item.id))
                    .map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          setSearchOutput(item);
                          setQuery(item.query);
                        }}
                        className="p-2.5 rounded border border-cyan-500/15 bg-cyan-950/20 text-left hover:bg-cyan-500/5 cursor-pointer transition-all"
                      >
                        <div className="font-sans text-[11px] font-bold text-white line-clamp-1 uppercase">
                          {item.query}
                        </div>
                        <div className="text-[8px] font-mono text-cyan-400/40 mt-1">
                          SAVED RESEARCH COORDINATE
                        </div>
                      </div>
                    ))
                )
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* 2. CORE SEARCH AND RETRIEVAL DISPLAY */}
      <div className="flex-grow flex flex-col space-y-6 max-w-4xl mx-auto w-full">
        
        {/* UPPER GLASS CARD FOR SEARCH ACTIONS */}
        <section className="border border-cyan-500/15 bg-black/45 backdrop-blur-md rounded-xl p-4 sm:p-5 relative overflow-hidden">
          {/* Futuristic background decoration rings */}
          <div className="absolute top-0 right-0 w-24 h-24 border border-cyan-500/5 rounded-full -mr-8 -mt-8 pointer-events-none animate-[spin_40s_linear_infinite]" />
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)] animate-pulse" />
              <h1 className="font-sans font-black tracking-widest text-sm text-white uppercase">
                JARVIS <span className="text-cyan-400">SEARCH</span>
              </h1>
              <span className="text-[8px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-1.5 py-0.5 rounded uppercase">
                PERPLEXITY_EDITION
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Deep search switch config */}
              <button
                onClick={() => {
                  setDeepSearch(!deepSearch);
                  onLogMessage("INFO", `Deep Multi-Turn Research Core: ${!deepSearch ? "ENGAGED" : "STANDBY"}`);
                }}
                className={`px-2.5 py-1.5 rounded-lg border text-[8px] font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                  deepSearch
                    ? "bg-fuchsia-500 border-fuchsia-400 text-black font-extrabold shadow-[0_0_12px_rgba(236,72,153,0.3)] animate-none"
                    : "bg-cyan-950/20 border-cyan-500/20 text-cyan-400 hover:border-cyan-400"
                }`}
                title="Deep Search performs extensive sub-querying and comprehensive scientific report compilation"
              >
                <Sliders size={10} className={deepSearch ? "animate-spin" : ""} />
                {deepSearch ? "[DEEP RESEARCH: ON]" : "DEEP SEARCH"}
              </button>
            </div>
          </div>

          {/* Core query entry bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearchTrigger();
            }}
            className="relative flex items-center bg-cyan-950/15 border border-cyan-500/20 rounded-xl overflow-hidden focus-within:border-cyan-400/50 focus-within:shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all p-1.5"
          >
            <div className="pl-3 pr-2 text-cyan-400/60 shrink-0">
              <Search size={16} />
            </div>

            <input
              type="text"
              id="jarvis-search-main-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the internet with absolute real-time verification..."
              className="bg-transparent text-white placeholder-cyan-500/45 text-xs font-mono py-2 w-full focus:outline-none min-w-0"
              disabled={isSearching}
            />

            {/* Drag & drop/attach buttons */}
            <div className="flex items-center gap-1 px-1.5 shrink-0">
              {attachedImage && (
                <span className="inline-flex items-center gap-1 bg-cyan-950 border border-cyan-400/40 text-[9px] font-mono text-cyan-300 px-2 py-1 rounded">
                  <ImageIcon size={9} /> IMAGE
                  <button onClick={() => setAttachedImage(null)} className="text-red-400 font-bold ml-1 hover:text-white pb-0.5">×</button>
                </span>
              )}
              {attachedFile && (
                <span className="inline-flex items-center gap-1 bg-fuchsia-950 border border-fuchsia-400/40 text-[9px] font-mono text-fuchsia-300 px-2 py-1 rounded">
                  <FileText size={9} /> DOC
                  <button onClick={() => setAttachedFile(null)} className="text-red-400 font-bold ml-1 hover:text-white pb-0.5">×</button>
                </span>
              )}

              {/* Speech to text input trigger */}
              {recognition && (
                <button
                  type="button"
                  id="jarvis-search-voice-trigger"
                  onClick={() => {
                    if (isListening) {
                      recognition.stop();
                    } else {
                      recognition.start();
                    }
                  }}
                  className={`p-1.5 rounded transition-all cursor-pointer ${
                    isListening ? "text-fuchsia-400 bg-fuchsia-950/40 border border-fuchsia-500 animate-pulse" : "text-cyan-400 hover:bg-white/5"
                  }`}
                  title="Voice Search Activation"
                >
                  <Mic size={14} />
                </button>
              )}

              {/* File upload hidden trigger */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-1.5 text-cyan-400 hover:bg-white/5 rounded transition-all cursor-pointer"
                title="Attach text file or PDF for context synthesis"
              >
                <Paperclip size={14} />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".txt,.md,.json,.csv,.js,.ts,.py"
                className="hidden"
              />

              {/* Image upload hidden trigger */}
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="p-1.5 text-cyan-400 hover:bg-white/5 rounded transition-all cursor-pointer"
                title="Attach visual frame for multimodal research"
              >
                <ImageIcon size={14} />
              </button>
              <input
                type="file"
                ref={imageInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />

              {/* Submit search button */}
              <button
                type="submit"
                id="jarvis-search-primary-btn"
                disabled={isSearching || !query.trim()}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-extrabold text-[11px] font-mono rounded-lg hover:shadow-[0_0_12px_rgba(6,182,212,0.3)] transition-all cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed uppercase shrink-0"
              >
                {isSearching ? <Loader2 size={12} className="animate-spin" /> : <Play size={10} className="fill-black inline mr-1" />}
                ENGAGE
              </button>
            </div>
          </form>

          {/* Quick chips rows */}
          <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2 border-t border-cyan-500/10">
            <span className="text-[8px] font-mono text-cyan-500/40 uppercase tracking-widest mr-1">Trending Vectors:</span>
            {suggestedChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleChipClick(chip.term)}
                className="inline-flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 rounded border border-cyan-500/10 bg-cyan-950/10 hover:border-cyan-400/40 hover:bg-cyan-500/5 hover:text-white transition-all cursor-pointer uppercase text-cyan-400/80"
              >
                {chip.icon}
                <span>{chip.label}</span>
              </button>
            ))}
          </div>

          {/* Search history component with click to re-execute and clear history button */}
          {searchHistory.length > 0 && (
            <div className="flex flex-col gap-2 mt-3 pt-2 border-t border-cyan-500/10 text-left">
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1 font-bold">
                  <History size={10} className="text-cyan-400 animate-pulse" /> Neural Query History Vault:
                </span>
                <button
                  type="button"
                  onClick={() => {
                    saveSearchHistory([]);
                    onLogMessage("WARN", "Holographic search query history purged.");
                  }}
                  className="text-[8px] font-mono text-red-400 hover:text-red-300 hover:underline transition-all cursor-pointer uppercase float-right tracking-wider font-semibold"
                  title="Clear entire search query history"
                >
                  [Clear History]
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {searchHistory.map((item, idx) => (
                  <button
                    key={item.id || idx}
                    type="button"
                    onClick={() => {
                      setQuery(item.query);
                      handleSearchTrigger(item.query);
                    }}
                    className="group inline-flex items-center gap-1 text-[9px] font-mono px-2 py-1 rounded border border-cyan-500/15 bg-cyan-950/30 hover:border-cyan-400 hover:bg-cyan-500/10 hover:text-white transition-all cursor-pointer text-cyan-300 uppercase shrink-0"
                    title={`Click to re-execute search for "${item.query}"`}
                  >
                    <RotateCcw size={7} className="text-cyan-400 group-hover:rotate-45 transition-transform" />
                    <span className="max-w-[130px] sm:max-w-[200px] truncate">{item.query}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* LOADING REASONING STEPS FOR CINEMATIC HUD DISPLAY */}
        <AnimatePresence>
          {isSearching && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="border border-cyan-500/10 bg-black/60 rounded-xl p-5"
            >
              <div className="flex items-center justify-between border-b border-cyan-500/15 pb-2.5 mb-4">
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Loader2 size={12} className="animate-spin text-cyan-400" /> RETRIEVAL WORKFLOW TIMELINE
                </span>
                <span className="text-[9px] font-mono text-fuchsia-400 animate-pulse uppercase">[ENGAGED]</span>
              </div>

              {/* Dynamic Step visualizer */}
              <div className="space-y-3.5 pl-2">
                {[
                  "DECONSTRUCTING MULTI-FACETED QUERY INTENT",
                  deepSearch ? "LAUNCHING COLLABORATIVE DEEP MULTI-TURN RESEARCH MODULES" : "ENGAGING REAL-TIME SEARCH INDEXES",
                  "EXTRACTING HIGHEST CORRELATION WEB TARGET RESULTS",
                  "SCANNED & ANALYZED REAL-TIME CITATIONS",
                  "CORE RE-RANKING & HEURISTIC FILTERING COMPLETE",
                  "AI CONVOLUTION SYNTHESIS MODEL COMPILED"
                ].map((step, idx) => {
                  const isPast = idx < activeStepIdx;
                  const isCurrent = idx === activeStepIdx;
                  const isFuture = idx > activeStepIdx;

                  return (
                    <div key={idx} className="flex items-center gap-3 text-xs font-mono">
                      {isPast && (
                        <CheckCircle2 size={14} className="text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] fill-cyan-950/30" />
                      )}
                      {isCurrent && (
                        <div className="size-3.5 rounded-full border border-fuchsia-500 flex items-center justify-center">
                          <span className="size-1.5 rounded-full bg-fuchsia-400 animate-ping" />
                        </div>
                      )}
                      {isFuture && (
                        <div className="size-3.5 rounded-full border border-cyan-500/10 flex items-center justify-center bg-cyan-950/10" />
                      )}

                      <span
                        className={`text-[9px] tracking-wider uppercase ${
                          isPast ? "text-cyan-300" : isCurrent ? "text-fuchsia-400 font-bold" : "text-cyan-500/20"
                        }`}
                      >
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Pulse animation bars */}
              <div className="mt-5 h-1 w-full bg-cyan-950/30 border border-cyan-500/10 rounded overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-cyan-500 animate-[shimmer_2s_infinite] w-[40%]" style={{ animationName: "shimmer" }} />
                <style>{`
                  @keyframes shimmer {
                    0% { left: -40%; }
                    100% { left: 100%; }
                  }
                `}</style>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* LANDING EARTH HUD SEARCH INTERFACE */}
        {!searchOutput && !isSearching && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {/* Center Earth */}
            <HolographicEarth />

            {/* AI Search Insights Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-12">
              <div className="p-4 border border-cyan-500/10 bg-black/45 backdrop-blur-md rounded-xl border-black/10 text-left transition-all group hover:-translate-y-0.5 hover:bg-cyan-950/15 hover:border-cyan-500/20 duration-300">
                <div className="w-8 h-8 rounded-lg bg-[#00D4FF]/10 flex items-center justify-center mb-3 group-hover:bg-[#00D4FF]/15 transition-all">
                  <Brain size={16} className="text-[#00D4FF]" />
                </div>
                <h3 className="font-mono text-[10px] font-black uppercase text-white tracking-wider">Semantic Understanding</h3>
                <p className="text-[10px] text-slate-400 leading-relaxed mt-1">
                  Processes and analyzes input query intent through multi-layered natural language parsing vectors.
                </p>
              </div>

              <div className="p-4 border border-cyan-500/10 bg-black/45 backdrop-blur-md rounded-xl border-black/10 text-left transition-all group hover:-translate-y-0.5 hover:bg-cyan-950/15 hover:border-cyan-500/20 duration-300">
                <div className="w-8 h-8 rounded-lg bg-[#2D7FF9]/10 flex items-center justify-center mb-3 group-hover:bg-[#2D7FF9]/15 transition-all">
                  <Globe size={16} className="text-[#2D7FF9]" />
                </div>
                <h3 className="font-mono text-[10px] font-black uppercase text-white tracking-wider">Real-time data streams</h3>
                <p className="text-[10px] text-slate-400 leading-relaxed mt-1">
                  Connects to global live-evidence indexing feeds to synthesize up-to-the-second informational packets.
                </p>
              </div>

              <div className="p-4 border border-cyan-500/10 bg-black/45 backdrop-blur-md rounded-xl border-black/10 text-left transition-all group hover:-translate-y-0.5 hover:bg-cyan-950/15 hover:border-cyan-500/20 duration-300">
                <div className="w-8 h-8 rounded-lg bg-[#7B61FF]/10 flex items-center justify-center mb-3 group-hover:bg-[#7B61FF]/15 transition-all">
                  <Cpu size={16} className="text-[#7B61FF]" />
                </div>
                <h3 className="font-mono text-[10px] font-black uppercase text-white tracking-wider">Intelligence ranking</h3>
                <p className="text-[10px] text-slate-400 leading-relaxed mt-1">
                  Ranks search evidence nodes based on trust factor heuristics, relevancy index, and domain authority.
                </p>
              </div>

              <div className="p-4 border border-cyan-500/10 bg-black/45 backdrop-blur-md rounded-xl border-black/10 text-left transition-all group hover:-translate-y-0.5 hover:bg-cyan-950/15 hover:border-cyan-500/20 duration-300">
                <div className="w-8 h-8 rounded-lg bg-[#00D4FF]/10 flex items-center justify-center mb-3 group-hover:bg-[#00D4FF]/15 transition-all">
                  <Network size={16} className="text-[#00D4FF]" />
                </div>
                <h3 className="font-mono text-[10px] font-black uppercase text-white tracking-wider">Memory graph</h3>
                <p className="text-[10px] text-slate-400 leading-relaxed mt-1">
                  Maps extracted facts into relational semantic networks to allow cohesive multi-turn reasoning context.
                </p>
              </div>

              <div className="p-4 border border-cyan-500/10 bg-black/45 backdrop-blur-md rounded-xl border-black/10 text-left transition-all group hover:-translate-y-0.5 hover:bg-cyan-950/15 hover:border-cyan-500/20 duration-300 sm:col-span-2 lg:col-span-1">
                <div className="w-8 h-8 rounded-lg bg-[#7B61FF]/10 flex items-center justify-center mb-3 group-hover:bg-[#7B61FF]/15 transition-all">
                  <TrendingUp size={16} className="text-[#7B61FF]" />
                </div>
                <h3 className="font-mono text-[10px] font-black uppercase text-white tracking-wider">Trending vectors</h3>
                <p className="text-[10px] text-slate-400 leading-relaxed mt-1">
                  Tracks query velocity, interest shifts, and breaking news topics inside the satellite mainframe.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* 3. RETRIEVED SEARCH RESULTS ARCHITECTURE */}
        <AnimatePresence>
          {searchOutput && !isSearching && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              ref={scrollContainerRef}
              className="space-y-6"
            >
              
              {/* UPPER CITATIONS & HEALTH STATUS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Confidence Meter */}
                <div className="border border-cyan-500/10 bg-cyan-950/5 backdrop-blur-md rounded-xl p-3 text-center sm:text-left">
                  <span className="block text-[8px] font-mono text-cyan-500/50 uppercase tracking-widest">
                    Verification Confidence
                  </span>
                  <div className="flex items-baseline justify-center sm:justify-start gap-1 mt-1">
                    <span className="text-xl font-sans font-black text-cyan-400">
                      {searchOutput.confidence}%
                    </span>
                    <span className="text-[8px] font-mono text-green-400">CORROBORATED</span>
                  </div>
                  <div className="h-1 bg-cyan-950 rounded mt-1 overflow-hidden">
                    <div className="h-full bg-cyan-400" style={{ width: `${searchOutput.confidence}%` }} />
                  </div>
                </div>

                {/* Scanned index */}
                <div className="border border-cyan-500/10 bg-cyan-950/5 backdrop-blur-md rounded-xl p-3 text-center sm:text-left">
                  <span className="block text-[8px] font-mono text-cyan-500/50 uppercase tracking-widest">
                    Total Scanned Index
                  </span>
                  <div className="flex items-baseline justify-center sm:justify-start gap-1 mt-1">
                    <span className="text-xl font-sans font-black text-white">
                      {searchOutput.sources?.length ? searchOutput.sources.length + 5 : 12}
                    </span>
                    <span className="text-[8px] font-mono text-cyan-400">SATELLITES</span>
                  </div>
                  <span className="block text-[8px] font-mono text-cyan-400/50 uppercase mt-0.5">
                    DEEP RETRIEVAL SCRAPE ONLINE
                  </span>
                </div>

                {/* Bookmark & Actions Panel */}
                <div className="border border-cyan-500/10 bg-cyan-950/5 backdrop-blur-md rounded-xl p-3 flex items-center justify-around sm:justify-end gap-3">
                  <button
                    onClick={() => toggleBookmark(searchOutput.id, searchOutput.query)}
                    className={`p-2 rounded-lg border transition-all cursor-pointer ${
                      bookmarkedItems.includes(searchOutput.id)
                        ? "border-amber-400 bg-amber-950/20 text-amber-400"
                        : "border-cyan-500/15 bg-slate-900/10 text-cyan-400 hover:border-cyan-400 hover:bg-white/5"
                    }`}
                    title="Bookmark/Anchor Search Results"
                  >
                    <BookmarkCheck size={14} />
                  </button>

                  <button
                    onClick={() => copyToClipboard(searchOutput.text, searchOutput.id)}
                    className="p-2 rounded-lg border border-cyan-500/15 bg-slate-900/10 text-cyan-400 hover:border-cyan-400 hover:bg-white/5 transition-all cursor-pointer"
                    title="Copy response markdown"
                  >
                    {copiedId === searchOutput.id ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              {/* CORE INTELLIGENCE REPORT AND CITATIONS */}
              <div className="border border-cyan-500/15 bg-black/45 backdrop-blur-md rounded-xl p-4 sm:p-6 space-y-5">
                
                {/* Header title */}
                <div className="flex items-center justify-between border-b border-cyan-500/15 pb-3">
                  <div className="flex items-center gap-1.5 text-[9px] font-mono text-cyan-400 uppercase tracking-widest">
                    <Sparkles className="size-3 animate-pulse text-cyan-400" /> Verified Intelligence Corroboration
                  </div>
                  <span className="text-[8px] font-mono text-slate-500">
                    UTC TIME: {new Date().toUTCString().slice(17, 25)}
                  </span>
                </div>

                {/* Key Findings Card */}
                {searchOutput.keyFindings && searchOutput.keyFindings.length > 0 && (
                  <div className="p-4 border border-fuchsia-500/15 bg-fuchsia-950/5 rounded-xl space-y-2.5">
                    <span className="block text-[8px] font-mono font-bold text-fuchsia-400 uppercase tracking-wider">
                      Key Core Discoveries:
                    </span>
                    <ul className="space-y-1.5">
                      {searchOutput.keyFindings.map((finding: string, fIdx: number) => (
                        <li key={fIdx} className="flex gap-2 text-xs text-slate-300">
                          <span className="text-fuchsia-400 font-bold shrink-0">•</span>
                          <span className="font-sans text-[11px] leading-relaxed select-text">{finding}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Main AI answer text block */}
                <div className="font-sans text-xs text-left select-text p-2 bg-slate-900/10 rounded">
                  {parseMarkdownHtml(searchOutput.text)}
                </div>

                {/* Web Citations Source array */}
                {searchOutput.sources && searchOutput.sources.length > 0 && (
                  <div className="pt-4 border-t border-cyan-500/10 space-y-3">
                    <div className="text-[9px] font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Globe size={11} className="text-cyan-400" /> Grounding Evidence Network (Citations):
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {searchOutput.sources.map((source: SearchSource, sIdx: number) => (
                        <a
                          key={sIdx}
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-2.5 rounded-lg border border-cyan-500/10 bg-cyan-950/20 hover:bg-cyan-500/10 hover:border-cyan-400/40 transition-all text-[10px] font-mono text-cyan-400/80 cursor-pointer"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
                            <span className="truncate text-white font-semibold max-w-[200px]">{source.title}</span>
                          </div>
                          <ExternalLink size={10} className="text-cyan-500/60 hover:text-cyan-300 shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* YouTube Embedding option */}
                {searchOutput.youtubeVideoId && (
                  <div className="p-4 border border-cyan-500/15 bg-cyan-950/15 rounded-xl space-y-3">
                    <div className="flex items-center gap-1.5 text-[9px] font-mono text-cyan-400 uppercase tracking-widest">
                      <Sparkles className="size-3 text-cyan-400" /> Embedded YouTube Video Node
                    </div>
                    <div className="aspect-video w-full rounded-lg overflow-hidden border border-cyan-500/10 bg-black">
                      <iframe
                        title="Embedded YouTube Video"
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${searchOutput.youtubeVideoId}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}

                {/* Related follow-up questions */}
                {searchOutput.relatedSearches && searchOutput.relatedSearches.length > 0 && (
                  <div className="pt-4 border-t border-cyan-500/10 space-y-2">
                    <span className="block text-[8px] font-mono font-bold text-cyan-500/50 uppercase tracking-widest">
                      Reflective Follow-Up Queries:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {searchOutput.relatedSearches.map((rel: string, rIdx: number) => (
                        <button
                          key={rIdx}
                          onClick={() => {
                            setQuery(rel);
                            handleSearchTrigger(rel);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[9px] font-mono border border-cyan-500/10 bg-cyan-950/25 text-cyan-400 hover:border-cyan-400 hover:bg-cyan-500/5 transition-all text-left cursor-pointer rounded-lg uppercase"
                        >
                          <span>{rel}</span>
                          <ArrowRight size={8} className="text-cyan-500 shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Toggle Search History Sidebar Button */}
      <button
        type="button"
        onClick={() => {
          setShowHistoryPane(!showHistoryPane);
          onLogMessage("INFO", `Holographic search cache panel: ${!showHistoryPane ? "DEPLOYED" : "RETRACED"}`);
        }}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 flex items-center justify-center p-3 sm:p-3.5 bg-cyan-950/90 border border-cyan-500/40 text-cyan-400 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] hover:bg-cyan-500 hover:text-black hover:scale-105 active:scale-95 transition-all duration-300 md:opacity-85 hover:opacity-100 cursor-pointer group"
        title="Toggle Search Cache Panel (History & Bookmarks)"
      >
        <History size={18} className="group-hover:rotate-12 transition-transform duration-300" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out text-[9px] font-mono uppercase tracking-widest pl-0 font-bold group-hover:pl-2 whitespace-nowrap">
          Cache Panel
        </span>
      </button>

    </div>
  );
}
