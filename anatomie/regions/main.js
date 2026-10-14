// Main droite — voie dorsale des métacarpiens et voie de Bruner des fléchisseurs.
// Repère BodyParts3D, en millimètres : x = côté radial (-) / côté ulnaire (+), y = face palmaire (-) / face dorsale (+), z = proximal (+) / distal (-).
// Les doigts du modèle sont en légère flexion.
import pieces from './main.pieces.js';
import { peauFendue, berges, charge, lame, deuxBerges } from './outils.js';

const meshes = [
  ['peau-poignet', 'Peau', 'peau', '#e2b596', { id: 'peau', dossier: 'models-z' }],
  ...pieces,
];
// ----- Voie dorsale du 4e espace : donne le 4e et le 5e métacarpien -----
const PEAU_MC = [[-243, -102, 797], [-243, -106, 786], [-243, -109, 777], [-242, -114, 767], [-244, -118, 756], [-243, -121, 747]];
const FOND_MC = [0, -1, 0];
const RADIAL = [-1, 0, 0];
const ULNAIRE = [1, 0, 0];
const FENTE_MC = [[-243, -115, 770], [-1, 0, 0]];
// ----- Voie de Bruner du majeur : zigzag dont chaque angle est sur la ligne médio-latérale, au niveau d'un pli de flexion -----
const PEAU_BR = [[-266, -143, 760], [-273, -146, 746], [-280, -150, 732], [-274, -151, 721], [-268, -157, 711], [-262, -161, 700], [-268, -167, 694], [-274, -173, 688], [-280, -183, 681]];
const FOND_BR = [0, 0.92, -0.38];
const vis = (id, x, y, z) => [id, 'Vis', 'implants', '#cfd6dd', 1, [[x, y + 1, z], [x, y - 5, z], [x, y - 11, z]]];
const tubes = [
  ['incision-mc', 'Incision — voie dorsale du 4e espace', 'incisions', '#35e0c8', 0.9, PEAU_MC.map(([x, y, z]) => [x, y + 1.5, z])],
  ['incision-bruner', 'Incision — voie de Bruner du majeur', 'incisions', '#35e0c8', 0.8, PEAU_BR.map(([x, y, z]) => [x, y - 1.4, z + 0.4])],
  vis('plaque-mc/vis1', -240, -115, 790), vis('plaque-mc/vis2', -239, -117, 782), vis('plaque-mc/vis3', -236, -121, 766), vis('plaque-mc/vis4', -234.5, -124, 755),
];
const rubans = [
  ['plaque-mc', 'Plaque dorsale du 5e métacarpien', 'implants', '#b9c2cc', [[-240.5, -114.5, 794], [-238, -118.5, 777], [-235.5, -122, 761], [-233.5, -126.5, 750]], 5.5, 1.2, [1, 0, 0]],
];
const groupes = [
  ['peau', 'Peau'], ['graisse', 'Tissu sous-cutané'], ['os', 'Os'], ['flechisseurs', 'Fléchisseurs'], ['extenseurs', 'Extenseurs'], ['main', 'Muscles de la main'],
  ['gaines', 'Gaines et poulies'], ['ligaments', 'Aponévrose et rétinaculums'], ['vaisseaux', 'Artères et veines'], ['nerfs', 'Nerfs'], ['incisions', 'Incisions'], ['implants', 'Plaques et vis'],
];
const centre = [-265, -140, 750];
const vues = {
  // main en pronation sur la table à main : face dorsale, doigts vers le bas de l'écran
  opMC: { de: [0, 230, 40], cible: [-242, -115, 770] }, opMCProche: { de: [0, 135, 25], cible: [-241, -116, 770] },
  // main en supination, doigt tenu en extension relative par la main de l'aide : face palmaire du majeur
  opBr: { de: [10, -200, -40], cible: [-270, -158, 718] }, opBrProche: { de: [8, -150, -34], cible: [-270, -158, 716] },
  libre: { de: [-150, -250, 60] },
};
const IMPLANTS = ['plaque-mc'];

