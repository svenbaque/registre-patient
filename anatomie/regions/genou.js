// Genou et jambe droits — voie para-patellaire médiale, plateau tibial latéral, clou tibial, clou fémoral rétrograde.
// Repère BodyParts3D, en millimètres : x = latéral (-) / médial (+), y = avant (-) / arrière (+), z = vers le haut.
// Le modèle est genou en extension ; au bloc le genou est fléchi à 90° ou plus.
import pieces from './genou.pieces.js';
import { peauFendue, berges, charge, lame, deuxBerges, cote } from './outils.js';

const meshes = [
  ['peau-cuisse', 'Peau', 'peau', '#e2b596', { id: 'peau', dossier: 'models-z' }],
  ...pieces,
];

// Dans ce modèle, le tendon quadricipital et le ligament patellaire prolongent les quatre chefs du quadriceps jusqu'à la tubérosité tibiale.
// Chaque chef est coupé au-dessus de la patella : la moitié basse (« /B ») est l'appareil extenseur tendineux, de teinte nacrée.
const QUADRICEPS = ['droit-femoral', 'vaste-int', 'vaste-med', 'vaste-lat'];
const NOMS = { 'droit-femoral': 'Droit fémoral', 'vaste-int': 'Vaste intermédiaire', 'vaste-med': 'Vaste médial', 'vaste-lat': 'Vaste latéral' };
const fendre = QUADRICEPS.map(id => [id, [0, 0, 440], [0, 0, 1], NOMS[id], 'Tendon quadricipital et ligament patellaire', { couleurs: [null, '#e6e1d2'] }]);

