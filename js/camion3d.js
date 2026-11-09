/* Camión 3D en "rayos X" para el EPC de Eurotruck. Modelo genérico dibujado desde cero (sin marca ni datos de fabricantes).
   Tocas una zona → la cámara va hacia allá, el grupo se desarma y los demás se apagan → tocas la pieza. */
import * as THREE from 'three';
import { OrbitControls } from './vendor/three/OrbitControls.js';
import { RoomEnvironment } from './vendor/three/RoomEnvironment.js';
import { frenoDisco, ext, redondo, textura, rugosidad } from './modelos3d.js';
import { construirCamion } from './camionReal.js';

export const GRUPOS = [
  { id: 'motor', nombre: 'Motor', sis: 'Motor' },
  { id: 'caja', nombre: 'Caja de cambios', sis: 'Caja de cambios' },
  { id: 'frenos', nombre: 'Frenos', sis: 'Sistema de freno' },
  { id: 'susp', nombre: 'Suspensión', sis: 'Suspensión' },
  { id: 'escape', nombre: 'Escape', sis: 'Escape' },
  { id: 'trasera', nombre: 'Parte trasera y luces', sis: 'Sistema eléctrico' },
];

function materiales() {
  const rough = rugosidad(1);
  const m = (o) => new THREE.MeshStandardMaterial(o);
  return {
    fundicion: m({ map: textura('#5f6368', 0.25), roughnessMap: rough, metalness: 0.85, roughness: 0.6 }),
    disco: m({ map: textura('#a3a8ae', 0.18), metalness: 1, roughness: 0.3, roughnessMap: rough }),
    pinza: m({ map: textura('#6b7076', 0.3), roughnessMap: rough, metalness: 0.75, roughness: 0.58 }),
    pintura: m({ color: 0x1d2024, metalness: 0.35, roughness: 0.42 }), acero: m({ color: 0x8c9198, metalness: 1, roughness: 0.35 }),
    cromo: m({ color: 0xe8ebef, metalness: 1, roughness: 0.1 }), zinc: m({ color: 0xc9b47c, metalness: 0.9, roughness: 0.35 }),
    laton: m({ color: 0xd4a548, metalness: 1, roughness: 0.25 }), goma: m({ color: 0x151515, metalness: 0, roughness: 0.82 }),
    friccion: m({ map: textura('#2c2824', 0.35), metalness: 0.1, roughness: 0.95 }), placa: m({ color: 0x3a3f46, metalness: 0.75, roughness: 0.4 }),
    negro: m({ color: 0x0a0a0a, roughness: 1 }), azul: m({ color: 0x1d5fbf, roughness: 0.5 }), naranja: m({ color: 0xff7a1a, roughness: 0.5 }),
    caja: m({ color: 0x18263b, roughness: 0.7 }), placaId: m({ color: 0xd9dde2, metalness: 0.6, roughness: 0.3 }),
    bloque: m({ map: textura('#4b5563', 0.28), roughnessMap: rough, metalness: 0.7, roughness: 0.55 }),
    culata: m({ map: textura('#7a8089', 0.22), metalness: 0.8, roughness: 0.45 }),
    tapa: m({ color: 0x23272d, metalness: 0.5, roughness: 0.35 }), filtro: m({ color: 0x1f3b73, metalness: 0.4, roughness: 0.4 }),
    filtroG: m({ color: 0xd6dde6, metalness: 0.3, roughness: 0.5 }), turbo: m({ map: textura('#8a8f96', 0.3), metalness: 0.95, roughness: 0.4 }),
    caliente: m({ color: 0x6b4a3a, metalness: 0.9, roughness: 0.55 }), aluminio: m({ map: textura('#b4bac2', 0.15), metalness: 0.95, roughness: 0.3 }),
    ballesta: m({ color: 0x2a2e34, metalness: 0.8, roughness: 0.5 }), amarillo: m({ color: 0xf2c230, metalness: 0.3, roughness: 0.45 }),
  };
}
const cil = (r1, r2, h, mat, seg = 48) => new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, h, seg), mat);
const caja = (x, y, z, mat) => new THREE.Mesh(new THREE.BoxGeometry(x, y, z), mat);

