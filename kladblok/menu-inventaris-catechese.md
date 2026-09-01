# Inventaris catechese-menu

Peildatum: 1 september 2026. Alleen vastgesteld, niets gewijzigd.
Zusterbestand van `kladblok/menu-inventaris.md`.

## Vooraf: hoe dit menu in elkaar zit

Net als "Naslag & uitleg" bestaat het catechese-menu **niet uit losse pagina's**.
Het gaat zelfs een stap verder: hier staat de inhoud niet eens in HTML, maar in
twee config-arrays in `script.js`:

- `catecheseCategorieen` — `script.js` regel 8987–8990, twee categorieën.
- `catecheseArtikelen` — `script.js` regel 8995–9050, drie artikelen.

In `index.html` staan alleen drie lege overlay-schermen die door JavaScript
worden gevuld:

| Scherm | Regels in `index.html` | Rol | Gevuld door |
|---|---|---|---|
| `#catechese-scherm` | 496–503 (8) | landing, categorieknoppen | `bouwCatecheseCategorieen()` |
| `#catechese-lijst-scherm` | 507–514 (8) | artikellijst van één categorie | `bouwCatecheseLijst()` |
| `#catechese-artikel-scherm` | 518–523 (6) | één artikel-detail | `openCatecheseArtikel(id)` |

Samen 22 regels HTML voor het hele menu. De kolom "Bestandsnaam" hieronder
verwijst daarom naar `script.js` met het regelbereik van het artikelobject.

Telmethode:

- *Regels* = regels van het object in `script.js` (van `{` tot `}`).
- *Woorden lopende tekst* = woorden in het `tekst`-veld van het artikel.
- *Kopjes* = wat er daadwerkelijk als kop op het scherm verschijnt.
  `openCatecheseArtikel()` (regel 9126–9143) rendert precies één kop per
  artikel: `<h3 class="naslag-kop">` met de titel, gevolgd door één `<p>` per
  alinea (gesplitst op lege regels). Sub-kopjes bestaan in dit menu niet.

## Bovenliggend menu

`#bijbeltraining-scherm` (`index.html`, regel 409–420) → knop **Catechese**
(regel 416, `openCatechese()`). Zelfde vertrekpunt als Naslag & uitleg.

## Tabel 1 — Categorieën

| Titel zoals getoond | Bestandsnaam | Regels | Woorden lopende tekst | Kopjes | Gelinkt vanaf |
|---|---|---|---|---|---|
| Catechese *(het menu zelf)* | `index.html` → `#catechese-scherm` (r. 496–503) | 8 | 5 ("Catechese", "Kies een onderwerp") | h2: Catechese | `#bijbeltraining-scherm`, knop "Catechese" (`openCatechese()`) |
| Verborgen getallen | `script.js` r. 8988 (array-element) | 1 | — *(alleen een label)* | h2: Verborgen getallen *(de lijsttitel wordt met de categorienaam gevuld)* | `#catechese-scherm`, knop gegenereerd door `bouwCatecheseCategorieen()` |
| Verborgen patronen | `script.js` r. 8989 (array-element) | 1 | — *(alleen een label)* | h2: Verborgen patronen | `#catechese-scherm`, knop gegenereerd door `bouwCatecheseCategorieen()` |

## Tabel 2 — Artikelen

