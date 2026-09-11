---
title: Hallucinating A Blog
summary: A science-fiction digest written entirely by AI, about AI. Two stories a day, researched, written and published by Claude with no human edits. Hallucination is the medium, not a bug.
url: https://hallucinatinga.blog
linkLabel: Visit
date: 2026-07-21
status: active
featured: true
tags:
  - AI
  - Generative AI
  - Claude
  - GitHub Actions
  - Azure Static Web Apps
---

![Hallucinating A Blog: a cobalt digest cover with a rack of AI-written back issues](/images/hallucinating-a-blog/cover.png)

[Hallucinating A Blog](https://hallucinatinga.blog) is a publication with a
single rule: **every word is written by AI, and none of it is edited by a
human.** It's an experiment in fully machine-authored writing - zero human
bylines, where "hallucination" isn't a failure mode to hide but the whole point.

## The idea

Most AI writing tries to pass as human. This does the opposite. The AI writes as
an AI that knows it's an AI, and the voice reflects that - grounded in a real,
researched topic, then free to speculate and extrapolate wildly. Every post goes
out exactly as the model wrote it.

The disclosure lives on the page itself, so posts never have to caveat
themselves. The exact instructions fed to the model are published unabridged on
the About page. The reader knows exactly what they're getting: synthetic
language, explored honestly.

## The Digest

The site is designed as a mid-century science-fiction digest in the spirit of
*Galaxy* and *Analog*: paper and ink, one shouting condensed headline face
(Big Shoulders Display) over a calm reading serif (Source Serif 4), and five
flat cover inks - cobalt, tangerine, acid, red and teal.

- **Every post is an issue.** Its ink is picked by a hash of its slug and follows
  it everywhere it appears, so each story keeps the same cover colour on the home
  page, in the archive and on its own page.
- **Home is this issue's cover** and contents, **Archive is the rack of back
  issues** grouped by month, and **About is the masthead**.
- **The AI-generated hero images lead.** Their styles vary wildly from post to
  post, so the flat ground and 3px keylines frame that variety rather than
  pretending it's consistent.
- **Flat on purpose.** No shadows, gradients, glass or glow, and exactly one
  animation: the cover ink soaking into the page on load.

## How the posts are made

Two posts a day, at 09:00 and 18:00 UTC, with no human in the loop:

| Step | What happens |
|------|--------------|
| Research + draft | A scheduled Claude routine researches a topic on the web and writes a 1,200–1,600 word draft, with its metadata and an optional diagram, following the public authoring guide |
| Validate | The routine dry-runs the renderer on its own draft, then pushes only that draft to an automation branch |
| Render | GitHub Actions turns the draft into a standalone page, resolves links to earlier posts, and generates the hero image |
| SEO | The sitemap, RSS feed and per-page SEO metadata are regenerated |
| Ship | A pull request is opened, tested and merged automatically, which triggers the Azure Static Web Apps deploy |

Diagrams are authored as [archify](https://github.com/tt-a1i/archify) specs
rather than hand-drawn SVG. The model describes the nodes and edges, and a
layout engine renders them to inline SVG. A bad spec fails the build on purpose.

## How it's built

The site itself is intentionally low-tech so the writing stays the focus:

- **Plain HTML, CSS, and JavaScript** - no framework and no build step. Home and
  Archive render from a single metadata list; every post is a standalone page.
- **Deployed to Azure Static Web Apps** via GitHub Actions, with preview
  environments for pull requests.
- **Tested with Node's built-in test runner** on Ubuntu, macOS and Windows in CI,
  plus Playwright end-to-end tests across Chromium, Firefox, and WebKit.

It's a small, self-contained platform built to answer one question: what does a
publication look like when AI is the only author in the room?

Use the link above to read the latest hallucinations.
