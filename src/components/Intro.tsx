/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useMagnetic } from '../hooks/useMagnetic';
import { IntroVariant } from '../hooks/useIntro';

interface IntroProps {
  isSplitting: boolean;
  variant: IntroVariant;
  onSkip: () => void;
}

const EASE_FOLIO: [number, number, number, number] = [0.76, 0, 0.24, 1];

// Static SVG Noise Data URI (opacity 0.06, zero animation)
const NOISE_BG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`;

const MARQUEE_TEXT = 'LALIT CHOUDHARY ✦ COMPUTER SCIENCE & AI ✦ LALIT CHOUDHARY ✦ COMPUTER SCIENCE & AI ✦ LALIT CHOUDHARY ✦ COMPUTER SCIENCE & AI ✦ ';

export const Intro: React.FC<IntroProps> = ({ isSplitting, variant, onSkip }) => {
  // Desktop-only interactive magnetic monogram shift
  const [isFinePointer, setIsFinePointer] = useState(false);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, { stiffness: 220, damping: 28 });
  const springY = useSpring(rawY, { stiffness: 220, damping: 28 });

  // Magnetic effect for Skip button
  const skipMagnetic = useMagnetic<HTMLButtonElement>({
    radius: 80,
    pullFactor: 0.25,
    maxOffset: 8,
  });

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)');
    setIsFinePointer(mq.matches);

    const handlePointerMove = (e: PointerEvent) => {
      if (!mq.matches || isSplitting) return;
      // Shift up to 12px toward pointer
      const nx = ((e.clientX - window.innerWidth / 2) / (window.innerWidth / 2)) * 12;
      const ny = ((e.clientY - window.innerHeight / 2) / (window.innerHeight / 2)) * 12;
      rawX.set(nx);
      rawY.set(ny);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, [isSplitting, rawX, rawY]);

  // Reduced motion: simple crossfade in 400ms without sliding or splitting
  if (variant === 'reduced') {
    return (
      <motion.aside
        aria-label="Cover Intro"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className="fixed inset-0 z-[9999] bg-[var(--oxblood)] flex flex-col items-center justify-center text-[var(--paper)] pointer-events-none select-none"
      >
        <div className="font-display font-bold text-7xl tracking-tight">LC</div>
        <div className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--paper)]/80 mt-3">
          PORTFOLIO &mdash; 2026
        </div>
      </motion.aside>
    );
  }

  const isQuick = variant === 'quick';

  return (
    <aside
      aria-label="Cover Intro"
      onClick={onSkip}
      className="fixed inset-0 z-[9999] overflow-hidden select-none cursor-pointer"
    >
      {/* ==================================================================== */}
      {/* Top Split Half Curtain (-100% on split) */}
      {/* ==================================================================== */}
      <motion.div
        initial={{ y: '0%' }}
        animate={isSplitting ? { y: '-100%' } : { y: '0%' }}
        transition={{ duration: 0.8, ease: EASE_FOLIO }}
        className="absolute top-0 left-0 right-0 h-1/2 bg-[var(--oxblood)] overflow-hidden z-10"
      >
        {/* Static Grain Layer (0.06 opacity, static, GPU-friendly) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none opacity-[0.06]"
          style={{ backgroundImage: NOISE_BG }}
        />

        {/* Top Marquee Strip (slides in from left) */}
        <motion.div
          initial={{ x: isQuick ? '0%' : '-100%', opacity: 0 }}
          animate={{ x: '0%', opacity: 1 }}
          transition={{
            duration: isQuick ? 0.3 : 0.8,
            delay: isQuick ? 0.1 : 1.1,
            ease: EASE_FOLIO,
          }}
          className="absolute bottom-6 left-0 right-0 h-8 border-y border-[var(--paper)]/30 bg-[var(--oxblood)] flex items-center overflow-hidden whitespace-nowrap"
        >
          <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--paper)]/90 flex-shrink-0 animate-marquee">
            {MARQUEE_TEXT}
          </div>
          <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--paper)]/90 flex-shrink-0 animate-marquee" aria-hidden="true">
            {MARQUEE_TEXT}
          </div>
        </motion.div>
      </motion.div>

      {/* ==================================================================== */}
      {/* Bottom Split Half Curtain (+100% on split) */}
      {/* ==================================================================== */}
      <motion.div
        initial={{ y: '0%' }}
        animate={isSplitting ? { y: '100%' } : { y: '0%' }}
        transition={{ duration: 0.8, ease: EASE_FOLIO }}
        className="absolute bottom-0 left-0 right-0 h-1/2 bg-[var(--oxblood)] overflow-hidden z-10"
      >
        {/* Static Grain Layer (0.06 opacity) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none opacity-[0.06]"
          style={{ backgroundImage: NOISE_BG }}
        />

        {/* Bottom Marquee Strip (slides in from right) */}
        <motion.div
          initial={{ x: isQuick ? '0%' : '100%', opacity: 0 }}
          animate={{ x: '0%', opacity: 1 }}
          transition={{
            duration: isQuick ? 0.3 : 0.8,
            delay: isQuick ? 0.1 : 1.1,
            ease: EASE_FOLIO,
          }}
          className="absolute top-6 left-0 right-0 h-8 border-y border-[var(--paper)]/30 bg-[var(--oxblood)] flex items-center overflow-hidden whitespace-nowrap"
        >
          <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--paper)]/90 flex-shrink-0 animate-marquee-reverse">
            {MARQUEE_TEXT}
          </div>
          <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--paper)]/90 flex-shrink-0 animate-marquee-reverse" aria-hidden="true">
            {MARQUEE_TEXT}
          </div>
        </motion.div>
      </motion.div>

      {/* ==================================================================== */}
      {/* Center 1px Paper Hairline (scaleX 0 -> 1 over 600ms) */}
      {/* ==================================================================== */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isSplitting ? { opacity: 0 } : { scaleX: 1 }}
        transition={{
          duration: isQuick ? 0.3 : 0.6,
          ease: EASE_FOLIO,
        }}
        className="absolute top-1/2 left-0 right-0 h-[1px] bg-[var(--paper)]/40 origin-left z-20 pointer-events-none -translate-y-1/2"
      />

      {/* ==================================================================== */}
      {/* Center Monogram: "L" and "C" with masked rise + pointer spring */}
      {/* ==================================================================== */}
      <motion.div
        aria-hidden="true"
        style={{
          x: isFinePointer ? springX : 0,
          y: isFinePointer ? springY : 0,
        }}
        animate={
          isSplitting
            ? { scale: 0.8, opacity: 0 }
            : { scale: 1, opacity: 1 }
        }
        transition={{ duration: 0.4, ease: EASE_FOLIO }}
        className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none"
      >
        <div className="flex items-center text-[clamp(6rem,24vw,17rem)] font-display font-extrabold leading-none tracking-[-0.05em] text-[var(--paper)]">
          {/* Letter L with overflow-hidden mask */}
          <div className="overflow-hidden inline-flex">
            <motion.span
              initial={{ y: '110%' }}
              animate={{ y: '0%' }}
              transition={{
                duration: isQuick ? 0.35 : 0.75,
                delay: isQuick ? 0.05 : 0.3,
                ease: EASE_FOLIO,
              }}
              className="inline-block"
            >
              L
            </motion.span>
          </div>

          {/* Letter C with overflow-hidden mask (80ms stagger) */}
          <div className="overflow-hidden inline-flex">
            <motion.span
              initial={{ y: '110%' }}
              animate={{ y: '0%' }}
              transition={{
                duration: isQuick ? 0.35 : 0.75,
                delay: isQuick ? 0.12 : 0.38,
                ease: EASE_FOLIO,
              }}
              className="inline-block"
            >
              C
            </motion.span>
          </div>
        </div>

        {/* Caption: "PORTFOLIO — 2026" */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: isQuick ? 0.3 : 0.6,
            delay: isQuick ? 0.2 : 0.6,
            ease: EASE_FOLIO,
          }}
          className="font-mono text-xs sm:text-sm uppercase tracking-[0.2em] text-[var(--paper)]/85 mt-2 sm:mt-4"
        >
          PORTFOLIO &mdash; 2026
        </motion.div>
      </motion.div>

      {/* ==================================================================== */}
      {/* Skip Button (bottom right, appears at 0.2s, accessible) */}
      {/* ==================================================================== */}
      <motion.button
        ref={skipMagnetic.ref}
        style={skipMagnetic.style}
        type="button"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        onClick={(e) => {
          e.stopPropagation();
          onSkip();
        }}
        data-cursor="link"
        aria-label="Skip introduction"
        className="fixed bottom-6 right-6 z-40 min-h-[44px] min-w-[44px] inline-flex items-center justify-center font-mono text-xs uppercase tracking-[0.14em] text-[var(--paper)]/90 hover:text-[var(--paper)] px-4 py-2 border border-[var(--paper)]/30 hover:border-[var(--paper)] bg-[var(--oxblood)] transition-colors cursor-pointer touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--paper)]"
      >
        Skip &rarr;
      </motion.button>
    </aside>
  );
};
