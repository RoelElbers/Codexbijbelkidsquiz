# Wachtlijst

*Aangelegd 4 september 2026. Wat er nog ligt. Nieuwe punten komen hier bij zodra
ze opkomen; een punt gaat er weer uit in dezelfde commit waarin het wordt
afgerond. Zie de gedragsafspraak in `CLAUDE.md`: dit staat hier zodat het niet in
elk antwoord herhaald hoeft te worden.*

## Opschoning

- **De twee bronbestanden zijn gewaarschuwd, niet opgeschoond.**
  `verborgen-schat-vragen-bijbelkidsquiz.md` (zes zinnen met "overlevering") en
  `verborgen-schat-naslag-bijbelkidsquiz.md` (drie echte treffers). Ze dragen
  sinds 04-09 een waarschuwing bovenaan; de teksten zelf staan er nog.
  Zie `kladblok/bronnen-audit.md`.
- **Woordenboekterm "Allerheiligste"** in `ontdekken-inhoud.js` r. 27: "Volgens
  de traditie was God daar zelf aanwezig". De laatste naamloze bronvermelding in
  dat bestand. Anders van aard dan de andere gevallen — hier gaat het om de
  Joodse tempeltheologie; Exodus 25:22 en Leviticus 16 zijn de aanwijsbare
  plaatsen.
- **"Erfzonde" als woordenboekterm overwegen.** Toe te voegen aan
  `ONTDEK_WOORDENBOEK` in `ontdekken-inhoud.js`; dat is de plek waar begrippen
  kort worden uitgelegd, naast termen als *Genade*, *Verbond*, *Vergeving* en
  *Zonde*. Verder alleen behandelen waar het bij een concrete vraag hoort. Niet
  op de kerkpagina's: die laten zien wat een traditie meebrengt en leggen geen
  leer uit.

## Bouw en gedrag van het spel

- **Lege rubrieken in de Ontdekken-hub.** "Wie is wie" en "Waar gebeurde het"
  hebben `onderwerpen: []` (`script.js` r. 8842–8843). De knoppen staan er wel
  en zijn niet vergrendeld, dus ze leiden naar een leeg lijstscherm. Ze horen
  vergrendeld te zijn zolang de rubrieken leeg zijn. Zie het punt hieronder
  over het opnieuw indelen van de Ontdekken-hub: met de eerste vulling is
  "Wie is wie" niet leeg meer en blijft alleen "Waar gebeurde het" over.
- **Ontdekken-hub opnieuw indelen: Ontdekken → rubriek → onderwerp →
  artikel.** De eerste twee lagen bestaan al (`ontdekRubrieken` met
  `onderwerpen[]`); wat ontbreekt is een artikellaag met eigen config, zoals
  `ONTDEK_WOORDENBOEK` die nu al heeft. Per artikel: `id`, `titel`,
  `onderwerp`, `samenvatting`, `tekst`, `zieOok`, `zichtbaar` (half af werk
  kan dan in het bestand blijven staan) en `volgorde`. Een rubriek met weinig
  artikelen slaat de onderwerplaag over en toont meteen de artikelen. Het
  woordenboek wordt een rubriek als alle andere. Rubrieksnamen open houden
  ("Wie is wie", niet "De twaalf apostelen"), zodat één artikel al genoeg is
  en het menu niet onaf lijkt. Eerste vulling: artikel "Jakobus de
  Rechtvaardige" in de rubriek Wie is wie, onderwerp apostelen; tekst staat in
  de chat van 18 september 2026. Raakt twee bestaande punten: het punt
  hierboven over lege rubrieken en het punt onderaan over eigen webadressen
  (de artikel-`id` kan meteen als slug voor een latere URL dienen).
- **Avatarbeschrijvingen liggen klaar, maar er is geen plek om ze te tonen.**
  De set is sinds 07-09 compleet: alle tien de avatars hebben een alinea. De
  parkeerreden — een halve set — is daarmee vervallen. Wat ontbreekt is de
  invoer zelf: `avatarNamen` (`script.js` r. 7196) koppelt een sleutel alleen
  aan een weergavenaam, er is geen veld voor een beschrijving en geen scherm
  dat er een toont. Zie `kladblok/KLADBLOK-avatarbeschrijvingen.md`, laatste
  paragraaf, voor de twee keuzes die daarbij horen.
