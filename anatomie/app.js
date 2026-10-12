// Hanche 3D — voies d'abord postérieure (Moore) et antérieure (Hueter) pour la prothèse de hanche.
// Repère du modèle BodyParts3D, en millimètres : x = droite (-) / gauche (+), y = avant (-) / arrière (+), z = vers le haut.
import * as THREE from 'three';
import { OrbitControls } from './lib/OrbitControls.js';

const $ = sel => document.querySelector(sel);

/* ---------- Structures ---------- */

// Pièces du modèle libre : [fichier, nom, groupe, couleur]
const MESHES = [
  ['FMA16586', 'Os coxal', 'os', '#e9e2cf'],
  ['FMA24474', 'Fémur', 'os', '#e9e2cf'],
  ['FMA16202', 'Sacrum', 'os', '#ded6c0'],
  ['FMA22328', 'Grand fessier', 'fessiers', '#b5483f'],
  ['FMA22330', 'Moyen fessier', 'fessiers', '#c25a4c'],
  ['FMA22332', 'Petit fessier', 'fessiers', '#cf6f5d'],
  ['FMA22425', 'Tenseur du fascia lata', 'fessiers', '#d9773f'],
  ['FMA58776', 'Tractus ilio-tibial (fascia lata)', 'fessiers', '#cfd6dd'],
  ['FMA22340', 'Piriforme', 'rotateurs', '#e08a3c'],
  ['FMA22334', 'Jumeau supérieur', 'rotateurs', '#d7a13a'],
  ['FMA22324', 'Obturateur interne', 'rotateurs', '#c9b23c'],
  ['FMA22336', 'Jumeau inférieur', 'rotateurs', '#d7a13a'],
  ['FMA22338', 'Carré fémoral', 'rotateurs', '#b98a3e'],
  ['FMA22326', 'Obturateur externe', 'rotateurs', '#a87946'],
  ['FMA22354', 'Sartorius', 'anterieurs', '#c4527a'],
  ['FMA38928', 'Droit fémoral', 'anterieurs', '#b84a5e'],
  ['FMA38930', 'Vaste latéral', 'anterieurs', '#a8444f'],
  ['FMA38934', 'Vaste intermédiaire', 'anterieurs', '#9c4048'],
  ['FMA38932', 'Vaste médial', 'anterieurs', '#a8444f'],
  ['FMA22322', 'Iliaque', 'anterieurs', '#9a5aa8'],
  ['FMA22342', 'Grand psoas', 'anterieurs', '#8a4f9c'],
  ['FMA22450', 'Pectiné', 'mediaux', '#7d6bb5'],
  ['FMA22456', 'Long adducteur', 'mediaux', '#6f73b8'],
  ['FMA22452', 'Court adducteur', 'mediaux', '#6a7fb8'],
  ['FMA22459', 'Grand adducteur', 'mediaux', '#6388b5'],
  ['FMA43883', 'Gracile', 'mediaux', '#5f93b0'],
  ['FMA45888', 'Biceps fémoral (chef long)', 'posterieurs', '#8f5b4a'],
  ['FMA22358', 'Semi-tendineux', 'posterieurs', '#9a6652'],
  ['FMA22448', 'Semi-membraneux', 'posterieurs', '#a5705a'],
  ['FMA21964', 'Ligament inguinal', 'divers', '#dfe6ec'],
  ['FMA18806', 'Artère iliaque externe', 'vaisseaux', '#e0392b'],
  ['FMA18885', 'Veine iliaque externe', 'vaisseaux', '#3b6fd1'],
];

