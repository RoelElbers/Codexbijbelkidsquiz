# STAP A — inventaris van alle Terug-navigatie

Peildatum: 1 september 2026. Branch `menu-herstructurering`, gelijk met `main`
(`1d4f4b4`). Alleen vastgesteld, niets gewijzigd.

## Vooraf: hoe schermen hier open en dicht gaan

Alle schermen zijn overlays boven het startscherm. Ze worden getoond en
verborgen met een inline `style.display` (`"flex"` / `"none"`), nooit met een
class. Het **startscherm zelf is geen overlay**: het ligt eronder. "Terug naar
het startscherm" is dus meestal niet meer dan het laatste overlay verbergen —
dat is precies wat `sluitBijbeltraining()` doet.

Twee uitzonderingen op dat patroon, allebei buiten deze verbouwing:
`#boekenplank` gebruikt een class (`zichtbaar`) plus `aria-hidden`, en
`#schatkamer-scherm` sluit via een animatie (`zoom-exit`, `setTimeout`).

Er zijn **38 Terug-achtige knoppen**: 35 in `index.html` en 3 die door
`script.js` in de quiz-box worden geschreven.

## Tabel 1 — Bijbeltraining-tak (binnen deze verbouwing)

19 knoppen op 13 schermen.

| Regel | Scherm | Functie | Gaat nu naar | Eén scherm terug? |
|---|---|---|---|---|
| 418 | `#bijbeltraining-scherm` | `sluitBijbeltraining()` (r. 8680) | startscherm (overlay verbergen) | ja — dit is de top van de tak |
| 432 | `#oefen-boek-scherm` | `terugNaarBijbeltraining()` (r. 8744) | `#bijbeltraining-scherm` | ja |
| 446 | `#vu-boek-scherm` *(boven)* | `sluitVuBoek()` (r. 8889) | `#bijbeltraining-scherm` | ja |
| 452 | `#vu-boek-scherm` *(onder)* | `sluitVuBoek()` | `#bijbeltraining-scherm` | ja — **dubbel** |
| 465 | `#vu-niveau-scherm` | `terugVuNiveau()` (r. 8902) | `#vu-boek-scherm` | ja |
| 474 | `#vu-lijst-scherm` *(boven)* | `terugVuLijst()` (r. 8914) | `#vu-niveau-scherm` | ja |
| 476 | `#vu-lijst-scherm` *(onder)* | `terugVuLijst()` | `#vu-niveau-scherm` | ja — **dubbel** |
| 484 | `#vu-detail-scherm` | `terugVuDetail()` (r. 8973) | `#vu-lijst-scherm` | ja |
| 501 | `#catechese-scherm` | `sluitCatechese()` (r. 9067) | `#bijbeltraining-scherm` | ja |
| 510 | `#catechese-lijst-scherm` *(boven)* | `terugCatecheseLijst()` (r. 9095) | `#catechese-scherm` | ja |
| 512 | `#catechese-lijst-scherm` *(onder)* | `terugCatecheseLijst()` | `#catechese-scherm` | ja — **dubbel** |
| 520 | `#catechese-artikel-scherm` | `terugCatecheseArtikel()` (r. 9148) | `#catechese-lijst-scherm` **óf** `#vs-reveal-scherm` | **voorwaardelijk — zie ⚠ 3** |
| 541 | `#naslag-scherm` | `sluitNaslag()` (r. 8759) | `#bijbeltraining-scherm` | ja |
| 551 | `#woordenboek-scherm` *(boven)* | `sluitWoordenboek()` (r. 8778) | `#naslag-scherm` | ja |
| 598 | `#woordenboek-scherm` *(onder)* | `sluitWoordenboek()` | `#naslag-scherm` | ja — **dubbel** |
| 610 | `#verborgenschat-naslag-scherm` *(boven)* | `sluitVerborgenSchatNaslag()` (r. 8810) | `#naslag-scherm` | ja |
| 648 | `#verborgenschat-naslag-scherm` *(onder)* | `sluitVerborgenSchatNaslag()` | `#naslag-scherm` | ja — **dubbel** |
| 657 | `#maten-scherm` *(boven)* | `sluitMaten()` (r. 8770) | `#naslag-scherm` | ja |
| 732 | `#maten-scherm` *(onder)* | `sluitMaten()` | `#naslag-scherm` | ja — **dubbel** |

