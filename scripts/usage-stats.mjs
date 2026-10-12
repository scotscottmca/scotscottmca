#!/usr/bin/env node
// Collects Claude Code + GitHub activity for the hidden /usage page and
// publishes it as a gist the page fetches client-side.
//
//   node scripts/usage-stats.mjs            # print JSON to stdout
//   node scripts/usage-stats.mjs --publish  # also push to the gist (USAGE_GIST_ID)
//
// Claude data comes from the local transcripts in ~/.claude/projects (one
// JSONL per session); live sessions from the pid files in ~/.claude/sessions.
// GitHub data comes from the authenticated `gh` CLI. Every path is built from
// os.homedir(), so the same script reads %USERPROFILE%\.claude on Windows.
// Scheduled every 15 minutes by launchd on a Mac (scripts/com.scotscottmca.usage.plist)
// and by Task Scheduler on Windows (scripts/usage-task.ps1).
//
// Every figure is cut three ways — last 7 days, last 14 days, and the billing
// cycle so far (anchored on USAGE_CYCLE_DAY, default the 1st) — so the page
// switches window without refetching. The widest window decides how far back
// the transcripts are read.
//
// Past billing cycles go in `history`, newest first. A cycle is read once, after
// it closes, and then frozen into this device's file: Claude Code prunes old
// transcripts, so the frozen copy is what keeps the history alive. Only cycles
// not yet frozen are read again on each run.
//
// Transcripts are per-machine, so every device publishes its own
// usage-<device>.json to the gist and each run rebuilds the merged usage.json
// the page reads. Run --selftest to exercise the merge.

import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, basename } from 'node:path';
import { homedir, hostname, tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';

const HOME = homedir();
// A name that moves double-counts the device: the gist keeps both files and the
// merge sums them. A Mac's hostname comes from whatever network it is on (it
// published as both `mac` and `PMPC-L4KGJYT4J9`), so the first name this
// machine gets is saved to ~/.claude/usage-device and reused from then on.
// USAGE_DEVICE still wins when set.
const DEVICE_FILE = join(HOME, '.claude', 'usage-device');
const DEVICE = (() => {
  const clean = (s) => s.trim().replace(/[^a-zA-Z0-9-]+/g, '-');
  if (process.env.USAGE_DEVICE) return clean(process.env.USAGE_DEVICE);
  try {
    const saved = clean(readFileSync(DEVICE_FILE, 'utf8'));
    if (saved) return saved;
  } catch { /* first run on this machine */ }
  // First label only: the rest is the network's suffix (.local, .fritz.box).
  const name = clean(hostname().split('.')[0] || 'unknown');
  try { writeFileSync(DEVICE_FILE, name + '\n'); } catch { /* read-only home: fall back to the hostname each run */ }
  return name;
})();
const NOW = Date.now();
const DAY = 86400000;
const GITHUB_USER = 'scotscottmca';
const GIST_ID = process.env.USAGE_GIST_ID || '';
// Day of the month the subscription renews. Past the 28th there is no anchor in
// February, so that is where it clamps.
const CYCLE_DAY = Math.min(28, Math.max(1, Number(process.env.USAGE_CYCLE_DAY) || 1));
// Closed billing cycles kept for the history table.
const HISTORY_CYCLES = 12;

// USD per million tokens: [input, output, cache write, cache read].
// ponytail: hand-copied list price table; refresh when models change.
const PRICES = {
  'claude-fable-5-1': [10, 50, 12.5, 0.25],
  'claude-fable-5': [10, 50, 12.5, 1],
  'claude-opus-5': [5, 25, 6.25, 0.5],
  'claude-opus-4-8': [5, 25, 6.25, 0.5],
  'claude-opus-4-7': [5, 25, 6.25, 0.5],
  'claude-opus-4-6': [5, 25, 6.25, 0.5],
  'claude-sonnet-5': [2, 10, 2.5, 0.2],
  'claude-sonnet-4-6': [3, 15, 3.75, 0.3],
  'claude-haiku-4-5': [1, 5, 1.25, 0.1],
};
const priceFor = (model) =>
  PRICES[model] ?? PRICES[Object.keys(PRICES).find((k) => model?.startsWith(k))] ?? PRICES['claude-opus-5'];

const day = (ts) => new Date(ts).toISOString().slice(0, 10);

// Windows start at a UTC midnight so a window's totals cover exactly the days
// the page draws as bars — no half-day hanging off the oldest end.
const TODAY = Date.parse(day(NOW) + 'T00:00:00Z');
const cycleStart = (now) => {
  const d = new Date(now);
  const thisMonth = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), CYCLE_DAY);
  return thisMonth <= now ? thisMonth : Date.UTC(d.getUTCFullYear(), d.getUTCMonth() - 1, CYCLE_DAY);
};
const CYCLE_START = cycleStart(NOW);
// The current windows run up to now, so they have no end.
const WINDOWS = [
  { key: '7d', label: 'Last 7 days', days: 7 },
  { key: '14d', label: 'Last 14 days', days: 14 },
  { key: 'cycle', label: 'Billing cycle', days: Math.round((TODAY - CYCLE_START) / DAY) + 1 },
].map((w) => ({ ...w, sinceMs: TODAY - (w.days - 1) * DAY, untilMs: Infinity }));
// Past billing cycles, newest first. Each runs from its renewal day up to, not
// including, the next one. Keyed by its first day, like the windows are.
const CLOSED = [];
for (let end = CYCLE_START, i = 0; i < HISTORY_CYCLES; i++) {
  const start = cycleStart(end - 1);
  CLOSED.push({ key: day(start), label: 'Billing cycle', sinceMs: start, untilMs: end });
  end = start;
}
// A device silent for longer than the widest window has nothing left inside it.
const SPAN_MS = Math.max(...WINDOWS.map((w) => w.days)) * DAY;

