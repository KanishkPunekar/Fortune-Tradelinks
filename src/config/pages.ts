/**
 * Page list, SEO metadata (Section 11) and navigation (Section 6).
 * The prerender script builds every page, sitemap.xml and robots.txt from this list.
 */

import { site } from './site';

export interface PageMeta {
  /** Short name for breadcrumbs. */
  label: string;
  path: string;
  title: string;
  description: string;
  /** Exclude from search engines and the sitemap. */
  noindex?: boolean;
}

export const pages = {
  home: {
    label: 'Home',
    path: '/',
    title: 'Fortune Tradelinks | Bulk Ethanol Trading & Supply',
    description:
      'B2B trading and supply of bulk anhydrous denatured ethanol. Fortune Tradelinks coordinates sourcing, tanker transportation and delivery. Request a quote.',
  },
  about: {
    label: 'About Us',
    path: '/about-us',
    title: 'About Us | Fortune Tradelinks',
    description:
      'Fortune Tradelinks is a B2B trading and supply company focused on bulk ethanol, coordinating sourcing, commercial terms and logistics for each transaction.',
  },
  products: {
    label: 'Products',
    path: '/products',
    title: 'Anhydrous Denatured Ethanol | Fortune Tradelinks',
    description:
      'Bulk anhydrous denatured ethanol supplied to applicable specifications, for single loads or recurring supply. Contact us for current availability.',
  },
  ethanolSupply: {
    label: 'Ethanol Supply',
    path: '/ethanol-supply',
    title: 'Bulk Ethanol Supply | Fortune Tradelinks',
    description:
      'Bulk ethanol requirements coordinated from source to destination: availability checks, commercial offers, tanker loading and delivery.',
  },
  industries: {
    label: 'Industries',
    path: '/industries',
    title: 'Industries We Serve | Fortune Tradelinks',
    description:
      'Bulk ethanol supply for eligible industrial, manufacturing, energy and commercial buyers, subject to suitability, availability and regulations.',
  },
  logistics: {
    label: 'Logistics',
    path: '/logistics',
    title: 'Logistics & Transportation | Fortune Tradelinks',
    description:
      'Tanker arrangement, loading, route and delivery coordination for bulk ethanol shipments.',
  },
  quality: {
    label: 'Quality & Documentation',
    path: '/quality-documentation',
    title: 'Quality & Documentation | Fortune Tradelinks',
    description:
      'Product and commercial documentation for bulk ethanol transactions, including COA, tax invoice and e-way bill, as applicable.',
  },
  compliance: {
    label: 'Compliance',
    path: '/compliance',
    title: 'Compliance | Fortune Tradelinks',
    description:
      'How Fortune Tradelinks approaches tax, commercial and transportation requirements for bulk ethanol transactions.',
  },
  quote: {
    label: 'Request a Quote',
    path: '/request-a-quote',
    title: 'Request a Quote for Bulk Ethanol | Fortune Tradelinks',
    description:
      'Share your ethanol quantity, specification, delivery location and date. Our team will respond with availability and commercial terms.',
  },
  contact: {
    label: 'Contact',
    path: '/contact',
    title: 'Contact Us | Fortune Tradelinks',
    description: `Contact Fortune Tradelinks about bulk ethanol requirements. Sales: ${site.emailSales}`,
  },
  privacy: {
    label: 'Privacy Policy',
    path: '/privacy-policy',
    title: 'Privacy Policy | Fortune Tradelinks',
    description:
      'How Fortune Tradelinks collects and uses information submitted through this website.',
  },
  terms: {
    label: 'Terms & Conditions',
    path: '/terms',
    title: 'Terms & Conditions | Fortune Tradelinks',
    description:
      'General terms for using the Fortune Tradelinks website and its quotation information.',
  },
} satisfies Record<string, PageMeta>;

export type PageKey = keyof typeof pages;

/** [PROPOSED COPY] 404 title and description. */
export const notFoundMeta: PageMeta = {
  label: 'Page not found',
  path: '/404',
  title: 'Page not found | Fortune Tradelinks',
  description: "The page you're looking for doesn't exist or has moved.",
  noindex: true,
};

export const pageList: PageMeta[] = Object.values(pages);

/** Normalise "/about-us/" → "/about-us". */
export function normalizePath(pathname: string): string {
  const trimmed = pathname.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
}

export function getPageMeta(pathname: string): PageMeta {
  const path = normalizePath(pathname);
  return pageList.find((p) => p.path === path) ?? notFoundMeta;
}

export interface NavItem {
  label: string;
  to: string;
  /** Desktop header: show as a pill button (primary = Request a Quote, secondary = Contact). */
  button?: 'primary' | 'secondary';
}

/** Header nav, in the order given in Section 6. */
export const headerNav: NavItem[] = [
  { label: 'Home', to: pages.home.path },
  { label: 'About', to: pages.about.path },
  { label: 'Products', to: pages.products.path },
  { label: 'Ethanol Supply', to: pages.ethanolSupply.path },
  { label: 'Logistics', to: pages.logistics.path },
  { label: 'Request a Quote', to: pages.quote.path, button: 'primary' },
  { label: 'Contact', to: pages.contact.path, button: 'secondary' },
];

export const footerQuickLinks: NavItem[] = [
  { label: 'Home', to: pages.home.path },
  { label: 'About Us', to: pages.about.path },
  { label: 'Products', to: pages.products.path },
  { label: 'Ethanol Supply', to: pages.ethanolSupply.path },
  { label: 'Logistics', to: pages.logistics.path },
  { label: 'Request a Quote', to: pages.quote.path },
  { label: 'Contact', to: pages.contact.path },
];

/** Industries is placed here so it isn't orphaned. [TO CONFIRM] */
export const footerMoreLinks: NavItem[] = [
  { label: 'Industries', to: pages.industries.path },
  { label: 'Quality & Documentation', to: pages.quality.path },
  { label: 'Compliance', to: pages.compliance.path },
];

export const footerLegalLinks: NavItem[] = [
  { label: 'Privacy Policy', to: pages.privacy.path },
  { label: 'Terms & Conditions', to: pages.terms.path },
];