// Petites lames, peu profondes : la peau de la main est fine.
const bouts = ligne => [ligne[0], ligne[ligne.length - 1]];
const lames = (ligne, fond, versA, versB, e, options, ids) => deuxBerges(ligne, fond,
  { vers: versA, lame: lame(bouts(ligne), versA, fond, e, e * 2.2 + 5, options) },
  { vers: versB, lame: lame(bouts(ligne), versB, fond, e, e * 2.2 + 5, options) }, ids);
const mcPeau = e => lames(PEAU_MC, FOND_MC, RADIAL, ULNAIRE, e, { rayon: 8, profondeur: 12 });
// tendons extenseurs et interosseux partagés par le plan de l'incision ; branche dorsale du nerf ulnaire avec la berge ulnaire
const mcProfond = e => ({
  ...charge(['ed/A', 'interosseux-dors/A'], lame(bouts(PEAU_MC), RADIAL, FOND_MC, e, e * 2.2 + 8, { rayon: 8, profondeur: 22 })),
  ...charge(['ed/B', 'edm', 'interosseux-dors/B', 'nulnaire-dorsal', 'ndors-uln'], lame(bouts(PEAU_MC), ULNAIRE, FOND_MC, e, e * 2.2 + 8, { rayon: 8, profondeur: 22 })),
});
// Bruner : les lambeaux triangulaires sont levés avec les pédicules digitaux, qui restent dans le tissu sous-cutané latéral.
// les berges suivent le zigzag : chaque lambeau s'écarte de son côté
const brPeau = e => berges(PEAU_BR, FOND_BR, [e, 0, 0], 1, 6);
const brPedicules = e => ({
  ...charge(['ndig-med', 'adig', 'vdig'], { dep: [-e, 0, 0], autour: PEAU_BR, rayon: 9, fond: FOND_BR }),
});
const FENETRE = { 'gaines-digitales': { autour: [[-270, -156, 722], [-270, -160, 707]], rayon: 5.5 }, poulies: { autour: [[-270, -156, 722], [-270, -160, 707]], rayon: 5.5 } };

