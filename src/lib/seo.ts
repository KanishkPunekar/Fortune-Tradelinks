import { hasAddress, hasPhone, logo, site } from '../config/site';
import type { PageMeta } from '../config/pages';

/**
 * Per-page <head> tags (Section 11). The same tag list is written into the
 * prerendered HTML (buildHeadHtml) and re-applied on client-side navigation
 * (applyHead), so both stay identical.
 */

/** Default share image: the logo lockup on white (1200 x 630), made by `npm run brand`. */
export const shareImagePath = '/images/og-default.png';
/** [PROPOSED COPY] Alt text for the share image. */
const shareImageAlt = 'Fortune Tradelinks logo';

/** Marks the tags this module manages, so they can be replaced on navigation. */
const MANAGED_ATTR = 'data-head';

type HeadTag =
  | { tag: 'meta'; attrs: Record<string, string> }
  | { tag: 'link'; attrs: Record<string, string> }
  | { tag: 'script'; attrs: Record<string, string>; text: string };

export function absoluteUrl(path: string): string {
  return `${site.url.replace(/\/+$/, '')}${path === '/' ? '/' : path}`;
}

/** Organization JSON-LD: name, url and email only; phone and address once real. */
function organizationJsonLd(): string {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    url: absoluteUrl('/'),
    logo: absoluteUrl(logo.src),
    email: site.emailInfo,
  };
  if (hasPhone) data.telephone = site.phone;
  if (hasAddress) data.address = site.address;
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

function headTags(meta: PageMeta): HeadTag[] {
  const image = absoluteUrl(shareImagePath);
  const tags: HeadTag[] = [{ tag: 'meta', attrs: { name: 'description', content: meta.description } }];

  if (meta.noindex) {
    tags.push({ tag: 'meta', attrs: { name: 'robots', content: 'noindex' } });
  } else {
    const url = absoluteUrl(meta.path);
    tags.push(
      { tag: 'link', attrs: { rel: 'canonical', href: url } },
      { tag: 'meta', attrs: { property: 'og:url', content: url } },
    );
  }

  tags.push(
    { tag: 'meta', attrs: { property: 'og:type', content: 'website' } },
    { tag: 'meta', attrs: { property: 'og:site_name', content: site.name } },
    { tag: 'meta', attrs: { property: 'og:locale', content: 'en_IN' } },
    { tag: 'meta', attrs: { property: 'og:title', content: meta.title } },
    { tag: 'meta', attrs: { property: 'og:description', content: meta.description } },
    { tag: 'meta', attrs: { property: 'og:image', content: image } },
    { tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
    { tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
    { tag: 'meta', attrs: { property: 'og:image:alt', content: shareImageAlt } },
    { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
    { tag: 'meta', attrs: { name: 'twitter:title', content: meta.title } },
    { tag: 'meta', attrs: { name: 'twitter:description', content: meta.description } },
    { tag: 'meta', attrs: { name: 'twitter:image', content: image } },
    { tag: 'meta', attrs: { name: 'twitter:image:alt', content: shareImageAlt } },
    { tag: 'script', attrs: { type: 'application/ld+json' }, text: organizationJsonLd() },
  );
  return tags;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function attrsToHtml(attrs: Record<string, string>): string {
  return Object.entries(attrs)
    .map(([key, value]) => ` ${key}="${escapeHtml(value)}"`)
    .join('');
}

/** HTML for the prerendered <head>. */
export function buildHeadHtml(meta: PageMeta): string {
  const lines = [`<title>${escapeHtml(meta.title)}</title>`];
  for (const t of headTags(meta)) {
    const attrs = attrsToHtml({ ...t.attrs, [MANAGED_ATTR]: '' });
    lines.push(t.tag === 'script' ? `<script${attrs}>${t.text}</script>` : `<${t.tag}${attrs} />`);
  }
  return lines.join('\n    ');
}

/** Replace the managed <head> tags in the browser (client-side navigation, dev server). */
export function applyHead(meta: PageMeta): void {
  document.title = meta.title;
  document.head.querySelectorAll(`[${MANAGED_ATTR}]`).forEach((el) => el.remove());
  for (const t of headTags(meta)) {
    const el = document.createElement(t.tag);
    for (const [key, value] of Object.entries(t.attrs)) el.setAttribute(key, value);
    el.setAttribute(MANAGED_ATTR, '');
    if (t.tag === 'script') el.textContent = t.text;
    document.head.appendChild(el);
  }
}
