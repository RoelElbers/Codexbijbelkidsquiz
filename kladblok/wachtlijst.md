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
  vergrendeld te zijn zolang de rubrieken leeg zijn.
- **Avatarbeschrijvingen liggen klaar, maar er is geen plek om ze te tonen.**
  De set is sinds 07-09 compleet: alle tien de avatars hebben een alinea. De
  parkeerreden — een halve set — is daarmee vervallen. Wat ontbreekt is de
  invoer zelf: `avatarNamen` (`script.js` r. 7196) koppelt een sleutel alleen
  aan een weergavenaam, er is geen veld voor een beschrijving en geen scherm
  dat er een toont. Zie `kladblok/KLADBLOK-avatarbeschrijvingen.md`, laatste
  paragraaf, voor de twee keuzes die daarbij horen.
- **`BETA_MODUS` op `false`.** `script.js` r. 4. Zolang die op `true` staat toont
  het startscherm het "TESTVERSIE"-lint. Moet om vóór de release.

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
