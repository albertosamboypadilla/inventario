// Guarda la app, el catálogo y las fotos en el celular para que abra rápido y funcione sin
// internet en la zona del almacén (una vez que ya se vieron, quedan guardadas).
const VERSION = 'etm-v44';
const FOTOS = 'etm-fotos-v1';
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'catalogo.json', '../img/mascota-rinoceronte.svg'];
self.addEventListener('install', e=>{ e.waitUntil(caches.open(VERSION).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())); });
self.addEventListener('activate', e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION && k!==FOTOS).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch', e=>{
  const url = new URL(e.request.url);
  if(e.request.method !== 'GET') return;
  const esFoto = url.hostname === 'dieseltechnic.tiny.pictures' || url.pathname.includes('/foto/');
  if(url.pathname.includes('/api/') && !esFoto) return;               // datos en vivo del servidor: siempre de la red
  const sameOrigin = url.origin === location.origin;
  const isLib = url.hostname === 'cdn.jsdelivr.net';
  if(!sameOrigin && !isLib && !esFoto) return;                        // lo demás: normal
  if(esFoto){
    // Fotos de artículos: una vez vista la foto, queda guardada para siempre sin signal
    // (cache-first) — y se refresca en segundo plano para la próxima vez.
    e.respondWith(caches.open(FOTOS).then(c=> c.match(e.request).then(m=>{
      const red = fetch(e.request).then(r=>{ if(r.ok) c.put(e.request, r.clone()); return r; }).catch(()=>null);
      return m || red || new Response('', {status: 404});
    })));
    return;
  }
  // red primero (para tener la última versión) y si no hay internet, lo guardado
  e.respondWith(fetch(e.request).then(r=>{ if(r.ok){ const cp = r.clone(); caches.open(VERSION).then(c=>c.put(e.request, cp)); } return r; })
    .catch(()=>caches.match(e.request).then(m=>m || caches.match('index.html'))));
});
