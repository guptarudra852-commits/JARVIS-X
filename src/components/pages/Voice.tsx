import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Shield, 
  Radio, 
  VolumeX, 
  Pocket, 
  HelpCircle, 
  X, 
  Terminal, 
  Info, 
  Sparkles, 
  AlertCircle 
} from "lucide-react";
import VoiceCanvas3D from "../VoiceCanvas3D";

interface VoiceProps {
  onLogMessage: (level: "INFO" | "WARN" | "CORE" | "ERROR", text: string) => void;
}

export default function Voice({ onLogMessage }: VoiceProps) {
  const [isListening, setIsListening] = useState(false);
  const [activeSpeech, setActiveSpeech] = useState(false);
  const [wakeWord, setWakeWord] = useState("hey-jarvis");
  const [voicePersona, setVoicePersona] = useState("Zephyr");
  const [responseText, setResponseText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const voices = ["Zephyr", "Puck", "Charon", "Kore", "Fenrir"];
  const [waveformValues, setWaveformValues] = useState<number[]>(Array(32).fill(25));

  // Dynamic voice commands database
  const commandList = [
    {
      category: "推進力制御 Flight Systems",
      utterance: "Hey JARVIS, calibrate primary fusion thrusters.",
      desc: "Trigger high-frequency orbital phase calibration to align ship flight coordinates.",
      micActiveText: "AWAITING COGNITIVE DECODER...",
      micIdleText: "STANDBY"
    },
    {
      category: "生命維持 Life / Reactor Diagnostics",
      utterance: "Computer, scan reactor fuel core status.",
      desc: "Perform dynamic safety sweeps to ensure fuel cycle energy is above peak limits.",
      micActiveText: "CORES WAITING FEEDBACK...",
      micIdleText: "STANDBY"
    },
    {
      category: "シナプス統合 Workspace / Memories Sync",
      utterance: "System, query preferred workspace synaptic memory.",
      desc: "Scan personal databases for aligned crew records and coordinate updates.",
      micActiveText: "INDEXER STAGE ACTIVE...",
      micIdleText: "STANDBY"
    },
    {
      category: "合成特性 Vocal Timbre Matrix",
      utterance: "Hey JARVIS, switch vocal response persona to Fenrir.",
      desc: "Hot-swap synthesis frequencies, tones, and dialogue rules on the fly.",
      micActiveText: "SPEECH MODULATOR ARMED...",
      micIdleText: "STANDBY"
    },
    {
      category: "消去プロトコル Core Session Purge",
      utterance: "System, clear all conversation buffers.",
      desc: "Trigger absolute emergency wipe on redundant local chat history stacks.",
      micActiveText: "WIPE DECODERS LISTEN...",
      micIdleText: "STANDBY"
    }
  ];

  // Animation loop for waveform when listening
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isListening) {
      interval = setInterval(() => {
        setWaveformValues(
          Array(32)
            .fill(0)
            .map(() => Math.floor(Math.random() * 85) + 15)
        );
      }, 80);
    } else {
      setWaveformValues(Array(32).fill(20)); // Reset to idle state
    }
    return () => clearInterval(interval);
  }, [isListening]);

  const handleMicToggle = () => {
    if (!isListening) {
      setIsListening(true);
      setResponseText("");
      onLogMessage("INFO", `Speech sensory loop initialized. Active wake word: "${wakeWord}"`);
      // Simulate hearing
      setTimeout(() => {
        setIsListening(false);
        setActiveSpeech(true);
        setResponseText(`"Mainframe connection complete, Captain. All thrusters, reactor blocks, and solar grids are fully aligned. Systems are green."`);
        onLogMessage("CORE", "JARVIS X voice synthesis dispatch complete.");
        // Audio synthesis simulation plays voice beep
        playVoiceSynthBeep();
      }, 4000);
    } else {
      setIsListening(false);
    }
  };

  const playVoiceSynthBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(620, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch (e) {
      console.log("Audio not allowed yet");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-white relative">
      
      {/* HEADER SECTION with Command Guide Trigger Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-500/10 pb-6 mb-8 select-none">
        <div>
          <h1 className="text-3xl font-sans font-black tracking-tight text-white flex items-center gap-3">
            <Radio className="text-cyan-400 shrink-0 animate-pulse" /> VOICE INTERFACE HUD
          </h1>
          <p className="text-xs font-mono text-cyan-400/60 mt-1 uppercase">SYNC REAL-TIME VOCAL SYNTHESIS AND speech SAMPLE GRIDS</p>
        </div>
        <div>
          <button
            type="button"
            onClick={() => {
              setIsModalOpen(true);
              onLogMessage("INFO", "Opened voice command reference diagnostic overlay.");
            }}
            className="px-4 py-2 border border-cyan-400/30 bg-cyan-950/20 text-cyan-300 hover:bg-[#00D4FF] hover:text-black hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:border-cyan-400 text-xs font-mono tracking-wider font-bold rounded-xl flex items-center gap-2 cursor-pointer transition-all uppercase"
          >
            <HelpCircle size={14} /> Command Reference
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* Left Column Controls */}
        <div className="p-6 bg-black/45 border border-cyan-500/15 rounded-xl space-y-6">
          <div className="flex items-center justify-between border-b border-cyan-500/10 pb-2">
            <h2 className="text-sm font-mono font-bold text-cyan-300 uppercase tracking-widest">Sensory Options</h2>
            <span className="text-[8px] font-mono text-[#00D4FF]">ONLINE // MIC_LINK</span>
          </div>

          {/* Wake Word Selection */}
          <div>
            <label className="block text-[10px] font-mono text-cyan-400/50 uppercase mb-2">Wake-Word Listening</label>
            <div className="space-y-2">
              {[
                { id: "hey-jarvis", label: "Hey J.A.R.V.I.S." },
                { id: "computer", label: "Computer" },
                { id: "jarvis-x", label: "System (JARVIS-X)" },
              ].map((w) => (
                <button
                  key={w.id}
                  onClick={() => {
                    setWakeWord(w.id);
                    onLogMessage("INFO", `Updated sleep channel wake-word index to: "${w.label}"`);
                  }}
                  className={`w-full text-left p-2.5 border rounded text-xs font-mono transition-all cursor-pointer ${
                    wakeWord === w.id 
                      ? "border-cyan-400 bg-cyan-500/10 text-cyan-300 font-bold shadow-[0_0_8px_rgba(6,182,212,0.1)]" 
                      : "border-white/5 hover:border-cyan-500/10 text-gray-400"
                  }`}
                >
                  {w.label}
                </button>
              ))}
            </div>
          </div>

          {/* Vocal Persona Selection */}
          <div>
            <label className="block text-[10px] font-mono text-cyan-400/50 uppercase mb-2">Vocal Timbre Matrix</label>
            <div className="space-y-2">
              {voices.map((v) => (
                <button
                  key={v}
                  onClick={() => {
                    setVoicePersona(v);
                    onLogMessage("INFO", `Switched vocal synthesis timbre to profile: ${v}`);
                  }}
                  className={`w-full text-left p-2.5 border rounded text-xs font-mono transition-all cursor-pointer ${
                    voicePersona === v 
                      ? "border-fuchsia-400 bg-fuchsia-500/10 text-fuchsia-300 font-bold shadow-[0_0_8px_rgba(217,70,239,0.1)]" 
                      : "border-white/5 hover:border-fuchsia-500/10 text-gray-400"
                  }`}
                >
                  Voice Profile: {v}
                </button>
              ))}
            </div>
          </div>

          {/* Side command helper trigger block */}
          <div className="pt-4 border-t border-cyan-500/10">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(true);
                onLogMessage("INFO", "Opened voice command reference diagnostic overlay.");
              }}
              className="w-full py-2.5 px-3 bg-cyan-950/20 hover:bg-cyan-500/10 border border-cyan-500/15 hover:border-cyan-400/30 rounded-lg text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider font-semibold"
            >
              <Terminal size={12} className="text-cyan-400" /> View Voice Prompts
            </button>
          </div>
        </div>

        {/* Center Wave Console and Pulsing Mic */}
        <div className="md:col-span-2 p-6 bg-black/45 border border-cyan-500/15 rounded-xl flex flex-col items-center justify-between relative min-h-[30rem] overflow-hidden">
          {/* Futuristic 3D Holographic Visualizer */}
          <div className="w-full relative flex-1 flex flex-col items-center justify-center min-h-[290px] mb-4">
            <div className="absolute inset-0 flex items-center justify-center">
              <VoiceCanvas3D isListening={isListening} activeSpeech={activeSpeech} />
            </div>

            {/* Subtly overlaying 2D wave grid on top of the container bottom as an active sensory metric */}
            <div className="absolute bottom-1.5 flex items-center justify-center gap-1 h-10 w-full max-w-xs z-10 opacity-70">
              {waveformValues.map((h, i) => (
                <div
                  key={i}
                  className={`w-0.5 rounded-full transition-all duration-100 ${
                    isListening ? "bg-cyan-400" : activeSpeech ? "bg-fuchsia-400 animate-pulse" : "bg-cyan-950/20"
                  }`}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center w-full relative z-10 pb-4">
            {/* Big mic click sphere */}
            <button
              onClick={handleMicToggle}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 relative group cursor-pointer ${
                isListening
                  ? "bg-cyan-500 text-black shadow-[0_0_25px_rgba(6,182,212,0.6)]"
                  : "bg-cyan-950/20 text-cyan-400 border-2 border-cyan-500/30 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]"
              }`}
            >
              <Mic size={24} />
              <span className="absolute -bottom-6 text-[8px] tracking-widest font-mono text-cyan-400 uppercase">
                {isListening ? "SAMPLING..." : "PRESS SPEAK"}
              </span>
            </button>
          </div>

          {/* response prompt box */}
          {responseText && (
            <div className="mt-4 bg-black/65 border border-fuchsia-500/20 p-4 rounded-lg w-full font-mono text-xs text-fuchsia-300 text-center animate-fade-in relative z-10">
              <span className="block text-[8px] text-fuchsia-500 uppercase tracking-widest mb-1.5">[SPEECH SYNTHESIS ENGINE: {voicePersona}]</span>
              {responseText}
            </div>
          )}
        </div>
      </div>

      {/* VOICE COMMAND REFERENCE MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="bg-[#0b1320] border border-cyan-500/30 rounded-2xl w-full max-w-lg overflow-hidden shadow-[0_0_40px_rgba(6,182,212,0.15)] relative z-10 font-sans"
            >
              {/* Header */}
              <div className="p-4 border-b border-cyan-500/15 flex items-center justify-between bg-black/20 select-none">
                <div className="flex items-center gap-2">
                  <Terminal className="text-[#00D4FF] animate-pulse" size={16} />
                  <span className="font-mono text-[10px] tracking-widest text-[#00D4FF] uppercase font-black">
                    Voice Command Reference HUD
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 hover:bg-white/5 text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Contents scroll area */}
              <div className="p-5 max-h-[70vh] overflow-y-auto space-y-4 text-left">
                <div className="p-3 bg-cyan-950/10 border border-cyan-500/10 rounded-lg flex items-start gap-2.5">
                  <Info className="text-cyan-400 shrink-0 mt-0.5" size={14} />
                  <div className="text-xs text-cyan-200/90 leading-relaxed font-sans">
                    Enable the microphone by clicking the <span className="text-cyan-400 font-bold font-mono">"PRESS SPEAK"</span> module to synchronize active speech pathways. JARVIS X recognizes commands matching your wake-word context below.
                  </div>
                </div>

                <div className="space-y-3">
                  {commandList.map((cmd, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border transition-all ${
                        isListening
                          ? "border-cyan-500/35 bg-cyan-950/20 shadow-[0_0_12px_rgba(6,182,212,0.08)]"
                          : "border-cyan-500/10 bg-black/10"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5 select-none font-mono">
                        <span className="text-[8px] text-cyan-400/70 uppercase font-bold tracking-widest">{cmd.category}</span>
                        
                        {/* Status Badge */}
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[8px] font-bold uppercase transition-all ${
                          isListening 
                            ? "bg-cyan-400/10 border border-cyan-400 text-cyan-400 animate-pulse" 
                            : "bg-zinc-805/40 border border-zinc-700/30 text-zinc-500"
                        }`}>
                          <span className={`w-1 h-1 rounded-full ${isListening ? "bg-cyan-400 animate-pulse" : "bg-zinc-650"}`} />
                          {isListening ? cmd.micActiveText : cmd.micIdleText}
                        </span>
                      </div>

                      <div className="font-mono text-[11px] font-bold text-white select-all border-l-2 border-[#00D4FF] pl-2 bg-black/15 py-1 px-2 rounded mb-1.5 hover:border-fuchsia-400 transition-colors">
                        "{cmd.utterance}"
                      </div>

                      <p className="text-[10px] text-zinc-400 font-sans leading-relaxed">
                        {cmd.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer status banner */}
              <div className="p-3 bg-black/30 border-t border-cyan-500/10 flex items-center justify-between select-none">
                <span className="text-[8.5px] font-mono text-zinc-500 font-bold uppercase tracking-wide">
                  COGNITIVE BUFFER: ACTIVE
                </span>
                
                <span className="text-[8.5px] font-mono text-[#00D4FF] font-bold uppercase tracking-widest flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${isListening ? "bg-emerald-400 animate-ping" : "bg-cyan-500"}`} />
                  Mic Status: {isListening ? "SAMPLING SPEECH" : "STANDBY SYSTEM"}
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
