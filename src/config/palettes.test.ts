/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { PALETTES, PALETTE_LIST, DEFAULT_PALETTE_ID, getPalette } from './palettes';

test('PALETTES contains all four specified palettes A, B, C, D', () => {
  assert.equal(PALETTE_LIST.length, 4);
  assert.equal(PALETTES['palette-a'].letter, 'A');
  assert.equal(PALETTES['palette-b'].letter, 'B');
  assert.equal(PALETTES['palette-c'].letter, 'C');
  assert.equal(PALETTES['palette-d'].letter, 'D');
  assert.equal(DEFAULT_PALETTE_ID, 'palette-a');
});

test('Palette A has the exact specified colors', () => {
  const pA = PALETTES['palette-a'];
  assert.equal(pA.colors.background, '#080C16');
  assert.equal(pA.colors.surface, '#151D32');
  assert.equal(pA.colors.primary, '#688BFF');
  assert.equal(pA.colors.secondary, '#A6B8DD');
  assert.equal(pA.colors.accent, '#B5FCDE');
  assert.equal(pA.colors.text, '#F4F7FF');
});

test('Palette B has the exact specified colors', () => {
  const pB = PALETTES['palette-b'];
  assert.equal(pB.colors.background, '#0C0B13');
  assert.equal(pB.colors.surface, '#1E192B');
  assert.equal(pB.colors.primary, '#A68AFF');
  assert.equal(pB.colors.secondary, '#D0BCD9');
  assert.equal(pB.colors.accent, '#E8B6D9');
  assert.equal(pB.colors.text, '#FAF5FF');
});

test('Palette C has the exact specified colors', () => {
  const pC = PALETTES['palette-c'];
  assert.equal(pC.colors.background, '#101214');
  assert.equal(pC.colors.surface, '#252528');
  assert.equal(pC.colors.primary, '#F19A6B');
  assert.equal(pC.colors.secondary, '#CEC6BE');
  assert.equal(pC.colors.accent, '#C8E1D2');
  assert.equal(pC.colors.text, '#FAF5EC');
});

test('Palette D has the exact specified colors', () => {
  const pD = PALETTES['palette-d'];
  assert.equal(pD.colors.background, '#07131A');
  assert.equal(pD.colors.surface, '#10232C');
  assert.equal(pD.colors.primary, '#56E6C1');
  assert.equal(pD.colors.secondary, '#96B7C4');
  assert.equal(pD.colors.accent, '#B5AAFF');
  assert.equal(pD.colors.text, '#F0FCFA');
});

test('All palettes have valid shader uniform vectors in [0, 1] range', () => {
  for (const palette of PALETTE_LIST) {
    const { backgroundVec3, primaryVec3, secondaryVec3, accentVec3 } = palette.shaderUniforms;
    assert.equal(backgroundVec3.length, 3);
    assert.equal(primaryVec3.length, 3);
    assert.equal(secondaryVec3.length, 3);
    assert.equal(accentVec3.length, 3);

    for (const val of [...backgroundVec3, ...primaryVec3, ...secondaryVec3, ...accentVec3]) {
      assert.ok(val >= 0 && val <= 1, `Value ${val} should be in [0, 1] for palette ${palette.id}`);
    }
  }
});

test('getPalette falls back to palette-a safely', () => {
  assert.equal(getPalette(undefined).id, 'palette-a');
  assert.equal(getPalette('unknown-palette').id, 'palette-a');
  assert.equal(getPalette('palette-c').id, 'palette-c');
});
