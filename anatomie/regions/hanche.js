// Hanche droite — données de la région pour le visualiseur.
// Repère BodyParts3D, en millimètres : x = droite (-) / gauche (+), y = avant (-) / arrière (+), z = vers le haut.

import { lame, deuxBerges } from './outils.js';

// Pièces du modèle libre : [fichier, nom, groupe, couleur]
const meshes = [
  ['peau-hanche', 'Peau', 'peau', '#e2b596', { id: 'peau', dossier: 'models-z' }],
  ['FMA16586', 'Os coxal', 'os', '#e9e2cf'],
  ['FMA24474', 'Fémur', 'os', '#e9e2cf'],
  ['FMA16202', 'Sacrum', 'os', '#ded6c0'],
  ['FMA22328', 'Grand fessier', 'fessiers', '#b5483f'],
  ['FMA22330', 'Moyen fessier', 'fessiers', '#c25a4c'],
  ['FMA22332', 'Petit fessier', 'fessiers', '#cf6f5d'],
  ['FMA22425', 'Tenseur du fascia lata', 'fessiers', '#d9773f'],
  ['FMA58776', 'Fascia lata (tractus ilio-tibial)', 'fessiers', '#cfd6dd'],
  ['FMA22340', 'Piriforme', 'rotateurs', '#e08a3c'],
  ['FMA22334', 'Jumeau supérieur', 'rotateurs', '#d7a13a'],
  ['FMA22324', 'Obturateur interne', 'rotateurs', '#c9b23c'],
  ['FMA22336', 'Jumeau inférieur', 'rotateurs', '#d7a13a'],
  ['FMA22338', 'Carré fémoral', 'rotateurs', '#b98a3e'],
  ['FMA22326', 'Obturateur externe', 'rotateurs', '#a87946'],
  ['FMA22354', 'Sartorius', 'anterieurs', '#c4527a'],
  ['FMA38928', 'Droit fémoral', 'anterieurs', '#b84a5e'],
  ['FMA38930', 'Vaste latéral', 'anterieurs', '#a8444f'],
  ['FMA38934', 'Vaste intermédiaire', 'anterieurs', '#9c4048'],
  ['FMA38932', 'Vaste médial', 'anterieurs', '#a8444f'],
  ['FMA22322', 'Iliaque', 'anterieurs', '#9a5aa8'],
  ['FMA22342', 'Grand psoas', 'anterieurs', '#8a4f9c'],
  ['FMA22450', 'Pectiné', 'mediaux', '#7d6bb5'],
  ['FMA22456', 'Long adducteur', 'mediaux', '#6f73b8'],
  ['FMA22452', 'Court adducteur', 'mediaux', '#6a7fb8'],
  ['FMA22459', 'Grand adducteur', 'mediaux', '#6388b5'],
  ['FMA43883', 'Gracile', 'mediaux', '#5f93b0'],
  ['FMA45888', 'Biceps fémoral (chef long)', 'posterieurs', '#8f5b4a'],
  ['FMA22358', 'Semi-tendineux', 'posterieurs', '#9a6652'],
  ['FMA22448', 'Semi-membraneux', 'posterieurs', '#a5705a'],
  ['FMA21964', 'Ligament inguinal', 'ligaments', '#dfe6ec'],
  // Capsule, ligaments, nerfs, artères et veines : modèle Z-Anatomy (CC BY-SA 4.0), replacé dans le repère BodyParts3D.
  ['hanche-capsule', 'Capsule articulaire de la hanche', 'ligaments', '#efe9da', { id: 'capsule', dossier: 'models-z' }],
  ['hanche-iliofemoral-desc', 'Ligament ilio-fémoral — faisceau descendant', 'ligaments', '#e9e4d6', { id: 'capsule/iliofem-desc', dossier: 'models-z' }],
  ['hanche-iliofemoral-trans', 'Ligament ilio-fémoral — faisceau transverse', 'ligaments', '#e9e4d6', { id: 'capsule/iliofem-trans', dossier: 'models-z' }],
  ['hanche-pubofemoral', 'Ligament pubo-fémoral', 'ligaments', '#e9e4d6', { id: 'capsule/pubofem', dossier: 'models-z' }],
  ['hanche-ischiofemoral', 'Ligament ischio-fémoral', 'ligaments', '#e9e4d6', { id: 'capsule/ischiofem', dossier: 'models-z' }],
  ['hanche-zona', 'Zone orbiculaire', 'ligaments', '#e3dccb', { id: 'capsule/zona', dossier: 'models-z' }],
  ['hanche-labrum', 'Labrum acétabulaire', 'ligaments', '#d9cfb6', { id: 'labrum', dossier: 'models-z' }],
  ['hanche-lig-tete', 'Ligament de la tête fémorale', 'ligaments', '#e9e4d6', { id: 'lig-tete', dossier: 'models-z' }],
  ['hanche-lig-transverse', 'Ligament transverse de l’acétabulum', 'ligaments', '#e9e4d6', { id: 'lig-transverse', dossier: 'models-z' }],
  ['hanche-sacrospinal', 'Ligament sacro-épineux', 'ligaments', '#e9e4d6', { id: 'sacro-epineux', dossier: 'models-z' }],
  ['hanche-sacrotuberal', 'Ligament sacro-tubéral', 'ligaments', '#e9e4d6', { id: 'sacro-tuberal', dossier: 'models-z' }],
  ['hanche-membrane-obt', 'Membrane obturatrice', 'ligaments', '#d6d0c0', { id: 'membrane-obt', dossier: 'models-z' }],
  ['n-sciatique', 'Nerf sciatique', 'nerfs', '#f3d98b', { id: 'sciatique', dossier: 'models-z' }],
  ['n-gluteal-sup', 'Nerf glutéal supérieur', 'nerfs', '#f3d98b', { id: 'nglutealsup', dossier: 'models-z' }],
  ['n-cutane-post', 'Nerf cutané postérieur de la cuisse', 'nerfs', '#f3d98b', { id: 'ncutpost', dossier: 'models-z' }],
  ['n-pudendal', 'Nerf pudendal', 'nerfs', '#f3d98b', { id: 'npudendal', dossier: 'models-z' }],
  ['n-carre-femoral', 'Nerf du carré fémoral', 'nerfs', '#f3d98b', { id: 'ncarre', dossier: 'models-z' }],
  ['n-piriforme', 'Nerf du piriforme', 'nerfs', '#f3d98b', { id: 'npiriforme', dossier: 'models-z' }],
  ['n-femoral', 'Nerf fémoral', 'nerfs', '#f3d98b', { id: 'nfemoral', dossier: 'models-z' }],
  ['n-femoral-cutanes', 'Nerf fémoral — rameaux cutanés antérieurs', 'nerfs', '#f3d98b', { id: 'nfemoral/cutanes', dossier: 'models-z' }],
  ['n-saphene', 'Nerf saphène', 'nerfs', '#f3d98b', { id: 'nfemoral/saphene', dossier: 'models-z' }],
  ['n-cutane-lateral', 'Nerf cutané latéral de la cuisse', 'nerfs', '#f3d98b', { id: 'nclc', dossier: 'models-z' }],
  ['n-obturateur', 'Nerf obturateur', 'nerfs', '#f3d98b', { id: 'nobturateur', dossier: 'models-z' }],
  ['n-obturateur-ant', 'Nerf obturateur — branche antérieure', 'nerfs', '#f3d98b', { id: 'nobturateur/ant', dossier: 'models-z' }],
  ['n-obturateur-post', 'Nerf obturateur — branche postérieure', 'nerfs', '#f3d98b', { id: 'nobturateur/post', dossier: 'models-z' }],
  ['a-iliaque-ext', 'Artère iliaque externe', 'vaisseaux', '#c8102e', { id: 'ailiaque', dossier: 'models-z' }],
  ['a-femorale', 'Artère fémorale', 'vaisseaux', '#c8102e', { id: 'afemorale', dossier: 'models-z' }],
  ['a-femorale-profonde', 'Artère fémorale profonde', 'vaisseaux', '#c8102e', { id: 'afemorale/prof', dossier: 'models-z' }],
  ['a-circonflexe-lat', 'Artère circonflexe latérale de la cuisse', 'vaisseaux', '#e0392b', { id: 'circonflexe', dossier: 'models-z' }],
  ['a-circonflexe-lat-desc', 'Circonflexe latérale — branche descendante', 'vaisseaux', '#e0392b', { id: 'circonflexe/desc', dossier: 'models-z' }],
  ['a-circonflexe-med', 'Artère circonflexe médiale de la cuisse', 'vaisseaux', '#e0392b', { id: 'circonflexe-med', dossier: 'models-z' }],
  ['a-perforantes', 'Artères perforantes', 'vaisseaux', '#e0392b', { id: 'perforantes', dossier: 'models-z' }],
  ['a-obturatrice', 'Artère obturatrice', 'vaisseaux', '#c8102e', { id: 'aobturatrice', dossier: 'models-z' }],
  ['a-gluteale-sup', 'Artère glutéale supérieure', 'vaisseaux', '#c8102e', { id: 'aglutealsup', dossier: 'models-z' }],
  ['a-gluteale-inf', 'Artère glutéale inférieure', 'vaisseaux', '#c8102e', { id: 'aglutealinf', dossier: 'models-z' }],
  ['a-pudendale', 'Artère pudendale interne', 'vaisseaux', '#c8102e', { id: 'apudendale', dossier: 'models-z' }],
  ['v-iliaque-ext', 'Veine iliaque externe', 'vaisseaux', '#2f4f9e', { id: 'viliaque', dossier: 'models-z' }],
  ['v-femorale', 'Veine fémorale', 'vaisseaux', '#2f4f9e', { id: 'vfemorale', dossier: 'models-z' }],
  ['v-femorale-profonde', 'Veine fémorale profonde', 'vaisseaux', '#2f4f9e', { id: 'vfemorale/prof', dossier: 'models-z' }],
  ['v-grande-saphene', 'Grande veine saphène', 'vaisseaux', '#2f4f9e', { id: 'vsaphene', dossier: 'models-z' }],
  ['v-circonflexe-lat', 'Veines circonflexes latérales', 'vaisseaux', '#2f4f9e', { id: 'vcirconflexe', dossier: 'models-z' }],
  ['v-circonflexe-med', 'Veines circonflexes médiales', 'vaisseaux', '#2f4f9e', { id: 'vcirconflexe-med', dossier: 'models-z' }],
  ['v-gluteale-sup', 'Veines glutéales supérieures', 'vaisseaux', '#2f4f9e', { id: 'vglutealsup', dossier: 'models-z' }],
  ['v-gluteale-inf', 'Veines glutéales inférieures', 'vaisseaux', '#2f4f9e', { id: 'vglutealinf', dossier: 'models-z' }],
];

