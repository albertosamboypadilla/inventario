/* Camión de diseño propio Eurotruck (sin marca): chasis 6×4, cabina, ruedas, tanques. Devuelve las mallas de la cabina para pasarlas a rayos X. */
import * as THREE from 'three';
import { textura, rugosidad } from './modelos3d.js';
export function construirCamion(scene) {
const rough = rugosidad(1);
const M = { chasis: new THREE.MeshStandardMaterial({ map: textura('#2a2d33', 0.22), roughnessMap: rough, metalness: 0.55, roughness: 0.5 }),
  remache: new THREE.MeshStandardMaterial({ color: 0x3b3f46, metalness: 0.8, roughness: 0.4 }), acero: new THREE.MeshStandardMaterial({ map: textura('#7d838b', 0.2), metalness: 0.95, roughness: 0.38 }),
  ballesta: new THREE.MeshStandardMaterial({ map: textura('#22252a', 0.3), metalness: 0.75, roughness: 0.48 }), goma: new THREE.MeshStandardMaterial({ map: textura('#161718', 0.15), metalness: 0, roughness: 0.88 }),
  llanta: new THREE.MeshStandardMaterial({ color: 0xc8ccd2, metalness: 0.95, roughness: 0.25 }), aluminio: new THREE.MeshStandardMaterial({ map: textura('#c4c9d0', 0.12), metalness: 1, roughness: 0.22 }),
  aire: new THREE.MeshStandardMaterial({ color: 0x2b2f35, metalness: 0.4, roughness: 0.4 }), amarillo: new THREE.MeshStandardMaterial({ color: 0xf2c230, metalness: 0.3, roughness: 0.45 }),
  rojo: new THREE.MeshStandardMaterial({ color: 0xb8312f, metalness: 0.3, roughness: 0.45 }), quinta: new THREE.MeshStandardMaterial({ map: textura('#3a3e44', 0.3), metalness: 0.8, roughness: 0.42 }),
  negro: new THREE.MeshStandardMaterial({ color: 0x0c0d0f, roughness: 0.8 }), naranja: new THREE.MeshStandardMaterial({ color: 0xff7a1a, roughness: 0.5 }) };
const cabina = [], resto = [];
const sh = o => { o.traverse(m => { if (m.isMesh) { m.castShadow = m.receiveShadow = true; resto.push(m); } }); scene.add(o); return o; };
const cil = (a, b, h, m, s = 48) => new THREE.Mesh(new THREE.CylinderGeometry(a, b, h, s), m);
const box = (x, y, z, m) => new THREE.Mesh(new THREE.BoxGeometry(x, y, z), m);
const L = 9.6, X0 = -4.6, ANCHO = 0.86;
// ── largueros en perfil C con alma más alta en el centro ──
function perfilC(h, b, t) { const s = new THREE.Shape(); s.moveTo(0, -h / 2); s.lineTo(b, -h / 2); s.lineTo(b, -h / 2 + t); s.lineTo(t, -h / 2 + t); s.lineTo(t, h / 2 - t); s.lineTo(b, h / 2 - t); s.lineTo(b, h / 2); s.lineTo(0, h / 2); s.closePath(); return s; }
[-1, 1].forEach(lado => { const g = new THREE.ExtrudeGeometry(perfilC(0.3, 0.09, 0.012), { depth: L, bevelEnabled: false }); const m = new THREE.Mesh(g, M.chasis); m.rotation.y = Math.PI / 2; m.position.set(X0, 0.55, lado * ANCHO / 2); if (lado > 0) m.scale.z = 1; m.rotation.y = lado > 0 ? Math.PI / 2 : -Math.PI / 2; m.position.x = lado > 0 ? X0 : X0 + L; sh(m);
  // remaches a lo largo (en filas)
  const rem = new THREE.InstancedMesh(new THREE.SphereGeometry(0.014, 10, 8), M.remache, 260); let k = 0; const mt = new THREE.Matrix4();
  for (let x = X0 + 0.15; x < X0 + L - 0.1 && k < 258; x += 0.075) { if (Math.abs(((x - X0) % 1.55) - 0.4) < 0.22) { [0.07, -0.07].forEach(y => { mt.makeTranslation(x, 0.55 + y, lado * (ANCHO / 2 + 0.002)); rem.setMatrixAt(k++, mt); }); } }
  rem.count = k; rem.castShadow = true; scene.add(rem);
  // agujeros de aligeramiento (cajas oscuras simulando perforaciones)
  for (let i = 0; i < 10; i++) { const a = box(0.06, 0.06, 0.004, M.negro); a.position.set(X0 + 0.7 + i * 0.9, 0.62, lado * (ANCHO / 2 + 0.003)); scene.add(a); } });
// ── travesaños con cartelas ──
[-4.4, -3.1, -1.9, -0.6, 0.9, 2.3, 3.4, 4.8].forEach((x, i) => { const g = new THREE.Group(); const t = box(0.14, i % 2 ? 0.22 : 0.16, ANCHO - 0.02, M.chasis); g.add(t);
  [-1, 1].forEach(s => { const c = new THREE.Mesh(new THREE.ExtrudeGeometry((() => { const p = new THREE.Shape(); p.moveTo(0, 0); p.lineTo(0.22, 0); p.lineTo(0, 0.22); p.closePath(); return p; })(), { depth: 0.01, bevelEnabled: false }), M.chasis); c.position.set(-0.11, -0.11, s * (ANCHO / 2 - 0.03)); g.add(c);
    const c2 = c.clone(); c2.rotation.z = Math.PI; c2.position.set(0.11, 0.11, s * (ANCHO / 2 - 0.03)); g.add(c2); });
  g.position.set(x, 0.55, 0); sh(g); });
// ── parachoques y defensa delantera ──
{ const pc = box(0.18, 0.32, 2.3, M.chasis); pc.position.set(5.1, 0.35, 0); sh(pc); }
[-0.85, 0.85].forEach(z => { const f = cil(0.07, 0.07, 0.04, M.aluminio, 24); f.rotation.z = Math.PI / 2; f.position.set(5.2, 0.42, z); scene.add(f); });
// ── eje delantero (viga en I) con ballestas parabólicas ──
const ruedas = [];
function rueda(x, z, doble) { const g = new THREE.Group();
  const perfil = []; for (let i = 0; i <= 24; i++) { const a = -Math.PI / 2 + i / 24 * Math.PI; perfil.push(new THREE.Vector2(0.38 + Math.cos(a) * 0.14, Math.sin(a) * 0.15)); }
  const llantaGom = new THREE.Mesh(new THREE.LatheGeometry(perfil.map(p => new THREE.Vector2(p.x + 0.02, p.y)), 72), M.goma);
  for (let i = 0; i < 4; i++) { const ra = new THREE.Mesh(new THREE.TorusGeometry(0.535, 0.012, 6, 96), M.negro); ra.position.y = -0.09 + i * 0.06; ra.rotation.x = Math.PI / 2; llantaGom.add(ra); }
  llantaGom.rotation.x = Math.PI / 2;
  const unaRueda = () => { const w = new THREE.Group(); const gm = llantaGom.clone(); w.add(gm);
    const rin = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.24, 64, 1, true), M.llanta); rin.rotation.x = Math.PI / 2; w.add(rin);
    const disco = cil(0.34, 0.34, 0.02, M.llanta, 64); disco.rotation.x = Math.PI / 2; disco.position.z = 0.06; w.add(disco);
    for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; const tu = cil(0.018, 0.018, 0.05, M.acero, 6); tu.rotation.x = Math.PI / 2; tu.position.set(Math.cos(a) * 0.13, Math.sin(a) * 0.13, 0.08); w.add(tu);
      const hu = cil(0.035, 0.035, 0.03, M.negro, 16); hu.rotation.x = Math.PI / 2; hu.position.set(Math.cos(a + 0.3) * 0.25, Math.sin(a + 0.3) * 0.25, 0.07); w.add(hu); }
    const cubo = cil(0.08, 0.1, 0.1, M.acero, 32); cubo.rotation.x = Math.PI / 2; cubo.position.z = 0.11; w.add(cubo); return w; };
  const w1 = unaRueda(); w1.position.z = z > 0 ? 0 : 0; if (z < 0) w1.rotation.y = Math.PI; g.add(w1);
  if (doble) { const w2 = unaRueda(); w2.position.z = z > 0 ? -0.32 : 0.32; if (z < 0) w2.rotation.y = Math.PI; g.add(w2); }
  g.position.set(x, 0, z); sh(g); ruedas.push(g); }
