/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { skills } from '../data/skills';
import { Heading, SerifAccent } from './Typography';
import { SectionLabelCounter } from './Reveal';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

export const Skills: React.FC = () => {
  const prefersReduced = usePrefersReducedMotion();

  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="relative w-full py-[12vh] px-6 sm:px-10 max-w-7xl mx-auto border-t border-[var(--line)] select-none"
    >
      <div className="mb-12 sm:mb-16">
        <SectionLabelCounter label="03 / FOCUS" className="mb-4" />
        <Heading id="skills-heading">
          Core <SerifAccent>Disciplines</SerifAccent>
        </Heading>
      </div>

      {/* Two-column list of verified skills with hairline separators */}
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-16 border-t border-[var(--line)]">
        {skills.map((skill, index) => (
          <motion.div
            key={skill.id}
            initial={{ opacity: 0, y: prefersReduced ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{
              duration: prefersReduced ? 0.2 : 0.7,
              ease: [0.76, 0, 0.24, 1],
              delay: prefersReduced ? 0 : index * 0.06,
            }}
            data-cursor="link"
            className="group py-6 sm:py-8 border-b border-[var(--line)] flex items-baseline justify-between cursor-default transition-colors duration-200"
          >
            <span className="font-display text-[clamp(1.75rem,3.8vw,2.85rem)] font-bold tracking-tight text-[var(--ink)] group-hover:text-[var(--oxblood)] transition-colors duration-200">
              {skill.name}
            </span>
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--ink-muted)] group-hover:text-[var(--oxblood)] transition-colors duration-200 ml-4 shrink-0">
              0{index + 1}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export const SkillsSection = Skills;
