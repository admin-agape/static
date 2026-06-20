# Phase 1 Engagement Agreement — Agape Website Rebuild

**THIS DOCUMENT IS A TEMPLATE, NOT LEGAL ADVICE.** It is provided as a
working draft for review by counsel before signature. Morgan Getkin
(the "Developer") is not a lawyer and makes no representation that this
agreement is suitable for any specific jurisdiction or engagement
without independent legal review. Both parties are encouraged to have
this agreement reviewed by their respective counsel before execution.

---

## 1. Parties and Effective Date

This **Phase 1 Engagement Agreement** (the "Agreement") is entered into
as of **[EFFECTIVE DATE]** by and between:

**Developer:**
Morgan Getkin (sole proprietor)
[DEV ADDRESS]
[DEV EMAIL]
[DEV PHONE]
("Developer")

**Client:**
Agape Counseling Services
815 U.S. 9, Lanoka Harbor, NJ 08734
info@agapenj.org
(609) 242-0086
("Client")

The Developer and the Client are each a "Party" and together the
"Parties."

---

## 2. Background and Scope of Work

### 2.1 Background
The Client operates a substance use disorder (SUD) treatment program
and currently publishes a website at `agapenj.org` that runs on a
vendor-managed WordPress installation (Town Square Interactive / Beacon
Easton theme) at a recurring annual cost of $1,788. The Client wishes
to rebuild the site on a modern, owned, free-tier infrastructure stack
that meets federal 42 CFR Part 2 confidentiality requirements and is
operationally sustainable by a non-technical Client team.

### 2.2 Scope of Work — Phase 1 (the "Deliverables")
The Developer will design, build, verify, and transfer to the Client
the website described in **[`CLIENT-PROPOSAL.md`](../docs/CLIENT-PROPOSAL.md)** (the
"Proposal"), which is incorporated by reference into this Agreement as
**Exhibit A**. The Deliverables, in summary, are:

- A single-page, statically generated Astro website at `agapenj.org`
- 42 CFR Part 2-compliant content posture (no third-party trackers,
  no testimonials at launch, intake-only contact form)
- Lighthouse 100/100/100/100 score on the demo-ready build
- A GitHub-owned repository under the Client's organization
- Cloudflare (free tier) as authoritative DNS + Web Analytics
- Web3Forms (or Formspree) as the contact form provider
- A non-technical editing guide, a Loom walkthrough, a compliance
  trail (`COMPLIANCE.md`), and the Phase 2 workstream index
  (`PHASE-2.md`)
- A 30-day post-transfer support window per §7

### 2.3 Out of Scope (Phase 2)
Workstreams not in §2.2 are **Phase 2 workstreams** and are governed by
[`PHASE-2.md`](../docs/PHASE-2.md), which is incorporated by reference as
**Exhibit B**. Phase 2 workstreams require a separate written estimate
and written approval before any work begins; they are not absorbed
into this Agreement.

---

## 3. Fee and Payment Terms

### 3.1 Fee
The total fee for the Phase 1 Deliverables is **USD $2,000** (the
"Fee"), invoiced separately per §3.2.

### 3.2 Invoicing
The Developer will issue an invoice to the Client on or before the
Effective Date. The invoice is payable on the following terms:

- **Due date:** Net 14 days from invoice date.
- **Payment method:** Bank transfer (ACH preferred) or check. Payment
  details are on the invoice.
- **Late fee:** 1.5% per month on balances unpaid 30+ days past due.

### 3.3 What the Fee Covers
The Fee covers all Phase 1 Deliverables in §2.2, including:

- Design, build, and verification (Pre-Demo Checklist gate)
- The 30-day post-transfer support window per §7
- All Cloudflare, GitHub, and Web3Forms (or Formspree) accounts
  created by the Developer during the build
- The credentials envelope (handover document) per §5.2

The Fee does **not** cover:

- Phase 2 workstreams (per §2.3)
- Legal review of the site content, privacy policy, 42 CFR Part 2
  notice, or accessibility statement — the Client's responsibility per
  §9.2 of the Proposal
- USPTO trademark filing or Verified Mark Certificate procurement
  (BIMI, per §12.1 of the Proposal)
- The annual `agapenj.org` domain renewal fee (~$15/year, paid by the
  Client directly to the registrar)
- Any paid-tier upgrade of any vendor (the Phase 1 stack is built
  entirely on free tiers)

---

## 4. Acceptance, Demo, and Transfer

