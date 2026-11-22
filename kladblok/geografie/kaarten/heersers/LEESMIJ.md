# Kaart "Wie regeerde waar?" — scripts (22-23 nov 2026)

- heersers2.py: streekpolygonen (lon/lat, zelfde als kaart 1) en de projectie van kaart 1; maakt de onderlegger en de ruwe gebieden per tijd.
- aanpassen.py: snijdt de gebieden af op kust en water van de tekening (kaart-heersers.webp, een bewerking van kaart 1 door ChatGPT), laat Rome voorgaan bij overlap, gooit snippers weg en schrijft kaart-heersers.js (ONTDEK_KAART_HEERSERS).
- proef4.py: proefbeeld met streeknaam + heerser per streek en de kleurmenging.
- heersers-gebieden.json: tussenresultaat.

De scripts verwijzen naar paden in de werkomgeving van Claude (/home/claude/...) en naar de Natural Earth-gegevens uit kladblok/geografie/kaarten/scripts. Pas de paden aan als je ze opnieuw draait.
Streeklabels en legenda staan niet in deze scripts maar in ONTDEK_KAART_HEERSERS_LAGEN in ontdekken-inhoud.js.
