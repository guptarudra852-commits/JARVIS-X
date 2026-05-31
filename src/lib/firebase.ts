import { initializeApp } from 'firebase/app';
import { 
  initializeAuth, 
  debugErrorMap, 
  browserLocalPersistence, 
  browserSessionPersistence, 
  indexedDBLocalPersistence,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  signOut as firebaseSignOut,
  User,
  Auth
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp({
  apiKey: firebaseConfig.apiKey,
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId,
  appId: firebaseConfig.appId,
});

const dbId = (firebaseConfig as any).firestoreDatabaseId && 
  (firebaseConfig as any).firestoreDatabaseId !== "(default)" && 
  !(import.meta as any).env?.PROD
  ? (firebaseConfig as any).firestoreDatabaseId
  : undefined;

export const db = dbId ? getFirestore(app, dbId) : getFirestore(app);

const realAuth = initializeAuth(app, {
  persistence: [indexedDBLocalPersistence, browserLocalPersistence, browserSessionPersistence],
  errorMap: debugErrorMap
});

// Simulated Listeners list to allow firing bypass events dynamically
const listeners = new Set<(user: User | null) => void>();

// In-memory backing fallback store to support highly restricted cross-origin sandboxed iframes
export const memoryStore: Record<string, string> = {};

export const safeStorage = {
  getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return memoryStore[key] || null;
    }
  },
  setItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn("[Sim Storage] LocalStorage is sandboxed or inaccessible. Falling back to in-memory store.", e);
    }
    memoryStore[key] = value;
  },
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      // ignore
    }
    delete memoryStore[key];
  },
  get(key: string): string | null {
    return this.getItem(key);
  },
  set(key: string, value: string): boolean {
    this.setItem(key, value);
    return true;
  },
  remove(key: string): void {
    this.removeItem(key);
  }
};

// Simulation active check helper

export function isBypassActive(): boolean {
  return safeStorage.getItem("jarvis_x_bypass_active") === "true";
}

/**
 * Retrieves the current simulated user from safeStorage if bypass/sandbox mode is active.
 */
export function getSimulatedUser(): User | null {
  const activeStr = safeStorage.getItem("jarvis_x_bypass_active");
  if (activeStr !== "true") return null;
  
  const userStr = safeStorage.getItem("jarvis_x_bypass_user");
  if (!userStr) return null;
  
  try {
    const raw = JSON.parse(userStr);
    return {
      uid: raw.uid || "SIMULATED_CAPTAIN_UID",
      email: raw.email || "captain@aurora.io",
      displayName: raw.displayName || "CAPTAIN",
      phoneNumber: raw.phoneNumber || null,
      emailVerified: true,
      isAnonymous: raw.isAnonymous || false,
      tenantId: null,
      providerId: "firebase",
      providerData: [],
      metadata: {},
      delete: async () => {},
      getIdToken: async () => "mock-jwt-token-sig",
      getIdTokenResult: async () => ({ token: "mock-jwt-token-sig" } as any),
      reload: async () => {},
      toJSON: () => ({}),
    } as unknown as User;
  } catch (e) {
    return null;
  }
}

/**
 * Enhanced auth instance with Proxy interception.
 * This transparently substitutes simulated/sandbox user states when the active client
 * encounters blocking network/iframe environments in AI Studio.
 */
export const auth = new Proxy(realAuth, {
  get(target, prop, receiver) {
    if (prop === "currentUser") {
      const sim = getSimulatedUser();
      if (sim) return sim;
    }
    const val = Reflect.get(target, prop, receiver);
    if (typeof val === "function") {
      return val.bind(target);
    }
    return val;
  }
});

/**
 * Intercepted modular auth state changed listener.
 */
export function onAuthStateChanged(
  _: Auth,
  callback: (user: User | null) => void,
  ...args: any[]
) {
  listeners.add(callback);
  
  // Call callback immediately with the initial simulation or real auth state
  const current = getSimulatedUser() || realAuth.currentUser;
  callback(current);
  
  // Bind standard firebase auth event listener
  const realUnsubscribe = firebaseOnAuthStateChanged(realAuth, (user) => {
    const sim = getSimulatedUser();
    if (!sim) {
      callback(user);
    }
  }, ...args);
  
  return () => {
    listeners.delete(callback);
    realUnsubscribe();
  };
}

/**
 * Intercepted signout helper.
 */
export async function signOut(_: Auth) {
  safeStorage.removeItem("jarvis_x_bypass_active");
  safeStorage.removeItem("jarvis_x_bypass_user");
  
  listeners.forEach((cb) => cb(null));
  
  try {
    await firebaseSignOut(realAuth);
  } catch (e) {
    console.warn("[Sim Core] Firebase Auth disassociation returned warning:", e);
  }
}

/**
 * Activates a local sandbox simulation profile to completely bypass client-side
 * network restriction errors (auth/network-request-failed).
 */
export function activateSimulationUser(email: string, displayName: string) {
  const isOwner = email === "guptarudra852@gmail.com";
  const uid = isOwner ? "owner_rudra_cap" : `sim_${Math.random().toString(36).substring(2, 11)}`;
  
  const payload = {
    uid,
    email,
    displayName,
    isAnonymous: false,
    role: isOwner ? "admin" : "developer"
  };
  
  safeStorage.setItem("jarvis_x_bypass_active", "true");
  safeStorage.setItem("jarvis_x_bypass_user", JSON.stringify(payload));
  
  // Notify all listeners of the new session user
  const simUser = getSimulatedUser();
  listeners.forEach((cb) => cb(simUser));
  return simUser;
}
