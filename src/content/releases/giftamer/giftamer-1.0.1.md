---
product: "GifTamer"
version: "1.0.1"
date: "2026-07-22"
---

### Fixed

- GIF playback no longer crashes with a "Failed to execute 'createImageData' ...
  Out of memory" error on large or long GIFs. Each frame was being held in
  memory twice; frames are now wrapped in an `ImageData` with zero copy, halving
  memory use.
