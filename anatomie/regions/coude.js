// Coude droit — abord direct de l'olécrâne et voie latérale de Kocher.
// Repère BodyParts3D, en millimètres, membre en position anatomique (coude en extension, paume en avant) :
// x = latéral (-) / médial (+), y = avant (-) / arrière (+), z = vers le haut. L'olécrâne est en arrière, la tête radiale en dehors.
import pieces from './coude.pieces.js';
import { peauFendue, berges, charge, lame } from './outils.js';

const meshes = [
  ['peau-coude', 'Peau', 'peau', '#e2b596', { id: 'peau', dossier: 'models-z' }],
  ...pieces,
];

// Lignes d'incision relevées sur la peau.
const PEAU_POST = [[-212, -18, 1095], [-215, -23, 1079], [-219, -24, 1062], [-219, -25, 1046], [-214, -30, 1029], [-215, -35, 1012], [-219, -36, 995], [-221, -43, 975]];
const PEAU_KOCHER = [[-245, -48, 1072], [-246, -45, 1059], [-242, -38, 1043], [-243, -37, 1030], [-239, -37, 1014], [-239, -37, 1000]];
const FOND_POST = [0, -1, 0];
const FOND_KOCHER = [0.75, -0.66, 0];

// Tracés à la main : incisions, broches, hauban, vis.
const tubes = [
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

const groupes = [
  ['peau', 'Peau'], ['graisse', 'Tissu sous-cutané'], ['os', 'Os'], ['triceps', 'Triceps et anconé'], ['anterieurs', 'Biceps et brachial'], ['lateraux', 'Épicondyliens latéraux'],
  ['mediaux', 'Épicondyliens médiaux'], ['ligaments', 'Capsule et ligaments'], ['vaisseaux', 'Artères et veines'], ['nerfs', 'Nerfs'], ['incisions', 'Incisions'], ['implants', 'Matériel'],
];

const centre = [-215, -60, 1045];
const OLECRANE = [-213, -40, 1035];
const TETE = [-234, -52, 1038];
const vues = {
  // patient en décubitus latéral, bras sur un appui : l'opérateur regarde la face postérieure du coude, épaule en haut de l'image
  opPost: { de: [-25, 290, 0], cible: OLECRANE }, opPostProche: { de: [-15, 170, 0], cible: OLECRANE },
  hauban: { de: [-170, 130, 20], cible: [-213, -48, 1030] },
  // décubitus dorsal, avant-bras en pronation sur le thorax : l'opérateur regarde la face latérale du coude
  opLat: { de: [-215, 190, 0], cible: TETE }, opLatProche: { de: [-125, 110, 0], cible: TETE },
  libre: { de: [-250, 250, 60] },
};
const HAUBAN = ['hauban'];
const VIS = ['vis-tete1', 'vis-tete2'];
const IMPLANTS = [...HAUBAN, ...VIS];

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
  kocher: { court: 'Kocher', titre: 'Voie latérale de Kocher (tête radiale)', fendre: peauFendue(PEAU_KOCHER, FOND_KOCHER, 'antérieure', 'postérieure'), steps: [
    { titre: 'Installation et incision', vue: 'opLat',
      texte: 'Vue de l’opérateur : décubitus dorsal, bras sur une table à bras ou avant-bras sur le thorax, coude fléchi, avant-bras en pronation complète : la pronation éloigne le nerf interosseux postérieur du champ. Incision oblique de 5 à 6 cm, de l’épicondyle latéral vers la crête de l’ulna, en passant sur la tête radiale. Le modèle est ici coude en extension et en supination.',
      montrer: ['incision-kocher'], danger: ['nip', 'nradial-prof'], masquer: IMPLANTS },
    { titre: 'Peau et fascia', vue: 'opLatProche',
      texte: 'Peau et tissu sous-cutané sont incisés ; les lambeaux sont levés au ras du fascia. L’intervalle se reconnaît à un liseré graisseux entre l’anconé, en arrière, et l’extenseur ulnaire du carpe, en avant : il est plus facile à trouver en distal.',
      accent: ['ancone', 'ecu'], danger: ['nip', 'ncutpost'], masquer: IMPLANTS, ecarter: kocherPeau(1) },
    { titre: 'Intervalle anconé / extenseur ulnaire du carpe', vue: 'opLatProche',
      texte: 'Le fascia est incisé sur le liseré. L’anconé (nerf radial) est récliné en arrière, l’extenseur ulnaire du carpe (nerf interosseux postérieur) en avant : c’est un plan internerveux. La capsule et le ligament annulaire apparaissent au fond. La dissection ne dépasse pas le col du radius en distal.',
      accent: ['ancone', 'ecu', 'capsule', 'annulaire'], danger: ['nip', 'nradial-prof'], masquer: IMPLANTS, ecarter: { ...kocherPeau(1.6), ...kocherMuscles(8, 7) } },
    { titre: 'Capsulotomie', vue: 'opLatProche',
      texte: 'La capsule est incisée longitudinalement, en avant de l’équateur du capitulum et de la tête radiale, puis le ligament annulaire : rester en avant respecte le faisceau ulnaire du ligament collatéral latéral, dont la section expose à l’instabilité postéro-latérale. La tête radiale et le capitulum sont exposés ; on voit surtout la moitié postérieure de la tête.',
      accent: ['radius', 'humerus'], danger: ['nip', 'nradial-prof', 'lcr'], masquer: IMPLANTS, ecarter: { ...kocherPeau(1.8), ...kocherMuscles(10, 8) }, sectionner: CAPSULOTOMIE },
    { titre: 'Ostéosynthèse de la tête radiale', vue: 'opLatProche',
      texte: 'Réduction des fragments, puis vis enfouies (ou plaque) placées dans la « zone de sécurité » : l’arc de 90 à 110° de la tête qui ne s’articule pas avec l’ulna, repéré entre le tubercule de Lister et la styloïde radiale, avant-bras en rotation neutre. Fracture non reconstructible : prothèse de tête radiale. Fermeture soigneuse du ligament annulaire et de la capsule.',
      accent: VIS, danger: ['nip', 'nradial-prof'], voiler: ['radius'], montrer: VIS, masquer: HAUBAN, ecarter: { ...kocherPeau(1.8), ...kocherMuscles(10, 8) }, sectionner: CAPSULOTOMIE },
  ] },
};

export default { nom: 'Coude droit', graisse: 3, centre, vues, meshes, tubes, groupes, voies };
