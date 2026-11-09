/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useTheme } from '../context/ThemeContext';

interface Dot {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  glowColor: string;
  phase: number;
  phaseSpeed: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

export const AmbientBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prefersReduced = usePrefersReducedMotion();
  const [isTabVisible, setIsTabVisible] = useState(true);
  const { activePalette } = useTheme();

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabVisible(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates and interaction
    const pointer = {
      x: -1000,
      y: -1000,
      radius: 140,
    };

    const ripples: Ripple[] = [];

    // Dot density scaled to viewport size
    const dotCount = Math.floor(Math.min(130, Math.max(50, (width * height) / 14000)));
    const dots: Dot[] = [];

    const pColor = activePalette.colors.primary;
    const aColor = activePalette.colors.accent;
    const sColor = activePalette.colors.secondary;
    const tColor = activePalette.colors.text;

    const colors = [
      { fill: `${pColor}bb`, glow: `${pColor}66` },
      { fill: `${sColor}aa`, glow: `${sColor}55` },
      { fill: `${tColor}99`, glow: `${tColor}44` },
      { fill: `${aColor}bb`, glow: `${aColor}66` },
    ];

    for (let i = 0; i < dotCount; i++) {
      const palette = colors[Math.floor(Math.random() * colors.length)];
      const x = Math.random() * width;
      const y = Math.random() * height;
      dots.push({
        x,
        y,
        baseX: x,
        baseY: y,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 1.6 + 1.2,
        color: palette.fill,
        glowColor: palette.glow,
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: 0.015 + Math.random() * 0.02,
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    const handlePointerMove = (e: MouseEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    };

    const handlePointerLeave = () => {
      pointer.x = -1000;
      pointer.y = -1000;
    };

    const handleClick = (e: MouseEvent) => {
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        maxRadius: 180,
        alpha: 0.7,
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('mouseleave', handlePointerLeave, { passive: true });
    window.addEventListener('click', handleClick, { passive: true });

    let lastTime = performance.now();

    const render = (time: number) => {
      if (!isTabVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Render ripples
      for (let r = ripples.length - 1; r >= 0; r--) {
        const rip = ripples[r];
        rip.radius += 3.5;
        rip.alpha *= 0.94;

        ctx.save();
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
        ctx.strokeStyle = pColor;
        ctx.globalAlpha = Math.max(0, rip.alpha * 0.45);
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();

        if (rip.alpha < 0.02 || rip.radius > rip.maxRadius) {
          ripples.splice(r, 1);
        }
      }

      // Update and draw dots
      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];

        if (!prefersReduced) {
          // Fluid harmonic drift
          dot.phase += dot.phaseSpeed;
          dot.x += dot.vx + Math.cos(dot.phase) * 0.25;
          dot.y += dot.vy + Math.sin(dot.phase) * 0.25;

          // Wrap around canvas boundaries fluidly
          if (dot.x < -20) dot.x = width + 20;
          if (dot.x > width + 20) dot.x = -20;
          if (dot.y < -20) dot.y = height + 20;
          if (dot.y > height + 20) dot.y = -20;

          // Pointer fluid repulsion & elastic spring
          const dx = pointer.x - dot.x;
          const dy = pointer.y - dot.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < pointer.radius && dist > 0) {
            const force = (pointer.radius - dist) / pointer.radius;
            const angle = Math.atan2(dy, dx);
            dot.x -= Math.cos(angle) * force * 3.5;
            dot.y -= Math.sin(angle) * force * 3.5;
          }

          // Ripples push dots
          for (const rip of ripples) {
            const rdx = dot.x - rip.x;
            const rdy = dot.y - rip.y;
            const rdist = Math.sqrt(rdx * rdx + rdy * rdy);
            if (Math.abs(rdist - rip.radius) < 25) {
              const push = (25 - Math.abs(rdist - rip.radius)) * 0.08 * rip.alpha;
              const rAngle = Math.atan2(rdy, rdx);
              dot.x += Math.cos(rAngle) * push;
              dot.y += Math.sin(rAngle) * push;
            }
          }
        }

        // Draw Dot with subtle glow
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fillStyle = dot.color;
        ctx.shadowColor = dot.glowColor;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }

      // Draw dynamic connecting filaments between close dots
      const maxConnDist = 110;
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnDist) {
            const alpha = (1 - dist / maxConnDist) * 0.22;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.strokeStyle = pColor;
            ctx.globalAlpha = Math.max(0, alpha);
            ctx.lineWidth = 0.75;
            ctx.stroke();
            ctx.restore();
          }
        }

        // Connect nearby dots to pointer if close
        if (pointer.x > 0) {
          const pdx = dots[i].x - pointer.x;
          const pdy = dots[i].y - pointer.y;
          const pdist = Math.sqrt(pdx * pdx + pdy * pdy);
          if (pdist < pointer.radius) {
            const pAlpha = (1 - pdist / pointer.radius) * 0.35;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(pointer.x, pointer.y);
            ctx.strokeStyle = aColor;
            ctx.globalAlpha = Math.max(0, pAlpha);
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      if (!prefersReduced) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseleave', handlePointerLeave);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isTabVisible, prefersReduced, activePalette]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden select-none bg-[var(--paper)] transition-colors duration-700"
    >
      {/* 1. Subtle Cyber Grid Hairlines */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* 2. Floating Fluid Chromatic Glow Orbs with dynamic palette colors */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none transition-all duration-700">
        {/* Primary Fluid Orb (Top Left -> Center) */}
        <div
          className="absolute -top-[15%] -left-[10%] w-[58vw] h-[58vw] rounded-full blur-[130px] animate-fluid-orb-1 transition-all duration-700"
          style={{
            background: `radial-gradient(circle, ${activePalette.colors.primary}25 0%, ${activePalette.colors.secondary}15 45%, transparent 70%)`,
          }}
        />

        {/* Accent / Secondary Fluid Orb (Bottom Right -> Center) */}
        <div
          className="absolute -bottom-[20%] -right-[10%] w-[62vw] h-[62vw] rounded-full blur-[140px] animate-fluid-orb-2 transition-all duration-700"
          style={{
            background: `radial-gradient(circle, ${activePalette.colors.accent}22 0%, ${activePalette.colors.primary}12 45%, transparent 70%)`,
          }}
        />

        {/* Subtle Accent Core Glow (Center Accent) */}
        <div
          className="absolute top-[40%] left-[30%] w-[40vw] h-[40vw] rounded-full blur-[160px] animate-pulse transition-all duration-700"
          style={{
            background: `radial-gradient(circle, ${activePalette.colors.accent}14 0%, transparent 65%)`,
          }}
        />
      </div>

      {/* 3. High-Performance Interactive Fluid Dot & Filament Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
    </div>
  );
};
