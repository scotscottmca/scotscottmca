---
title: Claude learned to play Pokémon Unbound, but Alice taught it humility
description: I had Claude build itself a harness to play Pokémon Unbound, then let it loose. Haiku on the controller, bigger models on call. Two runs, seven badges, 3,000 steps stuck on a mountain, and one gym leader who absolutely battered it.
date: 2026-10-22
author: Scott McAllister
tags:
  - AI
  - Claude Code
  - Agents
  - Pokémon
draft: false
---

Two posts in a month? What's happening? This one's less "I built a tool you might use" and more "I let Claude play a GBA romhack for two weeks and watched it suffer". A harness, two runs, a cost bill, a few things that fell over, and a gym leader called Alice who I now have beef with.

Let's cook.

<iframe src="https://tenor.com/embed/4444793" title="I choose you" style="width: 100%; aspect-ratio: 1.33333; border: 0;" loading="lazy" allowfullscreen></iframe>

## I choose you

**Did you know a romhack a model has never been trained on makes a fun benchmark? Well now you and my token limits do!**

Why did I do it? Why not. Boredom, curiosity, amusement, does it matter? Pokémon Unbound is a ridiculously well made romhack, I'd seen videos of Claude finishing FireRed (which Unbound is based on) and I wanted to see how far Claude could get on something totally new to it.

The model router, memory mapping and cost analysis were of interest too, but they were a side quest.

I really just wanted to watch Claude struggle.

Let's get this straight up front. I didn't build this, Claude did. I gave it the requirements, the documentation on Unbound and some basic guidelines, and it did the research, the phased implementation plan, the RAM reverse engineering, the tools, the agent, the spectator page, and then played the game as well.

I did have to give it little hints here and there when it got stuck, but only a few times!

The experiment: could Claude do something fun, end to end? Pokémon was a great excuse.

Its own research reckoned 6 to 10 weeks to a first full attempt, if a human was doing it. It took two days.

## The setup

Claude kept the design thin on purpose. A verified state layer and deterministic tools, and the model does the thinking.

- mGBA runs the ROM. A Lua script serves a line protocol on port 8888. One client drives the emulator at a time, full stop.
- A Python bridge reads RAM into state JSON (party, position, map, dialog, battle), builds a collision grid off the live map, pulls species, move and item names out of the ROM, does the pathfinding, and exposes it all as MCP tools. Every RAM address has its evidence written down, because about half of what was assumed from vanilla FireRed turned out wrong on Unbound.
- A runner starts one Claude session per chunk, with a `CLAUDE.md` of player rules and a memory folder the agent keeps itself.
- A spectator page on port 8765 so I can watch. More on that below, because it's class.

The one rule I set Claude: everything changes in flight. Fixes hot-reload into the running MCP server, the agent's instructions get swapped on the next tool call, and the emulator never restarts. No savestate rollbacks either. If it gets stuck, it gets stuck for real.

### The player

The player is Haiku 5.5, in-game name Claude. That was the plan from the first commit, even though Claude's own research doc said Fable or Opus. Haiku's cheap and fast, and I wanted the clever stuff on call rather than on every turn. So Sonnet verifies, a strategist handles the routine "I'm stuck" escalations (Opus for the first five days, then Sonnet once I saw the bill), Fable is the expert and is meant to get one call per gym, and Opus refines the memory between chunks. A Haiku watcher reads over the agent's shoulder every 10 actions and a Sonnet verifier every 40, and neither can block play. They just leave notes.

The escalation is a ladder, not a free-for-all. The player asks the strategist when it's unsure (where next, what a hint means, team or move choices, a close battle, a puzzle), or when the harness tells it to after a watchdog keeps firing on the same map. The expert only comes in after two failed goes at the same thing, a trainer or a puzzle, and only after the strategist's already had a go. And before anything irreversible, forgetting a move, releasing a Pokémon, giving up, the player has to hand its plan to the verifier and wait. Game actions get blocked a few steps later if it hasn't.

Oh, and the rival's called Copilot. Obviously.

## Run one: Vanilla

Vanilla difficulty, fresh save, go.

Four badges. Dresco, Crater Town, Blizzard City, Fallshore City. 6,477 actions over about 25 hours, 38 catches, every one nicknamed, and about $50 of API-equivalent spend. The final team:

