// Jambe droite — aponévrotomies des quatre loges (deux incisions) et abord médial mini-invasif du tibia distal.
// Repère BodyParts3D, en millimètres : x = latéral (-) / médial (+), y = avant (-) / arrière (+), z = vers le haut.
import pieces from './genou.pieces.js';
import { peauFendue, berges, charge } from './outils.js';

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
const tubes = [
  ['incision-al', 'Incision antéro-latérale', 'incisions', '#35e0c8', 1.3, PEAU_AL.map(([x, y, z]) => [x - 1.6, y - 1.2, z])],
  ['incision-pm', 'Incision postéro-médiale', 'incisions', '#35e0c8', 1.3, PEAU_PM.map(([x, y, z]) => [x + 1.6, y + 1.2, z])],
  ['incision-mipo', 'Incision médiale distale', 'incisions', '#35e0c8', 1.3, PEAU_MIPO.map(([x, y, z]) => [x + 2, y - 0.5, z])],
  visMipo(1, -65, -73, 222), visMipo(2, -64.5, -72, 206), visMipo(3, -64, -71, 190), visMipo(4, -58, -64, 122), visMipo(5, -54, -63, 108), visMipo(6, -50, -62, 95), visMipo(7, -47.5, -62, 86),
];
const rubans = [
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
  opMipo: { de: [330, -90, 0], cible: [-60, -68, 150] }, opMipoProche: { de: [190, -50, 0], cible: [-56, -66, 100] },
  libre: { de: [-300, -250, 60] },
};
const IMPLANTS = ['plaque-mipo'];
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
};

export default { nom: 'Jambe droite', graisse: 3, centre, vues, meshes, tubes, rubans, groupes, voies };
