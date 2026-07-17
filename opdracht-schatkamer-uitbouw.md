# Opdracht: Schatkamer uitbouwen tot inzoombare overzichtszaal (NT-vleugel)

## Context van het project

Dit is Bijbelkidsquiz (bijbelkidsquiz.nl), een gratis browsergebaseerde Nederlandse bijbelquiz voor kinderen van 10–12 jaar. Vanilla HTML/CSS/JS, geen frameworks, geen build-stap. Visuele stijl: diepblauw en goud, Cinzel voor koppen, sfeer van een gotische schatkamer/kathedraal. Het spel gebruikt een CSS transform-scale wrapper voor responsief schalen tussen venster en fullscreen.

Bestaande relevante onderdelen die je in de codebase zult aantreffen:

- **Evangeliën-vitrine**: een werkend, herbruikbaar vitrine-component met vier nissen (Matteüs, Marcus, Lucas, Johannes). Dit component leest trofeestatus uit localStorage.
- **Config-driven vitrine-builder**: vitrines worden opgebouwd vanuit een configuratie-object, zodat nieuwe vitrines toegevoegd kunnen worden zonder nieuwe logica te schrijven.
- **localStorage-trofeesleutels**: per boek een sleutel in de vorm `trofee_<boeknaam>` (bijv. `trofee_matteus`) met als waarde `geen`, `brons`, `zilver` of `goud`.
- **Visueel trofeesysteem**: niet-behaalde trofeeën worden getoond als donker schaduwsilhouet; brons/zilver/goud hebben oplopende glans-niveaus, waarbij goud de meest dramatische glossy behandeling krijgt.

Verken eerst zelf de codebase om te zien hoe deze onderdelen precies heten en werken voordat je gaat bouwen.

## Einddoel

De huidige losse Evangeliën-vitrine wordt onderdeel van een grotere, inzoombare **Schatkamer**. De speler komt binnen in een overzichtszaal (de NT-vleugel) waarin meerdere vitrinezones zichtbaar en klikbaar zijn. Klikken op een zone "zoomt in" naar het detailscherm van die vitrine. Een Terug-knop zoomt weer uit naar de overzichtszaal.

De NT-vleugel bevat vijf zones, volgend op de bestaande NT-boekgroepen van het spel:

| Zone | Boeken | Aantal trofeeën |
|---|---|---|
| Evangeliën | Matteüs, Marcus, Lucas, Johannes | 4 (bestaat al) |
| Handelingen | Handelingen | 1 |
| Paulusbrieven | Romeinen, 1 Korintiërs, 2 Korintiërs, Galaten, Efeziërs, Filippenzen, Kolossenzen, 1 Tessalonicenzen, 2 Tessalonicenzen, 1 Timoteüs, 2 Timoteüs, Titus, Filemon | 13 |
| Algemene brieven | Hebreeën, Jakobus, 1 Petrus, 2 Petrus, 1 Johannes, 2 Johannes, 3 Johannes, Judas | 8 |
| Openbaring | Openbaring | 1 |

Totaal NT: 27 trofeeën. Later komt er een spiegelbeeldige OT-vleugel bij; bouw daar nu niets voor, maar maak de architectuur zo dat een tweede vleugel toegevoegd kan worden als extra zaal met eigen zones, zonder herstructurering.

## Ontwerpprincipes

1. **Ongelijke groepen krijgen ongelijke vitrines.** Handelingen en Openbaring (elk 1 trofee) worden geen kale kast met één nis maar een bijzondere plek — denk aan een sokkel of verhoogd altaar. Openbaring verdient als afsluitend boek een ereplaats, bijvoorbeeld achterin/centraal met lichtinval. Paulusbrieven (13 stuks) wordt een brede wand of galerij, eventueel twee rijen. De architectuur van de zaal mag de structuur van het Nieuwe Testament weerspiegelen.

2. **De overzichtszaal is een voortgangskaart.** In het overzicht is per zone in één oogopslag zichtbaar hoe ver de speler is: donkere silhouetten voor nog-niet-behaalde trofeeën, zichtbare glans voor behaalde. Een kind moet meteen zien "de Evangeliën heb ik bijna, de Paulusmuur is nog donker." Een subtiele voortgangsindicatie per zone (bijv. 3/13) mag, mits het de sfeer niet verstoort.

