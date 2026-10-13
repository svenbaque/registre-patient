// Bras droit — voie antéro-latérale et voie postérieure de l'humérus.
// Repère BodyParts3D, en millimètres : x = latéral (-) / médial (+), y = avant (-) / arrière (+), z = vers le haut.
import pieces from './bras.pieces.js';
import { peauFendue, charge, lame, deuxBerges } from './outils.js';

const meshes = [
  ['peau-epaule', 'Peau', 'peau', '#e2b596', { id: 'peau', dossier: 'models-z' }],
  ...pieces,
];

// ----- Voie antéro-latérale : bord latéral du biceps -----
const PEAU_AL = [[-209, -104, 1254], [-212, -98, 1231], [-217, -90, 1206], [-219, -93, 1181], [-229, -90, 1155], [-232, -86, 1131], [-237, -86, 1105]];
const FOND_AL = [0.58, 0.81, 0];
const N_MED = [0.81, -0.58, -0.11];
const N_LAT = [-0.81, 0.58, 0.11];
const BORD_BICEPS = [[-206, -94, 1240], [-227, -86, 1108]];
const BRACHIAL = [[-201, -82, 1226], [-203, -77, 1182], [-210, -75, 1142], [-215, -77, 1104]]; // milieu du brachial, en regard de l'humérus

// ----- Voie postérieure : ligne médiane postérieure, de l'acromion vers l'olécrâne -----
const PEAU_POST = [[-205, -8, 1221], [-206, -7, 1191], [-211, -14, 1159], [-214, -16, 1131], [-216, -19, 1100], [-219, -23, 1078]];
const FOND_POST = [0, -1, 0];
const TRICEPS = [[-197, -30, 1226], [-213, -36, 1074]]; // entre chef long (en dedans) et chef latéral (en dehors)

const visAL = (n, x, y, z) => [`plaque-al/vis${n}`, 'Vis corticale', 'implants', '#cfd6dd', 1.7, [[x - 1, y - 1.5, z], [x + 6, y + 8.5, z], [x + 13, y + 18.5, z]]];
const visPost = (n, x, y, z) => [`plaque-post/vis${n}`, 'Vis corticale', 'implants', '#cfd6dd', 1.7, [[x, y + 2, z], [x, y - 9, z], [x, y - 20, z]]];
// ----- Voie latérale distale et voie médiale -----
const PEAU_LATD = [[-240, -52, 1160], [-238, -52, 1145], [-240, -51, 1131], [-244, -52, 1115], [-241, -51, 1100], [-244, -51, 1091]];
const FOND_LATD = [0.99, -0.15, 0];
const PEAU_MEDB = [[-160, -89, 1218], [-161, -80, 1199], [-163, -77, 1176], [-169, -75, 1150], [-173, -73, 1125], [-177, -71, 1099]];
const FOND_MEDB = [-0.95, 0.3, 0];
const tubes = [
  ['incision-latd', 'Incision — voie latérale distale', 'incisions', '#35e0c8', 1.3, PEAU_LATD.map(([x, y, z]) => [x - 2.2, y, z])],
  ['incision-medb', 'Incision — voie médiale du bras', 'incisions', '#35e0c8', 1.3, PEAU_MEDB.map(([x, y, z]) => [x + 2.2, y - 0.7, z])],
  ...[1150, 1136, 1122, 1104, 1092].map((z, n) => [`plaque-latd/vis${n}`, 'Vis corticale', 'implants', '#cfd6dd', 1.7, [[-219.5 - (1155 - z) * 0.27, -55, z], [-209 - (1155 - z) * 0.27, -56, z], [-199 - (1155 - z) * 0.27, -57, z]]]),
  ['incision-al', 'Incision — voie antéro-latérale', 'incisions', '#35e0c8', 1.3, PEAU_AL.map(([x, y, z]) => [x - 1.3, y - 1.8, z])],
  ['incision-post', 'Incision — voie postérieure', 'incisions', '#35e0c8', 1.3, PEAU_POST.map(([x, y, z]) => [x, y + 2.2, z])],
  visAL(1, -199.5, -80, 1228), visAL(2, -202, -78, 1214), visAL(3, -203.5, -76, 1200), visAL(4, -206.5, -71, 1162), visAL(5, -210, -68.5, 1148), visAL(6, -213, -66.5, 1134),
  visPost(1, -197, -53.5, 1196), visPost(2, -198, -51.5, 1182), visPost(3, -200, -49.5, 1168), visPost(4, -207, -45.5, 1130), visPost(5, -209.5, -45, 1116), visPost(6, -212, -45.5, 1100),
];
const rubans = [
  ['plaque-latd', 'Plaque latérale de l’humérus distal', 'implants', '#b9c2cc', [[-218.5, -55, 1158], [-223.5, -54, 1132], [-230.5, -54, 1106], [-237.5, -56, 1086]], 10, 3, [0, 1, 0]],
  ['plaque-al', 'Plaque antéro-latérale de l’humérus', 'implants', '#b9c2cc', [[-198.5, -81, 1236], [-203.5, -77, 1206], [-204.5, -73, 1180], [-211, -69, 1150], [-215, -66.5, 1126]], 12, 3.4, [0.81, -0.58, 0]],
  ['plaque-post', 'Plaque postérieure de l’humérus', 'implants', '#b9c2cc', [[-196.5, -53, 1204], [-199, -49, 1172], [-205.5, -45.5, 1142], [-210, -44.5, 1112], [-213.5, -46, 1090]], 11, 3.4, [1, 0, 0]],
];

