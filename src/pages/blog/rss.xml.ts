/**
 * Agape — Blog RSS feed (Tier 3+ feature).
 *
 * Generates /blog/rss.xml from the `blog` content collection, sorted
 * newest-first. Astro's @astrojs/rss integration isn't installed (kept
 * the dep count low for a Phase 1 site), so this hand-rolled
 * implementation emits a valid RSS 2.0 document. Validates against
 * the W3C Feed Validator XML schema.
 *
 * Tier gating: gated on site.features.blog, same as the other
 * /blog/ pages. The orchestrator cleans up the dist output for
 * tiers 1 + 2.
 *
 * Production handoff: when the client subscribes a real feed reader
 * to this URL, the orchestrator's PUBLIC_SITE_URL override should
 * point at the production domain (https://agapenj.org/blog/rss.xml).
 */
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { site } from '~/config/site';

export const GET: APIRoute = async ({ site: astroSite }) => {
  if (!site.features.blog) {
    return new Response('Blog feed not available in this tier', {
      status: 404,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  const posts = (await getCollection('blog')).sort(
    (a, b) => new Date(b.data.publishedAt).getTime() - new Date(a.data.publishedAt).getTime(),
  );

  // Use Astro.site (the build-time `site` config) as the base for absolute
  // post links. For demo builds this resolves to https://demo.mophe.us/
  // agape/tier-3/ (set in astro.config.mjs from the COMPANY + BUILD_TARGET
  // env vars); for production it's https://agapenj.org. Either way the
  // RSS feed reader hits a valid URL.
  //
  // Falls back to site.url from src/config/site.ts (always the production
  // canonical) if Astro.site is missing — that path is unlikely in
  // practice but the fallback prevents a broken feed.
  const baseUrl = (astroSite?.toString().replace(/\/$/, '')) ?? site.url.replace(/\/$/, '');

  const items = posts.map((post) => {
    const postUrl = `${baseUrl}/blog/${post.slug}/`;
    const pubDate = new Date(post.data.publishedAt).toUTCString();
    return `
    <item>
      <title><![CDATA[${post.data.title}]]></title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${post.data.summary}]]></description>
      <author>noreply@agapenj.org (${post.data.author})</author>
      ${post.data.tags.map((t) => `<category>${t}</category>`).join('\n      ')}
    </item>`;
  }).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Agape Counseling Services — Insights</title>
    <link>${baseUrl}/blog/</link>
    <atom:link href="${baseUrl}/blog/rss.xml" rel="self" type="application/rss+xml" />
    <description>Long-form articles on outpatient substance use disorder treatment, family support, and navigating recovery in Ocean County, NJ.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${items}
  </channel>
</rss>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};