function ballesta(x, z, largo, hojas) { const g = new THREE.Group(); for (let i = 0; i < hojas; i++) { const l = largo - i * (largo / hojas) * 0.75;
    const c = new THREE.CatmullRomCurve3([new THREE.Vector3(-l / 2, 0.06 - i * 0.025 + 0.05, 0), new THREE.Vector3(0, -i * 0.025, 0), new THREE.Vector3(l / 2, 0.06 - i * 0.025 + 0.05, 0)]);
    const pts = c.getPoints(30); const s = new THREE.Shape(); s.moveTo(-0.045, -0.009); s.lineTo(0.045, -0.009); s.lineTo(0.045, 0.009); s.lineTo(-0.045, 0.009);
    const m = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { steps: 40, bevelEnabled: false, extrudePath: new THREE.CatmullRomCurve3(pts) }), M.ballesta); g.add(m); }
  [-1, 1].forEach(s => { const ojo = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.014, 10, 24), M.ballesta); ojo.position.set(s * largo / 2, 0.11, 0); g.add(ojo); });
  for (const dz of [-0.035, 0.035]) { const u = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.012, 8, 24, Math.PI), M.acero); u.rotation.z = Math.PI; u.position.set(0, -0.1, dz); u.scale.y = 1.6; g.add(u); }
  g.position.set(x, 0.3, z); sh(g); return g; }