// Structures absentes du modèle libre, tracées à la main à partir des repères osseux : [id, nom, groupe, couleur, rayon, points]
const TUBES = [
  ['sciatique', 'Nerf sciatique (schématique)', 'nerfs', '#ffd23f', 5,
    [[-44, -36, 866], [-56, -36, 836], [-70, -37, 810], [-77, -46, 780], [-82, -54, 730], [-86, -60, 640], [-84, -62, 500]]],
  ['nclc', 'Nerf cutané latéral de la cuisse (schématique)', 'nerfs', '#ffd23f', 1.8,
    [[-98, -118, 930], [-106, -148, 899], [-108, -156, 872], [-116, -156, 835], [-127, -152, 790], [-134, -148, 700]]],
  ['nfemoral', 'Nerf fémoral (schématique)', 'nerfs', '#ffd23f', 3.2,
    [[-62, -128, 905], [-63, -152, 850], [-65, -158, 822], [-67, -154, 790], [-70, -148, 765]]],
  ['afemorale', 'Artère fémorale (schématique)', 'vaisseaux', '#e0392b', 4,
    [[-49, -158, 830], [-52, -159, 805], [-56, -152, 765], [-58, -141, 700], [-55, -126, 620]]],
  ['vfemorale', 'Veine fémorale (schématique)', 'vaisseaux', '#3b6fd1', 4.5,
    [[-42, -149, 830], [-43, -151, 805], [-47, -146, 765], [-50, -136, 700], [-48, -122, 620]]],
  ['circonflexe', 'Branche ascendante de la circonflexe latérale (schématique)', 'vaisseaux', '#ff5a4d', 1.8,
    [[-57, -150, 772], [-68, -128, 782], [-86, -108, 792], [-108, -104, 806], [-124, -108, 826]]],
  ['incision-post', 'Incision — voie postérieure', 'incisions', '#35e0c8', 1.6,
    [[-151, -74, 712], [-153, -76, 760], [-152, -74, 800], [-143, -52, 838], [-125, -24, 872], [-104, -4, 898]]],
  ['incision-ant', 'Incision — voie antérieure', 'incisions', '#35e0c8', 1.6,
    [[-127, -152, 882], [-132, -151, 850], [-137, -148, 815], [-141, -143, 782]]],
];

const GROUPS = [
  ['os', 'Os'], ['fessiers', 'Fessiers et fascia lata'], ['rotateurs', 'Pelvi-trochantériens'], ['anterieurs', 'Loge antérieure et ilio-psoas'],
  ['mediaux', 'Adducteurs'], ['posterieurs', 'Ischio-jambiers'], ['divers', 'Ligament et capsule'], ['vaisseaux', 'Vaisseaux'], ['nerfs', 'Nerfs'], ['incisions', 'Incisions'],
];

/* ---------- Étapes des deux voies ---------- */

const ROTATEURS = ['FMA22340', 'FMA22334', 'FMA22324', 'FMA22336'];
const HANCHE = [-92, -85, 825]; // centre de la scène : articulation de la hanche droite
const VUES = {
  post: [-230, 400, 110], postProche: [-95, 370, -75], ant: [-150, -430, 70], antProche: [-120, -330, 10], libre: [-380, -260, 120],
};