const groupes = [
  ['peau', 'Peau'], ['graisse', 'Tissu sous-cutané'], ['os', 'Os'], ['anterieurs', 'Loge antérieure'], ['triceps', 'Triceps'], ['epaule', 'Deltoïde et muscles de l’épaule'], ['lateraux', 'Brachio-radial et extenseurs'],
  ['ligaments', 'Cloisons intermusculaires'], ['vaisseaux', 'Artères et veines'], ['nerfs', 'Nerfs'], ['incisions', 'Incisions'], ['implants', 'Plaques et vis'],
];

const centre = [-205, -70, 1180];
const AVANT = [-208, -78, 1178];
const ARRIERE = [-206, -42, 1150];
const vues = {
  // décubitus dorsal, bras sur une tablette : l'opérateur regarde la face antéro-latérale du bras, épaule en haut
  opAL: { de: [-190, -265, 0], cible: AVANT }, opALProche: { de: [-125, -175, 0], cible: AVANT },
  // décubitus latéral ou ventral, bras sur un appui, coude fléchi : l'opérateur regarde la face postérieure, épaule en haut
  opPost: { de: [-40, 320, 0], cible: ARRIERE }, opPostProche: { de: [-25, 205, 0], cible: ARRIERE },
  opLatD: { de: [-310, 40, 0], cible: [-226, -56, 1124] }, opLatDProche: { de: [-190, 25, 0], cible: [-226, -56, 1124] },
  // bras en abduction et rotation latérale : face médiale, épaule en haut
  opMedB: { de: [150, -250, 0], cible: [-172, -76, 1160] }, opMedBProche: { de: [88, -150, 0], cible: [-172, -76, 1160] },
  libre: { de: [-300, -250, 60] },
};
const IMPLANTS = ['plaque-al', 'plaque-post', 'plaque-latd'];

const optsPeau = { rayon: 24, profondeur: 30 };
const droite = ligne => [ligne[0], ligne[ligne.length - 1]];
const alPeau = (dehors, dedans) => ({
  ...deuxBerges(PEAU_AL, FOND_AL,
    { vers: N_LAT, lame: lame(droite(PEAU_AL), N_LAT, FOND_AL, dehors, dehors * 2.4 + 10, optsPeau) },
    { vers: N_MED, lame: lame(droite(PEAU_AL), N_MED, FOND_AL, dedans, dedans * 2.4 + 10, optsPeau) }),
  cephalique: lame(droite(PEAU_AL), N_LAT, FOND_AL, dehors, dehors * 2.4 + 10, optsPeau),
});
// Le biceps est récliné en dedans avec le nerf musculo-cutané, qui chemine entre lui et le brachial.
const BICEPS_EN_DEDANS = charge(['biceps-long', 'biceps-court', 'musculocutane'], lame(BORD_BICEPS, N_MED, FOND_AL, 17, 80, { rayon: 26, profondeur: 34 }));
// Le brachial est fendu dans son axe : sa moitié latérale (nerf radial) protège le nerf radial, sa moitié médiale est innervée par le musculo-cutané.
const brachialFendu = k => deuxBerges(BRACHIAL, FOND_AL,
  { vers: N_MED, lame: lame(droite(BRACHIAL), N_MED, FOND_AL, 9 * k, 34, { rayon: 26, profondeur: 30 }) },
  { vers: N_LAT, lame: lame(droite(BRACHIAL), N_LAT, FOND_AL, 9 * k, 34, { rayon: 26, profondeur: 30 }) }, ['brachial']);

