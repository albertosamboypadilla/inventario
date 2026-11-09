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
  let visor = null, estado = { vin: null, marca: null, sis: null, sub: null, ref: null, filtro: '', lim: 60 };
  const ov = () => $('#epcOverlay');
  function base() { const m = estado.marca; return window.__etProducts().filter(p => !m || p.brand === m || p.brand === 'Multibrand' || p.brand === 'DT Spare Parts'); }
  function stockDe(ref) { try { const i = peekInv(ref); return { n: Number(i.stock) || 0, loc: (i.location || (i.extraLocations || []).length) ? allLocationsLabel(i) : '' }; } catch (e) { return { n: 0, loc: '' }; } }
  function migas() {
    const c = [`<button data-go="sis">${esc(estado.marca || tr2('Todas las marcas', 'All brands'))}</button>`];
    if (estado.sis) c.push(`<button data-go="sub">${esc(tr2(estado.sis, SIS_EN[estado.sis] || estado.sis))}</button>`);
    if (estado.sub) c.push(`<button data-go="parts">${esc(estado.sub)}</button>`);
    if (estado.ref) c.push(`<span>${esc(estado.ref)}</span>`);
    $('#epcCrumbs').innerHTML = c.join('<i>›</i>');
  }
  function ficha() {
    const t = $('#epcTruck'); const v = estado.vin;
    if (!v) { t.innerHTML = `<div class="et-epc-hello"><b>${tr2('Escribe el chasis o VIN', 'Enter the chassis or VIN')}</b><span>${tr2('o elige la marca:', 'or choose the brand:')}</span><div class="et-chips">${MARCAS.map(m => `<button data-marca="${m}" class="${estado.marca === m ? 'is-on' : ''}">${m}</button>`).join('')}</div></div>`; return; }
    const g = mem.get()[v.chasis] || {};
    const foto = FOTOS[estado.marca] ? `<img class="et-epc-photo" src="${document.querySelector('#heroMedia img[data-truck="' + FOTOS[estado.marca] + '"]').getAttribute('src')}" alt="">` : '';
    t.innerHTML = foto + `<div class="et-epc-id"><small>${tr2('Chasis', 'Chassis')}</small><b>${esc(v.chasis)}</b><div class="et-epc-tags">${estado.marca ? `<span class="is-acc">${esc(estado.marca)}</span>` : `<span class="is-warn">${tr2('Marca no detectada', 'Brand not detected')}</span>`}${v.anio ? `<span>${tr2('Año', 'Year')} ${v.anio}</span>` : ''}${g.cliente ? `<span>${esc(g.cliente)}</span>` : ''}</div>
      ${estado.marca ? '' : `<div class="et-chips">${MARCAS.map(m => `<button data-marca="${m}">${m}</button>`).join('')}</div>`}
      <div class="et-epc-client"><input id="epcCliente" maxlength="60" placeholder="${tr2('Cliente / modelo (opcional)', 'Customer / model (optional)')}" value="${esc(g.cliente || '')}"><button id="epcGuardar">${tr2('Guardar', 'Save')}</button></div></div>`;
  }
  function lista() {
    migas(); const L = $('#epcList'); const f = estado.filtro.trim().toLowerCase();
    const oeq = norm(estado.filtro);
    if (oeq.length >= 5 && /\d/.test(oeq)) { // número original escrito: búsqueda exacta en todo el inventario
      const refs = [...(indiceOE().get(oeq) || [])]; const P = window.__etProducts();
      const extra = P.filter(p => norm(p.ref) === oeq || norm(p.sku) === oeq).map(p => p.ref);
      const all = [...new Set([...refs, ...extra])].map(r => PRODUCTS_BY_REF[r]).filter(Boolean);
      L.innerHTML = `<div class="et-epc-h">${tr2('Número original', 'Original number')} <b>${esc(estado.filtro)}</b> · ${all.length} ${tr2('coincidencias', 'matches')}</div>` + (all.length ? piezasHTML(all) : `<p class="et-epc-empty">${tr2('No está en el catálogo ni en tu inventario.', 'Not in the catalog or your inventory.')}</p>`);
      return;
    }
    if (estado.ref) return detalle();
    if (!estado.sis) {
      const cnt = {}; for (const p of base()) { const s = sistemaDe(p); cnt[s] = (cnt[s] || 0) + 1; }
      L.innerHTML = `<div class="et-epc-h">${tr2('Elige un sistema (o toca su pieza en 3D)', 'Choose a system (or tap its 3D part)')}</div><div class="et-epc-sys">` +
        SIS.filter(s => cnt[s[0]]).filter(s => !f || s[0].toLowerCase().includes(f) || s[1].toLowerCase().includes(f)).map(s => `<button data-sis="${esc(s[0])}">${icono(s[2])}<span>${esc(tr2(s[0], s[1]))}</span><small>${cnt[s[0]].toLocaleString()}</small></button>`).join('') + '</div>';
      return;
    }
    const enSis = base().filter(p => sistemaDe(p) === estado.sis);
    if (!estado.sub) {
      const g = new Map(); for (const p of enSis) { const k = subgrupo(p); g.set(k, (g.get(k) || 0) + 1); }
      const arr = [...g].filter(([k]) => !f || k.toLowerCase().includes(f)).sort((a, b) => b[1] - a[1]);
      L.innerHTML = `<div class="et-epc-h">${arr.length} ${tr2('tipos de pieza', 'part types')}</div><div class="et-epc-subs">` + arr.slice(0, estado.lim).map(([k, n]) => `<button data-sub="${esc(k)}"><span>${esc(k)}</span><small>${n}</small></button>`).join('') + '</div>' + (arr.length > estado.lim ? `<button class="et-more" data-more>${tr2('Ver más', 'Show more')}</button>` : '');
      return;
    }
    const ps = enSis.filter(p => subgrupo(p) === estado.sub).filter(p => !f || (p.title + ' ' + p.ref + ' ' + (p.refsList || []).join(' ')).toLowerCase().includes(f));
    ps.sort((a, b) => stockDe(b.ref).n - stockDe(a.ref).n);
    L.innerHTML = `<div class="et-epc-h">${ps.length} ${tr2('piezas', 'parts')}</div>` + piezasHTML(ps.slice(0, estado.lim)) + (ps.length > estado.lim ? `<button class="et-more" data-more>${tr2('Ver más', 'Show more')}</button>` : '');
  }
  function piezasHTML(ps) {
    return '<div class="et-epc-parts">' + ps.map(p => { const s = stockDe(p.ref); const oe = (p.refsList || [])[0] || p.oe || '';
      return `<button class="et-part" data-ref="${esc(p.ref)}"><img loading="lazy" src="${esc(p.img)}" alt="" onerror="this.style.visibility='hidden'"><span class="t"><b>${esc(p.title)}</b><small>${esc(p.sku || p.ref)}${oe ? ' · OE ' + esc(String(oe).split(':').pop()) : ''}</small></span><span class="st ${s.n > 0 ? 'ok' : ''}">${s.n > 0 ? s.n + ' ' + tr2('disp.', 'in stock') : tr2('Sin stock', 'Out')}</span></button>`; }).join('') + '</div>';
  }
  function detalle() {
    const p = PRODUCTS_BY_REF[estado.ref]; if (!p) { estado.ref = null; return lista(); }
    const s = stockDe(p.ref), inv = (() => { try { return peekInv(p.ref); } catch (e) { return {}; } })();
    const logged = typeof currentUser !== 'undefined' && currentUser; const verCosto = logged && typeof canSeeCost === 'function' && canSeeCost();
    const oes = [...new Set([...(p.refsList || []), p.oe].filter(Boolean))];
    const eq = equivalentes(p).map(r => PRODUCTS_BY_REF[r]).filter(Boolean).map(q => ({ q, s: stockDe(q.ref) })).sort((a, b) => b.s.n - a.s.n).slice(0, 12);
    const g = estado.vin ? (mem.get()[estado.vin.chasis] || {}) : {};
    $('#epcList').innerHTML = `<article class="et-detail">
      <div class="et-detail-img"><img src="${esc(p.img)}" alt="${esc(p.title)}" onerror="this.style.visibility='hidden'"></div>
      <h3>${esc(p.title)}</h3><div class="et-detail-meta"><span>SKU <b>${esc(p.sku || p.ref)}</b></span><span>${esc(p.brand)}</span><span>${esc(tr2(sistemaDe(p), SIS_EN[sistemaDe(p)] || ''))}</span></div>
      <div class="et-stock ${s.n > 0 ? 'ok' : ''}"><div><small>${tr2('En inventario', 'In stock')}</small><b>${s.n}</b></div><div><small>${tr2('Ubicación', 'Location')}</small><b>${esc(s.loc || tr2('Sin ubicación', 'No location'))}</b></div>
        ${logged && Number(inv.price) ? `<div><small>${tr2('Precio', 'Price')}</small><b>RD$ ${Number(inv.price).toLocaleString()}</b></div>` : ''}${verCosto && Number(inv.cost) ? `<div><small>${tr2('Costo', 'Cost')}</small><b>RD$ ${Number(inv.cost).toLocaleString()}</b></div>` : ''}</div>
      ${oes.length ? `<h4>${tr2('Números originales (OE)', 'Original numbers (OE)')}</h4><div class="et-oe">${oes.map(o => `<button data-oe="${esc(String(o).split(':').pop())}">${esc(o)}</button>`).join('')}</div>` : ''}
      ${p.gtin ? `<h4>GTIN</h4><p class="et-mono">${esc(p.gtin)}</p>` : ''}
      ${eq.length ? `<h4>${tr2('Equivalentes en tu catálogo e inventario', 'Equivalents in your catalog & inventory')}</h4>${piezasHTML(eq.map(e => e.q))}` : ''}
      ${p.applications ? `<h4>${tr2('Aplicación', 'Application')}</h4><p class="et-apps">${esc(p.applications).split(' | ').slice(0, 12).join('<br>')}</p>` : ''}
      <div class="et-detail-actions"><button class="et-btn et-btn--accent" data-cart="${esc(p.ref)}">${tr2('Agregar al carrito', 'Add to cart')}</button>
        <button class="et-btn et-btn--ghost" data-modal="${esc(p.ref)}">${tr2('Ficha completa', 'Full sheet')}</button>
        ${logged ? `<button class="et-btn et-btn--ghost" data-inv="${esc(p.ref)}">${tr2('Ficha de inventario', 'Inventory sheet')}</button>` : ''}</div>
      ${estado.vin ? `<p class="et-note">${(g.piezas || []).includes(p.ref) ? tr2('✔ Ya se le vendió esta pieza a este chasis.', '✔ Already sold to this chassis.') : tr2('Al agregarla al carrito queda anotada para este chasis.', 'Adding it to the cart records it for this chassis.')}</p>` : ''}
    </article>`;
  }
  function usado(ref) { if (!estado.vin) return; const m = mem.get(); const g = m[estado.vin.chasis] || (m[estado.vin.chasis] = { marca: estado.marca }); g.piezas = [...new Set([ref, ...(g.piezas || [])])].slice(0, 300); g.t = Date.now(); mem.set(m); }
  function ir(cambios) { Object.assign(estado, cambios, { lim: 60 }); if (!('filtro' in cambios)) { estado.filtro = ''; $('#epcFind').value = ''; } lista();
    if (visor) { if (estado.sis) visor.enfocar(estado.sis); else visor.vistaGeneral(); } $('#epcList').scrollTop = 0; }
  function identificar(txt) {
    const v = leerVIN(txt); if (!v.chasis) { estado.vin = null; ficha(); return; }
    const g = mem.get()[v.chasis]; estado.vin = v; estado.marca = v.marca || (g && g.marca) || estado.marca || null;
    ficha(); ir({ sis: null, sub: null, ref: null });
    if (g && (g.piezas || []).length) { $('#epcList').insertAdjacentHTML('afterbegin', `<div class="et-epc-h">${tr2('Piezas que ya se le vendieron a este chasis', 'Parts already sold to this chassis')}</div>` + piezasHTML(g.piezas.map(r => PRODUCTS_BY_REF[r]).filter(Boolean).slice(0, 8))); }
  }
  async function abrir(vin, sis) {
    const o = ov(); o.hidden = false; document.body.classList.add('et-noscroll'); requestAnimationFrame(() => o.classList.add('is-open'));
    if (!visor) visor = montarCamion($('#epc3d'), { modo: 'epc', alSeleccionar: s => ir({ sis: s, sub: null, ref: null }), alPasar: tip($('#epcTip')) });
    if (vin) { $('#epcVin').value = norm(vin); identificar(vin); } else { ficha(); }
    ir({ sis: sis || null, sub: null, ref: null });
    if (!vin) setTimeout(() => $('#epcVin').focus(), 200);
  }
  function cerrar() { const o = ov(); o.classList.remove('is-open'); document.body.classList.remove('et-noscroll'); setTimeout(() => { o.hidden = true; }, 250); }
  function iniciar() {
    $('#epcVinForm').addEventListener('submit', e => { e.preventDefault(); identificar($('#epcVin').value); });
    let tm; $('#epcFind').addEventListener('input', e => { clearTimeout(tm); tm = setTimeout(() => { estado.filtro = e.target.value; estado.lim = 60; lista(); }, 160); });
    
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !ov().hidden) cerrar(); });
    ov().addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return; const d = b.dataset;
      if (d.marca) { estado.marca = d.marca; if (estado.vin) { const m = mem.get(); (m[estado.vin.chasis] = m[estado.vin.chasis] || {}).marca = d.marca; mem.set(m); } ficha(); ir({ sis: estado.sis, sub: estado.sub, ref: null }); }
      else if (d.sis) ir({ sis: d.sis, sub: null, ref: null });
      else if (d.sub) ir({ sub: d.sub, ref: null });
      else if (d.ref) { estado.ref = d.ref; estado.filtro = ''; $('#epcFind').value = ''; lista(); $('#epcList').scrollTop = 0; const p = PRODUCTS_BY_REF[d.ref]; if (p && visor) visor.enfocar(sistemaDe(p)); }
      else if (d.oe) { estado.filtro = d.oe; $('#epcFind').value = d.oe; estado.ref = null; lista(); }
      else if (d.more !== undefined) { estado.lim += 60; lista(); }
      else if (d.go) ir(d.go === 'sis' ? { sis: null, sub: null, ref: null } : d.go === 'sub' ? { sub: null, ref: null } : { ref: null });
      else if (d.cart) { usado(d.cart); addToCart(d.cart); }
      else if (d.modal) openProductModal(d.modal);
      else if (d.inv) openArticleDetail(d.inv);
      else if (b.id === 'epcGuardar' && estado.vin) { const m = mem.get(); const g = m[estado.vin.chasis] || (m[estado.vin.chasis] = {}); g.cliente = $('#epcCliente').value.trim().slice(0, 60); g.marca = estado.marca; mem.set(m); ficha(); typeof showToast === 'function' && showToast(tr2('Chasis guardado.', 'Chassis saved.')); }
    });
  }
  return { abrir, cerrar, iniciar, general: () => ir({ sis: null, sub: null, ref: null }) };
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
  const hb = $('#heroHots'); if (hb) hb.addEventListener('click', e => { const b = e.target.closest('[data-sis]'); if (b) EPC.abrir($('#heroChasis').value, b.dataset.sis); });
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
