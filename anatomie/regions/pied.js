// Pied droit — abords du calcanéus : sinus du tarse et voie latérale étendue.
// Repère BodyParts3D, en millimètres : x = latéral (-) / médial (+), y = vers les orteils (-) / vers le talon (+), z = vers le haut.
import pieces from './pied.pieces.js';
import { peauFendue, charge, lame, deuxBerges } from './outils.js';

const meshes = [
  ['peau-jambe', 'Peau', 'peau', '#e2b596', { id: 'peau', dossier: 'models-z' }],
  ...pieces,
];

// ----- Sinus du tarse : de la pointe de la malléole latérale vers la base du 4e métatarsien -----
const PEAU_ST = [[-111, -46, 47], [-111, -58, 44], [-107, -69, 39], [-112, -82, 38], [-112, -94, 34], [-113, -99, 36]];
const FOND_ST = [1, 0, -0.35];
const LIGNE_ST = [[-104, -50, 43], [-107, -96, 32]];
const HAUT_ST = [0.2, -0.2, 0.96];
const BAS_ST = [-0.2, 0.2, -0.96];

// ----- Voie latérale étendue : incision en L, branche verticale entre fibula et tendon calcanéen, branche horizontale à la limite de la peau plantaire -----
const PEAU_L = [[-93, -24, 77], [-93, -25, 59], [-92, -20, 40], [-93, -20, 26], [-97, -20, 13], [-101, -24, 4], [-105, -36, 3], [-112, -50, 2], [-118, -64, 3], [-124, -79, 4], [-128, -91, 5]];
const FOND_L = [1, 0, 0.1];

const visST = (n, de, a) => [`plaque-st/vis${n}`, 'Vis', 'implants', '#cfd6dd', 1.5, [de, de.map((c, i) => (c + a[i]) / 2), a]];
const visL = (n, x, y, z, vers) => [`plaque-l/vis${n}`, 'Vis verrouillée', 'implants', '#cfd6dd', 1.5, [[x, y, z], [(x + vers[0]) / 2, (y + vers[1]) / 2, (z + vers[2]) / 2], vers]];
const tubes = [
  ['incision-st', 'Incision — sinus du tarse', 'incisions', '#35e0c8', 1.1, PEAU_ST.map(([x, y, z]) => [x - 1.8, y, z + 0.6])],
  ['incision-l', 'Incision — voie latérale étendue', 'incisions', '#35e0c8', 1.2, PEAU_L.map(([x, y, z]) => [x - 3, y + 0.8, z - 1.2])],
  visST(1, [-96, -52, 38], [-60, -56, 40]), visST(2, [-101, -72, 34], [-76, -76, 32]), visST(3, [-89, -33, 34], [-66, -27, 26]),
  visL(1, -96, -50, 37, [-60, -56, 40]), visL(2, -92, -44, 37, [-62, -48, 39]), visL(3, -88, -28, 30, [-62, -24, 26]), visL(4, -88, -26, 18, [-64, -22, 16]),
  visL(5, -101, -72, 32, [-76, -75, 31]), visL(6, -100, -70, 22, [-78, -72, 22]),
];
const rubans = [
  ['plaque-st', 'Plaque du sinus du tarse', 'implants', '#b9c2cc', [[-88.5, -32, 36], [-92.5, -46, 36.5], [-99.5, -60, 35.5], [-101.5, -74, 34]], 9, 1.6, [0, 0, 1]],
  ['plaque-l', 'Plaque latérale du calcanéus', 'implants', '#b9c2cc', [[-88, -23, 25], [-92, -42, 27], [-98.5, -60, 28], [-101.5, -76, 27.5]], 23, 1.6, [0, 0, 1]],
];

const groupes = [
  ['peau', 'Peau'], ['graisse', 'Tissu sous-cutané'], ['os', 'Os'], ['lateraux', 'Fibulaires'], ['anterieurs', 'Loge antérieure'], ['posterieurs', 'Loge postérieure'], ['pied', 'Muscles du pied'],
  ['ligaments', 'Ligaments et rétinaculums'], ['vaisseaux', 'Artères et veines'], ['nerfs', 'Nerfs'], ['incisions', 'Incisions'], ['implants', 'Plaques et vis'],
];

