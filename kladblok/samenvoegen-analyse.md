# STAP A — analyse: "Oefenen" en "Vragen & uitleg" samenvoegen

**Versie 2, opnieuw opgemeten tegen de huidige code.** Peildatum 1 september
2026, branch `menu-herstructurering`, commit `086d864`.

Deze analyse vervangt de eerste versie (commit `91ea7b3`). Die was gemaakt vóór
de navigatiestack bestond en is op één punt volledig achterhaald: de dertien
sluit-/terug-functies die daar als "overbodig na de samenvoeging" stonden zijn
inmiddels al weg, verwijderd in commit `4eb0940`. Wat hier staat is opnieuw
nagekeken; regelnummers zijn die van nu.

Alleen vastgesteld, niets gewijzigd.

## Wat er sinds versie 1 is veranderd

| | Versie 1 (vóór de stack) | Nu |
|---|---|---|
| Terug binnen de tak | dertien losse functies | één `gaTerug()`, overal |
| Terug-knoppen | anoniem | elk met een eigen id |
| Waar-kom-ik-vandaan | impliciet in elke functie | `schermStack` + `huidigScherm` |
| Verschillen tussen de vul-functies | vijf | vier |
| Openstaande keuzes | vier | drie (zie slot) |

De **terug**-kant van de samenvoeging is dus al klaar: beide takken lopen al op
hetzelfde mechaniek. Wat resteert is de **heen**-kant — de openers, de schermen
en de status.

## 1. Welke functies elke tak nu gebruikt

### Boekscherm

| | Oefenen | Vragen & uitleg |
|---|---|---|
| Scherm | `#oefen-boek-scherm`, `index.html` r. 424–434 | `#vu-boek-scherm`, `index.html` r. 438–454 |
| Openen | `startOefenen()`, r. 8738–8741 | `openVraagUitleg()`, r. 8858–8861 |
| Knoppen vullen | `vulOefenBoeken()`, r. 8749–8797 | `vulVuBoeken()`, r. 8870–8918 |
| Ankerknop daarvoor | `#oefen-boek-terug` (r. 8774) | `#vu-boek-terug-onder` (r. 8895) |
| Boek gekozen | `kiesOefenBoek(boek)`, r. 8798–8805 | `kiesVuBoek(boek)`, r. 8920–8925 |
| Terug | `gaTerug()` | `gaTerug()` |

### Niveauscherm

| | Oefenen | Vragen & uitleg |
|---|---|---|
| Scherm | `#niveau-scherm`, r. 339–349 *(gedeeld met de gewone quiz)* | `#vu-niveau-scherm`, r. 458–467 |
| Openen | `openBoek(boek, { vergrendel: false, oefen: true })`, r. 7791–7810, aangeroepen op r. 8804 | `kiesVuBoek()` roept `gaNaarScherm("vu-niveau-scherm")` aan |
| Titel-element | `#niveau-boek-titel` (leeg in de HTML) | `#vu-niveau-titel` ("Vragen & uitleg" in de HTML) |
| Niveau gekozen | `kiesNiveau(niveau)`, r. 7838–7885 | `kiesVuNiveau(niveau)`, r. 8927–8931 |
| Sloten | `werkNiveauSlotenBij()`, r. 7181–7198 — hier uitgeschakeld | geen slotlogica |
| Terug | **`terugNaarStartscherm()`** (r. 8575) | **`gaTerug()`** |

Dit is nu het scherpste verschil van de twee takken: het ene niveauscherm doet
mee aan de stack, het andere niet.

### Na de niveaukeuze

| | Oefenen | Vragen & uitleg |
|---|---|---|
| Doel | `#quiz-scherm` (r. 351–374), quiz-tak | `#vu-lijst-scherm` (r. 471–478) |
| Bouwer | `kiesNiveau()` vult `vragen` uit `vragenData[gekozenBoek][niveau]` | `bouwVuLijst()`, r. 8934–8952 |
| Detail | — | `openVuDetail(index)`, r. 8956–8984 → `#vu-detail-scherm` (r. 482–487) |
| Terug | `#oefen-stop-knop` → `terugNaarStartscherm()` | `gaTerug()` |

### Statusvariabelen — nog steeds twee parallelle paren

