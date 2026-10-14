// Rachis — voies postérieure médiane, paramédiane de Wiltse, antérieure cervicale, thoraco-phréno-lombotomie et rétropéritonéale latérale.
// Repère BodyParts3D, en millimètres : x = droite (-) / gauche (+), y = avant (-) / arrière (+), z = vers le haut.
// Modèle Z-Anatomy (CC BY-SA 4.0) ; les viscères (poumons, reins, péritoine, trachée, œsophage, thyroïde) ne sont pas représentés.
import pieces from './rachis.pieces.js';
import { peauFendue, berges, charge, lame, deuxBerges } from './outils.js';

const meshes = [
  ['peau-rachis', 'Peau', 'peau', '#e2b596', { id: 'peau', dossier: 'models-z' }],
  ...pieces,
];
// ----- Lignes d'incision relevées sur la peau -----
const PEAU_POST = [[0, -13, 1005], [0, -12, 990], [0, -10, 975], [0, -8, 960], [0, -6, 945], [0, -3, 932], [0, -1, 922]];
const PEAU_WI = [[-40, -8, 1004], [-40, -9, 988], [-40, -8, 980], [-40, -7, 972], [-40, -5, 964], [-40, -4, 956], [-40, -3, 948], [-40, -2, 940]];
const PEAU_CERV = [[-3, -141, 1408], [-12, -140, 1408], [-21, -136, 1408], [-30, -131, 1408], [-38, -128, 1408], [-45, -123, 1408]];
const PEAU_TPL = [[-105, 3, 1127], [-120, -13, 1116], [-132, -30, 1105], [-138, -49, 1087], [-140, -71, 1070], [-141, -89, 1056], [-142, -106, 1046], [-140, -124, 1028], [-130, -148, 1022], [-116, -168, 1019]];
const PEAU_XL = [[-147, -99, 996], [-147, -91, 990], [-147, -82, 980], [-146, -74, 968]];
const FOND_POST = [0, -1, 0];
const FOND_CERV = [0.15, 0.99, 0];
const FOND_LAT = [1, 0, 0];
const FOND_TPL = [0.85, 0.25, 0];

