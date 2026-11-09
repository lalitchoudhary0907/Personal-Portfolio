/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface LayerMetadata {
  id: string;
  index: number;
  label: string;
  shortTag: string;
  title: string;
  zDepth: number; // in virtual mm
}

export const SPATIAL_LAYERS: LayerMetadata[] = [
  {
    id: 'hero',
    index: 0,
    label: '01',
    shortTag: 'SYSTEM',
    title: 'Core System & Identity',
    zDepth: 0,
  },
  {
    id: 'projects',
    index: 1,
    label: '02',
    shortTag: 'WORK',
    title: 'Selected Works (FocusFlow & VastraGo)',
    zDepth: -350,
  },
  {
    id: 'about',
    index: 2,
    label: '03',
    shortTag: 'ABOUT',
    title: 'Architectural Spec & Education',
    zDepth: -700,
  },
  {
    id: 'skills',
    index: 3,
    label: '04',
    shortTag: 'DISCIPLINES',
    title: 'Core Disciplines & Competencies',
    zDepth: -1050,
  },
  {
    id: 'achievements',
    index: 4,
    label: '05',
    shortTag: 'HONORS',
    title: 'Verified Recognition & Certificates',
    zDepth: -1400,
  },
  {
    id: 'contact',
    index: 5,
    label: '06',
    shortTag: 'GATEWAY',
    title: 'Direct Dialogue & Comms',
    zDepth: -1750,
  },
];

export const TOTAL_LAYERS = SPATIAL_LAYERS.length;

export function clampLayerIndex(index: number, max: number = TOTAL_LAYERS - 1): number {
  if (Number.isNaN(index)) return 0;
  return Math.max(0, Math.min(max, Math.round(index)));
}

export function getNextLayerIndex(current: number, max: number = TOTAL_LAYERS - 1): number {
  return Math.min(max, current + 1);
}

export function getPrevLayerIndex(current: number): number {
  return Math.max(0, current - 1);
}

export function getLayerByHash(hash: string): number {
  const cleanHash = hash.replace(/^#/, '').toLowerCase();
  if (!cleanHash || cleanHash === 'top' || cleanHash === 'hero') return 0;
  if (cleanHash === 'work' || cleanHash === 'projects') return 1;
  if (cleanHash === 'about') return 2;
  if (cleanHash === 'skills' || cleanHash === 'focus') return 3;
  if (cleanHash === 'recognition' || cleanHash === 'achievements') return 4;
  if (cleanHash === 'contact') return 5;
  return 0;
}

export function getHashForLayer(index: number): string {
  switch (index) {
    case 0:
      return '#top';
    case 1:
      return '#projects';
    case 2:
      return '#about';
    case 3:
      return '#skills';
    case 4:
      return '#achievements';
    case 5:
      return '#contact';
    default:
      return '#top';
  }
}

export interface SpatialTransformConfig {
  layerIndex: number;
  activeIndex: number;
  isDeckView: boolean;
  mouseTilt: { x: number; y: number };
  prefersReduced: boolean;
}

export function calculateSpatialLayerState(config: SpatialTransformConfig): {
  opacity: number;
  pointerEvents: 'auto' | 'none';
  transform: string;
  zIndex: number;
  isCurrent: boolean;
} {
  const { layerIndex, activeIndex, isDeckView, mouseTilt, prefersReduced } = config;
  const isCurrent = layerIndex === activeIndex;

  if (isDeckView) {
    // 3D Isometric Deck View: All layers stacked in space
    const offset = layerIndex - activeIndex;
    const yOffset = layerIndex * 140 - 240;
    const zOffset = layerIndex * 90 - 200;
    const xTilt = 54;
    const zRot = -28;
    const scale = 0.58;

    return {
      opacity: 0.95,
      pointerEvents: 'auto',
      transform: `translate3d(0px, ${yOffset}px, ${zOffset}px) rotateX(${xTilt}deg) rotateZ(${zRot}deg) scale(${scale})`,
      zIndex: 50 - layerIndex * 5,
      isCurrent,
    };
  }

  // Focus View (One layer active in the front)
  if (prefersReduced) {
    return {
      opacity: isCurrent ? 1 : 0,
      pointerEvents: isCurrent ? 'auto' : 'none',
      transform: 'translate3d(0, 0, 0)',
      zIndex: isCurrent ? 20 : 0,
      isCurrent,
    };
  }

  const delta = layerIndex - activeIndex;

  if (delta === 0) {
    // Active focal layer
    const tiltX = (mouseTilt.y * -4).toFixed(2);
    const tiltY = (mouseTilt.x * 5).toFixed(2);
    return {
      opacity: 1,
      pointerEvents: 'auto',
      transform: `translate3d(0, 0, 0px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1)`,
      zIndex: 30,
      isCurrent: true,
    };
  } else if (delta < 0) {
    // Past layer: pushed into foreground and faded
    const zTravel = Math.abs(delta) * 360;
    return {
      opacity: 0,
      pointerEvents: 'none',
      transform: `translate3d(0, 0, ${zTravel}px) scale(1.15)`,
      zIndex: 10 - Math.abs(delta),
      isCurrent: false,
    };
  } else {
    // Future layer: waiting in 3D background depth
    const zDepth = delta * -400;
    const scale = Math.max(0.7, 1 - delta * 0.12);
    return {
      opacity: 0,
      pointerEvents: 'none',
      transform: `translate3d(0, 0, ${zDepth}px) scale(${scale.toFixed(2)})`,
      zIndex: 10 - delta,
      isCurrent: false,
    };
  }
}
