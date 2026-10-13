// Fémur droit — voie latérale de la diaphyse et voie latérale du fémur distal.
// Repère BodyParts3D, en millimètres : x = latéral (-) / médial (+), y = avant (-) / arrière (+), z = vers le haut.
import pieces from './femur.pieces.js';
import { peauFendue, berges, charge } from './outils.js';

const meshes = [
  ['peau-cuisse', 'Peau', 'peau', '#e2b596', { id: 'peau', dossier: 'models-z' }],
  ...pieces,
];

const FOND = [1, 0, 0];
// Lignes d'incision relevées sur la peau, et la même ligne sur le tractus ilio-tibial.
const PEAU_DIAPHYSE = [[-173, -93, 712], [-172, -93, 677], [-168, -94, 638], [-164, -93, 601], [-152, -93, 560], [-146, -93, 532]];
const TRACTUS_DIAPHYSE = [[-152, -94, 712], [-157, -94, 640], [-152, -94, 580], [-140, -94, 532]];
const PEAU_DISTAL = [[-146, -85, 532], [-143, -85, 518], [-139, -85, 481], [-132, -85, 449], [-128, -85, 421], [-129, -88, 398]];
const TRACTUS_DISTAL = [[-141, -86, 532], [-126, -86, 481], [-118, -86, 440], [-114, -88, 398]];

const vis = (id, n, x, y, z, longueur = 30) => [`${id}/vis${n}`, 'Vis', 'implants', '#cfd6dd', 2.2, [[x - 3, y, z], [x + longueur / 2, y, z], [x + longueur, y, z]]];
const tubes = [
  ['incision-diaphyse', 'Incision — voie latérale de la cuisse', 'incisions', '#35e0c8', 1.4, PEAU_DIAPHYSE.map(([x, y, z]) => [x - 2, y, z])],
  ['incision-distal', 'Incision — voie latérale du fémur distal', 'incisions', '#35e0c8', 1.4, PEAU_DISTAL.map(([x, y, z]) => [x - 2, y, z])],
  vis('plaque-diaphyse', 1, -117, -93, 686), vis('plaque-diaphyse', 2, -115.5, -94, 668), vis('plaque-diaphyse', 3, -114, -94, 650), vis('plaque-diaphyse', 4, -112.5, -94.5, 632),
  vis('plaque-diaphyse', 5, -110, -94, 600), vis('plaque-diaphyse', 6, -109, -93.5, 584), vis('plaque-diaphyse', 7, -108, -93, 568), vis('plaque-diaphyse', 8, -107, -92, 552),
  vis('plaque-distale', 1, -106, -90, 528), vis('plaque-distale', 2, -105.5, -89, 510), vis('plaque-distale', 3, -105.5, -88, 492),
  vis('plaque-distale', 4, -113, -88, 446, 62), vis('plaque-distale', 5, -115, -80, 440, 68), vis('plaque-distale', 6, -116, -90, 430, 66), vis('plaque-distale', 7, -116, -78, 424, 70), vis('plaque-distale', 8, -115, -68, 432, 60),
];
const rubans = [
  ['plaque-diaphyse', 'Plaque latérale de la diaphyse fémorale', 'implants', '#b9c2cc', [[-118.5, -93, 694], [-116, -94, 655], [-112, -94.5, 615], [-109.5, -93.5, 578], [-107.5, -91.5, 546]], 16, 4.5, [0, 1, 0]],
  ['plaque-distale', 'Plaque condylienne latérale — tige', 'implants', '#b9c2cc', [[-107.5, -90.5, 534], [-107, -89, 500], [-107.5, -87.5, 472], [-112.5, -86, 452]], 15, 4, [0, 1, 0]],
  ['plaque-distale/tete', 'Plaque condylienne latérale — tête', 'implants', '#b9c2cc', [[-112.5, -86, 454], [-115.5, -82, 438], [-117, -80, 420]], 30, 4, [0, 1, 0]],
];

const groupes = [
  ['peau', 'Peau'], ['graisse', 'Tissu sous-cutané'], ['os', 'Os'], ['quadriceps', 'Quadriceps'], ['mediaux', 'Loge médiale'], ['posterieurs', 'Loge postérieure et mollet'],
  ['ligaments', 'Fascia, cloison, capsule et ligaments'], ['vaisseaux', 'Artères et veines'], ['nerfs', 'Nerfs'], ['incisions', 'Incisions'], ['implants', 'Plaques et vis'],
];

