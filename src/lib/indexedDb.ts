/**
 * JARVIS X IndexedDB Synaptic Storage System
 * Dedicated persistent offline cache engine for Workspace Mode Chat.
 */

import { ChatMessage } from "../types";

const DB_NAME = "jarvis_memory_engine";
const STORE_NAME = "workspace_chat";
const DB_VERSION = 2;

export function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB is not supported in this client environment."));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(request.error || new Error("Failed to open synaptic database."));
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        // Create store with id as primary key
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
  });
}

/**
 * Loads all chat messages ordered by timestamp/insertion order
 */
export async function getWorkspaceMessages(): Promise<ChatMessage[]> {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const results = request.result as ChatMessage[];
        // Sort items by a parsed insertion sequence or reliable comparison
        // In case mathematical order is better, we can sort them
        resolve(results);
      };

      request.onerror = () => {
        reject(request.error || new Error("Failed to read messages from synaptic indexedDB store."));
      };
    });
  } catch (err) {
    console.warn("IndexedDB not active, using fallback local storage state:", err);
    return [];
  }
}

/**
 * Saves or updates all messages in bulk (usually overwriting with latest array)
 */
export async function saveWorkspaceMessages(messages: ChatMessage[]): Promise<void> {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);

      // Clear existing messages in store first to keep order pristine
      const clearRequest = store.clear();

      clearRequest.onsuccess = () => {
        let errorOccurred = false;
        if (messages.length === 0) {
          resolve();
          return;
        }

        messages.forEach((msg) => {
          const addRequest = store.put(msg);
          addRequest.onerror = () => {
            errorOccurred = true;
          };
        });

        transaction.oncomplete = () => {
          if (errorOccurred) {
            reject(new Error("Failed to save all frames to the database store."));
          } else {
            resolve();
          }
        };
      };

      clearRequest.onerror = () => {
        reject(clearRequest.error || new Error("Failed to prune stale database frames before rewrite."));
      };
    });
  } catch (err) {
    console.warn("IndexedDB write failed:", err);
  }
}

/**
 * Purges all records from the storage database
 */
export async function clearWorkspaceMessages(): Promise<void> {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error || new Error("Failed to sweep the synaptic indexedDB database."));
      };
    });
  } catch (err) {
    console.warn("IndexedDB wipe request thwarted:", err);
  }
}
