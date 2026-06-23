#!/usr/bin/env python3
"""Render a markdown file to PDF using the reformat-default template,
but with raw HTML enabled (so we can inject <a id="..."> anchors on
headings ourselves instead of relying on the markdown parser).

Pipeline:
  source.md → markdown-it (html:True) → inject id on <h1>/<h2>/<h3>
             → wrap in reformat-default skeleton.html
             → render_html.cjs → output.pdf

The skeleton is read from the skill's templates directory.
"""
import argparse
import json
import os
import re
import subprocess
import sys
import tempfile
from pathlib import Path

from markdown_it import MarkdownIt


def _discover_skill_root() -> Path:
    """Locate the builtin-skills/pdf install.

    Resolution order:
      1. `BUILTIN_SKILLS_PDF` env var (explicit override wins).
      2. Among all `~/.<dir>/.builtin-skills/pdf` installs on disk,
         prefer the one whose sibling `bin/` is on $PATH — that's
         the active agent runtime on the host. Falls back to
         alphabetically first if none match.
      3. `~/builtin-skills/pdf` as a final direct fallback.

    No agent name is hardcoded — the script discovers the active
    install by inspecting $PATH, so it works whichever agent the
    user has active.
    """
    env = os.environ.get("BUILTIN_SKILLS_PDF")
    if env:
        return Path(env)
    home = Path.home()
    candidates = sorted(home.glob(".*/.builtin-skills/pdf"))
    if candidates:
        path_entries = os.environ.get("PATH", "").split(":")
        for c in candidates:
            # Each candidate lives at ~/.<dotdir>/.builtin-skills/pdf.
            # The dotdir's `bin/` being on PATH marks it as the active
            # agent's install. If found, prefer it; otherwise fall
            # through to the alphabetical default.
            dotdir_bin = c.parents[1] / "bin"
            if str(dotdir_bin) in path_entries:
                return c
        return candidates[0]
    return home / "builtin-skills" / "pdf"


SLUG_PLACEHOLDER = "emdashplaceholder"


def slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r"\s*\u2014\s*", SLUG_PLACEHOLDER, text)
    text = re.sub(r"<[^>]+>", "", text)  # drop any HTML inside the heading text
    text = re.sub(r"[^\w\s-]", "", text, flags=re.UNICODE)
    text = re.sub(r"\s+", "-", text)
    text = re.sub(r"-+", "-", text)
    text = text.replace(SLUG_PLACEHOLDER, "--")
    return text.strip("-")


def add_heading_ids(html: str) -> tuple[str, list[str]]:
    """Add id="<slug>" to <h1>/<h2>/<h3> tags. Returns (html, list_of_ids).
    Disambiguates duplicates by appending -2, -3, ...
    """
    seen: dict[str, int] = {}
    ids: list[str] = []

    def repl(m: re.Match) -> str:
        level = m.group(1)
        inner = m.group(2)
        # Extract text only for slug (drop any nested tags)
        text = re.sub(r"<[^>]+>", "", inner).strip()
        slug = slugify(text) or "section"
        n = seen.get(slug, 0) + 1
        seen[slug] = n
        if n > 1:
            slug = f"{slug}-{n}"
        ids.append(slug)
        return f'<h{level} id="{slug}">{inner}</h{level}>'

    out = re.sub(r'<h([1-3])[^>]*>(.*?)</h\1>', repl, html, flags=re.S)
    return out, ids


def render_md_to_html(md_text: str) -> tuple[str, str, list[str]]:
    """Returns (title, body_html, all_heading_ids)."""
    md = MarkdownIt("commonmark", {"breaks": False, "html": True, "linkify": True})
    md.enable("table").enable("strikethrough")
    full_html = md.render(md_text)

    # Title lift: first <h1> becomes the cover title (matches reformat_parse.py).
    m = re.match(r"\s*<h1[^>]*>(.*?)</h1>\s*", full_html, flags=re.S | re.I)
    if m:
        title = re.sub(r"<[^>]+>", "", m.group(1)).strip()
        body = full_html[m.end():]
    else:
        first_line = md_text.split("\n", 1)[0].lstrip("# ").strip()
        title = first_line or "Document"
        body = full_html

    body, ids = add_heading_ids(body)
    return title, body, ids


def build_page_html(title: str, subtitle: str, author: str, date: str,
                    accent: str, body_html: str, skeleton: str) -> str:
    page = skeleton
    # Match the placeholder shape used by reformat_parse.py — it leaves the
    # raw {{TITLE}} etc. tokens in the skeleton for string replacement.
    replacements = {
        "{{TITLE}}": title,
        "{{SUBTITLE}}": subtitle,
        "{{AUTHOR}}": author,
        "{{DATE}}": date,
        "{{ACCENT}}": accent,
        "{{BODY_HTML}}": body_html,
    }
    # The actual placeholders are HTML comments — reformat_parse.py uses string
    # replace on <!-- TITLE -->, etc. See skill's reformat_parse.py for canonical.
    replacements = {
        "<!-- TITLE -->": title,
        "<!-- SUBTITLE -->": subtitle,
        "<!-- AUTHOR -->": author,
        "<!-- DATE -->": date,
        "<!-- ACCENT -->": accent,
        "<!-- BODY_HTML -->": body_html,
    }
    for k, v in replacements.items():
        page = page.replace(k, v)
    return page


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--input", required=True, type=Path)
    ap.add_argument("--out", required=True, type=Path)
    ap.add_argument("--title", default="")
    ap.add_argument("--subtitle", default="")
    ap.add_argument("--author", default="")
    ap.add_argument("--date", default="")
    ap.add_argument("--accent", default="#1d4ed8")
    ap.add_argument("--skill-root", type=Path,
                    default=_discover_skill_root())
    args = ap.parse_args()

    md_text = args.input.read_text(encoding="utf-8")
    title, body, ids = render_md_to_html(md_text)
    if args.title:
        title = args.title

    skeleton_path = args.skill_root / "templates" / "reformat-default" / "skeleton.html"
    skeleton = skeleton_path.read_text(encoding="utf-8")
    page_html = build_page_html(title, args.subtitle, args.author, args.date,
                                args.accent, body, skeleton)

    with tempfile.NamedTemporaryFile("w", suffix=".html", delete=False,
                                     encoding="utf-8") as f:
        f.write(page_html)
        tmp_html = Path(f.name)

    try:
        cmd = [
            "node", str(args.skill_root / "scripts" / "render_html.cjs"),
            "--in", str(tmp_html),
            "--out", str(args.out),
            "--format", "A4",
            "--margin", "14mm 12mm",
        ]
        r = subprocess.run(cmd, capture_output=True, text=True)
        sys.stdout.write(r.stdout)
        sys.stderr.write(r.stderr)
        if r.returncode != 0:
            return r.returncode
    finally:
        tmp_html.unlink(missing_ok=True)

    print(json.dumps({
        "status": "ok",
        "out": str(args.out),
        "title": title,
        "headings_with_ids": len(ids),
    }))
    return 0


if __name__ == "__main__":
    sys.exit(main())
