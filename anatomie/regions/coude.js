// Coude droit — abord direct de l'olécrâne, voie postérieure avec ostéotomie de l'olécrâne, voie latérale de Kocher.
// Repère BodyParts3D, en millimètres, membre en position anatomique (coude en extension, paume en avant) :
// x = latéral (-) / médial (+), y = avant (-) / arrière (+), z = vers le haut. L'olécrâne est en arrière, la tête radiale en dehors.
import pieces from './coude.pieces.js';
import { peauFendue, berges, charge, lame, deuxBerges } from './outils.js';

const meshes = [
  ['peau-coude', 'Peau', 'peau', '#e2b596', { id: 'peau', dossier: 'models-z' }],
  ...pieces,
];

// Lignes d'incision relevées sur la peau.
const PEAU_POST = [[-212, -18, 1095], [-215, -23, 1079], [-219, -24, 1062], [-219, -25, 1046], [-214, -30, 1029], [-215, -35, 1012], [-219, -36, 995], [-221, -43, 975]];
const PEAU_KOCHER = [[-245, -48, 1072], [-246, -45, 1059], [-242, -38, 1043], [-243, -37, 1030], [-239, -37, 1014], [-239, -37, 1000]];
const FOND_POST = [0, -1, 0];
// Palette humérale : la même incision postérieure, prolongée sur le bras.
const PEAU_PALETTE = [[-211, -14, 1159], [-214, -16, 1131], [-213, -18, 1100], [-215, -23, 1079], [-219, -24, 1062], [-219, -25, 1046], [-214, -30, 1029], [-215, -35, 1012], [-219, -36, 995]];
const FOND_KOCHER = [0.75, -0.66, 0];

// Tracés à la main : incisions, broches, hauban, vis.
const visCol = (id, n, de, a) => [`${id}/vis${n}`, 'Vis', 'implants', '#cfd6dd', 1.3, [de, de.map((c, i) => (c + a[i]) / 2), a]];
// ----- Kaplan, médiale, antérieure : lignes relevées sur la peau -----
const PEAU_KAPLAN = [[-245, -48, 1072], [-246, -49, 1059], [-246, -47, 1043], [-251, -46, 1031], [-253, -47, 1015], [-251, -49, 1005]];
const FOND_KAPLAN = [0.9, -0.42, 0];
const PEAU_MEDIALE = [[-173, -56, 1095], [-174, -55, 1080], [-177, -55, 1065], [-177, -57, 1050], [-178, -57, 1036], [-182, -61, 1020], [-181, -63, 1005]];
const FOND_MEDIALE = [-0.97, -0.24, 0];
const PEAU_ANTC = [[-223, -95, 1052], [-227, -99, 1040], [-231, -103, 1028], [-236, -103, 1016], [-240, -106, 1005], [-243, -107, 994]];
const FOND_ANTC = [0.15, 0.99, 0];
const tubes = [
  ['incision-kaplan', 'Incision — voie de Kaplan', 'incisions', '#35e0c8', 1.2, PEAU_KAPLAN.map(([x, y, z]) => [x - 2.4, y + 1.1, z])],
  ['incision-mediale', 'Incision — voie médiale', 'incisions', '#35e0c8', 1.2, PEAU_MEDIALE.map(([x, y, z]) => [x + 2.5, y + 0.6, z])],
  ['incision-antc', 'Incision — voie antérieure du coude', 'incisions', '#35e0c8', 1.2, PEAU_ANTC.map(([x, y, z]) => [x - 0.4, y - 2.5, z])],
  ['coronoide/vis1', 'Vis de la coronoïde', 'implants', '#cfd6dd', 1.1, [[-198, -74, 1044], [-203, -61, 1042], [-208, -48, 1040]]],
  ['coronoide/vis2', 'Vis de la coronoïde', 'implants', '#cfd6dd', 1.1, [[-200, -75, 1034], [-205, -62, 1032], [-210, -49, 1030]]],
  ['bouton-biceps', 'Bouton cortical (réinsertion du biceps)', 'implants', '#cfd6dd', 1.6, [[-225, -76, 1013], [-232, -70, 1013], [-240, -64, 1013]]],
  ['incision-palette', 'Incision — voie postérieure du coude', 'incisions', '#35e0c8', 1.2, PEAU_PALETTE.map(([x, y, z]) => [x, y + 3, z])],
  ['osteotomie', 'Trait de l’ostéotomie en chevron', 'reperes', '#7df9ff', 0.8, [[-221, -43, 1049], [-212, -40, 1044], [-203, -45, 1049]]],
  visCol('plaque-lat', 1, [-230, -47, 1104], [-222, -66, 1104]), visCol('plaque-lat', 2, [-232, -48, 1092], [-224, -68, 1092]), visCol('plaque-lat', 3, [-237, -51, 1068], [-205, -64, 1058]),
  visCol('plaque-med', 1, [-197, -49, 1104], [-205, -66, 1104]), visCol('plaque-med', 2, [-194, -50, 1092], [-202, -68, 1092]), visCol('plaque-med', 3, [-184, -56, 1064], [-240, -60, 1060]),
  ['incision-post', 'Incision — abord postérieur de l’olécrâne', 'incisions', '#35e0c8', 1.2, PEAU_POST.map(([x, y, z]) => [x, y + 3, z])],
  ['incision-kocher', 'Incision — voie de Kocher', 'incisions', '#35e0c8', 1.2, PEAU_KOCHER.map(([x, y, z]) => [x - 2.4, y + 2.1, z])],
  ['hauban/broche1', 'Broche de Kirschner', 'implants', '#cfd6dd', 0.9, [[-206, -44, 1066], [-208, -55, 1030], [-212, -68, 990]]],
  ['hauban/broche2', 'Broche de Kirschner', 'implants', '#cfd6dd', 0.9, [[-214, -44, 1066], [-216, -55, 1030], [-219, -68, 990]]],
  ['hauban', 'Hauban — cerclage en 8', 'implants', '#dfe6ec', 0.6,
    [[-225, -49, 1008], [-214, -40, 1036], [-204, -41, 1061], [-210, -39.5, 1068], [-217, -41, 1061], [-208, -40, 1036], [-204, -49, 1008]]],
  ['hauban/tunnel', 'Tunnel transversal du cerclage', 'implants', '#dfe6ec', 0.6, [[-225, -49, 1008], [-214, -50, 1008], [-204, -49, 1008]]],
  ['vis-tete1', 'Vis de la tête radiale', 'implants', '#cfd6dd', 1.1, [[-242, -62, 1041], [-232, -67, 1041], [-223, -71, 1041]]],
  ['vis-tete2', 'Vis de la tête radiale', 'implants', '#cfd6dd', 1.1, [[-241, -58, 1036], [-231, -64, 1036], [-222, -69, 1036]]],
];

