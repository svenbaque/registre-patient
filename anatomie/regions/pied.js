// Pied droit — calcanéus (sinus du tarse, latérale étendue), talus, Lisfranc, métatarsiens et premier rayon.
// Repère BodyParts3D, en millimètres : x = latéral (-) / médial (+), y = vers les orteils (-) / vers le talon (+), z = vers le haut.
import pieces from './pied.pieces.js';
import { peauFendue, charge, lame, deuxBerges } from './outils.js';

const meshes = [
  ['peau-pied', 'Peau', 'peau', '#e2b596', { id: 'peau', dossier: 'models-z' }],
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

// ----- Talus, voie antéro-médiale : du bord antérieur de la malléole médiale au naviculaire, entre tibial antérieur et tibial postérieur -----
const PEAU_TAL = [[-49, -62, 83], [-49, -70, 77], [-49, -78, 69], [-49, -86, 63], [-50, -92, 60], [-51, -100, 53]];
const FOND_TAL = [-0.96, 0.14, -0.24];
const TAL_DORSAL = [0, -0.62, 0.78];
const TAL_PLANTAIRE = [0, 0.62, -0.78];
// ----- Lisfranc, voie dorso-médiale : en dehors du long extenseur de l'hallux, sur l'intervalle entre les bases de M1 et M2 -----
const PEAU_LIS = [[-78, -104, 71], [-77, -112, 65], [-78, -118, 63], [-78, -128, 57], [-78, -138, 49], [-78, -148, 41]];
const FOND_DOS = [0, 0.6, -0.8];
const MEDIAL = [1, 0, 0];
const LATERAL = [-1, 0, 0];
// ----- Métatarsiens, voie dorsale du 2e espace : donne M2 et M3 -----
const PEAU_META = [[-91, -122, 57], [-92, -133, 50], [-93, -144, 42], [-94, -155, 35], [-95, -166, 28], [-96, -176, 23]];
// ----- Premier rayon, voie médiale : à la jonction peau dorsale / peau plantaire, centrée sur la métatarso-phalangienne -----
const PEAU_HAL = [[-55, -140, 27], [-56, -152, 23], [-56, -164, 17], [-56, -176, 12], [-62, -188, 9], [-65, -196, 8]];
const FOND_HAL = [-1, 0, 0];
const vers = (id, nom, de, a, r = 1.4) => [id, nom, 'implants', '#cfd6dd', r, [de, de.map((c, i) => (c + a[i]) / 2), a]];

const visST = (n, de, a) => [`plaque-st/vis${n}`, 'Vis', 'implants', '#cfd6dd', 1.5, [de, de.map((c, i) => (c + a[i]) / 2), a]];
const visL = (n, x, y, z, vers) => [`plaque-l/vis${n}`, 'Vis verrouillée', 'implants', '#cfd6dd', 1.5, [[x, y, z], [(x + vers[0]) / 2, (y + vers[1]) / 2, (z + vers[2]) / 2], vers]];
const tubes = [
  ['incision-tal', 'Incision — voie antéro-médiale du talus', 'incisions', '#35e0c8', 1.1, PEAU_TAL.map(([x, y, z]) => [x + 1.8, y, z + 0.4])],
  ['incision-lis', 'Incision — voie dorso-médiale du Lisfranc', 'incisions', '#35e0c8', 1.1, PEAU_LIS.map(([x, y, z]) => [x, y - 1, z + 1.6])],
  ['incision-meta', 'Incision — voie dorsale du 2e espace', 'incisions', '#35e0c8', 1.1, PEAU_META.map(([x, y, z]) => [x, y - 1, z + 1.6])],
  ['incision-hal', 'Incision — voie médiale du premier rayon', 'incisions', '#35e0c8', 1.1, PEAU_HAL.map(([x, y, z]) => [x + 1.8, y, z])],
  vers('vis-talus/1', 'Vis du col du talus', [-60, -87, 57], [-80, -46, 53], 1.7), vers('vis-talus/2', 'Vis du col du talus', [-62, -85, 48], [-76, -44, 46], 1.7),
  vers('vis-lis/1', 'Vis de Lisfranc (cunéiforme médial → base de M2)', [-60, -108, 40], [-89, -125, 40], 1.6),
  vers('vis-lis/2', 'Vis cunéo-métatarsienne du 1er rayon', [-71, -137, 40], [-68, -105, 33], 1.6),
  ...[[-83, -108, 55, 43], [-85.5, -117, 51, 40], [-87, -128, 46, 33], [-88, -137, 41, 31]].map(([x, y, z, bas], n) => vers(`plaque-lis/vis${n}`, 'Vis', [x, y, z + 1.5], [x, y + 1, bas], 1.2)),
  ...[[-88, -127, 46.5, 34], [-88.3, -135, 41.5, 31], [-88.8, -147, 34, 23], [-89.3, -156, 28.5, 19]].map(([x, y, z, bas], n) => vers(`plaque-meta/vis${n}`, 'Vis', [x, y, z + 1.5], [x, y + 1, bas], 1.1)),
  ['scarf', 'Trait d’ostéotomie scarf (en Z)', 'implants', '#ffd166', 0.7, [[-59.5, -161, 27], [-59.5, -159, 19.5], [-60.5, -135, 28], [-60.5, -133, 21]]],
  vers('vis-scarf/1', 'Vis de l’ostéotomie scarf', [-68, -151, 34], [-68, -149, 17], 1.2), vers('vis-scarf/2', 'Vis de l’ostéotomie scarf', [-69, -141, 38.5], [-69, -139, 21], 1.2),
  ['incision-st', 'Incision — sinus du tarse', 'incisions', '#35e0c8', 1.1, PEAU_ST.map(([x, y, z]) => [x - 1.8, y, z + 0.6])],
  ['incision-l', 'Incision — voie latérale étendue', 'incisions', '#35e0c8', 1.2, PEAU_L.map(([x, y, z]) => [x - 3, y + 0.8, z - 1.2])],
  visST(1, [-96, -52, 38], [-60, -56, 40]), visST(2, [-101, -72, 34], [-76, -76, 32]), visST(3, [-89, -33, 34], [-66, -27, 26]),
  visL(1, -96, -50, 37, [-60, -56, 40]), visL(2, -92, -44, 37, [-62, -48, 39]), visL(3, -88, -28, 30, [-62, -24, 26]), visL(4, -88, -26, 18, [-64, -22, 16]),
  visL(5, -101, -72, 32, [-76, -75, 31]), visL(6, -100, -70, 22, [-78, -72, 22]),
];
const rubans = [
  ['plaque-lis', 'Plaque dorsale pontant la 2e cunéo-métatarsienne', 'implants', '#b9c2cc', [[-82.5, -104, 57.5], [-84.5, -114, 54], [-87, -126, 48.5], [-88, -139, 41]], 7, 1.4, [1, 0, 0]],
  ['plaque-meta', 'Plaque dorsale du 2e métatarsien', 'implants', '#b9c2cc', [[-88, -124, 49], [-88.3, -136, 42], [-88.8, -148, 34.5], [-89.4, -159, 27.5]], 6, 1.3, [1, 0, 0]],
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
  // talus : décubitus dorsal, l'opérateur regarde la face médiale de la cheville, orteils à gauche
  opTal: { de: [240, -70, 110], cible: [-58, -80, 64] }, opTalProche: { de: [170, -50, 80], cible: [-58, -80, 64] },
  // dos du pied : décubitus dorsal, genou fléchi, pied à plat ; l'opérateur est au bout de la table, orteils vers lui
  opLis: { de: [50, -170, 190], cible: [-80, -124, 50] }, opLisProche: { de: [40, -125, 150], cible: [-80, -124, 50] },
  opMeta: { de: [30, -170, 190], cible: [-93, -148, 38] }, opMetaProche: { de: [24, -125, 150], cible: [-93, -148, 38] },
  // premier rayon : face médiale de l'avant-pied, orteils à gauche
  opHal: { de: [230, -30, 70], cible: [-62, -165, 16] }, opHalProche: { de: [160, -20, 50], cible: [-62, -165, 16] },
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

// Lames des abords du pied : petites, peu profondes.
const optsPied = { rayon: 9, profondeur: 20 };
const bouts = ligne => [ligne[0], ligne[ligne.length - 1]];
const peauPied = (peau, fond, versA, versB, e) => deuxBerges(peau, fond,
  { vers: versA, lame: lame(bouts(peau), versA, fond, e, e * 2.2 + 5, optsPied) },
  { vers: versB, lame: lame(bouts(peau), versB, fond, e, e * 2.2 + 5, optsPied) });
const profond = (peau, fond, versA, idsA, versB, idsB, e, options = { rayon: 10, profondeur: 30 }) => ({
  ...charge(idsA, lame(bouts(peau), versA, fond, e, e * 2.4 + 12, options)),
  ...charge(idsB, lame(bouts(peau), versB, fond, e, e * 2.4 + 12, options)),
});
// Talus : tibial antérieur, veine et nerf saphènes en avant ; tibial postérieur en arrière et en bas.
const talPeau = e => peauPied(PEAU_TAL, FOND_TAL, TAL_DORSAL, TAL_PLANTAIRE, e);
const talProfond = e => profond(PEAU_TAL, FOND_TAL, TAL_DORSAL, ['tibial-ant', 'vsaphene', 'nsaphene', 'ret-ext-inf', 'ret-ext-sup'], TAL_PLANTAIRE, ['tibial-post', 'ret-flechisseurs', 'abd-hallux'], e);
// Lisfranc : long extenseur de l'hallux en dedans ; court extenseur, artère dorsale du pied et nerf fibulaire profond en dehors.
const lisPeau = e => peauPied(PEAU_LIS, FOND_DOS, MEDIAL, LATERAL, e);
const lisProfond = e => profond(PEAU_LIS, FOND_DOS, MEDIAL, ['ehl', 'tibial-ant'], LATERAL, ['ehb', 'apedieuse', 'nfibprof', 'nfibsup-med', 'arcade-veineuse', 'aarquee'], e);
// Métatarsiens : les tendons extenseurs et le court extenseur sont partagés par le plan de l'incision, chaque moitié suit sa berge.
const FENTE_META = [[-93.5, -148, 38], [0.996, -0.09, 0]];
const metaPeau = e => peauPied(PEAU_META, FOND_DOS, MEDIAL, LATERAL, e);
const metaProfond = e => profond(PEAU_META, FOND_DOS, MEDIAL, ['edl-tendons/A', 'edb/A', 'interosseux-dorsaux/A', 'nfibsup-med'], LATERAL, ['edl-tendons/B', 'edb/B', 'interosseux-dorsaux/B', 'nfibsup-int'], e);
// Premier rayon : nerf cutané dorso-médial avec la berge dorsale, abducteur de l'hallux avec la berge plantaire.
const halPeau = e => peauPied(PEAU_HAL, FOND_HAL, [0, 0, 1], [0, 0, -1], e);
const halProfond = e => ({
  ...profond(PEAU_HAL, FOND_HAL, [0, 0, 1], ['nfibsup-med', 'ehl', 'ehb'], [0, 0, -1], ['nplantaire-med'], e, { rayon: 10, profondeur: 14 }),
  'abd-hallux': lame([[-58, -138, 20], [-60, -178, 6]], [0, 0.2, -1], FOND_HAL, e + 4, 30, { rayon: 10, profondeur: 26 }),
});
const CAPSULE_MTP1 = { 'capsules-mtp': { autour: [[-60, -156, 17], [-60, -168, 12], [-62, -180, 10]], rayon: 12 } };

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
  talus: { court: 'Talus', titre: 'Voie antéro-médiale du talus', fendre: peauFendue(PEAU_TAL, FOND_TAL, 'dorsale', 'plantaire'), steps: [
    { titre: 'Installation et incision', vue: 'opTal',
      texte: 'Vue de l’opérateur : décubitus dorsal, pied au bord de la table, garrot. Incision de 7 à 10 cm, commencée juste en avant de la malléole médiale et dirigée vers le naviculaire, à mi-chemin entre le tendon tibial antérieur (en avant) et le tendon tibial postérieur (en arrière). La grande veine saphène et le nerf saphène croisent en avant de la malléole. Pour une fracture comminutive du col, cette voie est doublée d’une voie antéro-latérale afin de contrôler la longueur et la rotation.',
      montrer: ['incision-tal'], danger: ['vsaphene', 'nsaphene'] },
    { titre: 'Entre tibial antérieur et tibial postérieur', vue: 'opTalProche',
      texte: 'Peau et tissu sous-cutané sont ouverts en lambeaux épais ; la veine et le nerf saphènes sont réclinés en avant avec le tibial antérieur. Le tendon tibial postérieur reste dans sa gaine, en arrière et en bas : il ne faut ni l’ouvrir ni passer sous la malléole, où cheminent le pédicule tibial postérieur et les rameaux deltoïdiens.',
      accent: ['tibial-ant', 'tibial-post'], danger: ['vsaphene', 'nsaphene', 'atibiale-post', 'ntibial'], ecarter: talPeau(8) },
    { titre: 'Col du talus', vue: 'opTalProche',
      texte: 'La capsule talo-naviculaire et tibio-talienne est incisée dans l’axe de l’incision : la face médiale du col, le bord médial du dôme et l’articulation talo-naviculaire sont exposés. On ne dépérioste ni la face dorsale du col (artère dorsale du pied) ni sa face plantaire (artère du canal tarsien) ; le ligament deltoïde, qui porte les rameaux deltoïdiens vascularisant les deux tiers médiaux du corps, est respecté. Si le corps doit être exposé, on réalise une ostéotomie de la malléole médiale plutôt que de sectionner le deltoïde.',
      accent: ['talus', 'naviculaire'], danger: ['deltoide-nav', 'deltoide-calc', 'deltoide-post', 'apedieuse', 'atibiale-post'], masquer: ['ret-ext-inf', 'ret-ext-sup', 'ret-flechisseurs'], ecarter: { ...talPeau(11), ...talProfond(10) } },
    { titre: 'Réduction et vissage', vue: 'opTalProche',
      texte: 'La comminution siège le plus souvent en dedans et en dorsal : la réduction se juge sur la corticale latérale (par la voie antéro-latérale) pour ne pas raccourcir le col en varus. Fixation par deux vis de 3,5 ou 4 mm enfouies dans le bord de la tête, dirigées vers l’arrière et le dehors dans le corps ; en cas de comminution médiale, vis de position (sans compression) ou mini-plaque médiale pontant le défect.',
      accent: ['vis-talus/1', 'vis-talus/2'], voiler: ['talus'], danger: ['deltoide-nav', 'deltoide-post'], montrer: ['vis-talus/1', 'vis-talus/2'], masquer: ['ret-ext-inf', 'ret-ext-sup', 'ret-flechisseurs'], ecarter: { ...talPeau(11), ...talProfond(10) } },
  ] },
  lisfranc: { court: 'Lisfranc', titre: 'Voie dorso-médiale du médio-pied (Lisfranc)', fendre: peauFendue(PEAU_LIS, FOND_DOS, 'médiale', 'latérale'), steps: [
    { titre: 'Installation et incision', vue: 'opLis',
      texte: 'Vue de l’opérateur : décubitus dorsal, coussin sous la fesse, genou fléchi pour poser le pied à plat ; l’opérateur est au bout de la table. Incision longitudinale dorsale de 6 à 8 cm, juste en dehors du tendon long extenseur de l’hallux, centrée sur l’intervalle entre les bases du 1ᵉʳ et du 2ᵉ métatarsien. Une seconde incision, en regard du 4ᵉ métatarsien, est ajoutée si les rayons latéraux doivent être abordés : le pont cutané doit rester large.',
      montrer: ['incision-lis'], danger: ['nfibsup-med', 'apedieuse', 'nfibprof'] },
    { titre: 'Entre long et court extenseurs de l’hallux', vue: 'opLisProche',
      texte: 'Sous la peau, le rameau cutané dorsal médial du nerf fibulaire superficiel est repéré et récliné. Le fascia est ouvert entre le long extenseur de l’hallux, récliné en dedans, et le court extenseur de l’hallux, récliné en dehors. Sous ce dernier courent l’artère dorsale du pied et le nerf fibulaire profond : ils sont mobilisés en bloc avec le court extenseur, sans les disséquer.',
      accent: ['ehl', 'ehb'], danger: ['apedieuse', 'nfibprof', 'nfibsup-med'], masquer: ['ret-ext-inf'], ecarter: { ...lisPeau(7), ...lisProfond(4) } },
    { titre: 'Articulations cunéo-métatarsiennes', vue: 'opLisProche',
      texte: 'Dissection au ras de l’os, en lambeaux de pleine épaisseur. Les deux premières articulations tarso-métatarsiennes et l’intervalle cunéiforme médial – base de M2 (ligament de Lisfranc) sont exposés. Entre les bases de M1 et M2, l’artère dorsale du pied plonge vers la plante (artère plantaire profonde) : c’est le point dangereux de la voie.',
      accent: ['cuneiforme-med', 'cuneiforme-int', 'm1', 'm2', 'lig-lisfranc'], danger: ['apedieuse', 'aplantaire-prof', 'nfibprof'], masquer: ['ret-ext-inf', 'lig-tarsometa'], ecarter: { ...lisPeau(8), ...lisProfond(7) } },
    { titre: 'Réduction et fixation', vue: 'opLisProche',
      texte: 'On réduit de dedans en dehors : 1ʳᵉ cunéo-métatarsienne, puis la base de M2 dans sa mortaise (davier pointu entre cunéiforme médial et M2), enfin les rayons latéraux. Fixation rigide de la colonne médiale : vis de Lisfranc du cunéiforme médial vers la base de M2, vis ou plaques dorsales pontant les 1ʳᵉ et 2ᵉ articulations (les plaques épargnent le cartilage). Les 4ᵉ et 5ᵉ rayons, mobiles, sont seulement brochés. Arthrodèse primaire si la lésion est purement ligamentaire.',
      accent: ['vis-lis/1', 'vis-lis/2', 'plaque-lis'], voiler: ['cuneiforme-med', 'm2', 'm1'], danger: ['apedieuse', 'nfibprof'], montrer: ['vis-lis/1', 'vis-lis/2', 'plaque-lis'], masquer: ['ret-ext-inf', 'lig-tarsometa'], ecarter: { ...lisPeau(8), ...lisProfond(7) } },
  ] },
  meta: { court: 'Métatarsiens', titre: 'Voie dorsale des métatarsiens (2ᵉ espace)', fendre: [...peauFendue(PEAU_META, FOND_DOS, 'médiale', 'latérale'),
    ['edl-tendons', ...FENTE_META, 'Tendons extenseurs — 2ᵉ orteil', 'Tendons extenseurs — 3ᵉ au 5ᵉ orteil'], ['edb', ...FENTE_META, 'Court extenseur — faisceaux médiaux', 'Court extenseur — faisceaux latéraux'],
    ['interosseux-dorsaux', ...FENTE_META, 'Interosseux dorsaux — 1ᵉʳ et 2ᵉ espaces', 'Interosseux dorsaux — espaces latéraux']], steps: [
    { titre: 'Installation et incision', vue: 'opMeta',
      texte: 'Vue de l’opérateur : décubitus dorsal, genou fléchi, pied à plat. Pour un seul métatarsien, incision longitudinale de 3 à 5 cm centrée sur la fracture, dans l’axe de l’os. Pour deux métatarsiens voisins, l’incision est placée dans l’espace qui les sépare : ici le 2ᵉ espace, pour M2 et M3 (une incision dans le 4ᵉ espace donnerait M4 et M5). Entre deux incisions dorsales, garder un pont cutané d’au moins 3 à 4 cm.',
      montrer: ['incision-meta'], danger: ['nfibsup-med', 'nfibsup-int'] },
    { titre: 'Plan des extenseurs', vue: 'opMetaProche',
      texte: 'Les veines dorsales transversales sont liées, les rameaux cutanés du nerf fibulaire superficiel réclinés. On passe entre les tendons extenseurs de deux rayons voisins (ou, pour un seul métatarsien, entre son tendon long extenseur et son tendon court extenseur) : aucun tendon n’est sectionné.',
      accent: ['edl-tendons/A', 'edl-tendons/B', 'edb/A', 'edb/B'], danger: ['nfibsup-med', 'nfibsup-int', 'adigitales-dors'], ecarter: { ...metaPeau(7), ...metaProfond(4) } },
    { titre: 'Métatarsiens exposés', vue: 'opMetaProche',
      texte: 'Les muscles interosseux dorsaux ne sont pas incisés : ils sont décollés de la diaphyse au ras de l’os, juste ce qu’il faut pour poser l’implant. Le dépériostage est limité au foyer. Dans l’espace intermétatarsien, en profondeur, passent les vaisseaux et nerfs digitaux.',
      accent: ['m2', 'm3'], danger: ['adigitales-dors', 'nfibsup-med'], ecarter: { ...metaPeau(8), ...metaProfond(7) } },
    { titre: 'Ostéosynthèse', vue: 'opMetaProche',
      texte: 'L’essentiel est de rétablir la longueur et surtout la position de la tête dans le plan sagittal (une tête ascensionnée ou abaissée entraîne une métatarsalgie de transfert). Mini-plaque dorsale de 2,0 à 2,7 mm avec au moins deux vis de part et d’autre, ou brochage axial rétrograde pour une fracture transversale simple ; vis seules pour un trait spiroïde long.',
      accent: ['plaque-meta'], voiler: ['m2'], montrer: ['plaque-meta'], danger: ['adigitales-dors'], ecarter: { ...metaPeau(8), ...metaProfond(7) } },
  ] },
  hallux: { court: '1ᵉʳ rayon', titre: 'Voie médiale du premier rayon (hallux valgus)', fendre: peauFendue(PEAU_HAL, FOND_HAL, 'dorsale', 'plantaire'), steps: [
    { titre: 'Installation et incision', vue: 'opHal',
      texte: 'Vue de l’opérateur : décubitus dorsal, membre en légère rotation latérale, garrot à la cheville ou à la cuisse. Incision médiale longitudinale, à la jonction de la peau dorsale et de la peau plantaire, de la base de la phalange proximale au tiers moyen (scarf : jusqu’à la base) du 1ᵉʳ métatarsien, centrée sur l’exostose. Le nerf cutané dorso-médial de l’hallux longe le bord dorsal de l’incision, le nerf digital plantaire médial son bord plantaire.',
      montrer: ['incision-hal'], danger: ['nfibsup-med', 'nplantaire-med'] },
    { titre: 'Capsule médiale', vue: 'opHalProche',
      texte: 'Lambeaux de pleine épaisseur jusqu’à la capsule ; le nerf dorso-médial part avec la berge dorsale. L’abducteur de l’hallux, déplacé en plantaire dans l’hallux valgus, borde la berge inférieure.',
      accent: ['capsules-mtp', 'abd-hallux'], danger: ['nfibsup-med', 'nplantaire-med'], ecarter: halPeau(6) },
    { titre: 'Capsulotomie et exostose', vue: 'opHalProche',
      texte: 'Capsulotomie médiale longitudinale (ou en L / en Y inversé selon les écoles) : la tête de M1, l’exostose médiale et la base de la phalange sont exposées. On ne dépérioste pas la face plantaire du col, par où entre la vascularisation de la tête. La libération latérale (ligament métatarso-sésamoïdien latéral, adducteur) se fait à travers l’articulation ou par une courte incision dorsale du 1ᵉʳ espace. L’exostose est réséquée à la scie, en dedans du sillon sagittal.',
      accent: ['m1', 'p1-hallux', 'sesamoides'], danger: ['nfibsup-med', 'nplantaire-med'], sectionner: CAPSULE_MTP1, ecarter: { ...halPeau(8), ...halProfond(7) } },
    { titre: 'Ostéotomie scarf et vissage', vue: 'opHalProche',
      texte: 'Ostéotomie en Z de la diaphyse : trait longitudinal oblique, du tiers dorsal en distal au tiers plantaire en proximal, terminé par deux traits transversaux à 60° (distal dorsal, proximal plantaire). Le fragment plantaire, qui porte la tête, est translaté en dehors (et tourné si besoin) ; fixation par deux vis à double pas enfouies, résection du débord médial, puis capsulorraphie médiale en tension. Une ostéotomie d’Akin de la phalange proximale complète souvent la correction.',
      accent: ['scarf', 'vis-scarf/1', 'vis-scarf/2'], voiler: ['m1'], montrer: ['scarf', 'vis-scarf/1', 'vis-scarf/2'], danger: ['nfibsup-med'], sectionner: CAPSULE_MTP1, ecarter: { ...halPeau(8), ...halProfond(7) } },
  ] },
};

export default { nom: 'Pied droit', graisse: 2, centre, vues, meshes, tubes, rubans, groupes, voies };
