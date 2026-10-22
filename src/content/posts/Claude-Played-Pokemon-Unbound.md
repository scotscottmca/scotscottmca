---
title: Claude learned to play Pokémon Unbound, but Alice taught it humility
description: I built a harness so Claude could play Pokémon Unbound on its own, with Haiku on the controller and bigger models on call. Two runs, seven badges, 3,000 steps stuck on a mountain, and one gym leader who absolutely battered it.
date: 2026-10-22
author: Scott McAllister
tags:
  - AI
  - Claude Code
  - Agents
  - Pokémon
draft: true
---

Two posts in a month. Who am I? This one's less "I built a tool you might use" and more "I made Claude play a GBA romhack for two weeks and watched it suffer". A harness, two runs, a cost bill, a few things that fell over, and a gym leader called Alice who I now have beef with.

Let's cook.

![TODO: reaction gif, trainer walking out of Pallet Town / "I choose you"](/images/claude-played-pokemon-unbound/intro.gif)

## Choose your starter

**Did you know a romhack the model has never seen in training makes a decent benchmark? Well you do now, and so does my credit card.**

Why did I do this? Just because. Why not? Pokémon Unbound is a ridiculously good romhack, Anthropic had already shown Claude finishing FireRed, and I wanted to see how far it could get on something that isn't in the training data. Unbound's region, Borrius, is nowhere in there. The semantic routing, memory mapping and cost analysis were interesting too, but they were the side quest. Mostly I just wanted to watch.

The research I did up front reckoned 6 to 10 weeks to a first full attempt, with most of that in a state layer specific to Unbound. The build took two days. Issues #1 to #20, phases 0 to 3, opened and closed between the 7th and 8th of October. <!-- VERIFY: #1-#20 all closed by 8 Oct -->

Don't ask me how. I may or may not have slept.

## What's in the bag

The design is thin on purpose. A verified state layer and deterministic tools, and the model does the thinking.

- mGBA runs the ROM. A wee Lua script, `probe.lua`, serves a line protocol on port 8888. One client drives the emulator at a time, full stop.
- `bridge/` reads RAM into state JSON (party, position, map, dialog, battle), builds a collision grid off the live map, pulls species, move and item names out of the ROM, does A* pathfinding, and exposes it all as MCP tools. Every RAM address has its evidence written down, because about half of what I assumed from vanilla FireRed turned out wrong on Unbound.
- `agent/` is the runner. One Claude session per chunk, a `CLAUDE.md` with the player's rules, and a memory folder the agent keeps itself.
- A read-only spectator page on port 8765 so I can watch beside the emulator.

![TODO: spectator party panel with HP, status and EVs](/images/claude-played-pokemon-unbound/spectator-party.png)

The player is Haiku 5.5. That was the plan from the first commit, even though my own research doc said Fable or Opus. Haiku's cheap and fast, and I wanted the clever stuff on call rather than on every turn. So Sonnet is the strategist and verifier, Fable is the expert and only gets one call per gym, and Opus does the memory refining between chunks. A Haiku watcher reads over the agent's shoulder every 10 actions and a Sonnet verifier every 40, and neither of them can block play. They just leave notes.

The other rule I set myself: everything changes in flight. Fixes hot-reload into the running MCP server, the agent's instructions get swapped on the next tool call, and the emulator never restarts. No savestate rollbacks either. If it gets stuck, it gets stuck for real.

Oh, and the rival's called Copilot. Obviously.

## Run one: Vanilla

First proper run. Vanilla difficulty, fresh save, go.

Four badges. Dresco, Crater Town, Blizzard City, Fallshore City. 6,477 actions over about 25 hours of wall-clock, 38 catches, every one nicknamed, and about $50 of API-equivalent spend. Final team was a Metang, two Hariyama, a Crobat, a Watchog and a Samurott, all high 30s to low 40s. Honestly not bad for a model that costs pennies.

![TODO: reaction gif, "we did it" / badge get](/images/claude-played-pokemon-unbound/badge.gif)

### Whited out (the runner, not the Pokémon)

The Fallshore gym has a water puzzle with lily pads and Lapras. After about 300 steps on it the agent packed in and said, politely, "I'm stopping. I need a hint for this puzzle, a different approach, or a decision to end the run."

Fair enough. Except the runner didn't know what "stopping" meant. It started the next chunk, the agent said the same thing in one turn, and that repeated every 6 seconds. For 390 chunks.

I wasn't watching. The monitor stayed quiet because there were no errors, no watchdogs and no new steps, which is exactly the shape of "nothing's wrong". I noticed when the step count hadn't moved in half an hour. Then I looked at the console and it said $2,903 spent.

