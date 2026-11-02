/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  glow?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      children,
      icon,
      iconPosition = 'left',
      glow = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070b14] disabled:opacity-40 disabled:pointer-events-none whitespace-nowrap shrink-0 cursor-pointer select-none active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100';

    const variantStyles = {
      primary:
        'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white font-semibold shadow-md hover:from-blue-500 hover:via-indigo-500 hover:to-cyan-400 active:from-blue-700 active:to-cyan-600 border border-cyan-400/30',
      secondary:
        'bg-[#0f172a] text-slate-100 hover:bg-[#162238] active:bg-[#0c1424] border border-white/[0.08] shadow-xs',
      outline:
        'border border-slate-700 hover:border-cyan-400/60 bg-transparent text-slate-200 hover:text-white hover:bg-cyan-500/[0.06] active:bg-cyan-500/[0.12]',
      ghost:
        'text-slate-300 hover:text-white hover:bg-white/[0.06] active:bg-white/[0.1]',
      glass:
        'glass-panel text-slate-100 hover:border-cyan-400/40 hover:bg-white/[0.08] shadow-sm',
    }[variant];

    const sizeStyles = {
      sm: 'text-xs px-3 py-1.5 gap-1.5',
      md: 'text-sm px-4 py-2 gap-2',
      lg: 'text-base px-5 py-2.5 gap-2.5',
    }[size];

    const glowStyle =
      glow && variant === 'primary'
        ? 'shadow-[0_0_20px_rgba(6,182,212,0.35)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)]'
        : '';

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(baseStyles, variantStyles, sizeStyles, glowStyle, className)}
        {...props}
      >
        {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
        <span>{children}</span>
        {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