function* jsonlFiles(dir, floor) {
  let entries;
  try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* jsonlFiles(p, floor);
    else if (e.name.endsWith('.jsonl') && statSync(p).mtimeMs >= floor) yield p;
  }
}

const blank = () => ({ input: 0, output: 0, cacheWrite: 0, cacheRead: 0, cost: 0, messages: 0 });

// `windows` are {key, sinceMs, untilMs}; each gets its own slice of the figures.
function claude(windows) {
  const floor = Math.min(...windows.map((w) => w.sinceMs));
  const byMsg = new Map(); // message id -> last record (streaming rewrites usage cumulatively)
  for (const file of jsonlFiles(join(HOME, '.claude', 'projects'), floor)) {
    for (const line of readFileSync(file, 'utf8').split('\n')) {
      if (!line.includes('"usage"')) continue;
      let r;
      try { r = JSON.parse(line); } catch { continue; }
      const u = r.message?.usage;
      const ts = Date.parse(r.timestamp);
      if (!u || !(ts >= floor) || !r.message.id || !r.message.model || r.message.model.startsWith('<')) continue;
      byMsg.set(r.message.id, { ...r, ts });
    }
  }

  // One pass over the messages, dropping each into every window it falls in.
  const acc = windows.map(() => ({ totals: blank(), models: {}, days: {}, sessions: new Map() }));
  for (const r of byMsg.values()) {
    const u = r.message.usage;
    const model = r.message.model || 'unknown';
    const [pi, po, pw, pr] = priceFor(model);
    const input = u.input_tokens || 0;
    const output = u.output_tokens || 0;
    const cacheWrite = u.cache_creation_input_tokens || 0;
    const cacheRead = u.cache_read_input_tokens || 0;
    const cost = (input * pi + output * po + cacheWrite * pw + cacheRead * pr) / 1e6;
    const tokens = input + output + cacheWrite + cacheRead;
    const project = basename(r.cwd || '');

    windows.forEach((w, i) => {
      if (r.ts < w.sinceMs || r.ts >= w.untilMs) return;
      const a = acc[i];
      for (const bucket of [a.totals, (a.models[model] ??= blank())]) {
        bucket.input += input; bucket.output += output; bucket.cacheWrite += cacheWrite;
        bucket.cacheRead += cacheRead; bucket.cost += cost; bucket.messages += 1;
      }
      const d = (a.days[day(r.ts)] ??= { tokens: 0, cost: 0, messages: 0, sessions: new Set() });
      d.tokens += tokens; d.cost += cost; d.messages += 1; d.sessions.add(r.sessionId);

      const s = a.sessions.get(r.sessionId) ?? { project, first: r.ts, last: r.ts, messages: 0, cost: 0 };
      s.first = Math.min(s.first, r.ts); s.last = Math.max(s.last, r.ts); s.messages += 1; s.cost += cost;
      a.sessions.set(r.sessionId, s);
    });
  }

  return Object.fromEntries(windows.map((w, i) => {
    const a = acc[i];
    const projects = {};
    for (const s of a.sessions.values()) {
      const p = (projects[s.project] ??= { sessions: 0, cost: 0 });
      p.sessions += 1; p.cost += s.cost;
    }
    return [w.key, {
      sessions: a.sessions.size,
      hoursActive: [...a.sessions.values()].reduce((h, s) => h + (s.last - s.first) / 3600000, 0),
      totals: a.totals,
      models: a.models,
      projects,
      days: Object.fromEntries(Object.entries(a.days).map(([k, v]) => [k, { ...v, sessions: v.sessions.size }])),
    }];
  }));
}

