---
title: GifTamer
summary: A Microsoft Edge extension that overlays video-style controls on any animated GIF - play/pause, scrub frame-by-frame, and change speed.
url: https://github.com/scotscottmca/giftamer
linkLabel: View on GitHub
date: 2026-07-20
status: active
featured: true
tags:
  - Browser Extension
  - Microsoft Edge
  - JavaScript
  - GIF
---

![GifTamer](/images/giftamer/promo.png)

GifTamer is a Microsoft Edge (Chromium) extension that overlays **video-style
controls on any animated GIF** - so you can play/pause, scrub frame-by-frame,
and change playback speed, things browsers don't let you do with GIFs natively.

## What it does

- ▶ / ❚❚ play and pause any GIF on the page
- Frame scrub slider - drag to any frame
- Speed control from 0.25× up to 4×
- Mouse-wheel over a GIF to step frames one at a time
- Works on inline GIFs and directly-opened GIF URLs
- Reads authed same-origin GIFs (e.g. Azure DevOps attachments) straight from
  the browser cache, avoiding CORS and sign-in redirects
- Zero dependencies - ships a self-contained GIF89a decoder

## How it works

GifTamer detects GIFs on the page, fetches their bytes, decodes them to RGBA
frames with a self-contained GIF89a decoder, and swaps each `<img>` for a
`<canvas>` plus a control bar driven by a `requestAnimationFrame` playback loop.
A small background service worker fetches GIF bytes that live outside the page's
own CORS scope.

| Piece | Role |
|-------|------|
| GIF decoder | Self-contained GIF89a decoder (LZW, compositing, disposal, transparency, interlace, per-frame delays) |
| Content script | Detects GIFs, decodes to frames, renders the canvas + control bar, runs playback |
| Background worker | Fetches cross-origin GIF bytes outside the page's CORS scope |
| Popup | Toolbar button: "scrub all GIFs on this page" |

## Security

GifTamer parses untrusted binary (GIFs) and can fetch remote bytes, so it takes
several deliberate precautions:

- **Same-origin credentials only.** Cookies are attached only when the GIF is on
  the same origin as the frame that asked for it. Cross-origin GIFs are fetched
  without credentials, so a hostile page cannot use GifTamer as a confused deputy
  to read another site's authenticated content.
- **SSRF protection.** The worker refuses non-`http(s)` schemes and blocks
  private, loopback, and link-local hosts - including the `169.254.169.254`
  cloud metadata endpoint.
- **Content-type gate.** A response is only accepted if it begins with a real
  GIF signature (`GIF87a` / `GIF89a`).
- **Hardened decoder.** LZW dictionary growth is capped, sub-block readers never
  read past the buffer, and absurd header dimensions are rejected before any
  large allocation. These paths are covered by unit tests that CI runs on every
  push and before every release.

## Data collection

GifTamer requests only the `activeTab` permission plus host access
(`<all_urls>`), which is needed because GIFs can appear on any site. It does
**not** request `storage`, `tabs`, `scripting`, or any data-collection
permission. It collects nothing and sends no data to the developer or any third
party.

---

## Privacy policy

**Last updated: 20 July 2026**

### Summary

GifTamer does not collect, store, or transmit any personal data. All GIF
decoding and playback happens locally in your browser.

### What data GifTamer accesses

GifTamer only ever reads the **image bytes of GIFs** on the pages you visit, so
it can decode and play them back. It does not read page text, form data,
passwords, browsing history, or anything else on the page.

### Network requests

GifTamer makes network requests **only to retrieve the bytes of a GIF you choose
to control**. When that GIF is on the same site you are already viewing, the
request includes your browser's cookies for that site (exactly as the page
itself could) so that authenticated images load. GIFs on other sites are fetched
**without** any cookies or credentials.

No request is ever made to the developer's servers or to any third-party
analytics, advertising, or tracking service.

### Data storage

GifTamer stores **no data**. It does not use the browser's storage APIs, does not
set cookies of its own, and keeps no history of the GIFs you view. Decoded frames
live only in memory while a GIF is on screen and are discarded afterwards.

### Data sharing

GifTamer shares **nothing** with anyone. No personal data is collected, so there
is nothing to sell, share, or disclose.

### Permissions

| Permission | Why it's needed |
|------------|-----------------|
| `activeTab` | To act on the current tab when you click the toolbar button. |
| Host access (`<all_urls>`) | Because a GIF can appear on any website; the control overlay must be able to run wherever you find one. |

GifTamer does **not** request the `storage`, `tabs`, `scripting`, or any
data-collection permissions.

### Changes to this policy

If this policy changes, the updated version will be published on this page with a
new "Last updated" date.

### Contact

Questions about privacy or the extension can be raised via the project's GitHub
repository, linked below.
