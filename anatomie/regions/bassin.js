// Bassin — voies antérieures : Stoppa modifiée, Pfannenstiel, ilio-inguinale, pararectus, ilio-fémorale, Smith-Petersen, sacro-iliaque.
// Repère BodyParts3D, en millimètres : x = droite du patient (-) / gauche (+), y = avant (-) / arrière (+), z = vers le haut.
// Les viscères (vessie, péritoine) ne font pas partie du modèle : ils sont décrits dans le texte.
import pieces from './bassin.pieces.js';
import { peauFendue, berges, charge, lame, cote } from './outils.js';

const meshes = [
  ['peau-bassin', 'Peau', 'peau', '#e2b596', { id: 'peau', dossier: 'models-z' }],
  ...pieces,
];

// Incision de Pfannenstiel : transversale, deux travers de doigt au-dessus de la symphyse.
const PEAU_PF = [[-62, -176, 835], [-40, -179, 835], [-20, -183, 835], [0, -186, 835], [20, -183, 835], [40, -179, 835], [62, -176, 835]];
const FOND = [0, 1, 0];
const LIGNE_BLANCHE = [[0, -148, 808], [0, -180, 905]];

// Tracés à la main : incision, corona mortis (absente du modèle), plaques et vis.
const visPlaque = (id, n, de, dir, l) => [`${id}/vis${n}`, 'Vis', 'implants', '#cfd6dd', 1.7, [de, de.map((c, i) => c + dir[i] * l / 2), de.map((c, i) => c + dir[i] * l)]];
// Lignes d'incision relevées sur la peau (côté droit).
const CRETE = [[-141, -71, 966], [-145, -84, 976], [-146, -92, 974], [-146, -108, 964], [-145, -124, 952], [-137, -140, 932]];
const EIAS = [-129, -157, 903];
const PEAU_II = [...CRETE.slice(1), EIAS, [-100, -172, 884], [-78, -179, 858], [-56, -180, 839], [-33, -180, 828], [-13, -178, 826], [5, -178, 826]];
const PEAU_SI = CRETE;
const PEAU_IF = [...CRETE.slice(2), EIAS, [-124, -166, 880], [-127, -158, 851], [-130, -157, 821], [-138, -160, 789]];
const PEAU_PARA = [[-73, -192, 928], [-68, -190, 900], [-58, -191, 871], [-48, -185, 846], [-37, -175, 825]];
const FOND_CRETE = [0.85, 0.5, -0.15];
const FOND_II = [0.45, 0.85, -0.25];
const FOND_PARA = [0.25, 0.97, 0];
const tubes = [
  ['incision-ii', 'Incision — voie ilio-inguinale', 'incisions', '#35e0c8', 1.4, PEAU_II.map(([x, y, z]) => [x - 1, y - 2.2, z + 0.6])],
  ['incision-si', 'Incision — crête iliaque', 'incisions', '#35e0c8', 1.4, PEAU_SI.map(([x, y, z]) => [x - 2.4, y - 0.8, z + 0.8])],
  ['incision-if', 'Incision — voie ilio-fémorale', 'incisions', '#35e0c8', 1.4, PEAU_IF.map(([x, y, z]) => [x - 1.6, y - 2, z + 0.4])],
  ['incision-para', 'Incision — voie pararectus', 'incisions', '#35e0c8', 1.4, PEAU_PARA.map(([x, y, z]) => [x - 0.6, y - 2.5, z])],
  ['tronc-ls', 'Tronc lombo-sacral (L4-L5, tracé)', 'nerfs', '#f3d98b', 2.2, [[-26, -72, 962], [-37, -75, 928], [-44, -75, 897], [-46, -66, 866]]],
  ...[[-70, -73, 924], [-46, -68.5, 921], [-72, -79, 904], [-44, -78, 901]].map(([x, y, z], n) => [`plaque-si/vis${n}`, 'Vis', 'implants', '#cfd6dd', 1.7, [[x, y - 2, z], [x, y + 10, z], [x, y + 22, z]]]),
  ...[[-36, -134, 833], [-58, -116, 853], [-60, -84, 873], [-52, -62, 886]].map(([x, y, z], n) => [`plaque-supra/vis${n}`, 'Vis', 'implants', '#cfd6dd', 1.7, [[x, y, z + 2], [x - 5, y + 2, z - 12], [x - 10, y + 4, z - 26]]]),
  ['incision-pf', 'Incision de Pfannenstiel', 'incisions', '#35e0c8', 1.4, PEAU_PF.map(([x, y, z]) => [x, y - 2.5, z])],
  ['corona-mortis', 'Corona mortis (anastomose obturatrice – épigastrique, tracé)', 'vaisseaux', '#e0392b', 1.3, [[-52, -124, 853], [-50.5, -117, 840], [-47.5, -111, 826], [-44.5, -109, 813]]],
  visPlaque('plaque-infra', 1, [-31, -131, 824], [-0.8, 0.3, -0.5], 22), visPlaque('plaque-infra', 2, [-48, -115, 838], [-1, 0.1, 0.1], 20),
  visPlaque('plaque-infra', 3, [-51, -80, 858], [-0.9, 0.2, 0.4], 30), visPlaque('plaque-infra', 4, [-46, -62, 872], [-0.9, 0.3, 0.3], 34),
  visPlaque('plaque-symphyse', 1, [-28, -138, 824], [0, 0.15, -1], 26), visPlaque('plaque-symphyse', 2, [-14, -142, 819], [0, 0.15, -1], 24),
  visPlaque('plaque-symphyse', 3, [14, -142, 819], [0, 0.15, -1], 24), visPlaque('plaque-symphyse', 4, [28, -138, 824], [0, 0.15, -1], 26),
];
const rubans = [
  ['plaque-supra', 'Plaque supra-pectinéale', 'implants', '#b9c2cc', [[-12, -142, 819], [-36, -134, 833], [-56, -120, 851], [-62, -100, 865], [-58, -80, 875], [-50, -60, 887]], 10, 2.6, [0.7, 0.7, 0]],
  ['plaque-si', 'Plaques antérieures de la sacro-iliaque', 'implants', '#b9c2cc', [[-76, -75, 925], [-58, -71, 922.5], [-42, -68.5, 920]], 8, 2.2, [0, 0, 1]],
  ['plaque-si/b', 'Plaques antérieures de la sacro-iliaque', 'implants', '#b9c2cc', [[-78, -81, 905], [-58, -79, 902.5], [-40, -79, 900]], 8, 2.2, [0, 0, 1]],
  ['plaque-infra', 'Plaque infra-pectinéale', 'implants', '#b9c2cc', [[-10, -140, 811], [-32, -131, 825], [-48, -115, 839], [-51, -97, 849], [-51, -80, 859], [-46, -62, 873]], 10, 2.6, [0, 0.25, 0.97]],
  ['plaque-infra/console', 'Plaque console de la lame quadrilatère', 'implants', '#b9c2cc', [[-49, -92, 852], [-48.5, -86, 832], [-46.5, -80, 812]], 9, 2.2, [0, 1, 0]],
  ['plaque-symphyse', 'Plaque de la symphyse pubienne', 'implants', '#b9c2cc', [[-36, -135, 828], [-18, -141, 820.5], [0, -143, 817.5], [18, -141, 820.5], [36, -135, 828]], 10, 3, [0, 1, 0]],
];

