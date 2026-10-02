/**
 * Central site config (PROJECT_BRIEF.md, Section 7).
 *
 * Every contact detail, placeholder and optional content switch lives here.
 * No page hardcodes these values.
 *
 * A value written as [SQUARE BRACKETS] is a placeholder. While it is a
 * placeholder it renders as visible plain text and is never turned into a
 * tel: or map link. Replace it with the real value before launch.
 */

export interface SiteConfig {
  name: string;
  legalName: string;
  tagline: string;
  /** Canonical origin, no trailing slash. */
  url: string;
  emailSales: string;
  emailInfo: string;
  phone: string;
  address: string;
  /** Optional. Leave empty to hide every GSTIN line. */
  gstin: string;
  /** Google Maps embed on Contact, only if there is a physical office. */
  showMap: boolean;
  /** "Last Updated" on Privacy Policy and Terms & Conditions. */
  legalLastUpdated: string;
  /**
   * Request a Quote submission target. The form POSTs JSON here.
   * Empty = not connected: the dev server logs the payload and shows a
   * "not connected" banner; a production build shows the error state
   * (with the sales email) instead of discarding the submission.
   */
  formEndpoint: string;
}

export const site: SiteConfig = {
  name: 'Fortune Tradelinks',
  legalName: '[LEGAL BUSINESS NAME]',
  tagline: 'Ethanol Trading & Supply',
  url: 'https://www.fortunetradelinks.in', // [TO CONFIRM www vs non-www]
  emailSales: 'sales@fortunetradelinks.in',
  emailInfo: 'info@fortunetradelinks.in',
  phone: '[YOUR BUSINESS MOBILE NUMBER]',
  address: '[YOUR REGISTERED BUSINESS ADDRESS]',
  gstin: '',
  showMap: false,
  legalLastUpdated: '[DATE]',
  formEndpoint: '',
};

export interface SiteImageSource {
  /** Path under public/, e.g. "/images/home-hero.jpg". Empty = a clearly marked placeholder. */
  src: string;
  /** What the photo shows, for screen readers. Required once src is set. */
  alt: string;
  /** Optional responsive sources, e.g. "/images/x-640.webp 640w, /images/x.webp 1200w". */
  srcSet?: string;
  /** Displayed width per layout, for srcSet, e.g. "(min-width: 64em) 40vw, 100vw". */
  sizes?: string;
}

/**
 * Photos. Use neutral industrial imagery only: nothing that implies assets or
 * partners the business doesn't have (no third-party branding, logos or plants
 * presented as "ours"). Put the files in public/images/ and set src + alt.
 */
export const images: Record<'homeHero' | 'products' | 'logistics', SiteImageSource> = {
  // Made from brand/photos/ by `npm run photos`. [PROPOSED COPY] alt text.
  homeHero: {
    src: '/images/home-hero.webp',
    srcSet: '/images/home-hero-640.webp 640w, /images/home-hero.webp 1200w',
    sizes: '(min-width: 64em) 42vw, 100vw',
    alt: 'Large white storage tanks at a bulk liquid terminal',
  },
  products: {
    src: '/images/products.webp',
    srcSet: '/images/products-640.webp 640w, /images/products.webp 1080w',
    sizes: '(min-width: 64em) 40vw, 100vw',
    alt: 'Clear, colourless liquid sample in a glass laboratory flask',
  },
  logistics: {
    src: '/images/logistics.webp',
    srcSet: '/images/logistics-640.webp 640w, /images/logistics.webp 1080w',
    sizes: '(min-width: 64em) 40vw, 100vw',
    alt: 'Road tanker truck on a highway',
  },
};

/**
 * Company logo: FT mark + wordmark, cut out of brand/logo-source.png onto a transparent
 * background by `npm run brand`. width/height must match the file (the script prints them).
 */
export const logo = {
  src: '/images/logo.png',
  /** Dark-theme version: the navy wordmark recoloured to white. Same size. */
  srcDark: '/images/logo-dark.png',
  width: 549,
  height: 156,
};

export interface SpecificationRow {
  label: string;
  value: string;
}

/**
 * Optional content blocks. Each is hidden until the owner confirms it.
 */
export const optionalContent = {
  /**
   * Ethanol Supply page, "Typical Requirements We Handle".
   * Off by default. Only list quantities that can realistically be arranged.
   */
  typicalQuantities: {
    enabled: false,
    items: ['20 KL', '40 KL', '80 KL', '160 KL', 'Larger contracted quantities'],
  },

  /**
   * Products page specification table for Anhydrous Denatured Ethanol.
   * Rows with an empty value are hidden, and the table renders nothing
   * while every value is empty. Never add a price row.
   */
  productSpecification: [
    { label: 'Grade/specification', value: '' },
    { label: 'Available quantities', value: '' },
    { label: 'Packaging/transport mode', value: '' },
    { label: 'Origin/source', value: '' },
    { label: 'Delivery locations', value: '' },
    { label: 'Applicable taxes', value: '' },
    { label: 'Availability', value: '' },
  ] as SpecificationRow[],
};

/** True while a value is empty or still a [BRACKETED] placeholder. */
export function isPlaceholder(value: string): boolean {
  const v = value.trim();
  return v === '' || /^\[[^\]]*\]$/.test(v);
}

/** True once the value is real (not empty, not a placeholder). */
export function hasRealValue(value: string): boolean {
  return !isPlaceholder(value);
}

export const hasPhone = hasRealValue(site.phone);
export const hasAddress = hasRealValue(site.address);
export const hasGstin = hasRealValue(site.gstin);

/** `tel:` href from a display number, e.g. "+91 98765 43210" → "tel:+919876543210". */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}
