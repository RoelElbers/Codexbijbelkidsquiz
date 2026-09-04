# Inventaris naslag-/informatiemenu

Peildatum: 1 september 2026. Op 4 september 2026 zijn de kerkenpagina's
nagerekend en zijn het bovenliggende menu en Tabel 1 opnieuw opgebouwd, omdat
die een structuur beschreven die niet meer bestond. Tabel 2 en de delen 1 tot en
met 3 dateren nog van de peildatum, met de bijgewerkte regels erin verwerkt.

De woordtellingen van de bijgewerkte rijen zijn het getal van 1 september plus
het gemeten verschil ten opzichte van de staat vóór de wijzigingen (commit
`d3a4701`), met dezelfde teller op beide versies. De telmethode van 1 september
zelf bleek niet exact te reproduceren — op ongewijzigde pagina's scheelt het
vijf woorden — dus het verschil is betrouwbaar, de absolute waarde erft de
onzekerheid van de peildatum.

## Vooraf: één feit dat de opdracht raakt

Het naslagmateriaal bestaat **niet uit losse pagina's**. Woordenboek, Maten,
geld & tijd en de Verborgen Schat-naslag zijn geen `.html`-bestanden maar
rubrieken in de Ontdekken-hub: drie overlay-schermen in `index.html`, gevuld
vanuit `ontdekRubrieken` (`script.js`) met inhoud uit `ontdekken-inhoud.js`.
Tabel 1 wijst daarom niet naar bestandsnamen maar naar die drie vindplaatsen.

*Tot 1 september stonden deze onderwerpen als losse overlays in `index.html`
(`#naslag-scherm`, `#woordenboek-scherm`, `#maten-scherm`,
`#verborgenschat-naslag-scherm`), bereikbaar via een menu "Naslag & uitleg".
Die overlays en dat menu bestaan niet meer; zie punt 4 en 5 onder "Wat opvalt".*

Het enige informatiemenu in de repo dat wél uit losse pagina's bestaat, is de
**kerken-tak** (`kerken.html` en verder). Die is bereikbaar als rubriek in de
Ontdekken-hub — niet meer als eigen knop in het Bijbeltraining-menu — en is
hieronder als tweede tabel apart geïnventariseerd.

Telmethode van de kolommen:

- *Aantal regels HTML* = regels van het overlay-blok (`<div id="…">` t/m de
  bijbehorende `</div>`), respectievelijk het volledige bestand bij losse
  pagina's.
- *Aantal woorden lopende tekst* = zichtbare tekst, zonder HTML-commentaar,
  zonder knoplabels en zonder de voettekst-navigatie. Kopjes en tabelcellen
  tellen wél mee.

## Bovenliggend menu

Herzien op 4 september 2026, rechtstreeks uit de bron.

`#bijbeltraining-scherm` (`index.html`, r. 409–417), titel **Bijbeltraining**,
**twee** ingangen plus een Terug-knop:

| Knoptekst | Gaat naar | Vindplaats van de functie |
|---|---|---|
| Oefenen & nalezen | boekkeuze → niveau → `#modus-scherm` | `openOefenenNalezen()`, `script.js` r. 8745 |
| Ontdekken | `#ontdek-scherm` — de hub hieronder | `openOntdekken()`, `script.js` r. 8874 |

De vijf ingangen die hier tot 1 september stonden (Oefenen, Naslag & uitleg,
Vragen & uitleg, Catechese, De verschillende kerken) bestaan niet meer als
losse knoppen in dit menu.

## Tabel 1 — De Ontdekken-hub

Drie overlays in `index.html` dragen de hub:

| Scherm | `index.html` | Gevuld door |
|---|---|---|
| `#ontdek-scherm` — de rubriekknoppen | r. 500–511 | `bouwOntdekRubrieken()`, `script.js` r. 8882 |
| `#ontdek-lijst-scherm` — onderwerpen binnen één rubriek | r. 513–523 | `bouwOntdekLijst()`, `script.js` r. 8932 |
| `#ontdek-detail-scherm` — één lexicon of artikel | r. 525–535 | `openOntdekOnderwerp()`, `script.js` r. 8979 |

