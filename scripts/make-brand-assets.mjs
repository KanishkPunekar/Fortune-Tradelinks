/**
 * Brand assets from the supplied logo artwork: brand/logo-source.jpg, the logo on a white
 * background. Run with `npm run brand` after replacing the artwork. It writes:
 *
 *   public/images/logo.png        header/footer logo: leaf mark + wordmark, transparent, 156px tall
 *   public/images/logo-dark.png   the same with the black wordmark in white, for the dark theme
 *   public/images/logo-mark.png   the leaf mark alone, transparent (header on small phones)
 *   public/images/og-default.png  1200x630 share card: the full logo, tagline included, on white
 *   public/favicon.ico            32 + 48 px, the mark on a white rounded tile
 *   public/favicon-32.png, public/favicon-48.png
 *   public/apple-touch-icon.png   180 px, the mark on white
 *
 * The parts of the artwork are found automatically: the mark is everything left of the first
 * clear vertical gap; to its right, the first row of ink is the wordmark and the next one the
 * tagline. The tagline is left out of the header/footer logo, where it would be too small to read.
 *
 * Finally it prints the sizes to copy into `logo` in src/config/site.ts.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'brand', 'logo-source.jpg');
const pub = path.join(root, 'public');

const { data, info } = await sharp(src).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width;
const H = info.height;
const rgb = (x, y) => (y * W + x) * 3;
const rgba = (x, y) => (y * W + x) * 4;

// 1. Background: white, plus the faint noise JPEG compression leaves around it.
const isBg = new Uint8Array(W * H);
for (let p = 0; p < W * H; p++) {
  const r = data[p * 3];
  const g = data[p * 3 + 1];
  const b = data[p * 3 + 2];
  const lo = Math.min(r, g, b);
  isBg[p] = lo >= 238 && Math.max(r, g, b) - lo <= 14 ? 1 : 0;
}
/** How far a pixel is from white (0 = white). */
const ink = (i) => 765 - data[i] - data[i + 1] - data[i + 2];

// White reachable from the edges of the artwork is background. White fully enclosed by the
// mark (the vein in the leaf) is part of the design and stays white. Enclosed white in the
// wordmark (the insides of "o", "e", "a", "d") is background and stays transparent.
const outside = new Uint8Array(W * H);
{
  const stack = [];
  const push = (p) => {
    if (isBg[p] && !outside[p]) {
      outside[p] = 1;
      stack.push(p);
    }
  };
  for (let x = 0; x < W; x++) {
    push(x);
    push((H - 1) * W + x);
  }
  for (let y = 0; y < H; y++) {
    push(y * W);
    push(y * W + W - 1);
  }
  while (stack.length) {
    const p = stack.pop();
    const x = p % W;
    if (x > 0) push(p - 1);
    if (x < W - 1) push(p + 1);
    if (p >= W) push(p - W);
    if (p < W * (H - 1)) push(p + W);
  }
}
/** First column of the wordmark: the mark ends at the first run of 8+ empty columns. */
const columnEmpty = (x) => {
  for (let y = 0; y < H; y++) if (!isBg[y * W + x]) return false;
  return true;
};
const wordmarkStart = (() => {
  let x = 0;
  while (x < W && columnEmpty(x)) x++; // left margin
  while (x < W) {
    while (x < W && !columnEmpty(x)) x++; // a run of ink
    const gapStart = x;
    while (x < W && columnEmpty(x)) x++; // a run of empty columns
    if (x < W && x - gapStart >= 8) return x;
  }
  throw new Error('Could not find the gap between the mark and the wordmark');
})();
for (let p = 0; p < W * H; p++) {
  if (isBg[p] && !outside[p] && p % W < wordmarkStart) isBg[p] = 0; // enclosed white inside the mark
}

