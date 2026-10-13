// Poignet droit — données de la région pour le visualiseur.
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
const tubes = [
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
  // vue de l'opérateur : avant-bras en supination sur la table à main, main à droite, bord ulnaire en haut
  op: { de: [0, -330, 0], haut: [1, 0, 0], cible: SITE }, opProche: { de: [0, -185, 0], haut: [1, 0, 0], cible: SITE },
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
const fendre = [
  ['peau', [-251, -131, 863], N_RADIAL, 'Peau — berge radiale', 'Peau — berge ulnaire'],
  ['graisse', [-251, -131, 863], N_RADIAL, 'Tissu sous-cutané — berge radiale', 'Tissu sous-cutané — berge ulnaire'],
  ['FMA38454', [-265, -114, 855], [1, 0, 0], 'Carré pronateur — corps relevé', 'Carré pronateur — berge radiale'],
];

// ----- Écarteurs : deux lames (type Farabeuf) parallèles à l'incision. Chaque lame repousse ce qu'elle charge et le tasse contre elle ;
// l'effet s'éteint au-delà des bouts de la lame : tendons, nerfs et vaisseaux restent fixes au canal carpien et à leur origine. -----
const FOND = [0, 1, 0]; // de la peau palmaire vers le radius
// « course » vaut plus de deux fois l'écart : tout ce qui se trouve entre l'incision et la lame est chargé en entier.
const lameRadiale = (ecart, course) => ({ lame: decale(ecart), pousse: N_RADIAL, course, rayon: 17, fond: FOND, profondeur: 48 });
const lameUlnaire = (ecart, course) => ({ lame: decale(-ecart), pousse: N_ULNAIRE, course, rayon: 17, fond: FOND, profondeur: 48 });
// ce que charge chaque lame, plan par plan (technique de la fiche : FCR et long palmaire en dehors, fléchisseurs et nerf médian en dedans)
const PEAU_RADIALE = ['peau/A', 'graisse/A'];
const PEAU_ULNAIRE = ['peau/B', 'graisse/B'];
const PLAN_RADIAL = ['FMA38460', 'FMA38463', 'aradiale', 'vradiales', 'FMA38486'];
const PLAN_ULNAIRE = ['FMA38482', 'FMA38640', 'FMA38638', 'FMA38479', 'nmedian', 'rameau-palmaire'];
const charge = (ids, lame) => Object.fromEntries(ids.map(id => [id, lame]));
const PEAU_OUVERTE = { ...charge(PEAU_RADIALE, lameRadiale(10, 30)), ...charge(PEAU_ULNAIRE, lameUlnaire(10, 30)) };
const PEAU_ECARTEE = { ...charge(PEAU_RADIALE, lameRadiale(17, 42)), ...charge(PEAU_ULNAIRE, lameUlnaire(17, 42)) };
const FCR_EN_DEHORS = charge(PLAN_RADIAL, lameRadiale(14, 62)); // la lame radiale charge aussi le long palmaire
const FLECHISSEURS_EN_DEDANS = charge(PLAN_ULNAIRE, lameUlnaire(14, 62)); // la lame ulnaire balaie tout ce qui recouvre le radius

// Carré pronateur incisé en L (bord radial et bord distal), relevé en sous-périosté vers l'ulna où il garde son attache.
const INCISION_CARRE = [[-265, -117, 834], [-262, -111, 878]];
const CARRE_RECLINE = { 'FMA38454/A': { dep: [20, -5, 0], autour: INCISION_CARRE, rayon: 21 } };

// ----- Plaque palmaire en T (tracé schématique) : barre distale sous la watershed line, tige sur la diaphyse ; vis en regard -----
const rubans = [
  ['plaque', 'Plaque palmaire — tige', 'implants', '#b9c2cc', [[-262, -121, 832], [-262, -116.5, 841], [-261, -108, 860], [-259, -99.5, 884]], 9, 2, [1, 0, 0]],
  ['plaque/tete', 'Plaque palmaire — barre distale', 'implants', '#b9c2cc', [[-276, -121.5, 831.5], [-263, -123, 831.5], [-251, -122.5, 831.5]], 8.5, 2, [0, 0, 1]],
];
const visDistale = x => [`vis/d${-x}`, 'Vis distale verrouillée (sous-chondrale)', 'implants', '#cfd6dd', 1.25, [[x, -123, 831.5], [x, -114, 831], [x, -104.5, 830.5]]];
const visTige = (n, y, z, fond) => [`vis/p${n}`, 'Vis corticale de la tige', 'implants', '#cfd6dd', 1.25, [[-261.5, y - 1.5, z], [-261, (y + fond) / 2, z], [-260.5, fond, z]]];
tubes.push(visDistale(-272), visDistale(-265), visDistale(-258), visDistale(-252), visTige(1, -112, 850, -97), visTige(2, -106, 864, -91), visTige(3, -101, 878, -86));

const voies = {
  henry: { court: 'Henry modifiée', titre: 'Voie de Henry modifiée (trans-gaine du FCR)', steps: [
    { titre: 'Installation et incision', vue: 'op',
      texte: 'Vue de l’opérateur : décubitus dorsal, bras en abduction sur table à main, avant-bras en supination, garrot à la racine du bras. L’incision est longitudinale, sur le versant médial du relief du tendon fléchisseur radial du carpe (FCR), du pli de flexion distal du poignet vers le haut, sur 6 à 8 cm.',
      montrer: ['incision-henry'], masquer: [...REPERES, ...IMPLANTS] },
    { titre: 'Peau et gaine du FCR', vue: 'opProche',
      texte: 'Peau et tissu sous-cutané sont incisés ; les berges sont tenues par deux écarteurs. Au fond apparaît la gaine du FCR. L’artère radiale est en dehors : on ne la dissèque pas.',
      accent: ['gaine-fcr', 'FMA38460'], danger: ['aradiale', 'rameau-palmaire'], masquer: [...REPERES, ...IMPLANTS], ecarter: PEAU_OUVERTE },
    { titre: 'FCR récliné en dehors', vue: 'opProche',
      texte: 'La gaine du FCR est ouverte sur toute la longueur de l’incision. Le FCR et le long palmaire sont réclinés en dehors par la lame radiale : ils emmènent et protègent l’artère radiale. Le plancher de la gaine apparaît ; il est incisé à son tour.',
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
};

export default { nom: 'Poignet droit', dossier: 'models-hd', graisse: 3, centre, vues, meshes, fendre, tubes, rubans, groupes, voies };
