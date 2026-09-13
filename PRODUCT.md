# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences arrive with different jobs, and the site must serve both without
compromising either.

**Tech / software-development enthusiasts and nerds** (the original audience).
They arrive from search, RSS, a link in a Slack or Reddit thread, or from one of
Scott's shipped tools. Their job is to solve a specific problem — a WSUS sync
that won't finish, an Intune log they can't collect — or to be entertained by
someone with the same obsessions. They stay for depth and for voice, and they
recognise when a site is written by someone who actually does the work.

**Tech recruiters.** They arrive from LinkedIn or a search on Scott's name,
usually assessing rather than reading. Their job is to answer "what is this
person, at what level, in what stack, and is it real?" in a couple of minutes.
They skim, they need scannable structure, and they distrust unsupported claims.

## Product Purpose

A personal site that began as a technical blog and is pivoting to work primarily
as a web-based CV, with the blog continuing alongside it rather than being
retired. It exists to establish credibility and show real work.

Success is a visitor from either audience coming away with an accurate,
specific picture of what Scott builds — not a lead, an application, or a
conversion. **Scott is explicitly not job-seeking.** The site must never solicit
work, signal availability, or push a hiring CTA.

## Positioning

Most personal-CV sites assert capability. This one demonstrates it, and the
demonstrations are the site itself:

- A **live status page** backed by real Fitbit sleep/activity data through the
  Google Health API and an Azure Function, resolving to `asleep`, `awake`,
  `walking`, `working-out` or `active` with a confidence level. A personal site
  that knows whether its owner is currently asleep is not a claim a neighbouring
  CV site can copy without building the same pipeline.
- **Shipped, linkable tools** (a published Edge extension, a PowerShell utility,
  parody and experiment projects) rather than described side projects.
- A working span that is genuinely unusual: deep Microsoft endpoint-management
  (WSUS / ConfigMgr / Intune, PowerShell, WPF) *and* current AI/agent
  infrastructure (GPT-5.x pipelines, MCP, evidence tooling, Terraform/Azure).
- Self-aware humour — "Software Developer / AI Janitor" — that reads as
  confidence rather than deprecation, because the substance underneath it holds.

## Operating Context

- Astro 5, static output, hand-written CSS, no framework and no CSS library.
- Deployed to Azure Static Web Apps at `scotscottmca.com` via an Azure-generated
  GitHub workflow on push to `main`. Preview environments for PRs.
- An Azure Functions API (`api/`) serves `/api/status`; a scheduled workflow
  keeps it warm. The site is otherwise fully static.
- Content lives in Markdown collections: `posts`, `projects`, `releases`.
- Google Analytics behind Consent Mode v2 — analytics denied until the visitor
  opts in through vanilla-cookieconsent.
- Release notes for shipped apps are collected and dispatched automatically into
  `src/content/releases/<app>/`.
- The repo is worked on from multiple sessions in parallel; work starts with a
  fresh pull (recorded in AGENTS.md).

## Capabilities and Constraints

**Working today:** home, posts index and post pages, projects index and project
pages, CV, live status, per-app release notes, RSS, sitemap, 404, cookie
consent, heading permalinks with copy-to-clipboard.

**Live status contract.** `/api/status` returns `status`, `confidence`, and
depending on state: `asleepForMin`, `awakeForMin`, `workout {name, durationMin,
endedMinAgo}`, `walk {name, durationMin, endedMinAgo, steps}`, `steps {recent,
windowMin}`, `heartRate {bpm, atMinAgo}`, `lastSleep {start, end, durationMin}`.
It can be unreachable, and the UI must degrade honestly when it is.

**Contact.** Confirmed routes are LinkedIn, GitHub, and a contact form. **Email
addresses are deliberately not exposed** — the `mailto:you@example.com`
placeholder currently in the CV must be removed, not filled in. A working form
requires a mail provider and secret that are **not yet decided or configured**;
until then the form must fail honestly and point at LinkedIn.

**Deliberately unresolved — do not invent these:**

