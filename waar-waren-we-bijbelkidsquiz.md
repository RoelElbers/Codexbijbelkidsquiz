# Bijbelkidsquiz — waar waren we
*Notitie voor de volgende sessie — bijgewerkt 11 juni 2026*

## Recent klaar (staat in de code, gecommit)
- **Schermnavigatie + scherm 2:** doorgang tussen scherm 1 (Evangeliën) en scherm 2
  (`#nt-scherm-2`, overige NT-boeken) met randpijlen/pijltjestoetsen; scherm 2 gevuld
  met de vier groep-tegels (Handelingen, Brieven van Paulus, Algemene brieven,
  Openbaring) — nog zonder vragen erachter ("binnenkort"-melding).
- **Catechese-sectie (data-gedreven geraamte):** menu-knop in Bijbeltraining + drie
  schermen (categorieën → artikel-lijst → artikel-detail). Categorieën en artikelen
  in config-arrays (`catecheseCategorieen`, `catecheseArtikelen`); elk artikel heeft
  een `id`. Scrollbaar gemaakt (categorielijst én artikel-detail).
- **Verborgen Schat — onthullingsscherm:** na elke beantwoorde VS-vraag een
  zelf-getempo'd kaartje (goud/donkerblauw) met goed/fout, de "verborgen boodschap"
  (`reveal`-veld) en knoppen "Meer ontdekken → Catechese" + "Volgende →". Alleen
  deze modus; de gewone quiz blijft snel.
- **153-vissen gekoppeld:** nieuwe categorie "Verborgen getallen" + artikel
  "De 153 vissen" (id `verborgen-getallen-153`); de VS-vraag verwijst ernaar via
  `catecheseId`. "Meer ontdekken" opent het artikel; **Terug** keert terug naar de
  kaart, zodat de ronde intact blijft.

## Stand vragen
Matteüs 57 · Marcus 47 · Lucas 46 · Johannes 51 (samen 201) + Verborgen Schat 13
= **214 speelbaar**. (Het overzicht `vragentelling-bijbelkidsquiz.md` dateert van
9 juni en noemt nog VS 12 / 213 — bij gelegenheid verversen.)

## Nog te doen (openstaand)
1. **Scherm 2 verder afmaken "zoals het hoofdscherm":** eigen achtergrond/sfeerbeeld,
   prijzenkast/voortgang per groep, en inhoud achter de tegels (niveaus + vragenpools).
2. **Catechese-inhoud invullen:** echte artikelteksten i.p.v. de placeholders bij
   "Wie is God?" en "Wie is Jezus?"; eventueel meer artikelen en `reveal`/`catecheseId`
   bij andere Verborgen-Schat-vragen.
3. **Crazy / Insane-kist bouwen** (hoort bij de brieven van Paulus). De 6 vragen staan
   klaar in `spelstructuur-bijbelkidsquiz.md`, nog niet in `script.js`.
4. **Beeld startscherm 3** (Openbaring) nog te maken.
5. **Placeholder-sjabloon opruimen?** In `script.js` (rond regel 74) staat een
   `Placeholdervraag …`-hulpfunctie. Nagaan of die nog ergens gebruikt wordt of weg kan.

## Voor later
- Hardware/videomachine: specs uitzoeken als je richting video/animatie gaat.
- Uitbreiding naar Handelingen en de rest van het Nieuwe Testament (meer boeken in
  het menu).
