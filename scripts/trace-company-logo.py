#!/usr/bin/env python3
"""
Trace the new component shapes (dove + ring) from the supplied PNGs into
a single clean SVG, fill with the company color (#3a6faa), then optimize
with svgo using the project's committed svgo.config.js.

Replaces the previous `trace-company-logo.py` (which operated on the
combined source JPEG). The new component PNGs — bird.png and circle.png
in scripts/.logo-trace/components/ — are the cleaner mark the client
shipped on 2026-06-22.

Pipeline (per component):
  - Bird (filled dove silhouette):
      1. Upscale 2× LANCZOS so potrace has enough curve resolution.
      2. Threshold alpha > 50 to build a binary mask.
      3. potrace with alphamax=1.0 + turdsize=2 (preserve wing-tip
         and tail detail) + opttolerance=0.2.
  - Ring (open thin-stroke circle):
      1. Upscale 2× LANCZOS.
      2. Fit a circle to the ring's pixel coordinates via
         scipy.optimize.least_squares (center + radius + the two tip
         positions at the bottom gap). This is far smaller than a
         potrace trace because the trace would follow both the inner
         AND outer edge of the thin stroke — emitting it as a single
         stroked SVG arc gives us a mathematically sharp, sub-pixel
         accurate ring at ~150 bytes vs ~1,300 for the trace.
      3. Render as an SVG `<path>` with stroke + linecap="butt" so
         the tips land on clean perpendicular caps.

Composition:
  - Compose both into a single 512×512 viewBox SVG. The dove fills
    ~55% of the canvas width and is centered horizontally; the ring
    fills ~92% and is centered slightly below canvas center to leave
    the dove flying above the ring's bottom gap. Matches the reference
    layout from clients/sealed/agape_sealed/new_logo.png.

The y-flip is critical: potrace emits paths in a frame where y
increases UP, wrapped in `transform="translate(0,work_h) scale(1,-1)"`.
We keep that wrapper so svgo's convertPathData bakes the flip into the
coords. Without it the dove renders upside-down.
"""

from __future__ import annotations

import math
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image
from scipy.optimize import least_squares

REPO = Path("/Users/mo/Documents/clients/agape")
COMPONENTS_DIR = REPO / "scripts/.logo-trace/components"
BIRD_SRC = COMPONENTS_DIR / "bird.png"
CIRCLE_SRC = COMPONENTS_DIR / "circle.png"
OUT_SVG = REPO / "public/brand/company-logo.svg"

COMPANY_COLOR = "#3a6faa"
BIRD_UPSCALE = 2          # 2× LANCZOS — keeps the bird path data
                          # compact so the final logo fits the
                          # §3.5.1.8.5 2,048-byte ceiling even with
                          # 1-decimal precision. 3× pushes over budget.
RING_UPSCALE = 2          # ring uses a fitted-circle emit, not a
                          # trace — upscale only matters for the
                          # initial alpha mask used in the circle fit.
CANVAS = 512              # final viewBox — matches previous logo scale
BIRD_TURDSIZE = 2         # preserve bird detail (wing tips, tail)
ALPHAMAX = 1.0            # default — smooth curves + distinct corners
RING_STROKE_PX = 12       # ring stroke width in CANVAS coords —
                          # matches the source ring's perceived weight
                          # at the chosen ring diameter


def load_alpha_mask(path: Path, target_size: tuple[int, int]) -> np.ndarray:
    """Load RGBA PNG, upscale LANCZOS, return uint8 alpha mask (0/1)."""
    im = Image.open(path).convert("RGBA")
    upscaled = im.resize(target_size, Image.LANCZOS)
    a = np.array(upscaled)
    mask = (a[:, :, 3] > 50).astype(np.uint8)
    return mask


def mask_to_pbm(mask: np.ndarray, pbm_path: Path) -> None:
    """Write a P4 binary PBM (potrace's preferred input)."""
    h, w = mask.shape
    pad = (-w) % 8
    padded = np.pad(mask, ((0, 0), (0, pad)), mode="constant", constant_values=0)
    packed = np.packbits(padded, axis=1, bitorder="big")
    header = f"P4\n{w} {h}\n".encode("ascii")
    with open(pbm_path, "wb") as f:
        f.write(header)
        f.write(packed.tobytes())


