import React from "react";
import { DollarSign, ShieldAlert, Cpu, Check, Compass } from "lucide-react";
import { PageId } from "../../types";

interface PricingProps {
  onNavigate: (page: PageId) => void;
}

export default function Pricing({ onNavigate }: PricingProps) {
  const tiers = [
    {
      name: "Core Node",
      price: "$0",
      desc: "Perfect tier to experience simulated JARVIS operations and basic chatbot responses.",
      features: [
        "Conversational AI Interface",
        "Standard Speed Cycles",
        "Up to 15 Synaptic Memories",
        "Basic Google Grounding Search",
        "Community Support Module",
      ],
      buttonText: "START_DEFAULT",
      highlight: false,
    },
    {
      name: "Nexus Core",
      price: "$29",
      period: "/MO",
      desc: "For heavy power developers looking to map advanced autonomous pipelines and external platforms.",
      features: [
        "Unrestricted Neural Speeds",
        "Quantum Memory Sync (Unlimited)",
        "Slack & Workspace Connections",
        "Self-Orchestrating Workflow Triggers",
        "Priority Mainframe Pipeline",
      ],
      buttonText: "ACTIVATE_NEXUS",
      highlight: true,
    },
    {
      name: "Singularity Core",
      price: "$149",
      period: "/MO",
      desc: "For sovereign operations seeking complete cloud host overrides, custom speech synthesis, and deep data. -",
      features: [
        "24/7 Dedicated Server Container",
        "Custom Voice Profile Synthesis",
        "Full-Scale Developer Webhooks",
        "Instantaneous Recall Memory Matrix",
        "Direct 1st-Tier Developer Hotline",
      ],
      buttonText: "OVERRIDE_SINGULARITY",
      highlight: false,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-white relative">
      <div className="mb-12 text-center text-white">
        <h1 className="text-3xl md:text-5xl font-sans font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-400 mb-2">
          SYSTEM INVESTMENT LAYOUT
        </h1>
        <p className="text-gray-400 font-mono text-xs tracking-widest uppercase">
          CHOOSE THE OPTIMAL NEURAL ENGINES FOR YOUR COGNITIVE FLIGHT
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tiers.map((tier, idx) => (
          <div
            key={idx}
            className={`p-6 bg-black/45 border rounded-xl backdrop-blur-md relative overflow-hidden flex flex-col justify-between transition-all ${
              tier.highlight
                ? "border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.15)] scale-105"
                : "border-cyan-500/15 hover:border-cyan-500/25"
            }`}
          >
            {tier.highlight && (
              <span className="absolute top-3 right-3 bg-cyan-500 text-black text-[8px] font-mono uppercase font-bold px-2 py-0.5 rounded">
                RECOMMENDED
              </span>
            )}

            <div>
              <span className="block text-[10px] font-mono text-cyan-400/50 uppercase mb-1 tracking-widest">TIER_{idx + 1}</span>
              <h3 className="font-mono text-lg font-bold text-white mb-2 uppercase">{tier.name}</h3>
              <p className="text-xs text-gray-400 font-sans min-h-[3.5rem] leading-relaxed mb-6">{tier.desc}</p>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-sans font-black text-white">{tier.price}</span>
                {tier.period && <span className="text-xs font-mono text-cyan-400">{tier.period}</span>}
              </div>

              <div className="border-t border-white/5 pt-6 space-y-3 mb-8">
                {tier.features.map((feat, fIdx) => (
                  <div key={fIdx} className="flex items-start gap-2.5 text-xs text-gray-300">
                    <Check size={12} className="text-cyan-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              id={`pricing-signup-btn-${idx}`}
              onClick={() => onNavigate("signup")}
              className={`w-full py-3 font-mono text-xs font-bold rounded-lg transition-all border cursor-pointer ${
                tier.highlight
                  ? "bg-cyan-500 hover:bg-cyan-400 text-black border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                  : "bg-transparent hover:bg-white/5 border-white/10 hover:border-white/20 text-cyan-300"
              }`}
            >
              {tier.buttonText}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
