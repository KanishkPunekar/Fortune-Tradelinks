/**
 * Build step 3 of 3: prerender every page to static HTML.
 *
 * Reads the client build (dist/index.html) as a template, renders each route
 * with the SSR build (dist-ssr/entry-server.js), and writes:
 *   dist/index.html, dist/about-us.html, ... one file per page
 *   dist/404.html
 *   dist/sitemap.xml, dist/robots.txt
 * Every page's content is therefore readable with JavaScript disabled.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(root, 'dist');
const ssrDir = path.join(root, 'dist-ssr');

const MODULE_SCRIPT = /<script type="module" crossorigin src="[^"]+"/;

let template = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');
for (const marker of ['<!--app-head-->', '<!--app-html-->', '<div id="root">']) {
  if (!template.includes(marker)) throw new Error(`dist/index.html is missing ${marker}`);
}
if (!MODULE_SCRIPT.test(template)) throw new Error('dist/index.html is missing the module script tag');

// If the app bundle fails to load, fall back to the no-JS layout (nav visible, no dead Menu toggle).
template = template.replace(MODULE_SCRIPT, (tag) => `${tag} onerror="document.documentElement.className='no-js'"`);

// Preload the four Latin web fonts so they don't wait for the stylesheet to be parsed.
const FONT_FILE = /^(archivo-latin-(600|700)|source-sans-3-latin-(400|600))-normal-[\w-]+\.woff2$/;
const fontPreloads = fs
  .readdirSync(path.join(distDir, 'assets'))
  .filter((f) => FONT_FILE.test(f))
  .sort()
  .map((f) => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin />`);
if (fontPreloads.length !== 4) throw new Error(`Expected 4 Latin font files in dist/assets, found ${fontPreloads.length}`);

const { render, pageList, notFoundMeta, site, buildHeadHtml, absoluteUrl } = await import(
  pathToFileURL(path.join(ssrDir, 'entry-server.js')).href
);

function writePage(file, url, meta, { notFound = false } = {}) {
  // Replacer functions, so "$&"-style sequences in page content are never treated as patterns.
  let html = template
    .replace('<!--app-head-->', () => [...fontPreloads, buildHeadHtml(meta)].join('\n    '))
    .replace('<!--app-html-->', () => render(url));
  // 404.html is rendered fresh on the client instead of hydrated (see src/main.tsx).
  if (notFound) html = html.replace('<div id="root">', '<div id="root" data-not-found>');
  fs.writeFileSync(path.join(distDir, file), html);
  console.log(`  ${url.padEnd(24)} → dist/${file}`);
}

console.log('Prerendering pages:');
for (const meta of pageList) {
  const file = meta.path === '/' ? 'index.html' : `${meta.path.slice(1)}.html`;
  writePage(file, meta.path, meta);
}
writePage('404.html', notFoundMeta.path, notFoundMeta, { notFound: true });

const indexable = pageList.filter((p) => !p.noindex);
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...indexable.map((p) => `  <url><loc>${absoluteUrl(p.path)}</loc></url>`),
  '</urlset>',
  '',
].join('\n');
fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap);

const robots = ['User-agent: *', 'Allow: /', '', `Sitemap: ${absoluteUrl('/sitemap.xml')}`, ''].join('\n');
fs.writeFileSync(path.join(distDir, 'robots.txt'), robots);
console.log(`  sitemap.xml (${indexable.length} URLs), robots.txt`);

fs.rmSync(ssrDir, { recursive: true, force: true });

if (!site.formEndpoint) {
  console.warn(
    '\n⚠  site.formEndpoint is empty: the Request a Quote form is not connected.\n' +
      '   This build shows the error state (with the sales email) on submit.\n' +
      '   Set formEndpoint in src/config/site.ts before launch.',
  );
}
