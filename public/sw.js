const CACHE_NAME = "jarvis-x-v4";
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/src/main.tsx",
  "/src/index.css"
];

// Install Event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("JARVIS X SW: Pre-caching static neural interfaces...");
      return cache.addAll(STATIC_ASSETS);
    })
  );
  // Force active immediately
  self.skipWaiting();
});

// Activate Event
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("JARVIS X SW: Purging stale holographic cache keys:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Interceptor for true offline capacity
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Skip POST requests or external API calls for cache-write, but fallback for healthchecks
  if (req.method !== "GET") {
    return;
  }

  // Handle same-origin assets or specific vendor fonts/scripts
  event.respondWith(
    caches.match(req).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch fresh copy in the background (stale-while-revalidate pattern)
        fetch(req)
          .then((networkResponse) => {
            if (networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(req, networkResponse);
              });
            }
          })
          .catch(() => {
            // Silently ignore background refresh fails
          });
        return cachedResponse;
      }

      // If not in cache, go to network
      return fetch(req)
        .then((networkResponse) => {
          // Cache non-api same-origin assets
          if (
            networkResponse.status === 200 &&
            !url.pathname.startsWith("/api/")
          ) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(req, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // If network is completely offline, return standard offline response for HTML navigation
          if (req.headers.get("accept")?.includes("text/html")) {
            return caches.match("/");
          }
        });
    })
  );
});
