/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { cn } from '../../lib/utils';

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  gradient?: boolean;
}

export const DisplayHeading: React.FC<HeadingProps> = ({
  children,
  gradient = false,
  className,
  ...props
}) => {
  return (
    <h1
      className={cn(
        'text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.12] text-balance',
        gradient ? 'text-gradient-cyan-blue' : 'text-slate-900 dark:text-white',
        className
      )}
      {...props}
    >
      {children}
    </h1>
  );
};

export const SectionHeading: React.FC<HeadingProps> = ({
  children,
  gradient = false,
  className,
  ...props
}) => {
  return (
    <h2
      className={cn(
        'text-2xl sm:text-3xl font-bold tracking-tight text-balance',
        gradient ? 'text-gradient-cyan-blue' : 'text-slate-900 dark:text-white',
        className
      )}
      {...props}
    >
      {children}
    </h2>
  );
};

interface KickerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Kicker: React.FC<KickerProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-cyan-600 dark:text-cyan-400 select-none',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
