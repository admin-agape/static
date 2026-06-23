# Mopheus Code × Build-a-Bot — agape site operator runbook

> Owner: agape counseling site (operator: Mavis / Mopheus Code)
> Companion: `../../build-a-bot/docs/mopheus-code-integration.md` (central spec)
> Last updated: 2026-06-23 (V6 — connect-flow simplification)

This runbook is for whoever is wiring the Mopheus Code × Build-a-Bot integration onto the agape counseling site. It assumes the central spec is the source of truth — this doc only covers the agape-specific choices.

---

## 1. What ships on this site

Three files in `functions/`:

```
functions/
├── _shared/
│   ├── mopheus-code-integration.mjs    (drop-in module, byte-identical to build-a-bot's canonical)
│   └── .env.example                     (template for Cloudflare Pages env vars)
├── api/
│   ├── blog/posts.ts                    (Cloudflare Pages Function — POST /api/blog/posts)
│   └── newsletter/subscribe.ts          (Cloudflare Pages Function — POST /api/newsletter/subscribe)
```

Phase 1 storage is a no-op (logs only). Phase 2 wires actual storage (Sanity / Astro content collection / KV — see §5).

---

## 2. Cloudflare Pages env vars

Set these in **Settings → Environment variables** for the agape Pages project. Production only — preview deployments should use a separate `MOPHEUS_CODE_PUBLIC_KEY` if you want isolation.

| Var | Value | Notes |
|---|---|---|
| `MOPHEUS_CODE_CLIENT_SLUG` | `agape` | Stable across domain changes. **Must** match `MOPHEUS_CODE_CLIENT_SLUGS_JSON` entry on the backend. |
| `MOPHEUS_CODE_SITE_URL` | `https://agapenj.org` | Canonical site URL. Must match `site_url` claim in the JWT. |
| `MOPHEUS_CODE_PUBLIC_KEY` | (paste from `mopheus-code-promo-2026-06-23.pub` published at `https://mophe.us/.well-known/mopheus-code-promo.pub`) | Optional but recommended — primary path, zero HTTP per request. |
| `MOPHEUS_CODE_PUBLIC_KEY_ID` | `0e3a05b827f8b18b` | The kid of the inline PEM. Set at deploy time; verifies the inline PEM matches the active kid. |
| `MOPHEUS_CODE_PUBLIC_KEY_FALLBACK_URL` | `https://mophe.us/.well-known/mopheus-code-promo.pub` | Where the site fetches the **current** public key from on kid mismatch. Cached in-memory by kid for 1 hour. Auto-recovers from key rotation. |

**Do NOT set** `MOPHEUS_CODE_DEMO_BEARER` — it's an undocumented testing escape hatch. The connect flow doesn't need it.

---

## 3. End-to-end connection flow

Once the env vars are set and the site is deployed:

1. **agape client (operator)**: ensure `agapenj.org` is in build-a-bot's `MOPHEUS_CODE_CLIENT_SLUGS_JSON` env var (already there).
2. **agape end user**: opens the build-a-bot mobile app, navigates to the Business Bot dashboard.
3. **agape end user**: taps "Connect a site" on the Connected Sites card.
4. **agape end user**: pastes `agapenj.org` into the URL field.
5. **agape end user**: taps Connect.
6. **build-a-bot backend**: signs a fresh promo JWT using `MOPHEUS_CODE_SIGNING_PRIVATE_KEY`, verifies it, persists the integration row, probes `/api/blog/posts` + `/api/newsletter/subscribe` on agapenj.org.
7. **agapenj.org**: each endpoint validates the bearer's HKDF derivation against the published public key. Since the kid matches, the inline PEM is used (no HTTP to fetch).
8. **build-a-bot backend**: returns `{ ok: true, integration, site_reachable: true }` to the mobile app.
9. **Mobile app**: Connected Sites card refreshes; the new agapenj.org integration appears with status `active`.

The end user **pasted a URL and tapped Connect**. That's the whole UX.

---

## 4. What to do when something breaks

### 4.1 "Site not ready" alert in the mobile app