- **`BETA_MODUS` op `false`.** `script.js` r. 4. Zolang die op `true` staat toont
  het startscherm het "TESTVERSIE"-lint. Moet om vóór de release.
- **Krullende aanhalingstekens vervangen door rechte.** De regel staat in
  `CLAUDE.md`; pools worden bijgewerkt zodra ze inhoudelijk worden doorgelopen.
  Al gedaan: de pools die tot nu toe zijn afgerond. Nog open op 20-09-2026:
  36 voorkomens in `script.js`, allemaal in Openbaring — 26 in brons (bij de
  vragen over 3:20, 21:5, 4:8, 22:20 en 21:3) en 10 in zilver (bij 22:8-9).
  Als de laatste pool is doorgelopen, nagaan of er nog iets overblijft,
  bijvoorbeeld in losse pools zoals `metgezellenVragen` of in
  `ontdekken-inhoud.js`.
- **Aanhalingstekens in antwoorden gelijktrekken binnen een pool.** Bij Brieven
  van Johannes brons staan bij vraag 8 alle vier de antwoorden tussen enkele
  aanhalingstekens ('Mijn kinderen' enz.), terwijl vraag 7 ze alleen om één
  woord in het goede antwoord heeft ('kinderen'). Aanhalingstekens in maar één
  optie trekken de aandacht en kunnen een aanwijzing worden. Meenemen bij het
  doorlopen van die pool, en daarna breder nakijken: staan er elders
  antwoordsets waarin maar één optie aanhalingstekens heeft?
- **Brieven van Johannes is scheef verdeeld: 11 brons, 15 zilver, 26 goud.**
  Goud is twee keer zo groot als bij de andere boeken en brons de kleinste van
  de game, waardoor in brons bijna elke vraag elke ronde langskomt. Bij het
  doorlopen van goud nagaan of er vragen bij zitten die eigenlijk brons of
  zilver zijn.

## Vragenwerk

- **Afleidersronde over alle pools.** Dezelfde soort correcties als bij
  Kolossenzen, Tessalonicenzen en Timoteüs & Titus, maar dan boekbreed:
  afleiders die hetzelfde beweren, scheve antwoordlengtes, vraagteksten die het
  antwoord weggeven.
- **Boek-voor-boek-ronde.** Eerstvolgende: **Romeinen**.

## Groter werk: eigen webadressen voor de Ontdekken-artikelen

De artikelen en het woordenboek in de Ontdekken-hub zijn nu alleen bereikbaar
via JavaScript, in een overlay onder `index.html`. Ze hebben geen eigen
webadres. Daardoor kan Google ze niet of nauwelijks indexeren: er is geen URL om
naar te verwijzen en de tekst staat niet in de HTML die een crawler ophaalt.

Om vindbaar te worden op zoekopdrachten als "wat is een plengoffer" zouden die
artikelen eigen HTML-pagina's moeten worden, zoals de kerkpagina's dat al zijn.
Dat is bouwwerk, geen opschoning, en het staat los van de release van
1 oktober.

Zie het punt over het opnieuw indelen van de Ontdekken-hub, onder "Bouw en
gedrag van het spel": de artikel-`id` uit die indeling kan meteen als slug voor
zo'n latere URL dienen.

## Groter werk: Engelse versie later mogelijk maken

`lang/nl.js` bevat de UI-teksten al, dus die stap is gezet. Wat nog aan het
Nederlands vastzit:

1. **De vragenpools staan in `script.js`** en zijn niet vertaalbaar maar
   herschrijfbaar — ze hangen aan Nederlandse vertaalkeuzes.
2. **Boeknamen zijn tegelijk sleutel en weergave** (`vragenData`, `boekNaarKey`,
   bestandsnamen van trofeeën). Dat vraagt om een taalvrije sleutel met een
   aparte weergavenaam.
3. **De denominatielijn gaat uit van het Nederlandse kerklandschap** en werkt
   anders in het Engels.

Nu geen voorbereidend werk doen, wel de afspraak: **elke nieuwe structuur krijgt
een taalvrije id als sleutel en de zichtbare tekst in een apart veld.**
