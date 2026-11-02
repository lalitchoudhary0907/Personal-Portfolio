/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { portfolioData } from '../../data/portfolio';

test('AboutSection utilizes verified education data', () => {
  const edu = portfolioData.education[0];
  assert.equal(edu.institution, 'Newton School of Technology');
  assert.equal(edu.university, 'Rishihood University');
  assert.equal(edu.degree, 'Bachelor of Technology (BTech)');
  assert.equal(edu.fieldOfStudy, 'Computer Science & Artificial Intelligence');
  assert.equal(edu.verificationStatus, 'verified');
});

test('AboutSection career interests align with candidate profile', () => {
  const interests = portfolioData.personalInfo.interests.map((i) => i.category);
  assert.ok(interests.includes('Core Engineering'));
  assert.ok(interests.includes('Artificial Intelligence'));
  assert.ok(interests.includes('Collaboration & Community'));
});
