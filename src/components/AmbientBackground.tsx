/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

// Static SVG Noise Data URI (opacity 0.06, zero animation)
const NOISE_BG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`;

export const AmbientBackground: React.FC = () => {
  const prefersReduced = usePrefersReducedMotion();
  const parallaxRef = useRef<HTMLDivElement>(null);
  const [isTabVisible, setIsTabVisible] = useState(true);

  // Monitor visibility to pause calculations when tab is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabVisible(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Parallax Layer: Scroll (factor ~0.08) and pointer (up to 12px desktop)
  useEffect(() => {
    if (prefersReduced || !isTabVisible) return;

    let rafId: number;
    let scrollY = window.scrollY;
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    let currentScroll = 0;

    const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDesktop) return;
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      mouseX = ((e.clientX - halfW) / halfW) * 12;
      mouseY = ((e.clientY - halfH) / halfH) * 12;
    };

    const updateLoop = () => {
      // Smooth interpolation for pointer and scroll
      currentX += (mouseX - currentX) * 0.05;
      currentY += (mouseY - currentY) * 0.05;
      currentScroll += (scrollY * 0.08 - currentScroll) * 0.08;

      if (parallaxRef.current) {
        parallaxRef.current.style.transform = `translate3d(${currentX.toFixed(2)}px, ${(-currentScroll + currentY).toFixed(2)}px, 0)`;
      }

      rafId = requestAnimationFrame(updateLoop);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    if (isDesktop) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }
    rafId = requestAnimationFrame(updateLoop);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (isDesktop) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      cancelAnimationFrame(rafId);
    };
  }, [prefersReduced, isTabVisible]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden select-none"
    >
      {/* 1. Static Grain Overlay (0.06 opacity, static, non-animated) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{ backgroundImage: NOISE_BG }}
      />

      {/* 2. Layer 1: Very Slow Geometric Drift & Rotation (90s linear loop) */}
      <div
        className={`absolute inset-0 ${
          prefersReduced || !isTabVisible ? '' : 'animate-ambient-spin'
        }`}
        style={{ willChange: prefersReduced || !isTabVisible ? 'auto' : 'transform' }}
      >
        {/* Shape 1: Outlined circle (top-right) */}
        <svg
          className="absolute top-[8%] right-[10%] w-72 h-72 opacity-[0.14]"
          viewBox="0 0 288 288"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="144" cy="144" r="143" stroke="#6B1522" strokeWidth="1" />
        </svg>

        {/* Shape 2: Quarter circle arc (middle-left) */}
        <svg
          className="absolute top-[38%] -left-12 w-64 h-64 opacity-[0.14]"
          viewBox="0 0 256 256"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M 0 0 A 240 240 0 0 1 240 240" stroke="#6B1522" strokeWidth="1" />
        </svg>

        {/* Shape 5: Subtle dashed geometric boundary (bottom-right) */}
        <svg
          className="absolute bottom-[12%] right-[15%] w-48 h-48 opacity-[0.12]"
          viewBox="0 0 192 192"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="96" cy="96" r="95" stroke="#6B1522" strokeWidth="1" strokeDasharray="6 6" />
        </svg>
      </div>

      {/* 3. Layer 2: Parallax Layer (Scroll depth 0.08 + pointer 12px) */}
      <div
        ref={parallaxRef}
        className="absolute inset-0"
        style={{ willChange: prefersReduced || !isTabVisible ? 'auto' : 'transform' }}
      >
        {/* Shape 3: Geometric plus mark (center right) */}
        <svg
          className="absolute top-[48%] right-[22%] w-8 h-8 opacity-[0.18]"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M 16 0 L 16 32 M 0 16 L 32 16" stroke="#6B1522" strokeWidth="1" />
        </svg>

        {/* Shape 4: Short diagonal hairline (lower left) */}
        <svg
          className="absolute bottom-[28%] left-[12%] w-40 h-24 opacity-[0.14]"
          viewBox="0 0 160 96"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line x1="0" y1="96" x2="160" y2="0" stroke="#6B1522" strokeWidth="1" />
        </svg>
      </div>
    </div>
  );
};
