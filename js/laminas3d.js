/* Láminas de despiece en estilo técnico (gris + contorno negro), hechas desde cero por Eurotruck.
   Se pasan el ratón o el dedo por una pieza → azul claro y se avisa al EPC con alElegir(n). */
import * as THREE from 'three';
export function montarLamina(el, { alElegir = () => {}, sel: sel0 = null } = {}) {
  const svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svgEl.setAttribute('class', 'mx-lam2-svg'); const capa = document.createElement('div'); capa.className = 'mx-3d-capa';
const W = () => el.clientWidth || 900, H = () => el.clientHeight || 560;
const r = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true }); r.setPixelRatio(Math.min(2, devicePixelRatio)); r.setSize(W(), H()); el.appendChild(r.domElement); r.domElement.className = 'mx-3d-canvas';
const scene = new THREE.Scene(); scene.background = new THREE.Color(0xffffff);
scene.add(new THREE.AmbientLight(0xffffff, 2.0)); const dl = new THREE.DirectionalLight(0xffffff, 1.6); dl.position.set(-4, 6, 8); scene.add(dl);
const cam = new THREE.OrthographicCamera(-W() / 2, W() / 2, H() / 2, -H() / 2, -200, 200); cam.zoom = Math.min(W() / 21, H() / 16); cam.position.set(3, 4, 10); cam.lookAt(0, 0, 0); cam.updateProjectionMatrix();
const GRIS = new THREE.MeshLambertMaterial({ color: 0xe4e4e4, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 });
const AZUL = new THREE.MeshLambertMaterial({ color: 0x8fd0ff, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 });
const LIN = new THREE.LineBasicMaterial({ color: 0x000000 });
const D = new THREE.Vector3(-1, -0.42, 0.1).normalize();            // eje diagonal de la lámina
const qD = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), D);
const P = {}, ETQ = {};
function malla(geo) { const m = new THREE.Mesh(geo, GRIS); m.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo, 24), LIN)); return m; }
function pieza(n, partes, x, y, z = 0, eje = true, lado = [-1, 1]) { const g = new THREE.Group(); partes.forEach(([geo, px = 0, py = 0, pz = 0, rx = 0, ry = 0, rz = 0]) => { const m = malla(geo); m.position.set(px, py, pz); m.rotation.set(rx, ry, rz); m.userData.n = n; g.add(m); });
  if (eje) g.quaternion.copy(qD); g.position.set(x, y, z); scene.add(g); P[n] = g; ETQ[n] = lado; return g; }
