// Cheville droite — abords des malléoles latérale et médiale.
// Repère BodyParts3D, en millimètres : x = latéral (-) / médial (+), y = avant (-) / arrière (+), z = vers le haut.

const meshes = [
  ['FMA24477', 'Tibia', 'os', '#e9e2cf'],
  ['FMA24480', 'Fibula', 'os', '#e9e2cf'],
  ['FMA24482', 'Talus', 'os', '#ded6c0'],
  ['FMA24497', 'Calcanéus', 'os', '#ded6c0'],
  ['FMA24528', 'Cuboïde', 'os', '#ded6c0'],
  ['FMA35192', 'Membrane interosseuse', 'divers', '#cfd6dd'],
  ['FMA22552', 'Long fibulaire', 'lateraux', '#d9773f'],
  ['FMA22554', 'Court fibulaire', 'lateraux', '#e08a3c'],
  ['FMA22550', 'Troisième fibulaire', 'anterieurs', '#cf6f5d'],
  ['FMA22544', 'Tibial antérieur', 'anterieurs', '#c25a4c'],
  ['FMA22546', 'Long extenseur de l’hallux', 'anterieurs', '#b84a5e'],
  ['FMA22548', 'Long extenseur des orteils', 'anterieurs', '#a8444f'],
  ['FMA65018', 'Tibial postérieur', 'posterieurs', '#7d6bb5'],
  ['FMA65016', 'Long fléchisseur des orteils', 'posterieurs', '#6f73b8'],
  ['FMA65014', 'Long fléchisseur de l’hallux', 'posterieurs', '#6388b5'],
  ['FMA258847', 'Tendon calcanéen', 'posterieurs', '#e6e1d2'],
];

const tubes = [
  ['nfibsup', 'Nerf fibulaire superficiel (schématique)', 'nerfs', '#ffd23f', 1.3,
    [[-109, -60, 195], [-108, -66, 150], [-103, -76, 110], [-95, -90, 75], [-86, -104, 46]]],
  ['sural', 'Nerf sural et petite veine saphène (schématique)', 'nerfs', '#ffd23f', 1.5,
    [[-84, -22, 180], [-92, -26, 120], [-102, -32, 70], [-109, -38, 38], [-113, -56, 20]]],
  ['vsaphene', 'Grande veine saphène et nerf saphène (schématique)', 'vaisseaux', '#3b6fd1', 2,
    [[-60, -78, 180], [-55, -82, 125], [-52, -84, 90], [-53, -92, 62], [-60, -105, 42]]],
  ['tibialpost', 'Paquet tibial postérieur (schématique)', 'vaisseaux', '#e0392b', 2.2,
    [[-74, -40, 180], [-66, -38, 125], [-59, -36, 85], [-55, -33, 60], [-56, -28, 36]]],
  ['incision-lat', 'Incision — malléole latérale', 'incisions', '#35e0c8', 1.2, [[-115, -53, 150], [-115, -52, 105], [-116, -51, 62], [-112, -50, 40]]],
  ['incision-med', 'Incision — malléole médiale', 'incisions', '#35e0c8', 1.2, [[-52, -70, 125], [-46, -66, 95], [-44, -63, 70], [-49, -70, 52], [-56, -80, 46]]],
  ['plaque-fibula', 'Position de la plaque fibulaire (schématique)', 'reperes', '#7df9ff', 2.4, [[-114, -51, 135], [-115, -50, 95], [-115, -50, 54]]],
  ['vis-syndesmose', 'Vis de syndesmose (schématique)', 'reperes', '#7df9ff', 1.5, [[-116, -50, 76], [-92, -58, 80], [-68, -66, 84]]],
  ['vis-mm1', 'Vis de la malléole médiale (schématique)', 'reperes', '#7df9ff', 1.4, [[-50, -62, 58], [-61, -64, 80], [-72, -66, 102]]],
  ['vis-mm2', 'Vis de la malléole médiale (schématique)', 'reperes', '#7df9ff', 1.4, [[-52, -71, 60], [-63, -73, 82], [-74, -75, 104]]],
];

const groupes = [
  ['os', 'Os'], ['lateraux', 'Fibulaires'], ['anterieurs', 'Loge antérieure'], ['posterieurs', 'Loge postérieure'], ['divers', 'Membrane interosseuse'],
  ['vaisseaux', 'Vaisseaux'], ['nerfs', 'Nerfs'], ['incisions', 'Incisions'], ['reperes', 'Repères d’ostéosynthèse'],
];

