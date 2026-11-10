/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import { useMotionValue, useSpring } from 'motion/react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

interface MagneticOptions {
  radius?: number;
  pullFactor?: number;
  maxOffset?: number;
}

export function useMagnetic<T extends HTMLElement = HTMLAnchorElement>({
  radius = 70,
  pullFactor = 0.28,
  maxOffset = 8,
}: MagneticOptions = {}) {
  const ref = useRef<T>(null);
  const prefersReduced = usePrefersReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Tuned spring physics: crisp attraction, smooth settle, zero oscillation overshoot
  const springX = useSpring(rawX, { stiffness: 240, damping: 24, mass: 0.8 });
  const springY = useSpring(rawY, { stiffness: 240, damping: 24, mass: 0.8 });

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced) return;

    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!hasFinePointer) return;

    let isNear = false;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const distance = Math.hypot(deltaX, deltaY);

      if (distance <= radius) {
        if (!isNear) {
          isNear = true;
          setIsHovered(true);
        }

        // Smooth non-linear gravitational decay: strongest near center, soft at perimeter
        const normalized = 1 - distance / radius;
        const decay = Math.pow(normalized, 1.4);

        const pullX = deltaX * pullFactor * decay;
        const pullY = deltaY * pullFactor * decay;

        const clampedX = Math.max(-maxOffset, Math.min(maxOffset, pullX));
        const clampedY = Math.max(-maxOffset, Math.min(maxOffset, pullY));

        rawX.set(clampedX);
        rawY.set(clampedY);
      } else if (isNear) {
        isNear = false;
        setIsHovered(false);
        rawX.set(0);
        rawY.set(0);
      }
    };

    const handlePointerLeave = () => {
      isNear = false;
      setIsHovered(false);
      rawX.set(0);
      rawY.set(0);
    };

    const handleScroll = () => {
      if (isNear) {
        isNear = false;
        setIsHovered(false);
        rawX.set(0);
        rawY.set(0);
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('blur', handlePointerLeave);
    el.addEventListener('pointerleave', handlePointerLeave, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('blur', handlePointerLeave);
      el.removeEventListener('pointerleave', handlePointerLeave);
      rawX.set(0);
      rawY.set(0);
    };
  }, [radius, pullFactor, maxOffset, prefersReduced, rawX, rawY]);

  return {
    ref,
    isHovered,
    style: prefersReduced ? {} : { x: springX, y: springY },
  };
}
