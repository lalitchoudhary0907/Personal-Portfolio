/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useMagnetic } from '../hooks/useMagnetic';
import { Kicker } from './Typography';
import { PortraitFrame } from './PortraitFrame';
import { Hero3DStage } from './Hero3DStage';

interface HeroProps {
  introDone?: boolean;
}

export const Hero: React.FC<HeroProps> = ({ introDone = true }) => {
  const prefersReduced = usePrefersReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const shouldReveal = introDone || prefersReduced;

  // Pointer position for subtle global typographic parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 120, damping: 24 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 120, damping: 24 });

  // Subtle typography parallax (-8px to +8px)
  const typeParallaxX = useTransform(smoothMouseX, [-1, 1], [-8, 8]);
  const typeParallaxY = useTransform(smoothMouseY, [-1, 1], [-6, 6]);

  // Magnetic CTA buttons
  const primaryCtaMagnetic = useMagnetic<HTMLAnchorElement>({
    radius: 70,
    pullFactor: 0.25,
    maxOffset: 8,
  });

  const secondaryCtaMagnetic = useMagnetic<HTMLAnchorElement>({
    radius: 70,
    pullFactor: 0.22,
    maxOffset: 7,
  });

  const honorLinkMagnetic = useMagnetic<HTMLAnchorElement>({
    radius: 60,
    pullFactor: 0.2,
    maxOffset: 6,
  });

  // Track pointer across the hero viewport
  useEffect(() => {
    if (prefersReduced) return;
    const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!isDesktop || !heroRef.current) return;

    const el = heroRef.current;
    const handlePointerMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      mouseX.set(Math.max(-1, Math.min(1, nx)));
      mouseY.set(Math.max(-1, Math.min(1, ny)));
    };

    const handlePointerLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [prefersReduced, mouseX, mouseY]);

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
      currentWght: 600,
      currentWdth: 100,
      targetWght: 600,
      targetWdth: 100,
    }));

    let pX = -9999;
    let pY = -9999;
    let isPointerActive = false;
    let rafId: number;

    const handlePointerMove = (e: PointerEvent) => {
      pX = e.clientX;
      pY = e.clientY;
      isPointerActive = true;
    };

    const handlePointerLeave = () => {
      isPointerActive = false;
      pX = -9999;
      pY = -9999;
    };

    const updateLoop = () => {
      let needsNextFrame = false;

      for (let i = 0; i < letters.length; i++) {
        const item = letters[i];

        if (isPointerActive) {
          const rect = item.el.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dist = Math.hypot(pX - cx, pY - cy);

          if (dist < 320) {
            const factor = 1 - dist / 320;
            item.targetWght = 600 + factor * 260; // 600 -> 860
            item.targetWdth = 100 - factor * 14;  // 100 -> 86
          } else {
            item.targetWght = 600;
            item.targetWdth = 100;
          }
        } else {
          item.targetWght = 600;
          item.targetWdth = 100;
        }

        // Smooth interpolation
        const diffWght = item.targetWght - item.currentWght;
        const diffWdth = item.targetWdth - item.currentWdth;

        if (Math.abs(diffWght) > 0.4 || Math.abs(diffWdth) > 0.2) {
          item.currentWght += diffWght * 0.14;
          item.currentWdth += diffWdth * 0.14;
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

  const charTransition = (index: number) => ({
    duration: 0.7,
    ease: [0.76, 0, 0.24, 1] as const,
    delay: prefersReduced ? 0 : 0.05 + index * 0.035,
  });

  return (
    <section
      id="top"
      ref={heroRef}
      aria-label="Introduction"
      className="relative min-h-[100svh] min-h-[100dvh] flex flex-col justify-between pt-[max(5.5rem,calc(4.75rem+env(safe-area-inset-top)))] pb-12 sm:pb-16 px-6 sm:px-10 max-w-7xl mx-auto w-full select-none"
    >
      {/* Top Meta Bar */}
      <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 pb-4 border-b border-[var(--line)]">
        <Kicker index="01" title="MONOGRAPH" meta="2026 EDITION" />
        <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--ink-muted)] flex items-center gap-2">
          <span>[28.4° N, 77.0° E]</span>
          <span className="text-[var(--ink-muted)]/40" aria-hidden="true">·</span>
          <span>Sonipat, India</span>
        </div>
      </div>

      {/* Main 12-Column Asymmetrical Editorial Body */}
      <div className="my-auto py-8 sm:py-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* Left Column (Cols 1-7): Primary Typographic Identity & Prose */}
        <motion.div
          style={prefersReduced ? {} : { x: typeParallaxX, y: typeParallaxY }}
          className="lg:col-span-7 flex flex-col justify-center"
        >
          {/* Subtle Discipline Kicker */}
          <div className="overflow-hidden mb-3 sm:mb-4">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: shouldReveal ? 1 : 0, y: shouldReveal ? 0 : 12 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.16em] text-[var(--secondary)]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
              <span>First-Year B.Tech CS &amp; AI</span>
              <span className="text-[var(--ink-muted)]/40 hidden sm:inline">·</span>
              <span className="text-[var(--ink-muted)] hidden sm:inline">Newton School of Technology</span>
            </motion.div>
          </div>

          {/* Line 1: Character-by-Character Reveal of "LALIT" with swash serif "A" */}
          <h1 className="font-display font-bold tracking-[-0.04em] leading-[0.88] text-[var(--ink)] text-[clamp(3.8rem,13vw,9.5rem)] flex items-baseline whitespace-nowrap overflow-hidden select-none">
            <span className="overflow-hidden inline-block">
              <motion.span
                initial={{ y: prefersReduced ? 0 : '110%' }}
                animate={{ y: shouldReveal ? 0 : '110%' }}
                transition={charTransition(0)}
                data-var-letter="true"
                className="inline-block transition-[font-variation-settings]"
              >
                L
              </motion.span>
            </span>

            <span className="overflow-hidden inline-block px-1 -mx-0.5">
              <motion.span
                initial={{ y: prefersReduced ? 0 : '110%', opacity: 0 }}
                animate={{ y: shouldReveal ? 0 : '110%', opacity: shouldReveal ? 1 : 0 }}
                transition={charTransition(1)}
                className="font-serif italic font-normal text-[var(--primary)] inline-block transition-colors duration-500"
                style={{ fontFeatureSettings: '"swsh" 1' }}
              >
                A
              </motion.span>
            </span>

            <span className="overflow-hidden inline-block">
              <motion.span
                initial={{ y: prefersReduced ? 0 : '110%' }}
                animate={{ y: shouldReveal ? 0 : '110%' }}
                transition={charTransition(2)}
                data-var-letter="true"
                className="inline-block transition-[font-variation-settings]"
              >
                L
              </motion.span>
            </span>

            <span className="overflow-hidden inline-block">
              <motion.span
                initial={{ y: prefersReduced ? 0 : '110%' }}
                animate={{ y: shouldReveal ? 0 : '110%' }}
                transition={charTransition(3)}
                data-var-letter="true"
                className="inline-block transition-[font-variation-settings]"
              >
                I
              </motion.span>
            </span>

            <span className="overflow-hidden inline-block">
              <motion.span
                initial={{ y: prefersReduced ? 0 : '110%' }}
                animate={{ y: shouldReveal ? 0 : '110%' }}
                transition={charTransition(4)}
                data-var-letter="true"
                className="inline-block transition-[font-variation-settings]"
              >
                T
              </motion.span>
            </span>
          </h1>

          {/* Line 2: Character-by-Character Staggered Reveal of "CHOUDHARY" */}
          <div
            aria-hidden="true"
            className="font-display font-bold tracking-[-0.04em] leading-[0.88] text-[var(--ink)] text-[clamp(2.4rem,8.6vw,6.4rem)] flex items-baseline whitespace-nowrap overflow-hidden select-none -mt-1 sm:-mt-2"
          >
            {'CHOUDHARY'.split('').map((char, index) => (
              <span key={index} className="overflow-hidden inline-block">
                <motion.span
                  initial={{ y: prefersReduced ? 0 : '110%' }}
                  animate={{ y: shouldReveal ? 0 : '110%' }}
                  transition={charTransition(5 + index)}
                  data-var-letter="true"
                  className="inline-block transition-[font-variation-settings]"
                >
                  {char}
                </motion.span>
              </span>
            ))}
          </div>

          {/* Refined Supporting Statement (Accurate, Non-Slogan, Concise) */}
          <div className="mt-5 sm:mt-6 overflow-hidden max-w-xl">
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: shouldReveal ? 1 : 0, y: shouldReveal ? 0 : 15 }}
              transition={{ duration: 0.65, delay: prefersReduced ? 0 : 0.35, ease: [0.76, 0, 0.24, 1] }}
              className="font-display text-[clamp(1.1rem,1.9vw,1.45rem)] text-[var(--ink)] font-normal leading-[1.45]"
            >
              First-year B.Tech Computer Science &amp; Artificial Intelligence student at Newton School of Technology (Rishihood University). Building open-source web projects, exploring machine learning fundamentals, and quantitative problem-solving.
            </motion.p>
          </div>

          {/* Action CTAs with Magnetic Physics */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: shouldReveal ? 1 : 0, y: shouldReveal ? 0 : 15 }}
            transition={{ duration: 0.5, delay: prefersReduced ? 0 : 0.42 }}
            className="mt-7 flex flex-wrap items-center gap-3.5"
          >
            <motion.a
              ref={primaryCtaMagnetic.ref}
              style={primaryCtaMagnetic.style}
              href="#projects"
              data-cursor="link"
              className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--primary)] text-[var(--paper)] font-mono text-xs uppercase tracking-wider font-semibold transition-all hover:opacity-95 active:scale-95 shadow-[0_0_24px_var(--primary-glow)]"
            >
              <span>Explore Selected Works</span>
              <span aria-hidden="true">↓</span>
            </motion.a>

            <motion.a
              ref={secondaryCtaMagnetic.ref}
              style={secondaryCtaMagnetic.style}
              href="#contact"
              data-cursor="link"
              className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--paper-deep)] hover:bg-[var(--paper-card)] border border-[var(--border-bright)] hover:border-[var(--primary)] text-[var(--ink)] font-mono text-xs uppercase tracking-wider transition-all"
            >
              <span>Initiate Dialogue</span>
              <span aria-hidden="true">↗</span>
            </motion.a>

            <motion.a
              ref={honorLinkMagnetic.ref}
              style={honorLinkMagnetic.style}
              href="#achievements"
              data-cursor="link"
              className="min-h-[44px] inline-flex items-center gap-1.5 px-3 py-2 text-[var(--secondary)] hover:text-[var(--accent)] font-mono text-xs transition-colors"
            >
              <span className="text-[var(--accent)]" aria-hidden="true">✦</span>
              <span>WorldQuant Challenge Gold</span>
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Right Column (Cols 8-12): Authentic Portrait + Integrated Architectural Dossier */}
        <div className="lg:col-span-5 flex flex-col justify-center gap-5">
          {/* Integrated Real Portrait Card with Pointer Tilt & Photographic Light */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: shouldReveal ? 1 : 0, y: shouldReveal ? 0 : 20, scale: shouldReveal ? 1 : 0.98 }}
            transition={{ duration: 0.7, delay: prefersReduced ? 0 : 0.22, ease: [0.76, 0, 0.24, 1] }}
            className="flex items-center gap-4 sm:gap-5 p-3.5 sm:p-4 rounded-2xl border border-[var(--border-bright)] bg-[var(--paper-deep)]/90 backdrop-blur-xl shadow-xl relative overflow-hidden group"
          >
            {/* Ambient Optical Light Gradient */}
            <div
              aria-hidden="true"
              className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl pointer-events-none transition-colors duration-700"
              style={{
                background: `radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)`,
              }}
            />

            {/* Authentic Real Portrait with Perspective Movement */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0">
              <PortraitFrame size="about" priority={true} className="w-full h-full" />
            </div>

            {/* Micro Specification Identity alongside Portrait */}
            <div className="flex-1 space-y-1 text-left min-w-0">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse" />
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--secondary)] font-semibold truncate">
                  Architectural Profile
                </span>
                <span className="text-[var(--ink-muted)]/40 text-[9px]">·</span>
                <span className="font-mono text-[9px] text-[var(--accent)] font-medium">Open to Learning ✦</span>
              </div>
              <h2 className="font-display font-bold text-base text-[var(--ink)] leading-tight truncate">
                Lalit Choudhary
              </h2>
              <p className="font-mono text-[10px] text-[var(--primary)] truncate">
                First-Year B.Tech CS &amp; AI · Newton School of Tech
              </p>
              <p className="font-display text-[11px] text-[var(--ink-muted)] leading-snug line-clamp-1">
                Full-stack web systems, Python &amp; quantitative challenges.
              </p>
            </div>
          </motion.div>

          {/* Interactive 3D Computational Sculpture Stage (Part 5) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: shouldReveal ? 1 : 0, y: shouldReveal ? 0 : 16 }}
            transition={{ duration: 0.7, delay: prefersReduced ? 0 : 0.32, ease: [0.76, 0, 0.24, 1] }}
            className="w-full"
          >
            <Hero3DStage />
          </motion.div>
        </div>
      </div>

      {/* Bottom Row: Animated Scroll Indicator & Colophon */}
      <div className="w-full flex items-center justify-between pt-4 border-t border-[var(--line)]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: shouldReveal ? 1 : 0 }}
          transition={{ duration: 0.6, delay: prefersReduced ? 0 : 0.45 }}
        >
          <a
            href="#projects"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
              window.history.pushState(null, '', '#projects');
            }}
            data-cursor="link"
            aria-label="Scroll to work and projects"
            className="group min-h-[44px] inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--ink-muted)] hover:text-[var(--primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] py-2 cursor-pointer"
          >
            <span>Scroll To Explore</span>
            <div
              className="w-[1px] h-6 bg-[var(--line)] overflow-hidden relative"
              aria-hidden="true"
            >
              <div className="w-full h-full bg-[var(--primary)] animate-scroll-line" />
            </div>
            <span className="text-[10px] text-[var(--ink-muted)]/60">[Index 01 — 05]</span>
          </a>
        </motion.div>

        <div className="hidden sm:block font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--ink-muted)]">
          Lalit Choudhary · Portfolio 2026
        </div>
      </div>
    </section>
  );
};

export const HeroSection = Hero;