const C = (a, b, h, s = 48, o = false) => new THREE.CylinderGeometry(a, b, h, s, 1, o);
const T = (R, t, s = 48) => new THREE.TorusGeometry(R, t, 12, s);
const dientes = (R, n, h, w = 0.08) => [...Array(n)].map((_, i) => { const a = i / n * Math.PI * 2; return [new THREE.BoxGeometry(w, h, 0.09), Math.cos(a) * R, 0, Math.sin(a) * R, 0, -a, 0]; });
const estrias = (R, n, h, y = 0) => [...Array(n)].map((_, i) => { const a = i / n * Math.PI * 2; return [new THREE.BoxGeometry(0.03, h, 0.03), Math.cos(a) * R, y, Math.sin(a) * R]; });
const rodillos = (R, n, h, y = 0) => [...Array(n)].map((_, i) => { const a = i / n * Math.PI * 2; return [C(0.05, 0.045, h, 10), Math.cos(a) * R, y, Math.sin(a) * R]; });
// ── subconjunto A: diferencial (recuadro punteado) ──
pieza(14, [[C(0.12, 0.12, 1.4, 20), 0, -0.4], ...estrias(0.12, 18, 0.5, 0.3)], 8.4, 5.2, 0, true, [1.0, -1]);                     // palier
pieza(13, [[C(0.45, 0.45, 0.25, 40)], ...dientes(0.47, 26, 0.25, 0.06), [C(0.15, 0.15, 0.45, 20), 0, 0.3]], 7.3, 4.7, 0, true, [1.0, -1]);   // planetario
pieza(12, [[T(0.36, 0.035)]], 6.5, 4.35, 0, true, [-0.0, -1.3]);                                                                    // arandela
pieza(11, [[C(0.5, 0.42, 0.28, 40, true)], [C(0.25, 0.25, 0.3, 32, true)], ...rodillos(0.38, 18, 0.24)], 5.7, 3.95, 0, true, [-0.4, -1.2]);   // rodamiento
pieza(9, [[C(0.62, 0.95, 1.1, 48)], [C(0.98, 0.98, 0.12, 48), 0, -0.6], [C(0.3, 0.3, 0.5, 30), 0, 0.75]], 4.2, 3.3, 0, true, [-0.0, -1.4]);    // caja dif. (mitad)
pieza(10, [[C(0.06, 0.06, 0.9, 12)], [C(0.13, 0.13, 0.12, 6), 0, 0.5]], 4.7, 1.8, 0.6, false, [1.2, 0.2]);                      // tornillo de caja
pieza(15, [[T(0.32, 0.04)]], 2.7, 2.7, 0, true, [-0.0, -1.3]);                                                                      // arandela de empuje
pieza(16, [[C(0.32, 0.16, 0.35, 32)], ...dientes(0.26, 14, 0.3, 0.05)], 1.9, 2.4, 0, true, [-0.2, -1.4]);                           // satélite
pieza(17, [[C(0.07, 0.07, 1.6, 12)], [C(0.07, 0.07, 1.6, 12), 0, 0, 0, Math.PI / 2]], 0.9, 2.0, 0, false, [-0.2, -1.4]);         // cruceta
pieza(18, [[C(0.32, 0.16, 0.35, 32)], ...dientes(0.26, 14, 0.3, 0.05)], -0.1, 1.6, 0, true, [-0.0, -1.4]);
pieza(19, [[T(0.3, 0.04)]], -0.9, 1.25, 0, true, [-0.6, -1.0]);
// ── subconjunto B: caja, corona, piñón ──
pieza(8, [[C(0.95, 0.65, 1.1, 48)], ...[...Array(10)].map((_, i) => { const a = i / 10 * Math.PI * 2; return [C(0.06, 0.06, 0.25, 8), Math.cos(a) * 0.8, -0.55, Math.sin(a) * 0.8]; }), ...estrias(0.4, 20, 0.5, 0.7)], 6.2, 0.6, 0, true, [1.2, 0]);   // mitad de caja con estrías
pieza(5, [[C(1.6, 1.6, 0.35, 72)], [C(0.85, 0.85, 0.37, 48)], ...dientes(1.65, 47, 0.33, 0.07)], 2.4, -0.6, 0, true, [-0.2, -1.6]); // corona
pieza(6, [[C(0.5, 0.42, 0.3, 40, true)], [C(0.26, 0.26, 0.32, 32, true)], ...rodillos(0.38, 18, 0.26)], -0.6, -1.4, 0, true, [-0.3, -1.2]);
pieza(7, [[C(0.55, 0.55, 0.18, 8)], [C(0.38, 0.38, 0.2, 32)]], -1.9, -1.95, 0, true, [-0.5, -1.0]);                               // tuerca de ajuste
pieza(20, [[C(0.4, 0.22, 0.6, 32)], ...dientes(0.3, 11, 0.55, 0.06), [C(0.14, 0.14, 1.6, 20), 0, -1.1], ...estrias(0.14, 16, 0.5, -1.6)], 6.0, -2.4, 0, true, [0.6, 1.0]);   // piñón de ataque
pieza(21, [[C(0.42, 0.36, 0.28, 36, true)], [C(0.2, 0.2, 0.3, 30, true)], ...rodillos(0.32, 16, 0.24)], 7.5, -1.8, 0, true, [0.6, 1.0]);
pieza(22, [[T(0.55, 0.035, 56)]], 9.0, -1.2, 0, true, [0.6, 1.0]);                                                             // anillo de ajuste
// ── subconjunto C: carcasa y tapa ──
pieza(1, [[new THREE.SphereGeometry(1.3, 48, 28), 0, 0, 0], [C(0.5, 0.7, 1.6, 40), 0, 1.6], [C(0.75, 0.75, 0.12, 40), 0, 2.4], [C(1.5, 1.5, 0.14, 56), 0, -0.9]], -1.0, -4.4, 0, true, [-1.2, 0.3]);      // carcasa
pieza(2, [[C(0.05, 0.05, 1.0, 10)], [C(0.12, 0.12, 0.12, 6), 0, 0.55]], -3.6, -2.9, 0, false, [-0.8, -0.8]);                       // espárrago
pieza(23, [[C(0.75, 0.75, 0.16, 6)], [C(0.25, 0.3, 0.6, 30), 0, 0.35]], 6.3, -5.4, 0, true, [0.6, 1.0]);                         // brida de entrada
pieza(24, [[T(0.3, 0.07)]], 4.9, -5.0, 0, true, [0.3, 1.1]);                                                                     // retén
pieza(25, [[C(0.22, 0.22, 0.16, 6)]], 7.7, -5.9, 0, true, [0.6, 1.0]);                                                          // tuerca
pieza(3, [[C(0.14, 0.14, 0.14, 6)]], -4.0, -5.6, 0, false, [-0.8, 0.5]);                                                           // tapón
// detalle (recuadro): respiradero
pieza(4, [[C(0.08, 0.12, 0.4, 16)], [C(0.18, 0.18, 0.12, 16), 0, 0.26]], -6.4, -6.2, 0, false, [-0.8, 0.4]);
const NOM = { 1: ['Carcasa del diferencial', 1], 2: ['Espárrago', 12], 3: ['Tapón', 2], 4: ['Respiradero', 1], 5: ['Corona', 1], 6: ['Rodamiento de corona', 1], 7: ['Tuerca de ajuste', 2], 8: ['Caja del diferencial, mitad estriada', 1], 9: ['Caja del diferencial, mitad', 1], 10: ['Tornillo de caja', 12], 11: ['Rodamiento de caja', 2], 12: ['Arandela de planetario', 2], 13: ['Planetario', 2], 14: ['Palier (lado diferencial)', 2], 15: ['Arandela de empuje', 4], 16: ['Satélite', 4], 17: ['Cruceta', 1], 18: ['Satélite', 4], 19: ['Arandela de satélite', 4], 20: ['Piñón de ataque', 1], 21: ['Rodamiento del piñón', 2], 22: ['Anillo de ajuste', 1], 23: ['Brida de entrada', 1], 24: ['Retén de entrada', 1], 25: ['Tuerca de brida', 1] };
// líneas de montaje punteadas
const dash = new THREE.LineDashedMaterial({ color: 0x333333, dashSize: 0.14, gapSize: 0.1 });
const lineaP = (a, b) => { const g = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(...a), new THREE.Vector3(...b)]); const l = new THREE.Line(g, dash); l.computeLineDistances(); scene.add(l); };
lineaP([8.4, 5.2, 0], [-1.6, 0.9, 0]); lineaP([6.2, 0.6, 0], [-2.5, -2.2, 0]); lineaP([9.0, -1.2, 0], [5.2, -2.8, 0]); lineaP([7.7, -5.9, 0], [4.4, -4.8, 0]);
function px(v) { const p = v.clone().project(cam); return [(p.x + 1) / 2 * W(), (1 - p.y) / 2 * H()]; }
function cajaDe(ns, pad) { let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (const n of ns) { const b = new THREE.Box3().setFromObject(P[n]); for (const xx of [b.min.x, b.max.x]) for (const yy of [b.min.y, b.max.y]) for (const zz of [b.min.z, b.max.z]) { const [a, c] = px(new THREE.Vector3(xx, yy, zz)); x0 = Math.min(x0, a); x1 = Math.max(x1, a); y0 = Math.min(y0, c); y1 = Math.max(y1, c); } } return [x0 - pad, y0 - pad, x1 - x0 + 2 * pad, y1 - y0 + 2 * pad]; }

  el.appendChild(svgEl); el.appendChild(capa);
  let sel = sel0 ? String(sel0) : null, hover = null;
  function pintar() { const on = hover || sel; for (const n in P) P[n].traverse(o => { if (o.isMesh) o.material = (n == on ? AZUL : GRIS); }); r.render(scene, cam);
    let svg = '', tg = '';
    for (const [ns, cls] of [[[9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19], 'sub'], [[4], 'det']]) { const [x, y, w, h] = cajaDe(ns, 22); svg += `<rect class="${cls}" x="${x}" y="${y}" width="${w}" height="${h}" rx="${cls === 'det' ? 8 : 0}"/>`; }
    for (const n in P) { const c = new THREE.Box3().setFromObject(P[n]).getCenter(new THREE.Vector3()); const [ax, ay] = px(c); const [lx, ly] = ETQ[n]; const bx = ax + lx * 42, by = ay + ly * 30;
      svg += `<line x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}"/>`; tg += `<button class="mx-pin mx-n2${n == on ? ' is-on' : ''}" data-pin="${n}" style="left:${bx}px;top:${by}px">${n}</button>`; }
    svgEl.innerHTML = svg; capa.innerHTML = tg; }
  const ray = new THREE.Raycaster(), m2 = new THREE.Vector2();
  const tocar = (e) => { const b = r.domElement.getBoundingClientRect(); m2.set((e.clientX - b.left) / b.width * 2 - 1, -(e.clientY - b.top) / b.height * 2 + 1); ray.setFromCamera(m2, cam); const h = ray.intersectObjects(scene.children, true).find(h => h.object.userData.n); return h ? String(h.object.userData.n) : null; };
  el.addEventListener('pointermove', e => { const t = e.target.closest && e.target.closest('.mx-n2'); const n = t ? t.dataset.pin : tocar(e); if (n !== hover) { hover = n; el.style.cursor = n ? 'pointer' : ''; pintar(); } });
  el.addEventListener('pointerleave', () => { hover = null; pintar(); });
  r.domElement.addEventListener('click', e => { const n = tocar(e); if (n) alElegir(Number(n)); });
  const ro = new ResizeObserver(() => { r.setSize(W(), H()); Object.assign(cam, { left: -W() / 2, right: W() / 2, top: H() / 2, bottom: -H() / 2 }); cam.zoom = Math.min(W() / 21, H() / 16); cam.updateProjectionMatrix(); pintar(); }); ro.observe(el);
  pintar();
  return { tags: [...capa.children], piezas: Object.entries(NOM).map(([n, [nombre, cant]]) => ({ n: Number(n), nombre, cant })), sel(n) { sel = n ? String(n) : null; pintar(); }, enfocar() {}, general() {}, armar() {}, vista() {}, destruir() { ro.disconnect(); r.dispose(); el.innerHTML = ''; } };
}