/* Cada grupo: piezas { n, nombre, obj, explota:[dx,dy,dz] } colocadas en su sitio dentro del camión */
function grupoMotor(M) { const P = [];
  const p = (n, nombre, obj, pos, ex) => { obj.position.set(...pos); P.push({ n, nombre, obj, explota: ex }); };
  { const g = new THREE.Group(); const b = ext(redondo(1.9, 1.0, 0.25), 1.5, M.bloque, 0.1); b.rotation.y = Math.PI / 2; b.position.x = -0.75; g.add(b);
    for (let i = 0; i < 6; i++) { const r = caja(0.5, 0.18, 1.6, M.bloque); r.position.set(-1.6 + i * 0.64, -0.2, 0); g.add(r); } p(101, 'Bloque de motor', g, [0, 0, 0], [0, -1.6, 0]); }
  { const g = new THREE.Group(); g.add(caja(3.8, 0.55, 1.45, M.culata)); for (let i = 0; i < 6; i++) { const t = cil(0.14, 0.14, 0.3, M.zinc, 6); t.position.set(-1.6 + i * 0.64, 0.4, 0.45); g.add(t); } p(102, 'Culata', g, [0, 1.3, 0], [0, 1.4, 0]); }
  { const g = new THREE.Group(); const t = ext(redondo(1.85, 0.6, 0.3), 0.25, M.tapa, 0.08); t.rotation.x = -Math.PI / 2; g.add(t); p(103, 'Tapa de balancines', g, [0, 1.72, 0.6], [0, 2.8, 0]); }
  { const g = new THREE.Group(); const cuerpo = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.22, 20, 48), M.turbo); g.add(cuerpo); const c2 = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.18, 20, 48), M.caliente); c2.position.z = -0.55; g.add(c2);
    const eje = cil(0.16, 0.16, 0.6, M.acero); eje.rotation.x = Math.PI / 2; eje.position.z = -0.27; g.add(eje); const ent = cil(0.25, 0.3, 0.5, M.turbo); ent.rotation.x = Math.PI / 2; ent.position.z = 0.4; g.add(ent);
    p(104, 'Turbocompresor', g, [0.6, 0.9, 1.25], [0.4, 0.8, 2.2]); }
  { const g = new THREE.Group(); g.add(cil(0.26, 0.26, 0.9, M.filtro)); const t = cil(0.2, 0.2, 0.1, M.acero); t.position.y = 0.5; g.add(t); p(105, 'Filtro de aceite', g, [-1.2, -0.4, 1.0], [-0.4, -0.6, 2.0]); }
  { const g = new THREE.Group(); g.add(cil(0.22, 0.22, 0.8, M.filtroG)); const t = cil(0.17, 0.17, 0.1, M.acero); t.position.y = 0.45; g.add(t); p(106, 'Filtro de combustible', g, [-0.5, -0.3, 1.05], [0, -0.6, 2.4]); }
  { const g = new THREE.Group(); const a = cil(0.35, 0.35, 0.55, M.aluminio); a.rotation.x = Math.PI / 2; g.add(a); const pl = cil(0.2, 0.2, 0.15, M.negro); pl.rotation.x = Math.PI / 2; pl.position.z = -0.35; g.add(pl); p(107, 'Alternador', g, [1.7, 0.6, -0.95], [0.6, 0.6, -2.2]); }
  { const g = new THREE.Group(); const c = cil(0.38, 0.38, 0.35, M.aluminio); c.rotation.z = Math.PI / 2; g.add(c); p(108, 'Bomba de agua', g, [2.1, 0.1, 0], [1.6, 0, 0]); }
  { const g = new THREE.Group(); const h = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 0.1, 9), M.negro); h.rotation.z = Math.PI / 2; g.add(h); for (let i = 0; i < 9; i++) { const a = caja(0.05, 0.9, 0.28, M.negro); a.position.y = 0.5; const w = new THREE.Group(); w.add(a); w.rotation.x = i / 9 * Math.PI * 2; g.add(w); }
    p(109, 'Ventilador / viscoacoplamiento', g, [2.45, 0.2, 0], [2.8, 0, 0]); }
  { const g = new THREE.Group(); g.add(caja(3.6, 0.5, 1.2, M.pintura)); p(110, 'Cárter de aceite', g, [0, -1.25, 0], [0, -2.6, 0]); }
  return P; }

