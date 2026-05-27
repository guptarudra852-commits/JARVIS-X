import React, { useState } from "react";
import { Link2, ShieldCheck, Cpu, Slack, Github, Calendar, Radio, Sparkles, Workflow } from "lucide-react";
import { Integration } from "../../types";
import DeveloperLab from "./DeveloperLab";

interface IntegrationsProps {
  onLogMessage: (level: "INFO" | "WARN" | "CORE" | "ERROR", text: string) => void;
}

export default function Integrations({ onLogMessage }: IntegrationsProps) {
  const [activeTab, setActiveTab] = useState<"standard" | "lab">("standard");
  const [integrationsList, setIntegrationsList] = useState<Integration[]>([
    {
      id: "int-1",
      name: "Slack Communications Core",
      description: "Dispatches system warnings and notifications straight to channels or private messages.",
      connected: true,
      category: "productivity",
      iconName: "slack",
    },
    {
      id: "int-2",
      name: "GitHub Repository Sync",
      description: "Allows JARVIS X to commit automated fixes, fetch open PR contexts, and monitor server build runs.",
      connected: false,
      category: "developer",
      iconName: "github",
    },
    {
      id: "int-3",
      name: "Google Workspace & Docs",
      description: "Index files inside Drive, summarize calendar schedules, and edit real logs smoothly on request.",
      connected: true,
      category: "workspace",
      iconName: "workspace",
    },
    {
      id: "int-4",
      name: "Spotify Atmospheric Synths",
      description: "Plays appropriate focus beats or relaxing ambient strings relative to calculated neural focus levels.",
      connected: false,
      category: "entertainment",
      iconName: "spotify",
    },
  ]);

  const toggleConnection = (id: string) => {
    setIntegrationsList((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newState = !item.connected;
          onLogMessage("INFO", `Connector module "${item.name}" updated state: ${newState ? "CONNECTED" : "DISCONNECTED"}`);
          return { ...item, connected: newState };
        }
        return item;
      })
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-white relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cyan-500/10 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-sans font-black tracking-tight text-white flex items-center gap-3">
            <Link2 className="text-cyan-400 shrink-0" /> INTEGRATIONS HUB
          </h1>
          <p className="text-xs font-mono text-cyan-400/60 mt-1 uppercase">SYNC EXTERNAL COMMUNICATIONS PLATFORMS WITH THE J-X SYSTEM Core</p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-cyan-950/25 border border-cyan-500/15 p-0.5 rounded-lg text-xs leading-none">
          <button
            onClick={() => setActiveTab("standard")}
            className={`px-3 py-1.5 font-mono text-[10px] uppercase font-semibold transition-all rounded cursor-pointer ${
              activeTab === "standard" 
                ? "bg-cyan-500/15 border border-cyan-500/25 text-cyan-300" 
                : "text-gray-400 hover:text-cyan-400 border border-transparent"
            }`}
          >
            Webhooks
          </button>
          <button
            onClick={() => setActiveTab("lab")}
            className={`px-3 py-1.5 font-mono text-[10px] uppercase font-semibold transition-all rounded cursor-pointer ${
              activeTab === "lab" 
                ? "bg-cyan-500/15 border border-cyan-500/25 text-cyan-300" 
                : "text-gray-400 hover:text-cyan-400 border border-transparent"
            }`}
          >
            JX Lab Space
          </button>
        </div>
      </div>

      {activeTab === "lab" ? (
        <DeveloperLab onLogMessage={onLogMessage} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {integrationsList.map((int) => (
            <div
              key={int.id}
              className={`p-6 bg-black/45 border rounded-xl backdrop-blur-md relative overflow-hidden transition-all duration-300 ${
                int.connected ? "border-cyan-500/20 shadow-[0_0_12px_rgba(6,182,212,0.06)]" : "border-white/5 opacity-70"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-cyan-400">
                    {int.iconName === "slack" && <Slack size={20} />}
                    {int.iconName === "github" && <Github size={20} />}
                    {int.iconName === "workspace" && <Calendar size={20} />}
                    {int.iconName === "spotify" && <Radio size={20} />}
                  </div>
                  <div>
                    <h3 className="font-mono text-sm font-bold text-white tracking-wide uppercase leading-tight">{int.name}</h3>
                    <span className="inline-block px-1.5 py-0.5 bg-white/5 text-[8px] font-mono text-gray-400 rounded mt-1 uppercase">
                      {int.category}
                    </span>
                  </div>
                </div>

                {/* Connected Badge */}
                <span
                  className={`text-[8px] font-mono uppercase px-2 py-0.5 border rounded-full ${
                    int.connected
                      ? "border-green-500/30 text-green-400 bg-green-500/5 animate-pulse"
                      : "border-white/10 text-gray-500 hover:text-white"
                  }`}
                >
                  {int.connected ? "CONNECTED" : "OFFLINE"}
                </span>
              </div>

              <p className="text-xs text-gray-400 font-sans leading-relaxed min-h-[3rem] mb-6">
                {int.description}
              </p>

              <div className="flex items-center justify-between border-t border-white/5 pt-4">
                <span className="text-[10px] font-mono text-gray-500">API NODE v1.2</span>
                <button
                  onClick={() => toggleConnection(int.id)}
                  className={`px-3 py-1.5 border rounded font-mono text-[10px] uppercase font-bold transition-all cursor-pointer ${
                    int.connected
                      ? "border-red-500/30 text-red-400 hover:bg-red-500/10"
                      : "border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
                  }`}
                >
                  {int.connected ? "DISCONNECT" : "CONNECT_AUTH"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
