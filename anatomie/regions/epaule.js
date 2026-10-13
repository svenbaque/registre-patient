// Épaule droite — voie delto-pectorale, abord direct de la clavicule, voie supéro-latérale transdeltoïdienne.
// Repère BodyParts3D, en millimètres : x = latéral (-) / médial (+), y = avant (-) / arrière (+), z = vers le haut.
import pieces from './epaule.pieces.js';
import { peauFendue, berges, charge, lame, deuxBerges } from './outils.js';

const meshes = [
  ['peau-epaule', 'Peau', 'peau', '#e2b596', { id: 'peau', dossier: 'models-z' }],
  ...pieces,
];

// Incision : une seule ligne, de la coracoïde vers l'insertion du deltoïde, sur le sillon delto-pectoral (trajet de la veine céphalique).
const PEAU_DP = [[-135, -110, 1335], [-150, -123, 1315], [-165, -124, 1295], [-178, -122, 1275], [-188, -115, 1255], [-196, -112, 1235]];
const SILLON = [[-140, -114, 1322], [-197, -94, 1242]]; // la même ligne, au fond, entre deltoïde et grand pectoral
const FOND = [0.3, 0.95, 0];
const N_MED = [0.76, -0.24, -0.6]; // perpendiculaire au sillon, vers le thorax
const N_LAT = [-0.76, 0.24, 0.6];  // perpendiculaire au sillon, vers le moignon de l'épaule

// Tracés à la main : incision, plaque et vis.
const TETE = [-166, -72, 1322];
const visTete = (n, x, y, z, vers) => [`plaque/vis-t${n}`, 'Vis verrouillée céphalique', 'implants', '#cfd6dd', 1.7, [[x, y, z], [(x + vers[0]) / 2, (y + vers[1]) / 2, (z + vers[2]) / 2], vers]];
const visDiaphyse = (n, x, y, z) => [`plaque/vis-d${n}`, 'Vis corticale diaphysaire', 'implants', '#cfd6dd', 1.7, [[x - 1, y - 1, z], [x + 9, y + 7, z], [x + 18, y + 14, z]]];
// ----- Clavicule : incision le long de l'os, sur son bord antéro-supérieur -----
const PEAU_CLAV = [[-53, -138, 1364], [-60, -135, 1366], [-72, -125, 1365], [-85, -113, 1369], [-100, -90, 1373], [-116, -78, 1380], [-132, -68, 1374]];
const FOND_CLAV = [0, 0.5, -0.87];
const CLAV_OS = [[-60, -129, 1356], [-72, -120, 1357.5], [-85, -106, 1360], [-100, -85, 1365], [-115, -70, 1366.5], [-128, -64, 1366.5]]; // face supérieure de la clavicule
const visClav = (n, x, y, z) => [`plaque-clav/vis${n}`, 'Vis corticale', 'implants', '#cfd6dd', 1.5, [[x, y, z + 2], [x, y + 1, z - 6], [x, y + 2, z - 13]]];
// ----- Voie transdeltoïdienne : de l'angle antéro-latéral de l'acromion vers le bas, sur le raphé entre faisceaux antérieur et moyen -----
const PEAU_TD = [[-179, -79, 1356], [-188, -83, 1352], [-201, -92, 1341], [-204, -95, 1330], [-208, -96, 1319], [-214, -98, 1303], [-212, -99, 1290]];
const RAPHE = [[-180, -84, 1352], [-202, -96, 1302]];
const FOND_TD = [0.82, 0.57, 0];
const N_TD_AVANT = [0.57, -0.82, -0.06];
const N_TD_ARRIERE = [-0.57, 0.82, 0.06];
const tubes = [
  ['incision-td', 'Incision — voie supéro-latérale', 'incisions', '#35e0c8', 1.3, PEAU_TD.map(([x, y, z]) => [x - 2, y - 1.4, z + 0.5])],
  ['clou-humerus', 'Clou huméral proximal', 'implants', '#b9c2cc', 4.5, [[-172, -72, 1346], [-173, -73, 1310], [-180, -72, 1275], [-189, -70.5, 1245], [-195, -68, 1215], [-197, -64, 1190]]],
  ['clou-humerus/vis1', 'Vis céphalique', 'implants', '#cfd6dd', 1.8, [[-192, -80, 1328], [-170, -72, 1326], [-150, -64, 1324]]],
  ['clou-humerus/vis2', 'Vis céphalique', 'implants', '#cfd6dd', 1.8, [[-190, -62, 1316], [-172, -72, 1314], [-154, -84, 1312]]],
  ['clou-humerus/vis3', 'Vis de verrouillage distal', 'implants', '#cfd6dd', 1.8, [[-207, -74, 1208], [-195, -67, 1208], [-184, -60, 1208]]],
  ['incision-clav', 'Incision — abord direct de la clavicule', 'incisions', '#35e0c8', 1.3, PEAU_CLAV.map(([x, y, z]) => [x, y - 1.5, z + 2.6])],
  visClav(1, -63, -127, 1356.5), visClav(2, -70, -121.5, 1357.5), visClav(3, -77, -115, 1358.5), visClav(4, -96, -91, 1364), visClav(5, -105, -80, 1365.5), visClav(6, -114, -71, 1366.5),
  ['incision-dp', 'Incision — voie delto-pectorale', 'incisions', '#35e0c8', 1.4, PEAU_DP.map(([x, y, z]) => [x - 1, y - 3.5, z])],
  visTete(1, -189, -85, 1330, [-160, -66, 1334]), visTete(2, -190, -85, 1320, [-152, -70, 1326]), visTete(3, -191, -84, 1310, [-158, -62, 1318]),
  visTete(4, -192, -84, 1298, [-152, -72, 1312]), visTete(5, -193, -83, 1288, [-150, -68, 1306]),
  visDiaphyse(1, -197, -81, 1262), visDiaphyse(2, -200, -80, 1244), visDiaphyse(3, -203, -79, 1226),
];
const rubans = [
  ['plaque-clav', 'Plaque supérieure de la clavicule', 'implants', '#b9c2cc', CLAV_OS.map(([x, y, z]) => [x, y, z + 1.6]), 10, 2.8, [0.72, 0.69, 0]],
  ['plaque', 'Plaque verrouillée d’humérus proximal', 'implants', '#b9c2cc', [[-188.5, -86, 1336], [-190.5, -86, 1312], [-193.5, -84, 1284], [-198, -82, 1254], [-203.5, -80, 1218]], 13, 2.6, [0.6, -0.8, 0]],
];

