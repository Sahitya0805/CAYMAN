# Homepage "All 21 Kings" lineup

Builds `assets/team/csk-21-lineup.jpg` (the homepage hero image) from the official squad portraits listed in
`content/squad.json`. Run from this folder:

```bash
pip install "rembg[cpu]" pillow numpy
python3 cut.py        # cut each portrait out of its white studio background -> cut/
python3 measure.py    # measure head size/centre from each cutout -> heads.json
python3 compose.py    # arrange 6/7/8 rows on the stadium background
```

Then copy `team21.jpg` to `assets/team/csk-21-lineup.jpg` and bump the
`?v=` on it in `index.html`. Row order lives in `compose.py`.
