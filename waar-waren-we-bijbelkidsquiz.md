# Bijbelkidsquiz — waar waren we
*Notitie voor de volgende sessie — bijgewerkt 9 juni 2026*

## Klaar deze sessie (staat in de code, gecommit)
- **Naslag "Maten, geld & tijd":** nachtwaken-tabel én uren-tabel toegevoegd, met
  uitleg. Eerlijke nuance: de Romeins-Joodse telling begon het 1e uur om 6.00, maar
  de tabel volgt de gangbare bijbelcommentaren (1e uur ≈ 7.00) zodat de bekende
  voorbeelden (3e/6e/9e uur) kloppen.
- **Vragenbank doorgelicht en ontdubbeld** over alle vier de evangeliën: dubbele/te
  gelijkende vragen samengevoegd of verwijderd; de talent-vraag (Matteüs) van expert
  naar gevorderd verplaatst.
- **Twee al verwerkte draftbestanden verwijderd** (`matteus-beginner-10-nieuwe-vragen.js`,
  `maten-geld-tijd-vragen.js`) — stonden al in `script.js`.
- **Nieuwe vragen:** 9 Johannes "Ik ben"-vragen + 5 beeldspraak-vragen (zout, licht,
  vissers van mensen, ranken, schapen) in Matteüs/Johannes.
- **Terug-knop met bevestiging tijdens elke ronde** (evangelie, schatkist, Verborgen
  Schat): afbreken slaat niets op en reset de rondestatus volledig. Centraal in de
  gedeelde rondelogica.
- **Fullscreen-icoon** opgeschoond: het wankele teken vervangen door een inline-SVG.
  Het "kruisje over de &" uit de vorige notitie bleek de fullscreen-knop van de
  browser te zijn — géén fout in de pagina.
- **Schermnavigatie:** doorgang tussen scherm 1 (Evangeliën, het startscherm) en
  scherm 2 (`#nt-scherm-2`). Randpijlen die bij hover langs de rand onthullen,
  touch-vangnet, en pijltjestoetsen (→ vooruit, ← terug).
- **Scherm 2 gevuld met de vier groep-tegels** (diepblauw/goud-stijl): Handelingen,
  Brieven van Paulus, Algemene brieven, Openbaring. Nog geen vragen erachter; een
  klik toont een rustige "binnenkort speelbaar"-melding (`openNtGroep`).
- **Vragentelling vastgelegd** in `vragentelling-bijbelkidsquiz.md`.

## Stand vragen (zie vragentelling-bijbelkidsquiz.md)
Matteüs 57 · Marcus 47 · Lucas 46 · Johannes 51 (samen 201) + Verborgen Schat 12
= **213 speelbaar**.

## Nog te doen (openstaand)
1. **Scherm 2 verder afmaken "zoals het hoofdscherm":**
   - eigen achtergrond/sfeerbeeld (nu nog de startscherm-afbeelding onder een
     donkerblauwe sluier);
   - prijzenkast / voortgang per groep, vergelijkbaar met de evangeliën;
   - inhoud achter de tegels (niveaus + vragenpools per groep), zodra er vragen voor
     Handelingen/brieven/Openbaring zijn.
2. **Crazy / Insane-kist bouwen** (hoort bij de brieven van Paulus). De 6 vragen
   staan klaar in `spelstructuur-bijbelkidsquiz.md`, nog niet in `script.js`.
3. **Beeld startscherm 3** (Openbaring) nog te maken.
4. **Placeholder-sjabloon opruimen?** In `script.js` (rond regel 74) staat een
   `Placeholdervraag …`-hulpfunctie. Nagaan of die nog ergens gebruikt wordt of weg kan.

## Voor later
- Hardware/videomachine: specs uitzoeken als je richting video/animatie gaat.
- Uitbreiding naar Handelingen en de rest van het Nieuwe Testament (meer boeken in
  het menu).
