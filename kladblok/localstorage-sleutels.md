# STAP A — inventaris van alle localStorage-sleutels

Peildatum: 1 september 2026. Branch `menu-herstructurering`, commit `fd042ae`.
Alleen opgezocht, niets gewijzigd.

`script.js` is het enige bestand dat localStorage aanraakt: 38 aanroepen.
`index.html` en `lang/nl.js` noemen het woord alleen in commentaar.

De sleutels vallen in drie groepen: **globaal** (gelden voor het hele apparaat),
**per profiel** (met de prefix `speler_<id>_`), en **oud** (niet-geprefixt,
alleen nog gelezen door de eenmalige migratie).

## Hoe het actieve profiel-id wordt bepaald

Alle voortgang hangt aan één id. De keten is drie stappen lang:

1. **`getActiefProfielId()`** (r. 7300–7302) leest de sleutel
   `bkq_actiefProfiel` en geeft `""` terug als die niet bestaat.
2. **`profielSleutel(sleutel)`** (r. 7350–7352) plakt daar de voortgangsnaam
   achter: `` `speler_${getActiefProfielId()}_${sleutel}` ``. Zonder actief
   profiel levert dat `speler__trofee_matteus` op — een lege prefix, wat in de
   praktijk neerkomt op "niets verdiend". Dat komt alleen voor vlak vóór het
   eerste profiel bestaat.
3. Het id zelf komt uit **`nieuwProfielId()`** (r. 7315–7320):
   `crypto.randomUUID()` waar beschikbaar, anders
   `"p" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8)`.
   Het is bewust verborgen — nergens in het spel zichtbaar.

Het register staat in `bkq_profielen`: een JSON-array van objecten
`{ id, naam, avatar }`. Om het id van de actieve speler in de console te
vinden volstaat dus `localStorage.getItem("bkq_actiefProfiel")`; met
`JSON.parse(localStorage.getItem("bkq_profielen"))` ziet u bij welke naam dat
hoort.

## Tabel 1 — Globale sleutels (niet per profiel)

| Sleutel | Wat erin staat | Geldige waarden | Waar het spel van afhangt | Gezet in |
|---|---|---|---|---|
| `geluidAan` | geluid aan of uit | `"aan"` / `"uit"` | Alles wat geluid maakt. Gelezen op r. 19 bij het laden; álles behalve exact `"uit"` telt als aan. | `wisselGeluid()`, r. 10652–10655 (setItem r. 10654) |
| `bkq_profielen` | register van alle spelers | JSON-array `[{ id, naam, avatar }]`; `avatar` is een sleutel uit `avatarNamen` (mozes, esther, judith, samuel, jozef, elia, ruth, maria), standaard `"mozes"` | Wie er in de spelerkiezer staan. Ongeldige JSON wordt stil `[]` (`leesProfielen()`, r. 7287–7294). | `bewaarProfielen()`, r. 7296–7298 (setItem r. 7297) |
| `bkq_actiefProfiel` | id van de speler die nu speelt | het `id`-veld van een profiel uit het register | Bepaalt de prefix van álle voortgangssleutels — zie hierboven | `setActiefProfielId()`, r. 7304–7306 (setItem r. 7305) |
| `afstel_zaalposities_v1` | handmatig versleepte posities in de schatkamer | JSON-object `{ "<afstelKey>": { x, top, breedte, … } }`; kapotte JSON valt terug op `{}` | Alleen de afstelmodus (dev-tool). Overschrijft de posities uit de config. | r. 9491; gelezen r. 9487; gewist r. 10437 |
| `bijbelQuizXP` | — | — | **Wordt alleen nog gewist**, nooit geschreven: een eenmalige opschoning van oude testdata op r. 6914, die bij elke laadbeurt draait. | nergens |

Geluid en de afstelposities zijn bewust globaal: dat zijn apparaatinstellingen,
geen voortgang.

## Tabel 2 — Per profiel: `speler_<id>_…`

`<id>` is de waarde uit `bkq_actiefProfiel`.

| Sleutel | Wat erin staat | Geldige waarden | Waar het spel van afhangt | Gezet in |
|---|---|---|---|---|
| `speler_<id>_trofee_<boekKey>` | hoogst behaalde trofee voor één boek | `"geen"` / `"brons"` / `"zilver"` / `"goud"` (`trofeeVolgorde`, r. 6927). Onbekende waarde telt als `"geen"`. | De trofee in de prijzenkast en de vitrines; **en de niveauvergrendeling**: `niveauDrempel` (r. 7148) eist brons voor Advanced en zilver voor Expert. Ook de NT-kast leest dit via `leesTrofeeStand()` (r. 9307–9315). | `setTrofeeNiveau()`, r. 7095–7112 (setItem r. 7105). Verlaagt nooit: alleen een hóger niveau wordt weggeschreven. |
| `speler_<id>_schildpunt_<boekKey>_<niveau>` | is dit schildpunt al verdiend | alleen `"1"`; afwezig = nog niet verdiend | Het aantal punten op het schild. Elk boek+niveau telt hooguit één keer. | `setSchildpuntVerdiend()`, r. 7230–7232 (setItem r. 7231); sleutel via `schildKey()`, r. 7222–7224 |
| `speler_<id>_kist_<kistKey>` | is deze schatkist verdiend | `"vergrendeld"` / `"verdiend"` (`kistVolgorde`, r. 6973). Onbekend telt als `"vergrendeld"`. | Of de kist op het startscherm en in de zaal vol of donker is — **en of de Verborgen Schat speelbaar is**: `magVerborgenSchatSpelen()` (r. 7035–7039) eist dat alle drie op `"verdiend"` staan. | `setKistStatus()`, r. 6999–7008 (setItem r. 7006) |
| `speler_<id>_verborgenschat_voltooid` | is de Verborgen Schat ontdekt | exact `"waar"`; elke andere waarde telt als niet ontdekt | De diamanten kist gaat van donker silhouet naar vol (startscherm én schatkamer), en de knop "Verborgen Schat" in Naslag & uitleg ontgrendelt (`isVerborgenSchatOntgrendeld()`, r. 8825–8827) | `eindScherm()`, r. 10694 — alleen bij 10 van de 10 goed |

