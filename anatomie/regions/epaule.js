// Épaule droite — voie delto-pectorale.
// Repère BodyParts3D, en millimètres : x = latéral (-) / médial (+), y = avant (-) / arrière (+), z = vers le haut.
import pieces from './epaule.pieces.js';
import { peauFendue, charge, lame } from './outils.js';

const meshes = [
  ['peau-epaule', 'Peau', 'peau', '#e2b596', { id: 'peau', dossier: 'models-z' }],
  ...pieces,
];

// Incision : une seule ligne, de la coracoïde vers l'insertion du deltoïde, sur le sillon delto-pectoral (trajet de la veine céphalique).
const PEAU_DP = [[-135, -110, 1335], [-150, -123, 1315], [-165, -124, 1295], [-178, -122, 1275], [-188, -115, 1255], [-196, -112, 1235]];
const SILLON = [[-140, -114, 1322], [-197, -94, 1242]]; // la même ligne, au fond, entre deltoïde et grand pectoral
const FOND = [0.3, 0.95, 0];
const N_MED = [0.76, -0.24, -0.6]; // perpendiculaire au sillon, vers le thorax
const N_LAT = [-0.76, 0.24, 0.6];  // perpendiculaire au sillon, vers le moignon de l'épaule

// Tracés à la main : incision, plaque et vis.
const TETE = [-166, -72, 1322];
const visTete = (n, x, y, z, vers) => [`plaque/vis-t${n}`, 'Vis verrouillée céphalique', 'implants', '#cfd6dd', 1.7, [[x, y, z], [(x + vers[0]) / 2, (y + vers[1]) / 2, (z + vers[2]) / 2], vers]];
const visDiaphyse = (n, x, y, z) => [`plaque/vis-d${n}`, 'Vis corticale diaphysaire', 'implants', '#cfd6dd', 1.7, [[x - 1, y - 1, z], [x + 9, y + 7, z], [x + 18, y + 14, z]]];
const tubes = [
  ['incision-dp', 'Incision — voie delto-pectorale', 'incisions', '#35e0c8', 1.4, PEAU_DP.map(([x, y, z]) => [x - 1, y - 3.5, z])],
  visTete(1, -189, -85, 1330, [-160, -66, 1334]), visTete(2, -190, -85, 1320, [-152, -70, 1326]), visTete(3, -191, -84, 1310, [-158, -62, 1318]),
  visTete(4, -192, -84, 1298, [-152, -72, 1312]), visTete(5, -193, -83, 1288, [-150, -68, 1306]),
  visDiaphyse(1, -197, -81, 1262), visDiaphyse(2, -200, -80, 1244), visDiaphyse(3, -203, -79, 1226),
];
const rubans = [
  ['plaque', 'Plaque verrouillée d’humérus proximal', 'implants', '#b9c2cc', [[-188.5, -86, 1336], [-190.5, -86, 1312], [-193.5, -84, 1284], [-198, -82, 1254], [-203.5, -80, 1218]], 13, 2.6, [0.6, -0.8, 0]],
];

const groupes = [
  ['peau', 'Peau'], ['graisse', 'Tissu sous-cutané'], ['os', 'Os'], ['deltoide', 'Deltoïde'], ['pectoraux', 'Pectoraux'], ['conjoint', 'Tendon conjoint et biceps'],
  ['coiffe', 'Coiffe, ronds et grand dorsal'], ['bras', 'Bras'], ['ligaments', 'Capsule et ligaments'], ['vaisseaux', 'Artères et veines'], ['nerfs', 'Nerfs'],
  ['incisions', 'Incisions'], ['implants', 'Plaque et vis'],
];

const centre = [-165, -88, 1295];
const SITE = [-172, -100, 1285];
const vues = {
  // position demi-assise : l'opérateur est en avant et en dehors de l'épaule, tête du patient en haut
  op: { de: [-70, -400, 50], cible: SITE }, opProche: { de: [-70, -245, 25], cible: SITE },
  opLateral: { de: [-185, -200, 25], cible: [-180, -90, 1285] },
  libre: { de: [-330, -330, 120] },
};
const IMPLANTS = ['plaque'];

// Écarteurs : deux lames parallèles au sillon. Aucun muscle n'est incisé ; chacun reste attaché à ses insertions.
const opts = { rayon: 28, profondeur: 46 };
const DELTOIDE = ['deltoide-ant', 'deltoide-moy', 'cephalique']; // la veine céphalique part en dehors avec le deltoïde
const PECTORAL = ['pectoral-clav', 'pectoral-sterno', 'pectoral-abdo'];
const CONJOINT = ['coracobrachial', 'biceps-court', 'musculocutane']; // le nerf musculo-cutané part avec le tendon conjoint
// Peau : berge /A médiale, /B latérale. L'humérus est sous le deltoïde, en dehors du sillon : l'exposition se gagne surtout en dehors.
const PEAU_DROITE = [[-140, -119, 1326], [-196, -112, 1238]];
const optsPeau = { rayon: 22, profondeur: 30 };
const peauOuverte = (dehors, dedans) => ({
  ...charge(['peau/B', 'graisse/B'], lame(PEAU_DROITE, N_LAT, FOND, dehors, dehors * 2.4 + 10, optsPeau)),
  ...charge(['peau/A', 'graisse/A'], lame(PEAU_DROITE, N_MED, FOND, dedans, dedans * 2.4 + 10, optsPeau)),
});
const sillon = (dehors, dedans) => ({
  ...charge(DELTOIDE, lame(SILLON, N_LAT, FOND, dehors, dehors * 2.4 + 12, opts)),
  ...charge(PECTORAL, lame(SILLON, N_MED, FOND, dedans, dedans * 2.4 + 12, opts)),
});
const CONJOINT_EN_DEDANS = charge(CONJOINT, lame(SILLON, N_MED, FOND, 9, 50, { rayon: 26, profondeur: 62 }));

