// EUROTRUCK · Piezas de camión en 3D (modelos propios, procedurales).
// Portada: piezas flotando. EPC: carrusel de sistemas; al elegir uno, su pieza pasa al frente.
import * as THREE from 'three';
import { RoomEnvironment } from '/js/vendor/three/RoomEnvironment.js';

const M = {
  acero: () => new THREE.MeshStandardMaterial({ color: 0xa9b1bb, metalness: 1, roughness: .26 }),
  fundicion: () => new THREE.MeshStandardMaterial({ color: 0x5b626c, metalness: .85, roughness: .55 }),
  oscuro: () => new THREE.MeshStandardMaterial({ color: 0x1c1f25, metalness: .5, roughness: .5 }),
  alu: () => new THREE.MeshStandardMaterial({ color: 0xd9dee5, metalness: 1, roughness: .18 }),
  naranja: () => new THREE.MeshPhysicalMaterial({ color: 0xff6a0a, metalness: .35, roughness: .32, clearcoat: 1, clearcoatRoughness: .15 }),
  friccion: () => new THREE.MeshStandardMaterial({ color: 0x3b332d, metalness: .1, roughness: .95 }),
  cobre: () => new THREE.MeshStandardMaterial({ color: 0xc8794a, metalness: 1, roughness: .3 }),
  azul: () => new THREE.MeshPhysicalMaterial({ color: 0x2a5bd7, metalness: .3, roughness: .35, clearcoat: .8 }),
  goma: () => new THREE.MeshStandardMaterial({ color: 0x101114, metalness: 0, roughness: .9 })
};
const cil = (r1, r2, h, s = 48) => new THREE.CylinderGeometry(r1, r2, h, s);
function torno(puntos, s = 64) { return new THREE.LatheGeometry(puntos.map(([x, y]) => new THREE.Vector2(x, y)), s); }
function mesh(g, m, pos, rot) { const o = new THREE.Mesh(g, m); if (pos) o.position.set(...pos); if (rot) o.rotation.set(...rot); o.castShadow = o.receiveShadow = true; return o; }
function anilloPerforado(R, r, h, agujeros, rh, mat) {
  const s = new THREE.Shape(); s.absarc(0, 0, R, 0, Math.PI * 2);
  const c = new THREE.Path(); c.absarc(0, 0, r, 0, Math.PI * 2, true); s.holes.push(c);
  for (const [x, y] of agujeros) { const p = new THREE.Path(); p.absarc(x, y, rh, 0, Math.PI * 2, true); s.holes.push(p); }
  const g = new THREE.ExtrudeGeometry(s, { depth: h, bevelEnabled: true, bevelThickness: .01, bevelSize: .01, bevelSegments: 2, curveSegments: 48 }); g.translate(0, 0, -h / 2); return mesh(g, mat);
}

