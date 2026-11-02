/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { processContactSubmission, getPublicServiceStatus } from './src/server/contactService';
import { extractClientIp } from './src/server/rateLimiter';
import { fetchCachedGitHubRepos } from './src/server/githubService';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  // Configure reverse proxy trust (Cloud Run, GCP, Cloudflare)
  // Ensures req.ip and rate-limiting lookups derive the actual client IP
  app.set('trust proxy', 1);

  // Disable x-powered-by header to prevent fingerprinting
  app.disable('x-powered-by');

  // Enforce strict 50 KB JSON payload cap against denial-of-service attempts
  app.use(express.json({ limit: '50kb' }));

  // ==========================================
  // Production REST API Routes
  // ==========================================

  // 1. Contact Service Status
  app.get(['/api/contact', '/api/contact/status'], (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.json(getPublicServiceStatus());
  });

  // 2. Contact Form Submission
  app.post('/api/contact', async (req: Request, res: Response) => {
    try {
      const clientIp = extractClientIp(req.headers as any, req.ip);
      const result = await processContactSubmission(req.body, clientIp);

      res.status(result.status).json(result);
    } catch {
      // Sanitized top-level catch: never leak stack traces
      res.status(500).json({
        success: false,
        status: 500,
        error: 'Email delivery is temporarily unavailable. Please try again later.',
      });
    }
  });

  // 3. GitHub Repositories Proxy (with in-memory cache)
  app.get('/api/github/repos', async (req: Request, res: Response) => {
    try {
      const { status, body } = await fetchCachedGitHubRepos();
      res.status(status).json(body);
    } catch {
      res.status(502).json({ error: 'GitHub upstream unavailable' });
    }
  });

  // ==========================================
  // Frontend Serving (Dev vs Production)
  // ==========================================

  if (!isProduction) {
    // Development mode: Mount Vite dev server in middlewareMode
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log(`[DevServer] Running full-stack dev server with Vite middleware on http://0.0.0.0:${PORT}`);
  } else {
    // Production mode: Serve compiled assets from dist/
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
    console.log(`[ProductionServer] Serving static build from ${distPath} on port ${PORT}`);
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server actively listening on http://0.0.0.0:${PORT} (${isProduction ? 'production' : 'development'})`);
  });

  return server;
}

startServer().catch((err) => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});