const STEPS = {
  post: [
    { titre: 'Repères et incision', vue: 'post',
      texte: 'Patient en décubitus latéral strict. L’incision est centrée sur le bord postérieur du grand trochanter : elle descend dans l’axe du fémur et s’incurve en haut et en arrière, en direction de l’épine iliaque postéro-supérieure.',
      montrer: ['incision-post'], accent: ['FMA22328', 'FMA58776'], masquer: ['incision-ant'] },
    { titre: 'Fascia lata et grand fessier', vue: 'post',
      texte: 'Incision du fascia lata dans l’axe de l’incision cutanée, puis dissociation des fibres du grand fessier dans leur sens. On découvre le plan profond, recouvert de graisse.',
      accent: ['FMA22328', 'FMA58776'], masquer: ['incision-ant', 'incision-post'] },
    { titre: 'Pelvi-trochantériens et nerf sciatique', vue: 'postProche',
      texte: 'Le grand fessier est récliné. Membre en rotation interne pour tendre les rotateurs. De haut en bas : piriforme, jumeau supérieur, obturateur interne, jumeau inférieur, carré fémoral. Le nerf sciatique sort sous le piriforme et descend en arrière d’eux : le repérer et le protéger.',
      accent: [...ROTATEURS, 'FMA22338'], danger: ['sciatique'], estomper: ['FMA22328', 'FMA58776'], masquer: ['incision-ant', 'incision-post'] },
    { titre: 'Section des pelvi-trochantériens', vue: 'postProche',
      texte: 'Piriforme, jumeaux et obturateur interne sont sectionnés au ras de leur insertion trochantérienne, mis sur fils et rabattus en arrière : ils protègent alors le nerf sciatique. Le carré fémoral est respecté ou partiellement désinséré. La capsule postérieure apparaît.',
      accent: ['capsule'], danger: ['sciatique'], estomper: ['FMA22328', 'FMA58776', ...ROTATEURS], masquer: ['incision-ant', 'incision-post'] },
    { titre: 'Capsulotomie et luxation', vue: 'postProche',
      texte: 'Capsulotomie postérieure, puis luxation de la tête par flexion, adduction et rotation interne. Le col est exposé pour la coupe ; le cotyle sera abordé après l’exérèse de la tête.',
      accent: ['FMA24474'], danger: ['sciatique'], estomper: ['FMA22328', 'FMA58776', ...ROTATEURS, 'capsule', 'FMA22330', 'FMA22332'], masquer: ['incision-ant', 'incision-post'] },
  ],
  ant: [
    { titre: 'Repères et incision', vue: 'ant',
      texte: 'Patient en décubitus dorsal. Repère : l’épine iliaque antéro-supérieure. L’incision débute environ 2 cm en dehors et en dessous d’elle et descend obliquement en bas et en dehors sur le corps du tenseur du fascia lata, sur 8 à 10 cm.',
      montrer: ['incision-ant'], accent: ['FMA22425'], danger: ['nclc'], masquer: ['incision-post'] },
    { titre: 'Intervalle superficiel : tenseur du fascia lata / sartorius', vue: 'antProche',
      texte: 'On ouvre la gaine du tenseur du fascia lata et on reste à l’intérieur, en réclinant le muscle en dehors. Le nerf cutané latéral de la cuisse chemine en dedans, sur le sartorius : rester dans la gaine le protège.',
      accent: ['FMA22425', 'FMA22354'], danger: ['nclc'], masquer: ['incision-post', 'incision-ant'] },
    { titre: 'Plan profond : droit fémoral / moyen fessier', vue: 'antProche',
      texte: 'Tenseur du fascia lata en dehors, sartorius en dedans. Au fond : le droit fémoral en dedans, les moyen et petit fessiers en dehors. La branche ascendante de l’artère circonflexe latérale croise le champ : elle est repérée puis liée ou coagulée.',
      accent: ['FMA38928', 'FMA22330', 'FMA22332'], danger: ['circonflexe'], estomper: ['FMA22425', 'FMA22354', 'FMA58776'], masquer: ['incision-post', 'incision-ant'] },
    { titre: 'Capsule antérieure', vue: 'antProche',
      texte: 'Le droit fémoral et l’ilio-psoas sont réclinés en dedans, les fessiers en dehors : la capsule antérieure est exposée. Le paquet fémoral (nerf, artère, veine, de dehors en dedans) est juste en dedans : les écarteurs restent au contact de l’os.',
      accent: ['capsule'], danger: ['nfemoral', 'afemorale', 'vfemorale'], estomper: ['FMA22425', 'FMA22354', 'FMA58776', 'FMA38928', 'FMA22322', 'FMA22342'], masquer: ['incision-post', 'incision-ant', 'circonflexe'] },
    { titre: 'Capsulotomie et exposition du col', vue: 'antProche',
      texte: 'Capsulotomie antérieure : le col et la tête sont exposés. La coupe du col se fait en place, puis la tête est extraite avant la préparation du cotyle.',
      accent: ['FMA24474'], danger: ['nfemoral', 'afemorale', 'vfemorale'], estomper: ['FMA22425', 'FMA22354', 'FMA58776', 'FMA38928', 'FMA22322', 'FMA22342', 'capsule', 'FMA22450'], masquer: ['incision-post', 'incision-ant', 'circonflexe'] },
  ],
};

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

// Capsule articulaire schématique : manchon entre le pourtour du cotyle et la base du col.
function addCapsule() {
  const from = new THREE.Vector3(-62, -93, 823);
  const to = new THREE.Vector3(-106, -86, 806);
  const geometry = new THREE.CylinderGeometry(25, 31, from.distanceTo(to), 28, 1, true);
  geometry.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), to.clone().sub(from).normalize()));
  geometry.translate(...from.clone().add(to).multiplyScalar(0.5).toArray());
  addPart('capsule', 'Capsule articulaire (schématique)', 'divers', '#f4f1e6', geometry);
}