3. **De zoom is een illusie, geen camera.** De overzichtszaal is één achtergrondafbeelding met klikbare zones (zelfde principe als het bestaande boekzone-kliksysteem op het startscherm). Een klik triggert een CSS-overgang (korte scale/fade-animatie zodat het als inzoomen voelt) naar het vitrine-detailscherm. Elk detailscherm is een instantie van de bestaande config-driven vitrine-builder met eigen config en eigen achtergrondafbeelding.

4. **Modulair: nieuwe vitrine = nieuwe config + nieuwe afbeelding.** Geen nieuwe logica per vitrine. Eén centrale schatkamer-config beschrijft de zones van de zaal (naam, klikgebied, gekoppelde vitrine-config, voortgangsbron).

## Wat NIET aangeraakt mag worden

- De bestaande Evangeliën-vitrine blijft visueel en functioneel exact zoals hij is; hij wordt alleen bereikbaar via de nieuwe overzichtszaal in plaats van (of naast) de huidige route.
- Bestaande localStorage-sleutels en hun waardeformaat (`trofee_<boek>` met `geen`/`brons`/`zilver`/`goud`) blijven ongewijzigd. Nieuwe boeken volgen exact dezelfde naamconventie (lowercase, zonder spaties; bepaal zelf een consistente vorm voor nummerboeken zoals 1 Petrus, bijv. `trofee_1petrus`, en documenteer die keuze in een commentaarblok).
- De quizlogica, het XP/levelsysteem en de bestaande navigatiestructuur van het spel blijven buiten scope.
- De CSS transform-scale wrapper en het responsieve schaalgedrag mogen niet breken; test de nieuwe schermen in zowel venster- als fullscreen-modus.

## Placeholder-strategie voor ontbrekende kunst

De definitieve afbeeldingen (zaal-achtergrond, vitrine-achtergronden, 23 nieuwe trofeeën) bestaan nog niet; die worden later los aangeleverd. Bouw daarom:

- Een nette placeholder-weergave per ontbrekende afbeelding (bijv. een gestileerd donker paneel in de huisstijl met de zonenaam erin), zodat het geheel nu al toonbaar en testbaar is.
- Eén duidelijke plek (config of map-conventie) waar de definitieve afbeeldingen straks ingehangen worden door alleen een bestand te plaatsen of een pad in te vullen — zonder codewijziging.
- Trofeeën zonder afbeelding tonen als generiek schaduwsilhouet.

Lever aan het eind een lijst op van exact welke afbeeldingsbestanden nog gemaakt moeten worden, met per bestand: bestandsnaam, aanbevolen afmetingen/beeldverhouding, en een korte omschrijving van wat erop moet staan (deze lijst gebruikt de maker om ze in ChatGPT te genereren).

## Acceptatiecriteria

- Vanuit het spel is de Schatkamer (NT-vleugel) bereikbaar; de overzichtszaal toont vijf klikbare zones.
- Klikken op een zone opent het bijbehorende vitrine-detailscherm met een soepele inzoom-overgang; Terug keert terug naar de zaal.
- De Evangeliën-vitrine werkt in de nieuwe structuur identiek aan voorheen, inclusief bestaande trofeestatussen uit localStorage.
- Alle 27 NT-boeken hebben een nis/plek en een localStorage-koppeling; niet-behaalde of nog kunst-loze trofeeën tonen als schaduwsilhouet.
- De voortgang per zone is in de overzichtszaal afleesbaar.
- Alles schaalt correct mee in venster- en fullscreen-modus.
- Werkt in Brave/Chromium.
- De afbeeldingen-takenlijst (zie placeholder-strategie) is opgeleverd als markdown-bestand in de repo.

## Werkwijze

- Verken eerst de codebase en maak een kort plan voordat je code schrijft; controleer je werk onderweg tegen de acceptatiecriteria.
- Commit per stabiele mijlpaal met beschrijvende Nederlandse commit-berichten, in lijn met de bestaande commit-stijl van de repo.
- Als je tijdens het verkennen tegenstrijdigheden vindt tussen deze opdracht en de werkelijke code (bijv. andere sleutelnamen), volg dan de werkelijke code en meld de afwijking.
