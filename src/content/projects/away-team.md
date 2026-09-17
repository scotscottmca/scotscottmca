---
title: away-team
summary: A crew of AI coding agents for fixing bugs - an orchestrator beams down a mapper, an investigator, a basher and a PR writer, on GitHub Copilot and Claude Code alike.
url: https://github.com/scotscottmca/away-team
linkLabel: View on GitHub
date: 2026-09-17
status: active
featured: true
npmPackage: '@scotscottmca/away-team'
tags:
  - GitHub Copilot
  - Claude Code
  - Node.js
  - Agent Skills
  - npm
  - GitHub Actions
---

![away-team](../../assets/images/away-team/banner.jpg)

**away-team** is a crew of AI coding agents for fixing bugs. Pick the
orchestrator, describe the bug, and it beams down specialists: one maps the
codebase, one finds the root cause, one bashes the bug, one writes the pull
request. It installs once and works in every repo, on GitHub Copilot and Claude
Code alike.

## The idea

Letting one large model read a whole solution, guess at a fix and write it up is
the expensive way to fix a bug. Most of the tokens go on re-reading code the
model saw last session, on reasoning with a model that costs five times what the
task needs, and on carrying an ever-growing transcript from step to step.

away-team splits the job into four narrow roles, each with only the tools and
context its step needs, and each running on the cheapest model tier that does
that step well. Reading a repo is cheap-tier work. Finding a root cause is the
one place the strong tier earns its price. Everything between steps is a short
fixed report, not a conversation.

## What it does

- Routes a request to the right specialist: map, investigate, fix or open a PR
- Writes a persistent `CODEMAP.md` per repo so agents stop re-reading the
  codebase every session
- Root-causes with a read-only investigator that reproduces first, tests one
  hypothesis at a time, and stops after three misses
- Fixes with a failing test first, the smallest change at the point every caller
  shares, and no drive-by refactors
- Opens PRs the way a technical writer would: a TL;DR body under 25 lines, the
  full breakdown as review comments
- Stops and asks before any edit that touches auth, crypto, billing or
  migrations, and before every push
- Installs ponytail and caveman alongside, both at ultra by default, to shrink
  what the agents build and say

## How it works

Every agent is a markdown file with a small frontmatter block: its tools, its
model tier, and a prompt of under sixty lines. The orchestrator has no edit or
execute tools at all, so it cannot do the work itself; it can only classify,
delegate and relay. Subagents are stateless on both platforms, so each handoff
carries the user's request, what has been learnt so far, the specialist's scope,
and the report format to return.

| Piece | Role |
|-------|------|
| orchestrator | Classifies the request, dispatches one specialist per step, gates risky fixes and pushes |
| mapper | Trawls the solution and writes `docs/CODEMAP.md`: entry points, modules, data flow, contracts, invariants, verified build and test commands |
| investigator | Read-only. Reproduces, localises via git blame, verifies one hypothesis at a time, returns a Diagnosis with file and line evidence |
| basher | Takes a Diagnosis, writes the regression test, applies the minimal root-cause fix, runs the suite, commits |
| pr-writer | Turns the branch into a PR: conventional-commit title, TL;DR body, inline review comments via the GitHub API |
| codemap skill | The template and rules for the code map |
| pr-format skill | The house PR format and the `gh` commands that post it |
| installer | Renders the agents per platform and installs the companion plugins |

## Model tiers

Agents declare a tier, not a model, so the same file runs on whatever each
platform has.

| Tier | Used by | Copilot | Claude Code |
|------|---------|---------|-------------|
| cheap | mapper | GPT-5.6 Luna | haiku |
| balanced | orchestrator, basher, pr-writer | Claude Sonnet 5 | sonnet |
| strong | investigator | Claude Opus 5 | opus |

The mapping is one table in the installer. Claude's aliases resolve to the newest
model of each tier on their own; the Copilot column is the cheapest model on the
per-token price list that does the job.

## One source, two platforms

Copilot and Claude Code want different tool names and different model
identifiers in the frontmatter, and nothing else differs. The installer rewrites
those two lines at install time. The same code also renders a `dist/` folder per
platform, committed to the repo, so both tools' plugin marketplaces can install
it straight from GitHub.

## Deployment

The package publishes to npm as `@scotscottmca/away-team` from a GitHub Actions
workflow. A push to `main` that touches an agent, a skill or the installer bumps
the patch version, rebuilds `dist/`, tags and publishes. Documentation-only
changes don't release. A user installs with one `npx` command on Windows, macOS
or Linux, or through the Copilot and Claude Code plugin marketplaces.

```bash
npx @scotscottmca/away-team
```
