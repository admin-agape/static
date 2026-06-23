/**
 * Tier profiles — single source of truth for "what's on in each tier".
 *
 * Used by:
 *   - `scripts/build-demo.mjs` — builds three demo URLs (one per tier).
 *   - `scripts/build-prod.mjs` — builds the production site at the
 *     tier the client purchased.
 *
 * Each profile is a `features` object that overrides the defaults in
 * `src/config/site.ts`. Build-time merge: defaults from site.ts
 * (kitchen-sink: all on) → tier profile (flips some off).
 *
 * ─── TIER MAP ────────────────────────────────────────────────────────
 *
 * Tier 1 "Essentials" — $2,500 — 14 days
 *   Single-page long-scroll site. Hero, Services grid, About,
 *   Crisis resources, FAQ, Contact form. Mobile-responsive.
 *   Local SEO. HIPAA / 42 CFR Part 2 footer disclosures.
 *
 * Tier 2 "Standard" — $4,000 — 21 days
 *   Tier 1 + bilingual (English/Spanish), blog / insights
 *   infrastructure, newsletter signup, formal accessibility audit.
 *
 * Tier 3 "Premium" — $6,500 — 30 days
 *   Tier 2 + custom photography, advanced SEO (FAQ schema +
 *   per-page keywords), 30-min Loom walkthrough.
 *
 * ─── ADD-ONS (any tier, à la carte, separately quoted) ───────────────
 *
 * Items marked with an asterisk are surfaced as kitchen-sink in demo
 * builds and gated behind a separate proposal in production delivery.
 */

export type TierNumber = 1 | 2 | 3;
export type BuildTarget = `demo-${TierNumber}` | `prod-${TierNumber}`;

export interface TierProfile {
  number: TierNumber;
  name: string;
  label: string;       // price string for the UI badge
  tagline: string;
  description: string; // shown on /pricing or hover cards
  deliveryDays: number;
  /** Flags that this tier flips OFF relative to the kitchen-sink defaults. */
  features: Record<string, boolean>;
}

export const tierProfiles: Record<TierNumber, TierProfile> = {
  // ─── TIER 1 ────────────────────────────────────────────────────
  1: {
    number: 1,
    name: 'Essentials',
    label: '$2,500',
    tagline: 'The MVP rebuild. Everything you need to be found and contacted.',
    description:
      'Single-page long-scroll site with services grid, about, ' +
      'crisis resources, FAQ, and contact form. Mobile-first, ' +
      'local SEO, HIPAA / 42 CFR Part 2 footer disclosures, ' +
      'Web3Forms + Turnstile spam protection, full handoff docs, ' +
      '30-day post-launch support.',
    deliveryDays: 14,
    features: {
      // Tier 2 modules OFF
      bilingual: false,
      blog: false,
      accessibilityAudit: false,
      newsletter: false,
      // Tier 3 modules OFF
      customPhotography: false,
      advancedSeo: false,
    },
  },

  // ─── TIER 2 ────────────────────────────────────────────────────
  2: {
    number: 2,
    name: 'Standard',
    label: '$4,000',
    tagline: 'Tier 1 plus bilingual coverage and a content engine.',
    description:
      'Everything in Tier 1, plus full bilingual (English / ' +
      'Spanish) version, newsletter signup with auto-reply, ' +
      'formal accessibility audit, and 2 rounds of design ' +
      'revisions at the demo.',
    deliveryDays: 21,
    features: {
      // Tier 2 modules ON
      bilingual: true,
      blog: false,             // blog ships in Tier 3 (per marketing copy)
      accessibilityAudit: true,
      newsletter: true,
      // Tier 3 modules OFF
      customPhotography: false,
      advancedSeo: false,
    },
  },

  // ─── TIER 3 ────────────────────────────────────────────────────
  3: {
    number: 3,
    name: 'Premium',
    label: '$6,500',
    tagline: 'Tier 2 plus custom photography and advanced SEO.',
    description:
      'Everything in Tier 2, plus blog / insights with RSS, ' +
      'custom photography shot list (vendor-deliverable), ' +
      'advanced local SEO (FAQ schema + per-page keyword ' +
      'targeting), 30-minute Loom walkthrough, and a quarterly ' +
      'content refresh for the first year.',
    deliveryDays: 30,
    features: {
      // Tier 2 modules ON
      bilingual: true,
      blog: true,              // long-form content for SEO + thought leadership
      accessibilityAudit: true,
      newsletter: true,
      // Tier 3 modules ON
      customPhotography: true, // placeholder for custom-shot swap
      advancedSeo: true,       // FAQ schema + per-page keywords
    },
  },
};

/**
 * Resolve the active tier profile from a `SITE_TIER` env var
 * (`1`, `2`, `3`). Falls back to Tier 3 (kitchen-sink = everything on)
 * for local dev where no env var is set.
 */
export function resolveTier(): TierProfile {
  const raw = process.env.SITE_TIER;
  const n = raw ? (Number(raw) as TierNumber) : 3;
  if (n !== 1 && n !== 2 && n !== 3) {
    throw new Error(`Invalid SITE_TIER env var: ${raw} (expected 1, 2, or 3)`);
  }
  return tierProfiles[n];
}

/**
 * Resolve the active build target (demo vs prod, which tier).
 * Reads `BUILD_TARGET` env var (e.g., `demo-1`, `prod-3`).
 */
export function resolveBuildTarget(): BuildTarget {
  const raw = process.env.BUILD_TARGET ?? 'demo-3';
  if (
    raw !== 'demo-1' && raw !== 'demo-2' && raw !== 'demo-3' &&
    raw !== 'prod-1' && raw !== 'prod-2' && raw !== 'prod-3'
  ) {
    throw new Error(`Invalid BUILD_TARGET: ${raw}`);
  }
  return raw;
}

/**
 * Apply the tier profile to a defaults object. Returns a shallow-merged
 * config with the tier-specific feature flags in place.
 *
 * Pattern: defaults are the kitchen-sink (all on). Tier profile flips
 * the right ones off. Anything not mentioned in the tier profile
 * stays at the default. Build target metadata gets stamped too.
 */
export function applyTier<
  D extends { features: Record<string, boolean>; build: Record<string, unknown> },
>(tier: TierProfile, defaults: D, target: BuildTarget): D {
  return {
    ...defaults,
    features: {
      ...defaults.features,
      ...tier.features,
    },
    build: {
      ...defaults.build,
      target,
      tierNumber: tier.number,
      tierName: tier.name,
    },
  };
}