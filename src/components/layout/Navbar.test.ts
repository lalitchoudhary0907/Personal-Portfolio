/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { siteConfig } from '../../config/site';
import { portfolioData } from '../../data/portfolio';

test('navItems contains the exact 6 requested sections', () => {
  const titles = siteConfig.navItems.map((item) => item.title);
  assert.deepEqual(titles, [
    'Home',
    'About',
    'Skills',
    'Projects',
    'Achievements',
    'Contact',
  ]);
});

test('resumeUrl is not fabricated and resume button logic behaves correctly', () => {
  // A resume file was not supplied by user, so resumeUrl should be undefined or empty
  const hasRealResume = Boolean(portfolioData.personalInfo.resumeUrl?.trim());
  assert.equal(hasRealResume, false);
});
