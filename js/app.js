
/* ---------- Idioma del sitio (ES / EN) ---------- */
let currentLang = 'es';
try{ currentLang = localStorage.getItem('eurotruck_lang') || 'es'; }catch(e){}
function tr(es, en){ return currentLang==='en' ? (en!=null?en:es) : es; }
function setLanguage(lang){
  currentLang = (lang==='en') ? 'en' : 'es';
  try{ localStorage.setItem('eurotruck_lang', currentLang); }catch(e){}
  document.documentElement.lang = currentLang;
  document.querySelectorAll('[data-en]').forEach(el=>{
    if(el.dataset.esOriginal===undefined) el.dataset.esOriginal = el.textContent;
    el.textContent = currentLang==='en' ? el.dataset.en : el.dataset.esOriginal;
  });
  document.querySelectorAll('[data-en-placeholder]').forEach(el=>{
    if(el.dataset.esPlaceholder===undefined) el.dataset.esPlaceholder = el.getAttribute('placeholder')||'';
    el.setAttribute('placeholder', currentLang==='en' ? el.dataset.enPlaceholder : el.dataset.esPlaceholder);
  });
  const btnEs = document.getElementById('langBtnEs'), btnEn = document.getElementById('langBtnEn');
  if(btnEs) btnEs.classList.toggle('is-selected', currentLang==='es');
  if(btnEn) btnEn.classList.toggle('is-selected', currentLang==='en');
  if(typeof renderFaqList==='function') renderFaqList();
  if(typeof renderProducts==='function') renderProducts();
  if(typeof renderCart==='function') renderCart();
  if(typeof setTruck==='function' && typeof activeIdx!=='undefined') setTruck(activeIdx, false);
}
/* ---------- Fleet / hero truck deck ---------- */
const trucks = [
  {key:'scania', name:'SCANIA', caption:'Potencia Confiable para Rutas Exigentes', captionEn:'Reliable Power for Demanding Routes'},
  {key:'volvo', name:'VOLVO', caption:'Ingeniería de Precisión y Tecnología MirrorCam', captionEn:'Precision Engineering and MirrorCam Technology'},
  {key:'mercedes', name:'MERCEDES-BENZ', caption:'Confort y Tecnología Alemana en Cada Viaje', captionEn:'German Comfort and Technology on Every Trip'},
  {key:'man', name:'MAN', caption:'Resistencia Comprobada para Carga Pesada', captionEn:'Proven Durability for Heavy Loads'},
  {key:'iveco', name:'IVECO', caption:'Eficiencia y Bajo Consumo en Ruta', captionEn:'Efficiency and Low Fuel Consumption on the Road'}
];
let activeIdx = 1;

function setTruck(idx, animate=true){
  activeIdx = (idx + trucks.length) % trucks.length;
  const t = trucks[activeIdx];
  document.querySelectorAll('.fleet-image').forEach(img=>{
    img.classList.toggle('is-active', img.dataset.truck === t.key);
  });
  document.querySelectorAll('.deck-card').forEach(card=>{
    card.classList.toggle('is-active', card.dataset.truck === t.key);
  });
  document.querySelectorAll('.brand-pill').forEach(pill=>{
    pill.classList.toggle('is-active', pill.dataset.truck === t.key);
  });
  document.getElementById('fleetTitle').textContent = t.name;
  document.getElementById('fleetCaption').textContent = currentLang==='en' ? t.captionEn : t.caption;
}
document.querySelectorAll('.deck-card, .brand-pill').forEach(el=>{
  el.addEventListener('click', ()=> setTruck(trucks.findIndex(t=>t.key===el.dataset.truck)));
});
document.getElementById('fleetPrev').addEventListener('click', ()=> setTruck(activeIdx-1));
document.getElementById('fleetNext').addEventListener('click', ()=> setTruck(activeIdx+1));
setInterval(()=> setTruck(activeIdx+1), 6000);

/* ---------- Marquee banner ---------- */
const marqueeWords = ['EUROTRUCK EN MOVIMIENTO','LA RUTA NO SE DETIENE','TU OPERACIÓN TAMPOCO','REPUESTOS SCANIA · VOLVO · MERCEDES-BENZ · MAN · IVECO','SERVICIO TÉCNICO MÓVIL 24/7'];
const track = document.getElementById('marqueeTrack');
const seq = [...marqueeWords, ...marqueeWords];
track.innerHTML = seq.map(w=>`<span>${w}</span>`).join('');

/* ---------- FAQ ---------- */
const faqData = [
  {q:'¿Qué marcas de piezas vendemos?', a:'Trabajamos con repuestos para Scania, Volvo, Mercedes-Benz, MAN e Iveco, además de referencias compatibles Renault Trucks y alternativas OEM seleccionadas.',
   qEn:'What part brands do we sell?', aEn:'We work with parts for Scania, Volvo, Mercedes-Benz, MAN and Iveco, plus compatible Renault Trucks references and selected OEM alternatives.'},
  {q:'¿Hacemos envíos?', a:'Coordinamos despachos a través de Caribe Express y transportistas aliados. Confirma disponibilidad y destino al solicitar tu cotización.',
   qEn:'Do we ship?', aEn:'We coordinate dispatches through Caribe Express and partner carriers. Confirm availability and destination when requesting your quote.'},
  {q:'¿De dónde provienen las partes que vendemos?', a:'Importamos piezas genuinas y alternativas OEM desde Europa y Brasil, con trazabilidad de marca y referencia para cada pedido.',
   qEn:'Where do the parts we sell come from?', aEn:'We import genuine parts and OEM alternatives from Europe and Brazil, with brand and reference traceability for every order.'},
  {q:'¿Qué tipo de servicios ofrecemos?', a:'Venta de repuestos, mantenimiento preventivo y correctivo, diagnóstico, instalación y asistencia mecánica móvil para flotas.',
   qEn:'What kind of services do we offer?', aEn:'Parts sales, preventive and corrective maintenance, diagnostics, installation and mobile mechanical assistance for fleets.'},
  {q:'¿Hacen asistencias en mi propia empresa?', a:'Sí. Coordinamos visitas a patios, talleres y centros de operación según la necesidad de tu flota.',
   qEn:'Do you provide assistance at my own company?', aEn:'Yes. We coordinate visits to yards, workshops and operation centers based on your fleet\'s needs.'},
  {q:'¿Tienen servicio de rescate?', a:'Contamos con rescate 24 horas y taller móvil. Llama a Jose Steven al (809) 949-9406 para atención en carretera.',
   qEn:'Do you have a rescue service?', aEn:'We offer 24-hour rescue and a mobile workshop. Call Jose Steven at (809) 949-9406 for roadside attention.'},
  {q:'¿Cómo contactarte con nosotros?', a:'Para cotizaciones llama a Kelvin al (809) 893-0258, para oficina al (809) 591-1222 o escribe a eurotruckcxa@yahoo.com.',
   qEn:'How can you contact us?', aEn:'For quotes call Kelvin at (809) 893-0258, for the office call (809) 591-1222, or write to eurotruckcxa@yahoo.com.'}
];
function renderFaqList(){
  const faqList = document.getElementById('faqList');
  if(!faqList) return;
  faqList.innerHTML = faqData.map((f,i)=>`
  <div class="faq-item${i===0?' is-open':''}">
    <button onclick="toggleFaq(${i})"><span><b>${String(i+1).padStart(2,'0')}</b>${tr(f.q,f.qEn)}</span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
    </button>
    <div class="faq-answer"><p>${tr(f.a,f.aEn)}</p></div>
  </div>`).join('');
}
renderFaqList();
function toggleFaq(i){
  document.querySelectorAll('.faq-item').forEach((el,idx)=>{
    el.classList.toggle('is-open', idx===i ? !el.classList.contains('is-open') : false);
  });
}

/* ---------- Catalog — sample real dataset (DT Spare Parts partner portal) ---------- */
const MARCA_FIJA = 'DT Spare Parts';
const EUROTRUCK_WHATSAPP = '18098930258';
/*PRODUCT_IMAGES: js/datos*/
function dtImg(ref){
  const f = PRODUCT_IMAGE_FILES[ref];
  if (f) return '/img/p/' + f;
  return `https://dieseltechnic.tiny.pictures/0355/${ref.replace(/\./g,'_')}_0.jpg?format=webp&width=420`;
}
const PORTAL_URL = 'https://partnerportal.dieseltechnic.com/es/search/results?start=0&length=25&sort_by=_score&desc=1';
function mkRefs(replaces){ return (replaces && replaces!=='—') ? [replaces] : []; }

/*RAW_PRODUCTS: js/datos*/


/*RAW_PRODUCTS_LIVE: js/datos*/
/*EXTRA_GTIN_ALT: js/datos*/
RAW_PRODUCTS_LIVE.forEach(function(a){
  var entry = {
    ref: a[0], title: a[1], desc: a[1],
    brand: a[2] || 'Multibrand', cat: a[3] || 'Repuesto',
    pack: (a[4] !== '' && a[4] != null ? a[4] : 1) + ' PCS',
    gtin: a[5] || '', url: '',
    refsList: a[7] ? a[7].split('|').filter(Boolean) : []
  };
  if (a[6]) entry.oe = a[6];
  RAW_PRODUCTS.push(entry);
});
;
const products = RAW_PRODUCTS.map(p => ({
  ...p,
  sku: p.ref,
  marca: MARCA_FIJA,
  img: dtImg(p.ref),
  sourceUrl: p.url || PORTAL_URL
}));
const PRODUCTS_BY_REF = {};
for (let i = 0; i < products.length; i++) { PRODUCTS_BY_REF[products[i].ref] = products[i]; }
const ALL_BRANDS = [...new Set(products.map(p=>p.brand))].sort((a,b)=>{
  const priority = ['Scania','Volvo','MAN','Mercedes-Benz','Iveco','DAF','Multibrand','DT Spare Parts'];
  const ia = priority.indexOf(a), ib = priority.indexOf(b);
  if(ia===-1 && ib===-1) return a.localeCompare(b);
  if(ia===-1) return 1;
  if(ib===-1) return -1;
  return ia-ib;
});
(function renderBrandFilters(){
  const wrap = document.getElementById('brandFilters');
  const counts = {};
  products.forEach(p=> counts[p.brand] = (counts[p.brand]||0)+1);
  wrap.innerHTML = '<span>MARCAS</span><button class="filter-chip is-active" data-filter="Todas">Todas las Marcas</button>' +
    ALL_BRANDS.map(b=> `<button class="filter-chip" data-filter="${b}">${b} <small style="opacity:.6;">(${counts[b]})</small></button>`).join('');
})();
let activeBrand = 'Todas';
let searchTerm = '';
let visibleCount = 48;
const PAGE_SIZE = 48;

/* ---------- Inventory state (stock / location / cost / price / gtin) ---------- */
/* Shared live state. Uses the Artifact "db" capability when published on claude.ai
   (real-time sync across every viewer); falls back to localStorage when this file is
   opened as a plain downloaded page (persists on this browser/device only). */
let dbApi = null;
let inventoryState = {}; // { [ref]: {stock, location, cost, price, gtin, sold} }
let scanHistory = [];    // [{time, ref, title, stock}]
let lastAddedRef = null; // referencia del último artículo sumado, para resaltarlo en verde en el reporte de contados
let ordersState = [];    // [{id, company, rnc, phone, email, items:[{ref,title,qty,price}], createdAt, status, takenBy, sentAt}]
let locations = [];      // ['Góndola 16', ...]
let deletedRefs = [];    // refs removed from catalog/inventory
let countAreas = [];     // [{tramo, estante, counts:{ref:qty}}] — áreas de conteo (Inventario fácil)
let activeAreaIndex = 0;
let salesLog = [];       // [{ref, title, qty, date}] — historial de salidas/ventas para el reporte mensual
let internalCodes = {};  // { [ref]: '00001' } — código interno Zebra permanente, asignado una sola vez, nunca se repite
let nextInternalCode = 1; // contador que solo avanza — nunca se reutiliza un número, ni al eliminar un artículo
let receivingSession = [];   // [{ref, qty}] — sesión de escaneo activa de Recepción de mercancía, en memoria hasta "Cerrar Entrada"
let receivingSessionStartedAt = null;
let inventoryEntriesLog = []; // [{date, user, area, totalUnits, items:[{ref,title,location,qty}]}] — entradas de inventario cerradas (historial)
let receivingKardex = [];    // [{date, user, items:[{ref,title,location,qty}], totalUnits}] — historial de entradas cerradas
// Costo y Precio final del catálogo se cargan/guardan en US$ para que no pierdan valor si el peso
// dominicano se devalúa. usdRate = cuántos RD$ vale 1 US$ hoy; se usa para convertir a pesos
// SOLO al congelar el precio de una línea de cotización (facturamos en pesos, cotizamos en dólares).
let usdRate = null;       // number, ej. 61.35
let usdRateDate = '';     // 'YYYY-MM-DD' del día que se tomó esa tasa
let usdRateManual = false; // true si el admin la fijó a mano en vez de venir de internet
const LS_KEY_USDRATE = 'eurotruck_usdrate_v1';
const LS_KEY_INV = 'eurotruck_inventory_v1';
const LS_KEY_ORD = 'eurotruck_orders_v1';
const LS_KEY_LOC = 'eurotruck_locations_v1';
const LS_KEY_DEL = 'eurotruck_deleted_v1';
const LS_KEY_AREAS = 'eurotruck_areas_v1';
const LS_KEY_ACTIVEAREA = 'eurotruck_activearea_v1';
const LS_KEY_SALES = 'eurotruck_sales_v1';
const LS_KEY_CODES = 'eurotruck_codes_v1';
const LS_KEY_NEXTCODE = 'eurotruck_nextcode_v1';
const LS_KEY_RECV_SESSION = 'eurotruck_recv_session_v1'; // borrador de la sesión activa (solo local — se borra al Cerrar Entrada)
const LS_KEY_RECV_KARDEX = 'eurotruck_recv_kardex_v1';

function defaultInvRow(ref){
  const p = PRODUCTS_BY_REF[ref];
  const seededAlt = (EXTRA_GTIN_ALT[ref] || []).slice();
  return {stock:0, location:'', cost:'', price:'', gtin:(p && p.gtin) || '', sold:0, altCodes:seededAlt};
}
// Vuelve a revisar EXTRA_GTIN_ALT[ref] y agrega a un registro YA EXISTENTE los códigos
// que falten (sin duplicar y sin repetir el principal). Necesario porque un artículo
// que ya se había abierto/contado antes de agregar más GTIN por Excel se queda con su
// registro viejo y nunca vuelve a pasar por defaultInvRow(), que es donde antes se
// sembraban los códigos por única vez.
function mergeSeededAltCodes(ref, row){
  const seeded = EXTRA_GTIN_ALT[ref];
  if(!seeded || !seeded.length) return;
  const p = PRODUCTS_BY_REF[ref];
  const principal = ((row.gtin || (p && p.gtin) || '')+'').toLowerCase();
  const existingLower = new Set(row.altCodes.map(c=>String(c).toLowerCase()));
  seeded.forEach(code=>{
    const lc = String(code).toLowerCase();
    if(!lc || lc === principal || existingLower.has(lc)) return;
    row.altCodes.push(code);
    existingLower.add(lc);
  });
}
function getInv(ref){
  const row = inventoryState[ref] || (inventoryState[ref] = defaultInvRow(ref));
  if(!Array.isArray(row.altCodes)) row.altCodes = [];
  mergeSeededAltCodes(ref, row);
  return row;
}
// Igual que getInv() pero de solo lectura: no crea un registro de inventario nuevo.
// Se usa en listas/exportaciones que recorren TODO el catálogo (como "Pedido bajo
// stock" con artículos nunca contados) para no generar miles de registros de
// inventario solo por leerlos.
function peekInv(ref){
  const row = inventoryState[ref];
  if(row){
    if(!Array.isArray(row.altCodes)) row.altCodes = [];
    mergeSeededAltCodes(ref, row);
    return row;
  }
  return defaultInvRow(ref);
}
/* Código interno (Zebra): lo da SOLO el servidor (nunca se repite ni cambia).
   Mientras llega, se muestra vacío y se pide en grupo. Sin servidor (modo local) se asigna aquí como antes. */
