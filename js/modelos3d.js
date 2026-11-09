/* Modelos 3D propios de Eurotruck para el EPC (dibujados desde cero con Three.js, sin datos de fabricantes).
   montar(contenedor, { puntos, alElegir }) → { sel(n), armar(t), destruir() } */
import * as THREE from 'three';
import { OrbitControls } from './vendor/three/OrbitControls.js';
import { RoomEnvironment } from './vendor/three/RoomEnvironment.js';

function textura(base, ruido, escala = 512) { // ruido de fundición para que el metal no se vea plástico
  const c = document.createElement('canvas'); c.width = c.height = escala; const g = c.getContext('2d');
  g.fillStyle = base; g.fillRect(0, 0, escala, escala);
  for (let i = 0; i < escala * 40; i++) { const v = Math.random(); g.fillStyle = `rgba(${v > .5 ? '255,255,255' : '0,0,0'},${Math.random() * ruido})`; g.fillRect(Math.random() * escala, Math.random() * escala, 1 + Math.random() * 2, 1 + Math.random() * 2); }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; return t;
}
function rugosidad(ruido) { const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d'); g.fillStyle = '#9a9a9a'; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 9000; i++) { const v = 120 + Math.random() * 120 * ruido; g.fillStyle = `rgb(${v},${v},${v})`; g.fillRect(Math.random() * 256, Math.random() * 256, 2, 2); }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; return t; }

const ext = (shape, depth, mat, bevel = 0.06, seg = 48) => new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelSize: bevel, bevelThickness: bevel, bevelSegments: 4, curveSegments: seg }), mat);
const redondo = (w, h, r) => { const s = new THREE.Shape(); s.moveTo(-w + r, -h); s.lineTo(w - r, -h); s.quadraticCurveTo(w, -h, w, -h + r); s.lineTo(w, h - r); s.quadraticCurveTo(w, h, w - r, h); s.lineTo(-w + r, h); s.quadraticCurveTo(-w, h, -w, h - r); s.lineTo(-w, -h + r); s.quadraticCurveTo(-w, -h, -w + r, -h); return s; };

