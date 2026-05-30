import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  onAuthStateChanged,
  signOut,
  User,
  signInAnonymously
} from "firebase/auth";
import { auth } from "./firebase";

export { auth };

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

/* ---------------- ERROR FORMATTING Helper ---------------- */

export function formatAuthError(err: any): string {
  if (err && err.code) {
    return `${err.code}: ${err.message}`;
  }
  return err?.message || String(err);
}

/* ---------------- GUEST LOGIN ---------------- */

export async function continueAsGuest(): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const result = await signInAnonymously(auth);
    return {
      success: true,
      user: result.user
    };
  } catch (err: any) {
    return {
      success: false,
      error: formatAuthError(err)
    };
  }
}

/* ---------------- GOOGLE LOGIN ---------------- */

export async function continueWithGoogle(): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const isSandbox = typeof window !== "undefined" && window.self !== window.top;
    if (isSandbox) {
      await signInWithRedirect(auth, googleProvider);
      return {
        success: true
      };
    } else {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        return {
          success: true,
          user: result.user
        };
      } catch (popupErr: any) {
        console.warn("Google signInWithPopup blocked/failed, trying redirect fallback:", popupErr);
        await signInWithRedirect(auth, googleProvider);
        return {
          success: true
        };
      }
    }
  } catch (err: any) {
    return {
      success: false,
      error: formatAuthError(err)
    };
  }
}

// Check redirect result on mount
export async function checkRedirectResult(): Promise<User | null> {
  try {
    const result = await getRedirectResult(auth);
    return result ? result.user : null;
  } catch (err) {
    console.error("Failed to parse Google redirect auth result:", err);
    return null;
  }
}

/* ---------------- PHONE OTP ---------------- */

export async function initializeCaptcha(): Promise<void> {
  const container = document.getElementById("recaptcha-container");
  if (!container) {
    console.warn("recaptcha-container not found in target DOM. Captcha initialization suspended.");
    return;
  }
  
  try {
    // Clear any previous instance from window to prevent double mounting or stale DOM reference issues
    if ((window as any).recaptchaVerifier) {
      try {
        await (window as any).recaptchaVerifier.clear();
      } catch (e) {
        console.warn("Error clearing previous recaptchaVerifier instance:", e);
      }
      (window as any).recaptchaVerifier = null;
    }

    (window as any).recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
        callback: () => {
          console.log("reCAPTCHA solved");
        }
      }
    );
    await (window as any).recaptchaVerifier.render();
    console.log("RecaptchaVerifier initialized successfully.");
  } catch (err: any) {
    console.error("Failed to initialize recaptcha verifier:", err);
  }
}

export async function sendOTP(phone: string): Promise<{ success: boolean; error?: string }> {
  try {
    const appVerifier = (window as any).recaptchaVerifier;
    if (!appVerifier) {
      throw new Error("Captcha verifier not initialized. Call initializeCaptcha() first.");
    }

    const confirmation = await signInWithPhoneNumber(auth, phone, appVerifier);
    (window as any).confirmationResult = confirmation;

    return {
      success: true
    };
  } catch (err: any) {
    return {
      success: false,
      error: formatAuthError(err)
    };
  }
}

export async function verifyOTP(code: string): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const confirmationResult = (window as any).confirmationResult;
    if (!confirmationResult) {
      throw new Error("No pending confirmation result found. Run sendOTP() first.");
    }

    const result = await confirmationResult.confirm(code);
    return {
      success: true,
      user: result.user
    };
  } catch (err: any) {
    return {
      success: false,
      error: formatAuthError(err)
    };
  }
}

/* ---------------- AUTH STATE ---------------- */

export function authListener(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
}

/* ---------------- LOGOUT ---------------- */

export async function logout(): Promise<void> {
  await signOut(auth);
}
