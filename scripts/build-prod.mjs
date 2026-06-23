#!/usr/bin/env node
/**
 * scripts/build-prod.mjs — build the production site at the tier the
 * client purchased.
 *
 * Usage:
 *   npm run build:prod -- --tier=1
 *   npm run build:prod -- --tier=2
 *   npm run build:prod -- --tier=3
 *
 * Output:
 *   dist/   → single static site ready to deploy to Cloudflare Pages apex.
 *
 * Runs `npm run check` (faq + logo-size + astro check) first — slower
 * than demo builds but enforces correctness on the production artifact.
 *
 * Before running, ensure CREDENTIALS-SWAP.md placeholders are filled.
 * The site's runtime guard (listPlaceholders()) will warn at build
 * time if any [PLACEHOLDER] values are still present.
 */

import { spawnSync } from 'node:child_process';
import { existsSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE_DIR = join(__dirname, '..');
const DIST_DIR = join(SITE_DIR, 'dist');

// Parse --tier=N from argv (npm scripts pass through).
function parseTierArg() {
  const arg = process.argv.find((a) => a.startsWith('--tier='));
  if (!arg) {
    console.error('Usage: npm run build:prod -- --tier=1|2|3');
    process.exit(2);
  }
  const n = Number(arg.split('=')[1]);
  if (n !== 1 && n !== 2 && n !== 3) {
    console.error(`Invalid --tier value: ${arg} (expected 1, 2, or 3)`);
    process.exit(2);
  }
  return n;
}

function logHeader(msg) {
  const bar = '═'.repeat(60);
  console.log(`\n${bar}\n  ${msg}\n${bar}\n`);
}

function run(cmd, args, extraEnv = {}) {
  const start = Date.now();
  const result = spawnSync(cmd, args, {
    cwd: SITE_DIR,
    stdio: 'inherit',
    env: { ...process.env, ...extraEnv, FORCE_COLOR: '1' },
  });
  const ms = Date.now() - start;
  if (result.status !== 0) {
    console.error(`\n✗ ${cmd} ${args.join(' ')} failed (${ms} ms)\n`);
    process.exit(result.status ?? 1);
  }
  console.log(`\n✓ ${cmd} ${args.join(' ')} OK (${ms} ms)\n`);
}

const tier = parseTierArg();

// Clean dist/ of any leftover demo sub-paths.
function cleanPriorOutput() {
  for (const t of [1, 2, 3]) {
    const path = join(DIST_DIR, `tier-${t}`);
    if (existsSync(path)) rmSync(path, { recursive: true, force: true });
    const companyPath = join(DIST_DIR, 'agape', `tier-${t}`);
    if (existsSync(companyPath)) rmSync(companyPath, { recursive: true, force: true });
  }
}

logHeader(`Agape — production build (Tier ${tier})`);
console.log(`Site dir: ${SITE_DIR}`);
console.log(`Output:   ${DIST_DIR}/`);
console.log(`Target:   prod-${tier}`);
console.log('');

cleanPriorOutput();

const env = {
  SITE_TIER: String(tier),
  BUILD_TARGET: `prod-${tier}`,
};

run('npm', ['run', 'check'], env);
run('npx', ['astro', 'build'], env);

logHeader(`Production build complete (Tier ${tier})`);
console.log('Output:');
console.log(`  ${DIST_DIR}/`);
console.log('');
console.log('Next:');
console.log('  npm run preview    # local preview');
console.log('  wrangler pages deploy dist --project-name=agape-counseling  # production deploy');