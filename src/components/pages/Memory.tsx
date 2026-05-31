import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BrainCircuit, Search, Plus, Trash2, Edit3, Bookmark, AlertCircle, Save, ArrowUpDown, Sparkles, Image as ImageIcon, Loader2, LayoutGrid, Server } from "lucide-react";
import { MemoryCard } from "../../types";
import { auth } from "../../lib/firebase";

interface FixedSizeListProps {
  height: number;
  itemCount: number;
  itemSize: number;
  width?: string | number;
  children: (props: { index: number; style: React.CSSProperties }) => React.ReactNode;
}

function List({ height, itemCount, itemSize, width = "100%", children }: FixedSizeListProps) {
  const [scrollTop, setScrollTop] = useState(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  const totalHeight = itemCount * itemSize;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemSize) - 3);
  const endIndex = Math.min(itemCount - 1, Math.floor((scrollTop + height) / itemSize) + 3);

  const items = [];
  for (let i = startIndex; i <= endIndex; i++) {
    const rendered = children({
      index: i,
      style: {
        position: "absolute",
        top: i * itemSize,
        left: 0,
        right: 0,
        height: itemSize,
      },
    });
    if (rendered) {
      items.push(rendered);
    }
  }

  return (
    <div
      onScroll={handleScroll}
      style={{
        overflowY: "auto",
        position: "relative",
        height,
        width,
      }}
      className="scrollbar-thin scrollbar-thumb-cyan-500/10 scrollbar-track-transparent"
    >
      <div style={{ height: totalHeight, width: "100%", position: "relative" }}>
        {items}
      </div>
    </div>
  );
}

interface MemoryProps {
  onLogMessage: (level: "INFO" | "WARN" | "CORE" | "ERROR", text: string) => void;
}