const rubans = [
  ['coronoide', 'Plaque de soutien de la coronoïde', 'implants', '#b9c2cc', [[-197, -72.5, 1052], [-199, -75, 1039], [-203, -73, 1024]], 7, 1.4, [0.8, 0.6, 0]],
  ['plaque-lat', 'Plaque de la colonne latérale', 'implants', '#b9c2cc', [[-229, -46.5, 1110], [-232.5, -47.5, 1090], [-236.5, -49.5, 1073], [-238.5, -53.5, 1059]], 9, 2.2, [1, 0, 0]],
  ['plaque-med', 'Plaque de la colonne médiale', 'implants', '#b9c2cc', [[-198, -48.5, 1110], [-193, -49.5, 1090], [-186.5, -52.5, 1073], [-182.5, -57, 1061]], 9, 2.2, [1, 0, 0]],
];

const groupes = [
  ['peau', 'Peau'], ['graisse', 'Tissu sous-cutané'], ['os', 'Os'], ['triceps', 'Triceps et anconé'], ['anterieurs', 'Biceps et brachial'], ['lateraux', 'Épicondyliens latéraux'],
  ['mediaux', 'Épicondyliens médiaux'], ['ligaments', 'Capsule et ligaments'], ['vaisseaux', 'Artères et veines'], ['nerfs', 'Nerfs'], ['incisions', 'Incisions'], ['reperes', 'Repères'], ['implants', 'Matériel'],
];

const centre = [-215, -60, 1045];
const OLECRANE = [-213, -40, 1035];
const TETE = [-234, -52, 1038];
const vues = {
  // patient en décubitus latéral, bras sur un appui : l'opérateur regarde la face postérieure du coude, épaule en haut de l'image
  opPost: { de: [-25, 290, 0], cible: OLECRANE }, opPostProche: { de: [-15, 170, 0], cible: OLECRANE },
  opPalette: { de: [-20, 330, 30], cible: [-212, -45, 1075] }, opPaletteProche: { de: [-10, 190, -25], cible: [-212, -48, 1068] },
  opKaplan: { de: [-250, 120, 0], cible: [-238, -55, 1040] }, opKaplanProche: { de: [-150, 70, 0], cible: [-238, -56, 1040] },
  // bras en abduction et rotation latérale sur la table à bras : face médiale du coude, épaule en haut
  opMed: { de: [260, -30, 0], cible: [-192, -62, 1045] }, opMedProche: { de: [150, -15, 0], cible: [-194, -64, 1042] },
  // avant-bras en supination sur la table à bras : face antérieure, épaule en haut
  opAntC: { de: [-40, -270, 0], cible: [-230, -86, 1024] }, opAntCProche: { de: [-22, -150, 0], cible: [-230, -86, 1022] },
  hauban: { de: [-170, 130, 20], cible: [-213, -48, 1030] },
  // décubitus dorsal, avant-bras en pronation sur le thorax : l'opérateur regarde la face latérale du coude
  opLat: { de: [-215, 190, 0], cible: TETE }, opLatProche: { de: [-125, 110, 0], cible: TETE },
  libre: { de: [-250, 250, 60] },
};
const HAUBAN = ['hauban'];
const VIS = ['vis-tete1', 'vis-tete2'];
const PLAQUES = ['plaque-lat', 'plaque-med'];
const IMPLANTS = [...HAUBAN, ...VIS, ...PLAQUES, 'osteotomie', 'coronoide', 'bouton-biceps'];

const postOuvert = k => berges(PEAU_POST, FOND_POST, [-12, 0, 0], k, 24);