function grupoCaja(M) { const P = []; const p = (n, nombre, obj, pos, ex) => { obj.position.set(...pos); P.push({ n, nombre, obj, explota: ex }); };
  { const g = new THREE.Group(); const c = cil(1.05, 0.75, 1.0, M.aluminio, 64); c.rotation.z = Math.PI / 2; g.add(c); p(201, 'Campana de embrague', g, [0, 0, 0], [1.0, 0, 0]); }
  { const g = new THREE.Group(); const d = cil(0.85, 0.85, 0.12, M.friccion, 64); d.rotation.z = Math.PI / 2; g.add(d); const c = cil(0.25, 0.25, 0.3, M.acero); c.rotation.z = Math.PI / 2; g.add(c); p(202, 'Disco de embrague', g, [0.2, 0, 0], [1.9, 0.6, 0]); }
  { const g = new THREE.Group(); const d = cil(0.9, 0.9, 0.22, M.acero, 64); d.rotation.z = Math.PI / 2; g.add(d); p(203, 'Plato de presión', g, [0.35, 0, 0], [2.6, 0.6, 0]); }
  { const g = new THREE.Group(); const c = cil(0.75, 0.55, 2.4, M.aluminio, 64); c.rotation.z = Math.PI / 2; g.add(c); for (let i = 0; i < 5; i++) { const n = new THREE.Mesh(new THREE.TorusGeometry(0.7 - i * 0.03, 0.04, 8, 48), M.aluminio); n.rotation.y = Math.PI / 2; n.position.x = -0.9 + i * 0.45; g.add(n); }
    p(204, 'Carcasa de caja de cambios', g, [-1.7, -0.05, 0], [0, -0.4, 0]); }
  { const g = new THREE.Group(); g.add(caja(0.6, 0.5, 0.6, M.aluminio)); const pal = cil(0.05, 0.05, 1.3, M.cromo); pal.position.y = 0.8; g.add(pal); p(205, 'Torreta de cambios', g, [-1.4, 0.75, 0], [0, 1.6, 0]); }
  { const g = new THREE.Group(); const f = cil(0.4, 0.4, 0.2, M.acero, 6); f.rotation.z = Math.PI / 2; g.add(f); p(206, 'Brida de salida', g, [-3.0, -0.1, 0], [-1.2, 0, 0]); }
  { const g = new THREE.Group(); const r = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.07, 12, 40), M.goma); r.rotation.y = Math.PI / 2; g.add(r); p(207, 'Retén de salida', g, [-2.85, -0.1, 0], [-0.6, 0.6, 0]); }
  return P; }

function grupoFrenos(M) { // freno delantero izquierdo: reutiliza el freno de disco del EPC, en escala
  const piezas = frenoDisco(M); return piezas.map(pz => { const o = pz.g; const w = new THREE.Group(); w.add(o); o.position.x = pz.x * 0.18; return { n: 300 + pz.n, nombre: pz.nombre, obj: w, explota: [0, 0, 0], ex3: pz.x * 0.85 }; }); }

