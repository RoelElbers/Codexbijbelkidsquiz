# Afbeeldingen-takenlijst — Schatkamer

> **De NT-vleugel is af.** De zaal, de vijf vitrines en de trofeeën van alle
> achttien quizboeken staan in `images/`. Er ligt hier niets meer open.
>
> Deze lijst blijft bewaard als **richtlijn voor een volgende vleugel** — een
> OT-vleugel werkt op dezelfde manier. De afspraken hieronder (huisstijl,
> bestandsformaat, hoe het spel een bestand oppakt, indeling per quizboek)
> gelden dan onverkort; alleen de namen en de aantallen veranderen.

## Vaste afspraken

**Huisstijl voor alles: diepblauw en goud, sfeer van een gotische
schatkamer/kathedraal**, passend bij `schatkamer.webp` (de zaal) en het
startscherm.

**Een bestand in `images/` wordt vanzelf opgepakt.** Zodra het daar onder de
verwachte naam staat, toont het spel het — er is **geen codewijziging nodig** en
de placeholder verdwijnt vanzelf. Zolang een bestand ontbreekt, toont het spel
een net donker placeholder-paneel (achtergronden) of een generiek
schaduwsilhouet (trofeeën). Niets hiervan blokkeert het spel.

**Het spel gebruikt `.webp`.** Achtergronden en trofeeën worden als `.webp`
aangeleverd en zo ook in `script.js` aangeroepen. Van een enkel bestand staat er
nog een oudere `.png` naast (`schatkamer.png`); die wordt niet gebruikt. Lever
nieuw werk dus altijd als `.webp` aan.

> Na het aanleveren van de zaal- en vitrine-achtergronden worden de
> %-posities van klikzones en nissen in `script.js` (config `schatkamerZalen`
> en de vitrine-configs) op de geschilderde kunst afgesteld.

## 1. Zaal-achtergrond (1 bestand)

1920 × 1080 (16:9): één gotische schatkamerzaal waarin de vitrinezones
herkenbaar zijn. Nissen donker/leeg schilderen; de trofeeën en de voortgang
komen er digitaal overheen.

| Bestand | Status |
|---|---|
| `schatkamer.webp` | ✅ aanwezig — de NT-zaal, uitgelijnd op de klikzones in `schatkamerZalen` |

De eerdere versie staat als `zaal-nt-oud.png` en wordt niet meer gebruikt.

## 2. Vitrine-achtergronden (5 bestanden)

Elk 1920 × 1080 (16:9), als detailscherm van één zone. De lege nissen/sokkels
in de achtergrond schilderen; de trofeeën komen er digitaal bovenop.

| Bestand | Status |
|---|---|
| `vitrine-evangelien.webp` | ✅ aanwezig |
| `vitrine-handelingen.webp` | ✅ aanwezig — één ereplek: sokkel of klein podium, centraal |
| `vitrine-paulusbrieven.webp` | ✅ aanwezig — brede galerijwand, nissen in twee rijen |
| `vitrine-algemenebrieven.webp` | ✅ aanwezig — kast/wand met nissen in één rij |
| `vitrine-openbaring.webp` | ✅ aanwezig — verhoogd altaar met lichtinval van boven |

## 3. Trofeeën — één per quizboek

Per **quizboek** één afbeelding: de zilveren render. Brons/goud en het
schaduwsilhouet maakt het spel zelf met CSS-filters (zoals bij de prijzenkast op
het startscherm).

- Afmetingen: **428 × 676 px** (zelfde als `matteus-zilver.webp` e.d.)
- Transparante achtergrond, zilveren beeldje op een sokkeltje
- Bestandsnaam: `<sleutel>-zilver.webp`, kleine letters, geen spaties