const groupes = [
  ['peau', 'Peau'], ['graisse', 'Tissu sous-cutané'], ['os', 'Os'], ['paroi', 'Paroi abdominale'], ['pelviens', 'Muscles pelviens et ilio-psoas'], ['cuisse', 'Racine de la cuisse'], ['fessiers', 'Fessiers'],
  ['ligaments', 'Ligaments'], ['vaisseaux', 'Artères et veines'], ['nerfs', 'Nerfs'], ['incisions', 'Incisions'], ['implants', 'Plaques et vis'],
];

const centre = [-30, -110, 860];
const vues = {
  // décubitus dorsal ; l'opérateur est du côté opposé à la fracture (ici à gauche) et regarde le petit bassin droit à travers l'incision
  face: { de: [0, -420, 40], cible: [0, -160, 845] }, faceProche: { de: [0, -250, 20], cible: [0, -160, 842] },
  opStoppa: { de: [150, -250, 10], cible: [-38, -108, 842] }, opStoppaProche: { de: [130, -215, 30], cible: [-40, -104, 842] },
  dedans: { de: [210, -120, 60], cible: [-48, -92, 842] },
  // voies sur la crête iliaque : l'opérateur est du côté de la fracture, il regarde la fosse iliaque par le haut et l'avant
  opCrete: { de: [-190, -300, 190], cible: [-95, -115, 915] }, opFosse: { de: [-120, -160, 250], cible: [-86, -98, 915] },
  opII: { de: [-110, -340, 150], cible: [-70, -135, 880] }, opIIProche: { de: [-60, -240, 120], cible: [-66, -125, 868] },
  opPara: { de: [-70, -330, 120], cible: [-52, -150, 870] }, opParaProche: { de: [-10, -230, 90], cible: [-48, -118, 852] },
  opIF: { de: [-240, -300, 90], cible: [-118, -130, 885] }, opIFProche: { de: [-190, -210, 60], cible: [-112, -118, 870] },
  fosse: { de: [60, -230, 190], cible: [-72, -95, 905] },
  libre: { de: [-200, -400, 150] },
};

// Peau : les deux berges de l'incision transversale s'écartent vers le haut et vers le bas.
const peauOuverte = k => berges(PEAU_PF, FOND, [0, 0, 24], k, 60);
// Les deux muscles droits sont séparés sur la ligne blanche ; le droit du côté de la fracture est récliné avec les vaisseaux épigastriques.
const optsDroits = { rayon: 60, profondeur: 44 };
const droitsEcartes = (droite, gauche) => ({
  ...charge(['droit-abdomen', 'pyramidal', 'aepigastrique', 'vepigastrique'], lame(LIGNE_BLANCHE, [-1, 0, 0], FOND, droite, droite * 2.4 + 20, optsDroits)),
  ...charge(['droit-abdomen-g', 'pyramidal-g'], lame(LIGNE_BLANCHE, [1, 0, 0], FOND, gauche, gauche * 2.4 + 20, optsDroits)),
});
// Sous le détroit supérieur : l'ilio-psoas et les vaisseaux iliaques externes sont soulevés en dehors et en avant ; le paquet obturateur est abaissé.
const DETROIT = [[-30, -132, 826], [-56, -100, 856], [-48, -62, 876]];
const ILIAQUES_SOULEVES = charge(['psoas', 'iliaque', 'ailiaque-ext', 'viliaque-ext', 'nfemoral', 'arcade-iliopectinee', 'ngenitofemoral'], { dep: [-13, -9, 10], autour: DETROIT, rayon: 46 });
const OBTURATEUR_ABAISSE = charge(['nobturateur', 'aobturatrice'], { dep: [9, 2, -9], autour: [[-46, -104, 828], [-50, -70, 850]], rayon: 34 });
const OBTURATEUR_INTERNE_DECOLLE = { 'obturateur-int': { autour: [[-52, -104, 832], [-50, -62, 846]], rayon: 26 }, 'ilio-coccygien': { autour: [[-52, -104, 832], [-50, -62, 846]], rayon: 26 } };
const DECOR = ['ligne-blanche'];
const FOND_DU_CHAMP = [...DECOR, 'droit-abdomen-g', 'pyramidal-g']; // le droit opposé, sous son écarteur, est sorti de l'image pour la lisibilité
const PAROI_GAUCHE = ['lig-inguinal-g'];

