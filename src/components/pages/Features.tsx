import React, { useState } from "react";
import { motion } from "motion/react";
import {
  MessageSquare,
  Activity,
  Mail,
  Calendar,
  Mic,
  Image as ImageIcon,
  Zap,
  Globe,
  Database,
  FileText,
  Workflow,
  Cpu,
  RefreshCw,
} from "lucide-react";

export default function Features() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const featuresList = [
    {
      icon: <MessageSquare size={24} />,
      title: "AI Chat with Memory",
      desc: "Keeps continuous, context-aware memory matrices across all messaging sessions, learning your preferences gracefully over time.",
      metric: "99.8% Recall Recall Rate",
      color: "border-cyan-500/20 text-cyan-400",
    },
    {
      icon: <Activity size={24} />,
      title: "Autonomous Task Execution",
      desc: "Self-organizing neural agents that analyze, breakdown, and perform long-lived, complex multi-step processes on autopilot.",
      metric: "Active loop: 24/7",
      color: "border-fuchsia-500/20 text-fuchsia-400",
    },
    {
      icon: <Mail size={24} />,
      title: "Email Summarization & Proxy",
      desc: "Categorizes and summarizes incoming communication streams, highlighting requests which require key actions or inputs.",
      metric: "90% Filtering Efficiency",
      color: "border-yellow-500/20 text-yellow-400",
    },
    {
      icon: <Calendar size={24} />,
      title: "Smart Scheduling Core",
      desc: "Aligns meetings, personal reminders, and deep work blocks based on optimal energy efficiency calculations and cognitive states.",
      metric: "Self-Corrective Scheduling",
      color: "border-green-500/20 text-green-400",
    },
    {
      icon: <Mic size={24} />,
      title: "Conversational Voice Assistant",
      desc: "Natural-sounding voice synthesis and near peer-level speech interaction. Supports custom vocal timbres and wake-words.",
      metric: "Latency: < 0.2s",
      color: "border-orange-500/20 text-orange-400",
    },
    {
      icon: <ImageIcon size={24} />,
      title: "AI Artistic Generation",
      desc: "Instantly projects high-fidelity visual displays, charts, custom UI widgets, and graphic assets tailored to exact project specs.",
      metric: "Image/Image+Text Fusion Enabled",
      color: "border-blue-500/20 text-blue-400",
    },
    {
      icon: <Zap size={24} />,
      title: "Workflow Automation Matrix",
      desc: "Define conditional trigger-action sequences in our drag-and-drop visual interface. Connect pipelines to thousands of integrations.",
      metric: "250,420 Active Automation Nodes",
      color: "border-purple-500/20 text-purple-400",
    },
    {
      icon: <Globe size={24} />,
      title: "Semantic Internet Browsing",
      desc: "Performs deep web lookups, aggregates multi-source facts, resolves contradicting articles, and tracks current world developments.",
      metric: "Google Grounding Standard Integration",
      color: "border-teal-500/20 text-teal-400",
    },
    {
      icon: <Database size={24} />,
      title: "Knowledge Retrieval Network",
      desc: "Squeezes terabytes of vector embeddings, research papers, and documents to provide pristine, source-grounded intelligence responses.",
      metric: "Latency: 12ms",
      color: "border-red-500/20 text-red-400",
    },
    {
      icon: <FileText size={24} />,
      title: "Document Understanding Unit",
      desc: "Aggregates complex reports, spreadsheets, PDFs, or contracts in seconds, extracting tabular figures, summaries, with accurate references.",
      metric: "Upload Limit: 1.5GB",
      color: "border-emerald-500/20 text-emerald-400",
    },
    {
      icon: <Workflow size={24} />,
      title: "System API Integrations",
      desc: "Out-of-the-box integration connectors with Slack, GitHub, Jira, Spotify, Workspace Drive, Gmail, Docs, Sheets, and custom webhooks.",
      metric: "Secure OAuth Proxy Protocols",
      color: "border-cyan-500/20 text-cyan-400",
    },
    {
      icon: <RefreshCw size={24} />,
      title: "Real-time Multi-Device Sync",
      desc: "Your preferences, task states, chat context, and automation rules are instantly synchronized between desktop browsers and virtual devices.",
      metric: "End-to-End Encrypted Data Streams",
      color: "border-purple-500/20 text-purple-400",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-white relative">
      {/* Background radial highlight */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.02),transparent_70%)] pointer-events-none" />

      {/* Header */}
      <div className="mb-12 text-center text-white">
        <h1 className="text-3xl md:text-5xl font-sans font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-400 mb-2">
          JARVIS X CAPABILITIES DECK
        </h1>
        <p className="text-gray-400 font-mono text-xs tracking-widest uppercase">
          EXPLORE THE 12 COGNITIVE PROCESSORS OF THE J-X SYSTEM
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuresList.map((feat, index) => {
          const isHovered = hoveredIndex === index;
          return (
            <div
              key={index}
              className={`p-6 border rounded-xl bg-black/45 backdrop-blur-md transition-all duration-300 relative overflow-hidden group select-none ${
                isHovered ? "border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.15)] -translate-y-1" : feat.color
              }`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Top border neon hover stripe */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-lg bg-white/5 group-hover:bg-cyan-500/10 group-hover:text-cyan-400 transition-colors duration-300`}>
                  {feat.icon}
                </div>
                <h3 className="font-mono text-base font-bold tracking-wide group-hover:text-cyan-300 transition-colors">
                  {feat.title}
                </h3>
              </div>

              <p className="text-xs text-gray-400 leading-relaxed mb-6 font-sans">
                {feat.desc}
              </p>

              {/* Data metric footer inside card */}
              <div className="flex items-center justify-between border-t border-white/5 pt-3 text-[10px] font-mono text-gray-500 uppercase">
                <span>METRIC_CAP</span>
                <span className="text-cyan-400 font-bold tracking-wider">{feat.metric}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