const decale = (ligne, d) => ligne.map(([x, y, z]) => [x + d[0], y + d[1], z + d[2]]);
const vis = (id, nom, de, a, r = 2.6) => [id, nom, 'implants', '#cfd6dd', r, [de, de.map((c, i) => (c + a[i]) / 2), a]];
const miroir = ([x, y, z]) => [-x, y, z];
const VIS_POST = [[[-24, -52, 977], [-8, -98, 975]], [[-27, -48, 946], [-10, -94, 943]]];
const tubes = [
  ['incision-post', 'Incision — voie postérieure médiane', 'incisions', '#35e0c8', 1.6, decale(PEAU_POST, [0, 2, 0])],
  ['incision-wiltse', 'Incision — voie paramédiane de Wiltse', 'incisions', '#35e0c8', 1.6, decale(PEAU_WI, [0, 2, 0])],
  ['incision-cerv', 'Incision — voie antérieure cervicale', 'incisions', '#35e0c8', 1.3, decale(PEAU_CERV, [0, -2, 0])],
  ['incision-tpl', 'Incision — thoraco-phréno-lombotomie', 'incisions', '#35e0c8', 1.8, decale(PEAU_TPL, [-2, 0, 0])],
  ['incision-xlif', 'Incision — voie latérale rétropéritonéale', 'incisions', '#35e0c8', 1.6, decale(PEAU_XL, [-2, 0, 0])],
  ...VIS_POST.map(([de, a], n) => vis(`vis-post/d${n}`, 'Vis pédiculaire', de, a)), ...VIS_POST.map(([de, a], n) => vis(`vis-post/g${n}`, 'Vis pédiculaire', miroir(de), miroir(a))),
  ['tige-post/d', 'Tige', 'implants', '#b9c2cc', 2.8, [[-26, -47, 986], [-27, -45, 962], [-29, -43, 938]]],
  ['tige-post/g', 'Tige', 'implants', '#b9c2cc', 2.8, [[26, -47, 986], [27, -45, 962], [29, -43, 938]]],
  ...[[6, 1421], [-6, 1421], [6, 1396], [-6, 1396]].map(([x, z], n) => vis(`plaque-cerv/vis${n}`, 'Vis', [x, -99, z], [x * 0.7, -80, z], 1.6)),
  ['cage-xlif', 'Cage intersomatique latérale', 'implants', '#7fb3d5', 6, [[-24, -97, 983], [-2, -97, 983], [20, -97, 983]]],
  ['cage-tpl', 'Cage de corporectomie', 'implants', '#7fb3d5', 9, [[-4, -86, 1078], [-4, -86, 1056], [-4, -86, 1034]]],
  ...[[1097, -78], [1097, -95], [1018, -80], [1018, -97]].map(([z, y], n) => vis(`plaque-tpl/vis${n}`, 'Vis', [-28, y, z], [12, y + 4, z], 2.4)),
];
const rubans = [
  ['plaque-cerv', 'Plaque cervicale antérieure', 'implants', '#b9c2cc', [[0, -99, 1428], [0, -100.5, 1408], [0, -99, 1388]], 16, 2, [1, 0, 0]],
  ['cage-cerv', 'Cage intersomatique', 'implants', '#7fb3d5', [[-7, -91, 1409], [7, -91, 1409]], 7, 7, [0, 0, 1]],
  ['plaque-tpl', 'Plaque latérale', 'implants', '#b9c2cc', [[-27, -86, 1104], [-26, -86, 1070], [-25, -88, 1036], [-25, -88, 1012]], 22, 3, [0, 1, 0]],
];
const groupes = [
  ['peau', 'Peau'], ['graisse', 'Tissu sous-cutané'], ['os', 'Os'], ['dos', 'Muscles du dos'], ['profonds', 'Psoas, carré des lombes, diaphragme'], ['paroi', 'Paroi abdominale et thoracique'],
  ['cou', 'Muscles du cou'], ['ligaments', 'Disques et ligaments'], ['vaisseaux', 'Artères et veines'], ['nerfs', 'Moelle, racines et nerfs'], ['incisions', 'Incisions'], ['implants', 'Implants'],
];
const centre = [0, -40, 1000];
const vues = {
  // décubitus ventral : l'opérateur regarde le dos, tête du patient en haut de l'écran
  opPost: { de: [80, 420, 60], cible: [0, -30, 965] }, opPostProche: { de: [45, 250, 40], cible: [0, -45, 962] },
  opWi: { de: [-90, 400, 40], cible: [-30, -30, 965] }, opWiProche: { de: [-60, 240, 30], cible: [-30, -45, 962] },
  // décubitus dorsal, tête en extension et tournée du côté opposé ; abord par la droite
  opCerv: { de: [-200, -300, 60], cible: [-15, -112, 1408] }, opCervProche: { de: [-70, -210, -20], cible: [-8, -100, 1408] },
  // décubitus latéral gauche (côté droit en haut) : vue latérale droite
  opTpl: { de: [-430, -80, 40], cible: [-70, -70, 1070] }, opTplProche: { de: [-290, -60, 30], cible: [-40, -78, 1065] },
  opXl: { de: [-390, -30, 10], cible: [-60, -88, 983] }, opXlProche: { de: [-310, -20, 5], cible: [-40, -92, 983] },
  libre: { de: [-300, 400, 100] },
};
const VIS_TIGES = ['vis-post/d0', 'vis-post/d1', 'vis-post/g0', 'vis-post/g1', 'tige-post/d', 'tige-post/g'];
const IMPLANTS = [...VIS_TIGES, 'plaque-cerv', 'cage-cerv', 'cage-xlif', 'cage-tpl', 'plaque-tpl', ...[0, 1, 2, 3].flatMap(n => [`plaque-cerv/vis${n}`, `plaque-tpl/vis${n}`])];

const bouts = ligne => [ligne[0], ligne[ligne.length - 1]];
const lames = (ligne, fond, versA, versB, e, options, ids) => deuxBerges(ligne, fond,
  { vers: versA, lame: lame(bouts(ligne), versA, fond, e, e * 2.2 + 8, options) },
  { vers: versB, lame: lame(bouts(ligne), versB, fond, e, e * 2.2 + 8, options) }, ids);
const DROITE = [-1, 0, 0];
const GAUCHE = [1, 0, 0];

