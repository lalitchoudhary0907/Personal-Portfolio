/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

const STORAGE_KEY = 'lc_tech_intro_seen_v2';
const ONE_HOUR_MS = 60 * 60 * 1000;

export type IntroVariant = 'full' | 'reduced';

export interface UseIntroReturn {
  isIntroActive: boolean;
  isSplitting: boolean;
  introDone: boolean;
  phase: number; // 1: Boot (0-1.8s), 2: Monogram (1.8-3.8s), 3: Nodes (3.8-5.4s), 4: Warp (5.4-6.2s)
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

  const [isIntroActive, setIsIntroActive] = useState(true);
  const [isSplitting, setIsSplitting] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [phase, setPhase] = useState(1);
  const [progress, setProgress] = useState(0);

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
    }, 600);
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
      }, 500);
      timersRef.current.push(t);
      return;
    }

    // Progress counter ticker: 0 -> 100% over 5.4s
    const startTime = performance.now();
    const duration = 5400;

    const progressInterval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const rawPct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(rawPct);
      if (rawPct >= 100) {
        clearInterval(progressInterval);
      }
    }, 50);
    intervalsRef.current.push(progressInterval);

    // Timeline phases (Total ≈ 6.2 seconds)
    // 0.0s - 1.8s: Phase 1 (Kernel Boot)
    // 1.8s: Phase 2 (Monogram & Hologram Reveal)
    const p2Timer = setTimeout(() => {
      setPhase(2);
    }, 1800);

    // 3.8s: Phase 3 (Telemetry Verification & Core Nodes Lock)
    const p3Timer = setTimeout(() => {
      setPhase(3);
    }, 3800);

    // 5.4s: Phase 4 (Portal Warp & Split Reveal)
    const p4Timer = setTimeout(() => {
      setPhase(4);
      setIsSplitting(true);
    }, 5400);

    // 6.2s: Complete
    const finishTimer = setTimeout(() => {
      finishIntro();
    }, 6200);

    timersRef.current.push(p2Timer, p3Timer, p4Timer, finishTimer);
  }, [variant, finishIntro, clearAllTimers]);

  const replayIntro = useCallback(() => {
    startSequence();
  }, [startSequence]);

  // Initial mount trigger
  useEffect(() => {
    startSequence();
    return () => clearAllTimers();
  }, [startSequence, clearAllTimers]);

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
