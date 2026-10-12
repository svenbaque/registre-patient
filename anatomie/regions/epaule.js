// Épaule droite — voie delto-pectorale.
// Repère BodyParts3D, en millimètres : x = latéral (-) / médial (+), y = avant (-) / arrière (+), z = vers le haut.

const meshes = [
  ['FMA23130', 'Humérus', 'os', '#e9e2cf'],
  ['FMA13395', 'Scapula', 'os', '#e9e2cf'],
  ['FMA13322', 'Clavicule', 'os', '#ded6c0'],
  ['FMA34680', 'Deltoïde — faisceau claviculaire', 'deltoide', '#c25a4c'],
  ['FMA34682', 'Deltoïde — faisceau acromial', 'deltoide', '#b5483f'],
  ['FMA34684', 'Deltoïde — faisceau spinal', 'deltoide', '#a8444f'],
  ['FMA34690', 'Grand pectoral — chef claviculaire', 'pectoraux', '#c4527a'],
  ['FMA79979', 'Grand pectoral — chef sterno-costal', 'pectoraux', '#b84a5e'],
  ['FMA45874', 'Grand pectoral — chef abdominal', 'pectoraux', '#a8445a'],
  ['FMA13375', 'Petit pectoral', 'pectoraux', '#9a5aa8'],
  ['FMA37665', 'Coraco-brachial', 'conjoint', '#d9773f'],
  ['FMA37684', 'Biceps — chef court', 'conjoint', '#e08a3c'],
  ['FMA37686', 'Biceps — chef long', 'conjoint', '#d7a13a'],
  ['FMA13414', 'Sous-scapulaire', 'coiffe', '#7d6bb5'],
  ['FMA32544', 'Supra-épineux', 'coiffe', '#6f73b8'],
  ['FMA32547', 'Infra-épineux', 'coiffe', '#6a7fb8'],
  ['FMA32553', 'Petit rond', 'coiffe', '#6388b5'],
  ['FMA32551', 'Grand rond', 'coiffe', '#5f93b0'],
];

const tubes = [
  ['cephalique', 'Veine céphalique (schématique)', 'vaisseaux', '#3b6fd1', 2.2,
    [[-127, -113, 1342], [-134, -116, 1327], [-166, -122, 1297], [-188, -106, 1257], [-197, -99, 1226]]],
  ['musculocutane', 'Nerf musculo-cutané (schématique)', 'nerfs', '#ffd23f', 1.7,
    [[-108, -80, 1322], [-128, -85, 1296], [-150, -84, 1270], [-168, -82, 1240]]],
  ['axillaire', 'Nerf axillaire (schématique)', 'nerfs', '#ffd23f', 1.9,
    [[-98, -70, 1302], [-124, -73, 1274], [-150, -62, 1263], [-178, -50, 1270], [-207, -57, 1280], [-221, -77, 1284]]],
  ['incision-dp', 'Incision — voie delto-pectorale', 'incisions', '#35e0c8', 1.4,
    [[-129, -120, 1342], [-150, -126, 1316], [-171, -127, 1292], [-191, -113, 1255], [-200, -105, 1228]]],
  ['axe-plaque', 'Position de la plaque (schématique)', 'reperes', '#7df9ff', 3,
    [[-190, -84, 1314], [-195, -83, 1280], [-201, -79, 1240], [-206, -74, 1200]]],
];

const groupes = [
  ['os', 'Os'], ['deltoide', 'Deltoïde'], ['pectoraux', 'Pectoraux'], ['conjoint', 'Tendon conjoint et biceps'], ['coiffe', 'Coiffe et ronds'],
  ['vaisseaux', 'Vaisseaux'], ['nerfs', 'Nerfs'], ['incisions', 'Incisions'], ['reperes', 'Repères d’ostéosynthèse'],
];

const centre = [-165, -88, 1295];
const vues = { ant: { de: [-110, -430, 70] }, proche: { de: [-95, -310, 35] }, humerus: { de: [-150, -290, 10], cible: [-178, -84, 1285] }, libre: { de: [-330, -330, 120] } };

// Aucun muscle n'est incisé : le sillon delto-pectoral s'ouvre franchement, mais seulement en regard de l'incision.
// La veine céphalique suit le deltoïde ; le nerf musculo-cutané suit le tendon conjoint.
const LIGNE_SILLON = [[-140, -116, 1325], [-166, -118, 1295], [-186, -106, 1260]];
const sillon = k => {
  const dehors = { dep: [-19 * k, -2 * k, 0], autour: LIGNE_SILLON, rayon: 38 };
  const dedans = { dep: [19 * k, -2 * k, 0], autour: LIGNE_SILLON, rayon: 38 };
  return { FMA34680: dehors, cephalique: dehors, FMA34690: dedans, FMA79979: dedans, FMA45874: dedans };
};
const CONJOINT_EN_DEDANS = Object.fromEntries(['FMA37665', 'FMA37684', 'musculocutane'].map(id => [id, { dep: [13, 0, 0], autour: [[-150, -90, 1305], [-170, -84, 1262]], rayon: 34 }]));

const voies = {
  dp: { court: 'Delto-pectorale', titre: 'Voie delto-pectorale', steps: [
    { titre: 'Repères et incision', vue: 'ant',
      texte: 'Position demi-assise, bras libre. Repère : le processus coracoïde. L’incision part de la coracoïde et descend obliquement en bas et en dehors, le long du sillon delto-pectoral, vers l’insertion du deltoïde.',
      montrer: ['incision-dp'], accent: ['FMA34680', 'FMA34690'], danger: ['cephalique'], masquer: ['axe-plaque'] },
    { titre: 'Sillon delto-pectoral', vue: 'proche',
      texte: 'La veine céphalique repère le sillon. Elle est le plus souvent laissée en dehors, avec le deltoïde, après ligature de ses branches médiales. Le sillon s’ouvre le long de l’incision : deltoïde et veine en dehors, grand pectoral en dedans.',
      accent: ['FMA34680', 'FMA34690'], danger: ['cephalique'], masquer: ['axe-plaque'], ecarter: sillon(0.7) },
    { titre: 'Fascia clavi-pectoral et tendon conjoint', vue: 'proche',
      texte: 'Au fond du sillon, le fascia clavi-pectoral est incisé en dehors du tendon conjoint (coraco-brachial et chef court du biceps), qui est récliné en dedans, avec douceur : le nerf musculo-cutané, qui le pénètre quelques centimètres sous la coracoïde, part avec lui.',
      accent: ['FMA37665', 'FMA37684'], danger: ['musculocutane'], masquer: ['axe-plaque'], ecarter: { ...sillon(1), ...CONJOINT_EN_DEDANS } },
    { titre: 'Humérus proximal', vue: 'humerus',
      texte: 'La tête humérale, les tubercules et le tendon du long biceps, dans sa gouttière, sont exposés ; le sous-scapulaire est en avant. Le nerf axillaire passe au bord inférieur du sous-scapulaire puis contourne le col chirurgical : pas d’écarteur aveugle sous le deltoïde, pas de dissection en dessous du sous-scapulaire. La plaque se pose en dehors de la gouttière bicipitale.',
      accent: ['FMA23130', 'FMA37686', 'axe-plaque'], danger: ['axillaire'], montrer: ['axe-plaque'], ecarter: { ...sillon(1.5), ...CONJOINT_EN_DEDANS } },
  ] },
};

export default { nom: 'Épaule droite', centre, vues, meshes, tubes, groupes, voies };
