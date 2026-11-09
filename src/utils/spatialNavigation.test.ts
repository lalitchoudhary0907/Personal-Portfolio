/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SPATIAL_LAYERS,
  TOTAL_LAYERS,
  clampLayerIndex,
  getNextLayerIndex,
  getPrevLayerIndex,
  getLayerByHash,
  getHashForLayer,
  calculateSpatialLayerState,
} from './spatialNavigation';

test('SPATIAL_LAYERS defines the expected 6 distinct 3D depth layers', () => {
  assert.equal(TOTAL_LAYERS, 6);
  assert.equal(SPATIAL_LAYERS[0].id, 'hero');
  assert.equal(SPATIAL_LAYERS[1].id, 'projects');
  assert.equal(SPATIAL_LAYERS[2].id, 'about');
  assert.equal(SPATIAL_LAYERS[3].id, 'skills');
  assert.equal(SPATIAL_LAYERS[4].id, 'achievements');
  assert.equal(SPATIAL_LAYERS[5].id, 'contact');
});

test('clampLayerIndex restricts index between 0 and total-1', () => {
  assert.equal(clampLayerIndex(-5), 0);
  assert.equal(clampLayerIndex(0), 0);
  assert.equal(clampLayerIndex(3), 3);
  assert.equal(clampLayerIndex(5), 5);
  assert.equal(clampLayerIndex(10), 5);
  assert.equal(clampLayerIndex(NaN), 0);
});

test('getNextLayerIndex and getPrevLayerIndex step predictably without overflow', () => {
  assert.equal(getNextLayerIndex(0), 1);
  assert.equal(getNextLayerIndex(4), 5);
  assert.equal(getNextLayerIndex(5), 5);

  assert.equal(getPrevLayerIndex(5), 4);
  assert.equal(getPrevLayerIndex(1), 0);
  assert.equal(getPrevLayerIndex(0), 0);
});

test('getLayerByHash resolves semantic route hashes correctly', () => {
  assert.equal(getLayerByHash('#top'), 0);
  assert.equal(getLayerByHash('#hero'), 0);
  assert.equal(getLayerByHash('#projects'), 1);
  assert.equal(getLayerByHash('#work'), 1);
  assert.equal(getLayerByHash('#about'), 2);
  assert.equal(getLayerByHash('#skills'), 3);
  assert.equal(getLayerByHash('#focus'), 3);
  assert.equal(getLayerByHash('#achievements'), 4);
  assert.equal(getLayerByHash('#recognition'), 4);
  assert.equal(getLayerByHash('#contact'), 5);
  assert.equal(getLayerByHash('#unknown'), 0);
});

test('getHashForLayer outputs verified canonical hashes', () => {
  assert.equal(getHashForLayer(0), '#top');
  assert.equal(getHashForLayer(1), '#projects');
  assert.equal(getHashForLayer(2), '#about');
  assert.equal(getHashForLayer(3), '#skills');
  assert.equal(getHashForLayer(4), '#achievements');
  assert.equal(getHashForLayer(5), '#contact');
});

test('calculateSpatialLayerState handles active focal layer with 3D tilt', () => {
  const activeState = calculateSpatialLayerState({
    layerIndex: 1,
    activeIndex: 1,
    isDeckView: false,
    mouseTilt: { x: 0.5, y: -0.5 },
    prefersReduced: false,
  });

  assert.equal(activeState.isCurrent, true);
  assert.equal(activeState.opacity, 1);
  assert.equal(activeState.pointerEvents, 'auto');
  assert.ok(activeState.transform.includes('rotateX(2.00deg)'));
  assert.ok(activeState.transform.includes('rotateY(2.50deg)'));
});

test('calculateSpatialLayerState pushes background layers into negative Z space', () => {
  const backgroundState = calculateSpatialLayerState({
    layerIndex: 3,
    activeIndex: 1,
    isDeckView: false,
    mouseTilt: { x: 0, y: 0 },
    prefersReduced: false,
  });

  assert.equal(backgroundState.isCurrent, false);
  assert.equal(backgroundState.opacity, 0);
  assert.equal(backgroundState.pointerEvents, 'none');
  assert.ok(backgroundState.transform.includes('translate3d(0, 0, -800px)'));
});

test('calculateSpatialLayerState renders all layers in 3D Isometric Deck View', () => {
  const deckState0 = calculateSpatialLayerState({
    layerIndex: 0,
    activeIndex: 0,
    isDeckView: true,
    mouseTilt: { x: 0, y: 0 },
    prefersReduced: false,
  });

  assert.equal(deckState0.pointerEvents, 'auto');
  assert.ok(deckState0.transform.includes('rotateX(54deg)'));
  assert.ok(deckState0.transform.includes('rotateZ(-28deg)'));
});

test('calculateSpatialLayerState disables 3D transform under prefers-reduced-motion', () => {
  const reducedState = calculateSpatialLayerState({
    layerIndex: 2,
    activeIndex: 2,
    isDeckView: false,
    mouseTilt: { x: 1, y: 1 },
    prefersReduced: true,
  });

  assert.equal(reducedState.isCurrent, true);
  assert.equal(reducedState.opacity, 1);
  assert.equal(reducedState.transform, 'translate3d(0, 0, 0)');
});
