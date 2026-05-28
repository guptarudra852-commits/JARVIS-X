import React, { useState, useEffect } from "react";
import { 
  collection, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc,
  setDoc,
  serverTimestamp,
  query,
  orderBy
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { 
  ShieldCheck, 
  UserCheck, 
  UserX, 
  UserMinus, 
  ShieldAlert, 
  KeyRound, 
  Smartphone, 
  AlertTriangle, 
  Check, 
  X,
  RefreshCw,
  Search,
  Sliders,
  Sparkles,
  Database
} from "lucide-react";

interface UserProfile {
  uid: string;
  email?: string;
  phoneNumber?: string;
  displayName?: string;
  role?: "admin" | "premium" | "beta" | "guest" | "developer";
  approved?: boolean;
  allowedDevices?: string[];
  createdAt?: any;
  lastLogin?: any;
}

interface AdminProps {
  onLogMessage: (level: "INFO" | "WARN" | "CORE" | "ERROR", text: string) => void;
}

export default function Admin({ onLogMessage }: AdminProps) {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  // States for adding a user manually or quick config
  const [newDeviceInput, setNewDeviceInput] = useState<{ [uid: string]: string }>({});

  useEffect(() => {
    onLogMessage("INFO", "Initializing authorization link with User Registry database...");
    
    const usersCollection = collection(db, "users");
    const q = query(usersCollection, orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const uList: UserProfile[] = [];
        snapshot.forEach((docSnap) => {
          uList.push({
            uid: docSnap.id,
            ...docSnap.data()
          } as UserProfile);
        });
        setUsers(uList);
        setLoading(false);
        onLogMessage("CORE", `User Registry updated. ${uList.length} total node identities loaded.`);
      },
      (err) => {
        console.error("Firestore Listen Error: ", err);
        setError("Missing or insufficient permissions. Verify your admin role signature.");
        setLoading(false);
        onLogMessage("ERROR", `Failed to listen to user collection: ${err.message}`);
      }
    );

    return unsubscribe;
  }, []);

  const handleUpdateApproval = async (uid: string, approve: boolean, email = "Unknown") => {
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, {
        approved: approve
      });
      onLogMessage("CORE", `Identity ${email} [${uid.slice(0, 6)}] approval status updated: ${approve ? "APPROVED" : "REJECTED"}`);
    } catch (err: any) {
      setError(`Failed to update approval: ${err.message}`);
      onLogMessage("ERROR", `Approval mismatch: ${err.message}`);
    }
  };

  const handleUpdateRole = async (uid: string, role: string, email = "Unknown") => {
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, {
        role: role
      });
      onLogMessage("CORE", `Identity ${email} [${uid.slice(0, 6)}] role reassigned to: ${role.toUpperCase()}`);
    } catch (err: any) {
      setError(`Failed to update role: ${err.message}`);
      onLogMessage("ERROR", `Role assign mismatch: ${err.message}`);
    }
  };

  const handleDeleteUser = async (uid: string, email = "Unknown") => {
    if (!window.confirm(`Are you absolutely sure you want to terminate biometric credentials for ${email}?`)) {
      return;
    }
    try {
      const userRef = doc(db, "users", uid);
      await deleteDoc(userRef);
      onLogMessage("WARN", `Biometric node terminated from database: ${email} [${uid}]`);
    } catch (err: any) {
      setError(`Termination failed: ${err.message}`);
      onLogMessage("ERROR", `Termination mismatch: ${err.message}`);
    }
  };

  const handleAddDevice = async (uid: string, currentDevices: string[] = []) => {
    const rawVal = newDeviceInput[uid] || "";
    if (!rawVal.trim()) return;

    try {
      const userRef = doc(db, "users", uid);
      const updatedDevices = [...currentDevices, rawVal.trim()];
      await updateDoc(userRef, {
        allowedDevices: updatedDevices
      });
      setNewDeviceInput(prev => ({ ...prev, [uid]: "" }));
      onLogMessage("CORE", `Device register successfully bound to user UID [${uid.slice(0, 6)}]: ${rawVal}`);
    } catch (err: any) {
      setError(`Device authorization fail: ${err.message}`);
      onLogMessage("ERROR", `Device compile logic breach: ${err.message}`);
    }
  };

  const handleRemoveDevice = async (uid: string, deviceIdx: number, currentDevices: string[] = []) => {
    try {
      const userRef = doc(db, "users", uid);
      const updatedDevices = currentDevices.filter((_, idx) => idx !== deviceIdx);
      await updateDoc(userRef, {
        allowedDevices: updatedDevices
      });
      onLogMessage("CORE", `Device signature removed from registry`);
    } catch (err: any) {
      setError(`Device revocation fail: ${err.message}`);
      onLogMessage("ERROR", `Device compile logical breach: ${err.message}`);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      (u.email || "").toLowerCase().includes(q) ||
      (u.phoneNumber || "").toLowerCase().includes(q) ||
      (u.displayName || "").toLowerCase().includes(q) ||
      u.uid.toLowerCase().includes(q) ||
      (u.role || "").toLowerCase().includes(q)
    );
  });

  const pendingUsers = filteredUsers.filter(u => u.approved === false);
  const activeUsers = filteredUsers.filter(u => u.approved !== false);

  return (
    <div className="space-y-6 font-mono text-zinc-800 dark:text-zinc-100 p-1 md:p-4">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 dark:border-cyan-500/20 pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-wider flex items-center gap-2 text-zinc-900 dark:text-cyan-400">
            <KeyRound className="w-5 h-5 animate-pulse text-cyan-400" />
            JARVIS_X_COMMAND_MAINFRAME
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 uppercase tracking-widest leading-relaxed">
            Centralized Access Control, Node Authorization & Biometric Credential Registry.
          </p>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="FILTER NODES..."
            className="pl-10 pr-4 py-2 w-full bg-zinc-100/50 dark:bg-black/40 border border-zinc-200 dark:border-cyan-500/20 rounded-xl text-xs uppercase focus:outline-none focus:ring-1 focus:ring-cyan-500/40 text-zinc-800 dark:text-white"
          />
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-500 flex items-start gap-3.5">
          <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
          <button onClick={() => setError("")} className="ml-auto hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-10 space-y-4">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-cyan-500" />
          <p className="text-xs text-zinc-500 dark:text-cyan-400 tracking-wider">SYNCING RETINAL DATABASE SNAPSHOTS...</p>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* PENDING APPROVAL SECTION */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-yellow-600 dark:text-yellow-400 bg-yellow-500/5 dark:bg-yellow-500/10 p-2.5 rounded-lg border border-yellow-500/20">
              <AlertTriangle className="w-4 h-4 text-yellow-500 animate-pulse" />
              <span>PENDING_CREDENTIALS_VERIFICATION_REQUIRED ({pendingUsers.length})</span>
            </div>

            {pendingUsers.length === 0 ? (
              <div className="p-6 bg-zinc-500/5 border border-zinc-200/50 dark:border-cyan-500/5 rounded-xl text-center text-xs text-zinc-400 dark:text-zinc-500">
                NO PENDING WORKSPACE ACCESS REQUESTS REGISTERED on security buffers.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingUsers.map(u => (
                  <div key={u.uid} className="bg-yellow-500/[0.02] border border-yellow-500/20 rounded-xl p-4 space-y-3.5 relative overflow-hidden transition-all hover:bg-yellow-500/[0.04]">
                    <div className="absolute top-0 right-0 p-1 font-mono text-[9px] bg-yellow-500/10 text-yellow-500 rounded-bl font-semibold uppercase">Pending</div>
                    <div>
                      <div className="font-bold text-zinc-800 dark:text-white text-sm break-all">{u.displayName || "ANONYMOUS CAPTAIN"}</div>
                      <div className="text-[10px] text-zinc-400 mt-0.5 break-all">{u.email || u.phoneNumber || "NO CONTACT IDENT"} (UID: {u.uid.slice(0,8)})</div>
                    </div>

                    <div className="flex justify-between items-center text-xs gap-3">
                      <span className="text-[10px] text-zinc-400">ROLE: <span className="text-yellow-500 font-semibold">{u.role?.toUpperCase() || "GUEST"}</span></span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateApproval(u.uid, true, u.email || u.displayName)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white dark:text-zinc-950 font-bold px-3 py-1.5 rounded-lg text-[10px] flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" /> APPROVE
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u.uid, u.email || u.displayName)}
                          className="bg-red-600 hover:bg-red-500 text-white font-bold px-3 py-1.5 rounded-lg text-[10px] flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" /> REJECT
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ACTIVE IDENTITY REGISTRY */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-zinc-500 dark:text-cyan-400/80 uppercase tracking-widest">AUTHORIZED_IDENTITY_METRIC_GRID</h3>
            
            {activeUsers.length === 0 ? (
              <div className="p-6 bg-zinc-500/5 border border-zinc-200/50 dark:border-cyan-500/5 rounded-xl text-center text-xs text-zinc-400">
                No active users found matching lookup query.
              </div>
            ) : (
              <div className="border border-zinc-200 dark:border-cyan-500/15 rounded-xl bg-white/50 dark:bg-black/20 overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-cyan-500/15 text-[10px] text-zinc-400 uppercase tracking-wider bg-zinc-100/55 dark:bg-cyan-950/20">
                      <th className="py-3 px-4">Biometric Node / UID</th>
                      <th className="py-3 px-4">Contact Gateway</th>
                      <th className="py-3 px-4">Role Matrix</th>
                      <th className="py-3 px-4">Secure Devices</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-cyan-500/10 text-xs text-zinc-700 dark:text-zinc-300">
                    {activeUsers.map(u => (
                      <tr key={u.uid} className="hover:bg-zinc-100/40 dark:hover:bg-cyan-950/10 transition-colors">
                        <td className="py-3.5 px-4 font-bold">
                          <div className="dark:text-white break-all flex items-center gap-2">
                            {u.role === "admin" && <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />}
                            <span>{u.displayName || "AGENT"}</span>
                          </div>
                          <span className="text-[10px] font-normal text-zinc-400 break-all">{u.uid}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="break-all">{u.email || u.phoneNumber || "LINK Biometrics Only"}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={u.role || "guest"}
                            onChange={(e) => handleUpdateRole(u.uid, e.target.value as any, u.email || u.displayName)}
                            className="bg-zinc-100 dark:bg-cyan-950/30 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-cyan-500/15 rounded px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500/30 font-bold"
                          >
                            <option value="guest">guest (Unapproved)</option>
                            <option value="beta">beta testing</option>
                            <option value="premium">premium node</option>
                            <option value="developer">developer core</option>
                            <option value="admin">main administrator</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4 max-w-xs space-y-1.5">
                          {/* Devices list */}
                          <div className="flex flex-wrap gap-1.5">
                            {(u.allowedDevices || []).map((dev, idx) => (
                              <span key={idx} className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-cyan-500/10 text-[9px] px-1.5 py-0.5 rounded text-zinc-500 dark:text-cyan-400 flex items-center gap-1 group font-sans">
                                <Smartphone className="w-3 h-3 text-cyan-500/60" /> {dev}
                                <button 
                                  onClick={() => handleRemoveDevice(u.uid, idx, u.allowedDevices)}
                                  className="text-red-400 hover:text-red-500 cursor-pointer ml-1 text-bold"
                                  title="Revoke device signature"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                            {(u.allowedDevices || []).length === 0 && (
                              <span className="text-[10px] text-zinc-400 italic">No bound device hashes</span>
                            )}
                          </div>
                          {/* Add device input */}
                          <div className="flex gap-1.5 max-w-[180px]">
                            <input
                              type="text"
                              value={newDeviceInput[u.uid] || ""}
                              onChange={(e) => setNewDeviceInput(prev => ({ ...prev, [u.uid]: e.target.value }))}
                              placeholder="DEVICE HASH..."
                              className="text-[9px] bg-zinc-150 dark:bg-black/30 border border-zinc-300 dark:border-cyan-500/10 rounded px-1.5 py-0.5 w-full uppercase focus:outline-none text-zinc-800 dark:text-white"
                            />
                            <button
                              onClick={() => handleAddDevice(u.uid, u.allowedDevices)}
                              className="bg-cyan-500/20 hover:bg-cyan-500 text-cyan-700 dark:text-cyan-300 hover:text-black hover:dark:text-black font-bold px-1.5 py-0.5 rounded text-[9px] transition-colors cursor-pointer"
                            >
                              BIND
                            </button>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right space-y-1.5">
                          <div className="flex flex-col md:flex-row gap-2 justify-end">
                            <button
                              onClick={() => handleUpdateApproval(u.uid, false, u.email || u.displayName)}
                              className="bg-zinc-100 dark:bg-zinc-800 text-zinc-650 dark:text-zinc-400 hover:text-red-400 font-bold border border-zinc-300 dark:border-zinc-700 px-2.5 py-1 text-[9px] rounded flex items-center justify-center gap-1 transition-colors cursor-pointer"
                              title="Revoke active clearance"
                            >
                              <UserMinus className="w-3 h-3 text-red-500" /> REVOKE CLEARANCE
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u.uid, u.email || u.displayName)}
                              className="bg-red-500/10 hover:bg-red-600 text-red-600 hover:text-white font-bold px-2 py-1 text-[9px] rounded transition-colors cursor-pointer flex items-center justify-center"
                              title="Purge profile completely"
                            >
                              <UserX className="w-3 h-3 shrink-0" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
