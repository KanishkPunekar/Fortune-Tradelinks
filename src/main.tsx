import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App';

// Static hosts may serve a page at "/about-us.html"; route it as "/about-us".
const { pathname, search, hash } = window.location;
if (pathname.endsWith('.html')) {
  const clean = pathname.replace(/(index)?\.html$/, '').replace(/(.)\/$/, '$1') || '/';
  window.history.replaceState(null, '', `${clean}${search}${hash}`);
}

const container = document.getElementById('root')!;
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// Prerendered pages already contain markup; the dev server serves an empty shell.
// 404.html is served for any unknown URL, and a host may also serve it for a URL the
// router does match (e.g. "/about-us/"), so it is rendered fresh rather than hydrated.
if (container.firstElementChild && !container.hasAttribute('data-not-found')) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
