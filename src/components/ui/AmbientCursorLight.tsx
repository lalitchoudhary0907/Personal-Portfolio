/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react';

/**
 * Desktop-only subtle ambient cursor light.
 * - Guarded by (pointer: fine) to exclude touch/mobile devices
 * - Automatically respects prefers-reduced-motion
 * - Uses spring-interpolated coordinates for a smooth, lag-free specular glow
 * - Zero layout shift, compositor-only transform
 */
export const AmbientCursorLight: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const [isFinePointer, setIsFinePointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const rawX = useMotionValue(-500);
  const rawY = useMotionValue(-500);

  // Smooth, high-damping spring prevents jitter
  const springX = useSpring(rawX, { damping: 28, stiffness: 200, mass: 0.5 });
  const springY = useSpring(rawY, { damping: 28, stiffness: 200, mass: 0.5 });

  useEffect(() => {
    // Only enable on desktop pointer devices
    const mediaQuery = window.matchMedia('(pointer: fine)');
    setIsFinePointer(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsFinePointer(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMediaChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleMediaChange);
      }
    };
  }, []);

  useEffect(() => {
    if (!isFinePointer || prefersReducedMotion) return;

    const handlePointerMove = (e: PointerEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handlePointerLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handlePointerLeave, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mouseleave', handlePointerLeave);
    };
  }, [isFinePointer, prefersReducedMotion, isVisible, rawX, rawY]);

  if (!isFinePointer || prefersReducedMotion) {
    return null;
  }

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed -top-[250px] -left-[250px] w-[500px] h-[500px] rounded-full z-0 select-none transition-opacity duration-300"
      style={{
        x: springX,
        y: springY,
        opacity: isVisible ? 1 : 0,
        background:
          'radial-gradient(circle, rgba(6, 182, 212, 0.045) 0%, rgba(99, 102, 241, 0.02) 40%, transparent 70%)',
      }}
    />
  );
};
