import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  onAuthStateChanged,
  signOut,
  User
} from "firebase/auth";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

/* ---------------- GOOGLE LOGIN ---------------- */

export async function continueWithGoogle(): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return {
      success: true,
      user: result.user
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message
    };
  }
}

/* ---------------- PHONE OTP ---------------- */

export function initializeCaptcha(): void {
  const container = document.getElementById("recaptcha-container");
  if (!container) {
    console.warn("recaptcha-container not found in target DOM. Captcha initialization suspended.");
    return;
  }
  
  try {
    (window as any).recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible"
      }
    );
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
      error: err.message
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
      error: err.message
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