// 2. Cut out of the white background. Interior pixels are kept as they are. Pixels within 2px
//    of the background are matted against white (P = a·F + (1 − a)·white, F = the nearest solid
//    colour), so anti-aliased edges keep their colour instead of a pale fringe on dark backgrounds.
const out = Buffer.alloc(W * H * 4);
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const p = y * W + x;
    if (isBg[p]) continue; // transparent
    const i = rgb(x, y);
    const o = rgba(x, y);
    let edge = false;
    for (let dy = -2; dy <= 2 && !edge; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        const xx = x + dx;
        const yy = y + dy;
        if (xx >= 0 && yy >= 0 && xx < W && yy < H && isBg[yy * W + xx]) {
          edge = true;
          break;
        }
      }
    }
    if (!edge) {
      out[o] = data[i];
      out[o + 1] = data[i + 1];
      out[o + 2] = data[i + 2];
      out[o + 3] = 255;
      continue;
    }
    let best = -1;
    let F = i;
    for (let dy = -3; dy <= 3; dy++) {
      for (let dx = -3; dx <= 3; dx++) {
        const xx = x + dx;
        const yy = y + dy;
        if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue;
        const j = rgb(xx, yy);
        if (ink(j) > best) {
          best = ink(j);
          F = j;
        }
      }
    }
    if (best < 60) continue; // isolated compression speck: no solid colour nearby
    const wp = [255 - data[i], 255 - data[i + 1], 255 - data[i + 2]];
    const wf = [255 - data[F], 255 - data[F + 1], 255 - data[F + 2]];
    let a = (wp[0] * wf[0] + wp[1] * wf[1] + wp[2] * wf[2]) / (wf[0] ** 2 + wf[1] ** 2 + wf[2] ** 2);
    a = Math.max(0, Math.min(1, a));
    if (a < 0.12) continue;
    out[o] = data[F];
    out[o + 1] = data[F + 1];
    out[o + 2] = data[F + 2];
    out[o + 3] = Math.round(a * 255);
  }
}

// 3. Find the parts: mark | wordmark / tagline.
const solid = (buf, x, y) => buf[rgba(x, y) + 3] > 40;
function bbox(buf, x0 = 0, x1 = W - 1, y0 = 0, y1 = H - 1) {
  let l = W, r = -1, t = H, b = -1;
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      if (solid(buf, x, y)) {
        l = Math.min(l, x);
        r = Math.max(r, x);
        t = Math.min(t, y);
        b = Math.max(b, y);
      }
    }
  }
  if (r < 0) throw new Error('No artwork found in the region');
  return { left: l, top: t, width: r - l + 1, height: b - t + 1 };
}
const all = bbox(out);
const columnHasInk = (x) => {
  for (let y = all.top; y < all.top + all.height; y++) if (solid(out, x, y)) return true;
  return false;
};
let markRight = -1;
let textLeft = -1;
for (let x = all.left; x < all.left + all.width; x++) {
  if (columnHasInk(x)) continue;
  let gapEnd = x;
  while (gapEnd < all.left + all.width && !columnHasInk(gapEnd)) gapEnd++;
  if (gapEnd - x >= 8) {
    markRight = x - 1;
    textLeft = gapEnd;
    break;
  }
  x = gapEnd;
}
if (markRight < 0) throw new Error('Could not find the gap between the mark and the wordmark');

const textBands = [];
{
  let start = -1;
  for (let y = all.top; y <= all.top + all.height; y++) {
    let any = false;
    for (let x = textLeft; x < all.left + all.width && y < H; x++) {
      if (solid(out, x, y)) {
        any = true;
        break;
      }
    }
    if (any && start < 0) start = y;
    if (!any && start >= 0) {
      textBands.push([start, y - 1]);
      start = -1;
    }
  }
}
const [wordmarkTop, wordmarkBottom] = textBands[0];
const tagline = textBands[1];

const withoutTagline = Buffer.from(out);
if (tagline) {
  for (let y = tagline[0] - 2; y < H; y++) for (let x = textLeft; x < W; x++) withoutTagline[rgba(x, y) + 3] = 0;
}
const markOnly = Buffer.from(out);
for (let y = 0; y < H; y++) for (let x = markRight + 1; x < W; x++) markOnly[rgba(x, y) + 3] = 0;

// Dark-theme version: the black wordmark becomes near-white; the greens are unchanged.
const darkVersion = Buffer.from(withoutTagline);
for (let p = 0; p < W * H; p++) {
  const o = p * 4;
  if (!darkVersion[o + 3]) continue;
  const r = darkVersion[o];
  const g = darkVersion[o + 1];
  const b = darkVersion[o + 2];
  if (Math.max(r, g, b) < 150 && Math.max(r, g, b) - Math.min(r, g, b) < 40) {
    darkVersion[o] = 241;
    darkVersion[o + 1] = 245;
    darkVersion[o + 2] = 249;
  }
}

// 4. Write the files.
const raw = (buf) => sharp(buf, { raw: { width: W, height: H, channels: 4 } });
const pad = (r, p) => ({ left: r.left - p, top: r.top - p, width: r.width + 2 * p, height: r.height + 2 * p });
const PALETTE = { palette: true, quality: 90, effort: 10, compressionLevel: 9 };
fs.mkdirSync(path.join(pub, 'images'), { recursive: true });

