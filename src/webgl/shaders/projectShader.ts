/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * GLSL Vertex Shader for DOM-to-WebGL Synchronized Project Planes.
 * Applies subtle scroll-velocity vertex inertia and passes calibrated UVs.
 */
export const projectVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uScrollVelocity;
  uniform float uHover;
  uniform vec2 uPointer;
  uniform float uEffectType; // 0.0: FocusFlow (Chronometric), 1.0: VastraGo (Parametric)

  varying vec2 vUv;
  varying vec2 vMouseDist;
  varying float vHover;
  varying float vVelocity;

  void main() {
    vUv = uv;
    vHover = uHover;
    vVelocity = uScrollVelocity;

    vec3 pos = position;

    // Calculate normalized distance from pointer in UV space
    vec2 pointerUv = uPointer;
    vMouseDist = vUv - pointerUv;
    float dist = length(vMouseDist);

    // Subtle scroll-velocity dependent vertex wave
    float velocityInfluence = clamp(uScrollVelocity * 0.0006, -0.06, 0.06);
    float wave = sin(uv.y * 3.14159) * velocityInfluence * (1.0 - abs(uv.x - 0.5));
    pos.z += wave * 40.0;

    // Subtle hover bulge around mouse cursor
    float mouseWave = smoothstep(0.45, 0.0, dist) * uHover;
    pos.z += mouseWave * 12.0;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

/**
 * GLSL Fragment Shader for Cinematic Editorial Project Imagery.
 * Features:
 * - Dot-matrix procedural rasterization & halftone reveals
 * - Controlled UV displacement & chromatic dispersion along velocity vectors
 * - Negative-to-colour palette transition
 * - Mouse-reactive interactive wave lighting
 */
export const projectFragmentShader = /* glsl */ `
  precision highp float;

  uniform sampler2D uTexture;
  uniform float uTime;
  uniform float uHover;
  uniform vec2 uPointer;
  uniform float uScrollVelocity;
  uniform float uEffectType; // 0.0 = FocusFlow, 1.0 = VastraGo
  uniform vec2 uResolution;
  uniform vec3 uPrimaryColor;
  uniform vec3 uSecondaryColor;
  uniform vec3 uAccentColor;
  uniform vec3 uBgColor;

  varying vec2 vUv;
  varying vec2 vMouseDist;
  varying float vHover;
  varying float vVelocity;

  // Pseudo-random noise
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  void main() {
    vec2 uv = vUv;

    // 1. Mouse wave displacement
    float mouseDist = length(uv - uPointer);
    float mouseStrength = smoothstep(0.42, 0.0, mouseDist) * uHover;
    vec2 mouseDisp = normalize(uv - uPointer + 0.0001) * mouseStrength * 0.025;

    // 2. Scroll velocity inertial shear
    float velEffect = clamp(uScrollVelocity * 0.0004, -0.035, 0.035);
    vec2 velDisp = vec2(0.0, velEffect * sin(uv.x * 3.14159));

    vec2 finalUv = uv + mouseDisp + velDisp;

    // 3. Chromatic dispersion sampling (RGB channel offset)
    float chromOffset = (abs(velEffect) * 0.45 + mouseStrength * 0.008);
    vec4 texR = texture2D(uTexture, finalUv + vec2(chromOffset, 0.0));
    vec4 texG = texture2D(uTexture, finalUv);
    vec4 texB = texture2D(uTexture, finalUv - vec2(chromOffset, 0.0));

    vec4 baseTex = vec4(texR.r, texG.g, texB.b, texG.a);

    // 4. Dot-Matrix / Halftone raster grid (FocusFlow effect) vs Parametric Contour (VastraGo effect)
    vec3 outputColor = baseTex.rgb;

    if (uEffectType < 0.5) {
      // FocusFlow: Chronometric Dot-Matrix Scanlines & Pulse
      vec2 grid = fract(uv * vec2(120.0, 75.0));
      float dotMask = 1.0 - smoothstep(0.24, 0.38, length(grid - 0.5));

      // Scanline cadence
      float scanline = sin(uv.y * 380.0 + uTime * 2.0) * 0.04;

      // Desaturated duotone base
      float lum = dot(baseTex.rgb, vec3(0.299, 0.587, 0.114));
      vec3 duotone = mix(uBgColor * 1.2, uPrimaryColor, lum);

      // On hover: dot-matrix illuminates with active palette accent
      vec3 hoverReveal = mix(duotone, baseTex.rgb, dotMask * 0.7 + 0.3);
      hoverReveal += uPrimaryColor * mouseStrength * 0.35;
      hoverReveal += scanline;

      outputColor = mix(duotone, hoverReveal, uHover * 0.85 + 0.15);
    } else {
      // VastraGo: Parametric CAD Blueprint Contours & Measurement Grid
      vec2 grid = fract(uv * vec2(60.0, 40.0));
      float gridLines = step(0.96, grid.x) + step(0.96, grid.y);

      // Topological contour waves
      float contour = sin((uv.x + uv.y * 0.6) * 36.0 + sin(uTime * 1.2) * 2.0);
      float contourLine = smoothstep(0.92, 0.98, contour);

      // Lum base
      float lum = dot(baseTex.rgb, vec3(0.299, 0.587, 0.114));
      vec3 blueprintBase = mix(uBgColor * 1.15, uSecondaryColor * 0.9, lum);

      // Wireframe overlay
      vec3 cadColor = blueprintBase + gridLines * uSecondaryColor * 0.15;
      cadColor += contourLine * uAccentColor * (0.15 + uHover * 0.35);
      cadColor += uAccentColor * mouseStrength * 0.4;

      outputColor = mix(cadColor, baseTex.rgb, uHover * 0.4);
    }

    // 5. Delicate vignette edge falloff
    vec2 vigUv = uv * (1.0 - uv.yx);
    float vignette = clamp(vigUv.x * vigUv.y * 18.0, 0.0, 1.0);
    outputColor *= vignette;

    gl_FragColor = vec4(outputColor, baseTex.a);
  }
`;
