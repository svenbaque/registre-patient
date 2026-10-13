// Genou et jambe droits — abord pour enclouage du tibia.
// Repère BodyParts3D, en millimètres : x = latéral (-) / médial (+), y = avant (-) / arrière (+), z = vers le haut.
// Le modèle est genou en extension ; au bloc le genou est fléchi à 90° ou plus.
import pieces from './genou.pieces.js';
import { peauFendue, berges } from './outils.js';

const meshes = [
  ['peau-jambe', 'Peau', 'peau', '#e2b596', { id: 'peau', dossier: 'models-z' }],
  ...pieces,
];

// Dans ce modèle, le tendon quadricipital et le ligament patellaire prolongent les quatre chefs du quadriceps jusqu'à la tubérosité tibiale.
// Chaque chef est coupé au-dessus de la patella : la moitié basse (« /B ») est l'appareil extenseur tendineux, de teinte nacrée.
const QUADRICEPS = ['droit-femoral', 'vaste-int', 'vaste-med', 'vaste-lat'];
const NOMS = { 'droit-femoral': 'Droit fémoral', 'vaste-int': 'Vaste intermédiaire', 'vaste-med': 'Vaste médial', 'vaste-lat': 'Vaste latéral' };
const fendre = QUADRICEPS.map(id => [id, [0, 0, 440], [0, 0, 1], NOMS[id], 'Tendon quadricipital et ligament patellaire', { couleurs: [null, '#e6e1d2'] }]);

// Tracés à la main : incision, axe du clou, clou et vis.
const tubes = [
  ['incision-clou', 'Incision — abord trans-tendineux', 'incisions', '#35e0c8', 1.2, [[-85, -138.5, 406], [-84.5, -130, 395], [-84, -126, 384], [-83, -119, 371], [-82, -115, 358]]],
  ['axe-clou', 'Broche-guide dans l’axe du canal (tracé)', 'reperes', '#7df9ff', 1.3,
    [[-81, -112, 440], [-80.5, -100, 420], [-80, -91, 404], [-79.5, -84, 372], [-79, -80, 330]]],
  ['clou', 'Clou centromédullaire du tibia', 'implants', '#b9c2cc', 5,
    [[-80, -91, 403], [-79.5, -84, 372], [-79, -80, 330], [-79, -77, 250], [-78, -67, 130], [-76, -61, 84]]],
  ['clou/vis-prox1', 'Vis de verrouillage proximal', 'implants', '#cfd6dd', 2.2, [[-52, -78, 380], [-80, -85, 381], [-108, -80, 382]]],
  ['clou/vis-prox2', 'Vis de verrouillage proximal', 'implants', '#cfd6dd', 2.2, [[-56, -90, 362], [-80, -82, 362], [-104, -72, 362]]],
  ['clou/vis-dist1', 'Vis de verrouillage distal', 'implants', '#cfd6dd', 2.2, [[-56, -63, 104], [-77, -64, 104], [-97, -62, 104]]],
  ['clou/vis-dist2', 'Vis de verrouillage distal', 'implants', '#cfd6dd', 2.2, [[-76, -80, 92], [-76.5, -62, 92], [-77, -46, 92]]],
];

const groupes = [
  ['peau', 'Peau'], ['graisse', 'Tissu sous-cutané'], ['os', 'Os'], ['quadriceps', 'Quadriceps'], ['cuisse', 'Muscles de la cuisse'],
  ['jambe', 'Loges antérieure et latérale'], ['mollet', 'Loge postérieure'], ['ligaments', 'Capsule, ménisques et ligaments'], ['vaisseaux', 'Artères et veines'], ['nerfs', 'Nerfs'],
  ['incisions', 'Incisions'], ['reperes', 'Repères d’ostéosynthèse'], ['implants', 'Clou et vis'],
];

const centre = [-84, -92, 388]; // ligament patellaire
const SITE = [-83, -104, 384];
const vues = {
  // vue de l'opérateur : genou fléchi face à lui, patella en haut de l'image, tubérosité tibiale en bas
  op: { de: [0, -330, 45], cible: SITE }, opProche: { de: [0, -175, 30], cible: SITE },
  entree: { de: [-8, -120, 105], cible: [-80, -94, 400] },
  jambe: { de: [330, -560, 20], cible: [-78, -72, 235] }, libre: { de: [-260, -330, 90] },
};
const REPERES = ['axe-clou'];
const IMPLANTS = ['clou'];
const PEAU = ['peau', 'graisse'];

// Incision : une seule ligne médiane, de la pointe de la patella à la tubérosité tibiale. Peau, puis ligament patellaire, s'ouvrent sur elle.
const PEAU_INCISION = [[-85, -137, 406], [-84.5, -128, 395], [-84, -124, 384], [-83, -117, 371], [-82, -113, 358]];
const FOND = [0, 1, 0];
const MILIEU_TENDON = [[-84.5, -107, 398], [-82, -105, 370]];
const peauOuverte = k => berges(PEAU_INCISION, FOND, [-15, 0, 0], k, 24);
// Ligament fendu dans ses fibres : les deux moitiés s'écartent en leur milieu, leurs attaches (patella, tubérosité) ne bougent pas.
const TENDON = QUADRICEPS.map(id => `${id}/B`);
const tendonFendu = k => Object.fromEntries(TENDON.flatMap(id => [
  [`${id}/A`, { dep: [9 * k, 0, 0], autour: MILIEU_TENDON, rayon: 15 }], [`${id}/B`, { dep: [-9 * k, 0, 0], autour: MILIEU_TENDON, rayon: 15 }],
]));
const fendreTendon = TENDON.map(id => [id, { ligne: [[-85, -108, 412], [-84.5, -107, 398], [-82, -105, 370], [-81, -103, 348]], fond: FOND, rayon: 22 },
  'Ligament patellaire — moitié médiale', 'Ligament patellaire — moitié latérale']);
