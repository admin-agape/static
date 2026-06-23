// mopheus-code-integration.mjs
//
// Drop-in integration endpoints for Mopheus Code × Build-a-Bot
// (DESIGN.md §17). Copy this file into a client site's `lib/` (or
// any folder), set the env vars described in `.env.example`, and
// wire the routes into whatever framework the site uses.
//
// NO external dependencies. Pure ESM + Web Crypto API. Works in:
//   - Node 20+ (Express, Fastify, plain http, Next.js API routes,
//     Astro endpoints, Remix loaders, etc.)
//   - Cloudflare Workers
//   - Bun
//   - Deno
//
// The module exports:
//   - `verifyBearer({ publicKeyPem, demoBearer, expectedSlug, expectedSiteUrl })`
//     → middleware-style function: `(request) -> Promise<{ ok, reason? }>`
//   - `handleBlogPost({ storeBlog })` → request handler
//   - `handleNewsletterSubscribe({ addSubscriber })` → request handler
//   - `createIntegrationEndpoints({ publicKeyPem, demoBearer, expectedSlug,
//     expectedSiteUrl, storeBlog, addSubscriber })`
//     → { verifyBearer, handleBlogPost, handleNewsletterSubscribe }
//   - `createExpressRouter(...)` → Express router (Node 20+ only)
//   - `createCloudflareWorker(...)` → { fetch } handler
//
// SECURITY POSTURE
// ----------------
// - The bearer is per-bot: HKDF-SHA256 over (signature_bytes, site_url,
//   "mopheus-code-site-{client_slug}", 32 bytes). A leak from one bot
//   does not compromise another.
// - The demo bearer is per-site: configured by the operator (you).
//   When the site is in production, leave MOPHEUS_CODE_DEMO_BEARER
//   empty — only RS256 HKDF verification will succeed.
// - The X-Mopheus-Code-Promo header is required for RS256 verification.
//   It's the original signed promo JWT the client pasted into
//   build-a-bot; build-a-bot re-derives the HKDF from the signature.
// - All endpoints log to `console.info` / `console.warn`. The bearer
//   is NEVER logged.

import { webcrypto } from 'node:crypto';

const subtle = globalThis.crypto?.subtle ?? webcrypto.subtle;
const TextEncoderImpl = globalThis.TextEncoder ?? (await import('node:util')).TextEncoder;
const TextDecoderImpl = globalThis.TextDecoder ?? (await import('node:util')).TextDecoder;
const btoaImpl = globalThis.btoa ?? ((s) => Buffer.from(s, 'binary').toString('base64'));
const atobImpl = globalThis.atob ?? ((s) => Buffer.from(s, 'base64').toString('binary'));

// ── Crypto helpers ────────────────────────────────────────────────────────

function b64UrlDecode(s) {
  let b64 = s.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4 !== 0) b64 += '=';
  return Uint8Array.from(atobImpl(b64), (c) => c.charCodeAt(0));
}

function b64UrlDecodeJson(s) {
  return JSON.parse(new TextDecoderImpl().decode(b64UrlDecode(s)));
}

async function hkdfSha256(ikm, salt, info, length = 32) {
  const ikmKey = await subtle.importKey('raw', ikm, 'HKDF', false, ['deriveBits']);
  // If salt > 64 bytes (SHA-256 block size), hash it first per RFC 5869 §2.2.
  let saltBytes = new TextEncoderImpl().encode(salt);
  if (saltBytes.length > 64) {
    const hashed = await subtle.digest('SHA-256', saltBytes);
    saltBytes = new Uint8Array(hashed);
  }
  const infoBytes = new TextEncoderImpl().encode(info);
  // HKDF-Expand needs `info` as a BufferSource; pass it raw.
  const bits = await subtle.deriveBits(
    { name: 'HKDF', hash: 'SHA-256', salt: saltBytes, info: infoBytes },
    ikmKey,
    length * 8,
  );
  return new Uint8Array(bits);
}

