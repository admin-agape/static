/**
 * Site configuration — single source of truth for every variable
 * that changes per deployment. Every DEV PLACEHOLDER lives here so
 * the handoff CREDENTIALS-SWAP.md only needs to enumerate this file.
 *
 * ─────────────────────────────────────────────────────────────────
 * DEV PLACEHOLDER LEGEND
 * ─────────────────────────────────────────────────────────────────
 * Each value below is flagged with one of:
 *   [PLACEHOLDER] — replace at hand-off with company-owned value
 *   [PUBLIC]      — real public value (phone, address, hours)
 *   [INFERRED]    — extracted from audit, may need owner confirmation
 *
 * After hand-off, ALL [PLACEHOLDER] values must be filled in by the
 * owner before the site goes live. The build will succeed with
 * placeholders, but features depending on them will not work
 * (forms won't submit, analytics won't track).
 * ─────────────────────────────────────────────────────────────────
 *
 * ─────────────────────────────────────────────────────────────────
 * FEATURE FLAGS + TIER OVERRIDES
 * ─────────────────────────────────────────────────────────────────
 * The `features` block below is the kitchen-sink default (every flag
 * ON). At build time, the active tier profile from `./tiers.ts` is
 * applied — Tier 1 flips most flags OFF, Tier 2 keeps Tier 2 modules
 * on, Tier 3 keeps everything on.
 *
 * The build pipeline (`scripts/build-demo.mjs`, `scripts/build-prod.mjs`)
 * sets `SITE_TIER=1|2|3` and `BUILD_TARGET=demo-N|prod-N` env vars
 * before invoking `astro build`. This module reads those env vars
 * at import time and exports the tier-aware config.
 * ─────────────────────────────────────────────────────────────────
 */

import { applyTier, resolveBuildTarget, resolveTier } from './tiers';

// === KITCHEN-SINK DEFAULTS =========================================
// Every value below is the "all features ON" baseline. Tier profiles
// in `./tiers.ts` selectively flip flags to false.

