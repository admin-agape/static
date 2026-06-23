# Engagement Packet — Initial Documents for Agape Counseling Services

**Date prepared:** 2026-06-20
**For:** Agape Counseling Services (815 U.S. 9, Lanoka Harbor, NJ 08734)
**From:** Morgan Getkin, Solo Dev

This folder contains the **client-side documents** the Agape team should
look over before the demo and handoff. Read in this order:

| # | File | What it is | Pages | What you do with it |
|---|---|---|---|---|
| **1** | **`CLIENT-PROPOSAL.pdf`** | The proposal — what we built, what it costs, what we found, what we need from you. | 26 | **Read first.** If it makes sense, reply "go" (or hop on a 30-minute call). |
| **2** | **`PHASE-1-ENGAGEMENT-AGREEMENT.pdf`** | The contract — fee, payment terms, scope of work, pre-build deliverables, handoff, 30-day support window. | 17 | **Sign and return.** Triggers the demo → DNS cutover → transfer sequence. |
| **3** | **`COMPLIANCE.pdf`** | The §6 audit trail — every compliance surface (42 CFR Part 2, privacy, accessibility, DMARC) with status, attorney sign-off placeholders, and the §6.9 DNS rollout plan. | 13 | **Board + counsel review.** Especially the `[ATTORNEY REVIEW PENDING]` items in §6.2.4, §6.3, §6.5, §6.6 — your counsel signs off on the exact wording before public launch. |
| **4** | **`PHASE-2.pdf`** | The Phase 2 workstream catalog — every optional future engagement, sized and described, with the 30-day free support window called out. | 12 | **Reference.** Use this when you're ready to plan what comes next (donations, blog, staff page, etc.). No obligation to start any workstream. |
| **5** | **`TESTIMONIAL-REVIEW.pdf`** | The 42 CFR Part 2 worksheet for the 7 legacy testimonials — pre-filled risk ratings, keep/modify/drop decision table, rewritten-text section, the §2.31 consent form template, signature block. | 13 | **Optional / Phase 2 prep.** Use only when you're ready to add compliant testimonials back to the site. The site ships without testimonials (§3.3.5 of `DESIGN.md`); this worksheet is the path to add them later. |

---

## What you'll find in each document

### 1. `CLIENT-PROPOSAL.pdf` (read first)

A clear, client-friendly summary of:

- **What we built** — a fast, static, mobile-first single-page site at agapenj.org
- **Why it matters** — closes federal 42 CFR Part 2 exposures + eliminates $1,788/year in SaaS fees
- **What we found** in the live audit of the legacy site (the top 12 issues, ranked by severity)
- **What it costs** — $2,000 flat fee + ~$15/year ongoing (domain only)
- **What Phase 1 includes vs. excludes** — explicit scope boundary
- **What Phase 2 looks like** — optional workstreams, quoted separately
- **What we need from you** — including the **DNS records export** (see below)

### 2. `PHASE-1-ENGAGEMENT-AGREEMENT.pdf` (the contract)

The legal contract:

- **Fee + payment terms** — $1,000 deposit on sign-off, $1,000 final payment on transfer
- **§3 Pre-Build Deliverables from the Client** — what you provide before we begin (Cloudflare admin, Web3Forms, Google Workspace admin, **DNS records export**, EIN, FAQ top 10)
- **§5 Demo + transfer protocol** — what happens at the demo, what gets transferred to you, what stays with the dev until final payment
- **§6 Handoff package contents** — source code archive (no GitHub required!), compliance trail, editing guide, Loom walkthrough
- **§8 30-day post-launch support window** — what's included, what isn't
- **§9 Confidentiality + 42 CFR Part 2 context** — the Developer doesn't see PHI, doesn't retain admin access after transfer
- **Standard legal boilerplate** — limitation of liability, dispute resolution, signatures

### 3. `COMPLIANCE.pdf` (board + counsel review)

The compliance audit trail:

- **Quick-reference summary table** — what's complete, what's attorney-pending, what's awaiting client data
- **§6.1 Crisis Resources** — 988 + SAMHSA + ReachNJ, ✅ complete
- **§6.2.1–§6.2.3 Privacy posture** — what is NEVER sent to third parties, ✅ complete
- **§6.2.4 42 CFR Part 2 Notice** — ⚠️ template in place, attorney sign-off pending
- **§6.3 Privacy Notice** — ⚠️ template in place, attorney sign-off pending
- **§6.4 Disclaimers** — ⚠️ EIN pending (you provide)
- **§6.5 Accessibility Statement** — ⚠️ template, attorney sign-off pending
- **§6.6 Consent Checkbox** — ✅ G.17 three-pillar wording in production, attorney sign-off pending
- **§6.7 301 Redirects** — ✅ complete (preserves SEO continuity)
- **§6.8 Visibility Rule** — ✅ every §6 disclosure reachable in ≤ 2 taps
- **§6.9 Email & DNS Security Baseline** — ⏳ DMARC rollout scheduled for the demo (requires your Google Workspace admin access)
- **Brand asset library** — SHA-256 hashes for future integrity verification
- **Lighthouse audit** — 100/100/100/100 verified
- **Hosting context** — Cloudflare Pages (post-G.23, no GitHub in your package)

### 4. `PHASE-2.pdf` (reference for future planning)

The Phase 2 workstream catalog:

- **How this engagement works** — same four-quadrant model for every Phase 2 workstream
- **What "Phase 2" means** — three categories: zero-cost unlocks, pre-scoped workstreams, custom change requests
- **The Zero-Cost Unlocks** — testimonials (drop a `.md` file, section auto-appears), content edits
- **The Pre-Scoped Workstreams** — small / small-to-medium / medium / large + BIMI cost transparency
- **The 30-Day Support Window** — what's free, what isn't
- **How to start a Phase 2 engagement** — email → estimate → approval → delivery
- **Phase 1 Market Value Anchor** — context for why Phase 2 workstreams are quoted separately

### 5. `TESTIMONIAL-REVIEW.pdf` (optional / Phase 2 prep)

The 42 CFR Part 2 worksheet for adding compliant testimonials:

- **§1 Testimonial Review Table** — all 7 legacy testimonials with pre-filled risk ratings + recommended actions
- **§2 Summary Count** — KEEP / MODIFY / DROP decisions
- **§3 Modified Text** — rewritten text for any MODIFY decisions
- **§4 Compliance Attestation** — signature block for the authorized representative
- **§5 Filing Instructions** — how to file the worksheet + consent forms
- **Appendix A** — the 42 CFR §2.31 consent form template

---

## The DNS records export — read this carefully

**§3.5 of the engagement agreement** asks for a full export of your
current DNS records. This is a one-time action and is critical for a
clean cutover.

**Why we need it:** Cloudflare is already your DNS provider, so the
website cutover is internal to Cloudflare. But we need to verify that
every record currently in place (email subdomains, verification
records, third-party SaaS, MX records, etc.) is preserved through the
cutover. The export is the authoritative reference.

