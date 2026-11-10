/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

interface PointerGlowOptions {
  activeOpacity?: number;
}

export function usePointerGlow<T extends HTMLElement = HTMLDivElement>({
  activeOpacity = 1,
}: PointerGlowOptions = {}) {
  const ref = useRef<T>(null);
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced) return;

    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!hasFinePointer) return;

    let rafId: number | null = null;
    let pendingX = -9999;
    let pendingY = -9999;

    const applyCoords = () => {
      if (el) {
        el.style.setProperty('--mouse-x', `${pendingX}px`);
        el.style.setProperty('--mouse-y', `${pendingY}px`);
        el.style.setProperty('--glow-opacity', `${activeOpacity}`);
      }
      rafId = null;
    };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      pendingX = e.clientX - rect.left;
      pendingY = e.clientY - rect.top;

      if (rafId === null) {
        rafId = requestAnimationFrame(applyCoords);
      }
    };

    const handlePointerLeave = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      el.style.setProperty('--glow-opacity', '0');
    };

    el.addEventListener('pointermove', handlePointerMove, { passive: true });
    el.addEventListener('pointerleave', handlePointerLeave, { passive: true });

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      el.removeEventListener('pointermove', handlePointerMove);
      el.removeEventListener('pointerleave', handlePointerLeave);
      el.style.removeProperty('--mouse-x');
      el.style.removeProperty('--mouse-y');
      el.style.removeProperty('--glow-opacity');
    };
  }, [prefersReduced, activeOpacity]);

  return ref;
}
