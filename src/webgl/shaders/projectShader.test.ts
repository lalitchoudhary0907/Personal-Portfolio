/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { projectVertexShader, projectFragmentShader } from './projectShader';

test('Project Shaders: GLSL Vertex Shader contains mandatory DOM-to-WebGL uniforms', () => {
  assert.ok(projectVertexShader.includes('uniform float uTime;'), 'Must declare uTime');
  assert.ok(projectVertexShader.includes('uniform float uScrollVelocity;'), 'Must declare uScrollVelocity');
  assert.ok(projectVertexShader.includes('uniform float uHover;'), 'Must declare uHover');
  assert.ok(projectVertexShader.includes('uniform vec2 uPointer;'), 'Must declare uPointer');
  assert.ok(projectVertexShader.includes('uniform float uEffectType;'), 'Must declare uEffectType');
  assert.ok(projectVertexShader.includes('varying vec2 vUv;'), 'Must export varying vUv');
});

test('Project Shaders: GLSL Fragment Shader contains required creative effects and color uniforms', () => {
  assert.ok(projectFragmentShader.includes('uniform sampler2D uTexture;'), 'Must sample project uTexture');
  assert.ok(projectFragmentShader.includes('uniform vec3 uPrimaryColor;'), 'Must receive active palette uPrimaryColor');
  assert.ok(projectFragmentShader.includes('uniform vec3 uSecondaryColor;'), 'Must receive active palette uSecondaryColor');
  assert.ok(projectFragmentShader.includes('uniform vec3 uAccentColor;'), 'Must receive active palette uAccentColor');
  assert.ok(projectFragmentShader.includes('uniform vec3 uBgColor;'), 'Must receive active palette uBgColor');
  assert.ok(projectFragmentShader.includes('uEffectType'), 'Must branch between FocusFlow (0) and VastraGo (1)');
  assert.ok(projectFragmentShader.includes('chromOffset'), 'Must calculate chromatic dispersion');
  assert.ok(projectFragmentShader.includes('gl_FragColor ='), 'Must output final fragment color');
});