// Pièces fendues le long des lignes d'incision, pour que leurs berges puissent s'écarter : [pièce, point du plan, normale, nom côté normale (/A), nom autre côté (/B)].
// Le fascia lata est découpé selon les trois incisions qui le traversent ; un morceau peut être refendu (« FMA…/A » donne « …/A/A » et « …/A/B »).
const PLAN_FESSIER_N = [-0.618, -0.464, 0.634]; // plan qui contient la partie courbe de l'incision de Moore, du trochanter vers l'EIPS
const fendre = [
  ['FMA58776', [-152, -76, 780], [0, 1, 0], 'Fascia lata — en arrière du trochanter', 'Fascia lata — en avant du trochanter'],
  ['FMA58776/A', [-152, -74, 800], PLAN_FESSIER_N, 'Fascia lata — au-dessus de l’incision de Moore', 'Fascia lata — en arrière de l’incision de Moore'],
  ['FMA58776/B', [-158, -90, 780], [0, 1, 0], 'Fascia lata — face latérale, moitié postérieure', 'Fascia lata — face latérale, moitié antérieure'],
  ['FMA22328', [-152, -74, 800], PLAN_FESSIER_N, 'Grand fessier — fibres supérieures', 'Grand fessier — fibres inférieures'],
  ['FMA22330', [-127, -76, 840], [0, 1, 0], 'Moyen fessier — fibres postérieures', 'Moyen fessier — fibres antérieures'],
];

