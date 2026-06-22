from PIL import Image
import numpy as np
from scipy import ndimage
import os

# ---- INSTELLINGEN ----
SRC = r"images\Brievenpaulus.png"              # rode bron (8 boeken, 2 rijen op zwart)
OUT_DIR = r"images"                            # zelfde map als de andere covers
# volgorde = leesvolgorde: bovenste rij links->rechts, dan onderste rij links->rechts.
# Namen sluiten exact aan op de id's in boekenplanken.paulus (script.js).
NAMES = ["boek-romeinen", "boek-korintiers", "boek-galaten", "boek-efeziers",
         "boek-filippenzen", "boek-kolossenzen-filemon",
         "boek-tessalonicenzen", "boek-timoteus-titus"]
THRESHOLD = 40
MIN_FRAC = 0.05        # segmenten kleiner dan deze fractie negeren
BOTTOM_MARGIN = 8
SIDE_MARGIN = 8
# ----------------------

os.makedirs(OUT_DIR, exist_ok=True)
img = Image.open(SRC).convert("RGBA")
arr = np.array(img)
H, W = arr.shape[:2]

# 1) zwarte achtergrond (verbonden met de rand) transparant maken
brightest = arr[:, :, :3].max(axis=2)
near_black = brightest <= THRESHOLD
lbl, _ = ndimage.label(near_black)
border = set(lbl[0, :]) | set(lbl[-1, :]) | set(lbl[:, 0]) | set(lbl[:, -1])
border.discard(0)
arr[:, :, 3] = np.where(np.isin(lbl, list(border)), 0, 255).astype(np.uint8)
clean = Image.fromarray(arr, "RGBA")
alpha = arr[:, :, 3]

def segments_from(mask, length, min_frac):
    segs, start = [], None
    for i in range(length):
        if mask[i] and start is None:
            start = i
        elif not mask[i] and start is not None:
            segs.append((start, i)); start = None
    if start is not None:
        segs.append((start, length))
    return [(a, b) for (a, b) in segs if (b - a) >= min_frac * length]

# 2) eerst rijen vinden (banden met inhoud, gescheiden door lege ruimte)
rows = segments_from(alpha.max(axis=1) > 0, H, MIN_FRAC)
print(f"Bron: {SRC}  ({W}x{H})")
print(f"Gevonden rijen: {len(rows)} (verwacht 2)")

# 3) binnen elke rij de boeken op kolommen snijden
boxes = []
for (y0, y1) in rows:
    band = alpha[y0:y1, :]
    cols = segments_from(band.max(axis=0) > 0, W, MIN_FRAC)
    print(f"  rij {y0}-{y1}: {len(cols)} boeken")
    for (x0, x1) in cols:
        ys = np.where(alpha[y0:y1, x0:x1].max(axis=1) > 0)[0]
        boxes.append((x0, x1, y0 + ys.min(), y0 + ys.max() + 1))

print(f"Totaal boeken: {len(boxes)} (verwacht {len(NAMES)})")
if len(boxes) != len(NAMES):
    print("LET OP: aantal klopt niet -- controleer THRESHOLD / MIN_FRAC.")

# 4) uniform canvas voor alle acht, onderaan uitgelijnd
max_w = max(b[1] - b[0] for b in boxes)
max_h = max(b[3] - b[2] for b in boxes)
cw, ch = max_w + 2 * SIDE_MARGIN, max_h + 2 * BOTTOM_MARGIN

for name, (x0, x1, y0, y1) in zip(NAMES, boxes):
    crop = clean.crop((x0, y0, x1, y1))
    w, h = crop.size
    canvas = Image.new("RGBA", (cw, ch), (0, 0, 0, 0))
    canvas.paste(crop, ((cw - w) // 2, ch - BOTTOM_MARGIN - h), crop)
    out = os.path.join(OUT_DIR, f"{name}.png")
    canvas.save(out)
    print(f"  -> {out}  ({cw}x{ch})")

print("Klaar.")
