// Cheville droite — abords des malléoles latérale et médiale, voie postéro-latérale, voie antérieure.
// Repère BodyParts3D, en millimètres : x = latéral (-) / médial (+), y = avant (-) / arrière (+), z = vers le haut.
import pieces from './cheville.pieces.js';
import { peauFendue, berges, charge, lame, deuxBerges } from './outils.js';

const meshes = [
  ['peau-jambe', 'Peau', 'peau', '#e2b596', { id: 'peau', dossier: 'models-z' }],
  ...pieces,
];

// Lignes d'incision relevées sur la peau.
const PEAU_LAT = [[-124, -52, 150], [-120, -53, 130], [-114, -53, 100], [-116, -51, 70], [-114, -48, 45]];
const PEAU_MED = [[-58, -66, 125], [-54, -68, 100], [-47, -68, 80], [-43, -66, 65], [-44, -72, 52]];
const FOND_LAT = [1, 0, 0];
const FOND_MED = [-1, 0, 0];
// Voie postéro-latérale : à mi-distance du bord postérieur de la fibula et du bord latéral du tendon calcanéen.
const PEAU_PL = [[-107, -15, 151], [-103, -19, 130], [-102, -23, 111], [-98, -28, 90], [-99, -27, 71], [-99, -28, 55]];
const FOND_PL = [0.5, -0.87, 0];
const INTERVALLE_PL = [[-99, -38, 146], [-95, -38, 60]]; // entre les fibulaires (en dehors) et le long fléchisseur de l'hallux (en dedans)
const N_PL_LAT = [-0.87, -0.5, -0.04];
const N_PL_MED = [0.87, 0.5, 0.04];

