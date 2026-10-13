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
const tubes = [
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
  hauban: { de: [-170, 130, 20], cible: [-213, -48, 1030] },
  // décubitus dorsal, avant-bras en pronation sur le thorax : l'opérateur regarde la face latérale du coude
  opLat: { de: [-215, 190, 0], cible: TETE }, opLatProche: { de: [-125, 110, 0], cible: TETE },
  libre: { de: [-250, 250, 60] },
};
const HAUBAN = ['hauban'];
const VIS = ['vis-tete1', 'vis-tete2'];
const PLAQUES = ['plaque-lat', 'plaque-med'];
const IMPLANTS = [...HAUBAN, ...VIS, ...PLAQUES, 'osteotomie'];

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
};

export default { nom: 'Coude droit', graisse: 3, centre, vues, meshes, tubes, rubans, groupes, voies };
