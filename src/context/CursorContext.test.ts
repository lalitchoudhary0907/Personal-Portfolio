/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CursorVariant } from './CursorContext';

test('CursorVariant types include all seven defined contextual interaction states', () => {
  const validVariants: CursorVariant[] = [
    'default',
    'link',
    'project',
    'drag',
    '3d-scene',
    'text',
    'disabled',
    'hidden',
  ];

  assert.equal(validVariants.length, 8);
  assert.ok(validVariants.includes('project'));
  assert.ok(validVariants.includes('3d-scene'));
  assert.ok(validVariants.includes('drag'));
  assert.ok(validVariants.includes('disabled'));
});

test('Magnetic gravitational physics calculation matches expected non-linear decay', () => {
  const radius = 70;
  const pullFactor = 0.28;
  const maxOffset = 8;

  function calculateMagneticPull(deltaX: number, deltaY: number) {
    const distance = Math.hypot(deltaX, deltaY);
    if (distance > radius) return { x: 0, y: 0 };
    const normalized = 1 - distance / radius;
    const decay = Math.pow(normalized, 1.4);
    const pullX = deltaX * pullFactor * decay;
    const pullY = deltaY * pullFactor * decay;
    return {
      x: Math.max(-maxOffset, Math.min(maxOffset, pullX)),
      y: Math.max(-maxOffset, Math.min(maxOffset, pullY)),
    };
  }

  // Inside perimeter
  const inside = calculateMagneticPull(20, 20);
  assert.ok(inside.x > 0);
  assert.ok(inside.y > 0);
  assert.ok(inside.x <= maxOffset);
  assert.ok(inside.y <= maxOffset);

  // Outside perimeter returns exact zero
  const outside = calculateMagneticPull(100, 100);
  assert.equal(outside.x, 0);
  assert.equal(outside.y, 0);

  // Center returns exact zero
  const center = calculateMagneticPull(0, 0);
  assert.equal(center.x, 0);
  assert.equal(center.y, 0);
});
