import 'dotenv/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import { processContactSubmission, getPublicServiceStatus } from './src/server/contactService';

import { extractClientIp } from './src/server/rateLimiter';
import { fetchCachedGitHubRepos } from './src/server/githubService';

function contactApiPlugin() {
  return {
    name: 'contact-api-handler',
    configureServer(server: any) {
      server.middlewares.use('/api/contact/status', (req: any, res: any) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(getPublicServiceStatus()));
      });

      server.middlewares.use('/api/contact', async (req: any, res: any, next: any) => {
        // Only intercept base /api/contact (exact match or query)
        const url = req.url || '';
        if (url !== '/' && url !== '' && !url.startsWith('/?')) {
          return next();
        }

        if (req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(getPublicServiceStatus()));
          return;
        }

        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, error: 'Method Not Allowed' }));
          return;
        }

        let bodyStr = '';
        let bodyLength = 0;
        const MAX_BODY_SIZE = 50 * 1024; // 50 KB

        req.on('data', (chunk: any) => {
          bodyLength += chunk.length;
          if (bodyLength > MAX_BODY_SIZE) {
            res.statusCode = 413;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: 'Payload Too Large' }));
            req.destroy();
            return;
          }
          bodyStr += chunk;
        });

        req.on('end', async () => {
          try {
            let parsed: any;
            try {
              parsed = JSON.parse(bodyStr);
            } catch {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: 'Malformed JSON payload.' }));
              return;
            }

            const clientIp = extractClientIp(req.headers, req.socket?.remoteAddress);
            const result = await processContactSubmission(parsed, clientIp);

            res.statusCode = result.status;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(result));
          } catch {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                success: false,
                error: 'Email delivery is temporarily unavailable. Please try again later.',
              })
            );
          }
        });
      });
    },
  };
}

function githubReposPlugin() {
  return {
    name: 'github-repos-cache-proxy',
    configureServer(server: any) {
      server.middlewares.use('/api/github/repos', async (req: any, res: any) => {
        const { status, body } = await fetchCachedGitHubRepos();
        res.statusCode = status;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(body));
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), githubReposPlugin(), contactApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
      dedupe: ['react', 'react-dom'],
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
