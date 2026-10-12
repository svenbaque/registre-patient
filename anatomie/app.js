// Voies d'abord en 3D — moteur commun à toutes les régions.
// Chaque région (regions/<nom>.js) fournit ses pièces, ses tracés schématiques, ses écarteurs et les étapes de ses voies.
// Repère du modèle BodyParts3D, en millimètres : z vers le haut ; pour un membre droit, x négatif = latéral, y négatif = avant.
import * as THREE from 'three';
import { OrbitControls } from './lib/OrbitControls.js';
import { RoomEnvironment } from './lib/RoomEnvironment.js';

const $ = (sel, root = document) => root.querySelector(sel);

/* ---------- Région affichée ---------- */

const params = new URLSearchParams(location.search);
const REGIONS = ['hanche', 'poignet', 'genou', 'cheville', 'epaule'];
const regionName = REGIONS.includes(params.get('region')) ? params.get('region') : 'hanche';
const R = (await import(`./regions/${regionName}.js`)).default;
const STEPS = Object.fromEntries(Object.entries(R.voies).map(([id, voie]) => [id, voie.steps]));

/* ---------- Scène et rendu ---------- */

const canvas = $('#scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;
const scene = new THREE.Scene();
scene.background = new THREE.Color('#0e1622');
// Éclairage d'ambiance : donne les reflets des tissus humides et du métal des écarteurs.
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
const camera = new THREE.PerspectiveCamera(38, 1, 10, 5000);
camera.up.set(0, 0, 1);
scene.add(new THREE.HemisphereLight('#ffffff', '#33404f', 0.55));
const headlight = new THREE.DirectionalLight('#fff4e6', 1.6); // scialytique : suit le regard
camera.add(headlight);
headlight.position.set(-0.35, 0.55, 1);
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.target.set(...R.centre);
controls.minDistance = 40;
controls.maxDistance = 1400;
controls.addEventListener('change', render);

function render() { renderer.render(scene, camera); }
function resize() {
  renderer.setSize(innerWidth, innerHeight, false);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  render();
}
addEventListener('resize', resize);

/* ---------- Matières ---------- */

function canvasTexture(size, draw) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  draw(c.getContext('2d'), size);
  const texture = new THREE.CanvasTexture(c);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

// Générateur pseudo-aléatoire reproductible (mêmes stries à chaque ouverture).
function rng(seed) { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; }

// Stries longitudinales des fibres musculaires : claires et sombres, légèrement ondulées, le long de l'axe v.
const fiberMap = canvasTexture(256, (g, n) => {
  const rand = rng(7);
  g.fillStyle = '#ffffff';
  g.fillRect(0, 0, n, n);
  for (let i = 0; i < 230; i++) {
    const x = rand() * n;
    const w = 0.6 + rand() * 2.4;
    g.strokeStyle = rand() < 0.6 ? `rgba(60,10,10,${0.05 + rand() * 0.16})` : `rgba(255,235,225,${0.06 + rand() * 0.14})`;
    g.lineWidth = w;
    g.beginPath();
    const sway = (rand() - 0.5) * 7;
    g.moveTo(x, 0);
    g.bezierCurveTo(x + sway, n / 3, x - sway, (2 * n) / 3, x, n);
    g.stroke();
  }
});
// Fascicules d'un nerf : fines lignes le long du tube (axe u).
const nerveMap = canvasTexture(128, (g, n) => {
  const rand = rng(11);
  g.fillStyle = '#ffffff';
  g.fillRect(0, 0, n, n);
  for (let i = 0; i < 26; i++) {
    g.fillStyle = `rgba(150,110,20,${0.10 + rand() * 0.22})`;
    g.fillRect(0, rand() * n, n, 1 + rand() * 2.5);
  }
});
// Grain de l'os cortical.
const boneMap = canvasTexture(128, (g, n) => {
  const rand = rng(3);
  g.fillStyle = '#ffffff';
  g.fillRect(0, 0, n, n);
  for (let i = 0; i < 900; i++) {
    g.fillStyle = `rgba(120,95,60,${rand() * 0.07})`;
    g.fillRect(rand() * n, rand() * n, 1 + rand() * 3, 1 + rand() * 3);
  }
});

function makeMaterial(groupe, couleur, fascia) {
  const base = { color: couleur, side: THREE.DoubleSide, envMapIntensity: 0.55 };
  if (groupe === 'os') return new THREE.MeshPhysicalMaterial({ ...base, roughness: 0.62, clearcoat: 0.18, clearcoatRoughness: 0.5, map: boneMap });
  if (groupe === 'ecarteurs') return new THREE.MeshPhysicalMaterial({ ...base, color: '#e6e9ed', metalness: 0.82, roughness: 0.3, envMapIntensity: 1.3, emissive: '#3a3f46', emissiveIntensity: 0.55 });
  if (groupe === 'vaisseaux') return new THREE.MeshPhysicalMaterial({ ...base, roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.15, envMapIntensity: 0.9 });
  if (groupe === 'nerfs') return new THREE.MeshPhysicalMaterial({ ...base, roughness: 0.42, clearcoat: 0.55, clearcoatRoughness: 0.3, map: nerveMap });
  if (groupe === 'incisions' || groupe === 'reperes') return new THREE.MeshStandardMaterial({ ...base, roughness: 0.4, emissive: couleur, emissiveIntensity: 0.35 });
  // aponévroses et fascias : nacrés ; muscles : rouges, humides, striés dans le sens des fibres
  if (fascia) return new THREE.MeshPhysicalMaterial({ ...base, roughness: 0.38, clearcoat: 0.7, clearcoatRoughness: 0.25, map: fiberMap, bumpMap: fiberMap, bumpScale: 0.5 });
  return new THREE.MeshPhysicalMaterial({ ...base, roughness: 0.5, clearcoat: 0.4, clearcoatRoughness: 0.35, map: fiberMap, bumpMap: fiberMap, bumpScale: 0.9 });
}

/* ---------- Pièces ---------- */

const parts = new Map(); // id -> { mesh, nom, groupe, couleur, coche, base (positions de repos), … }

function addPart(id, nom, groupe, couleur, geometry, options = {}) {
  const material = makeMaterial(groupe, couleur, options.fascia);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.userData.id = id;
  scene.add(mesh);
  const part = { mesh, nom, groupe, couleur, coche: groupe !== 'ecarteurs', base: Float32Array.from(geometry.getAttribute('position').array), specKey: '', ...options };
  parts.set(id, part);
  return part;
}

// Axe principal d'un nuage de points (grand axe d'un muscle) : plus grande direction de dispersion, par itérations.
function principalAxis(position) {
  const n = position.count;
  const c = new THREE.Vector3();
  for (let i = 0; i < n; i++) c.add(new THREE.Vector3().fromBufferAttribute(position, i));
  c.divideScalar(n);
  const m = [0, 0, 0, 0, 0, 0]; // xx xy xz yy yz zz
  const p = new THREE.Vector3();
  for (let i = 0; i < n; i += 3) {
    p.fromBufferAttribute(position, i).sub(c);
    m[0] += p.x * p.x; m[1] += p.x * p.y; m[2] += p.x * p.z; m[3] += p.y * p.y; m[4] += p.y * p.z; m[5] += p.z * p.z;
  }
  const v = new THREE.Vector3(0.3, 0.2, 1).normalize();
  for (let k = 0; k < 24; k++) {
    v.set(m[0] * v.x + m[1] * v.y + m[2] * v.z, m[1] * v.x + m[3] * v.y + m[4] * v.z, m[2] * v.x + m[4] * v.y + m[5] * v.z).normalize();
  }
  return v;
}

// Coordonnées de texture d'un muscle : v le long de son grand axe (sens des fibres), u en travers.
function fiberUVs(geometry) {
  const position = geometry.getAttribute('position');
  const axis = principalAxis(position);
  const side = new THREE.Vector3(1, 0, 0).cross(axis).lengthSq() > 0.05 ? new THREE.Vector3(1, 0, 0).cross(axis).normalize() : new THREE.Vector3(0, 1, 0).cross(axis).normalize();
  const other = axis.clone().cross(side);
  const normal = geometry.getAttribute('normal');
  const uv = new Float32Array(position.count * 2);
  const p = new THREE.Vector3();
  const n = new THREE.Vector3();
  for (let i = 0; i < position.count; i++) {
    p.fromBufferAttribute(position, i);
    n.fromBufferAttribute(normal, i);
    // on mesure « en travers » dans la direction la plus couchée sur la surface : les stries suivent alors le grand axe,
    // au lieu de dessiner des courbes de niveau sur les faces bombées
    uv[2 * i] = (Math.abs(n.dot(side)) < Math.abs(n.dot(other)) ? p.dot(side) : p.dot(other) + 500) / 24;
    uv[2 * i + 1] = p.dot(axis) / 70;
  }
  geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
}

async function loadMesh([file, nom, groupe, couleur]) {
  const buffer = await (await fetch(`${R.dossier || 'models'}/${file}.bin`)).arrayBuffer();
  const [nVerts, nTris] = new Uint32Array(buffer, 0, 2);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(buffer.slice(8, 8 + nVerts * 12)), 3));
  geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(buffer, 8 + nVerts * 12, nTris * 3), 1));
  geometry.computeVertexNormals();
  if (groupe === 'os') {
    const position = geometry.getAttribute('position');
    const uv = new Float32Array(position.count * 2);
    for (let i = 0; i < position.count; i++) { uv[2 * i] = (position.getX(i) + position.getY(i)) / 30; uv[2 * i + 1] = position.getZ(i) / 30; }
    geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  } else fiberUVs(geometry);
  addPart(file, nom, groupe, couleur, geometry, { fascia: (R.fascias || []).includes(file) });
}

