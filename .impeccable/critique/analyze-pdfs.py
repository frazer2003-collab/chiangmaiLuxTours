"""Assessment B: evidence-only PDF critique measurements."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

import fitz
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
CRITIQUE_DIR = ROOT / ".impeccable" / "critique"
CROP_DIR = CRITIQUE_DIR / "crops"
TRANSPARENT_LOGO = ROOT / "editable" / "assets" / "mekong-transfer-logo-transparent.png"

PDFS = [
    "Mekong ALISDA Schedule.pdf",
    "Mekong Poster ChiangKhong.pdf",
    "Mekong Poster ChiangMai.pdf",
    "Mekong Poster ChiangRai.pdf",
    "Mekong Poster HuayXai.pdf",
]

PHONE_RE = re.compile(
    r"(\+|66|\(0\)|442|5645|996|9434|9528|61|62|95|102|\d{3,4})"
)


def rgb_from_span(span: dict) -> list[int] | None:
    color = span.get("color")
    if color is None:
        return None
    if isinstance(color, int):
        r = (color >> 16) & 255
        g = (color >> 8) & 255
        b = color & 255
        return [r, g, b]
    if isinstance(color, (list, tuple)) and len(color) >= 3:
        vals = []
        for c in color[:3]:
            vals.append(int(round(c * 255)) if c <= 1 else int(round(c)))
        return vals
    return None


def is_phone_span(text: str) -> bool:
    t = text.strip()
    if not t:
        return False
    if t == "+":
        return True
    if "66" in t or "442" in t or "5645" in t or "996" in t or "9434" in t or "9528" in t:
        return True
    if "(0)" in t:
        return True
    return False


def extract_phone_spans(page: fitz.Page) -> list[dict]:
    spans_out: list[dict] = []
    for block in page.get_text("dict")["blocks"]:
        if block.get("type") != 0:
            continue
        for line in block.get("lines", []):
            line_text = "".join(s["text"] for s in line["spans"])
            if not any(
                k in line_text
                for k in ("66", "442", "5645", "996", "9434", "9528", "+")
            ):
                continue
            for span in line["spans"]:
                if not is_phone_span(span["text"]):
                    continue
                font = span.get("font", "")
                spans_out.append(
                    {
                        "text": span["text"],
                        "font": font,
                        "size_pt": round(span.get("size", 0), 3),
                        "color_rgb": rgb_from_span(span),
                        "bbox_pt": [round(x, 2) for x in span["bbox"]],
                        "is_helvetica": "helvetica" in font.lower() or font.lower() in ("helv", "helv-bold"),
                        "is_type3": "type3" in font.lower() or font.startswith("g_d") or "unnamed" in font.lower(),
                    }
                )
    return spans_out


def extract_logo_images(page: fitz.Page) -> list[dict]:
    logos: list[dict] = []
    xref_map: dict[int, dict] = {}
    for info in page.get_image_info(xrefs=True):
        xref = info.get("xref")
        if xref is None:
            continue
        x0, y0, x1, y1 = info["bbox"]
        w, h = x1 - x0, y1 - y0
        if w <= 0 or h <= 0:
            continue
        ratio = max(w, h) / min(w, h)
        px_w = info.get("width") or 0
        px_h = info.get("height") or 0
        # Logo candidates: roughly square, >=1000px source, >=40pt display
        if ratio < 1.35 and min(px_w, px_h) >= 900 and min(w, h) >= 35:
            try:
                rects = page.get_image_rects(xref)
                positions = [[round(r.x0, 2), round(r.y0, 2), round(r.x1, 2), round(r.y1, 2)] for r in rects]
            except ValueError:
                positions = [[round(x0, 2), round(y0, 2), round(x1, 2), round(y1, 2)]]
            entry = {
                "xref": xref,
                "width_px": px_w,
                "height_px": px_h,
                "instance_count": len(positions),
                "positions_pt": positions,
                "width_pt_per_instance": [round(p[2] - p[0], 2) for p in positions],
                "height_pt_per_instance": [round(p[3] - p[1], 2) for p in positions],
            }
            xref_map[xref] = entry
    return list(xref_map.values())


def phone_format_from_spans(spans: list[dict]) -> str:
    """Reconstruct phone line text from spans sorted left-to-right on same baseline."""
    if not spans:
        return ""
    # Group by approximate y0
    lines: dict[int, list[dict]] = {}
    for s in spans:
        y_key = int(round(s["bbox_pt"][1] / 2) * 2)
        lines.setdefault(y_key, []).append(s)
    parts = []
    for y_key in sorted(lines.keys()):
        line_spans = sorted(lines[y_key], key=lambda s: s["bbox_pt"][0])
        text = "".join(s["text"] for s in line_spans)
        if "66" in text or "+" in text:
            parts.append(text.strip())
    return " | ".join(parts)


def analyze_pdf(pdf_path: Path) -> dict:
    doc = fitz.open(pdf_path)
    try:
        page = doc[0]
        phone_spans = extract_phone_spans(page)
        logos = extract_logo_images(page)
        return {
            "path": str(pdf_path.relative_to(ROOT)).replace("\\", "/"),
            "phone_spans": phone_spans,
            "phone_format_reconstructed": phone_format_from_spans(phone_spans),
            "logo_images": logos,
        }
    finally:
        doc.close()


def render_crops(pdf_path: Path, analysis: dict, label: str) -> list[str]:
    CROP_DIR.mkdir(parents=True, exist_ok=True)
    saved: list[str] = []
    doc = fitz.open(pdf_path)
    try:
        page = doc[0]
        stem = pdf_path.stem.replace(" ", "-")
        # Phone crop: union of phone span bboxes
        phone_spans = analysis["phone_spans"]
        if phone_spans:
            xs = [s["bbox_pt"][0] for s in phone_spans] + [s["bbox_pt"][2] for s in phone_spans]
            ys = [s["bbox_pt"][1] for s in phone_spans] + [s["bbox_pt"][3] for s in phone_spans]
            rect = fitz.Rect(min(xs) - 20, min(ys) - 30, max(xs) + 20, max(ys) + 30)
            rect = rect & page.rect
            pix = page.get_pixmap(matrix=fitz.Matrix(4, 4), clip=rect, alpha=False)
            out = CROP_DIR / f"{stem}-{label}-phones.png"
            pix.save(out)
            saved.append(str(out.relative_to(ROOT)).replace("\\", "/"))

        for li, logo in enumerate(analysis["logo_images"]):
            for pi, pos in enumerate(logo["positions_pt"]):
                rect = fitz.Rect(pos[0] - 10, pos[1] - 10, pos[2] + 10, pos[3] + 10) & page.rect
                pix = page.get_pixmap(matrix=fitz.Matrix(4, 4), clip=rect, alpha=False)
                out = CROP_DIR / f"{stem}-{label}-logo-xref{logo['xref']}-inst{pi}.png"
                pix.save(out)
                saved.append(str(out.relative_to(ROOT)).replace("\\", "/"))
    finally:
        doc.close()
    return saved


def alpha_stats(path: Path) -> dict:
    with Image.open(path) as img:
        arr = np.array(img.convert("RGBA"))
    alpha = arr[:, :, 3]
    rgb = arr[:, :, :3]
    total = alpha.size
    fully_transparent = int((alpha == 0).sum())
    fully_opaque = int((alpha == 255).sum())
    partial = total - fully_transparent - fully_opaque
    # White fringe: high RGB near edges with partial alpha
    edge = (alpha > 0) & (alpha < 255)
    fringe_white = int(((rgb[:, :, 0] > 230) & (rgb[:, :, 1] > 230) & (rgb[:, :, 2] > 230) & edge).sum())
    return {
        "path": str(path.relative_to(ROOT)).replace("\\", "/"),
        "dimensions_px": [int(arr.shape[1]), int(arr.shape[0])],
        "alpha_min": int(alpha.min()),
        "alpha_max": int(alpha.max()),
        "alpha_mean": round(float(alpha.mean()), 2),
        "fully_transparent_pct": round(100 * fully_transparent / total, 2),
        "fully_opaque_pct": round(100 * fully_opaque / total, 2),
        "partial_alpha_pct": round(100 * partial / total, 2),
        "partial_alpha_white_rgb230_count": fringe_white,
        "partial_alpha_white_rgb230_pct_of_partial": round(
            100 * fringe_white / partial, 2
        )
        if partial
        else 0,
    }


def compare_phone_formats(current: dict, original: dict) -> dict:
    cur_fmt = current["phone_format_reconstructed"]
    orig_fmt = original["phone_format_reconstructed"]
    cur_spans = current["phone_spans"]
    orig_spans = original["phone_spans"]

    # Detect replaced-number spans (996/9434) font family
    replaced_spans = [s for s in cur_spans if "996" in s["text"] or "9434" in s["text"] or "(0) 62" in s["text"]]
    orig_old_spans = [s for s in orig_spans if "442" in s["text"] or "5645" in s["text"] or "61 442" in s["text"]]

    return {
        "current_format": cur_fmt,
        "original_format": orig_fmt,
        "format_string_match": cur_fmt == orig_fmt,
        "has_paren_zero_current": "(0)" in cur_fmt,
        "has_paren_zero_original": "(0)" in orig_fmt,
        "replaced_number_spans": replaced_spans,
        "original_old_number_spans": orig_old_spans,
        "replaced_uses_helvetica": all(s["is_helvetica"] for s in replaced_spans) if replaced_spans else None,
        "original_old_uses_type3": all(s["is_type3"] or not s["is_helvetica"] for s in orig_old_spans)
        if orig_old_spans
        else None,
    }


def logo_placement_diff(current_logos: list[dict]) -> list[dict]:
    diffs = []
    for logo in current_logos:
        if logo["instance_count"] < 2:
            continue
        w_pts = logo["width_pt_per_instance"]
        h_pts = logo["height_pt_per_instance"]
        diffs.append(
            {
                "xref": logo["xref"],
                "instance_count": logo["instance_count"],
                "width_pt": w_pts,
                "height_pt": h_pts,
                "width_pt_delta": round(max(w_pts) - min(w_pts), 3) if w_pts else 0,
                "height_pt_delta": round(max(h_pts) - min(h_pts), 3) if h_pts else 0,
                "positions_pt": logo["positions_pt"],
            }
        )
    return diffs


def main() -> None:
    CRITIQUE_DIR.mkdir(parents=True, exist_ok=True)
    report: dict = {
        "detector_cli": {},
        "pdfs": {},
        "comparisons": {},
        "logo_placement_diffs": {},
        "alpha_stats": {},
        "crops": [],
        "mismatches": [],
        "skipped": [],
    }

    for pdf_name in PDFS:
        current_path = ROOT / pdf_name
        original_path = ROOT / "editable" / "originals" / pdf_name
        cur = analyze_pdf(current_path)
        orig = analyze_pdf(original_path)
        report["pdfs"][pdf_name] = {"current": cur, "original": orig}
        report["comparisons"][pdf_name] = compare_phone_formats(cur, orig)
        report["logo_placement_diffs"][pdf_name] = logo_placement_diff(cur["logo_images"])
        report["crops"].extend(render_crops(current_path, cur, "current"))
        report["crops"].extend(render_crops(original_path, orig, "original"))

    if TRANSPARENT_LOGO.exists():
        report["alpha_stats"] = alpha_stats(TRANSPARENT_LOGO)
    else:
        report["skipped"].append(
            {"step": "alpha_stats", "reason": f"File not found: {TRANSPARENT_LOGO}"}
        )

    # Build mismatch list
    for pdf_name in PDFS:
        cmp = report["comparisons"][pdf_name]
        is_poster = "Poster" in pdf_name
        is_schedule = "Schedule" in pdf_name

        if is_poster and not cmp["has_paren_zero_current"]:
            report["mismatches"].append(
                f"{pdf_name}: poster missing (0) in current phone format: {cmp['current_format']}"
            )
        if is_schedule and cmp["has_paren_zero_current"]:
            report["mismatches"].append(
                f"{pdf_name}: schedule has (0) in current format (posters use it): {cmp['current_format']}"
            )
        if is_poster and is_schedule:
            pass
        # Cross-doc format: compare poster vs schedule
        if cmp["replaced_uses_helvetica"] is True:
            report["mismatches"].append(
                f"{pdf_name}: replaced phone spans use Helvetica (not original Type3)"
            )
        elif cmp["replaced_uses_helvetica"] is False:
            report["mismatches"].append(
                f"{pdf_name}: replaced phone spans do NOT all use Helvetica"
            )

        for diff in report["logo_placement_diffs"][pdf_name]:
            if diff["width_pt_delta"] > 0.5 or diff["height_pt_delta"] > 0.5:
                report["mismatches"].append(
                    f"{pdf_name}: logo xref {diff['xref']} size differs across placements "
                    f"width_delta={diff['width_pt_delta']}pt height_delta={diff['height_pt_delta']}pt"
                )

    # Poster vs schedule format cross-check
    poster_fmt = next(
        v["current"]["phone_format_reconstructed"]
        for k, v in report["pdfs"].items()
        if "Poster" in k
    )
    sched_fmt = report["pdfs"]["Mekong ALISDA Schedule.pdf"]["current"]["phone_format_reconstructed"]
    if "(0)" in poster_fmt and "(0)" not in sched_fmt:
        report["mismatches"].append(
            f"Cross-doc: posters use +66 (0) XX format; schedule uses +66 XX without (0). "
            f"Poster sample: {poster_fmt[:80]}... | Schedule: {sched_fmt[:80]}..."
        )

    if report["alpha_stats"].get("partial_alpha_white_rgb230_pct_of_partial", 0) > 5:
        report["mismatches"].append(
            f"Logo transparent PNG: {report['alpha_stats']['partial_alpha_white_rgb230_pct_of_partial']}% "
            f"of partial-alpha pixels are near-white (RGB>230) — possible white fringe"
        )

    out_json = CRITIQUE_DIR / "assessment-b-report.json"
    out_json.write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
