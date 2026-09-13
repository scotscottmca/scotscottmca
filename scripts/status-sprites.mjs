// Draws the five pixel-art status sprites of Scott into public/images/status/.
//
//   node scripts/status-sprites.mjs
//
// The art is a 40×40 cell grid per state in the palette sampled from the
// commissioned emote set (public/images/emotes/), so status Scott and emote
// Scott are the same person. Props take the site's signal colours: cyan for
// live and rest (laptop screen, Zs), amber for move (mug, dumbbell, heart),
// green for confirmed (cap, ECG). Output is crisp-edged SVG: one <rect> per
// horizontal run, grouped into layers so a few cells can animate (a blink,
// rising Zs, a wagging tail) without a sprite sheet. Reduced motion stills
// everything and shows the resting frame.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'images', 'status');

const PAL = {
  K: '#141514', // outline
  H: '#d0a43d', h: '#c38a2c', // hair
  S: '#ebceb5', s: '#d78c68', // skin, shadow
  B: '#c06230', b: '#a34a1b', // beard
  W: '#ffffff', E: '#64a8e5', // eye white, iris
  M: '#861a27', // mouth
  T: '#343542', t: '#2a2b35', // tee
  L: '#5bb53f', l: '#d1d85c', // tee mark
  D: '#8a5a28', d: '#6b4420', // desk
  P: '#bfbdaa', p: '#9a9888', // laptop shell
  C: '#49e0ff', // console cyan
  A: '#ffb400', a: '#b57f00', // instrument amber
  R: '#ae3342', r: '#861a27', // headband
  G: '#3ddc73', g: '#2a9a50', // signal green
  N: '#8b95a2', // dim
  Q: '#dfe6ee', // readout text (pillow, duvet hem)
  U: '#324861', u: '#28365e', // duvet
  X: '#a34a1b', x: '#7a3512', Y: '#d78c68', // dachshund
};

const W = 40;
const Hh = 40;
const blank = (w = W) => Array.from({ length: Hh }, () => Array(w).fill('.'));

// Paste a block of rows at (x, y). '.' and ' ' are transparent; '_' clears.
function paste(g, x, y, rows) {
  rows.forEach((row, j) => {
    [...row].forEach((ch, i) => {
      if (ch === ' ' || ch === '.') return;
      const yy = y + j;
      const xx = x + i;
      if (yy < 0 || yy >= Hh || xx < 0 || xx >= g[0].length) return;
      g[yy][xx] = ch === '_' ? '.' : ch;
    });
  });
}

const flip = (rows) => rows.map((r) => [...r].reverse().join(''));

// ---- Scott: head and shoulders ----
const HEAD = [
  '..KKKKKKKKKK....',
  '.KHHHHHHHHHHK...',
  'KHHHHHHHHHHHHK..',
  'KHHHHHHHHHHHHHK.',
  'KHHhHHHHHHhHHHK.',
  'KHHSSSHHSSSSHHK.',
  'KHSSSSSSSSSSSSHK',
  'KHShhhSSSShhhSHK', // brows
  'KSSKKKKKSSKKKKKS',
  'SSSKWEEKKKKWEEKS',
  'SSSKWEEKSSKWEEKS',
  'KSSKKKKKSSKKKKKS',
  'KSSSSSSSsSSSSSSK',
  'KBSSSSSSsSSSSSBK',
  'KBBSSSSSSSSSSBBK',
  'KBBBBBBBBBBBBBBK',
  'KBBBBBMMMMBBBBBK',
  'KBBBBBBBBBBBBBBK',
  'KbBBBBBBBBBBBBbK',
  '.KbbBBBBBBBBbbK.',
  '..KKbbbbbbbbKK..',
  '....KKssssKK....',
  '.....KssssK.....',
];
const EARS_L = ['K', 'KS', 'KS', 'K'];
const EARS_R = ['K', 'SK', 'SK', 'K'];
const BODY = [
  '..KKKKKKKtttttttKKKKKKK..',
  '.KTTTTTTTtTTTTTTtTTTTTTK.',
  'KTTTTTTTTTTTTTTTTTTTTTTTK',
  'KTTTTTTTTTTTTTTTTTTTTTTTK',
  'KTTTTTTTTTTLLTTTTTTTTTTTK',
  'KTTTTTTTTTTlLTTTTTTTTTTTK',
  'KTTTTTTTTTTLlTTTTTTTTTTTK',
  'KTTTTTTTTTTTTTTTTTTTTTTTK',
  'KTTTTTTTTTTTTTTTTTTTTTTTK',
  'KTTTTTTTTTTTTTTTTTTTTTTTK',
  'KTTTTTTTTTTTTTTTTTTTTTTTK',
  'KTTTTTTTTTTTTTTTTTTTTTTTK',
  'KTTTTTTTTTTTTTTTTTTTTTTTK',
  'KTTTTTTTTTTTTTTTTTTTTTTTK',
];

