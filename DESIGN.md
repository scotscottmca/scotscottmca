---
name: ScotScottMcA — Mission Control
description: A dark instrument console where the loud element is a live reading, not a headline.
colors:
  ground: "#12151a"
  panel: "#1b2027"
  panel-raised: "#20262e"
  line: "#2c333d"
  text: "#dfe6ee"
  dim: "#8b95a2"
  amber: "#ffb400"
  green: "#3ddc73"
  cyan: "#49e0ff"
  red: "#ff5c5c"
  ink-on-amber: "#1a1200"
  ink-on-cyan: "#00232a"
  ink-on-green: "#06210f"
  selection: "rgba(73, 224, 255, 0.25)"
  print-ink: "#14181d"
  print-ink-muted: "#43505e"
  print-rule: "#9aa6b2"
  print-rule-faint: "#c3ccd5"
  print-paper: "#ffffff"
typography:
  display:
    fontFamily: "Chakra Petch, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "clamp(2.4rem, 5vw, 3.4rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.015em"
  display-large:
    fontFamily: "Chakra Petch, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "clamp(3rem, 8vw, 5.4rem)"
    fontWeight: 700
    lineHeight: 0.95
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Chakra Petch, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "1.9rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  figure:
    fontFamily: "Chakra Petch, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "1.9rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "normal"
    fontFeature: "tabular-nums"
  title:
    fontFamily: "Chakra Petch, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "1.1rem"
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Space Mono, ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, monospace"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "normal"
  body-small:
    fontFamily: "Space Mono, ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, monospace"
    fontSize: "0.9rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  body-fine:
    fontFamily: "Space Mono, ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, monospace"
    fontSize: "0.88rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  section-label:
    fontFamily: "Chakra Petch, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.14em"
  label:
    fontFamily: "Chakra Petch, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "0.74rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.06em"
  unit:
    fontFamily: "Chakra Petch, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 400
    letterSpacing: "0.06em"
  micro:
    fontFamily: "Chakra Petch, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "0.7rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.03em"
rounded:
  sm: "4px"
  md: "6px"
  pill: "999px"
spacing:
  block-gap: "1.6rem"
  panel-padding: "1.25rem 1.35rem"
  row-padding: "0.8rem 1.1rem"
  card-padding: "1.1rem 1.25rem"
  section-gap: "3rem"
components:
  panel-block:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "{spacing.panel-padding}"
  live-block:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.green}"
    typography: "{typography.display}"
    rounded: "{rounded.md}"
    padding: "{spacing.panel-padding}"
  live-block-hover:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.cyan}"
  nav-link:
    backgroundColor: "{colors.panel-raised}"
    textColor: "{colors.dim}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0.4rem 0.75rem"
  nav-link-hover:
    textColor: "{colors.text}"
  button-bordered:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.dim}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0.5rem 0.85rem"
  button-bordered-hover:
    textColor: "{colors.text}"
  post-card:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "{spacing.card-padding}"
  post-card-hover:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.cyan}"
  tag:
    backgroundColor: "{colors.panel-raised}"
    textColor: "{colors.dim}"
    typography: "{typography.micro}"
    rounded: "{rounded.pill}"
    padding: "0.15rem 0.55rem"
  status-active:
    backgroundColor: "{colors.green}"
    textColor: "{colors.ink-on-green}"
    typography: "{typography.micro}"
    rounded: "{rounded.pill}"
    padding: "0.15rem 0.5rem"
  status-maintained:
    backgroundColor: "{colors.cyan}"
    textColor: "{colors.ink-on-cyan}"
    rounded: "{rounded.pill}"
    padding: "0.15rem 0.5rem"
  status-complete:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.ink-on-amber}"
    rounded: "{rounded.pill}"
    padding: "0.15rem 0.5rem"
  status-archived:
    backgroundColor: "{colors.panel-raised}"
    textColor: "{colors.dim}"
    rounded: "{rounded.pill}"
    padding: "0.15rem 0.5rem"
  social-button:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.dim}"
    rounded: "{rounded.sm}"
    size: "34px"
  social-button-hover:
    textColor: "{colors.cyan}"
  sprite-inset:
    backgroundColor: "{colors.ground}"
    rounded: "{rounded.md}"
    padding: "5%"
  track-rail:
    backgroundColor: "{colors.panel}"
    rounded: "{rounded.sm}"
    height: "clamp(48px, 7vw, 76px)"
  track-cursor:
    backgroundColor: "{colors.green}"
    width: "2px"
  facts-cell:
    textColor: "{colors.text}"
    typography: "{typography.figure}"
    padding: "0 1.2rem"
