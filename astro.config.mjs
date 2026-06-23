// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Build-time context — set by the build scripts
// (`scripts/build-demo.mjs`, `scripts/build-prod.mjs`).
//
//   COMPANY=agape        (default — the multi-tenant demo path prefix)
//   BUILD_TARGET=demo-N  → demo build for tier N (e.g., demo-1, demo-2, demo-3)
//   BUILD_TARGET=prod-N  → production build for tier N
//
// For demo builds, `base` is set to `/agape/tier-N/` so that all asset
// URLs (CSS/JS/images) resolve correctly under the path-based multi-
// tenant routing on demo.mophe.us. The post-build HTML rewriter in
// build-demo.mjs handles navigation links (Astro's `base` only
// prefixes asset paths, not <a href="..."> links).
const company = process.env.COMPANY || 'agape';
const buildTarget = process.env.BUILD_TARGET || '';
const tierMatch = buildTarget.match(/^demo-(\d+)$/);
const isDemoBuild = Boolean(tierMatch);
const base = isDemoBuild ? `/${company}/tier-${tierMatch[1]}/` : '/';

// Site canonical — demo build points at the demo platform (multi-tenant
// path), prod build points at the production domain. Both can be
// overridden via PUBLIC_SITE_URL at build time.
const defaultSite = isDemoBuild
  ? `https://demo.mophe.us/${company}/tier-${tierMatch[1]}/`
  : 'https://agapenj.org';
const site = process.env.PUBLIC_SITE_URL || defaultSite;

// Agape — Static site configuration
// See DESIGN.md §2 (Tech Stack), §3.1 (Page Model), §13 (Hosting
// Architecture), Appendix E (301 Redirect Map)
export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  build: {
    // Static-only output — fits Cloudflare Pages free tier
    format: 'directory',
  },
  integrations: [
    tailwind({
      // We import tailwind utilities via src/styles/global.css so DaisyUI classes
      // can compose with component-scoped <style> blocks. Disable the auto-import
      // behavior to keep a single, auditable CSS entry point.
      applyBaseStyles: false,
    }),
    // Sitemap is generated manually at public/sitemap.xml and copied
    // verbatim to dist/. The @astrojs/sitemap integration is intentionally
    // NOT used here — for a single-page site the dynamic generator adds
    // complexity (it chokes on the empty pages list when the build only
    // emits the index + 6 redirect pages). When Phase 2 adds routes
    // (e.g., /blog/*), re-enable the integration with an explicit `routes`
    // list to avoid the same edge case.
  ],
  redirects: {
    // Appendix E — 301 redirect map for legacy WordPress/Town Square Interactive URLs.
    // Astro emits static HTML at each source path with <meta http-equiv="refresh">
    // pointing to the new anchor. On Cloudflare Pages this is the canonical way
    // to preserve legacy URL → anchor routing for SEO continuity.
    //
    // The destination is build-target-aware: under a multi-tenant demo
    // build the anchor lives under /<company>/tier-N/#anchor, while the
    // prod build is single-page at apex so '/#anchor' is correct. A bare
    // '/#anchor' on a demo build would resolve against `site` (the apex),
    // sending the user to the mophe.us landing page — that's the bug
    // this conditional fixes.
    //
    // Spanish subpages mirror the same pattern. The /es/<sub>/ legacy
    // paths don't exist on the old WordPress site, but if a Spanish-
    // speaking user pastes /agape/tier-2/es/contact-us/ directly (or
    // a search engine surfaces it) they should land on the Spanish
    // page's contact anchor, not the EN page or the mophe.us bio.
    ...(isDemoBuild
      ? {
          '/our-services/': `/${company}/tier-${tierMatch[1]}/#services`,
          '/our-services': `/${company}/tier-${tierMatch[1]}/#services`,
          '/reviews/': `/${company}/tier-${tierMatch[1]}/#testimonials`,
          '/reviews': `/${company}/tier-${tierMatch[1]}/#testimonials`,
          '/contact-us/': `/${company}/tier-${tierMatch[1]}/#contact`,
          '/contact-us': `/${company}/tier-${tierMatch[1]}/#contact`,
          '/es/our-services/': `/${company}/tier-${tierMatch[1]}/es/#services`,
          '/es/our-services': `/${company}/tier-${tierMatch[1]}/es/#services`,
          '/es/reviews/': `/${company}/tier-${tierMatch[1]}/es/#testimonials`,
          '/es/reviews': `/${company}/tier-${tierMatch[1]}/es/#testimonials`,
          '/es/contact-us/': `/${company}/tier-${tierMatch[1]}/es/#contact`,
          '/es/contact-us': `/${company}/tier-${tierMatch[1]}/es/#contact`,
          // NOTE on /agape/ → /companies/agape/: kept out of the per-
          // client astro.config because the orchestrator's path-prefixing
          // step rewrites absolute-root redirects to /agape/tier-N/agape/
          // and drops them under the wrong tier. The redirect is owned
          // by the platform instead, in dev/site/dist/_redirects.
        }
      : {
          '/our-services/': '/#services',
          '/our-services': '/#services',
          '/reviews/': '/#testimonials',
          '/reviews': '/#testimonials',
          '/contact-us/': '/#contact',
          '/contact-us': '/#contact',
        }),
  },
  vite: {
    // Path aliases (also declared in tsconfig.json) — keeping both in
    // sync is intentional so TypeScript and the runtime bundler agree.
    resolve: {
      alias: {
        '~': resolve(__dirname, 'src'),
        '@': resolve(__dirname, 'src'),
        '@components': resolve(__dirname, 'src/components'),
        '@layouts': resolve(__dirname, 'src/layouts'),
        '@content': resolve(__dirname, 'src/content'),
      },
    },
    build: {
      // Astro 4 + Tailwind + DaisyUI is tree-shakeable; explicit chunk split is
      // unnecessary for a single-page site. Keep build lean.
      cssCodeSplit: true,
    },
  },
});