// Tracés à la main : incisions (sur la peau) et repères d'ostéosynthèse. [id, nom, groupe, couleur, rayon, options, points]
const tubes = [
  ['incision-post', 'Incision — voie postérieure', 'incisions', '#35e0c8', 1.4, {},
    [[-174, -71, 714], [-173, -73, 758], [-168, -70, 800], [-154, -46, 838], [-128, -17, 871], [-105, 10, 899]]],
  ['incision-ant', 'Incision — voie antérieure', 'incisions', '#35e0c8', 1.4, {},
    [[-132, -164, 882], [-135, -159, 851], [-142, -154, 816], [-149, -153, 782]]],
  ['incision-lat', 'Incision — voie latérale du fémur proximal', 'incisions', '#35e0c8', 1.4, {},
    [[-168, -92, 808], [-175, -90, 758], [-176, -90, 707], [-176, -92, 660]]],
  ['incision-hardinge', 'Incision — voie latérale de Hardinge', 'incisions', '#35e0c8', 1.4, {},
    [[-153, -78, 905], [-155, -77, 880], [-160, -77, 855], [-163, -78, 831], [-167, -77, 806], [-172, -77, 780], [-174, -77, 756], [-177, -78, 733]]],
  ['incision-clou', 'Incision — abord du grand trochanter', 'incisions', '#35e0c8', 1.4, {},
    [[-164, -74, 845], [-157, -77, 873], [-153, -74, 899]]],
  ['axe-clou', 'Axe du clou (schématique)', 'reperes', '#7df9ff', 2.2, {},
    [[-140, -68, 900], [-127, -77, 822], [-114, -88, 730], [-103, -93, 640], [-97, -94, 580]]],
  ['axe-vis', 'Axe de la vis cervicale (schématique)', 'reperes', '#7df9ff', 2.2, {},
    [[-150, -86, 765], [-128, -88, 780], [-98, -90, 800], [-70, -92, 819]]],
].map(([id, nom, groupe, couleur, rayon, options, points]) => [id, nom, groupe, couleur, rayon, points, options]);

// Implants (tracés schématiques) : plaque DHS et ses vis, clou gamma et ses vis.
const rubans = [
  ['dhs', 'Plaque DHS', 'implants', '#b9c2cc', [[-147, -86, 776], [-135, -87, 752], [-127, -87, 722], [-122, -90, 692], [-118, -92, 664]], 17, 4, [0, 1, 0]],
];
const visPlaque = (n, x, y, z) => [`dhs/vis${n}`, 'Vis corticale de la plaque', 'implants', '#cfd6dd', 2.2, {}, [[x - 4, y, z], [x + 14, y, z], [x + 32, y, z]]];
tubes.push(...[
  ['dhs/vis-cervicale', 'Vis cervicale (DHS)', 'implants', '#cfd6dd', 4.5, {}, [[-146, -86, 767], [-110, -89, 791], [-72, -92, 817]]],
  visPlaque(1, -131, -87, 742), visPlaque(2, -127, -87, 722), visPlaque(3, -123, -89, 700), visPlaque(4, -120, -91, 678),
  ['gamma', 'Clou gamma', 'implants', '#b9c2cc', 6, {}, [[-128, -77, 828], [-122, -80, 792], [-114, -85, 752], [-108, -90, 712], [-104, -93, 672], [-101, -94, 642]]],
  ['gamma/vis', 'Vis cervicale (clou gamma)', 'implants', '#cfd6dd', 4.5, {}, [[-140, -85, 764], [-118, -86, 779], [-72, -92, 817]]],
  ['gamma/verrou', 'Vis de verrouillage distal', 'implants', '#cfd6dd', 2.4, {}, [[-124, -93, 668], [-104, -93, 668], [-86, -93, 668]]],
].map(([id, nom, groupe, couleur, rayon, options, points]) => [id, nom, groupe, couleur, rayon, points, options]));

const groupes = [
  ['peau', 'Peau'], ['graisse', 'Tissu sous-cutané'], ['os', 'Os'], ['fessiers', 'Fessiers et fascia lata'], ['rotateurs', 'Pelvi-trochantériens'], ['anterieurs', 'Loge antérieure et ilio-psoas'],
  ['mediaux', 'Adducteurs'], ['posterieurs', 'Ischio-jambiers'], ['ligaments', 'Capsule et ligaments'], ['vaisseaux', 'Artères et veines'], ['nerfs', 'Nerfs'],
  ['incisions', 'Incisions'], ['reperes', 'Repères d’ostéosynthèse'], ['implants', 'Implants'],
];

// Lignes d'incision relevées sur la peau, en regard des incisions profondes. Chaque voie fend la peau et le tissu sous-cutané sur sa ligne ;
// « /A » et « /B » désignent les deux berges (côté de la normale « tronçon × fond », et l'autre).
const PEAU_MOORE = [[-172, -71, 714], [-171, -73, 758], [-166, -70, 800], [-152, -47, 838], [-127, -19, 871], [-105, 8, 899]];
const PEAU_HUETER = [[-131, -162, 882], [-134, -157, 851], [-141, -152, 816], [-148, -151, 782]];
const PEAU_LATERALE = [[-166, -92, 808], [-173, -90, 758], [-174, -90, 707], [-174, -92, 660]];
const PEAU_HARDINGE = [[-151, -78, 905], [-153, -77, 880], [-158, -77, 855], [-161, -78, 831], [-165, -77, 806], [-170, -77, 780], [-172, -77, 756], [-175, -78, 733]];
const PEAU_CLOU = [[-162, -74, 845], [-155, -77, 873], [-151, -74, 899]];
const peauFendue = (ligne, fond, nomA, nomB) => [
  ['peau', { ligne, fond, rayon: 16 }, `Peau — berge ${nomA}`, `Peau — berge ${nomB}`],
  ['graisse', { ligne, fond, rayon: 20 }, `Tissu sous-cutané — berge ${nomA}`, `Tissu sous-cutané — berge ${nomB}`],
];
// berges cutanées écartées : mêmes directions que le plan sous-jacent, un peu plus larges
const berges = (ligne, fond, depA, k = 1, rayon = 38) => {
  const A = { dep: Array.isArray(depA[0]) ? depA.map(d => d.map(c => c * k)) : depA.map(c => c * k), autour: ligne, rayon, fond };
  const B = { ...A, dep: Array.isArray(depA[0]) ? depA.map(d => d.map(c => -c * k)) : depA.map(c => -c * k) };
  return { 'peau/A': A, 'graisse/A': A, 'peau/B': B, 'graisse/B': B };
};

