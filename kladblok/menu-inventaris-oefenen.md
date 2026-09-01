# Inventaris menu "Oefenen"

Peildatum: 1 september 2026. Alleen vastgesteld, niets gewijzigd.
Vierde deel, naast `kladblok/menu-inventaris.md` (Naslag & uitleg),
`kladblok/menu-inventaris-catechese.md` en
`kladblok/menu-inventaris-vragen-uitleg.md`.

## Vooraf: dit menu is geen leesmenu

De drie eerder geïnventariseerde menu's zijn leesschermen. Oefenen is dat niet:
het is een **speelmodus** die de gewone quiz hergebruikt met andere instellingen.
Dat heeft twee gevolgen voor deze inventaris.

Ten eerste heeft Oefenen maar **één eigen scherm**: `#oefen-boek-scherm`
(`index.html` r. 424–434, 11 regels). Daarna leent het `#niveau-scherm`
(r. 339–349) en `#quiz-scherm` (r. 351–374) van de gewone quiz — dezelfde
elementen, dezelfde HTML. `kiesOefenBoek()` (`script.js` r. 8748–8751) roept
`openBoek(boek, { vergrendel: false, oefen: true })` aan; alles daarna is de
gewone quizcode met de vlag `oefenModus = true`.

Ten tweede is er geen eigen inhoud. De data is `vragenData` — precies dezelfde
array als voor de quiz zelf en voor Vragen & uitleg: 136 statements in
`script.js`, r. 116–6867, 18 boeken × 3 niveaus, 983 vragen.

Net als bij Vragen & uitleg staan er in `index.html` statisch maar vier
knoppen (Matteüs, Marcus, Lucas, Johannes) met de ondertitel "Kies een
evangelie". `vulOefenBoeken()` (r. 8697–8743) haalt die vier bij het openen weg,
zet er alle 18 boeken uit `boekNaarKey` voor in de plaats, verandert de
ondertitel in "Kies een boek" en maakt de lijst scrollbaar.

## Wat de oefenmodus anders doet dan een gewone ronde

Feitelijk, met regelnummers in `script.js`:

| | Gewone ronde | Oefenmodus |
|---|---|---|
| Aantal vragen | 10 willekeurige uit de pool | **alle** vragen van boek + niveau (r. 7855–7856) |
| Niveauvergrendeling | actief | uit — `vergrendel: false` (r. 7794, 8750) |
| XP-balk | zichtbaar | verborgen (r. 8230) |
| Doorgaan na een antwoord | automatisch na 2 seconden | zelf klikken; geen timer (r. 8333–8336) |
| Navigatie | geen | "← Terug / Volgende →" onder de vraag, ook vóór het antwoorden (`toonOefenNav()`, r. 8371–8400) |
| Stopknop | `#ronde-stop-knop` met bevestiging | `#oefen-stop-knop`, direct terug (r. 8232–8239) |
| Slot van de ronde | trofee-/schildpunt-/kistafhandeling | "Goed geoefend!" + score, daarna `return` (r. 10691–10706) |

Score en XP worden in de oefenmodus intern wél bijgehouden (`score++`,
`huidigeXP += 100`, r. 8296–8305) — het eindscherm meldt "Je had *n* van de *m*
goed" — maar de XP-balk is verborgen en na de `return` op r. 10706 wordt er niets
opgeslagen: geen schildpunt, geen trofee, geen kist. Alleen het eerste antwoord
op een vraag telt (`beantwoordeVragen`, r. 8288–8289), juist omdat je in deze
modus vrij heen en weer kunt bladeren.

## Bovenliggend menu

`#bijbeltraining-scherm` (`index.html` r. 409–420) → knop **Oefenen** (r. 413,
`startOefenen()`). Zelfde vertrekpunt als de drie andere menu's.

## Tabel 1 — De schermen van dit menu

