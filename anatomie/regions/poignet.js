// Poignet droit — voie de Henry modifiée, canal carpien, voie dorsale, voie antéro-ulnaire étendue, voies antérieure et dorsale du scaphoïde.
import { peauFendue, berges, charge as chargeLame, lame, deuxBerges } from './outils.js';

// Repère BodyParts3D, en millimètres : membre le long du corps, paume vers l'avant.
// x = côté radial (-) / côté ulnaire (+), y = face palmaire (-) / face dorsale (+), z = proximal (+) / distal (-).

const meshes = [
  ['peau-poignet', 'Peau', 'peau', '#e2b596', { id: 'peau', dossier: 'models-z' }],
  ['FMA23464', 'Radius', 'os', '#e9e2cf'],
  ['FMA23467', 'Ulna', 'os', '#e9e2cf'],
  ['FMA24435', 'Scaphoïde', 'os', '#ded6c0'],
  ['FMA24437', 'Lunatum', 'os', '#ded6c0'],
  ['FMA24439', 'Triquétrum', 'os', '#ded6c0'],
  ['FMA24441', 'Pisiforme', 'os', '#ded6c0'],
  ['FMA24443', 'Trapèze', 'os', '#ded6c0'],
  ['FMA23725', 'Trapézoïde', 'os', '#ded6c0'],
  ['FMA24446', 'Capitatum', 'os', '#ded6c0'],
  ['FMA24448', 'Hamatum', 'os', '#ded6c0'],
  ['FMA24464', '1er métacarpien', 'os', '#e9e2cf'],
  ['FMA24466', '2e métacarpien', 'os', '#e9e2cf'],
  ['FMA24468', '3e métacarpien', 'os', '#e9e2cf'],
  ['FMA24470', '4e métacarpien', 'os', '#e9e2cf'],
  ['FMA24472', '5e métacarpien', 'os', '#e9e2cf'],
  ['FMA24450', 'Phalange proximale du pouce', 'os', '#e9e2cf'],
  ['FMA24451', 'Phalange proximale de l’index', 'os', '#e9e2cf'],
  ['FMA24452', 'Phalange proximale du majeur', 'os', '#e9e2cf'],
  ['FMA24453', 'Phalange proximale de l’annulaire', 'os', '#e9e2cf'],
  ['FMA24454', 'Phalange proximale de l’auriculaire', 'os', '#e9e2cf'],
  ['FMA24455', 'Phalange moyenne de l’index', 'os', '#e9e2cf'],
  ['FMA24456', 'Phalange moyenne du majeur', 'os', '#e9e2cf'],
  ['FMA24457', 'Phalange moyenne de l’annulaire', 'os', '#e9e2cf'],
  ['FMA24458', 'Phalange moyenne de l’auriculaire', 'os', '#e9e2cf'],
  ['FMA24459', 'Phalange distale du pouce', 'os', '#e9e2cf'],
  ['FMA24460', 'Phalange distale de l’index', 'os', '#e9e2cf'],
  ['FMA24461', 'Phalange distale du majeur', 'os', '#e9e2cf'],
  ['FMA24462', 'Phalange distale de l’annulaire', 'os', '#e9e2cf'],
  ['FMA24463', 'Phalange distale de l’auriculaire', 'os', '#e9e2cf'],
  ['FMA38460', 'Fléchisseur radial du carpe (FCR)', 'flechisseurs', '#c4527a'],
  ['FMA38463', 'Long palmaire', 'flechisseurs', '#b5483f'],
  ['FMA38482', 'Long fléchisseur du pouce', 'flechisseurs', '#d9773f'],
  ['FMA38640', 'Fléchisseur superficiel des doigts (chef radial)', 'flechisseurs', '#a8444f'],
  ['FMA38638', 'Fléchisseur superficiel des doigts (chef huméro-ulnaire)', 'flechisseurs', '#9c4048'],
  ['FMA38479', 'Fléchisseur profond des doigts', 'flechisseurs', '#8f3d46'],
  ['FMA38454', 'Carré pronateur', 'profond', '#c9b23c'],
  ['FMA38486', 'Brachio-radial', 'lateraux', '#7d6bb5'],
  ['FMA38516', 'Long abducteur du pouce', 'lateraux', '#6f73b8'],
  ['FMA38519', 'Court extenseur du pouce', 'extenseurs', '#6a7fb8'],
  ['FMA38522', 'Long extenseur du pouce', 'extenseurs', '#6388b5'],
  ['FMA38495', 'Long extenseur radial du carpe', 'extenseurs', '#5f93b0'],
  ['FMA38498', 'Court extenseur radial du carpe', 'extenseurs', '#5b9aa8'],
  ['FMA38501', 'Extenseur des doigts', 'extenseurs', '#5a8f9c'],
  ['FMA38504', 'Extenseur du petit doigt', 'extenseurs', '#568595'],
  ['FMA38525', 'Extenseur de l’index', 'extenseurs', '#527b8d'],
  ['FMA37386', 'Court abducteur du pouce', 'main', '#c25a4c'],
  ['FMA37390', 'Opposant du pouce', 'main', '#b5524a'],
  ['FMA37396', 'Abducteur du petit doigt', 'main', '#b05a55'],
  ['FMA37398', 'Court fléchisseur du petit doigt', 'main', '#a8554f'],
  ['FMA37400', 'Opposant du petit doigt', 'main', '#a0504a'],
  ['FMA40120', 'Rétinaculum des fléchisseurs', 'ligaments', '#dfe6ec'],
  // Nerfs, artères, veines, ligaments, gaine du FCR et fléchisseur ulnaire du carpe : modèle Z-Anatomy (CC BY-SA 4.0).
  ['m-fcu-humeral', 'Fléchisseur ulnaire du carpe (chef huméral)', 'flechisseurs', '#b0506a', { id: 'fcu', dossier: 'models-z' }],
  ['m-fcu-ulnaire', 'Fléchisseur ulnaire du carpe (chef ulnaire)', 'flechisseurs', '#b0506a', { id: 'fcu/ulnaire', dossier: 'models-z' }],
  ['m-gaine-fcr', 'Gaine du fléchisseur radial du carpe', 'gaines', '#d9e2ea', { id: 'gaine-fcr', dossier: 'models-z' }],
  ['m-retinaculum-ext', 'Rétinaculum des extenseurs', 'ligaments', '#dfe6ec', { id: 'retinaculum-ext', dossier: 'models-z' }],
  ['m-adducteur-pouce-t', 'Adducteur du pouce (chef transverse)', 'main', '#a8504a', { id: 'adducteur-pouce', dossier: 'models-z' }],
  ['m-adducteur-pouce-o', 'Adducteur du pouce (chef oblique)', 'main', '#a8504a', { id: 'adducteur-pouce/o', dossier: 'models-z' }],
  ['m-fpb', 'Court fléchisseur du pouce', 'main', '#b85a52', { id: 'fpb', dossier: 'models-z' }],
  ['p-capsule', 'Capsule radio-carpienne', 'ligaments', '#efe9da', { id: 'capsule', dossier: 'models-z' }],
  ['p-membrane', 'Membrane interosseuse', 'ligaments', '#d6d0c0', { id: 'membrane', dossier: 'models-z' }],
  ['p-disque', 'Disque articulaire radio-ulnaire distal', 'ligaments', '#d9cfb6', { id: 'disque', dossier: 'models-z' }],
  ['p-lcr', 'Ligament collatéral radial du carpe', 'ligaments', '#e9e4d6', { id: 'lcr', dossier: 'models-z' }],
  ['p-lcu', 'Ligament collatéral ulnaire du carpe', 'ligaments', '#e9e4d6', { id: 'lcu', dossier: 'models-z' }],
  ['p-rsc', 'Ligament radio-scapho-capitate', 'ligaments', '#e9e4d6', { id: 'lig-palm/rsc', dossier: 'models-z' }],
  ['p-rayonne', 'Ligament radié du carpe', 'ligaments', '#e9e4d6', { id: 'lig-palm/rayonne', dossier: 'models-z' }],
  ['p-ulnolunaire', 'Ligament ulno-lunaire', 'ligaments', '#e9e4d6', { id: 'lig-palm/ul', dossier: 'models-z' }],
  ['p-ulnocapitate', 'Ligament ulno-capitate', 'ligaments', '#e9e4d6', { id: 'lig-palm/uc', dossier: 'models-z' }],
  ['p-ru-palmaire', 'Ligament radio-ulnaire palmaire', 'ligaments', '#e9e4d6', { id: 'lig-palm/ru', dossier: 'models-z' }],
  ['p-rc-dorsal', 'Ligament radio-carpien dorsal', 'ligaments', '#e9e4d6', { id: 'lig-dors/rc', dossier: 'models-z' }],
  ['p-ic-dorsal', 'Ligaments intercarpiens dorsaux', 'ligaments', '#e9e4d6', { id: 'lig-dors/ic', dossier: 'models-z' }],
  ['n-median', 'Nerf médian', 'nerfs', '#f3d98b', { id: 'nmedian', dossier: 'models-z' }],
  ['n-median-palmaire', 'Rameau cutané palmaire du nerf médian', 'nerfs', '#f3d98b', { id: 'rameau-palmaire', dossier: 'models-z' }],
  ['n-median-digitaux', 'Nerf médian — nerfs digitaux palmaires communs', 'nerfs', '#f3d98b', { id: 'nmedian/digitaux', dossier: 'models-z' }],
  ['n-interosseux-ant', 'Nerf interosseux antérieur', 'nerfs', '#f3d98b', { id: 'ninterosseux', dossier: 'models-z' }],
  ['n-ulnaire', 'Nerf ulnaire', 'nerfs', '#f3d98b', { id: 'nulnaire', dossier: 'models-z' }],
  ['n-ulnaire-sup', 'Nerf ulnaire — branche superficielle', 'nerfs', '#f3d98b', { id: 'nulnaire/sup', dossier: 'models-z' }],
  ['n-ulnaire-prof', 'Nerf ulnaire — branche profonde', 'nerfs', '#f3d98b', { id: 'nulnaire/prof', dossier: 'models-z' }],
  ['n-ulnaire-dorsal', 'Nerf ulnaire — branche dorsale', 'nerfs', '#f3d98b', { id: 'nulnaire/dorsal', dossier: 'models-z' }],
  ['n-radial-sup', 'Branche superficielle du nerf radial', 'nerfs', '#f3d98b', { id: 'nradial', dossier: 'models-z' }],
  ['n-cutane-lat', 'Nerf cutané latéral de l’avant-bras', 'nerfs', '#f3d98b', { id: 'ncutlat', dossier: 'models-z' }],
  ['a-radiale', 'Artère radiale', 'vaisseaux', '#c8102e', { id: 'aradiale', dossier: 'models-z' }],
  ['a-radiale-carpe', 'Artère radiale — rameau carpien palmaire', 'vaisseaux', '#e0392b', { id: 'aradiale/carpe', dossier: 'models-z' }],
  ['a-ulnaire', 'Artère ulnaire', 'vaisseaux', '#c8102e', { id: 'aulnaire', dossier: 'models-z' }],
  ['a-arcade-sup', 'Arcade palmaire superficielle', 'vaisseaux', '#c8102e', { id: 'arcade-sup', dossier: 'models-z' }],
  ['a-arcade-prof', 'Arcade palmaire profonde', 'vaisseaux', '#c8102e', { id: 'arcade-prof', dossier: 'models-z' }],
  ['v-radiales', 'Veines radiales', 'vaisseaux', '#2f4f9e', { id: 'vradiales', dossier: 'models-z' }],
  ['v-ulnaires', 'Veines ulnaires', 'vaisseaux', '#2f4f9e', { id: 'vulnaires', dossier: 'models-z' }],
  ['v-cephalique', 'Veine céphalique', 'vaisseaux', '#2f4f9e', { id: 'vcephalique', dossier: 'models-z' }],
  ['v-mediane', 'Veine médiane de l’avant-bras', 'vaisseaux', '#2f4f9e', { id: 'vmediane', dossier: 'models-z' }],
];

