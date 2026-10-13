// Jambe droite — aponévrotomies des quatre loges (deux incisions) et abord médial mini-invasif du tibia distal.
// Repère BodyParts3D, en millimètres : x = latéral (-) / médial (+), y = avant (-) / arrière (+), z = vers le haut.
import pieces from './genou.pieces.js';
import { peauFendue, berges, charge, lame, deuxBerges } from './outils.js';

const meshes = [
  ['peau-jambe', 'Peau', 'peau', '#e2b596', { id: 'peau', dossier: 'models-z' }],
  ...pieces,
];

// Lignes d'incision relevées sur la peau.
const PEAU_AL = [[-129, -95, 333], [-130, -95, 301], [-127, -93, 266], [-123, -89, 230], [-117, -85, 195], [-110, -80, 160], [-103, -75, 129]];
const FOND_AL = [0.8, 0.6, 0];
const PEAU_PM = [[-38, -33, 337], [-32, -29, 298], [-35, -30, 267], [-37, -31, 231], [-46, -38, 196], [-50, -42, 161], [-51, -42, 130]];
const FOND_PM = [-0.8, -0.6, 0];
const PEAU_MIPO = [[-59, -68, 118], [-59, -69, 100], [-55, -70, 84], [-51, -71, 72]];
const FOND_MIPO = [-1, 0.25, 0];

const visMipo = (n, x, y, z) => [`plaque-mipo/vis${n}`, 'Vis verrouillée', 'implants', '#cfd6dd', 1.6, [[x + 2, y, z], [x - 10, y + 1, z], [x - 22, y + 2, z]]];
// ----- Abords diaphysaires : tibia antéro-latéral, fibula, tibia postéro-latéral -----
const PEAU_TIB = [[-99, -110, 331], [-97, -105, 299], [-96, -104, 269], [-91, -96, 239], [-91, -95, 211], [-86, -86, 180], [-85, -82, 150]];
const FOND_TIB = [0.45, 0.89, 0];
const PEAU_FIB = [[-142, -42, 331], [-144, -42, 301], [-141, -42, 268], [-141, -43, 241], [-133, -45, 210], [-127, -47, 179], [-124, -48, 151]];
const FOND_FIB = [0.95, -0.3, 0];
const visDir = (id, n, de, dir, l) => [`${id}/vis${n}`, 'Vis corticale', 'implants', '#cfd6dd', 1.7, [de, de.map((c, i) => c + dir[i] * l / 2), de.map((c, i) => c + dir[i] * l)]];
const tubes = [
  ['incision-tib', 'Incision — antéro-latérale du tibia', 'incisions', '#35e0c8', 1.3, PEAU_TIB.map(([x, y, z]) => [x - 1, y - 2, z])],
  ['incision-fib', 'Incision — latérale de la fibula', 'incisions', '#35e0c8', 1.3, PEAU_FIB.map(([x, y, z]) => [x - 2.2, y + 0.7, z])],
  ...[312, 292, 272, 232, 212, 192].map((z, n) => visDir('plaque-tib', n, [-93.5 + (330 - z) * 0.02, -89.5 + (330 - z) * 0.085, z], [0.85, 0.5, 0], 24)),
  ...[305, 285, 265, 225, 205].map((z, n) => visDir('plaque-fib', n, [-116 + (330 - z) * 0.045, -50 + (330 - z) * 0.02, z], [0.95, -0.3, 0], 11)),
  ...[288, 264, 240, 216].map((z, n) => visDir('plaque-tibpost', n, [-83.5, -62 - (300 - z) * 0.02, z], [0, -1, 0], 26)),
  ['incision-al', 'Incision antéro-latérale', 'incisions', '#35e0c8', 1.3, PEAU_AL.map(([x, y, z]) => [x - 1.6, y - 1.2, z])],
  ['incision-pm', 'Incision postéro-médiale', 'incisions', '#35e0c8', 1.3, PEAU_PM.map(([x, y, z]) => [x + 1.6, y + 1.2, z])],
  ['incision-mipo', 'Incision médiale distale', 'incisions', '#35e0c8', 1.3, PEAU_MIPO.map(([x, y, z]) => [x + 2, y - 0.5, z])],
  visMipo(1, -65, -73, 222), visMipo(2, -64.5, -72, 206), visMipo(3, -64, -71, 190), visMipo(4, -58, -64, 122), visMipo(5, -54, -63, 108), visMipo(6, -50, -62, 95), visMipo(7, -47.5, -62, 86),
];
const rubans = [
  ['plaque-tib', 'Plaque latérale du tibia', 'implants', '#b9c2cc', [[-93.5, -90.5, 322], [-92.5, -87.5, 282], [-91.5, -84.5, 242], [-90.5, -80.5, 204], [-90, -77, 176]], 12, 3.2, [-0.5, 0.85, 0]],
  ['plaque-fib', 'Plaque de la fibula', 'implants', '#b9c2cc', [[-116.5, -50.5, 318], [-115, -50, 284], [-113.5, -49.5, 250], [-112, -48, 216], [-110, -47.5, 190]], 8, 2, [0.3, 0.95, 0]],
  ['plaque-tibpost', 'Plaque postérieure du tibia', 'implants', '#b9c2cc', [[-83, -60.5, 300], [-83, -62.5, 262], [-84.5, -63, 224], [-85.5, -61.5, 196]], 10, 3, [1, 0, 0]],
  ['plaque-mipo', 'Plaque médiale du tibia distal', 'implants', '#b9c2cc', [[-65.5, -74, 230], [-64.5, -72, 192], [-63, -68, 156], [-58.5, -64, 126], [-50.5, -62, 100], [-45.5, -62, 82]], 11, 2.6, [0, 1, 0]],
];