De rubrieken zelf staan in `const ontdekRubrieken` (`script.js` r. 8836–8863).
De inhoud staat niet in `index.html` maar in `ontdekken-inhoud.js`, dat vóór
`script.js` wordt ingeladen.

| Rubriek (knoptekst) | `id` | Onderwerpen | Inhoud uit | Vindplaats inhoud | Bijzonderheden |
|---|---|---|---|---|---|
| Woordenboek | `woorden` | 1 onderwerp, 44 termen | `ONTDEK_WOORDENBOEK` | `ontdekken-inhoud.js` r. 26 | type `lexicon`; één onderwerp, dus `kiesOntdekRubriek()` (r. 8910) slaat het lijstscherm over |
| Wie is wie | `wie` | 0 | — | *(geen)* | knop staat er wel; `onderwerpen: []` op r. 8842 |
| Waar gebeurde het | `waar` | 0 | — | *(geen)* | knop staat er wel; `onderwerpen: []` op r. 8843 |
| Hoe leefden ze toen | `hoe` | 3 — Geld, Maten, Tijd | `ONTDEK_GELD`, `ONTDEK_MATEN`, `ONTDEK_TIJD` | `ontdekken-inhoud.js` r. 78, 98, 112 | heeft als enige een `inleiding`: `ONTDEK_HOE_INLEIDING` (r. 76, 47 woorden) |
| Verborgen patronen | `patronen` | 3 | `ONTDEK_PATRONEN` | `ontdekken-inhoud.js` r. 135 | de canonieke artikelen; doelwit van de `verwijstNaar`-verwijzingen uit Verborgen Schat |
| De verschillende kerken | `kerken` | *(n.v.t.)* | externe pagina | `script.js` r. 8855–8856 | `extern: "kerken.html"`; `kiesOntdekRubriek()` doet `window.location.href` en verlaat het spel |
| Verborgen Schat | `schat` | 16 | `ONTDEK_SCHAT` | `ontdekken-inhoud.js` r. 185 | op slot tot `isVerborgenSchatOntgrendeld()` (r. 9034); 3 onderwerpen zijn `verwijstNaar`-verwijzingen, 2 zijn plaatshouders |

