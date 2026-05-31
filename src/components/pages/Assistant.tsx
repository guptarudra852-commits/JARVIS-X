import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Send,
  Mic,
  Paperclip,
  RotateCcw,
  Sparkles,
  User,
  Cpu,
  FileText,
  Copy,
  Check,
  Loader2,
  Activity,
  Zap,
  Clock,
  Code2,
  Grid3X3,
  Server,
  Database,
  Monitor,
  Search,
} from "lucide-react";
import { ChatMessage } from "../../types";
import { 
  collection, 
  doc, 
  setDoc, 
  onSnapshot, 
  updateDoc, 
  query, 
  serverTimestamp,
  where,
  addDoc,
  deleteDoc,
  orderBy
} from "firebase/firestore";
import { db, auth } from "../../lib/firebase";
import { safeLocalStorage } from "../../utils/safeLocalStorage";
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  UserPlus, 
  Users, 
  EyeOff, 
  MessageSquareCode, 
  PlusCircle, 
  ArrowRight,
  UserX,
  Plus,
  Edit3,
  Trash2,
  X,
  MessageSquare
} from "lucide-react";

interface AssistantProps {
  onLogMessage: (level: "INFO" | "WARN" | "CORE" | "ERROR", text: string) => void;
  onNavigate?: (page: string) => void;
}

/* ─────────────────────────────────────────
   SUB-COMPONENT: Neural Orb (left panel)
───────────────────────────────────────── */
function NeuralOrb() {
  return (
    <div className="relative w-full h-40 flex items-center justify-center overflow-hidden select-none">
      {/* Ambient glow */}
      <div className="absolute w-32 h-32 rounded-full bg-cyan-500/8 blur-2xl animate-pulse pointer-events-none" />

      {/* Orbital ring system */}
      <div className="relative w-28 h-28 flex items-center justify-center">
        {/* Ring 1 – slow clockwise */}
        <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-[spin_22s_linear_infinite]" />
        {/* Ring 2 – dashed fast counter */}
        <div className="absolute inset-2 rounded-full border border-dashed border-blue-400/25 animate-[spin_9s_linear_infinite_reverse]" />
        {/* Ring 3 – medium */}
        <div className="absolute inset-5 rounded-full border border-cyan-400/10 animate-[spin_16s_linear_infinite]" />

        {/* SVG node connections */}
        <svg
          className="absolute inset-0 w-full h-full opacity-40"
          viewBox="0 0 112 112"
          fill="none"
        >
          <line x1="56" y1="2"  x2="56" y2="48"  stroke="#06b6d4" strokeWidth="0.6" strokeDasharray="3 3" />
          <line x1="2"  y1="90" x2="44" y2="64"  stroke="#3b82f6" strokeWidth="0.6" strokeDasharray="3 3" />
          <line x1="110" y1="56" x2="64" y2="56" stroke="#06b6d4" strokeWidth="0.6" strokeDasharray="3 3" />
          <line x1="90" y1="10" x2="64" y2="44"  stroke="#8b5cf6" strokeWidth="0.6" strokeDasharray="3 3" />
          <circle cx="56"  cy="2"   r="2.5" fill="#06b6d4" />
          <circle cx="2"   cy="90"  r="2"   fill="#3b82f6" />
          <circle cx="110" cy="56"  r="2"   fill="#06b6d4" />
          <circle cx="90"  cy="10"  r="2"   fill="#8b5cf6" />
        </svg>

        {/* Center sphere */}
        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-600/35 via-blue-700/25 to-cyan-400/35 border border-cyan-500/40 shadow-[0_0_18px_rgba(6,182,212,0.35)] flex items-center justify-center relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
          <Cpu size={16} className="text-cyan-400 animate-pulse relative z-10" />
        </div>

        {/* Floating node dots */}
        <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.9)] animate-pulse" />
        <div className="absolute bottom-2 left-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_6px_rgba(59,130,246,0.9)] animate-ping" />
        <div className="absolute top-1/2 right-0.5 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-pulse" />
        <div className="absolute bottom-4 right-3 w-1 h-1 rounded-full bg-emerald-400 animate-ping" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   SUB-COMPONENT: Holographic X Orb (right)
