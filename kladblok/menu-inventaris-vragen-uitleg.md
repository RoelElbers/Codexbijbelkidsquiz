# Inventaris menu "Vragen & uitleg"

Peildatum: 1 september 2026. Alleen vastgesteld, niets gewijzigd.
Derde deel, naast `kladblok/menu-inventaris.md` (Naslag & uitleg) en
`kladblok/menu-inventaris-catechese.md`.

## Vooraf: hoe dit menu in elkaar zit

Ook hier geen losse pagina's. "Vragen & uitleg" is read-only en leest
**rechtstreeks uit `vragenData`** — dezelfde array waar de quiz zelf uit speelt.
Er wordt niets gekopieerd; het menu heeft alleen eigen statusvariabelen
(`vuBoek`, `vuNiveau`, `script.js` r. 8821–8822).

Vier lege overlay-schermen in `index.html`, samen 41 regels:

| Scherm | Regels in `index.html` | Rol | Gevuld door |
|---|---|---|---|
| `#vu-boek-scherm` | 438–454 (17) | boekkeuze | `vulVuBoeken()` (r. 8838–8887) |
| `#vu-niveau-scherm` | 458–467 (10) | niveaukeuze | titel door `kiesVuBoek()` |
| `#vu-lijst-scherm` | 471–478 (8) | genummerde vragenlijst | `bouwVuLijst()` (r. 8920–8940) |
| `#vu-detail-scherm` | 482–487 (6) | uitleg bij één vraag | `openVuDetail()` (r. 8942–8971) |

De data staat in `script.js` in **136 losse statements**: één literal
`const vragenData = {…}` (r. 116–1002) en daarna 135 aanvullingen van de vorm
`vragenData["Boek"] = {…}` en `vragenData["Boek"].niveau.push(…)`, verspreid tot
en met regel 6867. Een boek is dus niet één aaneengesloten blok regels; daarom
staan hieronder aantallen vragen in plaats van regelbereiken.

Let op een detail in `index.html`: daar staan statisch maar vier knoppen
(Matteüs, Marcus, Lucas, Johannes) en de ondertitel "Kies een evangelie".
`vulVuBoeken()` haalt die vier bij het openen weg en zet er alle 18 boeken uit
`boekNaarKey` voor in de plaats, verandert de ondertitel in "Kies een boek" en
maakt de lijst scrollbaar. Wat in het HTML-bestand staat is dus niet wat de
speler ziet.

Wat een detailscherm rendert (`openVuDetail()`), telkens hetzelfde patroon:

- `<h3 class="naslag-kop">` met **de vraag zelf** — dit is de enige kop;
  sub-kopjes bestaan in dit menu niet
- `<p>` "Juiste antwoord: …"
- `<div class="bijbelplaats">` "Lees het na in: …" *(alleen als er een
  bijbelplaats is — 4 van de 983 vragen hebben er geen)*
- `<div class="uitleg">` met één `<p>` per alinea, óf de regel "Nog geen extra
  uitleg bij deze vraag."

In de lijst krijgt een vraag mét uitleg het merkteken `💡 uitleg`.

## Bovenliggend menu

`#bijbeltraining-scherm` (`index.html` r. 409–420) → knop **Vragen & uitleg**
(r. 415, `openVraagUitleg()`). Zelfde vertrekpunt als Naslag & uitleg en Catechese.

## Tabel 1 — De drie niveaus

Voor élk boek gelijk; alle niveaus zijn hier open (geen vergrendeling, anders
dan in de quiz).

| Titel zoals getoond | Bestandsnaam | Regels | Kopjes | Gelinkt vanaf |
|---|---|---|---|---|
| Vragen & uitleg *(boekkeuze)* | `index.html` → `#vu-boek-scherm` (r. 438–454) | 17 | h2: Vragen & uitleg | `#bijbeltraining-scherm`, knop "Vragen & uitleg" |
| *\<boeknaam\>* *(niveaukeuze)* | `index.html` → `#vu-niveau-scherm` (r. 458–467) | 10 | h2: de boeknaam, ingevuld door `kiesVuBoek()` | `#vu-boek-scherm`, 18 gegenereerde boekknoppen |
| Beginner / Advanced / Expert | `script.js` r. 81–85 (`niveauLabels`) | 5 | h2: "*\<boek\>* – *\<niveau\>*" op het lijstscherm | `#vu-niveau-scherm`, drie vaste knoppen |

