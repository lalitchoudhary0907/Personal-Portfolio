/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { profile } from '../data/profile';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface HeroProps {
  introDone?: boolean;
}

export const Hero: React.FC<HeroProps> = ({ introDone = true }) => {
  const prefersReduced = usePrefersReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const shouldReveal = introDone || prefersReduced;

  // Variable font pointer interaction (Desktop fine-pointer only)
  useEffect(() => {
    if (prefersReduced) return;
    const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!isDesktop || !heroRef.current) return;

    const letterEls = heroRef.current.querySelectorAll<HTMLElement>('[data-var-letter="true"]');
    if (!letterEls.length) return;

    interface LetterState {
      el: HTMLElement;
      currentWght: number;
      currentWdth: number;
      targetWght: number;
      targetWdth: number;
    }

    const letters: LetterState[] = Array.from(letterEls).map((el) => ({
      el,
      currentWght: 500,
      currentWdth: 100,
      targetWght: 500,
      targetWdth: 100,
    }));

    let mouseX = -9999;
    let mouseY = -9999;
    let isPointerActive = false;
    let rafId: number;

    const handlePointerMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      isPointerActive = true;
    };

    const handlePointerLeave = () => {
      isPointerActive = false;
      mouseX = -9999;
      mouseY = -9999;
    };

    const updateLoop = () => {
      let needsNextFrame = false;

      for (let i = 0; i < letters.length; i++) {
        const item = letters[i];

        if (isPointerActive) {
          const rect = item.el.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dist = Math.hypot(mouseX - cx, mouseY - cy);

          if (dist < 300) {
            const factor = 1 - dist / 300;
            item.targetWght = 500 + factor * 300; // 500 -> 800
            item.targetWdth = 100 - factor * 15; // 100 -> 85
          } else {
            item.targetWght = 500;
            item.targetWdth = 100;
          }
        } else {
          item.targetWght = 500;
          item.targetWdth = 100;
        }

        // Smooth interpolation
        const diffWght = item.targetWght - item.currentWght;
        const diffWdth = item.targetWdth - item.currentWdth;

        if (Math.abs(diffWght) > 0.4 || Math.abs(diffWdth) > 0.2) {
          item.currentWght += diffWght * 0.12;
          item.currentWdth += diffWdth * 0.12;
          item.el.style.fontVariationSettings = `'wght' ${Math.round(
            item.currentWght
          )}, 'wdth' ${item.currentWdth.toFixed(1)}, 'opsz' 96`;
          needsNextFrame = true;
        } else if (item.currentWght !== item.targetWght || item.currentWdth !== item.targetWdth) {
          item.currentWght = item.targetWght;
          item.currentWdth = item.targetWdth;
          item.el.style.fontVariationSettings = `'wght' ${Math.round(
            item.currentWght
          )}, 'wdth' ${item.currentWdth.toFixed(1)}, 'opsz' 96`;
        }
      }

      if (isPointerActive || needsNextFrame) {
        rafId = requestAnimationFrame(updateLoop);
      }
    };

    const onPointerMoveThrottled = (e: PointerEvent) => {
      handlePointerMove(e);
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateLoop);
    };

    window.addEventListener('pointermove', onPointerMoveThrottled, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    window.addEventListener('blur', handlePointerLeave);

    return () => {
      window.removeEventListener('pointermove', onPointerMoveThrottled);
      window.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('blur', handlePointerLeave);
      cancelAnimationFrame(rafId);
    };
  }, [prefersReduced]);

  const revealTransition = (staggerIndex: number) => ({
    duration: 0.85,
    ease: [0.76, 0, 0.24, 1] as const,
    delay: prefersReduced ? 0 : staggerIndex * 0.09,
  });

  return (
    <section
      id="top"
      ref={heroRef}
      aria-label="Introduction"
      className="relative min-h-[100svh] min-h-[100dvh] flex flex-col justify-between pt-[max(6rem,calc(5rem+env(safe-area-inset-top)))] pb-[max(2rem,calc(1.5rem+env(safe-area-inset-bottom)))] px-6 sm:px-10 max-w-7xl mx-auto w-full select-none"
    >
      {/* Top Section / Display Name */}
      <div className="w-full flex flex-col mt-auto mb-auto">
        {/* Line 1: "LALIT" with SerifAccent italic on "A" in oxblood */}
        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: prefersReduced ? 0 : '108%' }}
            animate={{ y: shouldReveal ? 0 : '108%' }}
            transition={revealTransition(0)}
            className="font-display font-bold tracking-[-0.04em] leading-[0.88] text-[var(--ink)] text-[clamp(3.8rem,18vw,14rem)] flex items-baseline whitespace-nowrap overflow-hidden select-none"
          >
            <span data-var-letter="true" className="inline-block transition-[font-variation-settings]">
              L
            </span>
            <span
              className="font-serif italic font-normal text-[var(--oxblood)] inline-block px-1 -mx-0.5"
              style={{ fontFeatureSettings: '"swsh" 1' }}
            >
              A
            </span>
            <span data-var-letter="true" className="inline-block transition-[font-variation-settings]">
              L
            </span>
            <span data-var-letter="true" className="inline-block transition-[font-variation-settings]">
              I
            </span>
            <span data-var-letter="true" className="inline-block transition-[font-variation-settings]">
              T
            </span>
          </motion.h1>
        </div>

        {/* Line 2: "CHOUDHARY" with variable font response */}
        <div className="overflow-hidden -mt-1 sm:-mt-3">
          <motion.div
            initial={{ y: prefersReduced ? 0 : '108%' }}
            animate={{ y: shouldReveal ? 0 : '108%' }}
            transition={revealTransition(1)}
            aria-hidden="true"
            className="font-display font-bold tracking-[-0.04em] leading-[0.88] text-[var(--ink)] text-[clamp(2.4rem,12.5vw,9.5rem)] flex items-baseline whitespace-nowrap overflow-hidden select-none"
          >
            {'CHOUDHARY'.split('').map((char, index) => (
              <span
                key={index}
                data-var-letter="true"
                className="inline-block transition-[font-variation-settings]"
              >
                {char}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Tagline & Education Metadata */}
        <div className="mt-8 sm:mt-12 pt-6 border-t border-[var(--line)] grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Tagline */}
          <div className="overflow-hidden md:col-span-7">
            <motion.p
              initial={{ y: prefersReduced ? 0 : '108%' }}
              animate={{ y: shouldReveal ? 0 : '108%' }}
              transition={revealTransition(2)}
              className="font-display text-[clamp(1.15rem,2.1vw,1.6rem)] text-[var(--ink)] font-normal leading-[1.35] max-w-xl"
            >
              {profile.tagline}
            </motion.p>
          </div>

          {/* Education Label */}
          <div className="overflow-hidden md:col-span-5 md:text-right">
            <motion.p
              initial={{ y: prefersReduced ? 0 : '108%' }}
              animate={{ y: shouldReveal ? 0 : '108%' }}
              transition={revealTransition(3)}
              className="font-mono text-[11px] sm:text-[12px] uppercase tracking-[0.14em] text-[var(--ink-muted)] leading-relaxed"
            >
              {profile.educationLabel}
            </motion.p>
          </div>
        </div>
      </div>

      {/* Bottom Row: Micro-loop Scroll Indicator */}
      <div className="w-full flex items-center justify-between pt-6 border-t border-[var(--line)]/50 mt-6 sm:mt-8">
        <div className="overflow-hidden">
          <motion.div
            initial={{ y: prefersReduced ? 0 : '108%' }}
            animate={{ y: shouldReveal ? 0 : '108%' }}
            transition={revealTransition(4)}
          >
            <a
              href="#projects"
              data-cursor="link"
              aria-label="Scroll to work and projects"
              className="group min-h-[44px] inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--ink-muted)] hover:text-[var(--oxblood)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--oxblood)] py-2"
            >
              <span>Scroll</span>
              <div
                className="w-[1px] h-8 bg-[var(--line)] overflow-hidden relative"
                aria-hidden="true"
              >
                <div className="w-full h-full bg-[var(--oxblood)] animate-scroll-line" />
              </div>
            </a>
          </motion.div>
        </div>

        <div className="overflow-hidden">
          <motion.span
            initial={{ y: prefersReduced ? 0 : '108%' }}
            animate={{ y: shouldReveal ? 0 : '108%' }}
            transition={revealTransition(4)}
            className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--ink-muted)]"
          >
            PORTFOLIO &mdash; 2026
          </motion.span>
        </div>
      </div>
    </section>
  );
};

// Also export HeroSection alias for backwards compatibility
export const HeroSection = Hero;
