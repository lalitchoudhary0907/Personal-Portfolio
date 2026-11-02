/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'interactive' | 'elevated';
  glowingEdge?: 'none' | 'cyan' | 'blue' | 'violet';
  children: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = 'default',
      glowingEdge = 'none',
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'rounded-2xl transition-all duration-200 relative overflow-hidden';

    const variantStyles = {
      default:
        'bg-white dark:bg-[#0c1424]/90 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-white/[0.08] shadow-sm',
      glass:
        'glass-panel text-slate-900 dark:text-slate-100 shadow-md',
      interactive:
        'glass-panel text-slate-900 dark:text-slate-100 hover:border-cyan-500/40 hover:bg-slate-50 dark:hover:bg-[#121c32]/80 hover:shadow-lg dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.35)] hover:-translate-y-0.5 cursor-pointer',
      elevated:
        'glass-panel-elevated text-slate-900 dark:text-slate-100 shadow-xl',
    }[variant];

    const glowStyles = {
      none: '',
      cyan: 'before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-cyan-400 before:to-transparent',
      blue: 'before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-blue-500 before:to-transparent',
      violet: 'before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-violet-500 before:to-transparent',
    }[glowingEdge];

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variantStyles, glowStyles, className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div className={cn('p-6 pb-3 space-y-1.5', className)} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  children,
  ...props
}) => (
  <h3
    className={cn(
      'text-lg font-bold tracking-tight text-slate-900 dark:text-white',
      className
    )}
    {...props}
  >
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  children,
  ...props
}) => (
  <p
    className={cn(
      'text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed',
      className
    )}
    {...props}
  >
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div className={cn('p-6 pt-0', className)} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div
    className={cn(
      'p-6 pt-3 border-t border-slate-200/80 dark:border-white/[0.06] flex items-center justify-between text-xs text-slate-500 dark:text-slate-400',
      className
    )}
    {...props}
  >
    {children}
  </div>
);
