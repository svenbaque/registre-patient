// Genou et jambe droits — abord pour enclouage du tibia, voie para-patellaire médiale.
// Repère BodyParts3D, en millimètres : x = latéral (-) / médial (+), y = avant (-) / arrière (+), z = vers le haut.
// Le modèle est genou en extension ; au bloc le genou est fléchi à 90° ou plus.
import pieces from './genou.pieces.js';
import { peauFendue, berges, charge, lame } from './outils.js';

const meshes = [
  ['peau-cuisse', 'Peau', 'peau', '#e2b596', { id: 'peau', dossier: 'models-z' }],
  ...pieces,
];

// Dans ce modèle, le tendon quadricipital et le ligament patellaire prolongent les quatre chefs du quadriceps jusqu'à la tubérosité tibiale.
// Chaque chef est coupé au-dessus de la patella : la moitié basse (« /B ») est l'appareil extenseur tendineux, de teinte nacrée.
const QUADRICEPS = ['droit-femoral', 'vaste-int', 'vaste-med', 'vaste-lat'];
const NOMS = { 'droit-femoral': 'Droit fémoral', 'vaste-int': 'Vaste intermédiaire', 'vaste-med': 'Vaste médial', 'vaste-lat': 'Vaste latéral' };
const fendre = QUADRICEPS.map(id => [id, [0, 0, 440], [0, 0, 1], NOMS[id], 'Tendon quadricipital et ligament patellaire', { couleurs: [null, '#e6e1d2'] }]);

// Tracés à la main : incision, axe du clou, clou et vis.
const tubes = [
  ['incision-ptg', 'Incision — antérieure médiane', 'incisions', '#35e0c8', 1.3, [[-83, -154.5, 519], [-83, -151.5, 494], [-83, -148.5, 468], [-83, -146.5, 444], [-83, -140.5, 420], [-83, -133.5, 401], [-84, -120.5, 379], [-84, -111.5, 359]]],
  ['arthrotomie', 'Arthrotomie para-patellaire médiale', 'incisions', '#35e0c8', 1, [[-81, -131, 520], [-80, -124, 490], [-79, -117, 460], [-74, -112, 440], [-63, -109, 422], [-65, -106, 402], [-72, -106, 382], [-72, -103, 358]]],
  ['incision-clou', 'Incision — abord trans-tendineux', 'incisions', '#35e0c8', 1.2, [[-85, -138.5, 406], [-84.5, -130, 395], [-84, -126, 384], [-83, -119, 371], [-82, -115, 358]]],
  ['axe-clou', 'Broche-guide dans l’axe du canal (tracé)', 'reperes', '#7df9ff', 1.3,
    [[-81, -112, 440], [-80.5, -100, 420], [-80, -91, 404], [-79.5, -84, 372], [-79, -80, 330]]],
  ['clou', 'Clou centromédullaire du tibia', 'implants', '#b9c2cc', 5,
    [[-80, -91, 403], [-79.5, -84, 372], [-79, -80, 330], [-79, -77, 250], [-78, -67, 130], [-76, -61, 84]]],
  ['clou/vis-prox1', 'Vis de verrouillage proximal', 'implants', '#cfd6dd', 2.2, [[-52, -78, 380], [-80, -85, 381], [-108, -80, 382]]],
  ['clou/vis-prox2', 'Vis de verrouillage proximal', 'implants', '#cfd6dd', 2.2, [[-56, -90, 362], [-80, -82, 362], [-104, -72, 362]]],
  ['clou/vis-dist1', 'Vis de verrouillage distal', 'implants', '#cfd6dd', 2.2, [[-56, -63, 104], [-77, -64, 104], [-97, -62, 104]]],
  ['clou/vis-dist2', 'Vis de verrouillage distal', 'implants', '#cfd6dd', 2.2, [[-76, -80, 92], [-76.5, -62, 92], [-77, -46, 92]]],
];

const groupes = [
  ['peau', 'Peau'], ['graisse', 'Tissu sous-cutané'], ['os', 'Os'], ['quadriceps', 'Quadriceps'], ['cuisse', 'Muscles de la cuisse'],
  ['jambe', 'Loges antérieure et latérale'], ['mollet', 'Loge postérieure'], ['ligaments', 'Capsule, ménisques et ligaments'], ['vaisseaux', 'Artères et veines'], ['nerfs', 'Nerfs'],
  ['incisions', 'Incisions'], ['reperes', 'Repères d’ostéosynthèse'], ['implants', 'Clou et vis'],
];

