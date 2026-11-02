/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { portfolioData } from '../../data/portfolio';

test('HeroSection uses verified candidate details', () => {
  assert.equal(portfolioData.personalInfo.fullName, 'Lalit Choudhary');
  assert.equal(portfolioData.education[0].institution, 'Newton School of Technology');
  assert.equal(portfolioData.education[0].university, 'Rishihood University');
});

test('HeroSection social media links match verified URLs', () => {
  assert.equal(
    portfolioData.personalInfo.socials.github.url,
    'https://github.com/lalitchoudhary0907'
  );
  assert.equal(
    portfolioData.personalInfo.socials.linkedin.url,
    'https://www.linkedin.com/in/lalitchoudhary0907'
  );
});

test('HeroSection known projects list verified names only', () => {
  const titles = portfolioData.projects.map((p) => p.title);
  assert.deepEqual(titles, ['DocDrift', 'CoreAlert', 'VastraGo']);
});
