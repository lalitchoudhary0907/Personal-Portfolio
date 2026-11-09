/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Heading, SerifAccent, Kicker } from './Typography';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface SkillCategory {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  technologies: string[];
  metrics?: string;
}

const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'core-languages',
    number: '01',
    title: 'Languages & Core Systems',
    subtitle: 'High-Level & Systems Programming',
    description:
      'Writing performant, maintainable code with strong typing, disciplined memory awareness, and algorithmic efficiency.',
    technologies: ['Python', 'TypeScript', 'JavaScript', 'C++', 'Data Structures & Algorithms'],
    metrics: 'Primary Workflows',
  },
  {
    id: 'ai-quant',
    number: '02',
    title: 'Artificial Intelligence & Quantitative Research',
    subtitle: 'Applied Intelligence & Mathematical Alpha',
    description:
      'Designing applied ML pipelines and financial alpha discovery models. WorldQuant Challenge® Gold Level researcher.',
    technologies: ['PyTorch', 'Applied Machine Learning', 'Mathematical Modeling', 'Alpha Signal Formulation', 'FastAPI'],
    metrics: 'WorldQuant Gold Milestone',
  },
  {
    id: 'web-engineering',
    number: '03',
    title: 'Full-Stack & Web Architecture',
    subtitle: 'Modern Responsive Applications',
    description:
      'Architecting resilient web applications with fast load performance, accessible DOM semantics, and responsive design systems.',
    technologies: ['React', 'Node.js', 'Express', 'Tailwind CSS', 'RESTful APIs', 'Client Persistence'],
    metrics: 'Production Deployed (FocusFlow)',
  },
  {
    id: 'tooling-collaboration',
    number: '04',
    title: 'Engineering Tooling & Open Source',
    subtitle: 'Version Control & Community Ecosystems',
    description:
      'Disciplined version control and team development practices. Active contributor to Hacktoberfest community sprints.',
    technologies: ['Git & GitHub', 'Open-Source Tooling', 'Linux Systems', 'CI/CD Concepts', 'Peer Code Review'],
    metrics: 'Hacktoberfest Attendee',
  },
];

export const Skills: React.FC = () => {
  const prefersReduced = usePrefersReducedMotion();

  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="relative w-full py-[12vh] px-6 sm:px-10 max-w-7xl mx-auto border-t border-[var(--line)] select-none"
    >
      {/* Section Header */}
      <div className="mb-12 sm:mb-16">
        <Kicker index="03" title="FOCUS" meta="TECHNICAL COMPETENCIES" className="mb-4" />
        <Heading id="skills-heading">
          Disciplines &amp; <SerifAccent>Technical Competencies</SerifAccent>
        </Heading>
      </div>

      {/* Asymmetrical 4-Quadrant Editorial Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {SKILL_CATEGORIES.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: prefersReduced ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-8%' }}
            transition={{
              duration: prefersReduced ? 0.2 : 0.75,
              ease: [0.76, 0, 0.24, 1],
              delay: prefersReduced ? 0 : index * 0.08,
            }}
            className="group relative p-7 sm:p-9 rounded-2xl border border-[var(--border-bright)] bg-[var(--paper-deep)]/75 hover:bg-[var(--paper-deep)] transition-all duration-300 flex flex-col justify-between"
          >
            {/* Top Row: Index & Category Title */}
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[var(--line)] mb-4">
                <span className="font-mono text-sm font-semibold text-[var(--primary)]">
                  {category.number}
                </span>
                {category.metrics && (
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--secondary)]">
                    {category.metrics}
                  </span>
                )}
              </div>

              <h3 className="font-display text-xl sm:text-2xl font-bold text-[var(--ink)] tracking-tight leading-snug group-hover:text-[var(--primary)] transition-colors">
                {category.title}
              </h3>

              <p className="font-mono text-xs text-[var(--secondary)] uppercase tracking-wider mt-1 mb-3">
                {category.subtitle}
              </p>

              <p className="font-display text-sm sm:text-base text-[var(--ink-muted)] leading-relaxed">
                {category.description}
              </p>
            </div>

            {/* Bottom Row: Clean Typographic Separated Tags (No Pill Slop) */}
            <div className="pt-6 mt-6 border-t border-[var(--line)]">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--ink-muted)] block mb-2">
                Core Stack
              </span>
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-mono text-[var(--ink)]">
                {category.technologies.map((tech, techIdx) => (
                  <React.Fragment key={tech}>
                    <span className="hover:text-[var(--primary)] transition-colors">
                      {tech}
                    </span>
                    {techIdx < category.technologies.length - 1 && (
                      <span className="text-[var(--ink-muted)]/40 select-none" aria-hidden="true">
                        ·
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export const SkillsSection = Skills;
