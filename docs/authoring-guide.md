# Authoring guide

How to add a **blog post** or a **project** to the site. Everything is plain
Markdown — no Hugo shortcodes, no special build steps. Add a file, run the dev
server, and it shows up.

- Blog posts live in `src/content/posts/`
- Projects live in `src/content/projects/`
- Images live in `public/images/`

Preview your changes locally with:

```bash
npm run dev      # http://localhost:4321
```

---

## 1. Adding a blog post

Create a new Markdown file in `src/content/posts/`. The **file name becomes the
URL**, lowercased:

```
src/content/posts/My-New-Post.md   ->   /posts/my-new-post/
```

### Front matter

Every post starts with a YAML front-matter block between `---` fences:

```yaml
---
title: My New Post
date: 2024-05-01
lastModified: 2024-05-03      # optional — omit if never edited
author: Scott McAllister      # optional — defaults to Scott McAllister
tags:
  - Intune
  - PowerShell
draft: false                  # true = hidden from the site, lists, RSS
---
```

| Field | Required | Notes |
|-------|----------|-------|
| `title` | yes | Shown as the page `<h1>` and in lists. |
| `date` | yes | `YYYY-MM-DD`. Controls ordering (newest first). |
| `lastModified` | no | Shows an "Updated" date on the post. |
| `author` | no | Defaults to `Scott McAllister`. |
| `tags` | no | List of strings. Shown as labels (not clickable). |
| `draft` | no | `true` keeps it out of the build entirely. |

> ℹ️ **Note**
>
> If a field is wrong or missing, the build fails with a clear message telling
> you which post and which field. The schema lives in `src/content.config.ts`.

### The body

Everything below the closing `---` is standard Markdown.

#### Headings

Use `##` and `###` for sections (the `#`/`<h1>` is generated from `title`, so
start your in-post headings at `##`):

```markdown
## A major section

### A sub-section
```

#### Text, links, emphasis

```markdown
Some **bold**, some *italic*, and a [link](https://example.com).
```

#### Images

Put the image file under `public/images/` (a per-post subfolder keeps things
tidy), then reference it with an **absolute path starting at `/images/`**:

```
public/images/my-new-post/screenshot.png
```

```markdown
![Alt text describing the image](/images/my-new-post/screenshot.png)
```

The `![...]` text is the alt text / caption. Images are automatically styled
(rounded corners, border, centered in posts).

#### Code blocks

Fence with triple backticks and a language for syntax highlighting:

````markdown
```powershell
Get-Service -Name wuauserv | Restart-Service
```
````

Supported languages include `powershell`, `csharp`, `xml`, `json`, `bash`,
`yaml`, and more. Inline code uses single backticks: `` `Get-Service` ``.

#### Callouts / notes

There are no special components — use a blockquote. The convention on this site
is an emoji + bold label on the first line:

```markdown
> 💡 **Tip**
>
> Keep each post focused on one problem and its fix.
```

Common ones: `ℹ️ **Note**`, `💡 **Tip**`, `⚠️ **Warning**`.

#### Tables

```markdown
| Error code | Meaning              |
|------------|----------------------|
| 0x87D00324 | App not detected     |
| 0x80070005 | Access denied        |
```

#### Lists

```markdown
- First point
- Second point
  - Nested point

1. Step one
2. Step two
```

### Full post example

```markdown
---
title: Fixing WSUS Sync Timeouts
date: 2024-05-01
tags:
  - WSUS
  - ConfigMgr
draft: false
---

Recently I hit repeated sync timeouts on a customer's software update point.
Here's what was happening and how I fixed it.

## Symptoms

The `wsyncmgr.log` showed the sync stalling at the same phase every run.

![wsyncmgr log showing the stall](/images/wsus-sync-timeouts/wsyncmgr.png)

## The fix

Bump the sync grace period in the registry:

```powershell
Set-ItemProperty -Path 'HKLM:\...\SyncGracePeriod' -Value 10
```

> ⚠️ **Warning**
>
> Restart the service after changing this or it won't take effect.

## Result

Syncs completed cleanly afterwards.
```

---

## 2. Adding a project

Create a Markdown file in `src/content/projects/`. Same URL rule:

```
src/content/projects/My-Tool.md   ->   /projects/my-tool/
```

A project is a **short "about" page that links out to the project itself**
(a repo, a live site, an article, etc.).

### Front matter

```yaml
---
title: My Tool
summary: One-line description shown on the projects list.
url: https://github.com/smcallister594/my-tool
linkLabel: View on GitHub       # optional — button text
date: 2024-02-10                 # optional — used for ordering
status: active                   # active | maintained | archived | complete
featured: false                  # optional — sorts to the top of the list
tags:
  - PowerShell
  - Intune
draft: false
---
```

| Field | Required | Notes |
|-------|----------|-------|
| `title` | yes | Project name. |
| `summary` | yes | One-liner on the `/projects` list. |
| `url` | yes | The outbound link to the project. Must be a full URL. |
| `linkLabel` | no | Button text. Defaults to `Visit project`. |
| `date` | no | Used for ordering. |
| `status` | no | One of `active`, `maintained`, `archived`, `complete`. Shown as a badge (`active` is highlighted). |
| `featured` | no | `true` pushes it to the top of the list. |
| `tags` | no | Labels. |
| `draft` | no | `true` hides it. |

### The body

The Markdown body is the about page — same formatting options as a blog post
(headings, images, code, callouts, tables). The outbound **link button is added
automatically** at the bottom from `url` + `linkLabel`; you don't write it
yourself.

### Full project example

```markdown
---
title: Intune Log Collector
summary: A script that pulls IME logs from a device and zips them for support.
url: https://github.com/smcallister594/intune-log-collector
linkLabel: View on GitHub
date: 2024-02-10
status: active
featured: true
tags:
  - PowerShell
  - Intune
  - IME
---

I kept manually grabbing the same set of Intune Management Extension logs every
time a deployment failed, so I wrapped it in a script.

## What it does

- Collects the IME logs from the standard paths
- Zips them with a timestamped name
- Optionally uploads the archive to a support location

![Running the collector](/images/intune-log-collector/run.png)

## Usage

```powershell
.\Collect-IMELogs.ps1 -Upload
```

Grab it from the link below.
```

---

## Checklist before you publish

- [ ] File is in the right folder (`posts/` or `projects/`).
- [ ] Front matter has the required fields and valid values.
- [ ] Images are in `public/images/...` and referenced as `/images/...`.
- [ ] `draft: false` (or remove the line) when you're ready to go live.
- [ ] `npm run build` succeeds locally.
- [ ] Commit and push to `main` — the Azure SWA workflow deploys automatically.