const kitchenSink = {
  // === IDENTITY =====================================================
  brand: 'Agape Counseling Services',
  shortName: 'Agape',
  tagline: 'Counseling rooted in Ocean County since the 1990s.',

  // === LOCATION (public) ===========================================
  // [PUBLIC]
  address: {
    street: '815 U.S. 9',
    city: 'Lanoka Harbor',
    state: 'NJ',
    zip: '08734',
    country: 'US',
    suite: '',
    formatted: '815 U.S. 9, Lanoka Harbor, NJ 08734',
    formattedOneLine: '815 U.S. 9, Lanoka Harbor, NJ 08734',
    // Nominatim geocode 2026-06-21, place_id 344221447 — the actual
    // building, not a street segment. Replaces the previous inferred
    // values which were ~8 km west in Barnegat Bay.
    lat: 39.8658,
    lng: -74.1694,
  },

  // [PUBLIC]
  phone: {
    display: '(609) 242-0086',
    tel:    '+16092420086',   // E.164 for tap-to-call
    raw:    '6092420086',
  },

  // [PUBLIC] canonical email
  email: 'info@agapenj.org',

  // [PUBLIC] hours
  hours: [
    { day: 'Monday',    open: '09:00', close: '21:00', display: '9:00 AM – 9:00 PM' },
    { day: 'Tuesday',   open: '09:00', close: '21:00', display: '9:00 AM – 9:00 PM' },
    { day: 'Wednesday', open: '09:00', close: '21:00', display: '9:00 AM – 9:00 PM' },
    { day: 'Thursday',  open: '09:00', close: '21:00', display: '9:00 AM – 9:00 PM' },
    { day: 'Friday',    open: '09:00', close: '21:00', display: '9:00 AM – 9:00 PM' },
    { day: 'Saturday',  open: '00:00', close: '00:00', display: 'Closed' },
    { day: 'Sunday',    open: '00:00', close: '00:00', display: 'Closed' },
  ],

  // === URL & DOMAIN ================================================
  // [PLACEHOLDER] apex domain — verified at handoff that DNS points here
  domain: 'agapenj.org',
  url: 'https://agapenj.org',

  // === SOCIAL (public) =============================================
  // [PUBLIC] — empty for Phase 1; populated at handoff if client surfaces social.
  social: {
    facebook:  '',
    facebookHandle: '',
    instagram: '',
    instagramHandle: '',
  },

  // === FORM PROVIDER ==============================================
  // [PLACEHOLDER] Web3Forms access key — see CREDENTIALS-SWAP.md.
  // Get one at https://web3forms.com (free, 250 submissions/mo).
  // Owner creates the account, gets an access_key, replaces the value.
  forms: {
    provider: 'web3forms' as 'web3forms' | 'formspree',
    web3formsAccessKey: 'DEV_PLACEHOLDER_web3forms_access_key_REPLACE_AT_HANDOFF',
    formspreeFormId: 'DEV_PLACEHOLDER_formspree_form_id',
    destinationEmail: 'info@agapenj.org', // [PUBLIC]
  },

  // === ANALYTICS ==================================================
  // [PLACEHOLDER] Cloudflare Web Analytics beacon token. Cookieless,
  // no consent banner. Owner creates a beacon at
  // https://dash.cloudflare.com → Analytics → Web Analytics → Add
  // site → copy the script token. Replace below.
  analytics: {
    cloudflareWebAnalyticsBeacon: 'DEV_PLACEHOLDER_cloudflare_beacon_token',
    enabled: true,
  },

  // === TURNSTILE (spam protection) =================================
  // [PLACEHOLDER] Cloudflare Turnstile site key — invisible widget
  // rendered by ContactForm.astro. When unset, the widget is omitted
  // entirely; the honeypot field is the baseline spam gate.
  turnstile: {
    enabled: true,
    siteKey: 'DEV_PLACEHOLDER_turnstile_site_key',
  },

  // === SEO ========================================================
  // [PUBLIC]
  seo: {
    titleTemplate: '%s · Agape Counseling Services',
    defaultTitle: 'Agape Counseling Services — Lanoka Harbor, NJ',
    description:
      'Outpatient substance use disorder counseling in Lanoka Harbor, NJ. ' +
      'Intensive outpatient program, individualized counseling, anger ' +
      'management, reiki and meditation. Bilingual. Medicaid accepted. ' +
      'No wait list.',
    ogImage: '/og-default.jpg',
    twitterHandle: '',
  },

  // === COMPLIANCE =================================================
  // [PUBLIC] HIPAA / 42 CFR Part 2 footer disclosures — visible in
  // footer on every page per §6.
  compliance: {
    hipaaNotice:
      'Agape Counseling Services complies with HIPAA and 42 CFR Part 2. ' +
      'Information shared in counseling is confidential except as required ' +
      'or permitted by law.',
    crisisLine: '988',
    crisisLineDisplay: '988 Suicide & Crisis Lifeline',
    njHopeline: '1-855-654-6735',
    njHopelineDisplay: 'NJ Hopeline',
  },

  // === FEATURES (modular flags) ===================================
  // Tier-modular flag schema. Every flag maps 1:1 to a feature module.
  // Components / pages / layouts check these flags at render time and
  // either render or hide themselves.
  //
  // The values below are the kitchen-sink defaults (every feature ON).
  // The active tier profile (./tiers.ts) overrides these at build time
  // by setting false on the flags that tier doesn't include.
  features: {
    // ── Tier 1 baseline (always on for any tier) ─────────────────
    crisisResources: true,
    contactForm: true,
    faq: true,
    mobileResponsive: true,
    localSeo: true,
    hipaaFooter: true,
    editingGuide: true,
    complianceDoc: true,

    // ── Tier 2+ modules ──────────────────────────────────────────
    bilingual: true,          // English + Spanish version
    blog: true,               // /blog/ + /blog/[slug] + RSS
    accessibilityAudit: true, // vendor-deliverable flag
    newsletter: true,         // email signup with auto-reply

    // ── Tier 3-only modules ──────────────────────────────────────
    customPhotography: true,  // placeholder for custom-shot swap
    advancedSeo: true,        // FAQ schema + per-page keywords
  },

  // === BUILD CONTEXT ==============================================
  // Set by the build script (`scripts/build-demo.mjs`,
  // `scripts/build-prod.mjs`). Pages and components can read this to
  // show / hide "demo build" UI affordances and to render the right
  // base path for assets.
  build: {
    // 'demo-1' | 'demo-2' | 'demo-3' | 'prod-1' | 'prod-2' | 'prod-3'
    target: 'demo-3' as
      | 'demo-1' | 'demo-2' | 'demo-3'
      | 'prod-1' | 'prod-2' | 'prod-3',
    // Git SHA at build time — surfaced in the footer for traceability.
    sha: 'DEV_PLACEHOLDER_git_sha',
    // ISO timestamp — surfaced in /about (last-updated hint).
    builtAt: 'DEV_PLACEHOLDER_build_iso_timestamp',
  },
} as const;

// === APPLY TIER OVERRIDES =========================================
// Reads SITE_TIER (1/2/3) and BUILD_TARGET (demo-N/prod-N) env vars.
// At demo build time: SITE_TIER=1|2|3, BUILD_TARGET=demo-N.
// At prod build time: SITE_TIER=N, BUILD_TARGET=prod-N.
const merged = applyTier(resolveTier(), kitchenSink, resolveBuildTarget());
export const site = merged;

// === TYPE EXPORT (so consumers get autocomplete) ==================
export type SiteConfig = typeof site;
export type DayHours = typeof site.hours[number];

// === RUNTIME GUARD ================================================
// Fails the build if any [PLACEHOLDER] is still set. This is the
// hard-gate before launch — the dev can run `npm run check:handoff`
// (or `astro build` will still pass with placeholders, but this
// script catches them explicitly).
//
// Excludes build-time fields that are legitimately placeholders
// (git sha, build timestamp) — those get filled in by the build
// script, not the owner.
const BUILD_TIME_PLACEHOLDER_KEYS = new Set([
  'sha',
  'builtAt',
]);

export function listPlaceholders(): Array<{ key: string; value: string }> {
  const placeholders: Array<{ key: string; value: string }> = [];
  const json = JSON.stringify(site, null, 2);
  const lines = json.split('\n');
  for (const line of lines) {
    const match = line.match(/"([^"]+)":\s*"(DEV_PLACEHOLDER_[^"]+)"/);
    if (match) {
      const key = match[1];
      if (BUILD_TIME_PLACEHOLDER_KEYS.has(key)) continue;
      placeholders.push({ key, value: match[2] });
    }
  }
  return placeholders;
}