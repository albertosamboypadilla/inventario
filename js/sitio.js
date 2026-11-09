// EUROTRUCK · interfaz nueva: portada 3D, EPC por chasis, "no soy un robot", animaciones.
// Usa las funciones y datos que ya existen en app.js (products, peekInv, addToCart, etc.).
import { montarCamion } from '/js/piezas3d.js';

const $ = s => document.querySelector(s);
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const tr2 = (es, en) => (window.currentLang === 'en' || (typeof currentLang !== 'undefined' && currentLang === 'en')) ? en : es;
const norm = v => String(v || '').toUpperCase().replace(/[^A-Z0-9]/g, '');

/* ───────── Sistemas del camión (mismo texto que la categoría del catálogo) ───────── */
const SIS = [
  ['Motor', 'Engine', 'M4 10h3l2-3h6l2 3h3v8h-3l-2 2H9l-2-2H4Z'],
  ['Caja de cambios', 'Gearbox', 'M6 4v16M12 4v16M18 4v8M6 12h12'],
  ['Embrague y pedal', 'Clutch', 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 5a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z'],
  ['Sistema de freno', 'Brakes', 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 6a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z'],
  ['Suspensión', 'Suspension', 'M8 3v4l8 2-8 2 8 2-8 2 8 2v4'],
  ['Ejes', 'Axles', 'M2 12h20M5 8v8M19 8v8M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z'],
  ['Dirección', 'Steering', 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 7v11M3.5 9.5 12 12l8.5-2.5'],
  ['Sistema de refrigeración', 'Cooling', 'M12 2v20M4.9 4.9l14.2 14.2M2 12h20M4.9 19.1 19.1 4.9'],
  ['Sistema de combustible', 'Fuel', 'M5 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M3 21h14M15 9l3 3v6a2 2 0 0 0 4 0V8l-3-3'],
  ['Sistema de escape', 'Exhaust', 'M3 16h10a3 3 0 0 0 3-3V5M16 5h4M7 20c1-1 3-1 4 0'],
  ['Sistema eléctrico', 'Electrical', 'M13 2 4 14h7l-1 8 9-12h-7Z'],
  ['Cabina', 'Cab', 'M4 20V8l3-5h10v17M4 12h13M10 3v9'],
  ['Carrocería', 'Body & chassis', 'M2 17h20M5 17V9h14v8M8 9V5h8v4'],
  ['Árbol de transmisión', 'Driveshaft', 'M3 12h18M6 9v6M18 9v6'],
  ['Bujes y ruedas', 'Wheels & hubs', 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 7a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z'],
  ['Partes universales / Accesorios', 'Universal & accessories', 'M4 7h16M4 12h16M4 17h10']
];
const SIS_EN = Object.fromEntries(SIS.map(s => [s[0], s[1]]));
const icono = d => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg>`;
// piezas antiguas del catálogo detallado no traen sistema: se deduce por el nombre
const PISTAS = [
  [/fren|zapata|pastilla|disco de freno|tambor|calder|válvula de freno|servo/i, 'Sistema de freno'],
  [/embrague|pedal/i, 'Embrague y pedal'], [/caja de cambio|sincron|selector|palanca de cambio/i, 'Caja de cambios'],
  [/radiador|bomba de agua|termostato|ventilador|refriger|intercooler/i, 'Sistema de refrigeración'],
  [/escape|silenciador|catalizador/i, 'Sistema de escape'], [/combustible|inyector|bomba de alimentación|filtro de gasoil|tanque/i, 'Sistema de combustible'],
  [/bombilla|faro|sensor|interruptor|relé|alternador|motor de arranque|cable|luz/i, 'Sistema eléctrico'],
  [/amortiguador|ballesta|fuelle|suspensi|estabiliz|cojinete suspensión/i, 'Suspensión'], [/direcci|rótula|barra de acoplamiento/i, 'Dirección'],
  [/diferencial|corona|piñón|semieje|eje/i, 'Ejes'], [/cardán|árbol de transmisión|cruceta/i, 'Árbol de transmisión'],
  [/rueda|buje|rodamiento de rueda|tuerca de rueda/i, 'Bujes y ruedas'], [/cabina|puerta|espejo|limpiaparabrisas|asiento/i, 'Cabina'],
  [/pistón|camisa|culata|válvula|junta|turbo|árbol de levas|cigüeñal|biela|colector|cárter|volante|motor/i, 'Motor']
];
const SIS_OK = new Set(SIS.map(s => s[0]));
function sistemaDe(p) {
  if (SIS_OK.has(p.cat)) return p.cat;
  if (p._sis !== undefined) return p._sis;
  const t = (p.title || '') + ' ' + (p.cat || ''); for (const [re, s] of PISTAS) if (re.test(t)) return (p._sis = s);
  return (p._sis = 'Partes universales / Accesorios');
}
function subgrupo(p) { let t = String(p.title || '').split(/[,(]/)[0].trim(); t = t.replace(/\s+\d[\d\s.\-/]*$/, '').trim(); return t ? t[0].toUpperCase() + t.slice(1) : '—'; }

/* ───────── VIN / chasis ───────── */
const WMI = { YS2: 'Scania', YS4: 'Scania', '9BS': 'Scania', XLE: 'Scania', YV1: 'Volvo', YV2: 'Volvo', YV3: 'Volvo', '9BV': 'Volvo', WDB: 'Mercedes-Benz', WDA: 'Mercedes-Benz', WDF: 'Mercedes-Benz', W1T: 'Mercedes-Benz', WDD: 'Mercedes-Benz', '9BM': 'Mercedes-Benz', WMA: 'MAN', WMB: 'MAN', '9BW': 'MAN', ZCF: 'Iveco', ZCN: 'Iveco', XLR: 'DAF', XL9: 'DAF', VF6: 'Renault', VF7: 'Renault' };
const MARCAS = ['Scania', 'Volvo', 'Mercedes-Benz', 'MAN', 'Iveco', 'DAF'];
function leerVIN(v) {
  const c = norm(v); const out = { chasis: c, marca: null, anio: null, valido: false };
  if (c.length >= 3) out.marca = WMI[c.slice(0, 3)] || null;
  if (c.length === 17) {
    out.valido = true; const y = 'ABCDEFGHJKLMNPRSTVWXY123456789', k = y.indexOf(c[9]);
    if (k >= 0) { const base = k + 1980; out.anio = base + 30 <= new Date().getFullYear() + 1 ? base + 30 : base; }
  }
  return out;
}
const MEM_KEY = 'et_epc_chasis';
const mem = { get() { try { return JSON.parse(localStorage.getItem(MEM_KEY) || '{}'); } catch (e) { return {}; } }, set(o) { try { localStorage.setItem(MEM_KEY, JSON.stringify(o)); } catch (e) {} } };

/* ───────── Índice de números originales (OE) ───────── */
let OE = null;
function indiceOE() {
  if (OE) return OE; OE = new Map();
  const put = (k, ref) => { k = norm(k).replace(/^(SCANIA|VOLVO|MAN|IVECO|DAF|MERCEDESBENZ|RENAULT|ZG)/, ''); if (k.length < 4) return; let a = OE.get(k); if (!a) OE.set(k, a = new Set()); a.add(ref); };
  for (const p of window.__etProducts()) { for (const r of (p.refsList || [])) put(String(r).split(':').pop(), p.ref); if (p.oe) put(p.oe, p.ref); }
  return OE;
}
function equivalentes(p) {
  const idx = indiceOE(), out = new Set();
  for (const r of (p.refsList || [])) { const k = norm(String(r).split(':').pop()); (idx.get(k) || []).forEach(x => out.add(x)); }
  out.delete(p.ref); return [...out];
}

/* ───────── EPC ───────── */
const EPC = (() => {
  let visor = null;
  const estado = { vin: null, marca: null, sis: null, sub: null, ref: null, filtro: '', pn: '', lim: 40, tab: 'pieza', vendidas: false, lam: null, edit: false, pin: null };
  /* Láminas propias: imagen subida por Eurotruck + puntos numerados enlazados al inventario (guardadas en este equipo) */
  const LDB = { db: null,
    abrir() { if (this.db) return Promise.resolve(this.db); return new Promise((ok, no) => { const r = indexedDB.open('et_laminas', 1); r.onupgradeneeded = () => r.result.createObjectStore('lam', { keyPath: 'id' }); r.onsuccess = () => ok(this.db = r.result); r.onerror = () => no(r.error); }); },
    async todas() { const db = await this.abrir(); return new Promise(ok => { const q = db.transaction('lam').objectStore('lam').getAll(); q.onsuccess = () => ok(q.result || []); q.onerror = () => ok([]); }); },
    async poner(l) { const db = await this.abrir(); return new Promise(ok => { const t = db.transaction('lam', 'readwrite'); t.objectStore('lam').put(l); t.oncomplete = ok; t.onerror = ok; }); },
    async quitar(id) { const db = await this.abrir(); return new Promise(ok => { const t = db.transaction('lam', 'readwrite'); t.objectStore('lam').delete(id); t.oncomplete = ok; t.onerror = ok; }); } };
  let LAMS = [];
  const lamDe = id => LAMS.find(l => l.id === id);
  const puedeEditar = () => typeof currentUser !== 'undefined' && !!currentUser;
  // Sincronización con el servidor: todos los equipos ven las mismas láminas
  const SRVL = () => { try { const v = typeof srvSettings === 'function' ? srvSettings() : null; return v && v.url ? v : null; } catch (e) { return null; } };
  const subidas = new Map();
  function subir(l, ya) {
    clearTimeout(subidas.get(l.id));
    subidas.set(l.id, setTimeout(async () => { const v = SRVL(); if (!v || !v.token || !puedeEditar()) return;
      try { const body = Object.assign({}, l, { img: l.enServidor ? undefined : l.img });
        const r = await fetch(v.url + '/api/laminas/' + encodeURIComponent(l.id), { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + v.token }, body: JSON.stringify(body) });
        if (r.ok) { const j = await r.json(); l.mod = j.mod; l.pend = false; l.enServidor = true; LDB.poner(l); }
        else { const j = await r.json().catch(() => ({})); typeof showToast === 'function' && showToast(tr2('No se pudo guardar la lámina en el servidor: ', 'Could not save the sheet on the server: ') + (j.error || r.status)); }
      } catch (e) { /* sin conexión: queda pendiente y se sube la próxima vez */ } }, ya ? 0 : 1200));
  }
  // Despieces 3D propios que vienen con la página (se enlazan a las piezas desde «Editar lámina»)
  const MODELOS3D = [{ id: 'M3d-diferencial', modelo: 'lam-diferencial', titulo: 'Diferencial y carcasa (lámina)', sis: 'Ejes', piezas: [] }, { id: 'M3d-camion', modelo: 'camion', titulo: 'Camión completo 3D (rayos X)', sis: '', piezas: [] }, { id: 'M3d-freno-disco', modelo: 'freno-disco', titulo: 'Freno de disco neumático (3D)', sis: 'Sistema de freno', piezas: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14] }];
  function conModelos(arr) { for (const d of MODELOS3D) if (!arr.some(l => l.id === d.id)) arr.push({ id: d.id, modelo: d.modelo, titulo: d.titulo, sis: d.sis || 'General', sub: '', marca: '', img: '', puntos: d.piezas.map(n => ({ n, x: 0, y: 0, ref: '', nota: '' })), creado: 1, mod: 0 }); return arr; }
  async function cargarLams() {
    let loc = []; try { loc = await LDB.todas(); } catch (e) {}
    const v = SRVL(); let srv = null;
    if (v) { try { if (typeof loadServerConfig === 'function') await loadServerConfig(); const r = await fetch(SRVL().url + '/api/laminas', { cache: 'no-store' }); if (r.ok) srv = (await r.json()).laminas || []; } catch (e) {} }
    if (!srv) return conModelos(loc);
    const base = SRVL().url, m = new Map(srv.map(l => [l.id, Object.assign(l, { img: base + '/api/laminas/' + encodeURIComponent(l.id) + '/img?m=' + l.mod, enServidor: true })]));
    for (const l of loc) { const x = m.get(l.id);
      if (!x) { if (l.enServidor && !l.pend) { LDB.quitar(l.id); continue; } m.set(l.id, l); l.pend = true; subir(l, true); }   // nueva de este equipo: se sube
      else if (l.pend && (l.mod || 0) > x.mod) { l.enServidor = true; m.set(l.id, Object.assign(l, { img: String(l.img).startsWith('data:') ? l.img : x.img })); subir(l, true); } }
    return conModelos([...m.values()]);
  }
  const guardarLam = l => { l.mod = Date.now(); l.pend = true; subir(l); return LDB.poner(l); };
  function borrarLam(id) { LDB.quitar(id); const v = SRVL(); if (v && v.token) fetch(v.url + '/api/laminas/' + encodeURIComponent(id), { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + v.token } }).catch(() => {}); }
  const CK = 'et_epc_cesta';
  const cesta = { get() { try { return JSON.parse(localStorage.getItem(CK) || '[]'); } catch (e) { return []; } }, set(a) { try { localStorage.setItem(CK, JSON.stringify(a)); } catch (e) {} $('#epcCestaN').textContent = a.reduce((n, x) => n + x.q, 0); } };
  const ov = () => $('#epcOverlay');
  const num = s => String(SIS.findIndex(x => x[0] === s) + 1).padStart(2, '0');
  function base() { const m = estado.marca; return window.__etProducts().filter(p => !m || p.brand === m || p.brand === 'Multibrand' || p.brand === 'DT Spare Parts'); }
  function stockDe(ref) { try { const i = peekInv(ref); return { n: Number(i.stock) || 0, loc: (i.location || (i.extraLocations || []).length) ? allLocationsLabel(i) : '' }; } catch (e) { return { n: 0, loc: '' }; } }
  const oe1 = p => { const r = (p.refsList || [])[0] || p.oe || ''; return String(r).split(':').pop(); };

  function vehiculo() {
    const t = $('#epcTruck'), v = estado.vin;
    if (!v) { t.innerHTML = `<div class="mx-veh-in"><span class="mx-k">${tr2('Sin chasis', 'No chassis')}</span><span class="mx-hint">${tr2('Escribe el chasis arriba o elige la marca:', 'Enter the chassis above or choose the brand:')}</span><div class="mx-chips">${MARCAS.map(m => `<button data-marca="${m}" class="${estado.marca === m ? 'is-on' : ''}">${m}</button>`).join('')}<button data-marca="" class="${!estado.marca ? 'is-on' : ''}">${tr2('Todas', 'All')}</button></div></div>`; return; }
    const g = mem.get()[v.chasis] || {}; const foto = FOTOS[estado.marca] ? document.querySelector('#heroMedia img[data-truck="' + FOTOS[estado.marca] + '"]') : null;
    t.innerHTML = `<div class="mx-veh-in">${foto ? `<img class="mx-veh-img" src="${foto.getAttribute('src')}" alt="">` : ''}
      <dl class="mx-spec"><div><dt>${tr2('Chasis / VIN', 'Chassis / VIN')}</dt><dd class="mono">${esc(v.chasis)}</dd></div>
      <div><dt>${tr2('Marca', 'Make')}</dt><dd>${estado.marca ? esc(estado.marca) : `<span class="mx-warn">${tr2('No detectada', 'Not detected')}</span>`}</dd></div>
      <div><dt>${tr2('Año modelo', 'Model year')}</dt><dd>${v.anio || '—'}</dd></div>
      <div class="mx-spec-wide"><dt>${tr2('Cliente / modelo', 'Customer / model')}</dt><dd><input id="epcCliente" maxlength="60" value="${esc(g.cliente || '')}" placeholder="${tr2('Ej: Transporte Pérez · R450', 'E.g. Perez Transport · R450')}"><button id="epcGuardar">${tr2('Guardar', 'Save')}</button></dd></div>
      <div><dt>${tr2('Historial', 'History')}</dt><dd><button class="mx-link" data-vendidas>${(g.piezas || []).length} ${tr2('piezas vendidas', 'parts sold')}</button></dd></div></dl>
      ${estado.marca ? '' : `<div class="mx-chips">${MARCAS.map(m => `<button data-marca="${m}">${m}</button>`).join('')}</div>`}</div>`;
  }
  function arbol() {
    const f = estado.filtro.trim().toLowerCase(), cnt = {}, subs = new Map();
    for (const p of base()) { const s = sistemaDe(p); cnt[s] = (cnt[s] || 0) + 1; if (s === estado.sis) { const k = subgrupo(p); subs.set(k, (subs.get(k) || 0) + 1); } }
    $('#epcTree').innerHTML = SIS.filter(s => cnt[s[0]]).map(s => {
      const abierto = s[0] === estado.sis; let hijos = '';
      if (abierto) { const arr = [...subs].filter(([k]) => !f || k.toLowerCase().includes(f)).sort((a, b) => b[1] - a[1]);
        const ls = LAMS.filter(l => l.sis === s[0]);
        hijos = '<div class="mx-subs">' + ls.map(l => `<button data-lamid="${esc(l.id)}" class="mx-lamb ${l.id === estado.lam ? 'is-on' : ''}"><i>▦</i><span>${esc(l.titulo)}</span><small>${l.puntos.length}</small></button>`).join('') + arr.slice(0, estado.lim).map(([k, n], i) => `<button data-sub="${esc(k)}" class="${k === estado.sub ? 'is-on' : ''}"><i>${num(s[0])}.${String(i + 1).padStart(2, '0')}</i><span>${esc(k)}</span><small>${n}</small></button>`).join('') + (arr.length > estado.lim ? `<button data-more class="mx-more">${tr2('Ver más', 'More')} (${arr.length - estado.lim})</button>` : '') + '</div>'; }
      if (f && !abierto && !(s[0] + s[1]).toLowerCase().includes(f)) return '';
      return `<div class="mx-g ${abierto ? 'is-open' : ''}"><button data-sis="${esc(s[0])}"><i>${num(s[0])}</i><span>${esc(tr2(s[0], s[1]))}</span><small>${cnt[s[0]].toLocaleString()}</small></button>${hijos}</div>`;
    }).join('');
  }
  function migas() {
    let c = [`<button data-go="sis">${esc(estado.marca || tr2('Todas las marcas', 'All makes'))}</button>`];
    if (estado.sis) c.push(`<button data-go="sub">${tr2('Grupo', 'Group')} ${num(estado.sis)} · ${esc(tr2(estado.sis, SIS_EN[estado.sis] || estado.sis))}</button>`);
    if (estado.sub) c.push(`<span>${esc(estado.sub)}</span>`);
    if (estado.lam && lamDe(estado.lam)) c.push(`<span>▦ ${esc(lamDe(estado.lam).titulo)}</span>`);
    if (estado.pn) c = [`<span>${tr2('Búsqueda de N.º de pieza', 'Part no. search')}: <b class="mono">${esc(estado.pn)}</b></span>`];
    $('#epcCrumbs').innerHTML = c.join('<i>›</i>');
    $('#epcIllNote').textContent = estado.sis ? tr2('Ilustración de referencia del grupo', 'Group reference illustration') : tr2('Toca una pieza o elige un grupo a la izquierda', 'Tap a part or choose a group on the left');
  }
  const packN = p => (String(p.pack || '1').match(/\d+/) || ['1'])[0];
  function filas(ps, conGrupo) {
    if (!ps.length) return `<p class="mx-empty">${tr2('No hay piezas para mostrar.', 'No parts to show.')}</p>`;
    return `<table class="mx-table"><thead><tr><th>Ref.</th><th>${tr2('N.º de pieza', 'Part no.')}</th><th class="c">A</th><th>${tr2('Designación', 'Designation')}</th><th>${tr2('N.º original', 'Original no.')}</th><th>${conGrupo ? tr2('Grupo', 'Group') : tr2('Nota', 'Note')}</th><th></th></tr></thead><tbody>` +
      ps.map((p, i) => { const s = stockDe(p.ref); const eqn = s.n > 0 ? 0 : equivalentes(p).reduce((n, r) => n + stockDe(r).n, 0); const nota = s.n > 0 ? `<b class="ok">${s.n} ${tr2('en stock', 'in stock')}</b>${s.loc ? '<br>' + esc(s.loc) : ''}` : eqn > 0 ? `<b class="eqok">${tr2('Equivalente en stock', 'Equivalent in stock')} (${eqn})</b>` : `<span class="no">${tr2('Sin stock', 'Out of stock')}</span>`;
        return `<tr data-ref="${esc(p.ref)}" data-pos="${i + 1}" class="${p.ref === estado.ref ? 'is-on' : ''}"><td class="mono r">${i + 1}${p.refsList && p.refsList.length ? ' <i class="mx-par">§</i>' : ''}</td><td class="mono b">${esc(p.sku || p.ref)}</td><td class="c">${packN(p)}</td><td class="d">${esc(p.title)}</td><td class="mono">${esc(oe1(p))}</td><td class="nota">${conGrupo ? `${num(sistemaDe(p))} · ${esc(subgrupo(p))}` : nota}</td><td><button class="mx-add" data-add="${esc(p.ref)}" title="${tr2('Agregar a la lista de pedido', 'Add to order list')}">＋</button></td></tr>`; }).join('') + '</tbody></table>';
  }
  // Lámina: las piezas (o grupos) dibujadas en blanco y negro técnico, numeradas con flechas, como un plano de despiece
  function lamina(items, titulo) {
    const L = $('#epcLamina'); if (!L) return;
    if (!items.length) { L.innerHTML = `<div class="mx-lam-empty">${tr2('Sin ilustración', 'No illustration')}</div>`; return; }
    const it = items.slice(0, 30);
    L.innerHTML = `<div class="mx-lam-paper"><div class="mx-lam-title">${esc(titulo || '')}</div><div class="mx-lam-grid n${Math.min(it.length, 30)}">` + it.map((x, i) => {
      const lado = i % 4; // flecha hacia distintas esquinas, como en un despiece
      return `<button class="mx-lam-it ${x.on ? 'is-on' : ''}" data-lam="${esc(x.key)}" data-kind="${x.kind}" style="--r:${(i * 37) % 9 - 4}deg"><span class="mx-lam-img"><img loading="lazy" src="${esc(x.img || '')}" alt="" onerror="this.style.visibility='hidden'"></span><svg class="mx-lam-lead l${lado}" viewBox="0 0 40 40" aria-hidden="true"><path d="M2 2 L30 30"/></svg><b class="mx-lam-n">${esc(x.n)}</b></button>`; }).join('') + `</div>${items.length > 30 ? `<div class="mx-lam-more">+${items.length - 30} ${tr2('posiciones más en la tabla', 'more positions in the table')}</div>` : ''}<div class="mx-lam-foot"><span>EUROTRUCK · EPC</span><span>${tr2('Ilustración de referencia', 'Reference illustration')}</span></div></div>`;
  }
  function imgDe(ps) { const c = ps.find(p => PRODUCT_IMAGE_FILES[p.ref]) || ps[0]; return c ? c.img : ''; }
  function lamStrip() {
    if (!estado.sis) return '';
    const ls = LAMS.filter(l => l.sis === estado.sis && (!estado.sub || !l.sub || l.sub === estado.sub));
    if (!ls.length && !puedeEditar()) return '';
    return `<div class="mx-lams">${ls.map(l => `<button data-lamid="${esc(l.id)}" class="mx-lamc">${l.modelo ? '<span class="mx-lamc3d">3D</span>' : `<img src="${l.img}" alt="">`}<span>${esc(l.titulo)}</span><small>${l.puntos.length} ${tr2('puntos', 'points')}</small></button>`).join('')}${puedeEditar() ? `<button data-lamnew class="mx-lamc nueva"><b>＋</b><span>${tr2('Nueva lámina', 'New sheet')}</span><small>${tr2('Sube una foto o dibujo tuyo', 'Upload your own photo or drawing')}</small></button>` : ''}</div>`;
  }
  function vistaLam() {
    const l = lamDe(estado.lam), L = $('#epcList');
    if (!l) { estado.lam = null; return tabla(); }
    const ed = estado.edit && puedeEditar(), z = estado.zoom || 1;
    const pts = l.puntos.slice().sort((a, b) => a.n - b.n);
    const pins = pts.map(pt => `<button class="mx-pin${pt.ref ? '' : ' sin'}${pt.n === estado.pin ? ' is-pin' : ''}${pt.ref && pt.ref === estado.ref ? ' is-on' : ''}" data-pin="${pt.n}"${pt.ref ? ` data-lam="${esc(pt.ref)}" data-kind="ref"` : ''} style="left:${pt.x}%;top:${pt.y}%">${pt.n}</button>`).join('');
    const rows = pts.map(pt => { const p = pt.ref && PRODUCTS_BY_REF[pt.ref]; const s = p ? stockDe(p.ref) : { n: 0, loc: '' };
      const eqn = p && s.n <= 0 ? equivalentes(p).reduce((n, r) => n + stockDe(r).n, 0) : 0;
      const nota = !p ? `<span class="no">${tr2('Sin enlazar', 'Not linked')}</span>` : s.n > 0 ? `<b class="ok">${s.n} ${tr2('en stock', 'in stock')}</b>${s.loc ? '<br>' + esc(s.loc) : ''}` : eqn > 0 ? `<b class="eqok">${tr2('Equivalente en stock', 'Equivalent in stock')} (${eqn})</b>` : `<span class="no">${tr2('Sin stock', 'Out of stock')}</span>`;
      return `<tr data-pinrow="${pt.n}"${p ? ` data-ref="${esc(p.ref)}"` : ''} class="${(p && p.ref === estado.ref) || pt.n === estado.pin ? 'is-on' : ''}"><td class="mono r">${pt.n}</td><td class="mono b">${p ? esc(p.sku || p.ref) : '—'}</td><td class="d">${p ? esc(p.title) : (l.nombres && l.nombres[pt.n] ? `<i class="mx-n3d">${esc(l.nombres[pt.n])}</i>` : '')}${pt.nota ? `<small class="mx-pnota">${esc(pt.nota)}</small>` : ''}</td><td class="mono">${p ? esc(oe1(p) || pt.oe || '') : esc(pt.oe || '')}</td><td class="nota">${nota}</td></tr>`; }).join('');
    L.innerHTML = `<div class="mx-th mx-lam-h">${ed ? `<input class="mx-lam-tit" data-lamtit maxlength="80" value="${esc(l.titulo)}">` : `<span><button class="mx-lam-arbol" data-lamarbol>☰ ${tr2('Grupos', 'Groups')}</button> ▦ ${esc(l.titulo)} · ${pts.length} ${tr2('piezas', 'parts')}</span>`}${puedeEditar() ? `<span class="mx-lam-btns">${ed ? `<button data-lamfin class="is-ed">✓ ${tr2('Terminar', 'Done')}</button>` : `<button data-lamed>✎ ${tr2('Editar lámina', 'Edit sheet')}</button>`}<button data-lamdel>${tr2('Borrar lámina', 'Delete sheet')}</button></span>` : ''}</div>
      ${ed ? `<div class="mx-lam-tipbar">${tr2('Toca la imagen donde está cada pieza para poner el siguiente número. Toca un número para enlazarlo a tu inventario, moverlo o borrarlo.', 'Tap the image where each part is to drop the next number. Tap a number to link it, move it or delete it.')}</div>` : ''}
      ${l.modelo && l.modelo.startsWith('lam-') ? `<div class="mx-stage es-3d es-lam2"><div class="mx-3d-ctl"><span>${tr2('Pasa el ratón o toca una pieza: se marca en azul y a la derecha sale la pieza', 'Hover or tap a part: it turns blue and shows on the right')}</span></div><div class="mx-3d mx-lam2" id="lam3d"></div></div>` : l.modelo === 'camion' ? `<div class="mx-stage es-3d"><div class="mx-3d-ctl mx-3d-grupos"><button data-c3="" class="is-on">${tr2('Camión completo', 'Whole truck')}</button><button data-c3="motor">Motor</button><button data-c3="caja">${tr2('Caja de cambios', 'Gearbox')}</button><button data-c3="frenos">${tr2('Frenos', 'Brakes')}</button><button data-c3="susp">${tr2('Suspensión', 'Suspension')}</button><button data-c3="escape">${tr2('Escape', 'Exhaust')}</button><button data-c3="trasera">${tr2('Parte trasera y luces', 'Rear & lights')}</button><span>${tr2('Toca una zona del camión · luego la pieza', 'Tap a truck area · then the part')}</span></div><div class="mx-3d" id="lam3d"></div></div>` : l.modelo ? `<div class="mx-stage es-3d"><div class="mx-3d-ctl"><button data-m3="desarmar" class="is-on">${tr2('Desarmado', 'Exploded')}</button><button data-m3="armar">${tr2('Armado', 'Assembled')}</button><button data-m3="vista">${tr2('Vista inicial', 'Reset view')}</button><span>${tr2('Arrastra para girar · rueda para acercar', 'Drag to rotate · wheel to zoom')}</span></div><div class="mx-3d" id="lam3d"></div></div>` : `<div class="mx-stage${ed ? ' is-ed' : ''}${l.dibujo ? ' es-dibujo' : ''}"><div class="mx-zoom"><button data-zoom="-1" aria-label="Alejar">−</button><b>${Math.round(z * 100)}%</b><button data-zoom="1" aria-label="Acercar">＋</button><button data-zoom="0">${tr2('Ajustar', 'Fit')}</button></div><div class="mx-stage-in" style="--z:${z}"><img src="${l.img}" alt="" draggable="false">${pins}</div></div>`}
      <div class="mx-pts-wrap"><table class="mx-table mx-pts"><thead><tr><th>Ref.</th><th>${tr2('N.º de pieza', 'Part no.')}</th><th>${tr2('Designación', 'Designation')}</th><th>${tr2('N.º original', 'Original no.')}</th><th>${tr2('Nota', 'Note')}</th></tr></thead><tbody>${rows || `<tr><td colspan="5" class="mx-empty">${tr2('Todavía no hay puntos. Pulsa «Editar lámina» y toca la imagen.', 'No points yet. Press “Edit sheet” and tap the image.')}</td></tr>`}</tbody></table></div>`;
  }
  let v3d = null, v3dId = null;
  async function montar3d(l) {
    const el = $('#lam3d'); if (!el) return;
    if (v3d) { try { v3d.destruir(); } catch (e) {} v3d = null; }
    try {
      if (l.modelo.startsWith('lam-')) { const m = await import('./laminas3d.js'); if (estado.lam !== l.id || !document.body.contains(el)) return;
        v3d = m.montarLamina(el, { sel: estado.pin, alElegir: n => { const pt = l.puntos.find(x => x.n === n); estado.pin = n; v3d.sel(n); if (estado.edit && puedeEditar()) { tabla(); lado(); return; } if (pt && pt.ref) seleccionar(pt.ref); else { estado.ref = null; document.querySelectorAll('#epcList tr.is-on').forEach(x => x.classList.remove('is-on')); const tr = document.querySelector(`#epcList tr[data-pinrow="${n}"]`); tr && (tr.classList.add('is-on'), tr.scrollIntoView({ block: 'nearest' })); lado(); } } });
        let nuevos = false; for (const pz of v3d.piezas) if (!l.puntos.some(x => x.n === pz.n)) { l.puntos.push({ n: pz.n, x: 0, y: 0, ref: '', nota: '', oe: '' }); nuevos = true; }
        l.nombres = Object.fromEntries(v3d.piezas.map(pz => [pz.n, pz.nombre])); l.cant = Object.fromEntries(v3d.piezas.map(pz => [pz.n, pz.cant]));
        if (nuevos) { vistaLam(); return montar3d(l); } v3dId = l.id; return; }
      if (l.modelo === 'camion') { const m = await import('./camion3d.js'); if (estado.lam !== l.id || !document.body.contains(el)) return;
        const pt0 = l.puntos.find(x => x.n === estado.pin);
        v3d = m.montarCamion(el, { grupo: estado.g3d || null, pieza: estado.pin || null,
          alGrupo: id => { estado.g3d = id; document.querySelectorAll('#epcList [data-c3]').forEach(b => b.classList.toggle('is-on', b.dataset.c3 === (id || ''))); },
          alElegir: n => { const pt = l.puntos.find(x => x.n === n); estado.pin = n; v3d.sel(n); if (pt && pt.ref) seleccionar(pt.ref); else { document.querySelectorAll('#epcList tr.is-on').forEach(x => x.classList.remove('is-on')); const tr = document.querySelector(`#epcList tr[data-pinrow="${n}"]`); tr && (tr.classList.add('is-on'), tr.scrollIntoView({ block: 'nearest' })); lado(); } } });
        let nuevos = false; for (const pz of v3d.piezas) if (!l.puntos.some(x => x.n === pz.n)) { l.puntos.push({ n: pz.n, x: 0, y: 0, ref: '', nota: '' }); nuevos = true; }
        l.nombres = Object.fromEntries(v3d.piezas.map(pz => [pz.n, pz.nombre]));
        if (nuevos) { const t = document.querySelector('#epcList .mx-pts-wrap'); if (t) { vistaLam(); return montar3d(l); } }
        v3dId = l.id; v3d.tags.forEach(b => { const pt = l.puntos.find(x => x.n === Number(b.dataset.pin)); if (pt && pt.ref) { b.dataset.lam = pt.ref; b.dataset.kind = 'ref'; } else b.classList.add('sin'); });
        return; }
      const m = await import('./modelos3d.js'); if (estado.lam !== l.id || !document.body.contains(el)) return;
      v3d = m.montar(el, { modelo: l.modelo, sel: estado.pin, alElegir: n => { const pt = l.puntos.find(x => x.n === n); estado.pin = n; if (pt && pt.ref) seleccionar(pt.ref); else { v3d.sel(n); document.querySelectorAll('#epcList tr.is-on').forEach(x => x.classList.remove('is-on')); const tr = document.querySelector(`#epcList tr[data-pinrow="${n}"]`); tr && tr.classList.add('is-on'); } } });
      v3dId = l.id;
      v3d.tags.forEach(b => { const pt = l.puntos.find(x => x.n === Number(b.dataset.pin)); if (pt && pt.ref) { b.dataset.lam = pt.ref; b.dataset.kind = 'ref'; if (pt.ref === estado.ref) b.classList.add('is-on'); } else b.classList.add('sin'); });
    } catch (e) { console.error('3D', e); el.innerHTML = `<p class="mx-empty">${tr2('Este equipo no puede mostrar el modelo 3D.', 'This device cannot show the 3D model.')}</p>`; }
  }
  function tabla() {
    if (v3d && (!estado.lam || estado.lam !== v3dId)) { try { v3d.destruir(); } catch (e) {} v3d = null; v3dId = null; }
    migas(); const L = $('#epcList'); const bd = document.querySelector('#epcOverlay .mx-body'); bd && bd.classList.toggle('is-desp', !!estado.lam);
    if (estado.lam) { vistaLam(); const l = lamDe(estado.lam); if (l && l.modelo) montar3d(l); return; }
    if (estado.vendidas && estado.vin) { const g = mem.get()[estado.vin.chasis] || {}; const ps = (g.piezas || []).map(r => PRODUCTS_BY_REF[r]).filter(Boolean);
      L.innerHTML = `<div class="mx-th">${tr2('Piezas vendidas a este chasis', 'Parts sold to this chassis')}</div>` + filas(ps, true); lamina(ps.map((p, i) => ({ key: p.ref, kind: 'ref', img: p.img, n: i + 1, on: p.ref === estado.ref })), tr2('Piezas vendidas a este chasis', 'Parts sold to this chassis')); return; }
    if (estado.pn) { const q = norm(estado.pn); const refs = new Set(indiceOE().get(q) || []);
      for (const p of window.__etProducts()) if (norm(p.ref) === q || norm(p.sku) === q || norm(p.gtin) === q) refs.add(p.ref);
      const ps = [...refs].map(r => PRODUCTS_BY_REF[r]).filter(Boolean);
      L.innerHTML = `<div class="mx-th">${tr2('Dónde se usa / coincidencias', 'Where used / matches')} · ${ps.length}</div>` + filas(ps, true); lamina(ps.map((p, i) => ({ key: p.ref, kind: 'ref', img: p.img, n: i + 1, on: p.ref === estado.ref })), tr2('N.º de pieza', 'Part no.') + ' ' + estado.pn); return; }
    if (!estado.sis) { const cnt = {}; for (const p of base()) { const s = sistemaDe(p); cnt[s] = (cnt[s] || 0) + 1; }
      L.innerHTML = `<div class="mx-th">${tr2('Grupos principales', 'Main groups')}</div><table class="mx-table mx-groups"><thead><tr><th>${tr2('Grupo', 'Group')}</th><th>${tr2('Descripción', 'Description')}</th><th>${tr2('Piezas', 'Parts')}</th></tr></thead><tbody>` +
        SIS.filter(s => cnt[s[0]]).map(s => `<tr data-sis="${esc(s[0])}"><td class="mono b">${num(s[0])}</td><td>${esc(tr2(s[0], s[1]))}</td><td class="mono">${cnt[s[0]].toLocaleString()}</td></tr>`).join('') + '</tbody></table>';
      const B = base(); lamina(SIS.filter(s => cnt[s[0]]).map(s => ({ key: s[0], kind: 'sis', img: imgDe(B.filter(p => sistemaDe(p) === s[0]).slice(0, 40)), n: num(s[0]) })), (estado.marca || tr2('Todas las marcas', 'All makes')) + ' · ' + tr2('Grupos principales', 'Main groups')); return; }
    const enSis = base().filter(p => sistemaDe(p) === estado.sis);
    if (!estado.sub) { const g = new Map(); for (const p of enSis) { const k = subgrupo(p); g.set(k, (g.get(k) || 0) + 1); }
      const arr = [...g].sort((a, b) => b[1] - a[1]);
      L.innerHTML = `<div class="mx-th">${tr2('Subgrupos', 'Sub-groups')} · ${arr.length}</div>` + lamStrip() + `<table class="mx-table mx-groups"><thead><tr><th>${tr2('Subgrupo', 'Sub-group')}</th><th>${tr2('Descripción', 'Description')}</th><th>${tr2('Piezas', 'Parts')}</th></tr></thead><tbody>` +
        arr.slice(0, 120).map(([k, n], i) => `<tr data-sub="${esc(k)}"><td class="mono b">${num(estado.sis)}.${String(i + 1).padStart(2, '0')}</td><td>${esc(k)}</td><td class="mono">${n}</td></tr>`).join('') + '</tbody></table>';
      lamina(arr.map(([k], i) => ({ key: k, kind: 'sub', img: imgDe(enSis.filter(p => subgrupo(p) === k).slice(0, 30)), n: num(estado.sis) + '.' + String(i + 1).padStart(2, '0') })), tr2('Grupo', 'Group') + ' ' + num(estado.sis) + ' · ' + tr2(estado.sis, SIS_EN[estado.sis] || estado.sis)); return; }
    let ps = enSis.filter(p => subgrupo(p) === estado.sub).sort((a, b) => stockDe(b.ref).n - stockDe(a.ref).n);
    if (estado.solo) ps = ps.filter(p => stockDe(p.ref).n > 0 || equivalentes(p).some(r => stockDe(r).n > 0));
    L.innerHTML = `<div class="mx-th">${tr2('Lista de piezas', 'Parts list')} · ${ps.length}<label class="mx-solo"><input type="checkbox" data-solo ${estado.solo ? 'checked' : ''}> ${tr2('Solo lo que tengo (o su equivalente)', 'Only what I have (or equivalent)')}</label></div>` + lamStrip() + filas(ps.slice(0, 300), false);
    const pos = [...enSis.filter(p => subgrupo(p) === estado.sub).map(p => p.ref)]; lamina(ps.slice(0, 300).map((p, i) => ({ key: p.ref, kind: 'ref', img: p.img, n: i + 1, on: p.ref === estado.ref })), estado.sub + (estado.marca ? ' [' + estado.marca + ']' : ''));
  }
  function lado() {
    const S = $('#epcSide'); const tabs = `<div class="mx-tabs"><button data-tab="pieza" class="${estado.tab === 'pieza' ? 'is-on' : ''}">${tr2('En mi inventario', 'In my inventory')}</button><button data-tab="lista" class="${estado.tab === 'lista' ? 'is-on' : ''}">${tr2('Lista de pedido', 'Order list')} (${cesta.get().reduce((n, x) => n + x.q, 0)})</button></div>`;
    if (estado.tab === 'lista') { const a = cesta.get();
      S.innerHTML = tabs + (a.length ? `<div class="mx-cesta-list">${a.map(x => { const p = PRODUCTS_BY_REF[x.r]; if (!p && x.oe) return `<div class="mx-ci mx-ci-oe"><div><b class="mono">${esc(x.oe)}</b><span>${esc(x.nom || '')}</span><small class="no">${tr2('Para comprar · no está en inventario', 'To buy · not in inventory')}</small></div><input type="number" min="1" value="${x.q}" data-cq="${esc(x.r)}"><button data-cdel="${esc(x.r)}" aria-label="Quitar">✕</button></div>`; if (!p) return ''; const s = stockDe(x.r); return `<div class="mx-ci"><div><b class="mono">${esc(p.sku || p.ref)}</b><span>${esc(p.title)}</span><small>${s.n} ${tr2('en stock', 'in stock')}${s.loc ? ' · ' + esc(s.loc) : ''}</small></div><input type="number" min="1" value="${x.q}" data-cq="${esc(x.r)}"><button data-cdel="${esc(x.r)}" aria-label="Quitar">✕</button></div>`; }).join('')}</div>
        <div class="mx-cesta-act"><button class="et-btn et-btn--accent" data-tocart>${tr2('Pasar al carrito', 'Send to cart')}</button><button class="et-btn et-btn--ghost" data-copy>${tr2('Copiar lista', 'Copy list')}</button><button class="et-btn et-btn--ghost" data-vaciar>${tr2('Vaciar', 'Clear')}</button></div>` : `<p class="mx-empty">${tr2('La lista está vacía. Usa ＋ en la tabla para agregar piezas.', 'The list is empty. Use ＋ in the table.')}</p>`);
      return; }
    if (estado.lam && estado.edit && puedeEditar()) { const l = lamDe(estado.lam), pt = l && l.puntos.find(x => x.n === estado.pin);
      if (!pt) { S.innerHTML = `<div class="mx-inv-empty"><b>${tr2('Editando lámina', 'Editing sheet')}</b><span>${tr2('Toca la imagen para poner un número nuevo, o toca un número existente para enlazarlo a una pieza de tu inventario.', 'Tap the image to add a number, or tap an existing number to link it.')}</span></div>`; return; }
      const q = pt.ref && PRODUCTS_BY_REF[pt.ref];
      S.innerHTML = `<div class="mx-sel"><small>${tr2('Punto', 'Point')} ${pt.n}</small><b>${q ? esc(q.sku || q.ref) + ' · ' + esc(q.title) : tr2('Sin enlazar todavía', 'Not linked yet')}</b></div>
        <form class="mx-lamf" data-lambus><input id="lamQ" autocomplete="off" placeholder="${tr2('SKU, N.º original o nombre', 'SKU, original no. or name')}"><button>${tr2('Buscar', 'Search')}</button></form>
        <div class="mx-inv-h sub">${tr2('Toca la pieza para enlazarla al punto', 'Tap the part to link it')} ${pt.n}</div>
        <div class="mx-eq" id="lamRes">${resLam('')}</div>
        <label class="mx-lamf-l">${tr2('N.º original (aunque no la tengas)', 'Original no. (even if not stocked)')}<input data-pinoe maxlength="40" value="${esc(pt.oe || '')}" placeholder="${tr2('Ej: el número de la pieza vieja o de la factura', 'E.g. from the old part or invoice')}"></label>
        <label class="mx-lamf-l">${tr2('Nota del punto', 'Point note')}<input data-pinnota maxlength="80" value="${esc(pt.nota || '')}" placeholder="${tr2('Ej: lleva 2 · lado izquierdo', 'E.g. qty 2 · left side')}"></label>
        <div class="mx-cesta-act"><button class="et-btn et-btn--ghost" data-pinmov>${tr2('Mover punto', 'Move point')}</button><button class="et-btn et-btn--ghost" data-pindel>${tr2('Borrar punto', 'Delete point')}</button></div>`;
      return; }
    { const l = estado.lam && lamDe(estado.lam), pt = l && estado.pin != null && l.puntos.find(x => x.n === estado.pin);
      if (pt && !(pt.ref && PRODUCTS_BY_REF[pt.ref]) && !estado.edit) { const nom = (l.nombres && l.nombres[pt.n]) || pt.nota || tr2('Pieza', 'Part') + ' ' + pt.n, cant = l.cant && l.cant[pt.n];
        S.innerHTML = tabs + `<div class="mx-falta"><div class="mx-falta-h"><small>${tr2('Pieza', 'Part')} ${pt.n}</small><b>${esc(nom)}</b></div>
          <dl><dt>${tr2('N.º original', 'Original no.')}</dt><dd class="mono oe">${pt.oe ? esc(pt.oe) : `<span class="no">${tr2('Sin número original — añádelo en «Editar lámina»', 'No original number — add it in “Edit sheet”')}</span>`}</dd>
          <dt>${tr2('Inventario', 'Inventory')}</dt><dd class="no">${tr2('No la tienes en inventario', 'Not in your inventory')}</dd>${cant ? `<dt>${tr2('Lleva', 'Qty in assembly')}</dt><dd>${cant}</dd>` : ''}</dl>
          <button class="et-btn mx-compra" data-compra="${pt.n}" ${pt.oe ? '' : 'disabled'}>${tr2('Mandar a compra', 'Send to purchasing')}</button>
          <small class="mx-falta-n">${tr2('Se agrega a la lista con su número original para pedirla al proveedor.', 'Added to the list with its original number to order it.')}</small></div>`; return; } }
    const p = estado.ref && PRODUCTS_BY_REF[estado.ref];
    if (!p && estado.lam) { S.innerHTML = tabs + `<div class="mx-inv-empty mx-desp-hint"><b>${tr2('Toca un número del despiece', 'Tap a number on the drawing')}</b><span>${tr2('Aquí aparece la pieza de tu inventario: stock, ubicación, código Zebra y precio.', 'Your inventory item shows here: stock, location, Zebra code and price.')}</span></div>`; return; }
    if (!p) { S.innerHTML = tabs + `<div class="mx-inv-empty"><b>${tr2('Selecciona una pieza', 'Select a part')}</b><span>${tr2('Elige un grupo y un tipo de pieza, y toca una pieza de la lista. Aquí aparece lo que tienes en tu inventario.', 'Choose a group and a part type, then tap a part. What you have in stock shows here.')}</span></div>`; return; }
    const logged = typeof currentUser !== 'undefined' && currentUser, verCosto = logged && typeof canSeeCost === 'function' && canSeeCost();
    const oes = [...new Set([...(p.refsList || []), p.oe].filter(Boolean))];
    const enInv = r => { const row = typeof inventoryState !== 'undefined' ? inventoryState[r] : null; return !!(row && (Number(row.stock) > 0 || row.location || (row.extraLocations || []).length || row.product)); };
    const cand = [p.ref, ...equivalentes(p)].filter((r, i, a) => a.indexOf(r) === i);
    const mios = cand.filter(enInv).map(r => ({ q: PRODUCTS_BY_REF[r], s: stockDe(r), inv: peekInv(r) })).filter(x => x.q).sort((a, b) => b.s.n - a.s.n);
    const otros = cand.filter(r => r !== p.ref && !enInv(r)).map(r => PRODUCTS_BY_REF[r]).filter(Boolean).slice(0, 8);
    const zebra = r => { try { return typeof getInternalCode === 'function' ? (getInternalCode(r) || '') : ''; } catch (e) { return ''; } };
    const tarjeta = ({ q, s, inv }) => `<article class="mx-ia ${s.n > 0 ? 'ok' : 'cero'}">
        <div class="mx-ia-img"><img src="${esc(q.img)}" alt="" onerror="this.style.visibility='hidden'"></div>
        <div class="mx-ia-body"><div class="mx-ia-top"><b class="mx-ia-sku">${esc(q.sku || q.ref)}</b>${zebra(q.ref) ? `<span class="mx-ia-z">Zebra ${esc(zebra(q.ref))}</span>` : ''}${q.ref === p.ref ? `<span class="mx-ia-tag">${tr2('Misma pieza', 'Same part')}</span>` : `<span class="mx-ia-tag eq">${tr2('Equivalente', 'Equivalent')}</span>`}</div>
          <div class="mx-ia-t">${esc(q.title)}</div><div class="mx-ia-m">${esc(q.brand)} · OE ${esc(oe1(q) || '—')}</div></div>
        <div class="mx-ia-nums"><div class="mx-ia-st"><small>Stock</small><b>${s.n}</b></div><div class="mx-ia-loc"><small>${tr2('Ubicación', 'Location')}</small><b>${esc(s.loc || tr2('Sin ubicación', 'No location'))}</b></div>
          ${logged && Number(inv.price) ? `<div><small>${tr2('Precio', 'Price')}</small><b>RD$ ${Number(inv.price).toLocaleString()}</b></div>` : ''}${verCosto && Number(inv.cost) ? `<div><small>${tr2('Costo', 'Cost')}</small><b>RD$ ${Number(inv.cost).toLocaleString()}</b></div>` : ''}</div>
        <div class="mx-ia-act"><button class="et-btn et-btn--accent" data-cart1="${esc(q.ref)}">${tr2('Al carrito', 'To cart')}</button><button class="et-btn et-btn--ghost" data-add="${esc(q.ref)}">${tr2('A la lista', 'To list')}</button>${logged ? `<button class="et-btn et-btn--ghost" data-inv="${esc(q.ref)}">${tr2('Ficha de inventario', 'Inventory sheet')}</button>` : ''}</div></article>`;
    S.innerHTML = tabs + `<div class="mx-sel"><small>${tr2('Pieza seleccionada', 'Selected part')}</small><b>${esc(p.sku || p.ref)} · ${esc(p.title)}</b>${oes.length ? `<div class="mx-oe">${oes.slice(0, 6).map(o => `<button data-oe="${esc(String(o).split(':').pop())}">${esc(o)}</button>`).join('')}</div>` : ''}</div>
      <div class="mx-inv-h">${tr2('En tu inventario', 'In your inventory')} <span>${mios.length}</span></div>
      ${mios.length ? mios.map(tarjeta).join('') : `<div class="mx-inv-none"><b>${tr2('No lo tienes en inventario', 'Not in your inventory')}</b><span>${tr2('Ni esta pieza ni sus equivalentes están registrados en tu almacén.', 'Neither this part nor its equivalents are in your warehouse.')}</span><button class="et-btn et-btn--accent" data-add="${esc(p.ref)}">${tr2('Agregar a la lista de pedido', 'Add to order list')}</button></div>`}
      ${otros.length ? `<div class="mx-inv-h sub">${tr2('Equivalentes del catálogo (no los tienes)', 'Catalog equivalents (not in stock)')}</div><div class="mx-eq">${otros.map(q => `<button data-ref="${esc(q.ref)}"><b>${esc(q.sku || q.ref)}</b><span>${esc(q.title)} · ${esc(q.brand)}</span><small>0</small></button>`).join('')}</div>` : ''}`;
  }
  function buscarLam(t) {
    const l = lamDe(estado.lam); t = String(t || '').trim();
    if (!t) { return base().filter(p => l && sistemaDe(p) === l.sis && (!l.sub || subgrupo(p) === l.sub)).sort((a, b) => stockDe(b.ref).n - stockDe(a.ref).n).slice(0, 12); }
    const q = norm(t), out = new Set(indiceOE().get(q) || []);
    for (const p of window.__etProducts()) { if (out.size >= 40) break; if (norm(p.ref) === q || norm(p.sku) === q || norm(p.gtin) === q) out.add(p.ref); }
    const tl = t.toLowerCase(); if (out.size < 12) for (const p of base()) { if (out.size >= 24) break; if ((p.title || '').toLowerCase().includes(tl) || norm(p.sku).includes(q)) out.add(p.ref); }
    return [...out].map(r => PRODUCTS_BY_REF[r]).filter(Boolean).sort((a, b) => stockDe(b.ref).n - stockDe(a.ref).n).slice(0, 15);
  }
  function resLam(t) { const ps = buscarLam(t); if (!ps.length) return `<p class="mx-empty">${tr2('Sin resultados.', 'No results.')}</p>`;
    return ps.map(q => { const s = stockDe(q.ref); return `<button data-link="${esc(q.ref)}"><b>${esc(q.sku || q.ref)}</b><span>${esc(q.title)} · OE ${esc(oe1(q) || '—')}</span><small class="${s.n > 0 ? 'ok' : ''}">${s.n}</small></button>`; }).join(''); }
  // Mejora la imagen: recorta el borde blanco y, si es un dibujo de líneas, lo agranda y lo deja nítido
  async function procesarImg(file) {
    const url = URL.createObjectURL(file), im = new Image();
    await new Promise((ok, no) => { im.onload = ok; im.onerror = no; im.src = url; });
    const sw = im.naturalWidth, sh = im.naturalHeight; let c = document.createElement('canvas'); c.width = sw; c.height = sh;
    let g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, sw, sh); g.drawImage(im, 0, 0); URL.revokeObjectURL(url);
    let d = g.getImageData(0, 0, sw, sh).data, x0 = sw, y0 = sh, x1 = -1, y1 = -1, blancos = 0, n = 0;
    for (let y = 0; y < sh; y++) for (let x = 0; x < sw; x++) { const i = (y * sw + x) * 4, l = (d[i] + d[i + 1] + d[i + 2]) / 3; n++; if (l > 225) blancos++; else { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; } }
    if (x1 < x0) { x0 = 0; y0 = 0; x1 = sw - 1; y1 = sh - 1; }
    const m = Math.round(Math.max(sw, sh) * 0.02); x0 = Math.max(0, x0 - m); y0 = Math.max(0, y0 - m); x1 = Math.min(sw - 1, x1 + m); y1 = Math.min(sh - 1, y1 + m);
    const w = x1 - x0 + 1, h = y1 - y0 + 1, lineas = blancos / n > 0.55;
    // tamaño final: dibujos de líneas hasta 2600 px de lado; fotos hasta 1800
    const meta = lineas ? 2600 : 1800, k = Math.min(meta / Math.max(w, h), lineas ? 8 : 1);
    let src = document.createElement('canvas'); src.width = w; src.height = h; src.getContext('2d').drawImage(c, x0, y0, w, h, 0, 0, w, h);
    // agrandar por pasos de 2x para que quede suave
    let cw = w, ch = h; const fw = Math.round(w * k), fh = Math.round(h * k);
    while (cw * 2 <= fw) { const t = document.createElement('canvas'); t.width = cw * 2; t.height = ch * 2; const tg = t.getContext('2d'); tg.imageSmoothingEnabled = true; tg.imageSmoothingQuality = 'high'; tg.drawImage(src, 0, 0, t.width, t.height); src = t; cw = t.width; ch = t.height; }
    const out = document.createElement('canvas'); out.width = fw; out.height = fh; const og = out.getContext('2d'); og.imageSmoothingEnabled = true; og.imageSmoothingQuality = 'high'; og.fillStyle = '#fff'; og.fillRect(0, 0, fw, fh); og.drawImage(src, 0, 0, fw, fh);
    if (lineas) { // niveles: fondo blanco puro y líneas negras definidas
      const id = og.getImageData(0, 0, fw, fh), q = id.data;
      for (let i = 0; i < q.length; i += 4) { const l = (q[i] * 0.3 + q[i + 1] * 0.59 + q[i + 2] * 0.11); let v = (l - 95) / (215 - 95); v = v < 0 ? 0 : v > 1 ? 1 : v; v = v * v * (3 - 2 * v); const o = Math.round(v * 255); q[i] = q[i + 1] = q[i + 2] = o; }
      og.putImageData(id, 0, 0); }
    let img = out.toDataURL('image/webp', 0.93); if (!img.startsWith('data:image/webp')) img = out.toDataURL(lineas ? 'image/png' : 'image/jpeg', 0.9);
    return { img, lineas, fuente: { x0, y0, w, h, sw, sh } };
  }
  async function nuevaLam(file) {
    let r; try { r = await procesarImg(file); } catch (e) { typeof showToast === 'function' && showToast(tr2('No se pudo leer la imagen.', 'Could not read the image.')); return; }
    const l = { id: 'L' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), titulo: estado.sub || tr2(estado.sis, SIS_EN[estado.sis] || estado.sis), sis: estado.sis, sub: estado.sub || '', marca: estado.marca || '', img: r.img, dibujo: r.lineas, fuente: r.fuente, puntos: [], creado: Date.now() };
    LAMS.push(l); await guardarLam(l); ir({ lam: l.id, sis: l.sis, sub: estado.sub }); estado.edit = true; estado.pin = null; tabla(); lado();
    return l.id;
  }
  // Clics propios de las láminas; devuelve true si los manejó
  function clicLam(e) {
    const t = e.target, b = t.closest('button'), d = b ? b.dataset : {};
    if (d.lamid) { const l = lamDe(d.lamid); if (l) ir({ sis: l.sis, sub: l.sub || null, lam: l.id }); return true; }
    if (b && 'lamnew' in d) { $('#epcLamFile').value = ''; $('#epcLamFile').click(); return true; }
    if (!estado.lam) return false;
    const l = lamDe(estado.lam); if (!l) return false;
    if (b && d.c3 !== undefined) { if (v3d) { if (d.c3) v3d.enfocar(d.c3); else v3d.general(); } return true; }
    if (b && d.m3) { if (v3d) { if (d.m3 === 'vista') v3d.vista(); else { v3d.armar(d.m3 === 'armar'); b.parentNode.querySelectorAll('[data-m3]').forEach(x => x.classList.toggle('is-on', x === b)); } } return true; }
    if (b && d.compra) { const pt = l.puntos.find(x => x.n === Number(d.compra)); if (pt && pt.oe) { const a = cesta.get(), k = 'OE:' + pt.oe, x = a.find(y => y.r === k); if (x) x.q += 1; else a.push({ r: k, q: Number((l.cant || {})[pt.n]) || 1, oe: pt.oe, nom: (l.nombres && l.nombres[pt.n]) || pt.nota || '' }); cesta.set(a); typeof showToast === 'function' && showToast(tr2('Agregada a la lista de compra.', 'Added to purchase list.')); } return true; }
    if (b && d.zoom !== undefined) { const v = Number(d.zoom); estado.zoom = v === 0 ? 1 : Math.max(1, Math.min(3, (estado.zoom || 1) + v * 0.5)); tabla(); return true; }
    if (b && 'lamarbol' in d) { const bd = document.querySelector('#epcOverlay .mx-body'); bd && bd.classList.toggle('ver-arbol'); return true; }
    if (b && 'lamed' in d) { estado.edit = true; estado.pin = null; tabla(); lado(); return true; }
    if (b && 'lamfin' in d) { estado.edit = false; estado.pin = null; estado.mover = false; tabla(); lado(); return true; }
    if (b && 'lamdel' in d) { if (!b.classList.contains('is-ask')) { b.classList.add('is-ask'); b.textContent = tr2('¿Seguro? Toca otra vez', 'Sure? Tap again'); return true; }
      LAMS = LAMS.filter(x => x.id !== l.id); borrarLam(l.id); ir({ lam: null }); return true; }
    if (b && d.link) { const pt = l.puntos.find(x => x.n === estado.pin); if (pt) { pt.ref = d.link; guardarLam(l); estado.ref = d.link; tabla(); lado(); arbol(); } return true; }
    if (b && 'pindel' in d) { l.puntos = l.puntos.filter(x => x.n !== estado.pin); estado.pin = null; guardarLam(l); tabla(); lado(); arbol(); return true; }
    if (b && 'pinmov' in d) { estado.mover = true; typeof showToast === 'function' && showToast(tr2('Toca en la imagen el nuevo lugar del punto.', 'Tap the new spot on the image.')); return true; }
    const ed = estado.edit && puedeEditar();
    const pin = t.closest('.mx-pin'), row = t.closest('tr[data-pinrow]');
    if (pin || row) { const n = Number((pin || row).dataset.pin || (pin || row).dataset.pinrow); const pt = l.puntos.find(x => x.n === n); estado.pin = n; estado.mover = false;
      if (ed) { if (pt && pt.ref) estado.ref = pt.ref; tabla(); lado(); return true; }
      if (l.modelo && v3d) { v3d.sel(n); if (pt && pt.ref) seleccionar(pt.ref); else { document.querySelectorAll('#epcList tr.is-on').forEach(x => x.classList.remove('is-on')); const tr = document.querySelector(`#epcList tr[data-pinrow="${n}"]`); tr && tr.classList.add('is-on'); lado(); } return true; }
      if (pt && pt.ref) { seleccionar(pt.ref); return true; }
      tabla(); return true; }
    const st = t.closest('.mx-stage-in');
    if (ed && st) { const r = st.querySelector('img').getBoundingClientRect(); const x = +(((e.clientX - r.left) / r.width) * 100).toFixed(2), y = +(((e.clientY - r.top) / r.height) * 100).toFixed(2);
      if (x < 0 || x > 100 || y < 0 || y > 100) return true;
      if (estado.mover && estado.pin) { const pt = l.puntos.find(q => q.n === estado.pin); if (pt) { pt.x = x; pt.y = y; } estado.mover = false; }
      else { const n = l.puntos.reduce((m, q) => Math.max(m, q.n), 0) + 1; l.puntos.push({ n, x, y, ref: '', nota: '' }); estado.pin = n; }
      guardarLam(l); tabla(); lado(); arbol(); setTimeout(() => { const i = $('#lamQ'); i && i.focus({ preventScroll: true }); }, 30); return true; }
    return false;
  }
  function agregar(ref, q) { const a = cesta.get(); const x = a.find(y => y.r === ref); if (x) x.q += q; else a.push({ r: ref, q }); cesta.set(a);
    if (estado.vin) { const m = mem.get(); const g = m[estado.vin.chasis] || (m[estado.vin.chasis] = { marca: estado.marca }); g.piezas = [...new Set([ref, ...(g.piezas || [])])].slice(0, 300); mem.set(m); }
    typeof showToast === 'function' && showToast(tr2('Agregado a la lista de pedido.', 'Added to the order list.')); vehiculo(); lado(); }
  function seleccionar(ref) {
    estado.ref = ref; estado.tab = 'pieza';
    document.querySelectorAll('#epcOverlay tr.is-on, #epcOverlay .mx-lam-it.is-on, #epcOverlay .mx-pin.is-on').forEach(x => x.classList.remove('is-on'));
    document.querySelectorAll(`#epcList .mx-pin[data-lam="${CSS.escape(ref)}"]`).forEach(x => x.classList.add('is-on'));
    if (v3d) { const l = lamDe(estado.lam), pt = l && l.puntos.find(x => x.ref === ref); v3d.sel(pt ? pt.n : null); }
    const tr = document.querySelector(`#epcList tr[data-ref="${CSS.escape(ref)}"]`), it = document.querySelector(`#epcLamina [data-lam="${CSS.escape(ref)}"]`);
    if (tr) { tr.classList.add('is-on'); const w = tr.closest('.mx-pts-wrap'); if (w) w.scrollTop = tr.offsetTop - w.clientHeight / 2; else tr.scrollIntoView({ block: 'nearest' }); } if (it) { it.classList.add('is-on'); it.scrollIntoView({ block: 'nearest' }); }
    lado();
  }
  function todo() { vehiculo(); arbol(); tabla(); lado(); }
  function ir(c) { Object.assign(estado, { pn: '', vendidas: false, lam: null, edit: false, pin: null, mover: false }, c); if ('sis' in c) estado.lim = 40; todo();
    if (visor) { if (estado.sis) visor.enfocar(estado.sis); else visor.vistaGeneral(); } $('#epcList').scrollTop = 0; }
  const ZONA3D = { 'Sistema eléctrico': 'trasera', 'Motor': 'motor', 'Caja de cambios': 'caja', 'Sistema de freno': 'frenos', 'Suspensión': 'susp', 'Escape': 'escape' };
  function abrir3d(zona) { const l = lamDe('M3d-camion'); if (!l) return false; estado.g3d = zona || null; estado.pin = null; ir({ sis: l.sis, sub: null, lam: l.id }); return true; }
  function identificar(txt) { const v = leerVIN(txt); if (!v.chasis) { estado.vin = null; return ir({}); }
    const g = mem.get()[v.chasis]; estado.vin = v; estado.marca = v.marca || (g && g.marca) || estado.marca || null; estado.ref = null; if (!abrir3d(null)) ir({ sis: null, sub: null, ref: null }); }
  async function abrir(vin, sis) {
    const o = ov(); o.hidden = false; document.body.classList.add('et-noscroll'); requestAnimationFrame(() => o.classList.add('is-open'));
    cesta.set(cesta.get());
    try { LAMS = await cargarLams(); } catch (e) { LAMS = []; }
    if (vin) { $('#epcVin').value = norm(vin); identificar(vin); }
    if (sis && ZONA3D[sis]) abrir3d(ZONA3D[sis]);        // zona del camión → 3D enfocado en esa zona
    else if (sis || !vin) { if (!sis && abrir3d(null)) {} else ir({ sis: sis || null, sub: null }); }
    if (!vin) setTimeout(() => $('#epcVin').focus(), 200);
  }
  function cerrar() { const o = ov(); o.classList.remove('is-open'); document.body.classList.remove('et-noscroll'); setTimeout(() => { o.hidden = true; }, 250); }
  function iniciar() {
    $('#epcVinForm').addEventListener('submit', e => { e.preventDefault(); identificar($('#epcVin').value); });
    $('#epcPnForm').addEventListener('submit', e => { e.preventDefault(); const v = $('#epcPn').value.trim(); if (v) { estado.pn = v; estado.vendidas = false; tabla(); } });
    $('#epcCestaBtn').addEventListener('click', () => { estado.tab = 'lista'; lado(); });
    const TK = 'et_epc_tema', tema = t => { ov().classList.toggle('mx-oscuro', t !== 'claro'); const b = $('#epcTema'); if (b) b.textContent = t === 'claro' ? '☾' : '☀'; };
    let tm0; try { tm0 = localStorage.getItem(TK) || 'oscuro'; } catch (e) { tm0 = 'oscuro'; } tema(tm0);
    const tb = document.createElement('button'); tb.id = 'epcTema'; tb.type = 'button'; tb.className = 'mx-tema'; tb.title = tr2('Modo claro / oscuro', 'Light / dark mode'); $('#epcCestaBtn').before(tb); tema(tm0);
    tb.addEventListener('click', () => { const t = ov().classList.contains('mx-oscuro') ? 'claro' : 'oscuro'; try { localStorage.setItem(TK, t); } catch (e) {} tema(t); });
    const fi = document.createElement('input'); fi.type = 'file'; fi.accept = 'image/*'; fi.id = 'epcLamFile'; fi.hidden = true; ov().appendChild(fi);
    fi.addEventListener('change', () => { if (fi.files[0]) nuevaLam(fi.files[0]); });
    let tl; ov().addEventListener('input', e => { if (e.target.id === 'lamQ') { clearTimeout(tl); tl = setTimeout(() => { $('#lamRes').innerHTML = resLam(e.target.value); }, 160); } });
    ov().addEventListener('submit', e => { if (e.target.matches('[data-lambus]')) { e.preventDefault(); $('#lamRes').innerHTML = resLam($('#lamQ').value); } });
    let tm; $('#epcFind').addEventListener('input', e => { clearTimeout(tm); tm = setTimeout(() => { estado.filtro = e.target.value; arbol(); }, 140); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !ov().hidden) cerrar(); });
    ov().addEventListener('mouseover', e => { const t = e.target.closest('tr[data-ref], tr[data-sis], tr[data-sub], .mx-lam-it, .mx-pin'); document.querySelectorAll('#epcOverlay .is-hl').forEach(x => x.classList.remove('is-hl')); if (!t) return;
      const k = t.dataset.lam || t.dataset.ref || t.dataset.sis || t.dataset.sub; if (!k) return; const q = CSS.escape(k);
      document.querySelectorAll(`#epcOverlay [data-lam="${q}"], #epcOverlay tr[data-ref="${q}"], #epcOverlay tr[data-sis="${q}"], #epcOverlay tr[data-sub="${q}"]`).forEach(x => x.classList.add('is-hl')); });
    ov().addEventListener('change', e => { const l = estado.lam && lamDe(estado.lam);
      if (l && e.target.matches('[data-lamtit]')) { l.titulo = e.target.value.trim().slice(0, 80) || l.titulo; guardarLam(l); migas(); return arbol(); }
      if (l && e.target.matches('[data-pinoe]')) { const pt = l.puntos.find(x => x.n === estado.pin); if (pt) { pt.oe = e.target.value.trim().toUpperCase().slice(0, 40); guardarLam(l); tabla(); } return; }
      if (l && e.target.matches('[data-pinnota]')) { const pt = l.puntos.find(x => x.n === estado.pin); if (pt) { pt.nota = e.target.value.trim().slice(0, 80); guardarLam(l); tabla(); } return; }
      if (e.target.matches('[data-solo]')) { estado.solo = e.target.checked; return tabla(); } const i = e.target.closest('[data-cq]'); if (i) { const a = cesta.get(); const x = a.find(y => y.r === i.dataset.cq); if (x) { x.q = Math.max(1, parseInt(i.value) || 1); cesta.set(a); lado(); } } });
    ov().addEventListener('click', e => {
      if (clicLam(e)) return;
      const tr = e.target.closest('tr[data-ref], tr[data-sis], tr[data-sub]'); const b = e.target.closest('button');
      if (b) { const d = b.dataset;
        if (d.lam) { if (d.kind === 'sis') return ir({ sis: d.lam, sub: null }); if (d.kind === 'sub') return ir({ sub: d.lam }); return seleccionar(d.lam); }
        if ('marca' in d) { estado.marca = d.marca || null; if (estado.vin && d.marca) { const m = mem.get(); (m[estado.vin.chasis] = m[estado.vin.chasis] || {}).marca = d.marca; mem.set(m); } return ir({}); }
        if (d.add) { const row = b.closest('tr'); const q = row ? Math.max(1, parseInt(row.querySelector('input').value) || 1) : 1; return agregar(d.add, q); }
        if (d.sis) return ir({ sis: d.sis === estado.sis && !estado.sub ? null : d.sis, sub: null });
        if (d.sub) return ir({ sub: d.sub });
        if (d.more !== undefined) { estado.lim += 40; return arbol(); }
        if (d.go) return ir(d.go === 'sis' ? { sis: null, sub: null } : { sub: null });
        if (d.tab) { estado.tab = d.tab; return lado(); }
        if (d.ref) { estado.ref = d.ref; estado.tab = 'pieza'; return lado(); }
        if (d.oe) { estado.pn = d.oe; $('#epcPn').value = d.oe; return tabla(); }
        if ('vendidas' in d) { estado.vendidas = true; estado.pn = ''; return tabla(); }
        if (d.cdel) { cesta.set(cesta.get().filter(x => x.r !== d.cdel)); return lado(); }
        if ('tocart' in d) { cesta.get().forEach(x => { if (x.oe && !PRODUCTS_BY_REF[x.r]) return; for (let i = 0; i < x.q; i++) addToCart(x.r); }); return; }
        if ('copy' in d) { const t = cesta.get().map(x => { const p = PRODUCTS_BY_REF[x.r]; return `${x.q} x ${p ? (p.sku || p.ref) + ' — ' + p.title : (x.oe ? 'N.º original ' + x.oe + (x.nom ? ' — ' + x.nom : '') + ' (COMPRAR)' : x.r)}`; }).join('\n'); navigator.clipboard && navigator.clipboard.writeText((estado.vin ? 'Chasis ' + estado.vin.chasis + '\n' : '') + t); typeof showToast === 'function' && showToast(tr2('Lista copiada.', 'List copied.')); return; }
        if ('vaciar' in d) { cesta.set([]); return lado(); }
        if (d.cart1) { addToCart(d.cart1); return; }
        if (d.modal) return openProductModal(d.modal);
        if (d.inv) return openArticleDetail(d.inv);
        if (b.id === 'epcGuardar' && estado.vin) { const m = mem.get(); const g = m[estado.vin.chasis] || (m[estado.vin.chasis] = {}); g.cliente = $('#epcCliente').value.trim().slice(0, 60); g.marca = estado.marca; mem.set(m); typeof showToast === 'function' && showToast(tr2('Chasis guardado.', 'Chassis saved.')); return vehiculo(); }
        return;
      }
      if (tr && !e.target.closest('input')) { const d = tr.dataset;
        if (d.sis) return ir({ sis: d.sis, sub: null });
        if (d.sub) return ir({ sub: d.sub });
        if (d.ref) return seleccionar(d.ref);
      }
    });
  }
  return { abrir, cerrar, iniciar, abrir3d, general: () => ir({ sis: null, sub: null }), _lam: { LDB, nueva: f => nuevaLam(f), async recargar() { LAMS = await cargarLams(); todo(); }, ir: id => { const l = lamDe(id); if (l) ir({ sis: l.sis, sub: l.sub || null, lam: id }); } } };
})();

