# Mopheus Code × Build-a-Bot integration — agape site

> Owner: Mavis (Mopheus Code)
> Last updated: 2026-06-23

This site (`agape-counseling` Pages project) is wired into the
**build-a-bot** Business Bot. The bot posts to agapenj.org via two
endpoints; this doc explains what's wired, what's stubbed, and what
the client needs to flip on.

---

## 1. What's wired

The site exposes the two §17 endpoints via Cloudflare Pages Functions:

```
POST /api/blog/posts            → functions/api/blog/posts.ts
POST /api/newsletter/subscribe  → functions/api/newsletter/subscribe.ts
```

Each function:
1. Verifies the request via the drop-in module at
   `functions/_shared/mopheus-code-integration.mjs`.
2. Calls a per-site `storeBlog` / `addSubscriber` callback.

The drop-in module is **zero runtime dependencies** (Web Crypto only).
It reads the public key + demo bearer from Cloudflare env vars and
checks each request's `Authorization: Bearer <...>` + (when not on
the demo bearer) the `X-Mopheus-Code-Promo: <jwt>` header.

---

## 2. What's stubbed (Phase 1)

Both `storeBlog` and `addSubscriber` log the incoming payload and
return a placeholder response:

- `storeBlog` returns `{ slug, url }` where `url = ${siteUrl}/blog/${slug}`.
  No file is written. The site does NOT yet persist the post.
- `addSubscriber` returns `{ subscription_id: 'pending-<hash>' }`. No
  email is sent. The site does NOT yet forward to Mailchimp / Buttondown.

This is intentional. Phase 1 proves the connection works end-to-end
without making storage the bottleneck. The build-a-bot integration
audit log records every successful post + every failed call, so
nothing is lost while the storage layer is being wired.

### When you're ready to flip on real storage

Edit the callback in the respective function file. The signature is:

```ts
async function storeBlog(payload, env) {
  // payload: { title, slug, body_markdown, excerpt?, tags?, publish_at? }
  // env:     Cloudflare env (KV namespaces, R2 buckets, secrets, etc.)
  return { slug: '...', url: 'https://...' };
}
```

Suggested implementations (pick one):

| Stack | Wire-up |
|---|---|
| **Sanity** | `client.create({ _type: 'post', title, slug, body_markdown })` → return `url: ${siteUrl}/blog/${slug}` |
| **Astro content collection** | Commit `src/content/blog/${slug}.md` + rebuild. Use the GitHub API to write + push, or wrap in a GitHub Action triggered by KV. |
| **Cloudflare KV** | `env.BLOG_KV.put(slug, JSON.stringify(payload))` → write a worker that builds pages from KV at request time. |
| **Notion / Contentful** | Use their CMS SDKs; treat `payload` as the API input. |

The agape-side decision is the operator's (Mavis). The drop-in module
imposes no opinion on storage — only on verification.

---

## 3. Env vars (Cloudflare Pages dashboard → Settings → Environment variables)

| Var | Required | Notes |
|---|---|---|
| `MOPHEUS_CODE_CLIENT_SLUG` | yes | Stable across domain changes. Same value as in the promo URL. |
| `MOPHEUS_CODE_SITE_URL` | yes | Canonical URL of this site. Must match the promo URL's `site_url`. |
| `MOPHEUS_CODE_PUBLIC_KEY` | yes | RS256 PEM. See `functions/_shared/.env.example`. |
| `MOPHEUS_CODE_DEMO_BEARER` | optional | Set during testing, **leave empty in production**. |

`functions/_shared/.env.example` is the canonical reference. Do NOT
commit real values to git — set them in the Cloudflare dashboard.

---

## 4. Operator runbook

### Phase 1 — testing access (set the demo bearer)

1. Generate a 32-byte hex string:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
2. Set `MOPHEUS_CODE_DEMO_BEARER` in the Cloudflare Pages dashboard
   to this value. Set `MOPHEUS_CODE_PUBLIC_KEY` to the .pub file Mavis
   generated via `scripts/generate-promo-keypair.ts`.
3. Hand the demo bearer to the client. The client pastes the promo URL
   into build-a-bot. build-a-bot derives a per-bot bearer. Posts go to
   `/api/blog/posts` on the site, accepted via the demo bearer.
4. Verify in build-a-bot's audit log:
   ```
   GET /admin/integrations/mopheus-code/recent-changes
   ```
   (operator-only; Mavis runs this from the build-a-bot admin section).

### Phase 2 — production (unset the demo bearer)

1. Confirm `MOPHEUS_CODE_DEMO_BEARER` is empty in production env.
2. Flip on real storage (Sanity commit, KV write, etc.) per §2 above.
3. Ship. The site now requires the RS256 + HKDF bearer path — only
   build-a-bot (which holds the private key) can sign valid promo URLs.

### Phase 3 — domain change (same `client_slug`, new `site_url`)

When agapenj.org moves to a new domain (e.g., agape-counseling.com):

1. Mavis mints a new promo URL with the **same `client_slug`** + **new `site_url`** via `scripts/sign-promo-url.ts`.
2. Mavis updates the **internal Mopheus Code clients table** with the new domain.
3. Client pastes the new URL into the Business Bot Builder chat.
4. build-a-bot's verify-promo route detects the domain change, soft-revokes the old row, creates a new one. Audit log records the change.
5. Update `MOPHEUS_CODE_SITE_URL` in the agape Pages env. Deploy.
6. **DO NOT** rotate the RS256 keypair. The private key is the same; only the `site_url` field in the promo URL changed.

---

## 5. What this doc does NOT cover

- **The build-a-bot side.** That's `build-a-bot/services/backend/src/modules/integrations/mopheus-code/`. The full integration spec is in `DESIGN.md §17`.
- **The private key.** Lives on Mavis's workstation in `~/.secrets/mopheus-code-promo-*.pem`. Never committed. Backed up to Mavis's password manager.
- **The newsletter provider.** Agape's `Newsletter.astro` already POSTs to `${PUBLIC_NEWSLETTER_ENDPOINT}/api/newsletter/subscribe` — when the build-a-bot bot is configured to use the §17 integration, set the endpoint to `https://agapenj.org/api/newsletter/subscribe` (this site). The bot's outbound call now hits the function above.
- **Multi-domain setups.** The build-a-bot side supports one `site_url` per promo URL. If agape wants multiple domains (apex + www + a redirect target), issue one promo URL per domain — each becomes a separate integration row.
