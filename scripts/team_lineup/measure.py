"""Measure head width and centre from each cutout's alpha mask -> heads.json"""
import json
import numpy as np
from PIL import Image

res = {}
for i in range(1, 22):
    k = f'csk-{i:02d}'
    a = np.array(Image.open(f'cut/{k}.png'))[:, :, 3] > 128
    H, W = a.shape
    top = int(np.where(a.any(1))[0][0])
    wid = np.array([(np.where(r)[0][-1] - np.where(r)[0][0]) if r.any() else 0 for r in a])
    cx = np.array([(np.where(r)[0][-1] + np.where(r)[0][0]) / 2 if r.any() else 0 for r in a])
    z = wid[top:top + int(0.45 * H)]
    hm = int(np.argmax(z[:int(0.25 * H)]))
    hw = z[hm]
    seg = z[hm:]
    end = next((j for j, v in enumerate(seg) if v > 2.2 * hw), len(seg))
    neck = hm + int(np.argmin(seg[:max(end, 1)]))
    res[k] = dict(top=top, neck=int(top + neck), headw=int(hw), cx=float(cx[top + hm]), W=W, H=H)
json.dump(res, open('heads.json', 'w'))
print('measured', len(res))