// ----- Postérieure médiane : désinsertion sous-périostée bilatérale des muscles paravertébraux -----
const postPeau = e => lames(PEAU_POST, FOND_POST, DROITE, GAUCHE, e, { rayon: 22, profondeur: 30 });
const LIGNE_EPINEUSES = [[0, -30, 1008], [0, -30, 922]];
const postMuscles = e => ({
  ...charge(['multifide', 'longissimus', 'iliocostal', 'fascia-tl', 'grand-dorsal'], lame(LIGNE_EPINEUSES, DROITE, FOND_POST, e, e * 2.4 + 12, { rayon: 22, profondeur: 50 })),
  ...charge(['multifide-g', 'longissimus-g', 'iliocostal-g', 'fascia-tl-g', 'grand-dorsal-g'], lame(LIGNE_EPINEUSES, GAUCHE, FOND_POST, e, e * 2.4 + 12, { rayon: 22, profondeur: 50 })),
});
const FASCIA_POST = { 'fascia-tl': { autour: [[-6, -22, 1008], [-6, -22, 922]], rayon: 5 }, 'fascia-tl-g': { autour: [[6, -22, 1008], [6, -22, 922]], rayon: 5 } };
const LAMINECTOMIE = {
  ...FASCIA_POST,
  l4: { autour: [[0, -45, 988], [0, -47, 958]], rayon: 17 },
  jaunes: { autour: [[0, -58, 992], [0, -58, 945]], rayon: 13 },
  'inter-epineux': { autour: [[0, -32, 995], [0, -36, 945]], rayon: 9 }, 'supra-epineux': { autour: [[0, -30, 995], [0, -34, 945]], rayon: 9 },
};

// ----- Wiltse : entre multifide (en dedans) et longissimus (en dehors) -----
const wiPeau = e => lames(PEAU_WI, FOND_POST, DROITE, GAUCHE, e, { rayon: 18, profondeur: 26 });
// aponévrose du grand dorsal et fascia thoraco-lombaire, ouverts sur la même ligne
const wiFascia = e => lames(PEAU_WI, FOND_POST, DROITE, GAUCHE, e, { rayon: 18, profondeur: 50 }, ['grand-dorsal', 'fascia-tl']);
const LIGNE_WI = [[-38, -24, 1004], [-38, -24, 940]];
const wiMuscles = e => ({
  ...charge(['multifide', 'longissimus'], lame(LIGNE_WI, GAUCHE, FOND_POST, e, e * 2.4 + 10, { rayon: 18, profondeur: 45 })),
  ...charge(['iliocostal'], lame(LIGNE_WI, DROITE, FOND_POST, e, e * 2.4 + 10, { rayon: 18, profondeur: 45 })),
});

// ----- Antérieure cervicale (Cloward, Smith-Robinson) -----
const HAUT = [0, 0, 1];
const BAS = [0, 0, -1];
const cervPeau = e => lames(PEAU_CERV, FOND_CERV, HAUT, BAS, e, { rayon: 14, profondeur: 14 }, ['peau', 'graisse', 'platysma']);
const LIGNE_CERV = [[-22, -122, 1432], [-22, -122, 1384]];
const cervIntervalle = e => ({
  ...charge(['scm', 'carotide', 'jugulaire', 'vague', 'thyroid-sup-v'], lame(LIGNE_CERV, DROITE, [0, 1, 0], e, e * 2.4 + 8, { rayon: 18, profondeur: 32 })),
  ...charge(['sternohyoidien', 'sternothyroidien', 'omohyoidien', 'thyroide', 'cricoide'], lame(LIGNE_CERV, GAUCHE, [0, 1, 0], e, e * 2.4 + 8, { rayon: 18, profondeur: 36 })),
});
const LONG_COU = {
  'long-cou': lame([[-2, -97, 1428], [-2, -97, 1390]], DROITE, [0, 1, 0], 5, 16, { rayon: 12, profondeur: 10 }),
  'long-cou-g': lame([[2, -97, 1428], [2, -97, 1390]], GAUCHE, [0, 1, 0], 5, 16, { rayon: 12, profondeur: 10 }),
};
const DISCECTOMIE = { 'd-c5c6': { autour: [[-9, -92, 1409], [9, -92, 1409]], rayon: 6 }, lla: { autour: [[-9, -97, 1409], [9, -97, 1409]], rayon: 6 } };