function grupoSusp(M) { const P = []; const p = (n, nombre, obj, pos, ex) => { obj.position.set(...pos); P.push({ n, nombre, obj, explota: ex }); };
  { const g = new THREE.Group(); for (let i = 0; i < 5; i++) { const h = caja(4.2 - i * 0.6, 0.14, 0.5, M.ballesta); h.position.y = -i * 0.16; g.add(h); } p(401, 'Ballesta delantera', g, [0, 0, 0], [0, -1.2, 0]); }
  { const g = new THREE.Group(); g.add(cil(0.16, 0.16, 1.4, M.amarillo)); const v = cil(0.07, 0.07, 0.7, M.cromo); v.position.y = 0.95; g.add(v); g.rotation.z = 0.25; p(402, 'Amortiguador', g, [1.3, 0.9, 0.45], [0.4, 1.6, 0.8]); }
  { const g = new THREE.Group(); const b = cil(0.17, 0.17, 0.6, M.goma); b.rotation.x = Math.PI / 2; g.add(b); p(403, 'Buje de ballesta', g, [2.1, 0, 0], [1.2, 0.4, 0]); }
  { const g = new THREE.Group(); g.add(caja(0.25, 0.9, 0.6, M.acero)); p(404, 'Grillete de ballesta', g, [-2.1, -0.2, 0], [-1.2, 0, 0]); }
  { const g = new THREE.Group(); const u = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.05, 10, 30, Math.PI), M.zinc); u.rotation.z = Math.PI; g.add(u); p(405, 'Abarcón (grapa U)', g, [0.35, -0.5, 0], [0, -2.0, 0.6]); }
  return P; }

function grupoEscape(M) { const P = []; const p = (n, nombre, obj, pos, ex) => { obj.position.set(...pos); P.push({ n, nombre, obj, explota: ex }); };
  { const g = new THREE.Group(); g.add(cil(0.3, 0.3, 1.5, M.aluminio, 48)); [-0.75, 0.75].forEach(y => { const t = cil(0.31, 0.31, 0.06, M.acero, 48); t.position.y = y; g.add(t); }); p(501, 'Silenciador / postratamiento', g, [0, -0.6, 0], [0, -1.4, 0.8]); }
  { const g = new THREE.Group(); g.add(cil(0.2, 0.2, 2.2, M.aluminio, 32)); const b = cil(0.24, 0.2, 0.25, M.aluminio, 32); b.position.y = 1.15; g.add(b); p(502, 'Chimenea de escape', g, [0, 1.3, 0], [0, 1.6, 0]); }
  { const g = new THREE.Group(); [-0.3, 0.4].forEach(y => { const a = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.04, 10, 48), M.zinc); a.rotation.x = Math.PI / 2; a.position.y = y; g.add(a); }); p(503, 'Abrazaderas de escape', g, [0, -0.4, 0], [0.9, 0, 0.9]); }
  { const g = new THREE.Group(); const t = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(0, -1.35, 0), new THREE.Vector3(0.6, -1.7, -0.4), new THREE.Vector3(1.6, -1.6, -1.2)]), 40, 0.12, 16), M.caliente); g.add(t); p(504, 'Tubo flexible de escape', g, [0, 0, 0], [0.6, -0.8, -0.6]); }
  return P; }

