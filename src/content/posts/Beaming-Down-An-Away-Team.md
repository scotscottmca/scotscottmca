---
title: How I cut my AI agents' startup tokens 4x, and it wasn't the model
description: I built away-team, a crew of Star Trek-named agents that fix bugs in Claude Code and GitHub Copilot. Cheaper models helped a bit, but trimming each agent's tool list took its starting context from 26k tokens to under 7k.
date: 2026-10-01
lastModified: 2026-10-02
author: Scott McAllister
tags:
  - Claude Code
  - GitHub Copilot
  - AI
  - Agents
draft: false
---

It's been a hot minute since I've written anything, but we back. Maybe? We'll see. Everything's AI just now, so yes, this is an *obligatory* AI post. But it's a specific one: I built a crew of agents to fix bugs, went in thinking cheaper models would save me tokens, and found out the real saving was somewhere else entirely. Agents, models, tokens, a few things that fell over, and Star Trek.

Let's cook.

<iframe src="https://tenor.com/embed/12325030" title="Energise" style="width: 100%; aspect-ratio: 4 / 3; border: 0;" loading="lazy" allowfullscreen></iframe>

## Captain's log

**Stardate: ~80750.7. I've been burning tokens like Quark running a holosuite during a Ferengi business convention.**

Every bug, no matter how much of a wee shit it was, was getting the biggest, smartest and hungriest model thrown at it. It would read half the repo, reason about all of it, then write me an essay about what it found.

Asking the top model to track down a typo is like sending the Enterprise to pick up your beer.

So the plan was simple. Right model for the right job. Cheap model for the boring stuff, expensive model for the big brain stuff.

Spoiler, the model turned out to be the smaller lever. We'll get there.

## Assembling the crew