// Tracé schématique (nerf, vaisseau, incision, repère) : tube lisse, effilé et arrondi aux extrémités.
// [id, nom, groupe, couleur, rayon, points, { fin: rapport du rayon à l'extrémité }]
function addTube([id, nom, groupe, couleur, rayon, points, options = {}]) {
  const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)), false, 'centripetal');
  const segments = Math.max(48, Math.round(curve.getLength() / 3));
  const radial = 16;
  const geometry = new THREE.TubeGeometry(curve, segments, rayon, radial, false);
  const position = geometry.getAttribute('position');
  const fin = options.fin ?? 1;
  const centre = new THREE.Vector3();
  const p = new THREE.Vector3();
  const round = e => Math.sqrt(Math.max(0, 1 - ((e - 0.965) / 0.035) ** 2)); // arrondi des bouts
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    let k = 1 + (fin - 1) * t ** 1.4;
    if (t > 0.965) k *= round(t);
    if (t < 0.035) k *= round(1 - t);
    curve.getPointAt(t, centre);
    for (let j = 0; j <= radial; j++) {
      const index = i * (radial + 1) + j;
      p.fromBufferAttribute(position, index).sub(centre).multiplyScalar(Math.max(k, 0.02)).add(centre);
      position.setXYZ(index, p.x, p.y, p.z);
    }
  }
  const uv = geometry.getAttribute('uv');
  for (let i = 0; i < uv.count; i++) uv.setX(i, uv.getX(i) * curve.getLength() / 26); // fascicules à l'échelle
  geometry.computeVertexNormals();
  addPart(id, nom, groupe, couleur, geometry);
}

