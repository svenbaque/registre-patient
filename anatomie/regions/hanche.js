// Hanche droite — données de la région pour le visualiseur.
// Repère BodyParts3D, en millimètres : x = droite (-) / gauche (+), y = avant (-) / arrière (+), z = vers le haut.

// Pièces du modèle libre : [fichier, nom, groupe, couleur]
const meshes = [
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
  ['FMA21964', 'Ligament inguinal', 'divers', '#dfe6ec'],
  ['FMA18806', 'Artère iliaque externe', 'vaisseaux', '#e0392b'],
  ['FMA18885', 'Veine iliaque externe', 'vaisseaux', '#3b6fd1'],
];

// Muscles fendus à l'ouverture, pour pouvoir écarter leurs deux berges : [pièce, point du plan, normale, nom côté normale (/A), nom autre côté (/B)]
const fendre = [
  ['FMA58776', [-150, -88, 780], [0, 1, 0], 'Fascia lata — berge postérieure', 'Fascia lata — berge antérieure'],
  ['FMA22328', [-120, -50, 850], [-0.564, -0.423, 0.709], 'Grand fessier — fibres supérieures', 'Grand fessier — fibres inférieures'],
  ['FMA22330', [-127, -77, 840], [0, 1, 0], 'Moyen fessier — fibres postérieures', 'Moyen fessier — fibres antérieures'],
];

// Structures absentes du modèle libre, tracées à la main d'après les repères osseux : [id, nom, groupe, couleur, rayon, points]
const tubes = [
  ['sciatique', 'Nerf sciatique (schématique)', 'nerfs', '#f3d98b', 6, { fin: 0.85 },
    [[-44, -36, 866], [-56, -36, 836], [-70, -37, 810], [-77, -46, 780], [-82, -54, 730], [-86, -60, 640], [-84, -62, 500]]],
  ['nclc', 'Nerf cutané latéral de la cuisse (schématique)', 'nerfs', '#f3d98b', 2, { fin: 0.55 },
    [[-98, -118, 930], [-106, -148, 899], [-108, -156, 872], [-116, -156, 835], [-127, -152, 790], [-134, -148, 700]]],
  ['nclc/b1', 'Nerf cutané latéral de la cuisse — rameau postérieur (schématique)', 'nerfs', '#f3d98b', 1.3, { fin: 0.4 },
    [[-124, -153, 800], [-136, -147, 772], [-146, -138, 742], [-151, -128, 705]]],
  ['nfemoral', 'Nerf fémoral (schématique)', 'nerfs', '#f3d98b', 3.6, { fin: 0.6 },
    [[-62, -128, 905], [-63, -152, 850], [-65, -158, 822], [-66, -156, 800]]],
  ['nfemoral/b1', 'Nerf fémoral — branches musculaires (schématique)', 'nerfs', '#f3d98b', 1.7, { fin: 0.4 },
    [[-66, -157, 806], [-74, -154, 780], [-84, -148, 752], [-92, -142, 722]]],
  ['nfemoral/b2', 'Nerf fémoral — branches musculaires (schématique)', 'nerfs', '#f3d98b', 1.7, { fin: 0.4 },
    [[-66, -157, 806], [-69, -155, 776], [-72, -150, 744], [-74, -146, 712]]],
  ['nfemoral/b3', 'Nerf saphène (schématique)', 'nerfs', '#f3d98b', 1.5, { fin: 0.5 },
    [[-65, -157, 806], [-62, -156, 776], [-60, -148, 740], [-59, -140, 700], [-57, -128, 640]]],
  ['nglutealsup', 'Nerf glutéal supérieur (schématique)', 'nerfs', '#f3d98b', 2, { fin: 0.5 },
    [[-62, -46, 872], [-90, -58, 874], [-115, -78, 870], [-134, -104, 864]]],
  ['afemorale', 'Artère fémorale (schématique)', 'vaisseaux', '#c8102e', 4.4, { fin: 0.85 },
    [[-49, -158, 830], [-52, -159, 805], [-56, -152, 765], [-58, -141, 700], [-55, -126, 620]]],
  ['afemorale/prof', 'Artère fémorale profonde (schématique)', 'vaisseaux', '#c8102e', 3, { fin: 0.6 },
    [[-53, -157, 790], [-60, -148, 770], [-66, -134, 740], [-72, -118, 700], [-76, -104, 650]]],
  ['vfemorale', 'Veine fémorale (schématique)', 'vaisseaux', '#2f4f9e', 5.2, { fin: 0.9 },
    [[-42, -149, 830], [-43, -151, 805], [-47, -146, 765], [-50, -136, 700], [-48, -122, 620]]],
  ['circonflexe', 'Branche ascendante de la circonflexe latérale (schématique)', 'vaisseaux', '#e0392b', 2.1, { fin: 0.5 },
    [[-60, -148, 770], [-70, -128, 782], [-86, -108, 792], [-108, -104, 806], [-124, -108, 826]]],
  ['perforante1', 'Artère perforante (schématique)', 'vaisseaux', '#e0392b', 1.8, { fin: 0.5 },
    [[-78, -74, 712], [-98, -64, 708], [-118, -66, 706], [-134, -80, 704]]],
  ['perforante2', 'Artère perforante (schématique)', 'vaisseaux', '#e0392b', 1.8, { fin: 0.5 },
    [[-76, -76, 652], [-94, -66, 648], [-112, -68, 646], [-128, -82, 644]]],
  ['incision-post', 'Incision — voie postérieure', 'incisions', '#35e0c8', 1.4, {},
    [[-151, -74, 712], [-153, -76, 760], [-152, -74, 800], [-143, -52, 838], [-125, -24, 872], [-104, -4, 898]]],
  ['incision-ant', 'Incision — voie antérieure', 'incisions', '#35e0c8', 1.4, {},
    [[-127, -152, 882], [-132, -151, 850], [-137, -148, 815], [-141, -143, 782]]],
  ['incision-lat', 'Incision — voie latérale du fémur proximal', 'incisions', '#35e0c8', 1.4, {},
    [[-158, -84, 806], [-161, -88, 760], [-161, -92, 710], [-158, -96, 660]]],
  ['incision-clou', 'Incision — abord du grand trochanter', 'incisions', '#35e0c8', 1.4, {},
    [[-151, -76, 846], [-149, -72, 872], [-145, -68, 898]]],
  ['axe-clou', 'Axe du clou (schématique)', 'reperes', '#7df9ff', 2.2, {},
    [[-140, -68, 900], [-127, -77, 822], [-114, -88, 730], [-103, -93, 640], [-97, -94, 580]]],
  ['axe-vis', 'Axe de la vis cervicale (schématique)', 'reperes', '#7df9ff', 2.2, {},
    [[-150, -86, 765], [-128, -88, 780], [-98, -90, 800], [-70, -92, 819]]],
].map(([id, nom, groupe, couleur, rayon, options, points]) => [id, nom, groupe, couleur, rayon, points, options]);

