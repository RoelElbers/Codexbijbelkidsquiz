# Haalt het geschilderde embleem (muzieknootje) rechtsboven weg uit de twee
# beeldlagen van het startscherm. Draaien vanuit de hoofdmap van de repo:
#   python tools/embleem_weg.py
# Altijd draaien op de oorspronkelijke platen (mét embleem), nooit twee keer
# achter elkaar: elke keer opslaan is een extra verliesvolle compressie.
import io, time
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

CX, CY = 1585, 55          # middelpunt embleem (pixels in 1672-breed beeld)
R_VOOR = 55                # straal die in de voorgrond doorzichtig wordt
BCX, BCY, R_ACHTER = 1583, 56, 53   # cirkel die in de achtergrond wordt ingevuld

def lucht(c): return c[2] > c[0] + 40          # RGB: blauw duidelijk boven rood

def bewaar(img, pad):
    # Via een buffer en met een paar pogingen: op Windows grijpt soms een
    # ander programma (virusscanner) kort naar het bestand.
    buf = io.BytesIO(); img.save(buf, format="WEBP", quality=85)
    for poging in range(5):
        try:
            with open(pad, "wb") as f: f.write(buf.getvalue())
            return
        except OSError:
            time.sleep(1)
    raise OSError("kon " + pad + " niet opslaan")

# --- Voorgrond: embleem doorzichtig maken -----------------------------------
p = "images/voorgrond_transparante_lucht.webp"
voor = Image.open(p).convert("RGBA")
assert voor.size == (1672, 941), voor.size
m = Image.new("L", voor.size, 0)
ImageDraw.Draw(m).ellipse((CX-R_VOOR, CY-R_VOOR, CX+R_VOOR, CY+R_VOOR), fill=255)
voor.paste((0, 0, 0, 0), (0, 0), m)
bewaar(voor, p)

# --- Achtergrond: lucht invullen, per rij tussen de lucht links en rechts ----
p = "images/startschermzonderwolken.webp"
achter = Image.open(p).convert("RGB")
assert achter.size == (1672, 940), achter.size
im = np.asarray(achter).astype(np.float32)
out = im.copy()
rng = np.random.default_rng(1)

for y in range(max(0, BCY-R_ACHTER), BCY+R_ACHTER+1):
    dx = int((R_ACHTER**2 - (y-BCY)**2) ** 0.5)
    xl, xr = BCX-dx-4, BCX+dx+4
    L = im[y, xl-4:xl+1].mean(0); Rr = im[y, xr:xr+5].mean(0)
    okL, okR = lucht(L), lucht(Rr)
    if not (okL or okR): continue
    for x in range(BCX-dx-1, BCX+dx+2):
        t = (x-xl) / (xr-xl)
        c = L*(1-t) + Rr*t if (okL and okR) else (Rr if okR else L)
        out[y, x] = c + rng.normal(0, 1.2, 3)
# Slagschaduw van het oude embleem: die viel onder de cirkel tot op het dak.
# Donkere luchtpixels daar krijgen de lucht van dezelfde rij, rechts ervan.
for y in range(BCY, BCY + R_ACHTER + 12):
    ref = im[y, 1645:1656].mean(0)
    for x in range(BCX - R_ACHTER - 8, BCX + R_ACHTER + 9):
        if (x - BCX) ** 2 + (y - BCY) ** 2 > (R_ACHTER + 9) ** 2: continue
        c = out[y, x]
        if c[0] < 30 and c[2] > c[0] + 60 and c[2] < ref[2] - 4:
            out[y, x] = ref + rng.normal(0, 1.2, 3)
res = Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))
# zachte overgang op de rand van de cirkel
mask = Image.new("L", res.size, 0)
ImageDraw.Draw(mask).ellipse((BCX-R_ACHTER-1, BCY-R_ACHTER-1, BCX+R_ACHTER+1, BCY+R_ACHTER+1), fill=255)
ms = np.asarray(mask.filter(ImageFilter.GaussianBlur(2))).astype(np.float32)[..., None] / 255
rand = ((ms > 0.05) & (ms < 0.95)).astype(np.float32)
zacht = np.asarray(res.filter(ImageFilter.GaussianBlur(1))).astype(np.float32)
res = Image.fromarray(np.clip(np.asarray(res)*(1-rand) + zacht*rand, 0, 255).astype(np.uint8))
bewaar(res, p)
print("Klaar: embleem weggehaald uit beide lagen.")
