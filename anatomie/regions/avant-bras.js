// Avant-bras droit — voie antérieure de Henry (diaphyse du radius) et abord direct de l'ulna.
// Repère BodyParts3D, en millimètres, avant-bras en supination : x = radial (-) / ulnaire (+), y = face antérieure (-) / postérieure (+), z = vers le coude (+).
import pieces from './avant-bras.pieces.js';
import { peauFendue, berges, charge, lame, deuxBerges } from './outils.js';

const meshes = [
  ['peau-coude', 'Peau', 'peau', '#e2b596', { id: 'peau', dossier: 'models-z' }],
  ...pieces,
];

// ----- Henry : incision sur la ligne tendon du biceps – styloïde radiale, tiers moyen -----
const PEAU_HENRY = [[-240, -109, 1005], [-245, -109, 981], [-248, -114, 956], [-252, -117, 930], [-256, -123, 905], [-259, -122, 881], [-261, -127, 861]];
const INTERVALLE = [[-239, -100, 1002], [-257, -116, 866]]; // entre brachio-radial (en dehors) et fléchisseur radial du carpe (en dedans)
const FOND_HENRY = [0.25, 0.97, 0];
const N_MED = [0.96, -0.25, -0.09];
const N_LAT = [-0.96, 0.25, 0.09];

// ----- Ulna : incision sur la crête sous-cutanée, de l'olécrâne vers la styloïde ulnaire -----
const PEAU_ULNA = [[-206, -37, 1020], [-210, -43, 990], [-211, -47, 965], [-212, -57, 938], [-218, -73, 910], [-223, -84, 880], [-225, -90, 853]];
const CRETE = [[-212, -46, 1016], [-229, -96, 856]]; // la même ligne, sur l'os, entre extenseur et fléchisseur ulnaires du carpe
const FOND_ULNA = [-0.6, -0.8, 0];
const N_DORSAL = [-0.8, 0.6, 0];  // vers l'extenseur ulnaire du carpe
const N_PALMAIRE = [0.8, -0.6, 0]; // vers le fléchisseur ulnaire du carpe

const visRadius = (n, x, y, z) => [`plaque-radius/vis${n}`, 'Vis corticale', 'implants', '#cfd6dd', 1.5, [[x, y - 1.5, z], [x + 0.5, y + 6, z], [x + 1, y + 13.5, z]]];
const visUlna = (n, x, y, z) => [`plaque-ulna/vis${n}`, 'Vis corticale', 'implants', '#cfd6dd', 1.5, [[x + 1, y + 1.3, z], [x - 4, y - 5.4, z], [x - 9, y - 12, z]]];
// ----- Thompson : de l'épicondyle latéral vers le tubercule de Lister -----
const PEAU_TH = [[-253, -52, 1020], [-260, -57, 996], [-263, -60, 969], [-264, -67, 944], [-264, -74, 919], [-268, -81, 895]];
const FOND_TH = [0.75, -0.66, 0];
const tubes = [
  ['incision-thompson', 'Incision — voie de Thompson', 'incisions', '#35e0c8', 1.2, PEAU_TH.map(([x, y, z]) => [x - 1.8, y + 1.6, z])],
  ...[985, 968, 951, 925, 910].map((z, n) => [`plaque-th/vis${n}`, 'Vis corticale', 'implants', '#cfd6dd', 1.5, [[-247 - (995 - z) * 0.17, -72 - (995 - z) * 0.11, z], [-241 - (995 - z) * 0.17, -77 - (995 - z) * 0.11, z], [-235 - (995 - z) * 0.17, -82 - (995 - z) * 0.11, z]]]),
  ['incision-henry', 'Incision — voie de Henry', 'incisions', '#35e0c8', 1.2, PEAU_HENRY.map(([x, y, z]) => [x - 0.6, y - 2.4, z])],
  ['incision-ulna', 'Incision — abord direct de l’ulna', 'incisions', '#35e0c8', 1.2, PEAU_ULNA.map(([x, y, z]) => [x + 1.5, y + 2, z])],
  visRadius(1, -243, -87, 978), visRadius(2, -245, -87.5, 963), visRadius(3, -247.5, -88.5, 948), visRadius(4, -252, -93, 916), visRadius(5, -254.5, -96, 902), visRadius(6, -256.5, -99.5, 888),
  visUlna(1, -214.5, -51, 1000), visUlna(2, -216.5, -56, 984), visUlna(3, -218, -61, 968), visUlna(4, -221, -72, 934), visUlna(5, -223, -78, 918), visUlna(6, -225, -84, 900),
];
const rubans = [
  ['plaque-th', 'Plaque dorso-latérale du radius', 'implants', '#b9c2cc', [[-246, -72.5, 996], [-252, -75.5, 962], [-257, -78.5, 932], [-261.5, -85.5, 902]], 9, 2.6, [0.66, 0.75, 0]],
  ['plaque-radius', 'Plaque antérieure du radius', 'implants', '#b9c2cc', [[-242, -87.5, 988], [-246, -88.5, 958], [-250, -91.5, 930], [-254, -96, 904], [-257.5, -101.5, 880]], 10, 2.6, [1, 0, 0]],
  ['plaque-ulna', 'Plaque de l’ulna', 'implants', '#b9c2cc', [[-212.5, -48, 1010], [-217, -58, 978], [-220.5, -69, 944], [-223.5, -79, 914], [-226, -86.5, 890]], 9, 2.6, [0.76, -0.57, 0.1]],
];

