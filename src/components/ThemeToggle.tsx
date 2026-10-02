import { useSyncExternalStore } from 'react';
import { cx } from '../lib/cx';
import { getServerTheme, getTheme, setTheme, subscribeTheme } from '../lib/theme';

interface ThemeToggleProps {
  /** Show the "Dark theme" text beside the icon (used in the mobile menu panel). */
  withLabel?: boolean;
  className?: string;
}

/**
 * Sun / moon button that switches between the light and dark themes.
 * A toggle button: the name stays "Dark theme" and aria-pressed says whether it's on.
 * Both icons are always rendered and CSS shows the right one from <html data-theme>, so
 * the icon is correct from the first paint, before React hydrates.
 */
export function ThemeToggle({ withLabel = false, className }: ThemeToggleProps) {
  const theme = useSyncExternalStore(subscribeTheme, getTheme, getServerTheme);
  const dark = theme === 'dark';

  return (
    <button
      type="button"
      className={cx('theme-toggle', withLabel && 'theme-toggle--labelled', className)}
      aria-pressed={dark}
      aria-label={withLabel ? undefined : 'Dark theme'}
      title={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      onClick={() => setTheme(dark ? 'light' : 'dark')}
    >
      <MoonIcon />
      <SunIcon />
      {withLabel && <span className="theme-toggle__label">Dark theme</span>}
    </button>
  );
}

const iconProps = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
} as const;

/** Shown in the light theme: "switch to dark". */
function MoonIcon() {
  return (
    <svg className="theme-toggle__icon theme-toggle__icon--moon" {...iconProps}>
      <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z" />
    </svg>
  );
}

/** Shown in the dark theme: "switch to light". */
function SunIcon() {
  return (
    <svg className="theme-toggle__icon theme-toggle__icon--sun" {...iconProps}>
      <circle cx="12" cy="12" r="4.25" />
      <path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" />
    </svg>
  );
}
