/**
 * Agape — Astro Content Collections schema (zod).
 *
 * Three collections are defined:
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

export const collections = { services, testimonials };