// Tracés à la main : incision, axe du clou, clou et vis.
const PEAU_PLATEAU = [[-128, -91, 427], [-127, -101, 411], [-123, -110, 395], [-118, -115, 379], [-108, -112, 357], [-104, -110, 338], [-104, -110, 319]];
const visRateau = (n, de, a) => [`plaque-plateau/rateau${n}`, 'Vis sous-chondrale « en râteau »', 'implants', '#cfd6dd', 1.6, [de, de.map((c, i) => (c + a[i]) / 2), a]];
const visTige = (n, z, x, y) => [`plaque-plateau/vis${n}`, 'Vis corticale', 'implants', '#cfd6dd', 1.6, [[x - 1, y - 1, z], [x + 9, y + 9, z], [x + 19, y + 19, z]]];
const PEAU_LOB = [[-49, -27, 432], [-48, -27, 411], [-47, -25, 391], [-44, -19, 370], [-44, -18, 350], [-42, -14, 331]];
const PEAU_POP = [[-81, -32, 470], [-80, -28, 450], [-79, -17, 430], [-79, -8, 409], [-80, -5, 391], [-81, 5, 370], [-81, 10, 350]];
const tubes = [
  ['incision-lob', 'Incision — postéro-médiale (Lobenhoffer)', 'incisions', '#35e0c8', 1.3, PEAU_LOB.map(([x, y, z]) => [x + 1.2, y + 2.2, z])],
  ['incision-pop', 'Incision — creux poplité', 'incisions', '#35e0c8', 1.3, PEAU_POP.map(([x, y, z]) => [x, y + 2.5, z])],
  ['arthrotomie-lat', 'Arthrotomie para-patellaire latérale', 'incisions', '#35e0c8', 1, [[-97, -131, 520], [-98, -124, 490], [-99, -117, 460], [-100, -112, 440], [-106, -109, 422], [-103, -106, 402], [-96, -106, 382], [-94, -103, 358]]],
  ['arthrotomie-sub', 'Arthrotomie sub-vastus', 'incisions', '#35e0c8', 1, [[-52, -100, 452], [-60, -106, 440], [-63, -109, 422], [-65, -106, 402], [-72, -106, 382], [-72, -103, 358]]],
  ['portail-al', 'Voie d’abord arthroscopique antéro-latérale', 'incisions', '#35e0c8', 1.2, [[-101, -126, 410], [-101, -126.5, 405], [-101, -126, 400]]],
  ['portail-am', 'Voie d’abord arthroscopique antéro-médiale', 'incisions', '#35e0c8', 1.2, [[-67, -122, 410], [-67, -122.5, 405], [-67, -122, 400]]],
  ['arthroscope', 'Arthroscope (voie antéro-latérale)', 'implants', '#cfd6dd', 2, [[-110, -150, 412], [-101, -126, 406], [-90, -98, 408], [-82, -82, 410]]],
  ['arthroscope/crochet', 'Crochet palpeur (voie antéro-médiale)', 'implants', '#9fd0ff', 1.2, [[-58, -146, 410], [-67, -122, 406], [-74, -98, 406], [-78, -84, 406]]],
  ['hauban-rotule/b1', 'Broche de Kirschner', 'implants', '#cfd6dd', 0.9, [[-93, -106, 442], [-93, -106.5, 418], [-93, -104, 393]]],
  ['hauban-rotule/b2', 'Broche de Kirschner', 'implants', '#cfd6dd', 0.9, [[-77, -106, 442], [-77, -106.5, 418], [-77, -104, 393]]],
  ['hauban-rotule', 'Hauban pré-rotulien en 8', 'implants', '#dfe6ec', 0.7, [[-93, -106, 441], [-85, -118, 418], [-77, -105, 395], [-85, -101, 391.5], [-93, -105, 395], [-85, -118.6, 418], [-77, -106, 441], [-85, -103, 444], [-93, -106, 441]]],
  ...[380, 362, 344].map((z, n) => [`plaque-lob/vis${n}`, 'Vis de la plaque postéro-médiale', 'implants', '#cfd6dd', 1.6, [[-52 - (394 - z) * 0.18, -40 - (394 - z) * 0.3, z], [-60 - (394 - z) * 0.18, -56 - (394 - z) * 0.3, z], [-68 - (394 - z) * 0.18, -72 - (394 - z) * 0.3, z]]]),
  ['incision-plateau', 'Incision — antéro-latérale du plateau tibial', 'incisions', '#35e0c8', 1.3, PEAU_PLATEAU.map(([x, y, z]) => [x - 1.5, y - 1.5, z])],
  visRateau(1, [-110, -73, 395], [-50, -69, 394]), visRateau(2, [-107, -84, 395], [-48, -80, 394]), visRateau(3, [-100, -92, 395], [-52, -88, 394]),
  visTige(1, 356, -92, -99), visTige(2, 336, -91, -100), visTige(3, 316, -91, -98),
  ['axe-retro', 'Broche-guide du clou rétrograde (tracé)', 'reperes', '#7df9ff', 1.3, [[-71, -72, 368], [-73.5, -76, 392], [-76, -80, 412], [-80, -85, 450]]],
  ['retro', 'Clou fémoral rétrograde', 'implants', '#b9c2cc', 5.5, [[-76, -80, 412], [-80, -85, 450], [-86, -89, 510], [-93, -93, 575], [-100, -95, 640], [-106, -93, 700]]],
  ['retro/vis-d1', 'Vis de verrouillage distal', 'implants', '#cfd6dd', 2.3, [[-116, -80, 430], [-76, -81, 430], [-36, -82, 430]]],
  ['retro/vis-d2', 'Vis de verrouillage distal', 'implants', '#cfd6dd', 2.3, [[-110, -86, 452], [-80, -86, 452], [-52, -86, 452]]],
  ['retro/vis-p', 'Vis de verrouillage proximal (antéro-postérieure)', 'implants', '#cfd6dd', 2.3, [[-105, -112, 688], [-105, -94, 688], [-105, -77, 688]]],
  ['incision-ptg', 'Incision — antérieure médiane', 'incisions', '#35e0c8', 1.3, [[-83, -154.5, 519], [-83, -151.5, 494], [-83, -148.5, 468], [-83, -146.5, 444], [-83, -140.5, 420], [-83, -133.5, 401], [-84, -120.5, 379], [-84, -111.5, 359]]],
  ['arthrotomie', 'Arthrotomie para-patellaire médiale', 'incisions', '#35e0c8', 1, [[-81, -131, 520], [-80, -124, 490], [-79, -117, 460], [-74, -112, 440], [-63, -109, 422], [-65, -106, 402], [-72, -106, 382], [-72, -103, 358]]],
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

const rubans = [
  ['plaque-lob', 'Plaque console postéro-médiale', 'implants', '#b9c2cc', [[-49.5, -38, 395], [-53.5, -44, 375], [-56.5, -50, 355], [-60.5, -57, 337]], 10, 2.4, [0.9, -0.45, 0]],
  ['plaque-plateau', 'Plaque latérale du plateau tibial — tige', 'implants', '#b9c2cc', [[-104.5, -90.5, 392], [-97.5, -96.5, 372], [-93, -100.5, 350], [-92, -100.5, 326], [-92.5, -97.5, 304]], 12, 3, [0.7, -0.7, 0]],
  ['plaque-plateau/tete', 'Plaque latérale du plateau tibial — tête', 'implants', '#b9c2cc', [[-111.5, -71, 394], [-107.5, -84.5, 394], [-99.5, -93.5, 394]], 11, 3, [0, 0, 1]],
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
  opPtg: { de: [0, -420, 30], cible: [-84, -110, 435] }, opPtgProche: { de: [-10, -270, 20], cible: [-88, -110, 432] },
  opPlateau: { de: [-250, -250, 40], cible: [-100, -88, 372] }, opPlateauProche: { de: [-150, -150, 35], cible: [-100, -88, 375] },
  echancrure: { de: [-10, -170, -150], cible: [-76, -80, 412] }, femur: { de: [-560, -330, 0], cible: [-92, -90, 560] },
  // décubitus ventral : face postérieure du genou, cuisse en haut
  opLob: { de: [150, 300, 0], cible: [-56, -42, 382] }, opLobProche: { de: [88, 176, 0], cible: [-56, -44, 380] },
  opPop: { de: [0, 340, 20], cible: [-80, -35, 410] }, opPopProche: { de: [0, 200, 10], cible: [-80, -38, 408] },
  arthro: { de: [-10, -190, 60], cible: [-82, -92, 406] },
  op: { de: [0, -330, 45], cible: SITE }, opProche: { de: [0, -175, 30], cible: SITE },
  entree: { de: [-8, -120, 105], cible: [-80, -94, 400] },
  jambe: { de: [330, -560, 20], cible: [-78, -72, 235] }, libre: { de: [-260, -330, 90] },
};
const REPERES = ['axe-clou', 'axe-retro'];
const IMPLANTS = ['clou', 'plaque-plateau', 'retro'];
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

// ----- Voie para-patellaire médiale -----
const PEAU_PTG = [[-83, -152, 519], [-83, -149, 494], [-83, -146, 468], [-83, -144, 444], [-83, -138, 420], [-83, -131, 401], [-84, -118, 379], [-84, -109, 359]];
const PEAU_PTG_DROITE = [[-83, -152, 519], [-84, -109, 359]];
const ARTHROTOMIE = [[-74, -108, 446], [-63, -106, 422], [-65, -103, 402], [-72, -102, 382], [-72, -100, 352]];
const optsPtg = { rayon: 30, profondeur: 30 };
const ptgPeau = (dehors, dedans) => ({
  ...charge(['peau/B', 'graisse/B'], lame(PEAU_PTG_DROITE, [-1, 0, 0], FOND, dehors, dehors * 2.4 + 10, optsPtg)),
  ...charge(['peau/A', 'graisse/A'], lame(PEAU_PTG_DROITE, [1, 0, 0], FOND, dedans, dedans * 2.4 + 10, optsPtg)),
});
// L'arthrotomie longe le bord médial du tendon quadricipital, contourne la patella et suit le bord médial du ligament patellaire.
// En dehors d'elle : droit fémoral, vaste intermédiaire, vaste latéral, patella et ligament patellaire, luxés en bloc vers le dehors.
const fendrePtg = ['droit-femoral/B', 'vaste-int/B', 'vaste-med/B'].map(id => [id, { ligne: ARTHROTOMIE, fond: FOND, rayon: 26 }, 'Rétinaculum médial (collerette)', 'Appareil extenseur']);
const AXE_PATELLA = [[-86, -112, 492], [-86, -106, 418]];
const EXTENSEUR = ['droit-femoral/A', 'droit-femoral/B/B', 'vaste-int/A', 'vaste-int/B/B', 'vaste-med/B/B', 'vaste-lat', 'patella', 'retinaculum-lat'];
const VERSANT_MEDIAL = ['vaste-med/A', 'vaste-med/B/A', 'droit-femoral/B/A', 'vaste-int/B/A', 'retinaculum-med'];
const luxation = k => ({
  ...charge(EXTENSEUR, { dep: [-38 * k, 8 * k, 0], autour: AXE_PATELLA, rayon: 36 }),
  ...charge(VERSANT_MEDIAL, { dep: [10 * k, 0, 0], autour: AXE_PATELLA, rayon: 30 }),
});
const CAPSULE_OUVERTE = { capsule: { autour: [[-84, -104, 468], [-84, -102, 405]], rayon: 36 } };
const AUTRES = [...REPERES, ...IMPLANTS, 'incision-clou'];

// ----- Voie antéro-latérale du plateau tibial -----
const FOND_PLATEAU = [0.7, 0.7, 0];
const TRACTUS_GERDY = [[-112, -84, 432], [-108, -90, 405], [-103, -95, 385], [-98, -99, 366]];
const plateauOuvert = k => ({
  ...berges(PEAU_PLATEAU, FOND_PLATEAU, [10, -10, 0], k, 26),
  'tractus/A': { dep: [8 * k, -8 * k, 0], autour: TRACTUS_GERDY, rayon: 24, fond: FOND_PLATEAU }, 'tractus/B': { dep: [-8 * k, 8 * k, 0], autour: TRACTUS_GERDY, rayon: 24, fond: FOND_PLATEAU },
});
const fendrePlateau = [
  ...peauFendue(PEAU_PLATEAU, FOND_PLATEAU, 'antérieure', 'postérieure'),
  ['tractus', { ligne: TRACTUS_GERDY, fond: FOND_PLATEAU, rayon: 24 }, 'Tractus ilio-tibial — berge antérieure', 'Tractus ilio-tibial — berge postérieure'],
];
// Tibial antérieur désinséré de la face latérale du tibia, en sous-périosté, et récliné en arrière et en dehors.
const LOGE_ANTERIEURE = charge(['tibial-ant', 'edl'], lame([[-100, -97, 388], [-92, -100, 308]], [-0.7, 0.7, 0], FOND_PLATEAU, 17, 52, { rayon: 22, profondeur: 30 }));
// Arthrotomie sous-méniscale : le ligament ménisco-tibial est incisé à l'horizontale, le ménisque latéral relevé sur fils.
const SOUS_MENISCALE = { capsule: { autour: [[-111, -68, 398], [-100, -91, 398]], rayon: 9 } };
const MENISQUE_RELEVE = { 'menisque-lat': { dep: [-2, -2, 8], autour: [-104, -80, 404], rayon: 22 } };

// ----- Variantes de l'arthrotomie antérieure -----
// Sub-vastus : le vaste médial n'est pas incisé ; il est soulevé de la cloison et part en dehors avec la patella.
const EXTENSEUR_SUB = [...EXTENSEUR, 'vaste-med/A'];
const luxationSub = k => ({
  ...charge(EXTENSEUR_SUB, { dep: [-32 * k, 6 * k, 0], autour: AXE_PATELLA, rayon: 40 }),
  ...charge(['vaste-med/B/A', 'droit-femoral/B/A', 'vaste-int/B/A', 'retinaculum-med'], { dep: [10 * k, 0, 0], autour: AXE_PATELLA, rayon: 30 }),
});
// Para-patellaire latérale (Keblish) : image en miroir, la patella est luxée en dedans.
const ARTHROTOMIE_LAT = [[-100, -108, 446], [-106, -106, 422], [-103, -103, 402], [-96, -102, 382], [-94, -100, 352]];
const COTE_MED = cote(ARTHROTOMIE_LAT, FOND, [1, 0, 0]);
const COTE_LAT = COTE_MED === 'A' ? 'B' : 'A';
const fendreKeblish = ['droit-femoral/B', 'vaste-int/B', 'vaste-lat/B'].map(id => [id, { ligne: ARTHROTOMIE_LAT, fond: FOND, rayon: 26 },
  COTE_MED === 'A' ? 'Appareil extenseur' : 'Rétinaculum latéral (collerette)', COTE_MED === 'A' ? 'Rétinaculum latéral (collerette)' : 'Appareil extenseur']);
const luxationMediale = k => ({
  ...charge(['droit-femoral/A', 'vaste-int/A', 'vaste-med', 'patella', 'retinaculum-med', `droit-femoral/B/${COTE_MED}`, `vaste-int/B/${COTE_MED}`, `vaste-lat/B/${COTE_MED}`],
    { dep: [34 * k, 8 * k, 0], autour: AXE_PATELLA, rayon: 36 }),
  ...charge(['vaste-lat/A', 'retinaculum-lat', 'tractus', `droit-femoral/B/${COTE_LAT}`, `vaste-int/B/${COTE_LAT}`, `vaste-lat/B/${COTE_LAT}`], { dep: [-10 * k, 0, 0], autour: AXE_PATELLA, rayon: 30 }),
});
const keblishPeau = (dehors, dedans) => ptgPeau(dehors, dedans);

// ----- Abords postérieurs -----
const bouts = ligne => [ligne[0], ligne[ligne.length - 1]];
const peauPost = (peau, fond, versA, versB, e) => deuxBerges(peau, fond,
  { vers: versA, lame: lame(bouts(peau), versA, fond, e, e * 2.4 + 8, { rayon: 24, profondeur: 24 }) },
  { vers: versB, lame: lame(bouts(peau), versB, fond, e, e * 2.4 + 8, { rayon: 24, profondeur: 24 }) });
// Lobenhoffer : gastrocnémien médial en dehors (il protège le paquet poplité), semi-membraneux et patte d'oie en dedans.
const FOND_LOB = [-0.45, -0.9, 0];
const LOB_DEHORS = [-0.9, 0.45, 0];
const LOB_DEDANS = [0.9, -0.45, 0];
const INT_LOB = [[-50, -40, 432], [-50, -40, 330]];
const lobPeau = e => peauPost(PEAU_LOB, FOND_LOB, LOB_DEHORS, LOB_DEDANS, e);
const lobMuscles = (dehors, dedans) => ({
  ...charge(['gastro-med', 'poplite', 'soleaire'], lame(INT_LOB, LOB_DEHORS, FOND_LOB, dehors, dehors * 2.4 + 16, { rayon: 24, profondeur: 40 })),
  ...charge(['semi-membraneux', 'semi-tendineux', 'gracile', 'sartorius', 'nsaphene', 'vsaphene'], lame(INT_LOB, LOB_DEDANS, FOND_LOB, dedans, dedans * 2.4 + 12, { rayon: 24, profondeur: 40 })),
});
// Creux poplité : les deux chefs du gastrocnémien s'écartent ; le paquet poplité est mobilisé en dehors.
const FOND_POP = [0, -1, 0];
const INT_POP = [[-80, -40, 470], [-80, -28, 350]];
const popPeau = e => peauPost(PEAU_POP, FOND_POP, [1, 0, 0], [-1, 0, 0], e);
const popMuscles = e => ({
  ...charge(['gastro-med', 'semi-membraneux', 'semi-tendineux'], lame(INT_POP, [1, 0, 0], FOND_POP, e, e * 2.4 + 16, { rayon: 26, profondeur: 44 })),
  ...charge(['gastro-lat', 'biceps-long', 'biceps-court', 'nfibcommun'], lame(INT_POP, [-1, 0, 0], FOND_POP, e, e * 2.4 + 16, { rayon: 26, profondeur: 44 })),
});
const PAQUET_ECARTE = charge(['ntibial', 'apoplitee', 'vpoplitee', 'vpetite-saphene', 'sural'], { dep: [-13, 0, 0], autour: [[-80, -40, 440], [-82, -38, 370]], rayon: 40 });

const voies = {
  ptg: { court: 'Para-patellaire médiale', titre: 'Voie para-patellaire médiale (prothèse totale de genou)', fendre: [...peauFendue(PEAU_PTG, FOND, 'médiale', 'latérale'), ...fendrePtg], steps: [
    { titre: 'Installation et incision', vue: 'opPtg',
      texte: 'Décubitus dorsal, garrot à la racine de la cuisse, cale sous le pied et appui latéral pour tenir le genou fléchi à 90°. Incision cutanée antérieure médiane, longitudinale, de 5 cm au-dessus du pôle supérieur de la patella jusqu’au bord médial de la tubérosité tibiale. Le modèle est ici genou en extension.',
      montrer: ['incision-ptg'], masquer: [...AUTRES, 'arthrotomie'] },
    { titre: 'Peau et lambeau médial', vue: 'opPtgProche',
      texte: 'Peau et tissu sous-cutané sont incisés jusqu’au fascia. Le lambeau médial est levé au ras de l’appareil extenseur, juste assez pour voir le tendon quadricipital, le bord médial de la patella et le bord médial du ligament patellaire ; le lambeau latéral n’est pas décollé (vascularisation cutanée).',
      accent: ['patella', ...TENDON], masquer: [...AUTRES, 'arthrotomie'], ecarter: ptgPeau(16, 18) },
    { titre: 'Arthrotomie para-patellaire médiale', vue: 'opPtgProche',
      texte: 'L’arthrotomie part du tendon quadricipital, incisé dans son tiers médial sur 6 à 8 cm en laissant une collerette de 1 à 2 cm avec le vaste médial ; elle contourne la patella en gardant 5 mm de rétinaculum pour la suture, puis longe le bord médial du ligament patellaire jusqu’à la tubérosité tibiale, sans léser la corne antérieure du ménisque médial.',
      accent: ['arthrotomie', 'patella'], montrer: ['arthrotomie'], masquer: AUTRES, ecarter: ptgPeau(20, 22) },
    { titre: 'Patella luxée en dehors', vue: 'opPtgProche',
      texte: 'Le corps adipeux infra-patellaire est fendu ou réséqué en partie. La patella est luxée (ou éversée) en dehors, puis le genou est fléchi : tout l’appareil extenseur — droit fémoral, vaste latéral, patella, ligament patellaire — passe en dehors du condyle latéral. L’insertion du ligament patellaire sur la tubérosité est surveillée pendant toute la manœuvre : au besoin, une broche la protège.',
      accent: ['patella', 'femur'], masquer: [...AUTRES, 'arthrotomie', 'anastomose-patellaire'], ecarter: { ...ptgPeau(46, 22), ...luxation(1) } },
    { titre: 'Articulation exposée', vue: 'opPtgProche',
      texte: 'La capsule est ouverte : trochlée, condyles et plateau tibial sont exposés. Libération médiale sous-périostée de la capsule et du faisceau profond du ligament collatéral tibial sur le tibia proximal, à la demande ; résection du ligament croisé antérieur, des cornes méniscales et des ostéophytes. Les coupes osseuses peuvent commencer. Le paquet poplité est juste en arrière de la capsule postérieure.',
      accent: ['femur', 'tibia', 'lca'], danger: ['apoplitee', 'vpoplitee', 'ntibial'], masquer: [...AUTRES, 'arthrotomie', 'anastomose-patellaire', 'hoffa'],
      ecarter: { ...ptgPeau(46, 24), ...luxation(1.1) }, sectionner: CAPSULE_OUVERTE },
  ] },
  plateau: { court: 'Plateau tibial', titre: 'Voie antéro-latérale du plateau tibial', fendre: fendrePlateau, steps: [
    { titre: 'Installation et incision', vue: 'opPlateau',
      texte: 'Décubitus dorsal, coussin sous la fesse, genou fléchi à 30° sur un billot, garrot à la cuisse. Incision antéro-latérale en « crosse de hockey » : elle part de l’interligne latéral, croise le tubercule de Gerdy, puis descend 1 à 2 cm en dehors de la crête tibiale, sur la longueur de la plaque prévue.',
      montrer: ['incision-plateau'], danger: ['nfibcommun'], masquer: [...AUTRES, 'incision-ptg', 'arthrotomie'] },
    { titre: 'Peau et tractus ilio-tibial', vue: 'opPlateauProche',
      texte: 'Lambeaux cutanés épais, sans décollement. Le tractus ilio-tibial est incisé dans l’axe de ses fibres jusqu’au tubercule de Gerdy, dont sa moitié antérieure est détachée ; en distal l’incision se prolonge sur le fascia de la loge antérieure, à 1 cm de la crête.',
      accent: ['tractus', 'tibial-ant'], danger: ['nfibcommun'], masquer: [...AUTRES, 'arthrotomie'], ecarter: plateauOuvert(1) },
    { titre: 'Tibial antérieur récliné', vue: 'opPlateauProche',
      texte: 'L’origine du tibial antérieur est désinsérée de la face latérale du tibia, en sous-périosté, et réclinée en arrière et en dehors : la métaphyse latérale est exposée. En arrière, la dissection s’arrête à la tête de la fibula : le nerf fibulaire commun contourne son col, et l’artère tibiale antérieure traverse la membrane interosseuse juste en dessous.',
      accent: ['tibia', 'tibial-ant'], danger: ['nfibcommun', 'atibiale-ant', 'nfibprof'], masquer: [...AUTRES, 'arthrotomie'], ecarter: { ...plateauOuvert(1.3), ...LOGE_ANTERIEURE } },
    { titre: 'Arthrotomie sous-méniscale', vue: 'opPlateauProche',
      texte: 'Le ligament ménisco-tibial (coronaire) est incisé à l’horizontale, au ras du plateau ; le ménisque latéral, chargé sur deux ou trois fils, est relevé. Un varus forcé, genou fléchi, ouvre le compartiment : la surface articulaire et l’enfoncement sont vus directement. Une lésion du ménisque est suturée en fin d’intervention, avec la réinsertion du ligament.',
      accent: ['tibia', 'menisque-lat'], danger: ['nfibcommun', 'lcl'], masquer: [...AUTRES, 'arthrotomie', 'retinaculum-lat'],
      ecarter: { ...plateauOuvert(1.4), ...LOGE_ANTERIEURE, ...MENISQUE_RELEVE }, sectionner: SOUS_MENISCALE },
    { titre: 'Relèvement, vis en râteau et plaque', vue: 'opPlateauProche',
      texte: 'L’enfoncement est relevé en bloc par une fenêtre corticale métaphysaire, au chasse-greffon, sous contrôle de la vue et de la scopie ; le vide est comblé (greffe ou substitut). La séparation est refermée au davier. Des vis sous-chondrales parallèles à l’interligne, « en râteau », soutiennent la surface relevée ; une plaque latérale de soutien, anatomique, neutralise le fragment. Tibia translucide.',
      voiler: ['tibia'], danger: ['nfibcommun', 'atibiale-ant', 'apoplitee'], montrer: ['plaque-plateau'], masquer: [...REPERES, 'clou', 'retro', 'arthrotomie', 'retinaculum-lat'],
      ecarter: { ...plateauOuvert(1.4), ...LOGE_ANTERIEURE, ...MENISQUE_RELEVE }, sectionner: SOUS_MENISCALE },
  ] },
  retro: { court: 'Clou rétrograde', titre: 'Abord pour clou fémoral rétrograde', fendre: [...peauFendue(PEAU_INCISION, FOND, 'médiale', 'latérale'), ...fendreTendon], steps: [
    { titre: 'Installation et incision', vue: 'op',
      texte: 'Décubitus dorsal sur table radio-transparente, genou fléchi à 30° sur un billot : moins fléchi, le plateau tibial barre le passage de la broche ; plus fléchi, la patella vient devant le point d’entrée et le cartilage est menacé. Incision médiane de 2 à 3 cm sous la pointe de la patella, sur le ligament patellaire. Le modèle est ici genou en extension.',
      montrer: ['incision-clou'], danger: ['infrapatellaire'], masquer: [...REPERES, ...IMPLANTS] },
    { titre: 'Ligament patellaire', vue: 'opProche',
      texte: 'Le ligament patellaire est fendu dans l’axe de ses fibres (ou contourné par une courte arthrotomie para-patellaire médiale). Le corps adipeux infra-patellaire est traversé : on entre dans l’articulation, face à l’échancrure intercondylienne.',
      accent: [...TENDON, 'hoffa'], danger: ['infrapatellaire'], masquer: [...REPERES, ...IMPLANTS], ecarter: { ...peauOuverte(1.15), ...tendonFendu(1.1) } },
    { titre: 'Point d’entrée', vue: 'echancrure',
      texte: 'Le point d’entrée est au sommet de l’échancrure intercondylienne, à l’extrémité distale de la trochlée, juste en avant de l’insertion fémorale du ligament croisé postérieur. De face : dans l’axe du canal médullaire. De profil : juste en avant de la ligne de Blumensaat — plus en arrière, le croisé antérieur est lésé à l’alésage. Vue par en dessous, peau retirée, tibia et patella translucides.',
      accent: ['axe-retro', 'femur', 'lcp'], danger: ['lcp', 'lca'], voiler: ['tibia', 'patella'], montrer: ['axe-retro'],
      masquer: ['axe-clou', ...IMPLANTS, ...PEAU, 'hoffa', 'capsule', 'retinaculum-lat', 'retinaculum-med', 'anastomose-patellaire', 'menisque-lat', 'menisque-med', 'lig-transverse', 'tractus'],
      estomper: [...TENDON, 'tibial-ant', 'edl', 'gastro-med', 'gastro-lat', 'poplite'] },
    { titre: 'Clou et verrouillages', vue: 'femur',
      texte: 'Broche-guide à olive passée à travers le foyer réduit, alésage en protégeant le cartilage et le ligament patellaire par une douille, puis clou : son extrémité distale doit être enfouie de 3 à 5 mm sous le cartilage de l’échancrure. Verrouillage distal par le viseur, de dehors en dedans. Verrouillage proximal antéro-postérieur à main levée : le nerf fémoral et ses branches, et plus haut le paquet fémoral, sont en avant et en dedans. Peau retirée, fémur translucide.',
      voiler: ['femur'], montrer: ['retro'], masquer: [...REPERES, 'clou', 'plaque-plateau', ...PEAU, 'tractus'],
      estomper: ['vaste-lat', 'vaste-int', 'droit-femoral', 'vaste-med', 'biceps-long', 'biceps-court'] },
  ] },
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
  subvastus: { court: 'Sub-vastus', titre: 'Voies sub-vastus et mid-vastus (prothèse de genou)', fendre: [...peauFendue(PEAU_PTG, FOND, 'médiale', 'latérale'), ...fendrePtg], steps: [
    { titre: 'Incision et lambeau médial', vue: 'opPtg',
      texte: 'Même installation et même incision cutanée médiane que la voie para-patellaire médiale. Le lambeau médial est levé plus loin, jusqu’à voir le bord inférieur du vaste médial oblique et la cloison intermusculaire médiale.',
      montrer: ['incision-ptg'], masquer: REPERES, ecarter: ptgPeau(16, 26) },
    { titre: 'Sous le vaste médial', vue: 'opPtgProche',
      texte: 'Sub-vastus : le fascia est incisé au bord inférieur du vaste médial oblique, dont les fibres sont décollées au doigt de la cloison intermusculaire, de bas en haut, sans les couper ; l’arthrotomie part de là, contourne le bord médial de la patella et longe le ligament patellaire. Le tendon quadricipital reste intact. Mid-vastus : le vaste médial oblique est fendu dans le sens de ses fibres sur 3 à 4 cm, à partir de l’angle supéro-médial de la patella. Les vaisseaux géniculés descendants et le nerf saphène sont en arrière de la cloison.',
      accent: ['vaste-med', 'patella'], montrer: ['arthrotomie-sub'], danger: ['nsaphene'], masquer: REPERES, ecarter: ptgPeau(18, 30) },
    { titre: 'Patella subluxée en dehors', vue: 'opPtgProche',
      texte: 'Le vaste médial est soulevé par un écarteur et part en dehors avec la patella, qui est subluxée sans être éversée. L’exposition est plus étroite que par la voie para-patellaire — elle se discute chez l’obèse, le genou raide ou très musclé — mais l’appareil extenseur et la vascularisation de la patella sont respectés.',
      accent: ['patella', 'femur', 'vaste-med'], masquer: [...REPERES, 'anastomose-patellaire', 'hoffa'], ecarter: { ...ptgPeau(40, 30), ...luxationSub(1) }, sectionner: CAPSULE_OUVERTE },
  ] },
  keblish: { court: 'Para-patellaire latérale', titre: 'Voie para-patellaire latérale (Keblish)', fendre: [...peauFendue(PEAU_PTG, FOND, 'médiale', 'latérale'), ...fendreKeblish], steps: [
    { titre: 'Incision', vue: 'opPtg',
      texte: 'Indication : le genu valgum fixé, où les structures à libérer sont latérales. Incision cutanée antérieure médiane ou légèrement latérale. Le lambeau latéral est levé jusqu’au bord latéral de l’appareil extenseur.',
      montrer: ['incision-ptg'], masquer: REPERES, ecarter: keblishPeau(22, 16) },
    { titre: 'Arthrotomie para-patellaire latérale', vue: 'opPtgProche',
      texte: 'L’arthrotomie longe le bord latéral du tendon quadricipital, contourne la patella et suit le bord latéral du ligament patellaire jusqu’au tubercule de Gerdy. Elle est faite en deux plans décalés (rétinaculum superficiel, puis capsule et synoviale, en gardant le corps adipeux pédiculé) : après correction du valgus, la capsule ne se referme pas bord à bord et c’est ce lambeau qui comble l’espace.',
      accent: ['patella', 'retinaculum-lat'], montrer: ['arthrotomie-lat'], danger: ['agenic-inf-lat'], masquer: REPERES, ecarter: keblishPeau(26, 18) },
    { titre: 'Patella luxée en dedans', vue: 'opPtgProche',
      texte: 'La patella est luxée en dedans ; si le ligament patellaire est en tension, la tubérosité tibiale est relevée par une ostéotomie. La libération latérale est progressive : tractus ilio-tibial, capsule postéro-latérale, puis si besoin ligament collatéral fibulaire et tendon du poplité. Le nerf fibulaire commun, étiré par la correction d’un grand valgus, est surveillé au réveil.',
      accent: ['patella', 'femur', 'tibia'], danger: ['nfibcommun'], masquer: [...REPERES, 'anastomose-patellaire', 'hoffa'], ecarter: { ...keblishPeau(26, 44), ...luxationMediale(1) }, sectionner: CAPSULE_OUVERTE },
  ] },
  rotule: { court: 'Antérieure médiane', titre: 'Voie antérieure médiane (patella, appareil extenseur)', fendre: peauFendue(PEAU_PTG, FOND, 'médiale', 'latérale'), steps: [
    { titre: 'Installation et incision', vue: 'opPtg',
      texte: 'Décubitus dorsal, genou sur un coussin, garrot. Incision longitudinale médiane centrée sur la patella (l’incision transversale, plus esthétique, compromet les abords futurs). Les rameaux infra-patellaires du nerf saphène croisent le bas de l’incision.',
      montrer: ['incision-ptg'], danger: ['infrapatellaire'], masquer: REPERES },
    { titre: 'Patella et ailerons', vue: 'opPtgProche',
      texte: 'Le plan est direct : peau, tissu sous-cutané, bourse pré-patellaire, puis l’os. Les lambeaux sont levés au ras de l’appareil extenseur. La brèche des ailerons rotuliens, de part et d’autre du foyer, est explorée et permet de contrôler au doigt la surface articulaire ; l’articulation est lavée.',
      accent: ['patella', 'retinaculum-med', 'retinaculum-lat'], danger: ['infrapatellaire'], masquer: REPERES, ecarter: ptgPeau(22, 22) },
    { titre: 'Haubanage', vue: 'opPtgProche',
      texte: 'Réduction au davier à pointes, genou en extension, contrôlée sur la corticale antérieure et au doigt sur le cartilage. Deux broches parallèles longitudinales, à mi-épaisseur, puis un cerclage en 8 passé au ras des pôles, sous le tendon quadricipital et le ligament patellaire, croisé sur la face antérieure : il transforme la traction du quadriceps en compression lors de la flexion. Suture des ailerons. Patella translucide.',
      accent: ['hauban-rotule'], voiler: ['patella'], montrer: ['hauban-rotule'], masquer: REPERES, ecarter: ptgPeau(22, 22) },
  ] },
  lobenhoffer: { court: 'Postéro-médiale', titre: 'Voie postéro-médiale du plateau tibial (Lobenhoffer)', fendre: peauFendue(PEAU_LOB, FOND_LOB, 'latérale', 'médiale'), steps: [
    { titre: 'Installation et incision', vue: 'opLob',
      texte: 'Décubitus ventral, genou légèrement fléchi sur un coussin. Incision longitudinale de 6 à 8 cm le long du bord médial du chef médial du gastrocnémien, à partir du pli de flexion. La grande veine saphène et le nerf saphène sont plus en avant.',
      montrer: ['incision-lob'], danger: ['vsaphene', 'nsaphene'], masquer: REPERES },
    { titre: 'Peau et fascia', vue: 'opLobProche',
      texte: 'Peau, tissu sous-cutané, puis fascia. Le bord médial du gastrocnémien médial est repéré ; en dedans de lui, le tendon du semi-membraneux et les tendons de la patte d’oie.',
      accent: ['gastro-med', 'semi-membraneux'], danger: ['vsaphene', 'nsaphene'], masquer: REPERES, ecarter: lobPeau(10) },
    { titre: 'Intervalle gastrocnémien médial / semi-membraneux', vue: 'opLobProche',
      texte: 'Le gastrocnémien médial est récliné en dehors : sa masse protège le paquet poplité et le nerf tibial, qu’on ne dissèque pas. Le semi-membraneux et la patte d’oie sont réclinés en dedans. Au fond, le muscle poplité est décollé du tibia de dedans en dehors, en sous-périosté : le fragment postéro-médial et son bec cortical sont exposés.',
      accent: ['tibia', 'gastro-med', 'semi-membraneux', 'poplite'], danger: ['apoplitee', 'vpoplitee', 'ntibial'], masquer: REPERES, ecarter: { ...lobPeau(12), ...lobMuscles(13, 9) } },
    { titre: 'Plaque console', vue: 'opLobProche',
      texte: 'Réduction par extension du genou et poussée directe sur le bec du fragment, puis plaque console postéro-médiale (anti-glissement) : la première vis, juste sous la pointe du fragment, le repousse vers le haut et l’avant. Pas d’arthrotomie : la réduction se lit sur la corticale et sous scopie.',
      accent: ['tibia'], danger: ['apoplitee', 'vpoplitee', 'ntibial'], montrer: ['plaque-lob'], masquer: REPERES, ecarter: { ...lobPeau(12), ...lobMuscles(13, 9) } },
  ] },
  poplite: { court: 'Creux poplité', titre: 'Voie postérieure du creux poplité', fendre: peauFendue(PEAU_POP, FOND_POP, 'médiale', 'latérale'), steps: [
    { titre: 'Installation et incision', vue: 'opPop',
      texte: 'Décubitus ventral. Incision en S allongé pour ne pas croiser le pli de flexion à angle droit : branche proximale au bord du biceps, traversée oblique du pli, branche distale au bord médial du mollet. Elle est ici figurée sur la ligne médiane.',
      montrer: ['incision-pop'], danger: ['vpetite-saphene', 'sural'], masquer: REPERES },
    { titre: 'Fascia poplité, petite veine saphène', vue: 'opPopProche',
      texte: 'Sous la peau, la petite veine saphène et le nerf cutané sural médial, sur la ligne médiane, sont le fil conducteur : le nerf, suivi vers le haut à travers le fascia, mène au nerf tibial. Le fascia poplité est incisé en dedans de la veine.',
      accent: ['gastro-med', 'gastro-lat'], danger: ['vpetite-saphene', 'sural', 'ntibial'], masquer: REPERES, ecarter: popPeau(12) },
    { titre: 'Losange poplité', vue: 'opPopProche',
      texte: 'Les bords du losange sont dégagés : semi-membraneux et gastrocnémien médial en dedans, biceps et gastrocnémien latéral en dehors. Le nerf fibulaire commun longe le bord médial du biceps. Dans l’axe, de la superficie à la profondeur : nerf tibial, veine poplitée, artère poplitée, plaquée contre la capsule.',
      accent: ['gastro-med', 'gastro-lat'], danger: ['ntibial', 'vpoplitee', 'apoplitee', 'nfibcommun'], masquer: REPERES, ecarter: { ...popPeau(15), ...popMuscles(13) } },
    { titre: 'Capsule postérieure', vue: 'opPopProche',
      texte: 'Le paquet poplité est mobilisé — il faut lier les vaisseaux géniculés moyens et souvent une géniculée inférieure — puis récliné sur un lacs. Le chef médial du gastrocnémien peut être désinséré pour gagner du jour. La capsule postérieure est ouverte : insertion tibiale du ligament croisé postérieur, bord postérieur des plateaux.',
      accent: ['tibia', 'lcp', 'capsule'], danger: ['ntibial', 'vpoplitee', 'apoplitee', 'nfibcommun'], masquer: REPERES,
      ecarter: { ...popPeau(15), ...popMuscles(16), ...PAQUET_ECARTE }, sectionner: { capsule: { autour: [[-90, -42, 420], [-70, -42, 392]], rayon: 16 } } },
  ] },
  arthro: { court: 'Arthroscopie', titre: 'Voies d’abord arthroscopiques du genou', steps: [
    { titre: 'Installation et repères', vue: 'opPtg',
      texte: 'Décubitus dorsal, garrot, genou fléchi à 90° pendant sur un étrier ou contre un appui latéral. Repères tracés genou fléchi : pointe de la patella, bords du ligament patellaire, interligne. Les deux voies de base sont de part et d’autre du ligament patellaire, juste au-dessus de l’interligne, dans le « point mou ». Le modèle est ici genou en extension.',
      montrer: ['portail-al', 'portail-am'], masquer: REPERES },
    { titre: 'Voie antéro-latérale : l’optique', vue: 'arthro',
      texte: 'Incision de 6 à 8 mm au ras du bord latéral du ligament patellaire, un travers de doigt au-dessus de l’interligne, lame vers le haut pour épargner le ménisque. Trocart mousse dirigé vers l’échancrure, puis glissé dans le cul-de-sac sous-quadricipital en étendant le genou. Exploration systématique : cul-de-sac, fémoro-patellaire, rampes, compartiment médial, échancrure, compartiment latéral (position en « 4 »).',
      accent: ['arthroscope'], montrer: ['portail-al', 'portail-am', 'arthroscope'], masquer: ['arthroscope/crochet', ...REPERES] },
    { titre: 'Voie antéro-médiale : les instruments', vue: 'arthro',
      texte: 'Elle est repérée à l’aiguille sous contrôle de la vue, pour que l’instrument atteigne la lésion sans buter sur le condyle : plus basse pour une corne postérieure du ménisque médial, plus haute pour l’échancrure. Le crochet palpeur teste les ménisques et les ligaments croisés. Peau retirée, patella translucide.',
      accent: ['arthroscope', 'lca', 'menisque-med', 'menisque-lat'], voiler: ['patella'], montrer: ['arthroscope'],
      masquer: [...REPERES, ...PEAU, 'hoffa', 'capsule', 'retinaculum-lat', 'retinaculum-med', 'anastomose-patellaire', 'tractus'], estomper: [...QUADRICEPS] },
    { titre: 'Voies accessoires', vue: 'arthro',
      texte: 'Supéro-latérale ou supéro-médiale (lavage, corps étranger, patella) ; trans-tendineuse centrale ; postéro-médiale et postéro-latérale, créées de dedans en dehors sous contrôle de la vue par transillumination, genou fléchi à 90° — en arrière de ces voies : la veine et le nerf saphènes en dedans, le nerf fibulaire commun en dehors, derrière le biceps.',
      accent: ['lca', 'lcp', 'menisque-med', 'menisque-lat'], danger: ['nfibcommun', 'nsaphene', 'vsaphene', 'apoplitee'], voiler: ['patella'], montrer: ['arthroscope'],
      masquer: [...REPERES, ...PEAU, 'hoffa', 'capsule', 'retinaculum-lat', 'retinaculum-med', 'anastomose-patellaire', 'tractus'], estomper: [...QUADRICEPS] },
  ] },
};

export default { nom: 'Genou et jambe droits', graisse: 4, centre, vues, meshes, fendre, tubes, rubans, groupes, voies };