const centre = [-90, -60, 40];
const vues = {
  // décubitus latéral sur le côté sain : l'opérateur regarde la face latérale du pied, orteils à droite
  opST: { de: [-240, -30, 75], cible: [-105, -70, 38] }, opSTProche: { de: [-135, -15, 45], cible: [-104, -68, 38] },
  opL: { de: [-270, 20, 10], cible: [-100, -48, 26] }, opLProche: { de: [-180, 12, -8], cible: [-100, -48, 24] },
  libre: { de: [-250, -200, 120] },
};
const IMPLANTS = ['plaque-st', 'plaque-l'];
const RETINACULUMS = ['ret-fib-inf', 'ret-fib-sup', 'ret-ext-inf'];

// Sinus du tarse : berge dorsale relevée avec le court extenseur des orteils, berge plantaire abaissée avec les tendons fibulaires et le nerf sural.
const optsST = { rayon: 16, profondeur: 24 };
const PEAU_ST_DROITE = [PEAU_ST[0], PEAU_ST[PEAU_ST.length - 1]];
const stPeau = e => deuxBerges(PEAU_ST, FOND_ST,
  { vers: HAUT_ST, lame: lame(PEAU_ST_DROITE, HAUT_ST, FOND_ST, e, e * 2.4 + 8, optsST) },
  { vers: BAS_ST, lame: lame(PEAU_ST_DROITE, BAS_ST, FOND_ST, e, e * 2.4 + 8, optsST) });
const stProfond = e => ({
  ...charge(['edb', 'ehb', 'nfibsup-int', 'atarsienne-lat'], lame(LIGNE_ST, HAUT_ST, FOND_ST, e, e * 2.4 + 12, { rayon: 18, profondeur: 30 })),
  ...charge(['fibulaire-court', 'fibulaire-long', 'sural', 'vpetite-saphene'], lame(LIGNE_ST, BAS_ST, FOND_ST, e, e * 2.4 + 12, { rayon: 18, profondeur: 30 })),
});

// Voie étendue : le lambeau (peau, tendons fibulaires, nerf sural, ligament calcanéo-fibulaire) est levé d'un seul tenant, au ras de l'os.
const lambeau = k => {
  const leve = { dep: [-10 * k, -20 * k, 34 * k], autour: PEAU_L, rayon: 46, fond: FOND_L };
  const reste = { dep: [0, 2 * k, -3 * k], autour: PEAU_L, rayon: 20, fond: FOND_L };
  return {
    ...deuxBerges(PEAU_L, FOND_L, { vers: [0, -1, 1], lame: leve }, { vers: [0, 1, -1], lame: reste }),
    ...charge(['fibulaire-court', 'fibulaire-long', 'sural', 'vpetite-saphene', 'lcf', 'acalcaneennes', 'ret-fib-inf', 'ret-fib-sup'], leve),
  };
};

