#!/usr/bin/env bash
#
# Logo asset library size verifier — DESIGN.md §3.5.1.9.4
#
# Two-tier check per the §3.5.1.9.4 contract:
#   - STRICT (≤ 2,048 bytes, build fails): any `public/brand/*.svg` that is
#     NOT in the SOFT_EXCEPTION list. This is the binding ceiling per
#     §3.5.1.8.5 for new mark-only / favicon-size logos.
#   - SOFT (≤ 25 KB full-color / ≤ 8 KB monochrome, build warns): the
#     documented exception list — Phase 1 wordmark variants that exceed
#     the strict ceiling but are within the relaxed soft target. The actual
#     file size is printed (so COMPLIANCE.md §3.5.1 row can be updated);
#     the build does NOT fail.
#
# Decommissioning: when §3.5.1.7.4 designer redraw delivers a ≤ 2 KB
# simplified wordmark, remove the corresponding entry from
# SOFT_EXCEPTION. When all SOFT_EXCEPTION entries are gone, delete the
# soft-tier logic entirely (§3.5.1.9.5).
#
# Usage:
#   npm run check:logo-size
#   bash scripts/check-logo-size.sh
#
# Wired into .github/workflows/deploy.yml (Appendix C item 23).
#
# Exits 0 on pass (or soft-warn-only), 1 on strict violation.

set -eo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BRAND_DIR="$REPO_ROOT/public/brand"

# Per §3.5.1.8.5 strict ceiling.
STRICT_MAX=2048
# Per §3.5.1.9.1 soft ceilings.
SOFT_MAX_FULLCOLOR=25600       # 25 KB
SOFT_MAX_MONOCHROME=8192       # 8 KB

# Documented exception list — files that are allowed to exceed STRICT_MAX
# but must stay under their soft ceiling (full-color or monochrome).
# Each entry: filename|ceiling_kind|reason|soft_max
# When §3.5.1.7.4 #2 (designer redraw) ships and these files shrink to
# ≤ 2 KB, remove the entries.
SOFT_EXCEPTION=(
  # Reserved for the future full-color wordmark — currently the canonical
  # brand asset is company-logo.svg (1,674 bytes, under STRICT_MAX).
  # When a real wordmark ships, add its row here per §3.5.1.7.2.
  # Example: "logo-lockup-horizontal.svg|fullcolor|Phase 1 wordmark per §3.5.1.7.2|25600"
)

if [ ! -d "$BRAND_DIR" ]; then
  echo "[check-logo-size] FAIL: brand directory missing: $BRAND_DIR" >&2
  exit 1
fi

shopt -s nullglob
svgs=("$BRAND_DIR"/*.svg)

if [ ${#svgs[@]} -eq 0 ]; then
  echo "[check-logo-size] PASS: no SVG files in $BRAND_DIR (brand library not yet populated)."
  exit 0
fi

violations=0
warnings=0
checked=0

for svg in "${svgs[@]}"; do
  filename="$(basename "$svg")"
  size="$(wc -c <"$svg" | tr -d ' ')"
  checked=$((checked + 1))

  # Is this file in the soft-exception list?
  is_soft=0
  for entry in "${SOFT_EXCEPTION[@]}"; do
    if [[ "$entry" == "$filename|"* ]]; then
      is_soft=1
      soft_kind="$(echo "$entry" | cut -d'|' -f2)"
      case "$soft_kind" in
        fullcolor)   soft_max=$SOFT_MAX_FULLCOLOR ;;
        monochrome)  soft_max=$SOFT_MAX_MONOCHROME ;;
        *)           soft_max=$SOFT_MAX_FULLCOLOR ;;
      esac
      break
    fi
  done

  if [ $is_soft -eq 1 ]; then
    if [ "$size" -le "$soft_max" ]; then
      echo "[check-logo-size] PASS (soft): $filename = $size bytes (≤ ${soft_max} soft ceiling)"
    else
      echo "[check-logo-size] WARN (soft ceiling exceeded): $filename = $size bytes (> ${soft_max} soft ceiling). Logged to COMPLIANCE.md §3.5.1. §3.5.1.7.4 designer redraw should bring this ≤ 2,048 bytes."
      warnings=$((warnings + 1))
    fi
  else
    # Strict check.
    if [ "$size" -le "$STRICT_MAX" ]; then
      echo "[check-logo-size] PASS (strict): $filename = $size bytes (≤ ${STRICT_MAX} strict ceiling)"
    else
      echo "[check-logo-size] FAIL (strict ceiling exceeded): $filename = $size bytes (> ${STRICT_MAX}). Add to SOFT_EXCEPTION in $0 with a documented reason, or shrink to ≤ 2,048 bytes per §3.5.1.8.5." >&2
      violations=$((violations + 1))
    fi
  fi
done

echo ""
echo "[check-logo-size] Summary: $checked SVG(s) checked, $violations strict violation(s), $warnings soft warning(s)."

if [ "$violations" -gt 0 ]; then
  exit 1
fi

exit 0