function grupoTrasera(M) { const P = []; const p = (n, nombre, obj, pos, ex) => { obj.position.set(...pos); P.push({ n, nombre, obj, explota: ex }); };
  const rojo = new THREE.MeshStandardMaterial({ color: 0xc81e1e, emissive: 0x7a0000, emissiveIntensity: 0.6, roughness: 0.25 }), ambar = new THREE.MeshStandardMaterial({ color: 0xff9d1a, emissive: 0x7a3d00, emissiveIntensity: 0.6, roughness: 0.25 }), blanco = new THREE.MeshStandardMaterial({ color: 0xf2f6ff, emissive: 0x556070, emissiveIntensity: 0.5, roughness: 0.2 });
  for (const z of [-1, 1]) { const g = new THREE.Group(); g.add(caja(0.12, 0.32, 0.75, M.negro)); [[rojo, -0.22], [ambar, 0.02], [blanco, 0.24]].forEach(([m, dz]) => { const l = caja(0.03, 0.24, 0.2, m); l.position.set(-0.07, 0, dz * z); g.add(l); });
    p(z < 0 ? 601 : 602, z < 0 ? 'Piloto trasero izquierdo' : 'Piloto trasero derecho', g, [0, 0, z * 0.95], [-0.5, 0, z * 0.6]); }
  { const g = new THREE.Group(); g.add(caja(0.14, 0.18, 2.3, M.acero)); [-0.9, 0.9].forEach(z => { const s = caja(0.1, 0.5, 0.1, M.acero); s.position.set(0.05, 0.3, z); g.add(s); }); p(603, 'Parachoques trasero (antiempotramiento)', g, [0.05, -0.45, 0], [-0.6, -0.5, 0]); }
  for (const z of [-1, 1]) { const g = new THREE.Group(); g.add(caja(0.02, 0.6, 0.55, M.goma)); p(z < 0 ? 604 : 605, z < 0 ? 'Faldón (guardabarros) izquierdo' : 'Faldón (guardabarros) derecho', g, [0.4, -0.05, z * 1.15], [-0.3, 0, z * 0.5]); }
  { const g = new THREE.Group(); g.add(caja(0.03, 0.22, 0.6, blanco)); p(606, 'Soporte de matrícula', g, [-0.05, -0.2, 0.0], [-0.7, 0.2, 0]); }
  { const g = new THREE.Group(); g.add(caja(0.05, 0.05, 0.14, blanco)); p(607, 'Luz de matrícula', g, [-0.06, 0.0, 0.0], [-0.9, 0.5, 0]); }
  for (const z of [-1, 1]) { const g = new THREE.Group(); g.add(caja(0.04, 0.06, 0.06, ambar)); p(z < 0 ? 608 : 609, z < 0 ? 'Luz de gálibo lateral izquierda' : 'Luz de gálibo lateral derecha', g, [0.9, 0.05, z * 0.5], [0, 0.4, z * 0.6]); }
  { const g = new THREE.Group(); const c = cil(0.03, 0.03, 1.6, M.negro, 8); c.rotation.x = Math.PI / 2; g.add(c); const e = caja(0.1, 0.1, 0.16, M.negro); e.position.z = 0.85; g.add(e); p(610, 'Conector eléctrico del remolque (7/15 polos)', g, [1.2, 0.7, 0.4], [0, 0.8, 0]); }
  return P; }

const ARMADORES = { trasera: grupoTrasera, motor: grupoMotor, caja: grupoCaja, frenos: grupoFrenos, susp: grupoSusp, escape: grupoEscape };
// dónde va cada grupo en el camión (x hacia delante) y desde dónde se mira
const SITIO = {
  motor: { pos: [3.95, 1.08, 0], esc: 0.38, vista: [3.2, 2.0, 4.6] , etq: [5.0, 2.2, -1.5] },
  caja: { pos: [3.08, 0.86, 0], esc: 0.3, vista: [2.4, 1.6, 4.4] , etq: [2.4, 1.5, -1.6] },
  frenos: { pos: [3.7, 0.0, 1.06], esc: 0.075, rotY: -Math.PI / 2, vista: [1.6, 0.7, 2.6] , etq: [3.7, -0.35, 1.75] },
  susp: { pos: [3.7, 0.3, 0.43], esc: 0.33, vista: [1.8, 0.9, 3.4] , etq: [4.6, 0.35, 1.9] },
  trasera: { pos: [-4.75, 0.55, 0], esc: 1, vista: [-3.4, 1.4, 3.6], etq: [-5.0, 1.4, 0.9] },
  escape: { pos: [2.75, 1.25, 1.0], esc: 0.55, vista: [2.4, 1.6, 4.2] , etq: [2.75, 3.9, 1.0] },
};

