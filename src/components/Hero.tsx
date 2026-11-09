/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { Kicker } from './Typography';

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
      currentWght: 600,
      currentWdth: 100,
      targetWght: 600,
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

  const revealTransition = (staggerIndex: number) => ({
    duration: 0.85,
    ease: [0.76, 0, 0.24, 1] as const,
    delay: prefersReduced ? 0 : staggerIndex * 0.08,
  });

  return (
    <section
      id="top"
      ref={heroRef}
      aria-label="Introduction"
      className="relative min-h-[100svh] min-h-[100dvh] flex flex-col justify-between pt-[max(6rem,calc(5rem+env(safe-area-inset-top)))] pb-[max(2rem,calc(1.75rem+env(safe-area-inset-bottom)))] px-6 sm:px-10 max-w-7xl mx-auto w-full select-none"
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
        <div className="lg:col-span-7 flex flex-col justify-center">
          {/* Subtle Discipline Kicker */}
          <div className="overflow-hidden mb-3 sm:mb-4">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: shouldReveal ? 1 : 0, y: shouldReveal ? 0 : 12 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.16em] text-[var(--secondary)]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
              <span>Computer Science &amp; Artificial Intelligence</span>
              <span className="text-[var(--ink-muted)]/40 hidden sm:inline">·</span>
              <span className="text-[var(--ink-muted)] hidden sm:inline">Newton School of Technology</span>
            </motion.div>
          </div>

          {/* Line 1: "LALIT" with swash serif "A" */}
          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: prefersReduced ? 0 : '108%' }}
              animate={{ y: shouldReveal ? 0 : '108%' }}
              transition={revealTransition(0)}
              className="font-display font-bold tracking-[-0.04em] leading-[0.88] text-[var(--ink)] text-[clamp(3.8rem,13vw,9.5rem)] flex items-baseline whitespace-nowrap overflow-hidden select-none"
            >
              <span data-var-letter="true" className="inline-block transition-[font-variation-settings]">
                L
              </span>
              <span
                className="font-serif italic font-normal text-[var(--primary)] inline-block px-1 -mx-0.5 transition-colors duration-500"
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

          {/* Line 2: "CHOUDHARY" with variable font tracking */}
          <div className="overflow-hidden -mt-1 sm:-mt-2">
            <motion.div
              initial={{ y: prefersReduced ? 0 : '108%' }}
              animate={{ y: shouldReveal ? 0 : '108%' }}
              transition={revealTransition(1)}
              aria-hidden="true"
              className="font-display font-bold tracking-[-0.04em] leading-[0.88] text-[var(--ink)] text-[clamp(2.4rem,8.6vw,6.4rem)] flex items-baseline whitespace-nowrap overflow-hidden select-none"
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

          {/* Refined Supporting Statement (Accurate, Non-Slogan, Concise) */}
          <div className="mt-5 sm:mt-6 overflow-hidden max-w-xl">
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: shouldReveal ? 1 : 0, y: shouldReveal ? 0 : 15 }}
              transition={revealTransition(2)}
              className="font-display text-[clamp(1.1rem,1.9vw,1.45rem)] text-[var(--ink)] font-normal leading-[1.45]"
            >
              Undergraduate at Newton School of Technology (Rishihood University). Engineering deliberate software systems, algorithmic models, and open-source tooling with architectural clarity.
            </motion.p>
          </div>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: shouldReveal ? 1 : 0, y: shouldReveal ? 0 : 15 }}
            transition={{ duration: 0.5, delay: 0.28 }}
            className="mt-7 flex flex-wrap items-center gap-3.5"
          >
            <a
              href="#projects"
              data-cursor="link"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--primary)] text-[var(--paper)] font-mono text-xs uppercase tracking-wider font-semibold transition-all hover:opacity-90 active:scale-95 shadow-[0_0_24px_var(--primary-glow)]"
            >
              <span>Explore Selected Works</span>
              <span aria-hidden="true">↓</span>
            </a>

            <a
              href="#contact"
              data-cursor="link"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--paper-deep)] hover:bg-[var(--paper-card)] border border-[var(--border-bright)] hover:border-[var(--primary)] text-[var(--ink)] font-mono text-xs uppercase tracking-wider transition-all"
            >
              <span>Initiate Dialogue</span>
              <span aria-hidden="true">↗</span>
            </a>

            <a
              href="#achievements"
              data-cursor="link"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-[var(--secondary)] hover:text-[var(--accent)] font-mono text-xs transition-colors"
            >
              <span className="text-[var(--accent)]" aria-hidden="true">✦</span>
              <span>WorldQuant Challenge Gold</span>
            </a>
          </motion.div>
        </div>

        {/* Right Column (Cols 8-12): Architectural Specification Dossier & WebGL Stage Reserve */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: shouldReveal ? 1 : 0, scale: shouldReveal ? 1 : 0.96 }}
            transition={{ duration: 0.75, delay: 0.2 }}
            className="relative p-6 sm:p-7 rounded-2xl border border-[var(--border-bright)] bg-[var(--paper-deep)]/85 backdrop-blur-xl shadow-xl overflow-hidden group"
          >
            {/* Ambient Optical Light Gradient within dossier */}
            <div
              aria-hidden="true"
              className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl pointer-events-none transition-colors duration-700"
              style={{
                background: `radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)`,
              }}
            />

            {/* Dossier Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[var(--line)] mb-5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--secondary)] font-semibold">
                  Architectural Profile
                </span>
              </div>
              <span className="font-mono text-[10px] text-[var(--ink-muted)]">
                BTech CSAI · NST
              </span>
            </div>

            {/* Core Disciplines Breakdown */}
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--ink-muted)] block mb-1">
                  01 · Technical Focus
                </span>
                <p className="font-display text-sm text-[var(--ink)] leading-snug">
                  Applied Artificial Intelligence, Software Engineering &amp; High-Performance Web Applications.
                </p>
                <div className="flex flex-wrap items-center gap-x-2 text-[11px] font-mono text-[var(--secondary)] pt-1.5">
                  <span>Python</span>
                  <span className="text-[var(--ink-muted)]/40">·</span>
                  <span>TypeScript</span>
                  <span className="text-[var(--ink-muted)]/40">·</span>
                  <span>PyTorch</span>
                  <span className="text-[var(--ink-muted)]/40">·</span>
                  <span>FastAPI</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--line)]">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--ink-muted)] block mb-1">
                  02 · Quantitative Research
                </span>
                <p className="font-display text-sm text-[var(--ink)] leading-snug">
                  WorldQuant Challenge® Gold Level researcher developing disciplined mathematical alpha signals.
                </p>
              </div>

              <div className="pt-3 border-t border-[var(--line)]">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--ink-muted)] block mb-1">
                  03 · Active Engineering
                </span>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[var(--ink)] font-medium">FocusFlow</span>
                  <span className="text-[var(--accent)] text-[10px]">Live Production ↗</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono pt-1">
                  <span className="text-[var(--ink)] font-medium">VastraGo</span>
                  <span className="text-[var(--secondary)] text-[10px]">AI Concept · In Progress</span>
                </div>
              </div>
            </div>

            {/* Stage Footer / Spatial Placeholder Notice */}
            <div className="mt-5 pt-3 border-t border-[var(--line)] flex items-center justify-between text-[10px] font-mono text-[var(--ink-muted)]">
              <span>Sonipat / Delhi NCR</span>
              <span className="text-[var(--primary)] font-medium">System Ready</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Row: Micro-loop Scroll Indicator & Colophon */}
      <div className="w-full flex items-center justify-between pt-4 border-t border-[var(--line)]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: shouldReveal ? 1 : 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
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
