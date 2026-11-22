import json, math, sys, os
from shapely.geometry import Polygon, shape, box
from shapely.ops import unary_union
from PIL import Image, ImageDraw, ImageFont, ImageFilter
os.chdir('/home/claude/kaartzip')
sys.argv=['x','overzicht','30.95','33.50','35.35']
exec(open('scripts/maak_onderlegger.py').read().split("im=basis()")[0])
S = {
 'Fenicie':   [(34.6,32.76),(34.95,32.72),(35.0,32.66),(34.98,32.62),(35.12,32.60),(35.10,32.80),(35.16,33.00),(35.30,33.10),(35.45,33.15),(35.45,33.50),(35.05,33.55),(34.90,33.0)],
 'Galilea':   [(34.98,32.62),(35.12,32.60),(35.10,32.80),(35.16,33.00),(35.30,33.10),(35.45,33.15),(35.60,33.08),(35.58,32.90),(35.53,32.78),(35.57,32.68),(35.63,32.62),(35.60,32.50),(35.30,32.55)],
 'Samaria':   [(34.55,32.75),(34.95,32.72),(35.0,32.66),(34.98,32.62),(35.12,32.60),(35.30,32.55),(35.47,32.52),(35.55,32.40),(35.53,32.05),(35.15,32.02),(34.98,32.12),(34.45,32.12)],
 'Judea':     [(34.45,32.12),(34.98,32.12),(35.15,32.02),(35.53,32.05),(35.50,31.78),(35.45,31.56),(35.20,31.55),(34.95,31.62),(34.40,31.80)],
 'Idumea':    [(34.40,31.80),(34.95,31.62),(35.20,31.55),(35.45,31.56),(35.40,31.10),(35.10,30.98),(34.70,31.20),(34.35,31.45)],
 'Perea':     [(35.53,32.42),(35.78,32.38),(35.82,32.00),(35.78,31.58),(35.60,31.52),(35.52,31.78),(35.53,32.05)],
 'Dekapolis': [(35.62,32.86),(36.10,32.86),(36.30,32.40),(35.95,32.22),(35.80,32.38),(35.58,32.42),(35.47,32.50),(35.50,32.58),(35.57,32.68),(35.58,32.80)],
 'Filippus':  [(35.60,33.08),(35.62,32.86),(36.10,32.86),(36.45,32.90),(36.55,33.30),(36.00,33.50),(35.45,33.50),(35.45,33.15)],
}
P={n:Polygon(p).buffer(0) for n,p in S.items()}
bb=box(LON0-0.5,LAT0-0.5,LON1+0.5,LAT1+0.5)
landg=unary_union([shape(f['geometry']).intersection(bb) for f in land['features'] if shape(f['geometry']).intersects(bb)])
lakesg=unary_union([shape(f['geometry']).intersection(bb) for f in lakes['features'] if shape(f['geometry']).intersects(bb)])
landg=landg.difference(lakesg)
def U(*ns): return unary_union([P[n] for n in ns]).buffer(0.004).buffer(-0.004)
def pct(lon,lat): return [round((lon-LON0)/lon_span*100,2), round((LAT1-lat)/lat_span*100,2)]
HEEL=('Galilea','Samaria','Judea','Idumea','Perea','Filippus')
KL={'herodes-de-grote':'#E3A530','agrippa':'#E3A530','pilatus':'#D9534F','rome':'#D9534F','antipas':'#3D8FD6','filippus':'#4FAF6A'}
NM={'herodes-de-grote':'Herodes de Grote','agrippa':'Herodes Agrippa','pilatus':'Pilatus','rome':'Rome','antipas':'Herodes Antipas','filippus':'Filippus'}
TIJDEN={
 'geboorte':    [('herodes-de-grote',U(*HEEL)),('rome',U('Fenicie','Dekapolis'))],
 'volwassen':   [('pilatus',U('Judea','Samaria','Idumea')),('antipas',U('Galilea','Perea')),('filippus',U('Filippus')),('rome',U('Fenicie','Dekapolis'))],
 'handelingen': [('agrippa',U(*HEEL)),('rome',U('Fenicie','Dekapolis'))],
}
LABEL={'rome':(35.97,32.60),'herodes-de-grote':(35.15,31.95),'agrippa':(35.15,31.95),'pilatus':(35.12,31.85),'antipas':(35.30,32.80),'filippus':(36.05,33.15)}
out={}
for t,gs in TIJDEN.items():
    out[t]=[]
    for g,poly in gs:
        geo=poly.intersection(landg).simplify(0.004)
        parts=[geo] if geo.geom_type=='Polygon' else [p for p in geo.geoms if p.area>0.0005]
        lab=LABEL[g]
        out[t].append({'id':g,'naam':NM[g],'kleur':KL[g],
            'label':pct(*lab) if lab else None,
            'vlakken':[[pct(*c) for c in p.exterior.coords] for p in parts]})
json.dump(out,open('/home/claude/heersers/heersers-gebieden.json','w'),ensure_ascii=False)
# schone onderlegger (zonder streken) voor ChatGPT
im=basis(); ImageDraw.Draw(im).polygon([xy(lo,la) for lo,la in [(35.588,33.105),(35.613,33.110),(35.626,33.090),(35.620,33.065),(35.603,33.055),(35.586,33.070),(35.582,33.090)]],fill=WATER); im.save('/home/claude/heersers/kaart-heersers-onderlegger.png')
# proefbeeld per tijd
F=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',30)
for t,gs in out.items():
    b=im.convert('RGBA'); lay=Image.new('RGBA',b.size,(0,0,0,0)); d=ImageDraw.Draw(lay)
    for g in gs:
        c=tuple(int(g['kleur'][i:i+2],16) for i in (1,3,5))
        a=90 if g['id']=='rome' else 150
        for v in g['vlakken']:
            d.polygon([(x/100*W,y/100*H) for x,y in v],fill=c+(a,),outline=c+(255,),width=4)
    b=Image.alpha_composite(b,lay); d=ImageDraw.Draw(b)
    for g in gs:
        if g['label']:
            x,y=g['label'][0]/100*W,g['label'][1]/100*H
            d.text((x,y),g['naam'],font=F,fill=(255,255,255),anchor='mm',stroke_width=4,stroke_fill=(40,40,40))
    d.text((W/2,40),{'geboorte':'Toen Jezus geboren werd','volwassen':'Toen Jezus volwassen was','handelingen':'In de tijd van Handelingen'}[t],font=F,fill=(30,30,30),anchor='mm')
    b.convert('RGB').save(f'/home/claude/heersers/proef-{t}.png')