| Titel zoals getoond | Bestandsnaam | Regels HTML | Woorden lopende tekst | Kopjes | Gelinkt vanaf |
|---|---|---|---|---|---|
| Oefenen *(boekkeuze)* | `index.html` → `#oefen-boek-scherm` (r. 424–434) | 11 | 3 ("Oefenen", "Kies een evangelie" → bij het openen "Kies een boek") | h2: Oefenen | `#bijbeltraining-scherm`, knop "Oefenen" |
| *\<boeknaam\>* *(niveaukeuze)* | `index.html` → `#niveau-scherm` (r. 339–349) — **gedeeld met de gewone quiz** | 11 | 3 ("Kies je niveau") | h2: de boeknaam, ingevuld door `openBoek()` | `#oefen-boek-scherm`, 18 gegenereerde boekknoppen |
| *\<boek\> – \<niveau\>* *(de oefenronde)* | `index.html` → `#quiz-scherm` (r. 351–374) — **gedeeld met de gewone quiz** | 24 | vraag + 4 antwoorden + bijbelplaats per vraag, zie tabel 2 | h2: "*\<boek\>* – *\<niveau\>*" (`quiz-title`); verder geen kopjes | `#niveau-scherm`, drie niveauknoppen (alle drie open) |
| Goed geoefend! *(slot)* | `script.js` r. 10696–10704 (ingeschreven in `.quiz-box`) | 6 | 24 | h2: Goed geoefend! | einde van de ronde (`eindScherm()`) |

## Tabel 2 — De 18 boeken

Volgorde zoals de knoppen verschijnen (die van `boekNaarKey`, `script.js`
r. 7049–7068). Een oefenronde is zo lang als de hele pool, dus het aantal
vragen per niveau ís de rondelengte. "Woorden lopende tekst" = alles wat tijdens
het oefenen op het scherm komt: vraagteksten, de vier antwoordopties en de
bijbelplaats. De uitleg-velden zitten daar bewust niet bij — zie punt 1.

| Titel zoals getoond | Bestandsnaam | Beginner | Advanced | Expert | Totaal vragen | Woorden vraag + antwoorden | Woorden bijbelplaats | Langste ronde | Gelinkt vanaf |
|---|---|---|---|---|---|---|---|---|---|
| Matteüs | `script.js` → `vragenData["Matteüs"]` | 24 | 20 | 43 | 87 | 3391 | 184 | 43 | `#oefen-boek-scherm` |
| Marcus | `vragenData["Marcus"]` | 15 | 25 | 33 | 73 | 3003 | 166 | 33 | `#oefen-boek-scherm` |
| Lucas | `vragenData["Lucas"]` | 11 | 18 | 33 | 62 | 2483 | 134 | 33 | `#oefen-boek-scherm` |
| Johannes | `vragenData["Johannes"]` | 15 | 18 | 32 | 65 | 2218 | 138 | 32 | `#oefen-boek-scherm` |
| Handelingen | `vragenData["Handelingen"]` | 14 | 26 | 38 | 78 | 3161 | 156 | 38 | `#oefen-boek-scherm` |
| Romeinen | `vragenData["Romeinen"]` | 23 | 17 | 14 | 54 | 2135 | 108 | 23 | `#oefen-boek-scherm` |
| 1 & 2 Korintiërs | `vragenData["1 & 2 Korintiërs"]` | 16 | 15 | 17 | 48 | 1788 | 147 | 17 | `#oefen-boek-scherm` |
| Galaten | `vragenData["Galaten"]` | 12 | 13 | 15 | 40 | 1655 | 80 | 15 | `#oefen-boek-scherm` |
| Efeziërs | `vragenData["Efeziërs"]` | 12 | 20 | 17 | 49 | 1647 | 98 | 20 | `#oefen-boek-scherm` |
| Filippenzen | `vragenData["Filippenzen"]` | 17 | 15 | 15 | 47 | 1592 | 94 | 17 | `#oefen-boek-scherm` |
| Kolossenzen & Filemon | `vragenData["Kolossenzen & Filemon"]` | 14 | 13 | 22 | 49 | 1977 | 100 | 22 | `#oefen-boek-scherm` |
| 1 & 2 Tessalonicenzen | `vragenData["1 & 2 Tessalonicenzen"]` | 12 | 17 | 16 | 45 | 1471 | 133 | 17 | `#oefen-boek-scherm` |
| Timoteüs & Titus | `vragenData["Timoteüs & Titus"]` | 14 | 14 | 18 | 46 | 1735 | 131 | 18 | `#oefen-boek-scherm` |
| Hebreeën | `vragenData["Hebreeën"]` | 16 | 22 | 18 | 56 | 1719 | 114 | 22 | `#oefen-boek-scherm` |
| Jakobus | `vragenData["Jakobus"]` | 11 | 14 | 13 | 38 | 1309 | 76 | 14 | `#oefen-boek-scherm` |
| Petrus & Judas | `vragenData["Petrus & Judas"]` | 13 | 18 | 12 | 43 | 1295 | 121 | 18 | `#oefen-boek-scherm` |
| Brieven van Johannes | `vragenData["Brieven van Johannes"]` | 13 | 13 | 26 | 52 | 2130 | 162 | 26 | `#oefen-boek-scherm` |
| Openbaring | `vragenData["Openbaring"]` | 14 | 17 | 20 | 51 | 2225 | 101 | 20 | `#oefen-boek-scherm` |
| **TOTAAL** | | **266** | **315** | **402** | **983** | **36934** | **2243** | | |