const groupes = [
  ['peau', 'Peau'], ['graisse', 'Tissu sous-cutané'], ['os', 'Os'], ['lateraux', 'Loge latérale et extenseurs'], ['mediaux', 'Fléchisseurs et pronateurs'], ['anterieurs', 'Biceps et brachial'],
  ['triceps', 'Triceps et anconé'], ['ligaments', 'Ligaments et membrane'], ['vaisseaux', 'Artères et veines'], ['nerfs', 'Nerfs'], ['incisions', 'Incisions'], ['implants', 'Plaques et vis'],
];

const centre = [-235, -85, 930];
const RADIUS = [-250, -100, 932];
const ULNA = [-220, -68, 938];
const vues = {
  // décubitus dorsal, bras sur table à main, avant-bras en supination : main à droite, bord ulnaire en haut
  opHenry: { de: [-60, -330, 0], haut: [1, 0, 0], cible: RADIUS }, opHenryProche: { de: [-40, -205, 0], haut: [1, 0, 0], cible: RADIUS },
  // coude fléchi, avant-bras sur le thorax ou sur la table : l'opérateur regarde le bord ulnaire, main à droite
  opUlna: { de: [200, 265, 0], haut: [-0.8, 0.6, 0], cible: ULNA }, opUlnaProche: { de: [125, 165, 0], haut: [-0.8, 0.6, 0], cible: ULNA },
  // avant-bras en pronation sur la table à main : face dorso-latérale, coude en haut
  opTh: { de: [-215, 190, 0], cible: [-252, -68, 958] }, opThProche: { de: [-130, 115, 0], cible: [-252, -68, 958] },
  libre: { de: [-250, -250, 60] },
};
const IMPLANTS = ['plaque-radius', 'plaque-ulna'];

const optsPeau = { rayon: 24, profondeur: 30 };
const PEAU_HENRY_DROITE = [PEAU_HENRY[0], PEAU_HENRY[PEAU_HENRY.length - 1]];
const henryPeau = (dehors, dedans) => ({
  ...charge(['peau/B', 'graisse/B'], lame(PEAU_HENRY_DROITE, N_LAT, FOND_HENRY, dehors, dehors * 2.4 + 10, optsPeau)),
  ...charge(['peau/A', 'graisse/A'], lame(PEAU_HENRY_DROITE, N_MED, FOND_HENRY, dedans, dedans * 2.4 + 10, optsPeau)),
});
const opts = { rayon: 24, profondeur: 44 };
// Le brachio-radial part en dehors avec la branche superficielle du nerf radial ; le fléchisseur radial du carpe en dedans avec l'artère radiale.
const DEHORS = ['brachioradial', 'nradial-sup', 'ecrl', 'ecrb', 'ncutlat', 'cephalique'];
const DEDANS = ['fcr', 'aradiale', 'vradiales', 'long-palmaire'];
const PROFONDS = ['rond-pronateur', 'rond-pronateur-prof', 'fds-radial', 'fds', 'fpl', 'nmedian', 'nia'];
const henrySuperficiel = (dehors, dedans) => ({
  ...charge(DEHORS, lame(INTERVALLE, N_LAT, FOND_HENRY, dehors, dehors * 2.4 + 12, opts)),
  ...charge(DEDANS, lame(INTERVALLE, N_MED, FOND_HENRY, dedans, dedans * 2.4 + 12, opts)),
});
const HENRY_PROFOND = charge(PROFONDS, lame(INTERVALLE, N_MED, FOND_HENRY, 13, 52, { rayon: 24, profondeur: 50 }));
// Rond pronateur désinséré de la face latérale du radius (avant-bras en pronation), supinateur récliné en dehors (avant-bras en supination).
const DESINSERTIONS = { 'rond-pronateur': { autour: [[-256, -84, 985], [-258, -82, 925]], rayon: 11 }, supinateur: { autour: [[-240, -84, 1000], [-246, -82, 960]], rayon: 13 } };

