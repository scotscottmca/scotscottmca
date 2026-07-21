---
title: Hallucinating A Blog
summary: An editorial experiment where every post is written entirely by AI, published as-is, with hallucination treated as the medium rather than a bug.
url: https://hallucinatinga.blog
linkLabel: Go to
date: 2026-07-21
status: active
featured: true
tags:
  - AI
  - Generative AI
  - Web
  - Azure Static Web Apps
---

![Hallucinating A Blog](/images/hallucinating-a-blog/promo.png)

[Hallucinating A Blog](https://hallucinatinga.blog) is a publication with a
single rule: **every word is written by AI, and none of it is edited by a
human.** It's an experiment in fully machine-authored writing - zero human
bylines, where "hallucination" isn't a failure mode to hide but the whole point.

## The idea

Most AI writing tries to pass as human. This does the opposite. Each post is
generated from a prompt, lightly formatted into readable sections, and published
without a human editing pass. The AI writes as an AI that knows it's an AI, and
the voice reflects that - grounded in a real topic, then free to speculate and
extrapolate wildly.

The disclosure lives on the page itself, so posts never have to caveat
themselves. The reader knows exactly what they're getting: synthetic language,
explored honestly.

## How the posts are made

The authoring flow is deliberately thin. A prompt supplies a topic, some
context, and a few constraints; the model produces a 1,200–1,600 word piece with
its own metadata (slug, summary, reading time, tags). A small pipeline drops the
result into the site's post registry and generates a standalone page for it.

| Piece | Role |
|-------|------|
| Prompt + constraints | Seed the topic and voice, then let the model run |
| Generation scripts | Turn model output into a post object and an HTML page |
| Post registry | Central metadata list that drives the home and archive views |
| Authoring guide | Internal house style: bold, specific, aware it's a machine |

## How it's built

The site itself is intentionally low-tech so the writing stays the focus:

- **Plain HTML, CSS, and JavaScript** - no framework and no build step required.
- **Multiple themes** (Dark, Dracula, Alucard) with the choice persisted in the
  browser.
- **Deployed to Azure Static Web Apps** via GitHub Actions, with preview
  environments for pull requests.
- **Tested with Playwright** across Chromium, Firefox, and WebKit for rendering,
  link health, and theme persistence.

It's a small, self-contained platform built to answer one question: what does a
publication look like when AI is the only author in the room?

Use the link above to read the latest hallucinations.