Dat zijn **54 oefenrondes** (18 boeken × 3 niveaus), alle gevuld. De rondes
lopen sterk uiteen in lengte: van 11 vragen (Lucas beginner, Jakobus beginner)
tot 43 (Matteüs expert). Geen enkele ronde is korter dan 10 vragen — een
oefenronde is dus altijd minstens zo lang als een gewone ronde, en de langste
duurt ruim vier keer zo lang.

Kopjes: in dit hele menu staat per ronde één h2, "*\<boek\>* – *\<niveau\>*".
Er zijn geen h3's. Ter vergelijking: Vragen & uitleg rendert 983 h3's over
dezelfde data.

## 1. Weespagina's — bestaat wel, maar is nergens vanuit dit menu bereikbaar

Op boek- en niveauniveau: geen. Alle 18 boeken en alle 54 lijsten zijn gevuld en
bereikbaar; de vergrendeling staat in deze modus uit, dus alle drie de niveaus
zijn meteen te openen.

Wat wél bestaat maar hier niet te zien is:

- **De 112 uitleg-teksten (7301 woorden).** Die worden in de quiz — en dus ook
  in de oefenmodus — bewust niet getoond. `checkAntwoord()` zet na een antwoord
  alleen de bijbelplaats onder het resultaat; de commentaarregels op r. 8318–8323
  zeggen het met zoveel woorden: *"de (soms lange) uitleg blijft in de data, maar
  verschijnt NIET in de quiz — die houden we snel. De uitleg is wél te lezen op
  de Vragen & uitleg-pagina."* Wie oefent, ziet dus per vraag 2243 woorden
  bijbelplaats maar geen enkel woord uitleg.
- **`metgezellenVragen`** — `script.js` r. 7893–7978, 14 vragen. Staat buiten
  `vragenData` en komt in geen enkele oefenronde voor.
- **`verborgenSchatVragen`** — `script.js` r. 8046–8166, 16 vragen. Idem.
- **`maakPlaceholders()`** — r. 100–113, dode code; wordt nergens aangeroepen.
- **De vier statische boekknoppen in `index.html`** (r. 428–431) en de
  ondertitel "Kies een evangelie" (r. 427). Ze staan in het bestand maar worden
  bij elk openen door `vulOefenBoeken()` verwijderd of overschreven; de speler
  krijgt ze nooit te zien.
- **`#niveau-hint` en `toonNiveauHint()`** (`index.html` r. 346, `script.js`
  r. 7199–7202). De hint hoort bij een vergrendeld niveau. In de oefenmodus staat
  `niveauVergrendelingActief` op `false` (r. 7794), dus `werkNiveauSlotenBij()`
  zet nooit een slot en `kiesNiveau()` komt nooit in de hint-tak. Vanuit Oefenen
  is deze tekst onbereikbaar; via de gewone quiz wél.

## 2. Onderlinge verwijzingen

Binnen het menu: geen. Er is één pad, drie stappen diep:

- `#bijbeltraining-scherm` → `#oefen-boek-scherm` (`startOefenen()`), terug via
  `terugNaarBijbeltraining()` (r. 8744–8747)
