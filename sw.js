// Service Worker – Budget (Courses & Fixe)
// Incrémente CACHE_NAME à chaque mise à jour de l'app
const CACHE_NAME = 'budget-app-v1';

// Liste minimale à mettre en cache pour l'offline
const ASSETS = [
'./',
'./index.html',
'./manifest.json',
'./icons/icon-192.png',
'./icons/icon-512.png'
];

self.addEventListener('install', (event) => {
event.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(ASSETS)));
self.skipWaiting();
});

self.addEventListener('activate', (event) => {
event.waitUntil(
caches.keys().then((keys) => Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null))))
);
self.clients.claim();
});

// Réseau d'abord, puis repli sur cache (et on met à jour le cache à chaque succès réseau)
self.addEventListener('fetch', (event) => {
const req = event.request;
event.respondWith(
fetch(req)
.then((res) => {
const clone = res.clone();
caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
return res;
})
.catch(() => caches.match(req).then((res) => res || caches.match('./')))
);
});
