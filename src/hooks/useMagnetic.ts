/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from 'react';
import { useMotionValue, useSpring } from 'motion/react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

interface MagneticOptions {
  radius?: number;
  pullFactor?: number;
  maxOffset?: number;
}

export function useMagnetic<T extends HTMLElement = HTMLAnchorElement>({
  radius = 80,
  pullFactor = 0.25,
  maxOffset = 8,
}: MagneticOptions = {}) {
  const ref = useRef<T>(null);
  const prefersReduced = usePrefersReducedMotion();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const springX = useSpring(rawX, { stiffness: 220, damping: 28 });
  const springY = useSpring(rawY, { stiffness: 220, damping: 28 });

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced) return;

    // Check pointer capabilities
    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!hasFinePointer) return;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const distance = Math.hypot(deltaX, deltaY);

      if (distance <= radius) {
        // Calculate pull with clamp
        const pullX = deltaX * pullFactor;
        const pullY = deltaY * pullFactor;
        const clampedX = Math.max(-maxOffset, Math.min(maxOffset, pullX));
        const clampedY = Math.max(-maxOffset, Math.min(maxOffset, pullY));

        rawX.set(clampedX);
        rawY.set(clampedY);
      } else {
        rawX.set(0);
        rawY.set(0);
      }
    };

    const handlePointerLeave = () => {
      rawX.set(0);
      rawY.set(0);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    el.addEventListener('pointerleave', handlePointerLeave, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      el.removeEventListener('pointerleave', handlePointerLeave);
      rawX.set(0);
      rawY.set(0);
    };
  }, [radius, pullFactor, maxOffset, prefersReduced, rawX, rawY]);

  return {
    ref,
    style: prefersReduced ? {} : { x: springX, y: springY },
  };
}
