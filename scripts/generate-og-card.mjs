// Generate the §10.1 OG card (og-default.jpg, 1200×630) at build time
// from the brand-blue + brand-mark geometry. Pure SVG composition → PNG
// via sharp. No external assets; no fonts (system stack per §2.2).
//
// Usage: node scripts/generate-og-card.mjs
//
// Output: public/og-default.jpg (target ≤ 200 KB per §10.1 budget).

import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const outPath = resolve(repoRoot, 'public/og-default.jpg');

// Brand tokens (DESIGN.md §3.5 + G.3 contrast correction).
const BRAND_BLUE = '#3a6faa';
const BRAND_BLUE_DARK = '#2d5784';
const WHITE = '#ffffff';
const SOFT_MINT = '#f0f9ee';

// Compose the OG card as SVG, then rasterize at 1200x630 (≤ 200 KB target).
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${BRAND_BLUE}" />
      <stop offset="100%" stop-color="${BRAND_BLUE_DARK}" />
    </linearGradient>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="40" />
    </filter>
  </defs>

  <!-- Brand-blue gradient background -->
  <rect width="1200" height="630" fill="url(#bg)" />

  <!-- Soft mint accent blob (decorative, low-saturation per §3.5 color rules) -->
  <circle cx="950" cy="120" r="220" fill="${SOFT_MINT}" opacity="0.18" filter="url(#soft)" />
  <circle cx="200" cy="540" r="180" fill="${SOFT_MINT}" opacity="0.12" filter="url(#soft)" />

  <!-- Brand mark — heart+dove silhouette in white, scaled up for OG card -->
  <g transform="translate(80, 180) scale(5.5)" fill="${WHITE}">
    <!-- Path data mirrors the G.19 vectorized flowing-dove geometry,
         adapted to white fill for the OG card background. -->
    <path d="M0 350 c-40 -10 -75 -50 -75 -110 c0 -50 30 -90 70 -100 c20 -5 35 -15 50 -30 c5 25 25 45 50 50 c40 8 70 50 70 100 c0 60 -35 100 -75 110 c-15 5 -45 5 -90 -20 z M50 80 c-30 0 -50 30 -40 60 c10 30 40 50 80 50 c20 0 40 -10 50 -25 c5 15 -5 35 -25 45 c-20 10 -50 5 -75 -10 c-25 -15 -45 -40 -45 -70 c0 -30 25 -50 55 -50 z" />
  </g>

  <!-- Wordmark + tagline -->
  <g font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" fill="${WHITE}">
    <text x="430" y="265" font-size="84" font-weight="700" letter-spacing="-1">Agape Counseling</text>
    <text x="430" y="355" font-size="84" font-weight="700" letter-spacing="-1">Services</text>
    <text x="430" y="430" font-size="32" font-weight="400" opacity="0.92">Outpatient substance use care in Lanoka Harbor, NJ</text>
    <text x="430" y="500" font-size="36" font-weight="600">(609) 242-0086</text>
    <text x="430" y="555" font-size="24" font-weight="400" opacity="0.85">Bilingual &#183; Medicaid accepted &#183; Same-week intake</text>
  </g>
</svg>
`;

async function main() {
  const png = await sharp(Buffer.from(svg))
    .jpeg({ quality: 86, mozjpeg: true })
    .toBuffer();
  writeFileSync(outPath, png);
  const stats = await import('node:fs').then((m) => m.promises.stat(outPath));
  console.log(`[generate-og-card] wrote ${outPath} (${stats.size} bytes)`);
  if (stats.size > 200 * 1024) {
    console.warn(`[generate-og-card] WARN: exceeds §10.1 200 KB target. Lower quality and re-run.`);
  } else {
    console.log(`[generate-og-card] PASS: under 200 KB target per §10.1.`);
  }
}

main().catch((err) => {
  console.error('[generate-og-card] FAIL:', err);
  process.exit(1);
});
