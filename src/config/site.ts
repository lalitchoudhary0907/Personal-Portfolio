/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SiteConfig } from '../types';
import { portfolioData } from '../data/portfolio';

/**
 * Derives the canonical site URL dynamically from environment variables,
 * browser origin, or production default.
 */
export const getSiteUrl = (): string => {
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SITE_URL && typeof import.meta.env.VITE_SITE_URL === 'string') {
    const trimmed = import.meta.env.VITE_SITE_URL.trim();
    if (trimmed && !trimmed.includes('placeholder') && !trimmed.includes('example.com')) {
      return trimmed.replace(/\/$/, '');
    }
  }
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_APP_URL && typeof import.meta.env.VITE_APP_URL === 'string') {
    const trimmed = import.meta.env.VITE_APP_URL.trim();
    if (trimmed) {
      return trimmed.replace(/\/$/, '');
    }
  }
  if (typeof window !== 'undefined' && window.location?.origin && window.location.origin !== 'null') {
    return window.location.origin;
  }
  // VITE_SITE_URL is optional until production domain is finalized.
  // Avoid placeholder or fake domains.
  return '';
};

export const siteConfig: SiteConfig = {
  name: portfolioData.personalInfo.fullName,
  title: `${portfolioData.personalInfo.fullName} | CS & AI Student & Aspiring Software Engineer`,
  description: `Portfolio of ${portfolioData.personalInfo.fullName} — B.Tech Computer Science & AI student at Newton School of Technology (Rishihood University). Exploring software systems, AI tooling, and quantitative modeling.`,
  url: getSiteUrl(),
  profile: {
    name: portfolioData.personalInfo.fullName,
    tagline: 'Building intelligent software systems at the intersection of AI, robust architecture, and delightful craft.',
    role: portfolioData.personalInfo.role,
    university: `${portfolioData.education[0].institution}, ${portfolioData.education[0].university}`,
    degree: `${portfolioData.education[0].degree} in ${portfolioData.education[0].fieldOfStudy}`,
    location: portfolioData.personalInfo.location,
    availability: 'Open for Summer Internships & Technical Collaborations',
    bioShort: portfolioData.personalInfo.summary,
  },
  navItems: [
    { title: 'Home', href: '#home' },
    { title: 'About', href: '#about' },
    { title: 'Skills', href: '#skills' },
    { title: 'Projects', href: '#projects' },
    { title: 'GitHub', href: '#github' },
    { title: 'Achievements', href: '#achievements' },
    { title: 'Contact', href: '#contact' },
  ],
  socialLinks: [
    portfolioData.personalInfo.socials.github,
    portfolioData.personalInfo.socials.linkedin,
    {
      name: 'Email',
      url: `mailto:${portfolioData.personalInfo.email}`,
      iconName: 'mail',
      verified: true,
    },
  ],
};
