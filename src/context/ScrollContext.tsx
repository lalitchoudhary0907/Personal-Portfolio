/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import Lenis from 'lenis';
import { scrollBus, ScrollState } from '../utils/scrollBus';
import { webglCoordinator } from '../webgl/webglCoordinator';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface ScrollContextValue {
  scrollState: ScrollState;
  scrollTo: (
    target: string | number | HTMLElement,
    options?: {
      offset?: number;
      duration?: number;
      immediate?: boolean;
      onComplete?: () => void;
    }
  ) => void;
  isLenisAvailable: boolean;
}

const ScrollContext = createContext<ScrollContextValue | null>(null);

export const ScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const prefersReduced = usePrefersReducedMotion();
  const [scrollState, setScrollState] = useState<ScrollState>(() => scrollBus.getState());
  const [isLenisAvailable, setIsLenisAvailable] = useState(false);

  // Initialize Lenis or native listener
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Respect reduced motion: native scroll only
    if (prefersReduced) {
      scrollBus.setLenis(null);
      setIsLenisAvailable(false);

      const handleNativeScroll = () => {
        scrollBus.updateFromNative(window.scrollY);
      };
      window.addEventListener('scroll', handleNativeScroll, { passive: true });
      return () => {
        window.removeEventListener('scroll', handleNativeScroll);
      };
    }

    let lenis: Lenis | null = null;
    let unsubscribeRaf: (() => void) | null = null;

    try {
      lenis = new Lenis({
        autoRaf: false, // Managed strictly by centralized WebGL/App ticker
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.4,
        infinite: false,
      });

      scrollBus.setLenis(lenis);
      setIsLenisAvailable(true);

      // Listen to Lenis virtual scroll ticks
      lenis.on('scroll', (e: {
        scroll: number;
        limit: number;
        progress: number;
        velocity: number;
        direction: number;
      }) => {
        scrollBus.updateFromLenis(e);
      });

      // Hook into master WebGL / application animation frame loop
      // delta and time in seconds, Lenis expects ms timestamp
      unsubscribeRaf = webglCoordinator.subscribe((time) => {
        if (lenis) {
          lenis.raf(time * 1000);
        }
      });
    } catch (err) {
      console.warn('[ScrollContext] Lenis initialization failed, using native scrolling:', err);
      scrollBus.setLenis(null);
      setIsLenisAvailable(false);

      const handleNativeScroll = () => {
        scrollBus.updateFromNative(window.scrollY);
      };
      window.addEventListener('scroll', handleNativeScroll, { passive: true });
      return () => {
        window.removeEventListener('scroll', handleNativeScroll);
      };
    }

    return () => {
      if (unsubscribeRaf) unsubscribeRaf();
      if (lenis) {
        lenis.destroy();
        scrollBus.setLenis(null);
      }
      setIsLenisAvailable(false);
    };
  }, [prefersReduced]);

  // Subscribe to ScrollBus updates for React context consumers
  useEffect(() => {
    let lastUpdate = 0;
    const unsubscribe = scrollBus.subscribe((newState) => {
      // Throttle React state updates to 30fps to keep DOM renders smooth,
      // while non-React subscribers receive 60fps directly from scrollBus
      const now = performance.now();
      if (now - lastUpdate > 32 || newState.activeSection !== scrollState.activeSection) {
        lastUpdate = now;
        setScrollState({ ...newState });
      }
    });

    return unsubscribe;
  }, [scrollState.activeSection]);

  // Observe active section via IntersectionObserver
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const sectionIds = ['top', 'projects', 'about', 'skills', 'achievements', 'contact'];
    const elements: HTMLElement[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) elements.push(el);
    });

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the visible section with highest intersection ratio
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          const topVisible = visible[0];
          scrollBus.setActiveSection(`#${topVisible.target.id}`);
        }
      },
      {
        rootMargin: '-20% 0px -40% 0px',
        threshold: [0.1, 0.3, 0.6],
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);

  const value = useMemo(
    () => ({
      scrollState,
      scrollTo: scrollBus.scrollTo.bind(scrollBus),
      isLenisAvailable,
    }),
    [scrollState, isLenisAvailable]
  );

  return <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>;
};

export const useScrollContext = (): ScrollContextValue => {
  const ctx = useContext(ScrollContext);
  if (!ctx) {
    return {
      scrollState: scrollBus.getState(),
      scrollTo: scrollBus.scrollTo.bind(scrollBus),
      isLenisAvailable: false,
    };
  }
  return ctx;
};

export const useScrollTo = () => {
  const { scrollTo } = useScrollContext();
  return scrollTo;
};

export const useActiveSection = () => {
  const { scrollState } = useScrollContext();
  return scrollState.activeSection;
};