const voies = {
  mc: { court: 'Métacarpiens', titre: 'Voie dorsale des métacarpiens (4ᵉ espace)', fendre: [...peauFendue(PEAU_MC, FOND_MC, 'radiale', 'ulnaire'),
    ['ed', ...FENTE_MC, 'Extenseur des doigts — tendons radiaux', 'Extenseur des doigts — tendon de l’auriculaire'],
    ['interosseux-dors', ...FENTE_MC, 'Interosseux dorsaux — 1ᵉʳ au 3ᵉ espace', 'Interosseux dorsaux — 4ᵉ espace']], steps: [
    { titre: 'Installation et incision', vue: 'opMC',
      texte: 'Vue de l’opérateur : main en pronation sur la table à main, garrot pneumatique. Incision dorsale longitudinale de 3 à 5 cm, dans l’espace entre les 4ᵉ et 5ᵉ métacarpiens : une incision placée entre deux métacarpiens les donne tous les deux et évite que la cicatrice soit en regard de la plaque et du tendon. Pour le 5ᵉ métacarpien seul, l’incision est dorso-ulnaire. La branche dorsale du nerf ulnaire croise le bord ulnaire du poignet et du 5ᵉ rayon.',
      montrer: ['incision-mc'], danger: ['nulnaire-dorsal', 'ndors-uln'] },
    { titre: 'Plan des extenseurs', vue: 'opMCProche',
      texte: 'Les veines dorsales sont respectées autant que possible, la branche dorsale du nerf ulnaire et ses rameaux sont réclinés avec la berge ulnaire. Les tendons extenseurs de l’annulaire et de l’auriculaire (extenseur des doigts, extenseur propre du petit doigt) sont écartés de part et d’autre ; les connexions intertendineuses sont respectées.',
      accent: ['ed/A', 'ed/B', 'edm'], danger: ['nulnaire-dorsal', 'ndors-uln'], masquer: ['vdors'], ecarter: { ...mcPeau(6), ...mcProfond(3) } },
    { titre: 'Métacarpiens exposés', vue: 'opMCProche',
      texte: 'Le fascia des interosseux dorsaux est incisé le long du bord dorsal de l’os, et les interosseux sont décollés en sous-périosté sur le seul côté nécessaire. Le périoste est gardé pour être refermé sur la plaque, qu’il sépare des tendons extenseurs.',
      accent: ['mc4', 'mc5'], danger: ['nulnaire-dorsal'], masquer: ['vdors'], ecarter: { ...mcPeau(8), ...mcProfond(7) } },
    { titre: 'Réduction et plaque', vue: 'opMCProche',
      texte: 'Réduction en contrôlant la rotation : doigts fléchis ensemble, ils doivent converger vers le tubercule du scaphoïde sans chevauchement (« scissoring »). Plaque dorsale de 1,5 à 2,0 mm, deux vis bicorticales (quatre corticales) de chaque côté ; vis seules pour un trait spiroïde long (longueur du trait > 2 fois le diamètre de l’os). Fermeture du périoste sur la plaque, puis de la peau ; mobilisation précoce.',
      accent: ['plaque-mc'], voiler: ['mc5'], montrer: ['plaque-mc'], danger: ['nulnaire-dorsal'], masquer: ['vdors'], ecarter: { ...mcPeau(8), ...mcProfond(7) } },
  ] },
  bruner: { court: 'Bruner', titre: 'Voie de Bruner du doigt (gaine des fléchisseurs)', fendre: peauFendue(PEAU_BR, FOND_BR, 'radiale', 'ulnaire'), steps: [
    { titre: 'Installation et incision', vue: 'opBr',
      texte: 'Vue de l’opérateur : main en supination sur la table à main, garrot ; le doigt est tenu par l’aide. Incision en zigzag de Bruner : chaque angle se place sur la ligne médio-latérale, au niveau d’un pli de flexion, et les branches obliques traversent la face palmaire à environ 90° l’une de l’autre ; elle ne croise jamais un pli à angle droit (rétraction en flexion). Ici, du pli palmaire distal au pli de l’interphalangienne distale. La voie médio-latérale, sur la ligne qui joint les extrémités dorsales des plis, est l’alternative.',
      montrer: ['incision-bruner'], danger: ['ndig-med', 'adig'] },
    { titre: 'Lambeaux triangulaires', vue: 'opBrProche',
      texte: 'Les lambeaux sont levés à pointe mousse, avec leur graisse, au ras de la gaine des fléchisseurs : les pointes doivent rester épaisses pour ne pas nécroser. Les pédicules digitaux palmaires (nerf en avant, artère en arrière) cheminent dans le tissu latéral, sous l’angle des lambeaux : ils sont repérés de chaque côté et laissés dans le lambeau.',
      accent: ['gaines-digitales', 'poulies'], danger: ['ndig-med', 'adig', 'ndig-uln'], ecarter: { ...brPeau(3), ...brPedicules(1.5) } },
    { titre: 'Gaine des fléchisseurs', vue: 'opBrProche',
      texte: 'La gaine est ouverte dans les zones de poulies cruciformes (fenêtre entre A2 et A4, en L ou en volet), jamais sur les poulies annulaires A2 et A4, indispensables contre l’effet « corde d’arc ». Le fléchisseur superficiel, qui se divise sur la phalange proximale, et le fléchisseur profond qui le traverse (chiasma de Camper) apparaissent.',
      accent: ['fds', 'fdp'], danger: ['ndig-med', 'adig'], sectionner: FENETRE, ecarter: { ...brPeau(4), ...brPedicules(2) } },
    { titre: 'Suture tendineuse', vue: 'opBrProche',
      texte: 'Le moignon proximal est récupéré (flexion du poignet, traite, ou contre-incision palmaire) et maintenu par une aiguille transfixiante. Suture à quatre ou six brins (type Adelaide, M-Tang), surjet épitendineux, puis contrôle du glissement sous les poulies sans accrochage ; une ouverture partielle de A4 est tolérée si elle est nécessaire. Rééducation active précoce protégée par une orthèse dorsale.',
      accent: ['fdp', 'fds'], danger: ['ndig-med', 'adig'], sectionner: FENETRE, ecarter: { ...brPeau(4), ...brPedicules(2) } },
  ] },
};
export default { nom: 'Main droite', graisse: 2, centre, vues, meshes, tubes, rubans, groupes, voies };
