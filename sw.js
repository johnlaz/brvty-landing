// ═══════════════════════════════════════════════════════════════════════════════
// BRVTY Root Service Worker (OPTION A - Single-PWA Mode)
// 
// This is a minimal passthrough service worker at root level.
// The actual app PWA lives at /app/ with its own manifest and service worker.
// This root SW simply activates and claims clients, letting the app SW handle caching.
// ═══════════════════════════════════════════════════════════════════════════════

self.addEventListener('install', event => {
  // Root SW has no assets to precache; skip waiting
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  // Claim all clients immediately
  event.waitUntil(self.clients.claim());
});

// No fetch handler — let browser handle all requests
// The /app/sw.js will intercept /app/ scope requests
