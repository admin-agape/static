#!/usr/bin/env python3
"""Preprocess a markdown file: inject <a id="slug"></a> before each heading,
matching the slug format used in TOC anchor links like (#1-how-the-pieces-fit).
Reads source, writes destination. Idempotent (skips if anchor already present).
"""
import re
import sys
from pathlib import Path

def slugify(text: str) -> str:
    """Match the hand-written TOC slugs in this doc:
    - Lowercase
    - Em-dash runs (with optional surrounding whitespace) → placeholder,
      then later swapped back to `--` AFTER multi-dash collapse.
    - Strip non-word, non-space, non-hyphen chars (drops .,/,(),', etc.)
    - Whitespace runs → single dash, collapse multi-dash, trim ends.
    Section number prefix (3.1 / 4.10) is PRESERVED — matches the TOC.
    """
    text = text.lower()
    # Placeholder must survive the punctuation strip ([^\w\s-]) and the
    # whitespace→dash conversion, so use word chars only.
    PLACEHOLDER = "emdashplaceholder"
    # Absorb surrounding whitespace so " - em-dash - " becomes one token.
    text = re.sub(r"\s*\u2014\s*", PLACEHOLDER, text)
    text = re.sub(r"[^\w\s-]", "", text, flags=re.UNICODE)
    text = re.sub(r"\s+", "-", text)
    text = re.sub(r"-+", "-", text)
    text = text.replace(PLACEHOLDER, "--")
    return text.strip("-")

def process(md_path: Path, out_path: Path) -> int:
    src = md_path.read_text(encoding="utf-8")
    lines = src.split("\n")
    out: list[str] = []
    injected = 0
    seen_ids: set[str] = set()
    i = 0
    heading_re = re.compile(r"^(#{1,6})\s+(.+?)\s*$")
    in_code_block = False
    while i < len(lines):
        line = lines[i]
        # Track fenced code block state — skip heading injection inside.
        stripped = line.lstrip()
        if stripped.startswith("```") or stripped.startswith("~~~"):
            in_code_block = not in_code_block
            out.append(line)
            i += 1
            continue
        if in_code_block:
            out.append(line)
            i += 1
            continue
        m = heading_re.match(line)
        if m:
            heading_text = m.group(2).strip()
            slug = slugify(heading_text)
            # Disambiguate duplicates
            base = slug
            n = 2
            while slug in seen_ids:
                slug = f"{base}-{n}"
                n += 1
            seen_ids.add(slug)
            # Check if next non-blank line already has an <a id=...> tag
            if i + 1 < len(lines) and re.search(rf'<a\s+id="{re.escape(slug)}"', lines[i + 1]):
                out.append(line)
            else:
                out.append("")
                out.append(f'<a id="{slug}"></a>')
                out.append(line)
                injected += 1
        else:
            out.append(line)
        i += 1
    out_path.write_text("\n".join(out), encoding="utf-8")
    return injected

if __name__ == "__main__":
    src = Path(sys.argv[1])
    dst = Path(sys.argv[2])
    n = process(src, dst)
    print(f"Injected {n} anchor tags → {dst}")