/* ───────── Freno de disco neumático de camión ───────── */
function frenoDisco(M) {
  const piezas = [];
  const add = (n, obj, x, nombre, ancla) => { const g = new THREE.Group(); g.add(obj); g.userData = { x, n }; obj.traverse(o => { if (o.isMesh) { o.castShadow = o.receiveShadow = true; o.userData.n = n; } }); piezas.push({ n, g, nombre, ancla: new THREE.Vector3(...ancla), x }); return g; };

  // 7 · disco ventilado con taladros y campana
  { const g = new THREE.Group(), R = 3.1, rin = 1.6;
    const cara = () => { const s = new THREE.Shape(); s.absarc(0, 0, R, 0, Math.PI * 2); const h = new THREE.Path(); h.absarc(0, 0, rin, 0, Math.PI * 2, true); s.holes.push(h);
      for (let i = 0; i < 30; i++) { const a = i / 30 * Math.PI * 2, rr = 2.2 + (i % 3) * 0.28; const p = new THREE.Path(); p.absarc(Math.cos(a) * rr, Math.sin(a) * rr, 0.065, 0, Math.PI * 2, true); s.holes.push(p); }
      const m = ext(s, 0.17, M.disco, 0.025, 96); m.rotation.y = Math.PI / 2; return m; };
    const c1 = cara(); c1.position.x = -0.34; const c2 = cara(); c2.position.x = 0.17; g.add(c1, c2);
    for (let i = 0; i < 40; i++) { const a = i / 40 * Math.PI * 2; const f = new THREE.Mesh(new THREE.BoxGeometry(0.32, 1.4, 0.08), M.fundicion); f.position.set(0, Math.cos(a) * 2.35, Math.sin(a) * 2.35); f.rotation.x = -a + 0.3; g.add(f); }
    const camp = new THREE.Mesh(new THREE.CylinderGeometry(1.62, 1.75, 1.15, 72, 1, true), M.fundicion); camp.rotation.z = Math.PI / 2; camp.position.x = -0.85; g.add(camp);
    const tapa = new THREE.Mesh(new THREE.CylinderGeometry(1.62, 1.62, 0.16, 72), M.fundicion); tapa.rotation.z = Math.PI / 2; tapa.position.x = -1.42; g.add(tapa);
    for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; const b = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.22, 24), M.acero); b.rotation.z = Math.PI / 2; b.position.set(-1.5, Math.cos(a) * 1.15, Math.sin(a) * 1.15); g.add(b); }
    const cubo = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.58, 0.22, 48), M.acero); cubo.rotation.z = Math.PI / 2; cubo.position.x = -1.5; g.add(cubo);
    add(7, g, -6.2, 'Disco de freno ventilado', [0, 3.3, 0]); }

  // 1 · soporte de pinza (fundición con brazos)
  { const g = new THREE.Group(); const s = new THREE.Shape(); s.moveTo(-0.55, -2.6); s.lineTo(0.55, -2.6); s.quadraticCurveTo(0.85, -1.8, 0.8, 0); s.quadraticCurveTo(0.85, 1.8, 0.55, 2.6); s.lineTo(-0.55, 2.6); s.quadraticCurveTo(-0.85, 1.8, -0.8, 0); s.quadraticCurveTo(-0.85, -1.8, -0.55, -2.6);
    [-2.0, 2.0].forEach(y => { const p = new THREE.Path(); p.absarc(0, y, 0.21, 0, Math.PI * 2, true); s.holes.push(p); });
    const m = ext(s, 0.6, M.fundicion, 0.1); m.rotation.y = Math.PI / 2; m.position.z = -1.7; g.add(m);
    [2.25, -2.25].forEach(y => { const b = ext(redondo(1.2, 0.26, 0.12), 0.5, M.fundicion, 0.06); b.position.set(-0.2, y - 0.25, -0.4); b.rotation.x = Math.PI / 2; b.rotation.z = Math.PI / 2; g.add(b); });
    add(1, g, -3.0, 'Soporte de pinza', [0, 3.0, -1.6]); }

  // 10 · tornillos del soporte
  { const g = new THREE.Group(); [2.0, -2.0].forEach(y => { const t = new THREE.Group(); const v = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 1.8, 28), M.zinc); v.rotation.z = Math.PI / 2; t.add(v);
      const pts = []; for (let k = 0; k <= 300; k++) { const u = k / 300; pts.push(new THREE.Vector3(-0.9 + u * 1.3, Math.cos(u * 64) * 0.19, Math.sin(u * 64) * 0.19)); }
      t.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 600, 0.03, 6), M.zinc));
      const cab = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.34, 6), M.zinc); cab.rotation.z = Math.PI / 2; cab.position.x = 1.0; t.add(cab); t.position.set(0, y, -1.7); g.add(t); });
    add(10, g, -4.6, 'Tornillo de soporte', [0, 2.6, -1.7]); }

  // 5 · pastillas (placa + forro con ranura y chaflanes)
  { const g = new THREE.Group(); [0, 1.45].forEach((dx, i) => { const p = new THREE.Group();
      const s = new THREE.Shape(); s.moveTo(-1.0, -2.25); s.quadraticCurveTo(-1.4, 0, -1.0, 2.25); s.lineTo(1.0, 2.25); s.quadraticCurveTo(1.3, 0, 1.0, -2.25); s.closePath();
      const pl = ext(s, 0.2, M.placa, 0.03); pl.rotation.y = Math.PI / 2; p.add(pl);
      const s2 = new THREE.Shape(); s2.moveTo(-0.82, -2.0); s2.quadraticCurveTo(-1.18, 0, -0.82, 2.0); s2.lineTo(0.82, 2.0); s2.quadraticCurveTo(1.08, 0, 0.82, -2.0); s2.closePath();
      const fr = ext(s2, 0.45, M.friccion, 0.05); fr.rotation.y = Math.PI / 2; fr.position.x = i ? 0.2 : -0.45; p.add(fr);
      const r = new THREE.Mesh(new THREE.BoxGeometry(0.47, 3.5, 0.07), M.negro); r.position.x = (i ? 0.2 : -0.45) + 0.22; p.add(r);
      p.position.x = dx; if (i) p.rotation.y = Math.PI; g.add(p); });
    add(5, g, -1.7, 'Juego de pastillas', [0.7, 2.7, 0.6]); }

  // 6 · muelle de retención de pastillas
  { const pts = []; for (let i = 0; i <= 90; i++) { const t = i / 90; pts.push(new THREE.Vector3(-1.0 + t * 2.0, Math.sin(t * Math.PI * 4) * 0.12, Math.cos(t * Math.PI) * 0.22)); }
    const g = new THREE.Group(); g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 180, 0.05, 12), M.cromo)); g.position.y = 2.9;
    add(6, g, -1.0, 'Muelle de pastillas', [0, 3.5, 0]); }

  // 11 · sensor de desgaste con cable y conector
  { const g = new THREE.Group(); g.add(new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.52, 0.26), M.goma));
    const pts = [new THREE.Vector3(0, -0.26, 0), new THREE.Vector3(0.35, -0.95, 0.45), new THREE.Vector3(1.2, -1.25, 0.95), new THREE.Vector3(2.1, -0.95, 1.45), new THREE.Vector3(2.7, -1.35, 1.95)];
    g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 90, 0.06, 10), M.goma));
    const con = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.32, 0.46), M.azul); con.position.copy(pts[4]); g.add(con); g.position.set(0, -2.95, 1.2);
    add(11, g, -1.2, 'Sensor de desgaste', [0.3, -4.3, 1.4]); }

  // 4 · guardapolvos y 3 · émbolos
  { const g = new THREE.Group(); [1.25, -1.25].forEach(z => { for (let k = 0; k < 4; k++) { const t = new THREE.Mesh(new THREE.TorusGeometry(0.68 - k * 0.025, 0.09, 18, 72), M.goma); t.rotation.y = Math.PI / 2; t.position.set(k * 0.16, 0, z); g.add(t); } });
    add(4, g, 0.7, 'Guardapolvo de émbolo', [0.2, -1.4, 2.3]); }
  { const g = new THREE.Group(); [1.25, -1.25].forEach(z => { const e = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 1.05, 72), M.cromo); e.rotation.z = Math.PI / 2; e.position.z = z; g.add(e);
      const tp = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.06, 16, 72), M.cromo); tp.rotation.y = Math.PI / 2; tp.position.set(-0.53, 0, z); g.add(tp); });
    add(3, g, 1.6, 'Émbolo de pinza', [0.3, 1.0, 2.3]); }

  // 2 · cuerpo de pinza: fundición gris redondeada, con nervios y puente
  { const g = new THREE.Group(); const s = new THREE.Shape(); s.absarc(0, 0, 3.05, Math.PI * 0.62, Math.PI * 1.38); s.absarc(0, 0, 3.05, Math.PI * 1.62, Math.PI * 2.38);
    [-1.25, 1.25].forEach(y => { const p = new THREE.Path(); p.absarc(0, y, 0.68, 0, Math.PI * 2, true); s.holes.push(p); });
    const cuerpo = ext(s, 1.7, M.pinza, 0.22, 72); cuerpo.rotation.y = Math.PI / 2; cuerpo.scale.set(1, 1, 0.62); g.add(cuerpo);
    for (let i = -2; i <= 2; i++) { const f = ext(redondo(0.5, 0.09, 0.05), 2.6, M.pinza, 0.05); f.position.set(1.85, i * 1.05, -1.3); g.add(f); }
    const puente = ext(redondo(1.45, 1.35, 0.55), 0.75, M.pinza, 0.18); puente.rotation.x = Math.PI / 2; puente.position.set(0.1, 3.75, 0); g.add(puente);
    const placaId = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.03, 0.55), M.placaId); placaId.position.set(0.1, 3.8, 0); g.add(placaId);
    const purga = new THREE.Group(); const pb = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.17, 0.5, 6), M.zinc); purga.add(pb); const tap = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.16, 20), M.goma); tap.position.y = 0.32; purga.add(tap); purga.position.set(1.0, 3.95, 0.85); g.add(purga);
    // brida del cilindro de aire
    const brida = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 0.3, 64), M.pinza); brida.rotation.x = Math.PI / 2; brida.position.set(1.1, 0, -1.55); g.add(brida);
    add(2, g, 3.4, 'Cuerpo de pinza', [0.1, 4.7, 0]); }

  // 14 · cilindro de freno de aire (diafragma)
  { const g = new THREE.Group(); const perfil = [[0, -1.2], [1.5, -1.2], [1.65, -1.0], [1.7, -0.2], [1.75, 0], [1.7, 0.2], [1.65, 1.0], [1.4, 1.25], [0.6, 1.4], [0, 1.4]].map(([x, y]) => new THREE.Vector2(x, y));
    const cuerpo = new THREE.Mesh(new THREE.LatheGeometry(perfil, 72), M.pintura); g.add(cuerpo);
    const abraz = new THREE.Mesh(new THREE.TorusGeometry(1.76, 0.09, 16, 96), M.acero); abraz.rotation.x = Math.PI / 2; g.add(abraz);
    const tor = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.5, 8), M.zinc); tor.position.set(1.78, 0, 0); tor.rotation.z = Math.PI / 2; g.add(tor);
    [0.6, -0.6].forEach(z => { const e = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.9, 20), M.zinc); e.position.set(0.55, -1.55, z); g.add(e); });
    const ent = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.6, 24), M.laton); ent.rotation.x = Math.PI / 2; ent.position.set(0.9, 0.6, 1.4); g.add(ent);
    g.rotation.z = -Math.PI / 2; g.scale.setScalar(0.85); const w = new THREE.Group(); w.add(g); w.position.set(0, 0, -2.6);
    add(14, w, 7.0, 'Cilindro de freno (diafragma)', [0, 2.2, -2.6]); }

  // 8 · pasadores guía y 9 · fuelles
  { const g = new THREE.Group(); [2.15, -2.15].forEach(y => { const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 2.6, 36), M.cromo); pin.rotation.z = Math.PI / 2; pin.position.set(0, y, -2.25); g.add(pin);
      const cab = new THREE.Mesh(new THREE.CylinderGeometry(0.31, 0.31, 0.22, 6), M.zinc); cab.rotation.z = Math.PI / 2; cab.position.set(1.35, y, -2.25); g.add(cab); });
    add(8, g, 10.0, 'Pasador guía', [0.8, 2.9, -2.25]); }
  { const g = new THREE.Group(); [2.15, -2.15].forEach(y => { for (let k = 0; k < 5; k++) { const t = new THREE.Mesh(new THREE.TorusGeometry(0.29 - k * 0.025, 0.07, 12, 48), M.goma); t.rotation.y = Math.PI / 2; t.position.set(k * 0.13, y, -2.25); g.add(t); } });
    add(9, g, 8.6, 'Fuelle de pasador', [0.2, 3.0, -2.25]); }

  // 12 · kit de reparación
  { const g = new THREE.Group(); g.add(new THREE.Mesh(new THREE.BoxGeometry(1.9, 1.1, 1.3), M.caja)); const f = new THREE.Mesh(new THREE.BoxGeometry(1.92, 0.3, 1.32), M.naranja); f.position.y = 0.2; g.add(f);
    g.position.set(0, -3.1, -3.4); g.rotation.y = 0.45; add(12, g, 9.6, 'Kit de reparación', [0, -2.1, -3.4]); }
  return piezas;
}