// ----- Thoraco-phréno-lombotomie droite, sur la 10e côte -----
const tplPeau = d => berges(PEAU_TPL, FOND_TPL, [0, 0, d], 1, 26);
const PAROI_TPL = Object.fromEntries(['grand-dorsal', 'dentele-post-inf', 'oblique-ext', 'oblique-int', 'transverse', 'intercostaux-ext', 'intercostaux-int'].map(id => [id, { autour: PEAU_TPL.map(([x, y, z]) => [x + 10, y + (y > -100 ? 0 : 6), z - 6]), rayon: 9 }]));
// fenêtre profonde : à travers le lit de la côte, les muscles de la paroi sont ouverts largement
const PAROI_TPL_LARGE = Object.fromEntries(Object.entries(PAROI_TPL).map(([id, s]) => [id, { ...s, rayon: 24 }]));
const COTE_RESEQUEE = { cote10: { autour: [[-70, -19, 1131], [-85, -26, 1114], [-100, -37, 1103], [-110, -52, 1088], [-121, -70, 1071], [-125, -85, 1058], [-125, -100, 1043], [-121, -115, 1030]], rayon: 9 }, cart10: { autour: [[-121, -115, 1030], [-112, -135, 1040]], rayon: 9 } };
const DIAPHRAGME = { diaphragme: { autour: [[-110, -45, 1095], [-116, -70, 1078], [-116, -100, 1058], [-110, -135, 1045]], rayon: 14 } };
const DIAPHRAGME_LARGE = { diaphragme: { autour: [[-100, -50, 1092], [-60, -70, 1080], [-30, -80, 1070], [-60, -100, 1060], [-100, -110, 1050]], rayon: 30 } };
const CORPORECTOMIE = { l1: { autour: [[-6, -90, 1076], [-6, -90, 1036]], rayon: 15 }, 'd-t12l1': { autour: [[-6, -88, 1084], [6, -88, 1084]], rayon: 8 }, 'd-l1l2': { autour: [[-6, -92, 1050], [6, -92, 1050]], rayon: 8 } };
const PSOAS_RECLINE = { psoas: { dep: [-6, -14, 0], autour: [[-25, -80, 1100], [-30, -85, 1020]], rayon: 22 } };

// ----- Latérale rétropéritonéale trans-psoas (XLIF / DLIF) -----
const AVANT = [0, -0.75, -0.66];
const ARRIERE = [0, 0.75, 0.66];
const xlPeau = e => lames(PEAU_XL, FOND_LAT, AVANT, ARRIERE, e, { rayon: 14, profondeur: 20 });
// les trois muscles larges, dissociés sur la ligne de l'incision : chaque moitié suit sa berge
const PAROI_XL = ['oblique-ext', 'oblique-int', 'transverse'];
const xlParoi = e => lames(PEAU_XL, FOND_LAT, AVANT, ARRIERE, e, { rayon: 14, profondeur: 45 }, PAROI_XL);
const TRANS_PSOAS = { psoas: { autour: [[-64, -94, 983], [-25, -94, 983]], rayon: 9 }, 'd-l3l4': { autour: [[-24, -97, 983], [18, -97, 983]], rayon: 7 } };