// Live = a pid file whose process is still running. Window-independent.
function live() {
  const out = [];
  const sessDir = join(HOME, '.claude', 'sessions');
  for (const f of (() => { try { return readdirSync(sessDir); } catch { return []; } })()) {
    if (!f.endsWith('.json')) continue;
    try {
      const s = JSON.parse(readFileSync(join(sessDir, f), 'utf8'));
      process.kill(s.pid, 0);
      out.push({ project: basename(s.cwd || ''), startedAt: new Date(s.startedAt).toISOString() });
    } catch { /* dead pid or unreadable file */ }
  }
  return out;
}

function gh(args) {
  return JSON.parse(execFileSync('gh', args, { encoding: 'utf8', timeout: 30000 }));
}

// GitHub's search API allows 30 requests a minute. Backfilling a year of cycles
// makes a couple of dozen calls, so the history ones are spaced out.
const pause = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);

// Current windows keep their merged PR list for the page. Closed cycles only
// need the counts, which are frozen once read.
function github(current, closed) {
  const open = gh(['api', '-X', 'GET', 'search/issues', '-f', `q=author:${GITHUB_USER} is:pr is:open`, '-f', 'per_page=1']);
  const windows = {};
  for (const w of current) {
    const since = day(w.sinceMs);
    const merged = gh(['api', '-X', 'GET', 'search/issues', '-f', `q=author:${GITHUB_USER} is:pr is:merged merged:>=${since}`, '-f', 'per_page=100']);
    const commits = gh(['api', '-X', 'GET', 'search/commits', '-f', `q=author:${GITHUB_USER} author-date:>=${since}`, '-f', 'per_page=1']);
    windows[w.key] = {
      merged: merged.items.map((p) => ({
        title: p.title,
        repo: p.repository_url.split('/').pop(),
        number: p.number,
        url: p.html_url,
        mergedAt: p.pull_request.merged_at,
      })),
      mergedCount: merged.total_count,
      commits: commits.total_count,
    };
  }
  for (const w of closed) {
    // GitHub date ranges are inclusive at both ends; the cycle's end is exclusive.
    const range = `${day(w.sinceMs)}..${day(w.untilMs - DAY)}`;
    pause(3000);
    const merged = gh(['api', '-X', 'GET', 'search/issues', '-f', `q=author:${GITHUB_USER} is:pr is:merged merged:${range}`, '-f', 'per_page=1']);
    pause(3000);
    const commits = gh(['api', '-X', 'GET', 'search/commits', '-f', `q=author:${GITHUB_USER} author-date:${range}`, '-f', 'per_page=1']);
    windows[w.key] = { mergedCount: merged.total_count, commits: commits.total_count };
  }
  return { openPrs: open.total_count, windows };
}

