# Maquettes — mariage et événementiel

Maquettes de sites vitrines à présenter aux prospects : https://jeancdf.github.io/maquettes-mariage/

Cinq métiers, chacun avec ses trois formules. Tous les boutons, menus et formulaires fonctionnent ; les formulaires affichent un récapitulatif mais n’envoient rien.

| Métier | Essentiel (690 € HT) | Complet (1 190 € HT) | Sur mesure (1 990 à 2 990 € HT) |
| --- | --- | --- | --- |
| Wedding planner | `planner/essentiel.html` — Maison Joséphine | `planner/complet/` | `planner/sillage.html` — Sillage, lacs alpins |
| Photographe | `photographe/essentiel.html` — Studio Héliotrope | `photographe/complet/` | `photographe/alba.html` — Studio Alba, Lyon |
| Lieu de réception | `lieu/essentiel.html` — La Grange des Aulnes | `lieu/complet/` | `lieu/tilleuls.html` — Domaine des Tilleuls, Anjou |
| DJ et animation | `dj/essentiel.html` — Sonar Events | `dj/complet/` | `dj/nocturne.html` — Nocturne, Provence |
| Traiteur | `traiteur/essentiel.html` — Maison Garance | `traiteur/complet/` | `traiteur/oree.html` — Orée, Nantes |

- **Essentiel** : une page (formules et prix, infos pratiques, formulaire de demande).
- **Complet** : cinq pages — `index.html`, `prestations.html`, `realisations.html`, `a-propos.html`, `contact.html` — plus `mentions-legales.html`. Vérification de date (ou estimation pour le traiteur) qui pré-remplit le formulaire de contact, galerie filtrable avec visionneuse, FAQ, menu mobile.
- **Sur mesure** : identité et parcours propres (simulateur de budget, configurateur de devis, calendrier des dates libres…).

Pages utiles :

- `index.html` : tous les modèles, par métier.
- `comparer.html` : bascule rapide (formule : boutons ou touches 1 à 3 ; métier : boutons ou flèches ←/→ ; ancres `#traiteur-complet`, `#dj-sur-mesure`…).
- `kit/std.css`, `kit/std.js` : socle commun des formules Essentiel et Complet. `kit/bespoke.js` : rend fonctionnelles les maquettes sur mesure dessinées en deux versions (Alba, Tilleuls, Nocturne).

Les anciennes adresses (`essentiel.html`, `complet.html`, `alba.html`, `tilleuls.html`, `nocturne.html`) redirigent vers les nouvelles.

Établissements fictifs : tarifs, menus et informations illustratifs, coordonnées entre crochets à personnaliser.
Photographies : [Unsplash](https://unsplash.com) (licence Unsplash), utilisées à titre d’illustration.