<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin: 32px 0;">
  <figure style="margin: 0; text-align: center;">
    <img src="https://img.pokemondb.net/sprites/x-y/normal/metang.png" alt="Ion the Metang" style="margin: 0 auto; border: 0; width: 96px; height: 96px; image-rendering: pixelated;">
    <figcaption style="margin-top: 4px;">Ion<br>Metang Lv 43</figcaption>
  </figure>
  <figure style="margin: 0; text-align: center;">
    <img src="https://img.pokemondb.net/sprites/x-y/normal/hariyama.png" alt="Brawn the Hariyama" style="margin: 0 auto; border: 0; width: 96px; height: 96px; image-rendering: pixelated;">
    <figcaption style="margin-top: 4px;">Brawn<br>Hariyama Lv 40</figcaption>
  </figure>
  <figure style="margin: 0; text-align: center;">
    <img src="https://img.pokemondb.net/sprites/x-y/normal/hariyama.png" alt="Bulwark the Hariyama" style="margin: 0 auto; border: 0; width: 96px; height: 96px; image-rendering: pixelated;">
    <figcaption style="margin-top: 4px;">Bulwark<br>Hariyama Lv 37</figcaption>
  </figure>
  <figure style="margin: 0; text-align: center;">
    <img src="https://img.pokemondb.net/sprites/x-y/normal/crobat.png" alt="Batty the Crobat" style="margin: 0 auto; border: 0; width: 96px; height: 96px; image-rendering: pixelated;">
    <figcaption style="margin-top: 4px;">Batty<br>Crobat Lv 39</figcaption>
  </figure>
  <figure style="margin: 0; text-align: center;">
    <img src="https://img.pokemondb.net/sprites/x-y/normal/watchog.png" alt="Pip the Watchog" style="margin: 0 auto; border: 0; width: 96px; height: 96px; image-rendering: pixelated;">
    <figcaption style="margin-top: 4px;">Pip<br>Watchog Lv 38</figcaption>
  </figure>
  <figure style="margin: 0; text-align: center;">
    <img src="https://img.pokemondb.net/sprites/x-y/normal/samurott.png" alt="Splash the Samurott" style="margin: 0 auto; border: 0; width: 96px; height: 96px; image-rendering: pixelated;">
    <figcaption style="margin-top: 4px;">Splash<br>Samurott Lv 37</figcaption>
  </figure>
</div>

Two Hariyama. Bold.

<iframe src="https://tenor.com/embed/18330675227822933772" title="Gary and his medals" style="width: 100%; aspect-ratio: 1.33121; border: 0;" loading="lazy" allowfullscreen></iframe>

### Whited out (the runner, not the Pokémon)

The Fallshore gym has a water puzzle with lily pads and Lapras. After about 300 steps on it the agent packed in and said, politely, "I'm stopping. I need a hint for this puzzle, a different approach, or a decision to end the run."

Fair enough. Except the runner didn't know what "stopping" meant. It started the next chunk, the agent said the same thing in one turn, and that repeated every 6 seconds. For 390 chunks.

I wasn't watching. The monitor stayed quiet because there were no errors, no watchdogs and no new steps, which is exactly the shape of "nothing's wrong". I noticed when the step count hadn't moved in half an hour. Then I looked at the console and it said $2,903 spent.

<iframe src="https://tenor.com/embed/12798360974943290422" title="Surprised Pikachu" style="width: 100%; aspect-ratio: 0.991968; border: 0;" loading="lazy" allowfullscreen></iframe>

Turns out a resumed `claude -p` session reports its running total, not the chunk's own cost, and the runner was adding the whole total up again every chunk. So chunk 389 says $9.62, chunk 390 says $9.63, the runner adds $9.62 plus $9.63, which is $19.25, times 390 chunks, carry the one, minus the square root of a Lapras... Whatever, numbers.

<iframe src="https://tenor.com/embed/5762800" title="Confused Psyduck" style="width: 100%; aspect-ratio: 1.33155; border: 0;" loading="lazy" allowfullscreen></iframe>

Chunk 390 cost a penny. The whole run to that point was $35.60, and the stop-loop itself about $3.

