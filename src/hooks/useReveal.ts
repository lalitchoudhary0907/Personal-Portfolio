/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef } from 'react';
import { useInView } from 'motion/react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

export interface UseRevealOptions {
  once?: boolean;
  margin?: string;
}

export function useReveal(options: UseRevealOptions = {}) {
  const { once = true, margin = '-10%' } = options;
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = usePrefersReducedMotion();
  const inView = useInView(ref, { once, margin: margin as `${number}%` | `${number}px` });

  return {
    ref,
    isInView: prefersReduced || inView,
    prefersReduced,
  };
}
