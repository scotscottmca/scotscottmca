'use strict';

/**
 * GET /api/status
 *
 * Returns Scott's current status derived from the Google Health API (the new
 * Fitbit Web API). Tiered, first match wins:
 *   asleep -> working-out -> walking -> active -> awake
 *
 * Requires these app settings on Azure SWA:
 *   GH_CLIENT_ID, GH_CLIENT_SECRET, GH_REFRESH_TOKEN
 *
 * Scopes needed on the refresh token:
 *   googlehealth.sleep.readonly                     (asleep)
 *   googlehealth.activity_and_fitness.readonly      (working-out, walking)
 *   googlehealth.health_metrics_and_measurements.readonly  (active / heart rate)
 * Missing scopes degrade gracefully: that tier is just skipped.
 *
 * Optional overrides (all have sensible defaults):
 *   STATUS_TZ                  IANA tz for local-hour flavour (default Europe/London)
 *   STATUS_MOCK=1              force the hour-based demo (also used with no creds)
 *   STATUS_ACTIVITY=0          disable the activity tiers (sleep/awake only)
 *   STATUS_WORKOUT_GRACE_MIN   count a just-finished workout as "working out" (default 30)
 *   STATUS_STEPS_WINDOW_MIN    look-back window for a step burst (default 20)
 *   STATUS_STEPS_MIN           steps in that window to count as "walking" (default 250)
 *   STATUS_HR_WINDOW_MIN       freshness window for a heart-rate sample (default 10)
 *   STATUS_HR_MIN              bpm at/above which counts as "active" (default 100)
 */

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const API_BASE = 'https://health.googleapis.com/v4/users/me/dataTypes';

const TOKEN_TIMEOUT_MS = 4000;
const FETCH_TIMEOUT_MS = 6000;
const STATUS_TTL_MS = 30000;

// Module-scope caches (survive warm invocations on the same instance).
let tokenCache = null; // { token, expiresAt }
let statusCache = null; // { payload, at }

function config(env) {
  const num = (v, d) => {
    const x = Number(v);
    return Number.isFinite(x) ? x : d;
  };
  return {
    activity: env.STATUS_ACTIVITY !== '0',
    workoutGraceMin: num(env.STATUS_WORKOUT_GRACE_MIN, 30),
    stepsWindowMin: num(env.STATUS_STEPS_WINDOW_MIN, 20),
    stepsMin: num(env.STATUS_STEPS_MIN, 250),
    hrWindowMin: num(env.STATUS_HR_WINDOW_MIN, 10),
    hrMin: num(env.STATUS_HR_MIN, 100),
  };
}

async function fetchWithTimeout(url, options, ms) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function json(context, status, body) {
  context.res = {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, max-age=0',
    },
    body: JSON.stringify(body),
  };
}

function localHour(tz) {
  try {
    const h = new Intl.DateTimeFormat('en-GB', {
      timeZone: tz,
      hour: 'numeric',
      hour12: false,
    }).format(new Date());
    return parseInt(h, 10) % 24;
  } catch {
    return new Date().getUTCHours();
  }
}

function mockPayload(tz) {
  const hour = localHour(tz);
  const asleep = hour >= 23 || hour < 7;
  return {
    status: asleep ? 'asleep' : 'awake',
    source: 'mock',
    confidence: 'low',
    updated: new Date().toISOString(),
    note: 'Demo status (no Google Health credentials configured).',
  };
}

