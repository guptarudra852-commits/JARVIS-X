import React, { useState, useEffect } from "react";
import { CircleUser, Key, Fingerprint, ShieldAlert, CheckCircle, Terminal } from "lucide-react";
import { auth, db } from "../../lib/firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail,
  signOut,
  updateProfile
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface LoginSignupProps {
  onLogMessage: (level: "INFO" | "WARN" | "CORE" | "ERROR", text: string) => void;
  onLoginStatusChange: (username: string | null) => void;
  mode?: "login" | "signup";
}

export default function LoginSignup({ onLogMessage, onLoginStatusChange, mode = "login" }: LoginSignupProps) {
  const [isLogin, setIsLogin] = useState(mode !== "signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(!!auth.currentUser);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setIsLogin(mode !== "signup");
  }, [mode]);

  useEffect(() => {
    setAuthSuccess(!!auth.currentUser);
  }, [auth.currentUser]);

  const handlePasswordReset = async () => {
    if (!email) {
      setErrorMessage("CRYPT DIRECTIVE: Input locator email for reset.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      onLogMessage("INFO", `Password reset email sent to: ${email}`);
      setErrorMessage("Reset email dispatched. Check your inbox.");
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setAuthLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        onLogMessage("CORE", `Login successful for: ${email}`);
        setAuthSuccess(true);
        const userNick = auth.currentUser?.displayName || email.split("@")[0].toUpperCase();
        onLoginStatusChange(userNick);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const userNick = nickname || email.split("@")[0].toUpperCase();

        try {
          await updateProfile(user, { displayName: userNick });
        } catch (updateErr: any) {
          onLogMessage("WARN", `Could not update Auth profile nickname: ${updateErr.message}`);
        }

        try {
          await setDoc(doc(db, "users", user.uid), {
            email: email,
            displayName: userNick,
            createdAt: serverTimestamp()
          });
          onLogMessage("CORE", `Firestore profile record generated for UID: ${user.uid}`);
        } catch (fsError: any) {
          onLogMessage("WARN", `Could not create Firestore user doc: ${fsError.message}`);
          handleFirestoreError(fsError, OperationType.CREATE, `users/${user.uid}`);
        }

        onLogMessage("CORE", `Account created successfully for: ${email}`);
        setAuthSuccess(true);
        onLoginStatusChange(userNick);
      }
    } catch (error: any) {
      setErrorMessage(error.message);
      onLogMessage("ERROR", `Authentication failure: ${error.message}`);
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 text-white relative min-h-[60vh] flex flex-col justify-center">
      <div className="p-6 bg-black/45 border border-cyan-500/20 rounded-xl backdrop-blur-md relative overflow-hidden">
        {/* Neon hover glowing stripe */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full border border-cyan-500/30 bg-cyan-500/5 flex items-center justify-center text-cyan-400 mx-auto mb-3">
            <Fingerprint size={24} className={authLoading ? "animate-ping text-fuchsia-400" : ""} />
          </div>
          <h2 className="text-lg font-mono font-bold text-white uppercase tracking-widest">
            {isLogin ? "MAINFRAME_SIGN_IN" : "CREATE_NEURAL_NODULUS"}
          </h2>
          <span className="text-[10px] font-mono text-cyan-400/50 uppercase">JARVIS-X SECURITIES PROMPT</span>
        </div>

        {authSuccess ? (
          <div className="text-center py-6 space-y-4 font-mono">
            <CheckCircle size={36} className="text-green-400 mx-auto animate-bounce" />
            <p className="text-xs text-green-300">AUTHENTICATION SECURE. NEURAL TUNNEL DISPATCHED.</p>
            <div className="p-3 bg-cyan-950/20 border border-cyan-500/10 rounded text-[10px] text-cyan-400/70">
              CAPTAIN ACCESS TOKEN ACTIVE.
            </div>
            <button
              id="switch-auth-mode-back"
              onClick={async () => {
                try {
                  await signOut(auth);
                  setAuthSuccess(false);
                  setEmail("");
                  setPassword("");
                  onLoginStatusChange(null);
                  onLogMessage("INFO", "Disassociated neural uplink successfully (logged out).");
                } catch (e: any) {
                  onLogMessage("ERROR", `Sign out error: ${e.message}`);
                }
              }}
              className="text-gray-500 text-[10px] underline hover:text-white uppercase font-bold cursor-pointer"
            >
              LOG_OUT_CORE
            </button>
          </div>
        ) : authLoading ? (
          <div className="text-center py-8 space-y-6 font-mono text-xs">
            <p className="text-cyan-400 uppercase tracking-widest animate-pulse">PROCESSING AUTHENTICATION...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3 bg-red-500/15 border border-red-500/30 rounded text-[10px] font-mono text-red-400 flex items-center gap-2">
                <ShieldAlert size={14} className="shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <label className="block text-[9px] font-mono text-cyan-400/50 uppercase mb-1">Optical Locator Email</label>
              <div className="relative">
                <CircleUser size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400/45" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="captain@aurora.io"
                  className="pl-9 pr-3 py-2 w-full bg-cyan-950/10 border border-cyan-500/20 rounded text-xs select-text focus:outline-none focus:border-cyan-400 text-white font-mono"
                  required
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-[9px] font-mono text-cyan-400/50 uppercase mb-1">Synaptic Callsign (Callsign)</label>
                <div className="relative">
                  <Terminal size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400/45" />
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="e.g., NEOMAX"
                    className="pl-9 pr-3 py-2 w-full bg-cyan-950/10 border border-cyan-500/20 rounded text-xs select-text focus:outline-none focus:border-cyan-400 text-white font-mono"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[9px] font-mono text-cyan-400/50 uppercase mb-1">Sovereign Key Code</label>
              <div className="relative">
                <Key size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400/45" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-9 pr-3 py-2 w-full bg-cyan-950/10 border border-cyan-500/20 rounded text-xs select-text focus:outline-none focus:border-cyan-400 text-white font-mono animate-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              id="submit-auth-form"
              className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 text-black font-semibold rounded-lg font-mono text-xs tracking-wider transition-all cursor-pointer"
            >
              {isLogin ? "AUTHORIZE_LINK" : "INJECT_SYNAPSE_CORE"}
            </button>

            <div className="text-center mt-4 space-y-2">
              <button
                type="button"
                onClick={handlePasswordReset}
                className="block w-full text-gray-500 text-[9px] hover:text-cyan-300 font-mono underline cursor-pointer"
              >
                Forgot Password?
              </button>
              <button
                type="button"
                id="toggle-auth-views"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrorMessage("");
                }}
                className="text-gray-500 text-[10px] hover:text-cyan-300 font-mono transition-colors uppercase cursor-pointer"
              >
                {isLogin ? "Create New Synaptic Matrix Call" : "Already verified Captain Retinal Codes?"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
