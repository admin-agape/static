#!/usr/bin/env node
/**
 * FAQ schema validator — DESIGN.md §3.3.8 CI gate
 *
 * Validates src/data/faq.json against src/data/faq.schema.json.
 * Exits 0 on pass, 1 on any violation. Mirrors the §3.5.1.9.4 two-tier
 * pattern: hard fail (build blocked) for schema violations.
 *
 * Schema is at src/data/faq.schema.json (committed). Uses Ajv (already
 * a transitive dep of @astrojs/check; if not present, install via
 * `npm install --save-dev ajv ajv-formats`).
 *
 * Usage:
 *   npm run check:faq
 *
 * Wired into .github/workflows/deploy.yml per Appendix C item 24.
 */
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = resolve(__dirname, '..');
const dataFile = resolve(repoRoot, 'src/data/faq.json');
const schemaFile = resolve(repoRoot, 'src/data/faq.schema.json');

let data;
let schema;
try {
  data = JSON.parse(readFileSync(dataFile, 'utf8'));
} catch (err) {
  console.error(`[check-faq] FAIL: cannot parse ${dataFile}:`, err.message);
  process.exit(1);
}
try {
  schema = JSON.parse(readFileSync(schemaFile, 'utf8'));
} catch (err) {
  console.error(`[check-faq] FAIL: cannot parse ${schemaFile}:`, err.message);
  process.exit(1);
}

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

const validate = ajv.compile(schema);
const ok = validate(data);

if (!ok) {
  console.error(`[check-faq] FAIL: ${dataFile} violates ${schemaFile}`);
  for (const err of validate.errors ?? []) {
    console.error(`  - ${err.instancePath || '/'} ${err.message}`);
    if (err.params) console.error(`    params: ${JSON.stringify(err.params)}`);
  }
  process.exit(1);
}

// §3.3.8 soft-warn (not fail) for answer length > 800 chars: still
// schema-valid, but a maintainability signal. Per Appendix C item 24 the
// build does NOT fail on this; it just prints a warning.
const items = data?.items ?? [];
const longAnswers = items.filter((it) => typeof it.answer === 'string' && it.answer.length > 800);
if (longAnswers.length > 0) {
  console.warn(
    `[check-faq] WARN: ${longAnswers.length} answer(s) exceed 800 chars (schema allows up to 1000). Consider tightening for readability:`
  );
  for (const it of longAnswers) {
    console.warn(`  - ${it.id}: ${it.answer.length} chars`);
  }
}

// Report on the §3.3.8 contract: should have at least 10 items per the
// §4.1 #14 client-content requirement, but the §3.3.8 empty-state behavior
// lets the build proceed with 3+ placeholder entries.
const itemCount = items.length;
console.log(`[check-faq] PASS: ${dataFile} validates (${itemCount} item${itemCount === 1 ? '' : 's'}).`);
if (itemCount < 10) {
  console.warn(
    `[check-faq] NOTE: §4.1 #14 target is 10+ items. Currently ${itemCount}. Demo is ungated per §3.3.8, but the client should supply the real top 10 inquiries before launch.`
  );
}

process.exit(0);
