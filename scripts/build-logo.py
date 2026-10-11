"""Build the Lara Cuenta isotype and full logo as clean, font-independent SVGs.

Outputs (written to public/):
  laracuenta-isotipo.svg  the speech-bubble mark on its own
  laracuenta-logo.svg     wordmark + mark; the bubble's lower left is bitten
                          away like an apple: its left side drops beside the
                          "t" of "Cuenta", levels off over the final "a" and
                          curves down into the tail

Text is converted to outlines from DM Serif Display (SIL OFL). The font ships
a single weight, so the heavier look of the brand mockup is reproduced with a
same-colour outline stroke (a synthetic bold, as design tools apply it).

The mark is drawn in "isotype space": pixel coordinates measured on the
450x406 isotype mockup. All separations are real transparent gaps (masks),
so both files work on any background.

Usage: python scripts/build-logo.py <path-to-DMSerifDisplay-Regular.ttf>
(needs fontTools: pip install -r scripts/requirements.txt)
"""

import math
import sys
from pathlib import Path

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.recordingPen import RecordingPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

OUT_DIR = Path(__file__).resolve().parent.parent / "public"

COLORS = {
    "text": "#422818",
    "orange": "#CF7739",
    "sun": "#EEB33F",
    "terracotta": "#BD6A42",
    "brown": "#54331C",
}

# --- Isotype geometry (isotype space) ---------------------------------------
BUBBLE = (194, 164, 156, 140)  # ellipse cx, cy, rx, ry
SUN = (212, 146, 51)  # cx, cy, r
TAIL = ((186, 290), (190, 346), (232, 298))  # left root, tip, right root
GAP = 8  # width of the transparent separations
ISO_BOX = (28, 14, 336, 342)  # x, y, w, h

# Top edge of the terracotta hill (left to right, dives under the brown hill).
W1 = "M20,196 C60,172 100,158 140,158 C180,158 215,172 240,192 L270,220"
# Top edge of the brown hill (left to right).
W2 = "M30,252 C90,250 130,240 165,228 C215,208 260,186 360,174"

# --- Wordmark ----------------------------------------------------------------
CAP_HEIGHT = 150
BOLD = 0.048 * CAP_HEIGHT  # synthetic bold stroke width
TRACKING_EM = -0.012
LINE_GAP = 1.13 * CAP_HEIGHT  # baseline to baseline
HALO = 16  # minimum clearance between the letters and the mark

# Mark placement (measured on the full-logo mockup): iso-space -> logo units
# and the height of the bubble. Horizontally the bubble's left side sits just
# right of the top of the "t", so the cut can drop beside it.
ISO_SCALE = 1.385
BUBBLE_GAP_FROM_T = 0  # extra room between the top of the "t" and the bubble
BUBBLE_TOP_ABOVE_BASELINE = 419  # baseline minus top of the bubble

# The cut: everything below one smooth edge is removed from the mark, like the
# bite of an apple. The edge has two quarters that meet, level, just above
# the "a":
#   upper quarter  leaves the bubble outline at CUT_START along the outline's
#                  own direction and keeps dropping, almost straight down
#                  beside the "t", before it rounds off to level;
#   lower quarter  runs over the "a" and curves down into the tip of the tail.
# The level stretch is raised just enough to keep HALO away from the letters.
CUT_START = 190  # where the edge leaves the bubble outline (degrees, y up)
CORNER = 48  # horizontal run of the upper quarter's turn (smaller = lower, tighter)
UPPER_ROUND = 0.75  # control point reach in the upper quarter (higher = squarer)
LOWER_ROUND = (1.0, 0.4)  # lower quarter reach: level over the "a", then the drop
TAIL_TIP = (40, 52)  # tail tip relative to (right edge of the "a", baseline)


def fmt(v):
    return f"{v:.2f}".rstrip("0").rstrip(".")


def iso_defs(prefix, tail=None):
    cx, cy, rx, ry = BUBBLE
    sx, sy, sr = SUN
    (lx, ly), (tx, ty), (rtx, rty) = TAIL
    p = prefix
    above = lambda d, y_end: f"{d} L380,{y_end} L380,0 L0,0 L0,{d.split()[0].split(',')[1]} Z"  # noqa: E731
    return f"""
    <clipPath id="{p}-shape">
      <ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}"/>
      {tail or f'<path d="M{lx},{ly} L{tx},{ty} C{tx + 8},{ty - 14} {rtx - 14},{rty + 14} {rtx},{rty} Z"/>'}
    </clipPath>
    <clipPath id="{p}-above-w1"><path d="{above(W1, 220)}"/></clipPath>
    <clipPath id="{p}-above-w2"><path d="{above(W2, 174)}"/></clipPath>
    <mask id="{p}-gaps" maskUnits="userSpaceOnUse" x="0" y="0" width="400" height="400">
      <rect width="400" height="400" fill="#fff"/>
      <g fill="none" stroke="#000" stroke-width="{GAP}" stroke-linecap="round">
        <circle cx="{sx}" cy="{sy}" r="{sr + GAP / 2}" clip-path="url(#{p}-above-w1)"/>
        <path d="{W1}" clip-path="url(#{p}-above-w2)"/>
        <path d="{W2}"/>
      </g>
    </mask>"""