### 4.1 Build → Demo
The Developer will build the Phase 1 Deliverables against the
Pre-Demo Checklist (defined in the Proposal's internal
[`DESIGN.md`](../docs-internal/DESIGN.md), Appendix C, which is incorporated
by reference as **Exhibit C** for measurement purposes only and is
not otherwise binding on the Parties). Upon reaching Pre-Demo
Checklist green, the Developer will schedule a single demo session
(typically 60–90 minutes) with the Client.

### 4.2 The Demo
At the demo, the Developer will:

1. Walk the Client through the running site end-to-end
2. Walk the Client through the handoff package contents (§5.1)
3. Add the new credentials to the Client's password manager live,
   with a verbal walkthrough of each account
4. Verify the 301 redirects, DNS resolution, HTTPS, and form
   submission end-to-end
5. Walk the Client through the Phase 1 → Phase 2 transition model
   (per `PHASE-2.md`)

### 4.3 Acceptance
The Client's acceptance of the Phase 1 Deliverables occurs at the
demo, upon the Client's written confirmation (email is sufficient)
that the Pre-Demo Checklist items have been demonstrated to the
Client's reasonable satisfaction.

### 4.4 Transfer of Deliverables (pending agreement)
**The transfer of the Deliverables — including but not limited to the
GitHub repository, the Cloudflare account admin, the Web3Forms (or
Formspree) account, and the credentials envelope — does not occur at
the demo itself.** The transfer occurs **upon the Client's written
agreement to this Phase 1 Engagement Agreement** (i.e., upon the
Client's countersignature on §13 below) and the Developer's receipt
of the Fee per §3.

Until both conditions are met, the Developer retains administrative
access to all Phase 1 accounts and rollback authority over the build.

### 4.5 Why "pending agreement"
This structure protects both Parties:

- The Client sees the live demo (and the running site at the
  Pre-Demo Checklist state) **before** committing to pay or to take
  ownership.
- The Developer retains the ability to fix late-discovered issues
  without an ownership transfer blocking the path — particularly
  important given the 42 CFR Part 2 compliance posture of the build.

---

## 5. Handoff Package

### 5.1 Contents
At the demo (per §4.2), the Developer presents the Client with a
finished handoff package containing:

- **The Code** — full GitHub repository (full commit history, branch
  protection on `main`, `LICENSE`, `README.md`)
- **The Content** — every page of content as a `.md` file in
  `src/content/`, every image in `public/images/`, plus
  `EDITING_GUIDE.md` and a Loom walkthrough
- **The Compliance Trail** — `COMPLIANCE.md` (implementation status
  of every §6 item from the Proposal) and `TESTIMONIAL-REVIEW.md`
  (the 42 CFR Part 2 worksheet for adding compliant testimonials)
- **The Operations** — Cloudflare account, Web3Forms (or Formspree)
  account, GitHub organization, domain management, and a credentials
  log enumerating every account, every key, and every "where to log
  in" URL
- **The Rollback** — the previous Town Square Interactive site
  remains live for 30 days post-cutover as a safety net

### 5.2 The Credentials Envelope
The credentials log is provided to the Client as a sealed envelope
(printed or PDF) at the demo, with a verbal walkthrough of each
account. The Client adds each credential to their password manager
live during the demo. The Developer does not email credentials ahead
of the demo and does not retain administrative access after the
transfer per §4.4 completes.

---

## 6. Intellectual Property and Ownership

### 6.1 Pre-existing IP
The Developer retains all rights to any pre-existing tools, libraries,
or methodologies used in the build (e.g., the Astro framework,
Tailwind CSS, DaisyUI, the Zod schema pattern). These are licensed to
the Client under their respective open-source licenses (MIT, Apache
2.0, etc.) as documented in the repository's `LICENSE` file.

### 6.2 Deliverables IP
Upon the Client's countersignature on this Agreement **and** the
Developer's receipt of the Fee per §3, all right, title, and interest
in and to the Phase 1 Deliverables — including but not limited to
the website source code, the content (Markdown files), the brand
assets (logo SVGs), the configuration files (`astro.config.mjs`,
`tailwind.config.js`, etc.), and the documentation (`EDITING_GUIDE.md`,
`COMPLIANCE.md`, `PHASE-2.md`) — transfer to the Client.

### 6.3 Developer's Right to Reference
The Developer retains the right to reference the engagement (under
the Client's name and a description of the work performed) in the
Developer's professional portfolio, on the Developer's website, and
in proposals to prospective clients. The Developer will **not**
disclose the Client's confidential information (§8) in any such
reference.

### 6.4 Open-source posture
The Client is encouraged to keep the repository public and the
`LICENSE` file as MIT, which is the default for nonprofit contribution.
The Client may change either at any time after the transfer per §4.4.

---

## 7. 30-Day Post-Transfer Support Window

### 7.1 What is included
For 30 calendar days following the completion of the transfer per §4.4
(transfer = Client's countersignature on §13 **and** Developer's
receipt of the Fee), the Developer provides, at no additional cost:

- **Bug fixes** — any defect in the Phase 1 Deliverables discovered
  in the 30-day window is fixed at no charge.
- **Small copy edits** — up to 30 minutes of small text changes per
  day (one at a time) on existing content.
- **DNS / cutover questions** — the Developer walks the Client
  through the final Town Square Interactive cancellation, the 301
  redirect retirement, or any Cloudflare DNS issue.
- **DMARC monitoring** — verification that the `rua` mailbox is
  receiving aggregate reports; recommendations on policy escalation
  (`p=quarantine` → `p=reject` after 90+ days of clean reports).
- **`[ATTORNEY REVIEW PENDING]` marker drop** — once the Client's
  counsel signs off on the form-consent text, the marker is removed
  from production at no charge. No code change required.

### 7.2 What is NOT included
The 30-day window does not cover:

- Any new feature, change request, or Phase 2 workstream (per §2.3)
- Issues caused by the Client's modifications to the codebase after
  the transfer
- Issues caused by a third party (vendor outage, DNS registrar
  failure, etc.)
- Legal review of any text on the site (the Client's responsibility
  per §9.2 of the Proposal)

### 7.3 After 30 days
After the 30-day window, support reverts to:

- **Hourly rate** at the Developer's then-current rate, or
- A separate maintenance agreement signed by both Parties

---

## 8. Confidentiality

### 8.1 The Developer's obligation
The Developer will hold in confidence and not disclose to any third
party (except as required by law or with the Client's written
consent) any non-public information regarding the Client, the Client's
patients, the Client's staff, the Client's clinical operations, or
the Client's business that the Developer learns in the course of the
engagement.

### 8.2 42 CFR Part 2 context
The Client operates a federally-regulated substance use disorder
treatment program subject to **42 CFR Part 2** (stricter than HIPAA).
The Developer acknowledges that:

- The build is designed to be **42 CFR Part 2-compatible by
  architecture** (no third-party trackers, no profiling, cookieless
  analytics) but is **not** a clinical platform and is **not
  HIPAA-covered**.
- The Developer's exposure to Protected Health Information (PHI) in
  the course of the build is incidental and limited (e.g., reviewing
  legacy testimonial text for compliance scrubbing).
- The Developer will not retain copies of any PHI beyond what is
  necessary to perform the build, and will redact or delete any
  incidental PHI from working files at the conclusion of the build.

### 8.3 The Client's obligation
The Client will hold in confidence and not disclose to any third
party (except as required by law or with the Developer's written
consent) any non-public methodology, pricing, or proprietary
information of the Developer's that the Client learns in the course
of the engagement.

### 8.4 Survival
This §8 survives the termination or expiration of this Agreement
for a period of three (3) years.

---

## 9. Term and Termination

### 9.1 Term
This Agreement commences on the Effective Date and continues until:

- The Deliverables have been transferred per §4.4, **and**
- The 30-day post-transfer support window per §7 has expired, **and**
- All amounts due under §3 have been paid

### 9.2 Termination for convenience by the Client
The Client may terminate this Agreement for convenience at any time
before the transfer per §4.4 by written notice to the Developer. Upon
such termination:

- The Developer will deliver the work-in-progress to the Client
  under the same terms as the transfer per §4.4 (the Client owns
  what has been built, regardless of payment status, at termination
  for convenience).
- The Fee is reduced to reflect the actual work performed, at the
  Developer's then-current hourly rate, with a credit or refund to
  the Client for any amount paid in excess of the work performed.
- If the work performed equals or exceeds the Fee, no refund is due.

### 9.3 Termination for cause
Either Party may terminate this Agreement for cause upon written
notice if the other Party materially breaches the Agreement and
fails to cure the breach within 15 calendar days of written notice.
Upon termination for cause:

- By the Client (Developer's breach): the Fee is refunded pro rata
  for work not performed, and the Client owns all work performed.
- By the Developer (Client's breach, including non-payment): the
  Developer retains administrative access until the matter is
  resolved; the Client does not receive the transfer per §4.4 until
  the breach is cured.

### 9.4 Effect of termination
Upon any termination, each Party will return or destroy the other
Party's Confidential Information per §8, except as required by law
or as necessary to enforce the terms of this Agreement.

---

## 10. Limitation of Liability

### 10.1 Cap
The Developer's total cumulative liability under this Agreement is
limited to the **total Fee paid by the Client** under §3.

### 10.2 Exclusion of consequential damages
Neither Party is liable to the other for any indirect, incidental,
special, consequential, or punitive damages, including but not limited
to lost profits, lost revenue, lost data, or business interruption,
even if advised of the possibility of such damages.

### 10.3 Client responsibility for legal review
The Client is solely responsible for legal review of the website's
content, privacy notice, 42 CFR Part 2 notice, accessibility statement,
and any other text published on the site. The Developer does not
provide legal advice. The Client's failure to obtain legal review of
the `[ATTORNEY REVIEW PENDING]` items does not give rise to
Developer liability.

### 10.4 No guarantee of third-party services
The Developer does not guarantee the availability, performance, or
terms of any third-party service used in the build (Cloudflare,
GitHub Pages, Web3Forms / Formspree, the domain registrar, etc.). The
Client assumes the risk of any change in those services' terms or
availability.

---

## 11. Dispute Resolution

### 11.1 Informal resolution first
The Parties will attempt in good faith to resolve any dispute arising
out of or relating to this Agreement through informal discussion
between the Client's primary contact and the Developer, for a period
of not less than 15 calendar days from written notice of the dispute.

### 11.2 Mediation
If informal resolution does not resolve the dispute, the Parties will
attempt to resolve it through non-binding mediation administered by a
mutually-agreed mediator. Each Party bears its own costs; the
mediator's fee is split equally.

### 11.3 Jurisdiction and venue
If mediation does not resolve the dispute, any legal action or
proceeding arising out of or relating to this Agreement will be
brought exclusively in the state and federal courts located in
**[JURISDICTION TO BE SPECIFIED — recommended: the State of New
Jersey, Ocean County, given the Client's principal place of business]**.
Each Party consents to the personal jurisdiction of such courts and
waives any objection to venue.

### 11.4 Governing law
This Agreement is governed by the laws of the State of
**[GOVERNING LAW TO BE SPECIFIED — recommended: the State of New
Jersey]**, without regard to its conflict-of-laws principles.

---

## 12. General Provisions

### 12.1 Entire agreement
This Agreement, together with its Exhibits A, B, and C and the
referenced `CLIENT-PROPOSAL.md` and `PHASE-2.md` documents, constitutes
the entire agreement between the Parties regarding the Phase 1
engagement and supersedes all prior negotiations, representations,
or agreements.

### 12.2 Amendment
This Agreement may be amended only by a written instrument signed by
both Parties.

### 12.3 Severability
If any provision of this Agreement is held to be invalid or
unenforceable, the remaining provisions will continue in full force
and effect.

### 12.4 No waiver
The failure of either Party to enforce any provision of this Agreement
is not a waiver of that Party's right to enforce that provision later.

### 12.5 Assignment
Neither Party may assign this Agreement without the other Party's
written consent, except that the Developer may assign this Agreement
to a successor entity in connection with a merger, acquisition, or
sale of substantially all of its assets, upon written notice to the
Client.

### 12.6 Notices
All notices under this Agreement will be in writing and delivered by
email to the addresses on §1, with delivery deemed effective on the
next business day after sending.

### 12.7 Counterparts and electronic signature
This Agreement may be executed in counterparts, each of which is
deemed an original and all of which together constitute one
instrument. Electronic signatures (DocuSign, Adobe Sign, or
equivalent) are valid and binding.

---

## 13. Signatures

**IN WITNESS WHEREOF**, the Parties have executed this Phase 1
Engagement Agreement as of the Effective Date.

### For the Developer (Morgan Getkin):

```
Signature:  ___________________________________

Printed:    Morgan Getkin

Title:      Sole Proprietor

Date:       ______________________
```

### For the Client (Agape Counseling Services):

```
Signature:  ___________________________________

Printed:    ___________________________________

Title:      ___________________________________

Date:       ______________________
```

---

## Exhibits

- **Exhibit A:** [`CLIENT-PROPOSAL.md`](../docs/CLIENT-PROPOSAL.md) — the Proposal,
  including §2 (background), §4 (what was built), §5 (before/after),
  §6 (compliance), §11 (migration), §12 (Phase 2 scope), §13 (handoff
  package), §14 (investment summary)
- **Exhibit B:** [`PHASE-2.md`](../docs/PHASE-2.md) — the Phase 2 workstream index
  and the four-quadrant engagement model
- **Exhibit C:** [`docs-internal/DESIGN.md`](../docs-internal/DESIGN.md), Appendix C —
  the Pre-Demo Checklist, used for measurement of §4.1 only and not
  otherwise binding on the Parties

---

**END OF AGREEMENT.**

_Drafted 2026-06-19. Reviewed by counsel? _____ (initial here before signature.)_