// Tracés à la main : incision et repères d'ostéosynthèse seulement.
// ----- Canal carpien : incision dans l'axe du bord radial de l'annulaire, du pli de flexion distal du poignet à la ligne de Kaplan -----
const PEAU_CC = [[-250, -131, 826], [-250, -135, 818], [-249, -140, 808], [-250, -140, 798], [-249, -144, 788], [-250, -144, 780]];
const FOND_CC = [0, 1, 0];
// ----- Voie dorsale : incision longitudinale centrée sur le tubercule de Lister, dans l'axe du 3e métacarpien -----
const PEAU_DORSALE = [[-258, -83, 872], [-258, -84, 855], [-258, -92, 840], [-259, -93, 825], [-258, -100, 810], [-258, -101, 797]];
const FOND_DORSAL = [0, -1, 0];
const tubes = [
  ['incision-cc', 'Incision — canal carpien', 'incisions', '#35e0c8', 0.9, PEAU_CC.map(([x, y, z]) => [x, y - 1.6, z])],
  ['incision-dorsale', 'Incision — voie dorsale du poignet', 'incisions', '#35e0c8', 1.1, PEAU_DORSALE.map(([x, y, z]) => [x, y + 2, z])],
  ['incision-henry', 'Incision — Henry modifiée', 'incisions', '#35e0c8', 1.1,
    [[-256, -137, 830], [-252.7, -134, 852], [-249.3, -131, 874], [-246, -128, 896]]],
  ['watershed', 'Watershed line (schématique)', 'reperes', '#7df9ff', 0.9,
    [[-278, -119, 824], [-268, -122, 823], [-258, -123, 823], [-250, -122, 824]]],
];

