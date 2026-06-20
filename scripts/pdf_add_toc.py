#!/usr/bin/env python3
"""
Post-processor for the pdf skill's REFORMAT route.

The default REFORMAT template does not auto-generate a Table of Contents.
Skill rule #10 requires every multi-page PDF to ship with clickable TOC
navigation. This script reads the intermediate page.html emitted by
`make.sh reformat --keep-html`, stamps stable IDs on every <h2>/<h3> in the
body, and injects a styled <nav class="toc"> block immediately after the
cover.

Usage:
    python3 scripts/pdf_add_toc.py <page.html> [--out page-with-toc.html]
    # then render the output:
    bash /Users/mo/.mavis/.builtin-skills/pdf/scripts/make.sh render \
        --in page-with-toc.html --out final.pdf
"""
from __future__ import annotations

import argparse
import re
import sys
from html import escape
from pathlib import Path


def slugify(text: str, seen: dict[str, int]) -> str:
    """Generate a stable, unique heading slug."""
    base = re.sub(r"[^\w\s-]", "", text.lower())
    base = re.sub(r"\s+", "-", base).strip("-") or "section"
    n = seen.get(base, 0)
    seen[base] = n + 1
    return base if n == 0 else f"{base}-{n}"


def stamp_heading_ids(html: str, seen: dict[str, int]) -> str:
    """Add id="..." to every <h2> and <h3> in the body. Returns new HTML.

    Same scope rule as collect_headings: only stamp IDs inside the visible
    body section, not inside HTML comment blocks.
    """
    body_match = re.search(
        r'(<section\s+class="body"[^>]*>)(.*?)(</section>)',
        html,
        flags=re.S | re.I,
    )
    if not body_match:
        return html

    def repl(m: re.Match) -> str:
        tag = m.group(1)
        attrs = m.group(2) or ""
        inner = m.group(3)
        if 'id="' in attrs:
            return m.group(0)
        text = re.sub(r"<[^>]+>", "", inner).strip()
        slug = slugify(text, seen)
        return f"<{tag} id=\"{slug}\"{attrs}>{inner}</{tag}>"

    new_body = re.sub(
        r"<(h[23])([^>]*)>(.*?)</\1>",
        repl,
        body_match.group(2),
        flags=re.S,
    )
    return (
        html[: body_match.start(2)]
        + new_body
        + html[body_match.end(2) :]
    )


def collect_headings(html: str) -> list[tuple[int, str, str]]:
    """Return [(level, text, id)] for every stamped heading in order.

    Scopes the search to <section class="body">…</section> so we don't pick
    up headings inside HTML comments (the reformat-default skeleton's
    header comment block re-substitutes placeholders, leaving a phantom
    copy of the body inside <!-- … --> — visible to grep but invisible to
    the renderer; counting those would inflate the TOC with duplicate
    anchors pointing nowhere).
    """
    body_match = re.search(
        r'<section\s+class="body"[^>]*>(.*?)</section>',
        html,
        flags=re.S | re.I,
    )
    scope = body_match.group(1) if body_match else html
    out = []
    for m in re.finditer(r"<(h[23])([^>]*)>(.*?)</\1>", scope, flags=re.S):
        tag = m.group(1)
        attrs = m.group(2)
        inner = m.group(3)
        text = re.sub(r"<[^>]+>", "", inner).strip()
        id_m = re.search(r'id="([^"]+)"', attrs)
        if not id_m:
            continue
        out.append((int(tag[1]), text, id_m.group(1)))
    return out


def build_toc_nav(headings: list[tuple[int, str, str]]) -> str:
    """Render a styled <nav class='toc'> from heading list."""
    if not headings:
        return ""
    rows = []
    for level, text, hid in headings:
        # Indent H3s by one level.
        cls = "toc-h2" if level == 2 else "toc-h3"
        rows.append(
            f'<li class="{cls}"><a href="#{escape(hid)}">{escape(text)}</a></li>'
        )
    body = "\n".join(rows)
    return f"""
<nav class="toc" aria-label="Table of contents">
  <h2 class="toc-title">Contents</h2>
  <ol class="toc-list">
    {body}
  </ol>
</nav>
""".strip()


def inject_toc(html: str) -> str:
    """Stamp IDs and inject TOC after the cover (before <h1>...body...)."""
    seen: dict[str, int] = {}
    html = stamp_heading_ids(html, seen)
    headings = collect_headings(html)
    if not headings:
        print("[pdf_add_toc] No h2/h3 headings found — skipping TOC.", file=sys.stderr)
        return html
    toc = build_toc_nav(headings)

    # The default reformat-default skeleton ends the cover with a closing
    # </header> (or the .cover div). The body follows. Insert the TOC as
    # the first child of <body>, after the cover block.
    m = re.search(r"<body[^>]*>", html, flags=re.I)
    if not m:
        print("[pdf_add_toc] No <body> found.", file=sys.stderr)
        return html
    insert_at = m.end()

    # Skip past the cover so the TOC lands on its own page after the cover.
    # The cover in the reformat-default skeleton is wrapped in
    # <section class="cover">…</section>; fall back to </header> for any
    # template that uses a <header> instead.
    cover_end = re.search(
        r"</section>\s*|</header>\s*",
        html[insert_at:],
        flags=re.I,
    )
    if cover_end:
        insert_at += cover_end.end()

    return html[:insert_at] + "\n" + toc + "\n" + html[insert_at:]


# Inline CSS appended to whatever the skeleton already has. Self-contained —
# works whether or not the skeleton's <style> block is referenced.
TOC_CSS = """
<style>
/* Injected by scripts/pdf_add_toc.py */
nav.toc {
  page-break-after: always;
  break-after: page;
  padding: 2rem 0 1rem;
  border-top: 4px solid var(--accent, #1d4ed8);
}
nav.toc .toc-title {
  font-size: 1.25rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--accent, #1d4ed8);
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.5rem;
  margin: 0 0 1rem;
}
nav.toc ol.toc-list {
  list-style: decimal-leading-zero;
  padding-left: 1.5rem;
  margin: 0;
}
nav.toc li.toc-h2 {
  margin: 0.4rem 0;
  font-weight: 600;
  line-height: 1.4;
}
nav.toc li.toc-h3 {
  margin: 0.2rem 0 0.2rem 1rem;
  font-weight: 400;
  color: #4b5563;
  font-size: 0.95em;
}
nav.toc a {
  color: #111827;
  text-decoration: none;
  border-bottom: 1px dotted transparent;
}
nav.toc a:hover { border-bottom-color: #111827; }
</style>
"""


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("html", type=Path)
    p.add_argument("--out", type=Path)
    p.add_argument("--css-out", action="store_true",
                   help="Also print the inline CSS block (for paste-in if needed).")
    args = p.parse_args()

    src = args.html.read_text(encoding="utf-8")

    # Inject the inline TOC CSS into the <head> if not already there.
    if "pdf_add_toc.py" not in src:
        src = re.sub(
            r"(</head>)",
            lambda m: TOC_CSS + "\n" + m.group(1),
            src,
            count=1,
            flags=re.I,
        )

    out_html = inject_toc(src)

    target = args.out or args.html.with_name(args.html.stem + "-with-toc.html")
    target.write_text(out_html, encoding="utf-8")
    headings_n = len(collect_headings(out_html))
    print(f"[pdf_add_toc] {headings_n} headings indexed → {target}")
    if args.css_out:
        print(TOC_CSS)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
