---
title: Beaming down a crew of AI agents to fix bugs (cheaply)
date: 2026-09-22
author: Scott McAllister
tags:
  - AI
  - Agents
  - Claude Code
  - GitHub Copilot
  - Development
unlisted: true
---

## Beam me down

<!-- gif: a Star Trek transporter beam-down -->
![beam](/images/away-team/beam.gif)

Letting one big model read your whole repo, guess at a fix and write it up is the expensive way to fix a bug. It works, but you're paying for it to re-read code it saw last session, reason with a model that costs five times what the job needs, and drag an ever-growing transcript along behind it.

<!-- gap: what actually kicked this off — the bill, the session, the bug that tipped you over -->

So I built away-team. An orchestrator that beams down four specialists to do the job, installed once, works in every repo, and runs on both GitHub Copilot and Claude Code.

## What's the crew?

Each one is a markdown file with a frontmatter block and a prompt under 70 lines. That's it, that's the whole agent.

- **away-team** (the orchestrator) - classifies what you asked, routes it to a specialist, and gates anything risky. It has no edit tools and its Bash is read-only. It never does the work itself.
- **mapper** - trawls the repo once and writes `docs/CODEMAP.md`, then refreshes it by diff so nobody has to re-read the codebase every session.
- **investigator** - read-only. Reproduces the bug, localises it with git blame, tests one hypothesis at a time and gives up after 3 misses. Hands back a `## Diagnosis` with file:line evidence.
- **basher** - takes that Diagnosis, writes a failing regression test first, applies the smallest root-cause fix, runs the suite, commits. No drive-by refactors.
- **pr-writer** - a TL;DR body under 25 lines, with the full breakdown posted as line-level review comments through the GitHub API (because `gh pr comment` can't do inline).

Every one of them returns a single fixed-format report of a few hundred tokens, or a `## Blocked` block saying what stage, why, what it tried and what it needs. Never a transcript. Nothing downstream re-verifies, and nobody improvises when they're stuck.

## Measure, don't guess

This is the bit I actually want to write about.

When I started I guessed a specialist's cold start was about 12k tokens. Then I measured it and got 50-90k, which was alarming, and also wrong. Then I measured it properly, off real Claude Code subagent transcripts, and found the number that mattered.

<!-- screenshot: the cost table from docs/cost.md, the 6.8k vs 26.2k row visible -->
![Cost Table](/images/away-team/1_cost_table.png)

An agent that declares a narrow `tools:` list starts at 6.8k tokens. One that inherits everything starts at 26.2k. A 3.9x cut, and it's one line of frontmatter!

![surprise](../../assets/images/Sleeping120MoreSeconds/surprise.gif)

A couple of other things fell out of the same measuring:

- MCP tools are nearly free to expose. About 11 tokens per tool, just the name, descriptions aren't loaded until called. 90 servers is roughly 1,000 tokens. So the crew grants every MCP server on the machine by default and doesn't think about it.
- `CLAUDE.md` costs +33.9k on the main thread and +0 in a subagent, because subagents never receive it. Which debunked what I'd assumed in my own issue tracker (#13, #23).

Cold start dominates everything, which gets you to the rule the whole project runs on: **the cheapest call is the one not made.** That's why the basher never gets called until there's a Diagnosis in hand, and why the push is folded into the one confirm question instead of being its own round trip.

## Alright, so what keeps it cheap?

**The right model per job.** Agents declare a tier, not a model name: cheap, balanced, strong. The mapper reads a lot and reasons little, so it's cheap. Root-causing is the one place reasoning quality actually pays, so the investigator is strong. Everyone else is balanced.

**Read-only that's actually read-only.** On Claude Code there's a hook, `hooks/readonly-guard.js`, that blocks write-shaped Bash (`>`, `sed -i`, `tee`, `rm`/`mv`/`mkdir`, mutating `git` and `gh`) and any MCP call whose name looks like create/update/delete. One carve-out: filing a new issue is allowed, because a stray finding has nowhere else to go.

**Short reports, never retyped.** Output tokens cost about 5x input, so specialists hand back a fixed report, not a conversation.

**A code map that sticks around.** Names and invariants, not link dumps, in the spirit of matklad's ARCHITECTURE.md.

**A context budget per agent.** Batch the tool calls, search before reading, read windows not whole files, run one test not the suite, cap command output, skip vendored directories. On Claude Code there's a `maxTurns` cap too, so a runaway investigation returns partial output instead of blowing the window.

**Ponytail and caveman.** Two companion plugins (not mine) installed alongside at "ultra" by default, that shrink what the agent builds and what it says. Daft names, real cost lever.

> 💡 **Note**
>
> Caching is the platform's job; turn count is ours.

## Two platforms, one pile of markdown

The agent bodies are identical files. Only the `tools:` aliasing and the `model:` line differ per platform, and `bin/models.js` holds an ordered per-tier model list for each. At build time they render to `dist/claude` and `dist/copilot`, both committed, so the plugin marketplaces can install straight from GitHub.

And then the platforms have opinions. Copilot downgrades subagent models to the session model under certain conditions, and it has no per-agent hooks, so "read-only" there is a strongly worded suggestion rather than a rule.

Claude Code scopes plugin agent names (`away-team:away-team-mapper`) and Copilot doesn't resolve that form. `maxTurns` is Claude-only.

![breath](../../assets/images/project-clippy/breath.gif)

All of that is written down as caveats with "checked live" next to it, because I stopped trusting the docs.

## When it asks first

The orchestrator stops and shows you the Diagnosis before any edit when confidence isn't high, when you only asked "why", or when the fix touches auth, crypto, billing or migrations. It always asks before a push.

It also flat refuses to run as a subagent. A gate can't ask a question if nothing can answer it, so that's enforced by its own description and an optional harness-level permission deny.

## When not to use it

For a one-line fix you already understand, use the default agent. The crew's fixed cost only pays off on a real investigation.

## Getting it

```bash
npx @scotscottmca/away-team
```

Node 20.19 or newer (it needs `require(esm)` because `@clack/prompts` is ESM-only). Install it globally so it's in every repo, or at project scope (`.github/` for Copilot, `.claude/` for Claude Code) and commit it so your teammates get it for free. It's on both platforms' plugin marketplaces as well.

Any push to `main` that touches an agent, a skill or the installer bumps the patch version, rebuilds `dist/`, tags and publishes to npm. Doc-only changes don't release.

## The End

That's pretty much it! The project page is [here](/projects/away-team/), and if you try it and it does something daft, open an issue and tell me.

<!-- gap: who helped, and with what -->

Thanks for reading :)

![salute](../../assets/images/project-clippy/salute.gif)