const voies = {
  st: { court: 'Sinus du tarse', titre: 'Abord du sinus du tarse (calcanéus mini-invasif)', fendre: peauFendue(PEAU_ST, FOND_ST, 'plantaire', 'dorsale'), steps: [
    { titre: 'Installation et incision', vue: 'opST',
      texte: 'Vue de l’opérateur : décubitus latéral sur le côté sain, pied opéré au bord de la table, garrot. Incision de 3 à 5 cm, de la pointe de la malléole latérale vers la base du 4ᵉ métatarsien, juste au-dessus des tendons fibulaires. Elle est encadrée par deux nerfs : le rameau dorsal intermédiaire du fibulaire superficiel en haut, le nerf sural en bas.',
      montrer: ['incision-st'], danger: ['sural', 'nfibsup-int'], masquer: IMPLANTS },
    { titre: 'Peau et rétinaculum', vue: 'opSTProche',
      texte: 'Lambeaux épais, sans décollement. Le rétinaculum inférieur des extenseurs est incisé ; la gaine des fibulaires, au bord inférieur de l’incision, est respectée.',
      accent: ['edb', 'fibulaire-court'], danger: ['sural', 'nfibsup-int'], masquer: IMPLANTS, ecarter: stPeau(8) },
    { titre: 'Sinus du tarse', vue: 'opSTProche',
      texte: 'Le court extenseur des orteils est désinséré du processus antérieur du calcanéus et relevé vers le haut et l’avant ; les tendons fibulaires sont abaissés. La graisse du sinus du tarse est excisée : la facette articulaire postérieure du calcanéus (articulation sous-talienne), l’angle de Gissane et le processus antérieur sont exposés. Le ligament calcanéo-fibulaire est sous les tendons fibulaires.',
      accent: ['calcaneus', 'talus', 'lig-talocalc-inteross'], danger: ['sural', 'nfibsup-int', 'lcf'], masquer: [...IMPLANTS, ...RETINACULUMS], ecarter: { ...stPeau(10), ...stProfond(9) } },
    { titre: 'Réduction et ostéosynthèse', vue: 'opSTProche',
      texte: 'La tubérosité est corrigée par une broche de Schanz percutanée (longueur, varus, hauteur) ; le fragment thalamique enfoncé est relevé à la spatule sous contrôle de la vue, calé contre le fragment sustentaculaire, resté en place, puis fixé par des vis dirigées vers le sustentaculum tali. Une petite plaque du sinus du tarse et des vis percutanées dans la tubérosité et le processus antérieur complètent le montage. Peau retirée, os translucides.',
      accent: ['plaque-st'], voiler: ['calcaneus', 'talus'], montrer: ['plaque-st'], masquer: ['plaque-l', 'peau', 'graisse', ...RETINACULUMS], estomper: ['edb', 'ehb', 'abd-5'], ecarter: stProfond(9) },
  ] },
  etendue: { court: 'Latérale étendue', titre: 'Voie latérale étendue du calcanéus (incision en L)', fendre: peauFendue(PEAU_L, FOND_L, 'lambeau', 'talon'), steps: [
    { titre: 'Installation et incision', vue: 'opL',
      texte: 'Vue de l’opérateur : décubitus latéral, après fonte de l’œdème (réapparition des plis cutanés, 7 à 14 jours). Incision en L : la branche verticale à mi-distance du bord postérieur de la fibula et du tendon calcanéen, ou plus près du tendon ; la branche horizontale à la jonction de la peau latérale et de la peau plantaire, jusqu’à la base du 5ᵉ métatarsien. L’angle est arrondi. L’artère calcanéenne latérale, qui irrigue le coin du lambeau, descend juste en avant de la branche verticale.',
      montrer: ['incision-l'], danger: ['sural', 'acalcaneennes', 'vpetite-saphene'], masquer: IMPLANTS },
    { titre: 'Lambeau de pleine épaisseur', vue: 'opL',
      texte: 'L’incision va d’emblée jusqu’à l’os à l’angle et sur la branche horizontale. Le lambeau est levé au ras du périoste, d’un seul tenant, sans dissection par plans : il contient la peau, les tendons fibulaires dans leur gaine, le nerf sural et le ligament calcanéo-fibulaire, détaché du calcanéus. Le nerf sural est exposé aux deux extrémités de l’incision.',
      accent: ['calcaneus', 'fibulaire-court', 'fibulaire-long'], danger: ['sural', 'acalcaneennes'], masquer: [...IMPLANTS, 'ret-ext-inf'], ecarter: lambeau(0.6) },
    { titre: 'Paroi latérale exposée', vue: 'opLProche',
      texte: 'Le lambeau est tenu relevé sans écarteur (« no touch ») par trois broches fichées dans la malléole latérale, le col du talus et le cuboïde, puis recourbées. Toute la paroi latérale du calcanéus est exposée, de la tubérosité à l’articulation calcanéo-cuboïdienne ; la paroi latérale soufflée est rabattue pour voir la facette postérieure enfoncée.',
      accent: ['calcaneus', 'talus', 'cuboide'], danger: ['sural', 'acalcaneennes'], masquer: [...IMPLANTS, 'ret-ext-inf'], ecarter: lambeau(1) },
    { titre: 'Réduction et plaque', vue: 'opLProche',
      texte: 'Réduction de la tubérosité sur le fragment sustentaculaire (broche de Schanz), relèvement de la facette postérieure sous contrôle de la vue, puis du processus antérieur ; broches temporaires. Une plaque anatomique latérale ponte les trois zones solides : processus antérieur, région sous-thalamique (vis vers le sustentaculum tali) et tubérosité. Fermeture en deux plans sans tension, sur drain ; le coin du lambeau est le point fragile. Os translucides.',
      accent: ['plaque-l'], voiler: ['calcaneus'], danger: ['sural', 'acalcaneennes'], montrer: ['plaque-l'], masquer: ['plaque-st', 'ret-ext-inf'], ecarter: lambeau(1) },
  ] },
};

export default { nom: 'Pied droit', graisse: 2, centre, vues, meshes, tubes, rubans, groupes, voies };
