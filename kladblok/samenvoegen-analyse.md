# STAP A — analyse: "Oefenen" en "Vragen & uitleg" samenvoegen

Peildatum: 1 september 2026. Alleen vastgesteld, niets gewijzigd.

## Vooraf: twee dingen die STAP B raken

**1. Eén aanname in de opdracht klopt niet.** Er staat: *"Beide takken hebben nu
een eigen boekscherm en delen `#niveau-scherm`."* Ze hebben allebei een eigen
boekscherm én **allebei een eigen niveauscherm**:

- Oefenen gebruikt `#niveau-scherm` (`index.html` r. 339–349)
- Vragen & uitleg gebruikt `#vu-niveau-scherm` (`index.html` r. 458–467)

`#niveau-scherm` wordt niet gedeeld met Vragen & uitleg maar **met de gewone
quiz**. Naast Oefenen komen er nog drie ingangen op uit:

| Aanroep | Waar | Vergrendeling |
|---|---|---|
| `openBoek('Matteüs')` … `openBoek('Johannes')` | `index.html` r. 121–124, de boek-zones op het startscherm | aan |
| `openBoek(direct)` | `script.js` r. 10921, de NT2-groepsknop (Handelingen / Openbaring) | aan |
| `openBoek(boek.naam)` | `script.js` r. 11005, `kiesPlankBoek()` vanaf de boekenplank | aan |
| `openBoek(boek, { vergrendel: false, oefen: true })` | `script.js` r. 8750, `kiesOefenBoek()` | **uit** |

Gevolg voor STAP B punt 1: "één niveauscherm voor beide takken" kan niet
betekenen "hergebruik `#niveau-scherm`" zonder ook de gewone quiz te raken. Dat
scherm draagt de vergrendelingslogica (`werkNiveauSlotenBij()`, `#niveau-hint`,
`toonNiveauHint()`) en zijn Terug-knop gaat naar `terugNaarStartscherm()`.
Er zijn twee wegen: het nieuwe gedeelde scherm wordt `#vu-niveau-scherm`
(vergrendelingsvrij, zoals beide takken het nu al gebruiken) en `#niveau-scherm`
blijft ongemoeid voor de quiz — of `#niveau-scherm` wordt zo aangepast dat het
beide gevallen aankan. Dit is een keuze die vóór STAP B gemaakt moet worden; ik
heb hem niet voor u gemaakt.

**2. De voorwaarden voor STAP B zijn nog niet vervuld.**

- Branch `menu-herstructurering` bestaat niet; de repo staat op `main`
  (`git branch -a`).
- Stap 1 (navigatiestack) is niet gecommit: `gaTerug()` komt in `script.js` noch
  in `index.html` voor. STAP B punt 2 leunt erop.
- De werkmap is niet schoon: `script.js` heeft 16 ongecommitte wijzigingen
  (`git diff --stat`), inhoudelijk werk aan de Korintiërs-pool — vraagteksten en
  antwoordopties, plus een gecorrigeerde telling in de kopregel. Dat staat los
  van deze verbouwing en zou bij een branchwissel of commit meelopen.

## 1. Welke functies elke tak nu gebruikt

### Boekscherm

| | Oefenen | Vragen & uitleg |
|---|---|---|
| Scherm | `#oefen-boek-scherm`, `index.html` r. 424–434 | `#vu-boek-scherm`, `index.html` r. 438–454 |
| Openen | `startOefenen()`, r. 8685–8689 | `openVraagUitleg()`, r. 8825–8830 |
| Knoppen vullen | `vulOefenBoeken()`, r. 8697–8743 | `vulVuBoeken()`, r. 8838–8887 |
| Boek gekozen | `kiesOefenBoek(boek)`, r. 8748–8751 | `kiesVuBoek(boek)`, r. 8894–8901 |
| Terug | `terugNaarBijbeltraining()`, r. 8744–8747 | `sluitVuBoek()`, r. 8889–8893 |

### Niveauscherm

| | Oefenen | Vragen & uitleg |
|---|---|---|
| Scherm | `#niveau-scherm`, r. 339–349 *(gedeeld met de gewone quiz)* | `#vu-niveau-scherm`, r. 458–467 |
| Openen | `openBoek(boek, { vergrendel: false, oefen: true })`, r. 7791–7810 | `kiesVuBoek()` zet de titel en toont het scherm |
| Titel-element | `#niveau-boek-titel` | `#vu-niveau-titel` |
| Niveau gekozen | `kiesNiveau(niveau)`, r. 7838–7891 | `kiesVuNiveau(niveau)`, r. 8907–8912 |
| Sloten | `werkNiveauSlotenBij()`, r. 7181–7198 — staat hier uit | geen slotlogica |
| Terug | `terugNaarStartscherm()`, r. 8573 — **verlaat de hele tak** | `terugVuNiveau()`, r. 8902–8906 — één stap terug |

