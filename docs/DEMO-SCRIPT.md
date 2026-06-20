# Agape — Demo Script & Handoff Agenda

**Document version:** 1.0
**Audience:** Client (Agape Counseling Services) + developer-of-record
**Format:** 60–90 minute single-session walkthrough; structured handover of the rebuilt agapenj.org website, the editing + compliance documentation, and operational credentials.
**Companion docs:** [`CLIENT-PROPOSAL.md`](./CLIENT-PROPOSAL.md) · [`EDITING_GUIDE.md`](./EDITING_GUIDE.md) · [`COMPLIANCE.md`](../COMPLIANCE.md) · `CREDENTIAL-LOG.md` (sealed envelope, presented in-person) · Loom walkthrough video (link provided with the handoff email)

---

## 1. Purpose of this document

This is the **agenda and protocol** for the final demo of the rebuilt agapenj.org website. It serves three audiences:

1. **The client** — so you know exactly what to expect in the meeting, what will be shown, what will be asked of you, and what you'll walk away with.
2. **The developer** — as the operational script for running the 60–90 minute session on demo day, including timing, talking points, and the order in which materials are presented.
3. **A future maintainer** (yourself, your successor, an AI agent) — as a record of *how* the handover happened and *what* was decided.

There is exactly one demo per project. It is a coordinated handover event, not an open review session. By the end of the meeting, the site is live on `agapenj.org`, the documentation is on disk, and the repository belongs to you.

---

## 2. Pre-Demo Readiness Gate

**The demo does not start until every item on the Pre-Demo Checklist is verified green.**

This is non-negotiable. A demo against an incomplete build is worse than no demo, because the demo is also the **handoff moment** — if anything is broken, broken becomes the new "finished asset." The dev runs the full Pre-Demo Checklist **24–48 hours before the scheduled demo date**. If anything is open, the demo is rescheduled with a new target date; the spec is not relaxed, and "we'll fix it live during the demo" is not an option.

**What you (the client) do before the demo:**
- Confirm the scheduled date and time (the dev sends a calendar invite).
- Confirm any open decisions the dev flagged in the mid-build Progress Confirmation email (e.g., DNS provider credentials, billing contact for Web3Forms).
- Make sure the person who will own the GitHub repo, the domain registrar, and the Cloudflare DNS is in the room — or on the call — at the **1:25 Q&A + approval** moment at the latest.

If you can't make the originally scheduled date, reply to the calendar invite and we reschedule. There is no penalty for rescheduling; the gate just moves with the date.

---

## 3. Demo Timeline (60–90 minutes)

The meeting is structured as six timed segments. Each segment has a clear start, end, owner, and outcome.

| Time | Segment | Owner | Outcome |
|------|---------|-------|---------|
| 0:00–0:05 | **Readiness check** | Dev | Confirm Pre-Demo Checklist is green; reschedule if not. |
| 0:05–0:35 | **Live site walkthrough** (30 min) | Dev drives, client observes | Client sees the live site on `agapenj.org`, mobile-first then desktop, every section in order. |
| 0:35–0:55 | **Live editing demo** (20 min) | Dev drives, client follows along | One real edit is made on the live repo, deployed, and visible on `agapenj.org` within 60 seconds. |
| 0:55–1:10 | **DNS & email security walkthrough** (15 min) | Dev drives, client decides and signs | Client chooses DMARC policy and reporting mailbox; both written into the credential log on the spot. |
| 1:10–1:25 | **Compliance & credentials review** (15 min) | Dev delivers, client receives | Walk through `COMPLIANCE.md`; hand over the sealed credential envelope. |
| 1:25–1:30 | **Q&A and approval** (5 min) | Client decides | If approved, the GitHub repository is transferred **in this meeting**. |

---

## 4. Segment 1 — Readiness check (0:00–0:05)

The dev opens with the Pre-Demo Checklist output on screen. The format is a short pass/fail summary per item — typically "62 pass, 0 fail, 1 warn." The single warn is the DMARC `rua` mailbox entry, which legitimately requires your Cloudflare and Google Workspace credentials; that gets resolved in Segment 4, not before.

If any item is **fail**, the dev stops the demo and reschedules. There is no live-remediation path. The build is either ready or it isn't.

---

## 5. Segment 2 — Live site walkthrough (0:05–0:35, 30 minutes)