const groupes = [
  ['peau', 'Peau'], ['graisse', 'Tissu sous-cutané'], ['os', 'Os'], ['deltoide', 'Deltoïde'], ['pectoraux', 'Pectoraux'], ['conjoint', 'Tendon conjoint et biceps'],
  ['coiffe', 'Coiffe, ronds et grand dorsal'], ['bras', 'Bras'], ['ligaments', 'Capsule et ligaments'], ['vaisseaux', 'Artères et veines'], ['nerfs', 'Nerfs'],
  ['incisions', 'Incisions'], ['implants', 'Plaque et vis'],
];

const centre = [-165, -88, 1295];
const SITE = [-172, -100, 1285];
const vues = {
  // position demi-assise : l'opérateur est en avant et en dehors de l'épaule, tête du patient en haut
  op: { de: [-70, -400, 50], cible: SITE }, opProche: { de: [-70, -245, 25], cible: SITE },
  opLateral: { de: [-185, -200, 25], cible: [-180, -90, 1285] },
  // position demi-assise, tête tournée du côté opposé : l'opérateur regarde la clavicule d'en haut et d'en avant, épaule à gauche
  opClav: { de: [10, -250, 215], cible: [-92, -102, 1360] }, opClavProche: { de: [5, -150, 135], cible: [-92, -102, 1360] },
  // position demi-assise : l'opérateur regarde le moignon de l'épaule par le dehors et l'avant
  opTD: { de: [-300, -175, 60], cible: [-190, -86, 1325] }, opTDProche: { de: [-185, -110, 45], cible: [-190, -86, 1325] },
  libre: { de: [-330, -330, 120] },
};
const IMPLANTS = ['plaque', 'plaque-clav', 'clou-humerus'];