// Tracés à la main : incisions, plaque et vis.
const visPost = (n, z, y) => [`plaque-post/vis${n}`, 'Vis de la plaque postérieure', 'implants', '#cfd6dd', 1.5, [[-80, y + 1.5, z], [-80, y - 13, z], [-80, y - 27, z]]];
// Voie antérieure : incision longitudinale entre tibial antérieur et long extenseur de l'hallux.
const PEAU_ANT = [[-92, -78, 150], [-89, -79, 134], [-86, -84, 116], [-83, -88, 102], [-80, -93, 90], [-77, -98, 78], [-75, -102, 69]];
const FOND_ANT = [0, 1, 0];
const INTERVALLE_ANT = [[-93, -72, 150], [-75, -88, 72]];
// ----- Pilon tibial (antéro-médiale, antéro-latérale) et voie postéro-médiale -----
const PEAU_AM = [[-68, -73, 159], [-67, -76, 141], [-68, -73, 121], [-64, -78, 100], [-61, -83, 85], [-59, -86, 72]];
const FOND_AM = [-0.6, 0.8, 0];
const PEAU_AL = [[-93, -83, 160], [-91, -81, 140], [-92, -80, 120], [-93, -81, 100], [-95, -86, 84], [-96, -88, 72]];
const FOND_AL = [0.55, 0.83, 0];
const PEAU_PM = [[-55, -33, 162], [-55, -33, 141], [-53, -31, 122], [-56, -35, 100], [-55, -34, 85], [-54, -31, 72]];
const FOND_PM = [-0.6, -0.8, 0];
const visVers = (id, n, de, dir, l = 22) => [`${id}/vis${n}`, 'Vis', 'implants', '#cfd6dd', 1.5, [de, de.map((c, i) => c + dir[i] * l / 2), de.map((c, i) => c + dir[i] * l)]];
const tubes = [
  ['incision-am', 'Incision — antéro-médiale du pilon', 'incisions', '#35e0c8', 1.2, PEAU_AM.map(([x, y, z]) => [x + 1.5, y - 2, z])],
  ['incision-al', 'Incision — antéro-latérale du pilon', 'incisions', '#35e0c8', 1.2, PEAU_AL.map(([x, y, z]) => [x - 1.4, y - 2.1, z])],
  ['incision-pm', 'Incision — voie postéro-médiale', 'incisions', '#35e0c8', 1.2, PEAU_PM.map(([x, y, z]) => [x + 1.5, y + 2, z])],
  visVers('plaque-am', 1, [-70.5, -80, 140], FOND_AM), visVers('plaque-am', 2, [-69, -79.5, 124], FOND_AM), visVers('plaque-am', 3, [-56, -77.5, 86], FOND_AM, 30), visVers('plaque-am', 4, [-52, -75.5, 75], FOND_AM, 32),
  visVers('plaque-al', 1, [-83, -80.5, 140], FOND_AL), visVers('plaque-al', 2, [-82, -79.5, 124], FOND_AL), visVers('plaque-al', 3, [-90, -76, 77], FOND_AL, 30), visVers('plaque-al', 4, [-78, -81, 77], [0, 1, 0], 32),
  visVers('plaque-pm', 1, [-66.5, -53.5, 126], FOND_PM), visVers('plaque-pm', 2, [-64, -50, 104], FOND_PM), visVers('plaque-pm', 3, [-58, -47, 88], FOND_PM, 26),
  ['incision-ant', 'Incision — voie antérieure', 'incisions', '#35e0c8', 1.2, PEAU_ANT.map(([x, y, z]) => [x, y - 2.6, z])],
  ['incision-pl', 'Incision — voie postéro-latérale', 'incisions', '#35e0c8', 1.2, PEAU_PL.map(([x, y, z]) => [x - 1, y + 1.8, z])],
  visPost(1, 116, -50), visPost(2, 104, -47.5), visPost(3, 92, -44),
  ['incision-lat', 'Incision — malléole latérale', 'incisions', '#35e0c8', 1.2, PEAU_LAT.map(([x, y, z]) => [x - 1.5, y, z])],
  ['incision-med', 'Incision — malléole médiale', 'incisions', '#35e0c8', 1.2, PEAU_MED.map(([x, y, z]) => [x + 1.5, y, z])],
  ...[136, 122, 108].map((z, i) => [`plaque/vis-p${i}`, 'Vis corticale de la plaque', 'implants', '#cfd6dd', 1.5, [[-110, -53, z], [-103, -54, z], [-95, -55, z]]]),
  ...[62, 53].map((z, i) => [`plaque/vis-d${i}`, 'Vis spongieuse distale', 'implants', '#cfd6dd', 1.5, [[-110.5, -49, z], [-104, -50, z], [-98, -51, z]]]),
  ['vis-syndesmose', 'Vis de syndesmose', 'implants', '#dfe6ec', 1.8, [[-111, -52, 94], [-90, -62, 95.5], [-66, -74, 97]]],
  ['vis-mm1', 'Vis de la malléole médiale', 'implants', '#cfd6dd', 1.8, [[-45, -60, 61], [-57, -62, 84], [-69, -64, 107]]],
  ['vis-mm2', 'Vis de la malléole médiale', 'implants', '#cfd6dd', 1.8, [[-46.5, -69, 62], [-58, -71, 85], [-70, -73, 108]]],
];
const rubans = [
  ['plaque-am', 'Plaque antéro-médiale du tibia distal', 'implants', '#b9c2cc', [[-71, -80, 146], [-69, -79.5, 120], [-64, -79.5, 100], [-55.5, -77.5, 85], [-51.5, -75.5, 73]], 11, 2, [0.8, 0.6, 0]],
  ['plaque-al', 'Plaque antéro-latérale du tibia distal — tige', 'implants', '#b9c2cc', [[-83, -80.5, 146], [-82, -79.5, 120], [-86.5, -76, 100], [-91.5, -76.5, 84]], 10, 2, [0.83, -0.55, 0]],
  ['plaque-al/tete', 'Plaque antéro-latérale du tibia distal — tête', 'implants', '#b9c2cc', [[-94, -73.5, 77], [-85, -80.5, 77], [-72, -82, 77]], 9, 2, [0, 0, 1]],
  ['plaque-pm', 'Plaque postéro-médiale', 'implants', '#b9c2cc', [[-67.5, -54.5, 132], [-65.5, -52, 112], [-63.5, -48.5, 97], [-56.5, -47, 85]], 8, 1.8, [0.8, -0.6, 0]],
  ['plaque-post', 'Plaque postérieure anti-glissement', 'implants', '#b9c2cc', [[-80, -49.5, 122], [-80, -46.5, 106], [-80, -42.5, 92], [-80, -38.5, 81]], 9, 1.6, [1, 0, 0]],
  ['plaque', 'Plaque tiers-de-tube fibulaire', 'implants', '#b9c2cc', [[-108, -52, 142], [-107.5, -54.5, 114], [-107, -53, 90], [-108.5, -51, 68], [-109, -47.5, 49]], 9, 1.6, [0, 1, 0]],
];

const groupes = [
  ['peau', 'Peau'], ['graisse', 'Tissu sous-cutané'], ['os', 'Os'], ['lateraux', 'Fibulaires'], ['anterieurs', 'Loge antérieure'], ['posterieurs', 'Loge postérieure'],
  ['ligaments', 'Ligaments et rétinaculums'], ['vaisseaux', 'Artères et veines'], ['nerfs', 'Nerfs'], ['incisions', 'Incisions'], ['implants', 'Plaque et vis'],
];