def run_potrace(pbm: Path, svg: Path, turdsize: int) -> None:
    """Trace with potrace. 1 SVG unit = 1 PBM pixel → paths land at source coords."""
    cmd = [
        "potrace",
        "-s",
        "-o", str(svg),
        "-u", "1",
        "-a", str(ALPHAMAX),
        "-O", "0.2",
        "-t", str(turdsize),
        "-C", COMPANY_COLOR,
        str(pbm),
    ]
    print(f"  potrace: {pbm.name} (turdsize={turdsize}, alphamax={ALPHAMAX})")
    subprocess.run(cmd, check=True)


def extract_potrace_paths(svg_path: Path) -> list[str]:
    """Pull all <path d="..."> strings from potrace's SVG output."""
    text = svg_path.read_text()
    return re.findall(r'<path[^>]*\sd="([^"]+)"', text)


def fit_ring_circle(ring_mask: np.ndarray) -> tuple[float, float, float, tuple[float, float], tuple[float, float]]:
    """Fit a circle to the ring's pixels, then return its center (cx, cy),
    radius r, and the two arc endpoints as (left_tip_xy, right_tip_xy).

    The ring is an open arc with a gap at the bottom. The two endpoints
    are the bottommost pixels of the two descending arms — split by the
    vertical line through the fitted center.
    """
    ys, xs = np.where(ring_mask)

    def residuals(params, x, y):
        cx, cy, r = params
        return np.sqrt((x - cx) ** 2 + (y - cy) ** 2) - r

    bbox_cx = (xs.min() + xs.max()) / 2
    bbox_cy = (ys.min() + ys.max()) / 2
    bbox_r = ((xs.max() - xs.min()) + (ys.max() - ys.min())) / 4
    result = least_squares(residuals, [bbox_cx, bbox_cy, bbox_r], args=(xs, ys))
    cx, cy, r = result.x

    left_mask = ring_mask.copy()
    left_mask[:, int(round(cx)):] = 0
    right_mask = ring_mask.copy()
    right_mask[:, : int(round(cx))] = 0
    ly, lx = np.where(left_mask)
    ry, rx = np.where(right_mask)
    left_tip = (float(lx[np.argmax(ly)]), float(ly.max()))
    right_tip = (float(rx[np.argmax(ry)]), float(ry.max()))

    print(f"  ring fit: center=({cx:.1f}, {cy:.1f}), r={r:.1f}")
    print(f"  ring tips: left={left_tip}, right={right_tip}")
    return cx, cy, r, left_tip, right_tip


def build_ring_arc_d(
    cx: float, cy: float, r: float,
    left_tip: tuple[float, float], right_tip: tuple[float, float],
) -> str:
    """Build the SVG path `d` string for the ring as a stroked arc.

    Tips are re-projected onto the fitted circle (the raw pixel coords
    are slightly inside or outside the perimeter depending on anti-
    aliasing). stroke-linecap="butt" gives flat caps perpendicular to
    the arc tangent — mathematically sharp, no rounding.

    sweep-flag=1: in SVG user space (y down) this is the +angle direction,
    which renders as clockwise on screen. From the lower-left tip, +angle
    goes UP first, then over the top, then down to the lower-right tip —
    exactly the gap-at-bottom arc the source has.
    """
    la = math.atan2(left_tip[1] - cy, left_tip[0] - cx)
    ra = math.atan2(right_tip[1] - cy, right_tip[0] - cx)
    lx = cx + r * math.cos(la)
    ly = cy + r * math.sin(la)
    rx_ = cx + r * math.cos(ra)
    ry_ = cy + r * math.sin(ra)

    span = (ra - la) % (2 * math.pi)
    large_arc = 1 if span > math.pi else 0
    sweep = 1

    return f"M{lx:.2f} {ly:.2f}A{r:.2f} {r:.2f} 0 {large_arc} {sweep} {rx_:.2f} {ry_:.2f}"


