import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Protect sandboxed iframes against localStorage SecurityError at the global level
try {
  // Check if localStorage is accessible
  const testKey = "__jarvis_sandbox_test__";
  window.localStorage.setItem(testKey, "test");
  window.localStorage.removeItem(testKey);
} catch (e) {
  console.warn("[Sandbox Guard] Native localStorage is restricted inside sandboxed iframe. Overriding with clean in-memory fallback.");
  const memoryStore: Record<string, string> = {};
  const mockLocalStorageDefault = {
    getItem(key: string): string | null {
      return memoryStore[key] || null;
    },
    setItem(key: string, value: string): void {
      memoryStore[key] = String(value);
    },
    removeItem(key: string): void {
      delete memoryStore[key];
    },
    clear(): void {
      for (const key in memoryStore) {
        delete memoryStore[key];
      }
    },
    key(index: number): string | null {
      return Object.keys(memoryStore)[index] || null;
    },
    get length(): number {
      return Object.keys(memoryStore).length;
    }
  };

  try {
    Object.defineProperty(window, "localStorage", {
      value: mockLocalStorageDefault,
      writable: true,
      configurable: true
    });
  } catch (defineError) {
    console.warn("[Sandbox Guard] Cannot redefine window.localStorage property directly. Falling back to local try-catch systems.", defineError);
  }
}

// Register JARVIS X Autonomous SW
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('JARVIS X SW: Service Worker connected successfully with scope:', registration.scope);
      })
      .catch((error) => {
        console.error('JARVIS X SW: Service Worker offline sync link failed:', error);
      });
  });
}

createRoot(document.getElementById('root')!).render(
  <>
    <App />
  </>
);
