/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { portfolioData } from '../../data/portfolio';
import { VERIFIED_GITHUB_SNAPSHOT } from '../../lib/github';

test('DocDrift incorporates Team Midnight Commit and verified GitHub repository', () => {
  const docdrift = portfolioData.projects.find((p) => p.id === 'proj-docdrift');
  assert.ok(docdrift, 'DocDrift project must exist in portfolioData');
  assert.equal(docdrift.title, 'DocDrift');
  assert.equal(docdrift.team, 'Midnight Commit');
  assert.equal(
    docdrift.repoUrl,
    'https://github.com/lalitchoudhary0907/MidnightCommit-Hacktoberfest2026'
  );
  assert.equal(docdrift.verifiedRepo, true);
  // Ensure no fake demo URL was fabricated
  assert.equal(docdrift.demoUrl, undefined);
  assert.ok(
    docdrift.tags.includes('Python') && docdrift.tags.includes('Qwen 3.5 (4B)'),
    'DocDrift tags should include confirmed Python and Qwen 3.5 technologies'
  );
});

test('CoreAlert is truthfully presented without fake repository or working demo URLs', () => {
  const corealert = portfolioData.projects.find((p) => p.id === 'proj-corealert');
  assert.ok(corealert, 'CoreAlert project must exist in portfolioData');
  assert.equal(corealert.title, 'CoreAlert');
  assert.equal(corealert.repoUrl, undefined, 'CoreAlert must not have a fabricated repository URL');
  assert.equal(corealert.demoUrl, undefined, 'CoreAlert must not have a fabricated demo URL');
  assert.equal(corealert.verifiedRepo, false);
  assert.ok(
    corealert.statusBadge?.includes('Private') || corealert.statusBadge?.includes('Active Development'),
    'CoreAlert should be labeled as private or under active development'
  );
});

test('VastraGo is designated as a system concept and replaces StitchAI', () => {
  const stitchAi = portfolioData.projects.find(
    (p) => p.title.toLowerCase().includes('stitchai') || p.id === 'proj-stitchai'
  );
  assert.equal(stitchAi, undefined, 'StitchAI should not be present in portfolioData; user specified VastraGo');

  const vastrago = portfolioData.projects.find((p) => p.id === 'proj-vastrago');
  assert.ok(vastrago, 'VastraGo must exist in portfolioData');
  assert.equal(vastrago.title, 'VastraGo');
  assert.equal(vastrago.isConcept, true, 'VastraGo must be explicitly marked as a concept');
  assert.equal(vastrago.conceptLabel, 'System Concept & Architecture');
  assert.equal(vastrago.repoUrl, undefined, 'VastraGo concept must not have a fabricated repo URL');
  assert.equal(vastrago.demoUrl, undefined, 'VastraGo concept must not have a fabricated demo URL');
});

test('Verified GitHub snapshot accurately reflects public profile repositories', () => {
  assert.ok(Array.isArray(VERIFIED_GITHUB_SNAPSHOT));
  assert.ok(VERIFIED_GITHUB_SNAPSHOT.length >= 5);

  const hackathonRepo = VERIFIED_GITHUB_SNAPSHOT.find(
    (r) => r.name === 'MidnightCommit-Hacktoberfest2026'
  );
  assert.ok(hackathonRepo, 'Snapshot must include MidnightCommit-Hacktoberfest2026');
  assert.equal(hackathonRepo.language, 'Python');
  assert.ok(hackathonRepo.html_url.startsWith('https://github.com/lalitchoudhary0907/'));

  // Ensure all repositories in the snapshot belong to the candidate
  for (const repo of VERIFIED_GITHUB_SNAPSHOT) {
    assert.ok(
      repo.html_url.startsWith('https://github.com/lalitchoudhary0907/'),
      `Repository URL ${repo.html_url} must belong to lalitchoudhary0907`
    );
  }
});