// ----- Voies sur la crête iliaque -----
// La berge supéro-médiale (avec la paroi abdominale) est réclinée loin en dedans ; l'autre reste en place.
const bergesCrete = (peau, fond, k) => {
  const haut = cote(peau, fond, [0.4, 0, 1]);
  const bas = haut === 'A' ? 'B' : 'A';
  const leve = { dep: [30 * k, 2 * k, 30 * k], autour: peau, rayon: 70, fond };
  const reste = { dep: [-5 * k, -2 * k, -9 * k], autour: peau, rayon: 30, fond };
  return { [`peau/${haut}`]: leve, [`graisse/${haut}`]: leve, [`peau/${bas}`]: reste, [`graisse/${bas}`]: reste };
};
const LIGNE_CRETE = [[-100, -75, 966], [-122, -115, 948], [-117, -152, 901], [-70, -150, 852], [-30, -148, 818]];
// Les muscles larges de l'abdomen, désinsérés de la crête et du ligament inguinal, partent en dedans avec le péritoine.
const paroiReclinee = k => charge(['oblique-ext', 'oblique-int', 'transverse'], { dep: [34 * k, 0, 30 * k], autour: LIGNE_CRETE, rayon: 80 });
// L'iliaque est décollé de la fosse iliaque interne, en sous-périosté, et récliné en dedans.
const FOSSE = [[-98, -78, 950], [-100, -110, 915], [-92, -132, 880]];
const iliaqueDecolle = k => charge(['iliaque', 'psoas', 'nfemoral', 'nclc', 'ailiolombaire'], { dep: [26 * k, 6 * k, 4 * k], autour: FOSSE, rayon: 58 });
const VAISSEAUX_EN_DEDANS = charge(['ailiaque-ext', 'viliaque-ext', 'afemorale', 'vfemorale', 'ngenitofemoral'], { dep: [12, 0, 4], autour: [[-52, -120, 852], [-48, -100, 880]], rayon: 40 });
const DROIT_EN_DEDANS = charge(['droit-abdomen', 'pyramidal', 'aepigastrique', 'vepigastrique'], lame([[-30, -152, 815], [-70, -175, 935]], [1, 0, 0.3], [0.25, 0.97, 0], 22, 70, { rayon: 60, profondeur: 44 }));
const BANDELETTE = { 'arcade-iliopectinee': { autour: [[-70, -145, 818], [-48, -130, 842]], rayon: 30 } };
const PAROI = ['peau', 'graisse', 'oblique-ext', 'oblique-int', 'transverse', 'droit-abdomen', 'droit-abdomen-g', 'pyramidal', 'pyramidal-g', 'ligne-blanche', 'aepigastrique', 'vepigastrique', 'lig-inguinal-g', 'coxal-g', 'femur-g'];
const SANS = ['corona-mortis', 'tronc-ls'];
const PAROI_LARGE = ['peau', 'graisse', 'oblique-ext', 'oblique-int', 'transverse']; // rendue translucide quand on regarde par-dessus la crête
// Pararectus : droit de l'abdomen en dedans, muscles larges en dehors.
const paraPeau = k => berges(PEAU_PARA, FOND_PARA, [15, 0, 4], k, 40);
const paraParoi = e => ({
  ...charge(['droit-abdomen', 'pyramidal', 'aepigastrique', 'vepigastrique'], lame([[-68, -172, 932], [-31, -150, 826]], [0.96, 0, 0.29], FOND_PARA, e, e * 2.4 + 20, { rayon: 50, profondeur: 40 })),
  ...charge(['oblique-ext', 'oblique-int', 'transverse'], lame([[-68, -172, 932], [-31, -150, 826]], [-0.96, 0, -0.29], FOND_PARA, e, e * 2.4 + 20, { rayon: 50, profondeur: 40 })),
});
// Face externe de l'aile : tenseur du fascia lata et fessiers décollés et réclinés en dehors et en arrière (Smith-Petersen, ilio-fémorale élargie).
const FACE_EXTERNE = [[-118, -100, 955], [-124, -138, 925], [-122, -150, 880], [-124, -140, 830]];
const fessiersDecolles = k => charge(['tfl', 'moyen-fessier', 'petit-fessier', 'nclc'], { dep: [-20 * k, 16 * k, -6 * k], autour: FACE_EXTERNE, rayon: 50 });
const SARTORIUS_EN_DEDANS = charge(['sartorius', 'nfemoral'], { dep: [20, 0, 0], autour: [[-116, -148, 895], [-108, -146, 820]], rayon: 44 });
const DROIT_FEMORAL_DESINSERE = { 'droit-femoral': { autour: [[-106, -112, 880], [-108, -118, 846]], rayon: 16 } };
const CAPSULE_ANT = { capsule: { autour: [[-92, -118, 850], [-104, -112, 815]], rayon: 16 } };
const bergesCuisse = (peau, fond, k) => ({
  ...bergesCrete(peau, fond, k * 0.5),
  ...charge([`peau/${cote(peau, fond, [-1, 0, 0])}`, `graisse/${cote(peau, fond, [-1, 0, 0])}`], { dep: [-20 * k, 4 * k, -6 * k], autour: peau, rayon: 60, fond }),
});

