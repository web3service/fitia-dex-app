const CACHE_NAME = 'fitia-mining-v2';
const ASSETS = ['/', '/index.html', '/css/style.css', '/js/config.js', '/js/contract.js', '/js/web3.js', '/js/app.js', '/js/i18n.js', '/manifest.json'];

self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE_NAME).map(x => caches.delete(x))))); self.clients.claim(); });
self.addEventListener('fetch', e => { e.respondWith(caches.match(e.request).then(r => r || fetch(e.request))); });