async function importRsaPublicKey(pem) {
  // Strip the PEM armor and base64-decode.
  const b64 = pem
    .replace(/-----BEGIN [^-]+-----/g, '')
    .replace(/-----END [^-]+-----/g, '')
    .replace(/\s+/g, '');
  const der = Uint8Array.from(atobImpl(b64), (c) => c.charCodeAt(0));
  return await subtle.importKey(
    'spki',
    der,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['verify'],
  );
}

function timingSafeEqualStr(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

function toB64Url(bytes) {
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoaImpl(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

// ── Bearer verification ────────────────────────────────────────────────────

/**
 * Verify a build-a-bot request. Returns `{ ok: true }` on success,
 * `{ ok: false, reason }` on failure. The reason string is safe to
 * log — it never includes the bearer or the signature.
 *
 * `request` is the framework-agnostic shape:
 *   { authorization?: string, xMopheusCodePromo?: string, method, path }
 *
 * The `expectedSlug` + `expectedSiteUrl` parameters are the values
 * baked into this site's deployment — they're the "is this the right
 * promo for THIS site?" check.
 */
export async function verifyBearer({
  request,
  publicKeyPem,
  demoBearer,
  expectedSlug,
  expectedSiteUrl,
}) {
  const authHeader = request.authorization ?? '';
  if (!authHeader.startsWith('Bearer ')) {
    return { ok: false, reason: 'missing_authorization' };
  }
  const bearer = authHeader.slice('Bearer '.length);

  // ── Path 1: demo bearer (testing access) ────────────────────────────
  // The demo bearer is the operator's per-site static token. It's
  // a no-strings-attached escape hatch for the "unwired paywall"
  // phase: Mopheus Code ships a site with MOPHEUS_CODE_DEMO_BEARER
  // set, the client tests with it, and when billing is wired the
  // operator unsets the demo bearer and the site rejects all non-
  // HKDF matches.
  if (demoBearer && timingSafeEqualStr(bearer, demoBearer)) {
    return { ok: true, mode: 'demo_bearer' };
  }

  // ── Path 2: RS256 + HKDF ─────────────────────────────────────────────
  const promoJwt = request.xMopheusCodePromo;
  if (!promoJwt) {
    return { ok: false, reason: 'missing_promo' };
  }

  // Parse the JWT.
  const parts = promoJwt.split('.');
  if (parts.length !== 3) {
    return { ok: false, reason: 'malformed_promo' };
  }
  const [headerB64, payloadB64, signatureB64] = parts;

  let header;
  let payload;
  try {
    header = b64UrlDecodeJson(headerB64);
    payload = b64UrlDecodeJson(payloadB64);
  } catch {
    return { ok: false, reason: 'unparseable_promo' };
  }

  if (header.alg !== 'RS256') {
    return { ok: false, reason: 'unsupported_algorithm' };
  }
  if (payload.issuer !== 'mopheus-code') {
    return { ok: false, reason: 'wrong_issuer' };
  }
  if (payload.client_slug !== expectedSlug) {
    return { ok: false, reason: 'slug_mismatch' };
  }
  if (payload.site_url !== expectedSiteUrl) {
    return { ok: false, reason: 'site_url_mismatch' };
  }
  if (new Date(payload.expires_at).getTime() < Date.now()) {
    return { ok: false, reason: 'expired_promo' };
  }

  // Verify the RS256 signature against the published public key.
  let publicKey;
  try {
    publicKey = await importRsaPublicKey(publicKeyPem);
  } catch (err) {
    return { ok: false, reason: 'invalid_public_key', error: String(err) };
  }
  const signingInput = new TextEncoderImpl().encode(`${headerB64}.${payloadB64}`);
  const signature = b64UrlDecode(signatureB64);
  let sigOk;
  try {
    sigOk = await subtle.verify('RSASSA-PKCS1-v1_5', publicKey, signature, signingInput);
  } catch {
    return { ok: false, reason: 'verify_threw' };
  }
  if (!sigOk) {
    return { ok: false, reason: 'invalid_signature' };
  }

  // Derive the site-level bearer from the signature + site_url + slug.
  const expectedSiteBearer = await hkdfSha256(
    signature,
    payload.site_url,
    `mopheus-code-site-${payload.client_slug}`,
  );
  const expectedSiteBearerB64 = toB64Url(expectedSiteBearer);
  if (!timingSafeEqualStr(bearer, expectedSiteBearerB64)) {
    return { ok: false, reason: 'invalid_bearer' };
  }

  return { ok: true, mode: 'rs256_hkdf', clientSlug: payload.client_slug };
}

// ── Body parsing ──────────────────────────────────────────────────────────

async function readJsonBody(request) {
  if (request.body !== undefined) {
    if (typeof request.body === 'string') {
      return JSON.parse(request.body);
    }
    return request.body;
  }
  // Web Request (Cloudflare Workers / Bun / Deno)
  if (request.request && typeof request.request.text === 'function') {
    const text = await request.request.text();
    return text ? JSON.parse(text) : {};
  }
  return {};
}

// ── Endpoint handlers ──────────────────────────────────────────────────────

/**
 * Handle a `POST /api/blog/posts` request. Validates the body shape,
 * verifies the bearer, then calls `storeBlog(payload)` and returns
 * `{ slug, url }` on success.
 */
export async function handleBlogPost({
  request,
  verify,
  storeBlog,
}) {
  const v = await verify(request);
  if (!v.ok) {
    return new Response(JSON.stringify({ error: v.reason }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  let payload;
  try {
    payload = await readJsonBody(request);
  } catch {
    return new Response(JSON.stringify({ error: 'invalid_json' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const required = ['title', 'slug', 'body_markdown'];
  for (const f of required) {
    if (typeof payload[f] !== 'string' || payload[f].length === 0) {
      return new Response(JSON.stringify({ error: 'missing_field', field: f }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }
  try {
    const result = await storeBlog(payload);
    return new Response(JSON.stringify(result), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'store_failed', message: String(err) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
}

/**
 * Handle a `POST /api/newsletter/subscribe` request. Validates the
 * email + source, verifies the bearer, then calls `addSubscriber(...)`.
 */
export async function handleNewsletterSubscribe({
  request,
  verify,
  addSubscriber,
}) {
  const v = await verify(request);
  if (!v.ok) {
    return new Response(JSON.stringify({ error: v.reason }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  let payload;
  try {
    payload = await readJsonBody(request);
  } catch {
    return new Response(JSON.stringify({ error: 'invalid_json' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  if (typeof payload.email !== 'string' || !payload.email.includes('@')) {
    return new Response(JSON.stringify({ error: 'invalid_email' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  if (payload.source !== 'build-a-bot') {
    return new Response(JSON.stringify({ error: 'wrong_source' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  try {
    const result = await addSubscriber(payload);
    return new Response(JSON.stringify({ ok: true, ...result }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'store_failed', message: String(err) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
}

// ── Express adapter (Node 20+) ─────────────────────────────────────────────

/**
 * Returns an Express router with the two endpoints mounted. Express
 * only — for Cloudflare Workers / Bun / Deno, use createCloudflareWorker
 * or wire handleBlogPost/handleNewsletterSubscribe directly.
 *
 * Usage:
 *
 *   import express from 'express';
 *   import { createExpressRouter } from './mopheus-code-integration.mjs';
 *
 *   const app = express();
 *   app.use(express.json({ limit: '128kb' }));
 *   app.use(createExpressRouter({
 *     publicKeyPem: process.env.MOPHEUS_CODE_PUBLIC_KEY,
 *     demoBearer: process.env.MOPHEUS_CODE_DEMO_BEARER,
 *     expectedSlug: process.env.MOPHEUS_CODE_CLIENT_SLUG,
 *     expectedSiteUrl: process.env.MOPHEUS_CODE_SITE_URL,
 *     storeBlog: async (payload) => myBlogStore.create(payload),
 *     addSubscriber: async (payload) => myNewsletterStore.subscribe(payload),
 *   }));
 */
export function createExpressRouter({
  publicKeyPem,
  demoBearer,
  expectedSlug,
  expectedSiteUrl,
  storeBlog,
  addSubscriber,
}) {
  const verify = (request) =>
    verifyBearer({
      request,
      publicKeyPem,
      demoBearer,
      expectedSlug,
      expectedSiteUrl,
    });

  return async (req, res, next) => {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'method_not_allowed' });
      return;
    }
    const path = req.path || req.url;
    try {
      let response;
      if (path === '/api/blog/posts' || path.endsWith('/api/blog/posts')) {
        response = await handleBlogPost({
          request: {
            authorization: req.headers.authorization,
            xMopheusCodePromo: req.headers['x-mopheus-code-promo'],
            method: req.method,
            path,
            body: req.body,
          },
          verify,
          storeBlog,
        });
      } else if (
        path === '/api/newsletter/subscribe' ||
        path.endsWith('/api/newsletter/subscribe')
      ) {
        response = await handleNewsletterSubscribe({
          request: {
            authorization: req.headers.authorization,
            xMopheusCodePromo: req.headers['x-mopheus-code-promo'],
            method: req.method,
            path,
            body: req.body,
          },
          verify,
          addSubscriber,
        });
      } else {
        return next();
      }
      const text = await response.text();
      res.status(response.status)
        .type('application/json')
        .send(text);
    } catch (err) {
      next(err);
    }
  };
}

// ── Cloudflare Workers adapter ────────────────────────────────────────────

/**
 * Returns a `{ fetch }` handler suitable for a Cloudflare Worker
 * (or any runtime with a `fetch(request, env, ctx)` signature).
 *
 * Usage in `wrangler.toml`:
 *
 *   [vars]
 *   MOPHEUS_CODE_PUBLIC_KEY = "-----BEGIN PUBLIC KEY-----..."
 *   MOPHEUS_CODE_CLIENT_SLUG = "agape"
 *   MOPHEUS_CODE_SITE_URL = "https://agapenj.org"
 *   # MOPHEUS_CODE_DEMO_BEARER is unset in production.
 *
 * Usage in `src/index.ts`:
 *
 *   import { createCloudflareWorker } from './mopheus-code-integration.mjs';
 *   export default {
 *     fetch: createCloudflareWorker({
 *       envToConfig: (env) => ({
 *         publicKeyPem: env.MOPHEUS_CODE_PUBLIC_KEY,
 *         demoBearer: env.MOPHEUS_CODE_DEMO_BEARER,
 *         expectedSlug: env.MOPHEUS_CODE_CLIENT_SLUG,
 *         expectedSiteUrl: env.MOPHEUS_CODE_SITE_URL,
 *       }),
 *       storeBlog: async (payload, env) => {
 *         // env.DB, env.R2, etc.
 *         return { slug: payload.slug, url: `${env.SITE_URL}/blog/${payload.slug}` };
 *       },
 *       addSubscriber: async (payload, env) => {
 *         return { subscription_id: 'pending' };
 *       },
 *     }),
 *   };
 */
export function createCloudflareWorker({
  envToConfig,
  storeBlog,
  addSubscriber,
}) {
  return async function fetch(request, env, _ctx) {
    const url = new URL(request.url);
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'method_not_allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const config = envToConfig(env);
    // Build the framework-agnostic `request` object once and pass it
    // to both verifyBearer (for auth) and the handler (for body
    // parsing). This keeps the verify/handler interface uniform
    // across Express, Cloudflare, and plain Node.
    const requestObj = {
      authorization: request.headers.get('authorization') ?? undefined,
      xMopheusCodePromo: request.headers.get('x-mopheus-code-promo') ?? undefined,
      method: request.method,
      path: url.pathname,
      request, // keep raw Request available for handler body parsing
    };
    const verify = (r) =>
      verifyBearer({
        request: r,
        publicKeyPem: config.publicKeyPem,
        demoBearer: config.demoBearer,
        expectedSlug: config.expectedSlug,
        expectedSiteUrl: config.expectedSiteUrl,
      });

    if (url.pathname === '/api/blog/posts') {
      return await handleBlogPost({
        request: requestObj,
        verify,
        storeBlog: (payload) => storeBlog(payload, env),
      });
    }
    if (url.pathname === '/api/newsletter/subscribe') {
      return await handleNewsletterSubscribe({
        request: requestObj,
        verify,
        addSubscriber: (payload) => addSubscriber(payload, env),
      });
    }
    return new Response('Not Found', { status: 404 });
  };
}
