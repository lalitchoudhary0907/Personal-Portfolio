/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * High-performance procedural GLSL background shaders.
 * Features:
 * - 2D Simplex Noise generator (self-contained, zero external asset dependency)
 * - Fluid distortion field influenced by pointer location
 * - Fine computational grid with subtle scanline modulation
 * - Atmospheric vignetted lighting calibrated for AAA typography contrast
 * - Dynamic color interpolation synchronized with active portfolio palette
 */

export const backgroundVertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

export const backgroundFragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uPointer; // Normalized [-1, 1]
  uniform vec3 uBgColor;
  uniform vec3 uPrimaryColor;
  uniform vec3 uSecondaryColor;
  uniform vec3 uAccentColor;
  uniform float uPointerIntensity;
  uniform float uQuality; // 1.0 = high, 0.5 = low/software
  uniform float uScrollProgress; // Normalized page scroll [0, 1]
  uniform float uScrollVelocity; // Normalized scroll speed

  varying vec2 vUv;

  // Simplex 2D noise implementation (Stefan Gustavson, MIT license)
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
      + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 p = uv * 2.0 - 1.0;
    p.x *= aspect;

    // Pointer coordinates in aspect-corrected space
    vec2 mouse = uPointer;
    mouse.x *= aspect;

    // Pointer-responsive fluid distortion
    float distToMouse = length(p - mouse);
    float mouseLens = smoothstep(1.2, 0.0, distToMouse) * uPointerIntensity * 0.15;
    vec2 flowOffset = (distToMouse > 0.001) ? normalize(p - mouse) * mouseLens : vec2(0.0);

    // Scroll-synchronized vertical parallax & velocity kinetic impulse
    float scrollShift = uScrollProgress * 1.2;
    float velocityImpulse = clamp(uScrollVelocity * 0.0015, -0.2, 0.2);
    vec2 distortedP = p + flowOffset + vec2(velocityImpulse * 0.4, scrollShift * 0.35);

    // Multi-octave procedural fluid movement
    float t = uTime * 0.035;
    float noiseA = snoise(distortedP * 0.85 + vec2(t * 0.7, t * 0.5 + scrollShift * 0.5));
    float noiseB = snoise(distortedP * 1.8 - vec2(t * 0.9 + velocityImpulse, noiseA * 0.45));
    float fluid = noiseA * 0.65 + noiseB * 0.35;

    // Deep atmospheric base gradient
    float radial = length(p * vec2(0.85, 1.1));
    float vignette = clamp(1.0 - radial * 0.42, 0.0, 1.0);
    vec3 col = mix(uBgColor * 0.75, uBgColor * 1.25, (fluid * 0.5 + 0.5) * vignette);

    // Subtle fluid luminescence ribbons (low-intensity for typography contrast)
    float ribbon = smoothstep(0.48, 0.54, fluid) * (1.0 - smoothstep(0.54, 0.64, fluid));
    col += uPrimaryColor * (ribbon * 0.075 * vignette);

    // Pointer glow halo
    float pointerGlow = smoothstep(0.95, 0.0, distToMouse) * 0.12 * uPointerIntensity;
    col += uPrimaryColor * pointerGlow;

    // Subtle secondary wave
    float wave = smoothstep(0.60, 0.66, noiseA) * 0.05;
    col += uSecondaryColor * wave;

    // Fine computational architectural grid with scroll-drift phase
    vec2 gridScale = vec2(32.0, 32.0 * (uResolution.y / uResolution.x));
    vec2 gridFract = fract((uv + vec2(0.0, uScrollProgress * 0.12)) * gridScale);
    float grid = (step(0.985, gridFract.x) + step(0.985, gridFract.y));
    grid = clamp(grid, 0.0, 1.0) * 0.028;
    col += uAccentColor * grid;

    gl_FragColor = vec4(col, 1.0);
  }
`;
