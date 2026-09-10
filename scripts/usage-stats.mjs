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

import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, basename } from 'node:path';
import { homedir, tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';

const HOME = homedir();
const DAYS = 7;
const NOW = Date.now();
const SINCE = NOW - DAYS * 86400000;
const GITHUB_USER = 'scotscottmca';
const GIST_ID = process.env.USAGE_GIST_ID || '';

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

function* jsonlFiles(dir) {
  let entries;
  try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* jsonlFiles(p);
    else if (e.name.endsWith('.jsonl') && statSync(p).mtimeMs >= SINCE) yield p;
  }
}

function claude() {
  const byMsg = new Map(); // message id -> last record (streaming rewrites usage cumulatively)
  const sessions = new Map(); // sessionId -> { project, first, last, messages }
  for (const file of jsonlFiles(join(HOME, '.claude', 'projects'))) {
    for (const line of readFileSync(file, 'utf8').split('\n')) {
      if (!line.includes('"usage"')) continue;
      let r;
      try { r = JSON.parse(line); } catch { continue; }
      const u = r.message?.usage;
      const ts = Date.parse(r.timestamp);
      if (!u || !(ts >= SINCE) || !r.message.id || !r.message.model || r.message.model.startsWith('<')) continue;
      byMsg.set(r.message.id, { ...r, ts });
    }
  }

  const days = {};
  const models = {};
  const totals = { input: 0, output: 0, cacheWrite: 0, cacheRead: 0, cost: 0, messages: 0 };
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

    for (const bucket of [totals, (models[model] ??= { input: 0, output: 0, cacheWrite: 0, cacheRead: 0, cost: 0, messages: 0 })]) {
      bucket.input += input; bucket.output += output; bucket.cacheWrite += cacheWrite;
      bucket.cacheRead += cacheRead; bucket.cost += cost; bucket.messages += 1;
    }
    const d = (days[day(r.ts)] ??= { tokens: 0, cost: 0, messages: 0, sessions: new Set() });
    d.tokens += tokens; d.cost += cost; d.messages += 1; d.sessions.add(r.sessionId);

    const s = sessions.get(r.sessionId) ?? { project: basename(r.cwd || ''), first: r.ts, last: r.ts, messages: 0, cost: 0 };
    s.first = Math.min(s.first, r.ts); s.last = Math.max(s.last, r.ts); s.messages += 1; s.cost += cost;
    sessions.set(r.sessionId, s);
  }

  // Live = a pid file whose process is still running.
  const live = [];
  const sessDir = join(HOME, '.claude', 'sessions');
  for (const f of (() => { try { return readdirSync(sessDir); } catch { return []; } })()) {
    if (!f.endsWith('.json')) continue;
    try {
      const s = JSON.parse(readFileSync(join(sessDir, f), 'utf8'));
      process.kill(s.pid, 0);
      live.push({ project: basename(s.cwd || ''), startedAt: new Date(s.startedAt).toISOString() });
    } catch { /* dead pid or unreadable file */ }
  }

  const projects = {};
  for (const s of sessions.values()) (projects[s.project] ??= { sessions: 0, cost: 0 }).sessions += 1, projects[s.project].cost += s.cost;

  return {
    live,
    sessions: sessions.size,
    hoursActive: [...sessions.values()].reduce((h, s) => h + (s.last - s.first) / 3600000, 0),
    totals,
    models,
    projects,
    days: Object.fromEntries(Object.entries(days).map(([k, v]) => [k, { ...v, sessions: v.sessions.size }])),
  };
}

function gh(args) {
  return JSON.parse(execFileSync('gh', args, { encoding: 'utf8', timeout: 30000 }));
}

function github() {
  const since = day(SINCE);
  const merged = gh(['api', '-X', 'GET', 'search/issues', '-f', `q=author:${GITHUB_USER} is:pr is:merged merged:>=${since}`, '-f', 'per_page=100']);
  const open = gh(['api', '-X', 'GET', 'search/issues', '-f', `q=author:${GITHUB_USER} is:pr is:open`, '-f', 'per_page=1']);
  const commits = gh(['api', '-X', 'GET', 'search/commits', '-f', `q=author:${GITHUB_USER} author-date:>=${since}`, '-f', 'per_page=1']);
  return {
    merged: merged.items.map((p) => ({
      title: p.title,
      repo: p.repository_url.split('/').pop(),
      number: p.number,
      url: p.html_url,
      mergedAt: p.pull_request.merged_at,
    })),
    mergedCount: merged.total_count,
    openPrs: open.total_count,
    commits: commits.total_count,
  };
}

const data = { updated: new Date(NOW).toISOString(), windowDays: DAYS, claude: claude(), github: github() };
const json = JSON.stringify(data, null, 1);

if (process.argv.includes('--publish')) {
  if (!GIST_ID) throw new Error('USAGE_GIST_ID is not set');
  const tmp = join(tmpdir(), 'usage.json');
  writeFileSync(tmp, json);
  execFileSync('gh', ['gist', 'edit', GIST_ID, '-f', 'usage.json', tmp], { stdio: 'inherit', timeout: 30000 });
  console.log(`published ${json.length} bytes to gist ${GIST_ID}`);
} else {
  console.log(json);
}