---

# Design System: ScotScottMcA — Mission Control

## Overview

**Creative North Star: "The Quiet Console"**

One committed dark console. No light mode, no toggle: `color-scheme: dark` is
declared and the theme is the theme. The surface reads like instrumentation that
has been left running — panels on a near-black ground, hairline rules, small
uppercase labels, one lamp that pulses at a rate carrying real data. The
personality is competent and unshowy: it does not perform excitement, it reports.

Density is deliberately uneven. The home page is a two-column ledger
(`5fr 1fr 6fr`, the middle column pure gap) whose blocks are separated by empty
bands rather than by a lattice of borders, and whose left column is allowed to
end early and leave the page ragged. This replaced an earlier twelve-cell
bordered tile grid that read as noise in live use; the current world's rule is
that structure comes from space first and from a border only when a block is
genuinely a container.

The one loud element on any screen is a live reading — the current state word,
set in display type at up to 3.4rem on the home tile and up to 5.4rem on
`/status`, the one page whose whole job is that reading — coloured by what it
says. Everything else sits between 0.7rem and 1.1rem, with figures at exactly
1.9rem. Nothing here is decorative-first: the topic counts, the figure row, the
LED period, the day track's cursor and the graticule tick on a post card all
encode data.

**Key Characteristics:**
- Single committed dark theme; no light variant anywhere in the system.
- Structure from space and hairlines, not from a grid of boxes.
- Monospace body against a squared technical display face.
- Colour is semantic before it is aesthetic; accents are never mood lighting.
- Motion is rare and, where it exists, carries a value: the LED period, the
  track cursor, a sprite's per-state frame.
- Numbers are tabular everywhere they appear.

## Colors

A cool blue-grey console ground carrying four saturated signal accents, each with
a fixed meaning.

### Primary
- **Instrument Amber** (`amber`): figures and emphasis. The headline figure
  values, the role line under the name, the blockquote tick, the "complete"
  status pill, the brand on hover, and on the day track the activity block and
  the state word when Scott is moving. It marks quantity and the one thing on a
  block worth reading first.
- **Console Cyan** (`cyan`): live, interactive, hover, focus. Every unclassed
  link, every hover border, the focus ring, the caret, the toast border, the
  "maintained" pill, the drill-down label when its block is hovered, and on the
  day track the sleep block and the state word at rest. Cyan means *this
  responds* — and, on the track, *this is the live pipeline's rest reading*.

### Secondary
- **Signal Green** (`green`): confirmed and online. The default lit LED, the
  telemetry row dot, the post card's resting graticule tick, the "active" pill,
  and the day track's "now" cursor while Scott is awake. Green is asserted only
  where something has actually been confirmed.
- **Fault Red** (`red`): declared in the token set as the fault colour. It is
  currently unused on any screen surface; it is held for genuine error states,
  not spent on emphasis.

### Neutral
- **Console Ground** (`ground`): the page field, the scrollbar track, and the
  inset behind the live sprite.
- **Panel** (`panel`): every block that is a container — ledger blocks, cards,
  the status strip, the sticky header (at 92% over transparent with a saturating
  blur), table headers, blockquotes.
- **Panel Raised** (`panel-raised`): the second tier, used for things sitting
  *on* a panel — nav chips, tags, inline code, the topic count, archived pills,
  the toast.
- **Hairline** (`line`): every border and divider in the system, at 1px. There is
  no second border colour.
- **Readout Text** (`text`) / **Dim Label** (`dim`): primary copy and secondary
  copy. Dim measures 5.4:1 on panel, which is why it is allowed to carry real
  content (summaries, telemetry labels, CV bullets) and not just chrome.

