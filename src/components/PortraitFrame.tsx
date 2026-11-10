/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface PortraitFrameProps {
  className?: string;
  size?: 'hero' | 'about';
  priority?: boolean;
}

export const PortraitFrame: React.FC<PortraitFrameProps> = ({
  className = '',
  size = 'hero',
  priority = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = usePrefersReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  // Pointer position normalized to [-1, 1] relative to center
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs with gentle physical decay
  const springX = useSpring(mouseX, { stiffness: 180, damping: 26 });
  const springY = useSpring(mouseY, { stiffness: 180, damping: 26 });

  // 3D perspective tilt calculations (subtle: -4deg to +4deg)
  const rotateX = useTransform(springY, [-1, 1], [4, -4]);
  const rotateY = useTransform(springX, [-1, 1], [-4, 4]);

  // Optical light highlight coordinates (0% to 100%)
  const lightX = useTransform(springX, [-1, 1], [15, 85]);
  const lightY = useTransform(springY, [-1, 1], [15, 85]);

  // Image internal parallax translation (subtle: -8px to +8px)
  const imageTranslateX = useTransform(springX, [-1, 1], [-6, 6]);
  const imageTranslateY = useTransform(springY, [-1, 1], [-6, 6]);

  useEffect(() => {
    if (prefersReduced) return;
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!isFinePointer) return;

    const el = containerRef.current;
    if (!el) return;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      mouseX.set(Math.max(-1, Math.min(1, x)));
      mouseY.set(Math.max(-1, Math.min(1, y)));
    };

    const handlePointerLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
      setIsHovered(false);
    };

    const handlePointerEnter = () => {
      setIsHovered(true);
    };

    el.addEventListener('pointermove', handlePointerMove, { passive: true });
    el.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    el.addEventListener('pointerenter', handlePointerEnter, { passive: true });

    return () => {
      el.removeEventListener('pointermove', handlePointerMove);
      el.removeEventListener('pointerleave', handlePointerLeave);
      el.removeEventListener('pointerenter', handlePointerEnter);
    };
  }, [prefersReduced, mouseX, mouseY]);

  return (
    <motion.div
      ref={containerRef}
      style={{
        perspective: 1000,
      }}
      className={`relative select-none ${className}`}
    >
      <motion.div
        style={
          prefersReduced
            ? {}
            : {
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
              }
        }
        className="relative group w-full h-full"
      >
        {/* Ambient Photographic Rim Light / Back Glow */}
        <motion.div
          aria-hidden="true"
          className="absolute -inset-2 rounded-2xl opacity-60 blur-2xl transition-all duration-700 pointer-events-none -z-10"
          style={{
            background: isHovered
              ? 'radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)'
              : 'radial-gradient(circle, var(--primary-glow) 0%, transparent 60%)',
          }}
        />

        {/* Architectural Mask Container with Chamfered Corners */}
        <div
          className="relative w-full h-full overflow-hidden rounded-2xl border border-[var(--border-bright)] group-hover:border-[var(--primary)]/70 bg-[var(--paper-deep)] transition-colors duration-500 shadow-2xl"
          style={{
            // Premium editorial mask with subtle bevel corners
            clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
          }}
        >
          {/* Subtle Fine Grid Texture Behind Subject */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.08] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)`,
              backgroundSize: '24px 24px',
            }}
          />

          {/* Authentic Real Portrait Image with Responsive WebP Sources */}
          <motion.div
            style={
              prefersReduced
                ? {}
                : {
                    x: imageTranslateX,
                    y: imageTranslateY,
                    scale: isHovered ? 1.03 : 1,
                  }
            }
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="relative w-full h-full flex items-center justify-center overflow-hidden"
          >
            <picture className="w-full h-full block">
              <source
                type="image/webp"
                srcSet="/assets/aistudio/lalit-portrait-400.webp 400w, /assets/aistudio/lalit-portrait-800.webp 800w"
                sizes="(max-width: 640px) 180px, (max-width: 1024px) 240px, 320px"
              />
              <img
                src="/assets/aistudio/Confident_Circular_Professional_Headshot_6cb6bd6e.png"
                alt="Lalit Choudhary — Computer Science & AI student at Newton School of Technology (Rishihood University)"
                width={800}
                height={800}
                loading={priority ? 'eager' : 'lazy'}
                fetchPriority={priority ? 'high' : 'auto'}
                decoding="async"
                className="w-full h-full object-cover object-center filter contrast-[1.02] brightness-[0.98] transition-all duration-700"
              />
            </picture>
          </motion.div>

          {/* Dynamic Follower Photographic Key Light (Pointer Responsive) */}
          {!prefersReduced && (
            <motion.div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none mix-blend-soft-light transition-opacity duration-300"
              style={{
                background: useTransform(
                  [lightX, lightY],
                  ([x, y]) =>
                    `radial-gradient(circle 260px at ${x}% ${y}%, rgba(255, 255, 255, 0.35) 0%, transparent 80%)`
                ),
                opacity: isHovered ? 1 : 0.45,
              }}
            />
          )}

          {/* Vignette / Film Grain Depth Overlay */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[var(--paper-deep)]/90 via-transparent to-black/30"
          />

          {/* Top Corner Architectural Index Chamfer Notch */}
          <div
            aria-hidden="true"
            className="absolute top-0 right-0 w-4 h-4 border-b border-l border-[var(--primary)]/60 bg-[var(--paper)]"
          />

          {/* Bottom Left Corner Micro Coordinate Badge (Hero Large View only) */}
          {size === 'hero' && (
            <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between font-mono text-[9px] uppercase tracking-widest text-[var(--ink)]/80 backdrop-blur-md bg-[var(--paper-deep)]/80 px-2 py-1 border border-white/10 rounded-sm">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
                <span>AUTHENTIC PORTRAIT</span>
              </span>
              <span className="text-[var(--secondary)]">LC // NST.CSAI</span>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