// Le corps adipeux de Hoffa est refoulé en arrière, sans ouvrir l'articulation.
const HOFFA_REFOULE = { hoffa: { dep: [0, 9, 4], autour: [-80, -92, 404], rayon: 22 } };

const voies = {
  clou: { court: 'Clou tibial', titre: 'Abord infra-patellaire trans-tendineux (clou tibial)', fendre: [...peauFendue(PEAU_INCISION, FOND, 'médiale', 'latérale'), ...fendreTendon], steps: [
    { titre: 'Installation et incision', vue: 'op',
      texte: 'Décubitus dorsal, genou fléchi à 90° ou plus (barre à genou, triangle ou jambe pendante) : la flexion dégage le point d’entrée en avant de la patella. Incision longitudinale médiane, dans l’axe du canal médullaire, de la pointe de la patella à la tubérosité tibiale. Le rameau infra-patellaire du nerf saphène croise la partie basse de l’incision, de dedans en dehors. Le modèle est ici genou en extension.',
      montrer: ['incision-clou'], danger: ['infrapatellaire'], masquer: [...REPERES, ...IMPLANTS] },
    { titre: 'Peau et péritendon', vue: 'opProche',
      texte: 'Peau et tissu sous-cutané sont incisés ; les berges sont tenues par un écarteur autostatique. Le péritendon est ouvert et décollé au bistouri sur toute la largeur du ligament patellaire : il sera refermé à part, sur le ligament.',
      accent: TENDON, danger: ['infrapatellaire'], masquer: [...REPERES, ...IMPLANTS], ecarter: peauOuverte(1) },
    { titre: 'Ligament patellaire fendu', vue: 'opProche',
      texte: 'Le ligament patellaire est fendu dans l’axe de ses fibres, en son milieu, de la pointe de la patella à la tubérosité tibiale ; ses deux moitiés sont écartées. Le corps adipeux infra-patellaire (Hoffa) apparaît au fond : il est refoulé en arrière, sans ouvrir l’articulation. Variantes : abord para-patellaire médial (ligament récliné en dehors) ou supra-patellaire.',
      accent: [...TENDON, 'hoffa'], danger: ['infrapatellaire'], masquer: [...REPERES, ...IMPLANTS], ecarter: { ...peauOuverte(1.15), ...tendonFendu(1) } },
    { titre: 'Point d’entrée', vue: 'entree',
      texte: 'De face, le point d’entrée est dans l’axe du canal médullaire, au versant médial de l’épine tibiale latérale (environ 3 mm en dedans de la crête tibiale). De profil, il est au bord antérieur du plateau, juste sous l’angle entre plateau et métaphyse antérieure, en zone extra-articulaire. Trop médial, il entraîne un valgus dans les fractures proximales. La broche-guide est contrôlée de face et de profil. Peau retirée et patella translucide : genou fléchi, elle ne masque pas le point d’entrée.',
      accent: ['axe-clou', 'tibia'], voiler: ['patella'], estomper: ['hoffa'], danger: ['menisque-med', 'menisque-lat', 'lig-transverse'], montrer: ['axe-clou'], masquer: [...IMPLANTS, ...PEAU, 'capsule', 'retinaculum-lat', 'retinaculum-med', 'anastomose-patellaire'],
      ecarter: { ...peauOuverte(1.15), ...tendonFendu(1.2), ...HOFFA_REFOULE } },
    { titre: 'Alésage et clou', vue: 'jambe',
      texte: 'Ouverture de la corticale, guide à olive passé à travers le foyer réduit jusqu’au centre du pilon, alésage progressif en protégeant le ligament patellaire, puis clou monté sur son viseur. La réduction doit être obtenue avant l’alésage et maintenue pendant la descente du clou. La peau est ici retirée et le tibia translucide.',
      voiler: ['tibia'], estomper: ['tibial-ant', 'gastro-med', 'soleaire', 'fdl', 'edl'], montrer: ['clou'], masquer: [...REPERES, ...PEAU, 'clou/vis-prox1', 'clou/vis-prox2', 'clou/vis-dist1', 'clou/vis-dist2'], ecarter: tendonFendu(1.2) },
    { titre: 'Verrouillages', vue: 'jambe',
      texte: 'Verrouillage proximal par le viseur solidaire du clou. Verrouillage distal à main levée sous scopie (« ronds parfaits »), de dedans en dehors : le nerf saphène et la grande veine saphène longent la face médiale du tibia distal — incision courte, dissection à la pince jusqu’à l’os. Pour une vis antéro-postérieure, le paquet tibial antérieur et le nerf fibulaire profond sont en danger. Fermeture : péritendon, puis peau.',
      voiler: ['tibia'], estomper: ['tibial-ant', 'gastro-med', 'soleaire', 'fdl', 'edl'], danger: ['nsaphene', 'vsaphene', 'atibiale-ant', 'nfibprof'], montrer: ['clou'], masquer: [...REPERES, ...PEAU], ecarter: tendonFendu(1.2) },
  ] },
};

export default { nom: 'Genou et jambe droits', graisse: 4, centre, vues, meshes, fendre, tubes, groupes, voies };
