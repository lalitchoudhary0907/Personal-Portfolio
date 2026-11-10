/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type Lenis from 'lenis';

export interface ScrollState {
  scroll: number;
  limit: number;
  progress: number;
  velocity: number;
  velocityMagnitude: number;
  direction: 1 | -1 | 0;
  activeSection: string;
}

export type ScrollListener = (state: ScrollState) => void;

class ScrollBus {
  private state: ScrollState = {
    scroll: 0,
    limit: 1000,
    progress: 0,
    velocity: 0,
    velocityMagnitude: 0,
    direction: 0,
    activeSection: '#top',
  };

  private listeners = new Set<ScrollListener>();
  private lenisInstance: Lenis | null = null;
  private isReducedMotion = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      // Initialize scroll limit from DOM once available
      this.updateLimit();
      window.addEventListener('resize', this.updateLimit, { passive: true });
    }
  }

  private updateLimit = () => {
    if (typeof document !== 'undefined') {
      const docHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight
      );
      this.state.limit = Math.max(1, docHeight - window.innerHeight);
    }
  };

  public setLenis(instance: Lenis | null): void {
    this.lenisInstance = instance;
  }

  public getLenis(): Lenis | null {
    return this.lenisInstance;
  }

  public getState(): Readonly<ScrollState> {
    return this.state;
  }

  public updateFromLenis(e: {
    scroll: number;
    limit: number;
    progress: number;
    velocity: number;
    direction: number;
  }): void {
    this.state.scroll = e.scroll;
    this.state.limit = Math.max(1, e.limit);
    this.state.progress = Math.max(0, Math.min(1, e.progress));
    this.state.velocity = e.velocity;
    this.state.velocityMagnitude = Math.abs(e.velocity);
    this.state.direction = e.direction > 0 ? 1 : e.direction < 0 ? -1 : 0;

    this.notify();
  }

  public updateFromNative(scrollY: number): void {
    const prevScroll = this.state.scroll;
    const delta = scrollY - prevScroll;

    this.updateLimit();
    this.state.scroll = scrollY;
    this.state.progress = this.state.limit > 0 ? Math.max(0, Math.min(1, scrollY / this.state.limit)) : 0;
    this.state.velocity = delta;
    this.state.velocityMagnitude = Math.abs(delta);
    this.state.direction = delta > 0 ? 1 : delta < 0 ? -1 : 0;

    this.notify();
  }

  public setActiveSection(sectionId: string): void {
    if (this.state.activeSection !== sectionId) {
      this.state.activeSection = sectionId;
      this.notify();
    }
  }

  public subscribe(listener: ScrollListener): () => void {
    this.listeners.add(listener);
    // Provide initial state immediately
    listener(this.state);

    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    for (const listener of this.listeners) {
      try {
        listener(this.state);
      } catch (err) {
        console.warn('[ScrollBus] listener error:', err);
      }
    }
  }

  /**
   * Universal programmatic scroll dispatcher.
   * Uses Lenis when available for unified inertial easing, or native smooth/instant fallback.
   */
  public scrollTo(
    target: string | number | HTMLElement,
    options?: {
      offset?: number;
      duration?: number;
      immediate?: boolean;
      onComplete?: () => void;
    }
  ): void {
    if (typeof window === 'undefined') return;

    if (this.lenisInstance && !this.isReducedMotion) {
      this.lenisInstance.scrollTo(target, {
        offset: options?.offset ?? 0,
        duration: options?.immediate ? 0 : (options?.duration ?? 1.2),
        immediate: options?.immediate ?? false,
        onComplete: options?.onComplete,
      });
      return;
    }

    // Native fallback
    let top = 0;
    if (typeof target === 'number') {
      top = target;
    } else if (typeof target === 'string') {
      if (target === '#top' || target === 'top') {
        top = 0;
      } else {
        const el = document.querySelector(target);
        if (el) {
          const rect = el.getBoundingClientRect();
          top = window.scrollY + rect.top + (options?.offset ?? 0);
        }
      }
    } else if (target instanceof HTMLElement) {
      const rect = target.getBoundingClientRect();
      top = window.scrollY + rect.top + (options?.offset ?? 0);
    }

    window.scrollTo({
      top,
      behavior: options?.immediate || this.isReducedMotion ? 'auto' : 'smooth',
    });

    if (options?.onComplete) {
      setTimeout(options.onComplete, options?.immediate ? 0 : 450);
    }
  }
}

export const scrollBus = new ScrollBus();
