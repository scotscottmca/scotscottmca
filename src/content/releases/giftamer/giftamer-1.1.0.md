---
product: "GifTamer"
version: "1.1.0"
date: "2026-07-22"
---

### Changed

- Rebranded the "Scrub" action to "Tame" throughout: the idle badge now reads
  "⏱ Tame", the toolbar action and popup say "Tame all GIFs", and docs follow
  suit.
- The badge is larger and easier to read, and while a GIF is being prepared it
  shows "Taming GIF…" always-visible (not only on hover).

### Added

- Local `build.sh` keeps a single unpacked `dist/LATEST/` folder (stamped with
  the latest ephemeral version) plus the versioned zip, so there is only ever
  one folder to reimport via "Load unpacked" in Edge without touching the
  shipped version.
- Automated release notes: on store publish the tagged `CHANGELOG.md` section is
  dispatched to the website repo and rendered at `/releases`.
