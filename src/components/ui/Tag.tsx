/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { cn } from '../../lib/utils';

export interface TechTagProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: 'cyan' | 'blue' | 'violet' | 'neutral';
}

export const TechTag: React.FC<TechTagProps> = ({
  children,
  variant = 'cyan',
  className,
  ...props
}) => {
  const variantStyles = {
    cyan: 'bg-cyan-950/40 text-cyan-300 border-cyan-800/40 dark:bg-cyan-950/50 dark:text-cyan-300 dark:border-cyan-800/50',
    blue: 'bg-blue-950/40 text-blue-300 border-blue-800/40 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800/50',
    violet: 'bg-violet-950/40 text-violet-300 border-violet-800/40 dark:bg-violet-950/50 dark:text-violet-300 dark:border-violet-800/50',
    neutral: 'bg-slate-900/60 text-slate-300 border-slate-700/60 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700/60',
  }[variant];

  return (
    <span
      className={cn(
        'inline-flex items-center text-xs font-mono px-2.5 py-0.5 rounded-md border tracking-tight select-none whitespace-nowrap shrink-0 transition-colors',
        variantStyles,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