def build_layout_transform(
    bbox: tuple[int, int, int, int],
    target_w_frac: float,
    center_x_frac: float,
    center_y_frac: float,
    canvas: int,
) -> tuple[float, float, float]:
    """Build a transform (tx, ty, scale) that places the component's
    bbox center at (center_x_frac, center_y_frac) of the canvas, sized
    so its width fills `target_w_frac` of the canvas width.

    The path coords come out of potrace in work-area frame (y up).
    svgo will bake the y-flip + this transform into the final coords.
    """
    x0, y0, x1, y1 = bbox
    bw = x1 - x0
    bh = y1 - y0
    if bw == 0 or bh == 0:
        raise ValueError(f"empty bbox: {bbox}")

    target_w = canvas * target_w_frac
    scale = target_w / bw

    cx_target = canvas * center_x_frac
    cy_target = canvas * center_y_frac
    scaled_cx = scale * (x0 + bw / 2)
    scaled_cy = scale * (y0 + bh / 2)
    tx = cx_target - scaled_cx
    ty = cy_target - scaled_cy
    return tx, ty, scale


def run_svgo(svg_path: Path) -> None:
    """Optimize using the project's committed svgo.config.js."""
    cmd = ["svgo", "--config", "svgo.config.js", str(svg_path)]
    print(f"  svgo: {svg_path.name}")
    subprocess.run(cmd, check=True, cwd=REPO)