// eje delantero
{ const s = new THREE.Shape(); s.moveTo(-0.05, -0.07); s.lineTo(0.05, -0.07); s.lineTo(0.05, -0.055); s.lineTo(0.012, -0.055); s.lineTo(0.012, 0.055); s.lineTo(0.05, 0.055); s.lineTo(0.05, 0.07); s.lineTo(-0.05, 0.07); s.lineTo(-0.05, 0.055); s.lineTo(-0.012, 0.055); s.lineTo(-0.012, -0.055); s.lineTo(-0.05, -0.055); s.closePath();
  const curva = new THREE.CatmullRomCurve3([new THREE.Vector3(3.7, 0.0, -1.0), new THREE.Vector3(3.7, 0.12, -0.6), new THREE.Vector3(3.7, 0.12, 0.6), new THREE.Vector3(3.7, 0.0, 1.0)]);
  sh(new THREE.Mesh(new THREE.ExtrudeGeometry(s, { steps: 60, bevelEnabled: false, extrudePath: curva }), M.chasis));
  [-1, 1].forEach(z => { const kp = cil(0.06, 0.06, 0.28, M.acero, 24); kp.position.set(3.7, 0.0, z * 1.0); sh(kp); const tamb = cil(0.24, 0.24, 0.18, M.acero, 48); tamb.rotation.x = Math.PI / 2; tamb.position.set(3.7, 0, z * 1.05); sh(tamb);
    const cam = cil(0.1, 0.1, 0.14, M.aire, 32); cam.rotation.z = Math.PI / 2; cam.position.set(3.45, 0.2, z * 0.85); sh(cam); });
  const barra = cil(0.025, 0.025, 2.0, M.acero, 16); barra.rotation.x = Math.PI / 2; barra.position.set(3.4, -0.05, 0); sh(barra);
  [-1, 1].forEach(z => { ballesta(3.7, z * 0.43, 1.4, 3); const am = new THREE.Group(); am.add(cil(0.04, 0.04, 0.4, M.amarillo, 20)); const v = cil(0.016, 0.016, 0.22, M.aluminio, 12); v.position.y = 0.29; am.add(v); am.position.set(3.25, 0.33, z * 0.5); am.rotation.x = z * 0.15; sh(am); });
  rueda(3.7, 1.33, false); rueda(3.7, -1.33, false); }