const groupes = [
  ['peau', 'Peau'], ['graisse', 'Tissu sous-cutané'], ['os', 'Os'], ['flechisseurs', 'Fléchisseurs'], ['profond', 'Plan profond'], ['lateraux', 'Bord radial'], ['extenseurs', 'Extenseurs'], ['main', 'Muscles de la main'],
  ['gaines', 'Gaines tendineuses'], ['ligaments', 'Capsule et ligaments'], ['vaisseaux', 'Artères et veines'], ['nerfs', 'Nerfs'],
  ['incisions', 'Incisions'], ['reperes', 'Repères d’ostéosynthèse'], ['implants', 'Plaque et vis'],
];

const centre = [-256, -112, 852]; // face palmaire du radius distal
const SITE = [-253, -118, 862];
const vues = {
  palmaire: { de: [-15, -330, 25] }, proche: { de: [-25, -215, -5] }, libre: { de: [-190, -250, 60] },
  // main en supination sur la table à main : doigts à droite, bord ulnaire en haut
  opCC: { de: [0, -210, 0], haut: [1, 0, 0], cible: [-250, -132, 803] }, opCCProche: { de: [0, -105, 0], haut: [1, 0, 0], cible: [-250, -132, 803] },
  // main en pronation : face dorsale, doigts à droite, bord radial en haut
  opDos: { de: [0, 250, 0], haut: [-1, 0, 0], cible: [-258, -96, 835] }, opDosProche: { de: [0, 140, 0], haut: [-1, 0, 0], cible: [-258, -96, 835] },
  // vue de l'opérateur : avant-bras en supination sur la table à main, main à droite, bord ulnaire en haut
  op: { de: [0, -330, 0], haut: [1, 0, 0], cible: SITE }, opProche: { de: [0, -185, 0], haut: [1, 0, 0], cible: SITE },
  opUl: { de: [0, -300, 0], haut: [1, 0, 0], cible: [-245, -128, 838] }, opUlProche: { de: [0, -170, 0], haut: [1, 0, 0], cible: [-246, -125, 838] },
  opRu: { de: [-5, -230, 30], haut: [1, 0, 0], cible: [-265, -132, 818] }, opRuProche: { de: [-3, -125, 18], haut: [1, 0, 0], cible: [-265, -128, 816] },
  opDS: { de: [0, 230, 0], haut: [-1, 0, 0], cible: [-260, -100, 823] }, opDSProche: { de: [0, 125, 0], haut: [-1, 0, 0], cible: [-260, -102, 822] },
};

const REPERES = ['watershed'];
const IMPLANTS = ['plaque', 'vis'];

// ----- Incision : une seule ligne, sur le versant médial (ulnaire) du FCR, du pli de flexion vers le haut -----
// Sur ce modèle (coude en extension) le FCR s'éloigne du radius en remontant : x = -259..-252 au pli du poignet, -248..-231 à 6 cm.
// L'incision reste en regard du radius ; la lame radiale va chercher le tendon pour le ramener en dehors.
const INCISION = [[-256, -136, 830], [-246, -127, 896]];
const N_RADIAL = [-0.989, 0, 0.150]; // perpendiculaire à l'incision, vers le bord radial
const N_ULNAIRE = [0.989, 0, -0.150];
const decale = (d) => INCISION.map(q => [q[0] + N_RADIAL[0] * d, q[1], q[2] + N_RADIAL[2] * d]);

// Peau, tissu sous-cutané et carré pronateur sont fendus le long de leur ligne d'incision.
const FENDRE_HENRY = [
  ['peau', [-251, -131, 863], N_RADIAL, 'Peau — berge radiale', 'Peau — berge ulnaire'],
  ['graisse', [-251, -131, 863], N_RADIAL, 'Tissu sous-cutané — berge radiale', 'Tissu sous-cutané — berge ulnaire'],
];
const fendre = [
  ['FMA38454', [-265, -114, 855], [1, 0, 0], 'Carré pronateur — corps relevé', 'Carré pronateur — berge radiale'],
];

// ----- Écarteurs : deux lames (type Farabeuf) parallèles à l'incision. Chaque lame repousse ce qu'elle charge et le tasse contre elle ;
// l'effet s'éteint au-delà des bouts de la lame : tendons, nerfs et vaisseaux restent fixes au canal carpien et à leur origine. -----
const FOND = [0, 1, 0]; // de la peau palmaire vers le radius
// « course » vaut plus de deux fois l'écart : tout ce qui se trouve entre l'incision et la lame est chargé en entier.
const lameRadiale = (ecart, course) => ({ lame: decale(ecart), pousse: N_RADIAL, course, rayon: 17, fond: FOND, profondeur: 48 });
const lameUlnaire = (ecart, course) => ({ lame: decale(-ecart), pousse: N_ULNAIRE, course, rayon: 17, fond: FOND, profondeur: 48 });
// ce que charge chaque lame, plan par plan (technique des ouvrages — voie trans-FCR : artère radiale en dehors ; FCR, fléchisseurs et nerf médian en dedans)
const PEAU_RADIALE = ['peau/A', 'graisse/A'];
const PEAU_ULNAIRE = ['peau/B', 'graisse/B'];
const PLAN_RADIAL = ['aradiale', 'vradiales', 'FMA38486'];
const PLAN_FCR = ['FMA38460', 'FMA38463', 'rameau-palmaire'];
const PLAN_ULNAIRE = ['FMA38482', 'FMA38640', 'FMA38638', 'FMA38479', 'nmedian'];
const charge = (ids, lame) => Object.fromEntries(ids.map(id => [id, lame]));
const PEAU_OUVERTE = { ...charge(PEAU_RADIALE, lameRadiale(10, 30)), ...charge(PEAU_ULNAIRE, lameUlnaire(10, 30)) };
const PEAU_ECARTEE = { ...charge(PEAU_RADIALE, lameRadiale(17, 42)), ...charge(PEAU_ULNAIRE, lameUlnaire(17, 42)) };
const FCR_EN_DEHORS = { ...charge(PLAN_RADIAL, lameRadiale(14, 62)), ...charge(PLAN_FCR, lameUlnaire(14, 62)) }; // artère radiale en dehors, FCR en dedans
const FLECHISSEURS_EN_DEDANS = charge(PLAN_ULNAIRE, lameUlnaire(14, 62)); // la lame ulnaire balaie tout ce qui recouvre le radius