## Tabel 2 — De 18 boeken

Volgorde zoals de knoppen verschijnen (die van `boekNaarKey`, `script.js`
r. 7049–7068). "Woorden uitleg" telt alleen de `uitleg`-velden, niet de vraag-
en antwoordteksten.

| Titel zoals getoond | Bestandsnaam | Beginner | Advanced | Expert | Totaal vragen | Met uitleg | Woorden uitleg | Gelinkt vanaf |
|---|---|---|---|---|---|---|---|---|
| Matteüs | `script.js` → `vragenData["Matteüs"]` | 24 | 20 | 43 | 87 | 18 | 1122 | `#vu-boek-scherm` |
| Marcus | `vragenData["Marcus"]` | 15 | 25 | 33 | 73 | 15 | 1270 | `#vu-boek-scherm` |
| Lucas | `vragenData["Lucas"]` | 11 | 18 | 33 | 62 | 7 | 550 | `#vu-boek-scherm` |
| Johannes | `vragenData["Johannes"]` | 15 | 18 | 32 | 65 | 14 | 730 | `#vu-boek-scherm` |
| Handelingen | `vragenData["Handelingen"]` | 14 | 26 | 38 | 78 | 21 | 1555 | `#vu-boek-scherm` |
| Romeinen | `vragenData["Romeinen"]` | 23 | 17 | 14 | 54 | 4 | 366 | `#vu-boek-scherm` |
| 1 & 2 Korintiërs | `vragenData["1 & 2 Korintiërs"]` | 16 | 15 | 17 | 48 | 3 | 108 | `#vu-boek-scherm` |
| Galaten | `vragenData["Galaten"]` | 12 | 13 | 15 | 40 | 1 | 35 | `#vu-boek-scherm` |
| Efeziërs | `vragenData["Efeziërs"]` | 12 | 20 | 17 | 49 | 1 | 46 | `#vu-boek-scherm` |
| Filippenzen | `vragenData["Filippenzen"]` | 17 | 15 | 15 | 47 | 1 | 27 | `#vu-boek-scherm` |
| Kolossenzen & Filemon | `vragenData["Kolossenzen & Filemon"]` | 14 | 13 | 22 | 49 | 1 | 41 | `#vu-boek-scherm` |
| 1 & 2 Tessalonicenzen | `vragenData["1 & 2 Tessalonicenzen"]` | 12 | 17 | 16 | 45 | 5 | 299 | `#vu-boek-scherm` |
| Timoteüs & Titus | `vragenData["Timoteüs & Titus"]` | 14 | 14 | 18 | 46 | 1 | 71 | `#vu-boek-scherm` |
| Hebreeën | `vragenData["Hebreeën"]` | 16 | 22 | 18 | 56 | 2 | 141 | `#vu-boek-scherm` |
| Jakobus | `vragenData["Jakobus"]` | 11 | 14 | 13 | 38 | 3 | 192 | `#vu-boek-scherm` |
| Petrus & Judas | `vragenData["Petrus & Judas"]` | 13 | 18 | 12 | 43 | 1 | 38 | `#vu-boek-scherm` |
| Brieven van Johannes | `vragenData["Brieven van Johannes"]` | 13 | 13 | 26 | 52 | 4 | 228 | `#vu-boek-scherm` |
| Openbaring | `vragenData["Openbaring"]` | 14 | 17 | 20 | 51 | 10 | 482 | `#vu-boek-scherm` |
| **TOTAAL** | | **266** | **315** | **402** | **983** | **112** | **7301** | |

