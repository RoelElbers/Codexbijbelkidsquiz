import json, math, sys, os
import numpy as np, cv2
from shapely.geometry import Polygon
from shapely.ops import unary_union
from PIL import Image, ImageDraw, ImageFont
exec(open('heersers2.py').read().split("P={n:Polygon")[0].split("exec(open('scripts")[0])
os.chdir('/home/claude/kaartzip'); sys.argv=['x','overzicht','30.95','33.50','35.35']
exec(open('scripts/maak_onderlegger.py').read().split("im=basis()")[0])
os.chdir('/home/claude/heersers')
src=open('heersers2.py').read()
S=eval(src.split("S = ")[1].split("\n}\n")[0]+"\n}")
P={n:Polygon(p).buffer(0) for n,p in S.items()}
def U(*ns): return unary_union([P[n] for n in ns]).buffer(0.004).buffer(-0.004)
img=Image.open('/mnt/user-data/uploads/7770fdf1-image.png').convert('RGB')
w,h=img.size
a=np.asarray(img).astype(int); r,g,b=a[...,0],a[...,1],a[...,2]
water=((b>r+35)&(b>g+5)).astype('uint8')*255
water=cv2.morphologyEx(water,cv2.MORPH_CLOSE,np.ones((9,9),np.uint8))
water=cv2.morphologyEx(water,cv2.MORPH_OPEN,np.ones((3,3),np.uint8))
land=(water==0).astype('uint8')
def px(lon,lat): return ((lon-LON0)/lon_span*w,(LAT1-lat)/lat_span*h)
HEEL=('Galilea','Samaria','Judea','Idumea','Perea','Filippus')
TIJDEN={
 'geboorte':    [('herodes-de-grote',U(*HEEL)),('rome',U('Fenicie','Dekapolis'))],
 'volwassen':   [('pilatus',U('Judea','Samaria','Idumea')),('antipas',U('Galilea','Perea')),('filippus',U('Filippus')),('rome',U('Fenicie','Dekapolis'))],
 'handelingen': [('agrippa',U(*HEEL)),('rome',U('Fenicie','Dekapolis'))],
}
cfgsrc=open('uit/kaart-heersers.js').read()
cfg=json.loads(cfgsrc.split("const ONTDEK_KAART_HEERSERS = ")[1].rsplit(";",1)[0])
def masker(poly):
    m=np.zeros((h,w),np.uint8)
    geoms=[poly] if poly.geom_type=='Polygon' else list(poly.geoms)
    for gg in geoms:
        cv2.fillPoly(m,[np.array([px(*c) for c in gg.exterior.coords],np.int32)],1)
    return m
ROME=None
def vlakken(poly,zonder=None):
    m=np.zeros((h,w),np.uint8)
    geoms=[poly] if poly.geom_type=='Polygon' else list(poly.geoms)
    for gg in geoms:
        cv2.fillPoly(m,[np.array([px(*c) for c in gg.exterior.coords],np.int32)],1)
    m=m&land
    if zonder is not None: m=m&(1-zonder)
    m=cv2.morphologyEx(m,cv2.MORPH_OPEN,np.ones((5,5),np.uint8))
    cs,_=cv2.findContours(m,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)
    res=[]
    for c in cs:
        if cv2.contourArea(c)<1500: continue
        c=cv2.approxPolyDP(c,1.5,True)
        res.append([[round(float(x)/w*100,2),round(float(y)/h*100,2)] for [[x,y]] in c])
    return res
KL={'herodes-de-grote':'#8E44AD','agrippa':'#8E44AD','pilatus':'#D9534F','rome':'#D9534F','antipas':'#2E86DE','filippus':'#F39C12'}
for t in cfg['tijden']:
    polys=dict(TIJDEN[t['id']])
    for gb in t['gebieden']:
        rv=vlakken(polys['rome']); rm=np.zeros((h,w),np.uint8)
        for v in rv: cv2.fillPoly(rm,[np.array([[x/100*w,y/100*h] for x,y in v],np.int32)],1)
        gb['vlakken']=vlakken(polys[gb['id']], None if gb['id']=='rome' else rm); gb['kleur']=KL[gb['id']]
        if gb['id']=='antipas': gb['label']=[47.3,25.0]
        if gb['id']=='antipas': gb['naam']='Herodes\nAntipas'
cfg['afbeelding']='images/kaarten/kaart-heersers.webp?v=1'
cfg['breedte'],cfg['hoogte']=w,h
js=cfgsrc.split("const ONTDEK_KAART_HEERSERS = ")[0]+"const ONTDEK_KAART_HEERSERS = "+json.dumps(cfg,ensure_ascii=False,indent=1)+";\n"
open('uit/kaart-heersers.js','w').write(js)
img.save('uit/kaart-heersers.webp',quality=90)
F=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',22)
rows=[]
for t in cfg['tijden']:
    b=img.convert('RGBA'); lay=Image.new('RGBA',b.size,(0,0,0,0)); d=ImageDraw.Draw(lay)
    for gb in t['gebieden']:
        c=tuple(int(gb['kleur'][i:i+2],16) for i in (1,3,5))
        for v in gb['vlakken']:
            d.polygon([(x/100*w,y/100*h) for x,y in v],fill=c+(140,),outline=c+(255,),width=3)
    b=Image.alpha_composite(b,lay); d=ImageDraw.Draw(b)
    for gb in t['gebieden']:
        if gb['label']:
            d.multiline_text((gb['label'][0]/100*w,gb['label'][1]/100*h),gb['naam'],align='center',font=F,fill='white',anchor='mm',stroke_width=3,stroke_fill=(40,40,40))
    d.text((w/2,28),t['knop'],font=F,fill='white',anchor='mm',stroke_width=3,stroke_fill=(40,40,40))
    rows.append(b.convert('RGB'))
s=Image.new('RGB',(w,h*3)); [s.paste(x,(0,i*h)) for i,x in enumerate(rows)]
s.resize((w*2//3,h*2)).save('uit/proef-drie-tijden-tekening.png')
print([ (t['id'],[(g['id'],len(g['vlakken'])) for g in t['gebieden']]) for t in cfg['tijden']])
