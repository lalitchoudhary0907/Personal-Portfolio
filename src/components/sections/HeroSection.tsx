/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  ArrowRight,
  Mail,
  Github,
  Linkedin,
  ChevronDown,
  Sparkles,
  Terminal,
  Code2,
  CheckCircle2,
} from 'lucide-react';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { TechTag } from '../ui/Tag';
import { siteConfig } from '../../config/site';
import { portfolioData } from '../../data/portfolio';

const ROTATING_PHRASES = [
  'Software Engineering',
  'AI & Applied ML',
  'Developer Tooling',
  'Open-Source Systems',
];

export const HeroSection: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const [phraseIndex, setPhraseIndex] = useState(0);

  // Restrained text reveal / cycling animation
  useEffect(() => {
    if (prefersReducedMotion) return;
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % ROTATING_PHRASES.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  const handleScrollToProjects = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('projects');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollBy({ top: 500, behavior: 'smooth' });
    }
  };

  const handleScrollDown = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollBy({ top: 600, behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      aria-label="Hero overview"
      className="relative min-h-[calc(100vh-5rem)] flex flex-col justify-center items-center py-10 sm:py-16 overflow-hidden"
    >
      <Container size="lg" className="relative z-10 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Typographic Presence & Core Actions */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            {/* Status kicker: Clean unboxed metadata (anti-slop compliant) */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400 select-none">
              <span className="text-cyan-600 dark:text-cyan-400 font-semibold flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse motion-reduce:animate-none" />
                <span>Available for Summer Internships</span>
              </span>
              <span aria-hidden="true" className="text-slate-400 dark:text-slate-600">
                &middot;
              </span>
              <span>Sonipat, India</span>
            </div>

            {/* Main Name & Headline with Developer Presence */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] text-balance">
                Hi, I&apos;m{' '}
                <span className="text-gradient-cyan-blue font-black inline-block">
                  {portfolioData.personalInfo.fullName}
                </span>
              </h1>

              {/* Exact Requested Headline */}
              <p className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-200 tracking-tight">
                Aspiring Software Engineer{' '}
                <span className="text-cyan-600 dark:text-cyan-400 font-normal">|</span>{' '}
                Computer Science &amp; AI Student
              </p>
            </div>

            {/* University & Degree Information */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
              <span>{portfolioData.education[0].institution}</span>
              <span aria-hidden="true" className="text-slate-400 dark:text-slate-600">
                &middot;
              </span>
              <span>{portfolioData.education[0].university}</span>
            </div>

            {/* Restrained dynamic typing / text-reveal display */}
            <div className="flex items-center gap-2 text-xs sm:text-sm font-mono text-slate-700 dark:text-slate-300 py-1 bg-slate-100/70 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.06] rounded-xl px-3.5 w-fit">
              <Code2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
              <span className="text-slate-500 dark:text-slate-400">focus:</span>
              <span className="text-cyan-600 dark:text-cyan-300 font-semibold min-w-[160px]">
                {ROTATING_PHRASES[phraseIndex]}
              </span>
            </div>

            {/* Professional Summary */}
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
              Undergraduate technologist exploring high-throughput software systems and developer tooling. Recognized as a{' '}
              <strong className="font-semibold text-slate-900 dark:text-white">
                WorldQuant Challenge Gold Level
              </strong>{' '}
              achiever with active projects in automated documentation analysis and emergency safety apps.
            </p>

            {/* Call to Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a href="#projects" onClick={handleScrollToProjects}>
                <Button
                  variant="primary"
                  size="md"
                  glow={true}
                  icon={<ArrowRight className="w-4 h-4" />}
                  iconPosition="right"
                >
                  View Projects
                </Button>
              </a>

              <a href="#contact">
                <Button
                  variant="outline"
                  size="md"
                  icon={<Mail className="w-4 h-4" />}
                  iconPosition="left"
                >
                  Contact Me
                </Button>
              </a>

              {/* GitHub and LinkedIn Icon Links */}
              <div className="flex items-center gap-2 pl-2">
                <a
                  href={portfolioData.personalInfo.socials.github.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Lalit Choudhary GitHub Profile"
                  className="p-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-cyan-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] border border-slate-200 dark:border-white/[0.08] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 motion-reduce:transform-none"
                >
                  <Github className="w-4 h-4" />
                </a>

                <a
                  href={portfolioData.personalInfo.socials.linkedin.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Lalit Choudhary LinkedIn Profile"
                  className="p-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-cyan-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] border border-slate-200 dark:border-white/[0.08] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 motion-reduce:transform-none"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Floating Interactive Developer Element */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
          >
            {/* Ambient Background Glow Behind Card */}
            <div
              aria-hidden="true"
              className="absolute -inset-2 bg-gradient-to-r from-cyan-500/20 via-blue-500/15 to-violet-500/20 rounded-3xl blur-2xl opacity-60 dark:opacity-70 pointer-events-none"
            />

            {/* Floating Developer Terminal / Spec Card */}
            <motion.div
              animate={prefersReducedMotion ? {} : { y: [-4, 5, -4] }}
              whileHover={prefersReducedMotion ? {} : { scale: 1.015, y: -2, transition: { duration: 0.25 } }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="relative rounded-2xl border border-slate-200/90 dark:border-white/[0.12] bg-white/90 dark:bg-[#0c1424]/90 backdrop-blur-2xl shadow-2xl p-5 sm:p-6 space-y-4 transition-shadow hover:shadow-cyan-500/10"
            >
              {/* Terminal Window Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400 ml-2">
                    developer.config.ts
                  </span>
                </div>
                <TechTag variant="cyan">verified</TechTag>
              </div>

              {/* Code Snippet representing verified facts */}
              <div className="font-mono text-xs sm:text-[13px] leading-relaxed space-y-1 text-slate-700 dark:text-slate-300 select-text overflow-x-auto">
                <div>
                  <span className="text-violet-600 dark:text-violet-400">const</span>{' '}
                  <span className="text-blue-600 dark:text-blue-300 font-semibold">candidate</span> = &#123;
                </div>
                <div className="pl-4">
                  <span className="text-slate-500 dark:text-slate-400">name:</span>{' '}
                  <span className="text-emerald-600 dark:text-emerald-400">&apos;Lalit Choudhary&apos;</span>,
                </div>
                <div className="pl-4">
                  <span className="text-slate-500 dark:text-slate-400">degree:</span>{' '}
                  <span className="text-emerald-600 dark:text-emerald-400">&apos;BTech in CS &amp; AI&apos;</span>,
                </div>
                <div className="pl-4">
                  <span className="text-slate-500 dark:text-slate-400">institution:</span>{' '}
                  <span className="text-emerald-600 dark:text-emerald-400">&apos;Newton School of Tech&apos;</span>,
                </div>
                <div className="pl-4">
                  <span className="text-slate-500 dark:text-slate-400">university:</span>{' '}
                  <span className="text-emerald-600 dark:text-emerald-400">&apos;Rishihood University&apos;</span>,
                </div>
                <div className="pl-4">
                  <span className="text-slate-500 dark:text-slate-400">keyProjects:</span> [
                  <span className="text-cyan-600 dark:text-cyan-300">&apos;DocDrift&apos;</span>,{' '}
                  <span className="text-cyan-600 dark:text-cyan-300">&apos;CoreAlert&apos;</span>,{' '}
                  <span className="text-cyan-600 dark:text-cyan-300">&apos;StitchAI&apos;</span>],
                </div>
                <div className="pl-4">
                  <span className="text-slate-500 dark:text-slate-400">achievement:</span>{' '}
                  <span className="text-amber-600 dark:text-amber-400">&apos;WorldQuant Challenge Gold&apos;</span>,
                </div>
                <div>&#125;;</div>
              </div>

              {/* Verified Trust Markers */}
              <div className="pt-3 border-t border-slate-200/80 dark:border-white/[0.08] flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Real Profile Data Verified</span>
                </div>
                <span className="font-mono text-[11px]">Next.js · TS · Tailwind</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </Container>

      {/* Floating Scroll Indicator */}
      <motion.div
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-8 sm:mt-12 flex flex-col items-center justify-center select-none"
      >
        <a
          href="#about"
          onClick={handleScrollDown}
          aria-label="Scroll to explore more"
          className="group flex flex-col items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg p-1 cursor-pointer"
        >
          <span className="tracking-wider uppercase font-mono text-[10px]">
            Scroll to explore
          </span>
          <motion.div
            animate={prefersReducedMotion ? {} : { y: [0, 4, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="w-4 h-4 text-cyan-600 dark:text-cyan-400 group-hover:translate-y-0.5 transition-transform" />
          </motion.div>
        </a>
      </motion.div>
    </section>
  );
};