const centre = [-84, -92, 388]; // ligament patellaire
const SITE = [-83, -104, 384];
const vues = {
  // vue de l'opérateur : genou fléchi face à lui, patella en haut de l'image, tubérosité tibiale en bas
  opPtg: { de: [0, -420, 30], cible: [-84, -110, 435] }, opPtgProche: { de: [-10, -270, 20], cible: [-88, -110, 432] },
  op: { de: [0, -330, 45], cible: SITE }, opProche: { de: [0, -175, 30], cible: SITE },
  entree: { de: [-8, -120, 105], cible: [-80, -94, 400] },
  jambe: { de: [330, -560, 20], cible: [-78, -72, 235] }, libre: { de: [-260, -330, 90] },
};
const REPERES = ['axe-clou'];
const IMPLANTS = ['clou'];
const PEAU = ['peau', 'graisse'];

// Incision : une seule ligne médiane, de la pointe de la patella à la tubérosité tibiale. Peau, puis ligament patellaire, s'ouvrent sur elle.
const PEAU_INCISION = [[-85, -137, 406], [-84.5, -128, 395], [-84, -124, 384], [-83, -117, 371], [-82, -113, 358]];
const FOND = [0, 1, 0];
const MILIEU_TENDON = [[-84.5, -107, 398], [-82, -105, 370]];
const peauOuverte = k => berges(PEAU_INCISION, FOND, [-15, 0, 0], k, 24);
// Ligament fendu dans ses fibres : les deux moitiés s'écartent en leur milieu, leurs attaches (patella, tubérosité) ne bougent pas.
const TENDON = QUADRICEPS.map(id => `${id}/B`);
const tendonFendu = k => Object.fromEntries(TENDON.flatMap(id => [
  [`${id}/A`, { dep: [9 * k, 0, 0], autour: MILIEU_TENDON, rayon: 15 }], [`${id}/B`, { dep: [-9 * k, 0, 0], autour: MILIEU_TENDON, rayon: 15 }],
]));
const fendreTendon = TENDON.map(id => [id, { ligne: [[-85, -108, 412], [-84.5, -107, 398], [-82, -105, 370], [-81, -103, 348]], fond: FOND, rayon: 22 },
  'Ligament patellaire — moitié médiale', 'Ligament patellaire — moitié latérale']);
// Le corps adipeux de Hoffa est refoulé en arrière, sans ouvrir l'articulation.
const HOFFA_REFOULE = { hoffa: { dep: [0, 9, 4], autour: [-80, -92, 404], rayon: 22 } };

// ----- Voie para-patellaire médiale -----
const PEAU_PTG = [[-83, -152, 519], [-83, -149, 494], [-83, -146, 468], [-83, -144, 444], [-83, -138, 420], [-83, -131, 401], [-84, -118, 379], [-84, -109, 359]];
const PEAU_PTG_DROITE = [[-83, -152, 519], [-84, -109, 359]];
const ARTHROTOMIE = [[-74, -108, 446], [-63, -106, 422], [-65, -103, 402], [-72, -102, 382], [-72, -100, 352]];
const optsPtg = { rayon: 30, profondeur: 30 };
const ptgPeau = (dehors, dedans) => ({
  ...charge(['peau/B', 'graisse/B'], lame(PEAU_PTG_DROITE, [-1, 0, 0], FOND, dehors, dehors * 2.4 + 10, optsPtg)),
  ...charge(['peau/A', 'graisse/A'], lame(PEAU_PTG_DROITE, [1, 0, 0], FOND, dedans, dedans * 2.4 + 10, optsPtg)),
});
// L'arthrotomie longe le bord médial du tendon quadricipital, contourne la patella et suit le bord médial du ligament patellaire.
// En dehors d'elle : droit fémoral, vaste intermédiaire, vaste latéral, patella et ligament patellaire, luxés en bloc vers le dehors.
const fendrePtg = ['droit-femoral/B', 'vaste-int/B', 'vaste-med/B'].map(id => [id, { ligne: ARTHROTOMIE, fond: FOND, rayon: 26 }, 'Rétinaculum médial (collerette)', 'Appareil extenseur']);
const AXE_PATELLA = [[-86, -112, 492], [-86, -106, 418]];
const EXTENSEUR = ['droit-femoral/A', 'droit-femoral/B/B', 'vaste-int/A', 'vaste-int/B/B', 'vaste-med/B/B', 'vaste-lat', 'patella', 'retinaculum-lat'];
const VERSANT_MEDIAL = ['vaste-med/A', 'vaste-med/B/A', 'droit-femoral/B/A', 'vaste-int/B/A', 'retinaculum-med'];
const luxation = k => ({
  ...charge(EXTENSEUR, { dep: [-38 * k, 8 * k, 0], autour: AXE_PATELLA, rayon: 36 }),
  ...charge(VERSANT_MEDIAL, { dep: [10 * k, 0, 0], autour: AXE_PATELLA, rayon: 30 }),
});
const CAPSULE_OUVERTE = { capsule: { autour: [[-84, -104, 468], [-84, -102, 405]], rayon: 36 } };
const AUTRES = [...REPERES, ...IMPLANTS, 'incision-clou'];

