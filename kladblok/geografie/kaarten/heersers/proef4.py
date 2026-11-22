import json, numpy as np
from PIL import Image, ImageDraw, ImageFont
src=open('uit/kaart-heersers.js').read()
cfg=json.loads(src.split("const ONTDEK_KAART_HEERSERS = ")[1].rsplit(";",1)[0])
img=Image.open('uit/kaart-heersers.webp').convert('RGB'); w,h=img.size
SERB='/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf'; SANSB='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
STREKEN=[('fenicie','Fenicië',49.4,10.0),('galilea','Galilea',47.9,27.5),('samaria','Samaria',47.8,46.5),('judea','Judea',42.0,62.5),('idumea','Idumea',44.1,84.0),('perea','Perea',56.4,54.0),('dekapolis','Dekapolis',61.4,37.0),('iturea','Iturea en\nTrachonitis',63.0,16.0)]
HD='Herodes de Grote'; SY='stadhouder\nvan Syrië'; PI='stadhouder\nPilatus'; AN='Herodes\nAntipas'; AG='Herodes\nAgrippa'
HEER={'geboorte':{'fenicie':(SY,'rome'),'galilea':(HD,'herodes-de-grote'),'samaria':(HD,'herodes-de-grote'),'judea':(HD,'herodes-de-grote'),'idumea':(HD,'herodes-de-grote'),'perea':('Herodes\nde Grote','herodes-de-grote'),'dekapolis':(SY,'rome'),'iturea':(HD,'herodes-de-grote')},
 'volwassen':{'fenicie':(SY,'rome'),'galilea':(AN,'antipas'),'samaria':(PI,'pilatus'),'judea':(PI,'pilatus'),'idumea':(PI,'pilatus'),'perea':(AN,'antipas'),'dekapolis':(SY,'rome'),'iturea':('Filippus','filippus')},
 'handelingen':{'fenicie':(SY,'rome'),'galilea':(AG,'agrippa'),'samaria':(AG,'agrippa'),'judea':(AG,'agrippa'),'idumea':(AG,'agrippa'),'perea':(AG,'agrippa'),'dekapolis':(SY,'rome'),'iturea':(AG,'agrippa')}}
def kl(x): return tuple(int(x[i:i+2],16) for i in (1,3,5))
base=np.asarray(img).astype(float)/255; L=0.3*base[...,0]+0.59*base[...,1]+0.11*base[...,2]
rows=[]
for t in cfg['tijden']:
    K={g['id']:g['kleur'] for g in t['gebieden']}
    out=base.copy()
    for g in t['gebieden']:
        c=np.array(kl(g['kleur']))/255; Lc=0.3*c[0]+0.59*c[1]+0.11*c[2]
        m=Image.new('L',img.size,0); dm=ImageDraw.Draw(m)
        for v in g['vlakken']: dm.polygon([(x/100*w,y/100*h) for x,y in v],fill=255)
        m=np.asarray(m)>0; col=np.clip(c+(L-Lc)[...,None],0,1); out[m]=0.25*base[m]+0.75*col[m]
    b=Image.fromarray((out*255).astype('uint8')).convert('RGBA'); d=ImageDraw.Draw(b)
    for g in t['gebieden']:
        for v in g['vlakken']: d.line([(x/100*w,y/100*h) for x,y in v]+[(v[0][0]/100*w,v[0][1]/100*h)],fill=kl(g['kleur']),width=3)
    fr=ImageFont.truetype(SERB,19); fh=ImageFont.truetype(SANSB,13)
    for sid,naam,x,y in STREKEN:
        X,Y=x/100*w,y/100*h
        d.multiline_text((X,Y),naam.upper(),font=fr,fill=(255,248,225),anchor='md',align='center',stroke_width=3,stroke_fill=(60,40,20),spacing=0)
        tekst,gid=HEER[t['id']][sid]; c=kl(K[gid]); donker=tuple(int(v*0.4) for v in c)
        d.multiline_text((X,Y+4),tekst,font=fh,fill='white',anchor='ma',align='center',stroke_width=3,stroke_fill=donker,spacing=1)
    rows.append(b.convert('RGB'))
s=Image.new('RGB',(w,h*3)); [s.paste(x,(0,i*h)) for i,x in enumerate(rows)]
s.save('uit/proef-streek-en-heerser.jpg',quality=85); rows[1].save('p4-volwassen.png')
