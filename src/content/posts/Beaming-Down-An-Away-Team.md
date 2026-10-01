---
title: Beaming Down An Away Team
date: 2026-10-01
author: Scott McAllister
tags:
  - Claude Code
  - GitHub Copilot
  - AI
  - Agents
draft: false
---

It's been a hot minute since I've written anything, but we back. Maybe? We'll see. Everything's AI just now, so here's an *obligatory* AI post. What's the deal? Agents, models, tokens, effort and Star Trek.

Let's cook.

<iframe src="https://tenor.com/embed/12325030" title="Energise" style="width: 100%; aspect-ratio: 4 / 3; border: 0;" loading="lazy" allowfullscreen></iframe>

## Captain's log

**Stardate: ~80750.7. I've been burning tokens like Quark running a holosuite during a Ferengi business convention.**

For a while now I've been trying to be a bit more mindful about how many tokens I burn through. Every bug, no matter how wee, was getting the biggest, smartest and hungriest model thrown at it, reading half the repo, reasoning about all of it and then writing me an essay about what it found.

Asking the top model to track down a typo is like sending the Enterprise to pick up your messages.

So I figured the answer was simple, use the right model for the right job. Cheap model for the boring stuff, expensive model for the thinking. That's what I set out to build.

Spoiler, the model turned out to be the smaller lever. But we'll get there.

## Assembling the crew