def iso_body(prefix):
    cx, cy, rx, ry = BUBBLE
    sx, sy, sr = SUN
    c = COLORS
    p = prefix
    return f"""
    <g mask="url(#{p}-gaps)">
      <g clip-path="url(#{p}-shape)">
        <rect x="{cx - rx - 10}" y="{cy - ry - 10}" width="{2 * rx + 20}" height="{2 * ry + 60}" fill="{c['orange']}"/>
        <circle cx="{sx}" cy="{sy}" r="{sr}" fill="{c['sun']}"/>
        <path d="{W1} L270,400 L20,400 Z" fill="{c['terracotta']}"/>
        <path d="{W2} L360,400 L30,400 Z" fill="{c['brown']}"/>
      </g>
    </g>"""


def set_line(font, text, x, baseline, scale):
    """Return (svg path, bounds of the last glyph, outline points of each glyph) for `text`."""
    cmap = font.getBestCmap()
    glyph_set = font.getGlyphSet()
    hmtx = font["hmtx"]
    upm = font["head"].unitsPerEm
    pen = SVGPathPen(glyph_set, ntos=fmt)
    cursor = 0.0
    last_bounds = None
    outlines = []
    for ch in text:
        name = cmap[ord(ch)]
        ox = x + cursor * scale
        glyph_set[name].draw(TransformPen(pen, (scale, 0, 0, -scale, ox, baseline)))
        bp = BoundsPen(glyph_set)
        glyph_set[name].draw(bp)
        xmin, ymin, xmax, ymax = bp.bounds
        last_bounds = (ox + xmin * scale, baseline - ymax * scale, ox + xmax * scale, baseline - ymin * scale)
        rec = RecordingPen()
        glyph_set[name].draw(rec)
        outlines.append([(ox + px * scale, baseline - py * scale) for _, pts in rec.value for px, py in pts])
        cursor += hmtx[name][0] + TRACKING_EM * upm
    return pen.getCommands(), last_bounds, outlines


def sigmoid_segment(p0, p1, steepness, center, steps=60):
    """Points from p0 to p1 along a logistic curve, flat at both ends."""
    sig = lambda u: 1 / (1 + math.exp(-steepness * (u - center)))  # noqa: E731
    lo, hi = sig(0), sig(1)
    return [
        (p0[0] + (p1[0] - p0[0]) * u, p0[1] + (p1[1] - p0[1]) * (sig(u) - lo) / (hi - lo))
        for u in (i / steps for i in range(steps + 1))
    ]


def cubic_segment(p0, c1, c2, p1, steps=40):
    """Points along a cubic Bezier curve."""
    return [
        tuple((1 - u) ** 3 * a + 3 * (1 - u) ** 2 * u * b + 3 * (1 - u) * u**2 * c + u**3 * d for a, b, c, d in zip(p0, c1, c2, p1))
        for u in (i / steps for i in range(steps + 1))
    ]


def cut_edge(start, direction, level_y, tip):
    """The cut's edge: the upper quarter from `start` down to level at `level_y`, then the lower quarter into `tip`."""
    knee = (start[0] + CORNER, level_y)
    h, w = knee[1] - start[1], knee[0] - start[0]
    upper = cubic_segment(
        start, (start[0] + direction[0] * UPPER_ROUND * h, start[1] + direction[1] * UPPER_ROUND * h),
        (knee[0] - UPPER_ROUND * w, knee[1]), knee, steps=80,
    )
    w2, h2 = tip[0] - knee[0], tip[1] - knee[1]
    lower = cubic_segment(
        knee, (knee[0] + LOWER_ROUND[0] * w2, knee[1]), (tip[0], tip[1] - LOWER_ROUND[1] * h2), tip, steps=80,
    )
    return upper + lower[1:]


def dist_to_polyline(p, line):
    """Shortest distance from point `p` to a polyline."""
    best = math.inf
    for (x1, y1), (x2, y2) in zip(line, line[1:]):
        dx, dy = x2 - x1, y2 - y1
        u = max(0.0, min(1.0, ((p[0] - x1) * dx + (p[1] - y1) * dy) / (dx * dx + dy * dy or 1)))
        best = min(best, math.hypot(p[0] - x1 - u * dx, p[1] - y1 - u * dy))
    return best


def build_isotype():
    x, y, w, h = ISO_BOX
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x} {y} {w} {h}" role="img" aria-labelledby="lci-title">
  <title id="lci-title">Lara Cuenta</title>
  <defs>{iso_defs("lci")}
  </defs>{iso_body("lci")}
