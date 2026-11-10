/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { portfolioData } from '../data/portfolio';
import { Heading, SerifAccent, Kicker } from './Typography';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useMagnetic } from '../hooks/useMagnetic';

interface ProjectCardProps {
  project: (typeof portfolioData.projects)[0];
  index: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const prefersReduced = usePrefersReducedMotion();
  const cardRef = useRef<HTMLElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const isFocusFlow = project.id === 'proj-focusflow';
  const isConcept = Boolean(project.isConcept);

  // 3D Perspective Tilt Physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 220, damping: 26, mass: 0.8 });
  const springY = useSpring(mouseY, { stiffness: 220, damping: 26, mass: 0.8 });

  const rotateX = useTransform(springY, [-1, 1], [3.5, -3.5]);
  const rotateY = useTransform(springX, [-1, 1], [-3.5, 3.5]);

  // Magnetic Action Buttons
  const liveBtnMagnetic = useMagnetic<HTMLAnchorElement>({
    radius: 70,
    pullFactor: 0.25,
    maxOffset: 7,
  });

  const repoBtnMagnetic = useMagnetic<HTMLAnchorElement>({
    radius: 70,
    pullFactor: 0.22,
    maxOffset: 6,
  });

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (prefersReduced || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    // Hardware accelerated pointer lighting
    cardRef.current.style.setProperty('--mouse-x', `${px}px`);
    cardRef.current.style.setProperty('--mouse-y', `${py}px`);

    const nx = (px / rect.width) * 2 - 1;
    const ny = (py / rect.height) * 2 - 1;
    mouseX.set(Math.max(-1, Math.min(1, nx)));
    mouseY.set(Math.max(-1, Math.min(1, ny)));
  };