Two fixes: cost is now the per-chunk delta, and there's an idle breaker that stops the runner after three chunks with no game action.

### Puzzles are hard m'kay

The lily pads needed a hint, which goes into an `operator.md` the agent reads as pinned memory. This is the one that unblocked it:

```
- Fallshore City gym lily-pad room [14,15]: the other Lapras are NOT out of reach. The lily pads are paths you can use. You don't reach them from the bridge: the bridge passes over them (the pads are a lower level). Pads with gaps between them can be hopped over in any direction, up and down too.
- Fallshore gym lily pads (operator): go up, then right.
```

The bug underneath was that the pathfinder didn't know about map levels, so a "no path" answer couldn't say the pads were one floor down. Separately, warp events sitting on plain floor turned out to be arrival-only, so the router was trying to walk through warps that only work one way. Vanilla knowledge is a hypothesis on this game. Every time.

I stopped the Vanilla run on purpose just after badge four and kept the save as a test bed for the menu tools. Then on to the real test.

## Run two: Expert

Expert difficulty is a different game. Level caps by badge (20, 26, 32, 36 and up), trainers scale to your highest level, Ace Trainers come with 252 EVs in their two best stats, Shift battle style, and a "4 Items Only" rule in trainer battles. I set the puzzles to Easy because the test was battles and team-building, not me watching it push boulders for a day. More on that later. 🫠

It started from a true Expert new game, intro and all, with a $150 budget and a bootstrap of general knowledge from the Vanilla run's memory.

Badge one at step 1,265. Badge two at step 7,561. Badge three at step 24,887.

That gap is Alice.

### Alice

The gym leader that taught Claude humility.

<div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; margin: 32px 0;">
  <figure style="margin: 0; text-align: center;">
    <img src="https://static.wikitide.net/pokemonunboundwiki/a/ab/Spr_Alice.png" alt="Alice" style="margin: 0 auto; border: 0; width: 96px; height: 96px; object-fit: contain; image-rendering: pixelated;">
    <figcaption style="margin-top: 4px;">Alice</figcaption>
  </figure>
  <figure style="margin: 0; text-align: center;">
    <img src="https://static.wikitide.net/pokemonunboundwiki/9/93/085Dodrio.png" alt="Dodrio" style="margin: 0 auto; border: 0; width: 96px; height: 96px; object-fit: contain; image-rendering: pixelated;">
    <figcaption style="margin-top: 4px;">Dodrio</figcaption>
  </figure>
  <figure style="margin: 0; text-align: center;">
    <img src="https://static.wikitide.net/pokemonunboundwiki/a/ac/472Gliscor.png" alt="Gliscor" style="margin: 0 auto; border: 0; width: 96px; height: 96px; object-fit: contain; image-rendering: pixelated;">
    <figcaption style="margin-top: 4px;">Gliscor</figcaption>
  </figure>
  <figure style="margin: 0; text-align: center;">
    <img src="https://static.wikitide.net/pokemonunboundwiki/1/17/169Crobat.png" alt="Crobat" style="margin: 0 auto; border: 0; width: 96px; height: 96px; object-fit: contain; image-rendering: pixelated;">
    <figcaption style="margin-top: 4px;">Crobat</figcaption>
  </figure>
  <figure style="margin: 0; text-align: center;">
    <img src="https://static.wikitide.net/pokemonunboundwiki/7/71/127Pinsir.png" alt="Pinsir" style="margin: 0 auto; border: 0; width: 96px; height: 96px; object-fit: contain; image-rendering: pixelated;">
    <figcaption style="margin-top: 4px;">Pinsir</figcaption>
  </figure>
</div>

Claude sent the same six Pokémon into the fray 40 times. White out, heal, repeat. It was quite entertaining to watch, but it exposed a bug. The agent was reporting that it was blocked, "Blizzard gym blocked (Alice, 40 losses, $150)" sat right there in its memory, but rather than change anything, it just kept retrying.

<iframe src="https://tenor.com/embed/22740676" title="Oshawott getting flattened" style="width: 100%; aspect-ratio: 1.78771; border: 0;" loading="lazy" allowfullscreen></iframe>

