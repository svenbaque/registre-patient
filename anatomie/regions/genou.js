// Genou et jambe droits — abord pour enclouage du tibia.
// Repère BodyParts3D, en millimètres : x = latéral (-) / médial (+), y = avant (-) / arrière (+), z = vers le haut.
// Le modèle est genou en extension ; au bloc le genou est fléchi à 90° ou plus.

const meshes = [
  ['FMA24474', 'Fémur', 'os', '#e9e2cf'],
  ['FMA24477', 'Tibia', 'os', '#e9e2cf'],
  ['FMA24480', 'Fibula', 'os', '#ded6c0'],
  ['FMA24486', 'Patella', 'os', '#e9e2cf'],
  ['FMA38928', 'Droit fémoral', 'quadriceps', '#b84a5e'],
  ['FMA38930', 'Vaste latéral', 'quadriceps', '#a8444f'],
  ['FMA38932', 'Vaste médial', 'quadriceps', '#a8444f'],
  ['FMA38934', 'Vaste intermédiaire', 'quadriceps', '#9c4048'],
  ['FMA22544', 'Tibial antérieur', 'jambe', '#c25a4c'],
  ['FMA22548', 'Long extenseur des orteils', 'jambe', '#cf6f5d'],
  ['FMA22552', 'Long fibulaire', 'jambe', '#d9773f'],
  ['FMA45957', 'Gastrocnémien médial', 'jambe', '#8f5b4a'],
  ['FMA45960', 'Gastrocnémien latéral', 'jambe', '#9a6652'],
  ['FMA35192', 'Membrane interosseuse', 'divers', '#cfd6dd'],
];

// Le tendon rotulien n'existe pas dans le modèle libre : il est tracé en deux moitiés, pour pouvoir le fendre.
const tubes = [
  ['tendon-lat', 'Tendon rotulien — moitié latérale (schématique)', 'tendon', '#e6e1d2', 5.2, [[-93, -106, 400], [-91, -108, 381], [-89, -105, 362]]],
  ['tendon-med', 'Tendon rotulien — moitié médiale (schématique)', 'tendon', '#e6e1d2', 5.2, [[-83, -106, 400], [-82, -108, 381], [-81, -105, 362]]],
  ['infrapatellaire', 'Rameau infra-patellaire du nerf saphène (schématique)', 'nerfs', '#ffd23f', 1,
    [[-50, -82, 388], [-62, -98, 380], [-76, -111, 373], [-90, -113, 367], [-102, -106, 362]]],
  ['saphene', 'Nerf saphène et grande veine saphène (schématique)', 'nerfs', '#ffd23f', 1.8,
    [[-48, -72, 330], [-52, -74, 240], [-52, -72, 150], [-50, -74, 95], [-48, -80, 62]]],
  ['incision-clou', 'Incision — abord trans-tendineux', 'incisions', '#35e0c8', 1.2, [[-88, -115, 402], [-87, -116, 381], [-86, -113, 358]]],
  ['axe-clou', 'Axe du clou (schématique)', 'reperes', '#7df9ff', 2.6,
    [[-80, -96, 418], [-80, -89, 402], [-79, -81, 340], [-79, -77, 250], [-78, -67, 130], [-76, -61, 82]]],
  ['vis-prox', 'Verrouillage proximal (schématique)', 'reperes', '#7df9ff', 1.6, [[-46, -74, 374], [-80, -78, 376], [-112, -74, 378]]],
  ['vis-dist', 'Verrouillage distal (schématique)', 'reperes', '#7df9ff', 1.6, [[-54, -64, 96], [-76, -64, 96], [-98, -62, 96]]],
];

const groupes = [
  ['os', 'Os'], ['quadriceps', 'Quadriceps'], ['tendon', 'Tendon rotulien'], ['jambe', 'Muscles de la jambe'], ['divers', 'Membrane interosseuse'],
  ['nerfs', 'Nerfs'], ['incisions', 'Incisions'], ['reperes', 'Repères d’ostéosynthèse'],
];

const centre = [-84, -92, 388]; // tendon rotulien
const vues = {
  ant: { de: [-25, -300, 40] }, proche: { de: [-15, -185, 45] }, entree: { de: [-20, -150, 150] },
  jambe: { de: [330, -560, 20], cible: [-78, -72, 235] }, libre: { de: [-260, -330, 90] },
};
const REPERES = ['axe-clou', 'vis-prox', 'vis-dist'];
// Tendon fendu dans ses fibres : les deux moitiés s'écartent en leur milieu, leurs attaches (patella, tubérosité) ne bougent pas.
const MILIEU_TENDON = [-87, -107, 381];
const TENDON_FENDU = { 'tendon-lat': { dep: [-8, 0, 0], autour: MILIEU_TENDON, rayon: 15 }, 'tendon-med': { dep: [8, 0, 0], autour: MILIEU_TENDON, rayon: 15 } };

const voies = {
  clou: { court: 'Clou tibial', titre: 'Abord pour clou tibial (trans-tendineux)', steps: [
    { titre: 'Installation et incision', vue: 'ant',
      texte: 'Genou fléchi à 90° ou plus, jambe pendante ou sur cale. Incision longitudinale médiane sous-rotulienne, de la pointe de la patella à la tubérosité tibiale. Le rameau infra-patellaire du nerf saphène croise la partie basse de l’incision.',
      montrer: ['incision-clou'], accent: ['tendon-lat', 'tendon-med'], danger: ['infrapatellaire'], masquer: REPERES },
    { titre: 'Tendon rotulien', vue: 'proche',
      texte: 'Le péritendon est décollé au bistouri pour faciliter la fermeture, puis le tendon rotulien est fendu dans l’axe de ses fibres, en son milieu, et ses deux moitiés s’entrouvrent. Variante : abord para-patellaire médial, en réclinant le tendon en dehors.',
      accent: ['tendon-lat', 'tendon-med'], danger: ['infrapatellaire'], masquer: REPERES, ecarter: TENDON_FENDU },
    { titre: 'Point d’entrée', vue: 'entree',
      texte: 'De face, le point d’entrée est dans l’axe du canal médullaire, au bord médial de l’épine tibiale latérale. De profil, il est au bord antérieur du plateau tibial, dans le prolongement du canal. La réduction se joue ici : la tige-guide doit être centrée de face et de profil.',
      accent: ['axe-clou'], voiler: ['FMA24477'], montrer: ['axe-clou'], masquer: ['vis-prox', 'vis-dist'], ecarter: TENDON_FENDU },
    { titre: 'Clou et verrouillage', vue: 'jambe',
      texte: 'Le clou suit l’axe du canal à travers le foyer réduit. Verrouillage proximal par le viseur solidaire du clou. Verrouillage distal à main levée, de dedans en dehors : le nerf saphène et la grande veine saphène longent la face médiale du tibia distal, à protéger lors de l’incision et du forage.',
      accent: ['axe-clou', 'vis-prox', 'vis-dist'], danger: ['saphene'], voiler: ['FMA24477'], montrer: REPERES, estomper: ['FMA22544', 'FMA45957'], ecarter: TENDON_FENDU },
  ] },
};

export default { nom: 'Genou et jambe droits', centre, vues, meshes, tubes, groupes, voies };
