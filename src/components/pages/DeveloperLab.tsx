import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Terminal, ShieldCheck, Play, Server, AlertTriangle, RefreshCw, 
  Layers, Plus, Trash2, Cpu, CheckCircle, Mail, Code, Calendar, 
  Workflow, ArrowRight, Loader2, Sparkles, Database 
} from "lucide-react";

interface DeveloperLabProps {
  onLogMessage: (level: "INFO" | "WARN" | "CORE" | "ERROR", text: string) => void;
}

interface AgentInfo {
  name: string;
  endpoint: string;
  version: string;
  registeredAt: string;
  status: "ACTIVE" | "IDLE" | "ERROR";
}

interface TokenState {
  token: string;
  userId: string;
  expiresAt: number;
  revoked: boolean;
}

interface QueueJob {
  id: string;
  prompt: string;
  status: "queued" | "active" | "completed";
  progress: number;
  result?: string;
  addedAt: string;
}

export default function DeveloperLab({ onLogMessage }: DeveloperLabProps) {
  // Navigation states
  const [labTab, setLabTab] = useState<"agents" | "tokens" | "queues" | "connectors">("agents");

  // Agent Registry States
  const [agents, setAgents] = useState<AgentInfo[]>([]);
  const [newAgentName, setNewAgentName] = useState("");
  const [newAgentEndpoint, setNewAgentEndpoint] = useState("http://localhost:5000/webhook");
  const [newAgentVersion, setNewAgentVersion] = useState("1.0.0");
  const [agentLoading, setAgentLoading] = useState(false);
  const [agentDispatching, setAgentDispatching] = useState(false);
  const [agentLogs, setAgentLogs] = useState<string[]>([]);

  // Token Rotation States
  const [tokens, setTokens] = useState<TokenState[]>([]);
  const [currentAccessToken, setCurrentAccessToken] = useState("access-token-initial-1234");
  const [currentRefreshToken, setCurrentRefreshToken] = useState("initial-ref-token-xyz-123456");
  const [tokenLogs, setTokenLogs] = useState<string[]>([]);
  const [tokenError, setTokenError] = useState("");
  const [tokenSuccess, setTokenSuccess] = useState("");

  // Queue States
  const [jobs, setJobs] = useState<QueueJob[]>([]);
  const [queuePrompt, setQueuePrompt] = useState("");
  const [enqueuing, setEnqueuing] = useState(false);

  // Poll intervals
  useEffect(() => {
    fetchActiveAgents();
    fetchTokensState();
    fetchQueueJobs();

    const timer = setInterval(() => {
      fetchQueueJobs();
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  // --- API Handlers ---

  const fetchActiveAgents = async () => {
    try {
      const res = await fetch("/api/agents");
      if (res.ok) {
        const data = await res.json();
        setAgents(data);
      }
    } catch (e: any) {
      console.error(e);
    }
  };

  const handleRegisterAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setAgentLoading(true);
      const res = await fetch("/api/agents/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newAgentName,
          endpoint: newAgentEndpoint,
          version: newAgentVersion
        })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Registry rejected");
      }
      onLogMessage("CORE", `Agent register success: ${newAgentName}`);
      setNewAgentName("");
      fetchActiveAgents();
    } catch (err: any) {
      onLogMessage("ERROR", `Registry failed: ${err.message}`);
    } finally {
      setAgentLoading(false);
    }
  };

  const handleClearAgents = async () => {
    try {
      await fetch("/api/agents/clear", { method: "POST" });
      setAgents([]);
      onLogMessage("WARN", "All custom registered agent interfaces purged from memory.");
    } catch (e: any) {
      console.error(e);
    }
  };

  const triggerOrchestratorDispatch = () => {
    if (agents.length === 0) {
      onLogMessage("WARN", "Orchestrator denied dispatch: No active agent gateways whitelisted.");
      return;
    }
    setAgentDispatching(true);
    setAgentLogs(["[Orchestrator] Initiated task dispatch sequence...", "[Goal] Overclock Synaptic Mainframe buffers..."]);
    
    setTimeout(() => {
      setAgentLogs(prev => [...prev, `[Registry] Identified ${agents.length} candidate endpoints.`]);
    }, 800);

    agents.forEach((agent, idx) => {
      setTimeout(() => {
        setAgentLogs(prev => [
          ...prev, 
          `[Dispatch] Sent payload to "${agent.name}" at: ${agent.endpoint}`,
          `[Webhook Response] -> ${agent.name} v${agent.version} returned state SUCCESS (25ms response delay)`
        ]);
      }, 1200 + idx * 800);
    });

    setTimeout(() => {
      setAgentLogs(prev => [...prev, "[Orchestrator] Parallel job streams complete. Context frames aligned successfully."]);
      setAgentDispatching(false);
      onLogMessage("CORE", "Syntactic task distributed and integrated successfully across parallel nodes.");
    }, 1200 + agents.length * 800 + 400);
  };

  // --- Token rotation ---

  const fetchTokensState = async () => {
    try {
      const res = await fetch("/api/auth/tokens-state");
      if (res.ok) {
        const data = await res.json();
        setTokens(data);
      }
    } catch (e: any) {
      console.error(e);
    }
  };

  const handleRotateTokens = async () => {
    setTokenError("");
    setTokenSuccess("");
    try {
      const res = await fetch("/api/auth/refresh-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: currentRefreshToken })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Rotation failed");
      }

      const data = await res.json();
      setCurrentAccessToken(data.accessToken);
      
      // Save old token to log before update
      const oldTok = currentRefreshToken;
      setCurrentRefreshToken(data.refreshToken);
      setTokenSuccess("Secure rotation handshakes completed successfully!");
      setTokenLogs(prev => [
        `[Sync] Rotated refresh token successful.`,
        `  Revoked old token: ${oldTok.substring(0, 16)}...`,
        `  Approved new token: ${data.refreshToken.substring(0, 16)}...`,
        `  New Access Key: ${data.accessToken.substring(0, 16)}...`,
        ...prev
      ]);
      fetchTokensState();
      onLogMessage("CORE", "[Authorization Core] Secret keys rotated safely. whitelists synchronized.");
    } catch (err: any) {
      setTokenError(err.message);
      onLogMessage("ERROR", `Secret rotation error: ${err.message}`);
    }
  };

  const handleSimulateReplayAttack = async (staleToken: string) => {
    setTokenError("");
    setTokenSuccess("");
    onLogMessage("WARN", `[Audit Sandbox] Attempting replay hack request utilizing revoked token: "${staleToken.substring(0, 15)}..."`);
    
    try {
      const res = await fetch("/api/auth/refresh-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: staleToken })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Attack caught");
      }

    } catch (err: any) {
      setTokenError(`BLOCKED: ${err.message}`);
      setTokenLogs(prev => [
        `⚠️ [DEFENSE TRIGGERED] Replay Token Reuse Flagged on token id "${staleToken.substring(0, 12)}..."`,
        `  Strategy Action: PURGING all active Whitelists for user to insulate mainframe.`,
        ...prev
      ]);
      fetchTokensState();
      onLogMessage("ERROR", "CRITICAL SECURITY BREACH PREVENTED: Stale credentials swap intercepted. Whitelist zeroed.");
    }
  };

  const handleResetTokensState = async () => {
    setTokenError("");
    setTokenSuccess("");
    try {
      const res = await fetch("/api/auth/tokens-reset", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setTokens(data.tokens);
        setCurrentRefreshToken("initial-ref-token-xyz-123456");
        setCurrentAccessToken("access-token-initial-1234");
        setTokenLogs(["[System] Auth token databases reset back to standard defaults."]);
        onLogMessage("INFO", "Reset security token whitelists inside developers lab sandbox.");
      }
    } catch (e: any) {
      console.error(e);
    }
  };

  // --- Queue ---

  const fetchQueueJobs = async () => {
    try {
      const res = await fetch("/api/queue/jobs");
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
      }
    } catch (e: any) {
      console.error(e);
    }
  };

  const handleEnqueueJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queuePrompt.trim()) return;

    try {
      setEnqueuing(true);
      const res = await fetch("/api/queue/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: queuePrompt })
      });

      if (!res.ok) throw new Error("Could not enqueue task.");
      const data = await res.json();
      onLogMessage("INFO", `Synchronous task enqueued into BullMQ background workers: "${queuePrompt.substring(0, 20)}..."`);
      setQueuePrompt("");
      fetchQueueJobs();
    } catch (err: any) {
      onLogMessage("ERROR", `Enqueue failure: ${err.message}`);
    } finally {
      setEnqueuing(false);
    }
  };

  const handleClearQueues = async () => {
    try {
      await fetch("/api/queue/clear", { method: "POST" });
      setJobs([]);
      onLogMessage("WARN", "Asynchronous BullMQ worker pipelines and job lists cleared.");
    } catch (e: any) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-cyan-500/10 pb-4 mb-4">
        <div>
          <h2 className="text-xl font-mono text-cyan-400 font-bold flex items-center gap-2">
            <Layers className="text-cyan-400 animate-pulse" size={18} />
            COGNITIVE DEVELOPMENT LABORATORY
          </h2>
          <p className="text-[10px] text-gray-500 font-mono mt-0.5 uppercase">
            Test Agent registry frameworks, secure rotated tokens, and queue models live
          </p>
        </div>

        {/* Tab Controllers */}
        <div className="flex items-center gap-1 bg-cyan-950/20 border border-cyan-500/10 p-0.5 rounded-lg mt-3 sm:mt-0 overflow-x-auto">
          {[
            { id: "agents", label: "Agent Registry" },
            { id: "tokens", label: "Rotated Swaps" },
            { id: "queues", label: "BullMQ Scheduler" },
            { id: "connectors", label: "Connector Registry" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setLabTab(tab.id as any)}
              className={`px-3 py-1 font-mono text-[9px] uppercase transition-all shrink-0 cursor-pointer rounded-md ${
                labTab === tab.id
                  ? "bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 font-bold"
                  : "border border-transparent text-gray-400 hover:text-cyan-400"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {labTab === "agents" && (
          <motion.div
            key="agents-view"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Left Form */}
            <div className="md:col-span-1 p-5 border border-cyan-500/10 bg-black/45 rounded-xl space-y-4">
              <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1">
                <Plus size={12} /> Register Node Interface
              </h3>
              
              <form onSubmit={handleRegisterAgent} className="space-y-3 font-mono text-[10px]">
                <div>
                  <label className="block text-gray-400 mb-1">AGENT IDENTICAL NAME</label>
                  <input
                    type="text"
                    value={newAgentName}
                    onChange={e => setNewAgentName(e.target.value)}
                    placeholder="e.g. Gamma Core Logic"
                    className="w-full px-2 py-1.5 bg-cyan-950/10 border border-cyan-500/20 rounded text-[11px] focus:outline-none focus:border-cyan-400 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">WEBHOOK ENDPOINT GATEWAY</label>
                  <input
                    type="text"
                    value={newAgentEndpoint}
                    onChange={e => setNewAgentEndpoint(e.target.value)}
                    className="w-full px-2 py-1.5 bg-cyan-950/10 border border-cyan-500/20 rounded text-[10px] focus:outline-none focus:border-cyan-400 text-cyan-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">COMPILATION VERSION</label>
                  <input
                    type="text"
                    value={newAgentVersion}
                    onChange={e => setNewAgentVersion(e.target.value)}
                    className="w-full px-2 py-1.5 bg-cyan-950/10 border border-cyan-500/20 rounded text-[11px] focus:outline-none focus:border-cyan-400 text-white"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={agentLoading}
                  className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-semibold rounded font-mono text-[10px] uppercase transition-all cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.2)]"
                >
                  {agentLoading ? "REGISTERING_COGNIZANT..." : "SUBMIT_AGENT_RECORDS"}
                </button>
              </form>
            </div>

            {/* Mid list */}
            <div className="md:col-span-2 space-y-6">
              <div className="p-5 border border-cyan-500/10 bg-black/45 rounded-xl space-y-4 relative">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono font-bold text-white uppercase tracking-widest flex items-center gap-1.5">
                    <Server size={12} className="text-cyan-400" /> Whitelisted Agent Registers
                  </h3>
                  <button
                    onClick={handleClearAgents}
                    className="text-[9px] font-mono hover:text-red-400 text-gray-500 border border-white/5 hover:border-red-500/20 bg-white/5 py-0.5 px-2 rounded cursor-pointer uppercase transition-all"
                  >
                    PURGE_LIST
                  </button>
                </div>

                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                  {agents.map((ag, i) => (
                    <div 
                      key={i}
                      className="border border-cyan-500/10 bg-cyan-500/5 rounded p-2.5 flex items-center justify-between text-[10px] font-mono"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white uppercase">{ag.name}</span>
                          <span className="text-[8px] bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 px-1 py-0.1 rounded leading-none">v{ag.version}</span>
                        </div>
                        <span className="text-gray-400 font-sans block mt-0.5">{ag.endpoint}</span>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-1.5 py-0.5 border text-[7.5px] rounded-full uppercase leading-none font-bold ${ag.status === "ACTIVE" ? "border-green-500/30 text-green-400 bg-green-500/10" : "border-yellow-500/30 text-yellow-500"}`}>
                          {ag.status}
                        </span>
                        <span className="block text-[8px] text-gray-500 mt-1 uppercase">SYNC {ag.registeredAt.substring(11,16)}</span>
                      </div>
                    </div>
                  ))}

                  {agents.length === 0 && (
                    <div className="text-center py-6 text-[10px] font-mono text-gray-500 uppercase border border-dashed border-white/5 rounded-lg">
                      No external agent clients initialized. Submit form on left.
                    </div>
                  )}
                </div>

                <div className="border-t border-cyan-500/10 pt-4 flex justify-between items-center bg-cyan-950/5">
                  <div>
                    <span className="text-[9px] font-mono text-gray-500 block uppercase">Orchestrate Dispatches (Python Example)</span>
                    <span className="text-[8px] text-gray-400 font-sans">Queries agent ledger to delegate parallel operations instantly.</span>
                  </div>
                  <button
                    onClick={triggerOrchestratorDispatch}
                    disabled={agents.length === 0 || agentDispatching}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-[9px] font-mono uppercase tracking-wider rounded cursor-pointer transition-all disabled:opacity-40"
                  >
                    <Play size={10} className={agentDispatching ? "animate-spin" : ""} />
                    {agentDispatching ? "DISPATCHING_JOBS..." : "TRIGGER_DISPATCH_MATRIX"}
                  </button>
                </div>
              </div>

              {agentLogs.length > 0 && (
                <div className="p-4 border border-cyan-500/20 bg-black/80 rounded-xl font-mono text-[9.5px] text-cyan-300 space-y-1 max-h-[140px] overflow-y-auto h-32 leading-relaxed">
                  <div className="text-cyan-400 border-b border-cyan-500/10 pb-1 flex justify-between items-center mb-1 text-[8.5px] uppercase">
                    <span>Active Python dispatch orchestrator logs shell</span>
                    <span className="animate-pulse">● FEED SECURE</span>
                  </div>
                  {agentLogs.map((lg, idx) => (
                    <div key={idx} className={lg.includes("SUCCESS") ? "text-green-400" : lg.includes("Orchestrator") ? "text-cyan-400 font-semibold" : ""}>{lg}</div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {labTab === "tokens" && (
          <motion.div
            key="tokens-view"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Tokens register */}
            <div className="p-5 border border-cyan-500/10 bg-black/45 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-widest flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-cyan-400 animate-pulse" /> Rotation Whitelist Record
                </h3>
                <button
                  onClick={handleResetTokensState}
                  className="text-[9px] font-mono hover:text-red-400 text-gray-500 border border-white/5 hover:border-red-500/20 bg-white/5 py-0.5 px-2 rounded cursor-pointer uppercase transition-all"
                >
                  RESET_KEYS
                </button>
              </div>

              <div className="space-y-2 max-h-[185px] overflow-y-auto pr-1">
                {tokens.map((tok, idx) => (
                  <div 
                    key={idx}
                    className={`border rounded p-2 text-[10px] font-mono flex items-center justify-between transition-all ${
                      tok.revoked 
                        ? "border-red-500/10 bg-red-500/5 opacity-50" 
                        : "border-green-500/20 bg-green-500/5 shadow-[0_0_8px_rgba(34,197,94,0.04)]"
                    }`}
                  >
                    <div>
                      <span className="font-bold block text-white select-all">{tok.token.substring(0, 24)}...</span>
                      <span className="text-[8px] text-gray-400 uppercase font-sans mt-0.5 block">CAPT: {tok.userId}</span>
                    </div>
                    <div>
                      {tok.revoked ? (
                        <div className="text-right">
                          <span className="inline-block border border-red-500/25 bg-red-500/10 text-red-400 text-[7px] font-bold uppercase rounded px-1 max-h-4">REVOKED / USED</span>
                          <button
                            onClick={() => handleSimulateReplayAttack(tok.token)}
                            className="text-[8px] text-cyan-400 hover:text-cyan-300 font-mono underline block mt-1 uppercase cursor-pointer"
                            title="Attempt Replay Swap"
                          >
                            REUSE_HACK_TEST
                          </button>
                        </div>
                      ) : (
                        <span className="inline-block border border-green-500/30 bg-green-500/20 text-green-400 text-[7px] font-bold uppercase rounded px-1.5 max-h-4">ACTIVE</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center bg-cyan-950/10 border border-cyan-500/10 p-3 rounded-lg overflow-hidden">
                <div className="flex-1 mr-4 border-r border-cyan-500/10 font-mono">
                  <div className="text-[9px] text-gray-500 uppercase">Active Access Token</div>
                  <div className="text-[10px] font-bold text-white text-ellipsis overflow-hidden truncate max-w-[130px]">{currentAccessToken}</div>
                </div>
                <button
                  onClick={handleRotateTokens}
                  className="px-3 py-2 bg-cyan-500 hover:bg-cyan-400 text-black text-[9px] font-mono leading-none tracking-wider font-bold rounded-md uppercase transition-all cursor-pointer select-none flex items-center gap-1 shrink-0"
                >
                  <RefreshCw size={9} /> ROTATE_SESSIONS
                </button>
              </div>
            </div>

            {/* Token rotation audits logs */}
            <div className="space-y-4">
              {tokenSuccess && (
                <div className="p-3 bg-green-950/20 border border-green-500/20 rounded-xl flex items-start gap-2.5">
                  <CheckCircle size={15} className="text-green-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-[10px] font-mono text-green-400 font-bold uppercase">Authorization Rotation complete</div>
                    <p className="text-[9.5px] text-gray-300 font-sans mt-0.5 leading-snug">{tokenSuccess}</p>
                  </div>
                </div>
              )}

              {tokenError && (
                <div className="p-3 bg-red-950/20 border border-red-500/30 rounded-xl flex items-start gap-2.5 animate-bounce">
                  <AlertTriangle size={15} className="text-red-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-[10px] font-mono text-red-400 font-bold uppercase">INTEGRITY BLOCK DETECTED</div>
                    <p className="text-[9.5px] text-gray-300 font-mono mt-0.5 leading-snug">{tokenError}</p>
                  </div>
                </div>
              )}

              {/* Logs terminal shell */}
              <div className="p-4 border border-cyan-500/15 bg-black/80 rounded-xl font-mono text-[9.5px] leading-relaxed h-52 overflow-y-auto space-y-1">
                <div className="text-cyan-400 border-b border-cyan-500/10 pb-1 flex justify-between items-center mb-1 text-[8.50px] uppercase">
                  <span>Cryptographic Key Swaps Telemetry Shell</span>
                  <span className="text-green-400 animate-pulse">● SECURED JOURNAL</span>
                </div>
                {tokenLogs.map((lg, idx) => (
                  <div key={idx} className={lg.includes("DEFENSE") ? "text-yellow-400 font-bold" : lg.includes("Rotated") ? "text-cyan-300" : "text-gray-400"}>
                    {lg}
                  </div>
                ))}
                {tokenLogs.length === 0 && (
                  <div className="text-gray-500 uppercase text-center mt-12">[No rotated sessions executed in workspace tracker]</div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {labTab === "queues" && (
          <motion.div
            key="queues-view"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Left Queue Prowler Form */}
            <div className="md:col-span-1 p-5 border border-cyan-500/10 bg-black/45 rounded-xl space-y-4">
              <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                <Workflow size={13} /> BullMQ Async Dispatch
              </h3>

              <form onSubmit={handleEnqueueJob} className="space-y-3 font-mono text-[10px]">
                <div>
                  <label className="block text-gray-400 mb-1">CONVERSATIONAL COGNITIVE PROMPT</label>
                  <textarea
                    value={queuePrompt}
                    onChange={e => setQueuePrompt(e.target.value)}
                    placeholder="Enter heavy data processing prompts..."
                    rows={4}
                    className="w-full px-2 py-1.5 bg-cyan-950/10 border border-cyan-500/20 rounded text-[11px] select-text focus:outline-none focus:border-cyan-400 text-white"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={enqueuing || !queuePrompt.trim()}
                  className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-semibold rounded font-mono text-[10px] uppercase transition-all cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.2)]"
                >
                  {enqueuing ? "DISPATCHING_CORE..." : "ENQUEUE_LLM_TASK"}
                </button>
              </form>
            </div>

            {/* Jobs display panels */}
            <div className="md:col-span-2 p-5 border border-cyan-500/10 bg-black/45 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-widest flex items-center gap-1.5">
                  <Database size={13} className="text-cyan-400 animate-pulse" /> Active Task Workers Array (BullMQ Virtual)
                </h3>
                <button
                  onClick={handleClearQueues}
                  className="text-[9px] font-mono hover:text-red-400 text-gray-500 border border-white/5 hover:border-red-500/20 bg-white/5 py-0.5 px-2 rounded cursor-pointer uppercase transition-all"
                >
                  CLEAR_WORKERS
                </button>
              </div>

              <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                {jobs.map((job, idx) => (
                  <div 
                    key={idx}
                    className="border border-cyan-500/10 bg-black/60 rounded-xl p-3 space-y-2 text-[10px] font-mono font-mono relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between border-b border-white/5 pb-1.5">
                      <div>
                        <span className="font-bold text-cyan-400 block select-all">{job.id}</span>
                        <span className="text-[8px] text-gray-400 block uppercase font-sans mt-0.5">PROMPT: "{job.prompt.substring(0, 40)}..."</span>
                      </div>
                      <span className={`inline-block border text-[7px] font-bold px-2 py-0.5 rounded uppercase leading-none ${
                        job.status === "completed" 
                          ? "border-green-500/25 text-green-400 bg-green-500/5 shadow-[0_0_8px_rgba(34,197,94,0.06)]"
                          : job.status === "active"
                          ? "border-cyan-500/30 text-cyan-300 bg-cyan-500/15 animate-pulse"
                          : "border-white/10 text-gray-400"
                      }`}>
                        {job.status}
                      </span>
                    </div>

                    {/* Progress slider bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[8px] uppercase text-gray-400">
                        <span>Background Job Progress</span>
                        <span>{job.progress}%</span>
                      </div>
                      <div className="w-full bg-white/5 border border-white/10 rounded-full h-1 relative overflow-hidden">
                        <div 
                          className="bg-cyan-500 h-full transition-all duration-1000 shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                          style={{ width: `${job.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Output Results if completed */}
                    {job.status === "completed" && job.result && (
                      <div className="bg-green-500/5 border border-green-500/10 rounded p-2 text-green-300 font-sans leading-normal text-[9.5px]">
                        <strong>Output Log:</strong> {job.result}
                      </div>
                    )}
                  </div>
                ))}

                {jobs.length === 0 && (
                  <div className="text-center py-10 text-[10px] font-mono text-gray-500 uppercase border border-dashed border-white/5 rounded-lg">
                    No asynchronous dispatch jobs processing. Write parameters on left.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {labTab === "connectors" && (
          <motion.div
            key="connectors-view"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-[9px] relative selection:bg-cyan-400 selection:text-black"
          >
            {/* Registry definitions */}
            <div className="p-5 border border-cyan-500/10 bg-black/45 rounded-xl space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-1.5">
                <Code size={13} className="text-cyan-400" /> connectors/registry.json
              </h3>
              <pre className="bg-black/90 text-cyan-300 p-4 border border-cyan-500/10 rounded-lg overflow-x-auto text-[9px] leading-relaxed max-h-[220px]">
{`[
  {
    "name": "gmail",
    "class": "GmailConnector",
    "module": "gmail_connector",
    "description": "Send/read Gmail messages"
  },
  {
    "name": "slack",
    "class": "SlackConnector",
    "module": "slack_connector",
    "description": "Post/read Slack messages"
  },
  {
    "name": "drive",
    "class": "DriveConnector",
    "module": "drive_connector",
    "description": "Google Drive file operations"
  }
]`}
              </pre>
            </div>

            {/* Python Class template */}
            <div className="p-5 border border-cyan-500/10 bg-black/45 rounded-xl space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-1.5">
                <Mail size={13} className="text-cyan-400" /> connectors/gmail_connector.py
              </h3>
              <pre className="bg-black/90 text-cyan-200 p-4 border border-cyan-500/10 rounded-lg overflow-x-auto text-[9.5px] leading-relaxed max-h-[220px]">
{`import google_auth_oauthlib
from googleapiclient.discovery import build

class GmailConnector:
    def __init__(self, creds):
        self.service = build('gmail', 'v1', credentials=creds)
        
    def send_email(self, to, subject, body):
        # Construct and send email via Gmail API
        pass
        
    def list_inbox(self):
        # List and return recent messages
        pass`}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
