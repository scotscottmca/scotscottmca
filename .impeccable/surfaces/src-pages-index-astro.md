---
version: 1
slug: "src-pages-index-astro"
primary_target: "src/pages/index.astro"
related_targets: ["src/pages/cv.astro","src/pages/projects/index.astro","src/pages/posts/index.astro"]
---

## Scope

The home page (`src/pages/index.astro`) as the front door of a site pivoting from
blog to web-based CV, plus the CV, projects and posts index surfaces that inherit
its structural language. Visitor mode: **Experience** — the work leads.

## Audience and job

Tech recruiters assessing level, stack and scope in under two minutes, and
software-development enthusiasts looking for depth and voice. Neither is asked for
anything: Scott is explicitly not job-seeking, so no availability signal, no
hiring CTA, no lead capture anywhere on the site.

## Proof on hand

Live `/api/status` state (asleep/awake/walking/working-out/active with
confidence and durations), real commit and PR counts from a year at Patch My PC,
five shipped projects including a published Edge extension with demo video and
four releases, ten technical posts, a commissioned pixel-art emote set.

## Constraints

Mission Control visual system is pinned by the user and does not change. CV page
reads straight — no humour — while home, posts and projects carry the full voice.
Email addresses are never exposed; contact is LinkedIn, GitHub, and a form whose
mail provider is not yet configured. Bio, start date, education and photograph
stay deliberate placeholders.

## Direction contract

THESIS: The home page is a ledger read in two calm columns — who this person
is down the left, what they have shipped down the right. It refuses both the
personal-site default (a hero paragraph above a post list) and the dashboard
default it replaced: no tiles, no cell borders, no label on every block.

OWN-WORLD: Mission Control, inherited unchanged. Ground #12151a, panels #1b2027,
hairline rules #2c333d; amber #ffb400 for figures, green #3ddc73 for confirmed
and online, cyan #49e0ff for live and interactive. Chakra Petch uppercase labels
over Space Mono body. Revised this surface: boxes are removed in favour of space
— blocks are separated by empty bands, not by borders, and only a block that
genuinely needs naming carries a label.

STORY: A recruiter reads the left column to learn who this is and the right to
learn what they have built, in that order, without anything competing for the
same glance. An enthusiast follows any row into its write-up. Neither is
solicited.

FIRST VIEWPORT: Two columns, five and six of twelve with a full column of gap.
Left: the live state word at display scale with its supporting sentence, then a
full band of empty space, then the identity block (name, role, base, post,
socials, and the two career figures), then another empty band, then the
telemetry readouts as label/value lines. Right: shipped work as one unboxed
ledger, one project per row with wide leading, each row carrying status and a
one-line summary. The left column is allowed to end early and leave the page
uneven. No primary action; navigation is the only route onward.

FORM: The Ledger — index 4 of seven re-rolled structures, dealt as the lead in
re-roll round 1 after the user found the previous build too noisy. Seed key
c04c2924. Superseded form: The Instrument Panel (twelve-division tile grid),
rejected on density in live use.

FINISH: unreviewed and undocumented is unfinished; this build ends with the
finish review, the verdict, DESIGN.md, and every shipping raster carrying its
provenance

## Unresolved

Contact-form mail provider undecided — the form must fail honestly and point at
LinkedIn until one exists. Bio paragraph, Patch My PC start date, education and
photograph remain user-supplied placeholders by explicit decision.
