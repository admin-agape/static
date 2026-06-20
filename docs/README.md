# Agape Counseling Services — Website Repository

> **One-and-Done Handoff.** You own this repository and the
> infrastructure dashboard. No technical maintenance is required from
> the original developer. No ongoing subscription fees. This README is
> your map.

---

## What This Is

The production website for **Agape Counseling Services**, a
501(c)(3) outpatient substance use disorder counseling practice in
Lanoka Harbor, NJ. Built as a static site (zero JavaScript at idle,
zero third-party trackers, full WCAG 2.1 AA compliance) and deployed
to **GitHub Pages** at `agapenj.org`.

The website was rebuilt from a legacy WordPress / Town Square
Interactive setup that was costing the practice $1,788/year and
shipping 200+ KB of legacy JavaScript on every page load. The
rebuild costs ~$15/year (domain registration only) and ships under
15 KB total transfer on every page.

---

## Infrastructure Inventory (Authoritative DNS & Email Records)

Your infrastructure is small, owned, and fully documented. Future IT
support — whether that's a new volunteer, a board member's nephew,
or a paid consultant — has a complete map below.

### DNS records at `agapenj.org` (managed in Cloudflare)

| Record type | Host | Value | Purpose | Touched by this build? |
|---|---|---|---|---|
| `A` | `@` (apex) | `185.199.108.153` | GitHub Pages | **YES** (cut from TSI) |
| `A` | `@` (apex) | `185.199.109.153` | GitHub Pages | **YES** (cut from TSI) |
| `A` | `@` (apex) | `185.199.110.153` | GitHub Pages | **YES** (cut from TSI) |
| `A` | `@` (apex) | `185.199.111.153` | GitHub Pages | **YES** (cut from TSI) |
| `CNAME` | `www` | `<your-org>.github.io` | GitHub Pages (optional) | NO (added during cutover) |
| `MX` | `@` (apex) | `1 aspmx.l.google.com.` etc. | **Google Workspace email** | **NO — never modified** |
| `TXT` | `@` (apex) | `v=spf1 include:_spf.google.com ~all` | **SPF — email authentication** | NO (already in place; read-only) |
| `TXT` | `google._domainkey` | (Google-supplied DKIM key) | **DKIM — email signing** | NO (already in place; read-only) |
| `TXT` | `_dmarc` | `v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@agapenj.org; pct=100; adkim=s; aspf=s; fo=1` | **DMARC — email authentication policy** | **YES** (added at cutover; default `p=quarantine`) |

### Services and accounts

| Service | What it does | Login at | Who owns it |
|---|---|---|---|
| **GitHub organization** | Hosts the source repo + deploys to Pages | `github.com/<your-org>/agape` | You (the client) |
| **Cloudflare** | Authoritative DNS + Web Analytics beacon | `dash.cloudflare.com` | You |
| **Web3Forms** | Contact form relay (sends form submissions to your inbox) | `web3forms.com` | You |
| **Google Workspace** | Email hosting — **untouched by this build** | `admin.google.com` | You (pre-existing) |
| **Domain registrar** | Where you renew `agapenj.org` annually (~$15/year) | (Your existing registrar) | You |

### What the cutover did and did NOT do

**The website cutover modified:**
- The four `A` records pointing at `agapenj.org` (now point to GitHub Pages IPs instead of TSI)
- Added a `www` CNAME record pointing at `<your-org>.github.io`
- Added a single new `TXT` record at `_dmarc.agapenj.org` (the DMARC policy)

**The cutover did NOT modify:**
- Any `MX` records (your Google Workspace email is untouched)
- Any existing `TXT` records (SPF, DKIM, domain verification)
- Any `CNAME` records that Google Workspace depends on
- Your email service in any way

You can verify this yourself at any time:

```bash
# Should return 4 GitHub Pages IPs:
dig A agapenj.org +short

# Should return Google's mail servers (unchanged from before cutover):
dig MX agapenj.org +short

# Should return the DMARC record published at cutover:
dig TXT _dmarc.agapenj.org +short
```