const voies = {
  post: { court: 'Postérieure', titre: 'Voie postérieure médiane lombaire', fendre: peauFendue(PEAU_POST, FOND_POST, 'droite', 'gauche'), steps: [
    { titre: 'Installation et incision', vue: 'opPost',
      texte: 'Vue de l’opérateur : décubitus ventral sur cadre ou appuis thoraciques et iliaques, ventre libre (moins de saignement veineux épidural). Le niveau est repéré à la scopie avant l’incision. Incision médiane sur la ligne des épineuses, ici de L3 au sacrum pour une arthrodèse L4-L5.',
      montrer: ['incision-post'], masquer: IMPLANTS },
    { titre: 'Fascia thoraco-lombaire', vue: 'opPostProche',
      texte: 'Le tissu sous-cutané est ouvert jusqu’au fascia thoraco-lombaire, nacré. Le fascia est incisé de part et d’autre des épineuses, en gardant le ligament supra-épineux et les ligaments inter-épineux des niveaux non opérés (on ne fusionne pas ce qu’on n’ouvre pas).',
      accent: ['fascia-tl', 'fascia-tl-g', 'supra-epineux'], sectionner: FASCIA_POST, masquer: IMPLANTS, ecarter: postPeau(16) },
    { titre: 'Désinsertion sous-périostée', vue: 'opPostProche',
      texte: 'Les muscles paravertébraux (multifide en premier) sont désinsérés en sous-périosté des épineuses puis des lames, à la rugine et au bistouri électrique, jusqu’au bord latéral des articulaires. Pour une arthrodèse postéro-latérale, on poursuit jusqu’aux processus transverses. On respecte la capsule des articulaires du niveau sus-jacent. L’écarteur autostatique doit être relâché régulièrement (ischémie musculaire).',
      accent: ['l4', 'l5', 'multifide', 'multifide-g'], danger: ['queue-cheval'], sectionner: FASCIA_POST, masquer: IMPLANTS, ecarter: { ...postPeau(26), ...postMuscles(26) } },
    { titre: 'Laminectomie L4', vue: 'opPostProche',
      texte: 'Décompression : épineuse et lame de L4 sont réséquées, le ligament jaune est enlevé de proche en proche ; on libère latéralement les récessus et les foramens par arthrectomie partielle, en gardant au moins la moitié de chaque articulaire (sinon instabilité). Le sac dural et les racines sont protégés au crochet ; une brèche durale est suturée immédiatement.',
      accent: ['dure-mere', 'queue-cheval'], danger: ['dure-mere', 'racines-post', 'racines-ant'], sectionner: LAMINECTOMIE, masquer: IMPLANTS, ecarter: { ...postPeau(26), ...postMuscles(26) } },
    { titre: 'Vis pédiculaires et tiges', vue: 'opPostProche',
      texte: 'Point d’entrée à la jonction du processus transverse et de l’articulaire supérieure (base du processus articulaire) ; la pointe chemine dans le pédicule, convergente de 10 à 15° en dedans, parallèle au plateau, sous contrôle scopique. On palpe les quatre murs du trajet avant de visser. Les tiges, cintrées en lordose, sont serrées en compression ; décortication et greffe sur les transverses ou cage intersomatique (PLIF, TLIF).',
      accent: VIS_TIGES, voiler: ['l4', 'l5'], montrer: VIS_TIGES, danger: ['racines-ant', 'dure-mere'], sectionner: LAMINECTOMIE, ecarter: { ...postPeau(26), ...postMuscles(26) } },
  ] },
  wiltse: { court: 'Wiltse', titre: 'Voie paramédiane de Wiltse', fendre: [...peauFendue(PEAU_WI, FOND_POST, 'latérale', 'médiale'),
    ['grand-dorsal', { ligne: PEAU_WI, fond: FOND_POST, rayon: 40 }, 'Grand dorsal (aponévrose) — berge latérale', 'Grand dorsal (aponévrose) — berge médiale'],
    ['fascia-tl', { ligne: PEAU_WI, fond: FOND_POST, rayon: 40 }, 'Fascia thoraco-lombaire — berge latérale', 'Fascia thoraco-lombaire — berge médiale']], steps: [
    { titre: 'Installation et incision', vue: 'opWi',
      texte: 'Vue de l’opérateur : décubitus ventral. Incision longitudinale à environ 4 cm de la ligne médiane, en regard des pédicules (repérés à la scopie). Elle peut être faite des deux côtés ; ici à droite. Voie des vis pédiculaires, des fusions postéro-latérales et des hernies foraminales et extra-foraminales, sans désinsertion de la ligne médiane.',
      montrer: ['incision-wiltse'], masquer: IMPLANTS },
    { titre: 'Fascia thoraco-lombaire', vue: 'opWiProche',
      texte: 'Le fascia thoraco-lombaire est incisé longitudinalement. Au doigt, on trouve le plan de clivage naturel entre le multifide en dedans et le longissimus en dehors, souvent marqué par une petite graisse et des branches vasculaires.',
      accent: ['fascia-tl', 'multifide', 'longissimus'], masquer: IMPLANTS, ecarter: { ...wiPeau(12), ...wiFascia(9) } },
    { titre: 'Intervalle multifide / longissimus', vue: 'opWiProche',
      texte: 'L’intervalle est ouvert au doigt jusqu’à l’articulaire et la base du processus transverse : le multifide est récliné en dedans, le longissimus en dehors. Le rameau médial de la branche dorsale (innervation du multifide) et l’artère qui l’accompagne sont respectés autant que possible : c’est l’intérêt de la voie, qui dénerve et dévascularise moins que l’abord médian.',
      accent: ['l4', 'l5'], masquer: IMPLANTS, ecarter: { ...wiPeau(14), ...wiFascia(12), ...wiMuscles(12) } },
    { titre: 'Vis pédiculaires', vue: 'opWiProche',
      texte: 'Le point d’entrée pédiculaire est vu directement, au bord latéral de l’articulaire ; l’angle de convergence est facile à donner puisque la voie est déjà latérale. Tige courte, sertie en compression. La fermeture se limite au fascia.',
      accent: ['vis-post/d0', 'vis-post/d1', 'tige-post/d'], voiler: ['l4', 'l5'], montrer: ['vis-post/d0', 'vis-post/d1', 'tige-post/d'], ecarter: { ...wiPeau(14), ...wiFascia(12), ...wiMuscles(12) } },
  ] },
  cervicale: { court: 'Cervicale antérieure', titre: 'Voie antérieure du rachis cervical (Smith-Robinson / Cloward)', fendre: [...peauFendue(PEAU_CERV, FOND_CERV, 'crâniale', 'caudale'),
    ['platysma', { ligne: PEAU_CERV, fond: FOND_CERV, rayon: 18 }, 'Platysma — berge crâniale', 'Platysma — berge caudale']], steps: [
    { titre: 'Installation et incision', vue: 'opCerv',
      texte: 'Vue de l’opérateur : décubitus dorsal, billot sous les épaules, tête en légère extension tournée du côté opposé. Incision transversale dans un pli du cou, de la ligne médiane jusqu’au-delà du bord antérieur du sterno-cléido-mastoïdien, à la hauteur du disque visé (C5-C6 : cartilage cricoïde). Trachée, œsophage et thyroïde ne sont pas représentés sur ce modèle.',
      montrer: ['incision-cerv'], danger: ['jugulaire'], masquer: IMPLANTS },
    { titre: 'Platysma', vue: 'opCervProche',
      texte: 'Le platysma est sectionné dans l’axe de l’incision (ou dissocié) ; on décolle sous lui vers le haut et vers le bas pour donner du jeu. Le fascia cervical superficiel est ouvert le long du bord antérieur du sterno-cléido-mastoïdien.',
      accent: ['scm', 'platysma'], danger: ['jugulaire'], masquer: IMPLANTS, ecarter: cervPeau(12) },
    { titre: 'Entre gaine carotidienne et axe viscéral', vue: 'opCervProche',
      texte: 'Dissection au doigt, mousse, dans le plan entre le sterno-cléido-mastoïdien et la gaine carotidienne (artère carotide commune, veine jugulaire interne, nerf vague), réclinés en dehors, et les muscles infra-hyoïdiens avec l’axe trachéo-œsophagien et la thyroïde, réclinés en dedans. L’omo-hyoïdien croise le champ en C6 ; il est récliné ou sectionné. Le nerf laryngé récurrent, du côté droit, croise plus obliquement : on évite toute traction excessive.',
      accent: ['carotide', 'jugulaire', 'sternohyoidien'], danger: ['carotide', 'jugulaire', 'vague'], masquer: IMPLANTS, ecarter: { ...cervPeau(14), ...cervIntervalle(14) } },
    { titre: 'Disque C5-C6', vue: 'opCervProche',
      texte: 'Le fascia prévertébral est incisé sur la ligne médiane, le niveau contrôlé à la scopie (aiguille dans le disque). Les muscles longs du cou sont désinsérés de chaque côté et chargés sous les valves de l’écarteur autostatique, qui protègent la chaîne sympathique (syndrome de Claude Bernard-Horner) et l’œsophage. Discectomie complète jusqu’au ligament longitudinal postérieur, ouvert si une hernie est passée en arrière ; l’artère vertébrale est latérale, au-delà des processus unciformes.',
      accent: ['d-c5c6', 'c5', 'c6', 'long-cou'], danger: ['vertebrale', 'sympathique', 'dure-mere'], sectionner: DISCECTOMIE, masquer: IMPLANTS, ecarter: { ...cervPeau(16), ...cervIntervalle(20), ...LONG_COU } },
    { titre: 'Cage et plaque', vue: 'opCervProche',
      texte: 'Après distraction (broches de Caspar), préparation des plateaux, cage intersomatique (arthrodèse ACDF) ou prothèse discale. Plaque antérieure vissée dans les deux corps, ses extrémités à distance des disques adjacents. Fermeture du platysma ; drain selon les habitudes. Surveillance du saignement : un hématome compressif est une urgence.',
      accent: ['plaque-cerv', 'cage-cerv'], montrer: ['plaque-cerv', 'cage-cerv', ...[0, 1, 2, 3].map(n => `plaque-cerv/vis${n}`)], danger: ['vertebrale'], sectionner: DISCECTOMIE, ecarter: { ...cervPeau(16), ...cervIntervalle(20), ...LONG_COU } },
  ] },
  tpl: { court: 'Thoraco-phréno-lombotomie', titre: 'Thoraco-phréno-lombotomie (abord de la charnière thoraco-lombaire)', fendre: peauFendue(PEAU_TPL, FOND_TPL, 'crâniale', 'caudale'), steps: [
    { titre: 'Installation et incision', vue: 'opTpl',
      texte: 'Vue de l’opérateur : décubitus latéral, billot sous le flanc, table cassée pour ouvrir l’espace entre côtes et crête iliaque. L’abord est le plus souvent gauche (l’aorte se mobilise mieux que la veine cave, le foie ne gêne pas) ; il est montré ici à droite, côté du modèle. Incision sur la 10ᵉ côte, de la masse paravertébrale au cartilage costal, prolongée en oblique vers le bord latéral du muscle droit de l’abdomen. Poumon, rein, foie et péritoine ne sont pas représentés.',
      montrer: ['incision-tpl'], danger: ['intercostaux-n', 'intercostales-a'], masquer: IMPLANTS },
    { titre: 'Muscles de la paroi et 10e côte', vue: 'opTplProche',
      texte: 'Section du grand dorsal et du dentelé postérieur inférieur, puis des obliques et du transverse dans la partie abdominale. La 10ᵉ côte est réséquée en sous-périosté (elle servira de greffon). Le cartilage costal, fendu, est le repère qui mène dans l’espace rétropéritonéal ; la plèvre est ouverte dans le lit de la côte.',
      accent: ['cote10', 'cart10'], danger: ['intercostaux-n', 'intercostales-a'], sectionner: PAROI_TPL, masquer: IMPLANTS, ecarter: tplPeau(26) },
    { titre: 'Diaphragme et rétropéritoine', vue: 'opTplProche',
      texte: 'La côte réséquée, le diaphragme est incisé en périphérie, à 2 cm de ses insertions costales (son innervation phrénique vient du centre), en laissant des fils repères pour le refermer. Le péritoine est refoulé en avant au doigt ; le pilier du diaphragme est désinséré du rachis. On découvre le psoas et les corps de T11 à L2.',
      accent: ['diaphragme', 'psoas', 't12', 'l1'], danger: ['intercostaux-n', 'aorte', 'vci'], sectionner: { ...PAROI_TPL_LARGE, ...COTE_RESEQUEE, ...DIAPHRAGME }, masquer: IMPLANTS, ecarter: tplPeau(34) },
    { titre: 'Vaisseaux segmentaires et corps vertébraux', vue: 'opTplProche',
      texte: 'Le psoas est désinséré des corps et récliné en arrière. Les vaisseaux segmentaires (lombaires et intercostaux) sont liés au milieu des corps vertébraux, à distance des foramens pour préserver la vascularisation médullaire (artère d’Adamkiewicz, souvent entre T9 et L2, à gauche). Les disques sont repérés, saillants, entre les corps concaves.',
      accent: ['t12', 'l1', 'l2', 'lombaires-a'], danger: ['lombaires-a', 'intercostales-a', 'aorte', 'sympathique'], sectionner: { ...PAROI_TPL_LARGE, ...COTE_RESEQUEE, ...DIAPHRAGME_LARGE }, masquer: [...IMPLANTS, 'carre-lombes', 'transverse'], ecarter: { ...tplPeau(34), ...PSOAS_RECLINE } },
    { titre: 'Corporectomie et reconstruction', vue: 'opTplProche',
      texte: 'Discectomie des deux disques adjacents puis corporectomie de L1 jusqu’au mur postérieur, réséqué pour décomprimer le canal en dernier. Reconstruction par cage (ou greffon tricortical) appuyée sur les plateaux, et plaque latérale vissée en T12 et L2 (vis bicorticales parallèles au plateau, en avant du canal). Fermeture du diaphragme, drain thoracique.',
      accent: ['cage-tpl', 'plaque-tpl'], montrer: ['cage-tpl', 'plaque-tpl', ...[0, 1, 2, 3].map(n => `plaque-tpl/vis${n}`)], voiler: ['t12', 'l2'], danger: ['dure-mere', 'aorte'], sectionner: { ...PAROI_TPL_LARGE, ...COTE_RESEQUEE, ...DIAPHRAGME_LARGE, ...CORPORECTOMIE }, masquer: ['carre-lombes', 'transverse'], ecarter: { ...tplPeau(34), ...PSOAS_RECLINE } },
  ] },
  xlif: { court: 'Rétropéritonéale latérale', titre: 'Voie rétropéritonéale latérale trans-psoas (XLIF)', fendre: [...peauFendue(PEAU_XL, FOND_LAT, 'antérieure', 'postérieure'),
    ...PAROI_XL.map(id => [id, { ligne: PEAU_XL, fond: FOND_LAT, rayon: 22 }, 'berge antérieure', 'berge postérieure'])], steps: [
    { titre: 'Installation et incision', vue: 'opXl',
      texte: 'Vue de l’opérateur : décubitus latéral strict, table cassée pour écarter crête iliaque et côtes, centrage scopique de face et de profil sur le disque L3-L4. Petite incision latérale en regard du milieu du disque, dans l’axe des fibres de l’oblique externe. L’ALIF (L5-S1, L4-L5) passe au contraire par une voie antérieure para-médiane rétropéritonéale, entre les vaisseaux iliaques.',
      montrer: ['incision-xlif'], danger: ['ilio-hypogastrique', 'ilio-inguinal'], masquer: IMPLANTS },
    { titre: 'Paroi abdominale', vue: 'opXlProche',
      texte: 'Les trois muscles larges (oblique externe, oblique interne, transverse) sont dissociés dans le sens de leurs fibres, sans section. Les nerfs ilio-hypogastrique et ilio-inguinal, qui cheminent entre oblique interne et transverse, sont repérés et protégés (sinon parésie de la paroi, « pseudo-hernie »).',
      accent: ['oblique-ext', 'oblique-int', 'transverse'], danger: ['ilio-hypogastrique', 'ilio-inguinal'], masquer: IMPLANTS, ecarter: { ...xlPeau(10), ...xlParoi(6) } },
    { titre: 'Rétropéritoine et psoas', vue: 'opXlProche',
      texte: 'L’espace rétropéritonéal est ouvert au doigt, le péritoine et son contenu refoulés en avant (non représentés). On palpe le processus transverse puis le psoas. Le nerf génito-fémoral court à la face antérieure du psoas.',
      accent: ['psoas', 'carre-lombes'], danger: ['genitofemoral', 'vci', 'aorte'], masquer: IMPLANTS, ecarter: { ...xlPeau(12), ...xlParoi(11) } },
    { titre: 'Passage trans-psoas', vue: 'opXlProche',
      texte: 'Les dilatateurs traversent le psoas sous neuromonitorage continu (électromyographie) : le plexus lombaire chemine dans le tiers postérieur du muscle, on passe donc à l’union des tiers moyen et antérieur du disque. L’écarteur tubulaire est fixé sur le disque.',
      accent: ['d-l3l4', 'psoas'], danger: ['genitofemoral', 'lombaires-a'], sectionner: TRANS_PSOAS, masquer: IMPLANTS, ecarter: { ...xlPeau(12), ...xlParoi(11) } },
    { titre: 'Discectomie et cage', vue: 'opXlProche',
      texte: 'Discectomie, libération de l’anneau controlatéral, préparation des plateaux, puis cage large posée d’un listel à l’autre (appui sur l’anneau cortical : faible risque d’enfoncement). Le temps passé dans le psoas doit être court (parésies et dysesthésies de cuisse transitoires). Fixation complémentaire possible par vis percutanées.',
      accent: ['cage-xlif'], montrer: ['cage-xlif'], voiler: ['l3', 'l4'], danger: ['genitofemoral'], sectionner: TRANS_PSOAS, ecarter: { ...xlPeau(12), ...xlParoi(11) } },
  ] },
};
export default { nom: 'Rachis', graisse: 4, centre, vues, meshes, tubes, rubans, groupes, voies };