Verantwoording bij de omvang: hieronder staat mijn eigen meting van 4 september
2026, niet de telling van 1 september. Die telmethode is niet exact te
reproduceren (op ongewijzigde pagina's scheelt het vijf woorden), dus deze
getallen zijn **niet** vergelijkbaar met de kolom "Woorden lopende tekst" in
Tabel 2. Geteld zijn de tekstvelden (`term`, `item`, `kop`, `titel`, `naam`,
`uitleg`, `tekst`) binnen elke constante, met HTML-tags eruit.

| Constante | Woorden (eigen meting 04-09-2026) |
|---|---|
| `ONTDEK_WOORDENBOEK` | 2113 |
| `ONTDEK_GELD` | 550 |
| `ONTDEK_MATEN` | 201 |
| `ONTDEK_TIJD` | 339 |
| `ONTDEK_PATRONEN` | 1089 |
| `ONTDEK_SCHAT` | 930 |
| **Totaal** | **5222** |

Ter vergelijking, met dezelfde onzekerheid: het Woordenboek stond op 1 september
op 2112 woorden en meet nu 2113 — die inhoud is dus vrijwel ongewijzigd
meeverhuisd. Maten, geld & tijd stond op 1010 en de drie artikelen samen meten
nu 1090; de Verborgen Schat-naslag stond op 1068 en `ONTDEK_SCHAT` meet 930,
wat past bij de drie verwijzingen en twee plaatshouders.

## Wat opvalt

Losse waarnemingen bij het narekenen op 4 september 2026. Alleen vastgesteld —
in de code is niets gewijzigd.

1. **Twee lege rubrieken.** "Wie is wie" en "Waar gebeurde het" hebben
   `onderwerpen: []` (`script.js` r. 8842–8843). De knoppen staan gewoon in het
   rubriekscherm en zijn niet vergrendeld; wie erop klikt komt in een leeg
   lijstscherm. `bouwOntdekLijst()` vangt dat op — het commentaar zegt "een lege
   rubriek zegt dat eerlijk" — dus het lijkt bewust, maar het is wel de enige
   plek waar een knop tot niets leidt.

2. **Twee plaatshouder-artikelen.** `het-oor-van-malchus` en
   `de-brief-aan-de-hebreeen` (`ontdekken-inhoud.js` r. 203–207) bevatten
   alleen "Deze uitleg wordt nog geschreven."

3. **De Verborgen Schat loopt uit de pas met de vragenpool.** `ONTDEK_SCHAT`
   heeft 16 onderwerpen; `verborgenSchatVragen` heeft er sinds 4 september 17.
   De commentaarregels in `ONTDEK_SCHAT` verwijzen naar vraagnummers ("Vragen 13
   en 14", "Vragen 15 en 16"), wat op een één-op-één-koppeling wijst. De nieuwe
   vraag over het oog van de naald heeft dus nog geen onderwerp in de hub.

4. **Een verwijzing in commentaar die nergens meer heen gaat.** `index.html`
   r. 559 zegt over het steunscherm: "Zelfde opzet als #maten-scherm /
   #woordenboek-scherm". Die twee overlays bestaan niet meer; dit is de enige
   plek in de hele repo waar die namen nog voorkomen.

5. **Verder geen resten van de oude overlay-structuur.** Gezocht in
   `index.html`, `script.js`, `style.css` en `lang/nl.js` naar `#naslag-scherm`,
   `#woordenboek-scherm`, `#maten-scherm`, `#verborgenschat-naslag-scherm` en de
   functies `openNaslag()`, `openWoordenboek()`, `openMaten()` en
   `openVerborgenSchatNaslag()`: op het commentaar van punt 4 na komt geen van
   die namen nog voor. De CSS-klassen `naslag-term`, `naslag-kop`,
   `naslag-item`, `naslag-diamant` en `catechese-knop` zijn géén resten — die
   worden door `ontdekken-inhoud.js` en `script.js` nog volop gebruikt.

6. **De kerken-rubriek verlaat de app.** `kiesOntdekRubriek()` doet bij een
   rubriek met `extern` een `window.location.href` (`script.js` r. 8914–8916).
   Terugkomen kan alleen via "Terug naar de quiz" in de voettekst van de
   kerkenpagina's, en dat start het spel opnieuw op. Het is de enige rubriek die
   het spel uit stuurt.

7. **Alle interne verwijzingen kloppen.** De drie `verwijstNaar`-doelen
   (`verborgen-patronen-sandwich`, `verborgen-getallen-153`,
   `verborgen-patronen-paulus-brieven`) bestaan alle drie, en elke `ONTDEK_`-
   constante wordt precies één keer vanuit `script.js` gebruikt. Geen dode
   inhoud, geen dubbele definities.

8. **Het woordenboek telt nu 44 termen**, waar de inventaris van 1 september er
   45 noemde. Niet nagetrokken waar dat verschil vandaan komt.

## Tabel 2 — Menu "De verschillende kerken" (losse pagina's)

| Titel zoals getoond (h1) | Bestandsnaam | Regels HTML | Woorden lopende tekst | Kopjes (h2/h3) | Gelinkt vanaf |
|---|---|---|---|---|---|
| De verschillende kerken | `kerken.html` | 38 | 55 | *(geen h2/h3)* | `index.html` (knop "De verschillende kerken"), `kerken-katholiek.html`, `kerken-protestant.html`, `kerken-katholiek-onderwerpen.html` |
| De katholieke kerk *(voorportaal)* | `kerken-katholiek.html` | 36 | 37 | *(geen h2/h3)* | `kerken.html` (knop "Ik ben katholiek"), `kerken-protestant.html`, `kerken-protestant-kerken.html` |
| De katholieke kerk *(onderwerpenmenu)* | `kerken-katholiek-onderwerpen.html` | 40 | 33 | *(geen h2/h3)* | `kerken-katholiek.html` (knop "Verder →") en alle vier de katholieke onderwerp-pagina's |
| De zeven sacramenten | `kerken-katholiek-sacramenten.html` | 135 | 831 | h2: Drie sacramenten om erbij te horen; Twee sacramenten om beter te worden; Twee sacramenten om je leven aan iets te geven; Zeven keer God — h3: Het doopsel; De eerste communie; Het vormsel; De biecht; De ziekenzalving; De wijding; Het huwelijk | `kerken-katholiek-onderwerpen.html` (knop "De sacramenten") |
| Petrus en de paus | `kerken-katholiek-petrus.html` | 118 | 627 | h2: De sleutels; Weid mijn schapen; En daarna?; De paus van nu; Waarom het bijzonder is | `kerken-katholiek-onderwerpen.html` (knop "Petrus en de paus") |
| Maria | `kerken-katholiek-maria.html` | 155 | 738 | h2: Ja; Haar lied; Op de bruiloft; Onder het kruis; In de bovenzaal; Waarom katholieken tot Maria bidden; De rozenkrans; Zij wijst altijd verder | `kerken-katholiek-onderwerpen.html` (knop "Maria") |
| De heilige Mis | `kerken-katholiek-mis.html` | 142 | 856 | h2: Het eerste deel: luisteren; Het tweede deel: de eucharistie; De communie; Wat je ziet, ruikt en hoort; Waarom elke zondag; Wat je daarna doet; Eén tafel | `kerken-katholiek-onderwerpen.html` (knop "De heilige Mis") |
| De protestantse kerken *(voorportaal)* | `kerken-protestant.html` | 37 | 37 | *(geen h2/h3)* | `kerken.html` (knop "Ik ben protestant"), `kerken-katholiek.html`, `kerken-katholiek-onderwerpen.html`, de vier katholieke onderwerp-pagina's, `kerken-protestant-kerken.html` |
| Wij zijn samen één lichaam | `kerken-protestant-kerken.html` | 135 | 1058 | h2: De gereformeerde en hervormde traditie; De evangelisch-lutherse traditie; De evangelische en pinkstertraditie; De baptisten; De doopsgezinden; Eén familie | `kerken-protestant.html` (knop "Verder →") |

Opmerking bij de laatste rij: de `<title>` is "De verschillende protestantse
kerken", de `<h1>` op de pagina is "Wij zijn samen één lichaam", en de knop
ernaartoe heet alleen "Verder →". Drie verschillende benamingen voor dezelfde
pagina.

## 1. Weespagina's — bestaan wel, maar zijn nergens vanuit een menu gelinkt

Geen enkel bestand in de repo verwijst naar deze pagina's:

- `bedankt.html` (37 regels, 52 woorden, h1 "Bedankt") — nul inkomende links.
- `bedankt-donatie.html` (37 regels, 38 woorden, h1 "Hartelijk dank") — nul
  inkomende links. Beide lijken bedoeld als terugkeer-adres van een externe
  betaaldienst; in de repo zelf staat er geen link naartoe.
- `metaaltest.html` (247 regels, 2 woorden tekst, `<title>` "Metaaltest —
  glansvarianten") — nul inkomende links; opmaak-/stijltest.
- `niveautest.html` (345 regels, 9 woorden tekst, `<title>` "Niveautest —
  huidig scherm versus metaalknoppen") — nul inkomende links; opmaak-/stijltest.
- `_backup_voor_profielen/index.html` en `_backup_voor_scrollverwijder/index.html`
  — back-upkopieën, buiten elke navigatie.
- `Iconen trofeeën/index.html` — losse map, buiten elke navigatie.

Grensgeval, geen echte weespagina:

- `steunen.html` (87 regels, 502 woorden) staat in géén enkel HTML-menu. De
  enige ingang vanuit het spel loopt via `lang/nl.js` regel 80
  (`url: "steunen.html"`), die het `#steun-scherm` vult. Daarnaast wordt hij wel
  gelinkt vanuit `contact.html`, `privacyverklaring.html`, `bedankt.html` en
  `bedankt-donatie.html`.

## 2. Pagina's die naar elkaar linken (onderlinge verwijzingen)

Binnen de kerken-tak:

- `kerken.html` ↔ `kerken-katholiek.html` (heen: "Ik ben katholiek"; terug:
  "← Terug naar de kerken")
- `kerken.html` ↔ `kerken-protestant.html` (heen: "Ik ben protestant"; terug:
  "← Terug naar de kerken")
- `kerken-katholiek.html` → `kerken-katholiek-onderwerpen.html` ("Verder →");
  de onderwerpenpagina linkt niet terug naar het voorportaal maar naar
  `kerken.html`
- `kerken-katholiek-onderwerpen.html` ↔ `kerken-katholiek-sacramenten.html`,
  `…-petrus.html`, `…-maria.html`, `…-mis.html` (heen: de vier onderwerpknoppen;
  terug: "← Terug naar de katholieke kerk", op elke onderwerp-pagina twee keer,
  boven en onder)
- `kerken-protestant.html` ↔ `kerken-protestant-kerken.html` (heen: "Verder →";
  terug: "← Terug naar de protestantse kerken", twee keer)
- Kruislinks tussen de twee takken, telkens in de zin "Ben je protestant/
  katholiek? Dan vind je hier …":
  - `kerken-katholiek.html` → `kerken-protestant.html`
  - `kerken-katholiek-onderwerpen.html` → `kerken-protestant.html`
  - `kerken-katholiek-sacramenten.html` → `kerken-protestant.html`
  - `kerken-katholiek-petrus.html` → `kerken-protestant.html`
  - `kerken-katholiek-maria.html` → `kerken-protestant.html`
  - `kerken-katholiek-mis.html` → `kerken-protestant.html`
  - `kerken-protestant.html` → `kerken-katholiek.html`
  - `kerken-protestant-kerken.html` → `kerken-katholiek.html`

Buiten de kerken-tak:

- `contact.html` ↔ `privacyverklaring.html` (beide kanten op)
- `contact.html` ↔ `steunen.html` (beide kanten op)
- `privacyverklaring.html` ↔ `steunen.html` (beide kanten op)
- `bedankt.html` en `bedankt-donatie.html` → `steunen.html` en
  `privacyverklaring.html` (eenrichting; er komt niets terug)
- Alle losse pagina's → `index.html` ("Terug naar de quiz", in de voettekst en
  bij de meeste ook bovenaan als kruimelpad)
- `index.html` → `contact.html` en `privacyverklaring.html` (via `openTabblad()`
  in `#instellingen-scherm`) en → `kerken.html` (via `#bijbeltraining-scherm`)

Binnen `index.html` verwijzen twee woordenboek-lemma's expliciet naar elkaar:
"Gemeente" → *Zie ook: kerk* en "Kerk" → *Zie ook: gemeente*.

## 3. Pagina's met meer dan één duidelijk onderwerp

**Maten, geld & tijd** — vier onderwerpen onder één titel. Stond tot 1
september als `#maten-scherm` in `index.html`; nu de rubriek "Hoe leefden ze
toen" (`ONTDEK_GELD`, `ONTDEK_MATEN`, `ONTDEK_TIJD` in `ontdekken-inhoud.js`
r. 78, 98 en 112). Geld staat er als eigen onderwerp naast Maten:

- Geld in de Bijbel
- Lengte
- Inhoud
- Tijd *(bevat zelf ook nog drie tabellen: Bijbelse uren, zonsopgang per
  seizoen, en de nachtwaken)*

**Verborgen Schat-naslag** — twaalf losse onderwerpen; ze horen inhoudelijk bij
drie verschillende dingen: het Laatste Avondmaal, het boek Openbaring en de
verteltechniek van Marcus. Stond tot 1 september als
`#verborgenschat-naslag-scherm` in `index.html`; nu de rubriek "Verborgen Schat"
(`ONTDEK_SCHAT`, `ontdekken-inhoud.js` r. 185), inmiddels met zestien
onderwerpen — de vier erbij staan in "Wat opvalt", punt 3:

- Van wie was het huis met de bovenzaal van het Laatste Avondmaal?
- Wat betekent "apocalyps" eigenlijk?
- Waarom noemt Jezus zichzelf "de Alfa en de Omega"?
- Wie wordt in Openbaring "het Lam" genoemd, en waarom juist een lam?
- Waar staat het getal zeven symbolisch voor?
- Hoe eindigt de Bijbel in Openbaring?
- Wat betekent "een tijd, tijden en een halve tijd"?
- Waar komen de vier levende wezens vandaan?
- De boom des levens — begin en einde
- De zeven gemeenten
- Het nieuwe Jeruzalem
- De sandwich-techniek van Marcus

**`kerken-katholiek-sacramenten.html`** — zeven sacramenten, gegroepeerd in
drie blokken:

- Drie sacramenten om erbij te horen: Het doopsel / De eerste communie / Het vormsel
- Twee sacramenten om beter te worden: De biecht / De ziekenzalving
- Twee sacramenten om je leven aan iets te geven: De wijding / Het huwelijk
- Zeven keer God *(afsluiting)*

**`kerken-protestant-kerken.html`** — vijf verschillende kerkstromingen op één
pagina:

- De gereformeerde en hervormde traditie
- De evangelisch-lutherse traditie
- De evangelische en pinkstertraditie
- De baptisten
- De doopsgezinden
- Eén familie *(afsluiting)*

De sectie **Het Leger des Heils** is op 04-09-2026 van deze pagina verwijderd.
De **Vrije Evangelische Gemeenten** werden tot diezelfde datum in de
pinkstersectie opgesomd; zij staan nu als eigen alinea in "Eén familie", bij de
kerken die zich niet in één stroming laten indelen. Beide staan niet als eigen
`h2` in de bron — dit is de enige plek in deze inventaris waar ze voorkomen.

**`kerken-katholiek-maria.html`** — acht kopjes die twee soorten inhoud
mengen: vijf Bijbelscènes en drie stukken over katholieke praktijk:

- Ja / Haar lied / Op de bruiloft / Onder het kruis / In de bovenzaal *(scènes)*
- Waarom katholieken tot Maria bidden / De rozenkrans / Zij wijst altijd
  verder *(praktijk en uitleg)*

**`contact.html`** — vijf onderwerpen, waarvan twee ook elders staan:

- Stuur ons een bericht
- Wat je kunt insturen *(met h3: Een vraag voor de quiz / Er klopt iets niet /
  In de klas of catechese)*
- Over de vragen
- Steunen *(onderwerp van `steunen.html`)*
- Bedrijfsgegevens *(staat ook onderaan `steunen.html`)*

**`privacyverklaring.html`** — elf kopjes; naast de privacyonderwerpen ook
"Doneren", dat inhoudelijk bij `steunen.html` hoort:

- Wie is verantwoordelijk / Wat er op je eigen apparaat wordt bewaard *(h3:
  Zelf wissen)* / Cookies / Geen meetprogramma's, geen advertenties / Hosting /
  Het contactformulier / Voor ouders en begeleiders / Doneren / Uw rechten /
  Wijzigingen

**`index.html` als geheel** — op 1 september 859 regels, ± 4281 woorden
zichtbare tekst en 25 overlay-schermen in één bestand, waaronder het volledige
woordenboek (2112 woorden), Maten, geld & tijd (1010) en de Verborgen
Schat-naslag (1068).

*Nagerekend op 4 september: `index.html` telt nu **660 regels** en **21**
overlay-schermen. De drie genoemde naslagblokken zitten er niet meer in; hun
tekst staat in `ontdekken-inhoud.js` (zie Tabel 1). Het woordgetal ± 4281 is
niet opnieuw vastgesteld — dat is met de telmethode van de peildatum gemeten.*