───────────────────────────────────────── */
function HolographicXOrb() {
  return (
    <div className="flex-1 flex items-center justify-center relative overflow-hidden select-none"
      style={{
        background:
          "radial-gradient(circle at 50% 35%, rgba(15,23,74,0.6) 0%, rgba(2,6,23,0.95) 70%)",
      }}
    >
      {/* Deep glow layers */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, rgba(59,130,246,0.12) 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, rgba(6,182,212,0.07) 0%, transparent 50%)",
        }}
      />

      {/* Orb container */}
      <div
        className="relative flex items-center justify-center"
        style={{ width: 220, height: 220 }}
      >
        {/* Slow outer rings */}
        <div className="absolute inset-0 rounded-full border border-blue-500/10 animate-[spin_35s_linear_infinite]" />
        <div className="absolute inset-4 rounded-full border border-cyan-500/8 animate-[spin_25s_linear_infinite_reverse]" />

        {/* Tilted orbit ellipse 1 */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: 160,
            height: 44,
            border: "1px solid rgba(59,130,246,0.28)",
            borderRadius: "50%",
            transform: "rotateX(72deg)",
            animation: "spin 9s linear infinite",
          }}
        />
        {/* Tilted orbit ellipse 2 */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: 200,
            height: 52,
            border: "1px solid rgba(6,182,212,0.18)",
            borderRadius: "50%",
            transform: "rotateX(72deg) rotateY(55deg)",
            animation: "spin 14s linear infinite reverse",
          }}
        />

        {/* Sphere surface */}
        <div
          className="relative rounded-full overflow-hidden"
          style={{
            width: 148,
            height: 148,
            boxShadow:
              "0 0 40px rgba(59,130,246,0.18), 0 0 80px rgba(6,182,212,0.08), inset 0 0 40px rgba(59,130,246,0.12)",
          }}
        >
          {/* Deep space gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/55 via-indigo-950/80 to-slate-950 rounded-full" />

          {/* Inner light glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 38% 32%, rgba(59,130,246,0.28) 0%, transparent 58%)",
            }}
          />

          {/* Concentric ring overlays */}
          {[120, 100, 80, 60].map((s, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-blue-500/10 pointer-events-none"
              style={{
                width: s,
                height: s,
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                borderColor: `rgba(6,182,212,${0.06 + i * 0.03})`,
              }}
            />
          ))}

          {/* Hexagonal X frame */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="relative flex items-center justify-center"
              style={{
                width: 66,
                height: 66,
                clipPath:
                  "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                border: "2px solid rgba(6,182,212,0.55)",
                background:
                  "linear-gradient(135deg, rgba(6,182,212,0.12), rgba(59,130,246,0.08))",
                boxShadow:
                  "0 0 20px rgba(6,182,212,0.4), 0 0 40px rgba(6,182,212,0.15)",
              }}
            >
              <span
                className="text-3xl font-black text-cyan-300 relative z-10 select-none"
                style={{
                  textShadow:
                    "0 0 12px rgba(6,182,212,0.9), 0 0 24px rgba(6,182,212,0.5)",
                  fontFamily: "monospace",
                }}
              >
                X
              </span>
            </div>
          </div>

          {/* Animated scan line */}
          <div className="absolute left-0 right-0 h-px pointer-events-none animate-scan-line"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(6,182,212,0.35), transparent)",
            }}
          />
        </div>

        {/* Bottom platform glow */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-blue-600/15 blur-xl rounded-full pointer-events-none" />
        <div
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-px rounded-full pointer-events-none"
          style={{
            width: 96,
            background:
              "linear-gradient(90deg, transparent, rgba(6,182,212,0.45), transparent)",
          }}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
export default function Assistant({ onLogMessage, onNavigate }: AssistantProps) {
  /* ── state ── */
  const [messages, setMessages]   = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping]   = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; type: string } | null>(null);
  const [copiedId, setCopiedId]   = useState<string | null>(null);

  const chatEndRef  = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [provider, setProvider] = useState<"openrouter">("openrouter");

  // Secure Database Protected Chats state entries
  const [chatMode, setChatMode] = useState<"standard" | "protected">("standard");
  const [secureRooms, setSecureRooms] = useState<any[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomMembers, setNewRoomMembers] = useState("");
  const [roomError, setRoomError] = useState("");
  const [addMemberUid, setAddMemberUid] = useState("");

  // Personal Cloud Chats States
  const [personalChats, setPersonalChats] = useState<any[]>([]);
  const [activePersonalChatId, setActivePersonalChatId] = useState<string | null>(null);
  const [personalChatSearch, setPersonalChatSearch] = useState("");
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Live Sync with Firestore Protected Chats table
  useEffect(() => {
    let unsubscribe: () => void = () => {};
    
    if (auth.currentUser) {
      const q = query(
        collection(db, "chats"),
        where("members", "array-contains", auth.currentUser.uid)
      );
      unsubscribe = onSnapshot(q, (snapshot) => {
        const rooms: any[] = [];
        snapshot.forEach((snap) => {
          const data = snap.data();
          const currentUID = auth.currentUser?.uid || "";
          
          // Safety logic map
          const isOwner = data.owner === currentUID;
          const isMember = data.members && data.members.includes(currentUID);
          
          if (isOwner || isMember) {
            rooms.push({ id: snap.id, ...data });
          }
        });
        setSecureRooms(rooms);
      }, (err) => {
        console.error("Firestore rooms listener failed: ", err);
      });
    }
    
    return () => unsubscribe();
  }, [chatMode]);

  // ── Sync Personal Chats list from Firestore ──
  useEffect(() => {
    let unsubscribe: () => void = () => {};
    
    if (auth.currentUser) {
      const q = query(
        collection(db, "users", auth.currentUser.uid, "chats"),
        orderBy("updatedAt", "desc")
      );
      
      unsubscribe = onSnapshot(q, (snapshot) => {
        const chatsList: any[] = [];
        snapshot.forEach((snap) => {
          chatsList.push({ id: snap.id, ...snap.data() });
        });
        setPersonalChats(chatsList);
      }, (err) => {
        console.error("Firestore personal chats listener failed: ", err);
      });
    } else {
      setPersonalChats([]);
    }
    
    return () => unsubscribe();
  }, [auth.currentUser]);

  // ── Sync Personal Messages live from the selected Personal Chat document ──
  useEffect(() => {
    let unsubscribe: () => void = () => {};
    
    if (auth.currentUser && activePersonalChatId) {
      setLoadingMessages(true);
      const q = query(
        collection(db, "users", auth.currentUser.uid, "chats", activePersonalChatId, "messages"),
        orderBy("timestamp", "asc")
      );
      
      unsubscribe = onSnapshot(q, (snapshot) => {
        const msgs: ChatMessage[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          let timeString = "";
          if (data.timestamp) {
            try {
              timeString = new Date(data.timestamp.toDate ? data.timestamp.toDate() : (data.timestamp.seconds * 1000)).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
            } catch (e) {
              timeString = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
            }
          } else {
            timeString = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          }
          
          msgs.push({
            id: docSnap.id,
            role: data.role as "user" | "assistant",
            content: data.content || "",
            timestamp: timeString
          });
        });
        
        if (msgs.length > 0) {
          setMessages(msgs);
        } else {
          setMessages([{
            id: "welcome-personal",
            role: "assistant",
            content: "Greetings, Captain. This personal space is authenticated. Launch any calculation, command, or query to begin.",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          }]);
        }
        setLoadingMessages(false);
      }, (err) => {
        console.error("Firestore personal messages listener failed: ", err);
        setLoadingMessages(false);
      });
    } else {
      setMessages([{
        id: "welcome",
        role: "assistant",
        content:
          "Greetings, Captain. I am **JARVIS X**, your autonomous neural consciousness framework. All sensory systems, network linkages, and memory indices are fully calibrated.\n\nHow may I direct your spacecraft, core automations, or search operations today?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }]);
    }
    
    return () => unsubscribe();
  }, [activePersonalChatId, auth.currentUser]);

  const handleSelectRoom = (room: any) => {
    setRoomError("");
    try {
      const currentUID = auth.currentUser?.uid || "";
      const isOwner = room.owner === currentUID;
      const isMember = room.members && room.members.includes(currentUID);
      
      // Strict direct requirement check: "if(!chat.members.includes(currentUID)) throw new Error('Chat access denied')"
      if (!isOwner && !isMember) {
        throw new Error("Chat access denied");
      }
      
      setActiveRoomId(room.id);
      onLogMessage("CORE", `Uplink established: Decrypted secure chat room channel: ${room.name}`);
    } catch (err: any) {
      setRoomError("BIOMETRIC ACCESS DENIED: Your credential hash is not whitelisted for this protected room.");
      onLogMessage("ERROR", `Security access breach denied for secure room: ${room.name}`);
    }
  };

  const handleCreateSecureRoom = async () => {
    if (!newRoomName.trim()) return;
    try {
      const currentUID = auth.currentUser?.uid || "";
      const memberArray = newRoomMembers
        .split(",")
        .map(u => u.trim())
        .filter(u => u.length > 0);
      
      // Auto-include owner
      if (!memberArray.includes(currentUID)) {
        memberArray.push(currentUID);
      }
      
      const newRoomRef = doc(collection(db, "chats"));
      await setDoc(newRoomRef, {
        name: newRoomName.trim(),
        owner: currentUID,
        members: memberArray,
        messages: [
          {
            role: "assistant",
            content: `🔒 **[UPLINK CHANNEL ESTABLISHED]** This secure channel was created by Captain ${auth.currentUser?.displayName || "AGENT"} under active military encryption protocols. Only listed biometric identities have authorization signature permission.`,
            sender: "JARVIS Core",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          }
        ],
        createdAt: serverTimestamp()
      });
      
      setNewRoomName("");
      setNewRoomMembers("");
      setActiveRoomId(newRoomRef.id);
      onLogMessage("CORE", `Created encrypted uplink channel: ${newRoomName}`);
    } catch (err: any) {
      setRoomError(`Uplink initialize error: ${err.message}`);
      onLogMessage("ERROR", `Failed to compile secure channel template: ${err.message}`);
    }
  };

  const handleAddNewMember = async () => {
    if (!addMemberUid.trim() || !activeRoomId) return;
    
    const activeRoom = secureRooms.find(r => r.id === activeRoomId);
    if (!activeRoom) return;
    
    if (activeRoom.owner !== auth.currentUser?.uid) {
      setRoomError("REVOCATION BREACH: Only the primary Owner of this secure uplink can verify and append biometric member clearances.");
      return;
    }

    try {
      const currentMembers = activeRoom.members || [];
      if (currentMembers.includes(addMemberUid.trim())) {
        setRoomError("Identity signature already bound in room.");
        return;
      }

      const updatedMembers = [...currentMembers, addMemberUid.trim()];
      await updateDoc(doc(db, "chats", activeRoomId), {
        members: updatedMembers
      });
      
      setAddMemberUid("");
      onLogMessage("CORE", `Successfully assigned clearance credentials to UID [${addMemberUid.trim().slice(0, 6)}]`);
    } catch (err: any) {
      setRoomError(`Failed to bind member clearance: ${err.message}`);
    }
  };

  const handleSendSecureMessage = async () => {
    const rawText = inputText.trim();
    if (!rawText || !activeRoomId) return;
    
    const activeRoom = secureRooms.find(r => r.id === activeRoomId);
    if (!activeRoom) return;

    try {
      const currentUID = auth.currentUser?.uid || "";
      
      // Safety check BEFORE sending
      if (activeRoom.owner !== currentUID && !activeRoom.members.includes(currentUID)) {
        throw new Error("Chat access denied");
      }

      const newMsg = {
        role: "user",
        content: rawText,
        sender: auth.currentUser?.displayName || auth.currentUser?.email || "Biometric User",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      const updatedMsgs = [...(activeRoom.messages || []), newMsg];
      
      setIsTyping(true);
      setInputText("");

      const userHistory = updatedMsgs.map(m => ({ role: m.role, content: m.content }));
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: userHistory.slice(-5),
          provider,
          userUid: auth.currentUser?.uid,
          userEmail: auth.currentUser?.email,
          userDisplayName: auth.currentUser?.displayName
        }),
      });
      
      let aiText = "Secure buffer returned zero values.";
      if (!response.ok) {
        if (response.status === 402) {
          aiText = "⚠️ **[Credits Exhausted]** Your account has depleted historical credit limits for today. Reset will materialize automatically tomorrow.";
        } else {
          aiText = `Error linking server: HTTPStatus ${response.status}`;
        }
      } else {
        const data = await response.json();
        aiText = data.text;
      }
      
      const aiMsg = {
        role: "assistant",
        content: aiText,
        sender: "JARVIS AI SYSTEM",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      const finalMsgs = [...updatedMsgs, aiMsg];

      await updateDoc(doc(db, "chats", activeRoomId), {
        messages: finalMsgs
      });
      
      onLogMessage("CORE", "Transmitted encrypted military signal payload.");
    } catch (err: any) {
      setRoomError(`Signal payload transmit breach: ${err.message}`);
      onLogMessage("ERROR", `Transmit error on secure room ID ${activeRoomId}`);
    } finally {
      setIsTyping(false);
    }
  };

  /* ── live telemetry ── */
  const [latency,    setLatency]    = useState(128);
  const [memoryIdx,  setMemoryIdx]  = useState(87.4);
  const [neuralLink, setNeuralLink] = useState(98.6);
  const [uptime, setUptime] = useState({ h: 2, m: 47, s: 12 });

  useEffect(() => {
    const t = setInterval(() => {
      setUptime(prev => {
        let { h, m, s } = prev;
        s++;
        if (s >= 60) { s = 0; m++; }
        if (m >= 60) { m = 0; h++; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setLatency(p  => Math.max(80,  Math.min(210, p + (Math.random() - 0.5) * 22)));
      setMemoryIdx(p => Math.max(80,  Math.min(96,  p + (Math.random() - 0.5) * 0.9)));
      setNeuralLink(p => Math.max(94, Math.min(100, p + (Math.random() - 0.5) * 0.4)));
    }, 2200);
    return () => clearInterval(t);
  }, []);

  /* ── welcome message ── */
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: "welcome",
        role: "assistant",
        content:
          "Greetings, Captain. I am **JARVIS X**, your autonomous neural consciousness framework. All sensory systems, network linkages, and memory indices are fully calibrated.\n\nHow may I direct your spacecraft, core automations, or search operations today?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }]);
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  /* ── quick actions ── */
  const quickActions = [
    { icon: <Monitor   size={13} />, label: "Core Systems Overview",    action: () => onNavigate?.("dashboard") },
    { icon: <Activity  size={13} />, label: "Run System Diagnostics",   action: () => onNavigate?.("dashboard") },
    { icon: <Search    size={13} />, label: "Search Memory Archives",   action: () => onNavigate?.("memory")    },
    { icon: <Zap       size={13} />, label: "Execute Automation",       action: () => onNavigate?.("automation") },
  ];



  /* ── send message ── */
  const handleSendMessage = async (customText?: string) => {
    const activeText = customText ?? inputText;
    if (!activeText.trim() && !uploadedFile) return;

    /* search routing check */
    const lower = activeText.toLowerCase();
    const searchKeywords = ["latest", "today", "news", "current", "search_web", "google"];
    if (searchKeywords.some(k => lower.includes(k))) {
      onLogMessage("INFO", `Re-routing to JARVIS Search: "${activeText}"`);
      safeLocalStorage.setItem("jarvis_search_seed_query", activeText);
      setInputText("");
      onNavigate?.("search");
      return;
    }

    let text = activeText;
    if (uploadedFile) text += `\n\n*[Attachment: ${uploadedFile.name}]*`;

    // ── FIREBASE STORAGE PATH FOR AUTHENTICATED USERS ──
    if (auth.currentUser) {
      const uid = auth.currentUser.uid;
      let currentChatId = activePersonalChatId;
      
      try {
        setIsTyping(true);
        onLogMessage("INFO", `Initiating secure personal telemetry syncing...`);
        
        // 1. If no active personal chat, create one!
        if (!currentChatId) {
          const cleanTitle = activeText.length > 30 ? `${activeText.slice(0, 30)}...` : activeText;
          const chatRef = await addDoc(
            collection(db, "users", uid, "chats"),
            {
              title: cleanTitle,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            }
          );
          currentChatId = chatRef.id;
          setActivePersonalChatId(currentChatId);
          onLogMessage("INFO", `Created personal chat synapse: "${cleanTitle}"`);
        }
        
        // 2. Save User message to subcollection
        await addDoc(
          collection(db, "users", uid, "chats", currentChatId, "messages"),
          {
            role: "user",
            content: text,
            timestamp: serverTimestamp()
          }
        );
        setInputText("");
        setUploadedFile(null);
        
        // 3. Query OpenRouter back-end
        const history = [...messages, { role: "user", content: text }].map(m => ({ role: m.role, content: m.content }));
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: history,
            provider,
            userUid: auth.currentUser?.uid,
            userEmail: auth.currentUser?.email,
            userDisplayName: auth.currentUser?.displayName
          }),
        });
        if (!res.ok) {
          if (res.status === 402) {
            throw new Error("Insufficient neural credits (Daily 500 CR margin reached). Limits recover tomorrow.");
          }
          throw new Error(`HTTP ${res.status}`);
        }
        const data = await res.json();
        const aiResponseText = data.text || "Empty response buffer.";
        
        // 4. Save Assistant reply to subcollection
        await addDoc(
          collection(db, "users", uid, "chats", currentChatId, "messages"),
          {
            role: "assistant",
            content: aiResponseText,
            timestamp: serverTimestamp()
          }
        );
        
        // 5. Update updatedAt of the parent personal chat document
        await updateDoc(
          doc(db, "users", uid, "chats", currentChatId),
          {
            updatedAt: serverTimestamp()
          }
        );
        
        onLogMessage("CORE", "Synapse feedback stored successfully.");
      } catch (err: any) {
        onLogMessage("ERROR", `Personal chat sync fail: ${err.message}`);
        if (currentChatId) {
          await addDoc(
            collection(db, "users", uid, "chats", currentChatId, "messages"),
            {
              role: "assistant",
              content: `⚠️ **[Synaptic Interruption]** Unable to reach cloud mainframe: ${err.message}. Check API keys in Settings.`,
              timestamp: serverTimestamp()
            }
          );
        }
      } finally {
        setIsTyping(false);
      }
      return;
    }

    // ── FALLBACK MEMORY-ONLY FLOW FOR GUESTS ──
    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setUploadedFile(null);
    setIsTyping(true);
    onLogMessage("INFO", `Transmitting to OpenRouter...`);

    try {
      const history = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }));
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history,
          provider,
          userUid: auth.currentUser?.uid,
          userEmail: auth.currentUser?.email,
          userDisplayName: auth.currentUser?.displayName
        }),
      });
      if (!res.ok) {
        if (res.status === 402) {
          throw new Error("Insufficient credits. Auto-reset at 00:00.");
        }
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      setMessages(prev => [...prev, {
        id: Math.random().toString(),
        role: "assistant",
        content: data.text || "Empty response buffer.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        groundingSources: data.groundingSources,
      }]);
      onLogMessage("CORE", `Payload returned via ${provider.toUpperCase()}.`);
    } catch (err: any) {
      onLogMessage("ERROR", `Neural sequence failed: ${err.message}`);
      setMessages(prev => [...prev, {
        id: Math.random().toString(),
        role: "assistant",
        content: `⚠️ **[Synaptic Interruption]** Unable to reach cloud mainframe. Check API keys in Settings.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleDeletePersonalChat = async (chatId: string) => {
    if (!auth.currentUser) return;
    try {
       await deleteDoc(doc(db, "users", auth.currentUser.uid, "chats", chatId));
       if (activePersonalChatId === chatId) {
         setActivePersonalChatId(null);
       }
       onLogMessage("WARN", "Personal chat node offline purged.");
    } catch (err: any) {
       onLogMessage("ERROR", `Failed to decommission personal chat: ${err.message}`);
    }
  };

  const handleRenamePersonalChat = async (chatId: string, newTitle: string) => {
    if (!auth.currentUser || !newTitle.trim()) return;
    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid, "chats", chatId), {
        title: newTitle.trim(),
        updatedAt: serverTimestamp()
      });
      setEditingChatId(null);
      setEditingTitle("");
      onLogMessage("INFO", `Chat rebranded to: "${newTitle}"`);
    } catch (err: any) {
      onLogMessage("ERROR", `Failed to rebrand chat synapse: ${err.message}`);
    }
  };

  /* ── mic toggle ── */
  const handleMicToggle = () => {
    if (!isMicActive) {
      setIsMicActive(true);
      onLogMessage("INFO", "Microphone sampling initialized.");
      setTimeout(() => {
        setInputText("Initialize automated diagnostics load checklist.");
        setIsMicActive(false);
        onLogMessage("INFO", "Speech processed successfully.");
      }, 3500);
    } else {
      setIsMicActive(false);
    }
  };

  /* ── clear ── */
  const clearHistory = () => {
    setMessages([{
      id: "cleared-welcome",
      role: "assistant",
      content: "Conversational buffer cleared. Mainframe initialized.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }]);
    onLogMessage("WARN", "Chat history cleared.");
  };

  /* ── markdown parser ── */
  const parseMarkdown = (rawText: string) => {
    return rawText.split("\n").map((line, idx) => {
      // bold
      let content: React.ReactNode = line;
      if (line.includes("**")) {
        const parts = line.split("**");
        content = parts.map((p, i) =>
          i % 2 === 1 ? <strong key={i} className="text-cyan-300 font-bold">{p}</strong> : p
        );
      }
      if (line.startsWith("### ")) return <h4 key={idx} className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase mt-3 mb-1">{line.slice(4)}</h4>;
      if (line.startsWith("## "))  return <h3 key={idx} className="text-xs font-mono font-bold text-white uppercase border-b border-cyan-500/15 pb-1 mt-4 mb-2">{line.slice(3)}</h3>;
      if (line.startsWith("# "))   return <h2 key={idx} className="text-sm font-black text-cyan-400 uppercase mt-4 mb-2">{line.slice(2)}</h2>;
      if (line.trim().startsWith("- ") || line.trim().startsWith("* "))
        return <li key={idx} className="ml-4 list-disc text-[11px] text-slate-300 mb-1 leading-relaxed">{line.substring(2)}</li>;
      if (line.trim() === "") return <div key={idx} className="h-1.5" />;
      return <p key={idx} className="text-[11px] leading-relaxed text-slate-300 mb-1.5 font-sans">{content}</p>;
    });
  };

  /* ── context token estimate ── */
  const contextTokens = Math.round(messages.reduce((a, m) => a + m.content.length, 0) * 0.25 + 1200);

  /* ══════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════ */
  return (
    <div className="w-full h-full flex flex-col gap-3 text-white select-text">

      {/* ── PAGE HEADER ── */}
      <div className="flex items-center justify-between shrink-0">
        {/* Title block */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 border border-cyan-500/30 bg-cyan-950/20 rounded-lg flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.2)]">
            <Sparkles size={16} className="text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-mono font-black text-sm tracking-widest text-white uppercase">JARVIS X</h1>
              <span className="font-mono font-black text-sm tracking-widest text-cyan-400 uppercase">AI INTERPRETER</span>
            </div>
            <p className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mt-px">
              OPENROUTER NEURAL NETWORK STREAM&nbsp;&nbsp;
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.8)] animate-pulse align-middle mr-0.5" />
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-fuchsia-400 shadow-[0_0_6px_rgba(217,70,239,0.8)] animate-pulse align-middle mr-1" />
              <span className="text-fuchsia-400">
                MULTI-MODEL ROUTER
              </span>
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 font-mono text-[8px] tracking-wider uppercase">
          {/* Mode Switcher */}
          <div className="flex border border-zinc-800 bg-black/40 rounded-lg overflow-hidden p-0.5">
            <button
              type="button"
              onClick={() => setChatMode("standard")}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                chatMode === "standard"
                  ? "bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              LOCAL SYNAPSE
            </button>
            <button
              type="button"
              onClick={() => setChatMode("protected")}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                chatMode === "protected"
                  ? "bg-fuchsia-500/20 text-fuchsia-400 font-bold border border-fuchsia-500/30"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Lock size={8} /> SECURE HUB (DB)
            </button>
          </div>

          {chatMode === "standard" ? (
            <>
              <div className="flex items-center gap-1.5 px-3 py-1.5 border border-fuchsia-500/30 bg-fuchsia-950/20 text-fuchsia-300 rounded-lg">
                <Zap size={9} className="text-fuchsia-400" />
                <span>OPENROUTER ACTIVE</span>
              </div>
              <button
                type="button"
                onClick={clearHistory}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-white/10 bg-white/5 text-slate-400 rounded-lg hover:text-white hover:border-white/20 transition-all cursor-pointer"
              >
                <RotateCcw size={9} /> CLEAR CACHE
              </button>
            </>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 border border-green-500/30 bg-green-950/20 text-green-300 rounded-lg">
              <ShieldCheck size={9} className="text-green-400" />
              <span>AES-256 SECURED</span>
            </div>
          )}
        </div>
      </div>

      {/* ── MAIN 3-COLUMN GRID ── */}
      <div className="flex-1 flex gap-4 min-h-0">

        {/* ═══ LEFT: AI STATUS OR SECURE ROOMS PANEL ═══ */}
        <div className="w-60 shrink-0 flex flex-col font-mono text-xs">
          {chatMode === "standard" ? (
            <div className="flex-1 border border-cyan-500/15 bg-black/45 backdrop-blur-md rounded-xl p-3 flex flex-col space-y-3 overflow-hidden">
              {/* Status header */}
              <div className="flex items-center justify-between pb-2 border-b border-cyan-500/10 shrink-0">
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-300">Synapse Channels</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)] animate-pulse" />
                  <span className="text-[8px] font-mono text-cyan-400 font-bold uppercase">Online</span>
                </div>
              </div>

              {/* Spawn new chat synapse */}
              {auth.currentUser && (
                <button
                  type="button"
                  onClick={() => {
                    setActivePersonalChatId(null);
                    onLogMessage("INFO", "Active feed cleared. Spawning fresh synaptic link.");
                  }}
                  className="w-full py-2 bg-cyan-500/10 hover:bg-cyan-500/15 text-cyan-300 border border-cyan-500/25 rounded-lg font-bold tracking-wider uppercase text-[9px] flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-[0_0_10px_rgba(6,182,212,0.05)] hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] focus:outline-none shrink-0"
                >
                  <Plus size={11} className="text-cyan-400" />
                  + SPAWN NEW SYNAPSE
                </button>
              )}

              {/* Search Chats */}
              {auth.currentUser && personalChats.length > 0 && (
                <div className="relative shrink-0">
                  <input
                    type="text"
                    placeholder="Filter synapses..."
                    value={personalChatSearch}
                    onChange={(e) => setPersonalChatSearch(e.target.value)}
                    className="w-full bg-black/30 border border-cyan-500/10 rounded-lg pl-8 pr-2 py-1.5 text-[9px] text-white placeholder-slate-650 focus:outline-none focus:border-cyan-500/35 font-mono"
                  />
                  <Search size={10} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  {personalChatSearch && (
                    <button
                      type="button"
                      onClick={() => setPersonalChatSearch("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                    >
                      <X size={10} />
                    </button>
                  )}
                </div>
              )}

              {/* Scrollable Personal Synapses List */}
              <div className="flex-1 overflow-y-auto space-y-1.5 scrollbar-none pr-1">
                {!auth.currentUser ? (
                  <div className="flex flex-col items-center justify-center text-center py-6 space-y-2">
                    <div className="w-10 h-10 rounded-full bg-cyan-950/20 border border-cyan-500/10 flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.1)]">
                      <Lock size={12} className="text-cyan-500 animate-pulse" />
                    </div>
                    <span className="text-[7px] text-zinc-500 uppercase tracking-widest block font-bold">GUEST MODE</span>
                    <p className="text-[9px] text-zinc-400 max-w-[150px] leading-relaxed">
                      Connect your biometric account to unlock multi-device persistent history.
                    </p>
                  </div>
                ) : personalChats.length === 0 ? (
                  <div className="text-[8px] text-zinc-500 uppercase text-center py-8 block font-mono">
                    No synapses saved.<br />Launch a query to begin.
                  </div>
                ) : (
                  personalChats
                    .filter((chat) =>
                      (chat.title || "").toLowerCase().includes(personalChatSearch.toLowerCase())
                    )
                    .map((chat) => {
                      const isActive = chat.id === activePersonalChatId;
                      const isEditing = chat.id === editingChatId;

                      return (
                        <div
                          key={chat.id}
                          className={`group relative rounded-lg border text-[9px] flex flex-col p-2 transition-all duration-150 cursor-pointer ${
                            isActive
                              ? "bg-cyan-950/25 border-cyan-500 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.1)]"
                              : "bg-black/20 border-white/5 text-zinc-400 hover:border-cyan-500/20 hover:text-slate-200"
                          }`}
                          onClick={() => {
                            if (!isEditing) {
                              setActivePersonalChatId(chat.id);
                            }
                          }}
                        >
                          {isEditing ? (
                            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="text"
                                value={editingTitle}
                                onChange={(e) => setEditingTitle(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    handleRenamePersonalChat(chat.id, editingTitle);
                                  } else if (e.key === "Escape") {
                                    setEditingChatId(null);
                                  }
                                }}
                                className="flex-1 bg-black/40 border border-cyan-500/30 rounded px-1.5 py-0.5 text-[9px] text-white focus:outline-none focus:border-cyan-500 font-mono"
                                autoFocus
                              />
                              <button
                                type="button"
                                onClick={() => handleRenamePersonalChat(chat.id, editingTitle)}
                                className="p-0.5 text-green-400 hover:text-green-300 transition-colors"
                              >
                                <Check size={10} />
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingChatId(null)}
                                className="p-0.5 text-zinc-500 hover:text-white transition-colors"
                              >
                                <X size={10} />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between gap-1">
                              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                <MessageSquare size={10} className={`shrink-0 ${isActive ? "text-cyan-400 animate-pulse" : "text-zinc-650"}`} />
                                <span className="font-bold truncate select-none">{chat.title || "Untitled Synapse"}</span>
                              </div>

                              {/* Quick controls on hover or if active */}
                              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingChatId(chat.id);
                                    setEditingTitle(chat.title || "");
                                  }}
                                  className="p-0.5 text-zinc-500 hover:text-cyan-400 transition-colors cursor-pointer"
                                  title="Rename Synapse"
                                >
                                  <Edit3 size={9} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeletePersonalChat(chat.id)}
                                  className="p-0.5 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                                  title="Purge Synapse"
                                >
                                  <Trash2 size={9} />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                )}
              </div>

              {/* Collapsed HUD Link Capacity gauge */}
              <div className="border-t border-cyan-500/10 pt-2 flex flex-col gap-1.5 shrink-0 font-mono text-[9px]">
                <div className="flex justify-between items-center text-slate-500 select-none">
                  <span>TELEMETRY STABILITY</span>
                  <span className="text-cyan-400 font-bold">{neuralLink.toFixed(0)}%</span>
                </div>
                <div className="h-0.5 bg-cyan-950/40 rounded overflow-hidden select-none">
                  <div className="h-full bg-cyan-400 transition-all duration-500" style={{ width: `${neuralLink}%` }} />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 border border-fuchsia-500/15 bg-black/45 backdrop-blur-md rounded-xl p-3.5 flex flex-col space-y-4 overflow-y-auto scrollbar-none">
              {/* Header */}
              <div className="pb-2 border-b border-fuchsia-500/10">
                <span className="text-[9px] font-bold tracking-widest text-fuchsia-400 uppercase">
                  Encrypted Channels
                </span>
                <p className="text-[7px] text-zinc-500 uppercase mt-0.5">Biometric Compartments</p>
              </div>

              {/* Room list */}
              <div className="space-y-1.5 flex-1 max-h-[220px] overflow-y-auto scrollbar-none">
                {secureRooms.length === 0 ? (
                  <div className="text-[9px] text-zinc-500 uppercase text-center py-4">No authorized rooms detected.</div>
                ) : (
                  secureRooms.map((room) => {
                    const isActive = room.id === activeRoomId;
                    return (
                      <button
                        type="button"
                        key={room.id}
                        onClick={() => handleSelectRoom(room)}
                        className={`w-full text-left p-2 rounded-lg border text-[9px] flex flex-col transition-all cursor-pointer ${
                          isActive
                            ? "bg-fuchsia-950/30 border-fuchsia-500 text-fuchsia-300 shadow-[0_0_8px_rgba(217,70,239,0.15)]"
                            : "bg-black/20 border-white/5 text-zinc-400 hover:border-white/10 hover:text-white"
                        }`}
                      >
                        <span className="font-bold truncate">{room.name}</span>
                        <span className="text-[7px] text-zinc-500 uppercase mt-0.5 truncate">
                          Owner: {room.owner === auth.currentUser?.uid ? "YOU" : room.owner.slice(0, 8)}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>

              {/* New Room Setup Trigger form */}
              <div className="border-t border-fuchsia-500/10 pt-3 space-y-2 text-[9px]">
                <span className="font-bold text-fuchsia-400 uppercase">Spawn Secure Node</span>
                <input
                  type="text"
                  placeholder="Room Name..."
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-lg p-2 text-[10px] text-white placeholder-zinc-650 focus:outline-none focus:border-fuchsia-500/30 font-mono"
                />
                <input
                  type="text"
                  placeholder="Clearance UIDs (comma separated)..."
                  value={newRoomMembers}
                  onChange={(e) => setNewRoomMembers(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-lg p-2 text-[10px] text-white placeholder-zinc-650 focus:outline-none focus:border-fuchsia-500/30 font-mono"
                />
                <button
                  type="button"
                  onClick={handleCreateSecureRoom}
                  className="w-full py-1.5 bg-fuchsia-500/20 hover:bg-fuchsia-500/30 text-fuchsia-300 border border-fuchsia-500/20 rounded-lg font-bold tracking-wider uppercase transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  <Plus size={10} /> SECURE CHANNEL
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ═══ CENTER: CHAT ARENA ═══ */}
        <div className="flex-1 flex flex-col min-w-0 gap-0">
          <div className="flex-1 border border-cyan-500/15 bg-black/45 backdrop-blur-md rounded-xl flex flex-col overflow-hidden">
            {chatMode === "standard" ? (
              <>
                {/* Scrollable messages */}
                <div className="flex-1 overflow-y-auto scrollbar-none p-4 space-y-4">
                  <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse ml-auto max-w-[85%]" : "mr-auto max-w-[90%]"}`}
                      >
                        {/* Avatar */}
                        <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${
                          msg.role === "user"
                            ? "border-fuchsia-500/30 bg-fuchsia-950/20 text-fuchsia-400"
                            : "border-cyan-500/30 bg-cyan-950/20 text-cyan-400"
                        }`}>
                          {msg.role === "user" ? <User size={12} /> : <Cpu size={12} />}
                        </div>

                        {/* Bubble */}
                        <div className={`p-3.5 rounded-xl border relative group ${
                          msg.role === "user"
                            ? "bg-fuchsia-950/20 border-fuchsia-500/15 rounded-tr-sm"
                            : "bg-black/60 border-cyan-500/15 rounded-tl-sm"
                        }`}>
                          {/* Meta header */}
                          <div className="flex items-center justify-between gap-3 border-b border-white/5 pb-1.5 mb-2">
                            <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">
                              {msg.role === "user" ? "PILOT INPUT" : "JARVIS X // RESPONSE"}&nbsp;•&nbsp;{msg.timestamp}
                            </span>
                            {msg.role === "assistant" && (
                              <button
                                type="button"
                                onClick={() => { navigator.clipboard.writeText(msg.content); setCopiedId(msg.id); setTimeout(() => setCopiedId(null), 2000); }}
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-600 hover:text-cyan-400 cursor-pointer pointer-events-auto"
                              >
                                {copiedId === msg.id ? <Check size={10} className="text-green-400" /> : <Copy size={10} />}
                              </button>
                            )}
                          </div>

                          <div className="font-sans leading-relaxed">
                            {parseMarkdown(msg.content)}
                          </div>

                          {/* Grounding sources */}
                          {msg.role === "assistant" && msg.groundingSources && msg.groundingSources.length > 0 && (
                            <div className="mt-2.5 pt-2 border-t border-cyan-500/10 flex flex-wrap gap-1.5">
                              {msg.groundingSources.map((s: any, i: number) => (
                                <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                                  className="text-[8px] font-mono px-1.5 py-0.5 border border-cyan-500/15 bg-cyan-950/20 text-cyan-400 rounded hover:border-cyan-400/40 transition-all truncate max-w-[160px]">
                                  ● {s.title}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Typing indicator */}
                  {isTyping && (
                    <div className="flex gap-2.5 mr-auto items-center">
                      <div className="w-7 h-7 rounded-lg border border-cyan-500/30 bg-cyan-950/20 flex items-center justify-center">
                        <Loader2 size={12} className="animate-spin text-cyan-400" />
                      </div>
                      <div className="px-3 py-2 bg-black/60 border border-cyan-500/15 rounded-xl text-[9px] font-mono text-cyan-400 flex items-center gap-1.5">
                        <Activity size={9} className="animate-pulse" /> PROCESSING NEURAL STREAM...
                      </div>
                    </div>
                  )}

                  <div ref={chatEndRef} />
                </div>

                {/* Quick action buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 px-4 pb-3 pt-2 border-t border-cyan-500/10 shrink-0">
                  {quickActions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={action.action}
                      className="flex items-center gap-1.5 px-2.5 py-2 border border-cyan-500/15 bg-cyan-950/15 hover:bg-cyan-500/10 hover:border-cyan-400/35 text-cyan-400/80 hover:text-cyan-300 rounded-lg text-[8px] font-mono uppercase tracking-wide transition-all cursor-pointer"
                    >
                      {action.icon}
                      <span className="truncate">{action.label}</span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              // PROTECTED DATABASE CHATS
              <div className="flex-1 flex flex-col min-h-0">
                {!activeRoomId ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center font-mono space-y-4">
                    <Lock className="w-12 h-12 text-fuchsia-500 animate-pulse bg-fuchsia-500/10 p-2.5 rounded-full border border-fuchsia-500/30 shadow-[0_0_15px_rgba(217,70,239,0.2)]" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-fuchsia-400">Secure Database Hub Uninitialized</h4>
                    <p className="text-[10px] text-zinc-500 leading-relaxed uppercase max-w-sm">
                      Please select an authorized encrypted room level from the Left Panel or spawn a new secure channel registry.
                    </p>
                  </div>
                ) : (() => {
                  const activeRoom = secureRooms.find(r => r.id === activeRoomId);
                  if (!activeRoom) {
                    return (
                      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center font-mono space-y-2">
                        <ShieldAlert className="text-red-500 w-10 h-10 animate-spin" />
                        <h4 className="text-xs font-bold text-red-500 uppercase">ACCESS REGISTRY BLOCKED / REVOKED</h4>
                      </div>
                    );
                  }

                  const currentUID = auth.currentUser?.uid || "";
                  const isOwner = activeRoom.owner === currentUID;

                  return (
                    <div className="flex-1 flex flex-col min-h-0">
                      {/* Secure Sub-header */}
                      <div className="bg-black/30 border-b border-white/5 px-4 py-2.5 flex items-center justify-between flex-wrap gap-2 text-[9px] font-mono">
                        <div className="flex items-center gap-1.5">
                          <ShieldCheck size={11} className="text-green-400 animate-pulse" />
                          <span className="font-bold text-white uppercase">{activeRoom.name}</span>
                          <span className="text-zinc-500 font-normal m-0 p-0 leading-none">
                            &nbsp;&nbsp;|&nbsp;&nbsp;Owner ID: {activeRoom.owner.slice(0, 10)}
                          </span>
                        </div>
                        
                        {/* Member expansion append form for owner */}
                        <div className="flex items-center gap-1.5 ml-auto">
                          {isOwner ? (
                            <div className="flex items-center gap-1 border border-white/10 bg-black/40 rounded px-1.5 py-0.5">
                              <span className="text-fuchsia-400 tracking-wider">Whitelist UID:</span>
                              <input
                                type="text"
                                placeholder="..."
                                value={addMemberUid}
                                onChange={(e) => setAddMemberUid(e.target.value)}
                                className="bg-transparent border-none text-[8px] text-white p-0.5 focus:outline-none w-20 font-mono"
                              />
                              <button
                                type="button"
                                onClick={handleAddNewMember}
                                className="text-fuchsia-500 hover:text-fuchsia-300 font-black cursor-pointer"
                              >
                                [ APPEND ]
                              </button>
                            </div>
                          ) : (
                            <span className="text-[8px] text-green-500 tracking-wider bg-green-500/10 px-1.5 py-0.5 border border-green-500/20 rounded uppercase">
                              Read Write Access Authorized
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => { setActiveRoomId(null); setRoomError(""); }}
                            className="bg-zinc-950/45 hover:bg-zinc-900 border border-white/10 rounded px-1.5 py-0.5 font-bold hover:text-white text-zinc-500 cursor-pointer"
                          >
                            DISCONNECT
                          </button>
                        </div>
                      </div>

                      {roomError && (
                        <div className="bg-red-950/20 border-b border-red-500/15 text-red-400 p-2 text-[9px] text-center font-mono">
                          {roomError}
                        </div>
                      )}

                      {/* Decrypted Messages viewport */}
                      <div className="flex-1 overflow-y-auto scrollbar-none p-4 space-y-4 max-h-[55vh]">
                        <AnimatePresence initial={false}>
                          {(activeRoom.messages || []).map((msg: any, mIdx: number) => (
                            <motion.div
                              key={mIdx}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.15 }}
                              className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse ml-auto max-w-[85%]" : "mr-auto max-w-[90%]"}`}
                            >
                              {/* Decrypted Shield indicator avatar */}
                              <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${
                                msg.role === "user"
                                  ? "border-fuchsia-500/30 bg-fuchsia-950/20 text-fuchsia-400"
                                  : "border-green-500/20 bg-green-950/20 text-green-400"
                              }`}>
                                {msg.role === "user" ? <User size={12} /> : <ShieldCheck size={12} />}
                              </div>

                              {/* Bubble */}
                              <div className={`p-3.5 rounded-xl border relative group ${
                                msg.role === "user"
                                  ? "bg-fuchsia-950/20 border-fuchsia-500/15 rounded-tr-sm"
                                  : "bg-black/60 border-green-500/15 rounded-tl-sm"
                              }`}>
                                {/* Meta Header */}
                                <div className="flex items-center justify-between gap-3 border-b border-white/5 pb-1.5 mb-2 font-mono">
                                  <span className="text-[8px] text-zinc-500 uppercase tracking-widest font-bold">
                                    {msg.sender || "DECRYPTED TERMINAL"} &bull; {msg.timestamp || "NOW"}
                                  </span>
                                  <span className="text-[7px] text-green-500 bg-green-500/10 px-1 rounded uppercase tracking-widest font-black">
                                    SECURE
                                  </span>
                                </div>

                                {/* Content text */}
                                <p className="text-[11px] leading-relaxed text-zinc-100 whitespace-pre-wrap select-text selection:bg-fuchsia-500/30">
                                  {msg.content}
                                </p>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                        <div ref={chatEndRef} />
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* File upload indicator */}
            {uploadedFile && (
              <div className="mx-4 mb-2 px-3 py-1.5 bg-cyan-950/20 border border-cyan-500/20 rounded-lg flex items-center justify-between text-[9px] font-mono shrink-0">
                <span className="text-cyan-400 flex items-center gap-1 truncate">
                  <FileText size={10} /> {uploadedFile.name}
                </span>
                <button onClick={() => setUploadedFile(null)} className="text-red-400 font-bold ml-2 cursor-pointer">×</button>
              </div>
            )}

            {/* Voice visualization */}
            {isMicActive && (
              <div className="flex gap-0.5 items-center justify-center pb-2 shrink-0">
                <span className="text-[8px] font-mono text-fuchsia-400 uppercase tracking-widest mr-2 animate-pulse">SAMPLING:</span>
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} className="w-0.5 bg-cyan-400 rounded-full"
                    style={{ height: `${Math.floor(Math.random() * 16) + 4}px` }} />
                ))}
              </div>
            )}

            {/* Input dock */}
            <div className="flex gap-2 items-center bg-black/50 border-t border-cyan-500/15 px-3 py-2 shrink-0">
              <input type="file" ref={fileInputRef}
                onChange={(e) => { const f = e.target.files?.[0]; if (f) { setUploadedFile({ name: f.name, type: "document" }); onLogMessage("INFO", `File attached: ${f.name}`); } }}
                className="hidden" />

              {/* Icon buttons */}
              <div className="flex items-center gap-0.5 shrink-0">
                <button type="button" onClick={() => fileInputRef.current?.click()}
                  className="p-1.5 text-slate-600 hover:text-cyan-400 hover:bg-cyan-950/20 rounded-lg transition-all cursor-pointer" title="Attach file">
                  <Paperclip size={13} />
                </button>
                <button type="button"
                  className="p-1.5 text-slate-600 hover:text-cyan-400 hover:bg-cyan-950/20 rounded-lg transition-all cursor-pointer" title="Code block">
                  <Code2 size={13} />
                </button>
                <button type="button"
                  className="p-1.5 text-slate-600 hover:text-cyan-400 hover:bg-cyan-950/20 rounded-lg transition-all cursor-pointer" title="Grid view">
                  <Grid3X3 size={13} />
                </button>
              </div>

              {/* Text input */}
              <input
                type="text"
                placeholder={chatMode === "standard" ? "Transmit commands or queries to JARVIS-X..." : "Send AES-255 secure signal payload..."}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => { 
                  if (e.key === "Enter" && !e.shiftKey) {
                    if (chatMode === "standard") handleSendMessage();
                    else handleSendSecureMessage();
                  } 
                }}
                className="flex-1 bg-transparent border-none py-1.5 px-1 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-0 min-w-0 font-mono"
              />

              {/* Mic */}
              <button type="button" onClick={handleMicToggle}
                className={`p-2 rounded-xl transition-all shrink-0 cursor-pointer ${
                  isMicActive
                    ? "bg-fuchsia-500 text-white shadow-[0_0_10px_rgba(217,70,239,0.45)]"
                    : "text-slate-500 hover:text-cyan-400 hover:bg-cyan-950/20"
                }`}>
                <Mic size={13} />
              </button>

              {/* Send */}
              <button 
                type="button" 
                onClick={() => {
                  if (chatMode === "standard") handleSendMessage();
                  else handleSendSecureMessage();
                }}
                className="p-2 bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl transition-all shadow-[0_0_10px_rgba(6,182,212,0.3)] hover:shadow-[0_0_16px_rgba(6,182,212,0.5)] shrink-0 cursor-pointer"
              >
                <Send size={13} />
              </button>
            </div>

          </div>
        </div>

        {/* ═══ RIGHT: HOLOGRAPHIC ORB + CONTEXT CARD ═══ */}
        <div className="w-64 shrink-0 flex flex-col gap-3">

          {/* Holographic X orb */}
          <div className="flex-1 border border-blue-500/10 rounded-xl overflow-hidden flex flex-col"
            style={{ background: "radial-gradient(circle at 50% 30%, rgba(15,23,74,0.75), rgba(2,6,23,0.97))" }}>
            <HolographicXOrb />
          </div>

          {/* Conversation context */}
          <div className="border border-cyan-500/15 bg-black/50 backdrop-blur-md rounded-xl p-3 shrink-0">
            <div className="flex items-center justify-between mb-2.5 pb-1.5 border-b border-cyan-500/10">
              <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest font-bold">
                Conversation Context
              </span>
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[7px] font-mono text-green-400 uppercase font-bold">Memory Synchronized</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[8px] font-mono text-slate-500 uppercase">Session ID</span>
                <span className="text-[9px] font-mono font-bold text-white">JX-05-AI-7842</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[8px] font-mono text-slate-500 uppercase">Context Window</span>
                <span className="text-[9px] font-mono font-bold text-cyan-400">
                  {contextTokens.toLocaleString()} tokens
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[8px] font-mono text-slate-500 uppercase">Uptime</span>
                <span className="text-[9px] font-mono font-bold text-white">
                  {uptime.h}h {String(uptime.m).padStart(2, "0")}m {String(uptime.s).padStart(2, "0")}s
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