const ROTATEURS = ['FMA22340', 'FMA22334', 'FMA22324', 'FMA22336'];
const REPERES = ['axe-clou', 'axe-vis'];
const PEAU = ['peau', 'graisse'];
const centre = [-92, -85, 825]; // articulation de la hanche droite
const DIAPHYSE = [-112, -88, 745]; // cible des vues latérales : région trochantérienne et sous-trochantérienne

// Points de vue : décalage de la caméra par rapport à la cible (le centre, sauf cible précisée).
const vues = {
  post: { de: [-230, 400, 110] }, postProche: { de: [-225, 320, -10] },
  // vue de l'opérateur : patient couché sur le côté sain, opérateur dans son dos ; la tête du patient est à gauche, l'avant en haut de l'image
  opPost: { de: [-400, 275, 0], haut: [-0.565, -0.826, 0] },
  opPostProche: { de: [-250, 172, 0], haut: [-0.565, -0.826, 0], cible: [-112, -66, 822] },
  ant: { de: [-150, -430, 70] }, antProche: { de: [-120, -330, 10] },
  // décubitus dorsal, opérateur du côté opéré : tête du patient à gauche, ligne médiane en haut de l'image
  opAnt: { de: [-90, -420, 0], haut: [1, 0, 0], cible: [-125, -135, 830] }, opAntProche: { de: [-60, -270, 0], haut: [1, 0, 0], cible: [-120, -128, 828] },
  // table orthopédique, opérateur en dehors de la cuisse : tête du patient à gauche, face antérieure de la cuisse en haut
  opLat: { de: [-440, -70, 0], haut: [0, -1, 0], cible: [-125, -90, 735] }, opLatProche: { de: [-300, -45, 0], haut: [0, -1, 0], cible: [-125, -90, 735] },
  opHardinge: { de: [-440, -90, 30], haut: [0, -1, 0], cible: [-130, -92, 820] }, opHardingeProche: { de: [-300, -95, 20], haut: [0, -1, 0], cible: [-125, -98, 818] },
  opTroch: { de: [-400, -40, 130], haut: [0, -1, 0], cible: [-135, -78, 850] }, opTrochProche: { de: [-275, -25, 90], haut: [0, -1, 0], cible: [-135, -78, 850] },
  lat: { de: [-520, -60, 40], cible: DIAPHYSE }, latProche: { de: [-400, -90, 20], cible: DIAPHYSE },
  trochanter: { de: [-380, 60, 190], cible: [-120, -80, 835] },
  libre: { de: [-380, -260, 120] },
};

// Principe : les muscles restent sur leur trajet anatomique. Seules les berges d'une incision s'écartent, localement
// (traction limitée à quelques centimètres autour de la ligne d'incision). Ce qui masque le plan profond devient translucide (« voiler »).
// Voie de Moore : UNE incision continue. Partie basse dans l'axe du fémur (fascia lata), partie haute courbe vers l'EIPS (grand fessier dissocié).
// Les deux lèvres s'écartent franchement, perpendiculairement à cette ligne, tout du long.
const LIGNE_MOORE = [[-151, -75, 715], [-153, -76, 760], [-152, -74, 800], [-143, -52, 838], [-125, -24, 872]];
const moore = k => {
  const bas = [-5 * k, -26 * k, 0];                              // lèvre antérieure, en regard du fémur
  const haut = PLAN_FESSIER_N.map(c => c * 27 * k);              // lèvre supérieure, en regard du grand fessier
  const avant = { dep: [bas, bas, haut, haut], autour: LIGNE_MOORE, rayon: 36 };
  const arriere = { dep: [bas, bas, haut, haut].map(d => d.map(c => -c)), autour: LIGNE_MOORE, rayon: 36 };
  // peau et tissu sous-cutané : berge /A en arrière, /B en avant, sur la ligne relevée à la surface
  const peau = berges(PEAU_MOORE, [0.75, -0.66, 0], [bas, bas, haut, haut, haut].map(d => d.map(c => -c * 1.1)), 1, 42);
  return { ...peau, 'FMA58776/B': avant, 'FMA58776/A/A': avant, 'FMA22328/A': avant, 'FMA58776/A/B': arriere, 'FMA22328/B': arriere };
};
const MOORE_OUVERT = moore(1);
// Pelvi-trochantériens sectionnés au ras du trochanter : la portion proche de l'insertion est retirée, le corps musculaire et le moignon restent.
const LIGNE_TROCHANTER = [[-122, -74, 798], [-118, -72, 834]]; // insertion trochantérienne des pelvi-trochantériens
const SECTION_ROTATEURS = Object.fromEntries(ROTATEURS.map(id => [id, { autour: LIGNE_TROCHANTER, rayon: 9 }]));
// Lambeau postérieur : pelvi-trochantériens et capsule postérieure, sectionnés ensemble au ras du trochanter et du col,
// sont rabattus d'un seul tenant en arrière et en dedans. Seule leur extrémité libre se déplace ; leur origine pelvienne ne bouge pas.
const RABAT = { dep: [34, 30, 0], autour: LIGNE_TROCHANTER, rayon: 34 };
const LAMBEAU_POSTERIEUR = {
  ...Object.fromEntries(ROTATEURS.map(id => [id, RABAT])),
  capsule: { dep: [30, 26, 0], autour: [[-110, -68, 796], [-104, -66, 832]], rayon: 24 },
};
// Écarteur de Hohmann sous le bord postérieur du moyen fessier, au-dessus du piriforme : la lame relève le moyen et le petit fessier
// vers le haut et l'avant. Le tissu vient se tasser contre la lame ; l'insertion trochantérienne et l'origine iliaque restent en place.
const HOHMANN_FESSIER = { lame: [[-134, -76, 826], [-104, -50, 852]], pousse: [-0.15, -0.62, 0.77], course: 34, rayon: 30 };
const FESSIER_RELEVE = { FMA22330: HOHMANN_FESSIER, FMA22332: HOHMANN_FESSIER };
// La capsule est incisée le long du col, en arrière, pour être rabattue avec les rotateurs.
const SECTION_CAPSULE_POST = { capsule: { autour: [[-112, -70, 796], [-108, -68, 832]], rayon: 8 } };
// Pour montrer le fond de la plaie sans transparence : le grand fessier et le fascia sont sectionnés autour de la partie haute de l'incision ;
// leurs attaches (sacrum, crête iliaque, fémur, tractus) restent en place.
const FENETRE_MOORE = [[-152, -74, 792], [-143, -52, 838], [-128, -30, 866]];
const SECTION_FESSIER = { FMA22328: { autour: FENETRE_MOORE, rayon: 56 }, 'FMA58776/A': { autour: FENETRE_MOORE, rayon: 46 } };

