# Inventaris "Verborgen Schat"

Peildatum: 1 september 2026. Alleen vastgesteld, niets gewijzigd.
Vijfde deel, naast `kladblok/menu-inventaris.md` (Naslag & uitleg),
`kladblok/menu-inventaris-catechese.md`,
`kladblok/menu-inventaris-vragen-uitleg.md` en
`kladblok/menu-inventaris-oefenen.md`.

## Vooraf: dit is geen menu maar een keten

De vier eerder geïnventariseerde onderdelen zitten allemaal onder één knop in
`#bijbeltraining-scherm`. De Verborgen Schat niet: die heeft **geen eigen menu
en geen eigen menuknop**. Hij bestaat uit vier stukken die op vier verschillende
plaatsen in het spel zitten en door één localStorage-vlag aan elkaar hangen:

1. **De diamanten kist op het startscherm** — `index.html` r. 119,
   `onclick="openVerborgenSchat()"`. Dit is de enige ingang naar de ronde.
2. **De ronde zelf** — leent `#quiz-scherm` van de gewone quiz, met
   `gekozenModus = "verborgen"`.
3. **De onthullingskaart** — `#vs-reveal-scherm` (`index.html` r. 391–402), na
   elke beantwoorde vraag. Alleen in deze modus.
4. **De naslagpagina** — `#verborgenschat-naslag-scherm` (`index.html`
   r. 607–650), bereikbaar via Bijbeltraining → Naslag & uitleg, en pas nadat
   de ronde één keer met 10/10 is uitgespeeld.

Daarnaast lopen er vanuit de onthullingskaart drie deep-links naar het
catechese-menu. Van de vijf onderdelen is er dus precies één dat in een menu
staat: de naslagpagina, die in `kladblok/menu-inventaris.md` al als derde item
van Naslag & uitleg is opgenomen.

De data staat in `script.js`: **`verborgenSchatVragen`, r. 8046–8166**, 16 vragen.
Die array staat los van `vragenData` — daarom komen deze vragen niet voor in
Vragen & uitleg en niet in Oefenen.

## De ontgrendelketen

Drie drempels, elk met een eigen effect. Ze staan los van elkaar: spelen mag
eerder dan verschijnen.

| Drempel | Voorwaarde | Effect | Waar |
|---|---|---|---|
| Pool open | brons, zilver én goud alle drie verdiend | de diamanten kist wordt klikbaar (`.speelbaar`) | `magVerborgenSchatSpelen()`, r. 7035–7039 |
| Ronde gewonnen | 10 van de 10 goed | vlag `verborgenschat_voltooid` op "waar" | `eindScherm()`, r. 10714–10715 |
| Ontdekt | die vlag staat | het donkere silhouet valt weg (startscherm én schatkamer), en de naslagknop ontgrendelt | `isVerborgenSchatOntgrendeld()`, r. 8787–8789 |

De vlag is **per profiel**: `speler_<id>_verborgenschat_voltooid`
(`profielSleutel()`, r. 7350–7352). Een oude, niet-geprefixte vlag wordt
eenmalig meeverhuisd door `migreerNaarProfielen()` (r. 7406). Zolang de kist
vergrendeld is doet een klik bewust niets — `openVerborgenSchat()` controleert
de voorwaarde in de code en niet op de class in de DOM, "als dat element
ontbreekt, zou zo'n controle stilzwijgend doorlaten" (r. 8183–8186). Alleen
`afstelModus` omzeilt de poort.

De naslagknop werkt hetzelfde: `openVerborgenSchatNaslag()` weigert zolang de
vlag niet staat (r. 8805–8806), en de hint eronder leest "Speel eerst de
Verborgen Schat om te ontgrendelen" (`index.html` r. 540).

## Hoe een ronde verloopt

| | Gewone ronde | Verborgen Schat |
|---|---|---|
| Bron | `vragenData[boek][niveau]` | `verborgenSchatVragen` (16 vragen) |
| Aantal vragen | 10 uit de pool | 10 uit de pool van 16 — dus **6 vragen blijven elke ronde ongevraagd** |
| Titel | "*\<boek\>* – *\<niveau\>*" | "Verborgen Schat" (r. 8206) |
| Boek/niveau | gekozen | beide `null` (r. 8190–8191) |
| Doorgaan na een antwoord | automatisch na 2 seconden | geen timer; de onthullingskaart, kind klikt zelf "Volgende →" (r. 8328–8332) |
| Winst | trofee, schildpunt, kist | alleen de vlag; geen trofee, geen schildpunt, geen kist (r. 10709–10732) |

Winnen vereist 10 van de 10. Omdat er elke ronde 10 uit 16 worden getrokken,
krijgt de speler nooit alle stof in één ronde te zien.

