// Classifications de traumatologie et d'orthopédie, par os ou région.
// Forme : [clé, titre, [ { nom, objet, types: [[type, description], …], note } ]]. Aide-mémoire de révision, sans valeur de référence.
const CLASSIFICATIONS = [
  ['general', 'Classifications générales', [
    { nom: 'Gustilo et Anderson', objet: 'Fractures ouvertes', types: [
      ['I', 'Plaie de moins de 1 cm, propre, de dedans en dehors ; fracture simple.'],
      ['II', 'Plaie de 1 à 10 cm, sans délabrement étendu ni lambeau ; comminution modérée.'],
      ['IIIA', 'Délabrement étendu ou traumatisme à haute énergie, mais couverture de l’os possible par les parties molles.'],
      ['IIIB', 'Perte de substance avec dépériostage et os exposé : un lambeau de couverture est nécessaire.'],
      ['IIIC', 'Lésion artérielle à réparer pour sauver le membre, quel que soit l’état cutané.']],
      note: 'Le type se fixe au bloc, après parage. Toute fracture ouverte par arme à feu à haute vélocité, en milieu agricole ou vue après 8 heures est d’emblée de type III.' },
    { nom: 'Cauchoix et Duparc', objet: 'Fractures ouvertes (école française)', types: [
      ['I', 'Plaie simple, suturable sans tension après parage.'],
      ['II', 'Plaie contuse ou décollement : risque de nécrose cutanée secondaire.'],
      ['III', 'Perte de substance cutanée en regard du foyer, non suturable.']] },
    { nom: 'Tscherne et Oestern', objet: 'Lésions des parties molles des fractures fermées', types: [
      ['C0', 'Parties molles indemnes ou presque ; fracture simple par mécanisme indirect.'],
      ['C1', 'Abrasion superficielle ou contusion par un fragment, de dedans en dehors.'],
      ['C2', 'Abrasion profonde contaminée, contusion cutanée ou musculaire localisée ; menace de syndrome des loges.'],
      ['C3', 'Contusion étendue, décollement sous-cutané, syndrome des loges constitué ou lésion vasculaire.']] },
    { nom: 'Salter et Harris', objet: 'Décollements épiphysaires de l’enfant', types: [
      ['I', 'Décollement pur à travers le cartilage de croissance.'],
      ['II', 'Décollement avec un coin métaphysaire (le plus fréquent).'],
      ['III', 'Trait épiphysaire articulaire rejoignant le cartilage de croissance.'],
      ['IV', 'Trait traversant métaphyse, cartilage de croissance et épiphyse.'],
      ['V', 'Écrasement du cartilage de croissance, de diagnostic souvent rétrospectif.']],
      note: 'Le risque d’épiphysiodèse augmente du type I au type V ; les types III et IV, articulaires, exigent une réduction anatomique.' },
    { nom: 'AO / OTA', objet: 'Principe de la classification alphanumérique', types: [
      ['Os', '1 humérus, 2 radius et ulna, 3 fémur, 4 tibia et fibula, 5 rachis, 6 bassin, 7 main, 8 pied.'],
      ['Segment', '1 proximal, 2 diaphysaire, 3 distal (44 : malléoles).'],
      ['Diaphyse', 'A simple, B à coin (troisième fragment), C complexe (comminutive ou segmentaire).'],
      ['Épiphyse', 'A extra-articulaire, B articulaire partielle, C articulaire complète.']] },
  ]],
  ['clavicule', 'Clavicule et acromio-claviculaire', [
    { nom: 'Allman', objet: 'Fractures de la clavicule', types: [
      ['Groupe I', 'Tiers moyen (environ 80 %).'], ['Groupe II', 'Tiers latéral.'], ['Groupe III', 'Tiers médial.']] },
    { nom: 'Neer', objet: 'Fractures du tiers latéral de la clavicule', types: [
      ['I', 'En dehors des ligaments coraco-claviculaires intacts : stable.'],
      ['IIA', 'En dedans des ligaments conoïde et trapézoïde : fragment médial ascensionné, instable.'],
      ['IIB', 'Entre les deux ligaments, conoïde rompu : instable.'],
      ['III', 'Trait articulaire acromio-claviculaire, ligaments intacts.']] },
    { nom: 'Rockwood', objet: 'Disjonctions acromio-claviculaires', types: [
      ['I', 'Entorse des ligaments acromio-claviculaires, pas de déplacement.'],
      ['II', 'Rupture acromio-claviculaire, coraco-claviculaires distendus : subluxation.'],
      ['III', 'Rupture des deux plans : luxation, espace coraco-claviculaire augmenté de 25 à 100 %.'],
      ['IV', 'Clavicule luxée en arrière, à travers le trapèze.'],
      ['V', 'Luxation majeure, espace coraco-claviculaire augmenté de plus de 100 %, chape delto-trapézienne déchirée.'],
      ['VI', 'Clavicule luxée sous l’acromion ou la coracoïde (exceptionnelle).']] },
  ]],
  ['epaule', 'Épaule : humérus proximal et scapula', [
    { nom: 'Neer', objet: 'Fractures de l’humérus proximal', types: [
      ['1 part', 'Aucun des quatre segments (tête, tubercule majeur, tubercule mineur, diaphyse) n’est déplacé, quel que soit le nombre de traits.'],
      ['2 parts', 'Un segment déplacé : col chirurgical (le plus fréquent), col anatomique, tubercule majeur ou mineur.'],
      ['3 parts', 'Deux segments déplacés : col chirurgical et un tubercule.'],
      ['4 parts', 'Les quatre segments sont séparés ; forme engrenée en valgus à part.']],
      note: 'Un segment est « déplacé » au-delà de 1 cm ou de 45° d’angulation (5 mm pour le tubercule majeur dans les travaux récents).' },
    { nom: 'Critères de Hertel', objet: 'Risque d’ischémie de la tête humérale', types: [
      ['Calcar', 'Extension métaphysaire postéro-médiale de la tête inférieure à 8 mm.'],
      ['Charnière médiale', 'Déplacement de la charnière médiale supérieur à 2 mm.'],
      ['Type de trait', 'Fracture du col anatomique.']],
      note: 'Les trois réunis : valeur prédictive positive d’ischémie de 97 %.' },
    { nom: 'Ideberg', objet: 'Fractures de la glène', types: [
      ['I', 'Rebord glénoïdien : Ia antérieur, Ib postérieur.'],
      ['II', 'Trait transversal ou oblique sortant par le bord latéral.'],
      ['III', 'Trait sortant par le bord supérieur, avec la coracoïde.'],
      ['IV', 'Trait horizontal sortant par le bord médial.'],
      ['V', 'Association des types II à IV.'],
      ['VI', 'Comminution de la glène.']] },
  ]],
  ['humerus', 'Diaphyse humérale', [
    { nom: 'AO 12', objet: 'Fractures de la diaphyse humérale', types: [
      ['A', 'Simple : spiroïde, oblique ou transversale.'], ['B', 'À coin : troisième fragment en aile de papillon.'], ['C', 'Complexe : bifocale ou comminutive.']] },
    { nom: 'Holstein et Lewis', objet: 'Fracture à risque pour le nerf radial', types: [
      ['Description', 'Fracture spiroïde du tiers distal, fragment distal déplacé en proximal et en dehors : le nerf radial, fixé par la cloison intermusculaire latérale, est embroché ou incarcéré.']] },
  ]],
  ['coude', 'Coude', [
    { nom: 'AO 13', objet: 'Fractures de la palette humérale', types: [
      ['A', 'Extra-articulaire (supra-condylienne, épicondyles).'],
      ['B', 'Articulaire partielle : un condyle (sagittale), ou frontale (capitulum, trochlée).'],
      ['C', 'Articulaire complète : C1 simple, C2 comminution métaphysaire, C3 comminution articulaire.']] },
    { nom: 'Mason (modifiée par Johnston)', objet: 'Fractures de la tête radiale', types: [
      ['I', 'Non déplacée ou déplacée de moins de 2 mm.'],
      ['II', 'Fracture partielle déplacée (plus de 2 mm) ou angulée.'],
      ['III', 'Comminutive de toute la tête.'],
      ['IV', 'Associée à une luxation du coude.']] },
    { nom: 'Mayo', objet: 'Fractures de l’olécrâne', types: [
      ['I', 'Non déplacée : IA simple, IB comminutive.'],
      ['II', 'Déplacée, coude stable : IIA simple, IIB comminutive.'],
      ['III', 'Coude instable (fracture-luxation) : IIIA simple, IIIB comminutive.']] },
    { nom: 'Regan et Morrey', objet: 'Fractures du processus coronoïde', types: [
      ['I', 'Avulsion de la pointe.'], ['II', 'Moins de 50 % de la hauteur.'], ['III', 'Plus de 50 % de la hauteur.']],
      note: 'O’Driscoll distingue la pointe, la facette antéro-médiale (instabilité postéro-médiale en varus) et la base.' },
    { nom: 'Gartland', objet: 'Fractures supra-condyliennes en extension de l’enfant', types: [
      ['I', 'Non déplacée.'], ['II', 'Déplacée, corticale postérieure en continuité.'], ['III', 'Déplacement complet, sans contact cortical.']],
      note: 'Lagrange et Rigault (école française) : quatre stades, le stade IV sans aucun contact entre les fragments.' },
  ]],
  ['avant-bras', 'Avant-bras', [
    { nom: 'Bado', objet: 'Fractures de Monteggia (ulna + luxation de la tête radiale)', types: [
      ['I', 'Luxation antérieure de la tête radiale, ulna angulée en avant (la plus fréquente chez l’enfant).'],
      ['II', 'Luxation postérieure, ulna angulée en arrière (adulte).'],
      ['III', 'Luxation latérale, fracture métaphysaire de l’ulna.'],
      ['IV', 'Luxation antérieure avec fracture des deux os.']] },
    { nom: 'Galeazzi et Essex-Lopresti', objet: 'Lésions associées de l’avant-bras', types: [
      ['Galeazzi', 'Fracture de la diaphyse du radius avec luxation de la radio-ulnaire distale.'],
      ['Essex-Lopresti', 'Fracture de la tête radiale, rupture de la membrane interosseuse et luxation de la radio-ulnaire distale.']] },
  ]],
  ['poignet', 'Poignet', [
    { nom: 'AO 2R3', objet: 'Fractures du radius distal', types: [
      ['A', 'Extra-articulaire.'],
      ['B', 'Articulaire partielle : B1 sagittale (styloïde radiale), B2 marginale dorsale (Barton), B3 marginale palmaire (Barton inversé).'],
      ['C', 'Articulaire complète : C1 simple, C2 comminution métaphysaire, C3 comminution articulaire.']] },
    { nom: 'Fernandez', objet: 'Fractures du radius distal selon le mécanisme', types: [
      ['I', 'Flexion : métaphysaire (Pouteau-Colles, Goyrand-Smith).'],
      ['II', 'Cisaillement : marginales (Barton, styloïde radiale).'],
      ['III', 'Compression : enfoncement articulaire (die-punch).'],
      ['IV', 'Avulsion : fractures-luxations radio-carpiennes.'],
      ['V', 'Haute énergie : association des précédentes.']] },
    { nom: 'Critères d’instabilité de Lafontaine', objet: 'Radius distal : risque de déplacement secondaire', types: [
      ['Critères', 'Bascule dorsale de plus de 20°, comminution dorsale, trait articulaire radio-carpien, fracture de l’ulna associée, âge supérieur à 60 ans.']],
      note: 'Trois critères ou plus : fracture instable.' },
    { nom: 'Herbert', objet: 'Fractures du scaphoïde', types: [
      ['A', 'Fracture récente stable : A1 tubercule, A2 col non déplacée (incomplète).'],
      ['B', 'Fracture récente instable : B1 oblique distale, B2 col déplacée, B3 pôle proximal, B4 fracture-luxation du carpe, B5 comminutive.'],
      ['C', 'Retard de consolidation.'],
      ['D', 'Pseudarthrose : D1 fibreuse, D2 scléreuse.']] },
    { nom: 'Schernberg', objet: 'Scaphoïde : siège du trait', types: [
      ['I', 'Pôle proximal.'], ['II', 'Corps haut.'], ['III', 'Corps bas.'], ['IV', 'Trans-tubérositaire.'], ['V', 'Pied du scaphoïde.'], ['VI', 'Tubercule distal.']] },
    { nom: 'Mayfield', objet: 'Instabilité péri-lunaire', types: [
      ['I', 'Rupture scapho-lunaire.'], ['II', 'Luxation luno-capitale.'], ['III', 'Rupture luno-triquétrale : luxation péri-lunaire.'], ['IV', 'Luxation antérieure du lunatum.']] },
  ]],
  ['main', 'Main', [
    { nom: 'Base du premier métacarpien', objet: 'Fractures articulaires et extra-articulaires', types: [
      ['Bennett', 'Fracture-luxation articulaire à deux fragments : le fragment médial reste en place, la diaphyse est tirée par le long abducteur.'],
      ['Rolando', 'Fracture articulaire comminutive, en T ou en Y.'],
      ['Extra-articulaire', 'Trait transversal ou oblique de la base.']] },
    { nom: 'Zones de Verdan', objet: 'Plaies des tendons fléchisseurs', types: [
      ['Zone 1', 'En aval de l’insertion du fléchisseur superficiel.'],
      ['Zone 2', 'Canal digital, de la poulie A1 à l’insertion du superficiel (« no man’s land »).'],
      ['Zone 3', 'Paume, du canal carpien à la poulie A1.'],
      ['Zone 4', 'Canal carpien.'],
      ['Zone 5', 'Avant-bras.']] },
    { nom: 'Doyle', objet: 'Doigt en maillet', types: [
      ['I', 'Lésion fermée, avec ou sans petit arrachement osseux.'], ['II', 'Plaie tendineuse.'], ['III', 'Perte de substance cutanée et tendineuse.'], ['IV', 'Fracture articulaire : enfant (IVA), 20 à 50 % de la surface (IVB), plus de 50 % avec subluxation (IVC).']] },
  ]],
  ['rachis', 'Rachis', [
    { nom: 'Denis', objet: 'Rachis thoraco-lombaire : trois colonnes', types: [
      ['Tassement', 'Colonne antérieure seule.'],
      ['Burst', 'Colonnes antérieure et moyenne : recul du mur postérieur.'],
      ['Seat-belt (Chance)', 'Colonnes moyenne et postérieure en distraction.'],
      ['Fracture-luxation', 'Les trois colonnes, en translation ou rotation.']],
      note: 'Atteinte de deux colonnes ou plus : lésion instable.' },
    { nom: 'AO Spine (Magerl)', objet: 'Rachis thoraco-lombaire', types: [
      ['A', 'Compression du corps vertébral : A1 tassement cunéiforme, A2 séparation (pincer), A3 burst incomplet, A4 burst complet.'],
      ['B', 'Lésion en distraction : B1 osseuse (Chance), B2 ligamentaire postérieure, B3 hyperextension.'],
      ['C', 'Translation ou rotation : déplacement dans tous les plans.']] },
    { nom: 'Anderson et D’Alonzo', objet: 'Fractures de l’odontoïde', types: [
      ['I', 'Pointe de l’odontoïde.'], ['II', 'Base (col) de l’odontoïde : risque élevé de pseudarthrose.'], ['III', 'Trait dans le corps de C2.']] },
    { nom: 'Effendi (modifiée par Levine)', objet: 'Fracture des isthmes de C2 (pendu)', types: [
      ['I', 'Déplacement de moins de 3 mm, sans angulation.'], ['II', 'Déplacement de plus de 3 mm et angulation.'], ['IIA', 'Angulation importante sans translation (flexion-distraction).'], ['III', 'Luxation des articulaires C2-C3 associée.']] },
    { nom: 'ASIA / Frankel', objet: 'Déficit neurologique', types: [
      ['A', 'Complet : aucune fonction motrice ni sensitive en S4-S5.'], ['B', 'Sensitif incomplet, moteur complet.'], ['C', 'Moteur incomplet : force inférieure à 3 sous la lésion.'], ['D', 'Moteur incomplet : force supérieure ou égale à 3.'], ['E', 'Normal.']] },
  ]],
  ['bassin', 'Bassin et cotyle', [
    { nom: 'Tile', objet: 'Fractures de l’anneau pelvien', types: [
      ['A', 'Stable : arc postérieur intact (avulsions, aile iliaque, sacrum transversal bas).'],
      ['B', 'Instabilité rotatoire, stabilité verticale : B1 livre ouvert, B2 compression latérale, B3 bilatérale.'],
      ['C', 'Instabilité rotatoire et verticale : rupture complète de l’arc postérieur.']] },
    { nom: 'Young et Burgess', objet: 'Anneau pelvien selon le mécanisme', types: [
      ['APC', 'Compression antéro-postérieure : I diastasis de moins de 2,5 cm ; II ouverture sacro-iliaque antérieure ; III rupture sacro-iliaque complète.'],
      ['LC', 'Compression latérale : I impaction sacrée ; II fracture en croissant de l’aile ; III « windswept pelvis ».'],
      ['VS', 'Cisaillement vertical.'],
      ['CM', 'Mécanisme combiné.']] },
    { nom: 'Denis', objet: 'Fractures du sacrum', types: [
      ['Zone 1', 'Aileron, en dehors des foramens.'], ['Zone 2', 'Trans-foraminale.'], ['Zone 3', 'Canal sacré : troubles sphinctériens fréquents.']] },
    { nom: 'Judet et Letournel', objet: 'Fractures du cotyle', types: [
      ['Élémentaires', 'Paroi postérieure ; colonne postérieure ; paroi antérieure ; colonne antérieure ; transversale.'],
      ['Associées', 'En T ; colonne postérieure + paroi postérieure ; transversale + paroi postérieure ; colonne antérieure + hémi-transversale postérieure ; deux colonnes.']],
      note: 'Lecture sur la face et les deux obliques de Judet (alaire et obturatrice) : lignes ilio-pectinée et ilio-ischiatique, bords antérieur et postérieur, toit, U radiologique.' },
  ]],
  ['hanche', 'Fémur proximal', [
    { nom: 'Garden', objet: 'Fractures du col fémoral', types: [
      ['I', 'Engrenée en valgus (coxa valga).'],
      ['II', 'Complète non déplacée.'],
      ['III', 'Déplacée en varus, travées de la tête désaxées.'],
      ['IV', 'Déplacement complet, travées de la tête parallèles à celles du cotyle.']],
      note: 'Garden I et II : ostéosynthèse ; III et IV : arthroplastie chez le sujet âgé.' },
    { nom: 'Pauwels', objet: 'Col fémoral : obliquité du trait', types: [
      ['I', 'Moins de 30° sur l’horizontale : compression.'], ['II', 'De 30 à 50°.'], ['III', 'Plus de 50° : cisaillement, instable.']] },
    { nom: 'AO 31A', objet: 'Fractures trochantériennes', types: [
      ['A1', 'Per-trochantérienne simple, stable.'],
      ['A2', 'Per-trochantérienne comminutive : petit trochanter détaché, mur latéral fragile.'],
      ['A3', 'Inter-trochantérienne : trait inversé ou transversal.']],
      note: 'A1 : vis-plaque ou clou ; A2 instable et A3 : clou.' },
    { nom: 'Pipkin', objet: 'Fractures de la tête fémorale (luxation postérieure)', types: [
      ['I', 'Sous la fovéa.'], ['II', 'Au-dessus de la fovéa (zone portante).'], ['III', 'I ou II avec fracture du col.'], ['IV', 'I ou II avec fracture du cotyle.']] },
    { nom: 'Vancouver', objet: 'Fractures péri-prothétiques du fémur', types: [
      ['A', 'Trochantérienne : AG grand trochanter, AL petit trochanter.'],
      ['B1', 'Autour de la tige, tige stable.'],
      ['B2', 'Tige descellée, stock osseux correct.'],
      ['B3', 'Tige descellée, stock osseux insuffisant.'],
      ['C', 'À distance de la pointe de la tige.']] },
    { nom: 'Delbet', objet: 'Fractures du col fémoral de l’enfant', types: [
      ['I', 'Trans-épiphysaire.'], ['II', 'Trans-cervicale.'], ['III', 'Cervico-trochantérienne.'], ['IV', 'Inter-trochantérienne.']] },
  ]],
  ['femur', 'Fémur : diaphyse et extrémité distale', [
    { nom: 'Winquist et Hansen', objet: 'Comminution des fractures diaphysaires', types: [
      ['0', 'Pas de comminution.'], ['I', 'Petit fragment, contact cortical de plus de 75 %.'], ['II', 'Contact cortical de plus de 50 %.'], ['III', 'Contact de moins de 50 % : instable en rotation et en longueur.'], ['IV', 'Comminution circonférentielle, aucun contact.']] },
    { nom: 'AO 33', objet: 'Fractures du fémur distal', types: [
      ['A', 'Extra-articulaire (supra-condylienne).'],
      ['B', 'Unicondylienne : B1 condyle latéral, B2 condyle médial, B3 frontale (Hoffa).'],
      ['C', 'Sus- et inter-condylienne : C1 simple, C2 comminution métaphysaire, C3 comminution articulaire.']] },
  ]],
  ['genou', 'Genou : patella et plateau tibial', [
    { nom: 'Schatzker', objet: 'Fractures des plateaux tibiaux', types: [
      ['I', 'Séparation pure du plateau latéral.'],
      ['II', 'Séparation-enfoncement du plateau latéral.'],
      ['III', 'Enfoncement pur du plateau latéral.'],
      ['IV', 'Plateau médial (équivalent de luxation du genou).'],
      ['V', 'Bicondylienne, métaphyse en continuité avec la diaphyse.'],
      ['VI', 'Dissociation métaphyso-diaphysaire.']],
      note: 'Luo (trois colonnes, sur le scanner) : médiale, latérale, postérieure — guide le choix des voies d’abord.' },
    { nom: 'Fractures de la patella', objet: 'Description', types: [
      ['Transversale', 'La plus fréquente ; appareil extenseur interrompu si déplacée.'],
      ['Verticale', 'Appareil extenseur continu.'],
      ['Comminutive', 'En étoile, par choc direct.'],
      ['Polaire', 'Pôle supérieur ou inférieur ; « sleeve fracture » chez l’enfant.']] },
    { nom: 'Meyers et McKeever', objet: 'Fractures des épines tibiales', types: [
      ['I', 'Non déplacée.'], ['II', 'Soulèvement antérieur, charnière postérieure.'], ['III', 'Fragment libre ; IV comminutif (Zaricznyj).']] },
    { nom: 'Schenck', objet: 'Luxations du genou', types: [
      ['KD I', 'Un seul croisé rompu.'], ['KD II', 'Les deux croisés, collatéraux intacts.'], ['KD III', 'Les deux croisés et un collatéral (M médial, L latéral).'], ['KD IV', 'Les quatre ligaments.'], ['KD V', 'Fracture-luxation.']],
      note: 'Suffixes C (lésion artérielle) et N (lésion nerveuse).' },
  ]],
  ['jambe', 'Jambe', [
    { nom: 'AO 42', objet: 'Fractures de la diaphyse tibiale', types: [
      ['A', 'Simple : A1 spiroïde, A2 oblique, A3 transversale.'], ['B', 'À coin : torsion, flexion ou fragmenté.'], ['C', 'Complexe : comminutive ou bifocale.']] },
    { nom: 'Syndrome des loges', objet: 'Critères d’aponévrotomie', types: [
      ['Clinique', 'Douleur disproportionnée, majorée à l’étirement passif des muscles de la loge ; loge tendue. Les pouls restent perçus.'],
      ['Pression', 'Pression différentielle (diastolique moins pression de loge) inférieure à 30 mmHg.']] },
  ]],
  ['cheville', 'Cheville et pilon tibial', [
    { nom: 'Danis et Weber', objet: 'Fractures malléolaires : niveau du trait fibulaire', types: [
      ['A', 'Sous la syndesmose : supination-adduction.'],
      ['B', 'Au niveau de la syndesmose, trait spiroïde : syndesmose lésée une fois sur deux.'],
      ['C', 'Au-dessus de la syndesmose : syndesmose rompue (Maisonneuve si le trait est au col de la fibula).']] },
    { nom: 'Lauge-Hansen', objet: 'Fractures malléolaires selon le mécanisme', types: [
      ['Supination-adduction', 'Fibula transversale basse, puis malléole médiale verticale.'],
      ['Supination-rotation externe', 'La plus fréquente : syndesmose antérieure, fibula spiroïde, malléole postérieure, malléole médiale.'],
      ['Pronation-abduction', 'Malléole médiale, syndesmose, fibula comminutive au-dessus de l’interligne.'],
      ['Pronation-rotation externe', 'Malléole médiale, syndesmose, fibula haute, malléole postérieure.']] },
    { nom: 'Haraguchi', objet: 'Fractures de la malléole postérieure (scanner)', types: [
      ['I', 'Postéro-latérale oblique (fragment de Volkmann).'], ['II', 'Transversale étendue à la malléole médiale.'], ['III', 'Petit fragment en coquille.']] },
    { nom: 'Rüedi et Allgöwer', objet: 'Fractures du pilon tibial', types: [
      ['I', 'Articulaire non déplacée.'], ['II', 'Déplacée, sans comminution articulaire.'], ['III', 'Comminution et impaction articulaires.']],
      note: 'AO 43 : A extra-articulaire, B articulaire partielle, C articulaire complète.' },
  ]],
  ['pied', 'Pied', [
    { nom: 'Hawkins', objet: 'Fractures du col du talus', types: [
      ['I', 'Non déplacée.'],
      ['II', 'Subluxation ou luxation sous-talienne.'],
      ['III', 'Luxation sous-talienne et talo-crurale.'],
      ['IV', 'Avec luxation talo-naviculaire (Canale).']],
      note: 'Le risque de nécrose du corps croît de I (moins de 15 %) à III-IV (presque constant). Signe de Hawkins à 6-8 semaines : liseré sous-chondral clair, de bon pronostic.' },
    { nom: 'Sanders', objet: 'Fractures thalamiques du calcanéus (scanner coronal)', types: [
      ['I', 'Non déplacée, quel que soit le nombre de traits.'],
      ['II', 'Deux fragments de la facette postérieure (A, B, C selon le siège du trait).'],
      ['III', 'Trois fragments, avec enfoncement central.'],
      ['IV', 'Quatre fragments ou plus : comminution.']] },
    { nom: 'Essex-Lopresti', objet: 'Calcanéus : type de fracture articulaire', types: [
      ['Langue', 'Le fragment thalamique reste solidaire de la tubérosité.'],
      ['Enfoncement thalamique', 'Le fragment thalamique est séparé et enfoncé dans le corps.']],
      note: 'Angle de Böhler normal : 25 à 40° ; il s’effondre dans les enfoncements.' },
    { nom: 'Quénu et Küss', objet: 'Luxations tarso-métatarsiennes (Lisfranc)', types: [
      ['Homolatérale', 'Les cinq métatarsiens déplacés du même côté.'],
      ['Isolée', 'Un ou deux rayons seulement.'],
      ['Divergente', 'Le premier rayon en dedans, les autres en dehors.']] },
    { nom: 'Lawrence et Botte', objet: 'Fractures de la base du cinquième métatarsien', types: [
      ['Zone 1', 'Avulsion de la tubérosité (court fibulaire, aponévrose plantaire).'],
      ['Zone 2', 'Jonction métaphyso-diaphysaire (fracture de Jones) : vascularisation précaire.'],
      ['Zone 3', 'Diaphyse proximale : fracture de fatigue.']] },
  ]],
];
