#!/usr/bin/env node
/**
 * scripts/build-demo.mjs — build the deployable demo artifact.
 *
 * Outputs (multi-tenant path-based pattern for demo.mophe.us):
 *   dist/agape/tier-1/             → Tier 1 demo (Essentials)
 *   dist/agape/tier-2/             → Tier 2 demo (Standard)
 *   dist/agape/tier-3/             → Tier 3 demo (Premium — kitchen-sink)
 *
 * The apex landing page (the "Got a demo code?" entry page that lives
 * at demo.mophe.us/) is owned by space-station's build script — that
 * repo was first on the platform. This script intentionally does NOT
 * write the apex; it only emits Agape's tier sub-paths.
 *
 * All four targets ship together to Cloudflare Pages (the shared
 * `mophe-us-demos` project). Push to main triggers this build; wrangler
 * uploads `dist/` and Pages serves the new content at
 * `https://demo.mophe.us/agape/tier-N/`.
 *
 * Multi-tenant: when adding a new client, override COMPANY via env
 *   COMPANY=agape npm run build:demo
 * (currently hardcoded to agape since this script is in the
 * agape repo — when reused for other clients, edit the COMPANY
 * constant below OR pass COMPANY=<slug>.)
 *
 * Usage:
 *   npm run build:demo
 *
 * Skips `astro check` for speed — the type-check is enforced by the
 * prod build path (`scripts/build-prod.mjs`) and CI on `main`.
 */

import { spawnSync } from 'node:child_process';
import { existsSync, rmSync, mkdirSync, readdirSync, readFileSync, writeFileSync as writeFileRaw } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE_DIR = join(__dirname, '..');
const DIST_DIR = join(SITE_DIR, 'dist');

const DEMO_TIERS = [1, 2, 3];
const COMPANY = process.env.COMPANY || 'agape';   // multi-tenant demo path prefix

function logHeader(msg) {
  const bar = '═'.repeat(60);
  console.log(`\n${bar}\n  ${msg}\n${bar}\n`);
}

function buildTarget({ siteTier, buildTarget, company }) {
  const start = Date.now();
  const result = spawnSync('npx', ['astro', 'build'], {
    cwd: SITE_DIR,
    stdio: 'inherit',
    env: {
      ...process.env,
      SITE_TIER: String(siteTier),
      BUILD_TARGET: buildTarget,
      ...(company ? { COMPANY: company } : {}),
      FORCE_COLOR: '1',
    },
  });
  const ms = Date.now() - start;
  if (result.status !== 0) {
    console.error(`\n✗ ${buildTarget} build failed (${ms} ms)\n`);
    process.exit(result.status ?? 1);
  }
  console.log(`\n✓ ${buildTarget} build OK (${ms} ms)\n`);

  // For multi-tenant demo builds, post-process the HTML so internal
  // root-absolute links (e.g. <a href="/#services">) resolve correctly
  // under the configured base path. Astro's `base` only prefixes
  // asset URLs (CSS/JS/images), not navigation links.
  if (company && buildTarget.startsWith('demo-')) {
    const base = `/${company}/tier-${siteTier}/`;
    const outDir = join(DIST_DIR, company, `tier-${siteTier}`);
    const rewriterStart = Date.now();
    rewriteHtmlPaths(outDir, base);
    console.log(`✓ rewrote HTML paths under ${base} (${Date.now() - rewriterStart} ms)\n`);
  }
}