const postPeau = e => deuxBerges(PEAU_POST, FOND_POST,
  { vers: [1, 0, 0], lame: lame(droite(PEAU_POST), [1, 0, 0], FOND_POST, e, e * 2.4 + 10, optsPeau) },
  { vers: [-1, 0, 0], lame: lame(droite(PEAU_POST), [-1, 0, 0], FOND_POST, e, e * 2.4 + 10, optsPeau) });
const tricepsOuvert = e => ({
  ...charge(['triceps-long'], lame(TRICEPS, [1, 0, 0.1], FOND_POST, e, e * 2.4 + 14, { rayon: 26, profondeur: 30 })),
  ...charge(['triceps-lat'], lame(TRICEPS, [-1, 0, -0.1], FOND_POST, e, e * 2.4 + 14, { rayon: 26, profondeur: 30 })),
});
const MEDIAL_FENDU = deuxBerges(TRICEPS, FOND_POST,
  { vers: [1, 0, 0], lame: lame(TRICEPS, [1, 0, 0.1], FOND_POST, 11, 40, { rayon: 26, profondeur: 34 }) },
  { vers: [-1, 0, 0], lame: lame(TRICEPS, [-1, 0, -0.1], FOND_POST, 11, 40, { rayon: 26, profondeur: 34 }) }, ['triceps-med']);

const deuxLamesPeau = (peau, fond, versA, versB, e) => deuxBerges(peau, fond,
  { vers: versA, lame: lame(droite(peau), versA, fond, e, e * 2.4 + 8, { rayon: 22, profondeur: 24 }) },
  { vers: versB, lame: lame(droite(peau), versB, fond, e, e * 2.4 + 8, { rayon: 22, profondeur: 24 }) });
// latérale distale : triceps en arrière, brachial et brachio-radial en avant avec le nerf radial
const LD_AVANT = [-0.15, -0.99, 0];
const LD_ARRIERE = [0.15, 0.99, 0];
const INT_LATD = [[-222, -58, 1162], [-238, -58, 1084]];
const latdPeau = e => deuxLamesPeau(PEAU_LATD, FOND_LATD, LD_AVANT, LD_ARRIERE, e);
const latdMuscles = e => ({
  ...charge(['brachial', 'brachioradial', 'ecrl', 'nradial', 'acoll-radiale'], lame(INT_LATD, LD_AVANT, FOND_LATD, e, e * 2.4 + 14, { rayon: 22, profondeur: 36 })),
  ...charge(['triceps-lat', 'triceps-med', 'ancone', 'acoll-moyenne'], lame(INT_LATD, LD_ARRIERE, FOND_LATD, e, e * 2.4 + 14, { rayon: 22, profondeur: 36 })),
});
// médiale : biceps en avant, triceps en arrière ; le paquet brachial est au milieu du champ
const MB_AVANT = [-0.3, -0.95, 0];
const MB_ARRIERE = [0.3, 0.95, 0];
const INT_MEDB = [[-166, -78, 1216], [-180, -70, 1098]];
const medbPeau = e => deuxLamesPeau(PEAU_MEDB, FOND_MEDB, MB_AVANT, MB_ARRIERE, e);
const medbMuscles = e => ({
  ...charge(['biceps-court', 'biceps-long', 'coracobrachial'], lame(INT_MEDB, MB_AVANT, FOND_MEDB, e, e * 2.4 + 12, { rayon: 24, profondeur: 30 })),
  ...charge(['triceps-long', 'triceps-med'], lame(INT_MEDB, MB_ARRIERE, FOND_MEDB, e, e * 2.4 + 12, { rayon: 24, profondeur: 30 })),
});
const PAQUET_EN_AVANT = charge(['nmedian', 'abrachiale', 'vbrachiales', 'basilique'], { dep: [-3, -11, 0], autour: INT_MEDB, rayon: 30 });
const ULNAIRE_EN_ARRIERE = { nulnaire: { dep: [3, 9, 0], autour: INT_MEDB, rayon: 30 } };

