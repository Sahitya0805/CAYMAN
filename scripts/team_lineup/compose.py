import json, numpy as np
from PIL import Image, ImageFilter, ImageEnhance, ImageDraw
import os
R=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..')+'/'
heads=json.load(open('heads.json'))
squad={p['id']:p for p in json.load(open(R+'content/squad.json'))}
CW,CH=2400,1080
# rows: back -> front (drawn in that order)
rows=[
  dict(ids=['csk-14','csk-17','csk-07','csk-13','csk-18','csk-19'], T=113, top=138, span=1600, off=0),
  dict(ids=['csk-20','csk-08','csk-06','csk-12','csk-10','csk-15','csk-21'], T=126, top=300, span=1930, off=0),
  dict(ids=['csk-11','csk-05','csk-03','csk-01','csk-02','csk-04','csk-09','csk-16'], T=140, top=492, span=2110, off=0),
]
scale_adj={'csk-20':0.88,'csk-21':0.80,'csk-15':0.94,'csk-07':0.93}
# background
bg=Image.open(R+'assets/hero-stadium-night.png').convert('RGB')
bw=CW; bh=int(bg.height*CW/bg.width)
bg=bg.resize((bw,bh),Image.LANCZOS).crop((0,max(0,(bh-CH)//2-60),CW,max(0,(bh-CH)//2-60)+CH)) if bh>=CH else bg.resize((int(bg.width*CH/bg.height),CH),Image.LANCZOS)
bg=bg.crop(((bg.width-CW)//2,0,(bg.width-CW)//2+CW,CH))
bg=bg.filter(ImageFilter.GaussianBlur(7))
bg=ImageEnhance.Brightness(bg).enhance(0.62)
# navy grade
navy=Image.new('RGB',(CW,CH),(6,21,48)); bg=Image.blend(bg,navy,0.35)
canvas=bg.convert('RGBA')
# soft spotlight behind team
spot=Image.new('L',(CW,CH),0); d=ImageDraw.Draw(spot); d.ellipse((CW*0.12,CH*0.05,CW*0.88,CH*1.25),fill=120)
spot=spot.filter(ImageFilter.GaussianBlur(160))
glow=Image.new('RGBA',(CW,CH),(70,140,230,0)); glow.putalpha(spot)
canvas=Image.alpha_composite(canvas,glow)
pos={}
for ri,row in enumerate(rows):
    n=len(row['ids']); x0=(CW-row['span'])/2; step=row['span']/(n-1) if n>1 else 0
    layer=Image.new('RGBA',(CW,CH),(0,0,0,0)); shadow=Image.new('RGBA',(CW,CH),(0,0,0,0))
    # draw from edges to centre so centre players overlap neighbours
    order=sorted(range(n),key=lambda i:-abs(i-(n-1)/2))
    for i in order:
        k=row['ids'][i]; h=heads[k]; im=Image.open(f'cut/{k}.png')
        if k=='csk-07':
            im=im.crop((14,0,im.width-14,im.height))
        # soft fade on the bottom 24% of every portrait so crop lines dissolve
        al=np.array(im.split()[3]).astype(float); n_=al.shape[0]; f0=int(n_*0.76)
        ramp=np.ones(n_); ramp[f0:]=np.linspace(1,0,n_-f0)**1.3
        im.putalpha(Image.fromarray((al*ramp[:,None]).astype('uint8')))
        s=row['T']*scale_adj.get(k,1)/h['headw']
        im=im.resize((max(1,int(im.width*s)),max(1,int(im.height*s))),Image.LANCZOS)
        cx=x0+i*step+row['off']; hx=(h['cx']-(14 if k=='csk-07' else 0))*s
        x=int(cx-hx); y=int(row['top']+(row['T']-row['T']*scale_adj.get(k,1))*1.1)
        # depth grade: back rows slightly darker/cooler
        if ri<2:
            f=0.86 if ri==0 else 0.93
            rgb=ImageEnhance.Brightness(im.convert('RGB')).enhance(f); rgb.putalpha(im.split()[3]); im=rgb
        sh=Image.new('RGBA',im.size,(0,0,0,170)); sh.putalpha(im.split()[3].point(lambda v:int(v*0.6)))
        shadow.alpha_composite(sh,(max(0,x+14),max(0,y+18))) if x+14>=0 else None
        tmp=Image.new('RGBA',(CW,CH),(0,0,0,0)); tmp.paste(im,(x,y),im); layer=Image.alpha_composite(layer,tmp)
        hh=int(h['neck']*s)
        pos[k]=dict(name=squad[k]['name_display'],role=squad[k]['role'],x=round((x+hx)/CW*100,2),y=round((y+hh*0.48)/CH*100,2),r=round(row['T']*scale_adj.get(k,1)*0.62/CW*100,2))
    shadow=shadow.filter(ImageFilter.GaussianBlur(22))
    canvas=Image.alpha_composite(canvas,shadow); canvas=Image.alpha_composite(canvas,layer)
# bottom fade to navy (hides cut-off torsos) + slight vignette
fade=Image.new('L',(CW,CH),0); fd=ImageDraw.Draw(fade)
for yy in range(CH):
    t=max(0,(yy-CH*0.74)/(CH*0.26)); fd.line([(0,yy),(CW,yy)],fill=int(255*min(1,t**1.4)))
canvas=Image.alpha_composite(canvas,Image.merge('RGBA',(*Image.new('RGB',(CW,CH),(6,16,36)).split(),fade)))
out=canvas.convert('RGB')
out.save('team21.jpg',quality=88,optimize=True,progressive=True)
out.resize((1200,int(CH/2))).save('team21_small.jpg',quality=85)
json.dump(pos,open('team21_positions.json','w'),indent=1)
print('ok', out.size)