const centre = [-110, -85, 600];
const DIAPHYSE = [-120, -92, 622];
const DISTAL = [-115, -88, 462];
const vues = {
  // décubitus dorsal, coussin sous la fesse (ou décubitus latéral) : l'opérateur est en dehors de la cuisse, tête du patient à gauche, face antérieure en haut
  opDiaphyse: { de: [-470, -70, 0], haut: [0, -1, 0], cible: DIAPHYSE }, opDiaphyseProche: { de: [-330, -50, 0], haut: [0, -1, 0], cible: DIAPHYSE },
  opDistal: { de: [-400, -60, 0], haut: [0, -1, 0], cible: DISTAL }, opDistalProche: { de: [-270, -45, 0], haut: [0, -1, 0], cible: DISTAL },
  libre: { de: [-350, -250, 60] },
};
const IMPLANTS = ['plaque-diaphyse', 'plaque-distale'];
const DECOR = ['nclc']; // nerf cutané qui traverse le champ au-dessus de la peau ouverte

// Peau puis tractus ilio-tibial s'ouvrent sur la même ligne ; berge /A en avant, /B en arrière.
const ouverture = (peau, tractus, k) => ({
  ...berges(peau, FOND, [-3, -25, 0], k, 40),
  'tractus/A': { dep: [-3, -23 * k, 0], autour: tractus, rayon: 34, fond: FOND }, 'tractus/B': { dep: [-3, 23 * k, 0], autour: tractus, rayon: 34, fond: FOND },
});
// Vaste latéral désinséré de la cloison intermusculaire, d'arrière en avant, et relevé par un écarteur de Hohmann passé sur le bord antérieur du fémur.
const hohmann = (haut, bas, profondeur) => ({ lame: [haut, bas], pousse: [0, -1, 0], course: 70, rayon: 28, fond: FOND, profondeur });
const VASTE_DIAPHYSE = charge(['vaste-lat', 'vaste-int'], hohmann([-152, -110, 705], [-142, -109, 538], 90));
const VASTE_DISTAL = charge(['vaste-lat', 'vaste-int', 'agenic-sup-lat'], hohmann([-140, -106, 538], [-124, -104, 420], 72));

const fendre = (peau, tractus) => [
  ...peauFendue(peau, FOND, 'antérieure', 'postérieure'),
  ['tractus', { ligne: tractus, fond: FOND, rayon: 30 }, 'Tractus ilio-tibial — berge antérieure', 'Tractus ilio-tibial — berge postérieure'],
];

