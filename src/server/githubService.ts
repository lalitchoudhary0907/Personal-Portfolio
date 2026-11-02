/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CachedGitHubData {
  repos: any[];
  fetchedAt: string;
  rateLimitRemaining: number;
  source: 'server_cache' | 'github_live';
  error?: string;
}

let cachedData: any = null;
let cacheTime = 0;
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache

export async function fetchCachedGitHubRepos(): Promise<{ status: number; body: CachedGitHubData | { error: string } }> {
  const now = Date.now();
  if (cachedData && now - cacheTime < CACHE_TTL_MS) {
    return {
      status: 200,
      body: { ...cachedData, source: 'server_cache' },
    };
  }

  try {
    const apiRes = await fetch('https://api.github.com/users/lalitchoudhary0907/repos?sort=updated&per_page=12', {
      headers: {
        'User-Agent': 'LalitChoudhary-Portfolio/1.0',
        Accept: 'application/vnd.github.v3+json',
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

    return {
      status: 200,
      body: { ...cachedData, source: 'github_live' },
    };
  } catch (err: any) {
    if (cachedData) {
      return {
        status: 200,
        body: { ...cachedData, source: 'server_cache', error: 'Upstream refresh failed' },
      };
    }
    return {
      status: 502,
      body: { error: err.message || 'GitHub upstream unreachable' },
    };
  }
}