Binnen deze tak klopt de navigatie dus overal, op één voorwaardelijk geval na.
De winst van een stack zit hier niet in het repareren van fouten maar in het
vervangen van dertien losse functies door één.

## Tabel 2 — Quiz-tak (buiten deze verbouwing)

| Regel | Scherm | Functie | Gaat nu naar | Eén scherm terug? |
|---|---|---|---|---|
| 347 | `#niveau-scherm` | `terugNaarStartscherm()` (r. 8573) | startscherm | **nee — zie ⚠ 1** |
| 367 | `#quiz-scherm`, `#oefen-stop-knop` | `terugNaarStartscherm()` | startscherm | **nee — zie ⚠ 2** |
| 373 | `#quiz-scherm`, `#ronde-stop-knop` | `vraagRondeStoppen()` | `#ronde-stop-scherm` (bevestiging) | n.v.t. — opent juist een scherm |
| 383 | `#ronde-stop-scherm` | `annuleerRondeStoppen()` | terug de lopende ronde in | ja |
| `script.js` 10701 | slotscherm "Goed geoefend!" | `terugNaarStartscherm()` | startscherm | bewust — ronde is afgelopen |
| `script.js` 10728 | slotscherm Verborgen Schat | `terugNaarStartscherm()` | startscherm | bewust — ronde is afgelopen |
| `script.js` 10794 | slotscherm gewone quiz | `terugNaarStartscherm()` | startscherm | bewust — ronde is afgelopen |

`#niveau-scherm` en `#quiz-scherm` zijn **gedeeld**: de Bijbeltraining-tak komt
er via Oefenen ook op uit. Ze horen tot de quiz-tak en blijven volgens de
opdracht ongemoeid, maar dat betekent wél dat de Oefenen-route straks halverwege
uit de stack stapt. Zie ⚠ 1 en ⚠ 2.

## Tabel 3 — Overige takken (buiten deze verbouwing)

| Regel | Scherm | Functie | Gaat nu naar | Eén scherm terug? |
|---|---|---|---|---|
| 175 | `#nt-scherm-2` | `gaNaarScherm1()` | startscherm-carrousel, scherm 1 | ja |
| 219 | `#boekenplank` | `sluitBoekenplank()` (r. 11093) | NT-scherm 2 (class weg) | ja |
| 285 | `#nieuw-spel-scherm` | `annuleerNieuwSpel()` | startscherm | ja |
| 317 | `#speler-kiezer-scherm` | `sluitSpelerKiezer()` (r. 7674) | startscherm + HUD terug | ja |
| 332 | `#verwijder-speler-scherm` | `annuleerProfielVerwijderen()` | spelerkiezer | ja |
| 756 | `#instellingen-scherm` | `sluitInstellingen()` (r. 10530) | startscherm | ja |
| 772 | `#steun-scherm` *(boven)* | `sluitSteun()` (r. 10548) | `#instellingen-scherm` | ja |
| 778 | `#steun-scherm` *(onder)* | `sluitSteun()` | `#instellingen-scherm` | ja — **dubbel** |
| 791 | `#updates-scherm` *(boven)* | `sluitUpdates()` (r. 10642) | `#steun-scherm` | ja |
| 795 | `#updates-scherm` *(onder)* | `sluitUpdates()` | `#steun-scherm` | ja — **dubbel** |
| 820 | `#zaal-scherm` | `sluitZaal()` (r. 10479) | schatkamer eronder | ja |
| 837 | `#schatkamer-scherm` | `sluitSchatkamer()` (r. 10517) | startscherm, met zoom-animatie | ja |

## Waar het NIET één scherm terug is

**⚠ 1 — `#niveau-scherm`, r. 347 → `terugNaarStartscherm()`.**
Dit scherm heeft vier ingangen. Vanuit de boek-zones op het startscherm
(`index.html` r. 121–124), de NT2-groepsknop (`script.js` r. 10921) en de
boekenplank (r. 11005) is "terug naar het startscherm" precies goed. Maar vanuit
**Oefenen** kwam de speler van `#oefen-boek-scherm`, en Terug springt dan over
twee schermen heen de hele Bijbeltraining-tak uit. Dit is het enige echte
navigatiegat in de tak — en het zit in een scherm dat volgens de opdracht niet
aangeraakt mag worden.

