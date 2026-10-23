# Homepage "All 21 Kings" lineup

Builds `assets/team/csk-21-lineup.*` and `content/team-lineup.json`
(face hotspot positions) from the official squad portraits listed in
`content/squad.json`. Run from this folder:

```bash
pip install "rembg[cpu]" pillow numpy
python3 cut.py        # cut each portrait out of its white studio background -> cut/
python3 measure.py    # measure head size/centre from each cutout -> heads.json
python3 compose.py    # arrange 6/7/8 rows on the stadium background
```

Then copy `team21.jpg` to `assets/team/csk-21-lineup.jpg` (plus the webp
versions) and `team21_positions.json` into `content/team-lineup.json`
(as a list with an `id` field per player). Row order lives in `compose.py`.
