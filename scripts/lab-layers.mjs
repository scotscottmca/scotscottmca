// Cuts public/images/emotes/self.png into three layers for the /lab mascot
// scene: Scott, the mini-Scott he is hoisting, and the bin. Same canvas size
// as the source so the layers stack with no offsets.
//
//   node scripts/lab-layers.mjs
//
// The cut is by region, not by drawing: where Scott's arms pass under mini's
// shirt and leg the seam is a straight line. Fine at 48–96px.
import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'images');
const src = path.join(root, 'emotes', 'self.png');
const out = path.join(root, 'lab');

const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;

const inBin = (x, y) => x >= 830 && y >= 830;
const scottArm = (x, y) => (x >= 380 && x < 500 && y >= 440) || (x >= 820 && x < 900 && y >= 395);
const inMini = (x, y) => !inBin(x, y) && !scottArm(x, y) && (y < 470 || (x < 350 && y < 570));

const layers = { scott: (x, y) => !inBin(x, y) && !inMini(x, y), mini: inMini, bin: inBin };

for (const [name, keep] of Object.entries(layers)) {
  const buf = Buffer.from(data);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (!keep(x, y)) buf[(y * W + x) * 4 + 3] = 0;
  await sharp(buf, { raw: { width: W, height: H, channels: 4 } }).png({ palette: true }).toFile(path.join(out, `${name}.png`));
}
console.log('wrote', Object.keys(layers).join(', '), 'to', out);
