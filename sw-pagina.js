/* Eurotruck — la página funciona SIN INTERNET.
   - La página se pide primero a internet (para tener siempre lo último); si no hay, se usa la copia guardada.
   - Letras y programas de internet (fuentes, Firebase) se guardan y se usan sin conexión.
   - Las fotos de los artículos que ya se vieron quedan guardadas.
   - Lo que va al servidor (/api/...) nunca se guarda aquí: eso lo maneja la página (guarda y sube al volver). */
const V = 'etp-v1';
const PAGINA = 'pagina', LIBS = 'libs', FOTOS = 'fotos';
const MAX_FOTOS = 1500;

self.addEventListener('install', e => {
  e.waitUntil(caches.open(V + PAGINA).then(c => c.add(new Request('/index.html', { cache: 'reload' }))).catch(() => {}).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('etp-') && !k.startsWith(V)).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

function conTiempo(p, ms) { return Promise.race([p, new Promise((_, no) => setTimeout(() => no(new Error('lento')), ms))]); }

async function paginaPrimeroRed(req) {
  const c = await caches.open(V + PAGINA);
  try {
    const r = await conTiempo(fetch(req, { cache: 'no-store' }), 8000);
    if (r && r.ok) { c.put('/index.html', r.clone()); return r; }
    throw new Error('mala respuesta');
  } catch (e) {
    const g = await c.match('/index.html');
    if (g) return g;
    return new Response('<h1>Sin internet</h1><p>La página todavía no estaba guardada en esta PC. Ábrela una vez con internet.</p>', { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }
}
async function guardadoYRenovar(req, nombre) {
  const c = await caches.open(V + nombre);
  const g = await c.match(req);
  const red = fetch(req).then(r => { if (r && (r.ok || r.type === 'opaque')) c.put(req, r.clone()); return r; }).catch(() => null);
  return g || (await red) || new Response('', { status: 504 });
}
async function fotoGuardada(req) {
  const c = await caches.open(V + FOTOS);
  const g = await c.match(req); if (g) return g;
  try {
    const r = await fetch(req);
    if (r && (r.ok || r.type === 'opaque')) { c.put(req, r.clone()); c.keys().then(ks => { if (ks.length > MAX_FOTOS) ks.slice(0, ks.length - MAX_FOTOS).forEach(k => c.delete(k)); }); }
    return r;
  } catch (e) { return new Response('', { status: 504 }); }
}

self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const u = new URL(req.url);
  if (u.pathname.includes('/api/')) return;                       // datos del servidor: los maneja la página
  if (u.origin === location.origin) {
    if (u.pathname.startsWith('/movil')) return;                   // la app del celular tiene su propia copia
    if (req.mode === 'navigate' || u.pathname === '/' || u.pathname === '/index.html') { e.respondWith(paginaPrimeroRed(req)); return; }
    e.respondWith(guardadoYRenovar(req, LIBS)); return;
  }
  if (/fonts\.googleapis\.com|fonts\.gstatic\.com|www\.gstatic\.com\/firebasejs|cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com|unpkg\.com/.test(u.host + u.pathname)) { e.respondWith(guardadoYRenovar(req, LIBS)); return; }
  if (req.destination === 'image') { e.respondWith(fotoGuardada(req)); return; }
});
