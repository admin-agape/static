# Agape — Phase 2 Index

**What this document is:** a single-page map of every "Phase 2" item the
client may hear about after launch — what each one is, what it costs, and
how to start the engagement. This is the working reference for the board
and the intake coordinator; it is not a quote and it is not a contract.
Every Phase 2 workstream is a separate engagement, scoped and priced when
requested.

**Cross-references:**
- Marketing/positioning framing of Phase 1's market value: [`CLIENT-PROPOSAL.md` §14.1](./CLIENT-PROPOSAL.md#141-what-this-would-cost-commercially-market-value)
- Full Phase 2 workstream list with relative sizing: [`CLIENT-PROPOSAL.md` §12](./CLIENT-PROPOSAL.md#12-phase-2-opportunities-future-work)
- 42 CFR Part 2 testimonial compliance worksheet (the Phase 2 tool for adding compliant social proof): [`TESTIMONIAL-REVIEW.md`](./TESTIMONIAL-REVIEW.md)
- Editing guide for day-to-day content changes (intake coordinator): [`EDITING_GUIDE.md`](./EDITING_GUIDE.md)

---

## 1. How This Engagement Works

Every Phase 2 workstream runs on the same four-quadrant model — same
pattern as the Phase 1 transfer moment in `CLIENT-PROPOSAL.md` §14.3.2,
applied to ongoing engagement rather than one-time handoff. The four
quadrants make explicit who does what, and what's delivered, **before
any work begins.** No workstream is absorbed silently.

### 1.1 What I (the dev) handle, end-to-end

For every Phase 2 workstream — regardless of size:

- **Scope confirmation** — explicit yes/no on whether the requested
  change fits a pre-scoped workstream (§4 below) or needs re-scoping
  into a custom change request per the three-category model in §2.
- **Written estimate** — hours or fixed-fee, with target start date,
  in your inbox before any work begins.
- **Implementation** — code, content, configuration, and tests per
  the approved scope.
- **Verification** — Pre-Demo Checklist-equivalent for the workstream
  (Lighthouse, accessibility, 42 CFR Part 2 review if applicable,
  build passes).
- **Deploy** — pushed via the same GitHub Actions pipeline used for
  Phase 1; live in ~60 seconds after commit.
- **Documentation update** — `COMPLIANCE.md`, `EDITING_GUIDE.md`, and
  this `PHASE-2.md` (if the workstream adds a new pre-scoped item)
  all updated to reflect the change.
- **30-day post-delivery support** for the delivered workstream — bug
  fixes + small copy edits, same terms as the Phase 1 support window.

### 1.2 What I need from you (the client) to start

| Need | Why |
|---|---|
| **Written approval of the estimate** | Email is fine — triggers work to begin. No code is written, no account is created, no estimate is started without it. |
| **Authorizing email** (if a new vendor account is needed) | Same model as Phase 1: one identity per vendor, one inbox to watch for transfer notifications. Rare for Phase 2 — most workstreams reuse existing accounts. |
| **Content / assets** (if applicable) | E.g., translated copy for the Spanish site; clinician bios for the staff page; testimonial consent forms per `TESTIMONIAL-REVIEW.md`. |
| **Compliance sign-off** (if applicable) | 42 CFR Part 2 review for any new testimonial, staff credential that implies SUD specialty, or patient-facing content. The dev flags this in the estimate; the client owns the sign-off. |

### 1.3 What you (the client) need to do yourselves

| Step | Why |
|---|---|
| **Communicate internally** | Board, intake staff, IT — anyone affected by the change (especially for the staff page, donations, or any visible UI change). |
| **Accept the change at deploy** | A quick "looks good" reply in the dev's notification email. The change is live by then; the acceptance is the formal close. |
| **Add any new credentials** to your password manager | Only if a new vendor account was created (rare — most Phase 2 workstreams don't need one). |
| **Schedule the work** | Most Phase 2 workstreams need ~1 week's lead time for scoping + estimate before implementation starts. Larger ones (Spanish site, blog, staff page) need 2–4 weeks. |

### 1.4 What you get

| Deliverable | What it is |
|---|---|
| **The workstream itself** | Per the approved scope — e.g., the `/staff` page, the donation button, the Spanish translation, the testimonial section activating on the first signed `.md` drop. |
| **Updated docs** | `COMPLIANCE.md` (every §6 status), `EDITING_GUIDE.md` (if the change affects day-to-day editing), `PHASE-2.md` (if a new pre-scoped item was added). |
| **Deploy verification** | A short note in your inbox confirming the change is live, with the commit hash and the URL to verify. |
| **30-day post-delivery support** | Bug fixes + small copy edits for the delivered workstream — included, same terms as the Phase 1 support window. |

The next sections describe the **what** — what workstreams are
available, what they cost, what's already pre-built and waiting for
your input. This section is the **how** — the engagement model that
every workstream runs on.

---

## 2. What "Phase 2" Means Here

Phase 1 was the **website rebuild** — the work on disk at demo time:
the static Astro build, the 42 CFR Part 2 compliance posture, the
GitHub-owned repository, the editing guide, the Loom walkthrough, and
the 30-day post-demo support window. **Phase 1 is a finished digital
asset.**

**Phase 2 is everything that comes next.** It is not part of the
original engagement and it is not absorbed into it silently. Every
Phase 2 workstream is its own scoped engagement with its own estimate
and its own written approval before any work begins.

There are **three categories** of Phase 2 work:

| Category | What it is | Typical cost to start |
|---|---|---|
| **Zero-cost unlocks** | Features already built into the codebase that just need a signed authorization or a content file to activate. | **$0 dev cost.** Time spent by your team (e.g., the 42 CFR Part 2 review for testimonials). |
| **Pre-scoped workstreams** | Common asks that have a known shape and a known relative size. Sized up front in this document and in `CLIENT-PROPOSAL.md` §12.2. | **Hourly rate or fixed-fee quote** at engagement start. |
| **Custom change requests** | Anything not in the catalog above. Quoted on request against an explicit scope. | **Hourly rate** against a written estimate. |

---

## 3. The Zero-Cost Unlocks

These are features that **already work** in the codebase and just need
your team to drop a file in or flip a switch. **No developer required.**

### 3.1 Testimonials — drop in a signed `.md`, the section appears

The `Testimonials.astro` component is **scaffolded with conditional
rendering**: when the `src/content/testimonials/` collection is empty,
no testimonial markup (heading, anchor, or card) is rendered. The
moment you drop a `.md` file with the required frontmatter into that
folder, the section, heading, and anchor appear automatically on the
next build.

**The structural guardrail:** the Zod schema in `src/content/config.ts`
**requires** two frontmatter fields on every testimonial entry —
`consent_date` and `consent_hash`. If either is missing, the build
**fails**. This means a non-compliant testimonial **cannot** be
published accidentally — a developer would have to delete the schema
to bypass it. 42 CFR Part 2 compliance is enforced at the build, not
by a written policy.

**The client workflow:**

1. Use [`TESTIMONIAL-REVIEW.md`](./TESTIMONIAL-REVIEW.md) to review a
   legacy testimonial (or draft of a new one) against the 42 CFR Part 2
   consent standard. The worksheet contains pre-filled risk ratings for
   all 7 legacy testimonials, the keep/modify/drop decision table, a
   rewritten-text section, the 42 CFR §2.31 consent form template, and
   the signature block.
2. For each testimonial you want to publish, obtain a signed
   authorization on the consent form.
3. Create a `.md` file under `src/content/testimonials/` with the
   frontmatter (including `consent_date` and `consent_hash`) and the
   body text.
4. Commit the file in the GitHub web UI. The site rebuilds in ~60
   seconds; the testimonial appears in the `#testimonials` section.

**Time investment for your team:** the consent-form collection,
witnessing, and filing. The dev is not involved unless you want
help with the technical file creation.

### 3.2 Content edits (services, hours, FAQ, access banner)

Anything in `src/content/` is editable by the intake coordinator in the
GitHub web UI. See [`EDITING_GUIDE.md`](./EDITING_GUIDE.md) for the
non-technical walkthrough. Common edits:

- Change a service description → edit `src/content/services/*.md`
- Change hours → edit the relevant `.md` frontmatter
- Add an FAQ entry → edit `src/data/faq.json`
- Update the access banner (bilingual / Medicaid / no-wait) → edit the
  relevant `.md` file

**No vendor portal, no support ticket, no cost.** Live in about 60
seconds after the commit.

---

## 4. The Pre-Scoped Workstreams

Sourced from `CLIENT-PROPOSAL.md` §12.2 (the canonical sizing table) and
the §9.4 list of commonly-asked triggers. Sizes are **relative** —
final pricing is a fixed-fee or hourly quote when you decide to start.

### 4.1 Small (typically a single focused engagement)

| Workstream | What it adds | Notes |
|---|---|---|
| **Testimonial compliance pipeline** | Already structured (see §3.1 above). **Zero dev cost.** | The worksheet is the workstream. |
| **Online donations** (Stripe / Donorbox) | A "Donate" button in the header and a dedicated `/donate` page. Donorbox handles the PCI scope; you stay clean. | Free tier available; paid plans if volume grows. |
| **Online booking** (Calendly embed) | A Calendly widget on the Contact section. Full booking system is Medium–Large. | 80/20 solution; minimal dev work. |
| **Email newsletter signup** | ConvertKit / Buttondown embed; double opt-in for compliance. | Double opt-in is a 42 CFR Part 2 hygiene feature, not optional. |
| **NJ DOT impaired-driver self-scheduling** | Calendly + form prefill. | Tightly scoped to the NJ DOT partnership flow. |
| **Search functionality** | Pagefind static search index. | Useful only after there are ≥ ~10 sections to search. |

### 4.2 Small-to-Medium

| Workstream | What it adds | Notes |
|---|---|---|
| **Staff page** (per-clinician bios) | A `/staff` section with bios. | **42 CFR Part 2 review required** for any credential that implies SUD treatment specialty (e.g., "CAADC", "SUD counselor"). Don't list credentials publicly without counsel sign-off. |

### 4.3 Medium (multi-week engagement)

| Workstream | What it adds | Notes |
|---|---|---|
| **Full Spanish site** (i18n) | Hero, Services, Testimonials, Form, Legal — all translated. | Spanish-speaking staff member on review duty. Bilingual staff already advertise this; full localization closes the gap. |
| **Recovery stories blog** (MDX) | `src/content/blog/` with markdown posts; RSS feed. | SEO benefit for long-tail terms. Staff writes in Markdown; same editor as services. |
| **Multi-county SEO landing pages** | One page per service county (Ocean, Monmouth, Burlington, etc.); each with localized copy. | Improves Google Maps / "near me" ranking. |
| **CRM / intake automation** | Form → CRM webhook. | Phase 1 form posts to email; Phase 2 wires it into your CRM of choice. |

### 4.4 Large + separate compliance workstream (months, not weeks)

| Workstream | What it adds | Notes |
|---|---|---|
| **Client portal / login / telehealth** | Authenticated patient area; possibly telehealth integration. | **Requires HIPAA-compliant hosting, a Business Associate Agreement (BAA) with every vendor handling PHI, and a separate design + compliance workstream.** This is a **multi-month build** and should not be conflated with the website rebuild. |

### 4.5 BIMI (cost-transparent "nice-to-have")

Displays your logo next to authenticated email in supporting inbox
clients (Apple Mail, Gmail for Workspace, Yahoo Mail). Purely visual —
**not a security feature**. The DMARC rollout in §11.5 of the proposal
already closes the actual phishing risk; BIMI is cosmetic on top.

| Prerequisite | Cost | Timeline | Status for Agape |
|---|---|---|---|
| DMARC at `p=quarantine` or `p=reject` | **$0** | Already in place at Phase 1 | ✓ |
| **USPTO-registered trademark** on the logo | **$250–$350 + attorney fees** | **6–12 months** if not already registered | ⚠️ Need to confirm whether Agape has one |
| **Verified Mark Certificate (VMC)** from a CA (Entrust or DigiCert) | **~$1,200–$1,500/year recurring** | 2–4 weeks after trademark confirmed | Not applicable until trademark exists |
| Self-hosted SVG logo at the BIMI record URL | $0 | Trivial | ✓ |

**Decision rule:** the dev does not propose BIMI unless both (a) Agape
has a USPTO-registered trademark and (b) the practice is willing to
absorb the VMC annual cost. If both are true, the engagement is a
~$1,500 setup + $1,200–$1,500/year.

---

## 5. The 30-Day Support Window (Free Phase 2 Tier)

This is the **Phase 2 free tier**: it's included with the build and
runs for 30 days after the demo. It is NOT a separate engagement.

**What is included, free, for 30 days post-demo:**

- **Bug fixes** — any defect discovered in the first 30 days is fixed
  at no additional cost.
- **Small copy edits** — up to 30 minutes of small text changes per
  day (one at a time) are included.
- **DNS / cutover questions** — the dev walks the client through the
  final Town Square Interactive cancellation, the 301 redirect
  retirement, or any Cloudflare DNS issue.
- **DMARC monitoring** — verification that the `rua` mailbox is
  receiving aggregate reports; recommendations on policy escalation
  (e.g., `p=quarantine` → `p=reject` after 90+ days of clean reports).
- **`[ATTORNEY REVIEW PENDING]` marker drop** — once counsel signs off
  on the form-consent text, the marker is removed from production. No
  code change required; the wording is already in place.

**What is NOT included (separate engagement):**

- Anything new. After 30 days, support reverts to hourly or a separate
  maintenance agreement is signed.
- If a discovered issue is large (e.g., a 42 CFR Part 2 exposure not
  caught in the Pre-Demo Checklist), a separate engagement is opened
  and quoted.

---

## 6. How to Start a Phase 2 Engagement

The process is the same regardless of size:

1. **Email the dev** with the workstream name and any context (a
   paragraph is enough). Reference this document if it helps.
2. **Dev responds** with: scope confirmation, a written estimate
   (hours or fixed-fee), and a target start date.
3. **Client approves in writing** (email is fine). Work begins.
4. **Dev delivers** against the approved scope. A new revision of
   `CLIENT-PROPOSAL.md` is created if the workstream expands the
   original engagement.

There is no obligation to start any Phase 2 work. The site you have at
demo time is the finished deliverable.

---

## 7. Phase 1 Market Value Anchor

For context, the rebuild that was just delivered — the Performance
Build, the 42 CFR Part 2 Compliance Engineering, the Infrastructure
Security & Mail Hardening, and the Structural SEO — would have a
market value of approximately **$7,500 – $12,000** if commissioned
from a professional developer at standard rates. The full breakdown
is in [`CLIENT-PROPOSAL.md` §14.1](./CLIENT-PROPOSAL.md#141-what-this-would-cost-commercially-market-value).

This is the anchor for understanding why Phase 2 workstreams are
quoted as separate engagements: they are real work, against a
real codebase, at a rate that is consistent with the value already
delivered.

---

## 8. Cross-References

- [`CLIENT-PROPOSAL.md` §12 — Phase 2 Opportunities](./CLIENT-PROPOSAL.md#12-phase-2-opportunities-future-work) — the canonical sizing table
- [`CLIENT-PROPOSAL.md` §14.1 — Market Value Anchor](./CLIENT-PROPOSAL.md#141-what-this-would-cost-commercially-market-value) — what the rebuild would cost commercially
- [`TESTIMONIAL-REVIEW.md`](./TESTIMONIAL-REVIEW.md) — the 42 CFR Part 2 worksheet for adding compliant testimonials (the highest-leverage zero-cost unlock)
- [`EDITING_GUIDE.md`](./EDITING_GUIDE.md) — non-technical guide for day-to-day content edits
- [`README.md`](./README.md) — repo entry point for any future maintainer

---

**End of Phase 2 Index.** This document is informational and is not a
quote. Every workstream is sized and priced when requested.