// Carré pronateur incisé en L (bord radial et bord distal), relevé en sous-périosté vers l'ulna où il garde son attache.
const INCISION_CARRE = [[-265, -117, 834], [-262, -111, 878]];
const CARRE_RECLINE = { 'FMA38454/A': { dep: [20, -5, 0], autour: INCISION_CARRE, rayon: 21 } };

// ----- Plaque palmaire en T (tracé schématique) : barre distale sous la watershed line, tige sur la diaphyse ; vis en regard -----
const rubans = [
  ['plaque', 'Plaque palmaire — tige', 'implants', '#b9c2cc', [[-262, -121, 832], [-262, -116.5, 841], [-261, -108, 860], [-259, -99.5, 884]], 9, 2, [1, 0, 0]],
  ['plaque/tete', 'Plaque palmaire — barre distale', 'implants', '#b9c2cc', [[-276, -121.5, 831.5], [-263, -123, 831.5], [-251, -122.5, 831.5]], 8.5, 2, [0, 0, 1]],
];
// ----- Voie antéro-ulnaire étendue : bord radial du fléchisseur ulnaire du carpe, prolongée en zigzag au canal carpien -----
const PEAU_UL = [[-238, -125, 880], [-239, -127, 865], [-241, -128, 850], [-244, -130, 836], [-248, -134, 822], [-250, -140, 810], [-250, -144, 798]];
// ----- Scaphoïde, voie antérieure (Russe) : en crosse de hockey, le long du FCR jusqu'au tubercule du scaphoïde puis vers la base du pouce -----
const PEAU_RU = [[-257, -132, 840], [-259, -134, 830], [-262, -136, 820], [-265, -141, 812], [-271, -146, 805], [-277, -150, 799]];
// ----- Scaphoïde, voie dorsale : 3 cm à partir du tubercule de Lister, entre 3e et 4e compartiments -----
const PEAU_DS = [[-259, -88, 840], [-259, -91, 832], [-260, -92, 824], [-261, -95, 816], [-262, -98, 808]];
const visUl = (n, y, z) => [`plaque-ul/vis${n}`, 'Vis', 'implants', '#cfd6dd', 1.2, [[-250, y - 1.5, z], [-250, y + 9, z], [-250, y + 19, z]]];
tubes.push(
  ['incision-ul', 'Incision — voie antéro-ulnaire étendue', 'incisions', '#35e0c8', 1, PEAU_UL.map(([x, y, z]) => [x, y - 1.5, z])],
  ['incision-ru', 'Incision — voie antérieure du scaphoïde', 'incisions', '#35e0c8', 0.9, PEAU_RU.map(([x, y, z]) => [x, y - 1.5, z])],
  ['incision-ds', 'Incision — voie dorsale du scaphoïde', 'incisions', '#35e0c8', 0.9, PEAU_DS.map(([x, y, z]) => [x, y + 1.5, z])],
  visUl(1, -121, 834), visUl(2, -117, 845), visUl(3, -112.5, 856),
  ['vis-scaphoide-ant', 'Vis canulée sans tête (rétrograde, par le pôle distal)', 'implants', '#cfd6dd', 1.5, [[-269, -125, 806], [-262.5, -117.5, 813], [-256, -110, 820]]],
  ['vis-scaphoide-dos', 'Vis canulée sans tête (antérograde, par le pôle proximal)', 'implants', '#cfd6dd', 1.5, [[-257, -107, 819], [-264, -115.5, 812.5], [-271, -124, 806]]],
);
rubans.push(['plaque-ul', 'Plaque du fragment antéro-ulnaire', 'implants', '#b9c2cc', [[-250, -122.5, 831], [-250, -118, 845], [-250, -113.5, 858]], 8, 1.6, [1, 0, 0]]);

const visDistale = x => [`vis/d${-x}`, 'Vis distale verrouillée (sous-chondrale)', 'implants', '#cfd6dd', 1.25, [[x, -123, 831.5], [x, -114, 831], [x, -104.5, 830.5]]];
const visTige = (n, y, z, fond) => [`vis/p${n}`, 'Vis corticale de la tige', 'implants', '#cfd6dd', 1.25, [[-261.5, y - 1.5, z], [-261, (y + fond) / 2, z], [-260.5, fond, z]]];
tubes.push(visDistale(-272), visDistale(-265), visDistale(-258), visDistale(-252), visTige(1, -112, 850, -97), visTige(2, -106, 864, -91), visTige(3, -101, 878, -86));

// ----- Canal carpien -----
const levres = (ligne, fond, d, rayon, ids) => deuxBerges(ligne, fond,
  { vers: [1, 0, 0], lame: { dep: [d, 0, 0], autour: ligne, rayon, fond } }, { vers: [-1, 0, 0], lame: { dep: [-d, 0, 0], autour: ligne, rayon, fond } }, ids);
// peau, puis aponévrose palmaire (prolongement du long palmaire), ouvertes sur la même ligne
const ccOuvert = k => ({ ...berges(PEAU_CC, FOND_CC, [8, 0, 0], k, 15), ...levres(PEAU_CC, FOND_CC, 7 * k, 14, ['FMA38463']) });
const retinaculumOuvert = k => levres(PEAU_CC, FOND_CC, 6 * k, 16, ['FMA40120']);
const fendreCC = [
  ...peauFendue(PEAU_CC, FOND_CC, 'ulnaire', 'radiale'),
  ['FMA38463', { ligne: PEAU_CC, fond: FOND_CC, rayon: 14 }, 'Aponévrose palmaire — berge ulnaire', 'Aponévrose palmaire — berge radiale'],
  ['FMA40120', { ligne: PEAU_CC, fond: FOND_CC, rayon: 18 }, 'Rétinaculum des fléchisseurs — berge ulnaire', 'Rétinaculum des fléchisseurs — berge radiale'],
];

// ----- Voie dorsale -----
const DOS = [PEAU_DORSALE[0], PEAU_DORSALE[PEAU_DORSALE.length - 1]];
const lamesDos = (e, profondeur, ids) => deuxBerges(PEAU_DORSALE, FOND_DORSAL,
  { vers: [-1, 0, 0], lame: lame(DOS, [-1, 0, 0], FOND_DORSAL, e, e * 2.4 + 8, { rayon: 18, profondeur }) },
  { vers: [1, 0, 0], lame: lame(DOS, [1, 0, 0], FOND_DORSAL, e, e * 2.4 + 8, { rayon: 18, profondeur }) }, ids);