// Écarteurs : deux lames parallèles au sillon. Aucun muscle n'est incisé ; chacun reste attaché à ses insertions.
const opts = { rayon: 28, profondeur: 46 };
const DELTOIDE = ['deltoide-ant', 'deltoide-moy', 'cephalique']; // la veine céphalique part en dehors avec le deltoïde
const PECTORAL = ['pectoral-clav', 'pectoral-sterno', 'pectoral-abdo'];
const CONJOINT = ['coracobrachial', 'biceps-court', 'musculocutane']; // le nerf musculo-cutané part avec le tendon conjoint
// Peau : berge /A médiale, /B latérale. L'humérus est sous le deltoïde, en dehors du sillon : l'exposition se gagne surtout en dehors.
const PEAU_DROITE = [[-140, -119, 1326], [-196, -112, 1238]];
const optsPeau = { rayon: 22, profondeur: 30 };
const peauOuverte = (dehors, dedans) => ({
  ...charge(['peau/B', 'graisse/B'], lame(PEAU_DROITE, N_LAT, FOND, dehors, dehors * 2.4 + 10, optsPeau)),
  ...charge(['peau/A', 'graisse/A'], lame(PEAU_DROITE, N_MED, FOND, dedans, dedans * 2.4 + 10, optsPeau)),
});
const sillon = (dehors, dedans) => ({
  ...charge(DELTOIDE, lame(SILLON, N_LAT, FOND, dehors, dehors * 2.4 + 12, opts)),
  ...charge(PECTORAL, lame(SILLON, N_MED, FOND, dedans, dedans * 2.4 + 12, opts)),
});
const CONJOINT_EN_DEDANS = charge(CONJOINT, lame(SILLON, N_MED, FOND, 9, 50, { rayon: 26, profondeur: 62 }));

// Clavicule : la peau et le platysma s'ouvrent sur la même ligne et sont levés d'un seul tenant (lambeau myo-cutané).
const LEVRE_CLAV = [-0.69, -0.62, -0.36]; // de l'incision vers le bas et l'avant
const clavOuverte = k => ({
  ...berges(PEAU_CLAV, FOND_CLAV, LEVRE_CLAV.map(c => c * 11), k, 26),
  'platysma/A': { dep: LEVRE_CLAV.map(c => c * 10 * k), autour: PEAU_CLAV, rayon: 24, fond: FOND_CLAV },
  'platysma/B': { dep: LEVRE_CLAV.map(c => -c * 10 * k), autour: PEAU_CLAV, rayon: 24, fond: FOND_CLAV },
});
const fendreClav = [
  ...peauFendue(PEAU_CLAV, FOND_CLAV, 'antéro-inférieure', 'postéro-supérieure'),
  ['platysma', { ligne: PEAU_CLAV, fond: FOND_CLAV, rayon: 22 }, 'Platysma — berge antéro-inférieure', 'Platysma — berge postéro-supérieure'],
];
const SOUS_CLAVIERS = ['vsubclaviere', 'asubclaviere', 'tronc-sup', 'vaxillaire', 'aaxillaire'];

// Voie transdeltoïdienne : peau puis deltoïde s'ouvrent sur la même ligne ; la fente du deltoïde ne dépasse pas 5 cm sous l'acromion.
const PEAU_TD_DROITE = [PEAU_TD[0], PEAU_TD[PEAU_TD.length - 1]];
const tdPeau = e => deuxBerges(PEAU_TD, FOND_TD,
  { vers: N_TD_AVANT, lame: lame(PEAU_TD_DROITE, N_TD_AVANT, FOND_TD, e, e * 2.4 + 8, { rayon: 20, profondeur: 22 }) },
  { vers: N_TD_ARRIERE, lame: lame(PEAU_TD_DROITE, N_TD_ARRIERE, FOND_TD, e, e * 2.4 + 8, { rayon: 20, profondeur: 22 }) });
