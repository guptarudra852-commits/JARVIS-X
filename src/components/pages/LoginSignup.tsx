import React, { useState, useEffect } from "react";
import { 
  CircleUser, 
  Key, 
  Fingerprint, 
  ShieldAlert, 
  CheckCircle, 
  Terminal, 
  Mail, 
  Send,
  Lock, 
  Smartphone, 
  UserCheck, 
  ShieldCheck, 
  Chrome 
} from "lucide-react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { 
  auth, 
  continueWithGoogle, 
  initializeCaptcha, 
  sendOTP, 
  verifyOTP, 
  logout as firebaseLogout 
} from "../../lib/firebaseAuth";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail,
  updateProfile,
  User
} from "firebase/auth";

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
  
  // Login modes: 'email' | 'phone'
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  
  // Phone OTP States
  const [phone, setPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  
  const [authLoading, setAuthLoading] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(!!auth.currentUser);
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  useEffect(() => {
    setIsLogin(mode !== "signup");
  }, [mode]);

  useEffect(() => {
    const activeUser = auth.currentUser;
    setAuthSuccess(!!activeUser);
  }, [auth.currentUser]);

  // Handle Invisible Recaptcha setup for Phone Login
  useEffect(() => {
    if (loginMethod === "phone" && !otpSent) {
      // Small timeout ensures recaptcha element is mounted in DOM
      const timer = setTimeout(() => {
        initializeCaptcha();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [loginMethod, otpSent]);

  // Call this function when auth triggers profile change
  const syncLoggedInUser = async (user: User) => {
    const userNick = user.displayName || user.email?.split("@")[0].toUpperCase() || user.phoneNumber || "AGENT";
    setCurrentNicknameInFirestoreAndState(user, userNick);
  };

  const setCurrentNicknameInFirestoreAndState = async (user: User, userNick: string) => {
    onLoginStatusChange(userNick);
    setAuthSuccess(true);
    
    // Auto-create/initialize profile in Firestore securely
    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      
      const payload: any = {
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        displayName: userNick,
        lastLogin: serverTimestamp(),
      };
      
      // Only set defaults if user is completely brand new
      if (!userSnap.exists()) {
        payload.createdAt = serverTimestamp();
        payload.role = "guest";
        payload.approved = false;
        payload.allowedDevices = [];
      }
      
      await setDoc(userRef, payload, { merge: true });
      onLogMessage("CORE", `Firestore database synchronized with user record UID: ${user.uid}`);
    } catch (fsError: any) {
      onLogMessage("WARN", `Could not synchronize user doc to Firestore: ${fsError.message}`);
      // Fail gracefully or handle per checklist constraints
    }
  };

  /* ---------------- GOOGLE LOGIN CONTROLLERS ---------------- */
  const handleGoogleLogin = async () => {
    setErrorMessage("");
    setInfoMessage("");
    setAuthLoading(true);
    onLogMessage("INFO", "Initializing authorization with Google Secure Link...");

    try {
      const res = await continueWithGoogle();
      if (res.success && res.user) {
        onLogMessage("CORE", `Google login complete: ${res.user.email}`);
        await syncLoggedInUser(res.user);
      } else {
        setErrorMessage(res.error || "Google authorization interrupted.");
        onLogMessage("ERROR", `Google Auth failed: ${res.error}`);
      }
    } catch (err: any) {
      setErrorMessage(err.message);
      onLogMessage("ERROR", `Google trigger failed: ${err.message}`);
    } finally {
      setAuthLoading(false);
    }
  };

  /* ---------------- PHONE SMS OTP CONTROLLERS ---------------- */
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setInfoMessage("");
    
    if (!phone.trim()) {
      setErrorMessage("Enter a valid phone number (e.g., +919876543210)");
      return;
    }

    setAuthLoading(true);
    onLogMessage("INFO", `Sending secure authentication token token to: ${phone}`);

    try {
      const res = await sendOTP(phone);
      if (res.success) {
        setOtpSent(true);
        setInfoMessage(`Code dispatched to ${phone}. Enter verification sequence.`);
        onLogMessage("CORE", `SMS OTP Token dispatched successfully to phone endpoint: ${phone}`);
      } else {
        setErrorMessage(res.error || "Failed to dispatch verification code.");
        onLogMessage("ERROR", `SMS OTP failed: ${res.error}`);
      }
    } catch (err: any) {
      setErrorMessage(err.message);
      onLogMessage("ERROR", `OTP dispatch processing error: ${err.message}`);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setInfoMessage("");

    if (!otpCode.trim() || otpCode.length < 6) {
      setErrorMessage("Enter the complete 6-digit verification code.");
      return;
    }

    setAuthLoading(true);
    onLogMessage("INFO", "Verifying dispatch token signature with central mainframe...");

    try {
      const res = await verifyOTP(otpCode);
      if (res.success && res.user) {
        onLogMessage("CORE", `SMS transaction authorized. Phone UID: ${res.user.uid}`);
        await syncLoggedInUser(res.user);
      } else {
        setErrorMessage(res.error || "Failed to authorize security token.");
        onLogMessage("ERROR", `SMS Verification failed: ${res.error}`);
      }
    } catch (err: any) {
      setErrorMessage(err.message);
      onLogMessage("ERROR", `SMS Verification processing bounds failure: ${err.message}`);
    } finally {
      setAuthLoading(false);
    }
  };

  /* ---------------- EMAIL PASSWORD CONTROLLERS ---------------- */
  const handlePasswordReset = async () => {
    if (!email) {
      setErrorMessage("Input active identifier email to trigger reset sequence.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      onLogMessage("INFO", `Password recovery payload dispatched to user: ${email}`);
      setInfoMessage("Reset code sent. Inspect email mailbox.");
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setInfoMessage("");
    setAuthLoading(true);

    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        onLogMessage("CORE", `Authentication recognized for Captain: ${email}`);
        await syncLoggedInUser(userCredential.user);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const userNick = nickname || email.split("@")[0].toUpperCase();

        try {
          await updateProfile(user, { displayName: userNick });
        } catch (updateErr: any) {
          onLogMessage("WARN", `Retinal tag profile naming issue: ${updateErr.message}`);
        }

        try {
          await setDoc(doc(db, "users", user.uid), {
            email: email,
            displayName: userNick,
            createdAt: serverTimestamp()
          });
          onLogMessage("CORE", `Firestore profile record compiled: users/${user.uid}`);
        } catch (fsError: any) {
          onLogMessage("WARN", `Failed registry write: ${fsError.message}`);
          handleFirestoreError(fsError, OperationType.CREATE, `users/${user.uid}`);
        }

        onLogMessage("CORE", `User created successfully: ${email}`);
        await syncLoggedInUser(user);
      }
    } catch (error: any) {
      setErrorMessage(error.message);
      onLogMessage("ERROR", `Retinal mismatch: ${error.message}`);
    } finally {
      setAuthLoading(false);
    }
  };

  // Logout callback handler
  const handleLogout = async () => {
    try {
      await firebaseLogout();
      setAuthSuccess(false);
      setEmail("");
      setPassword("");
      setPhone("");
      setOtpCode("");
      setOtpSent(false);
      onLoginStatusChange(null);
      onLogMessage("INFO", "Disassociated neural uplink completely. Logged out.");
    } catch (e: any) {
      onLogMessage("ERROR", `Logout fail logic core: ${e.message}`);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 text-zinc-800 dark:text-white relative min-h-[60vh] flex flex-col justify-center">
      {/* Invisible Recaptcha container target */}
      <div id="recaptcha-container" className="invisible max-h-0 overflow-hidden"></div>

      <div className="p-6 bg-white/80 dark:bg-black/45 border border-zinc-200 dark:border-cyan-500/20 rounded-2xl backdrop-blur-md relative overflow-hidden transition-all duration-300">
        {/* Luminous line decoration */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full border border-cyan-500/30 bg-cyan-500/5 flex items-center justify-center text-cyan-500 dark:text-cyan-400 mx-auto mb-3">
            <Fingerprint size={24} className={authLoading ? "animate-pulse text-cyan-400" : ""} />
          </div>
          <h2 className="text-lg font-mono font-bold text-zinc-800 dark:text-white uppercase tracking-widest">
            {authSuccess ? "SECURE_LINK_LIVE" : isLogin ? "NEURAL_LINK_MAINFRAME" : "INITIALIZE_NEURAL_UPLINK"}
          </h2>
          <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400/50 uppercase">JARVIS-X CONNECT SECURITY PLATFORM</span>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs font-mono text-red-600 dark:text-red-400 flex items-start gap-2.5 mb-4 animate-[shake_0.4s_ease-in-out]">
            <ShieldAlert size={14} className="shrink-0 mt-0.5" />
            <span className="break-all">{errorMessage}</span>
          </div>
        )}

        {infoMessage && (
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-xs font-mono text-cyan-700 dark:text-cyan-400 flex items-start gap-2.5 mb-4 animate-[fadeIn_0.3s_ease-out]">
            <CheckCircle size={14} className="shrink-0 mt-0.5" />
            <span>{infoMessage}</span>
          </div>
        )}

        {authSuccess ? (
          /* SUCCESS LOGGED IN STATE */
          <div className="text-center py-6 space-y-4 font-mono">
            <ShieldCheck size={40} className="text-cyan-500 dark:text-cyan-400 mx-auto animate-pulse" />
            <h3 className="text-sm font-bold text-zinc-800 dark:text-cyan-300">UPLINK SYNCHRONOUS CHANNEL STANDBY</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400/70 max-w-[280px] mx-auto">
              Your biometric verification credentials are safe and authenticated. Workspace links are live.
            </p>
            <div className="p-3.5 bg-cyan-500/5 border border-cyan-500/10 rounded-xl text-[10px] text-cyan-600 dark:text-cyan-400/70 text-left space-y-1.5 break-all max-w-sm mx-auto">
              <div className="flex justify-between border-b border-cyan-500/10 pb-1">
                <span>UID FIELD:</span>
                <span className="font-semibold">{auth.currentUser?.uid.slice(0, 8)}...</span>
              </div>
              <div className="flex justify-between border-b border-cyan-500/10 pb-1">
                <span>CHANNEL IDENT:</span>
                <span className="font-semibold">{auth.currentUser?.email || auth.currentUser?.phoneNumber || "Biometrics"}</span>
              </div>
              <div className="flex justify-between">
                <span>SIGNATURE:</span>
                <span className="font-semibold text-emerald-500 dark:text-emerald-400">ACTIVE VERIFIED</span>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="text-zinc-400 hover:text-red-500 text-[10px] underline uppercase font-bold cursor-pointer transition-all duration-200 mt-2 inline-block"
            >
              LOG_OUT_CORE_UPLINK
            </button>
          </div>
        ) : authLoading && loginMethod === "phone" && otpSent === false ? (
          /* LOADING PROGRESS STAGE */
          <div className="text-center py-12 space-y-4 font-mono">
            <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-cyan-500 dark:text-cyan-400 tracking-widest animate-pulse font-semibold">BOOTING SMS PROTOCOLS...</p>
          </div>
        ) : (
          /* CORE LOGIN SCHEMES */
          <div className="space-y-4">
            {/* GOOGLE INTEGRATION CONTROLLERS */}
            <button
              onClick={handleGoogleLogin}
              className="w-full relative py-3 px-5 border border-zinc-200 dark:border-white/15 bg-white/45 dark:bg-white/5 hover:bg-zinc-50 dark:hover:bg-white/10 text-zinc-800 dark:text-white font-mono text-xs font-semibold rounded-xl flex items-center justify-center gap-3 transition-all duration-300 shadow-sm active:scale-98"
            >
              <Chrome className="w-4 h-4 text-cyan-500" />
              <span>Continue with Google Secure Auth</span>
            </button>

            {/* SEPARATOR */}
            <div className="flex items-center gap-3 my-4 select-none">
              <div className="h-[0.5px] flex-1 bg-zinc-200 dark:bg-outline-variant/30"></div>
              <span className="font-mono text-[9px] text-zinc-400 dark:text-on-surface-variant/50 uppercase tracking-widest">or integrate via</span>
              <div className="h-[0.5px] flex-1 bg-zinc-200 dark:bg-outline-variant/30"></div>
            </div>

            {/* METHOD SELECTION TABS */}
            <div className="grid grid-cols-2 gap-2 bg-zinc-100 dark:bg-black/20 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setLoginMethod("email");
                  setErrorMessage("");
                  setInfoMessage("");
                }}
                className={`py-2 text-xs font-mono font-semibold rounded-lg transition-all cursor-pointer ${
                  loginMethod === "email" 
                    ? "bg-white dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 shadow-sm" 
                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-white"
                }`}
              >
                Retinal Email Link
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginMethod("phone");
                  setErrorMessage("");
                  setInfoMessage("");
                }}
                className={`py-2 text-xs font-mono font-semibold rounded-lg transition-all cursor-pointer ${
                  loginMethod === "phone" 
                    ? "bg-white dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 shadow-sm" 
                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-white"
                }`}
              >
                Mobile Phone OTP
              </button>
            </div>

            {/* OTP FLOW */}
            {loginMethod === "phone" ? (
              <div className="space-y-4 pt-1">
                {!otpSent ? (
                  <form onSubmit={handleSendOTP} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-mono text-zinc-500 dark:text-cyan-450 uppercase mb-1.5 tracking-wider">
                        Captain Mobile Number (include country code)
                      </label>
                      <div className="relative">
                        <Smartphone size={15} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-cyan-500/60" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+919876543210"
                          className="pl-10 pr-4 py-3 w-full bg-zinc-100/50 dark:bg-cyan-950/10 border border-zinc-200 dark:border-cyan-500/20 rounded-xl text-xs text-zinc-800 dark:text-white font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500/40"
                          required
                          disabled={authLoading}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={authLoading}
                      className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-white dark:text-black font-semibold rounded-xl font-mono text-xs tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98 shadow-md"
                    >
                      <Send size={13} />
                      {authLoading ? "DISPATCHING CODE..." : "DISPATCH OTP LINK"}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOTP} className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
                    <div>
                      <label className="block text-[10px] font-mono text-zinc-500 dark:text-cyan-450 uppercase mb-1.5 tracking-wider">
                        6-Digit Neural Decrypt Code
                      </label>
                      <div className="relative">
                        <Lock size={15} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-cyan-500/60" />
                        <input
                          type="text"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                          placeholder="000 000"
                          className="pl-10 pr-4 py-3 w-full tracking-[0.5em] text-center bg-zinc-100/50 dark:bg-cyan-950/10 border border-zinc-200 dark:border-cyan-500/20 rounded-xl text-sm font-bold text-zinc-800 dark:text-white font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500/40"
                          required
                          disabled={authLoading}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setOtpSent(false);
                          setOtpCode("");
                          setErrorMessage("");
                          setInfoMessage("");
                        }}
                        className="flex-1 py-3 border border-zinc-200 dark:border-cyan-500/20 bg-transparent text-zinc-500 dark:text-white dark:text-cyan-400 font-mono text-xs font-semibold rounded-xl text-center hover:bg-zinc-100 dark:hover:bg-cyan-950/10 cursor-pointer active:scale-98"
                      >
                        BACK_CODE
                      </button>

                      <button
                        type="submit"
                        disabled={authLoading}
                        className="flex-[2] py-3 bg-cyan-500 hover:bg-cyan-400 text-white dark:text-black font-semibold rounded-xl font-mono text-xs tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98 shadow-md"
                      >
                        <UserCheck size={14} />
                        {authLoading ? "VERIFYING..." : "AUTHORIZE_LINK"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              /* EMAIL FLOW */
              <form onSubmit={handleEmailSubmit} className="space-y-4 pt-1">
                <div>
                  <label className="block text-[10px] font-mono text-zinc-500 dark:text-cyan-450 uppercase mb-1.5 tracking-wider">Captain Terminal Email</label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-cyan-505/60 text-cyan-500/60" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="captain@aurora.io"
                      className="pl-10 pr-4 py-3 w-full bg-zinc-100/50 dark:bg-cyan-950/10 border border-zinc-200 dark:border-cyan-500/20 rounded-xl text-xs text-zinc-800 dark:text-white font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500/40"
                      required
                    />
                  </div>
                </div>

                {!isLogin && (
                  <div>
                    <label className="block text-[10px] font-mono text-zinc-500 dark:text-cyan-450 uppercase mb-1.5 tracking-wider">Command Callsign Naming (Nickname)</label>
                    <div className="relative">
                      <Terminal size={14} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-cyan-505/60 text-cyan-500/60" />
                      <input
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        placeholder="e.g., NEOMAX"
                        className="pl-10 pr-4 py-3 w-full bg-zinc-100/50 dark:bg-cyan-950/10 border border-zinc-200 dark:border-cyan-500/20 rounded-xl text-xs text-zinc-800 dark:text-white font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500/40"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-mono text-zinc-500 dark:text-cyan-450 uppercase mb-1.5 tracking-wider font-semibold">Sovereign Encryption Passcode Key</label>
                  <div className="relative">
                    <Key size={14} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-cyan-505/60 text-cyan-500/60" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-10 pr-4 py-3 w-full bg-zinc-100/50 dark:bg-cyan-950/10 border border-zinc-200 dark:border-cyan-500/20 rounded-xl text-xs text-zinc-800 dark:text-white font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500/40"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-white dark:text-black font-semibold rounded-xl font-mono text-xs tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98 shadow-md"
                >
                  <UserCheck size={14} />
                  {authLoading ? "SYNAPSE UPDATING..." : isLogin ? "AUTHORIZE_LINK_CODE" : "INITIALIZE_RETINAL_GRID"}
                </button>

                <div className="text-center mt-4 space-y-2.5">
                  <button
                    type="button"
                    onClick={handlePasswordReset}
                    className="block w-full text-zinc-400 hover:text-cyan-500 text-[10px] font-mono underline cursor-pointer transition-colors"
                  >
                    DISPATCH RECOVERY CODE CODE_RESET
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setErrorMessage("");
                      setInfoMessage("");
                    }}
                    className="text-zinc-500 dark:text-zinc-400 hover:text-cyan-500 dark:hover:text-cyan-300 font-mono text-[10px] transition-colors uppercase cursor-pointer tracking-wider"
                  >
                    {isLogin ? "INITIALIZE NEW CAPTAIN BIOMETRIC NODE" : "ALREADY LOADED SOVEREIGN PROFILE?"}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
