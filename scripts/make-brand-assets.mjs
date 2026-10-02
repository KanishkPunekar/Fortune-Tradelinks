/**
 * Brand assets from the supplied logo artwork (brand/logo-source.png, the logo on black).
 * Run with `npm run brand` after replacing the artwork; commit the files it writes:
 *
 *   public/images/logo.png        header/footer logo: FT mark + wordmark, transparent, 3x of 52px
 *   public/images/logo-dark.png   the same with the navy recoloured to white, for the dark theme
 *   public/images/og-default.png  1200x630 share card: mark + wordmark + "ETHANOL SUPPLY & TRADING" on white
 *   public/favicon.ico            32 + 48 px, FT mark on a white rounded tile (legible on dark tab strips)
 *   public/favicon-32.png, public/favicon-48.png
 *   public/apple-touch-icon.png   180 px, FT mark on white
 *
 * The slogan line ("SUSTAINABLE ENERGY | STRONGER TOMORROW") is left out: it is a claim the
 * brief (Section 4) says not to publish without the owner's approval.
 *
 * The row/column numbers below are for the current 1536x1024 artwork.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'brand', 'logo-source.png');
const pub = path.join(root, 'public');

const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width;
const H = info.height;
const idx = (x, y) => (y * W + x) * 4;
const maxOf = (i) => Math.max(data[i], data[i + 1], data[i + 2]);

// 1. Retouch: the leaf-vein tips are shaded towards black in the artwork, which reads as a
//    dark dash on white. Replace those dark pixels with the brightest nearby leaf colour.
const RETOUCH_BOXES = [
  { x0: 295, x1: 340, y0: 395, y1: 425 }, // big leaf, upper vein tip
  { x0: 145, x1: 165, y0: 552, y1: 572 }, // big leaf, lower end
  { x0: 755, x1: 775, y0: 400, y1: 420 }, // small leaf in the "O"
];
for (const b of RETOUCH_BOXES) {
  for (let y = b.y0; y <= b.y1; y++) {
    for (let x = b.x0; x <= b.x1; x++) {
      const i = idx(x, y);
      const m = maxOf(i);
      if (m <= 24) continue; // background
      let best = m;
      let bestI = i;
      for (let dy = -5; dy <= 5; dy++) {
        for (let dx = -5; dx <= 5; dx++) {
          const j = idx(x + dx, y + dy);
          const mj = maxOf(j);
          if (mj > best) {
            best = mj;
            bestI = j;
          }
        }
      }
      if (m < 0.7 * best) {
        data[i] = data[bestI];
        data[i + 1] = data[bestI + 1];
        data[i + 2] = data[bestI + 2];
      }
    }
  }
}

// 2. Cut out of the black background. Interior pixels are kept; pixels within 2px of the
//    background are matted against black (P = alpha * F, F = the nearest solid colour), so
//    edges keep their colour instead of a dark fringe.
const maxc = new Uint8Array(W * H);
for (let p = 0; p < W * H; p++) maxc[p] = maxOf(p * 4);
const BG = 24; // #000 plus a faint glow; the darkest logo colour has a max channel of ~79
const isBg = (x, y) => maxc[y * W + x] <= BG;
const out = Buffer.alloc(W * H * 4);

for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const i = idx(x, y);
    if (maxc[y * W + x] <= BG) continue; // transparent
    let edge = false;
    for (let dy = -2; dy <= 2 && !edge; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        const xx = x + dx;
        const yy = y + dy;
        if (xx >= 0 && yy >= 0 && xx < W && yy < H && isBg(xx, yy)) {
          edge = true;
          break;
        }
      }
    }
    if (!edge) {
      out[i] = data[i];
      out[i + 1] = data[i + 1];
      out[i + 2] = data[i + 2];
      out[i + 3] = 255;
      continue;
    }
    let best = -1;
    let F = i;
    for (let dy = -3; dy <= 3; dy++) {
      for (let dx = -3; dx <= 3; dx++) {
        const xx = x + dx;
        const yy = y + dy;
        if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue;
        if (maxc[yy * W + xx] > best) {
          best = maxc[yy * W + xx];
          F = idx(xx, yy);
        }
      }
    }
    if (best < 60) continue; // isolated glow speck: no solid colour nearby
    const dot = data[i] * data[F] + data[i + 1] * data[F + 1] + data[i + 2] * data[F + 2];
    const ff = data[F] ** 2 + data[F + 1] ** 2 + data[F + 2] ** 2;
    let a = Math.max(0, Math.min(1, dot / ff));
    if (a < 0.16) a = 0;
    out[i] = data[F];
    out[i + 1] = data[F + 1];
    out[i + 2] = data[F + 2];
    out[i + 3] = Math.round(a * 255);
  }
}

const raw = (buf) => sharp(buf, { raw: { width: W, height: H, channels: 4 } });

function bbox(buf, y0, y1) {
  let x0 = W, x1 = 0, t = H, b = 0;
  for (let y = y0; y <= y1; y++) {
    for (let x = 0; x < W; x++) {
      if (buf[idx(x, y) + 3] > 20) {
        x0 = Math.min(x0, x);
        x1 = Math.max(x1, x);
        t = Math.min(t, y);
        b = Math.max(b, y);
      }
    }
  }
  return { left: x0, top: t, width: x1 - x0 + 1, height: b - t + 1 };
}
const pad = (r, p) => ({ left: r.left - p, top: r.top - p, width: r.width + 2 * p, height: r.height + 2 * p });

// Rows in the artwork: 237–602 mark + wordmark, 647–680 "ETHANOL SUPPLY & TRADING", 739–765 slogan.
const mainBox = pad(bbox(out, 225, 615), 4);
const lockupBox = pad(bbox(out, 225, 690), 6);

// The FT mark: the T crossbar (rows above 331) reaches x=594, over the wordmark, which starts
// at x=572 from row 332. So the mark is everything left of x=572 plus the crossbar rows.
const markPixels = Buffer.from(out);
for (let y = 331; y < H; y++) for (let x = 572; x < W; x++) markPixels[idx(x, y) + 3] = 0;
const markBox = pad(bbox(markPixels, 225, 615), 2);

const PALETTE = { palette: true, quality: 90, effort: 10, compressionLevel: 9 };
fs.mkdirSync(path.join(pub, 'images'), { recursive: true });

// Header / footer logo: shown at most 52px tall, so 156px covers 3x screens.
const logoFile = path.join(pub, 'images', 'logo.png');
await raw(out).extract(mainBox).resize({ height: 156 }).png(PALETTE).toFile(logoFile);
const logoMeta = await sharp(logoFile).metadata();

// Dark-theme logo: the navy/blue parts (the T and "FORTUNE") recoloured to near-white so they
// show on the dark background; the greens and the grey droplet highlight are unchanged.
const outDark = Buffer.from(out);
for (let p = 0; p < W * H; p++) {
  const i = p * 4;
  if (!outDark[i + 3]) continue;
  const r = outDark[i];
  const g = outDark[i + 1];
  const b = outDark[i + 2];
  if (b > r + 15 && b >= g - 5) {
    outDark[i] = 241;
    outDark[i + 1] = 245;
    outDark[i + 2] = 249;
  }
}
await raw(outDark).extract(mainBox).resize({ height: 156 }).png(PALETTE).toFile(path.join(pub, 'images', 'logo-dark.png'));

// Share card.
const lockup = await raw(out).extract(lockupBox).resize({ width: 960 }).png().toBuffer();
const lm = await sharp(lockup).metadata();
await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#ffffff' } })
  .composite([{ input: lockup, left: Math.round((1200 - lm.width) / 2), top: Math.round((630 - lm.height) / 2) }])
  .png(PALETTE)
  .toFile(path.join(pub, 'images', 'og-default.png'));

// Mark on a square canvas with `padding` (fraction of the side) around it.
async function markSquare(side, padding, background) {
  const inner = Math.round(side * (1 - 2 * padding));
  const mark = await raw(markPixels).extract(markBox).resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  const off = Math.round((side - inner) / 2);
  return sharp({ create: { width: side, height: side, channels: 4, background } }).composite([{ input: mark, left: off, top: off }]);
}

// Favicons: a white rounded tile, so the navy T stays visible on dark browser tab strips.
async function faviconTile(size) {
  const radius = Math.round(size * 0.19);
  const tile = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius}" fill="#ffffff"/></svg>`);
  const mark = await (await markSquare(size, 0.08, { r: 0, g: 0, b: 0, alpha: 0 })).png().toBuffer();
  return sharp(tile).composite([{ input: mark }]).png(PALETTE).toBuffer();
}
const fav32 = await faviconTile(32);
const fav48 = await faviconTile(48);
fs.writeFileSync(path.join(pub, 'favicon-32.png'), fav32);
fs.writeFileSync(path.join(pub, 'favicon-48.png'), fav48);

// favicon.ico with PNG-encoded 32 and 48 px entries.
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

// Touch icon: iOS masks the corners, so keep ~12% padding around the mark.
await (await markSquare(180, 0.12, '#ffffff')).png(PALETTE).toFile(path.join(pub, 'apple-touch-icon.png'));

console.log(`logo.png ${logoMeta.width}x${logoMeta.height} — set logo.width/height in src/config/site.ts to match`);
for (const f of ['images/logo.png', 'images/logo-dark.png', 'images/og-default.png', 'favicon.ico', 'favicon-32.png', 'favicon-48.png', 'apple-touch-icon.png']) {
  console.log(`  public/${f.padEnd(22)} ${(fs.statSync(path.join(pub, f)).size / 1024).toFixed(1)} KB`);
}