const voies = {
  stoppa: { court: 'Stoppa', titre: 'Voie de Stoppa modifiée (abord intra-pelvien antérieur)', fendre: peauFendue(PEAU_PF, FOND, 'inférieure', 'supérieure'), steps: [
    { titre: 'Installation et incision', vue: 'face',
      texte: 'Décubitus dorsal sur table radio-transparente, sonde urinaire en place (vessie vide), hanche et genou du côté fracturé fléchis sur un coussin pour détendre l’ilio-psoas et les vaisseaux iliaques ; tout le membre est dans le champ. L’opérateur se place du côté opposé à la fracture. Incision de Pfannenstiel : transversale, 2 cm au-dessus de la symphyse pubienne, sur 10 à 12 cm.',
      montrer: ['incision-pf'], masquer: SANS },
    { titre: 'Ligne blanche', vue: 'faceProche',
      texte: 'Peau et tissu sous-cutané sont incisés transversalement ; la gaine antérieure des droits est exposée. La ligne blanche est incisée verticalement, de bas en haut, sur 8 à 10 cm : les deux muscles droits sont séparés, sans être sectionnés. Le fascia transversalis est ouvert juste au-dessus de la symphyse, en restant extra-péritonéal.',
      accent: ['droit-abdomen', 'droit-abdomen-g', 'ligne-blanche'], masquer: SANS, ecarter: peauOuverte(1) },
    { titre: 'Espace rétro-pubien', vue: 'opStoppa',
      texte: 'Le droit du côté fracturé est récliné en dehors et en avant avec les vaisseaux épigastriques inférieurs ; son insertion pubienne peut être relâchée par sa face profonde. L’espace rétro-pubien (Retzius) est ouvert au doigt : la vessie, non figurée ici, est refoulée en arrière et protégée par une valve malléable. La branche pubienne supérieure et la symphyse sont dégagées.',
      accent: ['coxal', 'symphyse', 'droit-abdomen'], danger: ['aepigastrique', 'vepigastrique'], masquer: [...SANS, ...DECOR], ecarter: { ...peauOuverte(1.5), ...droitsEcartes(26, 16) } },
    { titre: 'Corona mortis', vue: 'opStoppaProche',
      texte: 'En suivant la branche pubienne supérieure vers l’arrière, on rencontre à 5 ou 6 cm de la symphyse l’anastomose entre les vaisseaux obturateurs et les vaisseaux épigastriques ou iliaques externes — la corona mortis, présente une fois sur deux à trois, artérielle ou veineuse. Elle est recherchée systématiquement, liée ou clipée avant d’aller plus loin : sectionnée à l’aveugle, elle se rétracte dans le foramen obturé.',
      accent: ['corona-mortis'], danger: ['corona-mortis', 'aobturatrice', 'ailiaque-ext', 'viliaque-ext'], masquer: ['tronc-ls', ...FOND_DU_CHAMP], ecarter: { ...peauOuverte(2.2), ...droitsEcartes(38, 18) } },
    { titre: 'Détroit supérieur et lame quadrilatère', vue: 'opStoppaProche',
      texte: 'Le fascia ilio-pectiné est incisé le long du détroit supérieur. Un écarteur soulève en dehors l’ilio-psoas, les vaisseaux iliaques externes et le nerf fémoral, qu’on ne dissèque pas. Le nerf et les vaisseaux obturateurs, qui longent la paroi vers le foramen obturé, sont repérés et abaissés. L’obturateur interne est décollé en sous-périosté de la lame quadrilatère. En arrière, près de l’articulation sacro-iliaque : le tronc lombo-sacral, sur l’aile du sacrum, et les vaisseaux iliaques internes.',
      accent: ['coxal', 'nobturateur'], danger: ['nobturateur', 'aobturatrice', 'ailiaque-ext', 'viliaque-ext', 'ailiaque-int', 'viliaque-int'], masquer: ['corona-mortis', ...FOND_DU_CHAMP],
      ecarter: { ...peauOuverte(2.2), ...droitsEcartes(38, 18), ...ILIAQUES_SOULEVES, ...OBTURATEUR_ABAISSE }, sectionner: OBTURATEUR_INTERNE_DECOLLE },
    { titre: 'Réduction et plaques', vue: 'opStoppaProche',
      texte: 'La voie montre de l’intérieur la branche pubienne, le détroit supérieur, la lame quadrilatère et la face médiale de la colonne postérieure, jusqu’à la sacro-iliaque. La lame quadrilatère médialisée est repoussée en dehors (pointe-boule, traction latérale sur le col), puis soutenue par une plaque infra-pectinéale posée sous le détroit et une plaque console. Une fenêtre latérale sur la crête iliaque complète l’abord si l’aile est fracturée.',
      accent: ['coxal'], danger: ['nobturateur', 'aobturatrice', 'ailiaque-ext', 'viliaque-ext'], montrer: ['plaque-infra'], masquer: ['corona-mortis', ...FOND_DU_CHAMP],
      ecarter: { ...peauOuverte(2.2), ...droitsEcartes(38, 18), ...ILIAQUES_SOULEVES, ...OBTURATEUR_ABAISSE }, sectionner: OBTURATEUR_INTERNE_DECOLLE },
    { titre: 'Vue intra-pelvienne', vue: 'dedans',
      texte: 'Paroi abdominale retirée, vue de l’intérieur du petit bassin : la plaque infra-pectinéale suit le détroit supérieur, de la symphyse vers la sacro-iliaque ; la plaque console descend sur la lame quadrilatère, en regard du cotyle. Le nerf obturateur croise la lame quadrilatère ; les vaisseaux iliaques externes passent au-dessus du détroit.',
      accent: ['plaque-infra'], danger: ['nobturateur', 'aobturatrice', 'ailiaque-ext', 'viliaque-ext'], montrer: ['plaque-infra'],
      masquer: ['corona-mortis', ...DECOR, 'peau', 'graisse', 'droit-abdomen', 'droit-abdomen-g', 'pyramidal', 'pyramidal-g', 'oblique-ext', 'oblique-int', 'transverse', 'coxal-g', 'femur-g', 'lig-inguinal-g', 'aepigastrique', 'vepigastrique'],
      ecarter: { ...ILIAQUES_SOULEVES, ...OBTURATEUR_ABAISSE }, sectionner: OBTURATEUR_INTERNE_DECOLLE },
  ] },
  pfannenstiel: { court: 'Pfannenstiel', titre: 'Voie de Pfannenstiel (symphyse pubienne)', fendre: peauFendue(PEAU_PF, FOND, 'inférieure', 'supérieure'), steps: [
    { titre: 'Installation et incision', vue: 'face',
      texte: 'Décubitus dorsal, sonde urinaire, les deux membres dans le champ pour les manœuvres de réduction. Incision transversale, 2 cm au-dessus de la symphyse, sur 8 à 10 cm, dans un pli de la peau.',
      montrer: ['incision-pf'], masquer: SANS },
    { titre: 'Ligne blanche', vue: 'faceProche',
      texte: 'La gaine des droits est exposée, puis la ligne blanche incisée verticalement. Dans les disjonctions, un des deux muscles droits est souvent déjà désinséré du pubis par le traumatisme : on n’en désinsère pas davantage.',
      accent: ['droit-abdomen', 'droit-abdomen-g', 'ligne-blanche'], masquer: SANS, ecarter: peauOuverte(1) },
    { titre: 'Symphyse pubienne', vue: 'faceProche',
      texte: 'Les droits sont écartés ; la vessie est refoulée et protégée dans l’espace rétro-pubien. La face supérieure des deux corps du pubis est dégagée jusqu’aux tubercules pubiens. La réduction se fait au davier à pointes ou au davier de Jungbluth sur deux vis, contrôlée de face, en inlet et en outlet.',
      accent: ['symphyse', 'coxal', 'coxal-g'], masquer: [...SANS, ...DECOR], ecarter: { ...peauOuverte(1.5), ...droitsEcartes(22, 22) } },
    { titre: 'Plaque', vue: 'faceProche',
      texte: 'Plaque à quatre ou six trous sur la face supérieure de la symphyse, vis longues dirigées vers le bas dans le corps du pubis ; une seconde plaque antérieure dans les lésions très instables. La lésion postérieure de l’anneau est traitée dans le même temps si elle est instable. Fermeture de la ligne blanche, puis des plans superficiels.',
      accent: ['symphyse'], montrer: ['plaque-symphyse'], masquer: [...SANS, ...DECOR], ecarter: { ...peauOuverte(1.5), ...droitsEcartes(22, 22) } },
  ] },
  ilioinguinale: { court: 'Ilio-inguinale', titre: 'Voie ilio-inguinale (Letournel)', fendre: peauFendue(PEAU_II, FOND_II, 'supérieure', 'inférieure'), steps: [
    { titre: 'Installation et incision', vue: 'opII',
      texte: 'Décubitus dorsal, sonde urinaire, membre libre dans le champ, hanche fléchie pour détendre l’ilio-psoas et les vaisseaux. L’incision suit les deux tiers antérieurs de la crête iliaque, passe sur l’épine iliaque antéro-supérieure, puis longe le ligament inguinal jusqu’à 2 cm au-dessus de la symphyse, sur la ligne médiane.',
      montrer: ['incision-ii'], danger: ['nclc'], masquer: SANS },
    { titre: 'Paroi abdominale et canal inguinal', vue: 'opII',
      texte: 'Sur la crête, les muscles larges et l’iliaque sont désinsérés d’un seul tenant. En avant, l’aponévrose de l’oblique externe est ouverte dans l’axe de ses fibres jusqu’à l’anneau inguinal superficiel ; le cordon spermatique (ou le ligament rond) est isolé sur un lacs. Le tendon conjoint et le fascia transversalis sont incisés au ras du ligament inguinal. Le nerf cutané latéral de la cuisse, près de l’épine iliaque antéro-supérieure, est repéré.',
      accent: ['oblique-ext', 'lig-inguinal'], danger: ['nclc', 'nilio-inguinal'], masquer: SANS, ecarter: { ...bergesCrete(PEAU_II, FOND_II, 0.6), ...paroiReclinee(0.5) } },
    { titre: 'Fenêtre latérale : fosse iliaque', vue: 'opFosse',
      texte: 'Première fenêtre, en dehors de l’ilio-psoas : l’iliaque est décollé de la fosse iliaque interne et récliné en dedans. Elle montre l’aile iliaque, la sacro-iliaque antérieure et la partie haute du détroit supérieur. En arrière, l’artère nourricière de l’aile saigne : cire à os.',
      accent: ['coxal', 'iliaque'], danger: ['nclc', 'nfemoral'], voiler: PAROI_LARGE, masquer: SANS, ecarter: { ...bergesCrete(PEAU_II, FOND_II, 1), ...paroiReclinee(1.3), ...iliaqueDecolle(1) } },
    { titre: 'Fenêtre moyenne : bandelette ilio-pectinée', vue: 'opIIProche',
      texte: 'La bandelette ilio-pectinée sépare la lacune musculaire (ilio-psoas et nerf fémoral) de la lacune vasculaire (vaisseaux iliaques externes et lymphatiques). Elle est sectionnée jusqu’à l’éminence ilio-pectinée : c’est la clef de la voie. La deuxième fenêtre, entre l’ilio-psoas récliné en dehors et les vaisseaux réclinés en dedans sur un lacs, montre le détroit supérieur, la paroi antérieure et la lame quadrilatère. La corona mortis est recherchée en arrière de la branche pubienne.',
      accent: ['arcade-iliopectinee', 'coxal'], danger: ['ailiaque-ext', 'viliaque-ext', 'nfemoral', 'corona-mortis', 'nobturateur'], masquer: ['tronc-ls'],
      ecarter: { ...bergesCrete(PEAU_II, FOND_II, 1), ...paroiReclinee(1), ...iliaqueDecolle(0.5), ...VAISSEAUX_EN_DEDANS }, sectionner: BANDELETTE },
    { titre: 'Fenêtre médiale', vue: 'opIIProche',
      texte: 'Troisième fenêtre, en dedans des vaisseaux iliaques externes : le droit de l’abdomen est récliné en dedans (ou désinséré du pubis), l’espace rétro-pubien ouvert, la vessie protégée. Elle montre la branche pubienne supérieure et la symphyse.',
      accent: ['coxal', 'symphyse'], danger: ['ailiaque-ext', 'viliaque-ext', 'corona-mortis'], masquer: ['tronc-ls'],
      ecarter: { ...bergesCrete(PEAU_II, FOND_II, 1), ...paroiReclinee(1), ...DROIT_EN_DEDANS }, sectionner: BANDELETTE },
    { titre: 'Plaque supra-pectinéale', vue: 'dedans',
      texte: 'Paroi abdominale retirée : la plaque de reconstruction, galbée, suit le détroit supérieur de la symphyse à la sacro-iliaque, en passant sous l’ilio-psoas et les vaisseaux iliaques externes. Les vis en regard du cotyle sont proscrites ou dirigées parallèlement à la lame quadrilatère. La colonne antérieure est réduite d’arrière en avant : aile iliaque, puis détroit, puis pubis.',
      accent: ['plaque-supra'], danger: ['ailiaque-ext', 'viliaque-ext', 'nfemoral', 'nobturateur'], montrer: ['plaque-supra'], masquer: [...SANS, ...PAROI], ecarter: ILIAQUES_SOULEVES, sectionner: BANDELETTE },
  ] },
  pararectus: { court: 'Pararectus', titre: 'Voie pararectus', fendre: peauFendue(PEAU_PARA, FOND_PARA, 'médiale', 'latérale'), steps: [
    { titre: 'Installation et incision', vue: 'opPara',
      texte: 'Décubitus dorsal, sonde urinaire, membre libre dans le champ. Incision verticale le long du bord latéral du muscle droit de l’abdomen : elle part de la jonction des tiers latéral et moyen de la ligne ombilic – épine iliaque antéro-supérieure et descend vers le tiers médial du ligament inguinal.',
      montrer: ['incision-para'], masquer: SANS },
    { titre: 'Bord latéral du droit', vue: 'opPara',
      texte: 'La gaine antérieure du droit est incisée sur son bord latéral ; le droit est récliné en dedans, les muscles larges en dehors. Le fascia transversalis est ouvert en restant extra-péritonéal : le sac péritonéal est refoulé en dedans et en haut. Les vaisseaux épigastriques inférieurs croisent le bas de l’incision : ils sont liés ou réclinés ; le cordon spermatique est mis sur lacs.',
      accent: ['droit-abdomen', 'oblique-ext'], danger: ['aepigastrique', 'vepigastrique'], masquer: SANS, ecarter: { ...paraPeau(1), ...paraParoi(14) } },
    { titre: 'Cinq fenêtres', vue: 'opPara',
      texte: 'L’espace extra-péritonéal donne cinq fenêtres, en déplaçant les écarteurs : en dehors de l’ilio-psoas (fosse iliaque) ; entre l’ilio-psoas et les vaisseaux iliaques externes ; entre les vaisseaux et le cordon ; en dedans du cordon (branche pubienne, symphyse) ; et, sous le détroit, la lame quadrilatère. La voie réunit ainsi l’accès de l’ilio-inguinale et la vue intra-pelvienne de Stoppa, par une incision située à l’aplomb du cotyle. La paroi est ici translucide.',
      accent: ['coxal', 'psoas'], danger: ['ailiaque-ext', 'viliaque-ext', 'nobturateur', 'aobturatrice', 'corona-mortis'], voiler: PAROI_LARGE, masquer: ['tronc-ls', 'droit-abdomen-g', 'pyramidal-g', 'ligne-blanche'],
      ecarter: { ...paraPeau(1.7), ...paraParoi(26), ...ILIAQUES_SOULEVES, ...OBTURATEUR_ABAISSE }, sectionner: OBTURATEUR_INTERNE_DECOLLE },
    { titre: 'Plaques', vue: 'dedans',
      texte: 'Paroi retirée, vue de l’intérieur : plaque infra-pectinéale et plaque console sur la lame quadrilatère, comme par la voie de Stoppa ; une plaque supra-pectinéale peut être ajoutée par les fenêtres hautes. Le nerf obturateur et les vaisseaux iliaques externes sont sous les yeux pendant tout le vissage.',
      accent: ['plaque-infra'], danger: ['nobturateur', 'aobturatrice', 'ailiaque-ext', 'viliaque-ext'], montrer: ['plaque-infra'], masquer: [...SANS, ...PAROI],
      ecarter: { ...ILIAQUES_SOULEVES, ...OBTURATEUR_ABAISSE }, sectionner: OBTURATEUR_INTERNE_DECOLLE },
  ] },
  si: { court: 'Sacro-iliaque', titre: 'Abord antérieur de la sacro-iliaque (fenêtre latérale)', fendre: peauFendue(PEAU_SI, FOND_CRETE, 'supérieure', 'inférieure'), steps: [
    { titre: 'Installation et incision', vue: 'opCrete',
      texte: 'Décubitus dorsal, coussin sous la fesse, membre libre dans le champ, hanche fléchie. Incision le long de la moitié antérieure de la crête iliaque, à partir de l’épine iliaque antéro-supérieure, prolongée en arrière au-delà du point le plus haut de la crête.',
      montrer: ['incision-si'], danger: ['nclc'], masquer: SANS },
    { titre: 'Crête iliaque', vue: 'opCrete',
      texte: 'L’incision va jusqu’à l’os entre l’insertion des muscles larges de l’abdomen, en dedans, et celle des fessiers, en dehors : plan avasculaire. Les muscles de la paroi sont désinsérés de la crête.',
      accent: ['coxal', 'oblique-ext'], danger: ['nclc'], masquer: SANS, ecarter: { ...bergesCrete(PEAU_SI, FOND_CRETE, 0.6), ...paroiReclinee(0.5) } },
    { titre: 'Fosse iliaque et sacro-iliaque', vue: 'opFosse',
      texte: 'L’iliaque est décollé en sous-périosté de la fosse iliaque interne, de dehors en dedans, jusqu’à l’interligne sacro-iliaque, puis sur l’aileron sacré. On ne dépasse pas 1,5 à 2 cm en dedans de l’interligne : le tronc lombo-sacral (racine L5) descend sur l’aileron, plaqué à l’os, et s’étire sous un écarteur. Deux broches ou un écarteur pointu fichés dans l’aileron tiennent le muscle.',
      accent: ['coxal', 'sacrum', 'lsi-ant'], danger: ['tronc-ls', 'ailiaque-com', 'viliaque-com'], voiler: PAROI_LARGE, masquer: ['corona-mortis'],
      ecarter: { ...bergesCrete(PEAU_SI, FOND_CRETE, 1), ...paroiReclinee(1.3), ...iliaqueDecolle(1.1) } },
    { titre: 'Réduction et plaques', vue: 'fosse',
      texte: 'Paroi et muscle iliaque retirés : la disjonction est réduite (traction sur le membre, davier sur l’aile et l’aileron), puis fixée par deux plaques courtes à trois ou quatre trous, divergentes, avec une seule vis dans l’aileron sacré pour chacune — dirigée parallèlement à l’interligne. Une fracture de l’aile (« en croissant ») se fixe par la même voie.',
      accent: ['plaque-si'], danger: ['tronc-ls', 'ailiaque-com', 'viliaque-com'], montrer: ['plaque-si'], masquer: ['corona-mortis', ...PAROI, 'iliaque', 'nfemoral', 'nclc'], ecarter: charge(['psoas'], { dep: [22, 6, 0], autour: FOSSE, rayon: 58 }) },
  ] },
  iliofemorale: { court: 'Ilio-fémorale', titre: 'Voie ilio-fémorale (et élargie)', fendre: peauFendue(PEAU_IF, FOND_CRETE, 'médiale', 'latérale'), steps: [
    { titre: 'Installation et incision', vue: 'opIF',
      texte: 'Décubitus dorsal avec un coussin sous la fesse, ou latéral pour la forme élargie. L’incision suit la moitié antérieure de la crête iliaque jusqu’à l’épine iliaque antéro-supérieure, puis descend sur 10 à 15 cm à la face antéro-latérale de la cuisse, vers le bord latéral de la patella.',
      montrer: ['incision-if'], danger: ['nclc'], masquer: SANS },
    { titre: 'Crête et intervalle sartorius / tenseur', vue: 'opIF',
      texte: 'Sur la crête, les muscles de la paroi et l’iliaque sont désinsérés en dedans. Sous l’épine, l’intervalle entre sartorius et tenseur du fascia lata est ouvert ; le nerf cutané latéral de la cuisse, qui croise le sartorius, part en dedans avec lui.',
      accent: ['sartorius', 'tfl', 'coxal'], danger: ['nclc'], masquer: SANS, ecarter: { ...bergesCuisse(PEAU_IF, FOND_CRETE, 0.8), ...paroiReclinee(0.5), ...SARTORIUS_EN_DEDANS } },
    { titre: 'Face interne de l’aile et colonne antérieure', vue: 'opFosse',
      texte: 'L’iliaque est décollé de la fosse iliaque interne jusqu’à la sacro-iliaque et au détroit supérieur ; le droit fémoral est désinséré de l’épine iliaque antéro-inférieure et du sourcil. L’aile iliaque, la colonne antérieure haute et la face antérieure de la capsule sont exposées. Le nerf fémoral, sur l’ilio-psoas, est récliné en dedans avec lui.',
      accent: ['coxal', 'capsule'], danger: ['nfemoral', 'nclc', 'ailiaque-ext'], voiler: PAROI_LARGE, masquer: SANS,
      ecarter: { ...bergesCuisse(PEAU_IF, FOND_CRETE, 1), ...paroiReclinee(1.3), ...iliaqueDecolle(1), ...SARTORIUS_EN_DEDANS }, sectionner: DROIT_FEMORAL_DESINSERE },
    { titre: 'Forme élargie : face externe de l’aile', vue: 'opIFProche',
      texte: 'Dans la voie ilio-fémorale élargie de Letournel, le tenseur du fascia lata et les fessiers sont en plus désinsérés de la face externe de l’aile et rabattus en arrière sur leur pédicule glutéal supérieur, qu’il ne faut ni étirer ni lier ; les tendons du moyen et du petit fessier sont sectionnés au trochanter. Elle expose les deux colonnes par une seule incision, au prix d’ossifications et d’une faiblesse des abducteurs : elle est réservée aux fractures complexes vues tard.',
      accent: ['coxal', 'moyen-fessier', 'tfl'], danger: ['aglutealsup', 'nglutealsup', 'nclc'], masquer: SANS,
      ecarter: { ...bergesCuisse(PEAU_IF, FOND_CRETE, 1.3), ...paroiReclinee(1), ...iliaqueDecolle(1), ...SARTORIUS_EN_DEDANS, ...fessiersDecolles(1.3) }, sectionner: DROIT_FEMORAL_DESINSERE },
  ] },
  sp: { court: 'Smith-Petersen', titre: 'Voie antérieure de Smith-Petersen', fendre: peauFendue(PEAU_IF, FOND_CRETE, 'médiale', 'latérale'), steps: [
    { titre: 'Installation et incision', vue: 'opIF',
      texte: 'Décubitus dorsal, coussin sous la fesse. L’incision longe la moitié antérieure de la crête iliaque jusqu’à l’épine iliaque antéro-supérieure, puis descend verticalement sur 8 à 10 cm : la voie de Hueter n’en est que la partie basse.',
      montrer: ['incision-if'], danger: ['nclc'], masquer: SANS },
    { titre: 'Plan superficiel : sartorius / tenseur du fascia lata', vue: 'opIF',
      texte: 'Plan internerveux superficiel entre le sartorius (nerf fémoral) et le tenseur du fascia lata (nerf glutéal supérieur). Le nerf cutané latéral de la cuisse perfore le fascia près de l’épine, sur le sartorius : il est récliné en dedans. La branche ascendante de l’artère circonflexe latérale croise le bas du champ : elle est liée.',
      accent: ['sartorius', 'tfl'], danger: ['nclc'], masquer: SANS, ecarter: { ...bergesCuisse(PEAU_IF, FOND_CRETE, 0.8), ...SARTORIUS_EN_DEDANS, ...fessiersDecolles(0.5) } },
    { titre: 'Face externe de l’aile', vue: 'opIFProche',
      texte: 'Le tenseur du fascia lata, puis le moyen et le petit fessier, sont désinsérés de la crête et de la face externe de l’aile iliaque, en sous-périosté, et réclinés en dehors et en arrière. L’hémostase des artères nourricières se fait à la cire. C’est ce temps qui distingue la voie de Smith-Petersen de celle de Hueter.',
      accent: ['coxal', 'tfl', 'moyen-fessier'], danger: ['nclc', 'nglutealsup'], masquer: SANS, ecarter: { ...bergesCuisse(PEAU_IF, FOND_CRETE, 1.2), ...SARTORIUS_EN_DEDANS, ...fessiersDecolles(1.3) } },
    { titre: 'Plan profond : droit fémoral / moyen fessier', vue: 'opIFProche',
      texte: 'Plan profond entre le droit fémoral (nerf fémoral) et le moyen fessier (nerf glutéal supérieur). Les deux tendons du droit fémoral — direct sur l’épine iliaque antéro-inférieure, réfléchi sur le sourcil cotyloïdien — sont sectionnés et le muscle rabattu vers le bas. L’ilio-psoas est décollé de la capsule et récliné en dedans.',
      accent: ['droit-femoral', 'capsule'], danger: ['nfemoral', 'afemorale', 'vfemorale'], masquer: SANS,
      ecarter: { ...bergesCuisse(PEAU_IF, FOND_CRETE, 1.2), ...SARTORIUS_EN_DEDANS, ...fessiersDecolles(1.3), ...charge(['psoas', 'iliaque'], { dep: [14, 0, 0], autour: [[-92, -118, 850], [-100, -112, 815]], rayon: 36 }) }, sectionner: DROIT_FEMORAL_DESINSERE },
    { titre: 'Capsule et articulation', vue: 'opIFProche',
      texte: 'La capsule antérieure est ouverte en T ou en H : la tête fémorale, le col et le rebord antérieur du cotyle sont exposés. Indications : arthrotomie, luxation congénitale et ostéotomies pelviennes de l’enfant, biopsies et tumeurs, fractures de la tête fémorale, ostéotomie péri-acétabulaire. Le droit fémoral est réinséré à la fermeture.',
      accent: ['femur', 'coxal', 'capsule'], danger: ['nfemoral', 'afemorale', 'vfemorale'], masquer: SANS,
      ecarter: { ...bergesCuisse(PEAU_IF, FOND_CRETE, 1.2), ...SARTORIUS_EN_DEDANS, ...fessiersDecolles(1.3), ...charge(['psoas', 'iliaque'], { dep: [14, 0, 0], autour: [[-92, -118, 850], [-100, -112, 815]], rayon: 36 }) }, sectionner: { ...DROIT_FEMORAL_DESINSERE, ...CAPSULE_ANT } },
  ] },
};

export default { nom: 'Bassin', graisse: 8, centre, vues, meshes, tubes, rubans, groupes, voies };
