/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PaletteId = 'palette-a' | 'palette-b' | 'palette-c' | 'palette-d';

export interface PaletteColors {
  background: string;
  surface: string;
  surfaceCard: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  textMuted: string;
  textFaint: string;
  border: string;
  borderBright: string;
  borderAccent: string;
  primaryGlow: string;
  accentGlow: string;
  selectionBg: string;
  selectionText: string;
}

export interface WcagContrastScores {
  textOnBackground: string;
  primaryOnBackground: string;
  accentOnBackground: string;
  textOnSurface: string;
}

export interface ShaderUniforms {
  backgroundVec3: [number, number, number];
  primaryVec3: [number, number, number];
  secondaryVec3: [number, number, number];
  accentVec3: [number, number, number];
}

export interface PaletteDefinition {
  id: PaletteId;
  letter: 'A' | 'B' | 'C' | 'D';
  name: string;
  shortName: string;
  visualIdentity: string;
  designRationale: string;
  colors: PaletteColors;
  contrast: WcagContrastScores;
  shaderUniforms: ShaderUniforms;
}