const groupes = [
  ['peau', 'Peau'], ['graisse', 'Tissu sous-cutané'], ['os', 'Os'], ['jambe', 'Loges antérieure et latérale'], ['mollet', 'Loges postérieures'], ['quadriceps', 'Quadriceps'], ['cuisse', 'Muscles de la cuisse'],
  ['ligaments', 'Capsule, ménisques et ligaments'], ['vaisseaux', 'Artères et veines'], ['nerfs', 'Nerfs'], ['incisions', 'Incisions'], ['implants', 'Plaque et vis'],
];

const centre = [-80, -70, 250];
const vues = {
  // décubitus dorsal : l'opérateur regarde la face antéro-latérale de la jambe, genou en haut
  opAL: { de: [-300, -230, 0], cible: [-105, -78, 232] }, opALProche: { de: [-200, -150, 0], cible: [-105, -78, 232] },
  // membre en rotation latérale, genou fléchi : face postéro-médiale, genou en haut
  opPM: { de: [290, 215, 0], cible: [-58, -48, 234] }, opPMProche: { de: [190, 140, 0], cible: [-60, -50, 234] },
  opTib: { de: [-140, -290, 0], cible: [-90, -92, 240] }, opTibProche: { de: [-88, -180, 0], cible: [-90, -92, 240] },
  opFib: { de: [-300, 70, 0], cible: [-114, -48, 240] }, opFibProche: { de: [-185, 45, 0], cible: [-114, -48, 240] },
  opPL: { de: [-240, 200, 0], cible: [-100, -54, 240] }, opPLProche: { de: [-150, 125, 0], cible: [-98, -56, 240] },
  opMipo: { de: [330, -90, 0], cible: [-60, -68, 150] }, opMipoProche: { de: [190, -50, 0], cible: [-56, -66, 100] },
  libre: { de: [-300, -250, 60] },
};
const IMPLANTS = ['plaque-mipo', 'plaque-tib', 'plaque-fib', 'plaque-tibpost'];
const DECOR = ['tractus'];

