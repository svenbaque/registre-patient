// Cheville droite — abords des malléoles latérale et médiale, voie postéro-latérale.
// Repère BodyParts3D, en millimètres : x = latéral (-) / médial (+), y = avant (-) / arrière (+), z = vers le haut.
import pieces from './cheville.pieces.js';
import { peauFendue, berges, charge, lame } from './outils.js';

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
const tubes = [
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
  libre: { de: [-250, -300, 90] },
};
const IMPLANTS_LAT = ['plaque', 'vis-syndesmose'];
const IMPLANTS_MED = ['vis-mm1', 'vis-mm2'];
const IMPLANTS = [...IMPLANTS_LAT, ...IMPLANTS_MED, 'plaque-post'];

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
};

export default { nom: 'Cheville droite', graisse: 2, centre, vues, meshes, tubes, rubans, groupes, voies };
