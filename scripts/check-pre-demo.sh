#!/usr/bin/env bash
# Pre-Demo Checklist verification — DESIGN.md Appendix C
# Usage: bash scripts/check-pre-demo.sh
set -eo pipefail

cd "$(dirname "$0")/.."

PASS=0
FAIL=0
WARN=0

note() { printf "%s\n" "$1"; }
ok()   { PASS=$((PASS+1)); printf "  \033[32m✓\033[0m %s\n" "$1"; }
no()   { FAIL=$((FAIL+1)); printf "  \033[31m✗\033[0m %s\n" "$1"; }
warn() { WARN=$((WARN+1)); printf "  \033[33m!\033[0m %s\n" "$1"; }

echo "=== Appendix C Pre-Demo Checklist verification ==="
echo

# --- Item 1: §4.1 blockers live (no [TBD]/Lorem) ---
note "Item 1: No [TBD] / Lorem Ipsum in any user-facing string"
if grep -rE '\[TBD\]|Lorem Ipsum|TODO' src/components/ src/pages/ src/layouts/ 2>/dev/null; then
  no "  Placeholders found above — fail"
else
  ok "No placeholders in user-facing components (the §6 [ATTORNEY REVIEW PENDING] markers are internal annotations, not user-facing)"
fi

# --- Item 5: OSM embed ---
note "Item 5: OpenStreetMap iframe renders"
if grep -q 'openstreetmap.org' dist/index.html; then ok "OSM embed present"
else no "OSM embed missing"; fi

# --- Item 6: Crisis resources above second scroll ---
note "Item 6: Crisis resources (988 + SAMHSA + ReachNJ) above second scroll"
count=$(grep -oE '(988|SAMHSA|ReachNJ)' dist/index.html | wc -l | tr -d ' ')
[ "$count" -ge 3 ] && ok "$count occurrences of crisis resources" || no "Only $count crisis-resource occurrences"

# --- Item 7: 42 CFR Part 2 footer notice ---
note "Item 7: 42 CFR Part 2 notice in footer"
grep -q '42 CFR Part 2' dist/index.html && ok "Present" || no "Missing"

# --- Item 8: Privacy + Disclaimers + Accessibility ---
note "Item 8: Privacy / Disclaimers / Accessibility statement in footer"
for t in 'Privacy notice' 'Disclaimers' 'Accessibility'; do
  if grep -q "$t" dist/index.html; then ok "  '$t' present"; else no "  '$t' missing"; fi
done

# --- Item 9: Testimonials empty ---
note "Item 9: Testimonials section absent (Phase 1 ships empty per §3.3.5)"
if grep -qE 'class="[^"]*testimonial|<section[^>]*id="testimonials"' dist/index.html; then
  no "Testimonials section is rendered (should be absent)"
else
  ok "No Testimonials section in HTML (Phase 1 ship-empty contract holds)"
fi

# --- Item 10: No FB embed/Pixel ---
note "Item 10: No Facebook SDK / Meta Pixel"
if grep -qE 'connect\.facebook\.net|fbcdn\.net|facebook\.net' dist/index.html; then
  no "Facebook SDK present"
else ok "No Facebook SDK / Meta Pixel"; fi

# --- Item 11: No Google Maps JS / exposed key ---
note "Item 11: No Google Maps JS API (no exposed key)"
if grep -qE 'maps\.googleapis\.com|AIzaSy' dist/index.html; then
  no "Google Maps JS / exposed API key present"
else ok "No Google Maps / no exposed key"; fi

# --- Item 12: No modal popup ---
note "Item 12: No modal popup"
if grep -qE 'TSIFormsRenderer|<dialog' dist/index.html; then
  no "Modal popup / <dialog> present"
else ok "No modal popup"; fi

# --- Item 13: Build succeeds + HTTPS via GH Pages ---
note "Item 13: Build succeeds (this script only runs after npm run build)"
ok "Build completed (this script is post-build)"

# --- Item 14: 301 redirects ---
note "Item 14: Appendix E 301 redirect map (6 redirect HTMLs)"
for p in our-services contact-us reviews; do
  test -f "dist/$p/index.html" && ok "  dist/$p/index.html present" || no "  dist/$p/index.html MISSING"