### Wat er ná de niveaukeuze gebeurt

| | Oefenen | Vragen & uitleg |
|---|---|---|
| Doel | `#quiz-scherm` (r. 351–374), gedeeld met de gewone quiz | `#vu-lijst-scherm` (r. 471–478) |
| Bouwer | `kiesNiveau()` vult `vragen` uit `vragenData[gekozenBoek][niveau]` | `bouwVuLijst()`, r. 8920–8940 |
| Detail | — | `openVuDetail(index)`, r. 8942–8971, naar `#vu-detail-scherm` (r. 482–487) |
| Terug uit de lijst | n.v.t. | `terugVuLijst()`, r. 8914–8918 → `#vu-niveau-scherm` |
| Terug uit detail | n.v.t. | `terugVuDetail()`, r. 8973–8976 → `#vu-lijst-scherm` |

### Statusvariabelen — twee parallelle paren

| Tak | Boek | Niveau | Waar gezet | Waar gereset |
|---|---|---|---|---|
| Oefenen | `gekozenBoek` | `gekozenNiveau` | `openBoek()` r. 7793, `kiesNiveau()` r. 7846 | `terugNaarStartscherm()` r. 8615–8616 (beide op `null`) |
| Vragen & uitleg | `vuBoek` (r. 8821) | `vuNiveau` (r. 8822) | `kiesVuBoek()` r. 8895, `kiesVuNiveau()` r. 8908 | **nergens** — ze blijven staan tot de volgende keuze |

Dit is het lastigste punt van de samenvoeging: `gekozenBoek`/`gekozenNiveau`
worden door de quiz gebruikt én bij elke terugkeer naar het startscherm
leeggemaakt; `vuBoek`/`vuNiveau` staan daar volledig los van en overleven een
ronde. Eén gedeeld paar betekent dat `bouwVuLijst()` en `openVuDetail()` gaan
lezen uit variabelen die `terugNaarStartscherm()` op `null` zet.

## 2. `oefenModus` — gezet, gelezen, gereset

Gedeclareerd op r. 6877 (`let oefenModus = false;`). Twaalf plaatsen in totaal.

**Gezet (4):**

| Regel | Functie | Waarde |
|---|---|---|
| 7792 | `openBoek()` | `oefen`-parameter; `true` alleen vanuit `kiesOefenBoek()` |
| 8000 | `openSchatkist()` | `false` |
| 8188 | `openVerborgenSchat()` | `false` |
| 8617 | `terugNaarStartscherm()` | `false` (de reset) |

**Gelezen (7):**

| Regel | Functie | Wat ervan afhangt |
|---|---|---|
| 7856 | `kiesNiveau()` | alle vragen van de pool i.p.v. 10 |
| 8230 | `laadVraag()` | XP-balk verbergen |
| 8233 | `laadVraag()` | `#oefen-stop-knop` tonen |
| 8239 | `laadVraag()` | `#ronde-stop-knop` verbergen |
| 8261 | `laadVraag()` | `toonOefenNav()` aanroepen |
| 8333 | `checkAntwoord()` | geen doorloop-timer, wél de navigatie |
| 10691 | `eindScherm()` | slotscherm "Goed geoefend!" en `return` vóór de beloningen |

**Gereset (1):** alleen r. 8617, in `terugNaarStartscherm()`. Dat is de enige
plek waar de vlag weer op `false` gaat na een oefenronde. De resets op r. 8000
en 8188 zijn defensief: ze horen bij het starten van een ándere modus.

Voor STAP B is dit gunstig: de vlag hoeft niet te verhuizen. De nieuwe
moduskeuze hoeft alleen te bepalen of `openBoek(..., { oefen: true })` wordt
aangeroepen of dat `bouwVuLijst()` wordt gebouwd. Wel is er een verschil met de
opdrachttekst: de opdracht spreekt van "bewaar de gekozen modus in een
variabele". Voor de Oefenen-kant bestaat die variabele al (`oefenModus`); voor
de Nalezen-kant is er geen tegenhanger, want die tak heeft nu geen vlag nodig.