// Voie antérieure : aucun muscle n'est incisé. L'intervalle s'ouvre franchement, mais seulement en regard de l'incision.
const LIGNE_HUETER = [[-120, -148, 872], [-128, -143, 800]];
const hueter = k => ({
  ...berges(PEAU_HUETER, [0.4, 0.9, 0], [22, -2, 0], k), // berge /A en dedans, /B en dehors
  FMA22425: { dep: [-20 * k, 0, 0], autour: LIGNE_HUETER, rayon: 34 }, FMA58776: { dep: [-20 * k, 0, 0], autour: LIGNE_HUETER, rayon: 34 },
  FMA22354: { dep: [20 * k, 0, 0], autour: LIGNE_HUETER, rayon: 34 }, nclc: { dep: [20 * k, 0, 0], autour: LIGNE_HUETER, rayon: 34 },
});
const LIGNE_HUETER_PROFONDE = [[-114, -118, 858], [-118, -122, 800]];
const HUETER_PROFOND = {
  ...hueter(1.2),
  FMA38928: { dep: [15, 0, 0], autour: LIGNE_HUETER_PROFONDE, rayon: 30 },
  FMA22330: { dep: [-15, 4, 0], autour: LIGNE_HUETER_PROFONDE, rayon: 30 }, FMA22332: { dep: [-15, 4, 0], autour: LIGNE_HUETER_PROFONDE, rayon: 30 },
};
const HUETER_CAPSULE = {
  ...HUETER_PROFOND,
  FMA22322: { dep: [14, 0, 0], autour: [-88, -112, 815], rayon: 30 }, FMA22342: { dep: [14, 0, 0], autour: [-88, -112, 815], rayon: 30 },
};

const LIGNE_LATERALE = [[-159, -90, 802], [-159, -90, 664]];
const lateral = k => ({
  ...berges(PEAU_LATERALE, [1, 0, 0], [-3, -25, 0], k), // berge /A en avant, /B en arrière
  'FMA58776/A': { dep: [-3, 24 * k, 0], autour: LIGNE_LATERALE, rayon: 32 }, 'FMA58776/B/A': { dep: [-3, 24 * k, 0], autour: LIGNE_LATERALE, rayon: 32 },
  'FMA58776/B/B': { dep: [-3, -24 * k, 0], autour: LIGNE_LATERALE, rayon: 32 },
});
// Vaste latéral désinséré de la cloison intermusculaire et relevé en avant par un écarteur de Hohmann passé sur le bord antérieur du fémur :
// le muscle se tasse contre la lame, ses attaches proximale et distale restent en place.
const HOHMANN_VASTE = { lame: [[-134, -106, 792], [-122, -110, 668]], pousse: [0, -1, 0], course: 62, rayon: 26, fond: [1, 0, 0], profondeur: 46 };
const VASTE_RELEVE = { FMA38930: HOHMANN_VASTE, FMA38934: HOHMANN_VASTE };
// (ancienne représentation, par section du muscle)
const SECTION_VASTE = { FMA38930: { autour: [[-146, -84, 785], [-140, -88, 672]], rayon: 27 }, FMA38934: { autour: [[-136, -88, 770], [-132, -90, 690]], rayon: 16 } };

const LIGNE_CLOU = [[-152, -76, 846], [-146, -76, 898]];          // incision au-dessus du sommet du trochanter
const LIGNE_CLOU_PROFONDE = [[-134, -76, 836], [-128, -76, 880]]; // même ligne, dans le moyen fessier
const TROCHANTER_OUVERT = {
  ...berges(PEAU_CLOU, [1, 0, 0], [0, 20, 0], 1, 30), // berge /A en arrière, /B en avant
  'FMA58776/A': { dep: [0, 20, 0], autour: LIGNE_CLOU, rayon: 28 }, 'FMA58776/B': { dep: [0, -20, 0], autour: LIGNE_CLOU, rayon: 28 },
  'FMA22328/A': { dep: [0, 20, 0], autour: LIGNE_CLOU, rayon: 28 },
  'FMA22330/A': { dep: [0, 15, 0], autour: LIGNE_CLOU_PROFONDE, rayon: 26 }, 'FMA22330/B': { dep: [0, -15, 0], autour: LIGNE_CLOU_PROFONDE, rayon: 26 },
};

// ----- Voie latérale transglutéale de Hardinge -----
// Peau puis fascia lata s'ouvrent sur la même ligne, à mi-largeur du grand trochanter (plan y = -76 du fascia).
const LIGNE_HARDINGE = [[-150, -76, 902], [-160, -76, 732]];
// L'exposition se gagne en avant : la berge antérieure est réclinée loin, la berge postérieure à peine.
const PEAU_HARDINGE_DROITE = [PEAU_HARDINGE[0], PEAU_HARDINGE[PEAU_HARDINGE.length - 1]];
const optsH = { rayon: 34, profondeur: 40 };
const hardinge = (avant, arriere = 12) => ({
  ...deuxBerges(PEAU_HARDINGE, [1, 0, 0],
    { vers: [0, -1, 0], lame: lame(PEAU_HARDINGE_DROITE, [0, -1, 0], [1, 0, 0], avant, avant * 2.4 + 10, optsH) },
    { vers: [0, 1, 0], lame: lame(PEAU_HARDINGE_DROITE, [0, 1, 0], [1, 0, 0], arriere, arriere * 2.4 + 10, optsH) }),
  'FMA58776/B': lame(LIGNE_HARDINGE, [0, -1, 0], [1, 0, 0], avant, avant * 2.4 + 10, optsH),
  'FMA58776/A': lame(LIGNE_HARDINGE, [0, 1, 0], [1, 0, 0], arriere, arriere * 2.4 + 10, optsH),
  'FMA22328/A': lame(LIGNE_HARDINGE, [0, 1, 0], [1, 0, 0], arriere, arriere * 2.4 + 10, optsH),
  FMA22425: lame(LIGNE_HARDINGE, [0, -1, 0], [1, 0, 0], avant, avant * 2.4 + 30, { rayon: 34, profondeur: 60 }),
});
// Lambeau antérieur en continuité : tiers antérieur du moyen fessier, petit fessier et partie antérieure du vaste latéral,
// détachés du trochanter et relevés en avant d'un seul tenant.
const LAME_HARDINGE = { lame: [[-150, -118, 896], [-150, -120, 742]], pousse: [0, -1, 0], course: 64, rayon: 30, fond: [1, 0, 0], profondeur: 78 };
const LAMBEAU_ANTERIEUR = { 'FMA22330/B': LAME_HARDINGE, FMA22332: LAME_HARDINGE, FMA38930: LAME_HARDINGE };
const DESINSERTION_HARDINGE = { 'FMA22330/B': { autour: [[-140, -80, 824], [-143, -82, 790]], rayon: 12 }, FMA22332: { autour: [[-140, -84, 822], [-142, -86, 794]], rayon: 12 } };
const CAPSULE_ANTERIEURE = { capsule: { autour: [[-88, -116, 834], [-108, -112, 795]], rayon: 16 } };

