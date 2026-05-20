#!/usr/bin/env python3
"""Build src/data/plateImages.js from jonkeegan/us-license-plates CSV."""
import csv
import json
import re
from collections import defaultdict
from urllib.parse import quote

CSV_URL = "https://raw.githubusercontent.com/jonkeegan/us-license-plates/main/us-license-plates.csv"
OUT = "src/data/plateImages.js"
STATES_50 = "AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY".split()

# Curated standard-issue plates where CSV heuristics pick specialty plates
MANUAL = {
    "AR": "passenger.jpg",
    "CT": "passenger-plate.jpg",
    "DE": "Sample.jpg",
    "GA": "passenger-plate.jpg",
    "IL": "passenger-plate.jpg",
    "LA": "license-plate.jpg",
    "ME": "passenger-plate.jpg",
    "MD": "passenger-plate.jpg",
    "MI": "passenger-plate.jpg",
    "MS": "passenger-plate.jpg",
    "MT": "standard-plate.jpg",
    "NE": "standard-plate.jpg",
    "NY": "excelsior_embossed_plate_3d_master.jpg",
    "TX": "lone-star-texas.png",
}

SKIP_TITLE = re.compile(
    r"motorcycle|dealer|disabled|veteran|military|collegiate|university|fraternal|"
    r"firefighter|police|ambulance|historic|antique|personalized|temporary|apportioned|"
    r"truck|trailer|fleet|government|exempt|ham radio|amateur|prisoner|purple heart|"
    r"gold star|memorial|breast|cancer|awareness|wildlife|salmon|baseball|basketball|"
    r"football|share the|buffalo bills|airborne|brigade|infantry|armored|medal|"
    r"association|foundation|trust|4-h|4h|scouts|legion|amvets|autism|donor|"
    r"standardbred|owners assn|rice|agricultur|veteran|valor|bronze|silver star",
    re.I,
)


def score(row):
    t = row["plate_title"]
    fn = row["plate_img"].lower()
    if SKIP_TITLE.search(t):
        return -1000
    s = 0
    if re.match(r"^Standard\b", t, re.I):
        s += 300
    elif re.search(r"\bstandard\b", t, re.I) and "standardbred" not in t.lower():
        s += 150
    if re.search(r"passenger", t, re.I) or re.search(r"passenger", fn):
        s += 120
    if "sample" in fn or "sample" in t.lower():
        s += 80
    if re.search(r"graphic|sequential|classic", t, re.I):
        s += 40
    if fn.endswith((".jpg", ".jpeg", ".png")):
        s += 10
    if fn.endswith(".gif"):
        s -= 5
    return s


def url(state, filename):
    return (
        "https://raw.githubusercontent.com/jonkeegan/us-license-plates/main/plates/"
        f"{state}/{quote(filename)}"
    )


def main():
    import os
    import sys
    import urllib.request

    local = os.environ.get("PLATES_CSV", "/tmp/plates.csv")
    if os.path.isfile(local):
        with open(local) as f:
            rows = list(csv.DictReader(f))
    else:
        try:
            with urllib.request.urlopen(CSV_URL) as resp:
                rows = list(csv.DictReader(resp.read().decode().splitlines()))
        except Exception as e:
            print(f"Download failed ({e}). Run: curl -sL {CSV_URL} -o /tmp/plates.csv", file=sys.stderr)
            sys.exit(1)

    by_state = defaultdict(list)
    for row in rows:
        by_state[row["state"]].append(row)

    images = {}
    for st in STATES_50:
        if st in MANUAL:
            images[st] = url(st, MANUAL[st])
            continue
        state_rows = by_state.get(st, [])
        if not state_rows:
            continue
        best = max(state_rows, key=score)
        if score(best) < 0:
            best = state_rows[0]
        images[st] = url(st, best["plate_img"])

    # RI: prefer Passenger Plates entry
    for row in by_state.get("RI", []):
        if "passenger" in row["plate_title"].lower():
            images["RI"] = url("RI", row["plate_img"])
            break

    with open(OUT, "w") as f:
        f.write(
            "/** Standard-issue plate images (Beautiful Public Data / jonkeegan). */\n"
            "export const PLATE_IMAGES = "
        )
        json.dump(images, f, indent=2)
        f.write(
            ";\n\nexport function getPlateImageUrl(code) {\n"
            "  return PLATE_IMAGES[code] ?? null;\n}\n"
        )
    print(f"Wrote {len(images)} plate URLs to {OUT}")


if __name__ == "__main__":
    main()