---

## How to Edit Content (Plain English)

> **Full step-by-step guide:** see [`EDITING_GUIDE.md`](./EDITING_GUIDE.md)
> for the non-technical walkthrough with screenshots. This section
> is the executive summary.

Every word on the website lives in a **plain text file** in this
repository — Markdown (`.md`) for service descriptions and
testimonials, JSON for the FAQ. The layout is unaffected when you
edit text — you change the file, GitHub rebuilds the site, the
change is live in about 60 seconds.

| To change this... | Open this file... |
|---|---|
| A service description | `src/content/services/<service>.md` |
| The access banner (bilingual / Medicaid / no-wait) | `src/pages/index.astro` (the `<section id="access">` block) |
| The mission statement | `src/pages/index.astro` (the `<section id="about">` block) |
| Footer legal disclaimers | `src/components/Footer.astro` |
| **A new FAQ question** | **`src/data/faq.json`** — see `EDITING_GUIDE.md` §2.5 |
| **The homepage title / meta description** | **`src/layouts/BaseLayout.astro`** — see `EDITING_GUIDE.md` §4 |
| A testimonial (Phase 2, requires signed consent) | `src/content/testimonials/<name>.md` |
| Per-service Google search snippet | The `seo:` block at the top of `src/content/services/<service>.md` |

### The `seo:` frontmatter shape (per-service)

Every content collection Markdown file accepts an optional `seo:` block
at the bottom of its frontmatter:

```markdown
---
title: "Intensive Outpatient Program (IOP)"
order: 1
icon: "users"
summary: "..."
seo:
  title: "Intensive Outpatient Program in Lanoka Harbor, NJ | Agape"
  description: "Group IOP three nights a week, evidence-based, with a weekly individual session. Medicaid accepted, no wait list. (609) 242-0086."
---
```

All three fields are **optional**. If you omit them, the page uses
the BaseLayout defaults — so you only need to add `seo:` when you
want a specific page to differ from the site-wide defaults.

| Field | Character limit | Where it shows |
|---|---|---|
| `seo.title` | ≤ 60 | Blue headline in Google search results |
| `seo.description` | ≤ 155 | Gray snippet under the headline |
| `seo.ogImage` | (absolute URL) | Image preview when shared on Facebook/LinkedIn |

> ⚠️ **DO NOT confuse `title:` with `seo.title`.** The top-level
> `title:` field is the **in-page heading** (the H2 inside a service
> card). The `seo.title` field is what **Google reads** in search
> results. They look similar; they do different jobs. See
> `EDITING_GUIDE.md` §4 for screenshots.

**The two ways to edit:**

1. **GitHub web UI** (recommended for non-developers) — open the file
   in your browser at `github.com/<your-org>/agape`, click the pencil
   icon, edit, click "Commit changes." Done.
2. **Local clone + git push** — for developers who prefer their own
   editor. See `EDITING_GUIDE.md` § "Local development setup" if
   needed; the GitHub web UI is sufficient for 95% of edits.

---

## How to Deploy

**Automatic.** Every push to the `main` branch triggers a GitHub
Actions workflow (`.github/workflows/deploy.yml`) that runs the
following gates before deploying:

1. `npm ci` — install pinned dependencies
2. `npm run check:faq` — validate the FAQ data file (§3.3.8)
3. `npm run check:logo-size` — enforce the logo asset library budget
4. `npm run build` — full Astro build (emits `dist/`)
5. **SEO emission check** — confirms `<title>`, `<meta
   description>`, `<link rel="canonical">`, full OG block, and
   full Twitter card block are in the built HTML
6. **MedicalClinic JSON-LD check** — confirms the Schema.org
   structured-data block is valid, contains all required fields,
   and does NOT contain the §10.2.1 forbidden fields (`founder`,
   `employee`, `member`, `review`, `aggregateRating`, etc.)