const centre = [-82, -58, 85];
const LAT = [-110, -52, 95];
const MED = [-50, -66, 85];
const vues = {
  // décubitus dorsal, coussin sous la fesse : l'opérateur regarde la face latérale, pied à droite, face antérieure en haut
  opLat: { de: [-300, -55, 0], haut: [0, -1, 0], cible: LAT }, opLatProche: { de: [-185, -32, 0], haut: [0, -1, 0], cible: LAT },
  // membre en rotation latérale : l'opérateur regarde la face médiale, pied à gauche, face antérieure en haut
  opMed: { de: [300, -65, 0], haut: [0, -1, 0], cible: MED }, opMedProche: { de: [175, -38, 0], haut: [0, -1, 0], cible: MED },
  // décubitus ventral : l'opérateur regarde la face postéro-latérale de la cheville, genou en haut de l'image
  opPL: { de: [-150, 260, 0], cible: [-92, -38, 100] }, opPLProche: { de: [-88, 150, 0], cible: [-90, -40, 100] },
  // décubitus dorsal : l'opérateur regarde la face antérieure de la cheville, genou en haut
  opAnt: { de: [-30, -290, 40], cible: [-82, -80, 105] }, opAntProche: { de: [-15, -165, 20], cible: [-82, -80, 100] },
  opAM: { de: [150, -250, 20], cible: [-68, -78, 110] }, opAMProche: { de: [88, -146, 10], cible: [-66, -78, 106] },
  opAL: { de: [-150, -240, 20], cible: [-90, -80, 110] }, opALProche: { de: [-88, -140, 10], cible: [-90, -80, 106] },
  opPM: { de: [190, 230, 0], cible: [-60, -42, 112] }, opPMProche: { de: [110, 135, 0], cible: [-60, -42, 108] },
  libre: { de: [-250, -300, 90] },
};
const IMPLANTS_LAT = ['plaque', 'vis-syndesmose'];
const IMPLANTS_MED = ['vis-mm1', 'vis-mm2'];
const IMPLANTS = [...IMPLANTS_LAT, ...IMPLANTS_MED, 'plaque-post', 'plaque-am', 'plaque-al', 'plaque-pm'];

const latOuverte = k => berges(PEAU_LAT, FOND_LAT, [0, -12, 0], k, 24);
const medOuverte = k => ({
  ...berges(PEAU_MED, FOND_MED, [0, -11, 0], k, 24),
  // la grande veine saphène et le nerf saphène, juste en avant de la malléole, partent avec la berge antérieure
  ...Object.fromEntries(['vsaphene', 'nsaphene'].map(id => [id, { dep: [0, -11 * k, 0], autour: PEAU_MED, rayon: 30, fond: FOND_MED }])),
});

const plPeau = k => ({
  ...berges(PEAU_PL, FOND_PL, N_PL_MED.map(c => c * 11), k, 24),
  // le nerf sural et la petite veine saphène, sous-cutanés, restent dans la berge médiale
  ...charge(['sural', 'vpetite-saphene'], { dep: N_PL_MED.map(c => c * 9 * k), autour: PEAU_PL, rayon: 26, fond: FOND_PL }),
});
const optsPL = { rayon: 22, profondeur: 34 };
const plProfond = (dehors, dedans) => ({
  ...charge(['fibulaire-court', 'fibulaire-long'], lame(INTERVALLE_PL, N_PL_LAT, FOND_PL, dehors, dehors * 2.4 + 10, optsPL)),
  ...charge(['fhl', 'afibulaire'], lame(INTERVALLE_PL, N_PL_MED, FOND_PL, dedans, dedans * 2.4 + 14, optsPL)),
});

const PEAU_ANT_DROITE = [PEAU_ANT[0], PEAU_ANT[PEAU_ANT.length - 1]];
const lamesAnt = (ligne, e, profondeur, ids, course = e * 2.4 + 8) => deuxBerges(PEAU_ANT, FOND_ANT,
  { vers: [1, 0, 0], lame: lame(ligne, [1, 0, 0], FOND_ANT, e, course, { rayon: 18, profondeur }) },
  { vers: [-1, 0, 0], lame: lame(ligne, [-1, 0, 0], FOND_ANT, e, course, { rayon: 18, profondeur }) }, ids);
const antPeau = e => lamesAnt(PEAU_ANT_DROITE, e, 20, ['peau', 'graisse']);
const antRetinaculum = e => lamesAnt(PEAU_ANT_DROITE, e, 24, ['ret-ext-sup', 'ret-ext-inf']);
// Tibial antérieur en dedans ; long extenseur de l'hallux, paquet tibial antérieur et nerf fibulaire profond en dehors.
const antProfond = e => ({
  'tibial-ant': lame(INTERVALLE_ANT, [1, 0, 0], FOND_ANT, e, e * 2.4 + 10, { rayon: 18, profondeur: 30 }),
  ...charge(['ehl', 'edl', 'edl-tendons', 'atibiale-ant', 'nfibprof', 'apedieuse'], lame(INTERVALLE_ANT, [-1, 0, 0], FOND_ANT, e, e * 2.4 + 16, { rayon: 18, profondeur: 30 })),
});
const fendreAnt = [
  ...peauFendue(PEAU_ANT, FOND_ANT, 'médiale', 'latérale'),
  ['ret-ext-sup', { ligne: PEAU_ANT, fond: FOND_ANT, rayon: 18 }, 'Rétinaculum supérieur des extenseurs — berge médiale', 'Rétinaculum supérieur des extenseurs — berge latérale'],
  ['ret-ext-inf', { ligne: PEAU_ANT, fond: FOND_ANT, rayon: 18 }, 'Rétinaculum inférieur des extenseurs — berge médiale', 'Rétinaculum inférieur des extenseurs — berge latérale'],
];