Attempt 41 did it. No expert call, just two strategist calls, the second one literally titled "Alice battle plan: 41st attempt", and a team shuffle through Quarry, Frost, Frostbite and Glacie before Ferro's Metal Claw and Flicker's Charge Beam against her flyers finished it. Badge three. Thirteen minutes, start to finish, after however many hours of the other 40.

The expert is supposed to be capped at one Fable call per gym. It wasn't. Nine expert calls in the run, five of them on Alice, and it still lost 40 times. The cap counts expert calls per badge count (the nearest thing the harness has to "gym") and checks once at the start of each chunk, so two calls inside one chunk sail straight through. Probably what happened, not confirmed, not going to be. Even with five goes of the big brain model it couldn't tell Haiku to swap the team.

### Frost Mountain

About 3,000 of the run's 32,036 steps went on one mountain. There's a boulder route that needs Strength and the Fall Badge, neither of which it had, and it kept trying it. It knew, too. It had written it in its memory notes. I didn't read them fast enough, and it ran for hours. That one's on me.

The walkthrough is a gated last resort. The gate opens after enough actions with no progress, and at that point it had been open for ages: 3,169 actions since progress, 13 watchdogs, expert and strategist both consulted. Then I dropped in a hint telling it to stop the boulder route, and the hint reset the gate's clock. Closed it for another 150 actions. My hint made it worse.

The fix is a one-liner. A hint that only redirects the agent no longer counts as progress:

```python
def is_redirect(hint):
    """True if every line of an OPERATOR HINT note (lines joined by ' | ') only redirects the agent."""
    return all(REDIRECT.search(ln) for ln in hint.split(" | ") if ln.strip())
```

### The run so far

| | | | |
|---|---|---|---|
| Badges | 3 of 8 | Play time | 190h 39m |
| Steps | 32,036 | Whiteouts | 113 |
| Chunks | 515 | Output tokens | 6,788,846 |
| Catches | 55 | Cost | $118.16 of a $150 budget |

And where the button presses went:

| Tool | Calls | Tool | Calls |
|---|---|---|---|
| `press_buttons` | 9,831 | `wiki_search` | 1,899 |
| `get_state` | 8,734 | `travel_to` | 1,538 |
| `walk_to` | 7,820 | `get_screenshot` | 1,355 |
| `advance_dialog` | 5,141 | `switch_to` | 1,310 |
| `fight` | 4,510 | `run_away` | 481 |

The harness reviewers on top of that were cheap: 667 Haiku watcher calls for about 60p and 331 Sonnet verifier calls for about $6.40.

The plan's own test for the second run was "a bootstrapped second run beats the first on steps per badge". Vanilla was about 1,600 steps a badge, Expert about 10,700. So no, and I can't tell you if the bootstrap helped or hurt, because the difficulty changed, 3,000 steps went up a mountain, and the bootstrap only carried general knowledge. Not a fair fight.

## Where the money went

$118.16 is the runner's own total. There's a per-model breakdown as well, but only about 13% of chunks carry one, so I'm not quoting percentages.

What I can say is the Fable expert's thinking was the big one. The costliest single chunk was $7.49 with about 73k thinking tokens. One chunk. For context, the Haiku player, the one actually pressing the buttons, was around $6 for the whole run. The expert's effort got dropped to medium after that and I've no idea yet whether it plays worse for it.

Sessions rotate at 80k context, and only in the overworld, never mid-battle, mid-dialog or in a menu:

```python
def rotate_reason(context, now, town):
    if now.get("mode") != "overworld" or context <= TOWN_ROTATE_MIN:
        return None
    if context > CONTEXT_LIMIT:
        return "context"
    return "town" if new_town(town, now.get("map") or "") else None
```

That rotated 706 times. 560 on context, 146 on entering a new town. Whether that's hurting it, no idea either.

## The spectator

This is the bit I'd keep if I threw everything else away.

![The spectator at the end of the Expert run: reasoning, party, memory map, learnings and the model router](/images/claude-played-pokemon-unbound/spectator.webp)

It's a single page on port 8765 that tails the run's transcripts and logs, and polls the emulator through a read-only probe that refuses anything but reads. It never touches the game. Left to right:

