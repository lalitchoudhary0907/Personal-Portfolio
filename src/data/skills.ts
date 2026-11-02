/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SkillItem, SkillCategory } from '../types';

export const SKILL_CATEGORIES: SkillCategory[] = [
  'All',
  'Programming',
  'Frontend Development',
  'Backend Development',
  'AI/ML Tools',
  'Developer Tools',
  'Version Control',
];

/**
 * Centralized, editable skills data for Lalit Choudhary.
 * 
 * Strict Data Governance:
 * - Only includes technologies confirmed by Lalit's coursework, projects, or brief.
 * - No fabricated proficiency percentages, mastery meters, or arbitrary star ratings.
 * - Concise, recruiter-friendly descriptions of practical application.
 */
export const skillsData: SkillItem[] = [
  // 1. Programming
  {
    id: 'skill-python',
    name: 'Python',
    category: 'Programming',
    description: 'Primary language for AI workflows, algorithmic challenge modeling, and backend tooling.',
    iconName: 'Python',
    isConfirmed: true,
    highlight: true,
  },
  {
    id: 'skill-typescript',
    name: 'TypeScript',
    category: 'Programming',
    description: 'Type-safe software development, strict interface contracts, and robust full-stack codebases.',
    iconName: 'TypeScript',
    isConfirmed: true,
    highlight: true,
  },
  {
    id: 'skill-javascript',
    name: 'JavaScript (ES6+)',
    category: 'Programming',
    description: 'Modern asynchronous workflows, event-driven programming, and core web platform standards.',
    iconName: 'JavaScript',
    isConfirmed: true,
  },

  // 2. Frontend Development
  {
    id: 'skill-react',
    name: 'React',
    category: 'Frontend Development',
    description: 'Component architecture, custom hooks, reactive state management, and accessible UI engineering.',
    iconName: 'React',
    isConfirmed: true,
    highlight: true,
  },
  {
    id: 'skill-nextjs',
    name: 'Next.js App Router',
    category: 'Frontend Development',
    description: 'Server components by default, nested layouts, client boundaries, and modern frontend routing.',
    iconName: 'Next.js',
    isConfirmed: true,
    highlight: true,
  },
  {
    id: 'skill-tailwind',
    name: 'Tailwind CSS',
    category: 'Frontend Development',
    description: 'Design token architecture, responsive utility styling, glassmorphism, and dark-first theming.',
    iconName: 'TailwindCSS',
    isConfirmed: true,
  },
  {
    id: 'skill-html-css',
    name: 'HTML5 & Modern CSS',
    category: 'Frontend Development',
    description: 'Accessible semantic markup, responsive flex/grid layouts, and WCAG AA contrast compliance.',
    iconName: 'HTML5',
    isConfirmed: true,
  },

  // 3. Backend Development
  {
    id: 'skill-nodejs',
    name: 'Node.js',
    category: 'Backend Development',
    description: 'Server-side runtime for building developer command-line tools and backend services.',
    iconName: 'Node.js',
    isConfirmed: true,
  },
  {
    id: 'skill-express',
    name: 'Express.js',
    category: 'Backend Development',
    description: 'RESTful API routing, middleware chaining, and client-server integration.',
    iconName: 'Express',
    isConfirmed: true,
  },
  {
    id: 'skill-rest-apis',
    name: 'RESTful APIs',
    category: 'Backend Development',
    description: 'Designing structured HTTP endpoints, JSON payload schemas, and robust error handling.',
    iconName: 'API',
    isConfirmed: true,
  },

  // 4. AI/ML Tools
  {
    id: 'skill-ml-foundations',
    name: 'Machine Learning Foundations',
    category: 'AI/ML Tools',
    description: 'Core ML algorithms, data preprocessing, and applied intelligence for software automation.',
    iconName: 'Brain',
    isConfirmed: true,
    highlight: true,
  },
  {
    id: 'skill-ai-dev-tools',
    name: 'AI Developer Tooling',
    category: 'AI/ML Tools',
    description: 'Applying intelligent models for automated documentation drift detection and productivity tools.',
    iconName: 'Sparkles',
    isConfirmed: true,
    highlight: true,
  },
  {
    id: 'skill-quant-modeling',
    name: 'Quant & Algorithmic Modeling',
    category: 'AI/ML Tools',
    description: 'Mathematical research and alpha construction (WorldQuant Challenge Gold Level achiever).',
    iconName: 'TrendingUp',
    isConfirmed: true,
    highlight: true,
  },

  // 5. Developer Tools
  {
    id: 'skill-vscode',
    name: 'VS Code',
    category: 'Developer Tools',
    description: 'Primary code editor with configured linting, debugging, and productivity extensions.',
    iconName: 'VSCode',
    isConfirmed: true,
  },
  {
    id: 'skill-linux-bash',
    name: 'Linux / Bash CLI',
    category: 'Developer Tools',
    description: 'Command-line execution, shell automation scripts, and package management.',
    iconName: 'Terminal',
    isConfirmed: true,
  },
  {
    id: 'skill-npm-vite',
    name: 'Node Toolchain & Vite',
    category: 'Developer Tools',
    description: 'Package management, development servers, and production build pipelines.',
    iconName: 'Package',
    isConfirmed: true,
  },

  // 6. Version Control
  {
    id: 'skill-git',
    name: 'Git',
    category: 'Version Control',
    description: 'Branching workflows, atomic commit history, conflict resolution, and versioning discipline.',
    iconName: 'Git',
    isConfirmed: true,
    highlight: true,
  },
  {
    id: 'skill-github',
    name: 'GitHub & Open Source',
    category: 'Version Control',
    description: 'Pull request reviews, remote repository management, and open-source collaboration (Hacktoberfest).',
    iconName: 'Github',
    isConfirmed: true,
    highlight: true,
  },
];