`/integrations/mopheus-code/connect` returned `ok: false` with `site_reachable: false`. This means **build-a-bot signed + verified + saved the integration row, but the site didn't respond on either `/api/blog/posts` or `/api/newsletter/subscribe`**.

Likely causes:
- The Pages Functions haven't deployed yet (check `wrangler pages deployment list`).
- The slug in the request didn't match `MOPHEUS_CODE_CLIENT_SLUG` — verify `MOPHEUS_CODE_CLIENT_SLUG=agape` in Pages dashboard.
- The site_url in the request didn't match `MOPHEUS_CODE_SITE_URL` — verify `MOPHEUS_CODE_SITE_URL=https://agapenj.org`.

If everything is configured correctly and the Functions ARE deployed, the issue is the kid. Check `MOPHEUS_CODE_PUBLIC_KEY_ID` matches the kid printed by `scripts/generate-promo-keypair.ts` on build-a-bot.

### 4.2 "Site not registered" alert (400 unknown_site)

The hostname isn't in `MOPHEUS_CODE_CLIENT_SLUGS_JSON` on the backend. Ask the Mopheus Code operator (mopheus-bot@proton.me) to add `{"agapenj.org": "agape"}` to the map. Restart the backend.

### 4.3 "Backend signing key missing" alert (503 signing_key_unavailable)

`MOPHEUS_CODE_SIGNING_PRIVATE_KEY` isn't set on build-a-bot. Same — ask the operator to set it (paste the contents of `./.secrets/mopheus-code-promo-2026-06-23.pem`).

### 4.4 "Connect failed" with no specific status code

Network issue or backend unreachable. Check the mobile app's API base URL and the backend's health.

---

## 5. Wiring real storage (Phase 2 — out of scope for Phase 1)