window.EPC = EPC;

function tip(el) {
  return info => { if (!info) { el.hidden = true; return; } const r = el.parentElement.getBoundingClientRect();
    el.innerHTML = `<b>${esc(tr2(info.sis, SIS_EN[info.sis] || info.sis))}</b><span>${esc(info.nombre)}</span>`; el.hidden = false;
    el.style.left = (info.x - r.left + 14) + 'px'; el.style.top = (info.y - r.top + 14) + 'px'; };
}

/* ───────── "No soy un robot" (prueba de trabajo, sin servicios externos) ───────── */
const ETCaptcha = (() => {
  const estado = new Map();
  const workerSrc = `self.onmessage=async e=>{const{salt,dif}=e.data;const enc=new TextEncoder();
    function sha(m){const K=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
      const l=m.length,w=new Uint32Array(64),n=((l+9+63)>>6)<<4,b=new Uint32Array(n);for(let i=0;i<l;i++)b[i>>2]|=m[i]<<(24-(i&3)*8);b[l>>2]|=0x80<<(24-(l&3)*8);b[n-1]=l*8;
      let h0=0x6a09e667,h1=0xbb67ae85,h2=0x3c6ef372,h3=0xa54ff53a,h4=0x510e527f,h5=0x9b05688c,h6=0x1f83d9ab,h7=0x5be0cd19;
      for(let i=0;i<n;i+=16){for(let t=0;t<64;t++){if(t<16)w[t]=b[i+t];else{const a=w[t-15],c=w[t-2];w[t]=(((a>>>7|a<<25)^(a>>>18|a<<14)^(a>>>3))+w[t-7]+((c>>>17|c<<15)^(c>>>19|c<<13)^(c>>>10))+w[t-16])|0;}}
        let A=h0,B=h1,C=h2,D=h3,E=h4,F=h5,G=h6,H=h7;for(let t=0;t<64;t++){const T1=(H+((E>>>6|E<<26)^(E>>>11|E<<21)^(E>>>25|E<<7))+((E&F)^(~E&G))+K[t]+w[t])|0,T2=(((A>>>2|A<<30)^(A>>>13|A<<19)^(A>>>22|A<<10))+((A&B)^(A&C)^(B&C)))|0;H=G;G=F;F=E;E=(D+T1)|0;D=C;C=B;B=A;A=(T1+T2)|0;}
        h0=(h0+A)|0;h1=(h1+B)|0;h2=(h2+C)|0;h3=(h3+D)|0;h4=(h4+E)|0;h5=(h5+F)|0;h6=(h6+G)|0;h7=(h7+H)|0;}return [h0>>>0,h1>>>0];}
    for(let n=0;n<5e7;n++){const h=sha(enc.encode(salt+n));const z=Math.clz32(h[0])+(h[0]===0?Math.clz32(h[1]):0);if(z>=dif){postMessage({n});return;}}postMessage({n:-1});};`;
  let url = null;
  async function reto() {
    try { if (typeof loadServerConfig === 'function') await loadServerConfig(); const s = srvSettings(); if (s && s.url) { const r = await fetch(s.url + '/api/reto', { cache: 'no-store' }); if (r.ok) return await r.json(); } } catch (e) {}
    const a = new Uint8Array(12); crypto.getRandomValues(a); return { salt: [...a].map(x => x.toString(16).padStart(2, '0')).join('') + '.' + Date.now(), dif: 16, local: true };
  }
  function montar(slot) {
    const id = slot.dataset.captcha; slot.innerHTML = `<button type="button" class="et-captcha" aria-pressed="false"><span class="box"></span><span class="lbl">${tr2('No soy un robot', "I'm not a robot")}</span><span class="by">${tr2('verificación Eurotruck', 'Eurotruck check')}</span></button>`;
    const b = slot.firstChild;
    b.addEventListener('click', async () => {
      if (b.classList.contains('is-ok') || b.classList.contains('is-busy')) return;
      b.classList.add('is-busy'); b.querySelector('.lbl').textContent = tr2('Verificando…', 'Verifying…');
      const r = await reto(); url = url || URL.createObjectURL(new Blob([workerSrc], { type: 'text/javascript' }));
      const w = new Worker(url); const t0 = performance.now();
      w.onmessage = e => { w.terminate(); b.classList.remove('is-busy');
        if (e.data.n < 0) { b.querySelector('.lbl').textContent = tr2('Intenta de nuevo', 'Try again'); return; }
        const wait = Math.max(0, 700 - (performance.now() - t0));
        setTimeout(() => { estado.set(id, { ...r, n: e.data.n }); b.classList.add('is-ok'); b.setAttribute('aria-pressed', 'true'); b.querySelector('.lbl').textContent = tr2('Verificado', 'Verified'); slot.classList.remove('is-err'); }, wait); };
      w.postMessage({ salt: r.salt, dif: r.dif });
    });
  }
  function tomar(id) { const v = estado.get(id); if (!v) return null; estado.delete(id); const slot = document.querySelector(`[data-captcha="${id}"]`); if (slot) montar(slot); return v; }
  function exigir(id) { if (estado.has(id)) return true; const slot = document.querySelector(`[data-captcha="${id}"]`); if (slot) { slot.classList.add('is-err'); slot.scrollIntoView({ block: 'center', behavior: 'smooth' }); } typeof showToast === 'function' && showToast(tr2('Marca "No soy un robot" para continuar.', 'Tick "I\'m not a robot" to continue.')); return false; }
  function iniciar() { document.querySelectorAll('[data-captcha]').forEach(montar); }
  return { iniciar, tomar, exigir, listo: id => estado.has(id) };
})();
window.ETCaptcha = ETCaptcha;