// A live session older than two publish intervals is a closed lid, not a session.
const LIVE_TTL_MS = 30 * 60000;

// Sum the numeric leaves of b into a, so totals/models/projects/days all merge
// without naming a field twice.
function sumInto(a, b) {
  for (const [k, v] of Object.entries(b)) {
    if (typeof v === 'number') a[k] = (a[k] || 0) + v;
    else if (v && typeof v === 'object') sumInto((a[k] ??= {}), v);
  }
  return a;
}

// A device silent for longer than the widest window has nothing left inside it,
// so its file stops counting rather than pinning stale figures to the page
// forever. A device still publishing the old single-window format is skipped
// outright — it catches up the next time it runs this script.
//
// History is the exception: a closed cycle is frozen, so every device's copy
// counts however long it has been silent. Account-wide GitHub figures come from
// the first device that has them, which is this one, since it is listed first.
function merge(parts, own) {
  const windows = Object.fromEntries(Object.entries(own.windows).map(([k, w]) => [k, {
    label: w.label, days: w.days, since: w.since, github: w.github,
    claude: { sessions: 0, hoursActive: 0, totals: {}, models: {}, projects: {}, days: {} },
  }]));
  const alive = [];
  const devices = [];
  const cycles = new Map();
  for (const p of parts) {
    for (const [since, h] of Object.entries(p.history ?? {})) {
      if (!cycles.has(since)) cycles.set(since, { since, to: h.to, claude: { sessions: 0, hoursActive: 0, totals: {} } });
      const m = cycles.get(since);
      sumInto(m.claude, h.claude);
      m.github ??= h.github;
    }
    const age = NOW - Date.parse(p.updated);
    if (!(age < SPAN_MS) || !p.windows) continue;
    devices.push(p.device);
    for (const [k, w] of Object.entries(windows)) {
      const src = p.windows[k];
      if (!src) continue;
      w.claude.sessions += src.claude.sessions;
      w.claude.hoursActive += src.claude.hoursActive;
      for (const f of ['totals', 'models', 'projects', 'days']) sumInto(w.claude[f], src.claude[f]);
    }
    if (age < LIVE_TTL_MS) alive.push(...p.live.map((l) => ({ ...l, device: p.device })));
  }
  const history = [...cycles.values()].sort((a, b) => b.since.localeCompare(a.since));
  // GitHub figures are account-wide, so the publishing device's are current.
  return { updated: new Date(NOW).toISOString(), devices, cycle: own.cycle, live: alive, github: own.github, windows, history };
}

// A feed cycle flattened to the shape of src/data/usage-backfill.json.
const cycleRow = (w) => {
  const t = w.claude.totals;
  return {
    since: w.since, to: w.to, sessions: w.claude.sessions, prs: w.github?.mergedCount,
    tokens: (t.input || 0) + (t.output || 0) + (t.cacheWrite || 0) + (t.cacheRead || 0),
    spend: t.cost || 0, turns: t.messages || 0, hours: w.claude.hoursActive, commits: w.github?.commits,
  };
};

