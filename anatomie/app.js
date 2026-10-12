// Hanche 3D — voies d'abord postérieure (Moore) et antérieure (Hueter) pour la prothèse de hanche.
// Repère du modèle BodyParts3D, en millimètres : x = droite (-) / gauche (+), y = avant (-) / arrière (+), z = vers le haut.
import * as THREE from 'three';
import { OrbitControls } from './lib/OrbitControls.js';

const $ = sel => document.querySelector(sel);

/* ---------- Région affichée ---------- */

const params = new URLSearchParams(location.search);
const REGIONS = ['hanche'];
const regionName = REGIONS.includes(params.get('region')) ? params.get('region') : 'hanche';
const R = (await import(`./regions/${regionName}.js`)).default;
const STEPS = Object.fromEntries(Object.entries(R.voies).map(([id, voie]) => [id, voie.steps]));
const HANCHE = R.centre; // centre de la scène (nom historique)

/* ---------- Scène ---------- */

const canvas = $('#scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
const scene = new THREE.Scene();
scene.background = new THREE.Color('#0e1622');
const camera = new THREE.PerspectiveCamera(38, 1, 10, 5000);
camera.up.set(0, 0, 1);
scene.add(new THREE.HemisphereLight('#ffffff', '#3a4656', 1.15));
const headlight = new THREE.DirectionalLight('#ffffff', 1.9);
camera.add(headlight);
headlight.position.set(-0.4, 0.6, 1);
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.target.set(...HANCHE);
controls.minDistance = 90;
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

const parts = new Map(); // id -> { mesh, nom, groupe, couleur, coche }

function addPart(id, nom, groupe, couleur, geometry) {
  const material = new THREE.MeshStandardMaterial({ color: couleur, roughness: groupe === 'os' ? 0.75 : 0.6, metalness: 0, side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.userData.id = id;
  scene.add(mesh);
  parts.set(id, { mesh, nom, groupe, couleur, coche: true });
}

async function loadMesh([file, nom, groupe, couleur]) {
  const buffer = await (await fetch(`models/${file}.bin`)).arrayBuffer();
  const [nVerts, nTris] = new Uint32Array(buffer, 0, 2);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(buffer, 8, nVerts * 3), 3));
  geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(buffer, 8 + nVerts * 12, nTris * 3), 1));
  geometry.computeVertexNormals();
  addPart(file, nom, groupe, couleur, geometry);
}

function addTube([id, nom, groupe, couleur, rayon, points]) {
  const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)));
  addPart(id, nom, groupe, couleur, new THREE.TubeGeometry(curve, 80, rayon, 12, false));
}

// Manchon schématique entre deux points (capsule articulaire, par exemple).
function addManchon([id, nom, de, a, rayonA, rayonDe]) {
  const from = new THREE.Vector3(...de);
  const to = new THREE.Vector3(...a);
  const geometry = new THREE.CylinderGeometry(rayonA, rayonDe, from.distanceTo(to), 28, 1, true);
  geometry.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), to.clone().sub(from).normalize()));
  geometry.translate(...from.clone().add(to).multiplyScalar(0.5).toArray());
  addPart(id, nom, 'divers', '#f4f1e6', geometry);
  parts.get(id).voile = true; // toujours légèrement translucide
}

// Fend une pièce en deux le long d'un plan (incision d'un fascia, dissociation de fibres) : « id/A » du côté de la normale, « id/B » de l'autre.
// Les deux moitiés partagent les mêmes sommets ; chaque triangle va du côté où se trouve son centre.
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
    const half = new THREE.BufferGeometry();
    half.setAttribute('position', position);
    half.setAttribute('normal', geometry.getAttribute('normal'));
    half.setIndex(new THREE.BufferAttribute(new Uint32Array(tris), 1));
    addPart(halfId, nom, part.groupe, part.couleur, half);
  });
}

/* ---------- État d'affichage ---------- */

let mode = 'libre';
let stepIndex = 0;

function applyState() {
  const step = mode === 'libre' ? null : STEPS[mode][stepIndex];
  // une étape peut désigner une pièce fendue par son nom d'origine : les deux moitiés sont alors concernées
  const has = (list, id) => !!step && ((step[list] || []).includes(id) || (step[list] || []).includes(id.split('/')[0]));
  const offsets = (step && step.ecarter) || {};
  for (const [id, part] of parts) {
    const { mesh, groupe, couleur } = part;
    const material = mesh.material;
    // les incisions ne s'affichent qu'à l'étape qui les demande ; en mode libre tout suit les cases cochées
    const hidden = !part.coche || has('masquer', id) || (step && groupe === 'incisions' && !has('montrer', id));
    const faded = has('estomper', id);
    const strong = has('accent', id) || has('danger', id) || has('montrer', id);
    mesh.visible = !hidden;
    material.transparent = faded || !!part.voile;
    material.opacity = faded ? 0.06 : (part.voile ? 0.78 : 1);
    material.depthWrite = !faded;
    mesh.renderOrder = faded ? 2 : 0;
    material.color.set(couleur);
    // sur une étape, ce qui n'est pas mis en avant est légèrement éteint pour faire ressortir le reste
    if (step && !strong && !faded && groupe !== 'os') material.color.lerp(new THREE.Color('#5a6470'), 0.45);
    material.emissive.set(strong ? couleur : '#000000');
    material.emissiveIntensity = has('danger', id) ? 0.55 : (strong ? 0.22 : 0);
    mesh.userData.pickable = !hidden && !faded;
    part.cible = offsets[id] || offsets[id.split('/')[0]] || [0, 0, 0]; // écartement demandé par l'étape
  }
  renderCard(step);
  glide();
}

// Fait glisser les pièces vers leur position écartée (ou de repos), en douceur.
let glideFrame = null;
function glide() {
  cancelAnimationFrame(glideFrame);
  const moves = [...parts.values()].map(part => ({ part, from: part.mesh.position.clone(), to: new THREE.Vector3(...part.cible) }))
    .filter(m => m.from.distanceToSquared(m.to) > 0.01);
  // page masquée ou rien à déplacer : pas d'animation (les images ne sont pas dessinées en arrière-plan)
  if (!moves.length || document.hidden) {
    moves.forEach(m => m.part.mesh.position.copy(m.to));
    render();
    return;
  }
  const start = performance.now();
  const tick = now => {
    const t = Math.min(1, (now - start) / 450);
    const k = t * t * (3 - 2 * t);
    moves.forEach(m => m.part.mesh.position.lerpVectors(m.from, m.to, k));
    render();
    if (t < 1) glideFrame = requestAnimationFrame(tick);
  };
  glideFrame = requestAnimationFrame(tick);
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
  // une pièce fendue est citée par son nom d'origine : on prend une moitié et on retire la précision de berge
  const chip = (id, danger) => {
    const part = parts.get(id) || parts.get(`${id}/A`);
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
    return items.length ? `<h4>${titre}</h4>${items.map(([id, part]) => `<label style="--c:${part.couleur}"><i></i>${part.nom}<input type="checkbox" data-id="${id}" checked></label>`).join('')}` : '';
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
window.hanche3d = { parts, scene, camera, controls, render, setMode, setStep, flyTo, applyState };
