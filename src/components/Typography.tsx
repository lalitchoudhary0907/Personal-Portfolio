/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

// ============================================================================
// Display Component
// clamp(3rem, 14vw, 13rem), leading 0.9, tracking -0.04em, font-variation-settings wght/wdth
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
      className={`font-display text-[clamp(3rem,14vw,13rem)] leading-[0.9] tracking-[-0.04em] text-ink ${className}`}
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
      className={`font-display text-[clamp(1.85rem,4.5vw,3.5rem)] leading-[0.98] tracking-[-0.03em] text-ink ${className}`}
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
// Bricolage Grotesque, 16-18px (17px), line-height 1.55, max line length 62ch
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
      className={`font-display text-[17px] leading-[1.55] max-w-[62ch] ${
        muted ? 'text-ink-muted' : 'text-ink'
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
// Single accent words only (italic Instrument Serif, oxblood)
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
      className={`font-serif italic font-normal text-oxblood ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

// ============================================================================
// Label Component
// DM Mono, uppercase, 12px, tracking 0.12em
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
      className={`font-mono text-[12px] leading-tight uppercase tracking-[0.12em] ${
        muted ? 'text-ink-muted' : 'text-ink'
      } ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};
