# Agape — Editing Guide

> **A non-technical walkthrough for editing the website yourself.**
> Plain English. No jargon. A screenshot lives at every step.
>
> If you can edit a Word document, you can edit this site.

---

## What You'll Need

- A free GitHub account (we'll create one with you at the demo if you
  don't have one already).
- A web browser.
- That's it. No software to install. No command line. No servers.

---

## The Big Idea (read this once, you'll get it forever)

Every word you see on the website lives in a **plain text file** in
this repository. To change the website:

1. Open the file on GitHub.com in your browser.
2. Edit the text.
3. Click "Commit changes."

That's it. The site rebuilds automatically. Your change is live in
about 60 seconds.

There's no vendor portal to log into. No support ticket to file.
No developer to call. You edit, GitHub rebuilds, the change is live.

> **One-and-Done Handoff.** You own this repository. You own the
> infrastructure dashboard. There is **no ongoing maintenance** from
> the original developer and **no subscription fees**. If you ever
> need help, the 30-day post-demo support window is your first stop.
> After that, any developer who reads Markdown and Git can maintain
> the site.

---

## Section 1: How to Edit a Service Description

> **Goal:** change the text that appears under "Intensive Outpatient
> Program" on the homepage.

**Step 1.** Open the file in your browser:

```
https://github.com/<your-org>/agape/blob/main/src/content/services/iop.md
```

> 📸 **Screenshot:** the GitHub file view of `iop.md`, with the
> pencil icon (✏️) in the upper-right highlighted.

**Step 2.** Click the **pencil icon (✏️)** in the upper-right of the
file view. GitHub will switch to edit mode.

> 📸 **Screenshot:** the same file now in edit mode, with a text
> editor and a "Commit changes" button at the bottom.

**Step 3.** Find the paragraph you want to change. It looks like this:

```markdown
Group sessions three nights a week with a weekly 30-minute individual
session. Educational, supportive, evidence-based.
```

Click into the text and edit it like you would in any word
processor. The Markdown formatting (the dashes, asterisks, etc.) is
fine to leave alone — only the visible text matters for this edit.

**Step 4.** Scroll to the bottom of the page. In the "Commit changes"
box, type a short note about what you changed (e.g., "Updated IOP
description to mention telehealth option"). Click the green
**"Commit changes"** button.

**Step 5.** Wait about 60 seconds. Visit `https://agapenj.org` in
your browser (you may need to hard-refresh: Cmd+Shift+R on Mac,
Ctrl+Shift+R on Windows). Your change is live.

> 📸 **Screenshot:** the live site showing the updated text.

**That's the entire workflow.** Every editable piece of the site
works the same way.

---

## Section 2: How to Update the Access Banner

> **Goal:** change the bilingual / Medicaid / no-wait banner that
> appears near the top of the page.

**Step 1.** Open the file:

```
https://github.com/<your-org>/agape/blob/main/src/pages/index.astro
```

**Step 2.** Find the `<section id="access" aria-labelledby="access-heading">`
block (search the file with Ctrl+F / Cmd+F for "bilingual services").
Edit the text inside the `<p class="text-center...">` lines.

**Step 3.** Pencil icon → edit → "Commit changes." Same as Section 1.

> 📸 **Screenshot:** the access banner section in the GitHub editor
> with the bilingual / Medicaid / no-wait text highlighted.

> ⚠️ **Don't change the section structure or the `id="access"`.** Other
> places in the site (and Google's crawlers) depend on that anchor
> staying put. Just edit the visible text.

---

## Section 2.5: How to Update the FAQ — adding a new question

> **Goal:** add a new question + answer to the FAQ section between
> Testimonials and Contact. Most edits to the FAQ take 2 minutes.

**Where the FAQ lives:** the FAQ section is data-driven from a single
JSON file. You don't touch any component code to add a question —
just the data file. This is intentional (DESIGN.md §3.3.8): JSON is
the lowest-friction format for a non-developer to edit safely.

**Step 1.** Open the data file in your browser:

```
https://github.com/<your-org>/agape/blob/main/src/data/faq.json
```

> 📸 **Screenshot:** the JSON file open in GitHub, with the `items`
> array highlighted.

**Step 2.** Click the **pencil icon (✏️)** to edit.

**Step 3.** Inside the `items` array, add a new object. Each item has
exactly three fields:

```json
{
  "id": "faq-q-anything-kebab-case",
  "question": "Your question here?",
  "answer": "The answer goes here. Plain text only — no HTML, no Markdown."
}
```

**Rules (the build will fail if any of these are violated):**

- **`id`** must match the pattern `faq-q-<kebab-case>`. Use a stable
  id — once published, keep it the same for the same question (it
  preserves deep links like `agapenj.org/#faq-q-anything-kebab-case`).
- **`question`** ≤ 200 characters, plain text.
- **`answer`** ≤ 1,000 characters, plain text. **No HTML, no Markdown.**
  The answer renders as a single paragraph.
- **`id`s must be unique** across the file.
- **Up to 20 questions total** in the `items` array.

> 📸 **Screenshot:** a worked example showing the diff — one question
> added at the end of the `items` array.

**Step 4.** Commit. The CI build runs `npm run check:faq` automatically.
If the JSON is valid, the build goes green in about 30 seconds. If
the build fails, the GitHub Actions log shows exactly which item
violated which rule.

**Step 5.** Verify on the live site. Visit `https://agapenj.org/#faq`,
scroll to your new question, click it open. The answer appears.

> ⚠️ **The `answer` field is plain text.** If you paste formatted text
> from Word or Google Docs, the bullet points, smart quotes, and
> non-breaking spaces may render weirdly. Paste plain text only —
> use a plain-text editor like TextEdit or Notepad in between if
> needed.
>
> 📸 **Screenshot:** a comparison of "pasted from Word" vs "pasted
> from TextEdit" — the Word paste has hidden characters the build
> accepts but renders as visible junk.

**What this section does NOT cover:**

- **Restyling the FAQ cards.** That's a developer task — ask your
  dev during the support window.
- **Adding a /faq page.** That's Phase 2; see CLIENT-PROPOSAL.md.

---

## Section 3: How to Add a New Testimonial (Phase 2)

> **Prerequisite:** the testimonial has a signed 42 CFR Part 2 consent
> form on file. See `TESTIMONIAL-REVIEW.md` (separate document) for
> the worksheet.

**Step 1.** Decide on a filename for the testimonial. Convention:
`<firstname>-<last-initial>.md` (e.g., `jane-d.md`).

**Step 2.** Open the testimonials folder on GitHub:

```
https://github.com/<your-org>/agape/tree/main/src/content/testimonials
```

**Step 3.** Click **"Add file" → "Create new file"** in the upper-right.

**Step 4.** Paste this template into the file:

```markdown
---
name: "Jane Doe"
service: "Individualized Counseling"
featured: true
consent_date: "2026-06-15"  # The date the 42 CFR Part 2 form was signed
consent_hash: "abc123def456"  # A short reference to the form (you set this)
seo:
  title: "Client Testimonial — Jane D. | Agape Counseling"
  description: "Read how Jane D. found help at Agape Counseling Services in Lanoka Harbor, NJ."
---

"For the first time in years, I felt heard without judgment."
```

Fill in the actual content. Click **"Commit new file"** at the bottom.

**Step 5.** Wait about 60 seconds. The testimonial appears on the
homepage automatically. The testimonial is ungated on the build —
no developer work needed.

> ⚠️ **Do not commit a testimonial without a signed consent form.**
> The site includes this field as a structural reminder; build-time
> compliance is enforced via the schema.

---

## Section 4: How to Update the Page Title & Google Search Preview

> **Goal:** change what shows up in Google search results for the
> homepage and service pages. The page title and the meta description.

**The two fields that matter for the homepage:**

- `title` (in `src/layouts/BaseLayout.astro`) — the **blue headline**
  in Google search results (keep under 60 characters).
- `description` (in `src/layouts/BaseLayout.astro`) — the **gray
  snippet** below the headline (keep under 155 characters).

**The two fields that matter per-service (IOP, Anger Management, etc.):**

- `seo.title` (in the service's `.md` frontmatter) — overrides the
  page title when this service is shown.
- `seo.description` (in the service's `.md` frontmatter) — overrides
  the meta description.

### Updating the homepage title / description

**Step 1.** Open the homepage layout file:

```
https://github.com/<your-org>/agape/blob/main/src/layouts/BaseLayout.astro
```

**Step 2.** Find the `title` and `description` defaults at the top
of the frontmatter (around line 41–44). Edit the strings.

```ts
const {
  title = 'Agape Counseling Services — Lanoka Harbor, NJ',
  description = 'Outpatient substance use disorder counseling in Lanoka Harbor, NJ. ...',
  ...
} = Astro.props;
```

> 📸 **Screenshot:** the frontmatter in BaseLayout.astro with the
> `title` and `description` defaults highlighted.

**Step 3.** Click **"Commit changes"** at the bottom.

**Step 4.** Wait 60 seconds. Visit `https://agapenj.org` in your
browser. Open browser DevTools (Cmd+Option+I on Mac, F12 on Windows)
→ Elements tab → look at the `<title>` and `<meta name="description">`
tags. Your change is live.

> ⚠️ **DO NOT edit `seo:` inside a service `.md` for the homepage.**
> The homepage doesn't iterate over services; it uses the
> BaseLayout defaults. Use the BaseLayout edit described above.
> Use the per-service SEO block (below) only when you want a
> specific service's Google snippet to differ from the homepage.

### Updating per-service SEO (each service has its own Google snippet)

**Step 1.** Open a service file (e.g., IOP):

```
https://github.com/<your-org>/agape/blob/main/src/content/services/iop.md
```

**Step 2.** Add (or edit) an `seo:` block at the bottom of the
frontmatter:

```markdown
---
title: "Intensive Outpatient Program (IOP)"
order: 1
icon: "users"
summary: "Group sessions three nights a week..."
bullets:
  - "..."
featured: true
seo:
  title: "Intensive Outpatient Program in Lanoka Harbor, NJ | Agape"
  description: "Group IOP three nights a week, evidence-based, with a weekly individual session. Medicaid accepted, no wait list. (609) 242-0086."
---
```

> 📸 **Screenshot:** the `seo:` block in the `iop.md` frontmatter,
> with `title` and `description` fields highlighted.

**Step 3.** Commit. Wait 60 seconds. The build re-runs.

**Step 4.** Preview locally (optional but recommended before going
live):

- If you have a developer on hand, ask them to run `npm run dev`
  locally and show you the Google preview pane in browser DevTools.
- Otherwise, just commit and wait 60 seconds — Google picks up the
  new title on next crawl (typically within a week for low-traffic
  pages).

> ⚠️ **DO NOT touch the top-level `title:` field unless you mean
> to.** The `title:` field is the in-page heading (e.g., the H2
> inside a service card). The `seo.title` field is what Google
> reads in search results. They look similar; they do different
> jobs. Conflating them is the most common mistake.
>
> 📸 **Screenshot:** the `title:` vs `seo.title` distinction with
> callouts pointing to where each appears on the live site.

---

## Section 5: How to Roll Back a Bad Change

> **Goal:** undo a recent edit without calling a developer.

**Step 1.** Open the commit history:

```
https://github.com/<your-org>/agape/commits/main
```

**Step 2.** Find the commit that introduced the bad change. Each
commit has a message describing what was changed.

**Step 3.** Click the commit, then click **"Revert"** in the
upper-right corner. Click **"Create pull request"** → **"Merge pull
request"**. Done.

The site reverts to the previous state within 60 seconds.

> 📸 **Screenshot:** the "Revert" button highlighted on a commit
> page.

---

## Section 6: The Credential Log (Sealed Envelope)

At the demo, you will receive a **sealed envelope** containing the
credentials for every account that powers the website. Do NOT open
this envelope until the demo. The sealed envelope is the controlled
handover moment — it ensures you receive every credential in one
place, in one go, with the developer there to walk you through each
one.

**What's in the envelope (1Password / Bitwarden import format):**

| Item | Value | Notes |
|---|---|---|
| GitHub organization | `<your-org>` | The org that owns the repo |
| GitHub admin account | (your email) | Admin access to the org |
| Cloudflare account | (your email) | The account that manages DNS for `agapenj.org` |
| Web3Forms access key | (the access key string) | Required for the contact form to relay to your inbox |
| Web3Forms destination email | (the inbox that receives submissions) | Should be a monitored staff email |
| Google Workspace admin | (your email) | You manage this directly; **not modified by this build** |
| Domain registrar | (your email) | Where you renew `agapenj.org` annually |
| DMARC reporting mailbox | `dmarc-reports@agapenj.org` | Receives daily aggregate reports on email-spoofing attempts against your domain |

**The credentials will be handed over to your dedicated project-admin
email account.** The dev will demonstrate logging into each account
live at the demo, then hand over the envelope.

**After the demo:**

1. Import the credentials into your password manager (1Password,
   Bitwarden, etc.).
2. Enable two-factor authentication (2FA) on every account if you
   haven't already.
3. Store the password manager vault in a location accessible to
   other board members / IT support — don't keep it only on one
   person's laptop.

---

## Section 7: Who to Contact When

| Situation | First stop | Then |
|---|---|---|
| I want to edit a service description | This guide, Section 1 | Open a GitHub issue |
| The site is down | GitHub Actions status (`github.com/<your-org>/agape/actions`) | DNS rollback (see README.md § "How to Roll Back") |
| A deploy failed | Click the red X on the failed commit — read the error message | Revert that commit |
| A testimonial question | `TESTIMONIAL-REVIEW.md` (separate document) | The 42 CFR Part 2 worksheet |
| I want to add a feature | The 30-day post-demo support window | Re-engage the dev as a separate engagement |
| I'm locked out of an account | Your password manager | The vendor's account recovery flow |

---

## What This Guide Does NOT Cover

- **Local development setup** (running the site on your own laptop).
  Most clients don't need this — the GitHub web UI is enough. If you
  do need it, ask the dev for a 30-minute walkthrough during the
  support window.
- **Adding new pages** (e.g., a Spanish version, a blog). These are
  Phase 2 workstreams; see `CLIENT-PROPOSAL.md` § 12 for sizing.
- **Changing the brand colors or logo.** The current brand is locked
  in. If you want to change it, that's a separate Phase 2 engagement.

---

## One Last Thing

**You own this.** The repository. The infrastructure. The content.
The deploy pipeline. There is no proprietary dependency on the
original developer. There is no subscription. There is no lock-in.

If you ever want to hand the project to a different developer,
they can pick up exactly where this leaves off — `git clone` and
they're inside.

That's the point.

---

**End of editing guide.** Questions in the first 30 days post-demo:
reach out via the contact details in the sealed envelope handed
over at the demo.