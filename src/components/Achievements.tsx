/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { achievements } from '../data/achievements';
import { Heading, SerifAccent } from './Typography';
import { Reveal, SectionLabelCounter } from './Reveal';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

export const Achievements: React.FC = () => {
  const prefersReduced = usePrefersReducedMotion();

  return (
    <section
      id="achievements"
      aria-labelledby="achievements-heading"
      className="relative w-full py-[12vh] px-6 sm:px-10 max-w-7xl mx-auto border-t border-[var(--line)] select-none"
    >
      <div className="mb-12 sm:mb-16">
        <SectionLabelCounter label="04 / RECOGNITION" className="mb-4" />
        <Heading id="achievements-heading">
          Milestones &amp; <SerifAccent>Honors</SerifAccent>
        </Heading>
      </div>

      {/* Verified Achievement Records */}
      <div className="border-t border-[var(--line)]">
        {achievements.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: prefersReduced ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{
              duration: prefersReduced ? 0.2 : 0.7,
              ease: [0.76, 0, 0.24, 1],
              delay: prefersReduced ? 0 : index * 0.08,
            }}
            className="py-10 sm:py-14 border-b border-[var(--line)] flex flex-col lg:flex-row lg:items-center justify-between gap-8"
          >
            {/* Left: Step Index, Title, Issuer, Summary */}
            <div className="flex items-start gap-4 sm:gap-8 max-w-2xl">
              <span className="font-mono text-xs uppercase tracking-widest text-[var(--ink-muted)] shrink-0 w-8 pt-2">
                0{index + 1}
              </span>
              <div className="space-y-2">
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--primary)] font-bold block">
                  {item.issuer}
                </span>

                <h3 className="font-display text-[clamp(1.75rem,3.8vw,2.75rem)] font-bold tracking-tight text-[var(--ink)] leading-[1.05]">
                  {item.title}
                </h3>

                <p className="font-mono text-xs text-[var(--ink-muted)] uppercase tracking-wider">
                  {item.subtitle}
                </p>

                <p className="text-sm text-[var(--ink)]/80 leading-relaxed pt-1">
                  {item.summary}
                </p>

                {item.authority && (
                  <p className="font-mono text-[11px] text-[var(--ink-muted)] pt-1">
                    Presented by: {item.authority}
                  </p>
                )}

                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-2 font-mono text-[11px] text-[var(--ink-muted)]">
                    {item.tags.map((tag, tagIdx) => (
                      <React.Fragment key={tag}>
                        {tagIdx > 0 && <span aria-hidden="true" className="opacity-40">·</span>}
                        <span className="uppercase tracking-wider">
                          {tag}
                        </span>
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Date & Certificate Media Card */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-4 pl-12 lg:pl-0 shrink-0">
              <span className="font-mono text-xs uppercase tracking-widest text-[var(--ink-muted)]">
                {item.date}
              </span>

              {/* Certificate Image Slot with link to full PDF */}
              {item.image && (
                <div className="group relative">
                  <Reveal variant="image">
                    <img
                      src={item.image}
                      alt={`${item.title} Certificate for Lalit Choudhary`}
                      width={280}
                      height={160}
                      loading="lazy"
                      decoding="async"
                      className="w-56 sm:w-64 h-32 sm:h-36 object-cover border border-white/10 group-hover:border-[var(--primary)]/60 bg-[var(--paper-deep)] transition-colors shadow-[0_0_20px_rgba(0,0,0,0.6)]"
                    />
                  </Reveal>

                  {item.pdfUrl && (
                    <a
                      href={item.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="link"
                      aria-label={`Open official ${item.title} certificate PDF in new tab`}
                      className="mt-2.5 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-[var(--primary)] hover:underline outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                    >
                      <span>View Full Certificate</span>
                      <span aria-hidden="true">↗</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export const AchievementsSection = Achievements;