// Manchon schématique entre deux points (capsule articulaire).
function addManchon([id, nom, de, a, rayonA, rayonDe]) {
  const from = new THREE.Vector3(...de);
  const to = new THREE.Vector3(...a);
  const geometry = new THREE.CylinderGeometry(rayonA, rayonDe, from.distanceTo(to), 40, 6, true);
  geometry.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), to.clone().sub(from).normalize()));
  geometry.translate(...from.clone().add(to).multiplyScalar(0.5).toArray());
  addPart(id, nom, 'divers', '#f1ece0', geometry, { fascia: true, voile: true });
}

// Écarteur : lame d'acier coudée. La pointe plonge dans la plaie (« fond »), le manche part vers l'extérieur (« vers »).
// [id, nom, { en: point d'appui au bord de la plaie, fond: direction vers la profondeur, vers: direction de traction, profondeur, manche, largeur }]
function addEcarteur([id, nom, spec]) {
  const en = new THREE.Vector3(...spec.en);
  const fond = new THREE.Vector3(...spec.fond).normalize();
  const vers = new THREE.Vector3(...spec.vers).normalize();
  const depth = spec.profondeur ?? 38;
  const handle = spec.manche ?? 95;
  const at = (alongVers, alongFond) => en.clone().addScaledVector(vers, alongVers).addScaledVector(fond, alongFond);
  // profil : bec recourbé sous le bord, lame verticale, coude, manche qui remonte légèrement
  const curve = new THREE.CatmullRomCurve3([
    at(7, depth + 5), at(1, depth + 1), at(-1.5, depth * 0.55), at(0, 6), at(5, -3), at(22, -9), at(handle * 0.6, -15), at(handle, -19),
  ], false, 'catmullrom', 0.35);
  // Ruban d'acier construit à la main le long du profil : largeur perpendiculaire au plan du profil, épaisseur dans ce plan.
  const w = (spec.largeur ?? 17) / 2;
  const t = 1.1;
  const across = fond.clone().cross(vers).normalize();
  const samples = 64;
  const positions = [];
  const indices = [];
  const point = new THREE.Vector3();
  const tangent = new THREE.Vector3();
  for (let i = 0; i <= samples; i++) {
    const u = i / samples;
    curve.getPointAt(u, point);
    curve.getTangentAt(u, tangent);
    const thick = tangent.clone().cross(across).normalize();
    // la lame s'effile vers le bec, le manche s'élargit à peine
    const k = u < 0.12 ? 0.55 + (u / 0.12) * 0.45 : 1;
    [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([sw, st]) => {
      const v = point.clone().addScaledVector(across, sw * w * k).addScaledVector(thick, st * t);
      positions.push(v.x, v.y, v.z);
    });
    if (i < samples) {
      const o = i * 4;
      for (let f = 0; f < 4; f++) {
        const a0 = o + f, a1 = o + ((f + 1) % 4), b0 = a0 + 4, b1 = a1 + 4;
        indices.push(a0, a1, b0, a1, b1, b0);
      }
    }
  }
  const last = samples * 4;
  indices.push(0, 2, 1, 0, 3, 2, last, last + 1, last + 2, last, last + 2, last + 3); // bouts fermés
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
  geometry.setIndex(indices);
  // arêtes vives : chaque face a ses propres sommets pour que le métal garde des reflets nets
  const sharp = geometry.toNonIndexed();
  sharp.computeVertexNormals();
  const geometryFinal = sharp;
  addPart(id, nom, 'ecarteurs', '#dfe3e8', geometryFinal);
}

