const CACHE = 'ai-agent-hub-v1';
const URLS = [
  './',
  './index.html',
  './css/style.css',
  './js/app.js',
  './js/chat.js',
  './js/dashboard.js',
  './js/agents.js',
  './js/mcp.js',
  './js/settings.js',
  './manifest.json',
];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(URLS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(clients.claim());
});
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).catch(() => new Response('Offline', { status: 503 })))
  );
});