const voies = {
  dp: { court: 'Delto-pectorale', titre: 'Voie delto-pectorale', fendre: peauFendue(PEAU_DP, FOND, 'médiale', 'latérale'), steps: [
    { titre: 'Installation et incision', vue: 'op',
      texte: 'Vue de l’opérateur : position demi-assise, épaule dégagée du bord de la table, bras libre sur un appui, amplificateur de brillance du côté de la tête. Repère : le processus coracoïde. L’incision, de 10 à 12 cm, part de la coracoïde et descend obliquement en bas et en dehors, le long du sillon delto-pectoral, vers l’insertion humérale du deltoïde.',
      montrer: ['incision-dp'], danger: ['cephalique'], masquer: IMPLANTS },
    { titre: 'Peau et veine céphalique', vue: 'opProche',
      texte: 'Peau et tissu sous-cutané sont incisés. Le sillon delto-pectoral se reconnaît à son liseré graisseux, où chemine la veine céphalique. Elle est libérée et, le plus souvent, laissée en dehors avec le deltoïde (ses afférences sont surtout deltoïdiennes) ; ses branches médiales sont coagulées.',
      accent: ['deltoide-ant', 'pectoral-clav'], danger: ['cephalique'], masquer: IMPLANTS, ecarter: peauOuverte(12, 10) },
    { titre: 'Sillon delto-pectoral', vue: 'opProche',
      texte: 'Le sillon est ouvert au doigt sur toute sa longueur, de la clavicule à l’insertion du deltoïde : deltoïde et veine céphalique en dehors, grand pectoral en dedans. Aucun muscle n’est sectionné. L’espace sous-deltoïdien est libéré au doigt ; le bras en abduction détend le deltoïde.',
      accent: ['deltoide-ant', 'pectoral-clav', 'coracobrachial', 'biceps-court'], danger: ['cephalique'], masquer: IMPLANTS, ecarter: { ...peauOuverte(20, 12), ...sillon(18, 8) } },
    { titre: 'Fascia clavi-pectoral et tendon conjoint', vue: 'opProche',
      texte: 'Au fond, le fascia clavi-pectoral est incisé au bord latéral du tendon conjoint (coraco-brachial et chef court du biceps), jusqu’au ligament coraco-acromial. Le tendon conjoint est récliné en dedans, avec douceur : le nerf musculo-cutané le pénètre 5 à 8 cm sous la coracoïde et part avec lui. Pas d’écarteur appuyé sous la coracoïde.',
      accent: ['coracobrachial', 'biceps-court', 'subscapulaire'], danger: ['musculocutane', 'cephalique'], masquer: IMPLANTS,
      ecarter: { ...peauOuverte(27, 13), ...sillon(27, 9), ...CONJOINT_EN_DEDANS } },
    { titre: 'Humérus proximal', vue: 'opProche',
      texte: 'La tête humérale, les deux tubercules et le tendon du long biceps dans sa gouttière sont exposés : le long biceps est le repère pour replacer les tubercules. Le sous-scapulaire est en avant ; à son bord inférieur courent les vaisseaux circonflexes antérieurs. Le nerf axillaire passe sous le sous-scapulaire puis contourne le col chirurgical : il se palpe au doigt (« tug test »), et aucun écarteur n’est placé à l’aveugle sous le deltoïde ou sous le col.',
      accent: ['humerus', 'biceps-long', 'subscapulaire'], danger: ['axillaire', 'axillaire-rameaux', 'acirc-ant', 'musculocutane'], masquer: [...IMPLANTS, 'gaine-biceps'],
      ecarter: { ...peauOuverte(38, 13), ...sillon(40, 9), ...CONJOINT_EN_DEDANS } },
    { titre: 'Réduction et plaque', vue: 'opLateral',
      texte: 'Les tendons de la coiffe sont chargés sur fils pour manœuvrer les tubercules. Réduction de la tête (relèvement du valgus ou correction du varus, appui médial restauré), broches temporaires, contrôle scopique. La plaque se pose en dehors de la gouttière bicipitale, 5 à 8 mm sous le sommet du tubercule majeur ; vis céphaliques sous-chondrales sans effraction articulaire, vis de calcar si le varus menace. Les fils de la coiffe sont noués dans la plaque. Peau retirée, deltoïde estompé.',
      accent: ['humerus'], danger: ['axillaire', 'axillaire-rameaux'], voiler: ['humerus'], montrer: IMPLANTS, masquer: ['peau', 'graisse', 'gaine-biceps'], estomper: ['deltoide-ant', 'deltoide-moy'],
      ecarter: { ...sillon(40, 9), ...CONJOINT_EN_DEDANS } },
  ] },
};

export default { nom: 'Épaule droite', graisse: 5, centre, vues, meshes, tubes, rubans, groupes, voies };
