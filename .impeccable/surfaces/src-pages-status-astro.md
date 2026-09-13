---
version: 1
slug: "src-pages-status-astro"
primary_target: "src/pages/status.astro"
related_targets: ["src/components/LiveStateTile.astro"]
---

## Scope

`/status` (`src/pages/status.astro`): the site's live demonstration, reached from
the home tile's "Full status" and from shared links. Visitor mode:
**Experience** — the reading leads and the interface recedes.

## Audience and job

Enthusiasts who want to know whether Scott is awake right now and stay for the
pixel Scott and the joke line; recruiters checking that the pipeline is real.
Success: the state is legible in one second; source, sync time and confidence
are findable in five; nothing is solicited.

## Proof on hand

The `/api/status` payload: `status`, `confidence`, `updated`, `asleepForMin` /
`awakeForMin`, `lastSleep {start, end, durationMin}`, `walk` / `workout {name,
durationMin, endedMinAgo, steps}`, `steps {recent, windowMin}`, `heartRate
{bpm, atMinAgo}`, and `source` flags (`mock`, `fallback`, `cache-stale`) with a
`note`. Five pixel-art sprites in the emote palette, one per state.

## Constraints

Mission Control is inherited unchanged. The rotating headlines and taglines stay
verbatim; the fetch behaviour (60 s poll, retry on failure, refresh on tab
focus) stays. The big word is the plain state, as on the home tile; the joke
pair is the line beneath it. Failure is a named state at a quieter size. No lamp
is lit by markup. The page stops being DESIGN.md's named exception.

## Direction contract

THESIS: The reading is placed in time. The page refuses the category default
(a mood illustration with a caption) and its opposite (a spec sheet). It draws
the last 24 hours as one track with "now" at the right edge, and the state word
stands where today has got to.

OWN-WORLD: Mission Control, unchanged: console ground, panel tiers, 1px
hairlines, Chakra Petch labels over Space Mono, colour by meaning. The track is
a ground inset with hairline hour ticks; the last sleep is a cyan block, the
current activity an amber block, the cursor a 2px green line with the LED's
pulse. Pixel Scott at 40×40, crisp-edged, on ground.

STORY: See the word, then where it sits in the day, then Scott doing the thing,
then the joke. A recruiter reads source, sync time and confidence off the strip
and the fine print. No signal: the word drops to the reduced size, the cursor
goes grey, the track dims, the sprite is absent.

FIRST VIEWPORT: The status strip (LED, "Right now", confidence · synced) across
the top. Beneath it the reading: a sprite inset on the left, and on the right,
anchored to the cursor's edge, the lead "Right now, Scott is", the state word in
display type, and the joke line. Then the track, full width, with the axis
(−24 h … now) under it. Then the facts row (awake for, last sleep, and the
state's own figures) as hairline-divided cells. Fine print last. No primary
action; the page is the reading.

FORM: The Day Track — index 3 of seven grounded structures, dealt lead by seed
key 0917d585 (degraded roll, no challengers). Superseded form: the framed sky
illustration.

FINISH: unreviewed and undocumented is unfinished; this build ends with the
finish review, the verdict, DESIGN.md, and every shipping raster carrying its
provenance

## Unresolved

The API returns only the latest sleep session, so the track shows at most one
sleep block and one activity block; earlier events in the window are not drawn
rather than guessed.
