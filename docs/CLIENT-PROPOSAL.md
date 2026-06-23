# Agape Counseling Services — Website Rebuild Proposal

## 1. Executive Summary

Your current website at **agapenj.org** works, but it runs on a third-party platform that costs $149/month and ships code you don't own. We've built a **finished, demo-ready replacement**: a fast, owned single-page site that costs $0/month to host, is structurally compliant with the federal 42 CFR Part 2 confidentiality rule that applies to substance-use disorder programs, and is yours outright. One-time fee: **$2,000**. The build is done. The only remaining step is your go-ahead to launch.

---

## 2. Who We Are

A solo full-stack developer based in Florida. We build small-business and nonprofit websites that are fast, owned, and inexpensive to run. You get one point of contact from kickoff to handoff; nothing is subcontracted.

---

## 3. What We Found in Your Site

Our audit of the existing site on 2026-06-18 found a WordPress site on the Beacon Easton theme, hosted by Town Square Interactive. The site is technically functional, but a few things were worth fixing:

- **Third-party trackers on every page.** Universal Analytics (deprecated), two GA4 properties, Google Tag Manager, and Facebook SDK were running. For a substance-use disorder treatment program, that creates a federal 42 CFR Part 2 disclosure surface — Facebook can see which specific pages visitors land on.
- **A Google Maps API key exposed** in the page source. Anyone could steal it; the bill would be yours.
- **A modal popup** trapped bilingual/Medicaid/no-wait intake info behind a click — the same content works better as a calm hero subheadline.
- **Slow mobile load** (multiple trackers, jQuery, lazy-load after paint).
- **Vendor owns the code.** You can't move the site, edit it freely, or hand it to a new dev without paying the vendor.
- **Live testimonials with full names** ("Julie, Jaime, Tammy, Cassidy, Christine" + "in recovery at Agape") that combine facility + patient status in a way that creates a 42 CFR Part 2 risk profile.

What's already working and worth keeping: the address, phone, hours, services, mobile sticky Call button, Google Business Profile linkage, and email on Google Workspace (which lives independently of the website host — good for the cutover).

---

## 4. What We Built

A single-page website at `agapenj.org` that consolidates your 4 legacy pages into one long-scroll page. Every legacy URL still works via a permanent redirect, so anyone with an old link still lands in the right place and your Google ranking transfers.

**The page itself** — services, about, FAQ, contact form + map + hours, crisis resources (988 + SAMHSA + ReachNJ), bilingual English/Spanish copy on key sections, and a tap-to-call button that's always visible on mobile.

**The infrastructure** — hosted on Cloudflare Pages (free, your existing DNS), free SSL, free cookieless analytics, zero third-party trackers, free invisible spam protection. **You own everything**: Cloudflare account, source code (a folder of files), and the domain.

---

## 5. What This Includes / Doesn't Include

### 5.1 What's in the build

Everything below is implemented in the live build today. Every feature is gated by a feature flag in the code, so **any of these can be turned off, simplified, or deferred at no extra charge before launch** — just tell us which ones aren't applicable to your program right now and we'll adjust.

| # | Feature | Notes |
|---|---|---|
| 1 | Single-page static rebuild | One long-scroll page; Lighthouse 100/100/100/100 |
| 2 | Hero with primary CTA | Call button above the fold on mobile |
| 3 | Services grid (4 services) | IOP, Individualized Counseling, Anger Management, Reiki & Meditation |
| 4 | About / Mission section | 501(c)(3) status, founding era, Ocean County |
| 5 | Crisis resources (always visible) | 988 + NJ-specific hotlines, per 42 CFR Part 2 §6.1 |
| 6 | Contact form + footer | Web3Forms endpoint + Cloudflare Turnstile spam protection |
| 7 | 301 redirects for legacy URLs | `/our-services/` · `/reviews/` · `/contact-us/` |
| 8 | FAQ section | ≥1 FAQ item; structured FAQPage JSON-LD for SEO |
| 9 | Bilingual (English / Español) copy | Top-bar language toggle; key sections translated |
| 10 | Testimonials section | Scaffolded; ready for content (sourcing deferred — see §5.2) |
| 11 | Newsletter signup | Mailchimp / Buttondown endpoint; consent-gated |
| 12 | Accessibility audit (WCAG 2.1 AA) | Lighthouse + axe-core CI gate; manual screen-reader pass |
| 13 | Blog / Insights section | Long-form content for SEO + thought leadership |
| 14 | Custom photography | Pro-shoot coordination + retouching + placement |
| 15 | Advanced SEO + content strategy | Keyword silos, internal linking, "near me" pages |
| 16 | Compliance audit (42 CFR Part 2 + HIPAA) | Full posture review + COMPLIANCE.md audit trail |
| 17 | 30-minute Loom walkthrough | Editing + publishing + handoff recording |

