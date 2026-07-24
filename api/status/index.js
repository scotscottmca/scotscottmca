'use strict';

/**
 * GET /api/status
 *
 * Returns Scott's awake/asleep status derived from the Google Health API
 * (the new Fitbit Web API). Requires these app settings on Azure SWA:
 *   GH_CLIENT_ID, GH_CLIENT_SECRET, GH_REFRESH_TOKEN
 *
 * Optional overrides:
 *   GH_SCOPE        (default: https://www.googleapis.com/auth/googlehealth.sleep.readonly)
 *   GH_DATA_TYPE    (default: sleep)
 *   STATUS_TZ       IANA time zone for the "local hour" fun facts (default: Europe/London)
 *   STATUS_MOCK     set to "1" to force the hour-based mock (also used automatically
 *                   when credentials are missing, e.g. local dev)
 */

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const API_BASE = 'https://health.googleapis.com/v4/users/me/dataTypes';
const DEFAULT_SCOPE =
  'https://www.googleapis.com/auth/googlehealth.sleep.readonly';

function json(context, status, body) {
  context.res = {
    status,
    headers: {
      'Content-Type': 'application/json',
      // Never cache a live status.
      'Cache-Control': 'no-store, max-age=0',
    },
    body: JSON.stringify(body),
  };
}

// Local hour in the configured time zone (used for mock + "night owl" flavour).
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
  const params = new URLSearchParams({
    client_id: env.GH_CLIENT_ID,
    client_secret: env.GH_CLIENT_SECRET,
    refresh_token: env.GH_REFRESH_TOKEN,
    grant_type: 'refresh_token',
  });
  const resp = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Token refresh failed (${resp.status}): ${text}`);
  }
  const data = await resp.json();
  return data.access_token;
}

async function fetchSleepPoints(accessToken, dataType) {
  const url = `${API_BASE}/${encodeURIComponent(dataType)}/dataPoints?pageSize=25`;
  const resp = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Sleep fetch failed (${resp.status}): ${text}`);
  }
  const data = await resp.json();
  return Array.isArray(data.dataPoints) ? data.dataPoints : [];
}

// Pull { start, end } from a sleep data point, tolerating field shape drift.
function intervalOf(point) {
  const sleep = point.sleep || point;
  const interval =
    sleep.interval || sleep.sessionTimeInterval || sleep.timeInterval;
  if (!interval) return null;
  const start = Date.parse(interval.startTime);
  const end = Date.parse(interval.endTime);
  if (Number.isNaN(start) || Number.isNaN(end)) return null;
  return { start, end };
}

function computeStatus(points, tz) {
  const now = Date.now();
  const sessions = points
    .map(intervalOf)
    .filter(Boolean)
    .sort((a, b) => b.end - a.end);

  if (sessions.length === 0) {
    return {
      status: 'unknown',
      source: 'google-health',
      confidence: 'low',
      updated: new Date().toISOString(),
      note: 'No recent sleep sessions returned.',
    };
  }

  // Asleep if now falls inside a session, or the latest session hasn't ended yet.
  const ongoing = sessions.find((s) => now >= s.start && now <= s.end);
  const latest = sessions[0];
  const asleep = Boolean(ongoing) || now < latest.end;
  const active = ongoing || latest;

  const durationMin = Math.round((active.end - active.start) / 60000);
  const base = {
    source: 'google-health',
    updated: new Date().toISOString(),
    localHour: localHour(tz),
    lastSleep: {
      start: new Date(active.start).toISOString(),
      end: new Date(active.end).toISOString(),
      durationMin,
    },
  };

  if (asleep) {
    return {
      ...base,
      status: 'asleep',
      confidence: ongoing ? 'high' : 'medium',
      asleepForMin: Math.max(0, Math.round((now - active.start) / 60000)),
    };
  }
  return {
    ...base,
    status: 'awake',
    confidence: 'medium',
    awakeForMin: Math.max(0, Math.round((now - latest.end) / 60000)),
  };
}

module.exports = async function (context, req) {
  const env = process.env;
  const tz = env.STATUS_TZ || 'Europe/London';

  const hasCreds =
    env.GH_CLIENT_ID && env.GH_CLIENT_SECRET && env.GH_REFRESH_TOKEN;

  if (env.STATUS_MOCK === '1' || !hasCreds) {
    json(context, 200, mockPayload(tz));
    return;
  }

  try {
    const dataType = env.GH_DATA_TYPE || 'sleep';
    const token = await getAccessToken(env);
    const points = await fetchSleepPoints(token, dataType);
    json(context, 200, computeStatus(points, tz));
  } catch (err) {
    context.log.error('status function error:', err && err.message);
    // Degrade gracefully so the page still renders something fun.
    json(context, 200, {
      ...mockPayload(tz),
      source: 'fallback',
      note: 'Live status temporarily unavailable.',
    });
  }
};