## 3. Waar de twee takken op hetzelfde scherm verschillen

### `vulOefenBoeken()` vs. `vulVuBoeken()` — bijna-tweelingen

Beide functies doen letterlijk hetzelfde: ondertitel vervangen, de statische
boekknoppen verwijderen, alle 18 boeken uit `boekNaarKey` invoegen vóór de
Terug-knop, de lijst scrollbaar maken (`maxHeight: 72vh`, `overflowY: auto`) en
een dataset-vlag zetten zodat het maar één keer gebeurt. Vijf verschillen:

| | `vulOefenBoeken()` (r. 8697) | `vulVuBoeken()` (r. 8838) |
|---|---|---|
| Scherm | `#oefen-boek-scherm` | `#vu-boek-scherm` |
| Boekknop herkend aan | `kiesOefenBoek` in de onclick | `kiesVuBoek` in de onclick |
| Terugknop herkend aan | `terugNaarBijbeltraining` | `sluitVuBoek` |
| Welke Terug-knop | `.find()` — de eerste | `.pop()` — de **laatste**, met een comment: er staat er ook één bovenaan, en met `find()` zou de hele lijst dáárboven belanden |
| Dataset-vlag | `ouder.dataset.oefenVol` | `ouder.dataset.vuVol` |

De rest is regel voor regel gelijk, inclusief de commentaarblokken erboven.

### De twee boekschermen in `index.html`

| | `#oefen-boek-scherm` (424–434) | `#vu-boek-scherm` (438–454) |
|---|---|---|
| h2 | "Oefenen" | "Vragen & uitleg" |
| Ondertitel | "Kies een evangelie" (r. 427) | "Kies een evangelie" (r. 441) |
| Terug bovenaan | **nee** | ja, `sluitVuBoek()`, class `naslag-terug` (r. 445) |
| Boekknoppen | 4 × `kiesOefenBoek(...)`, r. 428–431 | 4 × `kiesVuBoek(...)`, r. 447–450 |
| Terug onderaan | `terugNaarBijbeltraining()` | `sluitVuBoek()` |
| Knop-class | `answer-btn niveau-btn niveau-beginner menu-knop-blauw` | identiek |

Beide ondertitels worden bij het openen vervangen door "Kies een boek"; beide
sets van vier knoppen worden verwijderd. Wie alleen de HTML leest, ziet dus
tweemaal vier evangeliën die er in het spel nooit zo staan — dat is punt 4 van
STAP B.

### De twee niveauschermen

| | `#niveau-scherm` (339–349) | `#vu-niveau-scherm` (458–467) |
|---|---|---|
| h2 | `#niveau-boek-titel`, leeg in de HTML | `#vu-niveau-titel`, "Vragen & uitleg" in de HTML |
| Ondertitel | "Kies je niveau" | "Kies een niveau" |
| Knopteksten | Beginner / Advanced / Expert | Beginner / Advanced / Expert |
| Knop-classes | `niveau-beginner` / `-advanced` / `-expert` | identiek |
| Slot-hint | `#niveau-hint` aanwezig (r. 346) | niet aanwezig |
| Terug | `terugNaarStartscherm()` | `terugVuNiveau()` |

Twee tekstuele verschillen om te beslechten: **"Kies je niveau" vs. "Kies een
niveau"**, en de titel — bij Oefenen alleen de boeknaam, bij Vragen & uitleg
ook alleen de boeknaam (door `kiesVuBoek()` gezet, r. 8896–8897), maar in de
HTML staat er "Vragen & uitleg" als beginwaarde.

### Niveaunamen: Beginner/Advanced/Expert vs. brons/zilver/goud

De nieuwe route in de opdracht noemt de niveaus **brons / zilver / goud**. In de
code heten ze overal `beginner` / `advanced` / `expert`; de kleuren zijn een
aparte laag:

- `niveauLabels` (r. 81–85) → "Beginner", "Advanced", "Expert" — gebruikt in de
  quiztitel (r. 7872) en in de lijsttitel van Nalezen (r. 8922)
- `niveauNaarTrofee` (r. 7041–7045) → beginner→brons, advanced→zilver,
  expert→goud
- `niveauDrempel` (r. 7148–7152) en `niveauSlotHint` (r. 7155–7158) gebruiken de
  kleurnamen al in de hints ("Verdien eerst brons bij Beginner…")