### 5.2 What this does NOT include

- **No live testimonials at launch.** Federal 42 CFR Part 2 requires a signed authorization for each one. Your existing 7 need a quick legal review before re-publishing. The section is ready; content lands later when you've had time.
- **No online booking or appointment scheduling.** The contact form + tap-to-call are the intake path.
- **No donations or payment processing.**
- **No social media management.** Facebook and Instagram stay your responsibility.
- **No blog writing.** We ship the infrastructure; the writing is yours.
- **No HIPAA-compliant clinical platform.** This is a marketing and intake site. The contact form is for general inquiry only — never clinical, insurance, or substance-use data.
- **No multi-language beyond English/Spanish.**
- **No email/SMS marketing automation.** The form relays to your Gmail; no sequences, no autoresponders.
- **No custom photography at launch.** We use your existing logo and copy. New facility photos are an optional later workstream if you want them.

---

## 7. How We Work

1. **Pre-build (≤ 1 week from sign-off).** You sign the engagement agreement (§11). We collect credentials, set up the Cloudflare Pages project, and request a DNS records export from your registrar.
2. **Build.** Already complete as of 2026-06-19. All features in §5.1 implemented and verified.
3. **Final demo (60–90 minutes).** Live walkthrough of the finished site. You click through every section, test the form, request any final tweaks. We adjust once at no extra charge before the cutover.
4. **DNS cutover + handoff.** Cloudflare account transferred to your ownership; source code archive delivered; 30-day support window opens.
5. **30-day safety net.** Your existing site stays live for 30 days post-cutover. If anything goes wrong with the new site, the DNS change is reversible — your old site is one DNS change away from being live again.

We work in **build-to-completion** mode rather than incremental-feedback: you see the finished asset, give feedback once, we adjust once, we transfer. Cleaner for both parties than mid-build decision churn.

---

## 8. Pricing

**One-time build fee: $2,000**, paid in two milestones:

| When | Amount | What's required to release it |
|---|---|---|
| On sign-off | $1,000 | Engagement Agreement countersigned |
| On launch | $1,000 | Cloudflare account transferred, site live, source code delivered |

**That's the whole fee.** No hourly add-ons for the build.

**What's included for that $2,000:** all design, build, and verification work for §5.1; the live demo; DNS cutover coordination; 30 days of post-launch support (bug fixes, small copy edits, DNS questions); source code archive; editing guide (`EDITING_GUIDE.md`); Loom walkthrough; compliance trail (`COMPLIANCE.md`); Phase 2 workstream catalog (`PHASE-2.md`). Anything beyond those 30 days — additional content updates, design changes, new sections — is a separate engagement, quoted on request.

**Not included:** legal review of the privacy notice or 42 CFR Part 2 footer language (your NJ-licensed attorney should sign off before launch); annual domain renewal (~$15/yr, paid by you to your registrar); any future work beyond §5.1 (quoted separately, only if you ask).

### 8.4 Bonus — 3 months free: Business Bot (Build-a-Bot Service) testing access

While we're working together, you'll also get **3 months of free testing access** to the **Business Bot (Build-a-Bot Service)** — currently in active development.

**How we're framing this — full transparency.** We're running a structured beta program with our client engagements: you get a working tool today, you get to influence what gets built next through direct feedback, and we get real usage data from the kinds of small businesses we're designing this for. **Both sides benefit equally from this arrangement.** What we are *not* promising: specific outcomes, specific feature delivery dates, or that the bot will be commercially launchable on any particular timeline. This is testing access, not a finished product — if something doesn't work the way you'd hoped, that's signal. Tell us, and we'll iterate.

What the bot is designed to handle today (subject to change as we iterate):

- **Draft blog posts and email newsletters** — generated for you, sent to your inbox for review before anything posts or sends. You stay in control of the final say.
- **Manage your social media** — link any accounts you choose. The bot drafts content for you, with an explicit **content-generation toggle** you can switch off if you'd rather write everything yourself. When you're ready to publish, a single **"Post to all connected platforms"** button dispatches the same post to every linked account at once.
- **Refine and enhance staff headshots** — useful when you're ready to add a staff or counselor page or build an in-house photo gallery. Current usage limit during the beta: 3 per month (we tune this as we learn what realistic usage looks like across our testers; limits are how we manage shared capacity, not a paywall — if you hit yours, just tell us and we'll talk about whether to raise it for your account).