// Écarteurs : lames d'acier posées au bord de la plaie. « fond » = vers la profondeur, « vers » = sens de la traction.
const N = [-0.564, -0.423, 0.709]; // perpendiculaire à la ligne de dissociation du grand fessier
const DEDANS = [0.6, -0.8, 0];     // de la fesse vers la profondeur
const ecarteurs = [
  ['ec-post-sup', 'Écarteur — berge supérieure', { en: [-152, -66, 862], fond: DEDANS, vers: N, profondeur: 40, manche: 62, largeur: 15 }],
  ['ec-post-inf', 'Écarteur — berge inférieure', { en: [-106, -27, 806], fond: DEDANS, vers: [0.564, 0.423, -0.709], profondeur: 40, manche: 62, largeur: 15 }],
  ['ec-ant-lat', 'Écarteur — tenseur du fascia lata', { en: [-142, -137, 842], fond: [0, 1, 0], vers: [-1, -0.15, 0], profondeur: 32, manche: 58, largeur: 14 }],
  ['ec-ant-med', 'Écarteur — sartorius et droit fémoral', { en: [-86, -142, 842], fond: [0, 1, 0], vers: [1, -0.15, 0], profondeur: 32, manche: 58, largeur: 14 }],
  ['ec-col-med', 'Écarteur de Hohmann — bord médial du col', { en: [-74, -112, 818], fond: [0.15, 1, 0], vers: [1, -0.35, -0.1], profondeur: 24, manche: 75, largeur: 9 }],
  ['ec-col-lat', 'Écarteur de Hohmann — bord latéral du col', { en: [-122, -104, 834], fond: [-0.1, 1, 0], vers: [-1, -0.35, 0.2], profondeur: 24, manche: 75, largeur: 9 }],
  ['ec-dhs-ant', 'Écarteur de Hohmann — antérieur', { en: [-136, -112, 735], fond: [1, 0.25, 0], vers: [-0.2, -1, 0], profondeur: 28, manche: 72, largeur: 10 }],
  ['ec-dhs-post', 'Écarteur de Hohmann — postérieur', { en: [-136, -66, 735], fond: [1, -0.25, 0], vers: [-0.2, 1, 0], profondeur: 28, manche: 72, largeur: 10 }],
];