const voies = {
  post: { court: 'Moore', titre: 'Voie postérieure (Moore)', fendre: peauFendue(PEAU_MOORE, [0.75, -0.66, 0], 'postérieure', 'antérieure'), steps: [
    { titre: 'Installation et incision', vue: 'opPost',
      texte: 'Vue de l’opérateur : patient en décubitus latéral strict, tête à gauche, opérateur dans son dos. L’incision est centrée sur le bord postérieur du grand trochanter : elle descend dans l’axe du fémur et s’incurve en haut et en arrière, vers l’épine iliaque postéro-supérieure.',
      montrer: ['incision-post'], masquer: REPERES },
    { titre: 'Fascia lata et grand fessier', vue: 'opPost',
      texte: 'Peau et tissu sous-cutané sont incisés jusqu’au fascia. Le long de la même incision : en bas, le fascia lata est incisé dans l’axe du fémur ; en haut, les fibres du grand fessier sont dissociées dans leur sens. Les deux lèvres s’écartent sur toute la longueur.',
      accent: ['FMA22328', 'FMA58776'], masquer: REPERES, ecarter: moore(0.55) },
    { titre: 'Écarteur de Charnley', vue: 'opPostProche',
      texte: 'L’écarteur autostatique tient les deux lèvres largement ouvertes. Après effondrement de la bourse trochantérienne et de la graisse, le plan profond apparaît : le bord postérieur du moyen fessier en haut, puis les pelvi-trochantériens, tendus par la rotation interne du membre. Le nerf sciatique chemine en arrière d’eux, dans la graisse : il est repéré au doigt, pas disséqué.',
      accent: [...ROTATEURS, 'FMA22338', 'FMA22330'], danger: ['sciatique'], masquer: REPERES, ecarter: moore(1.3) },
    { titre: 'Moyen fessier récliné', vue: 'opPostProche',
      texte: 'Un écarteur de Hohmann est glissé sous le bord postérieur du moyen fessier, au-dessus du tendon du piriforme, et le relève vers le haut et l’avant. L’insertion trochantérienne des pelvi-trochantériens est alors exposée : tendon du piriforme en haut, puis tendon conjoint (jumeaux et obturateur interne), carré fémoral en bas.',
      accent: [...ROTATEURS, 'FMA22338'], danger: ['sciatique'], masquer: REPERES, ecarter: { ...moore(1.3), ...FESSIER_RELEVE } },
    { titre: 'Section des pelvi-trochantériens et de la capsule', vue: 'opPostProche',
      texte: 'Piriforme et tendon conjoint sont chargés sur fils puis sectionnés au ras de leur insertion trochantérienne ; la capsule postérieure est incisée le long du col. Rotateurs et capsule sont rabattus d’un seul tenant, en arrière et en dedans : ce lambeau recouvre et protège le nerf sciatique, et découvre la tête et le col du fémur. Le carré fémoral est respecté ou partiellement désinséré.',
      accent: ['FMA24474', 'capsule', ...ROTATEURS], danger: ['sciatique'], masquer: REPERES,
      ecarter: { ...moore(1.3), ...FESSIER_RELEVE, ...LAMBEAU_POSTERIEUR }, sectionner: { ...SECTION_ROTATEURS, ...SECTION_CAPSULE_POST } },
    { titre: 'Tête fémorale et luxation', vue: 'opPostProche',
      texte: 'Le lambeau capsulo-musculaire récliné, la tête fémorale est exposée. Elle est luxée par flexion, adduction et rotation interne. Le col est alors dégagé pour la coupe ; le cotyle sera abordé après l’exérèse de la tête.',
      accent: ['FMA24474'], danger: ['sciatique'], masquer: REPERES,
      ecarter: { ...moore(1.3), ...FESSIER_RELEVE, ...LAMBEAU_POSTERIEUR }, sectionner: { ...SECTION_ROTATEURS, ...SECTION_CAPSULE_POST } },
  ] },
  ant: { court: 'Hueter', titre: 'Voie antérieure (Hueter)', fendre: peauFendue(PEAU_HUETER, [0.4, 0.9, 0], 'médiale', 'latérale'), steps: [
    { titre: 'Installation et incision', vue: 'opAnt',
      texte: 'Vue de l’opérateur : décubitus dorsal, sur table orthopédique ou table ordinaire, opérateur du côté opéré, tête du patient à gauche. Repère : l’épine iliaque antéro-supérieure. L’incision débute 2 cm en dehors et 2 cm en dessous d’elle et descend obliquement en bas et en dehors, vers la tête de la fibula, sur le corps du tenseur du fascia lata, sur 8 à 10 cm.',
      montrer: ['incision-ant'], danger: ['nclc'], masquer: REPERES },
    { titre: 'Peau et gaine du tenseur du fascia lata', vue: 'opAnt',
      texte: 'Peau et tissu sous-cutané sont incisés. L’aponévrose est ouverte sur le corps du tenseur du fascia lata, en dehors de l’intervalle : le nerf cutané latéral de la cuisse reste en dedans, sur le sartorius, hors du champ.',
      accent: ['FMA22425'], danger: ['nclc'], masquer: REPERES, ecarter: hueter(0.5) },
    { titre: 'Intervalle tenseur du fascia lata / sartorius', vue: 'opAntProche',
      texte: 'On reste dans la gaine du tenseur : le doigt décolle son bord médial. Le tenseur est récliné en dehors, le sartorius en dedans avec le nerf cutané latéral de la cuisse. Aucun muscle n’est sectionné.',
      accent: ['FMA22425', 'FMA22354'], danger: ['nclc'], masquer: REPERES, ecarter: hueter(1.1) },
    { titre: 'Pédicule circonflexe et droit fémoral', vue: 'opAntProche',
      texte: 'Au fond, le feuillet profond de l’aponévrose est ouvert. Le pédicule circonflexe latéral (branche ascendante) croise le champ : il est lié ou coagulé soigneusement. Un coussin sous le genou détend le droit fémoral : il est décollé de la capsule et récliné en dedans, les moyen et petit fessiers en dehors.',
      accent: ['FMA38928', 'FMA22330', 'FMA22332'], danger: ['circonflexe', 'vcirconflexe'], masquer: REPERES, ecarter: HUETER_PROFOND },
    { titre: 'Capsule antérieure', vue: 'opAntProche',
      texte: 'Deux écarteurs contre-coudés sont passés de part et d’autre du col, au contact de la capsule : l’un au-dessus (fessiers en dehors), l’autre en dessous (droit fémoral et ilio-psoas en dedans). La graisse pré-capsulaire est réséquée : la capsule antérieure est exposée. Le paquet fémoral (nerf, artère, veine, de dehors en dedans) est juste en dedans de l’écarteur médial : sa pointe doit rester au contact de l’os.',
      accent: ['capsule'], danger: ['nfemoral', 'afemorale', 'vfemorale'], masquer: REPERES, ecarter: HUETER_CAPSULE },
    { titre: 'Capsulotomie, col fémoral', vue: 'opAntProche',
      texte: 'Capsulotomie antérieure (en T, en H ou résection) ; les écarteurs sont replacés à l’intérieur de la capsule. Le col et la tête sont exposés. La coupe du col se fait en place, puis la tête est extraite au tire-bouchon avant la préparation du cotyle.',
      accent: ['FMA24474', 'capsule'], danger: ['nfemoral', 'afemorale', 'vfemorale'], masquer: REPERES, ecarter: HUETER_CAPSULE, sectionner: { capsule: { autour: [[-84, -116, 834], [-104, -112, 792]], rayon: 15 } } },
  ] },
  hardinge: { court: 'Hardinge', titre: 'Voie latérale transglutéale (Hardinge)', fendre: peauFendue(PEAU_HARDINGE, [1, 0, 0], 'antérieure', 'postérieure'), steps: [
    { titre: 'Installation et incision', vue: 'opHardinge',
      texte: 'Vue de l’opérateur : décubitus latéral (ou dorsal, fesse au bord de la table), tête du patient à gauche. Incision longitudinale de 10 à 15 cm, dans l’axe du fémur, centrée sur le sommet du grand trochanter, à mi-distance de ses bords antérieur et postérieur.',
      montrer: ['incision-hardinge'], masquer: [...REPERES, 'nclc'] },
    { titre: 'Peau et fascia lata', vue: 'opHardinge',
      texte: 'Peau et tissu sous-cutané sont incisés, puis le fascia lata sur la même ligne ; en haut l’incision se prolonge entre le tenseur du fascia lata, en avant, et le grand fessier, en arrière. La bourse trochantérienne est effondrée : le moyen fessier, son insertion trochantérienne et le vaste latéral apparaissent.',
      accent: ['FMA22330', 'FMA38930'], danger: ['nglutealsup'], masquer: [...REPERES, 'nclc'], ecarter: hardinge(20) },
    { titre: 'Lambeau antérieur', vue: 'opHardingeProche',
      texte: 'Le moyen fessier est fendu dans le sens de ses fibres, à la jonction de son tiers antérieur et de ses deux tiers postérieurs, sans dépasser 3 à 5 cm au-dessus du sommet du trochanter : le nerf glutéal supérieur chemine entre moyen et petit fessier. L’incision contourne la face antérieure du trochanter, en laissant une collerette tendineuse pour la réinsertion, puis se prolonge dans la partie antérieure du vaste latéral. Ce lambeau — moyen fessier antérieur, petit fessier, vaste latéral antérieur — est relevé d’un seul tenant vers l’avant.',
      accent: ['FMA22330', 'FMA22332', 'FMA38930', 'FMA24474'], danger: ['nglutealsup'], masquer: [...REPERES, 'nclc'],
      ecarter: { ...hardinge(40), ...LAMBEAU_ANTERIEUR }, sectionner: DESINSERTION_HARDINGE },
    { titre: 'Capsule antérieure', vue: 'opHardingeProche',
      texte: 'Sous le lambeau, la capsule antérieure est exposée ; des écarteurs contre-coudés sont placés au-dessus et au-dessous du col, au contact de l’os. Capsulotomie en T ou résection : le col et la tête apparaissent. La hanche est luxée en avant par rotation latérale, adduction et flexion ; le pied tombe dans un sac stérile en avant de la table.',
      accent: ['capsule', 'FMA24474'], danger: ['nglutealsup', 'nfemoral', 'afemorale'], masquer: [...REPERES, 'nclc'],
      ecarter: { ...hardinge(46), ...LAMBEAU_ANTERIEUR }, sectionner: { ...DESINSERTION_HARDINGE, ...CAPSULE_ANTERIEURE } },
    { titre: 'Fermeture : réinsertion du lambeau', vue: 'opHardinge',
      texte: 'En fin d’intervention, le lambeau est réinséré solidement sur la collerette tendineuse et, au besoin, par des points transosseux dans le trochanter : de la qualité de cette réinsertion dépend la force des abducteurs (boiterie de Trendelenburg si elle lâche ou si le nerf glutéal supérieur a été étiré). Fermeture du fascia lata, puis des plans superficiels.',
      accent: ['FMA22330', 'FMA22332'], danger: ['nglutealsup'], masquer: [...REPERES, 'nclc'], ecarter: hardinge(20) },
  ] },
  dhs: { court: 'DHS', titre: 'Voie latérale du fémur proximal (DHS)', fendre: peauFendue(PEAU_LATERALE, [1, 0, 0], 'antérieure', 'postérieure'), steps: [
    { titre: 'Installation et incision', vue: 'opLat',
      texte: 'Vue de l’opérateur : décubitus dorsal sur table orthopédique, fracture réduite sous scopie de face et de profil, opérateur en dehors de la cuisse, tête du patient à gauche. Incision longitudinale sur la face latérale de la cuisse, à partir de la crête du vaste latéral vers le bas, dans l’axe du fémur, sur 6 à 10 cm selon la longueur de la plaque.',
      montrer: ['incision-lat'], masquer: [...REPERES] },
    { titre: 'Peau et fascia lata', vue: 'opLat',
      texte: 'Peau et tissu sous-cutané sont incisés, puis le fascia lata dans l’axe de ses fibres, sur la même ligne. Les berges sont tenues par un écarteur autostatique : le vaste latéral apparaît au fond.',
      accent: ['FMA58776', 'FMA38930'], masquer: [...REPERES, 'nclc'], ecarter: lateral(1) },
    { titre: 'Vaste latéral relevé', vue: 'opLatProche',
      texte: 'Le vaste latéral n’est pas traversé : il est désinséré de la cloison intermusculaire latérale, d’arrière en avant, avec une contre-incision en L sous le tubercule du vaste. Un écarteur de Hohmann passé sur le bord antérieur du fémur le relève en avant. Les artères perforantes traversent la cloison : elles sont repérées puis liées ou coagulées.',
      accent: ['FMA24474', 'FMA38930'], danger: ['perforantes'], masquer: [...REPERES, 'nclc'], ecarter: { ...lateral(1.2), ...VASTE_RELEVE } },
    { titre: 'Broche-guide', vue: 'opLatProche',
      texte: 'La corticale latérale sous-trochantérienne est exposée. Le viseur d’angle (135° le plus souvent) se pose sur elle, environ 2 cm sous le tubercule du vaste : la broche-guide vise le centre de la tête de face comme de profil, jusqu’à l’os sous-chondral. Le fémur est ici translucide pour montrer l’axe de la vis.',
      accent: ['axe-vis'], voiler: ['FMA24474'], danger: ['perforantes'], montrer: ['axe-vis'], masquer: ['axe-clou', 'nclc'], ecarter: { ...lateral(1.2), ...VASTE_RELEVE } },
    { titre: 'Vis cervicale et plaque', vue: 'opLatProche',
      texte: 'Mesure, alésage à la mèche triple, taraudage si l’os est dur, puis vis cervicale au centre de la tête (distance pointe-apex inférieure à 25 mm). La plaque-canon est glissée sur la vis, plaquée sur la diaphyse et fixée par des vis corticales. Le vaste latéral retombe sur la plaque ; fermeture du fascia lata.',
      voiler: ['FMA24474'], danger: ['perforantes'], montrer: ['dhs'], masquer: [...REPERES, 'nclc'], ecarter: { ...lateral(1.2), ...VASTE_RELEVE } },
  ] },
  clou: { court: 'Clou gamma', titre: 'Abord du grand trochanter (clou gamma)', fendre: peauFendue(PEAU_CLOU, [1, 0, 0], 'postérieure', 'antérieure'), steps: [
    { titre: 'Installation et incision', vue: 'opTroch',
      texte: 'Vue de l’opérateur : table orthopédique, fracture réduite sous scopie, membre en adduction et tronc incliné du côté opposé pour dégager le sommet du trochanter. Incision de 3 à 5 cm, quelques centimètres au-dessus du sommet du grand trochanter, dans le prolongement de l’axe du fémur.',
      montrer: ['incision-clou'], masquer: REPERES },
    { titre: 'Peau, fascia et moyen fessier', vue: 'opTrochProche',
      texte: 'Sur la même ligne : peau, tissu sous-cutané, puis fascia. Les fibres du moyen fessier sont dissociées dans leur sens, au doigt, jusqu’à palper le sommet du grand trochanter. Le nerf glutéal supérieur chemine entre moyen et petit fessier, environ 5 cm au-dessus du sommet : ne pas prolonger la dissociation vers le haut.',
      accent: ['FMA22330'], danger: ['nglutealsup'], masquer: REPERES, ecarter: TROCHANTER_OUVERT },
    { titre: 'Point d’entrée et broche-guide', vue: 'opTrochProche',
      texte: 'Le point d’entrée est au sommet du grand trochanter de face, à la jonction de son tiers antérieur et de ses deux tiers postérieurs de profil, dans l’axe du canal médullaire. Pointe carrée ou broche-guide, puis alésage de l’entrée. Peau et muscles sont ici retirés et le fémur translucide pour montrer l’axe.',
      accent: ['axe-clou'], voiler: ['FMA24474'], estomper: ['FMA38930', 'FMA38934', 'FMA58776', 'FMA22328'], danger: ['nglutealsup'], montrer: ['axe-clou'], masquer: ['axe-vis', ...PEAU], ecarter: TROCHANTER_OUVERT },
    { titre: 'Clou, vis cervicale et verrouillage', vue: 'lat',
      texte: 'Le clou est descendu à la main, sans marteau, jusqu’à ce que l’orifice cervical soit en regard du col. À travers le viseur, par une courte incision latérale : broche puis vis cervicale au centre de la tête, de face comme de profil (distance pointe-apex inférieure à 25 mm). Verrouillage distal par le viseur, puis vis de blocage proximale.',
      voiler: ['FMA24474'], estomper: ['FMA38930', 'FMA38934', 'FMA58776', 'FMA22328', 'FMA22330', 'FMA22332', 'FMA22425'], montrer: ['gamma'], masquer: [...REPERES, ...PEAU], ecarter: TROCHANTER_OUVERT },
  ] },
};

export default { nom: 'Hanche droite', dossier: 'models-hd', graisse: 9, fascias: ['FMA58776', 'FMA21964'], centre, vues, meshes, fendre, tubes, rubans, groupes, voies };
