/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

// ============================================================================
// Display Component
// Fluid clamp(2.75rem, 11vw, 10.5rem), leading 0.9, tracking -0.04em
// ============================================================================
export interface DisplayProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: React.ElementType;
  weight?: number;
  width?: number;
}

export const Display: React.FC<DisplayProps> = ({
  as: Component = 'h1',
  weight = 750,
  width = 95,
  className = '',
  style,
  children,
  ...props
}) => {
  return (
    <Component
      className={`font-display text-[clamp(2.75rem,10.5vw,10rem)] leading-[0.9] tracking-[-0.04em] text-[var(--ink)] ${className}`}
      style={{
        fontVariationSettings: `'wght' ${weight}, 'wdth' ${width}, 'opsz' 96`,
        ...style,
      }}
      {...props}
    >
      {children}
    </Component>
  );
};

// ============================================================================
// Heading Component
// Bricolage Grotesque, tight leading, slight negative tracking
// ============================================================================
export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: React.ElementType;
  weight?: number;
  width?: number;
}

export const Heading: React.FC<HeadingProps> = ({
  as: Component = 'h2',
  weight = 700,
  width = 95,
  className = '',
  style,
  children,
  ...props
}) => {
  return (
    <Component
      className={`font-display text-[clamp(1.85rem,4.2vw,3.6rem)] leading-[0.98] tracking-[-0.03em] text-[var(--ink)] ${className}`}
      style={{
        fontVariationSettings: `'wght' ${weight}, 'wdth' ${width}, 'opsz' 48`,
        ...style,
      }}
      {...props}
    >
      {children}
    </Component>
  );
};

// ============================================================================
// Body Component
// Bricolage Grotesque, 16-18px (17px), line-height 1.6, max line length 65ch
// ============================================================================
export interface BodyProps extends React.HTMLAttributes<HTMLParagraphElement> {
  as?: React.ElementType;
  muted?: boolean;
}

export const Body: React.FC<BodyProps> = ({
  as: Component = 'p',
  muted = false,
  className = '',
  style,
  children,
  ...props
}) => {
  return (
    <Component
      className={`font-display text-[16px] sm:text-[17px] leading-[1.6] max-w-[65ch] ${
        muted ? 'text-[var(--ink-muted)]' : 'text-[var(--ink)]'
      } ${className}`}
      style={{
        fontVariationSettings: `'wght' 400, 'wdth' 100, 'opsz' 16`,
        ...style,
      }}
      {...props}
    >
      {children}
    </Component>
  );
};

// ============================================================================
// SerifAccent Component
// Single accent words only (italic Instrument Serif, dynamic primary color)
// ============================================================================
export interface SerifAccentProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
}

export const SerifAccent: React.FC<SerifAccentProps> = ({
  as: Component = 'span',
  className = '',
  children,
  ...props
}) => {
  return (
    <Component
      className={`font-serif italic font-normal text-[var(--primary)] transition-colors duration-500 ${className}`}
      style={{ fontFeatureSettings: '"swsh" 1' }}
      {...props}
    >
      {children}
    </Component>
  );
};

// ============================================================================
// Label Component
// DM Mono, uppercase, 11-12px, tracking 0.14em
// ============================================================================
export interface LabelProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  muted?: boolean;
}

export const Label: React.FC<LabelProps> = ({
  as: Component = 'span',
  muted = false,
  className = '',
  children,
  ...props
}) => {
  return (
    <Component
      className={`font-mono text-[11px] sm:text-[12px] leading-tight uppercase tracking-[0.14em] ${
        muted ? 'text-[var(--ink-muted)]' : 'text-[var(--ink)]'
      } ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

// ============================================================================
// Kicker / Section Indicator Component
// Clean editorial numbering & kicker without mechanical comment clutter
// ============================================================================
export interface KickerProps extends React.HTMLAttributes<HTMLDivElement> {
  index: string;
  title: string;
  meta?: string;
}

export const Kicker: React.FC<KickerProps> = ({
  index,
  title,
  meta,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--ink-muted)] ${className}`}
      {...props}
    >
      <span className="text-[var(--primary)] font-semibold">{index}</span>
      <span className="w-4 h-[1px] bg-[var(--line)]" aria-hidden="true" />
      <span>{title}</span>
      {meta && (
        <>
          <span className="text-[var(--ink-muted)]/40" aria-hidden="true">·</span>
          <span className="text-[var(--ink-muted)]/70">{meta}</span>
        </>
      )}
    </div>
  );
};

// ============================================================================
// EditorialNumber Component
// Oversized, elegant hairline section index
// ============================================================================
export interface EditorialNumberProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

export const EditorialNumber: React.FC<EditorialNumberProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <span
      className={`font-mono text-[clamp(2.5rem,5.5vw,4.5rem)] font-light leading-none tracking-tight text-[var(--primary)]/35 select-none ${className}`}
      aria-hidden="true"
      {...props}
    >
      {children}
    </span>
  );
};
