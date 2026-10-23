#!/usr/bin/env python3
"""
Build content/fixtures.json from real Cayman Super Kings results on CricClubs.

Inputs (exported from https://cricclubs.com/CaymanCricketAssociation results pages):
  - rows file: one match per line, "~"-separated:
      id~date~series~venue~team1~score1~overs1~max1~team2~score2~overs2~max2~result
    team1 is the side that batted first. "CSK" means Cayman Super Kings.
  - scorecards JSON: {match_id: [innings, ...]} with batting/bowling cards.
  - logos JSON (optional): {team_name: logo_url}

Usage:
  python3 scripts/build_fixtures_from_cricclubs.py ROWS SCORECARDS [LOGOS]
"""
import json
import re
import sys
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "content" / "fixtures.json"
CSK = "Cayman Super Kings"
PORTAL = "https://cricclubs.com/CaymanCricketAssociation/results/"
VENUES = {"JP": "Jimmy Powell Cricket Oval", "SR": "Smith Road Oval"}


def full(name):
    return CSK if name in ("CSK", CSK) else name


def fmt_of(series):
    s = series.lower()
    if "t-10" in s or "t10" in s:
        return "T10"
    m = re.search(r"(\d+)\s*over", s)
    if m:
        return f"{m.group(1)}-Over"
    return "T20"


def short_of(name):
    words = [w for w in re.split(r"[\s']+", name) if w and w[0].isalnum()]
    if len(words) == 1:
        return words[0][:3].upper()
    return "".join(w[0] for w in words[:4]).upper()


def slugify(s):
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


def parse_date(s):
    for f in ("%b %d, %Y %I:%M %p", "%b %d, %Y"):
        try:
            return datetime.strptime(s.strip(), f), f != "%b %d, %Y"
        except ValueError:
            pass
    raise ValueError(s)


def main(rows_path, sc_path, logos_path=None):
    scorecards = json.loads(Path(sc_path).read_text())
    logos = json.loads(Path(logos_path).read_text()) if logos_path else {}
    out = []
    for line in Path(rows_path).read_text().splitlines():
        if not line.strip():
            continue
        (mid, date_s, series, venue, t1, s1, o1, m1, t2, s2, o2, m2, result) = line.split("~")
        t1, t2 = full(t1), full(t2)
        result = result.replace("CSK", CSK).rstrip(".")
        dt, has_time = parse_date(date_s)
        csk_first = t1 == CSK
        opp = t2 if csk_first else t1
        csk_s, csk_o, csk_m = (s1, o1, m1) if csk_first else (s2, o2, m2)
        opp_s, opp_o, opp_m = (s2, o2, m2) if csk_first else (s1, o1, m1)

        low = result.lower()
        no_result = "abandon" in low or "no result" in low
        if no_result:
            win = None
        else:
            win = bool(re.search(rf"({re.escape(CSK)} won|winner: {re.escape(CSK)})", result, re.I))

        # Abandoned games are shown on CricClubs as 0/0; hide those placeholder scores
        if no_result or "forfeit" in low:
            csk_s = opp_s = csk_o = opp_o = ""

        innings = []
        for inn in scorecards.get(mid, []):
            bat = [
                {"player": b[0], "dismissal": b[1], "runs": b[2], "balls": b[3],
                 "fours": b[4], "sixes": b[5], "sr": b[6]}
                for b in inn.get("bat", [])
            ]
            bowl = [
                {"bowler": b[0], "overs": b[1], "maidens": b[2], "runs": b[3],
                 "wickets": b[4], "econ": b[5]}
                for b in inn.get("bowl", [])
            ]
            if bat or bowl:
                innings.append({"team": inn.get("team", ""), "batting": bat, "bowling": bowl})

        out.append({
            "id": mid,
            "slug": f"{dt:%Y-%m-%d}-csk-vs-{slugify(opp)}-{mid[:6].lower().replace('_', '').replace('-', '')}",
            "competition": series,
            "format": fmt_of(series),
            "season": str(dt.year),
            "opponent": opp,
            "opponent_short": short_of(opp),
            "opponent_logo": logos.get(opp, ""),
            "csk_batted_first": csk_first,
            "is_home": csk_first,
            "date": f"{dt:%Y-%m-%d}",
            "time": f"{dt:%H:%M}" if has_time else "",
            "venue": VENUES.get(venue, venue),
            "status": "no_result" if no_result else "result",
            "score_csk": csk_s,
            "overs_csk": csk_o,
            "max_overs": csk_m or opp_m,
            "score_opp": opp_s,
            "overs_opp": opp_o,
            "result_text": result,
            "is_csk_win": win,
            "cricclubs_url": PORTAL + mid,
            "scorecard": {"innings": innings} if innings else None,
        })

    out.sort(key=lambda m: (m["date"], m["time"]), reverse=True)
    OUT.write_text(json.dumps(out, indent=2, ensure_ascii=False) + "\n")
    (OUT.parent / "fixtures-meta.json").write_text(json.dumps(
        {"updated_at": datetime.now().strftime("%Y-%m-%d"),
         "source": "https://cricclubs.com/CaymanCricketAssociation"}, indent=2) + "\n")
    wins = sum(1 for m in out if m["is_csk_win"] is True)
    losses = sum(1 for m in out if m["is_csk_win"] is False)
    print(f"wrote {len(out)} matches ({wins} won, {losses} lost, "
          f"{len(out) - wins - losses} no result); "
          f"{sum(1 for m in out if m['scorecard'])} with scorecards")


if __name__ == "__main__":
    main(*sys.argv[1:])