const deltoideFendu = e => ({
  'deltoide-ant': lame(RAPHE, N_TD_AVANT, FOND_TD, e, e * 2.4 + 10, { rayon: 16, profondeur: 30 }),
  'deltoide-moy': lame(RAPHE, N_TD_ARRIERE, FOND_TD, e, e * 2.4 + 10, { rayon: 16, profondeur: 30 }),
});
const DECOR_TD = ['platysma', 'cephalique'];

const voies = {
  clavicule: { court: 'Clavicule', titre: 'Abord direct de la clavicule', fendre: fendreClav, steps: [
    { titre: 'Installation et incision', vue: 'opClav',
      texte: 'Position demi-assise, coussin entre les omoplates, tête tournée du côté opposé, bras libre dans le champ. Incision le long de la clavicule, centrée sur le foyer, sur son bord antéro-supérieur ou un travers de doigt en dessous pour que la cicatrice ne repose pas sur la plaque.',
      montrer: ['incision-clav'], danger: SOUS_CLAVIERS, masquer: IMPLANTS },
    { titre: 'Peau et platysma', vue: 'opClavProche',
      texte: 'Peau, tissu sous-cutané et platysma sont incisés puis levés d’un seul tenant : ce lambeau myo-cutané recouvrira la plaque à la fermeture. Les nerfs supra-claviculaires croisent la clavicule sous le platysma : ils sont repérés et préservés quand c’est possible, sinon le patient est prévenu de l’hypoesthésie sous-claviculaire.',
      accent: ['clavicule', 'platysma'], danger: SOUS_CLAVIERS, masquer: IMPLANTS, ecarter: clavOuverte(1) },
    { titre: 'Foyer de fracture', vue: 'opClavProche',
      texte: 'Le fascia et le périoste sont incisés sur l’os ; les insertions du grand pectoral et du deltoïde en avant, du trapèze et du sterno-cléido-mastoïdien en haut, sont respectées, et un troisième fragment garde ses attaches. Sous la clavicule, au tiers médial et moyen : veine subclavière, artère subclavière et plexus brachial, protégés du foret par le muscle subclavier puis par un écarteur glissé sous l’os.',
      accent: ['clavicule', 'subclavier'], danger: SOUS_CLAVIERS, masquer: IMPLANTS, ecarter: clavOuverte(1.35) },
    { titre: 'Réduction et plaque', vue: 'opClavProche',
      texte: 'Réduction anatomique (longueur et rotation), vis de traction si le trait est oblique, puis plaque anatomique supérieure — ou antéro-inférieure, moins saillante, dont les vis s’éloignent des vaisseaux — avec trois vis bicorticales de part et d’autre du foyer. Forage prudent, butée sur le foret. Fermeture du platysma par-dessus la plaque.',
      accent: ['clavicule'], danger: SOUS_CLAVIERS, montrer: ['plaque-clav'], masquer: ['plaque'], ecarter: clavOuverte(1.35) },
    { titre: 'Rapports sous-claviculaires', vue: 'opClavProche',
      texte: 'Peau et platysma retirés, clavicule translucide : le muscle subclavier, puis la veine subclavière — la plus antérieure, parfois à quelques millimètres de la corticale au tiers médial —, l’artère subclavière et les troncs du plexus brachial. C’est la raison de la butée sur le foret et de vis de longueur mesurée.',
      accent: ['subclavier'], danger: SOUS_CLAVIERS, voiler: ['clavicule'], montrer: ['plaque-clav'], masquer: ['plaque', 'peau', 'graisse', 'platysma'], estomper: ['pectoral-clav', 'deltoide-ant'] },
  ] },
  dp: { court: 'Delto-pectorale', titre: 'Voie delto-pectorale', fendre: peauFendue(PEAU_DP, FOND, 'médiale', 'latérale'), steps: [
    { titre: 'Installation et incision', vue: 'op',
      texte: 'Vue de l’opérateur : position demi-assise, épaule dégagée du bord de la table, bras libre sur un appui, amplificateur de brillance du côté de la tête. Repère : le processus coracoïde. L’incision, de 10 à 12 cm, part de la coracoïde et descend obliquement en bas et en dehors, le long du sillon delto-pectoral, vers l’insertion humérale du deltoïde.',
      montrer: ['incision-dp'], danger: ['cephalique'], masquer: IMPLANTS },
    { titre: 'Peau et veine céphalique', vue: 'opProche',
      texte: 'Peau et tissu sous-cutané sont incisés. Le sillon delto-pectoral se reconnaît à son liseré graisseux, où chemine la veine céphalique. Elle est libérée et, le plus souvent, laissée en dehors avec le deltoïde (ses afférences sont surtout deltoïdiennes) ; ses branches médiales sont coagulées.',
      accent: ['deltoide-ant', 'pectoral-clav'], danger: ['cephalique'], masquer: IMPLANTS, ecarter: peauOuverte(12, 10) },
    { titre: 'Sillon delto-pectoral', vue: 'opProche',
      texte: 'Le sillon est ouvert au doigt sur toute sa longueur, de la clavicule à l’insertion du deltoïde : deltoïde et veine céphalique en dehors, grand pectoral en dedans. Aucun muscle n’est sectionné. L’espace sous-deltoïdien est libéré au doigt ; le bras en abduction détend le deltoïde.',
      accent: ['deltoide-ant', 'pectoral-clav', 'coracobrachial', 'biceps-court'], danger: ['cephalique'], masquer: IMPLANTS, ecarter: { ...peauOuverte(20, 12), ...sillon(18, 8) } },
    { titre: 'Fascia clavi-pectoral et tendon conjoint', vue: 'opProche',
      texte: 'Au fond, le fascia clavi-pectoral est incisé au bord latéral du tendon conjoint (coraco-brachial et chef court du biceps), jusqu’au ligament coraco-acromial. Le tendon conjoint est récliné en dedans, avec douceur : le nerf musculo-cutané le pénètre 5 à 8 cm sous la coracoïde et part avec lui. Pas d’écarteur appuyé sous la coracoïde.',
      accent: ['coracobrachial', 'biceps-court', 'subscapulaire'], danger: ['musculocutane', 'cephalique'], masquer: IMPLANTS,
      ecarter: { ...peauOuverte(27, 13), ...sillon(27, 9), ...CONJOINT_EN_DEDANS } },
    { titre: 'Humérus proximal', vue: 'opProche',
      texte: 'La tête humérale, les deux tubercules et le tendon du long biceps dans sa gouttière sont exposés : le long biceps est le repère pour replacer les tubercules. Le sous-scapulaire est en avant ; à son bord inférieur courent les vaisseaux circonflexes antérieurs. Le nerf axillaire passe sous le sous-scapulaire puis contourne le col chirurgical : il se palpe au doigt (« tug test »), et aucun écarteur n’est placé à l’aveugle sous le deltoïde ou sous le col.',
      accent: ['humerus', 'biceps-long', 'subscapulaire'], danger: ['axillaire', 'axillaire-rameaux', 'acirc-ant', 'musculocutane'], masquer: [...IMPLANTS, 'gaine-biceps'],
      ecarter: { ...peauOuverte(38, 13), ...sillon(40, 9), ...CONJOINT_EN_DEDANS } },
    { titre: 'Réduction et plaque', vue: 'opLateral',
      texte: 'Les tendons de la coiffe sont chargés sur fils pour manœuvrer les tubercules. Réduction de la tête (relèvement du valgus ou correction du varus, appui médial restauré), broches temporaires, contrôle scopique. La plaque se pose en dehors de la gouttière bicipitale, 5 à 8 mm sous le sommet du tubercule majeur ; vis céphaliques sous-chondrales sans effraction articulaire, vis de calcar si le varus menace. Les fils de la coiffe sont noués dans la plaque. Peau retirée, deltoïde estompé.',
      accent: ['humerus'], danger: ['axillaire', 'axillaire-rameaux'], voiler: ['humerus'], montrer: ['plaque'], masquer: ['peau', 'graisse', 'gaine-biceps', 'plaque-clav'], estomper: ['deltoide-ant', 'deltoide-moy'],
      ecarter: { ...sillon(40, 9), ...CONJOINT_EN_DEDANS } },
  ] },
  td: { court: 'Transdeltoïdienne', titre: 'Voie supéro-latérale transdeltoïdienne', fendre: peauFendue(PEAU_TD, FOND_TD, 'antérieure', 'postérieure'), steps: [
    { titre: 'Installation et incision', vue: 'opTD',
      texte: 'Position demi-assise, épaule dégagée, amplificateur de brillance du côté de la tête. Incision de 5 cm partant de l’angle antéro-latéral de l’acromion, dans l’axe de l’humérus (ou incision « en épaulette » parallèle au bord de l’acromion). Repère capital : le nerf axillaire croise la face profonde du deltoïde 5 à 7 cm sous le bord latéral de l’acromion.',
      montrer: ['incision-td'], danger: ['axillaire', 'axillaire-rameaux'], masquer: [...IMPLANTS, ...DECOR_TD] },
    { titre: 'Peau et deltoïde', vue: 'opTDProche',
      texte: 'Peau et tissu sous-cutané sont incisés jusqu’au fascia du deltoïde. Le raphé tendineux qui sépare le faisceau antérieur du faisceau moyen se reconnaît à son liseré blanc, en regard de l’angle antéro-latéral de l’acromion.',
      accent: ['deltoide-ant', 'deltoide-moy'], danger: ['axillaire', 'axillaire-rameaux'], masquer: [...IMPLANTS, ...DECOR_TD], ecarter: tdPeau(11) },
    { titre: 'Deltoïde fendu', vue: 'opTDProche',
      texte: 'Le deltoïde est fendu dans le raphé, dans le sens de ses fibres, sur 4 à 5 cm au plus à partir de l’acromion ; un point d’arrêt est noué au bas de la fente pour qu’elle ne se prolonge pas. Le nerf axillaire se palpe au doigt sur la face profonde du muscle, transversal, à la partie basse du champ.',
      accent: ['deltoide-ant', 'deltoide-moy'], danger: ['axillaire', 'axillaire-rameaux'], masquer: [...IMPLANTS, ...DECOR_TD], ecarter: { ...tdPeau(13), ...deltoideFendu(9) } },
    { titre: 'Bourse sous-acromiale, coiffe et tubercule majeur', vue: 'opTDProche',
      texte: 'La bourse sous-acromio-deltoïdienne est ouverte et réséquée : la coiffe des rotateurs, le tubercule majeur et le foyer apparaissent. Pour un clou, le supra-épineux est incisé dans le sens de ses fibres, sur 1 à 2 cm, en arrière du long biceps ; le point d’entrée est au sommet de la tête, juste en dedans du tubercule majeur, dans l’axe du canal. Pour réinsérer un tubercule majeur, des fils sont passés dans le tendon.',
      accent: ['humerus', 'supra-epineux'], danger: ['axillaire', 'axillaire-rameaux'], masquer: [...IMPLANTS, ...DECOR_TD], ecarter: { ...tdPeau(15), ...deltoideFendu(13) } },
    { titre: 'Clou huméral', vue: 'opTD',
      texte: 'Broche-guide, ouverture, clou descendu à la main ; son extrémité est enfouie sous le cartilage. Vis céphaliques par le viseur, à travers de courtes incisions : celles qui se trouvent 5 à 7 cm sous l’acromion sont à hauteur du nerf axillaire — dissection mousse jusqu’à l’os, douille de protection. Le supra-épineux est suturé, le deltoïde refermé. Variante : plaque glissée sous le nerf par deux fenêtres (MIPO). Peau retirée, humérus translucide.',
      accent: ['clou-humerus'], voiler: ['humerus'], danger: ['axillaire', 'axillaire-rameaux'], montrer: ['clou-humerus'], masquer: ['plaque', 'plaque-clav', 'peau', 'graisse', ...DECOR_TD], estomper: ['deltoide-ant', 'deltoide-moy', 'deltoide-post'] },
  ] },
};

export default { nom: 'Épaule droite', graisse: 5, centre, vues, meshes, tubes, rubans, groupes, voies };
