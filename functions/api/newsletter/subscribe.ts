// functions/api/newsletter/subscribe.ts
//
// Cloudflare Pages Function — `POST /api/newsletter/subscribe`
//
// §17 (build-a-bot) — Mopheus Code × Build-a-Bot integration.
// Mirror of `functions/api/blog/posts.ts` for newsletter subscribers.
// Storage is a no-op in Phase 1; the client wires the actual
// provider (Mailchimp / Buttondown / ConvertKit / etc.) when ready.
//
// Drop the drop-in module next to this file:
//   functions/_shared/mopheus-code-integration.mjs

import { createCloudflareWorker } from '../../_shared/mopheus-code-integration.mjs';

/**
 * Future storage hook — wire your newsletter provider here.
 *
 * Phase 1 logs the incoming subscriber + returns `{ ok: true }` so
 * build-a-bot treats the post as successful. The actual signup
 * doesn't happen until the client implements `addSubscriber`.
 */
async function addSubscriber(payload, env) {
  console.log('[newsletter] would subscribe', {
    email: payload.email,
    source: payload.source,
    tags: payload.tags,
    siteUrl: env.MOPHEUS_CODE_SITE_URL,
  });
  // Stable id from the email hash — same id on retry. Once the
  // client wires Mailchimp/Buttondown, return the provider's
  // subscription_id here instead.
  const subscriptionId = await sha256ShortId(payload.email);
  return { subscription_id: subscriptionId };
}

async function sha256ShortId(input) {
  const data = new TextEncoder().encode(input.toLowerCase().trim());
  const digest = await crypto.subtle.digest('SHA-256', data);
  const bytes = new Uint8Array(digest).slice(0, 8);
  let hex = '';
  for (const b of bytes) hex += b.toString(16).padStart(2, '0');
  return `pending-${hex}`;
}

export const onRequestPost = createCloudflareWorker({
  envToConfig: (env) => ({
    publicKeyPem: env.MOPHEUS_CODE_PUBLIC_KEY ?? '',
    demoBearer: env.MOPHEUS_CODE_DEMO_BEARER ?? '',
    expectedSlug: env.MOPHEUS_CODE_CLIENT_SLUG ?? '',
    expectedSiteUrl: env.MOPHEUS_CODE_SITE_URL ?? '',
  }),
  storeBlog: async () => ({ slug: 'not_used_here', url: '' }),
  addSubscriber,
});

export const onRequestGet = () =>
  new Response('Method Not Allowed. Use POST.', { status: 405 });
