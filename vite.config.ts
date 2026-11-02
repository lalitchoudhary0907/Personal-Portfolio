import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

function githubReposPlugin() {
  let cachedData: any = null;
  let cacheTime = 0;
  const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache

  return {
    name: 'github-repos-cache-proxy',
    configureServer(server: any) {
      server.middlewares.use('/api/github/repos', async (req: any, res: any) => {
        const now = Date.now();
        if (cachedData && now - cacheTime < CACHE_TTL_MS) {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ ...cachedData, source: 'server_cache' }));
          return;
        }

        try {
          const apiRes = await fetch('https://api.github.com/users/lalitchoudhary0907/repos?sort=updated&per_page=12', {
            headers: {
              'User-Agent': 'LalitChoudhary-Portfolio/1.0',
              'Accept': 'application/vnd.github.v3+json',
            },
          });

          if (!apiRes.ok) {
            throw new Error(`GitHub API HTTP ${apiRes.status}`);
          }

          const rawData = await apiRes.json();
          const repos = Array.isArray(rawData)
            ? rawData.map((r: any) => ({
                id: r.id,
                name: r.name,
                full_name: r.full_name,
                html_url: r.html_url,
                description: r.description,
                stargazers_count: r.stargazers_count,
                forks_count: r.forks_count,
                language: r.language,
                updated_at: r.updated_at,
                topics: r.topics || [],
                is_fork: r.fork,
                visibility: r.visibility || 'public',
              }))
            : [];

          cachedData = {
            repos,
            fetchedAt: new Date().toISOString(),
            rateLimitRemaining: Number(apiRes.headers.get('x-ratelimit-remaining') || 60),
          };
          cacheTime = now;

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ ...cachedData, source: 'github_live' }));
        } catch (err: any) {
          if (cachedData) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ...cachedData, source: 'server_cache', error: err.message }));
          } else {
            res.statusCode = 502;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message || 'GitHub upstream unreachable' }));
          }
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), githubReposPlugin()],
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
