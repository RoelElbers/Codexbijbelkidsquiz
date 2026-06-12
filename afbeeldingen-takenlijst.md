# Afbeeldingen-takenlijst — Schatkamer NT-vleugel

Deze lijst hoort bij de uitbouw van de Schatkamer tot inzoombare overzichtszaal.
Alle bestanden komen in de map `images/`. Zodra een bestand daar staat, pakt het
spel het automatisch op — er is **geen codewijziging nodig** (de placeholder
verdwijnt vanzelf). Zolang een bestand ontbreekt, toont het spel een net donker
placeholder-paneel (achtergronden) of een generiek schaduwsilhouet (trofeeën).

Huisstijl voor alles: diepblauw en goud, sfeer van een gotische
schatkamer/kathedraal, passend bij `scahtkamer2.png` (de bestaande
Evangeliën-vitrine) en het startscherm.

> Na het aanleveren van de zaal- en vitrine-achtergronden worden de
> %-posities van klikzones en nissen in `script.js` (config `schatkamerZalen`
> en de vitrine-configs) op de geschilderde kunst afgesteld. De waarden
> hieronder zijn de huidige plaatsing van de placeholders — schilder de zones
> daar in de buurt, dan is het afstellen minimaal.

## 1. Zaal-achtergrond (1 bestand)

| Bestand | Afmetingen | Omschrijving |
|---|---|---|
| `zaal-nt.png` | 1920 × 1080 (16:9) | De overzichtszaal van de NT-vleugel: één gotische schatkamerzaal waarin vijf vitrinezones herkenbaar zijn. Indeling (in % van het beeld, links-boven-breedte-hoogte): **Evangeliën** — vitrinekast met 4 nissen op de linkerwand (4, 26, 24, 40). **Algemene brieven** — kast met 8 nissen op de rechterwand (72, 26, 24, 40). **Paulusbrieven** — brede galerijwand met 13 nissen in twee rijen, midden (31, 42, 38, 26). **Openbaring** — verhoogd altaar/ereplaats centraal achterin met lichtinval van boven (40, 11, 20, 27). **Handelingen** — sokkel vooraan in het midden (42, 72, 16, 24). Nissen donker/leeg schilderen; de trofeeën en voortgang komen er digitaal overheen. |

## 2. Vitrine-achtergronden (4 bestanden)

Elk 1920 × 1080 (16:9), als detailscherm van één zone. De lege nissen/sokkels
in de achtergrond schilderen op de posities hieronder (x = horizontaal midden
in %, gemeten van links); de trofeeën komen er digitaal bovenop.

| Bestand | Omschrijving |
|---|---|
| `vitrine-handelingen.png` | Eén bijzondere ereplek: een sokkel of klein verhoogd podium, centraal (x 50%, trofeebodem op ±24% van onder). Sfeer: het begin van de jonge kerk — eventueel vuurtongen/Pinkstermotief subtiel in de achtergrond. |
| `vitrine-paulusbrieven.png` | Brede galerijwand met 13 nissen in twee rijen. Bovenste rij 7 nissen op x = 11, 24, 37, 50, 63, 76, 89% (bodem ±56% van onder); onderste rij 6 nissen op x = 17.5, 30.5, 43.5, 56.5, 69.5, 82.5% (bodem ±14% van onder). Onder elke nis ruimte voor een naamplaatje. |
| `vitrine-algemenebrieven.png` | Kast/wand met 8 nissen in één rij op x = 11, 22.1, 33.3, 44.4, 55.6, 66.7, 77.9, 89% (bodem ±28% van onder). |
| `vitrine-openbaring.png` | De ereplaats van de vleugel: een verhoogd altaar met dramatische lichtinval van boven, centraal (x 50%, bodem ±24%). Openbaring is het afsluitende boek — dit mag de meest plechtige plek van de zaal zijn. |

## 3. Trofeeën (23 bestanden)

Per boek **één** afbeelding: de zilveren render, net als de bestaande
trofeeën. Brons/goud en het schaduwsilhouet maakt het spel zelf met
CSS-filters (zoals nu al bij de prijzenkast op het startscherm).

- Afmetingen: **428 × 676 px** (zelfde als `matteus-zilver.png` e.d.)
- Transparante achtergrond, zilveren beeldje op een sokkeltje
- Bestandsnaam: exact zoals hieronder (kleine letters, geen spaties)

| Bestand | Boek | Suggestie symbool |
|---|---|---|
| `handelingen-zilver.png` | Handelingen | Vuurtongen van Pinksteren boven een wereldbol |
| `romeinen-zilver.png` | Romeinen | Weegschaal (rechtvaardiging door geloof) |
| `1korintiers-zilver.png` | 1 Korintiërs | Kelk en brood (avondmaal, 1 Kor. 11) |
| `2korintiers-zilver.png` | 2 Korintiërs | Aarden kruik waar licht uit straalt (2 Kor. 4:7) |
| `galaten-zilver.png` | Galaten | Gebroken keten (vrijheid) |
| `efeziers-zilver.png` | Efeziërs | Helm en schild (wapenrusting van God, Ef. 6) |
| `filippenzen-zilver.png` | Filippenzen | Stralende zon ("Verblijd u altijd") |
| `kolossenzen-zilver.png` | Kolossenzen | Kroon boven een kruis (Christus boven alles) |
| `1tessalonicenzen-zilver.png` | 1 Tessalonicenzen | Bazuin met wolk (de wederkomst, 1 Tess. 4) |
| `2tessalonicenzen-zilver.png` | 2 Tessalonicenzen | Brandende lamp (volharden tot Hij komt) |
| `1timoteus-zilver.png` | 1 Timoteüs | Herdersstaf met boekrol (de jonge leider) |
| `2timoteus-zilver.png` | 2 Timoteüs | Fakkel die wordt doorgegeven |
| `titus-zilver.png` | Titus | Schip bij een eiland (Kreta) |
| `filemon-zilver.png` | Filemon | Twee ineengeslagen handen (verzoening) |
| `hebreeen-zilver.png` | Hebreeën | Anker (hoop als anker van de ziel, Hebr. 6:19) |
| `jakobus-zilver.png` | Jakobus | Spiegel (hoorders én daders, Jak. 1:23) |
| `1petrus-zilver.png` | 1 Petrus | Hoeksteen / levende steen (1 Petr. 2) |
| `2petrus-zilver.png` | 2 Petrus | Morgenster (2 Petr. 1:19) |
| `1johannes-zilver.png` | 1 Johannes | Hart met licht (God is liefde en licht) |
| `2johannes-zilver.png` | 2 Johannes | Verzegelde brief |
| `3johannes-zilver.png` | 3 Johannes | Open deur (gastvrijheid) |
| `judas-zilver.png` | Judas | Schild (strijden voor het geloof) |
| `openbaring-zilver.png` | Openbaring | Het Lam met de boekrol met zeven zegels |

## Totaal

- 1 zaal-achtergrond
- 4 vitrine-achtergronden
- 23 trofeeën

**28 bestanden.** Niets hiervan blokkeert het spel: alles werkt nu al met
placeholders en silhouetten.