| Tak | Boek | Niveau | Gezet in | Gereset in |
|---|---|---|---|---|
| Oefenen | `gekozenBoek` | `gekozenNiveau` | `openBoek()` r. 7793, `kiesNiveau()` r. 7846 | `terugNaarStartscherm()` r. 8616–8617 |
| Vragen & uitleg | `vuBoek` (r. 8854) | `vuNiveau` (r. 8855) | `kiesVuBoek()` r. 8921, `kiesVuNiveau()` r. 8928 | **nergens** |

Ongewijzigd sinds versie 1, en nog steeds het lastigste punt: `bouwVuLijst()` en
`openVuDetail()` lezen `vuBoek`/`vuNiveau`, die een ronde overleven;
`gekozenBoek`/`gekozenNiveau` worden bij elke terugkeer naar het startscherm op
`null` gezet.

## 2. `oefenModus` — gezet, gelezen, gereset

Gedeclareerd op r. 6877. Twaalf plaatsen, inhoudelijk onveranderd sinds versie 1;
alleen r. 8619 en 10670 zijn opgeschoven.

**Gezet (4):**

| Regel | Functie | Waarde |
|---|---|---|
| 7792 | `openBoek()` | de `oefen`-parameter; `true` alleen vanuit `kiesOefenBoek()` (r. 8804) |
| 8000 | `openSchatkist()` | `false` |
| 8188 | `openVerborgenSchat()` | `false` |
| 8619 | `terugNaarStartscherm()` | `false` — de eigenlijke reset |

**Gelezen (7):**

| Regel | Functie | Wat ervan afhangt |
|---|---|---|
| 7856 | `kiesNiveau()` | alle vragen van de pool in plaats van 10 |
| 8230 | `laadVraag()` | XP-balk verbergen |
| 8233 | `laadVraag()` | `#oefen-stop-knop` tonen |
| 8239 | `laadVraag()` | `#ronde-stop-knop` verbergen |
| 8261 | `laadVraag()` | `toonOefenNav()` aanroepen |
| 8333 | `checkAntwoord()` | geen doorloop-timer, wél de navigatieknoppen |
| 10670 | `eindScherm()` | slotscherm "Goed geoefend!" en `return` vóór de beloningen |

**Gereset (1):** alleen r. 8619. De waarden op r. 8000 en 8188 zijn defensief —
ze horen bij het starten van een ándere modus.

Voor de samenvoeging blijft dit gunstig: de vlag hoeft niet te verhuizen. Het
nieuwe `#modus-scherm` bepaalt alleen of `openBoek(..., { oefen: true })` wordt
aangeroepen of dat `bouwVuLijst()` wordt gebouwd. Merk op dat er voor de
Nalezen-kant nog steeds geen tegenhanger-vlag bestaat, en ook niet nodig is.

## 3. Waar de twee takken op hetzelfde scherm verschillen

### `vulOefenBoeken()` vs. `vulVuBoeken()` — nog vier verschillen

Sinds beide hun ankerknop op id zoeken is het `.find()`/`.pop()`-verschil weg.
Wat resteert:

| | `vulOefenBoeken()` (r. 8749) | `vulVuBoeken()` (r. 8870) |
|---|---|---|
| Scherm | `#oefen-boek-scherm` | `#vu-boek-scherm` |
| Boekknop herkend aan | `kiesOefenBoek` in de onclick | `kiesVuBoek` in de onclick |
| Ankerknop | `getElementById("oefen-boek-terug")` | `getElementById("vu-boek-terug-onder")` |
| Dataset-vlag | `ouder.dataset.oefenVol` | `ouder.dataset.vuVol` |

De rest is regel voor regel gelijk: ondertitel vervangen, statische knoppen
verwijderen, 18 boeken uit `boekNaarKey` vóór de ankerknop invoegen, `maxHeight:
72vh` plus `overflowY: auto`, en de dataset-vlag zetten.

Alle vier de verschillen zijn parameters. Eén functie met twee argumenten
(schermnaam, id van de ankerknop) volstaat — mits er één boekscherm overblijft,
en dan verdwijnen ze alle vier vanzelf.

### De twee boekschermen

| | `#oefen-boek-scherm` (424–434) | `#vu-boek-scherm` (438–454) |
|---|---|---|
| h2 | "Oefenen" | "Vragen & uitleg" |
| Ondertitel | "Kies een evangelie" (r. 427) | "Kies een evangelie" (r. 441) |
| Terug bovenaan | **nee** | ja, `#vu-boek-terug-boven` (r. 445) |
| Boekknoppen | 4 × `kiesOefenBoek(...)`, r. 428–431 | 4 × `kiesVuBoek(...)`, r. 447–450 |
| Terug onderaan | `#oefen-boek-terug` | `#vu-boek-terug-onder` |
| Knop-class | `answer-btn niveau-btn niveau-beginner menu-knop-blauw` | identiek |

