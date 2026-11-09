/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { portfolioData } from '../data/portfolio';
import { Heading, SerifAccent, Kicker } from './Typography';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

export const Projects: React.FC = () => {
  const prefersReduced = usePrefersReducedMotion();
  const { projects } = portfolioData;

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="relative w-full py-[12vh] px-6 sm:px-10 max-w-7xl mx-auto border-t border-[var(--line)] select-none"
    >
      {/* Section Header */}
      <div className="mb-14 sm:mb-20">
        <Kicker index="01" title="WORK" meta="ENGINEERED ARTIFACTS & CONCEPTS" className="mb-4" />
        <Heading id="projects-heading">
          Selected <SerifAccent>Architectures &amp; Works</SerifAccent>
        </Heading>
      </div>

      {/* Editorial Projects Layout */}
      <div className="space-y-16 sm:space-y-24">
        {projects.map((project, index) => {
          const isFocusFlow = project.id === 'proj-focusflow';
          const isConcept = Boolean(project.isConcept);

          return (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: prefersReduced ? 0 : 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{
                duration: prefersReduced ? 0.2 : 0.8,
                ease: [0.76, 0, 0.24, 1],
                delay: prefersReduced ? 0 : index * 0.12,
              }}
              className="group relative p-8 sm:p-12 rounded-3xl border border-[var(--border-bright)] bg-[var(--paper-deep)]/70 hover:bg-[var(--paper-deep)]/90 transition-all duration-300"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
                {/* Left Column (Cols 1-8): Index, Title, Description, Engineering Highlights */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Top Meta Line: Editorial Number & Status */}
                  <div className="flex items-center justify-between pb-4 border-b border-[var(--line)]">
                    <span className="font-mono text-xs uppercase tracking-widest text-[var(--secondary)] font-semibold flex items-center gap-2">
                      <span className="text-[var(--primary)] font-bold text-sm">0{index + 1}</span>
                      <span className="w-4 h-[1px] bg-[var(--line)]" />
                      <span>{project.category}</span>
                    </span>

                    <span
                      className={`font-mono text-[11px] uppercase tracking-wider font-medium ${
                        isConcept ? 'text-[var(--secondary)]' : 'text-[var(--accent)]'
                      }`}
                    >
                      {project.statusBadge}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <div>
                    <h3 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[var(--ink)] group-hover:text-[var(--primary)] transition-colors leading-[1.05]">
                      {project.title}
                    </h3>
                    <p className="font-mono text-xs sm:text-sm text-[var(--secondary)] mt-2">
                      {project.tagline}
                    </p>
                  </div>

                  {/* Narrative Description */}
                  <p className="font-display text-base sm:text-lg text-[var(--ink)]/85 leading-relaxed max-w-2xl">
                    {project.description}
                  </p>

                  {/* Key Highlights */}
                  {project.highlights && project.highlights.length > 0 && (
                    <div className="pt-2 space-y-2">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--ink-muted)] block">
                        Architectural Highlights
                      </span>
                      <ul className="space-y-1.5 font-display text-sm text-[var(--ink-muted)]">
                        {project.highlights.map((highlight, hIdx) => (
                          <li key={hIdx} className="flex items-start gap-2.5">
                            <span className="text-[var(--primary)] font-bold text-xs mt-0.5 select-none">✦</span>
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Clean Typographic Tech Stack (No Pill Slop) */}
                  <div className="pt-4 border-t border-[var(--line)]">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--ink-muted)] block mb-1.5">
                      Technologies &amp; Architecture
                    </span>
                    <div className="flex flex-wrap items-center gap-x-2 text-xs font-mono text-[var(--secondary)]">
                      {project.tags.map((tag, tIdx) => (
                        <React.Fragment key={tag}>
                          <span className="text-[var(--ink)]">{tag}</span>
                          {tIdx < project.tags.length - 1 && (
                            <span className="text-[var(--ink-muted)]/40" aria-hidden="true">
                              ·
                            </span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column (Cols 9-12): Live Links, Role, Artifact Coordinates */}
                <div className="lg:col-span-4 flex flex-col justify-between h-full pt-2 lg:pt-0 lg:border-l lg:border-[var(--line)] lg:pl-8 space-y-6">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--ink-muted)] block mb-1">
                      Role
                    </span>
                    <p className="font-mono text-xs font-medium text-[var(--ink)]">
                      {project.role}
                    </p>
                  </div>

                  {/* Action Links */}
                  <div className="space-y-3 pt-2">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor="link"
                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-[var(--primary)] text-[var(--paper)] font-mono text-xs uppercase tracking-wider font-semibold transition-all hover:opacity-90 active:scale-95 shadow-[0_0_20px_var(--primary-glow)]"
                      >
                        <span>Launch Live App</span>
                        <span aria-hidden="true">↗</span>
                      </a>
                    )}

                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor="link"
                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-[var(--border-bright)] hover:border-[var(--primary)] bg-[var(--paper)] text-[var(--ink)] font-mono text-xs uppercase tracking-wider transition-all"
                      >
                        <span>Source Code</span>
                        <span aria-hidden="true">↗</span>
                      </a>
                    )}

                    {isConcept && (
                      <div className="p-3.5 rounded-xl border border-[var(--border-accent)] bg-[var(--accent)]/5 font-mono text-xs text-[var(--accent)]">
                        <span className="block font-semibold mb-0.5">Architectural Specification</span>
                        <span className="text-[11px] text-[var(--ink-muted)]">
                          Active prototype design and marketplace model under development.
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-[var(--line)] text-[10px] font-mono text-[var(--ink-muted)]">
                    <span>Verified Project Asset · Lalit Choudhary</span>
                  </div>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
};

export const ProjectsSection = Projects;