function scott(g, { eyes = 'open', mouth = 'flat' } = {}) {
  paste(g, 12, 3, HEAD);
  paste(g, 10, 11, EARS_L);
  paste(g, 28, 11, EARS_R);
  paste(g, 8, 26, BODY);
  if (eyes === 'closed') {
    paste(g, 16, 12, ['SSS', 'KKK']);
    paste(g, 23, 12, ['SSS', 'KKK']);
  }
  if (eyes === 'side') {
    paste(g, 16, 12, ['EEW', 'EEW']);
    paste(g, 23, 12, ['EEW', 'EEW']);
  }
  if (mouth === 'open') paste(g, 17, 19, ['MMWWMM']);
  if (mouth === 'smile') paste(g, 17, 19, ['BMMMMB', 'KBMMBK']);
  if (mouth === 'none') paste(g, 17, 19, ['BBBBBB']);
}

// The closed-eye frame used by the blink: lids over both lenses.
function lids() {
  const g = blank();
  paste(g, 16, 12, ['SSS', 'KKK']);
  paste(g, 23, 12, ['SSS', 'KKK']);
  return g;
}

const DOG = [
  '..K...........KK..',
  '.KXK.........KXXK.',
  'KXXXK.......KXXXXK',
  'KXXXKKKKKKKKXXXXXK',
  'KXXXXXXXXXXXCXXKXK',
  'KxXXXXXXXXXXCXXXXK',
  '.KYYYYYYYYYYCYYKK.',
];
const DOG_LEGS_A = ['..KKxKK..KKxKK....', '..KKKKK..KKKKK....'];
const DOG_LEGS_B = ['...KKxKK..KKxKK...', '...KKKKK..KKKKK...'];
const DOG_TAIL_UP = ['..K', '.KX', 'KXX'];
const DOG_TAIL_DOWN = ['...', '...', 'KXX'];

// ---- States: each is a list of layers { name, grid, cls } ----
const states = {};

// AWAKE: at the desk with the laptop and an amber mug.
{
  const base = blank();
  scott(base, { mouth: 'smile' });
  paste(base, 0, 34, [
    'KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK',
    'DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD',
    'DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD',
    'dddddddddddddddddddddddddddddddddddddddd',
    'dddddddddddddddddddddddddddddddddddddddd',
    'dddddddddddddddddddddddddddddddddddddddd',
  ]);
  paste(base, 13, 26, [
    'KKKKKKKKKKKKKK',
    'KPPPPPPPPPPPPK',
    'KPPPPPCCPPPPPK',
    'KPPPPCCCCPPPPK',
    'KPPPPPCCPPPPPK',
    'KPPPPPPPPPPPPK',
    'KPPPPPPPPPPPPK',
    'KppppppppppppK',
  ]);
  paste(base, 11, 34, ['KKKKKKKKKKKKKKKKKK', 'KppppppppppppppppK', 'KKKKKKKKKKKKKKKKKK']);
  paste(base, 31, 28, ['.KKKK.', 'KAAAAKK', 'KAAAAKaK', 'KAAAAKaK', 'KAAAAKK', '.KKKK.']);
  const steam1 = blank();
  paste(steam1, 32, 25, ['.N.N', 'N.N.']);
  const steam2 = blank();
  paste(steam2, 32, 24, ['N.N.', '.N.N']);
  states.awake = [
    { name: 'base', grid: base },
    { name: 'lids', grid: lids(), cls: 'blink' },
    { name: 'steam-a', grid: steam1, cls: 'f1' },
    { name: 'steam-b', grid: steam2, cls: 'f2' },
  ];
}

// ASLEEP: pillow, duvet, eyes shut, Zs rising.
{
  const base = blank();
  paste(base, 6, 8, [
    '..KKKKKKKKKKKKKKKKKKKKKKKKKK..',
    '.KQQQQQQQQQQQQQQQQQQQQQQQQQQK.',
    ...Array(12).fill('KQQQQQQQQQQQQQQQQQQQQQQQQQQQQK'),
    '.KNNNNNNNNNNNNNNNNNNNNNNNNNNK.',
    '..KKKKKKKKKKKKKKKKKKKKKKKKKK..',
  ]);
  scott(base, { eyes: 'closed', mouth: 'none' });
  paste(base, 0, 27, [
    'KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK',
    'QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ',
    'QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ',
    'KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK',
    'UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU',
    'UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU',
    'UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU',
    'uUUUUUUUUUuUUUUUUUUUUuUUUUUUUUUUuUUUUUUU',
    'UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU',
    'UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU',
    'UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU',
    'UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU',
    'uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu',
  ]);
  const z1 = blank();
  paste(z1, 30, 8, ['CCC', '..C', '.C.', 'CCC']);
  const z2 = blank();
  paste(z2, 34, 3, ['CCCC', '...C', '..C.', '.C..', 'CCCC']);
  states.asleep = [
    { name: 'base', grid: base },
    { name: 'z-small', grid: z1, cls: 'z1' },
    { name: 'z-big', grid: z2, cls: 'z2' },
  ];
}

