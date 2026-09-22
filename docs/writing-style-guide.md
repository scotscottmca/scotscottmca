# Writing style guide

How Scott's blog posts sound, taken from the ten posts in
`src/content/posts/`. Every rule below is backed by something in one of those
posts; when in doubt, open the post named and copy what it does. Front
matter, folders and Markdown mechanics are in
[`authoring-guide.md`](./authoring-guide.md).

## Two registers, one site

The site has two kinds of writing and they sound nothing alike.

| | Blog posts (`src/content/posts/`) | Project pages (`src/content/projects/`) |
|---|---|---|
| Person | First. "I poked around at it a bit." | Third. "**away-team** is a crew of…" |
| Shape | A story or a walkthrough | "The idea / What it does / How it works" + a Piece/Role table |
| Feel | Chatty, GIFs, exclamation marks, typos left in | Cool, precise, product-page |
| Who's in it | Named people, Twitter handles, thanks | Nobody |

**This guide is for posts.** If source material arrives in the project-page
register (a README, a pitch, a feature list), it has to be *translated* into a
post, not reformatted under post headings. A numbered feature list with "Six
things do that" is a project page wearing a post's clothes. The translation
needs the human ingredients: what kicked it off, what went wrong first, who
helped, and the punchline. If those aren't in the material, ask for them.

## The three post shapes

Every post is one of these. Pick the shape first; it decides the skeleton.

### Story: "I got curious about a thing"

`Sleeping120MoreSeconds.md`, `Project-Clippy.md`, `Intune-App-Limit.md`

A personal investigation with a reveal. Skeleton:

1. Opener (a GIF, or a bold one-liner, or "Hey! This is my first ever blog
   post, so bear with me!")
2. The itch — what annoyed or intrigued you and for how long ("For the last
   few years, Something that has always annoyed me was…")
3. The dead ends — what you tried that didn't work ("tried to monitor SUSDB
   for changes and Procmon for file changes, as well as asking some
   colleagues")
4. Who cracked it, or the moment it clicked
5. The reveal, deflated ("And that's it. All this time wondering about it
   and it is literally just taking a wee nap.")
6. A bonus section if there's a trick to share ("Brucie Bonus")
7. A one-line or GIF-only Summary, then thanks and credits

GIF-heavy (4 in each of Sleeping120 and Project-Clippy). Runs 500–1,000
words.

### How-to: "here's how to do the thing"

`ConfigMgr-Scripts.md`, `CollectingLogsUsingIntune.md`,
`ExpandingIMELogRetention.md`, `Organizationalmessages.md`,
`GraphAndCSharp-pt1.md`, `GraphAndCSharp-pt2-1-Authentication.md`

A walkthrough with a screenshot per step. Skeleton:

1. Why this matters, in first person, from your own day job ("My day-to-day
   role sees me looking at logs for Intune-managed devices…")
2. "Prerequisites" / "Requirements" as a short bulleted list with links
3. Steps as `##` sections named after the action (Create Script, Approve or
   Deny Script, Run Script), each with a screenshot
4. A "Gotchas" section if you hit something ("I encountered an issue on my
   client when watching scripts.log")
5. Scripts in Detection/Remediation pairs when it's Intune
6. "What's next?" or "Additional resources" / "Resources", then thanks

Screenshot-heavy (ConfigMgr-Scripts has 17). Reaction GIFs are rare here;
screen-recording GIFs are common. Runs 600–1,500 words.

### Reference: "here's a list"

`ErrorCodes.md`

A chatty two-paragraph intro, a helper script, then the table. Rare.

## The voice, specifically

### Rhythm

- Paragraphs are one or two sentences. Many are a single line. A
  four-sentence paragraph is unusual. Let the whitespace breathe.
- Sentences start with "So", "But", "And", "Well," constantly. "So I
  reached out to her, piqued her curiosity and she delivered." "Well,
  thankfully we can fix this relatively easily."
- When excited, run-ons are allowed and on-brand: "All this led me to sink
  numerous hours into various different rabbit holes and had me waking up at
  3am with a eureka! moment more times than I care to admit and I sort of
  ran away with this project and its been a bit of a rollercoaster for me
  but I feel I've learned quite a lot". Don't break that into four tidy
  sentences.
- Two-word section openers: "Logs, Again!"
- Rhetorical question, then the answer: "But how to get them there?" /
  "stored in GitHub anyway, right?"
- Exclamation marks land on mundane facts, roughly one per section: "all
  that is needed is a registry key addition!", "Here you can see it set to
  10 minutes!", "Just like that, you've removed Chrome from all your
  devices!"

### Idiom

Scottish/British, lightly. These are real and reusable:

- "a wee nap", "leave a nice wee message"
- "a dam sight better", "a tonne of notes", "hit me up"
- "telling me I'm a sausage when I was over-complicating something"
- "Brucie Bonus" (as a section heading for the extra trick)
- "Annnnnnnnnnnnnd that's that."
- "longer than your arm!"
- British spellings where they come naturally: licence, generalised,
  summarise. Product names keep their own spelling (Organizational
  messages).
- "Lets" without the apostrophe happens as often as "Let's". Both fine.

### Humour: deflation and nerd-pride

The jokes are never at the reader and never at a product's expense beyond a
mild wince. They come from:

- **Deflating the mystery.** Years of wondering, and the answer is "it is
  literally just taking a wee nap."
- **Owning the over-investment.** "A few of us at Patch My PC were super
  invested in this, and the idea of some super niche stickers was float. So,
  we did." (Then a photo of the sticker.)
- **Love/hate for tools.** "I was introduced to MVVM and WPF by Cody and Ben,
  and I can safely say I hate and love them both equally for it."
- **The self-aware opener.** "While this post isn't about how you could
  sleep 120 more seconds, it may actually help you fall asleep."
- **Parenthetical honesty.** "(I can't remember which version this was but
  it was > v0.1 but < v1.0)", "(I hope)", "[Insert other generic reason
  here]", 'The user is "busy."'
- **One emoji shortcode as a wince**: "VB logon scripts and scheduled tasks
  :nauseated_face:"

One or two of these per post, placed where the feeling actually is. Never a
joke per paragraph.

### Humility and hedging

- "I doubt that it's perfect, but it's functional."
- "Authentication is a dark art in my opion, and it can definitely get wild."
- "Not much to summarize other than…"
- "not that you should though. 120 seconds is usually enough."
- "This is a bit of a personal one, because I've been really invested in it."
- "Some of these tests may not be applicable to your environment"

### Emphasis and emoticons

- `:)` after an ask or a sign-off: "just reach out to me :)", "Thanks for
  reading :)", "Run it and see! :)"
- Bold for UI paths and the thing you must not miss: **Software Library** >
  **Scripts**; "**Make sure you copy the client secret and keep it safe!**"
- Bold on `### **Subheadings**` in Project-Clippy. Optional.

### Rough edges

Typos survive to publish ("opion", "featuers", "enviornments",
"Registartion"). A word after a comma sometimes gets a capital ("Firstly,
Lets add", "Currently, There are 3 areas"). Don't manufacture mistakes, but
don't polish every sentence into copy-desk grammar either. If a line reads
like it was typed in one go, leave it.

## Openings

Two openers, roughly half and half:

**Bold one-liner** (2022–early 2023 posts): a single bolded sentence before
the first heading, selling the post in Scott's words.

```markdown
**Did you know that there is a maximum number of apps you can publish to Intune? Well you do now!**

**Check out this cool tool I helped write that tells you what's wrong with your WSUS configuration and how to fix it**

**Literally a list of ConfigMgr and Intune error codes, as well as how to look up what they mean**
```

**Straight into a `##`** (mid-2023 on): first heading is the first line,
often with a GIF directly under it, then the personal reason for the post.

```markdown
## Snooze

![snooze](../../assets/images/Sleeping120MoreSeconds/snooze.gif)

While this post isn't about how you could sleep 120 more seconds, it may actually help you fall asleep.
```

Either way, within three sentences the reader knows the real reason you're
writing — a thing at work, a curiosity, a years-long annoyance. Never "In
this post we will cover".

**Series posts** open with the parts list, current part bolded and marked
`(You Are Here)`, and end with a "Part N" section pointing forward.

**Time-stamp caveats go up top**: "At the time of writing this, ConfigMgr
2211 has a bug where you cannot add scripts. So the following screenshots
are from CM2203, and I'll update them when the bug is resolved". "At the
time of writing" appears in four posts. Use it when something is in flux.

## Headings

`##` for sections, `###`/`####` for steps within them. Title Case is
inconsistent and nobody cares ("Finding The Answer", "What can we do about
it?"). Three flavours, all real:

- **Questions**: What are we talking about here? / What can we do about it?
  / What now? / Why do we need logs? / How does Collect diagnostics work? /
  What's next?
- **The step, as a noun**: Prerequisites / Create Script / Run Script /
  Detection / Remediation / Resources
- **A bit of fun**: Snooze / Brucie Bonus / Actually do something cool! /
  Doing the thing / The End

Avoid Introduction, Overview, Conclusion, Key Takeaways. "Summary" is fine
and is usually one sentence or a GIF.

## Walking through steps

"Let's" and "we" pull the reader along: "Let's import a script", "So let's
run this, by pressing F5", "We can add in this key and make it shorter or
longer!"

Narrate, then show. One or two sentences saying what's about to happen, then
the screenshot, then move on. Don't restate the screenshot in prose.

Bulleted sub-steps are fragments: "Give it a name / Remove the default
User.Read permission / Grant consent for that permission change".

For a screen-recording GIF: "In this short gif, we can see how quickly you
can import a script…" or "In this gif we do the following:" followed by the
bullets.

## Screenshots

- One per step in a how-to. Pairs are common: the registry key, then the log
  line proving it took effect.
- Alt text is a short label, not a sentence: `Create Script`, `Sync Grace
  Period 10 Minutes Registry`, `Collect Diagnostics`.
- Filenames are numbered in step order: `1_Create_Script.png`,
  `2_3_Import_Script.png`, `CollectDiagnostics_4.png`.
- Evidence shots are a thing: a screenshot of the tweet or DM where someone
  answered the question (`Twitter_Response.png`).
- Side-by-side comparisons go in a two-column table of images.

When drafting without the images to hand, leave the real image line in
place with a comment above it saying what to capture:

```markdown
<!-- screenshot: the Create Script dialog with the name and description filled in -->
![Create Script](/images/configmgr-scripts/1_create_script.png)
```

## GIFs

Two kinds. Don't confuse them.

**Reaction GIFs** appear in Story posts only, four per post at most, and
only in these four positions:

1. Directly under a section heading, before any text, as the opener
   (`snooze.gif` under "## Snooze", `surprise.gif` under "## Brucie Bonus").
2. Immediately after the punchline or reveal sentence (`nap.gif` right after
   "it is literally just taking a wee nap."; `breath.gif` right after "I
   hate and love them both equally for it.").
3. As the entire Summary section, with no text (`sleep.gif`).
4. As the very last line after the thanks (`salute.gif`).

Never mid-explanation, never captioned, alt text is one word.

Reaction GIFs already in the repo, reusable by path:

| Beat | Path |
|---|---|
| dozing off / boring | `../../assets/images/Sleeping120MoreSeconds/snooze.gif` |
| relief / the anticlimax | `../../assets/images/Sleeping120MoreSeconds/nap.gif` |
| the end, lights out | `../../assets/images/Sleeping120MoreSeconds/sleep.gif` |
| surprise / bonus reveal | `../../assets/images/Sleeping120MoreSeconds/surprise.gif` |
| deep breath / exasperation | `../../assets/images/project-clippy/breath.gif` |
| "just do it" / go try it | `../../assets/images/project-clippy/doit.gif` |
| sign-off salute | `../../assets/images/project-clippy/salute.gif` |

For a beat none of these fit, leave a placeholder the same way as a
screenshot: `<!-- gif: someone frantically refreshing a page -->` above a
real image line.

**Screen-recording GIFs** appear in How-to posts, narrated ("In this gif we
do the following:") and treated like screenshots.

## Code and error dumps

- Fence with a language: `powershell` (most), `csharp`, `xml`, `json`.
- Paste the whole error, verbatim, in a fence. Intune-App-Limit has two
  35-line JSON error dumps and that's the point.
- Comments in code are chatty and explain why: `// Catch any errors that may
  occur instead of dumping them into the nether`, `# Check if keys are
  already set`.
- Secrets are `********` or `xxxxxx`. Demo-tenant IDs are shown as-is.
- Intune scripts come as a `### Proactive Remediation` section with
  `#### Detection` and `#### Remediation` fences, then the Intune.Training
  video link.
- `#region` blocks in C#.

## Callouts

Only one form appears in the posts, and it's always the 💡 with **Note**,
even when it's a warning:

```markdown
> 💡 **Note**
>
> Messages may start delivering up to 24 hours after scheduling.
```

One or two sentences inside. Zero to two per post.

## People, credit and links

Every post that involved anyone names them, links their Twitter/X, and says
what they did:

- "It was suggested that I ask Meghan Stewart ([@WSUSN3RD](https://x.com/WSUSN3RD)), THE WSUS Nerd."
- "[Jake Shack](https://twitter.com/shackelfjaco) threw together a quick script"
- "Just want to add an extra thank you to Ben and Cody for answering my '5 minute questions' that turned into multiple hour long conversations"
- "a [script](…) written by [Adam Cook](https://twitter.com/codaamok) which '*searches the registry…*'"

Community blogs get linked generously, usually in a closing "Additional
resources" / "Resources" list of bare links (ByteBen, MSEndpointMgr, imab.dk,
Anoop, Intune.Training). Microsoft docs are linked inline as "[Client
credential flow documentation](…)" or just "[here](…)".

Never invent a person or a link. If the material doesn't say who helped,
ask.

## Endings

Any of these, alone or stacked:

- `## Summary` with one sentence: "Not much to summarize other than it can
  be useful to keep more than the default number of retained logs!"
- `## Summary` that is only a GIF.
- "Thanks for reading :)" / "Thanks for reading!" on its own line.
- `## The End` → "That's pretty much it! If you want to know more, hit me up
  on [Twitter](…)" → the thank-yous → `salute.gif`.
- A promise: "if I do I'll be sure to update this post :)", "There will be
  part 2 of this".
- The footer link: "Want to see something else added? <a
  href="https://github.com/smcallister594/scotscottmca/issues/new">Open an
  issue.</a>"
- `## Logging an issue` / `## Documentation` / `## Download` as three tiny
  link sections when the post is about a tool.

Never a "Key takeaways" list. Never "In conclusion".

## What the voice avoids

- Marketing words: game-changing, seamless, unlock, leverage (as a verb),
  robust, powerful.
- Passive voice for things a person did. "Meghan shared with me", not "it
  was shared".
- Presenting the finished thing as if it arrived finished. The winforms
  version, the deleted rewrite and the 3am eureka are the post.
- Claims of results that weren't measured. If the material says "the point
  is to spend fewer tokens", the post says that; it doesn't say "it's already
  noticeably cheaper".
- Numbered `### 1.` feature sections. That's a README.
- The project-page register in general (see the table at the top).

## Before / after

Source material in project-page register:

> The investigator cannot edit, and the orchestrator's Bash is read-only, so
> each context window holds only what that job needs. On Claude Code both
> are enforced by a hook, not trusted to the prompt.

The same thing as a post:

> The first version trusted the prompt to keep the investigator's hands off
> the code. It did not keep its hands off the code. So now on Claude Code
> there's a hook that actually blocks the edit, and the investigator can
> shout about the bug all it likes but it can't touch it.
>
> ![breath](../../assets/images/project-clippy/breath.gif)

The second one only works if the first version really did misbehave. That's
the bit to ask for.