- `#oefen-boek-scherm` → `#niveau-scherm` (`kiesOefenBoek()` → `openBoek()`)
- `#niveau-scherm` → `#quiz-scherm` (`kiesNiveau()`)
- binnen de ronde: heen en weer met "← Terug / Volgende →" (`gaNaarVorige()` /
  `gaNaarVolgende()`, r. 8357–8366 en 8343–8355)

**Twee plaatsen waar de weg terug niet is wat je zou verwachten.** De Terug-knop
van `#niveau-scherm` (`index.html` r. 347) roept `terugNaarStartscherm()` aan
(r. 8573), en dat scherm is gedeeld met de gewone quiz. Vanuit Oefenen keer je
daarmee niet terug naar de boekenlijst maar naar het startscherm — je valt in één
klik uit de hele Bijbeltraining-tak. Hetzelfde geldt voor `#oefen-stop-knop`
(`index.html` r. 367) en voor de Terug-knop op het slotscherm "Goed geoefend!".
Ter vergelijking: in Vragen & uitleg gaat de Terug-knop van het niveauscherm wél
netjes één stap terug (`terugVuNiveau()`).

Wat dit menu deelt met de rest van het spel:

- **`vragenData`** — dezelfde bron als de gewone quiz en Vragen & uitleg. Oefenen
  muteert de data niet: `kiesWillekeurigeVragen()` hustelt een kopie en
  `.map()` maakt nieuwe objecten (r. 7813–7835, 7857–7860).
- **`#niveau-scherm` en `#quiz-scherm`** — letterlijk dezelfde DOM-elementen als
  de gewone quiz. `terugNaarStartscherm()` schrijft de hele `.quiz-box` opnieuw
  (r. 8592–8605), omdat `eindScherm()` hem heeft leeggeschreven.
- **`vulOefenBoeken()` en `vulVuBoeken()`** zijn elkaars tweelingen: dezelfde
  defensieve aanpak, dezelfde 18 knoppen uit `boekNaarKey`, dezelfde
  ondertitel-vervanging. Ze verschillen op één punt: `vulVuBoeken()` zoekt
  bewust de *laatste* Terug-knop (daar staat er ook één bovenaan),
  `vulOefenBoeken()` de eerste — omdat `#oefen-boek-scherm` er maar één heeft.
- Eén vraagtekst staat dubbel in de data: *"Wie doopte Jezus in de rivier de
  Jordaan?"* (Matteüs/beginner en Marcus/beginner). Binnen één oefenronde kan hij
  niet dubbel opduiken — `kiesWillekeurigeVragen()` ontdubbelt op vraagtekst —
  maar wie beide boeken oefent, krijgt hem twee keer.

## 3. Menu-items met meer dan één duidelijk onderwerp

Een oefenronde heeft geen kopjes, dus hier gaat het om de knoppen zelf. **Zes van
de achttien** bundelen meer dan één Bijbelboek onder één knop:

- **1 & 2 Korintiërs** — twee brieven (48 vragen)
- **Kolossenzen & Filemon** — twee brieven (49 vragen)
- **1 & 2 Tessalonicenzen** — twee brieven (45 vragen)
- **Timoteüs & Titus** — drie brieven: 1 Timoteüs, 2 Timoteüs en Titus (46 vragen)
- **Petrus & Judas** — drie brieven: 1 Petrus, 2 Petrus en Judas (43 vragen)
- **Brieven van Johannes** — drie brieven: 1, 2 en 3 Johannes (52 vragen)

Samen dekken die zes knoppen vijftien Bijbelboeken. De vragen binnen zo'n knop
zijn niet gescheiden: beginner, advanced en expert lopen dwars door de gebundelde
brieven heen, en niets in de ronde laat zien welke brief aan de beurt is behalve
de bijbelplaats onder het antwoord.

Daarnaast zijn er rondes die in lengte ver uit de pas lopen met de rest, wat ze
in de praktijk tot meerdere zittingen maakt:

- Matteüs / Expert — 43 vragen
- Handelingen / Expert — 38 vragen
- Marcus / Expert en Lucas / Expert — elk 33 vragen
- Johannes / Expert — 32 vragen

Tegenover Jakobus / Beginner en Lucas / Beginner met elk 11 vragen. Alle 54
rondes zijn wel minstens 10 vragen lang, de lengte van een gewone quizronde.
