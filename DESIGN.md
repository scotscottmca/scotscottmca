---
name: ScotScottMcA
description: A developer's site that reads like well-made tooling. Obsidian ground, one violet glow, cyan for anything live.
colors:
  ink: "#050506"
  abyss: "#020024"
  navy: "#0a1a2f"
  surface: "#0b111c"
  line: "#1c2230"
  line-hi: "#2a3246"
  text: "#e8eaf2"
  muted: "#8d93a8"
  faint: "#5a6076"
  violet: "#6a0dad"
  indigo: "#3a0ca3"
  violet-text: "#b794ff"
  cyan: "#00d4ff"
  on-violet: "#ffffff"
  status-error: "#ff6b8a"
  psod-text: "#e6d6ff"
typography:
  display:
    fontFamily: "Hanken Grotesk, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "clamp(44px, 7vw, 76px)"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Hanken Grotesk, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "clamp(40px, 6vw, 60px)"
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  article-title:
    fontFamily: "Hanken Grotesk, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "clamp(34px, 5vw, 48px)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.03em"
  section:
    fontFamily: "Hanken Grotesk, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "24px"
    fontWeight: 650
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Hanken Grotesk, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "19px"
    fontWeight: 650
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  lede:
    fontFamily: "Hanken Grotesk, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "Hanken Grotesk, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "13px"
    fontWeight: 400
  label-sm:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "12px"
    fontWeight: 400
  code:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.7
rounded:
  sm: "8px"
  md: "12px"
spacing:
  gutter: "32px"
  gutter-mobile: "20px"
  measure: "1120px"
  row-y: "20px"
  section: "112px"
components:
  button-primary:
    backgroundColor: "{colors.violet}"
    textColor: "{colors.on-violet}"
    rounded: "{rounded.sm}"
    padding: "0 20px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.indigo}"
    textColor: "{colors.on-violet}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    rounded: "{rounded.sm}"
    padding: "0 20px"
    height: "44px"
  panel:
    backgroundColor: "color-mix(in srgb, #0a1a2f 55%, #050506)"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
  nav-link:
    textColor: "{colors.muted}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "8px 12px"
  nav-link-active:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.text}"
  row:
    rounded: "{rounded.sm}"
    padding: "20px 12px"
  tag:
    textColor: "{colors.muted}"
    typography: "{typography.label-sm}"
---

# Design System: ScotScottMcA

## Overview

**Creative North Star: "Obsidian Glow"**

A developer's site that reads like well-made tooling: quiet grotesk type, real data rendered the way a terminal would render it, and one violet glow behind it all. The ground is near-black obsidian; content sits on it directly or inside navy code-editor panels hairlined in 1px lines. Violet is the brand and appears only as fill; cyan is reserved for anything live or interactive. Density is calm and list-led: rows, logs, readouts, not cards.

The system is dark-only. It replaced a loud brand deck (bone and red, Geist and Fraunces) which was rejected; nothing from that deck carries over. It equally refuses the neon-cyberpunk costume: one ambient gradient, no scanlines, no glitch, no glow on type.

Two surfaces are deliberately louder and are scoped exceptions, not precedents: `/status` is "nerdy" and `/id-10-t` is "fun" (see Components).