**Mopheus Code client integration — included with your testing access.** Because your site is built by Mopheus Code, your testing access includes a special integration that standard Build-a-Bot users don't get: at bot-setup time, I'll send you a **signed promo URL** (`mophe.us/promo/...`) that unlocks 3 free months. When you paste it into your Business Bot setup, build-a-bot verifies the signature, automatically recognizes your site as a Mopheus Code build, and wires up the integrations that match what your site already has — for example, posting the bot's drafts **directly to your website** (blog JSON feed + newsletter form endpoint). No manual config on your end.

- **Direct website integration** — labeled **"Custom Work Only"** in the build-a-bot UI. This is the Mopheus Code backdoor: only sites we built get this path. It's how we make sure the bot fits your site perfectly, not generically.
- **Standard users** (not Mopheus Code clients) get an email/web-address forwarding option instead — the bot can email the draft to an address you specify, and you'll paste it into your site yourself. We may add a generic "outgoing webhook" version for standard users later; nothing to commit to today.

**After your testing access ends.** Three months in, your free testing access expires. Whether we have a paid tier ready by then depends entirely on what we learn during the beta — we won't launch a paid version until the product is genuinely ready to charge for. If and when we do, beta testers get first notice and a discount on the first paid period as a thank-you for the testing. If we don't, no surprise charges, no obligation. Your site is unaffected either way.

---

## 9. What You Keep Paying

After launch, your recurring operating costs:

| Item | Annual cost |
|---|---|
| Cloudflare Pages hosting (free tier, unlimited traffic) | $0 |
| Cloudflare DNS (already in place) | $0 |
| Analytics (free, cookieless) | $0 |
| Spam protection (free, invisible) | $0 |
| Form provider (free tier — 250 submissions/month) | $0 |
| `agapenj.org` domain renewal | ~$15 |
| Email (Google Workspace) | unchanged — your existing bill |
| **Total recurring** | **~$15/yr** |

---

## 10. Risks & Assumptions

- **The cutover is low-risk.** Your existing site stays live for 30 days after launch. DNS is reversible in one click.
- **Search ranking should transfer, not drop.** Every old URL has a permanent redirect to the right new spot. We watch Search Console for 60 days post-launch.
- **Email is completely untouched.** Google Workspace is independent of the website host.
- **We're not guaranteeing a specific number of new intakes.** A better website means a better experience for the people who find you; it doesn't auto-generate leads.
- **Legal review is on your side.** The build ships with a structurally compliant posture, but a NJ-licensed attorney should sign off on the exact wording of the privacy notice and 42 CFR Part 2 footer before public launch.
- **Top 10 most-asked questions** come from your front-desk team — without your input, the FAQ ships with placeholder copy.

---

## 11. What We Need From You

To launch, we need:

- **Your sign-off** on this proposal (via the Phase 1 Engagement Agreement).
- **One authorizing email address** for the Cloudflare account and the form provider.
- **Cloudflare account admin access** (or an invitation to create one in your name).
- **A full export of your current DNS records** (so nothing is dropped during the cutover — we can send suggested wording for the registrar request).
- **Your EIN** for the footer (without it, the footer reads "EIN: PENDING").
- **Top 10 most-asked intake questions** from your front-desk team.
- **NJ attorney sign-off** on the privacy notice and 42 CFR Part 2 footer language, before launch.

A wishlist of features from §5.1 to **defer or remove** before launch (optional — every feature is in-code toggleable, so removing any of them is free and quick).

---

## 12. Next Step

1. You reply with "let's go" or "let's talk" — happy to hop on a 30-minute call.
2. We send the **Phase 1 Engagement Agreement** for signature.
3. You sign + pay the $1,000 deposit.
4. We schedule the **live demo** — 60–90 minutes, you click through the finished site, request any final tweaks (including which features to keep, defer, or remove).
5. You approve + pay the remaining $1,000.
6. We cut over (DNS change inside Cloudflare, ~15 minutes, no email disruption).
7. We hand over: Cloudflare account in your name, source code archive, editing guide, Loom walkthrough, compliance trail, 30-day support window opens.

**To move forward, just reply.**

---

*End of CLIENT-PROPOSAL.md v3.2.0. Awaiting client sign-off.*
