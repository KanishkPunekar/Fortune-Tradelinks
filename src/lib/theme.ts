/**
 * Light / dark theme, stored as <html data-theme="light|dark">.
 *
 * The inline script in index.html sets the attribute before the page paints: light by
 * default, dark only if the visitor chose it with the toggle. Keep THEME_STORAGE_KEY and
 * THEME_COLORS in sync with that script. Without JavaScript the site stays light.
 */

export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'ft-theme';

/** <meta name="theme-color"> per theme: the browser bar matches the header background. */
const THEME_COLORS: Record<Theme, string> = { light: '#ffffff', dark: '#0b1622' };

export function getTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[theme]);
}

/** Switch theme and remember the choice. */
export function setTheme(theme: Theme): void {
  applyTheme(theme);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage blocked (private mode etc.): the choice lasts for this page only.
  }
}

/** For useSyncExternalStore: notifies when data-theme changes, so every toggle stays in sync. */
export function subscribeTheme(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
}

/** Prerendered HTML doesn't know the theme; React then re-renders with the real one. */
export function getServerTheme(): Theme {
  return 'light';
}