// WORKING OUT: headband, open mouth, an amber dumbbell doing reps.
{
  const base = blank();
  scott(base, { mouth: 'open' });
  paste(base, 12, 7, ['KRRRRRRRRRRRRRRK', 'KRrRRRRRRRRRRrRK']);
  const bell = blank();
  const plate = ['KKKK.', 'KAAAK', 'KAAAK', 'KAAAK', 'KAAAK', 'KAAAK', 'KAAAK', 'KAAAK', 'KKKK.'];
  paste(bell, 2, 27, plate);
  paste(bell, 33, 27, flip(plate));
  paste(bell, 6, 30, ['KKKKKKKKKKKKKKKKKKKKKKKKKKKK', 'NNNNNNNNNNNNNNNNNNNNNNNNNNNN', 'KKKKKKKKKKKKKKKKKKKKKKKKKKKK']);
  paste(bell, 8, 29, ['KSSSK', 'KSSSK', 'KSSSK', 'KKKKK']);
  paste(bell, 27, 29, ['KSSSK', 'KSSSK', 'KSSSK', 'KKKKK']);
  const sweat = blank();
  paste(sweat, 30, 9, ['C', 'CC']);
  states['working-out'] = [
    { name: 'base', grid: base },
    { name: 'lids', grid: lids(), cls: 'blink' },
    { name: 'dumbbell', grid: bell, cls: 'reps' },
    { name: 'sweat', grid: sweat, cls: 'drip' },
  ];
}

// WALKING: green cap, eyes on the path, two dachshunds on leads.
{
  const base = blank();
  scott(base, { eyes: 'side', mouth: 'smile' });
  paste(base, 12, 1, [
    '...KKKKKKKKK....',
    '..KGGGGGGGGGK...',
    '.KGGGGGGGGGGGK..',
    'KGGGGGGGGGGGGGK.',
    'KGGGGGGGGGGGGGKKKKKK',
    'KgggggggggggggggggggK',
    'KKKKKKKKKKKKKKKKKKKK',
  ]);
  // hands holding the leads, which drop straight down to the collars
  paste(base, 9, 29, ['KKKK', 'KSSK', 'KKKK']);
  paste(base, 27, 29, ['KKKK', 'KSSK', 'KKKK']);
  paste(base, 12, 32, ['K', 'K', 'K']);
  paste(base, 27, 32, ['K', 'K', 'K']);
  // two dachshunds, nose to nose under him: one facing right, one facing left
  paste(base, 0, 31, DOG);
  paste(base, 12, 33, ['xx', 'xx']);
  paste(base, 22, 31, flip(DOG));
  paste(base, 26, 33, ['xx', 'xx']);
  const legsA = blank();
  paste(legsA, 0, 38, DOG_LEGS_A);
  paste(legsA, 22, 38, flip(DOG_LEGS_A));
  const legsB = blank();
  paste(legsB, 0, 38, DOG_LEGS_B);
  paste(legsB, 22, 38, flip(DOG_LEGS_B));
  const tailUp = blank();
  paste(tailUp, 0, 30, DOG_TAIL_UP);
  paste(tailUp, 37, 30, flip(DOG_TAIL_UP));
  const tailDown = blank();
  paste(tailDown, 0, 30, DOG_TAIL_DOWN);
  paste(tailDown, 37, 30, flip(DOG_TAIL_DOWN));
  states.walking = [
    { name: 'base', grid: base },
    { name: 'lids', grid: lids(), cls: 'blink' },
    { name: 'legs-a', grid: legsA, cls: 'f1' },
    { name: 'legs-b', grid: legsB, cls: 'f2' },
    { name: 'tail-up', grid: tailUp, cls: 'f1' },
    { name: 'tail-down', grid: tailDown, cls: 'f2' },
  ];
}

