// Outils communs aux régions : incision de la peau et écartement de ses berges.

// Fend la peau et le tissu sous-cutané le long de la ligne d'incision (relevée sur la peau). « fond » = direction de la profondeur.
// « /A » est la berge du côté de la normale « tronçon × fond », « /B » l'autre.
export const peauFendue = (ligne, fond, nomA, nomB) => [
  ['peau', { ligne, fond, rayon: 16 }, `Peau — berge ${nomA}`, `Peau — berge ${nomB}`],
  ['graisse', { ligne, fond, rayon: 20 }, `Tissu sous-cutané — berge ${nomA}`, `Tissu sous-cutané — berge ${nomB}`],
];

// Berges cutanées écartées : « depA » est le déplacement d'une berge (un vecteur, ou un par tronçon de la ligne), l'autre part à l'opposé.
// L'ouverture s'effile vers les deux bouts de l'incision.
export const berges = (ligne, fond, depA, k = 1, rayon = 38) => {
  // sens vérifié sur le premier tronçon : si « depA » pointe en fait vers la berge /B, on l'inverse (les berges ne doivent jamais se croiser)
  const ab = ligne[1].map((c, i) => c - ligne[0][i]);
  const n = [ab[1] * fond[2] - ab[2] * fond[1], ab[2] * fond[0] - ab[0] * fond[2], ab[0] * fond[1] - ab[1] * fond[0]];
  const premier = Array.isArray(depA[0]) ? depA[0] : depA;
  if (premier[0] * n[0] + premier[1] * n[1] + premier[2] * n[2] < 0) k = -k;
  const fois = s => (Array.isArray(depA[0]) ? depA.map(d => d.map(c => c * s)) : depA.map(c => c * s));
  const A = { dep: fois(k), autour: ligne, rayon, fond };
  const B = { ...A, dep: fois(-k) };
  return { 'peau/A': A, 'graisse/A': A, 'peau/B': B, 'graisse/B': B };
};

// Même consigne pour plusieurs pièces.
export const charge = (ids, consigne) => Object.fromEntries(ids.map(id => [id, consigne]));

// Lame d'écarteur parallèle à une incision droite [a, b] : décalée de « ecart » mm dans le sens « pousse », elle charge tout ce qui se trouve
// jusqu'à « course » mm derrière elle. « course » vaut plus de deux fois l'écart pour charger en entier ce qui borde l'incision.
export const lame = (incision, pousse, fond, ecart, course, options = {}) => ({
  lame: incision.map(q => q.map((c, i) => c + pousse[i] * ecart)), pousse, course, rayon: 17, fond, profondeur: 48, ...options,
});
