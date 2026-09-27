---
version: 1
slug: "src-pages-index-astro"
primary_target: "src/pages/index.astro"
related_targets: ["src/pages/cv.astro","src/pages/projects/index.astro","src/pages/posts/index.astro","src/pages/status.astro","src/pages/id-10-t.astro"]
---

## Scope

The whole site: home (`src/pages/index.astro`) plus posts, projects, releases,
CV and 404 in one minimalist-tech system. Two deliberate exceptions: `/status`
is nerdy, `/id-10-t` is fun. Mode: Experience for home, Read for posts and CV.

## Audience and job

Tech enthusiasts, software developers and recruiters. Recruiters need name,
role, employer, stack and proof in one viewport; developers want depth and
voice. Nothing is solicited: no availability signal, no hiring CTA.

## Constraints

The user rejected the brand-deck redesign (Sep 2026) and asked for "minimalist
yet tech / software themed", built on four swatches: Royal Smoke
(#6A0DAD/#1C1C1C), Dark & Elegant (#1F1F1F/#0A1A2F), Obsidian Glow
(#3A0CA3/#050505), Neon Dusk (#00D4FF/#020024). Home carries no live status.
Icons remain Lucide Animated.

## Direction contract

THESIS: A developer's site that reads like well-made tooling: quiet type, real
data rendered the way a terminal would render it, one violet glow. It refuses
the loud brand deck it replaced and the neon-cyberpunk costume.

OWN-WORLD: #050506 ground with a fixed indigo bloom top-right; navy panels at
55% over ink with 1px #1c2230 lines and 12px radius; violet #6a0dad fills
(buttons, sleep blocks, the PSOD), #b794ff as violet text; cyan #00d4ff for
live/interactive (hover, focus, active state dots, releases). Hanken Grotesk
400–700; JetBrains Mono 12–15px for metadata only.

STORY: A visitor reads name, role and stack, sees a real activity log and four
real figures, then follows projects, writing, or the CV.

FIRST VIEWPORT: Mono wordmark "~/scotscottmca" with a blinking cyan block caret;
mono nav with animated icons. Left 7/12: name at up to 76px, mono violet role
line, muted lede, violet "Read the CV" button plus icon socials, then a 4-figure
readout. Right 5/12: navy "activity.log" panel, 7 dated entries from the content
collections (one release per app).

FORM: User-briefed minimalist tech, code-led, no concept roll (palette and
style pinned by the user). Signature: the activity log; status page raw JSON
response with poll countdown; ID-10-T purple screen of death.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved

Contact-form mail provider undecided. Bio paragraph, education and photograph
remain user-supplied placeholders.