// Fend une pièce en deux le long d'un plan (incision d'un fascia, dissociation de fibres) : « id/A » du côté de la normale, « id/B » de l'autre.
function splitPart([id, point, normal, nomA, nomB]) {
  const part = parts.get(id);
  if (!part) return;
  const geometry = part.mesh.geometry;
  const position = geometry.getAttribute('position');
  const index = geometry.getIndex().array;
  const n = new THREE.Vector3(...normal).normalize();
  const d = n.dot(new THREE.Vector3(...point));
  const sides = [[], []];
  for (let i = 0; i < index.length; i += 3) {
    const [a, b, c] = [index[i], index[i + 1], index[i + 2]];
    const cx = (position.getX(a) + position.getX(b) + position.getX(c)) / 3;
    const cy = (position.getY(a) + position.getY(b) + position.getY(c)) / 3;
    const cz = (position.getZ(a) + position.getZ(b) + position.getZ(c)) / 3;
    sides[n.x * cx + n.y * cy + n.z * cz - d >= 0 ? 0 : 1].push(a, b, c);
  }
  scene.remove(part.mesh);
  parts.delete(id);
  [[`${id}/A`, nomA, sides[0]], [`${id}/B`, nomB, sides[1]]].forEach(([halfId, nom, tris]) => {
    // chaque berge a ses propres sommets : elles se déforment indépendamment
    const half = new THREE.BufferGeometry();
    half.setAttribute('position', position.clone());
    half.setAttribute('uv', geometry.getAttribute('uv').clone());
    half.setIndex(new THREE.BufferAttribute(new Uint32Array(tris), 1));
    half.computeVertexNormals();
    addPart(halfId, nom, part.groupe, part.couleur, half, { fascia: part.fascia });
  });
}

