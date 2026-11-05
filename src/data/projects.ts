/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ProjectEntry {
  id: string;
  name: string;
  isConcept?: boolean;
  description: string;
  links: {
    github: string;
    live: string;
  };
  tags: string[];
}

export const projects: ProjectEntry[] = [
  {
    id: 'docdrift',
    name: 'DocDrift',
    isConcept: false,
    description: '',
    links: {
      github: '',
      live: '',
    },
    tags: [],
  },
  {
    id: 'corealert',
    name: 'CoreAlert',
    isConcept: false,
    description: '',
    links: {
      github: '',
      live: '',
    },
    tags: [],
  },
  {
    id: 'stitchai',
    name: 'StitchAI',
    isConcept: true,
    description: '',
    links: {
      github: '',
      live: '',
    },
    tags: [],
  },
];
