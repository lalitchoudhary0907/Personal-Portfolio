/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateLanguageStats,
  parseGitHubEvents,
  fetchCachedGitHubActivity,
  fetchCachedGitHubRepos,
  __resetGitHubCache,
  VERIFIED_FALLBACK_REPOS,
} from './githubService';
import { GitHubRepoItem } from '../types';

test('calculateLanguageStats handles empty and mixed repos accurately', () => {
  const emptyStats = calculateLanguageStats([]);
  assert.deepEqual(emptyStats, []);

  const sampleRepos: GitHubRepoItem[] = [
    {
      id: 1,
      name: 'repo-ts1',
      full_name: 'test/repo-ts1',
      html_url: 'https://github.com/test/repo-ts1',
      description: 'ts',
      stargazers_count: 0,
      forks_count: 0,
      language: 'TypeScript',
      updated_at: '2026-11-01',
      is_fork: false,
    },
    {
      id: 2,
      name: 'repo-ts2',
      full_name: 'test/repo-ts2',
      html_url: 'https://github.com/test/repo-ts2',
      description: 'ts',
      stargazers_count: 0,
      forks_count: 0,
      language: 'TypeScript',
      updated_at: '2026-11-01',
      is_fork: false,
    },
    {
      id: 3,
      name: 'repo-py1',
      full_name: 'test/repo-py1',
      html_url: 'https://github.com/test/repo-py1',
      description: 'py',
      stargazers_count: 0,
      forks_count: 0,
      language: 'Python',
      updated_at: '2026-11-01',
      is_fork: false,
    },
    {
      id: 4,
      name: 'repo-nolang',
      full_name: 'test/repo-nolang',
      html_url: 'https://github.com/test/repo-nolang',
      description: 'none',
      stargazers_count: 0,
      forks_count: 0,
      language: null,
      updated_at: '2026-11-01',
      is_fork: false,
    },
  ];

  const stats = calculateLanguageStats(sampleRepos);
  assert.equal(stats.length, 2);
  assert.equal(stats[0].language, 'TypeScript');
  assert.equal(stats[0].count, 2);
  assert.equal(stats[0].percentage, 67); // 2 out of 3 = 66.67% -> 67%
  assert.equal(stats[1].language, 'Python');
  assert.equal(stats[1].count, 1);
  assert.equal(stats[1].percentage, 33);
});

test('parseGitHubEvents generates factual action summaries', () => {
  const rawEvents = [
    {
      id: '101',
      type: 'PushEvent',
      repo: { name: 'lalitchoudhary0907/Personal-Portfolio' },
      created_at: '2026-11-02T10:00:00Z',
      payload: {
        ref: 'refs/heads/main',
        commits: [{ message: 'feat: add git activity' }],
      },
    },
    {
      id: '102',
      type: 'CreateEvent',
      repo: { name: 'lalitchoudhary0907/MidnightCommit-Hacktoberfest2026' },
      created_at: '2026-11-01T15:00:00Z',
      payload: {
        ref_type: 'branch',
        ref: 'feature-diff',
      },
    },
    {
      id: '103',
      type: 'WatchEvent',
      repo: { name: 'lalitchoudhary0907/oesu-playground' },
      created_at: '2026-10-20T12:00:00Z',
      payload: { action: 'started' },
    },
  ];

  const parsed = parseGitHubEvents(rawEvents);
  assert.equal(parsed.length, 3);
  assert.equal(parsed[0].type, 'PushEvent');
  assert.equal(parsed[0].action_summary, 'Pushed commit to main');
  assert.equal(parsed[0].repo_url, 'https://github.com/lalitchoudhary0907/Personal-Portfolio');

  assert.equal(parsed[1].type, 'CreateEvent');
  assert.equal(parsed[1].action_summary, 'Created branch "feature-diff"');

  assert.equal(parsed[2].type, 'WatchEvent');
  assert.equal(parsed[2].action_summary, 'Starred repository');
});

test('fetchCachedGitHubActivity serves cached data without excessive requests', async () => {
  __resetGitHubCache();

  const firstCall = await fetchCachedGitHubActivity();
  assert.equal(firstCall.status, 200);
  assert.ok(firstCall.body.profile);
  assert.equal(firstCall.body.profile.login, 'lalitchoudhary0907');
  assert.ok(Array.isArray(firstCall.body.repos));
  assert.ok(firstCall.body.repos.length > 0);
  assert.ok(Array.isArray(firstCall.body.languages));

  // Second call must return from in-memory cache
  const secondCall = await fetchCachedGitHubActivity();
  assert.equal(secondCall.status, 200);
  assert.equal(secondCall.body.source, 'server_cache');
});

test('fetchCachedGitHubRepos returns backwards compatible repository list', async () => {
  const result = await fetchCachedGitHubRepos();
  assert.equal(result.status, 200);
  assert.ok(Array.isArray(result.body.repos));
  assert.ok(result.body.repos.length > 0);
  assert.ok(result.body.fetchedAt);
});
