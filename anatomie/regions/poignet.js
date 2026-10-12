// Poignet droit — données de la région pour le visualiseur.
// Repère BodyParts3D, en millimètres : membre le long du corps, paume vers l'avant.
// x = côté radial (-) / côté ulnaire (+), y = face palmaire (-) / face dorsale (+), z = proximal (+) / distal (-).

const meshes = [
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
    [[-256, -137, 824], [-252, -133, 846], [-248, -130, 870], [-243, -127, 896]]],
  ['watershed', 'Watershed line (schématique)', 'reperes', '#7df9ff', 0.9,
    [[-278, -119, 824], [-268, -122, 823], [-258, -123, 823], [-250, -122, 824]]],
  ['axe-plaque', 'Position de la plaque (schématique)', 'reperes', '#7df9ff', 2.6,
    [[-263, -121, 830], [-262, -116, 846], [-260, -108, 866], [-258, -102, 884]]],
];

const groupes = [
  ['os', 'Os'], ['flechisseurs', 'Fléchisseurs'], ['profond', 'Plan profond'], ['lateraux', 'Bord radial'], ['extenseurs', 'Extenseurs'], ['main', 'Muscles de la main'],
  ['gaines', 'Gaines tendineuses'], ['ligaments', 'Capsule et ligaments'], ['vaisseaux', 'Artères et veines'], ['nerfs', 'Nerfs'],
  ['incisions', 'Incisions'], ['reperes', 'Repères d’ostéosynthèse'],
];

const centre = [-256, -112, 852]; // face palmaire du radius distal
const vues = {
  palmaire: { de: [-15, -330, 25] }, proche: { de: [-25, -215, -5] }, libre: { de: [-190, -250, 60] },
};

const REPERES = ['watershed', 'axe-plaque'];
// Ouverture le long de l'incision, sur le versant médial (ulnaire) du FCR, comme dans la fiche :
// le FCR et le long palmaire partent en dehors (côté radial) avec l'artère radiale ; le long fléchisseur du pouce, les autres
// fléchisseurs et le nerf médian partent en dedans (côté ulnaire). Nerfs et vaisseaux suivent le muscle avec lequel ils sont écartés.
const LIGNE_HENRY = [[-256, -130, 826], [-250, -126, 858], [-244, -122, 894]];
const henry = k => {
  const dehors = { dep: [-13 * k, 0, 0], autour: LIGNE_HENRY, rayon: 36 };
  const dedans = { dep: [13 * k, 0, 0], autour: LIGNE_HENRY, rayon: 36 };
  return {
    FMA38460: dehors, FMA38463: dehors, aradiale: dehors, vradiales: dehors, FMA38486: dehors,
    FMA38482: dedans, FMA38640: dedans, FMA38638: dedans, FMA38479: dedans, nmedian: dedans, 'rameau-palmaire': dedans,
  };
};
// Carré pronateur incisé en L le long de son insertion radiale et relevé vers l'ulna : sa moitié radiale est retirée, le moignon ulnaire reste.
const SECTION_CARRE = { FMA38454: { autour: [[-266, -116, 832], [-262, -110, 880]], rayon: 19 } };

const voies = {
  henry: { court: 'Henry modifiée', titre: 'Voie de Henry modifiée (trans-gaine du FCR)', steps: [
    { titre: 'Repères et incision', vue: 'palmaire',
      texte: 'Patient en décubitus dorsal, bras sur table à main, avant-bras en supination. L’incision est longitudinale, sur le versant médial du tendon fléchisseur radial du carpe (FCR), depuis le pli de flexion distal du poignet et sur 6 à 8 cm vers le haut.',
      montrer: ['incision-henry'], accent: ['FMA38460', 'gaine-fcr'], danger: ['aradiale'], masquer: REPERES },
    { titre: 'Gaine du FCR', vue: 'proche',
      texte: 'La gaine du FCR est ouverte sur toute la longueur de l’incision. Le FCR et le long palmaire sont écartés en dehors : ils emmènent et protègent l’artère radiale. Le nerf médian et son rameau cutané palmaire restent en dedans.',
      accent: ['FMA38460', 'FMA38463'], danger: ['aradiale', 'rameau-palmaire', 'nmedian'], masquer: [...REPERES, 'gaine-fcr'], ecarter: henry(0.6) },
    { titre: 'Plancher de la gaine et long fléchisseur du pouce', vue: 'proche',
      texte: 'Le plancher de la gaine est incisé. Le long fléchisseur du pouce est récliné en dedans, au doigt, avec les autres fléchisseurs et le nerf médian. Le carré pronateur apparaît au fond.',
      accent: ['FMA38482', 'FMA38454'], danger: ['aradiale', 'nmedian'], masquer: [...REPERES, 'gaine-fcr'], ecarter: henry(1) },
    { titre: 'Carré pronateur', vue: 'proche',
      texte: 'Le carré pronateur est incisé en L, le long de son insertion radiale et de son bord distal, puis relevé en sous-périosté vers l’ulna : sa moitié radiale est ici retirée, son attache ulnaire reste. La face palmaire du radius distal est exposée, jusqu’à la watershed line.',
      accent: ['FMA23464', 'watershed'], danger: ['aradiale', 'nmedian'], montrer: ['watershed'], masquer: ['axe-plaque', 'gaine-fcr'], ecarter: henry(1.15), sectionner: SECTION_CARRE },
    { titre: 'Réduction et plaque', vue: 'proche',
      texte: 'Après réduction, la plaque est posée sur la face palmaire du radius, en proximal de la watershed line : plus distale, elle entre en conflit avec les tendons fléchisseurs. En fin d’intervention, le carré pronateur est rabattu sur la plaque et suturé si possible.',
      accent: ['axe-plaque', 'watershed'], danger: ['aradiale', 'nmedian'], montrer: REPERES, masquer: ['gaine-fcr'], ecarter: henry(1.15), sectionner: SECTION_CARRE },
  ] },
};

export default { nom: 'Poignet droit', dossier: 'models-hd', centre, vues, meshes, tubes, groupes, voies };