const dosOuvert = e => lamesDos(e, 20, ['peau', 'graisse']);
const retinaculumDorsal = e => lamesDos(e, 24, ['retinaculum-ext']);
// Le long extenseur du pouce est sorti de sa coulisse et transposé du côté radial ; les extenseurs radiaux du carpe vont en dehors, l'extenseur des doigts en dedans.
const TENDONS_ECARTES = {
  ...chargeLame(['FMA38522', 'FMA38498', 'FMA38495'], lame(DOS, [-1, 0, 0], FOND_DORSAL, 11, 34, { rayon: 18, profondeur: 26 })),
  ...chargeLame(['FMA38501', 'FMA38525', 'FMA38504'], lame(DOS, [1, 0, 0], FOND_DORSAL, 11, 34, { rayon: 18, profondeur: 26 })),
};
const fendreDos = [
  ...peauFendue(PEAU_DORSALE, FOND_DORSAL, 'radiale', 'ulnaire'),
  ['retinaculum-ext', { ligne: PEAU_DORSALE, fond: FOND_DORSAL, rayon: 20 }, 'Rétinaculum des extenseurs — lambeau radial', 'Rétinaculum des extenseurs — lambeau ulnaire'],
];
const AUTRES = [...REPERES, ...IMPLANTS];

// ----- Voie antéro-ulnaire étendue -----
const UL = [PEAU_UL[0], PEAU_UL[PEAU_UL.length - 1]];
const ulLames = (e, profondeur, ids, course = e * 2.2 + 6) => deuxBerges(PEAU_UL, FOND,
  { vers: [1, 0, 0], lame: lame(UL, [1, 0, 0], FOND, e, course, { rayon: 12, profondeur }) },
  { vers: [-1, 0, 0], lame: lame(UL, [-1, 0, 0], FOND, e, course, { rayon: 12, profondeur }) }, ids);
const ulPeau = e => ulLames(e, 16, ['peau', 'graisse']);
// pédicule ulnaire et FCU en dedans ; tendons fléchisseurs et nerf médian en dehors
const ulProfond = e => ({
  ...chargeLame(['aulnaire', 'vulnaires', 'nulnaire', 'nulnaire/sup', 'nulnaire/prof', 'fcu', 'fcu/ulnaire'], lame(UL, [1, 0, 0], FOND, e, e * 2.4 + 10, { rayon: 14, profondeur: 40 })),
  ...chargeLame(['FMA38638', 'FMA38640', 'FMA38479', 'nmedian', 'nmedian/digitaux', 'FMA38463', 'rameau-palmaire'], lame(UL, [-1, 0, 0], FOND, e, e * 2.4 + 10, { rayon: 14, profondeur: 40 })),
});
const ulRetinaculum = e => ulLames(e, 20, ['FMA40120']);
const PQ_ULNAIRE = { 'FMA38454/A': { autour: [[-246, -116, 834], [-247, -112, 860]], rayon: 9 } };

// ----- Scaphoïde, voie antérieure : les berges suivent la crosse de hockey -----
const ruPeau = d => berges(PEAU_RU, FOND, [[d, 0, 0], [d, 0, 0], [d, 0, 0], [0.7 * d, 0, -0.7 * d], [0.7 * d, 0, -0.7 * d]], 1, 9);
const RU_FCR = [[-257, -132, 840], [-264, -140, 812]];
const ruProfond = e => ({
  ...chargeLame(['FMA38460', 'gaine-fcr', 'aradiale', 'vradiales'], lame(RU_FCR, [-1, 0, 0], FOND, e / 2, e + 4, { rayon: 6, profondeur: 12 })),
  ...chargeLame(['rameau-palmaire', 'FMA38482'], lame(RU_FCR, [1, 0, 0], FOND, e, e * 2.4 + 6, { rayon: 9, profondeur: 16 })),
});
// fibres proximales des muscles thénariens désinsérées du tubercule
const RU_THENAR = { FMA37386: { autour: [[-266, -139, 810], [-279, -147, 797]], rayon: 10 } };
const RU_CAPSULE = { ...RU_THENAR, 'lig-palm/rsc': { autour: [[-262, -122, 822], [-266, -125, 806]], rayon: 6 }, capsule: { autour: [[-262, -124, 822], [-267, -127, 805]], rayon: 6 } };

// ----- Scaphoïde, voie dorsale -----
const DS = [PEAU_DS[0], PEAU_DS[PEAU_DS.length - 1]];
const dsLames = (e, profondeur, ids, course = e * 2.2 + 6) => deuxBerges(PEAU_DS, FOND_DORSAL,
  { vers: [-1, 0, 0], lame: lame(DS, [-1, 0, 0], FOND_DORSAL, e, course, { rayon: 10, profondeur }) },
  { vers: [1, 0, 0], lame: lame(DS, [1, 0, 0], FOND_DORSAL, e, course, { rayon: 10, profondeur }) }, ids);
const dsPeau = e => dsLames(e, 14, ['peau', 'graisse']);
const dsRetinaculum = e => dsLames(e, 18, ['retinaculum-ext']);
// long extenseur du pouce et extenseurs radiaux en dehors, extenseur des doigts et de l'index en dedans
const dsTendons = e => ({
  ...chargeLame(['FMA38522', 'FMA38498', 'nradial'], lame(DS, [-1, 0, 0], FOND_DORSAL, e, e * 2.4 + 6, { rayon: 10, profondeur: 20 })),
  ...chargeLame(['FMA38501', 'FMA38525'], lame(DS, [1, 0, 0], FOND_DORSAL, e, e * 2.4 + 6, { rayon: 10, profondeur: 20 })),
});
const DS_CAPSULE = { capsule: { autour: [[-259, -106, 824], [-262, -108, 810]], rayon: 6 }, 'lig-dors/ic': { autour: [[-259, -106, 824], [-262, -108, 810]], rayon: 6 }, 'lig-dors/rc': { autour: [[-259, -106, 824], [-262, -108, 810]], rayon: 6 } };