/* ---------- État d'affichage ---------- */

let mode = 'post';
let stepIndex = 0;

function applyState() {
  const step = mode === 'libre' ? null : STEPS[mode][stepIndex];
  const has = (list, id) => !!step && (step[list] || []).includes(id);
  for (const [id, part] of parts) {
    const { mesh, groupe, couleur } = part;
    const material = mesh.material;
    // les incisions ne s'affichent qu'à l'étape qui les demande ; en mode libre tout suit les cases cochées
    const hidden = !part.coche || has('masquer', id) || (step && groupe === 'incisions' && !has('montrer', id));
    const faded = has('estomper', id);
    const strong = has('accent', id) || has('danger', id) || has('montrer', id);
    mesh.visible = !hidden;
    material.transparent = faded || id === 'capsule';
    material.opacity = faded ? 0.06 : (id === 'capsule' ? 0.78 : 1);
    material.depthWrite = !faded;
    mesh.renderOrder = faded ? 2 : 0;
    material.color.set(couleur);
    // sur une étape, ce qui n'est pas mis en avant est légèrement éteint pour faire ressortir le reste
    if (step && !strong && !faded && groupe !== 'os') material.color.lerp(new THREE.Color('#5a6470'), 0.45);
    material.emissive.set(strong ? couleur : '#000000');
    material.emissiveIntensity = has('danger', id) ? 0.55 : (strong ? 0.22 : 0);
    mesh.userData.pickable = !hidden && !faded;
  }
  renderCard(step);
  render();
}

function flyTo(name) {
  const [x, y, z] = VUES[name];
  camera.position.set(HANCHE[0] + x, HANCHE[1] + y, HANCHE[2] + z);
  controls.target.set(...HANCHE);
  controls.update();
}

function renderCard(step) {
  document.querySelectorAll('#modes button').forEach(b => b.classList.toggle('on', b.dataset.mode === mode));
  const nav = $('.nav');
  if (!step) {
    $('#step-count').textContent = 'Exploration libre';
    $('#step-title').textContent = 'Hanche droite';
    $('#step-text').textContent = 'Tournez avec un doigt, zoomez avec deux, touchez une structure pour afficher son nom. Le bouton ☰ permet d’afficher ou de masquer chaque structure.';
    $('#chips').innerHTML = '';
    nav.hidden = true;
    return;
  }
  nav.hidden = false;
  const steps = STEPS[mode];
  $('#step-count').textContent = `${mode === 'post' ? 'Voie postérieure (Moore)' : 'Voie antérieure (Hueter)'} · étape ${stepIndex + 1} / ${steps.length}`;
  $('#step-title').textContent = step.titre;
  $('#step-text').textContent = step.texte;
  const chip = (id, danger) => `<span class="chip${danger ? ' danger' : ''}" style="--c:${parts.get(id).couleur}"><i></i>${danger ? '⚠ ' : ''}${parts.get(id).nom.replace(' (schématique)', '')}</span>`;
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
  $('#toggles').innerHTML = GROUPS.map(([groupe, titre]) => {
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
  await Promise.all(MESHES.map(async entry => {
    await loadMesh(entry);
    $('#loading-bar').style.width = `${(++done / MESHES.length) * 100}%`;
  }));
  TUBES.forEach(addTube);
  addCapsule();
  buildToggles();
  resize();
  const asked = new URLSearchParams(location.search).get('voie'); // ?voie=post | ant | libre
  setMode(['post', 'ant', 'libre'].includes(asked) ? asked : 'post');
  $('#loading').remove();
}

start().catch(error => {
  $('#loading-text').textContent = 'Le modèle n’a pas pu être chargé. Le premier affichage a besoin du réseau : vérifiez la connexion puis réessayez.';
  console.error(error);
});

// Accès depuis la console pour la mise au point.
window.hanche3d = { parts, scene, camera, controls, render, setMode, setStep, flyTo, applyState };
