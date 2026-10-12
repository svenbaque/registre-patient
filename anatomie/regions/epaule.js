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

// Deltoïde (avec la veine céphalique) en dehors, grand pectoral en dedans.
const SILLON_OUVERT = { FMA34680: [-26, -5, 0], cephalique: [-26, -5, 0], FMA34682: [-12, 0, 0], FMA34690: [26, -5, 0], FMA79979: [26, -5, 0], FMA45874: [26, -5, 0] };
// Pour exposer l'humérus, le deltoïde est récliné plus loin en dehors.
const DELTOIDE_RECLINE = { FMA34680: [-44, -6, 0], cephalique: [-44, -6, 0], FMA34682: [-22, 2, 0] };
const CONJOINT_EN_DEDANS = { FMA37665: [15, -2, 0], FMA37684: [15, -2, 0], musculocutane: [15, -2, 0] };

const voies = {
  dp: { court: 'Delto-pectorale', titre: 'Voie delto-pectorale', steps: [
    { titre: 'Repères et incision', vue: 'ant',
      texte: 'Position demi-assise, bras libre. Repère : le processus coracoïde. L’incision part de la coracoïde et descend obliquement en bas et en dehors, le long du sillon delto-pectoral, vers l’insertion du deltoïde.',
      montrer: ['incision-dp'], accent: ['FMA34680', 'FMA34690'], danger: ['cephalique'], masquer: ['axe-plaque'] },
    { titre: 'Sillon delto-pectoral', vue: 'proche',
      texte: 'La veine céphalique repère le sillon. Elle est le plus souvent laissée en dehors, avec le deltoïde, après ligature de ses branches médiales. Le deltoïde est écarté en dehors, le grand pectoral en dedans.',
      accent: ['FMA34680', 'FMA34690'], danger: ['cephalique'], masquer: ['axe-plaque'], ecarter: SILLON_OUVERT },
    { titre: 'Fascia clavi-pectoral et tendon conjoint', vue: 'proche',
      texte: 'Le fascia clavi-pectoral est incisé en dehors du tendon conjoint (coraco-brachial et chef court du biceps), qui est écarté en dedans, avec douceur : le nerf musculo-cutané pénètre le coraco-brachial quelques centimètres sous la coracoïde.',
      accent: ['FMA37665', 'FMA37684'], danger: ['musculocutane'], masquer: ['axe-plaque'], ecarter: { ...SILLON_OUVERT, ...CONJOINT_EN_DEDANS } },
    { titre: 'Humérus proximal', vue: 'humerus',
      texte: 'La tête humérale, les tubercules et le tendon du long biceps, dans sa gouttière, sont exposés ; le sous-scapulaire est en avant. Le nerf axillaire passe au bord inférieur du sous-scapulaire puis contourne le col chirurgical : pas d’écarteur aveugle sous le deltoïde, pas de dissection en dessous du sous-scapulaire. La plaque se pose en dehors de la gouttière bicipitale.',
      accent: ['FMA23130', 'FMA37686', 'axe-plaque'], danger: ['axillaire'], montrer: ['axe-plaque'], ecarter: { ...SILLON_OUVERT, ...CONJOINT_EN_DEDANS, ...DELTOIDE_RECLINE } },
  ] },
};

export default { nom: 'Épaule droite', centre, vues, meshes, tubes, groupes, voies };
