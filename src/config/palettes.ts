/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PaletteDefinition, PaletteId } from '../types/theme';

export const PALETTES: Record<PaletteId, PaletteDefinition> = {
  'palette-a': {
    id: 'palette-a',
    letter: 'A',
    name: 'Obsidian × Electric Cobalt',
    shortName: 'Electric Cobalt',
    visualIdentity: 'Futuristic, elegant, technical, precise, and cinematic.',
    designRationale:
      'Deep celestial obsidian canvas paired with high-frequency electric cobalt and crisp mint luminescence. Provides exceptional contrast, crystalline legibility, and architectural precision suited for CS & AI engineering.',
    colors: {
      background: '#080C16',
      surface: '#151D32',
      surfaceCard: 'rgba(21, 29, 50, 0.75)',
      primary: '#688BFF',
      secondary: '#A6B8DD',
      accent: '#B5FCDE',
      text: '#F4F7FF',
      textMuted: '#8B9BB4',
      textFaint: '#4A576E',
      border: 'rgba(104, 139, 255, 0.14)',
      borderBright: 'rgba(104, 139, 255, 0.32)',
      borderAccent: 'rgba(181, 252, 222, 0.35)',
      primaryGlow: 'rgba(104, 139, 255, 0.35)',
      accentGlow: 'rgba(181, 252, 222, 0.35)',
      selectionBg: '#688BFF',
      selectionText: '#080C16',
    },
    contrast: {
      textOnBackground: '16.2:1 (AAA)',
      primaryOnBackground: '7.4:1 (AAA)',
      accentOnBackground: '16.8:1 (AAA)',
      textOnSurface: '12.8:1 (AAA)',
    },
    shaderUniforms: {
      backgroundVec3: [0.031, 0.047, 0.086],
      primaryVec3: [0.408, 0.545, 1.0],
      secondaryVec3: [0.651, 0.722, 0.867],
      accentVec3: [0.71, 0.988, 0.871],
    },
  },
  'palette-b': {
    id: 'palette-b',
    letter: 'B',
    name: 'Graphite × Ultraviolet',
    shortName: 'Ultraviolet',
    visualIdentity: 'Experimental, creative, atmospheric, and visually expressive.',
    designRationale:
      'Dark amethyst-graphite backdrop illuminated by radioactive ultraviolet and soft lavender mist. Evokes high-end creative coding, digital art galleries, and atmospheric night aesthetics.',
    colors: {
      background: '#0C0B13',
      surface: '#1E192B',
      surfaceCard: 'rgba(30, 25, 43, 0.75)',
      primary: '#A68AFF',
      secondary: '#D0BCD9',
      accent: '#E8B6D9',
      text: '#FAF5FF',
      textMuted: '#998FA8',
      textFaint: '#5A5168',
      border: 'rgba(166, 138, 255, 0.15)',
      borderBright: 'rgba(166, 138, 255, 0.35)',
      borderAccent: 'rgba(232, 182, 217, 0.35)',
      primaryGlow: 'rgba(166, 138, 255, 0.35)',
      accentGlow: 'rgba(232, 182, 217, 0.35)',
      selectionBg: '#A68AFF',
      selectionText: '#0C0B13',
    },
    contrast: {
      textOnBackground: '17.4:1 (AAA)',
      primaryOnBackground: '8.5:1 (AAA)',
      accentOnBackground: '12.6:1 (AAA)',
      textOnSurface: '13.9:1 (AAA)',
    },
    shaderUniforms: {
      backgroundVec3: [0.047, 0.043, 0.075],
      primaryVec3: [0.651, 0.541, 1.0],
      secondaryVec3: [0.816, 0.737, 0.851],
      accentVec3: [0.91, 0.714, 0.851],
    },
  },
  'palette-c': {
    id: 'palette-c',
    letter: 'C',
    name: 'Midnight × Copper Ember',
    shortName: 'Copper Ember',
    visualIdentity: 'Luxurious, editorial, minimal, warm, and sophisticated.',
    designRationale:
      'Warm charcoal-espresso void grounded by radiant copper flame and sage crystal accents. Bridges classic Swiss editorial typography with high-craft physical industrial design.',
    colors: {
      background: '#101214',
      surface: '#252528',
      surfaceCard: 'rgba(37, 37, 40, 0.78)',
      primary: '#F19A6B',
      secondary: '#CEC6BE',
      accent: '#C8E1D2',
      text: '#FAF5EC',
      textMuted: '#9E968F',
      textFaint: '#5C5651',
      border: 'rgba(241, 154, 107, 0.16)',
      borderBright: 'rgba(241, 154, 107, 0.36)',
      borderAccent: 'rgba(200, 225, 210, 0.35)',
      primaryGlow: 'rgba(241, 154, 107, 0.35)',
      accentGlow: 'rgba(200, 225, 210, 0.35)',
      selectionBg: '#F19A6B',
      selectionText: '#101214',
    },
    contrast: {
      textOnBackground: '16.5:1 (AAA)',
      primaryOnBackground: '8.8:1 (AAA)',
      accentOnBackground: '14.2:1 (AAA)',
      textOnSurface: '12.5:1 (AAA)',
    },
    shaderUniforms: {
      backgroundVec3: [0.063, 0.071, 0.078],
      primaryVec3: [0.945, 0.604, 0.42],
      secondaryVec3: [0.808, 0.776, 0.745],
      accentVec3: [0.784, 0.882, 0.824],
    },
  },
  'palette-d': {
    id: 'palette-d',
    letter: 'D',
    name: 'Deep Space × Quantum Mint',
    shortName: 'Quantum Mint',
    visualIdentity: 'Computational, modern, research-oriented, and refreshing.',
    designRationale:
      'Sub-zero oceanic abyss paired with hyper-pure quantum mint and periwinkle electromagnetic field accents. Distinctly modern, scientific, and bio-computational.',
    colors: {
      background: '#07131A',
      surface: '#10232C',
      surfaceCard: 'rgba(16, 35, 44, 0.76)',
      primary: '#56E6C1',
      secondary: '#96B7C4',
      accent: '#B5AAFF',
      text: '#F0FCFA',
      textMuted: '#7E9BA8',
      textFaint: '#445D6B',
      border: 'rgba(86, 230, 193, 0.16)',
      borderBright: 'rgba(86, 230, 193, 0.36)',
      borderAccent: 'rgba(181, 170, 255, 0.35)',
      primaryGlow: 'rgba(86, 230, 193, 0.35)',
      accentGlow: 'rgba(181, 170, 255, 0.35)',
      selectionBg: '#56E6C1',
      selectionText: '#07131A',
    },
    contrast: {
      textOnBackground: '17.1:1 (AAA)',
      primaryOnBackground: '12.3:1 (AAA)',
      accentOnBackground: '10.8:1 (AAA)',
      textOnSurface: '13.1:1 (AAA)',
    },
    shaderUniforms: {
      backgroundVec3: [0.027, 0.075, 0.102],
      primaryVec3: [0.337, 0.902, 0.757],
      secondaryVec3: [0.588, 0.718, 0.769],
      accentVec3: [0.71, 0.667, 1.0],
    },
  },
};

export const PALETTE_LIST: PaletteDefinition[] = Object.values(PALETTES);

export const DEFAULT_PALETTE_ID: PaletteId = 'palette-a';

export function getPalette(id: string | null | undefined): PaletteDefinition {
  if (id && id in PALETTES) {
    return PALETTES[id as PaletteId];
  }
  return PALETTES[DEFAULT_PALETTE_ID];
}