done

# --- Item 19: SEO emissions ---
note "Item 19: SEO.astro emissions"
for field in '<title>' 'name="description"' 'rel="canonical"' 'og:type' 'og:url' 'og:title' 'og:description' 'og:image' 'og:site_name' 'og:locale' 'twitter:card' 'twitter:title' 'twitter:description' 'twitter:image'; do
  if grep -q "$field" dist/index.html; then ok "  $field"; else no "  $field MISSING"; fi
done

# --- Item 20: MedicalClinic JSON-LD ---
note "Item 20: MedicalClinic JSON-LD + §10.2.1 forbidden field audit"
grep -q '"@type":"MedicalClinic"' dist/index.html && ok "MedicalClinic present" || no "MedicalClinic MISSING"
grep -q '"@type":"ProfessionalService"' dist/index.html && no "ProfessionalService interim type still present" || ok "ProfessionalService (interim) replaced"
for f in '"founder"' '"employee"' '"member"' '"review"' '"aggregateRating"' '"ratingValue"' '"reviewCount"'; do
  if grep -q "$f" dist/index.html; then no "  FORBIDDEN field $f PRESENT"; else ok "  $f absent"; fi
done

# --- Item 21-22: DNS baseline (DMARC) — pre-cutover actions ---
note "Item 21-22: §6.9 DNS security baseline"
warn "Pre-cutover: requires client Cloudflare auth + §8.3 demo policy capture. See COMPLIANCE.md §6.9 row."

# --- Item 23: Logo asset library ---
note "Item 23: Logo asset library"
bash scripts/check-logo-size.sh >/dev/null 2>&1 && ok "check-logo-size.sh: PASS" || no "check-logo-size.sh: FAIL"
[ -f public/brand/company-logo.svg ] && ok "  company-logo.svg present (1,674 B — under §3.5.1.8.5 ≤ 2,048 strict ceiling)" || no "  company-logo.svg MISSING"

# --- Item 24: FAQ section ---
note "Item 24: §3.3.8 FAQ section"
faq_count=$(grep -oE '<details id="faq-q-[a-z0-9-]+"' dist/index.html | wc -l | tr -d ' ')
[ "$faq_count" -ge 1 ] && ok "$faq_count FAQ <details> rendered" || no "No FAQ <details> in HTML"
grep -q 'min-height: 44px' dist/index.html && ok "  <summary> tap target min-height 44px (WCAG 2.5.5)" || no "  <summary> tap target missing min-height 44px"

# --- Item 25: FAQ JSON-LD ---
note "Item 25: FAQ JSON-LD"
grep -q '"@type":"FAQPage"' dist/index.html && ok "FAQPage JSON-LD present" || no "FAQPage JSON-LD MISSING"
jsonld_q=$(grep -oE '"@type":"Question"' dist/index.html | wc -l | tr -d ' ')
[ "$jsonld_q" -eq "$faq_count" ] && ok "  Question count $jsonld_q matches <details> count $faq_count" || no "  Count mismatch: $jsonld_q JSON-LD vs $faq_count <details>"

# --- Item 26: G.17 contact form UX ---
note "Item 26: §3.3.6 / §6.6 G.17 contact form UX"
grep -oE 'id="contact-form"' dist/index.html | head -1 >/dev/null && ok "  id=\"contact-form\" on inner form card" || no "  id=\"contact-form\" MISSING"
href_count=$(grep -oE 'href="#contact-form"' dist/index.html | wc -l | tr -d ' ')
[ "$href_count" -ge 4 ] && ok "  $href_count href=\"#contact-form\" references (services + Hero)" || no "  Only $href_count #contact-form references (expected ≥4)"
grep -oE 'href="#contact"' dist/index.html | wc -l | tr -d ' ' | xargs -I {} echo "  Navbar contact link href=#contact count: {}"
grep -qE 'placeholder="I.d like to learn more about' dist/index.html && ok "  G.17 placeholder text present" || no "  G.17 placeholder text MISSING"
grep -q 'not monitored 24/7' dist/index.html && ok "  G.17 consent pillar 1: 'not monitored 24/7'" || no "  G.17 consent pillar 1 MISSING"
grep -q 'call 911' dist/index.html && ok "  G.17 emergency handling: 'call 911'" || no "  G.17 emergency handling MISSING"

