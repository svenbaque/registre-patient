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
  ['FMA38460', 'Fléchisseur radial du carpe (FCR)', 'flechisseurs', '#c4527a'],
  ['FMA38463', 'Long palmaire', 'flechisseurs', '#b5483f'],
  ['FMA38482', 'Long fléchisseur du pouce', 'flechisseurs', '#d9773f'],
  ['FMA38640', 'Fléchisseur superficiel des doigts (chef radial)', 'flechisseurs', '#a8444f'],
  ['FMA38638', 'Fléchisseur superficiel des doigts (chef huméro-ulnaire)', 'flechisseurs', '#9c4048'],
  ['FMA38479', 'Fléchisseur profond des doigts', 'flechisseurs', '#8f3d46'],
  ['FMA38454', 'Carré pronateur', 'profond', '#c9b23c'],
  ['FMA38486', 'Brachio-radial', 'lateraux', '#7d6bb5'],
  ['FMA38516', 'Long abducteur du pouce', 'lateraux', '#6f73b8'],
  ['FMA40120', 'Rétinaculum des fléchisseurs', 'divers', '#dfe6ec'],
];

// Structures absentes du modèle libre, tracées à la main d'après les repères osseux et tendineux.
const tubes = [
  ['aradiale', 'Artère radiale (schématique)', 'vaisseaux', '#e0392b', 1.8,
    [[-258, -100, 960], [-262, -108, 915], [-265, -117, 872], [-267, -124, 840], [-271, -127, 820], [-282, -121, 802]]],
  ['nmedian', 'Nerf médian (schématique)', 'nerfs', '#ffd23f', 2.4,
    [[-238, -103, 965], [-241, -111, 915], [-244, -119, 872], [-247, -125, 838], [-249, -129, 812], [-251, -131, 788]]],
  ['rameau-palmaire', 'Rameau cutané palmaire du nerf médian (schématique)', 'nerfs', '#ffd23f', 1,
    [[-245, -120, 866], [-250, -130, 846], [-253, -136, 826], [-255, -139, 806]]],
  ['incision-henry', 'Incision — Henry modifiée', 'incisions', '#35e0c8', 1.1,
    [[-258, -138, 824], [-254, -134, 846], [-249, -130, 870], [-243, -127, 896]]],
  ['watershed', 'Watershed line (schématique)', 'reperes', '#7df9ff', 0.9,
    [[-278, -119, 824], [-268, -122, 823], [-258, -123, 823], [-250, -122, 824]]],
  ['axe-plaque', 'Position de la plaque (schématique)', 'reperes', '#7df9ff', 2.6,
    [[-263, -121, 830], [-262, -116, 846], [-260, -108, 866], [-258, -102, 884]]],
];

const groupes = [
  ['os', 'Os'], ['flechisseurs', 'Fléchisseurs'], ['profond', 'Plan profond'], ['lateraux', 'Bord radial'], ['divers', 'Rétinaculum'],
  ['vaisseaux', 'Vaisseaux'], ['nerfs', 'Nerfs'], ['incisions', 'Incisions'], ['reperes', 'Repères d’ostéosynthèse'],
];

const centre = [-256, -112, 852]; // face palmaire du radius distal
const vues = {
  palmaire: { de: [-15, -330, 25] }, proche: { de: [-25, -215, -5] }, libre: { de: [-190, -250, 60] },
};

const REPERES = ['watershed', 'axe-plaque'];
// Les tendons restent sur leur trajet : pour montrer le plan profond, les fléchisseurs réclinés deviennent translucides.
const FLECHISSEURS = ['FMA38460', 'FMA38482', 'FMA38463', 'FMA38640', 'FMA38638', 'FMA38479'];

const voies = {
  henry: { court: 'Henry modifiée', titre: 'Voie de Henry modifiée (trans-gaine du FCR)', steps: [
    { titre: 'Repères et incision', vue: 'palmaire',
      texte: 'Patient en décubitus dorsal, bras sur table à main, avant-bras en supination. L’incision est longitudinale, centrée sur le relief du tendon fléchisseur radial du carpe (FCR), depuis le pli de flexion distal du poignet et sur 6 à 8 cm vers le haut.',
      montrer: ['incision-henry'], accent: ['FMA38460'], danger: ['aradiale'], masquer: REPERES },
    { titre: 'Gaine du FCR', vue: 'proche',
      texte: 'La gaine du FCR est ouverte sur toute la longueur de l’incision, sur son versant radial. Le tendon est écarté du côté ulnaire : il protège le nerf médian et son rameau cutané palmaire, qui longe son bord ulnaire. L’artère radiale reste en dehors, sans être disséquée.',
      accent: ['FMA38460'], danger: ['aradiale', 'rameau-palmaire', 'nmedian'], masquer: REPERES },
    { titre: 'Plancher de la gaine et long fléchisseur du pouce', vue: 'proche',
      texte: 'Le plancher de la gaine est incisé. Le long fléchisseur du pouce est récliné du côté ulnaire, au doigt, avec les autres fléchisseurs et le nerf médian ; le brachio-radial et l’artère radiale restent du côté radial. Les fléchisseurs sont ici translucides : le carré pronateur apparaît.',
      accent: ['FMA38454'], danger: ['aradiale', 'nmedian'], voiler: FLECHISSEURS, masquer: REPERES },
    { titre: 'Carré pronateur', vue: 'proche',
      texte: 'Le carré pronateur est incisé en L, le long de son insertion radiale et de son bord distal, puis relevé en sous-périosté du côté ulnaire ; il est ici translucide. La face palmaire du radius distal est exposée, jusqu’à la watershed line.',
      accent: ['FMA23464', 'watershed'], danger: ['aradiale', 'nmedian'], voiler: [...FLECHISSEURS, 'FMA38454'], montrer: ['watershed'], masquer: ['axe-plaque'] },
    { titre: 'Réduction et plaque', vue: 'proche',
      texte: 'Après réduction, la plaque est posée sur la face palmaire du radius, en proximal de la watershed line : plus distale, elle entre en conflit avec les tendons fléchisseurs. En fin d’intervention, le carré pronateur est rabattu sur la plaque et suturé si possible.',
      accent: ['axe-plaque', 'watershed'], danger: ['aradiale', 'nmedian'], voiler: [...FLECHISSEURS, 'FMA38454'], montrer: REPERES },
  ] },
};

export default { nom: 'Poignet droit', centre, vues, meshes, tubes, groupes, voies };
