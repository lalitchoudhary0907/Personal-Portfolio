/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useVelocity, useSpring, useTransform } from 'motion/react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

const SKILLS_TEXT = 'PYTHON ✦ SOFTWARE ENGINEERING ✦ ARTIFICIAL INTELLIGENCE ✦ WEB DEVELOPMENT ✦ OPEN SOURCE ✦ GIT & GITHUB ✦ ';

// Repeat unit to ensure continuous seamless loop across large viewports
const REPEATED_TEXT = Array(4).fill(SKILLS_TEXT).join('');

export const StripsBand: React.FC = () => {
  const prefersReduced = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [isInViewport, setIsInViewport] = useState(true);
  const [isTabVisible, setIsTabVisible] = useState(true);

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  
  // Damped scroll velocity spring
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 45,
    stiffness: 280,
  });

  // Skew up to 2deg proportional to scroll velocity, clamped (transform only)
  const skewX = useTransform(smoothVelocity, [-1600, 0, 1600], [-2, 0, 2], {
    clamp: true,
  });

  // Performance: Pause marquee animations when offscreen or when tab is hidden
  useEffect(() => {
    const handleVisibility = () => {
      setIsTabVisible(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibility);

    let observer: IntersectionObserver | null = null;
    if (sectionRef.current && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        ([entry]) => {
          setIsInViewport(entry.isIntersecting);
        },
        { rootMargin: '100px 0px' }
      );
      observer.observe(sectionRef.current);
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      observer?.disconnect();
    };
  }, []);

  const shouldAnimate = isInViewport && isTabVisible && !prefersReduced;
  const marqueeStyle: React.CSSProperties = {
    animationPlayState: shouldAnimate ? 'running' : 'paused',
  };

  return (
    <section
      ref={sectionRef}
      aria-label="Core Competencies"
      className="relative w-full overflow-x-clip overflow-y-visible py-10 sm:py-14 select-none"
    >
      {/* Screen-reader accessible summary of skills */}
      <p className="sr-only">
        Core Competencies: Python, Software Engineering, Artificial Intelligence, Web Development, Open Source, Git and GitHub.
      </p>

      {/* Outer container with damped scroll-velocity skew (transform only) */}
      <motion.div
        style={{
          skewX: prefersReduced ? 0 : skewX,
        }}
        className="relative w-full flex flex-col items-center justify-center"
      >
        {/* Strip 1: Oxblood, Paper text, -2deg rotation */}
        <div
          data-cursor="on-dark"
          aria-hidden="true"
          className="group relative z-10 w-[114vw] -ml-[7vw] -rotate-2 bg-[var(--oxblood)] text-[var(--paper)] py-2 sm:py-2.5 border-y border-[var(--paper)]/25 overflow-hidden flex items-center cursor-default"
        >
          <div
            style={marqueeStyle}
            className="flex w-max whitespace-nowrap animate-strip-forward group-hover:[animation-play-state:paused]"
          >
            <span className="font-mono text-[13px] uppercase tracking-[0.14em] font-normal px-2">
              {REPEATED_TEXT}
            </span>
            <span className="font-mono text-[13px] uppercase tracking-[0.14em] font-normal px-2">
              {REPEATED_TEXT}
            </span>
          </div>
        </div>

        {/* Strip 2: Ink, Paper text, +1.5deg rotation, crossing Strip 1 */}
        <div
          data-cursor="on-dark"
          aria-hidden="true"
          className="group relative z-20 w-[114vw] -ml-[7vw] rotate-[1.5deg] -mt-3.5 sm:-mt-4 bg-[var(--ink)] text-[var(--paper)] py-2 sm:py-2.5 border-y border-[var(--paper)]/20 overflow-hidden flex items-center cursor-default"
        >
          <div
            style={marqueeStyle}
            className="flex w-max whitespace-nowrap animate-strip-backward group-hover:[animation-play-state:paused]"
          >
            <span className="font-mono text-[13px] uppercase tracking-[0.14em] font-normal px-2">
              {REPEATED_TEXT}
            </span>
            <span className="font-mono text-[13px] uppercase tracking-[0.14em] font-normal px-2">
              {REPEATED_TEXT}
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