**Suggested wording for your registrar** (you can copy-paste this to
your registrar's support team or DNS dashboard help):

> *"We are reviewing our current domain settings and need a full
> export of all active A, CNAME, MX, and TXT records so we have them
> for our records. Most registrars let you download this as a zone
> file or paste a screenshot from the DNS dashboard — either is
> fine."*

**What we'll do with it:**

1. Cross-reference the export against our live `dig` audit (we do this before the demo)
2. Identify any records we hadn't seen in the live audit (e.g., third-party SaaS subdomains)
3. Confirm every record is preserved through the cutover
4. Log the post-cutover state in `COMPLIANCE.md` for the audit trail

**When we need it:** Before the demo, so we can verify state and surface any surprises during the demo (not after).

---

## What the board should know (60-second summary)

If you only have 60 seconds, here's the headline:

1. **The build is done.** Lighthouse 100/100/100/100. 42 CFR Part 2 compliant by architecture. Pre-Demo Checklist 62 pass / 0 fail / 1 warn.
2. **The cost goes from $1,803/year to $15/year** — the $1,788/year Town Square Interactive SaaS fee is gone.
3. **You own the site** — Cloudflare account + Web3Forms form endpoint + zipped source code archive. No GitHub. No vendor lock-in.
4. **The 30-day safety net** — the legacy TSI site stays live for 30 days post-cutover. DNS change is one-click reversible. Not betting the program on the rebuild.
5. **The only outstanding items are your team's** — EIN, FAQ top 10, DNS records export, attorney sign-off on the privacy / 42 CFR Part 2 / accessibility / consent-checkbox text. All of these have placeholders in the live build and will be filled in by you + your counsel, not by us.

---

## What the intake coordinator should know (60-second summary)

If you're the person who answers the phone when someone calls (609) 242-0086:

1. **The new site is fast.** Loads in under 1.5 seconds on a mid-range phone with slow 4G. The Sticky Call button (tap-to-call) is always one tap away on mobile.
2. **The FAQ section is your friend.** Top 10 placeholder Q&As are live now (Medicaid, IOP length, evening hours, bilingual, first session, transportation, etc.). Swap them out for your real top 10 from your intake logs — send the file to the dev, it's live in 30 seconds.
3. **The Crisis Resources section is always visible near the footer.** 988, SAMHSA, ReachNJ. If someone in crisis reaches the site, the resources are two taps away from any viewport state.
4. **There are no testimonials yet.** The site launched without them. If/when you want to add them, `TESTIMONIAL-REVIEW.pdf` (above) is the worksheet. We drop the file in for you during the 30-day support window; after that, it's a small Phase 2 engagement.
5. **Editing copy is editing Markdown.** `EDITING_GUIDE.md` (delivered at the demo) walks you through it. No vendor portal. No CMS. No code knowledge required.

---

## What the IT / compliance officer should know (60-second summary)

If you're the person who manages Cloudflare, Google Workspace, and the domain:

1. **Cloudflare Pages direct-upload hosting.** The dev deploys via `wrangler pages deploy ./dist`. No GitHub in your package. Your Cloudflare account is yours; the dev's access is removed at handoff.
2. **DNS cutover is internal to Cloudflare.** The Apex `A` record repointing at Cloudflare Pages. All MX / TXT / existing CNAME records preserved. Pre-cutover: receive the DNS records export per §3.5 of the engagement agreement.
3. **DMARC rollout at the demo.** One `TXT` record at `_dmarc.agapenj.org`. Default policy `p=quarantine`. Requires Google Workspace admin access to create the `dmarc-reports@agapenj.org` aggregate-reports mailbox.
4. **MX records are NEVER touched.** Email stays on Google Workspace. The cutover is web-only.
5. **Rollback is one click.** Cloudflare Pages retains every prior deployment. Cloudflare DNS has a one-click rollback. The 30-day safety net is built in.

---

## What's NOT in this packet (it arrives at the demo)

The handoff package at the demo includes additional docs that arrive
live (not with this initial engagement packet):

- `EDITING_GUIDE.md` — non-technical guide to editing copy, FAQ, services
- The source code archive (zipped `.zip`) — every file, fully editable, no GitHub required
- A Loom walkthrough of editing + deploying the site
- The credentials envelope (Cloudflare admin, Web3Forms access key, Google Workspace DMARC `rua` mailbox, etc.)
- The §3.5 DNS-export cross-reference (logged in `COMPLIANCE.md` §6.9 / §7.5 rows)

These are presented live at the demo so the dev can walk you through
each artifact in context.

---

## Questions?

Reply to the email this packet was attached to, or hop on a
30-minute call. The dev is responsive and prefers questions before
signing rather than surprises during the build.

---

*Prepared by Morgan Getkin, Solo Dev. Internal document; not for redistribution outside the engagement.*
