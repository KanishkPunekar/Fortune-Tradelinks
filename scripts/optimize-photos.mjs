/**
 * Site images. Run with `npm run photos` after adding or replacing any of them.
 *
 * Photos: brand/photos/<source> → public/images/<name>.webp, cropped to the slot's shape and
 * sized at 2x its largest display size, plus <name>-640.webp for phones (used via srcset).
 * Point `images` in src/config/site.ts at the output files.
 *
 * Client logos: brand/clients/<slug>.(png|jpg|jpeg|webp) → src/assets/clients/<slug>.png,
 * with empty margins trimmed so every logo fills its slot similarly. The file name must be the
 * client's `slug` in `clientsSection` (src/config/site.ts); the Home page picks it up by name.
 *
 * Keep originals in brand/ (not public/), so the full-size files aren't published.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = path.join(root, 'brand', 'photos');
const outDir = path.join(root, 'public', 'images');

/**
 * One entry per photo slot. Largest display sizes (CSS px): Home hero 558 x 544 (square-ish;
 * cropped taller at 1024px and 16:10 on phones), Products 537 x 403 (4:3), Logistics 537 x 358 (3:2).
 */
const PHOTOS = [
  { source: 'storage-tanks.png', output: 'home-hero.webp', width: 1200, height: 1200 },
  { source: 'liquid-sample.png', output: 'products.webp', width: 1080, height: 810 },
  { source: 'road-tanker.png', output: 'logistics.webp', width: 1080, height: 720 },
];

for (const photo of PHOTOS) {
  const input = path.join(srcDir, photo.source);
  if (!fs.existsSync(input)) {
    console.warn(`  skipped ${photo.source}: not found in brand/photos/`);
    continue;
  }
  const output = path.join(outDir, photo.output);
  await sharp(input)
    .resize(photo.width, photo.height, { fit: 'cover', position: 'centre', withoutEnlargement: true })
    .webp({ quality: 80, effort: 6 })
    .toFile(output);
  const small = output.replace(/\.webp$/, '-640.webp');
  await sharp(output).resize({ width: 640 }).webp({ quality: 80, effort: 6 }).toFile(small);
  for (const file of [output, small]) {
    const meta = await sharp(file).metadata();
    const kb = (fs.statSync(file).size / 1024).toFixed(0);
    console.log(`  ${photo.source.padEnd(20)} → public/images/${path.basename(file).padEnd(20)} ${meta.width}x${meta.height}, ${kb} KB`);
  }
}

// Client logos: trim the empty (white or transparent) margin, then fit within 480 x 160 px:
// 2x the largest display size (logos show at most 80px tall on the Home page).
const clientsSrc = path.join(root, 'brand', 'clients');
const clientsOut = path.join(root, 'src', 'assets', 'clients');
if (fs.existsSync(clientsSrc)) {
  fs.mkdirSync(clientsOut, { recursive: true });
  for (const file of fs.readdirSync(clientsSrc).filter((f) => /\.(png|jpe?g|webp)$/i.test(f)).sort()) {
    const slug = file.replace(/\.[^.]+$/, '');
    const output = path.join(clientsOut, `${slug}.png`);
    await sharp(path.join(clientsSrc, file))
      .trim({ threshold: 12 })
      .resize({ width: 480, height: 160, fit: 'inside', withoutEnlargement: true })
      .png({ palette: true, quality: 90, effort: 10, compressionLevel: 9 })
      .toFile(output);
    const meta = await sharp(output).metadata();
    const kb = (fs.statSync(output).size / 1024).toFixed(0);
    console.log(`  ${file.padEnd(24)} → src/assets/clients/${path.basename(output).padEnd(24)} ${meta.width}x${meta.height}, ${kb} KB`);
  }
}