// ── tándem trasero: ejes motrices con diferencial y suspensión neumática ──
[-1.75, -3.1].forEach((x, i) => { const g = new THREE.Group(); const tubo = cil(0.07, 0.07, 2.0, M.chasis, 32); tubo.rotation.x = Math.PI / 2; g.add(tubo);
  const dif = new THREE.Mesh(new THREE.SphereGeometry(0.24, 40, 24), M.chasis); dif.scale.set(0.9, 1, 0.75); g.add(dif); const tapa = cil(0.16, 0.16, 0.06, M.acero, 40); tapa.rotation.z = Math.PI / 2; tapa.position.x = -0.2; g.add(tapa);
  const pinon = cil(0.08, 0.1, 0.22, M.acero, 32); pinon.rotation.z = Math.PI / 2; pinon.position.x = 0.28; g.add(pinon);
  for (let k = 0; k < 10; k++) { const a = k / 10 * Math.PI * 2; const p = cil(0.01, 0.01, 0.07, M.acero, 6); p.rotation.z = Math.PI / 2; p.position.set(-0.23, Math.cos(a) * 0.13, Math.sin(a) * 0.13); g.add(p); }
  [-1, 1].forEach(z => { const tamb = cil(0.25, 0.25, 0.2, M.acero, 48); tamb.rotation.x = Math.PI / 2; tamb.position.z = z * 0.82; g.add(tamb);
    const cf = new THREE.Group(); const cuerpo = new THREE.Mesh(new THREE.LatheGeometry([[0, -0.12], [0.11, -0.12], [0.12, 0], [0.11, 0.14], [0.08, 0.2], [0, 0.2]].map(([a, b]) => new THREE.Vector2(a, b)), 32), M.aire); cf.add(cuerpo); cf.rotation.z = Math.PI / 2; cf.position.set(0.35, 0.18, z * 0.7); g.add(cf);
    const fuelle = new THREE.Group(); for (let k = 0; k < 3; k++) { const t = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.05, 14, 36), M.goma); t.rotation.x = Math.PI / 2; t.position.y = k * 0.08; fuelle.add(t); } fuelle.position.set(-0.35, 0.18, z * 0.48); g.add(fuelle);
    const brazo = box(0.9, 0.05, 0.09, M.ballesta); brazo.position.set(0.05, 0.06, z * 0.48); g.add(brazo); });
  g.position.set(x, 0, 0); sh(g); rueda(x, 1.12, true); rueda(x, -1.12, true); });
// cardán
{ const c = cil(0.05, 0.05, 2.3, M.acero, 24); c.rotation.z = Math.PI / 2; c.position.set(-0.35, 0.12, 0); c.rotation.y = 0; sh(c); const c2 = cil(0.045, 0.045, 1.05, M.acero, 24); c2.rotation.z = Math.PI / 2; c2.position.set(-2.4, 0.05, 0); sh(c2);
  [0.8, -1.5, -1.95, -2.9].forEach(x => { const cr = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.02, 10, 20), M.acero); cr.rotation.y = Math.PI / 2; cr.position.set(x, x > 0 ? 0.12 : 0.07, 0); sh(cr); }); }
// ── depósitos de aire, tanque de combustible, baterías ──
[[-0.2, -0.62], [0.9, -0.62]].forEach(([x, z]) => { const d = cil(0.13, 0.13, 0.9, M.aire, 40); d.rotation.z = Math.PI / 2; d.position.set(x, 0.3, z); sh(d); [-1, 1].forEach(s => { const c = new THREE.Mesh(new THREE.SphereGeometry(0.13, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), M.aire); c.rotation.z = s * -Math.PI / 2; c.position.set(x + s * 0.45, 0.3, z); sh(c); }); });
{ const t = new THREE.Mesh(new THREE.ExtrudeGeometry((() => { const s = new THREE.Shape(); s.absarc(0, 0, 0.32, 0, Math.PI * 2); return s; })(), { depth: 1.5, bevelEnabled: true, bevelSize: 0.04, bevelThickness: 0.04, curveSegments: 48 }), M.aluminio); t.rotation.y = Math.PI / 2; t.position.set(0.1, 0.38, 0.88); t.position.x = 1.6 - 1.5; sh(t);
  [0.35, 1.25].forEach(x => { const f = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.015, 8, 48), M.negro); f.rotation.y = Math.PI / 2; f.position.set(x, 0.38, 0.88); scene.add(f); });
  const tap = cil(0.06, 0.06, 0.05, M.negro, 24); tap.position.set(1.4, 0.73, 0.88); sh(tap); }
{ const b = box(0.7, 0.32, 0.5, M.aire); b.position.set(2.1, 0.32, -0.75); sh(b); const tp = box(0.72, 0.03, 0.52, M.naranja); tp.position.set(2.1, 0.5, -0.75); sh(tp); }
// ── quinta rueda ──
{ const g = new THREE.Group(); const plato = new THREE.Mesh(new THREE.ExtrudeGeometry((() => { const s = new THREE.Shape(); s.absarc(0, 0, 0.5, Math.PI * 0.12, Math.PI * 1.88); s.lineTo(-0.15, -0.05); s.lineTo(-0.15, 0.05); s.closePath(); return s; })(), { depth: 0.06, bevelEnabled: true, bevelSize: 0.015, bevelThickness: 0.015 }), M.quinta); plato.rotation.x = -Math.PI / 2; g.add(plato);
  for (let i = 0; i < 6; i++) { const r2 = new THREE.Mesh(new THREE.TorusGeometry(0.1 + i * 0.065, 0.005, 6, 48, Math.PI * 1.4), M.negro); r2.rotation.x = -Math.PI / 2; r2.rotation.z = Math.PI * 0.8; r2.position.y = 0.081; g.add(r2); }
  [-1, 1].forEach(s => { const sop = box(0.4, 0.14, 0.08, M.quinta); sop.position.set(0, -0.06, s * 0.42); g.add(sop); }); const pal = cil(0.015, 0.015, 0.4, M.rojo, 10); pal.rotation.x = Math.PI / 2; pal.position.set(0.05, 0.02, 0.6); g.add(pal);
  g.position.set(-2.35, 0.8, 0); sh(g); }
