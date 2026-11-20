import json, math, csv
from PIL import Image, ImageDraw, ImageFont
W, H = 1920, 1080
import sys
NAAM=sys.argv[1]; LAT0, LAT1, LONC = map(float, sys.argv[2:5])
LATC = (LAT0 + LAT1) / 2
k = math.cos(math.radians(LATC))
lat_span = LAT1 - LAT0
lon_span = lat_span * (W / H) / k
LON0, LON1 = LONC - lon_span/2, LONC + lon_span/2
def xy(lon, lat):
    return ((lon - LON0) / lon_span * W, (LAT1 - lat) / lat_span * H)
def in_bbox(coords):
    xs=[c[0] for c in coords]; ys=[c[1] for c in coords]
    return max(xs) > LON0-1 and min(xs) < LON1+1 and max(ys) > LAT0-1 and min(ys) < LAT1+1
def polys(geom):
    if geom['type']=='Polygon': yield geom['coordinates']
    elif geom['type']=='MultiPolygon':
        for p in geom['coordinates']: yield p
def lines(geom):
    if geom['type']=='LineString': yield geom['coordinates']
    elif geom['type']=='MultiLineString':
        for l in geom['coordinates']: yield l
D='data/'
land=json.load(open(D+'ne_10m_land.geojson')); lakes=json.load(open(D+'ne_10m_lakes.geojson')); riv=json.load(open(D+'ne_10m_rivers_lake_centerlines.geojson'))
SEA=(164,205,232); LAND=(236,222,186); WATER=(110,170,215); RIVER=(90,150,205)
def basis():
    im=Image.new('RGB',(W,H),SEA); d=ImageDraw.Draw(im)
    for f in land['features']:
        for p in polys(f['geometry']):
            if in_bbox(p[0]): d.polygon([xy(*c[:2]) for c in p[0]], fill=LAND)
    for f in riv['features']:
        for l in lines(f['geometry']):
            if in_bbox(l): d.line([xy(*c[:2]) for c in l], fill=RIVER, width=4, joint='curve')
    for f in lakes['features']:
        for p in polys(f['geometry']):
            if in_bbox(p[0]): d.polygon([xy(*c[:2]) for c in p[0]], fill=WATER)
    return im
# plaatsen: naam, lat, lon, soort (stad/onzeker/berg/streek/water)
P=[('Jeruzalem',31.778,35.235,'stad'),('Betlehem',31.704,35.207,'stad'),('Betanië',31.771,35.261,'stad'),
('Jericho',31.860,35.440,'stad'),('Nazaret',32.700,35.300,'stad'),('Kafarnaüm',32.880,35.575,'stad'),
('Caesarea',32.500,34.890,'stad'),('Caesarea Filippi',33.249,35.694,'stad'),('Joppe',32.050,34.750,'stad'),
('Lydda',31.950,34.890,'stad'),('Tyrus',33.270,35.196,'stad'),
('Kana',32.770,35.303,'onzeker'),('Betsaïda',32.910,35.631,'onzeker'),('Emmaüs',31.839,34.990,'onzeker'),
('Gerizim',32.200,35.272,'berg'),('Tabor',32.687,35.390,'berg'),('Hermon',33.416,35.857,'berg'),
('Galilea',32.85,35.25,'streek'),('Samaria',32.25,35.10,'streek'),('Judea',31.55,35.00,'streek'),
('Idumea',31.15,34.85,'streek'),('Perea',31.95,35.72,'streek'),('Dekapolis',32.55,35.95,'streek'),
('meer van Galilea',32.81,35.59,'water'),('Jordaan',32.30,35.57,'water'),('Dode Zee',31.50,35.50,'water'),('Middellandse Zee',32.30,34.25,'water')]
im=basis(); im.save(f'uit/{NAAM}-zonder-namen.png')
d=ImageDraw.Draw(im)
try: F=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',22); FS=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',20); FR=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSerif-Italic.ttf',30)
except: F=FS=FR=ImageFont.load_default()
rows=[]
for n,la,lo,s in P:
    x,y=xy(lo,la)
    if not (0<=x<=W and 0<=y<=H): continue
    rows.append((n,s,la,lo,round(x/W*100,2),round(y/H*100,2)))
    if s=='stad': d.ellipse((x-7,y-7,x+7,y+7),fill=(160,30,30),outline='white',width=2); d.text((x+10,y-12),n,fill=(60,20,20),font=F)
    elif s=='onzeker': d.ellipse((x-7,y-7,x+7,y+7),outline=(160,30,30),width=3); d.text((x+10,y-12),n+' ?',fill=(120,40,40),font=F)
    elif s=='berg': d.polygon([(x,y-10),(x-9,y+7),(x+9,y+7)],fill=(110,80,50)); d.text((x+11,y-12),n,fill=(80,55,30),font=FS)
    elif s=='streek': d.text((x,y),n.upper(),fill=(120,95,60),font=FR,anchor='mm')
    else: d.text((x,y),n,fill=(30,70,130),font=FS,anchor='mm')
im.save(f'uit/{NAAM}-met-namen.png')
with open(f'uit/{NAAM}-posities.csv','w',newline='',encoding='utf-8') as f:
    w=csv.writer(f,delimiter=';'); w.writerow(['naam','soort','breedte','lengte','x_procent','y_procent']); w.writerows(rows)
print('uitsnede lengte %.2f–%.2f, breedte %.2f–%.2f'%(LON0,LON1,LAT0,LAT1))
