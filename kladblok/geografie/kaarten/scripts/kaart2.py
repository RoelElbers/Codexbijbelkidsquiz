# Kaart 2: Galilea en het noorden — onderlegger met streken in de kleuren van kaart 1,
# het Hulemeer (bestond in de tijd van Jezus; drooggelegd 1951-1958) en de posities.
import sys, os, csv
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageChops
sys.argv=['x','galilea','32.45','33.45','35.50']
exec(open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'maak_onderlegger.py')).read().split("im=basis()")[0])
S = {
 'Fenicië':   ((235,155,205), [(34.95,32.78),(35.10,32.80),(35.16,33.00),(35.30,33.10),(35.42,33.50),(35.05,33.55),(34.90,33.0)]),
 'Galilea':   ((150,205,120), [(34.98,32.62),(35.12,32.60),(35.10,32.80),(35.16,33.00),(35.30,33.10),(35.45,33.15),(35.60,33.08),(35.58,32.90),(35.53,32.78),(35.57,32.68),(35.55,32.52),(35.30,32.55)]),
 'Samaria':   ((245,175,110), [(34.86,32.60),(34.98,32.62),(35.12,32.60),(35.30,32.55),(35.47,32.52),(35.55,32.40),(35.53,32.05),(35.15,32.02),(34.98,32.12),(34.78,32.12)]),
 'Dekapolis': ((120,200,195), [(35.62,32.86),(36.10,32.86),(36.30,32.40),(35.95,32.22),(35.80,32.38),(35.58,32.42),(35.47,32.50),(35.50,32.58),(35.57,32.68),(35.58,32.80)]),
 'gebied van Filippus': ((205,180,140), [(35.60,33.08),(35.62,32.86),(36.10,32.86),(36.45,32.90),(36.55,33.30),(36.00,33.50),(35.45,33.50),(35.45,33.15)]),
}
# Hulemeer (bij benadering): meer van ~5 x 4 km, met moeras ten noorden
HULE_MEER = [(35.588,33.105),(35.613,33.110),(35.626,33.090),(35.620,33.065),(35.603,33.055),(35.586,33.070),(35.582,33.090)]
HULE_MOERAS = [(35.570,33.102),(35.625,33.110),(35.640,33.150),(35.630,33.185),(35.590,33.192),(35.565,33.160)]
MOERAS=(150,190,170)
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
    m = m.filter(ImageFilter.GaussianBlur(14))
    m = Image.fromarray(np.minimum(np.asarray(m)*0.75, np.asarray(landmask)).astype('uint8'))
    vlak = Image.new('RGBA',(W,H),kleur+(255,)); vlak.putalpha(m)
    laag = Image.alpha_composite(laag, vlak)
im = Image.alpha_composite(im, laag)
# gouden omtrek van het land (Galilea + Samaria op deze uitsnede)
uni = Image.new('L',(W,H),0); ud=ImageDraw.Draw(uni)
for n in ('Galilea','Samaria'): ud.polygon([xy(lo,la) for lo,la in S[n][1]], fill=255)
uni = uni.filter(ImageFilter.MaxFilter(21)).filter(ImageFilter.MinFilter(21))
bm = Image.fromarray(((np.asarray(uni)>128) & (np.asarray(landmask)>0)).astype('uint8')*255)
rand = ImageChops.subtract(bm.filter(ImageFilter.MaxFilter(9)), bm)
goud = Image.new('RGBA',(W,H),(200,150,40,255)); goud.putalpha(rand.filter(ImageFilter.GaussianBlur(1)))
im = Image.alpha_composite(im, goud)
d = ImageDraw.Draw(im)
d.polygon([xy(lo,la) for lo,la in HULE_MOERAS], fill=MOERAS+(255,))
for f in riv['features']:
    for l in lines(f['geometry']):
        if in_bbox(l): d.line([xy(*c[:2]) for c in l], fill=RIVER+(255,), width=5, joint='curve')
for f in lakes['features']:
    for p in polys(f['geometry']):
        if in_bbox(p[0]): d.polygon([xy(*c[:2]) for c in p[0]], fill=WATER+(255,))
d.polygon([xy(lo,la) for lo,la in HULE_MEER], fill=WATER+(255,))
im.convert('RGB').save('uit/kaart2-onderlegger-zonder-namen.png')
# plaatsen
P=[('Nazaret',32.700,35.300,'stad'),('Kafarnaüm',32.880,35.575,'stad'),('Caesarea',32.500,34.890,'stad'),
('Caesarea Filippi',33.249,35.694,'stad'),('Tyrus',33.270,35.196,'stad'),('Kana',32.770,35.303,'stad'),
('Betsaïda',32.910,35.631,'stad'),('Magdala',32.825,35.515,'stad'),('Chorazin',32.911,35.564,'stad'),
('Tiberias',32.795,35.531,'stad'),('Naïn',32.630,35.348,'stad'),('Gadara',32.655,35.679,'stad'),
('Ptolemaïs',32.922,35.068,'stad'),
('Tabor',32.687,35.390,'berg'),('Hermon',33.416,35.857,'berg'),('Karmel',32.668,35.088,'berg'),
('berg van de zaligsprekingen',32.881,35.556,'berg'),
('Galilea',32.90,35.30,'streek'),('Fenicië',33.20,35.25,'streek'),('Dekapolis',32.62,35.90,'streek'),
('gebied van Filippus',33.20,35.95,'streek'),('Samaria',32.50,35.15,'streek'),
('meer van Galilea',32.81,35.59,'water'),('Jordaan',32.55,35.565,'water'),('Hulemeer',33.083,35.604,'water'),
('Middellandse Zee',32.95,34.75,'water')]
F=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',20); FS=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',18)
FR=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSerif-BoldItalic.ttf',28)
rows=[]
for n,la,lo,s in P:
    x,y=xy(lo,la)
    rows.append((n,s,la,lo,round(x/W*100,2),round(y/H*100,2),'binnen' if 0<=x<=W and 0<=y<=H else 'BUITEN'))
    if s=='stad': d.ellipse((x-7,y-7,x+7,y+7),fill=(160,30,30),outline='white',width=2); d.text((x+10,y-12),n,fill=(40,15,15),font=F)
    elif s=='berg': d.polygon([(x,y-10),(x-9,y+7),(x+9,y+7)],fill=(90,60,30)); d.text((x+11,y-12),n,fill=(70,45,20),font=FS)
    elif s=='streek': d.text((x,y),n.upper(),fill=(70,50,30),font=FR,anchor='mm')
    else: d.text((x,y),n,fill=(20,60,130),font=FS,anchor='mm')
im.convert('RGB').save('uit/kaart2-orientatie-met-namen.png')
with open('uit/kaart2-posities.csv','w',newline='',encoding='utf-8') as f:
    w=csv.writer(f,delimiter=';'); w.writerow(['naam','soort','breedte','lengte','x_procent','y_procent','op_kaart']); w.writerows(rows)
print('uitsnede lengte %.2f-%.2f, breedte %.2f-%.2f'%(LON0,LON1,LAT0,LAT1))
