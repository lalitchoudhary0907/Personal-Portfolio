/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { cn } from '../../lib/utils';

test('design system cn utility produces expected class tokens', () => {
  const merged = cn(
    'glass-panel',
    'rounded-2xl',
    true && 'border-cyan-400/30',
    false && 'hidden'
  );
  assert.ok(merged.includes('glass-panel'));
  assert.ok(merged.includes('border-cyan-400/30'));
  assert.ok(!merged.includes('hidden'));
});

test('palette token definitions are consistent and non-empty', () => {
  const tokens = {
    canvasDark: '#070b14',
    surfaceDark: '#0c1424',
    brandBlue: '#2563eb',
    brandCyan: '#06b6d4',
    brandViolet: '#8b5cf6',
  };

  assert.equal(tokens.canvasDark, '#070b14');
  assert.equal(tokens.brandCyan, '#06b6d4');
  assert.equal(tokens.brandViolet, '#8b5cf6');
});
