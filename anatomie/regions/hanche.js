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

// Structures absentes du modèle libre, tracées à la main d'après les repères osseux : [id, nom, groupe, couleur, rayon, points]
// Tracés à la main : incisions et repères d'ostéosynthèse (nerfs, vaisseaux et capsule viennent maintenant de Z-Anatomy).
const tubes = [
  ['incision-post', 'Incision — voie postérieure', 'incisions', '#35e0c8', 1.4, {},
    [[-151, -74, 712], [-153, -76, 760], [-152, -74, 800], [-143, -52, 838], [-125, -24, 872], [-104, -4, 898]]],
  ['incision-ant', 'Incision — voie antérieure', 'incisions', '#35e0c8', 1.4, {},
    [[-127, -152, 882], [-132, -151, 850], [-137, -148, 815], [-141, -143, 782]]],
  ['incision-lat', 'Incision — voie latérale du fémur proximal', 'incisions', '#35e0c8', 1.4, {},
    [[-159, -90, 806], [-161, -90, 760], [-161, -90, 710], [-159, -90, 660]]],
  ['incision-clou', 'Incision — abord du grand trochanter', 'incisions', '#35e0c8', 1.4, {},
    [[-152, -76, 846], [-150, -76, 872], [-146, -76, 898]]],
  ['axe-clou', 'Axe du clou (schématique)', 'reperes', '#7df9ff', 2.2, {},
    [[-140, -68, 900], [-127, -77, 822], [-114, -88, 730], [-103, -93, 640], [-97, -94, 580]]],
  ['axe-vis', 'Axe de la vis cervicale (schématique)', 'reperes', '#7df9ff', 2.2, {},
    [[-150, -86, 765], [-128, -88, 780], [-98, -90, 800], [-70, -92, 819]]],
].map(([id, nom, groupe, couleur, rayon, options, points]) => [id, nom, groupe, couleur, rayon, points, options]);

const groupes = [
  ['os', 'Os'], ['fessiers', 'Fessiers et fascia lata'], ['rotateurs', 'Pelvi-trochantériens'], ['anterieurs', 'Loge antérieure et ilio-psoas'],
  ['mediaux', 'Adducteurs'], ['posterieurs', 'Ischio-jambiers'], ['ligaments', 'Capsule et ligaments'], ['vaisseaux', 'Artères et veines'], ['nerfs', 'Nerfs'],
  ['incisions', 'Incisions'], ['reperes', 'Repères d’ostéosynthèse'],
];

const ROTATEURS = ['FMA22340', 'FMA22334', 'FMA22324', 'FMA22336'];
const REPERES = ['axe-clou', 'axe-vis'];
const centre = [-92, -85, 825]; // articulation de la hanche droite
const DIAPHYSE = [-112, -88, 745]; // cible des vues latérales : région trochantérienne et sous-trochantérienne

// Points de vue : décalage de la caméra par rapport à la cible (le centre, sauf cible précisée).
const vues = {
  post: { de: [-230, 400, 110] }, postProche: { de: [-225, 320, -10] },
  // vue de l'opérateur : patient couché sur le côté sain, opérateur dans son dos ; la tête du patient est à gauche, l'avant en haut de l'image
  opPost: { de: [-400, 275, 0], haut: [-0.565, -0.826, 0] },
  opPostProche: { de: [-250, 172, 0], haut: [-0.565, -0.826, 0], cible: [-112, -66, 822] },
  ant: { de: [-150, -430, 70] }, antProche: { de: [-120, -330, 10] },
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
  return { 'FMA58776/B': avant, 'FMA58776/A/A': avant, 'FMA22328/A': avant, 'FMA58776/A/B': arriere, 'FMA22328/B': arriere };
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
  'FMA58776/A': { dep: [-3, 24 * k, 0], autour: LIGNE_LATERALE, rayon: 32 }, 'FMA58776/B/A': { dep: [-3, 24 * k, 0], autour: LIGNE_LATERALE, rayon: 32 },
  'FMA58776/B/B': { dep: [-3, -24 * k, 0], autour: LIGNE_LATERALE, rayon: 32 },
});
// Vaste latéral désinséré de la cloison et relevé : sa portion en regard de la plaque est retirée, le reste du muscle garde ses attaches.
const SECTION_VASTE = { FMA38930: { autour: [[-146, -84, 785], [-140, -88, 672]], rayon: 27 }, FMA38934: { autour: [[-136, -88, 770], [-132, -90, 690]], rayon: 16 } };