- Scott's real bio paragraph (home log entry, CV summary).
- Start date at Patch My PC (CV shows "TBC — start date · Present").
- Education and certifications (no record).
- A photograph of Scott (the site has pixel-art avatars only).
- Whether a downloadable PDF CV exists.
- The contact-form mail provider.

These stay visible as placeholders by the user's explicit decision. Design must
make them read as deliberate, not unfinished.

## Brand Commitments

- Name **ScotScottMcA**, person **Scott McAllister**, domain `scotscottmca.com`.
- Self-described role: **"Software Developer / AI Janitor."** Based in Larkhall,
  Scotland.
- Voice: dry, Scottish, self-aware, technically precise. Recurring furniture:
  dachshunds, black coffee and weird beers, AI slop, decommissioning obsolete
  technology.
- A commissioned **pixel-art emote set** of Scott hoisting obsolete tech beside a
  recycling bin (`public/images/emotes/`: self, clippy, crt-monitor, email,
  internet-explorer, pdf, printer). These are personal, paid-for assets and are
  part of the identity.
- Pixel-art "status sprites" of Scott for each live state
  (`public/images/status/scott-{awake,asleep,walking,working-out,active}.svg`),
  drawn by `scripts/status-sprites.mjs` in the emote set's own palette so the
  two Scotts are the same person.
- Socials: GitHub `smcallister594`, LinkedIn `/in/scottmca`, X `@ScotScottMcA`,
  Reddit `Scott-PatchMyPC`.
- Licence CC BY-NC 4.0. Google Analytics ID `G-2DLW833T23` must be preserved.
- **Tone splits by surface, by the user's decision:** home, posts and projects
  carry the full voice; the CV page reads straight, as a conventional résumé.

## Evidence on Hand

**Real, and usable:**

- 10 published posts (2022–2023) on WSUS, ConfigMgr, Intune, PowerShell, C# and
  Graph — including original reporting (the "Sleeping 120 more seconds" post
  traced a 2007 WSUS sleep constant to its source via Meghan Stewart).
- 5 projects: GifTamer (published Edge extension, with demo video and 4 released
  versions), MEM Patching Optimizer / Project Clippy, Search-JsonForErrorCodes,
  Hallucinating A Blog, Clud Code.
- A consolidated year of professional work at **Patch My PC**, drawn from real
  commit and PR history: Customer Portal & Customer API (~104 commits,
  Mar–Sep 2026), Cliffs Notes AI release-notes generator (79 commits, 30-minute
  timeouts cut to 4–5 minutes, 2,900+ redundant API calls eliminated, 59/59
  tests), Arthur v2 AI log-analysis platform (1,096+ commits, blue/green release
  control, MCP integration), Publisher Remote UI (512 PRs authored, 484 merged).
- A live personal-status pipeline with real biometric data.
- The emote and status-sprite art sets.

**Absent — must not be fabricated:** testimonials, client logos, named
references, employment dates before the current role, academic history, salary
or availability, user counts or download numbers for any project, and any
performance metric not listed above.

## Product Principles

1. **Demonstrate, never assert.** Every capability claim on this site should be
   backed by something the visitor can click, read, or watch happen live.
2. **Serve the skimmer and the reader with the same page.** A recruiter must
   extract level, stack and scope in under two minutes; an enthusiast must find
   real depth underneath that. Neither gets a degraded version.
3. **The site does not want anything from you.** No availability signals, no
   hiring CTAs, no lead capture, no newsletter nags. Credibility is the entire
   ask.
4. **Honest gaps beat invented content.** Unknown facts stay visibly unknown and
   are designed as deliberate states. Nothing is filled in to look complete.
5. **Voice is a filter, not a costume.** Humour carries the personal surfaces;
   the CV earns trust by dropping it. Both are the same person.

## Accessibility & Inclusion

No formal standard has been set, but the existing implementation already honours
`prefers-reduced-motion` for every animated element, keeps visible focus states,
and gives all imagery real alternative text. Future work preserves these. Live
status updates are announced via `aria-live`. Colour must never be the sole
carrier of state.