| Titel zoals getoond | Bestandsnaam | Regels | Woorden lopende tekst | Kopjes | Gelinkt vanaf |
|---|---|---|---|---|---|
| De 153 vissen | `script.js` r. 8996–9013, id `verborgen-getallen-153` | 18 | 336 (7 alinea's) | h3: De 153 vissen *(enige kop; geen sub-kopjes)* | 1. lijst "Verborgen getallen" (`bouwCatecheseLijst()`); 2. deep-link vanaf de Verborgen-Schat-onthullingskaart, knop "Meer ontdekken → Catechese" (`index.html` r. 398 → `vsRevealMeer()` → `script.js` r. 8132) |
| De verborgen schat in de brieven van Paulus | `script.js` r. 9014–9037, id `verborgen-patronen-paulus-brieven` | 24 | 563 (10 alinea's) | h3: De verborgen schat in de brieven van Paulus *(enige kop)* | 1. lijst "Verborgen patronen"; 2. deep-link vanaf de VS-onthullingskaart (`script.js` r. 8145) |
| De sandwich-techniek van Marcus | `script.js` r. 9038–9049, id `verborgen-patronen-sandwich` | 12 | 175 (4 alinea's) | h3: De sandwich-techniek van Marcus *(enige kop)* | 1. lijst "Verborgen patronen"; 2. deep-link vanaf de VS-onthullingskaart (`script.js` r. 8119) |

Verdeling: "Verborgen getallen" heeft 1 artikel, "Verborgen patronen" 2.
Totaal 1074 woorden lopende tekst in het hele catechese-menu — ter vergelijking:
alleen al het Woordenboek onder Naslag & uitleg telt er 2112.

## 1. Weespagina's — bestaat wel, maar is nergens vanuit het menu bereikbaar

Op artikelniveau: **geen enkele**. Alle drie de `catecheseId`-verwijzingen
(`script.js` r. 8119, 8132, 8145) wijzen naar een bestaand artikel, en alle drie
de artikelen hebben een `categorie` die exact overeenkomt met een naam in
`catecheseCategorieen` — ze verschijnen dus alle drie in een lijst. Er is geen
categorie zonder artikelen en geen artikel zonder categorie.

Wel onbereikbaar zijn twee schermteksten:

- `script.js` r. 9110 — `"Voor dit onderwerp komen binnenkort artikelen."`
  Deze melding staat in `bouwCatecheseLijst()` voor het geval een categorie leeg
  is. Beide categorieën hebben artikelen, dus deze tekst kan op dit moment niet
  op het scherm komen.
- `script.js` r. 8568 — `"Binnenkort kun je hier meer ontdekken in de
  Catechese."` Dit is de terugvaltekst van `vsRevealMeer()` als er geen
  `catecheseId` is. Maar de knop "Meer ontdekken → Catechese" wordt in
  `toonVsReveal()` (r. 8531) alleen getoond wanneer er wél een `catecheseId` is.
  De melding is daarmee onbereikbaar zolang die twee voorwaarden zo blijven staan.

Buiten de live code:

- `_backup_voor_profielen/script.js` en `_backup_voor_scrollverwijder/script.js`
  bevatten allebei een oudere `catecheseArtikelen` met **twee** artikelen
  (`verborgen-getallen-153` en `verborgen-patronen-paulus-brieven`); de
  sandwich-tekst ontbreekt daar nog. Die back-ups staan buiten elke navigatie.

## 2. Onderlinge verwijzingen

Binnen het catechese-menu verwijzen de artikelen **niet** naar elkaar: er staat
geen enkele link, knop of "zie ook" in de drie `tekst`-velden. De navigatie is
strikt één richting op en weer terug:

- `#bijbeltraining-scherm` → `#catechese-scherm` (knop "Catechese") en terug via
  `sluitCatechese()`
- `#catechese-scherm` → `#catechese-lijst-scherm` (categorieknop) en terug via
  `terugCatecheseLijst()`
- `#catechese-lijst-scherm` → `#catechese-artikel-scherm` (artikelknop) en terug
  via `terugCatecheseArtikel()`

Kruisverbindingen met de rest van het spel:

- **Verborgen Schat → Catechese.** Drie Verborgen-Schat-vragen dragen een
  `catecheseId` en tonen op de onthullingskaart (`#vs-reveal-scherm`,
  `index.html` r. 391–402) de knop "Meer ontdekken → Catechese". Die opent het
  artikel rechtstreeks, met `herkomst = "vs-reveal"`, zodat de Terug-knop
  terugkeert naar de onthullingskaart in plaats van naar de artikellijst
  (`terugCatecheseArtikel()`, r. 9147–9157). Dit is de enige deep-link in het
  hele menu, en hij loopt maar één kant op: vanuit een artikel is er geen weg
  naar de bijbehorende vraag.
- De drie `reveal`-teksten op die kaart (50, 35 en 69 woorden) zijn zelfstandig
  geschreven samenvattingen: geen enkele zin ervan komt letterlijk terug in het
  artikel waar de knop naartoe wijst.
- `contact.html` noemt "catechese" alleen als woord in het kopje "In de klas of
  catechese" — dat is geen link naar dit menu.

**Letterlijke dubbeling tussen twee menu's.** De tekst van het catechese-artikel
"De sandwich-techniek van Marcus" staat óók in het Naslag-menu, als h3-blok in
`#verborgenschat-naslag-scherm` (`index.html` r. 649). De twee versies zijn zin
voor zin identiek: alle 8 zinnen van de naslagversie (169 woorden, één alinea)
komen woordelijk terug in het artikel (179 woorden, 4 alinea's). Het artikel
heeft er één zin bij: *"Kun jij nog een sandwich vinden als je Marcus leest?"*.
Twee bestanden, twee menu's, dezelfde tekst.

## 3. Artikelen met meer dan één duidelijk onderwerp

Geen van de artikelen heeft sub-kopjes — alles staat onder één h3. De
onderwerpen zijn daarom per alinea benoemd.

**De 153 vissen** — 7 alinea's, minstens vier onderwerpen onder één titel:

- Het verhaal zelf: de visvangst na de opstanding, het net dat niet scheurt
  (Johannes 21)
- Waarom Johannes zo'n precies getal noteert (zijn stijl van verborgen lagen)
- De uitleg uit de oude overlevering: 153 vissoorten → het evangelie voor alle
  volken; en het niet-scheurende net → niemand gaat verloren
- De getalsuitleg van Augustinus: 153 = 1+2+…+17, en 17 = 10 geboden + 7 gaven
- Het rekenkundige weetje: 153 = 1³ + 5³ + 3³
- Het voorbehoud: deze betekenissen staan niet letterlijk in de Bijbel

**De verborgen schat in de brieven van Paulus** — 10 alinea's, het langste
artikel en het duidelijkst samengesteld:

- Onderwerp A: waarom de brieven in deze volgorde staan (op lengte, eerst
  gemeenten dan personen) — een boekenkundig onderwerp
- Onderwerp B: het nederigheidspatroon over drie brieven — 1 Korintiërs 15:9
  (jaar 54), Efeziërs 3:8 (jaar 60), 1 Timoteüs 1:15 (jaar 64), elk in een eigen
  alinea, met de conclusie erachteraan
- Onderwerp C: de theologische kanttekening dat Paulus tegelijk apostel bleef —
  "je mag weten wie je in God bent, en tegelijk klein blijven"
- Onderwerp D: het voorbehoud dat de jaartallen bij benadering zijn en dat de
  ontdekking geen Bijbelregel is
- Slotalinea: een vraag aan het kind ("Word jij van binnen groter of kleiner…")

**De sandwich-techniek van Marcus** — 4 alinea's, één onderwerp (de
verteltechniek), met twee voorbeelden en een slotvraag. Het enige bezwaar bij
dit artikel is niet de inhoud maar de dubbeling: zie punt 2 hierboven.
