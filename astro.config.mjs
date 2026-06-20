// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Agape — Static site configuration
// See DESIGN.md §2 (Tech Stack), §3.1 (Page Model), Appendix E (301 Redirect Map)
export default defineConfig({
  site: 'https://www.mosmovs.win',
  trailingSlash: 'never',
  build: {
    // Static-only output — fits GitHub Pages free tier
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
    // pointing to the new anchor. On GitHub Pages this is the canonical way to
    // preserve legacy URL → anchor routing for SEO continuity.
    '/our-services/': '/#services',
    '/our-services': '/#services',
    '/reviews/': '/#testimonials',
    '/reviews': '/#testimonials',
    '/contact-us/': '/#contact',
    '/contact-us': '/#contact',
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
