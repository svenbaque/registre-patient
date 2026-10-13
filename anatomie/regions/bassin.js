// Bassin — voies antérieures : Stoppa modifiée (intra-pelvienne) et Pfannenstiel (symphyse pubienne).
// Repère BodyParts3D, en millimètres : x = droite du patient (-) / gauche (+), y = avant (-) / arrière (+), z = vers le haut.
// Les viscères (vessie, péritoine) ne font pas partie du modèle : ils sont décrits dans le texte.
import pieces from './bassin.pieces.js';
import { peauFendue, berges, charge, lame } from './outils.js';

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
const tubes = [
  ['incision-pf', 'Incision de Pfannenstiel', 'incisions', '#35e0c8', 1.4, PEAU_PF.map(([x, y, z]) => [x, y - 2.5, z])],
  ['corona-mortis', 'Corona mortis (anastomose obturatrice – épigastrique, tracé)', 'vaisseaux', '#e0392b', 1.3, [[-52, -124, 853], [-50.5, -117, 840], [-47.5, -111, 826], [-44.5, -109, 813]]],
  visPlaque('plaque-infra', 1, [-31, -131, 824], [-0.8, 0.3, -0.5], 22), visPlaque('plaque-infra', 2, [-48, -115, 838], [-1, 0.1, 0.1], 20),
  visPlaque('plaque-infra', 3, [-51, -80, 858], [-0.9, 0.2, 0.4], 30), visPlaque('plaque-infra', 4, [-46, -62, 872], [-0.9, 0.3, 0.3], 34),
  visPlaque('plaque-symphyse', 1, [-28, -138, 824], [0, 0.15, -1], 26), visPlaque('plaque-symphyse', 2, [-14, -142, 819], [0, 0.15, -1], 24),
  visPlaque('plaque-symphyse', 3, [14, -142, 819], [0, 0.15, -1], 24), visPlaque('plaque-symphyse', 4, [28, -138, 824], [0, 0.15, -1], 26),
];
const rubans = [
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

const voies = {
  stoppa: { court: 'Stoppa', titre: 'Voie de Stoppa modifiée (abord intra-pelvien antérieur)', fendre: peauFendue(PEAU_PF, FOND, 'inférieure', 'supérieure'), steps: [
    { titre: 'Installation et incision', vue: 'face',
      texte: 'Décubitus dorsal sur table radio-transparente, sonde urinaire en place (vessie vide), hanche et genou du côté fracturé fléchis sur un coussin pour détendre l’ilio-psoas et les vaisseaux iliaques ; tout le membre est dans le champ. L’opérateur se place du côté opposé à la fracture. Incision de Pfannenstiel : transversale, 2 cm au-dessus de la symphyse pubienne, sur 10 à 12 cm.',
      montrer: ['incision-pf'], masquer: ['corona-mortis'] },
    { titre: 'Ligne blanche', vue: 'faceProche',
      texte: 'Peau et tissu sous-cutané sont incisés transversalement ; la gaine antérieure des droits est exposée. La ligne blanche est incisée verticalement, de bas en haut, sur 8 à 10 cm : les deux muscles droits sont séparés, sans être sectionnés. Le fascia transversalis est ouvert juste au-dessus de la symphyse, en restant extra-péritonéal.',
      accent: ['droit-abdomen', 'droit-abdomen-g', 'ligne-blanche'], masquer: ['corona-mortis'], ecarter: peauOuverte(1) },
    { titre: 'Espace rétro-pubien', vue: 'opStoppa',
      texte: 'Le droit du côté fracturé est récliné en dehors et en avant avec les vaisseaux épigastriques inférieurs ; son insertion pubienne peut être relâchée par sa face profonde. L’espace rétro-pubien (Retzius) est ouvert au doigt : la vessie, non figurée ici, est refoulée en arrière et protégée par une valve malléable. La branche pubienne supérieure et la symphyse sont dégagées.',
      accent: ['coxal', 'symphyse', 'droit-abdomen'], danger: ['aepigastrique', 'vepigastrique'], masquer: ['corona-mortis', ...DECOR], ecarter: { ...peauOuverte(1.5), ...droitsEcartes(26, 16) } },
    { titre: 'Corona mortis', vue: 'opStoppaProche',
      texte: 'En suivant la branche pubienne supérieure vers l’arrière, on rencontre à 5 ou 6 cm de la symphyse l’anastomose entre les vaisseaux obturateurs et les vaisseaux épigastriques ou iliaques externes — la corona mortis, présente une fois sur deux à trois, artérielle ou veineuse. Elle est recherchée systématiquement, liée ou clipée avant d’aller plus loin : sectionnée à l’aveugle, elle se rétracte dans le foramen obturé.',
      accent: ['corona-mortis'], danger: ['corona-mortis', 'aobturatrice', 'ailiaque-ext', 'viliaque-ext'], masquer: FOND_DU_CHAMP, ecarter: { ...peauOuverte(2.2), ...droitsEcartes(38, 18) } },
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
      montrer: ['incision-pf'], masquer: ['corona-mortis'] },
    { titre: 'Ligne blanche', vue: 'faceProche',
      texte: 'La gaine des droits est exposée, puis la ligne blanche incisée verticalement. Dans les disjonctions, un des deux muscles droits est souvent déjà désinséré du pubis par le traumatisme : on n’en désinsère pas davantage.',
      accent: ['droit-abdomen', 'droit-abdomen-g', 'ligne-blanche'], masquer: ['corona-mortis'], ecarter: peauOuverte(1) },
    { titre: 'Symphyse pubienne', vue: 'faceProche',
      texte: 'Les droits sont écartés ; la vessie est refoulée et protégée dans l’espace rétro-pubien. La face supérieure des deux corps du pubis est dégagée jusqu’aux tubercules pubiens. La réduction se fait au davier à pointes ou au davier de Jungbluth sur deux vis, contrôlée de face, en inlet et en outlet.',
      accent: ['symphyse', 'coxal', 'coxal-g'], masquer: ['corona-mortis', ...DECOR], ecarter: { ...peauOuverte(1.5), ...droitsEcartes(22, 22) } },
    { titre: 'Plaque', vue: 'faceProche',
      texte: 'Plaque à quatre ou six trous sur la face supérieure de la symphyse, vis longues dirigées vers le bas dans le corps du pubis ; une seconde plaque antérieure dans les lésions très instables. La lésion postérieure de l’anneau est traitée dans le même temps si elle est instable. Fermeture de la ligne blanche, puis des plans superficiels.',
      accent: ['symphyse'], montrer: ['plaque-symphyse'], masquer: ['corona-mortis', ...DECOR], ecarter: { ...peauOuverte(1.5), ...droitsEcartes(22, 22) } },
  ] },
};

export default { nom: 'Bassin', graisse: 8, centre, vues, meshes, tubes, rubans, groupes, voies };