const MODELOS = {
  'Sistema de freno'() { // disco ventilado perforado + caliper naranja
    const g = new THREE.Group(); const ag = []; for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2, rr = i % 2 ? .78 : .66; ag.push([Math.cos(a) * rr, Math.sin(a) * rr]); }
    const ac = M.acero(); g.add(anilloPerforado(1, .42, .07, ag, .035, ac).translateZ(.09), anilloPerforado(1, .42, .07, ag, .035, ac).translateZ(-.09));
    for (let i = 0; i < 30; i++) { const a = i / 30 * Math.PI * 2; g.add(mesh(new THREE.BoxGeometry(.5, .03, .12), M.fundicion(), [Math.cos(a) * .72, Math.sin(a) * .72, 0], [0, 0, a])); }
    g.add(mesh(torno([[0, -.16], [.45, -.16], [.45, .12], [.4, .2], [.12, .22], [.12, .3], [0, .3]]), M.fundicion(), [0, 0, 0], [Math.PI / 2, 0, 0]));
    for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; g.add(mesh(cil(.035, .035, .5, 12), M.alu(), [Math.cos(a) * .3, Math.sin(a) * .3, .2], [Math.PI / 2, 0, 0])); }
    const cal = new THREE.Shape(); cal.absarc(0, 0, 1.08, Math.PI * .1, Math.PI * .55); cal.absarc(0, 0, .7, Math.PI * .55, Math.PI * .1, true);
    const gc = new THREE.ExtrudeGeometry(cal, { depth: .42, bevelEnabled: true, bevelThickness: .06, bevelSize: .05, bevelSegments: 4, curveSegments: 24 }); gc.translate(0, 0, -.21);
    g.add(mesh(gc, M.naranja())); return g;
  },
  'Caja de cambios'() { // engranaje recto con dientes
    const n = 22, R = .95, r = .8, s = new THREE.Shape();
    for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2, d = Math.PI / n;
      const pts = [[a - d * .55, r], [a - d * .28, R], [a + d * .28, R], [a + d * .55, r]]; pts.forEach(([t, rad], k) => { const x = Math.cos(t) * rad, y = Math.sin(t) * rad; i === 0 && k === 0 ? s.moveTo(x, y) : s.lineTo(x, y); });
      s.absarc(0, 0, r, a + d * .55, a + d * 1.45); }
    const h = new THREE.Path(); h.absarc(0, 0, .26, 0, Math.PI * 2, true); s.holes.push(h);
    for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2, p = new THREE.Path(); p.absarc(Math.cos(a) * .53, Math.sin(a) * .53, .1, 0, Math.PI * 2, true); s.holes.push(p); }
    const geo = new THREE.ExtrudeGeometry(s, { depth: .32, bevelEnabled: true, bevelThickness: .03, bevelSize: .025, bevelSegments: 3, curveSegments: 10 }); geo.translate(0, 0, -.16);
    const g = new THREE.Group(); g.add(mesh(geo, M.acero())); g.add(mesh(cil(.32, .32, .5, 40), M.fundicion(), null, [Math.PI / 2, 0, 0]));
    const ch = mesh(cil(.26, .26, .52, 40), M.oscuro(), null, [Math.PI / 2, 0, 0]); g.add(ch); return g;
  },
  'Motor'() { // pistón con anillos y biela
    const g = new THREE.Group();
    g.add(mesh(torno([[0, .6], [.48, .6], [.52, .55], [.52, -.35], [.46, -.42], [0, -.42]]), M.alu(), [0, .55, 0]));
    for (const y of [.98, .9, .82]) g.add(mesh(new THREE.TorusGeometry(.522, .016, 8, 64), M.oscuro(), [0, y, 0], [Math.PI / 2, 0, 0]));
    g.add(mesh(cil(.13, .13, 1.12, 24), M.acero(), [0, .38, 0], [0, 0, Math.PI / 2]));
    const b = new THREE.Shape(); b.moveTo(-.1, .35); b.lineTo(.1, .35); b.lineTo(.16, -.85); b.lineTo(-.16, -.85); b.closePath();
    const gb = new THREE.ExtrudeGeometry(b, { depth: .14, bevelEnabled: true, bevelThickness: .03, bevelSize: .03, bevelSegments: 3 }); gb.translate(0, 0, -.07);
    g.add(mesh(gb, M.acero(), [0, 0, 0]));
    g.add(mesh(new THREE.TorusGeometry(.3, .09, 16, 40), M.acero(), [0, -1.0, 0]));
    g.add(mesh(new THREE.TorusGeometry(.17, .06, 12, 32), M.cobre(), [0, .38, 0])); g.position.y = -.1; return g;
  },
  'Embrague y pedal'() { // disco de embrague con muelles
    const g = new THREE.Group(); const ag = []; for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; ag.push([Math.cos(a) * .82, Math.sin(a) * .82]); }
    g.add(anilloPerforado(1, .55, .06, ag, .04, M.friccion()));
    g.add(mesh(cil(.6, .6, .05, 64), M.acero(), null, [Math.PI / 2, 0, 0]));
    for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; const sp = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(Array.from({ length: 30 }, (_, k) => new THREE.Vector3(Math.cos(k * .9) * .05, -.13 + k * .009, Math.sin(k * .9) * .05))), 60, .013, 6), M.naranja());
      sp.position.set(Math.cos(a) * .36, Math.sin(a) * .36, .05); sp.rotation.set(Math.PI / 2, 0, a + Math.PI / 2); g.add(sp); }
    g.add(mesh(cil(.18, .18, .3, 6), M.fundicion(), null, [Math.PI / 2, 0, 0])); return g;
  },
  'Bujes y ruedas'() { // rodamiento de bolas
    const g = new THREE.Group();
    g.add(mesh(torno([[.78, -.22], [1, -.22], [1, .22], [.78, .22], [.74, .1], [.74, -.1], [.78, -.22]]), M.acero(), null, [Math.PI / 2, 0, 0]));
    g.add(mesh(torno([[.42, -.22], [.58, -.22], [.62, -.1], [.62, .1], [.58, .22], [.42, .22], [.42, -.22]]), M.acero(), null, [Math.PI / 2, 0, 0]));
    for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2; g.add(mesh(new THREE.SphereGeometry(.105, 24, 16), M.alu(), [Math.cos(a) * .68, Math.sin(a) * .68, 0])); }
    g.add(mesh(new THREE.TorusGeometry(.68, .025, 8, 80), M.naranja())); return g;
  },
  'Suspensión'() { // resorte helicoidal + amortiguador
    const g = new THREE.Group(); const pts = []; for (let i = 0; i <= 260; i++) { const t = i / 260, a = t * Math.PI * 2 * 7; pts.push(new THREE.Vector3(Math.cos(a) * .45, -1 + t * 2, Math.sin(a) * .45)); }
    g.add(mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 600, .075, 12), M.naranja()));
    g.add(mesh(cil(.17, .17, 2.1, 32), M.oscuro())); g.add(mesh(cil(.09, .09, 2.5, 24), M.alu(), [0, .3, 0]));
    for (const y of [-1.05, 1.05]) g.add(mesh(cil(.55, .55, .07, 48), M.fundicion(), [0, y, 0]));
    g.scale.setScalar(.85); return g;
  },
  'Sistema de combustible'() { // filtro de combustible
    const g = new THREE.Group();
    g.add(mesh(torno([[0, -1], [.5, -1], [.55, -.95], [.55, .7], [.5, .78], [0, .78]]), M.azul()));
    for (let i = 0; i < 10; i++) g.add(mesh(new THREE.TorusGeometry(.552, .012, 6, 64), M.oscuro(), [0, -.82 + i * .05, 0], [Math.PI / 2, 0, 0]));
    g.add(mesh(cil(.56, .56, .32, 48), new THREE.MeshStandardMaterial({ color: 0xf2f4f7, metalness: .1, roughness: .5 }), [0, .25, 0]));
    g.add(mesh(cil(.5, .52, .14, 48), M.acero(), [0, .86, 0]));
    g.add(mesh(cil(.16, .16, .14, 6), M.alu(), [0, .98, 0])); g.add(mesh(new THREE.TorusGeometry(.38, .03, 8, 48), M.goma(), [0, .93, 0], [Math.PI / 2, 0, 0]));
    g.scale.setScalar(.95); return g;
  },
  'Sistema de refrigeración'() { // bomba de agua con polea y rodete
    const g = new THREE.Group();
    g.add(mesh(torno([[0, -.3], [.55, -.3], [.6, -.2], [.6, .1], [.35, .2], [.2, .55], [0, .55]]), M.fundicion()));
    g.add(mesh(cil(.7, .7, .1, 48), M.alu(), [0, .62, 0])); g.add(mesh(new THREE.TorusGeometry(.7, .04, 8, 64), M.oscuro(), [0, .62, 0], [Math.PI / 2, 0, 0]));
    for (let i = 0; i < 4; i++) { const a = i / 4 * Math.PI * 2; g.add(mesh(cil(.05, .05, .14, 12), M.acero(), [Math.cos(a) * .3, .68, Math.sin(a) * .3])); }
    for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; g.add(mesh(new THREE.BoxGeometry(.4, .14, .04), M.naranja(), [Math.cos(a) * .3, -.4, Math.sin(a) * .3], [0, -a, 0])); }
    g.add(mesh(cil(.08, .08, .4, 6), M.acero(), [.6, -.05, .3], [0, 0, Math.PI / 2])); g.rotation.x = .35; return g;
  },
  'Sistema de escape'() { // silenciador + tubos
    const g = new THREE.Group();
    g.add(mesh(torno([[0, -.8], [.42, -.8], [.5, -.7], [.5, .7], [.42, .8], [0, .8]]), M.alu(), null, [0, 0, Math.PI / 2]));
    for (const x of [-.4, 0, .4]) g.add(mesh(new THREE.TorusGeometry(.502, .02, 6, 48), M.oscuro(), [x, 0, 0], [0, Math.PI / 2, 0]));
    g.add(mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(-.8, 0, 0), new THREE.Vector3(-1.1, 0, 0), new THREE.Vector3(-1.3, .3, 0), new THREE.Vector3(-1.3, .9, 0)]), 40, .1, 16), M.acero()));
    g.add(mesh(cil(.1, .1, .5, 24), M.acero(), [1.05, 0, 0], [0, 0, Math.PI / 2])); g.add(mesh(cil(.17, .17, .08, 24), M.naranja(), [-1.3, .92, 0]));
    g.scale.setScalar(.85); return g;
  },
  'Sistema eléctrico'() { // batería
    const g = new THREE.Group();
    g.add(mesh(new THREE.BoxGeometry(1.5, .9, .8), M.oscuro())); g.add(mesh(new THREE.BoxGeometry(1.52, .12, .82), M.naranja(), [0, .47, 0]));
    for (const [x, c] of [[-.5, 0xd33c3c], [.5, 0x2b2f36]]) { g.add(mesh(cil(.09, .1, .16, 24), M.cobre(), [x, .6, 0])); g.add(mesh(cil(.13, .13, .03, 24), new THREE.MeshStandardMaterial({ color: c }), [x, .55, 0])); }
    for (let i = 0; i < 6; i++) g.add(mesh(cil(.06, .06, .05, 16), M.fundicion(), [-.4 + i * .16, .55, .22]));
    g.add(mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(-.5, .68, 0), new THREE.Vector3(-.5, 1, 0), new THREE.Vector3(-1.1, 1.05, .2), new THREE.Vector3(-1.3, .6, .3)]), 40, .045, 10), new THREE.MeshStandardMaterial({ color: 0xd33c3c, roughness: .5 })));
    return g;
  },
  'Ejes'() { // diferencial con semiejes
    const g = new THREE.Group();
    g.add(mesh(new THREE.SphereGeometry(.55, 40, 30), M.fundicion())); g.add(mesh(cil(.42, .42, .3, 40), M.fundicion(), [0, 0, .45], [Math.PI / 2, 0, 0]));
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; g.add(mesh(cil(.03, .03, .1, 8), M.alu(), [Math.cos(a) * .36, Math.sin(a) * .36, .62], [Math.PI / 2, 0, 0])); }
    for (const s of [-1, 1]) { g.add(mesh(cil(.17, .12, 1.2, 32), M.oscuro(), [s * .95, 0, 0], [0, 0, Math.PI / 2])); g.add(mesh(cil(.36, .36, .1, 40), M.naranja(), [s * 1.58, 0, 0], [0, 0, Math.PI / 2])); }
    g.add(mesh(cil(.13, .13, .5, 24), M.acero(), [0, 0, -.6], [Math.PI / 2, 0, 0])); g.scale.setScalar(.82); return g;
  },
  'Árbol de transmisión'() { // cardán con crucetas
    const g = new THREE.Group(); g.add(mesh(cil(.13, .13, 2.2, 32), M.oscuro(), null, [0, 0, Math.PI / 2]));
    for (const s of [-1, 1]) { g.add(mesh(cil(.2, .2, .2, 32), M.acero(), [s * 1.15, 0, 0], [0, 0, Math.PI / 2]));
      const y = new THREE.Group(); y.position.x = s * 1.32; y.add(mesh(new THREE.BoxGeometry(.06, .5, .06), M.naranja())); y.add(mesh(new THREE.BoxGeometry(.06, .06, .5), M.naranja())); y.add(mesh(new THREE.TorusGeometry(.24, .05, 12, 32, Math.PI), M.acero(), [s * .1, 0, 0], [0, s > 0 ? -Math.PI / 2 : Math.PI / 2, 0])); g.add(y);
      g.add(mesh(cil(.26, .26, .08, 32), M.alu(), [s * 1.55, 0, 0], [0, 0, Math.PI / 2])); }
    g.scale.setScalar(.8); return g;
  },
  'Dirección'() { // volante
    const g = new THREE.Group(); g.add(mesh(new THREE.TorusGeometry(.85, .08, 20, 80), M.goma()));
    g.add(mesh(cil(.2, .24, .22, 32), M.oscuro(), null, [Math.PI / 2, 0, 0])); g.add(mesh(cil(.12, .12, .05, 24), M.naranja(), [0, 0, .12], [Math.PI / 2, 0, 0]));
    for (const a of [Math.PI / 2, Math.PI * 7 / 6, -Math.PI / 6]) g.add(mesh(new THREE.BoxGeometry(.66, .1, .05), M.fundicion(), [Math.cos(a) * .5, Math.sin(a) * .5, 0], [0, 0, a]));
    g.add(mesh(cil(.07, .07, .8, 16), M.acero(), [0, 0, -.45], [Math.PI / 2, 0, 0])); return g;
  },
  'Cabina'() { // espejo retrovisor
    const g = new THREE.Group(); const s = new THREE.Shape(); s.moveTo(-.4, -.75); s.lineTo(.4, -.75); s.quadraticCurveTo(.48, 0, .4, .75); s.lineTo(-.4, .75); s.quadraticCurveTo(-.48, 0, -.4, -.75);
    const gs = new THREE.ExtrudeGeometry(s, { depth: .22, bevelEnabled: true, bevelThickness: .06, bevelSize: .06, bevelSegments: 5 }); g.add(mesh(gs, M.oscuro()));
    g.add(mesh(new THREE.PlaneGeometry(.74, 1.42), new THREE.MeshStandardMaterial({ color: 0xbfd2e6, metalness: 1, roughness: .02 }), [0, 0, -.07], [0, Math.PI, 0]));
    g.add(mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(0, .6, .2), new THREE.Vector3(.5, .7, .3), new THREE.Vector3(1.0, .5, .3)]), 30, .045, 10), M.acero()));
    g.add(mesh(new THREE.BoxGeometry(.1, .08, .26), M.naranja(), [.36, -.45, .12])); g.rotation.y = .5; return g;
  },
  'Carrocería'() { // faro delantero
    const g = new THREE.Group(); g.add(mesh(new THREE.BoxGeometry(1.6, .7, .45), M.oscuro()));
    g.add(mesh(new THREE.BoxGeometry(1.5, .6, .05), new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: .6, roughness: .05, transparent: true, opacity: .5 }), [0, 0, .25]));
    for (const x of [-.42, .3]) { g.add(mesh(torno([[0, 0], [.22, 0], [.25, .12], [.25, .14]], 40), M.alu(), [x, 0, .1], [-Math.PI / 2, 0, 0])); g.add(mesh(new THREE.SphereGeometry(.06, 16, 12), new THREE.MeshStandardMaterial({ color: 0xfff6e8, emissive: 0xfff2d6, emissiveIntensity: 2 }), [x, 0, .14])); }
    g.add(mesh(new THREE.BoxGeometry(1.4, .06, .02), new THREE.MeshStandardMaterial({ color: 0xffa040, emissive: 0xff8a20, emissiveIntensity: 1.6 }), [0, -.24, .26])); return g;
  },
  'Partes universales / Accesorios'() { // tornillo y tuerca
    const g = new THREE.Group(); g.add(mesh(cil(.32, .32, .22, 6), M.acero(), [0, .7, 0])); g.add(mesh(cil(.15, .15, 1.2, 24), M.acero(), [0, 0, 0]));
    for (let i = 0; i < 14; i++) g.add(mesh(new THREE.TorusGeometry(.15, .022, 6, 24), M.fundicion(), [0, -.55 + i * .06, 0], [Math.PI / 2, 0, 0]));
    g.add(mesh(cil(.36, .36, .2, 6), M.naranja(), [0, -.2, 0])); return g;
  }
};
export const SISTEMAS_3D = Object.keys(MODELOS);
const HERO = ['Sistema de freno', 'Caja de cambios', 'Motor', 'Bujes y ruedas', 'Embrague y pedal', 'Suspensión', 'Sistema de combustible', 'Sistema de refrigeración'];
const POS_HERO = [[0, .2, 0, 2.15], [2.45, 1.55, -1.2, 1.0], [-2.3, 1.45, -.8, .95], [2.6, -1.45, .2, .8], [-2.55, -1.4, .3, .82], [.15, 2.25, -2.2, .78], [-.6, -2.3, -1.4, .7], [3.9, .1, -2.4, .75]];