![TODO: reaction gif, choking on drink / wide eyes](/images/claude-played-pokemon-unbound/cost.gif)

Turns out a resumed `claude -p` session reports its running total, not the chunk's own cost, and both the runner and the spectator were summing those totals. Chunk 389 reported $9.62, chunk 390 reported $9.63, so chunk 390 really cost a penny. The real spend for the whole run at that point was $35.60, and the stop-loop itself about $3. Every figure I'd quoted myself before that was wrong in the same way. Brilliant.

Two fixes: cost is now the per-chunk delta, and there's an idle breaker that stops the runner after three chunks with no game action ([#150](https://github.com/scotscottmca/ClaudeUnbound/issues/150)).

The puzzle itself needed a hint, which goes into an `operator.md` the agent reads as pinned memory. This is the one that unblocked it:

```
- Fallshore City gym lily-pad room [14,15]: the other Lapras are NOT out of reach. The lily pads are paths you can use. You don't reach them from the bridge: the bridge passes over them (the pads are a lower level). Pads with gaps between them can be hopped over in any direction, up and down too.
- Fallshore gym lily pads (operator): go up, then right.
```

The actual bug underneath was that the pathfinder didn't know about map levels, so a "no path" answer couldn't say the pads were one floor down ([#155](https://github.com/scotscottmca/ClaudeUnbound/issues/155)). Separately, warp events sitting on plain floor turned out to be arrival-only, so the router was trying to walk through warps that only work in one direction ([#149](https://github.com/scotscottmca/ClaudeUnbound/issues/149)). Vanilla knowledge is a hypothesis on this game. Every time.

I stopped the Vanilla run on purpose at step 6,477, just after badge four, and kept the save as a test bed for the menu tools. Then on to the real test.

## Run two: Expert

Expert difficulty is a different game. Level caps by badge (20, 26, 32, 36 and up), trainers scale to your highest level, Ace Trainers come with 252 EVs in their two best stats, Shift battle style, and a "4 Items Only" rule in trainer battles. I set the puzzles to Easy because the test was battles and team-building, not me watching it push boulders for a day. More on that later. 🫠

I started it from a true Expert new game, intro and all, with a $150 budget and a bootstrap of general knowledge from the Vanilla run's memory.

Badge one at step 1,265. Badge two at step 7,561. Badge three at step 24,887.

That gap is Alice.

### Alice

Blizzard City's gym leader. The agent sent the same six Pokémon into the same fight, lost, healed, walked back and did it again. 40 times. I only found out while checking why it wasn't calling the walkthrough and read its own note in memory: "Blizzard gym blocked (Alice, 40 losses, $150)". It had logged the problem perfectly and then kept doing it anyway.

![TODO: reaction gif, getting flattened / "I'm fine"](/images/claude-played-pokemon-unbound/alice.gif)

The expert is capped at one Fable call per gym, so one bit of big brain advice and then it's on its own. For a gym that needs a team change rather than a better move order, that cap is too tight, and I haven't fixed it yet.

It did beat her in the end. Badge three. <!-- VERIFY: what changed in the team or plan before the win -->

### Frost Mountain

About 3,000 of the run's 32,036 steps went on one mountain. There's a boulder route that needs Strength and the Fall Badge, neither of which it had, and it kept trying it.

How I noticed: the monitor was throwing watchdogs on the same map over and over. How I found the cause: much later, in the agent's own memory notes. It knew. It had written it down. I didn't read it fast enough, and it ran for hours. That one's on me.

The walkthrough is a gated last resort. The gate opens after enough actions with no progress, and at that point it had been open for ages: 3,169 actions since progress, 13 watchdogs, expert and strategist both consulted. Then I dropped in a hint telling it to stop the boulder route, and the hint reset the gate's clock. Closed it for another 150 actions. My hint made it worse ([#182](https://github.com/scotscottmca/ClaudeUnbound/issues/182)).

The fix is a one-liner. A hint that only redirects the agent no longer counts as progress:

```python
def is_redirect(hint):
    """True if every line of an OPERATOR HINT note (lines joined by ' | ') only redirects the agent."""
    return all(REDIRECT.search(ln) for ln in hint.split(" | ") if ln.strip())
```

### The run so far

32,036 steps, 515 chunks, 41 catches, 113 whiteouts, $118.16 against the $150. Tool calls tell the story: `press_buttons` 9,831, `get_state` 8,734, `walk_to` 7,820, `fight` 4,510, `wiki_search` 1,899. The harness reviewers on top of that were cheap: 667 Haiku watcher calls for about 60p and 331 Sonnet verifier calls for about $6.40.

The spec's Phase 4 test was "a bootstrapped second run beats the first on steps per badge". Vanilla was about 1,600 steps a badge, Expert about 10,700. So no, and I can't tell you if the bootstrap helped or hurt, because the difficulty changed, 3,000 steps went up a mountain, and the bootstrap only carried general knowledge. Not a fair fight, and I'm not going to pretend it was.

## Where the money went

$118.16 is the runner's own total. I had a per-model breakdown as well, but it only covers 42 of the chunks and doesn't add up to the total, so I'm not quoting percentages. <!-- VERIFY: 42 of 107 chunks in the delta sample -->

What I can say is the Fable expert's thinking was the big one. The costliest single chunk was $7.49 with about 73k thinking tokens. One chunk. For context, the Haiku player, the one actually pressing the buttons, was around $6 for the whole run. I've since dropped the expert's effort to medium and have no idea yet whether it plays worse for it.

Sessions rotate at 80k context, and only in the overworld, never mid-battle, mid-dialog or in a menu:

```python
def rotate_reason(context, now, town):
    if now.get("mode") != "overworld" or context <= TOWN_ROTATE_MIN:
        return None
    if context > CONTEXT_LIMIT:
        return "context"
    return "town" if new_town(town, now.get("map") or "") else None
```

That rotated 706 times. 560 on context, 146 on entering a new town. Whether that's hurting it, no idea yet either.

## Things that fell over

A few that happened between the above.

### A key item called …?w?er

The agent kept noting a "garbled key item" in its bag and never worked out what it was. The bag listing had names like `??w?tyGoggle`. Unbound stores long item names as a ROM pointer in the first four bytes of the entry, and my decoder was reading the pointer as text. 33 items affected. The mystery key item was the Dowsing Machine, which it had been carrying about unused the whole time ([#164](https://github.com/scotscottmca/ClaudeUnbound/issues/164)).

### The monitor that cried wolf

Every time the monitor started it said "runner NOT running". The runner was running. PowerShell 5.1 returns nothing for `.Count` on a single object unless you wrap the pipeline in `@(...)`. One process, empty count, false alarm, every single restart ([#169](https://github.com/scotscottmca/ClaudeUnbound/issues/169)). That's handy.

```python
cmd = ("@(Get-CimInstance Win32_Process -Filter \"name='python.exe'\" | "
       "Where-Object { $_.CommandLine -match 'agent[\\\\/]run\\.py' }).Count")
```

### It kept playing after I stopped it

I stopped the runner. At 12:58 the log was still updating. Stopping the runner's Python process didn't stop its `claude.exe` child, which carried on playing Pokémon by itself for about ten minutes. Fixed, and the runbook now says to kill both. Some real Lower Decks energy. <!-- VERIFY: what the fix was, process tree kill? -->

## Saving... don't turn off the power

That's how it ended. The game froze on the save screen at Frost Mountain. Input stopped reaching it, the idle breaker (the one from the Vanilla run, finally earning its keep) stopped the runner after three empty chunks, and I shut the emulator down. I haven't diagnosed it. No idea yet.

![TODO: screenshot of the frozen SAVING screen if you have one, else cut](/images/claude-played-pokemon-unbound/saving.png)

So the Expert run is parked at three badges and $118.

## What's next?

- A few tools still throw raw `KeyError`s at the agent on a bad argument. It recovers every time, but each one costs a turn ([#170](https://github.com/scotscottmca/ClaudeUnbound/issues/170)).
- Find out what froze the save screen before I start it again.
- Give the agent a proper way past Alice and the Frost Mountain boulders, either a looser expert cap or an actual plan for getting Strength.
- Decide the difficulty. I switched it to Difficult in-game while poking about, and the harness still thinks it's Expert. <!-- VERIFY: run.json updated yet? -->
- Check the merged fixes actually fixed things. About a dozen issues are closed in code and still waiting on live evidence.

## Summary

Haiku can play Pokémon Unbound. It got four badges on Vanilla for $50 and three on Expert for $118, and the harness held across 32,000 steps without the emulator restarting once. It also lost to the same woman 40 times and spent three hours walking into a boulder, so let's not get carried away.

Repo's [here](https://github.com/scotscottmca/ClaudeUnbound) if you want a swatch.

Thanks for reading!

![TODO: reaction gif, trainer saluting / Pokémon fainting](/images/claude-played-pokemon-unbound/outro.gif)

<!-- SHOTS:
1. Spectator party panel (http://127.0.0.1:8765/), HP/status/EVs visible
2. Spectator reasoning stream during a battle
3. Model router panel showing a Fable expert handoff
4. Memory graph panel
5. The frozen "SAVING... DON'T TURN OFF THE POWER" screen, if any capture exists
6. Optional: console showing "$2903 spent" if it's in a log
-->
