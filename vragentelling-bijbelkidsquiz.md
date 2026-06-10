# Bijbelkidsquiz — vragentelling

*Momentopname van 11 juni 2026. Geteld direct uit `script.js` (de `vragenData`-pools
+ de aparte `verborgenSchatVragen`-array). Werk dit bij — of vraag Claude Code om
opnieuw te tellen — zodra er vragen bij komen of weggaan.*

---

## Per boek en per niveau (de vier evangeliën)

| Boek      | Beginner | Gevorderd | Expert | Totaal |
|-----------|:--------:|:---------:|:------:|:------:|
| Matteüs   |    21    |    18     |   18   | **57** |
| Marcus    |    16    |    15     |   16   | **47** |
| Lucas     |    12    |    14     |   20   | **46** |
| Johannes  |    17    |    15     |   19   | **51** |
| **Samen** |  **66**  |  **62**   | **73** | **201**|

## Speciale pool

| Pool            | Aantal |
|-----------------|:------:|
| Verborgen Schat |   13   |

## Totaal

- **Speelbaar in totaal: 214 vragen** (201 evangelie + 13 Verborgen Schat).

---

## Nog niet in een speelbare pool (ter herinnering)

- **Crazy / Insane (6 vragen)** — staan alleen in `spelstructuur-bijbelkidsquiz.md`,
  nog niet in `script.js`. De bijbehorende kist (Startscherm 2 — brieven van Paulus)
  is nog niet gebouwd.
- In `script.js` staat één `vraag:` die géén echte vraag is, maar een
  **placeholder-sjabloon** (`Placeholdervraag …`) uit een hulpfunctie. Die telt niet
  mee in de 214.