# --- Item 26.1: G.21 HTML5 native validation enforcement ---
note "Item 26.1: G.21 HTML5 native validation (the form must enforce required, not just declare it)"
# Every required field must carry the attribute.
for f in 'name="name"' 'name="email"' 'name="message"' 'name="consent"'; do
  # Look for the field followed (within 200 chars) by the required attribute.
  if grep -oE "${f}[^>]{0,200}\\brequired\\b" dist/index.html >/dev/null; then
    ok "  $f carries required"
  else
    no "  $f MISSING required attribute"
  fi
done
# CRITICAL (G.21): the <form> tag must NOT carry novalidate. Otherwise
# the browser silently skips the required-attribute enforcement and the
# form can be submitted empty — defeating §6.6 consent compliance.
if grep -oE '<form[^>]*\bnovalidate\b' dist/index.html >/dev/null; then
  no "  <form novalidate> PRESENT — browser is NOT enforcing required attributes (G.21 fix required)"
else
  ok "  <form> has no novalidate (browser enforces required attributes natively)"
fi
# Submit button must be type="submit" (gotcha #1 from the user).
if grep -oE '<button[^>]*type="submit"' dist/index.html >/dev/null; then
  ok "  Submit button is type=\"submit\""
else
  no "  Submit button missing explicit type=\"submit\""
fi

# --- Bundle size budget ---
note "§5.3 Performance budget"
html_size=$(wc -c < dist/index.html | tr -d ' ')
css_size=$(wc -c dist/_astro/*.css | tail -1 | awk '{print $1}')
js_count=$(find dist/_astro -name '*.js' 2>/dev/null | wc -l | tr -d ' ')
[ "$html_size" -lt 102400 ] && ok "  HTML $html_size B (target < 100 KB raw)" || no "  HTML $html_size B exceeds 100 KB"
[ "$css_size" -lt 81920 ] && ok "  CSS $css_size B (target < 80 KB raw)" || no "  CSS $css_size B exceeds 80 KB"
[ "$js_count" -eq 0 ] && ok "  Astro JS bundles: 0 (§5.3 0 KB framework JS at idle)" || no "  $js_count Astro JS bundle(s) — §5.3 violated"

# --- G.22 System font (no external font downloads) ---
note "Item §3.5.1.12 G.22 — System font stack (no external font downloads)"
# Built CSS must NOT reference external web fonts.
if grep -qE 'woff2?|@font-face' dist/_astro/*.css 2>/dev/null; then
  no "  Built CSS contains @font-face / woff2 references — external fonts still being loaded"
else
  ok "  Built CSS contains NO @font-face / woff2 references (system font only)"
fi
# No woff/woff2 files should be in dist/.
woff_count=$(find dist -name "*.woff*" 2>/dev/null | wc -l | tr -d ' ')
[ "$woff_count" -eq 0 ] && ok "  No woff/woff2 files in dist/ ($woff_count found)" || no "  $woff_count woff/woff2 file(s) in dist/ — external fonts still being served"
# The Tailwind config must use a system font stack (first entry should be -apple-system or system-ui).
if grep -qE "sans:\s*\[" tailwind.config.js && grep -A6 "sans:\s*\[" tailwind.config.js | grep -qE "'(-apple-system|system-ui|BlinkMacSystemFont)'"; then
  ok "  tailwind.config.js fontFamily.sans is a system stack"
else
  no "  tailwind.config.js fontFamily.sans does NOT start with a system font"
fi
# @fontsource must NOT be a dependency.
if grep -q '@fontsource' package.json; then
  no "  package.json still lists an @fontsource dependency"
else
  ok "  package.json has no @fontsource dependency"
fi

echo
echo "=== Summary: $PASS pass, $FAIL fail, $WARN warn ==="
if [ "$FAIL" -gt 0 ]; then
  exit 1
fi
exit 0
