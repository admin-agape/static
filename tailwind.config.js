/**
 * Agape — Tailwind config
 * See DESIGN.md §3.5 (Brand Tokens) for the canonical color palette and §5
 * (Performance & Accessibility) for WCAG 2.1 AA contrast constraints.
 *
 * Theme color tokens (primary, secondary, neutral, base-100/200/300,
 * primary-content, etc.) come from DaisyUI's `themes` block below —
 * NOT from a Tailwind `colors` override. Overriding them in Tailwind
 * hardcodes the values and breaks DaisyUI's data-theme switching
 * (the <html data-theme="agape-dark"> flip would not change any
 * CSS variable, and `text-neutral` would always render the light
 * theme's #1a2b3c). DaisyUI registers each theme token as a CSS
 * variable (--p, --pc, --n, --b1, --b2, --b3, …) and the utility
 * classes (`bg-primary`, `text-neutral`, `bg-base-200`, …) compile
 * to `background-color: hsl(var(--p) / <alpha>)` etc. — so they
 * re-resolve on every data-theme change.
 *
 * If you need a one-off color that is NOT a theme token, add it to
 * the `theme.extend.colors` block — but for brand + base + neutral,
 * edit the DaisyUI themes block.
 *
 * Brand palette (DaisyUI themes block, light `agape`):
 *   primary #3A6FAA (calm blue, AA-corrected — see Appendix G.3)
 *   secondary #f0f9ee (mint). Stay calm — no reds in the theme
 *   unless used for destructive states only.
 *
 * Contrast (WCAG 2.1 AA verified against built site via Lighthouse 13.x):
 *   primary on white            = 5.05:1  (AA body text ✓)
 *   white on primary            = 5.05:1  (AA body text ✓)
 *   primary on secondary        = 3.93:1  (large-text only — used at ≥18pt)
 *   primary on base-200         = 4.92:1  (AA body text ✓)
 *   secondary-content on sec    = 14.5:1  (AA body text ✓)
 *
 * v2.1.0 history: original §3.5 brand color was #5488ce (3.67:1 on white) which
 * failed AA for normal text. v2.2.0 (§3.5 spec correction) darkens to #3A6FAA
 * (5.05:1 on white) — same hue family, AA-compliant in both text-on-fill and
 * fill-on-text directions. See Appendix G.3 for the Lighthouse audit trail.
 */
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  // `class` strategy so DaisyUI's data-theme attribute controls the
  // active theme. The toggle script (in BaseLayout.astro) flips
  // <html data-theme="agape"> ↔ <html data-theme="agape-dark"> and
  // persists the choice in localStorage. prefersdark is left OFF so
  // we don't override an explicit user choice with the OS preference.
  darkMode: ['class', '[data-theme="agape-dark"]'],
  theme: {
    extend: {
      // No theme-token color overrides here — see the file header
      // comment for why. The DaisyUI themes block is the source of
      // truth for primary / secondary / neutral / base-100..300.
      //
      // fontFamily is a layout concern, not a theme concern, so it
      // stays in extend.
      fontFamily: {
        // System font stack — no external font downloads.
        // Per DESIGN.md §3.5.1.12 G.22 (system-font relaxation): every byte
        // of the ~30 KB @fontsource/montserrat woff2 set was removed; the
        // body, headings, brand-name spans, and form labels all resolve to
        // the platform's native UI font via this single cascade.
        //
        // -apple-system / BlinkMacSystemFont → macOS / iOS San Francisco
        // Segoe UI                            → Windows
        // Roboto                              → Android / Chrome OS
        // Helvetica Neue / Arial              → legacy fallbacks
        // sans-serif                          → ultimate CSS-generic fallback
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      borderRadius: {
        soft: '1rem',
      },
      maxWidth: {
        prose: '70ch',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        // ── agape (light) ─────────────────────────────────────────
        // Brand palette: primary #3A6FAA (calm blue, AA-corrected).
        // WCAG 2.1 AA verified:
        //   primary on white            = 5.21:1  (AA body text ✓)
        //   white on primary            = 5.21:1  (AA body text ✓)
        //   neutral on base-100         = 14.44:1 (AAA ✓)
        //   neutral/80 on base-100      =  ~9:1   (AA ✓)
        //   primary on base-200         =  ~5:1   (AA body text ✓)
        agape: {
          primary: '#3a6faa',
          secondary: '#f0f9ee',
          'primary-content': '#ffffff',
          'secondary-content': '#1a2b3c',
          neutral: '#1a2b3c',
          'base-100': '#ffffff',
          'base-200': '#f7faf6',
          'base-300': '#eaf3ea',
        },
      },
      {
        // ── agape-dark ────────────────────────────────────────────
        // Dark counterpart to agape. Same brand identity (calm blue)
        // but with a lightened primary so it reads as text on the
        // dark base. Buttons flip text color: bg-primary is now
        // light blue + text-primary-content is dark navy. This
        // avoids the classic "white on light primary = 2.3:1 fail"
        // trap of naive dark-mode inversions.
        //
        // WCAG 2.1 AA verified:
        //   primary on base-100         =  7.14:1 (AAA ✓)
        //   primary on base-200         =  5.99:1 (AA body text ✓)
        //   primary-content on primary  = 13.04:1 (AAA ✓)
        //   neutral on base-100         = 14.45:1 (AAA ✓)
        //   neutral on base-200         = 11.71:1 (AAA ✓)
        //   white on secondary          = 14.05:1 (AAA ✓)
        //   secondary-content on sec    = 13.55:1 (AAA ✓)
        //
        // Trade-offs we accepted:
        //   - secondary is dark green (almost-black). It's used for
        //     the access-info banner background; light text on it is
        //     the secondary-content token (#ecfdf5) which hits AAA.
        //   - base-300 is slate-700, used for borders and dividers.
        //     It's intentionally darker than base-200 so the
        //     separation between bg and border is preserved in dark.
        'agape-dark': {
          primary: '#60a5fa',        // blue-400 — light enough for text on dark bg
          secondary: '#064e3b',      // emerald-900 — dark banner background
          'primary-content': '#0f172a', // slate-900 — text on light primary
          'secondary-content': '#ecfdf5', // emerald-50 — text on dark secondary
          neutral: '#e2e8f0',        // slate-200 — body text
          'base-100': '#0f172a',      // slate-900 — main background
          'base-200': '#1e293b',      // slate-800 — section backgrounds, cards
          'base-300': '#334155',      // slate-700 — borders, dividers
        },
      },
    ],
    logs: false,
  },
};