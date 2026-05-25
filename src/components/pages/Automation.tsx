import React, { useState } from "react";
import { motion } from "motion/react";
import { Zap, Plus, Play, Trash2, Power, Compass, Server, Check } from "lucide-react";
import { WorkflowItem } from "../../types";

interface AutomationProps {
  onLogMessage: (level: "INFO" | "WARN" | "CORE" | "ERROR", text: string) => void;
}

export default function Automation({ onLogMessage }: AutomationProps) {
  const [workflows, setWorkflows] = useState<WorkflowItem[]>([
    {
      id: "flow-1",
      name: "Emergency Shield Warning",
      trigger: "Reactor Heat > 85°C",
      action: "Send Critical Warning Packet via Telegram & Slack",
      active: true,
      frequency: "Instant",
    },
    {
      id: "flow-2",
      name: "Weekly Synaptic Document Backup",
      trigger: "Sunday 24:00 Space Time",
      action: "Archive workspace vector index backups to Secure Drive",
      active: false,
      frequency: "Weekly",
    },
    {
      id: "flow-3",
      name: "Morning Espresso Warmup",
      trigger: "Sensory Sleep Clocks Wakeup",
      action: "Trigger brewer sequence & play quiet ambient tunes",
      active: true,
      frequency: "Daily",
    },
  ]);

  const [newName, setNewName] = useState("");
  const [newTrigger, setNewTrigger] = useState("");
  const [newAction, setNewAction] = useState("");
  const [newFrequency, setNewFrequency] = useState("Daily");
  const [isCreating, setIsCreating] = useState(false);

  const toggleWorkflow = (id: string) => {
    setWorkflows((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          const newState = !w.active;
          onLogMessage("INFO", `Automation thread "${w.name}" updated to state: ${newState ? "ACTIVE" : "STANDBY"}`);
          return { ...w, active: newState };
        }
        return w;
      })
    );
  };

  const deleteWorkflow = (id: string) => {
    const d = workflows.find((w) => w.id === id);
    setWorkflows((prev) => prev.filter((w) => w.id !== id));
    onLogMessage("WARN", `Pruned automation routine: "${d?.name}"`);
  };

  const triggerManually = (w: WorkflowItem) => {
    onLogMessage("CORE", `Manual override execution trigger: "${w.name}". Dispatching payload packets...`);
    alert(`⚡ [Manual Override] Executing Routine: "${w.name}"\nTrigger: ${w.trigger}\nAction: ${w.action}\nDispatch successful!`);
  };

  const handleCreateWorkflow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newTrigger || !newAction) return;

    const newWf: WorkflowItem = {
      id: Math.random().toString(),
      name: newName,
      trigger: newTrigger,
      action: newAction,
      active: true,
      frequency: newFrequency,
    };

    setWorkflows([...workflows, newWf]);
    setIsCreating(false);
    setNewName("");
    setNewTrigger("");
    setNewAction("");
    onLogMessage("CORE", `Instantiated secure automation routine pipeline: ${newWf.name}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-white relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cyan-500/10 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-sans font-black tracking-tight text-white flex items-center gap-3">
            <Zap className="text-cyan-400 shrink-0 animate-bounce" /> ROBOTIC AUTOMATION CENTER
          </h1>
          <p className="text-xs font-mono text-cyan-400/60 mt-1 uppercase">ORCHESTRATE TRIGGER-ACTION WORKFLOW PIPELINES AND RECURSIVE TASKS</p>
        </div>

        <button
          id="create-workflow-button"
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center gap-1.5 px-4 py-2 bg-fuchsia-500 hover:bg-fuchsia-400 text-white font-semibold rounded-lg text-xs font-mono transition-all cursor-pointer"
        >
          <Plus size={14} /> {isCreating ? "CANCEL_CREATION" : "BUILD_ROUTINE"}
        </button>
      </div>

      {/* Visual Workspace Node Map representation */}
      <div className="p-6 border border-cyan-500/10 rounded-xl bg-black/35 mb-8 backdrop-blur-md">
        <div className="flex items-center justify-between mb-4 border-b border-cyan-500/10 pb-2">
          <span className="text-[10px] font-mono tracking-wider text-cyan-400">AUTOMATION STATE DIAGRAM (HUD MAPPING)</span>
          <span className="text-[9px] font-mono text-cyan-400/40 uppercase">STANDALONE PARSER LINKED</span>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-3">
          <div className="p-3 border border-dashed border-cyan-400/30 rounded bg-cyan-950/20 text-center font-mono text-[10px] w-full md:w-56 text-cyan-300">
            <span className="block text-cyan-400 font-bold uppercase mb-1">ST-1: RECURSIVE TRIGGER</span>
            Select criteria: Timer, Thread Alert, Webhook, Geofence
          </div>
          <div className="h-6 w-0.5 md:h-0.5 md:w-12 bg-cyan-500/30" />
          <div className="p-3 border border-dashed border-cyan-400/30 rounded bg-cyan-950/20 text-center font-mono text-[10px] w-full md:w-56 text-fuchsia-300">
            <span className="block text-fuchsia-400 font-bold uppercase mb-1">ST-2: TRANSLATOR LOOP</span>
            Compile trigger requirements & check contextual states
          </div>
          <div className="h-6 w-0.5 md:h-0.5 md:w-12 bg-cyan-500/30" />
          <div className="p-3 border border-dashed border-cyan-504/30 rounded bg-cyan-950/20 text-center font-mono text-[10px] w-full md:w-56 text-yellow-300">
            <span className="block text-yellow-400 font-bold uppercase mb-1">ST-3: CONCURRENT ACTION</span>
            Dispatch Slack alerts, brew Coffee, sync Docs
          </div>
        </div>
      </div>

      {/* CREATE WORKFLOW FORM */}
      {isCreating && (
        <form onSubmit={handleCreateWorkflow} className="p-6 border border-fuchsia-500/30 bg-black/60 rounded-xl mb-8 space-y-4">
          <h2 className="text-sm font-mono font-bold text-fuchsia-400 uppercase tracking-widest">[Configure Automation Synapse]</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono text-fuchsia-400/50 uppercase mb-1">Pipeline Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g., Slack Alert Trigger"
                className="w-full px-3 py-2 bg-cyan-950/10 border border-fuchsia-500/20 rounded text-xs select-text focus:outline-none focus:border-fuchsia-400 text-white font-semibold"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-fuchsia-400/50 uppercase mb-1">Frequency Index</label>
              <select
                value={newFrequency}
                onChange={(e) => setNewFrequency(e.target.value)}
                className="w-full px-3 py-2 bg-cyan-950/20 border border-fuchsia-500/20 rounded text-xs focus:outline-none focus:border-fuchsia-400 text-fuchsia-200 font-mono"
              >
                <option value="Instant">INSTANT_BURST</option>
                <option value="Daily">DAILY_CORRELATION</option>
                <option value="Weekly">WEEKLY_BACKUP</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono text-fuchsia-400/50 uppercase mb-1">Robotic Trigger Condition</label>
              <input
                type="text"
                value={newTrigger}
                onChange={(e) => setNewTrigger(e.target.value)}
                placeholder="e.g., Temperature exceeds 45 degrees C"
                className="w-full px-3 py-2 bg-cyan-950/10 border border-fuchsia-500/20 rounded text-xs select-text focus:outline-none focus:border-fuchsia-400 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-fuchsia-400/50 uppercase mb-1">Target Action Dispatch</label>
              <input
                type="text"
                value={newAction}
                onChange={(e) => setNewAction(e.target.value)}
                placeholder="e.g., Issue distress call & shut auxiliary fans"
                className="w-full px-3 py-2 bg-cyan-950/10 border border-fuchsia-500/20 rounded text-xs select-text focus:outline-none focus:border-fuchsia-400 text-white"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 border border-white/10 hover:border-white/20 rounded text-xs font-mono font-bold cursor-pointer"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-fuchsia-500 hover:bg-fuchsia-400 text-white font-semibold rounded text-xs font-mono shadow-[0_0_15px_rgba(217,70,239,0.3)] cursor-pointer"
            >
              INSTANTIATE_INTEGRATION
            </button>
          </div>
        </form>
      )}

      {/* LIST WORKFLOWS */}
      <div className="space-y-4">
        {workflows.map((wf) => (
          <div
            key={wf.id}
            className={`p-5 rounded-xl border backdrop-blur-md relative overflow-hidden transition-all duration-350 bg-black/45 ${
              wf.active ? "border-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.05)]" : "border-white/5 opacity-60"
            }`}
          >
            {/* Ambient status light inside card */}
            <div className={`absolute top-0 left-0 w-1 h-full ${wf.active ? "bg-cyan-400" : "bg-gray-600"}`} />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-mono text-sm font-bold text-white tracking-wide uppercase">{wf.name}</h3>
                  <span className="px-1.5 py-0.5 bg-cyan-500/10 border border-cyan-500/20 text-[8px] font-mono text-cyan-300 rounded uppercase">
                    {wf.frequency}
                  </span>
                </div>
                <div className="flex flex-col md:flex-row text-xs gap-y-1 gap-x-4">
                  <p className="text-gray-400 font-sans">
                    <span className="font-mono text-[10px] text-cyan-400/50 uppercase">TRIGGER:</span> {wf.trigger}
                  </p>
                  <p className="text-gray-400 font-sans">
                    <span className="font-mono text-[10px] text-fuchsia-400/50 uppercase">ACTION:</span> {wf.action}
                  </p>
                </div>
              </div>

              {/* Action operations on the right */}
              <div className="flex items-center justify-end gap-3 font-mono">
                {/* Override Trigger button */}
                <button
                  onClick={() => triggerManually(wf)}
                  className="p-1.5 border border-white/10 hover:border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/5 rounded text-xs font-bold font-mono cursor-pointer flex items-center gap-1 shrink-0"
                  title="Force Single Execution"
                >
                  <Play size={10} /> FORCE_RUN
                </button>

                {/* Power Toggle Switch Button */}
                <button
                  onClick={() => toggleWorkflow(wf.id)}
                  className={`p-2 rounded-full transition-all cursor-pointer ${
                    wf.active ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30" : "bg-white/5 text-gray-400 border border-white/10"
                  }`}
                  title={wf.active ? "Deactivate Routine" : "Activate Routine"}
                >
                  <Power size={13} />
                </button>

                {/* Delete button */}
                <button
                  onClick={() => deleteWorkflow(wf.id)}
                  className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/5 border border-transparent hover:border-red-500/20 rounded transition-all cursor-pointer"
                  title="Delete Routine"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {workflows.length === 0 && (
          <div className="text-center py-12 border border-cyan-500/10 rounded-xl font-mono text-xs text-gray-500">
            NO CONCURRENT AUTOMATION ROUTINES DESIGNED IN REGION INDEX
          </div>
        )}
      </div>
    </div>
  );
}
