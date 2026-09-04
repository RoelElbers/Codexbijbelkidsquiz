# Inventaris naslag-/informatiemenu

Peildatum: 1 september 2026. Bijgewerkt op 4 september 2026 voor de
kerkenpagina's; zie de gemarkeerde regels hieronder.

De woordtellingen van de bijgewerkte rijen zijn het getal van 1 september plus
het gemeten verschil ten opzichte van de staat vóór de wijzigingen (commit
`d3a4701`), met dezelfde teller op beide versies. De telmethode van 1 september
zelf bleek niet exact te reproduceren — op ongewijzigde pagina's scheelt het
vijf woorden — dus het verschil is betrouwbaar, de absolute waarde erft de
onzekerheid van de peildatum.

## Vooraf: één feit dat de opdracht raakt

Het menu waaronder **"Maten, geld & tijd"** valt, heet **Naslag & uitleg**
(`index.html`, regel 528–543). Dat menu bestaat **niet uit losse pagina's**.
Alle drie de items zijn overlay-blokken *binnen* `index.html`; er is geen enkel
eigen `.html`-bestand voor. De kolom "Bestandsnaam" staat daarom voor alle
items op `index.html`, met het `id` van het overlay-blok erbij.

Het enige informatiemenu in de repo dat wél uit losse pagina's bestaat, is de
**kerken-tak** (`kerken.html` en verder). Die is bereikbaar uit hetzelfde
bovenliggende menu (Bijbeltraining) en is hieronder als tweede tabel apart
geïnventariseerd.

Telmethode van de kolommen:

- *Aantal regels HTML* = regels van het overlay-blok (`<div id="…">` t/m de
  bijbehorende `</div>`), respectievelijk het volledige bestand bij losse
  pagina's.
- *Aantal woorden lopende tekst* = zichtbare tekst, zonder HTML-commentaar,
  zonder knoplabels en zonder de voettekst-navigatie. Kopjes en tabelcellen
  tellen wél mee.

## Bovenliggend menu

> **Achterhaald sinds de Ontdekken-hub (vastgesteld 04-09-2026).** Deze paragraaf
> en heel Tabel 1 beschrijven een structuur die niet meer in de bron staat.
> `#bijbeltraining-scherm` heeft nu twee knoppen — "Oefenen & nalezen" en
> "Ontdekken" — en de overlays `#naslag-scherm`, `#woordenboek-scherm`,
> `#maten-scherm` en `#verborgenschat-naslag-scherm` bestaan niet meer in
> `index.html`; de enige vindplaats van die namen is een toelichtend commentaar
> op regel 559. Woordenboek, Maten en de Verborgen Schat-naslag zitten nu in de
> Ontdekken-hub (`ontdekRubrieken` in `script.js`, inhoud uit
> `ontdekken-inhoud.js`), en ook de kerken-tak hangt daar als rubriek
> "De verschillende kerken" met `extern: "kerken.html"` (`script.js`, r. 8856) —
> niet meer als eigen knop in het Bijbeltraining-menu. `index.html` telt nu 660
> regels, niet 859. Tabel 2 hieronder is wél nagerekend en actueel.

`#bijbeltraining-scherm` (`index.html`, regel 409–420), titel **Bijbeltraining**,
vijf ingangen:

| Knoptekst | Gaat naar |
|---|---|
| Oefenen | overlay in `index.html` |
| Naslag & uitleg | `#naslag-scherm` — het menu hieronder |
| Vragen & uitleg | overlay in `index.html` |
| Catechese | overlay in `index.html` |
| De verschillende kerken | `kerken.html` — losse pagina's, tweede tabel |

## Tabel 1 — Menu "Naslag & uitleg"

| Titel zoals getoond | Bestandsnaam | Regels HTML | Woorden lopende tekst | Kopjes (h2/h3) | Gelinkt vanaf |
|---|---|---|---|---|---|
| Naslag & uitleg *(het menu zelf)* | `index.html` → `#naslag-scherm` (r. 528–543) | 16 | 13 | h2: Naslag & uitleg | `#bijbeltraining-scherm`, knop "Naslag & uitleg" (`openNaslag()`) |
| Woordenboek | `index.html` → `#woordenboek-scherm` (r. 548–600) | 53 | 2112 | h2: Woordenboek *(geen h3; 45 termen als `.naslag-term`)* | `#naslag-scherm`, knop "Woordenboek" (`openWoordenboek()`) |
| Maten, geld & tijd | `index.html` → `#maten-scherm` (r. 654–734) | 81 | 1010 | h2: Maten, geld & tijd — h3: Geld in de Bijbel; Lengte; Inhoud; Tijd | `#naslag-scherm`, knop "Maten, geld & tijd" (`openMaten()`) |
| Verborgen Schat | `index.html` → `#verborgenschat-naslag-scherm` (r. 607–650) | 44 | 1068 | h2: Verborgen Schat — h3 (12): Van wie was het huis met de bovenzaal van het Laatste Avondmaal?; Wat betekent "apocalyps" eigenlijk?; Waarom noemt Jezus zichzelf "de Alfa en de Omega"?; Wie wordt in Openbaring "het Lam" genoemd, en waarom juist een lam?; Waar staat het getal zeven symbolisch voor?; Hoe eindigt de Bijbel in Openbaring?; Wat betekent "een tijd, tijden en een halve tijd"?; Waar komen de vier levende wezens vandaan?; De boom des levens — begin en einde; De zeven gemeenten; Het nieuwe Jeruzalem; De sandwich-techniek van Marcus | `#naslag-scherm`, knop "Verborgen Schat" (`openVerborgenSchatNaslag()`) — standaard vergrendeld, ontgrendelt bij de vlag `verborgenschat_voltooid` |

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

**`index.html` → `#maten-scherm`** — vier onderwerpen onder één titel:

- Geld in de Bijbel
- Lengte
- Inhoud
- Tijd *(bevat zelf ook nog drie tabellen: Bijbelse uren, zonsopgang per
  seizoen, en de nachtwaken)*

**`index.html` → `#verborgenschat-naslag-scherm`** — twaalf losse onderwerpen,
elk met een eigen h3; ze horen inhoudelijk bij drie verschillende dingen: het
Laatste Avondmaal, het boek Openbaring en de verteltechniek van Marcus:

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

**`index.html` als geheel** — 859 regels, ± 4281 woorden zichtbare tekst en 25
overlay-schermen in één bestand, waaronder het volledige woordenboek (2112
woorden), Maten, geld & tijd (1010) en de Verborgen Schat-naslag (1068).
