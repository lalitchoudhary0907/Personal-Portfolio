/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { portfolioData } from '../data/portfolio';
import { Heading, SerifAccent, Kicker } from './Typography';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { PortraitFrame } from './PortraitFrame';

export const About: React.FC = () => {
  const prefersReduced = usePrefersReducedMotion();
  const { personalInfo, education } = portfolioData;
  const currentEdu = education[0];

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative w-full py-[12vh] px-6 sm:px-10 max-w-7xl mx-auto border-t border-[var(--line)] select-none"
    >
      {/* Section Header */}
      <div className="mb-12 sm:mb-16">
        <Kicker index="02" title="ABOUT" meta="BACKGROUND & DISCIPLINE" className="mb-4" />
        <Heading id="about-heading">
          Engineering With <SerifAccent>Deliberate Intent</SerifAccent>
        </Heading>
      </div>

      {/* 12-Column Asymmetrical Editorial Spread */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        {/* Left Column (Cols 1-7): Editorial Lead & Philosophy */}
        <div className="lg:col-span-7 space-y-8">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: prefersReduced ? 0.2 : 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="font-display text-[clamp(1.2rem,2.1vw,1.65rem)] text-[var(--ink)] font-normal leading-[1.55]"
          >
            First-year BTech student in Computer Science &amp; Artificial Intelligence at Newton School of Technology (Rishihood University). Focused on software engineering fundamentals, practical web applications, and quantitative problem-solving.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: prefersReduced ? 0.2 : 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
            className="space-y-6 pt-4 border-t border-[var(--line)]"
          >
            <div className="space-y-1.5">
              <span className="font-mono text-xs uppercase tracking-wider text-[var(--secondary)] font-semibold flex items-center gap-2">
                <span>01</span>
                <span className="w-3 h-[1px] bg-[var(--line)]" />
                <span>Algorithmic Rigor</span>
              </span>
              <p className="font-display text-sm sm:text-base text-[var(--ink-muted)] leading-relaxed">
                Applying quantitative discipline to real-world code. Reached Gold Level in the global WorldQuant Challenge® through structured alpha signal creation and mathematical formulation.
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="font-mono text-xs uppercase tracking-wider text-[var(--secondary)] font-semibold flex items-center gap-2">
                <span>02</span>
                <span className="w-3 h-[1px] bg-[var(--line)]" />
                <span>System Architecture</span>
              </span>
              <p className="font-display text-sm sm:text-base text-[var(--ink-muted)] leading-relaxed">
                Building reliable web applications and micro-services. Creator of FocusFlow—a focused Pomodoro productivity engine with customizable cycles, client persistence, and clean interaction states.
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="font-mono text-xs uppercase tracking-wider text-[var(--secondary)] font-semibold flex items-center gap-2">
                <span>03</span>
                <span className="w-3 h-[1px] bg-[var(--line)]" />
                <span>Open-Source Engagement</span>
              </span>
              <p className="font-display text-sm sm:text-base text-[var(--ink-muted)] leading-relaxed">
                Active in open-source developer communities. Participated in Hacktoberfest Hack Day Sonipat, collaborating with peers on codebase maintenance, git workflows, and developer tools.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right Column (Cols 8-12): Academic & Location Dossier Card with Portrait Presentation */}
        <div className="lg:col-span-5 space-y-6">
          {/* Authentic Portrait Card Presentation in About */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: prefersReduced ? 0.2 : 0.75, ease: [0.76, 0, 0.24, 1] }}
            className="flex items-center gap-5 p-5 rounded-2xl border border-[var(--border-bright)] bg-[var(--paper-deep)]/90 backdrop-blur-xl shadow-xl"
          >
            <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0">
              <PortraitFrame size="about" priority={false} className="w-full h-full" />
            </div>
            <div className="space-y-1">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--secondary)] font-semibold">
                Creator Profile
              </span>
              <h3 className="font-display font-bold text-lg text-[var(--ink)]">
                Lalit Choudhary
              </h3>
              <p className="font-mono text-xs text-[var(--primary)]">
                First-Year B.Tech CS &amp; AI
              </p>
              <p className="font-mono text-[11px] text-[var(--ink-muted)]">
                Newton School of Technology
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: prefersReduced ? 0.2 : 0.75, ease: [0.76, 0, 0.24, 1], delay: 0.15 }}
            className="p-6 sm:p-8 rounded-2xl border border-[var(--border-bright)] bg-[var(--paper-deep)]/80 backdrop-blur-xl shadow-xl space-y-6"
          >
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--secondary)] block mb-1">
                Academic Credential
              </span>
              <h3 className="font-display text-lg sm:text-xl font-bold text-[var(--ink)] leading-snug">
                {currentEdu.degree}
              </h3>
              <p className="font-mono text-xs text-[var(--primary)] mt-1">
                {currentEdu.fieldOfStudy}
              </p>
            </div>

            <div className="pt-4 border-t border-[var(--line)] space-y-3 font-mono text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[var(--ink)]">
                <span className="text-[var(--ink-muted)] uppercase text-[11px]">Institution</span>
                <span className="font-medium">{currentEdu.institution}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[var(--ink)]">
                <span className="text-[var(--ink-muted)] uppercase text-[11px]">University</span>
                <span className="font-medium">{currentEdu.university}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[var(--ink)]">
                <span className="text-[var(--ink-muted)] uppercase text-[11px]">Location</span>
                <span className="font-medium">{currentEdu.location}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[var(--ink)]">
                <span className="text-[var(--ink-muted)] uppercase text-[11px]">Status</span>
                <span className="text-[var(--accent)] font-medium">{currentEdu.status}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--line)]">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--ink-muted)] block mb-2">
                Verified Engagements
              </span>
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className="text-[var(--secondary)]">WorldQuant BRAIN</span>
                <span className="text-[var(--ink-muted)]/40" aria-hidden="true">·</span>
                <span className="text-[var(--secondary)]">Hacktoberfest Sonipat</span>
                <span className="text-[var(--ink-muted)]/40" aria-hidden="true">·</span>
                <span className="text-[var(--secondary)]">Open-Source Tooling</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export const AboutSection = About;
