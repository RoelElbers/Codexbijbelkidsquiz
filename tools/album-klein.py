"""Maakt de kleine versies van de brede albumplaatjes.

Van elk bestand in images/album/plaatjes-breed/ (16:9, 1920 x 1080) maakt dit
script een kleine versie met dezelfde naam in
images/album/plaatjes-breed-klein/: 640 x 360, webp, kwaliteit 82. Het boek
laadt de kleine versie, het venster de grote (albumBeeld in script.js).

Gebruik (vanuit de projectmap):

    python tools/album-klein.py           alleen nieuwe of gewijzigde plaatjes
    python tools/album-klein.py --alles   alle kleine versies opnieuw

Een kleine versie wordt opnieuw gemaakt als hij ontbreekt of ouder is dan het
brede bestand. Is een breed bestand niet precies 16:9, dan wordt het
gecentreerd bijgesneden en meldt het script hoeveel. Kleine versies waarvan
het brede bestand weg is, worden alleen gemeld, niet verwijderd.
"""

import os
import sys

from PIL import Image

MAP = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "images", "album")
BREED = os.path.join(MAP, "plaatjes-breed")
KLEIN = os.path.join(MAP, "plaatjes-breed-klein")
MAAT = (640, 360)
KWALITEIT = 82


def bijsnijbox(breedte, hoogte):
    """De grootste gecentreerde 16:9-uitsnede (in hele of halve pixels)."""
    doel = 16 / 9
    if abs(breedte / hoogte - doel) < 1e-9:
        return (0, 0, breedte, hoogte)
    if breedte / hoogte > doel:
        nieuw = hoogte * doel
        return ((breedte - nieuw) / 2, 0, (breedte + nieuw) / 2, hoogte)
    nieuw = breedte / doel
    return (0, (hoogte - nieuw) / 2, breedte, (hoogte + nieuw) / 2)


def main():
    alles = "--alles" in sys.argv[1:]
    os.makedirs(KLEIN, exist_ok=True)
    bronnen = sorted(f for f in os.listdir(BREED) if f.lower().endswith(".webp"))
    gemaakt = 0
    for naam in bronnen:
        bron = os.path.join(BREED, naam)
        doel = os.path.join(KLEIN, naam)
        if not alles and os.path.isfile(doel) and os.path.getmtime(doel) >= os.path.getmtime(bron):
            continue
        with Image.open(bron) as beeld:
            beeld.load()
            box = bijsnijbox(*beeld.size)
            if box != (0, 0) + beeld.size:
                print("  %s: %d x %d is niet 16:9, bijgesneden met %.1f px in de breedte en %.1f px in de hoogte"
                      % (naam, beeld.size[0], beeld.size[1],
                         beeld.size[0] - (box[2] - box[0]), beeld.size[1] - (box[3] - box[1])))
            klein = beeld.convert("RGB").resize(MAAT, Image.LANCZOS, box=box)
        klein.save(doel, "WEBP", quality=KWALITEIT, method=6)
        print("  %s -> plaatjes-breed-klein/%s (%d KB)" % (naam, naam, os.path.getsize(doel) // 1024))
        gemaakt += 1
    for naam in sorted(os.listdir(KLEIN)):
        if naam.lower().endswith(".webp") and naam not in bronnen:
            print("  let op: plaatjes-breed-klein/%s heeft geen breed bestand meer" % naam)
    print("%d kleine versie(s) gemaakt, %d breed bestand(en) in totaal." % (gemaakt, len(bronnen)))


if __name__ == "__main__":
    main()
