---
name: blog-post
description: Turn a brain dump into a draft blog post in Scott's voice. Takes any pile of notes, a README, a Slack thread, error dumps, whatever, works out the title, shape and tags itself, and drafts into src/content/posts/ with GIF and screenshot placeholders, following docs/writing-style-guide.md. Use for "write a blog post about", "turn this into a post", "blog this", or /blog-post.
user-invocable: true
argument-hint: "<brain dump — paste anything>"
---

# Blog post

Turns a brain dump into a first draft post that sounds like Scott, with the
media slots marked, ready for review. Not a publish-ready piece.

## 1. Take the dump

`$ARGUMENTS` is the brain dump. If it's empty, ask for it in one line
("Paste the brain dump — notes, a README, a thread, error text, anything")
and wait. No form, no fields. Everything else is inferred.

## 2. Load the voice

Read, in full, every time:

1. `docs/writing-style-guide.md`
2. `docs/authoring-guide.md`

Then decide the **shape** from the guide's three shapes and read the two
exemplar posts for it, so the actual voice is in context before drafting:

| Shape | Signal in the dump | Read these |
|---|---|---|
| Story | a curiosity, a mystery, a thing built, a reveal | `src/content/posts/Sleeping120MoreSeconds.md`, `src/content/posts/Project-Clippy.md` |
| How-to | steps, settings, scripts, "how to configure" | `src/content/posts/ConfigMgr-Scripts.md`, `src/content/posts/CollectingLogsUsingIntune.md` |
| Reference | a list or table with a short intro | `src/content/posts/ErrorCodes.md` (first 80 lines) |

Don't skip the exemplars. The guide describes the voice; the posts are the
voice.

## 3. Work out what's in the dump

Pull out, without writing prose yet:

- **The story beats**: what kicked it off, what was tried, what didn't work,
  who helped, the moment it clicked, the punchline.
- **The facts**: commands, registry keys, error text, versions, URLs, names
  of things. These are the only facts the post may contain.
- **People**: anyone named, with a handle or link if given.
- **The register**: first-person notes, or project-page prose (third person,
  feature lists, "X is a…")? See the guide's "Two registers" table.
- **Title, tags, slug**: infer them. Titles are casual but say what the
  post is about ("Hitting the max application limit in Intune", "Sleeping
  120 More Seconds"). Slug is short and hyphenated (`Intune-App-Limit`).

## 4. Ask once, only if the human bits are missing

If the dump has story beats and at least a hint of first person, **skip this
step and draft**.

If it's in project-page register with no story beats at all (the guide's
"README wearing a post's clothes" case), a post can't be written without
inventing things, so ask **one** bundled question and wait:

> Got the facts. To make it a post rather than a README I need a few human
> bits — answer any, skip any, or say "go" and I'll draft with gaps marked:
> - What kicked this off? (the annoyance, the customer thing, the itch)
> - What went wrong first / what did you throw away?
> - Who helped, and with what?
> - What's the punchline — the moment it clicked or the bit that surprised you?

Ask this at most once. On "go", draft anyway and mark each missing beat with
`<!-- gap: … -->` where it would sit.

## 5. Draft

Follow the shape's skeleton from the guide. Non-negotiables:

- **Paragraphs of one or two sentences.** Whitespace is the rhythm.
- **First person, present-day Scott.** Contractions, "So", "But", "Well,",
  "Let's", one exclamation mark per section on something mundane, `:)` on
  the sign-off. British spelling where it comes naturally.
- **The mess is the post.** The first attempt, the dead end, the thing
  deleted. Never present the finished thing as if it arrived finished.
- **Humour by deflation, one or two beats per post**, placed where the
  feeling is: the anticlimactic reveal, the over-investment owned, the
  tool you hate-and-love. Not a joke per paragraph, never at the reader.
- **Credit by name with a link** for anyone in the dump. If nobody's named,
  say so in the hand-back; don't invent a helper.
- **Only facts from the dump.** No versions, results, measurements, links or
  quotes that weren't given. "The point is to spend fewer tokens" stays as
  intent; it does not become "it's already noticeably cheaper".
- **No `### 1.` numbered feature sections, no Piece/Role tables, no "Key
  takeaways".** Those are project-page furniture.
- **Headings** from the guide's three flavours: a question, the step as a
  noun, or a bit of fun. `Summary` only if there's one line to say (or a
  GIF).
- **Callouts** are `> 💡 **Note**` only, zero to two per post.
- **Ending** is one of the guide's listed endings, verbatim in spirit:
  "Thanks for reading :)", a GIF-only Summary, a promise to update, "hit me
  up on Twitter", the open-an-issue footer.

### Media

Leave the space; don't invent the file.

**Reaction GIFs** (Story shape only, max four, only in the guide's four
positions: under a heading as opener, right after the punchline, as the
whole Summary, as the last line after thanks). Reuse the repo library from
the guide's table when the beat matches, by its real path:

```markdown
![nap](../../assets/images/Sleeping120MoreSeconds/nap.gif)
```

For a beat with no match, a placeholder above a real image line:

```markdown
<!-- gif: someone frantically refreshing a page -->
![refresh](/images/<slug>/refresh.gif)
```

**Screenshots** (every step of a How-to; evidence shots in a Story):

```markdown
<!-- screenshot: the Create Script dialog with name and description filled in -->
![Create Script](/images/<slug>/1_create_script.png)
```

Number them in step order. Alt text is a short label. Narrate the step in a
sentence before the image; don't describe the image after it.

**Screen-recording GIFs** in a How-to are introduced with "In this gif we
do the following:" and a bullet list.

## 6. Self-check before handing back

Scan the draft and fix anything that fails:

- Any paragraph over three sentences? Split or cut.
- Any `### 1.`, any Piece/Role table, any "Key takeaways", "In conclusion",
  "seamless", "leverage", "robust", "powerful"? Remove.
- Any result, number, version, person or link not in the dump? Remove.
- At least one dead end or first-attempt admitted, or a `<!-- gap -->`
  marking where it should be?
- At least one media line (GIF or screenshot)?
- Does the ending match one from the guide?
- Does it read like Scott typed it in one go, or like a copy desk cleaned it?

## 7. File, build, hand back

- `src/content/posts/<Slug>.md`, front matter per the authoring guide:
  `title`, `date` = today, `author: Scott McAllister`, `tags` (3–6, Title
  Case, matching existing tags where they exist), `unlisted: true` (builds
  on a PR preview for live review, hidden everywhere else).
- Run `npm run build`. Fix any schema error it reports.
- Reply with, in this order and nothing else:
  1. The file path and the shape chosen.
  2. The full draft, rendered.
  3. **To capture**: the screenshot/GIF placeholders as a short list.
  4. **Gaps**: any `<!-- gap -->` markers and anything not credited or not
     confirmed, one line each.
  5. One alternate title, if a better one came up.

Then stop. It's a draft for Scott to edit; he'll say what to change.
