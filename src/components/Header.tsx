import { useCallback, useEffect, useId, useRef, useState, type FocusEvent } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { headerNav, pages } from '../config/pages';
import { logo, site } from '../config/site';
import { cx } from '../lib/cx';
import { EmailLink, PhoneValue } from './ContactValues';
import { ThemeToggle } from './ThemeToggle';
import './Header.css';

/** Full nav on one line from here up. Keep in sync with the 64em queries in Header.css. */
const DESKTOP_QUERY = '(min-width: 64em)';

/** Up to this width the header shows the leaf mark alone. Header.css uses the identical query. */
const MARK_ONLY_QUERY = '(max-width: 26.24em)';

/**
 * The header logo for one theme (CSS shows the one matching <html data-theme>). The <source>
 * swaps in the leaf mark on small phones, so each screen downloads only the image it shows.
 */
function HeaderLogo({ theme }: { theme: 'light' | 'dark' }) {
  return (
    <picture className={theme === 'dark' ? 'logo-variant--dark' : 'logo-variant--light'}>
      <source media={MARK_ONLY_QUERY} srcSet={logo.markSrc} width={logo.markWidth} height={logo.markHeight} />
      <img
        src={theme === 'dark' ? logo.srcDark : logo.src}
        width={logo.width}
        height={logo.height}
        alt={site.name}
        className="site-header__logo"
        loading={theme === 'dark' ? 'lazy' : undefined}
      />
    </picture>
  );
}

/** The primary nav button ("Request a Quote"), also shown as a persistent button in the narrow bar. */
const quoteItem = headerNav.find((item) => item.button === 'primary');

/**
 * Sticky site header: logo, main nav and, on narrow screens, a persistent
 * Request a Quote button plus a Menu toggle that opens the nav as a panel.
 * Without JavaScript (`html.no-js`) the toggle is hidden and the nav shows as a wrapped row.
 */
export function Header() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const { pathname } = useLocation();

  const close = useCallback(() => setOpen(false), []);

  // A panel link was used: close, and keep focus off the now-hidden link.
  // (On a route change Layout then moves focus to <main>.)
  const closeFromPanel = useCallback(() => {
    if (!open) return;
    setOpen(false);
    toggleRef.current?.focus();
  }, [open]);

  // Close on route change.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close when the viewport grows to the desktop layout.
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // While open: Escape closes and returns focus to the toggle; a press outside the header closes.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open]);

  // Tabbing out of the header closes the panel so it never covers the focused element.
  const handleBlur = (event: FocusEvent<HTMLElement>) => {
    const next = event.relatedTarget;
    if (open && next && !event.currentTarget.contains(next)) setOpen(false);
  };

  return (
    <header ref={headerRef} className="site-header" onBlur={handleBlur}>
      <div className="container site-header__bar">
        <div className="site-header__brand-wrap">
          <Link to={pages.home.path} className="site-header__brand" onClick={close}>
            {/* CSS shows one of the two per theme (.logo-variant--*); the hidden one isn't announced. */}
            <HeaderLogo theme="light" />
            <HeaderLogo theme="dark" />
          </Link>
        </div>

        {quoteItem && (
          <NavLink to={quoteItem.to} className="btn btn--primary btn--sm site-header__quote" onClick={close}>
            {quoteItem.label}
          </NavLink>
        )}

        <nav aria-label="Main" className="site-nav">
          <button
            ref={toggleRef}
            type="button"
            className="site-header__toggle"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((value) => !value)}
          >
            <MenuIcon open={open} />
            <span>Menu</span>
          </button>

          <div id={panelId} className={cx('site-nav__panel', open && 'is-open')}>
            <ul className="site-nav__list" role="list">
              {headerNav.map((item) => (
                <li key={item.to} className={cx('site-nav__item', item.button === 'primary' && 'site-nav__item--accent')}>
                  <NavLink
                    to={item.to}
                    end={item.to === pages.home.path}
                    className={navClass(item.button)}
                    onClick={closeFromPanel}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            <ul className="site-header__contact" role="list">
              <li>
                <EmailIcon />
                <EmailLink email={site.emailSales} className="site-header__contact-link" />
              </li>
              <li>
                <PhoneIcon />
                <PhoneValue className="site-header__contact-link" />
              </li>
              {/* Small phones: no room in the bar, so the theme switch lives in the menu. */}
              <li className="site-header__theme-row">
                <ThemeToggle withLabel />
              </li>
            </ul>
          </div>
        </nav>

        {/* Theme switch: right after Contact on desktop; beside the Menu button on tablets. */}
        <ThemeToggle className="site-header__theme" />
      </div>
    </header>
  );
}

/** Primary = green pill; secondary = a link that becomes an outlined pill on desktop. */
function navClass(button: 'primary' | 'secondary' | undefined): string {
  if (button === 'primary') return 'btn btn--primary btn--sm site-nav__quote';
  if (button === 'secondary') return 'site-nav__link site-nav__link--pill';
  return 'site-nav__link';
}

const iconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
} as const;

/** Three bars; a cross while the menu is open. */
function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg className="site-header__toggle-icon" width="22" height="22" {...iconProps}>
      {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 6.5h16M4 12h16M4 17.5h16" />}
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg className="site-header__contact-icon" width="20" height="20" {...iconProps}>
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <path d="M3.5 6l8.5 7 8.5-7" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="site-header__contact-icon" width="20" height="20" {...iconProps}>
      <rect x="6.5" y="2.5" width="11" height="19" rx="2" />
      <path d="M11 18h2" />
    </svg>
  );
}