### Ink-on-accent
- **`ink-on-amber` / `ink-on-cyan` / `ink-on-green`**: the near-black tints used
  for text sitting on a filled accent pill. Never use `ground` for this; each
  accent has its own matched ink so the pill stays legible at 0.66rem.

### Print
- **`print-ink`, `print-ink-muted`, `print-rule`, `print-rule-faint`,
  `print-paper`**: these five belong to the `@media print` CV stylesheet only.
  They are not screen colours and must never appear on a screen surface. Any
  audit that finds them outside the print block has found a real leak.

### Named Rules
**The Meaning-First Rule.** Amber = figures and emphasis. Green = confirmed and
online. Cyan = live, interactive, hover, focus. Red = fault. A colour is never
chosen because a block "needs some colour"; if none of the four meanings applies,
the element is `text` or `dim`.

**The Honest Lamp Rule.** A green LED must be backed by a real reading. The
header lamp ships `data-tone="down"` (unlit, grey, no animation) and is only lit
by the live status fetch resolving successfully; a failed read pushes it back
down. No lamp on any future surface may be lit by markup alone.

**The One Border Colour Rule.** Every rule, divider, and card edge is 1px of
`line`. Depth changes come from the panel tier, never from a heavier or lighter
stroke.

**The Tint Rule.** A signal colour never fills an area at full strength. Where
it has to cover a region — the sleep and activity blocks on the day track, the
key swatches beside it — it is a 22% mix over transparent
(`color-mix(in srgb, <accent> 22%, transparent)`) bounded by a 1px solid edge
of the same accent, with the accent itself reserved for the label inside. A
full-strength accent is for a line, a lamp, a word or a pill, never a field.

## Typography

**Display Font:** Chakra Petch (falling back to the system UI sans)
**Body Font:** Space Mono (falling back to the system monospace)

**Character:** A squared, slightly technical display face against a true
monospace body. The monospace body is doing semantic work, not styling: this is a
site about builds, telemetry and logs, and the fixed advance makes every figure,
date and version string line up without extra effort.

### Hierarchy
- **Display** (700, `clamp(2.4rem, 5vw, 3.4rem)`, line-height 1, -0.015em): the
  live state word on the home tile. Exactly one per page, and only for a live
  reading. When the reading fails it drops to `clamp(1.6rem, 2.8vw, 2rem)` — the
  failure state is deliberately quieter than the working one.
- **Display Large** (700, `clamp(3rem, 8vw, 5.4rem)`, line-height 0.95,
  -0.02em; `clamp(2.2rem, 11vw, 3rem)` at 640px and below): the same state word
  on `/status`, where the reading is the whole page. This is the only surface
  that takes the larger step; it shares Display's failure size
  (`clamp(1.6rem, 2.8vw, 2rem)`) so "No signal" is quieter there too. Its
  colour settles over 300ms rather than the 160ms hover transition, because it
  is answering a reading, not a pointer.
- **Headline** (700, 1.9rem, line-height 1.25, -0.01em): page-level titles — the
  article `h1`, and the CV name at `clamp(1.9rem, 4vw, 2.5rem)`.
- **Figure** (700, 1.9rem, line-height 1, tabular): the headline figure values on
  the home ledger, sat over a 0.72rem uppercase unit. Value over unit, so a pair
  of figures fits side by side in the five-column measure.
- **Title** (1.1rem, -0.01em): the repeating item title — post card heading, work
  ledger row name, project square heading.
- **Body** (16px, line-height 1.7): running prose.
- **Body Small** (0.9rem, line-height 1.6): supporting sentences — the live
  detail line (capped at 30ch), CV summaries, section intros.
- **Body Fine** (0.88rem, line-height 1.6): dense list copy — telemetry values,
  project square summaries, CV skill values.
- **Section Label** (700, 0.75rem, 0.14em, uppercase, dim, with a 1px underrule):
  the block heading on the work ledger and every CV section heading.
- **Label** (0.74rem, 0.06em, uppercase, dim): the workhorse — definition-list
  terms, tile labels, drill-down affordances, telemetry terms.
