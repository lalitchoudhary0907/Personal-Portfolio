/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SPATIAL_LAYERS, TOTAL_LAYERS, getNextLayerIndex, getPrevLayerIndex, clampLayerIndex, getLayerByHash, getHashForLayer } from '../utils/spatialNavigation';
import { SpatialLayer } from './SpatialLayer';
import { LayerHUD } from './LayerHUD';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface Spatial3DStageProps {
  children: React.ReactNode[];
}

export const Spatial3DStage: React.FC<Spatial3DStageProps> = ({ children }) => {
  const [activeLayer, setActiveLayer] = useState<number>(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      return getLayerByHash(window.location.hash);
    }
    return 0;
  });

  const [isDeckView, setIsDeckView] = useState<boolean>(false);
  const [mouseTilt, setMouseTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [announcement, setAnnouncement] = useState<string>('');

  const stageRef = useRef<HTMLDivElement>(null);
  const lastSwitchTimeRef = useRef<number>(0);
  const touchStartYRef = useRef<number | null>(null);
  const prefersReduced = usePrefersReducedMotion();

  // Announce layer changes to screen readers
  const announceLayer = useCallback((index: number) => {
    const meta = SPATIAL_LAYERS[index];
    if (meta) {
      setAnnouncement(`Layer ${index + 1} of ${TOTAL_LAYERS}: ${meta.title}`);
    }
  }, []);

  const selectLayer = useCallback((index: number) => {
    const clamped = clampLayerIndex(index);
    setActiveLayer(clamped);
    setIsDeckView(false);
    announceLayer(clamped);

    // Update URL hash without abrupt scroll jump
    const hash = getHashForLayer(clamped);
    if (window.location.hash !== hash) {
      window.history.replaceState(null, '', hash);
    }
  }, [announceLayer]);

  const nextLayer = useCallback(() => {
    setActiveLayer((prev) => {
      const next = getNextLayerIndex(prev);
      if (next !== prev) {
        announceLayer(next);
        const hash = getHashForLayer(next);
        window.history.replaceState(null, '', hash);
      }
      return next;
    });
  }, [announceLayer]);

  const prevLayer = useCallback(() => {
    setActiveLayer((prev) => {
      const prevIdx = getPrevLayerIndex(prev);
      if (prevIdx !== prev) {
        announceLayer(prevIdx);
        const hash = getHashForLayer(prevIdx);
        window.history.replaceState(null, '', hash);
      }
      return prevIdx;
    });
  }, [announceLayer]);

  const toggleDeckView = useCallback(() => {
    setIsDeckView((prev) => !prev);
  }, []);

  // Handle external navigation events (e.g. from Header or Footer links)
  useEffect(() => {
    const handleCustomNavigate = (e: Event) => {
      const customEvent = e as CustomEvent<{ index: number }>;
      if (customEvent.detail && typeof customEvent.detail.index === 'number') {
        selectLayer(customEvent.detail.index);
      }
    };

    const handleHashChange = () => {
      const targetIndex = getLayerByHash(window.location.hash);
      setActiveLayer(targetIndex);
    };

    window.addEventListener('navigate_layer', handleCustomNavigate);
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('navigate_layer', handleCustomNavigate);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [selectLayer]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is inside an input, textarea or contentEditable
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        nextLayer();
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        prevLayer();
      } else if (e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        toggleDeckView();
      } else if (e.key === 'Escape' && isDeckView) {
        e.preventDefault();
        setIsDeckView(false);
      } else if (['1', '2', '3', '4', '5', '6'].includes(e.key)) {
        e.preventDefault();
        selectLayer(parseInt(e.key, 10) - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextLayer, prevLayer, selectLayer, toggleDeckView, isDeckView]);

  // Pointer move gyro tilt (fine pointer desktop only)
  useEffect(() => {
    if (prefersReduced) return;
    const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!isDesktop) return;

    let rafId: number;
    const handlePointerMove = (e: PointerEvent) => {
      rafId = window.requestAnimationFrame(() => {
        const nx = (e.clientX / window.innerWidth) * 2 - 1;
        const ny = (e.clientY / window.innerHeight) * 2 - 1;
        setMouseTilt({
          x: Math.max(-1, Math.min(1, nx)),
          y: Math.max(-1, Math.min(1, ny)),
        });
      });
    };

    const handlePointerLeave = () => {
      setMouseTilt({ x: 0, y: 0 });
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [prefersReduced]);

  // Intelligent Wheel Handling: Checks whether inner layer has room to scroll, otherwise switches 3D layer
  const handleWheel = (e: React.WheelEvent) => {
    if (isDeckView) {
      const now = Date.now();
      if (now - lastSwitchTimeRef.current < 450) return;
      if (e.deltaY > 20) {
        nextLayer();
        lastSwitchTimeRef.current = now;
      } else if (e.deltaY < -20) {
        prevLayer();
        lastSwitchTimeRef.current = now;
      }
      return;
    }

    const scrollContainer = stageRef.current?.querySelector<HTMLElement>(
      `[data-layer-content="${activeLayer}"]`
    );

    if (scrollContainer) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const isAtTop = scrollTop <= 2;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 4;

      const now = Date.now();
      if (now - lastSwitchTimeRef.current < 550) return;

      if (e.deltaY > 30 && isAtBottom) {
        if (activeLayer < TOTAL_LAYERS - 1) {
          nextLayer();
          lastSwitchTimeRef.current = now;
        }
      } else if (e.deltaY < -30 && isAtTop) {
        if (activeLayer > 0) {
          prevLayer();
          lastSwitchTimeRef.current = now;
        }
      }
    }
  };

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartYRef.current = e.touches[0].clientY;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartYRef.current === null) return;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchEndY - touchStartYRef.current;
    touchStartYRef.current = null;

    if (Math.abs(deltaY) < 50) return;

    const scrollContainer = stageRef.current?.querySelector<HTMLElement>(
      `[data-layer-content="${activeLayer}"]`
    );

    if (deltaY < -50) {
      // Swiped UP -> user wants next layer
      if (!scrollContainer || scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight - 10) {
        nextLayer();
      }
    } else if (deltaY > 50) {
      // Swiped DOWN -> user wants previous layer
      if (!scrollContainer || scrollContainer.scrollTop <= 5) {
        prevLayer();
      }
    }
  };

  return (
    <div
      ref={stageRef}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full h-[100svh] overflow-hidden flex flex-col justify-center items-center pt-20 pb-4 px-3 sm:px-6 md:px-12"
      style={{
        perspective: isDeckView ? '1600px' : '1300px',
        perspectiveOrigin: 'center 45%',
      }}
    >
      {/* Screen Reader ARIA Live Status Announcement */}
      <div className="sr-only" role="status" aria-live="polite">
        {announcement}
      </div>

      {/* 3D Spatial Layers Stack Container */}
      <div
        className="relative w-full h-full max-w-7xl flex items-center justify-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {children.map((child, index) => {
          const meta = SPATIAL_LAYERS[index];
          if (!meta) return null;

          return (
            <SpatialLayer
              key={meta.id}
              meta={meta}
              activeLayer={activeLayer}
              isDeckView={isDeckView}
              mouseTilt={mouseTilt}
              onSelect={selectLayer}
            >
              {child}
            </SpatialLayer>
          );
        })}
      </div>

      {/* Floating 3D Layer HUD Controller */}
      <LayerHUD
        activeLayer={activeLayer}
        isDeckView={isDeckView}
        onSelectLayer={selectLayer}
        onToggleDeckView={toggleDeckView}
        onPrevLayer={prevLayer}
        onNextLayer={nextLayer}
      />

      {/* Mobile Bottom Quick-Layer Pill Bar (<768px) */}
      <div
        aria-label="Mobile Layer Switcher"
        className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 md:hidden flex items-center gap-1 p-1 bg-[#0E131E]/90 border border-white/10 backdrop-blur-md rounded-full shadow-lg"
      >
        {SPATIAL_LAYERS.map((layer) => {
          const isActive = activeLayer === layer.index;
          return (
            <button
              key={layer.id}
              type="button"
              onClick={() => selectLayer(layer.index)}
              aria-label={`Jump to Layer ${layer.label}: ${layer.title}`}
              className={`min-h-[38px] px-2.5 py-1 text-xs font-mono rounded-full transition-all ${
                isActive
                  ? 'bg-[#00F2FE] text-[#08090D] font-bold shadow-[0_0_12px_rgba(0,242,254,0.4)]'
                  : 'text-[#8E9BAE] hover:text-white'
              }`}
            >
              {layer.label}
            </button>
          );
        })}
        <button
          type="button"
          onClick={toggleDeckView}
          aria-label={isDeckView ? 'Focus Layer' : '3D Deck View'}
          className="min-h-[38px] px-2.5 py-1 text-xs font-mono text-[#00F2FE] border-l border-white/10"
        >
          {isDeckView ? '⛶' : '◰'}
        </button>
      </div>
    </div>
  );
};