**⚠ 2 — `#oefen-stop-knop`, r. 367 → `terugNaarStartscherm()`.**
Zelfde patroon: midden in een oefenronde terug naar het startscherm in plaats van
naar `#niveau-scherm`. Hier is het verdedigbaar — de knop heet "stoppen", niet
"terug" — maar het is wel dezelfde sprong. Ook quiz-tak.

**⚠ 3 — `terugCatecheseArtikel()`, r. 9148.**
De enige knop met een voorwaarde erin. Er bestaat al een handgemaakte
één-niveau-stack: `catecheseArtikelHerkomst` (`script.js` r. 9058) wordt door
`openCatecheseArtikel(id, herkomst)` op `"vs-reveal"` gezet wanneer het artikel
vanaf de Verborgen-Schat-onthullingskaart is geopend, en dan keert Terug daar
netjes naar terug in plaats van naar de artikellijst. Functioneel klopt dit; het
is precies het probleem dat de nieuwe stack generiek oplost. Let op dat de
herkomst hier **de tak overschrijdt**: `#vs-reveal-scherm` hoort tot de quiz-tak.

## Dubbele Terug-knoppen

Negen schermen hebben er twee. Zes in de Bijbeltraining-tak, twee daarbuiten, en
één schijnbaar geval:

| Scherm | Boven | Onder | In scope? | Omvang van de pagina |
|---|---|---|---|---|
| `#woordenboek-scherm` | r. 551 `← Terug` | r. 598 `← Terug` | ja | 2112 woorden, 45 termen |
| `#verborgenschat-naslag-scherm` | r. 610 `← Terug` | r. 648 `← Terug` | ja | 1068 woorden, 12 kopjes |
| `#maten-scherm` | r. 657 `← Terug` | r. 732 `← Terug` | ja | 1010 woorden, 4 kopjes, 4 tabellen |
| `#vu-lijst-scherm` | r. 474 `← Terug` | r. 476 `← Terug` | ja | scrollbare lijst, 11 t/m 43 regels |
| `#catechese-lijst-scherm` | r. 510 `← Terug` | r. 512 `← Terug` | ja | scrollbare lijst, 1 of 2 regels |
| `#vu-boek-scherm` | r. 446 `← Terug` | r. 452 `Terug` | ja | scrollbare lijst, 18 boeken |
| `#steun-scherm` | r. 772 `← Terug` | r. 778 `Terug` | nee | 1 leesscherm |
| `#updates-scherm` | r. 791 `← Terug` | r. 795 `Terug` | nee | 1 leesscherm |
| `#quiz-scherm` | r. 367 oefen-stop | r. 373 ronde-stop | nee | **geen dubbel** — twee verschillende knoppen die elkaar uitsluiten |

Twee opmerkingen bij het opruimen:

- Bij `#catechese-lijst-scherm` staan de twee knoppen **direct boven en onder een
  lijst van hooguit twee regels**. Daar levert de onderste niets op.
- Bij `#vu-lijst-scherm` hangt het van het boek af: Jakobus beginner heeft 11
  regels, Matteüs expert 43. De onderste knop is daar wél zinvol.

## ⚠ 4 — Wat er stukgaat als de onclicks veranderen

`vulOefenBoeken()` (r. 8697) en `vulVuBoeken()` (r. 8838) **herkennen de
Terug-knop aan de tekst van zijn `onclick`-attribuut**:

```
const isTerugKnop = (b) => (b.getAttribute("onclick") || "").includes("terugNaarBijbeltraining");   // oefen
const isTerugKnop = (b) => (b.getAttribute("onclick") || "").includes("sluitVuBoek");               // vu
```

Ze gebruiken die knop als ankerpunt om de 18 boekknoppen ervóór in te voegen.
Twee gevolgen voor STAP B, allebei stil — er komt geen foutmelding:

