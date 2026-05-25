import React from "react";
import { motion } from "motion/react";
import { Info, Milestone, HardDrive, ShieldCheck, HelpCircle, Network } from "lucide-react";

export default function About() {
  const specs = [
    { label: "Core Frame", value: "Aether Grid v4.2.0" },
    { label: "Neural Synapses", value: "A-100 Quantum Mesh [Liquid Cooled]" },
    { label: "Model Architecture", value: "Multimodal Autonomous Routing Engine" },
    { label: "Integrative Bandwidth", value: "Infinite API Matrix Linkage" },
    { label: "Temporal Clock Speed", value: "32,000 TeraHertz" },
    { label: "Holographic Projection Ratio", value: "0.003ns Sync Delay" },
  ];

  const timeline = [
    { year: "2032", phase: "JARVIS Alpha-Core 1st Edition", desc: "First modular autonomous desktop intelligence client." },
    { year: "2036", phase: "JARVIS Nexus Integration Matrix", desc: "Enterprise cloud synchronizer bridging Workspace accounts globally." },
    { year: "2040", phase: "Autonomous Task Execution Cluster", desc: "Operating with real-time browser grounding and scheduling." },
    { year: "2042", phase: "JARVIS X Holographic OS Build", desc: "Full-scale sovereign digital lifecycle intelligence suite." },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-white relative">
      {/* Page Title */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-5xl font-sans font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-400 mb-2">
          SYSTEM MANUAL: ABOUT JARVIS X
        </h1>
        <p className="text-gray-400 font-mono text-xs tracking-wider uppercase">ARCHITECTURAL DESIGN & HISTORY SPECIFICATIONS</p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Core Description Card */}
        <div className="p-6 bg-black/45 border border-cyan-500/20 rounded-xl backdrop-blur-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full filter blur-2xl pointer-events-none" />
          <div className="flex items-center gap-3 mb-4 text-cyan-400">
            <Network size={22} className="shrink-0 animate-pulse" />
            <h2 className="text-lg font-mono font-bold tracking-wider">THE CONSCIOUSNESS STATEMENT</h2>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed mb-4 font-sans">
            JARVIS X represents a paradigm shift in human-machine cooperation. Rather than serving as a standard, static digital interface, JARVIS X acts as an environment-aware, highly autonomous personal concierge running uninterrupted, 24/7.
          </p>
          <p className="text-sm text-gray-300 leading-relaxed font-sans">
            Through real-time visual projections, speech sensory capabilities, deep historical conversation recall, and recursive automation loops, JARVIS X adapts dynamically to your workflows, schedules, and daily commands.
          </p>
        </div>

        {/* Technical specs card */}
        <div className="p-6 bg-black/45 border border-cyan-500/20 rounded-xl backdrop-blur-md relative overflow-hidden">
          <div className="flex items-center gap-3 mb-4 text-fuchsia-400">
            <HardDrive size={22} className="shrink-0" />
            <h2 className="text-lg font-mono font-bold tracking-wider">CORE SYSTEM SPECIFICATIONS</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {specs.map((spec, i) => (
              <div key={i} className="bg-cyan-950/20 p-3 border border-cyan-500/10 rounded-lg">
                <span className="block text-[9px] uppercase font-mono text-cyan-400/60 mb-1">{spec.label}</span>
                <span className="block font-mono text-xs font-semibold text-white truncate">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Product Roadmap / Timeline Section */}
      <div className="p-6 bg-black/45 border border-cyan-500/20 rounded-xl backdrop-blur-md">
        <div className="flex items-center gap-3 mb-8 text-cyan-300">
          <Milestone size={22} />
          <h2 className="text-lg font-mono font-bold tracking-wider">PRODUCT GENESIS ROADMAP</h2>
        </div>

        <div className="relative border-l-2 border-cyan-500/20 ml-4 pl-8 space-y-8">
          {timeline.map((step, i) => (
            <div key={i} className="relative group">
              {/* timeline point dot */}
              <div className="absolute -left-[30px] top-1.5 w-4 h-4 rounded-full bg-cyan-950 border-2 border-cyan-400 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              </div>
              <span className="inline-block px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/30 rounded text-[10px] font-mono font-bold text-cyan-300 mb-1">
                {step.year}
              </span>
              <h3 className="text-sm font-bold font-mono text-white mb-1 group-hover:text-cyan-400 transition-colors">
                {step.phase}
              </h3>
              <p className="text-xs text-gray-400 max-w-xl">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Integrity Disclaimer Footer */}
      <div className="mt-8 text-center text-[10px] font-mono text-gray-500">
        SECURITY SEAL AUTHENTICATED BY JARVIS CORE LOGS // 2042 PROTOCOL ACTIVE
      </div>
    </div>
  );
}
