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
  ['sciatique', 'Nerf sciatique (schématique)', 'nerfs', '#ffd23f', 5,
    [[-44, -36, 866], [-56, -36, 836], [-70, -37, 810], [-77, -46, 780], [-82, -54, 730], [-86, -60, 640], [-84, -62, 500]]],
  ['nclc', 'Nerf cutané latéral de la cuisse (schématique)', 'nerfs', '#ffd23f', 1.8,
    [[-98, -118, 930], [-106, -148, 899], [-108, -156, 872], [-116, -156, 835], [-127, -152, 790], [-134, -148, 700]]],
  ['nfemoral', 'Nerf fémoral (schématique)', 'nerfs', '#ffd23f', 3.2,
    [[-62, -128, 905], [-63, -152, 850], [-65, -158, 822], [-67, -154, 790], [-70, -148, 765]]],
  ['nglutealsup', 'Nerf glutéal supérieur (schématique)', 'nerfs', '#ffd23f', 1.8,
    [[-62, -46, 872], [-90, -58, 874], [-115, -78, 870], [-134, -104, 864]]],
  ['afemorale', 'Artère fémorale (schématique)', 'vaisseaux', '#e0392b', 4,
    [[-49, -158, 830], [-52, -159, 805], [-56, -152, 765], [-58, -141, 700], [-55, -126, 620]]],
  ['vfemorale', 'Veine fémorale (schématique)', 'vaisseaux', '#3b6fd1', 4.5,
    [[-42, -149, 830], [-43, -151, 805], [-47, -146, 765], [-50, -136, 700], [-48, -122, 620]]],
  ['circonflexe', 'Branche ascendante de la circonflexe latérale (schématique)', 'vaisseaux', '#ff5a4d', 1.8,
    [[-57, -150, 772], [-68, -128, 782], [-86, -108, 792], [-108, -104, 806], [-124, -108, 826]]],
  ['perforante1', 'Artère perforante (schématique)', 'vaisseaux', '#ff5a4d', 1.6,
    [[-78, -74, 712], [-98, -64, 708], [-118, -66, 706], [-134, -80, 704]]],
  ['perforante2', 'Artère perforante (schématique)', 'vaisseaux', '#ff5a4d', 1.6,
    [[-76, -76, 652], [-94, -66, 648], [-112, -68, 646], [-128, -82, 644]]],
  ['incision-post', 'Incision — voie postérieure', 'incisions', '#35e0c8', 1.6,
    [[-151, -74, 712], [-153, -76, 760], [-152, -74, 800], [-143, -52, 838], [-125, -24, 872], [-104, -4, 898]]],
  ['incision-ant', 'Incision — voie antérieure', 'incisions', '#35e0c8', 1.6,
    [[-127, -152, 882], [-132, -151, 850], [-137, -148, 815], [-141, -143, 782]]],
  ['incision-lat', 'Incision — voie latérale du fémur proximal', 'incisions', '#35e0c8', 1.6,
    [[-158, -84, 806], [-161, -88, 760], [-161, -92, 710], [-158, -96, 660]]],
  ['incision-clou', 'Incision — abord du grand trochanter', 'incisions', '#35e0c8', 1.6,
    [[-151, -76, 846], [-149, -72, 872], [-145, -68, 898]]],
  ['axe-clou', 'Axe du clou (schématique)', 'reperes', '#7df9ff', 2.2,
    [[-140, -68, 900], [-127, -77, 822], [-114, -88, 730], [-103, -93, 640], [-97, -94, 580]]],
  ['axe-vis', 'Axe de la vis cervicale (schématique)', 'reperes', '#7df9ff', 2.2,
    [[-150, -86, 765], [-128, -88, 780], [-98, -90, 800], [-70, -92, 819]]],
];

// Capsule articulaire schématique : manchon entre le pourtour du cotyle et la base du col. [id, nom, de, à, rayon côté « à », rayon côté « de »]
const manchons = [['capsule', 'Capsule articulaire (schématique)', [-62, -93, 823], [-106, -86, 806], 25, 31]];