  const handlePointerEnter = () => {
    setIsHovered(true);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.article
      ref={cardRef}
      initial={{
        opacity: 0,
        y: prefersReduced ? 0 : 35,
        clipPath: prefersReduced ? 'none' : 'inset(6% 0% 6% 0%)',
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        clipPath: 'inset(0% 0% 0% 0%)',
      }}
      viewport={{ once: true, margin: '-8%' }}
      transition={{
        duration: prefersReduced ? 0.2 : 0.85,
        ease: [0.76, 0, 0.24, 1],
        delay: prefersReduced ? 0 : index * 0.12,
      }}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      data-cursor="project"
      data-cursor-label={isFocusFlow ? 'LAUNCH' : 'EXPLORE'}
      style={
        prefersReduced
          ? {}
          : {
              rotateX,
              rotateY,
              transformStyle: 'preserve-3d',
              perspective: 1200,
            }
      }
      className="group relative p-7 sm:p-11 rounded-3xl border border-[var(--border-bright)] bg-[var(--paper-deep)]/80 hover:border-[var(--primary)]/70 transition-[border-color,background-color,box-shadow] duration-500 shadow-xl overflow-hidden"
    >
      {/* Pointer-Reactive Responsive Surface Lighting */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0"
        style={{
          background: `radial-gradient(420px circle at var(--mouse-x, -500px) var(--mouse-y, -500px), var(--primary-glow) 0%, transparent 80%)`,
        }}
      />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column (Cols 1-7): Metadata, Narrative, Architecture */}
        <div className="lg:col-span-7 space-y-6">
          {/* Top Meta Line: Editorial Number & Status */}
          <div className="flex items-center justify-between pb-4 border-b border-[var(--line)]">
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--secondary)] font-semibold flex items-center gap-2">
              <span className="text-[var(--primary)] font-bold text-sm">0{index + 1}</span>
              <span className="w-4 h-[1px] bg-[var(--line)]" />
              <span>{project.category}</span>
            </span>

            <span
              className={`font-mono text-[11px] uppercase tracking-wider font-medium flex items-center gap-1.5 ${
                isConcept ? 'text-[var(--secondary)]' : 'text-[var(--accent)]'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              <span>{project.statusBadge}</span>
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

          {/* Key Architectural Highlights */}
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

          {/* Clean Typographic Tech Stack */}
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

        {/* Right Column (Cols 8-12): Interactive Visual Preview & Magnetic Actions */}
        <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-6 lg:border-l lg:border-[var(--line)] lg:pl-8">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--ink-muted)] block mb-1">
              Role
            </span>
            <p className="font-mono text-xs font-medium text-[var(--ink)]">
              {project.role}
            </p>
          </div>

          {/* Interactive Architectural Preview Window */}
          <div
            className="w-full rounded-2xl border border-[var(--border-bright)] bg-[var(--paper)]/60 p-4 backdrop-blur-md transition-transform duration-500 ease-out group-hover:scale-[1.02] group-hover:shadow-lg relative overflow-hidden"
            style={{
              transform: prefersReduced ? 'none' : isHovered ? 'translateZ(18px)' : 'translateZ(0px)',
            }}
          >
            {/* Header Telemetry */}
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)] font-mono text-[9px] uppercase tracking-wider text-[var(--secondary)]">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
                <span>{isFocusFlow ? 'LIVE TELEMETRY' : 'SYSTEM BLUEPRINT'}</span>
              </span>
              <span className="text-[var(--accent)] font-semibold">
                {isFocusFlow ? 'v2.1 PROD' : 'ARCH SPEC'}
              </span>
            </div>

            {/* Dynamic Interactive Body */}
            {isFocusFlow ? (
              <div className="py-6 flex flex-col items-center justify-center text-center space-y-3">
                {/* Simulated Pomodoro Timer Arc */}
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      className="stroke-[var(--line)] fill-none"
                      strokeWidth="4"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      className="stroke-[var(--primary)] fill-none transition-all duration-700"
                      strokeWidth="4"
                      strokeDasharray="264"
                      strokeDashoffset={isHovered ? '66' : '110'}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
                    <span className="text-sm font-bold text-[var(--ink)] tracking-tight">25:00</span>
                    <span className="text-[7px] uppercase tracking-widest text-[var(--secondary)]">FOCUS</span>
                  </div>
                </div>

                <div className="font-mono text-[10px] text-[var(--ink-muted)]">
                  <span>Cycle 01/04</span>
                  <span className="mx-1 text-[var(--ink-muted)]/40">·</span>
                  <span className="text-[var(--accent)]">Storage Synced</span>
                </div>
              </div>
            ) : (
              <div className="py-6 flex flex-col items-center justify-center text-center space-y-3">
                {/* Conceptual Parametric Tailoring Nodes */}
                <div className="relative w-full h-24 rounded-lg border border-dashed border-[var(--border-accent)] bg-[var(--accent)]/5 flex items-center justify-around px-4 font-mono text-[9px] text-[var(--accent)]">
                  <div className="space-y-1">
                    <span className="block text-[8px] text-[var(--ink-muted)] uppercase">Shoulder</span>
                    <span className="font-bold">46.5 CM</span>
                  </div>
                  <div className="w-[1px] h-8 bg-[var(--line)]" />
                  <div className="space-y-1">
                    <span className="block text-[8px] text-[var(--ink-muted)] uppercase">Chest Arc</span>
                    <span className="font-bold">98.0 CM</span>
                  </div>
                  <div className="w-[1px] h-8 bg-[var(--line)]" />
                  <div className="space-y-1">
                    <span className="block text-[8px] text-[var(--ink-muted)] uppercase">Artisan Link</span>
                    <span className="font-bold text-[var(--primary)]">VERIFIED</span>
                  </div>
                </div>

                <div className="font-mono text-[10px] text-[var(--ink-muted)]">
                  <span>Parametric CAD Pipeline</span>
                  <span className="mx-1 text-[var(--ink-muted)]/40">·</span>
                  <span className="text-[var(--secondary)]">Marketplace Architecture</span>
                </div>
              </div>
            )}
          </div>

          {/* Magnetic Action Buttons */}
          <div className="space-y-3 pt-2">
            {project.liveUrl && (
              <motion.a
                ref={liveBtnMagnetic.ref}
                style={liveBtnMagnetic.style}
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="link"
                data-cursor-label="LAUNCH"
                className="w-full min-h-[44px] flex items-center justify-between px-5 py-3 rounded-xl bg-[var(--primary)] text-[var(--paper)] font-mono text-xs uppercase tracking-wider font-semibold transition-all hover:opacity-95 active:scale-95 shadow-[0_0_20px_var(--primary-glow)] cursor-pointer"
              >
                <span>Launch Live App</span>
                <span aria-hidden="true">↗</span>
              </motion.a>
            )}

            {project.repoUrl && (
              <motion.a
                ref={repoBtnMagnetic.ref}
                style={repoBtnMagnetic.style}
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="link"
                data-cursor-label="CODE"
                className="w-full min-h-[44px] flex items-center justify-between px-5 py-3 rounded-xl border border-[var(--border-bright)] hover:border-[var(--primary)] bg-[var(--paper)] text-[var(--ink)] font-mono text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                <span>Source Code</span>
                <span aria-hidden="true">↗</span>
              </motion.a>
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
};

export const Projects: React.FC = () => {
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
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </section>
  );
};

export const ProjectsSection = Projects;
