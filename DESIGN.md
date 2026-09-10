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
set in display type at up to 3.4rem, coloured by what it says. Everything else
sits between 0.7rem and 1.1rem. Nothing here is decorative-first: the topic
counts, the figure row, the LED period and the graticule tick on a post card all
encode data.

**Key Characteristics:**
- Single committed dark theme; no light variant anywhere in the system.
- Structure from space and hairlines, not from a grid of boxes.
- Monospace body against a squared technical display face.
- Colour is semantic before it is aesthetic; accents are never mood lighting.
- Motion is rare and, where it exists on the home page, carries a value.
- Numbers are tabular everywhere they appear.

## Colors

A cool blue-grey console ground carrying four saturated signal accents, each with
a fixed meaning.

### Primary
- **Instrument Amber** (`amber`): figures and emphasis. The headline figure
  values, the role line under the name, the blockquote tick, the "complete"
  status pill, and the brand on hover. It marks quantity and the one thing on a
  block worth reading first.
- **Console Cyan** (`cyan`): live, interactive, hover, focus. Every unclassed
  link, every hover border, the focus ring, the caret, the toast border, the
  "maintained" pill, and the drill-down label when its block is hovered. Cyan
  means *this responds*.

### Secondary
- **Signal Green** (`green`): confirmed and online. The default lit LED, the
  telemetry row dot, the post card's resting graticule tick, the "active" pill.
  Green is asserted only where something has actually been confirmed.
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

## Typography

**Display Font:** Chakra Petch (falling back to the system UI sans)
**Body Font:** Space Mono (falling back to the system monospace)

**Character:** A squared, slightly technical display face against a true
monospace body. The monospace body is doing semantic work, not styling: this is a
site about builds, telemetry and logs, and the fixed advance makes every figure,
date and version string line up without extra effort.

### Hierarchy
- **Display** (700, `clamp(2.4rem, 5vw, 3.4rem)`, line-height 1, -0.015em): the
  live state word. Exactly one per page, and only for a live reading. When the
  reading fails it drops to `clamp(1.6rem, 2.8vw, 2rem)` — the failure state is
  deliberately quieter than the working one.
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
- **Micro** (0.7rem, 0.03em): pills and tags. The smallest type in the system;
  status pills bottom out at 0.66rem, which is the floor, not a step.

### Named Rules
**The One Shout Rule.** A page gets one element above 1.9rem, and it must be a
live or identifying reading. If a screen wants a second, the screen is wrong.

**The Display-For-Chrome Rule.** Chakra Petch is for labels, titles, figures and
state words. Running prose is always Space Mono. An uppercase Chakra Petch label
is the system's only way of naming a block — it never gets a decorative kicker or
eyebrow above it.

**The Tabular Rule.** Anything countable is tabular: `time`, tile meta, CV dates,
figure values and topic counts all carry `font-variant-numeric: tabular-nums`.

**Ramp note (drift, recorded not canonised).** The small end of the build's ramp
has crowded to fourteen distinct values between 0.66rem and 0.95rem. The steps
above are the reused ones and are the system. The one-off sizes — 1.6rem (the
home name), 1.15rem and 1.05rem (CV role and project headings), 0.95rem, 0.8rem,
0.68rem, 0.66rem, and the inline 3.2rem on the 404 page — are each used once and
are drift, not steps. New surfaces should snap to the ramp above rather than
inherit them.

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
  its surround. It is removed entirely on `[data-tone='down']`.
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
- **sprite:** a full-width `1 / 1` inset on `ground` with its own hairline. It
  collapses to `display: none` when empty, so the block closes up rather than
  framing an absent reading.
- **drill:** a dim uppercase affordance that turns cyan when the block is hovered
  (alongside the block's border).

Its LED carries the state in its pulse period via `--led-period`: 4.8s asleep,
2.4s awake, 1.6s active, 1.4s walking, 0.9s working out. The animation is
`steps(2)`, so it blinks rather than breathes.

**The Failure Is A State Rule.** When the fetch fails, the block renders
`data-tone="down"`: the word becomes "No signal" at the reduced display size, the
LED goes grey and unlit with its animation and glow removed, the confidence
reading empties, and the sprite is removed. It never guesses a state and it never
shows a spinner in place of an answer.

### The CV (named exception)
The CV deliberately drops the console voice while keeping its materials. No
panels: hairline rules only, one accent (amber on the role line), a narrower
46rem measure, and an 11rem/1fr skill grid that stacks below 620px. It also ships
the system's only print stylesheet — white paper, `print-ink` body, section rules
in `print-rule`, outlined tags, chrome hidden, and a contact line generated in
`::after` so the printed page answers "is there a PDF?" by being one.

### The status page (named exception)
`/status` carries its own self-contained scoped styles — sky gradients, stars,
celestial bodies, glass cards, gradient text — and deliberately does **not** use
the global token set. This is a sanctioned exception, not drift: it is an ambient
data illustration, and it is the only place in the project allowed to define its
own palette. Nothing from it may migrate into the global stylesheet, and no new
surface may claim the same exemption without an equivalent reason.

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
- **Do** snap to the recorded ramp (0.7 / 0.74 / 0.75 / 0.88 / 0.9 / 1rem /
  1.1rem / 1.9rem / the display clamp) instead of inventing a new size.
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