export function montarCamion(el, { alElegir = () => {}, alGrupo = () => {}, grupo = null, pieza = null } = {}) {
  const W = () => el.clientWidth || 900, H = () => el.clientHeight || 520;
  const r = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true }); r.setPixelRatio(Math.min(2, devicePixelRatio)); r.setSize(W(), H());
  r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 1.1; r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap;
  el.appendChild(r.domElement); r.domElement.className = 'mx-3d-canvas';
  const capa = document.createElement('div'); capa.className = 'mx-3d-capa'; el.appendChild(capa);
  const lineas = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); lineas.setAttribute('class', 'mx-3d-lineas'); el.appendChild(lineas);
  const scene = new THREE.Scene(); scene.environment = new THREE.PMREMGenerator(r).fromScene(new RoomEnvironment(), 0.04).texture;
  const cam = new THREE.PerspectiveCamera(32, W() / H(), 0.1, 300);
  const ctl = new OrbitControls(cam, r.domElement); ctl.enableDamping = true; ctl.minDistance = 2.5; ctl.maxDistance = 40; ctl.maxPolarAngle = Math.PI * 0.58;
  const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(8, 14, 10); key.castShadow = true; key.shadow.mapSize.set(2048, 2048); Object.assign(key.shadow.camera, { left: -14, right: 14, top: 10, bottom: -10 }); scene.add(key);
  const rim = new THREE.DirectionalLight(0x6fc4ff, 1.6); rim.position.set(-10, 6, -8); scene.add(rim); scene.add(new THREE.HemisphereLight(0x8fb8ff, 0x101418, 0.4));
  const piso = new THREE.Mesh(new THREE.PlaneGeometry(120, 120), new THREE.ShadowMaterial({ opacity: 0.45 })); piso.rotation.x = -Math.PI / 2; piso.position.y = -0.52; piso.receiveShadow = true; scene.add(piso);
  const grid = new THREE.GridHelper(120, 120, 0x1b3150, 0x0f1c2e); grid.position.y = -0.515; scene.add(grid);
  const M = materiales();

  // ── camión de diseño propio: chasis, cabina y ruedas ──
  const cuerpo = construirCamion(scene);
  const bordeRX = new THREE.LineBasicMaterial({ color: 0x3fb8ff, transparent: true, opacity: 0 });
  cuerpo.cabina.forEach(m => { m.material = m.material.clone(); m.material.transparent = true; m.userData.op0 = m.material.opacity ?? 1; const e = new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry, 30), bordeRX); m.add(e); });
  cuerpo.resto.forEach(m => { m.material = m.material.clone(); m.material.transparent = true; });
  let rx = 0, rxMeta = 0;
  function pintarRX() { cuerpo.cabina.forEach(m => { m.material.opacity = m.userData.op0 * (1 - rx) + 0.07 * rx; m.material.depthWrite = rx < 0.5; }); bordeRX.opacity = 0.6 * rx;
    cuerpo.resto.forEach(m => { m.material.opacity = 1 - 0.55 * rx; m.material.depthWrite = rx < 0.5; }); }
  // ── grupos con sus piezas reales (sólidas) ──
  const grupos = {};
  for (const G of GRUPOS) { const raiz = new THREE.Group(); const s = SITIO[G.id]; raiz.position.set(...s.pos); raiz.scale.setScalar(s.esc); if (s.rotY) raiz.rotation.y = s.rotY;
    const piezas = ARMADORES[G.id](M); piezas.forEach(pz => { pz.base = pz.obj.position.clone(); pz.obj.traverse(o => { if (o.isMesh) { o.castShadow = o.receiveShadow = true; o.material = o.material.clone(); o.material.transparent = true; o.userData = { g: G.id, n: pz.n }; } }); raiz.add(pz.obj); });
    scene.add(raiz); grupos[G.id] = { G, raiz, piezas, ex: 0, meta: 0, alfa: 1 }; }

  // ── etiquetas ──
  const etiquetas = []; const etq = (txt, cls, data) => { const b = document.createElement('button'); b.className = cls; b.textContent = txt; Object.assign(b.dataset, data); capa.appendChild(b); etiquetas.push(b); return b; };
  const etqGrupo = {}; for (const G of GRUPOS) { etqGrupo[G.id] = etq(G.nombre, 'mx-g3d', { g3d: G.id }); }
  const etqPieza = {}; for (const id in grupos) for (const pz of grupos[id].piezas) etqPieza[pz.n] = etq(String(pz.n), 'mx-pin mx-pin3d', { pin: pz.n, g: id });
  capa.addEventListener('click', e => { const b = e.target.closest('[data-g3d]'); if (b) { e.stopPropagation(); enfocar(b.dataset.g3d); } });

  // ── estado y animación de cámara ──
  let activo = grupo, elegida = pieza, sucio = 5;
  const camDesde = new THREE.Vector3(), camHacia = new THREE.Vector3(), tDesde = new THREE.Vector3(), tHacia = new THREE.Vector3(); let vuelo = 1;
  const VISTA = { cam: new THREE.Vector3(10.5, 5.2, 10.8), tgt: new THREE.Vector3(0.9, 1.1, 0) };
  function volar(c, t) { camDesde.copy(cam.position); tDesde.copy(ctl.target); camHacia.copy(c); tHacia.copy(t); vuelo = 0; sucio = 3; }
  cam.position.copy(VISTA.cam); ctl.target.copy(VISTA.tgt); ctl.update();
  function centroDe(id, n) { const box = new THREE.Box3(); if (n) { const pz = grupos[id].piezas.find(p => p.n === n); box.setFromObject(pz.obj); } else box.setFromObject(grupos[id].raiz); return box.getCenter(new THREE.Vector3()); }
  function enfocar(id) { activo = id; elegida = null; for (const k in grupos) { grupos[k].meta = k === id ? 1 : 0; } const s = SITIO[id]; const c = new THREE.Vector3(...s.pos);
    rxMeta = 1; volar(c.clone().add(new THREE.Vector3(...s.vista)), c.clone().add(new THREE.Vector3(0, 0.1, 0))); alGrupo(id); pintar(); }
  function general() { activo = null; elegida = null; rxMeta = 0; for (const k in grupos) grupos[k].meta = 0; volar(VISTA.cam, VISTA.tgt); alGrupo(null); pintar(); }
  function elegir(n) { const id = Object.keys(grupos).find(k => grupos[k].piezas.some(p => p.n === n)); if (!id) return; if (activo !== id) enfocar(id); elegida = n; pintar();
    setTimeout(() => { const c = centroDe(id, n); const dir = cam.position.clone().sub(ctl.target).normalize(); volar(c.clone().add(dir.multiplyScalar(4.2)), c); }, activo === id ? 0 : 650); }
  function pintar() { sucio = 3;
    for (const id in grupos) { const gr = grupos[id], on = !activo || activo === id;
      for (const pz of gr.piezas) { const sel = elegida === pz.n, otraSel = elegida && !sel && activo === id;
        pz.obj.traverse(o => { if (!o.isMesh) return; o.material.opacity = !on ? 0.12 : otraSel ? 0.35 : 1; o.material.depthWrite = on && !otraSel; o.material.emissive = new THREE.Color(sel ? 0x0b5a99 : (activo && on && !elegida) ? 0x061c30 : 0); o.material.emissiveIntensity = sel ? 1.1 : 0.6; }); } }
    for (const id in etqGrupo) etqGrupo[id].classList.toggle('is-on', activo === id);
    for (const n in etqPieza) { etqPieza[n].classList.toggle('is-on', Number(n) === elegida); } }
  // clic en el modelo: en vista general elige el grupo; dentro del grupo elige la pieza
  const ray = new THREE.Raycaster(), m2 = new THREE.Vector2(); let abajo = null;
  r.domElement.addEventListener('pointerdown', e => { abajo = [e.clientX, e.clientY]; });
  r.domElement.addEventListener('click', e => { if (abajo && Math.hypot(e.clientX - abajo[0], e.clientY - abajo[1]) > 6) return; const b = r.domElement.getBoundingClientRect(); m2.set((e.clientX - b.left) / b.width * 2 - 1, -(e.clientY - b.top) / b.height * 2 + 1); ray.setFromCamera(m2, cam);
    const objs = activo ? [grupos[activo].raiz] : Object.values(grupos).map(g => g.raiz); const hit = ray.intersectObjects(objs, true).find(h => h.object.userData && h.object.userData.g);
    if (!hit) { if (activo && !elegida) general(); return; } const { g, n } = hit.object.userData; if (!activo || activo !== g) enfocar(g); else alElegir(n); });
  const ro = new ResizeObserver(() => { sucio = 3; r.setSize(W(), H()); cam.aspect = W() / H(); cam.updateProjectionMatrix(); }); ro.observe(el);
  ctl.addEventListener('change', () => { sucio = 2; });
  let vivo = true; const v = new THREE.Vector3();
  (function loop() { if (!vivo) return; requestAnimationFrame(loop);
    let mov = vuelo < 1 || Math.abs(rxMeta - rx) > 0.002; for (const id in grupos) { const gr = grupos[id]; if (Math.abs(gr.meta - gr.ex) > 0.002) mov = true; }
    ctl.update(); if (!mov && !sucio) return; sucio = Math.max(0, sucio - 1);
    if (vuelo < 1) { vuelo = Math.min(1, vuelo + 0.035); const k = vuelo < 0.5 ? 2 * vuelo * vuelo : 1 - Math.pow(-2 * vuelo + 2, 2) / 2; cam.position.lerpVectors(camDesde, camHacia, k); ctl.target.lerpVectors(tDesde, tHacia, k); }
    rx += (rxMeta - rx) * 0.08; if (Math.abs(rxMeta - rx) < 0.002) rx = rxMeta; pintarRX();
    for (const id in grupos) { const gr = grupos[id]; gr.ex += (gr.meta - gr.ex) * 0.07; if (Math.abs(gr.meta - gr.ex) < 0.002) gr.ex = gr.meta;
      for (const pz of gr.piezas) { pz.obj.position.copy(pz.base).addScaledVector(new THREE.Vector3(...pz.explota), gr.ex * 1.25); if (pz.ex3 !== undefined) pz.obj.position.x = pz.base.x + pz.ex3 * gr.ex; } }
    r.render(scene, cam);
    const w = W(), h = H(); let svg = '';
    for (const id in grupos) { const c = SITIO[id].etq ? new THREE.Vector3(...SITIO[id].etq) : centroDe(id); v.copy(c).project(cam); const e = etqGrupo[id]; e.style.left = (v.x + 1) / 2 * w + 'px'; e.style.top = (1 - v.y) / 2 * h + 'px'; e.style.display = activo ? 'none' : ''; }
    for (const id in grupos) for (const pz of grupos[id].piezas) { const e = etqPieza[pz.n], ver = activo === id && grupos[id].ex > 0.6; e.style.display = ver ? '' : 'none'; if (!ver) continue;
      const c = centroDe(id, pz.n); const a = c.clone().project(cam); const b2 = c.clone(); b2.y += 0.55; const bb = b2.project(cam);
      const ax = (a.x + 1) / 2 * w, ay = (1 - a.y) / 2 * h, bx = (bb.x + 1) / 2 * w, by = (1 - bb.y) / 2 * h - 14; e.style.left = bx + 'px'; e.style.top = by + 'px';
      svg += `<line x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}"/><circle cx="${ax}" cy="${ay}" r="2.4"/>`; }
    lineas.innerHTML = svg; })();
  if (grupo) setTimeout(() => { enfocar(grupo); if (pieza) elegir(pieza); }, 50);
  return { tags: Object.values(etqPieza), enfocar, general, sel: n => { if (n) elegir(n); else { elegida = null; pintar(); } }, armar: v => { if (activo) { grupos[activo].meta = v ? 0 : 1; sucio = 3; } }, vista: general,
    piezas: Object.values(grupos).flatMap(g => g.piezas.map(p => ({ n: p.n, nombre: p.nombre, grupo: g.G.id }))),
    destruir() { vivo = false; ro.disconnect(); ctl.dispose(); r.dispose(); el.innerHTML = ''; } };
}
