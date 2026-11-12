/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { portfolioData } from '../data/portfolio';
import { Heading, SerifAccent, Kicker } from './Typography';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useMagnetic } from '../hooks/useMagnetic';
import { useProjectWebGL } from '../context/ProjectWebGLContext';

interface ProjectCardProps {
  project: (typeof portfolioData.projects)[0];
  index: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const prefersReduced = usePrefersReducedMotion();
  const cardRef = useRef<HTMLElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const { registerProjectPortal, setPortalHover, setPortalPointer, isWebGLActive } = useProjectWebGL();

  const isFocusFlow = project.id === 'proj-focusflow';
  const isConcept = Boolean(project.isConcept);
  const effectType = isFocusFlow ? 0.0 : 1.0;

  // 3D Perspective Tilt Physics for Card Stage
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 220, damping: 26, mass: 0.8 });
  const springY = useSpring(mouseY, { stiffness: 220, damping: 26, mass: 0.8 });

  const rotateX = useTransform(springY, [-1, 1], [3, -3]);
  const rotateY = useTransform(springX, [-1, 1], [-3, 3]);

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

  // Register DOM portal with the WebGL Project Manager
  useEffect(() => {
    if (!portalRef.current) return;
    const unregister = registerProjectPortal(project.id, portalRef.current, effectType);
    return () => unregister();
  }, [project.id, effectType, registerProjectPortal]);

  const handlePortalPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!portalRef.current) return;
    const rect = portalRef.current.getBoundingClientRect();
    const uvX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const uvY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    setPortalPointer(project.id, uvX, uvY);
  };

  const handlePortalPointerEnter = () => {
    setIsHovered(true);
    setPortalHover(project.id, true);
  };

  const handlePortalPointerLeave = () => {
    setIsHovered(false);
    setPortalHover(project.id, false);
  };

  const handleCardPointerMove = (e: React.PointerEvent<HTMLElement>) => {
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

  const handleCardPointerLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Alternating editorial layout: Project 01 is Left visual / Right details; Project 02 is Left details / Right visual
  const isAlternate = index % 2 === 1;

  return (
    <motion.article
      ref={cardRef}
      initial={{
        opacity: 0,
        y: prefersReduced ? 0 : 40,
        clipPath: prefersReduced ? 'none' : 'inset(5% 0% 5% 0%)',
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        clipPath: 'inset(0% 0% 0% 0%)',
      }}
      viewport={{ once: true, margin: '-6%' }}
      transition={{
        duration: prefersReduced ? 0.2 : 0.85,
        ease: [0.76, 0, 0.24, 1],
        delay: prefersReduced ? 0 : index * 0.15,
      }}
      onPointerMove={handleCardPointerMove}
      onPointerLeave={handleCardPointerLeave}
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
      className="group relative p-6 sm:p-10 lg:p-12 rounded-3xl border border-[var(--border-bright)] bg-[var(--paper-deep)]/85 hover:border-[var(--primary)]/70 transition-[border-color,background-color,box-shadow] duration-500 shadow-2xl overflow-hidden"
    >
      {/* Pointer-Reactive Responsive Surface Lighting */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0"
        style={{
          background: `radial-gradient(460px circle at var(--mouse-x, -500px) var(--mouse-y, -500px), var(--primary-glow) 0%, transparent 80%)`,
        }}
      />

      {/* Case Study Meta Strip */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-[var(--line)]">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm font-bold text-[var(--primary)]">
            0{index + 1}
          </span>
          <span className="w-6 h-[1px] bg-[var(--line)]" />
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--secondary)] font-semibold">
            {project.category}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              isConcept ? 'bg-[var(--secondary)]' : 'bg-[var(--accent)] animate-pulse'
            }`}
          />
          <span
            className={`font-mono text-[11px] uppercase tracking-wider font-semibold ${
              isConcept ? 'text-[var(--secondary)]' : 'text-[var(--accent)]'
            }`}
          >
            {project.statusBadge}
          </span>
        </div>
      </div>

      {/* Main Grid: Asymmetrical Layout */}
      <div
        className={`relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center ${
          isAlternate ? 'lg:grid-flow-dense' : ''
        }`}
      >
        {/* Visual Stage Column (Cols 1-7 or Cols 6-12) */}
        <div className={`lg:col-span-7 ${isAlternate ? 'lg:col-start-6' : ''}`}>
          {/* Synchronized WebGL / DOM Portal Stage */}
          <div
            ref={portalRef}
            onPointerMove={handlePortalPointerMove}
            onPointerEnter={handlePortalPointerEnter}
            onPointerLeave={handlePortalPointerLeave}
            data-cursor="project"
            data-cursor-label={isFocusFlow ? 'LAUNCH' : 'EXPLORE'}
            className="group/portal relative w-full h-[320px] sm:h-[420px] lg:h-[460px] rounded-2xl border border-[var(--border-bright)] bg-[var(--paper)]/70 overflow-hidden shadow-xl transition-all duration-500 group-hover:border-[var(--primary)]/60 cursor-pointer"
          >
            {/* Top Telemetry Overlay */}
            <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between p-4 border-b border-[var(--line)] bg-[var(--paper-deep)]/80 backdrop-blur-md font-mono text-[10px] uppercase tracking-wider text-[var(--secondary)]">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
                <span>
                  {isWebGLActive ? 'WEBGL SHADER PIPELINE' : 'UI ARCHITECTURE PREVIEW'}
                </span>
              </span>
              <span className="text-[var(--accent)] font-semibold">
                {isFocusFlow ? 'FOCUSFLOW · VERIFIED APP' : 'CONCEPT SPEC · UNDER PROGRESS'}
              </span>
            </div>

            {/* DOM Fallback & Ambient Layer (Visually rich when WebGL is inactive or loading) */}
            <div
              className={`absolute inset-0 flex flex-col items-center justify-center p-6 text-center transition-opacity duration-500 ${
                isWebGLActive ? 'opacity-0 hover:opacity-10' : 'opacity-100'
              }`}
            >
              {isFocusFlow ? (
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" className="stroke-[var(--line)] fill-none" strokeWidth="3" />
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        className="stroke-[var(--primary)] fill-none transition-all duration-700"
                        strokeWidth="3.5"
                        strokeDasharray="264"
                        strokeDashoffset={isHovered ? '66' : '110'}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
                      <span className="text-2xl font-bold text-[var(--ink)]">25:00</span>
                      <span className="text-[8px] uppercase tracking-widest text-[var(--primary)] font-semibold">
                        DEEP WORK
                      </span>
                    </div>
                  </div>
                  <div className="font-mono text-xs text-[var(--secondary)]">
                    <span>Illustrative 25-Min Cycle</span>
                    <span className="mx-2">·</span>
                    <span className="text-[var(--accent)]">LocalStorage Persistence</span>
                  </div>
                </div>
              ) : (
                <div className="w-full max-w-sm p-4 rounded-xl border border-dashed border-[var(--border-accent)] bg-[var(--accent)]/5 font-mono text-xs space-y-3">
                  <div className="flex justify-between text-[11px] text-[var(--accent)] pb-2 border-b border-[var(--line)]">
                    <span>VASTRAGO CAD BLUEPRINT</span>
                    <span className="text-[var(--secondary)]">SPEC v0.9</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-left text-[10px]">
                    <div>
                      <span className="text-[var(--ink-muted)] block">Sample Shoulder</span>
                      <span className="font-bold text-[var(--ink)]">46.5 CM (EX)</span>
                    </div>
                    <div>
                      <span className="text-[var(--ink-muted)] block">Sample Chest Arc</span>
                      <span className="font-bold text-[var(--ink)]">98.0 CM (EX)</span>
                    </div>
                  </div>
                  <div className="text-[9px] text-[var(--ink-muted)] pt-2 border-t border-[var(--line)]">
                    Artisan Matching Protocol &amp; Parametric Fit Concept
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Interaction Cue Bar */}
            <div className="absolute bottom-0 inset-x-0 z-20 flex items-center justify-between px-4 py-2.5 border-t border-[var(--line)] bg-[var(--paper-deep)]/80 backdrop-blur-md font-mono text-[9px] uppercase tracking-wider text-[var(--ink-muted)]">
              <span>{isFocusFlow ? 'Shader: Dot-Matrix UV Wave' : 'Shader: Parametric Contour Mesh'}</span>
              <span className="text-[var(--primary)] font-bold">
                {isFocusFlow ? 'HOVER TO DISPLACE' : 'HOVER TO SCAN'}
              </span>
            </div>
          </div>
        </div>

        {/* Narrative & Case Study Details (Cols 8-12 or Cols 1-5) */}
        <div className={`lg:col-span-5 space-y-6 ${isAlternate ? 'lg:col-start-1' : ''}`}>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--primary)] font-bold block mb-1">
              Case Study Monograph
            </span>
            <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--ink)] group-hover:text-[var(--primary)] transition-colors leading-[1.08]">
              {project.title}
            </h3>
            <p className="font-mono text-xs sm:text-sm text-[var(--secondary)] mt-2 font-medium">
              {project.tagline}
            </p>
          </div>

          {/* Deep Architectural Narrative */}
          <p className="font-display text-sm sm:text-base text-[var(--ink)]/85 leading-relaxed">
            {project.description}
          </p>

          {/* Architectural Highlights */}
          {project.highlights && project.highlights.length > 0 && (
            <div className="space-y-2.5 pt-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--ink-muted)] font-semibold block">
                Engineering Highlights
              </span>
              <ul className="space-y-2 font-display text-xs sm:text-sm text-[var(--ink-muted)]">
                {project.highlights.map((highlight, hIdx) => (
                  <li key={hIdx} className="flex items-start gap-2.5">
                    <span className="text-[var(--primary)] font-bold text-xs mt-0.5 select-none">✦</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Technical Specifications Table */}
          <div className="p-4 rounded-xl border border-[var(--line)] bg-[var(--paper)]/50 font-mono text-xs space-y-2">
            <div className="flex justify-between items-center text-[10px] uppercase tracking-wider text-[var(--ink-muted)] pb-1.5 border-b border-[var(--line)]">
              <span>Technical Dimension</span>
              <span>Specification</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-[var(--ink-muted)]">Role:</span>
              <span className="font-medium text-[var(--ink)]">{project.role}</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-[var(--ink-muted)]">Stack:</span>
              <span className="font-medium text-[var(--secondary)]">
                {project.tags.slice(0, 3).join(' · ')}
              </span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-[var(--ink-muted)]">Status:</span>
              <span className="font-medium text-[var(--accent)]">{project.statusBadge}</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap gap-3 pt-2">
            {project.liveUrl && (
              <motion.a
                ref={liveBtnMagnetic.ref}
                style={liveBtnMagnetic.style}
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="link"
                data-cursor-label="LAUNCH"
                className="flex-1 min-w-[140px] min-h-[44px] flex items-center justify-between px-5 py-3 rounded-xl bg-[var(--primary)] text-[var(--paper)] font-mono text-xs uppercase tracking-wider font-semibold transition-all hover:opacity-95 active:scale-95 shadow-[0_0_20px_var(--primary-glow)] cursor-pointer"
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
                className="flex-1 min-w-[140px] min-h-[44px] flex items-center justify-between px-5 py-3 rounded-xl border border-[var(--border-bright)] hover:border-[var(--primary)] bg-[var(--paper)] text-[var(--ink)] font-mono text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                <span>Source Code</span>
                <span aria-hidden="true">↗</span>
              </motion.a>
            )}

            {isConcept && (
              <div className="w-full p-3.5 rounded-xl border border-[var(--border-accent)] bg-[var(--accent)]/5 font-mono text-xs text-[var(--accent)]">
                <span className="block font-semibold mb-0.5">Architectural Status</span>
                <span className="text-[11px] text-[var(--ink-muted)]">
                  Active prototype model and system specification under development.
                </span>
              </div>
            )}
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
      className="relative w-full py-[14vh] px-6 sm:px-10 max-w-7xl mx-auto border-t border-[var(--line)]"
    >
      {/* Section Header */}
      <div className="mb-16 sm:mb-24">
        <Kicker index="01" title="WORK" meta="ENGINEERED ARTIFACTS & CASE STUDIES" className="mb-4" />
        <Heading id="projects-heading">
          Selected <SerifAccent>Architectures &amp; Works</SerifAccent>
        </Heading>
      </div>

      {/* Editorial Projects Asymmetrical Layout */}
      <div className="space-y-20 sm:space-y-32">
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </section>
  );
};

export const ProjectsSection = Projects;