- **Unit** (0.72rem, 0.06em, uppercase, dim): the label that sits directly
  against a figure or a scale — the unit under a home figure, the facts-row
  term over its 1.9rem value, the day track's head and key, and (in Space
  Mono, tabular) its clock axis. One step under Label so it reads as belonging
  to the number rather than naming the block.
- **Micro** (0.7rem, 0.03em): pills and tags. The smallest type in the system;
  status pills bottom out at 0.66rem, which is the floor, not a step.

### Named Rules
**The One Shout Rule.** A page gets one element above 1.9rem, and it must be a
live or identifying reading. If a screen wants a second, the screen is wrong.
`/status` takes the Display Large step for its one shout; its facts figures sit
at exactly 1.9rem, the ceiling, not above it.

**The Display-For-Chrome Rule.** Chakra Petch is for labels, titles, figures and
state words. Running prose is always Space Mono. An uppercase Chakra Petch label
is the system's only way of naming a block — it never gets a decorative kicker or
eyebrow above it.

**The Tabular Rule.** Anything countable is tabular: `time`, tile meta, CV dates,
figure values and topic counts all carry `font-variant-numeric: tabular-nums`.

**Ramp note (drift, recorded not canonised).** The small end of the build's ramp
has crowded to fourteen distinct values between 0.66rem and 0.95rem. The steps
above are the reused ones and are the system. The one-off sizes — 1.6rem (the
home name), 1.15rem and 1.05rem (CV role and project headings), 0.95rem, 0.82rem
(the status strip title), 0.8rem, 0.68rem, 0.66rem, and the inline 3.2rem on the
404 page — are each used once and are drift, not steps. New surfaces should snap
to the ramp above rather than inherit them.

## Layout

An 860px measure (`--max-width`) with 1.25rem gutters, centred, on a flex column
body so the footer sits at the bottom of short pages.

**The ledger.** The home page is a three-column grid, `5fr 1fr 6fr`, where the
middle column is pure gap and carries nothing. The two content columns are flex
columns with a 1.6rem gap between blocks. Blocks are bordered panels separated by
space; the columns are not equalised and the left one may end early. Below 900px
the ledger collapses to a single column with a 3.5rem gap — the space between
blocks grows when the columns stack, so the two former columns still read as two
groups.

**Telemetry** runs full width beneath both columns as a `22px 150px 1fr` grid of
dot / label / value rows divided by hairlines, with no border on the first row.
Below 640px the value drops beneath the label and the dot spans both rows.

**Project grid** is three squares, dropping to two at 820px and one at 520px;
each cell is a true `1/1` square with clamped title (2 lines) and summary
(5 lines) so an uneven set of projects still tiles evenly.

**The status page** widens the measure to 1180px (`.container-wide`) and stacks
its one instrument as a single grid column with a 1.8rem gap (1.5rem below
640px): status strip, then a `minmax(150px, 200px) / 1fr` reading head with the
sprite inset left and the right-aligned word block bottom-aligned to it, then
the full-width day track, then the facts row, then the fine print. Nothing is
boxed except the strip, the sprite inset and the track rail. Below 640px the
sprite column narrows to `minmax(96px, 128px)`, the rail drops to 44px, every
second axis stamp hides, and the facts go to one column so a 1.9rem value never
wraps.

**Rhythm.** Block gap 1.6rem, section gap 3rem below the ledger, panel padding
1.25rem/1.35rem, row padding 0.8rem/1.1rem, card padding 1.1rem/1.25rem. Small
spacings run on a loose 0.1rem grid rather than a strict scale.

### Named Rules
**The Gap-Not-Grid Rule.** Columns are separated by an empty grid column, not by
a divider. If two regions need distinguishing, put space between them before
reaching for a border.

**The Uneven Page Rule.** Columns are not padded to match height. A short left
column ending above a long right column is the intended result.

## Elevation & Depth

Flat by default. Depth is tonal, not cast: `ground` → `panel` → `panel-raised`,
each tier separated by a 1px `line` hairline. No card, panel or button carries a
resting shadow.