// Kocher : intervalle entre l'anconé (en arrière, nerf radial) et l'extenseur ulnaire du carpe (en avant, nerf interosseux postérieur).
const INTERVALLE = [[-236, -48, 1066], [-229, -44, 1004]];
const N_AVANT = [-0.55, -0.83, 0.06];  // vers l'avant et le dehors, perpendiculaire à l'intervalle
const N_ARRIERE = [0.55, 0.83, -0.06];
const optsK = { rayon: 20, profondeur: 34 };
const kocherPeau = k => berges(PEAU_KOCHER, FOND_KOCHER, N_AVANT.map(c => c * 11), k, 22);
const kocherMuscles = (avant, arriere) => ({
  ...charge(['ecu', 'ecu-ulnaire', 'edm', 'edc'], lame(INTERVALLE, N_AVANT, FOND_KOCHER, avant, avant * 2.4 + 10, optsK)),
  ...charge(['ancone'], lame(INTERVALLE, N_ARRIERE, FOND_KOCHER, arriere, arriere * 2.4 + 10, optsK)),
});
// Capsule et ligament annulaire incisés en avant de l'équateur du capitulum, pour respecter le faisceau ulnaire du ligament collatéral latéral.
const CAPSULOTOMIE = { capsule: { autour: [[-240, -58, 1056], [-240, -62, 1034]], rayon: 11 }, annulaire: { autour: [[-242, -62, 1042], [-240, -64, 1032]], rayon: 9 } };

// ----- Voie postérieure avec ostéotomie de l'olécrâne -----
const PEAU_PALETTE_DROITE = [PEAU_PALETTE[0], PEAU_PALETTE[PEAU_PALETTE.length - 1]];
const palettePeau = e => deuxBerges(PEAU_PALETTE, FOND_POST,
  { vers: [1, 0, 0], lame: lame(PEAU_PALETTE_DROITE, [1, 0, 0], FOND_POST, e, e * 2.4 + 10, { rayon: 26, profondeur: 26 }) },
  { vers: [-1, 0, 0], lame: lame(PEAU_PALETTE_DROITE, [-1, 0, 0], FOND_POST, e, e * 2.4 + 10, { rayon: 26, profondeur: 26 }) });
// Le nerf ulnaire, libéré de sa gouttière, est écarté en dedans sur un lacs.
const NERF_ULNAIRE_ECARTE = { nulnaire: { dep: [9, -3, 0], autour: [[-179, -56, 1095], [-183, -60, 1025]], rayon: 30 } };
// L'olécrâne ostéotomisé est relevé vers le haut avec le triceps, qui reste inséré sur lui.
const RELEVE = { dep: [0, 30, 46], autour: [-212, -44, 1056], rayon: 52 };
const OLECRANE_RELEVE = charge(['ulna/A', 'triceps-long', 'triceps-lat', 'triceps-med'], RELEVE);
const fendrePalette = [
  ...peauFendue(PEAU_PALETTE, FOND_POST, 'latérale', 'médiale'),
  ['ulna', [0, 0, 1047], [0, 0, 1], 'Olécrâne (fragment de l’ostéotomie)', 'Ulna'],
];
const CAPSULE_POST = { capsule: { autour: [[-225, -52, 1066], [-198, -52, 1066]], rayon: 16 } };

// ----- Outils des voies ajoutées : deux lames, une par berge, dont le côté est calculé -----
const droite = ligne => [ligne[0], ligne[ligne.length - 1]];
const deuxLames = (ligne, fond, versA, versB, eA, eB, opts, ids) => deuxBerges(ligne, fond,
  { vers: versA, lame: lame(droite(ligne), versA, fond, eA, eA * 2.4 + 8, opts) },
  { vers: versB, lame: lame(droite(ligne), versB, fond, eB, eB * 2.4 + 8, opts) }, ids);

// Kaplan : intervalle entre court extenseur radial du carpe (en avant) et extenseur des doigts (en arrière).
const KA_AVANT = [-0.42, -0.9, 0];
const KA_ARRIERE = [0.42, 0.9, 0];
const INT_KAPLAN = [[-239, -52, 1070], [-242, -53, 1004]];
const kaplanPeau = e => deuxLames(PEAU_KAPLAN, FOND_KAPLAN, KA_AVANT, KA_ARRIERE, e, e, { rayon: 18, profondeur: 22 });
const kaplanMuscles = e => ({
  ...charge(['ecrb', 'ecrl'], lame(INT_KAPLAN, KA_AVANT, FOND_KAPLAN, e, e * 2.4 + 10, { rayon: 18, profondeur: 30 })),
  ...charge(['edc', 'edm', 'ecu'], lame(INT_KAPLAN, KA_ARRIERE, FOND_KAPLAN, e, e * 2.4 + 10, { rayon: 18, profondeur: 30 })),
});
const SUPINATEUR_FENDU = { supinateur: { autour: [[-240, -58, 1052], [-242, -62, 1022]], rayon: 9 } };