7. **Brand Logo wiring check** — confirms `<link rel="icon">` and
   the Navbar `<img>` reference `/brand/company-logo.svg`
8. **FAQ section check** — confirms 10 `<details id="faq-q-...">`
   elements match the JSON-LD `Question` count, and each
   `<summary>` has `min-height: 44px` for WCAG 2.5.5 tap-target
9. **301 redirect map check** — confirms the Appendix E legacy
   URLs (`/contact-us/`, `/our-services/`, `/reviews/`) emit
   static redirect HTML
10. **Performance budget check** — confirms `dist/index.html` < 100
    KB raw, CSS < 80 KB raw, and zero Astro JS bundles (the §5.3
    "0 KB framework JS at idle" floor)
11. Deploys to GitHub Pages

You don't need to do anything. Edit the file, commit to `main`,
the gates pass, and the site is live within 60 seconds.

The build status is visible at
`github.com/<your-org>/agape/actions`. A green checkmark means
the deploy succeeded; a red X means a gate failed (the Actions
log shows exactly which gate — usually a Markdown / JSON syntax
error in a file you just edited).

---

## How to Roll Back a Bad Change

Three options, fastest first:

1. **GitHub web UI → Revert** (under 60 seconds)
   - Go to `github.com/<your-org>/agape/commits/main`
   - Find the commit that introduced the bad change
   - Click "Revert" → "Create pull request" → "Merge pull request"
   - The site reverts to the previous state on next deploy
2. **`git revert` from a local clone** (under 60 seconds)
   - `git revert HEAD && git push`
3. **DNS rollback** (under 5 minutes, only if the whole site is down)
   - In Cloudflare DNS, point `agapenj.org` back to the TSI nameservers
   - The old Town Square Interactive site comes back up immediately

For normal "I made a typo / want to undo one change" cases, option 1
is what you want.

---

## One-and-Done Handoff Statement

**You own everything. There is no ongoing relationship required with
the original developer.** Specifically:

- The **source code** is yours (MIT license, in this repository).
- The **content** is yours (Markdown files you edit directly).
- The **infrastructure** is yours (GitHub org, Cloudflare account,
  Web3Forms account, Google Workspace, domain registrar — all
  accounts you control).
- The **deploy pipeline** is yours (GitHub Actions runs on YOUR repo,
  no external CI service).
- The **credentials** are yours (handed over in the sealed envelope
  at the demo per `EDITING_GUIDE.md` § "Credential log").
- There are **no subscription fees** from the original developer.
- There are **no usage limits** beyond the free-tier limits of the
  services above (250 form submissions/month for Web3Forms, unlimited
  for everything else).
- There are **no proprietary dependencies** — every line of code,
  every config, every DNS record is in this repository or your
  Cloudflare account.

The only **ongoing cost** is your domain registration (~$15/year)
and your existing Google Workspace subscription (whatever you pay
now). Both are billed directly to you by their respective vendors;
neither involves the original developer.

---

## 30-Day Post-Demo Support Window

For 30 days after the demo, the original developer is available for
questions — anything from "how do I add a new service?" to "the
deploy failed, what do I do?" Contact details are in the sealed
envelope handed over at the demo.

After 30 days, the project is fully self-sufficient. If you need
help in the future, you can re-engage the original developer (or
any developer) as a separate paid engagement.

---

## Tech Stack Reference

For developers / IT support who need to understand the build:

- **Astro 4** — static site generator, zero JS at idle
- **Tailwind 3 + DaisyUI 4** — utility-first CSS + component library
- **GitHub Pages** — static hosting with native HTTPS
- **Cloudflare** — authoritative DNS + Web Analytics + edge proxy
- **Web3Forms** — form relay (no server-side code required)
- **Astro content collections** — Markdown files in `src/content/`
  drive every editable element of the site

The full internal architecture spec is in `DESIGN.md` (not needed
for routine content editing; available for developers joining the
project).