const voies = {
  al: { court: 'Antéro-latérale', titre: 'Voie antéro-latérale de l’humérus', steps: [
    { titre: 'Installation et incision', vue: 'opAL',
      texte: 'Vue de l’opérateur : décubitus dorsal ou demi-assis, bras sur une tablette. L’incision suit le bord latéral du biceps ; elle prolonge en bas le sillon delto-pectoral et peut descendre jusqu’au pli du coude, entre biceps et brachio-radial. Elle est centrée sur le foyer.',
      montrer: ['incision-al'], danger: ['cephalique'], masquer: IMPLANTS },
    { titre: 'Peau et fascia', vue: 'opALProche',
      texte: 'Peau, tissu sous-cutané et fascia brachial sont incisés sur le bord latéral du biceps. La veine céphalique reste en dehors. En bas de l’incision, le nerf cutané latéral de l’avant-bras (terminaison du musculo-cutané) émerge entre biceps et brachial : il est repéré.',
      accent: ['biceps-long', 'brachial'], danger: ['cephalique', 'musculocutane'], masquer: IMPLANTS, ecarter: alPeau(15, 16) },
    { titre: 'Biceps récliné en dedans', vue: 'opALProche',
      texte: 'Le biceps est décollé du brachial et récliné en dedans ; le nerf musculo-cutané, qui chemine entre les deux muscles, part avec lui. Le brachial couvre la face antérieure de l’humérus.',
      accent: ['biceps-long', 'biceps-court', 'brachial'], danger: ['musculocutane', 'nradial'], masquer: IMPLANTS, ecarter: { ...alPeau(18, 20), ...BICEPS_EN_DEDANS } },
    { titre: 'Brachial fendu', vue: 'opALProche',
      texte: 'Le brachial est fendu dans l’axe de ses fibres, en son milieu, jusqu’à l’os : sa moitié latérale, innervée par le nerf radial, protège ce nerf ; sa moitié médiale est innervée par le musculo-cutané. Au tiers distal, le nerf radial est repéré entre brachial et brachio-radial avant toute pose d’écarteur ; plus haut, il croise la face postérieure de l’os dans son sillon.',
      accent: ['humerus', 'brachial'], danger: ['nradial', 'abrachiale-prof', 'musculocutane'], masquer: IMPLANTS, ecarter: { ...alPeau(20, 22), ...BICEPS_EN_DEDANS, ...brachialFendu(1) } },
    { titre: 'Réduction et plaque', vue: 'opALProche',
      texte: 'Le foyer est exposé avec un dépériostage limité. Réduction (longueur, axe, rotation), puis plaque large sur la face antéro-latérale, avec trois à quatre vis bicorticales de part et d’autre. Les écarteurs contre-coudés ne sont pas appuyés sur la face postérieure ni latérale de l’os : le nerf radial y est. Sa fonction est testée au réveil.',
      accent: ['humerus'], danger: ['nradial', 'abrachiale-prof'], montrer: ['plaque-al'], masquer: ['plaque-post'], ecarter: { ...alPeau(20, 22), ...BICEPS_EN_DEDANS, ...brachialFendu(1.15) } },
  ] },
  post: { court: 'Postérieure', titre: 'Voie postérieure de l’humérus', steps: [
    { titre: 'Installation et incision', vue: 'opPost',
      texte: 'Vue de l’opérateur : décubitus latéral ou ventral, bras sur un appui, coude fléchi et avant-bras pendant. Incision médiane postérieure, sur la ligne qui joint l’angle postérieur de l’acromion à la pointe de l’olécrâne ; elle est centrée sur le foyer, ici la moitié distale.',
      montrer: ['incision-post'], masquer: IMPLANTS },
    { titre: 'Peau et fascia', vue: 'opPostProche',
      texte: 'Peau, tissu sous-cutané et fascia brachial sont incisés. Le triceps apparaît : chef long en dedans, chef latéral en dehors, réunis en bas par leur lame tendineuse commune.',
      accent: ['triceps-long', 'triceps-lat'], masquer: IMPLANTS, ecarter: postPeau(16) },
    { titre: 'Intervalle chef long / chef latéral', vue: 'opPostProche',
      texte: 'L’intervalle entre chef long et chef latéral est ouvert au doigt en haut, puis la lame tendineuse commune est fendue en bas. Au fond, le nerf radial et l’artère brachiale profonde croisent la face postérieure de l’humérus, de dedans en dehors, juste au-dessus de l’origine du chef médial — en moyenne 14 à 17 cm au-dessus de l’épicondyle latéral selon les séries. Ils sont repérés avant toute dissection profonde et mis sur lacs.',
      accent: ['triceps-long', 'triceps-lat', 'triceps-med'], danger: ['nradial', 'abrachiale-prof', 'nradial-rameaux'], masquer: IMPLANTS, ecarter: { ...postPeau(20), ...tricepsOuvert(13) } },
    { titre: 'Chef médial fendu', vue: 'opPostProche',
      texte: 'Le chef médial (profond) est fendu dans l’axe, sur la ligne médiane, jusqu’à l’os, puis décollé en sous-périosté de part et d’autre. Le nerf ulnaire longe son bord médial en bas. La face postérieure de l’humérus est exposée, du sillon du nerf radial à la fosse olécrânienne.',
      accent: ['humerus', 'triceps-med'], danger: ['nradial', 'abrachiale-prof', 'nulnaire'], masquer: IMPLANTS, ecarter: { ...postPeau(22), ...tricepsOuvert(15), ...MEDIAL_FENDU } },
    { titre: 'Réduction et plaque', vue: 'opPostProche',
      texte: 'Réduction, puis plaque postérieure : la face postérieure est plane au tiers distal, et la plaque peut suivre la colonne latérale. En haut, elle passe sous le nerf radial, libéré et soulevé : la position du nerf par rapport aux trous de la plaque est notée dans le compte rendu opératoire, en prévision d’une ablation.',
      accent: ['humerus'], danger: ['nradial', 'abrachiale-prof', 'nulnaire'], montrer: ['plaque-post'], masquer: ['plaque-al'], ecarter: { ...postPeau(22), ...tricepsOuvert(15), ...MEDIAL_FENDU } },
  ] },
};
voies.latd = { court: 'Latérale distale', titre: 'Voie latérale de l’humérus distal', fendre: peauFendue(PEAU_LATD, FOND_LATD, 'antérieure', 'postérieure'), steps: [
  { titre: 'Installation et incision', vue: 'opLatD',
    texte: 'Décubitus dorsal, bras sur le thorax ou sur une tablette. Incision latérale longitudinale sur la crête supra-condylienne latérale, de l’épicondyle latéral vers le haut, sur 8 à 10 cm. Le nerf radial traverse la cloison intermusculaire latérale d’arrière en avant une dizaine de centimètres au-dessus de l’épicondyle : il est dans la moitié haute du champ.',
    montrer: ['incision-latd'], danger: ['nradial'], masquer: IMPLANTS },
  { titre: 'Peau et fascia', vue: 'opLatDProche',
    texte: 'Peau, tissu sous-cutané et fascia sont incisés sur la cloison intermusculaire latérale, entre le triceps en arrière et le brachio-radial en avant.',
    accent: ['triceps-lat', 'brachioradial', 'septum-lat'], danger: ['nradial'], masquer: IMPLANTS, ecarter: latdPeau(10) },
  { titre: 'Nerf radial, puis intervalle', vue: 'opLatDProche',
    texte: 'Le nerf radial est cherché d’abord, en haut, entre brachial et brachio-radial, et suivi jusqu’à sa traversée de la cloison ; il est mis sur lacs. Le brachio-radial et le brachial sont alors réclinés en avant avec lui, le triceps en arrière, au ras de la crête.',
    accent: ['humerus', 'brachioradial', 'triceps-lat'], danger: ['nradial', 'acoll-radiale'], masquer: IMPLANTS, ecarter: { ...latdPeau(12), ...latdMuscles(10) } },
  { titre: 'Colonne latérale et plaque', vue: 'opLatDProche',
    texte: 'La colonne latérale de l’humérus distal est exposée en sous-périosté, jusqu’à la capsule en bas. Plaque latérale ou postéro-latérale ; le nerf radial passe en pont sur la partie haute de la plaque, et sa position par rapport aux trous est notée dans le compte rendu.',
    accent: ['humerus'], danger: ['nradial'], montrer: ['plaque-latd'], ecarter: { ...latdPeau(12), ...latdMuscles(11) } },
] };
voies.medb = { court: 'Médiale', titre: 'Voie médiale du bras (paquet vasculo-nerveux)', fendre: peauFendue(PEAU_MEDB, FOND_MEDB, 'antérieure', 'postérieure'), steps: [
  { titre: 'Installation et incision', vue: 'opMedB',
    texte: 'Décubitus dorsal, bras en abduction à 90° et rotation latérale sur une table à bras. Incision longitudinale dans le sillon bicipital médial, entre biceps et triceps, sur le trajet de l’artère brachiale, que l’on sent battre.',
    montrer: ['incision-medb'], danger: ['basilique'], masquer: IMPLANTS },
  { titre: 'Fascia brachial, veine basilique', vue: 'opMedBProche',
    texte: 'Sous la peau, la veine basilique et le nerf cutané médial de l’avant-bras traversent le fascia brachial à mi-bras : ils sont réclinés. Le fascia est incisé dans l’axe.',
    accent: ['biceps-court', 'triceps-long'], danger: ['basilique', 'nmedian', 'abrachiale'], masquer: IMPLANTS, ecarter: medbPeau(10) },
  { titre: 'Paquet brachial', vue: 'opMedBProche',
    texte: 'Dans le canal brachial : l’artère brachiale et ses deux veines, le nerf médian, qui la croise par l’avant de dehors en dedans à mi-bras, et en arrière de la cloison intermusculaire médiale le nerf ulnaire, avec l’artère collatérale ulnaire supérieure. C’est la voie des plaies et des pontages de l’artère brachiale, et des explorations nerveuses.',
    accent: ['abrachiale', 'nmedian', 'nulnaire'], danger: ['abrachiale', 'nmedian', 'nulnaire', 'vbrachiales'], masquer: IMPLANTS, ecarter: { ...medbPeau(12), ...medbMuscles(10) } },
  { titre: 'Face médiale de l’humérus', vue: 'opMedBProche',
    texte: 'Pour atteindre l’os, l’artère et le nerf médian sont réclinés en avant avec le biceps, le nerf ulnaire en arrière avec le triceps ; le brachial et le chef médial du triceps sont décollés de la face médiale de l’humérus. Voie rarement utilisée pour une ostéosynthèse : les branches vasculaires et nerveuses la rendent étroite.',
    accent: ['humerus'], danger: ['abrachiale', 'nmedian', 'nulnaire'], masquer: IMPLANTS, ecarter: { ...medbPeau(13), ...medbMuscles(12), ...PAQUET_EN_AVANT, ...ULNAIRE_EN_ARRIERE } },
] };
voies.al.fendre = [...peauFendue(PEAU_AL, FOND_AL, 'médiale', 'latérale'), ['brachial', { ligne: BRACHIAL, fond: FOND_AL, rayon: 30 }, 'Brachial — moitié médiale', 'Brachial — moitié latérale']];
voies.post.fendre = [...peauFendue(PEAU_POST, FOND_POST, 'latérale', 'médiale'), ['triceps-med', { ligne: TRICEPS, fond: FOND_POST, rayon: 34 }, 'Triceps, chef médial — moitié latérale', 'Triceps, chef médial — moitié médiale']];

export default { nom: 'Bras droit', graisse: 4, centre, vues, meshes, tubes, rubans, groupes, voies };