/* ---------- Écartement : déformation des tissus ---------- */

// Position écartée d'une pièce. Deux formes de consigne :
//   [dx, dy, dz]                               — déplacement en bloc ;
//   { dep, autour, rayon, socle }              — traction locale : les sommets proches du point (ou du segment) « autour » suivent
//                                                l'écarteur, l'effet s'éteint avec la distance (rayon), le reste du muscle garde son attache.
function deformed(part, spec) {
  const base = part.base;
  const out = new Float32Array(base.length);
  if (!spec) { out.set(base); return out; }
  if (Array.isArray(spec)) {
    for (let i = 0; i < base.length; i += 3) { out[i] = base[i] + spec[0]; out[i + 1] = base[i + 1] + spec[1]; out[i + 2] = base[i + 2] + spec[2]; }
    return out;
  }
  // « autour » : un point, ou une ligne brisée (la ligne d'incision). « dep » : un déplacement, ou un par tronçon de la ligne —
  // la berge s'écarte alors perpendiculairement à l'incision tout du long, même si celle-ci change de direction.
  const line = Array.isArray(spec.autour[0]) ? spec.autour : [spec.autour, spec.autour];
  const deps = Array.isArray(spec.dep[0]) ? spec.dep : line.slice(1).map(() => spec.dep);
  const socle = spec.socle ?? 0;
  const r2 = spec.rayon * spec.rayon;
  const segments = line.slice(1).map((b, i) => {
    const a = line[i];
    const ab = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
    return { a, ab, len2: ab[0] * ab[0] + ab[1] * ab[1] + ab[2] * ab[2], dep: deps[Math.min(i, deps.length - 1)] };
  });
  for (let i = 0; i < base.length; i += 3) {
    let sum = 0, best = 0, dx = 0, dy = 0, dz = 0;
    for (const { a, ab, len2, dep } of segments) {
      let px = base[i] - a[0], py = base[i + 1] - a[1], pz = base[i + 2] - a[2];
      if (len2 > 0) {
        const t = Math.max(0, Math.min(1, (px * ab[0] + py * ab[1] + pz * ab[2]) / len2));
        px -= ab[0] * t; py -= ab[1] * t; pz -= ab[2] * t;
      }
      const w = Math.exp(-(px * px + py * py + pz * pz) / r2);
      sum += w; dx += dep[0] * w; dy += dep[1] * w; dz += dep[2] * w;
      if (w > best) best = w;
    }
    // direction : moyenne des tronçons proches ; ampleur : celle du tronçon le plus proche
    const k = sum > 0 ? (socle + (1 - socle) * best) / sum : 0;
    out[i] = base[i] + dx * k; out[i + 1] = base[i + 1] + dy * k; out[i + 2] = base[i + 2] + dz * k;
  }
  return out;
}

