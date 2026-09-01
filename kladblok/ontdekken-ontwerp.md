# STAP A — ontwerp: de Ontdekken-hub

Peildatum 1 september 2026, branch `menu-herstructurering`, commit `e66e960`.
Alleen opgemeten en ontworpen; niets gewijzigd.

Doel: één config-gestuurde hub die "Naslag & uitleg" en "Catechese" vervangt.
Zeven rubrieken, waarvan één op slot.

## Wat er nu staat en waar het heen gaat

Zeven overlays in `index.html` en twee config-arrays in `script.js` gaan op in
de hub. Samen goed voor **161 regels HTML en ongeveer 5270 woorden inhoud**.

| Nu | Regels | Woorden | Wordt |
|---|---|---|---|
| `#naslag-scherm` | 530–545 (16) | 13 | vervalt — de hub is het nieuwe tussenmenu |
| `#woordenboek-scherm` | 550–602 (53) | 2114 | rubriek **Woorden**, één onderwerp |
| `#maten-scherm` | 656–736 (81) | 1010 | rubriek **Hoe leefden ze toen**, drie onderwerpen |
| `#verborgenschat-naslag-scherm` | 609–652 (44) | 1068 | rubriek **Verborgen Schat** (op slot), 12 onderwerpen |
| `#catechese-scherm` | 499–506 (8) | 5 | vervalt |
| `#catechese-lijst-scherm` | 510–516 (7) | — | vervalt |
| `#catechese-artikel-scherm` | 520–525 (6) | — | vervalt |
| `catecheseCategorieen` (`script.js` 8931–8934) | 4 | — | vervalt; de rubriek ís de categorie |
| `catecheseArtikelen` (`script.js` 8939–8994) | 56 | 1074 | rubriek **Verborgen patronen**, drie onderwerpen |
| `kerken.html` en verder (9 pagina's) | — | 4060 | rubriek **De verschillende kerken**, ongewijzigd |

### De zes rubrieken, gevuld

| Rubriek | Onderwerpen nu | Bron |
|---|---|---|
| **Woorden** | 1: Woordenboek (44 termen) | `index.html` 552–599 |
| **Wie is wie** | 0 — leeg, komt later | — |
| **Waar gebeurde het** | 0 — leeg, komt later | — |
| **Hoe leefden ze toen** | 3: Geld, Maten, Tijd | `index.html` 661–732 |
| **Verborgen patronen** | 3: De 153 vissen, De verborgen schat in de brieven van Paulus, De sandwich-techniek van Marcus | `script.js` r. 8940–8993 |
| **De verschillende kerken** | verlaat het spel naar `kerken.html` | ongewijzigd |
| **Verborgen Schat** *(op slot)* | 12 | `index.html` 612–650 |

### `#maten-scherm` wordt drie onderwerpen

Het scherm heeft nu vier h3-koppen; die vallen uiteen in drie onderwerpen,
omdat Lengte en Inhoud allebei "maten" zijn:

| Nieuw onderwerp | Uit | Regels | Woorden | Bijzonderheden |
|---|---|---|---|---|
| **Geld** | h3 "Geld in de Bijbel" | 665–670 | 237 | 1 noot + 4 termen (Penning, Denarie, Pond, Talent) |
| **Maten** | h3 "Lengte" + h3 "Inhoud" | 672–683 | 224 | 1 noot + 8 termen; de twee h3's blijven als koppen bínnen het onderwerp |
| **Tijd** | h3 "Tijd" | 685–732 | 499 | 4 tabellen, 2 noten, 8 termen — veruit het rijkste onderwerp |

Het kadertje bovenaan (regel 661–663, 47 woorden: *"Sommige maten kennen we vrij
precies, andere niet…"*) hoort bij alle drie. Voorstel: het wordt de
**rubriek-inleiding**, één keer getoond op het onderwerpenscherm van
"Hoe leefden ze toen", in plaats van driemaal herhaald.

## 2. Voorstel voor de configstructuur

### Twee lagen: rubriek en onderwerp

```js
// Eén rubriek = één tegel in de Ontdekken-hub.
//   id           sleutel; ook gebruikt voor deep-links en voor het slot
//   naam         wat op de tegel staat
//   inleiding    optioneel; één alinea boven de onderwerpenlijst
//   onderwerpen  lijst; bij precies één onderwerp slaat de hub de
//                tussenstap over en opent het meteen
//   extern       optioneel; verlaat het spel naar een HTML-pagina
//   slot         optioneel; functie die true geeft als de rubriek open is
//   slotHint     tekst onder een rubriek die nog op slot zit
const ontdekRubrieken = [
    { id: "woorden", naam: "Woorden",
      onderwerpen: [
          { id: "woordenboek", naam: "Woordenboek", type: "lexicon", inhoud: WOORDENBOEK }
      ] },

    { id: "wie",  naam: "Wie is wie",        onderwerpen: [] },
    { id: "waar", naam: "Waar gebeurde het", onderwerpen: [] },

    { id: "hoe", naam: "Hoe leefden ze toen",
      inleiding: "Sommige maten kennen we vrij precies, andere niet — dan zeggen we dat er eerlijk bij. …",
      onderwerpen: [
          { id: "geld",  naam: "Geld",  type: "artikel", inhoud: ART_GELD  },
          { id: "maten", naam: "Maten", type: "artikel", inhoud: ART_MATEN },
          { id: "tijd",  naam: "Tijd",  type: "artikel", inhoud: ART_TIJD  }
      ] },

    { id: "patronen", naam: "Verborgen patronen",
      onderwerpen: [
          { id: "vissen-153",     naam: "De 153 vissen",                            type: "artikel", inhoud: … },
          { id: "paulus-brieven", naam: "De verborgen schat in de brieven van Paulus", type: "artikel", inhoud: … },
          { id: "sandwich",       naam: "De sandwich-techniek van Marcus",          type: "artikel", inhoud: … }
      ] },

    { id: "kerken", naam: "De verschillende kerken", extern: "kerken.html" },

    { id: "schat", naam: "Verborgen Schat",
      slot: isVerborgenSchatOntgrendeld,
      slotHint: "Speel eerst de Verborgen Schat om te ontgrendelen",
      onderwerpen: [ /* de 12 blokken */ ] }
];
```

De lege rubrieken hoeven geen bijzondere behandeling: `bouwOntdekLijst()` toont
dan de melding die `bouwCatecheseLijst()` nu al kent — *"Voor dit onderwerp komen
binnenkort artikelen."* (`script.js` r. 9037). Dat is meteen de eerste keer dat
die regel bereikbaar wordt; nu is hij dode tekst.

### Contenttype 1 — `lexicon`

Een alfabetische lijst met korte uitleg. Woorden, Wie is wie en Waar gebeurde
het krijgen dezelfde vorm.

```js
const WOORDENBOEK = [
    { term: "Allerheiligste", uitleg: "Het meest heilige, afgesloten deel binnen in de tempel. …" },
    { term: "Altaar",         uitleg: "Een verhoogde plek, vaak van steen, waar offers …" },
    { term: "Apostel",        uitleg: "Het woord betekent \"gezant\" …", bijbelplaats: "Matteüs 10:2" },
    …
];
```

`bijbelplaats` is **optioneel**, en dat is geen theoretisch detail: geen van de
44 bestaande woordenboektermen heeft er een. Ze bestaan nu als
`<p class="naslag-item"><span class="naslag-term">Term</span> — uitleg</p>` en
komen één op één over. Bijbelplaatsen toevoegen is losstaand inhoudelijk werk;
de renderer laat de regel weg als het veld ontbreekt.

*Let op:* eerdere kladblok-notities spreken van 45 woordenboektermen. Het zijn
er **44** (Allerheiligste t/m Zonde) — hier opnieuw geteld.

### Contenttype 2 — `artikel`

Lopende tekst met kopjes, soms een tabel. Opgebouwd uit getypeerde blokken die
één op één op de bestaande CSS-klassen passen, zodat er **geen nieuwe CSS**
nodig is:

| Blok | Rendert als | Bestaande klasse |
|---|---|---|
| `{ kader: "…" }` | ingekaderde inleiding | `.naslag-kadertje` |
| `{ kop: "…" }` | h3 | `.naslag-kop` |
| `{ tekst: "…" }` | alinea | `.naslag-item` |
| `{ noot: "…" }` | kleine kanttekening | `.naslag-noot` |
| `{ term: "El", uitleg: "…" }` | vetgedrukte term + uitleg | `.naslag-item` + `.naslag-term` |
| `{ tabel: { koppen: [...], rijen: [[...]] } }` | tabel | `.naslag-tabel` |

Voorbeeld, het onderwerp Maten:

```js
const ART_MATEN = [
    { kop: "Lengte" },
    { term: "El",     uitleg: "ongeveer 45 centimeter, zo lang als de afstand van je elleboog tot je vingertoppen. …" },
    { term: "Stadie", uitleg: "een afstandsmaat van ongeveer 185 meter. …" },
    { term: "Mijl",   uitleg: "de Romeinse mijl was ongeveer 1.500 meter …" },
    { kop: "Inhoud" },
    { noot: "Hier weten we het minder zeker: er bestond geen officiële standaard …" },
    { term: "Vat", uitleg: "ongeveer 22 liter, zoiets als een flinke emmer. …" },
    …
];
```

Een `lexicon` is in feite een `artikel` dat alleen uit `term`-blokken bestaat.
Ze blijven toch twee types, omdat het lexicon een eigen scherm verdient
(alfabetisch, scrollbaar, later eventueel met zoekveld) terwijl een artikel
gewoon van boven naar beneden gelezen wordt.

### Een nieuw onderwerp toevoegen

**Nu** — bijvoorbeeld een onderwerp "Feesten" onder Naslag & uitleg:

1. `index.html`: een nieuw overlay-blok van 10 tot 80 regels, met h2, twee
   Terug-knoppen en alle tekst erin.
2. `script.js`: een functie `openFeesten()`.
3. `index.html`: een knop in `#naslag-scherm`.
4. Cache-buster ophogen.

**Straks:**

1. Eén regel in de rubriek: `{ id: "feesten", naam: "Feesten", type: "artikel", inhoud: ART_FEESTEN }`
2. Het inhoudsblok `ART_FEESTEN` ernaast — alleen tekst, geen opmaak.
3. Cache-buster ophogen.

**Wat er niet meer hoeft:** geen regel HTML, geen `open…()`-functie, geen knop
in een menu, geen Terug-knoppen, geen id's, geen scrollinstellingen. De hub
bouwt de tegels en de lijsten uit de config, en `gaTerug()` regelt de navigatie
al.

### In welk bestand?

De inhoud is ruim 5000 woorden en groeit — "Wie is wie" en "Waar gebeurde het"
zijn nog leeg. `script.js` telt nu al ruim 11.000 regels.

Voorstel: een apart bestand `ontdekken-inhoud.js`, ingeladen vóór `script.js`,
met alleen de inhoudsblokken; de rubriekenstructuur zelf blijft in `script.js`
bij de andere config. Dat houdt de prozateksten uit het codebestand.

**Let op de cache-buster.** `CLAUDE.md` schrijft voor dat `style.css`,
`lang/nl.js` en `script.js` samen één nummer dragen. Een vierde bestand hoort
dan in diezelfde groep mee te gaan. Dat is een aanpassing van de projectregel —
uw beslissing. Alternatief: alles in `script.js` houden, dan verandert er niets
aan de regel.

## 3. De vergrendelde rubriek

Er zijn twee bestaande slot-vormen in het spel, allebei bruikbaar zonder één
regel nieuwe CSS.

### Vorm A — de knop, zoals de Verborgen Schat-knop nu al werkt

`index.html` r. 541–542 doet vandaag precies wat gevraagd wordt:

```html
<button id="verborgenschat-knop" class="answer-btn niveau-btn naslag-diamant vergrendeld" …>Verborgen Schat</button>
<p id="verborgenschat-hint" class="naslag-slot-hint">Speel eerst de Verborgen Schat om te ontgrendelen</p>
```

- `.answer-btn.vergrendeld` (`style.css` 2452–2470): gedimd, `cursor: not-allowed`,
  en een 🔒 achter het label via `::after`.
- `.naslag-diamant.vergrendeld` (2484): houdt de diamantstijl in plaats van de
  algemene grijze look.
- `.naslag-slot-hint` (2619–2627): het regeltje eronder.
- `werkVerborgenSchatNaslagKnopBij()` (`script.js` 8845–8855) zet de class en
  verbergt de hint zodra de vlag staat.

De logica bestaat dus al; ze hoeft alleen generiek te worden gemaakt over
`rubriek.slot`.

### Vorm B — de boektegel, "een nog niet vrijgespeeld Bijbelboek"

Dit is letterlijk waar de opdracht naar verwijst: de boekenplank.

- `.plank-boek.vergrendeld .plank-boek-cover` (`style.css` 3631–3634):
  `opacity: 0.6`, `grayscale(0.4)`.
- `.plank-boek.vergrendeld .plank-naam` (3635–3637): `opacity: 0.7`.
- `.plank-boek.vergrendeld:hover` (3639–3642): rustige hover, geen gouden gloed
  die "speelbaar" suggereert.
- `.plank-slot` (3645–3658): klein goudkleurig hangslot, gecentreerd op de
  cover, `pointer-events: none`.
- De renderer staat in `script.js` r. 10990–10997: bij `!boek.beschikbaar` komt
  er `knop.classList.add("vergrendeld")` bij plus een `<span class="plank-slot">`
  met een inline SVG-slotje.

**Welke van de twee** hangt af van de vorm van de hub. Wordt Ontdekken een
rij menuknoppen zoals `#naslag-scherm` nu, dan is vorm A de juiste en is er
niets nieuws nodig. Wordt het een tegelraster zoals de boekenplank, dan vorm B —
ook dan alleen bestaande klassen, maar de hub moet dan wel de tegelopmaak
overnemen. Vorm A is de kleinste stap; vorm B sluit het nauwst aan bij "in
dezelfde vorm als een nog niet vrijgespeeld Bijbelboek".

Beide keren blijft de sleutel dezelfde: `isVerborgenSchatOntgrendeld()`
(`script.js` 8839–8841), die
`speler_<id>_verborgenschat_voltooid === "waar"` leest.

## 4. De dubbele sandwich-tekst

De tekst staat nu op drie plaatsen:

| Waar | Vorm | Woorden |
|---|---|---|
| Verborgen Schat-vraag 12, veld `reveal` (`script.js` r. 8105) | onthullingskaart tijdens de ronde | 49 |
| `#verborgenschat-naslag-scherm`, h3-blok (`index.html` 647–650) | naslagkop, één alinea | 165 |
| Catechese-artikel `verborgen-patronen-sandwich` (`script.js` r. 8982–8993) | artikel, vier alinea's | 175 |

De laatste twee zijn **zin voor zin identiek**: alle 8 zinnen van de naslagversie
komen woordelijk terug in het artikel, dat er één slotvraag bij heeft. De
`reveal` is zelfstandig geschreven en overlapt met geen van beide.

In de nieuwe indeling zouden ze uit elkaar komen te liggen — de naslagkop in de
rubriek **Verborgen Schat**, het artikel in **Verborgen patronen** — en dus
dubbel blijven staan.

**Voorstel:** één canonieke versie, namelijk het artikel (langer, en met de
slotvraag die het kind aan het denken zet), in Verborgen patronen. De rubriek
Verborgen Schat krijgt in plaats van een eigen kopie een verwijzing:

```js
{ id: "sandwich", naam: "De sandwich-techniek van Marcus", verwijstNaar: "patronen/sandwich" }
```

De hub opent dan gewoon het artikel uit de andere rubriek. Dat scheelt 165
woorden dubbele tekst en houdt één plek om te onderhouden. Het is wel een
inhoudelijke ingreep — er verdwijnt een blok uit de huidige naslagpagina — dus
uw akkoord.

De `reveal` blijft zoals hij is: die hoort bij de ronde, niet bij de hub.

## 5. De vier Verborgen Schat-vragen zonder naslagplek

De naslagpagina dekt de vragen 1 t/m 12; de vragen 13 t/m 16 ontbreken er.
De hub verandert daar op zichzelf niets aan, maar maakt het in config
oplosbaar. Per vraag:

| Vraag | Wat er al is | Voorstel |
|---|---|---|
| 13 — De 153 vissen | catechese-artikel, 336 woorden | verwijzing naar `patronen/vissen-153` |
| 14 — Volgorde van Paulus' brieven | catechese-artikel, 563 woorden | verwijzing naar `patronen/paulus-brieven` |
| 15 — Het oor van Malchus | alleen een `reveal` van 146 woorden (`script.js` r. 8144) | **nieuw onderwerp** in de rubriek Verborgen Schat |
| 16 — De brief aan de Hebreeën | alleen een `reveal` van 81 woorden (`script.js` r. 8151) | **nieuw onderwerp** in de rubriek Verborgen Schat |

Voor 13 en 14 is er dus geen nieuwe tekst nodig: de artikelen bestaan al en
landen vanzelf in Verborgen patronen; er hoeven alleen twee verwijzingsregels
bij.

Voor 15 en 16 wél. Die 227 woorden bestaan nu alleen als `reveal` en zijn na
"Volgende →" nergens meer terug te lezen. De reveal-tekst is bruikbaar als
basis, maar is geschreven als verrassing tijdens een ronde ("Dit is de laatste
genezing van Jezus vóór het kruis…"); voor een naslagonderwerp wil je hem
waarschijnlijk iets omschrijven. Dat is de enige echte schrijfopdracht in dit
hele plan.

Uitkomst: de rubriek Verborgen Schat gaat van 12 naar 16 onderwerpen — 11 eigen
blokken, 1 verwijzing (sandwich), 2 verwijzingen (vissen, Paulus) en 2 nieuwe
(Malchus, Hebreeën) — en dan dekt hij eindelijk de hele vragenpool.

## 6. Wat overbodig wordt

### Schermen — zeven eruit, drie erin

| Vervalt | Regels |
|---|---|
| `#naslag-scherm` | 530–545 |
| `#woordenboek-scherm` | 550–602 |
| `#verborgenschat-naslag-scherm` | 609–652 |
| `#maten-scherm` | 656–736 |
| `#catechese-scherm` | 499–506 |
| `#catechese-lijst-scherm` | 510–516 |
| `#catechese-artikel-scherm` | 520–525 |

Daarvoor in de plaats drie generieke schermen, samen naar schatting 25 regels:
`#ontdek-scherm` (de zeven rubrieken), `#ontdek-lijst-scherm` (de onderwerpen
van één rubriek) en `#ontdek-detail-scherm` (één lexicon of artikel). Alle drie
leeg in de HTML en gevuld door JS, net als `#vu-lijst-scherm` en
`#catechese-lijst-scherm` nu.

### Functies — tien eruit

| Functie | Regel |
|---|---|
| `openNaslag()` | 8820 |
| `openMaten()` | 8828 |
| `openWoordenboek()` | 8831 |
| `werkVerborgenSchatNaslagKnopBij()` | 8845 |
| `openVerborgenSchatNaslag()` | 8857 |
| `openCatechese()` | 9000 |
| `bouwCatecheseCategorieen()` | 9007 |
| `kiesCatecheseCategorie()` | 9021 |
| `bouwCatecheseLijst()` | 9027 |
| `openCatecheseArtikel()` | 9054 |

Plus de statusvariabele `catecheseCategorie` (8997) en de config-array
`catecheseCategorieen` (8931).

Daarvoor terug: `openOntdekken()`, `bouwOntdekRubrieken()`,
`kiesOntdekRubriek()`, `bouwOntdekLijst()`, `openOntdekOnderwerp()` — vijf
functies die samen alle zeven rubrieken en beide contenttypes aankunnen.

### Blijft staan

- `isVerborgenSchatOntgrendeld()` (8839) — ook gebruikt door de diamanten kist
  op het startscherm en door de schatkamer.
- `gaNaarScherm()`, `gaTerug()`, `leegSchermStack()` — de hub hangt er volledig
  aan; elke Terug blijft `gaTerug()`.
- De hele kerken-tak (`kerken.html` en de acht vervolgpagina's), ongewijzigd.
  De rubriek is alleen een andere ingang naar dezelfde pagina's.

### Eén verbinding die opnieuw gelegd moet worden

`vsRevealMeer()` (`script.js` 8541) roept nu `openCatecheseArtikel(id)` aan —
de deep-link vanaf de Verborgen-Schat-onthullingskaart naar een artikel, met de
harde eis dat een lopende ronde niet breekt. Die aanroep moet mee naar de hub,
bijvoorbeeld `openOntdekOnderwerp("patronen", id)`. Het mechanisme eronder
verandert niet: `huidigScherm` op `"vs-reveal-scherm"` zetten en de stack de
rest laten doen. Dit is het enige punt waar de verbouwing de quiz-tak raakt, en
het verdient dezelfde expliciete test als in de vorige ronde.

### In `#bijbeltraining-scherm`

Van vier knoppen naar twee: "Oefenen & nalezen" blijft, en "Naslag & uitleg",
"Catechese" en "De verschillende kerken" gaan samen op in "Ontdekken" — de
kerken worden immers een rubriek.

## Openstaande keuzes vóór STAP B

1. **Vorm van de hub:** knoppenrij (slot-vorm A, kleinste stap) of tegelraster
   zoals de boekenplank (slot-vorm B, sluit aan bij "een nog niet vrijgespeeld
   Bijbelboek").
2. **Waar de inhoud komt te staan:** apart `ontdekken-inhoud.js` — met een
   aanpassing van de cache-busterregel in `CLAUDE.md` — of toch in `script.js`.
3. **De sandwich-tekst:** akkoord om de naslagversie (165 woorden) te laten
   vervallen ten gunste van één canoniek artikel plus een verwijzing?
4. **Malchus en Hebreeën:** twee nieuwe naslagonderwerpen schrijven op basis van
   hun reveal-tekst, of die vragen voorlopig zonder naslagplek laten?
5. **Bijbelplaatsen in het lexicon:** het veld komt er, maar de 44 bestaande
   woordenboektermen hebben er geen. Leeg laten, of gaandeweg aanvullen?
