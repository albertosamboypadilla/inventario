// Guarda la app y el catálogo en el celular para que abra rápido y funcione sin internet.
const VERSION = 'etm-v1';
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'catalogo.json'];
self.addEventListener('install', e=>{ e.waitUntil(caches.open(VERSION).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())); });
self.addEventListener('activate', e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch', e=>{
  const url = new URL(e.request.url);
  if(e.request.method !== 'GET') return;
  if(url.pathname.includes('/api/')) return;                         // datos del servidor: siempre en vivo
  const sameOrigin = url.origin === location.origin;
  const isLib = url.hostname === 'cdn.jsdelivr.net';
  if(!sameOrigin && !isLib) return;                                   // fotos y demás: normal
  // red primero (para tener la última versión) y si no hay internet, lo guardado
  e.respondWith(fetch(e.request).then(r=>{ if(r.ok){ const cp = r.clone(); caches.open(VERSION).then(c=>c.put(e.request, cp)); } return r; })
    .catch(()=>caches.match(e.request).then(m=>m || caches.match('index.html'))));
});