const groupes = [
  ['os', 'Os'], ['fessiers', 'Fessiers et fascia lata'], ['rotateurs', 'Pelvi-trochantériens'], ['anterieurs', 'Loge antérieure et ilio-psoas'],
  ['mediaux', 'Adducteurs'], ['posterieurs', 'Ischio-jambiers'], ['divers', 'Ligament et capsule'], ['vaisseaux', 'Vaisseaux'], ['nerfs', 'Nerfs'],
  ['incisions', 'Incisions'], ['reperes', 'Repères d’ostéosynthèse'],
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

// Glissements communs : ce qu'on écarte et dans quel sens (dx, dy, dz en mm).
// (le grand fessier s'ouvre perpendiculairement à la ligne de dissociation de ses fibres ; la berge postérieure du fascia suit ses fibres inférieures)
const FESSIER_OUVERT = { 'FMA22328/A': [-31, -23, 39], 'FMA22328/B': [39, 30, -50], 'FMA58776/A': [34, 26, -14], 'FMA58776/B': [-10, -32, 0] };
const ROTATEURS_RABATTUS = Object.fromEntries(ROTATEURS.map(id => [id, [34, 22, 0]]));
const HUETER_SUPERFICIEL = { FMA22425: [-26, 6, 0], FMA58776: [-26, 6, 0], FMA22354: [26, -4, 0] };
const HUETER_PROFOND = { ...HUETER_SUPERFICIEL, FMA38928: [24, -4, 0], FMA22330: [-16, 10, 6], FMA22332: [-16, 10, 6] };
const FASCIA_OUVERT = { 'FMA58776/A': [-4, 30, 0], 'FMA58776/B': [-4, -30, 0] };

const voies = {
  post: { court: 'Moore', titre: 'Voie postérieure (Moore)', steps: [
    { titre: 'Repères et incision', vue: 'post',
      texte: 'Patient en décubitus latéral strict. L’incision est centrée sur le bord postérieur du grand trochanter : elle descend dans l’axe du fémur et s’incurve en haut et en arrière, en direction de l’épine iliaque postéro-supérieure.',
      montrer: ['incision-post'], accent: ['FMA22328', 'FMA58776'], masquer: REPERES },
    { titre: 'Fascia lata et grand fessier', vue: 'post',
      texte: 'Le fascia lata est incisé dans l’axe de l’incision cutanée, puis les fibres du grand fessier sont dissociées dans leur sens. Les deux berges commencent à s’écarter.',
      accent: ['FMA22328', 'FMA58776'], masquer: REPERES,
      ecarter: { 'FMA22328/A': [-7, -5, 9], 'FMA22328/B': [9, 7, -11], 'FMA58776/A': [8, 6, -3], 'FMA58776/B': [-3, -10, 0] } },
    { titre: 'Pelvi-trochantériens et nerf sciatique', vue: 'postProche',
      texte: 'Écarteur de Charnley en place : les berges du grand fessier et du fascia lata sont écartées. Membre en rotation interne pour tendre les rotateurs. De haut en bas : piriforme, jumeau supérieur, obturateur interne, jumeau inférieur, carré fémoral. Le nerf sciatique sort sous le piriforme et descend en arrière d’eux : le repérer et le protéger.',
      accent: [...ROTATEURS, 'FMA22338'], danger: ['sciatique'], masquer: REPERES, ecarter: FESSIER_OUVERT },
    { titre: 'Section des pelvi-trochantériens', vue: 'postProche',
      texte: 'Piriforme, jumeaux et obturateur interne sont sectionnés au ras de leur insertion trochantérienne, mis sur fils et rabattus en arrière et en dedans : ils recouvrent et protègent le nerf sciatique. Le carré fémoral est respecté ou partiellement désinséré. La capsule postérieure apparaît.',
      accent: ['capsule'], danger: ['sciatique'], masquer: REPERES, ecarter: { ...FESSIER_OUVERT, ...ROTATEURS_RABATTUS } },
    { titre: 'Capsulotomie et luxation', vue: 'postProche',
      texte: 'Capsulotomie postérieure, puis luxation de la tête par flexion, adduction et rotation interne. Le col est exposé pour la coupe ; le cotyle sera abordé après l’exérèse de la tête.',
      accent: ['FMA24474'], danger: ['sciatique'], estomper: ['capsule'], masquer: REPERES,
      ecarter: { ...FESSIER_OUVERT, ...ROTATEURS_RABATTUS, FMA22330: [-6, -16, 16], FMA22332: [-6, -16, 16] } },
  ] },
  ant: { court: 'Hueter', titre: 'Voie antérieure (Hueter)', steps: [
    { titre: 'Repères et incision', vue: 'ant',
      texte: 'Patient en décubitus dorsal. Repère : l’épine iliaque antéro-supérieure. L’incision débute environ 2 cm en dehors et en dessous d’elle et descend obliquement en bas et en dehors sur le corps du tenseur du fascia lata, sur 8 à 10 cm.',
      montrer: ['incision-ant'], accent: ['FMA22425'], danger: ['nclc'], masquer: REPERES },
    { titre: 'Intervalle superficiel : tenseur du fascia lata / sartorius', vue: 'antProche',
      texte: 'On ouvre la gaine du tenseur du fascia lata et on reste à l’intérieur : le tenseur est écarté en dehors, le sartorius en dedans. Le nerf cutané latéral de la cuisse chemine en dedans, sur le sartorius : rester dans la gaine le protège.',
      accent: ['FMA22425', 'FMA22354'], danger: ['nclc'], masquer: REPERES, ecarter: HUETER_SUPERFICIEL },
    { titre: 'Plan profond : droit fémoral / moyen fessier', vue: 'antProche',
      texte: 'Au fond de l’intervalle : le droit fémoral, écarté en dedans, et les moyen et petit fessiers, écartés en dehors. La branche ascendante de l’artère circonflexe latérale croise le champ : elle est repérée puis liée ou coagulée.',
      accent: ['FMA38928', 'FMA22330', 'FMA22332'], danger: ['circonflexe'], masquer: REPERES, ecarter: HUETER_PROFOND },
    { titre: 'Capsule antérieure', vue: 'antProche',
      texte: 'Un écarteur récline l’ilio-psoas en dedans, au contact du col : la capsule antérieure est exposée. Le paquet fémoral (nerf, artère, veine, de dehors en dedans) est juste en dedans : les écarteurs restent au contact de l’os.',
      accent: ['capsule'], danger: ['nfemoral', 'afemorale', 'vfemorale'], masquer: [...REPERES, 'circonflexe'],
      ecarter: { ...HUETER_PROFOND, FMA22322: [18, -4, 0], FMA22342: [18, -4, 0] } },
    { titre: 'Capsulotomie et exposition du col', vue: 'antProche',
      texte: 'Capsulotomie antérieure : le col et la tête sont exposés. La coupe du col se fait en place, puis la tête est extraite avant la préparation du cotyle.',
      accent: ['FMA24474'], danger: ['nfemoral', 'afemorale', 'vfemorale'], estomper: ['capsule'], masquer: [...REPERES, 'circonflexe'],
      ecarter: { ...HUETER_PROFOND, FMA22322: [18, -4, 0], FMA22342: [18, -4, 0] } },
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
      accent: ['FMA38930'], danger: ['perforante1', 'perforante2'], masquer: REPERES,
      ecarter: { ...FASCIA_OUVERT, FMA38930: [-6, -36, 0] } },
    { titre: 'Face latérale du fémur', vue: 'latProche',
      texte: 'La corticale latérale sous-trochantérienne est exposée, tenue par des écarteurs de Hohmann. Le viseur d’angle se pose sous le grand trochanter : la broche-guide vise le centre de la tête, de face comme de profil.',
      accent: ['axe-vis'], voiler: ['FMA24474'], danger: ['perforante1', 'perforante2'], montrer: ['axe-vis'], masquer: ['axe-clou'],
      ecarter: { ...FASCIA_OUVERT, FMA38930: [-6, -36, 0], FMA38934: [0, -14, 0] } },
  ] },
  clou: { court: 'Clou gamma', titre: 'Abord du grand trochanter (clou gamma)', steps: [
    { titre: 'Repères et incision', vue: 'trochanter',
      texte: 'Patient sur table orthopédique, tronc incliné du côté opposé, fracture réduite. Incision de 3 à 5 cm, quelques centimètres au-dessus du sommet du grand trochanter, dans le prolongement de l’axe du fémur.',
      montrer: ['incision-clou'], accent: ['FMA58776', 'FMA22328'], masquer: REPERES },
    { titre: 'Fascia et moyen fessier', vue: 'trochanter',
      texte: 'Le fascia est incisé dans l’axe de l’incision, puis les fibres du moyen fessier sont dissociées dans leur sens, au doigt, jusqu’à palper le sommet du grand trochanter. Le nerf glutéal supérieur chemine entre moyen et petit fessier, environ 5 cm au-dessus du sommet : ne pas prolonger la dissociation vers le haut.',
      accent: ['FMA22330'], danger: ['nglutealsup'], masquer: REPERES,
      ecarter: { 'FMA58776/A': [0, 26, 0], 'FMA58776/B': [0, -26, 0], 'FMA22328/A': [8, 22, 14], 'FMA22330/A': [0, 20, 0], 'FMA22330/B': [0, -20, 0] } },
    { titre: 'Point d’entrée et axe du clou', vue: 'trochanter',
      texte: 'Le point d’entrée est au sommet du grand trochanter de face, dans l’axe du canal médullaire de profil. La broche-guide puis le clou suivent l’axe du canal ; la vis cervicale vise le centre de la tête.',
      accent: ['axe-clou', 'axe-vis'], voiler: ['FMA24474'], danger: ['nglutealsup'], montrer: REPERES, estomper: ['FMA38930', 'FMA38934'],
      ecarter: { 'FMA58776/A': [0, 30, 0], 'FMA58776/B': [0, -30, 0], 'FMA22328/A': [8, 26, 14], 'FMA22330/A': [0, 24, 0], 'FMA22330/B': [0, -24, 0] } },
  ] },
};

export default { nom: 'Hanche droite', centre, vues, meshes, fendre, tubes, manchons, groupes, voies };
