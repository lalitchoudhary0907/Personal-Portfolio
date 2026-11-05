/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { useReveal } from '../hooks/useReveal';

export type RevealVariant = 'rise' | 'draw' | 'image' | 'fade';

export interface RevealProps {
  children?: React.ReactNode;
  variant?: RevealVariant;
  className?: string;
  delay?: number;
  splitWords?: boolean;
  as?: React.ElementType;
}

const EASE_FOLIO = [0.76, 0, 0.24, 1] as const;

export const Reveal: React.FC<RevealProps> = ({
  children,
  variant = 'rise',
  className = '',
  delay = 0,
  splitWords = false,
  as: Component = 'div',
}) => {
  const { ref, isInView, prefersReduced } = useReveal({ once: true, margin: '-10%' });

  // Reduced motion: 200ms opacity fade for all variants
  if (prefersReduced) {
    return (
      <Component ref={ref} className={className}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut', delay }}
        >
          {children}
        </motion.div>
      </Component>
    );
  }

  // Draw variant: scaleX 0 -> 1, origin left, 900ms
  if (variant === 'draw') {
    return (
      <div ref={ref} className={`overflow-hidden ${className}`}>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.9, ease: EASE_FOLIO, delay }}
          className="w-full h-full origin-left bg-current"
        />
      </div>
    );
  }

  // Image reveal: clip-path inset(100% 0 0 0) -> inset(0)
  if (variant === 'image') {
    return (
      <div ref={ref} className={`overflow-hidden ${className}`}>
        <motion.div
          initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
          animate={isInView ? { clipPath: 'inset(0% 0% 0% 0%)' } : { clipPath: 'inset(100% 0% 0% 0%)' }}
          transition={{ duration: 0.9, ease: EASE_FOLIO, delay }}
          className="w-full h-full"
        >
          {children}
        </motion.div>
      </div>
    );
  }

  // Rise variant with word splitting for headings
  if (splitWords && typeof children === 'string') {
    const words = children.split(' ');
    return (
      <Component ref={ref} className={className}>
        <span className="inline-block">
          {words.map((word, i) => (
            <span key={i} className="inline-block overflow-hidden mr-[0.25em] last:mr-0 align-top">
              <motion.span
                initial={{ y: '110%' }}
                animate={isInView ? { y: '0%' } : { y: '110%' }}
                transition={{
                  duration: 0.8,
                  ease: EASE_FOLIO,
                  delay: delay + i * 0.06,
                }}
                className="inline-block"
              >
                {word}
              </motion.span>
            </span>
          ))}
        </span>
      </Component>
    );
  }

  // Block rise through mask (body paragraphs and containers)
  return (
    <Component ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: '110%' }}
        animate={isInView ? { y: '0%' } : { y: '110%' }}
        transition={{ duration: 0.8, ease: EASE_FOLIO, delay }}
      >
        {children}
      </motion.div>
    </Component>
  );
};

/**
 * Section label counter (e.g. "01 / WORK")
 * Draws the rule line then fades in the text.
 */
export const SectionLabelCounter: React.FC<{
  label: string;
  className?: string;
  lineColor?: string;
}> = ({ label, className = '', lineColor = 'bg-[var(--line)]' }) => {
  const { ref, isInView, prefersReduced } = useReveal({ once: true, margin: '-10%' });

  if (prefersReduced) {
    return (
      <div ref={ref} className={`flex items-center gap-4 ${className}`}>
        <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--ink-muted)]">
          {label}
        </span>
        <div className={`flex-1 h-[1px] ${lineColor}`} />
      </div>
    );
  }

  return (
    <div ref={ref} className={`flex items-center gap-4 ${className}`}>
      {/* Rule line draws first (900ms) */}
      <div className="w-10 sm:w-16 h-[1px] overflow-hidden">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.9, ease: EASE_FOLIO }}
          className={`w-full h-full origin-left ${lineColor}`}
        />
      </div>

      {/* Label text fades in after rule starts drawing */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.25 }}
        className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--ink-muted)]"
      >
        {label}
      </motion.span>
    </div>
  );
};
