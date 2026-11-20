# Kaarten "Waar gebeurde het" — onderleggers

Gemaakt op 19–20 november 2026 (chat met Claude). Basis: echte kaartgegevens
van Natural Earth (publiek domein): kustlijn, meren, rivieren.

## onderleggers/
- `kaart1-onderlegger-zonder-namen.png` — kaart 1 (overzicht van het land in
  de tijd van Jezus), met streken in kleur en de gouden omtrek van het land.
  Dit is wat ChatGPT als basis krijgt.
- `kaart1-orientatie-met-namen.png` — dezelfde kaart met namen, alleen ter
  oriëntatie.
- `overzicht-posities.csv` — positie van elke plaats op kaart 1 in procenten
  van breedte en hoogte (x_procent, y_procent), voor de klikpunten en namen in
  de game.
- `galilea-*` en `judea-*` — de onderleggers en posities voor kaart 2
  (Galilea en het noorden) en kaart 3 (Judea en Samaria), nog zonder kleuren.
- `kaart1-chatgpt-ronde1-controle.jpg` — eerste kaart van ChatGPT met de
  lijnen van de onderlegger erover: de ligging klopt.

## scripts/
- `maak_onderlegger.py NAAM ZUID NOORD MIDDENLENGTE` — tekent een onderlegger
  en de positietabel. Kaart 1: `overzicht 30.95 33.50 35.35`; kaart 2:
  `galilea 32.45 33.45 35.50`; kaart 3: `judea 31.35 32.35 35.25`.
- `streken.py` — kaart 1 met de streken in kleur (grenzen bij benadering) en
  de gouden omtrek.

De scripts verwachten een map `data/` met vier bestanden uit
github.com/nvkelso/natural-earth-vector (map geojson/): ne_10m_land,
ne_10m_lakes, ne_10m_rivers_lake_centerlines en ne_10m_coastline (.geojson,
samen ruim 30 MB, daarom niet in de repo). De uitvoer komt in `uit/`.
