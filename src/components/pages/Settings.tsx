import React, { useState } from "react";
import { Sliders, ShieldCheck, ToggleLeft, ToggleRight, Radio, BellRing, Sparkles } from "lucide-react";

interface SettingsProps {
  onLogMessage: (level: "INFO" | "WARN" | "CORE" | "ERROR", text: string) => void;
}

export default function Settings({ onLogMessage }: SettingsProps) {
  const [synapticCycles, setSynapticCycles] = useState(75);
  const [audioFeedback, setAudioFeedback] = useState(true);
  const [holograms, setHolograms] = useState(true);
  const [overchargeMode, setOverchargeMode] = useState(false);
  const [provider, setProvider] = useState<"openrouter">("openrouter");

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setSynapticCycles(val);
    if (val > 90) {
      onLogMessage("WARN", `Core thermal parameters warning: Synaptic Cycles overcharged boundary! Limit at ${val}%`);
    } else {
      onLogMessage("INFO", `Synced Synaptic Cycles to optimal target threshold: ${val}%`);
    }
  };

  const toggleStatus = (type: "audio" | "holograms" | "overcharge") => {
    if (type === "audio") {
      setAudioFeedback(!audioFeedback);
      onLogMessage("INFO", `Auditory sensory feedback: ${!audioFeedback ? "ACTIVE" : "MUTED"}`);
    } else if (type === "holograms") {
      setHolograms(!holograms);
      onLogMessage("INFO", `Holographic grid rasterizers: ${!holograms ? "PROJECTING" : "BYPASSED"}`);
    } else {
      setOverchargeMode(!overchargeMode);
      onLogMessage("WARN", `Retinal Overcharge Overhaul limit state is now: ${!overchargeMode ? "OVERLOAD_PERMUTED (WARNING)" : "REGULATED"}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-white relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cyan-500/10 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-sans font-black tracking-tight text-white flex items-center gap-3">
            <Sliders className="text-cyan-400 shrink-0" /> NEURAL MAIN-CONFIG SETTINGS
          </h1>
          <p className="text-xs font-mono text-cyan-400/60 mt-1 uppercase">RECONFIGURE CORE FREQUENCIES AND AUDIO-VISUAL SENSORY HUD OVERRIDES</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Frequency Slider */}
        <div className="p-6 bg-black/45 border border-cyan-500/15 rounded-xl backdrop-blur-md">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wide">Synaptic Base Cycle Limit</h3>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                Controls the clock cycles allocated to recursive AI background reasoning schedules.
              </p>
            </div>
            <span className="text-xl font-mono text-cyan-400 font-bold">{synapticCycles}%</span>
          </div>

          <input
            type="range"
            min="10"
            max="100"
            value={synapticCycles}
            onChange={handleSliderChange}
            className="w-full accent-cyan-400 h-1 bg-cyan-950/40 rounded-lg cursor-pointer"
          />

          <div className="flex justify-between text-[9px] font-mono text-cyan-400/30 mt-2">
            <span>REGULAR (10%)</span>
            <span>OVERDRIVE (100%)</span>
          </div>
        </div>

        {/* OpenRouter Configuration Card */}
        <div className="p-6 bg-black/45 border border-cyan-500/15 rounded-xl backdrop-blur-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2">
                <Sparkles className="text-cyan-400 size-4 animate-pulse" /> Neural Core Agent Processor
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-sans max-w-xl mt-1">
                Establish primary telemetry routing interfaces with standard matrix modules. All traffic is securely routed through OpenRouter's multi-model framework.
              </p>
            </div>
            {/* Active Core Status indicator */}
            <div className="flex items-center gap-2.5 bg-fuchsia-950/40 border border-fuchsia-500/30 px-4 py-2 rounded-xl text-xs font-mono text-fuchsia-300">
              <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-pulse" />
              <span>OPENROUTER ACTIVE CORE</span>
            </div>
          </div>
        </div>

        {/* Toggles area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Audio toggle */}
          <div className="p-6 bg-black/45 border border-cyan-500/15 hover:border-cyan-500/25 rounded-xl backdrop-blur-md flex items-center justify-between transition-all">
            <div className="space-y-1">
              <span className="block font-mono text-xs font-bold text-white uppercase">Vocal Speech Feedback</span>
              <span className="block text-xs text-gray-400 font-sans">Toggle voice synthesizer responses.</span>
            </div>
            <button
              id="toggle-audio-feedback"
              onClick={() => toggleStatus("audio")}
              className="text-cyan-400 hover:text-cyan-300 transition-all cursor-pointer"
            >
              {audioFeedback ? <ToggleRight size={38} className="text-cyan-400" /> : <ToggleLeft size={38} className="text-gray-600" />}
            </button>
          </div>

          {/* Holograms toggle */}
          <div className="p-6 bg-black/45 border border-cyan-500/15 hover:border-cyan-500/25 rounded-xl backdrop-blur-md flex items-center justify-between transition-all">
            <div className="space-y-1">
              <span className="block font-mono text-xs font-bold text-white uppercase">Holographic Grid Projections</span>
              <span className="block text-xs text-gray-400 font-sans">Display vector lines, grids, and particles.</span>
            </div>
            <button
              id="toggle-holograms-projections"
              onClick={() => toggleStatus("holograms")}
              className="text-cyan-400 hover:text-cyan-300 transition-all cursor-pointer"
            >
              {holograms ? <ToggleRight size={38} className="text-cyan-400" /> : <ToggleLeft size={38} className="text-gray-600" />}
            </button>
          </div>
        </div>

        {/* Fatal Overcharge override switch */}
        <div className="p-6 bg-red-950/5 border border-red-500/15 hover:border-red-500/25 rounded-xl flex items-center justify-between transition-all">
          <div className="space-y-1">
            <span className="block font-mono text-xs font-bold text-red-400 uppercase tracking-wider">RETINAL MATRIX OVERLOAD PERMUTATIONS (Danger)</span>
            <span className="block text-xs text-gray-400 font-sans">Overrides standard temperature safeguards. Proceed with absolute caution.</span>
          </div>
          <button
            onClick={() => toggleStatus("overcharge")}
            className="text-red-500 transition-all cursor-pointer select-none"
          >
            {overchargeMode ? <ToggleRight size={38} className="text-red-500" /> : <ToggleLeft size={38} className="text-gray-700" />}
          </button>
        </div>
      </div>
    </div>
  );
}