1. Worden r. 432 en r. 446/452 op `gaTerug()` gezet, dan vindt `isTerugKnop`
   niets meer, is `terugKnop` `undefined`, en belanden alle 18 boeken via
   `ouder.appendChild()` **onder** de Terug-knop in plaats van erboven.
2. `vulVuBoeken()` pakt bewust de **laatste** Terug-knop met `.pop()`, met een
   comment erbij: er staat er ook één bovenaan, en met `find()` zou de hele
   lijst dáárboven belanden. Wordt de onderste knop (r. 452) verwijderd, dan
   wijst `.pop()` opeens naar de bovenste — en verschijnen de boeken bovenaan.

De onclick-wijziging en het verwijderen van de dubbele knoppen grijpen hier dus
op elkaar in. Beide functies hebben aanpassing nodig, of ze moeten de Terug-knop
voortaan aan iets stabielers herkennen (een `id` of een class) in plaats van aan
de naam van de functie in de onclick.

## Overzicht: wat STAP B zou omzetten

**Op `gaTerug()` (19 knoppen, 13 functies vervallen):**
`sluitBijbeltraining()`, `terugNaarBijbeltraining()`, `sluitVuBoek()`,
`terugVuNiveau()`, `terugVuLijst()`, `terugVuDetail()`, `sluitCatechese()`,
`terugCatecheseLijst()`, `terugCatecheseArtikel()`, `sluitNaslag()`,
`sluitWoordenboek()`, `sluitVerborgenSchatNaslag()`, `sluitMaten()`.

*(`sluitBijbeltraining()` en `terugCatecheseArtikel()`
verdienen aparte aandacht — de eerste is de bodem van de stack, de tweede draagt
de herkomst-uitzondering van ⚠ 3.)*

**Blijft `terugNaarStartscherm()` — bewust naar het startscherm:**

| Knop | Waarom |
|---|---|
| `#niveau-scherm` r. 347 | quiz-tak, drie van de vier ingangen komen van het startscherm |
| `#oefen-stop-knop` r. 367 | stopt een lopende ronde, geen navigatie |
| slotscherm "Goed geoefend!" (`script.js` r. 10701) | einde ronde |
| slotscherm Verborgen Schat (r. 10728) | einde ronde |
| slotscherm gewone quiz (r. 10794) | einde ronde |

**Blijft ongemoeid, andere tak:** r. 175, 219, 285, 317, 332, 373, 383, 756,
772, 778, 791, 795, 820, 837.

## Openstaande punten vóór STAP B

1. **De Oefenen-route valt halverwege uit de stack.** De weg loopt
   `#bijbeltraining-scherm` → `#oefen-boek-scherm` → `#niveau-scherm` →
   `#quiz-scherm`, en de laatste twee horen tot de quiz-tak die niet aangeraakt
   mag worden. Duwt `kiesOefenBoek()` wél op de stack, dan staat er een pad in
   dat door geen enkele knop wordt afgewikkeld; duwt hij niet, dan is de stack
   na Oefenen stil verouderd. Het legen bij het verlaten van de tak vangt dat op,
   mits `terugNaarStartscherm()` de stack leegmaakt — dat is de plek waar de tak
   in de praktijk verlaten wordt.
2. **`#vs-reveal-scherm` in de stack.** ⚠ 3 kruist de takgrens. Ofwel
   `catecheseArtikelHerkomst` blijft naast de stack bestaan, ofwel de stack moet
   ook dat scherm kunnen bevatten — en dan raakt de verbouwing tóch de quiz-tak.
3. **`vulOefenBoeken()` / `vulVuBoeken()`** moeten mee (⚠ 4), anders verhuizen de
   boekknoppen stilzwijgend naar de verkeerde plek.
4. **Welke schermen gelden als "lange leespagina"** en houden dus hun onderste
   knop? Op grond van omvang liggen `#woordenboek-scherm`,
   `#verborgenschat-naslag-scherm` en `#maten-scherm` voor de hand, en
   `#vu-lijst-scherm` bij de langere boeken. `#catechese-lijst-scherm` (1–2
   regels) en `#vu-boek-scherm` zijn twijfelgevallen. Die keuze is aan u.