Beide ondertitels worden bij het openen "Kies een boek"; beide viertallen
knoppen worden weggehaald. Wie de HTML leest ziet nog altijd tweemaal vier
evangeliën die de speler nooit zo te zien krijgt.

### De twee niveauschermen

| | `#niveau-scherm` (339–349) | `#vu-niveau-scherm` (458–467) |
|---|---|---|
| Ondertitel | "Kies je niveau" | "Kies een niveau" |
| Knopteksten | Beginner / Advanced / Expert | Beginner / Advanced / Expert |
| Knop-classes | `niveau-beginner` / `-advanced` / `-expert` | identiek |
| Slot-hint | `#niveau-hint` (r. 346) | niet aanwezig |
| Terug | `terugNaarStartscherm()` | `gaTerug()` (`#vu-niveau-terug`) |
| Doet mee aan de stack | **nee** | **ja** |

### Niveaunamen: Beginner/Advanced/Expert vs. brons/zilver/goud

Onveranderd sinds versie 1. In de code heten de niveaus overal `beginner` /
`advanced` / `expert`; de kleuren zijn een aparte laag: `niveauLabels`
(r. 81–85), `niveauNaarTrofee` (r. 7041–7045), en `niveauDrempel` (r. 7148) plus
`niveauSlotHint` (r. 7155) die de kleurnamen al in hun tekst gebruiken. Een
omzetting naar brons/zilver/goud raakt de quiztitel (r. 7872), de lijsttitel van
Nalezen (r. 8936) en de twee slothints.

## 4. Hoe de navigatiestack nu in beide takken loopt

De stack is `schermStack` (r. 8689) plus `huidigScherm` (r. 8692);
`gaNaarScherm()` r. 8695–8704, `gaTerug()` r. 8707–8720, `leegSchermStack()`
r. 8723–8726.

**Vragen & uitleg — volledig op de stack, vier lagen diep:**

```
startscherm
  openBijbeltraining()   leegSchermStack() + push niets   stack []
  openVraagUitleg()      push bijbeltraining-scherm       stack [bijbeltraining]
  kiesVuBoek()           push vu-boek-scherm              stack [bijbeltraining, vu-boek]
  kiesVuNiveau()         push vu-niveau-scherm            stack [.., vu-niveau]
  openVuDetail()         push vu-lijst-scherm             stack [.., vu-lijst]
```

Vier keer `gaTerug()` brengt de speler terug op het startscherm. Elke Terug-knop
in deze tak is `gaTerug()`.

**Oefenen — halverwege van de stack af:**

```
startscherm
  openBijbeltraining()   stack []
  startOefenen()         push bijbeltraining-scherm       stack [bijbeltraining]
  kiesOefenBoek()        leegSchermStack()                stack []   <-- overdracht
    -> openBoek(..., { vergrendel: false, oefen: true })
       #niveau-scherm    Terug = terugNaarStartscherm()
       #quiz-scherm      Terug = #oefen-stop-knop -> terugNaarStartscherm()
```

`kiesOefenBoek()` (r. 8798–8805) leegt de stack expliciet en draagt over aan de
quiz-tak. Dat is bewust zo gebouwd: `#niveau-scherm` en `#quiz-scherm` mochten
niet worden aangeraakt.

**Waar de stack verder wordt geleegd:** `openBijbeltraining()` r. 8733 (schone
start), `kiesOefenBoek()` r. 8803 (overdracht) en `terugNaarStartscherm()`
r. 8624 (vangnet — elke uitgang komt daar langs).

**Wat dit betekent voor het nieuwe `#modus-scherm`.** De nieuwe route is
boek → niveau → modus → Oefenen óf Nalezen. Tot en met het modusscherm is het
pad voor beide gelijk, dus dat hele stuk hoort op de stack. Pas ná de keuze
splitsen ze:

- **Nalezen** blijft op de stack: `gaNaarScherm("vu-lijst-scherm")`, Terug is
  `gaTerug()`, en de speler kan stap voor stap terug tot het startscherm.