**`<boekKey>`** — de achttien korte sleutels uit `boekNaarKey` (r. 7049–7068).
Ze zijn gelijk aan de achttien `sleutel: "trofee_…"`-waarden in de
vitrineconfig:

```
matteus            marcus              lucas             johannes
handelingen        romeinen            korintiers        galaten
efeziers           filippenzen         kolossenzen_filemon
tessalonicenzen    timoteus_titus      hebreeen          jakobus
petrus_judas       johannesbrieven     openbaring
```

**`<niveau>`** — `beginner`, `advanced`, `expert` (`niveauKeys`, r. 7220).
**`<kistKey>`** — `brons`, `zilver`, `goud` (`alleKistKeys`, r. 6991).

Een volledig uitgespeeld profiel heeft dus **76 sleutels**: 18 trofeeën,
54 schildpunten (18 × 3), 3 kisten en 1 verborgen schat.

Bij het verwijderen van een profiel worden ze in één keer opgeruimd: de lus op
r. 7726–7731 loopt langs `localStorage` en wist alles met de prefix
`speler_<id>_`.

## Tabel 3 — Oude, niet-geprefixte sleutels (alleen migratie)

Deze bestonden vóór het profielensysteem. `migreerNaarProfielen()`
(r. 7378–7411) draait één keer — zolang `bkq_profielen` nog niet bestaat — en
verhuist ze naar het eerste profiel. Daarna zijn ze weg.

| Sleutel | Wat ermee gebeurt |
|---|---|
| `bijbelQuizAvatar` | gelezen r. 7358 en 7383; wordt het `avatar`-veld van het eerste profiel; daarna gewist (r. 7409) |
| `bijbelQuizSpelerNaam` | gelezen r. 7359 en 7384; wordt het `naam`-veld; daarna gewist (r. 7410) |
| `trofee_<boekKey>` | verhuisd naar `speler_<id>_trofee_<boekKey>` (r. 7402) |
| `schildpunt_<boekKey>_<niveau>` | verhuisd (r. 7403) |
| `kist_<kistKey>` | verhuisd (r. 7405) |
| `verborgenschat_voltooid` | verhuisd (r. 7406) |

`heeftOudeVoortgang()` (r. 7356–7371) kijkt of één van deze sleutels bestaat.
Zo ja, dan wordt oude voortgang overgenomen in een eerste profiel; zo nee, dan
toont het spel het Nieuw-spel-scherm.

## Twee schakelaars die localStorage helemaal overslaan

Relevant voor het doel "voortgang zetten zonder te spelen": er bestaan al twee
URL-parameters die niets opslaan maar de weergave forceren.

| Parameter | Wat het doet | Waar |
|---|---|---|
| `?demo=brons` / `?demo=zilver` / `?demo=goud` | `demoNiveau` (r. 7083–7086). `getTrofeeNiveau()` en `getKistStatus()` geven dan **altijd** dat niveau terug, en `setTrofeeNiveau()` slaat niets op. Alle trofeeën en kisten zien er behaald uit. | r. 7083, 7089, 6994, 7097 |
| `?afstel=aan` | `afstelModus` (r. 9483). Onder meer: `openVerborgenSchat()` laat de ronde ook toe als de kisten nog niet verdiend zijn (r. 8186), en de kisten worden altijd onthuld getoond. | r. 9483 |

Let op het verschil met wat STAP B gaat doen: `?demo=` **toont** alles als
behaald maar schrijft niets, en `verborgenschat_voltooid` blijft daarbij
ongemoeid — de naslagpagina onder Naslag & uitleg blijft dus op slot. Een
script dat écht wil ontgrendelen moet naar localStorage schrijven.

## Wat STAP B minimaal moet zetten

Om brons, zilver en goud te geven én de Verborgen Schat te ontgrendelen, voor
het profiel dat op dat moment actief is:

```
speler_<id>_kist_brons                  = "verdiend"
speler_<id>_kist_zilver                 = "verdiend"
speler_<id>_kist_goud                   = "verdiend"
speler_<id>_verborgenschat_voltooid     = "waar"
```

Twee dingen om daarbij te bedenken, allebei uw beslissing:

1. **De kisten en de trofeeën staan los van elkaar.** Alleen de drie
   `kist_`-sleutels maken de Verborgen Schat *speelbaar*
   (`magVerborgenSchatSpelen()`). De niveauvergrendeling in de gewone quiz hangt
   aan `trofee_<boekKey>`, en die blijft met bovenstaande vier sleutels gewoon
   dicht. Wilt u ook alle niveaus open, dan moeten er 18 trofeesleutels op
   `"goud"` bij.
2. **Er is geen actief profiel vóór het eerste spel.** Staat
   `bkq_actiefProfiel` leeg, dan schrijft het script naar `speler__kist_brons`
   — een sleutel die het spel wel weer leest, maar die bij het aanmaken van een
   echt profiel niet meeverhuist. Het script zou daarop moeten controleren en
   anders een duidelijke melding geven.