This is the part where you see what was built. The dev opens the site on **your phone first** (mobile-first is the spec — most visitors will arrive on a phone), then switches to a desktop browser. Each section is shown in reading order:

1. **Hero** — bilingual headline, no-wait banner, call-to-action. The dev clicks the **Call** button to verify the `tel:` link works on the phone.
2. **About / counselor intro** — credentials, experience, philosophy. The dev scrolls through and shows the accessibility callouts (semantic headings, focus rings on tab).
3. **Services** — IOP, individualized counseling, anger management, reiki & meditation. The dev clicks into one service card and shows the detail view.
4. **FAQ** — accordion-style, keyboard-navigable, opens with one tap.
5. **Contact + form** — the dev fills out the form on screen and submits it; you should see a success state. **This is the moment that requires the Web3Forms access key to be live; if it isn't, we stop and reschedule.**
6. **Footer** — privacy notice, 42 CFR Part 2 statement, accessibility statement, crisis resources (988, SAMHSA, NJ ReachNJ). The dev scrolls back up and shows the **sticky navbar** with the Call button always visible.

Throughout this segment, the dev points out **what is intentionally absent**: no tracking scripts, no cookie banner, no third-party analytics that require consent, no animations that distract from content. The site loads in under one second and contains zero marketing trackers.

**Outcome:** you've seen the site exactly as a visitor will see it. If something looks wrong, this is the time to say so — but per the Waterfall-lite model, the build was already validated against the Pre-Demo Checklist; this segment is a **confirmation**, not a redesign window.

---

## 6. Segment 3 — Live editing demo (0:35–0:55, 20 minutes)

This is the part that demystifies the editing workflow. The dev opens `EDITING_GUIDE.md` (a 1–2 page non-technical document you can refer back to later) and walks you through one **real** content edit:

1. Open the GitHub repo in the browser.
2. Navigate to a service description file (e.g., `src/content/services/iop.md`).
3. Click the pencil icon to edit, change one sentence, click **Commit changes**.
4. GitHub Actions kicks off an automatic build and deploy.
5. Within 60 seconds, the change is visible on `agapenj.org` (the dev refreshes to confirm).