- **Oefenen** stapt eraf: `leegSchermStack()` en dan `openBoek(...)`, precies
  zoals `kiesOefenBoek()` het nu doet.

Gevolg: de `leegSchermStack()`-aanroep verhuist van `kiesOefenBoek()` naar de
Oefenen-knop op het modusscherm. Wie vanaf het modusscherm Oefenen kiest en
daarna in `#niveau-scherm` op Terug drukt, belandt dus op het startscherm en
niet terug op het modusscherm — hetzelfde gat als ⚠ 1 uit
`kladblok/terug-inventaris.md`, alleen één scherm verderop. Dat is te
voorkomen door het niveauscherm van de nieuwe route **niet** `#niveau-scherm` te
laten zijn.

## 5. Wat na de samenvoeging overbodig wordt

De lijst is korter dan in versie 1, omdat de dertien terug-functies er al uit
zijn.

**Zeker overbodig:**

| Wat | Waar | Reden |
|---|---|---|
| `startOefenen()` **of** `openVraagUitleg()` | r. 8738 / r. 8858 | één opener voor de nieuwe knop |
| `vulOefenBoeken()` **of** `vulVuBoeken()` | r. 8749 / r. 8870 | vier parameterverschillen, zie boven |
| `kiesOefenBoek()` **of** `kiesVuBoek()` | r. 8798 / r. 8920 | één boekkeuze-handler |
| `#oefen-boek-scherm` **of** `#vu-boek-scherm` | r. 424 / r. 438 | één boekscherm |
| De bijbehorende Terug-id | `oefen-boek-terug` of `vu-boek-terug-onder` | de ankerknop van de verdwenen tweeling |
| `#vu-niveau-scherm` **of** het tweede niveauscherm | r. 458–467 | één niveauscherm |
| `vuBoek` / `vuNiveau` | r. 8854–8855 | als de statusparen samengaan — let op de reset-val |
| De 4 statische boekknoppen + ondertitel, 2 × | r. 427–431 en r. 441, 447–450 | worden bij elk openen weggehaald |
| `maakPlaceholders()` | r. 101–113 | dode code; nergens aangeroepen. Stond ook al in versie 1 en is nog steeds niet opgeruimd. |

**Blijft nodig:**

- `#niveau-scherm`, `werkNiveauSlotenBij()`, `toonNiveauHint()`, `#niveau-hint`,
  `niveauSlotHint` — de gewone quiz gebruikt ze mét vergrendeling.
- `openBoek()` — vier ingangen: de boek-zones (`index.html` r. 121–124), de
  NT2-groepsknop (r. 10900), de boekenplank (r. 10984) en Oefenen (r. 8804).
- `kiesNiveau()`, `bouwVuLijst()`, `openVuDetail()` — oefenmodus en Nalezen-lijst
  blijven inhoudelijk ongewijzigd.
- `oefenModus` met zijn zeven leesplekken.
- `gaNaarScherm()`, `gaTerug()`, `leegSchermStack()` — die worden juist drukker.

## 6. Openstaande keuzes vóór STAP B

Van de vier uit versie 1 zijn er nog drie over; de vierde (welke terug-functies
verdwijnen) is door de navigatiestack al beantwoord.

1. **Welk niveauscherm wordt het gedeelde?** `#niveau-scherm` hergebruiken raakt
   de gewone quiz: dat scherm draagt de vergrendeling en zijn Terug gaat naar het
   startscherm in plaats van via `gaTerug()`. Een eigen, vergrendelingsvrij
   niveauscherm voor de nieuwe route (zoals `#vu-niveau-scherm` nu al is) houdt
   de quiz-tak buiten schot én voorkomt het navigatiegat uit punt 4.
2. **Eén statuspaar of twee?** Bij één paar moet `terugNaarStartscherm()` niet
   langer `gekozenBoek`/`gekozenNiveau` wissen op een moment dat Nalezen ze nog
   nodig heeft.
3. **Blijven de niveaus Beginner/Advanced/Expert heten, of worden het overal
   brons/zilver/goud?** De route in de opdracht noemt de kleuren; de code
   gebruikt de labels op vier plaatsen.

Vervallen ten opzichte van versie 1: de vraag "Kies je niveau" of "Kies een
niveau" blijft feitelijk staan, maar wordt vanzelf beslecht zodra keuze 1
gemaakt is — het overblijvende scherm houdt zijn eigen ondertitel.