- Claude's reasoning, live, with each tool call inline. That's where I watched it apologise for being stuck on the save screen 14 times in a row.
- Trainer and party. Location, badges, money, Pokédex, play time, cost, output tokens, and a card per party member with HP, stats, held item and EXP to go.
- The memory map. Every file in the agent's memory folder as a graph: files, maps, species, nicknames, NPCs, missions, and the links between them. 12 files, 423 nodes, 848 links by the end. Watching that grow over two weeks was weirdly satisfying.
- Learned something new. A feed of every line the agent or the refiner adds to its memory, so you can see it work things out. "fight() on a 0-PP move silently does nothing: check PP." Yes mate.
- The model router. Which model is doing what, and how often, with the estimated run cost beside it. By the end: Haiku watcher x846, Sonnet verifier x221, strategist x234, refiner x64, Fable expert x5.

The page can't touch the game. The only bridge client it has is this:

```python
class ReadOnlyProbe:
    """The only bridge client the UI has: reads, nothing that steps, presses, loads or saves."""
    ALLOWED = {"read8", "read16", "read32", "range"}
    read8, read16, read32, range = Probe.read8, Probe.read16, Probe.read32, Probe.range
```

Hover a stat pill and you get its EVs out of 510. When a stat or its EVs go up between two polls the pill flashes green for three seconds, so you can see a win land on the party. Members are matched by nickname and species, so reordering the party doesn't set it off. Little things.

It can replay a finished run at 20x too, and it has a mock mode with a scripted fake run (battles, a catch, every router handoff, a badge) for testing the page without an emulator. Claude built that for itself so it could check its own UI, along with 16 offline tests for the server. Fair play.

## Things that fell over

### A key item called …?w?er

The agent kept noting a "garbled key item" in its bag and never worked out what it was. The bag listing had names like `??w?tyGoggle`. Unbound stores long item names as a ROM pointer in the first four bytes of the entry, and the decoder was reading the pointer as text. 33 items affected. The mystery key item was the Dowsing Machine, which it had been carrying about unused the whole time.

### The monitor that cried wolf

Every time the monitor started it said "runner NOT running". The runner was running. PowerShell 5.1 returns nothing for `.Count` on a single object unless you wrap the pipeline in `@(...)`. One process, empty count, false alarm, every single restart. That's handy.

```python
cmd = ("@(Get-CimInstance Win32_Process -Filter \"name='python.exe'\" | "
       "Where-Object { $_.CommandLine -match 'agent[\\\\/]run\\.py' }).Count")
```

### It kept playing after I stopped it

I stopped the runner. At 12:58 the log was still updating. Stopping the runner's Python process didn't stop its `claude.exe` child, which carried on playing Pokémon by itself for about ten minutes. I killed it by hand. The runbook says to stop both, and I hadn't. There's still no code fix for that, it's just a rule now. Some real Lower Decks energy.

## Saving... don't turn off the power

That's how it ended. The game froze on the save screen at Frost Mountain. Input stopped reaching it, the idle breaker (the one from the Vanilla run, finally earning its keep) stopped the runner after three empty chunks, and I shut the emulator down. Never diagnosed. No screenshot of it either, the agent's screenshots went to the session and never to disk, so you'll have to take the spectator's word for it:

> I'm stopping here because the game is stuck on a save screen and I can't get past it with the tools I have.

Expert run parked at three badges and $118.

## What's next?

Nothing. Experiment over, fun was had, repo's archived. There's a list of things I'd fix if I ran it again (raw `KeyError`s leaking to the agent, the expert cap that didn't cap, the save screen, the walkthrough gate) and I'm not going to.

## Summary

Claude built itself a harness in two days and then played Pokémon Unbound with it. Four badges on Vanilla for $50, three on Expert for $118, 32,000 steps without the emulator restarting once. It also lost to the same woman 40 times and spent hours walking into a boulder. I got what I came for.

Repo's [here](https://github.com/scotscottmca/ClaudeUnbound) if you want a swatch.

Thanks for reading!

<iframe src="https://tenor.com/embed/27553546" title="Pokémon anime salute" style="width: 100%; aspect-ratio: 1.33333; border: 0;" loading="lazy" allowfullscreen></iframe>

<!-- SHOTS:
2. Sprites hotlink pokemondb for now; drop the five PNGs into public/images/claude-played-pokemon-unbound/ if you'd rather host them
3. Optional: console showing "$2903 spent" if it's in a log
-->
