/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ProjectEntry {
  id: string;
  name: string;
  isConcept?: boolean;
  statusLabel?: string;
  description: string;
  links: {
    github: string;
    live: string;
  };
  tags: string[];
}

export const projects: ProjectEntry[] = [
  {
    id: 'focusflow',
    name: 'FocusFlow',
    isConcept: false,
    description:
      'A modern, responsive Pomodoro timer web app featuring customizable focus sessions, productivity tracking, smooth animations, and persistent local storage.',
    links: {
      github: 'https://github.com/lalitchoudhary0907/FocusFlow',
      live: 'https://focus-flow-eta-six.vercel.app',
    },
    tags: ['JavaScript', 'HTML5', 'CSS3', 'Productivity'],
  },
  {
    id: 'vastrago',
    name: 'VastraGo',
    isConcept: true,
    statusLabel: 'under progress',
    description:
      'An intelligent fashion and bespoke tailoring platform concept bridging personalized apparel recommendations with local artisanal tailoring.',
    links: {
      github: '',
      live: '',
    },
    tags: ['AI', 'Fashion Tech', 'Marketplace Concept'],
  },
];
