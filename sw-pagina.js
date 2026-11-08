/* Eurotruck — la página funciona SIN INTERNET (versión dividida en archivos).
   - Cada página (/ y /anterior/) se pide primero a internet; si no hay, se usa su copia guardada.
   - Diseño, programas, catálogo y fotos llevan "?v=versión": se guardan una vez y no se vuelven a bajar
     hasta que hay versión nueva (así no se mezcla una página nueva con archivos viejos).
   - Lo que va al servidor (/api/...) nunca se guarda aquí. */
const V = 'etp-v2';
const PAGINAS = V + '-paginas', ARCHIVOS = V + '-archivos', FOTOS = V + '-fotos', LIBS = V + '-libs';
const MAX_FOTOS = 2000;

self.addEventListener('install', e => {
  e.waitUntil(caches.open(PAGINAS).then(c => c.add(new Request('/', { cache: 'reload' }))).catch(() => {}).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('etp-') && !k.startsWith(V)).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

const conTiempo = (p, ms) => Promise.race([p, new Promise((_, no) => setTimeout(() => no(new Error('lento')), ms))]);
const clavePagina = u => (u.pathname.startsWith('/anterior') ? '/anterior/' : '/');

async function pagina(req, u) {
  const c = await caches.open(PAGINAS), k = clavePagina(u);
  try {
    const r = await conTiempo(fetch(req, { cache: 'no-store' }), 6000);
    if (r && r.ok) { c.put(k, r.clone()); return r; }
    throw new Error('mala respuesta');
  } catch (e) {
    const g = await c.match(k); if (g) return g;
    return new Response('<meta charset="utf-8"><body style="font-family:sans-serif;background:#06070a;color:#eee;padding:40px"><h1>Sin internet</h1><p>La página todavía no estaba guardada en este equipo. Ábrela una vez con internet.</p>', { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }
}
async function versionado(req) { // archivos con ?v= : primero lo guardado
  const c = await caches.open(ARCHIVOS); const g = await c.match(req); if (g) return g;
  const r = await fetch(req); if (r && r.ok) { c.put(req, r.clone()); limpiarViejos(c, req); } return r;
}
async function limpiarViejos(c, req) { // borra la versión anterior del mismo archivo
  const base = new URL(req.url); const ks = await c.keys();
  for (const k of ks) { const u = new URL(k.url); if (u.pathname === base.pathname && u.search !== base.search) c.delete(k); }
}
async function guardadoYRenovar(req, nombre) {
  const c = await caches.open(nombre); const g = await c.match(req);
  const red = fetch(req).then(r => { if (r && (r.ok || r.type === 'opaque')) c.put(req, r.clone()); return r; }).catch(() => null);
  return g || (await red) || new Response('', { status: 504 });
}
async function foto(req) {
  const c = await caches.open(FOTOS); const g = await c.match(req); if (g) return g;
  try { const r = await fetch(req); if (r && (r.ok || r.type === 'opaque')) { c.put(req, r.clone()); c.keys().then(ks => { if (ks.length > MAX_FOTOS) ks.slice(0, ks.length - MAX_FOTOS).forEach(k => c.delete(k)); }); } return r; }
  catch (e) { return new Response('', { status: 504 }); }
}

self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const u = new URL(req.url);
  if (u.pathname.includes('/api/') || u.pathname === '/version.json') return;  // datos y versión: siempre de internet
  if (u.origin === location.origin) {
    if (u.pathname.startsWith('/movil')) return;                                // la app del celular tiene su propia copia
    if (req.mode === 'navigate' || /^\/(index\.html)?$|^\/anterior\/?(index\.html)?$/.test(u.pathname)) { e.respondWith(pagina(req, u)); return; }
    if (u.searchParams.has('v')) { e.respondWith(versionado(req)); return; }
    if (req.destination === 'image' || u.pathname.startsWith('/img/')) { e.respondWith(foto(req)); return; }
    e.respondWith(guardadoYRenovar(req, LIBS)); return;
  }
  if (/fonts\.googleapis\.com|fonts\.gstatic\.com|www\.gstatic\.com\/firebasejs|cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com|unpkg\.com/.test(u.host + u.pathname)) { e.respondWith(guardadoYRenovar(req, LIBS)); return; }
  if (req.destination === 'image') { e.respondWith(foto(req)); return; }
});
