import json, sys
from pathlib import Path
from PIL import Image
from rembg import remove, new_session
R = Path(__file__).resolve().parents[2]
squad = json.load(open(R/'content/squad.json'))
sess = new_session(sys.argv[1] if len(sys.argv)>1 else 'isnet-general-use')
for p in squad:
    src = R / p['photo'].split('?')[0]
    out = Path('cut')/f"{p['id']}.png"
    if out.exists(): continue
    im = Image.open(src).convert('RGB')
    cut = remove(im, session=sess, post_process_mask=True)
    bb = cut.getbbox(); cut = cut.crop(bb)
    cut.save(out); print(p['id'], cut.size, flush=True)
