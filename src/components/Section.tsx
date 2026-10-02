import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router';
import { getPageMeta, pages } from '../config/pages';
import { cx } from '../lib/cx';

interface SectionProps {
  /** Rendered as the section's H2. */
  heading?: ReactNode;
  /** Optional anchor id for the section. */
  id?: string;
  /** Light grey band (--color-surface). Use sparingly. */
  alt?: boolean;
  className?: string;
  containerClassName?: string;
  children?: ReactNode;
}

/** A full-width page section with a centred container and an optional H2. */
export function Section({ heading, id, alt = false, className, containerClassName, children }: SectionProps) {
  return (
    <section id={id} className={cx('section', alt ? 'section--alt' : 'section--plain', className)}>
      <div className={cx('container', containerClassName)}>
        {heading && <h2>{heading}</h2>}
        {children}
      </div>
    </section>
  );
}

interface PageHeaderProps {
  /** The page's single H1. */
  title: ReactNode;
  /** Optional intro content under the H1. */
  children?: ReactNode;
  className?: string;
}

/** Top of inner pages: breadcrumb, then the H1 in a rounded brand-green panel. */
export function PageHeader({ title, children, className }: PageHeaderProps) {
  const { pathname } = useLocation();
  const current = getPageMeta(pathname);
  return (
    <div className={cx('page-header', className)}>
      <div className="container">
        <nav aria-label="Breadcrumb" className="breadcrumb">
          <ol role="list">
            <li>
              <Link to={pages.home.path} className="breadcrumb__home">
                <HomeIcon />
                <span className="visually-hidden">{pages.home.label}</span>
              </Link>
            </li>
            <li aria-current="page">{current.label}</li>
          </ol>
        </nav>
        <div className="page-header__panel on-dark">
          <h1>{title}</h1>
          {children && <div className="page-header__intro">{children}</div>}
        </div>
      </div>
    </div>
  );
}

function HomeIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5.5 9v11.5h13V9" />
    </svg>
  );
}
