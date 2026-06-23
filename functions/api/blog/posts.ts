// functions/api/blog/posts.ts
//
// Cloudflare Pages Function — `POST /api/blog/posts`
//
// §17 (build-a-bot) — Mopheus Code × Build-a-Bot integration.
// Wired by dropping this file into the site's `functions/`
// directory and setting the four env vars listed in
// `functions/_shared/.env.example` (MOPHEUS_CODE_CLIENT_SLUG,
// MOPHEUS_CODE_SITE_URL, MOPHEUS_CODE_PUBLIC_KEY,
// MOPHEUS_CODE_DEMO_BEARER).
//
// Storage is intentionally a no-op in this Phase 1 wiring:
// the function logs the incoming post and returns the
// `site_url + slug` the post will live at. The actual
// write-to-CMS step (Sanity, Markdown commit, KV, etc.)
// is a per-site concern that the client wires in
// when they're ready to receive real posts. The point
// of Phase 1 is to prove the connection works end-to-end
// before storage becomes the bottleneck.
//
// Drop the drop-in module next to this file:
//   functions/_shared/mopheus-code-integration.mjs
// (it's a single ESM file; no build step).

import { createCloudflareWorker } from '../../_shared/mopheus-code-integration.mjs';

/**
 * Future storage hook — the client site implements this to actually
 * persist the post. Phase 1 ships with a no-op that logs to the
 * Cloudflare Workers tail + returns a placeholder URL.
 *
 * Suggested implementations per stack:
 *   - Sanity: `client.create({ _type: 'post', ... })`
 *   - Astro content collection: append to `src/content/blog/*.md` + rebuild
 *   - Cloudflare KV: `env.BLOG_KV.put(slug, JSON.stringify(payload))`
 *   - GitHub commit via Octokit: write file to repo + commit
 */
async function storeBlog(payload, env) {
  // Phase 1: log only. The audit row in build-a-bot's
  // integration_audit table is the source of truth for
  // "did the bot send a post" — even before storage is wired.
  console.log('[blog] would store post', {
    title: payload.title,
    slug: payload.slug,
    tags: payload.tags,
    publishAt: payload.publish_at,
    siteUrl: env.MOPHEUS_CODE_SITE_URL,
  });
  const url = `${env.MOPHEUS_CODE_SITE_URL}/blog/${payload.slug}`;
  return { slug: payload.slug, url };
}

export const onRequestPost = createCloudflareWorker({
  envToConfig: (env) => ({
    publicKeyPem: env.MOPHEUS_CODE_PUBLIC_KEY ?? '',
    demoBearer: env.MOPHEUS_CODE_DEMO_BEARER ?? '',
    expectedSlug: env.MOPHEUS_CODE_CLIENT_SLUG ?? '',
    expectedSiteUrl: env.MOPHEUS_CODE_SITE_URL ?? '',
  }),
  storeBlog,
  addSubscriber: async () => ({ subscription_id: 'not_used_here' }),
});

export const onRequestGet = () =>
  new Response('Method Not Allowed. Use POST.', { status: 405 });