const voies = {
  ptg: { court: 'Para-patellaire médiale', titre: 'Voie para-patellaire médiale (prothèse totale de genou)', fendre: [...peauFendue(PEAU_PTG, FOND, 'médiale', 'latérale'), ...fendrePtg], steps: [
    { titre: 'Installation et incision', vue: 'opPtg',
      texte: 'Décubitus dorsal, garrot à la racine de la cuisse, cale sous le pied et appui latéral pour tenir le genou fléchi à 90°. Incision cutanée antérieure médiane, longitudinale, de 5 cm au-dessus du pôle supérieur de la patella jusqu’au bord médial de la tubérosité tibiale. Le modèle est ici genou en extension.',
      montrer: ['incision-ptg'], masquer: [...AUTRES, 'arthrotomie'] },
    { titre: 'Peau et lambeau médial', vue: 'opPtgProche',
      texte: 'Peau et tissu sous-cutané sont incisés jusqu’au fascia. Le lambeau médial est levé au ras de l’appareil extenseur, juste assez pour voir le tendon quadricipital, le bord médial de la patella et le bord médial du ligament patellaire ; le lambeau latéral n’est pas décollé (vascularisation cutanée).',
      accent: ['patella', ...TENDON], masquer: [...AUTRES, 'arthrotomie'], ecarter: ptgPeau(16, 18) },
    { titre: 'Arthrotomie para-patellaire médiale', vue: 'opPtgProche',
      texte: 'L’arthrotomie part du tendon quadricipital, incisé dans son tiers médial sur 6 à 8 cm en laissant une collerette de 1 à 2 cm avec le vaste médial ; elle contourne la patella en gardant 5 mm de rétinaculum pour la suture, puis longe le bord médial du ligament patellaire jusqu’à la tubérosité tibiale, sans léser la corne antérieure du ménisque médial.',
      accent: ['arthrotomie', 'patella'], montrer: ['arthrotomie'], masquer: AUTRES, ecarter: ptgPeau(20, 22) },
    { titre: 'Patella luxée en dehors', vue: 'opPtgProche',
      texte: 'Le corps adipeux infra-patellaire est fendu ou réséqué en partie. La patella est luxée (ou éversée) en dehors, puis le genou est fléchi : tout l’appareil extenseur — droit fémoral, vaste latéral, patella, ligament patellaire — passe en dehors du condyle latéral. L’insertion du ligament patellaire sur la tubérosité est surveillée pendant toute la manœuvre : au besoin, une broche la protège.',
      accent: ['patella', 'femur'], masquer: [...AUTRES, 'arthrotomie', 'anastomose-patellaire'], ecarter: { ...ptgPeau(46, 22), ...luxation(1) } },
    { titre: 'Articulation exposée', vue: 'opPtgProche',
      texte: 'La capsule est ouverte : trochlée, condyles et plateau tibial sont exposés. Libération médiale sous-périostée de la capsule et du faisceau profond du ligament collatéral tibial sur le tibia proximal, à la demande ; résection du ligament croisé antérieur, des cornes méniscales et des ostéophytes. Les coupes osseuses peuvent commencer. Le paquet poplité est juste en arrière de la capsule postérieure.',
      accent: ['femur', 'tibia', 'lca'], danger: ['apoplitee', 'vpoplitee', 'ntibial'], masquer: [...AUTRES, 'arthrotomie', 'anastomose-patellaire', 'hoffa'],
      ecarter: { ...ptgPeau(46, 24), ...luxation(1.1) }, sectionner: CAPSULE_OUVERTE },
  ] },
  clou: { court: 'Clou tibial', titre: 'Abord infra-patellaire trans-tendineux (clou tibial)', fendre: [...peauFendue(PEAU_INCISION, FOND, 'médiale', 'latérale'), ...fendreTendon], steps: [
    { titre: 'Installation et incision', vue: 'op',
      texte: 'Décubitus dorsal, genou fléchi à 90° ou plus (barre à genou, triangle ou jambe pendante) : la flexion dégage le point d’entrée en avant de la patella. Incision longitudinale médiane, dans l’axe du canal médullaire, de la pointe de la patella à la tubérosité tibiale. Le rameau infra-patellaire du nerf saphène croise la partie basse de l’incision, de dedans en dehors. Le modèle est ici genou en extension.',
      montrer: ['incision-clou'], danger: ['infrapatellaire'], masquer: [...REPERES, ...IMPLANTS] },
    { titre: 'Peau et péritendon', vue: 'opProche',
      texte: 'Peau et tissu sous-cutané sont incisés ; les berges sont tenues par un écarteur autostatique. Le péritendon est ouvert et décollé au bistouri sur toute la largeur du ligament patellaire : il sera refermé à part, sur le ligament.',
      accent: TENDON, danger: ['infrapatellaire'], masquer: [...REPERES, ...IMPLANTS], ecarter: peauOuverte(1) },
    { titre: 'Ligament patellaire fendu', vue: 'opProche',
      texte: 'Le ligament patellaire est fendu dans l’axe de ses fibres, en son milieu, de la pointe de la patella à la tubérosité tibiale ; ses deux moitiés sont écartées. Le corps adipeux infra-patellaire (Hoffa) apparaît au fond : il est refoulé en arrière, sans ouvrir l’articulation. Variantes : abord para-patellaire médial (ligament récliné en dehors) ou supra-patellaire.',
      accent: [...TENDON, 'hoffa'], danger: ['infrapatellaire'], masquer: [...REPERES, ...IMPLANTS], ecarter: { ...peauOuverte(1.15), ...tendonFendu(1) } },
    { titre: 'Point d’entrée', vue: 'entree',
      texte: 'De face, le point d’entrée est dans l’axe du canal médullaire, au versant médial de l’épine tibiale latérale (environ 3 mm en dedans de la crête tibiale). De profil, il est au bord antérieur du plateau, juste sous l’angle entre plateau et métaphyse antérieure, en zone extra-articulaire. Trop médial, il entraîne un valgus dans les fractures proximales. La broche-guide est contrôlée de face et de profil. Peau retirée et patella translucide : genou fléchi, elle ne masque pas le point d’entrée.',
      accent: ['axe-clou', 'tibia'], voiler: ['patella'], estomper: ['hoffa'], danger: ['menisque-med', 'menisque-lat', 'lig-transverse'], montrer: ['axe-clou'], masquer: [...IMPLANTS, ...PEAU, 'capsule', 'retinaculum-lat', 'retinaculum-med', 'anastomose-patellaire'],
      ecarter: { ...peauOuverte(1.15), ...tendonFendu(1.2), ...HOFFA_REFOULE } },
    { titre: 'Alésage et clou', vue: 'jambe',
      texte: 'Ouverture de la corticale, guide à olive passé à travers le foyer réduit jusqu’au centre du pilon, alésage progressif en protégeant le ligament patellaire, puis clou monté sur son viseur. La réduction doit être obtenue avant l’alésage et maintenue pendant la descente du clou. La peau est ici retirée et le tibia translucide.',
      voiler: ['tibia'], estomper: ['tibial-ant', 'gastro-med', 'soleaire', 'fdl', 'edl'], montrer: ['clou'], masquer: [...REPERES, ...PEAU, 'clou/vis-prox1', 'clou/vis-prox2', 'clou/vis-dist1', 'clou/vis-dist2'], ecarter: tendonFendu(1.2) },
    { titre: 'Verrouillages', vue: 'jambe',
      texte: 'Verrouillage proximal par le viseur solidaire du clou. Verrouillage distal à main levée sous scopie (« ronds parfaits »), de dedans en dehors : le nerf saphène et la grande veine saphène longent la face médiale du tibia distal — incision courte, dissection à la pince jusqu’à l’os. Pour une vis antéro-postérieure, le paquet tibial antérieur et le nerf fibulaire profond sont en danger. Fermeture : péritendon, puis peau.',
      voiler: ['tibia'], estomper: ['tibial-ant', 'gastro-med', 'soleaire', 'fdl', 'edl'], danger: ['nsaphene', 'vsaphene', 'atibiale-ant', 'nfibprof'], montrer: ['clou'], masquer: [...REPERES, ...PEAU], ecarter: tendonFendu(1.2) },
  ] },
};

export default { nom: 'Genou et jambe droits', graisse: 4, centre, vues, meshes, fendre, tubes, groupes, voies };
