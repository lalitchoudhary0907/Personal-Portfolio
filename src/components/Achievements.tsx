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

      {/* Organization Header */}
      <div className="mb-8">
        <span className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--oxblood)] font-bold">
          WorldQuant BRAIN
        </span>
      </div>

      {/* Ladder of three rows: Bronze, Silver, Gold */}
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
            className="py-8 sm:py-10 border-b border-[var(--line)] flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            {/* Left: Step index & Tier label */}
            <div className="flex items-baseline gap-4 sm:gap-8">
              <span className="font-mono text-xs uppercase tracking-widest text-[var(--ink-muted)] shrink-0 w-8">
                0{index + 1}
              </span>
              <div>
                <span className="font-display text-[clamp(1.75rem,4vw,2.75rem)] font-bold tracking-tight text-[var(--ink)]">
                  {item.tier} Milestone
                </span>
                <span className="block font-mono text-[11px] uppercase tracking-wider text-[var(--ink-muted)] mt-1">
                  WorldQuant BRAIN
                </span>
              </div>
            </div>

            {/* Right: Certificate Slot & Empty Year Field */}
            <div className="flex items-center gap-6 pl-12 md:pl-0">
              {/* Year field (empty slot, rendered without placeholder prose) */}
              {item.year ? (
                <span className="font-mono text-xs uppercase tracking-widest text-[var(--ink-muted)]">
                  {item.year}
                </span>
              ) : (
                <span className="font-mono text-xs text-[var(--ink-muted)]" aria-hidden="true" />
              )}

              {/* Certificate image or paper-deep placeholder slot */}
              {item.image ? (
                <Reveal variant="image">
                  <img
                    src={item.image}
                    alt={`${item.tier} Milestone Certificate`}
                    width={192}
                    height={112}
                    loading="lazy"
                    decoding="async"
                    className="w-40 sm:w-48 h-24 sm:h-28 object-cover border border-[var(--line)] bg-[var(--paper-deep)]"
                  />
                </Reveal>
              ) : (
                <div
                  aria-label={`${item.tier} Milestone: Certificate to be added`}
                  className="w-40 sm:w-48 h-24 sm:h-28 bg-[var(--paper-deep)] border border-[var(--line)] flex flex-col items-center justify-center p-3 text-center"
                >
                  <span className="font-display font-black text-xl text-[var(--oxblood)]/25 uppercase tracking-wider">
                    {item.tier}
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--ink-muted)] mt-1">
                    Certificate to be added
                  </span>
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