// ── guardafangos traseros ──
[-1, 1].forEach(z => { const s = new THREE.Shape(); s.absarc(0, 0, 0.66, 0, Math.PI); s.absarc(0, 0, 0.62, Math.PI, 0, true); const gf = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: 0.62, bevelEnabled: false, curveSegments: 40 }), M.negro); gf.scale.x = 2.2; gf.position.set(-2.42, 0.05, z > 0 ? 0.82 : -1.44); sh(gf); });

// ── modo: ?rx=1 cabina en rayos X ──
const RX = false;
const pintura = new THREE.MeshPhysicalMaterial({ color: 0x1f4f8f, metalness: 0.55, roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.08 });
const vidrioRX = new THREE.MeshPhysicalMaterial({ color: 0x5fb8ff, transparent: true, opacity: 0.1, roughness: 0.1, depthWrite: false, side: THREE.DoubleSide });
const bordeRX = new THREE.LineBasicMaterial({ color: 0x3fb8ff, transparent: true, opacity: 0.6 });
const cristal = new THREE.MeshPhysicalMaterial({ color: 0x0b1622, metalness: 0.2, roughness: 0.05, transparent: true, opacity: 0.85, clearcoat: 1 });
const plasticoN = new THREE.MeshStandardMaterial({ color: 0x15171a, metalness: 0.2, roughness: 0.6 });
const cabMat = RX ? vidrioRX : pintura;
const pieza = (geo, mat, pos, rot) => { const m = new THREE.Mesh(geo, mat); m.position.set(...pos); if (rot) m.rotation.set(...rot); cabina.push(m); if (RX && (mat === pintura || mat === cabMat)) { const g = new THREE.Group(); g.add(m); const e = new THREE.LineSegments(new THREE.EdgesGeometry(geo, 30), bordeRX); e.position.copy(m.position); e.rotation.copy(m.rotation); g.add(e); scene.add(g); m.renderOrder = 3; return m; } m.castShadow = m.receiveShadow = true; scene.add(m); return m; };
// cabina: perfil lateral propio (frente casi vertical, techo alto, alerón)
{ const s = new THREE.Shape(); s.moveTo(0, 0); s.lineTo(2.25, 0); s.lineTo(2.32, 0.95); s.lineTo(2.22, 2.05); s.quadraticCurveTo(2.18, 2.45, 1.85, 2.55); s.lineTo(0.15, 2.62); s.quadraticCurveTo(0, 2.62, 0, 2.45); s.closePath();
  const geo = new THREE.ExtrudeGeometry(s, { depth: 2.3, bevelEnabled: true, bevelSize: 0.1, bevelThickness: 0.1, bevelSegments: 6, curveSegments: 32 }); geo.translate(0, 0, -1.15);
  pieza(geo, cabMat, [2.95, 1.0, 0]);
  // alerón de techo
  const a = new THREE.Shape(); a.moveTo(0, 0); a.lineTo(1.6, 0); a.quadraticCurveTo(1.55, 0.5, 0.2, 0.55); a.lineTo(0, 0.5); a.closePath();
  const ag = new THREE.ExtrudeGeometry(a, { depth: 2.1, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05, curveSegments: 24 }); ag.translate(0, 0, -1.05); pieza(ag, cabMat, [3.15, 3.62, 0]);
  if (!RX) {
    // parabrisas y ventanas laterales
    pieza(new THREE.BoxGeometry(0.04, 0.95, 2.15), cristal, [5.29, 2.55, 0], [0, 0, 0.09]);
    [-1, 1].forEach(z => { pieza(new THREE.BoxGeometry(0.85, 0.7, 0.02), cristal, [4.6, 2.6, z * 1.26]); pieza(new THREE.BoxGeometry(0.05, 0.03, 0.12), M.aluminio, [4.25, 1.95, z * 1.27]);
      // retrovisor
      const brazo = cil(0.02, 0.02, 0.45, plasticoN, 10); brazo.rotation.x = Math.PI / 2; brazo.position.set(5.2, 2.75, z * 1.42); scene.add(brazo); pieza(new THREE.BoxGeometry(0.08, 0.55, 0.22), plasticoN, [5.18, 2.6, z * 1.62]);
      // escalones
      [1.25, 0.85].forEach((y, i) => pieza(new THREE.BoxGeometry(0.42, 0.04, 0.22), M.aluminio, [4.75, y, z * (1.24 + i * 0.02)]));
      // faros
      pieza(new THREE.BoxGeometry(0.06, 0.18, 0.42), new THREE.MeshStandardMaterial({ color: 0xdfeeff, emissive: 0x9fd2ff, emissiveIntensity: 0.6, metalness: 0.3, roughness: 0.1 }), [5.31, 1.35, z * 0.86]); });
    // parrilla genérica (sin logo)
    for (let i = 0; i < 6; i++) pieza(new THREE.BoxGeometry(0.03, 0.04, 1.3), M.aluminio, [5.33, 1.55 + i * 0.12, 0]);
    pieza(new THREE.BoxGeometry(0.02, 0.8, 1.42), plasticoN, [5.31, 1.85, 0]);
    // líneas de puerta, manilla, deflector de esquina y faldón
    [-1, 1].forEach(z => { pieza(new THREE.BoxGeometry(0.012, 1.85, 0.01), plasticoN, [3.95, 1.95, z * 1.255]); pieza(new THREE.BoxGeometry(1.3, 0.012, 0.01), plasticoN, [4.6, 1.03, z * 1.255]);
      pieza(new THREE.BoxGeometry(0.012, 1.0, 0.01), plasticoN, [5.22, 1.55, z * 1.255]);
      const def = new THREE.Shape(); def.moveTo(0, 0); def.lineTo(0.14, 0); def.lineTo(0.04, 1.5); def.lineTo(0, 1.5); def.closePath();
      const dg = new THREE.ExtrudeGeometry(def, { depth: 0.04, bevelEnabled: true, bevelSize: 0.01, bevelThickness: 0.01 }); pieza(dg, pintura, [3.0, 1.95, z * 1.3], [0, z > 0 ? 0 : Math.PI, 0]);
      pieza(new THREE.BoxGeometry(1.9, 0.38, 0.06), plasticoN, [4.1, 0.82, z * 1.24]); });
    // parachoques integrado con antinieblas
    pieza(new THREE.BoxGeometry(0.22, 0.38, 2.42), plasticoN, [5.3, 0.82, 0]);
    [-1, 1].forEach(z => pieza(new THREE.BoxGeometry(0.03, 0.08, 0.22), new THREE.MeshStandardMaterial({ color: 0xffe6a8, emissive: 0xffc860, emissiveIntensity: 0.35 }), [5.42, 0.82, z * 0.95]));
    // luces de gálibo en el techo
    for (let i = -2; i <= 2; i++) pieza(new THREE.BoxGeometry(0.04, 0.05, 0.1), new THREE.MeshStandardMaterial({ color: 0xffb030, emissive: 0xff9a10, emissiveIntensity: 0.7 }), [5.12, 3.62, i * 0.38]);
    // visera
    pieza(new THREE.BoxGeometry(0.35, 0.05, 2.2), plasticoN, [5.3, 3.12, 0], [0, 0, -0.25]);
  } else { pieza(new THREE.BoxGeometry(0.04, 0.95, 2.15), vidrioRX, [5.29, 2.55, 0], [0, 0, 0.09]); }
}
// escape vertical y filtro de aire detrás de la cabina
{ const fa = cil(0.2, 0.2, 1.0, plasticoN, 32); fa.position.set(2.75, 1.8, -1.0); sh(fa); }


return { cabina, resto };
}