**Een quizboek is niet altijd één bijbelboek.** Kleine boeken zijn gebundeld tot
één quiz met één trofee; de sleutel volgt `boekNaarKey` in `script.js`. Dat
scheelt trofeeën: achttien in plaats van zevenentwintig. Houd die indeling aan
bij een volgende vleugel — bundel wat in het spel één quiz is.

| Bestand | Quizboek | Bundelt |
|---|---|---|
| `matteus-zilver.webp` | Matteüs | — |
| `marcus-zilver.webp` | Marcus | — |
| `lucas-zilver.webp` | Lucas | — |
| `johannes-zilver.webp` | Johannes | — |
| `handelingen-zilver.webp` | Handelingen | — |
| `romeinen-zilver.webp` | Romeinen | — |
| `korintiers-zilver.webp` | 1 & 2 Korintiërs | 1 en 2 Korintiërs |
| `galaten-zilver.webp` | Galaten | — |
| `efeziers-zilver.webp` | Efeziërs | — |
| `filippenzen-zilver.webp` | Filippenzen | — |
| `kolossenzen-filemon-zilver.webp` | Kolossenzen & Filemon | Kolossenzen en Filemon |
| `tessalonicenzen-zilver.webp` | 1 & 2 Tessalonicenzen | 1 en 2 Tessalonicenzen |
| `timoteus-titus-zilver.webp` | Timoteüs & Titus | 1 en 2 Timoteüs en Titus |
| `hebreeen-zilver.webp` | Hebreeën | — |
| `jakobus-zilver.webp` | Jakobus | — |
| `petrus-judas-zilver.webp` | Petrus & Judas | 1 en 2 Petrus en Judas |
| `johannesbrieven-zilver.webp` | Brieven van Johannes | 1, 2 en 3 Johannes |
| `openbaring-zilver.webp` | Openbaring | — |

Alle achttien staan in `images/`.

### Symboolsuggesties — bewaard als voorbeeld

Deze suggesties hoorden bij de oude indeling, met één trofee per bijbelboek. Ze
gelden dus niet één op één voor de quizboeken hierboven: waar boeken gebundeld
zijn, moet één symbool de hele bundel dekken. Ze blijven hier staan als
voorbeeld van het soort beeld dat werkt — één herkenbaar voorwerp uit het boek
zelf, geen samengestelde scène.

Handelingen: vuurtongen van Pinksteren boven een wereldbol. Romeinen:
weegschaal (rechtvaardiging door geloof). 1 Korintiërs: kelk en brood
(avondmaal, 1 Kor. 11). 2 Korintiërs: aarden kruik waar licht uit straalt
(2 Kor. 4:7). Galaten: gebroken keten (vrijheid). Efeziërs: helm en schild
(wapenrusting van God, Ef. 6). Filippenzen: stralende zon ("Verblijd u
altijd"). Kolossenzen: kroon boven een kruis (Christus boven alles).
1 Tessalonicenzen: bazuin met wolk (de wederkomst, 1 Tess. 4).
2 Tessalonicenzen: brandende lamp (volharden tot Hij komt). 1 Timoteüs:
herdersstaf met boekrol (de jonge leider). 2 Timoteüs: fakkel die wordt
doorgegeven. Titus: schip bij een eiland (Kreta). Filemon: twee ineengeslagen
handen (verzoening). Hebreeën: anker (hoop als anker van de ziel, Hebr. 6:19).
Jakobus: spiegel (hoorders én daders, Jak. 1:23). 1 Petrus: hoeksteen of
levende steen (1 Petr. 2). 2 Petrus: morgenster (2 Petr. 1:19). 1 Johannes:
hart met licht (God is liefde en licht). 2 Johannes: verzegelde brief.
3 Johannes: open deur (gastvrijheid). Judas: schild (strijden voor het
geloof). Openbaring: het Lam met de boekrol met zeven zegels.

## Totaal

- 1 zaal-achtergrond
- 5 vitrine-achtergronden
- 18 trofeeën

**24 bestanden, allemaal aanwezig.**
