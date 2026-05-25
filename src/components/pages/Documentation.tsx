import React from "react";
import { Terminal, Copy, ShieldCheck, Check, CodeSquare, Server } from "lucide-react";

export default function Documentation() {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  const commands = [
    { cmd: "jarvis --init", desc: "Boot up the local neural core and authorize active environmental linkages." },
    { cmd: "jarvis sync --all", desc: "Flush the local cache and push current synaptic configurations to Workspace." },
    { cmd: "jarvis recall 'fuel limits'", desc: "Query the semantic vector memory space for matching facts." },
    { cmd: "jarvis script run 'cozy-mode'", desc: "Dispatch manual automation routines directly." },
  ];

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-white relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cyan-500/10 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-sans font-black tracking-tight text-white flex items-center gap-3">
            <Terminal className="text-cyan-400 shrink-0" /> DOCUMENTATION PORTAL
          </h1>
          <p className="text-xs font-mono text-cyan-400/60 mt-1 uppercase">JARVIS COMMANDS SCHEMAS AND DEVELOPER API MANIFEST</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Terminal Quick Start section */}
        <div>
          <h2 className="text-sm font-mono font-bold text-cyan-300 uppercase tracking-widest mb-4">CLI TERMINAL COMMAND SHELL</h2>
          <div className="space-y-3">
            {commands.map((c, idx) => (
              <div
                key={idx}
                className="p-4 bg-cyan-950/5 border border-cyan-500/15 rounded-lg flex items-center justify-between text-xs"
              >
                <div>
                  <span className="block font-mono text-cyan-300 font-bold mb-1 select-all">{c.cmd}</span>
                  <span className="block text-gray-400 font-sans">{c.desc}</span>
                </div>
                <button
                  onClick={() => handleCopy(c.cmd, idx)}
                  className="p-2 border border-white/5 hover:border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/5 rounded transition-all cursor-pointer shrink-0"
                >
                  {copiedIndex === idx ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* API route references */}
        <div>
          <h2 className="text-sm font-mono font-bold text-fuchsia-400 uppercase tracking-widest mb-4">REST API ROUTES MANUAL</h2>
          <div className="p-5 bg-black/45 border border-cyan-500/20 rounded-xl space-y-4 font-mono text-xs">
            <div>
              <span className="inline-block px-1.5 py-0.5 bg-green-500/20 text-green-300 border border-green-500/30 rounded font-bold text-[9px] mr-2">GET</span>
              <span className="text-white font-bold">/api/health</span>
              <p className="text-gray-400 font-sans text-xs mt-1">Queries global operating state, core software updates, and core sync status.</p>
            </div>

            <div className="border-t border-white/5 pt-4">
              <span className="inline-block px-1.5 py-0.5 bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30 rounded font-bold text-[9px] mr-2">POST</span>
              <span className="text-white font-bold">/api/chat</span>
              <p className="text-gray-400 font-sans text-xs mt-1">Accepts array of historical dialogue parts, returning structured semantic text replies from active OpenRouter quantum cores.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