</svg>
"""
    out = OUT_DIR / "laracuenta-isotipo.svg"
    out.write_text(svg)
    print("wrote", out)


def build_logo(font):
    scale = CAP_HEIGHT / font["OS/2"].sCapHeight
    x0 = 60
    cuenta_baseline = 470
    lara_baseline = cuenta_baseline - LINE_GAP
    lara, _, _ = set_line(font, "Lara", x0, lara_baseline, scale)
    cuenta, a_bounds, outlines = set_line(font, "Cuenta", x0, cuenta_baseline, scale)

    cx, cy, rx, ry = BUBBLE
    s = ISO_SCALE
    a_right = a_bounds[2] + BOLD / 2
    a_top = min(y for _, y in outlines[-1]) - BOLD / 2
    tip = (a_right + TAIL_TIP[0], cuenta_baseline + TAIL_TIP[1])
    clear = HALO + BOLD / 2
    t_right = max(x for x, y in outlines[-2] if y < a_top) + BOLD / 2  # right edge of the stem top
    tx = t_right + clear + BUBBLE_GAP_FROM_T - (cx - rx) * s
    ty = cuenta_baseline - BUBBLE_TOP_ABOVE_BASELINE - (cy - ry) * s

    t0 = math.radians(CUT_START)
    start = (tx + (cx + rx * math.cos(t0)) * s, ty + (cy - ry * math.sin(t0)) * s)
    direction = (-rx * math.sin(t0), -ry * math.cos(t0))  # outline heading, going down
    norm = math.hypot(*direction)
    direction = (direction[0] / norm, direction[1] / norm)

    letters = outlines[-2] + outlines[-1]  # the "t" and the "a"
    level_y = a_top - clear
    for _ in range(100):
        edge = cut_edge(start, direction, level_y, tip)
        gap = min(dist_to_polyline(pt, edge) for pt in letters) - clear
        if gap >= -0.5:
            break
        level_y += gap
    curve = f"M{fmt(edge[0][0])},{fmt(edge[0][1])}" + "".join(f" L{fmt(x)},{fmt(y)}" for x, y in edge[1:])
    far = 600
    cut = (
        f'<path d="{curve} L{fmt(tip[0])},{fmt(tip[1] + far)} L{fmt(start[0] - far)},{fmt(tip[1] + far)} '
        f'L{fmt(start[0] - far)},{fmt(start[1])} Z" fill="#000"/>'
    )

    # The tail: its left edge is the cut itself, its right edge runs from the
    # new tip back up to the original right root. Drawn in logo units and
    # mapped back into isotype space for the clip path.
    (_, _), (_, _), (rtx, rty) = TAIL
    root = (tx + rtx * s, ty + rty * s)
    centre = (tx + cx * s, ty + cy * s)
    tail = (
        f'<path transform="matrix({fmt(1 / s)} 0 0 {fmt(1 / s)} {fmt(-tx / s)} {fmt(-ty / s)})" '
        f'd="{curve} C{fmt(tip[0] + 8 * s)},{fmt(tip[1] - 14 * s)} {fmt(root[0] - 14 * s)},{fmt(root[1] + 14 * s)} '
        f'{fmt(root[0])},{fmt(root[1])} L{fmt(centre[0])},{fmt(centre[1])} Z"/>'
    )

    ix, iy, iw, ih = ISO_BOX
    pad = 20
    vb_x = x0 - pad
    vb_y = min(lara_baseline - CAP_HEIGHT - BOLD, ty + iy * s) - pad
    vb_r = tx + (ix + iw) * s + pad
    vb_b = max(cuenta_baseline + BOLD, ty + (iy + ih) * s) + pad
    c = COLORS
    text_paths = f'<path d="{lara}"/>\n    <path d="{cuenta}"/>'

    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="{fmt(vb_x)} {fmt(vb_y)} {fmt(vb_r - vb_x)} {fmt(vb_b - vb_y)}" role="img" aria-labelledby="lc-title">
  <title id="lc-title">Lara Cuenta</title>
  <defs>{iso_defs("lc", tail)}
    <mask id="lc-cut" maskUnits="userSpaceOnUse" x="{fmt(vb_x)}" y="{fmt(vb_y)}" width="{fmt(vb_r - vb_x)}" height="{fmt(vb_b - vb_y)}">
      <rect x="{fmt(vb_x)}" y="{fmt(vb_y)}" width="{fmt(vb_r - vb_x)}" height="{fmt(vb_b - vb_y)}" fill="#fff"/>
      {cut}
    </mask>
  </defs>
  <g mask="url(#lc-cut)">
    <g transform="translate({fmt(tx)} {fmt(ty)}) scale({fmt(s)})">{iso_body("lc")}
    </g>
  </g>
  <g fill="{c['text']}" stroke="{c['text']}" stroke-width="{fmt(BOLD)}" stroke-linejoin="round">
    {text_paths}
  </g>
</svg>
"""
    out = OUT_DIR / "laracuenta-logo.svg"
    out.write_text(svg)
    print("wrote", out)


if __name__ == "__main__":
    build_isotype()
    build_logo(TTFont(sys.argv[1]))