Alle 18 boeken hebben alle drie de niveaus gevuld; er is geen enkele lege of
ontbrekende lijst. Elk van de 983 vragen krijgt in het detailscherm een eigen
h3 — dat zijn dus 983 "kopjes" in dit menu, tegen 3 in Catechese en 17 in
Naslag & uitleg.

De verhouding: **112 van de 983 vragen (11%) hebben uitleg**, samen 7301 woorden.
De overige 871 tonen "Nog geen extra uitleg bij deze vraag." Per boek loopt dat
sterk uiteen: Handelingen 21 van 78, Matteüs 18 van 87, maar Galaten,
Efeziërs, Filippenzen, Kolossenzen & Filemon, Timoteüs & Titus en
Petrus & Judas hebben er elk precies één.

## 1. Weespagina's — bestaan wel, maar zijn nergens vanuit dit menu bereikbaar

Op boek- en niveauniveau: geen. Alle 18 boeken in `boekNaarKey` bestaan ook in
`vragenData` en omgekeerd; alle 54 lijsten (18 × 3) zijn gevuld.

Maar er staan in `script.js` **twee complete vragensets buiten `vragenData`**,
en die verschijnen nooit in dit menu:

- `metgezellenVragen` — `script.js` r. 7893–7978 (86 regels), **14 vragen**.
  Geen enkele ervan is via Vragen & uitleg te vinden.
- `verborgenSchatVragen` — `script.js` r. 8046–8166 (121 regels), **16 vragen**,
  waarvan 5 met een `reveal`-tekst en 3 met een `catecheseId`. Ook deze staan
  buiten `vragenData`, dus buiten dit menu. Hun uitleg is alleen te zien tijdens
  een lopende Verborgen-Schat-ronde, op de onthullingskaart — niet terug te
  lezen via Vragen & uitleg.

Samen 30 vragen die wel bestaan, maar in dit naslagmenu niet bestaan.

Verder onbereikbaar:

- `maakPlaceholders()` — `script.js` r. 100–113, "maakt 10 placeholdervragen voor
  een boek + niveau". De functie wordt nergens aangeroepen: dode code. Zou hij
  wél draaien, dan zouden regels als "Placeholdervraag 3 – Lucas (Expert)" in de
  lijst verschijnen.
- Anders dan `bouwCatecheseLijst()` heeft `bouwVuLijst()` **geen** tekst voor een
  lege lijst. Een boek/niveau zonder vragen zou een leeg scherm met alleen twee
  Terug-knoppen opleveren. Op dit moment is geen enkele lijst leeg, dus het valt
  niet op.

## 2. Onderlinge verwijzingen

Binnen het menu: **geen enkele**. De navigatie is strikt lineair, vier stappen
heen en dezelfde vier terug:

- `#bijbeltraining-scherm` → `#vu-boek-scherm` (`openVraagUitleg()`), terug via
  `sluitVuBoek()`
- `#vu-boek-scherm` → `#vu-niveau-scherm` (`kiesVuBoek()`), terug via
  `terugVuNiveau()`
- `#vu-niveau-scherm` → `#vu-lijst-scherm` (`kiesVuNiveau()`), terug via
  `terugVuLijst()`
- `#vu-lijst-scherm` → `#vu-detail-scherm` (`openVuDetail(i)`), terug via
  `terugVuDetail()`

Geen enkele vraag verwijst naar een andere vraag, naar een naslagpagina of naar
een catechese-artikel. Dat laatste is wél voorzien: de commentaarregel bij
`openCatecheseArtikel()` (`script.js` r. 9122–9124) noemt uitdrukkelijk
"latere deep-links vanuit een vraag-uitleg (\"Meer hierover →\")". Die knop
bestaat nu alleen op de Verborgen-Schat-onthullingskaart, en dus niet in dit
menu.

Wat dit menu wél deelt met de rest van het spel:

- `vragenData` is dezelfde bron als voor de quiz zelf en voor Oefenen. Vragen &
  uitleg leest alleen; het kopieert niets en raakt score-, pool- of winlogica
  niet aan.
