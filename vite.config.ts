import fs from 'node:fs';
import path from 'node:path';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * `npm run dev` only: run the Vercel Functions in api/ locally, so the quote form works end
 * to end. Variables from .env.local (e.g. RESEND_API_KEY) are passed to the function.
 * Without RESEND_API_KEY, api/quote.ts prints the quote in this terminal instead of emailing it.
 */
function devApiFunctions(): Plugin {
  return {
    name: 'dev-api-functions',
    configureServer(server) {
      for (const [key, value] of Object.entries(loadEnv(server.config.mode, server.config.root, ''))) {
        process.env[key] ??= value;
      }
      server.middlewares.use('/api', async (req, res, next) => {
        try {
          const name = (req.url ?? '/').split('?')[0].replace(/^\/+|\/+$/g, '');
          if (!/^[\w-]+$/.test(name) || !fs.existsSync(path.join(server.config.root, 'api', `${name}.ts`))) return next();
          const handlers = await server.ssrLoadModule(`/api/${name}.ts`);
          const handler = handlers[req.method ?? 'GET'];
          if (typeof handler !== 'function') {
            res.statusCode = 405;
            res.end();
            return;
          }
          const chunks: Buffer[] = [];
          for await (const chunk of req) chunks.push(chunk as Buffer);
          const headers = new Headers();
          for (const [key, value] of Object.entries(req.headers)) {
            if (typeof value === 'string') headers.set(key, value);
            else if (Array.isArray(value)) headers.set(key, value.join(', '));
          }
          const request = new Request(`http://${req.headers.host ?? 'localhost'}/api/${name}`, {
            method: req.method,
            headers,
            body: chunks.length ? Buffer.concat(chunks) : undefined,
          });
          const response: Response = await handler(request);
          res.statusCode = response.status;
          response.headers.forEach((value, key) => res.setHeader(key, value));
          res.end(Buffer.from(await response.arrayBuffer()));
        } catch (error) {
          next(error);
        }
      });
    },
  };
}

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
  plugins: [react(), devApiFunctions(), previewStaticPages()],
  define: {
    // Footer copyright year, fixed at build time so prerendered HTML and hydration agree.
    __BUILD_YEAR__: JSON.stringify(new Date().getFullYear()),
  },
});
