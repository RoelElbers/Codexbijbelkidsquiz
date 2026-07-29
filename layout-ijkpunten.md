# Layout-ijkpunten

Dit bestand legt vast welke maten in de layout **met de hand zijn opgemeten** op
de geschilderde achtergrondplaten, waarom ze zijn zoals ze zijn, en welke
valkuilen er bij het meten zijn. Als je hier over een half jaar terugkomt en de
context kwijt bent: begin bij "Het basisprincipe" hieronder. Dat verklaart
waarom sommige getallen er willekeurig uitzien terwijl ze dat niet zijn.

---

## Het basisprincipe

Het startscherm is grotendeels een **schilderij**, geen opgebouwde interface.
`#game-container` krijgt `images/startschermzonderwolken.png` als
achtergrondafbeelding, uitgerekt over de volle breedte en hoogte. Alles wat
daarin te zien is — de prijzenkast, de plaquettes, de boekenplank, de gouden
gleuf waar de XP-balk in ligt — zit in die ene afbeelding. Er is dus **geen
DOM-element** dat je aan zo'n vorm kunt koppelen.

De interactieve onderdelen (avatarframe, levelnummer, XP-balk, boekknoppen)
liggen als losse elementen *over* die plaat heen, gepositioneerd op percentages.
Zolang de plaat en de elementen dezelfde schaal volgen, blijft alles op zijn
plek.

Daaruit volgt de belangrijkste regel:

> **Alles wat over de geschilderde achtergrond ligt, rekent af van
> `--game-breedte` — nooit van vaste pixels.**

`--game-breedte` staat boven in `style.css` en is exact dezelfde formule als de
breedte van `#game-container`. Een element dat `height: 10px` krijgt, blijft 10px
terwijl de plaat eronder meeschaalt met het venster: op een groot scherm valt het
dan te klein uit en op een klein scherm te groot. Precies dat is één keer
misgegaan met de XP-balk (zie hieronder). Gebruik dus
`calc(var(--game-breedte) * <factor>)`, of percentages van de container.

Uitzondering: de quiz- en niveau-overlays. Die liggen niet op de plaat maar
vullen het scherm, en mogen wel gewone eenheden gebruiken.

---

## IJkpunt 1 — de XP-balk

**Waar het over gaat.** Rechtsonder op het startscherm zit een gouden, langwerpige
gleuf met daarin een blauwe voortgangsbalk. Die gleuf is geschilderd; de blauwe
balk is een element dat erover ligt (`#level-hud` › `.xp-paneel` › `.xp-balk` ›
`#xp-vulling`).

**De opgemeten maten.** In de gerenderde app bij een container van 1920×1080:

| onderdeel | app-rijen | hoogte |
| --- | --- | --- |
| gouden bovenrand | 895-896 | 2px |
| binnenkant van de gleuf | 897-920 | 24px |
| gouden onderrand | 921-922 | 2px |

**Waarom de balk 18px is en niet 24px.** `#level-hud` staat met `bottom: 15%`
vast aan de onderkant. Het element heeft geen eigen hoogte, dus als de balk hoger
wordt groeit hij alleen naar boven — de onderkant blijft staan waar hij staat. Die
onderkant valt op app-rij 917, en dat is 3px boven de onderkant van de gleuf. Er
blijft dus hoe dan ook 3px donker onder de balk staan. Om boven net zoveel lucht
te houden, blijft er van de 24px binnenkant 24 − 3 − 3 = **18px** over. Omgerekend
naar een meeschalende waarde: 18 / 1920 = **0,009375 × `--game-breedte`**.

Nagemeten bij containerbreedte 1920, 2560, 1366 en 693: overal exact evenveel
lucht boven als onder.

**Wat er misging, zodat je die fout niet herhaalt.** De eerste poging mikte op
"de balk raakt precies de binnenrand" — marge 0px boven, 3px onder. Rekenkundig
viel de balk keurig binnen de gleuf, maar in beeld sloot het blauw kierloos aan
tegen het goud terwijl er onderin wél ruimte was. Dat oogt alsof de balk over het
frame heen loopt. **Mik op een symmetrische marge, niet op nul.** Een getal dat
binnen de grenzen valt is nog geen vorm die klopt; kijk altijd ook naar de render.

**Als de achtergrondplaat vervangen wordt** moet deze factor opnieuw opgemeten
worden. De gleuf ligt dan waarschijnlijk een paar pixels hoger of lager, en het
getal 0,009375 is daar geen afgeleide van maar een uitkomst van meten.

---

## Valkuilen bij het opmeten

Deze twee hebben allebei tot een verkeerde conclusie geleid. Lees ze vóór je gaat
meten, niet erna.

### 1. Zonder profiel is de XP-balk er niet

`#level-hud` staat op `display: none` zolang er geen speler geladen is; zie
`verbergLevelHud()` in `script.js` (rond regel 6297). Bij een verse browser of een
schoon Chrome-profiel is de localStorage leeg, dus opent de app het
avatar-keuzescherm en is de HUD verborgen.

Het venijn zit hem hierin: een verborgen element geeft bij `getBoundingClientRect()`
gewoon **nul** terug voor alle waarden. In een meettabel ziet dat er niet uit als
een fout maar als een perfecte uitlijning — alle marges keurig 0,00. Er valt dan
alleen niets te zien, want er wordt niets getekend.