// ----- Pilon et postéro-médiale : deux lames par plan, côté calculé -----
const bouts = ligne => [ligne[0], ligne[ligne.length - 1]];
const lamesDe = (peau, fond, versA, versB, eA, eB, profondeur, ids) => deuxBerges(peau, fond,
  { vers: versA, lame: lame(bouts(peau), versA, fond, eA, eA * 2.4 + 8, { rayon: 18, profondeur }) },
  { vers: versB, lame: lame(bouts(peau), versB, fond, eB, eB * 2.4 + 8, { rayon: 18, profondeur }) }, ids);
const RETINACULUMS_ANT = ['ret-ext-sup', 'ret-ext-inf'];
const fendreAvec = (peau, fond, nomA, nomB, ids) => [
  ...peauFendue(peau, fond, nomA, nomB),
  ...ids.map(id => [id, { ligne: peau, fond, rayon: 18 }, `Rétinaculum — berge ${nomA}`, `Rétinaculum — berge ${nomB}`]),
];
// antéro-médiale : toute la loge antérieure est réclinée en dehors, le tibial antérieur dans sa gaine
const AM_DEHORS = [-0.8, -0.6, 0];
const AM_DEDANS = [0.8, 0.6, 0];
const amPeau = e => ({ ...lamesDe(PEAU_AM, FOND_AM, AM_DEHORS, AM_DEDANS, e, e * 0.8, 20), ...charge(['vsaphene', 'nsaphene'], lame(bouts(PEAU_AM), AM_DEDANS, FOND_AM, e * 0.8, e * 2 + 8, { rayon: 18, profondeur: 20 })) });
const amProfond = e => ({
  ...lamesDe(PEAU_AM, FOND_AM, AM_DEHORS, AM_DEDANS, e, 4, 24, RETINACULUMS_ANT),
  ...charge(['tibial-ant', 'ehl', 'edl', 'edl-tendons', 'atibiale-ant', 'nfibprof', 'apedieuse'], lame([[-76, -81, 158], [-60, -80, 74]], AM_DEHORS, FOND_AM, e, e * 2.4 + 22, { rayon: 18, profondeur: 30 })),
});
// antéro-latérale : extenseurs et paquet tibial antérieur réclinés en dedans
const AL_DEDANS = [0.83, -0.55, 0];
const AL_DEHORS = [-0.83, 0.55, 0];
const alPeau = e => lamesDe(PEAU_AL, FOND_AL, AL_DEDANS, AL_DEHORS, e, e * 0.8, 20);
const alProfond = e => ({
  ...lamesDe(PEAU_AL, FOND_AL, AL_DEDANS, AL_DEHORS, e, 4, 24, RETINACULUMS_ANT),
  ...charge(['edl', 'edl-tendons', 'fibulaire-3', 'ehl', 'atibiale-ant', 'nfibprof', 'apedieuse'], lame([[-90, -76, 158], [-94, -78, 74]], AL_DEDANS, FOND_AL, e, e * 2.4 + 16, { rayon: 18, profondeur: 30 })),
});
// postéro-médiale : tibial postérieur en avant, long fléchisseur des orteils et paquet tibial postérieur en arrière
const PM_AVANT = [0.8, -0.6, 0];
const PM_ARRIERE = [-0.8, 0.6, 0];
const pmPeau = e => lamesDe(PEAU_PM, FOND_PM, PM_AVANT, PM_ARRIERE, e, e, 18);
const pmProfond = e => ({
  ...lamesDe(PEAU_PM, FOND_PM, PM_AVANT, PM_ARRIERE, e, e, 22, ['ret-flechisseurs']),
  'tibial-post': lame([[-66, -46, 160], [-60, -42, 74]], PM_AVANT, FOND_PM, e * 0.7, 26, { rayon: 18, profondeur: 30 }),
  ...charge(['fdl', 'ntibial', 'atibiale-post', 'vtibiales-post', 'fhl'], lame([[-66, -46, 160], [-60, -42, 74]], PM_ARRIERE, FOND_PM, e, e * 2.4 + 14, { rayon: 18, profondeur: 30 })),
});

