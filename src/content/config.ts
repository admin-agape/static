/**
 * Agape — Astro Content Collections schema (zod).
 *
 * Four collections are defined:
 *   1. `services` — the four service offerings (IOP, Individualized Counseling,
 *      Anger Management, Reiki & Meditation). Source content in DESIGN.md
 *      Appendix D. Per §10.1 the schema allows (does not require) an optional
 *      `seo:` frontmatter block so clients can override per-page meta without
 *      touching component code.
 *   2. `testimonials` — patient social proof. PHASE 1 SHIPS EMPTY per
 *      DESIGN.md §3.3.5 + §6.2.2. The `consent_date` + `consent_hash` required
 *      fields make 42 CFR Part 2 compliance structurally enforceable.
 *   3. `crisis` — Phase 2 collection. Currently empty; reserved for surfacing
 *      crisis resources via a future content-driven flow.
 *   4. `blog` — Tier 3+ feature. Long-form content for SEO and thought
 *      leadership. Tier 3 is the "Premium" tier that includes a blog
 *      section per the marketing copy (dev/site/demos/companies.json).
 *      The orchestrator removes the generated `dist/<client>/tier-{1,2}/blog/`
 *      directory so the URL 404s cleanly on lower tiers.
 *
 * NOTE: A `locations` collection used to live here for multi-office
 * support. Agape is a single-location practice (815 U.S. 9, Lanoka
 * Harbor, NJ); the single-office canonical data lives in
 * `src/config/site.ts` (`address`, `hours`, phone, lat/lng). If a
 * future client of the demo platform needs multi-location, the
 * collection can be reintroduced per-client — do NOT add it back here
 * without re-evaluating the tier profile + company switcher.
 *
 * See TESTIMONIAL-REVIEW.md for the Phase 2 prep workflow and the
 * 42 CFR §2.31 consent form template.
 */
import { defineCollection, z } from 'astro:content';

// §10.1 — reusable SEO frontmatter shape. Optional on every collection;
// validated when present so clients get clean error messages at build time.
const seoObject = z
  .object({
    title: z
      .string()
      .min(1)
      .max(60)
      .optional()
      .describe('Google search-result headline — keep under 60 characters.'),
    description: z
      .string()
      .min(1)
      .max(155)
      .optional()
      .describe('Snippet shown under the headline in Google — keep under 155 characters.'),
    ogImage: z
      .string()
      .optional()
      .describe('Absolute URL to a per-page OG image (1200×630). Falls back to /og-default.jpg if omitted.'),
  })
  .optional()
  .describe('Per-page SEO overrides — DESIGN.md §10.1. All fields optional; falls back to BaseLayout defaults.');

const services = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    order: z.number().int().min(1).max(10),
    icon: z.string().describe('Heroicons name (e.g., "users", "user", "heart", "sparkles")'),
    summary: z.string().min(10).max(280),
    bullets: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    // §10.1 — optional per-service SEO overrides.
    seo: seoObject,
  }),
});

const testimonials = defineCollection({
  type: 'content',
  schema: z.object({
    name: z
      .string()
      .min(1)
      .max(40)
      .describe('First name only — no last initial, per §6.2.2 anonymization policy'),
    service: z
      .string()
      .optional()
      .describe('Generic service category (e.g., "Outpatient counseling"). NOT staff names.'),
    featured: z.boolean().default(false),
    consent_date: z
      .string()
      .datetime()
      .describe('ISO datetime the 42 CFR §2.31 consent was signed. Required.'),
    consent_hash: z
      .string()
      .regex(/^[a-f0-9]{64}$/, 'consent_hash must be a 64-char SHA-256 hex digest of the signed consent PDF')
      .describe('SHA-256 of the signed consent PDF — proves the consent document was on file at the time of publish'),
    expires_at: z
      .string()
      .datetime()
      .optional()
      .describe('Optional consent expiration. Defaults to no expiration if omitted.'),
    body_excerpt: z
      .string()
      .max(280)
      .describe('Short excerpt for the card view; full text in the markdown body'),
    // §10.1 — optional per-testimonial SEO overrides.
    seo: seoObject,
  }),
});

// ─── Tier 3+ collections ─────────────────────────────────────────────
//
// `blog` is tier-gated: pages check `site.features.blog` (from
// src/config/tiers.ts) before rendering. On tiers 1/2, the orchestrator
// deletes the generated dist/<client>/tier-N/blog/ directory so the URL
// 404s cleanly. The schema lives here regardless of tier so a future
// tier change doesn't require schema rework.

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().min(1).max(120),
    // Astro derives slug from the filename; the `slug` field is
    // reserved by the content-collection runtime (per ContentSchemaContainsSlugError).
    summary: z.string().min(10).max(280).describe('Card excerpt on the blog index'),
    publishedAt: z
      .string()
      .datetime()
      .describe('ISO publish datetime — drives sort order (newest first) and structured data'),
    author: z.string().default('Agape Counseling Services').describe('Author byline'),
    readingMinutes: z.number().int().min(1).max(60).describe('Estimated read time in minutes'),
    tags: z.array(z.string()).default([]).describe('Topic tags — used for filtering and SEO keyword targeting'),
    featured: z.boolean().default(false),
    // §10.1 — per-post SEO overrides (each post targets a different
    // long-tail keyword cluster).
    seo: seoObject,
  }),
});

export const collections = { services, testimonials, blog };
