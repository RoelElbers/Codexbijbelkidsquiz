import sys, math
from PIL import Image, ImageDraw, ImageFilter, ImageFont
sys.argv=['x','overzicht','30.95','33.50','35.35']
import os
exec(open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'maak_onderlegger.py')).read().split("im=basis()")[0])   # hergebruik projectie en basis()
# Streken ten tijde van Jezus' optreden (ca. 30 n.Chr.), grenzen bij benadering
S = {
 'Fenicië':   ((235,155,205), [(34.95,32.78),(35.10,32.80),(35.16,33.00),(35.30,33.10),(35.42,33.50),(35.05,33.55),(34.90,33.0)]),
 'Galilea':   ((150,205,120), [(34.98,32.62),(35.12,32.60),(35.10,32.80),(35.16,33.00),(35.30,33.10),(35.45,33.15),(35.60,33.08),(35.58,32.90),(35.53,32.78),(35.57,32.68),(35.55,32.52),(35.30,32.55)]),
 'Samaria':   ((245,175,110), [(34.86,32.60),(34.98,32.62),(35.12,32.60),(35.30,32.55),(35.47,32.52),(35.55,32.40),(35.53,32.05),(35.15,32.02),(34.98,32.12),(34.78,32.12)]),
 'Judea':     ((245,215,95),  [(34.70,32.10),(34.98,32.12),(35.15,32.02),(35.53,32.05),(35.50,31.78),(35.45,31.56),(35.20,31.55),(34.95,31.62),(34.62,31.80)]),
 'Idumea':    ((235,160,170), [(34.62,31.80),(34.95,31.62),(35.20,31.55),(35.45,31.56),(35.40,31.10),(35.10,30.98),(34.70,31.20),(34.55,31.55)]),
 'Perea':     ((175,150,215), [(35.53,32.42),(35.78,32.38),(35.82,32.00),(35.78,31.58),(35.60,31.52),(35.52,31.78),(35.53,32.05)]),
 'Dekapolis': ((120,200,195), [(35.62,32.86),(36.10,32.86),(36.30,32.40),(35.95,32.22),(35.80,32.38),(35.58,32.42),(35.47,32.50),(35.50,32.58),(35.57,32.68),(35.58,32.80)]),
 'gebied van Filippus': ((205,180,140), [(35.60,33.08),(35.62,32.86),(36.10,32.86),(36.45,32.90),(36.55,33.30),(36.00,33.50),(35.45,33.50),(35.45,33.15)]),
}
im = basis().convert('RGBA')
landmask = Image.new('L',(W,H),0); ld=ImageDraw.Draw(landmask)
for f in land['features']:
    for p in polys(f['geometry']):
        if in_bbox(p[0]): ld.polygon([xy(*c[:2]) for c in p[0]], fill=255)
for f in lakes['features']:
    for p in polys(f['geometry']):
        if in_bbox(p[0]): ld.polygon([xy(*c[:2]) for c in p[0]], fill=0)
laag = Image.new('RGBA',(W,H),(0,0,0,0))
for naam,(kleur,pts) in S.items():
    m = Image.new('L',(W,H),0); ImageDraw.Draw(m).polygon([xy(lo,la) for lo,la in pts], fill=255)
    m = m.filter(ImageFilter.GaussianBlur(9))
    m = Image.fromarray(__import__('numpy').minimum(__import__('numpy').asarray(m)*0.75, __import__('numpy').asarray(landmask)).astype('uint8'))
    vlak = Image.new('RGBA',(W,H),kleur+(255,)); vlak.putalpha(m)
    laag = Image.alpha_composite(laag, vlak)
im = Image.alpha_composite(im, laag)
import numpy as np
uni = Image.new('L',(W,H),0); ud=ImageDraw.Draw(uni)
for n in ('Galilea','Samaria','Judea','Idumea','Perea'):
    ud.polygon([xy(lo,la) for lo,la in S[n][1]], fill=255)
uni = uni.filter(ImageFilter.MaxFilter(21)).filter(ImageFilter.MinFilter(21))   # gaatjes tussen streken dicht
u = np.asarray(uni)>128
lm = np.asarray(landmask)>0
binnen = u & lm
from PIL import ImageChops
bm = Image.fromarray((binnen*255).astype('uint8'))
rand = ImageChops.subtract(bm.filter(ImageFilter.MaxFilter(7)), bm)
goud = Image.new('RGBA',(W,H),(200,150,40,255)); goud.putalpha(rand.filter(ImageFilter.GaussianBlur(1)))
im = Image.alpha_composite(im, goud)
# rivier en meren opnieuw bovenop
d = ImageDraw.Draw(im)
for f in riv['features']:
    for l in lines(f['geometry']):
        if in_bbox(l): d.line([xy(*c[:2]) for c in l], fill=RIVER+(255,), width=4, joint='curve')
for f in lakes['features']:
    for p in polys(f['geometry']):
        if in_bbox(p[0]): d.polygon([xy(*c[:2]) for c in p[0]], fill=WATER+(255,))
im.convert('RGB').save('uit/overzicht-streken-zonder-namen.png')
FR=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSerif-BoldItalic.ttf',26)
F=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',20)
lab={'Fenicië':(35.20,33.30),'Galilea':(35.33,32.88),'Samaria':(35.25,32.30),'Judea':(35.10,31.80),'Idumea':(35.00,31.30),'Perea':(35.68,31.95),'Dekapolis':(35.95,32.60),'gebied van Filippus':(36.00,33.18)}
for n,(lo,la) in lab.items(): d.text(xy(lo,la),n.upper() if n!='gebied van Filippus' else 'GEBIED VAN FILIPPUS',fill=(70,50,30),font=FR,anchor='mm')
for n,la,lo in [('Jeruzalem',31.778,35.235),('Nazaret',32.700,35.300),('Kafarnaüm',32.880,35.575),('Jericho',31.860,35.440),('Caesarea',32.500,34.890),('Tyrus',33.270,35.196),('Betlehem',31.704,35.207)]:
    x,y=xy(lo,la); d.ellipse((x-7,y-7,x+7,y+7),fill=(160,30,30),outline='white',width=2); d.text((x+10,y-12),n,fill=(40,15,15),font=F)
im.convert('RGB').save('uit/overzicht-streken-met-namen.png')
im.convert('RGB').resize((1280,720)).save('uit/overzicht-streken-voorbeeld.png')
