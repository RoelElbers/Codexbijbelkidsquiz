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

- **Lege rubriek in de Ontdekken-hub.** "Waar gebeurde het" heeft
  `onderwerpen: []` (`script.js` r. 8654). De knop staat er wel en is niet
  vergrendeld, dus hij leidt naar een leeg lijstscherm. Hij hoort vergrendeld
  te zijn zolang de rubriek leeg is. ("Wie is wie" is sinds 26-09 gevuld met
  Tempel en synagoge.)
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
- **Losgekoppelde Ontdekken-artikelen nalopen.** Sinds de Verborgen Schat is
  herzien, verwijst niets meer naar acht artikelen: over de Alfa en de Omega,
  het Lam, het einde van de Bijbel, de boom des levens, de zeven gemeenten, het
  nieuwe Jeruzalem, het oor van Malchus en de brief aan de Hebreeën. De laatste
  twee zijn placeholders met de tekst "Deze uitleg wordt nog geschreven". Per
  artikel beslissen: verwijderen, of onderbrengen bij de nieuwe indeling van de
  Ontdekken-hub (zie het punt daarover). Meenemen bij die herindeling, niet los
  oppakken.
- **Fullscreen-knop over de naslagtekst op de tablet.** Op 820×1180 (tablet
  staand) valt de ronde fullscreen-knop rechtsboven over het begin van de tekst
  in het naslagvak van Ontdekken. Bestond al vóór Wie is wie. Meenemen bij het
  opnieuw indelen van het menu / de tabletondersteuning.
- **Verborgen Schat: vragen zonder koppeling naar hun artikel.** Acht vragen
  hebben een artikel in `ONTDEK_SCHAT`, maar geen `catecheseId`, zodat de knop
  op de onthullingskaart ontbreekt: de bovenzaal, het getal zeven, "een tijd,
  tijden en een halve tijd", de vier levende wezens, het nieuwe Jeruzalem, het
  oor van Malchus, de brief aan de Hebreeën en het oog van de naald. Bij
  Malchus en Hebreeën is het artikel nog een placeholder ("Deze uitleg wordt
  nog geschreven"). Zes artikelen hebben geen vraag: apocalyps, de Alfa en de
  Omega, het Lam, hoe de Bijbel eindigt, de boom des levens en de zeven
  gemeenten. Zes vragen hebben geen artikel: Tertius, de grote letters in
  Galaten, papyrus P52, hoofdstuk- en versnummers, de codex en de vis. Raakt
  het punt "Losgekoppelde Ontdekken-artikelen nalopen" hierboven.
- **Donatiezone van de lantaarn weg zodra `PLAKBOEK_ACTIEF` op `true` gaat.**
  Met de plakboekvlag is de lantaarn linksonder het Bijbelkidsalbum; zonder
  vlag is hij nog de donatielantaarn (`.donatie-zone`, `initDonatieLantaarn`
  in `script.js`). Gaat het album definitief live, dan verdwijnt de
  donatiezone van de lantaarn. Doneren gaat dan alleen via Instellingen →
  Steun de Bijbelkidsquiz en via de pagina Voor ouders en begeleiders.
  Bewuste keuze: geen geldvraag op het scherm van het kind, ook geen pop-up.
- **Bijbelkidsalbum: achtergrond en boek zijn placeholders.** Het albumscherm
  (`#album-scherm`, `.album-zaal` en `.album-boek` in `style.css`) heeft een
  CSS-verloop als achtergrond en een CSS-boek; Roel maakt de echte
  afbeeldingen. De plek van het opschrift "Bijbelkidsalbum" onder de lantaarn
  (`.album-opschrift`) wacht op Roels oordeel (screenshot in `tmp/`).

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