const PEAU_ULNA_DROITE = [PEAU_ULNA[0], PEAU_ULNA[PEAU_ULNA.length - 1]];
const ulnaPeau = k => berges(PEAU_ULNA, FOND_ULNA, N_DORSAL.map(c => c * 11), k, 24);
const ulnaMuscles = k => ({
  ...charge(['ecu', 'ecu-ulnaire'], lame(CRETE, N_DORSAL, FOND_ULNA, 8 * k, 30, { rayon: 24, profondeur: 22 })),
  ...charge(['fcu', 'fcu-ulnaire', 'fdp'], lame(CRETE, N_PALMAIRE, FOND_ULNA, 8 * k, 30, { rayon: 24, profondeur: 22 })),
});

// Thompson : court extenseur radial du carpe en avant, extenseur des doigts en arrière ; au fond, le supinateur et le nerf interosseux postérieur.
const TH_AVANT = [-0.66, -0.75, 0];
const TH_ARRIERE = [0.66, 0.75, 0];
const INT_TH = [[-250, -56, 1020], [-258, -77, 900]];
const thBouts = [PEAU_TH[0], PEAU_TH[PEAU_TH.length - 1]];
const thPeau = e => deuxBerges(PEAU_TH, FOND_TH,
  { vers: TH_AVANT, lame: lame(thBouts, TH_AVANT, FOND_TH, e, e * 2.4 + 8, { rayon: 22, profondeur: 22 }) },
  { vers: TH_ARRIERE, lame: lame(thBouts, TH_ARRIERE, FOND_TH, e, e * 2.4 + 8, { rayon: 22, profondeur: 22 }) });
const thMuscles = e => ({
  ...charge(['ecrb', 'ecrl', 'brachioradial'], lame(INT_TH, TH_AVANT, FOND_TH, e, e * 2.4 + 12, { rayon: 22, profondeur: 30 })),
  ...charge(['edc', 'edm', 'ecu', 'ecu-ulnaire'], lame(INT_TH, TH_ARRIERE, FOND_TH, e, e * 2.4 + 12, { rayon: 22, profondeur: 30 })),
});
const SUPINATEUR_DESINSERE = { supinateur: { autour: [[-244, -74, 1012], [-250, -78, 962]], rayon: 11 } };
const POUCE_ECARTE = charge(['apl', 'epb'], { dep: [4, 6, -14], autour: [[-244, -76, 960], [-254, -84, 905]], rayon: 26 });