let _codeReq = new Set(), _codeTimer = null, _codeWaiters = [], _codeBusy = false;
function codeServerOn(){ try{ const sv = srvSettings(); return !!(sv.url && sv.token); }catch(e){ return false; } }
function requestInternalCodes(refs){
  (refs||[]).forEach(r=>{ if(r && !internalCodes[r]) _codeReq.add(r); });
  if(!_codeReq.size) return Promise.resolve();
  return new Promise(res=>{ _codeWaiters.push(res); clearTimeout(_codeTimer); _codeTimer = setTimeout(flushCodeReq, 200); });
}
async function flushCodeReq(){
  if(_codeBusy){ _codeTimer = setTimeout(flushCodeReq, 300); return; }
  const refs = [..._codeReq]; _codeReq.clear(); const waiters = _codeWaiters.splice(0);
  if(!refs.length){ waiters.forEach(w=>w()); return; }
  _codeBusy = true;
  try{
    const sv = srvSettings();
    const r = await fetch(sv.url + '/api/eurotruck/codigos', {method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer ' + sv.token}, body: JSON.stringify({refs})});
    const j = await r.json().catch(()=>({}));
    if(!r.ok || !j.codes) throw new Error(j.error || ('error ' + r.status));
    Object.assign(internalCodes, j.codes); if(j.next) nextInternalCode = j.next; _codeIndex = null;
    clearTimeout(window._codeRender); window._codeRender = setTimeout(()=>{ try{ renderProducts(); }catch(e){} try{ if(articleDetailRef) renderArticleDetail(); }catch(e){} try{ renderCatalogCards(); }catch(e){} }, 150);
  }catch(e){ setTimeout(()=>requestInternalCodes(refs), 15000); }
  finally{ _codeBusy = false; waiters.forEach(w=>w()); }
}
function getInternalCode(ref){
  if(internalCodes[ref]) return internalCodes[ref];
  if(codeServerOn()){ requestInternalCodes([ref]); return ''; }
  const code = String(nextInternalCode).padStart(5,'0');
  internalCodes[ref] = code;
  nextInternalCode++;
  saveMeta();
  return code;
}
// Asigna códigos internos a muchas referencias de una sola vez, guardando una sola vez al final
// (evita guardar el estado completo miles de veces seguidas al exportar el catálogo completo).
function ensureInternalCodes(refs){
  if(codeServerOn()) return requestInternalCodes(refs);
  let assignedAny = false;
  refs.forEach(ref=>{
    if(!internalCodes[ref]){
      internalCodes[ref] = String(nextInternalCode).padStart(5,'0');
      nextInternalCode++;
      assignedAny = true;
    }
  });
  if(assignedAny) saveMeta();
  return Promise.resolve();
}
function isDeleted(ref){ return deletedRefs.includes(ref); }
function visibleProducts(){ if(!deletedRefs.length) return products.slice(); const _ds = new Set(deletedRefs); return products.filter(p=>!_ds.has(p.ref)); }
function normalizeOrders(){
  ordersState.forEach(o=>{
    if(!o.status) o.status = 'nueva';
    if(!Array.isArray(o.items)) o.items = [];
    o.items.forEach(it=>{ if(it.price===undefined || it.price===null) it.price = Number(getInv(it.ref).price)||0; });
  });
}

function loadLocalFallback(){
  try{
    const inv = localStorage.getItem(LS_KEY_INV);
    if(inv) inventoryState = JSON.parse(inv);
    const ord = localStorage.getItem(LS_KEY_ORD);
    if(ord) ordersState = JSON.parse(ord);
    const loc = localStorage.getItem(LS_KEY_LOC);
    if(loc) locations = JSON.parse(loc);
    const del = localStorage.getItem(LS_KEY_DEL);
    if(del) deletedRefs = JSON.parse(del);
    const areas = localStorage.getItem(LS_KEY_AREAS);
    if(areas) countAreas = JSON.parse(areas);
    const activeIdx = localStorage.getItem(LS_KEY_ACTIVEAREA);
    if(activeIdx !== null) activeAreaIndex = Number(activeIdx)||0;
    const sales = localStorage.getItem(LS_KEY_SALES);
    if(sales) salesLog = JSON.parse(sales);
    const codes = localStorage.getItem(LS_KEY_CODES);
    if(codes) internalCodes = JSON.parse(codes);
    const nextCode = localStorage.getItem(LS_KEY_NEXTCODE);
    if(nextCode) nextInternalCode = Number(nextCode)||1;
    const kardex = localStorage.getItem(LS_KEY_RECV_KARDEX);
    if(kardex) receivingKardex = JSON.parse(kardex);
    const sess = localStorage.getItem(LS_KEY_RECV_SESSION);
    if(sess){ const parsed = JSON.parse(sess); receivingSession = parsed.items||[]; receivingSessionStartedAt = parsed.startedAt||null; }
  }catch(e){ /* private mode / unavailable — keep in-memory only */ }
}
function saveLocalFallback(){
  try{
    localStorage.setItem(LS_KEY_INV, JSON.stringify(inventoryState));
    localStorage.setItem(LS_KEY_ORD, JSON.stringify(ordersState));
    localStorage.setItem(LS_KEY_LOC, JSON.stringify(locations));
    localStorage.setItem(LS_KEY_DEL, JSON.stringify(deletedRefs));
    localStorage.setItem(LS_KEY_AREAS, JSON.stringify(countAreas));
    localStorage.setItem(LS_KEY_ACTIVEAREA, String(activeAreaIndex));
    localStorage.setItem(LS_KEY_SALES, JSON.stringify(salesLog));
    localStorage.setItem(LS_KEY_CODES, JSON.stringify(internalCodes));
    localStorage.setItem(LS_KEY_NEXTCODE, String(nextInternalCode));
    localStorage.setItem(LS_KEY_RECV_KARDEX, JSON.stringify(receivingKardex));
  }catch(e){ /* ignore */ }
}
// El borrador de la sesión activa de Recepción se guarda SIEMPRE de forma local e inmediata
// (nunca solo en el servidor) para que un cierre accidental de la ventana antes de "Cerrar
// Entrada" no pierda lo ya escaneado — al reabrir, la sesión sigue exactamente donde quedó.
function saveReceivingSessionDraft(){
  try{ localStorage.setItem(LS_KEY_RECV_SESSION, JSON.stringify({items:receivingSession, startedAt:receivingSessionStartedAt})); }catch(e){}
  // También a la nube, para que los demás ordenadores vean en vivo lo que se va escaneando.
  if(dbApi){ try{ dbApi.doc('eurotruck/receiving').set({items:receivingSession, startedAt:receivingSessionStartedAt}); }catch(e){} }
}
function clearReceivingSessionDraft(){
  try{ localStorage.removeItem(LS_KEY_RECV_SESSION); }catch(e){}
  if(dbApi){ try{ dbApi.doc('eurotruck/receiving').set({items:[], startedAt:null}); }catch(e){} }
}

async function saveInventory(){
  saveLocalFallback(); // copia local inmediata en cada cambio
  if(dbApi){
    try{ await dbApi.doc('eurotruck/inventory').set(inventoryState); }catch(e){}
  }
}
async function saveOrders(){
  saveLocalFallback(); // copia local inmediata en cada cambio
  if(dbApi){
    try{ await dbApi.doc('eurotruck/orders').set({list: ordersState}); }catch(e){}
  }
}
// "ARTÍCULOS CONTADOS EN ESTA ÁREA" (countAreas) vive acá — se guarda en el navegador de
// forma INMEDIATA y sincrónica en cada escaneo, sin esperar al servidor, para que cerrar la
// ventana emergente de Inventario (o que se cierre sola) nunca borre lo contado: al volver a
// abrirla, sigue exactamente igual hasta que se presione "Cerrar Entrada".
async function saveMeta(){
  try{
    localStorage.setItem(LS_KEY_AREAS, JSON.stringify(countAreas));
    localStorage.setItem(LS_KEY_ACTIVEAREA, String(activeAreaIndex));
    localStorage.setItem(LS_KEY_CODES, JSON.stringify(internalCodes));
    localStorage.setItem(LS_KEY_NEXTCODE, String(nextInternalCode));
    localStorage.setItem(LS_KEY_RECV_KARDEX, JSON.stringify(receivingKardex));
  }catch(e){}
  if(dbApi){
    try{ await dbApi.doc('eurotruck/meta').set({locations, deletedRefs, countAreas, activeAreaIndex, salesLog, internalCodes, nextInternalCode, receivingKardex, scanHistory, usdRateInfo: usdRateManual ? {rate:usdRate, date:usdRateDate, manual:true} : null}); }catch(e){ saveLocalFallback(); }
  } else {
    saveLocalFallback();
  }
}

/* ===================== Backup / Restaurar todos los datos =====================
 * Junta todo lo que el negocio va modificando (inventario, stock, costos,
 * precios, GTIN agregados, cotizaciones, ubicaciones, artículos borrados,
 * áreas de conteo, ventas, códigos internos) en un solo archivo .json que se
 * puede guardar y volver a cargar si algo se pierde o se modifica la página.
 * No incluye contraseñas ni sesiones — solo los datos del negocio. */
function collectBackupData(){
  return {
    backupType: 'eurotruck_backup',
    version: 1,
    fecha: new Date().toISOString(),
    inventoryState,
    ordersState,
    locations,
    deletedRefs,
    countAreas,
    activeAreaIndex,
    salesLog,
    internalCodes,
    nextInternalCode
  };
}

function downloadFullBackup(){
  try{
    const data = collectBackupData();
    const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
    const fecha = new Date();
    const pad = n => String(n).padStart(2,'0');
    const nombre = `eurotruck_backup_${fecha.getFullYear()}-${pad(fecha.getMonth()+1)}-${pad(fecha.getDate())}_${pad(fecha.getHours())}${pad(fecha.getMinutes())}.json`;
    downloadBlob(nombre, blob);
    showToast('Backup descargado: ' + nombre);
  } catch(err){
    console.error(err);
    showToast('No se pudo generar el backup.');
  }
}

async function handleBackupRestore(event){
  const file = event.target.files && event.target.files[0];
  event.target.value = '';
  if(!file) return;
  const pass = prompt('Vas a REEMPLAZAR todo el inventario, cotizaciones y datos actuales con los del backup.\nEscribí la clave de administrador para continuar:');
  if(pass === null){ showToast('Cancelado.'); return; }
  if(pass !== '1989'){ playErrorSound(); showToast('Clave incorrecta — no se restauró nada.'); return; }
  if(!confirm('Esto reemplaza TODOS los datos actuales (inventario, stock, GTIN, cotizaciones, etc.) por los del archivo de backup y no se puede deshacer. ¿Continuar?')){ showToast('Cancelado.'); return; }
  try{
    const text = await file.text();
    const data = JSON.parse(text);
    if(!data || data.backupType !== 'eurotruck_backup'){
      showToast('El archivo no parece ser un backup válido de Eurotruck.');
      return;
    }
    if(data.inventoryState) inventoryState = data.inventoryState;
    if(data.ordersState) ordersState = data.ordersState;
    if(data.locations) locations = data.locations;
    if(data.deletedRefs) deletedRefs = data.deletedRefs;
    if(data.countAreas) countAreas = data.countAreas;
    if(typeof data.activeAreaIndex === 'number') activeAreaIndex = data.activeAreaIndex;
    if(data.salesLog) salesLog = data.salesLog;
    if(data.internalCodes) internalCodes = data.internalCodes;
    if(typeof data.nextInternalCode === 'number') nextInternalCode = data.nextInternalCode;
    normalizeOrders();
    await saveInventory();
    await saveOrders();
    await saveMeta();
    renderCountedItemsList();
    renderInventoryStats();
    renderLowStockList();
    renderCatalogCards();
    renderProducts();
    renderScanHistoryTable();
    showToast('Backup restaurado correctamente. Recargando…');
    setTimeout(() => location.reload(), 1200);
  } catch(err){
    console.error(err);
    showToast('No se pudo restaurar el backup: ' + (err && err.message ? err.message : 'archivo inválido'));
  }
}

/* Adaptador de Firestore con la MISMA interfaz .doc().get()/.set()/.onSnapshot()
   que ya usa toda la app, para sincronizar entre varios ordenadores en tiempo real.
   Cada documento se guarda envuelto en {__d:...} para admitir claves con puntos
   (SKU/refs como "1.21571") sin problemas. */
function firebaseConfigured(){
  const c = window.FIREBASE_CONFIG;
  return !!(c && c.apiKey && c.projectId && window.firebase && window.firebase.firestore);
}
const SYNC_CLIENT_ID = Math.random().toString(36).slice(2) + Date.now().toString(36);
let syncPendingCount = 0;
function setSyncStatus(state, extra){
  const el = document.getElementById('cloudSyncBadge');
  if(!el) return;
  const map = {
    local:   ['💾 Solo en este equipo — inicia sesión para ponerlo en línea', '#7a7a7a', 'Esta PC aún no guarda en línea. Inicia sesión (si ya se subió acceso.json) o, si eres administrador, haz clic para configurarlo.'],
    follower:['🔗 En línea mediante otra ventana', '#1f6f9d', 'Otra ventana de esta página ya está conectada en esta PC; esta recibe todo de ella al instante.'],
    saving:  ['☁️ Guardando…', '#c99400', 'Subiendo los cambios a la nube…'],
    ok:      ['☁️ Sincronizado', '#1f9d63', 'Todo está guardado en la nube y se ve en los demás ordenadores.'],
    offline: ['⚠️ Sin conexión — se subirá al volver', '#c0392b', 'Sin internet: los cambios quedan guardados y se suben solos al reconectar.'],
    error:   ['⚠️ Error al guardar — clic para revisar', '#c0392b', 'No se pudo guardar en la nube: '+(extra||'')+'. Los datos siguen guardados en este equipo.']
  };
  const m = map[state] || map.local;
  el.textContent = m[0]; el.style.background = m[1]; el.title = m[2];
  el.style.display = '';
}
window.addEventListener('online',  ()=>{ if(dbApi && firebaseConfigured()) setSyncStatus(syncPendingCount ? 'saving' : 'ok'); });
window.addEventListener('offline', ()=>{ if(dbApi && firebaseConfigured()) setSyncStatus('offline'); });

function makeFirebaseDbApi(cfg){
  if(!firebase.apps || !firebase.apps.length){ firebase.initializeApp(cfg); }
  const fs = firebase.firestore();
  try{ fs.enablePersistence({synchronizeTabs:true}).catch(()=>{}); }catch(e){}
  // Firestore admite máx. 1 MB por documento: los datos grandes se parten en trozos.
  const CHUNK_CHARS = 300000;
  const DEBOUNCE_MS = 700;      // agrupa escaneos rápidos en una sola subida
  const pending = {};           // path -> {timer, obj, resolvers}
  const dirty = {};             // path -> true mientras hay cambios locales sin subir
  const lastChunkIds = {};

  function splitPath(path){ const i = path.lastIndexOf('/'); return [path.slice(0,i), path.slice(i+1)]; }

  async function readValue(path, data){
    if(!data) return null;
    if(data.__d !== undefined) return data.__d;
    if(data.__chunks){
      const [col, id] = splitPath(path);
      const parts = await Promise.all(data.__chunkIds.map(cid=> fs.collection(col).doc(cid).get()));
      lastChunkIds[path] = data.__chunkIds;
      return JSON.parse(parts.map(p=> (p.exists ? p.data().s : '')).join(''));
    }
    return null;
  }

  async function writeNow(path, obj){
    const ref = fs.doc(path);
    const json = JSON.stringify(obj);
    const meta = {__ts: Date.now(), __cid: SYNC_CLIENT_ID};
    if(json.length <= CHUNK_CHARS){
      await ref.set(Object.assign({__d: obj}, meta));
    } else {
      const [col, id] = splitPath(path);
      const ver = meta.__ts.toString(36);
      const ids = [];
      for(let i=0, n=0; i<json.length; i+=CHUNK_CHARS, n++){
        const cid = id + '__' + ver + '__' + n;
        ids.push(cid);
        await fs.collection(col).doc(cid).set({s: json.slice(i, i+CHUNK_CHARS)});
      }
      await ref.set(Object.assign({__chunks: ids.length, __chunkIds: ids}, meta));
      const old = lastChunkIds[path];
      lastChunkIds[path] = ids;
      if(old) old.forEach(cid=>{ if(!ids.includes(cid)) fs.collection(col).doc(cid).delete().catch(()=>{}); });
    }
  }

  async function flush(path){
    const job = pending[path];
    if(!job) return;
    delete pending[path];
    try{
      await writeNow(path, job.obj);
      job.resolvers.forEach(r=>r.res());
    }catch(e){
      console.warn('Firebase guardar:', e && e.message);
      setSyncStatus(navigator.onLine ? 'error' : 'offline', e && e.message);
      job.resolvers.forEach(r=>r.rej(e));
    }finally{
      if(!pending[path]) dirty[path] = false;
      syncPendingCount = Math.max(0, syncPendingCount - 1);
      if(!syncPendingCount && navigator.onLine) setSyncStatus('ok');
    }
  }

  return {
    doc(path){
      const ref = fs.doc(path);
      return {
        async get(){ const s = await ref.get(); const v = await readValue(path, s.exists ? s.data() : null); return v || {}; },
        set(obj){
          // Copia profunda en el momento: así se sube exactamente lo que había al escanear.
          const snap = JSON.parse(JSON.stringify(obj));
          dirty[path] = true;
          setSyncStatus(navigator.onLine ? 'saving' : 'offline');
          return new Promise((res, rej)=>{
            let job = pending[path];
            if(job){ clearTimeout(job.timer); job.obj = snap; }
            else { job = pending[path] = {obj: snap, resolvers: []}; syncPendingCount++; }
            job.resolvers.push({res, rej});
            job.timer = setTimeout(()=>flush(path), DEBOUNCE_MS);
          });
        },
        onSnapshot(cb){
          return ref.onSnapshot(async s=>{
            if(s.metadata.hasPendingWrites) return;          // eco de un cambio propio aún no confirmado
            const d = s.exists ? s.data() : null;
            if(d && d.__cid === SYNC_CLIENT_ID) return;      // eco de un cambio hecho en este mismo equipo
            if(dirty[path]) return;                          // hay escaneos locales sin subir: no pisarlos
            try{ cb(await readValue(path, d)); }catch(e){ console.warn('Firebase leer:', e && e.message); }
          }, err=>{ console.warn('Firebase sync:', err && err.message); setSyncStatus('error', err && err.message); });
        }
      };
    }
  };
}
// Si se cierra la página con cambios aún sin subir, Firestore los conserva en la caché
// local (persistencia) y los sube al volver a abrir. Igual se avisa para no perder nada.
window.addEventListener('beforeunload', e=>{
  if(syncPendingCount > 0){ e.preventDefault(); e.returnValue = ''; }
});


/* ===================== Guardado en GitHub =====================
   Cada documento (inventory, orders, meta, receiving) es un archivo .json en
   una rama aparte del repositorio. Cada cambio se guarda al instante en este
   equipo y se sube solo a GitHub; los demás equipos revisan cada pocos
   segundos y muestran lo nuevo. */
const GH_TOKEN_KEY = 'eurotruck_github_sync_v1';
function githubSyncSettings(){
  const base = Object.assign({branch:'inventario-datos', folder:'datos'}, window.GITHUB_SYNC||{});
  let local = {};
  try{ local = JSON.parse(localStorage.getItem(GH_TOKEN_KEY)||'{}'); }catch(e){}
  return {
    owner: (base.owner || local.owner || '').trim(),
    repo: (base.repo || local.repo || '').trim(),
    branch: (base.branch || 'inventario-datos').trim(),
    folder: (base.folder || 'datos').trim(),
    token: (local.token || '').trim()
  };
}
function githubConfigured(){ const c = githubSyncSettings(); return !!(c.owner && c.repo && c.token); }
async function configureGithubSync(){
  if(!currentUser || currentUser.role!=='admin'){ showToast('Inicia sesión como administrador para configurar el guardado en línea.'); openLogin(); return; }
  const cur = githubSyncSettings();
  if(dbApi && githubConfigured() && !confirm('Esta PC ya guarda en línea en '+cur.owner+'/'+cur.repo+'.\n¿Quieres cambiar la configuración y generar un acceso.json nuevo?')) return;
  const owner = prompt('1/4 · Usuario de GitHub (dueño del repositorio de datos):', cur.owner); if(owner===null) return;
  const repo  = prompt('2/4 · Repositorio PRIVADO donde se guardan los datos:', cur.repo || 'eurotruck-datos'); if(repo===null) return;
  const token = prompt('3/4 · Pega el token de GitHub (github_pat_…):', ''); if(!token) return;
  const pw    = prompt('4/4 · Escribe TU contraseña ('+currentUser.username+') para cifrar el acceso:', ''); if(!pw) return;
  if(!(await verifyPassword(currentUser.username, pw))){ playErrorSound(); showToast('Contraseña incorrecta.'); return; }
  const cfg = {owner:owner.trim(), repo:repo.trim(), branch:cur.branch||'inventario-datos', token:token.trim()};
  localStorage.setItem(GH_TOKEN_KEY, JSON.stringify(cfg));
  try{ await makeGithubDbApi(cfg); }catch(err){ playErrorSound(); alert('No se pudo conectar con GitHub: '+(err && err.message)); return; }
  const teamKey = await unwrapTeamKey(currentUser.username, pw);
  const data = await aesEncrypt(teamKey, new TextEncoder().encode(JSON.stringify(cfg)));
  const blob = new Blob([JSON.stringify({v:1, data}, null, 1)], {type:'application/json'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'acceso.json';
  document.body.appendChild(a); a.click(); a.remove();
  alert('✔ Conectado.\n\nSe descargó "acceso.json". Súbelo a GitHub en el MISMO lugar que index.html.\nDesde ese momento, cualquier PC queda en línea con solo iniciar sesión.');
  await initData();
}

function b64EncodeUtf8(str){
  const bytes = new TextEncoder().encode(str);
  let bin = ''; const CH = 0x8000;
  for(let i=0;i<bytes.length;i+=CH) bin += String.fromCharCode.apply(null, bytes.subarray(i, i+CH));
  return btoa(bin);
}
function b64DecodeUtf8(b64){
  const bin = atob(String(b64||'').replace(/\s/g,''));
  const bytes = new Uint8Array(bin.length);
  for(let i=0;i<bin.length;i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

/* ===================== Base de datos interna (IndexedDB) =====================
   Guarda TODO en el navegador sin el límite de 5 MB de localStorage, y también la
   cola de cambios que faltan por subir a GitHub (si se cierra la página o se va el
   internet, se sube sola la próxima vez que se abra). */
const IDB_NAME = 'eurotruck_db', IDB_STORE = 'kv';
let _idbP = null;
function idbOpen(){
  if(_idbP) return _idbP;
  _idbP = new Promise((res, rej)=>{
    if(!('indexedDB' in window)) return rej(new Error('sin IndexedDB'));
    const rq = indexedDB.open(IDB_NAME, 1);
    rq.onupgradeneeded = ()=> rq.result.createObjectStore(IDB_STORE);
    rq.onsuccess = ()=> res(rq.result);
    rq.onerror = ()=> rej(rq.error);
  });
  return _idbP;
}
async function idbGet(k){ try{ const db = await idbOpen(); return await new Promise((res,rej)=>{ const r = db.transaction(IDB_STORE).objectStore(IDB_STORE).get(k); r.onsuccess=()=>res(r.result); r.onerror=()=>rej(r.error); }); }catch(e){ return undefined; } }
async function idbPut(k, v){ try{ const db = await idbOpen(); await new Promise((res,rej)=>{ const t = db.transaction(IDB_STORE,'readwrite'); t.objectStore(IDB_STORE).put(v, k); t.oncomplete=res; t.onerror=()=>rej(t.error); }); }catch(e){ console.warn('BD interna:', e && e.message); } }
async function idbDel(k){ try{ const db = await idbOpen(); await new Promise((res,rej)=>{ const t = db.transaction(IDB_STORE,'readwrite'); t.objectStore(IDB_STORE).delete(k); t.oncomplete=res; t.onerror=()=>rej(t.error); }); }catch(e){} }

function collectAppState(){
  return {inventoryState, ordersState, locations, deletedRefs, countAreas, activeAreaIndex, salesLog,
    internalCodes, nextInternalCode, receivingKardex, receivingSession, receivingSessionStartedAt,
    scanHistory, usdRate, usdRateDate, usdRateManual, inventoryEntriesLog};
}
function assignAppState(st){
  if(!st) return;
  if(st.inventoryState) inventoryState = st.inventoryState;
  if(st.ordersState) ordersState = st.ordersState;
  if(st.locations) locations = st.locations;
  if(st.deletedRefs) deletedRefs = st.deletedRefs;
  if(st.countAreas) countAreas = st.countAreas;
  if(st.activeAreaIndex!==undefined) activeAreaIndex = st.activeAreaIndex;
  if(st.salesLog) salesLog = st.salesLog;
  if(st.internalCodes) internalCodes = st.internalCodes;
  if(st.nextInternalCode!==undefined) nextInternalCode = st.nextInternalCode;
  if(st.receivingKardex) receivingKardex = st.receivingKardex;
  if(st.receivingSession) receivingSession = st.receivingSession;
  if(st.receivingSessionStartedAt!==undefined) receivingSessionStartedAt = st.receivingSessionStartedAt;
  if(st.scanHistory) scanHistory = st.scanHistory;
  if(st.inventoryEntriesLog) inventoryEntriesLog = st.inventoryEntriesLog;
  if(st.usdRate!==undefined && st.usdRate!==null){ usdRate = st.usdRate; usdRateDate = st.usdRateDate||''; usdRateManual = !!st.usdRateManual; }
}
let _idbStateTimer = null;
function saveAppStateToIdb(){
  clearTimeout(_idbStateTimer);
  _idbStateTimer = setTimeout(()=> idbPut('state', JSON.parse(JSON.stringify(collectAppState()))), 120);
}

/* ===================== Combinar cambios de varias PC =====================
   merge3(base, local, remoto): "base" es la última versión que esta PC sabía que estaba
   en GitHub. Se conserva lo que cambió cada PC: escaneos, conteos (se SUMAN), artículos
   nuevos y también lo ELIMINADO en cualquiera de las dos. */
const ADDITIVE_KEYS = new Set(['stock','qty','sold','nextInternalCode']);
function jsonEq(a, b){ return JSON.stringify(a) === JSON.stringify(b); }
function isPlainObj(x){ return x && typeof x === 'object' && !Array.isArray(x); }
function arrItemKey(x){
  if(isPlainObj(x)){
    if(x.id !== undefined) return 'id:'+x.id;
    if(x.ref !== undefined && x.qty !== undefined && Object.keys(x).length <= 3) return 'ref:'+x.ref;
    if(x.counts !== undefined) return 'area:'+(x.tramo||'')+'/'+(x.estante||'');
  }
  return 'v:'+JSON.stringify(x);
}
function keyedArr(arr){
  const m = new Map(), order = [], seen = {};
  (Array.isArray(arr)?arr:[]).forEach(x=>{ let k = arrItemKey(x); seen[k] = (seen[k]||0)+1; if(seen[k]>1) k += '#'+seen[k]; m.set(k, x); order.push(k); });
  return {m, order};
}
function merge3(base, local, remote, keyName, parentName){
  if(typeof local === 'number' && typeof remote === 'number' && typeof base === 'number' && (ADDITIVE_KEYS.has(keyName) || parentName === 'counts')){
    return remote + (local - base);
  }
  if(base === undefined && jsonEq(local, remote)) return local;
  if(base !== undefined && jsonEq(local, base)) return remote;
  if(base !== undefined && jsonEq(remote, base)) return local;
  // si las dos PC hicieron "lo mismo" (ej. ambas escanearon 1 vez), se revisa por dentro para sumar
  if(isPlainObj(local) && isPlainObj(remote)){
    const b = isPlainObj(base) ? base : {};
    const out = {};
    new Set([...Object.keys(b), ...Object.keys(local), ...Object.keys(remote)]).forEach(k=>{
      const v = merge3(b[k], local[k], remote[k], k, keyName);
      if(v !== undefined) out[k] = v;
    });
    return out;
  }
  if(Array.isArray(local) && Array.isArray(remote)){
    const B = keyedArr(base), L = keyedArr(local), R = keyedArr(remote);
    const out = new Map();
    new Set([...B.order, ...L.order, ...R.order]).forEach(k=>{
      const v = merge3(B.m.get(k), L.m.get(k), R.m.get(k), keyName, parentName);
      if(v !== undefined) out.set(k, v);
    });
    // orden: lo nuevo de la otra PC que estaba al principio va al principio; el resto en el orden de esta PC
    const res = [], used = new Set();
    const firstCommon = R.order.findIndex(k=>L.m.has(k));
    R.order.slice(0, firstCommon < 0 ? R.order.length : firstCommon).forEach(k=>{ if(out.has(k) && !L.m.has(k)){ res.push(out.get(k)); used.add(k); } });
    L.order.forEach(k=>{ if(out.has(k) && !used.has(k)){ res.push(out.get(k)); used.add(k); } });
    R.order.forEach(k=>{ if(out.has(k) && !used.has(k)){ res.push(out.get(k)); used.add(k); } });
    return res;
  }
  if(jsonEq(local, remote)) return local;
  if(local === undefined && base !== undefined && jsonEq(remote, base)) return undefined; // eliminado aquí
  if(remote === undefined && base !== undefined && jsonEq(local, base)) return undefined; // eliminado allá
  return local === undefined ? remote : local; // conflicto real: gana esta PC
}

async function makeGithubDbApi(cfg){
  const API = 'https://api.github.com/repos/' + encodeURIComponent(cfg.owner) + '/' + encodeURIComponent(cfg.repo);
  const headers = {'Authorization':'Bearer '+cfg.token, 'Accept':'application/vnd.github+json', 'X-GitHub-Api-Version':'2022-11-28'};
  const gh = (url, opts)=> fetch(url, Object.assign({cache:'no-store'}, opts||{}, {headers: Object.assign({}, headers, (opts&&opts.headers)||{})}));
  const repoRes = await gh(API);
  if(repoRes.status===401) throw new Error('Token inválido o vencido');
  if(repoRes.status===404) throw new Error('No se encontró el repositorio '+cfg.owner+'/'+cfg.repo+' (o el token no tiene acceso)');
  if(!repoRes.ok) throw new Error('GitHub respondió '+repoRes.status);
  const repoInfo = await repoRes.json();
  const br = await gh(API + '/branches/' + encodeURIComponent(cfg.branch));
  if(br.status===404){
    const def = await gh(API + '/git/ref/heads/' + encodeURIComponent(repoInfo.default_branch));
    if(!def.ok) throw new Error('El repositorio está vacío: crea un README primero');
    const sha = (await def.json()).object.sha;
    const mk = await gh(API + '/git/refs', {method:'POST', body: JSON.stringify({ref:'refs/heads/'+cfg.branch, sha})});
    if(!mk.ok && mk.status!==422) throw new Error('No se pudo crear la rama '+cfg.branch+' ('+mk.status+')');
  }

  const DEBOUNCE_MS = 1500, MIN_GAP_MS = 6000, POLL_MS = 5000;
  const repoKey = cfg.owner+'/'+cfg.repo+'@'+cfg.branch;
  const state = {};
  const st = path => state[path] || (state[path] = {sha:null, etag:null, base:undefined, lastWrite:0, job:null, inflight:false, dirty:false, listeners:[]});
  const filePath = path => cfg.folder + '/' + path.split('/').pop() + '.json';
  const contentsUrl = path => API + '/contents/' + filePath(path).split('/').map(encodeURIComponent).join('/');
  const baseKey = path => 'gh_base:'+repoKey+':'+path, pendKey = path => 'gh_pending:'+repoKey+':'+path;

  async function read(path, useEtag){
    const s = st(path);
    const h = {}; if(useEtag && s.etag) h['If-None-Match'] = s.etag;
    const r = await gh(contentsUrl(path) + '?ref=' + encodeURIComponent(cfg.branch), {headers:h});
    if(r.status===304) return {changed:false};
    if(r.status===404) return {changed:true, value:undefined, sha:null};
    if(!r.ok) throw new Error('GitHub leer '+r.status);
    const etag = r.headers.get('ETag');
    const j = await r.json();
    let text;
    if(j.content && j.encoding==='base64') text = b64DecodeUtf8(j.content);
    else { const b = await gh(API + '/git/blobs/' + j.sha); if(!b.ok) throw new Error('GitHub blob '+b.status); text = b64DecodeUtf8((await b.json()).content); }
    let value; try{ value = JSON.parse(text); }catch(e){}
    if(useEtag) s.etag = etag;
    return {changed:true, value, sha:j.sha};
  }
  function remember(path){ const s = st(path); idbPut(baseKey(path), {sha:s.sha, base:s.base}); }
  const clone = v => v === undefined ? undefined : JSON.parse(JSON.stringify(v));
  function notify(path, value){
    // copia: la app modifica sus datos en el lugar y no debe tocar la "base" guardada
    st(path).listeners.forEach(cb=>{ try{ cb(clone(value)); }catch(e){ console.warn(e); } });
    try{ saveLocalFallback(); }catch(e){}
  }

  // Sube "obj". Si otra PC subió algo mientras tanto, lo combina y reintenta.
  async function write(path, obj){
    const s = st(path);
    for(let attempt=0; attempt<5; attempt++){
      const payload = {message:'Inventario: '+path.split('/').pop()+' — '+(currentUser?currentUser.username:'equipo')+' '+new Date().toLocaleString('es-DO'), content:b64EncodeUtf8(JSON.stringify(obj)), branch:cfg.branch};
      if(s.sha) payload.sha = s.sha;
      const r = await gh(contentsUrl(path), {method:'PUT', body: JSON.stringify(payload)});
      if(r.ok){ const j = await r.json(); s.sha = j.content && j.content.sha; return obj; }
      if(r.status===409 || r.status===422){
        const cur = await read(path, false);
        obj = merge3(s.base, obj, cur.value);
        s.sha = cur.sha; s.base = cur.value;
        continue;
      }
      if(r.status===403 || r.status===429){ await new Promise(res=>setTimeout(res, 15000)); continue; }
      throw new Error('GitHub guardar '+r.status);
    }
    throw new Error('GitHub guardar: demasiados reintentos');
  }

  function schedule(path){
    const s = st(path);
    if(!s.job || s.inflight) return;
    clearTimeout(s.job.timer);
    const wait = Math.max(DEBOUNCE_MS, s.lastWrite + MIN_GAP_MS - Date.now());
    s.job.timer = setTimeout(()=>flush(path), wait);
  }
  function refreshStatus(){
    const busy = Object.values(state).some(x=>x.job || x.inflight);
    syncPendingCount = busy ? 1 : 0;
    if(!busy) setSyncStatus(navigator.onLine ? 'ok' : 'offline');
  }
  async function flush(path){
    const s = st(path);
    const job = s.job; if(!job) return;
    s.job = null; s.inflight = true;
    const sentObj = job.obj, jobBase = s.base;
    try{
      const written = await write(path, sentObj);
      s.lastWrite = Date.now();
      s.base = written; remember(path);
      if(s.job){
        // mientras subía, hubo más cambios aquí: agregarles lo que llegó de otras PC
        if(!jsonEq(written, sentObj)){ s.job.obj = merge3(jobBase, s.job.obj, written); idbPut(pendKey(path), s.job.obj); notify(path, s.job.obj); }
      } else {
        idbDel(pendKey(path));
        s.dirty = false;
        if(!jsonEq(written, sentObj)) notify(path, written);
      }
    }catch(e){
      console.warn(e);
      setSyncStatus(navigator.onLine ? 'error' : 'offline', e && e.message);
      if(!s.job) s.job = {obj: sentObj};
      s.lastWrite = Date.now() + 20000;
    }
    s.inflight = false;
    schedule(path);
    refreshStatus();
  }

  async function poll(){
    for(const path of Object.keys(state)){
      const s = state[path];
      if(!s.listeners.length || s.dirty || s.inflight || s.job) continue;
      try{
        const prevSha = s.sha;
        const r = await read(path, true);
        if(!r.changed || (r.sha && r.sha === prevSha)) continue;
        if(s.dirty || s.job || s.inflight) continue;
        s.sha = r.sha; s.base = r.value; remember(path);
        if(r.value !== undefined) notify(path, r.value);
      }catch(e){ console.warn('GitHub revisar:', e && e.message); }
    }
    refreshStatus();
    setTimeout(poll, document.hidden ? POLL_MS*4 : POLL_MS);
  }
  setTimeout(poll, POLL_MS);

  return {
    doc(path){
      return {
        async get(){
          const s = st(path);
          const saved = await idbGet(baseKey(path));
          const pending = await idbGet(pendKey(path));
          let r;
          try{ r = await read(path, false); }
          catch(e){ // sin internet: trabajar con lo guardado en la base interna
            if(saved){ s.sha = saved.sha; s.base = saved.base; }
            if(pending){ s.dirty = true; s.job = {obj: pending}; schedule(path); refreshStatus(); return clone(pending); }
            return clone(saved && saved.base) || {};
          }
          if(pending !== undefined){
            // cambios de esta PC que no alcanzaron a subir: combinarlos con lo de GitHub y subirlos
            const merged = merge3(saved ? saved.base : undefined, pending, r.value);
            s.sha = r.sha; s.base = r.value; remember(path);
            s.dirty = true; s.job = {obj: merged}; idbPut(pendKey(path), merged);
            setSyncStatus('saving'); schedule(path);
            return clone(merged);
          }
          s.sha = r.sha; s.base = r.value; remember(path);
          return clone(r.value) || {};
        },
        set(obj){
          const s = st(path);
          const snap = JSON.parse(JSON.stringify(obj));
          if(!s.job && !s.inflight && s.base !== undefined && jsonEq(snap, s.base)) return Promise.resolve();
          s.dirty = true;
          idbPut(pendKey(path), snap);
          setSyncStatus(navigator.onLine ? 'saving' : 'offline');
          if(!s.job) s.job = {obj:snap}; else s.job.obj = snap;
          syncPendingCount = 1;
          schedule(path);
          return Promise.resolve();
        },
        onSnapshot(cb){ st(path).listeners.push(cb); return ()=>{}; }
      };
    }
  };
}

/* ════════════════════════ SERVIDOR PROPIO (tu PC) ════════════════════════
   La página guarda TODO en el servidor de tu PC: cada artículo es un registro propio
   (crear / editar / eliminar), más cotizaciones, áreas de conteo, ventas y recepción.
   Las demás PC reciben el aviso en vivo y se actualizan solas. Si se cae el internet,
   todo queda en la base interna de esta PC y se sube solo al volver. */
const SRV_KEY = 'eurotruck_server_v1';
window.EUROTRUCK_SERVER = window.EUROTRUCK_SERVER || {url:''};
function _srvLocal(){ try{ return JSON.parse(localStorage.getItem(SRV_KEY)||'{}'); }catch(e){ return {}; } }
function srvSettings(){
  const l = _srvLocal();
  return {url: String(window.EUROTRUCK_SERVER.url || l.url || '').trim().replace(/\/+$/,''), token: l.token||'', usuario: l.usuario||''};
}
function srvSave(patch){ try{ localStorage.setItem(SRV_KEY, JSON.stringify(Object.assign(_srvLocal(), patch))); }catch(e){} }
function serverConfigured(){ const s = srvSettings(); return !!(s.url && s.token); }
let _srvConfigTried = false;
// En Vercel, /api/config entrega la dirección del servidor (variable de entorno SERVIDOR_URL).
async function loadServerConfig(){
  if(_srvConfigTried || window.EUROTRUCK_SERVER.url || location.protocol === 'file:') return;
  _srvConfigTried = true;
  try{
    const ctl = new AbortController(); const t = setTimeout(()=>ctl.abort(), 3000);
    const r = await fetch('/api/config', {cache:'no-store', signal:ctl.signal}); clearTimeout(t);
    if(r.ok){ const j = await r.json(); if(j && j.servidorUrl) window.EUROTRUCK_SERVER.url = j.servidorUrl; }
  }catch(e){}
}
async function serverLogin(u, p){
  await loadServerConfig();
  const s = srvSettings();
  if(!s.url) return {ok:false, reason:'sin-servidor'};
  try{
    const reto = (window.ETCaptcha && window.ETCaptcha.tomar) ? window.ETCaptcha.tomar('login') : null;
    const r = await fetch(s.url + '/api/login', {method:'POST', headers:{'Content-Type':'application/json','X-Cliente':'web'}, body: JSON.stringify({usuario:u, clave:p, app:'eurotruck', reto})});
    if(r.status === 428) return {ok:false, reason:'robot'};
    if(r.status === 429) return {ok:false, reason:'bloqueo'};
    if(r.status === 401 || r.status === 403) return {ok:false, reason:'clave'};
    if(!r.ok) return {ok:false, reason:'error'};
    const j = await r.json();
    srvSave({url:s.url, token:j.token, usuario:j.usuario});
    return {ok:true, rol:j.rol, nombre:j.nombre, costo:!!j.costo, venta:!!j.venta, superAdmin:!!j.superAdmin};
  }catch(e){ return {ok:false, reason:'red'}; }
}
async function serverLogout(){
  const s = srvSettings();
  if(dbApi && dbApi.stop) dbApi.stop();
  if(dbApi && dbApi.kind === 'server') dbApi = null;
  srvSave({token:''});
  if(s.url && s.token){ try{ await fetch(s.url + '/api/logout', {method:'POST', headers:{'Authorization':'Bearer '+s.token}}); }catch(e){} }
  setSyncStatus('local');
}

/* ---------- Una sola ventana por PC habla con el servidor ("líder") ----------
   Las demás ventanas reciben todo de la líder al instante. Así nunca se cuenta
   dos veces un mismo escaneo. Si se cierra la líder, otra toma su lugar sola. */
let isSyncLeader = !('locks' in navigator);
let _initDone = false;
const leaderReady = new Promise(res=>{
  if(!('locks' in navigator)) return res(true);
  let settled = false;
  navigator.locks.request('eurotruck-sync-leader', ()=>{
    isSyncLeader = true;
    if(!settled){ settled = true; res(true); }
    else if(_initDone){ initData(); } // la ventana líder se cerró: esta toma su lugar
    return new Promise(()=>{}); // mantener el candado mientras la ventana esté abierta
  });
  setTimeout(()=>{ if(!settled){ settled = true; res(false); } }, 500);
});

/* Documentos que no son artículos (se guardan enteros) */
const SRV_DOCS = {
  orders: {
    get: ()=>({list: ordersState}),
    set: d=>{ ordersState = (d && d.list) || []; try{ normalizeOrders(); }catch(e){} }
  },
  meta: {
    get: ()=>({locations, deletedRefs, countAreas, activeAreaIndex, salesLog, internalCodes, nextInternalCode, receivingKardex, scanHistory, inventoryEntriesLog,
               usdRateInfo: usdRateManual ? {rate:usdRate, date:usdRateDate, manual:true} : null}),
    set: d=>{
      if(!d) return;
      if(d.locations) locations = d.locations;
      if(d.deletedRefs) deletedRefs = d.deletedRefs;
      if(d.countAreas) countAreas = d.countAreas;
      if(d.activeAreaIndex!==undefined) activeAreaIndex = d.activeAreaIndex;
      if(d.salesLog) salesLog = d.salesLog;
      if(d.internalCodes) internalCodes = d.internalCodes;
      if(d.nextInternalCode!==undefined) nextInternalCode = d.nextInternalCode;
      if(d.receivingKardex) receivingKardex = d.receivingKardex;
      if(d.scanHistory) scanHistory = d.scanHistory;
      if(d.inventoryEntriesLog) inventoryEntriesLog = d.inventoryEntriesLog;
      if(d.usdRateInfo && d.usdRateInfo.rate){ usdRate = Number(d.usdRateInfo.rate); usdRateDate = d.usdRateInfo.date||''; usdRateManual = true; try{ saveUsdRateToStorage(); }catch(e){} }
    }
  },
  receiving: {
    get: ()=>({items: receivingSession, startedAt: receivingSessionStartedAt}),
    set: d=>{ receivingSession = (d && d.items) || []; receivingSessionStartedAt = (d && d.startedAt) || null; }
  }
};
// Un registro de inventario "vacío" (recién creado solo para mostrar) no se sube.
function isUntouchedInvRow(ref, row){
  try{
    const d = defaultInvRow(ref); d.altCodes = Array.isArray(d.altCodes) ? d.altCodes : []; mergeSeededAltCodes(ref, d);
    return JSON.stringify(row) === JSON.stringify(d);
  }catch(e){ return false; }
}

async function makeServerDbApi(cfg){
  const BASE = cfg.url + '/api/eurotruck';
  const syncKey = 'srv_sync:' + cfg.url;
  let stopped = false, es = null, pullTimer = null, flushTimer = null, periodic = null;
  let pulling = false, pullAgain = false, flushing = false, flushAgain = false;

  async function api(method, p, body){
    let r;
    try{
      r = await fetch(BASE + p, {method, cache:'no-store', headers:{'Authorization':'Bearer '+cfg.token, 'Content-Type':'application/json', 'X-Equipo':SYNC_CLIENT_ID}, body: body === undefined ? undefined : JSON.stringify(body)});
    }catch(e){ const err = new Error('Sin conexión con el servidor'); err.offline = true; throw err; }
    if(r.status === 401){ const err = new Error('La sesión del servidor venció: vuelve a iniciar sesión'); err.auth = true; throw err; }
    const j = await r.json().catch(()=>({}));
    if(!r.ok && r.status !== 409) throw new Error(j.error || ('Servidor respondió ' + r.status));
    return j;
  }
  // Verificar conexión y sesión antes de empezar
  await api('GET', '/docs?desde=999999999999');

  // Estado sincronizado: lo último que esta PC sabe que está en el servidor ("base")
  let S = await idbGet(syncKey);
  const firstSync = !S;
  if(!S) S = {seqInv:0, seqDocs:0, inv:{}, docs:{}};
  let saveSTimer = null;
  const saveS = ()=>{ clearTimeout(saveSTimer); saveSTimer = setTimeout(()=> idbPut(syncKey, S), 300); };
  const parse = s => s === undefined ? undefined : JSON.parse(s);

  function afterRemoteChange(){
    try{ rerenderAllViews(); }catch(e){}
    try{ saveLocalFallback(); }catch(e){} // copia local + avisar a las otras ventanas
  }

  /* ---------- BAJAR cambios del servidor ---------- */
  async function pull(){
    if(stopped) return;
    if(pulling){ pullAgain = true; return; }
    pulling = true;
    let changed = false;
    try{
      const inv = await api('GET', '/inventario?desde=' + S.seqInv);
      const remoteEmpty = S.seqInv === 0 && !inv.rows.length;
      for(const row of inv.rows){
        const b = S.inv[row.id];
        if(b && b.v >= row.version) continue; // es nuestro propio cambio
        const local = inventoryState[row.id];
        const localStr = local === undefined ? undefined : JSON.stringify(local);
        if(row.deleted){
          if(!b) continue;
          if(local === undefined || localStr === b.s){ delete inventoryState[row.id]; changed = true; }
          delete S.inv[row.id]; // si aquí se editó, se vuelve a crear al subir
          continue;
        }
        let next;
        if(b && localStr !== undefined && localStr !== b.s) next = merge3(parse(b.s), local, row.data);       // editado aquí y allá: combinar
        else if(!b && local !== undefined && !firstSync && !isUntouchedInvRow(row.id, local)) next = merge3(undefined, local, row.data);
        else next = row.data;                                                                                   // tomar lo del servidor
        inventoryState[row.id] = next;
        S.inv[row.id] = {v: row.version, s: JSON.stringify(row.data)};
        changed = true;
      }
      S.seqInv = inv.seq;
      // PC que se conecta por primera vez: sus artículos que el servidor no tiene se SUBEN (no se pierden)
      const docs = await api('GET', '/docs?desde=' + S.seqDocs);
      for(const row of docs.rows){
        const h = SRV_DOCS[row.id]; if(!h) continue;
        const b = S.docs[row.id];
        if(b && b.v >= row.version) continue;
        if(row.deleted) continue;
        const local = h.get(); const localStr = JSON.stringify(local);
        let next;
        if(b && localStr !== b.s) next = merge3(parse(b.s), local, row.data);
        else if(!b) next = merge3(undefined, row.data, local);   // primera vez: juntar lo de esta PC con lo del servidor
        else next = row.data;
        h.set(JSON.parse(JSON.stringify(next)));
        S.docs[row.id] = {v: row.version, s: JSON.stringify(row.data)};
        changed = true;
      }
      S.seqDocs = docs.seq;
      saveS();
      if(changed) afterRemoteChange();
      if(navigator.onLine) setSyncStatus(hasPending() ? 'saving' : 'ok');
    }catch(e){
      onError(e);
    }finally{
      pulling = false;
      if(pullAgain){ pullAgain = false; schedulePull(50); }
    }
    scheduleFlush(200); // subir lo que esté pendiente (o combinado)
  }
  function schedulePull(ms){ clearTimeout(pullTimer); pullTimer = setTimeout(pull, ms === undefined ? 150 : ms); }

  /* ---------- SUBIR cambios de esta PC ---------- */
  function invOps(){
    const ops = [];
    for(const ref of Object.keys(inventoryState)){
      const row = inventoryState[ref]; const s = JSON.stringify(row); const b = S.inv[ref];
      if(b && b.s === s) continue;
      if(!b && isUntouchedInvRow(ref, row)) continue;
      ops.push({op:'put', id:ref, data:row, version: b ? b.v : 0, _s:s});
    }
    for(const ref of Object.keys(S.inv)) if(!(ref in inventoryState)) ops.push({op:'delete', id:ref});
    return ops;
  }
  function hasPending(){
    if(invOps().length) return true;
    return Object.keys(SRV_DOCS).some(n=>{ const b = S.docs[n]; return !b || b.s !== JSON.stringify(SRV_DOCS[n].get()); });
  }
  async function flush(){
    if(stopped) return;
    if(flushing){ flushAgain = true; return; }
    flushing = true;
    let remoteMerged = false;
    try{
      for(let pass = 0; pass < 5; pass++){
        const ops = invOps();
        let conflicts = 0;
        for(let i = 0; i < ops.length; i += 300){
          const chunk = ops.slice(i, i + 300);
          const res = await api('POST', '/inventario/_lote', {ops: chunk.map(o=>({op:o.op, id:o.id, data:o.data, version:o.version}))});
          res.results.forEach((r, k)=>{
            const o = chunk[k];
            if(r.ok){
              if(o.op === 'delete') delete S.inv[o.id]; else S.inv[o.id] = {v:r.version, s:o._s};
            } else if(r.conflict){
              conflicts++;
              const cur = r.current;
              if(!cur || cur.deleted){ delete S.inv[o.id]; return; } // lo borraron allá: se vuelve a crear con lo de aquí
              const local = inventoryState[o.id];
              const b = S.inv[o.id];
              if(local !== undefined) inventoryState[o.id] = merge3(b ? parse(b.s) : undefined, local, cur.data);
              S.inv[o.id] = {v:cur.version, s:JSON.stringify(cur.data)};
              remoteMerged = true;
            }
          });
          saveS();
        }
        for(const name of Object.keys(SRV_DOCS)){
          const h = SRV_DOCS[name];
          const local = h.get(); const s = JSON.stringify(local); const b = S.docs[name];
          if(b && b.s === s) continue;
          const r = await api('PUT', '/docs/' + name, {data: local, version: b ? b.v : 0});
          if(r.ok){ S.docs[name] = {v:r.version, s}; }
          else if(r.conflict){
            conflicts++;
            const cur = r.current;
            if(cur && !cur.deleted){
              h.set(merge3(b ? parse(b.s) : undefined, JSON.parse(s), cur.data));
              S.docs[name] = {v:cur.version, s:JSON.stringify(cur.data)};
              remoteMerged = true;
            } else { delete S.docs[name]; }
          }
          saveS();
        }
        if(!conflicts) break;
      }
      if(remoteMerged) afterRemoteChange();
      setSyncStatus(hasPending() ? 'saving' : 'ok');
    }catch(e){
      onError(e);
      clearTimeout(flushTimer); flushTimer = setTimeout(flush, 5000);
    }finally{
      flushing = false;
      if(flushAgain){ flushAgain = false; scheduleFlush(100); }
    }
  }
  function scheduleFlush(ms){ clearTimeout(flushTimer); flushTimer = setTimeout(flush, ms === undefined ? 350 : ms); }

  function onError(e){
    console.warn('Servidor:', e && e.message);
    if(e && e.auth){ setSyncStatus('error', e.message); showToast(e.message); return; }
    setSyncStatus(e && e.offline ? 'offline' : 'error', e && e.message);
  }

  /* ---------- avisos en vivo ---------- */
  function connectEvents(){
    if(stopped || !('EventSource' in window)) return;
    try{ if(es) es.close(); }catch(e){}
    es = new EventSource(BASE + '/eventos?token=' + encodeURIComponent(cfg.token));
    es.onopen = ()=> schedulePull(0);
    es.onmessage = ev=>{
      let m = {}; try{ m = JSON.parse(ev.data); }catch(e){}
      if(m.hello){ schedulePull(0); return; }
      if(m.by && m.by === SYNC_CLIENT_ID) return; // cambio hecho por esta misma PC
      schedulePull(120);
    };
    es.onerror = ()=>{ if(!navigator.onLine) setSyncStatus('offline'); };
  }
  const onOnline = ()=>{ schedulePull(0); };
  const onVisible = ()=>{ if(!document.hidden) schedulePull(0); };
  window.addEventListener('online', onOnline);
  document.addEventListener('visibilitychange', onVisible);

  const api_ = {
    kind: 'server',
    url: cfg.url, token: cfg.token,
    async start(){
      await pull();
      await flush();
      connectEvents();
      periodic = setInterval(()=>{ schedulePull(0); }, 30000); // revisión de respaldo cada 30 s
    },
    stop(){
      stopped = true;
      try{ if(es) es.close(); }catch(e){}
      clearInterval(periodic); clearTimeout(pullTimer); clearTimeout(flushTimer);
      window.removeEventListener('online', onOnline);
      document.removeEventListener('visibilitychange', onVisible);
    },
    flushNow(){ scheduleFlush(0); },
    doc(path){
      const name = path.split('/').pop();
      return {
        async get(){ return name === 'inventory' ? inventoryState : (SRV_DOCS[name] ? SRV_DOCS[name].get() : {}); },
        set(){ setSyncStatus(navigator.onLine ? 'saving' : 'offline'); scheduleFlush(); return Promise.resolve(); },
        onSnapshot(){ return ()=>{}; }
      };
    }
  };
  return api_;
}

/* ---------- Artículos nuevos: su ficha viaja dentro del registro de inventario ---------- */
function restoreCustomProducts(){
  for(const ref of Object.keys(inventoryState)){
    const row = inventoryState[ref];
    if(row && row.edit && PRODUCTS_BY_REF[ref]) applyArticleEdit(PRODUCTS_BY_REF[ref], row.edit);
    if(row && Array.isArray(row.oeRefs) && PRODUCTS_BY_REF[ref]){ const pp = PRODUCTS_BY_REF[ref]; if(!pp._baseRefs) pp._baseRefs = (pp.refsList||[]).filter(r=>!row.oeRefs.includes(r)); pp.refsList = Array.from(new Set(pp._baseRefs.concat(row.oeRefs))); }
    if(!row || !row.product) continue;
    const pr = row.product;
    let p = PRODUCTS_BY_REF[ref];
    if(!p){
      p = {ref, sku:ref, title:pr.title||ref, brand:pr.brand||'DT Spare Parts', cat:pr.cat||'Repuesto', pack:'1 PCS', gtin:pr.gtin||'', url:'', refsList:Array.from(new Set((pr.refs||[]).concat(row.oeRefs||[]))), _baseRefs:[], marca:MARCA_FIJA, img:pr.img||'', applications:pr.applications||'', sourceUrl:PORTAL_URL, _custom:true};
      products.push(p); PRODUCTS_BY_REF[ref] = p;
    } else if(p._custom){
      Object.assign(p, {title:pr.title||ref, brand:pr.brand||p.brand, cat:pr.cat||p.cat, gtin:pr.gtin||'', img:pr.img||'', applications:pr.applications||''});
    }
    if(row.edit) applyArticleEdit(p, row.edit);
  }
  // artículos propios que se eliminaron en otra PC
  for(let i = products.length - 1; i >= 0; i--){
    const p = products[i];
    if(p._custom && !(inventoryState[p.ref] && inventoryState[p.ref].product)){ products.splice(i, 1); delete PRODUCTS_BY_REF[p.ref]; }
  }
}

/* ===================== PDF "Lista de acomodo" (mismo en la PC y en el celular) =====================
   Genera un PDF A4 sin librerías: artículos agrupados y ordenados por ubicación, con casilla ☐ para
   marcar a mano cuando se coloca cada uno. Se usa al Cerrar Entrada de Recepción y de Inventario. */
function etLocLabel(l){ if(!l) return 'SIN UBICACIÓN'; const m = /^([^/]+)\/([^/]+)$/.exec(l); return m ? `Tramo ${m[1]} · Estante ${m[2]}` : String(l); }
function etBuildAcomodoPdf(o){
  // o = {titulo, subtitulo, usuario, fecha (Date), items:[{ref,title,qty,location}]}
  const W = 595.28, H = 841.89, M = 36;
  const enc = s => { s = String(s == null ? '' : s).replace(/[·•]/g, '\xB7').replace(/[–—]/g, '-').replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/…/g, '\x85');
    let out = ''; for(const ch of s){ const c = ch.charCodeAt(0); out += c < 256 ? ch : '?'; }
    return out.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)'); };
  const width = (s, size) => String(s).length * size * 0.5;
  const fit = (s, size, maxW) => { s = String(s || ''); if(width(s, size) <= maxW) return s; let n = Math.max(1, Math.floor(maxW / (size * 0.5)) - 1); return s.slice(0, n) + '…'; };
  const rows = (o.items || []).filter(r => Number(r.qty) > 0).map(r => ({...r, loc: etLocLabel(r.location)}))
    .sort((a, b) => (a.location ? 0 : 1) - (b.location ? 0 : 1) || a.loc.localeCompare(b.loc, 'es', {numeric:true}) || String(a.title).localeCompare(String(b.title), 'es'));
  const total = rows.reduce((s, r) => s + (Number(r.qty) || 0), 0);
  const fecha = o.fecha || new Date();
  const fechaTxt = fecha.toLocaleString('es-DO', {day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit'});
  const pages = []; let cur = []; let y = 0;
  const cmd = (s) => cur.push(s);
  const text = (x, yy, s, size, bold, gray) => cmd(`BT /${bold ? 'F2' : 'F1'} ${size} Tf ${gray ? '0.35 g' : '0 g'} ${x.toFixed(1)} ${yy.toFixed(1)} Td (${enc(s)}) Tj ET`);
  const line = (x1, y1, x2, y2, w) => cmd(`${w || 0.5} w 0.6 G ${x1} ${y1} m ${x2} ${y2} l S`);
  const rect = (x, yy, w, h, fill) => cmd(fill ? `${fill} rg ${x} ${yy} ${w} ${h} re f 0 g` : `0.8 w 0 G ${x} ${yy} ${w} ${h} re S`);
  const C = {chk: M, ref: M + 22, desc: M + 112, qty: W - M - 40};
  const header = (first) => {
    if(first){
      text(M, H - M - 6, o.titulo || 'Lista de acomodo', 17, true);
      text(M, H - M - 24, (o.subtitulo ? o.subtitulo + '  ·  ' : '') + fechaTxt + (o.usuario ? '  ·  ' + o.usuario : ''), 9.5, false, true);
      text(M, H - M - 38, `${rows.length} artículo(s) · ${total} unidad(es) · ordenado por ubicación para llevar cada artículo a su lugar`, 9.5, false, true);
      y = H - M - 58;
    } else { text(M, H - M - 6, (o.titulo || 'Lista de acomodo') + ' (continuación)', 11, true); y = H - M - 22; }
    rect(M, y - 4, W - 2 * M, 16, '0.9 0.93 0.97');
    text(C.chk + 2, y, 'OK', 8.5, true); text(C.ref, y, 'Referencia', 8.5, true); text(C.desc, y, 'Descripción', 8.5, true); text(C.qty, y, 'Cant.', 8.5, true);
    y -= 18;
  };
  const newPage = () => { if(cur.length) pages.push(cur); cur = []; header(pages.length === 0); };
  newPage();
  let lastLoc = null;
  for(const r of rows){
    if(y < M + 40) newPage(), lastLoc = null;
    if(r.loc !== lastLoc){
      const sub = rows.filter(x => x.loc === r.loc).reduce((s, x) => s + (Number(x.qty) || 0), 0);
      y -= 4; rect(M, y - 4, W - 2 * M, 16, r.location ? '0.86 0.95 0.89' : '0.98 0.88 0.88');
      text(M + 6, y, (r.location ? 'UBICACIÓN: ' : '') + r.loc, 10, true); text(C.qty - 30, y, `${sub} u.`, 9, true);
      y -= 18; lastLoc = r.loc;
    }
    rect(C.chk + 2, y - 2, 10, 10);
    text(C.ref, y, fit(r.ref, 9, C.desc - C.ref - 6), 9, true);
    text(C.desc, y, fit(r.title, 9, C.qty - C.desc - 10), 9);
    text(C.qty + 6, y, String(r.qty), 10, true);
    line(M, y - 5, W - M, y - 5, 0.3);
    y -= 16;
  }
  if(y < M + 60) newPage();
  y -= 10; text(M, y, `TOTAL: ${total} unidad(es) en ${rows.length} artículo(s)`, 11, true);
  y -= 26; text(M, y, 'Acomodado por: ______________________________     Revisado por: ______________________________', 9, false, true);
  pages.push(cur);
  // armar el PDF
  const objs = []; const add = s => { objs.push(s); return objs.length; };
  const f1 = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
  const f2 = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');
  const pagesId = objs.length + 1; objs.push(null);
  const kids = [];
  pages.forEach((p, i) => {
    p.push(`BT /F1 8 Tf 0.45 g ${W - M - 60} ${M - 18} Td (${enc('Página ' + (i + 1) + ' de ' + pages.length)}) Tj ET`);
    const content = p.join('\n');
    const cId = add(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`);
    kids.push(add(`<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${W} ${H}] /Resources << /Font << /F1 ${f1} 0 R /F2 ${f2} 0 R >> >> /Contents ${cId} 0 R >>`));
  });
  objs[pagesId - 1] = `<< /Type /Pages /Kids [${kids.map(k => k + ' 0 R').join(' ')}] /Count ${kids.length} >>`;
  const catalog = add(`<< /Type /Catalog /Pages ${pagesId} 0 R >>`);
  let pdf = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n'; const offs = [];
  objs.forEach((o2, i) => { offs.push(pdf.length); pdf += `${i + 1} 0 obj\n${o2}\nendobj\n`; });
  const xref = pdf.length;
  pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n` + offs.map(n => String(n).padStart(10, '0') + ' 00000 n \n').join('');
  pdf += `trailer\n<< /Size ${objs.length + 1} /Root ${catalog} 0 R >>\nstartxref\n${xref}\n%%EOF`;
  const bytes = new Uint8Array(pdf.length); for(let i = 0; i < pdf.length; i++) bytes[i] = pdf.charCodeAt(i) & 255;
  return new Blob([bytes], {type:'application/pdf'});
}
function etStamp(d){ d = d || new Date(); const z = n=>String(n).padStart(2,'0'); return `${d.getFullYear()}-${z(d.getMonth()+1)}-${z(d.getDate())}_${z(d.getHours())}${z(d.getMinutes())}`; }
function etDownloadBlob(blob, name){
  const url = URL.createObjectURL(blob); const a = document.createElement('a');
  a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=> URL.revokeObjectURL(url), 60000);
}

/* ===================== Usuarios (solo Alberto / Empresa) ===================== */
const SUPER_ADMINS = ['alberto','albertosamboy89@gmail.com'];
function isSuperAdmin(){ return !!(currentUser && (currentUser.superAdmin || SUPER_ADMINS.includes(currentUser.username))); }
async function usersApi(method, path, body){
  const s = srvSettings();
  if(!s.url || !s.token) throw new Error('Inicia sesión conectado al servidor para gestionar usuarios.');
  const r = await fetch(s.url + '/api/usuarios' + (path||''), {method, headers:{'Authorization':'Bearer '+s.token,'Content-Type':'application/json'}, body: body ? JSON.stringify(body) : undefined});
  const j = await r.json().catch(()=>({}));
  if(!r.ok) throw new Error(j.error || ('Error ' + r.status));
  return j;
}
function openUsersPanel(){
  if(!isSuperAdmin()){ showToast('Solo el usuario principal puede gestionar usuarios.'); return; }
  let ov = document.getElementById('usersOverlay');
  if(!ov){
    ov = document.createElement('div'); ov.id = 'usersOverlay';
    ov.style.cssText = 'position:fixed;inset:0;z-index:9000;background:rgba(5,10,20,.72);display:flex;align-items:flex-start;justify-content:center;overflow:auto;padding:30px 12px';
    ov.innerHTML = `<div style="background:#111a2e;color:#e8edf7;border:1px solid #26324f;border-radius:16px;max-width:760px;width:100%;padding:20px 22px;font:14px system-ui,sans-serif">
      <div style="display:flex;align-items:center;gap:10px"><h3 style="margin:0;font-size:20px">👥 Usuarios</h3><span style="color:#8b97b3;font-size:12px">Solo tú (usuario principal) ves esta pantalla</span><button onclick="closeUsersPanel()" style="margin-left:auto;background:#1b2540;color:#fff;border:0;border-radius:8px;padding:8px 12px;cursor:pointer">✕ Cerrar</button></div>
      <form id="userForm" onsubmit="saveUserForm(event)" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin:16px 0;background:#0d1424;border:1px solid #26324f;border-radius:12px;padding:14px">
        <label style="display:flex;flex-direction:column;gap:4px;font-size:12px;color:#8b97b3">Usuario<input id="ufUser" required autocomplete="off" style="padding:9px;border-radius:8px;border:1px solid #26324f;background:#0b1120;color:#fff"></label>
        <label style="display:flex;flex-direction:column;gap:4px;font-size:12px;color:#8b97b3">Nombre<input id="ufName" autocomplete="off" style="padding:9px;border-radius:8px;border:1px solid #26324f;background:#0b1120;color:#fff"></label>
        <label style="display:flex;flex-direction:column;gap:4px;font-size:12px;color:#8b97b3">Clave <span id="ufPassHint" style="font-size:11px"></span><input id="ufPass" type="text" autocomplete="new-password" style="padding:9px;border-radius:8px;border:1px solid #26324f;background:#0b1120;color:#fff"></label>
        <label style="display:flex;flex-direction:column;gap:4px;font-size:12px;color:#8b97b3">Permisos<select id="ufRole" style="padding:9px;border-radius:8px;border:1px solid #26324f;background:#0b1120;color:#fff"><option value="admin">Administrador (inventario, recepción, cotizaciones)</option><option value="staff">Staff (solo cotizaciones y consulta)</option></select></label>
        <label style="display:flex;align-items:center;gap:8px;font-size:13px"><input id="ufCost" type="checkbox"> Puede ver y poner <b>costos</b></label>
        <label style="display:flex;align-items:center;gap:8px;font-size:13px"><input id="ufSale" type="checkbox"> Puede usar la <b>venta rápida</b></label>
        <div style="display:flex;gap:8px;align-items:end"><button type="submit" style="flex:1;background:#3b82f6;color:#fff;border:0;border-radius:8px;padding:10px;font-weight:700;cursor:pointer">Guardar usuario</button><button type="button" onclick="resetUserForm()" style="background:#1b2540;color:#fff;border:0;border-radius:8px;padding:10px;cursor:pointer">Nuevo</button></div>
      </form>
      <div id="usersList">Cargando…</div>
      <p style="color:#8b97b3;font-size:12px;margin:12px 0 0">Los usuarios sirven en la página, en todas las PC y en la app del celular. Al cambiar la clave de alguien, se le cierra la sesión en los otros equipos.</p>
    </div>`;
    document.body.appendChild(ov);
  }
  ov.style.display = 'flex'; resetUserForm(); loadUsersList();
}
function closeUsersPanel(){ const ov = document.getElementById('usersOverlay'); if(ov) ov.style.display = 'none'; }
function resetUserForm(){ const f = document.getElementById('userForm'); if(!f) return; f.reset(); document.getElementById('ufUser').readOnly = false; document.getElementById('ufPassHint').textContent = '(mínimo 4)'; document.getElementById('ufRole').value = 'admin'; ['ufCost','ufSale','ufRole'].forEach(id=>document.getElementById(id).disabled = false); }
let _usersCache = [];
async function loadUsersList(){
  const box = document.getElementById('usersList');
  try{
    const j = await usersApi('GET'); _usersCache = j.usuarios || [];
    box.innerHTML = `<table style="width:100%;border-collapse:collapse;font-size:13.5px"><tr style="color:#8b97b3;text-align:left"><th style="padding:6px">Usuario</th><th>Nombre</th><th>Permisos</th><th>Costos</th><th>Venta rápida</th><th></th></tr>` +
      _usersCache.map(u=>`<tr style="border-top:1px solid #26324f"><td style="padding:8px 6px"><b>${u.usuario}</b>${u.principal?' <span style="color:#fbbf24;font-size:11px">★ principal</span>':''}</td><td>${u.nombre||''}</td><td>${u.rol==='admin'?'Administrador':'Staff'}</td><td>${u.costo?'✔':'—'}</td><td>${u.venta?'✔':'—'}</td>
        <td style="text-align:right;white-space:nowrap"><button onclick="editUser('${u.usuario}')" style="background:#1b2540;color:#fff;border:0;border-radius:7px;padding:6px 10px;cursor:pointer">✏️ Editar</button> ${u.principal?'':`<button onclick="deleteUser('${u.usuario}')" style="background:#3b1d24;color:#fecaca;border:0;border-radius:7px;padding:6px 10px;cursor:pointer">🗑</button>`}</td></tr>`).join('') + `</table>`;
  }catch(e){ box.innerHTML = `<div style="color:#fca5a5">${e.message}</div>`; }
}
function editUser(name){
  const u = _usersCache.find(x=>x.usuario===name); if(!u) return;
  document.getElementById('ufUser').value = u.usuario; document.getElementById('ufUser').readOnly = true;
  document.getElementById('ufName').value = u.nombre || ''; document.getElementById('ufPass').value = '';
  document.getElementById('ufPassHint').textContent = '(vacía = no cambiar)';
  document.getElementById('ufRole').value = u.rol; document.getElementById('ufCost').checked = !!u.costo; document.getElementById('ufSale').checked = !!u.venta; ['ufCost','ufSale','ufRole'].forEach(id=>document.getElementById(id).disabled = !!u.principal);
  document.getElementById('ufUser').scrollIntoView({block:'center'});
}
async function saveUserForm(e){
  e.preventDefault();
  const body = {usuario: document.getElementById('ufUser').value.trim(), nombre: document.getElementById('ufName').value.trim(), clave: document.getElementById('ufPass').value, rol: document.getElementById('ufRole').value, costo: document.getElementById('ufCost').checked, venta: document.getElementById('ufSale').checked};
  if(!body.clave) delete body.clave;
  try{ const r = await usersApi('POST', '', body); playAddSound(); showToast(r.creado ? `Usuario "${body.usuario}" creado.` : `Usuario "${body.usuario}" actualizado.`); resetUserForm(); loadUsersList(); }
  catch(err){ playErrorSound(); showToast(err.message); }
  return false;
}
async function deleteUser(name){
  if(!confirm(`¿Eliminar el usuario "${name}"? Ya no podrá entrar en ningún equipo.`)) return;
  try{ await usersApi('DELETE', '/' + encodeURIComponent(name)); showToast(`Usuario "${name}" eliminado.`); loadUsersList(); }
  catch(err){ showToast(err.message); }
}

async function initData(){
  loadLocalFallback();
  try{ assignAppState(await idbGet('state')); }catch(e){}
  normalizeOrders();
  await loadServerConfig();
  // Solo una ventana por PC se conecta; las demás reciben todo de ella.
  if(!((await leaderReady) || isSyncLeader)){ if(dbApi && dbApi.stop) dbApi.stop(); dbApi = null; setSyncStatus('follower'); renderProducts(); _initDone = true; return; }
  if(serverConfigured()){
    const sc = srvSettings();
    if(dbApi && dbApi.kind === 'server' && dbApi.token === sc.token && dbApi.url === sc.url){ renderProducts(); _initDone = true; return; }
    if(dbApi && dbApi.stop) dbApi.stop();
    dbApi = null;
    try{
      const api = await makeServerDbApi(sc);
      dbApi = api;
      await api.start();
    }catch(err){
      if(dbApi && dbApi.stop) dbApi.stop();
      dbApi = null;
      setSyncStatus(err && err.offline ? 'offline' : 'error', err && err.message);
      if(err && err.auth){ srvSave({token:''}); }
      else setTimeout(()=>{ if(!dbApi && serverConfigured()) initData(); }, 15000); // reintentar cuando vuelva la conexión
    }
    renderProducts(); _initDone = true; return;
  }
  try{
    if(githubConfigured()){
      try{
        dbApi = await makeGithubDbApi(githubSyncSettings());
        setSyncStatus(navigator.onLine ? 'ok' : 'offline');
      }catch(err){
        dbApi = null;
        setSyncStatus('error', err && err.message);
        showToast('Guardado en GitHub: ' + (err && err.message ? err.message : 'error'));
      }
    } else if(firebaseConfigured()){
      dbApi = makeFirebaseDbApi(window.FIREBASE_CONFIG);
      setSyncStatus(navigator.onLine ? 'ok' : 'offline');
    } else if(window.claude && window.claude.use){
      dbApi = await window.claude.use('db');
    }
  }catch(e){ dbApi = null; }
  if(!dbApi && !githubConfigured()) setSyncStatus('local');
  _initDone = true;
  if(dbApi){
    try{
      const invDoc = await dbApi.doc('eurotruck/inventory').get();
      if(invDoc && Object.keys(invDoc).length) inventoryState = invDoc;
      const ordDoc = await dbApi.doc('eurotruck/orders').get();
      if(ordDoc && ordDoc.list) ordersState = ordDoc.list;
      const metaDoc = await dbApi.doc('eurotruck/meta').get();
      if(metaDoc){
        if(metaDoc.locations) locations = metaDoc.locations;
        if(metaDoc.deletedRefs) deletedRefs = metaDoc.deletedRefs;
        if(metaDoc.countAreas) countAreas = metaDoc.countAreas;
        if(metaDoc.activeAreaIndex!==undefined) activeAreaIndex = metaDoc.activeAreaIndex;
        if(metaDoc.salesLog) salesLog = metaDoc.salesLog;
        if(metaDoc.internalCodes) internalCodes = metaDoc.internalCodes;
        if(metaDoc.nextInternalCode!==undefined) nextInternalCode = metaDoc.nextInternalCode;
        if(metaDoc.scanHistory) scanHistory = metaDoc.scanHistory;
        if(metaDoc.usdRateInfo && metaDoc.usdRateInfo.rate){ usdRate = Number(metaDoc.usdRateInfo.rate); usdRateDate = metaDoc.usdRateInfo.date||''; usdRateManual = true; }
        if(metaDoc.receivingKardex) receivingKardex = metaDoc.receivingKardex;
      }
      const recvDoc = await dbApi.doc('eurotruck/receiving').get();
      if(recvDoc && Array.isArray(recvDoc.items)){
        if(recvDoc.items.length || !receivingSession.length){ receivingSession = recvDoc.items; receivingSessionStartedAt = recvDoc.startedAt||null; }
        else { saveReceivingSessionDraft(); } // había un borrador local que nunca subió: subirlo
      }
      normalizeOrders();
      dbApi.doc('eurotruck/inventory').onSnapshot(data=>{
        if(data){ inventoryState = data; renderProducts(); if(document.getElementById('inventoryOverlay').classList.contains('is-open')) renderInventoryTable(); }
      });
      dbApi.doc('eurotruck/receiving').onSnapshot(data=>{
        if(data && Array.isArray(data.items)){
          receivingSession = data.items; receivingSessionStartedAt = data.startedAt||null;
          try{ localStorage.setItem(LS_KEY_RECV_SESSION, JSON.stringify({items:receivingSession, startedAt:receivingSessionStartedAt})); }catch(e){}
          const ro = document.getElementById('receivingOverlay');
          if(ro && ro.classList.contains('is-open')) renderReceivingSession();
        }
      });
      dbApi.doc('eurotruck/orders').onSnapshot(data=>{
        if(data && data.list){ ordersState = data.list; normalizeOrders(); renderOrdersGrid(); }
      });
      dbApi.doc('eurotruck/meta').onSnapshot(data=>{
        if(data){
          if(data.locations) locations = data.locations;
          if(data.deletedRefs) deletedRefs = data.deletedRefs;
          if(data.countAreas) countAreas = data.countAreas;
          if(data.activeAreaIndex!==undefined) activeAreaIndex = data.activeAreaIndex;
          if(data.salesLog) salesLog = data.salesLog;
          if(data.internalCodes) internalCodes = data.internalCodes;
          if(data.nextInternalCode!==undefined) nextInternalCode = data.nextInternalCode;
          if(data.scanHistory){ scanHistory = data.scanHistory; try{ if(document.getElementById('inventoryOverlay').classList.contains('is-open')) renderScanHistoryTable(); }catch(e){} }
          if(data.usdRateInfo && data.usdRateInfo.rate){ usdRate = Number(data.usdRateInfo.rate); usdRateDate = data.usdRateInfo.date||''; usdRateManual = true; try{ saveUsdRateToStorage(); renderUsdRateBadge(); }catch(e){} }
          if(data.receivingKardex){ receivingKardex = data.receivingKardex; if(document.getElementById('receivingOverlay') && document.getElementById('receivingOverlay').classList.contains('is-open')) renderReceivingKardex(); }
          renderProducts();
          if(document.getElementById('inventoryOverlay').classList.contains('is-open')){ renderGondolaChips(); renderInventoryTable(); renderCountedItemsList(); renderInventoryStats(); renderTopSellers(); }
        }
      });
    }catch(e){ /* fall back silently to local state already loaded */ }
  }
  renderProducts();
}

function stockPillHtml(stock){
  stock = Number(stock)||0;
  if(stock<=0) return `<span class="stock-pill out-stock">${tr('Sin stock','Out of stock')}</span>`;
  if(stock<=3) return `<span class="stock-pill low-stock">${stock} ${tr('disp.','avail.')}</span>`;
  return `<span class="stock-pill in-stock">${stock} ${tr('disp.','avail.')}</span>`;
}

// Orden de búsqueda: primero los SKU que coinciden (exacto → empieza → contiene; los más cortos primero), después el resto
const _normSkuCache = new Map();
const normSku = x => { const k = String(x||''); let v = _normSkuCache.get(k); if(v === undefined){ v = k.toLowerCase().replace(/[\s.\-\/]/g,''); if(_normSkuCache.size < 300000) _normSkuCache.set(k, v); } return v; };
function searchRank(p, q){
  const r = String(p.ref||'').toLowerCase(), nr = normSku(r), nq = normSku(q);
  if(r === q || (nq && nr === nq)) return 0;
  if(r.startsWith(q) || (nq && nr.startsWith(nq))) return 1;
  if(r.includes(q) || (nq.length >= 2 && nr.includes(nq))) return 2;
  const inv = inventoryState[p.ref] || {};
  if((p.gtin||'').toLowerCase() === q || (inv.gtin||'').toLowerCase() === q || (internalCodes[p.ref]||'').toLowerCase() === q || (inv.altCodes||[]).some(c=>String(c).toLowerCase() === q)) return 3;
  if(codeListHit(p.refsList, q, true)) return 4;
  if(String(p.title||'').toLowerCase().startsWith(q)) return 5;
  return 6;
}
const _skuCollator = new Intl.Collator('es', {numeric:true});
function sortBySearch(list, q){
  if(!q) return list;
  const rows = list.map(p=>({p, r: searchRank(p, q), l: normSku(p.ref).length, s: String(p.ref)}));
  rows.sort((a, b)=> a.r - b.r || (a.r <= 2 ? a.l - b.l : 0) || _skuCollator.compare(a.s, b.s));
  return rows.map(x=>x.p);
}
function getFilteredProducts(){
  const q = searchTerm.toLowerCase();
  const _nq = normSku(q);
  const res = visibleProducts().filter(p=>{
    const matchesBrand = activeBrand==='Todas' || p.brand===activeBrand;
    if(!matchesBrand) return false;
    if(!q) return true;
    if(_nq.length >= 2 && normSku(p.ref).includes(_nq)) return true;
    const inv = peekInv(p.ref);
    if(p.title.toLowerCase().includes(q) || p.ref.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q) || (p.gtin||'').toLowerCase().includes(q) || (inv.gtin||'').toLowerCase().includes(q)) return true;
    if(inv.altCodes && inv.altCodes.some(c=>String(c).toLowerCase().includes(q))) return true;
    if(internalCodes[p.ref] && internalCodes[p.ref].toLowerCase().includes(q)) return true;
    if(codeListHit(p.refsList, q, false)) return true;
    if(inv.altCodes && normCode(q).length >= 3 && inv.altCodes.some(c=>normCode(c).includes(normCode(q)))) return true;
    return false;
  });
  return sortBySearch(res, q);
}


function productCardHtml(p){
  const inv = getInv(p.ref);
  const gtinAll = [...new Set([p.gtin, inv.gtin, ...(Array.isArray(inv.altCodes)?inv.altCodes:[])].filter(Boolean))];
  const refsLine = p.refsList.length ? `<div><b>${tr('Refs. cruzadas','Cross refs.')}</b><span class="product-refs-list">${p.refsList.slice(0,3).join(', ')}${p.refsList.length>3?'…':''}</span></div>` : '';
  // El código de barras visible es el código Zebra que la propia web le asigna a cada
  // artículo (Code 39) — no el GTIN del fabricante — así se puede imprimir y escanear con
  // cualquier lector físico usando siempre el mismo código interno del negocio.
  const zebraCode = internalCodes[p.ref] || getInternalCode(p.ref);
  const zebraBarcodeSvg = code39SvgHtml(zebraCode);
  const gtinLine = `<div><b>${tr('Código de barras','Barcode')}</b><span>${zebraBarcodeSvg ? `<div class="product-barcode-wrap">${zebraBarcodeSvg}<small>Zebra ${zebraCode}</small></div>` : ''}${gtinAll.map(g=>`<div>${g}</div>`).join('')}</span></div>`;
  const locLine = inv.location ? allLocationsLabel(inv) : tr('Sin asignar','Unassigned');
  return `
  <article class="product-card" data-ref="${p.ref}">
    <div class="product-visual" onclick="event.stopPropagation();openZoom('${p.ref}')"><img src="${p.img}" alt="${p.title} — ${p.ref}" loading="lazy" onerror="this.style.opacity=.25"></div>
    <div class="product-info">
      <div class="product-marca-row"><span class="marca-badge">${p.marca}</span><b style="color:#92a5c4;font-size:.62rem;">${p.cat}</b></div>
      <span class="product-sku"><small>SKU</small>${p.sku}</span>
      <h3 style="margin:2px 0 6px;">${p.title}</h3>
      <div class="product-idlines">
        ${gtinLine}
        ${refsLine}
      </div>
      <div class="product-facts">
        <span><small>${tr('Adecuado para','Fits')}</small>${p.brand}</span>
        <span><small>${tr('Empaque','Packaging')}</small>${p.pack}</span>
      </div>
      <div class="stock-row">
        ${stockPillHtml(inv.stock)}
        <span class="stock-location">📍 ${locLine}</span>
      </div>
      <div class="product-footer-row">
        <button class="btn-cart" onclick="event.stopPropagation();addToCart('${p.ref}')">+ ${tr('Carrito','Cart')}</button>
        <a class="btn-original" href="${p.sourceUrl}" target="_blank" rel="noopener" onclick="event.stopPropagation()">${tr('Ver original ↗','View original ↗')}</a>
      </div>
    </div>
  </article>`;
}

function renderProducts(){
  try{ restoreCustomProducts(); }catch(e){}
  const grid = document.getElementById('productGrid');
  const filtered = getFilteredProducts();
  document.getElementById('catalogCount').textContent = currentLang==='en' ? (filtered.length + ' item' + (filtered.length===1?'':'s')) : (filtered.length + ' artículo' + (filtered.length===1?'':'s'));
  document.getElementById('emptyCatalog').style.display = filtered.length ? 'none' : 'block';
  const shown = filtered.slice(0, visibleCount);
  // Asigna de una sola vez (una sola llamada a saveMeta) el código Zebra a los artículos que
  // se están por mostrar y todavía no tenían uno — así el código de barras siempre se puede dibujar.
  ensureInternalCodes(shown.map(p=>p.ref));
  grid.innerHTML = shown.map(productCardHtml).join('');
  const loadMoreWrap = document.getElementById('catalogLoadMore');
  loadMoreWrap.style.display = filtered.length > shown.length ? 'flex' : 'none';
}
function loadMoreProducts(){
  visibleCount += PAGE_SIZE;
  renderProducts();
}
document.getElementById('brandFilters').addEventListener('click', e=>{
  const chip = e.target.closest('.filter-chip');
  if(!chip) return;
  activeBrand = chip.dataset.filter;
  visibleCount = PAGE_SIZE;
  document.querySelectorAll('#brandFilters .filter-chip').forEach(c=>c.classList.toggle('is-active', c===chip));
  renderProducts();
});
let _catSearchTimer = null;
document.getElementById('catalogSearch').addEventListener('input', e=>{
  searchTerm = e.target.value;
  visibleCount = PAGE_SIZE;
  clearTimeout(_catSearchTimer);
  _catSearchTimer = setTimeout(renderProducts, 150);
});
document.getElementById('productGrid').addEventListener('click', e=>{
  const card = e.target.closest('.product-card');
  if(!card) return;
  openProductModal(card.dataset.ref);
});
document.getElementById('quickSaleScanInput') && document.getElementById('quickSaleScanInput').addEventListener('keydown', e=>{
  if(e.key==='Enter'){ e.preventDefault(); quickSaleFromBar(); }
});

/* ---------- Product detail modal (click-to-expand) ---------- */
function openProductModal(ref){
  const p = PRODUCTS_BY_REF[ref];
  if(!p) return;
  const inv = getInv(p.ref);
  const gtinAllModal = [...new Set([p.gtin, inv.gtin, ...(Array.isArray(inv.altCodes)?inv.altCodes:[])].filter(Boolean))];
  const gtinVal = gtinAllModal.length ? gtinAllModal.map(g=>`<div>${g}</div>`).join('') : '';
  const refsHtml = (p.refsList||[]).length
    ? `<div class="pd-refs"><h4>Referencias cruzadas (OE)</h4><ul>${p.refsList.map(r=>`<li>${r}</li>`).join('')}</ul></div>`
    : '';
  const descLine = p.desc ? `<p class="pd-desc">${p.desc}</p>` : '';
  const appsHtml = p.applications
    ? `<div class="pd-refs"><h4>Aplicación / Compatibilidad</h4><p class="pd-apps">${p.applications.split(' | ').join('<br>')}</p></div>`
    : '';
  const specsHtml = p.specs
    ? `<div class="pd-refs"><h4>Datos técnicos</h4><p class="pd-apps">${p.specs.split(' | ').join('<br>')}</p></div>`
    : '';
  const replacesHtml = p.replaces
    ? `<div><small>Reemplaza a</small><span>${p.replaces}</span></div>`
    : '';
  const oeHtml = p.oe
    ? `<div><small>Referencia OE principal</small><span>${p.oe}</span></div>`
    : '';
  const content = document.getElementById('productDetailContent');
  content.innerHTML = `
    <button class="modal-close" onclick="closeProductModal()" aria-label="Cerrar">✕</button>
    <div class="pd-top">
      <div class="pd-visual" onclick="openZoom('${p.ref}')"><img src="${p.img}" alt="${p.title} — ${p.ref}" onerror="this.style.opacity=.25"></div>
      <div>
        <div class="product-marca-row"><span class="marca-badge">${p.marca}</span><b style="color:#92a5c4;font-size:.62rem;">${p.cat}</b></div>
        <h3 class="pd-title">${p.title}</h3>
        ${descLine}
        ${stockPillHtml(inv.stock)}
      </div>
    </div>
    <div class="pd-facts">
      <div><small>SKU / Referencia DT</small><span>${p.sku}</span></div>
      <div><small>GTIN (código de barras)</small><span>${gtinVal || 'Pendiente de asignar'}</span></div>
      <div><small>Marca del vehículo</small><span>${p.brand}</span></div>
      <div><small>Categoría</small><span>${p.cat}</span></div>
      <div><small>Empaque</small><span>${p.pack}</span></div>
      <div><small>Ubicación en almacén</small><span>${inv.location ? allLocationsLabel(inv) : 'Sin asignar'}</span></div>
      ${oeHtml}
      ${replacesHtml}
    </div>
    ${appsHtml}
    ${specsHtml}
    ${refsHtml}
    <div class="pd-actions">
      <button class="btn-cart" onclick="addToCart('${p.ref}')">+ Agregar al carrito</button>
      <a class="btn-original" href="${p.sourceUrl}" target="_blank" rel="noopener">Ver ficha original ↗</a>
    </div>`;
  document.getElementById('productOverlay').classList.add('is-open');
}
function closeProductModal(){
  document.getElementById('productOverlay').classList.remove('is-open');
}

/* ---------- Zoom lightbox ---------- */
let zoomLevel = 1;
function openZoom(ref){
  const p = PRODUCTS_BY_REF[ref];
  if(!p) return;
  const img = document.getElementById('zoomImage');
  img.src = p.img;
  img.alt = p.title + ' — ' + p.ref;
  img.className = '';
  zoomLevel = 1;
  document.getElementById('zoomOverlay').classList.add('is-open');
}
function closeZoom(){
  document.getElementById('zoomOverlay').classList.remove('is-open');
}
function cycleZoom(){
  zoomLevel = zoomLevel >= 3 ? 1 : zoomLevel + 1;
  const img = document.getElementById('zoomImage');
  img.className = zoomLevel === 2 ? 'zoom-2' : zoomLevel === 3 ? 'zoom-3' : '';
}

/* ================= ESCÁNER DE CÓDIGO DE BARRAS POR CÁMARA (celular/webcam) =================
   Primero intenta la API nativa del navegador (BarcodeDetector). Como esa API no está
   disponible o no funciona en todos los Chrome (celular o PC — el objeto puede existir pero
   detect() nunca encuentra nada en varios equipos), a partir de ~1.5s sin resultado se activa
   además un decodificador propio de EAN-13/UPC-A escrito a mano (sin librerías externas):
   toma el cuadro de video, recorre varias líneas horizontales, mide el ancho de barras/espacios
   y decodifica el patrón contra las tablas estándar de EAN-13, verificando el dígito de control.
   Cubre la enorme mayoría de códigos de producto (EAN-13 y UPC-A, que es EAN-13 con un 0 inicial). */
const EAN_L_CODES = ['0001101','0011001','0010011','0111101','0100011','0110001','0101111','0111011','0110111','0001011'];
const EAN_G_CODES = ['0100111','0110011','0011011','0100001','0011101','0111001','0000101','0010001','0001001','0010111'];
const EAN_R_CODES = ['1110010','1100110','1101100','1000010','1011100','1001110','1010000','1000100','1001000','1110100'];
const EAN_FIRST_DIGIT_PATTERNS = ['LLLLLL','LLGLGG','LLGGLG','LLGGGL','LGLLGG','LGGLLG','LGGGLL','LGLGLG','LGLGGL','LGGLGL'];
function eanChecksumOk(digits13){
  let sum = 0;
  for(let i=0;i<12;i++){ sum += (i%2===0) ? digits13[i] : digits13[i]*3; }
  return ((10 - (sum%10))%10) === digits13[12];
}
/* ---------- Dibujo del código de barras (EAN-13/UPC-A) para el catálogo público ----------
   Usa las mismas tablas del decodificador, al revés: arma el patrón de barras y lo dibuja
   como SVG. Solo dibuja cuando el código tiene 12 (UPC-A) o 13 (EAN-13) dígitos y su dígito
   de control es válido — si no, no se ve nada raro, simplemente no se dibuja el gráfico. */
function eanEncodeBits(digits13){
  const pattern = EAN_FIRST_DIGIT_PATTERNS[digits13[0]];
  let bits = '101';
  for(let i=0;i<6;i++){ const d = digits13[i+1]; bits += pattern[i]==='L' ? EAN_L_CODES[d] : EAN_G_CODES[d]; }
  bits += '01010';
  for(let i=0;i<6;i++){ bits += EAN_R_CODES[digits13[i+7]]; }
  bits += '101';
  return bits;
}
function barcodeSvgHtml(code){
  let digits = String(code||'').replace(/\D/g,'');
  if(digits.length===12) digits = '0'+digits; // UPC-A → EAN-13 con un 0 adelante
  if(digits.length!==13) return '';
  const nums = digits.split('').map(Number);
  if(!eanChecksumOk(nums)) return '';
  const bits = eanEncodeBits(nums);
  const barW = 1.7, height = 34;
  let x = 0, rects = '';
  for(let i=0;i<bits.length;i++){
    if(bits[i]==='1') rects += `<rect x="${x.toFixed(2)}" y="0" width="${barW}" height="${height}"/>`;
    x += barW;
  }
  const totalW = Math.round(bits.length*barW);
  return `<svg class="barcode-svg" viewBox="0 0 ${totalW} ${height}" width="${totalW}" height="${height}" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">${rects}</svg>`;
}

/* ---------- Código de barras del código Zebra interno (Code 39) ----------
   El código Zebra (internalCodes) es un número corto que la propia web le asigna a cada
   artículo — no es un GTIN, así que no sirve para EAN-13. Code 39 sí puede codificar
   cualquier texto/número y lo entiende de forma nativa cualquier lector de código de barras
   físico (láser/USB), sin necesitar ninguna librería: cada carácter son 9 franjas
   (5 barras + 4 espacios) de las cuales exactamente 3 son "anchas" y 6 "angostas". */
const CODE39_PATTERNS = {
  '0':'NNNWWNWNN', '1':'WNNWNNNNW', '2':'NNWWNNNNW', '3':'WNWWNNNNN', '4':'NNNWWNNNW',
  '5':'WNNWWNNNN', '6':'NNWWWNNNN', '7':'NNNWNNWNW', '8':'WNNWNNWNN', '9':'NNWWNNWNN',
  '*':'NNNWNWNWN'
};
function code39SvgHtml(code){
  const text = String(code||'').toUpperCase().replace(/[^0-9]/g,'');
  if(!text) return '';
  const seq = ['*', ...text.split(''), '*'];
  const narrow = 1.3, wide = narrow*2.6, gap = narrow, height = 34;
  let x = 0, rects = '';
  seq.forEach((ch, ci)=>{
    const pattern = CODE39_PATTERNS[ch];
    if(!pattern) return;
    for(let i=0;i<pattern.length;i++){
      const w = pattern[i]==='W' ? wide : narrow;
      if(i%2===0) rects += `<rect x="${x.toFixed(2)}" y="0" width="${w.toFixed(2)}" height="${height}"/>`; // posiciones pares = barra
      x += w;
    }
    if(ci < seq.length-1) x += gap; // espacio angosto entre caracteres
  });
  const totalW = Math.ceil(x);
  return `<svg class="barcode-svg" viewBox="0 0 ${totalW} ${height}" width="${totalW}" height="${height}" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">${rects}</svg>`;
}
function decodeEanRunsAt(runs){
  for(let start=0; start<runs.length-3; start++){
    if(runs[start].val !== 1) continue;
    const guard = runs.slice(start, start+3);
    const unit = (guard[0].len+guard[1].len+guard[2].len)/3;
    if(unit < 1) continue;
    const within = (v,tol)=>Math.abs(v-unit)<=tol*unit;
    if(!(within(guard[0].len,0.5)&&within(guard[1].len,0.5)&&within(guard[2].len,0.5))) continue;
    let pos = start+3, leftDigits = [], pattern = '', ok = true;
    for(let d=0; d<6 && ok; d++){
      if(pos+4>runs.length){ ok=false; break; }
      const seg = runs.slice(pos,pos+4);
      if(seg[0].val!==0){ ok=false; break; }
      const modUnit = seg.reduce((s,r)=>s+r.len,0)/7;
      if(modUnit < unit*0.5 || modUnit > unit*1.8){ ok=false; break; }
      let bitstr = '';
      for(const r of seg){ bitstr += (r.val?'1':'0').repeat(Math.max(1, Math.round(r.len/modUnit))); }
      bitstr = bitstr.length>7 ? bitstr.slice(0,7) : bitstr.padEnd(7, bitstr[bitstr.length-1]||'0');
      const li = EAN_L_CODES.indexOf(bitstr), gi = EAN_G_CODES.indexOf(bitstr);
      if(li>=0){ leftDigits.push(li); pattern += 'L'; }
      else if(gi>=0){ leftDigits.push(gi); pattern += 'G'; }
      else { ok=false; break; }
      pos += 4;
    }
    if(!ok) continue;
    if(pos+5>runs.length) continue;
    const mid = runs.slice(pos,pos+5);
    const midUnit = mid.reduce((s,r)=>s+r.len,0)/5;
    if(!(midUnit>unit*0.5 && midUnit<unit*1.8)) continue;
    let midOk = true;
    for(let i=0;i<5;i++){ if(mid[i].val !== (i%2===0?0:1)) { midOk=false; break; } }
    if(!midOk) continue;
    pos += 5;
    let rightDigits = [], rok = true;
    for(let d=0; d<6 && rok; d++){
      if(pos+4>runs.length){ rok=false; break; }
      const seg = runs.slice(pos,pos+4);
      if(seg[0].val!==1){ rok=false; break; }
      const modUnit = seg.reduce((s,r)=>s+r.len,0)/7;
      if(modUnit < unit*0.5 || modUnit > unit*1.8){ rok=false; break; }
      let bitstr = '';
      for(const r of seg){ bitstr += (r.val?'1':'0').repeat(Math.max(1, Math.round(r.len/modUnit))); }
      bitstr = bitstr.length>7 ? bitstr.slice(0,7) : bitstr.padEnd(7, bitstr[bitstr.length-1]||'0');
      const ri = EAN_R_CODES.indexOf(bitstr);
      if(ri<0){ rok=false; break; }
      rightDigits.push(ri);
      pos += 4;
    }
    if(!rok) continue;
    const fdIdx = EAN_FIRST_DIGIT_PATTERNS.indexOf(pattern);
    if(fdIdx<0) continue;
    const fullDigits = [fdIdx, ...leftDigits, ...rightDigits];
    if(fullDigits.length!==13 || !eanChecksumOk(fullDigits)) continue;
    return fullDigits.join('');
  }
  return null;
}
function decodeEanFromImageData(imageData, width, scanY){
  const row = new Uint8Array(width);
  for(let x=0;x<width;x++){
    const idx = (scanY*width+x)*4;
    const lum = 0.299*imageData.data[idx]+0.587*imageData.data[idx+1]+0.114*imageData.data[idx+2];
    row[x] = lum < 128 ? 1 : 0;
  }
  const runs = [];
  let cur = row[0], len=1;
  for(let x=1;x<row.length;x++){
    if(row[x]===cur){ len++; } else { runs.push({val:cur, len}); cur=row[x]; len=1; }
  }
  runs.push({val:cur,len});
  const forward = decodeEanRunsAt(runs);
  if(forward) return forward;
  return decodeEanRunsAt(runs.slice().reverse()); // por si el código quedó al revés
}
let barcodeScanCanvas = null;
function tryHandwrittenBarcodeDecode(video){
  if(!video.videoWidth) return null;
  if(!barcodeScanCanvas) barcodeScanCanvas = document.createElement('canvas');
  const scaleW = Math.min(640, video.videoWidth);
  const scale = scaleW / video.videoWidth;
  barcodeScanCanvas.width = scaleW;
  barcodeScanCanvas.height = Math.round(video.videoHeight * scale);
  const ctx = barcodeScanCanvas.getContext('2d', {willReadFrequently:true});
  ctx.drawImage(video, 0, 0, barcodeScanCanvas.width, barcodeScanCanvas.height);
  let imageData;
  try{ imageData = ctx.getImageData(0,0,barcodeScanCanvas.width, barcodeScanCanvas.height); }catch(e){ return null; }
  const h = barcodeScanCanvas.height;
  const lines = [0.4,0.45,0.5,0.55,0.6,0.35,0.65];
  for(const f of lines){
    const y = Math.max(0, Math.min(h-1, Math.round(h*f)));
    const value = decodeEanFromImageData(imageData, barcodeScanCanvas.width, y);
    if(value) return value;
  }
  return null;
}
let barcodeScanStream = null;
let barcodeScanLoopId = null;
let barcodeScanCallback = null;
async function openBarcodeScanner(onCode){
  barcodeScanCallback = onCode;
  const overlay = document.getElementById('barcodeScanOverlay');
  const hint = document.getElementById('barcodeScanHint');
  overlay.classList.add('is-open');
  if(hint) hint.textContent = 'Apunta la cámara al código de barras';
  try{
    barcodeScanStream = await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'}});
  }catch(e){
    closeBarcodeScanner();
    playErrorSound();
    showToast('No se pudo abrir la cámara — revisá los permisos del navegador.');
    return;
  }
  const video = document.getElementById('barcodeScanVideo');
  video.srcObject = barcodeScanStream;
  await video.play().catch(()=>{});
  let useNative = ('BarcodeDetector' in window);
  let detector = null;
  if(useNative){
    try{ detector = new BarcodeDetector({formats:['ean_13','ean_8','upc_a','upc_e','code_128','code_39','codabar','itf']}); }
    catch(e){ try{ detector = new BarcodeDetector(); }catch(e2){ useNative = false; } }
  }
  const startTs = performance.now();
  let switchedHint = false;
  const scanTick = async ()=>{
    if(!barcodeScanStream) return;
    let value = null;
    if(useNative && detector){
      try{
        const codes = await detector.detect(video);
        if(codes && codes.length) value = (codes[0].rawValue||'').trim() || null;
      }catch(e){ useNative = false; }
    }
    const elapsed = performance.now()-startTs;
    if(!value && (!useNative || elapsed>1500)){
      if(!switchedHint && hint){ hint.textContent = 'Buscando código EAN/UPC…'; switchedHint = true; }
      value = tryHandwrittenBarcodeDecode(video);
    }
    if(value){
      playAddSound();
      const cb = barcodeScanCallback;
      if(cb) cb(value);
      return; // no seguir el loop; quien recibió el código decide si cierra el escáner
    }
    barcodeScanLoopId = requestAnimationFrame(scanTick);
  };
  barcodeScanLoopId = requestAnimationFrame(scanTick);
}
function closeBarcodeScanner(){
  document.getElementById('barcodeScanOverlay').classList.remove('is-open');
  if(barcodeScanLoopId){ cancelAnimationFrame(barcodeScanLoopId); barcodeScanLoopId = null; }
  if(barcodeScanStream){ barcodeScanStream.getTracks().forEach(t=>t.stop()); barcodeScanStream = null; }
  const video = document.getElementById('barcodeScanVideo');
  if(video) video.srcObject = null;
  barcodeScanCallback = null;
}

/* ================= AUTH / STAFF LOGIN ================= */
/* Las contraseñas ya NO están escritas aquí: solo su huella (PBKDF2). 'wk' es la llave
   del equipo cifrada con la contraseña de cada usuario, para activar el guardado en línea
   en cualquier PC con solo iniciar sesión. */
const USERS = {
  'albertosamboy89@gmail.com': {hash:'e289fc91db0a32ea8c54f5aa1b5621a281f527eab83c36259daaa69f6fb2e2c3', wk:'lNNlmdaqanl9b8rA6M9ZKoc6KwZRrAC8f9paNjsd81e51gbnrICMiL0v5063PQvXUs4kHRueOLeUOgqm', role:'admin', label:'Alberto Samboy (Empresa)'},
  alberto: {hash:'475d6b578e133c0c20dcfef554fe1ee63cf331750ad6bf4d9f28732f442232be', wk:'LGLc0G0ellFcjw0yDhErUBhKAQdGf9QryODOooP54OWt3VJo7GCyNijTgsY5OZ2czGhZtGHh7G3Sxmj8', role:'admin', label:'Alberto (Total)'},
  usuario2: {hash:'5116b46843f8d3f920f99ac09e02f6458887e972e8d1ca735778257399f96451', wk:'I5+GdYx1qfUmACgh9iRgdYccEOoEfPQ6OoZ8VwW+6b3ILouBoXRWf3I0dE3AtP2UJPH65m2lEXeKT0G2', role:'staff', label:'Usuario 2'},
  usuario3: {hash:'469f5bb0caa17319b2c6001704adb4c6a29f22ef2a324c6b53bfa5e8428c496b', wk:'k8pQ3hnljkrpgFXIFPmKAcTVtDEbLWzyggpkPXdXOn9BXMF8nG4Xwe0uIqE63Al4b3a/S1Ac1jeoRI8G', role:'staff', label:'Usuario 3'},
  admin2: {hash:'8ae2e85f75e3dba6803a71ba56a4876efc959701aa1620e29ab47e0f4a741bc6', wk:'Ed3xj2cOvWRNeYoFIsp5AbBFuv4O3K7C8ISmIh9PGLmCMJkKrqwzjjFZJ1EXS0n/GRddgvBJ0susibbk', role:'admin', label:'Admin 2 (Total)'},
  admin3: {hash:'99a5c71dd05cc38eca9af9c3a44d11514f826c2f90203b60eb13898f3b53c285', wk:'ptE+gslwMh/kSuD4hjrKWgnIufeBYLdhT6XgZ44a9JOl9fsXbySwa5eWBwU8neSnyYlhjEL0diUPXMMb', role:'admin', label:'Admin 3 (Total)'},
  admin4: {hash:'a95206f0eb2f48b45ae58579bca0ce8c14c07b09b32ee9ea79da0a1930560bf4', wk:'P13pwboJMYHeiL/L6UX+LdqRIP7FgCg8YqLt/bH0aWVXaN8cuC9frrq4CLXIhdVIWuSPWetgd0elFbhF', role:'admin', label:'Admin 4 (Total)'}
};
const QUICK_SALE_USERS = ['albertosamboy89@gmail.com','alberto','admin2']; // únicos que pueden usar la venta rápida de la página principal
function canQuickSale(){ return !!(currentUser && (QUICK_SALE_USERS.includes(currentUser.username) || currentUser.venta || isSuperAdmin())); }
const MAIN_ADMINS = ['albertosamboy89@gmail.com','alberto','admin2']; // únicos que pueden ver el Costo de los artículos
function canSeeCost(){ return !!(currentUser && (MAIN_ADMINS.includes(currentUser.username) || currentUser.costo || isSuperAdmin())); }
let currentUser = null; // {username, role}
let ordersView = 'active'; // 'active' | 'history'
let pendingDeepLink = null; // set when a new tab/window was opened for a specific panel and needs login first
const SESSION_KEY = 'eurotruck_session_v1';
function saveSession(){ try{ if(currentUser) localStorage.setItem(SESSION_KEY, JSON.stringify(currentUser)); }catch(e){} }
function clearSession(){ try{ localStorage.removeItem(SESSION_KEY); }catch(e){} }
function restoreSession(){
  try{
    const raw = localStorage.getItem(SESSION_KEY);
    if(!raw) return;
    const parsed = JSON.parse(raw);
    const sv = srvSettings();
    if(parsed && parsed.username && ((USERS[parsed.username] && USERS[parsed.username].role === parsed.role) || (sv.token && sv.usuario === parsed.username))){
      currentUser = parsed;
      updateAuthUI();
    }
  }catch(e){}
}

function onAuthButtonClick(){
  if(currentUser){ openOrdersWindow(); } else { openLogin(); }
}
function openLogin(){ document.getElementById('loginOverlay').classList.add('is-open'); document.getElementById('loginError').style.display='none'; }
function closeLogin(){ document.getElementById('loginOverlay').classList.remove('is-open'); }
const PBKDF2_ITER = 150000;
async function pbkdf2Bytes(pw, salt){
  const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(pw), 'PBKDF2', false, ['deriveBits']);
  return new Uint8Array(await crypto.subtle.deriveBits({name:'PBKDF2', hash:'SHA-256', salt:new TextEncoder().encode(salt), iterations:PBKDF2_ITER}, base, 256));
}
const bytesToHex = b => Array.from(b).map(x=>x.toString(16).padStart(2,'0')).join('');
const b64ToBytes = b64 => Uint8Array.from(atob(b64), c=>c.charCodeAt(0));
const bytesToB64 = b => { let s=''; b.forEach(x=>s+=String.fromCharCode(x)); return btoa(s); };
async function aesKey(raw){ return crypto.subtle.importKey('raw', raw, 'AES-GCM', false, ['encrypt','decrypt']); }
async function aesDecrypt(rawKey, b64){
  const all = b64ToBytes(b64);
  return new Uint8Array(await crypto.subtle.decrypt({name:'AES-GCM', iv:all.slice(0,12)}, await aesKey(rawKey), all.slice(12)));
}
async function aesEncrypt(rawKey, bytes){
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM', iv}, await aesKey(rawKey), bytes));
  const out = new Uint8Array(12+ct.length); out.set(iv); out.set(ct,12); return bytesToB64(out);
}
async function verifyPassword(u, p){
  const rec = USERS[u];
  if(!rec) return false;
  try{ return bytesToHex(await pbkdf2Bytes(p, 'eurotruck-login:'+u)) === rec.hash; }catch(e){ return false; }
}
async function unwrapTeamKey(u, p){
  return aesDecrypt(await pbkdf2Bytes(p, 'eurotruck-wrap:'+u), USERS[u].wk);
}
// Al iniciar sesión: si esta PC aún no tiene el guardado en línea, lo activa sola leyendo
// "acceso.json" (publicado junto al index) y descifrándolo con la contraseña del usuario.
async function autoConnectOnlineSave(u, p){
  try{
    if(serverConfigured()) return;
    if(githubConfigured() && dbApi) return;
    const r = await fetch('acceso.json?t='+Date.now(), {cache:'no-store'});
    if(!r.ok) return;
    const acc = await r.json();
    const teamKey = await unwrapTeamKey(u, p);
    const cfg = JSON.parse(new TextDecoder().decode(await aesDecrypt(teamKey, acc.data)));
    localStorage.setItem(GH_TOKEN_KEY, JSON.stringify({owner:cfg.owner, repo:cfg.repo, branch:cfg.branch, token:cfg.token}));
    await initData();
    if(dbApi) showToast('Guardado en línea activado en esta PC ✔');
  }catch(e){ console.warn('Activar guardado en línea:', e && e.message); }
}
async function handleLogin(e){
  e.preventDefault();
  const u = document.getElementById('loginUser').value.trim();
  const p = document.getElementById('loginPass').value;
  const rec = USERS[u];
  const srv = await serverLogin(u, p);                 // 1) el servidor de tu PC decide si está disponible
  const localOk = !!(rec && await verifyPassword(u, p)); // 2) sin conexión: clave guardada en la página
  if(srv.reason === 'robot'){ showToast(tr('Marca "No soy un robot" y vuelve a intentar.','Tick "I\'m not a robot" and try again.')); return; }
  if(srv.reason === 'bloqueo'){ showToast(tr('Demasiados intentos. Espera 10 minutos.','Too many attempts. Wait 10 minutes.')); return; }
  if(srv.ok || (srv.reason !== 'clave' && localOk)){
    if(srv.ok) initData(); else autoConnectOnlineSave(u, p);
    if(!srv.ok && srv.reason === 'red') setTimeout(()=>showToast('Sin conexión con el servidor: se trabaja local y se sube al volver.'), 3300);
    currentUser = {username:u, role: srv.rol || (rec && rec.role) || 'staff', costo: !!srv.costo, venta: !!srv.venta, superAdmin: !!srv.superAdmin};
    saveSession();
    document.getElementById('loginForm').reset();
    closeLogin();
    updateAuthUI();
    showToast('Sesión iniciada como '+u);
    if(pendingDeepLink === 'inventory' && currentUser.role === 'admin'){
      pendingDeepLink = null;
      openInventoryPanel();
    } else if(pendingDeepLink === 'receiving' && currentUser.role === 'admin'){
      pendingDeepLink = null;
      openReceivingPanel();
    } else if(pendingDeepLink === 'orders'){
      pendingDeepLink = null;
      openOrdersPanel();
    } else {
      pendingDeepLink = null;
      openOrdersWindow();
    }
  } else {
    document.getElementById('loginError').style.display='block';
  }
  return false;
}
function logout(){
  currentUser = null;
  clearSession();
  serverLogout();
  updateAuthUI();
  closeOrdersWindow();
  closeInventoryWindow();
  closeQuoteDetail();
  showToast('Sesión cerrada.');
}
function updateAuthUI(){
  const btn = document.getElementById('authButton');
  const label = document.getElementById('authButtonLabel');
  const navBtn = document.getElementById('staffPanelNavBtn');
  const quickSaleBar = document.getElementById('quickSaleBar');
  const backupSection = document.getElementById('footerBackupSection');
  if(currentUser){
    btn.classList.add('is-logged');
    label.textContent = currentUser.username;
    navBtn.style.display = '';
    if(quickSaleBar) quickSaleBar.style.display = canQuickSale() ? '' : 'none';
    if(backupSection) backupSection.style.display = isSuperAdmin() ? '' : 'none';
    document.querySelectorAll('.users-btn').forEach(b=> b.style.display = isSuperAdmin() ? '' : 'none');
  } else {
    document.querySelectorAll('.users-btn').forEach(b=> b.style.display = 'none');
    btn.classList.remove('is-logged');
    label.textContent = 'Acceso empresa';
    navBtn.style.display = 'none';
    if(quickSaleBar) quickSaleBar.style.display = 'none';
    if(backupSection) backupSection.style.display = 'none';
  }
}

/* ================= TASA DEL DÓLAR (US$ → RD$) ================= */
function todayStr(){
  const d = new Date();
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
}
function loadUsdRateFromStorage(){
  try{
    const raw = localStorage.getItem(LS_KEY_USDRATE);
    if(!raw) return;
    const data = JSON.parse(raw);
    usdRate = Number(data.rate) || null;
    usdRateDate = data.date || '';
    usdRateManual = !!data.manual;
  }catch(e){ /* sin tasa guardada aún */ }
}
function saveUsdRateToStorage(){
  try{ localStorage.setItem(LS_KEY_USDRATE, JSON.stringify({rate:usdRate, date:usdRateDate, manual:usdRateManual})); }catch(e){}
}
function getUsdRate(){
  // Si nunca se ha fijado una tasa (ni de internet ni a mano), 1:1 para no romper cálculos.
  return Number(usdRate) > 0 ? Number(usdRate) : 1;
}
function renderUsdRateBadge(){
  const el = document.getElementById('usdRateBadge');
  if(!el) return;
  if(!usdRate){
    el.innerHTML = `<b>Tasa del dólar</b><small>Sin datos — click para fijarla</small>`;
    return;
  }
  const fecha = usdRateDate ? usdRateDate.split('-').reverse().join('/') : '';
  el.innerHTML = `<b>US$1 = RD$${Number(usdRate).toFixed(2)}</b><small>${usdRateManual?'Fijada a mano':'Tasa del día'} · ${fecha}</small>`;
}
async function refreshUsdRate(force){
  loadUsdRateFromStorage();
  if(!force && usdRateManual){ renderUsdRateBadge(); return; } // el admin la fijó a mano: no la pisamos sola
  if(!force && usdRate && usdRateDate === todayStr()){ renderUsdRateBadge(); return; } // ya se buscó hoy
  renderUsdRateBadge();
  const sources = [
    async ()=>{
      const r = await fetch('https://open.er-api.com/v6/latest/USD');
      const j = await r.json();
      if(!j || !j.rates || !j.rates.DOP) throw new Error('sin DOP');
      return Number(j.rates.DOP);
    },
    async ()=>{
      const r = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const j = await r.json();
      if(!j || !j.rates || !j.rates.DOP) throw new Error('sin DOP');
      return Number(j.rates.DOP);
    }
  ];
  for(const getRate of sources){
    try{
      const rate = await getRate();
      if(rate && rate > 0){
        usdRate = rate;
        usdRateDate = todayStr();
        usdRateManual = false;
        saveUsdRateToStorage();
        renderUsdRateBadge();
        return;
      }
    }catch(e){ /* probar la siguiente fuente */ }
  }
  // Ninguna fuente respondió (sin internet, por ejemplo): se queda con la última tasa guardada.
  renderUsdRateBadge();
}
function promptManualUsdRate(){
  if(!currentUser || currentUser.role!=='admin'){ showToast('Solo un administrador puede fijar la tasa a mano.'); return; }
  const val = prompt('¿A cuántos pesos dominicanos está el dólar hoy?\n(Se usará para convertir Costo/Precio final de US$ a RD$ en las cotizaciones nuevas)', usdRate ? String(usdRate) : '');
  if(val===null) return;
  const num = Number(val.replace(',','.'));
  if(!num || num<=0){ playErrorSound(); showToast('Escribí un número de tasa válido.'); return; }
  usdRate = num;
  usdRateDate = todayStr();
  usdRateManual = true;
  saveUsdRateToStorage();
  renderUsdRateBadge();
  saveMeta(); // compartir la tasa con las demás PC
  playAddSound();
  showToast('Tasa del dólar actualizada.');
}
loadUsdRateFromStorage();

/* ================= ORDERS / QUOTATIONS WINDOW (staff) ================= */
function openOrdersWindow(){
  if(!currentUser){ pendingDeepLink = 'orders'; openLogin(); return; }
  // Se abre en la MISMA ventana (antes abría una ventana/pestaña nueva cada vez).
  closeInventoryWindow();
  closeReceivingPanel();
  openOrdersPanel();
}
function openOrdersPanel(){
  if(!currentUser){ openLogin(); return; }
  document.getElementById('ordersOverlay').classList.add('is-open');
  document.getElementById('staffUserTag').textContent = '· '+currentUser.username+(currentUser.role==='admin' ? ' (acceso total)' : '');
  document.getElementById('goInventoryBtn').style.display = currentUser.role==='admin' ? '' : 'none';
  const grb = document.getElementById('goReceivingBtn');
  if(grb) grb.style.display = currentUser.role==='admin' ? '' : 'none';
  setOrdersView(ordersView);
  renderUsdRateBadge();
  refreshUsdRate(false);
}
function closeOrdersWindow(){ document.getElementById('ordersOverlay').classList.remove('is-open'); }
function setOrdersView(view){
  ordersView = view;
  const activeBtn = document.getElementById('ordersViewActiveBtn');
  const historyBtn = document.getElementById('ordersViewHistoryBtn');
  if(activeBtn) activeBtn.classList.toggle('is-active', view==='active');
  if(historyBtn) historyBtn.classList.toggle('is-active', view==='history');
  renderOrdersGrid();
}
function refreshOrdersPanel(){
  renderOrdersGrid();
  showToast('Cotizaciones actualizadas.');
}
function showTodaySales(){
  const todayKey = new Date().toDateString();
  const sentToday = ordersState.filter(o => o.status==='enviada' && o.sentAt && new Date(o.sentAt).toDateString()===todayKey);
  const total = sentToday.reduce((sum,o)=> sum + (o.items||[]).reduce((s,it)=> s + ((Number(it.price)||0)*it.qty), 0), 0);
  showToast(sentToday.length ? `Venta del día: ${sentToday.length} cotización${sentToday.length===1?'':'es'} enviada${sentToday.length===1?'':'s'} · RD$ ${total.toFixed(2)}` : 'Aún no hay cotizaciones enviadas hoy.');
}
function renderOrdersGrid(){
  const grid = document.getElementById('ordersGrid');
  const empty = document.getElementById('ordersEmpty');
  if(!grid) return;
  const activeCountEl = document.getElementById('ordersActiveCount');
  const historyCountEl = document.getElementById('ordersHistoryCount');
  if(activeCountEl) activeCountEl.textContent = ordersState.filter(o=>o.status!=='enviada').length;
  if(historyCountEl) historyCountEl.textContent = ordersState.filter(o=>o.status==='enviada').length;

  const list = ordersState.filter(o => ordersView==='history' ? o.status==='enviada' : o.status!=='enviada');
  if(!list.length){
    grid.innerHTML = '';
    empty.style.display = 'block';
    empty.textContent = ordersView==='history' ? 'Aún no hay cotizaciones enviadas.' : 'Aún no hay cotizaciones activas.';
    return;
  }
  empty.style.display = 'none';
  grid.innerHTML = list.map(o=>{
    const total = (o.items||[]).reduce((sum,it)=> sum + ((Number(it.price)||0) * it.qty), 0);
    const refCount = (o.items||[]).length;
    const refsLabel = refCount + ' referencia' + (refCount===1?'':'s');
    const status = o.status || 'nueva';
    const statusLabel = status==='preparando' ? 'En preparación' : status==='enviada' ? 'Enviada' : 'Pendiente';
    const dateLabel = new Date(o.createdAt).toLocaleString('es-DO');
    return `<div class="ord-row" onclick="openQuoteDetail('${o.id}')">
      <div class="ord-row-main">
        <div class="ord-row-id">${o.id}</div>
        <div class="ord-row-customer">${o.company}</div>
        <div class="ord-row-contact">${o.email ? o.email+' · ' : ''}${o.phone}</div>
      </div>
      <div class="ord-row-status"><span class="ord-badge ord-badge--${status}">${statusLabel}</span></div>
      <div class="ord-row-money">
        <div class="ord-row-price">${total>0 ? 'RD$ '+total.toFixed(2) : 'Por cotizar'}</div>
        <div class="ord-row-refs">${refsLabel}</div>
      </div>
      <div class="ord-row-date">${dateLabel}</div>
    </div>`;
  }).join('');
}
function takeOrder(orderId){
  const o = ordersState.find(o=>o.id===orderId);
  if(!o) return;
  o.status = 'preparando';
  o.takenBy = currentUser ? currentUser.username : '';
  saveOrders();
  renderOrdersGrid();
  showToast('Cotización en preparación.');
}

/* ---- Quotation detail: editable line prices, final total ---- */
function openQuoteDetail(orderId){
  const o = ordersState.find(o=>o.id===orderId);
  if(!o) return;
  const content = document.getElementById('quoteDetailContent');
  const total = (o.items||[]).reduce((sum,it)=> sum + ((Number(it.price)||0) * it.qty), 0);
  const status = o.status || 'nueva';
  content.innerHTML = `
    <button class="modal-close" onclick="closeQuoteDetail()" aria-label="Cerrar">✕</button>
    <h3>${o.company}</h3>
    <p class="modal-sub">Orden ${o.id} · ${o.phone}${o.email ? ' · '+o.email : ''}${o.rnc ? ' · RNC '+o.rnc : ''} · <span class="quote-status" style="display:inline-block;">${status==='preparando'?'Preparando':status==='enviada'?'Enviada':'Sin tocar'}</span></p>
    <div id="quoteLines">${(o.items||[]).map((it,i)=>{
      const p = PRODUCTS_BY_REF[it.ref];
      return `<div class="quote-line">
        <img src="${p ? p.img : ''}" alt="" onerror="this.style.opacity=.25">
        <div><b style="display:block;font-size:.78rem;color:#eef2f8;">${it.title}</b><span style="font-size:.64rem;color:#8b96ab;">SKU ${it.ref}</span></div>
        <span>x${it.qty}</span>
        <input type="number" min="0" step="0.01" value="${it.price||0}" onchange="updateQuoteLinePrice('${o.id}',${i},this.value)">
        <span id="quoteLineTotal-${i}">RD$ ${((Number(it.price)||0)*it.qty).toFixed(2)}</span>
      </div>`;
    }).join('')}</div>
    <div class="quote-total-row"><span>Precio final</span><span id="quoteTotalDisplay">RD$ ${total.toFixed(2)}</span></div>
    <div class="quote-detail-actions">
      ${status==='nueva' ? `<button class="mini-btn" onclick="takeOrder('${o.id}');openQuoteDetail('${o.id}')">Tomar</button>` : ''}
      ${status!=='enviada' ? `<button class="mini-btn mini-btn--wa" onclick="finalizeOrder('${o.id}')">Marcar como enviada</button>` : ''}
      <button class="mini-btn mini-btn--wa" onclick="sendOrderWhatsApp('${o.id}')">Enviar por WhatsApp</button>
      <button class="mini-btn" onclick="downloadQuotePdf('${o.id}')">Descargar PDF</button>
    </div>
  `;
  document.getElementById('quoteDetailOverlay').classList.add('is-open');
}
function closeQuoteDetail(){ document.getElementById('quoteDetailOverlay').classList.remove('is-open'); }
function updateQuoteLinePrice(orderId, idx, value){
  const o = ordersState.find(o=>o.id===orderId);
  if(!o || !o.items[idx]) return;
  o.items[idx].price = Number(value)||0;
  saveOrders();
  const total = o.items.reduce((sum,it)=> sum + ((Number(it.price)||0) * it.qty), 0);
  const lineTotalEl = document.getElementById('quoteLineTotal-'+idx);
  if(lineTotalEl) lineTotalEl.textContent = 'RD$ ' + ((Number(o.items[idx].price)||0)*o.items[idx].qty).toFixed(2);
  const totalEl = document.getElementById('quoteTotalDisplay');
  if(totalEl) totalEl.textContent = 'RD$ ' + total.toFixed(2);
  renderOrdersGrid();
}
function finalizeOrder(orderId){
  const o = ordersState.find(o=>o.id===orderId);
  if(!o) return;
  o.status = 'enviada';
  o.sentAt = new Date().toISOString();
  (o.items||[]).forEach(it=>{
    const inv = getInv(it.ref);
    inv.sold = (Number(inv.sold)||0) + it.qty;
    salesLog.unshift({ref: it.ref, title: it.title, qty: it.qty, date: o.sentAt});
  });
  salesLog = salesLog.slice(0,1000);
  saveOrders();
  saveInventory();
  saveMeta();
  closeQuoteDetail();
  renderOrdersGrid();
  renderTopSellers();
  showToast('Cotización marcada como enviada — pasó al historial.');
}
function downloadQuotePdf(orderId){
  const o = ordersState.find(o=>o.id===orderId);
  if(!o) return;
  const ok = generateQuotePdf(o);
  showToast(ok ? 'PDF descargado.' : 'PDF no disponible sin conexión.');
}

/* ================= INVENTORY / WAREHOUSE WINDOW (alberto — admin only) — "Inventario fácil" ================= */
let invSearchTerm = '';
let invPage = 0;
const INV_PAGE_SIZE = 60;
let scanMode = 'auto';
const LOW_STOCK_THRESHOLD = 5;

function openInventoryWindow(){
  if(!currentUser || currentUser.role!=='admin'){ pendingDeepLink = 'inventory'; openLogin(); return; }
  // Se abre en la MISMA ventana (antes abría una ventana/pestaña nueva cada vez).
  closeOrdersWindow();
  closeReceivingPanel();
  openInventoryPanel();
}
function openInventoryPanel(){
  if(!currentUser || currentUser.role!=='admin') return;
  document.getElementById('inventoryOverlay').classList.add('is-open');
  activeArea();
  initReportFilters();
  refreshInventoryPanel();
  setTimeout(()=>{ const el = document.getElementById('scanInput'); if(el) el.focus(); }, 50);
}
function closeInventoryWindow(){ document.getElementById('inventoryOverlay').classList.remove('is-open'); }
function backToOrders(){ openOrdersWindow(); }
function goToMainSite(){ closeInventoryWindow(); closeOrdersWindow(); closeReceivingPanel(); }
function refreshInventoryPanel(){
  renderAreaSelect();
  renderCatalogCards();
  renderCountedItemsList();
  renderInventoryStats();
  renderTopSellers();
  renderScanHistoryTable();
}
function scrollToScanHistory(){
  const el = document.getElementById('scanHistoryTable');
  if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
}

/* Escaneo automático sin Enter: el lector de códigos teclea muy rápido en ráfaga;
   detectamos esa ráfaga y registramos solo al escanear. Enter sigue funcionando como respaldo. */
/* Detección automática de lecturas del escáner (lector USB/Bluetooth que "teclea" el código).
   Registra solo, sin Enter: cuando llega una ráfaga rápida de teclas y luego una pausa corta.
   También registra al pegar un código. Lo usan "Registrar artículos" (en Automático) y
   "Recepción de mercancía" (siempre automático). */
const SCAN_IDLE_MS = 150;   // pausa que marca el fin de la lectura del escáner
const SCAN_FAST_GAP = 80;   // ms entre teclas típico de un escáner (una persona teclea más lento)
let _codeIndex = null, _codeIndexTs = 0;
function allCodesIndex(){
  if(_codeIndex && Date.now() - _codeIndexTs < 20000) return _codeIndex;
  const set = new Set();
  const add = c=>{ c = String(c||'').trim().toLowerCase(); if(c) set.add(c); };
  visibleProducts().forEach(p=>{
    add(p.ref); add(p.gtin); add(internalCodes[p.ref]);
    (p.refsList||[]).forEach(r=>{ add(r); const sb = stripBrand(r); if(sb !== String(r).toLowerCase().trim()){ add(sb); add(normCode(sb)); } });
    const inv = (typeof peekInv === 'function') ? peekInv(p.ref) : inventoryState[p.ref];
    if(inv){ add(inv.gtin); (inv.altCodes||[]).forEach(add); }
  });
  _codeIndex = Array.from(set).sort(); _codeIndexTs = Date.now();
  return _codeIndex;
}
// ¿Hay otro código más largo que empieza igual? (ej. "1.0002" y "1.00022")
function codeHasLongerMatch(code){
  const lc = code.trim().toLowerCase(); const arr = allCodesIndex();
  let lo = 0, hi = arr.length;
  while(lo < hi){ const mid = (lo + hi) >> 1; if(arr[mid] < lc) lo = mid + 1; else hi = mid; }
  for(let i = lo; i < arr.length && arr[i].startsWith(lc); i++){ if(arr[i].length > lc.length) return true; }
  return false;
}
function attachAutoScan(el, isAuto, submit){
  if(!el) return;
  let timer = null, lastKeyTs = 0, fastCount = 0, pasted = false;
  const fire = ()=>{
    timer = null;
    if(!isAuto()) return;
    if(fastCount < 2 && !pasted) return;          // escritura a mano: espera Enter
    const code = el.value.trim();
    fastCount = 0; pasted = false;
    if(typedTimer){ clearTimeout(typedTimer); typedTimer = null; }
    if(code.length >= 3) submit(code);
  };
  el.addEventListener('keydown', e=>{
    if(e.key === 'Enter' || e.key === 'Tab' && el.value.trim() && fastCount >= 2){
      e.preventDefault();
      if(timer){ clearTimeout(timer); timer = null; }
      fastCount = 0; pasted = false;
      const code = el.value.trim();
      if(code) submit(code);
      return;
    }
    if(e.key.length === 1){
      const now = Date.now();
      const gap = now - lastKeyTs;
      lastKeyTs = now;
      fastCount = (gap <= SCAN_FAST_GAP) ? fastCount + 1 : 0;
    }
  });
  el.addEventListener('paste', ()=>{ pasted = true; });
  // Escrito a mano (sin Enter): al dejar de escribir, si es un código que existe, se registra solo.
  let typedTimer = null;
  const typedCheck = (longWait)=>{
    typedTimer = null;
    if(!isAuto()) return;
    const code = el.value.trim();
    if(code.length < 3 || !findProductByCode(code)) return;     // todavía no es un código válido
    if(!longWait && codeHasLongerMatch(code)){ typedTimer = setTimeout(()=>typedCheck(true), 1000); return; } // puede que siga escribiendo
    fastCount = 0; pasted = false;
    submit(code);
  };
  el.addEventListener('input', ()=>{
    if(!isAuto()) return;
    if(timer){ clearTimeout(timer); timer = null; }
    if(typedTimer){ clearTimeout(typedTimer); typedTimer = null; }
    if(el.value.trim().length < 3) return;
    timer = setTimeout(fire, SCAN_IDLE_MS);
    typedTimer = setTimeout(()=>typedCheck(false), 700);
  });
}
attachAutoScan(document.getElementById('scanInput'), ()=> scanMode === 'auto', code=> submitScanCode(code));
attachAutoScan(document.getElementById('receivingScanInput'), ()=> true, code=> submitReceivingScan(code));
// Misma lógica que al apretar Enter en el campo de escaneo — reutilizada por el escáner de cámara.
function submitScanCode(code){
  if(!code) return;
  const el = document.getElementById('scanInput');
  if(scanMode === 'manual'){
    if(el) el.value = code;
    manualRegisterFromInputs();
  } else {
    if(el) el.value = '';
    registerScan(code, 1);
    if(el) el.focus();
  }
}
let _invSearchTimer = null;
document.getElementById('invSearchInput') && document.getElementById('invSearchInput').addEventListener('input', e=>{
  invSearchTerm = e.target.value.trim().toLowerCase();
  invPage = 0;
  clearTimeout(_invSearchTimer);
  _invSearchTimer = setTimeout(renderCatalogCards, 150);
});
document.getElementById('tramoInput') && document.getElementById('tramoInput').addEventListener('change', ()=> commitAreaField('tramo'));
document.getElementById('tramoInput') && document.getElementById('tramoInput').addEventListener('keydown', e=>{
  if(e.key === 'Enter'){ e.preventDefault(); commitAreaField('tramo'); document.getElementById('estanteInput').focus(); }
});
document.getElementById('estanteInput') && document.getElementById('estanteInput').addEventListener('change', ()=> commitAreaField('estante'));
document.getElementById('estanteInput') && document.getElementById('estanteInput').addEventListener('keydown', e=>{
  if(e.key === 'Enter'){ e.preventDefault(); commitAreaField('estante'); document.getElementById('scanInput').focus(); }
});
document.getElementById('salidaSkuInput') && document.getElementById('salidaSkuInput').addEventListener('keydown', e=>{
  if(e.key === 'Enter'){ e.preventDefault(); registerSalida(); }
});

/* ---------- Scan mode (auto +1 vs manual quantity) ---------- */
function setScanMode(mode){
  scanMode = mode;
  const autoBtn = document.getElementById('modeAutoBtn');
  const manualBtn = document.getElementById('modeManualBtn');
  if(autoBtn) autoBtn.classList.toggle('is-active', mode==='auto');
  if(manualBtn) manualBtn.classList.toggle('is-active', mode==='manual');
  const qtyEl = document.getElementById('manualQtyInput');
  const btnEl = document.getElementById('manualRegisterBtn');
  if(qtyEl) qtyEl.style.display = mode==='manual' ? '' : 'none';
  if(btnEl) btnEl.style.display = mode==='manual' ? '' : 'none';
  const scanEl = document.getElementById('scanInput');
  if(scanEl) scanEl.placeholder = mode==='manual'
    ? 'Busca por referencia, SKU o GTIN...'
    : 'Referencia, SKU o GTIN — escanea varias veces: suma automáticamente';
}
function manualRegisterFromInputs(){
  const codeEl = document.getElementById('scanInput');
  const qtyEl = document.getElementById('manualQtyInput');
  const code = codeEl.value.trim();
  const qty = Number(qtyEl.value)||1;
  if(!code) return;
  registerScan(code, qty);
  codeEl.value = '';
}

/* ---------- Área de conteo (tramo / estante) ---------- */
function activeArea(){
  if(!countAreas.length) countAreas.push({tramo:'1', estante:'1', counts:{}});
  if(activeAreaIndex >= countAreas.length || activeAreaIndex < 0) activeAreaIndex = 0;
  if(!countAreas[activeAreaIndex].counts) countAreas[activeAreaIndex].counts = {};
  return countAreas[activeAreaIndex];
}
function syncLocationsFromAreas(){
  locations = countAreas.map(a=>`${a.tramo}/${a.estante}`);
}
function renderAreaSelect(){
  const sel = document.getElementById('areaSelect');
  if(!sel) return;
  activeArea();
  sel.innerHTML = countAreas.map((a,i)=>`<option value="${i}" ${i===activeAreaIndex?'selected':''}>${a.tramo || '—'} / ${a.estante || '—'}</option>`).join('');
  const tramoEl = document.getElementById('tramoInput');
  const estanteEl = document.getElementById('estanteInput');
  if(tramoEl) tramoEl.value = countAreas[activeAreaIndex].tramo;
  if(estanteEl) estanteEl.value = countAreas[activeAreaIndex].estante;
}
function setActiveAreaIndex(idx){
  activeAreaIndex = Number(idx)||0;
  saveMeta();
  renderAreaSelect();
  renderCountedItemsList();
  renderInventoryStats();
}
function addCountArea(){
  countAreas.push({tramo:'', estante:'', counts:{}});
  activeAreaIndex = countAreas.length-1;
  syncLocationsFromAreas();
  saveMeta();
  renderAreaSelect();
  renderCountedItemsList();
  renderInventoryStats();
  renderCatalogCards();
  showToast('Área nueva agregada — escribí el tramo y la góndola/estante.');
  const tramoEl = document.getElementById('tramoInput');
  const estanteEl = document.getElementById('estanteInput');
  if(tramoEl){ tramoEl.value=''; tramoEl.focus(); }
  if(estanteEl) estanteEl.value='';
}
function commitAreaField(field){
  const el = document.getElementById(field==='tramo' ? 'tramoInput' : 'estanteInput');
  if(!el) return;
  const area = activeArea();
  area[field] = el.value.trim();
  syncLocationsFromAreas();
  saveMeta();
  const sel = document.getElementById('areaSelect');
  if(sel && sel.options[activeAreaIndex]){
    sel.options[activeAreaIndex].textContent = `${area.tramo || '—'} / ${area.estante || '—'}`;
  }
  renderCatalogCards();
}
function removeActiveArea(){
  if(countAreas.length<=1){ showToast('Debe quedar al menos un área de conteo.'); return; }
  countAreas.splice(activeAreaIndex,1);
  activeAreaIndex = 0;
  syncLocationsFromAreas();
  saveMeta();
  renderAreaSelect();
  renderCountedItemsList();
  renderInventoryStats();
  renderCatalogCards();
}
// Deshacer TODO el conteo de esta área por error — como el stock ya NO se suma al escanear
// (solo se suma al "Cerrar Entrada"), esto solo tiene que vaciar la lista, sin tocar stock.
function clearActiveCount(){
  const area = activeArea();
  const itemCount = Object.keys(area.counts||{}).length;
  if(!itemCount){ showToast('Esta área ya está vacía.'); return; }
  const pass = prompt('Vas a borrar TODO lo contado (sin sumar) en esta área.\nEscribí la clave de administrador para continuar:');
  if(pass === null){ showToast('Cancelado.'); return; }
  if(pass !== '1989'){ playErrorSound(); showToast('Clave incorrecta — no se borró nada.'); return; }
  if(!confirm('Esto borra TODO lo contado en esta área (todavía no se había sumado al inventario) y no se puede deshacer. ¿Continuar?')){ showToast('Cancelado.'); return; }
  if(!confirm('Última confirmación: se va a borrar TODO el conteo de esta área. ¿Seguro que querés continuar?')){ showToast('Cancelado.'); return; }
  area.counts = {};
  saveMeta();
  renderCountedItemsList();
  renderInventoryStats();
  showToast('Conteo de esta área borrado (no se había sumado nada al inventario todavía).');
}
// "Cerrar Entrada" del tramo: acá es donde recién se suma todo lo contado al stock real de
// una sola vez (como Recepción de mercancía) — hasta este momento, escanear solo iba
// contando sin tocar el inventario. Al terminar, el tramo queda vacío para el siguiente.
function closeAreaEntry(){
  const area = activeArea();
  const refs = Object.keys(area.counts||{}).filter(r=>area.counts[r]>0);
  if(!refs.length){ showToast('No hay nada contado en esta área todavía.'); return; }
  const totalQty = refs.reduce((s,r)=>s+(Number(area.counts[r])||0),0);
  if(!confirm(`Vas a cerrar esta entrada: se sumarán ${totalQty} unidad(es) de ${refs.length} artículo(s) al inventario y el tramo quedará vacío. ¿Continuar?`)) return;
  const items = refs.map(ref=>{ const p = PRODUCTS_BY_REF[ref]; const inv = getInv(ref); return {ref, title: p ? p.title : ref, location: inv.location || (area.tramo + '/' + area.estante), qty: Number(area.counts[ref])||0}; });
  refs.forEach(ref=>{
    const inv = getInv(ref);
    inv.stock = (Number(inv.stock)||0) + (Number(area.counts[ref])||0);
  });
  area.counts = {};
  const now = new Date();
  inventoryEntriesLog.unshift({date: now.toISOString(), user: currentUser ? currentUser.username : '—', area: area.tramo + '/' + area.estante, totalUnits: totalQty, items});
  inventoryEntriesLog = inventoryEntriesLog.slice(0, 200);
  try{ etDownloadBlob(etBuildAcomodoPdf({titulo:'Entrada de inventario — Lista de acomodo', subtitulo:`Tramo ${area.tramo} · Estante ${area.estante}`, usuario: currentUser ? currentUser.username : '', fecha: now, items}), `entrada_inventario_${etStamp(now)}.pdf`); }catch(e){ console.warn('PDF', e); }
  saveInventory();
  saveMeta();
  renderCountedItemsList();
  renderInventoryStats();
  renderCatalogCards();
  renderProducts();
  showToast(`Entrada cerrada: +${totalQty} unidad(es) sumadas al inventario. El tramo quedó vacío.`);
}
/* ---------- Sonidos (agregar / error) ---------- */
let audioCtx = null;
function getAudioCtx(){
  try{
    if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if(audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }catch(e){ return null; }
}
function playTone(freq, duration, type, startTime, gainPeak){
  const ctx = getAudioCtx();
  if(!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type || 'sine';
  osc.frequency.value = freq;
  osc.connect(gain);
  gain.connect(ctx.destination);
  const t0 = ctx.currentTime + (startTime||0);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.linearRampToValueAtTime(gainPeak||0.4, t0+0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0+duration);
  osc.start(t0);
  osc.stop(t0+duration+0.03);
}
function playAddSound(){
  // Sonido fuerte y claro de confirmación al agregar/sumar un artículo al inventario.
  playTone(880, 0.11, 'square', 0, 0.5);
  playTone(1318.5, 0.16, 'square', 0.09, 0.5);
}
function playErrorSound(){
  // Sonido grave y disonante, totalmente distinto al de agregar, para avisar un error.
  playTone(220, 0.22, 'sawtooth', 0, 0.45);
  playTone(155, 0.3, 'sawtooth', 0.16, 0.45);
}

function playLocationAlertSound(){
  // Alerta de "está en otra ubicación": tres campanadas sube-baja, distinta al de agregar (cuadrado) y al de error (grave)
  [0, 0.28, 0.56].forEach((t, i)=>{ playTone(1046.5, 0.13, 'triangle', t, 0.6); playTone(784, 0.16, 'triangle', t + 0.12, 0.6); });
}
/* ---------- varias ubicaciones por artículo ---------- */
function extraLocs(inv){ return Array.isArray(inv && inv.extraLocations) ? inv.extraLocations.filter(l=>l && l !== inv.location) : []; }
function allLocations(inv){ const out = []; if(inv && inv.location) out.push(inv.location); extraLocs(inv).forEach(l=>{ if(!out.includes(l)) out.push(l); }); return out; }
function allLocationsLabel(inv){ const l = allLocations(inv); return l.length ? l.map(formatLocationLabel).join('  ＋  ') : formatLocationLabel(''); }
// lugares donde ya está el artículo: sus ubicaciones + áreas donde está contado sin cerrar
function otherPlaces(ref, inv, here){
  const out = allLocations(inv).slice();
  countAreas.forEach(a=>{ const k = a.tramo + '/' + a.estante; if(a.tramo && a.estante && a.counts && Number(a.counts[ref]) > 0 && !out.includes(k)) out.push(k); });
  return out.includes(here) ? [] : out;
}
let pendingLocAlert = null;
function showLocationAlert(p, qty, area){
  const inv = getInv(p.ref); const here = area.tramo + '/' + area.estante;
  pendingLocAlert = {ref:p.ref, qty, here, code:p.ref};
  let ov = document.getElementById('locAlertOverlay');
  if(!ov){ ov = document.createElement('div'); ov.id = 'locAlertOverlay'; document.body.appendChild(ov); }
  const locs = otherPlaces(p.ref, inv, here);
  ov.innerHTML = `<div class="loc-alert-box">
      <div class="loc-alert-kick">⚠ ESTE ARTÍCULO VA EN OTRA UBICACIÓN</div>
      <div class="loc-alert-prod"><img src="${p.img||''}" alt="" onerror="this.style.opacity=.2"><div><b>${p.title}</b><small>SKU ${p.ref}</small></div></div>
      <div class="loc-alert-where">${locs.map(l=>`<div class="loc-alert-big">📍 ${formatLocationLabel(l)}</div>`).join('')}</div>
      <div class="loc-alert-here">Estás contando en: <b>${formatLocationLabel(here)}</b></div>
      <div class="loc-alert-btns">
        <button class="la-take" onclick="resolveLocationAlert('take')">📦 Lo llevo a su ubicación<small>no se cuenta aquí</small></button>
        <button class="la-both" onclick="resolveLocationAlert('both')">➕ Dejarlo aquí también<small>queda en las dos ubicaciones</small></button>
        <button class="la-move" onclick="resolveLocationAlert('move')">↪ Cambiarlo a esta ubicación<small>sale de la anterior</small></button>
      </div></div>`;
  ov.classList.add('is-open');
  playLocationAlertSound();
  setTimeout(()=>{ const b = ov.querySelector('.la-take'); if(b) b.focus(); }, 50);
}
function resolveLocationAlert(mode){
  const pa = pendingLocAlert; pendingLocAlert = null;
  const ov = document.getElementById('locAlertOverlay'); if(ov) ov.classList.remove('is-open');
  if(!pa) return;
  const inv = getInv(pa.ref); const p = PRODUCTS_BY_REF[pa.ref];
  if(mode === 'take'){ showToast(`Llévalo a ${allLocationsLabel(inv)} — ${p ? p.title : pa.ref}`); refocusScanInput(); return; }
  if(mode === 'both'){ if(!inv.location){ const prim = otherPlaces(pa.ref, inv, pa.here)[0]; if(prim) inv.location = prim; } inv.extraLocations = Array.from(new Set(extraLocs(inv).concat([pa.here]))); }
  if(mode === 'move'){ inv.location = pa.here; inv.extraLocations = extraLocs(inv).filter(l=>l !== pa.here); }
  registerScan(pa.code, pa.qty, true);
  refocusScanInput();
}
function refocusScanInput(){ const el = document.getElementById('scanInput') || document.querySelector('#inventoryOverlay input[type=text]'); if(el) setTimeout(()=>el.focus(), 30); }
document.addEventListener('keydown', e=>{ if(pendingLocAlert && e.key === 'Escape'){ e.preventDefault(); resolveLocationAlert('take'); } }, true);
function removeExtraLocation(ref, loc){
  const inv = getInv(ref); inv.extraLocations = extraLocs(inv).filter(l=>l !== loc);
  saveInventory(); renderArticleDetail(); renderProducts(); renderCatalogCards(); showToast('Ubicación quitada: ' + formatLocationLabel(loc));
}

/* ---------- Escaneo / registro ---------- */
// Escanear: el número se busca POR PRIORIDAD para no confundir artículos:
// 1) SKU  2) GTIN / GTIN extra  3) código Zebra  4) referencia original (solo si la tiene UN solo artículo)
let lastCodeAmbiguous = null;
function findProductByCode(code){
  const lc = String(code||'').trim().toLowerCase(); lastCodeAmbiguous = null;
  if(!lc) return null;
  const vis = visibleProducts();
  let p = vis.find(p => p.ref.toLowerCase() === lc); if(p) return p;
  p = vis.find(p => { const inv = getInv(p.ref); return (inv.gtin||'').toLowerCase() === lc || (p.gtin||'').toLowerCase() === lc || (Array.isArray(inv.altCodes) && inv.altCodes.some(c => String(c).toLowerCase() === lc)); }); if(p) return p;
  p = vis.find(p => internalCodes[p.ref] && internalCodes[p.ref].toLowerCase() === lc); if(p) return p;
  const oe = vis.filter(p => codeListHit(p.refsList, lc, true));
  if(oe.length === 1) return oe[0];
  if(oe.length > 1) lastCodeAmbiguous = oe;
  return null;
}
// Escanear en Inventario YA NO suma el stock al toque — solo se va contando en la lista de
// "esta área" (como Recepción de mercancía). El stock real recién se suma todo junto cuando
// se presiona "Cerrar Entrada", y ahí mismo la lista queda vacía para el próximo tramo.
function registerScan(code, qty, decided){
  qty = Number(qty)||1;
  if(pendingLocAlert && !decided){ playErrorSound(); showToast('Primero elige qué hacer con el artículo de la alerta de ubicación.'); return; }
  const p = findProductByCode(code);
  if(!p){ playErrorSound(); showToast(lastCodeAmbiguous ? `El número ${code} es referencia original de ${lastCodeAmbiguous.length} artículos (${lastCodeAmbiguous.slice(0,4).map(x=>x.ref).join(', ')}${lastCodeAmbiguous.length>4?'…':''}). Escanea el SKU o el GTIN.` : 'Código no encontrado en el catálogo: '+code); return; }
  const inv = getInv(p.ref);
  const area = activeArea();
  const here = area.tramo + '/' + area.estante;
  // ¿ya está en otro lugar? (ubicación guardada o contado pendiente en otra área) → alerta
  if(!decided && area.tramo && area.estante && !(Number(area.counts[p.ref]) > 0)){
    const otras = otherPlaces(p.ref, inv, here);
    if(otras.length){ showLocationAlert(p, qty, area); return; }
  }
  if(!inv.location && area.tramo && area.estante) inv.location = here;
  const esNuevoAqui = !(Number(area.counts[p.ref]) > 0);
  area.counts[p.ref] = (Number(area.counts[p.ref])||0) + qty;
  if(esNuevoAqui && etAutoPrintOn()) etPrintSku(p.ref, true);
  lastAddedRef = p.ref;
  scanHistory.unshift({time:new Date().toLocaleTimeString('es-DO',{hour:'2-digit',minute:'2-digit',second:'2-digit'}), ref:p.ref, title:p.title, stock:inv.stock, qty});
  scanHistory = scanHistory.slice(0,50);
  saveInventory();
  saveMeta();
  renderCatalogCards();
  renderProducts();
  renderCountedItemsList();
  renderInventoryStats();
  renderScanHistoryTable();
  playAddSound();
  showToast(`Contado — ${p.title} (${p.ref}) × ${area.counts[p.ref]} en este tramo (pendiente de "Cerrar Entrada")`);
}

/* ============================================================================
   RECEPCIÓN DE MERCANCÍA
   Bucle de escaneo continuo: cada código escaneado se agrega a receivingSession
   (en memoria + borrador local) sin tocar el stock todavía. Al presionar "Cerrar
   Entrada": se suma todo de una vez al inventario, se registra en el Kardex
   (receivingKardex, sincronizado como el resto de los datos) y se descarga un
   .xlsx de verificación agrupado por ubicación, con Costo y Precio Final en
   blanco para llenar a mano. El .xlsx se arma a mano (ZIP sin compresión +           XML mínimo de OOXML) para no depender de ninguna librería externa.
   ============================================================================ */

/* ---------- Generador de .xlsx sin librerías externas ---------- */
function xlsxCrc32(buf){
  let table = xlsxCrc32._t;
  if(!table){
    table = xlsxCrc32._t = new Uint32Array(256);
    for(let n=0;n<256;n++){
      let c = n;
      for(let k=0;k<8;k++){ c = (c&1) ? (0xEDB88320 ^ (c>>>1)) : (c>>>1); }
      table[n] = c>>>0;
    }
  }
  let crc = 0 ^ (-1);
  for(let i=0;i<buf.length;i++){ crc = (crc>>>8) ^ table[(crc ^ buf[i]) & 0xFF]; }
  return (crc ^ (-1)) >>> 0;
}
function xlsxU16(arr, off, val){ arr[off]=val&0xFF; arr[off+1]=(val>>>8)&0xFF; }
function xlsxU32(arr, off, val){ arr[off]=val&0xFF; arr[off+1]=(val>>>8)&0xFF; arr[off+2]=(val>>>16)&0xFF; arr[off+3]=(val>>>24)&0xFF; }
function xlsxBuildZip(files){
  const now = new Date();
  const dosTime = ((now.getHours()&0x1F)<<11) | ((now.getMinutes()&0x3F)<<5) | ((Math.floor(now.getSeconds()/2))&0x1F);
  const dosDate = (((now.getFullYear()-1980)&0x7F)<<9) | (((now.getMonth()+1)&0xF)<<5) | (now.getDate()&0x1F);
  const localParts = [], centralParts = [];
  let offset = 0;
  const enc = new TextEncoder();
  for(const f of files){
    const nameBytes = enc.encode(f.name);
    const data = f.data;
    const crc = xlsxCrc32(data);
    const local = new Uint8Array(30 + nameBytes.length);
    xlsxU32(local,0,0x04034b50); xlsxU16(local,4,20); xlsxU16(local,6,0); xlsxU16(local,8,0);
    xlsxU16(local,10,dosTime); xlsxU16(local,12,dosDate); xlsxU32(local,14,crc);
    xlsxU32(local,18,data.length); xlsxU32(local,22,data.length); xlsxU16(local,26,nameBytes.length); xlsxU16(local,28,0);
    local.set(nameBytes, 30);
    localParts.push(local, data);
    const central = new Uint8Array(46 + nameBytes.length);
    xlsxU32(central,0,0x02014b50); xlsxU16(central,4,20); xlsxU16(central,6,20); xlsxU16(central,8,0); xlsxU16(central,10,0);
    xlsxU16(central,12,dosTime); xlsxU16(central,14,dosDate); xlsxU32(central,16,crc);
    xlsxU32(central,20,data.length); xlsxU32(central,24,data.length); xlsxU16(central,28,nameBytes.length);
    xlsxU16(central,30,0); xlsxU16(central,32,0); xlsxU16(central,34,0); xlsxU16(central,36,0);
    xlsxU32(central,38,0); xlsxU32(central,42,offset);
    central.set(nameBytes, 46);
    centralParts.push(central);
    offset += local.length + data.length;
  }
  const centralStart = offset;
  let centralSize = 0; for(const c of centralParts) centralSize += c.length;
  const end = new Uint8Array(22);
  xlsxU32(end,0,0x06054b50); xlsxU16(end,4,0); xlsxU16(end,6,0);
  xlsxU16(end,8,files.length); xlsxU16(end,10,files.length);
  xlsxU32(end,12,centralSize); xlsxU32(end,16,centralStart); xlsxU16(end,20,0);
  const out = new Uint8Array(offset + centralSize + end.length);
  let pos = 0;
  for(const p of localParts){ out.set(p,pos); pos += p.length; }
  for(const c of centralParts){ out.set(c,pos); pos += c.length; }
  out.set(end,pos);
  return out;
}
function xlsxEsc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function xlsxColLetter(n){ let s=''; n++; while(n>0){ const m=(n-1)%26; s=String.fromCharCode(65+m)+s; n=Math.floor((n-1)/26); } return s; }
function xlsxBuildWorkbook(sheetName, headers, rows){
  const enc = new TextEncoder();
  let rowsXml = `<row r="1">` + headers.map((h,i)=>`<c r="${xlsxColLetter(i)}1" t="inlineStr" s="1"><is><t xml:space="preserve">${xlsxEsc(h)}</t></is></c>`).join('') + `</row>`;
  rows.forEach((row, ri)=>{
    const r = ri+2;
    rowsXml += `<row r="${r}">` + row.map((val,i)=>{
      const ref = `${xlsxColLetter(i)}${r}`;
      if(val===null || val===undefined || val==='') return `<c r="${ref}" t="inlineStr"><is><t xml:space="preserve"></t></is></c>`;
      if(typeof val==='number') return `<c r="${ref}"><v>${val}</v></c>`;
      return `<c r="${ref}" t="inlineStr"><is><t xml:space="preserve">${xlsxEsc(val)}</t></is></c>`;
    }).join('') + `</row>`;
  });
  const sheetXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${rowsXml}</sheetData></worksheet>`;
  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>`;
  const rootRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`;
  const workbookXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="${xlsxEsc(sheetName)}" sheetId="1" r:id="rId1"/></sheets></workbook>`;
  const workbookRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`;
  const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><sz val="10"/><name val="Calibri"/></font><font><b/><sz val="10"/><name val="Calibri"/></font></fonts><fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`;
  return xlsxBuildZip([
    {name:'[Content_Types].xml', data: enc.encode(contentTypes)},
    {name:'_rels/.rels', data: enc.encode(rootRels)},
    {name:'xl/workbook.xml', data: enc.encode(workbookXml)},
    {name:'xl/_rels/workbook.xml.rels', data: enc.encode(workbookRels)},
    {name:'xl/styles.xml', data: enc.encode(stylesXml)},
    {name:'xl/worksheets/sheet1.xml', data: enc.encode(sheetXml)}
  ]);
}
function downloadXlsxFile(bytes, filename){
  const blob = new Blob([bytes], {type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(()=>URL.revokeObjectURL(url), 4000);
}

/* ---------- Sesión de escaneo (Recepción) ---------- */
function openReceivingPanel(){
  if(!currentUser || currentUser.role!=='admin'){ pendingDeepLink = 'receiving'; openLogin(); return; }
  closeOrdersWindow();
  closeInventoryWindow();
  document.getElementById('receivingOverlay').classList.add('is-open');
  renderReceivingSession();
  renderReceivingKardex();
  focusReceivingInput();
}
function closeReceivingPanel(){
  const ov = document.getElementById('receivingOverlay');
  if(ov) ov.classList.remove('is-open');
}
function focusReceivingInput(){
  setTimeout(()=>{
    const el = document.getElementById('receivingScanInput');
    const ov = document.getElementById('receivingOverlay');
    if(el && ov && ov.classList.contains('is-open')) el.focus();
  }, 30);
}
// Foco persistente: si el cursor se sale de la casilla de escaneo hacia un lugar "neutro"
// (el fondo del panel, no otro campo/botón que el usuario quiso usar), lo regresa solo,
// para que el lector óptico pueda seguir leyendo sin tocar el mouse ni el teclado.
document.addEventListener('focusout', e=>{
  const ov = document.getElementById('receivingOverlay');
  if(!ov || !ov.classList.contains('is-open')) return;
  if(e.target && e.target.id !== 'receivingScanInput') return;
  setTimeout(()=>{
    const active = document.activeElement;
    const staysInPanel = active && ov.contains(active) && active.tagName!=='BODY';
    if(!staysInPanel) focusReceivingInput();
  }, 120);
});
function submitReceivingScan(code){
  code = (code||'').trim();
  if(!code) return;
  const el = document.getElementById('receivingScanInput');
  if(el) el.value = '';
  const p = findProductByCode(code);
  if(!p){
    playErrorSound();
    showToast(lastCodeAmbiguous ? `El número ${code} es referencia original de ${lastCodeAmbiguous.length} artículos (${lastCodeAmbiguous.slice(0,4).map(x=>x.ref).join(', ')}). Escanea el SKU o el GTIN.` : `Código no encontrado: "${code}" — agrégalo primero en Inventario.`);
    focusReceivingInput();
    return;
  }
  if(!receivingSession.length) receivingSessionStartedAt = new Date().toISOString(); // trigger inicial: primera lectura abre la sesión
  let row = receivingSession.find(r=>r.ref===p.ref);
  if(row){ row.qty = (Number(row.qty)||0) + 1; }
  else { row = {ref:p.ref, qty:1}; receivingSession.push(row); if(etAutoPrintOn()) etPrintSku(p.ref, true); }
  saveReceivingSessionDraft();
  renderReceivingSession();
  playAddSound();
  const inv = getInv(p.ref);
  showToast(`✔ ${p.title} (${p.ref}) × ${row.qty} — ${formatLocationLabel(inv.location)}`);
  focusReceivingInput();
}
function updateReceivingSessionQty(ref, value){
  const row = receivingSession.find(r=>r.ref===ref);
  if(!row) return;
  row.qty = Math.max(1, Number(value)||1);
  saveReceivingSessionDraft();
  renderReceivingSession();
}
function removeReceivingSessionItem(ref){
  receivingSession = receivingSession.filter(r=>r.ref!==ref);
  if(!receivingSession.length) receivingSessionStartedAt = null;
  saveReceivingSessionDraft();
  renderReceivingSession();
}
function receivingSessionRowsSorted(){
  // Agrupado y ordenado por Ubicación en Almacén, como pide la auditoría física.
  return receivingSession.map(row=>{
    const p = PRODUCTS_BY_REF[row.ref];
    const inv = getInv(row.ref);
    return {ref:row.ref, qty:row.qty, title:p?p.title:row.ref, location:inv.location||''};
  }).sort((a,b)=>{
    const la = formatLocationLabel(a.location), lb = formatLocationLabel(b.location);
    if(la!==lb) return la.localeCompare(lb, 'es');
    return a.title.localeCompare(b.title, 'es');
  });
}
function renderReceivingSession(){
  const wrap = document.getElementById('receivingItemsList');
  if(!wrap) return;
  const countEl = document.getElementById('receivingCount');
  const totalUnits = receivingSession.reduce((s,r)=>s+(Number(r.qty)||0),0);
  if(countEl) countEl.textContent = receivingSession.length ? `${receivingSession.length} artículo${receivingSession.length===1?'':'s'} · ${totalUnits} unidad${totalUnits===1?'':'es'}` : '';
  const closeBtn = document.getElementById('closeEntryBtn');
  if(closeBtn) closeBtn.disabled = !receivingSession.length;
  if(!receivingSession.length){
    wrap.innerHTML = '<div class="panel-empty">Escanea el primer artículo para iniciar la sesión de recepción.</div>';
    return;
  }
  const rows = receivingSessionRowsSorted();
  wrap.innerHTML = rows.map(row=>`<div class="inv-counted-row">
      <img src="${(PRODUCTS_BY_REF[row.ref]||{}).img||''}" alt="" onerror="this.style.opacity=.25" class="open-art" onclick="openArticleDetail('${row.ref}')" title="Abrir artículo (costo y precio)">
      <div class="inv-counted-info open-art" onclick="openArticleDetail('${row.ref}')" title="Abrir artículo (costo y precio)"><b>${row.title}</b><small>SKU ${row.ref} · 📍 ${formatLocationLabel(row.location)} · <span class="open-art-hint">✏️ costo / precio</span></small></div>
      <input type="number" min="1" class="recv-qty-input" value="${row.qty}" title="Cantidad" onchange="updateReceivingSessionQty('${row.ref}', this.value)">
      <button class="mini-btn mini-btn--del" onclick="removeReceivingSessionItem('${row.ref}')">🗑</button>
    </div>`).join('');
}

/* ---------- Cerrar Entrada: suma al inventario, registra Kardex y descarga el Excel ---------- */
function closeReceivingEntry(){
  if(!receivingSession.length){ showToast('Todavía no has escaneado ningún artículo.'); return; }
  const rows = receivingSessionRowsSorted();
  const totalUnits = rows.reduce((s,r)=>s+r.qty,0);
  if(!confirm(`Se van a sumar ${totalUnits} unidad(es) de ${rows.length} artículo(s) al inventario y se descargará el Excel de verificación. ¿Cerrar esta entrada?`)) return;

  const nowIso = new Date().toISOString();
  rows.forEach(row=>{
    const inv = getInv(row.ref);
    inv.stock = (Number(inv.stock)||0) + row.qty;
  });
  const kardexEntry = {
    date: nowIso,
    user: currentUser ? currentUser.username : '—',
    totalUnits,
    items: rows.map(r=>({ref:r.ref, title:r.title, location:r.location, qty:r.qty}))
  };
  receivingKardex.unshift(kardexEntry);
  receivingKardex = receivingKardex.slice(0, 200);

  saveInventory();
  saveMeta();
  renderCatalogCards();
  renderProducts();
  renderInventoryStats();

  downloadReceivingExcel(rows, nowIso);
  try{ etDownloadBlob(etBuildAcomodoPdf({titulo:'Recepción de mercancía — Lista de acomodo', usuario: currentUser ? currentUser.username : '', fecha: new Date(nowIso), items: rows}), `recepcion_acomodo_${etStamp(new Date(nowIso))}.pdf`); }catch(e){ console.warn('PDF', e); }

  receivingSession = [];
  receivingSessionStartedAt = null;
  clearReceivingSessionDraft();
  renderReceivingSession();
  renderReceivingKardex();
  showToast(`Entrada cerrada: +${totalUnits} unidades sumadas al inventario. Excel descargado.`);
}
function downloadReceivingExcel(rows, nowIso){
  const headers = ['Ubicación','Código de Artículo / Barcode','Descripción','Cantidad Escaneada','Costo','Precio Final'];
  const dataRows = rows.map(r=>[formatLocationLabel(r.location), r.ref, r.title, r.qty, null, null]);
  const bytes = xlsxBuildWorkbook('Recepción', headers, dataRows);
  const d = new Date(nowIso);
  const stamp = d.toISOString().slice(0,16).replace(/[:T]/g,'-');
  downloadXlsxFile(bytes, `recepcion_mercancia_${stamp}.xlsx`);
}
function renderReceivingKardex(){
  const wrap = document.getElementById('receivingKardexList');
  if(!wrap) return;
  if(!receivingKardex.length){
    wrap.innerHTML = '<div class="panel-empty">Aún no hay entradas cerradas.</div>';
    return;
  }
  wrap.innerHTML = receivingKardex.slice(0,20).map((k,i)=>{
    const d = new Date(k.date);
    const fecha = isNaN(d) ? k.date : d.toLocaleString('es-DO',{dateStyle:'short', timeStyle:'short'});
    return `<div class="inv-counted-row">
      <div class="inv-counted-info"><b>${fecha}</b><small>${k.user} · ${k.items.length} artículo${k.items.length===1?'':'s'} · ${k.totalUnits} unidades</small></div>
      <button class="mini-btn" onclick='redownloadKardex(${i})'>⬇ Excel</button>
    </div>`;
  }).join('');
}
function redownloadKardex(index){
  const k = receivingKardex[index];
  if(!k) return;
  const rows = k.items.slice().sort((a,b)=>{
    const la = formatLocationLabel(a.location), lb = formatLocationLabel(b.location);
    if(la!==lb) return la.localeCompare(lb,'es');
    return a.title.localeCompare(b.title,'es');
  });
  downloadReceivingExcel(rows, k.date);
}

function renderCountedItemsList(){
  const wrap = document.getElementById('countedItemsList');
  if(!wrap) return;
  // si se está escribiendo una cantidad, no redibujar (se perdería lo escrito); se redibuja al salir
  const act = document.activeElement;
  if(act && act.classList && act.classList.contains('inv-set-qty') && wrap.contains(act)){ wrap.dataset.pending = '1'; return; }
  wrap.dataset.pending = '';
  const area = activeArea();
  const refs = Object.keys(area.counts).filter(r=>area.counts[r]>0);
  const tag = document.getElementById('areaCountedTag');
  const closeBtn = document.getElementById('closeAreaEntryBtn');
  if(closeBtn) closeBtn.disabled = !refs.length;
  if(!refs.length){
    if(tag) tag.textContent = '';
    wrap.innerHTML = '<div class="panel-empty">Aún no has contado artículos en esta área.</div>';
    return;
  }
  if(tag){ const totalQty = refs.reduce((s,r)=>s+(Number(area.counts[r])||0),0); tag.textContent = `· ${refs.length} artículo${refs.length===1?'':'s'} · ${totalQty} unidad${totalQty===1?'':'es'}`; }
  wrap.innerHTML = refs.map(ref=>{
    const p = PRODUCTS_BY_REF[ref];
    const qty = area.counts[ref];
    return `<div class="inv-counted-row${ref===lastAddedRef?' is-new-scan':''}">
      <img src="${p?p.img:''}" alt="" onerror="this.style.opacity=.25" class="open-art" onclick="openArticleDetail('${ref}')" title="Abrir artículo (costo y precio)">
      <div class="inv-counted-info open-art" onclick="openArticleDetail('${ref}')" title="Abrir artículo (costo y precio)"><b>${p?p.title:ref}</b><small>SKU ${ref} · <span class="open-art-hint">✏️ costo / precio</span></small></div>
      <span class="inv-counted-qty" id="cntlbl-${ref}">${qty} contados</span>
      <input type="number" min="0" step="1" value="${qty}" class="inv-remove-qty inv-set-qty" title="Cantidad contada: escribe el número y se guarda solo" oninput="scheduleSetCountQty('${ref}', this)" onchange="setCountQty('${ref}', this.value, true)" onblur="setCountQty('${ref}', this.value, true)">
      <button class="mini-btn mini-btn--del" onclick="removeFromCount('${ref}', ${qty})">🗑 Eliminar</button>
    </div>`;
  }).join('');
}
let lowStockPage = 0;
const LOW_STOCK_PAGE_SIZE = 60;
function renderLowStockList(){
  const wrap = document.getElementById('lowStockList');
  if(!wrap) return;
  const list = computeLowStockList();
  if(!list.length){
    wrap.innerHTML = '<div class="panel-empty">Sin artículos por debajo del mínimo.</div>';
    const pagEmpty = document.getElementById('lowStockPagination');
    if(pagEmpty) pagEmpty.innerHTML = '';
    return;
  }
  // Con TODO el catálogo en 0 incluido, esta lista puede tener decenas de miles
  // de artículos — se pagina igual que el catálogo completo para no crear de
  // golpe miles de tarjetas en la página (eso sí congelaría el navegador).
  const totalPages = Math.max(1, Math.ceil(list.length / LOW_STOCK_PAGE_SIZE));
  if(lowStockPage >= totalPages) lowStockPage = totalPages-1;
  if(lowStockPage < 0) lowStockPage = 0;
  const startIdx = lowStockPage * LOW_STOCK_PAGE_SIZE;
  const pageList = list.slice(startIdx, startIdx + LOW_STOCK_PAGE_SIZE);

  wrap.innerHTML = pageList.map(p=>{
    const inv = peekInv(p.ref);
    const stock = Number(inv.stock)||0;
    const sold = Number(inv.sold)||0;
    return `<div class="inv-counted-row is-low-stock">
      <img src="${p.img||''}" alt="" onerror="this.style.opacity=.25">
      <div class="inv-counted-info"><b>${p.title}</b><small>SKU ${p.ref}${sold>0?` · ${sold} vendidas`:''}</small></div>
      <span class="inv-lowstock-badge">BAJO STOCK</span>
      <span class="inv-counted-qty">${stock} disp.</span>
    </div>`;
  }).join('');

  const pag = document.getElementById('lowStockPagination');
  if(pag){
    const showingFrom = list.length ? startIdx+1 : 0;
    const showingTo = Math.min(startIdx+LOW_STOCK_PAGE_SIZE, list.length);
    pag.innerHTML = `
      <span>Mostrando ${showingFrom}-${showingTo} de ${list.length.toLocaleString('es-DO')}</span>
      <div class="inv-pagination-controls">
        <button class="mini-btn" ${lowStockPage<=0?'disabled':''} onclick="changeLowStockPage(-1)">‹ Anterior</button>
        <span>Página ${lowStockPage+1} / ${totalPages}</span>
        <button class="mini-btn" ${lowStockPage>=totalPages-1?'disabled':''} onclick="changeLowStockPage(1)">Siguiente ›</button>
      </div>`;
  }
}
function changeLowStockPage(delta){
  lowStockPage += delta;
  renderLowStockList();
  const wrap = document.getElementById('lowStockList');
  if(wrap) wrap.scrollIntoView({behavior:'smooth', block:'start'});
}
/* La cantidad escrita en la lista de contados ES la cantidad contada (se guarda sola al dejar de escribir). */
const _setQtyTimers = {};
function scheduleSetCountQty(ref, el){
  clearTimeout(_setQtyTimers[ref]);
  _setQtyTimers[ref] = setTimeout(()=> setCountQty(ref, el.value, false), 800);
}
function setCountQty(ref, value, rerender){
  clearTimeout(_setQtyTimers[ref]);
  if(String(value).trim() === '') return;           // casilla vacía: esperar a que escriba
  const n = Math.max(0, Math.floor(Number(value)));
  if(!isFinite(n)) return;
  const area = activeArea();
  const have = Number(area.counts[ref])||0;
  if(n !== have){
    if(n === 0) delete area.counts[ref]; else area.counts[ref] = n;
    saveMeta();
    renderInventoryStats();
    const lbl = document.getElementById('cntlbl-'+ref);
    if(lbl) lbl.textContent = n + ' contados';
    const tag = document.getElementById('areaCountedTag');
    if(tag){ const refs = Object.keys(area.counts).filter(r=>area.counts[r]>0); const t = refs.reduce((s,r)=>s+(Number(area.counts[r])||0),0); tag.textContent = refs.length ? `· ${refs.length} artículo${refs.length===1?'':'s'} · ${t} unidad${t===1?'':'es'}` : ''; }
    const p = PRODUCTS_BY_REF[ref];
    showToast(n === 0 ? `${p?p.title:ref} quitado del conteo.` : `Cantidad contada de ${p?p.title:ref}: ${n}`);
  }
  if(rerender || n === 0) setTimeout(renderCountedItemsList, 0);   // se redibuja al salir de la casilla
}
function removeFromCount(ref, qtyToRemove){
  const area = activeArea();
  const have = Number(area.counts[ref])||0;
  const remove = Math.max(1, Math.min(Number(qtyToRemove)||1, have));
  area.counts[ref] = have - remove;
  if(area.counts[ref] <= 0) delete area.counts[ref];
  // El stock todavía no se había sumado (eso pasa recién al "Cerrar Entrada"), así que acá
  // solo se corrige la cantidad contada — no hay nada que descontar del inventario real.
  saveMeta();
  renderCountedItemsList();
  renderInventoryStats();
  showToast(`Se quitaron ${remove} unidad(es) del conteo (todavía no sumadas al inventario).`);
}

/* ---------- Salida por venta (descuenta stock) ---------- */
function deductStockForSale(code, qty){
  const p = findProductByCode(code);
  if(!p){ playErrorSound(); showToast('Código no encontrado: '+code); return null; }
  const inv = getInv(p.ref);
  const finalQty = Math.min(qty, Number(inv.stock)||0);
  if(finalQty<=0){ playErrorSound(); showToast('Ese artículo no tiene stock disponible.'); return null; }
  inv.stock = Math.max(0, (Number(inv.stock)||0) - finalQty);
  inv.sold = (Number(inv.sold)||0) + finalQty;
  salesLog.unshift({ref:p.ref, title:p.title, qty:finalQty, date:new Date().toISOString()});
  salesLog = salesLog.slice(0,1000);
  saveInventory();
  saveMeta();
  renderProducts();
  if(document.getElementById('inventoryOverlay') && document.getElementById('inventoryOverlay').classList.contains('is-open')){
    renderCatalogCards();
    renderInventoryStats();
    renderTopSellers();
  }
  return {p, inv, finalQty};
}
function registerSalida(){
  if(!currentUser || currentUser.role!=='admin'){ playErrorSound(); showToast('Solo un administrador puede registrar la salida.'); return; }
  const skuEl = document.getElementById('salidaSkuInput');
  const qtyEl = document.getElementById('salidaQtyInput');
  const code = skuEl.value.trim();
  const qty = Number(qtyEl.value)||1;
  if(!code) return;
  const result = deductStockForSale(code, qty);
  if(!result) return;
  skuEl.value = '';
  qtyEl.value = 1;
  showToast(`Salida registrada: -${result.finalQty} — ${result.p.title} → ${result.inv.stock} disp.${lowStockSuffix(result.inv)}`);
}
function quickSaleFromBar(){
  if(!canQuickSale()) return;
  const codeEl = document.getElementById('quickSaleScanInput');
  const qtyEl = document.getElementById('quickSaleQtyInput');
  if(!codeEl) return;
  const code = (codeEl.value||'').trim();
  if(!code) return;
  const qty = Number(qtyEl.value)||1;
  const result = deductStockForSale(code, qty);
  codeEl.value = '';
  codeEl.focus();
  if(!result) return;
  playAddSound();
  showToast(`Venta registrada: -${result.finalQty} — ${result.p.title} → ${result.inv.stock} disp.${lowStockSuffix(result.inv)}`);
}

/* ---------- Estadísticas ---------- */
function lowStockSuffix(inv){
  const stock = Number(inv.stock)||0;
  if(stock >= LOW_STOCK_THRESHOLD) return '';
  const sold = Number(inv.sold)||0;
  return ` ⚠ Stock bajo${sold>0 ? ` (${sold} vendidas — alta rotación)` : ''}`;
}
function computeLowStockList(){
  // "Pedido bajo stock" incluye: (a) artículos ya contados/movidos con menos de
  // LOW_STOCK_THRESHOLD en existencia, y (b) TODO el resto del catálogo que nunca
  // se ha contado — como nunca se tocaron, su stock es 0 por defecto, así que
  // también están "en 0". Se usa peekInv/lectura directa (no getInv) para no
  // crear sin querer un registro de inventario para los ~42,000 artículos del
  // catálogo solo por listarlos acá.
  return visibleProducts()
    .filter(p => {
      const row = inventoryState[p.ref];
      if(!row) return true; // nunca contado → 0 por defecto → cuenta como "en 0"
      return (Number(row.stock)||0) < LOW_STOCK_THRESHOLD;
    })
    .sort((a,b) => (Number(peekInv(b.ref).sold)||0) - (Number(peekInv(a.ref).sold)||0));
}
function renderInventoryStats(){
  const area = activeArea();
  const countedEl = document.getElementById('statCountedItems');
  if(countedEl) countedEl.textContent = Object.keys(area.counts).filter(r=>area.counts[r]>0).length;
  const unidadesEl = document.getElementById('statUnidadesAlmacen');
  if(unidadesEl){
    const total = Object.values(inventoryState).reduce((s,inv)=>s+(Number(inv.stock)||0),0);
    unidadesEl.textContent = total.toLocaleString('es-DO');
  }
  const lowStockEl = document.getElementById('statLowStock');
  if(lowStockEl) lowStockEl.textContent = computeLowStockList().length;
  const areaEl = document.getElementById('statAreaActiva');
  if(areaEl) areaEl.textContent = `${activeAreaIndex+1} / ${countAreas.length}`;
  renderLowStockList();
}

/* ---------- Catálogo completo (tarjetas paginadas) ---------- */
function formatLocationLabel(loc){
  if(!loc) return 'Ubicación pendiente';
  if(/^[^/]+\/[^/]+$/.test(loc)){
    const [tramo, estante] = loc.split('/');
    return `Tramo ${tramo} · Estante ${estante}`;
  }
  return loc;
}
function renderCatalogCards(){
  const wrap = document.getElementById('inventoryCardList');
  if(!wrap) return;
  const q = invSearchTerm;
  const all = visibleProducts();
  // No usar getInv() acá: crearía un registro de inventario para los ~42,000 artículos del
  // catálogo solo por leerlos, lo que después haría que "Pedido bajo stock" los liste a todos.
  const withGtinCount = all.filter(p => (p.gtin || (inventoryState[p.ref] && inventoryState[p.ref].gtin))).length;
  const countLine = document.getElementById('catalogCountLine');
  if(countLine) countLine.textContent = `${all.length.toLocaleString('es-DO')} artículos disponibles · ${withGtinCount.toLocaleString('es-DO')} con GTIN`;

  const _nq = normSku(q);
  const fullList = sortBySearch(all.filter(p=>{
    if(!q) return true;
    if(_nq.length >= 2 && normSku(p.ref).includes(_nq)) return true;
    const inv = peekInv(p.ref);
    if(p.title.toLowerCase().includes(q) || p.ref.toLowerCase().includes(q) ||
      (inv.gtin||'').toLowerCase().includes(q) || (p.gtin||'').toLowerCase().includes(q) ||
      (p.brand||'').toLowerCase().includes(q) || (p.applications||'').toLowerCase().includes(q)) return true;
    if(Array.isArray(inv.altCodes) && inv.altCodes.some(c=>String(c).toLowerCase().includes(q))) return true;
    if(internalCodes[p.ref] && internalCodes[p.ref].toLowerCase().includes(q)) return true;
    if(codeListHit(p.refsList, q, false)) return true;
    return false;
  }), q);

  const totalPages = Math.max(1, Math.ceil(fullList.length / INV_PAGE_SIZE));
  if(invPage >= totalPages) invPage = totalPages-1;
  if(invPage < 0) invPage = 0;
  const startIdx = invPage * INV_PAGE_SIZE;
  const pageList = fullList.slice(startIdx, startIdx + INV_PAGE_SIZE);

  wrap.innerHTML = pageList.map(p=>{
    const inv = getInv(p.ref);
    const gtins = [...new Set([p.gtin, inv.gtin, ...(Array.isArray(inv.altCodes)?inv.altCodes:[])].filter(Boolean))];
    const barras = gtins[0] || '';
    const status = (Number(inv.stock)||0) > 0 ? 'Contado' : 'Pendiente';
    return `<div class="inv-article-card">
      <div class="inv-article-main" onclick="openArticleDetail('${p.ref}')">
        <div class="inv-article-thumb"><img src="${p.img}" alt="" onerror="this.style.opacity=.25"></div>
        <div class="inv-article-body">
          <div class="inv-article-top">
            <b class="inv-article-sku">${p.sku}</b>
            <span class="inv-zebra">Zebra ${getInternalCode(p.ref)}</span>
          </div>
          ${barras ? `<div class="inv-barras">Barras ${barras}</div>` : ''}
          ${gtins.length ? `<div class="inv-gtin-row">${gtins.map(g=>`<span class="gtin-chip">GTIN ${escH(g)}</span>`).join('')}</div>` : ''}
          <div class="inv-loc-tag">📍 ${allLocationsLabel(inv)}</div>
          <div class="inv-article-title">${p.title}</div>
          <div class="inv-article-brand">${MARCA_FIJA} · ${p.brand}</div>
        </div>
        <span class="status-badge status-${status.toLowerCase()}">${status}</span>
      </div>
    </div>`;
  }).join('') || `<div class="panel-empty">Sin resultados para esa búsqueda.</div>`;

  const pag = document.getElementById('invPagination');
  if(pag){
    const showingFrom = fullList.length ? startIdx+1 : 0;
    const showingTo = Math.min(startIdx+INV_PAGE_SIZE, fullList.length);
    pag.innerHTML = `
      <span>Mostrando ${showingFrom}-${showingTo} de ${fullList.length.toLocaleString('es-DO')}</span>
      <div class="inv-pagination-controls">
        <button class="mini-btn" ${invPage<=0?'disabled':''} onclick="changeInvPage(-1)">‹ Anterior</button>
        <span>Página ${invPage+1} / ${totalPages}</span>
        <button class="mini-btn" ${invPage>=totalPages-1?'disabled':''} onclick="changeInvPage(1)">Siguiente ›</button>
      </div>`;
  }
}
function changeInvPage(delta){
  invPage += delta;
  renderCatalogCards();
  const wrap = document.getElementById('inventoryCardList');
  if(wrap) wrap.scrollIntoView({behavior:'smooth', block:'start'});
}
function updateInvField(ref, field, value){
  const inv = getInv(ref);
  inv[field] = (field==='stock'||field==='cost'||field==='price') ? (value===''?'':Number(value)) : value;
  saveInventory();
  renderProducts();
  if(document.getElementById('inventoryOverlay').classList.contains('is-open')){
    renderCatalogCards();
    renderInventoryStats();
  }
}
function deleteArticle(ref){
  if(!deletedRefs.includes(ref)) deletedRefs.push(ref);
  countAreas.forEach(area=>{ if(area.counts && area.counts[ref]!==undefined) delete area.counts[ref]; });
  const row = inventoryState[ref];
  if(row && row.product){
    // artículo creado por ustedes: se borra el registro completo (en todas las PC)
    delete inventoryState[ref];
    const i = products.findIndex(p=>p.ref===ref); if(i>=0) products.splice(i,1);
    delete PRODUCTS_BY_REF[ref];
  } else if(row) row.stock = 0;
  saveInventory();
  saveMeta();
  renderCatalogCards();
  renderProducts();
  renderInventoryStats();
  renderCountedItemsList();
  showToast('Artículo eliminado del inventario y del catálogo.');
}
/* ---------- Agregar artículo nuevo (formulario completo) ---------- */
let newArticleImageData = '';
function openAddArticleForm(){
  newArticleImageData = '';
  renderAddArticleForm();
  document.getElementById('addArticleOverlay').classList.add('is-open');
  setTimeout(()=>{ ['newArtGtinList','newArtOeList'].forEach((id,i)=>{ const l = document.getElementById(id); if(l && !l.children.length) addMultiCodeRow(id, i ? 'oe' : 'gtin'); }); }, 0);
  setTimeout(()=>{ const el = document.getElementById('newArtRef'); if(el) el.focus(); }, 50);
}
function closeAddArticleForm(){
  const ov = document.getElementById('addArticleOverlay');
  if(ov) ov.classList.remove('is-open');
}
function renderAddArticleForm(){
  const content = document.getElementById('addArticleContent');
  if(!content) return;
  const area = activeArea();
  content.innerHTML = `
    <button class="modal-close" onclick="closeAddArticleForm()" aria-label="Cerrar">✕</button>
    <span class="art-sku-chip">Nuevo artículo</span>
    <h3 style="margin:6px 0 4px;">Agregar artículo al catálogo</h3>
    <p class="art-section-sub" style="margin-bottom:16px;">Completá los mismos datos que tiene cualquier artículo del catálogo. La referencia/SKU no se puede repetir.</p>

    <div class="art-section">
      <div class="art-section-kicker">Copiar desde una página de origen (opcional)</div>
      <label style="display:flex;flex-direction:column;gap:5px;color:#8b96ab;font:700 .6rem var(--technical);letter-spacing:.06em;text-transform:uppercase;margin:0 0 6px;">Pegar el texto copiado de la página (por ejemplo, del portal de Diesel Technic)
        <textarea id="newArtPasteText" rows="5" placeholder="Seleccioná todo el texto de la ficha del artículo en la página de origen (nombre, GTIN, Reemplaza a...) y pegalo acá" style="padding:8px 10px;color:#c1d8ff;font-size:.78rem;background:#0d1a30;border:1px solid rgba(255,255,255,.08);border-radius:6px;font-family:inherit;resize:vertical;"></textarea>
      </label>
      <div class="art-price-row" style="margin-bottom:4px;">
        <button type="button" class="mini-btn mini-btn--wa" onclick="fillArticleFromPastedText()">Rellenar con el texto pegado</button>
      </div>
    </div>

    <div class="art-section">
      <div class="art-section-kicker">Datos del artículo</div>
      <div class="art-price-row" style="margin-bottom:12px;">
        <label>Referencia / SKU *<input type="text" id="newArtRef" placeholder="Ej. 1.00999"></label>

      </div>
      <div class="art-section-kicker" style="margin-top:4px">GTIN / códigos de barras <small style="text-transform:none;letter-spacing:0;color:#8b96ab">— uno por casilla; al escanear cualquiera aparece este artículo</small></div>
      <div id="newArtGtinList" class="multi-code-list"></div>
      <button type="button" class="mini-btn" style="margin:2px 0 12px" onclick="addMultiCodeRow('newArtGtinList','gtin')">＋ Otro GTIN</button>
      <div class="art-section-kicker">Referencia o artículo original <small style="text-transform:none;letter-spacing:0;color:#8b96ab">— número OE / del fabricante; uno por casilla (ej. Volvo 20514235)</small></div>
      <div id="newArtOeList" class="multi-code-list"></div>
      <button type="button" class="mini-btn" style="margin:2px 0 12px" onclick="addMultiCodeRow('newArtOeList','oe')">＋ Otra referencia original</button>
      <div class="art-price-row" style="margin-bottom:12px;">
        <label style="flex:2;min-width:220px;">Nombre del artículo *<input type="text" id="newArtTitle" placeholder="Ej. Filtro de aceite"></label>
        <label>Marca<input type="text" id="newArtBrand" placeholder="Ej. Scania" value="DT Spare Parts"></label>
      </div>
      <div class="art-price-row" style="margin-bottom:12px;">
        <label>Categoría<input type="text" id="newArtCat" placeholder="Ej. Filtros" value="Repuesto"></label>
        <label style="flex:2;min-width:220px;">Aplicaciones / vehículos<input type="text" id="newArtApps" placeholder="Ej. Scania R-series, Volvo FH"></label>
      </div>
      <label style="display:flex;flex-direction:column;gap:5px;color:#8b96ab;font:700 .6rem var(--technical);letter-spacing:.06em;text-transform:uppercase;margin-bottom:8px;">Foto del artículo — subir archivo (opcional)
        <input type="file" id="newArtImageFile" accept="image/*" onchange="handleNewArticleImage(event)" style="padding:8px 0;color:#c1d8ff;font-size:.78rem;">
      </label>
      <label style="display:flex;flex-direction:column;gap:5px;color:#8b96ab;font:700 .6rem var(--technical);letter-spacing:.06em;text-transform:uppercase;margin-bottom:8px;">Foto del artículo — o pegar URL de la imagen (opcional)
        <input type="text" id="newArtImageUrl" placeholder="https://..." oninput="handleNewArticleImageUrl(this.value)" style="padding:8px 10px;color:#c1d8ff;font-size:.78rem;background:#0d1a30;border:1px solid rgba(255,255,255,.08);border-radius:6px;">
      </label>
      <div id="newArtImagePreviewWrap"></div>
    </div>

    <div class="art-section">
      <div class="art-section-kicker">Inventario inicial</div>
      <div class="art-price-row" style="margin-bottom:12px;">
        <label>Stock inicial<input type="number" min="0" id="newArtStock" value="0"></label>
        <label>Tramo<input type="text" id="newArtTramo" value="${area.tramo||''}"></label>
        <label>Estante<input type="text" id="newArtEstante" value="${area.estante||''}"></label>
      </div>
      <div class="art-price-row">
        ${canSeeCost() ? `<label>Costo<input type="number" min="0" step="0.01" id="newArtCost"></label>` : ''}
        <label>Precio final<input type="number" min="0" step="0.01" id="newArtPrice"></label>
        <label>Dólares<input type="number" min="0" step="0.01" id="newArtDolares" oninput="convertNewArtDolares()" placeholder="US$"></label>
      </div>
    </div>

    <div class="art-actions-row">
      <button class="mini-btn mini-btn--wa" onclick="submitNewArticle()">Guardar artículo</button>
      <button class="mini-btn" onclick="closeAddArticleForm()">Cancelar</button>
    </div>
  `;
}
function handleNewArticleImage(evt){
  const file = evt.target.files && evt.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = function(){
    newArticleImageData = reader.result;
    const wrap = document.getElementById('newArtImagePreviewWrap');
    if(wrap) wrap.innerHTML = `<img src="${newArticleImageData}" alt="" style="width:90px;height:90px;object-fit:contain;background:#0d1a30;border-radius:8px;padding:6px;">`;
  };
  reader.readAsDataURL(file);
}
async function handleNewArticleImageUrl(url){
  url = (url||'').trim();
  if(!url) return;
  const wrap = document.getElementById('newArtImagePreviewWrap');
  // Mostrar vista previa inmediata mientras se descarga y se guarda como las demás fotos del sistema.
  if(wrap) wrap.innerHTML = `<img src="${url}" alt="" onerror="this.style.opacity=.25" style="width:90px;height:90px;object-fit:contain;background:#0d1a30;border-radius:8px;padding:6px;"><small style="display:block;color:#8b96ab;font-size:.65rem;margin-top:4px;">Guardando foto…</small>`;
  try{
    const resp = await fetch(url, {mode:'cors'});
    if(!resp.ok) throw new Error('HTTP '+resp.status);
    const blob = await resp.blob();
    const dataUrl = await new Promise((resolve, reject)=>{
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
    newArticleImageData = dataUrl;
    if(wrap) wrap.innerHTML = `<img src="${dataUrl}" alt="" style="width:90px;height:90px;object-fit:contain;background:#0d1a30;border-radius:8px;padding:6px;">`;
  }catch(err){
    // El sitio bloquea la descarga automática (CORS): se deja el enlace directo como respaldo.
    newArticleImageData = url;
    if(wrap) wrap.innerHTML += '<small style="display:block;color:#ff9aa6;font-size:.65rem;margin-top:4px;">No se pudo copiar la foto automáticamente — se usará el enlace directo.</small>';
  }
}
/* ---- GTIN / código de barras: se acepta CUALQUIER formato (números, letras, guiones, apóstrofo… ej. QA'2038M) ---- */
function validGtin(c){ c = String(c||'').trim(); return c.length >= 1 && c.length <= 60 && !/[\u0000-\u001f<>"`]/.test(c); }
const escH = x => String(x == null ? '' : x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
/* ---- casillas individuales de GTIN y referencias originales ---- */
function addMultiCodeRow(listId, kind, value){
  const list = document.getElementById(listId); if(!list) return null;
  const row = document.createElement('div'); row.className = 'multi-code-row';
  const ph = kind === 'gtin' ? "GTIN / código de barras (cualquier formato, ej. 4057795373433 ó QA'2038M)" : 'Ej. Volvo 20514235  ó  20514235';
  row.innerHTML = `<input type="text" class="multi-code-input" data-kind="${kind}" placeholder="${ph}" >`
    + (kind === 'gtin' ? `<button type="button" class="scan-camera-btn" title="Escanear con la cámara">📷</button>` : '')
    + `<button type="button" class="mini-btn mini-btn--del" title="Quitar">✕</button>`;
  const inp = row.querySelector('input'); inp.value = value || '';
  const cam = row.querySelector('.scan-camera-btn'); if(cam) cam.onclick = ()=> openBarcodeScanner(code=>{ inp.value = code; closeBarcodeScanner(); });
  row.querySelector('.mini-btn--del').onclick = ()=>{ if(list.children.length > 1) row.remove(); else inp.value = ''; };
  // pegar varios códigos juntos: cada uno va a su propia casilla
  inp.addEventListener('paste', e=>{ const t = (e.clipboardData||window.clipboardData).getData('text'); const parts = splitCodes(t, kind); if(parts.length > 1){ e.preventDefault(); inp.value = parts[0]; parts.slice(1).forEach(v=>addMultiCodeRow(listId, kind, v)); } });
  inp.addEventListener('keydown', e=>{ if(e.key === 'Enter'){ e.preventDefault(); const r = addMultiCodeRow(listId, kind); if(r) r.querySelector('input').focus(); } });
  list.appendChild(row); return row;
}
function splitCodes(text, kind){
  text = String(text||'').trim(); if(!text) return [];
  const parts = kind === 'gtin' ? text.split(/[|,;\s]+/) : text.split(/[|,;\n]+/);
  return Array.from(new Set(parts.map(x=>x.trim()).filter(Boolean)));
}
function readMultiCodes(listId){
  const list = document.getElementById(listId); if(!list) return [];
  const out = []; list.querySelectorAll('input').forEach(i=>{ const v = i.value.trim().replace(/\s{2,}/g,' '); if(v && !out.some(x=>x.toLowerCase()===v.toLowerCase())) out.push(v); });
  return out;
}
function setMultiCodes(listId, kind, values){
  const list = document.getElementById(listId); if(!list) return;
  const cur = readMultiCodes(listId); const all = cur.concat((values||[]).filter(v=>!cur.some(c=>c.toLowerCase()===String(v).toLowerCase())));
  list.innerHTML = ''; (all.length ? all : ['']).forEach(v=>addMultiCodeRow(listId, kind, v));
}
// compara códigos sin importar espacios, puntos ni guiones ("205 142 35" = "20514235")
const normCode = c => String(c||'').toLowerCase().replace(/[\s.\-\/]/g,'');
// "Volvo 205 142 35" -> "20514235" (quita la marca de adelante)
const stripBrand = c => { const t = String(c||'').toLowerCase().trim(); const i = t.indexOf(':'); if(i > 0 && /^[a-zà-ÿ&'.\s-]+$/.test(t.slice(0, i))) return t.slice(i + 1).trim(); return t.replace(/^[a-zà-ÿ&'.\s-]+?\s+(?=[0-9a-z]*\d)/,''); };
function codeListHit(list, q, exact){
  if(!Array.isArray(list) || !list.length) return false;
  const nq = normCode(q);
  return list.some(r=>{ const s = String(r).toLowerCase(); if(exact){ if(s === q) return true; const parts = s.split(/\s+/); return normCode(s) === nq || (nq.length >= 5 && (normCode(parts[parts.length-1]) === nq || normCode(stripBrand(s)) === nq)); }
    return s.includes(q) || (nq.length >= 3 && normCode(s).includes(nq)); });
}
function parsePastedArticleText(fullText){
  const result = {ref:'', title:'', brand:'', gtins:[], crossRefs:[]};
  const refMatch = fullText.match(/\b(\d{1,3}\.\d{4,6})\b\s*([^\n]*)/);
  if(refMatch){
    result.ref = refMatch[1];
    result.title = (refMatch[2]||'').trim();
  }
  const brandMatch = fullText.match(/^[ \t]*([A-Za-zÀ-ÿ ]{2,30}?)[ \t]*\d{1,3}\.\d{4,6}/m);
  if(brandMatch) result.brand = brandMatch[1].trim();
  const refDigits = result.ref.replace('.', '');
  const crossIdx = fullText.search(/Reemplaza a/i);
  // los GTIN se toman solo de la parte de arriba (antes de "Reemplaza a"), para no mezclar números de otras marcas
  const gtinPart = crossIdx >= 0 ? fullText.slice(0, crossIdx) : fullText;
  result.gtins = Array.from(new Set((gtinPart.match(/\b\d{8,14}\b/g)||[]))).filter(n => n !== refDigits);
  if(crossIdx >= 0){
    const lines = fullText.slice(crossIdx).split('\n').map(l=>l.trim()).filter(Boolean);
    let start = 0;
    if(/reemplaza a/i.test(lines[0])) start = 1;
    if(lines[start] && /n\.?\s*º?\s*de ref/i.test(lines[start])) start++;
    for(let i=start;i+1<lines.length;i+=2){
      const brand = lines[i], code = lines[i+1];
      if(brand && code && !/reemplaza a|n\.?\s*º?\s*de ref/i.test(brand)) result.crossRefs.push(`${brand} ${code}`);
    }
  }
  return result;
}
function fillArticleFromPastedText(){
  const ta = document.getElementById('newArtPasteText');
  const text = (ta && ta.value || '').trim();
  if(!text){ playErrorSound(); showToast('Pegá primero el texto copiado de la página.'); return; }
  const data = parsePastedArticleText(text);
  const refEl = document.getElementById('newArtRef');
  // si el código no tiene el formato de Diesel Technic (1.23456), se usa el SKU escrito para encontrar el nombre
  if(!data.ref && refEl && refEl.value.trim()){
    const sku = refEl.value.trim(); const lines = text.split('\n').map(l=>l.trim()).filter(Boolean);
    const li = lines.findIndex(l=>l.replace(/\s+/g,'').toLowerCase().includes(sku.replace(/\s+/g,'').toLowerCase()));
    if(li >= 0){
      // el nombre es lo que viene DESPUÉS del código en la misma línea; si no hay, la línea siguiente
      const pos = lines[li].toLowerCase().indexOf(sku.toLowerCase());
      const after = pos >= 0 ? lines[li].slice(pos + sku.length).replace(/^[\s:·|\-–]+/,'').trim() : '';
      const okName = t => t && t.length >= 3 && /[a-zà-ÿ]{3}/i.test(t) && !/^(oe|gtin|ean|barcode|código|codigo|ref)\b/i.test(t);
      data.title = okName(after) ? after : (okName(lines[li+1]) ? lines[li+1] : '');
    }
    data.gtins = data.gtins.filter(g=>g !== sku.replace(/\D/g,''));
  }
  const titleEl = document.getElementById('newArtTitle');
  const brandEl = document.getElementById('newArtBrand');
  const appsEl = document.getElementById('newArtApps');
  const filled = [];
  if(data.ref && refEl && !refEl.value.trim()){ refEl.value = data.ref; filled.push('referencia'); }
  if(data.title && titleEl && !titleEl.value.trim()){ titleEl.value = data.title; filled.push('nombre'); }
  if(data.brand && brandEl){ brandEl.value = data.brand; filled.push('marca'); }
  if(data.gtins.length){ setMultiCodes('newArtGtinList', 'gtin', data.gtins); filled.push(data.gtins.length + ' GTIN (cada uno en su casilla)'); }
  if(data.crossRefs.length){ setMultiCodes('newArtOeList', 'oe', data.crossRefs); filled.push(data.crossRefs.length + ' referencia(s) original(es)'); }
  if(filled.length) showToast(`Se completó desde el texto pegado: ${filled.join(', ')}. Revisá antes de guardar.`);
  else showToast('No se reconocieron datos en el texto pegado — revisá el formato o completá manualmente.');
}
function markFieldError(el, msg){
  playErrorSound(); showToast(msg);
  if(!el) return;
  el.classList.add('field-error'); el.scrollIntoView({block:'center', behavior:'smooth'}); setTimeout(()=>el.focus(), 250);
  el.addEventListener('input', ()=>el.classList.remove('field-error'), {once:true});
}
function submitNewArticle(){
  const refEl = document.getElementById('newArtRef');
  const titleEl = document.getElementById('newArtTitle');
  const ref = (refEl.value||'').trim();
  const title = (titleEl.value||'').trim();
  if(!ref){ markFieldError(refEl, 'Falta la Referencia / SKU.'); return; }
  if(!title){ markFieldError(titleEl, 'Falta el Nombre del artículo (es obligatorio).'); return; }
  // si la referencia existe pero estaba eliminada, se vuelve a crear (se quita de eliminados)
  const revive = !!PRODUCTS_BY_REF[ref] && isDeleted(ref);
  if(PRODUCTS_BY_REF[ref] && !revive){ markFieldError(refEl, `Ya existe un artículo con la referencia ${ref}: ${PRODUCTS_BY_REF[ref].title}. Búscalo en el catálogo.`); return; }
  const brand = (document.getElementById('newArtBrand').value||'').trim() || 'DT Spare Parts';
  const cat = (document.getElementById('newArtCat').value||'').trim() || 'Repuesto';
  const applications = (document.getElementById('newArtApps').value||'').trim();
  const gtinList = readMultiCodes('newArtGtinList');
  const badG = gtinList.filter(c=>!validGtin(c));
  const gtinInput = c => [...document.querySelectorAll('#newArtGtinList input')].find(i=>i.value.trim()===c);
  if(badG.length){ markFieldError(gtinInput(badG[0]), 'GTIN no válido (no puede llevar < > " ni ser muy largo): ' + badG.join(', ') + '. Si es un número del fabricante, ponlo en "Referencia o artículo original".'); return; }
  for(const c of gtinList){ const owner = findProductByCode(c); if(owner && owner.ref !== ref){ markFieldError(gtinInput(c), `El GTIN ${c} ya pertenece al SKU ${owner.ref} (${owner.title}).`); return; } }
  const gtin = gtinList[0] || '';
  const altCodes = gtinList.slice(1);
  const oeRefs = readMultiCodes('newArtOeList');
  const stock = Math.max(0, Number(document.getElementById('newArtStock').value)||0);
  const tramo = (document.getElementById('newArtTramo').value||'').trim();
  const estante = (document.getElementById('newArtEstante').value||'').trim();
  const costEl = document.getElementById('newArtCost');
  const costVal = costEl ? costEl.value : '';
  const priceVal = document.getElementById('newArtPrice').value;

  deletedRefs = deletedRefs.filter(r=>r !== ref);
  if(revive){ const i = products.findIndex(x=>x.ref===ref); if(i>=0) products.splice(i,1); delete PRODUCTS_BY_REF[ref]; }
  const newP = {ref, sku:ref, title, brand, cat, pack:'1 PCS', gtin, url:'', refsList:oeRefs.slice(), _baseRefs:[], marca:MARCA_FIJA, img:newArticleImageData||'', applications, sourceUrl: PORTAL_URL, _custom:true};
  products.push(newP);
  PRODUCTS_BY_REF[ref] = newP;
  const inv = getInv(ref);
  // la ficha del artículo se guarda con su registro, para que exista en todas las PC
  inv.product = {title, brand, cat, applications, gtin, refs: oeRefs, img: newArticleImageData||'', creado: new Date().toISOString(), por: currentUser ? currentUser.username : ''};
  inv.stock = stock;
  inv.cost = costVal===''?'':Number(costVal);
  inv.price = priceVal===''?'':Number(priceVal);
  inv.gtin = gtin;
  inv.altCodes = altCodes;
  inv.oeRefs = oeRefs;
  _codeIndex = null;
  if(tramo && estante){
    inv.location = `${tramo}/${estante}`;
    let area = countAreas.find(a=>a.tramo===tramo && a.estante===estante);
    if(!area){ area = {tramo, estante, counts:{}}; countAreas.push(area); syncLocationsFromAreas(); }
    if(stock>0) area.counts[ref] = (Number(area.counts[ref])||0) + stock;
  }
  getInternalCode(ref);
  saveInventory();
  saveMeta();
  renderProducts();
  renderCatalogCards();
  renderInventoryStats();
  renderAreaSelect();
  renderCountedItemsList();
  closeAddArticleForm();
  playAddSound();
  showToast('Artículo agregado: '+title);
}

/* ================= FICHA DE ARTÍCULO (detalle al tocar un artículo) ================= */
let articleDetailRef = null;
let zplConfig = { start: 1, qty: 1, showInternal: true, showBarcode: true, showSku: true, showName: true };

function openArticleDetail(ref){
  const p = PRODUCTS_BY_REF[ref];
  if(!p) return;
  articleDetailRef = ref;
  zplConfig = { start: 1, qty: 1, showInternal: true, showBarcode: true, showSku: true, showName: true };
  renderArticleDetail();
  document.getElementById('articleDetailOverlay').classList.add('is-open');
}
function closeArticleDetail(){
  const ov = document.getElementById('articleDetailOverlay');
  if(ov) ov.classList.remove('is-open');
  articleDetailRef = null;
}
function renderArticleDetail(){
  const ref = articleDetailRef;
  const p = ref ? PRODUCTS_BY_REF[ref] : null;
  const content = document.getElementById('articleDetailContent');
  if(!p || !content) return;
  const inv = getInv(ref);
  const internalCode = getInternalCode(ref);
  const principalGtin = p.gtin || inv.gtin || '';
  const altCodes = Array.isArray(inv.altCodes) ? inv.altCodes : [];
  const locParts = (inv.location||'').split('/');

  content.innerHTML = `
    <button class="modal-close" onclick="closeArticleDetail()" aria-label="Cerrar">✕</button>
    <span class="art-sku-chip">SKU ${p.sku}</span>
    <div class="art-codes">
      <div>Código interno Zebra: ${internalCode}</div>
      <div>Código externo: ${p.ref}</div>
      <div>GTIN: ${principalGtin || 'No asignado'}</div>
    </div>
    <div class="art-head">
      <div class="art-head-img" onclick="openZoom('${ref}')"><img src="${p.img||''}" alt="" onerror="this.style.opacity=.25"></div>
      <div class="art-head-body">
        <div class="art-head-title">${p.title}</div>
        <div class="art-head-brand">${MARCA_FIJA} · ${p.brand}</div>
        <div class="art-head-desc">${p.applications || p.cat || ''}</div>
        <div class="art-stat-row">
          <div class="art-stat-box"><span>Existencia</span><b>${inv.stock||0}</b></div>
          <div class="art-stat-box"><span>Ubicación actual</span><b style="font-size:.86rem;">${formatLocationLabel(inv.location)}${extraLocs(inv).map(l=>`<br><span class="extra-loc" title="Quitar esta ubicación" onclick="removeExtraLocation('${ref}','${l}')">＋ ${formatLocationLabel(l)} ✕</span>`).join('')}</b></div>
        </div>
        <div class="art-actions-row">
          ${currentUser && currentUser.role==='admin' ? `<button class="mini-btn mini-btn--wa" onclick="const s=document.getElementById('artEditSection'); s.scrollIntoView({behavior:'smooth',block:'start'}); setTimeout(()=>document.getElementById('artEdTitle').focus(),300)">✏️ Editar artículo</button>` : ''}
          <button class="mini-btn" onclick="etPrintSku('${ref}')">🖨 Imprimir SKU grande</button>
          <button class="mini-btn" onclick="document.getElementById('artAddGtinInput').focus()">Agregar otro GTIN</button>
          <button class="mini-btn mini-btn--del" onclick="deleteArticleFromDetail('${ref}')">Eliminar artículo completo</button>
        </div>
      </div>
    </div>

    ${currentUser && currentUser.role==='admin' ? `<div class="art-section" id="artEditSection">
      <div class="art-section-kicker">✏️ Editar artículo</div>
      <p class="art-section-sub">Cambia los datos y presiona Guardar cambios. Se actualiza en todas las PC y celulares.</p>
      <div class="art-price-row" style="margin-bottom:10px;">
        <label style="flex:2;min-width:220px;">Nombre del artículo<input type="text" id="artEdTitle" value="${String(p.title||'').replace(/"/g,'&quot;')}"></label>
        <label>Marca<input type="text" id="artEdBrand" value="${String(p.brand||'').replace(/"/g,'&quot;')}"></label>
      </div>
      <div class="art-price-row" style="margin-bottom:10px;">
        <label>Categoría<input type="text" id="artEdCat" value="${String(p.cat||'').replace(/"/g,'&quot;')}"></label>
        <label style="flex:2;min-width:220px;">Aplicaciones / vehículos<input type="text" id="artEdApps" value="${String(p.applications||'').replace(/"/g,'&quot;')}"></label>
      </div>
      <div class="art-price-row" style="margin-bottom:10px;">
        <label>GTIN principal<input type="text" id="artEdGtin" value="${escH(principalGtin)}" placeholder="cualquier formato"></label>
        <label style="flex:2;min-width:220px;">Foto — pegar URL<input type="text" id="artEdImgUrl" placeholder="https://... (déjalo vacío para no cambiarla)"></label>
      </div>
      <div class="art-price-row" style="margin-bottom:10px;align-items:center;">
        <label>Foto — subir archivo<input type="file" id="artEdImgFile" accept="image/*" style="padding:6px 0"></label>
        <div id="artEdImgPrev"></div>
      </div>
      <div class="art-price-row"><button class="mini-btn mini-btn--wa" style="padding:10px 16px;font-size:.85rem" onclick="saveArticleEdits('${ref}')">💾 Guardar cambios</button></div>
    </div>` : ''}

    <div class="art-section">
      <div class="art-section-kicker">Códigos de barras</div>
      <h4>GTIN / códigos alternativos</h4>
      <p class="art-section-sub">El código principal es el que trae la página del proveedor. Agregá acá los códigos viejos o que ya no están disponibles en la página — al escanear cualquiera de ellos, el sistema encuentra este mismo artículo.</p>
      <div class="art-gtin-row">
        ${principalGtin ? `<span class="gtin-chip gtin-chip--principal">Principal · ${escH(principalGtin)}</span>` : `<span class="gtin-chip">Sin GTIN principal</span>`}
        ${altCodes.map(c=>`<span class="gtin-chip gtin-chip--removable" title="Quitar código" data-c="${escH(c)}" onclick="removeAltGtin('${ref}', this.dataset.c)">${escH(c)} ✕</span>`).join('')}
      </div>
      <div class="art-add-gtin-row">
        <input type="text" id="artAddGtinInput" placeholder="Uno o varios códigos, cualquier formato (ej. QA'2038M) — separados por espacio, coma o |">
        <button type="button" class="scan-camera-btn" title="Escanear con la cámara" onclick="openBarcodeScanner(code=>{ const el=document.getElementById('artAddGtinInput'); el.value = (el.value?el.value+' ':'')+code; closeBarcodeScanner(); })">📷</button>
        <button class="mini-btn mini-btn--wa" onclick="addAltGtinFromInput('${ref}')">Guardar GTIN</button>
      </div>
    </div>

    <div class="art-section">
      <div class="art-section-kicker">Referencia o artículo original</div>
      <h4>Números OE / del fabricante</h4>
      <p class="art-section-sub">Al buscar o escanear cualquiera de estos números aparece este artículo.</p>
      <div class="art-gtin-row">
        ${(p.refsList||[]).length ? (p.refsList||[]).map(r=>{ const mine = (inv.oeRefs||[]).includes(r); return `<span class="gtin-chip${mine?' gtin-chip--removable':''}" ${mine?`title="Quitar" onclick="removeOeRef('${ref}', this.dataset.r)" data-r="${String(r).replace(/"/g,'&quot;')}"`:''}>${r}${mine?' ✕':''}</span>`; }).join('') : '<span class="gtin-chip">Sin referencia original</span>'}
      </div>
      <div class="art-add-gtin-row">
        <input type="text" id="artAddOeInput" placeholder="Ej. Volvo 20514235 — varias separadas por coma">
        <button class="mini-btn mini-btn--wa" onclick="addOeRefFromInput('${ref}')">Guardar referencia</button>
      </div>
    </div>

    <div class="art-section">
      <div class="art-section-kicker">Solo administrador</div>
      <h4>Costo y venta final</h4>
      <p class="art-section-sub">Poné el precio en dólares en la casilla "Dólares" y se calcula solo en pesos en "Precio final" con la tasa del día (se puede ver/cambiar en la ventana de Cotizaciones).</p>
      <div class="art-price-row">
        ${canSeeCost() ? `<label>Costo<input type="number" min="0" step="0.01" id="artCostInput" value="${inv.cost}"></label>` : ''}
        <label>Precio final<input type="number" min="0" step="0.01" id="artPriceInput" value="${inv.price}"></label>
        <label>Dólares<input type="number" min="0" step="0.01" id="artDolaresInput" oninput="convertArtDolares('${ref}')" placeholder="US$"></label>
        <button class="mini-btn" onclick="saveArticlePrices('${ref}')">Guardar</button>
      </div>
    </div>

    <div class="art-section">
      <div class="art-section-kicker">Impresora Zebra LP2824 Plus</div>
      <h4>Etiqueta de código de barras</h4>
      <div class="zpl-config-row">
        <label>Inicio<input type="number" min="1" value="${zplConfig.start}" onchange="updateZplField('start',this.value)"></label>
        <label>Cantidad<input type="number" min="1" value="${zplConfig.qty}" onchange="updateZplField('qty',this.value)"></label>
      </div>
      <div class="zpl-toggles">
        <label><input type="checkbox" ${zplConfig.showInternal?'checked':''} onchange="toggleZplField('showInternal',this.checked)"> Código interno</label>
        <label><input type="checkbox" ${zplConfig.showBarcode?'checked':''} onchange="toggleZplField('showBarcode',this.checked)"> Código de barras</label>
        <label><input type="checkbox" ${zplConfig.showSku?'checked':''} onchange="toggleZplField('showSku',this.checked)"> SKU</label>
        <label><input type="checkbox" ${zplConfig.showName?'checked':''} onchange="toggleZplField('showName',this.checked)"> Nombre</label>
      </div>
      <div class="zpl-preview-wrap" id="zplPreviewWrap"></div>
      <div class="art-actions-row">
        <button class="mini-btn mini-btn--wa" onclick="downloadZpl('${ref}')">Descargar ZPL seleccionada</button>
      </div>
    </div>

    <div class="art-section">
      <div class="art-section-kicker">Conteo rápido</div>
      <h4>Cantidad manual / caja</h4>
      <p class="art-manual-sub">Indica cuántas unidades contiene la caja o cuántas piezas vas a contar.</p>
      <div class="art-manual-row">
        <label>Tramo<input type="text" id="artManualTramo" value="${locParts[0]||''}"></label>
        <label>Estante<input type="text" id="artManualEstante" value="${locParts[1]||''}"></label>
        <label>Cantidad<input type="number" min="1" value="1" id="artManualQty"></label>
      </div>
      <button class="mini-btn mini-btn--wa" onclick="sumarCantidadManualArticulo('${ref}')">+ Sumar cantidad manual</button>
    </div>
  `;
  renderZplPreview();
}
// Al escribir en la casilla "Dólares", calcula el equivalente en pesos con la tasa del día
// y lo coloca en el campo "Precio final" (no se guarda hasta apretar "Guardar").
function convertArtDolares(ref){
  const dolaresEl = document.getElementById('artDolaresInput');
  const priceEl = document.getElementById('artPriceInput');
  if(!dolaresEl || !priceEl) return;
  const dolares = Number(dolaresEl.value);
  if(!dolares && dolares!==0) return;
  priceEl.value = (dolares * getUsdRate()).toFixed(2);
}
function convertNewArtDolares(){
  const dolaresEl = document.getElementById('newArtDolares');
  const priceEl = document.getElementById('newArtPrice');
  if(!dolaresEl || !priceEl) return;
  const dolares = Number(dolaresEl.value);
  if(!dolares && dolares!==0) return;
  priceEl.value = (dolares * getUsdRate()).toFixed(2);
}
function saveArticlePrices(ref){
  const inv = getInv(ref);
  const costEl = document.getElementById('artCostInput');
  const priceEl = document.getElementById('artPriceInput');
  if(!priceEl) return;
  if(costEl) inv.cost = costEl.value===''?'':Number(costEl.value);
  inv.price = priceEl.value===''?'':Number(priceEl.value);
  saveInventory();
  renderProducts();
  renderCatalogCards();
  showToast('Precio actualizado.');
}
/* ---------- editar artículo (propios y del catálogo) ---------- */
function shrinkImage(file, max){
  return new Promise((resolve, reject)=>{ const fr = new FileReader(); fr.onerror = reject; fr.onload = ()=>{ const im = new Image(); im.onerror = ()=>resolve(fr.result); im.onload = ()=>{
    const k = Math.min(1, (max||500) / Math.max(im.width, im.height)); const c = document.createElement('canvas'); c.width = Math.round(im.width*k); c.height = Math.round(im.height*k);
    const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0,0,c.width,c.height); g.drawImage(im, 0, 0, c.width, c.height); resolve(c.toDataURL('image/jpeg', .82)); }; im.src = fr.result; }; fr.readAsDataURL(file); });
}
function applyArticleEdit(p, ed){
  if(!p || !ed) return;
  ['title','brand','cat','applications','img','gtin'].forEach(k=>{ if(ed[k] !== undefined && ed[k] !== null) p[k] = ed[k]; });
}
async function saveArticleEdits(ref){
  const p = PRODUCTS_BY_REF[ref]; if(!p) return; const inv = getInv(ref);
  const val = id => (document.getElementById(id).value||'').trim();
  const title = val('artEdTitle');
  if(!title){ markFieldError(document.getElementById('artEdTitle'), 'El nombre no puede quedar vacío.'); return; }
  const gtin = val('artEdGtin');
  if(gtin && !validGtin(gtin)){ markFieldError(document.getElementById('artEdGtin'), 'GTIN no válido: no puede llevar < > " ni ser muy largo.'); return; }
  if(gtin){ const owner = findProductByCode(gtin); if(owner && owner.ref !== ref){ markFieldError(document.getElementById('artEdGtin'), `Ese GTIN ya pertenece al SKU ${owner.ref} (${owner.title}).`); return; } }
  const ed = Object.assign({}, inv.edit || {}, {title, brand: val('artEdBrand'), cat: val('artEdCat'), applications: val('artEdApps'), gtin, editado: new Date().toISOString(), por: currentUser ? currentUser.username : ''});
  const f = document.getElementById('artEdImgFile').files[0]; const url = val('artEdImgUrl');
  if(f){ try{ ed.img = await shrinkImage(f, 500); }catch(e){} } else if(url){ ed.img = url; }
  // el GTIN principal anterior pasa a alternativo para que siga funcionando al escanear
  const prevG = p.gtin || inv.gtin || '';
  if(prevG && gtin && prevG !== gtin){ inv.altCodes = Array.from(new Set((inv.altCodes||[]).concat([prevG]))).filter(c=>c !== gtin); }
  inv.gtin = gtin; inv.edit = ed;
  if(inv.product){ Object.assign(inv.product, {title: ed.title, brand: ed.brand, cat: ed.cat, applications: ed.applications, gtin}); if(ed.img) inv.product.img = ed.img; }
  applyArticleEdit(p, ed);
  _codeIndex = null; saveInventory(); renderArticleDetail(); renderProducts(); if(typeof renderCatalogCards === 'function') renderCatalogCards();
  playAddSound(); showToast('✔ Artículo actualizado: ' + title);
}
function addOeRefFromInput(ref){
  const el = document.getElementById('artAddOeInput'); if(!el) return;
  const vals = splitCodes(el.value, 'oe'); if(!vals.length){ playErrorSound(); showToast('Escribí la referencia original.'); return; }
  const inv = getInv(ref); const p = PRODUCTS_BY_REF[ref];
  inv.oeRefs = Array.isArray(inv.oeRefs) ? inv.oeRefs : [];
  const added = vals.filter(v=>!(p.refsList||[]).some(r=>String(r).toLowerCase()===v.toLowerCase()));
  inv.oeRefs = inv.oeRefs.concat(added);
  if(!p._baseRefs) p._baseRefs = (p.refsList||[]).slice();
  p.refsList = Array.from(new Set(p._baseRefs.concat(inv.oeRefs)));
  if(inv.product){ inv.product.refs = (inv.product.refs||[]).concat(added.filter(a=>!(inv.product.refs||[]).includes(a))); }
  _codeIndex = null; saveInventory(); renderArticleDetail(); renderProducts();
  showToast(added.length ? `Referencia guardada: ${added.join(', ')}` : 'Esa referencia ya estaba.');
}
function removeOeRef(ref, r){
  const inv = getInv(ref); const p = PRODUCTS_BY_REF[ref];
  inv.oeRefs = (inv.oeRefs||[]).filter(x=>x !== r);
  if(inv.product && inv.product.refs) inv.product.refs = inv.product.refs.filter(x=>x !== r);
  p.refsList = Array.from(new Set((p._baseRefs||[]).concat(inv.oeRefs)));
  _codeIndex = null; saveInventory(); renderArticleDetail(); renderProducts(); showToast('Referencia quitada.');
}
function addAltGtinFromInput(ref){
  const el = document.getElementById('artAddGtinInput');
  if(!el) return;
  const raw = (el.value||'').trim();
  if(!raw){ playErrorSound(); showToast('Escribí o pegá uno o varios códigos antes de guardar.'); return; }
  // Acepta pegar varios códigos juntos: separados por | , espacio o salto de línea
  const candidates = Array.from(new Set(raw.split(/[|,\s]+/).map(c=>c.trim()).filter(Boolean)));
  const inv = getInv(ref);
  const p = PRODUCTS_BY_REF[ref];
  const added = [];
  const skipped = [];
  candidates.forEach(code=>{
    if(!validGtin(code)){ skipped.push(`${code} (formato inválido)`); return; }
    if((p.gtin||'').toLowerCase()===code.toLowerCase() || (inv.gtin||'').toLowerCase()===code.toLowerCase()){
      skipped.push(`${code} (ya es el principal)`); return;
    }
    if(inv.altCodes && inv.altCodes.some(c=>String(c).toLowerCase()===code.toLowerCase())){
      skipped.push(`${code} (ya estaba agregado)`); return;
    }
    const owner = findProductByCode(code);
    if(owner && owner.ref !== ref){
      skipped.push(`${code} (pertenece a SKU ${owner.ref})`); return;
    }
    if(!Array.isArray(inv.altCodes)) inv.altCodes = [];
    inv.altCodes.push(code);
    added.push(code);
  });
  if(added.length){
    saveInventory();
    el.value = '';
    renderArticleDetail();
    renderCatalogCards();
    playAddSound();
    const msg = added.length===1
      ? 'Código agregado — ahora se puede escanear para encontrar este artículo.'
      : `${added.length} códigos agregados — ahora se pueden escanear para encontrar este artículo.`;
    showToast(skipped.length ? `${msg} (omitidos: ${skipped.join(', ')})` : msg);
  } else {
    playErrorSound();
    showToast(skipped.length ? `No se agregó nada — ${skipped.join(', ')}` : 'No se reconoció ningún código válido.');
  }
}
function removeAltGtin(ref, code){
  const inv = getInv(ref);
  if(!Array.isArray(inv.altCodes)) return;
  if(!confirm(`¿Quitar el código ${code} de este artículo?`)) return;
  inv.altCodes = inv.altCodes.filter(c=>String(c)!==String(code));
  saveInventory();
  renderArticleDetail();
  renderCatalogCards();
  showToast('Código quitado.');
}
function deleteArticleFromDetail(ref){
  const p = PRODUCTS_BY_REF[ref];
  const pass = prompt(`Vas a eliminar completamente "${p?p.title:ref}" del inventario y del catálogo.\nEscribí la clave de administrador para continuar:`);
  if(pass === null){ showToast('Cancelado.'); return; }
  if(pass !== '1989'){ playErrorSound(); showToast('Clave incorrecta — no se eliminó nada.'); return; }
  if(!confirm(`Eliminar definitivo de inventario: "${p?p.title:ref}" se va a borrar del inventario y del catálogo y no se puede deshacer. ¿Continuar?`)){ showToast('Cancelado.'); return; }
  deleteArticle(ref);
  closeArticleDetail();
}
function updateZplField(field, value){
  zplConfig[field] = Math.max(1, Number(value)||1);
  renderZplPreview();
}
function toggleZplField(field, checked){
  zplConfig[field] = !!checked;
  renderZplPreview();
}
function pseudoBarcodeSvg(code){
  // Patrón decorativo de barras generado a partir de los dígitos del código — solo para la vista previa en pantalla, no es un código de barras real/escaneable.
  const digits = String(code||'').replace(/\D/g,'') || '0000000000000';
  const stops = [];
  let pos = 0;
  for(let i=0;i<digits.length;i++){
    const d = Number(digits[i]);
    const w = 1 + (d % 4);
    const isBar = i % 2 === 0;
    stops.push(`${isBar?'#1a1f2b':'#ffffff'} ${pos}px ${pos+w}px`);
    pos += w;
  }
  return `repeating-linear-gradient(90deg, ${stops.join(',')})`;
}
function renderZplPreview(){
  const ref = articleDetailRef;
  const wrap = document.getElementById('zplPreviewWrap');
  const p = ref ? PRODUCTS_BY_REF[ref] : null;
  if(!wrap || !p) return;
  const internalCode = getInternalCode(ref);
  const inv = getInv(ref);
  const barcodeValue = inv.gtin || p.gtin || internalCode;
  wrap.innerHTML = `<div class="zpl-label">
    <div class="zpl-label-kicker">EUROTRUCK REPUESTOS Y SERVICIOS</div>
    ${zplConfig.showInternal ? `<div class="zpl-label-code">${internalCode}</div>` : ''}
    ${zplConfig.showBarcode ? `<div class="zpl-barcode" style="background-image:${pseudoBarcodeSvg(barcodeValue)}"></div><div class="zpl-barcode-num">${barcodeValue}</div>` : ''}
    <hr class="zpl-label-hr">
    ${zplConfig.showSku ? `<div class="zpl-label-sku">SKU ${p.sku}</div>` : ''}
    ${zplConfig.showName ? `<div class="zpl-label-name">${p.title}</div>` : ''}
  </div>`;
}
/* ===== Etiqueta Zebra LP 2824 Plus (2" x 1", 203 dpi = 406 x 203 puntos): SKU en grande ===== */
function etAscii(s){ return String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^\x20-\x7E]/g,'').replace(/[\^~\\]/g,' ').trim(); }
function etCopies(){ try{ return Math.max(1, Math.min(50, parseInt(localStorage.getItem('et_copies'), 10) || 1)); }catch(e){ return 1; } }
function etSetCopies(n){ n = Math.max(1, Math.min(50, parseInt(n, 10) || 1)); try{ localStorage.setItem('et_copies', String(n)); }catch(e){} document.querySelectorAll('.et-copies').forEach(i=>{ if(document.activeElement !== i) i.value = n; }); }
function etToggleHtml(){
  const on = etAutoPrintOn();
  return `<button type="button" class="et-switch ${on ? 'on' : ''}" onclick="etSetAutoPrint(!etAutoPrintOn())">🖨 Etiqueta: <b>${on ? 'ACTIVADA' : 'DESACTIVADA'}</b></button>
    <label class="et-copies-lbl">Etiquetas por SKU <input type="number" class="et-copies" min="1" max="50" value="${etCopies()}" inputmode="numeric" onchange="etSetCopies(this.value)" oninput="etSetCopies(this.value)"></label>` + etFieldsHtml();
}
function etFields(){ const d = {sku:true, name:true, brand:false, barcode:false, oe:false}; try{ return Object.assign(d, JSON.parse(localStorage.getItem('et_fields') || '{}')); }catch(e){ return d; } }
function etSetField(k, on){ const f = etFields(); f[k] = !!on; try{ localStorage.setItem('et_fields', JSON.stringify(f)); }catch(e){} document.querySelectorAll('.et-f-' + k).forEach(c=>c.checked = !!on); etRefreshPreviews(); }
// Acomoda lo elegido en la etiqueta de 2" x 1" (406 x 203 puntos a 203 dpi)
function etLayout(d){
  const f = etFields(); const W = 406, M = 6; let usable = 203 - 2 * M;
  const sku = etAscii(d.sku) || '?';
  const smalls = [];
  if(f.oe && d.oe) smalls.push({k:'oe', t:'Ref: ' + etAscii(d.oe)});
  if(f.brand && d.brand) smalls.push({k:'brand', t:etAscii(d.brand)});
  if(f.name && d.title) smalls.push({k:'name', t:etAscii(d.title)});
  const showSku = f.sku || (!smalls.length && !(f.barcode && d.barcode));
  const bc = f.barcode && d.barcode ? etAscii(d.barcode) : '';
  const sFont = showSku ? 22 : 30, sLine = sFont + 4;
  const bcH = bc ? (showSku ? 38 : 70) : 0, bcBlock = bc ? bcH + 24 : 0;
  let skuH = showSku ? Math.max(40, Math.min(140, usable - smalls.length * sLine - bcBlock - 2)) : 0;
  // si no cabe, se achican las líneas chicas
  let sl = sLine, sf = sFont;
  while(showSku && usable - smalls.length * sl - bcBlock - 2 < 40 && sf > 16){ sf -= 2; sl = sf + 3; skuH = Math.max(40, Math.min(140, usable - smalls.length * sl - bcBlock - 2)); }
  const items = []; let y = M;
  if(showSku){ const w = Math.max(24, Math.min(Math.round(skuH * 0.9), Math.floor(390 / (sku.length * 0.62)))); items.push({type:'text', y, h:skuH, w, t:sku, big:true}); y += skuH + 2; }
  smalls.forEach(s=>{ const maxCh = Math.floor(390 / (sf * 0.5)); items.push({type:'text', y, h:sf, w:Math.round(sf * 0.85), t:s.t.slice(0, maxCh), k:s.k}); y += sl; });
  if(bc){ const mod = (11 * bc.length + 35) * 2 > 390 ? 1 : 2; const est = (11 * bc.length + 35) * mod; items.push({type:'barcode', y, h:bcH, t:bc, mod, x:Math.max(M, Math.round((W - est) / 2))}); }
  return items;
}
function etLabelZpl(d, copias){
  const L = ['^XA','^CI0','^PW406','^LL203','^LH0,0','^PR3'];
  etLayout(d).forEach(it=>{
    if(it.type === 'text') L.push(`^FO8,${it.y}^FB390,1,0,C,0^A0N,${it.h},${it.w}^FD${it.t}^FS`);
    else L.push(`^FO${it.x},${it.y}^BY${it.mod},2.5,${it.h}^BCN,${it.h},Y,N,N^FD${it.t}^FS`);
  });
  L.push(`^PQ${Math.max(1, Math.min(50, copias || 1))},0,1,Y`, '^XZ');
  return L.join('\n');
}
function etSkuLabelZpl(sku, title, copias){ return etLabelZpl({sku, title}, copias); }
function etPreviewHtml(d){
  const k = 0.62;  // escala de la vista previa
  return `<div class="et-prev" style="width:${Math.round(406*k)}px;height:${Math.round(203*k)}px">` + etLayout(d).map(it=> it.type === 'text'
    ? `<div style="position:absolute;left:0;right:0;top:${Math.round(it.y*k)}px;height:${Math.round(it.h*k)}px;font-size:${Math.round(it.h*k*0.86)}px;line-height:${Math.round(it.h*k)}px;font-weight:${it.big ? 800 : 600};text-align:center;white-space:nowrap;overflow:hidden;${it.big ? 'transform:scaleX(.9)' : ''}">${it.t.replace(/</g,'&lt;')}</div>`
    : `<div style="position:absolute;left:${Math.round(it.x*k)}px;top:${Math.round(it.y*k)}px;height:${Math.round(it.h*k)}px;width:${Math.round((11*it.t.length+35)*it.mod*k)}px;background:repeating-linear-gradient(90deg,#000 0 2px,#fff 2px 3px,#000 3px 4px,#fff 4px 6px)"></div><div style="position:absolute;left:0;right:0;top:${Math.round((it.y+it.h+2)*k)}px;font-size:${Math.round(18*k)}px;text-align:center">${it.t}</div>`).join('') + `</div>`;
}
function etFieldsHtml(){
  const f = etFields(); const c = (k, t)=>`<label class="et-f"><input type="checkbox" class="et-f-${k}" ${f[k] ? 'checked' : ''} onchange="etSetField('${k}', this.checked)"> ${t}</label>`;
  return `<div class="et-fields">Incluir en la etiqueta: ${c('sku','SKU (grande)')}${c('name','Nombre')}${c('brand','Marca')}${c('barcode','Código de barras del sistema')}${c('oe','Ref. / artículo original')}</div><div class="et-prev-wrap"></div>`;
}
function etAutoPrintOn(){ try{ return localStorage.getItem('et_autoprint') !== 'off'; }catch(e){ return true; } }
function etSetAutoPrint(on){ try{ localStorage.setItem('et_autoprint', on ? 'on' : 'off'); }catch(e){}
  document.querySelectorAll('.et-switch').forEach(b=>{ b.classList.toggle('on', !!on); b.innerHTML = '🖨 Etiqueta: <b>' + (on ? 'ACTIVADA' : 'DESACTIVADA') + '</b>'; });
  document.querySelectorAll('.et-autoprint').forEach(c=>c.checked = !!on); }

function etDataFor(ref){ const p = PRODUCTS_BY_REF[ref] || {ref}; return {sku: p.sku || p.ref, title: p.title || '', brand: p.brand || '', barcode: getInternalCode(ref), oe: (p.refsList || [])[0] || ''}; }
function etSample(){ const r = (typeof lastAddedRef !== 'undefined' && lastAddedRef && PRODUCTS_BY_REF[lastAddedRef]) ? lastAddedRef : null;
  return r ? etDataFor(r) : {sku:'1.24265', title:'Torica, bomba de aceite', brand:'Scania', barcode:'00123', oe:'Scania:1411851'}; }
function etRefreshPreviews(){ const d = etSample(); document.querySelectorAll('.et-prev-wrap').forEach(w=>w.innerHTML = '<small>Vista previa (2" x 1"):</small>' + etPreviewHtml(d)); }
async function etPrintSku(ref, auto){
  const p = PRODUCTS_BY_REF[ref]; if(!p) return;
  if(etFields().barcode && !internalCodes[ref]) await ensureInternalCodes([ref]);
  const sv = srvSettings();
  if(!sv.url || !sv.token){ if(!auto){ playErrorSound(); showToast('Para imprimir hay que iniciar sesión (conectado al servidor).'); } return; }
  try{
    const r = await fetch(sv.url + '/api/imprimir', {method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer ' + sv.token}, body: JSON.stringify({zpl: etLabelZpl(etDataFor(ref), auto ? etCopies() : 1)})});
    const j = await r.json().catch(()=>({}));
    if(!r.ok) throw new Error(j.error || ('error ' + r.status));
    if(!auto) showToast('🖨 Etiqueta impresa: ' + (p.sku || p.ref));
  }catch(e){ playErrorSound(); showToast('🖨 No se pudo imprimir la etiqueta: ' + e.message); }
}
function etMountToggles(){
  [['scanInput','inventario'],['receivingScanInput','recepción']].forEach(([id, donde])=>{
    const inp = document.getElementById(id); if(!inp || document.getElementById('etTg_' + id)) return;
    const box = inp.closest('.scan-box, .scan-row, div') || inp.parentElement; const host = box.parentElement || box;
    const d = document.createElement('div'); d.id = 'etTg_' + id; d.className = 'et-print-toggle';
    d.innerHTML = etToggleHtml() + `<button type="button" class="mini-btn" onclick="etTestPrint()">Probar impresora</button><small style="color:#8b96ab">Se imprime al registrar cada SKU por primera vez</small>`;
    host.insertBefore(d, box.nextSibling);
  });
  etRefreshPreviews();
}
async function etTestPrint(){
  const sv = srvSettings(); if(!sv.url || !sv.token){ playErrorSound(); showToast('Inicia sesión para usar la impresora.'); return; }
  try{
    const r = await fetch(sv.url + '/api/imprimir', {method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer ' + sv.token}, body: JSON.stringify({zpl: etLabelZpl(etSample())})});
    const j = await r.json().catch(()=>({})); if(!r.ok) throw new Error(j.error || ('error ' + r.status));
    playAddSound(); showToast('🖨 Prueba enviada a ' + (j.impresora || 'la Zebra'));
  }catch(e){ playErrorSound(); showToast('🖨 ' + e.message); }
}
setTimeout(etMountToggles, 1500); setTimeout(()=>{ const d = document.getElementById('lowStockDetails'); try{ if(d && localStorage.getItem('et_lowstock_open') === '1') d.open = true; }catch(e){} }, 500); document.addEventListener('click', ()=>setTimeout(etMountToggles, 50), true);
function buildZpl(ref){
  const p = PRODUCTS_BY_REF[ref];
  const inv = getInv(ref);
  const internalCode = getInternalCode(ref);
  const barcodeValue = inv.gtin || p.gtin || internalCode;
  const lines = ['^XA', '^CI28'];
  let y = 20;
  if(zplConfig.showInternal){
    lines.push(`^FO20,${y}^A0N,32,32^FD${internalCode}^FS`);
    y += 40;
  }
  if(zplConfig.showBarcode){
    lines.push(`^FO20,${y}^BY2^BCN,60,Y,N,N^FD${barcodeValue}^FS`);
    y += 80;
  }
  if(zplConfig.showSku){
    lines.push(`^FO20,${y}^A0N,24,24^FDSKU ${p.sku}^FS`);
    y += 30;
  }
  if(zplConfig.showName){
    lines.push(`^FO20,${y}^A0N,20,20^FD${(p.title||'').substring(0,40)}^FS`);
    y += 26;
  }
  lines.push(`^PQ${zplConfig.qty}`);
  lines.push('^XZ');
  return lines.join('\n');
}
function downloadZpl(ref){
  const p = PRODUCTS_BY_REF[ref];
  const zpl = buildZpl(ref);
  const blob = new Blob([zpl], {type:'text/plain;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `etiqueta_${p?p.sku:ref}.zpl`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Etiqueta ZPL descargada — enviala a la Zebra LP2824 Plus.');
}
function sumarCantidadManualArticulo(ref){
  const p = PRODUCTS_BY_REF[ref];
  if(!p) return;
  const tramoEl = document.getElementById('artManualTramo');
  const estanteEl = document.getElementById('artManualEstante');
  const qtyEl = document.getElementById('artManualQty');
  const tramo = (tramoEl && tramoEl.value || '').trim();
  const estante = (estanteEl && estanteEl.value || '').trim();
  const qty = Math.max(1, Number(qtyEl && qtyEl.value) || 1);
  if(!tramo || !estante){ playErrorSound(); showToast('Completá tramo y estante antes de sumar.'); return; }
  let area = countAreas.find(a=>a.tramo===tramo && a.estante===estante);
  if(!area){
    area = {tramo, estante, counts:{}};
    countAreas.push(area);
    syncLocationsFromAreas();
  }
  // Igual que el escaneo del panel de Inventario: esto solo CUENTA (no suma el stock
  // todavía). El stock real se suma recién cuando se presiona "Cerrar Entrada" en esa área.
  const inv = getInv(ref);
  inv.location = `${tramo}/${estante}`;
  area.counts[ref] = (Number(area.counts[ref])||0) + qty;
  lastAddedRef = ref;
  scanHistory.unshift({time:new Date().toLocaleTimeString('es-DO',{hour:'2-digit',minute:'2-digit',second:'2-digit'}), ref:p.ref, title:p.title, stock:inv.stock, qty});
  scanHistory = scanHistory.slice(0,50);
  saveInventory();
  saveMeta();
  renderCatalogCards();
  renderProducts();
  renderCountedItemsList();
  renderInventoryStats();
  renderAreaSelect();
  renderScanHistoryTable();
  renderArticleDetail();
  playAddSound();
  showToast(`Contado — ${p.title} × ${area.counts[ref]} (Tramo ${tramo} / Estante ${estante}) — pendiente de "Cerrar Entrada"`);
}

/* ---------- Descargas (CSV) ---------- */
function downloadCsv(filename, rows){
  const csv = rows.map(r=>r.map(c=>{
    c = String(c===undefined||c===null?'':c);
    if(c.includes(',')||c.includes('"')||c.includes('\n')) c = '"'+c.replace(/"/g,'""')+'"';
    return c;
  }).join(',')).join('\n');
  const blob = new Blob(['﻿'+csv], {type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
/* ---------- Generador de Excel (.xlsx) sin librerías externas -----------
   Escribe un archivo .xlsx válido (formato OOXML) a mano: ZIP (método
   "guardado", sin compresión) + XML mínimo de hoja de cálculo. No depende
   de ninguna librería externa, así el sitio sigue funcionando 100% sin
   conexión a internet. */
function crc32Bytes(bytes){
  if(!crc32Bytes.table){
    const table = [];
    for(let n=0;n<256;n++){
      let c = n;
      for(let k=0;k<8;k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      table[n] = c >>> 0;
    }
    crc32Bytes.table = table;
  }
  const table = crc32Bytes.table;
  let crc = 0 ^ (-1);
  for(let i=0;i<bytes.length;i++) crc = (crc >>> 8) ^ table[(crc ^ bytes[i]) & 0xFF];
  return (crc ^ (-1)) >>> 0;
}
function makeZip(files){
  // files: [{name, data:Uint8Array}], todos guardados sin compresión (STORED) — sigue siendo un .zip/.xlsx válido.
  const encoder = new TextEncoder();
  const now = new Date();
  const dosTime = ((now.getHours()&0x1F)<<11) | ((now.getMinutes()&0x3F)<<5) | ((Math.floor(now.getSeconds()/2))&0x1F);
  const dosDate = (((now.getFullYear()-1980)&0x7F)<<9) | (((now.getMonth()+1)&0xF)<<5) | (now.getDate()&0x1F);
  const localParts = [];
  const centralParts = [];
  let offset = 0;
  files.forEach(f=>{
    const nameBytes = encoder.encode(f.name);
    const data = f.data;
    const crc = crc32Bytes(data);
    const size = data.length;
    const local = new Uint8Array(30 + nameBytes.length);
    const dv = new DataView(local.buffer);
    dv.setUint32(0, 0x04034b50, true);
    dv.setUint16(4, 20, true);
    dv.setUint16(6, 0, true);
    dv.setUint16(8, 0, true);
    dv.setUint16(10, dosTime, true);
    dv.setUint16(12, dosDate, true);
    dv.setUint32(14, crc, true);
    dv.setUint32(18, size, true);
    dv.setUint32(22, size, true);
    dv.setUint16(26, nameBytes.length, true);
    dv.setUint16(28, 0, true);
    local.set(nameBytes, 30);
    localParts.push(local, data);

    const central = new Uint8Array(46 + nameBytes.length);
    const cdv = new DataView(central.buffer);
    cdv.setUint32(0, 0x02014b50, true);
    cdv.setUint16(4, 20, true);
    cdv.setUint16(6, 20, true);
    cdv.setUint16(8, 0, true);
    cdv.setUint16(10, 0, true);
    cdv.setUint16(12, dosTime, true);
    cdv.setUint16(14, dosDate, true);
    cdv.setUint32(16, crc, true);
    cdv.setUint32(20, size, true);
    cdv.setUint32(24, size, true);
    cdv.setUint16(28, nameBytes.length, true);
    cdv.setUint16(30, 0, true);
    cdv.setUint16(32, 0, true);
    cdv.setUint16(34, 0, true);
    cdv.setUint16(36, 0, true);
    cdv.setUint32(38, 0, true);
    cdv.setUint32(42, offset, true);
    central.set(nameBytes, 46);
    centralParts.push(central);
    offset += local.length + data.length;
  });
  const centralSize = centralParts.reduce((s,c)=>s+c.length,0);
  const centralOffset = offset;
  const end = new Uint8Array(22);
  const edv = new DataView(end.buffer);
  edv.setUint32(0, 0x06054b50, true);
  edv.setUint16(4, 0, true);
  edv.setUint16(6, 0, true);
  edv.setUint16(8, files.length, true);
  edv.setUint16(10, files.length, true);
  edv.setUint32(12, centralSize, true);
  edv.setUint32(16, centralOffset, true);
  edv.setUint16(20, 0, true);
  const allParts = localParts.concat(centralParts, [end]);
  const total = allParts.reduce((s,p)=>s+p.length,0);
  const out = new Uint8Array(total);
  let pos = 0;
  allParts.forEach(p=>{ out.set(p, pos); pos += p.length; });
  return out;
}
function xmlEscape(s){
  return String(s===undefined||s===null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function xlsxColLetter(idx){
  // idx: 0-based
  let s = '';
  idx = idx + 1;
  while(idx > 0){
    const rem = (idx - 1) % 26;
    s = String.fromCharCode(65 + rem) + s;
    idx = Math.floor((idx - 1) / 26);
  }
  return s;
}
// Índices de estilo (deben coincidir con el orden armado en xlsxStylesXml()):
const XLSX_STYLES = {
  bannerTitle: 1, bannerSub: 2, bannerInfoLeft: 3, bannerObligatoria: 4, bannerInformativas: 5,
  colHeaderBlueDark: 6, colHeaderBlueMed: 7, colHeaderYellow: 8,
  dataCenter: 9, dataLeft: 10, dataCenterRed: 11, dataLeftRed: 12,
  bannerTitleRed: 13, bannerSubRed: 14, colHeaderRedDark: 15, colHeaderRedMed: 16
};
function xlsxStylesXml(){
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<fonts count="8">
<font><sz val="10"/><name val="Calibri"/></font>
<font><b/><sz val="14"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font>
<font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font>
<font><b/><sz val="9"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font>
<font><b/><sz val="9"/><color rgb="FFC00000"/><name val="Calibri"/></font>
<font><b/><sz val="9"/><color rgb="FF000000"/><name val="Calibri"/></font>
<font><sz val="10"/><color rgb="FF000000"/><name val="Calibri"/></font>
<font><b/><sz val="10"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font>
</fonts>
<fills count="11">
<fill><patternFill patternType="none"/></fill>
<fill><patternFill patternType="gray125"/></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FF1B365D"/><bgColor indexed="64"/></patternFill></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FF2E75B6"/><bgColor indexed="64"/></patternFill></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FFD9E1F2"/><bgColor indexed="64"/></patternFill></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FFFFFF00"/><bgColor indexed="64"/></patternFill></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FF1F497D"/><bgColor indexed="64"/></patternFill></fill>
<fill><patternFill patternType="none"/></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FFFF0000"/><bgColor indexed="64"/></patternFill></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FF7A1315"/><bgColor indexed="64"/></patternFill></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FFC00000"/><bgColor indexed="64"/></patternFill></fill>
</fills>
<borders count="2">
<border><left/><right/><top/><bottom/><diagonal/></border>
<border><left style="thin"><color indexed="64"/></left><right style="thin"><color indexed="64"/></right><top style="thin"><color indexed="64"/></top><bottom style="thin"><color indexed="64"/></bottom><diagonal/></border>
</borders>
<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
<cellXfs count="17">
<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
<xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="left" vertical="center"/></xf>
<xf numFmtId="0" fontId="2" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="left" vertical="center"/></xf>
<xf numFmtId="0" fontId="3" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="left" vertical="center" wrapText="1"/></xf>
<xf numFmtId="0" fontId="4" fillId="4" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>
<xf numFmtId="0" fontId="4" fillId="5" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>
<xf numFmtId="0" fontId="3" fillId="6" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>
<xf numFmtId="0" fontId="3" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>
<xf numFmtId="0" fontId="5" fillId="5" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>
<xf numFmtId="0" fontId="6" fillId="0" borderId="1" xfId="0" applyFont="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
<xf numFmtId="0" fontId="6" fillId="0" borderId="1" xfId="0" applyFont="1" applyBorder="1" applyAlignment="1"><alignment horizontal="left" vertical="center"/></xf>
<xf numFmtId="0" fontId="7" fillId="8" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
<xf numFmtId="0" fontId="7" fillId="8" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="left" vertical="center"/></xf>
<xf numFmtId="0" fontId="1" fillId="9" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="left" vertical="center"/></xf>
<xf numFmtId="0" fontId="2" fillId="9" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="left" vertical="center"/></xf>
<xf numFmtId="0" fontId="3" fillId="9" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>
<xf numFmtId="0" fontId="3" fillId="10" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>
</cellXfs>
</styleSheet>`;
}
function xlsxSheetXml(rowsDef, colWidths){
  const cols = colWidths ? `<cols>${colWidths.map((w,i)=>`<col min="${i+1}" max="${i+1}" width="${w}" customWidth="1"/>`).join('')}</cols>` : '';
  const merges = [];
  const rowsXml = rowsDef.map((row, rIdx)=>{
    const r = rIdx + 1;
    let colIdx = 0;
    const cellsXml = row.map(cell=>{
      const c = colIdx;
      const ref = xlsxColLetter(c) + r;
      const styleAttr = cell.style!=null ? ` s="${cell.style}"` : '';
      const span = cell.merge || 1;
      if(span > 1){
        const endRef = xlsxColLetter(c + span - 1) + r;
        merges.push(`${ref}:${endRef}`);
      }
      colIdx += span;
      let cellXml;
      if(cell.t === 'n'){
        const v = (cell.v===undefined||cell.v===null||cell.v==='') ? '' : Number(cell.v)||0;
        cellXml = `<c r="${ref}"${styleAttr}${v===''?'':' t="n"'}>${v===''?'':`<v>${v}</v>`}</c>`;
      } else {
        cellXml = `<c r="${ref}"${styleAttr} t="inlineStr"><is><t xml:space="preserve">${xmlEscape(cell.v)}</t></is></c>`;
      }
      return cellXml;
    }).join('');
    return `<row r="${r}">${cellsXml}</row>`;
  }).join('');
  const mergeXml = merges.length ? `<mergeCells count="${merges.length}">${merges.map(m=>`<mergeCell ref="${m}"/>`).join('')}</mergeCells>` : '';
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
${cols}
<sheetData>${rowsXml}</sheetData>
${mergeXml}
</worksheet>`;
}
function buildXlsxBlob(sheetName, rowsDef, colWidths){
  const encoder = new TextEncoder();
  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>`;
  const rootRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`;
  const workbookXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="${xmlEscape(sheetName)}" sheetId="1" r:id="rId1"/></sheets></workbook>`;
  const workbookRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`;
  const files = [
    {name:'[Content_Types].xml', data: encoder.encode(contentTypes)},
    {name:'_rels/.rels', data: encoder.encode(rootRels)},
    {name:'xl/workbook.xml', data: encoder.encode(workbookXml)},
    {name:'xl/_rels/workbook.xml.rels', data: encoder.encode(workbookRels)},
    {name:'xl/styles.xml', data: encoder.encode(xlsxStylesXml())},
    {name:'xl/worksheets/sheet1.xml', data: encoder.encode(xlsxSheetXml(rowsDef, colWidths))}
  ];
  const zipBytes = makeZip(files);
  return new Blob([zipBytes], {type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
}
function downloadBlob(filename, blob){
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ===================== Subir inventario (.xlsx) =====================
 * Lee un archivo .xlsx con el mismo formato que "Descargar inventario"
 * (o editado en Excel — Excel re-comprime con DEFLATE al guardar, por eso
 * hay un descompresor DEFLATE escrito a mano abajo, sin librerías externas). */

// Minimal raw DEFLATE (RFC1951) decoder — algoritmo de dominio público (estilo puff.c/tinf), sin dependencias.
function inflateRaw(input){
  let pos = 0; // byte position
  let bitBuf = 0, bitCnt = 0;
  function getBit(){
    if(bitCnt === 0){ bitBuf = input[pos++]; bitCnt = 8; }
    const b = bitBuf & 1; bitBuf >>>= 1; bitCnt--; return b;
  }
  function getBits(n){
    let v = 0;
    for(let i=0;i<n;i++) v |= getBit() << i;
    return v;
  }
  function alignByte(){ bitCnt = 0; bitBuf = 0; }

  function buildHuffman(lengths){
    const MAXBITS = 15;
    const counts = new Array(MAXBITS+1).fill(0);
    for(const l of lengths) counts[l]++;
    counts[0] = 0;
    const offsets = new Array(MAXBITS+2).fill(0);
    for(let i=1;i<=MAXBITS;i++) offsets[i+1] = offsets[i] + counts[i];
    const symbols = new Array(lengths.length).fill(0);
    for(let i=0;i<lengths.length;i++){
      if(lengths[i]) symbols[offsets[lengths[i]]++] = i;
    }
    return {counts, symbols};
  }
  function decodeSymbol(huff){
    let code = 0, first = 0, index = 0;
    for(let len=1; len<=15; len++){
      code |= getBit();
      const count = huff.counts[len];
      if(code - first < count) return huff.symbols[index + (code - first)];
      index += count;
      first += count;
      first <<= 1;
      code <<= 1;
    }
    throw new Error('bad huffman code');
  }

  const LEN_BASE = [3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258];
  const LEN_EXTRA = [0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0];
  const DIST_BASE = [1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577];
  const DIST_EXTRA = [0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13];
  const CLC_ORDER = [16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];

  let fixedLit = null, fixedDist = null;
  function getFixedTrees(){
    if(fixedLit) return [fixedLit, fixedDist];
    const litLens = new Array(288);
    for(let i=0;i<144;i++) litLens[i]=8;
    for(let i=144;i<256;i++) litLens[i]=9;
    for(let i=256;i<280;i++) litLens[i]=7;
    for(let i=280;i<288;i++) litLens[i]=8;
    const distLens = new Array(30).fill(5);
    fixedLit = buildHuffman(litLens);
    fixedDist = buildHuffman(distLens);
    return [fixedLit, fixedDist];
  }

  let out = new Uint8Array(Math.max(64, input.length*3));
  let outPos = 0;
  function ensureCap(n){
    if(outPos + n > out.length){
      let newLen = out.length*2;
      while(newLen < outPos+n) newLen *= 2;
      const bigger = new Uint8Array(newLen);
      bigger.set(out.subarray(0,outPos));
      out = bigger;
    }
  }
  function pushByte(b){ ensureCap(1); out[outPos++] = b; }

  function inflateBlockData(litTree, distTree){
    for(;;){
      const sym = decodeSymbol(litTree);
      if(sym < 256){ pushByte(sym); continue; }
      if(sym === 256) return; // end of block
      const li = sym - 257;
      if(li >= LEN_BASE.length) throw new Error('bad length code');
      const length = LEN_BASE[li] + getBits(LEN_EXTRA[li]);
      const dsym = decodeSymbol(distTree);
      if(dsym >= DIST_BASE.length) throw new Error('bad dist code');
      const dist = DIST_BASE[dsym] + getBits(DIST_EXTRA[dsym]);
      ensureCap(length);
      let from = outPos - dist;
      for(let i=0;i<length;i++){ out[outPos++] = out[from++]; }
    }
  }

  let bfinal = 0;
  do {
    bfinal = getBit();
    const btype = getBits(2);
    if(btype === 0){
      alignByte();
      const len = input[pos] | (input[pos+1]<<8); pos += 4; // skip len+nlen
      ensureCap(len);
      for(let i=0;i<len;i++){ out[outPos++] = input[pos++]; }
    } else if(btype === 1){
      const [lit, dist] = getFixedTrees();
      inflateBlockData(lit, dist);
    } else if(btype === 2){
      const hlit = getBits(5) + 257;
      const hdist = getBits(5) + 1;
      const hclen = getBits(4) + 4;
      const clLens = new Array(19).fill(0);
      for(let i=0;i<hclen;i++) clLens[CLC_ORDER[i]] = getBits(3);
      const clTree = buildHuffman(clLens);
      const lengths = [];
      while(lengths.length < hlit + hdist){
        const sym = decodeSymbol(clTree);
        if(sym < 16){ lengths.push(sym); }
        else if(sym === 16){
          const rep = getBits(2) + 3;
          const prev = lengths[lengths.length-1];
          for(let i=0;i<rep;i++) lengths.push(prev);
        } else if(sym === 17){
          const rep = getBits(3) + 3;
          for(let i=0;i<rep;i++) lengths.push(0);
        } else if(sym === 18){
          const rep = getBits(7) + 11;
          for(let i=0;i<rep;i++) lengths.push(0);
        } else throw new Error('bad cl symbol');
      }
      const litLens = lengths.slice(0, hlit);
      const distLens = lengths.slice(hlit, hlit+hdist);
      const litTree = buildHuffman(litLens);
      const distTree = buildHuffman(distLens);
      inflateBlockData(litTree, distTree);
    } else {
      throw new Error('bad block type');
    }
  } while(!bfinal);

  return out.subarray(0, outPos);
}

function readZipEntries(bytes){
  let eocdPos = -1;
  for(let i = bytes.length - 22; i >= 0; i--){
    if(bytes[i]===0x50 && bytes[i+1]===0x4b && bytes[i+2]===0x05 && bytes[i+3]===0x06){
      eocdPos = i; break;
    }
  }
  if(eocdPos < 0) throw new Error('El archivo no es un .xlsx/.zip válido');
  const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const totalEntries = dv.getUint16(eocdPos+10, true);
  const cdOffset = dv.getUint32(eocdPos+16, true);

  const entries = {};
  let pos = cdOffset;
  for(let n=0; n<totalEntries; n++){
    if(dv.getUint32(pos,true) !== 0x02014b50) throw new Error('Encabezado de directorio central inválido');
    const method = dv.getUint16(pos+10, true);
    const compSize = dv.getUint32(pos+20, true);
    const uncompSize = dv.getUint32(pos+24, true);
    const nameLen = dv.getUint16(pos+28, true);
    const extraLen = dv.getUint16(pos+30, true);
    const commentLen = dv.getUint16(pos+32, true);
    const localOffset = dv.getUint32(pos+42, true);
    const name = new TextDecoder().decode(bytes.subarray(pos+46, pos+46+nameLen));
    pos += 46 + nameLen + extraLen + commentLen;

    if(dv.getUint32(localOffset,true) !== 0x04034b50) throw new Error('Encabezado local inválido');
    const lNameLen = dv.getUint16(localOffset+26, true);
    const lExtraLen = dv.getUint16(localOffset+28, true);
    const dataStart = localOffset + 30 + lNameLen + lExtraLen;
    const compData = bytes.subarray(dataStart, dataStart + compSize);

    let data;
    if(method === 0){
      data = compData;
    } else if(method === 8){
      data = inflateRaw(compData);
    } else {
      throw new Error('Método de compresión no soportado (' + method + ') en ' + name);
    }
    entries[name] = data;
  }
  return entries;
}

function xlsxColLetterToIndex(letters){
  let idx = 0;
  for(let i=0;i<letters.length;i++) idx = idx*26 + (letters.charCodeAt(i) - 64);
  return idx - 1;
}

// Solo extrae el texto XML crudo (sin DOMParser, que no existe en los Web
// Workers de todos los navegadores) — esta parte SÍ puede correr en el
// worker, que es donde va el trabajo pesado de descomprimir.
function extractXlsxTexts(entries){
  const dec = new TextDecoder();
  const sheetText = entries['xl/sharedStrings.xml'] ? dec.decode(entries['xl/sharedStrings.xml']) : null;
  let sheetKey = Object.keys(entries).find(k => /^xl\/worksheets\/sheet1\.xml$/.test(k))
    || Object.keys(entries).find(k => /^xl\/worksheets\/sheet\d+\.xml$/.test(k));
  if(!sheetKey) throw new Error('No se encontró la hoja dentro del archivo');
  return { sheetXmlText: dec.decode(entries[sheetKey]), sharedStringsXmlText: sheetText };
}

// El DOMParser sí es rápido (nativo, en C++) y solo existe en el hilo
// principal, así que esta parte corre ahí — no congela la página.
function parseXlsxSheetFromTexts(sheetXmlText, sharedStringsXmlText){
  const parser = new DOMParser();
  let sharedStrings = [];
  if(sharedStringsXmlText){
    const ssXml = parser.parseFromString(sharedStringsXmlText, 'application/xml');
    sharedStrings = Array.from(ssXml.getElementsByTagName('si')).map(si => si.textContent || '');
  }
  const sheetXml = parser.parseFromString(sheetXmlText, 'application/xml');
  const rowsOut = [];
  const rowEls = sheetXml.getElementsByTagName('row');
  for(let r=0;r<rowEls.length;r++){
    const rowEl = rowEls[r];
    const row = [];
    const cellEls = rowEl.getElementsByTagName('c');
    for(let c=0;c<cellEls.length;c++){
      const cellEl = cellEls[c];
      const ref = cellEl.getAttribute('r') || '';
      const colLetters = (ref.match(/^[A-Z]+/) || ['A'])[0];
      const colIdx = xlsxColLetterToIndex(colLetters);
      const type = cellEl.getAttribute('t');
      let value = '';
      if(type === 'inlineStr'){
        const isEl = cellEl.getElementsByTagName('is')[0];
        value = isEl ? (isEl.textContent || '') : '';
      } else {
        const vEl = cellEl.getElementsByTagName('v')[0];
        const raw = vEl ? (vEl.textContent || '') : '';
        if(type === 's'){
          const i = parseInt(raw, 10);
          value = sharedStrings[i] !== undefined ? sharedStrings[i] : '';
        } else {
          value = raw;
        }
      }
      row[colIdx] = value;
    }
    rowsOut.push(row);
  }
  return rowsOut;
}
function parseXlsxSheet(entries){
  const {sheetXmlText, sharedStringsXmlText} = extractXlsxTexts(entries);
  return parseXlsxSheetFromTexts(sheetXmlText, sharedStringsXmlText);
}

function readFileAsArrayBuffer(file){
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error || new Error('No se pudo leer el archivo'));
    reader.readAsArrayBuffer(file);
  });
}

function normalizeHeaderCell(s){
  return String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').trim().toUpperCase();
}

function importInventoryRows(rows){
  let headerRowIdx = -1, headerMap = {};
  for(let r=0;r<rows.length;r++){
    const row = rows[r] || [];
    const norm = row.map(normalizeHeaderCell);
    const idx = norm.findIndex(v => v === 'NO. PRODUCTO' || v === 'NO PRODUCTO');
    if(idx >= 0){
      headerRowIdx = r;
      norm.forEach((v,i) => { if(v) headerMap[v] = i; });
      break;
    }
  }
  if(headerRowIdx < 0) throw new Error('No se encontró la fila de encabezados ("NO. PRODUCTO") en el archivo');

  const colRef = headerMap['NO. PRODUCTO'] !== undefined ? headerMap['NO. PRODUCTO'] : headerMap['NO PRODUCTO'];
  const colZebra = headerMap['REFERENCIA'];
  const colQtyUnid = headerMap['CANTIDAD UNIDADES'];
  const colContador = headerMap['CONTADOR'];
  const colCosto = headerMap['COSTO'];
  const colPrecio = headerMap['PRECIO'];

  const area = activeArea();
  let procesados = 0, sinCoincidencia = 0;

  // Mapa inverso código-Zebra→ref calculado UNA sola vez (antes se recorría
  // todo internalCodes por cada fila sin "NO. PRODUCTO", lo que podía tardar
  // minutos y congelar la página con archivos de varios miles de filas).
  let zebraToRef = null;
  if(colZebra !== undefined){
    zebraToRef = {};
    for(const k in internalCodes) zebraToRef[internalCodes[k]] = k;
  }

  for(let r=headerRowIdx+1; r<rows.length; r++){
    const row = rows[r] || [];
    let ref = colRef !== undefined ? String(row[colRef]||'').trim() : '';
    if(!ref && zebraToRef){
      const zebra = String(row[colZebra]||'').trim();
      if(zebra && zebraToRef[zebra]) ref = zebraToRef[zebra];
    }
    if(!ref) continue;
    if(!PRODUCTS_BY_REF[ref]){ sinCoincidencia++; continue; }

    let qty = 0;
    if(colQtyUnid !== undefined && row[colQtyUnid] !== undefined && row[colQtyUnid] !== '') qty = parseFloat(row[colQtyUnid]) || 0;
    else if(colContador !== undefined && row[colContador] !== undefined && row[colContador] !== '') qty = parseFloat(row[colContador]) || 0;
    if(qty <= 0) continue;

    const inv = getInv(ref);
    inv.stock = (inv.stock || 0) + qty;
    area.counts[ref] = (area.counts[ref] || 0) + qty;
    if(colCosto !== undefined && row[colCosto] !== undefined && row[colCosto] !== '') inv.cost = parseFloat(row[colCosto]) || inv.cost;
    if(colPrecio !== undefined && row[colPrecio] !== undefined && row[colPrecio] !== '') inv.price = parseFloat(row[colPrecio]) || inv.price;
    procesados++;
  }

  saveInventory();
  saveMeta();
  return {procesados, sinCoincidencia};
}

// El descomprimido (.xlsx→zip→DEFLATE→XML) puede tardar con archivos grandes;
// se hace en un Worker aparte para que la página NUNCA se congele mientras
// carga — el hilo principal queda libre y el botón muestra "Cargando...".
// Sigue siendo 100% código propio, sin librerías ni servidores externos.
let inventoryUploadWorker = null;
function getInventoryUploadWorker(){
  if(inventoryUploadWorker) return inventoryUploadWorker;
  const workerBody = [
    inflateRaw.toString(),
    readZipEntries.toString(),
    extractXlsxTexts.toString(),
    'self.onmessage = function(e){',
    '  try{',
    '    var bytes = new Uint8Array(e.data);',
    '    var entries = readZipEntries(bytes);',
    '    var texts = extractXlsxTexts(entries);',
    '    self.postMessage({ok:true, texts:texts});',
    '  } catch(err){',
    '    self.postMessage({ok:false, error:(err && err.message) || String(err)});',
    '  }',
    '};'
  ].join('\n');
  try{
    const blob = new Blob([workerBody], {type:'application/javascript'});
    inventoryUploadWorker = new Worker(URL.createObjectURL(blob));
  } catch(err){
    inventoryUploadWorker = null;
  }
  return inventoryUploadWorker;
}

function parseXlsxInBackground(bytes){
  const worker = getInventoryUploadWorker();
  if(!worker){
    // Sin soporte de Worker (muy raro): se procesa igual en el hilo principal.
    const entries = readZipEntries(bytes);
    return Promise.resolve(parseXlsxSheet(entries));
  }
  return new Promise((resolve, reject) => {
    const onMessage = (e) => {
      worker.removeEventListener('message', onMessage);
      if(e.data && e.data.ok){
        try{
          resolve(parseXlsxSheetFromTexts(e.data.texts.sheetXmlText, e.data.texts.sharedStringsXmlText));
        } catch(err){ reject(err); }
      } else {
        reject(new Error((e.data && e.data.error) || 'Error al procesar el archivo'));
      }
    };
    worker.addEventListener('message', onMessage);
    const copy = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
    worker.postMessage(copy, [copy]);
  });
}

async function handleInventoryUpload(event){
  const file = event.target.files && event.target.files[0];
  event.target.value = '';
  if(!file) return;
  const link = document.querySelector('.inv-upload-link');
  const originalLabel = link ? link.textContent : '';
  if(link){ link.textContent = '⏳ Cargando...'; link.style.pointerEvents = 'none'; link.style.opacity = '.6'; }
  try{
    const buf = await readFileAsArrayBuffer(file);
    const bytes = new Uint8Array(buf);
    const rows = await parseXlsxInBackground(bytes);
    const {procesados, sinCoincidencia} = importInventoryRows(rows);
    if(procesados === 0){
      showToast('No se encontraron artículos válidos para cargar en el archivo.');
    } else {
      showToast(`Inventario cargado: ${procesados} artículo(s) agregado(s) al conteo.` + (sinCoincidencia ? ` (${sinCoincidencia} sin coincidencia)` : ''));
    }
    renderCountedItemsList();
    renderInventoryStats();
    renderCatalogCards();
    renderProducts();
  } catch(err){
    console.error(err);
    showToast('No se pudo cargar el archivo: ' + (err && err.message ? err.message : 'formato no reconocido'));
  } finally {
    // Siempre se restaura el botón, incluso si algo falló, para que nunca
    // se quede trabado en "Cargando...".
    if(link){ link.textContent = originalLabel || '⬆ Subir inventario'; link.style.pointerEvents = ''; link.style.opacity = ''; }
  }
}

/* ---------- Exportar "Reporte de artículos contados" con el formato EUROTRUCK ---------- */
function downloadCountedCsv(){ downloadCountedXlsx(); }
async function downloadCountedXlsx(){
  const area = activeArea();
  await ensureInternalCodes(Object.keys(area.counts));
  const S = XLSX_STYLES;
  const fecha = new Date().toLocaleString('es-DO', {day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit', second:'2-digit'});
  const rows = [];
  rows.push([{v:'EUROTRUCK SRL', style:S.bannerTitle, merge:11}]);
  rows.push([{v:'SISTEMA DE INVENTARIO', style:S.bannerSub, merge:11}]);
  rows.push([
    {v:`REPORTE DE PRODUCTOS PARA CONTEO FÍSICO DE FECHA ${fecha}`, style:S.bannerInfoLeft, merge:3},
    {v:'ESTA COLUMNA ES OBLIGATORIA', style:S.bannerObligatoria, merge:3},
    {v:'ESTAS TRES COLUMNAS SON INFORMATIVAS, NO SE CARGAN', style:S.bannerInformativas, merge:5}
  ]);
  rows.push([
    {v:'ALMACÉN', style:S.colHeaderBlueDark}, {v:'NO. PRODUCTO', style:S.colHeaderBlueDark}, {v:'DESCRIPCIÓN PRODUCTO', style:S.colHeaderBlueDark},
    {v:'CONTADOR', style:S.colHeaderBlueMed}, {v:'CANTIDAD EMP. MAYOR', style:S.colHeaderBlueMed}, {v:'CANTIDAD UNIDADES', style:S.colHeaderBlueMed},
    {v:'REFERENCIA', style:S.colHeaderYellow}, {v:'ESTANTE', style:S.colHeaderYellow}, {v:'TRAMO', style:S.colHeaderYellow}, {v:'COSTO', style:S.colHeaderYellow}, {v:'PRECIO', style:S.colHeaderYellow}
  ]);
  Object.keys(area.counts).forEach(ref=>{
    const p = PRODUCTS_BY_REF[ref];
    const inv = getInv(ref);
    const qty = area.counts[ref];
    const stock = Number(inv.stock)||0;
    const isLow = stock < LOW_STOCK_THRESHOLD;
    const centerStyle = isLow ? S.dataCenterRed : S.dataCenter;
    const leftStyle = isLow ? S.dataLeftRed : S.dataLeft;
    const descripcion = (p?p.title:ref) + (isLow ? ' — ⚠ BAJO STOCK' : '');
    rows.push([
      {v:'01', style:centerStyle},
      {v:ref, style:centerStyle},
      {v:descripcion, style:leftStyle},
      {v:qty, t:'n', style:centerStyle},
      {v:'', t:'n', style:centerStyle},
      {v:qty, t:'n', style:centerStyle},
      {v:getInternalCode(ref), style:centerStyle},
      {v:area.estante, style:centerStyle},
      {v:area.tramo, style:centerStyle},
      {v:inv.cost||'', t:'n', style:centerStyle},
      {v:inv.price||'', t:'n', style:centerStyle}
    ]);
  });
  const colWidths = [10.86, 20.86, 45.86, 18.86, 22.86, 20.86, 22.86, 15.86, 12, 12, 12];
  const blob = buildXlsxBlob('Conteo Físico', rows, colWidths);
  downloadBlob(`EUROTRUCK_INVENTARIO_area_${area.tramo}-${area.estante}.xlsx`, blob);
}
function downloadLowStockCsv(){ downloadLowStockXlsx(); }
async function downloadLowStockXlsx(){
  const list = computeLowStockList();
  await ensureInternalCodes(list.map(p=>p.ref));
  const S = XLSX_STYLES;
  const fecha = new Date().toLocaleString('es-DO', {day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit', second:'2-digit'});
  const rows = [];
  rows.push([{v:'EUROTRUCK SRL', style:S.bannerTitleRed, merge:12}]);
  rows.push([{v:'SISTEMA DE INVENTARIO', style:S.bannerSubRed, merge:12}]);
  rows.push([
    {v:`⚠ PEDIDO POR BAJO STOCK DE FECHA ${fecha}`, style:S.bannerInfoLeft, merge:4},
    {v:'ESTA COLUMNA ES OBLIGATORIA', style:S.bannerObligatoria, merge:3},
    {v:'ESTAS COLUMNAS SON INFORMATIVAS, NO SE CARGAN', style:S.bannerInformativas, merge:5}
  ]);
  rows.push([
    {v:'NO. PRODUCTO', style:S.colHeaderRedDark}, {v:'DESCRIPCIÓN PRODUCTO', style:S.colHeaderRedDark}, {v:'MARCA', style:S.colHeaderRedDark}, {v:'UBICACIÓN', style:S.colHeaderRedDark},
    {v:'CANTIDAD A PEDIR', style:S.colHeaderRedMed}, {v:'STOCK ACTUAL', style:S.colHeaderRedMed}, {v:'MOVIMIENTO (VENDIDAS)', style:S.colHeaderRedMed},
    {v:'REFERENCIA', style:S.colHeaderYellow}, {v:'GTIN', style:S.colHeaderYellow}, {v:'ESTANTE', style:S.colHeaderYellow}, {v:'COSTO', style:S.colHeaderYellow}, {v:'PRECIO', style:S.colHeaderYellow}
  ]);
  list.forEach(p=>{
    const inv = peekInv(p.ref);
    const stock = Number(inv.stock)||0;
    const sold = Number(inv.sold)||0;
    const sugerido = Math.max(sold, LOW_STOCK_THRESHOLD) || LOW_STOCK_THRESHOLD;
    rows.push([
      {v:p.ref, style:S.dataCenterRed},
      {v:p.title, style:S.dataLeftRed},
      {v:p.brand||'', style:S.dataCenterRed},
      {v:inv.location||'', style:S.dataCenterRed},
      {v:sugerido, t:'n', style:S.dataCenterRed},
      {v:stock, t:'n', style:S.dataCenterRed},
      {v:sold, t:'n', style:S.dataCenterRed},
      {v:getInternalCode(p.ref), style:S.dataCenter},
      {v:inv.gtin||p.gtin||'', style:S.dataCenter},
      {v:inv.location||'', style:S.dataCenter},
      {v:inv.cost||'', t:'n', style:S.dataCenter},
      {v:inv.price||'', t:'n', style:S.dataCenter}
    ]);
  });
  const colWidths = [20.86, 45.86, 16, 14, 16, 14, 20, 14.86, 16, 12, 12, 12];
  const blob = buildXlsxBlob('Pedido bajo stock', rows, colWidths);
  downloadBlob(`EUROTRUCK_PEDIDO_BAJO_STOCK_${new Date().toISOString().slice(0,10)}.xlsx`, blob);
}
async function downloadCatalogCsv(){
  const list = visibleProducts();
  await ensureInternalCodes(list.map(p=>p.ref));
  const rows = [['SKU','Código interno Zebra','Producto','Marca','Categoría','Stock','Ubicación','GTIN principal','Códigos alternativos','Costo','Precio final']];
  list.forEach(p=>{
    const inv = getInv(p.ref);
    rows.push([
      p.ref,
      getInternalCode(p.ref),
      p.title,
      p.brand,
      p.cat,
      inv.stock||0,
      inv.location||'',
      inv.gtin||p.gtin||'',
      (inv.altCodes||[]).join(' | '),
      inv.cost||'',
      inv.price||''
    ]);
  });
  downloadCsv('catalogo_completo.csv', rows);
}

/* ---------- Historial de escaneos ---------- */
function renderScanHistoryTable(){
  const histBody = document.getElementById('scanHistoryBody');
  if(!histBody) return;
  histBody.innerHTML = scanHistory.map((s,i)=>`<tr class="${i===0?'is-new-scan':''}"><td>${s.time}</td><td>${s.ref}</td><td>${s.title}</td><td>${s.qty||1}</td><td>${s.stock}</td></tr>`).join('')
    || '<tr><td colspan="5" style="color:#6f83a0;">Sin escaneos todavía.</td></tr>';
}

/* ---------- Reporte mensual / más vendidos ---------- */
function initReportFilters(){
  const monthEl = document.getElementById('reportMonth');
  const yearEl = document.getElementById('reportYear');
  if(monthEl && !monthEl.dataset.init){
    const months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
    monthEl.innerHTML = months.map((m,i)=>`<option value="${i+1}">${m}</option>`).join('');
    monthEl.value = new Date().getMonth()+1;
    monthEl.dataset.init = '1';
    monthEl.addEventListener('change', renderTopSellers);
  }
  if(yearEl && !yearEl.dataset.init){
    yearEl.value = new Date().getFullYear();
    yearEl.dataset.init = '1';
    yearEl.addEventListener('change', renderTopSellers);
  }
}
function monthlySales(month, year){
  const map = {};
  salesLog.forEach(s=>{
    const d = new Date(s.date);
    if((d.getMonth()+1) !== month || d.getFullYear() !== year) return;
    if(!map[s.ref]) map[s.ref] = {ref:s.ref, title:s.title, qty:0};
    map[s.ref].qty += s.qty;
  });
  return Object.values(map).sort((a,b)=>b.qty-a.qty);
}
function renderTopSellers(){
  const wrap = document.getElementById('topSellersList');
  if(!wrap) return;
  const monthEl = document.getElementById('reportMonth');
  const yearEl = document.getElementById('reportYear');
  const month = monthEl && monthEl.value ? Number(monthEl.value) : (new Date().getMonth()+1);
  const year = yearEl && yearEl.value ? Number(yearEl.value) : new Date().getFullYear();
  const rows = monthlySales(month, year).slice(0,15);
  if(!rows.length){ wrap.innerHTML = '<div class="panel-empty">No hay ventas registradas para ese mes — se llena al registrar una salida o al marcar una cotización como enviada.</div>'; return; }
  wrap.innerHTML = rows.map((r,i)=>{
    const p = PRODUCTS_BY_REF[r.ref];
    return `<div class="top-seller-row">
      <span class="rank">#${i+1}</span>
      <img src="${p?p.img:''}" alt="" onerror="this.style.opacity=.25">
      <b>${r.title} <small style="color:#8b96ab;">(${r.ref})</small></b>
      <span>${r.qty} vendidos</span>
    </div>`;
  }).join('');
}
function printActiveReport(){
  const area = activeArea();
  const rows = Object.keys(area.counts).map(ref=>{
    const p = PRODUCTS_BY_REF[ref];
    return {ref, title: p?p.title:ref, qty: area.counts[ref]};
  });
  const win = window.open('', '_blank');
  if(!win) { showToast('Habilita las ventanas emergentes para imprimir.'); return; }
  win.document.write(`<html><head><title>Conteo — Tramo ${area.tramo} / Estante ${area.estante}</title>
    <style>body{font-family:Arial,sans-serif;padding:24px;color:#1a1f2b;}h2{margin-bottom:2px;}
    table{width:100%;border-collapse:collapse;margin-top:14px;}td,th{border-bottom:1px solid #ccc;padding:7px 9px;text-align:left;font-size:13px;}</style>
    </head><body>
    <h2>Eurotruck — Conteo de inventario</h2>
    <p>Área: Tramo ${area.tramo} · Estante ${area.estante} — ${new Date().toLocaleString('es-DO')}</p>
    <table><thead><tr><th>SKU</th><th>Producto</th><th>Cantidad contada</th></tr></thead><tbody>
    ${rows.map(r=>`<tr><td>${r.ref}</td><td>${r.title}</td><td>${r.qty}</td></tr>`).join('') || '<tr><td colspan="3">Sin artículos contados.</td></tr>'}
    </tbody></table>
    </body></html>`);
  win.document.close();
  setTimeout(()=>win.print(), 300);
}
function printMonthlyReport(){
  const monthEl = document.getElementById('reportMonth');
  const yearEl = document.getElementById('reportYear');
  const month = Number(monthEl.value);
  const year = Number(yearEl.value);
  const monthName = monthEl.options[monthEl.selectedIndex] ? monthEl.options[monthEl.selectedIndex].text : month;
  const rows = monthlySales(month, year);
  const win = window.open('', '_blank');
  if(!win) { showToast('Habilita las ventanas emergentes para imprimir.'); return; }
  win.document.write(`<html><head><title>Reporte de ventas — ${monthName} ${year}</title>
    <style>body{font-family:Arial,sans-serif;padding:24px;color:#1a1f2b;}h2{margin-bottom:2px;}
    table{width:100%;border-collapse:collapse;margin-top:14px;}td,th{border-bottom:1px solid #ccc;padding:7px 9px;text-align:left;font-size:13px;}</style>
    </head><body>
    <h2>Eurotruck — Reporte de más vendidos</h2>
    <p>${monthName} ${year}</p>
    <table><thead><tr><th>#</th><th>SKU</th><th>Producto</th><th>Vendidos</th></tr></thead><tbody>
    ${rows.map((r,i)=>`<tr><td>${i+1}</td><td>${r.ref}</td><td>${r.title}</td><td>${r.qty}</td></tr>`).join('') || '<tr><td colspan="4">Sin ventas registradas ese mes.</td></tr>'}
    </tbody></table>
    </body></html>`);
  win.document.close();
  setTimeout(()=>win.print(), 300);
}

/* ---------- Compatibilidad con nombres anteriores ---------- */
function renderInventoryTable(){ renderCatalogCards(); renderScanHistoryTable(); }
function renderGondolaChips(){ renderAreaSelect(); }

/* ================= CART (left drawer) ================= */
let cart = []; // [{ref, qty}]
function openCart(){ document.getElementById('cartOverlay').classList.add('is-open'); renderCart(); }
function closeCart(){ document.getElementById('cartOverlay').classList.remove('is-open'); }
function addToCart(ref){
  const line = cart.find(c=>c.ref===ref);
  if(line) line.qty++; else cart.push({ref, qty:1});
  updateCartCount();
  openCart();
  showToast('Agregado al carrito.');
}
function updateCartCount(){
  document.getElementById('cartCount').textContent = cart.reduce((n,c)=>n+c.qty,0);
}
function renderCart(){
  const wrap = document.getElementById('cartLines');
  const summary = document.getElementById('cartSummary');
  if(!cart.length){
    wrap.innerHTML = `<div class="cart-empty">${tr('Tu carrito está vacío. Agrega piezas desde el catálogo.','Your cart is empty. Add parts from the catalog.')}</div>`;
    summary.style.display = 'none';
    return;
  }
  summary.style.display = 'block';
  wrap.innerHTML = cart.map(c=>{
    const p = PRODUCTS_BY_REF[c.ref];
    if(!p) return '';
    return `<div class="cart-line">
      <img src="${p.img}" alt="${p.title}">
      <div class="cart-line-info"><b>${p.title}</b><span>SKU ${p.sku}</span></div>
      <div class="qty-control">
        <button onclick="changeCartQty('${c.ref}',-1)">−</button><span>${c.qty}</span><button onclick="changeCartQty('${c.ref}',1)">+</button>
      </div>
      <button class="cart-remove" onclick="removeFromCart('${c.ref}')">${tr('Quitar','Remove')}</button>
    </div>`;
  }).join('');
}
function changeCartQty(ref, delta){
  const line = cart.find(c=>c.ref===ref);
  if(!line) return;
  line.qty += delta;
  if(line.qty<=0) cart = cart.filter(c=>c.ref!==ref);
  updateCartCount();
  renderCart();
}
function removeFromCart(ref){
  cart = cart.filter(c=>c.ref!==ref);
  updateCartCount();
  renderCart();
}
function proceedToRegistration(){
  closeCart();
  document.getElementById('registro').scrollIntoView({behavior:'smooth'});
  showToast(tr('Completa tus datos abajo para confirmar tu cotización.','Fill in your details below to confirm your quote.'));
}

/* ---------- Registration form -> creates quotation (order), PDF, WhatsApp notice ---------- */
document.getElementById('regForm').addEventListener('submit', function(e){
  e.preventDefault();
  const company = document.getElementById('f-company').value.trim();
  const rnc = document.getElementById('f-rnc').value.trim();
  const phone = document.getElementById('f-phone').value.trim();
  const email = document.getElementById('f-email').value.trim();
  const brand = document.getElementById('f-brand').value;
  const parts = document.getElementById('f-parts').value.trim();
  const wantsService = document.getElementById('f-service').checked;
  if(!company || !phone){
    showToast('Completa los campos obligatorios (*)');
    return;
  }
  const items = cart.map(c=>{
    const p = PRODUCTS_BY_REF[c.ref];
    if(!p) return null;
    const inv = getInv(p.ref);
    return {ref:p.ref, title:p.title, qty:c.qty, price: Number(inv.price)||0};
  }).filter(Boolean);

  const order = {
    id: 'EC-'+Date.now().toString(36).toUpperCase(),
    company, rnc, phone, email, brand, parts, wantsService,
    items, createdAt: new Date().toISOString(),
    status: 'nueva'
  };
  let pdfOk = false;
  if(items.length){
    ordersState.unshift(order);
    saveOrders();
    renderOrdersGrid();
    pdfOk = generateQuotePdf(order);
  }

  let msg = `Registro de empresa Eurotruck:\nEmpresa: ${company}\n`;
  if(rnc) msg += `RNC: ${rnc}\n`;
  msg += `Teléfono: ${phone}\n`;
  if(email) msg += `Correo: ${email}\n`;
  msg += `Marca principal: ${brand}\n`;
  if(parts) msg += `Piezas requeridas: ${parts}\n`;
  if(wantsService) msg += `Solicita también servicio mecánico / instalación a domicilio.\n`;
  if(items.length){
    msg += `\nPiezas en el carrito (orden ${order.id}):\n`;
    items.forEach(it=> msg += `• ${it.title} (ref. ${it.ref}) x${it.qty}\n`);
  }
  window.open('https://wa.me/'+EUROTRUCK_WHATSAPP+'?text='+encodeURIComponent(msg), '_blank');
  if(items.length){
    showToast(pdfOk ? 'Cotización guardada, PDF descargado y WhatsApp abierto...' : 'Cotización guardada y WhatsApp abierto (PDF no disponible sin conexión).');
  } else {
    showToast('Abriendo WhatsApp con tu solicitud...');
  }
  cart = [];
  updateCartCount();
  this.reset();
});

/* ---------- PDF quotation (uses the order's own editable prices) ---------- */
function generateQuotePdf(order){
  try{
    const { jsPDF } = window.jspdf || {};
    if(!jsPDF){ return false; }
    const doc = new jsPDF();
    doc.setFontSize(16); doc.text('EUROTRUCK — Resumen de Cotización', 14, 18);
    doc.setFontSize(10);
    doc.text(`Orden: ${order.id}`, 14, 27);
    doc.text(`Fecha: ${new Date(order.createdAt).toLocaleString('es-DO')}`, 14, 33);
    doc.text(`Empresa: ${order.company}`, 14, 41);
    if(order.rnc) doc.text(`RNC: ${order.rnc}`, 14, 47);
    doc.text(`Teléfono: ${order.phone}`, 14, 53);
    if(order.email) doc.text(`Correo: ${order.email}`, 14, 59);

    let y = 70;
    doc.setFontSize(11); doc.text('SKU', 14, y); doc.text('Descripción', 44, y); doc.text('Cant.', 140, y); doc.text('Precio', 160, y);
    y += 4; doc.line(14, y, 196, y); y += 6;
    doc.setFontSize(9);
    let total = 0, hasAllPrices = true;
    (order.items||[]).forEach(it=>{
      const priceEach = Number(it.price)||0;
      const lineHasPrice = priceEach > 0;
      if(!lineHasPrice) hasAllPrices = false;
      const lineTotal = priceEach * it.qty;
      total += lineTotal;
      doc.text(String(it.ref), 14, y);
      doc.text(String(it.title).slice(0,55), 44, y);
      doc.text(String(it.qty), 140, y);
      doc.text(lineHasPrice ? ('RD$ '+lineTotal.toFixed(2)) : 'Por cotizar', 160, y);
      y += 7;
      if(y > 275){ doc.addPage(); y = 20; }
    });
    y += 4; doc.line(14, y, 196, y); y += 8;
    doc.setFontSize(11);
    doc.text(hasAllPrices ? `Total estimado: RD$ ${total.toFixed(2)}` : 'Total sujeto a confirmación — un asesor te contactará con precios finales.', 14, y);
    y += 12;
    doc.setFontSize(8); doc.setTextColor(120);
    doc.text('Este documento es un resumen informativo. La cotización final la confirma un asesor de Eurotruck.', 14, y, {maxWidth:180});

    doc.save(`Cotizacion_${order.id}.pdf`);
    return true;
  }catch(err){ return false; }
}

function sendOrderWhatsApp(orderId){
  const o = ordersState.find(o=>o.id===orderId);
  if(!o) return;
  let msg = `Cotización Eurotruck — Orden ${o.id}\nEmpresa: ${o.company}\n\n`;
  let total = 0, hasAllPrices = true;
  (o.items||[]).forEach(it=>{
    const price = Number(it.price)||0;
    if(!price) hasAllPrices = false;
    const lineTotal = price*it.qty;
    total += lineTotal;
    msg += `• ${it.title} (ref. ${it.ref}) x${it.qty} — ${price? 'RD$ '+lineTotal.toFixed(2) : 'por cotizar'}\n`;
  });
  msg += hasAllPrices ? `\nTotal: RD$ ${total.toFixed(2)}` : '\nTotal sujeto a confirmación de precios pendientes.';
  const clientPhone = (o.phone||'').replace(/\D/g,'');
  const target = clientPhone.length >= 10 ? clientPhone : EUROTRUCK_WHATSAPP;
  window.open('https://wa.me/'+target+'?text='+encodeURIComponent(msg), '_blank');
}

function showToast(text){
  const toast = document.getElementById('toast');
  toast.textContent = text;
  toast.classList.add('is-visible');
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(()=> toast.classList.remove('is-visible'), 3200);
}

/* ---------- boot ---------- */
function handleDeepLink(){
  try{
    const params = new URLSearchParams(window.location.search);
    const panel = params.get('panel');
    if(panel){ try{ const u = new URL(window.location.href); u.searchParams.delete('panel'); history.replaceState(null, '', u.toString()); }catch(e){} }
    if(panel === 'inventory'){
      if(currentUser && currentUser.role === 'admin'){
        openInventoryPanel();
      } else if(!currentUser){
        pendingDeepLink = 'inventory';
        openLogin();
      }
    } else if(panel === 'orders'){
      if(currentUser){
        openOrdersPanel();
      } else {
        pendingDeepLink = 'orders';
        openLogin();
      }
    }
  }catch(e){}
}
/* ===================== Sincronización entre ventanas/pestañas del MISMO equipo =====================
   Todo lo que se haga en una ventana aparece al instante en las demás ventanas abiertas de la
   página (sin recargar y sin esperar a internet). Entre PC distintas sigue el guardado en línea. */
const TAB_ID = Math.random().toString(36).slice(2);
const tabChannel = ('BroadcastChannel' in window) ? new BroadcastChannel('eurotruck_sync_v1') : null;
let applyingTabState = false;
let tabBroadcastTimer = null;
function collectTabState(){
  return {inventoryState, ordersState, locations, deletedRefs, countAreas, activeAreaIndex, salesLog,
    internalCodes, nextInternalCode, receivingKardex, receivingSession, receivingSessionStartedAt,
    scanHistory, usdRate, usdRateDate, usdRateManual};
}
function broadcastTabState(){
  if(applyingTabState || !tabChannel) return;
  clearTimeout(tabBroadcastTimer);
  tabBroadcastTimer = setTimeout(()=>{
    try{ tabChannel.postMessage({from:TAB_ID, type:'state', state:collectTabState()}); }catch(e){ console.warn('Sync ventanas:', e && e.message); }
  }, 80);
}
async function onSyncBadgeClick(){
  await loadServerConfig();
  const s = srvSettings();
  if(!s.url){
    if(githubConfigured()){ configureGithubSync(); return; }
    if(!currentUser || currentUser.role !== 'admin'){ showToast('Inicia sesión como administrador para conectar el servidor.'); openLogin(); return; }
    const url = prompt('Dirección de tu servidor (la que mostró el instalador, ej. https://desktop-bv2qia0.xxxx.ts.net):', '');
    if(!url) return;
    srvSave({url: url.trim().replace(/\/+$/,''), token:''});
    currentUser = null; clearSession(); updateAuthUI();
    showToast('Ahora inicia sesión para conectar con el servidor.'); openLogin(); return;
  }
  if(!s.token){ currentUser = null; clearSession(); updateAuthUI(); showToast('Inicia sesión para conectar con el servidor.'); openLogin(); return; }
  if(dbApi && dbApi.kind === 'server'){ dbApi.flushNow(); showToast('Conectado a ' + s.url); return; }
  initData();
}
function rerenderAllViews(){
  const isOpen = id => { const el = document.getElementById(id); return !!(el && el.classList.contains('is-open')); };
  const run = fn => { try{ if(typeof fn === 'function') fn(); }catch(e){} };
  run(normalizeOrders);
  run(renderProducts);
  run(renderUsdRateBadge);
  if(isOpen('ordersOverlay')){ run(renderOrdersGrid); run(renderTopSellers); }
  if(isOpen('inventoryOverlay')){
    run(renderAreaSelect); run(renderGondolaChips); run(renderCatalogCards); run(renderInventoryTable);
    run(renderCountedItemsList); run(renderInventoryStats); run(renderScanHistoryTable); run(renderTopSellers);
  }
  if(isOpen('receivingOverlay')){ run(renderReceivingSession); run(renderReceivingKardex); }
}
function applyTabState(st){
  applyingTabState = true;
  try{
    ({inventoryState, ordersState, locations, deletedRefs, countAreas, activeAreaIndex, salesLog,
      internalCodes, nextInternalCode, receivingKardex, receivingSession, receivingSessionStartedAt,
      scanHistory, usdRate, usdRateDate, usdRateManual} = st);
    rerenderAllViews();
    // La ventana líder sube al servidor lo que se hizo en las otras ventanas
    if(isSyncLeader && dbApi){
      if(dbApi.kind === 'server') dbApi.flushNow();
      else { saveInventory(); saveOrders(); saveMeta(); try{ dbApi.doc('eurotruck/receiving').set({items:receivingSession, startedAt:receivingSessionStartedAt}); }catch(e){} }
    }
  }finally{ applyingTabState = false; }
}
if(tabChannel){
  tabChannel.onmessage = ev=>{
    const m = ev.data || {};
    if(m.from === TAB_ID) return;
    if(m.type === 'state' && m.state) applyTabState(m.state);
  };
}
// Cada vez que la página guarda algo, avisa también a las demás ventanas.
['saveLocalFallback','saveMeta','saveReceivingSessionDraft','clearReceivingSessionDraft','saveUsdRateToStorage'].forEach(name=>{
  const orig = window[name];
  if(typeof orig !== 'function') return;
  window[name] = function(){ const r = orig.apply(this, arguments); broadcastTabState(); saveAppStateToIdb(); return r; };
});
// Respaldo (navegadores sin BroadcastChannel) + sesión y guardado en línea compartidos entre ventanas.
window.addEventListener('storage', ev=>{
  if(ev.key === SESSION_KEY){
    if(!ev.newValue){ if(currentUser){ currentUser = null; updateAuthUI(); closeOrdersWindow(); closeInventoryWindow(); closeReceivingPanel(); } }
    else { restoreSession(); updateAuthUI(); }
    return;
  }
  if(ev.key === SRV_KEY){
    const sv = srvSettings();
    if(!sv.token && dbApi && dbApi.kind === 'server'){ dbApi.stop(); dbApi = null; setSyncStatus('local'); }
    else if(sv.token && isSyncLeader && !(dbApi && dbApi.kind === 'server')) initData();
    return;
  }
  if(ev.key === GH_TOKEN_KEY){ if(!dbApi && githubConfigured()) initData(); return; }
  if(!tabChannel && ev.key && ev.key.indexOf('eurotruck_') === 0 && ev.key !== 'eurotruck_lang'){
    applyingTabState = true;
    try{ loadLocalFallback(); loadUsdRateFromStorage(); rerenderAllViews(); }finally{ applyingTabState = false; }
  }
});

restoreSession();
updateAuthUI();
updateCartCount();
loadLocalFallback();
setLanguage(currentLang);
initData().then(handleDeepLink);

/* ---------- vigilante de versión: si se publica una versión nueva, esta ventana se actualiza sola ---------- */
(function(){
  const url = location.pathname.endsWith('/') ? location.pathname + 'index.html' : location.pathname;
  let tag = null;
  const getTag = async ()=>{ try{ const r = await fetch(url + '?v=' + Date.now(), {method:'HEAD', cache:'no-store'}); return r.ok ? (r.headers.get('etag') || r.headers.get('last-modified')) : null; }catch(e){ return null; } };
  const busy = ()=>{ const a = document.activeElement; const typing = a && /INPUT|TEXTAREA|SELECT/.test(a.tagName) && a.value && a.type !== 'number' && !/scan|inInv|inRec|inBus/i.test(a.id||'');
    return typing || !!document.querySelector('#locAlertOverlay.is-open, #locAlert.on, #addArticleOverlay.is-open'); };
  function banner(){
    let b = document.getElementById('newVersionBar');
    if(!b){ b = document.createElement('div'); b.id = 'newVersionBar'; b.style.cssText = 'position:fixed;left:50%;top:10px;transform:translateX(-50%);z-index:100001;background:#16a34a;color:#fff;font:700 14px system-ui,sans-serif;padding:10px 16px;border-radius:999px;box-shadow:0 6px 20px rgba(0,0,0,.4);cursor:pointer';
      b.textContent = '🔄 Hay una versión nueva — actualizando…'; b.onclick = ()=>location.reload(); document.body.appendChild(b); }
    const tryReload = ()=>{ if(busy()){ b.textContent = '🔄 Versión nueva lista — toca aquí para actualizar'; setTimeout(tryReload, 5000); } else location.reload(); };
    setTimeout(tryReload, 4000);
  }
  getTag().then(t=>{ tag = t; });
  let shown = false;
  setInterval(async()=>{ if(shown || document.hidden) return; const t = await getTag(); if(tag && t && t !== tag){ shown = true; banner(); } }, 60000);
  document.addEventListener('visibilitychange', async()=>{ if(shown || document.hidden) return; const t = await getTag(); if(tag && t && t !== tag){ shown = true; banner(); } });
})();
