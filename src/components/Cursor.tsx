/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useCursor, CursorVariant } from '../context/CursorContext';

interface CursorProps {
  introDone: boolean;
}

export const Cursor: React.FC<CursorProps> = ({ introDone }) => {
  const prefersReduced = usePrefersReducedMotion();
  const {
    variant: contextVariant,
    isOnDark: contextIsOnDark,
    label: contextLabel,
  } = useCursor();

  const [hasFinePointer, setHasFinePointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [localVariant, setLocalVariant] = useState<CursorVariant>('default');
  const [localIsOnDark, setLocalIsOnDark] = useState(false);
  const [localLabel, setLocalLabel] = useState<string | undefined>(undefined);

  // Position motion values (GPU translate3d only, zero React re-render per mousemove)
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);

  // Follower ring follows with tuned spring inertia (stiffness 240, damping 26)
  // Direct follow under prefers-reduced-motion
  const springX = useSpring(dotX, { stiffness: 240, damping: 26, mass: 0.75 });
  const springY = useSpring(dotY, { stiffness: 240, damping: 26, mass: 0.75 });

  const ringX = prefersReduced ? dotX : springX;
  const ringY = prefersReduced ? dotY : springY;

  // Active state prioritized between imperative context and element-delegated state
  const activeVariant = contextVariant !== 'default' ? contextVariant : localVariant;
  const activeIsOnDark = contextIsOnDark || localIsOnDark;
  const activeLabel = contextLabel || localLabel;

  // 1. Media query check & <html> class management
  useEffect(() => {
    if (!introDone) return;

    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    setHasFinePointer(mq.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setHasFinePointer(e.matches);
      if (!e.matches) {
        document.documentElement.classList.remove('has-custom-cursor');
      } else {
        document.documentElement.classList.add('has-custom-cursor');
      }
    };

    if (mq.addEventListener) {
      mq.addEventListener('change', handleMediaChange);
    }

    if (mq.matches) {
      document.documentElement.classList.add('has-custom-cursor');
    }

    return () => {
      if (mq.removeEventListener) {
        mq.removeEventListener('change', handleMediaChange);
      }
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, [introDone]);

  const isVisibleRef = useRef(false);

  // 2. High-performance event listeners: position & context-aware state delegation
  useEffect(() => {
    if (!introDone || !hasFinePointer) return;

    const handlePointerMove = (e: PointerEvent) => {
      dotX.set(e.clientX);
      dotY.set(e.clientY);
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        setIsVisible(true);
      }
    };

    const handlePointerOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Retain native cursor for form elements and content editables
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable
      ) {
        setLocalVariant('hidden');
        return;
      }

      // Check on-dark sections
      const isDark = Boolean(
        target.closest('[data-cursor="on-dark"]') ||
        target.closest('[data-cursor-dark]') ||
        target.closest('#contact') ||
        target.closest('#marquee-strips')
      );
      setLocalIsOnDark(isDark);

      // Check disabled interactive elements
      const disabledEl = target.closest('[disabled], [aria-disabled="true"], [data-cursor="disabled"]');
      if (disabledEl) {
        setLocalVariant('disabled');
        setLocalLabel(undefined);
        return;
      }

      // Check 3D scene stage
      const sceneEl = target.closest('[data-cursor="3d-scene"]');
      if (sceneEl) {
        setLocalVariant('3d-scene');
        const customLabel = sceneEl.getAttribute('data-cursor-label') || 'ROTATE';
        setLocalLabel(customLabel);
        return;
      }

      // Check drag surfaces
      const dragEl = target.closest('[data-cursor="drag"]');
      if (dragEl) {
        setLocalVariant('drag');
        const customLabel = dragEl.getAttribute('data-cursor-label') || 'DRAG';
        setLocalLabel(customLabel);
        return;
      }

      // Check project cards and previews
      const projectEl = target.closest('[data-cursor="project"]');
      if (projectEl) {
        setLocalVariant('project');
        const customLabel = projectEl.getAttribute('data-cursor-label') || 'VIEW';
        setLocalLabel(customLabel);
        return;
      }

      // Check text-focused areas
      const textEl = target.closest('[data-cursor="text"]');
      if (textEl) {
        setLocalVariant('text');
        setLocalLabel(undefined);
        return;
      }

      // Check general links and buttons
      const linkEl = target.closest('a, button, [role="button"], [data-cursor="link"]');
      if (linkEl) {
        setLocalVariant('link');
        const customLabel = linkEl.getAttribute('data-cursor-label') || undefined;
        setLocalLabel(customLabel);
        return;
      }

      // Default state
      setLocalVariant('default');
      setLocalLabel(undefined);
    };

    const handleMouseLeave = () => {
      isVisibleRef.current = false;
      setIsVisible(false);
    };

    const handleWindowBlur = () => {
      isVisibleRef.current = false;
      setIsVisible(false);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('mouseover', handlePointerOver, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mouseover', handlePointerOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [introDone, hasFinePointer, dotX, dotY]);

  // Don't render until intro is done and device has fine pointer
  if (!introDone || !hasFinePointer) {
    return null;
  }

  // Ring dimension & style matrix based on active contextual state
  let ringSize = 'w-[32px] h-[32px]';
  let ringBg = 'bg-transparent';
  let ringBorder = activeIsOnDark ? 'border-[var(--paper)]/50' : 'border-[var(--ink)]/40';
  let isDotHidden = false;
  let ringRadius = 'rounded-full';

  switch (activeVariant) {
    case 'link':
      ringSize = activeLabel ? 'w-[60px] h-[60px]' : 'w-[52px] h-[52px]';
      ringBg = activeLabel ? 'bg-[var(--paper-deep)]/85 backdrop-blur-sm' : 'bg-[var(--primary)]/[0.12]';
      ringBorder = 'border-[var(--primary)]';
      if (activeLabel) isDotHidden = true;
      break;
    case 'project':
      ringSize = 'w-[84px] h-[84px]';
      ringBg = 'bg-[var(--primary)]';
      ringBorder = 'border-transparent shadow-[0_0_24px_var(--primary-glow)]';
      isDotHidden = true;
      break;
    case '3d-scene':
      ringSize = 'w-[78px] h-[78px]';
      ringBg = 'bg-[var(--paper-deep)]/90 backdrop-blur-md shadow-lg';
      ringBorder = 'border-[var(--primary)]';
      isDotHidden = true;
      break;
    case 'drag':
      ringSize = 'w-[72px] h-[40px]';
      ringRadius = 'rounded-2xl';
      ringBg = 'bg-[var(--paper-deep)]/90 backdrop-blur-md shadow-lg';
      ringBorder = 'border-[var(--accent)]';
      isDotHidden = true;
      break;
    case 'text':
      ringSize = 'w-[2px] h-[20px]';
      ringRadius = 'rounded-none';
      ringBg = 'bg-[var(--primary)]';
      ringBorder = 'border-transparent';
      isDotHidden = true;
      break;
    case 'disabled':
      ringSize = 'w-[28px] h-[28px]';
      ringBg = 'bg-transparent';
      ringBorder = 'border-dashed border-[var(--ink-muted)]/60';
      break;
    case 'hidden':
      ringSize = 'w-0 h-0';
      isDotHidden = true;
      break;
    case 'default':
    default:
      ringSize = 'w-[32px] h-[32px]';
      break;
  }

  const dotColor = activeIsOnDark ? 'bg-[var(--paper)]' : 'bg-[var(--primary)]';

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-[10000] overflow-hidden transition-opacity duration-200 ${
        isVisible && activeVariant !== 'hidden' ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Context-Aware Follower Ring (spring-interpolated) */}
      <motion.div
        style={{
          x: ringX,
          y: ringY,
        }}
        className={`fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 border flex items-center justify-center transition-[width,height,border-radius,background-color,border-color] duration-250 ease-out ${ringRadius} ${ringSize} ${ringBg} ${ringBorder}`}
      >
        {activeVariant === 'link' && activeLabel && (
          <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-[var(--primary)] font-bold select-none text-center px-1">
            {activeLabel}
          </span>
        )}

        {activeVariant === 'project' && (
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--paper)] font-bold select-none">
            {activeLabel || 'VIEW'}
          </span>
        )}

        {activeVariant === '3d-scene' && (
          <div className="flex flex-col items-center justify-center font-mono text-[8px] uppercase tracking-[0.14em] text-[var(--primary)] font-bold select-none leading-tight text-center">
            <span className="text-[12px] leading-none mb-0.5">↺</span>
            <span>{activeLabel || 'ROTATE'}</span>
          </div>
        )}

        {activeVariant === 'drag' && (
          <div className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-[var(--accent)] font-bold select-none">
            <span>←</span>
            <span>{activeLabel || 'DRAG'}</span>
            <span>→</span>
          </div>
        )}

        {activeVariant === 'disabled' && (
          <span className="font-mono text-[11px] text-[var(--ink-muted)] select-none">
            ✕
          </span>
        )}
      </motion.div>

      {/* 7px Precision Dot (immediate pointer follow) */}
      {!isDotHidden && (
        <motion.div
          style={{
            x: dotX,
            y: dotY,
          }}
          className={`fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-[7px] h-[7px] rounded-full ${dotColor} shadow-[0_0_8px_var(--primary-glow)] transition-colors duration-150`}
        />
      )}
    </div>
  );
};