---

## Repository Layout

```
agape/
├── README.md                       ← This file (your entry point)
├── EDITING_GUIDE.md                ← Non-technical editing how-to (with screenshots)
├── CLIENT-PROPOSAL.md              ← Client-facing upgrade proposal
├── DESIGN.md                       ← Internal architecture spec (for developers)
├── COMPLIANCE.md                   ← §6 sign-off audit trail
├── astro.config.mjs                ← Astro configuration + redirect map (Appendix E)
├── tailwind.config.js              ← Tailwind + DaisyUI theme (§3.5)
├── package.json                    ← Dependencies + npm scripts (check:faq, check:logo-size, build)
├── .github/workflows/deploy.yml    ← Auto-deploy on push to main (10 CI gates)
├── scripts/
│   ├── check-faq.mjs               ← §3.3.8 FAQ schema validator
│   ├── check-logo-size.sh          ← §3.5.1.9.4 two-tier logo-size check
│   └── generate-og-card.mjs        ← §10.1 /og-default.jpg generator (re-run if brand changes)
├── public/                         ← Static assets
│   ├── CNAME                       ← "agapenj.org"
│   ├── og-default.jpg              ← 1200×630 OG share card (§10.1)
│   ├── robots.txt                  ← Search engine directives
│   ├── sitemap.xml                 ← Search engine sitemap
│   └── brand/
│       ├── company-logo.svg        ← Canonical Brand Logo (1.6 KB, G.19)
│       └── company-logo.png        ← Reference raster (G.14 image-to-image; SVG is production)
├── src/
│   ├── pages/index.astro           ← The single page (composes all sections)
│   ├── layouts/BaseLayout.astro    ← HTML shell + SEO + MedicalClinic JSON-LD
│   ├── components/
│   │   ├── Navbar.astro            ← Sticky brand + nav + Call CTA
│   │   ├── Hero.astro              ← H1 + CTAs
│   │   ├── ServicesGrid.astro      ← 4-card grid from src/content/services/
│   │   ├── Testimonials.astro      ← Scaffolded; ships empty per §3.3.5
│   │   ├── FAQ.astro               ← JSON-driven <details>/<summary> accordion (§3.3.8)
│   │   ├── Contact.astro           ← Map + form card (anchors: #contact + #contact-form)
│   │   ├── ContactForm.astro       ← Web3Forms + honeypot + Turnstile (§6.6)
│   │   ├── CrisisResources.astro   ← 988 + SAMHSA + ReachNJ (§6.1)
│   │   ├── Footer.astro            ← §6 legal disclosures + Brand Logo (§3.5.1.7.4 #1)
│   │   ├── SEO.astro               ← §10.1 reusable head meta + OG/Twitter
│   │   ├── Logo.astro              ← §3.5.1.3 reusable brand mark component
│   │   └── OSMEmbed.astro          ← OpenStreetMap iframe (replaces Google Maps)
│   ├── content/                    ← Editable Markdown (services, testimonials)
│   │   ├── config.ts               ← Zod schemas (incl. optional seo: block)
│   │   ├── services/*.md           ← The 4 service offerings
│   │   └── testimonials/           ← Phase 2 — empty at launch
│   ├── data/
│   │   ├── faq.json                ← Client-editable FAQ (§3.3.8)
│   │   └── faq.schema.json         ← JSON Schema for faq.json validation
│   └── styles/global.css           ← Tailwind directives + brand layer + Montserrat font
```

---

## Need Help?

1. **First stop:** `EDITING_GUIDE.md` — most routine questions are
   answered there with screenshots.
2. **Then:** the credential log handed over at the demo (sealed
   envelope) — every account login is there.
3. **Then:** the 30-day support window — original developer is
   reachable for any question, big or small.

After the 30-day window, you can re-engage the original developer
for any future work as a separate engagement — or hand the project
to any developer who reads Markdown and Git.

**End of README.** You own it.