const MODELOS = { 'freno-disco': { titulo: 'Freno de disco neumático', armar: frenoDisco, centro: [1.6, 0.3, 0], dist: 25 } };
export const modelos = Object.fromEntries(Object.entries(MODELOS).map(([k, v]) => [k, v.titulo]));

export function montar(el, { modelo = 'freno-disco', alElegir = () => {}, sel = null } = {}) {
  const def = MODELOS[modelo]; if (!def) throw new Error('Modelo no existe: ' + modelo);
  const W = () => el.clientWidth || 800, H = () => el.clientHeight || 500;
  const r = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true }); r.setPixelRatio(Math.min(2, devicePixelRatio)); r.setSize(W(), H());
  r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 1.08; r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap;
  el.appendChild(r.domElement); r.domElement.className = 'mx-3d-canvas';
  const capa = document.createElement('div'); capa.className = 'mx-3d-capa'; el.appendChild(capa);
  const lineas = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); lineas.setAttribute('class', 'mx-3d-lineas'); el.appendChild(lineas);
  const scene = new THREE.Scene(); const pm = new THREE.PMREMGenerator(r); scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
  const cam = new THREE.PerspectiveCamera(30, W() / H(), 0.1, 200); const c0 = new THREE.Vector3(...def.centro);
  cam.position.set(c0.x + def.dist * 0.5, c0.y + def.dist * 0.3, def.dist * 0.82);
  const ctl = new OrbitControls(cam, r.domElement); ctl.target.copy(c0); ctl.enableDamping = true; ctl.minDistance = 8; ctl.maxDistance = 45; ctl.maxPolarAngle = Math.PI * 0.62; ctl.update();
  const key = new THREE.DirectionalLight(0xffffff, 2.3); key.position.set(6, 11, 9); key.castShadow = true; key.shadow.mapSize.set(2048, 2048); Object.assign(key.shadow.camera, { left: -14, right: 14, top: 10, bottom: -10 }); key.shadow.bias = -0.0004; scene.add(key);
  const rim = new THREE.DirectionalLight(0x6fc4ff, 1.5); rim.position.set(-9, 5, -7); scene.add(rim);
  scene.add(new THREE.HemisphereLight(0x8fb8ff, 0x101418, 0.35));
  const piso = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.ShadowMaterial({ opacity: 0.5 })); piso.rotation.x = -Math.PI / 2; piso.position.y = -3.9; piso.receiveShadow = true; scene.add(piso);
  const grid = new THREE.GridHelper(80, 80, 0x1b3150, 0x0f1c2e); grid.position.y = -3.89; scene.add(grid);
  const rough = rugosidad(1);
  const M = {
    fundicion: new THREE.MeshStandardMaterial({ map: textura('#5f6368', 0.25), roughnessMap: rough, metalness: 0.85, roughness: 0.62 }),
    disco: new THREE.MeshStandardMaterial({ map: textura('#a3a8ae', 0.18), metalness: 1, roughness: 0.3, roughnessMap: rough }),
    pinza: new THREE.MeshStandardMaterial({ map: textura('#6b7076', 0.3), roughnessMap: rough, metalness: 0.75, roughness: 0.58 }),
    pintura: new THREE.MeshStandardMaterial({ color: 0x1d2024, metalness: 0.35, roughness: 0.42 }),
    acero: new THREE.MeshStandardMaterial({ color: 0x8c9198, metalness: 1, roughness: 0.35 }),
    cromo: new THREE.MeshStandardMaterial({ color: 0xe8ebef, metalness: 1, roughness: 0.1 }),
    zinc: new THREE.MeshStandardMaterial({ color: 0xc9b47c, metalness: 0.9, roughness: 0.35 }),
    laton: new THREE.MeshStandardMaterial({ color: 0xd4a548, metalness: 1, roughness: 0.25 }),
    goma: new THREE.MeshStandardMaterial({ color: 0x151515, metalness: 0, roughness: 0.82 }),
    friccion: new THREE.MeshStandardMaterial({ map: textura('#2c2824', 0.35), metalness: 0.1, roughness: 0.95 }),
    placa: new THREE.MeshStandardMaterial({ color: 0x3a3f46, metalness: 0.75, roughness: 0.4 }),
    negro: new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 1 }),
    azul: new THREE.MeshStandardMaterial({ color: 0x1d5fbf, roughness: 0.5 }),
    naranja: new THREE.MeshStandardMaterial({ color: 0xff7a1a, roughness: 0.5 }),
    caja: new THREE.MeshStandardMaterial({ color: 0x18263b, roughness: 0.7 }),
    placaId: new THREE.MeshStandardMaterial({ color: 0xd9dde2, metalness: 0.6, roughness: 0.3 }),
  };
  const piezas = def.armar(M); piezas.forEach(p => scene.add(p.g));
  const brillo = new Map(); piezas.forEach(p => p.g.traverse(o => { if (o.isMesh) { o.material = o.material.clone(); brillo.set(o, o.material); } }));
  // números (usa .mx-pin para que el EPC los maneje como los de las láminas)
  const tags = piezas.map(p => { const b = document.createElement('button'); b.className = 'mx-pin mx-pin3d'; b.dataset.pin = p.n; b.textContent = p.n; b.title = p.nombre; capa.appendChild(b); return b; });
  let t = 1, meta = 1, elegido = sel, sucio = 3;
  const ray = new THREE.Raycaster(), m2 = new THREE.Vector2();
  r.domElement.addEventListener('click', e => { const b = r.domElement.getBoundingClientRect(); m2.set((e.clientX - b.left) / b.width * 2 - 1, -(e.clientY - b.top) / b.height * 2 + 1); ray.setFromCamera(m2, cam);
    const hit = ray.intersectObjects(piezas.map(p => p.g), true)[0]; if (hit && hit.object.userData.n) alElegir(hit.object.userData.n); });
  function marcar(n) { elegido = n; sucio = 2; piezas.forEach(p => p.g.traverse(o => { if (o.isMesh) { const on = p.n === n; o.material.emissive = new THREE.Color(on ? 0x0b4f86 : 0x000000); o.material.emissiveIntensity = on ? 0.9 : 0; } })); }
  marcar(sel);
  const ro = new ResizeObserver(() => { sucio = 2; r.setSize(W(), H()); cam.aspect = W() / H(); cam.updateProjectionMatrix(); }); ro.observe(el);
  let vivo = true;
  ctl.addEventListener('change', () => { sucio = 2; });
  (function loop() { if (!vivo) return; requestAnimationFrame(loop); const mov = Math.abs(meta - t) > 0.002; ctl.update(); if (!mov && !sucio) return; sucio = Math.max(0, sucio - 1); t += (meta - t) * 0.08; if (!mov) t = meta;
    piezas.forEach(p => { p.g.position.x = p.x * (0.18 + 0.82 * t) + c0.x * (1 - t) * 0.6; });
    r.render(scene, cam);
    let svg = ''; const w = W(), h = H();
    piezas.forEach((p, i) => { const a = p.ancla.clone(); a.x += p.g.position.x; const b = a.clone(); b.y += 0.95 * Math.sign(p.ancla.y || 1);
      const pa = a.project(cam), pb = b.project(cam); const ax = (pa.x + 1) / 2 * w, ay = (1 - pa.y) / 2 * h, bx = (pb.x + 1) / 2 * w, by = (1 - pb.y) / 2 * h;
      tags[i].style.left = bx + 'px'; tags[i].style.top = by + 'px'; tags[i].style.opacity = t > 0.35 ? 1 : 0;
      if (t > 0.35) svg += `<line x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}"/><circle cx="${ax}" cy="${ay}" r="2.6"/>`; });
    lineas.innerHTML = svg; })();
  return { piezas: piezas.map(p => ({ n: p.n, nombre: p.nombre })), tags, sel: marcar, armar: v => { meta = v ? 0 : 1; }, vista: () => { sucio = 2; cam.position.set(c0.x + def.dist * 0.5, c0.y + def.dist * 0.3, def.dist * 0.82); ctl.target.copy(c0); },
    destruir() { vivo = false; ro.disconnect(); ctl.dispose(); r.dispose(); el.innerHTML = ''; } };
}
