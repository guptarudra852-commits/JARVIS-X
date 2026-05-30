// Robust localStorage wrapper protecting against SecurityError and other sandboxing restrictions

const memoryStore: Record<string, string> = {};

export const safeLocalStorage = {
  getItem(key: string): string | null {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch (e) {
      console.warn(`[SafeStorage] Failed to read key "${key}" from localStorage:`, e);
    }
    return memoryStore[key] || null;
  },

  setItem(key: string, value: string): void {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch (e) {
      console.warn(`[SafeStorage] Failed to write key "${key}" to localStorage:`, e);
    }
    memoryStore[key] = String(value);
  },

  removeItem(key: string): void {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (e) {
      console.warn(`[SafeStorage] Failed to remove key "${key}" from localStorage:`, e);
    }
    delete memoryStore[key];
  },

  clear(): void {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.clear();
      }
    } catch (e) {
      console.warn("[SafeStorage] Failed to clear localStorage:", e);
    }
    for (const key in memoryStore) {
      delete memoryStore[key];
    }
  }
};