## Tabel 1 — De schermen

| Titel zoals getoond | Bestandsnaam | Regels HTML | Woorden lopende tekst | Kopjes | Gelinkt vanaf |
|---|---|---|---|---|---|
| *(de diamanten kist — geen tekst)* | `index.html` r. 119 | 1 | 0 (alleen `alt="Verborgen diamanten schatkist"`) | geen | het startscherm zelf |
| Verborgen Schat *(de ronde)* | `index.html` → `#quiz-scherm` (r. 351–374) — **gedeeld met de gewone quiz** | 24 | vraag + 4 antwoorden + bijbelplaats, zie tabel 2 | h2: Verborgen Schat (`quiz-title`, gezet op r. 8206) | de diamanten kist |
| Verborgen boodschap *(onthullingskaart)* | `index.html` → `#vs-reveal-scherm` (r. 391–402) | 12 | 6 statisch ("Verborgen boodschap", "Meer ontdekken → Catechese", "Volgende →"); de rest komt uit `q.reveal` | h3: Verborgen boodschap | na elk antwoord in deze modus (`toonVsReveal()`, r. 8504–8542) |
| Verborgen Schat *(naslag)* | `index.html` → `#verborgenschat-naslag-scherm` (r. 607–650) | 44 | 1068 | h2: Verborgen Schat + 12 × h3, zie tabel 3 | `#naslag-scherm`, knop "Verborgen Schat" — alleen na 10/10 |
| Verborgen Schat *(slot van de ronde)* | `script.js` r. 10725–10728 (ingeschreven in `.quiz-box`) | 4 | 25 of 30, afhankelijk van winst of verlies | h2: Verborgen Schat | einde van de ronde |

## Tabel 2 — De 16 vragen

"Titel zoals getoond" is de vraag zelf; die verschijnt in `#quiz-scherm`.
Kolom **R** = heeft een `reveal`-tekst op de onthullingskaart, **C** = heeft een
deep-link naar een catechese-artikel, **N** = heeft een eigen kop op de
naslagpagina.

| # | Titel zoals getoond (ingekort) | Bestandsnaam | Regels | Woorden vraag + antwoorden | R | C | N | Gelinkt vanaf |
|---|---|---|---|---|---|---|---|---|
| 1 | Bovenzaal van het laatste avondmaal — huis van welke evangelist? | `script.js` r. 8047–8052 | 6 | 19 + antw. | | | ✔ | de pool, willekeurig getrokken |
| 2 | Wat betekent het woord "apocalyps" eigenlijk? | r. 8053–8058 | 6 | 6 + antw. | | | ✔ | idem |
| 3 | "De Alfa en de Omega" — wat bedoelt Jezus daarmee? | r. 8059–8064 | 6 | 12 + antw. | | | ✔ | idem |
| 4 | "Het Lam" — waarom juist een lam? | r. 8065–8070 | 6 | 11 + antw. | | | ✔ | idem |
| 5 | Waar staat het getal zeven symbolisch voor? | r. 8071–8076 | 6 | 17 + antw. | | | ✔ | idem |
| 6 | Hoe eindigt de Bijbel, in het boek Openbaring? | r. 8077–8082 | 6 | 8 + antw. | | | ✔ | idem |
| 7 | "Een tijd, tijden en een halve tijd" — welke tijdsduur? | r. 8083–8088 | 6 | 24 + antw. | | | ✔ | idem |
| 8 | De vier levende wezens — uit het visioen van welke profeet? | r. 8089–8094 | 6 | 29 + antw. | | | ✔ | idem |
| 9 | De boom in het paradijs die aan het eind terugkeert | r. 8095–8100 | 6 | 28 + antw. | | | ✔ | idem |
| 10 | Aan hoeveel gemeenten richt Johannes zich? | r. 8101–8106 | 6 | 15 + antw. | | | ✔ | idem |
| 11 | De stad die uit de hemel neerdaalt — hoe heet die? | r. 8107–8112 | 6 | 25 + antw. | | | ✔ | idem |
| 12 | De bijnaam van Marcus' verteltechniek | r. 8113–8120 | 8 | 53 + antw. | ✔ (49 w) | ✔ `verborgen-patronen-sandwich` | ✔ | idem |
| 13 | De 153 vissen — welke verborgen boodschap? | r. 8121–8133 | 13 | 38 + antw. | ✔ (34 w) | ✔ `verborgen-getallen-153` | — | idem |
| 14 | Waarop is de volgorde van Paulus' brieven gebaseerd? | r. 8134–8146 | 13 | 22 + antw. | ✔ (69 w) | ✔ `verborgen-patronen-paulus-brieven` | — | idem |
| 15 | Het oor van Malchus — wat gebeurde er daarna? | r. 8147–8158 | 12 | 22 + antw. | ✔ (146 w) | — | — | idem |
| 16 | Welke brief is aan zijn naam als Joods te herkennen? | r. 8159–8165 | 7 | 22 + antw. | ✔ (81 w) | — | — | idem |
| | **TOTAAL** | r. 8046–8166 (121) | | **351 vraag + 280 antwoorden + 57 bijbelplaats** | **5** | **3** | **12** | |