async function getAccessToken(env) {
  if (tokenCache && tokenCache.expiresAt - 60000 > Date.now()) {
    return tokenCache.token;
  }
  const params = new URLSearchParams({
    client_id: env.GH_CLIENT_ID,
    client_secret: env.GH_CLIENT_SECRET,
    refresh_token: env.GH_REFRESH_TOKEN,
    grant_type: 'refresh_token',
  });
  const resp = await fetchWithTimeout(
    TOKEN_URL,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    },
    TOKEN_TIMEOUT_MS
  );
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Token refresh failed (${resp.status}): ${text}`);
  }
  const data = await resp.json();
  const ttlMs = (Number(data.expires_in) || 3600) * 1000;
  tokenCache = { token: data.access_token, expiresAt: Date.now() + ttlMs };
  return data.access_token;
}

async function fetchDataPoints(token, type, pageSize) {
  const url = `${API_BASE}/${encodeURIComponent(type)}/dataPoints?pageSize=${pageSize}`;
  const resp = await fetchWithTimeout(
    url,
    { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } },
    FETCH_TIMEOUT_MS
  );
  if (!resp.ok) {
    const text = await resp.text();
    const err = new Error(`${type} fetch failed (${resp.status}): ${text}`);
    err.status = resp.status;
    throw err;
  }
  const data = await resp.json();
  return Array.isArray(data.dataPoints) ? data.dataPoints : [];
}

// Never throw: a missing scope (401/403) just yields an empty, flagged result.
async function tryFetch(token, type, pageSize) {
  try {
    return { type, ok: true, points: await fetchDataPoints(token, type, pageSize) };
  } catch (err) {
    return { type, ok: false, points: [], error: err.message, status: err.status };
  }
}

// ---- Tolerant parsers (shapes confirmed/tuned via ?debug=1 raw dump) ----

function pickInterval(o) {
  if (!o || typeof o !== 'object') return null;
  const iv = o.interval || o.sessionTimeInterval || o.timeInterval;
  let s;
  let e;
  if (iv && iv.startTime) {
    s = Date.parse(iv.startTime);
    e = Date.parse(iv.endTime);
  } else if (o.startTime) {
    s = Date.parse(o.startTime);
    e = Date.parse(o.endTime);
  }
  if (s == null || Number.isNaN(s)) return null;
  if (e == null || Number.isNaN(e)) e = s;
  return { start: s, end: e };
}

function sleepIntervals(points) {
  return points
    .map((p) => pickInterval(p.sleep || p))
    .filter(Boolean)
    .sort((a, b) => b.end - a.end);
}

function exerciseSessions(points) {
  return points
    .map((p) => {
      const inner = p.exercise || p;
      const iv = pickInterval(inner);
      if (!iv) return null;
      const name =
        inner.displayName ||
        inner.activityName ||
        inner.exerciseType ||
        inner.name ||
        inner.activityType ||
        inner.type ||
        null;
      const ms = inner.metricsSummary || {};
      const steps = ms.steps != null ? Number(ms.steps) : null;
      return {
        ...iv,
        name: typeof name === 'string' ? name : null,
        steps: Number.isFinite(steps) ? steps : null,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.end - a.end);
}

// A Fitbit steps data point: { steps: { interval: { endTime }, count: "N" } }
function stepsSince(points, sinceMs) {
  let total = 0;
  for (const p of points) {
    const s = p.steps || p;
    const iv = s.interval || {};
    const t = Date.parse(iv.endTime || iv.startTime || s.time || '');
    if (Number.isNaN(t) || t < sinceMs) continue;
    const n = Number(s.count != null ? s.count : s.value);
    if (Number.isFinite(n)) total += n;
  }
  return total;
}

// A Fitbit heart-rate data point:
//   { heartRate: { sampleTime: { physicalTime }, beatsPerMinute: "N" } }
function latestHeartRate(points) {
  let best = null;
  for (const p of points) {
    const h = p.heartRate || p.heartrate || p;
    const st = h.sampleTime || {};
    const iv = h.interval || {};
    const t = Date.parse(
      st.physicalTime || st.time || h.time || iv.endTime || iv.startTime || ''
    );
    const bpm = Number(
      h.beatsPerMinute != null ? h.beatsPerMinute : h.bpm != null ? h.bpm : h.value
    );
    if (Number.isNaN(t) || !Number.isFinite(bpm)) continue;
    if (!best || t > best.at) best = { at: t, bpm };
  }
  return best;
}

// ---- Status computation ----

function computeStatus(data, tz, cfg) {
  const now = Date.now();
  const sleep = sleepIntervals(data.sleep || []);
  const base = {
    source: 'google-health',
    updated: new Date().toISOString(),
    localHour: localHour(tz),
  };

  const latestSleep = sleep[0];
  if (latestSleep) {
    base.lastSleep = {
      start: new Date(latestSleep.start).toISOString(),
      end: new Date(latestSleep.end).toISOString(),
      durationMin: Math.round((latestSleep.end - latestSleep.start) / 60000),
    };
  }

  // 1) Asleep: now inside a session, or the latest session has not ended yet.
  const ongoingSleep = sleep.find((s) => now >= s.start && now <= s.end);
  if (ongoingSleep || (latestSleep && now < latestSleep.end)) {
    const active = ongoingSleep || latestSleep;
    return {
      ...base,
      status: 'asleep',
      confidence: ongoingSleep ? 'high' : 'medium',
      asleepForMin: Math.max(0, Math.round((now - active.start) / 60000)),
    };
  }

  if (cfg.activity) {
    // 2) Exercise: a session ongoing or finished within the grace window.
    //    A walk/hike routes to the "walking" status; anything else is a workout.
    const sessions = exerciseSessions(data.exercise || []);
    const workout = sessions[0];
    if (workout) {
      const endedMinAgo = Math.round((now - workout.end) / 60000);
      const ongoing = now >= workout.start && now <= workout.end;
      if (ongoing || (endedMinAgo >= 0 && endedMinAgo <= cfg.workoutGraceMin)) {
        const durationMin = Math.round((workout.end - workout.start) / 60000);
        const isWalk = workout.name && /walk|hik|stroll|ramble/i.test(workout.name);
        if (isWalk) {
          return {
            ...base,
            status: 'walking',
            confidence: ongoing ? 'high' : 'medium',
            walk: {
              name: workout.name,
              durationMin,
              endedMinAgo: ongoing ? 0 : endedMinAgo,
              steps: workout.steps,
            },
          };
        }
        return {
          ...base,
          status: 'working-out',
          confidence: ongoing ? 'high' : 'medium',
          workout: {
            name: workout.name,
            durationMin,
            endedMinAgo: ongoing ? 0 : endedMinAgo,
          },
        };
      }
    }

    // 3) Walking: a step burst in the recent window.
    const since = now - cfg.stepsWindowMin * 60000;
    const recentSteps = stepsSince(data.steps || [], since);
    if (recentSteps >= cfg.stepsMin) {
      return {
        ...base,
        status: 'walking',
        confidence: 'medium',
        steps: { recent: recentSteps, windowMin: cfg.stepsWindowMin },
      };
    }

    // 4) Active: a fresh, elevated heart-rate sample.
    const hr = latestHeartRate(data.heartRate || []);
    if (hr) {
      const ageMin = Math.round((now - hr.at) / 60000);
      if (ageMin >= 0 && ageMin <= cfg.hrWindowMin && hr.bpm >= cfg.hrMin) {
        return {
          ...base,
          status: 'active',
          confidence: 'medium',
          heartRate: { bpm: hr.bpm, atMinAgo: ageMin },
        };
      }
    }
  }

  // 5) Awake (default). Report how long since the last sleep ended, if known.
  return {
    ...base,
    status: 'awake',
    confidence: latestSleep ? 'medium' : 'low',
    ...(latestSleep
      ? { awakeForMin: Math.max(0, Math.round((now - latestSleep.end) / 60000)) }
      : {}),
  };
}

function debugSamples(results) {
  const out = {};
  for (const r of results) {
    out[r.type] = {
      ok: r.ok,
      count: r.points.length,
      ...(r.error ? { error: r.error } : {}),
      sample: r.points[0] || null,
    };
  }
  return out;
}

module.exports = async function (context, req) {
  const env = process.env;
  const tz = env.STATUS_TZ || 'Europe/London';
  const cfg = config(env);
  const q = (req && req.query) || {};
  const debug = q.debug === '1' || q.debug === 'true';
  const started = Date.now();

  const hasCreds = env.GH_CLIENT_ID && env.GH_CLIENT_SECRET && env.GH_REFRESH_TOKEN;
  if (env.STATUS_MOCK === '1' || !hasCreds) {
    json(context, 200, mockPayload(tz));
    return;
  }

  const bypass = q.fresh === '1';
  if (!bypass && statusCache && Date.now() - statusCache.at < STATUS_TTL_MS) {
    const ageSec = Math.round((Date.now() - statusCache.at) / 1000);
    json(context, 200, { ...statusCache.payload, cached: true, ageSec });
    return;
  }

  try {
    const tokenStart = Date.now();
    const token = await getAccessToken(env);
    const tokenMs = Date.now() - tokenStart;

    const fetchStart = Date.now();
    const jobs = [tryFetch(token, 'sleep', 25)];
    if (cfg.activity) {
      jobs.push(
        tryFetch(token, 'exercise', 25),
        tryFetch(token, 'steps', 200),
        tryFetch(token, 'heart-rate', 200)
      );
    }
    const results = await Promise.all(jobs);
    const fetchMs = Date.now() - fetchStart;

    const byType = {};
    for (const r of results) byType[r.type] = r.points;
    const data = {
      sleep: byType.sleep,
      exercise: byType.exercise,
      steps: byType.steps,
      heartRate: byType['heart-rate'],
    };

    const payload = computeStatus(data, tz, cfg);
    payload.diag = {
      tokenMs,
      fetchMs,
      totalMs: Date.now() - started,
      types: results.map((r) => ({
        type: r.type,
        ok: r.ok,
        count: r.points.length,
        ...(r.status ? { httpStatus: r.status } : {}),
      })),
    };
    if (debug) payload.debug = debugSamples(results);
    statusCache = { payload, at: Date.now() };

    context.log(
      `status ok: ${payload.status} tokenMs=${tokenMs} fetchMs=${fetchMs} ` +
        results.map((r) => `${r.type}=${r.ok ? r.points.length : 'x'}`).join(' ')
    );
    json(context, 200, payload);
  } catch (err) {
    const msg = (err && err.message) || 'unknown error';
    context.log.error(`status function error after ${Date.now() - started}ms: ${msg}`);
    if (statusCache) {
      const ageSec = Math.round((Date.now() - statusCache.at) / 1000);
      json(context, 200, {
        ...statusCache.payload,
        source: 'cache-stale',
        cached: true,
        ageSec,
        note: 'Live status temporarily unavailable; showing last known.',
        ...(debug ? { error: msg } : {}),
      });
      return;
    }
    json(context, 200, {
      ...mockPayload(tz),
      source: 'fallback',
      note: 'Live status temporarily unavailable.',
      ...(debug ? { error: msg } : {}),
    });
  }
};
