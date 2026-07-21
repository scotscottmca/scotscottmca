# AGENTS.md

Guidance for AI agents and contributors working in this repository.

## What this is

`scotscottmca` is a personal technical blog ("ScotScottMcA") built with
[Astro](https://astro.build/). It is deployed to **Azure Static Web Apps** and
served at **https://scotscottmca.com**. Posts cover Microsoft endpoint
management topics — WSUS, ConfigMgr/MECM, Intune, Endpoint Manager, and
PowerShell.

> Previously a Hugo (DoIt theme) site published to GitHub Pages. It was
> rewritten to Astro and moved to Azure SWA. All posts, images, Google
> Analytics, socials and the custom domain were retained.

## Tech stack

- **Framework:** Astro 5 (static output). Node 20+ / 22 recommended.
- **Content:** Markdown in `src/content/posts/`, loaded via a content
  collection (`src/content.config.ts`, glob loader + zod schema).
- **Styling:** hand-written CSS in `src/styles/global.css`. No CSS framework.
- **Code highlighting:** Shiki dual theme (`github-light` / `github-dark`),
  switched via CSS on `data-theme`.
- **Analytics:** Google Analytics `G-2DLW833T23` (in `src/config.ts`, injected
  by `src/layouts/BaseLayout.astro`).
- **Extras:** RSS (`src/pages/rss.xml.js`) and sitemap (`@astrojs/sitemap`).

## Theming

Three themes, selectable in the header via `ThemeToggle.astro`:

- `dark` — **default**, GitHub Copilot-inspired vibrant accent on charcoal.
- `light` — bright surface, same accent family.
- `mono` — monochrome (greyscale, chroma removed).

Implemented with CSS custom properties keyed off `html[data-theme="…"]`. The
choice persists in `localStorage` and is applied before paint by an inline
script in `BaseLayout.astro` (avoids flash of wrong theme).

## Repository layout

| Path | Purpose |
|------|---------|
| `src/config.ts` | Site metadata: title, description, socials, GA id, license. |
| `src/content/posts/` | Blog posts (Markdown). |
| `src/content.config.ts` | Content collection schema/loader. |
| `src/layouts/BaseLayout.astro` | HTML shell: head, meta/OG, GA, theme init. |
| `src/components/` | Header, Footer, ThemeToggle, SocialLinks, PostCard. |
| `src/pages/` | Routes: `index`, `posts/`, `posts/[...slug]`, `tags/`, `404`, `rss.xml`. |
| `src/styles/global.css` | All styling + the three theme palettes. |
| `public/` | Static assets served at site root (`images/`, favicons, `CNAME`, `staticwebapp.config.json`). |
| `assets/` | Retained only for files linked by external GitHub raw URLs (`files/DummyApps.json`, `ErrorCodes/`). Not part of the build. |
| `scripts/migrate.mjs` | One-shot Hugo→Astro migration script (kept for reference). |
| `staticwebapp.config.json` | Azure SWA routing/headers/404 config. |
| `.github/workflows/azure-static-web-apps.yml` | CI/CD to Azure SWA. |

## Content conventions

Posts are Markdown with this front matter (validated by the collection schema):

```yaml
---
title: Post title
date: 2023-01-05
lastModified: 2023-01-06   # optional
author: Scott McAllister
tags:
  - Intune
  - ConfigMgr
draft: false
---
```

- Post URL = `/posts/<filename-without-extension>/` (lowercased).
- Images live in `public/images/…` and are referenced with absolute paths,
  e.g. `![caption](/images/Folder/pic.png)`.
- Set `draft: true` to exclude a post from the build, lists, RSS and sitemap.
- Use standard Markdown fenced code blocks and blockquotes (the old Hugo
  `{{< highlight >}}`, `{{< image >}}` and `{{< admonition >}}` shortcodes were
  converted away — do not reintroduce them).

## Local development

```bash
npm install
npm run dev       # dev server with HMR
npm run build     # production build into ./dist
npm run preview   # serve the built ./dist locally
```

Requires Node 20+. If `node` isn't on PATH, it may be at `/usr/local/bin/node`.

## Build & deploy

Deployment is automatic via GitHub Actions
(`.github/workflows/azure-static-web-apps.yml`):

- On push to `main`: `npm ci` → `npm run build` → deploy `dist/` to Azure SWA
  (`skip_app_build: true`, so the workflow builds, not Oryx).
- On PRs to `main`: a preview environment is created; closing the PR tears it
  down.
- Requires repo secret **`AZURE_STATIC_WEB_APPS_API_TOKEN`** (the SWA
  deployment token from the Azure portal).
- The custom domain (`scotscottmca.com`) is configured in the Azure SWA
  resource. `public/CNAME` is retained for reference but SWA does not use it.
- Do **not** commit the generated `dist/` output (git-ignored).

## Agent guidance

- Most changes are content (`src/content/posts/`) or config (`src/config.ts`).
- Keep front-matter fields matching the schema in `src/content.config.ts`.
- Preserve the Google Analytics id and socials in `src/config.ts`.
- Verify with `npm run build` before finishing.
- Pushing to `main` publishes the live site — treat it as production.