// Header/footer logo: shown at most 52px tall, so 156px covers 3x screens.
const lockupBox = pad(bbox(withoutTagline), 3);
await raw(withoutTagline).extract(lockupBox).resize({ height: 156 }).png(PALETTE).toFile(path.join(pub, 'images', 'logo.png'));
await raw(darkVersion).extract(lockupBox).resize({ height: 156 }).png(PALETTE).toFile(path.join(pub, 'images', 'logo-dark.png'));

// The mark alone: shown at most 40px tall in the small-phone header, so 120px covers 3x.
const markBox = pad(bbox(markOnly), 3);
await raw(markOnly).extract(markBox).resize({ height: 120 }).png(PALETTE).toFile(path.join(pub, 'images', 'logo-mark.png'));

// Share card: the complete logo from the original artwork (already on white).
const fullBox = pad(all, 24);
const fullLogo = await sharp(src).extract(fullBox).resize({ width: 1040, height: 520, fit: 'inside' }).png().toBuffer();
const fm = await sharp(fullLogo).metadata();
await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#ffffff' } })
  .composite([{ input: fullLogo, left: Math.round((1200 - fm.width) / 2), top: Math.round((630 - fm.height) / 2) }])
  .png(PALETTE)
  .toFile(path.join(pub, 'images', 'og-default.png'));

// The mark on a square canvas, `padding` (fraction of the side) around it.
async function markSquare(side, padding, background) {
  const inner = Math.round(side * (1 - 2 * padding));
  const mark = await raw(markOnly)
    .extract(markBox)
    .resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  const off = Math.round((side - inner) / 2);
  return sharp({ create: { width: side, height: side, channels: 4, background } }).composite([{ input: mark, left: off, top: off }]);
}

// Favicons: the mark on a white rounded tile, so it stays visible on dark browser tab strips.
async function faviconTile(size) {
  const radius = Math.round(size * 0.19);
  const tile = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius}" fill="#ffffff"/></svg>`,
  );
  const mark = await (await markSquare(size, 0.08, { r: 0, g: 0, b: 0, alpha: 0 })).png().toBuffer();
  return sharp(tile).composite([{ input: mark }]).png(PALETTE).toBuffer();
}
const fav32 = await faviconTile(32);
const fav48 = await faviconTile(48);
fs.writeFileSync(path.join(pub, 'favicon-32.png'), fav32);
fs.writeFileSync(path.join(pub, 'favicon-48.png'), fav48);

// favicon.ico holding PNG-encoded 32 and 48 px images.
function ico(entries) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(entries.length, 4);
  const dirs = [];
  let offset = 6 + 16 * entries.length;
  for (const { size, png } of entries) {
    const d = Buffer.alloc(16);
    d.writeUInt8(size, 0);
    d.writeUInt8(size, 1);
    d.writeUInt16LE(1, 4); // colour planes
    d.writeUInt16LE(32, 6); // bits per pixel
    d.writeUInt32LE(png.length, 8);
    d.writeUInt32LE(offset, 12);
    offset += png.length;
    dirs.push(d);
  }
  return Buffer.concat([header, ...dirs, ...entries.map((e) => e.png)]);
}
fs.writeFileSync(path.join(pub, 'favicon.ico'), ico([{ size: 32, png: fav32 }, { size: 48, png: fav48 }]));

// Touch icon: iOS rounds the corners, so keep ~12% padding around the mark.
await (await markSquare(180, 0.12, '#ffffff')).png(PALETTE).toFile(path.join(pub, 'apple-touch-icon.png'));

// 5. Report.
const logoMeta = await sharp(path.join(pub, 'images', 'logo.png')).metadata();
const markMeta = await sharp(path.join(pub, 'images', 'logo-mark.png')).metadata();
console.log(`Artwork parts: mark x ${all.left}–${markRight}; wordmark x ${textLeft}+, rows ${wordmarkTop}–${wordmarkBottom}; tagline ${tagline ? `rows ${tagline[0]}–${tagline[1]}` : 'none'}`);
console.log(`Set in src/config/site.ts → logo: width ${logoMeta.width}, height ${logoMeta.height}, markWidth ${markMeta.width}, markHeight ${markMeta.height}`);
for (const f of ['images/logo.png', 'images/logo-dark.png', 'images/logo-mark.png', 'images/og-default.png', 'favicon.ico', 'favicon-32.png', 'favicon-48.png', 'apple-touch-icon.png']) {
  console.log(`  public/${f.padEnd(22)} ${(fs.statSync(path.join(pub, f)).size / 1024).toFixed(1)} KB`);
}