/* ───────── Portada, sistemas, marcas, encabezado ───────── */
const FOTOS = { Scania: 'scania', Volvo: 'volvo', 'Mercedes-Benz': 'mercedes', MAN: 'man', Iveco: 'iveco' };
const CAP = { scania: ['SCANIA', 'Potencia y confiabilidad para largas distancias', 'Power and reliability for long haul'], volvo: ['VOLVO', 'Ingeniería de precisión y seguridad en ruta', 'Precision engineering and road safety'],
  mercedes: ['MERCEDES-BENZ', 'Tecnología y eficiencia en cada kilómetro', 'Technology and efficiency every mile'], man: ['MAN', 'Durabilidad probada para carga pesada', 'Proven durability for heavy loads'], iveco: ['IVECO', 'Eficiencia y bajo consumo en ruta', 'Efficiency and low fuel use on the road'] };
const HOTS = { // [sistema, x%, y%] sobre cada foto original
  scania: [['Sistema de freno', 44, 71], ['Motor', 26, 57], ['Sistema eléctrico', 34, 66], ['Cabina', 40, 28], ['Suspensión', 65, 68]],
  volvo: [['Sistema de freno', 57, 77], ['Motor', 38, 62], ['Sistema eléctrico', 48, 72], ['Cabina', 40, 32], ['Suspensión', 81, 64]],
  mercedes: [['Sistema de freno', 56, 72], ['Motor', 39, 57], ['Sistema eléctrico', 48, 67], ['Cabina', 42, 31], ['Suspensión', 72, 62]],
  man: [['Sistema de freno', 46, 78], ['Motor', 66, 58], ['Sistema eléctrico', 55, 70], ['Cabina', 63, 33], ['Suspensión', 37, 68]],
  iveco: [['Sistema de freno', 49, 74], ['Motor', 68, 58], ['Sistema eléctrico', 59, 69], ['Cabina', 60, 30], ['Suspensión', 37, 66]]
};
let CNT = null;
function puntos(key) {
  const box = $('#heroHots'); if (!box) return;
  if (!CNT) { CNT = {}; for (const p of window.__etProducts()) { const s = sistemaDe(p); CNT[s] = (CNT[s] || 0) + 1; } }
  box.innerHTML = (HOTS[key] || []).map(([sis, x, y], i) => `<button class="tk-hot ${x > 62 ? 'is-left' : ''}" style="left:${x}%;top:${y}%;--d:${i * 90}ms" data-sis="${esc(sis)}"><i>${String(i + 1).padStart(2, '0')}</i><span><b>${esc(tr2(sis, SIS_EN[sis] || sis))}</b><small>${(CNT[sis] || 0).toLocaleString()} ${tr2('piezas', 'parts')}</small></span></button>`).join('');
}
function portada() {
  const hb = $('#heroHots'); if (hb) hb.addEventListener('click', e => { const b = e.target.closest('[data-sis]'); if (b) { e.stopPropagation(); EPC.abrir($('#heroChasis').value, b.dataset.sis); } });
  const hm = $('#heroMedia'); if (hm) { hm.style.cursor = 'pointer'; hm.title = tr2('Toca el camión para verlo en 3D', 'Tap the truck to see it in 3D'); hm.addEventListener('click', e => { if (e.target.closest('a,button,[data-sis]')) return; EPC.abrir($('#heroChasis') ? $('#heroChasis').value : ''); }); }
  const imgs = [...document.querySelectorAll('#heroMedia img')], tabs = [...document.querySelectorAll('#heroTabs button')]; if (!imgs.length) return;
  let i = 0, tm = null;
  const ver = k => { i = (k + imgs.length) % imgs.length; const key = imgs[i].dataset.truck;
    imgs.forEach((im, j) => { if (j === i && im.loading === 'lazy') im.loading = 'eager'; im.classList.toggle('is-on', j === i); });
    tabs.forEach(t => { t.classList.remove('is-on'); void t.offsetWidth; t.classList.toggle('is-on', t.dataset.truck === key); });
    const c = CAP[key]; $('#heroBrand').textContent = c[0]; $('#heroCap').textContent = tr2(c[1], c[2]); puntos(key); };
  const auto = () => { clearInterval(tm); tm = setInterval(() => ver(i + 1), 7000); };
  tabs.forEach((t, k) => t.addEventListener('click', () => { ver(k); auto(); }));
  setTimeout(() => imgs.forEach(im => { im.loading = 'eager'; }), 2500);
  ver(0); auto();
}
function piezas3d() {
  const el = $('#sys3d'); if (!el) return; let v = null;
  const io = new IntersectionObserver(es => { if (es[0].isIntersecting && !v) { v = montarCamion(el, { alSeleccionar: s => EPC.abrir($('#heroChasis').value, s), alPasar: tip($('#sysTip')) }); io.disconnect(); } }, { rootMargin: '200px' }); io.observe(el);
}
function rejillas() {
  const P = window.__etProducts(); const cnt = {}, mar = {};
  for (const p of P) { const s = sistemaDe(p); cnt[s] = (cnt[s] || 0) + 1; mar[p.brand] = (mar[p.brand] || 0) + 1; }
  $('#sysGrid').innerHTML = SIS.filter(s => cnt[s[0]]).map(s => `<button class="et-sys" data-sis="${esc(s[0])}">${icono(s[2])}<b>${esc(tr2(s[0], s[1]))}</b><small>${cnt[s[0]].toLocaleString()} ${tr2('piezas', 'parts')}</small></button>`).join('');
  $('#sysGrid').onclick = e => { const b = e.target.closest('[data-sis]'); if (b) EPC.abrir($('#heroChasis').value, b.dataset.sis); };
  const fotoDe = m => { const im = FOTOS[m] && document.querySelector('#heroMedia img[data-truck="' + FOTOS[m] + '"]'); return im ? ` style="--foto:url('${im.getAttribute('src')}')"` : ''; };
  $('#brandGrid').innerHTML = MARCAS.map(m => `<button class="et-brand-card${FOTOS[m] ? ' has-foto' : ''}" data-b="${esc(m)}"${fotoDe(m)}><b>${esc(m)}</b><small>${(mar[m] || 0).toLocaleString()} ${tr2('piezas', 'parts')}</small><span>${tr2('Ver piezas →', 'View parts →')}</span></button>`).join('');
  $('#brandGrid').onclick = e => { const b = e.target.closest('[data-b]'); if (!b) return; const chip = [...document.querySelectorAll('#brandFilters [data-filter]')].find(c => c.dataset.filter === b.dataset.b); document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' }); if (chip) setTimeout(() => chip.click(), 350); };
}
function encabezado() {
  const h = $('#etHeader'); const f = () => h.classList.toggle('is-scrolled', scrollY > 30); addEventListener('scroll', f, { passive: true }); f();
  const links = [...document.querySelectorAll('.et-nav a[href^="#"]')]; const secs = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) links.forEach(a => a.classList.toggle('nav-active', a.getAttribute('href') === '#' + e.target.id)); }), { rootMargin: '-45% 0px -50% 0px' });
  secs.forEach(s => io.observe(s));
  document.querySelectorAll('.et-nav a').forEach(a => a.addEventListener('click', () => $('#mainNav').classList.remove('is-open')));
  const rv = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); rv.unobserve(e.target); } }), { threshold: .12 });
  document.querySelectorAll('.et-sec-head, .et-svc, .et-sys, .et-brand-card, .et-reg-copy, .reg-form, .et-faq-side').forEach(x => { x.classList.add('et-reveal'); rv.observe(x); });
}
function formularios() {
  // pedido: exige "no soy un robot" antes del envío original
  // inicio de sesión: casilla dentro del cuadro de acceso
}

window.__etProducts = () => (typeof visibleProducts === 'function' ? visibleProducts() : products);
function arrancar() {
  try { EPC.iniciar(); formularios(); rejillas(); encabezado(); portada(); piezas3d(); } catch (e) { console.error('sitio', e); }
  document.documentElement.classList.add('et-ready');
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) navigator.serviceWorker.register('/sw-pagina.js').catch(() => {});
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar); else arrancar();