// Médiale : entre les deux chefs du fléchisseur ulnaire du carpe, sur le trajet du nerf ulnaire.
const ME_AVANT = [0.24, -0.97, 0];
const ME_ARRIERE = [-0.24, 0.97, 0];
const INT_MEDIALE = [[-181, -57, 1082], [-186, -64, 1004]];
const medialePeau = e => deuxLames(PEAU_MEDIALE, FOND_MEDIALE, ME_AVANT, ME_ARRIERE, e, e, { rayon: 20, profondeur: 20 });
const medialeMuscles = (avant, arriere) => ({
  ...charge(['fcu', 'fds', 'long-palmaire', 'fcr', 'rond-pronateur', 'basilique', 'ncutmed'], lame(INT_MEDIALE, ME_AVANT, FOND_MEDIALE, avant, avant * 2.4 + 12, { rayon: 20, profondeur: 34 })),
  ...charge(['fcu-ulnaire', 'nulnaire'], lame(INT_MEDIALE, ME_ARRIERE, FOND_MEDIALE, arriere, arriere * 2.4 + 10, { rayon: 20, profondeur: 34 })),
});

// Para-tricipitale : le triceps reste inséré sur l'olécrâne ; deux fenêtres, une de chaque côté du muscle.
const FENETRE_MEDIALE = lame([[-190, -50, 1114], [-186, -54, 1064]], [-1, 0, 0], FOND_POST, 12, 30, { rayon: 22, profondeur: 30 });
const FENETRE_LATERALE = lame([[-230, -48, 1114], [-236, -52, 1064]], [1, 0, 0], FOND_POST, 10, 30, { rayon: 22, profondeur: 30 });
const tricepsReclines = (dedans, dehors) => charge(['triceps-long', 'triceps-lat', 'triceps-med'], [dedans && FENETRE_MEDIALE, dehors && FENETRE_LATERALE].filter(Boolean));

// Antérieure : intervalle entre brachio-radial (en dehors) et rond pronateur (en dedans).
const AC_DEHORS = [-0.99, 0.15, 0];
const AC_DEDANS = [0.99, -0.15, 0];
const INT_ANTC = [[-224, -88, 1050], [-240, -92, 996]];
const antcPeau = e => deuxLames(PEAU_ANTC, FOND_ANTC, AC_DEHORS, AC_DEDANS, e, e, { rayon: 18, profondeur: 20 });
const antcMuscles = e => ({
  ...charge(['brachioradial', 'ncutlat', 'nradial-sup', 'nradial', 'cephalique', 'ecrl'], lame(INT_ANTC, AC_DEHORS, FOND_ANTC, e, e * 2.4 + 14, { rayon: 20, profondeur: 34 })),
  ...charge(['rond-pronateur', 'rond-pronateur-prof', 'fcr', 'abrachiale', 'aradiale', 'aulnaire', 'nmedian', 'vmediane'], lame(INT_ANTC, AC_DEDANS, FOND_ANTC, e, e * 2.4 + 14, { rayon: 20, profondeur: 34 })),
});

