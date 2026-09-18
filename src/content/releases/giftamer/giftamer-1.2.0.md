---
product: "GifTamer"
version: "1.2.0"
date: "2026-09-18"
---

### Added

- **Freeze all GIFs on this page**, a new popup button and bindable shortcut.
  Stopping an animated GIF is otherwise impossible in Edge, so this is the
  thing GifTamer is uniquely placed to offer anyone who finds movement
  distracting or uncomfortable. Press it again to resume.
- Keyboard shortcuts can now be bound for "tame all" and "freeze all" under
  `edge://extensions/shortcuts`, and Alt+Shift+G opens the popup by default.
- A tamed GIF can be driven from the keyboard once it has focus: Space plays
  and pauses, the arrow keys step a frame (ten with Shift), Home and End jump
  to the first and last frame, and plus and minus change the speed. Screen
  readers announce these shortcuts when the GIF gets focus.
- If you have asked your system for reduced motion, tamed GIFs now start
  paused on their first frame instead of playing straight away.
- GifTamer can now be used entirely from the keyboard. Tab reaches the "Tame"
  badge on any GIF, Enter or Space activates it, and focus lands on the
  play/pause button so you keep your place on the page.
- Every control now tells a screen reader what it is and what it is doing: the
  play button announces "Play" or "Pause", the frame slider reads "Frame 3 of
  40", the speed menu is labelled, and pausing, seeking and speed changes are
  announced as they happen. The tamed image keeps the original picture's
  description instead of becoming an unlabelled blob.
- A close button on the control bar restores the original GIF, so taming is no
  longer a one-way trip.
- The control bar is now visible whenever you can use it: on hover, whenever a
  control has keyboard focus, and for a few seconds after a tap on touch
  devices, where it was previously unreachable.
- Clear focus outlines on every control, support for Windows High Contrast
  mode, and a speed menu that is readable in dark themes.

### Fixed

- The control bar no longer swallows a small GIF. On stickers, reactions and
  avatars it now sits underneath the picture rather than on top of it, and the
  "Tame" button shrinks to its icon so it does not cover what you are looking
  at.
- Controls now scale with browser zoom and with a larger minimum font size
  instead of staying pinned at 11-12 px, and the bar wraps instead of
  overflowing when there is no room.
- A tamed GIF now resizes with the page again. It used to be frozen at the
  pixel size it had at the moment it was tamed, so a responsive layout would
  leave it the wrong size after a window resize.
- The control bar's text is now readable over any GIF. It sat on a gradient
  that was fully transparent at the top, so the frame counter and controls
  could be invisible over a light or busy image; the worst-case contrast is
  now 11.7:1 where it was undefined.
- The frame slider is now a full-height target rather than a 4 px strip, and
  the speed menu is tall enough to hit, meeting the 24 px minimum.
- Popup text now meets contrast requirements: the tip line was grey on white at
  3.5:1, below the 4.5:1 minimum, and is now 7.0:1. The popup also follows your
  system's light or dark theme rather than always being white.
- The popup now reads "Tamed 1 GIF" rather than "Activated 1 GIF(s)", has a
  page title and language for screen readers, and announces its result instead
  of changing silently.
- Double-clicking a GIF inside a link no longer navigates away before it can be
  tamed. Linked GIFs are tamed from their "Tame" button, which leaves the
  link's own behaviour intact for everyone else.

- A malicious GIF can no longer freeze the page or exhaust memory. Each frame
  inside a GIF carries its own size, and that size was never checked: a
  40-byte file claiming a 65535x65535 frame made GifTamer try to allocate
  4 GB and locked the tab for about a minute per frame. Frame sizes are now
  bounded like the overall image size, and frames that hang over the edge of
  the image are clipped instead of wrapping into the next row or writing past
  the end of the picture.
- Closed several ways a hostile page could have used GifTamer to reach servers
  inside your network or on your machine. The block list now understands IPv6
  addresses (including the forms that hide an IPv4 address inside one), carrier
  NAT and reserved ranges, and host names written with a trailing dot. Where a
  server answers a GIF request with a redirect, the address it redirects to is
  checked before anything is downloaded, and a request that carries your
  cookies is never allowed to follow a redirect to another site.

- Pages whose address merely contained ".gif" (a gift registry, a link with
  "?tag=.gifs") no longer grab their first image, try to tame it and pop up an
  error dialog. Only real GIFs are detected now.
- GIFs that were still downloading when the page was scanned, and GIFs filled
  in later by a lazy-loading library, are now detected instead of being
  ignored until the next reload.
- Errors no longer interrupt with a blocking dialog. A GIF that cannot be
  loaded says so on its own badge, and "tame all" on a page with several
  broken GIFs no longer produces a queue of dialogs.
- The scroll wheel over a tamed GIF only steps frames when the GIF is paused,
  or when Shift is held. A large tamed GIF no longer traps the page scroll.
- Play, seek and speed controls on a GIF inside a link no longer navigate away
  when you use them.
- Playback is much lighter: a frame is drawn only when it actually changes
  (previously every GIF was redrawn 60 times a second regardless), the loop
  stops when the GIF is removed from the page, and it pauses while the tab is
  hidden or the GIF is scrolled out of view. Returning to a long-hidden tab no
  longer causes a burst of catch-up frames.
- "Tame all GIFs" now shares one memory ceiling across the whole page instead
  of one per GIF, so a gallery cannot commit several gigabytes; it skips
  1x1 tracking GIFs, which it used to activate; and it counts GIFs inside
  iframes in its total.
- GIFs with no colour table now render with a default palette, as they do in
  the browser, instead of failing with an error dialog.
- GIFs authored with very short frame delays now play at the same speed as the
  browser renders them, rather than up to ten times faster.
- A GIF that is cut short now plays the frames it does contain, and a file
  truncated in its header reports that rather than "invalid dimensions".
- Damaged GIFs can no longer silently stop playing partway through.
- The background helper now refuses oversized downloads, gives up on a server
  that never responds, and limits how often a single page can ask it for GIFs.
- Release publishing no longer reports success when the store rejected the
  submission, and a push containing several commits no longer skips the
  release.

### Changed

- GIF decoding is several times faster. On noisy, poorly compressible GIFs a
  30-frame 320x240 animation decodes in 57 ms where it previously took 502 ms,
  and on flat, cartoon-style GIFs a 30-frame 640x480 animation went from 228 ms
  to 108 ms. Output is byte-for-byte identical. This matters most while
  scrubbing a large GIF, where seeking replays whole stretches of the file.
- Corrected the documentation: releases are triggered by a `manifest.json`
  version bump landing on `main`, not by a git tag, and there is no `master`
  branch. The store-listing notes no longer claim the extension requests
  `storage` permission, which it does not. `package.json`'s version now tracks
  `manifest.json`, and `npm run lint` fails if they drift. `SECURITY.md` now
  says how to report a vulnerability privately.
- CI now runs on every pull request, not only those targeting `main`, so work
  stacked on another branch is still tested. No user-facing change.
- Internal restructure: the content script's logic now lives in
  `giftamer-core.js` (detection, frame sources, budgets) and
  `giftamer-player.js` (canvas, controls, playback loop), leaving `content.js`
  as wiring. The core is unit tested for the first time, the GIF fixture
  encoder gained a real LZW compressor so the decoder's compression paths are
  covered, and there is now a dependency-free `npm run lint` plus an optional
  browser smoke test. No user-facing change.
- Added `CLAUDE.md`, a short guide for Claude Code sessions covering commands,
  the cross-file architecture (decoder entry points, eager vs streaming frame
  sources, the background worker security boundary) and the release-notes
  rules. No user-facing change.
