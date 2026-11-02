/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { portfolioData } from './portfolio';

test('portfolioData personal info is complete and verified', () => {
  assert.equal(portfolioData.personalInfo.fullName, 'Lalit Choudhary');
  assert.equal(portfolioData.personalInfo.email, 'lalitchoudhary0907@gmail.com');
  assert.equal(portfolioData.personalInfo.location, 'India');
  assert.equal(portfolioData.personalInfo.socials.github.url, 'https://github.com/lalitchoudhary0907');
  assert.equal(portfolioData.personalInfo.socials.linkedin.url, 'https://www.linkedin.com/in/lalitchoudhary0907');
  assert.equal(portfolioData.personalInfo.socials.github.verified, true);
  assert.equal(portfolioData.personalInfo.socials.linkedin.verified, true);
});

test('education data references verified institution and degree', () => {
  assert.ok(portfolioData.education.length > 0);
  const edu = portfolioData.education[0];
  assert.equal(edu.institution, 'Newton School of Technology');
  assert.equal(edu.university, 'Rishihood University');
  assert.equal(edu.degree, 'Bachelor of Technology (BTech)');
  assert.equal(edu.fieldOfStudy, 'Computer Science & Artificial Intelligence');
  assert.equal(edu.verificationStatus, 'verified');
});

test('known projects are recorded with verification status and confirmation notes', () => {
  const projectTitles = portfolioData.projects.map((p) => p.title);
  assert.ok(projectTitles.includes('DocDrift'));
  assert.ok(projectTitles.includes('CoreAlert'));
  assert.ok(projectTitles.includes('VastraGo'));

  for (const project of portfolioData.projects) {
    assert.equal(project.verificationStatus, 'verified');
    assert.ok(project.confirmationNote && project.confirmationNote.length > 0);
  }
});

test('achievements include verified WorldQuant milestones and Hacktoberfest certificate', () => {
  const achievementTitles = portfolioData.achievements.map((a) => a.title);
  assert.ok(achievementTitles.some((t) => t.includes('WorldQuant BRAIN Gold Level')));
  assert.ok(achievementTitles.some((t) => t.includes('WorldQuant BRAIN Silver Level')));
  assert.ok(achievementTitles.some((t) => t.includes('WorldQuant BRAIN Bronze Level')));
  assert.ok(achievementTitles.some((t) => t.includes('Hacktoberfest')));

  const gold = portfolioData.achievements.find((a) => a.title.includes('Gold'));
  assert.equal(gold?.certificatePath, '/assets/aistudio/WorldQuant_Gold_Certificate_fd9a9343.pdf');
});

test('pending confirmations clearly document items requiring user confirmation', () => {
  assert.ok(portfolioData.pendingConfirmations.length >= 3);
  const fields = portfolioData.pendingConfirmations.map((c) => c.field);
  assert.ok(fields.includes('projects.coreAlertRepo'));
  assert.ok(fields.includes('projects.vastragoPrototype'));
});
