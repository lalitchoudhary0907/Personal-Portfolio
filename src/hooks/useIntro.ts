/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

const STORAGE_KEY = 'lc_portfolio_intro_seen_v3';

export type IntroVariant = 'full' | 'reduced';

export interface UseIntroReturn {
  isIntroActive: boolean;
  isSplitting: boolean;
  introDone: boolean;
  phase: number; // 1: Boot (0-0.6s), 2: Monogram & Telemetry (0.6-1.3s), 3: Warp & Split (1.3-1.8s), 4: Complete (2.0s)
  progress: number; // 0 to 100
  variant: IntroVariant;
  skipIntro: () => void;
  replayIntro: () => void;
}

export function useIntro(onIntroComplete?: () => void): UseIntroReturn {
  const prefersReduced = usePrefersReducedMotion();

  const [variant] = useState<IntroVariant>(() => {
    if (prefersReduced) return 'reduced';
    return 'full';
  });

  // Check if user has already seen the intro in this session
  const hasSeenInSession = typeof window !== 'undefined' && Boolean(sessionStorage.getItem(STORAGE_KEY));

  const [isIntroActive, setIsIntroActive] = useState(() => !hasSeenInSession && !prefersReduced);
  const [isSplitting, setIsSplitting] = useState(false);
  const [introDone, setIntroDone] = useState(() => hasSeenInSession || prefersReduced);
  const [phase, setPhase] = useState(() => (hasSeenInSession || prefersReduced ? 4 : 1));
  const [progress, setProgress] = useState(() => (hasSeenInSession || prefersReduced ? 100 : 0));

  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const intervalsRef = useRef<NodeJS.Timeout[]>([]);

  const finishIntro = useCallback(() => {
    setIsIntroActive(false);
    setIsSplitting(false);
    setIntroDone(true);
    setPhase(4);
    setProgress(100);

    try {
      sessionStorage.setItem(STORAGE_KEY, Date.now().toString());
    } catch {
      // Ignore storage restrictions
    }

    document.body.style.overflow = '';

    const mainEl = document.getElementById('main-content');
    if (mainEl) {
      mainEl.focus();
    }

    if (onIntroComplete) {
      onIntroComplete();
    }
  }, [onIntroComplete]);

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    intervalsRef.current.forEach(clearInterval);
    intervalsRef.current = [];
  }, []);

  const skipIntro = useCallback(() => {
    if (!isIntroActive || isSplitting || introDone) return;
    clearAllTimers();

    if (variant === 'reduced') {
      finishIntro();
      return;
    }

    setIsSplitting(true);
    setPhase(4);
    const splitTimer = setTimeout(() => {
      finishIntro();
    }, 350);
    timersRef.current.push(splitTimer);
  }, [isIntroActive, isSplitting, introDone, variant, finishIntro, clearAllTimers]);

  const startSequence = useCallback(() => {
    clearAllTimers();
    setIsIntroActive(true);
    setIsSplitting(false);
    setIntroDone(false);
    setPhase(1);
    setProgress(0);

    document.body.style.overflow = 'hidden';

    if (variant === 'reduced') {
      const t = setTimeout(() => {
        finishIntro();
      }, 300);
      timersRef.current.push(t);
      return;
    }

    // Progress counter ticker: 0 -> 100% over 1.6s
    const startTime = performance.now();
    const duration = 1600;

    const progressInterval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const rawPct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(rawPct);
      if (rawPct >= 100) {
        clearInterval(progressInterval);
      }
    }, 35);
    intervalsRef.current.push(progressInterval);

    // Timeline phases (Streamlined total ≈ 2.0s)
    // 0.0s - 0.6s: Phase 1 (Kernel Boot)
    // 0.6s - 1.3s: Phase 2 (Monogram & Telemetry)
    const p2Timer = setTimeout(() => {
      setPhase(2);
    }, 600);

    // 1.3s - 1.8s: Phase 3 (Portal Warp & Split Reveal)
    const p3Timer = setTimeout(() => {
      setPhase(3);
      setIsSplitting(true);
    }, 1300);

    // 1.9s: Complete
    const finishTimer = setTimeout(() => {
      finishIntro();
    }, 1900);

    timersRef.current.push(p2Timer, p3Timer, finishTimer);
  }, [variant, finishIntro, clearAllTimers]);

  const replayIntro = useCallback(() => {
    startSequence();
  }, [startSequence]);

  // Initial mount trigger only if not previously seen in this session and not reduced motion
  useEffect(() => {
    if (!hasSeenInSession && !prefersReduced) {
      startSequence();
    }
    return () => clearAllTimers();
  }, [hasSeenInSession, prefersReduced, startSequence, clearAllTimers]);

  // Global keydown: ESC or Enter skips intro
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

  // Listen for custom replay event
  useEffect(() => {
    const handleReplay = () => replayIntro();
    window.addEventListener('replay_intro', handleReplay);
    return () => window.removeEventListener('replay_intro', handleReplay);
  }, [replayIntro]);

  return {
    isIntroActive,
    isSplitting,
    introDone,
    phase,
    progress,
    variant,
    skipIntro,
    replayIntro,
  };
}