const voies = {
  olecrane: { court: 'Olécrâne', titre: 'Abord postérieur direct de l’olécrâne (haubanage)', fendre: peauFendue(PEAU_POST, FOND_POST, 'latérale', 'médiale'), steps: [
    { titre: 'Installation et incision', vue: 'opPost',
      texte: 'Vue de l’opérateur : décubitus latéral (ou dorsal, bras sur le thorax), bras sur un appui, coude fléchi à 90°, garrot à la racine du bras. Incision postérieure longitudinale, de 3 cm au-dessus de la pointe de l’olécrâne jusqu’à 5 à 6 cm sur la crête ulnaire ; elle contourne la pointe par son versant latéral pour ne pas laisser de cicatrice sur la zone d’appui. Le modèle est ici coude en extension.',
      montrer: ['incision-post'], danger: ['nulnaire'], masquer: IMPLANTS },
    { titre: 'Peau et tissu sous-cutané', vue: 'opPostProche',
      texte: 'Le plan est direct : peau, tissu sous-cutané, bourse olécrânienne, puis l’os. Les lambeaux sont levés épais, d’un seul tenant. Le nerf ulnaire, dans sa gouttière en arrière de l’épicondyle médial, est repéré au doigt : il n’est disséqué que si le trait s’étend vers lui ou si une plaque est prévue.',
      accent: ['ulna', 'triceps-long', 'triceps-lat'], danger: ['nulnaire'], masquer: IMPLANTS, ecarter: postOuvert(1) },
    { titre: 'Foyer de fracture', vue: 'opPostProche',
      texte: 'Le foyer est ouvert par mise en flexion : hématome évacué, fragments libres retirés, surface articulaire de la trochlée inspectée. Le périoste n’est récliné que sur 2 mm. Le tendon du triceps s’insère sur le fragment proximal : il n’est pas désinséré. Réduction en extension, au davier à pointes, contrôlée sur la corticale postérieure et sur l’interligne.',
      accent: ['ulna', 'humerus'], danger: ['nulnaire'], masquer: IMPLANTS, ecarter: postOuvert(1.15) },
    { titre: 'Broches', vue: 'hauban',
      texte: 'Deux broches de Kirschner parallèles (1,6 ou 1,8 mm) sont introduites par la pointe de l’olécrâne, à travers le tendon du triceps, et dirigées vers la corticale antérieure de l’ulna, qu’elles accrochent juste en aval de la coronoïde : cet appui bicortical limite leur migration. Une broche trop longue en avant menace le nerf interosseux antérieur et l’artère ulnaire ; elle peut aussi bloquer la prono-supination. Peau retirée, ulna translucide.',
      accent: ['hauban/broche1', 'hauban/broche2'], voiler: ['ulna'], danger: ['nulnaire', 'nia', 'aulnaire'], montrer: ['hauban/broche1', 'hauban/broche2'], masquer: ['hauban', 'hauban/tunnel', ...VIS, 'peau', 'graisse'],
      estomper: ['ancone', 'ecu', 'ecu-ulnaire', 'fcu', 'fcu-ulnaire', 'triceps-lat', 'triceps-med'] },
    { titre: 'Hauban', vue: 'hauban',
      texte: 'Un tunnel transversal est foré dans la crête ulnaire, à distance du foyer (au moins autant que la longueur du fragment proximal, soit 3 à 4 cm), en arrière de l’axe de l’os. Le fil d’acier y est passé, croisé en 8 sur la face postérieure, puis glissé sous le tendon du triceps, au contact de l’os, autour des broches. Serrage symétrique par deux torons. Les broches sont recourbées, tournées et impactées dans l’os sous le triceps. Le hauban transforme la traction du triceps en compression du foyer lors de la flexion.',
      accent: HAUBAN, voiler: ['ulna'], danger: ['nulnaire'], montrer: HAUBAN, masquer: [...VIS, 'peau', 'graisse'],
      estomper: ['ancone', 'ecu', 'ecu-ulnaire', 'fcu', 'fcu-ulnaire', 'triceps-lat', 'triceps-med'] },
  ] },
  palette: { court: 'Palette humérale', titre: 'Voie postérieure avec ostéotomie de l’olécrâne (palette humérale)', fendre: fendrePalette, steps: [
    { titre: 'Installation et incision', vue: 'opPalette',
      texte: 'Vue de l’opérateur : décubitus latéral (ou ventral), bras sur un appui, coude fléchi à 90°, avant-bras pendant, garrot stérile. Incision postérieure médiane, de 10 à 12 cm au-dessus de l’olécrâne jusqu’à 5 cm sur la crête ulnaire ; elle contourne la pointe de l’olécrâne en dehors. Le modèle est ici coude en extension.',
      montrer: ['incision-palette'], danger: ['nulnaire'], masquer: IMPLANTS },
    { titre: 'Lambeaux et nerf ulnaire', vue: 'opPalette',
      texte: 'Deux lambeaux fascio-cutanés épais sont levés jusqu’aux épicondyles. Le nerf ulnaire est repéré au bord médial du triceps, puis libéré de proche en proche, de l’arcade de Struthers à ses premiers rameaux pour le fléchisseur ulnaire du carpe, et mis sur lacs : il est sous les yeux pendant toute l’intervention.',
      accent: ['triceps-long', 'triceps-lat', 'ulna'], danger: ['nulnaire'], masquer: IMPLANTS, ecarter: { ...palettePeau(26), ...NERF_ULNAIRE_ECARTE } },
    { titre: 'Ostéotomie de l’olécrâne', vue: 'opPaletteProche',
      texte: 'Le triceps est libéré de ses deux bords. L’ostéotomie est tracée en chevron à pointe distale, en regard de la zone nue de l’incisure trochléaire (sans cartilage), repérée par une courte arthrotomie de chaque côté. Le matériel de refixation (plaque ou broches) est préparé avant la coupe. La scie oscillante s’arrête à la corticale articulaire, terminée à l’ostéotome : l’engrènement en sera meilleur.',
      accent: ['osteotomie', 'ulna'], montrer: ['osteotomie'], danger: ['nulnaire'], masquer: [...HAUBAN, ...VIS, ...PLAQUES], ecarter: { ...palettePeau(28), ...NERF_ULNAIRE_ECARTE } },
    { titre: 'Olécrâne relevé : palette exposée', vue: 'opPaletteProche',
      texte: 'L’olécrâne est relevé vers le haut avec le triceps, qui garde son insertion ; la capsule postérieure et le coussinet graisseux sont réséqués. Coude fléchi, toute la surface articulaire est sous les yeux : trochlée, capitulum, fosse olécrânienne, et les deux colonnes.',
      accent: ['humerus'], danger: ['nulnaire', 'nradial'], masquer: IMPLANTS, ecarter: { ...palettePeau(30), ...NERF_ULNAIRE_ECARTE, ...OLECRANE_RELEVE }, sectionner: CAPSULE_POST },
    { titre: 'Ostéosynthèse à deux plaques', vue: 'opPaletteProche',
      texte: 'La surface articulaire est reconstruite en premier (broches, puis vis transversale sans compression excessive de la trochlée), puis le bloc articulaire est solidarisé aux deux colonnes par deux plaques, parallèles (médiale et latérale) ou perpendiculaires (médiale et postéro-latérale) : un maximum de vis longues dans le fragment distal, entrecroisées. L’olécrâne est refixé (hauban ou plaque). Le nerf ulnaire est replacé ou transposé en avant, et sa position notée.',
      accent: ['humerus'], danger: ['nulnaire', 'nradial'], montrer: PLAQUES, masquer: [...HAUBAN, ...VIS, 'osteotomie'], ecarter: { ...palettePeau(30), ...NERF_ULNAIRE_ECARTE, ...OLECRANE_RELEVE }, sectionner: CAPSULE_POST },
  ] },
  kocher: { court: 'Kocher', titre: 'Voie latérale de Kocher (tête radiale)', fendre: peauFendue(PEAU_KOCHER, FOND_KOCHER, 'antérieure', 'postérieure'), steps: [
    { titre: 'Installation et incision', vue: 'opLat',
      texte: 'Vue de l’opérateur : décubitus dorsal, bras sur une table à bras ou avant-bras sur le thorax, coude fléchi, avant-bras en pronation complète : la pronation éloigne le nerf interosseux postérieur du champ. Incision oblique de 5 à 6 cm, de l’épicondyle latéral vers la crête de l’ulna, en passant sur la tête radiale. Le modèle est ici coude en extension et en supination.',
      montrer: ['incision-kocher'], danger: ['nip', 'nradial-prof'], masquer: IMPLANTS },
    { titre: 'Peau et fascia', vue: 'opLatProche',
      texte: 'Peau et tissu sous-cutané sont incisés ; les lambeaux sont levés au ras du fascia. L’intervalle se reconnaît à un liseré graisseux entre l’anconé, en arrière, et l’extenseur ulnaire du carpe, en avant : il est plus facile à trouver en distal.',
      accent: ['ancone', 'ecu'], danger: ['nip', 'ncutpost'], masquer: IMPLANTS, ecarter: kocherPeau(1) },
    { titre: 'Intervalle anconé / extenseur ulnaire du carpe', vue: 'opLatProche',
      texte: 'Le fascia est incisé sur le liseré. L’anconé (nerf radial) est récliné en arrière, l’extenseur ulnaire du carpe (nerf interosseux postérieur) en avant : c’est un plan internerveux. La capsule et le ligament annulaire apparaissent au fond. La dissection ne dépasse pas le col du radius en distal.',
      accent: ['ancone', 'ecu', 'capsule', 'annulaire'], danger: ['nip', 'nradial-prof'], masquer: IMPLANTS, ecarter: { ...kocherPeau(1.2), ...kocherMuscles(8, 7) } },
    { titre: 'Capsulotomie', vue: 'opLatProche',
      texte: 'La capsule est incisée longitudinalement, en avant de l’équateur du capitulum et de la tête radiale, puis le ligament annulaire : rester en avant respecte le faisceau ulnaire du ligament collatéral latéral, dont la section expose à l’instabilité postéro-latérale. La tête radiale et le capitulum sont exposés ; on voit surtout la moitié postérieure de la tête.',
      accent: ['radius', 'humerus'], danger: ['nip', 'nradial-prof', 'lcr'], masquer: IMPLANTS, ecarter: { ...kocherPeau(1.3), ...kocherMuscles(11, 8) }, sectionner: CAPSULOTOMIE },
    { titre: 'Ostéosynthèse de la tête radiale', vue: 'opLatProche',
      texte: 'Réduction des fragments, puis vis enfouies (ou plaque) placées dans la « zone de sécurité » : l’arc de 90 à 110° de la tête qui ne s’articule pas avec l’ulna, repéré entre le tubercule de Lister et la styloïde radiale, avant-bras en rotation neutre. Fracture non reconstructible : prothèse de tête radiale. Fermeture soigneuse du ligament annulaire et de la capsule.',
      accent: VIS, danger: ['nip', 'nradial-prof'], voiler: ['radius'], montrer: VIS, masquer: HAUBAN, ecarter: { ...kocherPeau(1.3), ...kocherMuscles(11, 8) }, sectionner: CAPSULOTOMIE },
  ] },
  kaplan: { court: 'Kaplan', titre: 'Voie latérale de Kaplan (tête radiale)', fendre: peauFendue(PEAU_KAPLAN, FOND_KAPLAN, 'antérieure', 'postérieure'), steps: [
    { titre: 'Installation et incision', vue: 'opKaplan',
      texte: 'Décubitus dorsal, bras sur une table à bras, coude fléchi, avant-bras en pronation complète : plus encore que dans la voie de Kocher, la pronation éloigne le nerf interosseux postérieur, ici plus proche. Incision de l’épicondyle latéral vers le tubercule de Lister, sur 4 à 5 cm, en avant de celle de Kocher.',
      montrer: ['incision-kaplan'], danger: ['nip', 'nradial-prof'], masquer: IMPLANTS },
    { titre: 'Peau et fascia', vue: 'opKaplanProche',
      texte: 'Lambeaux au ras du fascia. L’intervalle est entre le court extenseur radial du carpe, en avant, et l’extenseur commun des doigts, en arrière ; il se repère mieux en distal, où les deux tendons se séparent.',
      accent: ['ecrb', 'edc'], danger: ['nip', 'nradial-prof', 'ncutpost'], masquer: IMPLANTS, ecarter: kaplanPeau(9) },
    { titre: 'Intervalle court extenseur radial / extenseur des doigts', vue: 'opKaplanProche',
      texte: 'L’intervalle est ouvert ; au fond, les fibres obliques du supinateur recouvrent le col du radius. Elles sont incisées dans l’axe, avant-bras en pronation, sans dépasser le bord distal de la tête radiale : le nerf interosseux postérieur traverse le muscle 3 à 4 cm sous l’interligne.',
      accent: ['ecrb', 'edc', 'supinateur'], danger: ['nip', 'nradial-prof'], masquer: IMPLANTS, ecarter: { ...kaplanPeau(11), ...kaplanMuscles(8) } },
    { titre: 'Capsule et tête radiale', vue: 'opKaplanProche',
      texte: 'Capsule et ligament annulaire sont incisés dans l’axe, en avant de l’équateur de la tête : le complexe ligamentaire latéral, plus postérieur, est respecté. La voie de Kaplan montre la moitié antérieure de la tête radiale et le capitulum, et donne un accès à la coronoïde par l’avant ; ostéosynthèse dans la zone de sécurité, ou prothèse.',
      accent: ['radius', 'humerus'], danger: ['nip', 'nradial-prof'], montrer: VIS, masquer: [...HAUBAN, ...PLAQUES, 'osteotomie', 'coronoide', 'bouton-biceps'],
      ecarter: { ...kaplanPeau(12), ...kaplanMuscles(10) }, sectionner: { ...CAPSULOTOMIE, ...SUPINATEUR_FENDU } },
  ] },
  mediale: { court: 'Médiale', titre: 'Voie médiale du coude (coronoïde, ligament collatéral ulnaire)', fendre: peauFendue(PEAU_MEDIALE, FOND_MEDIALE, 'antérieure', 'postérieure'), steps: [
    { titre: 'Installation et incision', vue: 'opMed',
      texte: 'Décubitus dorsal, bras en abduction et rotation latérale sur une table à bras (ou incision postérieure avec grand lambeau médial). Incision médiale centrée sur l’épicondyle médial, 5 cm au-dessus et 5 cm au-dessous. Le nerf cutané médial de l’avant-bras croise l’incision ; le nerf ulnaire est juste en arrière de l’épicondyle.',
      montrer: ['incision-mediale'], danger: ['nulnaire', 'ncutmed'], masquer: IMPLANTS },
    { titre: 'Peau et nerf ulnaire', vue: 'opMedProche',
      texte: 'Les branches du nerf cutané médial de l’avant-bras sont préservées. Le nerf ulnaire est repéré en amont de l’épicondyle, libéré dans sa gouttière puis jusqu’entre les deux chefs du fléchisseur ulnaire du carpe, en respectant ses rameaux moteurs, et mis sur lacs.',
      accent: ['fcu', 'fcu-ulnaire'], danger: ['nulnaire', 'ncutmed'], masquer: IMPLANTS, ecarter: medialePeau(10) },
    { titre: 'Entre les deux chefs du fléchisseur ulnaire du carpe', vue: 'opMedProche',
      texte: 'L’intervalle entre chef huméral et chef ulnaire du fléchisseur ulnaire du carpe est ouvert, sur le lit du nerf. Le chef huméral et la masse des fléchisseurs-pronateurs sont réclinés en avant, le chef ulnaire et le nerf ulnaire en arrière. Cette voie montre mieux la facette antéro-médiale et la base de la coronoïde que la voie « par-dessus » de Hotchkiss, qui passe en avant, entre fléchisseur ulnaire du carpe et rond pronateur, et montre surtout la pointe.',
      accent: ['fcu', 'fcu-ulnaire', 'ulna'], danger: ['nulnaire', 'aulnaire', 'nmedian'], masquer: IMPLANTS, ecarter: { ...medialePeau(12), ...medialeMuscles(10, 7) } },
    { titre: 'Coronoïde et ligament collatéral ulnaire', vue: 'opMedProche',
      texte: 'Les fléchisseurs sont décollés de la capsule d’arrière en avant : le faisceau antérieur du ligament collatéral ulnaire, son insertion sur le tubercule sublime, et la facette antéro-médiale de la coronoïde sont exposés. Le fragment est réduit puis soutenu par une petite plaque console ou des vis antéro-postérieures ; le ligament est réinséré s’il est avulsé.',
      accent: ['ulna', 'lcu'], danger: ['nulnaire', 'aulnaire', 'nmedian'], montrer: ['coronoide'], masquer: [...HAUBAN, ...VIS, ...PLAQUES, 'osteotomie', 'bouton-biceps'], ecarter: { ...medialePeau(13), ...medialeMuscles(15, 8) } },
  ] },
  paratri: { court: 'Para-tricipitale', titre: 'Voie postérieure para-tricipitale (triceps laissé en place)', fendre: peauFendue(PEAU_PALETTE, FOND_POST, 'latérale', 'médiale'), steps: [
    { titre: 'Installation et incision', vue: 'opPalette',
      texte: 'Même installation et même incision postérieure médiane que pour l’ostéotomie de l’olécrâne. Le triceps n’est ni fendu ni désinséré : on travaille par deux fenêtres, de part et d’autre du muscle. La voie convient aux fractures extra-articulaires et articulaires simples de la palette ; elle se convertit en ostéotomie de l’olécrâne si la vue articulaire ne suffit pas.',
      montrer: ['incision-palette'], danger: ['nulnaire'], masquer: IMPLANTS },
    { titre: 'Lambeaux et nerf ulnaire', vue: 'opPalette',
      texte: 'Deux lambeaux fascio-cutanés épais. Le nerf ulnaire est repéré au bord médial du triceps, libéré et mis sur lacs.',
      accent: ['triceps-long', 'triceps-lat'], danger: ['nulnaire'], masquer: IMPLANTS, ecarter: { ...palettePeau(26), ...NERF_ULNAIRE_ECARTE } },
    { titre: 'Fenêtre médiale', vue: 'opPaletteProche',
      texte: 'Le triceps est décollé de la cloison intermusculaire médiale et de la face postérieure de l’humérus, puis récliné en dehors : la colonne médiale, l’épicondyle médial et le versant médial de la fosse olécrânienne apparaissent.',
      accent: ['humerus', 'triceps-med'], danger: ['nulnaire'], masquer: IMPLANTS, ecarter: { ...palettePeau(28), ...NERF_ULNAIRE_ECARTE, ...tricepsReclines(true, false) } },
    { titre: 'Fenêtre latérale', vue: 'opPaletteProche',
      texte: 'De l’autre côté, le triceps est décollé de la cloison intermusculaire latérale et récliné en dedans ; l’anconé peut être relevé avec lui. La colonne latérale et le capitulum postérieur sont exposés. En haut de cette fenêtre, le nerf radial croise la cloison latérale, une dizaine de centimètres au-dessus de l’épicondyle.',
      accent: ['humerus', 'triceps-lat', 'ancone'], danger: ['nulnaire', 'nradial'], masquer: IMPLANTS, ecarter: { ...palettePeau(30), ...NERF_ULNAIRE_ECARTE, ...tricepsReclines(true, true) } },
    { titre: 'Deux plaques', vue: 'opPaletteProche',
      texte: 'La réduction articulaire est contrôlée par les deux fenêtres, coude fléchi, et sous scopie. Deux plaques, une par colonne, glissées sous le triceps. Le nerf ulnaire est replacé ou transposé. L’appareil extenseur est intact : la rééducation est immédiate.',
      accent: ['humerus'], danger: ['nulnaire', 'nradial'], montrer: PLAQUES, masquer: [...HAUBAN, ...VIS, 'osteotomie', 'coronoide', 'bouton-biceps'], ecarter: { ...palettePeau(30), ...NERF_ULNAIRE_ECARTE, ...tricepsReclines(true, true) } },
  ] },
  ant: { court: 'Antérieure', titre: 'Voie antérieure du coude (biceps distal)', fendre: peauFendue(PEAU_ANTC, FOND_ANTC, 'latérale', 'médiale'), steps: [
    { titre: 'Installation et incision', vue: 'opAntC',
      texte: 'Décubitus dorsal, bras sur une table à bras, avant-bras en supination, garrot stérile. Incision antérieure de 4 à 5 cm, longitudinale au bord médial du brachio-radial (ou transversale, deux travers de doigt sous le pli du coude). Une incision qui croise le pli le fait en S.',
      montrer: ['incision-antc'], danger: ['ncutlat', 'cephalique'], masquer: IMPLANTS },
    { titre: 'Peau, nerf cutané latéral de l’avant-bras', vue: 'opAntCProche',
      texte: 'Sous la peau : les veines du pli du coude, liées à la demande, et le nerf cutané latéral de l’avant-bras, qui émerge au bord latéral du tendon du biceps et descend sur le brachio-radial. C’est la structure la plus souvent lésée, par étirement sous un écarteur : il est repéré et récliné en dehors, sans traction.',
      accent: ['brachioradial', 'rond-pronateur'], danger: ['ncutlat', 'cephalique', 'vmediane'], masquer: IMPLANTS, ecarter: antcPeau(9) },
    { titre: 'Intervalle brachio-radial / rond pronateur', vue: 'opAntCProche',
      texte: 'Le brachio-radial est récliné en dehors, avec la branche superficielle du nerf radial ; le rond pronateur en dedans, avec l’artère radiale. Les vaisseaux récurrents radiaux croisent le champ (« laisse de Henry ») : ils sont liés. L’artère brachiale et le nerf médian sont en dedans du tendon du biceps, sous le lacertus fibrosus.',
      accent: ['brachioradial', 'rond-pronateur', 'biceps-long'], danger: ['nradial-sup', 'nradial', 'aradiale', 'abrachiale', 'nmedian'], masquer: IMPLANTS, ecarter: { ...antcPeau(11), ...antcMuscles(9) } },
    { titre: 'Tubérosité radiale', vue: 'opAntCProche',
      texte: 'Le trajet du tendon est suivi au doigt jusqu’à la tubérosité radiale, que la supination complète amène en avant. La supination éloigne aussi le nerf interosseux postérieur, qui contourne le col du radius dans le supinateur : aucun écarteur contre-coudé n’est placé sur le versant latéral du col. Le moignon tendineux, rétracté dans le bras, est récupéré, avivé, faufilé, puis réinséré dans la tubérosité (bouton cortical, ancres ou tunnel).',
      accent: ['radius', 'biceps-long', 'supinateur'], danger: ['nip', 'nradial-prof', 'ncutlat', 'aradiale'], montrer: ['bouton-biceps'], masquer: [...HAUBAN, ...VIS, ...PLAQUES, 'osteotomie', 'coronoide'], ecarter: { ...antcPeau(12), ...antcMuscles(13) } },
  ] },
};

export default { nom: 'Coude droit', graisse: 3, centre, vues, meshes, tubes, rubans, groupes, voies };