// Capsule articulaire schématique : manchon entre le pourtour du cotyle et la base du col. [id, nom, de, à, rayon côté « à », rayon côté « de »]
const manchons = [['capsule', 'Capsule articulaire (schématique)', [-62, -93, 823], [-106, -86, 806], 25, 31]];

const groupes = [
  ['os', 'Os'], ['fessiers', 'Fessiers et fascia lata'], ['rotateurs', 'Pelvi-trochantériens'], ['anterieurs', 'Loge antérieure et ilio-psoas'],
  ['mediaux', 'Adducteurs'], ['posterieurs', 'Ischio-jambiers'], ['divers', 'Ligament et capsule'], ['vaisseaux', 'Vaisseaux'], ['nerfs', 'Nerfs'],
  ['incisions', 'Incisions'], ['reperes', 'Repères d’ostéosynthèse'], ['ecarteurs', 'Écarteurs'],
];

const ROTATEURS = ['FMA22340', 'FMA22334', 'FMA22324', 'FMA22336'];
const REPERES = ['axe-clou', 'axe-vis'];
const centre = [-92, -85, 825]; // articulation de la hanche droite
const DIAPHYSE = [-112, -88, 745]; // cible des vues latérales : région trochantérienne et sous-trochantérienne

// Points de vue : décalage de la caméra par rapport à la cible (le centre, sauf cible précisée).
const vues = {
  post: { de: [-230, 400, 110] }, postProche: { de: [-225, 320, -10] },
  ant: { de: [-150, -430, 70] }, antProche: { de: [-120, -330, 10] },
  lat: { de: [-520, -60, 40], cible: DIAPHYSE }, latProche: { de: [-400, -90, 20], cible: DIAPHYSE },
  trochanter: { de: [-380, 60, 190], cible: [-120, -80, 835] },
  libre: { de: [-380, -260, 120] },
};

// Écartements : traction locale autour de l'écarteur. Les sommets proches du point (ou du segment) « autour » suivent la lame,
// l'effet s'éteint avec la distance (rayon) : le muscle garde ses attaches et se courbe.
const LIGNE_FESSIER = [[-150, -72, 795], [-112, -22, 880]];   // ligne de dissociation des fibres du grand fessier
const LIGNE_FASCIA = [[-153, -78, 690], [-150, -72, 812]];    // incision du fascia lata, en regard du trochanter
const fessier = k => ({
  'FMA22328/A': { dep: [-26 * k, -19 * k, 33 * k], autour: LIGNE_FESSIER, rayon: 72 },
  'FMA22328/B': { dep: [29 * k, 22 * k, -37 * k], autour: LIGNE_FESSIER, rayon: 80 },
  'FMA58776/A': { dep: [29 * k, 22 * k, -37 * k], autour: LIGNE_FESSIER, rayon: 80 }, // la berge postérieure du fascia suit les fibres inférieures
  'FMA58776/B': { dep: [-10 * k, -34 * k, 0], autour: LIGNE_FASCIA, rayon: 70 },
});
const FESSIER_OUVERT = fessier(1);
// pelvi-trochantériens sectionnés au trochanter : leur extrémité latérale se rabat en arrière et en dedans, l'origine pelvienne ne bouge pas
const ROTATEURS_RABATTUS = Object.fromEntries(ROTATEURS.map(id => [id, { dep: [40, 30, 0], autour: [-128, -76, 815], rayon: 44 }]));
const FESSIERS_RELEVES = { FMA22330: { dep: [-6, -14, 18], autour: [-125, -80, 832], rayon: 52 }, FMA22332: { dep: [-6, -14, 18], autour: [-125, -80, 832], rayon: 52 } };
const EC_POST = ['ec-post-sup', 'ec-post-inf'];

