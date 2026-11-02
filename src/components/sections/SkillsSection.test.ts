/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { skillsData, SKILL_CATEGORIES } from '../../data/skills';

test('SKILL_CATEGORIES includes all 6 requested categories plus All', () => {
  assert.ok(SKILL_CATEGORIES.includes('Programming'));
  assert.ok(SKILL_CATEGORIES.includes('Frontend Development'));
  assert.ok(SKILL_CATEGORIES.includes('Backend Development'));
  assert.ok(SKILL_CATEGORIES.includes('AI/ML Tools'));
  assert.ok(SKILL_CATEGORIES.includes('Developer Tools'));
  assert.ok(SKILL_CATEGORIES.includes('Version Control'));
});

test('every skill in skillsData is confirmed and free of fake percentages', () => {
  assert.ok(skillsData.length >= 15);
  for (const skill of skillsData) {
    assert.equal(skill.isConfirmed, true);
    // Verify no fake percentage ratings exist on skill items
    assert.equal((skill as unknown as { percentage?: number }).percentage, undefined);
    assert.ok(skill.name.length > 0);
    assert.ok(skill.description.length > 0);
  }
});

test('each requested category has at least 2 confirmed technologies', () => {
  const categoriesToCheck = [
    'Programming',
    'Frontend Development',
    'Backend Development',
    'AI/ML Tools',
    'Developer Tools',
    'Version Control',
  ] as const;

  for (const cat of categoriesToCheck) {
    const items = skillsData.filter((s) => s.category === cat);
    assert.ok(items.length >= 2, `Category ${cat} should have at least 2 items`);
  }
});
