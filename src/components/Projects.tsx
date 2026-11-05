/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { projects } from '../data/projects';
import { Heading, SerifAccent } from './Typography';
import { SectionLabelCounter } from './Reveal';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

export const Projects: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isDesktopFine, setIsDesktopFine] = useState(false);
  const containerRef = useRef<HTMLElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  // Floating preview coordinates with spring
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);
  const springX = useSpring(mouseX, { stiffness: 260, damping: 28 });
  const springY = useSpring(mouseY, { stiffness: 260, damping: 28 });

  useEffect(() => {
    const media = window.matchMedia('(hover: hover) and (pointer: fine)');
    setIsDesktopFine(media.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsDesktopFine(e.matches);
    };

    media.addEventListener('change', handleMediaChange);
    return () => media.removeEventListener('change', handleMediaChange);
  }, []);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDesktopFine || prefersReduced) return;
    mouseX.set(e.clientX + 24);
    mouseY.set(e.clientY - 60);
  };

  const activeProject = hoveredIndex !== null ? projects[hoveredIndex] : null;

  return (
    <section
      id="projects"
      ref={containerRef}
      aria-labelledby="projects-heading"
      onPointerMove={handlePointerMove}
      className="relative w-full py-[12vh] px-6 sm:px-10 max-w-7xl mx-auto select-none"
    >
      {/* Section Header with drawing rule and fading text */}
      <div className="mb-12 sm:mb-16">
        <SectionLabelCounter label="01 / WORK" className="mb-4" />
        <Heading id="projects-heading">
          Selected <SerifAccent>Works</SerifAccent>
        </Heading>
      </div>

      {/* Floating Preview Slot (Desktop fine pointer only) */}
      {isDesktopFine && !prefersReduced && (
        <motion.div
          aria-hidden="true"
          style={{
            x: springX,
            y: springY,
            opacity: hoveredIndex !== null ? 1 : 0,
            scale: hoveredIndex !== null ? 1 : 0.85,
          }}
          transition={{ duration: 0.2 }}
          className="pointer-events-none fixed top-0 left-0 z-30 w-52 h-36 bg-[var(--paper-deep)] border border-[var(--line)] flex flex-col items-center justify-center overflow-hidden"
        >
          {activeProject && (
            <div className="flex flex-col items-center justify-center p-4 text-center">
              <span className="font-display font-extrabold text-5xl text-[var(--oxblood)]/40 tracking-tighter">
                {activeProject.name.charAt(0)}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--ink-muted)] mt-2">
                Preview Slot
              </span>
            </div>
          )}
        </motion.div>
      )}

      {/* Project Rows */}
      <div className="w-full border-b border-[var(--line)]">
        {projects.map((project, index) => {
          const projectUrl = project.links.live || project.links.github;
          const isDimmed = hoveredIndex !== null && hoveredIndex !== index;

          const rowContent = (
            <div
              className={`relative py-8 sm:py-12 transition-opacity duration-200 ${
                isDimmed ? 'opacity-35' : 'opacity-100'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 md:gap-8">
                {/* Left: Index & Name with Drawing Underline on Hover */}
                <div className="flex items-baseline gap-4 sm:gap-8">
                  <span className="font-mono text-xs uppercase tracking-widest text-[var(--ink-muted)] shrink-0 w-8">
                    0{index + 1}
                  </span>
                  <div className="flex flex-wrap items-baseline gap-3">
                    <div className="relative inline-block">
                      <span className="font-display text-[clamp(2rem,6vw,4.5rem)] font-bold tracking-tight text-[var(--ink)] leading-[0.95] group-hover:text-[var(--oxblood)] transition-colors duration-200">
                        {project.name}
                      </span>
                      {/* Underline draws on name hover (200ms transition) */}
                      <span
                        aria-hidden="true"
                        className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--oxblood)] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left ease-out"
                      />
                    </div>

                    {project.isConcept && (
                      <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.14em] text-[var(--oxblood)] border border-[var(--oxblood)]/30 px-2 py-0.5 rounded-none">
                        Concept
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: Tags (if non-empty) & Arrow */}
                <div className="flex items-center justify-between md:justify-end gap-6 pl-12 md:pl-0">
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="font-mono text-[11px] uppercase tracking-wider text-[var(--ink-muted)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <span
                    aria-hidden="true"
                    className="font-mono text-base sm:text-xl text-[var(--ink-muted)] group-hover:text-[var(--oxblood)] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200"
                  >
                    &nearr;
                  </span>
                </div>
              </div>

              {/* Mobile Inline Preview Slot */}
              <div aria-hidden="true" className="md:hidden mt-4 pl-12">
                <div className="w-36 h-24 bg-[var(--paper-deep)] border border-[var(--line)] flex flex-col items-center justify-center">
                  <span className="font-display font-black text-3xl text-[var(--oxblood)]/30">
                    {project.name.charAt(0)}
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--ink-muted)] mt-1">
                    Preview
                  </span>
                </div>
              </div>
            </div>
          );

          return (
            <div
              key={project.id}
              className="group relative"
              onPointerEnter={() => setHoveredIndex(index)}
              onPointerLeave={() => setHoveredIndex(null)}
            >
              {/* 1px hairline drawing in on viewport entry (900ms) */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{
                  duration: prefersReduced ? 0.2 : 0.9,
                  ease: [0.76, 0, 0.24, 1],
                  delay: prefersReduced ? 0 : index * 0.08,
                }}
                className="w-full h-[1px] bg-[var(--line)] origin-left"
              />

              {/* Staggered entrance for row content (80ms per row) */}
              <motion.div
                initial={{ opacity: 0, y: prefersReduced ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{
                  duration: prefersReduced ? 0.2 : 0.7,
                  ease: [0.76, 0, 0.24, 1],
                  delay: prefersReduced ? 0 : index * 0.08,
                }}
              >
                {projectUrl ? (
                  <a
                    href={projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="project"
                    aria-label={`${project.name}${project.isConcept ? ' (Concept)' : ''}`}
                    className="block outline-none focus-visible:ring-2 focus-visible:ring-[var(--oxblood)] focus-visible:ring-offset-4"
                  >
                    {rowContent}
                  </a>
                ) : (
                  <div
                    role="article"
                    data-cursor="project"
                    aria-label={`${project.name}${project.isConcept ? ' (Concept)' : ''}`}
                    className="block cursor-default"
                  >
                    {rowContent}
                  </div>
                )}
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export const ProjectsSection = Projects;
