#!/usr/bin/env node
// Collects Claude Code + GitHub activity for the hidden /usage page and
// publishes it as a gist the page fetches client-side.
//
//   node scripts/usage-stats.mjs            # print JSON to stdout
//   node scripts/usage-stats.mjs --publish  # also push to the gist (USAGE_GIST_ID)
//
// Claude data comes from the local transcripts in ~/.claude/projects (one
// JSONL per session); live sessions from the pid files in ~/.claude/sessions.
// GitHub data comes from the authenticated `gh` CLI. Runs from launchd every
// 15 minutes — see scripts/com.scotscottmca.usage.plist.
//
// Every figure is cut three ways — last 7 days, last 14 days, and the month so
// far on the billing cycle (anchored on USAGE_CYCLE_DAY, default the 1st) — so
// the page switches window without refetching. The widest window decides how
// far back the transcripts are read.
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
// First label only: the rest is whatever the current network calls us
// (.local, .fritz.box), and a name that moves would double-count the device.
const DEVICE = (process.env.USAGE_DEVICE || hostname().split('.')[0] || 'unknown').replace(/[^a-zA-Z0-9-]+/g, '-');
const NOW = Date.now();
const DAY = 86400000;
const GITHUB_USER = 'scotscottmca';
const GIST_ID = process.env.USAGE_GIST_ID || '';
// Day of the month the subscription renews. Past the 28th there is no anchor in
// February, so that is where it clamps.
const CYCLE_DAY = Math.min(28, Math.max(1, Number(process.env.USAGE_CYCLE_DAY) || 1));

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
const WINDOWS = [
  { key: '7d', label: 'Last 7 days', days: 7 },
  { key: '14d', label: 'Last 14 days', days: 14 },
  { key: 'cycle', label: 'Billing cycle', days: Math.round((TODAY - CYCLE_START) / DAY) + 1 },
].map((w) => ({ ...w, sinceMs: TODAY - (w.days - 1) * DAY }));
const OLDEST = Math.min(...WINDOWS.map((w) => w.sinceMs));
// A device silent for longer than the widest window has nothing left inside it.
const SPAN_MS = Math.max(...WINDOWS.map((w) => w.days)) * DAY;

function* jsonlFiles(dir) {
  let entries;
  try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* jsonlFiles(p);
    else if (e.name.endsWith('.jsonl') && statSync(p).mtimeMs >= OLDEST) yield p;
  }
}

const blank = () => ({ input: 0, output: 0, cacheWrite: 0, cacheRead: 0, cost: 0, messages: 0 });

