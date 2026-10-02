import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router';
import { cx } from '../lib/cx';

export type ButtonVariant = 'primary' | 'secondary' | 'outline';

export interface ButtonLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  /** Internal path ("/request-a-quote") or an external href ("mailto:…", "tel:…"). */
  to: string;
  /** primary = green pill (Request a Quote and other enquiries); secondary = white pill with a green outline. */
  variant?: ButtonVariant;
  size?: 'md' | 'sm';
  children: ReactNode;
}

/** A link styled as a button. Internal paths use client-side routing. */
export function ButtonLink({ to, variant = 'primary', size = 'md', className, children, ...rest }: ButtonLinkProps) {
  const classes = cx('btn', `btn--${variant}`, size === 'sm' && 'btn--sm', className);
  if (to.startsWith('/')) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={to} className={classes} {...rest}>
      {children}
    </a>
  );
}