const voies = {
  lat: { court: 'Malléole latérale', titre: 'Abord latéral de la malléole latérale', fendre: peauFendue(PEAU_LAT, FOND_LAT, 'postérieure', 'antérieure'), steps: [
    { titre: 'Installation et incision', vue: 'opLat',
      texte: 'Vue de l’opérateur : décubitus dorsal, coussin sous la fesse du même côté pour corriger la rotation latérale du membre, garrot à la cuisse. Incision longitudinale centrée sur la fibula distale, sur son bord postérieur ou sa face latérale ; elle peut s’incurver en avant à la pointe pour voir la syndesmose. Le nerf fibulaire superficiel perfore le fascia et croise en avant, environ 10 cm au-dessus de la pointe (parfois plus bas) ; le nerf sural et la petite veine saphène passent en arrière et en dessous.',
      montrer: ['incision-lat'], danger: ['nfibsup', 'sural'], masquer: IMPLANTS },
    { titre: 'Peau et tissu sous-cutané', vue: 'opLatProche',
      texte: 'Le plan est direct : peau, tissu sous-cutané, puis l’os, sous-cutané à ce niveau. Lambeaux cutanés épais, sans décollement. En haut de l’incision, le nerf fibulaire superficiel est recherché et protégé dans la berge antérieure.',
      accent: ['fibula'], danger: ['nfibsup', 'nfibsup-int', 'sural'], masquer: IMPLANTS, ecarter: latOuverte(1) },
    { titre: 'Exposition du foyer', vue: 'opLatProche',
      texte: 'Les tendons fibulaires restent en arrière de la fibula, dans leur gaine. Le périoste est incisé et récliné sur 1 à 2 mm de part et d’autre du trait, pas davantage ; le foyer est nettoyé du caillot et des interpositions. En avant, le ligament tibio-fibulaire antérieur et la syndesmose sont visibles.',
      accent: ['fibula', 'ltfa'], danger: ['nfibsup', 'nfibsup-int', 'sural'], masquer: IMPLANTS, ecarter: latOuverte(1.25) },
    { titre: 'Réduction et plaque', vue: 'opLatProche',
      texte: 'Réduction anatomique au davier à pointes : longueur, rotation, axe. Une vis de traction antéro-postérieure perpendiculaire au trait, si celui-ci le permet, puis une plaque tiers-de-tube de neutralisation sur la face latérale (ou une plaque postéro-latérale anti-glissement). Les vis distales sont unicorticales : elles ne doivent pas pénétrer l’articulation.',
      accent: ['fibula'], danger: ['nfibsup', 'sural'], montrer: ['plaque'], masquer: ['vis-syndesmose', ...IMPLANTS_MED], ecarter: latOuverte(1.25) },
    { titre: 'Syndesmose', vue: 'opLatProche',
      texte: 'La syndesmose est testée sous scopie après la fixation (traction latérale au crochet sur la fibula, ou rotation latérale forcée). Instable, elle est réduite puis fixée par une vis de position, 2 à 3 cm au-dessus de l’interligne, parallèle à lui, dirigée de 25 à 30° vers l’avant, de la fibula vers le tibia. Peau retirée et os translucides pour montrer le trajet.',
      accent: ['vis-syndesmose'], voiler: ['fibula', 'tibia'], montrer: IMPLANTS_LAT, masquer: [...IMPLANTS_MED, 'peau', 'graisse'], estomper: ['fibulaire-long', 'fibulaire-court', 'fibulaire-3', 'edl', 'edl-tendons'] },
  ] },
  med: { court: 'Malléole médiale', titre: 'Abord antéro-médial de la malléole médiale', fendre: peauFendue(PEAU_MED, FOND_MED, 'antérieure', 'postérieure'), steps: [
    { titre: 'Installation et incision', vue: 'opMed',
      texte: 'Vue de l’opérateur : décubitus dorsal, le membre tombe en rotation latérale et présente la malléole médiale. Incision longitudinale légèrement courbe, centrée sur la malléole ; son extrémité distale s’incurve vers l’avant pour voir l’angle antéro-médial de l’articulation. La grande veine saphène et le nerf saphène passent juste en avant de la malléole.',
      montrer: ['incision-med'], danger: ['vsaphene', 'nsaphene'], masquer: IMPLANTS },
    { titre: 'Peau, veine saphène', vue: 'opMedProche',
      texte: 'Peau et tissu sous-cutané sont incisés prudemment : la grande veine saphène et le nerf saphène sont repérés, libérés et réclinés en avant avec la berge antérieure, sur un lacs si besoin.',
      accent: ['tibia'], danger: ['vsaphene', 'nsaphene'], masquer: IMPLANTS, ecarter: medOuverte(1) },
    { titre: 'Exposition du foyer', vue: 'opMedProche',
      texte: 'Le foyer est exposé et nettoyé : le périoste et parfois le ligament deltoïde s’y interposent. Une petite arthrotomie antéro-médiale permet de contrôler la réduction sur le cartilage et de laver l’articulation. En arrière de la malléole, le tendon tibial postérieur puis le paquet tibial postérieur sont protégés.',
      accent: ['tibia', 'deltoide-nav', 'deltoide-calc'], danger: ['vsaphene', 'nsaphene', 'tibial-post', 'atibiale-post', 'ntibial'], masquer: IMPLANTS, ecarter: medOuverte(1.3) },
    { titre: 'Réduction et vissage', vue: 'opMedProche',
      texte: 'Réduction anatomique au crochet ou au davier à pointes, maintenue par deux broches. Fixation par deux vis spongieuses parallèles à filetage partiel, perpendiculaires au trait ; haubanage sur broches si le fragment est petit ou ostéoporotique, plaque anti-glissement pour un trait vertical. Peau retirée et tibia translucide pour montrer le trajet des vis.',
      accent: IMPLANTS_MED, voiler: ['tibia'], danger: ['tibial-post', 'atibiale-post', 'ntibial'], montrer: IMPLANTS_MED, masquer: [...IMPLANTS_LAT, 'peau', 'graisse', 'ret-flechisseurs'] },
  ] },
  pl: { court: 'Postéro-latérale', titre: 'Voie postéro-latérale de la cheville (malléole postérieure)', fendre: peauFendue(PEAU_PL, FOND_PL, 'médiale', 'latérale'), steps: [
    { titre: 'Installation et incision', vue: 'opPL',
      texte: 'Vue de l’opérateur : décubitus ventral (ou latéral), coussin sous la hanche du même côté, pied dépassant de la table pour pouvoir le porter en flexion dorsale. Incision longitudinale à mi-distance du bord postérieur de la fibula et du bord latéral du tendon calcanéen. Le nerf sural et la petite veine saphène croisent ce champ, de dedans en dehors.',
      montrer: ['incision-pl'], danger: ['sural', 'vpetite-saphene'], masquer: IMPLANTS },
    { titre: 'Peau, nerf sural', vue: 'opPLProche',
      texte: 'Incision cutanée prudente, dissection sous-cutanée aux ciseaux : le nerf sural et la petite veine saphène sont repérés et réclinés avec une berge. Le fascia est incisé sur la même ligne.',
      accent: ['fibulaire-court', 'fhl'], danger: ['sural', 'vpetite-saphene'], masquer: IMPLANTS, ecarter: plPeau(1) },
    { titre: 'Intervalle fibulaires / long fléchisseur de l’hallux', vue: 'opPLProche',
      texte: 'Plan internerveux : les tendons fibulaires (nerf fibulaire superficiel) sont réclinés en dehors, le long fléchisseur de l’hallux (nerf tibial) en dedans. Ce muscle, charnu jusqu’en bas, est désinséré de la fibula et de la membrane interosseuse puis récliné : il protège le nerf tibial et le paquet tibial postérieur. L’artère fibulaire et ses perforantes sont sur son bord latéral.',
      accent: ['fibulaire-court', 'fibulaire-long', 'fhl'], danger: ['sural', 'afibulaire', 'ntibial', 'atibiale-post'], masquer: IMPLANTS, ecarter: { ...plPeau(1.3), ...plProfond(8, 12) } },
    { titre: 'Malléole postérieure', vue: 'opPLProche',
      texte: 'La face postérieure du tibia distal et le fragment postéro-latéral sont exposés. Le fragment reste attaché au ligament tibio-fibulaire postérieur, qui n’est pas sectionné : la réduction se fait sur le trait cortical, par flexion dorsale du pied et poussée directe, sans arthrotomie postérieure. Un fragment intercalaire enfoncé est relevé avant.',
      accent: ['tibia', 'ltfp'], danger: ['sural', 'afibulaire', 'ntibial', 'atibiale-post'], masquer: IMPLANTS, ecarter: { ...plPeau(1.4), ...plProfond(9, 16) } },
    { titre: 'Plaque anti-glissement', vue: 'opPLProche',
      texte: 'Fixation par une plaque postérieure anti-glissement (tiers-de-tube ou plaque dédiée) dont la première vis, juste au-dessus de la pointe du fragment, le chasse vers le bas et l’avant ; ou par des vis postéro-antérieures. Par la même incision, en réclinant les fibulaires en dedans, la fibula peut recevoir une plaque postérieure. La syndesmose est testée après fixation.',
      accent: ['tibia'], danger: ['sural', 'afibulaire', 'ntibial'], montrer: ['plaque-post'], masquer: [...IMPLANTS_LAT, ...IMPLANTS_MED], ecarter: { ...plPeau(1.4), ...plProfond(9, 16) } },
  ] },
  ant: { court: 'Antérieure', titre: 'Voie antérieure de la cheville', fendre: fendreAnt, steps: [
    { titre: 'Installation et incision', vue: 'opAnt',
      texte: 'Vue de l’opérateur : décubitus dorsal, coussin sous la fesse pour mettre le pied au zénith, garrot. Incision antérieure longitudinale de 10 à 12 cm, centrée sur l’interligne, entre le tendon du tibial antérieur et celui du long extenseur de l’hallux. Les branches du nerf fibulaire superficiel croisent l’incision, juste sous la peau.',
      montrer: ['incision-ant'], danger: ['nfibsup', 'nfibsup-med'], masquer: IMPLANTS },
    { titre: 'Peau et rétinaculum des extenseurs', vue: 'opAntProche',
      texte: 'La peau est incisée seule ; les rameaux du nerf fibulaire superficiel sont repérés et réclinés. Le rétinaculum des extenseurs est ouvert en regard de l’intervalle, en restant hors de la gaine du tibial antérieur, pour éviter la corde d’arc et faciliter la fermeture.',
      accent: ['tibial-ant', 'ehl', 'ret-ext-sup', 'ret-ext-inf'], danger: ['nfibsup', 'nfibsup-med', 'atibiale-ant'], masquer: IMPLANTS, ecarter: antPeau(10) },
    { titre: 'Intervalle tibial antérieur / long extenseur de l’hallux', vue: 'opAntProche',
      texte: 'Le tibial antérieur est récliné en dedans ; le long extenseur de l’hallux en dehors, avec le paquet tibial antérieur et le nerf fibulaire profond, qui cheminent juste en dehors de lui à ce niveau et sont repérés avant d’être écartés. Variante de Hoppenfeld : intervalle entre long extenseur de l’hallux et long extenseur des orteils, paquet récliné en dedans.',
      accent: ['tibial-ant', 'ehl'], danger: ['atibiale-ant', 'nfibprof', 'apedieuse'], masquer: IMPLANTS, ecarter: { ...antPeau(13), ...antRetinaculum(10), ...antProfond(9) } },
    { titre: 'Articulation talo-crurale', vue: 'opAntProche',
      texte: 'La capsule antérieure est incisée dans l’axe et décollée du tibia et du col du talus : le pilon tibial antérieur, le dôme du talus et les deux gouttières malléolaires sont exposés. C’est la voie des arthrodèses, des prothèses totales de cheville et des fractures antérieures du pilon. Fermeture soigneuse de la capsule et du rétinaculum ; la peau antérieure, mal vascularisée, est manipulée sans écarteur appuyé.',
      accent: ['tibia', 'talus'], danger: ['atibiale-ant', 'nfibprof', 'apedieuse'], masquer: IMPLANTS, ecarter: { ...antPeau(16), ...antRetinaculum(14), ...antProfond(14) } },
  ] },
  'pilon-am': { court: 'Pilon antéro-médial', titre: 'Voie antéro-médiale du pilon tibial', fendre: fendreAvec(PEAU_AM, FOND_AM, 'latérale', 'médiale', RETINACULUMS_ANT), steps: [
    { titre: 'Installation et incision', vue: 'opAM',
      texte: 'Décubitus dorsal, coussin sous la fesse, garrot ; l’intervention n’a lieu qu’après détente des parties molles (peau qui plisse), souvent sous fixateur externe en attendant. L’incision longe la crête tibiale, 1 cm en dehors d’elle, puis s’incurve en dedans au niveau de l’interligne, le long du bord médial du tibial antérieur, pour finir en avant de la malléole médiale. Si une seconde incision est nécessaire, le pont cutané fait au moins 7 cm.',
      montrer: ['incision-am'], danger: ['vsaphene', 'nsaphene'], masquer: IMPLANTS },
    { titre: 'Lambeau de pleine épaisseur', vue: 'opAMProche',
      texte: 'La peau et le tissu sous-cutané sont levés d’un seul tenant, sans décollement sous-cutané. La grande veine saphène et le nerf saphène sont dans la berge médiale. Le rétinaculum des extenseurs est incisé en dedans du tibial antérieur, sans ouvrir sa gaine : un tendon à nu sous une cicatrice fragile est une complication redoutée.',
      accent: ['tibia', 'tibial-ant'], danger: ['vsaphene', 'nsaphene'], masquer: IMPLANTS, ecarter: amPeau(10) },
    { titre: 'Loge antérieure réclinée en dehors', vue: 'opAMProche',
      texte: 'Le tibial antérieur, dans sa gaine, et toute la loge antérieure avec le paquet tibial antérieur sont réclinés en dehors. La capsule est ouverte dans l’axe du trait : la métaphyse antérieure, le fragment médial et la surface articulaire sont exposés. Les fragments ne sont pas dépériostés ; un distracteur ouvre l’interligne.',
      accent: ['tibia', 'talus'], danger: ['atibiale-ant', 'nfibprof', 'vsaphene'], masquer: IMPLANTS, ecarter: { ...amPeau(12), ...amProfond(13) } },
    { titre: 'Reconstruction et plaque', vue: 'opAMProche',
      texte: 'Reconstruction de l’arrière vers l’avant : le fragment postéro-latéral (Volkmann) sert de repère, puis le fragment central enfoncé, le fragment médial et enfin le fragment antéro-latéral (Chaput) ; broches, greffe du vide métaphysaire, puis plaque anatomique antéro-médiale de faible épaisseur. La fibula est fixée avant ou après selon le plan. Fermeture sans tension, tendon recouvert.',
      accent: ['tibia'], danger: ['atibiale-ant', 'nfibprof', 'vsaphene'], montrer: ['plaque-am'], masquer: IMPLANTS.filter(id => id !== 'plaque-am'), ecarter: { ...amPeau(12), ...amProfond(13) } },
  ] },
  'pilon-al': { court: 'Pilon antéro-latéral', titre: 'Voie antéro-latérale du pilon tibial', fendre: fendreAvec(PEAU_AL, FOND_AL, 'médiale', 'latérale', RETINACULUMS_ANT), steps: [
    { titre: 'Installation et incision', vue: 'opAL',
      texte: 'Décubitus dorsal, coussin sous la fesse du même côté. Incision longitudinale dans l’axe du 4ᵉ rayon, centrée sur l’interligne, entre tibia et fibula en proximal. Le nerf fibulaire superficiel est juste sous la peau et croise toujours l’incision au-dessus de la cheville.',
      montrer: ['incision-al'], danger: ['nfibsup', 'nfibsup-med', 'nfibsup-int'], masquer: IMPLANTS },
    { titre: 'Peau, nerf fibulaire superficiel', vue: 'opALProche',
      texte: 'La peau est incisée seule. Le nerf fibulaire superficiel est repéré, mobilisé sur toute la longueur de l’incision et récliné ; il reste protégé jusqu’à la fermeture. Le fascia et le rétinaculum des extenseurs sont incisés dans l’axe.',
      accent: ['edl', 'fibulaire-3'], danger: ['nfibsup', 'nfibsup-med', 'nfibsup-int'], masquer: IMPLANTS, ecarter: alPeau(10) },
    { titre: 'Extenseurs réclinés en dedans', vue: 'opALProche',
      texte: 'Le long extenseur des orteils et le troisième fibulaire sont réclinés en dedans, en bloc, avec le paquet tibial antérieur et le nerf fibulaire profond, qui restent sous les muscles. Le plan internerveux est entre fibulaire superficiel et fibulaire profond. La face antéro-latérale du tibia, le fragment de Chaput, la syndesmose antérieure et le dôme du talus sont exposés.',
      accent: ['tibia', 'talus', 'ltfa'], danger: ['atibiale-ant', 'nfibprof', 'nfibsup'], masquer: IMPLANTS, ecarter: { ...alPeau(12), ...alProfond(13) } },
    { titre: 'Reconstruction et plaque', vue: 'opALProche',
      texte: 'Arthrotomie dans le trait, fragment de Chaput ouvert comme un livre sur le ligament tibio-fibulaire antérieur pour atteindre l’enfoncement central, reconstruction de l’arrière vers l’avant, puis plaque anatomique antéro-latérale en L. Cette voie couvre bien l’implant par les muscles, mais ne voit pas le coin médial : une courte incision médiale pour une plaque console complète parfois le montage.',
      accent: ['tibia'], danger: ['atibiale-ant', 'nfibprof', 'nfibsup'], montrer: ['plaque-al'], masquer: IMPLANTS.filter(id => id !== 'plaque-al'), ecarter: { ...alPeau(12), ...alProfond(13) } },
  ] },
  pm: { court: 'Postéro-médiale', titre: 'Voie postéro-médiale de la cheville', fendre: fendreAvec(PEAU_PM, FOND_PM, 'antérieure', 'postérieure', ['ret-flechisseurs']), steps: [
    { titre: 'Installation et incision', vue: 'opPM',
      texte: 'Décubitus ventral, ou dorsal avec le membre en « 4 » (hanche en rotation latérale, genou fléchi). Incision longitudinale à mi-distance du bord postérieur de la malléole médiale et du tendon calcanéen, de 8 à 10 cm.',
      montrer: ['incision-pm'], danger: ['ntibial', 'atibiale-post'], masquer: IMPLANTS },
    { titre: 'Peau et rétinaculum des fléchisseurs', vue: 'opPMProche',
      texte: 'Peau, tissu sous-cutané, puis fascia et rétinaculum des fléchisseurs sont incisés dans l’axe. D’avant en arrière : tendon du tibial postérieur, long fléchisseur des orteils, artère et veines tibiales postérieures, nerf tibial, long fléchisseur de l’hallux.',
      accent: ['tibial-post', 'fdl'], danger: ['ntibial', 'atibiale-post', 'vtibiales-post'], masquer: IMPLANTS, ecarter: pmPeau(9) },
    { titre: 'Intervalle tibial postérieur / long fléchisseur des orteils', vue: 'opPMProche',
      texte: 'Le tibial postérieur est récliné en avant, contre la malléole ; le long fléchisseur des orteils en arrière : il emmène et protège le paquet tibial postérieur et le nerf tibial, qui ne sont pas disséqués. Variante plus postérieure, pour un fragment postéro-latéral : entre le paquet et le long fléchisseur de l’hallux.',
      accent: ['tibial-post', 'fdl', 'tibia'], danger: ['ntibial', 'atibiale-post', 'vtibiales-post'], masquer: IMPLANTS, ecarter: { ...pmPeau(10), ...pmProfond(10) } },
    { titre: 'Fragment postéro-médial et plaque', vue: 'opPMProche',
      texte: 'La face postéro-médiale du tibia distal et le fragment postéro-médial, souvent solidaire de la malléole médiale (colliculus postérieur), sont exposés. Réduction sur le trait cortical, puis plaque console postéro-médiale ; par la même incision, la malléole médiale peut être vissée.',
      accent: ['tibia'], danger: ['ntibial', 'atibiale-post'], montrer: ['plaque-pm'], masquer: IMPLANTS.filter(id => id !== 'plaque-pm'), ecarter: { ...pmPeau(10), ...pmProfond(12) } },
  ] },
};

export default { nom: 'Cheville droite', graisse: 2, centre, vues, meshes, tubes, rubans, groupes, voies };