const TFL_DEHORS = { dep: [-28, 2, 0], autour: [[-128, -140, 880], [-135, -128, 790]], rayon: 55 };
const HUETER_SUPERFICIEL = {
  FMA22425: TFL_DEHORS, FMA58776: { dep: [-24, 2, 0], autour: [[-135, -125, 880], [-140, -118, 790]], rayon: 60 },
  FMA22354: { dep: [26, -2, 0], autour: [[-112, -150, 880], [-100, -145, 800]], rayon: 55 },
  nclc: { dep: [24, -2, 0], autour: [[-112, -152, 880], [-112, -152, 800]], rayon: 60 },
};
const HUETER_PROFOND = {
  ...HUETER_SUPERFICIEL,
  FMA38928: { dep: [24, -2, 0], autour: [[-105, -112, 860], [-110, -120, 790]], rayon: 50 },
  FMA22330: { dep: [-18, 8, 4], autour: [-125, -105, 845], rayon: 50 }, FMA22332: { dep: [-18, 8, 4], autour: [-125, -105, 845], rayon: 50 },
};
const PSOAS_DEDANS = { FMA22322: { dep: [18, -2, 0], autour: [-85, -112, 812], rayon: 46 }, FMA22342: { dep: [18, -2, 0], autour: [-85, -112, 812], rayon: 46 } };
const EC_ANT = ['ec-ant-lat', 'ec-ant-med'];
const EC_COL = ['ec-col-med', 'ec-col-lat'];

const LIGNE_LATERALE = [[-158, -88, 805], [-158, -94, 655]];
const FASCIA_OUVERT = { 'FMA58776/A': { dep: [-4, 32, 0], autour: LIGNE_LATERALE, rayon: 62 }, 'FMA58776/B': { dep: [-4, -32, 0], autour: LIGNE_LATERALE, rayon: 62 } };
const VASTE_EN_AVANT = { FMA38930: { dep: [-6, -40, 0], autour: [[-150, -78, 790], [-140, -84, 650]], rayon: 56 } };
const EC_DHS = ['ec-dhs-ant', 'ec-dhs-post'];
const TROCHANTER_OUVERT = k => ({
  'FMA58776/A': { dep: [0, 28 * k, 0], autour: [-150, -80, 862], rayon: 55 }, 'FMA58776/B': { dep: [0, -28 * k, 0], autour: [-150, -80, 862], rayon: 55 },
  'FMA22328/A': { dep: [8 * k, 24 * k, 12 * k], autour: [-145, -72, 872], rayon: 55 },
  'FMA22330/A': { dep: [0, 22 * k, 0], autour: [-128, -77, 852], rayon: 40 }, 'FMA22330/B': { dep: [0, -22 * k, 0], autour: [-128, -77, 852], rayon: 40 },
});