The dev also walks through three other routine edits the document covers:
- Updating the **access banner** ("currently accepting new clients" / "waitlist" toggle).
- Changing the **phone number** or **email** in the navbar + footer + Contact section (all three at once, because they're wired to a single config file).
- Updating a service's **Google search preview** (the `seo:` frontmatter block in any content file).

**Outcome:** you have seen the workflow end-to-end. You do not need to remember the steps — `EDITING_GUIDE.md` is the reference, and the Loom walkthrough video (link in the handoff email) repeats the same flow with voiceover.

---

## 7. Segment 4 — DNS & email security walkthrough (0:55–1:10, 15 minutes)

This is the one segment that **requires your active decision**. Everything else is "look and approve." This one is "decide, sign, and the credential is committed to your Cloudflare DNS in real time."

The dev opens Cloudflare DNS for `agapenj.org` and walks you through three records:

- **MX records** — Google's email servers. Already configured for Google Workspace. Verified unchanged pre/post cutover.
- **SPF `TXT` record** — read-only reference; confirms only Google can send mail on your behalf.
- **DMARC `TXT` record at `_dmarc.agapenj.org`** — this is the one the dev added, and it needs two of your decisions:
  1. **DMARC policy** — three options: `p=none` (monitor only, no enforcement), `p=quarantine` (recommended default; suspicious mail goes to spam), `p=reject` (strictest; suspicious mail is dropped at the receiving server). The default is **`p=quarantine`**.
  2. **DMARC `rua` reporting mailbox** — the address that receives daily reports about who is sending mail claiming to be from `@agapenj.org`. The default is **`dmarc-reports@agapenj.org`**, which routes into your Google Workspace.

Both choices are written into the credential log **on the spot** and added to the Cloudflare record before the meeting ends.

**Outcome:** two decisions signed, both written into DNS and the credential log.

---

## 8. Segment 5 — Compliance & credentials review (1:10–1:25, 15 minutes)

The dev opens `COMPLIANCE.md` — the audit-trail document that tracks every legal and regulatory item the build touches. Each row has two columns: the implementation's compliance status, and (where applicable) the attorney's sign-off date.

Rows covered in the walkthrough:

- Privacy notice (current, linked from the footer).
- 42 CFR Part 2 federal confidentiality statement (counseling-specific; reflects the fact that agape is a Substance Use Disorder treatment provider).
- Accessibility statement (WCAG 2.1 AA conformance claim, per the Lighthouse 100/100/100/100 audit).
- Crisis resources surfaced near the footer (988, SAMHSA, NJ ReachNJ).
- Testimonial posture (none live at launch per §3.3.5 of the internal spec; `TESTIMONIAL-REVIEW.md` is the Phase 2 prep tool).
- DNS & email security baseline (DMARC, SPF, DKIM; signed in Segment 4).

After the compliance review, the dev hands over the **credential envelope** (sealed; presented in-person, not emailed). Contents:

- Web3Forms endpoint URL + access key
- Cloudflare Web Analytics dashboard URL
- GitHub repo URL + transfer status
- Domain registrar login (your account)
- Cloudflare DNS login (your account)
- Google Workspace admin login (for DKIM rotation and the `dmarc-reports@` mailbox)
- DNS records reference (DMARC, SPF, DKIM, MX — current values + change history)

The dev walks through each entry verbally. **You add the credentials to your password manager live** (1Password, Bitwarden, or whatever your team uses) while the dev is still on the call, so any questions are answered in real time.

**Outcome:** compliance reviewed and acknowledged; credentials transferred and stored.

---

## 9. Segment 6 — Q&A and approval (1:25–1:30, 5 minutes)

The final five minutes are yours. Common questions at this stage:

- *"What if I want to change X later?"* — `EDITING_GUIDE.md` covers it. If it's not in the guide, the 30-day support window covers it.
- *"What if the site goes down?"* — the repo is now yours; the 30-day support window includes incident response; after 30 days you have a support contact path documented in the credential log.
- *"Can I add another service later?"* — yes; `EDITING_GUIDE.md` §3 covers it (drop a markdown file into `src/content/services/`, fill in the frontmatter, commit).
- *"What about testimonials?"* — none at launch by design (42 CFR Part 2 review per `TESTIMONIAL-REVIEW.md`); Phase 2 add-flow is documented.

When you say **"approved,"** the GitHub repository transfer begins **in this meeting** — see Section 10.

---

## 10. Repository transfer (immediate, in-meeting)

The dev opens GitHub → Settings → Danger Zone → Transfer ownership. Enters your GitHub organization name. Confirms.

You receive the transfer notification by email and click accept — either in the meeting or within the 30-day safety window if the email is delayed.

After the transfer:
- The repository is yours outright.
- The dev does **not** retain admin access (the relationship becomes a support contract, not a content-owner relationship).
- The legacy Town Square Interactive site remains live in parallel for the 30-day dual-running window, so you can roll back to it at any point during that window.

---

## 11. Post-demo: 30-day support window

For 30 days after the demo:

- **Bug fixes** — any defect discovered is fixed at no additional cost.
- **Small copy edits** — up to 30 minutes per day of small text changes; larger content work is quoted separately.
- **DNS / cutover questions** — the dev is available to walk you through the final TSI cancellation, the 301 redirect retirement, or any Cloudflare DNS issue.
- **Escalation** — if an issue is large (e.g., a 42 CFR Part 2 exposure not caught in the Pre-Demo Checklist), a separate engagement is opened and quoted.

After 30 days, support is on a paid basis at the standard hourly rate, or a separate maintenance agreement is signed.

---

## 12. What you walk away with

| Artifact | Format | Where it lives |
|----------|--------|----------------|
| Live site | Web | `https://agapenj.org` |
| `EDITING_GUIDE.md` | Markdown + PDF | `docs/` in the transferred repo |
| `COMPLIANCE.md` | Markdown + PDF | repo root |
| `CLIENT-PROPOSAL.md` (this engagement's contract) | Markdown + PDF | `docs/` in the transferred repo |
| `TESTIMONIAL-REVIEW.md` (Phase 2 prep) | Markdown + PDF | `docs/` in the transferred repo |
| `CREDENTIAL-LOG.md` | Sealed envelope + 1Password entry | your password manager |
| Loom walkthrough video | Link | handoff email |
| DNS records reference | Inside credential envelope | your password manager |
| GitHub repo | Web + Git | your GitHub org |

---

## 13. If you need to reschedule

Reply to the calendar invite with two or three alternative windows in the next 7–10 days. The Pre-Demo Checklist re-runs 24–48 hours before the new date. No penalty, no scope change — the build stays the same; the meeting moves.

---

*End of demo script.*