const voies = {
  henry: { court: 'Henry', titre: 'Voie antérieure de Henry (diaphyse du radius)', fendre: peauFendue(PEAU_HENRY, FOND_HENRY, 'médiale', 'latérale'), steps: [
    { titre: 'Installation et incision', vue: 'opHenry',
      texte: 'Vue de l’opérateur : décubitus dorsal, bras en abduction sur table à main, avant-bras en supination, garrot à la racine du bras. L’incision suit la ligne tendue du bord latéral du tendon du biceps, au pli du coude, à la styloïde radiale ; elle est centrée sur le foyer, ici au tiers moyen.',
      montrer: ['incision-henry'], masquer: IMPLANTS },
    { titre: 'Peau et fascia', vue: 'opHenryProche',
      texte: 'Peau et tissu sous-cutané sont incisés, puis le fascia antébrachial sur le bord médial du brachio-radial. Le nerf cutané latéral de l’avant-bras et la veine céphalique restent dans la berge latérale.',
      accent: ['brachioradial', 'fcr'], danger: ['ncutlat', 'aradiale'], masquer: IMPLANTS, ecarter: henryPeau(13, 13) },
    { titre: 'Intervalle brachio-radial / fléchisseur radial du carpe', vue: 'opHenryProche',
      texte: 'Plan internerveux : le brachio-radial (nerf radial) est récliné en dehors, le fléchisseur radial du carpe (nerf médian) en dedans. L’artère radiale et ses veines courent sous le bord du brachio-radial : ses collatérales musculaires sont liées, et elle est réclinée en dedans. La branche superficielle du nerf radial, sous le brachio-radial, part en dehors avec lui.',
      accent: ['brachioradial', 'fcr'], danger: ['aradiale', 'vradiales', 'nradial-sup'], masquer: IMPLANTS, ecarter: { ...henryPeau(19, 17), ...henrySuperficiel(13, 12) } },
    { titre: 'Plan profond : rond pronateur et fléchisseurs', vue: 'opHenryProche',
      texte: 'Au tiers moyen, le radius est couvert par l’insertion du rond pronateur et par l’origine du fléchisseur superficiel des doigts et du long fléchisseur du pouce. Avant-bras en pronation, le rond pronateur est désinséré de la face latérale du radius, puis ces muscles sont réclinés en dedans, en sous-périosté. Au tiers proximal, c’est en supination complète que le supinateur est désinséré et récliné en dehors : la supination éloigne le nerf interosseux postérieur, qui le traverse.',
      accent: ['radius', 'rond-pronateur', 'supinateur'], danger: ['aradiale', 'nradial-sup', 'nip', 'nradial-prof'], masquer: IMPLANTS,
      ecarter: { ...henryPeau(21, 19), ...henrySuperficiel(15, 14), ...HENRY_PROFOND }, sectionner: DESINSERTIONS },
    { titre: 'Réduction et plaque', vue: 'opHenryProche',
      texte: 'Le foyer est exposé avec un dépériostage minimal. Réduction anatomique — longueur, rotation et courbure pronatrice du radius, qui conditionne la prono-supination — puis plaque de compression de 3,5 mm sur la face antérieure, avec au moins trois vis bicorticales de part et d’autre du foyer. Le fascia n’est pas refermé (risque de syndrome des loges).',
      accent: ['radius'], danger: ['aradiale', 'nradial-sup', 'nip'], montrer: ['plaque-radius'], masquer: ['plaque-ulna'],
      ecarter: { ...henryPeau(21, 19), ...henrySuperficiel(15, 14), ...HENRY_PROFOND }, sectionner: DESINSERTIONS },
  ] },
  ulna: { court: 'Ulna', titre: 'Abord direct de l’ulna', fendre: peauFendue(PEAU_ULNA, FOND_ULNA, 'dorsale', 'palmaire'), steps: [
    { titre: 'Installation et incision', vue: 'opUlna',
      texte: 'Vue de l’opérateur : décubitus dorsal, coude fléchi, avant-bras posé sur le thorax ou sur la table à main en rotation neutre. L’incision suit la crête sous-cutanée de l’ulna, sur la ligne qui joint la pointe de l’olécrâne à la styloïde ulnaire ; elle est centrée sur le foyer.',
      montrer: ['incision-ulna'], masquer: IMPLANTS },
    { titre: 'Peau et tissu sous-cutané', vue: 'opUlnaProche',
      texte: 'L’ulna est sous-cutanée sur toute sa longueur : peau, tissu sous-cutané, puis l’aponévrose commune à l’extenseur et au fléchisseur ulnaires du carpe, qui s’insère sur la crête. En distal, le rameau dorsal du nerf ulnaire croise le bord de l’os vers le dos de la main : il est repéré et protégé.',
      accent: ['ulna', 'ecu', 'fcu-ulnaire'], danger: ['nulnaire-dorsal'], masquer: IMPLANTS, ecarter: ulnaPeau(1) },
    { titre: 'Intervalle extenseur / fléchisseur ulnaires du carpe', vue: 'opUlnaProche',
      texte: 'Plan internerveux : l’extenseur ulnaire du carpe (nerf interosseux postérieur) est récliné vers le dos, le fléchisseur ulnaire du carpe (nerf ulnaire) vers la paume, au ras de l’os et sans dépériostage étendu. Le nerf et l’artère ulnaires cheminent sous le fléchisseur ulnaire du carpe, sur le fléchisseur profond : rester au contact de l’os.',
      accent: ['ulna', 'ecu', 'fcu-ulnaire'], danger: ['nulnaire', 'aulnaire', 'nulnaire-dorsal'], masquer: IMPLANTS, ecarter: { ...ulnaPeau(1.25), ...ulnaMuscles(1) } },
    { titre: 'Réduction et plaque', vue: 'opUlnaProche',
      texte: 'Réduction anatomique, puis plaque de compression de 3,5 mm avec trois vis bicorticales de part et d’autre du foyer. La plaque se pose de préférence sur la face palmaire (sous le fléchisseur ulnaire du carpe) ou dorsale, plutôt que sur la crête où elle gêne à l’appui ; elle est ici figurée près de la crête pour rester visible. Dans une fracture de Monteggia, la réduction anatomique de l’ulna réduit la tête radiale.',
      accent: ['ulna'], danger: ['nulnaire', 'aulnaire'], montrer: ['plaque-ulna'], masquer: ['plaque-radius'], ecarter: { ...ulnaPeau(1.25), ...ulnaMuscles(1.2) } },
  ] },
  thompson: { court: 'Thompson', titre: 'Voie postéro-latérale de Thompson (radius proximal et moyen)', fendre: peauFendue(PEAU_TH, FOND_TH, 'antérieure', 'postérieure'), steps: [
    { titre: 'Installation et incision', vue: 'opTh',
      texte: 'Décubitus dorsal, bras sur table à main, coude fléchi, avant-bras en pronation, garrot. L’incision suit la ligne qui joint l’épicondyle latéral au tubercule de Lister, centrée sur le foyer. Le modèle est ici en supination.',
      montrer: ['incision-thompson'], danger: ['nip'], masquer: IMPLANTS },
    { titre: 'Peau et fascia', vue: 'opThProche',
      texte: 'Peau et fascia sont incisés. L’intervalle est entre le court extenseur radial du carpe (nerf radial), en avant, et l’extenseur commun des doigts (nerf interosseux postérieur), en arrière ; il se trouve plus facilement en distal, là où le long abducteur et le court extenseur du pouce émergent entre les deux muscles.',
      accent: ['ecrb', 'edc', 'apl'], danger: ['nip'], masquer: IMPLANTS, ecarter: thPeau(9) },
    { titre: 'Intervalle et nerf interosseux postérieur', vue: 'opThProche',
      texte: 'L’intervalle est ouvert de bas en haut. Au tiers proximal, le supinateur enveloppe le radius et le nerf interosseux postérieur le traverse entre ses deux chefs : le nerf est repéré à sa sortie, au bord distal du muscle, ou à son entrée, puis disséqué à travers le muscle en ménageant ses rameaux. C’est le temps dangereux de cette voie.',
      accent: ['supinateur', 'ecrb', 'edc'], danger: ['nip', 'nradial-prof', 'aip'], masquer: IMPLANTS, ecarter: { ...thPeau(11), ...thMuscles(9) } },
    { titre: 'Radius exposé', vue: 'opThProche',
      texte: 'Le nerf protégé, l’avant-bras est porté en supination complète : l’insertion antérieure du supinateur se présente et le muscle est désinséré du radius, en sous-périosté, avec le nerf. Au tiers moyen, le long abducteur et le court extenseur du pouce croisent l’os : ils sont mobilisés et la plaque glissée sous eux.',
      accent: ['radius'], danger: ['nip', 'nradial-prof'], masquer: IMPLANTS, ecarter: { ...thPeau(12), ...thMuscles(11), ...POUCE_ECARTE }, sectionner: SUPINATEUR_DESINSERE },
    { titre: 'Réduction et plaque', vue: 'opThProche',
      texte: 'Plaque de compression sur la face dorso-latérale du radius, côté en tension, qui respecte la courbure pronatrice. Au tiers proximal, la voie antérieure de Henry lui est souvent préférée, pour ne pas disséquer le nerf.',
      accent: ['radius'], danger: ['nip'], montrer: ['plaque-th'], masquer: ['plaque-radius', 'plaque-ulna'], ecarter: { ...thPeau(12), ...thMuscles(11), ...POUCE_ECARTE }, sectionner: SUPINATEUR_DESINSERE },
  ] },
};

export default { nom: 'Avant-bras droit', graisse: 3, centre, vues, meshes, tubes, rubans, groupes, voies };