Phase 1 (`storeBlog` is a no-op + `addSubscriber` returns `{ subscription_id: 'pending' })` ships with no storage. When agape is ready to receive real posts:

### Option A — Sanity

```ts
// in functions/api/blog/posts.ts
import { createClient } from '@sanity/client';

const sanity = createClient({
  projectId: env.SANITY_PROJECT_ID,
  dataset: env.SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: env.SANITY_WRITE_TOKEN,
});

async function storeBlog(payload, env) {
  const doc = await sanity.create({
    _type: 'post',
    title: payload.title,
    slug: { current: payload.slug },
    body: payload.body_markdown,
    excerpt: payload.excerpt,
    tags: payload.tags,
    publishedAt: payload.publish_at ?? new Date().toISOString(),
  });
  return {
    slug: payload.slug,
    url: `${env.MOPHEUS_CODE_SITE_URL}/blog/${payload.slug}`,
  };
}
```

### Option B — Astro content collection

Append to `src/content/blog/<slug>.md` and trigger a rebuild via the Cloudflare API. (More complex — usually not worth it for a small site.)

### Option C — Cloudflare KV

```ts
async function storeBlog(payload, env) {
  await env.BLOG_KV.put(
    payload.slug,
    JSON.stringify({
      title: payload.title,
      body: payload.body_markdown,
      excerpt: payload.excerpt,
      tags: payload.tags,
      publishedAt: payload.publish_at ?? new Date().toISOString(),
    }),
  );
  return { slug: payload.slug, url: `${env.MOPHEUS_CODE_SITE_URL}/blog/${payload.slug}` };
}
```

Bind `BLOG_KV` in the Pages project (Settings → Functions → KV namespace bindings).

### Option D — GitHub commit via Octokit

Write a markdown file to the repo and commit. (Slow — bot drafts that need to appear in 5 minutes shouldn't use this path.)

---

## 6. Phase 2 — newsletter store

Phase 1 returns `{ subscription_id: 'pending' }`. Phase 2 wires the real subscription source. The simplest path is a tiny Cloudflare Worker KV namespace that the agape site reads back from; the more polished path is Mailchimp / ConvertKit / Buttondown.

### Option A — KV-backed

```ts
async function addSubscriber(payload, env) {
  const id = crypto.randomUUID();
  await env.NEWSLETTER_KV.put(`subscriber:${id}`, JSON.stringify({
    email: payload.email,
    source: payload.source,
    tags: payload.tags,
    createdAt: new Date().toISOString(),
  }));
  return { subscription_id: id };
}
```

Bind `NEWSLETTER_KV` similarly. The agape site renders subscribers from this KV in its admin dashboard.

### Option B — Mailchimp

```ts
async function addSubscriber(payload, env) {
  const res = await fetch(`https://${env.MAILCHIMP_DC}.api.mailchimp.com/3.0/lists/${env.MAILCHIMP_LIST_ID}/members`, {
    method: 'POST',
    headers: {
      'authorization': `apikey ${env.MAILCHIMP_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      email_address: payload.email,
      status: 'subscribed',
      tags: payload.tags,
    }),
  });
  if (!res.ok) throw new Error(`Mailchimp failed: ${res.status}`);
  const body = await res.json();
  return { subscription_id: body.id };
}
```

---

## 7. Domain change handling

If agapenj.org moves to e.g. `agape-counseling.com`:

1. Update `MOPHEUS_CODE_SITE_URL` in Pages env vars.
2. Update the `_redirects` / DNS to point the new domain at the Pages project.
3. Tell the Mopheus Code operator — they update their internal `clients` table + the backend's `MOPHEUS_CODE_CLIENT_SLUGS_JSON` map (slug stays `agape`, only the hostname changes).
4. The end user pastes the new URL in the mobile app's "Connect a site" flow. The connect endpoint detects the domain change, soft-revokes the prior row, persists a fresh row for the new domain. Old audit history stays attached to `agapenj.org` permanently.

No operator-side minting of new promo URLs needed (the dev signs on the fly now). The user-facing UX is the same — paste URL, tap Connect.

---

## 8. The "Phase 1 stub" storage — why we shipped it

The user (Mopheus Code operator) wanted to **deploy the integration endpoints on the live agape site before billing / storage is wired**. Phase 1 lets the end-to-end flow complete:

- build-a-bot signs a JWT.
- build-a-bot verifies it + persists the integration row.
- build-a-bot POSTs a test blog post + newsletter subscribe to agapenj.org.
- agapenj.org logs the payload (instead of writing it anywhere) and returns `{ slug, url }` / `{ subscription_id }`.

This proves the wire is correct **before** anyone has to commit to a storage backend. When the agape client is ready to receive real posts, swap `storeBlog` and `addSubscriber` per §5/§6.

The build-a-bot audit table is the source of truth for "did the bot send a post" — even before storage is wired, every call writes a row. The operator dashboard can see "5 posts sent this week" regardless of whether agape's storage is real.

---

## 9. Frequently asked questions

**Q: Do I need to do anything special for preview deployments?**
A: Preview URLs get their own Pages deployment. They don't share env vars with production. If you want preview to also work, set the same env vars (but consider a separate `MOPHEUS_CODE_PUBLIC_KEY` for preview so test posts don't pollute the production kid cache).

**Q: The kid is changing — what do I do?**
A: Update `MOPHEUS_CODE_PUBLIC_KEY_ID` AND `MOPHEUS_CODE_PUBLIC_KEY` on the site. Or set `MOPHEUS_CODE_PUBLIC_KEY_FALLBACK_URL` to `https://mophe.us/.well-known/mopheus-code-promo.pub` and the site will auto-fetch the new key on the next request.

**Q: Can I delete the demo bearer env var?**
A: Yes — it was never set in agape's production env. Phase 1 doesn't use it. The verify flow doesn't reference it.

**Q: My bot's dashboard shows "Reconnect with a new link" — when do I use that vs. "Connect another site"?**
A: "Connect another site" is for adding a SECOND site to the same bot (rare). "Reconnect with a new link" is for when your bot was already connected and the backend lost the row — paste the new `mophe.us/promo/<jwt>` URL the operator emailed you. With V6's on-the-fly signing, "Reconnect" is rarely needed — "Connect a site" handles most cases.

**Q: Where's the canonical source for the integration module?**
A: `build-a-bot/mopheus-code-sites-integration/mopheus-code-integration.mjs`. The agape copy at `functions/_shared/` is byte-identical and updated in sync.