// The billing cycles as a Markdown table, for a human reading the gist. Same
// rules as the page: hand-entered rows replace the feed's, empty cycles drop out.
function markdown(merged, backfill) {
  const rows = new Map();
  const open = merged.windows.cycle;
  if (open) rows.set(open.since, { ...cycleRow({ ...open, to: day(NOW) }), now: true });
  for (const h of merged.history) rows.set(h.since, cycleRow(h));
  for (const b of backfill) rows.set(b.since, b);
  const n = (v, fmt = String) => (typeof v === 'number' ? fmt(v) : '–');
  const int = (v) => Math.round(v).toLocaleString('en-GB');
  const lines = [...rows.values()]
    .filter((r) => r.now || r.sessions || r.prs || r.commits)
    .sort((a, b) => b.since.localeCompare(a.since))
    .map((r) => {
      const month = new Date(r.since + 'T00:00:00Z').toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' });
      return `| ${month}${r.now ? ' (so far)' : ''} | ${r.since} – ${r.to} | ${n(r.sessions, int)} | ${n(r.prs, int)} | ${n(r.tokens, int)} | ${n(r.spend, (v) => `$${v.toFixed(2)}`)} | ${n(r.turns, int)} | ${n(r.hours, int)} | ${n(r.commits, int)} |`;
    });
  return [
    '# Usage by billing cycle',
    '',
    `Updated ${merged.updated} from ${merged.devices.join(', ') || 'no devices'}. Spend is API list price.`,
    '',
    '| Cycle | Dates | Sessions | PRs merged | Tokens | Spend | Turns | Hours | Commits |',
    '|---|---|--:|--:|--:|--:|--:|--:|--:|',
    ...lines,
    '',
  ].join('\n');
}

// Missing or unreadable when the script runs outside a checkout; then there is no backfill.
const readBackfill = () => {
  try { return JSON.parse(readFileSync(new URL('../src/data/usage-backfill.json', import.meta.url), 'utf8')); } catch { return []; }
};

if (process.argv.includes('--selftest')) {
  const at = (msAgo) => new Date(NOW - msAgo).toISOString();
  const win = () => ({
    label: 'Last 7 days', days: 7, since: '2026-01-01',
    claude: {
      sessions: 1, hoursActive: 1.5, totals: { cost: 1, messages: 2 },
      models: { 'claude-opus-5': { cost: 1 } }, projects: { p: { sessions: 1 } },
      days: { '2026-01-01': { tokens: 2, sessions: 1 } },
    },
    github: { commits: 7, mergedCount: 1, merged: [] },
  });
  // One closed cycle per device: sessions and spend sum, GitHub comes from the first device.
  const cycle = (sessions, mergedCount) => ({
    '2026-09-10': {
      to: '2026-10-09',
      claude: { sessions, hoursActive: 1, totals: { cost: 2, messages: 3, input: 0, output: 0, cacheWrite: 0, cacheRead: 0 } },
      github: { mergedCount, commits: 4 },
    },
  });
  const dev = (device, updated, history = {}) => ({
    device, updated, live: [{ project: 'p' }], cycle: { day: 1, since: '2026-01-01' },
    github: { openPrs: 3 }, windows: { '7d': win(), '14d': win(), cycle: win() }, history,
  });
  const here = dev('here', at(0), cycle(1, 5));
  const m = merge([here, dev('nap', at(60 * 60000), cycle(2, 9)), dev('gone', at(20 * 86400000), cycle(7, 1))], here);
  assert.deepEqual(m.devices, ['here', 'nap']); // the silent device drops out of the windows
  assert.deepEqual(Object.keys(m.windows), ['7d', '14d', 'cycle']);
  assert.equal(m.windows['7d'].claude.sessions, 2);
  assert.equal(m.windows.cycle.claude.hoursActive, 3);
  assert.equal(m.windows['14d'].claude.days['2026-01-01'].tokens, 4); // numeric leaves summed
  assert.equal(m.windows['7d'].claude.models['claude-opus-5'].cost, 2);
  assert.equal(m.windows['7d'].github.commits, 7); // account-wide, not summed per device
  assert.equal(m.github.openPrs, 3);
  assert.equal(m.live.length, 1); // the napping device is not live
  assert.equal(m.history.length, 1);
  assert.equal(m.history[0].since, '2026-09-10');
  assert.equal(m.history[0].claude.sessions, 10); // the silent device's frozen cycle still counts
  assert.equal(m.history[0].claude.totals.cost, 6);
  assert.equal(m.history[0].github.mergedCount, 5); // first device wins for GitHub
  const md = markdown(m, [{ since: '2026-08-10', to: '2026-09-09', prs: 2 }, { since: '2026-09-10', to: '2026-10-09', sessions: 99 }]);
  assert.match(md, /\| September 2026 \| 2026-09-10 – 2026-10-09 \| 99 \| – \|/); // backfill replaces the feed's row
  assert.match(md, /\| August 2026 \| 2026-08-10 – 2026-09-09 \| – \| 2 \|/);
  // The cycle window is anchored on the renewal day, not a rolling 30.
  assert.equal(day(cycleStart(Date.parse('2026-03-14T09:00:00Z'))), `2026-03-${String(CYCLE_DAY).padStart(2, '0')}`);
  assert.equal(day(cycleStart(Date.parse(`2026-03-0${Math.max(1, CYCLE_DAY - 1)}T09:00:00Z`))), CYCLE_DAY === 1 ? '2026-03-01' : `2026-02-${String(CYCLE_DAY).padStart(2, '0')}`);
  console.log('selftest ok');
  process.exit(0);
}

