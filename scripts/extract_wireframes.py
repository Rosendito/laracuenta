"""Render each page of a PDF to PNG and dump its text, so the wireframes can be
reviewed without loading the whole PDF into context.

Usage: python scripts/extract_wireframes.py [pdf] [out_dir] [dpi] [--pages]

--pages also renders full-page PNGs (the embedded mockups are always extracted).
"""
import sys
from pathlib import Path

import pymupdf

pdf = Path(sys.argv[1] if len(sys.argv) > 1 else "wireframes.pdf")
out = Path(sys.argv[2] if len(sys.argv) > 2 else "docs/wireframes/pages")
dpi = int(sys.argv[3]) if len(sys.argv) > 3 and sys.argv[3].isdigit() else 110
out.mkdir(parents=True, exist_ok=True)

doc = pymupdf.open(pdf)
for i, page in enumerate(doc, start=1):
    if "--pages" in sys.argv:
        page.get_pixmap(dpi=dpi).save(out / f"page-{i:02d}.png")
    (out / f"page-{i:02d}.txt").write_text(page.get_text(), encoding="utf-8")
print(f"{doc.page_count} pages -> {out}")

# Embedded raster images (the actual wireframe mockups) at native resolution.
img_dir = out.parent / "images"
img_dir.mkdir(parents=True, exist_ok=True)
for i, page in enumerate(doc, start=1):
    for n, img in enumerate(page.get_images(full=True), start=1):
        pix = pymupdf.Pixmap(doc, img[0])
        if pix.n - pix.alpha >= 4:
            pix = pymupdf.Pixmap(pymupdf.csRGB, pix)
        pix.save(img_dir / f"page-{i:02d}-img-{n}.png")