### Shadow Vocabulary
- **LED glow** (`box-shadow: 0 0 6px <accent>`): the only ambient shadow in the
  system, and it is emissive rather than a drop shadow — a lit lamp bleeding onto
  its surround. It sits on the header and tile lamps, on the day track's 2px
  "now" cursor and on the key swatch that stands for it. It is removed entirely
  on `[data-tone='down']`.
- **Toast lift** (`box-shadow: 0 6px 24px rgba(0,0,0,0.4)`): the single
  transient-overlay shadow, on the copied-link toast only.

### Named Rules
**The No-Resting-Shadow Rule.** Surfaces are flat at rest. Depth comes from the
panel tier and the hairline. The only shadows in the system are a lamp's glow and
a floating transient.

**The Border-Lights-Up Rule.** Hover state on any container is a border colour
change to cyan, not a lift, a fill, or a shadow. The one exception is the project
square, which also rises 3px.

## Shapes

Softly squared. Containers take a 6px radius (`rounded.md`); nested and
control-sized elements take 4px (`rounded.sm`); anything that is a token of
status or taxonomy — tags, topic chips, status pills, toast, scrollbar thumb —
takes a full pill (999px). There are no sharp corners and no large radii.

Borders are always 1px `line`. Icons are 24×24 SVG paths from a shared source,
rendered at 17px in the social row and 15px in the CV links, filled with
`currentColor` — never a glyph font, never an image tag.

The recurring silhouette is the **graticule tick**: a 7px hairline stub crossing
the left edge of a card or quote, in green on a post card at rest (extending to
13px and turning cyan on hover) and amber on a blockquote. It reads as a
measurement mark on an instrument face.

Pixel art is the system's only figurative imagery, and it is kept pixel-shaped:
a 40×40 cell grid drawn as one SVG `<rect>` per run with
`shape-rendering="crispEdges"`, placed at a 240×240 intrinsic size and rendered
with `image-rendering: pixelated` wherever it is scaled. A sprite never takes
the default image hairline or radius (`border: none; border-radius: 0`); the
inset it sits in carries the border instead.

## Components

### Buttons
The system has one button shape: a bordered chip, not a filled one.
- **Shape:** softly squared (4px).
- **Bordered button** (`.cv-print`, `.cv-links a`): panel fill, dim uppercase
  0.7–0.75rem display label, 1px hairline, 0.5rem/0.85rem padding.
- **Hover / Focus:** text to `text` (or `cyan` on the link variant), border to
  cyan, over 160ms. No fill change, no lift.
- **Ghost:** `.link-button` resets all styling to dim inline text and underlines
  in cyan on hover; used for the cookie-preferences trigger in the footer.

### Chips
- **Tag** (`.tag`): pill, panel-raised fill, hairline, dim 0.7rem display text.
  As a link it takes cyan text and border on hover; as a plain span it is inert.
- **Topic chip** (`.topic-index li`): a split pill — label on panel, count on
  panel-raised behind a hairline divider, tabular. The count is the reason the
  chip exists; a topic index without counts is decoration.
- **Status pill** (`.status`): 0.66rem uppercase. Archived is the neutral
  outline; active, maintained and complete are filled with green, cyan and amber
  respectively over their matched ink and no border.

### Cards / Containers
- **Corner Style:** 6px.
- **Background:** `panel`.
- **Border:** 1px `line`, going cyan on hover.
- **Shadow Strategy:** none (see Elevation).
- **Internal Padding:** 1.25rem/1.35rem for ledger blocks, 1.1rem/1.25rem for
  post cards, 1.15rem/1.2rem for project squares.
- **Post card:** title and date on a baseline-aligned row (stacking below 560px),
  tags beneath, graticule tick at the left edge.
- **Project square:** forced 1/1 aspect, status pill top-left, clamped title and
  summary, and the system's only hover transform (`translateY(-3px)`).

### Navigation
Sticky translucent header (92% panel over a saturating 10px blur) with a
hairline base and a 58px minimum bar. The brand is uppercase display at 1rem
preceded by the fleet LED; it goes amber on hover. Nav items are small uppercase
display chips on panel-raised, dim at rest, taking `text` and a cyan border on
hover. Both bar and nav wrap rather than scroll on narrow screens.