def main() -> None:
    if not shutil.which("potrace"):
        sys.exit("ERROR: potrace not found on PATH")

    print(f"[1/6] Loading + upscaling components…")
    bird_target = (112 * BIRD_UPSCALE, 102 * BIRD_UPSCALE)
    ring_target = (173 * RING_UPSCALE, 161 * RING_UPSCALE)
    bird_mask = load_alpha_mask(BIRD_SRC, bird_target)
    ring_mask = load_alpha_mask(CIRCLE_SRC, ring_target)
    print(f"  bird: mask={bird_mask.shape}, fill={int(bird_mask.sum())} px")
    print(f"  ring: mask={ring_mask.shape}, fill={int(ring_mask.sum())} px")

    print(f"[2/6] Tracing bird with potrace…")
    with tempfile.TemporaryDirectory() as td:
        td = Path(td)
        bird_pbm = td / "bird.pbm"
        bird_raw = td / "bird-raw.svg"
        mask_to_pbm(bird_mask, bird_pbm)
        run_potrace(bird_pbm, bird_raw, turdsize=BIRD_TURDSIZE)
        bird_paths = extract_potrace_paths(bird_raw)
        print(f"  bird paths: {len(bird_paths)}")

    print(f"[3/6] Fitting circle to ring pixels…")
    rcx, rcy, rr, left_tip, right_tip = fit_ring_circle(ring_mask)
    ring_arc_d = build_ring_arc_d(rcx, rcy, rr, left_tip, right_tip)

    print(f"[4/6] Computing layout transforms for {CANVAS}×{CANVAS} canvas…")
    bird_bbox = (0, 0, bird_mask.shape[1], bird_mask.shape[0])

    # Bird: sized to ~55% of canvas (matches reference proportions —
    # the dove takes ~60% of the ring's interior diameter). Positioned
    # slightly above canvas center so the body sits in the upper half
    # of the ring with the tail clearing the bottom gap.
    bird_tx, bird_ty, bird_scale = build_layout_transform(
        bird_bbox, target_w_frac=0.55,
        center_x_frac=0.5, center_y_frac=0.46, canvas=CANVAS,
    )
    print(f"  bird: translate({bird_tx:.1f}, {bird_ty:.1f}) scale({bird_scale:.3f})")

    # Ring: in its own native frame (the fitted circle IS in screen
    # frame already, no y-flip needed). Map its native center+radius
    # into the canvas. The ring's native center is at (rcx, rcy) in
    # the upscaled work frame; we want it at canvas (CANVAS/2,
    # CANVAS/2 + CANVAS*0.05) to leave headroom for the dove above.
    work_to_canvas = (CANVAS * 0.92) / (2 * rr)  # ring outer = 92% of canvas
    canvas_cx = CANVAS / 2
    canvas_cy = CANVAS / 2 + CANVAS * 0.05
    canvas_r = rr * work_to_canvas
    print(f"  ring: center=({canvas_cx:.1f}, {canvas_cy:.1f}), r={canvas_r:.1f}, stroke={RING_STROKE_PX}")

    print(f"[5/6] Assembling final SVG…")
    bird_work_h = bird_mask.shape[0]

    # Bird: potrace output wrapped in y-flip transform (baked by svgo).
    bird_inner = "".join(
        f'<g transform="translate({bird_tx:.1f} {bird_ty:.1f}) scale({bird_scale:.3f})">'
        f'<g transform="translate(0,{bird_work_h}) scale(1,-1)">'
        f'<path d="{d}"/>'
        f'</g>'
        f'</g>'
        for d in bird_paths
    )

    # Ring: stroked arc — already in screen frame, no y-flip needed.
    # Rebuild the arc d string at canvas coordinates with proper precision.
    la = math.atan2(left_tip[1] - rcy, left_tip[0] - rcx)
    ra = math.atan2(right_tip[1] - rcy, right_tip[0] - rcx)
    # Native tip → canvas tip via translate-scale around (rcx, rcy).
    def map_pt(px: float, py: float) -> tuple[float, float]:
        # native -> centered -> scaled -> translated
        nx = px - rcx
        ny = py - rcy
        return (canvas_cx + nx * work_to_canvas, canvas_cy + ny * work_to_canvas)
    lx, ly = map_pt(rcx + rr * math.cos(la), rcy + rr * math.sin(la))
    rx_, ry_ = map_pt(rcx + rr * math.cos(ra), rcy + rr * math.sin(ra))
    span = (ra - la) % (2 * math.pi)
    large_arc = 1 if span > math.pi else 0
    sweep = 1
    canvas_ring_d = f"M{lx:.1f} {ly:.1f}A{canvas_r:.1f} {canvas_r:.1f} 0 {large_arc} {sweep} {rx_:.1f} {ry_:.1f}"

    inner = (
        f'<g fill="{COMPANY_COLOR}" fill-rule="evenodd">{bird_inner}</g>'
        f'<path d="{canvas_ring_d}" fill="none" stroke="{COMPANY_COLOR}" '
        f'stroke-width="{RING_STROKE_PX}" stroke-linecap="butt"/>'
    )
    final = (
        f'<svg xmlns="http://www.w3.org/2000/svg" '
        f'role="img" aria-label="Agape Counseling Services" '
        f'viewBox="0 0 {CANVAS} {CANVAS}">'
        f'{inner}'
        f'</svg>\n'
    )
    OUT_SVG.parent.mkdir(parents=True, exist_ok=True)
    OUT_SVG.write_text(final)

    print(f"[6/6] Optimizing with svgo…")
    run_svgo(OUT_SVG)

    final_text = OUT_SVG.read_text()
    size = len(final_text.encode("utf-8"))
    print(f"\nDone. Wrote {OUT_SVG.relative_to(REPO)} ({size} bytes).")
    print(f"  strict ceiling (DESIGN.md §3.5.1.8.5): 2048 bytes")
    print(f"  status: {'PASS' if size <= 2048 else 'OVER — investigate'}")

    assert f'fill="{COMPANY_COLOR}"' in final_text, "bird color not found in SVG"
    assert f'stroke="{COMPANY_COLOR}"' in final_text, "ring stroke color not found in SVG"
    assert f'viewBox="0 0 {CANVAS} {CANVAS}"' in final_text, "viewBox rewrite failed"
    assert 'fill-rule="evenodd"' in final_text, "fill-rule missing"
    print(f"  fill = {COMPANY_COLOR} ✓ (bird)")
    print(f"  stroke = {COMPANY_COLOR} ✓ (ring)")
    print(f"  viewBox = 0 0 {CANVAS} {CANVAS} ✓")
    print(f"  fill-rule = evenodd ✓")


if __name__ == "__main__":
    main()