export default function Memory({ onLogMessage }: MemoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"relevance" | "date" | "category">("relevance");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "virtual">("grid");
  const [memories, setMemories] = useState<MemoryCard[]>([]);
  const [loading, setLoading] = useState(true);

  // States for dynamic schematic image compilation
  const [editImageUrl, setEditImageUrl] = useState("");
  const [generatingImage, setGeneratingImage] = useState(false);

  // Load memories from dynamic database on disk & Firestore proxy
  useEffect(() => {
    let active = true;
    const fetchMemories = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/memories");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (active) {
          setMemories(data);
          onLogMessage("INFO", `Synchronized ${data.length} persistent synapse profiles with dataset files.`);
        }
      } catch (err: any) {
        console.error("Failed to load synaptic memories:", err);
        if (active) {
          onLogMessage("ERROR", `Failed to map synapses from files: ${err.message}`);
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchMemories();
    return () => { active = false; };
  }, []);

  const [isEditingId, setIsEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editCategory, setEditCategory] = useState<"personal" | "task" | "preference" | "system">("preference");

  const [isCreating, setIsCreating] = useState(false);

  const handleDelete = async (id: string) => {
    const deleted = memories.find((m) => m.id === id);
    try {
      const res = await fetch(`/api/memories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete request failed");
      setMemories((prev) => prev.filter((m) => m.id !== id));
      onLogMessage("WARN", `Pruned persistent synapse: "${deleted?.title}"`);
    } catch (err: any) {
      onLogMessage("ERROR", `Failed to delete dynamic database record: ${err.message}`);
    }
  };

  const startEdit = (card: MemoryCard) => {
    setIsEditingId(card.id);
    setEditTitle(card.title);
    setEditContent(card.content);
    setEditCategory(card.category);
    setEditImageUrl(card.imageUrl || "");
  };

  const handleGenerateImage = async () => {
    const promptToUse = editTitle || editContent || "Neural Synaptic Vector State";
    try {
      setGeneratingImage(true);
      onLogMessage("INFO", `Initiating visual compilation for synapse vector: "${promptToUse}"`);
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptToUse,
          userUid: auth.currentUser?.uid,
          userEmail: auth.currentUser?.email,
          userDisplayName: auth.currentUser?.displayName
        })
      });
      if (!res.ok) {
        if (res.status === 402) {
          throw new Error("Insufficient database credits for image compilation. Your 500 CR limit resets tomorrow, or contact an Admin.");
        }
        throw new Error("Visual generation connection refused or timed out.");
      }
      const data = await res.json();
      setEditImageUrl(data.imageUrl);
      onLogMessage("CORE", `Visual schematic matrix finalized and loaded for "${promptToUse}"`);
    } catch (err: any) {
      onLogMessage("ERROR", `Synaptic visual compilation failed: ${err.message}`);
    } finally {
      setGeneratingImage(false);
    }
  };

  const saveEdit = async (id: string) => {
    try {
      const targetMemory = memories.find(m => m.id === id);
      const res = await fetch("/api/memories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          title: editTitle,
          content: editContent,
          category: editCategory,
          relevance: targetMemory?.relevance || 99,
          imageUrl: editImageUrl
        })
      });
      if (!res.ok) throw new Error("Update request failed");
      const data = await res.json();
      
      setMemories((prev) =>
        prev.map((m) => (m.id === id ? data.item : m))
      );
      setIsEditingId(null);
      setEditImageUrl("");
      onLogMessage("INFO", `Synced changes to database file with schematic visual: "${editTitle}"`);
    } catch (err: any) {
      onLogMessage("ERROR", `Failed to record synapses: ${err.message}`);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle || !editContent) return;

    try {
      const res = await fetch("/api/memories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle,
          content: editContent,
          category: editCategory,
          relevance: 100,
          imageUrl: editImageUrl
        })
      });
      if (!res.ok) throw new Error("Create request failed");
      const data = await res.json();

      setMemories((prev) => [data.item, ...prev]);
      setIsCreating(false);
      setEditTitle("");
      setEditContent("");
      setEditImageUrl("");
      onLogMessage("CORE", `Successfully injected persistent synapse with visual card schematic: "${data.item.title}"`);
    } catch (err: any) {
      onLogMessage("ERROR", `Failed to inject synapse: ${err.message}`);
    }
  };

  const filteredMemories = memories.filter((mem) => {
    const matchesSearch = mem.title.toLowerCase().includes(searchTerm.toLowerCase()) || mem.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || mem.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedMemories = [...filteredMemories].sort((a, b) => {
    if (sortBy === "relevance") {
      const relA = typeof a.relevance === "number" ? a.relevance : 0;
      const relB = typeof b.relevance === "number" ? b.relevance : 0;
      if (relB !== relA) {
        return relB - relA;
      }
      return (b.timestamp || "").localeCompare(a.timestamp || "");
    } else if (sortBy === "category") {
      const catA = a.category || "";
      const catB = b.category || "";
      if (catA !== catB) {
        return catA.localeCompare(catB);
      }
      return (b.timestamp || "").localeCompare(a.timestamp || "");
    } else {
      return (b.timestamp || "").localeCompare(a.timestamp || "");
    }
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-white relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cyan-500/10 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-sans font-black tracking-tight text-white flex items-center gap-3">
            <BrainCircuit className="text-cyan-400 shrink-0 animate-pulse" /> MEMORY STORAGE CENTER
          </h1>
          <p className="text-xs font-mono text-cyan-400/60 mt-1 uppercase">PERSISTENT SYSTEM MEMORY PARADIGMS AND CONTEXT VECTOR FIELDS</p>
        </div>

        {/* Action button to create */}
        <button
          id="create-synapse-button"
          onClick={() => {
            setIsCreating(!isCreating);
            setIsEditingId(null);
            setEditTitle("");
            setEditContent("");
            setEditImageUrl("");
          }}
          className="flex items-center gap-1.5 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded-lg text-xs font-mono transition-all cursor-pointer"
        >
          <Plus size={14} /> {isCreating ? "CANCEL_EDIT" : "CREATE_SYNAPSE"}
        </button>
      </div>

      {/* Grid Filter Toolbar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-black/30 border border-cyan-500/10 p-4 rounded-xl mb-6 font-sans">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400/40" />
            <input
              type="text"
              placeholder="Search Memory Matrices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-cyan-950/15 border border-cyan-500/20 rounded text-xs select-text w-full focus:outline-none focus:border-cyan-400 text-cyan-200"
            />
          </div>

          <div className="relative flex items-center gap-1.5 bg-cyan-950/20 border border-cyan-500/10 p-1 rounded-lg w-full sm:w-auto justify-center font-mono text-[9px]">
            <ArrowUpDown size={11} className="text-cyan-400/50" />
            <span className="text-cyan-400/50 uppercase tracking-widest px-0.5 select-none font-bold">SORT BY:</span>
            <div className="relative">
              <button
                id="sort-dropdown-toggle"
                type="button"
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="px-2.5 py-1.5 flex items-center gap-1.5 border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/15 text-cyan-300 font-bold uppercase transition-all shrink-0 cursor-pointer rounded-md focus:outline-none"
              >
                <span>
                  {sortBy === "relevance"
                    ? "Relevance"
                    : sortBy === "date"
                    ? "Creation Date"
                    : "Category Name"}
                </span>
                <span className="text-[7px] text-cyan-400/70 select-none">▼</span>
              </button>

              <AnimatePresence>
                {isSortOpen && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsSortOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 min-w-[140px] bg-[#030712]/95 border border-cyan-500/25 rounded-lg shadow-[0_4px_24px_rgba(0,0,0,0.85)] z-50 overflow-hidden backdrop-blur-md"
                    >
                      {[
                        { id: "relevance", label: "Relevance" },
                        { id: "date", label: "Creation Date" },
                        { id: "category", label: "Category Name" }
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            setSortBy(opt.id as any);
                            setIsSortOpen(false);
                            const logLabels = {
                              relevance: "contextual relevance descending",
                              date: "date created descending",
                              category: "category name alphabetically ascending"
                            };
                            onLogMessage("INFO", `Re-indexed memory core state sorted by ${logLabels[opt.id as "relevance"|"date"|"category"]}.`);
                          }}
                          className={`w-full text-left px-3.5 py-2 hover:bg-cyan-500/10 transition-colors uppercase font-mono tracking-widest text-[8px] last:border-0 border-b border-cyan-500/5 ${
                            sortBy === opt.id
                              ? "text-cyan-300 font-bold bg-cyan-500/10"
                              : "text-gray-400 hover:text-white"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto overflow-x-auto py-1 justify-center sm:justify-start">
          <div className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap">
            {["all", "preference", "task", "system", "personal"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-2.5 py-1 border rounded font-mono text-[9px] uppercase transition-all shrink-0 cursor-pointer ${
                  filterCategory === cat
                    ? "border-cyan-400 bg-cyan-500/10 text-cyan-300 font-bold"
                    : "border-white/5 hover:border-cyan-500/20 text-gray-400"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="h-4 w-[1px] bg-cyan-500/10 hidden sm:block shrink-0"></div>

          <div className="flex items-center gap-1 bg-cyan-950/20 border border-cyan-500/10 p-0.5 rounded-lg shrink-0">
            <button
              type="button"
              onClick={() => {
                setViewMode("grid");
                onLogMessage("INFO", "Shifted synapse memory matrix visualization to Multi-column Holographic Grid.");
              }}
              className={`p-1 rounded cursor-pointer transition-all ${viewMode === "grid" ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30" : "text-gray-400 hover:text-cyan-400 border border-transparent"}`}
              title="Holographic Grid Grid View"
            >
              <LayoutGrid size={11} />
            </button>
            <button
              type="button"
              onClick={() => {
                setViewMode("virtual");
                onLogMessage("CORE", "Activated core High-Performance Virtualized List Engine [react-window: 60 FPS].");
              }}
              className={`p-1 rounded cursor-pointer transition-all ${viewMode === "virtual" ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30" : "text-gray-400 hover:text-cyan-400 border border-transparent"}`}
              title="Virtualized List View"
            >
              <Server size={11} />
            </button>
          </div>
        </div>
      </div>

      {/* CREATE NEW FORM */}
      {isCreating && (
        <form onSubmit={handleCreate} className="p-6 border border-cyan-500/30 bg-black/60 rounded-xl mb-8 space-y-4">
          <h2 className="text-sm font-mono font-bold text-cyan-400 uppercase tracking-widest">[Inject New Semantic Vector]</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono text-cyan-400/50 uppercase mb-1">Synapse Title</label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="e.g., Target Velocity Thresholds"
                className="w-full px-3 py-2 bg-cyan-950/10 border border-cyan-500/20 rounded text-xs select-text focus:outline-none focus:border-cyan-400 text-white font-semibold"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-cyan-400/50 uppercase mb-1">Synaptic Core Category</label>
              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-cyan-950/20 border border-cyan-500/20 rounded text-xs focus:outline-none focus:border-cyan-400 text-cyan-200"
              >
                <option value="preference">PREFERENCE</option>
                <option value="task">TASK</option>
                <option value="system">SYSTEM</option>
                <option value="personal">PERSONAL</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono text-cyan-400/50 uppercase mb-1">Synaptic Memories Content Description</label>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="Store precise context details to let JARVIS integrate seamlessly..."
              rows={4}
              className="w-full px-3 py-2 bg-cyan-950/10 border border-cyan-500/20 rounded text-xs select-text focus:outline-none focus:border-cyan-400 text-white"
              required
            />
          </div>

          <div className="border border-cyan-500/10 bg-cyan-950/5 p-4 rounded-lg space-y-3">
            <label className="block text-[10px] font-mono text-cyan-400/50 uppercase tracking-wider">AI Synaptic Visual schematic</label>
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="w-32 h-32 shrink-0 bg-black/50 border border-cyan-500/20 rounded-lg flex items-center justify-center overflow-hidden relative group/preview">
                {editImageUrl ? (
                  <img
                    src={editImageUrl}
                    alt="Synaptic Schema Preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-2 text-gray-500">
                    <ImageIcon size={24} className="mx-auto text-cyan-500/20 mb-1" />
                    <span className="text-[8px] font-mono uppercase tracking-tight block">No Schema Compiled</span>
                  </div>
                )}
                {generatingImage && (
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-xs flex flex-col items-center justify-center text-center p-1">
                    <Loader2 size={16} className="text-cyan-400 animate-spin mb-1" />
                    <span className="text-[8px] font-mono uppercase tracking-widest text-cyan-400 animate-pulse">COMPILING...</span>
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <p className="text-[10px] text-gray-400 leading-normal">
                  Inject stylized holographic sci-fi vector graphics synthesized dynamically using the 
                  <span className="text-cyan-400 font-mono"> procedural neural SVG</span> model parameters.
                </p>
                <button
                  type="button"
                  id="compile-schematic-button"
                  onClick={handleGenerateImage}
                  disabled={generatingImage}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/35 text-cyan-300 rounded font-mono text-[9px] uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
                >
                  <Sparkles size={11} className={generatingImage ? "animate-spin" : ""} />
                  {generatingImage ? "COMPILING_SYNAPSE_CORE..." : "COMPILE_NEURAL_VISUAL_SCHEMATIC"}
                </button>
              </div>
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
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded text-xs font-mono shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer"
            >
              RECORD_SYNAPSE
            </button>
          </div>
        </form>
      )}

      {/* LIST MEMORIES CARD GRID OR VIRTUAL LIST */}
      {loading ? (
        <div className="text-center py-12 border border-cyan-500/10 rounded-xl font-mono text-xs text-cyan-400 animate-pulse uppercase">
          [Connecting Neural Channel] Querying Synapse Archive Matrices...
        </div>
      ) : viewMode === "virtual" ? (
        <div className="border border-cyan-500/15 bg-black/40 rounded-xl p-4 backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-cyan-500/10 pb-3 mb-3 font-mono text-[9px] text-cyan-400/40 uppercase tracking-widest px-2">
            <span>SYNAPSE RECORD NAME & DETAILS</span>
            <span className="hidden md:inline">INDEXED TIMESTAMP & RELEVANCE</span>
          </div>

          <List
            height={400}
            itemCount={sortedMemories.length}
            itemSize={56}
            width="100%"
          >
            {({ index, style }) => {
              const mem = sortedMemories[index];
              if (!mem) return null;
              
              const isEditing = isEditingId === mem.id;

              return (
                <div style={style} className="py-1 px-1">
                  {isEditing ? (
                    <div className="flex items-center gap-2 bg-cyan-950/40 border border-cyan-400/40 rounded-lg p-1.5 h-full">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="flex-1 min-w-[100px] bg-black/60 border border-cyan-500/30 rounded px-2 py-0.5 text-[10px] text-white font-mono font-semibold focus:outline-none"
                      />
                      <input
                        type="text"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="flex-2 min-w-[160px] bg-black/60 border border-cyan-500/30 rounded px-2 py-0.5 text-[10px] text-gray-300 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => saveEdit(mem.id)}
                        className="px-2 py-1 bg-cyan-500 text-black font-semibold text-[9px] font-mono rounded cursor-pointer shrink-0"
                      >
                        SAVE
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingId(null)}
                        className="px-2 py-1 border border-white/15 text-gray-400 text-[9px] font-mono rounded cursor-pointer shrink-0"
                      >
                        ABORT
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between h-full bg-black/45 hover:bg-cyan-950/15 border border-cyan-500/10 hover:border-cyan-400/30 rounded-lg px-3 transition-all group relative overflow-hidden animate-[fadeIn_0.2s_ease-out]">
                      <div className="flex items-center gap-3 truncate mr-8">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
                        <div className="truncate">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] font-bold text-white uppercase truncate tracking-wider">{mem.title}</span>
                            <span className="text-[7.5px] font-mono text-cyan-400 border border-cyan-500/20 bg-cyan-950/25 px-1 rounded uppercase shrink-0 leading-none py-0.5">{mem.category}</span>
                          </div>
                          <p className="text-[10px] text-gray-400 truncate mt-0.5 font-sans font-light">{mem.content}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0 font-mono text-[9px]">
                        <span className="text-gray-500 hidden sm:inline uppercase">INDEXED: {mem.timestamp}</span>
                        <span className="text-cyan-400 font-bold bg-cyan-500/5 border border-cyan-500/10 px-1.5 py-0.5 rounded shadow-[0_0_8px_rgba(6,182,212,0.05)]">RELEVANCE: {mem.relevance}%</span>
                      </div>

                      {/* virtual list quick actions trigger */}
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity bg-black border border-cyan-500/20 rounded shadow-lg p-0.5">
                        <button
                          onClick={() => startEdit(mem)}
                          className="p-1 text-cyan-400 hover:text-cyan-300 transition-all cursor-pointer"
                          title="Edit Synapse"
                        >
                          <Edit3 size={10} />
                        </button>
                        <button
                          onClick={() => handleDelete(mem.id)}
                          className="p-1 text-gray-400 hover:text-red-400 transition-all cursor-pointer"
                          title="Prune Synapse"
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            }}
          </List>

          {sortedMemories.length === 0 && (
            <div className="text-center py-8 font-mono text-xs text-gray-500 uppercase">
              NO CORRESPONDING SYNAPSES MAPPED IN ACTIVE CONTEXT
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {sortedMemories.map((mem, index) => {
              const isEditing = isEditingId === mem.id;
              return (
                <motion.div
                  key={mem.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ 
                    duration: 0.45, 
                    ease: "easeOut",
                    delay: Math.min(index * 0.04, 0.4) 
                  }}
                  layout
                  className="p-5 bg-black/45 border border-cyan-500/15 hover:border-cyan-500/30 rounded-xl backdrop-blur-md relative overflow-hidden group transition-all"
                >
                {isEditing ? (
                  // Editing view inside the card
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-2 py-1 bg-cyan-950/25 border border-cyan-500/40 rounded text-xs select-text text-white font-mono font-bold"
                    />
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value as any)}
                      className="w-full px-2 py-1 bg-cyan-950/30 border border-cyan-500/30 rounded text-xs text-cyan-200"
                    >
                      <option value="preference">PREFERENCE</option>
                      <option value="task">TASK</option>
                      <option value="system">SYSTEM</option>
                      <option value="personal">PERSONAL</option>
                    </select>
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full px-2 py-1 bg-cyan-950/25 border border-cyan-500/40 rounded text-xs select-text text-gray-300"
                      rows={3}
                    />

                    {/* Inline Image Control for Edits */}
                    <div className="border border-cyan-500/10 p-2.5 bg-black/40 rounded-lg flex items-center gap-3">
                      <div className="w-12 h-12 shrink-0 bg-black/60 border border-cyan-500/20 rounded overflow-hidden relative">
                        {editImageUrl ? (
                          <img
                            src={editImageUrl}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                            alt="Synaptic thumbnail preview"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-cyan-500/30">
                            <ImageIcon size={14} />
                          </div>
                        )}
                        {generatingImage && (
                          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                            <Loader2 size={12} className="text-cyan-400 animate-spin" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <span className="text-[8px] font-mono text-cyan-400/50 uppercase tracking-widest block mb-1">Schematic Visual Matrix</span>
                        <button
                          type="button"
                          onClick={handleGenerateImage}
                          disabled={generatingImage}
                          className="px-2 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-[8px] font-mono rounded text-cyan-300 disabled:opacity-50 flex items-center gap-1 cursor-pointer"
                        >
                          <Sparkles size={8} className={generatingImage ? "animate-spin" : ""} />
                          {generatingImage ? "COMPILING..." : "RECOMPILE_VISUAL"}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsEditingId(null)}
                        className="px-2.5 py-1 border border-white/10 text-[10px] font-mono rounded cursor-pointer"
                      >
                        ABORT
                      </button>
                      <button
                        type="button"
                        onClick={() => saveEdit(mem.id)}
                        className="px-2.5 py-1 bg-cyan-500 text-black font-semibold text-[10px] font-mono rounded flex items-center gap-1 cursor-pointer"
                      >
                        <Save size={10} /> SAVE
                      </button>
                    </div>
                  </div>
                ) : (
                  // standard display view
                  <>
                    <div className="flex items-start justify-between mb-3 border-b border-cyan-500/10 pb-2">
                      <div className="flex items-center gap-2">
                        <Bookmark size={14} className="text-cyan-400 shrink-0" />
                        <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wide truncate max-w-[12rem]">{mem.title}</h3>
                      </div>
                      <span className="px-1.5 py-0.5 bg-cyan-500/10 border border-cyan-500/20 text-[8px] font-mono text-cyan-300 rounded uppercase">
                        {mem.category}
                      </span>
                    </div>

                    {/* Integrated Synapse Schematic Visual */}
                    {mem.imageUrl && (
                      <div className="w-full h-36 mb-4 bg-black/60 border border-cyan-500/15 rounded-lg overflow-hidden relative group-hover:border-cyan-500/35 transition-colors">
                        <img
                          src={mem.imageUrl}
                          alt={mem.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover opacity-75 group-hover:opacity-100 transition-opacity"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-transparent flex items-end p-2 md:p-3">
                          <span className="text-[8px] font-mono text-cyan-400 uppercase tracking-widest bg-black/80 px-1.5 py-0.5 rounded border border-cyan-500/10 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                            SCHEMATIC COGNITIVE MAP ACTIVE
                          </span>
                        </div>
                      </div>
                    )}

                    <p className="text-xs text-gray-400 font-sans leading-relaxed min-h-[4rem] mb-4">
                      {mem.content}
                    </p>

                    <div className="flex items-center justify-between mt-4 text-[9px] font-mono text-gray-500">
                      <span>INDEXED: {mem.timestamp}</span>
                      <span className="text-cyan-400 font-bold">RELEVANCE: {mem.relevance}%</span>
                    </div>

                    {/* Actions Float Trigger */}
                    <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => startEdit(mem)}
                        className="p-1.5 hover:bg-white/5 text-cyan-400 hover:text-cyan-300 rounded transition-all cursor-pointer"
                        title="Update memory parameters"
                      >
                        <Edit3 size={11} />
                      </button>
                      <button
                        onClick={() => handleDelete(mem.id)}
                        className="p-1.5 hover:bg-white/5 text-gray-400 hover:text-red-400 rounded transition-all cursor-pointer"
                        title="Prune memory"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            );
          })}
          </AnimatePresence>

          {sortedMemories.length === 0 && (
            <div className="md:col-span-2 text-center py-12 border border-cyan-500/10 rounded-xl font-mono text-xs text-gray-500">
              NO CORRESPONDING SYNAPSES MAPPED IN ACTIVE CONTEXT
            </div>
          )}
        </div>
      )}
    </div>
  );
}