// Section d'un muscle : on retire de l'affichage la portion située à moins de « rayon » d'un point ou d'une ligne ;
// les moignons restent attachés à leur origine et à leur insertion. Sans consigne, le muscle redevient entier.
function applyCut(part, cut) {
  const geometry = part.mesh.geometry;
  part.fullIndex ||= Uint32Array.from(geometry.getIndex().array);
  if (!cut) { geometry.setIndex(new THREE.BufferAttribute(part.fullIndex, 1)); return; }
  const base = part.base;
  const line = Array.isArray(cut.autour[0]) ? cut.autour : [cut.autour, cut.autour];
  const r2 = cut.rayon * cut.rayon;
  const near = (x, y, z) => {
    for (let s = 0; s < line.length - 1; s++) {
      const a = line[s], b = line[s + 1];
      const ab = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
      const len2 = ab[0] * ab[0] + ab[1] * ab[1] + ab[2] * ab[2];
      let px = x - a[0], py = y - a[1], pz = z - a[2];
      if (len2 > 0) {
        const t = Math.max(0, Math.min(1, (px * ab[0] + py * ab[1] + pz * ab[2]) / len2));
        px -= ab[0] * t; py -= ab[1] * t; pz -= ab[2] * t;
      }
      if (px * px + py * py + pz * pz < r2) return true;
    }
    return false;
  };
  const full = part.fullIndex;
  const kept = [];
  for (let i = 0; i < full.length; i += 3) {
    const a = full[i] * 3, b = full[i + 1] * 3, c = full[i + 2] * 3;
    if (!near((base[a] + base[b] + base[c]) / 3, (base[a + 1] + base[b + 1] + base[c + 1]) / 3, (base[a + 2] + base[b + 2] + base[c + 2]) / 3)) kept.push(full[i], full[i + 1], full[i + 2]);
  }
  geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(kept), 1));
}

let glideFrame = null;
const moving = new Set();

// Amène en douceur les pièces vers leur forme écartée (ou de repos).
function glide() {
  cancelAnimationFrame(glideFrame);
  const finish = part => {
    const geometry = part.mesh.geometry;
    geometry.computeVertexNormals();
    geometry.computeBoundingSphere();
    geometry.computeBoundingBox();
  };
  // page masquée : pas d'animation (les images ne sont pas dessinées en arrière-plan)
  if (!moving.size || document.hidden) {
    moving.forEach(part => { part.mesh.geometry.getAttribute('position').array.set(part.to); part.mesh.geometry.getAttribute('position').needsUpdate = true; finish(part); });
    moving.clear();
    render();
    return;
  }
  const start = performance.now();
  let frame = 0;
  const tick = now => {
    const t = Math.min(1, (now - start) / 700);
    const k = t < 0.5 ? 4 * t * t * t : 1 - ((-2 * t + 2) ** 3) / 2; // départ et arrivée en douceur
    frame++;
    moving.forEach(part => {
      const attribute = part.mesh.geometry.getAttribute('position');
      const array = attribute.array;
      const { from, to } = part;
      for (let i = 0; i < array.length; i++) array[i] = from[i] + (to[i] - from[i]) * k;
      attribute.needsUpdate = true;
      if (frame % 2 === 0 || t === 1) part.mesh.geometry.computeVertexNormals();
    });
    render();
    if (t < 1) glideFrame = requestAnimationFrame(tick);
    else { moving.forEach(finish); moving.clear(); render(); }
  };
  glideFrame = requestAnimationFrame(tick);
}

/* ---------- État d'affichage ---------- */

let mode = 'libre';
let stepIndex = 0;
const DIM = new THREE.Color('#5a6470');

