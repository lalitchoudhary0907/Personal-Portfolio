/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scrollBus, ScrollState } from './scrollBus';

test('scrollBus initializes with valid default state', () => {
  const state = scrollBus.getState();
  assert.equal(typeof state.scroll, 'number');
  assert.equal(typeof state.limit, 'number');
  assert.equal(typeof state.progress, 'number');
  assert.equal(typeof state.velocity, 'number');
  assert.equal(typeof state.direction, 'number');
  assert.equal(typeof state.activeSection, 'string');
});

test('scrollBus updateFromLenis updates state and notifies subscribers', () => {
  let receivedState: ScrollState | null = null;
  const unsubscribe = scrollBus.subscribe((s) => {
    receivedState = s;
  });

  scrollBus.updateFromLenis({
    scroll: 450,
    limit: 1800,
    progress: 0.25,
    velocity: 2.4,
    direction: 1,
  });

  assert.ok(receivedState);
  const state = receivedState as ScrollState;
  assert.equal(state.scroll, 450);
  assert.equal(state.limit, 1800);
  assert.equal(state.progress, 0.25);
  assert.equal(state.velocity, 2.4);
  assert.equal(state.direction, 1);

  unsubscribe();
});

test('scrollBus setActiveSection notifies active section change', () => {
  let section = '';
  const unsubscribe = scrollBus.subscribe((s) => {
    section = s.activeSection;
  });

  scrollBus.setActiveSection('#projects');
  assert.equal(section, '#projects');

  scrollBus.setActiveSection('#about');
  assert.equal(section, '#about');

  unsubscribe();
});

test('scrollBus scrollTo safely executes without error', () => {
  assert.doesNotThrow(() => {
    scrollBus.scrollTo('#projects');
    scrollBus.scrollTo(500, { immediate: true });
    scrollBus.scrollTo('#top', { offset: -30 });
  });
});