The thing I built is [away-team](https://github.com/scotscottmca/away-team), an agent orchestrator for fixing bugs. It's a kinda dumb side project that got out of hand, and yes, it's named after Star Trek, because I'm a huge nerd and I'm not sorry. Get some Earl Grey up in here. Make it hot.

![Picard. Make it so.](/images/beaming-down-an-away-team/make-it-so.gif)

Instead of one agent doing absolutely everything, an orchestrator sits in the captain's chair and beams down a crew of specialists, each with one job:

- **Mapper** maps the repo into `docs/CODEMAP.md`, so nobody has to re-read the whole thing every session. It refreshes the map once it's more than 50 commits behind, and doesn't bother at all on repos with fewer than about 30 source files
- **Investigator** is read-only. It digs into the bug and comes back with the root cause
- **Basher** takes the investigator's findings, writes a failing test, then the smallest fix that makes it pass. It also picks up small changes that are fully described up front, where there's nothing to diagnose
- **PR-writer** writes up the fix and raises the pull request
- **Reviewer** picks up review comments on your PR, fixes the small stuff and proposes on the rest. It sits outside the bug-fix flow (mapper > investigator > basher > PR-writer), so there's no diagnosis involved
- **Away-Team** is the orchestrator itself, deciding who goes and passing findings between them

Same source runs on both GitHub Copilot and Claude Code (CLI and desktop app). Same crew, same reports, just rendered differently for each. In the Claude desktop app, calling it with `/away-team` also enforces the orchestrator's tool limits from the very first turn.

![away-team ready to go in the Claude desktop app](/images/beaming-down-an-away-team/agent-list.png)

![away-team in the GitHub Copilot agent picker](/images/beaming-down-an-away-team/agent-list-copilot.webp)

Each agent declares a tier (cheap, balanced or strong) rather than a specific model, and the installer maps each tier to a model per platform. The only bit that isn't automatic is the mapping itself. Right now that's a table of named models I keep up to date by hand, so whether it's the *best* model is up for debate.

The mapper gets cheap, because it reads the most and thinks the least. The investigator gets strong, because root cause is the one place the big model actually earns its keep. Everyone else sits in the middle. The basher and PR-writer only turn up once the hard thinking's done, the orchestrator mostly just routes, and the reviewer works off review comments rather than a diagnosis.

Best bit is I don't pick anything. Not the agent, not the model, not the effort level. Those are set per agent in the frontmatter (and Copilot drops effort entirely 🫠). I describe the bug and the orchestrator sorts out the rest.

## How a bug actually gets fixed

The best example is a bug in away-team itself ([#35](https://github.com/scotscottmca/away-team/issues/35)).

Bit of a weird one. I was running it in a web session and the whole thing just stalled. The captain reported back:

```
Bash is denied to me, so I cannot run git status
```

What got committed? Nothing. No commit, no PR, just a crew standing about on the bridge. Some Lower Decks behaviour.

Turns out the orchestrator never declared `execute` in its tools. The allowlists block anything that isn't listed, so the captain had no shell at all. Couldn't even run `git status`.

The fix: add `execute` 🤷. It's guarded by the same read-only hooks as the investigator, so the captain can look but not touch, and I made the guard's `--agent` flag repeatable so one hook covers both agents. Tests before and after to make sure it actually did the business ([#38](https://github.com/scotscottmca/away-team/pull/38)).

Merged? YEET.

Every handoff between agents is a small fixed report rather than a full transcript, which is a big part of keeping the tokens down. This is the shape of the investigator's Diagnosis:

```
## Diagnosis
**Symptom:** one line
**Root cause:** one paragraph, plain language
**Evidence:** up to 6 bullets, `path:line` → what it shows
**Reproduction:** exact command(s) and trimmed observed output
**Confidence:** high | medium | low, and why
**Fix recommendation:** where, what, which callers are affected
**Regression test:** what to assert and where the test lives
**Ruled out:** each hypothesis tested and the evidence that killed it
**Risk:** auth / crypto / billing / data paths touched, or "none"
```

If an agent gets stuck it doesn't improvise. It returns a `## Blocked` report saying what it tried, what it touched and what it needs. The "what it touched" bit matters, because a stuck agent can leave things half done. A basher that hits its turn cap can leave a fix half applied (the orchestrator warns you), and a mapper that gets cut off writes a partial codemap on purpose. The only hard promise is the PR-writer's: if it's blocked, nothing has left your machine.

### The gates are a feature

Not a "feature". An actual one.

The orchestrator stops and shows you the Diagnosis before anything gets edited if confidence isn't high, if you only asked *why*, or if the fix touches auth, crypto, billing or migrations. It always asks before pushing too.

This fix touched an audit path, so it stopped before the basher went anywhere near it:

![The orchestrator stopping before a fix that touches the audit path](/images/beaming-down-an-away-team/gate.webp)

Then once the fix was committed, it stopped again before pushing:

![The orchestrator asking before beaming down the PR-writer to push](/images/beaming-down-an-away-team/gate-push.png)

## Where the tokens actually go

I went in thinking model choice would be the big saving. Then I actually measured it, first-turn input tokens taken from each agent's own transcript.

Same agent. Same instructions. Same model. The only difference was the tool list.

Limited to `tools: ["read", "search", "execute"]`, it started at 6,782 tokens. With every tool inherited, 26,181. Roughly four times the tokens before it's done a single thing. wtf?

And every turn re-reads that context, so it stacks up fast.

MCP servers on the other hand are close to free. Only the tool names load up front, at about 11 tokens each. I padded every description tenfold and the total didn't move by a single token.

So the tiers still help, but scoping each agent down to just what it needs is what actually cooks.

## Things that broke along the way

It took a whole host of trial and error to get the orchestrator handling the coordination on its own. The most memorable:

### Copilot ignoring the search tools

The Copilot docs say `search` is the alias for the grep and glob tools. So I gave my agents `["read", "search", "execute"]` and called it a day.

I only noticed something was off when I had the crew list the tools it actually had. `view` and `bash`. No search tool at all. Brilliant. Every grep and glob over the code was going through bash instead.

Turns out Copilot just ignores tool names it doesn't recognise. No error, no warning, nothing. Coward.

The fix was to write all three, `"search", "grep", "glob"`, and let it pick out the ones it knows.

### MCP servers that granted nothing

Around the same time, the crew kept falling over whenever I asked it to dig through GitHub issues or ADO work items. A spelling problem, of all things. Listing an MCP server by its bare name in `tools:` grants nothing. You need `<server>/*` to actually get its tools. Another silent one.

### Plugin installs breaking

The plugin install worked a treat right up until the orchestrator tried to delegate:

```
Agent type 'away-team-mapper' not found
```

Claude Code registers plugin agents as `<plugin>:<name>`, so the bare name doesn't resolve. Fine, use `away-team:away-team-mapper`. Except Copilot doesn't understand that scoped name, so it fell back to a generic agent instead. Two platforms, two naming schemes, and neither one tells you it's shit the bed.

![Lower Decks: "I'm sure they're fine!"](/images/beaming-down-an-away-team/this-is-fine.gif)

So now each platform's build gets its own naming.

### The token table that measured the wrong thing

Early on I had a table saying each agent cost somewhere between 50k and 90k tokens to start up, and the README confidently said about 12k. Okay buddy. Both were garbage.

The test had run each agent's instructions inside a generic subagent, which copies the prose and drops the `tools:` line. Which, as we've just found out, is the bit doing all the work. On top of that, the session total includes the orchestrator re-reading its own context every turn, which made everything look four to ten times bigger than it really was. Measuring each agent from its own transcript gave the real numbers above.

## Does it actually save tokens?

Meh, sure.

I haven't run a proper side-by-side yet, so don't take this as gospel. On the bugs I've tested it on, away-team found and fixed the issue first time with fewer tokens. The default agent burned more tokens and fixed it wrong. An agent that's cheaper but wrong is just expensive with extra steps.

> ⚠️ **Warning**
>
> The crew has a fixed cost to get going. For a one-line fix you already understand, just use the default agent. Away-team pays off on a proper investigation, not a typo.

## Beam me up

There are two ways to install it.

The npx route runs the installer, detects Copilot and/or Claude Code, and installs the agents and skills. On a global install it also adds the optional ponytail and caveman companions. A per-project install skips them:

```bash
npx @scotscottmca/away-team
```

Or go through the plugin marketplace, which is agents and skills only, managed through your CLI's plugin system:

```bash
claude plugin marketplace add scotscottmca/away-team
claude plugin install away-team@away-team

copilot plugin marketplace add scotscottmca/away-team
copilot plugin install away-team@away-team
```

Then select it with `claude --agent away-team` in Claude Code, or `/agent` and pick away-team in Copilot. In the Claude desktop app, use `/away-team <your request>`.

There's more detail on the [project page](/projects/away-team/) and in the [repo](https://github.com/scotscottmca/away-team).

## What's next?

Right now each agent's tier is fixed. Next up is letting the orchestrator pick the model per task on the fly, so a simple investigation doesn't get the strong model just because it's the investigator. That hand-maintained model table should really work itself out too.

## Summary

It's not perfect and it still needs work, but it's doing the job for me. On the bugs I've thrown at it so far it's got them right first time, and my token bill is a wee bit less terrifying.

Engage.

Thanks for reading!
