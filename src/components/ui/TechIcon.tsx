/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Code2,
  FileCode,
  FileCode2,
  Atom,
  Layers,
  Palette,
  Layout,
  Server,
  Network,
  Cpu,
  Sparkles,
  TrendingUp,
  Terminal,
  Package,
  GitBranch,
  Github,
  Brain,
  Workflow,
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface TechIconProps {
  name: string;
  className?: string;
}

export const TechIcon: React.FC<TechIconProps> = ({ name, className = 'w-5 h-5' }) => {
  const iconMap: Record<string, React.ReactNode> = {
    Python: <FileCode className={cn('text-amber-500 dark:text-amber-400', className)} />,
    TypeScript: <FileCode2 className={cn('text-blue-500 dark:text-blue-400', className)} />,
    JavaScript: <Code2 className={cn('text-yellow-500 dark:text-yellow-400', className)} />,
    React: <Atom className={cn('text-cyan-500 dark:text-cyan-400', className)} />,
    'Next.js': <Layers className={cn('text-slate-800 dark:text-slate-200', className)} />,
    TailwindCSS: <Palette className={cn('text-cyan-400 dark:text-cyan-300', className)} />,
    HTML5: <Layout className={cn('text-orange-500 dark:text-orange-400', className)} />,
    'Node.js': <Server className={cn('text-emerald-500 dark:text-emerald-400', className)} />,
    Express: <Workflow className={cn('text-slate-600 dark:text-slate-300', className)} />,
    API: <Network className={cn('text-indigo-500 dark:text-indigo-400', className)} />,
    Brain: <Brain className={cn('text-purple-500 dark:text-purple-400', className)} />,
    Sparkles: <Sparkles className={cn('text-cyan-500 dark:text-cyan-400', className)} />,
    TrendingUp: <TrendingUp className={cn('text-amber-500 dark:text-amber-400', className)} />,
    VSCode: <Terminal className={cn('text-blue-500 dark:text-blue-400', className)} />,
    Terminal: <Terminal className={cn('text-emerald-500 dark:text-emerald-400', className)} />,
    Package: <Package className={cn('text-rose-500 dark:text-rose-400', className)} />,
    Git: <GitBranch className={cn('text-orange-500 dark:text-orange-400', className)} />,
    Github: <Github className={cn('text-slate-800 dark:text-slate-200', className)} />,
  };

  return <span className="inline-flex items-center justify-center">{iconMap[name] || <Cpu className={className} />}</span>;
};