const voies = {
  diaphyse: { court: 'Diaphyse', titre: 'Voie latérale de la diaphyse fémorale', fendre: fendre(PEAU_DIAPHYSE, TRACTUS_DIAPHYSE), steps: [
    { titre: 'Installation et incision', vue: 'opDiaphyse',
      texte: 'Vue de l’opérateur : décubitus dorsal avec un coussin sous la fesse (ou décubitus latéral, ou table orthopédique). Incision longitudinale sur la face latérale de la cuisse, sur la ligne qui joint le grand trochanter à l’épicondyle latéral ; elle est centrée sur le foyer et peut être étendue sur toute la longueur du fémur.',
      montrer: ['incision-diaphyse'], masquer: [...IMPLANTS, ...DECOR] },
    { titre: 'Peau et tractus ilio-tibial', vue: 'opDiaphyse',
      texte: 'Peau et tissu sous-cutané sont incisés, puis le tractus ilio-tibial (fascia lata) dans l’axe de ses fibres, sur la même ligne. Le vaste latéral apparaît au fond.',
      accent: ['tractus', 'vaste-lat'], masquer: [...IMPLANTS, ...DECOR], ecarter: ouverture(PEAU_DIAPHYSE, TRACTUS_DIAPHYSE, 1) },
    { titre: 'Vaste latéral relevé', vue: 'opDiaphyseProche',
      texte: 'Le vaste latéral n’est pas traversé : il est suivi en arrière jusqu’à la cloison intermusculaire latérale, puis désinséré d’elle d’arrière en avant et relevé en bloc vers l’avant. Les artères perforantes traversent la cloison et restent plaquées sur le fémur : chacune est repérée puis liée, avant qu’elle ne se déchire et ne se rétracte en arrière de la cloison.',
      accent: ['femur', 'vaste-lat', 'septum-lat'], danger: ['perforantes', 'vperforantes'], masquer: [...IMPLANTS, ...DECOR], ecarter: { ...ouverture(PEAU_DIAPHYSE, TRACTUS_DIAPHYSE, 1.2), ...VASTE_DIAPHYSE } },
    { titre: 'Fémur exposé', vue: 'opDiaphyseProche',
      texte: 'Deux écarteurs de Hohmann, l’un en avant, l’autre en arrière du fémur, tiennent l’exposition. Le périoste n’est pas décollé au-delà du strict nécessaire : les fragments gardent leurs attaches musculaires. Le nerf sciatique est en arrière de la cloison : la pointe de l’écarteur postérieur reste au contact de l’os.',
      accent: ['femur'], danger: ['perforantes', 'sciatique'], masquer: [...IMPLANTS, ...DECOR], ecarter: { ...ouverture(PEAU_DIAPHYSE, TRACTUS_DIAPHYSE, 1.25), ...VASTE_DIAPHYSE } },
    { titre: 'Réduction et plaque', vue: 'opDiaphyseProche',
      texte: 'Réduction (longueur, axe, rotation), puis plaque large sur la face latérale, côté en tension : compression pour un trait simple, pontage pour un foyer comminutif, sans dévascularisation. Le vaste latéral retombe sur la plaque ; fermeture du tractus ilio-tibial.',
      accent: ['femur'], danger: ['perforantes', 'sciatique'], montrer: ['plaque-diaphyse'], masquer: ['plaque-distale', ...DECOR], ecarter: { ...ouverture(PEAU_DIAPHYSE, TRACTUS_DIAPHYSE, 1.25), ...VASTE_DIAPHYSE } },
  ] },
  distal: { court: 'Fémur distal', titre: 'Voie latérale du fémur distal', fendre: fendre(PEAU_DISTAL, TRACTUS_DISTAL), steps: [
    { titre: 'Installation et incision', vue: 'opDistal',
      texte: 'Vue de l’opérateur : décubitus dorsal, coussin sous la fesse, genou fléchi à 30-40° sur un appui pour détendre les gastrocnémiens, qui basculent le fragment distal en arrière. Incision latérale longitudinale, de la diaphyse vers le tubercule de Gerdy, passant en regard de l’épicondyle latéral ; elle s’incurve en avant en distal si une arthrotomie est nécessaire.',
      montrer: ['incision-distal'], masquer: [...IMPLANTS, ...DECOR] },
    { titre: 'Peau et tractus ilio-tibial', vue: 'opDistal',
      texte: 'Peau et tissu sous-cutané sont incisés, puis le tractus ilio-tibial dans l’axe de ses fibres ; en distal ses fibres deviennent obliques vers le tubercule de Gerdy.',
      accent: ['tractus', 'vaste-lat'], masquer: [...IMPLANTS, ...DECOR], ecarter: ouverture(PEAU_DISTAL, TRACTUS_DISTAL, 0.9) },
    { titre: 'Vaste latéral relevé', vue: 'opDistalProche',
      texte: 'Le vaste latéral est désinséré de la cloison intermusculaire latérale et relevé en avant, sous le muscle (sub-vastus). L’artère supéro-latérale du genou croise le champ au-dessus du condyle : elle est liée. Les perforantes sont liées plus haut.',
      accent: ['femur', 'vaste-lat'], danger: ['agenic-sup-lat', 'perforantes'], masquer: [...IMPLANTS, ...DECOR], ecarter: { ...ouverture(PEAU_DISTAL, TRACTUS_DISTAL, 1.1), ...VASTE_DISTAL } },
    { titre: 'Condyle latéral et articulation', vue: 'opDistalProche',
      texte: 'La face latérale de la métaphyse et du condyle latéral est exposée. Pour une fracture articulaire, la capsule est ouverte en para-patellaire latéral : la surface articulaire est réduite sous contrôle de la vue et fixée par des vis de traction avant la plaque. Le ligament collatéral fibulaire et le tendon du poplité, sur l’épicondyle, sont respectés ; le nerf fibulaire commun est en arrière du biceps.',
      accent: ['femur'], danger: ['agenic-sup-lat', 'nfibcommun', 'lcl'], masquer: [...IMPLANTS, ...DECOR], ecarter: { ...ouverture(PEAU_DISTAL, TRACTUS_DISTAL, 1.15), ...VASTE_DISTAL },
      sectionner: { capsule: { autour: [[-108, -98, 462], [-110, -96, 412]], rayon: 15 }, 'retinaculum-lat': { autour: [[-108, -98, 440], [-110, -96, 405]], rayon: 14 } } },
    { titre: 'Réduction et plaque', vue: 'opDistalProche',
      texte: 'Le bloc articulaire reconstruit est réaligné sur la diaphyse (longueur, axe frontal, récurvatum, rotation), puis fixé par une plaque anatomique verrouillée : sa tête épouse le condyle latéral, ses vis épiphysaires sont parallèles à l’interligne, sa tige est glissée sous le vaste latéral. Les vis distales ne doivent dépasser ni dans l’échancrure ni en dedans.',
      voiler: ['femur'], danger: ['agenic-sup-lat', 'nfibcommun'], montrer: ['plaque-distale'], masquer: ['plaque-diaphyse', ...DECOR], ecarter: { ...ouverture(PEAU_DISTAL, TRACTUS_DISTAL, 1.15), ...VASTE_DISTAL } },
  ] },
};

export default { nom: 'Fémur droit', graisse: 6, centre, vues, meshes, tubes, rubans, groupes, voies };