- Eén vraagtekst komt twee keer voor: *"Wie doopte Jezus in de rivier de
  Jordaan?"* staat als Matteüs/beginner #3 én als Marcus/beginner #1. In het
  menu zijn dat twee losse regels in twee verschillende lijsten.
- Twee vragen dragen een veld `kist: false` — 1 & 2 Korintiërs/beginner #2 en
  1 & 2 Tessalonicenzen/beginner #1. Verder gebruikt geen enkele vraag dat veld.
- De volgorde van de boeken in `vragenData` wijkt af van die in `boekNaarKey`:
  daar staat Romeinen vóór Handelingen en Kolossenzen & Filemon ná Timoteüs &
  Titus. De knoppen volgen `boekNaarKey`, dus de speler ziet de canonieke
  volgorde; alleen in de datastructuur staat het anders.

**Overlap met het Naslag-menu.** Drie uitleg-teksten in dit menu behandelen
hetzelfde onderwerp als het Tijd-blok van "Maten, geld & tijd"
(`#maten-scherm`): Matteüs/expert #10 en Marcus/expert #13 leggen de vier
Romeinse nachtwaken uit, Marcus/advanced #8 legt het tellen van de uren vanaf
zonsopgang uit. Anders dan bij de sandwich-tekst gaat het hier **niet** om
kopieerwerk: geen enkele zin komt letterlijk in beide voor. Dezelfde stof,
onafhankelijk opgeschreven, op twee plaatsen in het spel.

## 3. Vragen met meer dan één duidelijk onderwerp

Een detailscherm toont per definitie één vraag, dus de meeste zijn
enkelvoudig. Van de 112 uitleg-teksten hebben er **108 precies één alinea**;
vier hebben er meer, en dat zijn ook de teksten waarin meerdere onderwerpen
onder één vraag zijn samengebracht:

**Marcus/expert #18 — 265 woorden, 4 alinea's** *(veruit de langste uitleg in
het hele menu; de op een na langste telt 175 woorden)*
Vraag: "Jezus zei dat het makkelijker is voor een kameel om door het oog van een
naald te gaan…"

- De bekende uitleg over een poortje in Jeruzalem
- Waarom die uitleg niet klopt (geen archeologisch bewijs, oudste uitleggers)
- Wat Jezus waarschijnlijk wél bedoelde: een bewust onmogelijk beeld
- De toepassing: het gaat om overgave, niet om je uiterste best doen

**Matteüs/expert #10 — 105 woorden, 3 alinea's**
Vraag: "Op welk moment van de nacht kwam Jezus over het water…"

- Uitleg van het systeem van de vier Romeinse nachtwaken
- Een tabel met de vier wachten en hun tijden in het voorjaar
- Het antwoord op de vraag zelf (de vierde nachtwaak)

**Marcus/expert #13 — 82 woorden, 3 alinea's**
Vraag: "De Romeinen verdeelden de nacht in 'nachtwaken'…"

- Wat een nachtwaak is en waarom er vier waren
- Dat een nachtwaak in winter en zomer verschillend lang duurde
- Een vooruitwijzing naar een latere plaats in Marcus waar Jezus de vier wachten
  stuk voor stuk noemt

**Marcus/advanced #8 — 85 woorden, 2 alinea's**
Vraag: "Op welk uur van de dag werd het donker terwijl Jezus aan het kruis hing…"

- Hoe men de uren telde vanaf zonsopgang
- Waarom het zesde uur in het voorjaar inderdaad rond het middaguur viel

Daarnaast zijn er lange uitleg-teksten die in **één** alinea meerdere
onderwerpen stapelen, zonder witregel of kopje ertussen. De langste:
Romeinen/beginner #2 (175 woorden), Marcus/expert #15 (130), Johannes/expert #25
(128, over de talen die men in Israël sprak), Handelingen/expert #15 (124),
Handelingen/advanced #25 (119), Romeinen/expert #12 (110).
