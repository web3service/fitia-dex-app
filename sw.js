// FITIA PRO MINER v3 — Service Worker
// Caches core assets for offline PWA / APK experience
const CACHE = 'fitia-v3-v1';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=JetBrains+Mono:wght@500;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.umd.min.js',
  'https://i.ibb.co/CKc7wbNr/IMG-20260226-152843-512-x-512-pixel.webp',
  'https://i.ibb.co/NdCLLsck/IMG-20260302-131520-512-x-512-pixel.webp',
  'https://i.ibb.co/BRGx1GN/IMG-20260228-134642-512-x-512-pixel.webp'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // Network-first for API calls
  if (e.request.url.includes('/rest/v1/') || e.request.url.includes('dexscreener') || e.request.url.includes('coingecko')) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request).catch(() => cached))
  );
});
