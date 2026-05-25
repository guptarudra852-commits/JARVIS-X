import React from "react";
import { Compass, Calendar, User, Cpu } from "lucide-react";

export default function Blog() {
  const posts = [
    {
      title: "Sovereign AI: The Release of J-X Core v4.2.0",
      date: "May 20, 2026",
      author: "JARVIS Engineering",
      desc: "Introducing fully compiled REST api pathways, expanded memory buffers (Quantum Mesh Sync), and refined voice persona profiles. Our synthesis rates decreased by twenty percent.",
    },
    {
      title: "How Autonomous Core Intelligence powers workflow triggers",
      date: "May 12, 2026",
      author: "AI Synapse Division",
      desc: "An in-depth review of deep semantic grounding, multimodal image+text indexing, and how our drag-and-drop triggers can automate calendar allocations with zero user oversight.",
    },
    {
      title: "System Update Note: Auxiliary Safe Mode Triage",
      date: "May 05, 2026",
      author: "Mainframe SecOps",
      desc: "Guidelines for configuring fallback modes when API keys are unavailable. Safe modes prioritize clean offline UI operations and simulated memory indices.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-white relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cyan-500/10 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-sans font-black tracking-tight text-white flex items-center gap-3">
            <Compass className="text-cyan-400 shrink-0" /> INTEGRITY LOG JOURNAL
          </h1>
          <p className="text-xs font-mono text-cyan-400/60 mt-1 uppercase">NEWS AND CHRONICLED UPDATE NOTES REGARDING GENERAL INTELLIGENCE</p>
        </div>
      </div>

      <div className="space-y-6">
        {posts.map((post, idx) => (
          <div
            key={idx}
            className="p-6 bg-black/45 border border-cyan-500/15 hover:border-cyan-500/25 rounded-xl backdrop-blur-md relative"
          >
            <div className="flex items-center gap-4 text-[9px] font-mono text-cyan-400/50 uppercase mb-3">
              <span className="flex items-center gap-1"><Calendar size={10} /> {post.date}</span>
              <span className="flex items-center gap-1"><User size={10} /> {post.author}</span>
            </div>

            <h3 className="font-mono text-base font-bold text-white mb-2 uppercase group-hover:text-cyan-300 transition-colors">
              {post.title}
            </h3>

            <p className="text-xs text-gray-400 font-sans leading-relaxed mb-4">
              {post.desc}
            </p>

            <span className="text-[10px] font-mono text-cyan-400 font-semibold cursor-pointer hover:underline">
              READ_ENTRY // COMPRESSED_ZST
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