const LIGNE_CLOU = [[-152, -76, 846], [-146, -76, 898]];          // incision au-dessus du sommet du trochanter
const LIGNE_CLOU_PROFONDE = [[-134, -76, 836], [-128, -76, 880]]; // même ligne, dans le moyen fessier
const TROCHANTER_OUVERT = {
  'FMA58776/A': { dep: [0, 20, 0], autour: LIGNE_CLOU, rayon: 28 }, 'FMA58776/B': { dep: [0, -20, 0], autour: LIGNE_CLOU, rayon: 28 },
  'FMA22328/A': { dep: [0, 20, 0], autour: LIGNE_CLOU, rayon: 28 },
  'FMA22330/A': { dep: [0, 15, 0], autour: LIGNE_CLOU_PROFONDE, rayon: 26 }, 'FMA22330/B': { dep: [0, -15, 0], autour: LIGNE_CLOU_PROFONDE, rayon: 26 },
};

const voies = {
  post: { court: 'Moore', titre: 'Voie postérieure (Moore)', steps: [
    { titre: 'Installation et incision', vue: 'opPost',
      texte: 'Vue de l’opérateur : patient en décubitus latéral strict, tête à gauche, opérateur dans son dos. L’incision est centrée sur le bord postérieur du grand trochanter : elle descend dans l’axe du fémur et s’incurve en haut et en arrière, vers l’épine iliaque postéro-supérieure.',
      montrer: ['incision-post'], accent: ['FMA22328', 'FMA58776'], masquer: REPERES },
    { titre: 'Fascia lata et grand fessier', vue: 'opPost',
      texte: 'Le long de la même incision : en bas, le fascia lata est incisé dans l’axe du fémur ; en haut, les fibres du grand fessier sont dissociées dans leur sens. Les deux lèvres s’écartent sur toute la longueur.',
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
  ant: { court: 'Hueter', titre: 'Voie antérieure (Hueter)', steps: [
    { titre: 'Repères et incision', vue: 'ant',
      texte: 'Patient en décubitus dorsal. Repère : l’épine iliaque antéro-supérieure. L’incision débute environ 2 cm en dehors et en dessous d’elle et descend obliquement en bas et en dehors sur le corps du tenseur du fascia lata, sur 8 à 10 cm.',
      montrer: ['incision-ant'], accent: ['FMA22425'], danger: ['nclc'], masquer: REPERES },
    { titre: 'Intervalle superficiel : tenseur du fascia lata / sartorius', vue: 'antProche',
      texte: 'On ouvre la gaine du tenseur du fascia lata et on reste à l’intérieur. L’intervalle avec le sartorius s’ouvre en regard de l’incision : tenseur en dehors, sartorius en dedans. Le nerf cutané latéral de la cuisse chemine en dedans, sur le sartorius : rester dans la gaine le protège.',
      accent: ['FMA22425', 'FMA22354'], danger: ['nclc'], masquer: REPERES, ecarter: hueter(1) },
    { titre: 'Plan profond : droit fémoral / moyen fessier', vue: 'antProche',
      texte: 'Au fond de l’intervalle, un second intervalle s’ouvre : le droit fémoral en dedans, les moyen et petit fessiers en dehors. La branche ascendante de l’artère circonflexe latérale croise le champ : elle est repérée puis liée ou coagulée.',
      accent: ['FMA38928', 'FMA22330', 'FMA22332'], danger: ['circonflexe'], masquer: REPERES, ecarter: HUETER_PROFOND },
    { titre: 'Capsule antérieure', vue: 'antProche',
      texte: 'Des écarteurs sont passés de part et d’autre du col, au contact de l’os : droit fémoral et ilio-psoas en dedans, fessiers en dehors. La capsule antérieure est exposée au fond. Le paquet fémoral (nerf, artère, veine, de dehors en dedans) est juste en dedans.',
      accent: ['capsule'], danger: ['nfemoral', 'afemorale', 'vfemorale'], masquer: REPERES, ecarter: HUETER_CAPSULE },
    { titre: 'Capsulotomie et exposition du col', vue: 'antProche',
      texte: 'Capsulotomie antérieure : le col et la tête sont exposés. La coupe du col se fait en place, puis la tête est extraite avant la préparation du cotyle.',
      accent: ['FMA24474', 'capsule'], danger: ['nfemoral', 'afemorale', 'vfemorale'], masquer: REPERES, ecarter: HUETER_CAPSULE, sectionner: { capsule: { autour: [[-84, -116, 834], [-104, -112, 792]], rayon: 15 } } },
  ] },
  dhs: { court: 'DHS', titre: 'Voie latérale du fémur proximal (DHS)', steps: [
    { titre: 'Repères et incision', vue: 'lat',
      texte: 'Patient sur table orthopédique, fracture réduite. Incision longitudinale sur la face latérale de la cuisse, depuis le grand trochanter vers le bas, dans l’axe du fémur, sur 8 à 12 cm selon la longueur de plaque.',
      montrer: ['incision-lat'], accent: ['FMA58776'], masquer: REPERES },
    { titre: 'Fascia lata', vue: 'lat',
      texte: 'Le fascia lata est incisé dans l’axe de ses fibres, sur la ligne de l’incision cutanée. Ses deux berges s’écartent franchement : le vaste latéral apparaît au fond.',
      accent: ['FMA58776', 'FMA38930'], masquer: REPERES, ecarter: lateral(1) },
    { titre: 'Vaste latéral', vue: 'latProche',
      texte: 'Le vaste latéral est désinséré de la cloison intermusculaire latérale et relevé en avant, avec une contre-incision en L sous le tubercule du vaste : sa portion en regard de la plaque est ici retirée, le reste du muscle garde ses attaches. Les artères perforantes traversent la cloison : elles sont repérées et liées ou coagulées.',
      accent: ['FMA24474'], danger: ['perforantes'], masquer: REPERES, ecarter: lateral(1.15), sectionner: SECTION_VASTE },
    { titre: 'Face latérale du fémur', vue: 'latProche',
      texte: 'La corticale latérale sous-trochantérienne est exposée. Le viseur d’angle se pose sous le grand trochanter : la broche-guide vise le centre de la tête, de face comme de profil. Le fémur est ici translucide pour montrer l’axe de la vis.',
      accent: ['axe-vis'], voiler: ['FMA24474'], danger: ['perforantes'], montrer: ['axe-vis'], masquer: ['axe-clou'], ecarter: lateral(1.15), sectionner: SECTION_VASTE },
  ] },
  clou: { court: 'Clou gamma', titre: 'Abord du grand trochanter (clou gamma)', steps: [
    { titre: 'Repères et incision', vue: 'trochanter',
      texte: 'Patient sur table orthopédique, tronc incliné du côté opposé, fracture réduite. Incision de 3 à 5 cm, quelques centimètres au-dessus du sommet du grand trochanter, dans le prolongement de l’axe du fémur.',
      montrer: ['incision-clou'], accent: ['FMA58776', 'FMA22328'], masquer: REPERES },
    { titre: 'Fascia et moyen fessier', vue: 'trochanter',
      texte: 'Sur la même ligne : le fascia est incisé, puis les fibres du moyen fessier sont dissociées dans leur sens, au doigt, jusqu’à palper le sommet du grand trochanter. Le nerf glutéal supérieur chemine entre moyen et petit fessier, environ 5 cm au-dessus du sommet : ne pas prolonger la dissociation vers le haut.',
      accent: ['FMA22330'], danger: ['nglutealsup'], masquer: REPERES, ecarter: TROCHANTER_OUVERT },
    { titre: 'Point d’entrée et axe du clou', vue: 'trochanter',
      texte: 'Le point d’entrée est au sommet du grand trochanter de face, dans l’axe du canal médullaire de profil. La broche-guide puis le clou suivent l’axe du canal ; la vis cervicale vise le centre de la tête. Le fémur est ici translucide.',
      accent: ['axe-clou', 'axe-vis'], voiler: ['FMA24474'], estomper: ['FMA38930', 'FMA38934'], danger: ['nglutealsup'], montrer: REPERES, ecarter: TROCHANTER_OUVERT },
  ] },
};

export default { nom: 'Hanche droite', dossier: 'models-hd', fascias: ['FMA58776', 'FMA21964'], centre, vues, meshes, fendre, tubes, groupes, voies };