The thing I built is [away-team](https://github.com/scotscottmca/away-team), an agent orchestrator for fixing bugs. And yes, it's named after Star Trek, because I'm a huge effing nerd and I'm not sorry.

![Picard. Make it so.](/images/beaming-down-an-away-team/make-it-so.gif)

Instead of one agent doing absolutely everything, an orchestrator sits in the captain's chair and beams down a crew of specialists, each with one job:

- **Mapper** maps the repo once into `docs/CODEMAP.md`, so nobody has to re-read the whole thing every session
- **Investigator** is read-only. It digs into the bug and comes back with the root cause
- **Basher** takes the investigator's findings, writes a failing test, then the smallest fix that makes it pass
- **PR-writer** writes up the fix and raises the pull request
- **Reviewer** picks up review comments on your PR, fixes the small stuff and proposes on the rest
- **Away-Team** is the orchestrator itself, deciding who goes and passing findings between them

It runs on both GitHub Copilot and Claude Code (CLI and desktop app) from the same source. Same crew, same reports, it just gets rendered differently for each one.

![away-team ready to go in the Claude desktop app](/images/beaming-down-an-away-team/agent-list.png)

![away-team in the GitHub Copilot agent picker](/images/beaming-down-an-away-team/agent-list-copilot.webp)

Each agent declares a tier rather than a specific model, and the installer works out the best model for that tier on whatever platform you're on. The mapper gets the cheap tier because it reads the most and thinks the least. The investigator gets the strong tier, because root cause is the one place the big model actually earns its keep. Everything else (orchestrator, basher, PR-writer, reviewer) sits in the middle, since the investigator has already done the hard thinking by the time they get involved.

The bit I like most is that I don't pick anything. I don't choose the agent, I don't choose the model and I don't fiddle with effort levels, I just describe the bug and the orchestrator sorts out the rest.

## How a bug actually gets fixed

The best example is a bug the crew found in away-team itself ([#24](https://github.com/scotscottmca/away-team/issues/24)).

The installer runs the companion plugin installs (`claude plugin …`, `copilot plugin …`) through `spawnSync` with no timeout. So if one of those hung on a dodgy network, the installer just sat there with a frozen spinner. Forever. No output, no error, nothing.

Here's how that went:

1. The investigator beamed down and reproduced it by swapping in a fake `claude` that just ran `sleep 600`. The installer blocked straight past a two-minute limit, so it was well and truly cooked
2. It came back with a Diagnosis (more on that below) listing every `spawnSync` with no `timeout`, no `killSignal` and no `input`, and where each one lived
3. The orchestrator checked that Diagnosis against its gates
4. The basher routed every `spawnSync` through one `run()` helper with a 120 second timeout and a kill signal, treated a timed-out child as failed, then confirmed the fix against the same fake `claude`
5. The PR-writer raised it ([#28](https://github.com/scotscottmca/away-team/pull/28))

The crew found it, fixed it and verified it all on its own. All I did was review the PR and hit merge.

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

If an agent gets stuck it doesn't improvise, it returns a `## Blocked` report saying what it tried and what it needs, and it won't have changed anything.

### The gates are a feature

The orchestrator stops and shows you the Diagnosis before anything gets edited if confidence isn't high, if you only asked *why*, or if the fix touches auth, crypto, billing or migrations. It also always asks before pushing.

Here's a real one. The fix touched an audit path, so it stopped and asked before the basher went anywhere near it:

![The orchestrator stopping before a fix that touches the audit path](/images/beaming-down-an-away-team/gate.webp)

Then once the fix was committed, it stopped again before pushing:

![The orchestrator asking before beaming down the PR-writer to push](/images/beaming-down-an-away-team/gate-push.png)

## Where the tokens actually go

I went in thinking model choice would be the big saving. Then I actually measured it (first-turn input tokens, taken from each agent's own transcript) and the biggest lever by a mile was which tools each agent is allowed to see.

A specialist limited to `tools: ["read", "search", "execute"]` started at 6,782 tokens. The exact same agent with every tool inherited started at 26,181. Same agent, same instructions, roughly four times the tokens before it's done a single thing. wtf. And every turn re-reads that context, so it adds up quickly.

MCP servers on the other hand are close to free. Only the tool names load up front, at about 11 tokens each. I padded every description tenfold and the total didn't move by a single token.

So the tiers still help, but scoping each agent down to just what it needs is what actually cooks.

## Things that broke along the way

It took a whole host of trial and error to get the orchestrator handling the coordination on its own. Three of the most memorable:

### Copilot ignoring the search tools

The Copilot docs say `search` is the alias for the grep and glob tools. So I gave my agents `["read", "search", "execute"]` and called it a day.

I only noticed something was off when I asked the crew to dig through GitHub issues and ADO work items, and it kept falling over because search was unavailable. Brilliant. They'd come up with `view` and `bash` and no search tool at all, and were quietly grepping through bash instead.

Turns out Copilot just ignores tool names it doesn't recognise. No error, no warning, nothing. Coward.

The fix was to write all three, `"search", "grep", "glob"`, and let it pick out the ones it knows.

### Plugin installs breaking

The plugin install worked great right up until the orchestrator tried to delegate, and got this:

```
Agent type 'away-team-mapper' not found
```

Turns out Claude Code registers plugin agents as `<plugin>:<name>`, so the bare name doesn't resolve. Fine, use `away-team:away-team-mapper`. Except Copilot doesn't understand that scoped name, so it fell back to a generic agent instead. Two platforms, two naming schemes, and neither one tells you it's shit the bed.

![Lower Decks: "I'm sure they're fine!"](/images/beaming-down-an-away-team/this-is-fine.gif)

So now each platform's build gets its own naming.

### The token table that measured the wrong thing

Early on I had a table saying each agent cost somewhere between 50k and 90k tokens to start up, and the README confidently said about 12k. Okay buddy. Both were complete garbage.

The test had run each agent's instructions inside a generic subagent, which copies the prose and drops the `tools:` line, which as we've just found out is the bit doing all the work. On top of that, the session total includes the orchestrator re-reading its own context every turn, which made everything look four to ten times bigger than it really was. Measuring each agent from its own transcript gave the real numbers above.

## Does it actually save tokens?

Yes. Kind of.

I haven't run a proper side-by-side yet, but on the bugs I've tested it on, away-team found and fixed the issue first time with fewer tokens, while the default agent burned more tokens and fixed it wrong. An agent that's cheaper but wrong is just expensive with extra steps.

> ⚠️ **Warning**
>
> The crew has a fixed cost to get going. For a one-line fix you already understand, just use the default agent. Away-team pays off on a proper investigation, not a typo.

## Beam me up

There are two ways to install it.

The npx route runs the installer, detects Copilot and/or Claude Code, and installs the agents, skills, and the optional ponytail and caveman companions:

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

Right now each agent's tier is fixed. Next up is letting the orchestrator pick the right model for each task on the fly, so a simple investigation doesn't get the strong model just because it's the investigator.

## Summary

It's not perfect and it still needs some work, but it's doing the job for me. On the bugs I've thrown at it so far, it's got them right first time, and my token bill is a wee bit less terrifying.

Engage.

Thanks for reading!

<!-- SHOTS:
1. agent-list.png + agent-list-copilot.webp - DONE
2. gate.webp + gate-push.png - DONE
3. make-it-so.gif + this-is-fine.gif - DONE
-->