Wil je headless meten, zaai dan eerst een profiel in de localStorage en laad de
pagina opnieuw:

- `bkq_profielen` = een lijst met één object: `{ id, naam, avatar }`
- `bkq_actiefProfiel` = het `id` daaruit

Daarna kiest `initProfielOpstart()` de profielweergave en staat het echte
startscherm er, mét prijzenkast en XP-balk. Verberg voor de zekerheid ook de
overlays (`.quiz-overlay`, `.schatkamer-overlay`), want die dekken het scherm af.

### 2. `align-items: center` op `#level-hud` doet niets

In `style.css` staat op `#level-hud` netjes `display: flex` met
`align-items: center`. In de praktijk werkt dat nooit: `toonLevelHud()` in
`script.js` (rond regel 6307) zet **`display: block` als inline stijl**, en een
inline stijl wint van de stylesheet. Wie de verticale uitlijning van de balk
probeert te sturen via die `align-items` verandert niets en gaat op zoek naar een
probleem dat ergens anders zit.

De balk hangt dus simpelweg met zijn onderkant aan `bottom: 15%` en groeit naar
boven. Dat is ook precies waarom een wijziging van alléén de hoogte genoeg was en
`bottom` niet aangeraakt hoefde te worden.

### 3. Meet op de render, niet op het PNG-bestand

De achtergrondplaat is 1672×940 en wordt uitgerekt naar de containermaat. Rijen
die je in het bestand telt moet je dus omrekenen, en dat gaat makkelijk mis. Tel
liever de pixelrijen in een screenshot van de draaiende app bij 1920×1080; die
rijen kun je direct als percentage van de containerhoogte gebruiken.

---

## Media queries — stand van zaken en een openstaand risico

De layout leunt bijna niet op breakpoints. Er zijn er vijf, en maar één daarvan
kijkt naar de afmetingen van het venster:

| regel | voorwaarde | wat het doet |
| --- | --- | --- |
| 236 | `(hover: hover) and (pointer: fine)` | fullscreen-knop vervaagt op muisapparaten |
| 433 | `(prefers-reduced-motion: reduce)` | fakkelgloed stopt met bewegen |
| 987 | `(prefers-reduced-motion: reduce)` | zwevende "+N" bij een goed antwoord uit |
| 3709 | `(hover: none), (pointer: coarse)` | navigatiepijlen blijven zichtbaar op touch |
| **3749** | **`(max-width: 768px), (max-height: 500px)`** | **telefoon-/kort-scherm-modus: de hele overlay scrollt** |

De schaalbaarheid zit dus niet in breakpoints maar in `--game-breedte` en
`clamp()`. Dat is bewust: zo kan een correctie voor het ene formaat het andere
niet stukmaken.

### Het openstaande risico

Query 5 (`style.css:3749`) is **eenzijdig**: hij heeft alleen bovengrenzen en geen
ondergrens. En `max-width: 768px` is inclusief, dus een **iPad staand (768 CSS-px
breed)** valt er precies in en krijgt de telefoonbehandeling. In diezelfde query
staan vier `!important`-declaraties, dus er is ook geen ontsnapping via
specificiteit.

Dat is exact het patroon waar het eerder misging bij het levelschild: een
eenzijdige grens die een apparaat meepakt waarvoor hij niet bedoeld was. **Dit is
nog niet opgelost.** Als de layout-profielen structureel worden vastgelegd, is dit
het eerste dat een ondergrens verdient.

Ter volledigheid, de dekking van query 5 per apparaat:

- desktop 1920×1080 en laptop 1366×768: valt erbuiten (goed)
- iPad liggend 1024×768: valt erbuiten (goed)
- **iPad staand 768×1024: valt erin — ongewenst**
- Android-tablet 16:10 staand (800×1280): valt erbuiten, maar een tablet die op
  768 CSS-px uitkomt valt er wél in; de grens loopt dwars door die categorie
- telefoon liggend 16:9 (667×375): valt erin via beide voorwaarden (goed)
- telefoon liggend 20:9 (844×390): te breed voor `max-width`, valt erin dankzij
  `max-height: 500px` — die tweede voorwaarde is dus geen overbodige luxe

Verder is er niets wat elkaar overschrijft: de queries raken verschillende
selectors, dus de volgorde in het bestand doet er nu niet toe.

---

## Testlijst na elke layoutwijziging

Controleer een wijziging aan het startscherm of de HUD altijd op deze zeven
formaten. De eerste drie zijn de dagelijkse gevallen, de laatste vier zijn waar
het meestal misgaat.

| | viewport (CSS-px) | let op |
| --- | --- | --- |
| desktop | 1920×1080 | de referentie waar alle ijkpunten op gemeten zijn |
| laptop | 1366×768 | container wordt 1365 breed, let op afrondingen |
| iPad liggend | 1024×768 | container wordt hoogte-begrensd (1024×576) |
| iPad staand | 768×1024 | **valt in de telefoonquery** — controleer of dat stoort |
| Android-tablet 16:10 staand | 800×1280 | net buiten de query; randgeval |
| telefoon liggend 16:9 | 667×375 | kleinste container, marges worden subpixels |
| telefoon liggend 20:9 | 844×390 | breed en laag; alleen `max-height` vangt hem |

Bij de HUD is de snelste controle: staat de gouden rand van de gleuf rondom vrij
van het blauw, boven én onder? Zo ja, dan klopt de schaal.