// Walk a directory recursively and rewrite internal absolute URLs in
// every .html file so they resolve under the configured base path.
function rewriteHtmlPaths(outDir, baseUrl) {
  const URL_ATTRS = ['href', 'src', 'action', 'formaction', 'poster', 'cite', 'background', 'longdesc', 'usemap', 'manifest', 'ping'];
  const attrPattern = new RegExp(`\\b(?:${URL_ATTRS.join('|')})="(\\/[^"]*)"`, 'g');
  const srcsetPattern = /\bsrcset="([^"]*)"/g;

  // For multi-tenant builds (baseUrl like "/agape/tier-1/"),
  // extract the company prefix "/agape/". URLs that share this
  // prefix point at sibling tiers of the same company — they're
  // already correct absolute paths and must NOT be prefixed again,
  // or we'd get "/agape/tier-1/agape/tier-2/".
  const tierMatch = baseUrl.match(/^(\/.+?)\/tier-\d+\/$/);
  const companyPrefix = tierMatch ? tierMatch[1] + '/' : null;

  function shouldSkip(url) {
    // Skip protocol-relative URLs.
    if (url.startsWith('//')) return true;
    // Skip if URL is exactly baseUrl or under it (already at this tier).
    if (url === baseUrl || url.startsWith(baseUrl)) return true;
    // Skip if URL is under a sibling tier of the same company (multi-tenant).
    if (companyPrefix && (url === companyPrefix || url.startsWith(companyPrefix))) return true;
    return false;
  }

  let filesTouched = 0;

  function walk(d) {
    let entries;
    try {
      entries = readdirSync(d, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      const full = join(d, e.name);
      if (e.isDirectory()) {
        walk(full);
      } else if (e.name.endsWith('.html')) {
        const html = readFileSync(full, 'utf-8');
        let mutated = html;

        // Rewrite href="/..." style attributes.
        mutated = mutated.replace(attrPattern, (match, url) => {
          if (shouldSkip(url)) return match;
          const newUrl = url === '/' ? baseUrl : `${baseUrl}${url.slice(1)}`;
          return match.replace(url, newUrl);
        });

        // Rewrite srcset="url1 1x, url2 2x, ..." — handle each URL.
        mutated = mutated.replace(srcsetPattern, (match, srcset) => {
          const rewritten = srcset.split(',').map((s) => {
            const trimmed = s.trim();
            if (!trimmed) return s;
            const spaceIdx = trimmed.search(/\s/);
            const url = spaceIdx === -1 ? trimmed : trimmed.slice(0, spaceIdx);
            const descriptor = spaceIdx === -1 ? '' : trimmed.slice(spaceIdx);
            if (!url.startsWith('/') || url.startsWith('//')) return trimmed;
            if (shouldSkip(url)) return trimmed;
            const newUrl = url === '/' ? baseUrl : `${baseUrl}${url.slice(1)}`;
            return `${newUrl}${descriptor}`;
          }).join(', ');
          return `srcset="${rewritten}"`;
        });

        if (mutated !== html) {
          writeFileRaw(full, mutated, 'utf-8');
          filesTouched++;
        }
      }
    }
  }

  walk(outDir);
  console.log(`  → rewrote ${filesTouched} HTML file(s) in ${outDir}`);
}

function cleanPriorDemoOutput() {
  // Wipe legacy single-tenant demo sub-paths AND the multi-tenant
  // company directory so stale builds don't ship.
  for (const tier of DEMO_TIERS) {
    const legacyPath = join(DIST_DIR, `tier-${tier}`);
    if (existsSync(legacyPath)) rmSync(legacyPath, { recursive: true, force: true });
    const companyPath = join(DIST_DIR, COMPANY, `tier-${tier}`);
    if (existsSync(companyPath)) rmSync(companyPath, { recursive: true, force: true });
  }
}

logHeader(`Agape — deployable demo build (company: ${COMPANY})`);
console.log(`Site dir: ${SITE_DIR}`);
console.log(`Output:`);
for (const tier of DEMO_TIERS) {
  console.log(`  ${DIST_DIR}/${COMPANY}/tier-${tier}/  (Tier ${tier} demo)`);
}
console.log('');
console.log('NOTE: The apex landing page (the "Got a demo code?" form at');
console.log(`      demo.mophe.us/) is owned by space-station's build script.`);
console.log(`      This script writes ONLY ${COMPANY}'s tier sub-paths.`);
console.log('');

if (existsSync(DIST_DIR)) {
  rmSync(DIST_DIR, { recursive: true, force: true });
}
mkdirSync(DIST_DIR, { recursive: true });

// Tier builds only — no apex landing. The apex of demo.mophe.us is
// written by space-station's build-demo.mjs (the platform owner).
for (const tier of DEMO_TIERS) {
  logHeader(`Building demo ${COMPANY} tier ${tier}`);
  buildTarget({ siteTier: tier, buildTarget: `demo-${tier}`, company: COMPANY });
}

logHeader('Demo build complete');
console.log('Deployable output:');
for (const tier of DEMO_TIERS) {
  console.log(`  ${DIST_DIR}/${COMPANY}/tier-${tier}/  (Tier ${tier})`);
}
console.log('');
console.log('Next:');
console.log('  wrangler pages deploy dist --project-name=mophe-us-demos');