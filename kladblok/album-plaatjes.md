# Albumplaatjes klaar voor het Bijbelkidsalbum

De inhoud van het album staat nu in `albumHoofdstukken` in `script.js`: hoofdstukken met elk een titel en een geordende rij plaatjes, in vakken van 16:9, 2 kolommen × 3 rijen per pagina (12 per dubbele pagina). De game rekent de dubbele pagina's zelf uit; elk hoofdstuk begint op een nieuwe dubbele pagina. De BO-plaatjes staan in `images/album/plaatjes/` en zitten in het album. Nu alleen titels; tekst bij de plaatjes komt misschien later.

Werkwijze per plaatje (vastgesteld 29 okt 2026): eerst diepgaand onderzoek naar hoe het eruitzag (ChatGPT), dan een beeldprompt met verhoudingen in plaats van maten, dan vijf varianten laten maken en de beste kiezen, en tot slot nalopen op wat historisch moet kloppen. Een dierenplaatje meegeven als voorbeeld voor de stijl.

## Brede plaatjes (16:9)

Elk plaatje heeft voortaan één beeld in 16:9, voor het boek én het venster. Het brede beeld staat in `images/album/plaatjes-breed/` als webp van 1920 × 1080 (kwaliteit 82) en hoort in `albumHoofdstukken` bij het plaatje als `breed: "plaatjes-breed/<naam>.webp"`. Het boek laadt een kleine versie met dezelfde naam uit `images/album/plaatjes-breed-klein/` (640 × 360, kwaliteit 82), het venster de grote. Een plaatje zonder `breed` toont tijdelijk het oude vierkante bestand, bijgesneden tot 16:9.

Werkwijze voor een nieuw breed plaatje:

1. Zet het goedgekeurde brede beeld om naar `images/album/plaatjes-breed/<naam>.webp`: 1920 × 1080 (LANCZOS, bij een afwijkende verhouding gecentreerd bijgesneden), kwaliteit 82, method=6. Het bronbestand niet wijzigen.
2. Maak de kleine versie met het script, vanuit de projectmap:

   ```
   C:\Users\Gebruiker\AppData\Local\Programs\Python\Python312\python.exe tools\album-klein.py
   ```

   Het maakt alleen ontbrekende of verouderde kleine versies; `--alles` maakt ze allemaal opnieuw.
3. Zet `breed` bij het plaatje in `albumHoofdstukken`.
4. Draai `controleer-consistentie.py`: die meldt een PROBLEEM als het brede bestand of de kleine versie ontbreekt.

Vervang je een bestaand breed beeld (zelfde naam), draai dan het script opnieuw en hoog `ALBUM_VERSIE` op (albumteller in CLAUDE.md).

## Tempels

De tent van samenkomst, de tempel van Salomo en de tempel van Herodes zijn nog in ontwikkeling, staan buiten de repo en komen later samen in een eigen hoofdstuk. Afzonderlijke tempelvoorwerpen (menora, ark enz.) volgen nog.