const centre = [-82, -58, 85];
const LAT = [-108, -52, 92];
const MED = [-56, -64, 84];
const vues = {
  lat: { de: [-340, -70, 40], cible: LAT }, latProche: { de: [-230, -40, 25], cible: LAT },
  med: { de: [340, -90, 40], cible: MED }, medProche: { de: [225, -60, 25], cible: MED },
  libre: { de: [-250, -300, 90] },
};
const REPERES = ['plaque-fibula', 'vis-syndesmose', 'vis-mm1', 'vis-mm2'];
const AUTRE_COTE_LAT = ['incision-med', ...REPERES];
const FIBULAIRES_EN_ARRIERE = { FMA22552: [4, 11, 0], FMA22554: [4, 11, 0] };
const MEDIAL_OUVERT = { vsaphene: [0, -9, 0], FMA65018: [2, 9, 0], FMA65016: [2, 9, 0] };

const voies = {
  lat: { court: 'Malléole latérale', titre: 'Abord latéral de la malléole latérale', steps: [
    { titre: 'Repères et incision', vue: 'lat',
      texte: 'Décubitus dorsal, coussin sous la fesse du même côté. Incision longitudinale centrée sur la fibula distale, légèrement en arrière de sa crête. Le nerf fibulaire superficiel croise en avant, environ quatre travers de doigt au-dessus de la pointe ; le nerf sural passe en arrière et en dessous.',
      montrer: ['incision-lat'], accent: ['FMA24480'], danger: ['nfibsup', 'sural'], masquer: AUTRE_COTE_LAT },
    { titre: 'Exposition du foyer', vue: 'latProche',
      texte: 'Le plan est direct, sous-cutané. Les tendons fibulaires, en arrière de la fibula, sont réclinés en arrière si besoin. Le foyer est exposé en sous-périosté, sur la stricte étendue nécessaire à la réduction.',
      accent: ['FMA24480', 'FMA22552', 'FMA22554'], danger: ['nfibsup', 'sural'], masquer: ['incision-lat', ...AUTRE_COTE_LAT], ecarter: FIBULAIRES_EN_ARRIERE },
    { titre: 'Plaque et syndesmose', vue: 'latProche',
      texte: 'Après réduction (longueur, rotation, axe), la plaque est posée sur la face latérale ou postéro-latérale de la fibula. Le test de la syndesmose se fait sous scopie après la fixation : si elle est instable, une vis de syndesmose est posée, cheville en position neutre, dirigée de 30° vers l’avant.',
      accent: ['plaque-fibula', 'vis-syndesmose'], voiler: ['FMA24480', 'FMA24477'], danger: ['nfibsup', 'sural'], montrer: ['plaque-fibula', 'vis-syndesmose'],
      masquer: ['incision-lat', 'incision-med', 'vis-mm1', 'vis-mm2'], ecarter: FIBULAIRES_EN_ARRIERE },
  ] },
  med: { court: 'Malléole médiale', titre: 'Abord médial de la malléole médiale', steps: [
    { titre: 'Repères et incision', vue: 'med',
      texte: 'Incision arciforme antéro-médiale, centrée sur la malléole médiale. La grande veine saphène et le nerf saphène passent juste en avant de la malléole : ils sont repérés et protégés.',
      montrer: ['incision-med'], accent: ['FMA24477'], danger: ['vsaphene'], masquer: ['incision-lat', ...REPERES] },
    { titre: 'Exposition du foyer', vue: 'medProche',
      texte: 'La veine saphène est écartée en avant. Le foyer est exposé et nettoyé : le périoste ou le ligament deltoïde s’y interposent souvent. En arrière de la malléole, le tendon tibial postérieur puis le paquet tibial postérieur sont protégés.',
      accent: ['FMA24477', 'FMA65018'], danger: ['vsaphene', 'tibialpost'], masquer: ['incision-lat', 'incision-med', ...REPERES], ecarter: MEDIAL_OUVERT },
    { titre: 'Vissage', vue: 'medProche',
      texte: 'Réduction anatomique sous contrôle de la vue et de la scopie, puis fixation par deux vis parallèles, perpendiculaires au trait, ou par embrochage-haubanage si le fragment est petit ou ostéoporotique.',
      accent: ['vis-mm1', 'vis-mm2'], voiler: ['FMA24477'], danger: ['vsaphene', 'tibialpost'], montrer: ['vis-mm1', 'vis-mm2'],
      masquer: ['incision-lat', 'incision-med', 'plaque-fibula', 'vis-syndesmose'], ecarter: MEDIAL_OUVERT },
  ] },
};

export default { nom: 'Cheville droite', centre, vues, meshes, tubes, groupes, voies };
