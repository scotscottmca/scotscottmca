// Draws the five blueprint status sprites of Scott into public/images/status/.
//
//   node scripts/status-sprites.mjs
//
// One vector head-and-shoulders (hair, specs, full beard, tee) drawn as a
// schematic in the state's tone: violet for rest, cyan for everything else,
// matching --violet-text and --cyan in global.css. Each state swaps the face
// and adds a prop (Zs, mug, dachshund, dumbbell, heartbeat), with spec-sheet
// callouts on every sprite. The grid behind it is the page's .sprite-inset.
// Motion runs at the state's period from STATES in src/pages/status.astro;
// reduced motion stills everything.
//
// /images/* is served immutable for a week, so after redrawing bump the ?v=
// on the sprite URL in src/pages/status.astro or visitors keep the old art.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'images', 'status');

const CYAN = '#00d4ff';
const VIOLET = '#b794ff';
const FAINT = '#5a6076';
const MUTED = '#8d93a8';

const STATES = {
  asleep: { tone: VIOLET, period: '4.8s', label: 'Scott, asleep' },
  awake: { tone: CYAN, period: '2.4s', label: 'Scott, awake with a coffee' },
  walking: { tone: CYAN, period: '1.4s', label: 'Scott, out walking the dachshund' },
  'working-out': { tone: CYAN, period: '0.9s', label: 'Scott, working out' },
  active: { tone: CYAN, period: '1.6s', label: 'Scott, up and active' },
};

function scott(k) {
  const shut = k === 'asleep';
  const grin = k === 'working-out' || k === 'active';
  const eyes = shut
    ? '<path class="line" d="M39.5 43.5q2.5 1.8 5 0M55.5 43.5q2.5 1.8 5 0"/>'
    : '<circle class="dot" cx="42" cy="43" r="1.7"/><circle class="dot" cx="58" cy="43" r="1.7"/>';
  const mouth = grin
    ? '<path class="s" d="M44 60q6 7 12 0z"/>'
    : shut
      ? '<ellipse class="s" cx="50" cy="61.5" rx="2.2" ry="1.4"/>'
      : '<path class="s" d="M45 60.5q5 3.2 10 0q-5 1.2-10 0z"/>';
  const band = k === 'working-out' ? '<path class="s" d="M31.5 31q18.5-7 37 0l-.4 4.2q-18.2-6.5-36.2 0z"/>' : '';
  return `<g class="fig">
    <path class="s" d="M22 100c0-15 10-22 20-24l8 5 8-5c10 2 20 9 20 24z"/>
    <ellipse class="s" cx="31.5" cy="45" rx="3" ry="4.5"/>
    <ellipse class="s" cx="68.5" cy="45" rx="3" ry="4.5"/>
    <path class="s" d="M32 42c0-13 7-20 18-20s18 7 18 20v8c0 13-8 22-18 22s-18-9-18-22z"/>
    <path class="s" d="M31.2 40c-1-15 7-24 18.8-24s20 9 18.8 24c-2-7-5-10.5-9.5-11.5-5 2-13 2-18.5 0-4.8 1-7.8 4.5-9.6 11.5z"/>
    ${band}
    <path class="s" d="M32 47c1 5 3 7.5 6 8.5 4-2.5 8-2.8 12-1.2 4-1.6 8-1.3 12 1.2 3-1 5-3.5 6-8.5 1.5 18-5 30-18 31s-19.5-13-18-31z"/>
    ${mouth}
    <path class="line" d="M38 36.5q4-1.8 8 0M54 36.5q4-1.8 8 0"/>
    ${eyes}
    <rect class="s" x="36" y="38.5" width="12" height="9" rx="2.5"/>
    <rect class="s" x="52" y="38.5" width="12" height="9" rx="2.5"/>
    <path class="line" d="M48 42q2-1.5 4 0M36 41l-4-1.5M64 41l4-1.5"/>
  </g>`;
}