Een omzetting naar brons/zilver/goud raakt dus `niveauLabels`, de quiztitel, de
lijsttitel van Nalezen en de twee slothints. Dat staat niet in de opsomming van
STAP B; ik heb het hier alleen vastgelegd.

### De titel van het nieuwe `#modus-scherm`

De opdracht vraagt "Marcus — zilver". De bouwstenen daarvoor zijn er
(`gekozenBoek` + `niveauNaarTrofee[niveau]`), maar er bestaat nu nergens een
titel in dat formaat: de quiz gebruikt `"${boek} – ${niveauLabels[niveau]}"`
(halve kastlijn, Nederlands label), Nalezen hetzelfde. Let op het verschil
tussen de en-dash `–` die de code nu gebruikt en de em-dash `—` in de opdracht.

## 4. Wat na de samenvoeging overbodig wordt

**Zeker overbodig** (functionaliteit gaat één op één op in de gedeelde variant):

| Wat | Waar | Reden |
|---|---|---|
| `startOefenen()` **of** `openVraagUitleg()` | r. 8685 / r. 8825 | één opener volstaat voor de nieuwe knop |
| `vulOefenBoeken()` **of** `vulVuBoeken()` | r. 8697 / r. 8838 | bijna-identiek, zie boven |
| `kiesOefenBoek()` **of** `kiesVuBoek()` | r. 8748 / r. 8894 | één boekkeuze-handler |
| `terugNaarBijbeltraining()` **of** `sluitVuBoek()` | r. 8744 / r. 8890 | beide sluiten het boekscherm; vervalt sowieso als `gaTerug()` het overneemt |
| `terugVuNiveau()` | r. 8902 | vervangen door `gaTerug()` |
| `terugVuLijst()` | r. 8914 | vervangen door `gaTerug()` |
| `terugVuDetail()` | r. 8973 | vervangen door `gaTerug()` |
| `#oefen-boek-scherm` **of** `#vu-boek-scherm` | r. 424 / r. 438 | één boekscherm |
| `#vu-niveau-scherm` | r. 458–467 | als er één niveauscherm komt |
| `vuBoek` / `vuNiveau` | r. 8821–8822 | als het statuspaar wordt samengevoegd — let op de reset-val hierboven |
| `maakPlaceholders()` | r. 101–113 | dode code; wordt nergens aangeroepen (punt 5 van STAP B) |
| De 4 statische boekknoppen + ondertitel, 2 × | r. 427–431 en r. 441, 447–450 | worden bij elk openen weggehaald (punt 4 van STAP B) |

**Blijft nodig, ook al lijkt het dubbel:**

- `#niveau-scherm`, `werkNiveauSlotenBij()`, `toonNiveauHint()`, `#niveau-hint`
  en `niveauSlotHint` — de gewone quiz gebruikt ze, met vergrendeling aan.
- `openBoek()` — drie andere ingangen (boek-zones, NT2-groep, boekenplank).
- `kiesNiveau()`, `bouwVuLijst()`, `openVuDetail()` — de opdracht zegt
  uitdrukkelijk dat de oefenmodus en de Nalezen-lijst zelf niet veranderen.
- `oefenModus` en alles wat eraan hangt (7 leesplekken) — ongewijzigd.

**Wordt onbereikbaar maar verdwijnt niet vanzelf:**

- De regel in `#bijbeltraining-scherm` die nu twee knoppen toont (r. 413 en
  r. 415) wordt één knop; de derde tot en met vijfde knop (Naslag & uitleg,
  Catechese, De verschillende kerken) blijven staan.

## 5. Openstaande keuzes vóór STAP B

Vier dingen die de opdracht niet vastlegt en die het resultaat bepalen:

1. Welk niveauscherm wordt het gedeelde: `#vu-niveau-scherm` (vergrendelingsvrij)
   of een aangepast `#niveau-scherm`? Zie punt 1 hierboven.
2. Eén statuspaar of twee? Bij één paar moet `terugNaarStartscherm()` niet
   langer `gekozenBoek`/`gekozenNiveau` wissen op een moment dat Nalezen ze nog
   nodig heeft.
3. Blijven de niveaus Beginner/Advanced/Expert heten, of worden het overal
   brons/zilver/goud? De opdracht noemt de kleuren in de route maar niet in de
   uit te voeren punten.
4. Ondertitel op het gedeelde niveauscherm: "Kies je niveau" of "Kies een
   niveau"?

Zodra deze vier beantwoord zijn — en stap 1 met `gaTerug()` gecommit is en de
branch bestaat — is STAP B uitvoerbaar.
