import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Brain,
  ShieldAlert,
  HelpCircle,
  TrendingUp,
  Workflow,
  Sparkles,
  Eye,
  Settings,
  RefreshCw,
  Clock,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  Flame,
  User,
  GitBranch,
  Target,
  FileText,
  BadgeAlert,
  Smile,
  Zap,
  Check,
  Plus
} from "lucide-react";

interface Goal {
  id: string;
  goal: string;
  progress: number;
  subtasks: { name: string; done: boolean }[];
  reward: string;
}

interface Relation {
  subject: string;
  predicate: string;
  object: string;
}

export default function Cognition() {
  // Query state for Inner Thought Space & safeties
  const [pipelineQuery, setPipelineQuery] = useState("Draft an adaptive study planner with voice notes for Rudra");
  const [isProcessingPipeline, setIsProcessingPipeline] = useState(false);
  const [pipelineResult, setPipelineResult] = useState<any>(null);

  // Advanced Goals & Motivations (Skill 4)
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoalText, setNewGoalText] = useState("");
  const [newGoalReward, setNewGoalReward] = useState("");
  const [isLoadingGoals, setIsLoadingGoals] = useState(false);

  // Curiosity Engine Interests (Skill 3)
  const [interests, setInterests] = useState<Record<string, number>>({});
  const [isLoadingInterests, setIsLoadingInterests] = useState(false);

  // World Model Relations (Skill 5)
  const [relations, setRelations] = useState<Relation[]>([]);
  const [newSubject, setNewSubject] = useState("");
  const [newPredicate, setNewPredicate] = useState("");
  const [newObject, setNewObject] = useState("");

  // Daily Reflection (Skill 2)
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [reflectionLessons, setReflectionLessons] = useState<string[]>([]);
  const [isPullingReflection, setIsPullingReflection] = useState(false);

  // Creativity Layer (Skill 8)
  const [creativeA, setCreativeA] = useState("AI Neural Agent");
  const [creativeB, setCreativeB] = useState("Physical Study Planner");
  const [isSynthesizingCreativity, setIsSynthesizingCreativity] = useState(false);
  const [creativeOutput, setCreativeOutput] = useState<any>(null);

  // Self Evolution (Skill 10)
  const [isEvolving, setIsEvolving] = useState(false);
  const [evolutionLog, setEvolutionLog] = useState<string[]>([]);
  const [evolutionReliability, setEvolutionReliability] = useState<string>("");

  // Latency & Semantic Caching controls
  const [useCache, setUseCache] = useState(true);
  const [simulateRawLatency, setSimulateRawLatency] = useState(800);

  // Subsystem health ratings
  const ratings = {
    perception: 97,
    commonSense: 91,
    reasoning: 95,
    emotion: 88,
    curiosity: 92,
    ethics: 99,
    creativity: 94
  };

  useEffect(() => {
    fetchGoals();
    fetchInterests();
    fetchRelations();
    fetchReflection();
    triggerPipelineQuery();
  }, []);

  const triggerPipelineQuery = async (queryToUse?: string) => {
    const activeQuery = queryToUse || pipelineQuery;
    if (!activeQuery.trim()) return;
    setIsProcessingPipeline(true);
    try {
      const res = await fetch("/api/cognition/pipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          query: activeQuery,
          useCache,
          simulateRawLatency
        })
      });
      const data = await res.json();
      setPipelineResult(data);
    } catch (e) {
      console.warn("Error processing cognitive feedback pipeline:", e);
    } finally {
      setIsProcessingPipeline(false);
    }
  };

  const fetchGoals = async () => {
    setIsLoadingGoals(true);
    try {
      const res = await fetch("/api/cognition/goals");
      const data = await res.json();
      if (Array.isArray(data)) setGoals(data);
    } catch (e) {
      console.warn(e);
    } finally {
      setIsLoadingGoals(false);
    }
  };

  const createGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;
    try {
      const res = await fetch("/api/cognition/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal: newGoalText, reward: newGoalReward })
      });
      if (res.ok) {
        setNewGoalText("");
        setNewGoalReward("");
        fetchGoals();
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const toggleSubtask = async (goalId: string, subtaskName: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/cognition/goals/toggle-subtask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goalId, subtaskName, done: !currentStatus })
      });
      if (res.ok) {
        fetchGoals();
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const fetchInterests = async () => {
    setIsLoadingInterests(true);
    try {
      const res = await fetch("/api/cognition/interests");
      const data = await res.json();
      setInterests(data);
    } catch (e) {
      console.warn(e);
    } finally {
      setIsLoadingInterests(false);
    }
  };

  const recordInterestClick = async (topic: string, currentVal: number) => {
    try {
      const res = await fetch("/api/cognition/interests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, val: Math.min(100, currentVal + 4) })
      });
      if (res.ok) {
        fetchInterests();
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const fetchRelations = async () => {
    try {
      const res = await fetch("/api/cognition/relations");
      const data = await res.json();
      if (Array.isArray(data)) setRelations(data);
    } catch (e) {
      console.warn(e);
    }
  };

  const createRelation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newPredicate.trim() || !newObject.trim()) return;
    try {
      const res = await fetch("/api/cognition/relations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: newSubject, predicate: newPredicate, object: newObject })
      });
      if (res.ok) {
        setNewSubject("");
        setNewPredicate("");
        setNewObject("");
        fetchRelations();
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const fetchReflection = async (day = selectedDay) => {
    setIsPullingReflection(true);
    try {
      const res = await fetch(`/api/cognition/reflection?day=${day}`);
      const data = await res.json();
      setReflectionLessons(data.lessons || []);
    } catch (e) {
      console.warn(e);
    } finally {
      setIsPullingReflection(false);
    }
  };

  const handleDayChange = (day: string) => {
    setSelectedDay(day);
    fetchReflection(day);
  };

  const runCreativitySynthesis = async () => {
    setIsSynthesizingCreativity(true);
    try {
      const res = await fetch("/api/cognition/creativity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ideaA: creativeA, ideaB: creativeB })
      });
      const data = await res.json();
      setCreativeOutput(data);
    } catch (e) {
      console.warn(e);
    } finally {
      setIsSynthesizingCreativity(false);
    }
  };

  const runEvolutionCycle = async () => {
    setIsEvolving(true);
    setEvolutionLog(["Scanning error parameters...", "Executing memory buffer decays..."]);
    try {
      const res = await fetch("/api/cognition/self-evolution", { method: "POST" });
      const data = await res.json();
      setTimeout(() => {
        setEvolutionLog(data.strategies || []);
        setEvolutionReliability(data.reliabilityDelta || "");
        setIsEvolving(false);
      }, 1200);
    } catch (e) {
      console.warn(e);
      setIsEvolving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-zinc-200/60 pb-5 gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 tracking-tight flex items-center gap-2">
            <Brain className="w-5 h-5 text-[#DA7F5B]" />
            Cognitive Brain vNext
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Active multi-level human-like architecture. Connects emotional weights, common sense, silent reasoning, ethics, and self-evolution.
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px] bg-zinc-100 px-3 py-1.5 rounded-lg border border-zinc-200 text-zinc-500 shadow-sm">
          <span>COGNITIVE FLOW: ACTIVE</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </div>

      {/* Grid of the 10 Human Subsystems */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* ROW 1: CONTROLS & INNER THOUGHT PIPELINE (Skills 1, 7, 9, 6) */}
        <div className="xl:col-span-2 space-y-6">
          <div className="border border-zinc-200 bg-[#FAFAF9] rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-200/60 pb-3">
              <h3 className="text-xs font-bold text-zinc-800 tracking-wider uppercase flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#DA7F5B]" />
                Cognitive Pipeline & Latency Optimizer (Skills 1, 6, 7 & 9)
              </h3>
              <span className="text-[10px] font-mono text-zinc-400">Thought Space + Real-Time Semantic Cache Tuning</span>
            </div>

            {/* LATENCY TUNING LABORATORY PANEL */}
            <div className="bg-zinc-100 p-3 rounded-lg border border-zinc-200 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider flex items-center gap-1.5 text-zinc-700">
                    <Zap className="w-3.5 h-3.5 text-emerald-500" />
                    Semantic Caching Engine
                  </span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-mono ${useCache ? "bg-emerald-100 text-emerald-800 border border-emerald-200" : "bg-zinc-250 text-zinc-600 border border-zinc-300"}`}>
                    {useCache ? "ACTIVE (REDIS EMULATION)" : "DISABLED (SLOW ROUTE)"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setUseCache(!useCache)}
                    className={`flex-1 transition-all rounded-md py-1.5 text-xs font-semibold cursor-pointer border ${
                      useCache 
                        ? "bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700" 
                        : "bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-50"
                    }`}
                  >
                    {useCache ? "Disable Caching" : "Enable Semantic Cache"}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                  <span className="flex items-center gap-1 text-zinc-700">
                    <Clock className="w-3.5 h-3.5 text-[#DA7F5B]" />
                    Raw Pipeline Inference Delay
                  </span>
                  <span className="font-mono text-xs text-zinc-800 font-bold">{simulateRawLatency} ms</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2000"
                  step="100"
                  value={simulateRawLatency}
                  onChange={(e) => setSimulateRawLatency(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-zinc-250 rounded-lg appearance-none cursor-pointer accent-[#DA7F5B]"
                />
                <div className="flex justify-between text-[9px] text-zinc-400 font-mono">
                  <span>Instant (0ms)</span>
                  <span>Typical LLM (800ms)</span>
                  <span>Heavy NLP (2000ms)</span>
                </div>
              </div>
            </div>

            {/* TELEMETRY READOUT DASHBOARD */}
            {pipelineResult && pipelineResult.telemetry && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-zinc-900 border border-zinc-950 text-white rounded-lg p-3.5 font-mono text-[11px] shadow">
                <div className="space-y-0.5">
                  <span className="text-zinc-500 uppercase block text-[9px] font-bold">Cache Status</span>
                  <span className={`font-bold text-xs flex items-center gap-1 ${
                    pipelineResult.telemetry.cacheStatus === "HIT" 
                      ? "text-emerald-400 animate-pulse" 
                      : pipelineResult.telemetry.cacheStatus === "MISS" 
                      ? "text-amber-400" 
                      : "text-zinc-400"
                  }`}>
                    ● {pipelineResult.telemetry.cacheStatus}
                  </span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-zinc-500 uppercase block text-[9px] font-bold">Inference Latency</span>
                  <span className={`font-bold text-xs ${pipelineResult.telemetry.cacheStatus === "HIT" ? "text-emerald-400" : "text-white"}`}>
                    {pipelineResult.telemetry.latencyMs} ms
                  </span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-zinc-500 uppercase block text-[9px] font-bold">Latency Saved</span>
                  <span className="font-bold text-xs text-emerald-400">
                    +{pipelineResult.telemetry.latencySavedMs} ms
                  </span>
                </div>
                <div className="space-y-0.5 overflow-hidden text-ellipsis whitespace-nowrap">
                  <span className="text-zinc-500 uppercase block text-[9px] font-bold">Jaccard Match Score</span>
                  <span className={`font-bold text-xs ${pipelineResult.telemetry.cacheStatus === "HIT" ? "text-emerald-400" : "text-zinc-400"}`}>
                    {pipelineResult.telemetry.cacheStatus === "HIT" ? `${Math.round(pipelineResult.telemetry.similarityScore * 100)}% Similarity` : "N/A (Miss)"}
                  </span>
                </div>
              </div>
            )}

            {/* PRE-SAVED EXPERIMENTAL TEST COMMANDS */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                Quick-Test Semantic Query Presets (Compare Hits vs Misses)
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  "Draft an adaptive study planner with voice notes for Rudra",
                  "Draft study planner with voice notes for Rudra", // Slight semantic variation to trigger cache matching!
                  "Compile study notes for Rudra's math exam",
                  "Prepare hot cup of premium coffee"
                ].map((sample, sIdx) => {
                  const isSlightVariation = sIdx === 1;
                  return (
                    <button
                      key={sIdx}
                      type="button"
                      onClick={() => {
                        setPipelineQuery(sample);
                        triggerPipelineQuery(sample);
                      }}
                      className={`text-[9px] font-mono px-2.5 py-1.5 rounded-lg border text-left cursor-pointer transition-colors max-w-full ${
                        isSlightVariation
                          ? "bg-indigo-50/50 border-indigo-200 text-indigo-900 hover:bg-indigo-100"
                          : "bg-white border-zinc-200 text-zinc-650 hover:bg-zinc-50"
                      }`}
                    >
                      {sample} {isSlightVariation && <span className="text-indigo-600 font-bold ml-1">(Semantic match demo!)</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
                Transmit Custom Cognitive Query
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={pipelineQuery}
                  onChange={(e) => setPipelineQuery(e.target.value)}
                  placeholder="e.g. Delete my database records... / Prepare exam notes..."
                  className="flex-1 bg-white border border-zinc-200 text-xs rounded-lg px-3 py-2 text-zinc-850 focus:outline-none focus:border-[#DA7F5B] transition-colors shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => triggerPipelineQuery()}
                  disabled={isProcessingPipeline}
                  className="px-4 py-2 bg-zinc-900 text-white text-xs font-bold rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  {isProcessingPipeline ? (
                    <RefreshCw className="w-3" />
                  ) : (
                    <Zap className="w-3.5 h-3.5" />
                  )}
                  Synthesize
                </button>
              </div>
              <div className="text-[10px] text-zinc-400 italic">
                Try testing risky commands (e.g. &apos;delete database&apos;) to witness ethical boundaries, or &apos;exam&apos;/&apos;coffee&apos; to trigger common sense.
              </div>
            </div>

            {/* Pipeline Outputs */}
            <AnimatePresence mode="wait">
              {pipelineResult && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4 pt-2"
                >
                  {/* Skill 9: Ethics Panel */}
                  <div className={`p-3.5 rounded-lg border flex gap-3 ${
                    pipelineResult.ethicsFlagged 
                      ? "bg-red-50 border-red-200 text-red-900" 
                      : pipelineResult.riskEvaluation === "MEDIUM" 
                      ? "bg-amber-50 border-amber-200 text-amber-900" 
                      : "bg-emerald-50/50 border-emerald-200/60 text-emerald-950"
                  }`}>
                    {pipelineResult.ethicsFlagged || pipelineResult.riskEvaluation === "MEDIUM" ? (
                      <AlertTriangle className="w-5 h-5 shrink-0 animate-bounce mt-0.5" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
                    )}
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider">
                        Skill 9 — Ethics Guardrail Analysis ({pipelineResult.riskEvaluation} RISK)
                      </div>
                      <p className="text-xs mt-1 leading-relaxed opacity-90 font-sans">
                        {pipelineResult.reasoning}
                      </p>
                      {pipelineResult.requiresApproval && (
                        <div className="mt-2.5 flex items-center gap-2">
                          <button
                            onClick={() => alert("Verification cleared by Captain.")}
                            className="bg-zinc-900 text-white font-bold text-[9px] px-2.5 py-1 rounded cursor-pointer uppercase tracking-wider hover:bg-zinc-800"
                          >
                            Grant Human Authorization
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {!pipelineResult.ethicsFlagged && pipelineResult.thoughtSpace && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Skill 7: Inner Thought Logs */}
                      <div className="border border-zinc-200/80 bg-white rounded-lg p-3.5 shadow-sm space-y-2">
                        <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                          <Eye className="w-3.5 h-3.5 text-[#DA7F5B]" />
                          Skill 7 — Silent Thought Space
                        </div>
                        <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                          {pipelineResult.thoughtSpace.thoughts.map((th: string, idx: number) => (
                            <div key={idx} className="font-mono text-[10px] text-zinc-650 leading-relaxed border-l-2 border-zinc-200 pl-2">
                              {th}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Tactical Plan Output */}
                      <div className="border border-zinc-200/80 bg-white rounded-lg p-3.5 shadow-sm space-y-2">
                        <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                          <Settings className="w-3.5 h-3.5 text-[#DA7F5B]" />
                          Synthesized Action Plan
                        </div>
                        <div className="space-y-1">
                          {pipelineResult.thoughtSpace.tacticalPlan.map((plan: string, idx: number) => (
                            <div key={idx} className="text-xs text-zinc-700 leading-relaxed font-sans font-medium flex gap-2">
                              <span className="text-[#DA7F5B] font-bold">✓</span>
                              {plan}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {!pipelineResult.ethicsFlagged && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Skill 1: Common Sense grounding output */}
                      <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-lg space-y-1">
                        <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                          <HelpCircle className="w-3.5 h-3.5 text-[#DA7F5B]" />
                          Skill 1 — Common Sense Shield
                        </div>
                        <p className="text-xs text-zinc-700 leading-relaxed font-sans font-medium italic">
                          &ldquo;{pipelineResult.commonSense.matchedFact}&rdquo;
                        </p>
                      </div>

                      {/* Skill 6: Prediction parameters output */}
                      <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-lg space-y-1">
                        <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#DA7F5B]" />
                          Skill 6 — Prediction Forecast ({pipelineResult.prediction.confidence} Confidence)
                        </div>
                        <div className="text-xs text-zinc-700 leading-relaxed font-sans font-medium">
                          Active Peak Prediction: <span className="text-zinc-900 font-bold">{pipelineResult.prediction.window}</span>
                          <span className="block text-[10px] text-[#DA7F5B] mt-1 uppercase font-bold tracking-wider">
                            PRE-EMPTIVE TARGET: {pipelineResult.prediction.autonomousTask}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Goals Workspace and Motivations (Skill 4) */}
          <div className="border border-zinc-200 bg-[#FAFAF9] rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-200/60 pb-3">
              <h3 className="text-xs font-bold text-zinc-800 tracking-wider uppercase flex items-center gap-2">
                <Target className="w-4 h-4 text-[#DA7F5B]" />
                Skill 4 — Goal Motivation & Milestones
              </h3>
              <span className="text-[10px] font-mono text-zinc-400">Track Subtasks & Progress Rewards</span>
            </div>

            <form onSubmit={createGoal} className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Declare active goal..."
                value={newGoalText}
                onChange={(e) => setNewGoalText(e.target.value)}
                className="md:col-span-2 bg-white border border-zinc-200 text-xs rounded-lg px-3 py-2 text-zinc-800 focus:outline-none focus:border-[#DA7F5B]"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Target reward..."
                  value={newGoalReward}
                  onChange={(e) => setNewGoalReward(e.target.value)}
                  className="flex-1 bg-white border border-zinc-200 text-xs rounded-lg px-3 py-2 text-zinc-800 focus:outline-none focus:border-[#DA7F5B]"
                />
                <button
                  type="submit"
                  className="bg-zinc-900 text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-zinc-800 whitespace-nowrap cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Set
                </button>
              </div>
            </form>

            <div className="space-y-3 pt-2">
              {goals.map((g) => (
                <div key={g.id} className="bg-white border border-zinc-200 p-4 rounded-lg space-y-3 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-xs font-bold text-zinc-900 leading-normal">{g.goal}</h4>
                      <p className="text-[10px] text-zinc-400 mt-0.5">Reward Milestone: <span className="text-[#DA7F5B] font-semibold">{g.reward}</span></p>
                    </div>
                    <span className="text-xs font-mono font-black text-zinc-800 shrink-0 bg-zinc-100 px-2 py-0.5 rounded text-right">
                      {g.progress}% Complete
                    </span>
                  </div>

                  {/* Progress Line */}
                  <div className="w-full bg-zinc-100 rounded-full h-1">
                    <div
                      className="bg-gradient-to-r from-[#DA7F5B] to-amber-400 h-1 rounded-full transition-all duration-500"
                      style={{ width: `${g.progress}%` }}
                    />
                  </div>

                  {/* Subtasks Checks */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1.5 border-t border-zinc-100">
                    {g.subtasks.map((sub) => (
                      <button
                        key={sub.name}
                        onClick={() => toggleSubtask(g.id, sub.name, sub.done)}
                        className="flex items-center gap-2 text-left text-[11px] font-sans font-medium text-zinc-650 hover:text-[#DA7F5B] transition-colors cursor-pointer"
                      >
                        <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${
                          sub.done ? "bg-zinc-900 border-zinc-900 text-white" : "border-zinc-300 bg-white"
                        }`}>
                          {sub.done && <Check className="w-2.5 h-2.5" />}
                        </div>
                        <span className={sub.done ? "line-through text-zinc-400" : ""}>{sub.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SIDEBAR WIDGETS: Skills 2, 3, 5, 8, 10 */}
        <div className="space-y-6">
          
          {/* Skill 3: Curiosity Engine */}
          <div className="border border-zinc-200 bg-[#FAFAF9] rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-200/60 pb-2.5">
              <h3 className="text-xs font-bold text-zinc-800 tracking-wider uppercase flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#DA7F5B]" />
                Skill 3 — Curiosity Engine
              </h3>
              <span className="text-[10px] font-mono text-zinc-400">Topic Scorer</span>
            </div>
            <p className="text-[10px] text-zinc-400 leading-relaxed font-sans">
              Click a learning vector below to simulated explore/trigger active background curiosity indexing loops.
            </p>

            <div className="space-y-2 pt-1">
              {Object.entries(interests).map(([topic, val]) => (
                <button
                  key={topic}
                  onClick={() => recordInterestClick(topic, val)}
                  className="w-full flex items-center justify-between p-2.5 bg-white border border-zinc-200 hover:border-[#DA7F5B]/40 rounded-lg group transition-all text-xs text-left shadow-sm cursor-pointer"
                >
                  <div className="space-y-1 flex-1">
                    <span className="font-sans font-bold text-zinc-800 group-hover:text-[#DA7F5B] transition-colors">{topic}</span>
                    <div className="w-2/3 bg-zinc-100 rounded-full h-1">
                      <div className="bg-[#DA7F5B] h-1 rounded-full transition-all" style={{ width: `${val}%` }} />
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded ml-2 shrink-0 group-hover:bg-[#DA7F5B]/10 group-hover:text-[#DA7F5B] transition-colors">
                    Score: {val}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Skill 5: World Model Relations */}
          <div className="border border-zinc-200 bg-[#FAFAF9] rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-200/60 pb-2.5">
              <h3 className="text-xs font-bold text-zinc-800 tracking-wider uppercase flex items-center gap-2">
                <Workflow className="w-4 h-4 text-[#DA7F5B]" />
                Skill 5 — World Model Ontologies
              </h3>
              <span className="text-[10px] font-mono text-zinc-400">Map Connections</span>
            </div>

            <form onSubmit={createRelation} className="space-y-2">
              <div className="grid grid-cols-3 gap-1">
                <input
                  type="text"
                  placeholder="Subject"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="bg-white border border-zinc-200 text-[10px] px-2 py-1 rounded focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Predicate"
                  value={newPredicate}
                  onChange={(e) => setNewPredicate(e.target.value)}
                  className="bg-white border border-zinc-200 text-[10px] px-2 py-1 rounded focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Object"
                  value={newObject}
                  onChange={(e) => setNewObject(e.target.value)}
                  className="bg-white border border-zinc-200 text-[10px] px-2 py-1 rounded focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-1 bg-zinc-900 text-white text-[10px] font-bold rounded cursor-pointer uppercase tracking-wider hover:bg-zinc-800 transition-colors"
              >
                Learn New Relation
              </button>
            </form>

            <div className="max-h-[160px] overflow-y-auto space-y-1.5 pt-1.5 pr-1 border-t border-zinc-100">
              {relations.map((rel, idx) => (
                <div key={idx} className="font-mono text-[10px] text-zinc-650 bg-white p-2 border border-zinc-100 rounded leading-relaxed flex items-center gap-1">
                  <span className="text-zinc-850 font-bold">{rel.subject}</span>
                  <span className="text-[#DA7F5B] font-semibold italic">({rel.predicate})</span>
                  <span className="text-zinc-550">{rel.object}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Skill 8: Creativity Synthesis */}
          <div className="border border-zinc-200 bg-[#FAFAF9] rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-200/60 pb-2.5">
              <h3 className="text-xs font-bold text-zinc-800 tracking-wider uppercase flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-[#DA7F5B]" />
                Skill 8 — Creativity Merger
              </h3>
              <span className="text-[10px] font-mono text-zinc-400">Synthesis</span>
            </div>

            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={creativeA}
                  onChange={(e) => setCreativeA(e.target.value)}
                  className="bg-white border border-zinc-200 text-xs px-2 py-1.5 rounded-lg text-zinc-700"
                >
                  <option value="AI Neural Agent">AI Neural Agent</option>
                  <option value="Realtime Grounding Index">Realtime Indexer</option>
                  <option value="Holographic HUD Dashboard">Holographic HUD</option>
                </select>
                <select
                  value={creativeB}
                  onChange={(e) => setCreativeB(e.target.value)}
                  className="bg-white border border-zinc-200 text-xs px-2 py-1.5 rounded-lg text-zinc-700"
                >
                  <option value="Physical Study Planner">Study Planner</option>
                  <option value="Audio Voice Assistant">Voice assistant</option>
                  <option value="E episodic memory database">Episodic memory</option>
                </select>
              </div>
              <button
                type="button"
                onClick={runCreativitySynthesis}
                className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold rounded-lg cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Synaptically Imagine Concept
              </button>
            </div>

            {creativeOutput && (
              <div className="p-3 bg-white border border-zinc-200 rounded-lg space-y-1.5 shadow-sm text-zinc-800">
                <div className="text-[11px] font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-1">
                  💡 NAME: {creativeOutput.synthesizedName}
                </div>
                <p className="text-[11px] text-zinc-650 font-sans leading-relaxed">
                  {creativeOutput.vision}
                </p>
                <div className="text-[10px] font-bold text-[#DA7F5B] uppercase tracking-wider pt-1 border-t border-zinc-100">
                  Target Use cases:
                </div>
                <div className="space-y-1">
                  {creativeOutput.useCases.map((c: string) => (
                    <div key={c} className="text-[10px] text-zinc-500 font-sans flex items-start gap-1">
                      <span>•</span> <span className="flex-1">{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Skill 2: Reflection Logs */}
          <div className="border border-zinc-200 bg-[#FAFAF9] rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-200/60 pb-2.5">
              <h3 className="text-xs font-bold text-zinc-800 tracking-wider uppercase flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#DA7F5B]" />
                Skill 2 — Daily Reflections
              </h3>
              <span className="text-[10px] font-mono text-zinc-400">Night Loop Lessons</span>
            </div>

            <div className="flex gap-1 bg-zinc-200/50 p-0.5 rounded-lg">
              {["Monday", "Tuesday", "Wednesday"].map(day => (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDayChange(day)}
                  className={`flex-1 py-1 text-[10px] font-semibold rounded cursor-pointer transition-all ${
                    selectedDay === day ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-800"
                  }`}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>

            <div className="space-y-1.5 min-h-[90px]">
              {isPullingReflection ? (
                <div className="text-[10px] font-mono text-zinc-400 text-center py-4">Synchronizing lessons...</div>
              ) : (
                reflectionLessons.map((les, idx) => (
                  <div key={idx} className="text-[11px] text-zinc-750 bg-white p-2.5 border border-zinc-200 rounded-lg shadow-sm leading-relaxed font-sans">
                    {les}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Skill 10: Self Evolution Core */}
          <div className="border border-zinc-200 bg-[#FAFAF9] rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-200/60 pb-2.5">
              <h3 className="text-xs font-bold text-zinc-800 tracking-wider uppercase flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-[#DA7F5B]" />
                Skill 10 — Self Evolution
              </h3>
              <span className="text-[10px] font-mono text-zinc-400">Healing Loop</span>
            </div>
            <p className="text-[10px] text-zinc-400 leading-relaxed font-sans">
              Scan historical failures at night to optimize plans, update skill scores, and raise scores.
            </p>

            <button
              type="button"
              disabled={isEvolving}
              onClick={runEvolutionCycle}
              className="w-full py-2 bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 font-bold text-xs rounded-lg cursor-pointer flex items-center justify-center gap-2 transition-colors"
            >
              {isEvolving ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Cpu className="w-4 h-4 text-emerald-400 animate-pulse" />
              )}
              Commence Self-Hone Scan
            </button>

            {evolutionLog.length > 0 && (
              <div className="p-3 bg-white border border-zinc-200 rounded-lg space-y-1.5 shadow-sm font-sans text-zinc-800">
                <div className="flex items-center justify-between text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                  <span>Self-Healing Outcome Complete</span>
                  {evolutionReliability && <span className="bg-emerald-50 px-1.5 py-0.5 rounded">{evolutionReliability}</span>}
                </div>
                <div className="space-y-1">
                  {evolutionLog.map((les, i) => (
                    <div key={i} className="text-[10px] text-zinc-650 leading-relaxed border-l-2 border-emerald-500 pl-2">
                      {les}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

// Simple Cpu icon placeholder for the self evolution button inline definition
function Cpu({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <rect width="16" height="16" x="4" y="4" rx="2" />
      <rect width="6" height="6" x="9" y="9" rx="1" />
      <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3" />
    </svg>
  );
}