// The gist's copy of this device, from its last run. Its frozen cycles are kept
// as they are; only the open cycle and any closed cycle not yet frozen are read.
const PUBLISH = process.argv.includes('--publish');
if (PUBLISH && !GIST_ID) throw new Error('USAGE_GIST_ID is not set');
const mine = `usage-${DEVICE}.json`;
const gistFiles = PUBLISH ? gh(['api', `gists/${GIST_ID}`]).files : {};
let prior = {};
try { prior = gistFiles[mine] ? JSON.parse(gistFiles[mine].content) : {}; } catch { /* unreadable: read everything again */ }
const frozen = prior.history ?? {};
const isFrozen = (c) => Boolean(frozen[c.key]?.claude && frozen[c.key]?.github);
const toRead = CLOSED.filter((c) => !isFrozen(c));

const claudeWindows = claude([...WINDOWS, ...toRead]);
const githubWindows = github(WINDOWS, toRead);
const slim = ({ sessions, hoursActive, totals }) => ({ sessions, hoursActive, totals });
const history = Object.fromEntries(CLOSED.map((c) => [c.key, isFrozen(c) ? frozen[c.key] : {
  to: day(c.untilMs - DAY),
  claude: slim(claudeWindows[c.key]),
  github: githubWindows.windows[c.key],
}]));

const data = {
  updated: new Date(NOW).toISOString(),
  device: DEVICE,
  cycle: { day: CYCLE_DAY, since: day(CYCLE_START) },
  live: live(),
  github: { openPrs: githubWindows.openPrs },
  windows: Object.fromEntries(WINDOWS.map((w) => [w.key, {
    label: w.label,
    days: w.days,
    since: day(w.sinceMs),
    claude: claudeWindows[w.key],
    github: githubWindows.windows[w.key],
  }])),
  history,
};
const json = JSON.stringify(data, null, 1);

// `gh gist edit` wants -a for a file the gist has never seen, -f to replace one.
function put(existing, name, body) {
  const tmp = join(tmpdir(), name);
  writeFileSync(tmp, body);
  const args = existing[name] ? ['-f', name, tmp] : ['-a', tmp];
  execFileSync('gh', ['gist', 'edit', GIST_ID, ...args], { stdio: 'inherit', timeout: 30000 });
}

if (PUBLISH) {
  const others = Object.entries(gistFiles)
    .filter(([name]) => name.startsWith('usage-') && name !== mine)
    .map(([, f]) => JSON.parse(f.content));
  const merged = merge([data, ...others], data);
  put(gistFiles, mine, json);
  put(gistFiles, 'usage.json', JSON.stringify(merged, null, 1));
  put(gistFiles, 'usage.md', markdown(merged, readBackfill()));
  console.log(`published ${mine}, merged usage.json and usage.md (${merged.devices.join(', ')}) to gist ${GIST_ID}`);
} else {
  console.log(json);
}