function claude() {
  const byMsg = new Map(); // message id -> last record (streaming rewrites usage cumulatively)
  for (const file of jsonlFiles(join(HOME, '.claude', 'projects'))) {
    for (const line of readFileSync(file, 'utf8').split('\n')) {
      if (!line.includes('"usage"')) continue;
      let r;
      try { r = JSON.parse(line); } catch { continue; }
      const u = r.message?.usage;
      const ts = Date.parse(r.timestamp);
      if (!u || !(ts >= OLDEST) || !r.message.id || !r.message.model || r.message.model.startsWith('<')) continue;
      byMsg.set(r.message.id, { ...r, ts });
    }
  }

  // One pass over the messages, dropping each into every window it falls in.
  const acc = WINDOWS.map(() => ({ totals: blank(), models: {}, days: {}, sessions: new Map() }));
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

    WINDOWS.forEach((w, i) => {
      if (r.ts < w.sinceMs) return;
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

  return Object.fromEntries(WINDOWS.map((w, i) => {
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

function github() {
  const open = gh(['api', '-X', 'GET', 'search/issues', '-f', `q=author:${GITHUB_USER} is:pr is:open`, '-f', 'per_page=1']);
  const windows = Object.fromEntries(WINDOWS.map((w) => {
    const since = day(w.sinceMs);
    const merged = gh(['api', '-X', 'GET', 'search/issues', '-f', `q=author:${GITHUB_USER} is:pr is:merged merged:>=${since}`, '-f', 'per_page=100']);
    const commits = gh(['api', '-X', 'GET', 'search/commits', '-f', `q=author:${GITHUB_USER} author-date:>=${since}`, '-f', 'per_page=1']);
    return [w.key, {
      merged: merged.items.map((p) => ({
        title: p.title,
        repo: p.repository_url.split('/').pop(),
        number: p.number,
        url: p.html_url,
        mergedAt: p.pull_request.merged_at,
      })),
      mergedCount: merged.total_count,
      commits: commits.total_count,
    }];
  }));
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
function merge(parts, own) {
  const windows = Object.fromEntries(Object.entries(own.windows).map(([k, w]) => [k, {
    label: w.label, days: w.days, since: w.since, github: w.github,
    claude: { sessions: 0, hoursActive: 0, totals: {}, models: {}, projects: {}, days: {} },
  }]));
  const alive = [];
  const devices = [];
  for (const p of parts) {
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
  // GitHub figures are account-wide, so the publishing device's are current.
  return { updated: new Date(NOW).toISOString(), devices, cycle: own.cycle, live: alive, github: own.github, windows };
}

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
  const dev = (device, updated) => ({
    device, updated, live: [{ project: 'p' }], cycle: { day: 1, since: '2026-01-01' },
    github: { openPrs: 3 }, windows: { '7d': win(), '14d': win(), cycle: win() },
  });
  const here = dev('here', at(0));
  const m = merge([here, dev('nap', at(60 * 60000)), dev('gone', at(20 * 86400000))], here);
  assert.deepEqual(m.devices, ['here', 'nap']); // the silent device drops out
  assert.deepEqual(Object.keys(m.windows), ['7d', '14d', 'cycle']);
  assert.equal(m.windows['7d'].claude.sessions, 2);
  assert.equal(m.windows.cycle.claude.hoursActive, 3);
  assert.equal(m.windows['14d'].claude.days['2026-01-01'].tokens, 4); // numeric leaves summed
  assert.equal(m.windows['7d'].claude.models['claude-opus-5'].cost, 2);
  assert.equal(m.windows['7d'].github.commits, 7); // account-wide, not summed per device
  assert.equal(m.github.openPrs, 3);
  assert.equal(m.live.length, 1); // the napping device is not live
  // The cycle window is anchored on the renewal day, not a rolling 30.
  assert.equal(day(cycleStart(Date.parse('2026-03-14T09:00:00Z'))), `2026-03-${String(CYCLE_DAY).padStart(2, '0')}`);
  assert.equal(day(cycleStart(Date.parse(`2026-03-0${Math.max(1, CYCLE_DAY - 1)}T09:00:00Z`))), CYCLE_DAY === 1 ? '2026-03-01' : `2026-02-${String(CYCLE_DAY).padStart(2, '0')}`);
  console.log('selftest ok');
  process.exit(0);
}

const claudeWindows = claude();
const githubWindows = github();
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
};
const json = JSON.stringify(data, null, 1);

// `gh gist edit` wants -a for a file the gist has never seen, -f to replace one.
function put(existing, name, body) {
  const tmp = join(tmpdir(), name);
  writeFileSync(tmp, body);
  const args = existing[name] ? ['-f', name, tmp] : ['-a', tmp];
  execFileSync('gh', ['gist', 'edit', GIST_ID, ...args], { stdio: 'inherit', timeout: 30000 });
}

if (process.argv.includes('--publish')) {
  if (!GIST_ID) throw new Error('USAGE_GIST_ID is not set');
  const mine = `usage-${DEVICE}.json`;
  const files = gh(['api', `gists/${GIST_ID}`]).files;
  const others = Object.entries(files)
    .filter(([name]) => name.startsWith('usage-') && name !== mine)
    .map(([, f]) => JSON.parse(f.content));
  const merged = merge([data, ...others], data);
  put(files, mine, json);
  put(files, 'usage.json', JSON.stringify(merged, null, 1));
  console.log(`published ${mine} and merged usage.json (${merged.devices.join(', ')}) to gist ${GIST_ID}`);
} else {
  console.log(json);
}
