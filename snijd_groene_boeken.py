from PIL import Image
import numpy as np
from scipy import ndimage
import os

# ---- INSTELLINGEN ----
SRC = r"images\overigebriefen.png"             # bronafbeelding (4 boeken op zwart)
OUT_DIR = r"images"                            # waar de losse PNG's heen gaan
PREFIX = "boek-"                               # bestandsnaam-voorvoegsel (repo-conventie)
NAMES = ["hebreeen", "jakobus", "petrus-judas", "johannesbrieven"]  # volgorde = links->rechts
THRESHOLD = 40        # alle kanalen onder deze waarde = achtergrond-kandidaat
MIN_BOOK_FRAC = 0.05  # segmenten smaller dan deze fractie van de breedte negeren
BOTTOM_MARGIN = 8     # px ruimte onder het boek op het canvas
SIDE_MARGIN = 8       # px ruimte links/rechts op het canvas
# ----------------------

os.makedirs(OUT_DIR, exist_ok=True)
img = Image.open(SRC).convert("RGBA")
arr = np.array(img)
H, W = arr.shape[:2]

# 1) achtergrond (zwart, verbonden met de rand) transparant maken
brightest = arr[:, :, :3].max(axis=2)
near_black = brightest <= THRESHOLD
lbl, _ = ndimage.label(near_black)
border = set(lbl[0, :]) | set(lbl[-1, :]) | set(lbl[:, 0]) | set(lbl[:, -1])
border.discard(0)
background = np.isin(lbl, list(border))
arr[:, :, 3] = np.where(background, 0, 255).astype(np.uint8)
clean = Image.fromarray(arr, "RGBA")

# 2) boeken vinden via kolommen die boek-pixels bevatten
alpha = arr[:, :, 3]
col_has = alpha.max(axis=0) > 0
segments, start = [], None
for x in range(W):
    if col_has[x] and start is None:
        start = x
    elif not col_has[x] and start is not None:
        segments.append((start, x)); start = None
if start is not None:
    segments.append((start, W))
segments = [(a, b) for (a, b) in segments if (b - a) >= MIN_BOOK_FRAC * W]

print(f"Bron: {SRC}  ({W}x{H})")
print(f"Gevonden boek-segmenten: {len(segments)} (verwacht {len(NAMES)})")
if len(segments) != len(NAMES):
    print("LET OP: aantal klopt niet -- controleer THRESHOLD / MIN_BOOK_FRAC.")

# 3) per boek bijsnijden op exacte inhoud
boxes = []
for (x0, x1) in segments:
    rows = np.where(alpha[:, x0:x1].max(axis=1) > 0)[0]
    boxes.append((x0, x1, rows.min(), rows.max() + 1))

# 4) uniform canvas: even groot, gecentreerd, onderaan uitgelijnd
max_w = max(b[1] - b[0] for b in boxes)
max_h = max(b[3] - b[2] for b in boxes)
canvas_w, canvas_h = max_w + 2 * SIDE_MARGIN, max_h + 2 * BOTTOM_MARGIN

for name, (x0, x1, y0, y1) in zip(NAMES, boxes):
    crop = clean.crop((x0, y0, x1, y1))
    cw, ch = crop.size
    canvas = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
    canvas.paste(crop, ((canvas_w - cw) // 2, canvas_h - BOTTOM_MARGIN - ch), crop)
    out = os.path.join(OUT_DIR, f"{PREFIX}{name}.png")
    canvas.save(out)
    print(f"  -> {out}  ({canvas_w}x{canvas_h})")

print("Klaar.")
