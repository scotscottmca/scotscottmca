# Usage backfill

`usage-backfill.json` holds billing cycles typed in by hand, for the ones the
Claude Code transcripts can no longer recover (they're pruned after 30 days by
default). The `/usage` page and the gist's `usage.md` both read it.

A row here **replaces** the feed's row for the same `since`, so you can also use
it to correct a cycle that was only partly counted. Every field except `since`
and `to` is optional; leave one out and the page shows `–`.

```json
[
  {
    "since": "2026-08-10",
    "to": "2026-09-09",
    "sessions": 120,
    "prs": 34,
    "tokens": 410000000,
    "spend": 812.5,
    "turns": 9100,
    "hours": 140,
    "commits": 210
  }
]
```

`since` is the renewal day the cycle starts on; `to` is the day before the next
one. `spend` is in USD.
