/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { cn } from './utils';

test('cn merges string classes properly', () => {
  const result = cn('btn', 'btn-primary');
  assert.equal(result, 'btn btn-primary');
});

test('cn handles conditional object classes and falsy values', () => {
  const result = cn('base', false && 'hidden', null, undefined, { 'active': true, 'disabled': false });
  assert.equal(result, 'base active');
});
