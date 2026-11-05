/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

const STORAGE_KEY = 'lc_intro_seen_v1';
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export type IntroVariant = 'full' | 'quick' | 'reduced';

export interface UseIntroReturn {
  isIntroActive: boolean;
  isSplitting: boolean;
  introDone: boolean;
  variant: IntroVariant;
  skipIntro: () => void;
}

export function useIntro(onIntroComplete?: () => void): UseIntroReturn {
  const prefersReduced = usePrefersReducedMotion();

  // Determine initial variant safely
  const [variant] = useState<IntroVariant>(() => {
    if (prefersReduced) return 'reduced';
    if (typeof window === 'undefined') return 'full';

    // Query parameter force override
    if (window.location.search.includes('intro=1')) {
      return 'full';
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const timestamp = parseInt(stored, 10);
        if (!isNaN(timestamp) && Date.now() - timestamp < SEVEN_DAYS_MS) {
          return 'quick';
        }
      }
    } catch {
      // Ignore storage access restrictions
    }
    return 'full';
  });

  const [isIntroActive, setIsIntroActive] = useState(true);
  const [isSplitting, setIsSplitting] = useState(false);
  const [introDone, setIntroDone] = useState(false);

  const timersRef = useRef<NodeJS.Timeout[]>([]);

  const finishIntro = useCallback(() => {
    setIsIntroActive(false);
    setIsSplitting(false);
    setIntroDone(true);

    // Save timestamp to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
    } catch {
      // Ignore storage failure
    }

    // Unlock body scroll
    document.body.style.overflow = '';

    // Move focus to main landmark
    const mainEl = document.getElementById('main-content');
    if (mainEl) {
      mainEl.focus();
    }

    // Notify callback
    if (onIntroComplete) {
      onIntroComplete();
    }
  }, [onIntroComplete]);

  const skipIntro = useCallback(() => {
    if (!isIntroActive || isSplitting || introDone) return;

    // Clear any pending timers
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    if (variant === 'reduced') {
      finishIntro();
      return;
    }

    // Initiate split phase immediately
    setIsSplitting(true);
    const splitTimer = setTimeout(() => {
      finishIntro();
    }, 800);
    timersRef.current.push(splitTimer);
  }, [isIntroActive, isSplitting, introDone, variant, finishIntro]);

  // Lock scroll while intro is active
  useEffect(() => {
    if (isIntroActive) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isIntroActive]);

  // Orchestrate automated timeline sequence
  useEffect(() => {
    const timers = timersRef.current;

    if (variant === 'reduced') {
      // 400ms crossfade for reduced motion
      const t = setTimeout(() => {
        finishIntro();
      }, 400);
      timers.push(t);
      return () => timers.forEach(clearTimeout);
    }

    if (variant === 'quick') {
      // Quick 1s variant: monogram flash at 0.2s, split at 0.5s, finish at 1.3s
      const splitT = setTimeout(() => {
        setIsSplitting(true);
      }, 500);
      const finishT = setTimeout(() => {
        finishIntro();
      }, 1300);
      timers.push(splitT, finishT);
      return () => timers.forEach(clearTimeout);
    }

    // Full 3.4s timeline sequence
    // 0.0s: Hairline & base cover
    // 0.3s: Monogram & caption
    // 1.1s: Marquee strips
    // 1.9s: Monogram fades & curtains split over 800ms
    // 2.7s: Overlay unmounts & introDone
    const splitT = setTimeout(() => {
      setIsSplitting(true);
    }, 1900);

    const finishT = setTimeout(() => {
      finishIntro();
    }, 2700);

    timers.push(splitT, finishT);

    return () => timers.forEach(clearTimeout);
  }, [variant, finishIntro]);

  // Global keydown listener: Esc or Enter skips intro
  useEffect(() => {
    if (!isIntroActive || introDone) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') {
        e.preventDefault();
        skipIntro();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isIntroActive, introDone, skipIntro]);

  return {
    isIntroActive,
    isSplitting,
    introDone,
    variant,
    skipIntro,
  };
}