### Browser surfaces
The system explicitly themes the parts of the page it did not draw: cyan caret,
`line`-on-`ground` scrollbars (11px, pill thumb inset 3px, brightening to dim on
hover), cyan selection at 25%, a 2px cyan `:focus-visible` ring at 2px offset
with focus rings suppressed for pointer focus, and a 0.18em underline offset with
1px thickness on unclassed links.

### The live block (signature)
The home page's dominant instrument, and the component every other rule defers
to. A panel-bordered link laid out as four stacked grid areas —
`head` / `body` / `sprite` / `drill`:
- **head:** the LED, a 0.74rem uppercase label, and a right-aligned confidence
  meta reading.
- **body:** the state word in display type, coloured by tone (green for up, cyan
  for rest, amber for move), plus one sentence of detail capped at 30ch.
- **sprite:** a full-width slot holding the state's pixel sprite (240×240
  intrinsic, `object-fit: contain`, `image-rendering: pixelated`). It collapses
  to `display: none` when empty, so the block closes up rather than framing an
  absent reading.
- **drill:** a dim uppercase affordance that turns cyan when the block is hovered
  (alongside the block's border).

Its LED carries the state in its pulse period via `--led-period`: 4.8s asleep,
2.4s awake, 1.6s active, 1.4s walking, 0.9s working out. The animation is
`steps(2)`, so it blinks rather than breathes.

**The Failure Is A State Rule.** When the fetch fails, the block renders
`data-tone="down"`: the word becomes "No signal" at the reduced display size, the
LED goes grey and unlit with its animation and glow removed, the confidence
reading empties, and the sprite is removed. On `/status` the same tone also
greys the track cursor, dims the track to 45% and clears its blocks, while the
sprite inset shows "No reading" in its own uppercase unit label. It never guesses
a state and it never shows a spinner in place of an answer.

### The CV (named exception)
The CV deliberately drops the console voice while keeping its materials. No
panels: hairline rules only, one accent (amber on the role line), a narrower
46rem measure, and an 11rem/1fr skill grid that stacks below 620px. It also ships
the system's only print stylesheet — white paper, `print-ink` body, section rules
in `print-rule`, outlined tags, chrome hidden, and a contact line generated in
`::after` so the printed page answers "is there a PDF?" by being one.

### The day track (signature)
`/status` is the live block opened out to a page: the same tokens, the same
tones, the same LED, with the reading placed in time. It is no longer an
exception to the system; it is the system's fullest instrument. Its parts:

- **Status strip:** the shared `.statusstrip` (LED, uppercase title, dim
  tabular meta reading "confidence · synced hh:mm" right-aligned). It is the
  only bordered panel above the track.
- **Reading head:** the sprite inset on the left and, on the right, a dim
  0.9rem lead ("Right now, Scott is"), the state word in Display Large, and a
  0.9rem line (bold headline, then tagline) capped at 46ch. The copy is
  right-aligned so the word's edge lands over the track's "now" cursor.
- **Track rail:** a `panel`-filled inset with a `line` hairline, 4px radius,
  `clamp(48px, 7vw, 76px)` tall. Its scale is painted, not marked up: a
  hairline stub every hour at 38% height rising from the base, and a full-height
  rule every six hours in `dim` at 40%. Under it a five-stamp clock axis
  (−24 h … now) in 0.72rem dim tabular Space Mono; above it a head in Unit
  type with a three-item key (8px outlined swatches for sleep and activity, a
  2px glowing line for now).
- **Blocks:** absolutely positioned, full rail height. Sleep is cyan, activity
  amber, both under the Tint Rule (22% fill, 1px inline edges, accent text)
  with an uppercase 0.7rem tabular label ("Sleep 7 hr 12 min", "Walk 38 min",
  "104 bpm"). A block whose label will not fit hides the label rather than
  clipping it; a block narrower than 0.6% of the window is widened to that
  floor so it stays visible. When nothing lands in the window a 0.88rem dim
  line says so.
- **Cursor:** a 2px line pinned to the right edge, coloured by tone (green
  awake, cyan rest, amber move, `dim` and unlit when down), carrying the LED
  glow and blinking at the LED's own `--led-period` with `steps(2)`. It is the
  page's lamp, and it obeys the reduced-motion block like any other.

### Facts row
The state's own figures, laid under the track as hairline-divided cells: an
`auto-fit, minmax(150px, 1fr)` grid opening with a 1px `line` rule above and
1.4rem of air, each cell after the first carrying a 1px left rule and 1.2rem
side padding. In every cell a Unit term over a Figure value (700, 1.9rem,
line-height 1, tabular, in `text`) — the same value-over-unit stack as the
home ledger. The row is `hidden` when the state has no figures; it is never
padded out with placeholders. Below 640px it is one figure per row with no
dividers.

### Sprite inset
A square `ground` inset with a `line` hairline and 6px radius, 5% internal
padding, holding the state's 40×40 pixel sprite at full width and pixel
rendering. The `/status` inset is the sprite's frame; the home tile's slot is
unframed. When there is no reading the inset is empty and its `::after` reads
"No reading" in 0.72rem uppercase 0.14em `dim` — the same voice as a section
label, so absence is stated rather than left blank.

### Pixel sprites
Five status sprites (`scott-{awake,asleep,walking,working-out,active}.svg`),
generated by `scripts/status-sprites.mjs` from a 40×40 cell grid, drawn in the
palette sampled from the commissioned emote set so status Scott and emote
Scott are the same person. Props take the system's signal colours by meaning:
cyan for live and rest (laptop screen, rising Zs), amber for move (mug,
dumbbell, heart), green for confirmed (cap, ECG). Each sprite animates a few
cells with stepped keyframes — a blink, a two-frame walk, rising Zs, a heart
beat at the workout period — and stills to its resting frame under
`prefers-reduced-motion`, inside the SVG itself. The animation is the state's
own tell, not decoration; a sprite for a new state must read as that state
with its animation off.

## Do's and Don'ts

### Do:
- **Do** separate regions with space first; reach for a 1px `line` border only
  when the region is genuinely a container.
- **Do** give every screen exactly one element above 1.9rem, and make it a live
  or identifying reading.
- **Do** assign colour by meaning: amber for figures and emphasis, green for
  confirmed, cyan for live and interactive, red for fault.
- **Do** ship indicators unlit by default and let a real reading light them.
- **Do** set every countable value in tabular numerals.
- **Do** snap to the recorded ramp (0.7 / 0.72 / 0.74 / 0.75 / 0.88 / 0.9 /
  1rem / 1.1rem / 1.9rem / the two display clamps) instead of inventing a new
  size.
- **Do** fill a region with a signal colour only as a 22% tint bounded by a 1px
  edge of the same colour, keeping the full accent for lines, lamps, words and
  pills.
- **Do** keep pixel art pixel-shaped: `image-rendering: pixelated`, no border,
  no radius, framed by its inset rather than by itself.
- **Do** collapse an element that has no data rather than framing an empty slot.
- **Do** theme browser surfaces — caret, scrollbar, selection, focus ring — on
  any new surface.
- **Do** state failure as a named state in the same component, at a quieter size
  than the working state.

### Don't:
- **Don't** add a light theme, a theme toggle, or any surface that is not
  committed dark.
- **Don't** introduce a second border colour or a border weight above 1px.
- **Don't** put a resting shadow on a panel, card, or button; hover changes the
  border, not the elevation.
- **Don't** use print inks (`#14181d`, `#43505e`, `#9aa6b2`, `#c3ccd5`, `#fff`)
  on a screen surface; they exist only inside `@media print`.
- **Don't** set text on a filled accent in `ground` — use the matched
  ink-on-accent tint.
- **Don't** animate anything that is not carrying a value or answering an input.
- **Don't** put a decorative kicker or eyebrow above a heading; a block is named
  by its uppercase display label or not at all.
- **Don't** use icon fonts or glyph characters for icons; use the shared 24×24
  SVG paths with `currentColor`.
- **Don't** equalise the ledger columns to matching heights.