function applyState() {
  const step = mode === 'libre' ? null : STEPS[mode][stepIndex];
  // une étape peut désigner une pièce fendue par son nom d'origine : les deux berges sont alors concernées
  // (« FMA1/A/B » hérite des consignes données à « FMA1/A » puis à « FMA1 »)
  const lineage = id => id.split('/').map((_, i, all) => all.slice(0, all.length - i).join('/'));
  const has = (list, id) => !!step && lineage(id).some(key => (step[list] || []).includes(key));
  const offsets = (step && step.ecarter) || {};
  const cuts = (step && step.sectionner) || {};
  for (const [id, part] of parts) {
    const { mesh, groupe, couleur } = part;
    const material = mesh.material;
    // incisions et écarteurs ne s'affichent qu'aux étapes qui les demandent ; en mode libre tout suit les cases cochées
    const onDemand = groupe === 'incisions' || groupe === 'ecarteurs';
    const hidden = step ? (has('masquer', id) || (onDemand ? !has('montrer', id) : !part.coche)) : !part.coche;
    const faded = has('estomper', id);
    const veiled = has('voiler', id); // os translucide pour laisser voir un clou ou une vis
    const strong = has('accent', id) || has('danger', id) || (has('montrer', id) && groupe !== 'ecarteurs');
    mesh.visible = !hidden;
    material.transparent = faded || veiled || !!part.voile;
    material.opacity = faded ? 0.06 : (veiled ? (groupe === 'os' ? 0.38 : 0.26) : (part.voile ? 0.8 : 1));
    material.depthWrite = !faded && !veiled;
    mesh.renderOrder = faded ? 2 : (veiled ? 1 : 0);
    material.color.set(couleur);
    // sur une étape, ce qui n'est pas mis en avant est légèrement éteint pour faire ressortir le reste
    if (step && !strong && !faded && groupe !== 'os' && groupe !== 'ecarteurs') material.color.lerp(DIM, 0.4);
    if (groupe !== 'incisions' && groupe !== 'reperes' && groupe !== 'ecarteurs') {
      material.emissive.set(strong ? couleur : '#000000');
      material.emissiveIntensity = has('danger', id) ? 0.5 : (strong ? 0.18 : 0);
    }
    mesh.userData.pickable = !hidden && !faded;

    // section demandée par l'étape
    const cut = lineage(id).map(key => cuts[key]).find(Boolean) || null;
    const cutKey = cut ? JSON.stringify(cut) : '';
    if (cutKey !== (part.cutKey || '')) { part.cutKey = cutKey; applyCut(part, cut); }

    // écartement demandé par l'étape
    const spec = lineage(id).map(key => offsets[key]).find(Boolean) || null;
    const specKey = spec ? JSON.stringify(spec) : '';
    if (specKey !== part.specKey) {
      part.specKey = specKey;
      part.from = Float32Array.from(mesh.geometry.getAttribute('position').array);
      part.to = deformed(part, spec);
      moving.add(part);
    }
  }
  renderCard(step);
  glide();
}

function flyTo(name) {
  const vue = R.vues[name];
  const cible = vue.cible || R.centre;
  camera.position.set(cible[0] + vue.de[0], cible[1] + vue.de[1], cible[2] + vue.de[2]);
  controls.target.set(...cible);
  controls.update();
}

function renderCard(step) {
  document.querySelectorAll('#modes button').forEach(b => b.classList.toggle('on', b.dataset.mode === mode));
  const nav = $('.nav');
  if (!step) {
    $('#step-count').textContent = 'Exploration libre';
    $('#step-title').textContent = R.nom;
    $('#step-text').textContent = 'Tournez avec un doigt, zoomez avec deux, touchez une structure pour afficher son nom. Le bouton ☰ permet d’afficher ou de masquer chaque structure.';
    $('#chips').innerHTML = '';
    nav.hidden = true;
    return;
  }
  nav.hidden = false;
  const steps = STEPS[mode];
  $('#step-count').textContent = `${R.voies[mode].titre} · étape ${stepIndex + 1} / ${steps.length}`;
  $('#step-title').textContent = step.titre;
  $('#step-text').textContent = step.texte;
  // une pièce fendue est citée par son nom d'origine : on prend une berge et on retire la précision
  const chip = (id, danger) => {
    const part = parts.get(id) || [...parts].find(([key]) => key.startsWith(`${id}/`))?.[1];
    if (!part) return '';
    const nom = (parts.has(id) ? part.nom : part.nom.split(' — ')[0]).replace(' (schématique)', '');
    return `<span class="chip${danger ? ' danger' : ''}" style="--c:${part.couleur}"><i></i>${danger ? '⚠ ' : ''}${nom}</span>`;
  };
  $('#chips').innerHTML = [...(step.danger || []).map(id => chip(id, true)), ...(step.accent || []).map(id => chip(id, false))].join('');
  $('#prev').disabled = stepIndex === 0;
  $('#next').disabled = stepIndex === steps.length - 1;
}

function setMode(next) {
  mode = next;
  stepIndex = 0;
  flyTo(mode === 'libre' ? 'libre' : STEPS[mode][0].vue);
  applyState();
}

