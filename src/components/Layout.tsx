import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router';
import { getPageMeta } from '../config/pages';
import { applyHead } from '../lib/seo';
import { Footer } from './Footer';
import { Header } from './Header';

/** decodeURIComponent that returns the raw value for a malformed fragment instead of throwing. */
function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/** Shared shell: skip link, sticky header, <main>, footer, per-page <head> tags. */
export function Layout() {
  const { pathname, hash } = useLocation();
  const meta = getPageMeta(pathname);
  const mainRef = useRef<HTMLElement>(null);
  const previousPath = useRef(pathname);

  useEffect(() => {
    applyHead(meta);
  }, [meta]);

  // On client-side navigation: go to the top (or the #anchor) and move focus to <main>.
  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    const target = hash ? document.getElementById(safeDecode(hash.slice(1))) : null;
    // 'instant' overrides the smooth scroll-behavior on <html>, so the new page doesn't animate up from the old offset.
    if (target) {
      target.scrollIntoView({ behavior: 'instant' });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
    mainRef.current?.focus({ preventScroll: true });
  }, [pathname, hash]);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main" ref={mainRef} tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