const voies = {
  post: { court: 'Moore', titre: 'Voie postérieure (Moore)', steps: [
    { titre: 'Repères et incision', vue: 'post',
      texte: 'Patient en décubitus latéral strict. L’incision est centrée sur le bord postérieur du grand trochanter : elle descend dans l’axe du fémur et s’incurve en haut et en arrière, en direction de l’épine iliaque postéro-supérieure.',
      montrer: ['incision-post'], accent: ['FMA22328', 'FMA58776'], masquer: REPERES },
    { titre: 'Fascia lata et grand fessier', vue: 'post',
      texte: 'Le fascia lata est incisé dans l’axe de l’incision cutanée, puis les fibres du grand fessier sont dissociées dans leur sens. Les deux berges commencent à s’écarter.',
      accent: ['FMA22328', 'FMA58776'], masquer: REPERES, ecarter: fessier(0.3) },
    { titre: 'Pelvi-trochantériens et nerf sciatique', vue: 'postProche',
      texte: 'Écarteur de Charnley en place : les berges du grand fessier et du fascia lata sont écartées. Membre en rotation interne pour tendre les rotateurs. De haut en bas : piriforme, jumeau supérieur, obturateur interne, jumeau inférieur, carré fémoral. Le nerf sciatique sort sous le piriforme et descend en arrière d’eux : le repérer et le protéger.',
      accent: [...ROTATEURS, 'FMA22338'], danger: ['sciatique'], montrer: EC_POST, masquer: REPERES, ecarter: FESSIER_OUVERT },
    { titre: 'Section des pelvi-trochantériens', vue: 'postProche',
      texte: 'Piriforme, jumeaux et obturateur interne sont sectionnés au ras de leur insertion trochantérienne, mis sur fils et rabattus en arrière et en dedans : ils recouvrent et protègent le nerf sciatique. Le carré fémoral est respecté ou partiellement désinséré. La capsule postérieure apparaît.',
      accent: ['capsule'], danger: ['sciatique'], montrer: EC_POST, masquer: REPERES, ecarter: { ...FESSIER_OUVERT, ...ROTATEURS_RABATTUS } },
    { titre: 'Capsulotomie et luxation', vue: 'postProche',
      texte: 'Capsulotomie postérieure, puis luxation de la tête par flexion, adduction et rotation interne. Le col est exposé pour la coupe ; le cotyle sera abordé après l’exérèse de la tête.',
      accent: ['FMA24474'], danger: ['sciatique'], estomper: ['capsule'], montrer: EC_POST, masquer: REPERES,
      ecarter: { ...FESSIER_OUVERT, ...ROTATEURS_RABATTUS, ...FESSIERS_RELEVES } },
  ] },
  ant: { court: 'Hueter', titre: 'Voie antérieure (Hueter)', steps: [
    { titre: 'Repères et incision', vue: 'ant',
      texte: 'Patient en décubitus dorsal. Repère : l’épine iliaque antéro-supérieure. L’incision débute environ 2 cm en dehors et en dessous d’elle et descend obliquement en bas et en dehors sur le corps du tenseur du fascia lata, sur 8 à 10 cm.',
      montrer: ['incision-ant'], accent: ['FMA22425'], danger: ['nclc'], masquer: REPERES },
    { titre: 'Intervalle superficiel : tenseur du fascia lata / sartorius', vue: 'antProche',
      texte: 'On ouvre la gaine du tenseur du fascia lata et on reste à l’intérieur : le tenseur est écarté en dehors, le sartorius en dedans. Le nerf cutané latéral de la cuisse chemine en dedans, sur le sartorius : rester dans la gaine le protège.',
      accent: ['FMA22425', 'FMA22354'], danger: ['nclc'], montrer: EC_ANT, masquer: REPERES, ecarter: HUETER_SUPERFICIEL },
    { titre: 'Plan profond : droit fémoral / moyen fessier', vue: 'antProche',
      texte: 'Au fond de l’intervalle : le droit fémoral, écarté en dedans, et les moyen et petit fessiers, écartés en dehors. La branche ascendante de l’artère circonflexe latérale croise le champ : elle est repérée puis liée ou coagulée.',
      accent: ['FMA38928', 'FMA22330', 'FMA22332'], danger: ['circonflexe'], montrer: EC_ANT, masquer: REPERES, ecarter: HUETER_PROFOND },
    { titre: 'Capsule antérieure', vue: 'antProche',
      texte: 'Un écarteur récline l’ilio-psoas en dedans, au contact du col : la capsule antérieure est exposée. Le paquet fémoral (nerf, artère, veine, de dehors en dedans) est juste en dedans : les écarteurs restent au contact de l’os.',
      accent: ['capsule'], danger: ['nfemoral', 'afemorale', 'vfemorale'], montrer: [...EC_ANT, ...EC_COL], masquer: [...REPERES, 'circonflexe'],
      ecarter: { ...HUETER_PROFOND, ...PSOAS_DEDANS } },
    { titre: 'Capsulotomie et exposition du col', vue: 'antProche',
      texte: 'Capsulotomie antérieure : le col et la tête sont exposés. La coupe du col se fait en place, puis la tête est extraite avant la préparation du cotyle.',
      accent: ['FMA24474'], danger: ['nfemoral', 'afemorale', 'vfemorale'], estomper: ['capsule'], montrer: [...EC_ANT, ...EC_COL], masquer: [...REPERES, 'circonflexe'],
      ecarter: { ...HUETER_PROFOND, ...PSOAS_DEDANS } },
  ] },
  dhs: { court: 'DHS', titre: 'Voie latérale du fémur proximal (DHS)', steps: [
    { titre: 'Repères et incision', vue: 'lat',
      texte: 'Patient sur table orthopédique, fracture réduite. Incision longitudinale sur la face latérale de la cuisse, depuis le grand trochanter vers le bas, dans l’axe du fémur, sur 8 à 12 cm selon la longueur de plaque.',
      montrer: ['incision-lat'], accent: ['FMA58776'], masquer: REPERES },
    { titre: 'Fascia lata', vue: 'lat',
      texte: 'Le fascia lata est incisé dans l’axe de ses fibres, dans l’axe de l’incision cutanée. Ses deux berges sont écartées : le vaste latéral apparaît.',
      accent: ['FMA58776', 'FMA38930'], masquer: REPERES, ecarter: FASCIA_OUVERT },
    { titre: 'Vaste latéral', vue: 'latProche',
      texte: 'Le vaste latéral est désinséré de la cloison intermusculaire latérale et récliné en avant, avec une contre-incision en L sous le tubercule du vaste. Les artères perforantes traversent la cloison : elles sont repérées et liées ou coagulées.',
      accent: ['FMA38930'], danger: ['perforante1', 'perforante2'], montrer: EC_DHS, masquer: REPERES,
      ecarter: { ...FASCIA_OUVERT, ...VASTE_EN_AVANT } },
    { titre: 'Face latérale du fémur', vue: 'latProche',
      texte: 'La corticale latérale sous-trochantérienne est exposée, tenue par des écarteurs de Hohmann. Le viseur d’angle se pose sous le grand trochanter : la broche-guide vise le centre de la tête, de face comme de profil.',
      accent: ['axe-vis'], voiler: ['FMA24474'], danger: ['perforante1', 'perforante2'], montrer: ['axe-vis', ...EC_DHS], masquer: ['axe-clou'],
      ecarter: { ...FASCIA_OUVERT, ...VASTE_EN_AVANT, FMA38934: { dep: [0, -14, 0], autour: [-128, -92, 735], rayon: 50 } } },
  ] },
  clou: { court: 'Clou gamma', titre: 'Abord du grand trochanter (clou gamma)', steps: [
    { titre: 'Repères et incision', vue: 'trochanter',
      texte: 'Patient sur table orthopédique, tronc incliné du côté opposé, fracture réduite. Incision de 3 à 5 cm, quelques centimètres au-dessus du sommet du grand trochanter, dans le prolongement de l’axe du fémur.',
      montrer: ['incision-clou'], accent: ['FMA58776', 'FMA22328'], masquer: REPERES },
    { titre: 'Fascia et moyen fessier', vue: 'trochanter',
      texte: 'Le fascia est incisé dans l’axe de l’incision, puis les fibres du moyen fessier sont dissociées dans leur sens, au doigt, jusqu’à palper le sommet du grand trochanter. Le nerf glutéal supérieur chemine entre moyen et petit fessier, environ 5 cm au-dessus du sommet : ne pas prolonger la dissociation vers le haut.',
      accent: ['FMA22330'], danger: ['nglutealsup'], masquer: REPERES,
      ecarter: TROCHANTER_OUVERT(0.85) },
    { titre: 'Point d’entrée et axe du clou', vue: 'trochanter',
      texte: 'Le point d’entrée est au sommet du grand trochanter de face, dans l’axe du canal médullaire de profil. La broche-guide puis le clou suivent l’axe du canal ; la vis cervicale vise le centre de la tête.',
      accent: ['axe-clou', 'axe-vis'], voiler: ['FMA24474'], danger: ['nglutealsup'], montrer: REPERES, estomper: ['FMA38930', 'FMA38934'],
      ecarter: TROCHANTER_OUVERT(1) },
  ] },
};

export default { nom: 'Hanche droite', dossier: 'models-hd', fascias: ['FMA58776', 'FMA21964'], centre, vues, meshes, fendre, tubes, manchons, ecarteurs, groupes, voies };