function setStep(index) {
  if (mode === 'libre') return; // pas d'étapes en exploration libre
  const steps = STEPS[mode];
  const previous = steps[stepIndex].vue;
  stepIndex = Math.max(0, Math.min(steps.length - 1, index));
  if (steps[stepIndex].vue !== previous) flyTo(steps[stepIndex].vue); // on ne recadre que si l'étape change de point de vue
  applyState();
}

/* ---------- Interface ---------- */

function buildToggles() {
  $('#toggles').innerHTML = R.groupes.map(([groupe, titre]) => {
    const items = [...parts].filter(([, part]) => part.groupe === groupe);
    return items.length ? `<h4>${titre}</h4>${items.map(([id, part]) => `<label style="--c:${part.couleur}"><i></i>${part.nom}<input type="checkbox" data-id="${id}"${part.coche ? ' checked' : ''}></label>`).join('')}` : '';
  }).join('');
  $('#toggles').addEventListener('change', e => {
    parts.get(e.target.dataset.id).coche = e.target.checked;
    applyState();
  });
}

$('#modes').addEventListener('click', e => { if (e.target.dataset.mode) setMode(e.target.dataset.mode); });
$('#prev').addEventListener('click', () => setStep(stepIndex - 1));
$('#next').addEventListener('click', () => setStep(stepIndex + 1));
$('#open-drawer').addEventListener('click', () => $('#drawer').classList.add('open'));
$('#close-drawer').addEventListener('click', () => $('#drawer').classList.remove('open'));
// Affiché dans l'appli Registre (cadre intégré) : un bouton retour demande à l'appli de refermer le visualiseur.
if (window.parent !== window) {
  $('#back').hidden = false;
  $('#back').addEventListener('click', () => window.parent.postMessage('fermer-3d', location.origin));
}

// Toucher une structure (sans faire glisser) affiche son nom.
const raycaster = new THREE.Raycaster();
let down = null;
let labelTimer = null;
canvas.addEventListener('pointerdown', e => { down = { x: e.clientX, y: e.clientY }; });
canvas.addEventListener('pointerup', e => {
  if (!down || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6) return;
  raycaster.setFromCamera(new THREE.Vector2((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1), camera);
  const hit = raycaster.intersectObjects([...parts.values()].map(p => p.mesh).filter(m => m.userData.pickable))[0];
  if (!hit) return;
  const label = $('#label');
  label.textContent = parts.get(hit.object.userData.id).nom;
  label.classList.add('show');
  clearTimeout(labelTimer);
  labelTimer = setTimeout(() => label.classList.remove('show'), 2500);
});

/* ---------- Démarrage ---------- */

async function start() {
  let done = 0;
  await Promise.all(R.meshes.map(async entry => {
    await loadMesh(entry);
    $('#loading-bar').style.width = `${(++done / R.meshes.length) * 100}%`;
  }));
  (R.fendre || []).forEach(splitPart);
  R.tubes.forEach(addTube);
  (R.manchons || []).forEach(addManchon);
  (R.ecarteurs || []).forEach(addEcarteur);
  buildToggles();
  // une voie par bouton, puis l'exploration libre
  $('#modes').innerHTML = [...Object.entries(R.voies).map(([id, voie]) => [id, voie.court]), ['libre', 'Libre']]
    .map(([id, label]) => `<button data-mode="${id}">${label}</button>`).join('');
  resize();
  const asked = params.get('voie'); // ?voie=<identifiant de la voie> ou libre
  setMode(asked === 'libre' || R.voies[asked] ? asked : Object.keys(R.voies)[0]);
  $('#loading').remove();
}

start().catch(error => {
  $('#loading-text').textContent = 'Le modèle n’a pas pu être chargé. Le premier affichage a besoin du réseau : vérifiez la connexion puis réessayez.';
  console.error(error);
});

// Accès depuis la console pour la mise au point.
window.hanche3d = { parts, scene, camera, controls, render, setMode, setStep, flyTo, applyState, R };
