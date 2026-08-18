---
product: "GifTamer"
version: "1.1.1"
date: "2026-08-18"
---

### Fixed

- Large or long GIFs no longer crash with "Out of memory" / "array buffer
  allocation failed". The decoder previously composited every frame up front
  (memory = width x height x 4 x frame count, tens of GB for big GIFs). GIFs
  whose decoded frames exceed the budget now stream one frame at a time during
  playback. Backward and long-forward scrubbing stay responsive via periodic
  keyframe snapshots plus a small recent-frame cache, so seeking replays at
  most one keyframe interval instead of decoding from the start.

### Changed

- Documented in `AGENTS.md` that release notes must be updated every session, and
  that opening a pull request should prompt to confirm whether to promote the
  `[Unreleased]` notes into a versioned release. Corrected the publishing docs to
  reflect the push-to-`main` release flow.