// Aponévrotomie : la peau est laissée largement ouverte ; les muscles, libérés de leur fascia, font hernie dans la plaie.
const alOuvert = k => ({
  ...berges(PEAU_AL, FOND_AL, [10, -13, 0], k, 34),
  ...charge(['tibial-ant', 'edl', 'ehl', 'fibulaire-long', 'fibulaire-court'], { dep: [-4 * k, -3 * k, 0], autour: PEAU_AL, rayon: 30, fond: FOND_AL }),
});
const pmOuvert = k => ({
  ...berges(PEAU_PM, FOND_PM, [-10, 13, 0], k, 34),
  // la grande veine saphène et le nerf saphène restent dans la berge antérieure
  ...charge(['vsaphene', 'nsaphene'], { dep: [9 * k, -12 * k, 0], autour: PEAU_PM, rayon: 34, fond: FOND_PM }),
});
// Le soléaire est désinséré du bord postéro-médial du tibia (« pont soléaire ») et récliné en arrière avec le gastrocnémien médial.
const LAME_SOLEAIRE = { lame: [[-52, -46, 335], [-56, -42, 132]], pousse: [-0.35, 0.94, 0], course: 46, rayon: 30, fond: FOND_PM, profondeur: 50 };
const LOGE_SUPERFICIELLE_RECLINEE = charge(['soleaire', 'gastro-med'], LAME_SOLEAIRE);
const PONT_SOLEAIRE = { soleaire: { autour: [[-68, -64, 335], [-66, -58, 225]], rayon: 11 } };

const mipoOuvert = k => ({
  ...berges(PEAU_MIPO, FOND_MIPO, [0, -9, 0], k, 18),
  ...charge(['vsaphene', 'nsaphene'], { dep: [0, -8 * k, 0], autour: PEAU_MIPO, rayon: 22, fond: FOND_MIPO }),
});

// ----- Abords diaphysaires -----
const bouts = ligne => [ligne[0], ligne[ligne.length - 1]];
const peauLames = (peau, fond, versA, versB, eA, eB) => deuxBerges(peau, fond,
  { vers: versA, lame: lame(bouts(peau), versA, fond, eA, eA * 2.4 + 8, { rayon: 26, profondeur: 22 }) },
  { vers: versB, lame: lame(bouts(peau), versB, fond, eB, eB * 2.4 + 8, { rayon: 26, profondeur: 22 }) });
// tibia : la loge antérieure est décollée de la face latérale et réclinée en dehors et en arrière
const TIB_DEHORS = [-0.89, 0.45, 0];
const TIB_DEDANS = [0.89, -0.45, 0];
const tibPeau = e => peauLames(PEAU_TIB, FOND_TIB, TIB_DEHORS, TIB_DEDANS, e, e * 0.6);
const LOGE_ANT_RECLINEE = charge(['tibial-ant', 'edl', 'ehl', 'atibiale-ant', 'nfibprof', 'vtibiales-ant'], lame([[-88, -99, 332], [-80, -83, 150]], TIB_DEHORS, FOND_TIB, 16, 56, { rayon: 26, profondeur: 34 }));
// fibula : entre les fibulaires (en avant) et le soléaire (en arrière)
const FIB_AVANT = [-0.3, -0.95, 0];
const FIB_ARRIERE = [0.3, 0.95, 0];
const INT_FIB = [[-119, -41, 332], [-109, -43, 150]];
const fibPeau = e => peauLames(PEAU_FIB, FOND_FIB, FIB_AVANT, FIB_ARRIERE, e, e);
const fibMuscles = (avant, arriere, profondeur = 30) => ({
  ...charge(['fibulaire-long', 'fibulaire-court', 'nfibsup'], lame(INT_FIB, FIB_AVANT, FOND_FIB, avant, avant * 2.4 + 16, { rayon: 26, profondeur: 30 })),
  ...charge(['soleaire', 'gastro-lat', 'fhl'], lame(INT_FIB, FIB_ARRIERE, FOND_FIB, arriere, arriere * 2.4 + 16, { rayon: 26, profondeur })),
});
// postéro-latérale : le long fléchisseur de l'hallux et le tibial postérieur sont décollés de la fibula et de la membrane, jusqu'au tibia
const VERS_TIBIA = charge(['fhl', 'tibial-post', 'soleaire', 'gastro-lat', 'afibulaire'], lame([[-112, -44, 332], [-104, -44, 150]], [0.6, 0.8, 0], [0.8, -0.6, 0], 26, 76, { rayon: 26, profondeur: 52 }));
const plPeau = () => peauLames(PEAU_FIB, FOND_FIB, FIB_AVANT, FIB_ARRIERE, 10, 30);