export function montarCamion(contenedor, opciones = {}) {
  const o = { alSeleccionar: null, alPasar: null, modo: opciones.rayosX ? 'epc' : 'hero', ...opciones };
  const W = () => contenedor.clientWidth || 600, H = () => contenedor.clientHeight || 400;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.setSize(W(), H());
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.1; renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  contenedor.appendChild(renderer.domElement);
  const scene = new THREE.Scene(); const pm = new THREE.PMREMGenerator(renderer); scene.environment = pm.fromScene(new RoomEnvironment(), .03).texture;
  const cam = new THREE.PerspectiveCamera(30, W() / H(), .1, 100); cam.position.set(0, .4, o.modo === 'hero' ? 13 : 11);
  const key = new THREE.DirectionalLight(0xffffff, 2.4); key.position.set(4, 6, 6); key.castShadow = true; key.shadow.mapSize.set(1024, 1024); scene.add(key);
  const rim = new THREE.DirectionalLight(0xff7a1a, 2.2); rim.position.set(-6, 2, -4); scene.add(rim);
  const rim2 = new THREE.DirectionalLight(0x4f8cff, 1.1); rim2.position.set(6, -3, -5); scene.add(rim2);
  const raiz = new THREE.Group(); scene.add(raiz);
  const items = [];
  const lista = o.modo === 'hero' ? HERO : SISTEMAS_3D;
  lista.forEach((sis, i) => {
    const g = MODELOS[sis](); const piv = new THREE.Group(); piv.add(g); piv.userData = { sis, nombre: sis, base: new THREE.Vector3(), escala: 1, fase: i * 1.7 };
    g.traverse(m => { if (m.isMesh) { m.userData.sis = sis; m.userData.nombre = sis; } });
    if (o.modo === 'hero') { const [x, y, z, s] = POS_HERO[i]; piv.userData.base.set(x, y, z); piv.userData.escala = s; }
    piv.rotation.set(.4 + i * .3, i * .8, .2);
    raiz.add(piv); items.push(piv);
  });
  // EPC: carrusel en anillo
  let angulo = 0, anguloObj = 0, foco = null;
  const R = 3.6;
  function colocarAnillo() { const n = items.length; items.forEach((p, i) => { const a = i / n * Math.PI * 2 + angulo; p.userData.base.set(Math.sin(a) * R * 1.25, -.15 + (1 - Math.cos(a)) * .35, Math.cos(a) * R - R); p.userData.escala = foco === p.userData.sis ? 1.25 : (Math.cos(a) > .93 ? .85 : .55); }); }
  // materiales para resaltar
  const orig = new Map(); raiz.traverse(m => { if (m.isMesh) orig.set(m, m.material); });
  const hl = new Map(); const mh = b => { if (!hl.has(b)) { const m = b.clone(); m.emissive = new THREE.Color(0xff7a1a); m.emissiveIntensity = .45; hl.set(b, m); } return hl.get(b); };
  let marcado = null;
  function marcar(sis) { if (sis === marcado) return; marcado = sis; raiz.traverse(m => { if (m.isMesh) m.material = (sis && m.userData.sis === sis) ? mh(orig.get(m)) : orig.get(m); }); }
  // interacción
  const ray = new THREE.Raycaster(), ptr = new THREE.Vector2(); let abajo = null, arrastre = 0, rotY = 0, rotX = 0, rotYObj = 0, rotXObj = 0, mx = 0, my = 0;
  const mallas = []; raiz.traverse(m => { if (m.isMesh) mallas.push(m); });
  const pick = e => { const r = renderer.domElement.getBoundingClientRect(); ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); ray.setFromCamera(ptr, cam); const h = ray.intersectObjects(mallas, false)[0]; return h ? h.object : null; };
  const el = renderer.domElement; el.style.touchAction = o.modo === 'hero' ? 'pan-y' : 'none';
  el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(); mx = (e.clientX - r.left) / r.width - .5; my = (e.clientY - r.top) / r.height - .5;
    if (abajo) { const dx = e.clientX - abajo.x; arrastre = Math.max(arrastre, Math.abs(dx)); if (o.modo === 'epc') { anguloObj = abajo.a + dx * .006; foco = null; } else rotYObj = abajo.r + dx * .005; return; }
    const h = pick(e); const s = h ? h.userData.sis : null; marcar(foco && !s ? foco : s); el.style.cursor = s ? 'pointer' : 'grab'; if (o.alPasar) o.alPasar(h ? { sis: s, nombre: s, x: e.clientX, y: e.clientY } : null); });
  el.addEventListener('pointerleave', () => { marcar(foco); if (o.alPasar) o.alPasar(null); });
  el.addEventListener('pointerdown', e => { abajo = { x: e.clientX, a: anguloObj, r: rotYObj }; arrastre = 0; });
  addEventListener('pointerup', e => { if (!abajo) return; const was = abajo; abajo = null; if (arrastre < 6 && e.target === el) { const h = pick(e); if (h && o.alSeleccionar) o.alSeleccionar(h.userData.sis, h.userData.nombre); } });
  function enfocar(sis) { const i = items.findIndex(p => p.userData.sis === sis); foco = sis; marcar(sis); if (i < 0 || o.modo !== 'epc') return; const n = items.length; let t = -i / n * Math.PI * 2; while (t - anguloObj > Math.PI) t -= Math.PI * 2; while (anguloObj - t > Math.PI) t += Math.PI * 2; anguloObj = t; }
  function vistaGeneral() { foco = null; marcar(null); }
  let vivo = true, visible = true; const t0 = performance.now();
  const io = new IntersectionObserver(es => { visible = es[0].isIntersecting; }); io.observe(contenedor);
  const ro = new ResizeObserver(() => { renderer.setSize(W(), H()); cam.aspect = W() / H(); cam.updateProjectionMatrix(); ajustar(); }); ro.observe(contenedor);
  function ajustar() { const asp = W() / H(); if (o.modo === 'hero') { raiz.scale.setScalar(Math.min(1, asp / 1.25)); } else { cam.position.z = asp < .9 ? 17 : 13.5; } }
  ajustar();
  (function loop() {
    if (!vivo) return; requestAnimationFrame(loop); if (!visible || document.hidden) return;
    const t = (performance.now() - t0) / 1000;
    if (o.modo === 'epc') { angulo += (anguloObj - angulo) * .08; if (!foco && !abajo) anguloObj += .0012; colocarAnillo(); }
    rotY += (rotYObj - rotY) * .06; rotX += (my * .25 - rotX) * .05;
    raiz.rotation.y = rotY + mx * .35; raiz.rotation.x = rotX;
    items.forEach(p => { const u = p.userData; const s = u.escala * (marcado === u.sis ? 1.08 : 1);
      p.position.lerp(new THREE.Vector3(u.base.x, u.base.y + Math.sin(t * .9 + u.fase) * .12, u.base.z), .1);
      p.scale.lerp(new THREE.Vector3(s, s, s), .12);
      p.rotation.y += .004 + (u.sis === foco ? .006 : 0); p.rotation.x = .35 + Math.sin(t * .4 + u.fase) * .25; });
    renderer.render(scene, cam);
  })();
  return { marcar, enfocar, vistaGeneral, rayosX() {}, destruir() { vivo = false; io.disconnect(); ro.disconnect(); renderer.dispose(); el.remove(); } };
}
