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
  const { variant: contextVariant, isOnDark: contextIsOnDark, label: contextLabel } = useCursor();

  const [hasFinePointer, setHasFinePointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [localVariant, setLocalVariant] = useState<CursorVariant>('default');
  const [localIsOnDark, setLocalIsOnDark] = useState(false);
  const [localLabel, setLocalLabel] = useState<string | undefined>(undefined);

  // Position motion values (GPU translate3d only, no React re-render per mousemove)
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);

  // 36px ring follows with spring lag (stiffness 220, damping 28)
  // Direct follow under prefers-reduced-motion
  const springX = useSpring(dotX, { stiffness: 220, damping: 28 });
  const springY = useSpring(dotY, { stiffness: 220, damping: 28 });

  const ringX = prefersReduced ? dotX : springX;
  const ringY = prefersReduced ? dotY : springY;

  // Active state prioritized between context and element-delegated state
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

      // Check context data-cursor attributes
      const projectEl = target.closest('[data-cursor="project"]');
      if (projectEl) {
        setLocalVariant('project');
        setLocalLabel('VIEW');
        return;
      }

      const textEl = target.closest('[data-cursor="text"]');
      if (textEl) {
        setLocalVariant('text');
        setLocalLabel(undefined);
        return;
      }

      const linkEl = target.closest('a, button, [role="button"], [data-cursor="link"]');
      if (linkEl) {
        setLocalVariant('link');
        setLocalLabel(undefined);
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

  // Ring dimension & style matrix
  let ringSize = 'w-[36px] h-[36px]';
  let ringBg = 'bg-transparent';
  let ringBorder = activeIsOnDark ? 'border-[var(--paper)]' : 'border-[var(--ink)]';
  let isDotHidden = false;

  switch (activeVariant) {
    case 'link':
      ringSize = 'w-[64px] h-[64px]';
      ringBg = 'bg-[var(--oxblood)]/[0.12]';
      ringBorder = activeIsOnDark ? 'border-[var(--paper)]' : 'border-[var(--oxblood)]';
      break;
    case 'project':
      ringSize = 'w-[88px] h-[88px]';
      ringBg = 'bg-[var(--oxblood)]';
      ringBorder = 'border-transparent';
      isDotHidden = true;
      break;
    case 'text':
      ringSize = 'w-[6px] h-[6px]';
      ringBorder = activeIsOnDark ? 'border-[var(--paper)]' : 'border-[var(--ink)]';
      break;
    case 'hidden':
      ringSize = 'w-0 h-0';
      isDotHidden = true;
      break;
    case 'default':
    default:
      ringSize = 'w-[36px] h-[36px]';
      break;
  }

  const dotColor = activeIsOnDark ? 'bg-[var(--paper)]' : 'bg-[var(--ink)]';

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-[10000] overflow-hidden transition-opacity duration-200 ${
        isVisible && activeVariant !== 'hidden' ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* 36px/64px/88px Ring (spring-lagged) */}
      <motion.div
        style={{
          x: ringX,
          y: ringY,
        }}
        className={`fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full border flex items-center justify-center transition-[width,height,background-color,border-color] duration-200 ease-out ${ringSize} ${ringBg} ${ringBorder}`}
      >
        {activeVariant === 'project' && (
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--paper)] font-semibold select-none">
            {activeLabel || 'VIEW'}
          </span>
        )}
      </motion.div>

      {/* 8px Dot (direct pointer follow) */}
      {!isDotHidden && (
        <motion.div
          style={{
            x: dotX,
            y: dotY,
          }}
          className={`fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${dotColor} transition-colors duration-150`}
        />
      )}
    </div>
  );
};