**Key Characteristics:**
- Obsidian ground (#050506) under one fixed indigo-and-cyan body glow.
- Navy panels at 55% over ink, 1px line borders, 12px corners.
- Violet fills, lifted violet (#b794ff) for violet text, cyan for live and hover.
- Hanken Grotesk to read; JetBrains Mono only for metadata, data and code.
- Lucide icons, animated in CSS on hover or focus of their host.
- Pixel-art emotes rendered pixelated, never smoothed.

## Colors

A cold, near-black palette with exactly two chromatic voices: a royal violet for the brand and a neon cyan for anything that is live or can be acted on.

### Primary
- **Royal Smoke Violet** (violet): brand fill only. The primary button, selection highlight, cookie-consent toggles, sleep blocks on /status, the PSOD on /id-10-t. Too dark to read as text on ink.
- **Obsidian Indigo** (indigo): the violet's deeper partner. Primary button hover, the body glow bloom, blockquote tint, the log panel's under-glow.
- **Lifted Violet** (violet-text): violet's text form. The `~` in the wordmark, the role line, `#` tag prefixes, list markers, "maintained" state dots, link underlines at 55%.

### Secondary
- **Neon Dusk Cyan** (cyan): live and interactive. Hover colour for links, rows and nav targets; the focus ring; the wordmark's blinking caret; "active" state dots; release entries in the activity log; the awake tone on /status.

### Neutral
- **Obsidian Ink** (ink): the page ground.
- **Abyss** (abyss): mixed 60% into the top of the body gradient and the consent overlay; never a flat surface.
- **Deep Navy** (navy): panel base (mixed 55% over ink), active nav pill, inline code, toast.
- **Editor Surface** (surface): the cookie-consent sheet.
- **Hairline** (line) and **Hairline High** (line-hi): 1px borders and dividers; line-hi for ghost-button and active-nav strokes and the scrollbar thumb.
- **Paper Text** (text), **Muted** (muted), **Faint** (faint): body, secondary copy and mono metadata, and the quietest timestamps and resting icons.

### Named Rules
**The Fill-Only Violet Rule.** #6a0dad is never text. Violet text is always violet-text (#b794ff).

**The Cyan Means Live Rule.** Cyan marks what is live or interactive right now: hover, focus, active state, releases, the caret. It is never decoration and never a resting fill.

**The One Glow Rule.** The fixed `body::before` layer (a radial indigo bloom top-right, a faint 7% cyan trace at the right edge, an abyss wash down to ink) is the only ambient gradient on the site. Components do not carry their own background gradients; the /id-10-t PSOD is the one scoped exception.

**The One Error Colour Rule.** Error red (status-error, #ff6b8a) exists only on /status, for a failed poll. It is not a system alert colour.

**The Paper Inks Rule.** Print inks #111 (text), #444 (secondary) and #bbb (rules) exist only inside `@media print`, where the CV prints as its own PDF. They never appear on screen.

## Typography

**Display Font:** Hanken Grotesk 400 to 700 (with -apple-system, Segoe UI, sans-serif)
**Label/Mono Font:** JetBrains Mono 400, 500, 700 (with ui-monospace, SFMono-Regular, Menlo, Consolas)

**Character:** A tight, confident grotesk with negative tracking at display sizes, set against a small mono that carries every fact a developer would expect in mono.

### Hierarchy
- **Display** (700, clamp(44px, 7vw, 76px), 0.98, -0.04em): the name on the home page only.
- **Headline** (700, clamp(40px, 6vw, 60px), 1.02, -0.035em): page titles.
- **Article title** (700, clamp(34px, 5vw, 48px), 1.08): post and project heads.
- **Section** (650, 24px, -0.02em): section heads, paired with a mono aside on the same baseline. Readout figures use 28px 650.
- **Title** (650, 19px, 1.3): row titles. Prose h2 is 28px 700, h3 21px 650.
- **Lede** (400, 20px, 1.55, muted, max 60ch; 19px in article heads).
- **Body** (400, 17px, 1.65; prose 1.75 at max 70ch). Row sub-copy 15px.
- **Label** (mono 13px): nav, dates, meta, footer, arrow links. **Label-sm** (mono 12px): tags, panel bars, figure captions, table heads, state words. Mono runs 12 to 15px.
- **Code** (mono 14px, 1.7): code blocks. Inline code 0.84em.

### Named Rules
**The Mono Is Data Rule.** JetBrains Mono is for metadata, data, paths and code: dates, counts, versions, tags, nav, the wordmark. Never for headings or reading copy (except on /status).

**The Sentence Case Rule.** No uppercase tracked labels and no eyebrow text above headings. A heading stands on its own; context goes in a mono aside beside it.

## Layout

A single 1120px measure with a 32px gutter (20px under 720px). Pages start 56px below the header; sections are separated by 112px, the footer by 128px. The home hero splits 7/12 and 5/12 (56px gap); /status uses the same 7/5 split. Lists are full-width rows with 1px dividers, bleeding their hover fill 12px past the text edge. Reading columns cap at 70ch. Numbers use tabular figures. The nav collapses to icon-and-word pills spread full width under 640px and drops icons under 380px.

## Elevation & Depth

Flat and tonal. Depth comes from the navy-over-ink panel tone and 1px hairlines, not from shadow. The few shadows are coloured, soft and state- or signature-bound.

### Shadow Vocabulary
- **Violet lift** (`inset 0 1px 0 rgb(255 255 255 / .18), 0 8px 24px -8px violet 70%`): primary button at rest; on hover the lift turns cyan with a 1px cyan ring.
- **Indigo under-glow** (`0 32px 64px -32px indigo 70%`): the home activity log panel only.
- **Ink drop** (`0 12px 32px -8px rgb(0 0 0 / .6)` and `0 24px 48px -12px rgb(0 0 0 / .7)`): floating toast and consent dialogs.
- **State halo** (`0 0 0 3px <tone> 18-20%`): the ring around a live state dot.

### Named Rules
**The Hairline Not Shadow Rule.** A resting panel, row or image is separated by a 1px line, never a drop shadow.

## Shapes

Two radii: 12px for panels, code blocks, images and blockquotes; 8px for buttons, nav pills, rows and the toast. Status and state dots are circles (7px). Inline code uses 5px. Nothing is pill-shaped except the scrollbar thumb.

## Components

### Buttons
- **Shape:** gently rounded (8px), 44px tall, 20px side padding, Hanken 600 15px, 10px icon gap.
- **Primary:** violet fill, white text, violet lift shadow. Used once per view for the main action ("Read the CV").
- **Hover / Focus:** fill deepens to indigo and a 1px cyan ring appears; focus is the global 2px cyan outline at 3px offset.
- **Ghost:** transparent with a line-hi inset stroke; hover fills navy 60% and turns the stroke cyan.
- **Arrow link:** mono 13px muted with an arrow icon; turns cyan on hover.

### Chips (tags and state)
- **Tags:** mono 12px muted, each prefixed with a lifted-violet `#`, no box.
- **State:** mono 12px word led by a 7px dot. Active is cyan with a halo, maintained is lifted violet, others faint. Colour marks it; the word says it.

### Cards / Containers
- **Panel:** navy 55% over ink, 1px line border, 12px corners, a mono 12px bar on top (12px 16px padding) naming the contents like a file.
- **Rows** replace cards for lists: title, sub-line, tags, and a trailing meta-plus-arrow column; hover fills navy 55% and turns the title cyan.

### Navigation
- **Wordmark:** mono 15px 700 `~/scotscottmca`, lifted-violet tilde, an 8x17px cyan block caret blinking at 1.06s steps (still under reduced motion).
- **Links:** mono 13px muted pills with 16px animated icons; hover goes text-coloured on navy 70%; current page is solid navy with a line-hi inset stroke.
- **Footer:** mono 13px muted, a 48px pixelated mascot, links turn cyan on hover.

### Animated icons
Lucide Animated paths, inline SVG, 2px round stroke in currentColor. Motion lives in CSS and plays only while the host link or button is hovered or focused, and only when reduced motion is not requested. No glyph or emoji icons.

### Activity log (signature)
The home page's navy "activity.log" panel: mono 13px lines set like `git log --oneline`, faint date, a kind word (release cyan, project lifted violet, post muted), ellipsised title that turns cyan on hover. Entries are real, dated items from the content collections.

### Prose
Code blocks are the navy panel at mono 14px with Shiki's dark palette. Blockquotes are indigo 12% over ink with a violet-mixed border. Images carry a 1px line and 12px corners. Heading permalinks show a faint chain in the left gutter on hover.

### Scoped exception: /status ("nerdy")
Everything in the reading is mono, including a 36-56px mono state headline coloured by tone (awake cyan, rest lifted violet, down faint). It shows the raw JSON response in a panel, a live poll countdown, a 24-hour track with violet sleep blocks, and the pixel sprite on a gridded inset. Error text is #ff6b8a. These treatments stay on /status.

### Scoped exception: /id-10-t ("fun")
The reveal is a "purple screen of death": a violet-to-indigo 160deg gradient sheet with 20px corners, psod-text (#e6d6ff) and white type, a counting progress figure, a light-weight 80-140px face and a headline up to 96px. This gradient, radius and size are licensed for this page only.

### Legacy: /usage
The unlisted /usage page keeps legacy off-scale sizes and uppercase table labels. It is exempt and is not a reference for new surfaces.

## Do's and Don'ts

### Do:
- **Do** keep violet as fill (buttons, blocks, selection) and use #b794ff whenever violet must be read as text.
- **Do** reserve cyan for live and interactive states: hover, focus, active dots, releases.
- **Do** put dates, counts, versions, tags and paths in JetBrains Mono at 12-15px, and code blocks at 14px.
- **Do** set lists as hairline-divided rows and data in navy panels with a mono file-name bar.
- **Do** render pixel-art emotes and sprites with `image-rendering: pixelated`.
- **Do** confine print inks (#111, #444, #bbb) to `@media print`.

### Don't:
- **Don't** add a second ambient gradient or any component background gradient; the fixed body glow is the only one (the /id-10-t PSOD excepted).
- **Don't** set text in #6a0dad or use cyan as decoration.
- **Don't** use mono for headings or reading copy outside /status.
- **Don't** put uppercase eyebrow or kicker labels above headings.
- **Don't** reintroduce anything from the rejected brand deck: Geist, Fraunces, bone grounds or red accents.
- **Don't** use #ff6b8a anywhere but /status, or copy /status's all-mono or /id-10-t's gradient and 96px scale onto other pages.
- **Don't** smooth pixel art or drop resting shadows under panels and rows.
