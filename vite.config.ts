import fs from 'node:fs';
import path from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * `vite preview` only: serve the prerendered `about-us.html` for `/about-us`,
 * and `404.html` (with a 404 status) for unknown routes instead of the home page.
 */
function previewStaticPages(): Plugin {
  return {
    name: 'preview-static-pages',
    configurePreviewServer(server) {
      const outDir = path.resolve(server.config.root, server.config.build.outDir);
      const notFound = (res: import('node:http').ServerResponse) => {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(fs.readFileSync(path.join(outDir, '404.html')));
      };
      // Inside dist/ and an exact-case match, like a Linux host (Windows paths are case-insensitive).
      const inOutDir = (file: string) => {
        const abs = path.resolve(outDir, file);
        if (!abs.startsWith(outDir + path.sep) || !fs.existsSync(abs)) return false;
        return fs.readdirSync(path.dirname(abs)).includes(path.basename(abs));
      };

      server.middlewares.use((req, res, next) => {
        if (req.method !== 'GET' && req.method !== 'HEAD') return next();
        const url = req.url ?? '/';
        const q = url.indexOf('?');
        const query = q === -1 ? '' : url.slice(q);
        let pathname: string;
        try {
          pathname = decodeURIComponent(q === -1 ? url : url.slice(0, q));
        } catch {
          return notFound(res);
        }

        // Real files (assets, sitemap.xml, …) are served as-is; missing ones get a real 404.
        if (path.extname(pathname)) return inOutDir(pathname.slice(1)) ? next() : notFound(res);

        const clean = pathname.replace(/\/+$/, '');
        if (clean === '/index' || clean === '/404') return notFound(res);
        const file = clean === '' ? 'index.html' : `${clean.slice(1)}.html`;
        if (!inOutDir(file)) return notFound(res);
        req.url = `/${file}${query}`;
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), previewStaticPages()],
  define: {
    // Footer copyright year, fixed at build time so prerendered HTML and hydration agree.
    __BUILD_YEAR__: JSON.stringify(new Date().getFullYear()),
  },
});