const PROPS = {
  asleep: `<text class="dot z" x="74" y="28" font-size="9">z</text>
    <text class="dot z z2" x="81" y="18" font-size="12">Z</text>
    <path class="p" d="M14 16a6 6 0 0 0 8 8 8 8 0 1 1-8-8z"/>`,
  awake: `<path class="p" d="M80 80h11v11a4 4 0 0 1-4 4h-3a4 4 0 0 1-4-4zM91 83h1.5a3 3 0 0 1 0 6H91"/>
    <path class="p steam" d="M83 76q-1.5-2 0-4t0-4M88 76q-1.5-2 0-4t0-4"/>`,
  walking: `<g class="trot">
      <path class="p" d="M75 88q-4-2-3.5-6.5"/>
      <rect class="p" x="73.5" y="85.5" width="19" height="7.5" rx="3.75"/>
      <path class="p" d="M76.5 92.5v4.5M79.5 92.5v4.5M87 92.5v4.5M90 92.5v4.5"/>
      <ellipse class="p" cx="93" cy="83.5" rx="4.2" ry="3.8"/>
      <ellipse class="p" cx="97.2" cy="85.2" rx="2.9" ry="2"/>
      <path class="p" d="M90.5 81.5q-2.2 4 .2 7.5 2.2-2.8 1.4-7z"/>
      <circle class="dot" cx="99.6" cy="84.6" r=".9"/>
      <circle class="dot" cx="94" cy="82.4" r=".75"/>
    </g>
    <path class="p dim" d="M10 70h8M6 76h10M10 82h6"/>`,
  'working-out': `<g class="reps"><path class="p" d="M76 24h18M78 18v12M81 20v8M92 18v12M89 20v8"/></g>
    <path class="dot dim" d="M72 36q2 3 0 5a2.2 2.2 0 0 1-3-1.5c0-1.5 1.5-2.5 3-3.5z"/>`,
  active: `<path class="dot beat" d="M84 26c-2-3-7-2-7 2 0 4 7 8 7 8s7-4 7-8c0-4-5-5-7-2z"/>
    <path class="p dim" d="M6 22h6l2-5 3 10 2-5h5"/>`,
};

// Spec-sheet callouts: a construction circle and three leader lines.
const NOTES = `<g class="note">
    <circle class="guide" cx="50" cy="44" r="27"/>
    <line x1="42" y1="17" x2="34" y2="8.5"/><text x="2" y="7">hair: #d0a43d</text>
    <line x1="36" y1="43" x2="4" y2="54"/><text x="2" y="58.5">specs: x2</text>
    <line x1="36" y1="66" x2="8" y2="66"/><text x="2" y="71">beard: 100%</text>
  </g>`;

const style = (tone, period) => `
    .s { fill: ${tone}; fill-opacity: 0.06; stroke: ${tone}; stroke-width: 0.8; stroke-linejoin: round; }
    .line, .p { fill: none; stroke: ${tone}; stroke-width: 0.9; stroke-linecap: round; stroke-linejoin: round; }
    .dot { fill: ${tone}; }
    .dim { opacity: 0.7; }
    text { font-family: 'JetBrains Mono', ui-monospace, Menlo, monospace; font-weight: 700; }
    .note line, .guide { stroke: ${FAINT}; stroke-width: 0.4; fill: none; }
    .guide { stroke-dasharray: 1.5 1.5; }
    .note text { font-size: 5.2px; font-weight: 400; fill: ${MUTED}; }
    .fig { animation: bob ${period} ease-in-out infinite; }
    .z { animation: rise ${period} ease-out infinite; }
    .z2 { animation-delay: calc(${period} / 2); }
    .steam { animation: steam ${period} ease-in-out infinite; }
    .reps { animation: reps ${period} ease-in-out infinite; }
    .trot { animation: reps calc(${period} * 2) ease-in-out infinite; }
    .beat { transform-box: fill-box; transform-origin: center; animation: beat ${period} ease-in-out infinite; }
    @keyframes bob { 50% { transform: translateY(-1.5px); } }
    @keyframes rise { 0% { opacity: 0; transform: translate(0, 4px); } 30% { opacity: 1; } 100% { opacity: 0; transform: translate(3px, -6px); } }
    @keyframes steam { 0%, 100% { opacity: 0.2; transform: translateY(1px); } 50% { opacity: 1; transform: translateY(-2px); } }
    @keyframes reps { 50% { transform: translateY(-7px); } }
    @keyframes beat { 0%, 60%, 100% { transform: scale(1); } 20% { transform: scale(1.18); } }
    @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
`;

fs.mkdirSync(OUT, { recursive: true });
for (const [k, { tone, period, label }] of Object.entries(STATES)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="240" height="240" role="img" aria-label="${label}">
  <!-- Generated by scripts/status-sprites.mjs; edit the drawing there, not this file. -->
  <style>${style(tone, period)}  </style>
  ${NOTES}
  ${scott(k)}
  ${PROPS[k]}
</svg>
`;
  fs.writeFileSync(path.join(OUT, `scott-${k}.svg`), svg);
}
console.log(`wrote ${Object.keys(STATES).length} sprites to ${OUT}`);