Alle 16 vragen hebben een bijbelplaats; geen enkele heeft een `uitleg`-veld —
dat veld bestaat alleen in `vragenData`. De vier langste reveal-teksten
(146, 81, 69 en 49 woorden) horen bij de vragen 15, 16, 14 en 12.

## Tabel 3 — De 12 kopjes van de naslagpagina

Alle twaalf staan in `index.html` r. 612–645, in dezelfde volgorde als de vragen
1 t/m 12.

| Kopje (h3) | Woorden | Hoort bij vraag |
|---|---|---|
| Van wie was het huis met de bovenzaal van het Laatste Avondmaal? | 126 | 1 |
| Wat betekent "apocalyps" eigenlijk? | 84 | 2 |
| Waarom noemt Jezus zichzelf "de Alfa en de Omega"? | 72 | 3 |
| Wie wordt in Openbaring "het Lam" genoemd, en waarom juist een lam? | 71 | 4 |
| Waar staat het getal zeven symbolisch voor? | 68 | 5 |
| Hoe eindigt de Bijbel in Openbaring? | 80 | 6 |
| Wat betekent "een tijd, tijden en een halve tijd"? | 61 | 7 |
| Waar komen de vier levende wezens vandaan? | 67 | 8 |
| De boom des levens — begin en einde | 80 | 9 |
| De zeven gemeenten | 48 | 10 |
| Het nieuwe Jeruzalem | 61 | 11 |
| De sandwich-techniek van Marcus | 165 | 12 |
| **TOTAAL** | **983** *(plus 85 woorden koptekst = 1068)* | |

## 1. Weespagina's — bestaat wel, maar is niet (of nauwelijks) terug te vinden

**Vier van de zestien vragen hebben geen kop op de naslagpagina.** De pagina
dekt de vragen 1 t/m 12; de vragen 13, 14, 15 en 16 ontbreken er volledig. Er
staat geen woord over de 153 vissen, over de volgorde van Paulus' brieven, over
Malchus of over de brief aan de Hebreeën.

Voor twee daarvan is er een uitwijk, voor twee niet:

- Vraag 13 (153 vissen) en vraag 14 (Paulus' brieven) hebben wél een
  catechese-artikel, bereikbaar via de knop "Meer ontdekken → Catechese" op de
  onthullingskaart én rechtstreeks via het catechese-menu.
- **Vraag 15 (Malchus, 146 woorden reveal) en vraag 16 (Hebreeën, 81 woorden)
  hebben alleen die reveal-tekst.** Die verschijnt uitsluitend tijdens een
  lopende ronde, op de kaart die na "Volgende →" verdwijnt. Samen 227 woorden
  die nergens in het spel terug te lezen zijn — niet in de naslagpagina, niet in
  Catechese, niet in Vragen & uitleg. De reveal van vraag 15 is bovendien de
  langste van alle vijf.

Verder:

- **De hele pool ligt buiten `vragenData`.** Daardoor komen deze 16 vragen niet
  voor in Vragen & uitleg en niet in Oefenen; dat is in die twee inventarissen al
  aan de andere kant vastgesteld.
- **Elf van de zestien vragen hebben geen reveal-tekst.** Voor hen toont
  `toonVsReveal()` alleen goed/fout: kop en tekst worden verborgen
  (r. 8520–8526) en de Catechese-knop ook (r. 8530). De kaart is dan een lege
  huls met alleen "Volgende →".
- **`vsRevealMeer()`-terugvaltekst** — r. 8568, "Binnenkort kun je hier meer
  ontdekken in de Catechese." Onbereikbaar: de knop verschijnt alleen als er een
  `catecheseId` is, en dan werkt de deep-link. (Al genoemd in de
  catechese-inventaris.)
- **Elke ronde blijven 6 van de 16 vragen ongevraagd**, want er worden er 10
  getrokken. Wie één keer wint, heeft ruwweg twee derde van de pool gezien.

## 2. Onderlinge verwijzingen

Dit is het enige onderdeel van het spel met echte kruisverbindingen tussen
menu's. In kaart:

- **Startscherm → ronde.** De diamanten kist (`index.html` r. 119) →
  `openVerborgenSchat()` (r. 8182). Eén ingang, geen andere.
- **Ronde → onthullingskaart.** Na elk antwoord, `checkAntwoord()` r. 8328–8332.
  De kaart blijft staan tot het kind zelf klikt.
- **Onthullingskaart → catechese-artikel.** Knop "Meer ontdekken → Catechese"
  (`index.html` r. 398) → `vsRevealMeer()` (r. 8554) → `openCatecheseArtikel(id,
  "vs-reveal")`. Drie vragen, drie artikelen. De herkomst wordt onthouden, zodat
  `terugCatecheseArtikel()` terugkeert naar de kaart en niet naar de
  artikellijst — de lopende ronde breekt dus niet. **Dit is de enige deep-link
  tussen twee menu's in het hele spel**, en hij loopt maar één kant op: vanuit
  het artikel is er geen weg terug naar de vraag.
- **Ronde → naslagpagina.** Niet rechtstreeks; via de vlag. 10/10 zet
  `verborgenschat_voltooid`, en dáárna staat de knop open in Naslag & uitleg.
- **Naslag & uitleg → naslagpagina → terug.** `openVerborgenSchatNaslag()` /
  `sluitVerborgenSchatNaslag()` (r. 8805–8812), keurig één stap heen en terug.
- **Ronde → startscherm.** De Terug-knop op het slotscherm roept
  `terugNaarStartscherm()` aan; tijdens de ronde is `#ronde-stop-knop` zichtbaar
  (met bevestiging), want `oefenModus` staat hier op `false`.
- **Schatkamer.** In de zaal staat dezelfde diamanten kist als decor, maar daar
  is hij **niet klikbaar**: hij toont alleen of de Verborgen Schat al ontdekt is
  (`bouwZaal()`, r. 9644–9652).

Dezelfde stof op meer dan één plaats:

- **De sandwich-techniek staat op drie plaatsen**: als vraag 12, als
  naslagkop van 165 woorden, en als catechese-artikel van 175 woorden. Zoals in
  de catechese-inventaris al vastgesteld: de naslagversie en het artikel zijn zin
  voor zin identiek (alle 8 zinnen), het artikel heeft er één slotvraag bij. De
  reveal-tekst van 49 woorden is wél zelfstandig geschreven.
- De vijf reveal-teksten delen geen enkele letterlijke zin met het artikel of de
  naslagkop waar ze bij horen — het zijn eigen samenvattingen.
- Vraag 5 en de naslagkop "Waar staat het getal zeven symbolisch voor?" raken
  aan de zeven gemeenten uit vraag 10 en de bijbehorende naslagkop; het getal
  zeven wordt in beide blokken uitgelegd.

## 3. Onderdelen met meer dan één duidelijk onderwerp

**De naslagpagina `#verborgenschat-naslag-scherm`** — twaalf kopjes onder één
titel, die inhoudelijk uit drie verschillende hoeken komen:

- *Het Laatste Avondmaal* (1 kop): Van wie was het huis met de bovenzaal van het
  Laatste Avondmaal?
- *Het boek Openbaring* (10 koppen): Wat betekent "apocalyps" eigenlijk? /
  Waarom noemt Jezus zichzelf "de Alfa en de Omega"? / Wie wordt in Openbaring
  "het Lam" genoemd, en waarom juist een lam? / Waar staat het getal zeven
  symbolisch voor? / Hoe eindigt de Bijbel in Openbaring? / Wat betekent "een
  tijd, tijden en een halve tijd"? / Waar komen de vier levende wezens vandaan? /
  De boom des levens — begin en einde / De zeven gemeenten / Het nieuwe Jeruzalem
- *De verteltechniek van Marcus* (1 kop): De sandwich-techniek van Marcus — met
  165 woorden meteen het langste blok, en het enige dat niets met Openbaring of
  het Laatste Avondmaal te maken heeft.

**De vragenpool zelf** — dezelfde driedeling, maar met vier vragen die buiten
alle drie de groepen vallen: de 153 vissen (Johannes 21), de volgorde van
Paulus' brieven, het oor van Malchus en de brief aan de Hebreeën. Tien van de
zestien vragen gaan over Openbaring; de overige zes over zes losse onderwerpen.

**De reveal van vraag 15 (Malchus, 146 woorden)** — de enige reveal die in één
blok meerdere onderwerpen behandelt: dat dit Jezus' laatste genezing vóór het
kruis is; wie van de vier evangelisten welk detail vertelt en waarom Johannes als
laatste wél namen noemt; dat Lucas — volgens de overlevering arts — als enige de
genezing vermeldt; en dat Johannes even verderop ook een familielid van Malchus
kent.
