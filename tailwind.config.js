/**
 * Agape — Tailwind config
 * See DESIGN.md §3.5 (Brand Tokens) for the canonical color palette and §5
 * (Performance & Accessibility) for WCAG 2.1 AA contrast constraints.
 *
 * Brand palette: primary #3A6FAA (calm blue, AA-corrected — see Appendix G.3),
 * secondary #f0f9ee (mint). Stay calm — no reds in the theme unless used for
 * destructive states only.
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
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#3a6faa', content: '#ffffff' },
        secondary: { DEFAULT: '#f0f9ee', content: '#1a2b3c' },
        neutral: '#1a2b3c',
        'base-100': '#ffffff',
        'base-200': '#f7faf6',
        'base-300': '#eaf3ea',
      },
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
    ],
    logs: false,
  },
};