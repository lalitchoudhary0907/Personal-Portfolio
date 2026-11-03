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
import { fetchCachedGitHubRepos, fetchCachedGitHubActivity } from './src/server/githubService';

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

  // Production Security Headers
  app.use((_req: Request, res: Response, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    next();
  });

  // ==========================================
  // Production REST API Routes
  // ==========================================

  // 1. Contact Service Status
  app.get(['/api/contact', '/api/contact/status'], (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache, must-revalidate');
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
      res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
      res.status(status).json(body);
    } catch {
      res.status(502).json({ error: 'GitHub upstream unavailable' });
    }
  });

  // 4. GitHub Activity Proxy (Profile, Repos, Events, Languages)
  app.get('/api/github/activity', async (req: Request, res: Response) => {
    try {
      const { status, body } = await fetchCachedGitHubActivity();
      res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
      res.status(status).json(body);
    } catch {
      res.status(502).json({ error: 'GitHub upstream unavailable' });
    }
  });

  // ==========================================
  // Dynamic SEO Routes (resolves active origin or VITE_SITE_URL without placeholder domains)
  // ==========================================
  function resolveRequestOrigin(req: Request): string {
    if (process.env.VITE_SITE_URL && process.env.VITE_SITE_URL.trim() && !process.env.VITE_SITE_URL.includes('placeholder')) {
      return process.env.VITE_SITE_URL.trim().replace(/\/$/, '');
    }
    if (process.env.SITE_URL && process.env.SITE_URL.trim() && !process.env.SITE_URL.includes('placeholder')) {
      return process.env.SITE_URL.trim().replace(/\/$/, '');
    }
    const forwardedProto = req.headers['x-forwarded-proto'];
    const proto = typeof forwardedProto === 'string' ? forwardedProto.split(',')[0].trim() : req.protocol;
    const host = req.get('host') || 'localhost:3000';
    return `${proto}://${host}`.replace(/\/$/, '');
  }

  app.get('/robots.txt', (req: Request, res: Response) => {
    const siteUrl = resolveRequestOrigin(req);
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(`# robots.txt for Lalit Choudhary Portfolio\nUser-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
  });

  app.get('/sitemap.xml', (req: Request, res: Response) => {
    const siteUrl = resolveRequestOrigin(req);
    const currentDate = new Date().toISOString().split('T')[0];
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${siteUrl}/#about</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${siteUrl}/#skills</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>${siteUrl}/#projects</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${siteUrl}/#github</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>${siteUrl}/#achievements</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${siteUrl}/#contact</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.75</priority>
  </url>
</urlset>`;
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(sitemapXml);
  });

  // ==========================================
  // Public Static Assets (OG images, favicon, static fallbacks)
  // ==========================================
  const publicPath = path.resolve(__dirname, 'public');
  app.use(
    express.static(publicPath, {
      maxAge: '1d',
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.xml') || filePath.endsWith('.txt')) {
          res.setHeader('Cache-Control', 'public, max-age=3600');
        }
      },
    })
  );

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
    // Content-hashed assets in dist/assets are cached immutably for 1 year
    app.use(
      '/assets',
      express.static(path.resolve(distPath, 'assets'), {
        maxAge: '1y',
        immutable: true,
      })
    );
    // Root dist files with index.html revalidation
    app.use(
      express.static(distPath, {
        maxAge: '1h',
        setHeaders: (res, filePath) => {
          if (filePath.endsWith('index.html')) {
            res.setHeader('Cache-Control', 'no-cache, must-revalidate');
          }
        },
      })
    );
    app.get('*', (_req: Request, res: Response) => {
      res.setHeader('Cache-Control', 'no-cache, must-revalidate');
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