// ACTIVE: heart rate up. An amber heart beating, flushed, a live trace on the tee.
{
  const base = blank();
  scott(base, { mouth: 'open' });
  paste(base, 13, 15, ['s']);
  paste(base, 26, 15, ['s']);
  const heartSmall = blank();
  paste(heartSmall, 31, 2, ['.KK.KK.', 'KAAKAAK', 'KAAAAAK', '.KAAAK.', '..KAK..', '...K...']);
  const heartBig = blank();
  paste(heartBig, 30, 1, ['.KK..KK.', 'KAAKKAAK', 'KAAAAAAK', 'KAAAAAAK', '.KAAAAK.', '..KAAK..', '...KK...']);
  const sweat = blank();
  paste(sweat, 29, 8, ['C', 'CC']);
  // ECG trace on the tee: a 14-cell beat repeated across a grid one beat wider
  // than the canvas, scrolled left by one beat per cycle behind a clip.
  const BEAT = ['.....G........', 'GGGG.G.GGGGGGG', '......G.......'];
  const trace = blank(54);
  paste(trace, 0, 33, BEAT.map((r) => r.repeat(4).slice(0, 54)));
  states.active = [
    { name: 'base', grid: base },
    { name: 'lids', grid: lids(), cls: 'blink' },
    { name: 'heart-small', grid: heartSmall, cls: 'f1 beat' },
    { name: 'heart-big', grid: heartBig, cls: 'f2 beat' },
    { name: 'sweat', grid: sweat, cls: 'drip' },
    { name: 'trace', grid: trace, cls: 'trace', clip: 'M9 33h23v3H9z' },
  ];
}

// ---- Emit ----
function rects(g) {
  const out = [];
  for (let y = 0; y < Hh; y++) {
    const w = g[y].length;
    let x = 0;
    while (x < w) {
      const c = g[y][x];
      if (c === '.' || !PAL[c]) {
        x++;
        continue;
      }
      let run = 1;
      while (x + run < w && g[y][x + run] === c) run++;
      out.push(`<rect x="${x}" y="${y}" width="${run}" height="1" fill="${PAL[c]}"/>`);
      x += run;
    }
  }
  return out.join('');
}

const STYLE = `
    .f2, .z1, .z2 { opacity: 0; }
    .blink { opacity: 0; animation: blink 4.8s steps(1, end) infinite; }
    .f1 { animation: f1 1.2s steps(1, end) infinite; }
    .f2 { animation: f2 1.2s steps(1, end) infinite; }
    .beat.f1 { animation-duration: 0.9s; }
    .beat.f2 { animation-duration: 0.9s; }
    .z1 { animation: rise 3.2s steps(4, end) infinite; }
    .z2 { animation: rise 3.2s steps(4, end) infinite 1.1s; }
    .reps { animation: reps 1.6s steps(1, end) infinite; }
    .drip { animation: drip 2.4s steps(3, end) infinite; }
    .trace { animation: trace 2.8s steps(14, end) infinite; }
    @keyframes blink { 0%, 93% { opacity: 0; } 94%, 97% { opacity: 1; } 98%, 100% { opacity: 0; } }
    @keyframes f1 { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
    @keyframes f2 { 0%, 49% { opacity: 0; } 50%, 100% { opacity: 1; } }
    @keyframes rise { 0% { opacity: 0; transform: translateY(0); } 25% { opacity: 1; } 100% { opacity: 0; transform: translateY(-4px); } }
    @keyframes reps { 0%, 49% { transform: translateY(0); } 50%, 100% { transform: translateY(-2px); } }
    @keyframes drip { 0% { opacity: 1; transform: translateY(0); } 66% { opacity: 1; transform: translateY(2px); } 100% { opacity: 0; transform: translateY(3px); } }
    @keyframes trace { from { transform: translateX(0); } to { transform: translateX(-14px); } }
    @media (prefers-reduced-motion: reduce) {
      * { animation: none !important; }
      .f2, .blink, .z2 { opacity: 0 !important; }
      .f1, .z1 { opacity: 1 !important; }
    }
`;

const LABELS = {
  awake: 'Pixel Scott, awake at his desk',
  asleep: 'Pixel Scott, asleep',
  'working-out': 'Pixel Scott, working out',
  walking: 'Pixel Scott, out walking the dachshunds',
  active: 'Pixel Scott, up and active',
};

fs.mkdirSync(OUT, { recursive: true });
for (const [name, layers] of Object.entries(states)) {
  const clips = layers
    .filter((l) => l.clip)
    .map((l) => `  <clipPath id="${l.name}-clip"><path d="${l.clip}"/></clipPath>`)
    .join('\n');
  const body = layers
    .map((l) => {
      const g = `<g id="${l.name}"${l.cls ? ` class="${l.cls}"` : ''}>${rects(l.grid)}</g>`;
      return l.clip ? `  <g clip-path="url(#${l.name}-clip)">${g}</g>` : `  ${g}`;
    })
    .join('\n');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="240" height="240" shape-rendering="crispEdges" role="img" aria-label="${LABELS[name]}">
  <!-- Generated by scripts/status-sprites.mjs; edit the grid there, not this file. -->
  <style>${STYLE}  </style>
${clips ? clips + '\n' : ''}${body}
</svg>
`;
  fs.writeFileSync(path.join(OUT, `scott-${name}.svg`), svg);
}
console.log(`wrote ${Object.keys(states).length} sprites to ${OUT}`);