const voies = {
  henry: { court: 'Henry modifiée', titre: 'Voie de Henry modifiée (trans-gaine du FCR)', fendre: FENDRE_HENRY, steps: [
    { titre: 'Installation et incision', vue: 'op',
      texte: 'Vue de l’opérateur : décubitus dorsal, bras en abduction sur table à main, avant-bras en supination, garrot à la racine du bras. L’incision est longitudinale, sur le versant médial du relief du tendon fléchisseur radial du carpe (FCR), du pli de flexion distal du poignet vers le haut, sur 6 à 8 cm.',
      montrer: ['incision-henry'], masquer: [...REPERES, ...IMPLANTS] },
    { titre: 'Peau et gaine du FCR', vue: 'opProche',
      texte: 'Peau et tissu sous-cutané sont incisés ; les berges sont tenues par deux écarteurs. Au fond apparaît la gaine du FCR. L’artère radiale est en dehors : on ne la dissèque pas.',
      accent: ['gaine-fcr', 'FMA38460'], danger: ['aradiale', 'rameau-palmaire'], masquer: [...REPERES, ...IMPLANTS], ecarter: PEAU_OUVERTE },
    { titre: 'FCR récliné en dedans', vue: 'opProche',
      texte: 'La gaine du FCR est ouverte sur toute la longueur de l’incision. Le tendon du FCR est récliné en dedans, vers l’ulna : il protège le nerf médian et son rameau cutané palmaire, qui longe sa gaine. L’artère radiale reste en dehors, dans son tissu, sans être disséquée. Le plancher de la gaine apparaît ; il est incisé à son tour.',
      accent: ['FMA38460', 'FMA38463', 'FMA38482'], danger: ['aradiale', 'nmedian'], masquer: [...REPERES, ...IMPLANTS, 'gaine-fcr'], ecarter: { ...PEAU_ECARTEE, ...FCR_EN_DEHORS } },
    { titre: 'Long fléchisseur du pouce récliné en dedans', vue: 'opProche',
      texte: 'Sous le plancher de la gaine, le long fléchisseur du pouce est dégagé à la compresse puis récliné en dedans, au doigt, avec les autres fléchisseurs et le nerf médian, chargés par la lame ulnaire. Le carré pronateur occupe le fond du champ.',
      accent: ['FMA38454', 'FMA38482'], danger: ['aradiale', 'nmedian'], masquer: [...REPERES, ...IMPLANTS, 'gaine-fcr'], ecarter: { ...PEAU_ECARTEE, ...FCR_EN_DEHORS, ...FLECHISSEURS_EN_DEDANS } },
    { titre: 'Carré pronateur', vue: 'opProche',
      texte: 'Le carré pronateur est incisé en L : longitudinalement, le plus en dehors possible, le long de son insertion radiale, puis le long de son bord distal. Il est relevé en sous-périosté vers l’ulna, où il garde son attache. La face palmaire du radius distal et le foyer de fracture sont exposés, jusqu’à la watershed line.',
      accent: ['FMA23464', 'watershed'], danger: ['aradiale', 'nmedian'], montrer: ['watershed'], masquer: [...IMPLANTS, 'gaine-fcr'],
      ecarter: { ...PEAU_ECARTEE, ...FCR_EN_DEHORS, ...FLECHISSEURS_EN_DEDANS, ...CARRE_RECLINE } },
    { titre: 'Réduction et plaque', vue: 'opProche',
      texte: 'Réduction par traction et manœuvres directes, broches temporaires si besoin, contrôle scopique. La plaque est posée en proximal de la watershed line : plus distale, elle entre en conflit avec les fléchisseurs. Fixation provisoire par une vis corticale dans le trou oblong, réglage de la hauteur, puis vis verrouillées distales sous-chondrales, unicorticales ; l’incidence « skyline » vérifie qu’aucune ne dépasse en dorsal. Le carré pronateur est rabattu sur la plaque en fin d’intervention.',
      accent: ['watershed'], danger: ['aradiale', 'nmedian'], montrer: ['watershed', ...IMPLANTS], masquer: ['gaine-fcr'],
      ecarter: { ...PEAU_ECARTEE, ...FCR_EN_DEHORS, ...FLECHISSEURS_EN_DEDANS, ...CARRE_RECLINE } },
  ] },
  cc: { court: 'Canal carpien', titre: 'Abord du canal carpien (neurolyse du nerf médian)', fendre: fendreCC, steps: [
    { titre: 'Installation et incision', vue: 'opCC',
      texte: 'Vue de l’opérateur : main en supination sur la table à main, garrot, anesthésie locale ou loco-régionale. Incision de 3 cm dans l’axe du bord radial de l’annulaire (du côté ulnaire du long palmaire), entre le pli de flexion distal du poignet et la ligne cardinale de Kaplan. Rester du côté ulnaire protège le rameau cutané palmaire du nerf médian et son rameau moteur thénarien.',
      montrer: ['incision-cc'], danger: ['rameau-palmaire', 'arcade-sup'], masquer: AUTRES },
    { titre: 'Peau et aponévrose palmaire', vue: 'opCCProche',
      texte: 'Peau, graisse sous-cutanée puis aponévrose palmaire superficielle sont incisées dans l’axe ; un écarteur autostatique tient les berges. Les fibres transversales, nacrées, du rétinaculum des fléchisseurs apparaissent.',
      accent: ['FMA40120'], danger: ['rameau-palmaire', 'arcade-sup'], masquer: AUTRES, ecarter: ccOuvert(1) },
    { titre: 'Section du rétinaculum des fléchisseurs', vue: 'opCCProche',
      texte: 'Le rétinaculum est incisé sur son versant ulnaire, près de l’hamulus de l’hamatum, sous contrôle de la vue, d’abord en distal jusqu’à la graisse qui entoure l’arcade palmaire superficielle, puis en proximal jusqu’au fascia antébrachial, sectionné sur 2 cm. La section doit être complète : c’est la cause la plus fréquente d’échec. Du côté ulnaire : le canal de Guyon, avec le nerf et l’artère ulnaires.',
      accent: ['FMA40120', 'nmedian'], danger: ['arcade-sup', 'aulnaire', 'nmedian/digitaux'], masquer: AUTRES, ecarter: { ...ccOuvert(1.2), ...retinaculumOuvert(1) } },
    { titre: 'Nerf médian libéré', vue: 'opCCProche',
      texte: 'Le nerf médian est exposé, souvent aminci « en sablier » sous l’ancien rétinaculum, sur le lit des tendons fléchisseurs. Le rameau moteur thénarien naît de son bord radial, à la sortie du canal (parfois à travers le rétinaculum) : il est vu, pas disséqué. Pas de neurolyse interne ni de synovectomie de principe. Hémostase après lâcher du garrot, fermeture de la peau seule, mobilisation immédiate des doigts.',
      accent: ['nmedian', 'nmedian/digitaux'], danger: ['arcade-sup', 'aulnaire'], masquer: AUTRES, ecarter: { ...ccOuvert(1.3), ...retinaculumOuvert(1.5) } },
  ] },
  dorsale: { court: 'Dorsale', titre: 'Voie dorsale du poignet (3ᵉ compartiment)', fendre: fendreDos, steps: [
    { titre: 'Installation et incision', vue: 'opDos',
      texte: 'Vue de l’opérateur : main en pronation sur la table à main, garrot. Incision dorsale longitudinale, dans l’axe du 3ᵉ métacarpien, centrée sur le tubercule de Lister, qu’on palpe au dos du radius. Les branches superficielles des nerfs radial et ulnaire, et les veines dorsales, sont dans les lambeaux cutanés.',
      montrer: ['incision-dorsale'], danger: ['nradial'], masquer: AUTRES },
    { titre: 'Peau et rétinaculum des extenseurs', vue: 'opDosProche',
      texte: 'Les lambeaux cutanés sont levés épais, au ras du rétinaculum des extenseurs, pour garder les nerfs sensitifs et les veines avec la peau. Le rétinaculum est nacré, à fibres transversales ; le tendon du long extenseur du pouce se devine contre le tubercule de Lister, qu’il contourne.',
      accent: ['retinaculum-ext', 'FMA38522'], danger: ['nradial'], masquer: AUTRES, ecarter: dosOuvert(11) },
    { titre: '3ᵉ compartiment : long extenseur du pouce', vue: 'opDosProche',
      texte: 'Le rétinaculum est incisé sur le 3ᵉ compartiment, celui du long extenseur du pouce ; le tendon est libéré de sa coulisse et transposé du côté radial. Le rétinaculum est levé en deux lambeaux, qui serviront à recouvrir une plaque.',
      accent: ['FMA38522', 'retinaculum-ext'], danger: ['nradial'], masquer: AUTRES, ecarter: { ...dosOuvert(13), ...retinaculumDorsal(8) } },
    { titre: 'Radius dorsal exposé', vue: 'opDosProche',
      texte: 'Les 2ᵉ et 4ᵉ compartiments sont décollés en sous-périosté, sans ouvrir leurs gaines : extenseurs radiaux du carpe du côté radial, extenseur des doigts du côté ulnaire. La face dorsale du radius distal et la capsule dorsale sont exposées ; le tubercule de Lister peut être réséqué pour asseoir une plaque. Sur le plancher du 4ᵉ compartiment : la branche terminale du nerf interosseux postérieur, qu’on peut réséquer. Capsulotomie dorsale à la demande pour voir la surface articulaire et le carpe.',
      accent: ['FMA23464'], danger: ['nradial'], masquer: AUTRES, ecarter: { ...dosOuvert(15), ...retinaculumDorsal(13), ...TENDONS_ECARTES } },
  ] },
  ulnaire: { court: 'Antéro-ulnaire', titre: 'Voie antéro-ulnaire étendue (fragment antéro-médial et canal carpien)', fendre: [...peauFendue(PEAU_UL, FOND, 'ulnaire', 'radiale'),
    ['FMA40120', { ligne: PEAU_UL.slice(3), fond: FOND, rayon: 18 }, 'Rétinaculum des fléchisseurs — berge ulnaire', 'Rétinaculum des fléchisseurs — berge radiale']], steps: [
    { titre: 'Installation et incision', vue: 'opUl',
      texte: 'Vue de l’opérateur : avant-bras en supination sur la table à main, garrot. Incision longitudinale sur le bord radial du fléchisseur ulnaire du carpe, à l’avant-bras, qui croise le pli de flexion du poignet en oblique et se prolonge dans la paume, dans l’axe du 4ᵉ rayon, comme pour un canal carpien. Elle donne le fragment antéro-médial (« volar ulnar corner »), que la voie de Henry atteint mal, et permet de libérer le nerf médian dans le même temps.',
      montrer: ['incision-ul'], danger: ['aulnaire', 'nulnaire', 'rameau-palmaire'], masquer: AUTRES },
    { titre: 'Entre pédicule ulnaire et fléchisseurs', vue: 'opUlProche',
      texte: 'Le fascia antébrachial est ouvert. On passe entre le pédicule ulnaire (artère et nerf ulnaires), récliné en dedans avec le fléchisseur ulnaire du carpe, et la masse des fléchisseurs des doigts, réclinée en dehors avec le nerf médian. Le rameau cutané palmaire du médian, plus radial, reste dans la berge.',
      accent: ['aulnaire', 'nulnaire', 'FMA38638'], danger: ['aulnaire', 'nulnaire', 'nmedian'], masquer: AUTRES, ecarter: { ...ulPeau(7), ...ulProfond(4) } },
    { titre: 'Canal carpien ouvert', vue: 'opUlProche',
      texte: 'En distal, le rétinaculum des fléchisseurs est sectionné sur son versant ulnaire, sous contrôle de la vue, jusqu’à la graisse de l’arcade palmaire superficielle. Les tendons fléchisseurs et le nerf médian, libérés, peuvent alors être réclinés en dehors sans traction excessive sur le nerf.',
      accent: ['FMA40120', 'nmedian'], danger: ['arcade-sup', 'aulnaire', 'nmedian'], masquer: AUTRES, ecarter: { ...ulPeau(9), ...ulProfond(8), ...ulRetinaculum(5) } },
    { titre: 'Fragment antéro-médial', vue: 'opUlProche',
      texte: 'Le carré pronateur est désinséré de son bord ulnaire et relevé en dehors : la face antérieure de l’épiphyse radiale côté ulnaire, la fossette lunarienne et la radio-ulnaire distale sont exposées. Ce petit fragment porte les ligaments radio-lunaires courts : non fixé, il laisse le carpe se luxer en avant.',
      accent: ['FMA23464', 'p-ru-palmaire', 'lig-palm/ru'], danger: ['aulnaire', 'nulnaire', 'nmedian'], sectionner: PQ_ULNAIRE, masquer: AUTRES, ecarter: { ...ulPeau(9), ...ulProfond(12), ...ulRetinaculum(5) } },
    { titre: 'Fixation du fragment', vue: 'opUlProche',
      texte: 'Réduction sous contrôle de la vue et de la scopie, puis plaque spécifique en crochet ou petite plaque de soutien, très distale, sous le bord du fragment ; ce petit fragment peut aussi être pris par l’extrémité ulnaire d’une plaque palmaire standard. Le canal carpien n’est pas refermé.',
      accent: ['plaque-ul'], voiler: ['FMA23464'], montrer: ['plaque-ul', 'plaque-ul/vis1', 'plaque-ul/vis2', 'plaque-ul/vis3'], danger: ['nmedian', 'aulnaire'], sectionner: PQ_ULNAIRE, masquer: REPERES, ecarter: { ...ulPeau(9), ...ulProfond(12), ...ulRetinaculum(5) } },
  ] },
  'scapho-ant': { court: 'Scaphoïde antérieur', titre: 'Voie antérieure du scaphoïde (Russe)', fendre: peauFendue(PEAU_RU, FOND, 'ulnaire', 'radiale'), steps: [
    { titre: 'Installation et incision', vue: 'opRu',
      texte: 'Vue de l’opérateur : avant-bras en supination, poignet en extension sur un rouleau, garrot. Incision en crosse de hockey : 2 à 3 cm le long du tendon fléchisseur radial du carpe (FCR) jusqu’au tubercule du scaphoïde, palpable, puis coudée vers la base du pouce, en regard de l’articulation scapho-trapézienne. Voie des fractures du corps (taille) et du pôle distal, et des pseudarthroses avec greffe palmaire.',
      montrer: ['incision-ru'], danger: ['aradiale', 'aradiale/carpe', 'rameau-palmaire'], masquer: AUTRES },
    { titre: 'Gaine du FCR', vue: 'opRuProche',
      texte: 'La gaine du FCR est ouverte ; le tendon est récliné en dehors. L’artère radiale, en dehors, et sa branche palmaire superficielle qui croise le champ en distal sont protégées (la branche peut être ligaturée). Le plancher de la gaine est incisé, et les fibres proximales des muscles thénariens sont désinsérées pour voir le tubercule et le trapèze.',
      accent: ['FMA38460', 'gaine-fcr', 'FMA37386'], danger: ['aradiale', 'aradiale/carpe'], sectionner: RU_THENAR, masquer: AUTRES, ecarter: { ...ruPeau(4), ...ruProfond(4) } },
    { titre: 'Capsule et ligament radio-scapho-capitate', vue: 'opRuProche',
      texte: 'La capsule est incisée longitudinalement, dans l’axe du scaphoïde, avec le ligament radio-scapho-capitate qui croise la taille : il sera réparé soigneusement à la fermeture (sinon, risque d’instabilité ulnaire du carpe). L’ouverture de l’articulation scapho-trapézienne donne le point d’entrée de la vis.',
      accent: ['FMA24435', 'FMA24443', 'lig-palm/rsc'], danger: ['aradiale'], sectionner: RU_CAPSULE, masquer: AUTRES, ecarter: { ...ruPeau(5), ...ruProfond(6) } },
    { titre: 'Réduction et vissage', vue: 'opRuProche',
      texte: 'Réduction aux broches « joysticks », correction de la bascule en flexion (« humpback ») et greffe si besoin. Une broche-guide est passée du pôle distal vers le pôle proximal, dans l’axe central du scaphoïde (on résèque au besoin le bord du trapèze), puis vis canulée sans tête enfouie sous le cartilage ; contrôle scopique multi-incidences.',
      accent: ['vis-scaphoide-ant'], voiler: ['FMA24435', 'FMA24443'], montrer: ['vis-scaphoide-ant'], danger: ['aradiale'], sectionner: RU_CAPSULE, masquer: AUTRES, ecarter: { ...ruPeau(5), ...ruProfond(6) } },
  ] },
  'scapho-dos': { court: 'Scaphoïde dorsal', titre: 'Voie dorsale du scaphoïde (pôle proximal)', fendre: [...peauFendue(PEAU_DS, FOND_DORSAL, 'radiale', 'ulnaire'),
    ['retinaculum-ext', { ligne: PEAU_DS, fond: FOND_DORSAL, rayon: 16 }, 'Rétinaculum des extenseurs — lambeau radial', 'Rétinaculum des extenseurs — lambeau ulnaire']], steps: [
    { titre: 'Installation et incision', vue: 'opDS',
      texte: 'Vue de l’opérateur : main en pronation sur la table à main, garrot. Incision dorsale droite de 3 cm, partant du tubercule de Lister vers la base du 3ᵉ métacarpien, un peu en dedans de lui. C’est la voie de référence des fractures du pôle proximal : elle respecte la vascularisation palmaire et permet d’entrer la vis au centre du petit fragment.',
      montrer: ['incision-ds'], danger: ['nradial'], masquer: AUTRES },
    { titre: 'Rétinaculum et long extenseur du pouce', vue: 'opDSProche',
      texte: 'Les rameaux de la branche superficielle du nerf radial restent dans le lambeau radial. Le rétinaculum est ouvert en distal sur le 3ᵉ compartiment : le long extenseur du pouce est récliné en dehors avec les extenseurs radiaux du carpe, l’extenseur des doigts et l’extenseur de l’index en dedans (4ᵉ compartiment).',
      accent: ['FMA38522', 'FMA38501'], danger: ['nradial'], masquer: AUTRES, ecarter: { ...dsPeau(6), ...dsRetinaculum(4), ...dsTendons(4) } },
    { titre: 'Capsulotomie', vue: 'opDSProche',
      texte: 'Capsulotomie dorsale limitée (ou en volet respectant les ligaments radio-carpien et intercarpien dorsaux, selon Berger). On respecte les vaisseaux qui pénètrent la crête dorsale du scaphoïde et on ménage le ligament scapho-lunaire. Le poignet fléchi présente le pôle proximal.',
      accent: ['FMA24435', 'FMA24437'], danger: ['nradial'], sectionner: DS_CAPSULE, masquer: AUTRES, ecarter: { ...dsPeau(7), ...dsRetinaculum(5), ...dsTendons(6) } },
    { titre: 'Vissage antérograde', vue: 'opDSProche',
      texte: 'Poignet en flexion forte (sans quoi le radius gêne), la broche-guide entre au bord du ligament scapho-lunaire, au centre du pôle proximal, et vise la base du pouce dans l’axe du scaphoïde. Vis canulée sans tête enfouie, contrôle scopique. Fermeture de la capsule et du rétinaculum, le long extenseur du pouce peut être laissé hors de sa coulisse.',
      accent: ['vis-scaphoide-dos'], voiler: ['FMA24435'], montrer: ['vis-scaphoide-dos'], danger: ['nradial'], sectionner: DS_CAPSULE, masquer: AUTRES, ecarter: { ...dsPeau(7), ...dsRetinaculum(5), ...dsTendons(6) } },
  ] },
};

export default { nom: 'Poignet droit', dossier: 'models-hd', graisse: 3, centre, vues, meshes, fendre, tubes, rubans, groupes, voies };