const voies = {
  'loges-al': { court: 'Loges : antéro-latérale', titre: 'Aponévrotomies — incision antéro-latérale (loges antérieure et latérale)', fendre: peauFendue(PEAU_AL, FOND_AL, 'antérieure', 'postérieure'), steps: [
    { titre: 'Incision antéro-latérale', vue: 'opAL',
      texte: 'Syndrome des loges de jambe : aponévrotomie des quatre loges par deux incisions, en urgence. La première, antéro-latérale, longue de 15 à 20 cm, est à mi-distance de la crête tibiale et de la fibula, en regard de la cloison intermusculaire antérieure. Des incisions courtes ne décompriment pas : la peau elle-même est un garrot.',
      montrer: ['incision-al'], danger: ['nfibsup'], masquer: [...IMPLANTS, ...DECOR] },
    { titre: 'Peau et fascia', vue: 'opALProche',
      texte: 'La peau et le tissu sous-cutané sont incisés jusqu’au fascia, sans décollement. Une courte incision transversale du fascia repère la cloison intermusculaire antérieure, qui sépare la loge antérieure de la loge latérale. Le nerf fibulaire superficiel perfore le fascia au tiers distal, près de la cloison : il est vu avant d’être coupé.',
      accent: ['tibial-ant', 'fibulaire-long'], danger: ['nfibsup'], masquer: [...IMPLANTS, ...DECOR], ecarter: alOuvert(0.6) },
    { titre: 'Loge antérieure', vue: 'opALProche',
      texte: 'Le fascia de la loge antérieure est fendu aux ciseaux sur toute la longueur de la jambe, en avant de la cloison, à mi-chemin de la crête tibiale : en haut vers le tubercule de Gerdy, en bas vers le rétinaculum des extenseurs. Le tibial antérieur et les extenseurs font hernie. Au fond de la loge : le nerf fibulaire profond et l’artère tibiale antérieure.',
      accent: ['tibial-ant', 'edl', 'ehl'], danger: ['nfibsup', 'nfibprof', 'atibiale-ant'], masquer: [...IMPLANTS, ...DECOR], ecarter: alOuvert(1) },
    { titre: 'Loge latérale', vue: 'opALProche',
      texte: 'Le fascia de la loge latérale est fendu en arrière de la cloison, dans l’axe de la fibula : en haut vers la tête de la fibula, en bas vers la malléole latérale, les ciseaux pointés en arrière pour s’éloigner du nerf fibulaire superficiel. Les fibulaires font hernie. La vitalité des muscles est appréciée (couleur, consistance, contractilité, saignement). La peau est laissée ouverte.',
      accent: ['fibulaire-long', 'fibulaire-court'], danger: ['nfibsup', 'nfibcommun'], masquer: [...IMPLANTS, ...DECOR], ecarter: alOuvert(1.2) },
  ] },
  'loges-pm': { court: 'Loges : postéro-médiale', titre: 'Aponévrotomies — incision postéro-médiale (loges postérieures)', fendre: peauFendue(PEAU_PM, FOND_PM, 'postérieure', 'antérieure'), steps: [
    { titre: 'Incision postéro-médiale', vue: 'opPM',
      texte: 'La seconde incision, de même longueur, est 2 cm en arrière du bord postéro-médial du tibia. Elle garde avec la première un pont cutané d’au moins 7 cm. La grande veine saphène et le nerf saphène longent le bord médial du tibia : ils sont repérés et réclinés en avant.',
      montrer: ['incision-pm'], danger: ['vsaphene', 'nsaphene'], masquer: [...IMPLANTS, ...DECOR] },
    { titre: 'Loge postérieure superficielle', vue: 'opPMProche',
      texte: 'Le fascia qui recouvre le gastrocnémien médial et le soléaire est fendu sur toute sa longueur : la loge postérieure superficielle est décomprimée.',
      accent: ['gastro-med', 'soleaire'], danger: ['vsaphene', 'nsaphene'], masquer: [...IMPLANTS, ...DECOR], ecarter: pmOuvert(1) },
    { titre: 'Pont soléaire et loge postérieure profonde', vue: 'opPMProche',
      texte: 'La loge profonde n’est superficielle qu’au tiers distal. Plus haut, elle est cachée par le soléaire : son insertion tibiale (le « pont soléaire ») est désinsérée du bord postéro-médial du tibia, et le muscle récliné en arrière. Le fascia profond est alors fendu sur le long fléchisseur des orteils, sur toute la longueur. Une loge profonde mal ouverte est la première cause d’échec. Le nerf tibial et le paquet tibial postérieur sont juste sous ce fascia.',
      accent: ['fdl', 'tibial-post', 'soleaire'], danger: ['ntibial', 'atibiale-post', 'vtibiales-post', 'vsaphene', 'nsaphene'], masquer: [...IMPLANTS, ...DECOR],
      ecarter: { ...pmOuvert(1.25), ...LOGE_SUPERFICIELLE_RECLINEE }, sectionner: PONT_SOLEAIRE },
    { titre: 'Contrôle et suites', vue: 'opPMProche',
      texte: 'Les quatre loges sont vérifiées au doigt sur toute leur longueur. Les muscles franchement nécrosés sont excisés ; le reste est revu à 48 heures. Les incisions sont laissées ouvertes (lacets élastiques ou pansement à pression négative) ; fermeture secondaire ou greffe de peau entre le 5ᵉ et le 7ᵉ jour. Une fracture associée est stabilisée dans le même temps.',
      accent: ['fdl', 'tibial-post', 'fhl'], danger: ['ntibial', 'atibiale-post'], masquer: [...IMPLANTS, ...DECOR],
      ecarter: { ...pmOuvert(1.25), ...LOGE_SUPERFICIELLE_RECLINEE }, sectionner: PONT_SOLEAIRE },
  ] },
  mipo: { court: 'MIPO tibia distal', titre: 'Abord médial mini-invasif du tibia distal (MIPO)', fendre: peauFendue(PEAU_MIPO, FOND_MIPO, 'antérieure', 'postérieure'), steps: [
    { titre: 'Installation et incision', vue: 'opMipo',
      texte: 'Décubitus dorsal sur table radio-transparente, coussin sous la fesse opposée ou membre en légère rotation latérale. La réduction est obtenue d’abord, à foyer fermé (traction, distracteur, daviers percutanés), et contrôlée sous scopie. Incision de 3 à 4 cm sur la face médiale du tibia distal, au-dessus de la malléole médiale.',
      montrer: ['incision-mipo'], danger: ['vsaphene', 'nsaphene'], masquer: [...IMPLANTS, ...DECOR] },
    { titre: 'Peau, veine saphène', vue: 'opMipoProche',
      texte: 'La grande veine saphène et le nerf saphène croisent le champ : ils sont repérés et réclinés en avant. L’incision va jusqu’au périoste, qui est respecté : le tunnel sera extra-périosté.',
      accent: ['tibia'], danger: ['vsaphene', 'nsaphene'], masquer: [...IMPLANTS, ...DECOR], ecarter: mipoOuvert(1) },
    { titre: 'Tunnel sous-cutané et plaque', vue: 'opMipo',
      texte: 'Un tunnel est créé au décolleur entre le périoste et le tissu sous-cutané, le long de la face médiale du tibia. La plaque anatomique, préformée, y est glissée de bas en haut ; son extrémité proximale est retrouvée par une contre-incision. Position contrôlée de face et de profil. La peau est ici translucide.',
      accent: ['plaque-mipo'], voiler: ['peau', 'graisse'], danger: ['vsaphene', 'nsaphene'], montrer: ['plaque-mipo'], masquer: [...DECOR, 'plaque-mipo/vis1', 'plaque-mipo/vis2', 'plaque-mipo/vis3', 'plaque-mipo/vis4', 'plaque-mipo/vis5', 'plaque-mipo/vis6', 'plaque-mipo/vis7'], ecarter: mipoOuvert(1) },
    { titre: 'Vissage percutané', vue: 'opMipo',
      texte: 'Plaque en pont : vis épiphysaires verrouillées par l’incision distale, vis diaphysaires par de courtes incisions sur les trous, en espaçant les vis près du foyer (montage élastique). Dissection mousse jusqu’à la plaque à chaque incision proximale : la veine et le nerf saphènes longent toute la face médiale. Longueur, axe et rotation sont comparés au côté sain avant le verrouillage. Peau et tibia translucides.',
      accent: ['plaque-mipo'], voiler: ['peau', 'graisse', 'tibia'], danger: ['vsaphene', 'nsaphene'], montrer: ['plaque-mipo'], masquer: DECOR, ecarter: mipoOuvert(1) },
  ] },
  tibia: { court: 'Tibia antéro-latéral', titre: 'Voie antéro-latérale du tibia', fendre: peauFendue(PEAU_TIB, FOND_TIB, 'latérale', 'médiale'), steps: [
    { titre: 'Installation et incision', vue: 'opTib',
      texte: 'Décubitus dorsal, coussin sous la fesse, garrot. Incision longitudinale 1 cm en dehors de la crête tibiale, centrée sur le foyer ; elle ne passe jamais sur la crête ni sur la face médiale, sous-cutanée et mal vascularisée.',
      montrer: ['incision-tib'], masquer: [...IMPLANTS, ...DECOR] },
    { titre: 'Peau et fascia', vue: 'opTibProche',
      texte: 'Peau et tissu sous-cutané sont incisés d’un trait, sans décollement. Le fascia de la loge antérieure est ouvert à 5 mm de la crête, en laissant un liseré pour la suture — ou laissé ouvert si la loge est tendue.',
      accent: ['tibial-ant', 'tibia'], masquer: [...IMPLANTS, ...DECOR], ecarter: tibPeau(11) },
    { titre: 'Tibial antérieur récliné', vue: 'opTibProche',
      texte: 'Le tibial antérieur est décollé de la face latérale du tibia, en extra-périosté, et récliné en dehors et en arrière avec toute la loge antérieure. Le paquet tibial antérieur et le nerf fibulaire profond, sur la membrane interosseuse, partent avec les muscles : les écarteurs restent au contact de l’os.',
      accent: ['tibia', 'tibial-ant'], danger: ['atibiale-ant', 'nfibprof'], masquer: [...IMPLANTS, ...DECOR], ecarter: { ...tibPeau(13), ...LOGE_ANT_RECLINEE } },
    { titre: 'Réduction et plaque', vue: 'opTibProche',
      texte: 'Le foyer est exposé avec un dépériostage minimal. Réduction, vis de traction si le trait s’y prête, puis plaque sur la face latérale, recouverte par le tibial antérieur. La plaque latérale est mieux protégée que la plaque médiale, sous-cutanée ; elle reste une alternative au clou pour les fractures métaphysaires.',
      accent: ['tibia'], danger: ['atibiale-ant', 'nfibprof'], montrer: ['plaque-tib'], masquer: [...IMPLANTS.filter(id => id !== 'plaque-tib'), ...DECOR], ecarter: { ...tibPeau(13), ...LOGE_ANT_RECLINEE } },
  ] },
  fibula: { court: 'Fibula', titre: 'Voie latérale de la fibula', fendre: peauFendue(PEAU_FIB, FOND_FIB, 'antérieure', 'postérieure'), steps: [
    { titre: 'Installation et incision', vue: 'opFib',
      texte: 'Décubitus dorsal avec un coussin sous la fesse, ou décubitus latéral. Incision longitudinale sur la ligne qui joint la tête de la fibula à la malléole latérale, légèrement en arrière de l’os, centrée sur le foyer. Deux nerfs encadrent la voie : le fibulaire commun autour du col, en haut ; le fibulaire superficiel, qui perfore le fascia au tiers distal.',
      montrer: ['incision-fib'], danger: ['nfibcommun', 'nfibsup'], masquer: [...IMPLANTS, ...DECOR] },
    { titre: 'Peau et fascia', vue: 'opFibProche',
      texte: 'Peau et tissu sous-cutané, puis fascia sur le bord postérieur des muscles fibulaires. En haut de l’incision, le nerf fibulaire commun est repéré au bord postérieur du tendon du biceps avant toute dissection du col.',
      accent: ['fibulaire-long', 'soleaire'], danger: ['nfibcommun', 'nfibsup'], masquer: [...IMPLANTS, ...DECOR], ecarter: fibPeau(10) },
    { titre: 'Intervalle fibulaires / soléaire', vue: 'opFibProche',
      texte: 'Plan internerveux : les fibulaires (nerf fibulaire superficiel) sont réclinés en avant, le soléaire et le long fléchisseur de l’hallux (nerf tibial) en arrière. Les fibres musculaires sont décollées de la fibula de bas en haut, dans le sens où elles se détachent sans s’arracher.',
      accent: ['fibula', 'fibulaire-long', 'soleaire'], danger: ['nfibcommun', 'nfibsup', 'afibulaire'], masquer: [...IMPLANTS, ...DECOR], ecarter: { ...fibPeau(12), ...fibMuscles(10, 8) } },
    { titre: 'Réduction et plaque', vue: 'opFibProche',
      texte: 'La fibula est exposée sur la longueur utile. Plaque tiers-de-tube ou plaque de reconstruction sur la face latérale ou postéro-latérale, trois vis bicorticales de part et d’autre. La longueur et la rotation de la fibula conditionnent la mortaise tibio-fibulaire.',
      accent: ['fibula'], danger: ['nfibsup', 'afibulaire'], montrer: ['plaque-fib'], masquer: [...IMPLANTS.filter(id => id !== 'plaque-fib'), ...DECOR], ecarter: { ...fibPeau(12), ...fibMuscles(10, 8) } },
  ] },
  pl: { court: 'Tibia postéro-latéral', titre: 'Voie postéro-latérale du tibia (Harmon)', fendre: peauFendue(PEAU_FIB, FOND_FIB, 'antérieure', 'postérieure'), steps: [
    { titre: 'Installation et incision', vue: 'opPL',
      texte: 'Décubitus ventral ou latéral. Incision longitudinale sur le bord postérieur de la fibula. C’est la voie des pseudarthroses et des greffes du tibia quand la peau antérieure est compromise : on atteint la face postérieure du tibia en passant par la fibula et la membrane interosseuse.',
      montrer: ['incision-fib'], danger: ['nfibcommun', 'sural', 'vpetite-saphene'], masquer: [...IMPLANTS, ...DECOR] },
    { titre: 'Intervalle fibulaires / soléaire', vue: 'opPLProche',
      texte: 'Même intervalle que pour la fibula : fibulaires en avant, gastrocnémien latéral, soléaire et long fléchisseur de l’hallux en arrière. Le soléaire est désinséré de la fibula.',
      accent: ['fibula', 'soleaire', 'fhl'], danger: ['nfibcommun', 'afibulaire'], masquer: [...IMPLANTS, ...DECOR], ecarter: { ...fibPeau(12), ...fibMuscles(8, 10) } },
    { titre: 'Jusqu’à la face postérieure du tibia', vue: 'opPLProche',
      texte: 'Le long fléchisseur de l’hallux est décollé de la face postérieure de la fibula, puis le tibial postérieur de la membrane interosseuse, en restant au contact de l’os et de la membrane : l’artère fibulaire, sur la fibula, et le paquet tibial postérieur avec le nerf tibial restent dans la masse musculaire réclinée en arrière et en dedans. La face postérieure du tibia est atteinte.',
      accent: ['tibia', 'fibula', 'membrane'], danger: ['afibulaire', 'ntibial', 'atibiale-post'], masquer: [...IMPLANTS, ...DECOR], ecarter: { ...plPeau(), ...fibMuscles(8, 22, 50), ...VERS_TIBIA } },
    { titre: 'Greffe et plaque postérieure', vue: 'opPLProche',
      texte: 'Le foyer est avivé, greffé (greffe inter-tibio-fibulaire en pont si besoin) et stabilisé par une plaque postérieure. L’enveloppe musculaire postérieure, épaisse et bien vascularisée, recouvre le tout.',
      accent: ['tibia'], danger: ['afibulaire', 'ntibial', 'atibiale-post'], montrer: ['plaque-tibpost'], masquer: [...IMPLANTS.filter(id => id !== 'plaque-tibpost'), ...DECOR], ecarter: { ...plPeau(), ...fibMuscles(8, 22, 50), ...VERS_TIBIA } },
  ] },
};

export default { nom: 'Jambe droite', graisse: 3, centre, vues, meshes, tubes, rubans, groupes, voies };
